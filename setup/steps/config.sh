#!/bin/bash
#
# Sets up your environment: fish as the shell, the dotfiles and tools, skhd.
# Needs setup/steps/packages.sh, which installs fish, stow and skhd.

set -euo pipefail
source "$(dirname "$0")/lib.sh"

USERNAME="$(id -un)"

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
  if ! grep -qxF "$FISH_PATH" /etc/shells && ! echo "$FISH_PATH" | sudo tee -a /etc/shells >/dev/null; then
    warn "Couldn't add fish to /etc/shells, set the shell by hand: guides/manual-steps.md"
  elif sudo chsh -s "$FISH_PATH" "$USERNAME"; then
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

step "skhd"
# Goes after envsync, which links ~/.skhdrc. The service keeps the PATH it was
# started with, and the hotkeys' tools need Homebrew's (bun, blueutil) and ~/bin
if ! command -v skhd >/dev/null; then
  warn "skhd isn't installed, start it by hand: guides/manual-steps.md"
elif launchctl print "gui/$(id -u)/com.koekeishiya.skhd" >/dev/null 2>&1; then
  echo "Already started"
elif ! PATH="$HOME/bin:$PATH" skhd --start-service; then
  warn "skhd failed to start, do it by hand: guides/manual-steps.md"
fi
