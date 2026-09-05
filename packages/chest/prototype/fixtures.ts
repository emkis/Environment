import { manifest } from "../manifest/index.ts";

/**
 * Prototype-only domain model — diverges from ../engine/types.ts on purpose.
 * Explores two ideas that aren't real yet (see CONTEXT.md's "Prototype
 * language" section):
 *
 * - A missing/out-of-sync/check-failed status split, instead of the real
 *   engine's satisfied/missing-only EntryState.
 * - A Config scan (mirroring the real Bin scan) that replaces the real
 *   `config` Entry Category entirely. Config entries fold their install into
 *   their owning app/cli's Install here, matching the precedent the real
 *   `skhd` and `karabiner-elements` Entries already set — so Setup never
 *   shows a "Config files" category, only Sync does.
 */

export const CATEGORIES = ["cli", "app", "font", "system"] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * Bootstrap: chest's own first-run step, before any Check can be trusted to
 * run cleanly. One-time, Setup-only — Setup installs, Sync only checks
 * presence (same fails flag doubles as "still missing" for Sync's gate) and
 * refuses to run at all if anything's missing, pointing at Setup instead.
 * Fixture always starts every item missing (the fresh-machine case is the
 * only one worth demoing — an all-satisfied machine looks identical to no
 * Bootstrap step at all). --bootstrap=unhappy fails Homebrew specifically,
 * to demo the retry-then-prompt escalation path in Setup and the hard-stop
 * path in Sync.
 */
export type BootstrapMode = "happy" | "unhappy";

export interface BootstrapItem {
  name: string;
  fails: boolean;
}

export function fakeBootstrapItems(mode: BootstrapMode): BootstrapItem[] {
  return [
    { name: "Xcode Command Line Tools", fails: false },
    { name: "Homebrew", fails: mode === "unhappy" },
    { name: "git", fails: false },
    { name: "Cloning repository", fails: false },
    { name: "Creating ~/bin", fails: false },
  ];
}

export type EntryStatus = "satisfied" | "missing" | "check-failed";
export type ScanStatus = "satisfied" | "missing" | "out-of-sync" | "check-failed";
export type ScanKind = "config" | "bin";

export interface EntryState {
  kind: "entry";
  name: string;
  category: Category;
  status: EntryStatus;
}

export interface ScanState {
  kind: ScanKind;
  name: string;
  status: ScanStatus;
  source: string;
  target: string;
}

export type ItemState = EntryState | ScanState;

export const CATEGORY_TITLES: Record<Category, string> = {
  cli: "CLI tools",
  app: "Applications",
  font: "Fonts",
  system: "System",
};

/**
 * Deliberately staged so prototypes have something realistic to show.
 * Config-category Entries from the real manifest are dropped here on
 * purpose — they're represented below as CONFIG_SCAN instead, alongside
 * skhdrc/karabiner.json, which today get no drift check at all in the real
 * manifest despite already folding their install into skhd/karabiner-elements.
 */
const PENDING_ENTRY_NAMES = new Set(["ticktick", "rectangle-pro", "watchman", "bat", "gnupg", "lora"]);

// A Check that errors instead of running cleanly — command not found, no
// permission, timed out — is neither Missing nor Satisfied: chest never got
// a real answer. Kept selectable everywhere rather than disabled, since
// there's no proof the Entry is already there.
const CHECK_FAILED_ENTRY_NAMES = new Set(["starship"]);

const CONFIG_SCAN: { name: string; status: ScanStatus }[] = [
  { name: "gitconfig", status: "out-of-sync" },
  { name: "config.fish", status: "out-of-sync" },
  { name: "starship.toml", status: "satisfied" },
  { name: "zed-settings", status: "out-of-sync" },
  { name: "zed-keymap", status: "missing" },
  { name: "skhdrc", status: "satisfied" },
  { name: "karabiner.json", status: "missing" },
];

const BIN_SCAN: { name: string; status: ScanStatus }[] = [
  { name: "setup-devices", status: "satisfied" },
  { name: "sync-dotfiles", status: "out-of-sync" },
  { name: "backup-notes", status: "missing" },
  { name: "rotate-logs", status: "check-failed" },
];

function fakeEntryStates(): EntryState[] {
  return manifest
    .filter((entry) => entry.category !== "config")
    .map((entry) => ({
      kind: "entry",
      name: entry.name,
      category: entry.category as Category,
      status: CHECK_FAILED_ENTRY_NAMES.has(entry.name)
        ? "check-failed"
        : PENDING_ENTRY_NAMES.has(entry.name)
          ? "missing"
          : "satisfied",
    }));
}

function fakeScanStates(kind: ScanKind, fixtures: { name: string; status: ScanStatus }[]): ScanState[] {
  return fixtures.map(({ name, status }) => ({
    kind,
    name,
    status,
    source: `${kind}/${name}`,
    target: `/fake/target/${name}`,
  }));
}

export function fakeStates(): ItemState[] {
  return [...fakeEntryStates(), ...fakeScanStates("config", CONFIG_SCAN), ...fakeScanStates("bin", BIN_SCAN)];
}
