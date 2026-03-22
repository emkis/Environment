#!/opt/homebrew/bin/bash

dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)


echo '🔄 Dev environment setup started'


echo '>> Installing fish'
brew install fish

echo '>> Configuring fish'
mkdir -p ~/.config/fish
cp $dirname/config.fish ~/.config/fish/config.fish

echo '>> Installing Starship'
brew install starship

echo '>> Configuring Starship'
touch ~/starship.toml
echo "$(cat $dirname/starship.toml)" > ~/starship.toml

echo '>> Installing fnm (nvm for fish)'
brew install fnm

echo '>> Installing Node.js'
fnm install --lts

echo '>> Installing Bun'
brew install oven-sh/bun/bun

echo '>> Installing pnpm'
brew install pnpm

echo '>> Installing git-recent'
pnpm add --global git-recent

echo '>> Installing EAS CLI'
pnpm add --global eas-cli

echo '>> Installing Android Studio'
brew install --cask android-studio

echo '>> Installing watchman'
brew install watchman

echo '>> Installing Java'
brew install --cask zulu@17

echo '>> Installing bat (cat replacement)'
brew install bat

echo '>> Installing eza (ls replacement)'
brew install eza

echo '>> Installing zoxide (z for fish)'
brew install zoxide

echo '>> Installing tree (Directory tree visualiser)'
brew install tree

echo '>> Installing fzf (Fuzzy finder)'
brew install fzf

echo '>> Installing tokei (Code statistics)'
brew install tokei

echo '>> Installing VSCode'
brew install --cask visual-studio-code

echo '>> Installing Zed'
brew install --cask zed

echo '>> Configuring Zed'
mkdir -p ~/.config/zed
cp $dirname/zed/settings.json ~/.config/zed/settings.json
cp $dirname/zed/keymap.json ~/.config/zed/keymap.json

echo '>> Installing Warp terminal'
brew install --cask warp

echo '>> Installing Claude code'
curl -fsSL https://claude.ai/install.sh | bash

echo '>> Installing OrbStack'
brew install orbstack

echo '>> Installing font Fira Code'
brew tap homebrew/cask-fonts
brew install --cask font-fira-code
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font

echo '>> Installing GNU Privacy Guard'
brew install gnupg

echo '>> Generating new SSH key'
ssh-keygen -t rsa -b 4096 -C nicolasemkis@gmail.com
ssh-add --apple-use-keychain ~/.ssh/id_rsa
pbcopy < ~/.ssh/id_rsa.pub

echo '>> Setting up my global bins'
mkdir -p ~/bin
cp -R $dirname/../../bin/* ~/bin


echo "🔄 Dev environment setup completed"
