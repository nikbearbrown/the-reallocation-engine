# 2026-10-20 — ai-startup-formd sample run (run3a pre-fix checks, run3b fixed)

## Executive summary

The sample run of the AI-startup triage mode for a fictional student, Ananya Rao, was made twice on the same inputs. Run 3a used the posting checks as they were before a reporting bug was fixed and reproduces it: two postings that were never supplied were also blamed on a "non-AI title". Run 3b used the fixed code and a new regression test covers the bug. Both runs give the same decisions. Of four postings, one was scored as a sample and kept on hold, and three are on hold. No employer in the local data shows funding runway through the October 2027 H-1B start date.

## Record

- **Recipe:** recipes/cases/2026fa/gnanasudharsan-ai-startup-formd.md v0.1.0 (DRAFT, 5 open items)
- **Inputs:** `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (30,369 rows, sha256 eccdee2addf472b1…); `data/sec/form-d/processed/sample/*.json`; `data/bls/compact/soc_occupation_compact.csv`; fictional persona `search/examples/ananya-rao/`; `course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3b/inputs/` — postings.json (6f47a79da0c06928…), ats-liveness-2026-10-20.txt (b7eec717558dce5e…), clearance.json (792df1fa8de8657e…); as-of 2026-10-20
- **Commands:** `npm run ats:liveness -- <2 approved URLs>`; `node scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/ai-startup-formd.mjs --as-of 2026-10-20 --postings … --liveness … --clearance … --out-dir …`; `npm run score -- <roles.json> --profile <profile.json> --out-dir <…>/npm-score` (scorer unchanged); `node --test scripts/contrib/2026fa/gnanasudharsan-ai-startup-formd/`
- **Outputs:** `course/2026fa/submissions/gnanasudharsan/mode-build/runs/2026-10-20-run3a-prefix/` (pre-fix checks, reconstructed by reversing the fix; script sha256 b84342f3b66caa13…) and `…/runs/2026-10-20-run3b/` (fixed script sha256 f7b09c2df915cd58…: ai-startup-formd-log.json, ai-startup-formd-report.md, roles.json, profile.json, role-scores.{json,md}, npm-score/, command transcripts 00a–02)
- **Result:** run gate OPEN (snapshot 2025-09-26, cutoff 2024-10-20). Postings: 4 · scored 1 · held 3 · excluded 0. Screened employers: 107 · funding-stale 82 · funding-below-minimum 15 · runway-ends-before-filing 6 · CANNOT-VERIFY 4 · PASS 0. Scorer, verbatim: `✓ scored 1 roles → Apply 1 · Consider 0 · Skip 0 (skip 0%)`; report verdict for that row: HOLD — runway unverified (composite 0.523). Independent Python recount matches all counts. Tests: 20/20 pass.
- **Gate decisions:**
  - Gnanasudharsan Ashokumar, 2026-10-20 — network approved for `ats:liveness` on exactly two URLs.
  - Gnanasudharsan Ashokumar, 2026-10-20 — G-TIMELINE clearance, verbatim: "A CANNOT-VERIFY company may be scored ONLY if ats:liveness confirms its AI/ML posting is live today. Live hiring is evidence the company is operating; it does NOT prove funding runway to 2027-10-01. Clearance is for sample scoring only: the human report verdict stays "HOLD — runway unverified", never "Apply". Companies that fail liveness or have no posting stay HELD and unscored."
  - Gnanasudharsan Ashokumar, 2026-10-18/20 — closures: staleness 24 months; minimum $5,000,000 (stage not used); runway 24 months; anchors 2027-04-01 / 2027-10-01; AI title keyword list; scorer inputs (sponsorship = Approval_Rate ÷ 100, fit = judgment for the fictional persona).
- **Open issues:**
  - CodaMetrix liveness `uncertain` — "navigation error: page.goto: Download is starting" on the aggregator URL; both supplied URLs are aggregators, not employer postings.
  - Form D data is a 50-per-quarter sample; full quarters, sec.gov download approval, DOL LCA data with SOC + fiscal year, an EDGAR freshness check and a hold-clearing report column remain open.
  - The scorer's own role-scores.md prints "Apply" for the cleared row; only the human report carries HOLD.
  - The report test depends on the repo-relative `data/bls/` path.
  - The pre-fix evidence is a reconstruction; the original pre-fix code was never committed.
  - Manifest check warnings (pre-existing on upstream/main): W1 `archive/` listed under `ignore:` but tracked and not gitignored; W2 `private/` and `data/ats/` flagged as not gitignored — a false positive, since `.gitignore` covers their contents with `/private/*` and `/data/ats/*`.
  - Spec conflict (logged as a defect): the summer Mode Build spec asks for a `mode/` branch, `assignments/submissions/` (absent) and a `logs/RUN_LOG.md` entry; `CONTRIBUTING.md` requires a `contrib/2026fa-…` branch, `course/2026fa/submissions/`, `logs/runs/`, and forbids editing `logs/RUN_LOG.md`. This contribution follows `CONTRIBUTING.md`.
  - Re-cut: this branch was cut fresh from upstream/main so that only the fictional persona's situation appears in tracked files.
