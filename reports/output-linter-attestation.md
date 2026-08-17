# Evidence-First Output Linter v0.1 — Attestation Record

- Recipe: `output-linter` v0.1.0
- By: Ranfei Pang · 2026-08-15

## Tested

| Ran | Saw | Expected |
|---|---|---|
| `node --check scripts/output-linter.mjs` | Node syntax check passed. | Implementation parses successfully. |
| `node scripts/output-linter.test.mjs` | 12/12 stored v0.1 test cases passed. | E001/W001 behavior matches the specification. |
| Deliberate break: remove the provenance marker from the relevant fixture and rerun the test/lint path. | E001 triggered and process exit code was `1`. | The linter must fail when the tested numeric claim loses its provenance signal. |
| Restore the broken fixture and rerun the test suite. | Full test suite returned to PASS. | The deliberate break must be reversible and the valid fixture must pass again. |
| `npm run verify` | Conformance passed; manifest check passed with 4 warnings. | No conformance error introduced by the contribution. |
| `npm run doctor` | Environment runnable; no tracked private/PII paths; 44/44 recipe files carry lifecycle frontmatter. | Contribution remains compatible with repository doctor checks. |

## Did not test

- Whether a cited source is authentic or actually proves a claim.
- Whether a model judgment has been semantically identified in arbitrary prose.
- Whether every verified/inferred boundary is semantically correct.
- Whether the linter can establish factual truth or recommendation quality.
- E002 — Unlabeled Model Judgment; intentionally descoped to v0.2.
- W002 — Missing Evidence Boundary; intentionally descoped to v0.2.
- External network sources or live external evidence retrieval.

## Broke during testing, fixed

- Deliberate break: removed the provenance marker from the fixture used to test the numeric-claim rule.
- Observed behavior: E001 was raised and the process exited with code `1`.
- Fix: restored the provenance marker and reran the test suite.
- Final state: all 12 stored v0.1 test cases passed again.

## Verified-vs-Inferred Boundary

| Output / fact | Classification | Basis |
|---|---|---|
| 12/12 stored tests passed | script-output | `node scripts/output-linter.test.mjs` terminal run |
| Deliberate break produced E001 and exit code 1 | script-output | deliberate-break terminal run |
| `npm run verify` passed | script-output | repository conformance and manifest run |
| `npm run doctor` reported 44/44 recipe lifecycle frontmatter | script-output | repository doctor run |
| Four manifest warnings are pre-existing | local evidence / contributor observation | same four warnings were present in the baseline before this contribution |
| E002/W002 are not implemented in v0.1 | script/spec state | output-linter specification and implementation scope |
| The underlying claims checked by the linter are true | not tested | outside machine-verification scope |
| A provenance marker proves that its referenced source supports the claim | not tested | requires human adequacy review |

The machine outputs above record what the scripts actually observed. They do not certify the adequacy or factual truth of the underlying evidence.
