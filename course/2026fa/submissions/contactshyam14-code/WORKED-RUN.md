# Worked run — "network, don't apply" on the shipped sample data, 2026-10-01

## Executive summary

This document records the prototype being run end to end on the repository's own data for one person's situation, with the real terminal output pasted in. Read it to see what the tool actually produced, which parts are checked records and which are the person's own rules or a model's judgment, and what went wrong along the way.

It found 57 companies whose public sponsorship record includes a project- or production-management title. One has a matching job open now (IEX Group, a project-manager role in New York). Four are networking targets: Unqork and Rondo Energy on a confirmed board check, plus Genies and Senti Biosciences, whose job boards Shyam confirmed by eye on 2026-10-02. The other 52 still need their boards checked, including both production-management sponsors. The source table has two problems no existing audit reports, and several things broke during the build and were fixed. One correction came from Shyam after these runs: the date first given as the work permit's end (December 2026) is its start. Run 05 repeats the scored run with the corrected dates, and every company lands in the same group. Shyam then re-ran the tests and the tool himself, spot-checked one company against the raw data, confirmed three job boards, and signed off the sample run (§8).

## Run record

- **Ran by:** Claude (AI), in Shyam's session on 2026-10-01 (local time, EDT). **Shyam re-runs the attestation rows and signs.**
- **Code:** prototype at commit `5462a0c` for run 03 and the 2026-10-01 failure cases; `987f927` for run 05 (corrected OPT dates, 2026-10-02) and the 2026-10-02 failure cases. Runs 01 and 02 came from uncommitted intermediate versions earlier the same evening; their saved output is in `runs/01-first-pass/` and `runs/02-primary-vocab/`.
- **Data:** as shipped at upstream commit `015843d`, sample data only. Full Form D quarters are not in a fresh clone.
- **Machine:** Windows 11, Node v22.12.0, Python 3.12.5 (behind a `python3` shim outside the repository), Git Bash.

## Inputs

| Input | Value | Label |
|---|---|---|
| Persona | "Shyam" (`inputs/persona.shyam.json`): MS Engineering Management; F-1, 12-month OPT, no STEM extension; needs sponsorship. **Runs 01–04** (sha256 `892c0fb8f1ab113f…`): OPT *end* 2026-12-31, unemployment days not supplied. **Run 05** (sha256 `0b2086544864b565…`): OPT *start* 2026-12-31, end 2027-12-30 (assumed: start + 12 months − 1 day), unemployment days used 0 | your-input |
| Targets | 13-1082 keywords: project manager, project management, project coordinator, project administrator; ambiguous: program manager, program management. 11-3051 keywords: production manager, plant manager, manufacturing manager, factory manager, assembly manager. Plus BLS/O*NET titles of each SOC's primary row | your-input (keywords); record (BLS titles) |
| Rules | Proven ≥ 10 approvals and ≥ 90% with an unambiguous match; Likely ≥ 50%; tier → 0.9 / 0.6 / 0.3; hiring lag 45 days (apply), 75 days (network); liveness stale after 7 days; networking tiers Proven and Likely; recent funding within 24 months | your-input |
| As-of date | 2026-10-01 (runs 01–04); 2026-10-02 (run 05) | your-input |
| Liveness | `inputs/liveness.2026-10-01.json` (sha256 `8c6a44522eba276e…`), transcribed from the scanner output below | record (3), model-judgment (2, board unconfirmed), held (1, check failed) |
| 80 Days table | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`, sha256 `eccdee2addf472b1…` (identical to the SHA-256 in the repository's own audit of that file) | record |
| BLS/O*NET | `data/bls/compact/soc_occupation_compact.csv`, sha256 `bac5acf77ca2d252…` | record |
| Form D samples | `data/sec/form-d/processed/sample/companies-sec-{2025q2,2025q3,2025q4,2026q1}-d.sample.json` (200 filings) | record |

## Commands and real output

### 0. The engine's own baseline, and the first trap

In PowerShell, the assignment's own command:

```text
PS> npm run score -- data/examples/ch11-roles.json --out-dir course/2026fa/submissions/contactshyam14-code/runs

> the-reallocation-engine@1.0.0 score
> node scripts/score/role-scorer.mjs data/examples/ch11-roles.json course/2026fa/submissions/contactshyam14-code/runs

✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)
  data\examples\role-scores.json  +  data\examples\role-scores.md
```

npm on PowerShell dropped `--out-dir` (see the echoed command line), so the scorer overwrote the two tracked example files. They were restored with `git checkout -- data/examples/role-scores.json data/examples/role-scores.md`, and from then on the scorer was called directly:

```text
$ node scripts/score/role-scorer.mjs data/examples/ch11-roles.json --out-dir course/2026fa/submissions/contactshyam14-code/runs
✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)
  course\2026fa\submissions\contactshyam14-code\runs\role-scores.json  +  course\2026fa\submissions\contactshyam14-code\runs\role-scores.md
```

(Those two files now live in `runs/00-engine-baseline/`.)

### 1. Run 01 — first pass, no liveness observations, BLS vocabulary from every O*NET row

```text
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-01 --out-dir course/2026fa/submissions/contactshyam14-code/runs/01-first-pass
✓ 65 candidates from 1557 H-1B rows (13-1082: 55, 11-3051: 10)
  network 0 · apply 0 · check-liveness 65 · skip 0
  scorer: not run — no candidate has a usable liveness observation, so there is nothing the scorer can decide
  ! parity: all 1557 approval and denial counts are even — counts probably doubled upstream
  ! identity check needed: CONVEY INC, COVEY INC, LYNDRA THERAPEUTICS INC, LYRA THERAPEUTICS INC, PELOTON INTERACTIVE INC, PELOTON INTERACTIVE LLC, SALESFORCE COM INC, SALESFORCECOM INC
  gate G4 visa-path: awaiting human sign-off
  wrote course/2026fa/submissions/contactshyam14-code/runs/01-first-pass/network-targets.json + network-targets.md + roles.json
exit: 0
```

Ten production-manager matches was far more than predicted, so before trusting it I listed which titles matched and through which vocabulary (a PowerShell one-liner over the run 01 log):

```text
ZERO MOTORCYCLES INC | Lean Manufacturing Manager | phrase='manufacturing manager' | persona keyword [your-input]
CONTINUUS PHARMACEUTICALS INC | Quality Assurance Manager | phrase='Quality Assurance Manager' | BLS/O*NET 11-3051.01 sample alternate title [record]
PELOTON INTERACTIVE INC | Senior Software Quality Assurance Manager | phrase='Quality Assurance Manager' | BLS/O*NET 11-3051.01 sample alternate title [record]
PELOTON INTERACTIVE LLC | Senior Software Quality Assurance Manager | phrase='Quality Assurance Manager' | BLS/O*NET 11-3051.01 sample alternate title [record]
INFRARED5 INC | Quality Assurance Manager | phrase='Quality Assurance Manager' | BLS/O*NET 11-3051.01 sample alternate title [record]
AURORA SOLAR INC | Quality Assurance Manager | phrase='Quality Assurance Manager' | BLS/O*NET 11-3051.01 sample alternate title [record]
PALADIN TECHNOLOGIES INC | Quality Assurance Manager | phrase='Quality Assurance Manager' | BLS/O*NET 11-3051.01 sample alternate title [record]
ENDOTRONIX INC | Supply Chain and Production Manager | phrase='production manager' | persona keyword [your-input]
ATHEER INC | QA Manager | phrase='QA Manager' | BLS/O*NET 11-3051.01 sample alternate title [record]
AUGUST HOME INC | Quality Assurance Manager | phrase='Quality Assurance Manager' | BLS/O*NET 11-3051.01 sample alternate title [record]
```

Eight of the ten came from O*NET 11-3051.01 (Quality Control Systems Managers), whose sample alternate titles include "Quality Assurance Manager". At software companies that title is software QA. A vocabulary that came from a record did not make the match right.

### 2. Run 02 — BLS vocabulary limited to each SOC's primary (`.00`) O*NET row

```text
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-01 --out-dir course/2026fa/submissions/contactshyam14-code/runs/02-primary-vocab
✓ 57 candidates from 1557 H-1B rows (13-1082: 55, 11-3051: 2)
  network 0 · apply 0 · check-liveness 57 · skip 0
  scorer: not run — no candidate has a usable liveness observation, so there is nothing the scorer can decide
  ! parity: all 1557 approval and denial counts are even — counts probably doubled upstream
  ! identity check needed: CONVEY INC, COVEY INC, LYNDRA THERAPEUTICS INC, LYRA THERAPEUTICS INC, SALESFORCE COM INC, SALESFORCECOM INC
  gate G4 visa-path: awaiting human sign-off
  wrote course/2026fa/submissions/contactshyam14-code/runs/02-primary-vocab/network-targets.json + network-targets.md + roles.json
exit: 0
```

The production-manager list is now Zero Motorcycles ("Lean Manufacturing Manager", Proven) and Endotronix ("Supply Chain and Production Manager", Likely). Of the 57 candidates, 15 are Proven and 42 Likely; run 01's 18 Proven included three of the QA companies. The project-management side is unchanged by the fix: of 57 title-match rows for 13-1082, 28 come from the ambiguous "program manager" keyword, and 27 companies match on nothing else (counts re-read from the saved run logs).

### 3. Liveness evidence — which boards exist, then the repository's scanner

Which board belongs to which company is a judgment, so it was probed first (`evidence/board-probe.mjs`, run by Claude as research, not part of the prototype). The probe tried 33 company × provider guesses; 28 returned HTTP 404. These five boards answered:

```text
UNQORK INC | greenhouse/unqork | OK board="Unqork" jobs=1 matching=0
GENIES INC | ashby/genies | OK board="" jobs=1 matching=0
RONDO ENERGY INC | greenhouse/rondoenergy | OK board="Rondo Energy" jobs=16 matching=0
SENTI BIOSCIENCES INC | lever/sentibio | OK board="" jobs=0 matching=0
IEX GROUP INC | greenhouse/iex | OK board="IEX Group" jobs=10 matching=1 → Project Manager
```

Greenhouse returns the board's name; Lever and Ashby don't. So Genies' and Senti's boards are unconfirmed. Then the repository's own scanner ran on those five boards plus a deliberately unconfirmed guess for Zero Motorcycles:

```text
$ REALLOCATION_ENGINE_PORTALS=scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/portals.network-targets.yml node scripts/ats/scan.mjs --dry-run
Scanning 6 companies via providers (0 local parser; 0 skipped — no provider matched)
(dry run — no files will be written)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Portal Scan — 2026-10-02
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Companies scanned:     6
Total jobs found:      28
Filtered by title:     27 removed
Filtered by location:  0 removed
Duplicates:            0 skipped
New offers added:      1

Errors (1):
  ✗ Zero Motorcycles: HTTP 404: {"status":404,"error":"Job not found"}

New offers:
  + IEX Group | Project Manager  | New York

(dry run — run without --dry-run to save results)

Review new offers in data/ats/pipeline.md.
```

The banner says 2026-10-02 because the scanner prints the UTC date. The local time was 22:57 EDT on 2026-10-01. The observations record the local date. The prototype holds any observation dated after the as-of date, so recording the banner's date would have held every company. The scanner's total of 28 jobs equals the probe's 10 + 1 + 16 + 1 + 0.

### 4. Run 03 — scored

```text
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-01 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-01.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/03-scored
✓ 57 candidates from 1557 H-1B rows (13-1082: 55, 11-3051: 2)
  network 4 · apply 1 · check-liveness 52 · skip 0
  scorer: ✓ scored 5 roles → Apply 1 · Consider 0 · Skip 4 (skip 80%)
  ! parity: all 1557 approval and denial counts are even — counts probably doubled upstream
  ! identity check needed: CONVEY INC, COVEY INC, LYNDRA THERAPEUTICS INC, LYRA THERAPEUTICS INC, SALESFORCE COM INC, SALESFORCECOM INC
  gate G4 visa-path: awaiting human sign-off
  wrote course/2026fa/submissions/contactshyam14-code/runs/03-scored/network-targets.json + network-targets.md + roles.json + role-scores.json/.md
```

The scorer's own report (`runs/03-scored/role-scores.md`, written by `scripts/score/role-scorer.mjs`):

```text
| Role | Composite | Rec | Why | Audit (term · value · weight · source) |
|---|---|---|---|---|
| IEX GROUP INC — Project Manager (sponsored title per 80 Days CSV) | 0.315 | **Apply** | composite 0.315 ≥ 0.3, gates healthy | sponsorship 0.9·0.35 [your-input] × liveness 1[record]×timeline 1[your-input] |
| GENIES INC — Project Manager (sponsored title per 80 Days CSV) | 0.000 | **Skip** | gated: liveness ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.9·0.35 [your-input] × liveness 0[model-judgment]×timeline 1[your-input] |
| RONDO ENERGY INC — Senior Construction Project Manager (sponsored title per 80 Days CSV) | 0.000 | **Skip** | gated: liveness ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.6·0.35 [your-input] × liveness 0[record]×timeline 1[your-input] |
| SENTI BIOSCIENCES INC — R&D Project Manager (sponsored title per 80 Days CSV) | 0.000 | **Skip** | gated: liveness ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.6·0.35 [your-input] × liveness 0[model-judgment]×timeline 1[your-input] |
| UNQORK INC — Project Manager (sponsored title per 80 Days CSV) | 0.000 | **Skip** | gated: liveness ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.9·0.35 [your-input] × liveness 0[record]×timeline 1[your-input] |
```

The prototype's sort of those verdicts (`runs/03-scored/network-targets.md`):

```text
## Network first — sponsors with nothing matching open
| Company | Sponsored title(s) that matched [record] | SOC [your-input inference] | Tier [your-input rule] | Approvals / rate [record] | Latest funding [record] | Form D sample [record] | Liveness [label] | Flag |
|---|---|---|---|---|---|---|---|---|
| GENIES INC | Project Manager | 13-1082 | Proven | 22 / 100.0% | 2021-04-16 | not in shipped sample | no-matching-open [model-judgment] | ⚠ confirm board |
| UNQORK INC | Project Manager | 13-1082 | Proven | 38 / 100.0% | 2020-09-18 | not in shipped sample | no-matching-open [record] |  |
| SENTI BIOSCIENCES INC | R&D Project Manager | 13-1082 | Likely | 4 / 100.0% | 2024-12-09 (recent) | not in shipped sample | no-matching-open [model-judgment] | ⚠ confirm board |
| RONDO ENERGY INC | Senior Construction Project Manager | 13-1082 | Likely | 2 / 100.0% | 2022-01-04 | not in shipped sample | no-matching-open [record] |  |

## Apply — a matching job is open
| IEX GROUP INC | Project Manager | 13-1082 | Proven | 14 / 100.0% | 2014-08-22 | not in shipped sample | matching-open [record] |  |
- IEX GROUP INC: scorer says **Apply** — composite 0.315 ≥ 0.3, gates healthy; postings: Project Manager (New York)
```

Zero Motorcycles, whose board check failed, is in the held group: `result "unchecked" is not a usable liveness result`. It was not marked as having nothing open.

### 5. Failure cases on the real data (`evidence/failure-cases-2026-10-01.txt`)

These ran with the earlier persona, whose "OPT end" of 2026-12-31 was really the start; F1 was re-run with the corrected dates in §7.

```text
### F1 OPT end already past (as-of after 2026-12-31)
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2027-01-15 --out-dir course/2026fa/submissions/contactshyam14-code/runs/f1
STOP (G1): OPT end date 2026-12-31 is on or before the as-of date — refusing to score a window that has already closed
Nothing was written.
exit: 3
output dir exists afterwards: no

### F2 SOC code with no row (13-1082 mistyped as 13-1028)
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-01 --persona scripts/contrib/2026fa/contactshyam14-code-em-network-targets/fixtures/break-persona-bad-soc.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/f2
STOP (G1): SOC code 13-1028 has no row in data/bls/compact/soc_occupation_compact.csv — refusing to guess a title list for it
Nothing was written.
exit: 3
output dir exists afterwards: no

### F6 CSV missing a required column (Approval_Rate renamed)
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-01 --csv scripts/contrib/2026fa/contactshyam14-code-em-network-targets/fixtures/break-companies-missing-column.csv --out-dir course/2026fa/submissions/contactshyam14-code/runs/f6
STOP (G1): company CSV lacks required column(s) "Approval_Rate": scripts/contrib/2026fa/contactshyam14-code-em-network-targets/fixtures/break-companies-missing-column.csv
Nothing was written.
exit: 3
output dir exists afterwards: no

### Out-dir outside the contribution (would overwrite tracked examples)
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-01 --out-dir data/examples/should-refuse
STOP (usage): --out-dir data/examples/should-refuse is outside this contribution's folders; refusing to write there
Nothing was written.
exit: 2
output dir exists afterwards: no

### F3 liveness observations that match no candidate (real CSV)
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-01 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/fixtures/break-liveness-unmatched.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/04-break-unmatched
✓ 57 candidates from 1557 H-1B rows (13-1082: 55, 11-3051: 2)
  network 0 · apply 0 · check-liveness 57 · skip 0
  scorer: not run — no candidate has a usable liveness observation, so there is nothing the scorer can decide
  ! parity: all 1557 approval and denial counts are even — counts probably doubled upstream
  ! identity check needed: CONVEY INC, COVEY INC, LYNDRA THERAPEUTICS INC, LYRA THERAPEUTICS INC, SALESFORCE COM INC, SALESFORCECOM INC
  ! liveness observations with no candidate: Quillfeather Assembly Works (not in the company CSV); 1LIFE HEALTHCARE INC (in the CSV but not a candidate (no H-1B record or no matching title))
  gate G4 visa-path: awaiting human sign-off
  wrote course/2026fa/submissions/contactshyam14-code/runs/04-break-unmatched/network-targets.json + network-targets.md + roles.json
exit: 0
output dir exists afterwards: yes
```

Two other failure cases appear elsewhere. F4 (a board check fails) is Zero Motorcycles in run 03. F5 (no Form D record) is every candidate: 0 of 57 matched the 200-filing sample.

### 6. Prediction 3, tested directly (`evidence/prediction-3-empty-scorer-2026-10-01.txt`)

```text
$ node scripts/score/role-scorer.mjs <empty roles.json> --out-dir <tmp>
✓ scored 0 roles → Apply 0 · Consider 0 · Skip 0 (skip NaN%)
exit: 0
--- role-scores.md summary line:
**Summary:** 0 roles → Apply 0 · Consider 0 · Skip 0. **Skip rate NaN%** (below the ~50% a healthy run skips; check the inputs).
```

### 7. Correction — the OPT dates (run 05)

After runs 01–04, Shyam corrected the persona: **December 2026 is his OPT start date, not the end.** The persona now has `opt_start_date` 2026-12-31 and `opt_end_date` 2027-12-30. The end is an assumption, start + 12 months − 1 day, until the EAD's "Card Expires" date is known. `unemployment_days_used` is 0, because OPT hasn't started. The prototype now counts the 90-day unemployment allowance from the OPT start, and says so in the report.

```text
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-02 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-01.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/05-corrected-opt-dates
✓ 57 candidates from 1557 H-1B rows (13-1082: 55, 11-3051: 2)
  network 4 · apply 1 · check-liveness 52 · skip 0
  scorer: ✓ scored 5 roles → Apply 1 · Consider 0 · Skip 4 (skip 80%)
  OPT window: 2026-12-31 → 2027-12-30 (starts in 90 days); 180 days available; timeline factor apply 1, network 1
  ! parity: all 1557 approval and denial counts are even — counts probably doubled upstream
  ! identity check needed: CONVEY INC, COVEY INC, LYNDRA THERAPEUTICS INC, LYRA THERAPEUTICS INC, SALESFORCE COM INC, SALESFORCECOM INC
  gate G4 visa-path: awaiting human sign-off
  wrote course/2026fa/submissions/contactshyam14-code/runs/05-corrected-opt-dates/network-targets.json + network-targets.md + roles.json + role-scores.json/.md
```

The 180 days available are 90 days until the OPT starts plus the 90-day unemployment allowance. The timeline factor is min(1, 180 ÷ 45) = 1 for applying and min(1, 180 ÷ 75) = 1 for networking. In run 03 it was min(1, 91 ÷ 45) = 1, so the gate was open in both runs. A script check confirmed that **all 57 companies have the same group and tier as in run 03**. What changed is how the report describes the situation:

```text
It is for a master's graduate in engineering management on a twelve-month work permit that runs from 2026-12-31 to 2027-12-30 and has not started yet, so no job can begin before 2026-12-31.
- **Visa-path sign-off — awaiting human sign-off.** OPT runs 2026-12-31 to 2027-12-30 with no STEM extension claimed. Before tailoring any application, a DSO or immigration attorney must confirm which H-1B registration cycle(s) fall inside that window, what happens if a registration is not selected, and whether STEM eligibility of the degree, a cap-exempt employer, or another status changes that. This tool cannot answer that.
```

F1 had to move with the dates. A window that has closed is now any as-of date after 2027-12-30 (`evidence/failure-cases-2026-10-02.txt`):

```text
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2028-01-15 --out-dir course/2026fa/submissions/contactshyam14-code/runs/f1
STOP (G1): OPT end date 2027-12-30 is on or before the as-of date — refusing to score a window that has already closed
Nothing was written.
exit: 3
output dir exists afterwards: no
```

The CSV cross-check on run 05: 30 of 30 values match (`evidence/cross-check-2026-10-02.txt`).

### 8. Shyam's own check and sign-off (run 06), then run 07

On 2026-10-02 Shyam ran the checks himself, in his own terminal:
- **Tests:** 20 of 20 passed at the time (`c0bceb8`).
- **The tool, into his own folder:** `--as-of 2026-10-02 --liveness …/inputs/liveness.2026-10-01.json --out-dir …/runs/06-shyam-check`. It reported the same 57 candidates and the same 4 · 1 · 52 · 0 split.
- **The report:** he read his run's report (the dates, the counts, and the three warnings).
- **Spot-check:** he printed IEX Group's raw-data line (`2014-08-22 | 14.0 | 0.0 | 100.0 | 180000.0 | ['Project Manager']`) and matched it against the report's row.
- **Job boards:** he opened the IEX, Genies and Senti boards in his browser. The IEX "Project Manager" job is listed, and the Genies and Senti boards belong to those companies.

He signed off the sample run ("sign"), and his board confirmations went into `inputs/liveness.2026-10-02.json`. Run 07 uses that file:

```text
$ node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-02 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-02.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/07-shyam-confirmed
✓ 57 candidates from 1557 H-1B rows (13-1082: 55, 11-3051: 2)
  network 4 · apply 1 · check-liveness 52 · skip 0
  scorer: ✓ scored 5 roles → Apply 1 · Consider 0 · Skip 4 (skip 80%)
  OPT window: 2026-12-31 → 2027-12-30 (starts in 90 days); 180 days available; timeline factor apply 1, network 1
  ! parity: all 1557 approval and denial counts are even — counts probably doubled upstream
  ! identity check needed: CONVEY INC, COVEY INC, LYNDRA THERAPEUTICS INC, LYRA THERAPEUTICS INC, SALESFORCE COM INC, SALESFORCECOM INC
  gate G4 visa-path: awaiting human sign-off
  wrote course/2026fa/submissions/contactshyam14-code/runs/07-shyam-confirmed/network-targets.json + network-targets.md + roles.json + role-scores.json/.md
```

The networking table now reads:

```text
| GENIES INC | Project Manager | 13-1082 | Proven | 22 / 100.0% | 2021-04-16 | not in shipped sample | no-matching-open [your-input] |  |
| UNQORK INC | Project Manager | 13-1082 | Proven | 38 / 100.0% | 2020-09-18 | not in shipped sample | no-matching-open [record] |  |
| SENTI BIOSCIENCES INC | R&D Project Manager | 13-1082 | Likely | 4 / 100.0% | 2024-12-09 (recent) | not in shipped sample | no-matching-open [your-input] |  |
| RONDO ENERGY INC | Senior Construction Project Manager | 13-1082 | Likely | 2 / 100.0% | 2022-01-04 | not in shipped sample | no-matching-open [record] |  |
```

Genies and Senti moved from model-judgment to **your-input**, a person's check, and the "confirm board" flags are gone. No company changed group or tier (checked by script against run 05). The visa-path gate (G4) is still unsigned: that is a question for the DSO, and the sign-off above covers the sample run, not the visa path.

## Verified vs. inferred — line by line

**IEX GROUP INC (apply)**

| Term | Value | Label | Why that label |
|---|---|---|---|
| Company name | IEX GROUP INC | record | 80 Days table, line 12869 |
| Sponsored titles | ['Project Manager'] | record | same row |
| Approvals / denials / rate | 14 / 0 / 100% | record | same row. Every count in the file is even, so 14 may be 7. The rate is unaffected |
| Median sponsored salary | 180,000 | record | same row, but company-wide across all roles, not this occupation |
| Latest funding | 2014-08-22, Series C, $75M | record | same row. The stage is an upstream estimate, and whether the filing belongs to this company is not verified |
| Website | iexgroup.com | record of a guess | the upstream pipeline infers domains from names. It was not used to find the board |
| Form D sample | not in shipped sample | record | about the 200-filing sample, not about the company |
| SOC | 13-1082 | your-input | the keyword "project manager" matched. The table records titles, not filed SOC codes |
| Tier | Proven | your-input | the persona's rule applied to record values |
| Sponsorship number for the scorer | 0.9 | your-input | the persona's tier-to-number mapping. No record produces a probability |
| Liveness | 1: "Project Manager", New York | record | the repository scanner's output is saved, and Greenhouse names the board "IEX Group" |
| Timeline | 1.0 = min(1, 91 ÷ 45) in run 03; min(1, 180 ÷ 45) in run 05 | your-input | OPT dates, as-of date and hiring lag are the person's |
| Decision | Apply, composite 0.315 | your-input (computed) | the repository scorer's arithmetic on the terms above. A calculation, not evidence |
| Fit | — | not assessed | the vote is left empty, not guessed |

**GENIES INC (network, liveness unconfirmed)** — everything as above, except:

| Term | Value | Label | Why |
|---|---|---|---|
| Sponsored titles | Avatar Modeler; Machine Learning Engineer / AI Scientist; Project Manager; Senior Concept Artist | record | line 10901. "Project Manager" is one of four titles |
| Liveness | 0: board fetched, no matching title | **model-judgment** | the scan is a record of the Ashby board `genies`. That this board is Genies Inc's was my guess, because Ashby returns no board name. **Shyam opened the board on 2026-10-02 and confirmed it is Genies'; in run 07 this reads your-input** |

**The other three scored companies**

| Company | Bucket | Liveness label | Main inference to keep in mind |
|---|---|---|---|
| UNQORK INC | network | record (Greenhouse board "Unqork") | "Project Manager" is one of five titles at a software company. The filed SOC may not be 13-1082 |
| RONDO ENERGY INC | network | record (Greenhouse board "Rondo Energy") | Likely: only 2 approvals, so possibly 1. The title is construction project management |
| SENTI BIOSCIENCES INC | network | model-judgment in runs 03/05 (Lever returns no board name; the board had 0 jobs); your-input in run 07 after Shyam confirmed the board | an empty board may mean a hiring freeze; the networking value is uncertain |

No value in the run is labelled model-judgment except those two liveness readings. No language model was called by the prototype.

## Verification — how the output was checked

1. **Independent cross-check against the CSV.** Python's `csv` module, which is not the prototype's parser, re-read the five scored companies (`evidence/cross-check.py`, output in `evidence/cross-check-2026-10-01.txt`). 30 of 30 checks matched (approvals, denials, rate, funding date, title present, CSV line number). For example:

   ```text
   IEX GROUP INC  (csv line 12869; titles: ['Project Manager'])
      OK  approvals: csv=14.0 prototype=14
      OK  denials: csv=0.0 prototype=0
      OK  approval_rate: csv=100.0 prototype=100
      OK  latest_funding_date: csv='2014-08-22' prototype='2014-08-22'
      OK  matched title in CSV list: csv=True prototype=True
      OK  csv line number: csv=12869 prototype=12869
   ```

2. **Provenance of the table.** Its SHA-256 equals the one recorded in the repository's 2026-05-28 audit of the same file, so the counts here are the audited file's counts.
3. **Tests.** 21 offline tests pass (`node --test …/network-targets.test.mjs`). One pins the scorer's missing-gate default.
4. **Deliberate breaks (mutations), run against the 16-test suite of the time** (`evidence/mutation-tests-2026-10-01.txt`). Each one was caught:
   - M1, treat a missing check as open: 3 tests failed.
   - M2, label the tier "record": 1 test failed.
   - M3, disable the output-folder guard: 1 test failed.
5. **Clean checkout.** In a fresh worktree of commit `a309e8c`, after `npm ci`, the tests passed, and the documented command reproduced run 03 except the `generated_at` timestamp.
6. **Consistency between tools.** The scanner's 28 jobs equal the probe's per-board counts.

## Reflection

*(Drafted by Claude from what happened. Shyam's own reflection, in his words, is in FRICTIONAL under "in my own words".)*

**What worked.**
- Keeping liveness as an explicit gate that holds a company, never defaulting it. That was the single most important choice: the scorer would otherwise have scored all 57 companies as having an open role.
- Checking surprising numbers before believing them. That is how the all-even counts, the shared records, and the QA false positives were found.

**What the prototype or recipe got wrong, or missed.**
- **The first pass trusted a record vocabulary too far.** Run 01 counted 8 software-QA jobs as production management.
- **The tier explanations named the wrong failed condition.** Run 03's first report said "approvals 12 or rate 85.7%" when only the rate failed.
- **The mutation harness itself wrote into `data/examples/`** while the guard was off. Mutation runs belong in a disposable checkout.
- **The recipe's G4 test could never have passed.** Its `grep` didn't allow for the bold markers in the run-log line.
- **One of my own break-test inputs named a company that is actually in the CSV.** Caught only because I grepped the real file first.
- **Not covered:** both production-management sponsors (Zero Motorcycles, Endotronix) have no board the scanner can read, so the companies most relevant to an engineering-management graduate are still held, and 52 of 57 candidates are unchecked.

- **The date everything rested on was wrong.** "OPT ends December 2026" was taken at face value, and both dates on the EAD card were never asked for. Shyam's correction (it's the start) reversed the H-1B timing story, though not a single bucket. No check in the tool could catch it, because a wrong but plausible date passes every test. The gate is the person reading the report.

**Predictions vs. outcome.**
- **Prediction 1** (program-manager titles dominate): confirmed. 27 companies match only on "program manager"; ForgeRock's "Computer Systems Analyst (Senior IT Project Manager)" is counted as Proven project management.
- **Prediction 2** (production list three or fewer): wrong on the first pass (10), right after the fix (2).
- **Prediction 3** (the scorer prints NaN on zero roles): confirmed.
- **Prediction 4** (the funding ranking will be partly wrong): not tested on this small scored set.

**One concrete next improvement.** Parse the scanner's output straight into the liveness file, and have the scanner print a per-company job count (recipe proposed addition 4). The worked run currently depends on a hand transcription, and "board fetched, nothing matching" is inferred from a company's absence in the error list.

## Attestation

- Recipe: em-network-targets v0.1.0
- By: **Shyam Gopalakrishnan · 2026-10-02.** He re-ran the tests and the tool himself (run 06), read the report, spot-checked IEX Group against the raw data, and confirmed three job boards in his browser (rows marked *Shyam*). The other rows were run by Claude (AI) in his session; Shyam reviewed them.

### Tested

| Ran | Saw | Expected |
|---|---|---|
| *Shyam:* `node --test …/network-targets.test.mjs` (at `c0bceb8`) | 20 pass, 0 fail | all pass |
| *Shyam:* the tool into `runs/06-shyam-check` | 57 candidates; network 4 · apply 1 · check-liveness 52 · skip 0 | the same as Claude's run 05 |
| *Shyam:* IEX Group's raw-data line (last six columns) | `2014-08-22 \| 14.0 \| 0.0 \| 100.0 \| 180000.0 \| ['Project Manager']`, matching the report | match |
| *Shyam:* opened the IEX, Genies and Senti job boards | the IEX "Project Manager" job is listed; the Genies and Senti boards are those companies' | scan confirmed; two boards confirmed |
| `node --test scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.test.mjs` | 20 pass, 0 fail | all pass, offline |
| The Canvas ZIP, unzipped into the temp folder, tests run inside it | first ZIP: 18 of 19 — the output-folder guard let a repo under %TEMP% write into its own `data/examples/` | all pass from any location |
| Run 05 command (§7) with the corrected OPT dates | same 57 candidates, same groups and tiers as run 03; OPT window 2026-12-31 → 2027-12-30, starts in 90 days; 180 days available | buckets unchanged; window described correctly |
| Run 03 command (above) | 57 candidates; network 4, apply 1, check-liveness 52, skip 0; scorer Apply 1, Skip 4 (80%) | at least half skipped; no company scored without a liveness factor |
| `scan.mjs --dry-run` on 6 boards | 28 jobs, 1 matching (IEX Group), 1 error (Zero Motorcycles 404) | errors reported, not hidden |
| `python …/cross-check.py <csv> <run 03 log>` | 30 OK, 0 MISMATCH | every value equals the CSV |
| **Break:** `--as-of 2028-01-15` (after the corrected OPT end) | `STOP (G1): OPT end date 2027-12-30 is on or before the as-of date`, exit 3, no folder | refuse; write nothing |
| **Break:** OPT start not before the OPT end (test) | `STOP (G1)`, exit 3, no folder | refuse; write nothing |
| **Break:** SOC 13-1082 typed as 13-1028 | `STOP (G1)` naming 13-1028, exit 3 | refuse; write nothing |
| **Break:** `Approval_Rate` column renamed | `STOP (G1)`, exit 3 | refuse; write nothing |
| **Break:** `--out-dir data/examples/should-refuse` | exit 2, no folder | refuse; never touch tracked files |
| **Break:** observations for a company not in the CSV, and for a non-candidate | both listed as unmatched; no candidate invented | reported, nothing invented |
| **Break:** wrong board slug (Zero Motorcycles) | held as unchecked | held, not "nothing open" |
| **Break:** mutations M1 / M2 / M3 | 3 / 1 / 1 tests fail | each caught |
| **Break:** the scorer on 0 roles | `skip NaN%` | NaN, as predicted |

### Did not test

- The real OPT end date. 2027-12-30 is assumed (start + 12 months − 1 day) until the EAD's "Card Expires" date is entered.

- A live run with a person clearing every gate (that would be RUNNABLE-LIVE).
- Boards on Workday, iCIMS, Taleo or SuccessFactors, which most large employers use. The scanner has no provider for them.
- `scripts/ats/check-liveness.mjs` (Playwright) on a posting URL. Chromium is not installed, and no posting URL was captured.
- That the Genies (Ashby) and Senti (Lever) boards belong to those companies *by any record*. Shyam confirmed them by eye on 2026-10-02, which is your-input.
- Whether the IEX Group posting fits the persona, or whether IEX sponsors for it now.
- The apparent doubling of counts against USCIS data.
- A positive Form D match on real data (only the fixture has one).
- The 90-day unemployment-limit path on real data (the persona leaves it null; only the code path exists).
- macOS or Linux. Everything ran on Windows, and CI runs on Linux.
- Any visa-path question (gate G4). That is not something this tool can test.

### Broke during testing, fixed

- **The output-folder guard failed when the repository itself was unzipped into the temp folder.** Inside the repo, only the namespaces are allowed now; a regression test fails on the old rule and passes on the new one.

- **The persona's OPT date was the start, not the end** (Shyam's correction, 2026-10-02). The persona now has both dates, and the prototype counts the unemployment allowance from the start and describes the window. 2 tests added; run 05 and the failure cases were re-run (`987f927`).

- **QA titles counted as production management (run 01).** BLS vocabulary is now limited to the primary O*NET row; the persona's `bls_title_rows` can switch it back (`network-targets.mjs`, `loadSocVocab`).
- **Tier explanation blamed the wrong condition.** It now names only the failed one, with a test (`a0feadb`).
- **Mutation M3 left five files in `data/examples/`.** They were moved out of the repo; the out-dir test (then numbered 14) now uses a unique folder and cleans up (`a309e8c`).
- **The out-dir refusal printed an absolute path containing the Windows username.** It now prints a repo-relative path (`a0feadb`).
- **The recipe's G4 `grep` could not match the bold run-log line.** The pattern was fixed and self-tested against "signed" and "not signed".
- **A break input named a fixture-only company and one that was in the real CSV.** Corrected after grepping the real file.
- **Environment, outside the repo:**
  - `python3` was the Microsoft Store stub; fixed with a shim.
  - CRLF line endings made doctor report 0/33 recipes with frontmatter and made verify fail E3; fixed with an LF checkout.
  - npm on PowerShell dropped `--out-dir`; fixed by calling `node` directly.
