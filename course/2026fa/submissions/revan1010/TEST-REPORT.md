# TEST-REPORT — opt-countdown

## Executive summary

**What this is:** the record of testing the opt-countdown prototype from a fresh copy of my branch,
with the real terminal output pasted in.

**Why read it:** it shows whether the prototype runs for someone who has never touched my
machine, whether it fails safely on the cases I predicted, and what a person still has to judge.

**What it found:** on a fresh clone the prototype's tests pass and the sample run reproduces the
committed result exactly (only the timestamp changes). Every predicted failure case stops with a
named error and writes nothing. Two break attempts turned up problems: a negative hiring time
passed as `--lag-days -5` crashed with an unhelpful error (fixed, test added), and one of my own
break attempts was malformed by shell quoting and had to be redone. The repo's `npm run verify`
fails on any fresh clone until PyYAML is installed; that is a repo setup gap, not caused by this
contribution. Whether the output is *adequate* (are the dates right for a real student, is 8 weeks
a fair assumption) is still a human judgment; see the last section.

---

## How the tests were run

- **Who:** commands typed by Claude Code (AI) at my request. I (Revan Chonnad) checked the gate
  G-A input values against the persona file in chat before the signed run (see `FRICTIONAL.md`).
- **Where:** a fresh `git clone --branch contrib/2026fa-revan1010-opt-countdown` of my local repo
  into a scratch folder outside the repo, then `npm install`. Clean-clone HEAD:
  `47c8a22`. The bug fix in "Broke during testing" was made after this and re-tested in the main
  checkout (see that section).
- **Date:** 2026-10-02 (local). Node v26.0.0, Python 3.14 (Homebrew).

## 1. Toolchain baseline

### Before my changes (upstream `015843d`, fresh clone, 2026-10-02)

```text
$ npm run doctor
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked
SUMMARY
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
exit=0

$ npm run verify
conformance: 158 files (85 md · 36 py · 30 js · 4 sh · 3 json)
✓ all conform (machine half of P4). Adequacy is still the human gate.
ModuleNotFoundError: No module named 'yaml'
  E1 .ai/manifest.yaml does not parse: Error: Command failed: python3 -c "import yaml,json;print(json.dumps(yaml.safe_load(open('.ai/manifest.yaml'))))"
✗ manifest check FAILED (1 error)
exit=1

# fix (repo-local, .venv/ is gitignored):
$ python3 -m venv .venv && .venv/bin/pip install pyyaml && source .venv/bin/activate
$ npm run verify
conformance: 158 files (85 md · 36 py · 30 js · 4 sh · 3 json)
✓ all conform (machine half of P4). Adequacy is still the human gate.
✓ manifest check passed (3 warnings)
exit=0
```

`pip install --user pyyaml` into Homebrew's Python is blocked (PEP 668), hence the venv.

### After my changes (fresh clone of my branch at `47c8a22`)

```text
$ npm run doctor
SUMMARY
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
exit=0

$ npm run verify   # fresh clone, no PyYAML
ERROR (1):
  E1 .ai/manifest.yaml does not parse: Error: Command failed: python3 -c "import yaml,json;print(json.dumps(yaml.safe_load(open('.ai/manifest.yaml'))))"

✗ manifest check FAILED (1 error)
exit=1

$ npm run verify   # after: python3 -m venv .venv && .venv/bin/pip install pyyaml

✓ manifest check passed (3 warnings)
exit=0

$ node scripts/conformance.mjs scripts/contrib/2026fa/revan1010-opt-countdown/
conformance: 5 files (1 md · 2 json · 2 js)
✓ all conform (machine half of P4). Adequacy is still the human gate.
exit=0
```

Same result before and after: `doctor` passes; `verify` needs PyYAML on any fresh clone.
The 3 manifest warnings are pre-existing. One of them (`private/` and `data/ats/` "not
gitignored") is a false positive: `git check-ignore` confirms both are ignored via `/private/*`
and `/data/ats/*` (`.gitignore` lines 37 and 40).

`npm run doctor` counts 33 recipes and does not scan `recipes/cases/2026fa/`, so its TODO check
does not cover my recipe. I counted the markers by hand: 2 `[TODO: DATA SOURCE]`, matching
`todos_open: 2`.

## 2. Offline tests (fresh clone)

```text
$ node --test scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.test.mjs
✔ Priya, 56-day lag: start lands on the hard deadline → factor 0 (3.14425ms)
✔ sliding band: 36 days → 1, 46 days → 0.5, 54 days → 0.1, 55 days → 0.05 (0.588875ms)
✔ break-even lags respect the scorer gate_zero (0.05 is closed, so 54 not 55) (0.315291ms)
✔ OPT end binds when it comes before the unemployment days run out (0.14575ms)
✔ zero buffer does not divide by zero (0.22325ms)
✔ F-1 missing data: profile without opt_end_date → exit 2, names the field, writes nothing (50.763ms)
✔ F-2 wrong dates: OPT already over → exit 2 (49.977167ms)
✔ F-2 wrong dates: days used above the ceiling → exit 2 (48.426792ms)
✔ F-4 no time frame: missing --lag-days → exit 2, never defaults (50.277ms)
✔ G-A: without --confirmed-by it prints inputs, exits 3, writes nothing (48.349209ms)
✔ refuses to write into the roles file folder (scorer overwrite trap) (47.240125ms)
✔ full run: both outputs written, scorer saw the computed timeline, labels present (140.735083ms)
✔ G-B: a liveness value that is neither 0 nor 1 is listed for a human (151.648917ms)
✔ BROKEN fixture: the real scorer treats a missing timeline as 1 (the trap this script refuses) (45.217917ms)
ℹ tests 14
ℹ pass 14
ℹ fail 0
exit=0
```

After the fix in "Broke during testing" one test was added (bad argument values). Main checkout:

```text
ℹ tests 15
ℹ pass 15
ℹ fail 0
```

### Do the tests catch a broken formula? (mutation checks, main checkout)

A test suite that passes on the first try could be checking nothing, so the formula was broken on
purpose twice, the tests run, and the file restored.

| Change made to `opt-countdown.mjs` | Tests failing | Meaning |
|---|---|---|
| `expectedStart >= hard` → `expectedStart > hard` (start on deadline day counts as OK) | 1 of 14 (zero-buffer) | For Priya the sliding formula already gives 0 on the deadline day, so this rule only matters when the buffer is 0. Only that test can see it. |
| `hard = min(optEnd, daysOut)` → `hard = optEnd` (ignore unemployment days) | 5 of 14 | The formula tests and the end-to-end test all catch it. |

After restoring: 14/14 pass.

## 3. The real sample run (fresh clone)

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

**Reproducible:** this run wrote over the committed run output in the clean clone. `git diff`
showed exactly one changed line:

```text
-  "run_at": "2026-10-03T00:25:35.287Z",
+  "run_at": "2026-10-03T00:34:06.134Z",
```

(`run_at` is UTC; locally both were 2026-10-02.)

**Before → after per job** (from `opt-countdown-report.md`):

| Job | Decision before (timeline hand-typed 0.85 / 0.9) | Decision after (timeline 0, computed) |
|---|---|---|
| Cambridge biotech, Proven sponsor | Apply | **Skip** (timeline gate) |
| Household-name non-sponsor | Skip | Skip (timeline gate) |
| Proven sponsor, ghost posting | Skip | Skip (liveness gate) |
| Likely-tier sponsor | Consider | **Skip** (timeline gate) |
| Non-sponsor, hiring manager is a contact | Apply (human override) | **Apply** (human override survives) |

Skip rate went from 40% to 80%.

## 4. Each failure case, exercised (fresh clone)

```text
### F-1 missing data: profile without visa.opt_end_date
opt-countdown: [F-1] profile is missing visa.opt_end_date
exit=2 ; out-dir exists: no

### F-2 wrong date: OPT already ended (2026-09-01)
opt-countdown: [F-2] visa.opt_end_date 2026-09-01 is not after --as-of 2026-10-02
exit=2

### F-2 wrong number: 95 days used (limit 90)
opt-countdown: [F-2] visa.unemployment_days_used (95) is above visa.unemployment_ceiling (90)
exit=2

### F-4 no time frame: --lag-days left out
opt-countdown: [F-4] --lag-days is required; refusing to default it (the scorer would treat a missing timeline as 1)
exit=2

### F-3 dead link: ghost-posting role in the signed run
{"role_id":"ghost-posting","liveness":0,"liveness_source":"record","decision_after":"Skip","reason":"gated: liveness ≈ 0.000 (a closed gate zeroes the composite regardless of votes)"}
```

The F-1/F-2 profiles were made at test time from `search/examples/priya-nair/profile.yml` with one
field changed, written to a temp folder, never committed.

F-3 is exercised through the sample's ghost-posting role (liveness 0 in the roles file), not a
live 404, so the test stays offline. A live check is separate: during setup,
`npm run ats:liveness` on a made-up Greenhouse job ID returned **`uncertain`, not `expired`**
(`content present but no visible apply control found`). That's why gate G-B exists.

## 5. Deliberate break attempts

```text
### Break attempt: --out-dir pointed at data/examples (scorer overwrite trap)
opt-countdown: [F-1] --out-dir must differ from the roles file folder (the scorer would overwrite tracked example output)
exit=2
$ git status --short data/
(no output: nothing under data/ changed)

### Break attempt: --lag-days -5          (fresh clone, BEFORE fix)
opt-countdown: Option '--lag-days' argument is ambiguous.
Did you forget to specify the option argument for '--lag-days'?
To specify an option argument starting with a dash use '--lag-days=-XYZ'.
exit=1

### Break attempt (redo, after fix): --lag-days -5
opt-countdown: [F-1] bad arguments: Option '--lag-days' argument is ambiguous. (pass negative numbers as --lag-days=-5)
exit=2

### Break attempt: --lag-days=-5
opt-countdown: [F-4] --lag-days must be a whole number > 0, got "-5"
exit=2

### Break attempt (redo, correctly quoted): --as-of "Oct 2"
opt-countdown: [F-2] --as-of is not a YYYY-MM-DD date: "Oct 2"
exit=2
```

## 6. Scope of the change

```text
$ git diff --stat 015843d...HEAD      # 015843d = upstream main when I branched
 .../2026fa/submissions/revan1010/CHANGE-BRIEF.md   | 158 +++++++++++
 .../runs/opt-countdown/before/role-scores.json     | 241 +++++++++++++++++
 .../runs/opt-countdown/before/role-scores.md       |  15 ++
 .../runs/opt-countdown/opt-countdown-log.json      | 238 ++++++++++++++++
 .../runs/opt-countdown/opt-countdown-report.md     |  62 +++++
 .../revan1010/runs/opt-countdown/role-scores.json  | 241 +++++++++++++++++
 .../revan1010/runs/opt-countdown/role-scores.md    |  15 ++
 .../runs/opt-countdown/roles-with-timeline.json    | 151 +++++++++++
 .../submissions/revan1010/runs/role-scores.json    | 241 +++++++++++++++++
 .../submissions/revan1010/runs/role-scores.md      |  15 ++
 .../cases/2026fa/revan1010-opt-countdown.card.md   |  76 ++++++
 recipes/cases/2026fa/revan1010-opt-countdown.md    | 298 +++++++++++++++++++++
 .../2026fa/revan1010-opt-countdown/README.md       |  73 +++++
 .../fixtures/BROKEN-roles-missing-timeline.json    |   6 +
 .../fixtures/roles-uncertain-liveness.json         |  18 ++
 .../revan1010-opt-countdown/opt-countdown.mjs      | 270 +++++++++++++++++++
 .../revan1010-opt-countdown/opt-countdown.test.mjs | 171 ++++++++++++
 17 files changed, 2289 insertions(+)
```

Every path is under `course/2026fa/submissions/revan1010/`, `recipes/cases/2026fa/revan1010-*`,
or `scripts/contrib/2026fa/revan1010-opt-countdown/`. All insertions; no existing repo file
modified. (`runs/role-scores.*` is the setup run the assignment asks for:
`npm run score -- data/examples/ch11-roles.json --out-dir course/2026fa/submissions/revan1010/runs`.)
This stat is from `47c8a22`; the later bug-fix commit touches only files in my prototype folder
and this report.

### Privacy

```text
$ node scripts/pii-scan.mjs
pii-scan: 1 finding(s) — see DATA_CONTRACT.md §Zero-Conditions

  [email] package-lock.json — <address redacted in this report: an npm package author's email>
exit=1
```

Not from this contribution: `package-lock.json` is unchanged on my branch, and that address (an
npm package author's) is already in upstream commit `d08afdd`. All my commits use the GitHub
noreply address `76840558+revan1010@users.noreply.github.com`. The only persona is the existing
fictional Priya Nair, unchanged.

## 7. What the gates require a human to judge

| Gate | What the machine checked | What only a human can judge |
|---|---|---|
| G-A inputs | the values exist, parse, and are consistent | that they match the student's **real** EAD / I-20 / day count. For this run I compared the printed values with `search/examples/priya-nair/profile.yml` and confirmed they match. |
| G-B liveness | listed any role whose liveness isn't exactly 0 or 1 (none in this run) | whether an unclear posting is real: open it, or run `npm run ats:liveness -- <url>` |
| G-C timeline 0 | listed all 5 roles with the dates that zeroed them | whether to drop a strong job, or network to ask if the company can move faster than 54 days |
| G-D legal | nothing; the script never reads `stem_eligible` | whether the last allowed day counts, STEM eligibility, H-1B timing: the DSO's call |

G-C has 5 pending items from this run. They are not cleared yet; that happens in the run log
(`logs/runs/2026fa-revan1010-1.md`).

## Did not test

- A **live** run: real postings, real liveness checks inside the run, real hiring times.
- Any persona other than Priya (e.g. Aarav's STEM OPT with a 150-day ceiling, where the OPT end
  date could bind instead).
- Whether the formula's output matches what a DSO or a real student would consider "cutting it
  close".
- Other operating systems or Node versions (only macOS, Node 26).
- Roles files much larger than 5 roles.
- `--as-of` dates other than 2026-10-02 in a full run (only in unit tests).

## Broke during testing, fixed

- **Bad argument crashed with exit 1.** `--lag-days -5` (with a space) made Node's argument parser
  throw before my input checks ran: unhelpful message, exit 1 instead of 2. **Fix:** wrapped
  argument parsing so any malformed argument becomes a named `[F-1] bad arguments` error with exit
  2; added a test covering negative lag, non-date `--as-of`, and malformed flags (15 tests now).
  File: `scripts/contrib/2026fa/revan1010-opt-countdown/opt-countdown.mjs`, `run()`.
- **My own break attempt was malformed.** The first `--as-of "Oct 2"` attempt was split into two
  arguments by shell word-splitting in the test command, so it tested the shell, not the program.
  Redone correctly quoted: `[F-2]`, exit 2.
- **Earlier (while building):** the recipe's first break-even number (55 days) ignored the
  scorer's closed-gate line of 0.05; corrected to 54 with a dated note in the recipe.
