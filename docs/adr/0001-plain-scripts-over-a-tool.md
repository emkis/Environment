# 0001 — Plain scripts and symlinks, not a tool

Date: 2026-09-05
Status: accepted

## Context

Earlier versions of this repository shipped `chest`, a TypeScript CLI over a
manifest: one entry per package with a `check` command, an `install` command, and
a dependency graph, plus an interactive picker for what to install. It was
prototyped twice more (`pchest`, `xchest`) before anything shipped.

Two things settled the question:

- The requirement is "if it's on the list, install it". There is nothing to pick,
  so the picker — the tool's main reason to exist — had no job.
- Almost every manifest entry was `brew install <name>` behind a hand-written
  `check`. `brew bundle` already does that, better, for the whole list at once.

The remaining need is small: run a list of packages, put some files in place, and
apply a few macOS settings.

## Decision

Delete the tool. The repository is:

- `Brewfile` — the package list, run by `brew bundle install`.
- `setup.sh` — new machine, top to bottom, idempotent.
- `link.sh` — symlinks `home/**` into `$HOME`.
- `macos.sh` — the settings Homebrew can't express.

Dotfiles are **symlinked, not copied**. The repository holds the only copy, so an
edit is live immediately and a `git pull` on a second machine updates that machine
with no apply step. `link.sh` is only needed when the set of files changes.

`home/` mirrors `$HOME`, so a file's destination is its own path. There is no
mapping table.

## Consequences

- No `check` commands to write or keep accurate: `brew bundle` knows what's
  installed, and a symlink either points at the repository or doesn't.
- No install ordering to maintain by hand — Homebrew resolves dependencies.
- No rollback. Re-running an idempotent script is the recovery path.
- Apps that rewrite their own config (Karabiner, Zed) replace the symlink with a
  real file when you change a setting through their UI. Documented in
  `MANUAL-STEPS.md`; `link.sh` restores the link and keeps the displaced file.
- Post-install verification is gone. Something like `skhd`, which installs cleanly
  but stays inert until you grant Accessibility, is caught by `MANUAL-STEPS.md`
  rather than by a tool.
- The `bin/` scripts stay TypeScript over Bun. They are separate tools that happen
  to live here, unrelated to setting up a machine.
