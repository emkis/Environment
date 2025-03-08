#!/bin/bash

# Creates the configuration directory and file
mkdir -p ~/.config/karabiner
touch ~/.config/karabiner/karabiner.json

# Copy local config to file
echo "$(cat ./karabiner.json)" > ~/.config/karabiner/karabiner.json