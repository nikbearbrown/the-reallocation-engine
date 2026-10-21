# Worked run — AI-startup triage, 2026-10-20

## Executive summary

This is the record of the sample run of the AI-startup triage mode for a fictional student, Ananya Rao, written so a reviewer can check every number against the output that produced it. The mode was run twice on the same inputs. The first run used the posting checks as they were before a reporting bug was fixed, and it reproduces that bug: postings that were never supplied were also blamed on a "non-AI title". The second run used the fixed code. Both reach the same decisions. One posting (Cohere Health) was live and was scored as a sample, and its verdict stays "hold — runway unverified". The other three are on hold, and no employer in the local data can be shown to have funding runway through the October 2027 H-1B start date. The attestation below lists what was tested, what was not, and what broke.

## Inputs

| Input | Path | sha256 (first 16) | Provenance |
|---|---|---|---|
| Employer funding + H-1B CSV | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | eccdee2addf472b1 | tracked repo data, 30,369 rows |
| Form D samples | `data/sec/form-d/processed/sample/*.json` | — | tracked repo data, 4 × 50 companies |
| BLS/O*NET context | `data/bls/compact/soc_occupation_compact.csv` | — | tracked repo data |
| Persona (fictional) | `search/examples/ananya-rao/` (`profile.yml`, `resume.example.json`, `gaps.md`) | — | fictional persona added for this mode |
| Postings + fit ratings | `runs/2026-10-20-run3b/inputs/postings.json` | 6f47a79da0c06928 | four CANNOT-VERIFY employers; two public aggregator URLs; fit values are judgments for the fictional persona against her résumé |
| Saved liveness output | `runs/2026-10-20-run3b/inputs/ats-liveness-2026-10-20.txt` | b7eec717558dce5e | `npm run ats:liveness` on two approved URLs, 2026-10-20T22:54:52Z |
| G-TIMELINE clearance | `runs/2026-10-20-run3b/inputs/clearance.json` | 792df1fa8de8657e | Gnanasudharsan Ashokumar, 2026-10-20 |

The run3a and run3b inputs are byte-identical (same three sha256 values in both `inputs/` folders). As-of date for both runs: 2026-10-20.

## Commands and output (verbatim)

### Liveness (network, two approved URLs only)

```
> the-reallocation-engine@1.0.0 ats:liveness
> node scripts/ats/check-liveness.mjs https://builtinaustin.com/job/machine-learning-engineer-ii/4500550 https://jobs.signalfire.com/companies/codametrix/jobs/53504944-machine-learning-engineer-ii

Checking 2 URL(s)...

✅ active     https://builtinaustin.com/job/machine-learning-engineer-ii/4500550
⚠️ uncertain  https://jobs.signalfire.com/companies/codametrix/jobs/53504944-machine-learning-engineer-ii
           navigation error: page.goto: Download is starting

Results: 1 active  0 expired  1 uncertain
```

### Run 3a (pre-fix posting checks) — `runs/2026-10-20-run3a-prefix/01-prefilter.txt`

The original pre-fix code was never committed. For this run the fix's two hunks were reversed in a temporary copy of the script (sha256 `b84342f3b66caa13…`), the run was made, and the fixed script (sha256 `f7b09c2df915cd58…`) was restored and checked by sha.

```
# run at 2026-10-21T01:47:25Z · branch contrib/2026fa-gnanasudharsan-ai-startup-formd · HEAD 015843d · PRE-FIX posting checks reconstructed by reversing the fix (script sha256 b84342f3b66caa13…; fixed script sha256 f7b09c2df915cd58…) · node v26.8.2
$ node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs --as-of 2026-10-20 --postings course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/inputs/postings.json --liveness course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/inputs/ats-liveness-2026-10-20.txt --clearance course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/inputs/clearance.json --out-dir course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix
run gate: OPEN — snapshot 2025-09-26 is within the 24-month window (cutoff 2024-10-20)
postings: 4 · scored 1 · held 3 · excluded 0
screened employers: 107 · {"FAIL:funding-stale":82,"FAIL:funding-below-minimum":15,"CANNOT-VERIFY":4,"FAIL:runway-ends-before-filing":6}
✓ scored 1 roles → Apply 1 · Consider 0 · Skip 0 (skip 0%)
  course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/role-scores.json  +  course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/role-scores.md
[exit 0]
```

The bug, from `runs/2026-10-20-run3a-prefix/ai-startup-formd-report.md`:

```
| aiera-none | AIERA INC |  | held | **HOLD** | title-not-ai; no-posting-supplied; fit-missing |  |
| membrion-none | MEMBRION INC |  | held | **HOLD** | title-not-ai; no-posting-supplied |  |
```

### Regression test — pre-fix checks, then fixed code (`runs/2026-10-20-run3b/00a-…`, `00b-…`)

```
# PRE-FIX posting checks (reconstructed) · 2026-10-21T01:49:48Z · script sha256 b84342f3b66caa13…
$ node --test --test-name-pattern=regression scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/
✖ regression: a row with no posting reports only no-posting-supplied, never title-not-ai (50.719ms)
ℹ tests 1
ℹ suites 0
ℹ pass 0
ℹ fail 1
[… 9 lines elided here; full output in runs/2026-10-20-run3b/00a-regression-old-code.txt]
  AssertionError [ERR_ASSERTION]: np-null
  + actual - expected
  
    [
  +   'title-not-ai',
      'no-posting-supplied',
  +   'fit-missing'
```

```
# FIXED code · 2026-10-21T01:49:48Z · script sha256 f7b09c2df915cd58…
$ node --test --test-name-pattern=regression scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/
✔ regression: a row with no posting reports only no-posting-supplied, never title-not-ai (23.526875ms)
ℹ tests 1
ℹ suites 0
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 69.980041
[exit 0]
```

### Full test suite on the fixed code (`runs/2026-10-20-run3b/00c-test-suite.txt`, summary lines)

```
# full suite · 2026-10-21T01:49:49Z · script sha256 f7b09c2df915cd58…
$ node --test scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/
[… 20 per-test ✔ lines elided here; full output in runs/2026-10-20-run3b/00c-test-suite.txt]
ℹ tests 20
ℹ suites 0
ℹ pass 20
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 520.596708
[exit 0]
```

### Run 3b (fixed code) — `runs/2026-10-20-run3b/01-prefilter.txt`

```
# run at 2026-10-21T01:49:49Z · branch contrib/2026fa-gnanasudharsan-ai-startup-formd · HEAD 015843d · script sha256 f7b09c2df915cd58… · node v26.8.2
$ node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs --as-of 2026-10-20 --postings course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/inputs/postings.json --liveness course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/inputs/ats-liveness-2026-10-20.txt --clearance course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/inputs/clearance.json --out-dir course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b
run gate: OPEN — snapshot 2025-09-26 is within the 24-month window (cutoff 2024-10-20)
postings: 4 · scored 1 · held 3 · excluded 0
screened employers: 107 · {"FAIL:funding-stale":82,"FAIL:funding-below-minimum":15,"CANNOT-VERIFY":4,"FAIL:runway-ends-before-filing":6}
✓ scored 1 roles → Apply 1 · Consider 0 · Skip 0 (skip 0%)
  course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/role-scores.json  +  course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/role-scores.md
[exit 0]
```

### Run 3b — scorer, unchanged (`runs/2026-10-20-run3b/02-npm-score.txt`)

```
# run at 2026-10-21T01:49:49Z · scripts/score/role-scorer.mjs unchanged: yes (sha256 8655e182c3c2256c…)
$ npm run score -- course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/roles.json --profile course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/profile.json --out-dir course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/npm-score

> the-reallocation-engine@1.0.0 score
> node scripts/score/role-scorer.mjs course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/roles.json --profile course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/profile.json --out-dir course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/npm-score

✓ scored 1 roles → Apply 1 · Consider 0 · Skip 0 (skip 0%)
  course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/npm-score/role-scores.json  +  course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/npm-score/role-scores.md
[exit 0]
```

The pre-filter's own scorer call and the separate `npm run score` produced byte-identical `role-scores.json` (sha256 `5bf4b65f6f40b17b…` for both) and `role-scores.md` (`4719fb92c655ee2a…` for both).

### Run 3b — results (`runs/2026-10-20-run3b/ai-startup-formd-report.md`)

```
| Posting | Company | Title | Status | Verdict | Reasons / warnings | Scorer (sample) |
|---|---|---|---|---|---|---|
| cohere-health-mle2 | COHERE HEALTH INC | Machine Learning Engineer II | scored | **HOLD — runway unverified** |  | Apply (0.523) |
| codametrix-mle2 | CODAMETRIX INC | Machine Learning Engineer II | held | **HOLD** | liveness-uncertain |  |
| aiera-none | AIERA INC |  | held | **HOLD** | no-posting-supplied |  |
| membrion-none | MEMBRION INC |  | held | **HOLD** | no-posting-supplied |  |
```

Scorer trace for the one scored row (`runs/2026-10-20-run3b/npm-score/role-scores.md`):

```
| COHERE HEALTH INC — Machine Learning Engineer II | 0.523 | **Apply** | composite 0.523 ≥ 0.3, gates healthy | sponsorship 0.9811320754716979·0.35 [record]; fit 0.6·0.3 [your-input] × liveness 1[record]×timeline 1[your-input] |
```

## Verified vs inferred, line by line

| Claim | Verified (record or output) | Inferred / judgment |
|---|---|---|
| Funding snapshot is 2025-09-26 | run gate line in both transcripts; independent recount below | — |
| 107 AI-title sponsoring employers; 82 stale, 15 below $5M, 6 runway-fail, 4 CANNOT-VERIFY | script output; independent Python recount matches exactly | that these titles are AI work (keyword list is a human decision) |
| Cohere Health latest round 2025-05-07, $89,999,876, runway ends 2027-05-07 | CSV line 6084, report timeline table | 24-month runway is an assumption |
| Cohere Health sponsorship 0.9811320754716979 | `Approval_Rate` 98.1132075471698 on CSV line 6084, ÷ 100 | that approval rate stands for sponsorship likelihood (human decision) |
| Cohere Health fit 0.6 | — | judgment for the fictional persona against her résumé |
| Cohere Health posting live | saved liveness: `✅ active` | that the employer's original posting is live (URL is an aggregator) |
| Composite 0.523 | scorer trace: 0.9811320754716979 × 0.35 + 0.6 × 0.30 = 0.5234 | — |
| Verdict "HOLD — runway unverified" | report; enforced by test #11 | — |
| CodaMetrix held | saved liveness: `⚠️ uncertain … navigation error: page.goto: Download is starting` | that the job may still be open |
| AIERA, Membrion held | postings file has no URL | Membrion likely non-AI (persona fit 0.1, judgment) |
| No newer Form D filing for the four held companies | Form D cross-check below: 0 matches each | that none exists outside the 50-per-quarter sample — not shown |

## Verification steps

1. **Fixture tests:** 20 tests on fictional fixtures, all passing (above).
2. **Three broken copies** of the script, each run against the tests in a scratch folder, then deleted:

   | What was broken | Test that caught it |
   |---|---|
   | blank funding amount read as $0 | break: Pooled Investment Fund, blank date, blank amount are stop conditions |
   | cleared company's verdict not forced to HOLD | clearance: cleared CANNOT-VERIFY posting is sample-scored but its verdict stays HOLD |
   | `Approval_Rate` not divided by 100 | break: Approval_Rate is a percentage and is rescaled to 0–1 with its CSV line cited |

   The report test also failed in all three copies, for an unrelated reason (the scratch copy had no `data/bls/`); it is not counted as a detection.
3. **Regression test** for the reporting bug: fails on the pre-fix checks, passes on the fixed code (above).
4. **Form D cross-check** (independent of the script):

   ```
   $ grep -il "<name>" data/sec/form-d/processed/sample/*.json | wc -l
   aiera          0
   codametrix     0
   cohere health  0
   membrion       0
   ```
5. **Count cross-check against the CSV** (independent Python recount with the `csv` module, same decided rules):

   ```
   $ python -I crosscheck.py   (independent re-count; csv module, not the Node script)
   rows 30369 | snapshot max 2025-09-26
   AI-title H-1B employers 107
   {'CANNOT-VERIFY': 4, 'FAIL:below-min': 15, 'FAIL:runway': 6, 'FAIL:stale': 82}
   ```
6. **Scorer unchanged:** `git diff --quiet HEAD -- scripts/score/role-scorer.mjs` reported unchanged in the run3b transcript; both scorer calls produced identical output.

## Attestation

- Recipe: gnanasudharsan-ai-startup-formd v0.1.0
- By: Gnanasudharsan Ashokumar · 2026-10-20

*Drafted from the session record; the attestation is the signer's.*

### Tested

| Ran | Saw | Expected |
|---|---|---|
| `npm run ats:liveness` on the two supplied URLs | Cohere Health `active`; CodaMetrix `uncertain` — "navigation error: page.goto: Download is starting" | a status per URL, no other URLs fetched |
| pre-filter on the real CSV with persona inputs (run3b) | 4 postings: 1 scored, 3 held, 0 excluded; 107 screened employers | only cleared, live CANNOT-VERIFY postings scored; no PASS available |
| `npm run score` unchanged on run3b `roles.json` | 1 role, Apply 0.523 (raw), identical to the pre-filter's call | identical output; raw scorer unaware of the clearance |
| report verdict for the cleared, scored row | "HOLD — runway unverified" | never "Apply" |
| independent Python recount | 107 / 82 / 15 / 6 / 4 | same counts as the script |
| Form D grep for the four held companies | 0 / 0 / 0 / 0 | any match would move the effective date |
| break: blank amount read as $0 (broken copy) | stop-conditions test failed | a test fails |
| break: cleared verdict not overridden (broken copy) | clearance test failed | a test fails |
| break: Approval_Rate not rescaled (broken copy) | rescale test failed | a test fails |
| break: no posting supplied (pre-fix checks, regression test) | `['title-not-ai','no-posting-supplied','fit-missing']` vs expected `['no-posting-supplied']` | test fails on pre-fix checks, passes on fixed code |
| run with as-of 2028-06-01 on fixtures (test) | exit 5, "cannot verify current runway" | whole run refused |

### Did not test

- The report test depends on the repo-relative `data/bls/` path; run from a copy outside the repo it fails for that reason alone (seen in all three broken-copy runs). Not fixed.
- The original pre-fix code: it was never committed, so run3a and the failing regression output use a reconstruction (the fix's two hunks reversed), not the original file.
- Form D beyond the local samples (50 companies per quarter); "no newer filing" is "not in the sample".
- Any EDGAR lookup for the four held companies.
- The employers' original postings: both URLs are aggregator pages; CodaMetrix's could not be read at all.
- Whether role quality should matter: the scorer's `role_quality` weight is 0, so the occupation table never affected a result.
- A live run with postings at a PASS company — none exists in the local data at this as-of date.
- Liveness was run once; it was not repeated to check stability.
- The scorer's own `role-scores.md` prints "Apply" for the cleared row; only the human report carries the HOLD verdict. Not changed (the scorer is out of scope).

### Broke during testing, fixed

- **title-not-ai on rows with no posting** — the pre-fix checks reported "title-not-ai" (and "fit-missing") for AIERA and Membrion, which had no posting at all. Fixed in `scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs` (a no-URL posting returns `no-posting-supplied` only); regression test added; evidence in `runs/2026-10-20-run3a-prefix/` and `runs/2026-10-20-run3b/00a–00b`.
- **PyYAML missing for `npm run verify`** — the manifest check failed with `ModuleNotFoundError: No module named 'yaml'` under Homebrew Python; fixed by running with the project `.venv` activated (PyYAML 6.0.3 there). No repo change.

## Reflection

- **Went well:** every gate refused rather than guessed; the independent recount matched the script exactly; the cleared row could not turn into an "Apply"; the broken copies were each caught.
- **Got wrong or missed:** the first run blamed a non-existent title for two held rows — the gate order let later checks run after the posting was already known to be missing. The keyword list still admits weak matches (Vouch, Membrion); the warning flags one of them, not both.
- **What surprised me:** I expected the funding gate to filter weak startups out; the bigger finding was that a 13-month-old funding snapshot cannot verify runway to October 2027 for any company, so the honest output is HOLD, not Apply.
- **Next steps:** the five open items — full Form D quarters (with sec.gov download approval), DOL LCA data with occupation codes and fiscal year, an EDGAR freshness check for held companies, and a "what would clear this hold" report column — then find the employers' own postings for Cohere Health and CodaMetrix and re-run liveness on those.
