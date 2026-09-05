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

## Prototype language

Terms below are decided in `chest/prototype/` (`pchest.ts`/`fixtures.ts`) but not yet real — the real engine (`chest/engine/types.ts`) doesn't implement them. They'll move into the section above once ported into the real `chest` build, per this repo's stated prototype → final workflow.

**Config scan**:
Candidate replacement for Config entry. A dynamic, non-Entry content-diff scan over a fixed list of source/target pairs — the same mechanism as Bin scan, applied to dotfile-style config files instead of `bin/` scripts. Covers `gitconfig`, `config.fish`, `starship.toml`, `zed-settings`, `zed-keymap`, plus `skhdrc` and `karabiner.json` (which today silently get no drift check at all — their real Entries' Check is presence-only). Each file's copy step instead folds into its owning app/cli Entry's Install, matching the precedent `skhd` and `karabiner-elements` already set in real code. Not shown in Setup — only in Sync, as its own section, sibling to Bin scan rather than merged into it.
_Avoid_: Config entry (the real term today — retire it once this is ported; a config file stops being a separately selectable, separately installed Manifest Entry)

**Out-of-sync**:
A status meaning a Config scan or Bin scan pair exists on disk but its content differs from its source — distinct from Missing (doesn't exist at all). Applies only to these two scans; every Category (cli/app/font/system) stays boolean Missing/Satisfied, since `chest` deliberately doesn't check versioning for apps/clis/fonts/system. Extends to Bin scan too, once ported — Bin scan's real satisfied/drifted pairing has the same blind spot Config entries had (a bin script never copied to its target at all reads as "drifted" rather than "missing").
_Avoid_: drifted (that literal is already BinState's real status value for a narrower meaning — reusing it here would make one word mean two different distinctions until fully ported), changed (the ad-hoc hint text this replaces)

**Check failed**:
A status meaning a Check itself errored — the command didn't run cleanly (not found, no permission, timed out) — rather than running and reporting Missing. Distinct from Missing, which means the Check ran fine and reported false; chest has no real answer either way here, so the item is never disabled or auto-assumed to be one status or the other. Any Entry or scan pair can land here, the same way any of them can error. Shown selectable everywhere (never disabled, since there's no proof it's already satisfied) and grouped separately in Sync ("Couldn't check"), never merged into Missing or Out-of-sync.
_Avoid_: unknown (too vague — collides with the unrelated "Remote sync status unknown" case), error (ambiguous with a hard crash of chest itself, rather than one Check's command failing)

**Bootstrap step**:
Candidate replacement mechanism for the real Bootstrap. Instead of a separate outside-the-model bash script, chest's own first task — install, per requirement (on a fresh machine: Xcode Command Line Tools, Homebrew, git, cloning this repo, creating `$GLOBAL_BINS`). One-time and Setup-only, same as the real Bootstrap it replaces — Sync never installs these, it only checks they're already present (a concurrent presence check, not a sequential install) and refuses to run at all if anything's missing, pointing at Setup instead of trying to fix it. Setup installs, in order, as one continuous spinner whose message tracks the current item rather than a line per item. Silent, no-prompt retries (3 attempts) on each item; only once an item exhausts its retries does it become interactive — the captured failure output is shown, then a real choice (Retry / Abort the whole Sweep). The real Bootstrap's reason for living outside the Manifest/Engine model — "chest itself needs Bun to run" — goes away once chest ships as a compiled binary instead of a Bun script, which is what makes folding this into chest itself possible.
_Avoid_: Bootstrap (the real term today, still describing the live `bootstrap.sh` — reserved for this mechanism's end state once ported, same word-collision reason Config scan avoids "Config entry" until it replaces it)
