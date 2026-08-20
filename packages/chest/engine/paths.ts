import { resolve } from "node:path";

function fallbackRepoRoot(): string {
  return resolve(import.meta.dir, "../../..");
}

export const REPO_ROOT = process.env.ENVIRONMENT_REPOSITORY ?? fallbackRepoRoot();

export const BIN_DIR = `${REPO_ROOT}/bin`;

export const BIN_TARGET_DIR = process.env.GLOBAL_BINS ?? `${process.env.HOME}/bin`;

export const CONFIGS_DIR = `${REPO_ROOT}/packages/chest/configs`;

export function configSource(relativePath: string): string {
  return `${CONFIGS_DIR}/${relativePath}`;
}
