---
status: RUNNABLE-SAMPLE
todos_open: 0
last_gate: "sample-run adequacy signed by a human (Atharva Kurlekar, 2026-08-16), logs/RUN_LOG.md#2026-08-16----local-wage-adjustment-g2-reason-code-split--corrected-re-run; sample-run attestation kept at logs/attestations/local-wage-adjustment.md"
attestation: null  # SNICKERDOODLE lifecycle: this field is set only at VERIFIED. This recipe is RUNNABLE-SAMPLE with a human-signed sample-run adequacy (see last_gate); it has not had a RUNNABLE-LIVE gated run, so it is not VERIFIED.
recipe_version: 0.2.0
---

# local-wage-adjustment — Metro OEWS × BEA RPP

## Executive summary

Take a `(metro area, SOC code)` pair and return either an RPP-adjusted wage band from joined BLS metro OEWS and BEA Regional Price Parity records, or `status=missing` with a reason code. Do not interpolate. Do not fall back to the national wage. Do not emit an ERP-skill match percentage.

Chapters claimed: **Ch 9 only**. The BLS↔BEA crosswalk uses exact area codes (no fuzzy match). That is method, not a second contribution.

Two customers: this file is for the agent; `recipes/local-wage-adjustment.card.md` is for the human.

**Handoff condition (done when):** a sample run is complete when stderr prints `coverage = ok/attempted` with a `missing_reason` breakdown, the output CSV has exactly one row per attempted `(metro, SOC)` pair, every `status=missing` row has empty wage/RPP/band fields, and no row carries a number that is not traceable to `source_bls_file` / `source_bea_file`. "Looks right" is not the condition; the coverage line, the row count, and the empty-on-missing invariant are.

## Required reads

Read in this order before running:

1. `SNICKERDOODLE.md` — gates, provenance, TODO closure.
2. `DOMAIN.md` — layout; BLS lives under `data/bls/`.
3. `chapters/09-is-the-role-any-good-bls-onet-role-quality.md` (the national-vs-local limit).
4. `data/BLS/local-wage-adjustment-audit.md` — URLs, SHA-256, crosswalk counts, reason codes, frozen sample.
5. This recipe and `recipes/local-wage-adjustment.card.md`.

Prefer those local files over external lookup.

## Phase gates

Each row stops at the first failed gate. No national fallback.

| Gate | Test | Pass | Fail |
|---|---|---|---|
| G1 metro match | Input resolves to a BLS `AREA` by exact code or exact `AREA_TITLE` (casefold). | wage lookup | `missing: no-metro-match` |
| G2 wage exists | A detailed OEWS row exists for `(AREA, SOC)` **and** `A_MEDIAN` is not a suppression token (`*` / `**` / `#`). | RPP join | no row → `missing: no-occupation-row`; row with suppressed median → `missing: suppressed-small-sample` |
| G3 RPP crosswalk | `AREA` is in the exact-code crosswalk and BEA all-items RPP for 2024 parses. | compute `real = nominal / (RPP / 100)` | `missing: no-crosswalk-match` |
| G4 plausibility | Adjusted median is within 0.3×–3× of the national median from `soc_occupation_compact.csv`. | `plausibility_flag=ok` | `plausibility_flag=review` — **do not rewrite or drop the row** |

Missing rows still ship. Coverage denominator is attempted rows, not successful rows.

## Primary stored tools

Stored script exists:

```bash
python3 scripts/bls/local-wage-adjustment.py
npm run bls:local-wage --
```

The script re-execs into repo `.venv` (`python3.13` + `data/bls/local-wage/requirements.txt`). Do not `pip install` into the system interpreter.

Compact inputs (already ingested; do not re-download in this recipe):

- `data/bls/local-wage/metro_oews.csv`
- `data/bls/local-wage/bea_rpp.csv`
- `data/bls/local-wage/bls_bea_msa_crosswalk.csv`
- `data/bls/local-wage/sample.csv` (frozen 112 pairs — do not edit after a coverage run starts)
- `data/bls/compact/soc_occupation_compact.csv` (national median for G4 only)

No stored script exists for skill-overlap scoring. Do not add one in this recipe.

## Workflow

Read-first, then run. Verbatim commands:

1. Confirm compact files exist:

```bash
test -f data/bls/local-wage/metro_oews.csv && test -f data/bls/local-wage/bea_rpp.csv && test -f data/bls/local-wage/sample.csv
```

2. One-row suppression check (must return `missing: suppressed-small-sample`, empty wage fields):

```bash
python3 scripts/bls/local-wage-adjustment.py --metro "Glens Falls, NY" --soc 15-1252 --json
```

3. Frozen sample (prints `coverage = ok/attempted` on stderr; missing rows remain in the CSV):

```bash
python3 scripts/bls/local-wage-adjustment.py --sample data/bls/local-wage/sample.csv --json --output reports/generated/local-wage-adjustment-sample.csv
```

4. Aggregation check (ok rows only; missing excluded, never coerced to 0):

```bash
python3 scripts/bls/local-wage-adjustment.py --sample data/bls/local-wage/sample.csv --aggregate --json --output /dev/null
```

5. Off-list SOC still processes (sample filter is not a wage-logic restriction), e.g. `11-1011`:

```bash
python3 scripts/bls/local-wage-adjustment.py --metro "Austin-Round Rock-San Marcos, TX" --soc 11-1011 --json
```

6. Log the run in `logs/RUN_LOG.md`. Do not treat stderr coverage as attested until a named human reads the report.

## Output contract

One CSV row per attempted `(metro, SOC)`:

```
metro_area, soc_code, status [ok | missing], missing_reason [empty | no-metro-match | no-occupation-row | suppressed-small-sample | no-crosswalk-match],
nominal_wage_mean, nominal_wage_median, bea_rpp_value, adjusted_wage_band_low, adjusted_wage_band_high,
adjusted_wage_median, plausibility_flag, national_median_wage,
source_bls_file, source_bea_file, run_date
```

- `status=missing` rows are emitted with empty wage/RPP/band fields.
- `adjusted_wage_band_low` / `_high` are RPP-adjusted `A_PCT25` / `A_PCT75`. Null (empty) if those percentiles are suppressed; do not invent a spread.
- Formula: `real = nominal / (RPP / 100)` (US RPP = 100). Label: `script-output`.
- Coverage on stderr: `ok/attempted` plus `missing_reason` counts. A bare percentage with no denominator is not acceptable.
- Not emitted: any skill-match percentage.

## Verification checks

- Conformance: `node scripts/conformance.mjs scripts/bls/local-wage-adjustment.py recipes/local-wage-adjustment.md recipes/local-wage-adjustment.card.md`
- Doctor sees the npm target: `npm run doctor` (script path present).
- G1: unknown metro name → `no-metro-match`.
- G2 suppression: `Glens Falls, NY` + `15-1252` → `suppressed-small-sample` (row exists; `A_MEDIAN=*`).
- G2 absent row: a resolved metro whose detailed `(AREA, SOC)` is not in OEWS → `no-occupation-row` (not the same event as a suppression token).
- G3: a BLS Puerto Rico MSA (listed in `data/bls/local-wage/crosswalk_unmatched.csv`) → `no-crosswalk-match`.
- `--aggregate` JSON has `missing_rows_excluded` > 0 when the batch contains missing rows; `mean_adjusted_median` is not computed from zeros.
- Every numeric cell traces to `source_bls_file` / `source_bea_file` or is empty because the row is missing.

## Logging rules

- Append `logs/RUN_LOG.md` for any sample or break-test run: command, coverage `ok/attempted`, missing-reason breakdown, output path.
- Machine log (when producing a dated honest run): `logs/local-wage-adjustment-YYYYMMDD.json`.
- Human report: `reports/generated/local-wage-adjustment-YYYYMMDD.md`.
- Do not log secrets, `private/`, or `data/ats/` contents. This recipe uses public BLS/BEA only.

## Stop conditions

Stop and do not invent a number when:

- Compact extracts or `.venv` are missing.
- A gate fails — emit `missing` + reason; do not interpolate neighbors; do not copy the national wage into the metro cell.
- Asked to add ERP skill-overlap scoring — refuse in this recipe; that is out of scope (would be `model-inference`, not this layer).
- Asked to edit `sample.csv` after a coverage run has started — denominator would be cherry-picked.
- Asked to collapse `no-occupation-row` into `suppressed-small-sample` — refuse; an absent row and a suppression token are different events and the reason code is the only record of which one happened.
- `plausibility_flag=review` — flag for the human; do not auto-correct.
