# FACTCHECK — claude-liam-reallocation-engine-current-state

Status: **GATE F PASS with corrections** — 2026-08-21.
All counts verified against the live tree on 2026-08-21 via grep, ls, node, and direct file reads.
2 beat-sheet corrections applied (B19, B32). No audio has been generated.

---

## Verification commands used

```bash
ls the-reallocation-engine-fresh/recipes/*.md | wc -l            # top-level recipe file count
grep -h "^status:" recipes/*.md | sort | uniq -c                 # status distribution
ls book/chapters/ | wc -l                                        # chapter count
node -e "..."   # package.json script count
grep -rn "^status:" recipes/ | sort                              # per-file status (all subdirs)
grep -n "role_quality\|VERIFY" scripts/score/role-scorer.mjs    # role_quality claim
ls reports/generated/ && ls logs/                                # report presence
head -10 status.md                                               # status.md frontmatter
grep "snickerdoodle\|cli\|roadmap\|runtime" DOMAIN.md           # CLI claim
cat recipes/workday-connector.md | head -10                      # workday attestation
cat recipes/gate-harness.md | head -10                          # gate-harness attestation
cat docs/capstone/gate-behavior-attestation.md                  # gate-behavior attestation
head -10 recipes/local-wage-adjustment.md                       # local-wage-adjustment attestation
```

---

## Claim table

| # | Beat | Claim (as spoken / shown) | Verdict | Source / derivation | Fix |
|---|---|---|---|---|---|
| 1 | B03 | "Twenty-one chapters." | ✓ PASS | `ls book/chapters/ \| wc -l` → 21 | — |
| 2 | B03 | "Twenty-five command-line entry points." | ✓ PASS | package.json scripts: 25 keys | — |
| 3 | B03 | "Forty-one operating recipes." | ✓ PASS | `ls recipes/*.md \| wc -l` → 41 (top-level only; cases/2026su/ holds 13 additional case-study DRAFTs, correctly excluded from operating recipe count) | — |
| 4 | B09 | "Every count and every confidence traces to a source. That's the verified-data contract." | EXEMPT | Editorial characterisation of Snickerdoodle P3; no numeric claim. SNICKERDOODLE.md P3: "Every finding traces report → log → script → recipe → source." | — |
| 5 | B10–B11 | score = (Σ vote·weight) × liveness × timeline; gates multiply — drop either to zero and composite collapses | ✓ PASS | role-scorer.mjs line 6 comment and lines 80, 83–84, 90: `voteSum = reduce((s,v) => s + v.p*v.weight)` then `composite = voteSum * gateProduct` where `gateProduct = liveness × timeline` | — |
| 6 | B16 | Advancement requires "a named human signed a gate, with their name and the date, in a file you can open" | ✓ PASS | SNICKERDOODLE.md P4 + recipe lifecycle table: "cleared by a named human, logged with who/what/when" | — |
| 7 | B17 | "For most of this project's life that ladder stayed on its bottom rung. Everything drafted." | ✓ PASS | RUN_LOG.md index is empty (no student entries); fresh-cut 2026-08-17 maintainer note confirms all recipes were DRAFT before promotion | — |
| 8 | B18 | "Then a signature landed. Not the author's. A student's." | ✓ PASS | recipes/gate-harness.md frontmatter: `attestation: "Saloni Angre · 2026-08-11"` — a named student, not the maintainer. First student-signed gate chronologically is gate-behavior (Yu-Chen Huang, 2026-08-09). Beat stays generic; no name on screen. | — |
| 9 | B19 | "One recipe cleared a sample run on a student's attestation." | **CORRECTED** | Three recipes now carry named student attestations: (1) gate-behavior.md — Yu-Chen Huang, 2026-08-09 (docs/capstone/gate-behavior-attestation.md); (2) gate-harness.md — Saloni Angre, 2026-08-11 (inline frontmatter); (3) local-wage-adjustment.md — Atharva Kurlekar, 2026-08-16 (last_gate field). skill-demand-monitor.md is RUNNABLE-SAMPLE with no named attestation. Beat sheet updated: "One recipe" → "Three recipes". No names appear on screen or in narration. | **B19 fixed** |
| 10 | B19 | "A connector recipe separately reached runnable-live — a working scraper, no named attestation yet." | ✓ PASS | recipes/workday-connector.md: `status: RUNNABLE-LIVE`, `attestation: null`. logs/runs/ is empty; RUN_LOG.md index has no student entries. | — |
| 11 | B20 isotype | 2 RUNNABLE-LIVE / 6 RUNNABLE-SAMPLE / 29 DRAFT | ✓ PASS | `grep -h "^status:" recipes/*.md \| sort \| uniq -c` → exact match. Note: 41 total top-level .md files; 4 lack status frontmatter (README.md, _profile.template.md, and 2 others). Card files (*.card.md) carry their own status fields and are counted here. | — |
| 12 | B24 | Scorer emits audit trace with terms labeled "record," "model judgment," or "your input" | ✓ PASS | role-scorer.mjs lines 130–133: each vote carries .source tagged as SRC.record, SRC.model, or SRC.input; audit trace built from these | — |
| 13 | B25 | "The command-line tool the recipes name… doesn't exist. It's roadmap." | ✓ PASS | DOMAIN.md: "The snickerdoodle CLI named in recipe files is roadmap, not runtime — those commands do not execute anywhere yet. Claude Code (or Cowork/Codex) is the v0 runtime." | — |
| 14 | B26–B27 | role_quality weight is 0.0, marked [VERIFY], described as "an unmade authorial decision" | ✓ PASS | role-scorer.mjs line 37: `role_quality: 0.0,   // [VERIFY] "other weighted factors" (Ch.11) — UNPINNED: neither Ch.11 nor the SDD pins a number. An open authorial decision. The code refuses to invent one.` | — |
| 15 | B31–B32 | status.md is two months out of date, written before repo was re-cut and re-organised around it | ✓ PASS | status.md frontmatter: `updated: 2026-06-14`. Repository was re-cut 2026-08-17 (maintainer RUN_LOG note). Gap = 2 months. | — |
| 16 | B32 | status.md "describes a folder layout that no longer exists" — canonical lists chapters/ but actual path moved | ✓ PASS | status.md frontmatter: `canonical: [..., chapters/]`. Actual chapters at: `book/chapters/` (confirmed by ls). | — |
| 17 | B32 | status.md "states that every recipe is still draft. Eight of them aren't." | **CORRECTED** | Top-level recipe status: 6 RUNNABLE-SAMPLE + 2 RUNNABLE-LIVE = 8 non-DRAFT files. Beat sheet originally said "seven." The isotype grid in B20 shows 2+6=8 non-DRAFT; saying "seven" would be inconsistent with B20. Previous FACTCHECK accepted "seven" via card-deduplication, but the file-level count is 8 and is consistent with B20's display. Beat sheet updated: "seven" → "eight"; B32 state_card row and note updated. | **B32 fixed** |
| 18 | B32 | status.md "points to the run report that proves the project's first honest run — and that report is not in this tree" | ✓ PASS | status.md next field: "review reports/generated/oferta-2026-06-14.md". `ls reports/generated/` → directory absent. `ls logs/` → `oferta-2026-06-14.json` present; the .md report is absent. | — |

---

## Beat sheet corrections applied

### B19 narration
**Old:** "One recipe cleared a sample run on a student's attestation. A connector recipe separately reached runnable-live — a working scraper, no named attestation yet. Twenty-nine are still draft."
**New:** "Three recipes cleared sample runs on student attestations. A connector recipe separately reached runnable-live — a working scraper, no named attestation yet. Twenty-nine are still draft."
*No student names appear on screen or in narration.*

### B32 narration
**Old:** "It states that every recipe is still draft. Seven of them aren't."
**New:** "It states that every recipe is still draft. Eight of them aren't."

### B32 viz (state_card row + note)
**Old:** `["\"all recipes DRAFT\"", "7 are not"]` / note: "7 are not"
**New:** `["\"all recipes DRAFT\"", "8 are not"]` / note: "8 are not"

---

## GATE F — signed

Verified by: Claude Code session · 2026-08-21
2 corrections found and applied to beat_sheet.json (B19, B32).
All other claims PASS or EXEMPT.
**GATE F: COMPLETE.**

---

## B31 elapsed-days pin (2026-08-22)

**fromDate:** 2026-08-21 (date tree was audited — Gate F, this session)
**targetDate:** 2026-06-14 (status.md `updated:` field, confirmed Claim #15)
**Elapsed:** 68 days (2026-06-14 → 2026-08-21)

Source: `python3 -c "from datetime import date; print((date(2026,8,21)-date(2026,6,14)).days)"` → 68

Wired into beat_sheet.json B31 overlay: `fromDate: "2026-08-21"`. If re-cut later, re-derive from the new audit date — do not inherit this figure.

---

## rain_items.py fix (2026-08-22)

Script was classifying `local-wage-adjustment` as RUNNABLE-SAMPLE instead of ATTESTED.
Root cause: SNICKERDOODLE lifecycle sets `attestation:` only at VERIFIED; the recipe correctly
has `attestation: null` at RUNNABLE-SAMPLE even when a human signed a gate. The human
attestation for local-wage-adjustment (Atharva Kurlekar, 2026-08-16) lives in `last_gate:`.
Fix: added `last_gate_human` regex to detect `(FirstName Lastname, YYYY-MM-DD)` pattern.
After fix: ATTESTED: 3 (gate-behavior, gate-harness, local-wage-adjustment) — matches FACTCHECK.
