# Role Scorer report — 2026-10-21

*Bayesian Role Scorer (Ch.11). Weights: sponsorship 0.35, fit 0.3, role_quality 0 [role_quality weight is **[VERIFY]** — not pinned by the chapter]. Threshold 0.3. Profile requires sponsorship.*

**Summary:** 3 roles → Apply 2 · Consider 0 · Skip 1. **Skip rate 33%** (below the ~50% a healthy run skips; check the inputs).

| Role | Composite | Rec | Why | Audit (term · value · weight · source) |
|---|---|---|---|---|
| 1LIFE HEALTHCARE INC — Software Engineer | 0.580 | **Apply** | composite 0.580 ≥ 0.3, gates healthy | sponsorship 0.8·0.35 [record]; fit 1·0.3 [your-input] × liveness 1[your-input]×timeline 1[your-input] |
| Isaac Super Fake Tech LLC — Software Engineer | 0.300 | **Apply** | composite 0.300 ≥ 0.3, gates healthy | sponsorship 0·0.35 [your-input]; fit 1·0.3 [your-input] × liveness 1[your-input]×timeline 1[your-input] |
| Non-ATS Startup — Software Engineer | -0.300 | **Skip** | gated: liveness ≈ -1.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0·0.35 [your-input]; fit 1·0.3 [your-input] × liveness -1[your-input]×timeline 1[your-input] |

*Every term traces to its source. If you cannot explain a row term-by-term, distrust the recommendation before your confusion (Ch.11).*
