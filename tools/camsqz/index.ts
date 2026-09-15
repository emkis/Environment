#!/usr/bin/env bun

import { $ } from "bun";
import { rmSync } from "node:fs";
import { readdir, rename, rm, stat, utimes } from "node:fs/promises";
import { availableParallelism, homedir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import { parseArgs } from "node:util";

// ── Types ─────────────────────────────────────────────────────────────────────

type Kind = "jpg" | "raw";

interface Photo {
  name: string;
  kind: Kind;
  size: number;
  path: string;
  /** Where the compressed copy goes: `<name>_compressed.jpg` next to the original. */
  output: string;
}

interface Scan {
  photos: Photo[];
  alreadyCompressed: number;
  rawWithJpg: number;
}

type Result =
  | { photo: Photo; ok: true; size: number }
  | { photo: Photo; ok: false; error: string };

// ── Constants ─────────────────────────────────────────────────────────────────

const SUFFIX = "_compressed";

const DEFAULT_QUALITY = 80;

/** The photo formats the Sony ZV-E10 writes. sips reads ARW through macOS's own RAW support. */
const KINDS: Record<string, Kind> = {
  ".jpg": "jpg",
  ".arw": "raw",
};

const CONCURRENCY = Math.max(1, Math.min(4, availableParallelism() - 1));

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
  cyan: paint("36"),
};

function bail(message: string): never {
  process.stderr.write(`${style.red("✘")} ${message}\n`);
  process.exit(1);
}

/** Prints a line above the spinner, so it stays on screen after the spinner moves on. */
function printLine(line: string): void {
  if (isTTY) process.stdout.write(ansi.clearLine);
  console.log(line);
}

/** Shows a spinner with the latest message while the task runs (TTY only). */
async function withSpinner<T>(message: () => string, task: () => Promise<T>): Promise<T> {
  if (!isTTY) return task();

  let frame = 0;
  const draw = () => {
    const spinner = style.cyan(SPINNER_FRAMES[frame++ % SPINNER_FRAMES.length]);
    process.stdout.write(`${ansi.clearLine}  ${spinner} ${message()}`);
  };

  process.stdout.write(ansi.hideCursor);
  draw();
  const timer = setInterval(draw, 80);

  try {
    return await task();
  } finally {
    clearInterval(timer);
    process.stdout.write(ansi.clearLine + ansi.showCursor);
  }
}

const displayPath = (path: string) => path.replace(homedir(), "~");

function formatSize(bytes: number): string {
  const mb = bytes / 1000 ** 2;
  return mb >= 1000 ? `${(mb / 1000).toFixed(1)} GB` : `${mb.toFixed(1)} MB`;
}

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

// ── Photos ────────────────────────────────────────────────────────────────────

const kindOf = (name: string): Kind | undefined => KINDS[extname(name).toLowerCase()];

const stemOf = (name: string) => basename(name, extname(name));

/** Finds the photos in the folder (not subfolders) that still need a compressed copy. */
async function scan(dir: string): Promise<Scan> {
  const entries = await readdir(dir, { withFileTypes: true });
  const names = entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  // Compared in lowercase, because macOS treats DSC001.JPG and dsc001.jpg as the same file.
  const lowercaseNames = new Set(names.map((name) => name.toLowerCase()));
  const jpgStems = new Set(
    names.filter((name) => kindOf(name) === "jpg").map((name) => stemOf(name).toLowerCase()),
  );

  const result: Scan = { photos: [], alreadyCompressed: 0, rawWithJpg: 0 };

  for (const name of names) {
    const kind = kindOf(name);
    const stem = stemOf(name);
    if (!kind || stem.toLowerCase().endsWith(SUFFIX)) continue;

    // RAW+JPG pairs share a name, and the camera's JPG looks better than a plain RAW conversion.
    if (kind === "raw" && jpgStems.has(stem.toLowerCase())) {
      result.rawWithJpg++;
      continue;
    }

    const outputName = `${stem}${SUFFIX}.jpg`;
    if (lowercaseNames.has(outputName.toLowerCase())) {
      result.alreadyCompressed++;
      continue;
    }

    const path = join(dir, name);
    const { size } = await stat(path);
    result.photos.push({ name, kind, size, path, output: join(dir, outputName) });
  }

  return result;
}

/** Temp files being written right now, removed if camsqz is interrupted. */
const partialFiles = new Set<string>();

process.on("exit", () => {
  for (const file of partialFiles) rmSync(file, { force: true });
  if (isTTY) process.stdout.write(ansi.showCursor);
});

/**
 * Writes to a hidden temp file and renames it when done, so an interrupted run
 * never leaves a half-written `_compressed.jpg` that the next run would skip.
 */
async function compress(photo: Photo, quality: number): Promise<Result> {
  const partial = join(dirname(photo.output), `.${basename(photo.output)}.partial`);
  partialFiles.add(partial);

  try {
    // sips keeps the EXIF data (capture date, camera, lens), which ffmpeg drops.
    const sips = await $`sips -s format jpeg -s formatOptions ${quality} ${photo.path} --out ${partial}`
      .quiet()
      .nothrow();
    if (sips.exitCode !== 0) {
      const error = sips.stderr.toString().trim().split("\n")[0];
      return { photo, ok: false, error: error || `sips exited with code ${sips.exitCode}` };
    }

    // Keep the original's dates, so sorting by date in Finder still works.
    const { atime, mtime } = await stat(photo.path);
    await utimes(partial, atime, mtime);
    await rename(partial, photo.output);

    return { photo, ok: true, size: (await stat(photo.output)).size };
  } catch (error) {
    return { photo, ok: false, error: (error as Error).message };
  } finally {
    await rm(partial, { force: true });
    partialFiles.delete(partial);
  }
}

/** Compresses a few photos at a time, but reports them in the order they were listed. */
async function compressAll(photos: Photo[], quality: number): Promise<Result[]> {
  const results: Result[] = [];
  const width = Math.max(...photos.map((photo) => photo.name.length));
  let started = 0;
  let finished = 0;
  let printed = 0;

  const printReady = () => {
    for (; results[printed]; printed++) {
      const { photo, ...result } = results[printed];
      const name = photo.name.padEnd(width);
      const size = formatSize(photo.size).padStart(8);
      printLine(
        result.ok
          ? `  ${style.green("✔")} ${name}  ${size} → ${formatSize(result.size)}`
          : `  ${style.red("✘")} ${name}  ${size}  ${style.red(result.error)}`,
      );
    }
  };

  const worker = async () => {
    while (started < photos.length) {
      const index = started++;
      results[index] = await compress(photos[index], quality);
      finished++;
      printReady();
    }
  };

  await withSpinner(
    () => `Compressing… ${style.dim(`${finished}/${photos.length}`)}`,
    () => Promise.all(Array.from({ length: CONCURRENCY }, worker)),
  );

  return results;
}

function printScan(dir: string, quality: number, { photos, alreadyCompressed, rawWithJpg }: Scan): void {
  console.log(`${style.bold(displayPath(dir))}  ${style.dim(`· quality ${quality}`)}\n`);

  const width = Math.max(...photos.map((photo) => photo.name.length));
  for (const photo of photos) {
    const raw = photo.kind === "raw" ? style.dim("  raw") : "";
    console.log(`  ${photo.name.padEnd(width)}  ${formatSize(photo.size).padStart(8)}${raw}`);
  }

  const skipped = [
    alreadyCompressed > 0 && `${alreadyCompressed} already compressed`,
    rawWithJpg > 0 && `${rawWithJpg} RAW with a matching JPG`,
  ].filter(Boolean);

  if (skipped.length > 0) {
    const separator = photos.length > 0 ? "\n" : "";
    console.log(style.dim(`${separator}  Skipped ${alreadyCompressed + rawWithJpg}: ${skipped.join(" · ")}`));
  }
}

function summary(results: Result[]): string {
  const done = results.filter((result) => result.ok);
  const failed = results.length - done.length;
  const before = done.reduce((sum, { photo }) => sum + photo.size, 0);
  const after = done.reduce((sum, result) => sum + result.size, 0);

  const parts = [`Compressed ${plural(done.length, "photo")}`];
  if (failed > 0) parts.push(style.red(`${failed} failed`));
  if (done.length > 0) parts.push(`${formatSize(before)} → ${style.bold(formatSize(after))}`);

  const icon = failed > 0 ? style.red("✘") : style.green("✔");
  return `${icon} ${parts.join(style.dim(" · "))}`;
}

function help(): void {
  console.log(`\
${style.bold("Usage:")} camsqz [dir] [options]

Compresses the photos in a folder into ${style.bold("<name>_compressed.jpg")} files next to the
originals. Reads JPG and ARW (Sony RAW) files. Only looks at the folder
itself, not its subfolders, and never changes the originals.

${style.bold("Arguments:")}
  [dir]              Folder with the photos (default: the current folder).

${style.bold("Options:")}
  -n, --dry-run      List the photos it would compress, then stop.
  -y, --yes          Compress without asking first.
  -q, --quality <n>  JPEG quality from 1 to 100 (default: ${DEFAULT_QUALITY}).
  -h, --help         Show this help message.

${style.bold("Skips:")}
  - Photos that already have a <name>_compressed.jpg, so it's safe to run again.
  - RAW files with a JPG of the same name. The JPG is compressed instead.`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

function parseCli() {
  try {
    return parseArgs({
      args: process.argv.slice(2),
      allowPositionals: true,
      options: {
        "dry-run": { type: "boolean", short: "n" },
        yes: { type: "boolean", short: "y" },
        quality: { type: "string", short: "q" },
        help: { type: "boolean", short: "h" },
      },
    });
  } catch (error) {
    bail(`${(error as Error).message}\nRun 'camsqz help' to see the options.`);
  }
}

async function main(): Promise<void> {
  const { values, positionals } = parseCli();

  if (values.help || positionals[0] === "help") return help();
  if (positionals.length > 1) bail("Pass a single folder. Run 'camsqz help' to see the options.");
  if (!Bun.which("sips")) bail("sips is not available. It comes with macOS.");

  const quality = Number(values.quality ?? DEFAULT_QUALITY);
  if (!Number.isInteger(quality) || quality < 1 || quality > 100) {
    bail(`Invalid quality: "${values.quality}". Use a whole number from 1 to 100.`);
  }

  const dir = resolve(positionals[0] ?? ".");
  const dirStat = await stat(dir).catch(() => undefined);
  if (!dirStat?.isDirectory()) bail(`Not a folder: ${dir}`);

  const found = await scan(dir);
  printScan(dir, quality, found);

  const { photos } = found;
  if (photos.length === 0) {
    console.log(style.dim(`\nNothing to compress`));
    return;
  }

  const totalSize = formatSize(photos.reduce((sum, photo) => sum + photo.size, 0));

  if (values["dry-run"]) {
    console.log(style.dim(`\nDry run: ${plural(photos.length, "photo")} (${totalSize}) would be compressed`));
    return;
  }

  console.log();
  if (!values.yes) {
    if (!process.stdin.isTTY) bail("Run with -y to compress without asking.");
    if (!confirm(`Compress ${plural(photos.length, "photo")} (${totalSize})?`)) {
      console.log(style.dim("Nothing was compressed"));
      return;
    }
    console.log();
  }

  // Set only now: confirm() blocks, so a handler would delay Ctrl+C at the prompt.
  // Exiting through process.exit runs the "exit" handler that removes partial files.
  process.on("SIGINT", () => process.exit(130));

  const results = await compressAll(photos, quality);
  console.log(`\n${summary(results)}`);
  if (results.some((result) => !result.ok)) process.exit(1);
}

await main();
