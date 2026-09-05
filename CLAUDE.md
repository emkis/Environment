This repository sets up and maintains a Mac. macOS only — never add branches for
other platforms.

It covers exactly two things:

1. **Setting up a new machine.** Download and run one script from a browser or
   `curl`; it installs everything. `setup.sh`, driven by `Brewfile`.
2. **Keeping dotfiles in sync day to day.** Files live in `home/` and are
   symlinked into `$HOME`, so the repository is the only copy. `link.sh`.

## Principles

- Plain bash and Homebrew. No tool to maintain, no manifest engine, no state file.
- No conditionals in the package list: if it's in the `Brewfile`, it gets installed.
- Every script is safe to re-run — "new machine" and "catch up" are the same command.
- Errors are Homebrew's to report. The scripts aim at the happy path and keep
  going when one package fails.
- Symlinks, never copies. A copy step is a chance to drift.

## Docs

Decisions are written at `docs/adr` for later reference.

## Glossary

Shared vocabulary is in `CONTEXT.md`. Update it when a new term is settled on.

## Testing

Never run these scripts against this machine. They install software, change the
login shell, and write macOS defaults. Test them in a VM, or in a sandbox with
stubbed commands and a throwaway `$HOME`.
