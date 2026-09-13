# New machine: manual steps

Things the setup script can't do. Run `setup/macos.sh` first (see the readme), then go through this list.

## Shell

```bash
echo "$(which fish)" | sudo tee -a /etc/shells
chsh -s "$(which fish)"
```

## Dev

- GitHub: `gh auth login`, choose **HTTPS** and let it authenticate git, so pushing works with the HTTPS clone.
- Node: `fnm install --lts`.
- VSCode: sign in with GitHub and turn on Settings Sync.
- skhd: `skhd --start-service`, then allow it in Accessibility.

## Warp

No config file, so set by hand (`Cmd+P` opens the command palette):

- **Enable Honor User's Custom Prompt**.
- Settings > Appearance: font **FiraCode Nerd Font**, size **17**, line height **1.25**.
- Theme Picker: **Dark**.

## Apps

- **App Store** (not on Homebrew): [Amphetamine](https://apps.apple.com/us/app/amphetamine/id937984704), [ColorSlurp](https://apps.apple.com/br/app/colorslurp/id1287239339).
- Log in to: Bitwarden, Notion, TickTick, Surfshark, browsers, Raycast, Claude Code.
- **Karabiner-Elements**: check the keyboard is listed and mappings work.
- **Bluetooth devices**: run `setup-devices` to pair.
- **Rectangle Pro**: open it twice (first run asks for permissions), paste the activation key, sign in to iCloud, enable iCloud sync and check the config was imported.
- **Clipy**: Main > max history **100**; Shortcuts > main shortcut **Option+V**; add to Login Items.
- **Amphetamine**: install the helper it asks for. Preferences > Session Defaults:
  - Default Duration: Indefinitely
  - End Time Calculation: Use timer
  - Forced Sleep: on
  - Display Sleep: on
  - Closed-Display Mode: off
  - Screen Saver: off
  - Battery: on (10%)
  - Battery Prompt: on
  - Power Adapter: off
