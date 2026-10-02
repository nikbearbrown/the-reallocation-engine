# TEST-REPORT — ml-newgrad-sponsor-match

## Executive summary

**Follow-up:** Codex reran the 36 tests and offline sample successfully on 2026-09-30 UTC. The reviewed real queue now holds all eight postings. The section “Codex rerun” records this later evidence; the original clean-checkout account below is historical. A student rerun has not been recorded. **Update, 2026-10-02:** the student has since re-run the tests, the sample, a break attempt and the CSV comparison in their own terminal; see [Student re-run](#student-re-run).

This report records how the prototype was tested from a clean copy of the branch: the tool checks
before and after, the offline tests, the sample run, every named failure case, deliberate attempts to
break it, the privacy scans, and the exact list of files the branch changes.

Everything behaved as designed:
- 36 offline tests pass on Python 3.12 and 3.9.
- The sample run completes. Each attempt to break it stops with a clear message, and none produces a
  guessed value.
- The branch touches only this contribution's own folders, plus one new fictional persona.
- The privacy scan of the branch's history is clean.

Two things are not clean, and neither comes from this contribution. The working-tree privacy scan fails
on a false positive that ships with the engine. The course's contribution CI check is already failing
on `main`.

**Who ran what.** Every command below was run by Claude Code (AI assistant) on the student's machine,
from a `git worktree` of commit `fe07d1b` on branch `contrib/2026fa-sukethrp-ml-newgrad-sponsor-match`.
That commit was the last code change until `c242aa5`, a test-only robustness fix; the essential checks
were re-run on a clean checkout of `c242aa5` (see *Re-check at c242aa5* below). Other later commits
change documentation only. The student re-runs the commands in
[Student re-run](#student-re-run) and records the result there.

---

## Environment

macOS (Darwin 27), Node v22.11.0, npm 11.16.0, Python 3.12.7 (tests also under the system Python 3.9.6),
PyYAML 6.0.1 (used only by the engine's own conformance script), Playwright Chromium
(`npx playwright install chromium`, needed only for `--live`).

Clean checkout: `git worktree add --detach <tmp> fe07d1b`, with 0 untracked files and no `node_modules`
before `npm install` (`evidence/clean-checkout/00-checkout.txt`).

## Toolchain baseline, before and after

| Check | Before the prototype ran | After every run below |
|---|---|---|
| `npm run doctor` | exit 0 · "environment: ✓ runnable" · 33/33 recipes carry frontmatter | exit 0, identical |
| `npm run verify` | exit 0 · all files conform · manifest check passed (3 warnings that ship with the engine) | exit 0, identical |
| `git status --short` | clean | clean. Every output went to the gitignored `output/` (`evidence/clean-checkout/15-git-status-after.txt`) |

## Offline tests

```
$ python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v
...
Ran 36 tests in 1.475s

OK
```

Also `OK` under Python 3.9.6 (`04b-tests-python39.txt`). No test touches the network: every CLI run sets
`SPONSOR_MATCH_FORBID_NETWORK=1`, and the three live-mode tests replace both network calls with
in-process stubs. The tests fall into these groups:

| Group | Tests | What they check |
|---|---|---|
| `TitleRules` | 5 | ML/AI vs. not ML/AI, seniority markers, level markers (II, L2), exclusions (advocate, success/product/business managers) |
| `EndToEnd` | 15 | one run over 20 fictional roles, one per gate branch. Checks: expected status, hold reason and next action for all 20; held roles never reach the scorer; every scorer term labeled; gates always explicit; evidence-backed liveness labeled `record`; unrated fit dropped and flagged; overrides named as the person's; a chosen row relabels what is read through it; lookalike records held (and shown); personal columns never in any output; executive summary first; held roles counted separately |
| `RunLevelGates` | 7 | wrong source hash; another file without a hash; missing queue fields; persona without `needs_sponsorship`; a profile outside `search/examples/`; writing into engine folders; overwriting committed evidence |
| `BreakAttempts` | 2 | the scorer's "work authorized" parsing voids the run; live mode fetches only named hosts |
| `RedirectPreCheck` | 3 | a board that forwards to an unnamed host is held and never fetched; same-board and named-host redirects proceed |
| `RealDataContract` | 3 | the shipped file matches the pinned SHA-256; 30,369 rows and 1,557 with H-1B fields, as the join audit reports; the company-name rule is the engine's own |
| `RecipeFrontmatter` | 1 | status ≤ RUNNABLE-SAMPLE, `attestation: null`, `todos_open` equals the `[TODO` count in the recipe body |

## The sample run (real repo data, illustrative queue)

```
$ python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py
✓ 11 roles → held 6 · scored 5 (Apply 1 · Consider 3 · Skip 1) · actions CONSIDER 1, NETWORK-FIRST 2, RESOLVE 6, SKIP 1, TAILOR 1
  output/sukethrp-ml-newgrad-sponsor-match/2026-09-30-sample/sponsor-match-report.md  +  output/sukethrp-ml-newgrad-sponsor-match/2026-09-30-sample/sponsor-match-log.json
```

The full report is in `evidence/clean-checkout/06-sample-run-report.md`. It matches the expectation
written in the recipe before this run.

## Each named failure case, exercised

| Failure case (from the change brief) | Exercised by | Observed | Expected |
|---|---|---|---|
| company missing from the file | sample role `r05` (Instacart); live roles `w06`–`w08` (Scale AI, Anthropic, OpenAI); test `t06` | held `no-company-match`, no tier, not scored | same |
| in the file, no H-1B record | sample `r04` (Hugging Face → HUGGING FACE INC), `r06` (Meta → META CO); test `t05` | held `no-h1b-record`, tier Unknown, matched row and city shown | same (Unknown, never Avoid) |
| two rows sharing a normalized name | sample `r08` (Peloton → INC and LLC); test `t07` | held `ambiguous-company-match`, both candidate rows listed, none picked | same |
| posting 404s | sample `r07` (saved 404 page); test `t08` | `classifyLiveness` says expired, so the scorer gets liveness 0.0 and returns Skip "gated" | same |
| "work authorized" free text | `--scorer-profile fixtures/BROKEN-authorization-profile.json` (below) | the scorer weights sponsorship 0 and the run is void (exit 1) | same |
| *not predicted:* a record shared with a lookalike | live `w05` (PathAI / PATHRAI INC); test `t19` | held `shared-h1b-record`, the other company named | added after it was found |
| *not predicted:* a board that redirects off Greenhouse | live `w02` Nextdoor, `w03` Databricks (302 to their own sites); `RedirectPreCheck` | held `redirects-off-allowed-host`, target named, not fetched | added after it was found |

## Deliberate break attempts (CLI, clean checkout)

```
$ python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --scorer-profile scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/fixtures/BROKEN-authorization-profile.json --out-dir output/break-authz
STOP at the scorer-contract gate: the scorer ran as if the persona does not need sponsorship (profile_needs_sponsorship = False), so the sponsorship vote was weighted 0
VOID 11 roles → held 6 · scored 0 (Apply 0 · Consider 0 · Skip 0) · actions
# exit=1
```

```
$ python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --csv data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv --csv-sha256 0000000000000000000000000000000000000000000000000000000000000000 --out-dir output/break-hash
STOP at the source gate: data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv has SHA-256 eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270, not the pinned 0000000000000000000000000000000000000000000000000000000000000000. The audits no longer describe this file. Read its audit, then pin the new hash on purpose (--csv-sha256) if you accept it.
# exit=2
```

```
$ python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --persona private/README.md --out-dir output/break-persona
STOP at the input gate: persona private/README.md is not a fictional persona under search/examples/. This prototype never reads real profiles.
# exit=2
```

```
$ python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --out-dir data/examples/should-not-exist
STOP at the input gate: --out-dir data/examples/should-not-exist/ is outside this contribution's folders (output/, course/2026fa/submissions/sukethrp/, scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/)
# exit=2
```

## Scope: `git diff --stat` against upstream `main`

At the submitted branch tip, the diff has 120 files, all new (`git diff --name-status` shows `A` for every
one). They sit under this contribution's namespaces, plus one sanctioned persona:

| Area | Files |
|---|---|
| `course/2026fa/submissions/sukethrp/` (documents and evidence) | 101 |
| `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/` (prototype, tests, fixtures) | 14 |
| `recipes/cases/2026fa/` (recipe and card) | 2 |
| `logs/runs/` (`2026fa-sukethrp-1.md`, `2026fa-sukethrp-2.md`) | 2 |
| `search/examples/arjun-rao/profile.yml`, a new fictional persona | 1 |

`DATA_CONTRACT.md` allows adding a persona under `search/examples/`, and the CI scope gate allowlists that
path. No existing engine file is changed, and `logs/RUN_LOG.md` is not touched. The pull request's file
list shows the same set.

The first clean-checkout capture, at `fe07d1b`, had 33 files (`evidence/clean-checkout/16-diff-stat.txt`,
`16b-diff-names.txt`). Later commits added documents and evidence under the submission folder and
`logs/runs/`. They also edited the recipe, the card, the prototype README and the test file, all inside the
same namespaces.

## Privacy scans

| Scan | Result | Why |
|---|---|---|
| `node scripts/pii-scan.mjs --diff upstream/main` (the whole branch history, what CI runs on a PR) | `pii-scan: clean ✓` (exit 0) | |
| `node scripts/pii-scan.mjs` (working tree) | exit 1, one finding: `[email] package-lock.json` | npm's deprecation text for `glob` contains a maintainer's contact address. It ships with the engine, `main` fails the same way, and this branch does not touch `package-lock.json` (defect D5 in `PROPOSED-ADDITIONS.md`) |

The captured evidence files redact that address so that they do not trip the scanner themselves.

## What the gates leave for a person

- **Rules:** read the rules audit (`evidence/rules-audit-v0.2.0/rules-audit.md`) and confirm what counts
  as ML/AI, senior, and level-marked. Rules v0.2.0, and especially the II/L2 rule, were drafted by Claude.
  The student kept all three choices on 2026-10-02 (`SOURCES.md`).
- **Held roles:** each one names a single check. Examples: open a posting that redirects, choose a row
  when names collide, check public H-1B/LCA records when the record is missing or shared.
- **The decision table (G8):** a decision, a reason, a name and a date for every role before any effort
  is spent. The prototype never makes these decisions.

## Broke during testing, fixed

| What failed | Found by | What changed | Commit |
|---|---|---|---|
| the first run crashed: `hold() got multiple values for argument 'reason'` | first sample run | the liveness detail field renamed to `why` | `9864112` (before first commit) |
| the network-first question quoted every sponsored title and called them all senior | reading the sample report | it now quotes only the titles that make the evidence soft | `9864112` (before first commit) |
| held roles did not show which row was matched, hiding "Meta → META CO, Portola Valley" | reading the sample report | the matched row, city and state are shown on every held role | `9864112` (before first commit) |
| the committed v0.1.0 rules audit counted title listings, not companies | reading the audit JSON | regenerated with the committed code (one count: 22 → 21) | `3652123` |
| rules v0.1.0 counted non-engineering titles as ML/AI, and "Founding" and II/L2 as entry level | the v0.1.0 rules audit over all 30,369 companies | rules v0.2.0: exclusions, `founding`, level markers. Proven 33 → 27: 6 companies move from Proven to Likely, and 5 others change their gap label within Likely | `d421abe` |
| identical H-1B records on differently named companies were trusted | trying to break the evidence | new hold `shared-h1b-record` | `b4a72ab` |
| a live check would follow a 302 to a company site the recipe never names | worked-run discovery | a first hop with redirects off; new hold `redirects-off-allowed-host` | `c11999f` |
| the report called PathAI's shared record "no usable H-1B record" | reading worked run 1 | a shared record is shown in full, as Unknown, with no number | `fe07d1b` |
| the overwrite-guard test raised `FileExistsError` when an earlier (sandboxed) run left its temporary folder behind, and `PermissionError` in a sandbox that cannot write into the checkout | re-checking Codex's verification (one intermittent error, then 5 passes; old failure reproduced) | it now clears a leftover first and skips with the reason where it cannot write | `c242aa5` |
| `pii-scan --diff` flagged a class decorator (the at-sign line for `unittest.skipUnless`) as an email: in diff mode, the patch's leading `+` became the address's local part | the clean-checkout scan | the decorator replaced by an equivalent `setUp` skip in every commit of the unpushed branch (`git filter-branch`; the change brief commit `abdb8bf` kept its hash) | history rewrite before the first push |

## CI status (outside this contribution's control)

The course's **Contrib Gate** workflow has failed on every push to upstream `main` since at least
2026-09-17. Two things cause it:
- its `harness-regression` job calls four scripts that do not exist;
- its `doctor-and-pii` job stops on the `package-lock.json` false positive.

A PR from this branch inherits both failures. The **verify** workflow (conformance + manifest check) runs
the same commands as `npm run verify`, which passes above. Defects D4 and D5 in `PROPOSED-ADDITIONS.md`
give the details.

## Student re-run

**Done by the student on 2026-10-02.** They ran the commands in their own terminal and pasted the output
into the chat. Claude Code recorded it below and saved it, with prompts and personal CSV columns removed, in
`evidence/student-rerun-2026-10-02/terminal.txt`.

- **Student name and date:** Suketh Reddy Produtoor · 2026-10-02.
- **Commit and working-tree state:** `d1110ea` on the contrib branch, working tree clean. This was the
  existing checkout, not a fresh clone.
- **Tests:** `python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v`
  → 36 tests, `OK` (1.478 s).
- **Sample:** `python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py` → 11 roles,
  held 6, scored 5 (Apply 1 · Consider 3 · Skip 1). This is the expectation written in the recipe.
- **Deliberate break:** `… --scorer-profile …/fixtures/BROKEN-authorization-profile.json --out-dir output/break-authz`.
  Expected a STOP at the scorer-contract gate and a VOID run; observed exactly that. The transcript does not
  print the exit code.
- **CSV comparison:** `sed -n '1956p' data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`
  printed APPLOVIN CORP with 130 approvals, 2 denials, a 98.48% approval rate, a $150,000 company median
  salary, and five sponsored titles including "Machine Learning Engineer". These are the values in the
  report's AppLovin row.
- **Differences, or checks not performed:** no output differed from what was expected. The student did not
  run live mode, a fresh clone, Python 3.9 or the rules audit; Claude Code ran those (above).

**Later on 2026-10-02: the recipe and card were corrected.** The changes were editorial (see the recipe's
Lifecycle section). The prototype code is unchanged since `c242aa5`. The edit voided the student's
attestation, so the student re-ran the same four checks from a fresh clone of the corrected commit:

### Student re-run from a fresh clone (2026-10-02, evening)

**Done by the student, in their own terminal.** Claude Code saved the output, with the prompts, the local
path, a maintainer's email in npm's warning, and the CSV row's personal columns removed, in
`evidence/student-rerun-2026-10-02-fresh-clone/terminal.txt`.

- **Commit and checkout:** a fresh `git clone` of the contrib branch into a temporary folder, at `c7eb748`,
  then `npm install` (55 packages). No files from the working checkout were present.
- **Tests:** 36 tests, `OK` (1.280 s).
- **Sample:** 11 roles, held 6, scored 5 (Apply 1 · Consider 3 · Skip 1), the recipe's expectation.
- **Deliberate break:** STOP at the scorer-contract gate, run VOID, and `exit code: 1`. The first run's
  transcript did not print this.
- **CSV comparison:** line 1956 again printed APPLOVIN CORP with 130 approvals, 2 denials, 98.48%, $150,000
  and "Machine Learning Engineer", the values in the report's AppLovin row.
- **Differences, or checks not performed:** no output differed from what was expected. The student did not
  run live mode, Python 3.9 or the rules audit; Claude Code ran those (above).


## Codex rerun — 2026-09-30 UTC

Operator: Codex (AI). Starting commit: `49eee0e` (amended to `0754031` before any push, rewording two lines that stated personal details about the student). Follow-up documentation and queue edits were uncommitted at the time. This run uses the existing working checkout, not a newly installed clean copy. Original clean-checkout evidence remains separately labeled above.

| Check | Observed | Evidence |
|---|---|---|
| Requested offline test command | 36 tests, OK, exit 0 | `evidence/codex-review-2026-09-30/01-tests.txt` |
| Requested default sample command | 11 evaluated, six held, five scored: Apply 1, Consider 3, Skip 1; exit 0 | `02-sample.txt`, `sample/` |
| Title-rules audit | 30,369 rows, 1,552 tiered, 28,817 held; 21 distinct unmarked ML/AI titles | `03-rules-audit.txt`, `rules-audit/` |
| Deliberately incorrect source hash | Source gate stops, exit 2 | `04-break-hash.txt` |
| Reviewed queue, third run with `--live` | Eight held, zero scored; no liveness requests and no scorer invocation; exit 0. Re-run by Claude from the renamed `worked-run/queue-live-3-reviewed.json` with network access forbidden: same result | `05-worked-run-3.txt`, `worked-run/terminal-live-3.txt` |
| AppLovin source line 1956 | Approvals, denials, rate, company median salary and title list all match run 2 | `applovin-row-check.json` |

No human gate was cleared, and no student signature was added. Current source-page availability is separate from the earlier prototype liveness results.

### Follow-up environment and final checks

This follow-up used Python 3.13.3 (the earlier clean checkout used 3.12/3.9). Exact environment versions are saved in `evidence/codex-review-2026-09-30/environment.json`.

- `npm run verify`: exit 0, 172 files conform, manifest passes with the same three repository warnings.
- `npm run doctor`: exit 0, environment runnable.
- Working-tree privacy scan: exit 1, only the pre-existing package-lock contact-string finding. New review artifacts introduced no additional findings.
- Existing committed branch-history scan against `upstream/main`: exit 0. This scan excludes the current uncommitted additions, which the working-tree scan covers.
- First whitespace check found one extra blank line at the end of SOURCES.md; corrected. Final whitespace check passes.
- No code, rules, shared data, recipe status, commits or remote branches were changed. Current changes are local documentation, review metadata, the active queue and recorded evidence.

## Re-check at c242aa5 (after the test-only fix)

Run by Claude Code on the student's machine, 2026-09-30 02:37 UTC, on a clean `git worktree` of
`c242aa5` (0 untracked files, no `node_modules` before install). Raw output is in
`evidence/clean-checkout-c242aa5/`.

| Check | Result |
|---|---|
| `npm install`, `npm run doctor`, `npm run verify` | exit 0, exit 0, exit 0 |
| offline tests (Python 3.12 / 3.9.6) | 36 OK / 36 OK |
| sample run | 11 roles → held 6 · scored 5 (Apply 1 · Consider 3 · Skip 1), exit 0 |
| break: `--scorer-profile fixtures/BROKEN-authorization-profile.json` | STOP at scorer-contract, VOID, exit 1 (as intended) |
| `git status --short` after the runs | clean |
| `node scripts/pii-scan.mjs --diff upstream/main` | `pii-scan: clean ✓` |

Codex's own technical recheck (outside this repository) reported the same results. Its first attempt
failed with the `PermissionError` described above; that failure is what led to the fix.
