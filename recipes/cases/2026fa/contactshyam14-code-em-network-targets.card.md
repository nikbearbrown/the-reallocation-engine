# Network targets (Engineering Management, 12-month OPT) — human card

**Audience:** the student deciding which sponsors to ask for an informational conversation this week, and which to leave alone.  
**Agent twin:** `recipes/cases/2026fa/contactshyam14-code-em-network-targets.md`  
**Chapters:** 7 (who sponsors; Unknown is not Avoid), 8 (is the job real; liveness is a gate), 11 (the scorer; gates multiply).

## Executive summary

This card is the one-page version of a recipe that turns public visa-sponsorship records into a short list of companies to contact before they post a job. Read it before trusting the list: it says which parts are checked records, which parts are your own rules, and which known problems in the source data can make a company look like a sponsor when it isn't. On the sample run it produced four networking targets and one open job, and it found two problems in the source data that no existing audit reports.

## Purpose

Answer one question for an engineering-management graduate on 12-month OPT: *which companies have sponsored project- or production-management titles but have nothing matching open right now?* Those are the people to talk to before the role exists. If a company's record or its job board can't be checked, the tool says so — it holds the company rather than guess.

## What it can verify

- The sponsorship numbers, job titles, funding fields, and website shown for a company are copied from a named row of the 80 Days table — checked by hand with a second parser on the sample run (30 of 30 values matched).
- A sponsored title contains one of your target phrases, and which word list matched it.
- Whether the company appears in the repository's small sample of SEC funding filings.
- That every sponsorship count in the table is even (it is — all 1,557), and which companies share an identical sponsorship record with a differently named company (42 groups).
- When a job board was checked, how, and by whom; and that the repository's own scorer — not this tool — made each Apply / Skip call.

## What it cannot verify

- The occupation code actually filed for any sponsored title. "Technical Program Manager" counts as project management here; it may have been filed as a computer occupation.
- How many people a company really sponsored — the counts look doubled.
- That the sponsorship record belongs to this company and not a lookalike name.
- Which years the record covers, or whether the company sponsors now.
- Funding beyond 200 sampled filings; that the listed website is real; that a Lever or Ashby board is the company's.
- Anything about visa law. Which H-1B registration falls inside an OPT that runs 2026-12-31 → 2027-12-30, what happens if it isn't selected, and whether your degree is STEM-eligible are questions for your DSO or an immigration attorney.
- Whether you fit a given posting.

## Dependencies

- Node 20+ (no extra packages; no network for the prototype).
- `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, `data/bls/compact/soc_occupation_compact.csv`, `data/sec/form-d/processed/sample/*.sample.json` — all shipped with the repository.
- `scripts/score/role-scorer.mjs` (called unmodified) and, for the liveness step, `scripts/ats/scan.mjs` (public ATS APIs).
- Your persona file: dates, targets, keywords and rules — all your own input.

## Annotated commands

Tests first (offline, about 20 seconds; expect 21 passing):

```bash
node --test scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.test.mjs
```

Check the boards (network; prints matching postings and an error list — save the output, it is your liveness evidence):

```bash
REALLOCATION_ENGINE_PORTALS=scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/portals.network-targets.yml node scripts/ats/scan.mjs --dry-run
```

Run the sort (expect 57 candidates; network 4, apply 1, check-liveness 52 on the 2026-10-01 board evidence; the console also prints the OPT window):

```bash
node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-02 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-01.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/05-corrected-opt-dates
```

A window that has closed (expect `STOP (G1)`, exit 3, nothing written):

```bash
node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2028-01-15 --out-dir course/2026fa/submissions/contactshyam14-code/runs/f1
```

## What it produces

- A report for you (`network-targets.md`): the four groups with a next action each, the gates waiting for you, data warnings, and a verified-vs-inferred table.
- A log for an agent (`network-targets.json`): every value with its label and source row, input fingerprints, gate states.
- The scorer's own input and output (`roles.json`, `role-scores.json/.md`).

## Named failure modes

1. **Shared-record twins** — one employer's sponsorship history attached by an upstream fuzzy join to two or three similarly named companies (CONVEY / COVEY). You would contact a company believing it sponsors when the record is someone else's. *Mitigation:* flagged on every run; identity gate before outreach; no fuzzy matching in this tool.
2. **Title is not occupation** — a sponsored "Program Manager" is counted as project management though it may have been a software role filed under a computer code. Hardest to catch for someone who reads the title, not the filing. *Mitigation:* ambiguous keywords are capped at the "Likely" tier and labelled; filed SOC codes are a proposed data source.
3. **Doubled counts** — every count is even, so sponsorship looks twice as strong as it may be. *Mitigation:* reported every run; counts shown as stored; read them as relative sizes.
4. **Missing gate read as open** — the scorer treats a missing liveness value as "open". A forgotten board check would turn a ghost into an Apply. *Mitigation:* no company is scored without a dated, explicit check; a test pins the scorer's behaviour.
5. **Date skew** — the scanner and scorer print UTC dates; a late-evening check in Boston is "tomorrow" to them. *Mitigation:* record the local date; checks dated after the run date are held.
6. **Guessed website** — the table's website is inferred from the name (e.g. `salesforcecom.com`). *Mitigation:* never used as a careers page; a board must be found and confirmed.
