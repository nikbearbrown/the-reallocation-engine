# opt-countdown report — 2026-10-02

## Summary

If a job hired in **56 days** (an assumption, the same for every job), the student would start on **2026-11-27**. Their real deadline is **2026-11-27**, set by running out of allowed unemployment days. That gives every job a timeline number of **0**.

Result: 5 jobs → Apply 1 · Consider 0 · Skip 4. Before this run (hand-typed timeline) it was Apply 2 · Consider 1 · Skip 2.

A job would need to start within **54 days** to stay above the scorer's closed-gate line (0.05), and within **36 days** to have no timeline penalty at all.

> **Not legal advice.** Whether the last allowed day counts, STEM extension eligibility, H-1B timing and cap-gap are questions for your DSO. This report does not answer them.

## Inputs (gate G-A)

| Input | Value | Source |
|---|---|---|
| as_of | 2026-10-02 | your-input |
| lag_days | 56 | your-input |
| opt_end | 2027-01-31 | record |
| used | 34 | record |
| ceiling | 90 | record |
| buffer | 20 | record |

Cleared by: **Revan Chonnad**. Check these against the real documents before trusting anything below.

## Dates

| Date | Value |
|---|---|
| expected_start | 2026-11-27 |
| days_out_date | 2026-11-27 |
| hard_deadline | 2026-11-27 |
| safe_deadline | 2026-11-07 |
| binding | unemployment |

## Jobs, before and after

| Job | Timeline before | Timeline after | Decision before | Decision after | Scorer reason |
|---|---|---|---|---|---|
| Cambridge biotech (Ch.7) — Data role (Proven tier) | 0.85 (your-input) | 0 (your-input) | Apply | **Skip** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) |
| Household-name non-sponsor — Same data role | 0.85 (your-input) | 0 (your-input) | Skip | **Skip** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) |
| Proven sponsor (ghost posting) — Looks perfect, isn't real | 0.85 (your-input) | 0 (your-input) | Skip | **Skip** | gated: liveness ≈ 0.000 (a closed gate zeroes the composite regardless of votes) |
| Likely-tier sponsor — Strong but Likely not Proven | 0.9 (your-input) | 0 (your-input) | Consider | **Skip** | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) |
| Non-sponsor, but HM is a contact — Scorer says Skip, you know better | 0.85 (your-input) | 0 (your-input) | Apply | **Apply** ⟵ human override | gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes) |

## Waiting for a human

**G-B: liveness unclear (0)**
- none

**G-C: timeline closed the gate (5)**: recheck the dates above before dropping any of these.
- biotech-data: factor 0 (start 2026-11-27 vs deadline 2026-11-27)
- household-nonsponsor: factor 0 (start 2026-11-27 vs deadline 2026-11-27)
- ghost-posting: factor 0 (start 2026-11-27 vs deadline 2026-11-27)
- likely-soft: factor 0 (start 2026-11-27 vs deadline 2026-11-27)
- override-demo: factor 0 (start 2026-11-27 vs deadline 2026-11-27). the roles file carries a human override, so the scorer still says Apply although the timeline gate is closed

## Labels

- **record**: read from a file (persona profile, roles file). The persona and the sample jobs are fictional/illustrative.
- **your-input**: an assumption made for this run (as-of date, hiring time, and the timeline number computed from them).
- **model-judgment**: fit scores, passed through from the roles file untouched.
