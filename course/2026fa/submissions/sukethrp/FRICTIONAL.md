# FRICTIONAL — honest log

## Executive summary

This is the student's own log of effort for this assignment: what they tried, what went wrong, what
they checked, what they learned, and who did what. The course policy is plain: an AI may organize notes,
but the experience must come from the student.

So this file has three parts:
- a **factual timeline** of the session, reconstructed by Claude from the conversation and git history;
- **Claude's own contributions**;
- **the student's own dated entries**, written 2026-10-02, plus factual work logs by Codex and Claude.

---

## Factual timeline (reconstructed by Claude Code from the chat log and git history; times Eastern)

Quoted text is the student's own wording in chat. The answer naming the student's own situation is not quoted.

| Time | What happened | Evidence |
|---|---|---|
| 2026-09-29 20:23–20:28 | The student shared screenshots of the Canvas assignment | conversation |
| 20:28 | The student asked Claude to study the assignment and start in a new `Assignment 3` folder | “Now take a deeper look into this assignment and start working by creating a new assignment 3 folder in prompt engineering folder” |
| 20:31–20:40 | Claude cloned the engine and ran the getting-started commands. `ats:scan` failed without `portals.yml`, and `pii-scan` failed on a `package-lock.json` false positive. Claude found the course CI already red | `evidence/getting-started/` |
| 20:42 | The student picked the ML/AI engineer role family, the situation the recipe targets, and the role-level sponsor match, and allowed fork, Chromium and live checks | answers “ML / AI engineer” and “Role-level sponsor match (Recommended)” |
| 20:50 | The student allowed local commits and chose to build before reviewing the predictions | answers “Yes, commit as you go (Recommended)” and “Build now, I'll review later” |
| 20:51 | The change brief was committed before any code (drafted by Claude) | `abdb8bf` |
| just after 20:51 | Claude reproduced the scorer's "work authorized" parsing: the Chapter 11 Proven example drops from Apply 0.446 to Skip 0.1785 | later encoded as a break test |
| 21:10 | Prototype v0.1.0 and tests committed | `9864112` |
| 21:11–21:14 | The rules audit showed non-engineering "AI" titles and II/L2 titles counted as entry level. Rules v0.2.0 was drafted by Claude | `3652123`, `d421abe`, `evidence/rules-audit-v0.1.0/`, `rules-audit-v0.2.0/` |
| 21:16 | 42 records were found shared across 85 companies (lookalike join); a new hold added | `b4a72ab` |
| 21:19 | Recipe and card committed | `6410e7d` |
| 21:20–21:24 | Discovery with the engine's scanner. Greenhouse boards 302-redirect to company sites; a no-redirect first hop added | `c11999f`, `worked-run/terminal-discovery.txt` |
| 21:25 | The student chose a new pre-OPT persona and Claude's title-based fit and timeline proposals, to review later | answers “New matching persona (Recommended)” and “Use your proposals, I'll review” |
| 21:26–21:28 | Worked run 1, live: TAILOR 1, NETWORK-FIRST 1, RESOLVE 6. The Anthropic and "Open AI" rows turned out to be investment funds | `d3ef7be`, `worked-run/` |
| 21:29–21:31 | The clean-checkout scan flagged a Python decorator as an email. The unpushed branch history was rewritten | `TEST-REPORT.md` |
| 21:33 | The report's PathAI line was wrong ("no usable record"); fixed, and worked run 2 gave the same decisions | `fe07d1b`, `runs/worked-run-2-live/` |
| 21:47 | The student asked what was left for them | “What are the parts I need to work on?” |
| 21:47–22:13 | The student had Codex (another AI assistant) review the work. Codex read the eight postings and ran run 3 | `POSTING-REVIEW.md`, `logs/runs/2026fa-sukethrp-2.md` |
| 22:13 | The student asked Claude to check Codex's review. Claude verified its claims and proposed five fixes | “Now check” |
| 22:22 | The student approved the five fixes | “Yes”; commits up to `adb6c2d` |
| 22:34 | The student asked Claude to check Codex's technical recheck. A flaky test was hardened | “Now check this and what else left me to finish”; `c242aa5` |
| 2026-10-02 17:51 | The student asked where to start reading. Claude opened the sample report, the rules audit and the posting review | “From where I should read the part 1” |
| 17:56 | The student reported reading them, as Claude had asked them to confirm | “Read all three”; recorded in `d2b3a2e` |
| 17:59 | The student decided the title rules and the eight postings | quoted in `SOURCES.md`; `7a45c7a` |
| 18:04 | The student's reflection, two Frictional entries and SOURCES note | placed verbatim, `d1110ea` |
| 18:08 | The student pasted their own re-run: tests, sample, break attempt, CSV line 1956 | `evidence/student-rerun-2026-10-02/terminal.txt`; `d9f9357` |
| 18:13 | The student sent a dated update to their reflection and asked to sign the attestation | “And also start with sign”; `56e67e4` |
| 18:23 | The student asked for a full check against the assignment. An independent AI review and Claude's checks found stale and inconsistent lines, fixed in the next commit | “Now check assignment from the top” |
| 19:05 | The student sent a reading confirmation, a third Frictional entry, a revised reflection, a change-brief review and a sources update | placed verbatim, `b09509d` |
| 19:11 | The student approved the plan to correct the recipe and card, knowing it voids the signature | plan approval in chat; `c7eb748` |
| 19:16 | The student re-ran the four checks from a fresh clone of `c7eb748`, capturing the break's exit code (1) | `evidence/student-rerun-2026-10-02-fresh-clone/terminal.txt` |
| 19:31 | The student signed the attestation again and asked to push | “sign, push” |

## Student entries

*Written by the student and placed here verbatim on 2026-10-02: three entries, the third after their own re-run. Only the entry titles were made into headings. The evidence line under each entry was added by Claude Code to link it to files and commits.*

### 2026-10-02 — Reading and interpreting the results

I was reviewing the explanations of the sample report, rules audit, and posting review. I expected relevant titles and sponsorship history to provide a useful shortlist, but the posting review showed why those signals were insufficient. The AI assistants read and summarized the files; my part was considering the explanations and the proposed decisions. I now understand that RESOLVE means evidence is missing, while SKIP is a recommendation to spend effort elsewhere.

*Evidence (added by Claude Code):* `evidence/clean-checkout/06-sample-run-report.md`, `evidence/rules-audit-v0.2.0/rules-audit.md` and `POSTING-REVIEW.md`. The reading was recorded in commit `d2b3a2e` (recipe → RUNNABLE-SAMPLE) and in `logs/runs/2026fa-sukethrp-1.md`. Later that day the student confirmed it in their own words, naming what they noticed in each of the three documents (`SOURCES.md` → "Reading confirmation").

### 2026-10-02 — Choosing the rules and keeping the holds

I considered whether to relax the title rules or supply numbers so some postings could be scored. I expected Scale AI’s matching graduation cohort to make it easier to advance, but its qualifications, sponsorship, and start date still needed confirmation. I chose to retain all three v0.2.0 rules and keep all eight postings held, following the evidence-based recommendation. The AI assistants proposed the reasoning; my decision was to prefer conservative screening over unsupported numbers. I still need to complete the hands-on checks and confirm employer-specific details before clearing any hold.

*Evidence (added by Claude Code):* the decisions were recorded in commit `7a45c7a`: the decision table in `WORKED-RUN.md` and `SOURCES.md` → "What the student decided". Later the same day the student ran the hands-on checks themselves (next entry) and revised their reflection in `WORKED-RUN.md`. The employer-specific details are still unconfirmed, so every hold stands.

### 2026-10-02 — Running the checks and comparing the source

I ran the offline test suite, the sample prototype, the broken-authorization profile and the command displaying CSV line 1956. I expected the tests to pass, the sample to reproduce the recorded counts and the broken profile to stop the run. All 36 tests passed; the sample evaluated 11 roles, held six and scored five as Apply 1, Consider 3 and Skip 1. The broken profile printed VOID and stopped at the scorer-contract gate, but my transcript did not capture its exit code. AppLovin’s CSV line showed 130 approvals, two denials and the sponsored Machine Learning Engineer title, matching the report. I now understand why a passing sample and a deliberate failure check establish different things; next I would capture the break’s exit code explicitly and investigate the unresolved evidence for Scale AI.

*Evidence (added by Claude Code):* the student's terminal output, `evidence/student-rerun-2026-10-02/terminal.txt`, recorded in commit `d9f9357`, in `TEST-REPORT.md` → "Student re-run" and in the attestation in `WORKED-RUN.md`. AppLovin's row (row 1955: 130 approvals, 2 denials) appears in the sample report (`evidence/clean-checkout/06-sample-run-report.md`) and in the worked-run reports (`runs/worked-run-2-live/sponsor-match-report.md`). Later that evening the student re-ran the same four checks from a fresh clone of the corrected commit `c7eb748` and captured the break's exit code, 1 (`evidence/student-rerun-2026-10-02-fresh-clone/terminal.txt`). That completes the first of the two next steps named in the entry.

## Human and AI contributions

- **Claude Code contributed:** every line of code, test, fixture and document drafted, and every command
  run except Codex's review runs and the student's own re-run. The full list is in `SOURCES.md` → "What
  Claude Code contributed".
- **The student decided:** the situation, the recipe direction, the persona approach and the permissions.
  On 2026-10-02 they also decided the title rules and the eight holds, re-ran four checks themselves and
  signed the attestation (`SOURCES.md` → "What the student decided").
- **The student accepted, changed or rejected:** in the student's words, see the entries above and `SOURCES.md` →
  "What the student checked, changed or rejected".

## 2026-09-30 UTC (2026-09-29 Eastern): factual follow-up, organized by Codex

**Authorship:** These are assistant work records, not a student first-person experience log. Suketh asked Codex to handle the nine listed items, minimize questions and provide a natural draft. When asked for personal notes, Suketh requested a draft but did not describe a personal check, reaction or difficulty.

| Work item | What Codex tried and observed | What Codex changed or checked | Student contribution evidenced in this task |
|---|---|---|---|
| Read prior reports | Read the sample, both-run narrative and current rules audit | Retained the conservative v0.2.0 rules as a recommendation; human audit gate stays open | Requested the review |
| Inspect postings | The web reader could not read some dynamic pages; the public Ashby board API returned 403 | Read seven exact Greenhouse job IDs through the public board API and OpenAI’s embedded public posting data; found experience requirements that titles concealed | No personal posting review reported |
| Review inputs | The original scores assumed timing without a confirmed start date | Archived the original queue, withdrew unsupported fit/timeline scorer inputs, preserved clearly labeled AI fit proposals | Asked for an evidence-based draft, not a confirmed score choice |
| Run again | All eight stopped before scoring | Four timeline holds, one shared-record hold and three missing-company holds; no G6 requests ran | No personal rerun reported |
| Verify source and tests | All 36 tests passed; the sample matched; wrong hash stopped with exit 2 | Confirmed AppLovin physical line 1956 against the report, including approvals, denials, salary and titles | No personal CSV comparison reported |

**Prompts for your own entry:** Which of these results did you inspect? What did you expect beforehand? Which AI recommendation did you accept or reject, and why? What can you now explain without reading the draft? If you delegated the checks, say so. Do not claim the tool errors above as your personal struggle. *(These were Codex's prompts of 2026-09-30. The student's entries above, written 2026-10-02, are the response.)*

The later AI additions are credited in `SOURCES.md`. No student signature or human gate clearance was added.

## 2026-09-30 UTC: factual follow-up by Claude Code, after checking Codex's review

**Authorship:** an assistant work record, not the student's experience. The student asked Claude to
check Codex's review, and approved the fixes below.

- **Checked Codex's claims against the sources.** Re-read the eight postings through the same public
  job-board APIs: the experience requirements it reported are accurate. Its AppLovin row values and
  arithmetic are correct. The tests and conformance pass.
- **Restored the run 1–2 input.** `worked-run/queue-live-1.json` is back to what runs 1–2 read. Codex's
  reviewed queue is now `worked-run/queue-live-3-reviewed.json`, and run 3 was re-run from it with the
  same result.
- **Reworded two lines Claude had written earlier** (SOURCES.md, and this file's timeline) that stated
  personal details about the student. The unpushed commit that contained them was amended.
- **Removed AI drafting from the student's slots.** The reflection section is back to its prompts. The
  AI drafts and the presentation guide are kept outside the repository.
- **Recipe updated.** It now lists the posting's own requirements as something it cannot verify, with a
  typed proposal for a requirements check.
