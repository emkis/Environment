# envsync

Symlinks everything in `dotfiles/` into `$HOME` using [GNU Stow](https://www.gnu.org/software/stow/). Safe to run any time.

```bash
envsync
```

Rule of thumb: added, removed or renamed a file → run it. Only edited contents → no need, both paths are already the same file.

## Decisions

- **Conflicts always resolve to the machine's version.** If a real file sits where a link should be — most often an app rewriting its config on save instead of writing through the symlink — envsync doesn't stop and ask, it adopts: pulls the real file into the repo and relinks it. The machine wins by default because the repo is git, so anything it overwrites is always recoverable later.

## Gotchas

- **Karabiner is special.** It only reloads config when its whole folder is a link, not just the file inside — `~/.config/karabiner` links to `dotfiles/karabiner/` as a folder. Its automatic backups are gitignored.
- **`dotfiles/.stow-local-ignore`** lists what must NOT be linked. Everything else under `dotfiles/` gets linked, so don't drop READMEs/notes in there.
