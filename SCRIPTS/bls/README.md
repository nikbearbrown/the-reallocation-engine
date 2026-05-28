# BLS/O*NET Scripts

Maintained scripts for extracting role-quality and labor-market-direction
features from `data/BLS`.

## Compact SOC Occupation Table

```bash
python3 SCRIPTS/bls/extract_soc_occupation_table.py
```

Outputs:

- `data/BLS/compact/soc_occupation_compact.csv`
- `data/BLS/BLS-audit.md`

The compact table combines:

- O*NET occupation identity and descriptions.
- O*NET alternate titles.
- O*NET job zones.
- Selected O*NET ability and skill Level scores.
- Latest BLS OEWS national employment and wage estimates.

Use the compact table for downstream scoring. Keep the full `data/BLS` archive
as source/reference provenance.
