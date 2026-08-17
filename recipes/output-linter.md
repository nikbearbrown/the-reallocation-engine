---
status: DRAFT
todos_open: 0
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# Evidence-First Output Linter

## 1. Executive Summary

Use the Evidence-First Output Linter to detect two deterministic classes of evidence-contract problems in Reallocation Engine output:

- **E001 — Unsourced Numeric Claim:** a quantitative finding such as a count, rate, percentage, score, probability, confidence, or coverage figure that lacks a recognized provenance signal.
- **W001 — Over-Warranted Verb:** finding-shaped language that expresses stronger certainty than the evidence boundary supports.

This tool verifies **conformance, not adequacy**. It does not determine whether a claim is true, whether cited evidence actually supports a claim, or whether a recommendation is good.

Version 0.1 intentionally does not implement semantic detection of unlabeled model judgments or missing evidence boundaries. Those checks are reserved for a future version because the current repository contract does not provide a sufficiently deterministic claim-level boundary for reliable implementation.

## 2. Required Reads

Read these files before running or modifying the linter:

1. `SNICKERDOODLE.md`
2. `DATA_CONTRACT.md`
3. `recipes/_shared.md`
4. `scripts/README.md`
5. `scripts/output-linter.mjs`
6. this recipe

SNICKERDOODLE governs if another repository file conflicts with it.

## 3. Phase Gates

### Gate 1 — Input Safety

Handoff condition:

- the input exists;
- the input is readable;
- the input contains no private application data, credentials, or PII that should not be exposed in a report or demonstration.

Failure path:

**STOP.** Do not run the linter on unsafe input. Replace it with fictional, public, or otherwise safe test material.

### Gate 2 — Machine Conformance

Run:

```bash
node --check scripts/output-linter.mjs
npm run verify
```

Handoff condition:

- the linter passes Node syntax checking;
- repository verification exits successfully.

Failure path:

**STOP.** Record the failure. Do not describe the contribution as conforming until the failure is corrected and verification is rerun.

### Gate 3 — Linter Tests

Run:

```bash
node scripts/output-linter.test.mjs
```

Handoff condition:

- all 12 stored test cases pass;
- the operational-language negative control does not produce a false W001;
- the deliberate-break case triggers the expected E001 violation and exit code `1`;
- after restoring the fixture, the full suite passes again.

Failure path:

**STOP.** Record the failing case and observed output. Do not promote or attest the recipe.

### Gate 4 — Human Adequacy Review

A human reads the findings and determines whether they are useful and appropriately scoped.

Handoff condition:

- the human confirms that the tool is being used only as a deterministic conformance checker;
- no finding is being represented as proof that the underlying claim is true or false.

Failure path:

**STOP.** Treat the output as diagnostic only and log the limitation or contract mismatch.

## 4. Primary Stored Tools

Primary implementation:

```text
scripts/output-linter.mjs
```

Test harness:

```text
scripts/output-linter.test.mjs
```

Fictional test fixtures:

```text
scripts/output-linter.fixtures/
```

No stored model, external API, or network lookup is required for v0.1.

The linter must not fetch external evidence while linting.

## 5. Workflow

1. Read the required repository contracts.
2. Confirm the input is safe to inspect.
3. Run repository baseline/conformance checks when appropriate.
4. Run:

```bash
node scripts/output-linter.mjs <input-file>
```

5. For machine-readable output, run:

```bash
node scripts/output-linter.mjs <input-file> --json
```

6. Read every E001 and W001 finding.
7. Do not interpret absence of findings as proof that the document is factually correct.
8. Run the test harness after changing the implementation or rule taxonomy.
9. Perform a deliberate break attempt before attestation.
10. Restore the valid fixture after the break attempt and rerun the tests.
11. Record the run and any limitation or failure in `logs/RUN_LOG.md`.

## 6. Output Contract

The linter may emit:

### E001 — UNSOURCED_NUMERIC_CLAIM

Meaning:

A numeric finding matched the v0.1 quantitative-claim rule without a recognized provenance signal.

It does **not** mean the number is false.

### W001 — OVER_WARRANTED_VERB

Meaning:

Finding-shaped language matched the v0.1 high-certainty taxonomy in a context covered by the rule.

It does **not** mean the underlying claim is false.

### PASS

PASS means:

> No v0.1 E001 or W001 violation was detected.

PASS does **not** mean:

- every statement is true;
- every source is valid;
- every source supports the associated claim;
- every inference is properly labeled;
- the output is adequate for a human decision.

Exit codes:

```text
0 — no v0.1 violations detected
1 — one or more v0.1 violations detected
2 — usage, input, file, or processing error
```

## 7. Verification Checks

Before treating a run as usable evidence:

- confirm `node --check scripts/output-linter.mjs` succeeds;
- confirm the v0.1 test suite passes;
- confirm the operational use of certainty words is not mechanically flagged as a finding;
- confirm an unsourced quantitative test case triggers E001;
- confirm an over-warranted finding triggers W001;
- confirm a deliberate removal of provenance triggers the expected failure;
- restore the broken fixture and confirm the suite passes again;
- run `npm run verify`;
- run `npm run doctor`;
- review any warnings separately from errors.

Do not convert a repository warning into a claim that the contribution failed unless the warning was caused by the contribution.

## 8. Logging Rules

Record meaningful runs in:

```text
logs/RUN_LOG.md
```

For each real validation run, record:

- date;
- recipe and version;
- command executed;
- input type or fictional fixture used;
- observed result;
- output/finding count when produced by the script;
- deliberate-break result when applicable;
- verification/doctor result;
- open limitation or blocker.

Never invent a test count, finding count, rate, coverage number, or PASS result.

Do not log secrets, personal contact information, private application notes, or private ATS data.

## 9. Stop Conditions

Stop immediately if:

- the input contains private data that should not be inspected or demonstrated;
- the script cannot read the input;
- the script exits unexpectedly;
- repository conformance fails;
- expected test behavior changes without an explained code or contract change;
- the linter is being used to claim that evidence is factually sufficient;
- the linter is being used to certify its own adequacy or honesty;
- a proposed rule requires semantic judgment that v0.1 cannot deterministically make;
- the provenance convention required for a new rule is not established by the repository or explicitly approved by a human.

Prefer **“not implemented in v0.1”** to a rule that only appears deterministic.

## v0.2 Roadmap — Explicitly Descoped

The following concepts were considered but intentionally excluded from the v0.1 implementation:

### E002 — Unlabeled Model Judgment

The repository requires model judgments to be labeled, but reliable detection of whether arbitrary natural-language text constitutes a model judgment requires a semantic boundary not established sufficiently for deterministic v0.1 enforcement.

### W002 — Missing Evidence Boundary

The repository requires provenance and separation of verified evidence from judgment, but arbitrary sentence-level detection of a missing verified/inferred boundary would require semantic interpretation beyond the intentionally narrow v0.1 machine-conformance role.

These are documented future directions, **not capabilities of v0.1**.