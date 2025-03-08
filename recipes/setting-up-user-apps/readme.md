# Setting up user apps

Recipe to install all the apps I regular use that are not related to engineering in any way.

- Run `bash ./run.sh` script.
- After the script finishes running, all apps should be installed.
- Many of these apps will require to log in individually.
- Many of these apps also require manual configuration as they don't have a CLI or something we can use to automate.

### Installing apps from store

Some apps are not available from homebrew, so we need to installed from the store manually.

- Amphetamine: https://apps.apple.com/us/app/amphetamine/id937984704
- ColorSlurp: https://apps.apple.com/br/app/colorslurp/id1287239339

### Configuring Clipy

- Go to the Main tab.
- Set the "Max clipboard history size" to 100.
- Go to the Shortcuts tab.
- Set the main shortcut to "Option + V".
- Ensure app is listed on the Login options of MacOS to open at login.

### Configuring Amphetamine

- Open the app and install the helper it will ask you to install.
- Open the app's preferences.
- Go to the Session Defaults tab and set these options:
  - Default Duration: Indefinitely
  - End Time Calculation: Use timer
  - Forced Sleep: Checked
  - Display Sleep: Checked
  - Closed-Display Mode: Un-checked
  - Screen Saver: Un-checked
  - Battery: Checked (10% battery)
  - Battery Prompt: Checked
  - Power Adapter: Un-checked
