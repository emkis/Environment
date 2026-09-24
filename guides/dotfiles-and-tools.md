# Dotfiles and tools

My configs and global commands live **only in this repo**. The `envsync` command puts symlinks in my home folder that point back here, so there's a single copy of each file.

- `dotfiles/` mirrors my home folder: `dotfiles/.gitconfig` becomes `~/.gitconfig`, `dotfiles/.config/zed/settings.json` becomes `~/.config/zed/settings.json`.
- `tools/<name>/` holds the source of each global command. `dotfiles/bin/<name>` is a symlink to it, so it shows up as `~/bin/<name>`, which is in my `PATH`.
- Editing `~/.gitconfig` and editing `dotfiles/.gitconfig` is the same thing: both open the file in this repo.

## envsync

```bash
envsync
```

- Works from any folder.
- It's safe to run any time: it adds missing links, removes links to files deleted from the repo, and never overwrites a real file. If something is in the way, it changes nothing and says so.
- **Rule of thumb:** if a file was added, removed or renamed, run it. If only the contents changed, you don't need to.
- It's a small wrapper around [GNU Stow](https://www.gnu.org/software/stow/), in `tools/envsync/index.sh`.

---

## Day to day

### I edited a dotfile or a tool

Nothing to sync, the change is already in the repo. Commit and push it.

Some apps need a nudge to pick up the change:

| Changed | To apply it |
|---|---|
| `config.fish` | Open a new terminal tab, or `source ~/.config/fish/config.fish` |
| `.skhdrc` | `skhd --reload` (if it says `could not open pid-file`, run `skhd --restart-service`) |
| `karabiner.json`, Zed settings | Nothing, they reload on their own |
| `.gitconfig`, `starship.toml`, any tool | Nothing, used the next time they run |

### I pulled changes

```bash
git pull
envsync   # picks up new, removed or renamed files
```

Running `envsync` after every pull is the easy habit; it does nothing if nothing changed.

### I want to add a new dotfile

Move the real file into `dotfiles/` at the same path it has in my home folder, then link it back:

```bash
mkdir -p dotfiles/.config/ghostty
mv ~/.config/ghostty/config dotfiles/.config/ghostty/config
envsync
```

Only add the files I actually want to track, not an app's whole config folder (those often contain caches and state).

### I want to add a new tool

The name of the link in `dotfiles/bin/` is the name of the command.

```bash
mkdir tools/hello
$EDITOR tools/hello/index.ts          # first line: #!/usr/bin/env bun
chmod +x tools/hello/index.ts
ln -s ../../tools/hello/index.ts dotfiles/bin/hello
envsync
hello                                 # works from anywhere
```

For a bash tool, use `index.sh` with `#!/opt/homebrew/bin/bash` as the first line instead.

### I want to rename or remove a tool or dotfile

- **Rename a tool:** `mv dotfiles/bin/old-name dotfiles/bin/new-name`, then `envsync`.
- **Remove a tool:** delete `tools/<name>/` and `dotfiles/bin/<name>`, then `envsync`.
- **Remove a dotfile:** delete it from `dotfiles/`, then `envsync`. The file only lived in the repo, so it's gone from the machine too. To keep using it untracked, first replace the link with a copy: `cp dotfiles/.foo ~/.foo.tmp && mv ~/.foo.tmp ~/.foo`.

---

## When something looks wrong

### envsync adopted a file

If a real file sits where a link should be — I started tracking a dotfile on one machine and another machine already had its own copy, or an app saved its config by writing a new file, which replaced the link — `envsync` doesn't abort. It pulls the real file into the repo (replacing the repo's copy) and links it: the machine's version wins.

After running `envsync`, check what got adopted:

```bash
cd ~/projects/Environment   # the repo root
git status
git diff
```

Then either:

- **Keep the machine's version:** commit it.
- **Keep the repo's version instead:** `git restore <file>`.

Commit my own edits first, so `git diff` only shows what the machine had.

### Is a file linked?

`ls -l ~/.gitconfig` shows an arrow (`->`) pointing into this repo when it's a link.

### I want to move this repo to another folder

The links point to where the repo is, so unlink first. That also removes `~/bin/envsync`, so run it by its path afterwards:

```bash
cd ~/projects/Environment
stow --target="$HOME" -D dotfiles   # remove all links
# move the repo, then from its new location:
./tools/envsync/index.sh            # link again
```

If I already moved it, `envsync` says `existing target is not owned by stow: <file>`. Those are broken links to the old location: delete each one it lists with plain `rm` (for example `rm ~/.config/karabiner`, never `rm -r`), then run `./tools/envsync/index.sh` from the new location.

---

## Good to know

- **`tools/envsync/index.sh`**: the Stow options it uses are explained in the script.
- **`dotfiles/.stow-local-ignore`**: things inside `dotfiles/` that must not be linked. Everything else in `dotfiles/` gets linked, so don't put a README or notes in there.
- **Karabiner** is the exception: it only reloads its config when its whole folder is a link. `~/.config/karabiner` links to `dotfiles/karabiner/`, where `karabiner.json` lives. Its automatic backups are gitignored.
- **Never copy** a dotfile or tool into the home folder by hand; always add it to the repo and run `envsync`.
