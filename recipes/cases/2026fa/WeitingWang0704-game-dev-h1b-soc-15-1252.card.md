# game-dev-h1b-soc-15-1252 — human card

*Scope: funded **private** game studios. The large publishers are not in this dataset — see "cannot verify".*

*Lifecycle: `DRAFT`. The sample run completes and the tests pass, but two typed `[TODO]`s are open, and `DRAFT → SPECIFIED` requires zero. See the agent twin's "Where this sits in the lifecycle".*

**Audience:** an international student looking at a list of game-studio job postings, deciding where the next hour goes.
**Agent twin:** `recipes/cases/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252.md`
**Prototype:** `scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/`
**Chapters:** 7 (sponsorship), 8 (liveness), 11 (the composite). Not a Ch 9 role-quality contribution — see "cannot verify".

## Purpose

For each posting on your shortlist: has this company ever sponsored an H-1B, and was it for engineering work or for somebody else's job? Return Apply / Consider / Skip with every number labelled, or refuse to score the row and say what would unblock it.

## What it can verify

- A company has an H-1B row in the 80 Days CSV, and what that row says — approvals, denials, approval rate, median salary offered, and the titles it sponsored for.
- Whether those sponsored titles include any engineering title. `Roboto Games Inc` has 4 approvals at a 100% rate and the recorded title is `Director of Product Management`. That is a sponsor, and it is not evidence for a gameplay engineer.
- A company's recorded funding date, stage and amount, and how many months ago.
- The SOC 15-1252 row in `data/bls/compact/soc_occupation_compact.csv` — 2024 median wage, employment, cognitive-pivot score.
- That a posting was checked for liveness, by whom and when, because a person wrote it down.
- The arithmetic behind every decision, term by term, with each term's source.

## What it cannot verify

- **That a company is a game studio.** The CSV has 24 industry labels and none is games. Sector is a keyword match on the company name, labelled `model-judgment`. In the sample run `Peloton Interactive Inc` passed the filter with 310 approvals and scored level with a real studio. Studios whose legal name has no games word are invisible to it.
- **That a company does not sponsor.** 1,557 of 30,369 rows (5.1%) carry an approvals value. The other 94.9% are scored on a stated prior of 0.35, labelled `model-judgment`. Absence of a record is not evidence of a non-sponsor.
- **That a posting is live.** No network calls here. Liveness is a record only because you ran `npm run ats:liveness` first, and provenance is per posting: checked rows read `[record]`, unchecked rows read `[model-judgment]`. In the sample run 2 of 9 were checked (both `expired`) and 0 of the 6 scored rows had a checked value.
- **Anything about a studio the dataset does not contain.** Of 14 well-known game employers searched on 2026-10-03, **1** is genuinely in the CSV (Roblox). EA, Activision, Riot, Epic, Blizzard, Ubisoft, Zynga, Bungie, Naughty Dog, Respawn, Insomniac and Cat Daddy are absent — the dataset comes from SEC startup filings, which public-company subsidiaries do not make. This card triages **funded private studios**, not the games sector.
- **Whether the role is any good.** `role-scorer.mjs` weights `role_quality` at `0.0`, tagged `[VERIFY]`. The BLS numbers are shown to you and never sent to the scorer.
- **A live Form D join.** Only 4 × 50 sample companies ship. Funding comes from the CSV's own Form D-derived column.

## Dependencies

- Node 20+. No Python, no `.venv`, no network.
- `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`
- `data/bls/compact/soc_occupation_compact.csv`
- `scripts/score/role-scorer.mjs` — run as a CLI, never re-implemented
- A liveness file you wrote by hand after running `npm run ats:liveness -- <url>`

## Annotated commands

Sample run (expected: 6 scored, 4 blocked, skip rate 17%, liveness 2/9 checked):

```bash
node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/postings.sample.json \
  --liveness scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/liveness.sample.json \
  --opt-end 2027-01-31 --hiring-lag-days 75 --soc 15-1252 \
  --out-dir course/2026fa/submissions/WeitingWang0704/runs
```

Offline tests (expected: 15 pass, 0 fail, no host contacted):

```bash
node --test scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.test.mjs
```

Break attempt — a dead posting with the strongest sponsorship in the dataset and a perfect self-assessed fit (expected: `Skip`, composite `0`, reason `gated: liveness`):

```bash
node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/BROKEN-ghost-posting.json \
  --liveness scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/BROKEN-ghost-liveness.json \
  --opt-end 2027-01-31 --out-dir /tmp/break-check
```

Expired OPT date (expected: `E_OPT_DATE_PAST`, exit 3, no files written):

```bash
node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings .../postings.sample.json --liveness .../liveness.sample.json \
  --opt-end 2026-01-01 --out-dir /tmp/should-not-exist
```

Unknown SOC (expected: `E_SOC_NOT_FOUND`, exit 3; no wage invented):

```bash
node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings .../postings.sample.json --liveness .../liveness.sample.json \
  --opt-end 2027-01-31 --soc 99-9999 --out-dir /tmp/should-not-exist
```

`--out-dir` is mandatory. Without it the scorer writes over the tracked example output and the change lands in your PR.

## What it produces

- `triage.json` — the agent log: every value with its label, every assumption written out, the blocked list, and the scorer's full per-term trace.
- `triage-report.md` — the decision table, what is a record and what is not, the timeline arithmetic, what to do next with each row, and what would unblock each blocked row.
- Plus the scorer's own `roles.json`, `role-scores.json`, `role-scores.md`.

## Named failure modes

1. **Sector over-match.** A non-games company with "Interactive", "Studio" or "Entertainment" in its name enters the shortlist with a real and often large sponsorship record, and outranks genuine studios. `Peloton Interactive Inc` did exactly this in the sample run. **Hardest to catch by:** a student new to the US market, who has no reason to know which brand names are game companies and which are not — the very person this recipe is for. Mitigation: the matched keyword is printed on every row, and Gate 1 asks for human confirmation.
2. **Absence read as refusal.** 94.9% of CSV rows have empty H-1B columns. Treating an empty row as "does not sponsor" deletes most of the market in one move, and it is the error a tired person makes at 2am. **Hardest to catch by:** anyone under deadline pressure, because the mistake makes the list shorter and the day feel more productive. Mitigation: the status is named `NO_SPONSORSHIP_RECORD`, the probability is labelled `model-judgment`, and the report states in words that absence is not evidence.
3. **Sponsorship for the wrong role.** A studio with approvals for a Director of Product Management scores the same as one with approvals for an Associate Gameplay Engineer. The prototype surfaces the mismatch in the report but does not yet let it affect the score. **Hardest to catch by:** anyone who reads the composite column and stops there. Mitigation: the mismatch is printed in bold in the evidence cell. [TODO: DEV] a tier demotion for title mismatch is the obvious next change — but computed against this run it moves `Roboto Games` only from `0.261` to `0.209`, still inside the `Consider` band, so it is necessary and not sufficient. See `WORKED-RUN.md`.
4. **Assumption drift in the timeline gate.** `--opt-end` and `--hiring-lag-days` multiply every composite in the run. Fixing a date-rounding bug moved the runway from 119 days to 120, the factor from 0.587 to 0.600, and `Manticore Games` from `Consider` to `Apply`. One day of assumed runway flipped a decision. Mitigation: the arithmetic line is printed above the table; read it before the table.
5. **Asking it about a studio it has never heard of.** The most recognisable employers in this industry are the ones the dataset misses, and the tool answers `NOT_IN_RECORD` — correct, and no help at all. **Hardest to catch by:** a student who reads a short `NOT_IN_RECORD` list as "nothing to report" rather than as "this tool cannot see most of my actual targets". Mitigation: `NOT_IN_RECORD` rows are listed separately with the instruction not to assume either way, and this card states the coverage limit up front.
6. **Too few Skips.** The sample run skipped 17% where the engine's own standard is at least half. A run where almost everything is `Consider` has not reallocated anything. Mitigation: the scorer prints the skip rate and flags a low one; treat it as a bug in the stated priors, not as good news.
