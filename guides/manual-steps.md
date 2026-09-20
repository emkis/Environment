# New machine: manual steps

Things the setup script can't do, in the order to do them. Start with the macOS settings, which need nothing from this repo, then run `setup/macos.sh` (see [new-mac-setup.md](new-mac-setup.md)), then go through the rest of this list.

## macOS settings

In System Settings, before running the setup script.

- **Storage**:
    - Turn on **Optimise Apple TV storage** and **Empty Bin automatically** (after 30 days).
    - Remove the GarageBand music and sound library.
    - Delete the default apps I don't use: **iMovie**, **GarageBand**, **Keynote**, **Pages**, **Numbers**, **Freeform**.
- **Battery**: charge limit **80%**.
- **General**:
    - Set the machine's name.
    - Autofill & Passwords: turn off autofill and password suggestions.
    - Date & Time: turn off **24-hour time**.
    - Language & Region: add **Português (Brasil)** as the second language, first day of the week **Monday**.
- **Accessibility > Pointer Control**: turn on trackpad dragging, dragging style **Three-Finger Drag**.
- **Desktop & Dock**:
    - Turn on **Automatically hide and show the Dock**.
    - Turn off **Show suggested and recent apps in Dock**.
    - Hot Corners: set all four to **-** (none).
- **Displays**:
    - Turn off **Automatically adjust brightness**.
    - Night Shift: schedule **Sunset to Sunrise**.
- **Spotlight**: turn off results from **Files** and from **iPhone Apps**.
- **Lock Screen**:
    - Turn display off on battery when inactive: **10 minutes**.
    - Require password after screen saver begins or display is turned off: **Immediately**.
    - Set a lock screen message.
- **Touch ID & Password**: turn off Touch ID for **Apple Pay** and for **purchases in iTunes Store, App Store and Apple Books**.
- **Game Center**: sign out and turn it off.
- **Keyboard**:
    - Turn off **Adjust keyboard brightness in low light**, and turn the keyboard brightness all the way down.
    - Input Sources: add **Brazilian – ABNT2** as the second input source.
    - Text Replacements: `email` → my email address.
- **Keyboard > Keyboard Shortcuts**: turn off every default shortcut except:
    - Windows > General > **Minimise**
    - Keyboard > **Move focus to next window**
    - Keyboard > **Show contextual menu**
    - Accessibility > **Turn VoiceOver on or off**
- **Trackpad > Point & Click**: tracking speed on the 6th notch of 10, just past the middle.

## Installation

Open Terminal and run the setup command from [new-mac-setup.md](new-mac-setup.md). It asks for the `sudo` password while installing Homebrew and again while the Brewfile runs.

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
