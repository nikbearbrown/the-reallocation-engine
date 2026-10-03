# game-dev-h1b-soc-15-1252 — games-sector sponsorship triage

A rough prototype for one recipe:
[`recipes/cases/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252.md`](../../../../recipes/cases/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252.md).

It takes a list of game-studio job postings and returns a sourced
Apply / Consider / Skip per posting, plus a list of postings it refused to
score and why. It is built for an international master's student in computer
science specialising in game programming, looking for a first game programmer
role under F-1 OPT and needing an employer who will later file an H-1B.

## Run it

One command, from the repository root:

```sh
node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/postings.sample.json \
  --liveness scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/liveness.sample.json \
  --opt-end 2027-01-31 \
  --hiring-lag-days 75 \
  --soc 15-1252 \
  --out-dir course/2026fa/submissions/WeitingWang0704/runs
```

Tests (offline — no host is contacted):

```sh
node --test scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.test.mjs
```

`--out-dir` is required and must point inside your own namespace. The scorer
overwrites `role-scores.json` in whatever directory it is given; pointing it at
a tracked example would dirty the diff.

`--today YYYY-MM-DD` exists so a run can be reproduced on a later date. Without
it the run uses today's date at UTC midnight.

There is no `npm run` entry for this. `package.json` is a protected path in
`.github/workflows/contrib-gate.yml` — a student PR that edits it fails the
contrib gate — so the documented command is the full `node` path above.

## Outputs

Two files, because one file cannot serve both readers:

| File | For | Contains |
|---|---|---|
| `triage.json` | the agent | every value, its label, every assumption, the blocked list, the scorer's full audit trace |
| `triage-report.md` | the person | the decision table, what is a record and what is not, the gate list, the next action per row |

The repository's scorer also writes `roles.json`, `role-scores.json` and
`role-scores.md` into the same directory. Those are its output, not mine.

## What it reads

| Path | Used for | Label |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | sponsorship history, funding recency | `record` |
| `data/bls/compact/soc_occupation_compact.csv` | the SOC 15-1252 row | `record` |
| `scripts/score/role-scorer.mjs` | the composite — run as a CLI | — |
| `fixtures/liveness.sample.json` | liveness, checked by a human beforehand | `record` (see warning below) |
| `--opt-end`, `--hiring-lag-days` | the timeline gate | `your-input` |
| company name / website keywords | the games-sector claim | `model-judgment` |

Nothing here reads `private/`, `search/resume.json`, or `data/ats/`. The
postings fixture is a fictional shortlist; the one invented company uses an
`example.com` domain. The real companies in it are public CSV rows, not
anyone's personal data.

## It does not re-implement the scorer

`CONTRIBUTING.md` offers two routes: import `role-scorer.mjs`'s exports
(`CONFIG`, `SRC`, `applyProfile`, `scoreRole`), or run the CLI and read
`role-scores.json` back. The first route does not exist — that file contains no
`export` statements as of commit `015843d` — so this prototype uses the second.
`runRepoScorer()` spawns `node scripts/score/role-scorer.mjs` and parses its
output. There is no copy of the composite anywhere in this folder.

## Named failure cases

Each one was run deliberately; see `TEST-REPORT.md` in the submission folder.

| Case | Behaviour | Exit |
|---|---|---|
| Company absent from the CSV | `NOT_IN_RECORD`, blocked, no sponsorship number emitted at all | 0 |
| Company present, H-1B columns empty | tier `unknown`, probability labelled `model-judgment`, report states that an absent record is not evidence of non-sponsorship | 0 |
| Sponsored, but no engineering title in `top_job_titles_sponsored` | surfaced in the report next to the score | 0 |
| Posting liveness never checked | blocked at Gate 2, not scored, not defaulted to alive | 0 |
| `--opt-end` already in the past | `E_OPT_DATE_PAST`, no output files written | 3 |
| `--soc` with no row in the BLS CSV | `E_SOC_NOT_FOUND`, no wage invented | 3 |

## What it cannot do

**It cannot tell you a company is a game studio.** The CSV has 24 industry
labels and none of them is games. The sector claim is a keyword match on the
company name and website, labelled `model-judgment` everywhere it appears.
It over-matches — `Peloton Interactive Inc` passes the filter and is not a game
company — and it under-matches, because a studio whose legal name contains no
games word is invisible to it. The output is a flagged list for a person to
confirm, not a filter to trust.

**It cannot tell you anything about a studio the CSV does not contain, which is
most of the famous ones.** Of 14 well-known game employers checked on
2026-10-03, one is genuinely present (Roblox). EA, Activision, Riot, Epic,
Blizzard, Ubisoft, Zynga, Bungie, Naughty Dog, Respawn, Insomniac and Cat Daddy
are absent; the `VALVE` matches are heart-valve and industrial companies. The
dataset is built from SEC startup filings, which public-company subsidiaries do
not make. **This triages funded private studios, not the games sector.**

**It cannot tell you a company does not sponsor.** Only 1,557 of 30,369 rows
(5.1%) carry an H-1B approvals value. For the other 94.9% the script uses a
stated prior of 0.35 and labels it `model-judgment`. That prior is a guess, and
it is the single number in this prototype most worth arguing with.

**It cannot check liveness.** That needs the network, and these tests must run
offline. Liveness becomes a record only when a human runs
`npm run ats:liveness -- <url>` and writes down what they saw.

**The shipped liveness fixture is synthetic and nobody checked it.** The
`example.com`-style board URLs in `fixtures/liveness.sample.json` resolve to
nothing and no liveness check was ever run against them. The prototype labels
liveness `record` because that is what the field means *in real use*; in the
sample run that label is true of the file format and false of the numbers. A
real run replaces that file before any of its values are cited as evidence.

**It does not score role quality.** `role-scorer.mjs` sets the `role_quality`
weight to `0.0` and tags it `[VERIFY]`. Passing a role-quality vote would look
like evidence while contributing exactly nothing to the composite, so the BLS
wage and cognitive-pivot numbers are shown in the human report and never sent
to the scorer. Proposing a weight is an authorial decision about the book's
model, not mine to make in a contrib folder.

**It does not join Form D.** A fresh clone ships 4 quarters × 50 sample
companies. Funding recency comes from the CSV's own `latest_funding_date`
column, which is Form D-derived upstream. The samples are not large enough to
join against a games shortlist and the script does not pretend otherwise.

## The number most likely to mislead you

The timeline gate. `--opt-end` and `--hiring-lag-days` are both assumptions,
and between them they multiply every composite in the run. During testing,
correcting a date-rounding bug moved the runway from 119 days to 120, the
factor from 0.587 to 0.600, and one role from `Consider` to `Apply`. One day of
assumed runway flipped a decision. Read the arithmetic line in the report
before you believe the table under it.
