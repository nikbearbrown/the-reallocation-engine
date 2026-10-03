# Run log — 2026fa · WeitingWang0704 · entry 1

### 2026-10-03 — game-dev-h1b-soc-15-1252 — first sample run of the games-sector sponsorship triage

**Commands run** (full capture in `course/2026fa/submissions/WeitingWang0704/local-run.txt`)

```
node --test scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.test.mjs
→ tests 16 · pass 16 · fail 0 · duration_ms 1746.3

node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings .../fixtures/postings.sample.json --liveness .../fixtures/liveness.sample.json \
  --opt-end 2027-01-31 --hiring-lag-days 75 --soc 15-1252 \
  --out-dir course/2026fa/submissions/WeitingWang0704/runs
→ ✓ scored 6 roles → Apply 1 · Consider 4 · Skip 1 (skip 17%)
→ ! liveness: 2/9 postings actually checked (0/6 of the scored rows); 7 synthetic
    and labelled model-judgment, not record
→ ✓ triage: 6 scored, 4 blocked at a gate

npm run verify   → exit 0 (3 warnings, all pre-existing on main)
npm run doctor   → environment: ✓ runnable
node scripts/conformance.mjs <all four namespaces> → 26 files · ✓ all conform
node scripts/pii-scan.mjs → 1 finding, package-lock.json — pre-existing in HEAD
```

**Inputs** — `fixtures/postings.sample.json` (10 postings at 8 companies; the
companies are real CSV rows, the job titles and URLs invented except for two real
liveness-checked posting URLs), `fixtures/liveness.sample.json` (9 entries, 2 of
them observed and flagged `synthetic: false`), `--opt-end 2027-01-31`,
`--hiring-lag-days 75`, `--soc 15-1252`.

**Result** — 6 scored (Apply 1 · Consider 4 · Skip 1), 4 blocked at a gate, skip
rate **17%**. The scorer flagged that itself: `(below the ~50% a healthy run
skips; check the inputs)`. Blocked: `azra-tools-006` at `GATE_2_LIVENESS` (no
liveness entry), `lanternfish-engine-008` at `NOT_IN_RECORD` (company absent
from the 30,369-row CSV).

**Verified vs inferred** — `record`: all H-1B approvals, denials, approval rates
and sponsored job titles; funding dates, stages and amounts; the SOC 15-1252 row;
the scorer's weights and arithmetic. `model-judgment`: every claim that a
company is a game employer (keyword match — the CSV has no games industry
label); the `p = 0.35` prior for a company with no H-1B row; my tier cut-offs;
all `fit` values. `your-input`: `--opt-end`, `--hiring-lag-days`, and the
resulting timeline factor `0.600`, which multiplies every composite in the run.
`liveness` prints as `record` and in this run that is false of the values —
the input declares itself synthetic and both outputs say so.

**Break attempt** — fed the strongest sponsorship record in the dataset
(`proven`, `p = 0.9`) with a perfect self-assessed fit and a dead posting.
Result `Skip`, composite `0`, arithmetic `(0.9·0.35 + 1·0.3) × 0 × 0.6 = 0.000`.
Gates behave as multipliers. Also ran a past OPT end date (`E_OPT_DATE_PAST`,
exit 3, output directory never created) and an unknown SOC (`E_SOC_NOT_FOUND`,
exit 3).

**What was wrong**

1. A date-rounding bug: the timeline used the current clock rather than UTC
   midnight, so the same run on the same day could report 119 or 120 days of
   runway. Fixed. The correction moved the factor from `0.587` to `0.600` and
   `Manticore Games` from `Consider` to `Apply` — one assumed day flipped a
   decision.
2. The liveness fixture claimed in its header to have been recorded with
   `npm run ats:liveness`. Nobody had run it and the URLs were invented. Caught
   while tracing provenance for the worked run. Fixed in the data, in the code
   (`_synthetic` flag, warning on stderr, banner in the report,
   `liveness_is_synthetic` in the JSON) and in the recipe text.
3. Gate 1 over-matched exactly as `CHANGE-BRIEF.md` predicted:
   `Peloton Interactive Inc` passed on the word "Interactive" and scored level
   with a real studio. Hand check of all five companies in
   `SECTOR-VERIFICATION.md` — four right, one wrong.
4. `Roboto Games Inc` has sponsorship approvals whose recorded title is
   `Director of Product Management`. The report says so in bold; the score
   ignores it. Named as the next improvement, not patched before the deadline.

**Engine baseline** — `npm run score` on the repository's own
`data/examples/ch11-roles.json` returns `5 roles → Apply 2 · Consider 1 · Skip 2
(skip 40%)`, i.e. the shipped example also sits below the "at least half"
standard. `npm run ats:scan -- --dry-run` fails on a fresh clone with
`Error: portals.yml not found. Run onboarding first.` — a gap not listed in
DOMAIN.md §Known gaps, found while following the assignment's "Before you
start" steps; this recipe calls neither command.

A third gap, and the one worth reporting upstream: `npm run ats:liveness` dies
on a fresh clone with `browserType.launch: Executable doesn't exist`, because
Playwright's browser binaries are downloaded separately and no setup document
in this repository mentions `npx playwright install`. `npm run doctor` prints
`✓ playwright installed` on the same machine, because `has()` in
`scripts/doctor.mjs` only resolves the npm package. The environment check
passes while the command cannot start. Fixed locally with
`npx playwright install chromium`, after which liveness ran against two real
game-studio Greenhouse postings and those results replaced the synthetic values
for the rows they cover.

**Coverage finding** — the two real postings that could be liveness-checked
(`Insomniac Games`, `Cat Daddy Games`) are both absent from the 80 Days CSV. Of
14 well-known game employers searched by hand, 1 is genuinely present (Roblox;
the `VALVE` hits are medical and industrial valve companies, `TAKE TWO CO` is an
unrelated 2021 California company). The CSV is built from SEC startup filings,
which public-company subsidiaries do not make — so the recipe covers the
funded-private-studio slice of the games sector, not the sector. Recorded in the
recipe, the card and WORKED-RUN.

**PII scan incident** — pasting `pii-scan`'s own output into the test report
copied the `package-lock.json` email address into three submission files and
took the scan from 1 finding to 4. Redacted with one inserted character and a
visible note in each file; scan back to the single pre-existing finding. A
report about PII is still a place PII can land.

**Gate status** — no gate has been cleared by a human. G1 (sector) was checked by
hand after the fact, outside the engine, and found one false positive. G2
(liveness) is untested: no posting was checked and the fixture is synthetic. G3
(timeline) rests on two assumptions nobody has signed off. `status` claims
`DRAFT`: the sample-run evidence for `SPECIFIED → RUNNABLE-SAMPLE` is in hand,
but two typed `[TODO]`s are open and `DRAFT → SPECIFIED` requires zero.
`last_gate` and `attestation` both stay `null`.
