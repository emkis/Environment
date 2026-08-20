#!/usr/bin/env bun

import { intro, log, outro } from "@clack/prompts";
import { manifest } from "./manifest/index.ts";
import { createPrompt } from "./engine/picker.ts";
import { reviewDiff } from "./engine/review.ts";
import { renderStates, renderSummary } from "./engine/render.ts";
import { runtimeDeps } from "./engine/runtime.ts";
import { sweep } from "./engine/sweep.ts";
import { BIN_TARGET_DIR, REPO_ROOT } from "./engine/paths.ts";
import type { ItemState, PickerGroup } from "./engine/types.ts";

function usage(): string {
  return `\
Usage: chest [help]

chest takes no arguments: every invocation runs one full Sweep — it checks every
Entry in the Manifest against this machine live, plus every file in bin/, then
offers an interactive picker for what to install or resync.

Commands:
  (none)   Run a Sweep.
  help     Show this help message.

Environment variables:
  ENVIRONMENT_REPOSITORY   Path to this repository (set in config.fish).
  GLOBAL_BINS              Directory bin/ scripts are synced into.`;
}

async function runSweep(): Promise<void> {
  intro("chest");
  log.info(`Repository: ${REPO_ROOT}`);

  let states: ItemState[] = [];

  const result = await sweep(manifest, {
    ...runtimeDeps,
    prompt: (groups: PickerGroup[]) => createPrompt(states)(groups),
    reviewDiff,
    report(event) {
      switch (event.type) {
        case "checked":
          states = event.states;
          renderStates(states);
          break;
        case "installing":
          log.step(`Installing ${event.name}`);
          break;
        case "installed":
          if (!event.outcome.ok) log.error(`${event.outcome.name}: ${event.outcome.reason}`);
          if (event.outcome.skipped) log.warn(`${event.outcome.name}: ${event.outcome.reason}`);
          if (event.outcome.ok && !event.outcome.skipped && event.outcome.manualStepsRef) {
            log.warn(`${event.outcome.name} needs a manual step: ${event.outcome.manualStepsRef}`);
          }
          break;
        case "nothing-selected":
          log.info("Nothing selected");
          break;
      }
    },
  });

  renderSummary(result);
  outro(
    result.selected.length === 0
      ? "Nothing to do"
      : `Bin scripts sync to ${BIN_TARGET_DIR}. Sweep complete.`,
  );
}

const [, , command] = process.argv;

if (command === undefined) {
  await runSweep();
} else if (command === "help") {
  console.log(usage());
} else {
  console.log(usage());
  process.exit(1);
}
