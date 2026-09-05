#!/bin/bash
# Set up a Mac from scratch. On a machine with nothing on it:
#
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup.sh)"
#
# Use that form, not `curl | bash`: it leaves stdin attached to the terminal, so
# the sudo and ssh-keygen prompts still work.
#
# Safe to re-run. Every step is a no-op once it's done, so this is both "new
# machine" and "catch this machine up".

set -uo pipefail

REPO="$HOME/projects/Environment"
REMOTE="https://github.com/emkis/Environment.git"

# Which branch to clone. Only ever set to try a branch that isn't merged yet:
#   BRANCH=some-branch bash -c "$(curl -fsSL .../some-branch/setup.sh)"
BRANCH="${BRANCH:-main}"

log()  { printf '\n\033[1;34m==>\033[0m \033[1m%s\033[0m\n' "$1"; }
ok()   { printf '    \033[32m✓\033[0m %s\n' "$1"; }
warn() { printf '    \033[33m!\033[0m %s\n' "$1"; }

# Running from an already-cloned copy? Then that copy is the one to use, wherever
# it sits. Downloaded over curl there is no script on disk, so this test fails
# and the clone below runs instead.
if [ -f "${BASH_SOURCE[0]:-}" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  [ -f "$SCRIPT_DIR/Brewfile" ] && REPO="$SCRIPT_DIR"
fi

log "Xcode Command Line Tools"

# `xcode-select --install` opens a GUI dialog and returns straight away, so
# polling is the only way to know the install finished. git comes from here.
if xcode-select -p >/dev/null 2>&1; then
  ok "installed"
else
  xcode-select --install >/dev/null 2>&1 || true
  warn "click Install in the macOS dialog, waiting..."
  # Give up eventually. A dismissed dialog would otherwise leave this polling
  # forever with nothing on screen to say why.
  waited=0
  until xcode-select -p >/dev/null 2>&1; do
    sleep 5
    waited=$((waited + 5))
    if [ "$waited" -ge 1800 ]; then
      warn "still not installed after 30 minutes — run 'xcode-select --install', then re-run this script"
      exit 1
    fi
  done
  ok "installed"
fi

log "Administrator password"

# Some casks and the login shell change need root. Ask now, up front, rather
# than twenty minutes into the install, and keep it alive until this exits.
sudo -v
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &
KEEPALIVE=$!
trap 'kill "$KEEPALIVE" 2>/dev/null' EXIT
ok "granted"

log "Homebrew"

if ! command -v brew >/dev/null 2>&1; then
  NONINTERACTIVE=1 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  # Homebrew has just landed somewhere that isn't on this script's PATH, so
  # every brew call below would fail without this.
  for candidate in "${HOMEBREW_PREFIX:-/opt/homebrew}/bin/brew" /usr/local/bin/brew; do
    [ -x "$candidate" ] && eval "$("$candidate" shellenv)" && break
  done
fi

if ! command -v brew >/dev/null 2>&1; then
  warn "Homebrew is not on PATH — cannot continue"
  exit 1
fi
ok "$(command -v brew)"

log "Repository"

if [ -d "$REPO/.git" ]; then
  ok "$REPO"
else
  # Public repo over HTTPS, so this works before any ssh key exists.
  mkdir -p "$(dirname "$REPO")"
  git clone --branch "$BRANCH" "$REMOTE" "$REPO" || { warn "clone failed"; exit 1; }
  ok "cloned $BRANCH into $REPO"
fi

log "Packages"

# brew bundle keeps going after a failure: it installs what it can, reports
# "N Brewfile dependencies failed to install", and exits non-zero. One broken
# cask doesn't cost you the rest of the list. Re-run to retry.
brew bundle install --file="$REPO/Brewfile" --no-upgrade \
  || warn "some packages failed to install — see above, re-run to retry"

"$REPO/link.sh"
"$REPO/macos.sh"

log "Done"
printf '\n    Apps that still need permissions or a first launch by hand:\n'
printf '    %s\n\n' "$REPO/MANUAL-STEPS.md"
