#!/usr/bin/env bun

import { $ } from "bun";
import { parse, resolve } from "node:path";

const DEFAULT_SPEED = 1.2;

function bail(message: string): never {
  process.stderr.write(message + "\n");
  process.exit(1);
}

function usage(): string {
  const scriptName = import.meta.path.split("/").pop() ?? "vspeed";
  return `\
Usage: ${scriptName} <input> [speed]

Arguments:
  <input>   Path to the input video file.
  [speed]   Playback speed multiplier (default: ${DEFAULT_SPEED}).
            Examples: 1.5 = 1.5x faster, 2 = 2x faster.

Output:
  Same directory and basename as the input, with a .mp4 extension.
  e.g. vspeed ./clip.mov 1.5  →  ./clip.mp4`;
}

const [, , inputArg, speedArg] = process.argv;

if (!inputArg) {
  bail(usage());
}

const input = resolve(inputArg);

if (!(await Bun.file(input).exists())) {
  bail(`File not found: ${input}`);
}

const speed = speedArg !== undefined ? Number(speedArg) : DEFAULT_SPEED;

if (!isFinite(speed) || speed <= 0) {
  bail(`Invalid speed: "${speedArg}". Must be a positive number.`);
}

const { dir, name } = parse(input);
const output = resolve(dir, `${name}.mp4`);

if (output === input) {
  bail(`Output would overwrite input. Rename the source file or use a different format.`);
}

console.log(`Input:  ${input}`);
console.log(`Output: ${output}`);
console.log(`Speed:  ${speed}x`);

const setpts = `setpts=${1 / speed}*PTS`;
await $`ffmpeg -i ${input} -af atempo=${speed} -vf ${setpts} ${output}`;
