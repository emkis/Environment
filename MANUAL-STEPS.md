# Manual steps

What `setup.sh` can't do, because it needs a GUI, a login, or a permission only you
can grant. Work through this after a fresh setup.

## karabiner-elements

- Open Karabiner-Elements once so macOS prompts for permissions.
- Grant Input Monitoring and Accessibility in System Settings → Privacy & Security.
- Confirm the config is active under Karabiner-Elements → Complex Modifications.

> Karabiner rewrites `~/.config/karabiner/karabiner.json` when you change settings
> in its UI, and rewriting replaces the symlink with a real file. Edit the copy in
> `home/` instead, and re-run `./link.sh` if the link is ever replaced.

## skhd

- Grant Accessibility to `skhd` in System Settings → Privacy & Security.
  Until then it starts, exits 0, and silently does nothing.
- `skhd --restart-service` after granting it.

## rectangle-pro

- Copy the activation key and activate Rectangle Pro.

**If personal device**

- Ensure you're logged in to iCloud.
- Enable iCloud sync in Rectangle Pro.
- Double-check whether Rectangle Pro already imported the custom configuration from iCloud.
- If not, import it from `manual/RectangleProConfig.json`.

**If third-party device**

- Disable iCloud sync in Rectangle Pro.
- Import the custom configuration from `manual/RectangleProConfig.json`.

## android-studio

- Launch Android Studio once and complete the first-run wizard.
- Accept the Android SDK licenses when prompted.
- Confirm the SDK path matches `ANDROID_HOME` (`~/Library/Android/sdk`, set in `config.fish`).

## zed

- Zed rewrites `~/.config/zed/settings.json` when you change a setting in its UI,
  which replaces the symlink with a real file. Edit `home/.config/zed/settings.json`
  instead, and re-run `./link.sh` if the link is ever replaced.

## ssh key

- `macos.sh` copies the public key to the clipboard — paste it into GitHub
  (Settings → SSH and GPG keys) before pushing anything.

## Not installed by Homebrew

- Anything from the App Store.
- Prompts repository: `git clone` it into `~/projects/Prompts`, where
  `PROMPTS_REPOSITORY` in `config.fish` expects it.
