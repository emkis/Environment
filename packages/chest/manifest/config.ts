import { configSource } from "../engine/paths.ts";
import type { Entry } from "../engine/types.ts";

function configEntry(name: string, source: string, target: string): Entry {
  const src = JSON.stringify(configSource(source));
  const dest = JSON.stringify(target);

  return {
    name,
    category: "config",
    check: `diff -q ${src} ${dest}`,
    install: [`mkdir -p "$(dirname ${dest})"`, `cp ${src} ${dest}`],
  };
}

export const config: Entry[] = [
  configEntry("gitconfig", "gitconfig", "$HOME/.gitconfig"),
  configEntry("config.fish", "config.fish", "$HOME/.config/fish/config.fish"),
  configEntry("starship.toml", "starship.toml", "$HOME/starship.toml"),
  configEntry("zed-settings", "zed/settings.json", "$HOME/.config/zed/settings.json"),
  configEntry("zed-keymap", "zed/keymap.json", "$HOME/.config/zed/keymap.json"),
];
