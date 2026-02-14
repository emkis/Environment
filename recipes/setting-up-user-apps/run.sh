#!/opt/homebrew/bin/bash

echo '🎧 User apps setup started'


echo '>> Installing Notion'
brew install --cask notion

echo '>> Installing TickTick'
brew install --cask ticktick

echo '>> Installing Surfshark'
brew install --cask surfshark

echo '>> Installing Arc browser'
brew install --cask arc

echo '>> Installing Google Chrome'
brew install --cask google-chrome

echo '>> Installing Firefox'
brew install --cask firefox

echo '>> Installing Bitwarden'
brew install --cask bitwarden

echo '>> Installing The Unarchiver'
brew install --cask the-unarchiver

echo '>> Installing Inna video-player'
brew install --cask iina

echo '>> Installing Shottr'
brew install --cask shottr

echo '>> Installing Clipy'
brew install --cask clipy

echo '>> Changing dock configuration'
defaults write com.apple.dock autohide-delay -float 0
defaults write com.apple.dock autohide-time-modifier -float 0.5
killall Dock


echo '🎧 User apps setup completed'
