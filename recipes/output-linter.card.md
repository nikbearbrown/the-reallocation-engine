---
status: DRAFT
todos_open: 0
last_gate: null
attestation: null
recipe_version: 0.1.0
---

# Evidence-First Output Linter — Human Card

## Purpose

The Evidence-First Output Linter is a deterministic command-line checker for two evidence-contract risks in Reallocation Engine output:

- **E001 — Unsourced Numeric Claim**
- **W001 — Over-Warranted Verb**

Its purpose is to surface output that deserves human review before a finding is trusted, published, or used in a decision.

The linter is intentionally narrow. It checks rule conformance; it does not determine factual truth.

## What It Can Verify

Version 0.1 can verify whether text matches the implemented deterministic rules for:

1. quantitative claims that lack a recognized provenance signal;
2. high-certainty language used in finding-shaped contexts covered by the W001 taxonomy;
3. expected PASS/FAIL behavior represented in the stored test fixtures;
4. deterministic exit behavior for clean input, lint findings, and execution errors.

A PASS means only that no implemented v0.1 rule was violated.

## What It Cannot Verify

The linter cannot verify:

- whether a company actually sponsors a particular applicant;
- whether a cited record is authentic;
- whether a cited source actually proves the sentence beside it;
- whether a recommendation is good;
- whether every model inference has been correctly identified;
- whether every verified/inferred boundary is semantically correct;
- whether a future employer action will occur;
- whether the output is adequate for a human decision.

It must never be used as an automated truth certificate.

## Dependencies

Required:

```text
Node.js
The Reallocation Engine repository
scripts/output-linter.mjs
scripts/output-linter.test.mjs
scripts/output-linter.fixtures/
```

The v0.1 linter requires no model API and no network connection.

Repository-level validation also uses the dependencies already required by:

```bash
npm run verify
npm run doctor
```

## Annotated Commands

### Check the script syntax

```bash
node --check scripts/output-linter.mjs
```

Use this to confirm that Node can parse the implementation.

It does not test whether the lint rules are adequate.

### Lint an output

```bash
node scripts/output-linter.mjs <input-file>
```

Use this for human-readable findings.

### Request machine-readable findings

```bash
node scripts/output-linter.mjs <input-file> --json
```

Use this when another script or audit needs structured output.

### Run the test harness

```bash
node scripts/output-linter.test.mjs
```

Use this after modifying the linter or its taxonomy.

The stored fixtures are fictional and are intended to test deterministic behavior without exposing private ATS or application data.

### Verify repository conformance

```bash
npm run verify
```

This checks repository machine conformance and manifest consistency.

Warnings must be read separately from errors.

### Run repository doctor

```bash
npm run doctor
```

Use this to inspect runtime availability, recipe state, domain directories, and privacy conditions.

## What It Produces

The linter produces terminal output and, when requested, structured JSON.

Possible v0.1 findings are:

```text
E001 UNSOURCED_NUMERIC_CLAIM
W001 OVER_WARRANTED_VERB
```

It also produces a summary and process exit code:

```text
0 — no v0.1 violations detected
1 — one or more v0.1 violations detected
2 — execution/input error
```

These outputs are diagnostic findings, not factual verdicts.

## Failure Modes

### 1. False Positive

The linter may flag language that is legitimate in context.

Example:

A high-certainty word may describe deterministic software behavior rather than an evidence claim.

Mitigation:

Maintain negative-control tests such as operational uses of `will`. Human review remains authoritative for adequacy.

### 2. False Negative

A misleading or unsupported claim may avoid the v0.1 patterns and receive no finding.

A PASS therefore means only:

> no implemented v0.1 violation detected.

It does not mean the document is evidence-complete or true.

### 3. Taxonomy Drift

The repository's accepted language, output conventions, or evidence vocabulary may change while the linter's E001/W001 patterns remain unchanged.

Result:

The linter may become too strict, too permissive, or irrelevant.

Mitigation:

Rerun the full test suite after changes to relevant recipes, contracts, or output conventions. Review the taxonomy before treating an old attestation as current.

### 4. Provenance-Convention Drift

The repository does not currently establish one universal claim-level inline provenance syntax for every output type.

A syntax used as a precedent may later change or be replaced.

Result:

The linter may fail to recognize valid provenance or may recognize a pattern that no longer carries the intended meaning.

Mitigation:

Do not silently promote a precedent into a repository-wide canonical standard. Changes to recognized provenance forms require explicit review and new tests.

### 5. Contract Violation

The most serious failure occurs if the linter begins claiming more than it can verify.

Examples:

- treating the presence of a provenance marker as proof that the source supports the claim;
- treating PASS as proof that the document is true;
- allowing the machine to certify adequacy;
- inventing a confidence score for lint quality.

This violates the repository's machine-conformance/human-adequacy boundary.

Mitigation:

Stop the run, log the contract violation, and return the decision to human review.

### 6. Scope Creep Into Semantic Judgment

A future rule may appear useful but require the program to decide what a sentence “really means.”

This is especially relevant to the descoped concepts:

```text
E002 — Unlabeled Model Judgment
W002 — Missing Evidence Boundary
```

These are not implemented in v0.1 because the current contract does not provide a sufficiently deterministic claim-level boundary.

Mitigation:

Keep them documented as roadmap items until a testable contract exists.

## Human Review Required

A human must decide:

- whether the evidence actually supports the claim;
- whether the wording is appropriate in context;
- whether a flagged sentence should be changed;
- whether an unflagged output is adequate;
- whether the taxonomy needs revision;
- whether a new provenance convention should become repository policy.

The machine surfaces deterministic conditions. The human owns the judgment.