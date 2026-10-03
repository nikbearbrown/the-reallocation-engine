# SOURCES — opt-countdown

## Executive summary

This page credits everything the submission is built on: the repository and its rules, the
sample data, the fictional persona, the software used, and the AI. It also states plainly what the
AI contributed and what I decided, checked, changed, or rejected. No outside data, websites, or
other people's work were used beyond what's listed here.

## The repository

- **The Reallocation Engine**, Nik Bear Brown,
  https://github.com/nikbearbrown/the-reallocation-engine (forked at commit `015843d`). Code under
  the MIT License (`LICENSE`); book content under CC BY 4.0 (`LICENSE-BOOK-CC-BY-4.0.md`).

## Governing documents read and followed

| Document | Used for |
|---|---|
| `SNICKERDOODLE.md` | gates, provenance labels, lifecycle stages, TODO types, attestation format |
| `DOMAIN.md` | what runs today; known gaps (e.g. role quality weight 0, missing directories) |
| `CONTRIBUTING.md` | namespaced paths, branch name, "don't re-implement the scorer" |
| `DATA_CONTRACT.md` §Zero-Conditions | fictional personas only; no real emails in history |
| `recipes/README.md`, `recipes/_shared.md` | recipe structure; run-log template |
| `recipes/local-wage-adjustment.md` + `.card.md`, `recipes/scan.md` | style models for the recipe and card |
| `scripts/contrib/README.md`, `recipes/cases/README.md` | contribution folder rules, README frontmatter |
| `docs/tutorials/01-first-scan.md` | the no-copy way to run `ats:scan` with the example config |

## Book content relied on

- `book/chapters/10-the-visa-timeline-manager.md`: the timeline factor concept (0 = skip,
  ~1 = comfortable, between = penalized) and its worked examples. The exact formula in my recipe is
  my own choice; the chapter gives none.

## Code reused (run, not copied or modified)

| File | How it's used |
|---|---|
| `scripts/score/role-scorer.mjs` | run as a command by the prototype (before and after); unchanged |
| `scripts/ats/check-liveness.mjs` | run once during setup to see its behavior; not called by the prototype |
| `scripts/ats/scan.mjs` | run once during setup (dry run) |
| `scripts/conformance.mjs`, `scripts/doctor.mjs`, `scripts/manifest-check.mjs`, `scripts/pii-scan.mjs` | checks |
| `scripts/score/gate-harness.mjs` | read only: its comment confirmed the scorer must be called as a command |

## Data used

| Data | Path | Notes |
|---|---|---|
| Fictional persona Priya Nair | `search/examples/priya-nair/profile.yml` (+ `gaps.md` read) | used unchanged; test fixtures derive from it at test time and are never committed |
| Sample roles | `data/examples/ch11-roles.json` | the book's illustrative Chapter 11 examples; their sponsorship and liveness values were not checked against real data |

Not used: 80 Days to Stay, SEC Form D samples, BLS / O*NET data. No live job postings are part of
the prototype. During setup only, one public Databricks job URL from Greenhouse's public job-board
API was checked for liveness.

## Prior student work consulted

- `recipes/cases/2026su/case-opt-timeline-fit-company-targeting.md` and
  `recipes/cases/2026su/case-ds-faang-opt-runway.md`: anonymized Summer 2026 drafts on a similar
  question. Cited in my recipe as prior art; nothing copied (they contain no formula or script).

## Software

- Node.js v26.0.0; npm packages from the repo's `package.json`: `js-yaml` (reading the persona
  YAML, used by the prototype), `playwright` (liveness check; Chromium downloaded with my
  approval), `glob`, `sharp`.
- Python 3.14 (Homebrew) with PyYAML in a repo-local `.venv`, needed by `npm run verify`.
- git, macOS.

## AI

**Claude Code** (Anthropic, model Claude Opus 5.5), used in the Claude desktop app for the whole
assignment. Commits carry a `Co-Authored-By: Claude Opus 5.5` line.

### What the AI contributed

- Explained the assignment and the repo in simple terms; read and summarized the governing docs.
- Typed every terminal command, including the signed run (at my request, after I confirmed the
  inputs).
- Wrote all the code: `opt-countdown.mjs`, the tests, and the fixtures.
- Drafted every document (brief, recipe, card, README, test report, justification, worked run, run
  log, this file, `FRICTIONAL.md`) from my answers and decisions.
- Found the key repo facts the design rests on: the scorer reads a typed timeline and defaults a
  missing one to 1; it exports nothing; its closed-gate line is 0.05.
- Offered options with recommendations whenever I had to decide something.

### What I decided, checked, changed, or rejected

- **Decided:** the situation (opt-countdown, year-1 OPT, persona Priya unchanged, no industry
  focus); the 8-week assumption; all four gates; the sliding formula; reusing the sample jobs;
  staying DRAFT; the G-C outcomes (network into 2 jobs, drop 3).
- **Checked:** the git remotes myself; the gate G-A inputs against the profile; the deadline by
  hand (90 − 34 = 56 days from Oct 2 → Nov 27, matching the program).
- **Caught / changed:** that the AI cloned before forking; I made the AI cite where new personas
  are allowed, and it corrected itself.
- **Rejected:** creating a new persona; personalizing the persona; the crypto/fintech domain I
  first proposed.
- **Did not do myself:** write any code or document text. Details, with each AI mistake, are in
  `FRICTIONAL.md`.

## Collaborators

None. No other students or people contributed.
