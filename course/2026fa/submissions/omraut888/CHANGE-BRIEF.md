# CHANGE-BRIEF.md

## Executive summary

This recipe helps an international MS graduate with a machine-learning/RAG
engineering background — on an F-1 OPT clock, needing H-1B sponsorship —
decide which AI/ML engineering roles are worth applying to. It filters the
engine's sponsorship-history data to companies with checkable H-1B history,
shrinks small-sample approval rates toward a global prior instead of
trusting raw percentages, gates every role on a timeline factor computed
from the student's real OPT runway against a stated hiring-lag assumption,
and names — without implementing — an open question about the engine's
currently-zeroed role-quality weight.

## Career situation

International MS student in Information Systems (production ML/RAG
engineering background), on F-1 OPT year 1, needing H-1B sponsorship,
targeting AI Engineer / ML Engineer roles. Built on the existing
`search/examples/priya-nair/` persona: OPT window 2026-02-01 to
2027-01-31, 34 unemployment days used **as of a fixed run date, 2026-09-30**
(this date is fixed in the build script, not left to drift against
whenever the recipe is re-run), leaving 56 days, minus a 20-day buffer,
for **36 usable days**.

Engine layers used:
- **80 Days to Stay** — sponsorship history (shrunk approval rate) and
  company funding, both already present in the same CSV
- **The Cognitive Pivot** — BLS SOC 15-1252 (Software Developers) as the
  closest existing occupation code; no SOC 2018 code exists for ML/RAG
  specifically
- **Job-Ops** — ATS *presence* detection, gated as a live-network action
  (see below), explicitly distinguished from posting *liveness*
- **The Bayesian Role Scorer** (`scripts/score/role-scorer.mjs`) — final
  Apply/Consider/Skip decision, invoked as a CLI subprocess with no
  `--profile` flag

## Existing data and scripts to reuse (exact paths)

| Path | Use |
|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | Sponsorship history AND funding (`total_funding`, `latest_funding_stage`) for the 1,557-row H-1B subset. |
| `data/bls/compact/soc_occupation_compact.csv` | SOC 15-1252 row — used only for the role_quality *proposal* (not implemented). |
| `scripts/score/role-scorer.mjs` | Invoked as a CLI subprocess only (`npm run score -- <roles.json> --out-dir <dir>`), no `--profile`. It has zero exports and runs `main()` on import — contradicting `CONTRIBUTING.md`'s description of an importable API; documented here rather than worked around by re-implementing the scorer. |
| `scripts/ats/detect-ats.py` | ATS-provider *presence* check. Makes live HTTP calls (see Phase Gates — this is a live-network action, not a sample-mode default). |
| `search/examples/priya-nair/{profile.yml,resume.example.json,gaps.md}` | Base persona. `gaps.md`'s own observed hiring-loop lengths (6–10 weeks for big companies; favor sub-5-week loops) source the timeline-lag assumption below. |
| `resumes/priya-nair-cv.md` | Source of the RAG project evidence (`Smart E-Commerce`) missing from `resume.example.json` — the one proposed persona patch. |
| `data/examples/ch11-roles.json` | Schema reference for this recipe's `roles.json`. |

**`--profile` is deliberately not used.** `applyProfile()` reads exactly one
field (`authorization`, regex-matched) and touches exactly one weight
(`sponsorship → 0`). It never reads OPT dates, unemployment days, or
`needs_sponsorship`. Its `authorized` pattern is also a trap — a string
like "F-1 STEM OPT — work authorized (EAD)" would match and wrongly zero
the sponsorship weight. The default (no flag) already gives
`needsSponsor: true`, correct for this persona.

## Proposed additions

1. **[TODO: DATA SOURCE]** Add the `Smart E-Commerce` RAG project (in
   `resumes/priya-nair-cv.md`, absent from `resume.example.json`) to the
   persona's JSON. This is the recipe's one allowed patch to an existing
   maintained/example file (CONTRIBUTING's one-patch limit), declared here
   and in the PR body.

2. **[TODO: DEV]** A build script
   (`scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py`)
   that:
   - filters the 1,557-row H-1B subset to companies whose
     `top_job_titles_sponsored` (a Python list-literal string, parsed with
     `ast.literal_eval`) matches ML/AI/data-role keywords, and computes
     `fit.p` as a **crude keyword-overlap fraction** between the persona's
     stated skills and each company's matched title text — labeled
     `model-judgment` and named explicitly as a coarse proxy, not a
     semantic match; this is a stated limitation of the rough prototype;
   - computes `sponsorship.p` with additive (Laplace-style) shrinkage
     instead of the raw `Approval_Rate` ratio: `p = (approvals + C·prior) /
     (approvals + denials + C)`, where `prior` is the mean
     `Approval_Rate/100` across the full 1,557-row subset (a computed,
     labeled `record` value) and `C = 5` is a chosen pseudo-count (labeled
     `your-input`). This exists because 51 of 185 ML/AI-matching companies
     have fewer than 5 approvals — without shrinkage, a 2-for-2 record
     reads as `p = 1.0`; with it, it's pulled toward the subset's real
     average instead;
   - assigns `sponsorship.tier` from raw approval **count** (`Proven` ≥5,
     `Likely` 1–4, `Unknown` 0) for the scorer's separate soft-spot
     downgrade logic. Only 5 rows in the full subset have 0 approvals, and
     none observed among ML/AI-matching companies so far — `Unknown` is
     kept for completeness but is expected to rarely or never fire in this
     recipe's actual runs;
   - reads `total_funding` / `latest_funding_stage` from the same CSV and
     surfaces both in the human report **for context only** — the scorer
     has no funding term, so this does not affect the composite score or
     the Apply/Consider/Skip decision;
   - computes `timeline.factor = min(1.0, usable_days / expected_lag_days)`,
     where `usable_days` (36, from the fixed as-of date above) is clamped
     to exactly `0.0` — a hard Skip via the scorer's `gate_zero` — if the
     OPT end date has already passed. `expected_lag_days` is chosen from a
     two-bucket heuristic on the company's own funding stage already read
     above: a later-stage/larger company is assumed to take 56 days (the
     upper end of `gaps.md`'s observed 6–10 week range), a smaller/
     earlier-stage company 21 days (consistent with `gaps.md`'s own advice
     to favor sub-5-week loops). Both the bucket cutoff and the two lag
     constants are stated `your-input` assumptions, not measurements — with
     the 36-day runway, a large-company assumption gives `factor ≈ 0.64`
     (above the scorer's 0.6 soft-timeline cutoff), a smaller-company
     assumption gives `factor = 1.0` (capped).

3. **[TODO: DEFINE] — proposed, NOT implemented.** `status.md` names the
   `role_quality` weight as an open, unpinned authorial decision. This
   recipe's card documents a proposal (`role_quality: 0.15`, renormalizing
   `0.35/0.30/0.15` to sum to 1.0) but does not implement it: (a) it would
   require patching `role-scorer.mjs`, and this recipe's one allowed patch
   is already spent on item 1; (b) renormalizing divides every weight by
   0.80, raising every composite by **1.25×** against a 0.30 threshold
   calibrated for the old weights — the book's own Ch.11 non-sponsor
   example would move from 0.178/Skip to roughly 0.223/Consider, and the
   biotech example from 0.446 to roughly 0.558; (c) converting a wage into
   a `role_quality.p` value still needs its own separate `[TODO: DEFINE]`
   this recipe does not resolve. Named as a human decision point, not a
   claim that 0.15 is correct.

## Phase gates

1. **Sponsorship-subset gate**: a company must appear in the 1,557-row
   H-1B subset to be scored. Out-of-subset is out of scope, not a failure.
2. **Timeline gate** (hard stop, human-visible): the computed
   `timeline.factor` and the exact day count it's based on must be shown
   to a human before any Consider/Apply result is treated as actionable.
3. **Live-network approval gate**: `detect-ats.py` makes live HTTP calls
   to Greenhouse/Lever, which SNICKERDOODLE P2 and `scan.md`'s approval-gate
   pattern treat as a live action requiring explicit, logged human
   approval — not a sample-mode default. The prototype does **not** run
   this step automatically; rows are labeled
   `liveness_checked: false, method: "not run — requires live-network
   approval"` unless a human explicitly clears it (logged in
   `logs/runs/2026fa-omraut888-<n>.md`).
4. **Liveness — named limitation regardless**: even when cleared, this is
   ATS-provider *presence*, not per-posting *liveness* (`check-liveness.mjs`
   needs a posting URL this data source doesn't have). Every output row is
   labeled with which of the two was actually checked.

## Predicted failure cases

1. **Small-sample sponsorship tiers overstating confidence.** Mitigated by
   the Laplace-shrinkage rule above, not just the tier label — a 2-for-2
   record no longer computes to `p = 1.0`.
2. **Company-level salary is not role-specific.** (ACV Auctions:
   `median_salary_offered: $67,205` is a company-wide median across 22
   filings, not the sponsored ML title's actual pay.) Surfaced as a stated
   caveat, not fed into the scorer.
3. **An OPT end date already past the fixed as-of date.** Must compute
   `timeline.factor = 0.0` exactly, not a negative or nonsensical value.

## One prediction about what this will get wrong on the first pass

The ML/AI keyword match against `top_job_titles_sponsored` will likely
produce both false positives (a title containing "Data" that's actually
Data Entry) and false negatives (an LLM/RAG-specific title outside the
keyword list) — the underlying data is already imperfectly assembled (the
same ACV Auctions row lists one executive under two spellings,
"Magnuszewski" / "Manguszewski").

## First-run finding

*Added after the first build runs (2026-09-30). The sections above are the
prediction as written before anything ran and are left unchanged.*

**What happened, in one paragraph.** The build runs and the scorer accepts
its output, but the result can't tell a good role from a bad one. Across
two designs for the fit signal, the skip rate went from 1% to 0%: the
build tells this student to apply to, or consider, every single company it
scores. The deciding factor is not fit or sponsorship but a funding-stage
guess about how long a company takes to hire.

### Runs

| Run | fit.p design | Keyword match | Companies | Apply | Consider | Skip | Skip rate |
|---|---|---|---|---|---|---|---|
| 1 | resume skills vs. sponsored titles | substring (buggy) | 185 | 76 | 108 | 1 | 1% |
| 2 | target-role words vs. matched titles | substring (buggy) | 185 | 87 | 98 | 0 | 0% |
| 3 | target-role words vs. matched titles | whole-word (fixed) | 183 | 87 | 96 | 0 | 0% |

Run 3 is the state this prototype ships with. Its fit.p design is final for
the prototype; no third design is attempted.

### fit.p distributions

- **Run 1: 0.0 for all 185 companies.** Job titles never name tools, so
  skills like Python, MLflow or LangGraph never appear in "Machine Learning
  Engineer III".
- **Run 2 (and run 3): only 5 possible values**, because the target-role
  token set is `{ai, data, engineer, ml}`. Run 3: 0.0 → 10, 0.25 → 146,
  0.5 → 24, 0.75 → 2, 1.0 → 1 (mean 0.279, median 0.25). 80% of companies
  get the same value, which adds the same 0.075 to the composite.
- **Skewed cases.** The signal measures whether a title contains the word
  "data" or "engineer", not whether the work is ML:
  - "Machine Learning Engineer" can't match the token `ml`, so 42 of the
    48 companies sponsoring that title score 0.25, the same as a plain
    "Data Scientist".
  - Applied Scientist, NLP Scientist, Senior Machine Learning Scientist,
    Senior NLP Research Scientist and Senior Security Machine Learning
    Researcher all score 0, although they are among the closest fits for
    this student.

### Keyword-match false positives and negatives

- **Fixed:** the keyword `llm` matched inside "Fu*llm*ent", admitting two
  companies whose only matching titles were "Fulfillment Operations Lead"
  (KEEPE UP INC) and "Fulfillment Shift Manager" (NOHO HEALTH INC). Keywords
  now match whole words only. Both are excluded, taking the count from 185
  to 183. No other known false positives remain.
- **Known false negatives:** Uber and Intel, both high-volume sponsors of
  software roles, are not scored at all because their sponsored titles
  ("Software Engineer" and similar) contain no ML keyword. The total
  false-negative rate can't be measured without labelled ground truth, so
  none is claimed.

### Two structural causes of the 0% skip rate

1. **The liveness gate is never exercised.** Phase gate 3 blocks the
   live-network ATS check without logged human approval, so every role is
   given `liveness.factor = 1.0` and labelled `liveness_checked: false`. The
   scorer's strongest Skip path, a closed gate, therefore never fires on
   liveness.
2. **Survivorship bias from the pre-filter.** Only companies that already
   sponsored ML-adjacent titles enter scoring, and nearly all of them had
   their petitions approved: shrunk `sponsorship.p` ranges from 0.838 to
   0.999 (mean 0.986). The shrinkage works as specified but has almost
   nothing to pull toward, since the prior itself is 0.979. Every company
   arrives with near-maximal sponsorship evidence, so sponsorship can't
   separate them either.

### What actually drives the decisions

Funding-stage-driven timeline gating, not fit or sponsorship, is the
dominant factor in this build's decisions. Early-stage companies get the
assumed 21-day hiring lag (`timeline.factor` 1.0); Series C and later get
56 days (factor 0.643). Early-stage: 116 companies, mean composite 0.428,
77 Apply / 39 Consider. Late-stage: 67 companies, mean 0.277, 10 Apply / 57
Consider. Microsoft ranks 176th of 183 (0.266, Consider); LinkedIn ranks
121st (0.320, Apply). That ordering comes from an asserted `your-input`
assumption, not from any recorded evidence about how these companies hire.
