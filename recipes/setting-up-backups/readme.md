# Setting up backups

Recipe to create and verify the file integrity for external drives I use for local backup.

Once the backup drive is connected:

- Run `./run.sh` script with the root path of the external drive as argument.
- In case no previous hashes exist, it will create them.
- In case hashes already exist, it will verify them against the files.

## Manually triggering

In cases I want to manually trigger a specific backup script, I can run the following commands:

- `./create-hashes.sh /path/to/backup/directory`: To create checksums for all files in the backup directory.
- `./verify-hashes.sh /path/to/backup/directory`: To verify the checksums of all files in the backup directory.
