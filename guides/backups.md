# Backups

Local copy of Google Drive on an encrypted external SSD, a few times per year.

1. Connect and unlock the SSD.
2. Run `guides/managing-backups/run.sh`, pick the SSD from the list and confirm.
3. Authorise read-only access to Google Drive in the browser tab that opens.

Everything goes into a `Google Drive` folder on the SSD; nothing else on it is touched. Exclusions live in `exclude-rules.txt` next to the script.

## How it works

It runs `rclone sync` to make the folder match Drive, then `rclone check` to verify it.

- **New or changed on Drive:** copied to the SSD, changes detected by hash.
- **Deleted from Drive:** deleted from the SSD too.
- **Corrupted on the SSD:** reported by the check, and recopied on the next run.
- **Errors during the sync:** nothing is deleted from the SSD. Run it again to retry.

Older backups were synced to the root of the SSD. Before the first run with the `Google Drive` folder, move those files into it (leave the hidden system folders), or the whole Drive downloads again next to them.

## Security

- rclone is authorised with `drive.readonly`, so it can't modify Drive.
- When the script exits, even on failure, it deletes the `gdrive` remote from the rclone config, and the OAuth token with it. That's why every run asks to authorise again.
- That only removes the token from this Mac. To also revoke it on Google's side, remove rclone at [myaccount.google.com/permissions](https://myaccount.google.com/permissions).
