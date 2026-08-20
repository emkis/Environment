import { configSource } from "../engine/paths.ts";
import type { Entry } from "../engine/types.ts";

const BREW_PREFIX = "/opt/homebrew";

export const cli: Entry[] = [
  {
    name: "bash",
    category: "cli",
    check: `test -x ${BREW_PREFIX}/bin/bash`,
    install: "brew install bash",
  },
  {
    name: "fzf",
    category: "cli",
    check: "command -v fzf",
    install: "brew install fzf",
  },
  {
    name: "git",
    category: "cli",
    check: `test -x ${BREW_PREFIX}/bin/git`,
    install: "brew install git",
  },
  {
    name: "blueutil",
    category: "cli",
    check: "command -v blueutil",
    install: "brew install blueutil",
  },
  {
    name: "skhd",
    category: "cli",
    check: "command -v skhd",
    install: [
      "brew install koekeishiya/formulae/skhd",
      `cp ${JSON.stringify(configSource("skhdrc"))} "$HOME/.skhdrc"`,
      "skhd --start-service",
      "skhd --reload",
    ],
  },
  {
    name: "fish",
    category: "cli",
    check: "command -v fish",
    install: [
      "brew install fish",
      'grep -q "$(command -v fish)" /etc/shells || command -v fish | sudo tee -a /etc/shells',
      'chsh -s "$(command -v fish)"',
    ],
  },
  {
    name: "starship",
    category: "cli",
    check: "command -v starship",
    install: "brew install starship",
  },
  {
    name: "fnm",
    category: "cli",
    check: "command -v fnm",
    install: ["brew install fnm", 'eval "$(fnm env)" && fnm install --lts'],
  },
  {
    name: "bun",
    category: "cli",
    check: "command -v bun",
    install: "brew install oven-sh/bun/bun",
  },
  {
    name: "pnpm",
    category: "cli",
    check: "command -v pnpm",
    install: "brew install pnpm",
  },
  {
    name: "git-recent",
    category: "cli",
    check: "command -v git-recent",
    install: "pnpm add --global git-recent",
    requires: ["pnpm"],
  },
  {
    name: "eas-cli",
    category: "cli",
    check: "command -v eas",
    install: "pnpm add --global eas-cli",
    requires: ["pnpm"],
  },
  {
    name: "watchman",
    category: "cli",
    check: "command -v watchman",
    install: "brew install watchman",
  },
  {
    name: "bat",
    category: "cli",
    check: "command -v bat",
    install: "brew install bat",
  },
  {
    name: "eza",
    category: "cli",
    check: "command -v eza",
    install: "brew install eza",
  },
  {
    name: "zoxide",
    category: "cli",
    check: "command -v zoxide",
    install: "brew install zoxide",
  },
  {
    name: "tree",
    category: "cli",
    check: "command -v tree",
    install: "brew install tree",
  },
  {
    name: "tokei",
    category: "cli",
    check: "command -v tokei",
    install: "brew install tokei",
  },
  {
    name: "tock",
    category: "cli",
    check: "command -v tock",
    install: "brew install tock",
  },
  {
    name: "claude-code",
    category: "cli",
    check: "command -v claude",
    install: "curl -fsSL https://claude.ai/install.sh | bash",
  },
  {
    name: "gnupg",
    category: "cli",
    check: "command -v gpg",
    install: "brew install gnupg",
  },
];
