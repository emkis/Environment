#!/opt/homebrew/bin/bash

# Links everything in dotfiles/ into $HOME using GNU Stow.
# Safe to run any time: it adds missing links, removes links to deleted files.
# If a real file sits where a link should be (e.g. an app rewrote its config
# on save), the machine's version wins: it's adopted into the repo and
# relinked. Check `git status`/`git diff` afterward to see what changed and
# `git restore <file>` to undo an unwanted adopt. See guides/dotfiles-and-tools.md.

set -euo pipefail

# This script runs through a symlink (~/bin/envsync), so follow it back to
# find the repo it lives in: <repo>/tools/envsync/index.sh
repo_root=$(cd "$(dirname "$(realpath "$0")")/../.." && pwd)

if ! command -v stow > /dev/null; then
  echo "envsync: stow is not installed, run: brew install stow" >&2
  exit 1
fi

# --dir         the repo, where the dotfiles/ folder lives
# --target      where the links go
# --no-folding  link files one by one instead of whole folders, so apps don't
#               write their caches into this repo
# --adopt       if a real file sits where a link should be, pull it into the
#               repo and link it instead of aborting (the machine's version
#               wins; review with git status/diff afterward)
# -R            add new links and remove links to files deleted from the repo
if ! stow --dir="$repo_root" --target="$HOME" --no-folding --adopt -R dotfiles; then
  echo >&2
  echo "envsync: nothing was changed. See 'When something looks wrong' in:" >&2
  echo "  $repo_root/guides/dotfiles-and-tools.md" >&2
  exit 1
fi

echo 'Dotfiles and tools synced!'
