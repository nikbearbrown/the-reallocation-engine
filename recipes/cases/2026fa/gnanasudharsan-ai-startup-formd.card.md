---
status: DRAFT
todos_open: 5
last_gate: "G-TIMELINE clearance for sample scoring only — Gnanasudharsan Ashokumar, 2026-10-20, logs/runs/2026fa-gnanasudharsan-2.md"
attestation: null
recipe_version: 0.1.0
type: card
---

# AI-Startup Funding & Timeline Triage — human card

## Executive summary

This is the one-page version of the AI-startup triage mode. Read it before you run the mode, and again before you believe its output. The mode checks whether an AI startup's last recorded funding round could keep it alive until an H-1B petition would be filed (April 2027) and until the job would start (October 2027), and whether the job posting is live, before any score is computed. On its first real run it found no startup whose runway through October 2027 could be shown from local data; four are on hold for a person to research.

## Purpose

A posting tells you the title, the salary band and the location. It does not tell you whether the company will still exist when your H-1B petition is filed or when the job starts. For a student whose status depends on the employer, that is the fact that matters most, and it is the one a job board never shows.

This mode turns the funding record into a hard gate. A startup whose recorded runway ends before April 2027 is excluded; one whose runway reaches April but not October 2027 is held for a human; only a startup whose runway reaches October 2027, or one a human has explicitly cleared for sample scoring, reaches the scorer. Liveness is a gate too: a dead or unreadable posting is never scored.

## What it can verify

- The latest funding date and amount recorded for an employer, with the CSV line it came from.
- Whether that date plus a 24-month runway assumption reaches 2027-04-01 and 2027-10-01.
- That the employer has H-1B approvals, how many, and the approval rate.
- That the employer's sponsored-title history contains an AI word from the decided list.
- That a saved liveness check found an apply control on the page supplied.
- That a company name matches exactly one row, so no posting is attached to the wrong employer silently.
- That held and excluded postings never reach the scorer — tested, including three deliberately broken copies of the script.

## What it cannot verify

This is the more important list.

- **Any funding after the snapshot.** The funding data is dated 2025-09-26. A startup that raised in 2026 looks stale here. The local Form D files are samples (50 companies per quarter), so "no newer filing" means "not in the sample".
- **Real runway.** 24 months is an assumption, not a record.
- **AI sponsorship specifically.** The H-1B data has no occupation code and no fiscal year. "Sponsored a title containing 'machine learning'" is the best it can say.
- **That a title is AI work.** "Senior Research Engineer" at a membrane company matched; so did "Enterprise Business Operations Manager - AI" (flagged weak).
- **That the employer's own posting is live** when the URL is an aggregator page. One aggregator URL started a file download and could not be read at all.
- **That a name means the company you think.** Cohere Health is a healthcare company, not the AI model company Cohere.
- **Whether the scorer's weights are right.** Role quality carries weight 0; the occupation table in the report is context only.

## Dependencies

| Needs | Why | If missing |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | funding + H-1B records | exit 2 |
| `data/sec/form-d/processed/sample/*.json` | fresher-evidence check | check reports 0 matches |
| `data/bls/compact/soc_occupation_compact.csv` | occupation context | context table is empty |
| `scripts/score/role-scorer.mjs` | the scorer, unchanged | exit 4 |
| A saved `npm run ats:liveness` output | liveness gate | every posting held `liveness-not-run` |
| A postings file with fit ratings | what to judge | exit 2 |

The script itself makes no network calls. Liveness is the only network step and runs separately, on URLs a human approved.

## Commands, annotated

```bash
npm run ats:liveness -- <url1> <url2>
```
Network. Run only on approved URLs; save the output verbatim — the script reads the saved file.

```bash
node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs \
  --as-of 2026-10-20 --postings <postings.json> --liveness <saved-liveness.txt> \
  --clearance <clearance.json> --out-dir <dir>
```
Applies every gate, writes `roles.json`, runs the scorer on what passed, writes the log and the report. Omit `--clearance` and every CANNOT-VERIFY posting stays held.

```bash
npm run score -- <dir>/roles.json --profile <dir>/profile.json --out-dir <dir>/npm-score
```
Re-scores the same records with the unchanged scorer, independently of the script.

```bash
node --test scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/
```
20 tests on fictional fixtures.

Exit codes: `0` ok · `2` bad input · `3` scorer misread the profile · `4` scorer failed · `5` run refused (funding snapshot too old).

## What it produces

- `ai-startup-formd-log.json` — for agents: every gate result, reason codes, inputs with sha256.
- `ai-startup-formd-report.md` — for you: executive summary, postings table, timeline table with the snapshot caveat, cannot-verify list.
- `roles.json`, `profile.json`, `role-scores.json`, `role-scores.md` — scorer input and output. The scorer's own Markdown prints its raw recommendation; for a cleared hold it says "Apply" while the report's verdict is "HOLD — runway unverified". The report governs.

## Failure modes

**1. A stale snapshot read as current runway.** The funding data ages every day. A company that raised last month looks like it is running out of money. *Detection:* the run gate refuses the whole run when the newest funding date is older than 24 months, and every timeline status carries the snapshot date. *Mitigation:* treat FAIL as "not supported by local data", never as "the company is dead"; check EDGAR for a held company before dropping it.

**2. Keyword and name false matches.** A title filter cannot tell an AI Engineer from an operations manager whose title ends in "AI", and a name match cannot tell Cohere Health from Cohere. *Detection:* weak-title warnings; exact-match-only company joins with ambiguous names held. *Mitigation:* read the matched title and the company before rating fit.

**3. A clearance read as a recommendation.** Clearing a hold lets the scorer run, and the scorer will happily print "Apply". *Detection:* the report forces the verdict to "HOLD — runway unverified" for cleared rows, and a test fails if it does not. *Mitigation:* read the report, not `role-scores.md`.

**4. An unreadable posting treated as dead or as live.** Aggregator pages behave differently from employer job boards; one returned a file download. *Detection:* the checker returns `uncertain` and the posting is held, not excluded. *Mitigation:* find the employer's own posting and re-run liveness on it.

## Who signs

This card and its recipe stay `DRAFT` while five typed items are open. A sample run happened on 2026-10-20 and is logged; it is evidence, not a promotion. Attestation is recorded in the worked-run write-up and does not set the `attestation` field, which is reserved for VERIFIED.
