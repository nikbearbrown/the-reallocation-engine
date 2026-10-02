# TEST-REPORT — em-network-targets

## Executive summary

This report records how the prototype was tested: the repository's own health checks before and after the change, the real sample run, each failure case deliberately triggered, the scope of the change, and what a person still has to judge. Everything the repository checks by machine passed, and nothing that passed before the change fails after it. The one privacy-scan finding is in a file the change does not touch and was there before it. Two things are not machine-checkable and are left for the student: whether the visa path exists, and whether two flagged sponsorship records belong to the companies they name.

## Environment

- Windows 11 · Node v22.12.0 · Python 3.12.5 · Git Bash. Commands run from the repository root.
- **Outside the repository, needed on this machine only:**
  - a `python3` shim (Windows' `python3` is a Microsoft Store stub);
  - Git's `bash` on PATH for the `.sh` checks;
  - the clone checked out with LF line endings (`core.autocrlf=false`).
- **Without these, a fresh Windows clone looks broken:**
  - `verify` fails E3 on all six adapters;
  - `doctor` reports 0 of 33 recipes with frontmatter, because its parser rejects a line ending in `\r`.

  CI runs on Linux and is unaffected.
- **PowerShell drops `--out-dir`.** `npm run score -- … --out-dir …` loses the flag there, so the scorer is called as `node scripts/score/role-scorer.mjs …`.

## Toolchain baseline — before and after

**Before** = an untouched worktree of upstream `origin/main` (`015843d`), i.e. this branch before any change, same machine, same shims (`evidence/toolchain-before-*.txt`). **After** = this branch at `c84c764` (`evidence/toolchain-after-*.txt`; first captured at `34b0c7a` and re-captured after the OPT-date correction, with the same results).

`npm run doctor` — **identical before and after** (diff of the two outputs is empty apart from the header line). After:

```text
ENVIRONMENT (required)
  ✓ node       v22.12.0
  ✓ python3    Python 3.12.5

ENVIRONMENT (optional — features degrade without these)
  — pandoc     not found (resume/PDF rendering)
  — libreoffice not found (PDF fallback)
  ✓ playwright installed

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
exit: 0
```

`doctor` reads only top-level `recipes/*.md`, so it **does not check this case recipe** (`recipes/cases/2026fa/…`). Its frontmatter was checked separately, using doctor's own parsing logic and a YAML parser: `todos_open: 6` matches the six `[TODO` markers in the body. Doctor also mis-reads one upstream recipe's status (the `RUNNABLE-LIVE  # …` above) because it doesn't strip trailing YAML comments. That is an upstream issue; this recipe keeps its comments on their own lines.

`npm run verify` — before:

```text
conformance: 158 files (85 md · 36 py · 30 js · 4 sh · 3 json)
✓ all conform (machine half of P4). Adequacy is still the human gate.
...
✓ manifest check passed (3 warnings)
exit: 0
```

after (the only difference is the file count — the 14 added conformance-checked files are this contribution's):

```text
$ npm run verify

> the-reallocation-engine@1.0.0 verify
> node scripts/conformance.mjs && node scripts/manifest-check.mjs

conformance: 172 files (88 md · 36 py · 32 js · 11 json · 1 yaml · 4 sh)
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
exit: 0
```

The three warnings are upstream and unchanged. The W2 lines are a pattern mismatch: `.gitignore` uses `/private/*` and `/data/ats/*`, and `git check-ignore -v private/x.txt data/ats/x.txt` confirms that files inside both folders are ignored.

Conformance on this contribution alone:

```text
$ node scripts/conformance.mjs recipes/cases/2026fa scripts/contrib/2026fa/contactshyam14-code-em-network-targets course/2026fa/submissions/contactshyam14-code logs/runs/2026fa-contactshyam14-code-1.md
conformance: 43 files (17 md · 21 json · 1 yaml · 3 js · 1 py)
✓ all conform (machine half of P4). Adequacy is still the human gate.
exit: 0
```

## Privacy scan

```text
$ node scripts/pii-scan.mjs
pii-scan: 1 finding(s) — see DATA_CONTRACT.md §Zero-Conditions

  [email] package-lock.json — <flagged address, redacted>

If a finding is a false positive (fictional data outside the sanctioned dirs),
move it under search/examples/ or resumes/ rather than allowlisting it here.
exit: 1

$ node scripts/pii-scan.mjs --diff origin/main
pii-scan: clean ✓
exit: 0
$ git diff --quiet origin/main -- package-lock.json && echo "package-lock.json unchanged vs origin/main"
package-lock.json unchanged vs origin/main
$ git grep -c "<flagged address, redacted>" origin/main -- package-lock.json
origin/main:package-lock.json:1
```

The working-tree finding is a package author's address inside an npm deprecation notice in upstream's `package-lock.json`. This branch does not modify that file. The address is redacted in this report: the first version pasted it verbatim, which re-created the finding inside this branch and failed the branch-history scan. That local commit was amended before anything was pushed (FRICTIONAL entry 16). The branch-history scan, which covers every line this branch commits, is clean.

**Other privacy checks:**
- No committed file contains a Windows user path. The search was confirmed to work by checking it against a known string first.
- Commits use the GitHub no-reply address, not a personal email.
- The persona has no résumé, contact details, or real email (`shyam@example.com`).
- Fixtures are fictional companies on `example.com`, with the phone and officer columns empty.

## Tests (offline, fixtures only, no network)

```text
$ node --test scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.test.mjs
ok 1 - happy path: buckets come from the real scorer, not from this tool
ok 2 - roles.json never omits a gate, and held companies are never scored
ok 3 - every evidence value carries one of the three labels
ok 4 - record values are copied from the CSV, not computed or rounded
ok 5 - a tier explanation names only the condition that actually failed
ok 6 - liveness label follows who observed it and whether the board is confirmed
ok 7 - a person confirming a board makes its liveness your-input — not record, not model-judgment
ok 8 - F1: OPT end already past → exit 3, nothing written
ok 9 - OPT not started yet: start reported, unemployment counted from the start, not from today
ok 10 - an OPT start on or after the OPT end → exit 3, nothing written
ok 11 - F2: SOC code with no row → exit 3, names the code, nothing written
ok 12 - F3: liveness observations that match no candidate are reported, never invented
ok 13 - F6: CSV missing a required column → exit 3, nothing written
ok 14 - a stale or failed liveness check holds the company instead of closing it
ok 15 - companies sharing an identical H-1B record are flagged for an identity check
ok 16 - BLS vocabulary: primary O*NET row by default; "all" pulls in QA titles
ok 17 - parity check is computed from the file, not hardcoded
ok 18 - out-dir outside this contribution is refused, nothing written
ok 19 - out-dir guard holds even when the repository itself sits inside the OS temp dir
ok 20 - nothing checked yet → scorer is not run (no empty, NaN-rate report)
ok 21 - upstream characterization: the scorer treats a MISSING liveness gate as open
# tests 21
# pass 21
# fail 0
```

**Do the tests catch bugs?** Three bugs were injected into the prototype one at a time (`evidence/mutation-tests-2026-10-01.txt`, run against the 16-test suite of the time):

| Mutation | Tests that failed |
|---|---|
| M1: treat a missing liveness check as open | 3 |
| M2: label the tier as a record | 1 |
| M3: disable the output-folder guard | 1 |

With the guard off, M3 actually wrote five files into `data/examples/`, which broke the next clean run. Those files were moved out of the repository, and the test now uses a unique folder and cleans up after itself. Re-running M3 left no residue.

**The Canvas ZIP, unzipped and tested — and what it caught.** The first ZIP (built with `git archive` from PR head `5d9fca2`) was unzipped into the Windows temp folder and the tests were run inside it: **18 of 19 passed**. The output-folder test failed. With the repository *inside* the temp folder, the guard's "anything under the OS temp dir is allowed" rule (meant for the tests' scratch folders) also allowed `data/examples/` inside that repository. A grader unzipping the submission under %TEMP% could have had tracked files overwritten. The hardened test cleaned up after itself, so nothing was left behind. **Fix:** inside the repository only the two namespaces are allowed, wherever the repository lives; the temp allowance applies only to paths outside it. A new test rebuilds the condition (a copy of the tool and scorer inside a fake repository under the temp folder). It fails on the old guard and passes on the new one, and the full suite is 20 of 20. The rebuilt ZIP was re-tested the same way (result in SUBMISSION.md, which travels with the ZIP).

**Clean checkout:** a separate worktree of commit `a309e8c`, after `npm ci`. The tests passed, and the documented command reproduced run 03 except the `generated_at` timestamp.

## The real sample run

```text
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-01 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-01.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/03-scored
✓ 57 candidates from 1557 H-1B rows (13-1082: 55, 11-3051: 2)
  network 4 · apply 1 · check-liveness 52 · skip 0
  scorer: ✓ scored 5 roles → Apply 1 · Consider 0 · Skip 4 (skip 80%)
  ! parity: all 1557 approval and denial counts are even — counts probably doubled upstream
  ! identity check needed: CONVEY INC, COVEY INC, LYNDRA THERAPEUTICS INC, LYRA THERAPEUTICS INC, SALESFORCE COM INC, SALESFORCECOM INC
  gate G4 visa-path: awaiting human sign-off
  wrote course/2026fa/submissions/contactshyam14-code/runs/03-scored/network-targets.json + network-targets.md + roles.json + role-scores.json/.md
```

**Run 05 — the same run with the corrected OPT dates** (2026-10-02: December 2026 is the OPT *start*, not the end; see WORKED-RUN §7). Every company lands in the same group, with the same tier:

```text
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-02 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-01.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/05-corrected-opt-dates
✓ 57 candidates from 1557 H-1B rows (13-1082: 55, 11-3051: 2)
  network 4 · apply 1 · check-liveness 52 · skip 0
  scorer: ✓ scored 5 roles → Apply 1 · Consider 0 · Skip 4 (skip 80%)
  OPT window: 2026-12-31 → 2027-12-30 (starts in 90 days); 180 days available; timeline factor apply 1, network 1
  ! parity: all 1557 approval and denial counts are even — counts probably doubled upstream
  ! identity check needed: CONVEY INC, COVEY INC, LYNDRA THERAPEUTICS INC, LYRA THERAPEUTICS INC, SALESFORCE COM INC, SALESFORCECOM INC
  gate G4 visa-path: awaiting human sign-off
  wrote course/2026fa/submissions/contactshyam14-code/runs/05-corrected-opt-dates/network-targets.json + network-targets.md + roles.json + role-scores.json/.md
```

**Cross-check of run 03 against the CSV** with an independent parser (Python's `csv` module): **30 of 30** values matched. Full output is in `evidence/cross-check-2026-10-01.txt`, with run 05 also 30 of 30 in `evidence/cross-check-2026-10-02.txt`; the inputs, the scanner output, and the scorer's report are in WORKED-RUN.md.

## Each failure case, exercised on the real data

Full output: `evidence/failure-cases-2026-10-01.txt` (earlier persona; pasted in WORKED-RUN §5), and `evidence/failure-cases-2026-10-02.txt` (corrected persona; F1, F2, F6 and the out-dir case re-run, same results).

| Case | Command difference | Output | Exit | Written? |
|---|---|---|---|---|
| F1 OPT end already past | `--as-of 2028-01-15` (corrected persona) | `STOP (G1): OPT end date 2027-12-30 is on or before the as-of date — refusing to score a window that has already closed` | 3 | no |
| OPT start not before the end | persona with start 2028-01-01, end 2027-12-30 (test 10) | `STOP (G1): persona: visa.opt_start_date 2028-01-01 must be before visa.opt_end_date 2027-12-30` | 3 | no |
| F2 SOC code with no row | persona with 13-1028 | `STOP (G1): SOC code 13-1028 has no row in data/bls/compact/soc_occupation_compact.csv — refusing to guess a title list for it` | 3 | no |
| F3 observation for a company not in the CSV / not a candidate | `fixtures/break-liveness-unmatched.json` | `! liveness observations with no candidate: Quillfeather Assembly Works (not in the company CSV); 1LIFE HEALTHCARE INC (in the CSV but not a candidate …)` | 0 | yes; nothing invented |
| F4 board check fails | Zero Motorcycles slug in run 03 | held: `result "unchecked" is not a usable liveness result` | 0 | held, not closed |
| F5 no Form D record | every run 03 candidate | `not in shipped sample` (0 of 57 matched the 200 filings) | 0 | reported as absence from the sample |
| F6 missing CSV column | `Approval_Rate` renamed | `STOP (G1): company CSV lacks required column(s) "Approval_Rate": …` | 3 | no |
| Out-dir outside the contribution | `--out-dir data/examples/should-refuse` | `STOP (usage): --out-dir data/examples/should-refuse is outside this contribution's folders; refusing to write there` | 2 | no |
| Scorer on zero roles (prediction 3) | the scorer itself, on `[]` | `✓ scored 0 roles → Apply 0 · Consider 0 · Skip 0 (skip NaN%)` | 0 | the prototype never calls it with zero roles |

## Scope of the change

`git diff --name-only origin/main`, grouped. Every path is inside this contribution's assigned folders. No maintained file is modified, and `logs/RUN_LOG.md` is untouched.

```text
     44 course/2026fa/submissions/contactshyam14-code
      1 logs/runs/2026fa-contactshyam14-code-1.md
      1 recipes/cases/2026fa/contactshyam14-code-em-network-targets.card.md
      1 recipes/cases/2026fa/contactshyam14-code-em-network-targets.md
     15 scripts/contrib/2026fa/contactshyam14-code-em-network-targets
```

(62 files and 35,934 added lines at `c84c764`; nothing deleted or modified upstream. Most of the lines are the machine-readable run logs in `runs/`. The full `git diff --stat origin/main` goes in the PR body.)

## What CI will show on the PR, and why

Upstream's own CI on `main` already fails the **Contrib Gate** workflow, including at `015843d`, the commit this branch starts from (`gh run list` / `gh run view`, read on 2026-10-01):

```text
2026-09-23T20:03  015843d  verify: success
2026-09-23T20:03  015843d  Contrib Gate: failure
2026-09-19T19:52  e1dd0cb  verify: success
2026-09-19T19:52  e1dd0cb  Contrib Gate: failure
--- latest Contrib Gate run on main, per job:
harness-regression: failure
conformance: success
doctor-and-pii: failure
contrib-scope: skipped
```

Both failing jobs fail for reasons outside this contribution, reproduced locally:

- **`harness-regression`** runs six harness scripts, four of which don't exist in the repository: `scripts/test/gate-behavior-harness.mjs`, `scripts/test/fuzz-invariants.mjs`, `scripts/gates/gate-behavior-harness.mjs`, `scripts/score/scorer-harness.mjs`. Each exits 1 here; the two that exist exit 0.
- **`doctor-and-pii`** fails at its working-tree PII step on the upstream `package-lock.json` finding above. Because that step fails first, the job never reaches its **branch-history** PII step. That scan was run locally instead (clean; output above).

**Expected on this PR:**

| Check | Expected result |
|---|---|
| `verify` | pass |
| conformance | pass |
| `contrib-scope` | pass: every path is namespaced; no protected path touched |
| `doctor-and-pii` | fail, as on `main` |
| `harness-regression` | fail, as on `main` |

`.github/` is a protected path for students, so the workflow isn't patched here.

## What the gates require a person to judge

| Gate | What the person judges | State after this run |
|---|---|---|
| G2 Liveness | Is each board really the company's? Is a "nothing matching" reading right? Two of four networking targets (Genies, Senti) rested on boards no record could confirm | **confirmed by Shyam** on 2026-10-02 (opened both boards); their liveness is your-input in run 07 |
| G4 Visa-path sign-off | With the DSO or an attorney: which H-1B registration cycle(s) fall inside an OPT of 2026-12-31 → 2027-12-30, what happens if one isn't selected, and does STEM eligibility, a cap-exempt employer or another status change that? No application is tailored until then | **not signed** |
| G5 Identity | For each flagged candidate: which company owns the shared record? | none of the 5 scored companies is flagged; 6 held candidates are flagged |
| Sample-run adequacy | Has a named person read the report and found it fit for purpose? This sets the recipe's `last_gate` | **signed**: Shyam Gopalakrishnan, 2026-10-02, after re-running the tests and the tool himself (`runs/06-shyam-check`), spot-checking IEX Group against the CSV, and confirming three boards |
