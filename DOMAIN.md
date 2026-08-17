# DOMAIN — The Reallocation Engine

**Domain:** evidence-first job-search system for international students (F-1/OPT/STEM OPT), and the working repository for the book *The Reallocation Engine*.
**Governed by:** `SNICKERDOODLE.md` (read it first). This file states what is specific to this repository: its data, its scripts, what is runnable today, and what is not.

## What this domain does

Reallocates scarce application effort using five evidence components: company funding (SEC Form D), sponsorship history (DOL/H-1B via 80 Days data), posting liveness (ATS detection), role quality (BLS/O*NET/SOC), and visa timeline. Liveness and timeline are gates, not votes. Skip is a successful outcome; a healthy run skips at least half of evaluated roles.

## Layout (actual, current)

| Path | What it is |
|---|---|
| `status.md` | **current state, latest decisions, next actions — read first** |
| `data/80-days-to-stay/` | upstream sponsorship/company source data — do not rewrite |
| `data/sec/form-d/` | SEC Form D raw/extracted/processed |
| `data/bls/` | BLS/O*NET/OEWS source + `data/bls/compact/` extracts |
| `data/ats/` | ATS working data — **private by default**, review before commit |
| `scripts/sec/`, `scripts/ats/`, `scripts/bls/`, `scripts/resumes/` | maintained automation (lowercase `scripts/` only; never `SCRIPTS/`) |
| `recipes/` | recipe specs with lifecycle frontmatter per SNICKERDOODLE.md |
| `chapters/` | book manuscript — no scripts or data in here |
| `pantry/` | research/reference material (currently empty) |
| `logs/RUN_LOG.md` | ground-truth run history |

Note: some recipes reference `data/raw/`, `data/verified/`, `logs/gate-decisions/` — the planned generic layout from the conductor spec. **Those directories do not exist yet.** Until they do, the domain-specific layout above is what runs.

## Runnable today (verified command surface)

```bash
npm run ats:scan -- --dry-run        # ATS provider scan (Greenhouse/Lever/Ashby)
npm run ats:liveness -- <job-url>    # posting liveness check
npm run ats:verify                   # pipeline integrity
npm run ats:merge | ats:dedup | ats:normalize
npm run resumes:pdf -- --all         # Markdown CV → ATS-safe PDF
npm run bls:local-wage -- --metro "Glens Falls, NY" --soc 15-1252
                                     # metro OEWS × BEA RPP → adjusted wage band, or missing + reason (Ch 9)
python3 scripts/sec/refresh-recent-sec-quarters.py
python3 scripts/sec/validate-h1b-join-sample.py
python3 scripts/bls/extract-soc-occupation-table.py   # KNOWN BUG: see below
python3 scripts/ats/analyze-patterns.py               # KNOWN BUG: see below
```

## Runtime

**Claude Code (or Cowork/Codex) is the v0 runtime.** A recipe's run section is addressed to the agent: execute the named step, stop at every gate, wait for human clearance, log the run. The `snickerdoodle` CLI named in recipe files is **roadmap, not runtime** — those commands do not execute anywhere yet.

## Recipe inventory

Core recipes (the operating surface): `_shared.md`, `scan.md`, `pipeline.md`, `oferta.md`, `tracker.md`, `pdf.md`, `patterns.md`, `update.md`. All are currently **DRAFT** — open typed TODOs, references to the unbuilt generic layout. The remaining recipe files (person-named case studies and monitor concepts) are drafts pending TODO closure and, for person-named files, privacy review before anything ships.

## Known gaps and defects (honest list, updated 2026-06-13)

1. ~~BLS extract reads `Recipes.txt`…~~ **RESOLVED** — reads `Skills.txt` (verified 2026-06-13).
2. ~~`analyze-patterns` / README reference `modes/RUN_LOG.md`…~~ **RESOLVED** — both use `logs/RUN_LOG.md` (verified 2026-06-13).
3. ~~The composite role scorer (book ch. 11) has no implementation.~~ **RESOLVED (2026-06-13)** — `scripts/score/role-scorer.mjs` (`npm run score <roles.json>`): the Bayesian combiner `(Σ vote·weight) × liveness × timeline`, threshold 0.3 → Apply/Consider/Skip, with liveness/timeline as multiplicative gates and a full per-term audit trace (each term labeled record / model-judgment / your-input — the chapter's auditability thesis). Profile-conditional sponsorship weight (design-doc principle). Verified against Ch.11's worked example (Cambridge biotech → Apply 0.446; identical non-sponsor → Skip 0.178). Emits JSON + a Markdown audit report + skip-rate. **[VERIFY] checked (2026-06-14):** neither Ch.11 nor `docs/search-profile-design.md` pins the `role_quality` weight or the Consider-band floor — confirmed unpinned, so the code's `[VERIFY]` labels stand. The real open item is now an **authorial decision**: `role_quality: 0.0` means the Ch.9 role-quality signal contributes nothing to the composite (it reproduces Ch.11's worked example, which doesn't exercise role quality). Decide whether role quality should carry weight — and renormalise — before real decisions.
4. ~~No recipe has ever completed a logged run.~~ **RUN EXECUTED (2026-06-14, sample mode)** — the `oferta` recipe (Ch.11 scorer) completed a gated, logged run on the verified fixture; all automatable gates pass, output fully sourced, reproduces the book. Artifacts: `logs/oferta-2026-06-14.json`, `reports/generated/oferta-2026-06-14.md`. **Still open:** the human adequacy gate (P4 second half) — a named-human attestation (name+date) promotes `oferta` past DRAFT.
5. ~~`npm run doctor` is planned, not built.~~ **RESOLVED (2026-06-13)** — `scripts/doctor.mjs`: checks tools, npm command-target existence, domain dirs, and a recipe-status dashboard (frontmatter coverage, status counts, declared-vs-body TODO mismatch). `--strict` exits 1 on a missing tool/target.
6. ~~Person-named recipes embed student names/IDs…~~ **RESOLVED (2026-06-13)** — 14 case studies anonymized to `case-*.md`; names + Canvas submission-IDs scrubbed in working tree **and** purged from git history (`git filter-repo`). Re-attach anonymized sources before they ship.
7. ~~Book manuscript says "skill"; repository says "recipe".~~ **RESOLVED (2026-06-14)** — agentic "skill" → "recipe" across the manuscript (chs 3, 4, 14, 15, 16, 98 + `outline.md`); O*NET / résumé "skills" left as job competencies. Ch.14 retitled "Recipes: Operating the Engine" (filename slug kept). **Still open:** all per-chapter derivative artifacts regenerated — `exercises/` re-extracted from the corrected chapters; `key-terms/` carries the Recipe term entry; the 9 study-aid files title-synced. (Any agentic "skill" left in `docs/` prose is the only remaining spot.)
8. ~~Only 7 of 42 recipes carry lifecycle frontmatter; declared `todos_open` undercounts body `[TODO` markers.~~ **RESOLVED (2026-06-13)** — all 42 recipes now carry `status`/`todos_open`/`last_gate`/`attestation`/`recipe_version`; `todos_open` reconciled to the true body count (declared 518 = body 518; run `npm run doctor`).
9. ~~Role quality reads the **national** OEWS estimate only; Ch.9 names this limit explicitly ("they don't capture… what the local market pays in your city").~~ **RESOLVED (2026-08-16, sample mode)** — `scripts/bls/local-wage-adjustment.py` (`npm run bls:local-wage`): joins BLS metro OEWS (May 2024) to BEA all-items RPP (2024) on exact `AREA` = `GeoFIPS` (387 matches, no fuzzy name matching) and returns `real = nominal / (RPP / 100)` as an adjusted median plus a 25th–75th band — or `status=missing` with exactly one of four reason codes (`no-metro-match`, `no-occupation-row`, `suppressed-small-sample`, `no-crosswalk-match`). No interpolation, no national fallback: a failed gate empties every wage column. Coverage on a sample frozen before the run: **100/112** (12 missing, split 6 suppressed + 6 absent-row); mean adjusted median `124695.1482` over the 100 ok rows, missing excluded and never treated as zero. Plausibility gate flags rows outside 0.3×–3× of the national median for human review and rewrites nothing (0 flagged). Recipe + card: `recipes/local-wage-adjustment.{md,card.md}`; honest run `reports/generated/local-wage-adjustment-20260817.md`; attestation `logs/attestations/local-wage-adjustment.md`. **Still open:** this feeds nothing yet — the Ch.11 composite still carries `role_quality: 0.0` (see item 3), so an adjusted metro wage does not change any Apply/Consider/Skip decision until that weight is set. It also cannot say what a specific employer pays; OEWS is an occupation-metro survey, not an offer.

## Privacy

Before committing, review `data/ats/` contents, rendered resumes/PDFs, and `.env*`. Application trackers, pipelines, and scan histories may reveal personal job-search activity. They appear after runs; they are not checked in by default.

## First win (zero-config)

Work through [`docs/tutorials/01-first-scan.md`](docs/tutorials/01-first-scan.md) — it walks the full loop: configure `portals.yml`, predict, run `npm run ats:scan -- --dry-run`, read the report line by line, judge it against the live board, and log the run. About 30 minutes; exercises included. The tutorial index is at [`docs/tutorials/README.md`](docs/tutorials/README.md).
