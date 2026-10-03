# SOURCES — game-dev-h1b-soc-15-1252

## The repository and its governing documents

This contribution is built inside
[`nikbearbrown/the-reallocation-engine`](https://github.com/nikbearbrown/the-reallocation-engine)
and follows its rules rather than inventing its own. The documents that shaped
the design, and how:

- `SNICKERDOODLE.md` — the prime directive (verified data and tested scripts
  first; prompting only for bounded judgment afterwards) is why the sector
  claim is labelled `model-judgment` instead of being presented as a filter.
- `DOMAIN.md` §Known gaps — gaps 1, 2 and 3 are each addressed explicitly in
  the recipe's "What it cannot verify" section rather than worked around.
- `CONTRIBUTING.md` — namespace layout, branch naming, and the rule against
  re-implementing the composite to test it.
- `DATA_CONTRACT.md` §Zero-Conditions — why the persona is fictional and why no
  real OPT date, résumé or contact appears anywhere in this branch.
- `recipes/_shared.md` — verified-data rules and the run-log entry shape.
- `recipes/local-wage-adjustment.md` and `.card.md` — the house style for a
  recipe/card pair, including the executive-summary-first rule and the
  can-verify / cannot-verify split.
- `.github/workflows/contrib-gate.yml` — read directly, which is how the
  `package.json` protected-path constraint was found.

## Data

**`data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`** —
30,369 rows, shipped with this repository. Per `data/80-days-to-stay/README.md`
it intersects SEC-derived company funding data with the U.S. Department of
Labor **LCA Disclosure Data** (H-1B, H-1B1 and E-3 applications) and the
**USCIS H-1B Employer Data Hub** (approval and denial counts). Compiled by
Nik Bear Brown / Humanitarians AI as part of the *80 Days to Stay* project.
Every sponsorship and funding figure in this submission is read from this file
unmodified; none was re-derived, interpolated or adjusted.

**`data/bls/compact/soc_occupation_compact.csv`** — BLS OEWS 2024 wage data
joined to O*NET ability and skill levels, shipped with this repository. Used
for the SOC 15-1252 row only.

**`data/sec/form-d/processed/sample/*.sample.json`** — SEC Form D samples, four
quarters × 50 companies. Examined during design and **not used** in the final
code path; the sample is too small to join against a games shortlist, and the
recipe says so rather than implying a live join.

## Public sources used for the hand check

Gate 1's sector claim cannot be verified inside the engine, so it was checked
against public reporting. Full write-up with per-company verdicts in
`SECTOR-VERIFICATION.md`; sources listed there.

## Tools

- **Node.js 24** (local) and the repository's own `scripts/score/role-scorer.mjs`,
  `scripts/conformance.mjs`, `scripts/doctor.mjs` and `scripts/pii-scan.mjs`.
- **Claude (Anthropic), Opus 5**, used as a coding and drafting assistant
  throughout. What it contributed and what was decided, checked or rejected by
  the author is set out below and in `FRICTIONAL.md`.
- No other generative tool, library or dependency was added. The prototype
  introduces no new package, no npm script and no network call.

## AI contribution versus author decisions

Stated plainly, because the course AI policy requires it and because
misrepresenting it would be the one unrecoverable error in this submission.

**Produced by the AI assistant:** the first draft of `triage.mjs`, the test
suite, the fixtures, the recipe and card, and the first draft of every document
in this folder. The repository reconnaissance that found the `package.json`
protected path, the missing `role-scorer.mjs` exports, and the four CI harness
scripts that do not exist on `main`. The CSV analysis establishing that the
industry column has 24 labels and none is games, and that 1,557 of 30,369 rows
carry H-1B data. The public-source check behind `SECTOR-VERIFICATION.md`.

**Decided by the author:** the domain — game programming roles under OPT — and
with it the whole shape of the recipe. Which of the proposed designs to build
and which to leave as a `[TODO]`. That the submission would claim no more than
`RUNNABLE-SAMPLE`, and — after checking the lifecycle table — that it would
claim `DRAFT`, because two open `[TODO]`s block the transition before it. That
the known gaps would be stated rather than engineered
around.

**Checked by the author:** every command in this submission was run by the
author on their own machine from their own checkout, and the output pasted into
`TEST-REPORT.md` and `WORKED-RUN.md` is that run, not a reproduction of it. The
`pii-scan` finding was traced to `HEAD:package-lock.json` to confirm it is not
introduced by this branch. The `MANTICORE GAMES INC` row was read directly out
of the CSV by hand and compared to what the report printed.

**Rejected or corrected:** three things were changed because of a decision I
made, and they are set out at length in `FRICTIONAL.md`.

I rejected a description of my CSYE 7270 Unity project as completed credibility
work. It is a final project due at the end of term; it is now described as in
progress, and the credibility artefact this submission claims is the submission
itself.

I corrected the scope. The recipe was called "games-sector sponsorship triage"
until a check of fourteen well-known game employers found one of them in the
dataset. It is now "sponsorship triage for funded private game studios", and a
control run on life sciences and large technology — showing the same pattern —
is recorded in `SECTOR-VERIFICATION.md` so that the limit is attributed to the
data source rather than to the choice of domain.

I declined to tune the `0.35` unknown-sponsorship prior, although I wanted to.
A lower number would have raised the skip rate from 17% and made the report look
more decisive, and I had no evidence that it would make the estimate better.

Two corrections were made by the assistant itself rather than by me, and are
recorded as such: a fixture that claimed a provenance it did not have, and an
unverified figure inside the worked run's own section about honesty. Neither was
caught by me in review.

## Collaborators

None. This is individual work. No other student's namespace is touched by this
branch.
