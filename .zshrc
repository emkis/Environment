# path to oh-my-zsh installation
export ZSH="/home/emkis/.oh-my-zsh"

# theme setting
# more themes here: https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="spaceship"

# just cool plugins
plugins=(
  git
  node
  yarn
  zsh-syntax-highlighting
  zsh-autosuggestions
  zsh-completions
)

# i've no idea, just leave this line here
source $ZSH/oh-my-zsh.sh

# spaceship theme customizations
SPACESHIP_PROMPT_ORDER=(
  user          # Username section
  dir           # Current directory section
  host          # Hostname section
  git           # Git section (git_branch + git_status)
  hg            # Mercurial section (hg_branch  + hg_status)
  exec_time     # Execution time
  line_sep      # Line break
  vi_mode       # Vi-mode indicator
  jobs          # Background jobs indicator
  exit_code     # Exit code section
  char          # Prompt character
)

SPACESHIP_PROMPT_ADD_NEWLINE=true      # add a new line after executing a command
SPACESHIP_CHAR_SYMBOL="⤷"             # custom symbol
SPACESHIP_CHAR_SUFFIX=" "             # character after the arrow
