# Shared by the setup steps, which source it. Written for the macOS system
# bash (3.2), as the steps run before Homebrew's bash is installed.

REPOSITORY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

step() { printf '\n\033[1;34m>> %s\033[0m\n' "$1"; }
warn() { printf '\033[1;33m!! %s\033[0m\n' "$1"; }
