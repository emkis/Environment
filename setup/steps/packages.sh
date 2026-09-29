#!/bin/bash
#
# Installs everything: Rosetta, Rust, the Brewfile and Node.
# Needs Homebrew, which setup/index.sh installs.

set -euo pipefail
source "$(dirname "$0")/lib.sh"

step "Rosetta"
# Not on Homebrew: it's an Apple system component, so only softwareupdate
# installs it. Goes before the Brewfile, as Intel-only casks need it.
# oahd is its daemon, which only runs once it's installed
if /usr/bin/pgrep -q oahd; then
  echo "Already installed"
elif ! sudo softwareupdate --install-rosetta --agree-to-license; then
  warn "Rosetta failed to install, Intel-only apps won't run until it does"
fi

step "Rust toolchain"
# Goes before the Brewfile, whose cargo entries need a toolchain.
# rustup is keg-only, so its bin goes on PATH
export PATH="/opt/homebrew/opt/rustup/bin:$PATH"
if [[ ! -x /opt/homebrew/opt/rustup/bin/rustup ]] && ! brew install rustup; then
  warn "rustup failed to install, the Brewfile will retry it"
elif ! rustup default stable; then
  warn "Rust failed to install, run it again in fish: rustup default stable"
fi

step "Installing Brewfile"
# Keep going if some entries fail, they can be retried by running this again
if ! brew bundle install --file="$REPOSITORY_DIR/setup/Brewfile"; then
  warn "Some Brewfile entries failed, see the output above"
fi

step "Node LTS"
# fnm doesn't need its shell env to install: fish's config loads that later.
# The first version installed becomes the default. Already installed is a no-op
if ! command -v fnm >/dev/null; then
  warn "fnm isn't installed, install Node by hand: fnm install --lts"
elif ! fnm install --lts; then
  warn "Node failed to install, run it again in fish: fnm install --lts"
fi
