# Environment

My macOS dotfiles and command-line tools, and some scripts that sets up a new Mac for me.

> I built this to set up my own machines. Feel free to borrow anything, but I don't recommend running it on yours.

## Dotfiles and tools

Configs in `dotfiles/` and commands in `tools/` live only in this repo. `envsync` symlinks them into my home folder (using [GNU Stow](https://www.gnu.org/software/stow/)), so editing `~/.gitconfig` edits `dotfiles/.gitconfig`.

Run `envsync` after pulling, or after adding, removing or renaming a dotfile or tool. Edits to existing files need nothing, just commit them. It's safe to run any time and never overwrites a real file. More in [guides/dotfiles-and-tools.md](./guides/dotfiles-and-tools.md).


## New Mac setup

On a fresh Apple Silicon Mac, open Terminal and run:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup/macos.sh)"
```

It installs Homebrew (with the Xcode Command Line Tools), clones this repo into `~/projects`, installs `setup/Brewfile`, runs `envsync` and sets up the Dock. It's safe to run again. Then follow [the manual steps](guides/manual-steps.md).
