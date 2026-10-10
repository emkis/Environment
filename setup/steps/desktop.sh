#!/bin/bash
#
# Sets up how macOS looks and behaves: login items, the Dock, language and
# region, trackpad speed, Finder and window tiling.
# Needs setup/steps/packages.sh, which installs the apps.

set -euo pipefail
source "$(dirname "$0")/lib.sh"

step "Login items"
# macOS asks once to let the terminal control System Events, which manages
# the login items
LOGIN_APPS=("Hex" "Clipy" "Sol" "Rectangle Pro" "Shottr")
if ! LOGIN_ITEMS="$(osascript -e 'tell application "System Events" to get the name of every login item')"; then
  warn "Couldn't read the login items, add them by hand in System Settings > General > Login Items"
else
  for app in "${LOGIN_APPS[@]}"; do
    app_path="/Applications/$app.app"
    # osascript prints the names comma separated: "Clipy, Sol, Rectangle Pro"
    if [[ ", $LOGIN_ITEMS, " == *", $app, "* ]]; then
      echo "$app: already added"
    elif [[ ! -d "$app_path" ]]; then
      warn "$app isn't installed, add it to the login items once it is"
    elif osascript -e "tell application \"System Events\" to make login item at end with properties {path:\"$app_path\", hidden:false}" >/dev/null; then
      echo "$app: added"
    else
      warn "$app couldn't be added, add it by hand in System Settings > General > Login Items"
    fi
  done
fi

step "Dock"
# Replaces the whole list, so running it again restores this order. Finder is
# always first, so it's not listed. YouTube Music is a Safari web app made in
# guides/setup/2-after-setup.md, so it's skipped until then
DOCK_APPS=(
  "/System/Applications/Apps.app"
  "/Applications/TickTick.app"
  "/Applications/Zen.app"
  "/Applications/Notion.app"
  "/Applications/Warp.app"
  "/Applications/Visual Studio Code.app"
  "$HOME/Applications/YouTube Music.app"
  "/Applications/Bitwarden.app"
  "/Applications/WhatsApp.app"
)
DOCK_ITEMS=()
for app_path in "${DOCK_APPS[@]}"; do
  if [[ -d "$app_path" ]]; then
    DOCK_ITEMS+=("<dict><key>tile-data</key><dict><key>file-data</key><dict><key>_CFURLString</key><string>$app_path</string><key>_CFURLStringType</key><integer>0</integer></dict></dict></dict>")
  else
    warn "$(basename "$app_path" .app) isn't installed, skipped it in the Dock"
  fi
done
# An empty list would clear the Dock, and bash 3.2 errors on an empty array
if (( ${#DOCK_ITEMS[@]} )); then
  defaults write com.apple.dock persistent-apps -array "${DOCK_ITEMS[@]}"
else
  warn "None of the Dock apps are installed, left the Dock as it is"
fi
defaults write com.apple.dock autohide -bool true
defaults write com.apple.dock autohide-delay -float 0
defaults write com.apple.dock autohide-time-modifier -float 0.5
defaults write com.apple.dock show-recents -bool false
# 1 is "-", no action. macOS puts Quick Note in the bottom right by default
for corner in tl tr bl br; do
  defaults write com.apple.dock "wvous-$corner-corner" -int 1
  defaults write com.apple.dock "wvous-$corner-modifier" -int 0
done
killall Dock || true

step "Language and region"
defaults write NSGlobalDomain AppleLanguages -array "en-AU" "pt-BR"
# 2 is Monday
defaults write NSGlobalDomain AppleFirstWeekday -dict gregorian 2
defaults write NSGlobalDomain AppleICUForce12HourTime -bool true
defaults write NSGlobalDomain AppleICUForce24HourTime -bool false

step "Trackpad"
# 1 is the 6th notch of 10 in Trackpad > Point & Click > Tracking speed
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
