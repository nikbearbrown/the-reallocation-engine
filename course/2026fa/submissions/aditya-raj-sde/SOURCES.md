# SOURCES — Sponsor & Posting Reality Check

## Executive summary

This document credits everything this assignment builds on: the starter repository and its rules,
the sample datasets, the course documents, the tools, and the split of work between the student and
the AI agent. Read it to see what was reused, what is new, and who did what. So far the work has
reused the existing repository, its sample data, and public job-board and GitHub data only; no
prototype code has been written.

## Starter repository and governing documents

| Source | Used for |
|---|---|
| `nikbearbrown/the-reallocation-engine` @ `015843d` (forked to `aditya-raj-sde/the-reallocation-engine`) | Starting point; the branch is cut from this commit. |
| `SNICKERDOODLE.md`, `DOMAIN.md`, `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `DATA_CONTRACT.md`, `PROJECT_RULES.md`, `_MANIFEST.md` | Rules: lifecycle, gates, labeling, privacy, namespaces. |
| `recipes/_shared.md` (Logging Rules) | Run-log field layout. |
| `.github/workflows/contrib-gate.yml`, `.github/PULL_REQUEST_TEMPLATE.md` | What CI enforces on the PR. |
| `scripts/score/role-scorer.mjs` | The maintained scorer; the prototype runs it through its CLI for hypothetical scenarios, and the probe runs it for F1a. |
| `scripts/ats/check-liveness.mjs` | The existing liveness check (baseline). |

## Course material

| Source | Status |
|---|---|
| Assignment PDF, "The Reallocation Engine — Recipe Design Assignment" (Canvas print, 2026-10-02) | Read in full. |
| `info-7375-prompt-engineering-for-generative-ai`: `assignments/assignment-reallocation-engine-recipe-design.md` | Fetched; spot-checked against the PDF by grep. |
| Same repo: `prerequisites/ai-policy.md`, `prerequisites/frictional.md`, `prerequisites/github-submission.md` | Read in full. |
| Same repo: `prerequisites/relative-quartile.md` | **Not read** (the download failed; the PDF's quartile table was used). |
| Course AI-policy video (YouTube link in the policy) | Not watched by Claude. Whether Aditya watched it is not recorded in this session. |

**Conflict noted:** `github-submission.md` gives a generic folder layout (`fall-2025/<name>/assignment-XX/`).
This assignment defines its own namespaces, and those govern.

## Data

| Source | Used so far | Notes |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (80 Days to Stay, upstream in the repo) | Column header and line count only (evidence 03) | No SOC codes, no per-year sponsorship columns. Contains a `phone` column, so rows are never copied into this folder. |
| `data/examples/ch11-roles.json` | Baseline scorer run (evidence 08) | Book example, not a real run. |
| `data/ats/portals.example.yml` | Baseline scan config via `REALLOCATION_ENGINE_PORTALS` (evidence 07b) | Not copied. |
| Greenhouse public job-board API, `boards-api.greenhouse.io/v1/boards/databricks/jobs` and `…/jobs/8635225002` | One listing GET to pick a liveness candidate (evidence 10); one record GET as a cross-check (evidence 19) | Only id/title/location/updated_at/URL kept. |
| Databricks posting page, gh_jid 8635225002 (`databricks.com` → `www.databricks.com`) | Liveness baseline (evidence 19) | Point-in-time observation 2026-10-03 17:48 EDT; not an endorsement or sponsorship evidence. |
| GitHub REST API (public), upstream check runs and job steps for `015843d` | Upstream CI investigation (evidence 21) | Read-only, unauthenticated. |

| `scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/fixtures/*.json` (written by Claude, 2026-10-03) | Sample input and test fixtures | Real company names are used only for CSV matching; every posting except the Databricks observation is synthetic (`example.com` URLs); fit, timeline, and scenario votes are labeled sample inputs. |

**Consulted, not used:** `archive/Projects/the-reallocation-engine-sdd.md` (tier cut-offs on a composite probability; not applicable to the CSV's counts); `book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md` (states the tiers are unreconciled); `scripts/sec/entity-resolution.py:44-58` (legal-suffix list mirrored in the recipe's matching rule, not imported).

## Tools

| Tool | Version | Notes |
|---|---|---|
| Node.js / npm | v22.14.0 / npm 10 | Repo scripts; `npm install` added 55 packages. |
| Playwright | 1.62.1 (npm package) | Chromium browser build installed later: Chrome for Testing 151.0.7922.34 (chromium v1234), user-level cache (evidence 18). |
| Python venv + PyYAML | Python 3.12.8 / PyYAML 6.0.3 | Gitignored `.venv/`, used by `npm run verify` via `PATH` (evidence 16–17). |
| curl, git | system | Evidence capture; GitHub REST API identity lookup (read-only). |
| Claude Code (`claude-opus-5-5`) | — | AI agent; see contributions below. |

## Human / AI contributions

| Who | Contribution |
|---|---|
| Aditya | Made every scope and evidence decision recorded in CHANGE-BRIEF §2–3 and Updates 1–3 (situation answers, the refusal gate, awaiting-evidence state, counts as context only, closure check, no networking, timing as unverified, the scenario-precedence rule). Chose the project and its title; chose the branch and namespaces; approved the setup plan with adjustments (logging first, noreply identity, offline tests plus a separate liveness baseline, narrow scope, recording the evidence limitation, predictions held until he answers). Supplied the noreply address. Directed the corrections pass (lockfile restore, isolated venv, browser install, liveness on the specific job id, upstream PII investigation through the real CI workflow, commit without push). |
| Claude | Drafted all prototype code (`reality-check.mjs`, `hypothesis-probe.mjs`, `reality-check.test.mjs`), the README, the recipe and card text, the fixtures, `WORKED-RUN.md`, and the draft `DOMAIN-JUSTIFICATION.md`, implementing Aditya's decisions. Also: read the requirements and repo rules; identified conflicts; proposed the setup plan; ran every command in `evidence/`; picked the candidate posting; wrote the ad-hoc browser redirect probe; investigated the upstream CI failures; wrote these documents. Claude's own mistakes are listed in `FRICTIONAL.md`. Command attribution is in `TEST-REPORT.md`. |

**Reused, not copied:** `scripts/ats/liveness-core.mjs` (`classifyLiveness`, imported) and `scripts/score/role-scorer.mjs` (run through its CLI, because it executes on import).
