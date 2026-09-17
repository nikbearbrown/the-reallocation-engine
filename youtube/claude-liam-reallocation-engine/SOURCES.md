# SOURCES — claude-liam-reallocation-engine ("The Engine That Says No.")

## Source corpus

- `the-reallocation-engine` repo (github.com/nikbearbrown/the-reallocation-engine):
  - `DATA_CONTRACT.md` — "never invent a count, rate, or confidence"; label
    judgments as judgments; §Zero-Conditions (real PII ban; fictional personas).
  - `scripts/score/role-scorer.mjs` — fail-closed contract gates (`?? 0`),
    labelled optional funding gate (`?? 1` + `source:"missing"`), the
    authorization regexes (verbatim in B16/B21), explicit-field-wins ordering.
  - `book/chapters/15-the-pipeline-tracker-and-the-skip-rate.md` — the
    30/24/6 tracker example, the skip-rate bands (<40 failing · 40–50
    borderline · ≥50 healthy · >85 starved).
  - `search/examples/aarav-patel/` — the fictional persona used in B19
    (F-1 STEM OPT, free-text "work authorized (EAD)").
  - `logs/RUN_LOG.md` + SNICKERDOODLE P-principles — append-only log; gates
    cleared by a named human.
  - CI (`contrib-gate.yml`) — doctor + PII scan over full branch history;
    the five-harness regression suite.

## Claim ledger (for FACTCHECK.md at the factcheck gate)

| Beat | Claim | Basis |
|---|---|---|
| B04, B17 | 30 evaluated / 24 applied / 20% skip; praised as productive; bands incl. ≥50% healthy | chapter 15 (repo's own worked example) |
| B05 | 90-day OPT unemployment limit | USCIS F-1 OPT rule; also repo DOMAIN docs |
| B10, B16 | provenance labels record / your-input / missing; `?? 0` / `?? 1` lines | role-scorer.mjs, quoted verbatim |
| B20 | "authorized" free text formerly zeroed sponsorship; status-first fix; explicit field wins; unrecognized → binds + warning | role-scorer.mjs comments + code (PR #37 lineage) |
| B21 | negation-blind: "not a US citizen" matches `\bcitizen\b`; harness ships in repo | reproduced by execution during the maintainer audit; regex verbatim |
| B24–B25 | 25 students; five independent harnesses; 7/7, 3 invariants × 300 seeded (seed 42), 17/17, 0 gating failures, VALID | harness outputs executed during the Summer 2026 integration (all green against the merged scorer) |
| B26 | claimed status without attestation = contract violation, worth zero | course rubric + recipes/cases README |
| B27 | real data untracked; personas only resume-shaped files; CI scans full branch history | .gitignore + doctor.mjs + contrib-gate.yml |

## Deliberately stripped (DOUBLE-CHECK / datable-content law)

- No semester/term dates on screen or in narration ("a graduate course", not
  "Summer 2026").
- No student names anywhere. Persona names only (fictional by construction).
- No vendor tool versions, no model version claims.

## Seeds / determinism

- Fuzz harness quoted output uses the repo's own fixed seed (42) — already
  deterministic; no reel-side seeds needed yet. Manim scene seeds: n/a (no
  randomness planned).

## Credits

- Repo + book: Nik Bear Brown (@NikBearBrown).
- All stills for VOX beats: to be sourced at Gate D2 (tier-tagged in
  SHOPPING.md after audio lock); every archive slot will carry its
  `.source.txt` sidecar per the provenance law.
