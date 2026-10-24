> **ARCHIVED 2026-10-21** — superseded by ../REVIEW-PACKET.md (final single review step). Kept unchanged below.

# Review packet — Assignment 2 mode (rules v0.4.1)

## Executive summary

This packet is for Aditya's own review. It gathers the evidence needed to judge whether the
screening reports are adequate, before anything is approved or signed. It shows one example of
each kind of decision with the employer's exact words, the unseen-posting results and their
limits, and the exact commands for re-running everything independently. Nothing in it records
Aditya as having checked, approved, or learned anything. Those entries are left for Aditya.

## 1. Co-op boundary case — Stripe 8230952 (Senior Software Engineer, Backend)

Source: https://stripe.com/jobs/search?gh_jid=8230952 · captured 2026-10-21T04:01:54.614Z

> “Must have a Bachelor's Degree or foreign equivalent degree in Computer Science, Information Systems Security, or a related field, plus five (5) years of related work experience in Software Engineering.”

- **Rule (general requirement):** full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: silent)
- **Decision:** `human-requirement-review` (G4). "five (5) years of": full-time only: 50–54 months vs 60 required; with the co-op: 54–60 months (co-op wording in this posting: silent). The 6-month co-op is the difference and this posting is silent about co-ops, so the outcome is unresolved — a person decides
- **Why unresolved:** full-time alone (50–54 months) is below 60. Only the co-op could reach 60,
  and the posting neither accepts nor excludes co-ops. Under your E14 rule, a person decides.
  Its skill-specific lines are unknown as well, for example:
  > “5 years of experience programming in Java, Scala, or Python;” → `scoped-duration-unknown` (career length never establishes years in Java).

## 2. A genuine documented mismatch — Stripe 8198280 (Software Engineer, Backend)

Source: https://stripe.com/jobs/search?gh_jid=8198280

> “Must have a Master's degree or foreign equivalent in Computer Science, Software Engineering, or a related field, plus six (6) years of software development experience.”

- **Rule:** full-time only: 50–54 months vs 72 required; with the co-op: 54–60 months (co-op wording in this posting: silent) → `skip-application` (G4). The minimum is above
  everything the candidate has worked, including the co-op.
- This is a documented mismatch against the stated requirement, not a claim the employer could
  never make an exception.

## 3. Blocked page / liveness conflict — Pinterest 8046860 (Sr. Staff Software Engineer, Product ML Infrastructure)

Source: https://www.pinterestcareers.com/jobs/?gh_jid=8046860

  - [record] listed in the employer board feed at capture: True (2026-10-21T04:01:53.537Z)
  - [record] page HTTP status / title / length (probe): 403 / "Just a moment..." / 272 chars (2026-10-21T04:03:14.375Z)
  - [model-judgment] maintained checker verdict (heuristic): expired / insufficient content — likely nav/footer only / insufficient content — likely nav/footer only (2026-10-21 00:02:07 EDT)

- **Decision:** `human-liveness-review` (G2). listed in the employer's board feed at 2026-10-21T04:01:53.537Z, but the page check said expired (insufficient content — likely nav/footer only); supplementary probe: HTTP 403, title "Just a moment...", 272 characters
- The same 403 pattern appeared on all 6 Pinterest postings (development and unseen). Claude did
  not try to bypass the challenge.

## 4. Unresolved sponsorship and timing — Pinterest 7683977 (Principal Engineer, AI Platform)

- Experience: `experience-requirement-unstated` (no years stated). Stack: `core-stack-evidenced`.
- Sponsorship wording in this posting: `silent`, meaning the rules detected no
  sponsorship wording in the captured posting body; application questions were not inspected.
- Start timing: `employer-timing-unstated`. Liveness: `feed-page-disagree`.
- **The same is true across the sample:** sponsorship `silent` on 18/18 captured bodies, and start
  timing unstated on 18/18. The company has 1364 recorded
  approvals (context only).

## 5. Eligibility wording — Databricks 8864368002 (Senior Software Engineer — Backend (Files Team))

> “If access to export-controlled technology or source code is required for performance of job duties, it is within Employer's discretion whether to apply for a U.S. government license for such positions, and Employer may decline to proceed with an applicant on this basis alone.”

- **Decision:** `human-eligibility-review` (G3). This was missed by rules v0.1–v0.4.0,
  because the sentence is a bold heading line. It was found by the unseen-posting check and
  repaired in v0.4.1.

## 6. Unseen-posting findings (first result of frozen v0.4.0, kept as the holdout result)

| Posting | Program (first run) | Claude's pre-written expectation |
|---|---|---|
| DATABRICKS INC 8798198002 — Staff Software Engineer, Lakeflow Pipelines DR | `human-requirement-review` | `human-eligibility-review` |
| DATABRICKS INC 8552484002 — Staff Software Engineer - AI Research Infrastructure | `human-requirement-review` | `human-eligibility-review` |
| PINTEREST INC 7494668 — Staff Software Engineer, Capacity Engineering | `human-liveness-review` | `human-liveness-review` |
| PINTEREST INC 8011573 — Sr. Systems Engineer, Sales & Marketing | `human-liveness-review` | `human-liveness-review` |
| STRIPE INC 8198207 — Software Engineer, Payins Card Networks | `human-requirement-review` | `human-requirement-review` |
| STRIPE INC 8197135 — Software Engineer, High Availability and Disaster Recovery | `human-requirement-review` | `human-requirement-review` |

- Check-level agreement: **40/48**; final step: **4/6** (evidence 22). No posting was wrongly
  skipped.
- **Misses:**
  - the export-control clause on 2 Databricks postings;
  - "What we look for" not recognized;
  - a cross-sentence "In the alternative".
- After repair (v0.4.1), the rerun gives 47/48 and 6/6. **That rerun is development evidence, not
  holdout performance.**
- **Limits:** 6 postings from the same 3 boards, on the same day. Claude wrote both the rules and
  the expectations. This can reveal errors, not establish accuracy.

## 7. Remaining limitations

- No opening-level sponsorship evidence. Application-form capture is deferred (typed TODO).
- Total career years cannot answer skill-specific requirements without a scoped input. None was
  invented for the persona.
- Month-only dates leave a ±2-month band on each entry.
- The maintained page checker reports a 403 challenge as "expired". This mode treats it as
  unknown; the upstream patch is deferred.
- The development rules were corrected on the samples they report on. There is no untouched test
  of v0.4.1.

## 8. Your own runs (exact commands)

Working directory: the existing worktree `/Users/adityaraj/Desktop/the-reallocation-engine-a2`,
or a fresh local clone (recommended for the clean-checkout row):

```bash
git clone --branch contrib/2026fa-aditya-raj-sde-java-backend-early2027 \
  /Users/adityaraj/Desktop/the-reallocation-engine-a2 ~/Desktop/a2-aditya-check
cd ~/Desktop/a2-aditya-check
```

Safe output locations: `"$TMPDIR/…"` (outside the repository), or
`course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/aditya-<name>/` if you want to keep
the output. Never `reports/` or another student's folder; the tool refuses both.

```bash
# 1. tests (offline) — expected 77/77
node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs \
            scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs

# 2. replay of the development sample (offline)
node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run \
  --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json \
  --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json \
  --out-dir "$TMPDIR/aditya-replay"
node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs compare \
  course/2026fa/submissions/aditya-raj-sde/assignment-2/runs/real-replay-v0.4.1/triage.json "$TMPDIR/aditya-replay/triage.json"

# 3. deliberate-break harness — WRITE YOUR REPLICATION PREDICTION FIRST (below)
node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/break-test.mjs
```

The harness creates and removes temporary worktrees under the gitignored `private/a2-break/`. It
never modifies your checkout.

**Replication prediction (before step 3).** The earlier results are already known (evidence 26),
so this is a *replication* prediction. For each of the 6 mutants, write down whether the suite will
catch it, and how many of the 12 development decisions it will change.

## 9. One cross-check for you

- **URL:** https://stripe.com/jobs/search?gh_jid=8230952. Claude saw it redirect to
  `https://stripe.com/careers/listing/senior-software-engineer-backend/8230952?gh_jid=8230952`.
- **Excerpts to find on the page:**
  - “5 years of experience programming in Java, Scala, or Python;”
  - “…plus five (5) years of related work experience in Software Engineering.”
- **Claude's observation:** both excerpts were present at 2026-10-21 15:41 UTC (evidence 29).
- **If the page has changed or won't load when you check, record that.** Do not treat the earlier
  observation as current.

## 10. Still yours to do

1. State your replication prediction, then run the commands in section 8.
2. Do the cross-check in section 9.
3. Read the reports and decide whether they are adequate (recipe `[TODO APPROVE]`).
4. Keep or change the remaining heuristics (recipe `[TODO DEFINE]`).
5. Write your reflection and your reading of the E03 prediction.
6. Sign the attestation in `WORKED-RUN.md`, or not.
7. Approve or adjust the publication plan.

## Evidence index

00 setup · 01 baseline · 02 collection · 03 page check · 04 probe · 05–07 v0.1–v0.3 runs ·
08 tests v0.3 · 09 Assignment 1 vs v0.3 · 10/10b break v0.3 · 11 regenerate · 12 cross-checks ·
13 conformance v0.3 · 14 clean clone v0.3 · 15 regressions on v0.3 (before fix) · 16–17 v0.4 runs ·
18 holdout selection · 19 holdout page check · 20 holdout probe · 21 holdout extract ·
22 **first holdout run** · 23 v0.4.1 regressions on v0.4.0 · 24 v0.4.1 runs · 25 tests v0.4.1 ·
26 break v0.4.1 + control · 27 scope check · 28 Assignment 1 vs v0.4.1 · 29 cross-check page now ·
30 holdout cross-checks · 31 conformance/doctor/privacy · 32 clean clone v0.4.1
