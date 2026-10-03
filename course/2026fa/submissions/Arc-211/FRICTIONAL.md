# FRICTIONAL — honest log of the work

> **Authorship.** The factual log (§1–§3) was compiled by the AI assistant (Claude Code) from
> this session's commands, outputs and commits. It is a record of events, not a reflection.
> §4 is the student's own account, written by Arc-211. Where a line says "AI" or "student",
> that is who did it.

## Executive summary

This is a record of what was actually tried while building the recipe and prototype: what was
expected, what went wrong, what was checked, and what changed as a result. It also separates
the student's decisions from the AI assistant's work. The main lessons: the hardest problems
were not in the code. A broken tool on the laptop, a job-posting checker that was wrong twice,
and a fluent but unsupported answer about E-Verify each nearly put a false "fact" into the
results. Each was caught by looking at the source.

## 1. Attempts, expectations, difficulties, responses

| # | Tried | Expected | What happened | Response | Who | Trace |
|---|---|---|---|---|---|---|
| 1 | `git clone` of the fork | a clone | `Bad CPU type in executable`: an Intel-only git at `/usr/local/bin/git`, no Rosetta | `sudo` uninstall impossible (password forgotten); `~/.bash_profile` root-owned; linked `~/bin/git → /usr/bin/git` and put it first on PATH in `~/.zshrc` | AI diagnosed; student ran the commands | session |
| 2 | `npm run doctor` | privacy check runs | `not a git repo (skipped)`: the scripts hit the broken git too | PATH fix applied to child processes; re-ran → `✓ no private/PII paths are tracked` | AI | `runs/baseline-doctor.txt` |
| 3 | `npm run verify` | clean | manifest warns `private/` and `data/ats/` not gitignored | checked with `git check-ignore`: they **are** ignored; warning is a pattern-matching false alarm | AI | TEST-REPORT §1 |
| 4 | `npm install` | no tracked changes | `package-lock.json` loses 36 `libc` lines every time | restored with `git checkout -- package-lock.json` before each commit | AI | TEST-REPORT §7 |
| 5 | Work in `~/the-reallocation-engine` | keep working there | student re-cloned into `~/Projects`; old folder and first CHANGE-BRIEF draft gone | brief recreated; every number re-checked in the new clone | student moved; AI recreated | `ada43b1` |
| 6 | Branch from local `main` | clean branch | local `main` had a practice "test" commit editing `PROJECT_RULES.md`, with a university email as author | rebased the work onto `origin/main` before any push (my mistake as AI: I didn't compare local `main` with GitHub) | AI | `ada43b1` parent is upstream `015843d` |
| 7 | Predicted 8 finance matches | 8 | 12: the weak title rule admits "Business Analyst" and "Data Scientist" | logged as a revision; weak matches flagged for human reading | AI ran; prediction in brief | CHANGE-BRIEF Revisions |
| 8 | Scorer on a role with no liveness | rejected or flagged | **Apply 0.525, `liveness 1[record]`** | design rule: never send unchecked liveness to the scorer; reported upstream | AI found; student chose option (a) | CHANGE-BRIEF first revision |
| 9 | `ats:liveness` | results | needed `npx playwright install chromium` (95 MB); `<url>` angle brackets broke the shell | installed with permission; URLs quoted | student approved the download | `runs/liveness-*.txt` |
| 10 | Liveness on student-found URLs | active/expired per job | Green Dot and JPMorgan links were **search pages**; Upstart was IT Support (out of scope) | asked for single postings; Upstart not recorded | AI flagged; student supplied new URLs | `runs/liveness-2026-10-01.txt` |
| 11 | Green Dot specific posting | active | checker: `expired — insufficient content` | **student opened the page and saw an Apply button** → recorded `manual`, your-input | **student** | `runs/liveness-2026-10-01c.txt`, `27d4843` |
| 12 | Remitly posting | active | checker: `uncertain` | student confirmed Apply button by eye → `manual` | **student** | `runs/liveness-2026-10-01b.txt` |
| 13 | First scored run | sensible fits | SoFi got fit 0.8 from a past "BI Manager" title; its posting is "Fraud Model Analyst" | fit now judged on the posting title; new test | AI found by reading the report | `27d4843` |
| 14 | SoFi after the fix | not Apply | still Apply at 0.315: sponsorship alone clears 0.3 | `review-role-fit` rule added | **student chose the rule** | `27d4843` |
| 15 | E-Verify answer (from a separate Claude chat plus a web article, per the student) | a lookup | a pasted table said "Verified Enrolled" for all four, citing H-1B/PERM history | **rejected**: sponsorship ≠ E-Verify; no checkable source | AI flagged; student agreed and chose the official lookup | `inputs/everify.json` `_about` |
| 16 | Official E-Verify search | results | first page searched site articles, not employers; dashboard defaulted to "This year" | found the real dashboard; widened to "Last 30 years"; four companies Open, with entity caveats | AI ran in browser; **student reviewed the screens and cleared the gate** | `27d4843` |
| 17 | Break: `--as-of 2027-03-01` | everything stops | 8 unchecked companies still said `check-posting-by-hand` | closed timeline now skips them; new test | AI | `2e1a802` |
| 18 | Break: wrong CSV path | exit 2 | exit 2, but message printed `/Users/<username>/…` | repo-relative paths in all G1 errors | AI | `2e1a802` |
| 19 | Break: company typo | not-in-data | not-in-data, **identical to JPMorgan's real absence** | **unresolved**; listed as a limitation and next improvement | AI | `runs/breaks/typo-company.txt` |
| 20 | Commit clean-checkout evidence | clean PII scan | saving the scanner's output **copied the email it found** into the folder: 3 new findings | redacted, with a note in TEST-REPORT; rescan clean | AI caught before commit | `cf7846b` |

## 2. What was checked, changed, or learned — and what is still open

**Checked by hand:** the four companies' CSV rows against the report (all match); the
composite arithmetic; the E-Verify result screens; three job pages by eye; a clean clone
reproducing the committed report byte-for-byte (except the timestamp).

**Changed because of a check:** fit basis (#13); labels per liveness and E-Verify entry
(#11, #16); the review-role-fit rule (#14); closed-timeline routing (#17); error-message paths
(#18); saved-output redaction (#20).

**Unresolved questions:**
- How should a typo be told apart from a real absence, without auto-correcting? (#19)
- Which SoFi, Remitly or Green Dot entity would actually employ me, and is that one enrolled?
- Is the 60-day hiring lag realistic for finance data roles? It's my guess, not data.
- Should the scorer's 0.3 threshold let sponsorship alone produce "Apply"? That's for the maintainer.
- Are the Proven/Likely thresholds (20 / 90%, 5) right? The repo doesn't pin them.

## 3. Human vs AI contributions

| | Accepted | Modified | Rejected |
|---|---|---|---|
| **AI's proposals** | tier thresholds and fit values; assumed OPT start; recipe structure; option (a) for unchecked liveness | the title rule (fit moved to the posting title after review) | — |
| **AI-style answers** | — | — | the pasted "Verified Enrolled" E-Verify table |
| **Engine verdicts** | Gemini, Green Dot, Remitly: apply | — | SoFi `review-role-fit`, overridden to apply with a stated reason |

The student decided: the situation and targets, the $90k floor, the 60-day lag, the liveness
handling, the review-role-fit rule, DRAFT status, every G2 visual check, the G4 sign-off, and
G5. The AI wrote all code, tests and document drafts, and ran the commands and lookups.

## 4. In my own words (Arc-211)

*(My answers, edited for grammar and flow with AI on 2026-10-02. The last three sentences are
drawn from my own statements and decisions during the session.)*

What surprised me most was Green Dot. The checker said the posting was expired, but it
wasn't. If I had trusted the checker, I would have skipped one of the best companies on my list.
For E-Verify, I had to check by hand whether it applied to each company. I could not trust the
AI blindly. The SoFi posting was a different role from the one I had targeted, so I had to
tailor my application a bit for it. Next time, I would look at the job sites in more depth and
choose roles that are aligned with my target role.

I still chose to apply to SoFi because fraud modelling uses my SQL and Python. I opened the
Green Dot, Remitly, and SoFi postings myself to confirm the Apply button was there, instead of
relying only on the checker. I also chose to keep the recipe marked DRAFT rather than claim
more than it has shown.
