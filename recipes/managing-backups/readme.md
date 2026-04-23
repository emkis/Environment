# Managing backups

Recipe to keep a local backup of Google Drive on an encrypted external SSD. Ideally, something I do a few times per year to ensure I have local copies of my files.

- Connect the encrypted SSD, and unlock it.
- Run `./run.sh`
- Pick the SSD from the volume list.
- It should start the backup and verification.

## How it works

It uses `rclone` to sync Google Drive with the external SSD. After the sync, it verifies the SSD matches Google Drive exactly.

- **New file on Google Drive?** Downloads to the SSD.
- **File modified on Google Drive?** Re-copies to the SSD, detects by hash.
- **File deleted on Google Drive?** Removes from the SSD as well.
- **File corrupted on the SSD?** Caught by the hash check and recopied from Google Drive.

## Security

- **Read-only scope** — `rclone` is authorised with `drive.readonly`, so it can never modify or delete anything on Google Drive.
- **Token revoked after each run** — the OAuth token is removed from the local `rclone` config as soon as the backup and verification finishes.
- **Manual revocation** — to fully revoke access on Google's side, visit [myaccount.google.com/permissions](https://myaccount.google.com/permissions) and remove rclone.
