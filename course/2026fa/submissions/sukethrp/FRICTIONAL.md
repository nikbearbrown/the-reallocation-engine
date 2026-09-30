# FRICTIONAL — honest log

## Executive summary

This is the student's own log of effort for this assignment: what they tried, what went wrong, what
they checked, what they learned, and who did what. The course policy is plain: an AI may organize notes,
but the experience must come from the student.

So this file has three parts:
- a **factual timeline** of the session, reconstructed by Claude from the conversation and git history;
- **Claude's own contributions**;
- **empty dated entries** for the student to write. None of the student entries is filled in yet.

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
