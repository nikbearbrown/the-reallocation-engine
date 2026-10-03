# TEST-REPORT — fin-dataeng-stemopt prototype, clean checkout

## Executive summary

This report shows that the prototype runs from a fresh copy of the submitted branch, with
nothing carried over from the working folder, and that it produces the same results as the
committed run. A brand-new clone of commit `2e1a802` was installed and tested from scratch.
The toolchain checks passed. The triage command reproduced the committed report exactly; only
the timestamp changed. All 18 offline tests passed. Every changed file sits inside the
student's own folders, and the privacy scan that CI runs on pull requests came back clean. The
report ends with what the tool cannot judge, which a person still has to.

## Run record

| Item | Value |
|---|---|
| Date | 2026-10-01 |
| Commit tested | `2e1a802` on `contrib/2026fa-Arc-211-fin-dataeng-stemopt` (3 commits ahead of upstream `main`) |
| How | `git clone --branch contrib/2026fa-Arc-211-fin-dataeng-stemopt --single-branch <local repo> <fresh temp dir>`, then everything below run in that directory. There was no `node_modules` before `npm install`. |
| Upstream compared against | `https://github.com/nikbearbrown/the-reallocation-engine.git` `main`, fetched into the clean clone |
| Environment | macOS arm64, Node v23.2.0, Python 3.12.7 (CI uses Node 20, which was not tested locally) |
| Clone source caveat | cloned from the **local** repository, because the branch is not pushed yet. It contains exactly the committed tree, but it is not yet a clone from GitHub. |
| Raw output | `runs/clean-checkout/01-npm-install.txt` … `10-git-status.txt` |

## 1. Toolchain baseline: before and after

| Check | Before (fresh clone of `main`, first setup) | After (clean clone of `2e1a802`) |
|---|---|---|
| `npm run doctor` | exit 0; environment ✓ runnable; privacy ✓ no private/PII paths tracked (`runs/baseline-doctor.txt`) | exit 0; environment ✓ runnable; privacy ✓ no private/PII paths tracked (`runs/clean-checkout/02-doctor.txt`) |
| `npm run verify` | `conformance: 158 files` ✓ all conform; manifest passed (3 warnings) (`runs/baseline-verify.txt`) | `conformance: 168 files` ✓ all conform; manifest passed (3 warnings, the same three) (`runs/clean-checkout/03-verify.txt`) |

The 3 manifest warnings exist on `main` and are unchanged: `archive/` not in `.gitignore`, and
`private/` and `data/ats/` "not gitignored". The last two are false alarms. `git check-ignore`
confirms both are ignored; the `.gitignore` writes them as `/private/*` and `/data/ats/*`.

An earlier doctor run on the first clone printed `not a git repo (skipped)` under PRIVACY. The
cause was an Intel-only `git` binary on this Mac, not the repo. It was fixed by putting
`/usr/bin/git` first on PATH. The saved output of that failing run
(`baseline-doctor-intel-git.txt`) was lost when the first clone was deleted; only this
description remains.

## 2. The real sample run

```
$ node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs --as-of 2026-10-01
✓ triage 2026-10-01: 13 evaluated → tailor-application 3 · verify-everify-then-tailor 0 · review-role-fit 1 · network-into-company 0 · check-posting-by-hand 8 · research-sponsorship 0 · not-in-data 1 · skip 0
  timeline factor 1 (offer lands before OPT starts — no unemployment days used)
  course/2026fa/submissions/Arc-211/runs/triage/triage-log.json  +  course/2026fa/submissions/Arc-211/runs/triage/triage-report.md
exit 0
```

**Reproducibility.** After the run, `git diff` in the clean clone showed `triage-report.md`,
`roles.json` and `role-scores.json` **identical** to the committed versions. The only change
in `triage-log.json` was the timestamp:

```
-  "generated": "2026-10-01T21:04:21.947Z",
+  "generated": "2026-10-01T21:13:18.668Z",
```

## 3. Offline tests

```
$ node --test scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.test.mjs
ℹ tests 18
ℹ pass 18
ℹ fail 0
```

The tests make no network calls. They use fixtures in
`scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/fixtures/` (fictional companies, plus two
BLS rows copied verbatim), and scoring is done by the shipped `scripts/score/role-scorer.mjs`,
not a copy. A mutation check during development (disabling the unchecked-liveness rule made the
F3 test fail) is recorded in `worked-run.md`.

## 4. Each failure case exercised

| Case (from CHANGE-BRIEF) | How it was exercised | Observed |
|---|---|---|
| F1 company not in CSV | test `F1 + F2 with named candidates`; real run (JPMorgan Chase); break `typo-company` | `not-found` / `not-in-data`; no sponsorship value emitted |
| F2 blank H-1B fields | tests `F2 + F6 in auto mode` and `F1 + F2…` | counted (2,391 in the real run), never scored, never zero |
| F3 missing liveness | test `F3: a role with no liveness record is NOT sent to the scorer` | held at `check-posting-by-hand`; every role in `roles.json` has an explicit factor |
| F4 OPT window closed | test `F4…`; break `after-deadline` (`--as-of 2027-03-01`) | timeline 0 → 4 gated Skips, and the 8 unchecked companies skipped too (after the fix) |
| F5 SOC with no BLS row | test `F5: …flagged missing`; test `F5 (all missing)`; break `soc-typo` (`15-1243.10`) | single missing → flagged, no value; all missing → exit 3 |
| F6 fintech labeled "Other Technology" | test `F2 + F6 in auto mode` (fixture `EXAMPLE CLOUD INC`) | excluded by the industry filter; a known blind spot, documented in the recipe |
| G1 missing input | test `G1…`; break `missing-input` | exit 2, nothing written; repo-relative path in the message |

## 5. Scope: `git diff --stat` against upstream `main`

```
$ git diff --stat FETCH_HEAD...HEAD
 course/2026fa/submissions/Arc-211/CHANGE-BRIEF.md  |  184 +++
 .../submissions/Arc-211/domain-justification.md    |   83 ++
 .../2026fa/submissions/Arc-211/inputs/everify.json |   48 +
 .../submissions/Arc-211/inputs/liveness.json       |   37 +
 .../submissions/Arc-211/runs/baseline-doctor.txt   |   64 +
 .../submissions/Arc-211/runs/baseline-verify.txt   |   15 +
 .../Arc-211/runs/breaks/after-deadline.txt         |    5 +
 .../runs/breaks/after-deadline/role-scores.json    |  188 +++
 .../runs/breaks/after-deadline/role-scores.md      |   14 +
 .../Arc-211/runs/breaks/after-deadline/roles.json  |   90 ++
 .../runs/breaks/after-deadline/triage-log.json     | 1303 ++++++++++++++++++++
 .../runs/breaks/after-deadline/triage-report.md    |   81 ++
 .../Arc-211/runs/breaks/missing-input.config.json  |   58 +
 .../Arc-211/runs/breaks/missing-input.txt          |    3 +
 .../Arc-211/runs/breaks/soc-typo.config.json       |   55 +
 .../submissions/Arc-211/runs/breaks/soc-typo.txt   |    3 +
 .../Arc-211/runs/breaks/typo-company.config.json   |   59 +
 .../Arc-211/runs/breaks/typo-company.txt           |    5 +
 .../runs/breaks/typo-company/role-scores.json      |   59 +
 .../runs/breaks/typo-company/role-scores.md        |   11 +
 .../Arc-211/runs/breaks/typo-company/roles.json    |   21 +
 .../runs/breaks/typo-company/triage-log.json       |  216 ++++
 .../runs/breaks/typo-company/triage-report.md      |   48 +
 .../submissions/Arc-211/runs/example-score.txt     |    6 +
 .../Arc-211/runs/liveness-2026-10-01.txt           |   15 +
 .../Arc-211/runs/liveness-2026-10-01b.txt          |   11 +
 .../Arc-211/runs/liveness-2026-10-01c.txt          |   10 +
 .../submissions/Arc-211/runs/role-scores.json      |  241 ++++
 .../2026fa/submissions/Arc-211/runs/role-scores.md |   15 +
 .../submissions/Arc-211/runs/test-2026-10-01.txt   |   22 +
 .../Arc-211/runs/triage-run-2026-10-01.txt         |    3 +
 .../Arc-211/runs/triage/role-scores.json           |  188 +++
 .../submissions/Arc-211/runs/triage/role-scores.md |   14 +
 .../submissions/Arc-211/runs/triage/roles.json     |   90 ++
 .../Arc-211/runs/triage/triage-log.json            | 1303 ++++++++++++++++++++
 .../Arc-211/runs/triage/triage-report.md           |   81 ++
 course/2026fa/submissions/Arc-211/worked-run.md    |  227 ++++
 logs/runs/2026fa-Arc-211-1.md                      |   19 +
 .../2026fa/Arc-211-fin-dataeng-stemopt.card.md     |   82 ++
 .../cases/2026fa/Arc-211-fin-dataeng-stemopt.md    |  223 ++++
 .../2026fa/Arc-211-fin-dataeng-stemopt/README.md   |   71 ++
 .../2026fa/Arc-211-fin-dataeng-stemopt/config.json |   58 +
 .../Arc-211-fin-dataeng-stemopt/fixtures/bls.csv   |    3 +
 .../fixtures/companies.csv                         |    7 +
 .../fixtures/config.fixture.json                   |   29 +
 .../fixtures/everify.json                          |    3 +
 .../fixtures/formd/companies-fixture-d.sample.json |    6 +
 .../fixtures/liveness.json                         |    4 +
 .../2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs  |  309 +++++
 .../Arc-211-fin-dataeng-stemopt/triage.test.mjs    |  174 +++
 50 files changed, 5864 insertions(+)
```

Checked separately: the number of files outside `scripts/contrib/2026fa/Arc-211-…`,
`recipes/cases/2026fa/Arc-211-…`, `logs/runs/2026fa-Arc-211-…` and
`course/2026fa/submissions/Arc-211/` is **none**. The number of protected paths touched
(`logs/RUN_LOG.md`, `SNICKERDOODLE.md`, `DOMAIN.md`, `DATA_CONTRACT.md`, `package.json`,
`.github/`, `AGENTS.md`, `CLAUDE.md`) is **none**. All 3 commits are authored with the GitHub
noreply address.

## 6. Privacy

| Command | Result |
|---|---|
| `node scripts/pii-scan.mjs --diff FETCH_HEAD` (what CI runs on PRs) | `pii-scan: clean ✓` |
| `node scripts/pii-scan.mjs` (whole working tree) | 1 finding, `[email] package-lock.json — [npm-maintainer-email-redacted]`. This is **pre-existing on `main`**: an npm maintainer's address inside a deprecation notice. The branch's `package-lock.json` is identical to `main`. |
| `npm run doctor` privacy check | ✓ no private/PII paths are tracked |
| grep for the student's name, email, phone, SEVIS ID, or local folder paths in all committed files | none found |

**Redaction note.** The maintainer's address is replaced with `[npm-maintainer-email-redacted]`
in this report and in the saved `runs/clean-checkout/01-npm-install.txt` and `07-pii-scan.txt`.
Committing it verbatim made the scan flag those files. That was caught before commit, on
2026-10-01. The rest of each saved output is unaltered.

## 7. Side effects observed in the clean clone

`git status` after the runs showed two modified files. Neither is committed:
- `course/2026fa/submissions/Arc-211/runs/triage/triage-log.json`: the timestamp only (see §2).
- `package-lock.json`: `npm install` on this npm version strips 36 `libc` lines. This is an
  environment effect, not a change to the branch, and it was restored with
  `git checkout -- package-lock.json` in the working copy each time.

## 8. What the gates require a human to judge

The script cannot decide these; it only labels them:
- **G2 liveness.** Whether the posting is really open. The checker was wrong twice in this run:
  a search page reported "expired", and a live Workday posting reported "expired". Someone has to
  open the page.
- **Posting relevance and seniority.** Whether "Senior Data Engineer" (Gemini) or "Senior Data
  Analyst" (Green Dot) is realistic for a December 2026 graduate. Nothing checks this.
- **G4 E-Verify.** Which of several enrolled entities would actually employ the student (SoFi has
  four; one Remitly account is terminated). The student confirms this at offer time and on the I-983.
- **G5 release.** Whether to apply, network, or skip. The student applied to all four, overriding
  `review-role-fit` for SoFi with a stated reason, recorded in `logs/runs/2026fa-Arc-211-1.md`.
- **The visa rules themselves.** The filing window, unemployment days and STEM eligibility are
  your-input as the student understands them. They must be confirmed with the school's
  international office.

## 9. Addendum (2026-10-02): re-test from a clone of GitHub

This closes the "cloned from local" caveat above. After the branch was pushed, it was cloned
fresh **from GitHub** (`git clone --branch contrib/2026fa-Arc-211-fin-dataeng-stemopt
https://github.com/Arc-211/the-reallocation-engine.git`) at commit `e7119c0`, and the same checks
were run. Raw output is in `runs/github-clone/`; the npm maintainer email is redacted, as in §6.

| Check | Result |
|---|---|
| `npm install` → `npm run doctor` | exit 0; ✓ no private/PII paths are tracked |
| `npm run verify` | ✓ all conform; manifest passed (3 warnings, unchanged) |
| `node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs --as-of 2026-10-01` | exit 0; 13 evaluated → tailor-application 3 · review-role-fit 1 · check-posting-by-hand 8 · not-in-data 1 |
| `node --test scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.test.mjs` | 18 pass, 0 fail |
| `node scripts/pii-scan.mjs --diff <upstream main>` | `pii-scan: clean ✓` |
| `triage-report.md`, `roles.json` vs commit | identical |
| Changed files vs upstream `main` | 63, all inside the student's namespaces |
