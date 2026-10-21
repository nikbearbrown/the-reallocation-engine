# SOURCES

## Executive summary

This page credits everything this submission is built on: the course
repository and its rules, the data files that ship with it, the public job
postings used as test leads, and the AI assistant that wrote most of the code
and text. It also says plainly what the AI contributed and what the student
decided, checked or changed.

## Repository and governing documents

- **The Reallocation Engine**, `nikbearbrown/the-reallocation-engine` (Nik Bear
  Brown), forked to `riyask29/the-reallocation-engine` on 2026-10-02 at upstream
  commit `015843d`.
- `SNICKERDOODLE.md` (constitution: gates, provenance, lifecycle, attestation
  format), `DOMAIN.md` (Known gaps, items 3 and 9), `CONTRIBUTING.md`
  (namespaces), `DATA_CONTRACT.md` §Zero-Conditions, `recipes/_shared.md` (run-log
  template), and `AGENTS.md` / `CLAUDE.md` (executive-summary rule; plan mode before
  `recipes/` edits).
- Style models: `recipes/local-wage-adjustment.md`,
  `recipes/local-wage-adjustment.card.md`, `recipes/scan.md`.
- Book chapters used for method: `book/chapters/10-the-visa-timeline-manager.md`
  (timeline factor as a 0–1 multiplier, buffer logic) and
  `book/chapters/11-the-bayesian-role-scorer.md` (via `role-scorer.mjs`).

## Code reused (called, not copied)

- `scripts/score/role-scorer.mjs`: the scorer, run as a CLI.
- `scripts/ats/liveness-browser.mjs` (`checkUrlLiveness`, including its
  private-host guard): imported for live liveness checks.
- `data/examples/ch11-roles.json`: the shape of `roles.json`, and the Proven 0.9
  / Likely 0.6 values.

## Data (all shipped in the repo; no external datasets added)

| Data | Path | Notes |
|---|---|---|
| 80 Days to Stay sponsor/company table | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | H-1B approvals/denials, top sponsored titles, median salary offered |
| BLS OEWS + O*NET compact table | `data/bls/compact/soc_occupation_compact.csv` | OEWS 2024 national medians |
| SEC Form D samples | `data/sec/form-d/processed/sample/companies-sec-{2025q2,2025q3,2025q4,2026q1}-d.sample.json` | 50 companies each, of 13,325–15,981 per quarter |
| Fictional persona pattern | `search/examples/*/profile.yml` | field names and 555/@example.com convention; "Sneha Patil" is new and fictional |

Test fixtures in `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/fixtures/`
are rows cut from the files above, with phone and person-name columns blanked.

## Public job postings used as leads (viewed 2026-10-02)

Found through the companies' public job-board APIs (`boards-api.greenhouse.io`,
`api.lever.co`, `api.ashbyhq.com`) during exploration. The prototype itself only
opens the posting URLs listed in `inputs/candidates.json`.

- EverQuote, "Senior Analyst, SEM", `https://careers.everquote.com/job/?gh_jid=7999629003`
- Abacus Insights, "Growth Analytics Manager, Payment Integrity", `https://boards.greenhouse.io/abacusinsights/jobs/8770716002?gh_jid=8770716002`
- Klaviyo, "Analytics Engineer", `https://www.klaviyo.com/careers/jobs/7737707003?gh_jid=7737707003`
- Writer (expired), `https://jobs.ashbyhq.com/writer/04ad3b44-51df-4fa6-a17c-cab6875f70cd`, taken from the repo's own examples

## Tools

- Node.js v24.10.0, `node:test`; Playwright Chromium headless shell (via
  `npx playwright install chromium`); Python 3.13 (data exploration only; not
  used by the prototype); `gh` CLI (fork, CI status).
- **Claude (Anthropic), model Claude Opus 5.5, in Claude Code.**

## What the AI contributed vs what I decided, checked or changed

**The AI (Claude):**
- ran the setup and every command recorded in TEST-REPORT and WORKED-RUN;
- explored the data, found the candidate postings, and found the repo issues
  (the scan config, the location filter, the scorer's "authorized" regex, the
  missing scorer exports, upstream CI failing);
- wrote all code (`analyst_check.mjs`, `lib.mjs`, the tests, fixtures, config);
- drafted every document: CHANGE-BRIEF, recipe, card, TEST-REPORT, DOMAIN-JUSTIFICATION,
  WORKED-RUN, the run log, FRICTIONAL and this file;
- ran the mutation check and the break attempts, and corrected its own errors
  (listed in FRICTIONAL, items 12–16).

**I (riyask29):**
- chose the domain (Data Analyst over the AI's AI/ML Engineer suggestion);
- renamed the persona to "Sneha Patil";
- chose the DRAFT status;
- approved each step and the step-6 plan;
- re-ran the tests and the prototype myself (runs 2 and 3);
- opened the EverQuote and Abacus postings in a browser and cleared G2, noticing
  that EverQuote uses an application form the checker does not recognise;
- decided the G4 title questions and changed one keyword rule ("quantitative
  analyst" → other); accepted the hiring-lag estimates (G3); and decided that
  Writer and HubSpot are "unknown, research by hand" (G1);
- wrote down what surprised me and what I am still unsure about (FRICTIONAL,
  *What I checked, changed or learned*). I picked those points from AI-offered
  options, and that is disclosed there.

No figure from the "3-3-2 Split" essay is cited. The time-saved number in
DOMAIN-JUSTIFICATION is my own estimate, labeled as one, and not measured.
