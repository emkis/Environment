# path to oh-my-zsh installation
export ZSH="$HOME/.oh-my-zsh"

#path to theme config file
export SPACESHIP_CONFIG="$HOME/.spaceshiprc.zsh"

# defining default text editor
export EDITOR=/usr/bin/nano

# defining path for nvm
export NVM_DIR="$HOME/.nvm" 
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

# setting theme
# more themes here: https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="spaceship"

# allow zsh to use root
ZSH_DISABLE_COMPFIX="true"

# oh my zsh plugins
# more plugins here: https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins
plugins=(
  zsh-autosuggestions
  zsh-syntax-highlighting # must be the last one
)

# initializing stuff
source $ZSH/oh-my-zsh.sh
source $(brew --prefix nvm)/nvm.sh
source /opt/homebrew/opt/spaceship/spaceship.zsh
source /opt/homebrew/share/zsh-autosuggestions/zsh-autosuggestions.zsh
source /opt/homebrew/share/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh

# custom aliases
# for a full list of active aliases, run `alias`.
alias zshConfig="code ~/.zshrc"
alias zshHistory="code ~/.zsh_history"
alias hyperConfig="code ~/.hyper.js"
alias find-file="fzf"
