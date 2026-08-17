# Local wage-adjustment — human card

**Audience:** the person who has to decide whether to trust a local wage number.  
**Agent twin:** `recipes/local-wage-adjustment.md`  
**Chapter:** 9 (national OEWS is not local pay). Not a Ch 5/7 entity-resolver.

## Purpose

Answer: for this metro and this occupation, what do BLS and BEA actually jointly support as a cost-adjusted wage band? If they do not jointly support a number, the tool must say `missing` and why.

## What it can verify

- A BLS metro OEWS row exists for `(MSA, SOC)` and `A_MEDIAN` is not a suppression token. An absent row is `no-occupation-row`; a `*` / `**` / `#` median is `suppressed-small-sample`. Those are not the same event.
- A BEA all-items RPP for 2024 joins on the **exact** CBSA code in the static crosswalk.
- The script applied `real = nominal / (RPP / 100)` and labeled that `script-output`.
- Coverage as `ok / attempted` with a `missing_reason` breakdown on a **pre-declared** sample.

## What it cannot verify

- What **this employer** pays (posting or offer). That is not in OEWS.
- Whether the SOC code is the right occupation for a frontier job title.
- Why BLS suppressed a cell (small sample vs. other confidentiality rule) — only that the cell is not a number.
- Whether next year's OMB metro boundaries still match the frozen crosswalk.

## Dependencies

- Repo `.venv` (pandas/openpyxl). Create with `python3.13 -m venv .venv` then `.venv/bin/pip install -r data/bls/local-wage/requirements.txt`. The script hops into `.venv`; do not install packages globally.
- `data/bls/local-wage/metro_oews.csv` (from BLS `oesm24ma` / `MSA_M2024_dl.xlsx`)
- `data/bls/local-wage/bea_rpp.csv` (from BEA `MARPP.zip`, LineCode 1)
- `data/bls/local-wage/bls_bea_msa_crosswalk.csv` (exact `AREA == GeoFIPS`)
- `data/bls/compact/soc_occupation_compact.csv` (national median for the plausibility flag only)
- Provenance: `data/BLS/local-wage-adjustment-audit.md`

## Annotated commands

Suppression demo (expected: `missing: suppressed-small-sample`; wage columns empty):

```bash
python3 scripts/bls/local-wage-adjustment.py --metro "Glens Falls, NY" --soc 15-1252 --json
```

Frozen sample (112 pairs; do not edit `sample.csv` to chase a higher rate):

```bash
python3 scripts/bls/local-wage-adjustment.py --sample data/bls/local-wage/sample.csv --json
```

Mean of **ok** rows only (missing excluded, not treated as zero):

```bash
python3 scripts/bls/local-wage-adjustment.py --sample data/bls/local-wage/sample.csv --aggregate --json
```

Unknown place name (expected: `no-metro-match`; not a fuzzy guess):

```bash
python3 scripts/bls/local-wage-adjustment.py --metro "New Yrok" --soc 15-1252 --json
```

## What it produces

- CSV rows: `ok` with nominal wages, RPP, adjusted band/median, sources, date; or `missing` + reason and empty wage fields.
- stderr coverage line: `ok/attempted` plus reason counts.
- `plausibility_flag=review` on `ok` rows whose adjusted median is outside 0.3×–3× national — still a shipped number, not a silent fix.

## Named failure modes

1. **Drift** — BLS or BEA ship a new annual file with renamed columns; the parser reads the wrong field and treats a flag as a wage. Mitigation: keep suppression tokens as text; SHA-256 the source in the audit; re-check column maps on each ingest.
2. **Contract-violation** — a later edit adds “ERP skills match this role at X%” into the same CSV as the wage. That number would be unlabeled inference and trips the zero condition. Mitigation: this card forbids blending; skill scoring is out of scope.
3. **Crosswalk staleness** — OMB redraws MSA boundaries; the static `AREA == GeoFIPS` table is then wrong. Mitigation: unmatched codes stay `no-crosswalk-match`; no fuzzy names; rebuild the table from a new vintage, do not guess.
4. **Suppression misread** — treating `*` / `**` / `#` as zero (or as missing-at-random to interpolate) fabricates a wage. So does labeling an absent OEWS row as “suppressed.” Mitigation: a missing detailed row emits `no-occupation-row`; a suppression token emits `suppressed-small-sample` and empties wage fields. Glens Falls + 15-1252 is the suppression fixture.
