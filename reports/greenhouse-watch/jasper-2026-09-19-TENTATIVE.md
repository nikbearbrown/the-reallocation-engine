# Jasper AI jobs that match my CV — first pass, not yet reviewed

## Executive summary

**What this is.** On September 19, 2026 I pointed the engine's board-watch skill at Jasper AI's public job board and asked one question: *of everything Jasper AI is hiring for right now, which postings mention the things I actually do?* It read all 7 open postings once, matched them against my CV with a written rule set, and flagged 6. This file is that list, laid out for me to review by hand.

**Why read it.** If you are me: this is the to-do list — open each link, read the posting, write a verdict in the blank column. If you are a student: this is what a real run looks like when the résumé is real — including the part where the machine's top scores are not necessarily the jobs I want.

**What it found.** 7 open postings, 6 mention skills or titles on my CV, 1 do not. 7 of 7 are fully remote. 0 are part-time/contract/temporary. My stated goal: remote part-time, consulting, or educational-material work — Advocate / educator roles first — not full-time relocation. Jasper's board is seven postings, all US, none Advocate or education. It is a small board that has clearly contracted; worth a check every few months, not daily.

**What it did not do.** It did not judge fit. Every flag is a string match between a word on my CV and a word in a posting; score ranks how many words matched, not how good the job is for me. The decision is mine and has not been made: **the Verdict column is empty.** Nothing here is a shortlist or an intent to apply.

**Status:** TENTATIVE. When every row has a verdict, the banner comes off and the file is renamed `…-reviewed.md`.

**Companion files.** `…-ALL.md` — every posting as a card, nothing filtered. `…-KEEP.md` — the ones I decided to keep, with reasons; the only file with a human judgment in it.

---

## Run record

| | |
|---|---|
| Board | `Jasper AI` on ashby — https://api.ashbyhq.com/posting-api/job-board/Jasper%20AI?includeCompensation=true |
| Fetched | 2026-09-19T19:44:07+00:00 (one fetch, host allow-listed, raw response saved locally) |
| Seen / new / relevant / skipped | 7 / 7 / 6 / 1 |
| Scheme | `bear-jasper-0.1` |
| Résumé | my own CV JSON (local, gitignored — never tracked). Only skill strings already on the public CV appear below. |

## How to review this file

For each row: open the link, read the posting, set **Verdict** to `pursue` · `later` · `pass` · `wrong-match` (the scheme fired on a word that means something else — fix the scheme, not the résumé). Leave a one-line **Note**.

## Relevant postings (6) — ranked by scheme score, which is NOT a ranking of fit

| # | Score | Title | Location | Mode | Top rule hits | Verdict | Note |
|--:|--:|---|---|---|---|---|---|
| 1 | 9.00 | [Senior GRC Lead](https://jobs.ashbyhq.com/Jasper%20AI/d86a7821-b768-4f11-b540-3ee0fbc94c96) | United States | full time, remote | Senior GRC Lead, AI agents, RAG, Claude, Claude Code, learning … | | |
| 2 | 7.50 | [Senior Security Engineer](https://jobs.ashbyhq.com/Jasper%20AI/f5a4a890-e544-4a85-bd45-f75ad40b0d35) | United States | full time, remote | LLM, AI agents, RAG, learning, documentation, GitHub | | |
| 3 | 6.50 | [Director, Services](https://jobs.ashbyhq.com/Jasper%20AI/c1599004-1828-49df-b413-2a584af1d94c) | United States | full time, remote | AI agents, RAG, curriculum, curriculum design, learning | | |
| 4 | 5.50 | [Staff Software Engineer, IQ](https://jobs.ashbyhq.com/Jasper%20AI/cf36519d-76b9-4c3a-b629-fd414016c048) | United States | full time, remote | LLM, AI agents, RAG, learning | | |
| 5 | 4.50 | [Staff Software Engineer, Surfaces](https://jobs.ashbyhq.com/Jasper%20AI/c8d06b73-1058-49c9-ab76-95692743b09c) | United States | full time, remote | AI agents, RAG, learning | | |
| 6 | 4.50 | [Senior Accountant](https://jobs.ashbyhq.com/Jasper%20AI/de0f7d92-b06a-4f7d-80ff-721985c45162) | United States | full time, remote | AI agents, RAG, learning | | |

## Skipped postings (1)

<details><summary>Show skipped</summary>

| Title | Location | Reason |
|---|---|---|
| Senior Director, Growth Marketing | United States • Remote | score 3.5 below threshold 4.0 |

</details>

## Justification detail

<details><summary>Show every rule that fired</summary>

**Senior GRC Lead** — https://jobs.ashbyhq.com/Jasper%20AI/d86a7821-b768-4f11-b540-3ee0fbc94c96 — score 9.00

- title «Senior GRC Lead» shares most words with résumé title «AI Lead» (experience[2].title) +1.5
- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «Claude» (skills.ai_platforms[0]) appears in posting content +1.0
- skill «Claude Code» (skills.ai_platforms[1]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- location «United States • Remote» is remote +1.0

**Senior Security Engineer** — https://jobs.ashbyhq.com/Jasper%20AI/f5a4a890-e544-4a85-bd45-f75ad40b0d35 — score 7.50

- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «GitHub» (skills.languages_tools[11]) appears in posting content +1.0
- location «United States • Remote» is remote +1.0

**Director, Services** — https://jobs.ashbyhq.com/Jasper%20AI/c1599004-1828-49df-b413-2a584af1d94c — score 6.50

- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «curriculum» (skills.education_content[0]) appears in posting content +1.0
- skill «curriculum design» (skills.education_content[1]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- location «United States • Remote» is remote +1.0

**Staff Software Engineer, IQ** — https://jobs.ashbyhq.com/Jasper%20AI/cf36519d-76b9-4c3a-b629-fd414016c048 — score 5.50

- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- location «United States • Remote» is remote +1.0

**Staff Software Engineer, Surfaces** — https://jobs.ashbyhq.com/Jasper%20AI/c8d06b73-1058-49c9-ab76-95692743b09c — score 4.50

- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- location «United States • Remote» is remote +1.0

**Senior Accountant** — https://jobs.ashbyhq.com/Jasper%20AI/de0f7d92-b06a-4f7d-80ff-721985c45162 — score 4.50

- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- location «United States • Remote» is remote +1.0

</details>

---
*Verdict kind for every row: `record-based rule`. The person decides.*