# New Mac setup

Everything a new Mac needs, in order. Start here and go top to bottom: the last step hands over to [manual-steps.md](manual-steps.md), which covers what can only be done once the script has run.

## 1. macOS settings

In System Settings. Nothing here needs this repo, so it all works on a machine straight out of the box.

- **Storage**:
    - Turn on **Optimise Apple TV storage**.
- **Battery**:
    - Charge limit **80%**.
- **General**:
    - Set the machine's name.
    - Autofill & Passwords: turn off autofill and password suggestions.
- **Accessibility > Pointer Control**:
    - Turn on trackpad dragging, dragging style **Three-Finger Drag**.
- **Displays**:
    - Turn off **Automatically adjust brightness**.
    - Night Shift: schedule **Sunset to Sunrise**.
- **Menu Bar**:
    - Turn on **Bluetooth**.
- **Spotlight**:
    - Turn off results from **Files** and from **iPhone Apps**.
- **Lock Screen**:
    - Set a lock screen message.
- **Touch ID & Password**:
    - Turn off Touch ID for **Apple Pay** and for **purchases in iTunes Store, App Store and Apple Books**.
- **Game Center**:
    - Sign out and turn it off.
- **Keyboard**:
    - Turn off **Adjust keyboard brightness in low light**, and turn the keyboard brightness all the way down.
    - Input Sources: add **Brazilian – ABNT2** as the second input source.
    - Text Replacements: `email` → your email address.
- **Keyboard > Keyboard Shortcuts**: turn off every default shortcut except:
    - Windows > General > **Minimise**
    - Keyboard > **Move focus to next window**
    - Keyboard > **Show contextual menu**
    - Accessibility > **Turn VoiceOver on or off**

## 2. Run the setup script

On a fresh Apple Silicon Mac, open Terminal and run:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup/index.sh)"
```

Run it as your normal user, not with `sudo`. It asks for your password while installing Homebrew, and again while the Brewfile runs. It's safe to run again: finished steps are skipped, so if something fails, fix it and run the same command.

What it does:

1. **Homebrew**: installs it, which also installs the Xcode Command Line Tools (and with them, git).
2. **Clones this repo** into `~/projects/Environment`, over HTTPS.
3. **macOS settings**: the System Settings that have a command: the Dock, language and region, trackpad speed, the Bin, window tiling and the lock screen. It also deletes the default apps and GarageBand's sound library.
4. **Rosetta**: installs it with `softwareupdate`, as it isn't on Homebrew. Intel-only apps need it.
5. **Rust**: installs `rustup` and the stable toolchain, so the Brewfile's `cargo` entries can install.
6. **Brewfile**: installs everything in `setup/Brewfile`.
7. **Default shell**: makes fish the login shell. It asks for your password, and takes effect in the next terminal you open.
8. **Dotfiles and tools**: links them into your home folder with `envsync`. See [envsync's README](../tools/envsync/README.md).
9. **Node**: installs the latest LTS with `fnm`, which becomes the default.
10. **skhd**: starts its service, so the hotkeys work once it's allowed in Accessibility.
11. **Dock**: sets its apps and their order, no delay before it shows up, and a faster animation.

## 3. Apps and logins

Open a new terminal, so it runs fish, then carry on with [manual-steps.md](manual-steps.md): the app settings and logins the script can't do.

## Keeping the Brewfile up to date

From the repo root:

```bash
brew bundle install --file=setup/Brewfile            # install what's missing
brew bundle check   --file=setup/Brewfile --verbose  # list what's missing
brew bundle cleanup --file=setup/Brewfile            # list what's installed but unlisted
```
