# FACTCHECK — claude-liam-engine-overview

Status: **GATE F PASS** — 2026-09-16. All claims verified against source files read before authoring.

---

## Claim table

| # | Beat | Claim (as spoken / shown) | Verdict | Source / derivation | Fix |
|---|---|---|---|---|---|
| 1 | B00 | "the-reallocation-engine: a working machine that decides which job postings an F-1 student on the OPT clock should skip" | ✓ PASS | README.md: "You can clone it, open a terminal, type a command, and get a sourced Apply / Consider / Skip decision about a real role." | — |
| 2 | B01 | "Five components, two hard gates, one composite score." | ✓ PASS | DOMAIN.md: "five evidence components… Liveness and timeline are gates, not votes." | — |
| 3 | B01 | "A healthy run skips more than half of what it evaluates." | ✓ PASS | DOMAIN.md verbatim: "a healthy run skips at least half of evaluated roles" | — |
| 4 | B02 | "In sixty to ninety days of OPT authorization" | ✓ PASS | README.md verbatim: "sixty to ninety days to find a sponsoring employer" | — |
| 5 | B02 | "The first sign of trouble is usually not failure but fluency." | ✓ PASS | README.md verbatim quote | — |
| 6 | B03 | Skip majority (52 of 100) shown as success metric | ✓ PASS | DOMAIN.md: "a healthy run skips at least half"; 52 > 50 is illustrative of that principle; labeled "of 100 roles" (illustrative proportion, not a specific run count) | — |
| 7 | B04 | Five components: SEC Form D, 80 Days Sponsor, ATS Liveness, BLS Role Quality, Visa Timeline | ✓ PASS | DOMAIN.md "What this domain does": all five named explicitly | — |
| 8 | B04 | "Two of them are gates — they don't vote, they veto." | ✓ PASS | DOMAIN.md: "Liveness and timeline are gates, not votes." | — |
| 9 | B05 | "scripts/sec/refresh-recent-sec-quarters.py" as the SEC pipeline script | ✓ PASS | DOMAIN.md verified command surface: "python3 scripts/sec/refresh-recent-sec-quarters.py" | — |
| 10 | B06 | "profile-conditional sponsorship weight" | ✓ PASS | DOMAIN.md item 3: "Profile-conditional sponsorship weight (design-doc principle)" | — |
| 11 | B07 | "ATS liveness checks on Greenhouse, Lever, or Ashby" | ✓ PASS | DOMAIN.md: "ATS provider scan (Greenhouse/Lever/Ashby)"; "npm run ats:liveness" | — |
| 12 | B07 | "A closed posting multiplies the composite by zero." | ✓ PASS | DOMAIN.md item 3: "liveness × timeline" in formula — binary gate (0 or 1 multiplier) | — |
| 13 | B08 | "100 of 112 metro-occupation pairs returned an adjusted wage band. The 12 misses get a reason code." | ✓ PASS | DOMAIN.md item 9: "100/112 (12 missing, split 6 suppressed + 6 absent-row); …missing excluded and never treated as zero." | — |
| 14 | B08 | "Metro OEWS data joined against BEA purchasing-power parity" | ✓ PASS | DOMAIN.md item 9: "joins BLS metro OEWS (May 2024) to BEA all-items RPP (2024)" | — |
| 15 | B09 | Visa timeline is a gate that vetoes before composite runs | ✓ PASS | DOMAIN.md: "Liveness and timeline are gates, not votes." | — |
| 16 | B11 | Formula: (Σ vote × weight) × liveness × timeline; threshold 0.3 → Apply/Consider/Skip | ✓ PASS | DOMAIN.md item 3: "(Σ vote·weight) × liveness × timeline, threshold 0.3 → Apply/Consider/Skip, with liveness/timeline as multiplicative gates" | — |
| 17 | B12 | "Cambridge biotech → Apply 0.446; same role, no sponsor record → Skip 0.178" | ✓ PASS | DOMAIN.md item 3: "Verified against Ch.11's worked example (Cambridge biotech → Apply 0.446; identical non-sponsor → Skip 0.178)" | — |
| 18 | B14 | "Claude Code executes the automatable steps and stops at every gate." | ✓ PASS | DOMAIN.md: "Claude Code (or Cowork/Codex) is the v0 runtime. A recipe's run section is addressed to the agent: execute the named step, stop at every gate, wait for human clearance, log the run." | — |
| 19 | B15 | npm run doctor, npm run ats:scan, npm run score as runnable commands | ✓ PASS | package.json scripts table + DOMAIN.md "Runnable today (verified command surface)" | — |
| 20 | B16 | "Machines verify conformance; humans verify adequacy." | ✓ PASS | AGENTS.md verbatim: "4. Machines verify conformance; humans verify adequacy." | — |
| 21 | BVDT | "github.com/nikbearbrown/the-reallocation-engine" | ✓ PASS | README.md Quick start: "git clone https://github.com/nikbearbrown/the-reallocation-engine.git" | — |
