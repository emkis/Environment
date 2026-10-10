#!/usr/bin/env bun

// Reclaims disk space by running every cleanup recipe I know of, in one place.
// Add a new recipe to `recipes` whenever I find another cache that grows.
//
// Homebrew already cleans up after every install/upgrade (see config.fish), but
// it is included, with its flags spelled out so this tool never depends on that
// config, so a single run really does cover everything.
//
// Each recipe's own output is hidden, as it's noisy. It's only shown when the
// recipe fails. The space reclaimed is measured by checking the size of the
// folders each recipe cleans before and after, rather than parsing its output.

import { $ } from "bun";
import { existsSync } from "node:fs";
import { homedir } from "node:os";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Outcome {
  bytes: number;
  error?: string;
}

interface Recipe {
  name: string;
  /** Cleans up and reports the space freed. Never throws: failures come back as `error`. */
  reclaim(): Promise<Outcome>;
}

interface MeasuredRecipeOptions {
  name: string;
  /** Folders the recipe cleans, measured before and after it runs. */
  folders(): Promise<string[]>;
  clean(): Promise<unknown>;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CARGO_HOME = process.env.CARGO_HOME ?? `${homedir()}/.cargo`;

const recipes: Recipe[] = [
  createMeasuredRecipe({
    name: "Homebrew",
    folders: async () => lines(await $`brew --cache; brew --cellar; brew --caskroom`.text()),
    clean: () => $`brew cleanup --prune=all`.quiet(),
  }),
  createMeasuredRecipe({
    name: "Cargo",
    folders: async () => {
      // What `cargo cache --remove-dir all` removes
      const folders = ["git/db", "git/checkouts", "registry/src", "registry/cache", "registry/index"]
        .map((folder) => `${CARGO_HOME}/${folder}`);
      await assertCargoCacheReports(folders);
      return folders;
    },
    clean: () => $`cargo cache --remove-dir all`.quiet(),
  }),
];

// ── Factories ─────────────────────────────────────────────────────────────────

function createMeasuredRecipe({ name, folders, clean }: MeasuredRecipeOptions): Recipe {
  return {
    name,
    async reclaim() {
      try {
        const paths = await folders();
        const before = await measureDiskUsage(paths);
        const error = await clean().then(() => undefined, describeFailure);
        // Measured even when cleaning fails, as it may have freed some space first.
        // Clamped, as something else may have written to these folders meanwhile.
        const bytes = Math.max(before - (await measureDiskUsage(paths)), 0);
        return { bytes, error };
      } catch (error) {
        return { bytes: 0, error: describeFailure(error) };
      }
    },
  };
}

// Colors, only when printing to a terminal
function createStyle(enabled = process.stdout.isTTY && !process.env.NO_COLOR) {
  const paint = (code: number) => (text: string) => (enabled ? `\x1b[${code}m${text}\x1b[0m` : text);
  return { bold: paint(1), dim: paint(2), red: paint(31), green: paint(32), cyan: paint(36) };
}

function createReporter(style = createStyle()) {
  let total = 0;
  let failed = false;

  return {
    start() {
      console.log(style.bold(style.cyan("Reclaiming storage")) + "\n");
    },

    report(name: string, { bytes, error }: Outcome) {
      total += bytes;
      const freed = style.dim(`(${formatBytes(bytes)})`);
      if (error) {
        failed = true;
        console.error(`${style.red("✗")} Failed to reclaim storage from ${style.bold(name)} ${freed}`);
        console.error(error);
      } else {
        console.log(`${style.green("✓")} Reclaimed storage from ${style.bold(name)} ${freed}`);
      }
    },

    /** Prints the total and returns the exit code. */
    finish(): number {
      const color = failed ? style.red : style.green;
      console.log("\n" + style.bold(color(`Reclaimed ${formatBytes(total)}`)));
      return failed ? 1 : 0;
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Disk space the given folders use, in bytes. Missing folders count as 0.
async function measureDiskUsage(folders: string[]): Promise<number> {
  const existing = folders.filter((folder) => existsSync(folder));
  // With no folders, `du` would measure the current directory instead
  if (existing.length === 0) return 0;

  // -H follows folders that are symlinks. Exits with 1 on unreadable files, but
  // still prints the total it could read.
  const { stdout, stderr } = await $`du -skcH ${existing}`.nothrow().quiet();
  const kilobytes = parseInt(lines(stdout.toString()).at(-1) ?? "");
  if (Number.isNaN(kilobytes)) throw new Error(`Couldn't measure ${existing.join(", ")}\n${stderr}`);
  return kilobytes * 1024;
}

// The Cargo folders are hard-coded, as cargo-cache's output is meant for people.
// This catches the day they no longer match what cargo-cache cleans, so the
// recipe fails instead of measuring the wrong folders.
async function assertCargoCacheReports(folders: string[]): Promise<void> {
  const output = await $`cargo cache --list-dirs`.quiet().text();
  const reported = lines(output).map((line) => line.replace(/^[^:]+:\s+/, ""));
  const missing = folders.filter((folder) => !reported.includes(folder));
  if (missing.length > 0) {
    throw new Error(`cargo cache --list-dirs no longer reports ${missing.join(", ")}`);
  }
}

// A failure's output, or its message when it printed nothing
function describeFailure(error: unknown): string {
  const output = error instanceof $.ShellError ? `${error.stdout}${error.stderr}`.trim() : "";
  return output || String(error);
}

// Bytes -> "1.2 GB", in decimal units like Finder
function formatBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  // 999.95 rather than 1000, so 999,999 B shows as "1.0 MB" and not "1000.0 KB"
  for (; bytes >= 999.95 && i < units.length - 1; i++) bytes /= 1000;
  return i === 0 ? `${bytes} B` : `${bytes.toFixed(1)} ${units[i]}`;
}

function lines(text: string): string[] {
  return text.split("\n").filter(Boolean);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const reporter = createReporter();
reporter.start();

for (const recipe of recipes) {
  const reclaimed = await recipe.reclaim();
  reporter.report(recipe.name, reclaimed);
}

process.exit(reporter.finish());
