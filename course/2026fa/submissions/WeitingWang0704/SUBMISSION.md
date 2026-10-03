# SUBMISSION

**Assignment:** The Reallocation Engine — Recipe Design Assignment
**Student:** Weiting Wang
**GitHub handle:** WeitingWang0704

**Domain / situation:** An international master's student in computer science
specialising in game programming (Unity / real-time 3D), on F-1 OPT, looking for
a first game programmer role and needing an employer who will later file an
H-1B. Target occupation **SOC 15-1252, Software Developers**.

**Recipe path:**
`recipes/cases/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252.md`
(card: `…-game-dev-h1b-soc-15-1252.card.md`)

**Prototype command** (one command, from the repository root):

```sh
node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/postings.sample.json \
  --liveness scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/fixtures/liveness.sample.json \
  --opt-end 2027-01-31 \
  --hiring-lag-days 75 \
  --soc 15-1252 \
  --out-dir course/2026fa/submissions/WeitingWang0704/runs
```

Tests (offline, no network):

```sh
node --test scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.test.mjs
```

**GitHub repository:** https://github.com/WeitingWang0704/the-reallocation-engine
**Branch:** `contrib/2026fa-WeitingWang0704-game-dev-h1b-soc-15-1252`
**PR URL:** https://github.com/nikbearbrown/the-reallocation-engine/pull/36
**Submitted commit SHA:** `526a792ed6426d8d1234f6710a82494483de548b`

That is the commit carrying all 27 files of this submission, and it is the
commit the PR was opened against. A single follow-up commit on the same branch
adds the two lines directly above — the PR URL and this SHA — which a commit
cannot contain about itself. The ZIP uploaded to Canvas is built from the branch
including that follow-up commit, so its contents match the PR's head; the
`git log` on the PR's Commits tab shows both.

**Lifecycle stage claimed:** `DRAFT` · `last_gate: null` · `attestation: null` ·
`todos_open: 2`.

The sample run completes, `npm run verify` and `conformance` pass, and the run
is logged — which is the evidence `SPECIFIED → RUNNABLE-SAMPLE` asks for. The
status is nonetheless `DRAFT`, because `DRAFT → SPECIFIED` requires zero open
`[TODO]` items and two are open: a curated games-studio list that does not
exist, and the `role-scorer.mjs` exports that are not mine to add. Raising the
status without closing them would be, in SNICKERDOODLE's words, "a violation,
not a promotion".

## Summary of my changes

A recipe, a human card, and a rough prototype that turns a shortlist of
game-studio postings into a sourced Apply / Consider / Skip — or refuses to
score a posting and says what would unblock it.

The prototype reads the 80 Days CSV and the BLS compact file, infers the games
sector from company-name keywords (labelled `model-judgment`, because the CSV
has 24 industry labels and none is games), looks up H-1B history, computes a
timeline factor from a stated OPT date and hiring-lag assumption, and emits a
`roles.json` for the repository's own `scripts/score/role-scorer.mjs`, which it
runs as a CLI. It contains no copy of the composite. It writes two outputs — a
JSON log for an agent and a Markdown report for a person — and labels every
value `record`, `model-judgment` or `your-input`.

Gates: an unchecked posting is **not scored**; a company absent from the CSV
gets **no sponsorship number at all**, not a zero and not a prior; a past OPT
date exits 3 and writes nothing. 16 offline tests, including a deliberate break
attempt in which the strongest record in the dataset plus a perfect fit plus a
dead posting returns `Skip` with composite `0`.

Files: `recipes/cases/2026fa/` (recipe + card),
`scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/` (prototype,
tests, fixtures, README), `logs/runs/2026fa-WeitingWang0704-1.md`, and
`course/2026fa/submissions/WeitingWang0704/` (brief, justification, worked run,
test report, sector verification, frictional log, sources, PR body). 27 files,
5,222 insertions, **0 deletions and 0 modifications** — no existing file is
touched.

## Known limitations

**The scored rows have no verified liveness.** Two real postings were checked
with `npm run ats:liveness` and both came back `expired`; both belong to
companies outside the CSV and blocked before scoring. Of the six rows that
reached the scorer, zero carry a liveness value anyone observed. Every report
states this at the top.

**The dataset does not contain most well-known game employers.** Of fourteen
checked, one is genuinely present (Roblox). The CSV is built from SEC startup
filings, which public-company subsidiaries do not make. The same test on life
sciences and large technology returns the same pattern, so the limit belongs to
the data source rather than to this domain — but it means the recipe triages the
**funded-private-studio slice** of the games sector, which is how it is now
named.

**The sector claim is a keyword match and it is wrong sometimes.**
`Peloton Interactive Inc` passed the filter and scored level with a real AAA
studio. A hand check of all five companies is in `SECTOR-VERIFICATION.md`: four
right, one wrong.

**The sample run skips 17%**, below the engine's "at least half". Recorded, not
tuned away. The repository's own shipped example scores 40% on the same command.

**Role quality is shown but never scored**, because `role-scorer.mjs` weights it
`0.0` and tags it `[VERIFY]`. No weight is proposed.

**An absent H-1B record is a stated prior of `0.35`, labelled
`model-judgment`.** That is the number in this submission most worth arguing
with, and it governs the skip rate.

## CI note

The `harness-regression` job in `.github/workflows/contrib-gate.yml` references
four scripts that do not exist on `main`, so it is expected to fail on this PR
for reasons unrelated to its contents. `npm run verify`, `npm run doctor`,
`node scripts/conformance.mjs` and the test suite all pass; `node scripts/pii-scan.mjs`
reports one finding that is present in `HEAD:package-lock.json` and is not
introduced by this branch.
