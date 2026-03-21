# Editor and IDE
set -gx EDITOR vim
set -gx IDE (which zed)

# Directories
set -gx STARSHIP_CONFIG "$HOME/starship.toml"
set -gx ANDROID_HOME "$HOME/Library/Android/sdk"
set -gx GLOBAL_BINS "$HOME/bin"
set -gx PROMPTS_REPOSITORY "$HOME/code/Prompts"

# Paths
fish_add_path "$ANDROID_HOME/emulator"
fish_add_path "$ANDROID_HOME/platform-tools"
fish_add_path "$ANDROID_HOME/cmdline-tools/latest/bin"
fish_add_path "$HOME/.local/bin"
fish_add_path "$GLOBAL_BINS"

# Initialise tools
brew shellenv | source
starship init fish | source
zoxide init fish | source
fnm env --use-on-cd | source

# Aliases
# see all by running `alias`
alias cat="bat"
alias nvm="fnm"
alias ls="eza --color=always --long --git --no-filesize --icons=always --no-time --no-user --no-permissions"
alias fishConfig="ide ~/.config/fish/config.fish"
alias gitConfig="ide ~/.gitconfig"
alias karaConfig="ide ~/.config/karabiner/karabiner.json"
alias skhdConfig="ide ~/.skhdrc"
