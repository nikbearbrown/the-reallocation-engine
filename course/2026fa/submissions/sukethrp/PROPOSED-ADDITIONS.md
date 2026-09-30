# Proposed additions and defects found — ml-newgrad-sponsor-match

## Executive summary

This file lists what the role-level sponsor-match recipe would need in order to verify more than it
does today. It also lists defects in the engine that were found while building it. Nothing here is
built. Each proposal says what it would let the recipe check, why it belongs in the engine, and what
would count as closing it. The proposals are kept out of the recipe on purpose: under the engine's
lifecycle rules, an open item inside a recipe returns it to draft, and none of these is needed for the
recipe's current steps to run.

Drafted by Claude Code (AI assistant) on 2026-09-29 from findings made while building and testing the
prototype. Student review: *pending*.

---

## Proposed additions (typed, open)

| # | Type | Proposal | What it would let the recipe verify | Closed by |
|---|---|---|---|---|
| 1 | [TODO: DATA SOURCE] | The DOL OFLC LCA disclosure files, one per fiscal year. They carry the decision date, job title, SOC code, employer name and FEIN per filing. The readiness audit (`data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-entity-resolution-readiness-audit.md`) already names `data/lca/raw/LCA_Disclosure_Data.csv` as their expected home | **Recency:** when a matching title was filed (cannot-verify item 1). **Completeness:** every sponsored title, not a top-titles list (item 3) | the file at that path, plus a one-line provenance note (origin URL, fiscal years, download date, SHA-256), added by a maintainer |
| 2 | [TODO: DEV] | Match on the LCA's SOC codes (15-1252, 15-2051, 15-1221) alongside titles, once item 1 exists | role family by the government's own classification, not by title words the student declared | a script under `scripts/contrib/…` that joins on SOC, with conformance passing and a test on a fixture slice of the LCA file |
| 3 | [TODO: DATA SOURCE] | A reviewed brand-to-legal-name alias table (e.g. Instacart → MAPLEBEAR INC), one line per alias. Each line records who checked it and how | fewer `no-company-match` holds without fuzzy matching. Every alias is still labeled your-input | the table at a path the maintainer chooses, with per-line provenance |
| 4 | [TODO: DEV] | Compute the timeline factor from the persona's dates (OPT end date, unemployment days used, ceiling, buffer) and a stated hiring lag. This is the Chapter 10 feed; no script computes it today | the timeline gate stops depending on a hand-typed factor | a script with conformance passing and a test showing that a factor of 0 comes out when the clock cannot fit the stated lag |
| 5 | [TODO: DEV] | A requirements check before scoring. Read the posting description through the same public ATS APIs the scanner uses, then hold roles that explicitly exclude new graduates, state a minimum of N+ years, or present a talent pool ("expression of interest") as an opening. Added after worked run 3's review found six of eight postings with no seniority word in the title asking for 2–12+ years or excluding new graduates | fit stops resting on the title alone (cannot-verify item 9). The talent-pool gap in the worked-run analysis closes | a script with conformance passing, a named network host in the rules, and offline fixture tests (saved description text) covering each hold |

## Defects found in the engine (reported, not patched in this contribution)

| # | Defect | Evidence | Suggested fix (maintainer's call) |
|---|---|---|---|
| D1 | `applyProfile` in `scripts/score/role-scorer.mjs` reads only a free-text `authorization` field. Its regex includes `authorized`, so "F-1 STEM OPT — work authorized (EAD)" sets the sponsorship weight to 0. `search/examples/README.md` says a PR #37 fixed this and that `needs_sponsorship` wins, but the scorer on `main` never reads `needs_sponsorship`. On the Chapter 11 example, the Proven biotech role drops from Apply (0.446) to Skip (0.1785) | reproduced by the break test `test_authorization_text_that_zeroes_sponsorship_voids_the_run` | honor an explicit `needs_sponsorship` boolean first; drop `authorized` from the free-text regex |
| D2 | A missing `liveness` or `timeline` term is scored as 1.0 (fully open) | `role-scorer.mjs`: `num(role.liveness?.factor) ?? 1` | treat a missing gate as closed, or refuse to score the role |
| D3 | `role-scorer.mjs` exports nothing and runs `main()` on import, although `CONTRIBUTING.md` says harnesses import `CONFIG`, `SRC`, `applyProfile`, `scoreRole` | reading the file; importing it runs the CLI | export the four names; run `main()` only when executed directly |
| D4 | The Contrib Gate CI is red on `main` for every push since at least 2026-09-17. `harness-regression` calls four scripts that do not exist (`scripts/test/gate-behavior-harness.mjs`, `scripts/test/fuzz-invariants.mjs`, `scripts/gates/gate-behavior-harness.mjs`, `scripts/score/scorer-harness.mjs`). `doctor-and-pii` fails on a false positive (next row). Every student PR inherits both | `gh run list -R nikbearbrown/the-reallocation-engine --workflow "Contrib Gate"` | restore or remove the four steps; fix D5 |
| D5 | `node scripts/pii-scan.mjs` fails on a fresh clone. `package-lock.json` contains npm's deprecation text for `glob`, which includes a maintainer's contact address | running the scan on a fresh clone (exit 1, one `[email]` finding in `package-lock.json`) | skip lockfiles, or treat npm deprecation strings as package metadata |
| D6 | `npm run ats:scan -- --dry-run`, the first command in the assignment's setup, exits 1 on a fresh clone: "portals.yml not found" | fresh-clone run | fall back to `data/ats/portals.example.yml` in dry-run mode, or say to copy it |
| D7 | 42 H-1B records in the sponsorship file appear value for value on 85 companies, 69 of them differently named lookalikes (e.g. PATHAI INC / PATHRAI INC; AKERO / KEROS THERAPEUTICS). This is consistent with the fuzzy join copying one employer's history onto another | `…/evidence/rules-audit-v0.2.0/rules-audit.md`, table "H-1B records shared with a differently named company" | rerun entity resolution once raw LCA data exists (proposal 1). Until then, flag shared records in the file's audit |
| D8 | `recipes/local-wage-adjustment.md` points at `data/bls/local-wage/*.csv`, `data/BLS/local-wage-adjustment-audit.md` and `logs/attestations/…`. None of them ships in the Fall 2026 cut | `test -e` on each path | re-ship them, or mark the recipe's inputs missing |
