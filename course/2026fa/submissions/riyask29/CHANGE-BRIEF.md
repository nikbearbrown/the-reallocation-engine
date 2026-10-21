# CHANGE-BRIEF — Data-Analyst Sponsor Check (Boston, F-1 OPT)

## Executive summary

This is the plan written before any code: who the tool is for (an international
student on OPT looking for data analyst jobs in Boston), which repository data
and scripts it reuses, where it must stop for a person to decide, and what I
expected to go wrong. The predictions are kept exactly as first written, so they
can be compared with what actually happened (see WORKED-RUN, *Reflection*).

- **Author:** riyask29 · **Written:** 2026-10-02, before any prototype code
- **Branch:** `contrib/2026fa-riyask29-data-analyst-sponsor-boston`
- **Status of this file:** predictions are kept as written. Later changes go in
  the *Revisions* section at the bottom; nothing above it is rewritten.

## 1. The career situation

An international **MS in Information Systems graduate in Boston on F-1
post-completion OPT (year 1)** who is targeting **Data Analyst / Business
Intelligence Analyst** roles. The persona is fictional; no real dates or contact
details are used:

| Field | Value | Label |
|---|---|---|
| Persona | "Sneha Patil", `sneha.patil@example.com` (fictional) | your-input |
| Visa | F-1 OPT, year 1, STEM-eligible degree, extension not yet filed | your-input |
| OPT end date | 2027-04-30 | your-input |
| Unemployment days used | 41 of 90 | your-input |
| Buffer target | 20 days | your-input |
| Target SOC | 15-2051.01 Business Intelligence Analysts; 13-1161 Market Research Analysts as a fallback | your-input |

**Why this is a specific situation, not "any job-seeker":** "Data Analyst" has
no SOC code of its own. BLS folds it into 15-2051 (Data Scientists), and the
analyst roles companies actually sponsor are spread across several codes. A
student in this exact position asks a narrower question than "does this company
sponsor H-1Bs?". The question is **"has this company sponsored a data-analyst
*title*, and does the wage it paid look like an analyst wage or a data-scientist
wage?"**

**Engine layers drawn on:** 80 Days to Stay (sponsorship), Job-Ops (liveness),
the Cognitive Pivot (BLS wage for the SOC code). SEC Form D is checked, but see
prediction F3.

## 2. What I reuse, and what I propose

### Reused as-is (all paths exist on a fresh clone; checked 2026-10-02)

| What | Path / command |
|---|---|
| H-1B sponsorship by company | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (30,369 rows; 1,557 have H-1B fields) |
| Columns used | `company_name`, `state`, `Total Approvals`, `Total Denials`, `Approval_Rate`, `median_salary_offered`, `top_job_titles_sponsored` |
| BLS wage by SOC | `data/bls/compact/soc_occupation_compact.csv` (`onet_soc_code`, `annual_median_wage`, `oews_year`) |
| Form D funding (samples only) | `data/sec/form-d/processed/sample/companies-sec-*.sample.json` (50 companies per quarter) |
| Liveness | `npm run ats:liveness -- <url>` → `scripts/ats/check-liveness.mjs` |
| Scorer (not copied) | `npm run score -- <roles.json> --out-dir <my folder>` → `scripts/score/role-scorer.mjs` |

### Proposed (built in my namespace only)

| Addition | Why it belongs |
|---|---|
| **Analyst-title classifier.** Each title in `top_job_titles_sponsored` is sorted into `data-analyst-family`, `other-analyst` (Cyber, QC, Credit Risk…) or `non-analyst` using a keyword list kept in a file I commit. | A plain `"analyst"` substring match counts *Cyber Analyst I* and *Senior Quality Control Analyst* as evidence for a data-analyst application. That is exactly the false signal this recipe exists to remove. |
| **Sponsorship tier for this role family.** Proven = a data-analyst-family title was sponsored; Likely = only other analyst titles; Possible = sponsors but no analyst title in the list; Not-in-dataset = company not found. | The repo scores sponsorship per company. The student needs it per role family. |
| **Wage sanity check** (outside the scorer). Compare the company's `median_salary_offered` with the BLS median for 15-2051.01 and for 13-1161, and report the ratio. Not fed into the score. | This is how the recipe addresses **Fact 1** (`role_quality` weight = 0): the wage signal goes in the human report, not the composite, and I do not change the weight. |
| **Timeline factor** from OPT end date, unemployment days used, buffer and a stated hiring-lag assumption. | Chapter 10 describes the factor but no script in the repo computes it. The formula is mine, so the factor is labeled `your-input`. |
| `[TODO: DATA SOURCE]` H-1B records by SOC code (DOL LCA disclosure files) | The CSV stores titles, not SOC codes, so a title-to-SOC match is the best available proxy. |
| `[TODO: DATA SOURCE]` full Form D quarters | Only 50 companies per quarter ship (see F3). |

## 3. Gates (hard stops)

| Gate | Testable condition | What a human must see to clear it |
|---|---|---|
| **G1 Company found** | The company name matches exactly one CSV row after normalisation (case, punctuation, Inc/LLC/Corp). Zero or multiple matches → stop, no sponsorship value written. | The candidate rows printed side by side, so the human picks the right one or confirms "not in dataset". |
| **G2 Liveness** | `npm run ats:liveness` reports `active`. `expired` → factor 0; `uncertain` → stop for a human. | The URL and the matched pattern; the human opens the page. |
| **G3 Timeline** | today + hiring lag ≤ OPT end date − buffer, and lag ≤ remaining unemployment days − buffer. Otherwise the factor drops, reaching 0 past the cliff. | The dates and arithmetic that produced the factor, plus a reminder that STEM-extension questions go to the DSO, not the tool. |
| **G4 Title classification review** | Every sponsored title that leads to "Proven" is listed with the keyword that matched it. | The human confirms that e.g. "Business Analyst Manager – Data Distribution" really is analyst work they would do. |

## 4. Predicted failure cases (and how I'll check each)

| # | Failure case | Expected behaviour | How I'll check |
|---|---|---|---|
| F1 | **Company not in the CSV**, or in it with no H-1B fields | Report `not-in-dataset` / `no-h1b-record`, never `p = 0`. Missing from a list ≠ never sponsored. | A fixture role for a company I know is absent; assert no `sponsorship.p` is written. |
| F2 | **Ambiguous name**: one posting company name matches several CSV rows, or the posting says "Toast" while the CSV says "TOAST INC" | Normalisation handles suffixes; more than one match → stop at G1. | A fixture with a deliberately ambiguous name. |
| F3 | **Form D has nothing for these companies.** A quick look on 2026-10-02, before writing this brief, already found **0 of 166** analyst-titled sponsors in the four Form D samples. | Report `funding: not-in-sample`, never "no funding". No funding term goes to the scorer (the scorer has no funding weight anyway). | Count joins on every run and print the number. |
| F4 | **OPT date already past**, or lag beyond the remaining unemployment days | Timeline factor = 0 → Skip, with the dates shown. | A fixture persona with `opt_end_date` in the past. |
| F5 | **SOC code missing from the BLS file** | Wage check reports `no-occupation-row`; no number is substituted. | Point the config at a fake SOC. |
| F6 | **Posting URL 404s, or the page changed** | Liveness `expired` → gate closed. | Already seen: one Writer URL from the repo came back `expired` on 2026-10-02. |

## 5. What I predict the prototype will get wrong on the first pass

1. **The title classifier will misfile some titles.** "Business Analyst" sits
   between data analysis and management analysis (SOC 13-1111), and
   "Quantitative Analyst" is closer to statistics or finance. My keyword list
   will be wrong for some of these, and only a human reading the titles will
   catch it, which is why G4 exists.
2. **`median_salary_offered` is a company-wide median across all sponsored
   roles**, not the analyst salary. The wage check will look precise but compare
   the wrong things for companies that mostly sponsor engineers. I expect this to
   mislead before I notice it.
3. `top_job_titles_sponsored` is a **truncated "top" list**. A company could have
   sponsored data analysts and still not show it there, so "Possible" will
   sometimes be too pessimistic.

## Revisions

*(none yet; add dated entries below, do not edit the predictions above)*

- **2026-10-02 (after the worked run):** added the *Executive summary* section at
  the top, which the repo's P9 rule requires. No prediction, gate or failure case
  above was changed. Outcomes against these predictions are in WORKED-RUN,
  *Reflection → Prediction check*. One failure case I did **not** predict: a
  misspelled company name ("Abacus Insight") gets no near-match hint.
- **2026-10-02 (after the gates):** at G4 riyask29 moved "quantitative analyst"
  out of the ambiguous list (this confirms §5 prediction 1). Two more failures I
  did **not** predict, both found in runs 2–3: liveness is not repeatable (Abacus
  was `active`, then `uncertain` 25 minutes later), and an application *form* is
  not recognised as an apply control (EverQuote). G2 now takes a person's browser
  check, labeled `your-input`.
