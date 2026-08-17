# Introduction

It is week six. A student — call her Mira, an F-1 graduate three months out from her degree — has sent two hundred applications. The cover letters are clean. The résumés are tailored. The dashboard says she is working hard, and she is. What the dashboard does not say is that a third of the postings were ghost listings that were never going to hire anyone, that more than half of the companies have never filed a single visa petition, and that her ninety-day OPT unemployment clock has thirty-one days left on it. Every application *looked* like progress. Almost none of it was. She did not have a motivation problem. She had an allocation problem — and no instrument that could tell the difference between effort and progress before the deadline did it for her.

This book is about that instrument: a method, and a working machine, for running a high-stakes search without surrendering the judgment the search depends on.

## The argument, in one breath

The first sign of trouble is usually not failure. It is fluency.

A draft looks clean. An answer sounds reasonable. A chart has labels, the code runs, the plan has phases. Nothing on the surface announces that a human still has work to do. AI has made that surface cheap to produce — and in making *execution* cheap, it has left *judgment* scarce and more valuable, not less. That is the testable claim of this book, and you can watch it fail or hold in your own search: when execution costs nothing, the polished artifact stops being evidence of anything. A randomized trial of engineers learning a new library found that those who delegated to AI scored about seventeen points lower on a comprehension test than those who hand-coded — two letter grades — while *feeling* they had learned more.[^00-anthropic] The fluency of the output was indistinguishable from the feeling of mastery. The mastery was not there.

The Reallocation Engine points that general claim at one concrete problem. A student with sixty to ninety days to find a sponsoring employer cannot afford to spend judgment evenly. The engine's whole purpose is to **reallocate scarce effort** — away from polished-looking cold applications that the evidence says will go nowhere, and toward the few roles where a record, not a feeling, says effort can matter. The machine does the parts that can be grounded in records and audits. You do the part that cannot be delegated: deciding whether a role is worth a day of your life.

## Who this is for

This is for the international student on the clock, for the career advisors and Humanitarians AI fellows who work alongside them, and for anyone who wants to see what disciplined human–AI collaboration looks like when a real deadline removes the option of self-deception.

## What this book is

It is a **book** and a **working machine** at once. The chapters in `chapters/` teach a method for using AI in a high-stakes search. The same repository contains the scripts, data, and operating recipes that *run* that method — you can clone it, open a terminal, type a command, and get a sourced Apply / Consider / Skip decision about a real role. The book is not a description of a system that lives somewhere else. The book *is* the system, explained.

Along the way it teaches a vocabulary you will use for the rest of your working life, well past this one search. The **fluency trap**: a confident output is not a correct one. The **phase gate**: the explicit point where AI execution stops and human judgment begins — not where you trust the machine less, but where the cognitive work is irreducibly yours. The **verified-data contract**: every number traces to a source, and a figure with no record behind it is decoration, labeled as such. **Gates versus votes**: some facts veto a role outright (a dead posting, an impossible visa timeline) rather than merely lowering its score. And the deeper division underneath all of it — the one this whole series turns on — between what machines now do superbly (pattern-finding, retrieval, drafting, formatting: call it Tier 1) and what remains stubbornly human: auditing an output for plausibility, formulating the right question, reasoning about cause, and being accountable for a decision once it leaves the screen. AI has decisively won the first. The premium, and the danger, both live in the second.

A short list of principles runs through everything here. If you understand these, the rest is detail.

1. **Run the script and read the audit before you prompt.** Verified local data comes before an AI's guess, every time. The engine reads records; it does not improvise them.
2. **Never invent a count, a rate, a match quality, or a confidence.** Every number traces to a source.
3. **Liveness and timeline are gates, not votes.** A dead posting or an impossible visa timeline zeroes a role no matter how good it looks.
4. **Skip is a successful outcome.** A healthy run skips at least half the roles it evaluates. The engine's value is in the applications it talks you *out of*.
5. **Machines verify conformance; humans verify adequacy.** A script can prove a file parses. Only you can decide whether the decision it produced is one you should act on.

These five are a domain-specific reading of a more general framework. Open `SNICKERDOODLE.md` and you will find the constitution this repository is built on — an agent-operating-system that treats a project as a contract between human judgment and AI execution. It names principles, defines hard gates cleared by a named human and logged, sets a lifecycle for every recipe from `DRAFT` to `VERIFIED`, and insists that provenance, never deletion, and honest logging are not optional. The Reallocation Engine is one *domain* governed by it; `DOMAIN.md` is where everything specific to this repository lives. Snickerdoodle is treated lightly here — named, leaned on, not fully unpacked — because this is a book about a job search, not about the framework. The strict, general version is written separately; this repository is the worked example.

## What this book is not

It is not immigration counsel. Nothing here is legal advice; every visa rule must be checked against current USCIS guidance and a qualified attorney before you act. It is not a manual for gaming applicant-tracking systems, and it argues against misrepresentation of any kind — the hard rule against misrepresenting yourself overrides every framing suggestion in these pages. It assumes you can open a terminal and run a command; it does not assume you can program. And it is not a general AI textbook. It is one search, run honestly, as a way of teaching a discipline that travels.

## The fluency trap, running underneath

There is one idea the whole engine exists to defend, and it is worth naming before you meet it twenty times. Genuine understanding is built by *friction* — by the struggle of working something out yourself. Remove the friction and you remove the thing that was supposed to be built. The job-search version is exact: an AI can remove the friction of *writing* a hundred applications, and in doing so remove the friction of *deciding* which one deserves the writing. The clean output stands in for the judgment that never happened. The engine's design is a refusal of that substitution. It automates the execution — drafting, formatting, retrieval, scoring — and then, at a deliberate gate, it stops and hands you back the decision, with its sources labeled, so the part that is irreducibly yours stays yours. The skip rate is the visible proof that the gate is working: a healthy run argues you *out of* most of what you were about to do.

## How this book is organized

The book moves in four movements, then a synthesis.

- **Chapters 1–3 — the core method.** *The Fluency Trap* (Ch. 1): fluency is not correctness. *The Reallocation Principle* (Ch. 2): effort must be reallocated by expected return. *The Verified-Data Contract* (Ch. 3): every factual claim traces to a source or is labeled as decoration.
- **Chapters 4–5 — the discipline.** *Two Customers* (Ch. 4): a recipe is written for two readers at once, the AI agent and the human. *Verifying the Data* (Ch. 5): verified records still need epistemic interrogation.
- **Chapters 6–13 — the evidence components.** *Where the Money Went: SEC Form D* (Ch. 6), *Who Sponsors: The 80 Days Sponsorship Scorer* (Ch. 7), *Is the Job Real: ATS Detection and Liveness* (Ch. 8), *Is the Role Any Good: BLS / O\*NET Role Quality* (Ch. 9), *The Visa Timeline Manager* (Ch. 10), *The Bayesian Role Scorer* (Ch. 11) that composes them, *The OPT Framing Generator* (Ch. 12), and *Resumes That Survive the Filter* (Ch. 13).
- **Chapters 14–16 — operating the engine.** *Recipes: Operating the Engine* (Ch. 14), *The Pipeline Tracker and the Skip Rate* (Ch. 15), and *The Build and the Honest Run* (Ch. 16) — the first honest, gated, end-to-end run.
- **Chapter 97 — synthesis.** The load-bearing themes, gathered. An appendix of best practices closes the book.

To orient yourself in the repository, start with `_MANIFEST.md` — the read-first map of what is canonical, what is task-relevant, and what to ignore (its machine-readable twin is `.ai/manifest.yaml`). From there, `DOMAIN.md` tells you what the project *is* and what is runnable today; `SNICKERDOODLE.md` tells you what governs it; `logs/RUN_LOG.md` tells you what has actually been run; `status.md` tells you where things stand now. A couple of minutes there and you can navigate without reading the whole tree.

## How to read this book

You do not have to read it front to back before touching the machine. The chapters are written to be self-contained — you can drop into Chapter 7 to understand sponsorship and it will hold. Each chapter closes with the same features: a *What would change my mind* prompt, a *Still puzzling* note, and exercises that push you to run, trace, and break the thing rather than just read about it. But the fastest way to understand the argument is to watch the engine make one decision and trace it. With the repository open in a terminal:

1. **Read the orientation files.** Open `_MANIFEST.md`, then `SNICKERDOODLE.md` and `DOMAIN.md`. Five minutes. You now know what to read, what governs the engine, and what actually works.
2. **Check the environment.** Run `npm run doctor`. It reports what tools are installed and which commands have real scripts behind them — an honest map of the runnable surface.
3. **Run the decision core and trace it.** Run `npm run score data/examples/ch11-roles.json`, then open the audit at `data/examples/role-scores.md`. Pick one row and read it term by term: sponsorship, fit, liveness, timeline — each labeled *record*, *model-judgment*, or *your-input*. If you cannot explain a recommendation from its sources, distrust the recommendation before you distrust your confusion.
4. **Read Chapter 1.** Open `chapters/01-the-fluency-trap.md`. The idea you just watched the scorer enforce — that a confident output is not a correct one — is the idea the whole engine exists to defend.

## A note about AI

This book asks you to use AI more aggressively than most career advice would, and to trust it less. Both at once. That is not a contradiction; it is the whole method.

Use it aggressively for what it is genuinely superb at — the Tier 1 work. Let it draft the cover letter, reformat the résumé into ATS-safe plain structure, summarize a ten-K, extract the sponsorship history from a filing, generate five framings of the same experience for the OPT conversation. This work is real, it is tedious, and the engine automates it without apology. The labor market is, in fact, paying for exactly this combination: the wage premium attached to validated AI skill is large and growing, and it lands not on people who abandoned their field to become generic technologists but on domain experts who kept their judgment and added AI fluency on top.[^00-premium] The arrow that pays is *your domain plus AI*, not *your domain, traded in for AI*.

Trust it less for the work on the other side of the gate. An applicant-tracking system will screen your résumé with AI and may auto-reject it with no human in the loop[^00-screening]; a match-score vendor will rank you with a model whose bias you cannot see.[^00-eightfold] These are AI systems making consequential judgments about you, fluently and without accountability. The engine's response is not to fight fluency with more fluency. It is to insist on records the machine cannot fake: who has actually filed visa petitions, whether a posting is actually live, whether a role actually clears the BLS / O\*NET bar, whether the visa timeline is actually possible. Some of those facts are *gates* — they veto a role outright rather than nudging a score — because a dead posting and an impossible deadline are not weak signals to be averaged away.[^opt]

There is a specific trap the deadline makes vivid. The same weights that produce an AI's confident output are the weights that would have to audit it, which is why a model cannot reliably flag its own errors — the plausibility check has to come from outside the model, from a human with real stakes. You are that human. The machine cannot know that this particular role, with this particular team, in this particular city, is one you would actually take; it cannot be accountable for the day of your life the application costs; it cannot tell you when to stop. Those are not temporary gaps that the next model closes. They are the permanent shape of the division of labor. The engine is built to make that shape visible: AI executes up to the gate, and at the gate it hands you a decision with every source labeled — *record*, *model-judgment*, or *your-input* — so you can do the one thing it cannot, which is decide. These chapters also integrate with **Medhavy** (also **Medhavi**), an AI-powered intelligent-textbook system, where they become adaptive practice — hints, worked examples, feedback loops. Even there, the learning target stays human.

## Begin

Mira's problem was never effort. It was that nothing told her, before the clock did, where the effort was worth spending. So open the repository. Do not ask first whether the engine looks impressive. Ask what would have to be true for one of its decisions to be trusted, what the machine could not know, and what you are now responsible for. Then run the script, read the audit, and begin.

**Tags:** F-1 OPT job search · AI judgment vs execution · the fluency trap · verified-data contract · sponsorship and visa timeline · Snickerdoodle · Humanitarians AI · reallocating scarce effort

[^00-anthropic]: Judy Hanwen Shen & Alex Tamkin, "How AI Impacts Skill Formation," Anthropic, Feb 3 2026 (arXiv:2601.20245). A randomized controlled trial of engineers learning the Trio asynchronous Python library: the AI-assisted group averaged 50% on the comprehension quiz versus 67% for the hand-coding group (~17 points, ≈ two letter grades), with the largest gap on the debugging questions. High-engagement AI use (asking conceptual questions) scored far higher than delegation use (generate, accept, move on); the mechanism is cognitive engagement, not manual typing.
[^00-premium]: Validated-AI-skill wage premium (~56%, 2025) from "The Collapse of the Traditional Résumé" (N. Bear Brown), echoing the PwC 2025 Global AI Jobs Barometer; the premium attaches to AI-fluent domain experts, not domain-abandoning career-switchers. **[verify]** the figure against the primary source before publication.
[^00-screening]: ~82% of companies screen résumés with AI and ~21% auto-reject without human review — "The Collapse of the Traditional Résumé" (N. Bear Brown). **[verify]** against the primary survey.
[^00-eightfold]: Eightfold AI's match-score learning-manager bias, and *Kistler v. Eightfold* (FCRA: disclose the score, allow disputes), from "The Eightfold AI Match Score" (N. Bear Brown). **[verify]** the litigation specifics before publication.
[^opt]: F-1 post-completion OPT: max 90 aggregate days of unemployment (150 with the STEM OPT extension); exceeding it terminates the record with no grace period. USCIS Policy Manual, Vol. 2, Part F, Ch. 5: https://www.uscis.gov/policy-manual/volume-2-part-f-chapter-5
