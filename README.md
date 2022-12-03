<div align="center">
  <h1>My Terminal</h1>
  <p>All configurations and plugins I use to have a superb and productive experience on the terminal.</p>
  <img src="/.github/demonstration.gif" alt="Demonstration of terminal interactions">
  <br>
  <br>
</div>

> **Note**: This guide was written for MacOS, however all these tools are available for Linux as well, but you would need to do your own research on how to install them.

<br>

## Why do I use this setup?
- **:zap:️ Suggestions**: receive suggestions based on your previous commands
- **:cyclone: Autocomplete**: on tab press, automatically complete commands, folders, file names and etc
- **:information_source: Helpful**: Node version and Git branch are always visible
- **:nail_care: It's beautiful**: I love the experience of using it

<br>

## Terminal
I use [Hyper](https://hyper.is), an Electron-based terminal. You can see how he looks by the GIF at the beginning of this page.

> Using Hypes is not a requirement, you can use all these tools on this guide with your own terminal.

To install Hyper, you can read the [installation guide](https://hyper.is/#installation), or just run the command:

```bash
brew install --cask hyper
```

The configurations I use in Hyper are in [this file](/hyper.js), you can copy paste in your `~/.hyper.js` file, and after opening Hyper, all plugins will be installed correctly.

<br>

## Installing Homebrew
[Homebrew](https://brew.sh) is a package manager that helps you to install basically anything. You will need him to install all the tools.

To install, just run:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

<br>

## Installing Git
Run the command:
```bash
brew install git
```

<br>

## Installing Curl
Probably you already have curl in your system, to check it, just run `curl --version`. If you don't have it, follow the step below.

Run the command:
```bash
brew install curl
```

<br>

## Installing Zsh
If you are using the last version of MacOS, you already have Zsh installed by default. You can check this by running: `zsh --version`. If you don't have it, follow the step below.

Run the command:
```bash
brew install zsh
```

<br>

## Installing Oh My Zsh
The [Oh My Zsh](https://ohmyz.sh) is a framework for Zsh that standardizes how we can configure themes, plugins and so on.

Run the command:
```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

<br>

## Installing a theme and plugins for Oh My Zsh
Below is the list of the plugins and the theme I use, but don't forget you can add your own configurations as well, to find more you can search for "Zsh pluggins", "Oh My Zsh themes" and "Oh My Zsh pluggins".

Installing [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) plugin
```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

Installing [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) plugin
```bash
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

Installing [zsh-completions](https://github.com/zsh-users/zsh-completions) plugin
```bash
git clone https://github.com/zsh-users/zsh-completions ${ZSH_CUSTOM:=~/.oh-my-zsh/custom}/plugins/zsh-completions
```

Installing [Spaceship Zsh](https://github.com/denysdovhan/spaceship-prompt) theme, more [themes here](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes).
```bash
brew install spaceship
```

<br>

## Configuring up Oh My Zsh
Now you need to define the configurations for Oh My Zsh. To do that, open the `~/.zshrc` file.

With this file open, copy the content of [this file](/.zshrc), paste it, and save it.

## Configuring up Spaceship theme
Now you need to create the configuration file for this Oh My Zsh theme. To create this file run the command:
```bash
touch ~/.spaceshiprc.zsh
```

Now open this file, copy the content of [this file](/.spaceshiprc.zsh), paste it, and save it.

After these steps, everything should be ready and working as expected, enjoy ✨.
