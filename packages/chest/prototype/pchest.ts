#!/usr/bin/env bun
/**
 * Prototype-only. Explores Sweep presentation layouts against @clack/prompts.
 * No real checks, no real installs — fixtures.ts fakes 59 items (48 Entries
 * across cli/app/font/system, 7 Config scan pairs, 4 Bin scan pairs) with 13
 * pending and 2 check-failed (a Check that errors instead of running clean).
 * Also explores Bootstrap — chest's own first-run requirements step, one-time
 * and Setup-only, no-prompt on the happy path. Sync only checks presence.
 * Run: bun packages/chest/prototype/pchest.ts [--layout=<setup|sync>] [--bootstrap=<happy|unhappy>]
 *
 * These are the two layouts that survived a round of manual review against
 * clack's real constraints (no custom footer text, no back-navigation
 * primitive, Escape/Ctrl+C are indistinguishable). Rejected alternatives, for
 * reference: a flat ~50-item single screen (too tall), a "Back" pseudo-option
 * inside a groupMultiselect (looked like a real action, wasn't), and a
 * sequential category walkthrough with no way to revisit an earlier Category.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  cancel,
  confirm,
  groupMultiselect,
  intro,
  isCancel,
  log,
  multiselect,
  outro,
  select,
  spinner,
  tasks,
} from "@clack/prompts";
import { CATEGORIES, CATEGORY_TITLES, fakeBootstrapItems, fakeStates } from "./fixtures.ts";
import type { BootstrapItem, BootstrapMode, ItemState } from "./fixtures.ts";

const pExecFile = promisify(execFile);

const DONE = "__done__";
const CANCEL = "__cancel__";
const BIN_GROUP = "bin";

function keyOf(state: ItemState): string {
  return state.kind === "entry" ? state.name : `${state.kind}:${state.name}`;
}

// Hint inside Setup's per-category screen: what state is this item actually
// in (Sync groups by status instead, so it has its own hint — groupHint).
function statusHint(state: ItemState): string | undefined {
  if (state.status === "satisfied") return "installed";
  if (state.status === "out-of-sync") return "out of sync";
  if (state.status === "check-failed") return "check failed";
  return undefined; // missing — selectable, nothing more to say
}

interface Group {
  key: string;
  title: string;
  items: ItemState[];
}

// --- Remote sync indicator: best-effort, never blocks or fails hard. If git
// isn't reachable (offline, no upstream, etc.) we just show "unknown".

type RepoSyncStatus = "in-sync" | "out-of-sync" | "unknown";

async function git(args: string[], timeout: number): Promise<string | null> {
  try {
    const { stdout } = await pExecFile("git", args, { timeout });
    return stdout.trim();
  } catch {
    return null;
  }
}

async function remoteSyncStatus(): Promise<{ status: RepoSyncStatus; branch: string }> {
  const symbolic = await git(["symbolic-ref", "--short", "refs/remotes/origin/HEAD"], 2000);
  const branch = symbolic?.replace(/^origin\//, "") ?? "main";
  // refs/remotes/origin/<branch>, not refs/heads/<branch> — the remote-tracking
  // ref is our last-fetched snapshot of origin and exists regardless of which
  // branch is currently checked out. A local branch named <branch> may not
  // even exist (e.g. we're on a feature branch that never touched main).
  const trackedSha = await git(["rev-parse", `refs/remotes/origin/${branch}`], 2000);
  const remoteLine = await git(["ls-remote", "origin", branch], 4000);
  const remoteSha = remoteLine?.split(/\s+/)[0];

  if (!trackedSha || !remoteSha) return { status: "unknown", branch };
  return { status: trackedSha === remoteSha ? "in-sync" : "out-of-sync", branch };
}

function syncMessage({ status, branch }: { status: RepoSyncStatus; branch: string }): string {
  if (status === "in-sync") return `Up to date with origin/${branch}`;
  if (status === "out-of-sync") return `origin/${branch} has new commits, fetch to update`;
  return "Remote sync status unknown (offline?)";
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// --- Bootstrap: chest's own first-run requirements, before any Check can be
// trusted to run cleanly. One-time and Setup-only — Sync assumes it already
// happened and only checks presence (see requirementsCheckTask further
// below), it never installs. Deliberately not built on tasks() like
// checkMachineTask/remoteSyncTask below — tasks() always stops
// its spinner green (see @clack/prompts dist/index.mjs's `tasks` — it never
// calls spinner.error(), and a thrown exception inside a task crashes the
// process uncaught rather than failing gracefully). Bootstrap needs a real
// failure visual for the retry/prompt path, so it drives spinner() directly.
//
// One "Preparing machine" spinner spans every item — its message is
// rewritten to the current item's name instead of stopping/restarting a
// line per item, so the five requirements read as one continuous action with
// a moving subheading rather than five separate completions. Only a failure
// breaks that continuity: the shared spinner gets stopped with .error() (a
// live spinner can't be resumed), the log + Retry/Abort prompt happen
// outside it, and a fresh spinner picks up where the old one left off.

const BOOTSTRAP_MAX_ATTEMPTS = 3;

function fakeBootstrapFailureOutput(item: BootstrapItem): string {
  return `  curl: (6) Could not resolve host, network unreachable while installing ${item.name}`;
}

type Spinner = ReturnType<typeof spinner>;

// Silent retry for BOOTSTRAP_MAX_ATTEMPTS (no prompt — matches "everytime we
// run it, if required things aren't there, install them" with no
// permission-asking). Only once attempts are exhausted does this become
// interactive: log.error shows the captured output, then a real choice
// (Retry / Abort) — not a hard exit, since these are required steps the rest
// of the Sweep can't proceed without.
const BOOTSTRAP_TITLE = "Preparing machine";

async function installBootstrapItem(item: BootstrapItem, s: Spinner): Promise<"ok" | "failed"> {
  let attempt = 0;

  while (true) {
    attempt++;
    s.message(`${BOOTSTRAP_TITLE}: ${item.name}`);
    await sleep(500);

    if (!item.fails) return "ok";

    if (attempt < BOOTSTRAP_MAX_ATTEMPTS) {
      s.message(`${BOOTSTRAP_TITLE}: ${item.name} (retrying, attempt ${attempt + 1}/${BOOTSTRAP_MAX_ATTEMPTS})`);
      continue;
    }

    s.error(`${BOOTSTRAP_TITLE}: ${item.name} failed after ${BOOTSTRAP_MAX_ATTEMPTS} attempts`);
    return "failed";
  }
}

async function runBootstrap(mode: BootstrapMode): Promise<void> {
  const items = fakeBootstrapItems(mode);
  let index = 0;
  let s = spinner();
  s.start(BOOTSTRAP_TITLE);

  while (index < items.length) {
    const item = items[index]!;
    const outcome = await installBootstrapItem(item, s);

    if (outcome === "ok") {
      index++;
      continue;
    }

    log.error(`${item.name} could not be installed after ${BOOTSTRAP_MAX_ATTEMPTS} attempts:\n${fakeBootstrapFailureOutput(item)}`);
    const choice = await select({
      message: `${item.name} failed. What now?`,
      options: [
        { value: "retry", label: "Retry" },
        { value: "abort", label: "Abort setup" },
      ],
    });
    if (isCancel(choice) || choice === "abort") bail();

    items[index] = { ...item, fails: false }; // manual retry resolves clean — demo has one recovery beat, not an infinite loop
    s = spinner();
    s.start(BOOTSTRAP_TITLE);
  }

  s.stop("Machine ready");
}

// Sync assumes Bootstrap already happened, a one-time, Setup-only install.
// So Sync doesn't install anything here, it just verifies presence. No
// separate "Checking requirements" line for that, it folds into the same
// "Checking the machine" spinner Sync already shows (checkMachineTask below)
// rather than adding a second title the user never asked to see. No item
// names surface either, just enough to say "run Setup" without a full
// diagnostic dump.
function requireSetupFirst(): never {
  cancel("Your machine isn't ready for sync, run pchest --layout=setup");
  process.exit(1);
}

// Stands in for sweep.ts's checkEntries()/scanBins() Promise.all, real
// Checks run concurrently with no per-item progress, so one task covering
// the whole batch is the honest representation, not a per-category crawl.
// Not "Checking installed tools", Entries aren't all tools (fonts, system
// settings), so the title stays generic. requirementsMissing short-circuits
// the usual per-item simulation, Sync-only, set once Bootstrap's presence
// check (fixtures.ts's fakeBootstrapItems) has already run in runSync.
function checkMachineTask(states: ItemState[], requirementsMissing = false) {
  return {
    title: "Checking the machine",
    task: async () => {
      if (requirementsMissing) {
        await sleep(800);
        return "Setup required";
      }
      await sleep(3000);
      const failed = states.filter((state) => state.status === "check-failed").length;
      if (failed === 0) return `Checked ${states.length} item(s)`;
      return `Checked ${states.length - failed}/${states.length} item(s), ${failed} check failed`;
    },
  };
}

// Same prep-step shape as checkMachineTask — both run via tasks() before the
// picker starts, since once multiselect is rendering it owns the cursor and
// clack has no way to hand a line back to us mid-prompt.
function remoteSyncTask() {
  return {
    title: "Checking sync with origin",
    task: async () => syncMessage(await remoteSyncStatus()),
  };
}

function bail(): never {
  cancel("Sweep cancelled");
  process.exit(0);
}

// "Install" in Setup, "Install/resync" in Sync — Setup's items are always
// missing (never installed yet), so "resync" would be a lie there; Sync
// mixes missing and out-of-sync items, so it needs both verbs.
type Verb = "Install" | "Install/resync";

// Confirms right before committing — the one point where Enter would
// otherwise silently kick off installs. Declining behaves like Escape
// everywhere else in this prototype: it cancels the whole Sweep rather than
// looping back, since clack gives no primitive to un-submit a prompt.
async function confirmSelection(selected: string[], verb: Verb): Promise<void> {
  if (selected.length === 0) return;
  const proceed = await confirm({ message: `${verb} ${selected.length} item(s)?` });
  if (isCancel(proceed) || !proceed) bail();
}

function finish(selected: string[], verb: Verb): void {
  outro(selected.length === 0 ? "Nothing to do" : `Would ${verb.toLowerCase()}: ${selected.join(", ")}`);
}

// --- Sync mode: status grouped, kind flagged in the hint -------------------
//
// groupMultiselect, not plain multiselect — real "Not installed" / "Out of
// sync" headings read better than a flat hint-tag list here, and unlike
// Setup's per-category screen, nothing in Sync needs `disabled` (every item
// shown is pending by definition), so GroupMultiSelectPrompt's one real bug
// never comes into play. `selectableGroups: false` turns off the per-group
// heading toggle — a whole status group is a mix of unrelated kinds
// (cli/app/config/bin...), and bulk-toggling "everything missing" regardless
// of kind isn't a meaningful action — which also means the cursor now skips
// straight past headings instead of landing on them.
//
// Cost: GroupMultiSelectPrompt has no "a" select-everything key at all
// (only the now-disabled per-group toggle), so the single-keystroke
// select-all this replaced is gone in Sync. Setup's chooseInCategory keeps
// plain multiselect specifically to keep that key, since `disabled` matters
// there.
//
// A plain Entry can never be out-of-sync (chest doesn't check versioning
// for apps/clis/fonts/system) — only Config/Bin scan pairs can — so "Out of
// sync" only ever holds those two kinds. Each item's hint names its kind
// (category for an Entry, "config"/"bin" for a scan) since the heading
// already says the status.
//
// A third heading, "Couldn't check", covers Checks that errored instead of
// running cleanly (command not found, no permission, timed out) — neither
// Missing nor Out of sync, since chest never got a real answer either way.
// Any kind can land here (an Entry Check errors the same way a scan's can).

type SyncOption = { value: string; label: string; hint: string };

function groupHint(state: ItemState): string {
  return state.kind === "entry" ? state.category : state.kind;
}

function syncGroups(states: ItemState[]): Record<string, SyncOption[]> {
  const toOptions = (group: ItemState[]): SyncOption[] =>
    group.map((state) => ({ value: keyOf(state), label: state.name, hint: groupHint(state) }));

  const notInstalled = toOptions(states.filter((state) => state.status === "missing"));
  const outOfSync = toOptions(states.filter((state) => state.status === "out-of-sync"));
  const checkFailed = toOptions(states.filter((state) => state.status === "check-failed"));

  const groups: Record<string, SyncOption[]> = {};
  if (notInstalled.length > 0) groups["Not installed"] = notInstalled;
  if (outOfSync.length > 0) groups["Out of sync"] = outOfSync;
  if (checkFailed.length > 0) groups["Couldn't check"] = checkFailed;
  return groups;
}

async function runSync(states: ItemState[], bootstrapMode: BootstrapMode): Promise<void> {
  intro("pchest - sync");

  const requirementsMissing = fakeBootstrapItems(bootstrapMode).some((item) => item.fails);
  const machineTasks = requirementsMissing ? [checkMachineTask(states, true)] : [checkMachineTask(states), remoteSyncTask()];
  await tasks(machineTasks);
  if (requirementsMissing) requireSetupFirst();

  const groups = syncGroups(states);
  const total = Object.values(groups).reduce((sum, items) => sum + items.length, 0);

  if (total === 0) {
    log.success(`Everything in sync (${states.length} items checked)`);
    outro("Nothing to do");
    return;
  }

  const selected = await groupMultiselect<string>({
    message: `${total} item(s) need attention`,
    options: groups,
    selectableGroups: false,
    initialValues: [],
    required: false,
  });

  if (isCancel(selected)) bail();

  await confirmSelection(selected, "Install/resync");
  finish(selected, "Install/resync");
}

function stateGlyph(selectedCount: number, selectableTotal: number): string {
  if (selectableTotal === 0) return "●";
  if (selectedCount === 0) return "○";
  if (selectedCount === selectableTotal) return "●";
  return "◐";
}

// --- Setup: category menu, drill in one Category at a time. Enter always
// saves and returns to the menu — no discard-and-return. Escape always means
// quit, at every level (clack gives no way to distinguish "back" from
// "cancel", so this is the honest version rather than faking one).
//
// No "Config files" category here — Config entries fold their install into
// their owning app/cli, so Setup never offers them separately (see
// fixtures.ts). Bin scripts still shows, since copying bin/ scripts onto a
// fresh machine is as much a Setup concern as a Sync one.

function setupGroups(states: ItemState[]): Group[] {
  const categoryGroups: Group[] = CATEGORIES.map((category) => ({
    key: category,
    title: CATEGORY_TITLES[category],
    items: states.filter((state) => state.kind === "entry" && state.category === category),
  }));
  const bins: Group = {
    key: BIN_GROUP,
    title: "Bin scripts",
    items: states.filter((state) => state.kind === "bin"),
  };
  return [...categoryGroups, bins].filter((group) => group.items.length > 0);
}

// Plain multiselect, not groupMultiselect — this screen only ever has one
// group anyway, and @clack/core@1.4.3's GroupMultiSelectPrompt never checks
// `disabled` (not in cursor movement, not in toggling, not in rendering), so
// already-installed items would look and behave exactly like selectable
// ones. Plain MultiSelectPrompt does honor it. Trade-off: no visible "select
// all" row — that's now the unlabeled `a` key instead (built into
// MultiSelectPrompt, and it already skips disabled options on its own).
async function chooseInCategory(group: Group, selected: Set<string>): Promise<void> {
  const groupValues = group.items.map(keyOf);

  const options = group.items.map((state) => ({
    value: keyOf(state),
    label: state.name,
    hint: statusHint(state),
    disabled: state.status === "satisfied",
  }));

  const picked = await multiselect<string>({
    message: group.title,
    options,
    initialValues: groupValues.filter((value) => selected.has(value)),
    required: false,
  });

  if (isCancel(picked)) bail();

  for (const value of groupValues) selected.delete(value);
  for (const value of picked) selected.add(value);
}

async function runSetup(states: ItemState[], bootstrapMode: BootstrapMode): Promise<void> {
  intro("pchest - setup");

  await runBootstrap(bootstrapMode);
  await tasks([checkMachineTask(states)]);

  const groups = setupGroups(states);
  const selected = new Set<string>();

  // Bin scripts are near-universally wanted, unlike a fresh-machine app/cli
  // pick — so on Setup only, they start pre-selected rather than opt-in.
  const binGroup = groups.find((group) => group.key === BIN_GROUP);
  for (const item of binGroup?.items ?? []) {
    if (item.status !== "satisfied") selected.add(keyOf(item));
  }

  while (true) {
    const options: { value: string; label: string; hint?: string }[] = groups.map((group) => {
      const values = group.items.map(keyOf);
      const selectableValues = group.items.filter((item) => item.status !== "satisfied").map(keyOf);
      const installedCount = values.length - selectableValues.length;
      const selectedCount = selectableValues.filter((value) => selected.has(value)).length;
      const failedCount = group.items.filter((item) => item.status === "check-failed").length;

      const hint =
        selectableValues.length === 0
          ? `all ${installedCount} already installed`
          : `${selectedCount}/${selectableValues.length} selected` +
            (installedCount > 0 ? ` · ${installedCount} already installed` : "") +
            (failedCount > 0 ? ` · ${failedCount} check failed` : "");

      return {
        value: group.key,
        label: `${stateGlyph(selectedCount, selectableValues.length)} ${group.title}`,
        hint,
      };
    });

    options.push({
      value: DONE,
      label: selected.size > 0 ? `Continue → ${selected.size} selected` : "Continue (nothing selected)",
    });
    options.push({ value: CANCEL, label: "Cancel" });

    const choice = await select({ message: "Set up this machine", options });

    if (isCancel(choice)) bail();
    if (choice === CANCEL) bail();
    if (choice === DONE) break;

    const group = groups.find((candidate) => candidate.key === choice);
    if (group) await chooseInCategory(group, selected);
  }

  const result = [...selected];
  await confirmSelection(result, "Install");
  finish(result, "Install");
}

// --- entry point ------------------------------------------------------

const MODES = { setup: runSetup, sync: runSync } as const;
type ModeName = keyof typeof MODES;

function usage(): string {
  return `\
Usage: pchest [--layout=<setup|sync>] [--bootstrap=<happy|unhappy>]

Prototype CLI exploring chest Sweep presentation. Not real, fixtures.ts fakes
59 items (13 pending, 2 check-failed) so each mode can be tried without
touching the machine.

Bootstrap: chest's own first-run requirements (Xcode Command Line Tools,
Homebrew, git, cloning this repo, creating ~/bin), one-time, Setup-only.
Setup installs them as one continuous "Preparing machine" spinner whose
message tracks the current item. --bootstrap=happy (default) installs all
five clean. --bootstrap=unhappy fails Homebrew for 3 silent attempts, then
shows the captured error and a Retry/Abort choice; Retry resolves clean on
the next pass, Abort cancels the whole Sweep before any Check ever runs.

Sync assumes Bootstrap already ran, it only checks presence (same
--bootstrap arg controls which items read as missing), never installs. If
anything's missing, that shows up inside Sync's normal "Checking the
machine" step ("Setup required" instead of a check count), then Sync stops
and points at Setup rather than trying to fix it itself.

Modes:
  setup   Category menu (cli/app/font/system + Bin scripts, no Config files;
          those fold into their owning app/cli's install). Each Category opens
          its own multiselect. Already-installed items show disabled, visible
          but unpickable; check-failed items stay pickable but hinted "check
          failed" (press "a" to select every pickable item at once). Bin
          scripts starts pre-selected, the rest start empty. Enter always
          saves and returns to the menu. Escape always means quit, at every
          level.
  sync    Three headings, status not Category: "Not installed" (any Entry,
          Config, or Bin scan pair that's never been put down), "Out of
          sync" (a Config/Bin scan pair present but drifted, a plain Entry
          can never land here, chest doesn't check versioning), and
          "Couldn't check" (any kind, if its Check itself errored rather
          than running clean). Each item's hint names its kind, e.g. "cli"
          or "config", since the heading already gives the status. No
          group-level toggle and no "a" select-all (GroupMultiSelectPrompt
          has neither), every item is picked one at a time. Nothing
          pre-selected.

Both modes: "Checking the machine" and (sync only) "Checking sync with
origin" run as prep tasks before the picker; if any Check failed, the
machine-check result reads "Checked N/M item(s), K check failed" instead of
a clean count. A confirm prompt gates the final selection before anything is
reported installed/resynced, declining it cancels the Sweep, same as
Escape.

Omit --layout to pick a mode interactively. Omit --bootstrap for the happy path.`;
}

function parseLayout(argv: string[]): ModeName | undefined {
  const arg = argv.find((a) => a.startsWith("--layout="));
  if (!arg) return undefined;
  const value = arg.split("=")[1] ?? "";
  if (value in MODES) return value as ModeName;
  console.error(`Unknown layout "${value}"\n`);
  console.log(usage());
  process.exit(1);
}

function parseBootstrapMode(argv: string[]): BootstrapMode {
  const arg = argv.find((a) => a.startsWith("--bootstrap="));
  if (!arg) return "happy";
  const value = arg.split("=")[1] ?? "";
  if (value === "happy" || value === "unhappy") return value;
  console.error(`Unknown bootstrap mode "${value}"\n`);
  console.log(usage());
  process.exit(1);
}

async function pickMode(): Promise<ModeName> {
  const choice = await select({
    message: "chest",
    options: [
      { value: "sync", label: "Sync", hint: "fix what's missing or out of sync" },
      { value: "setup", label: "Set up this machine", hint: "full inventory, fresh machine" },
    ],
  });
  if (isCancel(choice)) bail();
  return choice as ModeName;
}

const argv = process.argv.slice(2);

if (argv.includes("help") || argv.includes("--help")) {
  console.log(usage());
} else {
  const mode = parseLayout(argv) ?? (await pickMode());
  const bootstrapMode = parseBootstrapMode(argv);
  await MODES[mode](fakeStates(), bootstrapMode);
}
