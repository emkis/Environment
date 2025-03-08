# Setting up dev environment

Recipe to configure and install all the apps and tools I depend on in my development environment.

- Run `bash ./run.sh` script.
- After this script finishes running successfully, a new SSH key will be copied to the clipboard.
- Open Github and set this new SSH key there to authorise this new device.
- Open VSCode and Sync with Github to get all updated configurations.

## Configuring Warp terminal

As Warp doesn't have a configuration file, so we need to manually set the configs.

Enabling custom prompt:

- Open Warp
- Press `Command + p` then search for the option "Enable Honor User's Custom Prompt"
- Press enter

Setting a custom font:

- Press `Command + p` then search for the option "Open Settings"
- Press enter
- Go to the Appearance
- Set the Terminal font to "FiraCode Nerd Font"
- Set the font size to 17
- Set the line height to 1.25

Setting a custom theme:

- Press `Command + p` then search for the option "Open Theme Picker"
- Select Dark theme
- Press enter
