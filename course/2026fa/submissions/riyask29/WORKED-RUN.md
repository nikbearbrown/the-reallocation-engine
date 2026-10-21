# Worked run — Data-Analyst Sponsor Check, 2026-10-02

## Executive summary

This document shows the prototype run on six job leads for a fictional
data-analyst job-seeker in Boston, with every terminal output pasted exactly as
it appeared. It ran three times. Run 1 was the first live run. In run 2, my own
re-run, the tool stopped two postings it could not confirm. I then opened them
myself, cleared the gates, changed one of the tool's title rules, and did a final
run 3. **Final result:** two leads worth tailoring after a title check (Abacus
Insights, EverQuote), one networking target (Benefits Science), one skip
(Klaviyo: hiring would outlast the remaining unemployment days), and two
companies to research by hand (Writer, HubSpot). Nothing came out as a plain
"Apply". In this sample, no company that clearly sponsored data analysts had an
open posting. Every number is labeled as a data record or as my own input. Values
were checked by hand against the source files, and the tool was deliberately
attacked three ways.

## Inputs

| Input | Value | Label |
|---|---|---|
| Persona | `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/persona.example.json`: "Sneha Patil" (fictional, `@example.com`, 555 number), F-1 OPT year 1, OPT ends 2027-04-30, 41/90 unemployment days used, 20-day buffer, target SOC 15-2051.01 + 13-1161.00 | your-input |
| Leads | `inputs/candidates.json`: 6 leads. Three are real public postings found 2026-10-02 on the companies' Greenhouse boards (EverQuote, Abacus Insights, Klaviyo); one is a sponsor with no posting (Benefits Science); one is an expired URL from the repo's own examples (Writer); one is a company missing from the CSV (HubSpot). Hiring lag and fit are my estimates. | your-input |
| Sponsor data | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (full file as shipped, 30,369 rows) | record |
| Wage data | `data/bls/compact/soc_occupation_compact.csv` (OEWS 2024, national) | record |
| Funding data | `data/sec/form-d/processed/sample/*.sample.json`, **samples only**: 4 × 50 companies | record |

## Run 1: first live run (executed by the AI assistant)

```
$ node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --today 2026-10-02
Checking 3 posting URL(s) with Playwright…
  liveness uncertain https://careers.everquote.com/job/?gh_jid=7999629003
  liveness active    https://boards.greenhouse.io/abacusinsights/jobs/8770716002?gh_jid=8770716002
  liveness active    https://www.klaviyo.com/careers/jobs/7737707003?gh_jid=7737707003
✓ 6 leads · scored 2 · stopped G1 2 · G2 1 · G3 0 · no-posting 1
  scorer: ✓ scored 2 roles → Apply 0 · Consider 1 · Skip 1 (skip 50%)
  everquote-sem            check-posting-by-hand liveness: uncertain
  abacus-growth-analytics  review-then-tailor   above threshold (0.420) but one soft spot: sponsorship tier "Likely"
  klaviyo-analytics-eng    skip                 gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes)
  benefits-science-da      network              Proven analyst sponsor with no posting to apply to
  writer-expired           resolve-company      company identity: no-h1b-record
  hubspot-da               resolve-company      company identity: not-in-dataset
  → scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-log.json  +  scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-report.md
```

Liveness checked at `2026-10-02T17:23:41Z`, `17:23:43Z`, `17:23:47Z`. Run 1's
files were later overwritten in `out/`; a clean-copy execution of the same
command, with the same next actions, is kept in `runs/run-1-clean-copy/`.

Run 1's scorer report (`role-scores.md`, written by
`scripts/score/role-scorer.mjs`, unchanged):

```
**Summary:** 2 roles → Apply 0 · Consider 1 · Skip 1. **Skip rate 50%** (healthy — a good run skips at least half).

| Role | Composite | Rec | Why | Audit (term · value · weight · source) |
|---|---|---|---|---|
| ABACUS INSIGHTS INC — Growth Analytics Manager, Payment Integrity | 0.420 | **Consider** | above threshold (0.420) but one soft spot: sponsorship tier "Likely" | sponsorship 0.6·0.35 [your-input]; fit 0.7·0.3 [your-input] × liveness 1[record]×timeline 1[your-input] |
| KLAVIYO INC — Analytics Engineer | 0.000 | **Skip** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.15·0.35 [your-input]; fit 0.65·0.3 [your-input] × liveness 1[record]×timeline 0[your-input] |
```

The skip rate is 50% of *scored* leads. Counting the four that never reached
the scorer, only Klaviyo is a plain Skip, so the scorer's "healthy" label
should not be read as a property of the whole run.

## Run 2: my re-run (live)

```
$ cd ~/Documents/INFO7375/the-reallocation-engine && node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.test.mjs
…
ℹ tests 8
ℹ pass 8
ℹ fail 0

$ cd ~/Documents/INFO7375/the-reallocation-engine && node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --today 2026-10-02
Checking 3 posting URL(s) with Playwright…
  liveness uncertain https://careers.everquote.com/job/?gh_jid=7999629003
  liveness uncertain https://boards.greenhouse.io/abacusinsights/jobs/8770716002?gh_jid=8770716002
  liveness active    https://www.klaviyo.com/careers/jobs/7737707003?gh_jid=7737707003
✓ 6 leads · scored 1 · stopped G1 2 · G2 2 · G3 0 · no-posting 1
  scorer: ✓ scored 1 roles → Apply 0 · Consider 0 · Skip 1 (skip 100%)
  everquote-sem            check-posting-by-hand liveness: uncertain
  abacus-growth-analytics  check-posting-by-hand liveness: uncertain
  klaviyo-analytics-eng    skip                 gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes)
  benefits-science-da      network              Proven analyst sponsor with no posting to apply to
  writer-expired           resolve-company      company identity: no-h1b-record
  hubspot-da               resolve-company      company identity: not-in-dataset
```

**Abacus changed from `active` to `uncertain` in 25 minutes.** Its liveness
reason in run 2 was `navigation error: page.goto: Timeout 15000ms exceeded`,
while the Greenhouse API still returned the job (HTTP 200). The job had not
closed; the page loaded slowly. The gate did what it should: it stopped instead
of guessing. Run 2's outputs are in `runs/run-2-student/`.

## Gates cleared (by me)

| Gate | Lead | What I looked at | Decision |
|---|---|---|---|
| G2 | EverQuote | opened the posting in Chrome | **open**: job page with an "Apply for this job" form. The checker looks for an apply *button*, so it missed the form |
| G2 | Abacus Insights | opened the posting in Chrome | **open**: title matches, Apply button shown |
| G4 | Abacus | "Business Analyst Manager - Data Distribution Team" | **counts** as data-analyst-type evidence; stays Likely |
| G4 | EverQuote | "Quantitative Analyst" ×3 | **does not count** (stats/pricing work). I changed the rule: `quantitative analyst` moved to `other_analyst_examples` in `config/title-families.json`, so EverQuote goes from Likely to Possible |
| G3 | all | hiring lags 4 / 5 / 10 weeks | **realistic**; kept |
| G1 | Writer, HubSpot | not in the data / no H-1B numbers | **unknown, not non-sponsors**; research by hand |

The two browser checks were written into
`scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json`
with `"source": "your-input"`, keeping the machine's original result beside them.

## Run 3: final run, after the gates

```
$ cd ~/Documents/INFO7375/the-reallocation-engine && node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --liveness-file scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json --today 2026-10-02
✓ 6 leads · scored 3 · stopped G1 2 · G2 0 · G3 0 · no-posting 1
  scorer: ✓ scored 3 roles → Apply 0 · Consider 2 · Skip 1 (skip 33%)
  everquote-sem            review-then-tailor   composite 0.231 in the Consider band [0.2, 0.3)
  abacus-growth-analytics  review-then-tailor   above threshold (0.420) but one soft spot: sponsorship tier "Likely"
  klaviyo-analytics-eng    skip                 gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes)
  benefits-science-da      network              Proven analyst sponsor with no posting to apply to
  writer-expired           resolve-company      company identity: no-h1b-record
  hubspot-da               resolve-company      company identity: not-in-dataset
  → scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-log.json  +  scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-report.md
```

Scorer report (`out/role-scores.md`), run 3:

```
**Summary:** 3 roles → Apply 0 · Consider 2 · Skip 1. **Skip rate 33%** (below the ~50% a healthy run skips; check the inputs).

| Role | Composite | Rec | Why | Audit (term · value · weight · source) |
|---|---|---|---|---|
| ABACUS INSIGHTS INC — Growth Analytics Manager, Payment Integrity | 0.420 | **Consider** | above threshold (0.420) but one soft spot: sponsorship tier "Likely" | sponsorship 0.6·0.35 [your-input]; fit 0.7·0.3 [your-input] × liveness 1[your-input]×timeline 1[your-input] |
| EVERQUOTE INC — Senior Analyst, SEM | 0.231 | **Consider** | composite 0.231 in the Consider band [0.2, 0.3) | sponsorship 0.3·0.35 [your-input]; fit 0.75·0.3 [your-input] × liveness 1[your-input]×timeline 0.7[your-input] |
| KLAVIYO INC — Analytics Engineer | 0.000 | **Skip** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.15·0.35 [your-input]; fit 0.65·0.3 [your-input] × liveness 1[record]×timeline 0[your-input] |
```

The scorer's "below healthy" note counts only the 3 scored leads. Of all 6
leads, 1 is skipped and 3 never reached the scorer (network or research by hand).

## Verified vs inferred, line by line

Taking the Abacus Insights lead and the networking lead (Benefits Science)
from the final report, `out/analyst-check-report.md` (run 3):

| Line | Value | Label | Why that label |
|---|---|---|---|
| Abacus company match | ABACUS INSIGHTS INC, exact | **record** | one CSV row, normalised name equal |
| Abacus H-1B approvals / denials | 22 / 0 | **record** | CSV columns `Total Approvals`, `Total Denials` |
| Abacus sponsored titles | "Software Engineer"; "Business Analyst Manager - Data Distribution Team" | **record** | CSV `top_job_titles_sponsored`, word for word |
| …"Business Analyst Manager…" is *ambiguous-analyst* | keyword `business analyst` | **your-input** | my rule in `title-families.json` |
| Abacus tier → p | Likely → 0.6 | **your-input** | my mapping (0.6 copies `ch11-roles.json`) |
| Abacus fit | 0.7 | **your-input** | self-rated; no model called |
| Abacus posting | active: "job title matches and an Apply button is shown" | **your-input** | my browser check at G2. The machine's run 2 result was `uncertain` (timeout); run 1's machine result was `active` (record) |
| Abacus timeline | 1.0: slack = min(210, 49) − 28 = 21 ≥ 20 | **your-input** | my formula, my persona dates, my 4-week lag guess |
| Abacus BLS 15-2051.01 median | $112,590 (OEWS 2024) | **record** | compact CSV |
| Abacus company median offered | $110,510; ratio 0.98 | **record** (ratio computed) | CSV `median_salary_offered`, all roles, not analysts |
| Abacus Form D | not-in-sample | **record** | absent from 200 sampled of 58,329 companies, which means nothing |
| Abacus composite | (0.6·0.35 + 0.7·0.3) × 1 × 1 = 0.420 → Consider | scorer arithmetic on the labels above | **all 4 scorer inputs are my own input** in run 3; in run 1, liveness was a record |
| Benefits Science sponsored titles | includes "Data Analyst" | **record** | CSV |
| …→ data-analyst-family → Proven 0.9 | keyword `data analyst` | **your-input** | rule + mapping |
| Benefits Science posting | none known | **your-input** | I found no open posting; not a liveness record |
| next action: network | — | rule in `lib.mjs` `nextAction` | Proven tier + no posting |

The point that matters most: **the final Consider for Abacus rests entirely on
my own inputs.** The records say Abacus sponsored 22 H-1Bs, listed one
data-flavoured business-analyst title, and (in run 1) had a live posting.
Everything that turns that into 0.420 is a choice I made: the rule, the tier
weight, the fit, the hiring lag, and the browser check. That is why each of
those is labeled, and why G4 makes a person look.

## Verification

**1. Hand cross-check against the source files** (output pasted):

```
$ grep "^ABACUS INSIGHTS INC," data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv | python3 -c "import csv,sys; r=next(csv.reader(sys.stdin)); print(r[0], r[15:20])"
ABACUS INSIGHTS INC ['22.0', '0.0', '100.0', '110510.0', "['Software Engineer', 'Business Analyst Manager - Data Distribution Team']"]

$ (BLS rows for 15-2051.00 and 15-2051.01, columns onet_soc_code, title, oews_year, annual_median_wage)
15-2051.00 Data Scientists 2024 112590.0
15-2051.01 Business Intelligence Analysts 2024 112590.0

$ python3 -c "from datetime import date; print((date(2027,4,30)-date(2026,10,2)).days)"
210

$ grep -ic "hubspot" data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv
0
```

All four match the report: 22 / 0 / $110,510 / the two titles; $112,590; 210
days to OPT end; HubSpot genuinely absent. The BLS check also confirms that BI
Analyst inherits the Data Scientist median exactly, the domain point in the
justification.

**2. Offline test:** `node --test …/analyst_check.test.mjs` → `pass 8, fail 0`
(full output in `TEST-REPORT.md`). With a deliberately broken
`analyst_check.mjs` (missing company → `p = 0`): `pass 5, fail 3`.

**3. Deliberate break attempts, run live:**

```
$ node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --candidates break-candidates.json --out-dir break-out --today 2026-10-02
Checking 1 posting URL(s) with Playwright…
  liveness uncertain http://127.0.0.1:8080/admin
✓ 2 leads · scored 0 · stopped G1 1 · G2 1 · G3 0 · no-posting 0
  scorer: no role reached the scorer
  break-localhost          check-posting-by-hand liveness: uncertain
  break-typo               resolve-company      company identity: not-in-dataset
exit 0
break-localhost | G2 | blocked host 127.0.0.1 | found
break-typo | G1 | undefined | not-in-dataset
```

The localhost URL was refused by the repo's guard and stopped at G2. The typo
"Abacus Insight" stopped at G1, but with **no near-match hint**: see Reflection.
(Both files lived in a scratch folder, not the repo.)

## Reflection

**What worked.**
- Separating the titles is the useful part. Klaviyo has 154 approvals, but
  every sponsored title is an engineer or manager. It drops to Unknown instead
  of looking like a strong sponsor.
- The gates behaved as gates: the 10-week Klaviyo process zeroed the score
  despite a live posting.
- The scorer guard turned a silent repo bug into a loud refusal.

**What the recipe or prototype got wrong or missed.**
- **Typo blindness.** Near matches require every query word to appear as a whole
  word, so "Insight" never matches "Insights". A student who mistypes gets
  "not-in-dataset" and no hint, which is the most likely way to wrongly cross a
  sponsor off. This was not predicted in the change brief.
- **Liveness is the least reliable step.** EverQuote returned `uncertain` on
  every run, although the page has an application form I could see; the checker
  only looks for a button. Abacus was `active` in run 1 and `uncertain` 25
  minutes later in run 2 (a page-load timeout). The gates stopped both, which is
  correct, but it means a person has to open postings on every run.
- **The result is very sensitive to my hiring-lag guess.** Abacus at 4 weeks →
  timeline 1.0 → 0.420 (Consider); at 5 weeks → 0.7 → 0.294 (still Consider, now
  in the 0.2–0.3 band); at 6 weeks → 0.35 → 0.147 (**Skip**). Two weeks of
  guessing flips it from tailor to skip.
- **Prediction check (from CHANGE-BRIEF §5).** (1) Title misfiling: confirmed.
  "Quantitative Analyst" landed in *ambiguous*. At G4 I decided that is wrong for
  a data-analyst seeker and moved it to *other*. EverQuote went Likely → Possible:
  under the old rule it would score (0.6·0.35 + 0.75·0.3) × 0.7 = 0.3045, which is
  Consider only because "Likely" is a soft tier; under my rule it is 0.231,
  Consider by the 0.2–0.3 band. The label is the same, but the score and the
  reason changed. (2) Company-median wage: confirmed. EverQuote's
  $117,640 is 1.53× the Market Research median. (3) Truncated list: not
  observed in this run, but untested. No sponsor here was checked against an
  outside source.

**One concrete next improvement.** In `findCompany` (`lib.mjs`), also offer near
matches by **prefix of each word** ("insight" → "insights") and by edit distance ≤ 2,
still shown to the human and never auto-picked. Add the "Abacus Insight" case
to `candidates.fixture.json` with an assertion that `near_matches` includes
"ABACUS INSIGHTS INC".

## Attestation
- Recipe: riyask29-data-analyst-sponsor-boston v0.1.1 (DRAFT)
- By: riyask29 · 2026-10-02. Rows marked **(riyask29)** I ran myself; the others were run by Claude (AI assistant) at my direction, and I have read their output.

### Tested
| Ran | Saw | Expected |
|---|---|---|
| `node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.test.mjs` | pass 8, fail 0 | all pass |
| **(riyask29)** the same test, in my terminal | pass 8, fail 0 | all pass |
| **(riyask29)** run 2: `node …/analyst_check.mjs --today 2026-10-02` | Abacus `uncertain` (timeout) where run 1 said `active`; 2 leads stopped at G2 | same as run 1 (**it was not: liveness is not repeatable**) |
| **(riyask29)** opened EverQuote and Abacus postings in Chrome (G2) | both open: EverQuote has an application form, Abacus an Apply button | the machine `uncertain` is wrong for both |
| **(riyask29)** G4 decision: moved `quantitative analyst` to *other*; the classifier test now asserts it | EverQuote tier Possible in run 3 | tier follows the rule |
| **(riyask29)** run 3: `node …/analyst_check.mjs --liveness-file …/inputs/liveness.gate-cleared.json --today 2026-10-02` | Consider 2 (Abacus 0.420, EverQuote 0.231), Skip 1, network 1, resolve-company 2; my G2 checks labeled `your-input` in `roles.json` | browser checks carried as your-input, never as record |
| same tests against a mutant `analyst_check.mjs` (missing company → `p = 0`, sent to scorer) | pass 5, fail 3 | at least one failure |
| `node …/analyst_check.mjs --today 2026-10-02` (live, working tree) | 6 leads: 1 review-then-tailor, 1 network, 1 skip, 3 human checks | gates stop G1/G2 cases; no invented values |
| same command in a clean clone + copied files, after fresh `npm install` | identical next actions | identical |
| hand cross-check: Abacus row, BLS 15-2051.01, OPT day count, HubSpot absence | 22/0/$110,510; $112,590; 210; 0 rows | equal to the report |
| **break:** posting URL `http://127.0.0.1:8080/admin` | `blocked host 127.0.0.1` → stopped at G2, not scored | refused, no request |
| **break:** company typed "Abacus Insight" | stopped at G1, `not-in-dataset`, **no near matches** | stopped, *with* a hint (**partial fail**) |
| **break:** persona status "F-1 STEM OPT — work authorized (EAD)" | exit 2, "scorer read the profile as needs_sponsorship=false" | refuse to report |
| recipe G1 gate test against a log edited to give HubSpot `p = 0` | exit 1 | exit 1 |

### Did not test
- A real clone of the **pushed** branch (nothing committed when this was written).
- Writer and HubSpot sponsorship outside this dataset (G1 says "research by hand"; not done yet).
- The full Form D quarters (not shipped), so the funding path has only the fixture test (Databricks `in-sample`).
- Whether any sponsor's truncated title list hides a data-analyst title (no outside source checked).
- Liveness on Lever or Ashby postings with a live job (the one Ashby URL was already expired, and Writer stopped at G1 before liveness).
- Node 20 specifically (CI's version); only Node 24 locally.
- Any lead outside Massachusetts, or a persona with STEM OPT's 150-day ceiling.
- Timing the manual research to back the time-saved estimate.

### Broke during testing, fixed
- **First PII scan flagged my fixture.** `fixtures/sponsors.slice.csv` carried
  company phone numbers and real executive/board names copied from the CSV, and
  the Form D slice had a company phone. Fixed by blanking `phone`,
  `executive_officers` and `board_directors` in the slice and the Form D phone,
  and by dropping `related_persons`. The scan is clean for my paths.
- **Report wording** "binding deadline is their **unemployment-days**" was
  unreadable. Now "the deadline that binds first is the **90-day unemployment
  limit**" (`analyst_check.mjs`, `renderReport`).
- **Recipe comment** claimed the run "is logged" before the run log existed.
  Reworded.
- **A person's posting check had no way into the tool.** The liveness file was
  always labeled a machine record. Changed `analyst_check.mjs` so an entry with
  `"source": "your-input"` keeps that label into `roles.json`; a fixture lead and
  test assertion cover it (`t-human-confirmed`).
