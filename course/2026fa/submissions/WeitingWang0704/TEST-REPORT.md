# TEST-REPORT — game-dev-h1b-soc-15-1252

Run by Weiting Wang on 2026-10-03, from a clean checkout of
`contrib/2026fa-WeitingWang0704-game-dev-h1b-soc-15-1252` on macOS
(Node v24.15.0, Python 3.14.2). Every block below is pasted terminal output,
not a description of it. The raw capture is `local-run.txt` in this folder.

## Toolchain baseline

`npm run doctor` — before and after the change produce the same summary; the
prototype adds no dependency, no npm script, and no new environment
requirement.

```
SUMMARY
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
```

`npm run verify`:

```
conformance: 167 files (88 md · 36 py · 32 js · 7 json · 4 sh)
✓ all conform (machine half of P4). Adequacy is still the human gate.
MANIFEST CHECK — The Reallocation Engine
==========================================

WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/

✓ manifest check passed (3 warnings)
verify exit: 0
```

Those three warnings are present on `main` before this branch exists. They are
about the repository's own `.gitignore`, not about anything added here.

Conformance, scoped to the two namespaces this branch touches:

```
conformance: 26 files (16 md · 8 json · 2 js)
✓ all conform (machine half of P4). Adequacy is still the human gate.
```

## Offline tests

```
node --test scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.test.mjs
```

```
✔ an unchecked liveness entry is labelled model-judgment, a checked one record (188.535292ms)
✔ nextAction routes a Consider to the networking hours, not the apply hours (0.144083ms)
ℹ tests 16
ℹ suites 0
ℹ pass 16
ℹ fail 0
ℹ duration_ms 1746.308416
```

16 tests, no network calls. The suite spawns one local process — the
repository's own `scripts/score/role-scorer.mjs` — and contacts no host.

What the tests deliberately do **not** assert: that any particular company ends
up with any particular verdict. Hardcoding "That's No Moon must be an Apply"
would test my preferences rather than the code. What is asserted is that a
record is labelled a record, that an absence is not, that a closed gate beats
strong votes, and that each named failure fails loudly.

## Sample run

```
node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
  --postings .../fixtures/postings.sample.json \
  --liveness .../fixtures/liveness.sample.json \
  --opt-end 2027-01-31 --hiring-lag-days 75 --soc 15-1252 \
  --out-dir course/2026fa/submissions/WeitingWang0704/runs
```

```
✓ scored 6 roles → Apply 1 · Consider 4 · Skip 1 (skip 17%)
  course/2026fa/submissions/WeitingWang0704/runs/role-scores.json  +  .../role-scores.md
  ! liveness: 2/9 postings actually checked (0/6 of the scored rows); 7 synthetic and labelled model-judgment, not record
✓ triage: 6 scored, 4 blocked at a gate
  course/2026fa/submissions/WeitingWang0704/runs/triage.json  +  .../triage-report.md
```

Ten postings in, six scored, four refused. The warning on line three is the
prototype counting, per entry, how many liveness values a person actually
observed — two of nine, none of them on a row that reached the scorer — and
saying so in both outputs rather than letting a fixture pass for an observation.

## Named failure cases, each exercised

**1. OPT end date already in the past** — expected: refuse, exit non-zero, write
nothing.

```
E_OPT_DATE_PAST: --opt-end 2026-01-01 is not in the future (today 2026-10-03). Refusing to compute a timeline factor from a date that has passed.
exit=3
ls: /tmp/should-not-exist: No such file or directory
```

The `ls` line is the part that matters: the output directory was never created.
A failure leaves no half-written artefact that could later be mistaken for a
result.

**2. SOC code with no row in the BLS file** — expected: refuse, invent no wage.

```
E_SOC_NOT_FOUND: SOC 99-9999 has no row in data/bls/compact/soc_occupation_compact.csv. Refusing to invent a wage or an ability level.
exit=3
```

**3. Company absent from the CSV** — `Lanternfish Studios Inc`, an invented
studio. Expected: no sponsorship number of any kind. From `triage-report.md`:

```
| Lanternfish Studios Inc | Engine Programmer | `NOT_IN_RECORD` | this company is outside the dataset; research it by hand or drop it — do not assume either way |
```

It is not scored, not given a prior, and not given a zero. Asserted in the test
suite as well: `assert.equal(r.p, null)`.

**4. Company present with empty H-1B columns** — `Azra Games Inc`. Expected:
tier `unknown`, probability labelled `model-judgment`, never `record`.

```
| Azra Games Inc | Unity Engineer | 0.217 | **Consider** | no H-1B row — prior 0.35 [model-judgment] | ... |
```

The scorer's own audit line for that row:

```
sponsorship 0.35·0.35 [model-judgment]; fit 0.8·0.3 [model-judgment] × liveness 1[record]×timeline 0.6[your-input]
```

Every other scored row reads `[record]` in the sponsorship slot. This one does
not, and the difference is visible without opening the JSON.

**5. Posting whose liveness was never checked** — `azra-tools-006`, deliberately
left out of the liveness file. Expected: blocked, not defaulted to alive.

```
| Azra Games Inc | Tools Programmer | `GATE_2_LIVENESS` | run: npm run ats:liveness -- <url> and add the result to the liveness file |
```

**6. Sponsored, but not for this kind of role** — `Roboto Games Inc` has 4
approvals at a 100% rate; the recorded sponsored title is
`Director of Product Management`.

```
| Roboto Games Inc | Gameplay Engineer | 0.261 | **Consider** | 4 approvals, rate 100.0% [record] · **no engineering title in past sponsorships** | ... |
```

Surfaced, not hidden — and also not yet allowed to change the score. See the
reflection in `WORKED-RUN.md`.

## Deliberate break attempt

The strongest sponsorship tier in the dataset, a perfect self-assessed fit, and
a dead posting.

```
✓ scored 1 roles → Apply 0 · Consider 0 · Skip 1 (skip 100%)
rec=Skip composite=0
(0.9·0.35 + 1·0.3) × 0 × 0.6 = 0.000
```

The arithmetic is the point: votes of `0.9` and `1.0` multiplied by a liveness
gate of `0`. Liveness is a multiplier, not an addend, and no strength of
evidence survives it.

## PII scan

> **Redaction note.** This file originally reproduced the email address that
> `pii-scan` reports inside `package-lock.json`. Quoting the scanner's output
> verbatim made this file trip the scanner in turn. The address is written
> below as `i@izs[.]me` — one character inserted so it is readable but not a
> live address. Nothing else in this file is altered.

```
pii-scan: 1 finding(s) — see DATA_CONTRACT.md §Zero-Conditions

  [email] package-lock.json — i@izs[.]me
```

**This finding is pre-existing on `main` and is not introduced by this branch.**
Verified:

```
$ git show HEAD:package-lock.json | grep -n "izs.me"
606:      "deprecated": "Old versions of glob are not supported, ... by contacting i@izs[.]me",
```

It is an address inside npm's deprecation notice for the `glob` package, which
ships in the lockfile. `package-lock.json` is untouched by this branch. No file
added here contains an address, a phone number, or a résumé; the one invented
company uses an `example.com` domain.

## Engine baseline commands from the assignment's "Before you start"

```
$ npm run score -- data/examples/ch11-roles.json --out-dir .../engine-baseline
✓ scored 5 roles → Apply 2 · Consider 1 · Skip 2 (skip 40%)
```

```
$ npm run ats:scan -- --dry-run
Error: portals.yml not found. Run onboarding first.
```

**`npm run ats:scan` does not run on a fresh clone.** `portals.yml` is not
shipped and the onboarding it refers to is not described anywhere this branch
could find. This sits alongside the known gaps already listed in `DOMAIN.md` —
`npm run bls:local-wage` failing for a missing `.venv` and an unshipped
`requirements.txt`, and the four CI harness scripts referenced by
`.github/workflows/contrib-gate.yml` that do not exist on `main`. None of them
is caused by this branch and none of them blocks this recipe, which depends on
neither `ats:scan` nor `bls:local-wage`.

### `npm run ats:liveness` on a fresh clone — and a false green in `doctor`

Attempted against two real game-studio Greenhouse postings:

```
$ npm run ats:liveness -- https://job-boards.greenhouse.io/insomniac/jobs/5496937004 \
                          https://job-boards.greenhouse.io/catdaddy/jobs/6676343003
Checking 2 URL(s)...

Fatal: browserType.launch: Executable doesn't exist at
/Users/.../Library/Caches/ms-playwright/chromium_headless_shell-1234/...

Looks like Playwright was just installed or updated.
Please run the following command to download new browsers:

    npx playwright install
```

`npm run doctor` reports `✓ playwright installed` on the same machine, in the
same session, minutes earlier. Both statements are true and they mean different
things. `scripts/doctor.mjs` line 36 tests with
`has('playwright')`, and `has()` is

```js
function has(mod) { try { execSync(`node -e "require.resolve('${mod}')"`, { stdio: 'ignore' }); return true; } catch { return false; } }
```

— a check that the npm **package** resolves. Playwright's browser binaries are
downloaded separately by `npx playwright install`, and nothing in `README.md`,
`CONTRIBUTING.md`, `DOMAIN.md`, `package.json` or `instructions/` mentions that
step. So the repository's own environment check passes while the one command
that needs a browser cannot start.

This is a different shape of problem from the gaps `DOMAIN.md` already lists.
`bls:local-wage` and `ats:scan` fail loudly and are known. This one is a green
tick in the tool whose job is to tell you whether the environment is ready, and
a student who trusts `doctor` and plans a run around `ats:liveness` finds out
at the worst moment. Proposed, not implemented here: `doctor` could run
`chromium.executablePath()` and report the browser separately from the package.
That is a change to a maintained file outside this branch's namespace, so it is
reported rather than made.

After `npx playwright install chromium`, the same command ran:

```
Checking 2 URL(s)...

❌ expired    https://job-boards.greenhouse.io/insomniac/jobs/5496937004
         redirect to https://job-boards.greenhouse.io/insomniac?error=true
❌ expired    https://job-boards.greenhouse.io/catdaddy/jobs/6676343003
         redirect to https://job-boards.greenhouse.io/catdaddy?error=true

Results: 0 active  2 expired  0 uncertain
```

Two real postings at two real game studios, both already dead. Those two
observations were written into `fixtures/liveness.sample.json` with
`synthetic: false` and are the only values in this submission that a person
actually saw. Provenance is tracked **per entry, not per file**, so one real
check cannot vouch for the rest of the table:

```
! liveness: 2/9 postings actually checked (0/6 of the scored rows); 7 synthetic and labelled model-judgment, not record
```

**Do not read `2 expired / 2` as a ghost-posting rate.** Both URLs came out of a
web search index, which lags behind job boards by design. The sample selects for
staleness. What it establishes is that the checker works, that a dead posting
produces a `record` with an observed status and a timestamp, and that this
prototype can tell that value apart from one nobody looked at.

### And the two postings that could be checked belong to companies the dataset does not contain

Neither `Insomniac Games` nor `Cat Daddy Games` appears in the 80 Days CSV, so
both rows blocked at `NOT_IN_RECORD` and never reached the scorer. That prompted
a wider check of well-known game employers:

```
ELECTRONIC ARTS ✗   ACTIVISION ✗   RIOT GAMES ✗   EPIC GAMES ✗
BLIZZARD ✗          ZYNGA ✗        UBISOFT ✗      BUNGIE ✗
NAUGHTY DOG ✗       RESPAWN ✗      INSOMNIAC ✗    CAT DADDY ✗
ROBLOX ✓            VALVE ✓(7)
```

One of fourteen is genuinely present. `ROBLOX CORP` is real; the seven `VALVE`
matches are heart-valve and industrial-valve companies
(`CEPHEA VALVE TECHNOLOGIES`, `JENAVALVE TECHNOLOGY`, `VALVERIDE`), and the one
`TAKE TWO` match is `TAKE TWO CO`, a 2021 Los Altos Hills company unrelated to
Take-Two Interactive. So the real figure is **1 of 14**.

The dataset's own README says it was built from SEC startup filings intersected
with DOL and USCIS sponsorship data. Form D is filed by companies raising
private rounds; a studio owned by a public parent does not file one. That
reasoning is ours, not the dataset's, but the pattern it predicts is the pattern
observed: the CSV covers funded private studios well and established
public-company studios not at all — and those are exactly the employers with the
largest H-1B programmes. This is reported as a coverage limit of the recipe's
central data source, not as a defect in it.

## Diff scope

```
 27 files, all new, in four namespaces:

   course/2026fa/submissions/WeitingWang0704/   reports, worked run, run outputs
   recipes/cases/2026fa/                        recipe + card
   scripts/contrib/2026fa/WeitingWang0704-…/    triage.mjs, tests, fixtures, README
   logs/runs/                                   one entry

 27 files changed, 5178 insertions(+), 0 deletions(-)
```

Every path is in one of three namespaces assigned to this handle:
`course/2026fa/submissions/WeitingWang0704/`, `recipes/cases/2026fa/`,
`scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/`. **Zero
deletions and zero modifications** — no existing file is touched, including
`logs/RUN_LOG.md`, `package.json` and everything else on the contrib gate's
protected list.

## What the gates still require a human to judge

The machine half is done; none of it is the adequacy gate.

**Gate 1 (sector)** needs a person who knows the industry to look at the matched
keyword and say whether the company is really a game studio. In this run the
machine was wrong once out of five — `Peloton Interactive Inc` passed on the
word "Interactive" and scored level with a real studio. The hand check is
written up in `SECTOR-VERIFICATION.md`.

**Gate 2 (liveness)** needs a person to actually run
`npm run ats:liveness -- <url>` against each posting and write down what they
saw. **Nobody did that for this run.** The shipped liveness file declares itself
synthetic and the prototype prints a warning saying so. Until that file is
replaced, this run demonstrates the pipeline and evaluates nothing.

**Gate 3 (timeline)** needs a person to agree to two numbers that multiply every
score in the run. Neither is a record. During development, correcting a
date-rounding bug moved the runway from 119 days to 120, the timeline factor
from 0.587 to 0.600, and `Manticore Games` from `Consider` to `Apply`. One day
of assumed runway flipped a decision.

**Nothing here has been signed.** `attestation` stays `null` in the recipe
frontmatter, and `status` is `DRAFT` — the sample-run evidence is in hand, but
two typed `[TODO]`s are open and `DRAFT → SPECIFIED` requires zero.
