# Test Report — SWE STEM-OPT Runway

## Executive summary

This report records a test of the job-search prototype on a fresh copy of the branch, to show that it works for someone who has only the submitted code and not the author's machine. Everything passed. The repository's own health checks gave the same results before and after these changes. The prototype ran and produced the same three recommendations as in the worked run. Its automatic test passed all nine checks, and it caught both mistakes that were planted on purpose. The changes touch only the author's own folders. Things only a person can judge are listed at the end, such as whether a posting is still open or whether a job description excludes international students. None of those were cleared in this run.

## Run record

| Field | Value |
|---|---|
| Commit tested | `4a23461` on `contrib/2026fa-tisaac-swe-stem-opt` |
| How | `git clone --branch contrib/2026fa-tisaac-swe-stem-opt` into an empty folder, then `npm ci` (exit 0) |
| Baseline ("before") | commit `20fe22b` (the first submission), same machine, before any change in this round |
| Date | 2026-10-21 |
| Environment | macOS 27.0.1 · Node v24.13.0 · Python 3.11.10 |
| Network | used only by `npm ci`; the prototype and its test make no network calls |

## 1. Toolchain baseline: before and after

| Command | Before (`20fe22b`) | After (clean clone, `4a23461`) |
|---|---|---|
| `npm run doctor` | exit 0, `environment: ✓ runnable`, `✓ no private/PII paths are tracked` | exit 0, identical output |
| `npm run verify` | exit 0, conformance 166 files ✓, manifest check passed (3 warnings) | exit 0, conformance **167** files ✓ (+1 = the new test file), manifest check passed (same 3 warnings) |

The 3 manifest warnings (`archive/`, `private/`, `data/ats/` gitignore notes) come from the main repository and are the same before and after. `doctor` counts only top-level `recipes/`, so its recipe totals do not include `recipes/cases/`.

After output (clean clone):

```
$ npm run verify

> the-reallocation-engine@1.0.0 verify
> node scripts/conformance.mjs && node scripts/manifest-check.mjs

conformance: 167 files (89 md · 36 py · 32 js · 6 json · 4 sh)
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
[exit 0]
```

## 2. Real sample run

```
$ node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js
🚀 Starting SWE STEM-OPT Prototype...
Loaded 3 test jobs from scripts/contrib/2026fa/tisaac-swe-stem-opt/fixture.json.
[WARNING] Job job-3-bad-url triggered a Parsing Exception! (-1 Error: not a supported ATS URL)
[no-matched] Not found in the 80-days CSV (sponsorship 0, labeled your-input): Isaac Super Fake Tech LLC, Non-ATS Startup
✅ Saved evidence tagged output to scripts/contrib/2026fa/tisaac-swe-stem-opt/my-roles.json
⚙️ Calling role-scorer.mjs...
✓ scored 3 roles → Apply 2 · Consider 0 · Skip 1 (skip 33%)
  scripts/contrib/2026fa/tisaac-swe-stem-opt/role-scores.json  +  scripts/contrib/2026fa/tisaac-swe-stem-opt/role-scores.md
🎉 Run complete!
[exit 0]
```

The full report and the line-by-line verified/inferred split are in `WORKED-RUN.md`.

```
$ node scripts/conformance.mjs scripts/contrib/2026fa/tisaac-swe-stem-opt/
conformance: 7 files (2 md · 3 json · 2 js)
✓ all conform (machine half of P4). Adequacy is still the human gate.
[exit 0]
```

## 3. Offline test

```
$ node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.test.mjs
SWE STEM-OPT prototype — offline test
  ✓ writes both outputs (JSON log + Markdown report) into --out-dir
  ✓ every evidence term carries one of the three allowed source labels
  ✓ real company: sponsorship is a record, and the CSV row really has H-1B approvals
  ✓ failure case 1 — company missing from the CSV: p 0, tier no-matched, never labeled record
  ✓ failure case 2 — non-ATS URL: liveness -1, scorer Skips it as gated
  ✓ offline liveness is never presented as a record
  ✓ fit and timeline come from the fixture, not from numbers in the code
  ✓ fails clearly, without inventing a value, when a job is missing fit
  ✓ prototype source makes no network calls

9 passed, 0 failed
[exit 0]
```

The test runs the prototype into a temporary folder, so it never writes over the tracked sample outputs.

## 4. Each failure case exercised

| Failure case (from `CHANGE-BRIEF.md`) | How it was exercised | Result |
|---|---|---|
| 1. Company missing from the CSV | `job-2-fake` in the fixture | sponsorship `p 0`, `tier no-matched`, `source your-input`; never labeled `record` (test ✓) |
| 2. Job URL can't be parsed | `job-3-bad-url` (non-ATS domain) | liveness `-1`; scorer returns Skip, reason `gated: liveness ≈ -1.000`; the rest of the batch still runs (test ✓) |
| Missing input (added this round) | the test deletes `fit` from one job in a temporary copy of the fixture | exit ≠ 0, stderr names the missing field, no `my-roles.json` written (test ✓) |

**Deliberate breaks.** To show the test is not too loose, `index.js` was changed on purpose and the test was run. These breaks were run in the working copy before the commit, not in the clean clone. After each break, the file was restored from a saved copy, and `cmp` confirmed it matched that copy byte for byte.

| Break | Test result |
|---|---|
| M1: liveness labeled `record` again (the first submission's mistake) | `8 passed, 1 failed` (exit 1): `✗ offline liveness is never presented as a record — job-1-real: + 'record' - 'your-input'` |
| M2: removed the check that stops the run on a missing field | `8 passed, 1 failed` (exit 1): `✗ fails clearly, without inventing a value, when a job is missing fit — expected a non-zero exit` |

## 5. Gate machine checks (from the recipe)

```
$ node -e "...G1..."     # every role with a closed liveness gate was skipped
G1 machine check ok
[exit 0]

$ node -e "...G2..."     # every role carries a numeric timeline the student supplied
G2 machine check ok
[exit 0]
```

Full commands are in the recipe under *Phase gates*.

## 6. Only my namespaced paths changed

```
$ git diff --stat origin/main...HEAD
 course/2026fa/submissions/tisaac/CHANGE-BRIEF.md   |  38 +++++
 .../submissions/tisaac/DOMAIN-JUSTIFICATION.md     |  35 +++++
 course/2026fa/submissions/tisaac/FRICTIONAL.md     | 162 +++++++++++++++++++++
 course/2026fa/submissions/tisaac/SOURCES.md        |   5 +
 course/2026fa/submissions/tisaac/SUBMISSION.md     |  11 ++
 course/2026fa/submissions/tisaac/WORKED-RUN.md     | 152 +++++++++++++++++++
 logs/runs/2026fa-tisaac-1.md                       |  19 +++
 recipes/cases/2026fa/tisaac-swe-stem-opt.card.md   |  72 +++++++++
 recipes/cases/2026fa/tisaac-swe-stem-opt.md        | 151 +++++++++++++++++++
 .../contrib/2026fa/tisaac-swe-stem-opt/README.md   |  34 +++++
 .../2026fa/tisaac-swe-stem-opt/fixture.json        |  26 ++++
 .../contrib/2026fa/tisaac-swe-stem-opt/index.js    | 134 +++++++++++++++++
 .../2026fa/tisaac-swe-stem-opt/index.test.mjs      | 119 +++++++++++++++
 .../2026fa/tisaac-swe-stem-opt/my-roles.json       |  68 +++++++++
 .../2026fa/tisaac-swe-stem-opt/role-scores.json    | 152 +++++++++++++++++++
 .../2026fa/tisaac-swe-stem-opt/role-scores.md      |  13 ++
 16 files changed, 1191 insertions(+)
[exit 0]
```

All 16 paths are under `course/2026fa/submissions/tisaac/`, `recipes/cases/2026fa/tisaac-*`, `scripts/contrib/2026fa/tisaac-*`, or `logs/runs/2026fa-tisaac-1.md`. `logs/RUN_LOG.md`, `scripts/score/role-scorer.mjs`, and `data/examples/` are untouched. After the sample run in the clean clone, `git status --short` and `git diff --stat` were both empty. The run rewrote only the prototype's own sample outputs, with the same content. (This file, `TEST-REPORT.md`, was added in the commit after `4a23461`.)

**Privacy.** `node scripts/pii-scan.mjs` reports 1 finding: `[email] package-lock.json — i@izs.me`. That address belongs to an npm package author, and the lockfile comes from the main repository. It is not part of this change. No résumé, `private/`, or `search/resume.json` file is read or committed.

## 7. What the gates require a person to judge

Before any **Apply** or **Consider** role gets an application, a person must:

| Gate | The person must see | Cleared in this run? |
|---|---|---|
| G1 Liveness | `npm run ats:liveness -- <url>` exits 0 for the posting | **No.** The URLs are invented, and offline liveness is an assumption |
| G2 Visa timeline | the student's OPT dates fit the employer's start date, matching `timeline` in the fixture | **No.** `1.0` is the persona's assumption |
| G3 International-student ban | the JD has no "US citizens only", "no sponsorship", or clearance requirement | **No.** Not implemented, and there is no JD in the fixture |
| G4 Excluded titles | the title is not a Data / ML-specialist role | Titles are all "Software Engineer". Not machine-checked |

A person must also judge one thing that no gate covers. `job-2-fake` reached **Apply** at exactly the 0.30 threshold with no sponsorship record, carried only by the self-reported `fit = 1.0`. Is that Apply real? The machine cannot tell.
