# RUN_LOG entry

## Executive summary

This is the log entry for the Mode Build run of the Data-Analyst Sponsor Check: what was run, on
what, what came out, and what is still open. **Result: the mode stays a DRAFT with real full-data
runs. Three of the original four TODOs are closed with evidence, and two typed TODOs are open.**

**Where it lives.** The brief says to append to `logs/RUN_LOG.md`. In the Fall 2026 repository that
file is protected: CI rejects any student PR that edits it, and its header tells students to write
`logs/runs/<term>-<handle>-<n>.md` instead. So the entry is committed as
`logs/runs/2026fa-riyask29-3.md`, and its text is below (the brief allows "or include it in your submission").

## Entry

## 2026-10-20 — riyask29-data-analyst-sponsor-boston v0.2.0: Mode Build runs (full Form D, DOL LCA, liveness fix)

- **Recipe:** recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.md v0.2.0 (DRAFT, 2 typed TODOs open after this entry's closures)
- **Who ran it:** the AI assistant (Claude Code) at riyask29's direction, in riyask29's checkout; riyask29 downloaded the DOL workbook in a browser. Gate decisions below are riyask29's to write.
- **Inputs:** fictional persona `inputs/persona.example.json` (F-1 OPT, 41/90 unemployment days used) · 6 leads `inputs/candidates.json` · data: 80-days CSV, BLS compact, **full SEC Form D quarters 2025Q2–2026Q1** (58,329 companies, gitignored), **DOL LCA slice** `data/lca-ma-analyst-fy2026q3.csv` (1,842 certified H-1B analyst-family LCAs at MA worksites, 855 employers, out of 437,496 filings; recounted independently with pandas: 1,842) · live Playwright liveness.
- **Provenance (DATA SOURCE closures, to be confirmed by riyask29):**
  - `data/sec/form-d/processed/companies-sec-{2025q2,2025q3,2025q4,2026q1}-d.json` — origin https://www.sec.gov/files/structureddata/data/form-d-data-sets/ (`<q>_d.zip`), fetched 2026-10-20 with `scripts/sec/download-form-d-quarters.py`; 2026Q2/Q3 → HTTP 404 (not yet posted). Confirmed: **yes — riyask29, 2026-10-20**
  - `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv` — origin https://www.dol.gov/media/LCA_Disclosure_Data_FY2026_Q3.xlsx (sha256 f8ca8448a528671f784d3692923775a13741c99caec2816b2fe30c8885bd28b3, 251,850,891 bytes), downloaded 2026-10-20 in a browser, cut with `lca_slice.py`. Confirmed: **yes, this is the file riyask29 downloaded from dol.gov — riyask29, 2026-10-20**
- **Commands (verbatim output in `course/2026fa/submissions/riyask29/mode-build/runs/`):**
  - fresh clone of upstream (015843d): `npm run verify` (pass, 3 known warnings) · `npm run doctor` (runnable) · `npm run ats:scan -- --dry-run` with the example portals · `npm run score` (prints usage only; with `data/examples/ch11-roles.json`: Apply 2 · Consider 1 · Skip 2) · `npm run ats:liveness` on 3 lead URLs (EverQuote **uncertain**)
  - this branch: `npm run ats:liveness` same URLs (EverQuote **active**); Form D download + refresh; `lca_slice.py`; final run `analyst_check.mjs --today 2026-10-20 --formd-dir data/sec/form-d/processed --lca <slice>`
  - tests: `analyst_check.test.mjs` pass 10 · `liveness_frames.test.mjs` pass 3 · `test_lca_slice.py` OK 5
- **Outputs:** `course/2026fa/submissions/riyask29/mode-build/runs/run-b-final/` (analyst-check-log.json, analyst-check-report.md, roles.json, role-scores.{json,md}, liveness.json)
- **Result:** 6 leads · scored 3 · stopped G1 2 · G2 0 · G3 0 · no-posting 1 · scorer: Apply 0 · Consider 2 (EverQuote 0.231, Abacus 0.420) · Skip 1 (Klaviyo, timeline 0). Benefits Science → network; Writer, HubSpot → resolve-company. LCA by SOC: EverQuote 2 adjacent; Abacus 1 adjacent (a Data Engineer); Klaviyo 1 core + 2 adjacent; HubSpot 1 adjacent (not in the sponsor CSV); Benefits Science 0 (Proven in the CSV); Writer 0.
- **Handoff test:** pass. Gate tests G1–G4: all exit 0.
- **Break attempts:** missing `--lca` file → exit 2, nothing written · "Abacus" / "hubspot inc." → stop at G1 with near matches, no sponsorship value · LCA workbook missing a column / empty → exit 2 · two mutant liveness checkers → each fails one frame test · Form D substring "abacus" → 12 unrelated funds (why the join is exact-name).
- **Broke and fixed:** SEC download failed `CERTIFICATE_VERIFY_FAILED` (python.org Python CA bundle; ran with `SSL_CERT_FILE=$(python3 -m certifi)`) · refresh reported every quarter `Missing` (folder mismatch; files moved up one level, recipe TODO 5) · dol.gov refused scripted downloads (403; downloaded in a browser) · a test expected the wrong median (test fixed, script was right) · the independent pandas recount read 437,496 rows where `lca_slice.py` reported 1,032,735: 595,239 formatted-but-blank sheet rows were counted as "not H-1B" drops; fixed (blank rows skipped and reported), new test, re-sliced — the CSV was byte-identical, only the audit's row accounting changed.
- **Gate decisions (human):**
  - G1 — Writer (`no-h1b-record`, no LCA): **unknown, not a non-sponsor; check manually before spending time on it** — riyask29, 2026-10-20
  - G1 — HubSpot (`not-in-dataset`): **sponsorship evidence exists** (1 certified LCA, 15-2041 Senior Statistical Analyst, Cambridge, FY2026); watch for an open Data Analyst posting and run it through this check — riyask29, 2026-10-20
  - G2 — EverQuote, Abacus Insights, Klaviyo: **open** — riyask29 opened all three postings in a browser, 2026-10-20
  - G3 — hiring lags (EverQuote 5 wk, Abacus 4 wk, Klaviyo 10 wk): **still realistic** — riyask29, 2026-10-20
  - G4 — Abacus "Business Analyst Manager - Data Distribution Team": **counts as analyst work** (tier stays Likely) — riyask29, 2026-10-20
  - G4 — EverQuote LCA "Senior Quantitative Analyst; Senior Analyst" (15-2051.00): **counts as analyst work** — riyask29, 2026-10-20
  - G4 — Benefits Science "Data Analyst": matches by definition; noted that it has no FY2026 LCA
- **TODO closures (this entry):** TODO 1 (DOL LCA) and TODO 2 (full Form D) closed by riyask29's provenance confirmation above; TODO 3 (liveness) closed by its DEV evidence. TODO 4 kept open by riyask29's decision (no hiring-lag source exists; not descoped).
- **Engine finding:** `npm run doctor` reads only top-level `recipes/*.md`, so it never counts student recipes in `recipes/cases/`; this recipe's TODOs checked by hand (declared 2 = body 2).
- **Open issues:** TODO 4 (hiring-lag evidence) has no source; TODO 5 engine folder-mismatch defect; the persona's unemployment days are a fixed input (41), not a running count; the LCA file is one fiscal year at Massachusetts worksites, exact names only.
