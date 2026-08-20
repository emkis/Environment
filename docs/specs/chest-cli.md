# chest: a declarative-manifest CLI for machine setup and drift-checking

## Problem Statement

I maintain a personal macOS setup across two computers using this repo. Today that means six `recipes/*/run.sh` scripts, each a linear `brew install` blast through a domain (core deps, bluetooth, window manager, user apps, dev env), run manually in an order that isn't written down anywhere authoritative. None of them can tell me whether a given tool is already installed — running a recipe again just re-runs every command from scratch. Adding a newly-discovered tool means finding the "right" recipe file and appending a line to it, which stops making sense as a mental model once there's no clear place a new tool belongs. Separately, `bin/sync-bins` blindly deletes and recopies the entire `bin/` directory into `$GLOBAL_BINS` with no diffing, so I have to remember to run it — on both machines — every time I add or edit a script, and it gives no indication of what's actually out of date.

The result: I can't answer "what's missing on this machine," I can't answer "what's out of sync since I last touched this repo," and setting up a brand-new machine means manually running six scripts in an order I have to remember.

## Solution

`chest` — a single CLI, invoked with zero arguments, that performs one Sweep: it checks every Entry in a declarative Manifest against the current machine live (no cached state), groups the results on screen by Category, and offers an interactive multiselect (missing or drifted items pre-checked by default) for which ones to install or resync. The same invocation covers new-machine setup, a routine "what's missing" check, and "I just edited gitconfig, sync it" — there is no separate command for any of these; they're the same Sweep run at different times.

Adding a new tool later means adding one Entry to the relevant Category's Manifest file — no script to find, no order to remember. `bin/` syncing becomes a Bin scan inside the same Sweep, diffing every file in `bin/` against its target automatically, so a new script just works on the next run with no Manifest edit at all.

## User Stories

1. As the machine owner, I want to run one command with no arguments on a brand-new Mac, so that I can see everything that needs installing without hunting through recipe files or remembering an order.
2. As the machine owner, I want that same command to also work on a machine I've already set up, so that I can check what's missing or drifted without a separate "status" command to remember.
3. As the machine owner, I want every check to run live against the actual machine every time, so that a stale cached state can never lie to me about what's actually installed.
4. As the machine owner, I want missing or drifted items to be grouped on screen by Category (`cli`, `app`, `font`, `config`, `system`), so that I can scan a large list without it being an undifferentiated wall of items.
5. As the machine owner, I want missing/drifted items pre-checked by default in the picker, so that I only have to uncheck the few things I don't want this run, rather than checking most of a long list every time.
6. As the machine owner, I want already-satisfied Entries to show as satisfied rather than disappearing, so that I get a full picture of machine state, not just a diff.
7. As the machine owner, I want each Entry's install mechanism to be a plain shell `check` command and a plain shell `install` command (or ordered list of commands), so that there's exactly one way every Entry works, with no hidden per-type behavior to remember.
8. As the machine owner, I want an Entry's `install` to support an ordered list of steps, so that multi-step setups (e.g. installing fish, adding it to `/etc/shells`, then `chsh`-ing into it) don't need a separate script file.
9. As the machine owner, I want invisible dependencies (Java for Android Studio, Node via `fnm`, Karabiner's config file, skhd's config + service start) folded into their owning Entry's `install` steps, so that they don't clutter the picker as separately-meaningful items I'd have to individually select.
10. As the machine owner, I want a `requires` field on an Entry naming other Entries that must already be satisfied first (e.g. `eas-cli` requires `pnpm`), so that picking a dependent tool without its prerequisite fails clearly (or auto-includes the prerequisite) instead of failing with a raw shell error.
11. As the machine owner, I want the five bluetooth devices I pair (trackpad, headphones, keyboard, mouse, speaker) modeled as individual `system` Entries each requiring `blueutil`, so that pairing state is checked the same way as every other Entry rather than living in a bespoke script.
12. As the machine owner, I want config files (`.gitconfig`, `config.fish`, `starship.toml`, Zed's settings/keymap, `karabiner.json`) checked by content diff against their target path rather than a boolean presence check, so that an edited-but-already-installed file correctly shows as drifted.
13. As the machine owner, I want the `bin/` directory scanned dynamically at runtime — every file diffed against its target path — rather than requiring one Manifest Entry per script, so that a new script I add to `bin/` is picked up automatically with no Manifest edit.
14. As the machine owner, I want the Bin scan shown as its own section on screen, separate from the `config` Category, so that I can tell at a glance whether it's a tracked config file or a bin script that's drifted.
15. As the machine owner, I want steps that can't be automated (GUI-only actions like Rectangle Pro's iCloud config import, or Android Studio's first-launch SDK license) to live in a single consolidated `MANUAL-STEPS.md`, with the relevant Entry only carrying a pointer to it, so that the Manifest itself stays lean and instructions don't get duplicated per-recipe.
16. As the machine owner, I want `chest` to print the relevant `MANUAL-STEPS.md` pointer after installing an Entry that has one, and summarize all touched pointers at the end of a Sweep, so that I don't forget a manual step is still needed.
17. As the machine owner, I want `chest help` to print usage, and any other/unknown argument to also print usage and exit non-zero, so that the CLI behaves consistently with the other scripts already in this repo (`ide`, `llmt`, `vspeed`).
18. As the machine owner, I want `chest` to locate this repo via an `ENVIRONMENT_REPOSITORY` environment variable (set once in `config.fish`), so that it still works correctly after being copied flatly into `$GLOBAL_BINS` and losing its original repo-relative location.
19. As the machine owner, I want `bootstrap.sh` to remain a small, standalone plain-bash script that only installs Homebrew and Bun, so that it can run on a machine with nothing else present, before `chest` itself can run.
20. As the machine owner, I want `bootstrap.sh` to print an explicit instruction to run `chest` next rather than invoking it automatically, so that the two stay clearly separated and `bootstrap.sh` never has to know anything about `chest`'s internals.
21. As the machine owner, I want `chest`'s own implementation (Sweep logic, the picker, diffing, the Bin scan) organized under its own directory separate from the Manifest data and Config entries' source files, so that the coupling between them is visible in the repo layout rather than scattered across `bin/`.
22. As the machine owner, I want `ide`, `llmt`, and `vspeed` relocated into their own package directories with unchanged behavior, so that every tool in this repo — independent or not — follows the same folder-per-tool convention, with `bin/` holding only thin launcher shims.
23. As the machine owner, I want one root `package.json` and `tsconfig.json` covering every tool, so that I have a single dependency list and a single type-check across the whole repo rather than maintaining per-tool config for tools that don't need it.
24. As the machine owner, I want every existing recipe's tools migrated into Manifest Entries under the correct Category (see inventory below), so that `chest` is immediately usable for real setup, not just a scaffold with no data.
25. As the machine owner, I want `recipes/managing-backups` and `utilities/` left completely untouched by this work, so that the rclone backup job and image-compression utility — which are jobs, not "is this installed" checks — aren't forced into a shape that doesn't fit them.
26. As the machine owner, I want the closed Category set (`cli`, `app`, `font`, `config`, `system`) enforced as the only valid values, so that a typo'd category can't silently create a new, unintended grouping in the picker.
27. As the machine owner, I want every Entry written fully explicitly (no auto-derived `check`/`install` based on an installer type), so that there's exactly one mental model for every Entry regardless of what it installs, and casks (which install `.app` bundles, not binaries) can't silently get a broken `command -v` check.
28. As the machine owner, I want the root `readme.md` updated to describe the new two-step flow (`bootstrap.sh`, then `chest`) instead of the old six-recipe manual order, so that the documented setup process matches what actually exists.

## Implementation Decisions

**Repo layout**:
```
Environment/
├── package.json                 # one dependency list for the whole repo
├── tsconfig.json                # one type-check config for the whole repo
├── bin/                         # thin launcher shims only, synced via the Bin scan
│   ├── chest
│   ├── ide
│   ├── llmt
│   └── vspeed
├── packages/
│   ├── chest/
│   │   ├── main.ts              # entrypoint bin/chest resolves into
│   │   ├── engine/              # Sweep logic, picker, diffing, Bin scan
│   │   ├── manifest/            # one file per Category: cli.ts, app.ts, font.ts, config.ts, system.ts
│   │   └── configs/             # source files Config entries point at (gitconfig, config.fish, starship.toml, karabiner.json, zed/settings.json, zed/keymap.json)
│   ├── ide/main.ts
│   ├── llmt/main.ts
│   └── vspeed/main.ts
├── bootstrap.sh
├── MANUAL-STEPS.md
├── CONTEXT.md
├── docs/adr/
├── recipes/managing-backups/    # untouched
├── utilities/                    # untouched
└── readme.md
```
See ADR-0007, 0008, 0009 for the rationale behind this layout and the zero-argument CLI decision.

**Entry schema** (every field explicit, per ADR-0003 — no typed-installer derivation):
- `name: string`
- `category: "cli" | "app" | "font" | "config" | "system"`
- `check: string` — shell command; exit 0 means already satisfied
- `install: string | string[]` — single command or ordered steps
- `requires?: string[]` — other Entry names that must already be satisfied first
- `manualStepsRef?: string` — pointer into `MANUAL-STEPS.md`, e.g. `"MANUAL-STEPS.md#rectangle-pro"`

Config entries use the same shape, but `check` is a content diff of a repo source path against a target path on disk rather than a boolean shell check.

**The `sweep()` seam** (agreed testing seam, see Testing Decisions): the entire Engine funnels through one function taking the Manifest as plain data plus injected dependencies for every side effect:
```ts
sweep(manifest: Entry[], deps: {
  exec: (cmd: string) => Promise<{ ok: boolean }>,
  diffFile: (src: string, dest: string) => Promise<boolean>,
  listDir: (path: string) => Promise<string[]>,
  prompt: (groups: PickerGroup[]) => Promise<string[]>,
}): Promise<SweepResult>
```
`bin/chest`'s real implementation wires `exec`/`diffFile`/`listDir` to actual shell/filesystem calls and `prompt` to the real interactive picker (`@clack/prompts` multiselect, missing/drifted items pre-selected, grouped by Category, Bin scan as its own group).

**`ENVIRONMENT_REPOSITORY` resolution**: every `bin/` shim resolves its package via this env var (e.g. `${ENVIRONMENT_REPOSITORY}/packages/chest/main.ts`), consistent with `llmt`'s existing `PROMPTS_REPOSITORY` pattern. This must be set in `config.fish` as part of the dev-env Manifest migration (see inventory below).

**Bootstrap handoff**: `bootstrap.sh` stays a standalone plain-bash script (installs Homebrew, then Bun) and ends by printing an instruction to run `chest` next — it does not invoke `chest` itself (ADR confirmed in conversation, not yet written as its own ADR since the decision was low-stakes/easily reversible).

**Manifest inventory to migrate** (source: the six existing `recipes/*/run.sh` scripts):

| Category | Entries |
|---|---|
| `cli` | `bash`, `fzf`, `git`, `blueutil`, `skhd` (install steps include copying `.skhdrc` and running `--start-service`/`--reload`, folded per ADR discussion), `fish` (install steps: brew install, add to `/etc/shells`, `chsh`), `starship`, `fnm` (install steps fold `fnm install --lts` for Node), `bun`, `pnpm`, `git-recent` (`requires: [pnpm]`), `eas-cli` (`requires: [pnpm]`), `watchman`, `bat`, `eza`, `zoxide`, `tree`, `tokei`, `tock`, `claude-code` (install via the `curl \| bash` installer script), `gnupg` |
| `app` | `karabiner-elements` (install steps fold copying `karabiner.json` and running the karabiner setup logic), `rectangle-pro` (`manualStepsRef` → iCloud sync/import steps), `notion`, `ticktick`, `surfshark`, `zen`, `google-chrome`, `firefox`, `bitwarden`, `the-unarchiver`, `iina`, `shottr`, `mos`, `clipy`, `raycast`, `hex`, `android-studio` (install steps fold `zulu@17`, per the Java-is-Android-only decision), `vscode`, `zed`, `warp`, `orbstack` |
| `font` | `fira-code`, `fira-code-nerd-font` |
| `config` | `gitconfig` (→ `~/.gitconfig`), `config.fish` (→ `~/.config/fish/config.fish`), `starship.toml` (→ `~/starship.toml`, preserving the existing non-XDG target path from the current script), `zed-settings` (→ `~/.config/zed/settings.json`), `zed-keymap` (→ `~/.config/zed/keymap.json`) |
| `system` | `dock-autohide` (two `defaults write` calls + `killall Dock`), `ssh-key` (check: `test -f ~/.ssh/id_rsa.pub`; install: `ssh-keygen` + `ssh-add` + `pbcopy`), 5 bluetooth device Entries — `bluetooth-trackpad`, `bluetooth-headphones`, `bluetooth-keyboard`, `bluetooth-mouse`, `bluetooth-bose-speaker` — each `requires: [blueutil]`, check via `blueutil --paired`, install via `blueutil --pair` (decomposed from the existing `pair_device_if_needed` logic in `setup-devices.sh`, which already does per-device idempotent pairing and can be ported near-directly) |

`MANUAL-STEPS.md` needs authoring during this migration for at least: Rectangle Pro's iCloud sync/import (from the current window-manager recipe readme), Karabiner's accessibility permission grant, and Android Studio's first-launch SDK license acceptance.

`recipes/*` (all six folders) are retired once their contents are migrated, except `recipes/managing-backups`, which stays exactly as-is (ADR-0006).

## Testing Decisions

Testing is deprioritized for this implementation pass — the focus is getting the system working end-to-end first. The `sweep()` function described above is the agreed seam for future test coverage: fake `exec`/`diffFile`/`listDir`/`prompt` implementations can exercise grouping, `requires` resolution, pre-selection defaults, and which commands would run, without touching real shell state, the filesystem, or a terminal. No specific test cases are required for this spec to be considered complete.

## Out of Scope

- `recipes/managing-backups` and `utilities/` — untouched (ADR-0006).
- Per-tool `package.json` / full Bun workspaces — deferred until a specific tool needs real dependency isolation (ADR-0008).
- Automating any step captured in `MANUAL-STEPS.md` — these are GUI-only by definition and stay manual.
- Single-entry CLI targeting (e.g. `chest config gitconfig`) — considered and rejected; category-level Sweep grouping is sufficient (ADR-0007).
- A scaffolding command (`chest add`) for authoring new Entries — rejected; new Entries are hand-written directly into the relevant `packages/chest/manifest/<category>.ts` file.
- Any persisted state/cache of previous Sweep results — rejected; every Sweep re-checks everything live (ADR-0004).

## Further Notes

Full rationale for every structural and naming decision referenced above lives in `CONTEXT.md` (glossary) and `docs/adr/0001` through `0009`. This spec assumes that context rather than re-deriving it.
