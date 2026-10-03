# Worked run — finance data-engineering triage, 2026-10-01

> Drafted with an AI assistant from this session's real runs; every block of terminal output
> is pasted from saved files in `runs/`, not retyped. Reviewed by Arc-211 on 2026-10-02: the
> reflection is Arc-211's own answers (edited for grammar), and the attestation rows were confirmed.

## Executive summary

This document records one complete run of the recipe on the repository's sample data, for a
STEM-OPT master's graduate targeting finance data-engineering and BI roles. Out of 30,369
companies in the sponsorship file, the run found 12 finance companies that had sponsored a
data-like title, plus one big bank checked by name that turned out to be missing from the
data. After a person checked four job postings and four E-Verify records by hand, it
recommended three applications (Gemini, Green Dot, Remitly) and one fit review (SoFi). The
student then applied to all four, overriding the engine on SoFi.

Along the way, the run exposed three of its own mistakes, and all three are fixed here. Fit was
being judged on the wrong titles. The liveness checker called a live job "expired". And a
deliberately broken date showed that the tool still told the student to check postings they
could no longer take.

## Inputs

| Input | Value | Label |
|---|---|---|
| Persona | anonymized: F-1 master's, CIP 14.0903 (STEM family 14.09), program ends 2026-12-20, OPT not filed | your-input |
| Targets | data engineer (primary), BI / data analyst; SOC 15-1243.01, 15-1243.00, 15-2051.01, 15-1242.00 | your-input |
| Location / industry / floor | anywhere in the US or remote; finance preferred; $90,000 | your-input |
| Timeline assumptions | hiring lag 60 days; assumed OPT start 2026-12-21; 90 unemployment days | your-input |
| Data | 80 Days CSV, BLS compact CSV, Form D samples (sample mode) | record |
| Human-gate files | `inputs/liveness.json` (4), `inputs/everify.json` (4) | record or your-input per entry |

## Commands and real output

### 1. Liveness gate (human), `runs/liveness-2026-10-01.txt` (5 URLs)

```
$ npm run ats:liveness -- "<5 URLs>"
Checking 5 URL(s)...

✅ active     https://www.sofi.com/careers/job/?gh_jid=7826869003&gh_src=6f00r5g63us
✅ active     https://careers.upstart.com/jobs/it-support-analyst-columbus-ohio-united-states-512b6273-4051-4784-91a6-48419a4af4e9
❌ expired    https://greendotcorp.wd1.myworkdayjobs.com/en-us/gdc?timeType=f9cf0075511801c7d457c183bf139500&locationCountry=bc33aa3152ec42d4995f4791a106ed09
           pattern matched: search for jobs page is loaded
⚠️ uncertain  https://jpmc.fa.oraclecloud.com/hcmUI/CandidateExperience/en/sites/CX_1001/jobs
           content present but no visible apply control found
✅ active     https://job-boards.greenhouse.io/embed/job_app?for=gemini&token=8076827

Results: 3 active  1 expired  1 uncertain
```

The first Green Dot and JPMorgan URLs were search or listing pages, not single postings. That
"expired" result is meaningless, and it was not used. Follow-ups are in
`runs/liveness-2026-10-01b.txt` (Remitly `uncertain`, JPMorgan posting `active`) and
`runs/liveness-2026-10-01c.txt`. The latter shows the specific Green Dot posting as `expired —
insufficient content — likely nav/footer only`. **The student opened that page and saw an Apply
button.** It is recorded as `method: manual`, labeled your-input. Upstart's live posting was "IT
Support Analyst", which is out of scope, so it was not recorded.

### 2. E-Verify gate (human)

These lookups used the official E-Verify Employer Search, run in the in-app browser and reviewed
by the student. The *Date Enrolled* filter was changed from the default "This year" to "Last 30
years". All four companies were found **Open**; every matching entity is listed in
`inputs/everify.json`. An earlier chatbot-style table that claimed "Verified Enrolled" from
H-1B/PERM history was rejected.

### 3. The triage run, `runs/triage-run-2026-10-01.txt`

```
$ node scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.mjs --as-of 2026-10-01
✓ triage 2026-10-01: 13 evaluated → tailor-application 3 · verify-everify-then-tailor 0 · review-role-fit 1 · network-into-company 0 · check-posting-by-hand 8 · research-sponsorship 0 · not-in-data 1 · skip 0
  timeline factor 1 (offer lands before OPT starts — no unemployment days used)
  course/2026fa/submissions/Arc-211/runs/triage/triage-log.json  +  course/2026fa/submissions/Arc-211/runs/triage/triage-report.md
```

Excerpt of `runs/triage/triage-report.md`. The 8 unchecked rows are omitted here but present in
the file.

```
| Step | Count | Label |
|---|---|---|
| Companies in CSV | 30369 | record |
| …with any H-1B data | 1557 | record |
| Industry matches `financ|bank|insur|invest|capital|fintech|payment` | 2425 | your-input filter on record |
| …with H-1B data | 34 | record |
| …H-1B blank (unknown, not scored) | 2391 | record |
| …sponsored a data/BI-type title | 12 | model-judgment (title rule) |

| Company | Next action | Score | Sponsorship [record → your-input tier] | Fit [model-judgment] | Liveness [label] | E-Verify [label] | Pay median, all titles [record] | Latest funding [record] |
| GEMINI SPACE STATION LLC | **tailor-application** | 0.555 Apply | 24 appr, 100.0% → Proven | 0.8 | active [record] | confirmed [record] | $150,000 (meets-floor) | 2021-11-19 |
| GREEN DOT CORP | **tailor-application** | 0.555 Apply | 92 appr, 100.0% → Proven | 0.8 | active [your-input] | confirmed [record] | $122,033 (meets-floor) | 2024-09-06 |
| REMITLY INC | **tailor-application** | 0.555 Apply | 344 appr, 98.9% → Proven | 0.8 | active [your-input] | confirmed [record] | $145,274 (meets-floor) | 2017-11-10 |
| SOCIAL FINANCE INC | **review-role-fit** | 0.315 Apply | 182 appr, 100.0% → Proven | — | active [record] | confirmed [record] | $169,488 (meets-floor) | 2020-12-30 |
| JPMORGAN CHASE & CO | **not-in-data** | — (not-found) | — | — | — | — | — | — |

- SOCIAL FINANCE INC (posting: Fraud Model Analyst; liveness record) — composite 0.315 ≥ 0.3, gates healthy; (0.9·0.35) × 1 × 1 = 0.315. Fit: no target-role match on posting title "Fraud Model Analyst" — no fit vote
- JPMORGAN CHASE & CO — company not in the sponsorship CSV — no value invented
```

### 4. Tests, `runs/test-2026-10-01.txt`

```
$ node --test scripts/contrib/2026fa/Arc-211-fin-dataeng-stemopt/triage.test.mjs
ℹ tests 18
ℹ pass 18
ℹ fail 0
```

(The file lists all 18 test names. They cover every failure case F1–F6 from the change brief,
the label invariant, and each fix described below.)

### 5. Deliberate break attempts, `runs/breaks/*.txt`

```
$ node …/triage.mjs --as-of 2027-03-01 --out-dir …/breaks/after-deadline
✓ triage 2027-03-01: 13 evaluated → tailor-application 0 · … · check-posting-by-hand 0 · … · not-in-data 1 · skip 12
  timeline factor 0 (OPT not filed and the filing window closed on 2027-02-18)
exit 0

$ node …/triage.mjs --config …/breaks/missing-input.config.json --out-dir …/breaks/missing-input
✗ G1 input missing: data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v4.csv
exit 2

$ node …/triage.mjs --config …/breaks/soc-typo.config.json --out-dir …/breaks/soc-typo
✗ none of the target SOCs (15-1243.10) has a row in data/bls/compact/soc_occupation_compact.csv
exit 3

$ node …/triage.mjs --config …/breaks/typo-company.config.json --out-dir …/breaks/typo-company --as-of 2026-10-01
✓ triage 2026-10-01: 2 evaluated → … review-role-fit 1 · … · not-in-data 1 · skip 0
exit 0          ("SOCAIL FINANCE INC" → not-in-data)
```

## Verified vs inferred, line by line

| Value | Label | Why |
|---|---|---|
| SoFi 182 approvals, 0 denials, 100% rate, median $169,488, funding 2020-12-30 | record | read from the CSV, and hand-checked below |
| Gemini 24 / 0 / 100%, $150,000; Green Dot 92 / 0 / 100%, $122,032.50; Remitly 344 / 4 / 98.85%, $145,274 | record | same |
| "Proven" tier, sponsorship p 0.9 | your-input | the threshold rule and p value are my choices; the repo pins neither |
| Fit 0.8 (Gemini, Green Dot, Remitly); no fit (SoFi) | model-judgment | a keyword rule on the posting title, not a record |
| Posting titles | your-input | transcribed by the student from the pages they checked |
| Liveness, Gemini and SoFi | record | `ats:liveness` output, transcribed |
| Liveness, Green Dot and Remitly | your-input | the student's own visual check; the checker said expired or uncertain |
| E-Verify "confirmed", all four | record | official E-Verify Employer Search, transcribed |
| Timeline factor 1.0 | your-input | derived only from my dates and the 60-day lag |
| Composite 0.555 / 0.315 | computed by the shipped scorer from the labeled inputs | the arithmetic is in the report |
| JPMorgan "not-in-data" | record (of absence) | no row under any name variant searched |
| BLS medians ($135,980; $112,590; $104,620) | record | context only; not scored |
| "SoFi is a great company to work at" | your-input (preference) | the reason for the human override; not evidence |

## Verification

- **Hand check against the source CSV.** I printed the four rows directly from
  `mapped_student_employment_targets_v3.csv`. Every approvals, denials, rate, median and funding
  value matches the report, for example `SOCIAL FINANCE INC | appr 182.0 | den 0.0 | rate 100.0 |
  med 169488.0 | fund 2020-12-30`. The file has 30,370 lines, which is 30,369 data rows plus the
  header, matching the census.
- **Hand check of the arithmetic.** (0.9 × 0.35 + 0.8 × 0.3) × 1 × 1 = 0.315 + 0.24 = 0.555. SoFi
  is 0.9 × 0.35 = 0.315, which is ≥ 0.3, so the scorer says Apply even with no fit vote.
- **The tests, including a mutation check.** I deliberately disabled the "never send unchecked
  liveness" rule. The F3 test failed. I restored the rule, and all tests passed.
- **Break attempts.** These are in section 5 above, and in the attestation below.

## Reflection

### In my own words (Arc-211; my answers, edited for grammar and flow with AI on 2026-10-02)

What surprised me most was Green Dot. The checker said the posting was expired, but it
wasn't. If I had trusted the checker, I would have skipped one of the best companies on my list.
For E-Verify, I had to check by hand whether it applied to each company. I could
not trust the AI blindly. The SoFi posting was a different role from the one I had targeted, so I
had to tailor my application a bit for it. Next time, I would look at the job sites in more
depth and choose roles that are aligned with my target role.

### Technical review of the run (compiled by the AI assistant from the run record)

**What worked.** Labeling every value made the weak points obvious. The only three
`your-input` liveness and preference rows are exactly the places a person had to step in.
Refusing to send an unchecked posting to the scorer mattered: the scorer itself would have
treated "not checked" as "live, record".

**What the recipe or prototype got wrong, and how each was found:**
1. **Fit was judged on the wrong thing.** The first scored run gave SoFi a strong fit because the
   company once sponsored a "Business Intelligence Manager". The actual posting was "Fraud Model
   Analyst". I found it by reading *Why each row*. The fix: fit is now judged on the posting title.
2. **The liveness checker was wrong twice.** It called a search page "expired", and it called a
   live Green Dot posting "expired". I found both by opening the pages. The fix: a `manual`
   method, labeled your-input, and the recipe says to always look.
3. **A closed timeline still sent the student to check postings.** I found it with the
   after-deadline break run. The fix: when the timeline gate is closed, unchecked companies are
   skipped too.
4. **Error messages leaked a local folder path**, including the machine username. The fix:
   repo-relative paths.
5. **A misspelled company name looks exactly like a truly missing company.** "SOCAIL FINANCE INC"
   and JPMorgan both read "not-in-data". **Not fixed**; recorded as a limitation.

**What it still misses.** Seniority: Gemini and Green Dot are "Senior" postings for a new
graduate, and nothing checks that. Eight candidates are still unchecked for liveness. Role-level
sponsorship rests on a few top titles per company.

**One concrete next improvement.** When a name isn't found, print the three closest CSV names
(edit distance), labeled model-judgment. That separates a typo from a genuine absence like
JPMorgan's, without ever auto-correcting.

## Attestation
- Recipe: Arc-211-fin-dataeng-stemopt v0.1.0
- By: Arc-211 · 2026-10-01 (rows reviewed and confirmed by Arc-211 on 2026-10-02)

### Tested
| Ran | Saw | Expected |
|---|---|---|
| `node …/triage.mjs --as-of 2026-10-01` | exit 0; 13 evaluated → 3 tailor, 1 review-role-fit, 8 check-by-hand, 1 not-in-data | both outputs written; every value labeled; no unchecked role sent to the scorer |
| `node --test …/triage.test.mjs` | 18/18 pass | all pass, offline |
| Mutation: disable the unchecked-liveness rule, rerun tests | F3 test fails (11/12 at the time); restored → pass | a test catches the regression |
| Hand check: four CSV rows vs the report | all values match | match |
| `ats:liveness` on 8 URLs (3 runs) | 4 active, 2 expired, 2 uncertain across runs | some disagreement with the page, to be judged by eye |
| Opened the Green Dot posting in a browser | Apply button present | the checker said expired → recorded `manual` active |
| E-Verify Employer Search, four names, date widened to 30 years | all four Open; multiple entities; one Remitly account terminated | a record per company, or not-found |
| **Break:** `--as-of 2027-03-01` | timeline 0; 12 skip, 0 check-by-hand (after the fix) | everything stops |
| **Break:** sponsors CSV path `_v4.csv` | exit 2, nothing written | exit 2 |
| **Break:** SOC `15-1243.10` | exit 3 | exit 3 |
| **Break:** company typo `SOCAIL FINANCE INC` | `not-in-data` | not-in-data, no invented value |

### Did not test
- A live run against the full Form D quarters (only the samples ship).
- The 8 finance candidates still at `check-posting-by-hand`.
- Whether any of the four E-Verify entities is the one that would actually employ the student.
- Node 20 specifically. Local runs used Node 23.2; CI uses Node 20.
- A clean-checkout run. That is recorded separately in TEST-REPORT.md.
- Seniority fit, and any outcome of the applications.

### Broke during testing, fixed
- Fit judged on the company's sponsored titles instead of the posting: `triage.mjs` fit block, plus a new test.
- The liveness label was always `record`, even for manual checks: `triage.mjs` liveness block and report column, plus a test.
- Liveness defaulting: the shipped scorer would treat a missing liveness as 1.0 `record`. Not fixed upstream (out of namespace). The prototype never omits it (F3 test).
- A closed timeline still routed unchecked companies to `check-posting-by-hand`: `triage.mjs`, plus a new test.
- Error messages printed absolute local paths: `triage.mjs` `die()` calls now print repo-relative paths.
