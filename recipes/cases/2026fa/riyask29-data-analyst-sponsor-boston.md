---
status: DRAFT          # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE
todos_open: 4
last_gate: null
attestation: null      # no named-human attestation; set only by a human who signed one
recipe_version: 0.2.0
---

<!-- Why still DRAFT (v0.2.0, Mode Build, 2026-10-20): v0.1.1 had four typed
     TODOs. One is closed by its evidence (the liveness DEV fix). Two DATA
     SOURCE TODOs have their files in place but stay open until a named human
     writes the provenance line (SNICKERDOODLE: DATA SOURCE is closed by a
     human). One (hiring-lag evidence) has no data source anywhere. The run
     found one new DEV defect in the engine. Four open, so DRAFT. Real runs
     with full data are logged in logs/runs/2026fa-riyask29-3.md. -->

# riyask29-data-analyst-sponsor-boston — Data-Analyst Sponsor Check

## Executive summary

**What it does.** It takes a short list of job leads and, for each one, checks
three things against the engine's own data: whether the company has sponsored a
work visa for a *data-analyst-type* job (not only for jobs like "Cyber Analyst"
that share the word), whether the posting is still open, and whether hiring
could finish before the student's work permission or allowed unemployment days
run out. It then passes each lead that survives to the engine's existing
scorer.

**Who it is for.** An international master's student in the Boston area on F-1
post-completion OPT who is looking for Data Analyst or Business Intelligence
Analyst work. "Data Analyst" has no occupation code of its own, so a plain "does
this company sponsor?" list tells this student much less than it seems to.

**What it decides.** For each lead, one next action: tailor an application,
network into the company first, skip it, or stop and let a person check
something the data cannot settle. It never decides that a company "does not
sponsor" just because the company is missing from a list.

**New in v0.2.0.** Sponsorship is now also checked by occupation code, from the
Department of Labor's own H-1B filing records (certified LCAs at Massachusetts
worksites), so "has this company filed for analyst work?" is a record, not a
title-keyword guess. Funding uses every company in four full SEC Form D quarters
instead of a 200-company sample. The posting checker now sees application forms
that career sites embed from their applicant-tracking system.

Two customers: this file is for the agent;
`recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.card.md` is for the
human.

## Purpose

**What it does:** for each job lead, decide one next action (tailor, network first, skip, or a
person checks something) from records: H-1B sponsorship history for analyst-type titles, DOL
H-1B filings (LCAs) by analyst occupation code, SEC Form D funding, whether the posting is open,
and whether hiring fits the OPT clock.

**Use it exactly when:** you are an F-1 OPT (or soon-OPT) job-seeker who needs H-1B sponsorship,
targeting Data Analyst / BI Analyst work in Massachusetts, and you have a short list of leads
(company + posting URL, or company only) to sort *before* spending an hour tailoring each.

**Do not use it** to find leads (it checks a list, it does not search), for roles that need no
sponsorship, for other states without re-cutting the LCA slice, or as legal advice on OPT or STEM OPT.

## Run record and handoff

**Handoff condition (done when):** both outputs exist in the out-dir; in
`analyst-check-log.json`, `counts.scored` plus the sum of `counts.stopped`
equals `counts.candidates`; no role stopped at G1 carries a `sponsorship` value;
and every role has a `next_action`. The following command checks all four and
exits non-zero on failure:

```bash
node -e "const l=require('./scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-log.json');const s=Object.values(l.counts.stopped).reduce((a,b)=>a+b,0);const ok=l.counts.scored+s===l.counts.candidates&&l.roles.every(e=>e.stopped_at!=='G1'||e.sponsorship===null)&&l.roles.every(e=>e.next_action&&e.next_action.action);console.log(ok?'handoff ok':'handoff FAIL',JSON.stringify(l.counts));process.exit(ok?0:1)"
```

"Looks right" is not the condition. The count identity and the
no-value-on-stop invariant are.

## Required reads

1. `SNICKERDOODLE.md`: gates, provenance, TODO closure.
2. `DOMAIN.md` → *Known gaps and defects* (items 3 and 9 are role quality and local wage).
3. `course/2026fa/submissions/riyask29/CHANGE-BRIEF.md`: the predictions this recipe is checked against.
4. `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/README.md`: labels and failure behaviour.

Prefer those local files over any external lookup.

## Source inventory

Every path below exists on a fresh clone (checked 2026-10-02).

| Source | Path | Used for | Label |
|---|---|---|---|
| H-1B sponsorship by company | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | `company_name`, `Total Approvals`, `Total Denials`, `Approval_Rate`, `median_salary_offered`, `top_job_titles_sponsored` | record |
| BLS wage by SOC | `data/bls/compact/soc_occupation_compact.csv` | `onet_soc_code`, `annual_median_wage`, `oews_year` | record |
| SEC Form D (samples, ship with the repo) | `data/sec/form-d/processed/sample/companies-sec-*.sample.json` | default when full quarters are absent | record |
| SEC Form D (full quarters, fetched locally, gitignored) | `data/sec/form-d/processed/companies-sec-2025q2-d.json` … `2026q1-d.json` (58,329 companies), made by `scripts/sec/download-form-d-quarters.py` + `scripts/sec/refresh-recent-sec-quarters.py` | company name, `filing.date_filed`, `funding.total_amount_sold` | record |
| DOL LCA slice (H-1B filings by SOC) | `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv` (+ `-audit.md`), cut by `lca_slice.py` from DOL OFLC `LCA_Disclosure_Data_FY2026_Q3.xlsx` | certified H-1B LCAs per employer × SOC at MA worksites, top job titles, median offered wage | record |
| LCA SOC families | `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/config/lca-soc-families.json` | which SOC codes are core (persona targets) vs adjacent | your-input |
| Liveness | `scripts/ats/liveness-browser.mjs` (the same logic as `npm run ats:liveness`), patched in this branch to read ATS-hosted iframes | active / expired / uncertain + reason | record (dated) |
| Scorer | `scripts/score/role-scorer.mjs` (`npm run score`) | composite, Apply / Consider / Skip, audit trace | — (combines labels) |
| Prototype | `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs`, `lib.mjs` | gates, `roles.json`, outputs | — |
| Title rules + tier mapping | `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/config/title-families.json` | data-analyst-family / ambiguous / other | your-input |
| Persona (fictional) | `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/persona.example.json` | OPT end date, unemployment days, buffer, target SOC | your-input |
| Candidate leads | `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/candidates.json` | company, title, URL, hiring lag, self-rated fit | your-input |
| G2 clearance (a person's posting checks) | `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json` | machine liveness results plus browser checks by a named person, which override `uncertain` | record / your-input (per entry) |

Not used, on purpose: `npm run bls:local-wage` (fails on a fresh clone with no
`.venv` or `requirements.txt`, and feeds no decision), and
`scripts/sec/validate-h1b-join-sample.py` (needs full data that does not ship).

## Inputs

| Field | Where | Required | Label |
|---|---|---|---|
| `needs_sponsorship` (true/false) | persona | yes; the run refuses if missing | your-input |
| `visa.current_status`, `opt_end_date` (YYYY-MM-DD), `unemployment_days_used`, `unemployment_ceiling`, `buffer_target_days` | persona | yes; the run refuses if any is missing | your-input |
| `target_soc` (O*NET codes, e.g. `15-2051.01`, `13-1161.00`) | persona | yes | your-input |
| `company`, `title`, `url` (or `null` when no posting is known) | candidates | yes | your-input |
| `hiring_lag_weeks` | candidates | yes; a missing value stops the lead at G3 | your-input |
| `fit_self_rating` (0–1) | candidates | optional; without it the fit vote is absent | your-input |

## Phase gates

Each lead stops at the first failed gate. A stopped lead is **not** sent to the
scorer and carries no invented value. Liveness and timeline are gates
(multipliers), never votes.

| Gate | Testable condition | Pass | Fail → | Human must see |
|---|---|---|---|---|
| **G1 Company identity** | Exactly one CSV row whose normalised `company_name` (case, punctuation, Inc/LLC/Corp/Co/Ltd/LP/PBC stripped) equals the query, **and** that row has a non-empty `Total Approvals`. | tier + wage + Form D | `not-in-dataset`, `no-h1b-record`, `ambiguous`, or `not-exact-near-matches` → stop; `sponsorship: null`; near matches listed | the near-match names, to pick one or accept "unknown" |
| **G3 Timeline** | `hiring_lag_weeks` is present. Factor = `clamp((min(days_to_opt_end, ceiling − used) − lag_days) / buffer, 0, 1)`. | factor goes to the scorer as a multiplier | lag missing → stop (`missing-hiring-lag`); OPT already ended or past the cliff → factor 0 → scorer Skip | the dates and the arithmetic line |
| **G2 Liveness** | The lead has a URL and liveness is `active` or `expired`. | `active` → 1, `expired` → 0, both scored | no URL → `no-posting` (not scored; network or skip); `uncertain` / not checked → stop | the URL; a person opens the page |
| **G4 Title review** | Every Proven or Likely tier lists the sponsored title(s) and the keyword that matched; with `--lca`, every lead also lists its certified LCAs by SOC code (or "none under this name"). | report lists both under *Gates a person must clear* | — (this gate never clears itself) | each matched title and each SOC line, to confirm it is work the student would do |

G3 is evaluated before G2 so that every lead whose company passed G1 shows its
timeline arithmetic, including leads with no posting.

Gate tests, run against the log of a finished run (each exits non-zero on failure):

```bash
# G1: no stopped lead carries a sponsorship value; list why each stopped
node -e "const l=require('./scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-log.json');const g=l.roles.filter(e=>e.stopped_at==='G1');const bad=g.filter(e=>e.sponsorship!==null);g.forEach(e=>console.log(e.role_id,e.company_match.status,e.company_match.near_matches.join('; ')));process.exit(bad.length?1:0)"
# G2: only active/expired postings reached the scorer
node -e "const l=require('./scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-log.json');const bad=l.roles.filter(e=>e.scorer&&!['active','expired'].includes(e.liveness.result));console.log('scored with bad liveness:',bad.length);process.exit(bad.length?1:0)"
# G3: every scored lead has a numeric timeline factor; factor 0 means Skip
node -e "const l=require('./scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-log.json');const s=l.roles.filter(e=>e.scorer);const bad=s.filter(e=>typeof e.timeline.factor!=='number'||(e.timeline.factor===0&&e.scorer.recommendation!=='Skip'));s.forEach(e=>console.log(e.role_id,e.timeline.factor,e.scorer.recommendation));process.exit(bad.length?1:0)"
# G4: every Proven/Likely lead exposes its matched titles for review
node -e "const l=require('./scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/analyst-check-log.json');const s=l.roles.filter(e=>e.sponsorship&&['Proven','Likely'].includes(e.sponsorship.tier));const bad=s.filter(e=>!(e.g4_review||[]).length);s.forEach(e=>e.g4_review.forEach(t=>console.log(e.role_id,JSON.stringify(t.title),'->',t.family,'('+t.matched+')')));process.exit(bad.length?1:0)"
```

**Where gate decisions are recorded.** `logs/gate-decisions/` does not exist in
this repo, so the person clearing G1–G4 writes their decision, name and date in
the run entry `logs/runs/2026fa-riyask29-<n>.md` (template below). A gate the
test passes is still not *cleared* until that line exists.

## Workflow

Verbatim, from the repo root.

1. One-time setup, needed only for live liveness checks:

```bash
npm install && npx playwright install chromium
```

2. Offline test: no network, fixtures cut from the real data files.

```bash
node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.test.mjs
```

3. Sample run, live liveness. Network goes only to the URLs in `candidates.json`.

```bash
node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs
```

3b. **Full-data run (v0.2.0).** Fetch the full Form D quarters once (SEC asks for
a contact in the User-Agent; on python.org Python, point it at a CA bundle):

```bash
SSL_CERT_FILE=$(python3 -m certifi) python3 scripts/sec/download-form-d-quarters.py \
  --quarters 2025Q2 2025Q3 2025Q4 2026Q1 --user "Your Name you@example.edu"
# engine defect (see Proposed additions): the zips extract one folder too deep for the refresh step
for q in 2025q2 2025q3 2025q4 2026q1; do Q=$(echo $q | tr q Q); mv data/sec/form-d/extracted/$q-d/${Q}_d/* data/sec/form-d/extracted/$q-d/; done
python3 scripts/sec/refresh-recent-sec-quarters.py
```

Download the DOL LCA workbook in a browser (dol.gov refuses scripted downloads),
slice it, then run with both:

```bash
python3 scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/lca_slice.py \
  --xlsx ~/Downloads/LCA_Disclosure_Data_FY2026_Q3.xlsx --state MA \
  --out scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv \
  --audit scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3-audit.md
node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs \
  --formd-dir data/sec/form-d/processed \
  --lca scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv
```

4. **Clear G2, then re-run.** A person opens every `uncertain` posting and writes
the result into a liveness file. Copy `out/liveness.json` from step 3, and for
each checked URL set `"result"`, a `"reason"` saying what they saw, and
`"source": "your-input"`. Then re-run without network (this repo's cleared
file is `inputs/liveness.gate-cleared.json`):

```bash
node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs \
  --liveness-file scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json --today 2026-10-02
```

An entry without `"source": "your-input"` is treated as a machine record.

5. Run the handoff and gate tests above, then conformance:

```bash
node scripts/conformance.mjs scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/ recipes/cases/2026fa/
```

6. A person reads `out/analyst-check-report.md`, clears G1–G4, and records the
decisions in `logs/runs/2026fa-riyask29-<n>.md`. Never edit `logs/RUN_LOG.md`.

## What it can and cannot verify

| Claim | Status | Why |
|---|---|---|
| Company X has *n* H-1B approvals and *m* denials in this dataset | **verified (record)** | read from the CSV row |
| Company X's top sponsored titles include "Data Analyst" | **verified (record)** | read from `top_job_titles_sponsored` |
| That title is data-analyst work | **inferred (your-input rule)** | keyword list in `title-families.json`; G4 makes a person confirm |
| Sponsorship p = 0.9 / 0.6 / 0.3 / 0.15 | **inferred (your-input mapping)** | Proven/Likely copy `data/examples/ch11-roles.json`; Possible/Unknown are mine. Labeled `your-input` in `roles.json` |
| The posting was open at time T | **verified (record, dated)** | Playwright result + timestamp. It can change minutes later: Abacus was `active` at 17:23Z and `uncertain` (15 s timeout) at 17:48Z on 2026-10-02 |
| A person saw the posting open | **your-input (a person's check)** | carried as `source: your-input` from the liveness file into `roles.json`, never relabeled as a record |
| Hiring can finish inside the runway | **inferred (your-input)** | the formula is mine; hiring lag is the student's estimate |
| BLS median for 15-2051.01 / 13-1161.00 | **verified (record)** | compact CSV, OEWS 2024, national |
| What this company pays an analyst | **not verifiable** | `median_salary_offered` covers *all* the company's sponsored roles; OEWS is an occupation survey, not an offer |
| The company sponsored a data analyst at all (SOC-level) | **not verifiable** | the CSV stores titles, not SOC codes, and only a truncated "top" list |
| The company raised money recently | **not verifiable on samples**; **verified (record) on full quarters**, exact name only | Form D ships 50 companies per quarter; with the four full quarters a hit is a record of a private raise. A miss (`not-filed-under-this-name`) is not "no money": public companies never file Form D, entity names differ, and the newest quarter SEC had posted on 2026-10-20 was 2026 Q1 |
| The company filed H-1B LCAs for analyst SOC codes in MA | **verified (record)** | DOL LCA disclosure FY2026 Q3 (Oct 2025–Jun 2026), certified, MA worksite, exact employer name |
| Those LCAs became approved H-1Bs, or cover one worker each | **not verifiable** | an LCA is filed before the petition; one LCA can cover several workers |
| The company will sponsor *this* student | **not verifiable** | no data source answers this |
| STEM-extension eligibility, status rules | **not verifiable** | legal question; DSO only |

## Facts that bite: how this recipe handles each

| Fact | How it is handled |
|---|---|
| 1. `role_quality` weight is 0.0 `[VERIFY]` | The wage check is **not** sent to the scorer and the weight is not changed. It appears in the human report as a ratio with its caveat, so the person can use it outside the score. |
| 2. `bls:local-wage` feeds nothing | Not used. National OEWS medians only, labeled national. |
| 3. Only Form D samples ship | v0.2.0: full quarters are fetched locally (Workflow 3b) and used with `--formd-dir data/sec/form-d/processed`; without them the samples are joined with coverage printed ("200 of 58,329 companies"). `not-in-sample` and `not-filed-under-this-name` are never read as "no funding", and there is no funding vote (the scorer has no funding weight). |
| 4. `data/raw/`, `data/verified/`, `logs/gate-decisions/` do not exist | Gates point at `out/analyst-check-log.json`; decisions go in `logs/runs/`. |
| 5. The `snickerdoodle` CLI is roadmap | No command in this recipe uses it. |
| 7. `bls:local-wage` needs `.venv` | Not needed; Node only. |
| 8. `validate-h1b-join-sample.py` needs full data | Not used. |
| Found in this work: `role-scorer.mjs` treats any authorization text containing "authorized" as *no sponsorship needed* | The prototype compares the scorer's `profile_needs_sponsorship` with the persona's explicit `needs_sponsorship` and exits 2 if they differ. A test covers it. The scorer itself is not patched. |

## Proposed additions

1. [TODO: DATA SOURCE] DOL LCA disclosure records by employer **and** SOC code.
   *Evidence in place (2026-10-20):* `data/lca-ma-analyst-fy2026q3.csv` + audit, cut
   by `lca_slice.py` (5 offline tests) from DOL OFLC `LCA_Disclosure_Data_FY2026_Q3.xlsx`
   (sha256 `f8ca8448…28b3`, 251,850,891 bytes, downloaded 2026-10-20 by riyask29 in a
   browser from dol.gov/media/). Closes when riyask29 writes the provenance line in
   `logs/runs/2026fa-riyask29-3.md`. Belongs here because title matching was this
   recipe's weakest inference; G4 now shows SOC-level records beside the titles.
2. [TODO: DATA SOURCE] Full SEC Form D quarters. *Evidence in place (2026-10-20):*
   `data/sec/form-d/processed/companies-sec-{2025q2,2025q3,2025q4,2026q1}-d.json`
   (58,329 companies; gitignored), fetched with `scripts/sec/download-form-d-quarters.py`
   and processed by `refresh-recent-sec-quarters.py`. 2026 Q2 and Q3 returned HTTP 404
   (not yet posted by SEC). Closes when riyask29 writes the provenance line.
3. CLOSED (DEV, 2026-10-20). Liveness that a person does not have to redo.
   Cause found: careers.everquote.com embeds the Greenhouse application form in an
   iframe (`job-boards.greenhouse.io/embed/job_app`), and the checker read only the
   top document. Fix: `scripts/ats/liveness-browser.mjs` also reads apply controls in
   frames served by known ATS hosts (never other frames, so a chat widget's "Apply"
   cannot make a posting look live); the prototype retries once on a navigation
   error only. Evidence: `liveness_frames.test.mjs` (3 offline tests; fails on the
   unpatched checker and on an all-frames mutant), and `npm run ats:liveness` on the
   live EverQuote posting: `uncertain` on a fresh clone of upstream, `active` on this
   branch (`course/2026fa/submissions/riyask29/mode-build/runs/engine-05*`, `05b*`).
4. [TODO: DEV] Per-company hiring-lag evidence. Today `hiring_lag_weeks` is the
   student's guess and the timeline gate is only as good as that guess. No public
   source was found; kept open rather than descoped.
5. [TODO: DEV] Engine defect found by this run: `download-form-d-quarters.py`
   extracts each zip to `extracted/<q>-d/<YYYYQn>_d/`, but
   `refresh-recent-sec-quarters.py` looks only in `extracted/<q>-d` and
   `extracted/<q>-d/<q>-d`, so on a fresh clone every quarter reports `Missing`.
   Workaround in the Workflow (move the files up one level). Not patched here:
   this branch's one maintained-file patch is the liveness fix (CONTRIBUTING).

## Output contract

One run writes these to `--out-dir` (default
`scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/`), never to a
tracked repo file outside that folder.

**For the agent: `analyst-check-log.json`**

```
_prototype, _version,
run { today, prototype, liveness_mode, inputs{...paths}, outputs[] },
persona { name, fictional, binding_clock [opt-end-date | unemployment-days], runway_days, source },
counts { candidates, scored, stopped { G1, G2, G3, no-posting }, form_d_in_sample },
scorer_stdout,
roles[] {
  role_id, company_query, title, url, stopped_at [null | G1 | G2 | G3 | no-posting],
  company_match { status, matched_name, near_matches[], source },
  sponsorship  null | { total_approvals, total_denials, approval_rate, counts_source,
                        sponsored_titles[{title, family, matched}], titles_source,
                        classification_source, tier, p, p_source, caveat },
  wage_check[] { soc, status [ok | no-occupation-row | no-wage-value], bls_annual_median,
                 company_median_salary_offered, ratio_company_to_bls, caveat, source },
  funding      { status [in-sample | not-in-sample | filed | not-filed-under-this-name],
                 complete, filings[], coverage, meaning, source },
  timeline     { factor | null, status, today, opt_end_date, runway_days, hiring_lag_days,
                 buffer_days, binding_clock, arithmetic, source },
  liveness     { result, reason, code, attempts, checked_at, source },
  lca          null | { status [found | none-under-this-name], core_lcas, adjacent_lcas,
                        by_soc[{soc_code, soc_title, family, certified_lcas, top_job_titles}],
                        coverage, meaning, source },
  fit          { p, source } | null,
  g4_review[]  { title, family, matched },
  scorer       { recommendation, composite, reason, arithmetic, source },
  next_action  { action, hours, why }
},
cannot_verify[]
```

**For the person: `analyst-check-report.md`**, with sections in this order:
*Executive summary* (plain language, counts by next action, the deadline that
binds first) → *Run record* → *Leads and next actions* (one table row per lead)
→ *Evidence per lead* (every value with its label) → *Gates a person must
clear* (G1–G4, with the G4 title list) → *What this run could not verify*.

**Written by the existing scorer, unchanged:** `role-scores.json`,
`role-scores.md`. **Written by the prototype as scorer input:** `roles.json`,
`scorer-profile.json`. Live runs also write `liveness.json`.

## Next action per result (the 3-3-2 hand-off)

| Result | `next_action` | Goes to |
|---|---|---|
| Scorer **Apply** | `tailor-application` | the 2 apply hours |
| Scorer **Consider** | `review-then-tailor` (G4 first) | the 2 apply hours, after review |
| Posting expired, tier Proven/Likely | `network` | the 3 networking hours: informational chat before the next opening |
| No posting, tier Proven/Likely | `network` | the 3 networking hours |
| Scorer **Skip** for any other reason (timeline 0, weak tier) | `skip` | none; time goes back to the day |
| Stopped at G1 | `resolve-company` | a person, once; then re-run |
| Stopped at G2 (`uncertain`) | `check-posting-by-hand` | a person opens the URL |
| Stopped at G3 (no lag) | `fix-input` | a person adds the estimate |

## Stop conditions

Stop, write nothing as if valid, and exit non-zero when:

- a data path in the source inventory is missing (including a `--lca` file that was named but does not exist);
- an LCA workbook lacks a required column, or has no rows (`lca_slice.py` exits 2 and writes nothing);
- the persona lacks `needs_sponsorship` or any required `visa` field, or `opt_end_date` is not YYYY-MM-DD;
- the scorer's `profile_needs_sponsorship` disagrees with the persona;
- the scorer exits non-zero.

Stop the **lead** (not the run) at G1, G2 or G3 as in the gates table.

Refuse, in this recipe, to:

- auto-pick a near-match company name. Near matches are shown, never chosen;
- write `sponsorship.p = 0` for a company that is missing or has no H-1B fields. Absent from a list is not "never sponsored";
- feed the wage ratio into the score or change `role_quality`. That is an authorial decision for the scorer's maintainer (DOMAIN.md item 3);
- treat `not-in-sample` or `not-filed-under-this-name` Form D as "no funding";
- treat a company with no certified LCA in the slice as "does not sponsor", or add the LCA count to the score (it is shown to a person at G4);
- weaken a gate so that a liked lead passes, or add an `override` without a written reason.

## Logging rules and run-log template

The brief and SNICKERDOODLE name `logs/RUN_LOG.md`. In this repository that file is CI-protected
for students (its header says so), so the same entry goes to one file per run:
`logs/runs/2026fa-riyask29-<n>.md`, which the maintainer indexes into `logs/RUN_LOG.md`. No real
names, emails or phone numbers. The persona is fictional.

```markdown
## YYYY-MM-DD — riyask29-data-analyst-sponsor-boston sample run <n>

- **Recipe:** recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.md v0.2.0 (DRAFT)
- **Inputs:** persona <path> (fictional) · candidates <path> (<k> leads) · data: 80-days CSV, BLS compact, Form D <samples | full quarters>, LCA slice <file | none> · liveness <live | recorded file>
- **Provenance (DATA SOURCE closures):** <file> — origin <URL>, fetched <date> by <name>
- **Commands:** <verbatim>
- **Outputs:** <out-dir>/analyst-check-log.json, analyst-check-report.md, roles.json, role-scores.{json,md}
- **Result:** <k> leads · scored <s> · stopped G1 <a> · G2 <b> · G3 <c> · no-posting <d> · scorer: Apply <x> · Consider <y> · Skip <z>
- **Handoff test:** <pass | fail + output>
- **Gate decisions (human):**
  - G1 — <lead>: <decision> — <name>, <date>
  - G2 — <lead>: <decision> — <name>, <date>
  - G3 — <lead>: <decision> — <name>, <date>
  - G4 — <lead>: <titles confirmed / rejected> — <name>, <date>
- **Open issues:** <what did not work, what is still missing>
```
