import { confirm, isCancel, log, note } from "@clack/prompts";
import type { DiffReview } from "./types.ts";

const MAX_DIFF_LINES = 40;

async function unifiedDiff(review: DiffReview): Promise<string> {
  const proc = Bun.spawn(["diff", "-u", review.target, review.source], {
    stdout: "pipe",
    stderr: "pipe",
  });

  const output = await new Response(proc.stdout).text();
  await proc.exited;

  const lines = output.split("\n").slice(2);

  return lines.length > MAX_DIFF_LINES
    ? [...lines.slice(0, MAX_DIFF_LINES), `... ${lines.length - MAX_DIFF_LINES} more lines`].join("\n")
    : lines.join("\n");
}

export async function reviewDiff(review: DiffReview): Promise<boolean> {
  const exists = await Bun.file(review.target).exists();

  if (!exists) {
    log.info(`${review.name}: creating ${review.target}`);
    return true;
  }

  const diff = await unifiedDiff(review);
  note(diff.trim() || "(no textual difference)", `${review.name}: - ${review.target}  + repo copy`);

  const proceed = await confirm({
    message: `Overwrite ${review.target} with the repo copy?`,
    initialValue: false,
  });

  if (isCancel(proceed)) return false;

  return proceed;
}
