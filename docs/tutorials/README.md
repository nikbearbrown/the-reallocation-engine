# Tutorials

Hands-on, step-by-step walkthroughs of the engine's runnable surface. Every tutorial follows the same loop — **predict → run → inspect → judge → record** — and every exercise's deliverable is a `logs/RUN_LOG.md` entry, not a screenshot. The tutorials assume you have read `SNICKERDOODLE.md` (the contract) and `DOMAIN.md` (what this repository is).

| # | Tutorial | Status | What you'll be able to do |
|---|---|---|---|
| 00 | [Exercise Zero — your personal layer](00-personal-layer.md) | **ready** | build `search/`: convert your resume to attested `resume.json`, answer the conditional intake into `profile.yml`, edit your first `gaps.md` |
| 01 | [Your First Scan](01-first-scan.md) | **ready** | configure the ATS scanner, run a dry scan, read and judge its report, log a run |
| 02 | Liveness — is the posting real? | planned | check job URLs with `ats:liveness`, classify live/expired/uncertain, understand why a URL is not evidence |
| 03 | A résumé that survives the parser | planned | generate an ATS-safe PDF with `resumes:pdf` and verify text extraction |
| 04 | Reading an audit | planned | regenerate `data/bls/bls-audit.md`, trace one number in it back to its source file (P3 in practice) |
| 05 | The first oferta | planned | evaluate one real role end-to-end with the four evidence components, ending in Apply / Consider / Skip |

Status is honest per the data contract: "planned" means a title and a goal, not a hidden draft. If a tutorial you need is planned, say so in `logs/RUN_LOG.md` as a blocker — or write it and submit it with its own attestation.

## Conventions

Commands are run from the repo root. Anything written under `data/ats/` is private by default — check `git status` before committing. A tutorial never asks you to trust a number you can't trace; if one does, that's a bug — log it (SNICKERDOODLE.md P3).
