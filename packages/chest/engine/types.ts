export const CATEGORIES = ["cli", "app", "font", "config", "system"] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Entry {
  name: string;
  category: Category;
  check: string;
  install: string | string[];
  requires?: string[];
  manualStepsRef?: string;
  /** Absolute paths, set on Entries whose install overwrites a file on disk. Enables the diff review. */
  source?: string;
  target?: string;
}

export type ItemStatus = "satisfied" | "missing" | "drifted";

export interface EntryState {
  kind: "entry";
  name: string;
  category: Category;
  status: Extract<ItemStatus, "satisfied" | "missing">;
  entry: Entry;
}

export interface BinState {
  kind: "bin";
  name: string;
  status: Extract<ItemStatus, "satisfied" | "drifted">;
  source: string;
  target: string;
}

export type ItemState = EntryState | BinState;

export interface PickerOption {
  value: string;
  label: string;
  hint?: string;
}

export interface PickerGroup {
  title: string;
  options: PickerOption[];
}

export interface InstallOutcome {
  name: string;
  ok: boolean;
  skipped?: boolean;
  reason?: string;
  manualStepsRef?: string;
}

export interface SweepResult {
  states: ItemState[];
  selected: string[];
  outcomes: InstallOutcome[];
  manualSteps: string[];
}

export interface SweepDeps {
  exec: (cmd: string) => Promise<{ ok: boolean }>;
  diffFile: (src: string, dest: string) => Promise<boolean>;
  listDir: (path: string) => Promise<string[]>;
  prompt: (groups: PickerGroup[]) => Promise<string[]>;
  /** Shows what an install would overwrite and returns whether to go ahead. Omitted: never asks. */
  reviewDiff?: (review: DiffReview) => Promise<boolean>;
  binDir: string;
  binTargetDir: string;
  report?: (event: SweepEvent) => void;
}

export interface DiffReview {
  name: string;
  source: string;
  target: string;
}

export type SweepEvent =
  | { type: "checked"; states: ItemState[] }
  | { type: "installing"; name: string }
  | { type: "installed"; outcome: InstallOutcome }
  | { type: "nothing-selected" };
