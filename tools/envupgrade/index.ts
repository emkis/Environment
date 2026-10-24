#!/usr/bin/env bun

// Upgrades everything on this machine, in one place: Homebrew, Rust, every
// installed cargo crate and the default Node. The default versions always move
// to the latest. Upgrading Node also removes the previous version (fnm), so only
// one stays installed. A project that needs another one installs it itself.
//
// Each upgrade's own output is hidden, as it's noisy. It's only shown when the
// upgrade fails. A failure doesn't stop the others.
//
// The exception is an interactive upgrade (Homebrew): casks can ask for a
// password or a confirmation, and I want to see what is being asked and why. It
// gets the terminal, lists what is outdated first, and shows its output as it runs.

import { $ } from "bun";
import { homedir } from "node:os";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Upgrade {
  name: string;
  /** Talks to the terminal as it runs, so its output is shown instead of hidden. */
  interactive?: boolean;
  /** Upgrades and returns a note on what changed, or undefined if nothing did. Throws on failure. */
  run(): Promise<string | undefined>;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// rustup is keg-only, so its bin goes on PATH
process.env.PATH = `/opt/homebrew/opt/rustup/bin:${homedir()}/.cargo/bin:${process.env.PATH}`;

const upgrades: Upgrade[] = [
  {
    name: "Homebrew",
    interactive: true,
    async run() {
      const outdated = lines(await $`brew outdated --verbose`.text());
      if (outdated.length === 0) return undefined;

      console.log(`${style.bold(style.cyan("Homebrew"))}\n\n${style.bold("Outdated:")}\n${outdated.map((line) => `  ${line}`).join("\n")}\n`);
      const { exited } = Bun.spawn(["brew", "upgrade"], { stdio: ["inherit", "inherit", "inherit"] });
      if ((await exited) !== 0) throw new Error("brew upgrade failed");
      return `${outdated.length} ${outdated.length === 1 ? "package" : "packages"}`;
    },
  },
  {
    name: "Rust",
    async run() {
      const before = await $`rustc --version`.text();
      await $`rustup update stable`.quiet();
      return versionChange(before, await $`rustc --version`.text());
    },
  },
  {
    name: "Cargo crates",
    async run() {
      const before = await installedCrates();
      const upgraded: string[] = [];
      for (const crate of before.keys()) {
        // Upgrades a crate that's outdated, and skips one that's current
        await $`cargo install --locked ${crate}`.quiet();
        const change = versionChange(before.get(crate), (await installedCrates()).get(crate));
        if (change) upgraded.push(`${crate} ${change}`);
      }
      return upgraded.length > 0 ? upgraded.join(", ") : undefined;
    },
  },
  {
    name: "Node",
    async run() {
      const before = await defaultNode();
      await $`fnm install --lts`.quiet();
      // fnm only makes the first installed version the default, so set it every time
      await $`fnm default lts-latest`.quiet();
      const after = await defaultNode();
      if (before !== after) await $`fnm uninstall ${before}`.quiet();
      return versionChange(before, after);
    },
  },
];

// ── Output ────────────────────────────────────────────────────────────────────

// Colors, only when printing to a terminal
const enabled = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code: number) => (text: string) => (enabled ? `\x1b[${code}m${text}\x1b[0m` : text);
const style = { bold: paint(1), dim: paint(2), red: paint(31), green: paint(32), cyan: paint(36) };

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(style.bold(style.cyan("Upgrading")) + "\n");

let failed = false;
for (const { name, run, interactive } of upgrades) {
  try {
    const note = await run();
    console.log(note
      ? `${style.green("✓")} Upgraded ${style.bold(name)} ${style.dim(`(${note})`)}`
      : `${style.green("✓")} ${style.bold(name)} ${style.dim("(already up to date)")}`);
  } catch (error) {
    failed = true;
    console.error(`${style.red("✗")} Failed to upgrade ${style.bold(name)}`);
    // An interactive upgrade has already shown its output
    if (!interactive) console.error(describeFailure(error));
  }
}

process.exit(failed ? 1 : 0);

// ── Helpers ───────────────────────────────────────────────────────────────────

function lines(text: string): string[] {
  return text.split("\n").map((line) => line.trim()).filter(Boolean);
}

// "1.98.1 → 1.99.1", or undefined when the version stayed the same
function versionChange(before = "", after = ""): string | undefined {
  const [from, to] = [before, after].map((text) => text.match(/\d+(\.\d+)+/)?.[0]);
  return from === to ? undefined : `${from ?? "new"} → ${to}`;
}

// Crates installed from crates.io and their versions, as in "ai-usagebar v1.43.0:".
// Crates installed from a git repo or a folder have a source in parentheses, and can't be upgraded by name
async function installedCrates(): Promise<Map<string, string>> {
  const output = await $`cargo install --list`.text();
  return new Map([...output.matchAll(/^(\S+) v(\S+?):/gm)].map((match) => [match[1], match[2]]));
}

async function defaultNode(): Promise<string> {
  return (await $`fnm exec --using=default node --version`.text()).trim();
}

// The output of a failed command, which Bun hides unless it's read
function describeFailure(error: unknown): string {
  if (error instanceof $.ShellError) return `${error.stdout}${error.stderr}`.trim();
  return error instanceof Error ? error.message : String(error);
}
