import { readdir } from "node:fs/promises";
import { BIN_DIR, BIN_TARGET_DIR } from "./paths.ts";
import type { SweepDeps } from "./types.ts";

async function exec(cmd: string): Promise<{ ok: boolean }> {
  const proc = Bun.spawn(["sh", "-c", cmd], {
    stdin: "inherit",
    stdout: "inherit",
    stderr: "inherit",
  });

  return { ok: (await proc.exited) === 0 };
}

async function diffFile(src: string, dest: string): Promise<boolean> {
  const source = Bun.file(src);
  const target = Bun.file(dest);

  if (!(await target.exists())) return false;
  if (source.size !== target.size) return false;

  const [sourceBytes, targetBytes] = await Promise.all([source.bytes(), target.bytes()]);
  return Buffer.from(sourceBytes).equals(Buffer.from(targetBytes));
}

async function listDir(path: string): Promise<string[]> {
  const entries = await readdir(path, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .sort();
}

export const runtimeDeps: Omit<SweepDeps, "prompt"> = {
  exec,
  diffFile,
  listDir,
  binDir: BIN_DIR,
  binTargetDir: BIN_TARGET_DIR,
};
