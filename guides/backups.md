# Backups

Local copy of Google Drive on an encrypted external SSD, a few times per year.

1. Connect and unlock the SSD.
2. Run `guides/managing-backups/run.sh` and pick the SSD from the list.

It runs `rclone sync` (new, changed and deleted files, compared by hash) and then `rclone check` to verify the SSD matches Drive. Exclusions live in `exclude-rules.txt` next to the script.

## Security

- rclone is authorised with `drive.readonly`, so it can't modify Drive.
- The OAuth token is removed from the local rclone config when the script exits, even on failure.
- To also revoke on Google's side, remove rclone at [myaccount.google.com/permissions](https://myaccount.google.com/permissions).
