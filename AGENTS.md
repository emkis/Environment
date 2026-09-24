# Environment
A repository where the user centralises all its dotfiles, guides, tools, scripts and apps. It helps keeping multiple machines in sync as the user's need evolves/changes.

## Problem space
This repository was created to solve two things:
- Setting up a brand new macOS machine.
- Syncing files (e.g. dotfiles, tools) in this repo with the current machine.

## Source of truth
This repo is the user's system. Every machine is built from it. The current machine is just a copy, and copies drift.

So when the user asks about "my system", check both before you answer. The repo says what should be there. The current machine shows what drifted. The repo wins, but always report the drift. Something on the machine but not in the repo isn't needed, but ask before removing it.

Change the repo, not just the machine. Otherwise the next machine won't get it.

| Change | Goes in |
|---|---|
| Homebrew formula or cask | `setup/Brewfile` |
| Cargo crate | `setup/Brewfile` (`cargo "<name>"`) |
| Config file in `$HOME` | `dotfiles/` |
| PATH or environment variable | `dotfiles/.config/fish/config.fish` |
| The user's own CLI | `tools/` |
| Setup step for a new machine | `setup/macos.sh` |
| Anything manual | `guides/` |

Just trying something out? Ask before adding it to the repo.

## Preferences
- We should only support macOS.
- Use Homebrew as primary package manager for installing anything.

## Glossary
- **Tool**: a CLI the user can run from anywhere. Its source lives in `tools/<name>/`, and `dotfiles/bin/<name>` symlinks to it. The name of that link is the command name.
- **Guide**: one or more Markdown files in `guides/` the user follows by hand, for anything not automated by a script/tool.

## Dotfiles
`dotfiles/` mirrors the user's home directory. The `envsync` tool (a GNU Stow wrapper) symlinks each file in it into `$HOME`, so `dotfiles/.gitconfig` is `~/.gitconfig`.

- Editing a file in `dotfiles/` affects the current machine right away.
- Tools are included, since `dotfiles/bin/` links into `tools/`.
- A file that is added, removed or renamed only reaches the machine after `envsync` runs.
- Everything in `dotfiles/` gets linked except what `dotfiles/.stow-local-ignore` lists.

## Common tasks
### Adding a dotfile
Move the real file into `dotfiles/` at the same path it has in `$HOME`, then run `envsync` to link it back. See `tools/envsync/README.md` for full documentation.

### Adding a tool
Write `tools/<name>/index.(ts,sh)`, starting with a shebang, and make it executable. The tool's name should be the same as the link's name. It isn't done until it's linked:

```sh
ln -s ../../tools/<name>/index.<ext> dotfiles/bin/<name>
```
