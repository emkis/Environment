# spaceship custom prompt order
SPACESHIP_PROMPT_ORDER=(
  user          # Username section
  dir           # Current directory section
  host          # Hostname section
  git           # Git section (git_branch + git_status)
  hg            # Mercurial section (hg_branch  + hg_status)
  node          # Node.js section
  exec_time     # Execution time
  line_sep      # Line break
  jobs          # Background jobs indicator
  exit_code     # Exit code section
  char          # Prompt character
)

# custom configurations
SPACESHIP_PROMPT_ADD_NEWLINE=true   # add a new line after executing a command
SPACESHIP_CHAR_SYMBOL="👉"          # custom symbol
SPACESHIP_CHAR_SUFFIX=" "           # character after the `SPACESHIP_CHAR_SYMBOL`
SPACESHIP_NODE_PREFIX=""            # removes prefix before node version
