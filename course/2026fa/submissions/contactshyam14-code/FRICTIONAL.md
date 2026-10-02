# FRICTIONAL — what was tried, what happened, who did it

## Executive summary

This is the honest log of building the "network, don't apply" recipe: what was attempted, what was expected, what actually happened, and what changed in response, with every entry marked by who acted — Shyam (the student) or Claude (the AI assistant doing most of the hands-on work at Shyam's request). It is worth reading because several of the most useful findings came from things going wrong: the setup made the repository look broken when it wasn't, the first version of the tool counted software-testing jobs as production management, and a test of the tests leaked files into the repository. The first-person section at the end is in Shyam's own words, with two small wording notes that it states itself.

## Who did what

| Shyam (human) | Claude (AI) |
|---|---|
| Chose the assignment option ("network targets"); gave the situation: MS Engineering Management, 12-month OPT, SOC 13-1082 and 11-3051. **Corrected the OPT date on 2026-10-02**: December 2026 is the start, not the end | Explained the assignment; proposed the four example designs; asked the clarifying questions |
| Chose where the work lives (`JOB_Agent`) after the first folder failed | Cloned, installed, fixed the Windows environment outside the repo |
| Asked Claude to draft the CHANGE-BRIEF predictions for him to edit | Drafted the brief and predictions, separating observations from predictions |
| Asked "what to do" about the lifecycle status; approved the plan recommending RUNNABLE-SAMPLE with the conflict disclosed | Wrote the prototype, tests, fixtures, recipe, card, and write-ups; ran every command except Shyam's own check (his test run and run 06) |
| **Done 2026-10-02:** re-ran the tests and the tool himself (run 06); read the report; spot-checked IEX Group against the raw data; confirmed the IEX, Genies and Senti boards; signed the sample-run gate; wrote his own answers below. *Still to do:* ask the DSO the visa-path (G4) question; enter the EAD end date when known | Forked, pushed, and opened the PR after Shyam said "finish this task". Recorded his checks under his name only from his own chat answers |

## Log (2026-10-01 to 2026-10-02, local time EDT)

Each entry: **tried → expected → happened → response → learned**, with a trace.

1. **Clone (Claude).** `git clone` into the app's session folder → expected a normal clone → `Filename too long` (Windows path limit). → Shyam picked `C:\Users\Shyam\JOB_Agent`; cloned with `core.longpaths`. *Learned:* the repo has long paths; keep it near a drive root on Windows. *Trace:* session transcript.
2. **Baseline verify failed (Claude).** `npm run verify` → expected exit 0 on a fresh clone → exit 1, three separate causes:
   - `python3` was the Microsoft Store stub;
   - `.sh` checks needed `bash` on PATH;
   - 6 × `E3 … out of sync` errors.

   → Added a `python3` shim and Git's bash to PATH, both outside the repo. The E3 errors were Windows CRLF line endings: re-checked out with LF and they vanished.

   *Learned:* the first `doctor` run reported **0 of 33 recipes with frontmatter**; on an untouched LF checkout it is 33 of 33. A one-line test shows doctor's regex rejects a line ending in `\r`. **The environment made the repo look broken twice.** *Trace:* `evidence/toolchain-before-doctor.txt` (clean), and the first saved run outside the repo.
3. **Sample scorer run (Claude).** `npm run score -- data/examples/ch11-roles.json --out-dir …` in PowerShell → expected output in my folder → npm dropped `--out-dir` and the scorer **overwrote two tracked files** in `data/examples/`. → Restored with `git checkout`; call `node scripts/score/role-scorer.mjs` directly ever since. *Learned:* the assignment's own warning applies in an unexpected way on Windows. *Trace:* WORKED-RUN §0.
4. **Data exploration (Claude), before any code.** Expected an SOC column and a usable Form D join → neither exists. The CSV has titles only, and 15 of 200 SEC samples match any company, none of them a target. Then two surprises:
   - **every one of 1,557 approval and denial counts is even**;
   - **42 groups of companies share an identical H-1B record** (CONVEY/COVEY, CAREDOX/CAREDX, BANYAN INFRASTRUCTURE/BARKING LABS).

   → Recorded as *observations*, kept separate from predictions in the CHANGE-BRIEF; built both checks into the prototype. *Trace:* `f7d5cd2`, CHANGE-BRIEF §6.
5. **The scorer's defaults (Claude, reading code).** Found that a missing liveness gate counts as 1 (open), that funding isn't a scorer term, and that a profile saying "authorized" switches sponsorship off. → The prototype never sends a role without explicit liveness, and a characterization test pins that behaviour. *Trace:* `scripts/score/role-scorer.mjs` lines 58–60 and 83–84; the upstream-characterization test (now test 21).
6. **Run 01 (Claude).** Expected few production-manager matches (prediction 2: three or fewer) → got **10**. → Listed the matches by vocabulary source: 8 came from O*NET 11-3051.01's "Quality Assurance Manager" alternate title, i.e. software QA jobs. → Limited the BLS vocabulary to the primary O*NET row; run 02 gave 2. *Learned:* a vocabulary taken from a record is still only a vocabulary. *Trace:* `runs/01-first-pass` vs `runs/02-primary-vocab`; commit `b30d64a`.
7. **Board probing (Claude).** Guessed 33 board slugs → expected several hits → 28 were 404s; 5 boards found, and only the Greenhouse ones name their company. → Labelled Ashby/Lever board readings as model-judgment; kept a deliberately wrong slug (Zero Motorcycles) to prove that a failed check holds a company rather than closing it. *Trace:* `evidence/board-probe-2026-10-01.txt`, `evidence/scan-dry-run-2026-10-01.txt`.
8. **UTC date (Claude).** The scanner banner said **2026-10-02** at 22:57 EDT on 2026-10-01; the scorer report also uses UTC. Recording the banner date would have held every company as "dated after the as-of date". → Observations use the local date; the guard stays. *Trace:* WORKED-RUN §3.
9. **Tests passed first time (Claude).** All 16 passed on the first run → suspicious, so three bugs were injected (M1–M3) → each was caught, **but after restoring, the suite failed**. M3, with the guard disabled, had really written 5 files into `data/examples/`, and the next clean run tripped on them. → Moved them out of the repo; the out-dir test (then numbered 14) now uses a unique folder and cleans up; M3 re-run left no residue. *Learned:* run mutations in a disposable checkout. *Trace:* `a309e8c`, `evidence/mutation-tests-2026-10-01.txt`.
10. **A check that silently didn't run (Claude).** A `git grep` for user paths errored (`unable to resolve revision: --cached`), and the `|| echo none` fallback printed "none" anyway. → Noticed, re-ran correctly, and confirmed the search finds a known string before trusting "no matches". *Learned:* an error plus a default message looks exactly like a pass. *Trace:* session transcript.
11. **A user path in evidence (Claude).** The out-dir refusal printed an absolute path containing the Windows username. → It now prints a repo-relative path; evidence regenerated. *Trace:* `a0feadb`.
12. **Misleading explanation (Claude).** Run 03's report said "approvals 12 **or** rate 85.7% below the Proven bar" when only the rate failed. → It now names only the failed condition, with a test; tiers unchanged, cross-check still 30/30. *Trace:* `a0feadb`.
13. **Wrong break input (Claude).** The first F3 input named a fixture-only company, plus "Northwind", which turned out to be in the real CSV. → Grepped the real file and replaced both. *Trace:* `fixtures/break-liveness-unmatched.json`.
14. **Planning errors (Claude).**
    - The approved plan said `npm run doctor` would check the case recipe's TODO count. Doctor only reads top-level `recipes/*.md`, so the count was checked with `grep` instead (6 = 6), and the TEST-REPORT says so.
    - The recipe's G4 gate test used a `grep` that could never match the bold run-log line. It was fixed and self-tested.
15. **A number written from memory (Claude).** The first worked-run draft said run 02 had 18 Proven companies; the saved log says 15 (18 was run 01). → Corrected after re-reading every quoted count from the logs. *Trace:* WORKED-RUN §2.

16. **Pasting the privacy scan re-created its finding (Claude).** TEST-REPORT and `evidence/pii-scan-after.txt` pasted the scan output verbatim, including the flagged email address from upstream's `package-lock.json`. The final branch-history scan then reported **2 findings in my own files**. Deleting them in a later commit wouldn't help, because CI scans the whole branch history. → Redacted the address with a visible note and amended that single local commit; nothing had been pushed. The branch-history scan was clean again. *Learned:* evidence about sensitive data must not contain the sensitive data. *Trace:* TEST-REPORT §Privacy scan; `evidence/pii-scan-after.txt` header note.

17. **The date everything rested on was wrong (Shyam caught it; Claude had missed it).** Shyam's first message said "OPT ends December 2026". Claude built the persona, the 91-days-left framing, the visa-path question, and the domain justification on that, and never asked for both dates on the EAD card. Answering the sign-off questions on 2026-10-02, Shyam said *"its my start date"*.
    - → The persona now has a start (2026-12-31) and an end (2027-12-30, assumed as start + 12 months − 1 day).
    - → The prototype counts the 90-day unemployment allowance from the OPT start, and the report describes the window.
    - → The change brief gets a revision rather than a rewrite.
    - → Run 05 and the failure cases were re-run. Every company kept its group and tier (the timeline gate was open in both), but the H-1B timing story reversed: the March registration now falls inside the window, which makes October–March the months that matter.

    *Learned:* no test catches a wrong but plausible input. Ask for the exact source document (here, the EAD card), not a paraphrase. *Trace:* `987f927`, CHANGE-BRIEF Revision 1, WORKED-RUN §7.

18. **The submission ZIP, tested as a grader would, failed a test (Claude).** The first Canvas ZIP was built from PR head `5d9fca2`, unzipped into the Windows temp folder, and the tests were run inside it: **18 of 19**. The output-folder guard allowed "anything under the OS temp dir" for the tests' scratch folders. With the whole repository under the temp folder, that rule also allowed its tracked `data/examples/`.
    - → Inside the repository, only the namespaces are allowed now, wherever the repository lives.
    - → A regression test rebuilds the condition. It fails on the old guard and passes on the new one (20/20).
    - → The PR was updated and the ZIP rebuilt and re-tested.

    *Learned:* "it passes on my machine" is not "it passes where it will be opened". Test the artefact you hand in, not the folder you built it in. *Trace:* `c0bceb8`, TEST-REPORT (Canvas ZIP paragraph), the "repository inside the OS temp dir" test (now test 19).

19. **Another session's files turned up in the submission folders (Claude noticed).** While recording Shyam's sign-off, `git status` showed 37 untracked files that neither of us had made: a different README, a `BROKEN-scorer` fixture, extra personas, and five run folders. All were timestamped within one second (2026-10-02 00:39:06–07). They came from an earlier Claude session on the same assignment, copied into the same folders. None had been committed, so the PR and ZIP were unaffected. → From then on only this session's files were staged, each by name. At Shyam's request all 37 were moved, not deleted, to `C:\Users\Shyam\JOB_Agent\other-session-files\` (outside the repository), with a note on where they came from. *Learned:* staging a whole folder (`git add -A <dir>`) trusts everything in it; name the files. *Trace:* commit `9799952` (staged by name); `other-session-files/README.txt` (outside the repository).

## Unresolved questions

- The exact OPT end date on the EAD card (2027-12-30 is assumed).
- Are the H-1B counts really doubled, and at which upstream step? This needs the USCIS export (recipe proposal 3).
- For each shared-record pair, which company owns the record?
- *Resolved 2026-10-02:* whether the Ashby `genies` and Lever `sentibio` boards belong to Genies Inc and Senti Biosciences. Shyam opened both and confirmed them. That is a person's check, labelled your-input, not a record.
- Is the degree STEM-designated? If so, a STEM OPT extension changes the whole timeline. **Only the DSO can answer this.**
- Should funding become a scorer term, or stay outside the composite?
- Is RUNNABLE-SAMPLE the right claim with six open proposal TODOs, or should a strict reading hold it at DRAFT?

## Shyam — in my own words

*Shyam's own answers, written in chat on 2026-10-02 and pasted here verbatim. Two notes on the wording: answer 1 is a sentence he kept from an example Claude gave him, and answer 4 is his idea in wording Claude lightly polished and he then approved. These replace an earlier version of this section that Claude had drafted from his answers.*

**What I checked myself when I re-ran it:**

> When I opened the IEX job board, the Project Manager job was still listed, and the Genies and Senti pages belonged to the right companies.

**What I accepted from Claude's work, and why:**

> I agree most with network-first because it helps me understand the company and build connections before applying.

**What I changed or rejected:**

> Partly, not every company. Rondo and IEX ok, Genies no - I want manufacturing/operations

**What I learned that I didn't expect:**

> I now understand what goes on behind a job portal, and now I think about contacting companies before they post a job.
