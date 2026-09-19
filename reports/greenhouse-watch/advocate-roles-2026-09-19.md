# Advocate and educator roles across the design-tool companies — September 19, 2026

## Executive summary

**What this is.** One question asked of seven company job boards on the same day: *who is hiring someone to teach, demo, and advocate for their product?* I pulled every open posting from Figma, Writer, Canva, Miro, Webflow, Notion, and Jasper — 643 postings across three different applicant-tracking systems — and kept the ones whose job is education, advocacy, or developer/designer relations. Three more companies on the list (Framer, Adobe, and the Sketch/InVision/Mural group) could not be read this way and are explained at the end.

**Why read it.** Because it answers the question I actually have — *is there an Advocate-shaped role I could hold, remote and part-time or consulting?* — with the whole field in view instead of one company at a time. The company-by-company files (`<company>-2026-09-19-{ALL,TENTATIVE,KEEP}.md`) hold the detail; this is the page to read first.

**What it found.**
- **Six roles, at four companies, fit the criterion.** Figma: Designer Advocate (×3, US hubs + London). Notion: Developer Advocate, Technical Education Specialist (NYC). Webflow: Senior Developer Educator (US remote). Writer: Senior AI learning designer, rapid content (hybrid, six hubs). Canva, Miro, and Jasper have none.
- **Only one is remote in the United States: Webflow's Senior Developer Educator** — posted September 15 as a new position, $113K–$155K, one week a month in San Francisco. Every other match is hub-based or hybrid.
- **None is part-time or consulting.** All six are full-time employee roles. Canva and Writer do hire on contract (Canva has 23 Contract postings and 43 contingent workers; Writer has one), so contract engagements are not unprecedented at these companies — they just are not being posted for education work in the US today.
- **The word I should have been searching for is "Educator," not "Advocate."** Two of the six best matches (Webflow, Notion) do not have "advocate" in the title, and the closest role at Writer is a "learning designer." Advocacy teams sit in Marketing; education teams sit in Customer Success or their own Academy — different budgets, same work.

**What it did not do.** It did not judge whether I would get any of these, and it did not apply anywhere. The keep/consider decisions below are mine; the postings were found by a rule set that matches words on my CV, then read by me. Verdicts on the other 637 postings are still pending in each company's TENTATIVE file.

---

## The six roles

| Company | Title | Where | Mode | Pay (posted) | Posted | Link | My status |
|---|---|---|---|---|---|---|---|
| **Webflow** | Senior Developer Educator | SF (hybrid) **or U.S. Remote** | full time; 1 wk/month in SF | $113K – $155K (3 zones) | 2026-09-15 | https://job-boards.greenhouse.io/webflow/jobs/8204002 | **keep** |
| **Figma** | Designer Advocate | SF · NYC · US hubs | full time, hub | $153K – $317K | 2026-09-01 | https://boards.greenhouse.io/figma/jobs/6176134004 | **keep** (Assignment 2 dream job) |
| Figma | Designer Advocate, Partnerships | SF | full time, hub | $153K – $317K | 2026-07-13 | https://boards.greenhouse.io/figma/jobs/6114301004 | consider |
| Figma | Designer Advocate (London) | London | full time, hub | not posted | 2026-07-23 | https://boards.greenhouse.io/figma/jobs/6122399004 | pass (geography) |
| **Notion** | Technical Education Specialist | NYC (Mon/Tue/Thu in office) | full time, hybrid | not posted | 2026-09-11 | https://jobs.ashbyhq.com/notion/6f7c5ae6-9632-4436-8b1c-a1e4c1050633 | **keep** (best description, wrong geography) |
| Notion | Developer Advocate | NYC / SF | full time, hybrid | not posted | 2026-05-28 | https://jobs.ashbyhq.com/notion/0cc39c60-4c89-4213-954e-d77ced4cb7e7 | **keep** (check whether still real — 4 months old) |
| **Writer** | Senior AI learning designer, rapid content | SF · Chicago · Seattle · NYC · Austin | full time, hybrid | $152.7K – $200K | 2026-09-18 | https://jobs.ashbyhq.com/writer/04ad3b44-51df-4fa6-a17c-cab6875f70cd | **keep** (no AI voice allowed — I'd be on camera) |

Three roles are worth a sentence even though they miss the criterion: Writer's four **Enterprise / Strategic AI adoption leads** (customer AI enablement, $146K–$220K, hub-hybrid) are the closest thing to consulting on any board; Canva's **Program Manager: Education Content** and **International Growth Strategy Lead (Education)** are the right work in Sydney; Miro's **Forward Deployed Consultant, Manufacturing** is US-remote but is a sales-engineering role.

## What each board looks like

| Company | ATS | Postings | Relevant (rules) | Remote | Contract / contingent | Advocate/educator roles |
|---|---|---:|---:|---|---|---|
| Figma | Greenhouse `figma` | 152 | 55 | 85 "US hubs or remote" | 0 | 3 |
| Writer | Ashby `writer` | 51 | 24 (after boilerplate fix) | 0 remote-only; 51 hybrid | 1 | 1 |
| Canva | SmartRecruiters `Canva` | 248 | 64 | 47, all outside the US | 23 + 43 | 0 in the US |
| Notion | Ashby `notion` | 128 | 43 | 0 remote-only; 84 hybrid | 2 (+2 interns) | 2 |
| Webflow | Greenhouse `webflow` | 29 | 21 | 22 (US / Argentina) | 0 | 1 |
| Miro | Greenhouse `realtimeboardglobal` | 28 | 3 | 4 | 0 | 0 |
| Jasper | Ashby `Jasper AI` | 7 | 6 | 7 "United States" | 0 | 0 |

## Companies this method cannot read yet

- **Framer** — jobs are hand-built pages at `framer.com/careers/<slug>`; no structured feed. Would need a page scraper and a human check that each page is really a posting. Not built; the engine's rule is one allow-listed API host per provider, and a marketing site is not that.
- **Adobe** — Workday. There is a JSON search endpoint behind every Workday careers site, but it needs a per-job detail call and Adobe's board is in the thousands. The engine has a Workday scraper in `scripts/ats/scrapers/workday/`; wiring it to the watch skill is a separate task and I would run it with a title filter, not against the whole board.
- **Sketch, InVision, Mural** — not checked. InVision wound down its design products in 2024; Sketch and Mural are small boards that need a look by hand first to see which ATS, if any, they use.

## How this was made (for the record)

Seven runs of `.claude/skills/greenhouse-watch/scripts/greenhouse_watch.py` on 2026-09-19 — Greenhouse, Ashby, and SmartRecruiters providers, one allow-listed API host each — against my CV JSON with a per-board scheme derived from `bear-figma-0.1`; then `board_cards.py` for the per-company files; then this page by hand from the seven KEEP and ALL files. The SmartRecruiters provider was written today for Canva: a paged listing plus one detail call per posting (248 calls, ~3.5 minutes) because the listing feed carries no ad text. Raw responses are kept locally, never committed. Every "relevant" count is a word-match, not a judgment; every "keep" is mine.
