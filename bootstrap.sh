#!/bin/bash
# Bootstrap: the only step that runs before chest can run.
# Installs Homebrew and Bun on a machine that has neither, then stops.
set -euo pipefail

echo '>> Installing Homebrew'
if command -v brew >/dev/null 2>&1; then
  echo 'Homebrew already installed'
else
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

if [ -x /opt/homebrew/bin/brew ]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
fi

echo '>> Installing Bun'
if command -v bun >/dev/null 2>&1; then
  echo 'Bun already installed'
else
  brew install oven-sh/bun/bun
fi

cat <<'MESSAGE'

Bootstrap complete.

Next step — run chest from this repository:

  ENVIRONMENT_REPOSITORY="$(pwd)" ./bin/chest

It will check this machine against the Manifest and let you pick what to install.
MESSAGE
