# Finance data-engineering triage (STEM-OPT) — human card

**Audience:** an international master's student on, or about to start, STEM-eligible OPT who
wants data-engineering or BI work in finance and has to decide where to spend scarce
application hours.
**Agent twin:** `recipes/cases/2026fa/Arc-211-fin-dataeng-stemopt.md` · **Status:** DRAFT (sample run done; 3 out-of-scope TODOs open)

## Purpose

Answer, per employer: is there evidence this company sponsors, is the posting real and on
target, can it support the STEM extension, and does the visa calendar still allow it? Then say
what to do next: tailor, review fit, network, check by hand, or skip. Where the evidence isn't
there, say "unknown". Never say "no".

## What it can verify

- Recorded H-1B approvals and rate, top sponsored titles, and median offered wage, from the 80 Days CSV.
- That a company is **absent** from the CSV, or present with **blank** sponsorship (unknown, not zero).
- Visa-calendar arithmetic from your own dates: filing deadline, and unemployment days used by an offer.
- Liveness and E-Verify results **you** transcribed, each labeled with how it was obtained.
- The composite score, computed by the repository's own scorer, unmodified.

## What it cannot verify

- Whether a company sponsors **this** role (the CSV has a few top titles per company).
- What this role pays (the company median spans all titles; BLS is a national occupation median).
- Whether the liveness checker is right (it has called live Workday postings "expired").
- Which legal entity would employ you, and whether that entity is the one enrolled in E-Verify.
- Recent funding beyond a 50-row-per-quarter Form D sample.

## Dependencies

Node 20+, the repo's `npm install`, and the files in the agent twin's source inventory. For the
liveness gate only: `npx playwright install chromium` (about 95 MB). Your two input files live in
`course/2026fa/submissions/Arc-211/inputs/`.

## Annotated commands

Run it (writes the log and report into `course/2026fa/submissions/Arc-211/runs/triage/`):

```bash
node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs --as-of 2026-10-01
```

Offline tests (fixtures plus the real scorer; 18 cases, including every named failure):

```bash
node --test scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.test.mjs
```

Check one posting, quoted. Then open the page yourself anyway:

```bash
npm run ats:liveness -- "https://example.com/specific-job-posting"
```

Deliberate break: date the run after the OPT filing deadline. Expected: timeline factor 0, and every scored role becomes a gated Skip.

```bash
node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs --as-of 2027-03-01 --out-dir /tmp/arc211-break
```

## What it produces

A Markdown report for you, opening with a plain summary, with a label on every column, a reason
for every row, and a "could not verify" list. Alongside it: a JSON log for an agent, the exact
`roles.json` sent to the scorer, and the scorer's own outputs.

## Named failure modes

1. **Checker false negative.** A JavaScript-rendered posting (Workday) reads as "expired", and a
   top sponsor gets routed to "network" instead of "apply". It's hard to catch because the
   output looks authoritative. Mitigation: always open the page yourself; record `manual`.
2. **Missing data read as "no".** A blank sponsorship row, or an absent company (JPMorgan isn't
   in the file), looks like a non-sponsor. A student in a hurry won't notice. Mitigation: blank
   is `unknown` and is never scored; absent is `not-in-data`.
3. **Title-rule over-match.** "Business Analyst" or "Data Scientist" counts as a data role, and a
   company's past titles get mistaken for the posting's fit. Mitigation: fit is judged on the
   posting title, and no fit means `review-role-fit`.
4. **Entity confusion in E-Verify.** "Green Dot" also matches a school network, and SoFi has four
   entities. Mitigation: search by legal name, widen *Date Enrolled* to 30 years, record every
   match, and confirm the hiring entity at offer time.
