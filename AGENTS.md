# Environment
The repository where the user keeps their dotfiles, guides, tools, scripts and apps. It keeps multiple machines in sync as the user's needs change.

## Problem space
This repository solves three problems:
- Setting up a brand new macOS machine.
- Syncing files (e.g. dotfiles, tools) in this repo with the current machine.
- Keeping each machine in shape over time (e.g. `reclaim` freeing disk space).

## Source of truth
This repo is the user's system. Every machine is built from it. The current machine is just a copy, and copies drift.

So when the user asks about "my system", check both before you answer. The repo says what should be there. The current machine shows what drifted. The repo wins, but always report the drift. Something on the machine but not in the repo isn't needed, but ask before removing it.

Change the repo, not just the machine. Otherwise the next machine won't get it.

| Change | Goes in |
|---|---|
| Homebrew formula, cask or tap | `setup/Brewfile` |
| Cargo crate | `setup/Brewfile` (`cargo "<name>"`) |
| Anything installed outside Homebrew (Rosetta, Rust toolchain, Node) | `setup/steps/packages.sh` |
| Config file in `$HOME` | `dotfiles/` |
| PATH or environment variable | `dotfiles/.config/fish/config.fish` |
| Global keyboard shortcut | `dotfiles/.skhdrc` |
| Key remapping (e.g. the Hyper key) | `dotfiles/karabiner/` |
| The user's own CLI | `tools/`, linked from `dotfiles/bin/` |
| Default shell, linking the dotfiles, background services (e.g. skhd) | `setup/steps/config.sh` |
| System setting with a CLI (`defaults`), login items, the Dock | `setup/steps/desktop.sh` |
| Something no step covers | a new `setup/steps/<name>.sh`, added to `STEPS` in `setup/index.sh` |
| System setting with no CLI, before the repo is cloned | `guides/new-mac-setup.md` |
| App login, license key, permission, setting with no CLI | `guides/manual-steps.md` |

Just trying something out? Ask before adding it to the repo.

## Preferences
- We should only support macOS.
- Use Homebrew as primary package manager for installing anything.

## Glossary
- **Tool**: a CLI the user can run from anywhere. Its source lives in `tools/<name>/`, and `dotfiles/bin/<name>` symlinks to it. The name of that link is the command name.
- **Guide**: one or more Markdown files in `guides/` the user follows by hand, for anything not automated by a script/tool. `guides/manual-steps.md` catalogs the manual steps for setting up a new machine (app logins, license keys, settings with no CLI). Check it before assuming a manual step is undocumented.
- **Setup**: the script that builds any machine, new or not, from this repo. It's made of **steps**, one script each in `setup/steps/`.
- **Hyper key**: Control + Option + Shift + Command as one key, used by skhd shortcuts.

## Dotfiles
`dotfiles/` mirrors the user's home directory. The `envsync` tool (a GNU Stow wrapper) symlinks each file in it into `$HOME`, so `dotfiles/.gitconfig` is `~/.gitconfig`.

- Editing a file in `dotfiles/` affects the current machine right away.
- This includes tools, since `dotfiles/bin/` links into `tools/`.
- A file that is added, removed or renamed only reaches the machine after `envsync` runs.
- Everything in `dotfiles/` gets linked except what `dotfiles/.stow-local-ignore` lists.

## Setup
`setup/index.sh` runs on a new machine, and again on any machine later to bring it back in line with the repo. Both must work, so running it again only changes what drifted. On a re-run it:

- Skips every finished step.
- Upgrades outdated Homebrew packages (`brew bundle`).
- Re-links the dotfiles with `envsync`.
- Reapplies the settings in `desktop.sh`, restarting the Dock and Finder.
- Clears caches with `reclaim`.

### Writing a step
Every action in a step must be safe to run on a machine that already has it. Do it one of two ways:

- **Check first**: test if it's done and print `Already <...>` when it is. Needed for anything that installs, asks for a password, appends or takes long.
- **Converge**: a write whose result is the same however often it runs, like `defaults write` or replacing a whole list. Never append (`>>`, `tee -a`) without a check.

Also:
- A failure warns and keeps going: `warn` with what to do by hand, usually pointing to `guides/manual-steps.md`. Don't let `set -e` end the step.
- Each step is its own script that can run alone. Its header says what it does and which steps it needs. `STEPS` in `setup/index.sh` sets the order.
- Written for the macOS system bash (3.2), as Homebrew's isn't installed yet: no associative arrays, and an empty array errors under `set -u`.
- Use `step` and `warn` from `setup/steps/lib.sh`, and `$REPOSITORY_DIR` for paths in the repo, as `~/bin` may not be linked yet.

## Common tasks
### Adding a dotfile
Move the real file into `dotfiles/` at the same path it has in `$HOME`, then run `envsync` to link it back. See `tools/envsync/README.md` for full documentation.

### Adding a tool
Write `tools/<name>/index.(ts,sh)`, starting with a shebang, and make it executable. The tool's name should be the same as the link's name. It isn't done until it's linked:

```sh
ln -s ../../tools/<name>/index.<ext> dotfiles/bin/<name>
```

### Testing a setup change
Run the step you changed on this machine, twice: `bash setup/steps/<name>.sh`. The second run should only print `Already <...>` and change nothing. It can upgrade Homebrew packages and ask for a password, so ask first.
