import { CATEGORIES } from "./types.ts";
import type {
  BinState,
  Category,
  Entry,
  EntryState,
  InstallOutcome,
  ItemState,
  PickerGroup,
  SweepDeps,
  SweepResult,
} from "./types.ts";

export const BIN_PREFIX = "bin:";

const CATEGORY_TITLES: Record<Category, string> = {
  cli: "CLI tools",
  app: "Applications",
  font: "Fonts",
  config: "Config files",
  system: "System",
};

function assertValidManifest(manifest: Entry[]): void {
  const seen = new Set<string>();

  for (const entry of manifest) {
    if (!CATEGORIES.includes(entry.category)) {
      throw new Error(`Entry "${entry.name}" has invalid category "${entry.category}"`);
    }
    if (seen.has(entry.name)) {
      throw new Error(`Duplicate Entry name: "${entry.name}"`);
    }
    seen.add(entry.name);
  }

  for (const entry of manifest) {
    for (const required of entry.requires ?? []) {
      if (!seen.has(required)) {
        throw new Error(`Entry "${entry.name}" requires unknown Entry "${required}"`);
      }
    }
  }
}

async function checkEntries(manifest: Entry[], deps: SweepDeps): Promise<EntryState[]> {
  return Promise.all(
    manifest.map(async (entry): Promise<EntryState> => {
      const { ok } = await deps.exec(`{ ${entry.check} ; } >/dev/null 2>&1`);
      return {
        kind: "entry",
        name: entry.name,
        category: entry.category,
        status: ok ? "satisfied" : "missing",
        entry,
      };
    }),
  );
}

async function scanBins(deps: SweepDeps): Promise<BinState[]> {
  const files = await deps.listDir(deps.binDir);

  return Promise.all(
    files.map(async (file): Promise<BinState> => {
      const source = `${deps.binDir}/${file}`;
      const target = `${deps.binTargetDir}/${file}`;
      const same = await deps.diffFile(source, target);
      return {
        kind: "bin",
        name: file,
        status: same ? "satisfied" : "drifted",
        source,
        target,
      };
    }),
  );
}

export function buildGroups(states: ItemState[]): PickerGroup[] {
  const groups: PickerGroup[] = [];

  for (const category of CATEGORIES) {
    const options = states
      .filter((state) => state.kind === "entry" && state.category === category)
      .map((state) => ({
        value: state.name,
        label: state.name,
        hint: state.status === "satisfied" ? "installed" : "missing",
      }));

    if (options.length > 0) {
      groups.push({ title: CATEGORY_TITLES[category], options });
    }
  }

  const binOptions = states
    .filter((state) => state.kind === "bin")
    .map((state) => ({
      value: `${BIN_PREFIX}${state.name}`,
      label: state.name,
      hint: state.status === "satisfied" ? "in sync" : "drifted",
    }));

  if (binOptions.length > 0) {
    groups.push({ title: "Bin scripts", options: binOptions });
  }

  return groups;
}

function withRequirements(
  selected: string[],
  states: ItemState[],
): { ordered: string[]; added: string[] } {
  const byName = new Map(
    states.flatMap((state) => (state.kind === "entry" ? [[state.name, state] as const] : [])),
  );

  const ordered: string[] = [];
  const added: string[] = [];
  const visiting = new Set<string>();
  const done = new Set<string>();

  function visit(name: string): void {
    if (done.has(name)) return;
    if (visiting.has(name)) {
      throw new Error(`Circular "requires" chain detected at "${name}"`);
    }

    visiting.add(name);

    const state = byName.get(name);

    for (const required of state?.entry.requires ?? []) {
      const requiredState = byName.get(required);
      const needsInstall = requiredState?.status !== "satisfied" || selected.includes(required);

      if (!needsInstall) continue;
      if (!selected.includes(required) && !added.includes(required)) added.push(required);
      visit(required);
    }

    visiting.delete(name);
    done.add(name);
    ordered.push(name);
  }

  for (const name of selected) {
    visit(name);
  }

  return { ordered, added };
}

function stepsOf(install: string | string[]): string[] {
  return Array.isArray(install) ? install : [install];
}

async function installOne(
  name: string,
  states: ItemState[],
  deps: SweepDeps,
): Promise<InstallOutcome> {
  const state = states.find(
    (candidate) =>
      (candidate.kind === "entry" && candidate.name === name) ||
      (candidate.kind === "bin" && `${BIN_PREFIX}${candidate.name}` === name),
  );

  if (!state) {
    return { name, ok: false, reason: "unknown item" };
  }

  deps.report?.({ type: "installing", name: state.name });

  if (state.kind === "bin") {
    const commands = [
      `mkdir -p ${JSON.stringify(deps.binTargetDir)}`,
      `cp ${JSON.stringify(state.source)} ${JSON.stringify(state.target)}`,
      `chmod +x ${JSON.stringify(state.target)}`,
    ];

    for (const command of commands) {
      const { ok } = await deps.exec(command);
      if (!ok) return { name: state.name, ok: false, reason: `failed: ${command}` };
    }

    return { name: state.name, ok: true };
  }

  for (const step of stepsOf(state.entry.install)) {
    const { ok } = await deps.exec(step);
    if (!ok) {
      return {
        name: state.name,
        ok: false,
        reason: `failed: ${step}`,
        manualStepsRef: state.entry.manualStepsRef,
      };
    }
  }

  return { name: state.name, ok: true, manualStepsRef: state.entry.manualStepsRef };
}

export async function sweep(manifest: Entry[], deps: SweepDeps): Promise<SweepResult> {
  assertValidManifest(manifest);

  const [entryStates, binStates] = await Promise.all([checkEntries(manifest, deps), scanBins(deps)]);
  const states: ItemState[] = [...entryStates, ...binStates];

  deps.report?.({ type: "checked", states });

  const picked = await deps.prompt(buildGroups(states));

  if (picked.length === 0) {
    deps.report?.({ type: "nothing-selected" });
    return { states, selected: [], outcomes: [], manualSteps: [] };
  }

  const { ordered } = withRequirements(picked, states);
  const outcomes: InstallOutcome[] = [];
  const failed = new Set<string>();

  for (const name of ordered) {
    const state = states.find((candidate) => candidate.kind === "entry" && candidate.name === name);
    const blocking = (state?.kind === "entry" ? (state.entry.requires ?? []) : []).filter((required) =>
      failed.has(required),
    );

    if (blocking.length > 0) {
      const outcome: InstallOutcome = {
        name,
        ok: false,
        reason: `skipped: requires ${blocking.join(", ")}`,
      };
      failed.add(name);
      outcomes.push(outcome);
      deps.report?.({ type: "installed", outcome });
      continue;
    }

    const outcome = await installOne(name, states, deps);
    if (!outcome.ok) failed.add(outcome.name);
    outcomes.push(outcome);
    deps.report?.({ type: "installed", outcome });
  }

  const manualSteps = [
    ...new Set(
      outcomes
        .filter((outcome) => outcome.ok)
        .map((outcome) => outcome.manualStepsRef)
        .filter((ref): ref is string => Boolean(ref)),
    ),
  ];

  return { states, selected: ordered, outcomes, manualSteps };
}
