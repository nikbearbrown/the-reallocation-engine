# RUN_LOG entry — ai-startup-formd, 2026-10-20

## Executive summary

This is the run-log entry the assignment asks to be included with the submission. Students may not edit the shared run log, so the same entry is filed in the repository's per-student run-log folder and copied here. It records the two sample runs of the AI-startup triage mode for the fictional persona Ananya Rao, the reporting bug they show and its fix, the human gate decisions, and the open issues.

## Entry

Filed as `logs/runs/2026fa-gnanasudharsan-2.md` (the `-1` number is used by the author's earlier de-mlops-h1b contribution).

```markdown
## 2026-10-20 — ai-startup-formd sample run (run3a pre-fix checks, run3b fixed)

- **Date:** 2026-10-20
- **Mode:** recipes/cases/2026fa/gnanasudharsan-ai-startup-formd.md v0.1.0 (DRAFT, 5 open items)
- **Inputs:** mapped_student_employment_targets_v3.csv (30,369 rows, sha256 eccdee2addf472b1…); Form D samples (4 × 50); BLS compact table; fictional persona search/examples/ananya-rao/; runs/2026-10-20-run3b/inputs/ postings.json, ats-liveness-2026-10-20.txt, clearance.json; as-of 2026-10-20
- **Outputs:** course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/ (pre-fix checks, reconstructed) and runs/2026-10-20-run3b/ (log, report, roles, scorer output, transcripts)
- **Result:** run gate OPEN (snapshot 2025-09-26). Postings 4 · scored 1 · held 3 · excluded 0. Screened employers 107 · stale 82 · below-minimum 15 · runway-fail 6 · CANNOT-VERIFY 4 · PASS 0. Scorer: "✓ scored 1 roles → Apply 1 · Consider 0 · Skip 0 (skip 0%)"; report verdict HOLD — runway unverified (composite 0.523). Recount matches. Tests 20/20.
- **Gate decisions:** Gnanasudharsan Ashokumar, 2026-10-20 — liveness network for two URLs; G-TIMELINE clearance for sample scoring only (verbatim in the recipe closures and logs/runs entry); DEFINE closures 2026-10-18/20.
- **Open issues:** CodaMetrix liveness uncertain ("navigation error: page.goto: Download is starting"); aggregator URLs only; Form D sample only (50/quarter); DOL LCA with SOC + FY, EDGAR freshness check, hold-clearing report column open; raw scorer Markdown prints "Apply" for the cleared row; report test depends on repo-relative data/bls/; pre-fix evidence is a reconstruction; manifest-check W1 (archive/ in ignore: but tracked) and W2 (private/, data/ats/ — false positive, contents are gitignored), both pre-existing on upstream/main; spec conflict between the summer Mode Build spec and CONTRIBUTING.md (followed CONTRIBUTING.md).
```
