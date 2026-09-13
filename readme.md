

## Dotfiles and tools

Configs live in `dotfiles/` (mirroring `$HOME`) and global commands in `tools/<name>/`. Both are symlinked onto the machine with [GNU Stow](https://www.gnu.org/software/stow/), so editing them from anywhere edits this repo.

```bash
# From the repo root: after cloning, or after pulling new dotfiles/tools
stow -R dotfiles
```

- **New dotfile**: place it in `dotfiles/` at the same path it has under `$HOME`, then run `stow -R dotfiles`.
- **New tool**: create `tools/<name>/index.ts` (executable, with a shebang), link it with `ln -s ../../tools/<name>/index.ts dotfiles/bin/<name>`, then run `stow -R dotfiles`.
- **Karabiner**: its config lives in `dotfiles/karabiner/`, and `~/.config/karabiner` is linked as a whole directory, because Karabiner doesn't reload a symlinked `karabiner.json`.
- **Conflicts**: stow refuses to replace real files. `stow --adopt -R dotfiles` moves them into the repo instead; review `git diff` afterwards.
