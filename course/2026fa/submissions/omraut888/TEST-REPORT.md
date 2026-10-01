# TEST-REPORT.md

## Executive summary

This is the test record for the ML/RAG H-1B triage prototype, run from a
fresh copy of the pushed branch. Read it to check that the prototype runs,
that its tests pass, and that it behaves as documented when its inputs are
broken. Everything passed: the build and scorer ran cleanly on the real
data, all 19 tests passed, the three deliberate failure cases were handled
without a crash, and the repository's health checks gave identical results
before and after. The run also reproduced the known weakness: the scorer
skips none of the 183 companies. That is a property of the prototype,
recorded in the card and the brief, not a test failure.

## Run record

- Clone: `git clone --branch contrib/2026fa-omraut888-ml-h1b-timeline https://github.com/omraut888/the-reallocation-engine` into a fresh directory, not the working copy used for development
- Commit tested: `4df0ec9df930bb584e8897292777a612b036a629`
- Dependencies: `npm ci` (installs from the lockfile without rewriting it); 0 changed files after install
- Tools: node v22.14.0, Python 3.11.15
- Date: 2026-09-30
- Output below is pasted unedited. Each block shows the command, its full output, and its exit code.

| Step | Command | Exit | Result |
|---|---|---|---|
| 1 | `npm run doctor` (before) | 0 | environment runnable, no tracked PII |
| 2 | `npm run verify` (before) | 0 | 163 files conform; manifest check passed with 3 warnings |
| 3 | `build_roles.py --out /tmp/ml-h1b-test` | 0 | 183 roles from 1,557 H-1B rows |
| 4 | `npm run score` | 0 | Apply 87 · Consider 96 · Skip 0 (skip 0%) |
| 5 | `test_build_roles.py` | 0 | 19 tests, OK |
| 6a | unparseable titles | 0 | 1 row skipped and named, 182 roles, no crash |
| 6b | OPT window already closed | 0 | usable days 0, all 183 timeline factors 0.0, all 183 gated to Skip |
| 6c | live network without approval | 0 | build completes with sockets disabled; 183 roles `liveness_checked: false`; approval gate still open |
| 7 | `npm run doctor` (after) | 0 | identical to step 1 |
| 8 | `npm run verify` (after) | 0 | identical to step 2 |
| 9 | `git diff --stat` and branch scope | 0 | no tracked file changed by the run; branch adds 7 files in 3 contributor paths |

## 1. npm run doctor (before)

````text
$ npm run doctor

> the-reallocation-engine@1.0.0 doctor
> node scripts/doctor.mjs

RECIPE DOCTOR — The Reallocation Engine
==========================================

ENVIRONMENT (required)
  ✓ node       v22.14.0
  ✓ python3    Python 3.11.15

ENVIRONMENT (optional — features degrade without these)
  — pandoc     not found (resume/PDF rendering)
  — libreoffice not found (PDF fallback)
  ✓ playwright installed

RUNNABLE COMMANDS (npm script → target file present?)
  ✓ verify         scripts/conformance.mjs
  ✓ manifest-check scripts/manifest-check.mjs
  ✓ eval:score     scripts/eval/score-run.mjs
  ✓ eval:report    scripts/eval/report.mjs
  ✓ doctor         scripts/doctor.mjs
  ✓ bls:local-wage scripts/bls/local-wage-adjustment.py
  ✓ build-instructions scripts/build-instructions.mjs
  ✓ to-markdown    scripts/to-markdown.mjs
  ✓ score          scripts/score/role-scorer.mjs
  ✓ score:gates    scripts/score/gate-harness.mjs
  ✓ ats:dedup      scripts/ats/dedup-tracker.mjs
  ✓ ats:liveness   scripts/ats/check-liveness.mjs
  ✓ ats:merge      scripts/ats/merge-tracker.mjs
  ✓ ats:normalize  scripts/ats/normalize-statuses.mjs
  ✓ ats:scan       scripts/ats/scan.mjs
  ✓ ats:verify     scripts/ats/verify-pipeline.mjs
  ✓ resumes:pdf    scripts/resumes/generate-pdf.mjs
  ✓ svg-to-png     scripts/svg-to-png.mjs
  ✓ audit:layout   scripts/svg-layout-audit.mjs
  ✓ postsvg-to-png scripts/svg-layout-audit.mjs
  ✓ skill-demand   scripts/score/skill-demand-monitor.mjs
  ✓ skill-demand:test scripts/score/skill-demand-monitor.test.mjs
  ✓ fetch-postings scripts/ats/fetch-real-postings.py
  ✓ pii-scan       scripts/pii-scan.mjs

DOMAIN DIRECTORIES
  ✓ data/sec
  ✓ data/bls
  ✓ data/ats
  ✓ data/80-days-to-stay
  ✓ scripts/sec
  ✓ scripts/bls
  ✓ scripts/ats
  ✓ scripts/resumes

PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked

RECIPES (33)
  with lifecycle frontmatter: 33   missing: 0
  by status: DRAFT 28 · RUNNABLE-SAMPLE 4 · RUNNABLE-LIVE  # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED 1
  open TODOs: 318 declared (in frontmatter) · 318 [TODO markers in bodies

SUMMARY
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
[exit 0]
````

## 2. npm run verify (before)

````text
$ npm run verify

> the-reallocation-engine@1.0.0 verify
> node scripts/conformance.mjs && node scripts/manifest-check.mjs

conformance: 163 files (88 md · 38 py · 30 js · 4 sh · 3 json)
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
[exit 0]
````

The three manifest warnings are present on `main` and are not caused by this
branch. `private/` and `data/ats/` are in fact gitignored (as `/private/*` and
`/data/ats/*`); the check does not recognise that pattern form.

## 3. Build the role records

````text
$ python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --out /tmp/ml-h1b-test
built 183 roles from 1557 H-1B rows (30369 in CSV); skipped: unparseable-titles 0, no-approval-rate 0
tiers {'Proven': 134, 'Likely': 49, 'Unknown': 0}; fit > 0 on 173/183; usable days 36 as of 2026-09-30
  /tmp/ml-h1b-test/roles.json  +  /tmp/ml-h1b-test/build-audit.json
[exit 0]
````

## 4. Score them

````text
$ npm run score -- /tmp/ml-h1b-test/roles.json --out-dir /tmp/ml-h1b-test

> the-reallocation-engine@1.0.0 score
> node scripts/score/role-scorer.mjs /tmp/ml-h1b-test/roles.json --out-dir /tmp/ml-h1b-test

✓ scored 183 roles → Apply 87 · Consider 96 · Skip 0 (skip 0%)
  ../../../../../../../tmp/ml-h1b-test/role-scores.json  +  ../../../../../../../tmp/ml-h1b-test/role-scores.md
[exit 0]
````

The 0% skip rate is the documented first-run finding (card, named failure
mode 2), not a regression.

## 5. Test harness

````text
$ python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/test_build_roles.py
test_every_role_is_labeled_unchecked_for_liveness (__main__.Build.test_every_role_is_labeled_unchecked_for_liveness) ... ok
test_only_h1b_rows_with_ml_titles_become_roles (__main__.Build.test_only_h1b_rows_with_ml_titles_become_roles) ... ok
test_small_sample_is_likely_tier_and_below_raw_rate (__main__.Build.test_small_sample_is_likely_tier_and_below_raw_rate) ... ok
test_stage_drives_timeline (__main__.Build.test_stage_drives_timeline) ... ok
test_unparseable_titles_are_counted_not_dropped_silently (__main__.Build.test_unparseable_titles_are_counted_not_dropped_silently) ... ok
test_full_overlap_is_one (__main__.Fit.test_full_overlap_is_one) ... ok
test_target_tokens_from_profile (__main__.Fit.test_target_tokens_from_profile) ... ok
test_whole_word_overlap (__main__.Fit.test_whole_word_overlap) ... ok
test_closed_opt_window_is_a_gated_skip (__main__.ScorerContract.test_closed_opt_window_is_a_gated_skip) ... ok
test_scorer_accepts_built_roles (__main__.ScorerContract.test_scorer_accepts_built_roles) ... ok
test_shrinkage_pulls_small_samples_toward_prior (__main__.Sponsorship.test_shrinkage_pulls_small_samples_toward_prior) ... ok
test_tier_boundaries (__main__.Sponsorship.test_tier_boundaries) ... ok
test_buffer_exhausted_never_goes_negative (__main__.Timeline.test_buffer_exhausted_never_goes_negative) ... ok
test_factor_is_ratio_capped_at_one (__main__.Timeline.test_factor_is_ratio_capped_at_one) ... ok
test_opt_window_closed_gives_zero_days (__main__.Timeline.test_opt_window_closed_gives_zero_days) ... ok
test_stage_buckets (__main__.Timeline.test_stage_buckets) ... ok
test_usable_days_from_persona (__main__.Timeline.test_usable_days_from_persona) ... ok
test_no_match_inside_other_words (__main__.TitleKeywords.test_no_match_inside_other_words) ... ok
test_real_ml_titles_still_match (__main__.TitleKeywords.test_real_ml_titles_still_match) ... ok

----------------------------------------------------------------------
Ran 19 tests in 0.052s

OK
[exit 0]
````

## 6. Failure cases, exercised deliberately

The recipe's stop conditions name three failure cases. Each was triggered on
purpose with temporary inputs under `/tmp/ml-h1b-fc/`, never by editing a
tracked file.

### 6a. Unparseable sponsored-title string

The closing bracket was removed from ACV AUCTIONS INC's title list in a copy
of the CSV. Expected: the row is counted and named as skipped, the build does
not crash, and every other company is still built. On the real data this
never happens (0 of 1,557 rows fail to parse).

````text
$ python3 -c "import csv; src='data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv'; rows=list(csv.reader(open(src,encoding='utf-8',errors='replace'))); i=next(k for k,r in enumerate(rows) if r[0]=='ACV AUCTIONS INC'); rows[i][19]=rows[i][19].rstrip(']'); csv.writer(open('/tmp/ml-h1b-fc/bad-titles.csv','w',newline='',encoding='utf-8')).writerows(rows); print('corrupted row', i, '->', repr(rows[i][19]))"
corrupted row 621 -> "['Machine Learning Engineer III'"
[exit 0]
$ python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --csv /tmp/ml-h1b-fc/bad-titles.csv --out /tmp/ml-h1b-fc/6a
built 182 roles from 1557 H-1B rows (30369 in CSV); skipped: unparseable-titles 1, no-approval-rate 0
tiers {'Proven': 133, 'Likely': 49, 'Unknown': 0}; fit > 0 on 172/182; usable days 36 as of 2026-09-30
  /tmp/ml-h1b-fc/6a/roles.json  +  /tmp/ml-h1b-fc/6a/build-audit.json
[exit 0]
$ python3 -c "import json; a=json.load(open('/tmp/ml-h1b-fc/6a/build-audit.json')); print('roles_built:', a['roles_built']); print('skipped:', json.dumps(a['skipped']))"
roles_built: 182
skipped: {"unparseable-titles": {"count": 1, "companies": ["ACV AUCTIONS INC"]}, "no-approval-rate": {"count": 0, "companies": []}}
[exit 0]
````

### 6b. OPT window already closed

The persona's `opt_end_date` was moved to 2026-09-01, before the fixed as-of
date of 2026-09-30, in a copy of the persona folder. Expected: usable days 0,
every timeline factor exactly 0.0 rather than negative or an error, and the
scorer's closed-gate rule turning every role into Skip.

````text
$ cp -R search/examples/priya-nair /tmp/ml-h1b-fc/persona-opt-closed && sed -i '' 's/opt_end_date: 2027-01-31/opt_end_date: 2026-09-01/' /tmp/ml-h1b-fc/persona-opt-closed/profile.yml && grep -n opt_end_date /tmp/ml-h1b-fc/persona-opt-closed/profile.yml
21:  opt_end_date: 2026-09-01
[exit 0]
$ python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --persona-dir /tmp/ml-h1b-fc/persona-opt-closed --out /tmp/ml-h1b-fc/6b
built 183 roles from 1557 H-1B rows (30369 in CSV); skipped: unparseable-titles 0, no-approval-rate 0
tiers {'Proven': 134, 'Likely': 49, 'Unknown': 0}; fit > 0 on 173/183; usable days 0 as of 2026-09-30
  /tmp/ml-h1b-fc/6b/roles.json  +  /tmp/ml-h1b-fc/6b/build-audit.json
[exit 0]
$ npm run score -- /tmp/ml-h1b-fc/6b/roles.json --out-dir /tmp/ml-h1b-fc/6b

> the-reallocation-engine@1.0.0 score
> node scripts/score/role-scorer.mjs /tmp/ml-h1b-fc/6b/roles.json --out-dir /tmp/ml-h1b-fc/6b

✓ scored 183 roles → Apply 0 · Consider 0 · Skip 183 (skip 100%)
  ../../../../../../../tmp/ml-h1b-fc/6b/role-scores.json  +  ../../../../../../../tmp/ml-h1b-fc/6b/role-scores.md
[exit 0]
$ python3 -c "import json,collections; r=json.load(open('/tmp/ml-h1b-fc/6b/roles.json')); s=json.load(open('/tmp/ml-h1b-fc/6b/role-scores.json'))['roles']; print('timeline factors:', dict(collections.Counter(x['timeline']['factor'] for x in r))); print('recommendations:', dict(collections.Counter(x['recommendation'] for x in s))); print('reasons:', dict(collections.Counter(x['reason'] for x in s)))"
timeline factors: {0.0: 183}
recommendations: {'Skip': 183}
reasons: {'gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes)': 183}
[exit 0]
````

### 6c. Live network call without approval

The build was run with Python's socket functions replaced by ones that raise
an error, so any network access would crash it. Expected: it completes
anyway, every role is labelled as not liveness-checked, and gate 3's test
reports the approval as still open (it prints the open TODO line, because no
approval record exists).

````text
$ python3 -c "import socket,runpy,sys
def blocked(*a,**k): raise RuntimeError('network access attempted')
socket.socket=blocked; socket.create_connection=blocked; socket.getaddrinfo=blocked
sys.argv=['build_roles.py','--out','/tmp/ml-h1b-fc/6c']
runpy.run_path('scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py', run_name='__main__')"
built 183 roles from 1557 H-1B rows (30369 in CSV); skipped: unparseable-titles 0, no-approval-rate 0
tiers {'Proven': 134, 'Likely': 49, 'Unknown': 0}; fit > 0 on 173/183; usable days 36 as of 2026-09-30
  /tmp/ml-h1b-fc/6c/roles.json  +  /tmp/ml-h1b-fc/6c/build-audit.json
[exit 0]
$ python3 -c "import json,collections; r=json.load(open('/tmp/ml-h1b-fc/6c/roles.json')); print('liveness_checked:', dict(collections.Counter(x['liveness_checked'] for x in r))); print('liveness_method:', dict(collections.Counter(x['liveness_method'] for x in r)))"
liveness_checked: {False: 183}
liveness_method: {'not run — requires live-network approval': 183}
[exit 0]
$ grep -rlF 'live-network approval: granted' logs/runs --include='2026fa-omraut888-*.md' || grep -E 'TODO[:] APPROVE[]]' recipes/cases/2026fa/omraut888-ml-h1b-timeline.md
| Live-network approval record | Markdown | A `logs/runs/2026fa-omraut888-<n>.md` entry granting ATS-detection approval; [TODO: APPROVE] no approval has been requested or granted. | Yes for live mode |
[exit 0]
````

## 7. npm run doctor (after)

````text
$ npm run doctor

> the-reallocation-engine@1.0.0 doctor
> node scripts/doctor.mjs

RECIPE DOCTOR — The Reallocation Engine
==========================================

ENVIRONMENT (required)
  ✓ node       v22.14.0
  ✓ python3    Python 3.11.15

ENVIRONMENT (optional — features degrade without these)
  — pandoc     not found (resume/PDF rendering)
  — libreoffice not found (PDF fallback)
  ✓ playwright installed

RUNNABLE COMMANDS (npm script → target file present?)
  ✓ verify         scripts/conformance.mjs
  ✓ manifest-check scripts/manifest-check.mjs
  ✓ eval:score     scripts/eval/score-run.mjs
  ✓ eval:report    scripts/eval/report.mjs
  ✓ doctor         scripts/doctor.mjs
  ✓ bls:local-wage scripts/bls/local-wage-adjustment.py
  ✓ build-instructions scripts/build-instructions.mjs
  ✓ to-markdown    scripts/to-markdown.mjs
  ✓ score          scripts/score/role-scorer.mjs
  ✓ score:gates    scripts/score/gate-harness.mjs
  ✓ ats:dedup      scripts/ats/dedup-tracker.mjs
  ✓ ats:liveness   scripts/ats/check-liveness.mjs
  ✓ ats:merge      scripts/ats/merge-tracker.mjs
  ✓ ats:normalize  scripts/ats/normalize-statuses.mjs
  ✓ ats:scan       scripts/ats/scan.mjs
  ✓ ats:verify     scripts/ats/verify-pipeline.mjs
  ✓ resumes:pdf    scripts/resumes/generate-pdf.mjs
  ✓ svg-to-png     scripts/svg-to-png.mjs
  ✓ audit:layout   scripts/svg-layout-audit.mjs
  ✓ postsvg-to-png scripts/svg-layout-audit.mjs
  ✓ skill-demand   scripts/score/skill-demand-monitor.mjs
  ✓ skill-demand:test scripts/score/skill-demand-monitor.test.mjs
  ✓ fetch-postings scripts/ats/fetch-real-postings.py
  ✓ pii-scan       scripts/pii-scan.mjs

DOMAIN DIRECTORIES
  ✓ data/sec
  ✓ data/bls
  ✓ data/ats
  ✓ data/80-days-to-stay
  ✓ scripts/sec
  ✓ scripts/bls
  ✓ scripts/ats
  ✓ scripts/resumes

PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked

RECIPES (33)
  with lifecycle frontmatter: 33   missing: 0
  by status: DRAFT 28 · RUNNABLE-SAMPLE 4 · RUNNABLE-LIVE  # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED 1
  open TODOs: 318 declared (in frontmatter) · 318 [TODO markers in bodies

SUMMARY
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
[exit 0]
````

## 8. npm run verify (after)

````text
$ npm run verify

> the-reallocation-engine@1.0.0 verify
> node scripts/conformance.mjs && node scripts/manifest-check.mjs

conformance: 163 files (88 md · 38 py · 30 js · 4 sh · 3 json)
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
[exit 0]
````

Steps 7 and 8 are byte-for-byte identical to steps 1 and 2.

## 9. What changed

````text
$ git diff --stat
[exit 0]
$ git status --short
[exit 0]
$ git diff --stat origin/main...HEAD
 .../2026fa/submissions/omraut888/CHANGE-BRIEF.md   | 243 +++++++++++++++++++++
 .../cases/2026fa/omraut888-ml-h1b-timeline.card.md |  86 ++++++++
 recipes/cases/2026fa/omraut888-ml-h1b-timeline.md  | 122 +++++++++++
 .../2026fa/omraut888-ml-h1b-timeline/README.md     |  35 +++
 .../omraut888-ml-h1b-timeline/build_roles.py       | 224 +++++++++++++++++++
 .../fixtures/sponsorship-sample.csv                |   7 +
 .../omraut888-ml-h1b-timeline/test_build_roles.py  | 149 +++++++++++++
 7 files changed, 866 insertions(+)
[exit 0]
$ git diff --name-only origin/main...HEAD | grep -vE '^(scripts/contrib/2026fa/omraut888-ml-h1b-timeline/|course/2026fa/submissions/omraut888/)'
recipes/cases/2026fa/omraut888-ml-h1b-timeline.card.md
recipes/cases/2026fa/omraut888-ml-h1b-timeline.md
[exit 0]
$ git status --short --ignored | grep '^!!'
!! instructions/.build/
!! node_modules/
!! scripts/__pycache__/
!! scripts/ats/__pycache__/
!! scripts/ats/scrapers/__pycache__/
!! scripts/ats/scrapers/common/__pycache__/
!! scripts/ats/scrapers/greenhouse/__pycache__/
!! scripts/ats/scrapers/lever/__pycache__/
!! scripts/ats/scrapers/workday/__pycache__/
!! scripts/bls/__pycache__/
!! scripts/contrib/2026fa/omraut888-ml-h1b-timeline/__pycache__/
!! scripts/sec/__pycache__/
[exit 0]
````

- **The test run changed no tracked file.** `git diff --stat` and
  `git status --short` are both empty. The only files it left behind are
  gitignored caches (`instructions/.build/` from verify, `__pycache__/` from
  conformance compiling Python, `node_modules/` from install).
- **The branch adds 7 files in 3 contributor paths, not 2.**
  `recipes/cases/2026fa/omraut888-ml-h1b-timeline.md` and `.card.md` are
  outside `scripts/contrib/2026fa/omraut888-ml-h1b-timeline/` and
  `course/2026fa/submissions/omraut888/`. CONTRIBUTING places recipe and card
  pairs in `recipes/cases/<term>/`, and CI's contrib-scope allowlist accepts
  that path. No maintained file is touched.
