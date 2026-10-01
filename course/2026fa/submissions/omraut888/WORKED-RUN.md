# WORKED-RUN.md

## Executive summary

This is one complete run of the ML/RAG H-1B triage prototype for the
fictional student Priya Nair. Priya is an F-1 OPT graduate with 36 usable
unemployment days, targeting AI and ML engineering roles. Of the 1,557
companies with recorded H-1B history, the build kept 183 that sponsor ML
titles. The engine's scorer recommended Apply for 87 and Consider for 96, and
skipped none. Five companies are traced below term by term, and one is checked
by hand against the raw data.

**This run found and fixed a real scoring flaw.** A deliberate attempt to break
the build succeeded. A company with no approved visa petitions and two denied
ones was scored as a 70% sponsorship prospect, and it ranked above Microsoft.
Two data-driven fixes were tried and neither worked, because every sponsorship
average this dataset can produce is close to 98%. The fix that worked is a
stated judgment: a company with zero approvals starts from a 30% prospect
rather than the 98% average. That company now scores 21% and ranks 179th of
183. It is still marked Consider, not Skip, and that is recorded as a known
limit rather than forced. On the real data the fix changes no recommendation,
because none of the 183 companies has zero approvals.

## Inputs

- **Persona:** `search/examples/priya-nair/`, fictional and unmodified. OPT
  window 2026-02-01 to 2027-01-31; 90-day unemployment ceiling, 34 days used
  and 20 held as buffer, which leaves 36 usable days. Target roles "AI
  Engineer / ML Engineer" and "Data Engineer", which give the fit tokens
  `{ai, data, engineer, ml}`.
- **Sponsorship CSV:** the tracked
  `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`.
  It has 30,369 rows; the 1,557 with recorded approvals or denials form the
  H-1B subset.
- **As-of date:** 2026-09-30, fixed in `build_roles.py`.
- **Commit:** `3745eb5e4bcfbecb24baa50e455a25d5f931ce54`, which contains the
  final sponsorship-prior design. The canonical run is
  `runs/worked-run-4/`, produced on 2026-10-01 from a working tree whose
  build script, tests and scorer are byte-identical to that commit
  (`git diff 3745eb5` on them is empty). The only other uncommitted change was
  `package-lock.json`, which neither command reads.

## Commands run

The output below is worked-run-4's, captured when it ran. Nothing that run
reads has changed at `3745eb5`, so it was not re-executed.

### 1. Build the role records

````text
$ python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --out course/2026fa/submissions/omraut888/runs/worked-run-4
built 183 roles from 1557 H-1B rows (30369 in CSV); skipped: unparseable-titles 0, no-approval-rate 0
tiers {'Proven': 134, 'Likely': 49, 'Unknown': 0}; fit > 0 on 173/183; usable days 36 as of 2026-09-30
  course/2026fa/submissions/omraut888/runs/worked-run-4/roles.json  +  course/2026fa/submissions/omraut888/runs/worked-run-4/build-audit.json
````

### 2. Score them

````text
$ npm run score -- course/2026fa/submissions/omraut888/runs/worked-run-4/roles.json --out-dir course/2026fa/submissions/omraut888/runs/worked-run-4
> the-reallocation-engine@1.0.0 score
> node scripts/score/role-scorer.mjs course/2026fa/submissions/omraut888/runs/worked-run-4/roles.json --out-dir course/2026fa/submissions/omraut888/runs/worked-run-4
✓ scored 183 roles → Apply 87 · Consider 96 · Skip 0 (skip 0%)
  course/2026fa/submissions/omraut888/runs/worked-run-4/role-scores.json  +  course/2026fa/submissions/omraut888/runs/worked-run-4/role-scores.md
````

Both commands wrote into `runs/worked-run-4/`: `roles.json` (243 KB),
`build-audit.json` (1.6 KB), `role-scores.json` (257 KB) and `role-scores.md`
(90 KB).

The sponsorship assumptions recorded in `build-audit.json`:

| Assumption | Value | Label |
|---|---|---|
| `sponsorship_prior` | 0.9812 = sum(approvals) / sum(approvals + denials) over the 1,557 H-1B rows | record |
| `zero_approval_prior` | 0.3, applied only to companies with 0 approvals | your-input: chosen, not derived |
| `shrinkage_c` | 5 | your-input |
| `proven_min_approvals` | 5 | your-input |

## Verified vs inferred, company by company

These are five companies from `role-scores.json`. No company was skipped, so
there is no Skip example to include. Ranks are by composite score, 1 = highest,
out of 183. Every vote is `value × weight`, and the sum is then multiplied by
the liveness and timeline gates. In all five, liveness is 1.0 only because it
was not checked.

**Labels.** `record` = read from the CSV or the persona file.
`model-judgment` = computed by this build as a proxy. `your-input` = an
asserted assumption.

**The zero-approval prior was not used on any of these companies, or on any of
the 183.** All five have at least one approval, so every `sponsorship.p` below
is shrunk toward the data-derived prior 0.9812:
sponsorship.p = (approvals + 5 × 0.9812) / (approvals + denials + 5). No
ML-sponsoring company in the real data has 0 approvals; worked-run-4 has 0
Unknown-tier companies. The fixed 0.3 prior has only run on the constructed
break case under Verification.

### CYNGN INC: rank 1, Apply, 0.574

`(0.9977·0.35 + 0.75·0.3) × 1 × 1 = 0.574`

| Term | Value | Label | What it rests on |
|---|---|---|---|
| Approvals / denials | 36 / 0 (raw rate 100%) | record | CSV row |
| Funding stage | Seed, $23.5M total | record | CSV row |
| sponsorship.p | 0.9977, tier Proven | record, shrunk toward the 0.9812 prior with C = 5 (your-input) | 36 approvals ≥ 5 |
| fit.p | 0.75 | model-judgment | `data`, `engineer`, `ml` matched in "Senior Software Engineer – Machine Learning Data Infrastruct" and "Software Engineer - Perception ML" |
| timeline.factor | 1.0 | your-input | Seed → assumed 21-day lag; 36/21 capped at 1 |
| liveness.factor | 1.0 | not checked | no approval for the live-network step |

### REFUELAI INC: rank 13, Consider, 0.495

`(0.9866·0.35 + 0.5·0.3) × 1 × 1 = 0.495`

| Term | Value | Label | What it rests on |
|---|---|---|---|
| Approvals / denials | 2 / 0 (raw rate 100%) | record | CSV row |
| Funding stage | Series A, $5.3M total | record | CSV row |
| sponsorship.p | 0.9866, tier Likely | record, shrunk toward the 0.9812 prior with C = 5 (your-input) | 2 approvals, under the 5 needed for Proven |
| fit.p | 0.5 | model-judgment | `engineer`, `ml` matched in "Founding ML Engineer" |
| timeline.factor | 1.0 | your-input | Series A → assumed 21-day lag |
| Decision | Consider despite 0.495 ≥ 0.30 | scorer rule | Likely tier downgrades Apply to Consider |

### ACV AUCTIONS INC: rank 153, Consider, 0.272

`(0.9965·0.35 + 0.25·0.3) × 1 × 0.6429 = 0.272`

| Term | Value | Label | What it rests on |
|---|---|---|---|
| Approvals / denials | 22 / 0 (raw rate 100%) | record | CSV row (checked by hand below) |
| Funding stage | Series C, $135.0M total | record | CSV row |
| sponsorship.p | 0.9965, tier Proven | record, shrunk toward the 0.9812 prior with C = 5 (your-input) | 22 approvals ≥ 5 |
| fit.p | 0.25 | model-judgment | only `engineer` matched in "Machine Learning Engineer III"; `ml` can't match "Machine Learning" |
| timeline.factor | 0.6429 | your-input | Series C → assumed 56-day lag; 36/56 |
| Median salary | $67,205 | record, context only | company-wide median across all filings, not this role's pay; not used in the score |

### MICROSOFT CORP: rank 176, Consider, 0.266

`(0.9662·0.35 + 0.25·0.3) × 1 × 0.6429 = 0.266`

| Term | Value | Label | What it rests on |
|---|---|---|---|
| Approvals / denials | 12,226 / 428 (raw rate 96.6%) | record | CSV row |
| Funding stage | Series D+, $270.3M total | record | CSV row; see the reflection, not plausible as Microsoft's own funding |
| sponsorship.p | 0.9662, tier Proven | record, shrunk toward the 0.9812 prior with C = 5 (your-input) | at this volume shrinkage has no effect |
| fit.p | 0.25 | model-judgment | only `data` matched, in "Data Science"; "Applied Sciences" matches nothing |
| timeline.factor | 0.6429 | your-input | Series D+ → assumed 56-day lag |

### NUANCE COMMUNICATIONS INC: rank 183 (last), Consider, 0.212

`(0.9407·0.35 + 0·0.3) × 1 × 0.6429 = 0.212`

| Term | Value | Label | What it rests on |
|---|---|---|---|
| Approvals / denials | 60 / 4 (raw rate 93.75%) | record | CSV row |
| Funding stage | Series C, $85.0M total | record | CSV row |
| sponsorship.p | 0.9407, tier Proven | record, shrunk toward the 0.9812 prior with C = 5 (your-input) | 60 approvals ≥ 5 |
| fit.p | 0.0 | model-judgment | its only matched title, "Senior NLP Research Scientist", contains none of the four target words |
| timeline.factor | 0.6429 | your-input | Series C → assumed 56-day lag |

### What to trust

- **Trust:**
  - the approval and denial counts, the raw approval rate and the funding
    columns, which are faithful copies of the tracked CSV (one row is checked
    by hand below);
  - the 0.9812 subset prior, which is a count over the same records;
  - the timeline arithmetic: 36 usable days divided by the lag;
  - the scorer's composite arithmetic, which is printed in every trace.
- **Treat as assumptions:**
  - the 21- and 56-day lags and the funding-stage cutoff between them, which
    together decide the timeline factor;
  - the pseudo-count C = 5 and the Proven cutoff of 5 approvals;
  - the 0.3 zero-approval prior, which is a judgment and is dormant on this
    data;
  - liveness 1.0, which means "not checked", not "live".
- **Don't trust as a ranking signal:** fit.p. It counts four words in job
  titles, and it ranks Nuance's NLP research role last, though that is the
  kind of role this student targets.
- **Read the funding stage with care:** it is a record, but of an SEC filing
  that may belong to a different entity (Microsoft is the clearest case), and
  it selects the lag.

## Verification

### Hand check: ACV AUCTIONS INC against its raw CSV row

These are the relevant columns of the raw row. The phone number, executive and
board names, website and zip code are left out: the build doesn't use them,
and the phone number would trip the repository's PII scan.

````text
$ python3 -c "import csv; h,*rows=list(csv.reader(open('data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv',encoding='utf-8',errors='replace'))); r=next(x for x in rows if x[0]=='ACV AUCTIONS INC'); keep=['company_name','industry','city','state','latest_funding_stage','total_funding','Total Approvals','Total Denials','Approval_Rate','median_salary_offered','top_job_titles_sponsored']; [print(f'{k}: {r[h.index(k)]}') for k in keep]"
company_name: ACV AUCTIONS INC
industry: Other Technology
city: BUFFALO
state: NY
latest_funding_stage: Series C
total_funding: 134999999.0
Total Approvals: 22.0
Total Denials: 0.0
Approval_Rate: 100.0
median_salary_offered: 67205.0
top_job_titles_sponsored: ['Machine Learning Engineer III']
[exit 0]
````

What the build computed for the same company in worked-run-4:

````text
$ python3 -c "import json; r=next(x for x in json.load(open('course/2026fa/submissions/omraut888/runs/worked-run-4/roles.json')) if x['role_id']=='acv-auctions-inc'); s=next(x for x in json.load(open('course/2026fa/submissions/omraut888/runs/worked-run-4/role-scores.json'))['roles'] if x['role_id']=='acv-auctions-inc'); print(json.dumps({k:r[k] for k in ('sponsorship','fit','timeline')}, indent=1, ensure_ascii=False)); print('composite', s['composite'], s['recommendation'], '|', s['trace']['arithmetic'])"
{
 "sponsorship": {
  "p": 0.9965,
  "tier": "Proven",
  "source": "record (approvals/denials, shrunk toward prior 0.9812; C=5 your-input)"
 },
 "fit": {
  "p": 0.25,
  "source": "model-judgment (target-role word overlap with matched sponsored titles)"
 },
 "timeline": {
  "factor": 0.6429,
  "source": "your-input (36 usable days as of 2026-09-30 / 56-day assumed lag for stage Series C)"
 }
}
composite 0.2724 Consider | (0.9965·0.35 + 0.25·0.3) × 1 × 0.6429 = 0.272
````

By hand, using the subset prior 0.9812 recorded in `build-audit.json`:

- **sponsorship.p** = (approvals + C × prior) / (approvals + denials + C)
  = (22 + 5 × 0.9812) / (22 + 0 + 5) = 26.906 / 27 = **0.99652** → 0.9965. ✓
  (Under the original equal-weighted prior, 0.9792, it was 0.9962. The
  composite is 0.2724 either way.)
- **tier**: 22 approvals ≥ 5 → **Proven**. ✓
- **fit.p**: "Machine Learning Engineer III" → tokens {machine, learning,
  engineer, iii}; ∩ {ai, data, engineer, ml} = {engineer} → 1/4 = **0.25**. ✓
- **timeline.factor**: Series C → 56-day lag; 36 / 56 = **0.6429**. ✓
- **composite** = (0.9965 × 0.35 + 0.25 × 0.30) × 1.0 × 0.6429
  = (0.34878 + 0.075) × 0.6429 = **0.2724**. ✓
- **decision**: 0.2724 is in [0.20, 0.30) → **Consider**. ✓

### Trying to break it: a company with no approvals

The real ML subset has no Unknown-tier company. The full H-1B subset has 5
rows with 0 approvals (four with 2 denials, one with 4), but none of them
sponsors an ML title. So one was constructed: in a temporary copy of the CSV,
REFUELAI INC's real counts (2 approvals, 0 denials) were overwritten. The
question was whether a company with no sponsorship success would be scored as
if it had some.

Helpers, defined in the shell session (`$S` is a scratch directory outside
the repository):

````bash
# helper: copy the CSV, overwrite REFUELAI INC's H-1B counts, write to $4
mk() { python3 -c "
import csv,sys
src='data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv'
rows=list(csv.reader(open(src,encoding='utf-8',errors='replace'))); h=rows[0]
i=next(k for k,r in enumerate(rows) if r[0]=='REFUELAI INC')
a,d,rate=sys.argv[1:4]
rows[i][h.index('Total Approvals')]=a; rows[i][h.index('Total Denials')]=d; rows[i][h.index('Approval_Rate')]=rate
csv.writer(open(sys.argv[4],'w',newline='',encoding='utf-8')).writerows(rows)
print('REFUELAI INC now: approvals', a, 'denials', d, 'Approval_Rate', rate)" "$@"; }

# helper: print REFUELAI INC's sponsorship term, composite, rank and decision, with Microsoft for comparison
show() { python3 -c "
import json,sys
d=sys.argv[1]; r=next(x for x in json.load(open(d+'/roles.json')) if x['role_id']=='refuelai-inc'); s=json.load(open(d+'/role-scores.json'))['roles']
x=next(x for x in s if x['role_id']=='refuelai-inc'); rank=sorted(s,key=lambda y:-y['composite']).index(x)+1
print('sponsorship:', json.dumps(r['sponsorship'])); print('composite', x['composite'], '| rank', rank, 'of', len(s), '|', x['recommendation'], '|', x['reason'])
ms=next(y for y in s if y['role_id']=='microsoft-corp'); print('for comparison, MICROSOFT CORP composite', ms['composite'], ms['recommendation'])" "$1"; }
````

#### It broke

The constructed case was **0 approvals, 2 denials**, the same shape as four of
the five real zero-approval rows. It was built and scored under the original
equal-weighted prior (commit `18884eb`):

````text
$ mk 0.0 2.0 0.0 /tmp/wr-break/zero-for-two.csv
REFUELAI INC now: approvals 0.0 denials 2.0 Approval_Rate 0.0
$ python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --csv /tmp/wr-break/zero-for-two.csv --out /tmp/wr-break/a
built 183 roles from 1557 H-1B rows (30369 in CSV); skipped: unparseable-titles 0, no-approval-rate 0
tiers {'Proven': 134, 'Likely': 48, 'Unknown': 1}; fit > 0 on 173/183; usable days 36 as of 2026-09-30
$ npm run score -- /tmp/wr-break/a/roles.json --out-dir /tmp/wr-break/a
✓ scored 183 roles → Apply 87 · Consider 96 · Skip 0 (skip 0%)
$ show /tmp/wr-break/a
sponsorship: {"p": 0.699, "tier": "Unknown", "source": "record (approvals/denials, shrunk toward prior 0.9786; C=5 your-input)"}
composite 0.3946 | rank 109 of 183 | Consider | above threshold (0.395) but one soft spot: sponsorship tier "Unknown"
for comparison, MICROSOFT CORP composite 0.2656 Consider
````

A company that has never had an H-1B petition approved, and has had two
denied, got `sponsorship.p = 0.699`. It ranked 109th of 183, above Microsoft
(0.266), which has 12,226 approvals. With no evidence at all (0 approvals and
0 denials) the same build gave the prior itself, 0.979, and ranked the company
15th. The arithmetic: (0 + 5 × 0.9786) / (0 + 2 + 5) = 4.893 / 7 = 0.699. With
C = 5 and a prior near 98%, five imaginary near-certain approvals outweigh two
real denials.

The formula was correct shrinkage. The flaw was the prior it shrank toward.
Reading `shrunk_p()` alone would not have shown it: the function is a single,
textbook-correct line. The problem only appears when an input the real data
doesn't contain is fed through it.

#### What was tried, in order

All results below are for the same 0-approvals, 2-denials case, from the
recorded runs. The Apply / Consider / Skip counts on the real 183 companies
were 87 / 96 / 0 after every attempt.

| Attempt | Prior used for this company | Break-case p | Rank | Decision | Outcome |
|---|---|---|---|---|---|
| Original: mean of per-company approval rates | 0.9786 | 0.699 | 109 | Consider | the flaw |
| 1. Volume-weighted prior: sum(approvals) / sum(decisions) | 0.9812 | 0.7009 | 109 | Consider | rejected: the prior went *up* |
| 2. Separate prior from thin records (companies with 1–2 decisions) | 0.9842 | 0.703 | 109 | Consider | rejected: slightly worse |
| 3. Fixed prior for 0-approval companies, your-input | 0.3 | **0.2143** | **179** | Consider | **kept** |

- **Attempt 1** is kept as the main prior, because pooling decisions is
  more defensible than averaging rates. Under the old average, a company with 1
  decision counted as much as one with 12,000. But large sponsors approve
  slightly *more* often than small ones, so on the real data the pooled prior
  rose from 0.9792 to 0.9812. (The table shows 0.9786 for the original
  because the constructed row itself shifts the equal-weighted mean.) It did nothing for the break case.
- **Attempt 2** was rejected. The 317 companies with 1–2 decisions are 313
  with 2 approvals and 0 denials, plus 4 with 0 approvals and 2 denials. They
  approve at 98.7%. Choosing companies by having *few* records doesn't choose
  denial-heavy ones.
- **Attempt 3** follows from those two: every prior this dataset can produce
  lands near 98%. A realistic starting point for a company with zero approvals
  can't be learned from these records, so it is stated as a judgment instead.
  It is labeled `your-input` in the code, in every affected role's source
  label, and in `build-audit.json`.

#### The break case under the final design, at `3745eb5`

`$S/zero-for-two.csv` was written with the same overwrite `mk` performs
(REFUELAI INC set to 0 approvals, 2 denials, rate 0.0).
`$S/zero-for-zero.csv` is the 0-for-0 copy from the original break run.

````text
$ git rev-parse HEAD
3745eb5e4bcfbecb24baa50e455a25d5f931ce54
$ python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --csv $S/zero-for-two.csv --out $S/final-two
built 183 roles from 1557 H-1B rows (30369 in CSV); skipped: unparseable-titles 0, no-approval-rate 0
tiers {'Proven': 134, 'Likely': 48, 'Unknown': 1}; fit > 0 on 173/183; usable days 36 as of 2026-09-30
  $S/final-two/roles.json  +  $S/final-two/build-audit.json
$ npm run score -- $S/final-two/roles.json --out-dir $S/final-two
✓ scored 183 roles → Apply 87 · Consider 96 · Skip 0 (skip 0%)
$ show $S/final-two
sponsorship: {"p": 0.2143, "tier": "Unknown", "source": "record (approvals/denials) shrunk toward your-input zero-approval prior 0.3; C=5 your-input"}
composite 0.225 | rank 179 of 183 | Consider | composite 0.225 in the Consider band [0.2, 0.3)
for comparison, MICROSOFT CORP composite 0.2656 Consider
````

By hand: (0 + 5 × 0.3) / (0 + 2 + 5) = 1.5 / 7 = **0.2143**; composite =
(0.2143 × 0.35 + 0.5 × 0.30) × 1 × 1 = 0.0750 + 0.15 = **0.2250**, in
[0.20, 0.30) → **Consider**. ✓

The no-evidence variant (**0 approvals, 0 denials**), at the same commit:

````text
$ show $S/final-zero
sponsorship: {"p": 0.3, "tier": "Unknown", "source": "record (approvals/denials) shrunk toward your-input zero-approval prior 0.3; C=5 your-input"}
composite 0.255 | rank 177 of 183 | Consider | composite 0.255 in the Consider band [0.2, 0.3)
for comparison, MICROSOFT CORP composite 0.2656 Consider
````

The fix is a large improvement. The constructed company moved from 109th to
179th, and below Microsoft. A company with no record now ranks 177th instead
of 15th. **It is not a complete fix.** Both cases are still Consider, not
Skip: the composite stays above the 0.20 Skip line, because fit (0.5) and a
full timeline factor (1.0) keep it there. This is recorded as a remaining
limit, not tuned away.

### Test suite at `3745eb5`

````text
$ git rev-parse HEAD && python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/test_build_roles.py
3745eb5e4bcfbecb24baa50e455a25d5f931ce54
test_every_role_is_labeled_unchecked_for_liveness (__main__.Build.test_every_role_is_labeled_unchecked_for_liveness) ... ok
test_only_h1b_rows_with_ml_titles_become_roles (__main__.Build.test_only_h1b_rows_with_ml_titles_become_roles) ... ok
test_small_sample_is_likely_tier_and_below_raw_rate (__main__.Build.test_small_sample_is_likely_tier_and_below_raw_rate) ... ok
test_stage_drives_timeline (__main__.Build.test_stage_drives_timeline) ... ok
test_unparseable_titles_are_counted_not_dropped_silently (__main__.Build.test_unparseable_titles_are_counted_not_dropped_silently) ... ok
test_zero_approvals_use_fixed_prior_others_use_main (__main__.Build.test_zero_approvals_use_fixed_prior_others_use_main) ... .../test_build_roles.py:126: ResourceWarning: unclosed file <_io.TextIOWrapper name='.../fixtures/sponsorship-sample.csv' mode='r' encoding='utf-8'>
  rows = list(csv.DictReader(FIXTURE_CSV.open(newline="", encoding="utf-8")))
ResourceWarning: Enable tracemalloc to get the object allocation traceback
ok
test_full_overlap_is_one (__main__.Fit.test_full_overlap_is_one) ... ok
test_target_tokens_from_profile (__main__.Fit.test_target_tokens_from_profile) ... ok
test_whole_word_overlap (__main__.Fit.test_whole_word_overlap) ... ok
test_closed_opt_window_is_a_gated_skip (__main__.ScorerContract.test_closed_opt_window_is_a_gated_skip) ... ok
test_scorer_accepts_built_roles (__main__.ScorerContract.test_scorer_accepts_built_roles) ... ok
test_prior_is_volume_weighted_not_equal_weighted (__main__.Sponsorship.test_prior_is_volume_weighted_not_equal_weighted) ... ok
test_shrinkage_pulls_small_samples_toward_prior (__main__.Sponsorship.test_shrinkage_pulls_small_samples_toward_prior) ... ok
test_tier_boundaries (__main__.Sponsorship.test_tier_boundaries) ... ok
test_buffer_exhausted_never_goes_negative (__main__.Timeline.test_buffer_exhausted_never_goes_negative) ... ok
test_factor_is_ratio_capped_at_one (__main__.Timeline.test_factor_is_ratio_capped_at_one) ... ok
test_opt_window_closed_gives_zero_days (__main__.Timeline.test_opt_window_closed_gives_zero_days) ... ok
test_stage_buckets (__main__.Timeline.test_stage_buckets) ... ok
test_usable_days_from_persona (__main__.Timeline.test_usable_days_from_persona) ... ok
test_no_match_inside_other_words (__main__.TitleKeywords.test_no_match_inside_other_words) ... ok
test_real_ml_titles_still_match (__main__.TitleKeywords.test_real_ml_titles_still_match) ... ok

----------------------------------------------------------------------
Ran 21 tests in 0.058s

OK
[exit 0]
````

The ResourceWarning shown above is fixed in a later commit, 2569346 — this transcript is preserved as it ran at 3745eb5 and is not edited to look cleaner in hindsight.

All 21 tests pass. Two are new with this fix: one checks that the prior is
volume-weighted, and one checks that zero-approval companies use the fixed 0.3
while others keep the main prior. The `ResourceWarning` is from the new
zero-approval test, which opens the fixture CSV without closing it. It does
not affect the result. (Absolute paths in the warning are shortened to `...`.)

## Reflection

### What worked

- **The break attempt found a flaw that reading the code would not have.**
  `shrunk_p()` is one correct line of standard shrinkage, and a reviewer
  reading it would have passed it. The flaw was in what the formula was fed:
  a near-98% prior applied to a case the real data never contains. It took
  constructing that case and running it through the whole pipeline to see a
  company with zero approvals rank above Microsoft.
- **Two rejected fixes are on the record, not hidden.** Volume-weighting and a
  thin-record prior were each tried, measured and rejected on their numbers.
  Together they show why the final fix had to be a judgment: this data cannot
  produce a low prior.
- **Numbers trace exactly.** The hand check reproduced every term for ACV
  AUCTIONS INC from its raw CSV row to four decimal places, and each trace
  prints its own arithmetic.
- **Labels made both the break and the fix legible.** Every number carries
  `record`, `model-judgment` or `your-input`. That is how the flaw was traced
  to an assumption rather than to the data. It is also why the 0.3 prior can
  be presented honestly as a judgment.
- **The small-sample tier does real work.** All 49 Likely-tier companies were
  held at Consider, 40 of them despite scoring above the Apply threshold.

### What is still wrong

1. **The break case still doesn't reach Skip.** A company with zero approvals
   and two denials is ranked near the bottom, but it is still recommended
   Consider. The 0.3 prior lowered its sponsorship term. It did not make
   "no sponsorship success on record" a reason to skip, and fit and timeline
   keep the composite above 0.20. This is a genuine limitation, not solved.
2. **The fixed prior has never run on real data.** No ML-sponsoring company in
   this dataset has zero approvals. The 0.3 has only been exercised on a
   constructed row. Whether it is the right number is untested and is a
   judgment.
3. **Skip rate is 0% on the real data.** The liveness gate never runs without
   live-network approval, so every role gets 1.0. The pre-filter admits only
   companies that already sponsored ML titles, whose `sponsorship.p` ranges
   from 0.839 to 0.9995.
4. **Recommendation and rank disagree.** Apply versus Consider is decided by
   two things, funding stage and tier, not funding stage alone. Every Likely-tier company
   is a Consider, yet some rank near the top. REFUELAI INC is 13th at 0.495,
   ahead of 77 Apply companies, while BUTLR TECHNOLOGIES INC is an Apply at
   116th with 0.348.
5. **Most of the ranking is ties.** There are only 92 distinct composite
   scores for 183 companies, and 121 companies share their exact score (to
   four decimals) with at least one other. Rounded to three decimals, 25
   companies sit at 0.273 and 20 at 0.420. Within a tie, order follows the
   CSV's row order, not any evidence.
6. **The lag's input is questionable for large companies.** The stage that
   selects the 56-day lag comes from SEC Form D matching. Microsoft is
   recorded as "Series D+" with $270.3M total funding, which can't describe
   Microsoft itself. It most likely belongs to a related entity matched by
   name; that is an inference, not checked.
7. **Fit is weakest where it matters most.** Ranks 181–183 are "Senior
   Applied Scientist", "Staff Applied Scientist" and "Senior NLP Research
   Scientist", among the closest matches to this student's background.

### Unresolved observation: counts that look doubled

While the thin-record prior was being built, the small-count rows looked
wrong. In the 1,557-row H-1B subset:
- no company has exactly 1 decision (approvals + denials);
- every company with 1–2 decisions has an even total, either 2 approvals and
  0 denials (313 companies) or 0 approvals and 2 denials (4 companies);
- the fifth zero-approval company has 0 approvals and 4 denials.

A source with real single-petition employers would be expected to have many
1-decision companies. This pattern is consistent with counts being doubled
somewhere upstream, for example by a join that duplicates rows. That is an
inference, not verified. It was not investigated here. If it is real, every
small-sample shrinkage and tier boundary in this build is affected, and so
is the claim that only 5 companies have zero approvals. It is flagged for a
maintainer of the sponsorship dataset, outside this recipe's scope.

### One concrete next step

Test a rule that sends a zero-approval company with at least one denial to
**Skip**, regardless of p. A weaker version of this rule already exists. The
scorer already caps the Unknown tier at Consider: it is one of its "soft
spot" tiers (`scripts/score/role-scorer.mjs:48`), so "never Apply" is not the
missing piece. A prior can lower p, but a prior alone can't push a
company with good fit and timeline below the Skip line without making the
0.3 implausibly low.

The rule would make "denied, never approved" a gate rather than a vote. The
scorer gates only on liveness and timeline; sponsorship is a weighted vote.
So the rule needs a sponsorship gate in the scorer. This recipe uses that
scorer as-is, so the change needs to be proposed and approved separately, not
patched in here. The test would be that the 0-for-2 break
case becomes Skip while worked-run-4's 87 / 96 / 0 on the real 183 stays
unchanged. If it passes, the 0.3 prior should be re-examined: once the gate
catches the dangerous case, the prior may no longer need to carry it.

## Attestation
- Recipe: omraut888-ml-h1b-timeline v0.1.0
- By: Om Raut · 2026-10-01

### Tested
| Ran | Saw | Expected |
|---|---|---|
| Fresh clone of the branch at `4df0ec9`, `npm ci`, then `npm run doctor` and `npm run verify` before any run (TEST-REPORT steps 1–2) | both exit 0; environment runnable; no private paths tracked; 163 files conform; manifest check passed with 3 warnings; `npm ci` changed 0 files | a clean checkout that installs and passes the repository's own checks |
| Build and score on the real data in that clone (`build_roles.py`, then `npm run score`; TEST-REPORT steps 3–4) | 183 roles from 1,557 H-1B rows; Apply 87 · Consider 96 · Skip 0 | the build runs and the scorer accepts every role record |
| Build and score on the real data with the final design (worked-run-4; build script identical to `3745eb5`) | 183 roles; tiers Proven 134 · Likely 49 · Unknown 0; Apply 87 · Consider 96 · Skip 0; prior 0.9812 recorded in the build audit | the same 183 roles; the corrected prior recorded with its source |
| `test_build_roles.py` at `4df0ec9`, at `3745eb5`, and at `2569346` with ResourceWarning promoted to an error (`python3 -W error::ResourceWarning -X dev`) | 19 tests OK; 21 tests OK with one ResourceWarning printed; 21 tests OK with no warnings | all tests pass, with no warnings |
| Failure case 6a: closing bracket removed from ACV AUCTIONS INC's title list in a CSV copy | 182 roles built; `skipped.unparseable-titles` = 1, naming ACV AUCTIONS INC; no crash | the row counted and named as skipped, every other company still built |
| Failure case 6b: persona copy with `opt_end_date` 2026-09-01, before the 2026-09-30 as-of date | usable days 0; all 183 timeline factors exactly 0.0; all 183 gated to Skip | 0 days, factor 0.0 rather than negative or an error, every role Skip |
| Failure case 6c: build run with sockets disabled, so any network call would raise | build completed; 183 roles with `liveness_checked: false`; live-network approval still open | no network access attempted; liveness labeled unchecked |
| **Deliberate break attempt:** CSV copy with REFUELAI INC overwritten to 0 approvals, 2 denials, built and scored under the original prior (`18884eb`) | `sponsorship.p = 0.699`; composite 0.3946; rank 109 of 183; Consider; above MICROSOFT CORP (0.2656, 12,226 approvals). The 0-approvals, 0-denials variant scored the prior itself, 0.979, rank 15 | a crash, or a low sponsorship score |
| Each fix against the same break case and the real 183: volume-weighted prior; thin-record prior; fixed 0.3 prior | p 0.7009 (rank 109); p 0.703 (rank 109); p 0.2143 (rank 179, Consider). Real data 87 / 96 / 0 after each | a fix that lowers the break case's p well below the near-98% prior without changing real recommendations |
| Break case under the final design at `3745eb5`, both variants | 0-for-2: p 0.2143, composite 0.225, rank 179, Consider; 0-for-0: p 0.3, composite 0.255, rank 177, Consider; both below Microsoft | a low score, below established sponsors |
| Hand check of ACV AUCTIONS INC: raw CSV row against worked-run-4's role record and score | 22 approvals, 0 denials; p = (22 + 5 × 0.9812) / 27 = 0.9965; fit 0.25; timeline 36/56 = 0.6429; composite 0.2724, Consider. Every term matched the build to four decimals | every computed term reproducible by hand from the raw row |
| `npm run doctor` and `npm run verify` after the run in the fresh clone (TEST-REPORT steps 7–9), and again on 2026-10-01 in the working tree at `8eb1254` | identical to before; `git diff --stat` showed no tracked file changed by the run. At `8eb1254`: doctor exit 0, no private paths tracked; verify exit 0, 163 files conform, 3 manifest warnings | checks unchanged by running the build; still passing after the fix |
| Fresh clone of the pushed branch at `744a687` (the attestation commit), `npm ci`, then `npm run doctor` and `npm run verify`, build and score on the real data, the test suite with ResourceWarning promoted to an error, then doctor and verify again | `npm ci` exit 0, 0 files changed; doctor and verify exit 0 before and after, with identical output (no private paths tracked; 163 files conform; 3 manifest warnings); 183 roles, Proven 134 · Likely 49 · Unknown 0; Apply 87 · Consider 96 · Skip 0; 21 tests OK, no warnings; `roles.json`, `build-audit.json`, `role-scores.json` and `role-scores.md` byte-identical to the committed worked-run-4 | the final commit reproduces worked-run-4 exactly from a clean checkout |

### Did not test
- **The fixed 0.3 zero-approval prior on any real company.** No ML-sponsoring
  company in the data has zero approvals. It has run only on the constructed
  break case.
- **Whether the sponsorship counts are doubled.** No company has exactly 1
  decision and every thin record is even. Whether that is real upstream
  doubling or benign was not investigated.
- **The live-network ATS-detection step itself.** `scripts/ats/detect-ats.py`
  was never run. Only the refusal was tested (6c): the build makes no network
  call without approval.
- **The proposed `role_quality` weight.** The 0.15 weight with renormalized
  weights was never implemented, run or tested.
- **The proposed persona patch.** The `Smart E-Commerce` RAG project was
  never added to the persona; every run used the unmodified persona.
- **Two failure modes in the same run.** The failure cases were tested only
  one at a time; for example, an unparseable title together with a closed OPT
  window on the same dataset was never run.
- **A path from the break case to Skip.** No change that would send a
  zero-approval company with denials to Skip was built or tested.

### Broke during testing, fixed
- **The keyword `llm` matched inside "Fulfillment".** This was found in the
  first runs' matched titles. It admitted KEEPE UP INC ("Fulfillment
  Operations Lead") and NOHO HEALTH INC ("Fulfillment Shift Manager"). It was
  fixed with whole-word keyword matching in `build_roles.py` (`TITLE_KEYWORDS`),
  with a test, `test_no_match_inside_other_words`. That took the count from
  185 to 183 (`4df0ec9`).
- **The equal-weighted sponsorship prior.** The deliberate break attempt
  showed that a 0-approvals, 2-denials company scored 0.699 and outranked
  Microsoft. The prior was replaced with a volume-weighted prior (0.9812), plus
  a fixed `your-input` prior of 0.3 for zero-approval companies, in
  `build_roles.py` (`sponsorship_prior`, `ZERO_APPROVAL_PRIOR`). Two tests were
  added. The recipe, the card and `build-audit.json` document it (`3745eb5`).
- **An unclosed fixture file in the new zero-approval test.** A
  `ResourceWarning` appeared in the test output at `3745eb5`. It was fixed with
  a context manager in `test_build_roles.py`, and confirmed by rerunning with
  ResourceWarning promoted to an error: 21 tests, no warnings (`2569346`).
