#!/bin/bash

# Current directory
dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)

# Navigates to the configuration directory and reads the file content
cd "$dirname/configuration"
karabiner_config_content=$(cat ./karabiner.json)

# Creates the configuration directory and file
mkdir -p ~/.config/karabiner
touch ~/.config/karabiner/karabiner.json
echo "$karabiner_config_content" > ~/.config/karabiner/karabiner.json