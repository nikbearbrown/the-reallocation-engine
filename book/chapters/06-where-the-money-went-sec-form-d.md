# Chapter 6 — Where the Money Went: SEC Form D

<!-- voice-anchored: root style/VOICE.md. Anatomy: TIKTOC Part 10.
     Sourced from scripts/sec/README.md, data/80-days-to-stay day logs, CHAPTER-RESEARCH-MAP,
     "80 Days to Stay" essay. Draft. Never published. -->

There is a peculiar asymmetry in the way most people search for jobs. They look where the light is good — the big job boards, the recognizable logos, the company names they have heard of. The light is good there because those companies spent money to put it there. But the companies that most need to hire you right now, the ones sitting on fresh capital and a mandate to grow, often have no light on them at all. They are fourteen people in a converted warehouse in Cambridge. They just raised twelve million dollars. They have never crossed your radar. And the reason they haven't is not that they're obscure — it's that you've been using the wrong map.

The Securities and Exchange Commission maintains a public record of every private fundraise above a certain threshold. When a company closes a seed round, a Series A, a bridge round — when it takes in outside capital through what's called a private offering — it is legally required to file a form disclosing that fact. The form is called Form D. It has been sitting in a publicly accessible database for years, structured and searchable, containing the company name, its address, its industry, the amount raised, and when. In one snapshot of that record, there were over **568,000** companies that had reported raising money, and nearly **247,000** of them had raised at least five million dollars.[^formd]

![A large outer rectangle represents roughly 568,000 companies that filed Form D; a smaller nested rectangle represents the roughly 247,000 that raised at least five million dollars.](../images/06-where-the-money-went-sec-form-d-fig-01.png)
*Figure 6.1 — The Form D corpus and the funded subset*

Almost no job seeker has ever looked at it.

This is not because the data is hard to find. It is because the idea of looking there has not occurred to most people. The job board has trained a generation of candidates to think that companies find workers, not that workers find companies. Form D inverts this. Instead of waiting for a company to post a job, you identify the companies that just received the resources to hire — before the posting exists, before the recruiter has been briefed, often before the hiring manager has even written the job description. You show up earlier in the process, which is almost always an advantage.

The logic is simple enough to state in a sentence: **a company that just raised money is a company under pressure to spend it on people.** Early-stage companies don't raise capital to sit on it. They raise it to execute — and execution, in a young company, means hiring. Funding recency is therefore a leading indicator. A company that filed Form D for a twenty-million-dollar round eight weeks ago will be hiring in the next two quarters with near-certainty. The question is not whether they'll hire. The question is whether you'll know they exist.

This chapter is about making sure you know.

---

The pipeline for turning raw Form D filings into a usable shortlist lives in `scripts/sec/`, and the data it works with lives in `data/sec/form-d/` across three layers: `raw/` holds exactly what the SEC published, `extracted/` holds the parsed output, and `processed/` holds the cleaned and deduplicated result. The three-layer structure matters not for aesthetic reasons but for epistemic ones. If you look at a processed number and wonder where it came from, you can trace it back through extracted and into raw. That traceability is part of a larger contract running through this book: every company, every amount, every date in a real run comes from a filing, not from a guess. The pipeline is the source of truth. The audit log it writes is the receipt.

Running it is a sequence of seven commands:

```bash
cd scripts/sec

# 1. Download the Form D filing archives for the quarters you want
python download-form-d-quarters.py

# 2. Pull in the most recent quarters (keeps the archive current)
python refresh-recent-sec-quarters.py

# 3. Combine quarters into one dataset
python sec-combine-quarters.py

# 4. Filter to real offerings above your funding threshold
python sec-filter.py

# 5. Collapse to one record per company
python sec-unique.py

# 6. Infer each company's web domain
python sec-domain-inference.py

# 7. Flatten to the final processed table
python sec-flatten.py
```

![A seven-step linear pipeline arranged across three horizontal layer bands — raw, extracted, processed — with each step descending toward the processed layer as it moves left to right, and a small audit-receipt marker beside every step.](../images/06-where-the-money-went-sec-form-d-fig-02.png)
*Figure 6.2 — The seven-step Form D pipeline across three layers*

Each step writes its output into the appropriate layer of `data/sec/form-d/` and leaves an audit file alongside it. The final product is a flat table: one row per funded company, with amount, date, industry, location, and — where the inference engine succeeded — a web domain. That last column matters more than it might seem. A company name without a website is a dead end. The domain inference step tries to give you a way in.

The inference works by guessing and verifying URLs from company names. It gets the right answer about sixty-two percent of the time.[^domain] Which means roughly thirty-eight percent of funded companies still need a human to locate the website before anything further can happen. This is not a bug in the pipeline — it is a feature of the problem. Some work cannot be automated, and the pipeline is honest about where it stops and you begin.

---

The hard part of working with Form D is not running the pipeline. It is resisting a mistake that is easy to make once the ranked table is in front of you: sorting by dollar amount and concluding that bigger is better.

It is not.

A two-hundred-million-dollar late-stage round is not a hiring opportunity in the same sense as a six-million-dollar seed. The company that raised two hundred million is probably large enough to have a formal recruiting apparatus — a parser-gated application system, a hundred applicants for every role, a process designed to process. The company that raised six million at fourteen people is a founder who will read your email. The signal in Form D is not the size of the raise. The signal is the combination of recency and company size. A small company that just got funded is a company where you can make a difference and where the people deciding to hire you will know your name.

![A two-by-two quadrant map with funding recency on the horizontal axis and company size on the vertical axis; the small-and-recently-funded bottom-right quadrant is emphasized as the target zone, while large-company quadrants are marked as lower-value leads regardless of raise size.](../images/06-where-the-money-went-sec-form-d-fig-03.png)
*Figure 6.3 — Recency × size beats raise amount*

Recency degrades. The hiring surge that follows a funding announcement is real and it is time-limited. In the quarters immediately after a raise, a company is actively trying to build the team the investors paid for. Eighteen months later, the urgency has passed — either they hired or they didn't, and the fresh-capital energy has moved on to execution. When you filter the table, the recency cutoff matters: within twelve months is a signal; beyond eighteen months is history.

The geography filter matters for obvious reasons. A biotech seed round in San Diego is not a useful lead for someone who needs to work in Boston. But there is a subtler geographic point worth making. Early-stage companies cluster. Cambridge, MA has a density of biotech labs that no job board adequately surfaces. Filtering Form D to a metro area and a relevant industry will often reveal a population of companies that simply does not appear in a normal job search — not because the jobs aren't there, but because the companies haven't yet bought the advertising that makes them visible.

---

Consider a concrete case, the kind of thing that actually happens when you run this pipeline. A data-science graduate is targeting Boston, open to biotech and AI. The pipeline runs over the most recent quarters. Filtering to Massachusetts, raised at least five million, filed within twelve months, sorted by recency, produces a list. Near the top: a few names the graduate recognizes. Three rows down: a Cambridge biotech with a twelve-million-dollar raise eight weeks ago that has no job board presence, no careers page in search results, and no recruiter outreach in anyone's inbox. It exists in this search because it filed a form with the SEC. It would not exist in any other search the graduate might run.

That company goes on the target list above several brand names. Not because it's more prestigious. Because it just got the money, and at its size, a single hire — one good data scientist — changes what they can do. The job board optimizes for visibility. The Form D search optimizes for timing. Timing is almost always worth more.

The limit of this approach is equally concrete and equally worth stating plainly. Form D tells you a company raised money. It does not tell you what they will hire for, whether a given role fits your background, whether they have ever sponsored a visa, or whether the posting you eventually find reflects a real and open position. Funded is a necessary signal. It is not a sufficient one. It narrows the population of companies worth investigating — it does not close the investigation. The next several chapters add the facts that Form D cannot supply: whether the company has the machinery to sponsor visas, whether the specific roles they post match your profile, whether the geography works, and whether the humans at the company are actually responsive.

Think of Form D as triangulation. You are not picking your next employer from this table. You are identifying which companies are worth the effort of deeper research. The companies that make the list are the ones where the effort has a real chance of paying off — where the money is recent, the size is right, and the industry is relevant. Everything else is noise.

---

There is one more thing the pipeline cannot do that is worth being explicit about. Sixty-two percent domain inference sounds like a high number until you think about what the thirty-eight percent represents. Each company in that remainder is a funded firm you cannot easily reach without further work. Some of them are the most interesting leads — small, obscure, operating without a marketing department. The fact that the pipeline couldn't find their website is not evidence that they're not worth pursuing. It is evidence that finding them requires a human judgment that no script can substitute for.

![A single horizontal bar split into two segments: a larger left segment for the roughly sixty-two percent of companies whose domain was inferred automatically, and a smaller, emphasized right segment for the roughly thirty-eight percent that still require a human to locate the site.](../images/06-where-the-money-went-sec-form-d-fig-04.png)
*Figure 6.4 — Domain inference: where the pipeline stops and you begin*

This is not an accident of implementation. It is a structural property of the search problem. The companies that are hardest to find automatically are often the ones where showing up — actually tracking down the website, finding the right person, writing the email — yields the most asymmetric return. Everyone else gave up at the domain lookup step. You didn't.

The pipeline's job is to get you to the right population and sort it by the strongest signal available, which is recency. Your job is to take that shortlist and close the gap between a row in a table and a real conversation with a real person. Form D is where you find the companies worth having that conversation with.

## Chapter 6 Exercises: Where the Money Went

**Project:** Your Own Reallocation Engine

**This chapter adds:** the funding-recency signal — you run the SEC Form D pipeline against your target metro and industry to produce a shortlist of recently funded companies, the population your sponsorship and liveness checks will work on next.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Summarizing the pipeline's audit (quarters processed, row counts, drops).** — *Why AI works here:* it reformats numbers the audit already produced; you check every figure against the audit file.
- **Generating candidate website URLs for a company whose domain inference failed.** — *Why AI works here:* this is pattern-based guessing you immediately verify by visiting the URL — the model proposes, the browser confirms.
- **Drafting a first-contact email to a founder once you've found a high-fit funded firm.** — *Why AI works here:* outreach drafting against facts you supply; you judge tone and accuracy before sending.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criteria are the audit file and the live website.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Producing the funded-company list, amounts, or dates.** — *Why AI fails here:* these must come from Form D filings through the pipeline; a model asked "which Boston biotechs raised money recently?" returns plausible names and numbers, not filed ones — fabrication.
- **Confirming a domain-inference match is the right company.** — *Why AI fails here:* inference is right ~62% of the time; the model is exactly as likely to confidently assert the wrong company's site — a missing-ground-truth problem only a human visit settles.
- **Deciding which funded company is the best target.** — *Why AI fails here:* the chapter's central trap is sorting by dollar amount; a model will happily rank "biggest raise first," which is the wrong signal — recency × right-size is a judgment tied to your goals.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** with a **Tier 5 (Causal)** edge — distinguishing a counted filing from a plausible guess, and resisting the "bigger raise = better lead" correlation that the size signal does not actually support.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** a ranked research shortlist from your pipeline output — ordered by recency and right-size, not dollar amount — plus a first-contact draft for the top lead.

**Tool:** Claude (claude.ai chat). You paste real rows from your processed table and interrogate them; chat is the right fit.

**The Prompt:**

```
Below are rows from a processed SEC Form D table I generated — real funded
companies in my target area. Each row has: company, amount raised, date filed,
industry, location, and (where found) a domain. Do NOT add companies, amounts,
or dates; work only with what I paste.

1. Rank these leads for a job seeker who needs to be HIRED SOON and wants to
   matter at the company. Rank by funding RECENCY and right-size (small, recently
   funded firms where one hire moves the needle), NOT by dollar amount. Explain
   the ranking in one line each, and explicitly flag any case where the biggest
   raise is NOT the best lead.
2. For the top lead with a known domain, draft a 120-word first-contact email to
   a founder/hiring lead: specific, non-generic, referencing that they recently
   raised and why I'm reaching out before a posting exists.
3. For any lead missing a domain, list 3 candidate URLs I should check by hand —
   labeled as guesses to verify, not answers.

--- PASTE YOUR TABLE ROWS BELOW ---
[paste 8–12 rows from data/sec/form-d/processed/]
```

**What this produces:** a recency-and-size ranking with the "bigger isn't better" cases flagged, one outreach draft, and a short list of domains to verify by hand.

**How to adapt this prompt:**
- *For your own project:* paste your real processed rows. The prompt is inert without them — and pasting them is what keeps the model from inventing companies.
- *For ChatGPT / Gemini:* works as-is; both may re-sort by amount out of habit — keep the "NOT by dollar amount" instruction in caps.
- *For a Claude Project:* store your target metro, industry, funding floor, and recency window in the instructions so every ranking inherits your filters.

**Connection to previous chapters:** the ranked leads populate the `targets.csv` you built in Chapter 2; the "verify the domain by hand" step is Chapter 1's interrogation reflex in miniature.

**Preview of next chapter:** Chapter 7 takes this funded shortlist and asks the harder question — which of them have actually sponsored visas — by scoring them against DOL and USCIS records.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** your own processed Form D table — a funded-company shortlist filtered to your metro, industry, and recency window, with its row count confirmed against the audit.

**Tool:** Claude Code. Running the seven-step `scripts/sec/` pipeline, reading audits, and applying filters is a multi-command terminal workflow.

**Skill level:** Intermediate — Python pipeline with several steps; recoverable per step.

**Setup:**

Before running this exercise, confirm:
- [ ] Your forked repo has `scripts/sec/` and the `data/sec/form-d/{raw,extracted,processed}/` layout.
- [ ] Python dependencies for the SEC scripts are installed.
- [ ] You've decided your filter thresholds: metro/state, funding floor, recency window.

**The Task:**

```
Run the SEC Form D pipeline in scripts/sec/ to produce a processed funded-company
table for my target area. Do not edit raw data; do not invent any company.

1. Run the pipeline in order, stopping and showing me any error before
   continuing:
     python download-form-d-quarters.py
     python refresh-recent-sec-quarters.py
     python sec-combine-quarters.py
     python sec-filter.py        # apply my funding floor
     python sec-unique.py
     python sec-domain-inference.py
     python sec-flatten.py
2. After sec-flatten, report the processed row count AND the matching number
   from the audit file — confirm they agree. If they differ, stop and show me.
3. Filter the processed table to my target state/metro and a 12-month recency
   window; save it to reports/funded-shortlist.csv.
4. Count and list the companies where domain inference FAILED (no domain) — these
   are my manual-lookup queue.
5. Show me the shortlist row count, the audit row count, and the missing-domain
   count. Stop.
```

**Expected output:** `reports/funded-shortlist.csv` filtered to your area and recency, plus a printed count of domain-inference failures to chase by hand.

**What to inspect in the output:** confirm the processed row count matches the audit (Chapter 3's discipline). Spot-check three rows back through `extracted/` to `raw/` — does the amount trace? Are the missing-domain companies genuinely missing, or did inference attach a wrong domain (worse than none)?

**If it goes wrong:** the most common failure is an empty or tiny processed table — usually the funding floor in `sec-filter.py` was set too high or the wrong quarters downloaded. Recover by checking the filter threshold and the combine step's audit; do not let the agent "fill in" companies to make the table look populated.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"Form D shortlists are sorted by recency and right-size, never by raise amount; domain-inference results are unverified until a human opens the site."* This bakes the chapter's two judgments into the repo.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI-generated ranking of funded companies — the kind that confidently optimizes the wrong variable.

**Validation type:** Reasoning chain (over structured data).

**Risk level:** Medium — a wrong ranking sends your scarce application time at big firms with formal gates instead of founders who'll read your email.

**Setup (pre-generated artifact — option b):** This chapter's lesson is "bigger raise ≠ better lead," so validate this pre-generated ranking:

> **Top funded targets for you (ranked):**
> 1. MegaCloud Inc. — raised $220M (Series D, 14 months ago), ~3,000 employees.
>    *Largest raise = most hiring; apply here first.*
> 2. DataCorp — raised $90M (Series C, 11 months ago), ~600 employees.
> 3. Helix Bio — raised $6M (seed, 7 weeks ago), ~14 employees.
>    *Small raise, lowest priority.*
> All three are strong because they're well funded. Start at the top and work down.

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — Where the Money Went

□ Correctness: Is the list ranked by the signal the chapter says matters
  (recency × right-size) or by dollar amount?
□ Completeness: Does it account for how a 3,000-person firm hires (formal gates,
  100 applicants/role) vs. a 14-person firm (the founder reads your email)?
□ Scope: Did it conflate "well funded" with "good hiring lead"?
□ Recency check (chapter-specific): A 14-month-old round vs. a 7-week-old round —
  which is the live hiring signal? Does the ranking reflect that?
□ Size check (chapter-specific): At which company does one hire change what they
  can do? Is that company ranked first or last?
□ Failure mode check: Does this output exhibit any of the following?
  - Fluent but wrong (a confident ranking on the wrong axis)
  - Sorting by dollar amount (the chapter's named error)
  - Missing ground truth (no trace to the filing dates that justify recency)
```

**What to do with your findings:**
- If the output passes all checks: use it. (It will not — it inverts the chapter's argument by ranking Helix Bio last.)
- If it fails one check: re-rank by recency and right-size yourself and note which company moved most.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — you set the ranking criteria; the model only formats.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** — catching a fluent ranking that optimizes the loudest number (raise size) instead of the predictive one (recency × size). The pipeline finds the companies; the judgment about how to order them is yours.

---

## Key terms

- **Form D:** the SEC filing a company makes when it raises money in a private offering; public, structured, and rich with hiring signal.
- **Funding recency:** how recently a company raised; a leading indicator of near-term hiring and a twenty-percent factor in the sponsorship tier.
- **Entity resolution:** collapsing the many spellings of one company into a single record.
- **Domain inference:** automatically guessing and verifying a company's website so a funded firm can actually be reached.

## Run-log prompt

Record the quarters processed, the audited row count, your filter thresholds (geography, funding floor, recency), and the count of high-fit firms whose domains you had to find by hand.

[^formd]: Aggregate Form D counts (≈568,707 filers; ≈246,572 raising ≥$5M) from the "80 Days to Stay" build logs (`data/80-days-to-stay/`) and connecting essay. **[verify]** against a current pipeline run.

[^domain]: ~62% domain-inference success (≈38% requiring manual lookup) from the "80 Days to Stay" build logs and the "80 Days to Stay: Connecting Recent Funding" essay. **[verify]**
