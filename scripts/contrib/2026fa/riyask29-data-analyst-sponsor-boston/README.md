---
owner: riyask29
term: 2026fa
component: data-analyst-sponsor-boston
status: DRAFT
promoted_to: null
---

# Data-Analyst Sponsor Check — prototype

## Executive summary

This is a small program for an international student on F-1 OPT who is looking
for **data analyst** jobs around Boston. Most sponsorship lists answer "has this
company ever sponsored a visa?" This one answers a narrower question: "has this
company sponsored a visa for a *data-analyst-type* job, or only for things like
cyber-security or credit-risk analysts?" It also checks whether each posting is
still open and whether hiring can finish before the student's allowed
unemployment days run out. It then hands each lead to the engine's existing
scorer and says what to do next: tailor an application, network into the
company first, or skip it.

It runs on the sample data that ships with the repository, and (v0.2.0) on full
SEC Form D quarters and a DOL H-1B filing slice by occupation code (`--formd-dir`,
`--lca`; see the recipe's Workflow 3b). It does not prove that a company will
sponsor *you*, and it is not legal advice.

## Run it (one command, from the repo root)

```bash
node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs
```

This reads the fictional persona and the candidate postings in `inputs/`,
checks each posting URL live with Playwright, scores the leads with
`scripts/score/role-scorer.mjs`, and writes everything to `out/`. The first
time, run `npx playwright install chromium` once.

After a person has opened the `uncertain` postings (gate G2), re-run without
the network using their checks. This is how `out/` was produced:

```bash
node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs \
  --liveness-file scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/liveness.gate-cleared.json --today 2026-10-02
```

## Test it (offline, no network)

```bash
node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.test.mjs    # 10 tests
node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/liveness_frames.test.mjs  # 3 tests (Chromium, no network)
python3 scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/test_lca_slice.py              # 5 tests (openpyxl)
```

## Files

| Path | What |
|---|---|
| `analyst_check.mjs` | the CLI: gates, `roles.json`, calls the real scorer, writes both outputs |
| `lib.mjs` | pure functions (CSV, company match, title classifier, timeline, wage, Form D, DOL LCA) |
| `lca_slice.py` | cuts a DOL LCA disclosure workbook to employer × SOC counts for one state (no case numbers, no person data) |
| `config/lca-soc-families.json` | which SOC codes count as core vs adjacent analyst work (**your-input**) |
| `data/lca-ma-analyst-fy2026q3.csv` (+ `-audit.md`) | the Massachusetts slice of DOL `LCA_Disclosure_Data_FY2026_Q3.xlsx` and its rows-in/rows-out audit (**record**) |
| `config/title-families.json` | my keyword rules and tier → p mapping (**your-input**) |
| `inputs/persona.example.json` | fictional persona "Sneha Patil" (`@example.com`, 555 number) |
| `inputs/candidates.json` | real public postings found 2026-10-02 + my hiring-lag and fit estimates |
| `inputs/liveness.gate-cleared.json` | gate G2 cleared: machine results plus my browser checks (`source: your-input`) |
| `fixtures/` | test data: rows cut verbatim from the real repo files, plus test personas |
| `analyst_check.test.mjs` | 10 offline tests, including deliberate break attempts |
| `liveness_frames.test.mjs`, `test_lca_slice.py` | offline tests for the liveness iframe fix (3) and the LCA slicer (5) |
| `out/` | the final run's outputs (run 3, after the gates were cleared) |

## Outputs (in `--out-dir`, default `out/`)

| File | Reader |
|---|---|
| `analyst-check-log.json` | agent: every value, its source label, gate results, next action |
| `analyst-check-report.md` | person: summary, next actions, evidence, gates to clear |
| `roles.json`, `scorer-profile.json` | the scorer's input, written by this prototype |
| `role-scores.json`, `role-scores.md` | written by `scripts/score/role-scorer.mjs` itself |
| `liveness.json` | live runs only: dated liveness results, reusable with `--liveness-file` |

## Labels

| Value | Label | Why |
|---|---|---|
| H-1B counts, sponsored titles, BLS wages, Form D filings, LCA counts by SOC | record | read straight from repo data files (Form D full quarters and the LCA workbook are fetched; see the recipe) |
| posting active / expired / uncertain | record | output of `liveness-browser.mjs`, with a timestamp |
| posting open, seen by a person | your-input | a G2 check in the liveness file with `"source": "your-input"` |
| title → family classification, tier, tier → p | your-input | my keyword rules and my mapping |
| timeline factor | your-input | my formula on my persona's dates and my hiring-lag estimate |
| fit | your-input | self-rated; no model is called anywhere |

In `roles.json` the sponsorship term is labeled **your-input**, not record.
The titles are a record, but the number 0.6 or 0.9 is a mapping I chose, and a
number a record did not produce should not be labeled as one.

## Failure behaviour (never invents a value)

| Case | What happens |
|---|---|
| company not in CSV / no H-1B fields / ambiguous name | stops at G1, `sponsorship: null`, not scored, near matches listed for a human |
| posting `uncertain` or not checked | stops at G2, not scored |
| missing hiring lag | stops at G3, not scored |
| posting `expired`, or OPT/unemployment runway exceeded | scored with a 0 gate → Skip |
| SOC code not in BLS file | wage check says `no-occupation-row`, no number substituted |
| persona missing a visa field | exit 2, nothing written |
| scorer misreads the persona's sponsorship need | exit 2, nothing reported (see below) |

**Scorer guard.** `role-scorer.mjs` decides whether a profile needs
sponsorship with a regex over free text, and that regex includes
`authorized`. So "F-1 STEM OPT — work authorized (EAD)" is read as *no
sponsorship needed*, and the sponsorship weight is set to 0 (reproduced
2026-10-02). This prototype compares the scorer's reading with the persona's
explicit `needs_sponsorship` and refuses to report if they disagree. I did
not patch the scorer.

## Network

Only without `--liveness-file`, and only to the posting URLs in the
candidates file, via the repo's `scripts/ats/liveness-browser.mjs` (which
blocks private and loopback hosts). No other host is contacted.
