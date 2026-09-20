# Environment
A repository where the user centralises all its dotfiles, guides, tools, scripts and apps. It helps keeping multiple machines in sync as the user's need evolves/changes.

## Problem space
This repository was created to solve two things:
- Setting up a brand new macOS machine.
- Syncing files (e.g. dotfiles, tools) in this repo with the current machine.

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
Move the real file into `dotfiles/` at the same path it has in `$HOME`, then run `envsync` to link it back. See `guides/dotfiles-and-tools.md` for the full day-to-day workflow (removing/renaming dotfiles, resolving stow conflicts, etc).

### Adding a tool
Write `tools/<name>/index.(ts,sh)`, starting with a shebang, and make it executable. The tool's name should be the same as the link's name. It isn't done until it's linked:

```sh
ln -s ../../tools/<name>/index.<ext> dotfiles/bin/<name>
```
