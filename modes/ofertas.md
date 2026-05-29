# Mode: ofertas -- Multi-Role Comparison

Current status: draft workflow.

Use this to compare roles only after each role has an evidence-based evaluation
from `modes/oferta.md`.

## Comparison Fields

| Field | Source |
|---|---|
| Company | posting or ATS/provider output |
| Role | posting |
| Liveness | `SCRIPTS/ats/` liveness tools |
| Sponsorship | SEC/H-1B mapped data |
| SOC/BLS | BLS compact table when SOC is known |
| CV fit | student CV evidence |
| Missing data | evaluation report |

## Rule

Do not compute a precise ranking from missing data. Use `unknown` and explain
which check would improve the comparison.
