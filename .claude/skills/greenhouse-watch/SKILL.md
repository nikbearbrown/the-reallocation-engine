---
name: greenhouse-watch
description: >
  Watch ONE company's Greenhouse job board and report only the jobs that are NEW since
  the last check AND relevant to a JSON résumé, each with a justification that cites
  the résumé fields and posting fields that produced it. Use when the user types
  `greenhouse`, `greenhouse watch`, `watch <company>`, `new jobs at <company>`,
  `check the board`, or asks whether anything new at a Greenhouse company fits their
  résumé. One public API fetch per run, host allow-listed, raw response saved; diff by
  job id against a state file; first run is a baseline that reports nothing. Matching
  is a documented record-based scheme (`scheme.default.json`) — no model judgment is
  made or reported. Ends at the human gate: the report is a list; the person decides.
  Never applies, never emails, never touches `search/resume.json` beyond reading it.
---

# greenhouse-watch — new jobs on one board, matched to a JSON résumé

The default recipe of the Fall 2026 assignment, packaged as a skill so the agent runs a
stored script instead of ad-hoc code (SNICKERDOODLE P2). It is deliberately small.

## Announce, then run

Say in one line: *"greenhouse-watch: board `<slug>`, résumé `<path>`, scheme `<version>`."*
Then run the stored script. Do not reimplement it, do not write a new fetcher, do not
call any endpoint other than the Greenhouse boards API.

```bash
python3 .claude/skills/greenhouse-watch/scripts/greenhouse_watch.py \
  --board <slug> \
  --resume <path to resume JSON> \
  --state  search/greenhouse-watch/<slug>.state.json \
  --out    search/greenhouse-watch/<slug>/
```

- `<slug>` is the company's board name: the `<slug>` in
  `https://boards-api.greenhouse.io/v1/boards/<slug>/jobs`. If the user gives a careers
  URL, derive the slug the way `scripts/ats/providers/greenhouse.mjs` does.
- `--resume` MUST be JSON in the `search/examples/<persona>/resume.example.json` shape.
  The user's real résumé is `search/resume.json` (gitignored). You may read it. You must
  never copy it, quote it, or move it into a tracked path, a fixture, a log, or a report
  that will be committed. For anything that will be shown or committed, use a persona
  from `search/examples/`.
- `--state` and `--out` default to `search/`, which is untracked. If the user wants
  outputs somewhere tracked, they must be running on a persona résumé.
- `--scheme` points at a scheme JSON. Default: this skill's `scheme.default.json`.
  A student's own scheme replaces it; the scheme file is the documentation of the rule.
- `--fixture <saved.json>` runs offline against a saved response (tests, demos, reruns).
- `--dry-run` reports without writing the state file.

## What one run does

1. **Validate inputs.** Résumé shape, scheme keys, state file integrity. Bad input exits 2
   and touches nothing.
2. **Fetch once.** `https://boards-api.greenhouse.io/v1/boards/<slug>/jobs?content=true`,
   HTTPS only, allow-listed host, redirects refused. The raw response is saved to
   `--out/raw-<time>.json`. A failed fetch exits 3 and leaves the state file alone.
3. **Diff.** Job ids not in `state.seen_ids` are NEW. No state file means BASELINE: every id
   is recorded, none reported.
4. **Match.** Apply the scheme to each new job (see `scheme.default.json` → `_how_to_read`).
   Every rule is a string match against a named résumé field and a named posting field.
   A job with zero skill hits is never relevant.
5. **Write two outputs** (P5, two readers): `run-<time>.json` for the agent and
   `report-<time>.md` for the human. The report lists ONLY relevant new jobs, each with its
   justification lines, plus counts of seen / new / relevant / skipped and a skipped table.
6. **Update state** with every id seen, only if the run succeeded and `--dry-run` is off.

## After the run — what the agent does and does not do

- Read the Markdown report to the user (AGENTS.md: Markdown for humans). Say the counts.
  Say plainly that the verdicts are record-based rule matches, not judgments.
- **Stop at the gate.** Which relevant job, if any, is worth a day of the user's life is the
  human's decision (P1, P4). Do not rank by enthusiasm, do not recommend, do not apply, do
  not draft outreach unless the user asks for that as a separate task.
- If the user disagrees with a verdict, the fix is to the **scheme file**, not to the
  code and not to the résumé. Log the disagreement; that is a finding about the scheme.
- Log meaningful runs against a real board in `logs/runs/<term>-<handle>-<n>.md`
  (students) or `logs/RUN_LOG.md` (maintainer). Never put personal data in a log.

## Daily

The command is idempotent and safe to schedule. Scheduling itself is out of scope for the
skill; a launchd plist, cron line, or GitHub Action that runs the command above once a day
is the user's call. Two runs on the same day are fine: the second reports nothing new.

## Tests

```bash
cd .claude/skills/greenhouse-watch && python3 -m unittest tests/test_greenhouse_watch.py -v
```

Offline, fixture-driven (`tests/fixture-board.json`, three real Airbnb postings with
trimmed content, captured 2026-09-16). Covers: baseline, diff, same-second runs, dry-run,
malformed and wrong-shape résumés, corrupt state, empty board, bad response, bad slug,
bad host, and each scheme rule.

## Files

| File | Role |
|---|---|
| `SKILL.md` | this workflow |
| `README.md` | one-screen orientation and the assignment link |
| `scripts/greenhouse_watch.py` | the stored script (stdlib only) |
| `scheme.default.json` | the default matching scheme, with a plain-language reading of every rule |
| `tests/test_greenhouse_watch.py` · `tests/fixture-board.json` | unittest + offline fixture |

## Laws this skill obeys

- **P2** only the stored script touches the network, one allow-listed host.
- **P3** every justification line names a résumé field path and a posting field.
- **P4** the human gate is stated in the report and the run record; the skill never clears it.
- **Privacy** `search/resume.json` is read-only and never leaves `search/`.
