import type { Entry } from "../engine/types.ts";

const FONTS_DIR = "$HOME/Library/Fonts";

export const font: Entry[] = [
  {
    name: "fira-code",
    category: "font",
    check: `command ls "${FONTS_DIR}" | grep -qi "^FiraCode-"`,
    install: "brew install --cask font-fira-code",
  },
  {
    name: "fira-code-nerd-font",
    category: "font",
    check: `command ls "${FONTS_DIR}" | grep -qi "Fira.*Nerd"`,
    install: "brew install --cask font-fira-code-nerd-font",
  },
  {
    name: "lora",
    category: "font",
    check: `command ls "${FONTS_DIR}" | grep -qi "^Lora"`,
    install: "brew install --cask font-lora",
  },
];
