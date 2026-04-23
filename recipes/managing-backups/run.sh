#!/opt/homebrew/bin/bash

set -euo pipefail

GDRIVE_REMOTE="gdrive:/"

# Install rclone if missing
if ! command -v rclone &>/dev/null; then
    echo "📦 Installing rclone..."
    brew install rclone
    echo "✅ rclone installed."
fi

# Configure Google Drive remote if missing
if ! rclone listremotes | grep -q "^gdrive:"; then
    echo "🔑 Google Drive remote not found, configuring..."
    rclone config create gdrive drive scope=drive.readonly
    echo "🌐 Opening browser to authorise Google Drive access..."
    rclone config reconnect gdrive:
    echo "✅ Google Drive remote configured."
fi

# Pick volume via fzf, excluding the system disk
echo ""
echo "💾 Select the SSD volume to sync into:"
volume=$(ls /Volumes/ | grep -v "^Macintosh HD$" | fzf --prompt="Volume: ")
SSD_PATH="/Volumes/$volume"

echo ""
read -r -p "Sync $GDRIVE_REMOTE → $SSD_PATH? [y/N] " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }

echo ""
echo "🔄 Syncing $GDRIVE_REMOTE → $SSD_PATH..."
rclone sync "$GDRIVE_REMOTE" "$SSD_PATH" --checksum --progress
echo "✅ Sync complete."

echo ""
echo "🔍 Verifying integrity..."
rclone check "$GDRIVE_REMOTE" "$SSD_PATH" --checksum
echo "✅ Integrity verified."

echo ""
rclone config disconnect gdrive:
echo "🔑 Google Drive token revoked."

echo ""
echo "✅ All done."
