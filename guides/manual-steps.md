# New machine: manual steps

Things the setup script can't do. Run `setup/macos.sh` first (see [new-mac-setup.md](new-mac-setup.md)), then go through this list.

## Shell

`setup/macos.sh` makes fish the default shell, so **open a new terminal** before going on. It runs fish, whose config puts Homebrew and `~/bin` on the `PATH`; in zsh, `gh`, `fnm` and `skhd` aren't found.

If the script warned it couldn't do it, set it by hand. Use the full path, as Homebrew isn't on zsh's `PATH` (`which fish` would find nothing):

```bash
echo /opt/homebrew/bin/fish | sudo tee -a /etc/shells
chsh -s /opt/homebrew/bin/fish
```

## Dev

Run these in fish (the new terminal from the step above).

- GitHub: `gh auth login`, choose **HTTPS** and let it authenticate git, so pushing works with the HTTPS clone.
- VSCode: sign in with GitHub and turn on Settings Sync.
- skhd: `skhd --start-service`, then allow it in Accessibility. It must be started from fish: the service keeps the `PATH` of the shell it was started from, and Hyper+Q (`ide`, runs on bun) and Hyper+B (calls `blueutil`) need `/opt/homebrew/bin` in it. If they do nothing, run `skhd --uninstall-service && skhd --start-service` from fish.

## Warp

No config file, so set by hand (`Cmd+P` opens the command palette):

- **Enable Honor User's Custom Prompt**.
- Settings > Appearance: font **FiraCode Nerd Font**, size **17**, line height **1.25**.
- Theme Picker: **Dark**.

## Apps

- Log in to: Bitwarden, Notion, TickTick, Surfshark, browsers, Claude Code.
- **Karabiner-Elements**: check the keyboard is listed and mappings work.
- **Bluetooth devices**: run `blu pair` to pair.
- **Rectangle Pro**: open it twice (first run asks for permissions), paste the activation key, sign in to iCloud, enable iCloud sync and check the config was imported.
- **Clipy**: Main > max history **100**; Shortcuts > main shortcut **Option+V**; add to Login Items.
