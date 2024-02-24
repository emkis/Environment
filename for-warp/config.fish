# Defining custom config path for starship
set -gx STARSHIP_CONFIG "$HOME/starship.toml"

# Defining default text editor
set -gx EDITOR /usr/bin/nano

# Custom aliases
# For a full list of active aliases, run `abbr`
abbr --add fishConfig "code ~/.config/fish/config.fish"
abbr --add find-file "fzf"

# Initializing stuff
starship init fish | source
