# Next steps

Picked-up-cold notes for the `chest` work. Branch: `chest` (5 commits on top of `357e2ce`,
which is where `main` sits). Nothing pushed.

Current state: `chest` works end to end — one Sweep checks every Entry live, scans `bin/`,
shows everything grouped by Category, and offers a picker with missing/drifted pre-checked.
Typecheck is clean (`bun run typecheck`). See `docs/specs/chest-cli.md` for the spec it was
built from and `docs/adr/0001`–`0009` for the decisions behind it.

---

## 1. Find a better home for `utilities/` and `recipes/`

**Why:** both were deliberately left untouched (ADR-0006), and now that everything else moved
into `packages/`, they're the only two top-level directories that don't follow the convention.
`recipes/` in particular now holds exactly one thing — `managing-backups` — so the plural
folder name promises a structure that no longer exists.

**What's actually in them:**
- `recipes/managing-backups/` — `run.sh` (rclone job) + `exclude-rules.txt` + readme.
- `utilities/` — `readme.md` and `compress-images.md`. Documentation only, no executable code.

**The distinction that matters:** these are *jobs and notes*, not "is this installed" checks.
That's why they're outside the Manifest, and any new home should keep that obvious rather than
implying they're part of the Sweep.

**Options to weigh:**
- `packages/backups/` for the rclone job, matching every other tool, with `bin/backups` as its
  shim. Costs: it's bash, not a Bun package, so it stretches "package" a little.
- A `jobs/` top-level directory for things you run deliberately on a schedule, keeping the
  jobs-vs-checks split visible in the layout.
- Fold `utilities/*.md` into `docs/`, since it's purely reference material — probably the
  easy half of this decision, and separable from the `recipes/` question.

Whatever wins, ADR-0006 needs amending or superseding, since it froze the current placement.

## 2. Rewrite the root `readme.md`

**Why:** it was updated during the migration to describe the two-step `bootstrap.sh` → `chest`
flow, but it's thin and the repo's scope has since shifted.

**Known-stale or missing:**
- The `preview.gif` at the top still shows the old recipe-era workflow.
- No explanation of the Manifest/Entry/Category model — a reader has to open `CONTEXT.md` to
  learn what `chest` is even checking. A short version belongs in the readme.
- Nothing documents how to add a new tool, which is the single most common thing you'll do:
  add one Entry to `packages/chest/manifest/<category>.ts`, no order to remember, no script to
  find. That's the headline feature and it's currently undocumented.
- Nothing documents that a new script in `bin/` needs no Manifest edit at all (the Bin scan).
- `MANUAL-STEPS.md` is linked but its purpose isn't explained.
- The `ENVIRONMENT_REPOSITORY` requirement is mentioned only in passing, and it's the one thing
  that breaks `chest` outright when unset.

## 3. Rework the `chest` experience — too much at once

**The problem, concretely:** a Sweep on an already-set-up machine currently prints ~50 satisfied
items across five Category boxes before you reach the picker, then the picker lists all ~50
again. The 3 things that actually need attention are buried in a wall of ✔. The full inventory
is genuinely useful on a fresh machine and pure noise on a daily check — the same output is
serving two very different situations.

**Your instinct, restated:** lead with what's missing or drifted, and put "everything I could
install" behind a separate, deliberate choice.

**Sketches worth considering:**
- **Default to the delta.** Show only missing/drifted items and a one-line `47 items satisfied`
  summary. Offer "show everything" as an explicit action from there. Keeps zero-argument
  invocation intact.
- **Split by situation, not by Category.** A first prompt picking between something like
  "fix what's out of sync" (the daily case) and "set up this machine" (the new-Mac case),
  with the full inventory only in the second.
- **Collapse satisfied Categories.** Keep all five boxes but render a fully-satisfied Category
  as a single line (`Applications — 21/21 ✔`) and expand only Categories with pending items.
  Smallest change, keeps the "full picture of machine state" story (user story 6).

**Important constraint:** ADR-0007 says `chest` takes no arguments, and the spec explicitly
rejects category-level targeting. Options 1 and 3 fit inside that; option 2 arguably does too
(it's an interactive branch, not an argument), but anything that becomes `chest missing` vs.
`chest all` contradicts ADR-0007 and needs that ADR superseded first, deliberately, rather than
drifted past.

**Where the code is:** `packages/chest/engine/render.ts` owns the status output,
`packages/chest/engine/picker.ts` owns the picker and pre-selection, and `buildGroups()` in
`packages/chest/engine/sweep.ts` decides grouping. The `sweep()` seam takes `prompt` as an
injected dep, so the whole presentation layer can change without touching Sweep logic.

---

## Known issues found while building, not yet addressed

- **`chest` always exits 0**, even when installs fail. Fine interactively, wrong if ever
  scripted or run from another tool.
- **Partial multi-step installs go invisible.** Folded installs have a single `check`, so if
  step 1 succeeds and step 3 fails, the next Sweep reads the Entry as satisfied and never
  retries the tail. Affects `fish` (`command -v fish` passes even if `chsh` failed), `skhd`
  (binary present but `.skhdrc` never copied) and `fnm` (present but Node LTS missing).
  Fix shape: make each check assert the *end* state, e.g.
  `command -v fish && grep -q fish /etc/shells && test "$SHELL" = "$(command -v fish)"`.
- **Install failures print twice** — once live, once in the summary. Deliberate for now (a
  failure scrolls off behind `brew install` output), but revisit alongside item 3.
- **`zed-settings` is permanently drifted.** Zed rewrites its own `settings.json`, so the repo
  copy is stale and every Sweep offers to overwrite your local edits. The diff-confirm added in
  `cf31169` makes this safe, not solved. Real fix is deciding a direction: either copy the
  machine's version back into the repo, or accept the repo as authoritative and stop editing in
  Zed's UI. Same class of problem as `config.fish`, where `ide switch` writes the `IDE` line to
  the machine copy only.
- **`git` Entry checks for Homebrew's git specifically** (`test -x /opt/homebrew/bin/git`), which
  is currently missing on this machine — only Apple's `/usr/bin/git` is present. Intentional, but
  confirm that's what you want rather than `command -v git`.
- **No tests.** Deliberately deprioritized. `sweep()` is the agreed seam: fake
  `exec`/`diffFile`/`listDir`/`prompt`/`reviewDiff` can exercise grouping, `requires` resolution,
  pre-selection and the diff-decline path with no shell, filesystem or terminal. Throwaway
  versions of exactly these fakes were used during the build and worked well.

## Spec divergences to reconcile

- **Bluetooth devices** (spec user story 11 and the `system` inventory row) were dropped from
  the Manifest in `92f20e3`; pairing stays in the standalone `bin/setup-devices` script because
  it needs fzf selection, force-unpair and retries. `docs/specs/chest-cli.md` still describes
  the old plan, and there's no ADR recording the change.
- **`reviewDiff`** was added as an optional sixth dep on `sweep()` in `cf31169`; the spec's
  seam signature lists only four. Worth folding into the spec.
