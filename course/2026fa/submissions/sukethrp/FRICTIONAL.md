# FRICTIONAL — honest log

## Executive summary

This is the student's own log of effort for this assignment: what they tried, what went wrong, what
they checked, what they learned, and who did what. The course policy is plain: an AI may organize notes,
but the experience must come from the student.

So this file has three parts:
- a **factual timeline** of the session, reconstructed by Claude from the conversation and git history;
- **Claude's own contributions**;
- **student entry prompts** and a later factual Codex work log. The student’s personal experience is still pending.

---

## How to write an entry (from the course's Frictional prerequisite)

Keep dated entries; short bullets are enough. Label retrospective entries as retrospective. Do not invent
difficulty. If something was straightforward, say so and describe what you checked.

- Date and what I was working on:
- I tried / expected:
- What happened:
- What I did:
- What Claude or another person contributed:
- What I understand now / still do not understand:
- Evidence and next step (a commit, output file, test or prompt excerpt):

## Factual timeline (reconstructed by Claude Code; times Eastern; commit times exact, conversation times approximate)

| Time | What happened | Evidence |
|---|---|---|
| 2026-09-29 20:23–20:28 | The student shared screenshots of the Canvas assignment | conversation |
| 20:30 | The student asked Claude to study the assignment and start in a new `Assignment 3` folder | conversation |
| 20:31–20:40 | Claude cloned the engine and ran the getting-started commands. `ats:scan` failed without `portals.yml`, and `pii-scan` failed on a `package-lock.json` false positive. Claude found the course CI already red | `evidence/getting-started/` |
| 20:45 | The student picked the ML/AI engineer role family, the situation the recipe targets, and the role-level sponsor match, and allowed fork, Chromium and live checks | conversation |
| 20:51 | The change brief was committed before any code (drafted by Claude) | `abdb8bf` |
| just after 20:51 | Claude reproduced the scorer's "work authorized" parsing: the Chapter 11 Proven example drops from Apply 0.446 to Skip 0.1785 | later encoded as a break test |
| 21:10 | Prototype v0.1.0 and tests committed | `9864112` |
| 21:11–21:14 | The rules audit showed non-engineering "AI" titles and II/L2 titles counted as entry level. Rules v0.2.0 was drafted by Claude | `3652123`, `d421abe`, `evidence/rules-audit-v0.1.0/`, `rules-audit-v0.2.0/` |
| 21:16 | 42 records were found shared across 85 companies (lookalike join); a new hold added | `b4a72ab` |
| 21:19 | Recipe and card committed | `6410e7d` |
| 21:20–21:24 | Discovery with the engine's scanner. Greenhouse boards 302-redirect to company sites; a no-redirect first hop added | `c11999f`, `worked-run/terminal-discovery.txt` |
| 21:25 | The student chose a new pre-OPT persona and Claude's title-based fit and timeline proposals, to review later | conversation |
| 21:26–21:28 | Worked run 1, live: TAILOR 1, NETWORK-FIRST 1, RESOLVE 6. The Anthropic and "Open AI" rows turned out to be investment funds | `d3ef7be`, `worked-run/` |
| 21:29–21:31 | The clean-checkout scan flagged a Python decorator as an email. The unpushed branch history was rewritten | `TEST-REPORT.md` |
| 21:33 | The report's PathAI line was wrong ("no usable record"); fixed, and worked run 2 gave the same decisions | `fe07d1b`, `runs/worked-run-2-live/` |

## Student entries

*Empty until the student writes them. Suggested moments to write about, from the timeline above:*
- *why you chose the role-level sponsor match, and what you know about your own search that shaped it;*
- *reading the rules audit, and your decision on the II/L2 rule;*
- *checking the fit and timeline numbers against the real postings;*
- *your gate decisions on the eight postings;*
- *re-running the prototype yourself;*
- *anything you did not understand and asked about.*

### Entry 1 — YYYY-MM-DD

- Date and what I was working on:
- I tried / expected:
- What happened:
- What I did:
- What Claude or another person contributed:
- What I understand now / still do not understand:
- Evidence and next step:

## Human and AI contributions

- **Claude Code contributed:** every line of code, test, fixture and document drafted so far, and every
  command run so far. The full list is in `SOURCES.md` → "What Claude Code contributed".
- **The student decided:** the situation, the recipe direction, the persona approach and the permissions
  (`SOURCES.md` → "What the student decided").
- **The student accepted, changed or rejected:** *to be written by the student*, for example: the
  predictions, rules v0.2.0, the fit and timeline numbers, the gate decisions.

## 2026-09-30 UTC (2026-09-29 Eastern): factual follow-up, organized by Codex

**Authorship:** These are assistant work records, not a student first-person experience log. Suketh asked Codex to handle the nine listed items, minimize questions and provide a natural draft. When asked for personal notes, Suketh requested a draft but did not describe a personal check, reaction or difficulty.

| Work item | What Codex tried and observed | What Codex changed or checked | Student contribution evidenced in this task |
|---|---|---|---|
| Read prior reports | Read the sample, both-run narrative and current rules audit | Retained the conservative v0.2.0 rules as a recommendation; human audit gate stays open | Requested the review |
| Inspect postings | The web reader could not read some dynamic pages; the public Ashby board API returned 403 | Read seven exact Greenhouse job IDs through the public board API and OpenAI’s embedded public posting data; found experience requirements that titles concealed | No personal posting review reported |
| Review inputs | The original scores assumed timing without a confirmed start date | Archived the original queue, withdrew unsupported fit/timeline scorer inputs, preserved clearly labeled AI fit proposals | Asked for an evidence-based draft, not a confirmed score choice |
| Run again | All eight stopped before scoring | Four timeline holds, one shared-record hold and three missing-company holds; no G6 requests ran | No personal rerun reported |
| Verify source and tests | All 36 tests passed; the sample matched; wrong hash stopped with exit 2 | Confirmed AppLovin physical line 1956 against the report, including approvals, denials, salary and titles | No personal CSV comparison reported |

**Prompts for your own entry:** Which of these results did you inspect? What did you expect beforehand? Which AI recommendation did you accept or reject, and why? What can you now explain without reading the draft? If you delegated the checks, say so. Do not claim the tool errors above as your personal struggle.

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
  the student's own visa status. The unpushed commit that contained them was amended.
- **Removed AI drafting from the student's slots.** The reflection section is back to its prompts. The
  AI drafts and the presentation guide are kept outside the repository.
- **Recipe updated.** It now lists the posting's own requirements as something it cannot verify, with a
  typed proposal for a requirements check.
