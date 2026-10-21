# Worked run: the Data-Analyst Sponsor Check, run for real on 2026-10-20

## Executive summary

**What this is.** The record of running the mode against real data: every command, its real output
pasted in, what the data established against what was judged, how the output was checked, the
deliberate attempts to break it, and what it got wrong. **Why read it.** It is the evidence behind the
mode's DRAFT status (2 typed TODOs open). **What it found.** With full SEC funding data and the Department of Labor's own H-1B
filing records, the mode checked 6 real Boston job leads for a fictional OPT student. Result: 2 to
tailor, 1 to network into, 1 to skip, and 2 for a person to resolve. The filing records contradicted the
sponsor list twice. A "Proven" analyst sponsor (Benefits Science) has no analyst filing anywhere in the
FY2026 file, and HubSpot, which is missing from the sponsor list, filed one. The run also found four
problems in the engine and one in my own new script.

## Run record

- **Mode:** `recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.md` v0.2.0 (DRAFT)
- **Branch:** `mode/riyask29-data-analyst` of the riyask29 fork. Engine baseline: a fresh clone of upstream `main`.
- **Ran by:** the AI assistant (Claude Code) at Riya's direction, in Riya's checkout. Riya downloaded
  the DOL workbook in her browser. Every output below was saved to `runs/` as it ran.

## Inputs (nothing here is private)

| Input | Value | Label |
|---|---|---|
| Persona | fictional "Sneha Patil": F-1 OPT year 1, OPT ends 2027-04-30, 41 of 90 unemployment days used, needs sponsorship, target SOC 15-2051.01 and 13-1161.00 (`inputs/persona.example.json`) | your-input |
| Leads | 6 real public postings or companies found 2026-10-02: EverQuote, Abacus Insights, Klaviyo, Benefits Science, Writer, HubSpot (`inputs/candidates.json`) | your-input |
| Sponsor history | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | record |
| Wages | `data/bls/compact/soc_occupation_compact.csv` (OEWS 2024, national) | record |
| Funding | SEC Form D, 4 full quarters 2025Q2 to 2026Q1, fetched today (gitignored) | record |
| H-1B filings by SOC | DOL OFLC `LCA_Disclosure_Data_FY2026_Q3.xlsx` (sha256 `f8ca8448…28b3`) → `data/lca-ma-analyst-fy2026q3.csv` | record |

## 1. The engine on a fresh clone, before my changes

The brief asks for the conformance check and a side-effect-free real run first. These ran on a fresh
clone of upstream `main` (`engine-00-fresh-clone.txt`: `commit 015843d 2026-09-23`).

```text
$ npm run verify

> the-reallocation-engine@1.0.0 verify
> node scripts/conformance.mjs && node scripts/manifest-check.mjs

conformance: 158 files (85 md · 36 py · 30 js · 4 sh · 3 json)
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
```

```text
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked

RECIPES (33)
  with lifecycle frontmatter: 33   missing: 0
  by status: DRAFT 28 · RUNNABLE-SAMPLE 4 · RUNNABLE-LIVE  # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED 1
  open TODOs: 318 declared (in frontmatter) · 318 [TODO markers in bodies

SUMMARY
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
```

`npm run ats:scan -- --dry-run` (with the repo's example portals file) ends:

```text
  + Databricks | Staff Unified Communications Engineer | San Francisco, California; United States
  + Databricks | Strategic Account Executive - Retail vertical  | Remote - California
  + Databricks | Strategic Core Account Executive - Retail  | Remote - Ohio
  + Databricks | Technical Enablement Specialist  - Field Engineering Onboarding | United States

(dry run — run without --dry-run to save results)

Review new offers in data/ats/pipeline.md.
```

`npm run score`, typed the way the brief writes it, only prints a usage line. It needs a roles file:

```text
$ npm run score

> the-reallocation-engine@1.0.0 score
> node scripts/score/role-scorer.mjs

Usage: role-scorer.mjs <roles.json> [--profile p.json] [--out-dir dir] [--md report.md]
```

```text
$ npm run score -- data/examples/ch11-roles.json --out-dir /tmp/score-out

> the-reallocation-engine@1.0.0 score
> node scripts/score/role-scorer.mjs data/examples/ch11-roles.json --out-dir /tmp/score-out

✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)
  ../score-out/role-scores.json  +  ../score-out/role-scores.md

# (path note: the --out-dir was a local scratch folder; its path is shown as /tmp/score-out)
```

**Liveness, upstream checker.** These are the three posting URLs from my leads. EverQuote's job is open
(a person saw the application form on 2026-10-02), but the checker says `uncertain`:

```text
$ npm run ats:liveness -- <EverQuote URL> <Abacus URL> <Writer expired URL> (fresh clone = upstream checker, no iframe fix)

Checking 3 URL(s)...

⚠️ uncertain  https://careers.everquote.com/job/?gh_jid=7999629003
           content present but no visible apply control found
✅ active     https://boards.greenhouse.io/abacusinsights/jobs/8770716002?gh_jid=8770716002
❌ expired    https://jobs.ashbyhq.com/writer/04ad3b44-51df-4fa6-a17c-cab6875f70cd
           pattern matched: job (listing )?not found

Results: 1 active  1 expired  1 uncertain
```

## 2. Fixing liveness (TODO 3)

The cause: careers.everquote.com embeds its Greenhouse application form in an iframe
(`job-boards.greenhouse.io/embed/job_app`), and the checker reads only the top document. The fix
(`scripts/ats/liveness-browser.mjs`, the branch's one declared maintained-file patch) also reads apply
controls inside frames served by known ATS hosts, and never inside any other frame. The same command on
this branch:

```text
$ npm run ats:liveness -- <same 3 URLs>   (this branch: ATS-iframe fix in scripts/ats/liveness-browser.mjs)

Checking 3 URL(s)...

✅ active     https://careers.everquote.com/job/?gh_jid=7999629003
✅ active     https://boards.greenhouse.io/abacusinsights/jobs/8770716002?gh_jid=8770716002
❌ expired    https://jobs.ashbyhq.com/writer/04ad3b44-51df-4fa6-a17c-cab6875f70cd
           pattern matched: job (listing )?not found

Results: 2 active  1 expired  0 uncertain
```

The expired Writer posting still reads `expired`, so the fix did not make a dead posting look live. The
offline test and the mutant checks are in section 6.

## 3. Full SEC Form D quarters (TODO 2)

The first download failed on this machine's Python, not on the SEC:

```text

Summary
Downloaded: 0
Skipped: 0
Failed: 6
2025Q2: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1032)>; 2025Q3: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1032)>; 2025Q4: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1032)>; 2026Q1: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1032)>; 2026Q2: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1032)>; 2026Q3: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1032)>
```

```text
# first attempt failed: CERTIFICATE_VERIFY_FAILED (python.org Python 3.13 has no CA bundle until "Install Certificates.command" is run). Re-run with certifi bundle:
$ SSL_CERT_FILE=$(python3 -m certifi) python3 scripts/sec/download-form-d-quarters.py --quarters 2025Q2 2025Q3 2025Q4 2026Q1 2026Q2 2026Q3 --user "<name> <email>"
SEC Form D quarter refresh
Output root: ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d
Quarters: 2025Q2, 2025Q3, 2025Q4, 2026Q1, 2026Q2, 2026Q3
2025Q2: downloaded, extracted -> ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d/extracted/2025q2-d
2025Q3: downloaded, extracted -> ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d/extracted/2025q3-d
2025Q4: downloaded, extracted -> ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d/extracted/2025q4-d
2026Q1: downloaded, extracted -> ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d/extracted/2026q1-d
2026Q2: failed HTTP 404
2026Q3: failed HTTP 404

Summary
Downloaded: 4
Skipped: 0
Failed: 2
2026Q2: HTTP 404; 2026Q3: HTTP 404
```

The engine's own processing step then could not find what its own download step had written:

```text
$ python3 scripts/sec/refresh-recent-sec-quarters.py
Missing: ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d/extracted/2025q2-d
Missing: ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d/extracted/2025q3-d
Missing: ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d/extracted/2025q4-d
Missing: ~/Documents/INFO7375/the-reallocation-engine/data/sec/form-d/extracted/2026q1-d

Summary
Processed: 0
Missing: 4
Missing extracted quarter folders. Run download-form-d-quarters.py first.
python3 scripts/sec/refresh-recent-sec-quarters.py 2>&1  0.37s user 0.11s system 24% cpu 2.007 total
```

```text
# Defect: download-form-d-quarters.py extracts to extracted/<q>-d/<YYYYQn>_d/, but refresh-recent-sec-quarters.py
# resolve_quarter_dir() only checks extracted/<q>-d and extracted/<q>-d/<q>-d, so it reports every quarter "Missing".
# Workaround (local, gitignored data only; no code change): move the TSVs up one level.
$ mv data/sec/form-d/extracted/2025q2-d/2025Q2_d/* data/sec/form-d/extracted/2025q2-d/
$ mv data/sec/form-d/extracted/2025q3-d/2025Q3_d/* data/sec/form-d/extracted/2025q3-d/
$ mv data/sec/form-d/extracted/2025q4-d/2025Q4_d/* data/sec/form-d/extracted/2025q4-d/
$ mv data/sec/form-d/extracted/2026q1-d/2026Q1_d/* data/sec/form-d/extracted/2026q1-d/

$ python3 scripts/sec/refresh-recent-sec-quarters.py
✅ 2025q2-d        - 13325 companies → companies-sec-2025q2-d.json
✅ 2025q3-d        - 14138 companies → companies-sec-2025q3-d.json
✅ 2025q4-d        - 14885 companies → companies-sec-2025q4-d.json
✅ 2026q1-d        - 15981 companies → companies-sec-2026q1-d.json

Summary
Processed: 4
Missing: 0
```

**Cross-check:** 13,325 + 14,138 + 14,885 + 15,981 = 58,329. That is the same total the Oct 2 run printed
from the sample files' metadata ("200 of 58,329 companies").

## 4. DOL H-1B filings by occupation code (TODO 1)

dol.gov answers scripted downloads with `403 Access Denied`, so Riya downloaded the workbook in a
browser. `lca_slice.py` keeps certified H-1B filings at Massachusetts worksites in the analyst SOC
families (`config/lca-soc-families.json`) and writes counts per employer and SOC. It writes no case
numbers and no person's name or contact.

```text
$ python3 scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/lca_slice.py --xlsx ~/Downloads/LCA_Disclosure_Data_FY2026_Q3.xlsx --state MA --out scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv --audit scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3-audit.md   (after the blank-row fix)
[lca_slice] blank rows skipped 595,239 · read 437,496 · kept 1,842 · 855 employers · 1071 rows → scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv
```

The audit it writes beside the data (rows in, rows out):

```text
## Rows in, rows out

| step | rows |
|---|---|
| blank sheet rows skipped (not filings) | 595,239 |
| read | 437,496 |
| drop: SOC not in analyst families | 11,834 |
| drop: not H-1B | 10,544 |
| drop: status Certified - Withdrawn | 1,182 |
| drop: status Denied | 104 |
| drop: status Withdrawn | 239 |
| drop: worksite not in MA | 411,751 |
| **kept** | **1,842** |

## Kept, by SOC code

| SOC | title | family | certified LCAs |
|---|---|---|---|
| 15-2051.00 | Data Scientists | adjacent | 720 |
| 15-2051.01 | Business Intelligence Analysts | core | 263 |
| 15-2031.00 | Operations Research Analysts | adjacent | 230 |
| 15-1211.00 | Computer Systems Analysts | adjacent | 183 |
| 13-1111.00 | Management Analysts | adjacent | 180 |
| 13-1161.00 | Market Research Analysts and Marketing Specialists | core | 158 |
| 15-2041.00 | Statisticians | adjacent | 107 |
| 13-1161.00 | Marketing Research Analysts and Marketing Specialists | core | 1 |

## Top 15 employers (all kept SOCs)

| employer | certified LCAs |
|---|---|
| Wayfair LLC | 79 |
| Amazon.com Services LLC | 49 |
| Boston Consulting Group, Inc. | 39 |
| McKinsey & Company, Inc. United States | 22 |
| Staples, Inc. | 20 |
| State Street Bank and Trust Company | 20 |
| Fidelity Technology Group, LLC d/b/a Fidelity Investments | 19 |
| Fidelity Brokerage Services LLC d/b/a Fidelity Investments | 18 |
| Dana-Farber Cancer Institute | 18 |
| General Hospital Corporation | 17 |
| Takeda Development Center Americas, Inc. | 17 |
| FMR LLC d/b/a Fidelity Investments | 15 |
| Accenture LLP | 14 |
| MCKINSEY & COMPANY, INC. UNITED STATES | 13 |
| Ernst & Young U.S. LLP | 13 |
```

## 5. The final run (both new sources, live liveness)

```text
Checking 3 posting URL(s) with Playwright…
  liveness active    https://careers.everquote.com/job/?gh_jid=7999629003
  liveness active    https://boards.greenhouse.io/abacusinsights/jobs/8770716002?gh_jid=8770716002
  liveness active    https://www.klaviyo.com/careers/jobs/7737707003?gh_jid=7737707003
✓ 6 leads · scored 3 · stopped G1 2 · G2 0 · G3 0 · no-posting 1
  scorer: ✓ scored 3 roles → Apply 0 · Consider 2 · Skip 1 (skip 33%)
  everquote-sem            review-then-tailor   composite 0.231 in the Consider band [0.2, 0.3)
  abacus-growth-analytics  review-then-tailor   above threshold (0.420) but one soft spot: sponsorship tier "Likely"
  klaviyo-analytics-eng    skip                 gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes)
  benefits-science-da      network              Proven analyst sponsor with no posting to apply to
  writer-expired           resolve-company      company identity: no-h1b-record
  hubspot-da               resolve-company      company identity: not-in-dataset
  → course/2026fa/submissions/riyask29/mode-build/runs/run-b-final/analyst-check-log.json  +  course/2026fa/submissions/riyask29/mode-build/runs/run-b-final/analyst-check-report.md
```

The report's table (`runs/run-b-final/analyst-check-report.md`):

```text
## Leads and next actions

| Lead | Analyst-sponsor tier | Posting | Timeline | Scorer | Next action |
|---|---|---|---|---|---|
| EverQuote — Senior Analyst, SEM | Possible (p 0.3) | active | 0.7 (inside-buffer) | Consider 0.231 | **Review titles, then tailor** — composite 0.231 in the Consider band [0.2, 0.3) |
| Abacus Insights — Growth Analytics Manager, Payment Integrity | Likely (p 0.6) | active | 1 (clear) | Consider 0.420 | **Review titles, then tailor** — above threshold (0.420) but one soft spot: sponsorship tier "Likely" |
| Klaviyo — Analytics Engineer | Unknown (p 0.15) | active | 0 (start-after-cliff) | Skip 0.000 | **Skip** — gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) |
| Benefits Science LLC — Data Analyst (no open posting found) | Proven (p 0.9) | no-posting | 1 (clear) | not scored | **Network first (informational chat)** — Proven analyst sponsor with no posting to apply to |
| Writer — Posting from repo examples | — (no-h1b-record) | — | — | not scored | **Human: confirm the company** — company identity: no-h1b-record |
| HubSpot — Data Analyst | — (not-in-dataset) | — | — | not scored | **Human: confirm the company** — company identity: not-in-dataset |
```

The gate section, where the title guesses and the occupation-code records now sit side by side:

```text
## Gates a person must clear

- **G1 Company identity.** For every lead marked *not-in-dataset*, *no-h1b-record*, *ambiguous* or *near matches*: confirm the right company or accept "unknown". Missing from this dataset does not mean the company never sponsors.
- **G2 Posting.** Open every *active* posting yourself before tailoring. Open any *uncertain* one before it is scored.
- **G3 Timeline.** Check the dates in each timeline line. If you are unsure about STEM-extension eligibility, ask your DSO, not this tool.
- **G4 Title review.** For each Proven or Likely lead, read the matched titles below and confirm they are work you would do:
  - Abacus Insights: "Business Analyst Manager - Data Distribution Team" matched `business analyst` → ambiguous-analyst
  - Benefits Science LLC: "Data Analyst" matched `data analyst` → data-analyst-family

  The same check by occupation code (DOL LCA records, certified H-1B, Massachusetts worksites):
  - EverQuote: 2 × 15-2051.00 Data Scientists (adjacent) — e.g. Senior Quantitative Analyst; Senior Analyst
  - Abacus Insights: 1 × 15-2051.00 Data Scientists (adjacent) — e.g. Data Engineer
  - Klaviyo: 2 × 15-2051.00 Data Scientists (adjacent) — e.g. Ai Engineer Ii; Sr. Data Scientist
  - Klaviyo: 1 × 15-2051.01 Business Intelligence Analysts (core) — e.g. Deliverability Operations Analyst
  - HubSpot: 1 × 15-2041.00 Statisticians (adjacent) — e.g. Senior Statistical Analyst
  - Benefits Science LLC: no certified analyst-family LCA under this name in the file
  - Writer: no certified analyst-family LCA under this name in the file
```

The recipe's handoff and gate tests, run against this log:

```text
# Handoff + gate tests from the recipe, run against ./course/2026fa/submissions/riyask29/mode-build/runs/run-b-final/analyst-check-log.json
$ handoff
handoff ok {"candidates":6,"scored":3,"stopped":{"G1":2,"G2":0,"G3":0,"no-posting":1},"form_d_in_sample":0}
exit=0
$ G1
writer-expired no-h1b-record 
hubspot-da not-in-dataset 
exit=0
$ G2
scored with bad liveness: 0
exit=0
$ G3
everquote-sem 0.7 Consider
abacus-growth-analytics 1 Consider
klaviyo-analytics-eng 0 Skip
exit=0
$ G4
abacus-growth-analytics "Business Analyst Manager - Data Distribution Team" -> ambiguous-analyst (business analyst)
benefits-science-da "Data Analyst" -> data-analyst-family (data analyst)
exit=0
```

## Verified vs inferred, line by line

| Claim in the output | Verified (record or script) | Inferred (a rule or a judgment) |
|---|---|---|
| EverQuote, Abacus, Klaviyo postings were open at run time | Playwright liveness, timestamped in `liveness.json` | that they will still be open when Riya applies (G2: she opens each) |
| EverQuote has 56 H-1B approvals, 0 denials | sponsor CSV row | — |
| EverQuote tier "Possible", Abacus "Likely", Benefits Science "Proven" | the titles themselves (CSV) | the tier: my keyword rules (`title-families.json`) and p mapping |
| EverQuote filed 2 certified LCAs under 15-2051.00 in MA, e.g. "Senior Quantitative Analyst; Senior Analyst" | DOL LCA file, recounted with pandas | whether "Senior Analyst" there is data-analyst work (G4) |
| Abacus's one LCA is a Data Engineer | DOL LCA file | that this weakens "Likely" (a person decides at G4; the score is unchanged) |
| Klaviyo: 1 core (BI Analyst) + 2 adjacent LCAs | DOL LCA file (pandas: 3) | — |
| HubSpot: 1 LCA (Senior Statistical Analyst, 15-2041) | DOL LCA file | whether HubSpot sponsors analysts now (one filing is thin) |
| Benefits Science: no LCA anywhere in the FY2026 Q3 file | pandas search of all 437,496 rows | why: a different legal name, no filing this year, or a smaller employer that files rarely |
| No lead company filed a Form D in 2025Q2 to 2026Q1 | exact-name join over 58,329 issuers | that this means anything about money: EverQuote and Klaviyo are public and never file Form D |
| Klaviyo is Skip (timeline 0) | the arithmetic: min(192, 49) − 70 < 0 | the 10-week hiring lag is the student's estimate (TODO 4) |
| EverQuote composite 0.231 (Consider) | the engine's own scorer | its inputs p = 0.3 and fit 0.75 are my mapping and the student's self-rating |
| Wage ratio 1.04 / 1.53 for EverQuote | BLS OEWS 2024 and the CSV's company median | that it says anything about an analyst's pay (it does not: it covers all roles) |

## Verification

- **Re-ran after every change:** test suites, then the live run. Run A (full Form D only) and run B (Form D
  plus LCA) give the same next actions, which shows the LCA data is evidence for a person and does not change the score.
- **Cross-checked a count against the source with a second reader.** pandas recount of the raw workbook:

```text
# pandas.read_excel(usecols=['CASE_STATUS', 'VISA_CLASS', 'SOC_CODE', 'EMPLOYER_NAME', 'WORKSITE_STATE']) on LCA_Disclosure_Data_FY2026_Q3.xlsx
rows read: 437496
kept (certified H-1B, MA worksite, analyst families): 1842   <- lca_slice.py said 1,842
Everquote, Inc.: 2
Abacus Insights, Inc.: 1
Klaviyo, Inc.: 3
HubSpot, Inc.: 1

# 'Benefits Science' anywhere in the file (any state, SOC, status): 0
```

  1,842 = 1,842, and every lead's count matches. The recount also caught a bug in my script (below).
- **Cross-checked a join by hand:** every Form D issuer whose name merely *contains* a lead's name:

```text
# Cross-check: any Form D issuer whose name CONTAINS each lead's company word (case-insensitive), all 4 full quarters
EverQuote: 0 issuer row(s) containing 'everquote'
Abacus Insights: 12 issuer row(s) containing 'abacus'
    ('2025q2-d', 'SpaceX 2024 1, a Series of Abacus Capital US Master LLC', 'DE', '27-MAY-2025', 1289556.0)
    ('2025q2-d', 'Abacus Enhanced Income Plus, LP', 'FL', '13-MAY-2025', 1500000.0)
    ('2025q2-d', 'Abacus Premier Income Fixed, LP', 'FL', '09-MAY-2025', 92404623.0)
    ('2025q2-d', 'Abacus Premier Income Fixed, LP', 'FL', '08-MAY-2025', 94404623.0)
    ('2025q2-d', 'Abacus Enhanced Income Fixed, LP', 'FL', '08-MAY-2025', 3425000.0)
    ('2025q2-d', 'Abacus Premier Income Plus, LP', 'FL', '08-MAY-2025', 27000000.0)
Klaviyo: 0 issuer row(s) containing 'klaviyo'
Benefits Science: 0 issuer row(s) containing 'benefits science'
Writer: skipped (the word 'writer' matches too many unrelated issuers to be a useful check)
HubSpot: 0 issuer row(s) containing 'hubspot'
```

  A substring join would have credited Abacus Insights with a $94M raise by an unrelated Florida fund.
- **Parsed the JSON log:** the handoff and G1 to G4 gate commands above read `analyst-check-log.json` and exit 0.
- **Conformance and privacy:** `npm run verify`, `npm run doctor` and `node scripts/pii-scan.mjs`, run on this branch (below).

### Conformance and privacy on this branch, after all changes

```text
$ npm run verify
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)

$ npm run doctor   (summary lines)
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked
  open TODOs: 318 declared (in frontmatter) · 318 [TODO markers in bodies
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue

$ node scripts/pii-scan.mjs --diff upstream/main   (what CI runs on the PR branch history)
pii-scan: clean ✓

$ node scripts/conformance.mjs <my paths>
conformance: 62 files (20 md · 4 js · 34 json · 3 py · 1 sh)
✓ all conform (machine half of P4). Adequacy is still the human gate.
```

The 3 manifest warnings are the same ones a fresh clone shows (section 1); `private/` and `data/ats/`
are ignored as `/private/*` and `/data/ats/*`. The doctor's TODO count stays at 318 whatever this
recipe declares, because the doctor reads only top-level `recipes/*.md` and never `recipes/cases/`,
where student recipes go. So I checked this recipe's count by hand:

```text
# doctor reads only top-level recipes/*.md (scripts/doctor.mjs: fs.readdirSync("recipes")); student recipes live in recipes/cases/<term>/.
$ grep -n "readdirSync(.recipes.)" scripts/doctor.mjs
92:const recipes = fs.readdirSync('recipes')
$ hand check of this recipe: declared todos_open vs [TODO markers in the body
declared: 2   body [TODO markers: 2
```

## 6. Deliberate attempts to break it

```text
## Break 1: --lca names a file that does not exist
$ node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --lca scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/does-not-exist.csv --liveness-file scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json --out-dir course/2026fa/submissions/riyask29/mode-build/runs/break/b1
✗ data path missing: scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/does-not-exist.csv
exit=2  outputs written: 0   (exit code re-checked without the sed pipe; the first capture printed sed's status)

## Break 2: shortened / re-cased company names ("Abacus", "hubspot inc.") with full Form D + LCA
$ node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --candidates course/2026fa/submissions/riyask29/mode-build/runs/break/candidates.name-variants.json --formd-dir data/sec/form-d/processed --lca scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv --liveness-file scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json --today 2026-10-20 --out-dir course/2026fa/submissions/riyask29/mode-build/runs/break/b2
✓ 2 leads · scored 0 · stopped G1 2 · G2 0 · G3 0 · no-posting 0
  scorer: no role reached the scorer
  abacus-short             resolve-company      company identity: not-exact-near-matches
  hubspot-lower            resolve-company      company identity: not-in-dataset
exit=0 (both leads stop at G1 as intended; a stop is not an error)
  abacus-short | G1: not-exact-near-matches | near: ABACUS BIOSCIENCE INC; ABACUS INSIGHTS INC; OREGON ABACUS MULTIFAMILY ASSOCIATES LP | sponsorship: null | LCA: none-under-this-name core 0 adj 0
  hubspot-lower | G1: not-in-dataset | near: - | sponsorship: null | LCA: found core 0 adj 1

## Break 3: LCA workbook with a missing column / no rows (offline unit tests)
$ python3 scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/test_lca_slice.py
test_break_empty_file_halts (__main__.T.test_break_empty_file_halts) ... ok
test_break_missing_column_halts (__main__.T.test_break_missing_column_halts) ... ok
test_filters_and_counts (__main__.T.test_filters_and_counts) ... ~/Documents/INFO7375/the-reallocation-engine/scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/test_lca_slice.py:36: ResourceWarning: unclosed file <_io.TextIOWrapper name='/var/folders/1p/7w5125fs48n4wcwcfpgjs9w00000gn/T/tmpb3hdoja7/out.csv' mode='r' encoding='UTF-8'>
test_never_writes_people_or_case_numbers (__main__.T.test_never_writes_people_or_case_numbers) ... ~/Documents/INFO7375/the-reallocation-engine/scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/test_lca_slice.py:36: ResourceWarning: unclosed file <_io.TextIOWrapper name='/var/folders/1p/7w5125fs48n4wcwcfpgjs9w00000gn/T/tmp79bzy69n/out.csv' mode='r' encoding='UTF-8'>
Ran 4 tests in 0.876s
OK

## Break 4: mutant liveness checkers against the offline frame test
# mutant A = upstream checker (ignores iframes); mutant B = reads EVERY iframe (no ATS host allow-list)
$ node --test liveness_frames.test.mjs   (mutant A)
✖ apply form inside a Greenhouse embed iframe → active (2403.454167ms)
✔ break attempt: "Apply now" inside a non-ATS widget iframe is NOT read → uncertain (2016.24725ms)
✔ job text with no apply control anywhere → still uncertain (no regression) (2012.753958ms)
ℹ pass 2
ℹ fail 1
$ node --test liveness_frames.test.mjs   (mutant B)
✔ apply form inside a Greenhouse embed iframe → active (2179.347459ms)
✖ break attempt: "Apply now" inside a non-ATS widget iframe is NOT read → uncertain (2017.974292ms)
✔ job text with no apply control anywhere → still uncertain (no regression) (2014.575667ms)
ℹ pass 2
ℹ fail 1
$ node --test liveness_frames.test.mjs   (patched, restored)
ℹ pass 3
ℹ fail 0
```

## 7. What the run found in the engine

1. **`npm run ats:liveness` misses applications embedded in an iframe:** a live posting reads `uncertain`.
   Fixed on this branch, with a test.
2. **The Form D download and refresh scripts disagree on folder layout:** on a fresh clone every quarter
   reports `Missing`. Workaround documented; proposed as recipe TODO 5 (not patched, to keep to one
   maintained-file patch).
3. **The brief's `npm run score` needs a roles file**, and the brief's `python3 scripts/sec/refresh-recent-sec-quarters.py`
   needs the quarters downloaded first. Neither works as written on a fresh clone.
4. **SEC had not posted 2026 Q2 or Q3** on 2026-10-20 (HTTP 404), so the newest funding data is about seven months old.
5. **`npm run doctor` cannot see student recipes.** It lists `recipes/*.md` only, while CONTRIBUTING puts
   student recipes in `recipes/cases/<term>/`. Its status dashboard and TODO totals leave out every student
   mode, and I first misread its unchanged total as evidence about mine.

## Reflection

**What went well.** The new source answered the question the old mode could only guess at, and it did so
twice against the old answer (Benefits Science, HubSpot). The gates held. Nothing stopped at G1 got a
sponsorship value, a missing file stopped the run, and a shortened name produced near matches instead of
a guess. The independent recount was worth doing: it matched the result *and* exposed a counting bug.

**What the mode got wrong or missed.**
- My `lca_slice.py` counted 595,239 blank sheet rows as filings. The kept count was right, but the audit
  overstated what was read. Fixed, tested, and re-sliced (the CSV was byte-identical).
- The tier still comes from titles. The LCA record sits beside it at G4 and does not change it, so a
  person must read both. Benefits Science still shows "Proven".
- The persona's 41 used unemployment days are a fixed input. Eighteen days after the first run, a real
  student would have used more, and the timeline would be tighter. The mode does not count days for you.
- Names must match exactly. Fidelity files LCAs under at least four legal names, and the mode sees each separately.
- One fiscal year, one state: an employer whose analysts sit outside Massachusetts reads as "none".

**Next steps.** (1) Done during this run: Riya confirmed both provenance lines (TODO 1 and 2 closed) and cleared G1–G4. (2) Use the LCA
record in the tier itself, a scoring decision that needs a written rule and a test first. (3) Add an
employer alias list (legal name → brand) with its source, so "Fidelity" means all its entities.
(4) Make the unemployment-day count a running count from a start date. (5) Report the Form D
folder-mismatch fix upstream as its own one-file PR.

## Attestation
- Recipe: riyask29-data-analyst-sponsor-boston v0.2.0 (DRAFT)
- By: the AI assistant (Claude Code) for riyask29 · 2026-10-20. Rows marked **(riyask29)** Riya did herself; she also recorded the provenance and G1–G4 decisions in `logs/runs/2026fa-riyask29-3.md`.

### Tested
| Ran | Saw | Expected |
|---|---|---|
| `node --test …/analyst_check.test.mjs` | pass 10, fail 0 | all pass |
| `node --test …/liveness_frames.test.mjs` | pass 3, fail 0 | all pass |
| `python3 …/test_lca_slice.py` | 5 tests OK | all pass |
| **(riyask29)** opened the EverQuote, Abacus Insights and Klaviyo postings in a browser (G2) | all three open | the machine's `active` is right |
| **(riyask29)** checked the DOL workbook and the SEC quarters are the files she downloaded / that were fetched today | confirmed | provenance for TODO 1 and 2 |
| `npm run ats:liveness` on the EverQuote posting, upstream vs this branch | `uncertain` vs `active` | open posting reads active |
| same command on the expired Writer posting, this branch | `expired` (pattern: job not found) | still expired |
| final run with full Form D + LCA, live | 6 leads: Consider 2, Skip 1, network 1, resolve-company 2 | gates stop G1 cases; no invented values |
| handoff + G1–G4 gate tests on the final log | all exit 0 | exit 0 |
| pandas recount of the raw LCA workbook | kept 1,842; per-lead counts equal | equal to the slice |
| **break:** `--lca` path that does not exist | exit 2, no outputs | refuse, write nothing |
| **break:** company typed "Abacus", "hubspot inc." | G1 stop, near matches listed, `sponsorship: null`; LCA found for HubSpot | stop with hints, never p = 0 |
| **break:** LCA workbook missing `SOC_CODE` / with no rows | exit 2, no CSV | halt |
| **break:** mutant checker ignoring iframes / reading every iframe | each fails one frame test | at least one failure each |
| **break:** substring Form D join on "abacus" | 12 unrelated funds | exact-name join is required |

### Did not test
- Riya re-running the commands in her own terminal (the Oct 2 runs were hers; these were the assistant's; she did the browser and provenance checks).
- Any state but Massachusetts, any LCA file but FY2026 Q3, or LCA FY2025 to compare years.
- Employers filing under brand names different from their legal names, beyond the Fidelity example.
- Liveness on Lever, Ashby or Workday postings that are open (only Greenhouse-embedded and one expired Ashby posting).
- Node 20 (CI's version); only Node 24 locally. The CI harness jobs, which fail upstream for missing scripts (not this branch).
- Whether any tier would change if LCA counts fed the score: deliberately not done.
- Timing the manual research the mode replaces.

### Broke during testing, fixed
- SEC download: `CERTIFICATE_VERIFY_FAILED` on python.org Python 3.13 → run with `SSL_CERT_FILE=$(python3 -m certifi)` (no code change).
- Form D refresh: every quarter `Missing` → files moved up one level (engine defect, recipe TODO 5).
- dol.gov `403` to scripts → the workbook was downloaded in a browser.
- `lca_slice.py` counted 595,239 blank rows as filings → blank rows skipped and reported; new test; re-sliced, CSV byte-identical.
- My own test expected the wrong median (90,000, not 93,600) → test corrected; the script was right.
- Break 1's first capture printed the exit code of `sed`, not the tool (0) → re-checked: exit 2. The file says so.
- I first wrote that the doctor's TODO total "fell from 318 to 316" after the closures. It had not moved, because the doctor never reads `recipes/cases/` (engine finding 5) → claim removed, count checked by hand (`runs/14-…`).

