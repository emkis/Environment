# envupgrade

Upgrades the whole environment in one go: Homebrew, Rust, every cargo crate and the default Node.

```bash
envupgrade
```

Each step starts under its own header line. A summary at the end has one line per step saying what changed, like `✓ Upgraded Rust (1.98.1 → 1.99.1)`. Each step's own output is shown as it runs, so a slow one like compiling a crate never looks stuck. A failure doesn't stop the others.

## Decisions

- **The default versions always move to the latest.** Rust follows `stable` and Node follows the latest LTS. Upgrading Node removes the previous version from fnm, so only one stays installed. If a project needs an older one, install it with `fnm install`.
- **Cargo crates come from `cargo install --list`, not the Brewfile.** Everything in the Brewfile is already on the system.
