# Environment

How I set up my macs and keep them in sync.

> Built for my own machines. Borrow any idea you like, but I wouldn't recommend running the scripts yourself.

## What's in here

- **`dotfiles/`** configs, laid out like my home directory.
- **`tools/`** CLIs and scripts I built to make my life easier.
- **`setup/`** scripts to sets up a new Mac.
- **`guides/`** everything I haven't (or can't) automated into a script yet.

## Dotfiles

This repo holds the only copy of my configs. [GNU Stow](https://www.gnu.org/software/stow/) links them into my home folder, so editing `~/.gitconfig` edits the file here too, and a `git pull` brings the change to my other machines.

## Tools

- **`envsync`** links my dotfiles and tools into my home folder.
- **`blu`** manages my Bluetooth devices.
- **`ide`** opens projects in whichever editor I'm using.
- **`llmt`** organizes the prompts I write for LLMs.
- **`shrink`** compresses the photos I copy from my camera.
- **`vspeed`** speeds up a video.
