#!/bin/bash

# Current directory
dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)

# Navigates to the configuration directory and reads the file content
cd "$dirname/configuration"
git_config=$(cat ./gitconfig)

# Set the global configurations
touch ~/.gitconfig
echo "$git_config" > ~/.gitconfig