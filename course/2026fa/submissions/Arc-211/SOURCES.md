# SOURCES — fin-dataeng-stemopt submission

> Drafted with an AI assistant on 2026-10-01. Reviewed and approved by the student (Arc-211)
> on 2026-10-02, including the human/AI split below.

## Executive summary

This file lists everything this submission was built from: the repository and its rules, the
datasets, the outside websites checked by hand, and the software tools, including the AI
assistant. It then states plainly which parts the AI produced and which the student decided,
checked, changed, or rejected. The short version: the AI wrote the code and the documents
and ran the checks. The student chose the situation and every judgment call, did the posting
checks, overrode the engine once, and rejected an AI-style answer that was not evidence.

## The repository and its governing documents

- **The Reallocation Engine**, by Nik Bear Brown: https://github.com/nikbearbrown/the-reallocation-engine.
  Code is MIT-licensed (`LICENSE`); book content is CC BY 4.0 (`LICENSE-BOOK-CC-BY-4.0.md`). The
  student's fork is https://github.com/Arc-211/the-reallocation-engine.
- Governing documents read and followed: `SNICKERDOODLE.md` (principles, gates, lifecycle,
  attestation format), `DOMAIN.md` (layout and known gaps), `CONTRIBUTING.md` (namespaces),
  `DATA_CONTRACT.md` §Zero-Conditions (privacy), `recipes/README.md`, `recipes/_shared.md`
  (run-log format), `scripts/contrib/README.md` (contrib folder rules), and `AGENTS.md` / `CLAUDE.md`.
- Style models: `recipes/local-wage-adjustment.md`, `recipes/local-wage-adjustment.card.md`,
  `recipes/scan.md`.
- Reused, unmodified: `scripts/score/role-scorer.mjs` (the scorer), `scripts/ats/check-liveness.mjs`
  (`npm run ats:liveness`), `scripts/conformance.mjs`, `scripts/doctor.mjs`, `scripts/pii-scan.mjs`.
  Example input shape: `data/examples/ch11-roles.json`.

## Data

| Source | Path or URL | Used for | Notes |
|---|---|---|---|
| 80 Days to Stay (Nik Bear Brown; MIT) | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | H-1B approvals, denials, rate, median offered wage, top sponsored titles, latest funding date | 30,369 rows; 1,557 with H-1B data. Its own upstream provenance (DOL/USCIS joins) is described in its README and audits; not re-verified here. |
| SEC Form D (repo samples) | `data/sec/form-d/processed/sample/companies-sec-202{5q2,5q3,5q4,6q1}-d.sample.json` | funding cross-check | first 50 companies per quarter only |
| BLS OEWS 2024 + O*NET (repo compact extract) | `data/bls/compact/soc_occupation_compact.csv` | national median wage per target SOC (context) | two rows copied verbatim into the test fixture |
| E-Verify Employer Search (USCIS) | https://www.e-verify.gov/e-verify-employer-search | E-Verify gate for SoFi, Gemini, Remitly, Green Dot | looked up 2026-10-01; *Date Enrolled* widened to "Last 30 years"; results transcribed in `inputs/everify.json` |
| Employer job postings | the URLs listed in `inputs/liveness.json` (SoFi, Gemini Greenhouse, Remitly, Green Dot Workday) | the liveness gate | checked 2026-10-01 with `ats:liveness` and by eye; also Upstart and JPMorgan pages, which were not used as candidates |
| Visa rules (OPT window, 90/150 unemployment days, E-Verify requirement for STEM OPT) | the student's understanding, plus the I-20 (program end date, CIP 14.0903) | the timeline and E-Verify gates | labeled your-input; to be confirmed with the school's international office. The I-20 itself is not in the repo. |

No personal data is committed. The student's résumé and I-20 were read locally, to choose the
situation, and are not in the repository. The persona in all files is anonymized.

## Tools

- Node.js v23.2.0 (CI: Node 20), Python 3.12.7, npm. Playwright with Chromium headless shell (for
  `ats:liveness`). Apple's `/usr/bin/git` 2.54.
- **AI assistant:** Claude Code (Anthropic, model Claude Opus 5.5), used in the Claude desktop app
  throughout the session, including its in-app browser for the E-Verify lookups.
- Collaborators: none.

## What the AI contributed vs what the student decided

| Area | AI | Student |
|---|---|---|
| Understanding the assignment and setup | explained the assignment; diagnosed the Intel-git and PATH problems; ran `npm install`, doctor and verify | forked, cloned and re-cloned the repo; made all the commits; reworded a commit message |
| Situation and scope | suggested the SOC codes and a recipe idea from the résumé and I-20 | chose the targets (data engineer, BI analyst), location, finance preference, $90k floor and 60-day hiring lag |
| Change brief | drafted it; profiled the data; confirmed the scorer's missing-liveness defect | reviewed it; agreed with the §4–5 predictions and adopted them (2026-10-02); did not reword them |
| Design decisions | proposed the options | chose: leave unchecked liveness out of the scorer; apply `review-role-fit` when there is no fit vote; DRAFT status |
| Thresholds and weights | proposed the tier thresholds, fit p values and assumed OPT start | accepted them (all are labeled your-input in `config.json`) |
| Code and tests | wrote `triage.mjs`, `triage.test.mjs`, the fixtures and README; found and fixed four defects through its own runs and break tests | — |
| Liveness gate | ran `ats:liveness`; flagged that the search-page URLs and the IT Support posting were not valid inputs | found the postings; **visually confirmed Apply buttons on Green Dot (overriding the checker's "expired"), Remitly and SoFi** |
| E-Verify gate | flagged that the pasted "Verified Enrolled" table was not evidence; ran the official lookup in the browser | **accepted that the pasted table was not evidence, and rejected it**; reviewed the result screens and cleared the gate |
| Release decision (G5) | presented the results and the seniority caveat | **decided to apply to all four, overriding the engine on SoFi** with their own reason |
| Recipe, card, justification, worked run, TEST-REPORT, run log | drafted all of them | reviewed them; wrote the reflection and FRICTIONAL §4 as their own answers, which the AI edited for grammar only; confirmed the attestation rows |
| FRICTIONAL.md | supplied a factual list of events | **writes it** |

### What was rejected or changed
- **Rejected:** the AI-style E-Verify table that inferred enrollment from H-1B and PERM history (source, per the student: a separate Claude conversation combined with a web page or article; neither cited a checkable E-Verify record).
- **Changed after review:** fit is judged on the posting title, not the company's titles. Liveness
  and E-Verify carry a label per entry. A closed timeline gate now skips unchecked companies.
  Error messages print no local paths. Saved scan output was redacted.
- **Kept as limitations, not fixed:** a company typo looks the same as a real absence; seniority is not
  checked; the upstream scorer defect is reported, not patched.
