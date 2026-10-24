# Assignment 2 — The Reallocation Engine: Mode Build (Aditya Raj, `aditya-raj-sde`)

## Executive summary

This folder is the submission for the second Reallocation Engine assignment in INFO 7375 (Fall
2026). It contains a working screening procedure, a "mode", for an experienced Java backend
candidate who needs future visa sponsorship and can start in early 2027, together with its run on
12 real development postings and 6 unseen postings, 77 tests, a deliberate break test, and an
honest process log. Start with `REVIEW-PACKET.md` (for the student's review) or the worked run.
The mode is at RUNNABLE-SAMPLE (reports judged adequate by the student; RUNNABLE-LIVE is not sought). Feature scope is frozen at rules v0.4.1.

## Contents

| File | What it is |
|---|---|
| `WORKED-RUN.md` | commands and real pasted output, verified vs. inferred, verification, reflection, attestation (draft, unsigned) |
| `DOMAIN-JUSTIFICATION.md` | one page: who, the information asymmetry, engine layers, failure modes |
| `REVIEW-PACKET.md` | compact packet for the student's own review: representative cases, commands, the cross-check, pending actions |
| `SAMPLE-PROTOCOL.md` | how the 12 development postings were chosen, fixed before collection |
| `HOLDOUT-PROTOCOL.md` | how the 6 unseen postings were chosen and judged, fixed after the rules freeze and before selection |
| `FRICTIONAL.md` | dated, append-only process log (Claude's actions; Aditya's decisions; pending human reflection) |
| `DEMO-SCRIPT.md` | five-minute presentation plan with exact commands |
| `RUN-LOG-ENTRY.md` | copy of `logs/runs/2026fa-aditya-raj-sde-2.md` |
| `PR-DESCRIPTION.md` | draft replacement PR description (**not published**) |
| `SUBMISSION.md` | submission manifest and the ZIP-building procedure |
| `SOURCES.md` | sources, reused components, and the human/AI attribution of every part |
| `real-sample/` | `probe-log.json`, `selection.json`, `observations.json` (committed excerpts), `observations-v0.1-extraction.json` |
| `holdout/` | unseen-posting `selection.json`, `observations.json` (excerpts), `expected-claude-reviewed.json` (written before the run) |
| `runs/` | `real-replay-v0.1` … `-v0.4.1/` (all kept), `holdout-v0.4-first/` (**the** holdout result), `holdout-v0.4.1-dev-rerun/` (development), `synthetic-v0.3/`, `-v0.4/`, `-v0.4.1/`, `a1-tool-on-real-sample/` |
| `archive/` | superseded documents, kept unchanged (`WORKED-RUN-v0.3.md`, `REVIEW-PACKET-earlier.md`) |
| `evidence/` | raw command output, numbered 00–31 (index in `REVIEW-PACKET.md`) |

Outside this folder (all in assigned namespaces):
- `recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md` and `.card.md`;
- `scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/`;
- `search/examples/tariq-lindqvist/` (fictional persona + `test-variants/`; kept in the sanctioned persona directory, see FRICTIONAL E23);
- `logs/runs/2026fa-aditya-raj-sde-2.md`.

## Setup, run, test (from the repository root)

```bash
npm install                      # Node 20+; no other dependency for the offline path
node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs \
            scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs
node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run \
  --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json \
  --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json \
  --out-dir "$TMPDIR/triage-replay"
node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/break-test.mjs
npm run verify && npm run doctor
```

**Run the tests from a checkout outside the system temp directory** (for example, extract the ZIP
under your home folder). The output-guard test deliberately allows writing to the system temp
directory. A copy of the repository that itself sits inside the temp directory therefore makes that
one test fail (76/77). This is a test-environment artifact, not a behaviour change: extracted under
the home folder, the same ZIP passes 77/77 (FRICTIONAL E33).

Live collection (network; writes raw postings only to gitignored `private/`) is a separate step,
described in the recipe's workflow. It is not needed to reproduce the decisions.

## Where the PDF's deliverables actually are (and why)

The assignment PDF and the repository's contribution contract disagree. Per Aditya's decision
(FRICTIONAL E03), **the repository contract governs**. The discrepancy is recorded here and in the
PR body.

| PDF says | Actual location | Reason |
|---|---|---|
| branch `mode/<yourname>-<domain>` | `contrib/2026fa-aditya-raj-sde-java-backend-early2027` | `CONTRIBUTING.md` branch rule |
| mode file under `recipes/` | `recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md` (+ `.card.md`) | top-level `recipes/` requires maintainer promotion (`recipes/cases/README.md`) |
| justification + worked run under `assignments/submissions/<yourname>/` | `course/2026fa/submissions/aditya-raj-sde/assignment-2/` | `CONTRIBUTING.md` / `course/README.md`; `assignments/` does not exist |
| append to `logs/RUN_LOG.md` (or include in submission) | `logs/runs/2026fa-aditya-raj-sde-2.md` + `RUN-LOG-ENTRY.md` here | CI hard-fails student edits to `logs/RUN_LOG.md`; the PDF allows "include it in your submission" |
| ZIP `reallocation-<yourname>-mode.zip` | `reallocation-aditya-raj-sde-mode.zip` (built from the PR commit) | handle used as the name, as in Assignment 1 |
| `npm run score` described as the "BLS/O*NET role-quality scorer" | it is the composite combiner, with role-quality weight 0.0 | `DOMAIN.md` item 3; not used by this mode |

Grading-map inconsistency (flagged, not resolved here): the PDF's rubric is 80 points plus a
20-point quartile, with no Frictional or GitHub-posting line. The course AI policy states 60 + 10
Frictional + 10 GitHub + 20 quartile, and the quartile bands differ. Both the Frictional log and
the GitHub-posting requirements are met anyway.

## Credits and assistance

- **Starting point:** Assignment 1 by the same student (`recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md`;
  PR #45, graded commit `1a618e7`). Its sponsorship, vacancy-wording, and liveness functions are
  imported unchanged.
- **Repository components reused:** the greenhouse-watch fetcher, `scripts/ats/providers/_http.mjs`,
  `npm run ats:liveness` / `scripts/ats/liveness-core.mjs`, the 80 Days to Stay sponsorship CSV
  (maintainers of `nikbearbrown/the-reallocation-engine`).
- **AI assistance:** Claude (Claude Code, model `claude-opus-5-5`) inspected the repository, wrote
  the code, tests, fixtures, protocol, and documents, and ran every command recorded in
  `evidence/` on Aditya's instruction.
- **Aditya's part:** Aditya set the scope and made the decisions recorded in FRICTIONAL E03 and
  E14: the persona parameters, the co-op rule (clarified in E14), range/ASAP/date/season handling,
  the sample and holdout requirements, the deferrals, the lifecycle target, and the PR strategy.
  Aditya also supplied the prediction under test.
- **Pending from Aditya:** review of the reports, the open decisions, a personal re-run, and the
  attestation. They are not claimed anywhere.
- **Job postings:** public pages of Databricks, Pinterest, and Stripe, captured 2026-10-21. Only
  short quoted lines are committed.
