# Worked run — opt-countdown on the Priya Nair persona

## Executive summary

**What this is:** one real run of the opt-countdown prototype, with the commands and their actual
terminal output, a line-by-line split of what was checked against a record versus assumed, how I
verified it, and what went wrong.

**Why read it:** it shows the tool on a realistic case and is honest about which numbers are
facts and which are my assumptions.

**What it found:** with an 8-week hiring assumption, Priya would start on 2026-11-27, the exact
day her unemployment allowance runs out, so every job gets a timeline of 0. Of five sample jobs,
the scorer's decisions went from 2 Apply · 1 Consider · 2 Skip (with the engine's hand-typed
timeline) to 1 Apply · 0 Consider · 4 Skip. The one remaining Apply survives only because of a
human override already in the sample file. I checked the key date by hand (Nov 27). The biggest
limit: every job gets the same 8 weeks, so the timeline can't tell a fast employer from a slow one.

---

## Inputs

| Input | Value | Where from | Label |
|---|---|---|---|
| Persona | Priya Nair (fictional, unchanged) | `search/examples/priya-nair/profile.yml` | record |
| OPT end | 2027-01-31 | profile `visa.opt_end_date` | record |
| Unemployment days used | 34 | profile `visa.unemployment_days_used` | record |
| Unemployment ceiling | 90 | profile `visa.unemployment_ceiling` | record |
| Safety buffer | 20 days | profile `visa.buffer_target` | record |
| Jobs | 5 sample roles | `data/examples/ch11-roles.json` (the book's illustrative examples) | record (as labeled in that file) |
| "Today" | 2026-10-02 | my choice: the date of the run | your-input |
| Hiring time | 56 days (8 weeks), same for every job | my assumption | your-input |

## Commands and real output

Run from the repo root on branch `contrib/2026fa-revan1010-opt-countdown`. The commands were typed
by Claude Code at my request; I checked the gate G-A values (step 1) before the signed run (step 2).

### Step 0: baseline with the engine's hand-typed timeline

```text
$ npm run score -- data/examples/ch11-roles.json --out-dir course/2026fa/submissions/revan1010/runs

> the-reallocation-engine@1.0.0 score
> node scripts/score/role-scorer.mjs data/examples/ch11-roles.json --out-dir course/2026fa/submissions/revan1010/runs

✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)
  course/2026fa/submissions/revan1010/runs/role-scores.json  +  course/2026fa/submissions/revan1010/runs/role-scores.md
exit=0
```

### Step 1: run without sign-off (stops at gate G-A)

```text
$ node scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs --profile search/examples/priya-nair/profile.yml --roles data/examples/ch11-roles.json --as-of 2026-10-02 --lag-days 56 --out-dir course/2026fa/submissions/revan1010/runs/opt-countdown
opt-countdown inputs (gate G-A):
  as_of     2026-10-02  [your-input]
  lag_days  56          [your-input]
  opt_end   2027-01-31  [record]
  used      34          [record]
  ceiling   90          [record]
  buffer    20          [record]

Stopped at G-A: check the values above against the real documents, then rerun with --confirmed-by "<name>".
exit=3
```

I compared each printed value with `profile.yml` (`opt_end_date: 2027-01-31`,
`unemployment_days_used: 34`, `unemployment_ceiling: 90`, `buffer_target: 20`) and confirmed they
match.

### Step 2: signed run

```text
$ node scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs --profile search/examples/priya-nair/profile.yml --roles data/examples/ch11-roles.json --as-of 2026-10-02 --lag-days 56 --out-dir course/2026fa/submissions/revan1010/runs/opt-countdown --confirmed-by "Revan Chonnad"
opt-countdown inputs (gate G-A):
  as_of     2026-10-02  [your-input]
  lag_days  56          [your-input]
  opt_end   2027-01-31  [record]
  used      34          [record]
  ceiling   90          [record]
  buffer    20          [record]

timeline factor 0 [your-input] · start 2026-11-27 vs deadline 2026-11-27 (unemployment)
before: Apply 2 · Consider 1 · Skip 2
after:  Apply 1 · Consider 0 · Skip 4
pending human review: G-B 0 · G-C 5
wrote course/2026fa/submissions/revan1010/runs/opt-countdown/{opt-countdown-log.json, opt-countdown-report.md, roles-with-timeline.json, role-scores.json, role-scores.md, before/}
exit=0
```

### What the scorer actually received (its own audit trace, first job)

From `runs/opt-countdown/before/role-scores.json` and `runs/opt-countdown/role-scores.json`:

```text
before biotech-data Apply [{"factor":"liveness","multiplier":1,"source":"record"},{"factor":"timeline","multiplier":0.85,"source":"your-input"}] (0.9·0.35 + 0.7·0.3) × 1 × 0.85 = 0.446
after  biotech-data Skip  [{"factor":"liveness","multiplier":1,"source":"record"},{"factor":"timeline","multiplier":0,"source":"your-input"}]    (0.9·0.35 + 0.7·0.3) × 1 × 0 = 0.000
```

The votes are identical; only the timeline gate changed, and it zeroed the composite.

## Verified vs. inferred, line by line

| Value in the output | Label | Verified how / why it isn't |
|---|---|---|
| OPT end 2027-01-31 | record | read from `profile.yml`; I matched it by eye at G-A |
| 34 days used | record | read from `profile.yml`; matched at G-A. **Not verified as current**: the file has no as-of date |
| Ceiling 90, buffer 20 | record | read from `profile.yml`; matched at G-A |
| Today = 2026-10-02 | your-input | my choice; the run's date |
| Hiring time = 56 days | your-input | **my assumption**, not from any data, same for every job |
| Days run out = 2026-11-27 | your-input (computed) | arithmetic: 2026-10-02 + (90 − 34). **I recomputed it by hand** (below) |
| Hard deadline = 2026-11-27, binding = unemployment | your-input (computed) | earlier of Nov 27 and Jan 31; checked by eye |
| Safe deadline = 2026-11-07 | your-input (computed) | Nov 27 − 20 days; covered by unit test |
| Expected start = 2026-11-27 | your-input (computed) | 2026-10-02 + 56; same date as above |
| Timeline factor 0 | your-input (computed) | start ≥ hard deadline → 0 by the recipe's formula; unit test "Priya, 56-day lag" |
| Break-even 54 days / 36 days | your-input (computed) | unit test; 54 depends on the scorer's `gate_zero` 0.05, read from the scorer's own output |
| Sponsorship p and tier per job | record (per the sample file) | **not checked** against 80 Days or DOL data; the sample file is the book's illustration |
| Liveness per job | record (per the sample file) | **not checked** against live boards in this run |
| Fit per job | model-judgment | passed through untouched |
| Apply / Consider / Skip | scorer output | produced by the unchanged engine scorer; its trace shows the timeline it used (above) |
| Override "Apply" on the contact job | your-input (in the sample file) | pre-existing human override in `ch11-roles.json`; not mine |

## Verification

1. **Hand check of the key date (done by me).** Opened `search/examples/priya-nair/profile.yml`;
   it says `unemployment_days_used: 34`. 90 − 34 = **56** days left. From Oct 2: 29 days to the end
   of October, 56 − 29 = 27 → **November 27**. That matches the program's `days_out_date` and
   `hard_deadline` (2026-11-27).
2. **The scorer used the computed value.** Its own audit trace shows `timeline multiplier 0`
   after, `0.85` before (above). An offline test asserts this for every role.
3. **Tests.** `node --test scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.test.mjs`:
   15/15 pass. Breaking the formula on purpose (ignoring unemployment days) made 5 tests fail.
   Details in `TEST-REPORT.md`.
4. **Deliberate break attempts.** Missing date, OPT already over, 95 days used, no hiring time,
   negative hiring time, non-date "today", and output folder pointed at the tracked example data.
   All stop with a named error and exit 2. One of these found a real bug (below).
5. **Reproducibility.** A fresh clone of my branch re-ran to the same output; `git diff` showed
   only the `run_at` timestamp changed.

## Reflection

**What worked.**
- The gate idea held: one honest number (0) flipped a Proven-sponsor "Apply" to "Skip" without
  touching the scorer.
- Both predictions came true. P-A: every job got the same factor. P-B: the unemployment allowance
  binds two months before OPT ends.
- Every predicted failure case stopped cleanly without inventing a value.

**What the recipe or prototype got wrong or missed.**
- **Break-even was wrong in the first recipe draft:** I wrote 55 days, ignoring that the scorer
  treats any gate ≤ 0.05 as closed. Correct is 54. Fixed with a dated note in the recipe.
- **I didn't predict that a human override beats the timeline gate.** The sample's "hiring manager
  is a contact" job stays Apply with timeline 0. The prototype now flags it under G-C; at the gate
  I chose to drop it (see run log).
- **A bad argument crashed the script** (`--lag-days -5` → exit 1, confusing message). Fixed to
  exit 2 with a named error, and a test was added.
- **`CONTRIBUTING.md` says to import functions from the scorer, but it exports nothing**, so the
  prototype calls it as a command.
- **The tool only answers "does 8 weeks fit?"** With one hiring time for every job, it can't rank
  jobs by speed. For Priya today it skips all of them, which is honest but not very useful for
  choosing between them.

**One concrete next improvement.** Give each job its **own hiring time** (`lag_days` per role in
the roles file, with a source label) instead of one global 8 weeks. Even rough per-company numbers
(a posting's stated process, or dates from the student's own past applications) would let the gate
separate a 4-week startup (factor 1 for Priya) from a 16-week enterprise (factor 0). This is the
open `[TODO: DATA SOURCE]` in the recipe.

---

## Attestation

- Recipe: revan1010-opt-countdown v0.1.0
- By: Revan Chonnad · 2026-10-02 (commands typed by Claude Code at my request; checks marked "me" done by me)

### Tested

| Ran | Saw | Expected |
|---|---|---|
| opt-countdown without `--confirmed-by` | printed 6 labeled inputs, "Stopped at G-A", exit 3, no files | stop at G-A, nothing written |
| me: compared printed inputs with `profile.yml` | 2027-01-31 / 34 / 90 / 20 all match | match |
| opt-countdown with `--confirmed-by "Revan Chonnad"` | factor 0; start = deadline = 2026-11-27 (unemployment); Apply 1 · Consider 0 · Skip 4; G-C 5 pending | factor 0, unemployment binds (P-A, P-B) |
| me: 90 − 34, counted from Oct 2 on a calendar | 56 days → Nov 27 | Nov 27 |
| scorer audit trace, biotech-data | timeline multiplier 0.85 → 0; Apply → Skip | scorer uses computed value |
| `node --test …/opt-countdown.test.mjs` | 15 pass, 0 fail | all pass |
| **break:** profile missing `opt_end_date` | `[F-1] profile is missing visa.opt_end_date`, exit 2, no output folder | named error, nothing written |
| **break:** OPT end 2026-09-01; days used 95 | `[F-2] …is not after --as-of…`; `[F-2] …(95) is above…(90)`, exit 2 | named error |
| **break:** no `--lag-days` | `[F-4] --lag-days is required; refusing to default it…`, exit 2 | never defaults |
| **break:** `--out-dir data/examples` | `[F-1] --out-dir must differ…`, exit 2; `git status data/` clean | refuse; no tracked file touched |
| **break:** `--lag-days -5` | first: parse crash, exit 1. After fix: `[F-1] bad arguments…`, exit 2 | named error, exit 2 |
| **break:** formula mutated (`hard = optEnd`) | 5 of 14 tests failed; restored → 14 pass | tests catch a wrong formula |
| fresh clone: `npm run verify` | fails (`No module named 'yaml'`) until PyYAML venv; then passes | pre-existing repo gap |

### Did not test

- A live run: real postings, live liveness inside the run, real per-company hiring times.
- Any other persona (e.g. STEM OPT with a 150-day ceiling, where OPT end might bind).
- Whether a DSO would agree that starting on the last allowed day should count as 0.
- Whether "34 days used" is current. The persona file can't say.
- Other operating systems or Node versions (macOS, Node 26 only); roles files larger than 5 jobs.

### Broke during testing, fixed

- `--lag-days -5` crashed in Node's argument parser (exit 1). Wrapped parsing as an `[F-1]` input
  error (exit 2) and added a test. `scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs`, `run()`.
- Recipe break-even said 55; corrected to 54 (scorer `gate_zero` 0.05), with a dated note in
  `recipes/cases/2026fa/revan1010-opt-countdown.md`.
- One of the AI's break attempts (`--as-of "Oct 2"`) was split by the shell into two arguments, so
  it didn't test the program. Redone correctly quoted: `[F-2]`, exit 2.
