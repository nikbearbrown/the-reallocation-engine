# Miro jobs that match my CV — first pass, not yet reviewed

## Executive summary

**What this is.** On September 19, 2026 I pointed the engine's board-watch skill at Miro's public job board and asked one question: *of everything Miro is hiring for right now, which postings mention the things I actually do?* It read all 28 open postings once, matched them against my CV with a written rule set, and flagged 3. This file is that list, laid out for me to review by hand.

**Why read it.** If you are me: this is the to-do list — open each link, read the posting, write a verdict in the blank column. If you are a student: this is what a real run looks like when the résumé is real — including the part where the machine's top scores are not necessarily the jobs I want.

**What it found.** 28 open postings, 3 mention skills or titles on my CV, 25 do not. 4 of 28 are fully remote. None are part-time or contract. My stated goal: remote part-time, consulting, or educational-material work — Advocate / educator roles first — not full-time relocation. Miro's board (Greenhouse token realtimeboardglobal, their old company name) is 28 postings, mostly sales and account roles across Amsterdam, Tokyo, Munich, and Austin; the three US-remote roles are architect/consultant roles. No Advocate, educator, or community role.

**What it did not do.** It did not judge fit. Every flag is a string match between a word on my CV and a word in a posting; score ranks how many words matched, not how good the job is for me. The decision is mine and has not been made: **the Verdict column is empty.** Nothing here is a shortlist or an intent to apply.

**Status:** TENTATIVE. When every row has a verdict, the banner comes off and the file is renamed `…-reviewed.md`.

**Companion files.** `…-ALL.md` — every posting as a card, nothing filtered. `…-KEEP.md` — the ones I decided to keep, with reasons; the only file with a human judgment in it.

---

## Run record

| | |
|---|---|
| Board | `realtimeboardglobal` on greenhouse — https://boards-api.greenhouse.io/v1/boards/realtimeboardglobal/jobs?content=true |
| Fetched | 2026-09-19T19:44:05+00:00 (one fetch, host allow-listed, raw response saved locally) |
| Seen / new / relevant / skipped | 28 / 28 / 3 / 25 |
| Scheme | `bear-miro-0.1` |
| Résumé | my own CV JSON (local, gitignored — never tracked). Only skill strings already on the public CV appear below. |

## How to review this file

For each row: open the link, read the posting, set **Verdict** to `pursue` · `later` · `pass` · `wrong-match` (the scheme fired on a word that means something else — fix the scheme, not the résumé). Leave a one-line **Note**.

## Relevant postings (3) — ranked by scheme score, which is NOT a ranking of fit

| # | Score | Title | Location | Mode | Top rule hits | Verdict | Note |
|--:|--:|---|---|---|---|---|---|
| 1 | 7.50 | [AI Technical Architect](https://miro.com/careers/vacancy/8646854002?gh_jid=8646854002) | Remote US | full time, remote | prompt engineering, AI agents, RAG, OpenAI, learning, documentation | | |
| 2 | 7.50 | [Forward Deployed Consultant, Manufacturing](https://miro.com/careers/vacancy/8733096002?gh_jid=8733096002) | Remote US | full time, remote | agentic AI, Claude, Claude Code, MCP, ChatGPT, learning | | |
| 3 | 4.50 | [Expression of Interest: SMB & Commercial Account Executive](https://miro.com/careers/vacancy/8610348002?gh_jid=8610348002) | Remote LATAM | full time, remote | evaluation, learning, community | | |

## Skipped postings (25)

<details><summary>Show skipped</summary>

| Title | Location | Reason |
|---|---|---|
| Accounts Payable Manager | Amsterdam, NL; Austin, US; London, UK | score 2.5 below threshold 4.0 |
| Commercial Account Executive | Tokyo, JP | score 1.5 below threshold 4.0 |
| Commercial Account Executive (CEE) | Amsterdam, NL | score 0.5 below threshold 4.0 |
| Commercial Account Executive - Nordics/BLX | Amsterdam, NL | score 0.5 below threshold 4.0 |
| Enterprise Sales Leader, DACH | Munich, DE | score 0.5 below threshold 4.0 |
| Expression of Interest: Enterprise & Strategic AE - UK/I | London, UK | score 2.5 below threshold 4.0 |
| Expression of Interest: Enterprise & Strategic Account Executive | Austin, US | score 2.5 below threshold 4.0 |
| Expression of Interest: SMB & Commercial Account Executive | Austin, US | score 2.5 below threshold 4.0 |
| GTM GM, Fashion | Austin, US; Los Angeles, US; New York, US; San Francisco, US | score 0.5 below threshold 4.0 |
| GTM GM, Manufacturing | Austin, US; Los Angeles, US; New York, US; San Francisco, US | score 1.5 below threshold 4.0 |
| Head of CS, DACH | Munich, DE | score 0.5 below threshold 4.0 |
| Innovation Architect, LATAM | Remote Brazil | score 2.5 below threshold 4.0 |
| Large Enterprise Account Executive - Nordics | Amsterdam, NL | score 0.5 below threshold 4.0 |
| Manager, Customer Support AMER | Austin, US | score 0.5 below threshold 4.0 |
| Principal, Field Excellence | Amsterdam, NL; London, UK | score 0.5 below threshold 4.0 |
| Senior Lifecycle Marketing Manager | Copenhagen, DK; London, UK | score 2.5 below threshold 4.0 |
| Senior Threat Detection Engineer - Intelligence | Austin, US | score 2.5 below threshold 4.0 |
| Solutions Architect | Tokyo, JP | score 1.5 below threshold 4.0 |
| Solutions Architect | Tokyo, JP | score 1.5 below threshold 4.0 |
| Strategic Account Executive | Tokyo, JP | score 1.5 below threshold 4.0 |
| Strategic Account Executive | Tokyo, JP | score 1.5 below threshold 4.0 |
| Strategic Key Account Executive (DACH) | Munich, DE | score 0.5 below threshold 4.0 |
| Technical Account Manager | Sydney, AU | score 3.5 below threshold 4.0 |
| Technical Account Manager, Japan | Tokyo, JP | score 2.5 below threshold 4.0 |
| Vice President Customer Success | New York, US; San Francisco, US | score 0.5 below threshold 4.0 |

</details>

## Justification detail

<details><summary>Show every rule that fired</summary>

**AI Technical Architect** — https://miro.com/careers/vacancy/8646854002?gh_jid=8646854002 — score 7.50

- skill «prompt engineering» (skills.ai_ml[9]) appears in posting content +1.0
- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «OpenAI» (skills.ai_platforms[6]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- location «Remote US» is remote +1.0

**Forward Deployed Consultant, Manufacturing** — https://miro.com/careers/vacancy/8733096002?gh_jid=8733096002 — score 7.50

- skill «agentic AI» (skills.ai_ml[10]) appears in posting content +1.0
- skill «Claude» (skills.ai_platforms[0]) appears in posting content +1.0
- skill «Claude Code» (skills.ai_platforms[1]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «ChatGPT» (skills.ai_platforms[5]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- location «Remote US» is remote +1.0

**Expression of Interest: SMB & Commercial Account Executive** — https://miro.com/careers/vacancy/8610348002?gh_jid=8610348002 — score 4.50

- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- location «Remote LATAM» is remote +1.0

</details>

---
*Verdict kind for every row: `record-based rule`. The person decides.*