## New machine

On a fresh Apple Silicon Mac, open Terminal and run:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup/macos.sh)"
```

It installs Homebrew (with the Xcode Command Line Tools), clones this repo into `~/projects`, installs `setup/Brewfile`, runs `envsync` and sets up the Dock. It's safe to run again. Then follow [the manual steps](guides/manual-steps.md).

## Dotfiles and tools

Configs in `dotfiles/` and commands in `tools/` live only in this repo. `envsync` symlinks them into my home folder (using [GNU Stow](https://www.gnu.org/software/stow/)), so editing `~/.gitconfig` edits `dotfiles/.gitconfig`.

| What happened | What to do |
|---|---|
| I edited a dotfile or a tool | Nothing, just commit it |
| I pulled changes | `envsync` |
| I added, removed or renamed a dotfile or tool | `envsync` |
| `envsync` says a file is in the way | [Fix it like this](./guides/dotfiles-and-tools.md#envsync-says-a-file-is-in-the-way) |

`envsync` is safe to run any time, from any folder: it never overwrites a real file.

Step by step for each situation: [guides/dotfiles-and-tools.md](./guides/dotfiles-and-tools.md).
