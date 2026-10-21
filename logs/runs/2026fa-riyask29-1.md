## 2026-10-02 — riyask29-data-analyst-sponsor-boston sample run 1

- **Recipe:** recipes/cases/2026fa/riyask29-data-analyst-sponsor-boston.md v0.1.0 (DRAFT)
- **Inputs:** persona `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/inputs/persona.example.json` (fictional) · candidates `…/inputs/candidates.json` (6 leads) · data: 80-days CSV (full shipped file), BLS compact, Form D samples (4 × 50) · liveness: live Playwright
- **Commands:** `node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --today 2026-10-02`, then the recipe's handoff and G1–G4 `node -e` tests, then `node --test scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.test.mjs`
- **Outputs:** written to `scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/out/` (liveness checked 2026-10-02T17:23:41Z–17:23:47Z), since overwritten by runs 2 and 3. The record of this run is its pasted terminal output in `course/2026fa/submissions/riyask29/WORKED-RUN.md`; a clean-copy execution of the same command, with the same next actions, is kept in `course/2026fa/submissions/riyask29/runs/run-1-clean-copy/`.
- **Result:** 6 leads · scored 2 · stopped G1 2 · G2 1 · G3 0 · no-posting 1 · scorer: Apply 0 · Consider 1 · Skip 1. Next actions: review-then-tailor (Abacus Insights), network (Benefits Science), skip (Klaviyo, timeline 0), check-posting-by-hand (EverQuote), resolve-company (Writer, HubSpot). Tests 8/8.
- **Handoff test:** pass (`handoff ok {"candidates":6,"scored":2,"stopped":{"G1":2,"G2":1,"G3":0,"no-posting":1},"form_d_in_sample":0}`)
- **Gate decisions (human):** *not cleared on this run's output. riyask29 re-ran (run 2) and cleared G1–G4 on 2026-10-02; the decisions are in `logs/runs/2026fa-riyask29-2.md`. The pending lines below are kept as the record of this run.*
  - G1 — Writer (`no-h1b-record`), HubSpot (`not-in-dataset`): _pending_ — riyask29, _date_
  - G2 — EverQuote (`uncertain`): _pending_ — riyask29, _date_
  - G3 — Abacus (4-week lag → 1.0), Klaviyo (10-week lag → 0): _pending_ — riyask29, _date_
  - G4 — Abacus "Business Analyst Manager - Data Distribution Team"; EverQuote "Quantitative Analyst" ×3; Benefits Science "Data Analyst": _pending_ — riyask29, _date_
- **Open issues:** (1) typo "Abacus Insight" returns `not-in-dataset` with no near-match hint; (2) EverQuote's company-hosted page returns liveness `uncertain`; (3) Form D funding check is uninformative on samples (0 of 6 in sample); (4) the run was executed by an AI assistant at the student's direction and is not yet re-run by the student from a clone of the pushed branch; (5) found in the repo, not fixed: `role-scorer.mjs` reads "work authorized" as no-sponsorship-needed. The prototype guards against it.
