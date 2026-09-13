#!/usr/bin/env bun

import { $ } from "bun";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Ide {
  name: string;
  bin: string;
}

interface Command {
  run(args: string[]): Promise<void> | void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

// Per-machine state, deliberately outside the dotfiles repo so switching
// IDEs never shows up in git.
const STATE_DIR = process.env.XDG_STATE_HOME ?? `${process.env.HOME}/.local/state`;
const STATE_PATH = `${STATE_DIR}/ide/current`;

const IDES: Ide[] = [
  { name: "Visual Studio Code", bin: "code" },
  { name: "Zed", bin: "zed" },
];

const DEFAULT_IDE = IDES[0];

// ── Helpers ───────────────────────────────────────────────────────────────────

function bail(message: string): never {
  process.stderr.write(message + "\n");
  process.exit(1);
}

// ── State ─────────────────────────────────────────────────────────────────────

const state = {
  // Returns the chosen IDE. A missing or unrecognised state file is reset to
  // the default, so the tool always has a usable IDE.
  async current(): Promise<Ide> {
    const file = Bun.file(STATE_PATH);
    const bin = (await file.exists()) ? (await file.text()).trim() : "";
    const ide = IDES.find((i) => i.bin === bin);
    if (ide) return ide;

    await state.save(DEFAULT_IDE);
    return DEFAULT_IDE;
  },

  async save(ide: Ide): Promise<void> {
    await Bun.write(STATE_PATH, ide.bin + "\n");
  },
};

// ── Commands ──────────────────────────────────────────────────────────────────

const commands = {
  switch: {
    async run() {
      const current = await state.current();

      const input = Buffer.from(IDES.map((ide) => `${ide.name} (${ide.bin})`).join("\n"));
      const header = `Current: ${current.name}`;

      const selected = (
        await $`fzf --prompt="Select IDE > " --header=${header} < ${input}`.nothrow().text()
      ).trim();

      if (!selected) {
        console.log("Cancelled");
        return;
      }

      const ide = IDES.find((ide) => `${ide.name} (${ide.bin})` === selected);
      if (!ide) bail("Invalid selection");

      await state.save(ide);
      console.log(`Switched IDE to: ${ide.name} (${ide.bin})`);
    },
  },

  open: {
    async run() {
      const ide = await state.current();

      console.log(`Opening application: "${ide.name}"`);
      await $`open -a ${ide.name}`;
    },
  },

  path: {
    async run([path]: string[]) {
      const ide = await state.current();

      await $`${ide.bin} ${path}`;
    },
  },

  help: {
    run() {
      console.log(`\
Usage: ide [<path> | open | switch | help]

Commands:
  <path>          Open the given path in the current IDE.
  open            Open the current IDE application.
  switch          Interactive menu to choose an IDE.
  help            Show this help message.

Notes:
  - The chosen IDE is stored in '${STATE_PATH}', outside the dotfiles repo.
  - If that file is missing or holds an unknown IDE, ${DEFAULT_IDE.name} is used and saved.`);
    },
  },
} satisfies Record<string, Command>;

// ── Main ──────────────────────────────────────────────────────────────────────

const [, , command, ...args] = process.argv;

switch (command) {
  case undefined:
  case "help":
    commands.help.run([]);
    break;
  case "switch":
    await commands.switch.run([]);
    break;
  case "open":
    await commands.open.run([]);
    break;
  default:
    await commands.path.run([command, ...args]);
}
