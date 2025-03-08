#!/opt/homebrew/bin/bash

# Current directory
dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)

# Creates the configuration directory and file
mkdir -p ~/.config/karabiner
touch ~/.config/karabiner/karabiner.json

# Copy local config to file
echo "$(cat $dirname/karabiner.json)" > ~/.config/karabiner/karabiner.json
