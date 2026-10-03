# Role Scorer report — 2026-10-03

*Bayesian Role Scorer (Ch.11). Weights: sponsorship 0.35, fit 0.3, role_quality 0 [role_quality weight is **[VERIFY]** — not pinned by the chapter]. Threshold 0.3. Profile requires sponsorship.*

**Summary:** 5 roles → Apply 1 · Consider 0 · Skip 4. **Skip rate 80%** (healthy — a good run skips at least half).

| Role | Composite | Rec | Why | Audit (term · value · weight · source) |
|---|---|---|---|---|
| Cambridge biotech (Ch.7) — Data role (Proven tier) | 0.000 | **Skip** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.9·0.35 [record]; fit 0.7·0.3 [model-judgment] × liveness 1[record]×timeline 0[your-input] |
| Household-name non-sponsor — Same data role | 0.000 | **Skip** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0·0.35 [record]; fit 0.7·0.3 [model-judgment] × liveness 1[record]×timeline 0[your-input] |
| Proven sponsor (ghost posting) — Looks perfect, isn't real | 0.000 | **Skip** | gated: liveness ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.9·0.35 [record]; fit 0.8·0.3 [model-judgment] × liveness 0[record]×timeline 0[your-input] |
| Likely-tier sponsor — Strong but Likely not Proven | 0.000 | **Skip** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.6·0.35 [record]; fit 0.85·0.3 [model-judgment] × liveness 1[record]×timeline 0[your-input] |
| Non-sponsor, but HM is a contact — Scorer says Skip, you know better | 0.000 | **Apply ⟵ override** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) | sponsorship 0.05·0.35 [record]; fit 0.7·0.3 [model-judgment] × liveness 1[record]×timeline 0[your-input] |

*Every term traces to its source. If you cannot explain a row term-by-term, distrust the recommendation before your confusion (Ch.11).*
