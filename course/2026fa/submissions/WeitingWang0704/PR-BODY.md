# HOW TO USE THIS FILE

GitHub pre-fills the PR body with `.github/PULL_REQUEST_TEMPLATE.md`. **Do not
delete it.** Replace its placeholders with the filled text below — the structure,
the headings and all seven checkboxes must survive, because CI re-checks every
box and an unchecked box is an automatic request-changes.

**PR title:**

```
H-1B sponsorship triage for funded private game studios, SOC 15-1252 — DRAFT (sample run complete, 16 tests green)
```

---

# PASTE EVERYTHING BELOW THIS LINE AS THE PR BODY

## What this PR adds

A recipe, a human card and a rough prototype for one situation: an international
master's student specialising in game programming, on F-1 OPT, deciding which
game-studio postings deserve any of the two research-and-apply hours in a 3-3-2
day. It draws on the **80 Days to Stay** layer for H-1B history and funding
recency and on **The Cognitive Pivot** for the SOC 15-1252 row, reaches
**Job-Ops** only at a human gate, and runs the repository's own
`scripts/score/role-scorer.mjs` as a CLI rather than re-implementing the
composite. What it verifies is whether a company has an H-1B record and whether
that record is for engineering work; what it refuses to claim is that a company
is a game studio, or that a company with no record does not sponsor.

Branch: `contrib/2026fa-WeitingWang0704-game-dev-h1b-soc-15-1252` · This is my ONLY open PR: [x] yes
Maintained file I deliberately patch (or "none"): `none`

## Checklist (CI re-checks every box; an unchecked box is an auto-request-changes)

- [x] `npm run doctor` clean locally — paste the last 3 lines below
- [x] **No real PII anywhere in this branch's history** — fictional personas
      from `search/examples/` only (DATA_CONTRACT §Zero-Conditions). If I ever
      committed real data, I re-cut the branch; deleting the file later is NOT enough.
- [x] Run log added as `logs/runs/<term>-<handle>-<n>.md`; I did NOT edit `logs/RUN_LOG.md`
- [x] Recipe + card pair under `recipes/cases/<term>/` with honest lifecycle
      frontmatter (status matches evidence; attestation only if a human signed)
      — `status: DRAFT`. The sample-run evidence for `SPECIFIED → RUNNABLE-SAMPLE`
      is in hand, but `DRAFT → SPECIFIED` requires zero open `[TODO]`s and this
      recipe carries two it cannot close from a contrib namespace.
- [x] My harness/tests are green — real output pasted below, not described
- [x] Diff touches only my namespaced paths (+ the one declared maintained file)
- [x] `npm run verify` passes locally

## Doctor output (last 3 lines, pasted)

```
  environment: ✓ runnable
  recipes: 33/33 carry lifecycle frontmatter — all tracked
  next: continue
```

## Harness output (pasted, not described)

```
$ node --test scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.test.mjs
✔ an unchecked liveness entry is labelled model-judgment, a checked one record (188.535292ms)
✔ nextAction routes a Consider to the networking hours, not the apply hours (0.144083ms)
ℹ tests 16
ℹ suites 0
ℹ pass 16
ℹ fail 0
ℹ duration_ms 1746.308416
```

```
$ npm run verify
conformance: 167 files (88 md · 36 py · 32 js · 7 json · 4 sh)
✓ all conform (machine half of P4). Adequacy is still the human gate.
WARN (3):
  W1 ignore path not in .gitignore: archive/
  W2 private path not gitignored (PII/secret risk): private/
  W2 private path not gitignored (PII/secret risk): data/ats/
✓ manifest check passed (3 warnings)
verify exit: 0
```

```
$ node scripts/conformance.mjs scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/ \
    recipes/cases/2026fa/ course/2026fa/ logs/runs/
conformance: 26 files (16 md · 8 json · 2 js)
✓ all conform (machine half of P4). Adequacy is still the human gate.
```

```
$ node scripts/pii-scan.mjs
pii-scan: 1 finding(s) — see DATA_CONTRACT.md §Zero-Conditions

  [email] package-lock.json — <address inside npm's glob deprecation notice>
```

That one finding is **pre-existing on `main`**, not introduced by this branch —
`git show HEAD:package-lock.json | grep izs` returns it at line 606.
`package-lock.json` is untouched here.

```
$ node scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/triage.mjs \
    --postings .../fixtures/postings.sample.json --liveness .../fixtures/liveness.sample.json \
    --opt-end 2027-01-31 --hiring-lag-days 75 --soc 15-1252 \
    --out-dir course/2026fa/submissions/WeitingWang0704/runs

✓ scored 6 roles → Apply 1 · Consider 4 · Skip 1 (skip 17%)
  ! liveness: 2/9 postings actually checked (0/6 of the scored rows); 7 synthetic and labelled model-judgment, not record
✓ triage: 6 scored, 4 blocked at a gate
```

```
$ # break attempt: strongest record in the dataset + perfect fit + a dead posting
rec=Skip composite=0
(0.9·0.35 + 1·0.3) × 0 × 0.6 = 0.000
```

## Scope

27 files, **5,222 insertions, 0 deletions, 0 modifications.** Every path is under
`recipes/cases/2026fa/`, `scripts/contrib/2026fa/WeitingWang0704-…/`,
`logs/runs/` or `course/2026fa/submissions/WeitingWang0704/`. No protected path
is touched and `logs/RUN_LOG.md` is not edited.

No npm script is registered: `package.json` is on the `contrib-scope`
protected-path list. The documented command is the full `node` path above.

## Four things found in the repository while building this

Reported, not worked around. None is caused by this branch; none blocks this recipe.

1. **`harness-regression` references four scripts that do not exist on `main`** —
   `scripts/test/gate-behavior-harness.mjs`, `scripts/test/fuzz-invariants.mjs`,
   `scripts/gates/gate-behavior-harness.mjs`, `scripts/score/scorer-harness.mjs`.
   Two of the six referenced scripts are present. **That job is expected to fail
   on this PR and on any other PR**, for reasons unrelated to its contents.
2. **`npm run doctor` reports a false green for Playwright.** It prints
   `✓ playwright installed` while `npm run ats:liveness` dies with
   `browserType.launch: Executable doesn't exist`. `has()` in `scripts/doctor.mjs`
   resolves the npm package only; the browser binaries are a separate download and
   no setup document mentions `npx playwright install`. Suggested fix: check
   `chromium.executablePath()` and report the browser separately from the package.
   Not made here — that file is outside this branch's namespace.
3. **`npm run ats:scan -- --dry-run` fails on a fresh clone** with
   `Error: portals.yml not found. Run onboarding first.` Not in DOMAIN.md §Known gaps.
4. **`role-scorer.mjs` exports nothing**, though `CONTRIBUTING.md` documents
   `CONFIG` / `SRC` / `applyProfile` / `scoreRole`. This prototype therefore uses
   the other sanctioned route — run the CLI, read `role-scores.json` back.

## A coverage limit of the 80 Days CSV, for the games sector specifically

Measured 2026-10-03: of fourteen well-known game employers, **one** is genuinely
present (Roblox). EA, Activision, Riot, Epic, Blizzard, Ubisoft, Zynga, Bungie,
Naughty Dog, Respawn, Insomniac and Cat Daddy are absent; the seven `VALVE`
matches are heart-valve and industrial companies and `TAKE TWO CO` is an
unrelated 2021 California company. The same test on life sciences (`PFIZER` ✗
`MERCK` ✗ `GENENTECH` ✗) and on large technology (`GOOGLE` ✗ `AMAZON` ✗ `META` ✗
`NVIDIA` ✗) returns the same pattern, so the limit belongs to the data source
rather than to this domain — the dataset is built from SEC startup filings,
which public-company subsidiaries do not make. The recipe is named and scoped
accordingly: **funded private game studios**, not the sector.

## What this PR does not claim

- Of the six rows that reached the scorer, **zero** carry a liveness value anyone
  checked. Two real postings were checked with `npm run ats:liveness` (both
  `expired`); both belong to companies outside the CSV and blocked before scoring.
  Liveness provenance is per entry and printed at the top of every report.
- The games-sector claim is a keyword match labelled `model-judgment` everywhere.
  `Peloton Interactive Inc` passed the filter and scored level with a real AAA
  studio. A hand check of all five companies is in `SECTOR-VERIFICATION.md`:
  four right, one wrong.
- The sample run skips 17%, below "at least half". Recorded, not tuned away; the
  repository's own shipped example scores 40% on the same command.
- `role_quality` is read and shown to the person, never sent to the scorer, since
  `role-scorer.mjs` weights it `0.0` and tags it `[VERIFY]`.
