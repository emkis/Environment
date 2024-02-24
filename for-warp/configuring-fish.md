# Configuring `fish` shell

I've been feeling the `zsh` shell a bit slow lately and it's bothering me, so I'm going to try using the `fish` shell which seems like a great alternative. Apparently, it seems a really fast alternative and simple to configure, so I'm going to test it a little to see what I think.

## Installing `fish`
```sh
brew install fish
```

## Installing `fisher`
This is a plugin manager for `fish`
```sh
curl -sL https://raw.githubusercontent.com/jorgebucaran/fisher/main/functions/fisher.fish | source && fisher install jorgebucaran/fisher
```

## Installing plugins
```sh
fisher install jethrokuan/z
```

## Starting `fish` and setting tool paths
```sh
fish
fish_add_path /opt/homebrew/bin/brew
fish_add_path /opt/homebrew/bin/fzf
```

## Configuring `fish`
- Open the `~/.config/fish/config.fish` file
- [Paste the content of this link](https://github.com/emkis/Environment/blob/main/for-warp/config.fish)
- Restart the shell

## Setting `fish` as the default shell
```sh
echo $(which fish) | sudo tee -a /etc/shells
chsh -s $(which fish)
```
