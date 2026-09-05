#!/bin/bash
# Symlink every file under home/ to the same path under $HOME.
#
#   home/.gitconfig              ->  ~/.gitconfig
#   home/.config/fish/config.fish ->  ~/.config/fish/config.fish
#
# The repository is the only copy. Editing a file here changes the live config
# immediately, and `git pull` on another machine does the same there — no copy
# step, so the two can never drift.
#
# Safe to re-run. Run it after adding a new file to home/, or after a pull that
# added one. Anything already in place is left alone; anything real in the way
# is moved aside to <file>.backup first.

set -uo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE="$REPO/home"

linked=0 created=0 backed_up=0 removed=0

ok()   { printf '    \033[32m✓\033[0m %s\n' "$1"; }
new()  { printf '    \033[32m+\033[0m %s\n' "$1"; }
gone() { printf '    \033[31m-\033[0m %s\n' "$1"; }
warn() { printf '    \033[33m!\033[0m %s\n' "$1"; }

printf '\n\033[1;34m==>\033[0m \033[1mLinking %s into %s\033[0m\n' "$SOURCE" "$HOME"

# -print0 so paths with spaces survive. Process substitution instead of a pipe
# keeps the counters in this shell rather than a subshell.
while IFS= read -r -d '' source_file; do
  relative="${source_file#"$SOURCE"/}"
  target="$HOME/$relative"

  if [ -L "$target" ] && [ "$(readlink "$target")" = "$source_file" ]; then
    ok "$relative"
    linked=$((linked + 1))
    continue
  fi

  # Something else is already there: a real file, a directory, or a symlink
  # pointing elsewhere. Never delete it — move it aside under a name that
  # doesn't collide with an earlier backup.
  if [ -e "$target" ] || [ -L "$target" ]; then
    backup="$target.backup"
    [ -e "$backup" ] && backup="$target.backup.$(date +%Y%m%d%H%M%S)"
    mv "$target" "$backup"
    warn "$relative was in the way, moved to $(basename "$backup")"
    backed_up=$((backed_up + 1))
  fi

  mkdir -p "$(dirname "$target")"
  ln -s "$source_file" "$target"
  new "$relative"
  created=$((created + 1))
done < <(find "$SOURCE" -type f -not -name '.DS_Store' -print0 | sort -z)

# A file deleted from home/ leaves a symlink in $HOME pointing at nothing.
# Clear those out. Only links whose target is inside home/ are ever removed, so
# nothing this script didn't create can be hit. Scanning starts from the
# top-level names in home/, which keeps it off the rest of $HOME.
while IFS= read -r -d '' entry; do
  root="$HOME/$(basename "$entry")"
  [ -e "$root" ] || [ -L "$root" ] || continue

  while IFS= read -r -d '' link; do
    case "$(readlink "$link")" in
      "$SOURCE"/*)
        [ -e "$link" ] && continue          # follows the link: still resolves
        rm "$link"
        gone "${link#"$HOME"/} (gone from the repository)"
        removed=$((removed + 1)) ;;
    esac
  done < <(find "$root" -type l -print0 2>/dev/null)
done < <(find "$SOURCE" -mindepth 1 -maxdepth 1 -print0)

printf '\n    %d already linked, %d new' "$linked" "$created"
[ "$backed_up" -gt 0 ] && printf ', %d backed up' "$backed_up"
[ "$removed" -gt 0 ] && printf ', %d removed' "$removed"
printf '\n\n'
