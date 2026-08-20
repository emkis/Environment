import { app } from "./app.ts";
import { cli } from "./cli.ts";
import { config } from "./config.ts";
import { font } from "./font.ts";
import { system } from "./system.ts";
import type { Entry } from "../engine/types.ts";

export const manifest: Entry[] = [...cli, ...app, ...font, ...config, ...system];
