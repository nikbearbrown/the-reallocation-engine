# Modes

The `modes/` folder contains student-facing operating recipes for The
Reallocation Engine.

These are not the engine itself. The engine is the combination of:

- collected source data in `data/`;
- maintained scripts in `SCRIPTS/`;
- generated audits and compact extracts;
- mode recipes that tell students how to run, inspect, and interpret those
  scripts.

## Design Rule

Modes must use verified data before prompting.

Good mode behavior:

- run a script;
- read an audit;
- inspect generated output;
- record what happened;
- then explain or decide.

Bad mode behavior:

- ask an LLM to guess sponsorship likelihood;
- ask an LLM to invent labor-market statistics;
- skip available audits;
- produce a confident recommendation without checking source data.

## Active Modes

| Mode | Current role |
|---|---|
| `_shared.md` | Shared verified-data contract and logging rules. |
| `scan.md` | ATS detection and portal scanning using `SCRIPTS/ats/`. |
| `pipeline.md` | Process `data/ats/pipeline.md` through verified liveness/scoring steps. |
| `oferta.md` | Evaluate a job/role using sponsorship, ATS, BLS/SOC, and CV evidence. |
| `pdf.md` | Generate PDFs from anonymized Markdown CVs using `SCRIPTS/resumes/`. |
| `tracker.md` | Inspect and maintain `data/ats/applications.md`. |
| `patterns.md` | Future outcome-pattern analysis; requires tracker history first. |
| `update.md` | Repo-local update and mode-maintenance checklist. |

## Draft Or Helper Modes

| Mode | Current role |
|---|---|
| `apply.md` | Draft application answers from verified role/CV evidence. |
| `auto-pipeline.md` | Placeholder; documents the manual verified sequence until a script exists. |
| `batch.md` | Small-batch triage pattern for many URLs. |
| `contacto.md` | Outreach drafting with verified context only. |
| `deep.md` | External research prompt builder after local checks. |
| `followup.md` | Follow-up tracking draft; no cadence script yet. |
| `interview-prep.md` | Interview prep draft from saved evidence. |
| `latex.md` | Explicitly inactive until a LaTeX script exists. |
| `ofertas.md` | Multi-role comparison after individual evaluations. |
| `project.md` | Portfolio project planning helper. |
| `training.md` | Learning-plan evaluation helper. |

Before using any draft mode, check whether it calls real scripts and whether it
logs its outputs.

## Run Log

Use `modes/RUN_LOG.md` for human-readable history:

- what was run;
- what worked;
- what failed;
- what file changed;
- what should be tested next.

Generated data audits still belong next to the data they inspect, using
`-audit.md`.
