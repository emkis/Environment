#!/opt/homebrew/bin/bash

dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)
echo '🪟 Window manager setup started'

echo '>> Installing SKHD'
brew install koekeishiya/formulae/skhd
skhd --start-service

echo '>> Configuring SKHD'
sh $dirname/setup-skhd.sh
skhd --reload

echo '>> Installing rectangle'
brew install --cask rectangle-pro

echo '>> Opening rectangle'
open -a "Rectangle Pro" # First time it will ask for permissions and open on the menu bar
open -a "Rectangle Pro" # Second time it will open the app

echo "🪟 Window manager setup completed, don't forget to read all instructions on the readme."
