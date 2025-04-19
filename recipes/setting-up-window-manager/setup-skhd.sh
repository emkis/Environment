#!/opt/homebrew/bin/bash

# Current directory
dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)

# Creates the configuration file
touch ~/.skhdrc

# Copy local config to file
echo "$(cat $dirname/.skhdrc)" > ~/.skhdrc
