# Run log — 2026fa-contactshyam14-code-1

## Executive summary

A record of the first sample runs of the "network, don't apply" recipe for an engineering-management graduate on twelve-month OPT. The tool ran end to end on the repository's shipped data and found one open matching job, four networking targets, and 52 companies still to check. It flagged two problems in the source data. Both visa and identity checkpoints are still waiting for a person. A second entry (2026-10-02) records Shyam's correction that December 2026 is his OPT start, not its end, and the re-run that followed.

## 2026-10-01 — em-network-targets sample run (runs 01–03, failure cases, break tests)

- **Recipe:** manual (`recipes/cases/2026fa/contactshyam14-code-em-network-targets.md` v0.1.0)
- **Inputs:**
  - persona `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/persona.shyam.json`
  - liveness `…/inputs/liveness.2026-10-01.json`, transcribed from `course/2026fa/submissions/contactshyam14-code/evidence/scan-dry-run-2026-10-01.txt`
  - data, as shipped at upstream `015843d`: `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (sha256 `eccdee2a…`), `data/bls/compact/soc_occupation_compact.csv`, `data/sec/form-d/processed/sample/*.sample.json`
  - as-of 2026-10-01
- **Outputs:**
  - `course/2026fa/submissions/contactshyam14-code/runs/01-first-pass/`, `02-primary-vocab/`, `03-scored/`, `04-break-unmatched/`
  - evidence files in `course/2026fa/submissions/contactshyam14-code/evidence/`
- **Result:**
  - Run 03: 57 candidates (13-1082: 55, 11-3051: 2) → network 4 · apply 1 · check-liveness 52 · skip 0.
  - Scorer: `✓ scored 5 roles → Apply 1 · Consider 0 · Skip 4 (skip 80%)`.
  - Every approval and denial count in the table is even (1,557 of 1,557); 42 groups covering 85 companies share an identical H-1B record.
  - 17/17 offline tests; cross-check 30/30 against the CSV; failure cases F1, F2, F3, F6 and the out-dir guard behaved as specified.
- **Open issues:**
  - Run 01 counted 8 software-QA titles as production management. Fixed (primary O*NET row only).
  - Mutation M3 leaked 5 files into `data/examples/`. They were moved out, and the test hardened.
  - 52 candidates have no board check, including both production-management sponsors (no Greenhouse/Lever/Ashby board found).
  - The Genies and Senti boards are unconfirmed (model-judgment liveness).
- **G4 visa-path:** not signed. Waiting for Shyam to ask the DSO whether any post-OPT path exists, including whether the degree is STEM-designated.
- **G5 identity:** none of the 5 scored companies is flagged. Six flagged candidates (CONVEY/COVEY, LYNDRA/LYRA THERAPEUTICS, SALESFORCE COM/SALESFORCECOM) are held and not contacted.
- **Sample-run adequacy (sets the recipe's `last_gate`):** not yet read by a human. *Shyam: after re-running, replace this line with "read by Shyam Gopalakrishnan, YYYY-MM-DD", plus anything you disagree with.*
- **Who did what:** Claude (AI) ran every command and drafted this entry. Shyam supplied the situation and the design choice, and must sign the gates.

## 2026-10-02 — em-network-targets run 05 (corrected OPT dates)

- **Recipe:** manual (`recipes/cases/2026fa/contactshyam14-code-em-network-targets.md` v0.1.0)
- **Inputs:**
  - persona corrected by Shyam: OPT **start** 2026-12-31, end 2027-12-30 (assumed: start + 12 months − 1 day), unemployment days used 0
  - liveness `…/inputs/liveness.2026-10-01.json` (1 day old)
  - as-of 2026-10-02
  - same data files
- **Outputs:**
  - `course/2026fa/submissions/contactshyam14-code/runs/05-corrected-opt-dates/`
  - `…/evidence/failure-cases-2026-10-02.txt`, `…/evidence/cross-check-2026-10-02.txt`
- **Result:**
  - 57 candidates; network 4 · apply 1 · check-liveness 52 · skip 0. Every company has the same group and tier as in run 03.
  - OPT window 2026-12-31 → 2027-12-30 (starts in 90 days); 180 days available; timeline factor 1 on both paths.
  - Cross-check 30/30; 19/19 tests; F1 (as-of 2028-01-15), F2, F6 and out-dir refusals as specified.
- **Open issues:**
  - The real EAD end date is unknown (2027-12-30 is assumed).
  - Runs 01–04 used the wrong date: an end of 2026-12-31 that was really the start.
- **G4 visa-path:** not signed. The question is now which H-1B registration falls inside the window, and what happens if it isn't selected.
- **G5 identity:** unchanged from 2026-10-01.
- **Sample-run adequacy:** not yet read by a human. *Shyam: replace with "read by Shyam Gopalakrishnan, YYYY-MM-DD".*

## 2026-10-02 — Canvas ZIP check

- **Recipe:** manual (submission check)
- **Inputs:** `git archive` of PR head `5d9fca2`, unzipped into the Windows temp folder
- **Outputs:** none kept (the test run's scratch output was removed by the test itself)
- **Result:** 18 of 19 tests. The output-folder guard allowed writing into the unzipped repository's `data/examples/`, because the whole repository sat under the OS temp dir. Fixed (namespaces only, inside the repository); regression test added; 20/20.
- **Open issues:** none from this check. The rebuilt ZIP was re-tested; the result is in SUBMISSION.md.

## 2026-10-02 — Shyam's review and sign-off

- **Recipe:** manual (human review of the sample run)
- **Inputs:** Shyam's own run (`course/2026fa/submissions/contactshyam14-code/runs/06-shyam-check/`); the raw CSV row for IEX GROUP INC; the IEX, Genies and Senti job boards, opened in his browser
- **Outputs:**
  - `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-02.json` (his board confirmations)
  - `course/2026fa/submissions/contactshyam14-code/runs/07-shyam-confirmed/`
- **Result:**
  - Tests 20/20 at `c0bceb8` and the tool's 57 · 4 · 1 · 52 · 0 split, reproduced by Shyam himself.
  - The IEX raw-data line matched the report.
  - The IEX "Project Manager" job is still listed; the Genies and Senti boards belong to those companies.
  - Run 07: same groups and tiers; Genies and Senti liveness is now your-input.
- **Sample-run adequacy:** **signed by Shyam Gopalakrishnan, 2026-10-02** (sets the recipe's `last_gate`).
- **G2 liveness:** Genies and Senti boards confirmed by Shyam (person), 2026-10-02.
- **G4 visa-path:** not signed. Waiting for Shyam's DSO question.
- **G5 identity:** unchanged. The six flagged candidates are held and not contacted.
- **Open issues:** EAD end date still assumed (2027-12-30).
