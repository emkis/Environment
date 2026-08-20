import { configSource } from "../engine/paths.ts";
import type { Entry } from "../engine/types.ts";

function appInstalled(bundleName: string): string {
  return `test -d ${JSON.stringify(`/Applications/${bundleName}.app`)}`;
}

export const app: Entry[] = [
  {
    name: "karabiner-elements",
    category: "app",
    check: appInstalled("Karabiner-Elements"),
    install: [
      "brew install --cask karabiner-elements",
      'mkdir -p "$HOME/.config/karabiner"',
      `cp ${JSON.stringify(configSource("karabiner.json"))} "$HOME/.config/karabiner/karabiner.json"`,
    ],
    manualStepsRef: "MANUAL-STEPS.md#karabiner-elements",
  },
  {
    name: "rectangle-pro",
    category: "app",
    check: appInstalled("Rectangle Pro"),
    install: ["brew install --cask rectangle-pro", 'open -a "Rectangle Pro"'],
    manualStepsRef: "MANUAL-STEPS.md#rectangle-pro",
  },
  {
    name: "notion",
    category: "app",
    check: appInstalled("Notion"),
    install: "brew install --cask notion",
  },
  {
    name: "ticktick",
    category: "app",
    check: appInstalled("TickTick"),
    install: "brew install --cask ticktick",
  },
  {
    name: "surfshark",
    category: "app",
    check: appInstalled("Surfshark"),
    install: "brew install --cask surfshark",
  },
  {
    name: "zen",
    category: "app",
    check: `${appInstalled("Zen")} || ${appInstalled("Zen Browser")}`,
    install: "brew install --cask zen",
  },
  {
    name: "google-chrome",
    category: "app",
    check: appInstalled("Google Chrome"),
    install: "brew install --cask google-chrome",
  },
  {
    name: "firefox",
    category: "app",
    check: appInstalled("Firefox"),
    install: "brew install --cask firefox",
  },
  {
    name: "bitwarden",
    category: "app",
    check: appInstalled("Bitwarden"),
    install: "brew install --cask bitwarden",
  },
  {
    name: "the-unarchiver",
    category: "app",
    check: appInstalled("The Unarchiver"),
    install: "brew install --cask the-unarchiver",
  },
  {
    name: "iina",
    category: "app",
    check: appInstalled("IINA"),
    install: "brew install --cask iina",
  },
  {
    name: "shottr",
    category: "app",
    check: appInstalled("Shottr"),
    install: "brew install --cask shottr",
  },
  {
    name: "mos",
    category: "app",
    check: appInstalled("Mos"),
    install: "brew install --cask mos",
  },
  {
    name: "clipy",
    category: "app",
    check: appInstalled("Clipy"),
    install: "brew install --cask clipy",
  },
  {
    name: "raycast",
    category: "app",
    check: appInstalled("Raycast"),
    install: "brew install --cask raycast",
  },
  {
    name: "hex",
    category: "app",
    check: appInstalled("Hex"),
    install: "brew install --cask kitlangton-hex",
  },
  {
    name: "android-studio",
    category: "app",
    check: appInstalled("Android Studio"),
    install: ["brew install --cask zulu@17", "brew install --cask android-studio"],
    manualStepsRef: "MANUAL-STEPS.md#android-studio",
  },
  {
    name: "vscode",
    category: "app",
    check: appInstalled("Visual Studio Code"),
    install: "brew install --cask visual-studio-code",
  },
  {
    name: "zed",
    category: "app",
    check: appInstalled("Zed"),
    install: "brew install --cask zed",
  },
  {
    name: "warp",
    category: "app",
    check: appInstalled("Warp"),
    install: "brew install --cask warp",
  },
  {
    name: "orbstack",
    category: "app",
    check: appInstalled("OrbStack"),
    install: "brew install orbstack",
  },
];
