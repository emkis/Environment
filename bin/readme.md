# Global bin files

All files in this folder are just symlinks pointing to useful bins I want to have access globally for easy of use.

To create a new symlink, run the following command from the root of the repo:

```bash
ln -s $(realpath ./script-name.sh) ./bin/script-alias
```

To sync all local bin files with the global ones, run:
```bash
sync-bins
```
