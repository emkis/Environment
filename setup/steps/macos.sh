#!/bin/bash
#
# Sets the System Settings that have a command: Dock, language and region,
# trackpad speed, Finder, window tiling, lock screen, default apps. The rest
# stay in guides/new-mac-setup.md.
# Needs no apps, so it runs before setup/steps/packages.sh.

set -euo pipefail
source "$(dirname "$0")/lib.sh"

LANGUAGES=("en-AU" "pt-BR")
REMOVED_APPS=("iMovie" "GarageBand" "Keynote" "Pages" "Numbers" "Freeform")

step "Dock"
defaults write com.apple.dock autohide -bool true
defaults write com.apple.dock show-recents -bool false
# 1 is "-", no action. macOS puts Quick Note in the bottom right by default
for corner in tl tr bl br; do
  defaults write com.apple.dock "wvous-$corner-corner" -int 1
  defaults write com.apple.dock "wvous-$corner-modifier" -int 0
done
killall Dock || true

step "Language and region"
defaults write NSGlobalDomain AppleLanguages -array "${LANGUAGES[@]}"
# 2 is Monday
defaults write NSGlobalDomain AppleFirstWeekday -dict gregorian 2
defaults write NSGlobalDomain AppleICUForce12HourTime -bool true
defaults write NSGlobalDomain AppleICUForce24HourTime -bool false

step "Trackpad"
# 1 is the 6th notch of 10
defaults write NSGlobalDomain com.apple.trackpad.scaling -float 1

step "Finder"
# Empties the Bin of items older than 30 days
defaults write com.apple.finder FXRemoveOldTrashItems -bool true
killall Finder || true

step "Window tiling"
# Off, as Rectangle Pro does it
defaults write com.apple.WindowManager EnableTilingByEdgeDrag -bool false
defaults write com.apple.WindowManager EnableTopTilingByEdgeDrag -bool false
defaults write com.apple.WindowManager EnableTilingOptionAccelerator -bool false

step "Lock screen"
# Turns the display off after 10 minutes on battery
if ! sudo pmset -b displaysleep 10; then
  warn "Couldn't set when the display turns off, do it in System Settings > Lock Screen"
fi
# Asks for the login password, not the sudo one
if ! sysadminctl -screenLock immediate -password -; then
  warn "Couldn't require the password immediately, do it in System Settings > Lock Screen"
fi

step "Default apps"
# Not protected by the system since macOS Sonoma, but the App Store can bring them back
for app in "${REMOVED_APPS[@]}"; do
  if [[ ! -d "/Applications/$app.app" ]]; then
    echo "$app: already removed"
  elif sudo rm -rf "/Applications/$app.app"; then
    echo "$app: removed"
  else
    warn "$app couldn't be removed, delete it by hand in System Settings > General > Storage"
  fi
done
# GarageBand's sound library, a few GB
sudo rm -rf "/Library/Application Support/GarageBand" \
            "/Library/Application Support/Logic" \
            "/Library/Audio/Apple Loops"
echo "GarageBand's sound library: removed"
