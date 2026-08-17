# The Honest Run — Gate-Behavior Harness

**Component:** `scripts/score/gate-harness.mjs`
**Run by:** Saloni Angre · 2026-08-11
**Machine:** macOS, node v24.2.0, python3 3.12.7
**Repository state:** fork `Sal03/the-reallocation-engine`, branch `contrib/saloni-gate-harness`, synced with `upstream/main`

All terminal output below is pasted verbatim from the session. Nothing is
described where it could be shown.

---

## 1. Plausibility audit — before trusting the harness, check the thing it tests

The harness reports on the scorer. Before believing the harness, I ran the
**scorer itself** across the same ten fixtures and read every row, because a
harness that agrees with a broken scorer is worth nothing.

The specific question Chapter 16 poses: *does a role past the OPT window get
gated, not merely down-weighted?*

```
$ npm run score -- output/gate-harness/plausibility-roles.json --out-dir output/gate-harness

✓ scored 10 roles → Apply 3 · Consider 1 · Skip 6 (skip 60%)
  output/gate-harness/role-scores.json  +  output/gate-harness/role-scores.md
  ! Fixture Hotel (synthetic): override WITHOUT a documented reason — ignored (Ch.11: that is just ignoring the math)
```

The four rows that answer the question:

| Role | liveness | timeline | Composite | Rec | Reason given |
|---|---|---|---|---|---|
| Fixture Bravo | 1.0 | **0.0** | **0.000** | Skip | `gated: timeline ≈ 0.000 (a closed gate zeroes the composite regardless of votes)` |
| Fixture Alpha | **0.0** | 1.0 | **0.000** | Skip | `gated: liveness ≈ 0.000 (...)` |
| Fixture Charlie | **0.05** | 1.0 | 0.033 | Skip | `gated: liveness ≈ 0.050 (...)` |
| Fixture Delta | **0.06** | 1.0 | 0.039 | Skip | `composite 0.039 < 0.2 — time is better spent elsewhere` |

**Three things this establishes.**

*Gated, not down-weighted.* Bravo carries maximal sponsorship (1.0) and maximal
fit (1.0) — a company that always sponsors, for a role that fits perfectly. An
impossible start date drives it to exactly **0.000**, and the reason says
`gated`. The strongest possible evidence on every other axis does not buy it a
single point. That is a veto, not a penalty.

*The Charlie/Delta pair is the sharper finding.* Both are Skips. Both look
identical in a summary count. But Charlie's reason says **gated** and Delta's
says **low score**, and those mean completely different things to the person
reading them: Charlie means *this posting is not real*, Delta means *this job is
real but not worth your Tuesday*. One is a fact about the world; the other is a
judgment about priorities. A 0.01 difference in the liveness factor separates
them, and the scorer's output preserves the distinction rather than collapsing
both into "Skip."

*The override guard fired on its own.* Fixture Hotel supplies
`override: {decision: "Apply"}` with no reason. The scorer ignored it, kept the
Skip, and printed a warning — Chapter 11's rule that an undocumented override is
just ignoring the math.

**Metric readout:** skip rate **60%** (6 of 10). Chapter 15 sets ≥50% as healthy,
so this sits inside the working range. Stated honestly: this is a skip rate over
ten hand-built fixtures chosen to exercise gate behaviour, not a sample of the
job market. It shows the metric is computed and in range; it is not evidence
about real postings.

---

## 2. The harness run — real output

```
$ npm run score:gates

=== Gate-Behavior Harness — Bayesian Role Scorer (Ch.11) ===
scorer   : scripts/score/role-scorer.mjs
fixtures : scripts/score/fixtures/gate-cases.json (10 cases)
provenance: fixtures are SYNTHETIC test vectors — no real company data

--- CONFIG ---
PASS  config-matches-fixtures        all 6 values match the config the expected values were derived from

--- BASELINE (unmodified scorer) ---
PASS  G1-liveness-zero-with-maximal-votes
        composite 0 (vote_sum 0.65 x gate_product 0) -> Skip
PASS  G2-timeline-zero-with-maximal-votes
        composite 0 (vote_sum 0.65 x gate_product 0) -> Skip
PASS  G3-gate-boundary-at-threshold
        composite 0.0325 (vote_sum 0.65 x gate_product 0.05) -> Skip
PASS  G4-gate-boundary-just-above-threshold
        composite 0.039 (vote_sum 0.65 x gate_product 0.06) -> Skip
PASS  G5-two-partial-gates-multiply
        composite 0.1625 (vote_sum 0.65 x gate_product 0.25) -> Skip
PASS  G6-healthy-gates-strong-votes-apply
        composite 0.555 (vote_sum 0.555 x gate_product 1) -> Apply
PASS  G7-soft-timeline-demotes-apply-to-consider
        composite 0.3052 (vote_sum 0.555 x gate_product 0.55) -> Consider
PASS  G8-override-without-reason-is-ignored
        composite 0.065 (vote_sum 0.065 x gate_product 1) -> Skip
PASS  G9a-role-quality-absent
        composite 0.325 (vote_sum 0.325 x gate_product 1) -> Apply
PASS  G9b-role-quality-maximal
        composite 0.325 (vote_sum 0.325 x gate_product 1) -> Apply

--- STRUCTURAL (all cases, checked against the scorer's own trace) ---
PASS  arithmetic-identity
        composite == vote_sum x gate_product (tol 0.001) for 10/10 cases
PASS  trace-source-labels
        every vote and both gates carry a source label for 10/10 cases
PASS  both-gates-present
        liveness and timeline both appear as gates in 10/10 cases

--- PAIRED (cross-case relations) ---
WARN  P1-role-quality-inert
        G9a-role-quality-absent composite 0.325 vs G9b-role-quality-maximal composite 0.325 -> equal: true
        role_quality p moved 0.0 -> 1.0 with no change to the composite. ...

--- NEGATIVE CONTROL (mutated scorer: gates as additive votes) ---
      mutation applied: 2/2 patterns matched (gates-become-additive-votes, closed-gate-branch-removed)
CAUGHT  G1-liveness-zero-with-maximal-votes  baseline PASS -> mutant FAIL (mutant composite 0.8, rec Apply)
CAUGHT  G2-timeline-zero-with-maximal-votes  baseline PASS -> mutant FAIL (mutant composite 0.85, rec Consider)
CAUGHT  G3-gate-boundary-at-threshold  baseline PASS -> mutant FAIL (mutant composite 0.81, rec Apply)
CAUGHT  G4-gate-boundary-just-above-threshold  baseline PASS -> mutant FAIL (mutant composite 0.812, rec Apply)
CAUGHT  G5-two-partial-gates-multiply  baseline PASS -> mutant FAIL (mutant composite 0.825, rec Consider)

      negative control: 5/5 gate-sensitive assertions correctly failed under mutation

=== SUMMARY ===
config drift      : none
baseline cases    : 10 passed, 0 failed  (of 10)
structural checks : 3 passed, 0 failed  (of 3)
paired checks     : 1 warning(s)
negative control  : PASS — mutation caught by 5 assertion(s)
RESULT            : PASS
EXIT CODE: 0
```

---

## 3. The deliberate break attempt

A harness that has only ever passed has not been tested. So I introduced the
exact bug it exists to catch — the gate-as-vote regression — directly into the
shipped scorer, and ran the harness with its own negative control switched
**off**, so nothing but the baseline assertions could save it.

The mutation, applied to `scripts/score/role-scorer.mjs`:

```python
s.replace('const composite = voteSum * gateProduct;',
          'const composite = voteSum + (liveness * 0.20) + (timeline * 0.15);')
s.replace('const closedGate = gates.find((g) => g.factor <= CONFIG.gate_zero);',
          'const closedGate = null;')
```

```
$ npm run score:gates -- --no-mutate

--- BASELINE (unmodified scorer) ---
FAIL  G1-liveness-zero-with-maximal-votes
        composite 0.8 (vote_sum 0.65 x gate_product 0) -> Apply
        ! composite: expected 0, got 0.8
        ! recommendation: expected Skip, got Apply
        ! reason_contains: expected reason includes "gated", got composite 0.800 ≥ 0.3, gates healthy
FAIL  G2-timeline-zero-with-maximal-votes
        composite 0.85 (vote_sum 0.65 x gate_product 0) -> Consider
        ! composite: expected 0, got 0.85
        ! recommendation: expected Skip, got Consider
...
FAIL  G9b-role-quality-maximal
        composite 0.675 (vote_sum 0.325 x gate_product 1) -> Apply

--- STRUCTURAL ---
FAIL  arithmetic-identity
        composite == vote_sum x gate_product (tol 0.001) for 0/10 cases
        offenders: FIXTURE-G1, ... FIXTURE-G9B

=== SUMMARY ===
baseline cases    : 0 passed, 10 failed  (of 10)
structural checks : 2 passed, 1 failed  (of 3)
negative control  : skipped (--no-mutate)
RESULT            : FAIL
EXIT CODE: 1
```

**What the break attempt found.**

The harness caught it: exit code **1**, all ten baseline cases failed, and the
structural arithmetic check failed on 0/10.

But the more useful finding is *what the broken scorer did*, because it shows
what the harness is protecting against in human terms:

- **G1 — a confirmed dead posting scored 0.8 and was recommended `Apply`.** The
  liveness feed said the job does not exist. The broken scorer's stated reason
  was `gates healthy`. That is the ghost-job failure the engine exists to
  prevent, phrased with total confidence.
- **G2 — an impossible visa timeline scored 0.85 and was recommended `Consider`,**
  with the reason `above threshold (0.850) but one soft spot: timeline 0.000`.
  A start date that cannot happen, demoted to a "soft spot."

Neither of those looks like a crash. Both look like ordinary, plausible output.
That is exactly the failure mode Chapter 16 describes — *ran, looked reasonable,
and was wrong in exactly the way fluency hides* — and it is why the assertion
has to exist in code rather than in a reviewer's attention.

**A second, independent catch worth noting.** The `arithmetic-identity` check
failed on 0/10 cases without knowing anything about gates. It compares the
scorer's own reported `composite` against its own reported
`vote_sum × gate_product` — and under mutation those stopped agreeing
(`composite 0.8` vs `vote_sum 0.65 × gate_product 0`). The scorer's trace was
contradicting itself, and a check that needs no external ground truth spotted it.
That was not designed as a gate test; it turned out to be one.

**Restore and confirm:**

```
$ git checkout scripts/score/role-scorer.mjs
$ npm run score:gates
...
RESULT            : PASS
RESTORED EXIT CODE: 0

$ git status --short
?? output/gate-harness/
```

Fails on the bug, passes when fixed, and the scorer is byte-identical to
`upstream/main` afterward — the only untracked path is generated output, which
is not committed.

---

## 4. What the machine could not know

The harness returned PASS. Here is what that PASS does not cover.

**It cannot tell whether the inputs are true.** This is the load-bearing
limitation. The harness tests how the scorer *combines* five numbers. It has no
opinion on whether any of them is right. Hand it a role record that says
`liveness: {factor: 1.0}` for a posting that was filled three weeks ago, and every
assertion passes, the composite is computed correctly, and the recommendation is
wrong. The arithmetic being right is not the same as the answer being right, and
this component only checks the first. Posting liveness is Chapter 8's job.

**It cannot tell whether the weights are defensible.** It asserts the config it
was written against, so it detects drift — but 0.35 sponsorship, 0.30 fit,
0.0 role quality are simply what the scorer currently declares. Two of the
scorer's own constants are marked `[VERIFY]` in its source, meaning the author
flagged them as unpinned. The harness faithfully tests values nobody has
confirmed are correct.

**It surfaced a decision it cannot make.** The `P1-role-quality-inert` warning is
real: `role_quality` moved from 0.0 to 1.0 with the composite unchanged at 0.325,
because its weight is 0.0. So the entire Chapter 9 role-quality signal —
BLS/O*NET work on whether a job is the kind AI is about to commoditise —
contributes nothing to any recommendation. The harness can prove that. It cannot
decide whether it *should* be zero. `DOMAIN.md` gap 3 records this as an open
authorial decision, and it stays with a human.

**It cannot judge whether a Skip was right for a person.** The scorer said Skip to
six of ten roles. Whether a particular international student, eight weeks from an
OPT deadline, should nonetheless apply to a gated role because they have a warm
referral there is not in any of these numbers. The engine's own framing is that
it hands that call back, and this component does nothing to change that.

**It cannot see the history it lives in.** The privacy gate confirmed no PII is
tracked at commit time. It could not see that the same file remains reachable in
git history and in a pull request already opened upstream. The gate was not
wrong; its scope is the working tree. Knowing that the scope is narrower than the
word "clean" suggests required looking, not running.

---

## 5. Reflection — what went well, what did not

**Went well.** The negative control earned its place. Without it, ten green
PASSes would have been indistinguishable from ten vacuous assertions. Watching
all five gate-sensitive cases flip to FAIL under mutation is the only reason the
baseline result means anything.

**Did not go as expected.** I built this expecting to find the gate-as-vote bug.
It is not there — `role-scorer.mjs` implements the gates correctly as
multipliers. The contribution therefore is not a bug fix but a regression
barrier: the property is currently true, and nothing was previously stopping it
from silently becoming false. That is a less dramatic finding than a bug, and it
is the honest one.

**Broke during testing, fixed.** The privacy gate blocked the run on a tracked
personal file. That was fixed before any capstone commit, and the incident is
documented in the attestation rather than quietly cleaned up — a gate that has
never caught anything is decoration, and this one caught something on its first
real use.

**Next steps I did not take.**
- `private/` is still not gitignored (`manifest-check` W2). Fixing it belongs in a
  separate commit, not in this contribution's diff.
- The harness covers gate semantics. Profile-conditional sponsorship weighting
  (`applyProfile`) and soft-tier demotion are only partially exercised.
- The mutation is string-match based. A property-based or AST-level mutation
  would survive refactoring; this one reports drift instead, which is honest but
  weaker.
