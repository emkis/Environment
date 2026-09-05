<div align="center">
  <h1>Environment</h1>
  <p>Everything I install and configure on a Mac, in one repository.</p>
  <img src="./preview.gif" alt="">
  <br>
  <br>
</div>

> **Note**: macOS only. Nothing here tries to work anywhere else.

Two things live here, and nothing else:

1. [**Set up a new machine**](#1-set-up-a-new-machine) — one command, everything installed.
2. [**Keep dotfiles in sync**](#2-keep-dotfiles-in-sync) — files here are symlinked into `$HOME`.

---

## 1. Set up a new machine

### Step 1 — open a terminal

Terminal.app, already on the machine. Nothing to install first.

### Step 2 — run the setup script

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup.sh)"
```

Use that form, not `curl ... | bash`. The pipe takes over stdin, and the password
and passphrase prompts below would have nothing to read from.

> Trying a branch that isn't merged yet? Put the branch name in both places —
> once in the URL, once in `BRANCH`, which is the branch the script clones:
>
> ```bash
> BRANCH=chest bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/chest/setup.sh)"
> ```

### Step 3 — click Install in the Xcode dialog

macOS opens its own window for the Command Line Tools. Click Install and leave
it. The script polls until it finishes, then carries on by itself.

Already installed? The step passes straight through.

### Step 4 — type your password once

```
==> Administrator password
Password:
```

Asked once, up front, and kept alive for the rest of the run. Some casks and the
login shell change need it, and this way none of them interrupts you an hour in.

### Step 5 — wait

In order, with no further input:

| Step | What happens |
|---|---|
| Homebrew | installed if missing |
| Repository | cloned into `~/projects/Environment` over HTTPS |
| Packages | `brew bundle install` walks the [Brewfile](./Brewfile) — every formula, cask and font |
| Dotfiles | `link.sh` symlinks `home/**` into `$HOME` |
| macOS | Dock, login shell, Node LTS, ssh key |

Long — the casks are large downloads. A package that fails doesn't stop the rest:
Homebrew reports `N Brewfile dependencies failed to install` at the end and the
script keeps going.

### Step 6 — one prompt near the end

`ssh-keygen` asks for a passphrase for the new key. The public key is copied to
your clipboard afterwards; paste it at
[github.com/settings/keys](https://github.com/settings/keys).

### Step 7 — open a new terminal

The login shell is now `fish`, but the terminal you ran this in is still the old
one. Open a fresh window.

### Step 8 — work through the manual steps

[MANUAL-STEPS.md](./MANUAL-STEPS.md). GUI permissions, licence keys, first
launches — the things no script can do. `skhd` and Karabiner in particular install
fine and stay inert until you grant them Accessibility.

### If something failed

Run it again:

```bash
cd ~/projects/Environment && ./setup.sh
```

Every step is a no-op when it's already done, so a re-run only retries what's
missing. Same command for "add a package to the Brewfile and install it later".

---

## 2. Keep dotfiles in sync

Every file under [`home/`](./home) is symlinked to the same path under `$HOME`:

```
home/.gitconfig                 ->  ~/.gitconfig
home/.config/fish/config.fish   ->  ~/.config/fish/config.fish
home/.config/zed/settings.json  ->  ~/.config/zed/settings.json
```

The repository holds the only copy. There is no copy step, so the two cannot
drift.

### Editing a config

Edit it here, in `home/`. The change is live immediately — the file in `$HOME` is
the same file. Then commit and push.

```bash
cd ~/projects/Environment
$EDITOR home/.config/fish/config.fish
git add -A && git commit -m "Update fish config" && git push
```

Nothing to run afterwards.

### Adding a new config

Put it at the path it needs under `home/`, mirroring `$HOME`. A file destined for
`~/.config/ghostty/config` goes to `home/.config/ghostty/config`.

```bash
./link.sh
```

That's the only time this command is needed: when the *set* of files changes.

### Catching up another machine

```bash
cd ~/projects/Environment
git pull
./link.sh
```

The pull alone updates every file already linked — the symlink points into the
repository, so changed contents arrive with the pull. `./link.sh` exists for what
the pull *added* or *removed*.

### What `link.sh` does with what it finds

| Situation | Result |
|---|---|
| already the right symlink | left alone, `✓` |
| nothing there | parent directories created, symlinked, `+` |
| a real file, or a link pointing elsewhere | moved to `<file>.backup`, then symlinked, `!` |
| a link to a file you deleted from `home/` | removed, `-` |

Nothing is ever deleted, apart from links pointing into `home/` that no longer
resolve. Links pointing anywhere else are not touched.

### One caveat

Karabiner-Elements and Zed rewrite their own config when you change a setting in
their UI, and rewriting replaces the symlink with a real file. Edit the copy in
`home/`, and re-run `./link.sh` if a link is ever replaced — the file they wrote
is kept as `.backup`, so nothing is lost. Noted in
[MANUAL-STEPS.md](./MANUAL-STEPS.md).

---

## Layout

- `Brewfile` — every formula, cask and font. If it's listed, it gets installed.
- `setup.sh` — new machine, top to bottom. Idempotent.
- `link.sh` — the dotfile symlinks.
- `macos.sh` — what Homebrew can't express: Dock, login shell, Node, ssh key.
- `home/` — the dotfiles, laid out exactly as they sit in `$HOME`.
- `bin/` — commands on `$PATH` straight from this checkout (`config.fish` puts them there).
- `packages/{ide,llmt,vspeed}` — the tools those `bin/` shims run.
- `manual/` — files imported by hand, referenced from `MANUAL-STEPS.md`.
- `recipes/managing-backups` — the rclone backup job, run on its own.
- `utilities/` — one-off utilities.
