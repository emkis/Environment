import { cancel, groupMultiselect, isCancel } from "@clack/prompts";
import type { ItemState, PickerGroup } from "./types.ts";

export function pendingValues(states: ItemState[]): string[] {
  return states
    .filter((state) => state.status !== "satisfied")
    .map((state) => (state.kind === "bin" ? `bin:${state.name}` : state.name));
}

export function createPrompt(states: ItemState[]) {
  return async (groups: PickerGroup[]): Promise<string[]> => {
    const options = Object.fromEntries(
      groups.map((group) => [
        group.title,
        group.options.map((option) => ({
          value: option.value,
          label: option.label,
          hint: option.hint,
        })),
      ]),
    );

    const selected = await groupMultiselect<string>({
      message: "Select what to install or resync",
      options,
      initialValues: pendingValues(states),
      required: false,
      selectableGroups: false,
    });

    if (isCancel(selected)) {
      cancel("Sweep cancelled");
      process.exit(0);
    }

    return selected;
  };
}
