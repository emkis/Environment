# Homebrew
# Absolute path, as brew isn't on PATH yet on a fresh machine
/opt/homebrew/bin/brew shellenv | source
# Every install, upgrade and reinstall ends by deleting all old versions and downloads
set -gx HOMEBREW_CLEANUP_PERIODIC_FULL_DAYS 0 # default 30
set -gx HOMEBREW_CLEANUP_MAX_AGE_DAYS 0 # default 120

# Editor (the IDE is picked per machine with `ide switch`)
set -gx EDITOR vim

# Directories
set -gx GLOBAL_BINS "$HOME/bin"
set -gx PROMPTS_REPOSITORY "$HOME/projects/Prompts"

# Paths
fish_add_path "$(brew --prefix rustup)/bin"
fish_add_path "$HOME/.cargo/bin"
fish_add_path "$GLOBAL_BINS"

# Initialise tools
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
