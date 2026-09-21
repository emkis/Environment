# New machine: manual steps

The apps, settings and logins the setup script can't do. These need everything installed, so they come after `setup/macos.sh` has run, picking up where the new Mac setup guide leaves off.

## Shell

`setup/macos.sh` makes fish the default shell, so **open a new terminal** before going on. It runs fish, whose config puts Homebrew and `~/bin` on the `PATH`; in zsh, `gh`, `fnm` and `skhd` aren't found.

If the script warned it couldn't do it, set it by hand. Use the full path, as Homebrew isn't on zsh's `PATH` (`which fish` would find nothing):

```bash
echo /opt/homebrew/bin/fish | sudo tee -a /etc/shells
chsh -s /opt/homebrew/bin/fish
```

## Apps

For each app: open it and grant every permission it asks for, then set it up as below.

### Karabiner-Elements

It turns Right Command into the Hyper key (`Control + Option + Shift + Command`), which skhd's shortcuts use, so set it up before anything else.

### Bitwarden

Before the Dev steps, as `gh auth login` needs GitHub logged in on the browser, and the license keys below are in Bitwarden.

- Log in (needs the master password or another device).
- Settings: session timeout **1 minute**, turn on **Unlock with Touch ID**, turn off **Start automatically on login**.
- System Settings > General > Login Items: remove Bitwarden, as it adds itself.

### Sol

Open it from the Dock's Apps folder, as Spotlight is off. Its config comes from the dotfiles, so there's nothing to set.

### Warp

Log in. Warp syncs its own settings, so they come back once logged in.

### Rectangle Pro

- Turn off macOS's default window tiling.
- Activate it with the license key (in Bitwarden).

### Shottr

- Turn on **Launch at startup**.
- Screenshots folder: **Desktop**.
- Instant Text/QR Recognition shortcut: `Shift + Command + 3`
- Activate it with the license key (in Bitwarden).

### Clipy

- General > Clipboard History > Max clipboard history size: **100**.
- Appearance > Status Bar icon style: **None**.
- Turn off every default shortcut in Shortcuts > Menu, except Main.
- Shortcuts > Menu > Main: `Option + V`

### Hex

- Download the **Parakeet TDT v2** transcription model.
- Turn off **Show dock icon** and **Super fast mode**.
- Shortcut: `Hyper + ]`
- Maximum History Entries: **50**.

### Mos

- Scrolling > Dash key: **Command**.
- Scrolling > Block key: remove the shortcut.

## Dev

Run these in fish (the new terminal from the Shell step).

- GitHub: `gh auth login`, choose **HTTPS** and let it authenticate git, so pushing works with the HTTPS clone. It can be completed from another device.
- VSCode: sign in with GitHub and turn on Settings Sync.
- skhd: `setup/macos.sh` starts it, then allow it in Accessibility. If the script warned it couldn't start it, run `skhd --start-service` from fish: the service keeps the `PATH` of the shell it was started from, and `Hyper + Q` (`ide`, runs on bun) and `Hyper + B` (calls `blueutil`) need `/opt/homebrew/bin` in it. If they do nothing, run `skhd --uninstall-service && skhd --start-service` from fish.

## Dock

Keep these, in this order:

1. Finder
2. Apps
3. TickTick
4. Zen
5. Notion
6. Warp
7. VSCode
8. Bitwarden

## Everything else

The other apps only need opening and logging in, with no special setup.
