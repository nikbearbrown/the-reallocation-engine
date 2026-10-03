# SOURCES: swe-title-sponsor-opt (tushar-patel28, 2026fa)

## Executive summary

This file credits everything the submission was built on: the repository, its governing documents, the sample data, prior work, and tools. It also separates what AI tools contributed from what I decided, checked, changed, or rejected myself. The entry-by-entry record, with commits, is in `FRICTIONAL.md` (see its *Human / AI contributions* table).

## Repository and governing documents

- **The Reallocation Engine**, `nikbearbrown/the-reallocation-engine`, forked at `015843d`. My work builds on top of it, inside my assigned namespaces only.
- **Governing documents I read and followed:**
  - `SNICKERDOODLE.md` (the constitution; lifecycle rules quoted in my recipe)
  - `DOMAIN.md` (known gaps)
  - `CONTRIBUTING.md` (namespaces, branch and PR rules)
  - `DATA_CONTRACT.md` §Zero-Conditions (privacy rules)
  - `recipes/README.md`, plus `recipes/_shared.md` (the run-log template)
  - `CLAUDE.md` (agent rules)
- **Style models for the recipe and card:** `recipes/scan.md`, `recipes/local-wage-adjustment.md`, `recipes/local-wage-adjustment.card.md`.
- **Prior art** (2026su case recipes, cited in my recipe): `case-fullstack-swe-sponsor-triage`, `case-backend-swe-opt-triage`, `case-ml-sponsorship-triage`, `case-data-ml-h1b-triage`, `case-opt-timeline-fit-company-targeting`. None implements a role-family title check or a computed timeline factor.
- **The assignment:** "The Reallocation Engine — Recipe Design Assignment", INFO 7375, Fall 2026 (Canvas).

## Data used

| Data | Path | How it was used |
|---|---|---|
| 80 Days to Stay sponsorship data (30,369 companies; 1,557 with H-1B fields) | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | Company match (G1) and sponsored-title family check |
| BLS / O*NET occupations | `data/bls/compact/soc_occupation_compact.csv` | Median-wage context only; not used in scoring (`role_quality` weight is 0) |
| SEC Form D samples | `data/sec/form-d/processed/sample/` | Examined; **not used** (15/200 name matches, one sponsoring company) |
| Fictional persona and candidate roles | `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/sample/` | Sample inputs; postings are fictional and no real personal data is used |

## Code reused (not re-implemented)

- **The scorer**, `scripts/score/role-scorer.mjs`, called through `npm run score`. It is never copied; mutant versions exist only as test fixtures.
- **Repository checks:** `scripts/conformance.mjs`, `scripts/manifest-check.mjs` (`npm run verify`), `scripts/doctor.mjs`, `scripts/pii-scan.mjs`.
- **The company-name normalizer** from the repository's own SEC processing code. The exact source is noted in `title_sponsor_opt.py`.
- **The parsing approach** for the stringified title list (`ast.literal_eval`), following `scripts/sec/validate-h1b-join-sample.py`.

## External references (not stored in the repository)

- **O*NET occupation codes** (15-1252, 15-2051, 15-1221, 15-1241, 15-1244, 15-1299.08), cited as context.
- **DOL OFLC LCA disclosure data:** named as the evidence source for the G4 human gate and as a proposed `[TODO: DATA SOURCE]`. No DOL data was downloaded or used in this submission.
- **The 3-3-2 split:** Nik Bear Brown's essay and the course's Chapter 2, as cited in the domain justification.

## Tools

- Python 3.12.10, Node 24.18.0, npm, git, GitHub, VS Code.
- **Claude Code** (VS Code extension): an AI coding agent working in the repository.
- **Claude** (claude.ai chat): an AI assistant that explained the assignment, wrote the prompts I gave to Claude Code, and reviewed outputs with me.

No human collaborators.

## What AI contributed

**Claude (claude.ai chat):**
- explained the assignment and the repository;
- drafted `CHANGE-BRIEF.md` (predictions P1–P3 are labelled as Claude's);
- drafted the rationales for the mapping definitions and the crosswalk principles;
- reviewed each report;
- drafted the PR description, this file.

**Claude Code:**
- read-only recon of the repository;
- wrote the tests, fixtures, and mutant scorers;
- drafted the recipe, card, README, TEST-REPORT, domain justification, worked run, run log, and FRICTIONAL;
- ran the checks, and ran the privacy re-cut of the branch history.

Commits where Claude Code worked carry a `Co-Authored-By: Claude` trailer. That trailer undercounts AI work; `FRICTIONAL.md` is the full record.

## What I decided, checked, changed, or rejected

**Decided**
- the career situation and target role priority (SWE, then AI, then Cloud);
- accepting the reshaped title-based recipe after recon showed the data has no SOC field;
- a fictional persona instead of my own details;
- documenting and guarding the scorer's `--profile` bug instead of patching shared code;
- the G4 human gate as the only path to Apply;
- the soft early-start timeline band;
- keeping the recipe at DRAFT;
- re-cutting the branch history, and reporting the PR exposure to the professor.

**Approved after review**
- the mapping values (fit 0.8/0.7/0.6, Likely 0.6, Possible 0.4), the 0.6 → 0.5 risk-band change, and the crosswalk principles.

**Checked myself**
- the G1 company sign-off (`g1-entity-review.md`);
- a break attempt with an impossible date, with a numeric prediction written before running that matched on all 12 rows;
- a hand check of three raw CSV rows against the report;
- the GitHub handle's case, from my settings page;
- the commit email, set to my GitHub noreply address before the first commit;
- the PR timeline, which is how I found that PR #5 was open during the re-cut.

**Changed**
- the authorship labels on the definition rationales, which Claude Code had wrongly attributed to me;
- corrections appended to the brief;
- a final manual review of every file.

**Rejected**
- patching the scorer;
- tuning numbers to hit the skip-rate target;
- an unverified claim from Claude that my role families "collapse into one visa category" (relabelled as a judgment);
- a stray reference from an unrelated project in one prompt.

P4 in the brief is my prediction. Its wording began as an example sentence Claude suggested, which I adopted.