# After setup

The apps, settings and logins the setup script can't do. These need everything installed, so they come after `setup/index.sh` has run, picking up where [1-setup-new-mac.md](1-setup-new-mac.md) leaves off.

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

- Activate it with the license key (in Bitwarden).

### Shottr

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

### YouTube Music

It has no app, so install it as a PWA:

- Open [music.youtube.com](https://music.youtube.com) in Safari.
- File > **Add to Dock…**, keeping the name **YouTube Music** so its keyboard shortcut works.
- It lands at the end of the Dock. Drag it before Bitwarden, where `setup/steps/desktop.sh` puts it.

### Mos

- Scrolling > Dash key: **Command**.
- Scrolling > Block key: remove the shortcut.

### Luminar Neo

Its installer is private and only accessible through their [skylum.com](https://skylum.com/) website.

- Log in with credentials (in Bitwarden).
- Download the installer.

## Dev

Run these in fish, in a new terminal opened after the setup script.

- GitHub: `gh auth login`, choose **HTTPS** and let it authenticate git, so pushing works with the HTTPS clone. It can be completed from another device.
- VSCode: sign in with GitHub and turn on Settings Sync.
- skhd: `setup/index.sh` starts it, then allow it in Accessibility. If the script warned it couldn't start it, run `skhd --start-service` from fish: the service keeps the `PATH` of the shell it was started from, and `Hyper + Q` (`ide`, runs on bun) and `Hyper + B` (calls `blueutil`) need `/opt/homebrew/bin` in it. If they do nothing, run `skhd --uninstall-service && skhd --start-service` from fish.

## Everything else

The other apps only need opening and logging in, with no special setup.
