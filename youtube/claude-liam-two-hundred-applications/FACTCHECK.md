# FACTCHECK — claude-liam-two-hundred-applications

Status: PASS — Claude Code session 2026-08-23; pending Bear sign-off

Date: 2026-08-23 | Checker: Claude Code session  
Source: `the-reallocation-engine-fresh/book/chapters/00-introduction.md`  
Verified against: live repo (`npm run score`, `data/examples/ch11-roles.json`)

---

## Overall: PASS — three figure families stripped; on-screen claims verified

---

## On-screen claims

| Claim | Beat | Verdict | Source | Fix |
|---|---|---|---|---|
| "Episode two" (B00 narration) | B00 | ✓ VERIFIED | BUILD-LOG.md: this reel is Episode 2 of The Reallocation Engine playlist | — |
| "200 applications, 31 days remaining" (opening scenario) | B01 | ✓ VERIFIED | Chapter intro: "two hundred applications … thirty-one days left on her OPT clock" | — |
| Caption "the book's opening scenario" on B01/B02 | B01, B02 | ✓ VERIFIED | Design choice — explicitly labelled as scenario, not a population rate | — |
| About a third of postings were real (Mira scenario) | B02 | ✓ VERIFIED | Chapter: "roughly a third of those postings were real" | — |
| More than half the real roles had never sponsored (Mira scenario) | B02 | ✓ VERIFIED | Chapter: "more than half of the real roles … had never sponsored a visa" | — |
| AI-assisted group scored 50%; hand-coded 67%; gap ~17 pts ≈ two letter grades | B04 | ✓ VERIFIED | arXiv:2601.20245 (Shen & Tamkin, Anthropic 2026), n=52; chapter cites primary source | — |
| Citation: "Shen & Tamkin, Anthropic, 2026 · n = 52 · arXiv:2601.20245" | B04 | ✓ VERIFIED | Primary source; arXiv preprint DOI confirmed | — |
| AI-assisted group "felt they had learned more" (despite lower score) | B04 | ✓ VERIFIED | Chapter and study: self-reported learning perception was higher in AI group | — |
| 90-day OPT clock | B01, B11 | ✓ VERIFIED | USCIS Policy Manual Vol. 2, Part F, Ch. 5 | — |
| Two gates (liveness + sponsorship) in the routing diagram | B11 | ✓ VERIFIED | The Reallocation Engine recipe logic; `npm run score` confirmed liveness/sponsorship as gate fields | — |
| B10 scorer output: sponsorship 0.90 · fit 0.70 · liveness 1.00 · timeline 0.85 (Cambridge biotech) | B10 | ✓ VERIFIED | Live run: `npm run score data/examples/ch11-roles.json` → exact match | — |
| "the market is paying for exactly this combination — your domain, plus AI" | B12 | ✓ MECHANISM ONLY | Replaces stripped `[^00-premium]` (56% wage figure); mechanism claim, no percentage on screen | — |
| "may reject it with no human in the loop" | B08 | ✓ MECHANISM ONLY | Replaces stripped `[^00-screening]` (82%/21% figures); mechanism description only | — |
| "a match-score vendor … whose bias you cannot inspect" | B08 | ✓ MECHANISM ONLY | Replaces stripped `[^00-eightfold]` (named vendor + case); generic description only | — |

---

## Stripped claims (never reach screen)

| Family | What was stripped | Reel says instead |
|---|---|---|
| `[^00-premium]` | ~56% validated-AI-skill wage premium | "the market is paying for exactly this combination — your domain, plus AI" |
| `[^00-screening]` | ~82% screen with AI / ~21% auto-reject | "may reject it with no human in the loop" |
| `[^00-eightfold]` | Eightfold AI · *Kistler v. Eightfold* | "a match-score vendor … whose bias you cannot inspect" |

---

**Result: FACTCHECK PASS.**  
Two on-screen figures with primary-source citations (RCT: arXiv:2601.20245; OPT clock: USCIS). Mira's scenario numbers labelled as scenario throughout. Three `[verify]`-flagged figure families stripped to mechanism. B10 scorer values confirmed live against the repo's own scorer.
