# Editor and IDE
set -gx EDITOR vim
set -gx IDE (which zed)

# Directories
set -gx STARSHIP_CONFIG "$HOME/starship.toml"
set -gx ANDROID_HOME "$HOME/Library/Android/sdk"
set -gx PROJECTS "$HOME/projects"
set -gx ENVIRONMENT_REPOSITORY "$PROJECTS/Environment"
set -gx PROMPTS_REPOSITORY "$PROJECTS/Prompts"

# The scripts in the repository's bin/ are the global commands, straight from
# the checkout — nothing is copied or symlinked into place.
set -gx GLOBAL_BINS "$ENVIRONMENT_REPOSITORY/bin"

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

# Re-link after adding a dotfile, or after a pull that added one.
alias envLink="$ENVIRONMENT_REPOSITORY/link.sh"
alias envConfig="ide $ENVIRONMENT_REPOSITORY"
