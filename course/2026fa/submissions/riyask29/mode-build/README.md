# Mode Build: the Data-Analyst Sponsor Check (riyask29)

## Executive summary

**What this is.** Riya Kapadnis's submission for the Reallocation Engine Mode Build assignment. It is a
mode (the repo calls it a recipe) for one situation: an international data-analyst job-seeker in Boston on
F-1 OPT who needs H-1B sponsorship. It comes with the one-page case for it, a real run with its output
pasted in, and the run-log entry. **Why it is here.** It extends the Oct 2 recipe (PR #7) from "runs on
sample data" to "runs on full public records": every company in four SEC Form D quarters, and the
Department of Labor's own H-1B filings by occupation code. It also fixes the engine's posting checker. **What it
found.** The DOL records contradicted the sponsor list twice. A "Proven" analyst sponsor had no analyst
filing in the FY2026 file, and a company missing from the list had filed one. The mode stays a **DRAFT**:
three of the four original TODOs are closed with evidence (Riya confirmed where both datasets came
from), and two typed TODOs are open: hiring-lag evidence, which no source provides, and an engine bug the run found.

## Files

| File | What it is |
|---|---|
| [`../../../../recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.md`](../../../../recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.md) | **The mode file** (v0.2.0, DRAFT, 2 typed TODOs open), with its human card `…​.card.md` |
| [`01-domain-justification.md`](01-domain-justification.md) | One page: who, the information gap, the engine layers, two domain failure modes |
| [`02-worked-run.md`](02-worked-run.md) | The run: commands and pasted output, verified vs inferred, verification, break attempts, reflection, attestation (built from `02-worked-run.src.md` by `build-worked-run.py`, which pastes `runs/` verbatim) |
| [`03-run-log-entry.md`](03-run-log-entry.md) | The run-log entry (committed as `logs/runs/2026fa-riyask29-3.md`) |
| [`04-show-and-tell-notes.md`](04-show-and-tell-notes.md) | Outline for the five-minute in-class show and tell |
| [`runs/`](runs) | Every command's real output, and each run's JSON log and Markdown report (`run-c-final-seniority/` is the final run) |
| `make-zip.sh` | Builds `reallocation-riyask29-mode.zip` for the course site |

New or changed code (all in the contribution namespace except one declared patch):

| Path | What |
|---|---|
| `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/lca_slice.py` + `test_lca_slice.py` | Cuts a DOL LCA workbook to employer × SOC counts; 5 offline tests |
| `…/data/lca-ma-analyst-fy2026q3.csv` + `-audit.md` | The slice (no case numbers, no person's name or contact) and its rows-in/rows-out audit |
| `…/config/lca-soc-families.json` | Which SOC codes count as core vs adjacent analyst work (your-input) |
| `…/lib.mjs`, `…/analyst_check.mjs`, `…/analyst_check.test.mjs` | LCA join, full-quarter Form D wording, seniority gate G0 (roles ≤ 3 years), liveness retry; 11 tests |
| `…/liveness_frames.test.mjs` | 3 offline tests for the liveness fix |
| `scripts/ats/liveness-browser.mjs` | **The one declared maintained-file patch:** read apply controls in ATS-hosted iframes |
| `logs/runs/2026fa-riyask29-3.md` | Run-log entry |

## Where the brief's paths went

The brief was written for the Summer 2026 repository. This repository's `CONTRIBUTING.md` and its CI
(`contrib-gate.yml`) set different places, and a PR that edits `logs/RUN_LOG.md` fails CI.

| Brief says | This submission | Why |
|---|---|---|
| mode file under `recipes/` | `recipes/cases/2026fa/riyask29-…​.md` | CONTRIBUTING: recipes go in `recipes/cases/<term>/` |
| write-ups under `assignments/submissions/<name>/` | `course/2026fa/submissions/riyask29/mode-build/` | CONTRIBUTING: `course/<term>/submissions/<handle>/` |
| append to `logs/RUN_LOG.md` | `logs/runs/2026fa-riyask29-3.md`, plus `03-run-log-entry.md` in the zip | RUN_LOG.md is CI-protected for students; the brief allows "or include it in your submission" |
| branch `mode/<name>-<domain>` | `mode/riyask29-data-analyst` | as the brief asks |

## Reproduce (from the repository root)

```bash
node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.test.mjs      # 11 pass, offline
node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/liveness_frames.test.mjs    # 3 pass, offline
python3 scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/test_lca_slice.py                # 5 OK, needs openpyxl
node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs \
  --lca scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv  # live; add --formd-dir after fetching full quarters (recipe step 3b)
```

## Notes on the saved output

- The home-directory prefix in saved paths is shown as `~`. One scratch `--out-dir` is shown as
  `/tmp/score-out`. Nothing else in `runs/` was edited, and both edits are noted where they occur.
- The SEC requires a contact in its download User-Agent. The real one was used and is shown as `<name> <email>`.
- The persona is fictional. No real résumé, tracker or contact data is in this folder.
