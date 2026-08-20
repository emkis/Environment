import { configSource } from "../engine/paths.ts";
import type { Entry } from "../engine/types.ts";

const HOME = process.env.HOME ?? "";

function configEntry(name: string, sourceFile: string, targetPath: string): Entry {
  const source = configSource(sourceFile);
  const target = `${HOME}/${targetPath}`;
  const src = JSON.stringify(source);
  const dest = JSON.stringify(target);

  return {
    name,
    category: "config",
    check: `diff -q ${src} ${dest}`,
    install: [`mkdir -p "$(dirname ${dest})"`, `cp ${src} ${dest}`],
    source,
    target,
  };
}

export const config: Entry[] = [
  configEntry("gitconfig", "gitconfig", ".gitconfig"),
  configEntry("config.fish", "config.fish", ".config/fish/config.fish"),
  configEntry("starship.toml", "starship.toml", "starship.toml"),
  configEntry("zed-settings", "zed/settings.json", ".config/zed/settings.json"),
  configEntry("zed-keymap", "zed/keymap.json", ".config/zed/keymap.json"),
];
