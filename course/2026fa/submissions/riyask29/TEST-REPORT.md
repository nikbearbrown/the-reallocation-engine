# TEST-REPORT — Data-Analyst Sponsor Check

## Executive summary

This report records how the prototype was tested and what happened. It ran
from a fresh copy of the repository, produced the same results as the
development run, passed all eight offline tests, and stopped correctly on each
failure case named in the change brief. Two problems turned up: a misspelled
company name gets no "did you mean" hints, and a company career page could not
be confirmed as open. Both are recorded below, not hidden. The repository's own
continuous-integration checks already fail on the instructor's main branch for
reasons unrelated to this work. That is shown with evidence so a red check on
this pull request is not misread.

## Run record

- **Branch:** `contrib/2026fa-riyask29-data-analyst-sponsor-boston`
- **Date:** 2026-10-02 · **Node:** v24.10.0 · **OS:** macOS (Darwin 23.6.0)
- **Who ran it:** Claude (AI assistant), at riyask29's direction, in the student's
  terminal session. riyask29 re-runs the commands below before
  submission (see *Not yet done*).
- **"Clean checkout":** first done before any commit (a fresh clone with the new
  files copied in, sections 1–5). **Repeated from a real clone of commit
  `398ccd7`** (`git clone -b contrib/2026fa-riyask29-data-analyst-sponsor-boston`,
  fresh `npm install`); see section 9.

## 1. Toolchain baseline: before and after

| Check | Before (fresh clone, no changes) | After (clean copy + my files) |
|---|---|---|
| `npm run doctor` | exit 0 · `environment: ✓ runnable` · `recipes: 33/33` | exit 0 · **identical output** (`diff` of the two runs is empty) |
| `npm run verify` | exit 0 · `conformance: 158 files` · `manifest check passed (3 warnings)` | exit 0 · `conformance: 173 files` · `manifest check passed (3 warnings)` |
| `node scripts/pii-scan.mjs` | exit 1 · 1 finding: `[email] package-lock.json — <an npm package author's address, redacted here>` | exit 1 · **the same single finding**, none in my paths |

Doctor's recipe count does not change because `scripts/doctor.mjs` reads only
top-level `recipes/`, not `recipes/cases/`. I predicted it would rise by one;
that prediction was wrong.

The three verify warnings (`archive/`, `private/`, `data/ats/`) are on a
fresh clone too. `git check-ignore -v` shows `private/` and `data/ats/` *are*
ignored (`.gitignore:37 /private/*`, `.gitignore:40 /data/ats/*`), so W2 is a
false alarm from the manifest checker's pattern match.

The PII finding is in `package-lock.json`, which this branch does not modify. The
untouched upstream clone gives the same finding and exit 1.

## 2. Offline test (no network)

```
$ node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.test.mjs
✔ title classifier separates data-analyst titles from other "analyst" titles (0.747667ms)
✔ company lookup never guesses (F1, F2) (0.564ms)
✔ timeline factor: unemployment days bind before the OPT date (F4) (0.757375ms)
✔ wage check reports a missing SOC row instead of a number (F5) (0.679542ms)
✔ end to end on fixtures: gates hold, failures are not scored, real scorer runs (119.097625ms)
✔ OPT already past → every scored role is gated to Skip (F4) (120.021125ms)
✔ break attempt: "work authorized" persona — prototype refuses instead of reporting zero-weight scores (95.655541ms)
✔ missing OPT end date → refuses to guess a timeline (44.91525ms)
ℹ tests 8
ℹ suites 0
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 453.043625
exit 0
```

**Do the tests test anything?** I temporarily changed `analyst_check.mjs` so
that a company missing from the CSV got `sponsorship = {p: 0}` and went on to
the scorer. That is exactly the error the brief warns about. Result: `pass 5,
fail 3` (the end-to-end, OPT-ended and authorized-trap tests failed). With the
original file restored: `pass 8, fail 0`.

## 3. The real sample run (clean copy, live liveness)

```
$ node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --today 2026-10-02
Checking 3 posting URL(s) with Playwright…
  liveness uncertain https://careers.everquote.com/job/?gh_jid=7999629003
  liveness active    https://boards.greenhouse.io/abacusinsights/jobs/8770716002?gh_jid=8770716002
  liveness active    https://www.klaviyo.com/careers/jobs/7737707003?gh_jid=7737707003
✓ 6 leads · scored 2 · stopped G1 2 · G2 1 · G3 0 · no-posting 1
  scorer: ✓ scored 2 roles → Apply 0 · Consider 1 · Skip 1 (skip 50%)
  everquote-sem            check-posting-by-hand liveness: uncertain
  abacus-growth-analytics  review-then-tailor   above threshold (0.420) but one soft spot: sponsorship tier "Likely"
  klaviyo-analytics-eng    skip                 gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes)
  benefits-science-da      network              Proven analyst sponsor with no posting to apply to
  writer-expired           resolve-company      company identity: no-h1b-record
  hubspot-da               resolve-company      company identity: not-in-dataset
  → scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-log.json  +  scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-report.md
exit 0
```

The same six next actions came out of three separate live runs on 2026-10-02
(two in the working tree, one in the clean copy).

## 4. Each failure case exercised

| # | Case (from CHANGE-BRIEF) | How exercised | Observed | Invented a value? |
|---|---|---|---|---|
| F1 | company not in CSV / no H-1B fields | real run: HubSpot, Writer; test `company lookup never guesses` | `not-in-dataset`, `no-h1b-record`; stopped at G1; `sponsorship: null`; not in `roles.json` | no |
| F2 | ambiguous name | test: query `Abacus` against the fixture slice | `not-exact-near-matches`, 3 names listed, none chosen | no |
| F2b | **typo** "Abacus Insight" (missing *s*) | live break run | `not-in-dataset` with **no near matches**. Stopped correctly, but gives the human no hint. **Not fixed** (see §7) | no |
| F3 | Form D has nothing | real run | all 6 leads `not-in-sample`; coverage `200 of 58329 companies across 4 sample quarter file(s)` printed on each; test confirms `in-sample` for Databricks | no |
| F4 | OPT already past | test with `persona.opt-ended.json` | timeline `0`, status `opt-already-ended`; every scored lead → Skip | no |
| F4b | lag beyond runway | real run: Klaviyo, 10 weeks = 70 days > 49 days runway | timeline `0` → scorer `Skip (gated: timeline)` | no |
| F5 | SOC missing from BLS | test with `99-9999.00` | `no-occupation-row`, no wage field | no |
| F6 | posting 404 / expired | test fixture `expired` | liveness gate 0 → `Skip`; Proven sponsor → `network` | no |
| — | posting `uncertain` | real run: EverQuote (runs 1–2), Abacus (run 2) | stopped at G2, not scored, until a person checked | no |
| — | URL pointing at `127.0.0.1` | live break run | repo guard `blocked host 127.0.0.1` → `uncertain` → stopped at G2; no request made | no |
| — | persona status "work authorized" | test `persona.authorized-trap.json` | exit 2: scorer misread `needs_sponsorship`; no log written | no |
| — | persona missing `opt_end_date` | test `persona.missing-date.json` | exit 2, `refusing to guess a timeline` | no |

## 5. Recipe gate tests

The handoff check and the four gate one-liners in the recipe all exit 0 on the
real run's log. Run against a copy of the log where I set `sponsorship = {p: 0}`
on the HubSpot lead, the G1 test exits **1**.

## 6. Paths changed

From the clean clone of commit `398ccd7`:

```
$ git diff --stat origin/main...HEAD | tail -1
 48 files changed, 5600 insertions(+)

$ git diff --name-only origin/main...HEAD   (grouped by namespace)
  22 course/2026fa/submissions/riyask29/
   2 logs/runs/                               (2026fa-riyask29-1.md, 2026fa-riyask29-2.md)
   2 recipes/cases/2026fa/                    (riyask29-data-analyst-sponsor-boston.md, .card.md)
  22 scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/
```

Insertions only, with no file outside these four namespaces and no protected
path (checked against the `contrib-scope` rules in
`.github/workflows/contrib-gate.yml`). `package-lock.json` is changed by
`npm install`; it was reverted (`git checkout -- package-lock.json`) and is not
part of this branch.

## 7. What a human must judge (the gates)

- **G1:** HubSpot (not in dataset) and Writer (no H-1B fields): unknown, not
  "non-sponsor". For a typo like "Abacus Insight", a person has to notice there
  are no hints and retype the name.
- **G2:** EverQuote returned `uncertain`. Its Greenhouse board lists the job
  (checked through the public boards API during exploration), but a person must
  open the page.
- **G3:** whether each hiring-lag estimate is honest. Abacus at 4 weeks gives
  factor 1.0 (Consider 0.420); at 6 weeks it would be 0.35 → 0.147 → Skip. The result is sensitive to a guess.
- **G4:** whether "Business Analyst Manager – Data Distribution Team" (Abacus)
  and "Quantitative Analyst" (EverQuote) count as the student's kind of work.

**Decisions made (riyask29, 2026-10-02; full record in `logs/runs/2026fa-riyask29-2.md`):**
G1, Writer and HubSpot: unknown, research by hand. G2, EverQuote and Abacus: both
open, seen in a browser. G3, the lags are realistic. G4, the Abacus title counts;
"Quantitative Analyst" does not, so the rule was changed.

## 7b. Student re-runs (runs 2 and 3)

Run by riyask29 in their own terminal, 2026-10-02.

| Run | Command | Result |
|---|---|---|
| test | `node --test …/analyst_check.test.mjs` | pass 8, fail 0 |
| 2 (live) | `node …/analyst_check.mjs --today 2026-10-02` | scored 1 · G2 stops **2**: Abacus became `uncertain` (`Timeout 15000ms exceeded`) 25 min after run 1 said `active`; Greenhouse API still HTTP 200 |
| 3 (after gates) | `node …/analyst_check.mjs --liveness-file …/inputs/liveness.gate-cleared.json --today 2026-10-02` | scored 3 · Consider 2 (Abacus 0.420, EverQuote 0.231) · Skip 1 · network 1 · resolve-company 2 |

New failure behaviour found by the student and handled:

| Case | Observed | Response |
|---|---|---|
| liveness not repeatable | the same URL is `active`, then `uncertain`, 25 minutes apart | gate stops it; a person clears it; recorded in recipe TODO 3 |
| application *form*, not button (EverQuote) | the checker says `uncertain`; a person sees a form | G2 browser check, labeled `your-input` |
| a person's check must not become a "record" | before the fix, every liveness-file entry was labeled record | `analyst_check.mjs` keeps `source: your-input`; covered by fixture `t-human-confirmed` |

After these changes: `node --test` → pass 8, fail 0 (the classifier and
end-to-end tests gained 3 assertions), and conformance passes.

## 8. CI note (not caused by this branch)

Upstream `main`'s own **Contrib Gate** run for its latest commit
(`015843d`, run 35913366020, 2026-09-23) is **failing**: `harness-regression`
(the "Shukla scenario harness" step) and `doctor-and-pii` fail, and
`conformance` passes. The three runs before it fail the same way. PRs from forks
show `action_required` until the maintainer approves the workflow run. A red
or pending check on this PR should be compared with that baseline.

Why each job fails on `main`:
- **`harness-regression`**: 4 of the 6 scripts that `.github/workflows/contrib-gate.yml`
  runs do not exist in the repository: `scripts/test/gate-behavior-harness.mjs`,
  `scripts/test/fuzz-invariants.mjs`, `scripts/gates/gate-behavior-harness.mjs` and
  `scripts/score/scorer-harness.mjs` (checked with `test -f` on 2026-10-02;
  `scripts/score/gate-behavior-harness.mjs` and `scripts/score/gate-harness.mjs`
  do exist). This was first pointed out in a classmate's PR comment (#6) and
  verified here.
- **`doctor-and-pii`**: the working-tree `pii-scan` step exits 1 on the
  `package-lock.json` finding (section 1).

## 9. Clean clone of the committed branch (commit `398ccd7`)

| Check | Result |
|---|---|
| `npm run doctor` | exit 0 · `environment: ✓ runnable` |
| `npm run verify` | exit 0 · `conformance: 180 files … ✓ all conform` · `manifest check passed (3 warnings)` |
| `node --test …/analyst_check.test.mjs` | pass 8, fail 0 |
| `node scripts/pii-scan.mjs` (working tree) | exit 1, only the upstream `package-lock.json` finding (§1) |
| `node scripts/pii-scan.mjs --diff origin/main` (full branch history, as CI runs it on PRs) | **`pii-scan: clean ✓`**, exit 0 |
| run 3 reproduced: `node …/analyst_check.mjs --liveness-file …/inputs/liveness.gate-cleared.json --today 2026-10-02 --out-dir <tmp>` | `analyst-check-report.md`, `role-scores.md`, `roles.json`, `scorer-profile.json` **byte-identical** to the committed `out/`; `analyst-check-log.json` roles identical |

My first attempt at the history scan in the clone used `--diff main` and failed
with `fatal: ambiguous argument 'main..HEAD'`: a fresh single-branch clone has
`origin/main`, not `main`. Re-run with `origin/main` → clean.

## Not done

- A live-liveness run from the clean clone (liveness is not repeatable anyway; see §7b).
- Writer and HubSpot sponsorship research outside this dataset (G1 decision: research by hand).
