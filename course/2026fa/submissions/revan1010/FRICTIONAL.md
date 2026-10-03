# FRICTIONAL — honest log, opt-countdown

## Executive summary

**What this is:** an honest account of how this assignment was actually done: what was tried,
what broke, what I checked, and who did what between me and the AI (Claude Code).

**Why read it:** the code and most of the text in this submission were written by the AI. My part
was choosing what to build, making every design and gate decision, catching some of the AI's
mistakes, and checking results by hand. This log keeps those two apart.

**What it shows:** about 30 logged events on 2026-10-02. The AI made several real mistakes (cloned
before I forked, under-estimated a download, got a number wrong in the recipe, and copied a real
email address into a commit) and fixed them once caught, mostly before anything was pushed. I
still don't understand much of the repo's codebase. After a short walkthrough I could reason
through the timeline and the program's main steps myself.

---

## How the work was split (plainly)

- **Claude Code (AI)** typed every command, read the repo's docs and code, wrote all the code and
  tests, and drafted every document from my answers.
- **I (Revan)** chose the situation and scope, answered the prediction questions, picked every
  design option (formula, inputs, gates, lifecycle stage), pushed back on the AI several times,
  checked the gate G-A values, made the G-C decisions, and did the hand verification.

## Log

Dates are 2026-10-02. "Evidence" points to a commit, a file, or a saved terminal output.

| # | What was tried | What I expected | What happened | Response | Who | Evidence |
|---|---|---|---|---|---|---|
| 1 | Set up the repo | fork, then clone my fork | The AI cloned the instructor's repo **before** I forked (no `gh` CLI on my Mac) | **I noticed** ("wait, first we had to fork?"), forked on GitHub; the AI pointed `origin` at my fork and kept the instructor's repo as `upstream` | me: caught + forked; AI: fix | `git remote -v` |
| 2 | I didn't trust that it worked | — | I asked whether the AI re-cloned | I ran `git remote -v` myself: origin = revan1010, upstream = nikbearbrown, same commit `015843d` | me: checked | my terminal |
| 3 | `npm run doctor`, `npm run verify` | both pass on a fresh clone | doctor passed; **verify failed**: `No module named 'yaml'` | `pip install --user` blocked by Homebrew (PEP 668); made a repo `.venv` with PyYAML; verify passed. I hit the same error again in my own terminal because the venv wasn't activated | AI: fix; me: reproduced + reran | `TEST-REPORT.md` §1 |
| 4 | Checked a verify warning saying `private/` isn't gitignored | it's ignored | False alarm: `git check-ignore` shows it's ignored via `/private/*` | logged, nothing changed | AI | `TEST-REPORT.md` §1 |
| 5 | Picking a persona | — | The AI suggested a new persona in my own folder. **I asked where that's allowed**; the AI then admitted `DATA_CONTRACT.md` says new personas go in `search/examples/`, which conflicts with the contribution folders | **I rejected a new persona** and any personalizing; used Priya Nair unchanged | me: question + decision; AI: self-correction | `DATA_CONTRACT.md` lines 114–116 |
| 6 | Picking the domain | — | I first wanted crypto/fintech SWE roles. I asked if an industry was required | The assignment asks for a specific *situation*, not an industry. **I chose opt-countdown with Priya and dropped crypto** | me: decision | `CHANGE-BRIEF.md` |
| 7 | Running the example engine commands | they run | `ats:scan` needed a config file (fixed with the tutorial's no-copy option). `ats:liveness` needed a browser download; **I approved it**. The AI said about 100 MB; it was about 550 MB | — | me: approved; AI: wrong estimate | `TEST-REPORT.md` |
| 8 | Liveness on a made-up job ID | "expired" | It said **"uncertain"**, not "expired" | became gate G-B (a human checks unclear postings) | AI ran; me: picked the gate | `CHANGE-BRIEF.md` §3 |
| 9 | Reading how the scorer uses the timeline | it computes it | It just reads a typed number, and **treats a missing timeline as 1 ("fine")** (`role-scorer.mjs:85`) | this is the gap opt-countdown fills; the script refuses to run without a hiring time | AI found | recipe |
| 10 | Predictions (`CHANGE-BRIEF.md`) | — | My answers: 8 weeks for every job; the unemployment days matter more than the OPT date; failures = missing data, wrong dates, dead links, no time frame. For the gates and "what will it get wrong" I said "idk", so the AI gave options and **I picked all 4 gates and option A** | written before any code | me: answers + picks; AI: options, date math | commit `2d0b363` |
| 11 | First commit | — | **The AI caught that my real Gmail would be stamped on every commit** (public history) | I approved switching this repo only to my GitHub noreply address | AI: caught; me: approved | `git log` |
| 12 | Formula and inputs | — | The AI showed 3 formula options and what each gives Priya | **I chose sliding (1A) and reusing the book's 5 sample jobs (2A)** | me: decision | commit `4bb3ae7` |
| 13 | Building the prototype | the recipe is right | Three things I didn't predict: (a) the scorer **exports nothing**, though `CONTRIBUTING.md` says to import from it; (b) the scorer's closed-gate line is 0.05, so the recipe's "55 days" was wrong; it's 54; (c) **a human override in the sample keeps a job at "Apply" even with timeline 0** | (a) call the scorer as a command; (b) corrected with a dated note; (c) flagged under G-C | AI wrote code + found these | commit `45a559d`, `CHANGE-BRIEF.md` Revisions |
| 14 | 14 tests passed on the first try | — | suspicious: are they checking anything? | broke the formula on purpose twice: one change was caught by only 1 test, the other by 5 | AI | `TEST-REPORT.md` §2 |
| 15 | The real run | — | I asked the AI to run it for me. The AI ran step 1 (stops at G-A) and showed the printed values next to the profile; **I confirmed "yes, they match"**; the AI then ran it with my name | factor 0; before Apply 2 · Consider 1 · Skip 2 → after Apply 1 · Consider 0 · Skip 4 | me: G-A check; AI: typed commands | `WORKED-RUN.md` |
| 16 | Which lifecycle stage to claim | RUNNABLE-SAMPLE | The repo's rules require zero open TODOs before moving past DRAFT; I still have 2 data gaps | **I chose to stay DRAFT** and explain why | me: decision | commit `47c8a22` |
| 17 | Fresh-clone test | works | Everything reproduced; `verify` needed PyYAML again. **A break attempt found a bug:** `--lag-days -5` crashed with exit 1. Also, one of the AI's own break attempts was mistyped (shell quoting) and tested nothing | fixed the bug + added a test (15 tests); redid the attempt properly | AI | `TEST-REPORT.md` §5 |
| 18 | Privacy scan after writing `TEST-REPORT.md` | 1 known finding | **2 findings: the AI had pasted a real email address (an npm author's, from the scan output) into my report and committed it** | the commit was the latest one and never pushed, so the AI redacted it and rewrote that commit; the address appears 0 times in my branch history | AI: caused + fixed; caught by `pii-scan` | `git log -p 015843d..HEAD` |
| 19 | Domain justification and worked run | — | My estimate: about 50 jobs a week × 15–20 min. The AI pointed out the tool doesn't look up hiring times, so the real saving is smaller. For failure modes and "next improvement" I said "idk"; **I accepted the AI's suggestions** | — | me: estimate + accepted; AI: wording | commit `c7a9b28` |
| 20 | Hand verification | the program says Nov 27 | **I opened the profile: 34 days used. 90 − 34 = 56. Counted from Oct 2 → Nov 27.** Matches | — | me | `WORKED-RUN.md` Verification |
| 21 | Gate G-C (5 jobs zeroed by the timeline) | — | **I decided:** network into the biotech and the Likely-tier sponsor; drop the non-sponsor, the ghost posting, and the override job | — | me: accepted the AI's suggested split | `logs/runs/2026fa-revan1010-1.md` |
| 22 | Checking I can explain it | — | I said I didn't understand much of the code or the timeline. The AI walked me through it in 3 short lessons with check questions. **I got the timeline one right (a 28-day hire → factor 1) and the code one right (a missing OPT date stops at the input check)**; the file one I didn't know (answer: `WORKED-RUN.md`) | — | me: answered; AI: taught | this conversation |

## What I checked, changed, or learned

**Checked myself:** the git remotes; the gate G-A values against the profile; the key date by
hand (34 → 56 → Nov 27); that `npm run verify` works in my own terminal once the venv is active.

**Changed because of a check:** stayed DRAFT instead of claiming more; dropped the crypto idea;
kept the persona unchanged; switched commits to the GitHub noreply email.

**Learned.** When asked directly, my honest first answer was "I literally don't know anything."
What follows came from the AI's walkthrough. Items marked ✓ are ones I then answered correctly
myself; the others I was told and haven't tested myself.
- ✓ If a company could hire in 28 days, Priya's timeline factor would be 1 (she'd start before her
  safe deadline). At 8 weeks it's 0.
- ✓ If the profile is missing the OPT end date, the program stops at the input check with an F-1
  error and writes nothing.
- The deadline that matters for Priya isn't the OPT date on her card (Jan 31). It's when her
  unemployment days run out (Nov 27), and nothing prints that. (I predicted this in the brief as a
  guess.)
- My program doesn't decide Apply/Skip itself. It calculates the timeline number and gives it to
  the professor's scorer.
- The file that shows "biotech went from Apply to Skip" is `WORKED-RUN.md`. I didn't know this
  when asked.

## Unresolved

- **I still don't understand much of the repo's codebase**, and only partly the timeline. I can
  explain the program's five steps and the formula on Priya's numbers, but I couldn't have written
  the code myself.
- Is 8 weeks a realistic hiring time? I don't know; it's an assumption.
- Does starting on the exact last allowed day count? That's a DSO question; the tool treats it as 0.
- Is "34 days used" current? The persona file doesn't say when it was counted.

## Human vs. AI: accepted, modified, rejected

| Item | AI proposed | Me |
|---|---|---|
| Fork order | cloned first | **caught it**; forked |
| New persona in my folder | suggested | **rejected**; Priya unchanged |
| Crypto/fintech domain | supported my first idea | **dropped it** for opt-countdown |
| 8-week fixed hiring time | offered 3 options | **chose it** |
| Gates A–D, prediction P-A | offered options | **accepted all** |
| Sliding formula, reuse sample jobs | recommended | **accepted** |
| New persona's location (`fixtures/` vs `search/examples/`) | first answer was wrong | **asked for the source**; the AI corrected itself |
| Lifecycle stage | raised the rule, recommended DRAFT | **accepted** |
| Gmail → noreply on commits | caught, proposed | **approved** |
| Playwright browser download | asked | **approved** |
| Failure modes A + C, next improvement A | suggested after my "idk" | **accepted** |
| G-C: network 2, drop 3 | suggested | **accepted** |
| All code, tests, documents | wrote | read the outputs; asked questions; did not write code |

## Traceability

| Commit | What |
|---|---|
| `2d0b363` | `CHANGE-BRIEF.md`: predictions, before any code |
| `4bb3ae7` | recipe + card, DRAFT v0.1.0 |
| `45a559d` | prototype, tests, signed sample run, recipe fixes, CHANGE-BRIEF revisions |
| `47c8a22` | DRAFT decision recorded in the recipe |
| `5a37905` | argument-parsing fix + test, `TEST-REPORT.md` (amended to remove a pasted email; never pushed) |
| `c7a9b28` | domain justification, worked run + attestation, run log |
| *(this commit)* | this file |

The full conversation with Claude Code is the primary record of who did what; it can be exported
on request.
