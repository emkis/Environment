# Editor and IDE
export EDITOR=vim
export IDE=$(which zed)

# Directories
export STARSHIP_CONFIG="$HOME/starship.toml"
export NVM_DIR="$HOME/.nvm"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export GLOBAL_BINS="$HOME/bin"
export PROMPTS_REPOSITORY="$HOME/code/Prompts"

# Paths
export PATH="$ANDROID_HOME/emulator:$PATH"
export PATH="$ANDROID_HOME/platform-tools/:$PATH"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
export PATH="$HOME/.local/bin:$PATH"
export PATH="$GLOBAL_BINS:$PATH"

# Initialise tools
eval "$(starship init zsh)"
[ -f /opt/homebrew/etc/profile.d/z.sh ] && source /opt/homebrew/etc/profile.d/z.sh
[ -s "$(brew --prefix nvm)/nvm.sh" ] && source "$(brew --prefix nvm)/nvm.sh"
[ -s "$(brew --prefix nvm)/etc/bash_completion.d/nvm" ] && source "$(brew --prefix nvm)/etc/bash_completion.d/nvm"

# Aliases
# see all by running `alias`
alias zshConfig="$IDE ~/.zshrc"
alias gitConfig="$IDE ~/.gitconfig"
alias karaConfig="$IDE ~/.config/karabiner/karabiner.json"
alias skhdConfig="$IDE ~/.skhdrc"
