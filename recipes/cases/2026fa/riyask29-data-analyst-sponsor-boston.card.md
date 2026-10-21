# Data-Analyst Sponsor Check — human card

**Audience:** an international student on F-1 OPT in the Boston area deciding
which Data / BI Analyst leads deserve an application this week, or the person
checking their work.  
**Agent twin:** `recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.md`  
**Status:** DRAFT (v0.2.0). It runs on the repo's sample data, and on full SEC Form D quarters and a
DOL H-1B filing slice when you fetch them; it has not been attested. 2 typed TODOs are open (hiring-lag evidence; an engine folder bug).

## Executive summary

This card explains, without the technical detail, what the Data-Analyst Sponsor
Check tells you and where it stops. In one sentence: it separates companies that
have sponsored visas for **data-analyst-type** jobs from companies that only
sponsored engineers or a different kind of "analyst", drops postings that are
closed or that you could not start before your OPT clock runs out, and tells you
whether to apply, network, or skip.

## Purpose

Answer, for one lead: *is this a company that has actually sponsored my kind of
job, is the job still there, and can I get hired in time?* If the data cannot
answer, the tool says so and stops. It does not guess.

## What it can verify

- How many H-1B approvals and denials the company has in the engine's dataset.
- Which job titles appear in the company's top sponsored titles, word for word.
- Whether the posting showed an apply button or an embedded application form when it was checked, and when that was.
- **How many certified H-1B filings (LCAs) the company made for analyst occupation codes at
  Massachusetts worksites** in DOL's FY2026 Q3 file, by code, with example job titles (when you run
  with the LCA slice).
- Whether the company filed a Form D (a private raise) in 2025 Q2 to 2026 Q1, by exact name (with full quarters).
- The national BLS median wage for Business Intelligence Analysts (15-2051.01)
  and Market Research Analysts (13-1161), OEWS 2024.
- The date arithmetic behind the timeline gate, shown line by line.

## What it cannot verify

- **That a company's LCAs became H-1Bs,** or how many people they cover. An LCA is filed before the
  petition, and one can cover several workers. A company that files under a different legal name, or
  outside Massachusetts, reads as "none". The sponsor dataset itself lists only *titles*, so the
  tool's keyword rules still decide its tier, and you check them (gate G4).
- **What the company pays an analyst.** The salary in the dataset is the median
  across *all* the company's sponsored jobs, often mostly engineers.
- **Whether the company raised money recently,** from the repo alone: only small samples ship. With the
  full quarters, "not filed under this name" still is not "no money": public companies never file Form D.
- **That the company will sponsor you,** or how long its hiring really takes.
  Hiring lag is your estimate.
- **Anything about immigration law.** Ask your DSO about OPT and the STEM extension.

## Dependencies

- Node 20+ and `npm install` in the repo.
- For live posting checks only: `npx playwright install chromium` (once).
- Data that ships with the repo: the 80 Days to Stay CSV, the BLS compact CSV,
  the Form D samples, and the Massachusetts LCA slice (`data/lca-ma-analyst-fy2026q3.csv`).
- Optional: Python 3 to fetch full Form D quarters (`scripts/sec/`), and Python 3 + openpyxl to
  re-cut the LCA slice from a DOL workbook you download in a browser.

## Annotated commands

Offline test (expected: `pass 10`, `fail 0`; no network):

```bash
node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.test.mjs
```

The run itself (expected: one line per lead with its next action; the report is
at `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-report.md`):

```bash
node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs
```

After you have opened the *uncertain* postings yourself, re-run with your
checks (expected: those leads are now scored, and your check is labeled
*your-input*, not *record*):

```bash
node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs \
  --liveness-file scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json --today 2026-10-02
```

## What it produces

- **A report for you** (`analyst-check-report.md`): a plain summary, one row per
  lead with its next action, the evidence behind each value (each labeled
  *record*, or *your-input* when it is your own rule or estimate), and a
  checklist of the gates you still have to clear.
- **A log for the agent** (`analyst-check-log.json`): the same facts, machine-readable.
- **The engine's own score files** (`role-scores.json` / `.md`), from the existing scorer.

Next actions you will see: **tailor and apply**, **review titles then tailor**,
**network first** (a strong sponsor with no live posting is a reason for an
informational chat, not an application), **skip**, or a **human check**
(confirm the company, open the posting, or add a missing estimate).

## Your gates

| Gate | You look at | You decide |
|---|---|---|
| G1 Company | the near-match names for any lead marked *not in dataset*, *no H-1B record* or *ambiguous* | which company it is, or "unknown" (not "non-sponsor") |
| G2 Posting | the URL of every *active* or *uncertain* posting | whether it is really open |
| G3 Timeline | the dates and arithmetic line | whether your estimate of hiring time is honest; ask your DSO about anything legal |
| G4 Titles | each sponsored title that made a company "Proven" or "Likely" | whether that title is the work you would do |

Write each decision, your name and the date in the run entry
`logs/runs/2026fa-riyask29-<n>.md`.

## Named failure modes

1. **Title-family drift.** "Business Analyst" can mean data analysis or
   process/management work (SOC 13-1111), and the keyword list files it as
   *ambiguous*, which gives a Likely tier. (The first version also filed
   "Quantitative Analyst" there. At the G4 review on 2026-10-02 the student moved
   it to *other*, because quant work is statistics or finance.) A student skimming the report could read "Likely sponsor" as
   "sponsors analysts like me". *Hardest to catch for:* someone who never opens
   the G4 title list.
2. **Company-median wage mismatch.** A company that mostly sponsors engineers
   shows a median of $117k–$177k next to an analyst benchmark, and it looks like
   analysts there are paid well. The ratio is not an analyst salary. *Hardest to
   catch for:* a student anchoring a salary ask on it.
3. **Truncated title list.** A company may have sponsored data analysts that just
   did not make its top-titles list, and the tool then rates it Possible or
   Unknown. *Hardest to catch for:* anyone treating Unknown as "no".
4. **Free-text authorization trap.** The engine's scorer reads "work authorized"
   in a status line as "no sponsorship needed", which removes sponsorship from the
   score. The tool refuses to report if this happens, but any other tool that
   feeds the scorer free text would not. *Hardest to catch for:* exactly the F-1
   OPT students whose EAD says "authorized".
5. **Liveness "uncertain", and not repeatable.** EverQuote's page has an
   application *form*, not a button, so the checker says "uncertain". Abacus was
   "active" and then "uncertain" 25 minutes later because the page loaded slowly.
   The tool stops rather than guess, and you clear it by opening the page.
   *Hardest to catch for:* nobody, since it stops loudly, but it costs a manual
   check per lead and per run.
