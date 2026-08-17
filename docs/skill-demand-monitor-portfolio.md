# Skill-Demand Monitor
### A case study in closing a data-driven demand-signal gap, and the bug I found trying to break my own fix

**Aditi Bailur** · Contribution to [The Reallocation Engine](https://github.com/nikbearbrown/the-reallocation-engine) · [PR #39](https://github.com/nikbearbrown/the-reallocation-engine/pull/39)

---

## The problem

International students on OPT and STEM OPT operate under a hard clock: a 90-day unemployment ceiling, a narrow application window, and no room to spend a study cycle on the wrong skill. AI Engineer postings each list a dozen-plus tools, but nothing in a single posting tells you which of them are load-bearing across the market and which are one recruiter's wish list. A student targeting 20–30 companies has two bad options: read every posting by hand and try to keep a mental tally, or study everything a posting mentions and hope it generalizes.

The Reallocation Engine — an open evidence-first job-search system built for exactly this population — already had a name for this gap in its own backlog: `recipes/skill-demand-monitor.md`, a specification for inferring real skill demand from postings. It shipped as a DRAFT with eleven open `[TODO]`s and zero lines of implementation. I built it.

## What I built

`skill-demand-monitor.mjs` takes a set of job postings and answers one question with evidence: across the postings that actually match a target role, which skills come up, in how many *distinct* postings, and — critically — which specific postings back that count. No LLM calls, no network calls; a deterministic regex match against a versioned, human-curated taxonomy of 36 AI/ML-engineering skills. Every number in the output links back to the job IDs and URLs that produced it.

The pipeline is four hard-stop gates in sequence, not a weighted score:

```
postings in → schema gate (reject malformed records, name why)
            → role-filter gate (title match against explicit synonyms — no fuzzy matching)
            → sample-size gate (refuse to rank below a floor — default 20)
            → skill extraction (regex match against the taxonomy)
            → taxonomy-coverage gate (flag it if the taxonomy doesn't fit this data)
            → ranked report out (JSON + Markdown, every count with evidence links)
```

Any gate can halt the run and produce **no ranked list at all** — the tool is built to refuse a guess rather than dress up thin or dirty data as a confident answer.

## The measurable improvement: a bug I found by trying to break my own tool

Chapter 16 of the book this project is built around poses the test that actually matters: *can the model verify this against reality, or only against itself?* I ran that test on my own code, not just the target bug.

After building the sample-size gate, I deliberately tried to defeat it: I overrode the minimum sample from 20 down to 2, to see whether the report would still claim more confidence than 2 data points deserve. It did. The report's headline read, unconditionally: *"2 of 1,702 postings matched — enough data to trust this ranking."* Worse, the audit table underneath it printed **`pass (2 ≥ 20)`** — a mathematically false statement, because it displayed the tool's hardcoded default instead of the threshold actually in force.

I fixed both. The real threshold used on a given run is now threaded through every line of output instead of the default; the headline no longer makes an unconditional confidence claim; and a new flag prints an explicit warning any time the floor has been manually weakened below its default. I re-ran the exact break attempt after the fix — the audit table now correctly reads `pass (2 ≥ 2)`, with a loud caution attached. The fix is locked in by an automated regression test, so this exact failure mode can't come back silently.

I ran the tool against 1,702 real, live postings pulled from Anthropic, Databricks, and Palantir's actual career pages. The schema gate rejected 1,437 of them (84%) — not a bug in this tool, but a real defect in an upstream scraper that never populates job-description text, caught and named rather than silently absorbed into a ranking built on empty text.

## Verified vs. inferred

Every skill count, every evidence link, and every gate outcome in the output is **script-output** — deterministic, reproducible, and traceable to a specific posting record. The skill taxonomy itself is **your-input**: a dated, human-curated list of 36 skills, not a certified industry standard. A "zero mentions" result can mean the skill is genuinely absent, or that it isn't in the taxonomy yet — the tool cannot tell you which, and says so. The tool never computes which gap matters most to close first; frequency and profile-evidence are reported as facts about the input, and prioritizing among them is left entirely to the person reading the report.

## Failure modes, and the one thing it can't verify

- **Taxonomy drift** — a tool released after the taxonomy's last edit is invisible, not absent.
- **Contract violation** — the gates protect against bad input the tool receives, not against a caller who pre-filters data before handing it over.
- **Small-sample false confidence** — clearing the sample-size floor is a minimum, not proof the ranking is statistically solid.
- **Upstream data quality varies** — the tool inherits whatever a scraper gives it; a scraper defect looks identical to a genuinely thin market until someone reads the scraper's source.

**The one limitation it cannot verify:** whether a skill mentioned in a posting is actually required to do the job on day one, or padding in the listing text. High mention frequency measures what employers write down, not what a role needs — that distinction is a judgment this tool deliberately does not make.

## Demo

```bash
git clone https://github.com/aditibailur/the-reallocation-engine.git
cd the-reallocation-engine && git checkout contrib/skill-demand-monitor-scorer
npm install
npm run demo:real
```

One command: pulls real postings from a live Greenhouse and Lever company, ranks skill demand, and writes a Markdown report you can open directly — `reports/generated/skill-demand-real-demo.md`.

- **Pull request:** [nikbearbrown/the-reallocation-engine#39](https://github.com/nikbearbrown/the-reallocation-engine/pull/39)
- **The recipe:** [`recipes/skill-demand-monitor.md`](https://github.com/aditibailur/the-reallocation-engine/blob/contrib/skill-demand-monitor-scorer/recipes/skill-demand-monitor.md)
- **The human card:** [`recipes/skill-demand-monitor.card.md`](https://github.com/aditibailur/the-reallocation-engine/blob/contrib/skill-demand-monitor-scorer/recipes/skill-demand-monitor.card.md)
- **The honest run, in full:** [`logs/RUN_LOG.md`](https://github.com/aditibailur/the-reallocation-engine/blob/contrib/skill-demand-monitor-scorer/logs/RUN_LOG.md)
