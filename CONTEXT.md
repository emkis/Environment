# Environment

Scripts and configuration that replicate my macOS setup across devices, driven by `chest` — a CLI that checks a declarative manifest against the current machine and lets me interactively install what's missing or resync what's drifted.

## Language

**Manifest**:
The full set of Entries, split across one TypeScript file per Category, that together describe the desired state of a machine.
_Avoid_: recipe, config list

**Entry**:
A single unit in the Manifest — a `name`, `category`, `check`, `install`, and optionally `requires` and `manualStepsRef`. Every field is written explicitly per Entry; nothing is derived from a type.
_Avoid_: tool, recipe, step

**Category**:
The fixed classification of an Entry, used to group the interactive picker on screen and to split Manifest source files. One of: `cli`, `app`, `font`, `config`, `system`. Does not correspond to a separate CLI invocation — `chest` always sweeps every Category in one run; Category is purely an organizing label.
_Avoid_: type, kind, system-setting

**Check**:
A shell command on an Entry whose exit code determines whether that Entry is already satisfied on the current machine. Always run live — never cached.
_Avoid_: detection, installer check

**Install**:
The command, or ordered list of commands, that brings an Entry from unsatisfied to satisfied. A single Entry's Install can fold in steps that belong to it but aren't separately meaningful (e.g. Java is folded into the `android-studio` Entry's Install, since it's invisible outside that context).
_Avoid_: installer, run.sh

**Requires**:
An optional list of other Entry names that must already be satisfied before this Entry's Install can run. Used when a dependency is itself a separately meaningful, separately checkable Entry (e.g. `eas-cli` requires `pnpm`) — as opposed to a dependency invisible enough to fold into Install directly.
_Avoid_: dependency, prerequisite

**Manual step**:
An action needed to fully satisfy an Entry that cannot be automated (almost always a GUI action). Lives in `MANUAL-STEPS.md`, one heading per Entry; the Entry itself only carries a `manualStepsRef` pointer to that heading, never the instructions inline.
_Avoid_: dotfile note, readme step

**Config entry**:
An Entry in the `config` Category whose Check is a content diff (repo source path vs. target path on disk) rather than a boolean presence check. Covers files like `.gitconfig`, `config.fish`, `starship.toml`, and Zed's settings/keymap.
_Avoid_: dotfile — most of these files (e.g. `config.fish`) don't start with a literal dot; "dotfile" is a loose Unix convention name, not an accurate technical description here.

**Bin scan**:
The dynamic, on-the-fly walk of `bin/` that diffs every file in it against its target path, using the same content-diff mechanism as a Config entry but not implemented as Manifest Entries — a new script in `bin/` is picked up automatically with no Manifest edit. Shown as its own section on screen, sibling to `config` rather than folded into it.
_Avoid_: sync-bins (the old standalone script this replaces)

**chest**:
The CLI entrypoint. Takes no arguments (aside from `chest help`) — every invocation runs a full Sweep. Locates this repo via the `ENVIRONMENT_REPOSITORY` env var when run as a global command.
_Avoid_: envctl (earlier working name), setup script, installer

**Sweep**:
The one thing `chest` does — checks every Entry across every Category plus the Bin scan, shows status grouped by Category on screen, and offers an interactive multiselect (missing or drifted items pre-checked by default) for which ones to Install or resync. There is no narrower invocation; a Sweep always covers everything, and "checking status" vs. "syncing" are the same Sweep, not different commands.
_Avoid_: run, pass, category-scoped sweep

**Bootstrap**:
The one-time, non-Manifest plain-bash step (`bootstrap.sh`) that installs Homebrew and Bun on a machine that has neither — the only thing in this repo that exists outside the Manifest/Engine model, because `chest` itself needs Bun to run. Deliberately stays isolated: it prints an instruction to run `chest` next rather than invoking it itself.
_Avoid_: setup, init script

**Engine**:
The implementation behind `chest` — Sweep logic, the interactive picker, diffing, and the Bin scan. Kept structurally separate from the Manifest (data) and from Config entries' source files, even though all three live together under `chest`'s own directory.
_Avoid_: core, lib, backend

**Independent tool**:
A self-contained CLI script (`ide`, `llmt`, `vspeed`) that gets synced into `$GLOBAL_BINS` by the Bin scan same as `chest`, but has no dependency on the Manifest, Config entries, or the Engine — unlike `chest`, which depends on all three.
_Avoid_: bin script (ambiguous — chest's own launcher also sits in bin/)

**ENVIRONMENT_REPOSITORY**:
The env var, set once in `config.fish`, that tells `chest` where this repo lives on disk — needed because `chest` itself is copied flatly into `$GLOBAL_BINS` and loses its original repo-relative location. Follows the same precedent as `llmt`'s `PROMPTS_REPOSITORY`.
_Avoid_: CHEST_HOME, CHEST_REPO
