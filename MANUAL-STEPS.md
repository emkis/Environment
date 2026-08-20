# Manual steps

Steps that can't be automated — almost always GUI actions. Entries in the Manifest point here
via `manualStepsRef`; `chest` prints the pointer after installing such an Entry and again in the
summary at the end of a Sweep.

## rectangle-pro

- Copy the activation key and activate Rectangle Pro.

**If personal device**

- Ensure you're logged in to iCloud.
- Enable iCloud sync in Rectangle Pro.
- Double-check whether Rectangle Pro already imported the custom configuration from iCloud.
- If not, import it from `packages/chest/configs/RectangleProConfig.json`.

**If third-party device**

- Disable iCloud sync in Rectangle Pro.
- Import the custom configuration from `packages/chest/configs/RectangleProConfig.json`.

## karabiner-elements

- Open Karabiner-Elements once so macOS prompts for permissions.
- Grant Input Monitoring and Accessibility permissions in
  System Settings → Privacy & Security.
- Confirm the copied `karabiner.json` is active under Karabiner-Elements → Complex Modifications.

## android-studio

- Launch Android Studio once and complete the first-run wizard.
- Accept the Android SDK licenses when prompted.
- Confirm the SDK path matches `ANDROID_HOME` (`~/Library/Android/sdk`, set in `config.fish`).

## bluetooth-devices

- Turn the device on and put it in pairing mode before selecting it in the picker.
- The trackpad usually needs unpairing first if it was previously paired to another Mac:
  `blueutil --unpair <device-id>`, then run `chest` again.

## ssh-key

- The public key is copied to the clipboard by the install step — paste it into GitHub
  (Settings → SSH and GPG keys) before pushing anything.
