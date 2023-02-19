echo 'installing homebrew' 
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"


echo 'setting git configurations'
git config --global user.name "emkis"
git config --global user.email "nicolasemkis@gmail.com"
git config --global core.editor "nano"


echo "generating a ssh key"
ssh-keygen -t rsa -b 4096 -C $git_config_user_email
ssh-add --apple-use-keychain ~/.ssh/id_rsa
pbcopy < ~/.ssh/id_rsa.pub


echo 'installing Oh My ZSH'
sh -c "$(wget https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"


echo 'installing nvm & node' 
brew install nvm
nvm --version
nvm install --lts
node --version
npm --version


echo 'installing yarn'
brew install yarn


echo 'installing pnpm'
brew install pnpm


echo 'installing git-recent'
yarn global add git-recent


echo 'installing vscode'
brew install --cask visual-studio-code


echo 'installing fira code'
brew tap homebrew/cask-fonts
brew install --cask font-fira-code
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font


echo 'installing notion'
brew install --cask notion


echo 'installing spotify'
brew install --cask spotify


echo 'installing google chrome'
brew install --cask google-chrome


echo 'installing firefox'
brew install --cask firefox


echo 'installing warp'
brew install --cask warp


echo 'installing clipy'
brew install --cask clipy


echo 'installing the unarchiver'
brew install --cask the-unarchiver


echo 'installing inna video player'
brew install --cask iina


echo 'installing rectangle'
brew install --cask rectangle


echo 'installing git configurations'
npx https://gist.github.com/emkis/7dc79f36d2759437c9b6e8c3756e6124 -y


echo 'installing fzf (to find files)'
brew install fzf


echo 'changing dock configurations'
defaults write com.apple.dock autohide-delay -float 0
defaults write com.apple.dock autohide-time-modifier -float 0.5
killall Dock


clear
echo 'All setup, enjoy!'