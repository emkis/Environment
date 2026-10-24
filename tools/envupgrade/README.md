# envupgrade

Upgrades the whole environment in one go: Homebrew, Rust, every cargo crate and the default Node.

```bash
envupgrade
```

Each step prints one line saying what changed, like `✓ Upgraded Rust (1.98.1 → 1.99.1)`. A step's own output is hidden unless it fails, and a failure doesn't stop the others.

## Decisions

- **The default versions always move to the latest.** Rust follows `stable` and Node follows the latest LTS. Upgrading Node removes the previous version from fnm, so only one stays installed. If a project needs an older one, install it with `fnm install`.
- **Homebrew is the only step that talks to the terminal.** It lists what's outdated first, then runs `brew upgrade` with its output live, so you can see what asks for a password or a confirmation.
- **Cargo crates come from `cargo install --list`, not the Brewfile.** Everything in the Brewfile is already on the system.
