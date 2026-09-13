# Environment

How I set up my Macs and keep them in sync.

> Built for my own machines, you can borrow any idea you like, but I wouldn't recommend running them yourself.

## What's in here

- **`dotfiles/`**: configs, laid out like my home directory.
- **`tools/`**: CLIs and scripts I built to make my life easier.
- **`setup/`**: scripts to sets up a new Mac.
- **`guides/`**: everything I haven't (or can't) automated into a script yet.

## Dotfiles

All my configuration files live in this repository, and I use [GNU Stow](https://www.gnu.org/software/stow/) to keep them synced with my home directory. I only ever edit them here, and the changes apply to my system automatically.

## Tools

- **`envsync`**: syncs my dotfiles with my home directory
- **`ide`**: opens projects in whichever editor I'm using
- **`llmt`**: organizes the prompts I write for LLMs
- **`vspeed`**: speeds up a video
- **`setup-devices`**: pairs my Bluetooth devices
- **`toggle-bluetooth`**: turns Bluetooth on or off

## New Mac setup

On a fresh Apple Silicon Mac, open Terminal and run:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup/macos.sh)"
```

It installs everything I use, clones this repo, links the dotfiles and sets up the Dock. It's safe to run again. Whatever it can't do is in `guides/`.
