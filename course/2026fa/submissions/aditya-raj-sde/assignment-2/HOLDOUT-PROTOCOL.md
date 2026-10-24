# Unseen-posting evaluation protocol (rules v0.4.0)

## Executive summary

This document fixes, in advance, how a small set of job postings that played no part in building
the rules is chosen and checked. It exists so the screening rules can be tested on postings nobody
tuned them on. It was written after the rules were frozen and before any new posting was selected
or read. It names which postings count as unseen, how six are chosen, how the expected reading is
recorded before the program runs, and how disagreements are kept. A sample of six from the same
three employers cannot show general accuracy. It can only reveal errors.

## Frozen rules

- Rules **v0.4.0**, commit `49100364213f4f07ab2a602906fdd3e01dad12bf`. `checks.mjs` and the
  decision logic in `triage.mjs` are not edited until the first holdout result is recorded.
- Any later repair is **development evidence**. The first result stays the holdout result.

## What counts as unseen

A candidate posting is unseen only if **all** of these hold:

1. It is not one of the original 12 (`real-sample/selection.json` → `selected`).
2. Its job id appears in **no** development artifact: this submission folder, evidence files, or
   `private/a2/` outside the raw captures and state files. A check before this protocol found 4
   Databricks ids that appear in `selection.json` as duplicates or as the posting a duplicate
   points to: `5646855002`, `4799387002`, `6544435002`, `6544364002`. Their text was never read,
   but their ids and titles were visible, so **they are excluded**.
3. It is not a duplicate role. It must not share a normalized title **and** description hash with
   any posting under the original protocol's duplicate rule, and must not share an exact
   normalized title with one of the original 12 at the same employer.

## Selection (deterministic continuation)

- Same source: the raw board responses captured 2026-10-21 00:01:5x EDT (paths and SHA-256 in
  `selection.json`).
- Same cohort rule and order: `selectFromBoard` from `collect.mjs`, with unique cohort postings
  ordered newest `first_published` first, ties by job id.
- Per board, walk the order **after** the original 4 and take the first **2** postings that
  satisfy "unseen". This targets positions 5–6 and continues past excluded ones.
- Target: 6 postings (2 × Databricks, Pinterest, Stripe). If a board runs out, report the actual
  number. No other board is added.

## Observations (fresh, at evaluation time)

- **Posting text:** the original 00:01 capture (deterministic). A fresh board fetch with the
  maintained greenhouse-watch fetcher records whether each posting is **still listed** now, and
  whether its content hash changed.
- **Page:** `npm run ats:liveness -- <6 URLs>` once, plus `page-probe.mjs` (status, title,
  length). No challenge bypass.
- URLs, capture and observation times, retrieval failures, and missing fields are recorded.

## Expected interpretation (before the program runs)

- After extraction, and **before** `triage.mjs run`, Claude reads each posting's captured text
  and the observations, and writes the expected state for G2, G3 (wording and eligibility), G4,
  G5, G6, and the final next step, each with the supporting quote.
- These are labelled **Claude-reviewed, not human-validated**, and committed **before** the
  program output is generated.

## Comparison

- Per check and per final action: agree / disagree. Execution success is not counted as
  agreement.
- Every disagreement is kept, with Claude's reading of whether the rule or the expectation is
  wrong. Claude is not a neutral judge of its own rules; that limitation is stated.
- If a defect is repaired, the original holdout output stays as-is, and the rerun is labelled
  development evidence.

## Limitation stated in advance

Six postings from the same three boards, captured on the same day and chosen by the same rule,
cannot establish general accuracy on other employers, ATSs, or wording. They can only expose
errors.

## Record

Written 2026-10-21, after the freeze commit and before selection.

## Corrections

*(none yet)*
