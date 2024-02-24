# Configuring `fish` shell

I've been feeling the `zsh` shell a bit slow lately and it's bothering me, so I'm going to try using the `fish` shell which seems like a great alternative. Apparently, it seems a really fast alternative and simple to configure, so I'm going to test it a little to see what I think.

## Setting `fish` as default shell


```
brew install fish

echo /opt/homebrew/bin/fish | sudo tee -a /etc/shells

chsh -s /opt/homebrew/bin/fish
```
