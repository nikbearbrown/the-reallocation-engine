# Chapter 8 — Is the Job Real: ATS Detection and Liveness
*A posting is not a job opening — it is a signal, and signals can lie.*

Here is a number that should bother you. Somewhere between 28 and 42 percent of job postings, depending on the study and the year, are ghosts — listings a company has no active intention of filling. One survey found 81 percent of recruiters admitting to posting jobs they weren't actually hiring for. That figure has held roughly steady across five years of measurement, which means it isn't an artifact of a particular labor market cycle. It is a structural feature of how hiring works, or rather, how it appears to work from the outside.

I want to sit with that before we get to the detection problem, because the number is stranger than it looks. A ghost job isn't a posting that went live and then the position was cancelled. It's a posting that was never, at the moment of posting, connected to an intention to hire someone. It can be a pipeline hedge — the company isn't hiring now but wants résumés queued when it does. It can be a signal to investors that the firm is growing. It can be bureaucratic inertia: a listing that went up two quarters ago and no one has gotten around to taking down. Whatever the cause, the effect for a candidate on a finite clock is the same. A day spent writing a cover letter, tailoring a résumé, researching the company, submitting an application — to a door that was never going to open.

![A quantitative chart with a time axis from 2019 to 2024 and a prevalence axis from zero to fifty percent; a shaded band at twenty-eight to forty-two percent holds steady across the years while individual study points scatter in and near it, with a couple of lower outliers.](../images/08-is-the-job-real-ats-detection-and-liveness-fig-01.png)
*Figure 8.1 — Ghost-job prevalence holds across years*

<!-- → [CHART: Bar chart showing ghost-job prevalence estimates across multiple studies and years (2019–2024), y-axis 0–50%, with a shaded band at 28–42% and individual city/source data points labeled (e.g., LA 30.5%, Seattle 16.6%). Caption: "Ghost-job prevalence has held in the 28–42% range across five years — not a cycle artifact but a structural feature of the posting market."] -->

The question I want to work through with you is this: can you tell, before spending that day, whether the door is real? The answer is yes — not perfectly, but well enough to matter. To see how, you have to stop reading job postings as prose and start reading them as data.

## What you are actually looking at

When you pull up a careers page in a browser, you are looking at a rendered surface. What feeds that surface is a piece of software called an applicant-tracking system — Greenhouse, Lever, Ashby are the names you'll encounter most. These are not interchangeable wrappers around the same underlying structure. Each one organizes its data differently, exposes different fields through its feed, and structures timestamps and job identifiers in its own way. That matters because the signals that distinguish a real posting from a ghost live in those fields — not in the prose of the job description, which is marketing, but in the metadata, which is evidence.

The first thing I do when I hit a new company is run a single script:

```bash
python scripts/ats/detect-ats.py --company "Example Bio"
```

It returns a label — Greenhouse, Lever, Ashby, or unknown. That label is not interesting on its own. What it unlocks is the ability to read the feed correctly. A scraper built for Greenhouse reads Lever data as noise. Detection is the key; without it, everything downstream is garbled.

![Three applicant-tracking platforms — Greenhouse, Lever, and Ashby — each with its own feed structure, all resolving to one unified postings-record schema with fields for job id, title, posted date, last updated, description, and status.](../images/08-is-the-job-real-ats-detection-and-liveness-fig-05.png)
*Figure 8.2 — Detection unlocks the schema*

<!-- → [DIAGRAM: Three ATS platforms (Greenhouse, Lever, Ashby) each shown as a box with their characteristic URL/feed structure beneath, all pointing to a unified "postings record" schema with fields: job_id, title, posted_date, last_updated, description, status. Caption: "Each ATS structures its data differently; detection tells the scraper which schema to read."] -->

Once the ATS is identified, the pipeline pulls the company's postings directly from the provider's feed — no paid model calls, just structured data read from the source:

```bash
npm run ats:scan
```

This zero-token scan matters because it runs on every company in the pipeline. At scale, what gets expensive gets skipped. A check that costs nothing gets run every time, and recency of the scan stops being a variable you manage.

## The spam filter you already trust

Here is where the detection logic becomes interesting, and where I think an analogy does real explanatory work. Ghost job detection is structurally identical to spam filtering — not metaphorically, but mechanically.

Your email filter doesn't read a suspicious message and conclude it seems dishonest. It scores the message's behavioral fingerprints against patterns of mail that is actually wanted. Temporal anomalies: sent at 3 a.m. to ten thousand addresses in twelve seconds. Interaction voids: no replies, no clicks, bounce rates in unusual ratios. Textual homogeneity: the same message reused with minor surface variation, identifiable across millions of instances. The filter assembles these signals into a probability, not a verdict, and routes accordingly. It does this a billion times a day without reading a word of content.

Ghost postings have the same fingerprints. A posting that has been up eleven weeks with no update, at a company where other listings sit frozen at similar ages, looks like a bulk send with no engagement — the temporal anomaly. A portal that has never advanced a candidate, carries no closing date, and shows no sign of iterative recruiter activity looks like mail no one is responding to — the interaction void. A job description identical to three other listings at the same company, copy-pasted from a template and minimally varied by title, looks like a mass campaign with surface variation — textual homogeneity.

No single signal is decisive. A genuinely open role can sit untouched for weeks at a slow-moving organization. A ghost can be freshly posted specifically to look active. But together, the way no individual word makes an email spam but the pattern does, they yield a classification you can defend. That is the standard I care about: not certainty, but a call traceable to the specific signals that produced it.

![A three-column map drawing the parallel between spam detection and ghost-job detection across three behavioral fingerprints — temporal anomalies, interaction voids, and textual homogeneity — each column pairing an email-spam example with a job-posting example.](../images/08-is-the-job-real-ats-detection-and-liveness-fig-02.png)
*Figure 8.3 — The spam-filter analogy: three behavioral fingerprints*

<!-- → [INFOGRAPHIC: Three-column layout labeled "Temporal Anomalies," "Interaction Voids," "Textual Homogeneity." Under each: two or three bullet examples from job-posting context (e.g., "unchanged for 8+ weeks," "no portal activity," "description reused across 3 listings"). Footer: "Ghost detection scores behavioral patterns — the same move your spam filter makes."] -->

## Five signals and one classification

The liveness check reads five things, in this order.

How old is the posting? Age alone is weak — the base rate of slow organizations is too high to make age decisive — but it is a prior that subsequent signals update. A nine-day posting enters the analysis differently than a seventy-seven-day posting.

When was it last updated? Posting date and update date are different fields. A three-month-old posting that was refreshed last week is behaving like an active search. A three-month-old posting frozen since the day it went up is not.

Are the company's other listings changing? This is the signal I find most diagnostic. If a company has twelve open roles and ten of them have been sitting untouched for the same number of weeks, that pattern tells you something about how the company uses its careers page — probably as a passive presence rather than an active hiring signal. If roles are appearing and disappearing, that's churn, and churn indicates an active search function.

Is the description specific? A listing that names a team lead, a project in progress, a specific dataset or codebase or migration underway, is a listing someone wrote for a real role. A listing that is word-for-word reproducible from a template — or from a prior listing at the same company — is a listing that was generated, not composed.

Does the context make an active search plausible? Funding tier, recent headcount trajectory, the occupation's demand signal from earlier in the pipeline — these are not liveness signals in themselves, but a fresh listing at a company that just closed a Series B reads differently than the same listing at a company in a freeze.

The classification runs after all five:

```bash
npm run ats:liveness
```

![A classifier diagram where five posting signals — posting age, last-updated date, sibling-listing activity, description specificity, and active-search context — feed a single liveness decision that fans out to three terminal calls: live, ghost, and investigate.](../images/08-is-the-job-real-ats-detection-and-liveness-fig-03.png)
*Figure 8.4 — Five signals to one classification*

The output is one of three calls per posting: live, ghost, or investigate. The first two are self-explanatory. The third is the honest response to mixed signals — recent posting but templated description; stale posting at a company that just raised money. Investigate means: one cheap check resolves this faster than a blind application or a blind skip.

## One company, both doors

Let me make this concrete. A biotech with a strong sponsorship tier has two open data roles, both with the same title. `detect-ats.py` returns Greenhouse.

Posting A went up nine days ago. The description references a specific named project — a model being retrained on a new assay dataset — and names the team lead the role would report to. The company's other listings show recent count changes; two roles present last week are absent this week. Five signals, all pointing the same direction. `ats:liveness` calls it live.

Posting B has been up eleven weeks. The description is word-for-word identical to a data scientist posting the company ran eighteen months ago and to two other currently active listings under slightly different titles. No portal activity is detectable. The count for this listing has not changed across three scans. Five signals, all pointing the same direction. `ats:liveness` flags it stale — likely ghost.

![A side-by-side comparison of two postings from the same employer scored across five liveness signals; Posting A reads live on every signal and Posting B reads ghost on every signal, even though both share the same title and sponsorship tier.](../images/08-is-the-job-real-ats-detection-and-liveness-fig-04.png)
*Figure 8.5 — Same employer, two doors*

The same employer. The same title. The same sponsorship tier. One of these is a door; one is a picture of a door. The decision is not about the company — the company is real. The decision is about the posting.

| Signal | Posting A | Posting B |
|---|---|---|
| Posting age | 9 days | 11 weeks |
| Last updated | Refreshed recently | Never — frozen at posting date |
| Description specificity | Names a project, dataset, and team lead | Word-for-word identical to an 18-month-old listing and two siblings |
| Company hiring activity | Sibling listings appearing and disappearing (churn) | Sibling listings frozen at the same age |
| Portal movement | Detectable | None across three scans |
| **Liveness classification** | **Live** | **Stale — likely ghost** |

*Same employer, same title, same sponsorship tier. The signals separate them. Liveness is a property of the listing, not the firm.*

## Where judgment re-enters

Here is the error the classification is most likely to induce. You get a live call and stop thinking. You treat "live" the way you would treat a verified fact — as having the same standing as a DOL filing count or a USCIS data point. It doesn't.

A liveness call is a probability, not a certification. The signals reduce the odds of wasting a day. They cannot read hiring manager intent.

A posting scored live can be a role that the company has been slow-walking through four rounds of internal headcount approval and will quietly kill if it doesn't close by quarter end. A posting scored ghost can be the one role where a slow-moving organization has a genuinely active search underway, conducted by a hiring manager who simply doesn't believe in updating careers pages. The signals catch the pattern. The exception lives in intent the pattern cannot see.

The decision rule is: *live* means apply if tier and fit hold. *Ghost* means skip. *Investigate* means one cheap check is faster than a blind application — a single direct message to a recruiter, or a look at the company's recent LinkedIn for engineering posts, takes ten minutes and gives you what the behavioral scores cannot: a human response. The liveness classification is a data claim, built from observable posting signals, logged, auditable. The reading of what that classification means for this particular company, this particular team, this particular moment is a judgment call, and it belongs to you.

## What the pipeline cannot see

I want to be clear-eyed about what this system actually measures and what it doesn't.

It measures what the posting does, not what the company intends. That gap is real.

A stale posting can be real. An organization buried in a product sprint may have a genuine open role that no one on the recruiting side has had time to update in two months. The metrics say ghost; the actual answer is "we'd love to talk, we just haven't looked at the careers page." That's a real door the filter misses. Filtering it out is the cost of the filter.

A fresh posting can be fake. A recruiter running a sourcing campaign posts a crisp, specific, recently dated listing precisely because candidates screen for recency. The posting is designed to beat the detector. The signals say live; the actual answer is résumé harvest. That's a ghost the filter misses from the other direction.

Neither failure breaks the filter. A check that eliminates 35 percent of ghost applications and occasionally miscategorizes an outlier in both directions is worth running. But knowing where it fails matters — not because you can fix it in the current architecture, but because when the signals are mixed and the role genuinely matters, the right response is a human check, not confidence in the score.

| What liveness detection catches | What liveness detection misses |
|---|---|
| Templated, stale ghost postings — the bulk of wasted application days | Stale-but-real roles at slow orgs that never update the careers page |
| Frozen listings with dead sibling activity | Fresh-but-fake harvest postings designed to beat the recency detector |
| Duplicate descriptions reused across listings | ATS-invisible postings filled by direct referral, never posted to a feed |
| Postings with no portal movement across scans | Real roles frozen mid-search because the position was put on hold |

*The filter reduces waste; it does not read intent. The residual cases are where a human check earns its keep.*

## The rung you just added

At the end of this chapter, three facts exist about a role: the company can sponsor, the posting is live, and the signals behind both claims are logged and traceable. The pipeline has been built as a ladder of verified claims — each chapter adding one rung, each rung resting on data rather than plausibility.

The question the pipeline still cannot answer is whether the job is worth having. A real, sponsoring role at a company with an active posting is still a role in an occupation that might be contracting, at a salary band below market, in a geography you can't realistically reach. Sponsorship and liveness are necessary conditions. They are not sufficient ones.

That's where the next chapter begins. The role exists, and you can apply to it. Is it any good?

---

## Chapter 8 Exercises: Is the Job Real

**Project:** Your Own Reallocation Engine

**This chapter adds:** a liveness call per posting — live, ghost, or investigate — so the targeted application hours your Proven-tier companies earned go to doors that are actually open, not pictures of doors.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Summarizing the scan output (which ATS, how many postings, classifications).** — *Why AI works here:* it reformats structured data the scan produced; you check against the feed.
- **Classifying a posting from the five signal VALUES you supply.** — *Why AI works here:* given posting age, last-updated, sibling-listing activity, description specificity, and funding context, applying the live/ghost/investigate rule is structured judgment you can audit signal by signal.
- **Drafting the one cheap "investigate" check — a recruiter message or LinkedIn look.** — *Why AI works here:* outreach drafting you review before sending.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criterion is the five measured signals, not the model's read of the prose.

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Producing the liveness classification by reading the job description prose.** — *Why AI fails here:* the description is marketing; classification must come from the metadata signals via `ats:liveness`. A model that reads "exciting fast-growing team!" and says "live" is reading the costume, not the evidence.
- **Inferring hiring-manager intent behind a posting.** — *Why AI fails here:* the signals catch the pattern; the exception (a real role at a slow org, a harvest posting designed to look fresh) lives in intent no pattern can see.
- **Treating a "live" call as a certified fact.** — *Why AI fails here:* liveness is a probability, not a DOL filing count; trusting it as certification is the chapter's named error.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** with a **Tier 5** edge — distinguishing a behavioral pattern (which the signals measure) from intent (which they cannot), and refusing to let a fluent reading of marketing prose stand in for measured evidence.

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** liveness classifications for the postings at your Proven/Likely companies, each justified by the specific signal that drove it — and an "investigate" action list for the mixed cases.

**Tool:** Claude (claude.ai chat). You paste real signal values from your scan; chat fits.

**The Prompt:**

```
Below are postings from my ATS scan. For each, I give the FIVE liveness signal
values: posting age, last-updated date, whether the company's sibling listings
are changing, description specificity (templated vs. specific/named-project),
and funding/hiring context. Do NOT read the job description as evidence of
realness, and do NOT invent any signal value — use only what I paste.

1. Classify each posting as LIVE, GHOST, or INVESTIGATE using the five signals,
   and name the specific signal(s) that drove the call.
2. For each INVESTIGATE, write the single cheapest check to resolve it (one
   recruiter message or one LinkedIn look) and state what response pushes it
   toward live vs. ghost.
3. Flag any posting where my signals conflict, and say explicitly: "this is a
   probability, not a certification — verify with a human check before spending
   a day on it."

Remember: a fresh, specific-sounding description can still be a harvest posting,
and a stale posting can still be a real role at a slow org. Classify from the
signals, flag the residual risk.

--- PASTE POSTINGS + SIGNAL VALUES BELOW ---
[paste 3–6 postings with their five signal values each]
```

**What this produces:** signal-justified liveness calls plus an investigate-action list — filling the `posting_live` column of your `targets.csv` with reasons, not guesses.

**How to adapt this prompt:**
- *For your own project:* paste real signal values from `ats:scan` / `ats:liveness`. The classification is only as good as the measured signals you feed it.
- *For ChatGPT / Gemini:* works as-is; both gravitate to judging the description text — keep the "do NOT read the description as evidence" line.
- *For a Claude Project:* store the five signals and the three-way decision rule in the instructions.

**Connection to previous chapters:** this gates the Proven-tier companies from Chapter 7 — sponsorship and liveness together are necessary, not sufficient (Chapter 9 adds role quality).

**Preview of next chapter:** Chapter 9 asks whether a live, sponsoring role is even worth having — by reading the occupation's wage band and employment trend.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** liveness data for your targets — ATS detected, postings scanned at zero token cost, and each classified — recorded so a posting's status is a logged fact, not a memory.

**Tool:** Claude Code. Running detection, the scan, and the liveness classifier across your target list is a terminal pipeline.

**Skill level:** Intermediate — requires `portals.yml` configured (Chapter 4's scan recipe).

**Setup:**

Before running this exercise, confirm:
- [ ] `data/ats/portals.yml` exists and is YOUR config, not the example (Chapter 4 failure mode).
- [ ] `scripts/ats/detect-ats.py` and the `ats:scan` / `ats:liveness` commands run.
- [ ] You have a list of target companies/URLs from Chapters 6–7.

**The Task:**

```
Run ATS detection and liveness for my target companies. Do not invent ATS hits,
postings, or classifications; if a scan returns nothing, report empty — do not
fill it in.

1. Confirm data/ats/portals.yml exists and is NOT identical to portals.example.yml.
   If it's the example, stop and tell me.
2. For each target company, run:
     python scripts/ats/detect-ats.py --company "<name>"
   Record the ATS label (greenhouse/lever/ashby/unknown).
3. Run:  npm run ats:scan      (zero-token scan of configured portals)
   then:  npm run ats:liveness
   Record per-posting: the five signal values and the live/ghost/investigate call.
4. Save a table to reports/liveness.csv: company, posting, five signals,
   classification. Separate EMPTY results from ERRORS in your report.
5. Append a RUN_LOG.md entry: companies scanned, postings classified, counts of
   live/ghost/investigate. Stop.
```

**Expected output:** `reports/liveness.csv` with per-posting signals and classifications, plus a run-log entry — empties distinguished from errors.

**What to inspect in the output:** check that classifications trace to the five measured signals, not to description text. Confirm `portals.yml` was your config (or the whole scan is against example companies — the Chapter 4 trap). For one "live" posting, sanity-check the signals by hand.

**If it goes wrong:** the most common failure is the scan running against the example config and returning plausible-looking results for companies you didn't target. Recover by verifying `portals.yml`; if results look suspiciously generic, re-check the config before trusting a single row.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"Liveness is classified from the five metadata signals only, never from description prose; a 'live' call is a probability that requires a human check before a full application."* This pins the chapter's two warnings into the repo.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI liveness verdict that judged the job description instead of the signals — fluent, confident, and reading marketing as evidence.

**Validation type:** Reasoning chain.

**Risk level:** Medium-High — a wrong "live" call costs a full day of application effort on a door that won't open.

**Setup (pre-generated artifact — option b):** This chapter's lesson is "read the metadata, not the prose," so validate this pre-generated verdict:

> **Posting verdict — Senior Data Scientist, Helix Bio.** This is clearly a LIVE,
> active role. The description is detailed and exciting — it mentions a
> fast-growing team, cutting-edge ML work, and a great mission. A company would
> not write such a compelling, professional posting if they weren't serious about
> hiring. Apply with confidence.
> *(Signals on file: posting age 11 weeks; last-updated = posting date, never
> refreshed; 3 sibling listings unchanged for 11 weeks; description word-for-word
> identical to a posting from 18 months ago; no portal activity.)*

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — Is the Job Real

□ Correctness: Did the verdict use the five metadata signals or the description
  prose? Which did it actually cite?
□ Completeness: Did it ignore the signals on file (11 weeks stale, never
  refreshed, duplicate description, dead siblings, no activity)?
□ Scope: Did it treat "compelling description" as evidence of realness — the
  exact error the chapter warns against?
□ Signal check (chapter-specific): Read the five signals yourself. What
  classification do they support — live, ghost, or investigate?
□ Certification check (chapter-specific): Does it present a probability as a
  certified fact ("apply with confidence")?
□ Failure mode check: Does this output exhibit any of the following?
  - Reading marketing prose as evidence (the chapter's named error)
  - Fluent but wrong (a confident verdict against the actual signals)
  - Treating a liveness call as a certification rather than a probability
```

**What to do with your findings:**
- If the output passes all checks: trust it. (It will not — the signals scream ghost while the verdict says live.)
- If it fails one check: re-classify from the five signals yourself and note which the verdict ignored.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — classify from the signals, and run the one cheap human check before committing.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** — catching the moment fluent prose is mistaken for measured evidence. The signals are the data claim; the description is the costume.
