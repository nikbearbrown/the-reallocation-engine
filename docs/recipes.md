# Recipes Overview

The `recipes/` directory contains agent-facing recipes for operating The
Reallocation Engine. These recipes are precise enough for agents to execute, but
each one starts with an executive summary so humans can understand what the
agent is about to do.

## System Rule

Every recipe follows the same hierarchy:

1. Check verified local data first.
2. Check vetted stored scripts in lowercase `scripts/` first.
3. Use external lookup only when local evidence is missing, stale, or
   insufficient.
4. Create ad hoc scripts only when no stored script fits.
5. Run explicit checks before scaling or automating.
6. Record meaningful runs, blockers, and generated artifacts in
   `logs/RUN_LOG.md`.

## Active Recipes

| Recipe | Human-readable purpose | Primary stored scripts or data |
|---|---|---|
| `_shared.md` | Defines the shared contract every recipe must obey. | `README.md`, `DATA_CONTRACT.md`, `scripts/`, `data/` |
| `scan.md` | Find and verify ATS providers and live posting evidence. | `scripts/ats/`, `data/ats/` |
| `pipeline.md` | Move job URLs through liveness and evidence triage. | npm ATS commands, `data/ats/pipeline.md` |
| `oferta.md` | Evaluate one role as pursue, investigate, or skip. | SEC/H-1B data, ATS scripts, BLS data, CV evidence |
| `pdf.md` | Generate ATS-friendly PDFs from approved Markdown CVs. | `scripts/resumes/` |
| `tracker.md` | Maintain application and scan history. | npm ATS tracker commands, `data/ats/applications.md` |
| `patterns.md` | Analyze outcomes only after enough tracker history exists. | `scripts/ats/analyze-patterns.py` |
| `update.md` | Keep recipes aligned with scripts, data contracts, and docs. | `scripts/`, `docs/`, `recipes/` |

## Draft And Helper Recipes

Draft/helper recipes are usable only when their gates pass. If a recipe says no
stored script exists, the agent must not pretend the workflow is automated.

| Recipe | Purpose | Main caution |
|---|---|---|
| `apply.md` | Draft application answers from verified evidence. | Does not decide whether to apply. |
| `auto-pipeline.md` | Documents why the full pipeline is not automated yet. | Requires full automation gates before scaling. |
| `batch.md` | Triage many URLs after a small-run gate. | No large batch before sample verification. |
| `contacto.md` | Draft outreach from verified role/CV evidence. | No private contact search or invented relationships. |
| `deep.md` | Build external research prompts after local checks. | External lookup is a fallback. |
| `followup.md` | Draft follow-ups from tracker history. | No automated cadence stats yet. |
| `interview-prep.md` | Prepare interviews from saved evidence. | No fabricated questions or stories. |
| `latex.md` | Marks LaTeX export as inactive. | Use `pdf.md` until a stored LaTeX script exists. |
| `ofertas.md` | Compare multiple evaluated roles. | No precise ranking from missing data. |
| `project.md` | Plan portfolio projects that fill evidence gaps. | Must produce testable artifacts. |
| `training.md` | Evaluate training by evidence and opportunity cost. | Certificates are not useful unless they create signal. |
| `_profile.template.md` | Optional local student context. | Private context cannot override verified data. |

## Human Review Checklist

Before letting an agent run a recipe, check:

- The recipe has an executive summary.
- The relevant local data and audits are named.
- The relevant stored scripts are named, or the recipe says no script exists.
- The phase gates are explicit.
- The output contract is clear.
- The logging rule is clear.
- The recipe does not reference uppercase `SCRIPTS/`.
