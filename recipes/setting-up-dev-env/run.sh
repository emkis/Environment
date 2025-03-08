#!/opt/homebrew/bin/bash

dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)


echo '🔄 Dev environment setup started'


echo '>> Installing zsh' 
brew install zsh

echo '>> Installing Oh My Zsh'
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

echo '>> Configuring Oh My Zsh'
touch ~/.zshrc
echo "$(cat $dirname/.zshrc)" > ~/.zshrc

echo '>> Installing Starship'
brew install starship

echo '>> Configuring Starship'
touch ~/starship.toml
echo "$(cat $dirname/starship.toml)" > ~/starship.toml

echo '>> Installing nvm'
brew install nvm

echo '>> Installing Node.js'
nvm install --lts

echo '>> Installing pnpm'
brew install pnpm

echo '>> Installing git-recent'
pnpm add -g git-recent

echo '>> Installing z (fast folder navigator)'
brew install z

echo '>> Installing VSCode'
brew install --cask visual-studio-code

echo '>> Installing Warp terminal'
brew install --cask warp

echo '>> Installing font Fira Code'
brew tap homebrew/cask-fonts
brew install --cask font-fira-code
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font

echo "generating a ssh key"
ssh-keygen -t rsa -b 4096 -C nicolasemkis@gmail.com
ssh-add --apple-use-keychain ~/.ssh/id_rsa
pbcopy < ~/.ssh/id_rsa.pub


echo "🔄 Window manager setup completed"