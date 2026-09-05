#!/bin/bash
# Everything Homebrew can't express: macOS defaults, the login shell, Node, the
# ssh key. Runs after setup.sh has installed the packages and linked the files,
# and can be re-run on its own at any time — every step is a no-op once done.

set -uo pipefail

log()  { printf '\n\033[1;34m==>\033[0m \033[1m%s\033[0m\n' "$1"; }
ok()   { printf '    \033[32m✓\033[0m %s\n' "$1"; }
warn() { printf '    \033[33m!\033[0m %s\n' "$1"; }

log "macOS settings"

# The Dock hides and shows with no delay and a faster animation. autohide
# itself has to be written too — the two timing keys do nothing on their own.
if [ "$(defaults read com.apple.dock autohide 2>/dev/null)" != "1" ] \
  || [ "$(defaults read com.apple.dock autohide-delay 2>/dev/null)" != "0" ]; then
  defaults write com.apple.dock autohide -bool true
  defaults write com.apple.dock autohide-delay -float 0
  defaults write com.apple.dock autohide-time-modifier -float 0.5
  killall Dock
fi
ok "dock autohide"

log "Login shell"

FISH="$(command -v fish)"
if [ -z "$FISH" ]; then
  warn "fish is not installed — run setup.sh first"
elif [ "$SHELL" = "$FISH" ]; then
  ok "fish"
else
  # chsh only accepts shells listed in /etc/shells. Both writes need root, and
  # `sudo chsh` avoids chsh asking for the password a second time.
  grep -qxF "$FISH" /etc/shells || echo "$FISH" | sudo tee -a /etc/shells >/dev/null
  sudo chsh -s "$FISH" "$USER"
  ok "fish"
  warn "open a new terminal for the shell change to take effect"
fi

log "Node"

# fnm comes from Homebrew, but the Node versions come from fnm.
if command -v fnm >/dev/null 2>&1; then
  eval "$(fnm env)"
  fnm ls 2>/dev/null | grep -q lts-latest || fnm install --lts
  # `fnm install` only creates the lts-latest alias. Without a `default` there
  # is no node at all in a shell that has no .node-version to go on.
  fnm alias lts-latest default >/dev/null 2>&1 || warn "could not set the default node version"
  ok "node lts"
else
  warn "fnm is not installed — run setup.sh first"
fi

log "SSH config"

# Without this, the passphrase is asked for again after every reboot — the
# keychain holds it, but nothing tells ssh to look there. Appended, never
# overwritten, so an existing config survives.
if [ -f "$HOME/.ssh/config" ] && grep -q "UseKeychain" "$HOME/.ssh/config"; then
  ok "$HOME/.ssh/config"
else
  mkdir -p "$HOME/.ssh"
  chmod 700 "$HOME/.ssh"
  cat >> "$HOME/.ssh/config" <<'EOF'

Host *
  UseKeychain yes
  AddKeysToAgent yes
  IdentityFile ~/.ssh/id_ed25519
EOF
  chmod 600 "$HOME/.ssh/config"
  ok "created"
fi

log "SSH key"

if [ -f "$HOME/.ssh/id_ed25519.pub" ]; then
  ok "$HOME/.ssh/id_ed25519"
else
  # Prompts for a passphrase, so this script needs a real terminal.
  ssh-keygen -t ed25519 -C nicolasemkis@gmail.com -f "$HOME/.ssh/id_ed25519"
  ssh-add --apple-use-keychain "$HOME/.ssh/id_ed25519"
  pbcopy < "$HOME/.ssh/id_ed25519.pub"
  ok "created"
  warn "public key copied to the clipboard — add it at github.com/settings/keys"
fi

log "Hotkeys"

# skhd reads ~/.skhdrc, which link.sh points at home/.skhdrc. It also needs
# Accessibility permission, which only you can grant — see MANUAL-STEPS.md.
if command -v skhd >/dev/null 2>&1; then
  skhd --start-service >/dev/null 2>&1 || true
  skhd --reload >/dev/null 2>&1 || true
  ok "skhd service"
else
  warn "skhd is not installed — run setup.sh first"
fi

printf '\n'
