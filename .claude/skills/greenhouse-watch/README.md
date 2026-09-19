# greenhouse-watch

Watch one company's Greenhouse, Ashby, or SmartRecruiters board. Report only what is **new since the last check**
and **relevant to a JSON résumé**, with a justification for every job shown. Stop at the
human gate.

## Invoke

Say `greenhouse watch airbnb`, `new jobs at stripe`, or `check the board`. Claude reads
`SKILL.md`, announces the board, résumé, and scheme in one line, runs the stored script,
and reads you the Markdown report.

Or run it yourself, from the repo root:

```bash
python3 .claude/skills/greenhouse-watch/scripts/greenhouse_watch.py \
  --board airbnb \
  --resume search/examples/aarav-patel/resume.example.json \
  --state  search/greenhouse-watch/airbnb.state.json \
  --out    search/greenhouse-watch/airbnb/
```

First run is a baseline (records every job id, reports nothing). Run it again tomorrow.

## What you get

`--out/report-<time>.md` — the human report: counts of seen / new / relevant / skipped,
then each relevant job with the lines that put it there (`skill «Kubernetes»
(skills.devops_cicd[0]) appears in posting content +1.0`), then the skipped table.
`--out/run-<time>.json` — the same for the agent. `--out/raw-<time>.json` — the API
response, untouched, so every verdict can be re-derived.

## The scheme is the point

`scheme.default.json` is a record-based rule set: string matches between named résumé
fields and named posting fields, with weights and a threshold. It is deliberately plain.
The Fall 2026 assignment asks each student to **replace it with their own scheme**,
document it before building, and justify every verdict. Pass yours with `--scheme`.

## Privacy

Your real résumé is `search/resume.json` (gitignored). The script may read it; nothing
it writes goes anywhere tracked unless you point `--out` there, and you should only do
that with a persona from `search/examples/`. `npm run doctor` fails if `resume.json` is
ever tracked.

## Tests

```bash
cd .claude/skills/greenhouse-watch && python3 -m unittest tests/test_greenhouse_watch.py -v
```
