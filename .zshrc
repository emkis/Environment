# path to oh-my-zsh installation
export ZSH="$HOME/.oh-my-zsh"

#path to theme config file
export SPACESHIP_CONFIG="$HOME/.spaceshiprc.zsh"

# defining path for yarn global packages
export PATH="$(yarn global bin):$PATH"

# defining default text editor
export EDITOR=/usr/bin/nano

# defining path for nvm
export NVM_DIR="$HOME/.nvm" 
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

# theme setting
# more themes here: https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="spaceship"

# permission to zsh use root
ZSH_DISABLE_COMPFIX=true

# selected plugins
plugins=(
  git
  node
  yarn
  zsh-autosuggestions
  zsh-completions
  zsh-syntax-highlighting
)

# i've no idea, just leave these lines here
source $ZSH/oh-my-zsh.sh
source $(brew --prefix nvm)/nvm.sh
source /opt/homebrew/opt/spaceship/spaceship.zsh

# custom aliases
# for a full list of active aliases, run `alias`.
alias zshConfig="code ~/.zshrc"
alias zshHistory="code ~/.zsh_history"
alias hyperConfig="code ~/.hyper.js"
