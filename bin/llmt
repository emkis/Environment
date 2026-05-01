#!/usr/bin/env bun

import {
  execSync,
  spawnSync,
  type ExecSyncOptionsWithBufferEncoding,
} from "child_process";
import { join } from "path";
import {
  existsSync,
  mkdirSync,
  rmSync,
  renameSync,
  writeFileSync,
  readdirSync,
  statSync,
  readFileSync,
} from "fs";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Metadata {
  id: number;
  title: string;
  created_at: string;
}

interface Command {
  run(args: string[]): void;
}

// ── Config ────────────────────────────────────────────────────────────────────

const config = {
  get promptsRepo(): string {
    const dir = process.env.PROMPTS_REPOSITORY;
    if (!dir) bail("PROMPTS_REPOSITORY is not set. Add it to your zsh config.");
    return dir;
  },
  get ide(): string {
    const ide = process.env.IDE;
    if (!ide) bail("$IDE is not set.");
    return ide;
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function bail(message: string): never {
  console.error(`Error: ${message}`);
  process.exit(1);
}

function toKebabCase(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

const tasks = {
  list(repoRoot: string): string[] {
    return readdirSync(repoRoot)
      .filter((entry) => {
        const isDir = statSync(join(repoRoot, entry)).isDirectory();
        const hidden = entry.startsWith(".");
        return isDir && !hidden;
      })
      .sort();
  },

  readMetadata(path: string): Metadata {
    return JSON.parse(readFileSync(path, "utf8"));
  },

  uncommitted(repoRoot: string): string[] {
    const result = spawnSync(
      "git",
      ["ls-files", "--others", "--directory", "--exclude-standard"],
      { cwd: repoRoot, encoding: "utf8" },
    );
    const untrackedDirs = new Set(
      result.stdout
        .split("\n")
        .map((l) => l.replace(/\/$/, "").trim())
        .filter(Boolean),
    );
    return tasks.list(repoRoot).filter((dir) => untrackedDirs.has(dir));
  },
};

// ── UI ────────────────────────────────────────────────────────────────────────

const ui = {
  pick(items: string[]): string {
    const result = spawnSync("fzf", [], {
      input: items.join("\n"),
      encoding: "utf8",
      stdio: ["pipe", "pipe", "inherit"],
    });

    if (result.status !== 0 || !result.stdout.trim()) bail("no task selected");
    return result.stdout.trim();
  },

  confirm(message: string): boolean {
    const result = spawnSync("bash", ["-c", `read -p "${message} [y/N] " r && [[ "$r" == "y" || "$r" == "Y" ]]`], {
      stdio: "inherit",
    });
    return result.status === 0;
  },

  openInIDE(path: string): void {
    spawnSync(config.ide, [path], { stdio: "inherit" });
  },
};

// ── Git ───────────────────────────────────────────────────────────────────────

const git = {
  run(command: string, cwd: string): void {
    const opts: ExecSyncOptionsWithBufferEncoding = { cwd, stdio: "inherit" };
    try {
      execSync(command, opts);
    } catch {
      bail(`git command failed: ${command}`);
    }
  },

  commitTask(repoRoot: string, taskName: string, title: string): void {
    git.run(`git add ${taskName}/`, repoRoot);
    git.run(`git add ${id.filename}`, repoRoot);
    git.run(`git commit -m "Add task: ${title}"`, repoRoot);
    git.run("git push", repoRoot);
  },
};

// ── ID ────────────────────────────────────────────────────────────────────────

const id = {
  filename: ".llmt-next-id",

  read(repoRoot: string): number {
    const idFilePath = join(repoRoot, id.filename);
    const idFileContent = readFileSync(idFilePath, "utf8");
    return Number(idFileContent.trim());
  },

  write(repoRoot: string, next: number): void {
    const idFilePath = join(repoRoot, id.filename);
    writeFileSync(idFilePath, String(next));
  },

  readRemote(repoRoot: string): number | null {
    const fetch = spawnSync("git", ["fetch", "origin"], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    if (fetch.status !== 0) {
      console.warn("Warning: could not reach remote, using local ID (collision risk)");
      return null;
    }

    const show = spawnSync("git", ["show", `origin/main:${id.filename}`], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    if (show.status !== 0) return null;
    return Number(show.stdout.trim());
  },

  claim(repoRoot: string): number {
    const local = id.read(repoRoot);
    const remote = id.readRemote(repoRoot) ?? local;
    const next = Math.max(local, remote);
    id.write(repoRoot, next + 1);
    return next;
  },
};

// ── Templates ─────────────────────────────────────────────────────────────────

const templates = {
  researchPrompt(title: string): string {
    return `
# Research: ${title}
[Start here]

Read and study everything described above in great depth. Don't skim — understand the intricacies, the edge cases, and how the pieces fit together.

## Output
When you're done, write a detailed research report at \`research.md\`
`.trimStart();
  },

  planPrompt(title: string): string {
    return `
# Plan: ${title}
[Start here]

Based on the research above, write a detailed plan that includes:
- Code snippets showing the before and after for key changes
- The list of files that will be modified
- Trade-off considerations for any non-obvious decisions
- A detailed todo list broken into phases and individual tasks

Don't implement yet.

## Output
When you're done, write the plan at \`plan.md\`
`.trimStart();
  },

  executePrompt(): string {
    return `
Read the plan at \`plan.md\` and implement it all.
When you're done with a task or phase, mark it as completed in the plan.
Do not stop until all tasks and phases are completed.
Do not add unnecessary comments or JSDoc.
Do not use \`any\` or \`unknown\` types.
Continuously run typecheck to make sure you're not introducing new issues.
`.trimStart();
  },
};

// ── Commands ──────────────────────────────────────────────────────────────────

const commands = {
  new: {
    run([title]) {
      if (!title) bail('Usage: llmt new "<title>"');

      const repoRoot = config.promptsRepo;
      const nextId = id.claim(repoRoot);
      const prefix = String(nextId).padStart(4, "0");
      const dirName = `${prefix}-${toKebabCase(title)}`;
      const taskDir = join(repoRoot, dirName);

      if (existsSync(taskDir)) {
        bail(`directory already exists: ${taskDir}`);
      }

      mkdirSync(taskDir);

      const metadata: Metadata = {
        id: nextId,
        title,
        created_at: new Date().toISOString(),
      };

      writeFileSync(
        join(taskDir, "metadata.json"),
        JSON.stringify(metadata, null, 2),
      );
      writeFileSync(
        join(taskDir, "research.prompt.md"),
        templates.researchPrompt(title),
      );
      writeFileSync(
        join(taskDir, "plan.prompt.md"),
        templates.planPrompt(title),
      );
      writeFileSync(
        join(taskDir, "execute.md"),
        templates.executePrompt(),
      );

      console.log(`Created: ${taskDir}`);
      ui.openInIDE(repoRoot);
    },
  },

  list: {
    run() {
      const repoRoot = config.promptsRepo;
      const dirs = tasks.list(repoRoot);
      if (dirs.length === 0) bail("no task directories found");

      ui.openInIDE(join(repoRoot, ui.pick(dirs)));
    },
  },

  done: {
    run() {
      const repoRoot = config.promptsRepo;
      const dirs = tasks.list(repoRoot);
      if (dirs.length === 0) {
        bail("no task directories found");
      }

      let taskName = ui.pick(dirs);
      const metadata = tasks.readMetadata(
        join(repoRoot, taskName, "metadata.json"),
      );

      const remoteNext = id.readRemote(repoRoot);
      if (remoteNext !== null && metadata.id < remoteNext) {
        const localNext = id.read(repoRoot);
        const newId = Math.max(localNext, remoteNext);
        const newPrefix = String(newId).padStart(4, "0");
        const newDirName = taskName.replace(/^\d+/, newPrefix);

        console.warn(
          `Warning: ID ${String(metadata.id).padStart(4, "0")} already exists on remote. ` +
          `Renaming "${taskName}" → "${newDirName}".`,
        );

        renameSync(join(repoRoot, taskName), join(repoRoot, newDirName));
        metadata.id = newId;
        writeFileSync(
          join(repoRoot, newDirName, "metadata.json"),
          JSON.stringify(metadata, null, 2),
        );
        id.write(repoRoot, newId + 1);
        taskName = newDirName;
      }

      git.commitTask(repoRoot, taskName, metadata.title);
    },
  },

  delete: {
    run() {
      const repoRoot = config.promptsRepo;
      const dirs = tasks.uncommitted(repoRoot);
      if (dirs.length === 0) bail("no untracked task directories found");

      const taskName = ui.pick(dirs);
      const taskDir = join(repoRoot, taskName);

      if (!ui.confirm(`Delete "${taskName}"?`)) bail("aborted");

      rmSync(taskDir, { recursive: true, force: true });
      console.log(`Deleted: ${taskDir}`);
    },
  },

  help: {
    run() {
      console.log(`llmt - manage LLM prompt directories

Usage:
  llmt new "<title>"   Create a new task directory with prompt files
  llmt list            Pick a task with fzf and open it
  llmt done            Stage, commit, and push the selected task
  llmt delete          Delete an uncommitted task directory
  llmt help            Show this help

Environment variables (set in ~/.zshrc):
  PROMPTS_REPOSITORY   Path to the repository of prompts
  IDE                  IDE command for opening task directories
`);
    },
  },
} satisfies Record<string, Command>;

// ── Main ──────────────────────────────────────────────────────────────────────

const [, , command, ...args] = process.argv;

switch (command) {
  case "new":
    commands.new.run(args);
    break;
  case "list":
    commands.list.run();
    break;
  case "done":
    commands.done.run();
    break;
  case "delete":
    commands.delete.run();
    break;
  case "help":
    commands.help.run();
    break;
  default:
    commands.help.run();
    process.exit(1);
}
