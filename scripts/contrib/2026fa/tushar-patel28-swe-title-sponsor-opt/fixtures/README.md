# fixtures — test inputs and mutant scorers

## Executive summary

**What this is.** The small, fixed inputs the tests run against, plus three deliberately broken copies of the project's scoring tool.

**Why read it.** It records where every fixture row came from and which one was altered on purpose, so a reviewer can trust that the tests exercise real data shapes and contain no personal contact details.

**What it contains.** Nine real company rows with the phone and named-people columns removed. One of those rows has its title list deliberately corrupted. There's also a fictional persona, one test role per failure case and band boundary, fictional Apply-evidence entries (one valid, the rest each refused for one reason), and three broken scorers that the tests must reject.

## Provenance

| File | Source | Notes |
|---|---|---|
| `sponsorship-fixture.csv` | rows copied verbatim on 2026-10-01 from `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | `DATABRICKS INC`, `ANYSCALE INC`, `AIERA INC`, `HUGGING FACE INC`, `SALESFORCE COM INC`, `SALESFORCECOM INC`, `EVERQUOTE INC`, `COHERE HEALTH INC`, `PINECONE SYSTEMS INC`. Columns `phone`, `executive_officers`, `board_directors` removed, so the PII scan stays clean outside `data/`. |
| — deliberate corruption | `PINECONE SYSTEMS INC` | `top_job_titles_sponsored` truncated to `['Senior Product Marketing Manager', 'Software Engin` (original: `['Senior Product Marketing Manager', 'Software Engineer', 'Senior Software Engineer']`), to test F5 (unparseable titles). |
| `persona.fixture.json` | invented | fictional name, example.com address, invented dates |
| `roles-cases.json` | invented | one role per F1–F6 case, per gate break and per new band boundary (day −31, −30, 61, 91); company names are real or deliberately invented (`Zyntheonix Labs`, not in the CSV) |
| `overrides-cases.json` | invented | **FICTIONAL** G4 entries, never a real DOL check: one valid (`matched-in` → Apply), and one each refused for a missing field, `posting_says_no_sponsorship: true`, timeline 0, ambiguous, not-found, wrong type, unknown role |
| `overrides-empty.json` | invented | no G4 entries — the default for every other fixture run |

## Mutant scorers (`BROKEN-*`)

Each mutant is the real `scripts/score/role-scorer.mjs` with **one** string replaced (`mutant-runner.mjs`), run from a temp file. If the anchor text disappears from the scorer, the mutant exits 3 as stale rather than silently running the real scorer.

| Mutant | Defect injected | Guard that must catch it |
|---|---|---|
| `BROKEN-sponsorship-weight-zero.mjs` | `needsSponsor` forced false (the effect of the F-1 "work authorized" bug) | sponsorship-weight guard (F6) |
| `BROKEN-timeline-ignored.mjs` | timeline factor replaced by 1 | gate-echo guard (G2) |
| `BROKEN-gate-zero-off.mjs` | `gate_zero` set below any factor, so a closed gate stops reading as "gated" | gate-echo guard (G2) |
