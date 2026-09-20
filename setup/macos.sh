#!/bin/bash
#
# Sets up a fresh macOS machine. Safe to run again: finished steps are skipped.
#
#   bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup/macos.sh)"
#
# Written for the macOS system bash (3.2), as nothing else exists yet.

set -euo pipefail

REPOSITORY_URL="https://github.com/emkis/Environment.git"
PROJECTS_DIR="$HOME/projects"
REPOSITORY_DIR="$PROJECTS_DIR/Environment"
USERNAME="$(id -un)"

step() { printf '\n\033[1;34m>> %s\033[0m\n' "$1"; }
warn() { printf '\033[1;33m!! %s\033[0m\n' "$1"; }

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "This script only runs on macOS." >&2
  exit 1
fi

# The dotfiles and tools expect Homebrew at /opt/homebrew
if [[ "$(uname -m)" != "arm64" ]]; then
  echo "This script expects an Apple Silicon Mac." >&2
  exit 1
fi

if [[ "$EUID" -eq 0 ]]; then
  echo "Run this script as your user, not with sudo." >&2
  exit 1
fi

step "Homebrew"
# The installer also installs the Xcode Command Line Tools, which provide git
if [[ ! -x /opt/homebrew/bin/brew ]]; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
  echo "Already installed"
fi
eval "$(/opt/homebrew/bin/brew shellenv)"

step "Cloning Environment into $PROJECTS_DIR"
mkdir -p "$PROJECTS_DIR"
if [[ ! -d "$REPOSITORY_DIR/.git" ]]; then
  git clone "$REPOSITORY_URL" "$REPOSITORY_DIR"
else
  echo "Already cloned"
fi

step "Installing Brewfile"
# Keep going if some entries fail, they can be retried by running this again
if ! brew bundle install --file="$REPOSITORY_DIR/setup/Brewfile"; then
  warn "Some Brewfile entries failed, see the output above"
fi

step "Default shell"
FISH_PATH="/opt/homebrew/bin/fish"
# Reads the account's shell, not $SHELL, which still says zsh in this terminal.
# Can't fail the script: an unreadable record just means the step runs again
CURRENT_SHELL="$(dscl . -read "/Users/$USERNAME" UserShell 2>/dev/null | awk '{print $2}' || true)"
if [[ ! -x "$FISH_PATH" ]]; then
  warn "fish isn't installed, set the shell by hand: guides/manual-steps.md"
elif [[ "$CURRENT_SHELL" == "$FISH_PATH" ]]; then
  echo "Already fish"
else
  # Both need root: /etc/shells is only writable by it, and chsh on another
  # account skips the password prompt. It asks for the password once here
  if ! grep -qxF "$FISH_PATH" /etc/shells; then
    echo "$FISH_PATH" | sudo tee -a /etc/shells >/dev/null
  fi
  if sudo chsh -s "$FISH_PATH" "$USERNAME"; then
    echo "Set to fish, it starts in the next terminal"
  else
    warn "Couldn't set fish as the shell, do it by hand: guides/manual-steps.md"
  fi
fi

step "Syncing dotfiles and tools"
# Run by its path, as ~/bin isn't linked yet. Needs bash and stow from the Brewfile
if ! "$REPOSITORY_DIR/tools/envsync/index.sh"; then
  warn "envsync failed, fix it and run it again: $REPOSITORY_DIR/tools/envsync/index.sh"
fi

step "Dock"
defaults write com.apple.dock autohide-delay -float 0
defaults write com.apple.dock autohide-time-modifier -float 0.5
killall Dock || true

step "Done"
echo "Open a new terminal, so it runs fish, then continue with the manual steps: $REPOSITORY_DIR/guides/manual-steps.md"
