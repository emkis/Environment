import { log, note } from "@clack/prompts";
import { CATEGORIES } from "./types.ts";
import type { Category, ItemState, SweepResult } from "./types.ts";

const CATEGORY_TITLES: Record<Category, string> = {
  cli: "CLI tools",
  app: "Applications",
  font: "Fonts",
  config: "Config files",
  system: "System",
};

const MARKS = {
  satisfied: "✔",
  missing: "✘",
  drifted: "↻",
} as const;

function line(state: ItemState): string {
  return `${MARKS[state.status]} ${state.name}`;
}

export function renderStates(states: ItemState[]): void {
  for (const category of CATEGORIES) {
    const inCategory = states.filter(
      (state) => state.kind === "entry" && state.category === category,
    );
    if (inCategory.length === 0) continue;
    note(inCategory.map(line).join("\n"), CATEGORY_TITLES[category]);
  }

  const bins = states.filter((state) => state.kind === "bin");
  if (bins.length > 0) {
    note(bins.map(line).join("\n"), "Bin scripts");
  }

  const pending = states.filter((state) => state.status !== "satisfied");
  log.info(`${pending.length} of ${states.length} items need attention`);
}

export function renderSummary(result: SweepResult): void {
  const installed = result.outcomes.filter((outcome) => outcome.ok && !outcome.skipped);
  const skipped = result.outcomes.filter((outcome) => outcome.skipped);
  const failed = result.outcomes.filter((outcome) => !outcome.ok);

  if (installed.length > 0) {
    log.success(`Installed or resynced: ${installed.map((outcome) => outcome.name).join(", ")}`);
  }

  for (const outcome of skipped) {
    log.warn(`Skipped ${outcome.name}: ${outcome.reason ?? "not installed"}`);
  }

  for (const outcome of failed) {
    log.error(`${outcome.name}: ${outcome.reason ?? "failed"}`);
  }

  if (result.manualSteps.length > 0) {
    note(result.manualSteps.join("\n"), "Manual steps still needed");
  }
}
