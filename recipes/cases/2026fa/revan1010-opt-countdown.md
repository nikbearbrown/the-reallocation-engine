---
status: DRAFT
todos_open: 3
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# opt-countdown — computed visa-timeline gate for a year-1 OPT student

## Executive summary

**What it does.** For a student on F-1 OPT who has already used part of their 90 allowed
unemployment days, this recipe works out, for each job on a list, whether the hiring process can
finish before the student runs out of time. It turns the student's own dates into one number
between 0 and 1. A 0 means "the calendar has already ruled this job out, skip it no matter how good
it looks." A 1 means "no time problem." Anything in between means "possible, but it eats into the
safety margin."

**Who it's for.** An international student in post-completion OPT, year 1, part-way through the
unemployment allowance. The worked example is the fictional persona Priya Nair: OPT ends
2027-01-31, 34 of 90 unemployment days used, a 20-day safety margin.

**What it decides, and what it doesn't.** It decides the timeline number and passes it to the
engine's existing scorer, which returns Apply / Consider / Skip. It does **not** decide anything
legal: whether the last allowed day still counts, STEM eligibility, or H-1B timing all go to the
school's international student advisor (DSO). Today the engine's sample jobs carry a hand-typed
timeline value; this recipe replaces that guess with a number computed from real dates, and shows
the before/after.

Two customers: this file is for the agent; `recipes/cases/2026fa/revan1010-opt-countdown.card.md`
is for the human.

**Handoff condition (done when):** the run writes all five output files listed under *Output
contract* into the run folder; every role in the agent log carries `timeline.factor`,
`timeline.source`, and the four dates that produced it; the scorer's own `role-scores.json` exists
in the same folder; and gate G-A shows a named human in `cleared_by`. "The numbers look right" is
not the condition.

## Required reads

1. `SNICKERDOODLE.md`: gates, provenance, TODO closure.
2. `DOMAIN.md`: what runs today; known gaps.
3. `book/chapters/10-the-visa-timeline-manager.md`: what the timeline factor means (lines 30–65).
4. `scripts/score/role-scorer.mjs`: how the scorer consumes `timeline.factor` (lines 84–104).
5. `course/2026fa/submissions/revan1010/CHANGE-BRIEF.md`: the predictions this run is checked against.
6. This recipe and its card.

## Purpose and source inventory

| Source | Path / command | Exists today? | Used for |
|---|---|---|---|
| Persona profile | `search/examples/priya-nair/profile.yml` | yes | `visa.opt_end_date`, `visa.unemployment_days_used`, `visa.unemployment_ceiling`, `visa.buffer_target` |
| Example roles | `data/examples/ch11-roles.json` | yes | 5 roles with sponsorship, fit, liveness already filled; timeline hand-typed (0.85 / 0.9) |
| Role scorer | `scripts/score/role-scorer.mjs` · `npm run score -- <roles.json> --out-dir <dir>` | yes | Apply / Consider / Skip + per-term audit. **Run as-is; not copied, not edited.** |
| Liveness checker | `scripts/ats/check-liveness.mjs` · `npm run ats:liveness -- <url>` | yes (needs `npx playwright install chromium`) | Manual check at gate G-B only. Not called by the prototype (keeps it offline). |
| Timeline concept | `book/chapters/10-the-visa-timeline-manager.md` | yes | Meaning of 0 / between / 1. Gives examples, **no formula**. |
| Prototype | `scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs` | **no** | Computes the factor and writes outputs. Not built yet (Proposed addition 1). |

### Prior art in this repo

`recipes/cases/2026su/case-opt-timeline-fit-company-targeting.md` and
`recipes/cases/2026su/case-ds-faang-opt-runway.md` describe a similar question but are template
drafts: no formula, and every step script is still an open development TODO. This recipe differs by fixing an explicit
formula and shipping a script that runs it.

## The formula (decided, not yet implemented)

Inputs, all from the profile except the two marked `your-input`:

| Name | Meaning | Priya | Label |
|---|---|---|---|
| `as_of` | the date the run treats as "today" | 2026-10-02 | your-input |
| `opt_end` | `visa.opt_end_date` | 2027-01-31 | record (persona file) |
| `used` | `visa.unemployment_days_used` | 34 | record (persona file) |
| `ceiling` | `visa.unemployment_ceiling` | 90 | record (persona file) |
| `buffer` | `visa.buffer_target` | 20 | record (persona file) |
| `lag` | days from today until the job would start | 56 (8 weeks) | your-input |

Dates:

```text
expected_start  = as_of + lag
days_out_date   = as_of + (ceiling - used)          # the day the unemployment allowance is gone
hard_deadline   = min(opt_end, days_out_date)       # whichever comes first
safe_deadline   = hard_deadline - buffer
```

Factor (sliding, option A in my decision log):

```text
if expected_start >= hard_deadline:  factor = 0
elif expected_start <= safe_deadline: factor = 1
else: factor = (hard_deadline - expected_start) / (hard_deadline - safe_deadline)
```

- Starting **on** the hard deadline counts as 0. That is a conservative choice (Ch.10: "when in
  doubt, err conservative"), not a legal reading. Whether the last day is usable is a DSO question
  (gate G-D).
- Checking `>= hard_deadline` first means a zero buffer can never divide by zero.
- `timeline.source` is written as `your-input`: the factor is arithmetic over two records and two
  of my own assumptions, and a value is only as strong as its weakest input.
- Priya, worked by hand: `expected_start` = 2026-11-27, `days_out_date` = 2026-11-27,
  `hard_deadline` = 2026-11-27 (earlier than OPT end 2027-01-31), `safe_deadline` = 2026-11-07,
  so **factor = 0**.

**Break-even numbers** (also reported per run, so the human sees how far off the job is):
`max_lag_for_factor_above_0 = hard_deadline - as_of - 1` (Priya: 55 days) and
`max_lag_for_factor_1 = safe_deadline - as_of` (Priya: 36 days).

## Proposed additions

1. **The prototype script.** Reads the profile and roles, computes the factor per the formula above,
   writes a new roles file with `timeline` replaced, runs the existing scorer on it, then writes the
   agent log and human report. Fails with a named error on F-1, F-2, F-4.
   `[TODO: DEV]` Implement at `scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs`,
   with an offline `node --test` file and fixtures beside it.
2. **A real source for hiring time.** Today every role gets the same 8-week assumption, so the
   timeline can't tell a fast employer from a slow one (CHANGE-BRIEF prediction P-A). A per-role
   `lag` needs evidence (e.g. a posting's stated process, or tracked application dates).
   `[TODO: DATA SOURCE]` No such dataset is in the repo.
3. **An "as of" date for unemployment days.** The profile says `unemployment_days_used: 34` but not
   on which date it was counted, so the run assumes it is current at `as_of`.
   `[TODO: DATA SOURCE]` Needs a dated field in the profile, which is a shared file and out of scope
   for this contribution.

Not proposed: any change to `role-scorer.mjs`. Its default of `timeline ?? 1` for a missing
timeline (line 85) is handled here by never emitting a role without a timeline, not by patching
the scorer.

## Phase gates

Each gate is a hard stop. A failed gate ends the run with a non-zero exit and **no output files**
except what the gate itself says to write.

| Gate | Who clears it | Test (against paths that exist) | Pass | Fail |
|---|---|---|---|---|
| **G0: inputs valid** | machine | profile has `opt_end_date`, `unemployment_days_used`, `unemployment_ceiling`, `buffer_target`; `opt_end > as_of`; `0 <= used <= ceiling`; `lag` given and `> 0`; roles file parses | continue | exit non-zero, error names the field (F-1, F-2, F-4) |
| **G-A: confirm inputs** | named human | the script prints every input value and stops unless `--confirmed-by "<name>"` is passed; agent log field `gates.G-A.cleared_by` is non-null | compute + score | exit non-zero after printing; nothing scored |
| **G-B: liveness uncertain** | named human | any role whose `liveness.factor` is missing or not exactly 0 or 1 is listed under `gates.G-B.pending` | — | listed in report; the human runs `npm run ats:liveness -- <url>` and opens the link |
| **G-C: timeline zeroed a role** | named human | every role with `timeline.factor == 0` is listed under `gates.G-C.pending` **with its four dates** | — | human checks the dates against the student's real documents before the drop |
| **G-D: legal / STEM** | DSO | always on: report carries a fixed "not legal advice" block; the script never reads `stem_eligible` into the formula | — | — |

G-B and G-C do not stop the script. They stop the **decision**: a role on a pending list is not
final until a human clears it. Clearance is recorded in the run log (`logs/runs/`), not by
rerunning the script.

## What it can and can't verify

### Can verify (machine-checkable)

- The profile fields exist, parse as dates/integers, and are internally consistent (G0).
- The four dates and the factor follow from the inputs by the formula above (re-derivable by hand;
  the human report prints them).
- The scorer received the computed factor: `role-scores.json` audit trace shows the same
  `timeline` value the agent log wrote.
- No role reaches the scorer without a timeline (G0 + the roles file the script writes).

### Can't verify

- **How long any real employer takes to hire.** The 8 weeks is my assumption, the same for every
  role. Labeled `your-input`.
- **Whether `unemployment_days_used` is current.** The profile has no as-of date.
- **Whether Priya stays unemployed every day from today.** The countdown assumes she does.
- **Whether starting on the exact last allowed day is legal**, STEM eligibility, or cap-gap/H-1B
  lottery timing. Not modeled; DSO only (G-D).
- **Whether the sample roles are real or live.** `ch11-roles.json` is the book's illustrative
  example; its sponsorship and liveness values are labeled `record` inside that file but were not
  checked against 80 Days or a live board in this recipe.
- **Fit.** Labeled `model-judgment` in the input file; passed through untouched.

### Facts about the engine that apply here

- **Role quality has weight 0 in the scorer.** This recipe doesn't use role quality, so that gap
  doesn't change any result here; it is noted, not addressed.
- **Only SEC samples ship / `bls:local-wage` fails on a fresh clone / the H-1B join validator
  needs full data.** Not used by this recipe.
- **`data/raw/`, `data/verified/`, `logs/gate-decisions/` don't exist.** Every path in this recipe
  is under `search/examples/`, `data/examples/`, `scripts/`, `course/2026fa/submissions/revan1010/`,
  or `logs/runs/`.
- **The `snickerdoodle` CLI doesn't run.** No step uses it.

## Workflow

Run from the repo root. All commands below exist today except step 3.

1. Confirm inputs exist:

```bash
test -f search/examples/priya-nair/profile.yml && test -f data/examples/ch11-roles.json && test -f scripts/score/role-scorer.mjs
```

2. Baseline, so there is a "before" to compare against (hand-typed timeline):

```bash
npm run score -- data/examples/ch11-roles.json --out-dir course/2026fa/submissions/revan1010/runs/baseline
```

3. Run the recipe. First without `--confirmed-by` (prints inputs, stops at G-A), then with it.
   The script is not built yet (Proposed addition 1); the command shape is fixed here so the
   README can copy it:

```bash
node scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs --profile search/examples/priya-nair/profile.yml --roles data/examples/ch11-roles.json --as-of 2026-10-02 --lag-days 56 --out-dir course/2026fa/submissions/revan1010/runs/opt-countdown --confirmed-by "<name>"
```

4. Human reads the report; clears or rejects every G-B and G-C item; records it in
   `logs/runs/2026fa-revan1010-<n>.md`.

Always pass `--out-dir`. Without it the scorer overwrites the tracked example output.

## Output contract

All files go to the `--out-dir` folder. Nothing outside it is written.

| File | Reader | Contents |
|---|---|---|
| `opt-countdown-log.json` | agent | inputs with labels; computed dates; per-role factor + source; gate states; scorer exit code; output paths |
| `opt-countdown-report.md` | human | plain summary first; input echo; date table; per-role before/after decision; G-B / G-C pending lists; break-even lags; "not legal advice" block |
| `roles-with-timeline.json` | scorer | `ch11-roles.json` with `timeline` replaced; same shape |
| `role-scores.json` / `role-scores.md` | both | written by the existing scorer, unchanged |

Agent-log shape (fields fixed; values illustrative of type only):

```json
{
  "recipe": "revan1010-opt-countdown",
  "recipe_version": "0.1.0",
  "run_at": "<ISO timestamp>",
  "inputs": {
    "profile_path": "<path>", "roles_path": "<path>",
    "as_of":   { "value": "<YYYY-MM-DD>", "source": "your-input" },
    "lag_days":{ "value": "<int>",        "source": "your-input" },
    "opt_end": { "value": "<YYYY-MM-DD>", "source": "record" },
    "used":    { "value": "<int>",        "source": "record" },
    "ceiling": { "value": "<int>",        "source": "record" },
    "buffer":  { "value": "<int>",        "source": "record" }
  },
  "dates": { "expected_start": "", "days_out_date": "", "hard_deadline": "", "safe_deadline": "", "binding": "opt_end | unemployment" },
  "break_even": { "max_lag_for_factor_above_0": 0, "max_lag_for_factor_1": 0 },
  "roles": [ { "role_id": "", "timeline_before": 0, "timeline_after": 0, "timeline_source": "your-input", "decision_before": "", "decision_after": "" } ],
  "gates": { "G-A": { "cleared_by": "" }, "G-B": { "pending": [] }, "G-C": { "pending": [] }, "G-D": { "note": "not legal advice" } },
  "scorer": { "command": "", "exit_code": 0, "out": "role-scores.json" }
}
```

## Stop conditions

Stop and do not invent a value when:

- any G0 field is missing or invalid (F-1, F-2): name the field, exit non-zero;
- `--lag-days` is missing (F-4): **never** default it, and never write a role without `timeline`,
  because the scorer would silently treat a missing timeline as 1;
- `--confirmed-by` is missing (G-A);
- the scorer exits non-zero: report its stderr; do not write a decision;
- asked to raise a factor because a job "looks great": refuse; that is G-C's human decision;
- asked whether the student is STEM-eligible or whether the last day is legal: refuse; G-D.

## Next action per result (the 3-3-2 day)

| Result | Next action | Which block of the day |
|---|---|---|
| **Apply** (timeline 1, other votes strong) | tailor the application this week | the 2 research-and-apply hours |
| **Consider** (timeline between 0 and 1) | apply only if a faster process is realistic; ask the recruiter for the timeline first | 2 hours (one short email) |
| **Skip, timeline = 0, other votes strong** | don't apply cold. Use the break-even number: reach out to someone at the company and ask whether a process under `max_lag_for_factor_above_0` days is possible | moves to the 3 networking hours |
| **Skip, other reasons** (non-sponsor, dead posting) | drop it; the time goes back to networking or the credibility project | freed |

## Run-log template (`logs/runs/2026fa-revan1010-<n>.md`)

Never edit `logs/RUN_LOG.md`.

```markdown
## YYYY-MM-DD — opt-countdown <sample | live>

- **Recipe:** recipes/cases/2026fa/revan1010-opt-countdown.md v0.1.0
- **Inputs:** profile <path>; roles <path>; as_of <date> (your-input); lag_days <n> (your-input)
- **Command:** <exact command>
- **Outputs:** <out-dir>/opt-countdown-log.json, opt-countdown-report.md, roles-with-timeline.json, role-scores.json, role-scores.md
- **Result:** <n> roles → Apply <a> · Consider <c> · Skip <s>; hard deadline <date> (binding: <opt_end|unemployment>)
- **Gates:** G-A cleared by <name>; G-B <n pending / cleared how>; G-C <n pending / cleared how>
- **Open issues:** <what did not work, what is still unverified>
```
