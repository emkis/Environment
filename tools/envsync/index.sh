#!/opt/homebrew/bin/bash

# Links everything in dotfiles/ into $HOME using GNU Stow.
# Safe to run any time: it adds missing links, removes links to deleted files,
# and never overwrites a real file. See guides/dotfiles-and-tools.md.

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
# -R            add new links and remove links to files deleted from the repo
if ! stow --dir="$repo_root" --target="$HOME" --no-folding -R dotfiles; then
  echo >&2
  echo "envsync: nothing was changed. See 'When something looks wrong' in:" >&2
  echo "  $repo_root/guides/dotfiles-and-tools.md" >&2
  exit 1
fi

echo 'Dotfiles and tools synced!'
