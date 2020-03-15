

# __terminal :computer:
my terminal setup for [elementary os](https://elementary.io/)

## how to config? :electric_plug: *follow step by step*

### git 
```bash
sudo apt-get update
sudo apt-get install git -y
```

### curl  +  oh my zsh
```bash
sudo apt-get install curl

sudo apt install zsh -y
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

### adding *plugins* & *theme* to zsh
```bash
# installing plugins
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions

git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions

# installing theme: Spaceship
git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt"

ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

### *setting up* customizations
you need to open the `.zshrc` file in your home folder and add this configurations, **don't forget to add your username** in the path *(line 2)*

#### `~/.zshrc` file
```bash
# path to oh-my-zsh installation
export ZSH="/home/emkis/.oh-my-zsh"

# theme setting
# more themes here: https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="spaceship"

# just the plugins that i love
# more plugins here: 
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
```

---

### maybe this can give you dope ideas to create your terminal setup :bulb:

the spaceship theme have a lot of options to customize, find out more [here](https://github.com/denysdovhan/spaceship-prompt/blob/master/docs/Options.md)

**i love spaceship**, but you can find A LOT of cool themes for zsh [here](https://github.com/ohmyzsh/ohmyzsh/wiki/External-themes)
