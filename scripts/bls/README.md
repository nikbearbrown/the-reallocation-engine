# BLS/O*NET Scripts

Maintained scripts for extracting role-quality and labor-market-direction
features from `data/bls`.

## Local wage adjustment — metro OEWS × BEA RPP (Ch 9)

Turns a national OEWS wage into a metro one, adjusted for local price level, or
returns `missing` with a reason. Never interpolates and never falls back to the
national figure.

```bash
# one metro + one occupation — an honest miss (BLS suppressed the median)
python3 scripts/bls/local-wage-adjustment.py --metro "Glens Falls, NY" --soc 15-1252

# same metro, different occupation — a different miss (no BLS row at all)
python3 scripts/bls/local-wage-adjustment.py --metro "Glens Falls, NY" --soc 15-1243

# a real answer
python3 scripts/bls/local-wage-adjustment.py \
  --metro "New York-Newark-Jersey City, NY-NJ" --soc 15-1252

# the frozen 112-pair sample, with coverage and a mean over ok rows only
python3 scripts/bls/local-wage-adjustment.py \
  --sample data/bls/local-wage/sample.csv --aggregate --json

# same, via the npm target
npm run bls:local-wage -- --metro "Boston-Cambridge-Newton, MA-NH" --soc 15-1252
```

`--metro` takes an exact BLS area title or 5-digit area code — spelling is not
guessed. `--soc` takes an occupation code (`15-1252` = Software Developers).
Add `--output PATH.csv` to write rows to a file.

Inputs (compact extracts, committed):

- `data/bls/local-wage/metro_oews.csv` — BLS OEWS metro wages, May 2024
- `data/bls/local-wage/bea_rpp.csv` — BEA Regional Price Parities, 2024
- `data/bls/local-wage/bls_bea_msa_crosswalk.csv` — 387 exact `AREA`=`GeoFIPS` matches
- `data/bls/local-wage/sample.csv` — the frozen 14 metro × 8 SOC sample

Every output row is either a joined record or `status=missing` with one of four
reason codes: `no-metro-match`, `no-occupation-row`, `suppressed-small-sample`,
`no-crosswalk-match`. Formula: `real = nominal / (RPP / 100)`.

Recipe and card: `recipes/local-wage-adjustment.md` and `.card.md`.
Provenance and SHA-256s: `data/BLS/local-wage-adjustment-audit.md`.

## Compact SOC Occupation Table

```bash
python3 scripts/bls/extract-soc-occupation-table.py
```

Outputs:

- `data/bls/compact/soc_occupation_compact.csv`
- `data/bls/bls-audit.md`

The compact table combines:

- O*NET occupation identity and descriptions.
- O*NET alternate titles.
- O*NET job zones.
- Selected O*NET ability and recipe Level scores.
- Latest BLS OEWS national employment and wage estimates.

Use the compact table for downstream scoring. Keep the full `data/bls` archive
as source/reference provenance.
