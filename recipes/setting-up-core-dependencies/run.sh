#!/bin/bash

# Current directory
dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)

echo '⚙️ Core dependencies setup started'

echo '>> Installing homebrew'
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

echo '>> Installing bash'
brew install bash

echo '>> Installing fzf'
brew install fzf

echo '>> Installing git'
brew install git

echo '>> Configuring git'
touch ~/.gitconfig
echo "$(cat $dirname/gitconfig)" > ~/.gitconfig

echo '⚙️ Core dependencies setup completed'