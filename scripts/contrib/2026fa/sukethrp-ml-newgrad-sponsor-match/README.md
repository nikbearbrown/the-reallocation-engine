---
owner: sukethrp
term: 2026fa
component: ml-newgrad-sponsor-match
status: RUNNABLE-SAMPLE
promoted_to: null
---

# Role-level sponsor match — new-grad ML/AI engineers on F-1

## Executive summary

This is a small prototype for students who need a future H-1B sponsor and are applying for
new-grad machine-learning or AI engineering jobs. For each job in their queue it answers one
question: *has this company's public sponsorship record ever included ML/AI job titles below
senior level?* A company that has only sponsored senior staff is weak evidence for a new graduate.

It reads the engine's real sponsorship file, stops at the first piece of evidence it cannot
check, and sends only fully checked roles to the engine's existing scorer. It then writes two
things: a report for the person (what to apply to, where to network first, what to skip, what
needs a human check) and a log for agents. It never guesses a value it could not verify, and it
never calls an AI model.

Recipe: [`recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md`](../../../../recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md).

## Run it (one command, from the repo root)

```bash
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py
```

This runs the sample queue offline and writes to `output/sukethrp-ml-newgrad-sponsor-match/2026-09-30-sample/`,
which is gitignored. Needs Node 20+ and Python 3.9+ after `npm install`. There are no Python packages
to install.

## Test it (offline, no network)

```bash
python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v
```

The tests run against fictional companies in `fixtures/test-sponsorship.csv`, plus read-only checks of
the real sponsorship file. Every run sets `SPONSOR_MATCH_FORBID_NETWORK=1`, so an attempted live check
fails the test instead of reaching the network.

## Other ways to run it

| Command | What it does |
|---|---|
| `… sponsor_match.py --roles <queue.json> --out-dir <dir>` | your own queue (format below). Paths in the queue are relative to the repo root |
| `… sponsor_match.py --roles <queue.json> --out-dir <dir> --live` | checks each posting live with `scripts/ats/check-liveness.mjs` (Playwright; run `npx playwright install chromium` once). Only hosts listed in `rules.json` are fetched. Each posting first gets one request with redirects off. A board that forwards the posting to another site is held (`redirects-off-allowed-host`), not followed |
| `… sponsor_match.py --audit-rules --out-dir <dir>` | audits the title rules over every company in the file: tier counts and every title counted as ML/AI. Read this before trusting the rules |

Writes inside the repo go only to `output/` (scratch), `course/2026fa/submissions/sukethrp/` or this
folder. An earlier run in `course/…` is not overwritten without `--overwrite`.

## The queue (your input)

```json
{
  "as_of": "2026-09-30",
  "persona": "search/examples/priya-nair/profile.yml",
  "roles": [
    {
      "role_id": "r01",
      "company": "Discord",
      "title": "Machine Learning Engineer, New Grad",
      "url": "https://…",
      "fit": { "p": 0.7, "reason": "your own rating and why" },
      "timeline": { "factor": 0.85, "reason": "your own factor and why" },
      "liveness": { "snapshot": "path/to/saved-page.json" }
    }
  ]
}
```

Optional per role: `csv_row` (you chose the company's row by hand), `override` (`decision` + `reason`,
passed to the scorer), and `liveness` as a recorded result (`result`, `checked_at`, `method`, `evidence`
= path to the saved terminal output). The persona must be a fictional one under `search/examples/`, and
it must say `needs_sponsorship: true`.

## Outputs

| File | For | What |
|---|---|---|
| `sponsor-match-report.md` | the person | executive summary, what to do next, evidence per posting, what could not be verified, a blank decision table |
| `sponsor-match-log.json` | agents | every value with its label (`record` / `your-input`), every gate result, hashes of every input, the exact scorer command |
| `roles.json` | the scorer | the input handed to `scripts/score/role-scorer.mjs` |
| `role-scores.json`, `role-scores.md` | both | the engine scorer's own output, unchanged |

## Reused, not copied

- `scripts/sec/entity-resolution.py` → `normalize_company_name` (imported)
- `scripts/ats/liveness-core.mjs` → `classifyLiveness`, and `scripts/ats/check-liveness.mjs` for live checks (through `node_bridge.mjs` and the CLI)
- `scripts/score/role-scorer.mjs` through its CLI. It exports nothing, so it cannot be imported.
- `js-yaml` (already a repo dependency) to read the persona

## What it cannot do

It cannot tell when a sponsorship happened (the file has no years). It cannot see titles beyond the
file's short top-titles list, confirm that a title without a seniority word was a junior hire, or
confirm that the company in the file is the employer on the posting. It does not compute fit or the
visa timeline; those are your own inputs. The recipe's *What it can and cannot verify* section has
the full list.

## Files

`sponsor_match.py` (the prototype) · `node_bridge.mjs` (reuse bridge) · `rules.json` (the declared title
and tier rules: your input) · `fixtures/` (sample queue, synthetic snapshots, test CSV of fictional
companies, a `BROKEN-` profile for the break test) · `tests/` (offline tests).

## Credits

Built on *The Reallocation Engine* (Nik Bear Brown), its 80 Days to Stay data, the ATS liveness
classifier and the Chapter 11 scorer. Written with Claude Code (AI). See
`course/2026fa/submissions/sukethrp/SOURCES.md` for what the AI contributed and what the student decided.
