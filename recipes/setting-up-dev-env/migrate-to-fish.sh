#!/opt/homebrew/bin/bash

echo '🔄 Migration from zsh to fish started'


echo '>> Uninstalling Oh My Zsh'
if [ -d "$HOME/.oh-my-zsh" ]; then
  ZSH="$HOME/.oh-my-zsh" sh "$HOME/.oh-my-zsh/tools/uninstall.sh" --unattended
else
  echo '   Oh My Zsh not found, skipping'
fi

echo '>> Removing .zshrc'
if [ -f "$HOME/.zshrc" ]; then
  rm "$HOME/.zshrc"
else
  echo '   .zshrc not found, skipping'
fi

echo '>> Uninstalling nvm'
if brew list nvm &>/dev/null; then
  brew uninstall nvm
  rm -rf "$HOME/.nvm"
else
  echo '   nvm not found, skipping'
fi

echo '>> Uninstalling z'
if brew list z &>/dev/null; then
  brew uninstall z
else
  echo '   z not found, skipping'
fi


echo '>> Installing fish'
brew install fish

echo '>> Adding fish to /etc/shells'
FISH_PATH="$(which fish)"
if ! grep -q "$FISH_PATH" /etc/shells; then
  echo "$FISH_PATH" | sudo tee -a /etc/shells
fi

echo '>> Setting fish as default shell'
chsh -s "$FISH_PATH"

echo '>> Configuring fish'
mkdir -p ~/.config/fish
dirname=$(cd "$(dirname "${BASH_SOURCE}")"; pwd -P)
cp "$dirname/config.fish" ~/.config/fish/config.fish

echo '>> Installing fnm (nvm replacement)'
brew install fnm

echo '>> Installing zoxide (z replacement)'
brew install zoxide

echo '>> Installing bat (cat replacement)'
brew install bat

echo '>> Installing eza (ls replacement)'
brew install eza

echo '>> Installing Node.js via fnm'
eval "$(fnm env)"
fnm install --lts


echo '🔄 Migration completed — restart your terminal to start using fish'
