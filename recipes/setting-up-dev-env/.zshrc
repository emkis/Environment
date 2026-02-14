# default editors
export EDITOR=vim
export IDE=$(which zed)

# setup for shell and prompt
export ZSH="$HOME/.oh-my-zsh"
export STARSHIP_CONFIG="$HOME/starship.toml"

# setup for native development
export ANDROID_HOME=$HOME/Library/Android/sdk
export JAVA_HOME=$HOME/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export PATH=$ANDROID_HOME/emulator:$PATH
export PATH=$ANDROID_HOME/platform-tools/:$PATH

# defining path for global bins
export GLOBAL_BINS="$HOME/bin"
export PATH="$GLOBAL_BINS:$PATH"

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$(brew --prefix nvm)/nvm.sh" ] && source "$(brew --prefix nvm)/nvm.sh"
[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && source "$(brew --prefix nvm)/etc/bash_completion.d/nvm"

# defining path for pnpm
export PNPM_HOME="$HOME/Library/pnpm"
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
eval "$(starship init zsh)"
source $ZSH/oh-my-zsh.sh
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
[ -f /opt/homebrew/etc/profile.d/z.sh ] && source /opt/homebrew/etc/profile.d/z.sh

# custom aliases
# for a full list of active aliases, run `alias`.
alias zshConfig="$IDE ~/.zshrc"
alias gitConfig="$IDE ~/.gitconfig"
alias karaConfig="$IDE ~/.config/karabiner/karabiner.json"
alias skhdConfig="$IDE ~/.skhdrc"
