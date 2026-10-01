# FRICTIONAL.md

## Executive summary

This is the friction log for my contribution: a tool that helps an
international student on a work-permit clock decide which machine-learning
employers are worth applying to, based on their visa-sponsorship history. It
records, entry by entry, the places where the build did not go as expected.
Each entry covers what I tried, what went wrong, how I responded, who did what
(me or the AI assistant), what I learned, and where the evidence is.

Read it to see how the build's main decisions were reached: the ones that
worked, and the ones that were tried, measured and rejected.

The most important entry is the third. A deliberate attempt to break the
tool exposed a real scoring flaw: a company with no successful visa
sponsorships ranked above Microsoft. The first two fixes failed because this
data can't produce a realistic starting estimate for such a company. The fix
that worked is a stated human judgment, not a formula, and it is still not
complete. Four problems remain open, and they are listed at the end.

## Entry 1: 2026-09-30, the scorer can't be imported

**Your attempts.** `CONTRIBUTING.md` says harnesses can import the scorer's
exports (`CONFIG`, `SRC`, `applyProfile`, `scoreRole`) from
`scripts/score/role-scorer.mjs`. I expected to import them and call
`scoreRole` directly on each built role.

**Friction and response.**
- **Friction:** the scorer has zero exports, and it runs `main()` as soon as
  it is imported. Importing it with no arguments prints the usage line and
  exits with code 2, before any import can be used.
- **Response:** the build invokes the scorer as a command-line subprocess
  (`npm run score -- <roles.json> --out-dir <dir>`), never with `--profile`,
  and never patches or re-implements it. The discrepancy with
  `CONTRIBUTING.md` is documented in the change brief rather than worked
  around silently. The test harness follows the same rule: it drives the
  scorer through its command line ("it exports nothing, so importing it would
  run it").

**Human and AI contributions.** Claude read the scorer's code before any
design was proposed, found that it has no exports, and proposed the
subprocess approach. I approved using the scorer unmodified. That kept this
contribution's one allowed patch to a maintained file free for the persona.

**Learning and uncertainty.** A contribution guide can describe an interface
the code doesn't have, so read the code before designing against the guide.
It is not known whether the guide or the scorer is the intended state. That
is for the maintainer.

**Traceable process.** Documented in the change brief, commit `ce15bb5`
(2026-09-30): the `role-scorer.mjs` row of its inputs table. The card
(`4df0ec9`) states "It exports nothing, so it can't be imported." Re-checked
on 2026-10-01: importing the module exits with code 2.

## Entry 2: 2026-09-30, the fit signal saturates, twice

**Your attempts.**
1. **Run 1:** match the persona's résumé skills (Python, SQL, MLflow,
   LangGraph and others) against each company's sponsored job titles. I
   expected at least some spread between companies.
2. **Runs 2–3:** match the persona's target-role words `{ai, data, engineer,
   ml}` against the matched titles. I expected a better spread, since job
   titles do contain role words.

**Friction and response.**
- **Run 1 friction:** `fit.p = 0.0` for all 185 companies. Job titles never
  name tools: "Machine Learning Engineer III" contains no MLflow.
- **Runs 2–3 friction:** the signal saturated in a different way. With four
  target words, `fit.p` can take only 5 values. In run 3, 146 of 183
  companies (80%) score exactly 0.25, which adds the same 0.075 to every
  composite. It measures whether a title contains "data" or "engineer", not
  whether the work is ML:
  - "Machine Learning Engineer" can't match `ml`, so 42 of the 48 companies
    sponsoring it score 0.25, the same as a plain "Data Scientist";
  - Applied Scientist and NLP Scientist titles score 0, though they are
    among this student's closest fits.
- **Also fixed:** the keyword `llm` matched inside "Fu**llm**ent", admitting
  two fulfilment-job companies. Matching is now whole-word only, which takes
  the count from 185 to 183.
- **Response:** the saturation is documented as a named failure mode, a
  saturated proxy, in the change brief and the card. It is labeled
  `model-judgment` on every role. No third design was attempted: run 3 is the
  shipped state.

**Human and AI contributions.** Claude implemented both designs, ran them and
reported the distributions. I decided to stop at the second design and
document it, rather than iterate further on a signal the data can't support.

**Learning and uncertainty.**
- **Learning:** a signal built only from titles can't distinguish ML work. It
  would need job-description text, which this data source doesn't have.
- **Unresolved:** Summer 2026's `case-ml-sponsorship-triage` plans to use
  LCA data by SOC occupation code instead. Whether that would actually fix
  fit is untested here. The card names it as a better alternative this
  contribution doesn't implement.

**Traceable process.** The run table (runs 1–3: skip rate 1% → 0% → 0%) and
the fit distributions are in the change brief's "First-run finding", added
in commit `4df0ec9` (2026-09-30). The run-1 lesson is also in
`build_roles.py`'s `fit_p` docstring. These 2026-09-30 runs were not logged
at the time; a clearly marked backfill entry was added on 2026-10-01, now
in `logs/runs/2026fa-omraut888-1.md`.

## Entry 3: 2026-09-30 to 2026-10-01, the sponsorship-prior break attempt

**Your attempts.** The instruction was to try to break the build. The attempt
built a temporary copy of the sponsorship CSV in which one real ML company,
REFUELAI INC, had its counts overwritten to **0 approvals, 2 denials**. That
is the same shape as four of the five real zero-approval companies, none of
which sponsors an ML title. I expected either a crash or a low sponsorship
score.

**Friction and response.**

*Friction.* Neither happened. The company scored `sponsorship.p = 0.699`,
ranked 109th of 183, and scored above Microsoft (12,226 approvals). With no
evidence at all (0 approvals and 0 denials), it got the prior itself, 0.979,
and ranked 15th.

The formula is correct shrinkage: (approvals + 5 × prior) / (approvals +
denials + 5). With a prior near 98%, though, five imaginary near-certain
approvals outweigh two real denials. Reading `shrunk_p()` alone wouldn't have
shown this. It is one textbook-correct line, and the flaw only appears when an
input the real data doesn't contain is pushed through the whole pipeline.
Diagnosed: not a logic bug, a bad design choice.

*Response: three fixes, each measured on the real 183 companies and on the
break case before it was kept or rejected.*

| Attempt | Prior for the break-case company | Break-case p | Rank | Decision | Real 183: Apply / Consider / Skip | Kept? |
|---|---|---|---|---|---|---|
| Original: mean of per-company approval rates | 0.9786 (0.9792 on the real data) | 0.699 | 109 | Consider | 87 / 96 / 0 | the flaw |
| 1. Volume-weighted: sum(approvals) / sum(decisions) | 0.9812 | 0.7009 | 109 | Consider | 87 / 96 / 0 | kept as the main prior; didn't fix the break |
| 2. Separate prior from thin records (1–2 decisions) | 0.9842 (0.9874 on the real data) | 0.703 | 109 | Consider | 87 / 96 / 0 | rejected, reverted |
| 3. Fixed prior for 0-approval companies, a stated judgment | 0.3 | **0.2143** | **179** | Consider | 87 / 96 / 0 | **kept** |

- **Attempt 1:** pooling decisions is more defensible than averaging rates,
  so it stays. But large sponsors approve slightly more often than small ones,
  so the prior went *up*.
- **Attempt 2:** of the 317 thin-record companies, 313 have 2 approvals and 0
  denials. Choosing companies by having few records doesn't choose
  denial-heavy ones.
- **Attempt 3:** a company with no record now scores p = 0.3 and ranks 177th,
  instead of 0.979 and 15th.
- **Real data:** none of the 183 ML companies has zero approvals, so the
  fixed prior changed no real recommendation.

**Human and AI contributions.**
- **Claude:** designed and ran the adversarial case. Diagnosed the flaw by
  hand. Implemented each fix, reran the real pipeline and the break case
  after each one, and reported the numbers, including that the first two
  fixes failed. Named the remaining options (smaller C, fixed prior, tier
  cap).
- **Me:** I required a diagnosis before any change. I specified each fix to
  try, holding C at 5 to isolate one change at a time. I chose which fix to
  keep. **The 0.3 value is my judgment**, not something derived from data. It
  is labeled `your-input` in the code, in each affected role's source label,
  and in the build audit.

**Learning and uncertainty.**
- **Learning:** this dataset can't produce a low prior for a company with no
  successful sponsorships from its own records, because every average it
  supports is near 98%. The fix had to be a stated assumption, not a better
  formula.
- **Unresolved:** the fix is not complete. The break case is still Consider,
  not Skip: fit (0.5) and a full timeline factor keep its composite (0.225)
  above the 0.20 Skip line. The scorer already holds the Unknown tier at
  Consider, so the missing piece is a gate that sends "denied, never
  approved" to Skip. The scorer gates only on liveness and timeline, so that
  would be a scorer change. It is proposed as future work and not
  implemented, because this contribution uses the scorer as-is.
- **The 0.3 has only ever run on a constructed row.** No real ML company has
  exercised it.

**Traceable process.**
- **2026-09-30, the break:** recorded at commit `18884eb`, with full output in
  `WORKED-RUN.md`.
- **2026-10-01, the fixes:** the `logs/runs/2026fa-omraut888-1.md` entries "prior changed to
  volume-weighted", "two-prior shrinkage (thin-record prior for 0 approvals)",
  "fixed zero-approval prior replaces thin-record prior", and "recipe + card
  docs updated".
- **Committed state:** `3745eb5`.
- **Correction:** the log's "correction: original prior was 0.9792" entry
  fixes a figure I had misreported as 0.9786.
- **Runs:** worked-run-1 to 4 on disk; worked-run-4 is canonical and
  committed in `2569346`.

## Entry 4: 2026-10-01, counts that look doubled

**Your attempts.** Building attempt 2's thin-record prior from the companies
with 1–2 decisions.

**Friction and response.**
- **Friction:** in the 1,557-company H-1B subset, **no company has exactly 1
  decision**. Every thin record is even: 2 approvals and 0 denials (313
  companies) or 0 approvals and 2 denials (4). The fifth zero-approval
  company has 0 approvals and 4 denials. Real single-petition employers
  should be common, so this pattern is consistent with counts being doubled
  upstream, for example by a join that duplicates rows.
- **Response:** this was explicitly **not investigated** mid-build. It is
  flagged for a maintainer of the sponsorship dataset. If the suspicion is
  right, every small-sample shrinkage and tier boundary in this build is
  affected, and so is the "5 zero-approval companies" count that the 0.3
  prior's justification relies on.

**Human and AI contributions.** Claude noticed the pattern while computing
the thin-record prior and reported it as unverified. I decided not to pursue
it during the build, and to record it as an open observation.

**Learning and uncertainty.** This is a real open question I can't resolve
without access to how the CSV was assembled. "Possible doubling" is an
inference from the shape of the counts, not a verified fact.

**Traceable process.** The `logs/runs/2026fa-omraut888-1.md` entry "two-prior shrinkage"
records the thin-row breakdown (313 at 2/0, 4 at 0/2, none at 1 decision).
The "fixed zero-approval prior" entry records it as unresolved and not
investigated. `WORKED-RUN.md`'s "Unresolved observation: counts that look
doubled" and the code comment on `ZERO_APPROVAL_PRIOR` in `build_roles.py`
(`3745eb5`) cite it.

## Entry 5: 2026-10-01, the repository's hooks never ran

**Your attempts.** The repository's Claude Code hooks are meant to guard
against deletions (`archive-guard.sh`) and run conformance checks after
edits (`conformance-check.sh`). I expected them to run automatically on every
command and edit.

**Friction and response.**
- **Friction:** both failed with "Permission denied" all session. Both are
  tracked as mode `100644`, without the executable bit, since the only commit
  that touches them, upstream `d08afdd` ("Fall 2026 fresh cut", 2026-08-17).
  `.claude/settings.json` runs them directly, so the operating system refuses
  to execute them. Neither the archive guard nor the automatic conformance
  check ever ran.
- **Response:** not fixed. They are maintained repository files outside this
  contribution's namespace, and any change would use up the one allowed
  patch. Instead, the tests and `node scripts/conformance.mjs` were run by
  hand before every commit, and `npm run doctor` before committing the
  worked run.

**Human and AI contributions.** Claude investigated: it checked file modes
and `git diff`, and reported that this session didn't cause the problem. I
decided not to chmod anything.

**Learning and uncertainty.** Guardrails that fail silently look exactly like
guardrails that pass. I only learned the hooks weren't running because their
errors surfaced in the session. Whether other contributors' sessions have run
without them is unknown.

**Traceable process.** `git diff` on both hook files is empty, and
`git ls-files -s` shows `100644` for both, unchanged since `d08afdd`. This
was investigated on 2026-10-01, before the `3745eb5` commit.

## Overall human/AI contribution summary

The same pattern held across the whole build:
- **Claude** read the code and data first, proposed designs, and backed every
  choice with measured numbers rather than claims of correctness. It reported
  fixes that failed as failures. It flagged what it had not checked: the
  doubled counts, the unverified Microsoft funding match, and its own
  misreported prior.
- **I** made every judgment the data couldn't make. Three design values
  couldn't be derived from data, and each is labeled `your-input`:
  - not to adopt the 0.15 role-quality weight;
  - the 21- and 56-day hiring-lag constants, taken from the persona's own
    notes;
  - the 0.3 zero-approval prior.
- **Also mine:** the persona, when to stop iterating on fit, which fixes to
  keep, what not to investigate, and every commit.

## What remains genuinely unresolved

1. **The skip rate on real data is 0%.** The liveness gate never runs
   without live-network approval, and the pre-filter admits only companies
   whose sponsorship scores are already 0.84–1.0. The build cannot yet tell
   this student "don't apply here".
2. **The break case doesn't reach Skip.** A company with zero approvals and
   two denials ranks 179th of 183 but is still Consider. Closing this needs a
   sponsorship gate in the scorer, which is proposed and not built.
3. **The sponsorship counts may be doubled upstream.** No company has exactly
   1 decision and every thin record is even. This is not investigated, and it
   affects every small-sample number in the build if true.
4. **The persona patch is proposed, not applied.** Adding the `Smart
   E-Commerce` RAG project to the persona's résumé is still an open
   `[TODO: DATA SOURCE]`, so the persona the build reads lacks the RAG
   evidence the recipe targets.
