# Worked Run — SWE STEM-OPT Runway

## Executive summary

This is the record of running the job-search prototype on three sample postings, with the real terminal output pasted in. One posting is from a company that really is in the repository's sponsorship file, one is from an invented company, and one has a link that isn't on a job-application platform. The prototype found the real company's sponsorship record, marked the invented company "not found" instead of guessing, and skipped the unreadable link. The run also exposed a weakness: the invented company still got **Apply**, carried only by a score the student typed in. Every value below is marked as a record, a model's judgment, or the student's own input, and the last section lists what was not tested.

## Run record

| Field | Value |
|---|---|
| Recipe | `recipes/cases/2026fa/tisaac-swe-stem-opt.md` v0.2.0, status DRAFT |
| Prototype | `scripts/contrib/2026fa/tisaac-swe-stem-opt/` |
| Date | 2026-10-21 |
| Environment | macOS 27.0.1 · Node v24.13.0 · Python 3.11.10 |
| Data | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (shipped file, 30,369 rows) |
| Network | none |

## Inputs

Fictional persona: F-1 STEM Information Systems student, 3-year OPT runway, targeting SWE. No real résumé or tracker was read. Fixture `scripts/contrib/2026fa/tisaac-swe-stem-opt/fixture.json`:

| id | company | url | fit | timeline | Tests |
|---|---|---|---|---|---|
| `job-1-real` | 1LIFE HEALTHCARE INC | `https://boards.greenhouse.io/1life/jobs/111` | 1.0 | 1.0 | a company that is in the CSV |
| `job-2-fake` | Isaac Super Fake Tech LLC | `https://boards.greenhouse.io/fake/jobs/222` | 1.0 | 1.0 | failure case 1: company missing from the CSV |
| `job-3-bad-url` | Non-ATS Startup | `https://isaac-portfolio.com/jobs` | 1.0 | 1.0 | failure case 2: non-ATS URL |

The URLs are invented; none was opened.

## Commands and real output

```
$ node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js
🚀 Starting SWE STEM-OPT Prototype...
Loaded 3 test jobs from scripts/contrib/2026fa/tisaac-swe-stem-opt/fixture.json.
[WARNING] Job job-3-bad-url triggered a Parsing Exception! (-1 Error: not a supported ATS URL)
[no-matched] Not found in the 80-days CSV (sponsorship 0, labeled your-input): Isaac Super Fake Tech LLC, Non-ATS Startup
✅ Saved evidence tagged output to scripts/contrib/2026fa/tisaac-swe-stem-opt/my-roles.json
⚙️ Calling role-scorer.mjs...
✓ scored 3 roles → Apply 2 · Consider 0 · Skip 1 (skip 33%)
  scripts/contrib/2026fa/tisaac-swe-stem-opt/role-scores.json  +  scripts/contrib/2026fa/tisaac-swe-stem-opt/role-scores.md
🎉 Run complete!
[exit 0]
```

```
$ cat scripts/contrib/2026fa/tisaac-swe-stem-opt/role-scores.md
# Role Scorer report — 2026-10-21

*Bayesian Role Scorer (Ch.11). Weights: sponsorship 0.35, fit 0.3, role_quality 0 [role_quality weight is **[VERIFY]** — not pinned by the chapter]. Threshold 0.3. Profile requires sponsorship.*

**Summary:** 3 roles → Apply 2 · Consider 0 · Skip 1. **Skip rate 33%** (below the ~50% a healthy run skips; check the inputs).

| Role | Composite | Rec | Why | Audit (term · value · weight · source) |
|---|---|---|---|---|
| 1LIFE HEALTHCARE INC — Software Engineer | 0.580 | **Apply** | composite 0.580 ≥ 0.3, gates healthy | sponsorship 0.8·0.35 [record]; fit 1·0.3 [your-input] × liveness 1[your-input]×timeline 1[your-input] |
| Isaac Super Fake Tech LLC — Software Engineer | 0.300 | **Apply** | composite 0.300 ≥ 0.3, gates healthy | sponsorship 0·0.35 [your-input]; fit 1·0.3 [your-input] × liveness 1[your-input]×timeline 1[your-input] |
| Non-ATS Startup — Software Engineer | -0.300 | **Skip** | gated: liveness ≈ -1.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0·0.35 [your-input]; fit 1·0.3 [your-input] × liveness -1[your-input]×timeline 1[your-input] |

*Every term traces to its source. If you cannot explain a row term-by-term, distrust the recommendation before your confusion (Ch.11).*
[exit 0]
```

```
$ node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.test.mjs
SWE STEM-OPT prototype — offline test
  ✓ writes both outputs (JSON log + Markdown report) into --out-dir
  ✓ every evidence term carries one of the three allowed source labels
  ✓ real company: sponsorship is a record, and the CSV row really has H-1B approvals
  ✓ failure case 1 — company missing from the CSV: p 0, tier no-matched, never labeled record
  ✓ failure case 2 — non-ATS URL: liveness -1, scorer Skips it as gated
  ✓ offline liveness is never presented as a record
  ✓ fit and timeline come from the fixture, not from numbers in the code
  ✓ fails clearly, without inventing a value, when a job is missing fit
  ✓ prototype source makes no network calls

9 passed, 0 failed
[exit 0]
```

## Verified vs. inferred

| Role | Term | Value | Label | Where it came from |
|---|---|---|---|---|
| job-1-real | sponsorship | 0.8, tier `h1b-history` | `record` | CSV row: `Total Approvals` = 2.0 (> 0). The 0.8 itself is the student's mapping, not in the record (recipe A6, open) |
| job-1-real | fit | 1.0 | `your-input` | fixture |
| job-1-real | liveness | 1.0 | `your-input` | assumed — the URL is on `greenhouse.io` but was never opened |
| job-1-real | timeline | 1.0 | `your-input` | fixture |
| job-2-fake | sponsorship | 0, tier `no-matched` | `your-input` | not in the CSV; 0 is the student's "missing is not a deduction" rule |
| job-2-fake | fit / liveness / timeline | 1.0 / 1.0 / 1.0 | `your-input` | fixture / assumed / fixture |
| job-3-bad-url | sponsorship | 0, tier `no-matched` | `your-input` | not in the CSV |
| job-3-bad-url | liveness | −1 | `your-input` | prototype rule: URL is not on a supported ATS domain |
| job-3-bad-url | fit / timeline | 1.0 / 1.0 | `your-input` | fixture |
| all | composite, recommendation | see report | — | scorer arithmetic over the terms above (`role-scores.json` → `trace.arithmetic`) |

**Nothing in this run is `model-judgment`:** no model was called. **One value is a record:** job-1-real's sponsorship. Every Apply in this run therefore rests on at least two of the student's own assumptions (fit, liveness) that only the human gates can confirm.

## Verification

1. **Checked the CSV by hand.** The prototype says 1LIFE HEALTHCARE INC has H-1B approvals. I looked up that row myself:

   ```
   $ python3 -c "import csv; r=[x for x in csv.DictReader(open('data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv')) if x['company_name'].strip().upper()=='1LIFE HEALTHCARE INC']; print(len(r), [(x['company_name'], x['Total Approvals'], x['total_funding']) for x in r])"
   1 [('1LIFE HEALTHCARE INC', '2.0', '290499961.0')]
   ```

   One row, `Total Approvals = 2.0`. So the prototype was right to give it sponsorship 0.8 as a `record`.
   My first try used `cut -d,`, which printed people's names instead of numbers: some fields (like the list of executives) contain commas inside quotes, so `cut` split the row in the wrong places. I redid it with Python's `csv` module, which handles quotes.
2. **Checked that the prototype reads the CSV correctly.** It has its own small CSV reader, so I compared it with Python's: both read 30,369 rows, and none of the prototype's rows was split wrong. I also confirmed the two invented companies are really not in the file.
3. **Ran the test.** 9 of 9 passed.
4. **Broke the code on purpose** to prove the test is not too loose:
   - I made liveness claim `record` again (the exact mistake of the first submission) → the test failed.
   - I removed the check that stops the run when `fit` is missing → the test failed.
   Both times the test caught it, as it should. The code was put back afterwards.
5. **Ran the recipe's two gate checks** (G1 liveness, G2 timeline). Both print `ok`.

## Reflection

- **What worked.** The CSV lookup is exact and checkable; the non-ATS link is skipped by a gate instead of guessed at; a missing input stops the run.
- **What the first version got wrong.** It labeled values as evidence they weren't: liveness as `record` without opening a link, fit as `model-judgment` without a model. It scored the international-student ban as a vote, so a banned role could land in Consider. Its gates were not the liveness and timeline gates the engine requires. It had no test. And a company present in the CSV with neither signal was mislabeled `no-matched` — fixed to `record` 0.
- **What this run shows is still wrong.** The invented company reached **Apply** at exactly 0.30 with no sponsorship record, entirely on a self-typed `fit = 1.0`. The skip rate is 33%, below the ~50% a healthy run skips. The prototype is only as honest as the student's fit number.
- **Next improvement.** Call `npm run ats:liveness` for ATS URLs inside the prototype (recipe A4), so G1 becomes a record instead of an assumption — then the first Apply in the list can be trusted on two terms, not one.

## Attestation
- Recipe: SWE STEM-OPT Runway v0.2.0
- By: Isaac Tai (tisaac) · 2026-10-21

### Tested
| Ran | Saw | Expected |
|---|---|---|
| `node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js` | exit 0; Apply 2 · Consider 0 · Skip 1 | exit 0; real company Apply, non-ATS Skip |
| `node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.test.mjs` | `9 passed, 0 failed`, exit 0 | all pass |
| Python `csv` lookup of 1LIFE HEALTHCARE INC | 1 row, `Total Approvals` 2.0 | > 0 → `record` 0.8 |
| Prototype CSV parser vs Python `csv` | 30,369 rows each; 0 mis-split | same row count, no mis-splits |
| **Break:** liveness relabeled `record` in `index.js` | test exit 1, "offline liveness is never presented as a record" failed | test fails |
| **Break:** missing-field guard removed | test exit 1, "fails clearly … missing fit" failed | test fails |
| Fixture with one job missing `fit` (inside the test) | exit ≠ 0, stderr names the field, no `my-roles.json` written | stop, no invented value |
| G1 / G2 machine checks from the recipe | both `ok` | both `ok` |

### Did not test
- Any real, live job posting; every URL is invented and none was opened.
- `npm run ats:liveness` (needs network and Playwright) — G1 is not cleared for any role.
- The international-student ban (G3) and excluded titles (G4): not implemented.
- Role quality: not produced; the scorer weight is 0.
- Company-name variants ("Acme" vs "ACME CORP") — known to fail as `no-matched`; not measured how often.
- Fixtures larger than 3 jobs; malformed JSON in the fixture; Node versions other than v24.
- A `--profile` that turns off the sponsorship requirement — the scorer's default "Profile requires sponsorship" was used, though this persona does not require it.

### Broke during testing, fixed
- `cut -d,` cross-check misread the CSV (quoted commas) → redone with Python `csv` (above).
- Company in the CSV with no approvals and no funding was labeled `no-matched` → now `record`, tier `none` (`index.js`).
- First submission: liveness labeled `record`, fit labeled `model-judgment`, `no-matched` used as a label, timeline and fit typed into the code, no test → all fixed in `index.js` / `fixture.json`, test added (`index.test.mjs`).
