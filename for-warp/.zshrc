export ZSH="$HOME/.oh-my-zsh"
export STARSHIP_CONFIG="$HOME/starship.toml"
export PNPM_HOME="$HOME/Library/pnpm"
export EDITOR=/usr/bin/nano
export ANDROID_HOME=$HOME/Library/Android/sdk

# defining path for nvm
export NVM_DIR="$HOME/.nvm" 
  [ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
  [ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion

# adding pnpm to path if not already defined
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# setting theme
# more themes here: https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
# this is blank because I use this prompt: https://starship.rs
ZSH_THEME=""

# allow zsh to use root
ZSH_DISABLE_COMPFIX="true"

# oh my zsh plugins
# more plugins here: https://github.com/ohmyzsh/ohmyzsh/wiki/Plugins
plugins=()

# initializing stuff
source $(brew --prefix nvm)/nvm.sh
eval "$(starship init zsh)"
source $ZSH/oh-my-zsh.sh
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
source /opt/homebrew/etc/profile.d/z.sh

# custom aliases
# for a full list of active aliases, run `alias`.
alias zshConfig="code ~/.zshrc"
alias zshHistory="code ~/.zsh_history"
alias find-file="fzf"
