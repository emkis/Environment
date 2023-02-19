<div align="center">
  <h1>Warp guide</h1>
  <p>Below you can see a preview of how this setup looks like.</p>
  
  <img src="./preview.gif" alt="">
  <br>
  <br>
</div>


## Terminal
[Warp](https://www.warp.dev), is a blazingly fast, rust-based terminal.

> Using this terminal is a requirement for this guide, as Warp has a lot of features by default.

To install Warp, run the command:
```bash
brew install --cask warp
```


## Installing the Fira Code Nerd font
Run the command:
```bash
brew tap homebrew/cask-fonts
brew install --cask font-fira-code-nerd-font
```


## Installing Zsh
If you are using the last version of MacOS, you already have Zsh installed by default. Run the command:
```bash
# to check if you have it installed already
zsh --version
# if you don't, install it with
brew install zsh
```


## Installing Oh My Zsh
The [Oh My Zsh](https://ohmyz.sh) is a framework for Zsh that standardizes how we can configure themes, plugins and so on. Run the command:
```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```


## Installing Starship
[Starship](https://starship.rs/) is a blazing-fast shell prompt, also rust-based 😜.

```bash
brew install starship
```


## Adding configs to Oh My Zsh
Now you need to define the configurations for Oh My Zsh. To do that, open your `~/.zshrc` file.

With this file open, copy the content of [this file](./.zshrc), paste it, and save it.


## Adding configs to Starship
Now you need to create the theme configuration file. To create this file run the command:
```bash
touch ~/starship.toml
```

Now open this file, copy the content of [this file](./starship.toml), paste it, and save it.


## Done
After all these steps, everything should be ready and working as expected, enjoy ✨.
