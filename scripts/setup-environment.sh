echo 'installing homebrew' 
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"


echo "generating a ssh key"
ssh-keygen -t rsa -b 4096 -C nicolasemkis@gmail.com
ssh-add --apple-use-keychain ~/.ssh/id_rsa
pbcopy < ~/.ssh/id_rsa.pub


echo 'installing nvm & node' 
brew install nvm
nvm --version
nvm install --lts
node --version
npm --version


echo 'installing pnpm'
brew install pnpm


echo 'installing git-recent'
pnpm add -g git-recent


echo 'installing vscode'
brew install --cask visual-studio-code


echo 'installing fira code'
brew tap homebrew/cask-fonts
brew install --cask font-fira-code
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font


echo 'installing notion'
brew install --cask notion


echo 'installing surfshark'
brew install --cask surfshark


echo 'installing spotify'
brew install --cask spotify


echo 'installing google chrome'
brew install --cask google-chrome


echo 'installing firefox'
brew install --cask firefox


echo 'installing bitwarden'
brew install --cask bitwarden


echo 'installing warp'
brew install --cask warp


echo 'installing clipy'
brew install --cask clipy


echo 'installing the unarchiver'
brew install --cask the-unarchiver


echo 'installing inna video player'
brew install --cask iina


echo 'installing rectangle'
brew install --cask rectangle-pro


echo 'installing shottr'
brew install --cask shottr


echo 'setting git configurations'
npx https://gist.github.com/emkis/7dc79f36d2759437c9b6e8c3756e6124 -y


echo 'installing fzf (to find files)'
brew install fzf


echo 'installing z (fast folder navigator)'
brew install z


echo 'changing dock configurations'
defaults write com.apple.dock autohide-delay -float 0
defaults write com.apple.dock autohide-time-modifier -float 0.5
killall Dock


echo 'All setup, enjoy!'
