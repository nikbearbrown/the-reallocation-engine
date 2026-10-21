---
status: DRAFT          # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED
todos_open: 5
last_gate: "G-TIMELINE clearance for sample scoring only — Gnanasudharsan Ashokumar, 2026-10-20, logs/runs/2026fa-gnanasudharsan-2.md"
attestation: null
recipe_version: 0.1.0
---

# ai-startup-formd — AI-startup triage with funding health and visa timeline as gates

## Executive summary

**What this is:** a mode for deciding which AI Engineer job postings at venture-funded startups are worth an application from an international student who will need an H-1B visa. It checks whether a startup's last recorded funding round could plausibly keep it operating until the student's H-1B petition would be filed (April 2027) and until the job would start (October 2027), and whether the posting is still live. Only postings that pass those checks are scored by the engine's existing scorer.

**Why read it:** a job posting never tells you how much money the company has left. For a student whose work authorization depends on the employer still existing a year from now, that is the most important fact, and it is invisible. This mode makes it visible where local data allows it, and says plainly where it does not.

**What it found on its first real run (2026-10-20):** of 107 visa-sponsoring employers with AI job titles in the local data, none could be shown to have runway through October 2027. Four reach the April 2027 petition window but not the start date, so they are held for a human. One posting at one of those four was live and was scored as a sample, and its verdict stays "hold — runway unverified". The funding data is from September 2025; anything raised since then is not visible. The mode is a draft: five open items, listed below, stand between it and the next stage.

## Purpose

- **Who:** the fictional persona Ananya Rao (`search/examples/ananya-rao/`): F-1, pre-OPT, MS Computer Science (AI concentration), program ends 2026-12-18, `needs_sponsorship: true` (FY2028 cap: registration around March 2027, petition filing from 2027-04-01, employment start 2027-10-01).
- **Target:** AI Engineer roles (the decided AI title family below) at funded AI startups.
- **When to use:** before spending effort on an application at a startup, to check whether funding evidence supports the employer still operating through the H-1B timeline.
- **When not to use:** for large public companies (funding rounds are not the survival signal), or for a student who does not need sponsorship (the timeline gate is then irrelevant).
- **Distinct from** the author's earlier `gnanasudharsan-de-mlops-h1b` case: that one targeted Data Engineer / MLOps titles and used sponsorship tiers as its core; this one targets AI titles and makes **funding health and runway timing** the gates.

Handoff condition (done when): the run prints one summary line; every posting in the input appears exactly once in the JSON log with status `scored`, `held` or `excluded` and at least one reason when not scored; every scored term carries a `source` in {record, model-judgment, your-input}; the scorer reports `profile_needs_sponsorship: true`; and the human report opens with an executive summary and carries the snapshot caveat on every funding conclusion.

## Source Inventory

| Evidence | Exact path / command | Used as |
|---|---|---|
| Employer funding + H-1B history | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (30,369 rows; columns used: `company_name`, `industry`, `latest_funding_amount`, `latest_funding_date`, `Total Approvals`, `Total Denials`, `Approval_Rate`, `top_job_titles_sponsored`) | funding gates, timeline gate, sponsorship vote (record) |
| Form D filings (fresher-evidence check) | `data/sec/form-d/processed/sample/companies-sec-{2025q2,2025q3,2025q4,2026q1}-d.sample.json` — first 50 companies per quarter only | moves the effective funding date when a filing post-dates the snapshot |
| Occupation context | `data/bls/compact/soc_occupation_compact.csv`, rows for SOC 15-1252, 15-2051, 15-1221, 15-1299 | labeled context; does not affect the score (scorer `role_quality` weight 0) |
| Posting liveness | `npm run ats:liveness -- <url> <url>` (`scripts/ats/check-liveness.mjs`); stdout saved verbatim | liveness gate (record) |
| Persona (fictional) | `search/examples/ananya-rao/profile.yml`, `resume.example.json`, `gaps.md` | who the run is for; basis of the fit judgments |
| Pre-filter | `node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs --as-of <date> --postings <file> --liveness <file> --clearance <file> --out-dir <dir>` | applies every gate, writes `roles.json`, runs the scorer, writes log + report |
| Combiner (unchanged) | `npm run score -- <roles.json> --profile <profile.json> --out-dir <dir>` (`scripts/score/role-scorer.mjs`) | composite + per-term trace |
| Tests | `node --test scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/` (20 tests, fictional fixtures in `fixtures/`) | conformance of the gate logic |

Commands that actually ran for the 2026-10-20 sample (run3b), verbatim. Full output is in `course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/` (`inputs/ats-liveness-2026-10-20.txt:3`, `01-prefilter.txt:2`, `02-npm-score.txt:2`); the pre-fix run is in `…/runs/2026-10-20-run3a-prefix/`.

```bash
# npm run ats:liveness, as recorded by npm in the saved output
node scripts/ats/check-liveness.mjs https://builtinaustin.com/job/machine-learning-engineer-ii/4500550 https://jobs.signalfire.com/companies/codametrix/jobs/53504944-machine-learning-engineer-ii
node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs --as-of 2026-10-20 --postings course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/inputs/postings.json --liveness course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/inputs/ats-liveness-2026-10-20.txt --clearance course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/inputs/clearance.json --out-dir course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b
npm run score -- course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/roles.json --profile course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/profile.json --out-dir course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/npm-score
```

No `ats:scan`, no SEC download, nothing under `private/` or `data/ats/`.

## Proposed additions

| Addition | Why it belongs | Typed item |
|---|---|---|
| Full Form D quarters with CIK carried through | The four local samples hold 50 of 13,325–15,981 companies per quarter, so "no newer filing" currently means "not in the sample". Full quarters would turn most CANNOT-VERIFY rows into answerable questions. | [TODO: DATA SOURCE] full Form D quarters 2025Q4–2026Q3 under `data/sec/form-d/extracted/`, processed by `scripts/sec/refresh-recent-sec-quarters.py`, with a one-line provenance note |
| Permission to download from sec.gov | The downloader (`scripts/sec/download-form-d-quarters.py`) touches the network and needs a declared user agent; only ingest scripts may touch the network, and only after a human approves. | [TODO: APPROVE] logged gate decision for the sec.gov download (who/what/when, user agent, quarters) |
| DOL LCA disclosure data with SOC code and fiscal year | The local H-1B data is one row per employer with no SOC code and no fiscal year, so "sponsors AI Engineers recently" cannot be checked; only "has sponsored a title containing an AI word at some point". | [TODO: DATA SOURCE] DOL LCA disclosure file(s) FY2024–FY2026 with `SOC_CODE`, `JOB_TITLE`, `EMPLOYER_NAME`, `EMPLOYER_FEIN`, fiscal year, plus provenance note |
| EDGAR freshness check | A held company may have filed a new Form D after the snapshot; a per-company EDGAR lookup by CIK would answer that without downloading whole quarters. | [TODO: DEV] script under `scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/` that reads a saved EDGAR response for a named CIK and reports the latest Form D filing date; conformance passes; handoff: a held company's report row shows the latest filing date or "none found" |
| "What would clear this hold" column | A held row currently says why it is held, not what evidence would release it. The student needs the next action. | [TODO: REPORT FIELD] columns: posting, hold reason, evidence that would clear it, where to look; reader: the student; decision enabled: which hold to research first |

## Phase gates

All gates are hard stops applied before scoring. Liveness and visa timeline are gates, never weights.

| Gate | Testable condition | On failure | Cleared by |
|---|---|---|---|
| Run gate (snapshot freshness) | newest `latest_funding_date` in the CSV ≥ as-of date − 24 months | whole run refused, exit 5, report says "cannot verify current runway" | automatic stop; no human override defined |
| Stop conditions | `industry` is not "Pooled Investment Fund"; `latest_funding_date` and `latest_funding_amount` are present | posting excluded (STOP) | none — data must change |
| Funding health | `latest_funding_amount` ≥ $5,000,000 and effective funding date ≥ as-of − 24 months | excluded (FAIL: `funding-below-minimum` / `funding-stale`) | none |
| G-TIMELINE (3-state) | effective funding date + 24 months: ≥ 2027-10-01 → PASS; ≥ 2027-04-01 → CANNOT-VERIFY; else FAIL | CANNOT-VERIFY → held; FAIL → excluded (`runway-ends-before-filing`) | CANNOT-VERIFY may be cleared for sample scoring only by a named human in a clearance file (see closures) |
| Company match | exactly one CSV row has the posting company's normalized name | held (`company-unmatched` / `company-ambiguous`) | human supplies the right name |
| Posting supplied | posting has a URL | held (`no-posting-supplied`) — no other posting check is reported | human supplies a URL |
| AI title | posting title matches the decided AI title family | held (`title-not-ai`); bare "ai"/"ml" with no role word adds a `weak-title-match` warning | human |
| Liveness | saved `ats:liveness` result for the URL is `active` | `expired` → excluded; `uncertain`, missing or conflicting → held | re-run liveness on an approved URL |
| Fit | a number 0–1 with source `your-input` | held (`fit-missing`) | the student |
| Sponsorship record | `Approval_Rate` present and 0–100 | held | none — data must change |

Every timeline status carries: "computed from funding snapshot dated <newest date in the CSV>; rounds after that date are not visible". FAIL means "not supported by local data", not "company is dead".

## What it can and cannot verify

| Can verify (from local records) | Cannot verify |
|---|---|
| The latest funding date and amount recorded for an employer, with its CSV line | Any funding round after the snapshot date (2025-09-26 in this run), unless a local Form D sample shows a newer filing |
| Whether that date plus an assumed 24-month runway reaches the petition window and the start date | The company's actual cash or runway — 24 months is an assumption |
| That the employer has H-1B approvals, how many, and its approval rate | How often it sponsors **AI** roles, or in which fiscal year (no SOC, no fiscal year in the local data) |
| That a sponsored-title history contains an AI word | That a title means AI work (e.g. "Senior Research Engineer" at a membrane company; "Operations Manager - AI") |
| That a saved liveness check found an apply control on the supplied page | That the employer's original posting is live when the supplied URL is an aggregator; anything the checker cannot load (a URL that starts a download returns `uncertain`) |
| That a company name matches exactly one CSV row | That it is the company the student means (Cohere Health is not Cohere) |
| The scorer's composite for a scored posting | Whether the scorer's weights are right; role quality carries weight 0 |

## Output Contract

Two artifacts per run, one per reader (P5). Neither substitutes for the other.

**Agent log** — `<out-dir>/ai-startup-formd-log.json`:

```json
{
  "_tool": "ai-startup-formd",
  "recipe": "recipes/cases/2026fa/gnanasudharsan-ai-startup-formd.md",
  "generated_at": "ISO-8601",
  "as_of": "YYYY-MM-DD",
  "decisions": { "staleness_months": 24, "min_funding_amount": 5000000, "runway_months": 24,
                 "anchor_filing": "2027-04-01", "anchor_start": "2027-10-01", "decided_by": "...", "decided_on": "YYYY-MM-DD" },
  "snapshot_date": "YYYY-MM-DD",
  "caveat": "computed from funding snapshot dated ...; rounds after that date are not visible",
  "inputs": { "csv": { "path": "...", "sha256": "...", "rows": 0 }, "postings": {}, "liveness": {}, "clearance": {}, "formd_dir": "...", "bls": "..." },
  "run_gate": { "status": "OPEN | REFUSED", "detail": "..." },
  "screened": { "definition": "...", "total": 0, "counts": { "CANNOT-VERIFY": 0 }, "timeline_evaluated": [ { "company": "...", "csv_line": 0, "timeline": "...", "runway_end": "...", "formd": {} } ] },
  "postings": [ { "posting_id": "...", "status": "scored | held | excluded", "reasons": [], "warnings": [],
                  "company_gate": {}, "liveness": "active | uncertain | expired | null",
                  "role": { "sponsorship": { "p": 0, "source": "record", "basis": "..." }, "fit": {}, "liveness": {}, "timeline": {} },
                  "scorer": { "composite": 0, "recommendation": "...", "reason": "..." }, "verdict": "..." } ],
  "bls_context": { "note": "context only — does not affect the score ...", "rows": [] },
  "clearance": { "gate": "G-TIMELINE", "by": "...", "date": "...", "condition": "...", "companies": [] },
  "scorer": { "ran": true, "eligible": 0, "exit": 0, "stdout": "...", "command": "..." }
}
```

**Human report** — `<out-dir>/ai-startup-formd-report.md`. Reader: the student. Decision enabled: which postings to apply to, which holds to research, which companies to drop. Sections in order: Executive summary; Run record; Decisions in force; Postings (status, verdict, reasons, sample scorer output); Gate clearance in force (verbatim); Companies that reached the visa-timeline check (with the snapshot caveat); Screened employers by outcome; Occupation context (does not affect the score); What this run cannot verify.

The scorer's own `role-scores.md` is written beside them. It does not know about the clearance and prints the raw recommendation (e.g. "Apply"); the human report's verdict governs.

## Stop conditions

The mode refuses to score, and says why, when:

1. the entity is a Pooled Investment Fund;
2. the latest funding date is blank (or the amount is blank);
3. the newest funding date in the dataset is older than the staleness window — the whole run refuses and reports "cannot verify current runway";
4. the company name is ambiguous or unmatched;
5. the posting is not live (expired → excluded; uncertain or not checked → held);
6. no posting was supplied;
7. the scorer reads the profile as not needing sponsorship (exit 3) or fails (exit 4).

## Closures (human decisions, recorded)

| Item | Closed value | Reasoning (one sentence) | Who | When |
|---|---|---|---|---|
| DEFINE: funding staleness window | 24 months before the as-of date | Roughly two years between rounds is a common startup pattern, and under 13 months would refuse every run on a 12.7-month-old snapshot. | Gnanasudharsan Ashokumar | 2026-10-18 |
| DEFINE: minimum funding | `latest_funding_amount` ≥ $5,000,000; `latest_funding_stage` not used | $5M is roughly where a startup can carry a sponsored hire, and the stage column has no documented derivation. | Gnanasudharsan Ashokumar | 2026-10-18 |
| DEFINE: runway months | 24 months after the latest round | 24 months is the conventional post-round runway assumption. | Gnanasudharsan Ashokumar | 2026-10-20 |
| DEFINE: G-TIMELINE anchors | 2027-04-01 (petition filing) and 2027-10-01 (employment start), three states PASS / CANNOT-VERIFY / FAIL | The employer must still exist to file the petition in April 2027 and to employ the student from the H-1B start date. | Gnanasudharsan Ashokumar | 2026-10-20 |
| DEFINE: AI title keywords | whole words: ai, ml, llm, machine learning, deep learning, computer vision, nlp, applied scientist, research engineer | Picks out AI Engineer work while excluding data scientist and MLOps (earlier submissions) and research scientist (wet-lab biotech). | Gnanasudharsan Ashokumar | 2026-10-18 |
| DEFINE: scorer inputs | sponsorship = `Approval_Rate` ÷ 100 (record, CSV line cited); fit = rating 0–1 for the fictional persona against her résumé (judgment); liveness from `ats:liveness`; timeline = 1 for PASS, CANNOT-VERIFY held unless cleared | Every scored term must trace to a record or a labeled human judgment. | Gnanasudharsan Ashokumar | 2026-10-20 |
| APPROVE: network for liveness | `ats:liveness` on exactly two URLs (Cohere Health, CodaMetrix aggregator pages) | Liveness is a gate and needs a network call; scope was limited to the supplied URLs. | Gnanasudharsan Ashokumar | 2026-10-20 |
| APPROVE: G-TIMELINE clearance | verbatim below | — | Gnanasudharsan Ashokumar | 2026-10-20 |

G-TIMELINE clearance, verbatim: "A CANNOT-VERIFY company may be scored ONLY if ats:liveness confirms its AI/ML posting is live today. Live hiring is evidence the company is operating; it does NOT prove funding runway to 2027-10-01. Clearance is for sample scoring only: the human report verdict stays "HOLD — runway unverified", never "Apply". Companies that fail liveness or have no posting stay HELD and unscored."

Lifecycle: DRAFT. Five typed items remain open (Proposed additions), so SPECIFIED is not reached; the 2026-10-20 sample run is evidence for the next transition, not a promotion.

## Log template

For `logs/runs/2026fa-gnanasudharsan-<n>.md` (students do not edit `logs/RUN_LOG.md`):

```markdown
## YYYY-MM-DD — ai-startup-formd <sample|live> run

- **Recipe:** recipes/cases/2026fa/gnanasudharsan-ai-startup-formd.md v<version>
- **Inputs:** CSV path + sha256; postings file; saved ats:liveness output (sha256); clearance file (who/date); as-of date
- **Outputs:** <out-dir>/ai-startup-formd-log.json, ai-startup-formd-report.md, roles.json, role-scores.{json,md}
- **Result:** postings scored / held / excluded; screened employers by outcome; scorer summary line verbatim
- **Gate decisions:** who / what / when for every clearance used
- **Open issues:** what did not work or is still missing
```
