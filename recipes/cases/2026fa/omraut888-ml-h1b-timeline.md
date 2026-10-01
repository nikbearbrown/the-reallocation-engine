---
status: DRAFT
todos_open: 3
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# omraut888-ml-h1b-timeline -- ML/RAG H-1B Triage on an OPT Clock

## Purpose

Build scorer-ready role records for an international MS graduate on F-1 OPT who needs H-1B sponsorship and is targeting AI/ML engineering roles, then score them with the engine's existing Bayesian Role Scorer. Agents use this to turn verified sponsorship records and the persona's real OPT dates into labelled evidence; humans use the scorer's report to see which employers are not ruled out, and the card to see why the current build cannot yet rule any out (0 of 183 skipped).

## Source Inventory

| Source Node | Node Type | Source URL or Path | Human Check |
|---|---|---|---|
| Sponsorship history + funding | CSV | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | Confirm the file is the tracked copy and that the H-1B subset is still 1,557 rows before trusting counts. |
| Persona visa dates + target roles | YAML | `search/examples/priya-nair/profile.yml` | Confirm OPT dates, unemployment days, buffer and target roles are the persona's, not real student data. |
| Persona resume record | JSON | `search/examples/priya-nair/resume.example.json` | Loaded but not used for fit since run 2; confirm whether the Smart E-Commerce patch has landed. |
| Bayesian Role Scorer | Node script | `scripts/score/role-scorer.mjs` | Confirm it is unmodified; this recipe calls its CLI and never patches it. |
| SOC role-quality row | CSV | `data/bls/compact/soc_occupation_compact.csv` (SOC 15-1252) | Used only by the documented role-quality proposal; the build does not read it. |
| ATS provider detection | Python script | `scripts/ats/detect-ats.py` | Live network. Runs only after the approval gate clears. |
| Change brief + first-run finding | Markdown | `course/2026fa/submissions/omraut888/CHANGE-BRIEF.md` | Read the first-run finding before interpreting any score. |
| Human card | Markdown | `recipes/cases/2026fa/omraut888-ml-h1b-timeline.card.md` | The human twin of this recipe. |

## Inputs

| Input | Type | Source | Required? |
|---|---|---|---|
| Sponsorship CSV | CSV | `--csv`, default the tracked 80 Days to Stay file above | Yes |
| Persona directory | YAML + JSON | `--persona-dir`, default `search/examples/priya-nair/` | Yes |
| As-of date | date | Fixed in `build_roles.py` as `AS_OF = 2026-09-30` so the unemployment-day count doesn't drift between runs. Not a CLI flag. | Yes |
| Output directory | path | `--out`; outside the repo for sample runs | Yes |
| Live-network approval record | Markdown | A `logs/runs/2026fa-omraut888-<n>.md` entry granting ATS-detection approval; [TODO: APPROVE] no approval has been requested or granted. | Yes for live mode |

## Phase Gates

1. Sponsorship-subset gate: only companies in the H-1B subset (rows with recorded approval and denial counts) whose sponsored titles match the ML/AI keywords are scored; anything else is out of scope, not a low score. Test: `python3 -c "import json,sys; a=json.load(open(sys.argv[1])); assert a['rows_with_h1b_data'] > 0 and a['roles_built'] > 0, a; print(a['rows_with_h1b_data'], 'H-1B rows ->', a['roles_built'], 'roles')" <out>/build-audit.json`. Human capacity: [TO].
2. Timeline gate (hard stop, human-visible): the usable-day count and the lag each timeline factor was computed from must be shown to a human before any Apply or Consider is treated as actionable. Test: `python3 -c "import json,sys; a=json.load(open(sys.argv[1]))['assumptions']; print('usable days:', a['usable_days']['value'], '| lag days:', a['lag_days'])" <out>/build-audit.json`. Human capacity: [PA].
3. Live-network approval gate: ATS-provider detection makes live HTTP calls to Greenhouse and Lever and does not run without a logged human approval; until then every role carries `liveness_checked: false` and `liveness.factor = 1.0`. Even when cleared, this checks provider presence, not whether a posting is open. Test: `grep -rlF "live-network approval: granted" logs/runs --include='2026fa-omraut888-*.md' || grep -E 'TODO[:] APPROVE[]]' recipes/cases/2026fa/omraut888-ml-h1b-timeline.md`. Human capacity: [EI].

## Steps

1. Step name: Load persona. Labor: AI.
   Script called: `scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py` (`load_persona`).
   Input: `profile.yml` (visa block, target_role) and `resume.example.json` (skills).
   Output: visa dates, unemployment ceiling/used/buffer, target-role tokens `{ai, data, engineer, ml}`; skills are loaded but unused.
   Where output goes: in memory; recorded in `build-audit.json` under `assumptions`.
2. Step name: Filter to the H-1B subset. Labor: AI with Human gate (gate 1).
   Script called: `build_roles.py` (`build`).
   Input: sponsorship CSV.
   Output: rows with a non-blank `Total Approvals`, and the subset prior, volume-weighted: sum(`Total Approvals`) / sum(`Total Approvals` + `Total Denials`), currently 0.9812.
   Where output goes: `build-audit.json` (`rows_in_csv`, `rows_with_h1b_data`, `assumptions.sponsorship_prior`).
3. Step name: Parse and match sponsored titles. Labor: AI.
   Script called: `build_roles.py` (`TITLE_KEYWORDS`).
   Input: `top_job_titles_sponsored`, a Python list literal parsed with `ast.literal_eval`.
   Output: companies with at least one whole-word ML/AI/data-science title match; unparseable rows counted under `skipped`.
   Where output goes: `build-audit.json` (`roles_built`, `skipped`).
4. Step name: Score sponsorship and fit evidence. Labor: AI.
   Script called: `build_roles.py` (`shrunk_p`, `tier_for`, `fit_p`).
   Input: approvals, denials, matched titles, target-role tokens.
   Output: `sponsorship.p` = (approvals + C·prior) / (approvals + denials + C), C = 5 (your-input). The prior is the subset prior for companies with at least one approval, and a fixed 0.3 (your-input, chosen not derived) for companies with 0 approvals. The fixed value exists so that zero-approval companies are not blended toward the ~98% average; only 5 such companies exist and their counts look doubled, so a data-derived prior for them would not be trustworthy. Also `sponsorship.tier` (Proven ≥5 approvals, Likely 1–4, Unknown 0), `fit.p` as target-role word overlap (five possible values).
   Where output goes: `roles.json`.
5. Step name: Compute timeline factor. Labor: AI with Human gate (gate 2).
   Script called: `build_roles.py` (`usable_days`, `lag_for_stage`, `timeline_factor`).
   Input: OPT end date, unemployment days, buffer, as-of date, `latest_funding_stage`.
   Output: `timeline.factor = min(1, usable_days / lag)`, with 36 usable days, a 56-day lag for Series C and later or a blank stage, 21 days otherwise; exactly 0 once the OPT window has closed.
   Where output goes: `roles.json`, `build-audit.json` (`assumptions.usable_days`, `assumptions.lag_days`).
6. Step name: Label liveness. Labor: AI with Human gate (gate 3).
   Script called: none without approval; `scripts/ats/detect-ats.py` only after gate 3 clears.
   Input: approval record.
   Output: `liveness.factor = 1.0`, `liveness_checked: false`, `liveness_method: "not run — requires live-network approval"` on every role.
   Where output goes: `roles.json`.
7. Step name: Write role records and audit. Labor: AI.
   Script called: `build_roles.py --out <dir>`.
   Input: steps 1–6.
   Output: `roles.json`, `build-audit.json`, and a three-line stderr summary.
   Where output goes: `<dir>/`.
8. Step name: Score roles. Labor: AI.
   Script called: `npm run score -- <dir>/roles.json --out-dir <dir>` (CLI only; no `--profile`, since `applyProfile` reads only `authorization` and would mis-handle persona files).
   Input: `roles.json`.
   Output: `role-scores.json`, `role-scores.md`.
   Where output goes: `<dir>/`.
9. Step name: Review and log the run. Labor: Human.
   Script called: none.
   Input: `role-scores.md`, `build-audit.json`, the card.
   Output: a run-log entry with command, counts, skip rate and gate decisions.
   Where output goes: `logs/runs/2026fa-omraut888-<n>.md` (never `logs/RUN_LOG.md`).

## Output Contract

### Agent output
File: `<dir>/roles.json` and `<dir>/build-audit.json`
Fields (`roles.json`, per role): role_id, company, title, sponsorship {p, tier, source}, fit {p, source}, liveness {factor, source}, timeline {factor, source}, liveness_checked, liveness_method, evidence {total_approvals, total_denials, approval_rate_raw, median_salary_offered, median_salary_note, total_funding, latest_funding_stage, sponsored_titles, fit_tokens_matched}.
Fields (`build-audit.json`): as_of, source_csv, rows_in_csv, rows_with_h1b_data, roles_built, skipped, tiers, roles_with_fit_above_zero, assumptions {sponsorship_prior, zero_approval_prior, shrinkage_c, proven_min_approvals, usable_days, lag_days, fit_target_tokens}.

### Human report
File: `<dir>/role-scores.md`, written by the scorer, not by this build; plus the run-log entry from step 9.
Reader: the student deciding where to spend applications, and the reviewer deciding whether this build's recommendations can be trusted.
Decision enabled: which employers are not ruled out and need manual checking, whether the run can be attested, and whether the next revision should target liveness separation or LCA-by-SOC filtering.
Sections: summary with skip rate, one row per company with composite, recommendation, reason and term-by-term audit trail; the run-log entry adds gate decisions, the first-run finding reference and what was not checked.

## Stop Conditions

- Stop if the sponsorship CSV or persona files are missing, or the persona lacks OPT end date, unemployment ceiling, days used, buffer or target roles, because the timeline and fit terms would be guessed.
- Stop if `build-audit.json` reports any `unparseable-titles` skips, because the source format has changed. This has never been observed: 0 of 1,557 rows fail `ast.literal_eval`.
- Stop if the OPT end date is already past the as-of date. Every timeline factor is then exactly 0 and the scorer gates every role to Skip; route the student to their DSO, not to applications.
- Stop before any live network call, including `detect-ats.py`, unless the live-network approval gate has a logged human approval.
- Stop if `role-scorer.mjs` exits non-zero or the scored role count differs from `roles_built`, because the scorer contract has broken.
- Stop before presenting Apply or Consider as recommendations while the skip rate is 0%. Report the run as a finding about the build, not as a shortlist (see the card's named failure mode 2).

## Provenance

| Source | Verification command | Notes |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | `test -f "data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv"` | Tracked upstream data; not modified. |
| `search/examples/priya-nair/profile.yml` | `test -f "search/examples/priya-nair/profile.yml"` | Fictional persona. The proposed Smart E-Commerce addition to `resume.example.json` is still open: [TODO: DATA SOURCE]. |
| `scripts/score/role-scorer.mjs` | `git diff --quiet origin/main -- scripts/score/role-scorer.mjs` | Must be unmodified. The role-quality weight stays at 0.0; a non-zero weight is a documented proposal, not part of this recipe: [TODO: DEFINE]. |
| `scripts/contrib/2026fa/omraut888-ml-h1b-timeline/test_build_roles.py` | `python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/test_build_roles.py` | 19 tests on a fictional fixture; exit 0. |
| `course/2026fa/submissions/omraut888/CHANGE-BRIEF.md` | `test -f "course/2026fa/submissions/omraut888/CHANGE-BRIEF.md"` | Prediction plus first-run finding (runs 1–3). |
