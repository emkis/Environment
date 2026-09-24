#!/usr/bin/env bun

import { $ } from "bun";
import { once } from "node:events";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Tests whether a candidate address (`xx-xx-xx-xx-xx-xx`) identifies a device. */
type Matcher = (address: string) => boolean;

interface Device {
  name: string;
  /**
   * A fixed address, or a `Matcher` for devices that get a new address per host slot,
   * like the MX Keys keyboard's Bluetooth channels — there's no fixed address to pair
   * to directly, so it's found by scanning nearby discoverable devices instead.
   */
  address: string | Matcher;
  /** Unpair and pair again, even when it's already paired. */
  repair?: boolean;
}

interface Command {
  run(): Promise<void> | void;
}

type PairResult = "paired" | "already paired" | "failed";

// ── Constants ─────────────────────────────────────────────────────────────────

/** Matches addresses starting with the given prefix, case-insensitively. */
function prefix(value: string): Matcher {
  const target = value.toLowerCase();
  return (address) => address.toLowerCase().startsWith(target);
}

const DEVICES: Device[] = [
  { name: "Trackpad", address: "bc-d0-74-b7-a3-f7", repair: true },
  { name: "Keyboard", address: prefix("d2-f3-6f-54-f6") },
  { name: "Mouse", address: "f4-66-db-5d-ec-7f" },
  { name: "Headphones", address: "78-2b-64-cc-73-fa" },
  { name: "Bose Speaker", address: "78-2b-64-f7-30-4d" },
];

const PAIR_ATTEMPTS = 2;
const INQUIRY_SECONDS = 8;
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

// ── Terminal ──────────────────────────────────────────────────────────────────

const isTTY = Boolean(process.stdout.isTTY);
const useColor = isTTY && !process.env.NO_COLOR;

const ansi = {
  clearLine: "\r\x1b[2K",
  hideCursor: "\x1b[?25l",
  showCursor: "\x1b[?25h",
};

const paint = (code: string) => (text: string) =>
  useColor ? `\x1b[${code}m${text}\x1b[0m` : text;

const style = {
  bold: paint("1"),
  dim: paint("2"),
  red: paint("31"),
  green: paint("32"),
  yellow: paint("33"),
  cyan: paint("36"),
};

const log = {
  ok: (message: string) => console.log(`  ${style.green("✔")} ${message}`),
  error: (message: string) => console.log(`  ${style.red("✘")} ${message}`),
};

function bail(message: string): never {
  process.stderr.write(`${style.red("✘")} ${message}\n`);
  process.exit(1);
}

function requireBins(...bins: string[]): void {
  for (const bin of bins) {
    if (!Bun.which(bin)) bail(`${bin} is not installed. Run: brew install ${bin}`);
  }
}

const BLUETOOTH_PRIVACY_PANE = "x-apple.systempreferences:com.apple.preference.security?Privacy_Bluetooth";

/**
 * blueutil aborts if the terminal app isn't allowed in System Settings, and macOS doesn't
 * prompt for it like it does for camera/mic. Detect that and jump straight to the pane
 * instead of leaving the user to find it (System Settings > Privacy & Security > Bluetooth).
 */
async function ensureBluetoothAccess(): Promise<void> {
  const result = await $`blueutil --power`.quiet().nothrow();
  if (result.exitCode === 0) return;

  if (result.stderr.toString().includes("Bluetooth API")) {
    await $`open ${BLUETOOTH_PRIVACY_PANE}`.quiet().nothrow();
    bail("This terminal app isn't allowed to use Bluetooth. Add it in the Settings pane just opened, then run this again.");
  }

  bail(result.stderr.toString().trim() || "blueutil failed");
}

/** Shows a spinner next to the message while the task runs (TTY only). */
async function withSpinner<T>(message: string, task: () => Promise<T>): Promise<T> {
  if (!isTTY) return task();

  const restoreCursor = () => process.stdout.write(ansi.clearLine + ansi.showCursor);
  const onInterrupt = () => {
    restoreCursor();
    process.exit(130);
  };

  let frame = 0;
  const draw = () => {
    const spinner = style.cyan(SPINNER_FRAMES[frame++ % SPINNER_FRAMES.length]);
    process.stdout.write(`${ansi.clearLine}  ${spinner} ${message}`);
  };

  process.stdout.write(ansi.hideCursor);
  process.on("SIGINT", onInterrupt);
  draw();
  const timer = setInterval(draw, 80);

  try {
    return await task();
  } finally {
    clearInterval(timer);
    process.off("SIGINT", onInterrupt);
    restoreCursor();
  }
}

/** Shows the message until any key is pressed. Ctrl+C exits. */
async function waitForKey(message: string): Promise<void> {
  const { stdin } = process;
  const line = `  ${style.yellow("›")} ${message}`;

  if (!stdin.isTTY) {
    console.log(line);
    return;
  }

  process.stdout.write(line);
  stdin.setRawMode(true);
  stdin.resume();
  const [key] = (await once(stdin, "data")) as [Buffer];
  stdin.setRawMode(false);
  stdin.pause();
  process.stdout.write(isTTY ? ansi.clearLine : "\n");

  if (key[0] === 0x03) process.exit(130);
}

// ── Bluetooth ─────────────────────────────────────────────────────────────────

function matches(candidateAddress: string, device: Device): boolean {
  return typeof device.address === "function"
    ? device.address(candidateAddress)
    : candidateAddress.toLowerCase() === device.address.toLowerCase();
}

const bluetooth = {
  async isOn(): Promise<boolean> {
    return (await $`blueutil --power`.text()).trim() === "1";
  },

  async setPower(on: boolean): Promise<void> {
    await $`blueutil --power ${on ? "1" : "0"}`.quiet();
  },

  async pairedAddresses(): Promise<Set<string>> {
    const devices: { address: string }[] = await $`blueutil --paired --format json`.json();
    return new Set(devices.map((device) => device.address));
  },

  /** Scans nearby discoverable devices (i.e. in pairing mode) for one matching the device. */
  async discover(device: Device): Promise<string | undefined> {
    const found: { address: string }[] = await $`blueutil --inquiry ${INQUIRY_SECONDS} --format json`.json();
    return found.find((candidate) => matches(candidate.address, device))?.address;
  },

  async pair(address: string): Promise<boolean> {
    return (await $`blueutil --pair ${address}`.quiet().nothrow()).exitCode === 0;
  },

  async unpair(address: string): Promise<boolean> {
    return (await $`blueutil --unpair ${address}`.quiet().nothrow()).exitCode === 0;
  },
};

async function pairDevice(device: Device, pairedAddresses: Set<string>): Promise<PairResult> {
  console.log(style.bold(device.name));

  const pairedAddress = [...pairedAddresses].find((address) => matches(address, device));

  if (pairedAddress) {
    if (!device.repair) {
      log.ok(style.dim("Already paired"));
      return "already paired";
    }

    if (!(await withSpinner("Unpairing…", () => bluetooth.unpair(pairedAddress)))) {
      log.error("Couldn't unpair");
      return "failed";
    }
    log.ok("Unpaired");
  }

  await waitForKey(`Turn it on, then press any key ${style.dim("(Ctrl+C to quit)")}`);

  let address = device.address;
  if (typeof address === "function") {
    const discovered = await withSpinner("Looking for it nearby…", () => bluetooth.discover(device));
    if (!discovered) {
      log.error("Couldn't find it nearby. Make sure it's in pairing mode.");
      return "failed";
    }
    address = discovered;
  }

  for (let attempt = 1; attempt <= PAIR_ATTEMPTS; attempt++) {
    const attemptLabel = attempt > 1 ? style.dim(` (attempt ${attempt}/${PAIR_ATTEMPTS})`) : "";

    if (await withSpinner(`Pairing…${attemptLabel}`, () => bluetooth.pair(address))) {
      log.ok("Paired");
      return "paired";
    }

    log.error(attempt < PAIR_ATTEMPTS ? "Couldn't pair, trying again" : "Couldn't pair");
  }

  return "failed";
}

function summary(results: PairResult[]): string {
  const count = (result: PairResult) => results.filter((r) => r === result).length;
  const failed = count("failed");

  const parts = (["paired", "already paired", "failed"] as const)
    .filter((result) => count(result) > 0)
    .map((result) => `${count(result)} ${result}`);

  const icon = failed > 0 ? style.red("✘") : style.green("✔");
  return `${icon} ${parts.join(style.dim(" · "))}`;
}

// ── Commands ──────────────────────────────────────────────────────────────────

const commands = {
  pair: {
    async run() {
      requireBins("blueutil", "fzf");
      await ensureBluetoothAccess();

      const input = Buffer.from(DEVICES.map((device) => device.name).join("\n"));
      const selection = await $`fzf --multi --border --prompt="Pair › " --header="Tab to select, Enter to pair" < ${input}`
        .nothrow()
        .text();

      const selected = DEVICES.filter((device) => selection.split("\n").includes(device.name));
      if (selected.length === 0) {
        console.log(style.dim("No devices selected"));
        return;
      }

      if (!(await bluetooth.isOn())) {
        await withSpinner("Turning Bluetooth on…", () => bluetooth.setPower(true));
        console.log(`${style.green("✔")} Bluetooth turned on\n`);
      }

      const pairedAddresses = await bluetooth.pairedAddresses();
      const results: PairResult[] = [];

      for (const device of selected) {
        if (results.length > 0) console.log();
        results.push(await pairDevice(device, pairedAddresses));
      }

      console.log(`\n${summary(results)}`);
      if (results.includes("failed")) process.exit(1);
    },
  },

  toggle: {
    async run() {
      requireBins("blueutil");
      await ensureBluetoothAccess();

      const on = !(await bluetooth.isOn());
      await bluetooth.setPower(on);
      console.log(`${style.green("✔")} Bluetooth turned ${style.bold(on ? "on" : "off")}`);
    },
  },

  help: {
    run() {
      console.log(`\
${style.bold("Usage:")} blu <command>

${style.bold("Commands:")}
  pair      Pick Bluetooth devices in a menu and pair them.
  toggle    Turn Bluetooth on or off.
  help      Show this help message.`);
    },
  },
} satisfies Record<string, Command>;

// ── Main ──────────────────────────────────────────────────────────────────────

const [, , command] = process.argv;

switch (command) {
  case undefined:
  case "help":
    commands.help.run();
    break;
  case "pair":
    await commands.pair.run();
    break;
  case "toggle":
    await commands.toggle.run();
    break;
  default:
    bail(`Unknown command: ${command}. Run 'blu help' to see the commands.`);
}
