# Final review packet — Assignment 2 mode (rules v0.4.1, feature scope frozen)

## Executive summary

This is the single remaining human-review step for Aditya. It explains the mode's final behaviour
through three real cases, gives one terminal block to run personally, one live-page cross-check,
three reflection questions, and one consolidated confirmation. Nothing in it records Aditya as
having run, checked, approved, or learned anything; those parts stay pending until Aditya supplies
them.

## A. Final behaviour in three cases (development sample; replay of captures from 2026-10-21 00:01 EDT)

1. **Documented mismatch: Stripe 8198280.**
   - Quoted: "Must have a Master's degree or foreign equivalent in Computer Science, Software
     Engineering, or a related field, plus six (6) years of software development experience."
   - Interpretation (rule): a general minimum of 72 months; full-time 50–54, and 54–60 with the
     co-op → `skip-application`.
   - Limitation: a mismatch with the stated requirement, not a claim the employer could never make
     an exception. The Master's clause itself is recorded, not judged.
2. **Co-op / skill ambiguity: Stripe 8230952.**
   - Quoted: "…plus five (5) years of related work experience in Software Engineering." and
     "5 years of experience programming in Java, Scala, or Python;"
   - Interpretation: the general minimum is 60 months; full-time 50–54 < 60 and 54–60 with the
     co-op. The posting is silent on co-ops, and the Java line is skill-specific (career length
     does not establish it) → `human-requirement-review`.
   - Limitation: month-only dates, and no scoped input exists for the persona.
3. **Eligibility review: Databricks 8864368002.** (Liveness counterpart: 4 Pinterest postings are
   listed in the employer feed while the page returns HTTP 403 "Just a moment…", 272 characters →
   review, never skip.)
   - Quoted: "If access to export-controlled technology or source code is required for performance of
     job duties, it is within Employer's discretion whether to apply for a U.S. government license
     for such positions, and Employer may decline to proceed with an applicant on this basis alone."
   - Interpretation → `human-eligibility-review`.
   - Limitation: missed by the frozen v0.4.0 rules (bold heading line); found by the unseen
     check; repaired in v0.4.1.

**Unseen check.** The first result of frozen v0.4.0 was **40/48 checks and 4/6 final steps agreeing
with Claude-reviewed expectations**: agreement with the rules' author, not independently
established accuracy. The repaired rerun (47/48, 6/6) is development evidence.

**Open human gate:** the `[TODO APPROVE]` adequacy review. No report is human-approved yet.

## B. Terminal block (run it yourself; Claude's own verification run is evidence 33 and is labelled as Claude's)

```bash
cd /Users/adityaraj/Desktop/the-reallocation-engine-a2 || exit 1
NS=scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027
SUB=course/2026fa/submissions/aditya-raj-sde/assignment-2
OUT="$(mktemp -d "${TMPDIR:-/tmp}/a2-review.XXXXXX")"
echo "OUT=$OUT"
{ echo "started=$(date '+%Y-%m-%d %H:%M:%S %Z')"; echo "commit=$(git rev-parse HEAD)"; echo "branch=$(git rev-parse --abbrev-ref HEAD)"; echo "tracked_changes_before=$(git status --short --untracked-files=no | wc -l | tr -d ' ')"; echo "node=$(node --version) npm=$(npm --version) $(git --version)"; } > "$OUT/00-env.txt"
node --test "$NS/triage.test.mjs" "$NS/regression-v04.test.mjs" > "$OUT/01-tests.txt" 2>&1; echo "tests_exit=$?" >> "$OUT/exit-codes.txt"
node "$NS/triage.mjs" run --input "$SUB/real-sample/observations.json" --candidate "$NS/config/candidate.tariq-lindqvist.json" --out-dir "$OUT/replay" > "$OUT/02-replay.txt" 2>&1; echo "replay_exit=$?" >> "$OUT/exit-codes.txt"
node "$NS/triage.mjs" compare "$SUB/runs/real-replay-v0.4.1/triage.json" "$OUT/replay/triage.json" > "$OUT/03-compare.txt" 2>&1; echo "compare_exit=$?" >> "$OUT/exit-codes.txt"
node "$NS/break-test.mjs" > "$OUT/04-break.txt" 2>&1; echo "break_exit=$?" >> "$OUT/exit-codes.txt"
mkdir -p private/a2-break && CTL="$(mktemp -d private/a2-break/ctl-XXXXXX)" && rmdir "$CTL" && git worktree add -q --detach "$CTL" HEAD && (cd "$CTL" && node --test "$NS/triage.test.mjs" "$NS/regression-v04.test.mjs") > "$OUT/05-control.txt" 2>&1; echo "control_exit=$?" >> "$OUT/exit-codes.txt"; git worktree remove --force "$CTL"
{ echo "tracked_changes_after=$(git status --short --untracked-files=no | wc -l | tr -d ' ')"; git worktree list; echo "finished=$(date '+%Y-%m-%d %H:%M:%S %Z')"; } > "$OUT/06-after.txt"
echo "==== SUMMARY ($OUT)"; cat "$OUT/00-env.txt" "$OUT/exit-codes.txt"; grep -E '^# (tests|pass|fail) ' "$OUT/01-tests.txt"; head -1 "$OUT/02-replay.txt"; cat "$OUT/03-compare.txt"; grep -E '^===|suite on mutant|real-sample decisions changed|MUTANTS' "$OUT/04-break.txt" | cut -c1-100; grep -E '^# (tests|pass|fail) ' "$OUT/05-control.txt"; cat "$OUT/06-after.txt"
```

Return the whole printed `==== SUMMARY` section, and the `OUT=` path, so Claude can read the saved
files.

## C. Live-page cross-check

- **URL:** https://stripe.com/jobs/search?gh_jid=8230952
- **Excerpt 1:** "5 years of experience programming in Java, Scala, or Python;"
- **Excerpt 2:** "plus five (5) years of related work experience in Software Engineering."
- **Report:** the date and time you checked, and for each excerpt one of: present verbatim / present
  with differences (say which) / absent / page inaccessible.

## D. Reflection questions (Aditya's answers only)

1. What distinction or limitation do you understand better now?
2. Which result surprised you, or still concerns you?
3. What would you improve next?

## E. Consolidated confirmation (Aditya to state, edit, or decline)

1. **Report adequacy:** I have read the v0.4.1 development, first-holdout, development-rerun, and
   synthetic reports, and judge them adequate / not adequate for the decisions they support.
2. **Human gates:** this clears the recipe's single `[TODO APPROVE]`, and nothing else. No posting's
   review gate (liveness, eligibility, requirement) is cleared by this confirmation.
3. **Attestation:** sign the attestation listing only what I ran and saw (B, C). Claude's runs,
   reviews, and expectations stay labelled as Claude's.
4. **Publication:** proceed with the final commit, the ZIP from that commit, pushing only the
   Assignment 2 branch, creating the replacement PR, then closing #45 with a cross-link (the graded
   commit `1a618e7`, its branch, and the Assignment 1 ZIP preserved).
