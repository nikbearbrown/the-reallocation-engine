# WORKED RUN — game-dev-h1b-soc-15-1252

Weiting Wang · GitHub `WeitingWang0704` · 2026-10-03
Branch `contrib/2026fa-WeitingWang0704-game-dev-h1b-soc-15-1252`
Recipe `recipes/cases/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252.md` v0.1.0

## The scenario

A fictional persona: an international master's student in computer science
specialising in game programming, on F-1 OPT with an assumed window closing
**2027-01-31**, looking at eight game-studio postings and deciding where the
next hour goes. Target occupation **SOC 15-1252, Software Developers**.

The persona is fictional by requirement, not by convenience: the repository's
zero-conditions forbid a real résumé, a real contact, or a real visa date from
entering the branch at all, including in history.

## Inputs

| Input | Value | Where it came from |
|---|---|---|
| Postings | 10 roles at 8 companies | 8 hypothetical (real CSV companies, invented titles and URLs) + 2 real posting URLs that were actually liveness-checked |
| Liveness | 9 of 10 postings | 2 observed with `npm run ats:liveness` on 2026-10-03 (`synthetic: false`); the other 7 synthetic, nobody checked them |
| `--opt-end` | `2027-01-31` | invented for the persona |
| `--hiring-lag-days` | `75` | stated assumption about game-industry hiring cycles |
| `--soc` | `15-1252` | the BLS code game programmers fall under |

## Commands and their real output

```
$ node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
    --postings .../fixtures/postings.sample.json \
    --liveness .../fixtures/liveness.sample.json \
    --opt-end 2027-01-31 --hiring-lag-days 75 --soc 15-1252 \
    --out-dir course/2026fa/submissions/WeitingWang0704/runs

✓ scored 6 roles → Apply 1 · Consider 4 · Skip 1 (skip 17%)
  course/2026fa/submissions/WeitingWang0704/runs/role-scores.json  +  .../role-scores.md
  ! liveness: 2/9 postings actually checked (0/6 of the scored rows); 7 synthetic and labelled model-judgment, not record
✓ triage: 6 scored, 4 blocked at a gate
  course/2026fa/submissions/WeitingWang0704/runs/triage.json  +  .../triage-report.md
```

The repository's scorer, which this prototype calls rather than copies:

```
# Role Scorer report — 2026-10-03

*Bayesian Role Scorer (Ch.11). Weights: sponsorship 0.35, fit 0.3, role_quality 0
[role_quality weight is **[VERIFY]** — not pinned by the chapter]. Threshold 0.3.
Profile requires sponsorship.*

**Summary:** 6 roles → Apply 1 · Consider 4 · Skip 1. **Skip rate 17%** (below the
~50% a healthy run skips; check the inputs).

| Role | Composite | Rec | Audit (term · value · weight · source) |
|---|---|---|---|
| Manticore Games — Gameplay Programmer | 0.333 | **Apply** | sponsorship 0.9·0.35 [record]; fit 0.8·0.3 [model-judgment] × liveness 1[record]×timeline 0.6[your-input] |
| That's No Moon — Associate Gameplay Engineer | 0.279 | **Consider** | sponsorship 0.6·0.35 [record]; fit 0.85·0.3 [model-judgment] × liveness 1[record]×timeline 0.6[your-input] |
| Peloton Interactive — Software Engineer | 0.279 | **Consider** | sponsorship 0.9·0.35 [record]; fit 0.5·0.3 [model-judgment] × liveness 1[record]×timeline 0.6[your-input] |
| Roboto Games — Gameplay Engineer | 0.261 | **Consider** | sponsorship 0.6·0.35 [record]; fit 0.75·0.3 [model-judgment] × liveness 1[record]×timeline 0.6[your-input] |
| Azra Games — Unity Engineer | 0.217 | **Consider** | sponsorship 0.35·0.35 [model-judgment]; fit 0.8·0.3 [model-judgment] × liveness 1[record]×timeline 0.6[your-input] |
| Manticore Games — Senior Gameplay Programmer | 0.000 | **Skip** | sponsorship 0.9·0.35 [record]; fit 0.7·0.3 [model-judgment] × liveness 0[record]×timeline 0.6[your-input] |
```

Blocked, never scored:

```
| Azra Games Inc | Tools Programmer | `GATE_2_LIVENESS` | run npm run ats:liveness and add the result |
| Lanternfish Studios Inc | Engine Programmer | `NOT_IN_RECORD` | outside the dataset; research by hand or drop — do not assume either way |
```

Full terminal capture for every command, including the baselines and the
failure cases: `TEST-REPORT.md` and `local-run.txt` in this folder.

## Verified vs inferred, line by line

### Verified — read from a shipped file, unmodified

| Value | Source |
|---|---|
| `Manticore Games` 10 approvals, 0 denials, 100% rate | `mapped_student_employment_targets_v3.csv` |
| `That's No Moon` 2 approvals, 100%, title `Associate Gameplay Engineer` | same |
| `Roboto Games` 4 approvals, 100%, title `Director of Product Management` | same |
| `Peloton Interactive` 310 approvals, 8 denials, 97.5% rate | same |
| `Azra Games` Series B, 2024-06-27, $42,718,597 | same |
| `Azra Games` H-1B columns **empty** | same — the absence is itself a record of coverage |
| `Lanternfish Studios` **not present** in 30,369 rows | same |
| SOC 15-1252, Software Developers, 2024 median $133,080, cognitive-pivot 3.834 | `soc_occupation_compact.csv` |
| Weights 0.35 / 0.30 / **0.0**, threshold 0.30 | `scripts/score/role-scorer.mjs` |
| Every composite and its arithmetic | the scorer's own trace |

### Inferred — model-judgment, produced by this prototype or by me

| Value | Why it is not a record |
|---|---|
| "These six companies are game employers" | a keyword match on the company name; the CSV has 24 industry labels and none is games |
| `Azra Games` sponsorship `p = 0.35` | a stated prior for a company with no H-1B row. 94.9% of CSV rows are in this state |
| Tier boundaries (`≥10 approvals and ≥80%` → proven) | my cut-offs; nothing in the repository pins them |
| `fit` 0.50–0.90 per role | self-assessed guesses for a fictional persona |
| "Engineering title present / absent" | substring matching on a title string |

### Your-input — assumptions a human must agree to

| Value | Effect |
|---|---|
| `--opt-end 2027-01-31` | with the lag, fixes the timeline factor at 0.6 |
| `--hiring-lag-days 75` | same |
| timeline factor `0.600` | **multiplies every composite in the run** |

### The one label that is wrong in this run, and says so

`liveness` is printed as `[record]` on every row. In this run that is **false of
the values**: the liveness file is synthetic and no posting was checked. The
prototype detects `_synthetic: true` in its input, prints a warning to stderr,
sets `liveness_is_synthetic: true` in `triage.json`, and puts a block quote at
the top of `triage-report.md` saying the table is a demonstration and not advice
about these companies.

This is an honest limitation rather than a fixed defect: the label is correct
for the field's meaning in real use, and the only real fix is a human running
`npm run ats:liveness` against live postings.

## Verification — how I checked the output was real

**1. By hand, against the source CSV.** Pick the row the scorer gave the single
`Apply` and read it directly:

```
$ grep -i "^MANTICORE GAMES INC" data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv
MANTICORE GAMES INC,Other Technology,manticoregames.com,...,10.0,0.0,100.0,113000.0,['Technical Artist']
```

10 approvals, 0 denials, 100% — which is what makes it tier `proven`, `p = 0.9`,
and `0.9 × 0.35 = 0.315` of the vote sum. The number in the report is the number
in the file.

Note what the same row also says: the sponsored title on record is
`Technical Artist`, not a programmer title. The tool counts "Technical" as an
engineering fragment and does not flag it. That is a judgment call sitting
inside my keyword list, and a reader could reasonably disagree with it.

**2. Against a source outside the repository.** The CSV gives `Azra Games Inc` a
latest funding amount of `42718597.0`, Series B, 2024-06-27. Public reporting
describes Azra Games raising **$42.7 million** for a mobile RPG. An independent
source agrees with a figure this repository ships, to the precision the headline
carries. That is a check on the data, not on my code, and it covers the funding
column only — the H-1B columns come from different upstream sources (DOL LCA
disclosure data, USCIS H-1B Employer Data Hub) and were not cross-checked.

**3. By hand, on the thing the engine cannot verify.** I checked all five
companies against public sources to find out whether Gate 1's keyword guesses
were right. Four correct, one wrong — `Peloton Interactive Inc` is a
connected-fitness company. Written up with sources in `SECTOR-VERIFICATION.md`.

**4. By trying to break it.** The strongest sponsorship record in the dataset,
a perfect fit, and a dead posting: `(0.9·0.35 + 1·0.3) × 0 × 0.6 = 0.000` →
`Skip`. Also run against a past OPT date and an unknown SOC code; both exit `3`
and write nothing.

## Reflection

**What worked.** The gates did their job as multipliers rather than as opinions.
The one role with a dead posting came back `0.000` no matter how strong its
record, and the two postings that could not be evaluated honestly — one never
checked for liveness, one from a company outside the dataset — were refused
rather than guessed at. The distinction the whole recipe is built on is visible
in the scorer's own audit line without opening any JSON: five rows read
`[record]` in the sponsorship slot and `Azra Games` reads `[model-judgment]`.

**What it got wrong — three things.**

*The classifier is as weak as predicted, and I have the proof now.*
`CHANGE-BRIEF.md` prediction 1 said the keyword match would over-match on
"Interactive". `Peloton Interactive Inc` entered the shortlist with 310
approvals and a 97.5% approval rate and finished tied for second at `0.279`,
level with `That's No Moon Entertainment` — a real AAA studio. A student new to
the US market has no way to catch that from the table alone.

*Too few Skips, also as predicted.* Prediction 2 said a generous unknown-prior
would push everything into `Consider`. The run skipped 17% where the engine's
own standard is at least half, and the scorer printed its own complaint:
`(below the ~50% a healthy run skips; check the inputs)`. Four of six rows are
`Consider`, which is a way of deciding nothing — the opposite of reallocating
effort. I am recording this rather than tuning the prior until the number looks
better, because moving a threshold to produce a nicer distribution is exactly
the move the assignment warns against.

A second cause deserves naming, because blaming the prior alone would be too
flattering to the fixture. The eight postings were chosen to exercise code
paths, not to resemble a real shortlist: one dead posting, one unchecked
posting, one company outside the dataset, and five companies that all happen to
carry an H-1B record. In the CSV at large, **94.9% of rows have no H-1B record
at all**, and ghost postings are common enough that the engine treats liveness
as a gate. A realistic shortlist would produce far more `NO_SPONSORSHIP_RECORD`
rows and far more closed liveness gates, and its skip rate would be higher for
reasons that have nothing to do with my priors. So `17%` is a property of this
demonstration set as much as of the tool, and reporting it as the tool's skip
rate would overstate what one run of eight hand-picked rows can measure.

For calibration, the repository's own shipped example does not clear the bar
either:

```
$ npm run score -- data/examples/ch11-roles.json --out-dir .../engine-baseline
✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)
```

Five roles, 40% skipped, against a standard of "at least half". That is the
engine's own Chapter 11 worked example, not mine. It does not excuse `17%` —
`40%` is much closer to the standard than `17%` is — but it does suggest the
"at least half" figure describes a healthy *real* run over a wide shortlist,
not a small curated set built to illustrate the mechanics.

*Sponsorship for the wrong role does not cost anything.* `Roboto Games Inc` has
sponsored, but the recorded title is `Director of Product Management`. The
report prints that in bold — and the score ignores it. `Roboto` lands at
`0.261`, within `0.02` of `That's No Moon`, whose recorded sponsored title is
literally `Associate Gameplay Engineer`. The tool shows the most decision-
relevant fact it found and then declines to act on it.

**The finding that changes how I'd describe this recipe.** Late in the work I
ran `npm run ats:liveness` against two real game-studio postings, to stop Gate 2
being a gate that had never run. Both came back `expired` — two real ghost
postings on the first try. Then both rows blocked at `NOT_IN_RECORD`, because
neither `Insomniac Games` nor `Cat Daddy Games` is in the 80 Days CSV. Checking
fourteen well-known game employers by hand, exactly **one** is genuinely present
(Roblox; the `VALVE` matches are heart-valve and industrial companies, and
`TAKE TWO CO` is an unrelated 2021 California company).

The dataset's README says it was built from SEC startup filings joined to DOL
and USCIS sponsorship data. Form D is a private-placement filing; a studio owned
by a public parent does not file one. That inference is mine, but it predicts
what was observed: the CSV covers funded private studios and misses established
public-company studios almost entirely — and those are the employers with the
largest H-1B programmes, which is to say the ones most likely to sponsor.

So the recipe is narrower than its title suggests. It is not "games-sector
sponsorship triage"; it is **triage over the funded-private-studio slice of the
games sector**. For a student targeting Sony, EA or Activision it returns
`NOT_IN_RECORD` and nothing else. That is a limit of the data, not of the
pipeline, and the pipeline does the right thing with it — it refuses rather than
guesses — but a reader who took the title at face value would be misled, which
is why it is written into the recipe and the card as well as here.

**What I missed until late.** The liveness fixture I wrote claimed in its own
header to have been "recorded by hand with `npm run ats:liveness`". Nobody had
run it; the URLs were invented. The numbers being synthetic was fine — the
assignment expects sample data — but the file asserted a provenance that never
happened, which is the exact failure the recipe is supposed to prevent. I caught
it while tracing where each value came from for this document. The fix was not
only to correct the wording: the fixture now carries `_synthetic: true`, the
code reads that flag, and both outputs now declare it. A caveat that lives only
in a comment is a caveat that gets lost.

**One concrete next improvement, and what computing it revealed.** The obvious
fix is to demote the sponsorship tier when `top_job_titles_sponsored` contains
no engineering title — `proven` → `likely`, `likely` → `unknown`. It is a
principled tightening rather than threshold tuning: a filing for a product
director is weaker evidence for a gameplay programmer than a filing for a
gameplay engineer, and the composite should say so.

Then I worked out what it would actually do, instead of asserting it. `Roboto
Games` is tier `likely`; demoting it to `unknown` takes `p` from `0.6` to
`0.35`, and the composite from `0.261` to `(0.35·0.35 + 0.75·0.30) × 0.6 =
0.209`. The `Consider` floor is `0.20`. **The row stays `Consider` and the skip
rate does not move at all.** An earlier draft of this document claimed the
change would push Roboto to "roughly 0.167, below the Consider floor"; that
figure was estimated rather than calculated and it was wrong.

Two things follow. The fix is still right — it makes the composite reflect a
distinction the report already prints — but it is **not sufficient on its own**,
and anyone reading the first version of this paragraph would have been misled
about what one change buys. And the number that actually governs the skip rate
is the `0.35` unknown-sponsorship prior and the `0.20` Consider floor, not the
tier mapping. Changing either of those is threshold tuning, which needs an
argument this submission does not have, so neither is changed here.

The incident is worth more than the fix. A number asserted inside a reflection
on honesty is still an unverified number, and this one survived until it was
checked on a calculator.

## Attestation

- Recipe: game-dev-h1b-soc-15-1252 v0.1.0
- By: Weiting Wang · 2026-10-03

### Tested

| Ran | Saw | Expected |
|---|---|---|
| `node --test .../triage.test.mjs` | `tests 16 · pass 16 · fail 0`, no host contacted | all pass offline |
| sample run, 10 postings | `6 scored · Apply 1 · Consider 4 · Skip 1`, 4 blocked | some scored, some refused |
| `--opt-end 2026-01-01` (past date) | `E_OPT_DATE_PAST`, `exit=3`, output dir never created | refuse and write nothing |
| `--soc 99-9999` | `E_SOC_NOT_FOUND`, `exit=3` | refuse, invent no wage |
| invented company `Lanternfish Studios Inc` | `NOT_IN_RECORD`, no sponsorship value emitted | no number at all, not a zero |
| posting with no liveness entry | `GATE_2_LIVENESS`, not scored | blocked, never defaulted to alive |
| **break attempt:** best record + perfect fit + dead posting | `Skip`, composite `0`, `(0.9·0.35 + 1·0.3) × 0 × 0.6 = 0.000` | a closed gate beats any vote |
| **break attempt:** read every reported number back out of the source CSV by hand | `MANTICORE GAMES INC ... 10.0,0.0,100.0` matches the report | the report is not inventing figures |
| `npx playwright install chromium`, then `npm run ats:liveness` on 2 real postings | `Results: 0 active  2 expired  0 uncertain` | a real status either way |
| searched the CSV for 14 well-known game employers | 1 genuinely present (Roblox) | some coverage of the sector |
| `node scripts/conformance.mjs` on both namespaces | `✓ all conform` | conformant |
| `npm run verify` | `exit 0`, 3 pre-existing warnings | unchanged from `main` |
| `node scripts/pii-scan.mjs` | 1 finding, `package-lock.json — i@izs[.]me`, present in `HEAD` | nothing introduced by this branch |

### Did not test

- **Liveness for any posting that was actually scored.** Two real postings were
  checked and both were expired, but both belong to companies outside the CSV,
  so they blocked before the scorer. Of the six rows that reached the scorer,
  **zero** carry a checked liveness value. The report says so at the top.
- **Whether a live posting is detected as live.** Both real checks returned
  `expired`. The `active` branch of the checker was never exercised here.
- **Any Form D join.** Only 4 × 50 sample companies ship; funding comes from the
  CSV's own column.
- **`npm run bls:local-wage`.** Known to fail on a fresh clone; not called.
- **The CSV's H-1B columns against DOL or USCIS source data.** Only the funding
  column was cross-checked externally.
- **The tier cut-offs.** `≥10 approvals and ≥80%` → `proven` is asserted, never
  validated against outcomes. Nothing in this repository could validate it.
- **Behaviour on a CSV row whose `company_name` normalises to the same key as
  another company's.** First match wins and I did not look for collisions.
- **Node 20.** Tested on Node v24.15.0 locally and v22 in a second environment;
  CI runs 20.

### Broke during testing, fixed

- **Date rounding.** The timeline used the current clock, so the same run on the
  same day could report 119 days of runway or 120. The test said 120, the CLI
  said 119. Normalised `today` to UTC midnight. This was not cosmetic: the fix
  moved the factor from `0.587` to `0.600` and `Manticore Games` from `Consider`
  to `Apply`.
- **A fixture that claimed a provenance it did not have.** See "What I missed"
  above. Fixed in the data, in the code, and in both outputs.
- **Annotation row treated as a posting.** Adding an explanatory `_note` object
  to the postings fixture made the pipeline try to score it. Added a `skip` flag
  the loader honours.
- **Test invocation.** `node --test <directory>` fails on Node 22; the
  documented command names the test file explicitly.
- **Quoting the PII scanner made my own report fail the PII scan.** Pasting
  `pii-scan`'s output into `TEST-REPORT.md` — to prove the one finding was
  pre-existing — copied the email address into three of my own files, and the
  next scan reported four findings instead of one. Fixed by writing the address
  with one character inserted and adding a visible redaction note to each file,
  rather than by quietly dropping the evidence. The scanner was right both
  times; the mistake was treating a report about PII as if it were not itself a
  place PII can land.
