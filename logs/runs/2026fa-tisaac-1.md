# Run log — 2026fa-tisaac-1 (SWE STEM-OPT Runway)

Format: `recipes/_shared.md` → Logging Rules. Full output, verification, and attestation: `course/2026fa/submissions/tisaac/WORKED-RUN.md` and `TEST-REPORT.md`.

## 2026-10-21 — SWE STEM-OPT sample run 1 (re-run after grading)

- **Recipe:** recipes/cases/2026fa/tisaac-swe-stem-opt.md v0.2.0 (status DRAFT, 6 TODOs open)
- **Inputs:** scripts/contrib/2026fa/tisaac-swe-stem-opt/fixture.json (3 invented jobs, fictional persona); data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv
- **Outputs:** scripts/contrib/2026fa/tisaac-swe-stem-opt/my-roles.json, role-scores.json, role-scores.md
- **Result:** 3 roles → Apply 2 · Consider 0 · Skip 1, skip rate 33%. Offline test 9/9 passed; two deliberate breaks each caught. Real company's sponsorship (`record`, Total Approvals 2.0) cross-checked by hand against the CSV.
- **Open issues:** No gate cleared by a person (G1 liveness not run; G3 ban and G4 titles not implemented). The invented company reached Apply at 0.30 on the self-reported fit alone. Skip rate below the ~50% a healthy run skips. Scorer run with its default "requires sponsorship" profile.

## 2026-10-03 — SWE STEM-OPT sample run 1 (first submission)

- **Recipe:** recipes/cases/2026fa/tisaac-swe-stem-opt.md v0.1.0 (claimed RUNNABLE-SAMPLE)
- **Inputs:** same fixture (without `fit` / `timeline` fields); same CSV
- **Outputs:** scripts/contrib/2026fa/tisaac-swe-stem-opt/my-roles.json, role-scores.json, role-scores.md
- **Result:** 3 roles → Apply 2 · Consider 0 · Skip 1, skip rate 33%.
- **Open issues (found at grading, 2026-10-21):** stage claimed above DRAFT with TODOs open; no offline test; liveness labeled `record` and fit labeled `model-judgment` without a fetch or a model; `no-matched` used as a fourth label. All addressed in the 2026-10-21 run.
