# Five-minute demonstration — Experienced Java Backend Opening Triage (rules v0.4.1)

## Executive summary

This is a timed plan for the in-class show-and-tell. It covers the situation, the information
asymmetry, one thing learned from running the mode, and one honest limitation. It uses only the
terminal and two files. Every number comes from a committed run. Lines marked **[Aditya]** must be
in Aditya's own words. The presentation date has not been confirmed.

## Before class (once)

```bash
cd /Users/adityaraj/Desktop/the-reallocation-engine-a2      # the worktree with the branch checked out
node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs \
            scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs   # expect 77/77
```

Open `course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.4.1/triage.md`.

## Timeline

| Time | Show | Say (outline) |
|---|---|---|
| 0:00–0:45 | the recipe's "Situation" table | An international master's student with years of full-time Java backend experience and an early-2027 start: not a new grad, not yet "senior". The fictional persona has 50–54 full-time months plus a separate co-op. **[Aditya]** why this situation matters (no private details). |
| 0:45–1:30 | `DOMAIN-JUSTIFICATION.md`, "The information asymmetry" | Postings mix total-career and skill-specific years. At about 4.5 years the co-op is the difference, and no posting explicitly says whether co-ops count. All three employers have 1,250+ sponsorship approvals, yet the rules detected no sponsorship or start wording in any of the 18 posting bodies. |
| 1:30–2:45 | **live:** the replay command, then the decision table | 2 skips (10+ years backend; a Master's + 6 years), each quoted. Show Stripe 8230952: full-time 50–54 vs 60 months; the co-op would make it 54–60; the posting is silent, so a person decides. Say: **this replays postings captured 2026-10-21, not a live check today.** |
| 2:45–3:45 | `runs/holdout-v0.4-first/triage.md` and evidence 22 | **One thing learned:** frozen rules on 6 unseen postings agreed with Claude-reviewed expectations (written before the run) on 40/48 checks — agreement with the rules' author, not measured accuracy — but missed Databricks' export-control clause, because it was rendered as a bold heading. Nothing was wrongly skipped, but the wrong reason was shown. Repaired afterwards; that rerun is development evidence. **[Aditya]** what you make of it. |
| 3:45–4:30 | the recipe's "What it cannot verify" | **One limitation:** it cannot tell you an opening will sponsor, says nothing about work authorization, and its accuracy beyond these three boards is unknown. |
| 4:30–5:00 | — | Status: RUNNABLE-SAMPLE (human-judged adequate); not RUNNABLE-LIVE. Deferred: application-form questions; a fresh unseen sample from other employers would be the next test. |

## Live command (offline, about 1 s)

```bash
node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run \
  --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json \
  --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json \
  --out-dir "$TMPDIR/demo"
```

Expected first line: `✓ 12 openings (replay-of-captured-excerpts) → human-eligibility-review 4 ·
human-liveness-review 4 · human-requirement-review 2 · skip-application 2`.

## Fallback

If the projector or terminal fails, show `WORKED-RUN.md` sections 1, 2, and 5. They contain the
same output, pasted verbatim.
