# New Mac setup

Everything a new Mac needs, in order. Start here and go top to bottom: the last step hands over to [manual-steps.md](manual-steps.md), which covers what can only be done once the script has run.

## 1. macOS settings

In System Settings. Nothing here needs this repo, so it all works on a machine straight out of the box.

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

## 2. Run the setup script

On a fresh Apple Silicon Mac, open Terminal and run:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/emkis/Environment/main/setup/macos.sh)"
```

Run it as my user, not with `sudo`. It asks for my password while installing Homebrew, and again while the Brewfile runs. It's safe to run again: finished steps are skipped, so if something fails, fix it and run the same command.

What it does:

1. **Homebrew**: installs it, which also installs the Xcode Command Line Tools (and with them, git).
2. **Clones this repo** into `~/projects/Environment`, over HTTPS.
3. **Rosetta**: installs it with `softwareupdate`, as it isn't on Homebrew. Intel-only apps need it.
4. **Brewfile**: installs everything in `setup/Brewfile`.
5. **Default shell**: makes fish the login shell. It asks for my password, and starts in the next terminal I open.
6. **Dotfiles and tools**: links them into my home folder with `envsync`. See [dotfiles-and-tools.md](dotfiles-and-tools.md).
7. **Dock**: no delay before it shows up, and a faster animation.

## 3. Apps and logins

Open a new terminal, so it runs fish, then carry on with [manual-steps.md](manual-steps.md): the app settings and logins the script can't do.

## Keeping the Brewfile up to date

From the repo root:

```bash
brew bundle install --file=setup/Brewfile            # install what's missing
brew bundle check   --file=setup/Brewfile --verbose  # list what's missing
brew bundle cleanup --file=setup/Brewfile            # list what's installed but unlisted
```
