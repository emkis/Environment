# New Mac setup

On a fresh Apple Silicon Mac, open Terminal and run:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup/macos.sh)"
```

Run it as my user, not with `sudo`. It's safe to run again: finished steps are skipped, so if something fails, fix it and run the same command.

## What it does

1. **Homebrew**: installs it, which also installs the Xcode Command Line Tools (and with them, git).
2. **Clones this repo** into `~/projects/Environment`, over HTTPS.
3. **Brewfile**: installs everything in `setup/Brewfile`.
4. **Default shell**: makes fish the login shell. It asks for my password, and starts in the next terminal I open.
5. **Dotfiles and tools**: links them into my home folder with `envsync`. See [dotfiles-and-tools.md](dotfiles-and-tools.md).
6. **Dock**: no delay before it shows up, and a faster animation.

## After it finishes

Open a new terminal, so it runs fish, then go through [manual-steps.md](manual-steps.md): the GitHub login and app settings the script can't do.

## Keeping the Brewfile up to date

From the repo root:

```bash
brew bundle install --file=setup/Brewfile            # install what's missing
brew bundle check   --file=setup/Brewfile --verbose  # list what's missing
brew bundle cleanup --file=setup/Brewfile            # list what's installed but unlisted
```
