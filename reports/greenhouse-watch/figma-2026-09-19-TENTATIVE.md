# Figma jobs that match my CV — first pass, not yet reviewed

## Executive summary

**What this is.** On September 19, 2026 I pointed the engine's `greenhouse-watch` skill at Figma's public job board and asked one question: *of everything Figma is hiring for right now, which postings mention the things I actually do?* It read all 152 open postings once, matched them against my CV with a written rule set, and flagged 55. This file is that list, laid out for me to review by hand.

**Why read it.** If you are me: this is the to-do list — open each of the 55 links, read the posting, and write a verdict in the blank column. If you are a student: this is what a real run of the assignment looks like when the résumé is real and the board is a company you have heard of — including the part where the machine's top scores are *not* the jobs I want. If you are a maintainer: it is the first real-board run of the skill and it surfaced one scheme problem (see below).

**What it found, in three lines.**
1. Figma has **no part-time, contract, or consulting roles** on its board — all 152 are full-time employee positions. My stated goal (remote part-time / consulting / educational content) has no direct match.
2. **Remote is common** — 85 of 152 postings can be held "remotely in the United States" — so the barrier is the employment type, not geography.
3. The closest thing to educational-content work is **Designer Advocate** (3 postings: written, visual, and video resources for the design community); the closest thing to my research is **Researcher, Figma Agentic Experiences** (remote-OK, but wants 7+ years of UX research I don't have).

**What it did not do.** It did not judge fit. Every flag is a string match between a word on my CV and a word in a posting — that is why "Software Engineer – C++" scores 10.75 (the posting mentions *video*, *documentation*, *community*, *design systems*). Score ranks how many words matched, not how good the job is for me. The decision is mine and has not been made: **the Verdict column is empty.** Nothing here is a shortlist or an intent to apply.

**Status:** TENTATIVE. When every row has a verdict, the banner comes off and the file is renamed `…-reviewed.md`.

---

## Run record

| | |
|---|---|
| Board | `figma` — https://boards-api.greenhouse.io/v1/boards/figma/jobs |
| Fetched | 2026-09-19T18:53:26+00:00 (one fetch, host allow-listed, raw response saved locally) |
| Seen / new / relevant / skipped | 152 / 152 / 55 / 97 |
| Scheme | `bear-figma-0.1` — threshold 4.0, soft location, skill cap 12; intern / new-grad / early-career titles excluded; Director/VP **not** excluded |
| Résumé | maintainer's own CV JSON (local, gitignored — never tracked). Only skill strings already on the public CV appear below. |
| Stated goal | remote part-time, consulting, advisory, or educational-material work — **not** full-time relocation |
| Skill | `.claude/skills/greenhouse-watch/` |

## Board-level finding (record-based, needs human confirmation)

- No posting on the board is offered as a part-time, contract, freelance, or consulting engagement — the only "consulting" on the board is the *Solutions Consulting* sales family. All 152 are full-time employee postings.
- 85 of the 152 postings (36 of the 55 relevant) say the role can be held "from one of our US hubs or remotely in the United States"; the rest are hub-only or non-US. Remote is common at Figma; part-time is not.
- No title contains *Education*, *Learning*, *Curriculum*, *Content*, or *Instruction*. Nearest families: *Designer Advocate* (3) and *Customer Enablement Manager* (5, all outside the US).

## How to review this file

For each row: open the link, read the posting, and set **Verdict** to one of `pursue` · `later` · `pass` · `wrong-match` (the scheme fired on a word that means something else here — that is a finding about the scheme, fix `scheme.bear-figma.json`, not the résumé). Leave a one-line **Note**. When every row has a verdict, remove the TENTATIVE banner and rename the file `…-reviewed.md`.

## Relevant postings (55) — ranked by scheme score, which is NOT a ranking of fit

| # | Score | Title | Location | Mode | Top rule hits | Verdict | Note |
|--:|--:|---|---|---|---|---|---|
| 1 | 12.00 | [Software Engineer - AI Product](https://boards.greenhouse.io/figma/jobs/5551730004?gh_jid=5551730004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | machine learning, generative AI, Claude, ChatGPT, learning, video … | | |
| 2 | 11.50 | [AI Applied Scientist](https://boards.greenhouse.io/figma/jobs/5707966004?gh_jid=5707966004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | machine learning, deep learning, reinforcement learning, generative AI, prompt engineering, evaluation … | | |
| 3 | 11.50 | [Forward Deployed Engineer](https://boards.greenhouse.io/figma/jobs/6158162004?gh_jid=6158162004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | LLM, prompt engineering, evals, MCP, learning, video … | | |
| 4 | 11.50 | [Marketing Engineer](https://boards.greenhouse.io/figma/jobs/6013495004?gh_jid=6013495004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | generative AI, LLM, evaluation, evals, MCP, n8n … | | |
| 5 | 11.50 | [Product Designer, Roundtripping (London, United Kingdom)](https://boards.greenhouse.io/figma/jobs/6193686004?gh_jid=6193686004) | London, England | full-time · hub | evals, Claude, Claude Code, MCP, video, community … | | |
| 6 | 11.50 | [Software Engineer - Full Stack](https://boards.greenhouse.io/figma/jobs/5691911004?gh_jid=5691911004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | Claude, ChatGPT, video, community, mentoring, Figma … | | |
| 7 | 11.50 | [Software Engineer - Machine Learning](https://boards.greenhouse.io/figma/jobs/5551532004?gh_jid=5551532004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | machine learning, generative AI, RAG, evaluation, learning, video … | | |
| 8 | 10.75 | [Software Engineer - AI Product (London, United Kingdom)](https://boards.greenhouse.io/figma/jobs/5551697004?gh_jid=5551697004) | London, England | unstated | generative AI, LLM, AI agents, MCP, video, documentation … | | |
| 9 | 10.75 | [Software Engineer - C++](https://boards.greenhouse.io/figma/jobs/5552530004?gh_jid=5552530004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | learning, video, documentation, community, design systems, Figma … | | |
| 10 | 9.50 | [Manager, Software Engineering - DevEx AI Tools](https://boards.greenhouse.io/figma/jobs/6008752004?gh_jid=6008752004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | LLM, evaluation, Claude, Claude Code, MCP, Model Context Protocol … | | |
| 11 | 9.50 | [Software Engineer - Growth & Monetization](https://boards.greenhouse.io/figma/jobs/5552560004?gh_jid=5552560004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | teaching, learning, video, community, mentoring, Figma … | | |
| 12 | 9.00 | [Data Scientist, Core Data -  PhD (2026)](https://boards.greenhouse.io/figma/jobs/5976930004?gh_jid=5976930004) | San Francisco, CA · New York, NY | full-time · US remote OK | machine learning, LLM, learning, video, community, Figma … | | |
| 13 | 8.75 | [Software Engineer - Figma Weave (Tel Aviv, Israel)](https://boards.greenhouse.io/figma/jobs/6073106004?gh_jid=6073106004) | Tel Aviv, Israel | unstated | teaching, learning, video, community, mentoring, Figma … | | |
| 14 | 8.50 | [Software Engineer - AI Platforms](https://boards.greenhouse.io/figma/jobs/5691886004?gh_jid=5691886004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | evaluation, evals, MCP, video, community, mentoring … | | |
| 15 | 7.50 | [Designer Advocate](https://boards.greenhouse.io/figma/jobs/6176134004?gh_jid=6176134004) | San Francisco, CA · New York, NY · United States | full-time · hub | AI-assisted design, video, advocacy, community, public speaking, design systems … | | |
| 16 | 7.50 | [Manager, Software Engineering - AI Observability](https://boards.greenhouse.io/figma/jobs/5807963004?gh_jid=5807963004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | machine learning, LLM, evals, learning, video, community … | | |
| 17 | 7.50 | [Product Designer, Design, Dev, & AI Tools](https://boards.greenhouse.io/figma/jobs/5711468004?gh_jid=5711468004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, mentoring, design systems, storytelling, Figma … | | |
| 18 | 7.50 | [Product Designer, Growth & Monetization](https://boards.greenhouse.io/figma/jobs/5711595004?gh_jid=5711595004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, advocacy, community, mentoring, storytelling, Figma … | | |
| 19 | 7.50 | [Software Engineer - Data Infrastructure](https://boards.greenhouse.io/figma/jobs/5551686004?gh_jid=5551686004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | machine learning, learning, video, community, mentoring, Figma … | | |
| 20 | 7.50 | [Software Engineer - Graphics & Media](https://boards.greenhouse.io/figma/jobs/5552522004?gh_jid=5552522004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | learning, video, community, mentorship, Figma, FigJam … | | |
| 21 | 6.75 | [Researcher, Figma Agentic Experiences](https://boards.greenhouse.io/figma/jobs/5651744004?gh_jid=5651744004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | evaluation, evals, video, community, mentorship, storytelling … | | |
| 22 | 6.50 | [Designer Advocate (London, United Kingdom)](https://boards.greenhouse.io/figma/jobs/6122399004?gh_jid=6122399004) | London, England | unstated | AI-assisted design, video, advocacy, community, design systems, Figma … | | |
| 23 | 6.50 | [Product Manager, Developer Platform](https://boards.greenhouse.io/figma/jobs/6100482004?gh_jid=6100482004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | AI agents, Claude, MCP, ChatGPT, video, community … | | |
| 24 | 6.50 | [Support Engineer, AI Infrastructure & Tooling](https://boards.greenhouse.io/figma/jobs/5802956004?gh_jid=5802956004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | LLM, RAG, video, community, Figma, Python … | | |
| 25 | 5.75 | [Designer Advocate, Partnerships](https://boards.greenhouse.io/figma/jobs/6114301004?gh_jid=6114301004) | San Francisco, CA | unstated | AI-assisted design, video, community, design systems, Figma, prototyping … | | |
| 26 | 5.75 | [Software Engineer - Distributed Systems](https://boards.greenhouse.io/figma/jobs/5552549004?gh_jid=5552549004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, mentoring, Figma, Python, TypeScript … | | |
| 27 | 5.50 | [Data Scientist, Finance](https://boards.greenhouse.io/figma/jobs/6013304004?gh_jid=6013304004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, Figma, Python, SQL, Git | | |
| 28 | 5.50 | [Director, Data Science](https://boards.greenhouse.io/figma/jobs/6130865004?gh_jid=6130865004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | LLM, evals, video, community, design systems, Figma | | |
| 29 | 5.50 | [Director, Research - AI Evals](https://boards.greenhouse.io/figma/jobs/6112112004?gh_jid=6112112004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | LLM, evaluation, evals, video, community, Figma | | |
| 30 | 5.50 | [Enterprise Support Specialist, Korean Speaking (London, United Kingdom)](https://boards.greenhouse.io/figma/jobs/6105678004?gh_jid=6105678004) | London, England | unstated | machine learning, generative AI, learning, video, community, Figma | | |
| 31 | 5.50 | [IT Engineer, Internal AI Infrastructure](https://boards.greenhouse.io/figma/jobs/6164379004?gh_jid=6164379004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | LLM, evals, MCP, video, community, Figma | | |
| 32 | 5.50 | [Manager, Solutions Consulting (London, United Kingdom)](https://boards.greenhouse.io/figma/jobs/6111591004?gh_jid=6111591004) | London, England | unstated | video, community, mentorship, storytelling, Figma, prototyping | | |
| 33 | 5.50 | [Manager, Technical Support (London, United Kingdom)](https://boards.greenhouse.io/figma/jobs/6189444004?gh_jid=6189444004) | London, England | unstated | video, documentation, community, Figma, TypeScript, JavaScript | | |
| 34 | 5.50 | [Security Scientist](https://boards.greenhouse.io/figma/jobs/6180172004?gh_jid=6180172004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, Figma, Python, SQL, R | | |
| 35 | 4.75 | [Technical Account Manager, Mandarin Speaking (Singapore)](https://boards.greenhouse.io/figma/jobs/6113161004?gh_jid=6113161004) | Singapore | unstated | AI agents, MCP, video, community, Figma, Dev Mode | | |
| 36 | 4.75 | [Technical Account Manager (Tokyo, Japan)](https://boards.greenhouse.io/figma/jobs/6006175004?gh_jid=6006175004) | Tokyo, Japan | unstated | AI agents, MCP, video, community, Figma, Dev Mode | | |
| 37 | 4.50 | [Account Executive, SMB](https://boards.greenhouse.io/figma/jobs/5694259004?gh_jid=5694259004) | San Francisco, CA · New York, NY | full-time · hub | evaluation, bootcamp, video, community, Figma | | |
| 38 | 4.50 | [Brand Designer,  Product Launches](https://boards.greenhouse.io/figma/jobs/6131079004?gh_jid=6131079004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, brand, storytelling, Figma | | |
| 39 | 4.50 | [Director, Marketing - Figma Weave (New York, United States)](https://boards.greenhouse.io/figma/jobs/6112135004?gh_jid=6112135004) | New York, NY | full-time · hub | video, community, brand, storytelling, Figma | | |
| 40 | 4.50 | [Events Manager - Figma Weave (New York, United States)](https://boards.greenhouse.io/figma/jobs/6126728004?gh_jid=6126728004) | New York, NY | full-time · hub | video, community, brand, branding, Figma | | |
| 41 | 4.50 | [Field Marketing Manager, Third Party & Partner Events](https://boards.greenhouse.io/figma/jobs/6141213004?gh_jid=6141213004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, documentation, community, brand, Figma | | |
| 42 | 4.50 | [GTM Systems Architect](https://boards.greenhouse.io/figma/jobs/6167305004?gh_jid=6167305004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, documentation, community, Figma, SQL | | |
| 43 | 4.50 | [Manager, Customer Enablement (Tokyo, Japan)](https://boards.greenhouse.io/figma/jobs/6144873004?gh_jid=6144873004) | Tokyo, Japan | full-time · hub | video, community, mentorship, design systems, Figma | | |
| 44 | 4.50 | [Manager, Design - Systems & Infrastructure](https://boards.greenhouse.io/figma/jobs/6135656004?gh_jid=6135656004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, documentation, community, design systems, Figma | | |
| 45 | 4.50 | [Manager, Product Management - Roundtripping](https://boards.greenhouse.io/figma/jobs/6104919004?gh_jid=6104919004) | New York, NY · United States | full-time · hub | evals, MCP, video, community, Figma | | |
| 46 | 4.50 | [Manager, Product Management - Roundtripping (London, United Kingdom)](https://boards.greenhouse.io/figma/jobs/6149007004?gh_jid=6149007004) | London, England | full-time · hub | evals, MCP, video, community, Figma | | |
| 47 | 4.50 | [Manager, Recruiting - Sales](https://boards.greenhouse.io/figma/jobs/6191697004?gh_jid=6191697004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, brand, brand strategy, Figma | | |
| 48 | 4.50 | [Manager, Software Engineering - Growth Platform](https://boards.greenhouse.io/figma/jobs/6010279004?gh_jid=6010279004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | learning, video, community, brand, Figma | | |
| 49 | 4.50 | [Manager, Software Engineering - Interaction Design](https://boards.greenhouse.io/figma/jobs/5778796004?gh_jid=5778796004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, mentoring, Figma, prototyping | | |
| 50 | 4.50 | [Manager, Solutions Consulting (Tokyo, Japan)](https://boards.greenhouse.io/figma/jobs/6134908004?gh_jid=6134908004) | Tokyo, Japan | unstated | video, community, mentorship, Figma, prototyping | | |
| 51 | 4.50 | [Product Designer, Design Systems](https://boards.greenhouse.io/figma/jobs/5787576004?gh_jid=5787576004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, mentoring, design systems, Figma | | |
| 52 | 4.50 | [Program Manager, Scale Onboarding (London, United Kingdom)](https://boards.greenhouse.io/figma/jobs/6130540004?gh_jid=6130540004) | London, England | full-time · hub | education, learning, video, community, Figma | | |
| 53 | 4.50 | [Senior Accountant](https://boards.greenhouse.io/figma/jobs/6119198004?gh_jid=6119198004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | Claude, ChatGPT, video, community, Figma | | |
| 54 | 4.50 | [Software Engineer - Developer Experience](https://boards.greenhouse.io/figma/jobs/5790627004?gh_jid=5790627004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | video, community, Figma, Python, TypeScript | | |
| 55 | 4.50 | [Strategic Partner Manager](https://boards.greenhouse.io/figma/jobs/6146574004?gh_jid=6146574004) | San Francisco, CA · New York, NY · United States | full-time · US remote OK | MCP, video, community, brand, Figma | | |

## Skipped postings (97) — below threshold, excluded title, or zero skill hits

<details><summary>Show skipped</summary>

| Title | Location | Reason |
|---|---|---|
| Account Executive, Enterprise | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Account Executive, Enterprise (Bengaluru, India) | Bengaluru, India | score 2.5 below threshold 4.0 |
| Account Executive, Enterprise (Berlin, Germany) | Berlin, Germany | score 2.5 below threshold 4.0 |
| Account Executive, Enterprise (Paris, France) | Paris, France | score 2.5 below threshold 4.0 |
| Account Executive, Enterprise (Sydney or Melbourne, Australia) | Sydney, Australia • Melbourne, Australia | score 2.5 below threshold 4.0 |
| Account Executive, Enterprise (Tokyo, Japan) | Tokyo, Japan | score 2.5 below threshold 4.0 |
| Account Executive, Enterprise, Mandarin Speaking (Singapore) | Singapore | score 2.5 below threshold 4.0 |
| Account Executive, Federal - Civilian | Washington, DC | score 3.5 below threshold 4.0 |
| Account Executive, Mid-Market | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Account Executive, Mid-Market (London, United Kingdom) | London, England | score 2.5 below threshold 4.0 |
| Account Executive, Mid-Market (Paris, France) | Paris, France | score 2.5 below threshold 4.0 |
| Account Executive, Mid-Market (Sydney, Australia) | Sydney, Australia | score 2.5 below threshold 4.0 |
| Account Executive, Mid-Market, Mandarin Speaking (Singapore) | Singapore | score 3.5 below threshold 4.0 |
| Account Executive, SMB (Berlin, Germany) | Berlin, Germany | score 3.5 below threshold 4.0 |
| Account Executive, SMB (London, United Kingdom) | London, England | score 2.5 below threshold 4.0 |
| Account Executive, SMB (Paris, France) | Paris, France | score 3.5 below threshold 4.0 |
| Account Executive, SMB (Tokyo, Japan) | Tokyo, Japan | score 3.5 below threshold 4.0 |
| Account Executive, Strategic | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Account Executive, Strategic (Paris, France) | Paris, France | score 2.5 below threshold 4.0 |
| Account Executive, Strategic (Sydney or Melbourne, Australia) | Sydney, Australia • Melbourne, Australia | score 2.5 below threshold 4.0 |
| Account Executive, Strategic (Tokyo, Japan) | Tokyo, Japan | score 2.5 below threshold 4.0 |
| Brand Design Intern (Summer 2027) | San Francisco, CA | excluded-by-title |
| Brand Events Manager | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Business Operations | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Business Recruiter (São Paulo, Brazil) | São Paulo, Brazil | score 2.5 below threshold 4.0 |
| Customer Enablement Manager (Berlin, Germany) | Berlin, Germany | score 2.5 below threshold 4.0 |
| Customer Enablement Manager (London, United Kingdom) | London, England | score 2.5 below threshold 4.0 |
| Customer Enablement Manager (Paris, France) | Paris, France | score 2.5 below threshold 4.0 |
| Customer Enablement Manager (São Paulo, Brazil) | São Paulo, Brazil | score 2.5 below threshold 4.0 |
| Data Science Intern (2027) | San Francisco, CA • New York, NY | excluded-by-title |
| Director, Business Operations | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Director, Business Systems | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Director, Enterprise Sales (London, United Kingdom) | London, England | score 2.5 below threshold 4.0 |
| Director, People Partners - Product, Design & Engineering | San Francisco, CA | score 2.5 below threshold 4.0 |
| Director, SMB Sales (London, United Kingdom) | London, England | score 2.5 below threshold 4.0 |
| Director, Solutions Consulting | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Director, Strategic Sales (Berlin, Germany) | Berlin, Germany | score 2.5 below threshold 4.0 |
| Director, Technical Revenue Accounting | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Distribution Partner Manager | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Events Manager | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Executive Assistant, Chief People Officer | San Francisco, CA | score 2.5 below threshold 4.0 |
| Executive Assistant, Design | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Executive Assistant, People | San Francisco, CA | score 2.5 below threshold 4.0 |
| Executive Assistant, Sales (São Paulo, Brazil) | São Paulo, Brazil | score 3.5 below threshold 4.0 |
| Executive Communications Manager | San Francisco, CA • New York, NY | score 3.5 below threshold 4.0 |
| Executive Recruiter | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Federal Compliance Manager | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Immigration Program Manager | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Inside Sales Representative (Berlin, Germany) | Berlin, Germany | score 3.5 below threshold 4.0 |
| Inside Sales Representative (Paris, France) | Paris, France | score 3.5 below threshold 4.0 |
| Manager, Distribution Partnerships | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Manager, Enterprise Sales | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Manager, HRIS | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Manager, Inside Sales (London, United Kingdom) | London, England | score 2.5 below threshold 4.0 |
| Manager, Mid-Market Sales (Berlin, Germany) | Berlin, Germany | score 3.5 below threshold 4.0 |
| Manager, Mid-Market Sales (London, United Kingdom) | London, England | score 3.5 below threshold 4.0 |
| Manager, Product Management - Figma Platform Experience | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Manager, Recruiting - Corporate | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Manager, SMB Sales | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Manager, Security Operations | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Manager, Software Engineering - Billing | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Manager, Software Engineering - Data Platform | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Manager, Strategic Sales | San Francisco, CA • New York, NY | score 2.5 below threshold 4.0 |
| Onboarding Manager, Customer Experience (Tokyo, Japan) | Tokyo, Japan | score 3.5 below threshold 4.0 |
| Product Design Intern (2027) | San Francisco, CA • New York, NY | excluded-by-title |
| Product Designer, AI Models | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Product Designer, CMS | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Product Manager, AI Growth | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Product Manager, Acquisition | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Product Partner Manager | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Recruiter (Singapore) | Singapore | score 2.5 below threshold 4.0 |
| Security Engineer | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Senior Account Executive, SMB | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Senior Account Executive, UK Government (London, United Kingdom) | London, England | score 2.5 below threshold 4.0 |
| Senior Analyst, Revenue Transformation | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Senior Field Enablement Manager (Tokyo, Japan) | Tokyo, Japan | score 2.5 below threshold 4.0 |
| Senior Manager, Enterprise Sales (London, United Kingdom) | London, England | score 3.5 below threshold 4.0 |
| Senior Product Counsel | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Senior Technical Revenue Analyst | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Software Engineer - Application Platform | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Software Engineer - Mobile Web | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Software Engineer - Traffic | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Software Engineer Intern (London, United Kingdom) (Summer 2027) | London, England | excluded-by-title |
| Software Engineer Intern (Summer 2027) | San Francisco, CA • New York, NY | excluded-by-title |
| Software Engineer Intern (Winter 2027) | San Francisco, CA • New York, NY | excluded-by-title |
| Solutions Consultant | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Solutions Consultant (Berlin, Germany) | Berlin, Germany | score 2.5 below threshold 4.0 |
| Solutions Consultant (London, United Kingdom) | London, England | score 2.5 below threshold 4.0 |
| Solutions Consultant (Sydney, Australia) | Sydney, Australia | score 2.5 below threshold 4.0 |
| Solutions Consultant, Payload | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Strategic Finance | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Strategic Program Manager, Information Security | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Technical Account Manager | San Francisco, CA • New York, NY • United States | score 3.8 below threshold 4.0 |
| Technical Program Manager | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Technical Program Manager - Infrastructure | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |
| Technical Quality Specialist | San Francisco, CA • New York, NY • United States | score 3.5 below threshold 4.0 |
| Voice of the Customer Program Manager | San Francisco, CA • New York, NY • United States | score 2.5 below threshold 4.0 |

</details>

## Justification detail (every rule that fired, per relevant posting)

<details><summary>Show justifications</summary>

**Software Engineer - AI Product** — https://boards.greenhouse.io/figma/jobs/5551730004?gh_jid=5551730004 — score 12.00, first published 2025-06-02

- skill «machine learning» (skills.ai_ml[0]) appears in posting content +1.0
- skill «generative AI» (skills.ai_ml[3]) appears in posting content +1.0
- skill «Claude» (skills.ai_platforms[0]) appears in posting content +1.0
- skill «ChatGPT» (skills.ai_platforms[5]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentorship» (skills.education_content[25]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- skill «GitHub» (skills.languages_tools[11]) appears in posting content +1.0
- degree term «PhD» (education[2].degree) appears in posting content +0.5
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**AI Applied Scientist** — https://boards.greenhouse.io/figma/jobs/5707966004?gh_jid=5707966004 — score 11.50, first published 2025-12-17

- skill «machine learning» (skills.ai_ml[0]) appears in posting content +1.0
- skill «deep learning» (skills.ai_ml[1]) appears in posting content +1.0
- skill «reinforcement learning» (skills.ai_ml[2]) appears in posting content +1.0
- skill «generative AI» (skills.ai_ml[3]) appears in posting content +1.0
- skill «prompt engineering» (skills.ai_ml[9]) appears in posting content +1.0
- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- 3 further skill hits not counted (scheme.max_skill_hits=12)
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Forward Deployed Engineer** — https://boards.greenhouse.io/figma/jobs/6158162004?gh_jid=6158162004 — score 11.50, first published 2026-08-25

- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «prompt engineering» (skills.ai_ml[9]) appears in posting content +1.0
- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «brand» (skills.design_visualization[4]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- 3 further skill hits not counted (scheme.max_skill_hits=12)
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Marketing Engineer** — https://boards.greenhouse.io/figma/jobs/6013495004?gh_jid=6013495004 — score 11.50, first published 2026-06-05

- skill «generative AI» (skills.ai_ml[3]) appears in posting content +1.0
- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «n8n» (skills.ai_platforms[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- 3 further skill hits not counted (scheme.max_skill_hits=12)
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Product Designer, Roundtripping (London, United Kingdom)** — https://boards.greenhouse.io/figma/jobs/6193686004?gh_jid=6193686004 — score 11.50, first published 2026-09-16

- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «Claude» (skills.ai_platforms[0]) appears in posting content +1.0
- skill «Claude Code» (skills.ai_platforms[1]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «storytelling» (skills.design_visualization[8]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- skill «typography» (skills.design_visualization[13]) appears in posting content +1.0
- location «London, England» is neither remote nor «Boston» -1.0

**Software Engineer - Full Stack** — https://boards.greenhouse.io/figma/jobs/5691911004?gh_jid=5691911004 — score 11.50, first published 2025-11-01

- skill «Claude» (skills.ai_platforms[0]) appears in posting content +1.0
- skill «ChatGPT» (skills.ai_platforms[5]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «FigJam» (skills.design_visualization[11]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- skill «React» (skills.languages_tools[3]) appears in posting content +1.0
- skill «C++» (skills.languages_tools[6]) appears in posting content +1.0
- skill «GitHub» (skills.languages_tools[11]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Software Engineer - Machine Learning** — https://boards.greenhouse.io/figma/jobs/5551532004?gh_jid=5551532004 — score 11.50, first published 2025-06-02

- skill «machine learning» (skills.ai_ml[0]) appears in posting title +1.0
- skill «generative AI» (skills.ai_ml[3]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting title +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «C++» (skills.languages_tools[6]) appears in posting content +1.0
- skill «PyTorch» (skills.languages_tools[13]) appears in posting content +1.0
- 1 further skill hits not counted (scheme.max_skill_hits=12)
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Software Engineer - AI Product (London, United Kingdom)** — https://boards.greenhouse.io/figma/jobs/5551697004?gh_jid=5551697004 — score 10.75, first published 2025-06-02

- skill «generative AI» (skills.ai_ml[3]) appears in posting content +1.0
- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- skill «React» (skills.languages_tools[3]) appears in posting content +1.0
- skill «Dev Mode» (skills.familiar_with_not_shipped[3]) appears in posting content +0.25
- location «London, England» is neither remote nor «Boston» -1.0

**Software Engineer - C++** — https://boards.greenhouse.io/figma/jobs/5552530004?gh_jid=5552530004 — score 10.75, first published 2025-06-02

- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- skill «JavaScript» (skills.languages_tools[2]) appears in posting content +1.0
- skill «React» (skills.languages_tools[3]) appears in posting content +1.0
- skill «C++» (skills.languages_tools[6]) appears in posting title +1.0
- skill «Rust» (skills.familiar_with_not_shipped[1]) appears in posting content +0.25
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Software Engineering - DevEx AI Tools** — https://boards.greenhouse.io/figma/jobs/6008752004?gh_jid=6008752004 — score 9.50, first published 2026-06-03

- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «Claude» (skills.ai_platforms[0]) appears in posting content +1.0
- skill «Claude Code» (skills.ai_platforms[1]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «Model Context Protocol» (skills.ai_platforms[4]) appears in posting content +1.0
- skill «n8n» (skills.ai_platforms[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Software Engineer - Growth & Monetization** — https://boards.greenhouse.io/figma/jobs/5552560004?gh_jid=5552560004 — score 9.50, first published 2025-06-02

- skill «teaching» (skills.education_content[5]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- skill «React» (skills.languages_tools[3]) appears in posting content +1.0
- skill «C++» (skills.languages_tools[6]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Data Scientist, Core Data -  PhD (2026)** — https://boards.greenhouse.io/figma/jobs/5976930004?gh_jid=5976930004 — score 9.00, first published 2026-04-22

- skill «machine learning» (skills.ai_ml[0]) appears in posting content +1.0
- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «SQL» (skills.languages_tools[5]) appears in posting content +1.0
- skill «R» (skills.languages_tools[7]) appears in posting content +1.0
- degree term «PhD» (education[2].degree) appears in posting content +0.5
- location «San Francisco, CA • New York, NY» is neither remote nor «Boston» -1.0

**Software Engineer - Figma Weave (Tel Aviv, Israel)** — https://boards.greenhouse.io/figma/jobs/6073106004?gh_jid=6073106004 — score 8.75, first published 2026-06-17

- skill «teaching» (skills.education_content[5]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting title +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- skill «React» (skills.languages_tools[3]) appears in posting content +1.0
- skill «Node.js» (skills.languages_tools[4]) appears in posting content +1.0
- skill «Rust» (skills.familiar_with_not_shipped[1]) appears in posting content +0.25
- location «Tel Aviv, Israel» is neither remote nor «Boston» -1.0

**Software Engineer - AI Platforms** — https://boards.greenhouse.io/figma/jobs/5691886004?gh_jid=5691886004 — score 8.50, first published 2025-11-01

- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Designer Advocate** — https://boards.greenhouse.io/figma/jobs/6176134004?gh_jid=6176134004 — score 7.50, first published 2026-09-01

- skill «AI-assisted design» (skills.ai_ml[19]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «advocacy» (skills.education_content[22]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «public speaking» (skills.education_content[24]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Software Engineering - AI Observability** — https://boards.greenhouse.io/figma/jobs/5807963004?gh_jid=5807963004 — score 7.50, first published 2026-02-27

- skill «machine learning» (skills.ai_ml[0]) appears in posting content +1.0
- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Product Designer, Design, Dev, & AI Tools** — https://boards.greenhouse.io/figma/jobs/5711468004?gh_jid=5711468004 — score 7.50, first published 2025-11-21

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «storytelling» (skills.design_visualization[8]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- skill «typography» (skills.design_visualization[13]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Product Designer, Growth & Monetization** — https://boards.greenhouse.io/figma/jobs/5711595004?gh_jid=5711595004 — score 7.50, first published 2025-11-21

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «advocacy» (skills.education_content[22]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «storytelling» (skills.design_visualization[8]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- skill «typography» (skills.design_visualization[13]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Software Engineer - Data Infrastructure** — https://boards.greenhouse.io/figma/jobs/5551686004?gh_jid=5551686004 — score 7.50, first published 2025-06-02

- skill «machine learning» (skills.ai_ml[0]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «SQL» (skills.languages_tools[5]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Software Engineer - Graphics & Media** — https://boards.greenhouse.io/figma/jobs/5552522004?gh_jid=5552522004 — score 7.50, first published 2025-06-02

- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentorship» (skills.education_content[25]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «FigJam» (skills.design_visualization[11]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- skill «C++» (skills.languages_tools[6]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Researcher, Figma Agentic Experiences** — https://boards.greenhouse.io/figma/jobs/5651744004?gh_jid=5651744004 — score 6.75, first published 2025-09-17

- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentorship» (skills.education_content[25]) appears in posting content +1.0
- skill «storytelling» (skills.design_visualization[8]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting title +1.0
- skill «UX research» (skills.familiar_with_not_shipped[5]) appears in posting content +0.25
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Designer Advocate (London, United Kingdom)** — https://boards.greenhouse.io/figma/jobs/6122399004?gh_jid=6122399004 — score 6.50, first published 2026-07-23

- skill «AI-assisted design» (skills.ai_ml[19]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «advocacy» (skills.education_content[22]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- location «London, England» is neither remote nor «Boston» -1.0

**Product Manager, Developer Platform** — https://boards.greenhouse.io/figma/jobs/6100482004?gh_jid=6100482004 — score 6.50, first published 2026-07-10

- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «Claude» (skills.ai_platforms[0]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «ChatGPT» (skills.ai_platforms[5]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Support Engineer, AI Infrastructure & Tooling** — https://boards.greenhouse.io/figma/jobs/5802956004?gh_jid=5802956004 — score 6.50, first published 2026-02-12

- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «RAG» (skills.ai_ml[13]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «C++» (skills.languages_tools[6]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Designer Advocate, Partnerships** — https://boards.greenhouse.io/figma/jobs/6114301004?gh_jid=6114301004 — score 5.75, first published 2026-07-13

- skill «AI-assisted design» (skills.ai_ml[19]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- skill «design tokens» (skills.familiar_with_not_shipped[4]) appears in posting content +0.25
- location «San Francisco, CA» is neither remote nor «Boston» -1.0

**Software Engineer - Distributed Systems** — https://boards.greenhouse.io/figma/jobs/5552549004?gh_jid=5552549004 — score 5.75, first published 2025-06-02

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- skill «Rust» (skills.familiar_with_not_shipped[1]) appears in posting content +0.25
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Data Scientist, Finance** — https://boards.greenhouse.io/figma/jobs/6013304004?gh_jid=6013304004 — score 5.50, first published 2026-06-12

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «SQL» (skills.languages_tools[5]) appears in posting content +1.0
- skill «Git» (skills.languages_tools[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Director, Data Science** — https://boards.greenhouse.io/figma/jobs/6130865004?gh_jid=6130865004 — score 5.50, first published 2026-07-31

- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Director, Research - AI Evals** — https://boards.greenhouse.io/figma/jobs/6112112004?gh_jid=6112112004 — score 5.50, first published 2026-07-13

- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «evals» (skills.ai_ml[15]) appears in posting title +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Enterprise Support Specialist, Korean Speaking (London, United Kingdom)** — https://boards.greenhouse.io/figma/jobs/6105678004?gh_jid=6105678004 — score 5.50, first published 2026-07-15

- skill «machine learning» (skills.ai_ml[0]) appears in posting content +1.0
- skill «generative AI» (skills.ai_ml[3]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «London, England» is neither remote nor «Boston» -1.0

**IT Engineer, Internal AI Infrastructure** — https://boards.greenhouse.io/figma/jobs/6164379004?gh_jid=6164379004 — score 5.50, first published 2026-08-27

- skill «LLM» (skills.ai_ml[7]) appears in posting content +1.0
- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Solutions Consulting (London, United Kingdom)** — https://boards.greenhouse.io/figma/jobs/6111591004?gh_jid=6111591004 — score 5.50, first published 2026-07-09

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentorship» (skills.education_content[25]) appears in posting content +1.0
- skill «storytelling» (skills.design_visualization[8]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- location «London, England» is neither remote nor «Boston» -1.0

**Manager, Technical Support (London, United Kingdom)** — https://boards.greenhouse.io/figma/jobs/6189444004?gh_jid=6189444004 — score 5.50, first published 2026-09-14

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- skill «JavaScript» (skills.languages_tools[2]) appears in posting content +1.0
- location «London, England» is neither remote nor «Boston» -1.0

**Security Scientist** — https://boards.greenhouse.io/figma/jobs/6180172004?gh_jid=6180172004 — score 5.50, first published 2026-09-09

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «SQL» (skills.languages_tools[5]) appears in posting content +1.0
- skill «R» (skills.languages_tools[7]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Technical Account Manager, Mandarin Speaking (Singapore)** — https://boards.greenhouse.io/figma/jobs/6113161004?gh_jid=6113161004 — score 4.75, first published 2026-08-09

- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Dev Mode» (skills.familiar_with_not_shipped[3]) appears in posting content +0.25
- location «Singapore» is neither remote nor «Boston» -1.0

**Technical Account Manager (Tokyo, Japan)** — https://boards.greenhouse.io/figma/jobs/6006175004?gh_jid=6006175004 — score 4.75, first published 2026-05-27

- skill «AI agents» (skills.ai_ml[11]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Dev Mode» (skills.familiar_with_not_shipped[3]) appears in posting content +0.25
- location «Tokyo, Japan» is neither remote nor «Boston» -1.0

**Account Executive, SMB** — https://boards.greenhouse.io/figma/jobs/5694259004?gh_jid=5694259004 — score 4.50, first published 2025-11-01

- skill «evaluation» (skills.ai_ml[14]) appears in posting content +1.0
- skill «bootcamp» (skills.education_content[10]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY» is neither remote nor «Boston» -1.0

**Brand Designer,  Product Launches** — https://boards.greenhouse.io/figma/jobs/6131079004?gh_jid=6131079004 — score 4.50, first published 2026-08-14

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «brand» (skills.design_visualization[4]) appears in posting title +1.0
- skill «storytelling» (skills.design_visualization[8]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Director, Marketing - Figma Weave (New York, United States)** — https://boards.greenhouse.io/figma/jobs/6112135004?gh_jid=6112135004 — score 4.50, first published 2026-08-27

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «brand» (skills.design_visualization[4]) appears in posting content +1.0
- skill «storytelling» (skills.design_visualization[8]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting title +1.0
- location «New York, NY» is neither remote nor «Boston» -1.0

**Events Manager - Figma Weave (New York, United States)** — https://boards.greenhouse.io/figma/jobs/6126728004?gh_jid=6126728004 — score 4.50, first published 2026-07-26

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «brand» (skills.design_visualization[4]) appears in posting content +1.0
- skill «branding» (skills.design_visualization[5]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting title +1.0
- location «New York, NY» is neither remote nor «Boston» -1.0

**Field Marketing Manager, Third Party & Partner Events** — https://boards.greenhouse.io/figma/jobs/6141213004?gh_jid=6141213004 — score 4.50, first published 2026-08-17

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «brand» (skills.design_visualization[4]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**GTM Systems Architect** — https://boards.greenhouse.io/figma/jobs/6167305004?gh_jid=6167305004 — score 4.50, first published 2026-09-01

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «SQL» (skills.languages_tools[5]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Customer Enablement (Tokyo, Japan)** — https://boards.greenhouse.io/figma/jobs/6144873004?gh_jid=6144873004 — score 4.50, first published 2026-08-17

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentorship» (skills.education_content[25]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «Tokyo, Japan» is neither remote nor «Boston» -1.0

**Manager, Design - Systems & Infrastructure** — https://boards.greenhouse.io/figma/jobs/6135656004?gh_jid=6135656004 — score 4.50, first published 2026-08-14

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «documentation» (skills.education_content[14]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Product Management - Roundtripping** — https://boards.greenhouse.io/figma/jobs/6104919004?gh_jid=6104919004 — score 4.50, first published 2026-07-24

- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Product Management - Roundtripping (London, United Kingdom)** — https://boards.greenhouse.io/figma/jobs/6149007004?gh_jid=6149007004 — score 4.50, first published 2026-08-21

- skill «evals» (skills.ai_ml[15]) appears in posting content +1.0
- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «London, England» is neither remote nor «Boston» -1.0

**Manager, Recruiting - Sales** — https://boards.greenhouse.io/figma/jobs/6191697004?gh_jid=6191697004 — score 4.50, first published 2026-09-16

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «brand» (skills.design_visualization[4]) appears in posting content +1.0
- skill «brand strategy» (skills.design_visualization[6]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Software Engineering - Growth Platform** — https://boards.greenhouse.io/figma/jobs/6010279004?gh_jid=6010279004 — score 4.50, first published 2026-06-03

- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «brand» (skills.design_visualization[4]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Software Engineering - Interaction Design** — https://boards.greenhouse.io/figma/jobs/5778796004?gh_jid=5778796004 — score 4.50, first published 2026-01-22

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Manager, Solutions Consulting (Tokyo, Japan)** — https://boards.greenhouse.io/figma/jobs/6134908004?gh_jid=6134908004 — score 4.50, first published 2026-08-06

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentorship» (skills.education_content[25]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «prototyping» (skills.design_visualization[12]) appears in posting content +1.0
- location «Tokyo, Japan» is neither remote nor «Boston» -1.0

**Product Designer, Design Systems** — https://boards.greenhouse.io/figma/jobs/5787576004?gh_jid=5787576004 — score 4.50, first published 2026-08-14

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «mentoring» (skills.education_content[26]) appears in posting content +1.0
- skill «design systems» (skills.design_visualization[3]) appears in posting title +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Program Manager, Scale Onboarding (London, United Kingdom)** — https://boards.greenhouse.io/figma/jobs/6130540004?gh_jid=6130540004 — score 4.50, first published 2026-08-04

- skill «education» (skills.education_content[6]) appears in posting content +1.0
- skill «learning» (skills.education_content[8]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «London, England» is neither remote nor «Boston» -1.0

**Senior Accountant** — https://boards.greenhouse.io/figma/jobs/6119198004?gh_jid=6119198004 — score 4.50, first published 2026-07-21

- skill «Claude» (skills.ai_platforms[0]) appears in posting content +1.0
- skill «ChatGPT» (skills.ai_platforms[5]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Software Engineer - Developer Experience** — https://boards.greenhouse.io/figma/jobs/5790627004?gh_jid=5790627004 — score 4.50, first published 2026-02-03

- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- skill «Python» (skills.languages_tools[0]) appears in posting content +1.0
- skill «TypeScript» (skills.languages_tools[1]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

**Strategic Partner Manager** — https://boards.greenhouse.io/figma/jobs/6146574004?gh_jid=6146574004 — score 4.50, first published 2026-08-21

- skill «MCP» (skills.ai_platforms[3]) appears in posting content +1.0
- skill «video» (skills.education_content[11]) appears in posting content +1.0
- skill «community» (skills.education_content[23]) appears in posting content +1.0
- skill «brand» (skills.design_visualization[4]) appears in posting content +1.0
- skill «Figma» (skills.design_visualization[10]) appears in posting content +1.0
- location «San Francisco, CA • New York, NY • United States» is neither remote nor «Boston» -1.0

</details>

---
*Generated by `greenhouse_watch.py`; formatted for review by the maintainer. Verdict kind for every row: `record-based rule`. The person decides.*