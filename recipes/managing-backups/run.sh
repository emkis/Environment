#!/opt/homebrew/bin/bash

set -euo pipefail

GDRIVE_REMOTE="gdrive:/"

# Always revoke the Google Drive token when the script exits, even on failure
trap 'rclone config disconnect gdrive: 2>/dev/null; echo "🔑 Google Drive token revoked."' EXIT

# Install rclone via Homebrew if not already available
if ! command -v rclone &>/dev/null; then
    echo "📦 Installing rclone..."
    brew install rclone
    echo "✅ rclone installed."
fi

# Create the Google Drive remote with read-only access and authorise via browser
if ! rclone listremotes | grep -q "^gdrive:"; then
    echo "🔑 Google Drive remote not found, configuring..."
    rclone config create gdrive drive scope=drive.readonly
    echo "🌐 Opening browser to authorise Google Drive access..."
    rclone config reconnect gdrive:
    echo "✅ Google Drive remote configured."
fi

# List external volumes and let the user pick the SSD via fzf
echo ""
echo "💾 Select the SSD volume to sync into:"
volumes=$(ls /Volumes/ | grep -v "^Macintosh HD$")
[ -z "$volumes" ] && { echo "❌ No external volumes found. Connect the SSD first."; exit 1; }
volume=$(echo "$volumes" | fzf --prompt="Volume: ")
[ -z "$volume" ] && { echo "No volume selected."; exit 1; }
SSD_PATH="/Volumes/$volume"

# Confirm before making any changes to the SSD
echo ""
read -r -p "Sync $GDRIVE_REMOTE → $SSD_PATH? [y/N] " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }

# Sync Google Drive to the SSD — copies new/modified files, removes deleted ones, compares by hash
echo ""
echo "🔄 Syncing $GDRIVE_REMOTE → $SSD_PATH..."
rclone sync "$GDRIVE_REMOTE" "$SSD_PATH" --checksum --progress
echo "✅ Sync complete."

# Verify every file on the SSD matches Google Drive by checksum
echo ""
echo "🔍 Verifying integrity..."
rclone check "$GDRIVE_REMOTE" "$SSD_PATH" --checksum
echo "✅ Integrity verified."

echo ""
echo "✅ All done."
