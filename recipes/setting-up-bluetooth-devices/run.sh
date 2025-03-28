#!/opt/homebrew/bin/bash

echo '🛜 Bluetooth devices setup started'

echo '>> Installing blueutil'
brew install blueutil

echo '>> Installing karabiner'
brew install --cask karabiner-elements

echo '>> Configuring karabiner'
sh ./setup-karabiner.sh

echo '>> Pairing with devices'
sh ./setup-devices.sh

echo "🛜 Bluetooth devices setup completed"
