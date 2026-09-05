# Glossary

Shared vocabulary for this repository. Update as new terms are settled on.

**Brewfile** — the package list. Every formula, cask and font, in install order.
Read by `brew bundle`. Adding a line here is how a tool joins the setup.

**Setup** — `setup.sh`. Takes a Mac with nothing on it to a working machine:
Xcode Command Line Tools, sudo, Homebrew, clone, `brew bundle`, link, macOS
settings. Idempotent, so running it again is how a machine catches up.

**Link** — `link.sh`. Symlinks every file under `home/` to the same path under
`$HOME`. The one command for day-to-day dotfile work.

**Home tree** — the `home/` directory. Mirrors `$HOME` exactly, so the
destination of a file is its own path: `home/.config/fish/config.fish` belongs at
`~/.config/fish/config.fish`. No mapping table to maintain.

**Manual step** — something no script can do: a GUI permission, a licence key, an
App Store install. Listed in `MANUAL-STEPS.md`, with any files it needs in
`manual/`.

**Backup** — what `link.sh` does with a real file already sitting at a link's
destination: moves it to `<file>.backup` rather than deleting it.

**Global bins** — `bin/` in this checkout, put on `$PATH` by `config.fish` via
`GLOBAL_BINS`. Nothing is copied or symlinked; the scripts run from the repository.
