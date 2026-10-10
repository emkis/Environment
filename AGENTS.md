# Environment
The repository where the user keeps their dotfiles, guides, tools and setup scripts for macOS. It solves three problems:
- Setting up a brand new machine.
- Syncing files (e.g. dotfiles, tools) in this repo with the current machine.
- Keeping each machine in shape over time (e.g. `reclaim` freeing disk space).

## Source of truth
This repo is the user's system. Every machine is built from it. The current machine is just a copy, and copies drift.

When the user asks about "my system", check both the repo and the machine. The repo wins, but always report the drift. Ask before removing something that's on the machine but not in the repo.

Change the repo, not just the machine. Otherwise the next machine won't get it.

| Change | Goes in |
|---|---|
| Homebrew formula, cask or tap (always the first choice) | `setup/Brewfile` |
| Cargo crate | `setup/Brewfile` (`cargo "<name>"`) |
| Anything Homebrew can't install (Rosetta, Rust toolchain, Node) | `setup/steps/packages.sh` |
| Config file in `$HOME` | `dotfiles/` |
| PATH or environment variable | `dotfiles/.config/fish/config.fish` |
| Global keyboard shortcut | `dotfiles/.skhdrc` |
| Key remapping (e.g. the Hyper key: Control + Option + Shift + Command) | `dotfiles/karabiner/` |
| The user's own CLIs | `tools/`, linked from `dotfiles/bin/` |
| Default shell, linking the dotfiles, background services (e.g. skhd) | `setup/steps/config.sh` |
| System setting with a CLI (`defaults`), login items, the Dock | `setup/steps/desktop.sh` |
| Something no step covers | a new `setup/steps/<name>.sh`, added to `STEPS` in `setup/index.sh` |
| Anything done by hand (app login, license key, permission, setting with no CLI) | `guides/` |

Just trying something out? Ask before adding it to the repo.

## Dotfiles
`dotfiles/` mirrors the user's home directory. The `envsync` tool (a GNU Stow wrapper) symlinks each file in it into `$HOME`, so `dotfiles/.gitconfig` is `~/.gitconfig`.

- Editing a file in `dotfiles/` affects the current machine right away, tools included.
- A file that is added, removed or renamed only reaches the machine after `envsync` runs.
- Everything gets linked except what `dotfiles/.stow-local-ignore` lists.

To add one, move the real file into `dotfiles/` at the same path it has in `$HOME`, then run `envsync`. See `tools/envsync/README.md`.

## Tools
A tool is a CLI the user can run from anywhere, as `dotfiles/bin/` becomes `~/bin`, which is on the `PATH`.

Write `tools/<name>/index.(ts,sh)`, starting with a shebang, and make it executable. It isn't done until it's linked, as the link's name is the command:

```sh
ln -s ../../tools/<name>/index.<ext> dotfiles/bin/<name>
```

## Guides
`guides/` holds Markdown instructions for things done by hand on a machine, because they can't be automated or haven't been yet. Once something can be automated, it moves out of the guide and into a step or tool.

## Setup
`setup/index.sh` builds any machine from this repo, running the steps in `setup/steps/`. It runs on a new machine, and again later to bring a machine back in line. Both must work, so running it again only changes what drifted.

### Writing a step
Every action in a step must be safe to run on a machine that already has it. Do it one of two ways:

- **Check first**: test if it's done and print `Already <...>` when it is. Needed for anything that installs, asks for a password, appends or takes long.
- **Converge**: a write whose result is the same however often it runs, like `defaults write` or replacing a whole list. Never append (`>>`, `tee -a`) without a check.

Also:
- A failure warns and keeps going: `warn` with what to do by hand, usually pointing to `guides/manual-steps.md`. Don't let `set -e` end the step.
- Each step is its own script that can run alone. Its header says what it does and which steps it needs. `STEPS` in `setup/index.sh` sets the order.
- Written for the macOS system bash (3.2), as Homebrew's isn't installed yet: no associative arrays, and an empty array errors under `set -u`.
- Use `step` and `warn` from `setup/steps/lib.sh`, and `$REPOSITORY_DIR` for paths in the repo, as `~/bin` may not be linked yet.

### Testing a step
Run the step you changed on this machine, twice: `bash setup/steps/<name>.sh`. The second run should only print `Already <...>` and change nothing. It can upgrade Homebrew packages and ask for a password, so ask first.
