# Homebrew, before anything else. /opt/homebrew/bin is not in /etc/paths, so on
# a fresh Apple Silicon machine nothing below this — brew, starship, zoxide,
# fnm, zed, bat, eza — is on PATH until shellenv has run.
for brew_path in /opt/homebrew/bin/brew /usr/local/bin/brew
    if test -x $brew_path
        $brew_path shellenv fish | source
        break
    end
end

# Editor and IDE
set -gx EDITOR vim
set -gx IDE (command -v zed)

# Directories
set -gx STARSHIP_CONFIG "$HOME/starship.toml"
set -gx PROJECTS "$HOME/projects"
set -gx ENVIRONMENT_REPOSITORY "$PROJECTS/Environment"
set -gx PROMPTS_REPOSITORY "$PROJECTS/Prompts"

# The scripts in the repository's bin/ are the global commands, straight from
# the checkout — nothing is copied or symlinked into place.
set -gx GLOBAL_BINS "$ENVIRONMENT_REPOSITORY/bin"

# Paths. -g and not the default universal scope: a universal fish_user_paths is
# written once into ~/.config/fish/fish_variables and then outlives this file,
# so PATH would stop being something this repository fully describes.
fish_add_path -g "$HOME/.local/bin"
fish_add_path -g "$GLOBAL_BINS"

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

# Re-link after adding a dotfile, or after a pull that added one.
alias envLink="$ENVIRONMENT_REPOSITORY/link.sh"
alias envConfig="ide $ENVIRONMENT_REPOSITORY"
