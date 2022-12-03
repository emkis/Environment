<div align="center">
  <h1>My Terminal</h1>
  <p>All configurations and plugins that I use to get an awesome and productive experience in the terminal.</p>
  <img src="/.github/demonstration.gif" alt="Demonstration of terminal interactions">
  <br>
  <br>
</div>

## Available languages
- [Brazilian Portuguese](/README-pt.md)
- English

<br>

## Why use this setup?
- **:zap:️ Suggestions**: receive suggestions based on your previous commands
- **:cyclone: Autocomplete**: on tab press, automatically complete commands, folders, files and so on 
- **:information_source: Helpful**: Node version and Git branch always visible
- **:nail_care: It's beautiful**: you will have an awesome experience using it

<br>

## Terminal
I use [Hyper](https://hyper.is), which is an Electron-based terminal. You can see how he looks by the GIF at the beginning of this page.

> Using this terminal is not required. You can follow all the steps on this page and use your own terminal.

To install Hyper, you can read the [installation guide](https://hyper.is/#installation), or if you are using MacOS and have Homebrew installed, you can run:

```bash
brew install --cask hyper
```

The configurations that I use in Hyper are in [this file](/hyper-configuration.js), you can copy paste in your `.hyper.js` file, and everything is gonna work correctly after the installation are done.

<br>

## Setting up the shell
Shell is an operational system interpreter of commands. The one that I'm used to using is Zsh, which is one of the most used ones.

**All the steps below are required for everything to work correctly.** So, read carefully and run the commands in the same order.

These configurations only gonna work in Unix-based systems, such as MacOS and Linux. If you are using Windows, is recommended to use WSL (search about this to understand more and set it up).

<br>

## Installing Homebrew (macOS only)
[Homebrew](https://brew.sh) is a package manager that helps you to install basically anything. You will need him to install all the tools.

To install, just run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

<br>

## Installing Git
On MacOS, run:
```bash
brew install git
```

On Linux, run:
```bash
sudo apt-get install git -y
```

<br>

## Installing Curl
Probably you already have curl in your system, to check it, just run `curl --version`. If you don't have it, follow the step below.

On MacOS, run:
```bash
brew install curl
```

On Linux, run:
```bash
sudo apt-get install curl -y
```

<br>

## Installing Zsh
If you are using the last version of MacOS, you already have Zsh installed by default. You can check this by running: `zsh --version`. If you don't have it, follow the step below.

On MacOS, run:
```bash
brew install zsh
```

On Linux, run:
```bash
sudo apt install zsh -y
```

<br>

## Installing Oh My Zsh
The [Oh My Zsh](https://ohmyz.sh) is a framework for Zsh that standardizes how we can configure themes, plugins and so on.

On MacOS or Linux, run:
```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

<br>

## Installing a theme and plugins for Oh My Zsh
Below is the list of the plugins and the theme that I use. Feel free to add your own configurations as well.

[zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) plugin
```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

[zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) plugin
```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

[zsh-completions](https://github.com/zsh-users/zsh-completions) plugin
```bash
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions
```

Installing [Spaceship Zsh](https://github.com/denysdovhan/spaceship-prompt) theme, [more themes here](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes).

On MacOS, run:
```bash
brew install spaceship

echo "source $(brew --prefix)/opt/spaceship/spaceship.zsh" >>! ~/.zshrc
```

On Linux, run:
```bash
git clone https://github.com/spaceship-prompt/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt" --depth=1

ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

<br>

## Setting up Zsh
Now you need to define the configurations for Zsh and the theme. To do that, you need to change the `.zshrc` file, which is in your profile folder.

To open this file in VSCode, just run:
```bash
code ~/.zshrc
```

Copy the content of [this file](/zshrc-configurations.txt), and paste it into your `.zshrc` file. Be careful with the previous configurations, check if you're not overwriting something you don't want to.

The only configuration you need to keep is your `ZSH` variable, which probably is defined at the beginning of your file. After pasting the configurations, just keep one of the `NVM` configurations, the one that is compatible with your operating system.

After these steps, everything should be ready and working as expected, enjoy ✨.
