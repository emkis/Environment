#!/opt/homebrew/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GDRIVE_REMOTE="gdrive:/"
BACKUP_FOLDER="Google Drive"
EXCLUDE_FILE="$SCRIPT_DIR/exclude-rules.txt"

has_gdrive_remote() {
    grep -qx "gdrive:" <<< "$(rclone listremotes)"
}

# Delete the remote, and the OAuth token with it, when the script exits, even on failure.
# `rclone config disconnect` left the token in the config, so the whole remote goes
delete_token() {
    has_gdrive_remote || return 0
    if rclone config delete gdrive; then
        echo "🔑 Google Drive token deleted from the rclone config."
    else
        echo "⚠️  Could not delete the Google Drive token, run: rclone config delete gdrive" >&2
    fi
}
trap delete_token EXIT

# Install rclone via Homebrew if not already available
if ! command -v rclone &>/dev/null; then
    echo "📦 Installing rclone..."
    brew install rclone
    echo "✅ rclone installed."
fi

# List external volumes and let the user pick the SSD via fzf.
# The internal disk is a symlink in /Volumes, so -type d leaves it out
echo ""
echo "💾 Select the SSD volume to sync into:"
volumes=$(find /Volumes -mindepth 1 -maxdepth 1 -type d -exec basename {} \;)
[ -z "$volumes" ] && { echo "❌ No external volumes found. Connect and unlock the SSD first."; exit 1; }
volume=$(fzf --prompt="Volume: " <<< "$volumes" || true)
[ -z "$volume" ] && { echo "No volume selected."; exit 1; }
BACKUP_PATH="/Volumes/$volume/$BACKUP_FOLDER"

# Confirm before making any changes to the SSD
echo ""
if [ ! -d "$BACKUP_PATH" ]; then
    echo "📁 $BACKUP_PATH doesn't exist yet, the whole Drive will be downloaded into it."
fi
echo "Files in $BACKUP_PATH that aren't on Google Drive will be deleted."
read -r -p "Sync $GDRIVE_REMOTE → $BACKUP_PATH? [y/N] " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || { echo "Aborted."; exit 0; }

# Create the Google Drive remote with read-only access, rclone opens the browser to authorise it
if ! has_gdrive_remote; then
    echo ""
    echo "🌐 Opening browser to authorise read-only Google Drive access..."
    rclone config create gdrive drive scope=drive.readonly
    echo "✅ Google Drive authorised."
fi

# Sync Google Drive to the SSD: copies new and changed files (compared by hash) and deletes
# files removed from Drive. If anything fails, rclone skips the deletions
echo ""
echo "🔄 Syncing $GDRIVE_REMOTE → $BACKUP_PATH..."
failed=false
if rclone sync "$GDRIVE_REMOTE" "$BACKUP_PATH" --checksum --progress --exclude-from "$EXCLUDE_FILE"; then
    echo "✅ Sync complete."
else
    echo "❌ Sync had errors, no files were deleted from the SSD."
    failed=true
fi

# Verify every file on Google Drive is on the SSD with the same checksum
echo ""
echo "🔍 Verifying integrity..."
if rclone check "$GDRIVE_REMOTE" "$BACKUP_PATH" --checksum --one-way --exclude-from "$EXCLUDE_FILE"; then
    echo "✅ Integrity verified."
else
    echo "❌ Some files are missing or differ on the SSD."
    failed=true
fi

echo ""
if [ "$failed" = true ]; then
    echo "⚠️  Finished with errors, see the output above. Run it again to retry."
    exit 1
fi
echo "✅ All done."
