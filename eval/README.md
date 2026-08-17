# eval/ — Does the instruction scaffolding actually help?

This is the answer to §19 of the CLI-agnostic guide: **treat the instruction/context
files as measurable artifacts, not assumed goods.** It turns "does `AGENTS.md` /
`SNICKERDOODLE.md` / `_MANIFEST.md` improve agent behavior?" into a number you can
compare across configurations — instead of a vibe.

The split mirrors SNICKERDOODLE P1: **machines verify conformance** (the scorer
computes deterministic metrics) and **humans verify adequacy** (you grade
acceptance and review burden).

## What it measures

A fixed **task suite** (`tasks/`) run under a **config matrix** (`configs.yaml`):

- **full** — repo as normal (constitution + AGENTS.md + manifest all present).
- **baseline** — instruction files moved aside (the counterfactual).
- **manifest-only** — only `_MANIFEST.md` present, no constitution.

For every task × config × tool you do one run. The scorer records, **deterministically**:

- `out_of_scope` — files the change touched that the task did not allow.
- `deletes` — files deleted (should almost always be empty; the repo archives, not deletes).
- `forbidden_ops` — `rm -rf`, `git push --force`, staging `data/ats/*`, etc.
- `insertions` / `deletions` — diff size (review-burden proxy).
- `validate_pass` — did the task's own check command pass (with `--validate`).

And you record, **by hand** (adequacy):

- `acceptance` — pass / partial / fail.
- `manual_edits_after`, `review_burden` (1–5), `tokens` (if the tool reports them), `notes`.

`report.mjs` aggregates everything into `results/scorecard.md` grouped by config —
so you can see, e.g., that **baseline produced 2.0 out-of-scope edits/run and 1
delete while full produced 0** — and then *prune rules that don't earn their tokens.*

## Protocol (one run)

Runs are **disposable** — do them on a scratch branch or a stash, score from the
patch, then throw the change away. Nothing here is meant to land in `main`.

1. **Pick a config.** For `baseline` / `manifest-only`, move the instruction files
   aside first (and restore them after):
   ```bash
   mkdir -p eval/.config-stash
   git mv AGENTS.md CLAUDE.md SNICKERDOODLE.md _MANIFEST.md eval/.config-stash/   # baseline
   # …run the task…
   git mv eval/.config-stash/* .                                                   # restore
   ```
   (Use `git mv`, never `rm` — the archive-guard hook will block deletes anyway.)
2. **Run the task.** Open `tasks/<id>.md`, paste the prompt block into the agent
   under test on a scratch branch. Let it work.
3. **Capture the change as a patch:**
   ```bash
   git add -A && git diff --cached > eval/runs/<DATE>__<task>__<config>__<tool>/changes.patch
   git reset                       # un-stage; discard the scratch work afterward
   ```
   Also drop a `run.yaml` in that dir (see an existing run for the shape), and
   optionally a `commands.log` (paste any shell the agent ran — feeds forbidden-op scan).
4. **Score it:**
   ```bash
   npm run eval:score -- eval/runs/<DATE>__<task>__<config>__<tool>
   # add --validate to also run the task's check command (only if the change is applied)
   ```
   This writes `metrics.yaml` with the `auto:` block filled.
5. **Grade adequacy.** Open that `metrics.yaml` and fill the `human:` block.
6. **Aggregate:**
   ```bash
   npm run eval:report
   # writes eval/results/scorecard.md and scorecard.json
   ```

Repeat across configs (and tools) for the same tasks. The comparison is the point.

## Directory layout

```text
eval/
├── README.md            # this file
├── configs.yaml         # the A/B matrix
├── tasks/               # fixed task suite (prompt + rubric + allowed_globs + validate)
├── fixtures/            # inputs a task needs (e.g. a deliberately broken file to repair)
├── runs/                # one dir per run: run.yaml + changes.patch + metrics.yaml
└── results/             # generated scorecard.md / scorecard.json
```

## Honest scope

The scorer and aggregator are fully automated and run today. **Executing the agent
is not** — that step is necessarily manual/external (it needs each tool installed
and, for live runs, API access). That matches §19's own description of a
cross-tool process; the harness makes it *repeatable and quantified*, not
one-click. Start with a few tasks under `full` vs `baseline` on your primary tool —
even n=5 per config tells you whether the scaffolding is paying for itself.
