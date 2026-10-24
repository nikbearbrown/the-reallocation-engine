# FRICTIONAL — Assignment 2: Mode Build (Aditya Raj, INFO 7375 Fall 2026)

## Executive summary

This is the honest process log for the second course assignment: building a focused, working
"mode" of a job-search evidence system that helps an experienced backend engineer decide which
specific job openings are worth applying to for a January 2027 start. It records what was
attempted, what was expected and by whom, what actually happened, which decisions were made, and
what remains uncertain. Read it to see how the work was done and who did which part, separate from
what was produced. So far the work is at the planning stage: the repository and requirements have
been inspected and a scope proposal is awaiting review. Nothing has been built yet.

## How to read this log

- Entries are dated, carry an identifier (`A2-<date>-E<nn>`), and are append-only. Earlier entries
  are never rewritten; corrections are added as new entries that point back.
- **Claude** = the AI coding agent (Claude Code, model `claude-opus-5-5`) acting in this repository
  on Aditya's instruction. **Aditya** = the student. Each entry says who acted.
- Aditya's expectations, checks, approvals, and learning are recorded only from Aditya's own
  words. Where Aditya has not yet supplied them they are marked **pending — Aditya to write**.
  Claude does not write them for Aditya.
- Claude's own predictions are labelled "Claude predicted".
- No résumé content, immigration details, or contact information appears here. Planning against
  the real profile is kept outside the tracked tree.
- Assignment 1's log (`../FRICTIONAL.md`) is preserved unchanged; this is a separate file.

---

## A2-2026-10-20-E01 — Session 1 start: request received, repo state checked, log initialized

*Contemporaneous. Clock reading at start of inspection: `date` → `Tue Oct 20 23:20:04 EDT 2026`.*

- **Aditya's request (privacy-safe excerpt):** "Begin with an audit and a concrete implementation
  plan. Do not implement the mode until I review the proposed scope." Also: start this log before
  substantive work; fetch (not pull) `origin` and `upstream`; do not touch PR #45, the graded
  commit, or the Assignment 1 ZIP; no commit or push yet.
- **Expectations / predictions:**
  - Aditya: none stated in this request beyond the scope above — **pending — Aditya to write** if
    Aditya had a prediction (e.g. about how much of Assignment 1 is reusable).
  - Claude predicted: most of Assignment 1's sponsorship/liveness logic is reusable; the new work
    is the role/experience, technical-relevance, and start-window checks, plus a real-posting sample.
- **What Claude executed (read-only except this file):**
  - `git rev-parse --show-toplevel` → repo root `/Users/adityaraj/Desktop/the-reallocation-engine`.
  - `git status --short --branch` → branch `contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027`,
    clean, tracking `origin/…` with no divergence.
  - `git rev-parse HEAD` → `1a618e73742df2a61947878263697fcca81f4d1c` (= the graded commit).
  - `git remote -v` → `origin` = fork `aditya-raj-sde/the-reallocation-engine`; `upstream` =
    `nikbearbrown/the-reallocation-engine`.
  - `git fetch origin`, `git fetch --verbose upstream` → exit 0, "[up to date]"; `upstream/main` =
    `origin/main` = local `main` = `015843d` (2026-09-23). Graded commit is 22 commits ahead of
    `upstream/main` and not contained in it.
  - GitHub REST (`curl …/pulls/45`) → PR #45 **state: open, merged: false**, head SHA = graded commit.
  - Read `CONTRIBUTING.md`, `DATA_CONTRACT.md`, `DOMAIN.md`, `recipes/README.md`,
    `PROJECT_RULES.md`, `_MANIFEST.md`, `course/README.md`, `recipes/cases/README.md`,
    `scripts/contrib/README.md`, `.github/PULL_REQUEST_TEMPLATE.md`,
    `.github/workflows/contrib-gate.yml`, and the course `prerequisites/frictional.md` (fetched to
    stdout).
  - Recorded SHA-256 of Assignment 1's log before creating this one:
    `c7ae03e0aacf1e855f427baf41faa53a76aecec0…` (to verify it stays unchanged).
- **Location check (Claude):** `course/2026fa/submissions/aditya-raj-sde/assignment-2/` matches the
  contrib-gate allowlist pattern `^course/[^/]+/submissions/` and `git check-ignore` reports it is
  not ignored. `course/README.md` permits files only under one's own handle directory — satisfied.
- **Friction (Claude, minor):** a shell `echo =====` separator failed under zsh (`=` expansion);
  re-ran with quoted separators. No effect on findings.
- **Aditya attempted / checked / accepted:** **pending — Aditya to write.**
- **Next step:** read the résumé (locally, private), both assignment PDFs, and the Assignment 1
  artifacts; then append the audit entry.

## A2-2026-10-20-E02 — Session 1: read-only audit and scope proposal (Claude)

*Contemporaneous. Written at `date` → `Tue Oct 20 23:27:23 EDT 2026`, at the end of the audit.*

- **What Claude executed (all read-only; only this log was written):**
  - Read both assignment PDFs with `pdftotext` (Assignment 2: 7 pages, printed from Canvas
    2026-10-20 21:58; Assignment 1: 13 pages).
  - Fetched to stdout: course `prerequisites/ai-policy.md`, `github-submission.md`,
    `relative-quartile.md`; listed the course `assignments/` folder (no Markdown version of the
    Mode Build assignment exists there, so the PDF is the only source).
  - Read Aditya's résumé PDF locally. **Its contents are not recorded here or in any tracked
    file.** The private mapping stayed in the chat.
  - Read Assignment 1's recipe, card, `reality-check.mjs`, domain justification, worked-run header,
    submission manifest, run-log header, and evidence 19 and 43. Listed the maintained ATS, scorer,
    and fetch scripts, the fictional personas, and the `greenhouse-watch` skill.
  - Integrity check: Assignment 1 log SHA-256 still `c7ae03e0aacf1e85…` (unchanged); Assignment 1
    ZIP SHA-256 `bd9c3e0275e259de…`, its archive comment = graded commit `1a618e7`. `git status`
    shows only this new untracked folder; HEAD still `1a618e7`.
- **Recorded Assignment 1 results vs. this session:** every Assignment 1 number cited in the audit
  (18 tests, 9-posting sample with 1 real posting, 2/9 skips) comes from Assignment 1's committed
  evidence. **Nothing from Assignment 1 was re-run in this session.**
- **Friction / conflicts found (Claude's reading; none resolved yet — each needs Aditya's
  decision):**
  1. **Due date.** The PDF says "Due Wednesday by 23:59" and was printed Tuesday 2026-10-20. That
     most likely means 2026-10-21, about 24 hours away. Not confirmed.
  2. **Branch name.** The PDF says `mode/<yourname>-<domain>`; `CONTRIBUTING.md` says
     `contrib/<term>-<handle>-<component>`.
  3. **Paths.** The PDF says the mode file goes under `recipes/` and write-ups under
     `assignments/submissions/<yourname>/`. The repo contract says `recipes/cases/2026fa/` and
     `course/2026fa/submissions/<handle>/`. CI only warns on paths outside the namespaces, and
     top-level `recipes/` needs maintainer promotion.
  4. **Run log.** The PDF says to append to `logs/RUN_LOG.md` "or include it in your submission".
     CI hard-fails student edits to that file. → `logs/runs/2026fa-aditya-raj-sde-2.md`.
  5. **Grading map.** The Assignment 2 rubric is 80 points (Mode Design 24, Domain Justification
     20, Worked Run 16, Presentation 20) plus 20 for quartile. It has no Frictional or GitHub-posting
     line. The course AI policy says every graded assignment is 60 + 10 Frictional + 10 GitHub +
     20 quartile. The quartile bands also differ (PDF 8–15 / 4–7 / 0–3; course page 10–15 / 5–9 /
     0–4).
  6. **One open PR.** PR #45 is still **open**. A new Assignment 2 PR needs either #45 closed in
     the same action, or Assignment 2 pushed onto #45's branch, which would change the graded PR.
  7. **Lifecycle cap.** Assignment 1 capped status at RUNNABLE-SAMPLE. Assignment 2 states no cap.
  8. **Real postings in tracked files.** `private/README.md` says real scraped postings are never
     committed. The assignment needs real output shown. → Policy decision needed on excerpts.
  9. **Mislabel.** The PDF calls `npm run score` the "BLS/O*NET role-quality scorer". It is the
     composite combiner, and its `role_quality` weight is 0.0 (`DOMAIN.md` item 3).
  10. **Persona.** No existing fictional persona is an experienced backend engineer with pending
      OPT and a January 2027 start. → A new persona under `search/examples/` is proposed.
- **What Claude proposed (not executed):** a mode "Experienced Java Backend Opening Triage for a
  January 2027 Start" that reuses Assignment 1's exported sponsorship, vacancy, and liveness
  functions. It adds three checks (experience and degree compatibility, stack evidence, start
  window), evaluated on a rule-selected sample of about 12 real Greenhouse postings plus separate
  synthetic fixtures, with an isolated git worktree. Full plan in the chat reply for this entry.
- **Claude predicted:** at least a few real postings will state no start timing (→ "unknown"), and
  title seniority will disagree with the stated years for at least one posting. Not yet tested.
- **Aditya's expectations, decisions on items 1–10, and review of the scope:** **pending — Aditya
  to write.**
- **Next step:** Aditya reviews the scope and answers the open questions. No implementation,
  branch, worktree, commit, or push until then.

## A2-2026-10-20-E03 — Aditya's scope decisions and prediction (recorded before any evaluation)

*Contemporaneous. Recorded at `date` → `Tue Oct 20 23:54:53 EDT 2026`, before any branch, fetch,
or code. Source: Aditya's chat reply to E02. Paraphrased except where quoted.*

- **Decisions (Aditya):**
  1. Deadline: 2026-10-21 23:59 Eastern. Presentation date unconfirmed; prepare the five-minute
     demonstration anyway; no date is to be invented.
  2. PR: work on a separate contribution branch, preserving Assignment 1's commit, ZIP, and
     evidence. Prepare a replacement PR description that separates inherited Assignment 1 work
     from Assignment 2 additions. **Do not publish it or close PR #45 yet**; present the exact
     publication plan for review when ready.
  3. Branch and paths: follow the repository contribution contract (not the PDF's `mode/…`,
     `recipes/`, `assignments/` paths). Document the PDF-to-actual mapping and the discrepancy. Run
     log in `logs/runs/` and in the submission; never edit `logs/RUN_LOG.md`.
  4. Lifecycle target: RUNNABLE-SAMPLE. Also run on real public postings, separating live
     collection from replay of captured observations. A real-posting run alone does not establish
     RUNNABLE-LIVE. Never clear a human gate for Aditya or promote status for presentation value.
  5. Excerpts: minimal relevant excerpts from public employer postings may be committed, with
     employer, title, job id, URL, capture time, derived state, and the rule that produced it;
     missing data and failures recorded; no full pages, recruiter details, cookies, or private data;
     quoted evidence kept apart from interpretation.
  6. Public persona: new, explicitly fictional; 4.5 years full-time backend experience plus a
     separately recorded six-month applied-AI co-op; invented employers and dates; fictional target
     start 2027-02-01 supplied by configuration. Public title along the lines of "Experienced Java
     Backend Opening Triage for an Early-2027 Start". Aditya's real profile and requested start date
     stay private; no approval or legal eligibility is assumed.
  7. Co-op: excluded from the full-time total by default; both amounts visible. Apply explicit
     posting wording that accepts internships/co-ops/equivalent experience, with the excerpt.
     Unclear wording that would change the result → human review.
  8. Ranges and "ASAP": above the top of an ordinary "N–M years" range → flag a possible level
     mismatch for review, not a rejection, unless an explicit eligibility restriction exists. An
     explicit unmet requirement is a documented mismatch, not a claim the employer could never make
     an exception. "ASAP" is unresolved timing. A definite date conflict only when explicit employer
     requirements and supplied dates support it. Date compatibility stays separate from
     authorization and hiring duration.
  9. Sample: target 12 unique postings across three official employer career boards (one ATS
     technology is fine). Experienced Java/backend focus incl. relevant platform or applied-AI
     backend; internship-only roles excluded. Record the selection rule, search terms, scope,
     collection order, stopping rule, and duplicate handling **before examining outcomes**. Record
     inaccessible pages and exclusions; report the real count if under 12. Synthetic fixtures stay
     separate.
- **Aditya's prediction (verbatim, a hypothesis to test, not a finding):**
  > "Opening-specific sponsorship and start-date evidence will remain unresolved for some
  > apparently relevant Java backend roles. Experience and technical relevance alone will therefore
  > be insufficient to justify a confident recommendation."
- **Aditya's scope decision (paraphrase):** experience requirements, backend responsibilities, and
  explicit start constraints should change the workflow, while company sponsorship history stays
  separate from evidence about the individual opening.
- **What this entry does not claim:** Aditya's reply is a scope decision, not independent
  technical verification. Aditya has not run tests, inspected source rows, or cleared gates in
  Assignment 2. **Aditya's reflections on results: pending — Aditya to write.**
- **Claude's own predictions, recorded at the same time (before evaluation):**
  - C1: of the 12 real postings, at most 2 will state an explicit start date or season; most will
    end with start timing "unknown".
  - C2: at least one real posting will have a required minimum of years at or above 5, so the
    4.5-year persona gets a documented mismatch.
  - C3: at least half the real postings will be silent on sponsorship, or will only ask an
    application-style question.
  - C4: the Assignment 1 tool and this mode will disagree on the next step for at least one real
    posting, because of the experience or start-window checks.
- **Next step:** create the isolated worktree and branch, move this log into it, and record
  baselines.

## A2-2026-10-21-E04 — Worktree, baselines, fictional persona, and pre-registered sample protocol (Claude)

*Contemporaneous. `date` → `Tue Oct 20 23:59:53 EDT 2026`.*

- **Executed (Claude):**
  - `git worktree add /Users/adityaraj/Desktop/the-reallocation-engine-a2 -b
    contrib/2026fa-aditya-raj-sde-java-backend-early2027 1a618e7`. The Assignment 1 checkout is
    still on its branch at `1a618e7` and clean. This log was **moved** (not copied) from that
    checkout into the worktree.
  - `npm ci` → exit 0 (evidence `00-setup-worktree.txt`). Commit identity is a GitHub noreply
    address.
  - Baseline at `1a618e7` (evidence `01-baseline.txt`): Assignment 1 tests 18/18; `npm run
    verify` exit 0 (using the main checkout's `.venv` for PyYAML); `npm run doctor` exit 0;
    `pii-scan` **exit 1** on the same upstream `package-lock.json` line Assignment 1 documented
    (its "Confirmed blocker 1"). This is inherited, not new.
  - Wrote the fictional persona `search/examples/tariq-lindqvist/` (profile, résumé JSON, gaps):
    invented employers and dates; 24 + 30 = 54 months full-time; a 6-month co-op with an explicit
    `employment_type`; availability 2027-02-01. `git check-ignore` confirms the files are
    trackable.
  - Wrote `SAMPLE-PROTOCOL.md` **before any board fetch**.
- **Routine choices Claude made (open to Aditya's veto):**
  - Board order follows the sponsorship CSV ranked by approvals, with one slug guess per employer
    and a board-name identity check. This is reproducible and does not depend on posting wording.
    It does skew toward heavy sponsors, which is the population where history and the opening are
    easiest to confuse.
  - Java mention is part of the cohort rule. This biases the stack check and is disclosed there.
  - A board needs at least 4 cohort postings to qualify, so each board contributes equally.
  - Newest-first order.
  - The persona's master's degree ends 2027-01 and the B.Tech is in electronics, deliberately
    exercising "CS or related".
- **Aditya:** has not reviewed the persona or the protocol yet → **pending — Aditya to check**
  (optional; collection proceeds under the pre-registered rule).
- **Next step:** commit locally (no push) so the protocol's timestamp precedes collection; then
  probe boards.

## A2-2026-10-21-E05 — Correction: an evidence file reproduced a scanner-flagged address (Claude)

*Contemporaneous. `date` → `Wed Oct 21 00:00:22 EDT 2026`.*

- **What happened:** the first local commit (`5a40b7f`) included `evidence/01-baseline.txt`, which
  pasted the PII scanner's output verbatim, including the npm-author address it finds in
  `package-lock.json`. Running `node scripts/pii-scan.mjs` after the commit flagged that evidence
  file as a new finding. Assignment 1 had already hit this and redacted it (A1 evidence 06).
  Claude repeated the mistake.
- **Why it matters:** `pii-scan --diff` reads `git log -p base..HEAD`, so every commit's added
  lines count. A later fix commit would not clear the finding.
- **Response:** the commit had never been pushed. Claude redacted the address in the evidence file
  (same wording as A1) and **amended that single unpushed commit**. No fetch had happened at that
  point, so the protocol still precedes collection. From now on, evidence captures pass scanner
  output through redaction before they are saved.

## A2-2026-10-21-E06 — Live collection and liveness observations (Claude)

*Contemporaneous. `date` → `Wed Oct 21 00:04:09 EDT 2026`.*

- **Executed:**
  - `collect.mjs` (live; evidence `02-live-collection.txt`, 00:01:47–00:01:55 EDT). Ran on the
    first attempt: 17 employers probed in protocol order; 14 returned 404 at the guessed slug;
    **Databricks (rank 12), Pinterest (15), Stripe (17)** verified by board name and qualified.
    12 postings selected (4 per board). Raw responses are in gitignored `private/a2/`; tracked:
    `real-sample/probe-log.json`, `real-sample/selection.json` (no posting text).
  - Cohort tallies (from `selection.json`): Databricks 900 jobs → 29 unique cohort (2 duplicates);
    Pinterest 158 → 7; Stripe 731 → 13. Most exclusions are "title not in scope".
  - `npm run ats:liveness` on the 12 URLs (evidence `03`, 00:02:07–00:02:38): **8 active,
    4 expired** (all Pinterest, "insufficient content — likely nav/footer only"), exit 1.
  - A supplementary read-only browser probe written by Claude (`page-probe.mjs`, evidence `04`):
    all 4 Pinterest URLs returned **HTTP 403** with document title "Just a moment..." (272
    characters). That is a bot-challenge interstitial, not a closed posting. The Databricks and
    Stripe pages resolved to the specific posting, with the title in the body.
- **Friction / finding:** the maintained liveness checker reports a blocked page as "expired". By
  Assignment 1's rules, which skip on `expired`, all 4 Pinterest postings would have been
  **skipped**, even though the employer's own API listed them 30 seconds earlier. This was not
  engineered; it is the first thing the real sample showed. → The mode needs a feed-vs-page
  disagreement rule that sends the case to a person, never to an automatic skip.
- **Discipline note:** Claude is writing the experience, stack, and start-window rules (v0.1)
  **before reading any of the 12 posting texts**. Misclassifications found afterwards will be
  logged as versioned corrections, not silently tuned away.
- **Aditya:** **pending** — interpretation of the Pinterest 403 case is a human liveness-review
  decision.

## A2-2026-10-21-E07 — Rules v0.1 on real text, and Claude's audit of the results

*Contemporaneous. `date` → `Wed Oct 21 00:12:26 EDT 2026`.*

- **Executed:** rules v0.1 were committed (`77d31aa`, 00:09:46) before any real posting text was
  read; extract + run on full private text + replay on committed excerpts + compare (evidence
  `05-real-run-v0.1.txt`). v0.1: 5 human-requirement-review, 4 human-liveness-review, 1
  human-eligibility-review, 1 skip, 1 seek-evidence. Full-text run and replay run: **0
  differences**. Committed excerpts are 14,655 of 60,498 characters (about 24%).
- **Claude's audit of v0.1 against the full text (first time Claude read the postings):**
  - **Wrong:** Stripe postings put the requirement in a heading line ("Must have three (3) years of
    experience in each of the following:"). v0.1 does not evaluate headings and does not parse
    "three (3)". Three Stripe postings were misread as "experience unstated" or "section unclear".
  - **Wrong:** "Must also have …" was not recognized as a required heading.
  - **Wrong:** Databricks lists "5+ years in Java…" and "3+ years distributed systems" as separate
    requirements that both apply. v0.1 called them "requirements disagree" (review) instead of a
    documented mismatch on the 5+ requirement.
  - **Arguable:** "Ideal Engineer should have" was read as *preferred*. The heading mixes
    preference and obligation wording, so "ambiguous" is more honest.
  - **Wrong:** "distributed ML systems" missed the distributed-systems pattern, and the stack
    message was misleading ("appears only in required lines").
  - **Correct as designed:** Pinterest feed-vs-page disagreement went to review; GovOps "active
    TS/SCI" went to eligibility review.
- **Observed, not engineered:** none of the 12 captured postings contains sponsorship or
  work-authorization wording, and none states a start date. (The Greenhouse `content` field does
  not include application-form questions; that limitation is recorded.)
- **Preserved failed attempt:** `runs/real-replay-v0.1/` stays as-is. The v0.1 excerpt input was
  overwritten by the v0.2 extract, then regenerated from commit `77d31aa` into
  `real-sample/observations-v0.1-extraction.json`. Its SHA-256 `67ba0ec3…` equals the
  `input_sha256` the v0.1 run recorded.

## A2-2026-10-21-E08 — Rules v0.2 (corrections from the E07 audit) on the real sample

*Contemporaneous. `date` → `Wed Oct 21 00:12:26 EDT 2026`.*

- **Changed (Claude), each traced to an E07 finding:**
  - Headings that state years or degrees are evaluated as requirement lines.
  - "N (n)" numerals are parsed.
  - "must (also) have" / "should have" headings count as required.
  - A heading with both preference and obligation cues is "ambiguous" and goes to review.
  - Required minimums are conjunctive: failing any one is a documented mismatch. The
    "requirements disagree" state was removed.
  - Distributed-systems pattern allows one word between ("distributed ML systems").
  - New stack state "java-without-backend-infrastructure-terms".
  - Relevant headings are always kept in the excerpts.
- **Result (evidence `06-real-run-v0.2.txt`):** 5 skip-application (all G4 documented experience
  mismatches: 5+, 5+, 5, 6, 10+ years required vs 4.5 full-time), 4 human-liveness-review
  (Pinterest), 1 human-eligibility-review (GovOps clearance), 1 human-requirement-review (ambiguous
  "Ideal…should have" heading), 1 seek-vacancy-sponsorship-evidence (Stripe "Software Engineer",
  meets its 3-year minimum). Full-text run vs replay: **0 differences**.
- **Residual defect found and not yet fixed:** "plus" in "…degree, plus three (3) years" is read as
  a preference cue, which made one heading "ambiguous". It does not change any v0.2 decision.
  Scheduled for v0.3 together with anything the synthetic tests reveal.
- **Risk Claude flags:** v0.2 was corrected using the same 12 postings it is now evaluated on, so
  its accuracy on unseen postings is not established. See the next entries for any held-out check.
- **Decision point for Aditya (pending):** on 3 real postings (Databricks 8864368002 and
  8806934002, Stripe 8230952) the co-op is exactly what separates 4.5 from 5.0 years, and none of
  them mentions co-ops. Under Aditya's rule (co-op excluded unless the wording accepts it) all 3 are
  documented mismatches. Claude kept the rule as decided. **Does Aditya treat "silent about co-ops"
  as "unclear wording" (→ review) or as "no acceptance" (→ mismatch, the current behavior)?**
- **Claude's predictions (E03) vs this run, Claude's own scoring:** C1 held (0 of 12 state a start
  date). C2 held (several required minimums ≥ 5). C3 held (12 of 12 silent). C4 not yet tested.
- **Aditya's prediction (E03):** the run's hypothesis tally reports 3 openings that cleared or were
  unknown on experience with core stack evidence, and all 3 still have unresolved opening-level
  sponsorship and start timing. **Interpretation: pending — Aditya to write.**

## A2-2026-10-21-E09 — Synthetic fixtures, offline tests, rules v0.3, and the Assignment 1 comparison (Claude)

*Contemporaneous. `date` → `Wed Oct 21 00:15:49 EDT 2026`.*

- **Synthetic fixtures:** 29 invented cases (S01–S30; S12 was never used, so it was folded into
  S03's "timing unstated") in `fixtures/synthetic-cases.json`, built by
  `fixtures/build-synthetic.mjs`, all on example.com. S01 borrows a real employer's CSV row
  **only** to test "strong history, refusing posting"; the posting text is invented, following
  Assignment 1's convention.
- **First run of the fixtures at v0.2:** 28 of 29 matched their expectations. **S27 failed:** "plus
  three (3) years" was read as a preference cue. This is the E08 residual defect, and it shows the
  fixture catches it. Fixed in **rules v0.3.0** (`(?:is |a )plus`).
- **Tests (evidence `08-tests-v0.3.txt`):** `node --test …/triage.test.mjs` → **45/45 pass**.
  The Assignment 1 suite still passes 18/18 (its code is unchanged). Tests cover:
  - every synthetic expectation;
  - a refusal despite a strong record;
  - no later gate clearing an earlier stop;
  - co-op months never silently added;
  - titles never deciding;
  - preference vs. requirement;
  - date-only start window;
  - feed-vs-page disagreement vs. Assignment 1's page-only rule;
  - JavaScript ≠ Java and negation;
  - excerpt losslessness;
  - the real-sample regression lock;
  - JSON/Markdown agreement;
  - the G1 exits;
  - output-path guard;
  - the static no-network check.
- **Real sample at v0.3 (evidence `07`):** decisions identical to v0.2. Full-text run vs replay:
  0 differences. `fixtures/real-sample-expected-v0.3.json` locks these decisions. **It is a
  regression lock audited by Claude, not human-verified ground truth.**
- **Assignment 1 tool on the same 12 real observations (evidence `09`):** Assignment 1 gives
  8 seek-evidence, 4 skip. **11 of 12 next steps change** under this mode:
  - 6 by G4 experience (5 skips, 1 review);
  - 4 by the G2 feed-vs-page rule (Assignment 1's *skip* → *review*);
  - 1 by G3 clearance wording.
  - Unchanged: Stripe "Software Engineer".
  - Claude's prediction C4 held. The Assignment 1 run used placeholder fit and timeline inputs
    (labelled in `a1-input.json`), which its decisions do not use.
- **Aditya:** **pending** — the Assignment 1 vs. Assignment 2 table is the main evidence for the
  TA's "situation too general" point; Aditya's reading of it is not recorded yet.

## A2-2026-10-21-E10 — Deliberate break: predictions recorded BEFORE running (Claude)

*Contemporaneous. `date` → `Wed Oct 21 00:16:25 EDT 2026`. Written before `break-test.mjs` was
executed for the first time.*

- **Mutants (fixtures/BROKEN-*.json, applied only inside a temporary worktree):**
  1. `stack-overrides-experience`: core stack evidence waves an experience stop through.
  2. `no-preference-distinction`: preferred headings are treated as required.
  3. `feed-ignored`: the employer-feed observation is dropped (Assignment 1's page-only liveness).
- **Claude predicts:**
  - Mutant 1 is caught by S02, S11, S29, the precedence test, and the real-sample lock. On the real
    sample it turns most of the 5 experience skips into `seek-vacancy-sponsorship-evidence`.
  - Mutant 2 is caught by S04 and the preference test. On the real sample it changes **nothing**:
    no real posting's only years statement sits under a plain "preferred" heading. That would show
    the protection matters on synthetic cases but was not exercised by this real sample.
  - Mutant 3 is caught by S19 and the feed-vs-page test. On the real sample all 4 Pinterest postings
    flip from review to skip.
- **Aditya's prediction:** not collected before this run. **Pending — Aditya may predict and re-run
  the harness for the demonstration** (the harness is repeatable).

## A2-2026-10-21-E11 — Break results, a harness artifact, and its correction (Claude)

*Contemporaneous. `date` → `Wed Oct 21 00:17:20 EDT 2026`.*

- **Run 1 (evidence `10-break-test.txt`):** all 3 mutants caught. **But** the test "outputs cannot
  land on tracked files outside the allowed run folders" failed for **every** mutant. Root cause:
  the harness created its worktrees inside the system temp directory, which the output guard
  deliberately allows. That failure was a harness artifact, not mutant detection. Run 1 is kept
  as-is.
- **Fix:** worktrees now go under gitignored `private/a2-break/`.
- **Run 2 (evidence `10b-break-test-run2.txt`), plus a control (unmutated HEAD in the same
  location: 45/45 pass):**

  | Mutant | Suite on mutant | Real-sample decisions changed |
  |---|---|---|
  | feed-ignored | 42/45 (S19, feed-vs-page test, real lock) | 4/12: all Pinterest review → **skip** |
  | no-preference-distinction | 43/45 (S04, preference test) | **0/12** |
  | stack-overrides-experience | 33/45 (12 failing) | 5/12: every experience skip → seek-evidence |

- **Claude's E10 predictions vs observed:** all three held. That includes the prediction that the
  preference mutant changes nothing on the real sample. The required-vs-preferred protection
  therefore matters on synthetic cases but was **not exercised** by this real sample. This is
  stated in the worked run.
- **Meaning (Claude's reading; Aditya's pending):** two protective checks visibly change real
  outcomes. Without the feed observation, 4 postings the employer was still listing would have
  been dropped. Without the G4 stop, a strong keyword match would have sent 5 openings with
  stated 5–10-year minimums to "seek sponsorship evidence", spending effort on roles whose stated
  bar the candidate does not meet.

## A2-2026-10-21-E12 — Documents, conformance, and session handoff (Claude)

*Contemporaneous. `date` → `Wed Oct 21 00:24:32 EDT 2026`.*

- **Written (Claude):**
  - recipe and card (`status: DRAFT`, `todos_open: 6` = 6 `[TODO` markers, counted by hand
    because `npm run doctor` does not scan `recipes/cases/`);
  - `DOMAIN-JUSTIFICATION.md`;
  - `WORKED-RUN.md`, generated so that every pasted block is copied from the evidence files, with
    the attestation left as an unsigned DRAFT;
  - `README.md` (contents, commands, credits, PDF→repo mapping), `DEMO-SCRIPT.md`,
    `PR-DESCRIPTION.md` (**draft, not published**), `SUBMISSION.md`;
  - the contribution `README.md`, `logs/runs/2026fa-aditya-raj-sde-2.md`, and its identical copy
    `RUN-LOG-ENTRY.md`.
- **Checks (evidence `12`, `13`):**
  - 162/162 committed excerpt lines appear verbatim in the captured text; tallies add up; CSV counts
    match.
  - `npm run verify` exit 0; `npm run doctor` exit 0.
  - `conformance.mjs` on all 43 Assignment 2 files: **failed once** (system `python3` lacks
    PyYAML), then passed with the `.venv` on PATH.
  - `pii-scan --diff 1a618e7` and `--diff upstream/main` clean. The working-tree scan shows only
    the inherited lockfile line.
  - No Assignment 1 file changed (`git diff 1a618e7` on its paths is empty); every changed path is
    inside the contribution allowlist; Assignment 1 log and ZIP hashes are unchanged.
- **Not done (needs Aditya):** no push, no PR, no ZIP, PR #45 untouched. Nothing was promoted.
  No human gate was cleared.
- **Pending human items (Aditya):**
  1. Read both `triage.md` reports (`[TODO APPROVE]`).
  2. Decide on co-op silence (`[TODO DEFINE]`).
  3. Accept or change the routine values (`[TODO DEFINE]`).
  4. Build or defer each of the 3 `[TODO DEV]` proposals.
  5. Personally re-run the tests, the replay, and the break harness (prediction first), and check
     one quoted line against a live page.
  6. Write the reflection and the interpretation of the E03 prediction.
  7. Fill in and sign the attestation.
  8. Approve or adjust the publication plan.
- **Handoff for another session:**
  - Worktree: `/Users/adityaraj/Desktop/the-reallocation-engine-a2`, branch
    `contrib/2026fa-aditya-raj-sde-java-backend-early2027`, based on `1a618e7`. All commits are
    local; `git log 1a618e7..HEAD` lists them.
  - The Assignment 1 checkout `/Users/adityaraj/Desktop/the-reallocation-engine` stays on the
    Assignment 1 branch, clean.
  - Private (gitignored) material: `private/a2/` (raw captures, full text, private full-text
    runs) and `private/a2-break/` (empty after cleanup).
  - `npm run verify` needs `PATH=/Users/adityaraj/Desktop/the-reallocation-engine/.venv/bin:$PATH`.
  - After any rule change: re-run extract, run, and compare; bump `RULES_VERSION`; refresh
    `fixtures/real-sample-expected-v0.3.json` only with a logged reason.

## A2-2026-10-21-E13 — Fresh-clone reproducibility (Claude)

*Contemporaneous. `date` → `Wed Oct 21 00:24:53 EDT 2026`.*

- A fresh local clone of the branch at `644d279` (no `node_modules`, no `private/` data;
  evidence `14-clean-clone-offline.txt`): tests 45/45; the replay reproduces the committed v0.3
  decisions (`compare` → 0 differences). The offline path needs nothing that is not committed.
- This is Claude's clone. **Aditya's own clean-checkout run is still pending.**
- **Status of this stage:** implementation and verification done as far as Claude can take it.
  Waiting on the human items listed in E12.

## A2-2026-10-21-E14 — Aditya's verification-and-refinement instructions; co-op rule clarified (recorded before any change)

*Contemporaneous. `date` → `Wed Oct 21 11:14:45 EDT 2026`. Source: Aditya's chat message after E13.
Paraphrased except where quoted.*

- **Aditya's request (excerpt):** "Complete the following verification and refinement stage before
  asking me to approve the reports or sign the attestation." Local commits only. No push, no
  PR action, no submission.
- **Co-op rule — Aditya's clarification of the rule supplied in E03 (not a new approval of
  anything):**
  - Explicitly accepted, relevant co-op experience may count according to the posting's wording.
  - Explicitly excluded co-op experience does not count.
  - "If the posting is silent or ambiguous and counting relevant co-op experience would change
    the result, route to human review."
  - A shortfall that remains even with the co-op is a documented mismatch.
- **Correction of Claude's E08/E12 framing:** in E08 Claude read Aditya's E03 rule ("unclear
  wording … require human review") as meaning *silence* is not unclear, and kept silent postings
  as mismatches. **That reading was Claude's, not Aditya's.** The 3 borderline skips (Databricks
  8864368002 and 8806934002, Stripe 8230952) were never approved by Aditya.
- **Also requested:**
  - separate total-career from skill-scoped years; avoid double-counting overlaps; document
    month-date precision;
  - keep exact dates and the meaning of "by / on / no earlier than";
  - treat seasons as assumptions that cannot hard-reject; keep heading cues as heuristics;
  - make the report's tallies and absence claims precise;
  - describe the Assignment 1 comparison as behavioural difference, not accuracy;
  - fix provenance labels;
  - run an unseen-posting evaluation **after** freezing a rules version;
  - defer application-form collection and the shared 403 patch;
  - check that a blocked page alone never establishes closure;
  - check every path's scope (including the persona);
  - regenerate and re-verify everything; prepare a review packet.
- **Not approved by Aditya:** the reports' adequacy, gate clearances, the attestation.
- **Process Claude commits to:** write regression tests first, run them on the current v0.3 code,
  and record the observed failures **before** correcting.

## A2-2026-10-21-E15 — Regression tests written first; observed failures of v0.3 (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:18:34 EDT 2026`. Evidence `15-regressions-on-v0.3-before-fix.txt`.*

- **Written before any rule change:**
  - `regression-v04.test.mjs` (17 tests);
  - 11 new synthetic cases (S31–S35, S40–S45);
  - new expectations for S09, S10, S11 per Aditya's co-op clarification and the general-vs-scoped
    request;
  - test-only candidate variants in `search/examples/tariq-lindqvist/test-variants/` (fictional):
    a 12-month co-op, overlapping entries, and an explicit scoped input;
  - availability variants in `fixtures/candidates/`.
- **Fixture change disclosed:** the shared `CORE` requirement line was rewritten from a
  skill-scoped line to a general one, so the G3/G5/G6 cases are not masked by the new scoped rule.
  S06, S21, S22, S27, and S30 were reworded the same way. Their purpose is unchanged.
- **Observed on the unchanged v0.3 code:** regression suite 2/17 pass; extended fixture suite
  45/56. Behavioural failures (actual v0.3 output):
  - **Explicit co-op exclusion was counted as acceptance.** "(internships and co-ops do not
    count)" matched the acceptance pattern, so v0.3 reported `meets`. This is a real v0.3 bug,
    not only a missing feature.
  - Silence at the boundary → `skip` (should be review, per the E14 clarification).
  - Scoped "4+ years of experience programming in Java" → `meets` from total career years.
  - Exact "February 3, 2027" vs availability Feb 10 → `compatible` (month window).
  - "no earlier than March 1" vs availability Apr 10 → `conflict` (treated as a window).
  - "by March 15" vs Mar 20 → `compatible`.
  - "Fall 2026" → hard stop from an assumed season boundary.
  - A descriptive "begins onboarding in January 2027" → hard stop.
  - A conditional heading "(for senior-level candidates)" → hard stop.
  - An unrecognized heading with unmet years → ignored (`meets`).
  - A 403 challenge page with no feed observation → **skip** (`gone-at-observation`).
  - Overlapping entries were counted as 36 months instead of 30.
  - Provenance and tally tests fail because the fields do not exist yet (feature absent).
- **Friction (Claude):** the first capture of actual outputs had an argument-order mistake in
  Claude's ad hoc script (the 403 row evaluated a default page). It was marked INVALID in the
  evidence file and re-run correctly. The corrected row confirms the skip.
- **Next:** implement rules v0.4 for these, then freeze and commit, **before** any unseen posting
  is collected.

## A2-2026-10-21-E16 — Rules v0.4.0 implemented, audited on the development sample, and FROZEN (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:23:37 EDT 2026`. Evidence `16-real-run-v0.4.txt`, `17-v0.4-prefreeze-rerun.txt`.*

- **v0.4 changes, each tied to an E15 failure:**
  - **Co-op:** explicit exclusion is checked first (fixes the v0.3 bug that read "co-ops do not
    count" as acceptance). Silence or ambiguity that would change the result → review, with the
    full-time-only comparison stated. A shortfall even with the co-op → documented mismatch.
  - **General vs scoped years:** a documented heuristic. Scoped requirements are never "met" by
    career length. They are a mismatch only if above **all** recorded experience; otherwise
    unknown → review, unless an explicit scoped input is supplied (`your-input`). **No scoped
    value was invented for the public persona.**
  - **Month precision:** each entry spans [count − 2, count] months; overlaps are counted once;
    adjacent entries are not merged. Public persona: full-time **50–54** months, co-op **4–6**.
  - **Dates:** exact dates keep their day. "by / no later than" = deadline; "no earlier than /
    after / from" = earliest; "on / start date:" = fixed. A conflict stops only with a mandatory
    cue. Descriptive wording → review. Seasons are labelled model assumptions and never stop.
  - **Headings:** conditional headings and the word "requirements" count as obligation cues
    (mixed → ambiguous). Unmet years under an unrecognized heading → review even when a required
    section is met.
  - **Liveness:** only positive closure evidence (HTTP 404/410, a closed-URL redirect, closure
    wording) can support "gone". A thin or blocked page is `page-blocked-or-thin` → review,
    with or without a feed observation.
  - **Provenance:** liveness `source` is now `model-judgment`; the raw observations (feed
    listing, HTTP status) are listed as `record`, and the checker verdict as judgment.
  - **Report:** disjoint experience groups (satisfied / unknown / review / mismatch / stack not
    core), each with liveness, sponsorship, and timing counts. Absence claims are scoped ("the
    rules detected no … in the captured posting body; application-form questions not inspected").
- **Failure found while implementing:** "Start date: February 3" was read as non-mandatory,
  because the regex's trailing `\b` cannot follow a colon. Regression R8 caught it; fixed.
- **Pre-freeze audit by Claude of v0.4 on the 12 development postings:** one misclassification.
  "three (3) years of software engineering **or related** experience" was read as scoped.
  Fixed, with a regression test. It does not change any decision.
- **Real sample (development evidence, not holdout):** 2 skip (Stripe 8142952: 10+ backend;
  Stripe 8198280: Master's + 6 years general), 5 G4 review, 4 G2 review, 1 G3 review. Full-text vs
  replay: 0 differences. **Against v0.3:** the 3 co-op-boundary postings and Stripe 8249901
  (scoped "three (3) years … in each of the following") moved from skip/seek to review.
- **Tests:** 74/74 (56 main + 18 regression); Assignment 1 18/18. Synthetic v0.4: 40 cases. Lock
  refreshed to `fixtures/real-sample-expected-v0.4.json` (development lock, Claude-audited).
- **New mutants (not yet run):** `thin-page-is-closure`, `coop-silence-counts`,
  `scoped-as-general`.
- **FREEZE:** rules **v0.4.0** are frozen at the next commit. The unseen-posting protocol is
  written after the freeze and before any new posting text is read.

## A2-2026-10-21-E17 — Unseen-posting protocol pre-registered after the freeze (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:25:09 EDT 2026`.*

- **Prior-inspection check (before writing the protocol):** Claude printed full text only for the
  original 12. Four Databricks ids (`5646855002`, `4799387002`, `6544435002`, `6544364002`)
  appear by id and title in the committed `selection.json`, as duplicates or as the posting a
  duplicate points to. Their text was never read. **They are excluded from "unseen" anyway.**
- **Written:** `HOLDOUT-PROTOCOL.md` and `holdout.mjs` (selection by the same cohort rule and
  order from the original raw capture; positions after the original 4, skipping excluded ones;
  2 per board; fresh feed check). Committed before any selection runs.
- **Next:** select; observe; extract; Claude writes the expected readings and commits them;
  only then run the frozen rules.

## A2-2026-10-21-E18 — Holdout selected and observed; expectations written BEFORE the program ran (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:27:31 EDT 2026`. Evidence `18`–`21`.*

- **Selected (protocol order, positions 5–6 on every board, none skipped):**
  - Databricks 8798198002, 8552484002;
  - Pinterest 7494668, 8011573;
  - Stripe 8198207, 8197135.
- **Observations:** all 6 listed in a fresh feed fetch at 11:25, with content unchanged since the
  00:01 capture. Page check: Databricks and Stripe active. **Pinterest "expired / insufficient
  content" again, and the probe saw HTTP 403 "Just a moment..." (272 characters).**
- **Expectations:** `holdout/expected-claude-reviewed.json`, written by Claude from the captured
  text **before** `triage.mjs run` was executed on these postings. Labelled Claude-reviewed, not
  human-validated. Claude wrote both the rules and the expectations, so agreement is weak evidence.
- **Predicted weak spots (Claude, before running):**
  - "What we look for" is not in the heading vocabulary.
  - The Databricks export-control sentence was rendered as a heading line, which the wording rules
    may not read.
  - Stripe 8197135's either/or spans two sentences, which the alternatives rule cannot see.

## A2-2026-10-21-E19 — FIRST HOLDOUT RESULT (frozen v0.4.0, unseen postings) — preserved as-is (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:28:19 EDT 2026`. Evidence `22-holdout-first-run.txt`; outputs `runs/holdout-v0.4-first/`.*

- Rule files unchanged since the freeze (`git diff 4910036` empty). Full-text vs excerpt replay:
  0 differences.
- **Agreement with Claude's pre-written expectations: 40/48 check-level fields; final next step
  4/6.** No unseen posting was skipped wrongly; all 6 end with a person (4 requirement review,
  2 liveness review).
- **Disagreements (all kept):**
  1. Databricks 8798198002 and 8552484002, G3 eligibility: the export-control sentence ("…Employer
     may decline to proceed with an applicant on this basis alone") is rendered from bold HTML as
     a **heading line**, which the eligibility rule never reads → `none-stated`. The final step
     becomes requirement review instead of eligibility review: still a person, but **the wrong
     reason is surfaced**, which matters for this candidate. **Rule defect.**
  2. Same two postings: "What we look for" is not in the heading vocabulary → G6
     `java-mentioned-outside-core` (both) and G4 `requirement-section-unclear` (8552484002;
     same review gate as expected). **Vocabulary gap.**
  3. Stripe 8197135, G4: the "In the alternative" branch is a separate sentence, so the
     alternatives rule does not see it → `scoped-duration-unknown` (same review gate). **Rule
     limitation.**
- Claude predicted all three weak spots in E18 before running. That is consistent, but it also
  shows the expectations were written by the rules' author.
- **What this does and does not show:** six postings from the same three boards can reveal errors
  (they did). They cannot establish general accuracy.
- **Consequence for the development set (Claude's own earlier miss):** the original Databricks
  postings probably carry the same export-control sentence. Claude's E07 audit grep searched for
  sponsor/visa/authoriz/citizen, not "export", so the earlier "no eligibility wording" readings for
  those postings were incomplete.
- **Next:** repair as rules v0.4.1. Everything after this entry on the holdout is **development
  evidence**; there is no untouched holdout result for v0.4.1.

## A2-2026-10-21-E20 — Rules v0.4.1: repairs from the holdout (DEVELOPMENT evidence from here on) (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:29:24 EDT 2026`. Evidence `23`–`25`.*

- **Regression tests first:** 3 new tests, paraphrasing the holdout defects, **failed on frozen
  v0.4.0** (evidence `23`).
- **Repairs:**
  - wording rules also read heading lines (G3 only);
  - "what we look for" / "what we are looking for" are required-section cues;
  - an "In the alternative / Alternatively" sentence makes its neighbour an alternative branch.
- **v0.4.1 on the original 12 (development):** the 3 Databricks postings (8864368002, 8815669002,
  8806934002) move from requirement review to **eligibility review**, because their export-control
  sentence is now read. This corrects Claude's earlier readings of those postings (E07 grep scope).
  Now: 4 eligibility review, 4 liveness review, 2 requirement review, 2 skip. Full-text vs
  replay: 0 differences.
- **v0.4.1 on the 6 holdout postings — DEVELOPMENT rerun, not holdout performance:** 47/48 fields,
  6/6 final steps vs the pre-written expectations. Remaining difference: Stripe 8197135 G4 reports
  `scoped-duration-unknown` before `alternative-requirements`. Both are review reasons; this is
  precedence, not a miss. The first holdout result (E19: 40/48, 4/6) remains the holdout result.
- **Tests:** see evidence `25`. Lock refreshed to `fixtures/real-sample-expected-v0.4.1.json`
  (development, Claude-audited).

## A2-2026-10-21-E21 — Break harness at v0.4.1: Claude's predictions recorded BEFORE running

*Contemporaneous. `date` → `Wed Oct 21 11:29:52 EDT 2026`. The harness now runs both test files inside each mutant.*

| Mutant | Predicted: caught by | Predicted real-sample changes (of 12) |
|---|---|---|
| feed-ignored | S19 (state becomes `page-blocked-or-thin`) | **0** — v0.4 keeps blocked Pinterest pages in review even without the feed (was 4 at v0.3) |
| no-preference-distinction | S04, preference test | 0 |
| stack-overrides-experience | many G4 cases | **4** — Stripe 8142952, 8198280 (skip → seek); 8249901, 8230952 (review → seek) |
| thin-page-is-closure (new) | S45, R14 | 0 — real Pinterest cases are decided by feed-vs-page disagreement first |
| coop-silence-counts (new) | S31, R3 | 0 — Stripe 8230952 stays in review through its scoped lines |
| scoped-as-general (new) | S11, S34, R5 | 1 — Stripe 8249901 (review → seek) |

- **Aditya's replication prediction:** not collected; requested in the review packet before
  Aditya runs the harness.

## A2-2026-10-21-E22 — Break results at v0.4.1 (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:30:17 EDT 2026`. Evidence `26-break-test-v0.4.1.txt`.*

- All 6 mutants caught (suite exit 1 for each); the unmodified control passes 77/77. **All six
  predictions in E21 held.**
- Real-sample decisions changed: stack-overrides-experience **4**, scoped-as-general **1**;
  feed-ignored **0** (was 4 at v0.3), thin-page-is-closure 0, coop-silence-counts 0,
  no-preference-distinction 0.
- **Reading (Claude):** at v0.4.1, two protections are exercised by the real sample. The
  feed-ignored count dropped because the stricter blocked-page rule now independently keeps the
  Pinterest pages in review. The two liveness protections overlap. Four protections are shown
  only by synthetic and regression cases.

## A2-2026-10-21-E23 — Scope check of every changed path, including the persona (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:40:49 EDT 2026`. Evidence `27-scope-check.txt`.*

- 189 paths differ from `upstream/main` (Assignment 1 plus Assignment 2). Protected-path grep:
  none. Outside-allowlist grep: none. No Assignment 1 path is touched by an Assignment 2 commit.
- **Persona location decision: unchanged, with the reason recorded.**
  - `search/examples/tariq-lindqvist/` (including `test-variants/`) is inside the CI
    contrib-scope allowlist (`search/examples/`).
  - DATA_CONTRACT §Zero-Conditions directs new fictional personas there.
  - `pii-scan.mjs` accepts resume- or profile-shaped files **only** under its SANCTIONED dirs.
  - Relocating `profile.yml` / `gaps.md` into `scripts/contrib/…` would be flagged as a
    resume-shaped file outside the sanctioned dirs (checked against the scanner's own pattern).
    Renaming files to dodge the pattern would weaken the check, so it was not done.
- **Residual tension, flagged:** `course/README.md` says students may only create files under
  their own handle directory. The persona path does not contain the handle, though DATA_CONTRACT
  and CI both permit it. Name-collision risk is low (unique persona name). This belongs in the
  PR body for the maintainer.

## A2-2026-10-21-E24 — Documents reconciled to v0.4.1; review packet prepared (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:47:58 EDT 2026`.*

- **Rewritten or updated:**
  - recipe v0.4.1 (`todos_open: 4` = 4 markers; co-op DEFINE closed by Aditya in E14; holdout
    DEV closed as built; application-form and 403-patch DEV kept open as deferrals); card;
    domain justification;
  - `WORKED-RUN.md` (regenerated from evidence; the v0.3 version is archived unchanged with a
    banner in `archive/WORKED-RUN-v0.3.md`);
  - `README.md`, `DEMO-SCRIPT.md`, `PR-DESCRIPTION.md` (draft, unpublished, fresh pasted
    output), `SUBMISSION.md`, contribution `README.md`, run log + identical copy;
  - new `REVIEW-PACKET.md`.
- **Correction while writing (Claude):** the first draft of the domain justification said "none of
  the real postings said whether co-ops count". The outputs show 7 of 18 use wording the rules
  treat as ambiguous ("equivalent experience" and similar); none explicitly accepts or excludes.
  Corrected before commit.
- **Cross-check prepared for Aditya:** Stripe 8230952. Claude saw both excerpts on the live page at
  15:41 UTC (evidence `29`). That is Claude's observation, not Aditya's check.
- **Known cosmetic defect, not fixed:** the checker-verdict observation line repeats the reason text
  ("insufficient content … / insufficient content …"). Fixing it would change `triage.mjs` output
  after the freeze and require regenerating every run; left as-is and noted.
- **Lifecycle:** remains **DRAFT**. Nothing promoted; no human gate cleared.

## A2-2026-10-21-E25 — Fresh-clone reproduction at the final commit; stage handoff (Claude)

*Contemporaneous. `date` → `Wed Oct 21 11:48:28 EDT 2026`. Evidence `32-clean-clone-v0.4.1.txt`.*

- **Fresh local clone at `92c829f`** (no `node_modules`, no `private/` data):
  - tests 77/77; Assignment 1 suite 18/18;
  - both replays reproduce the committed runs (0 differences each);
  - break harness: 6/6 mutants caught, same per-mutant counts as evidence 26; no worktrees left.
- **Not done (by instruction):** no push, no PR action, no ZIP, no submission. PR #45 untouched;
  the Assignment 1 checkout and ZIP are unchanged.
- **Pending human items (Aditya):**
  1. a replication prediction, then the runs in `REVIEW-PACKET.md` §8;
  2. the cross-check in §9;
  3. adequacy review of the reports (`[TODO APPROVE]`);
  4. a decision on the remaining heuristics (`[TODO DEFINE]`);
  5. reflection and interpretation of the E03 prediction;
  6. the attestation, signed or declined;
  7. approval of the publication plan.
- **Handoff:** worktree `/Users/adityaraj/Desktop/the-reallocation-engine-a2`, branch
  `contrib/2026fa-aditya-raj-sde-java-backend-early2027`, all commits local. Rules v0.4.1 (v0.4.0
  frozen at `4910036`; first holdout result in `runs/holdout-v0.4-first/`). Private material in
  `private/a2/`. `npm run verify` needs the main checkout's `.venv` on PATH.

## A2-2026-10-21-E26 — Aditya's final scope decisions and replication prediction (recorded before preparation)

*Contemporaneous. `date` → `Wed Oct 21 12:44:11 EDT 2026`. Source: Aditya's chat message after E25. Paraphrased except where quoted.*

- **Scope freeze (Aditya):** feature scope frozen at rules v0.4.1. No new features, samples, or
  refinement cycles unless a submission-blocking defect appears.
- **Heuristics (Aditya) — closes the recipe's open DEFINE:** keep the current conservative
  heuristics:
  - full-time and co-op experience kept separate;
  - review ambiguous co-op counting when it changes the outcome;
  - no inference of skill-specific years from total career;
  - month-date uncertainty preserved;
  - explicit mandatory timing evidence required for a hard stop;
  - seasons treated as assumptions;
  - ambiguous headings, export-control wording, and blocked pages routed to review.
- **Deferrals approved (Aditya):** application-form collection and the shared maintained-checker
  patch, to be marked as explicitly deferred work with reasons and limitations, and not as built.
- **Persona location (Aditya):** keep it in `search/examples/` if current CI and DATA_CONTRACT
  permit it. Document the conflicting course wording and the exact rules in the PR description.
- **Holdout wording (Aditya):** keep 40/48 and 4/6 as **agreement with Claude-reviewed
  expectations**, not independently established accuracy. Keep 47/48 and 6/6 labelled
  development evidence.
- **Aditya's replication prediction (verbatim):**
  > "the existing tests should catch all six documented mutants, while the unmodified control
  > should pass."
  Aditya notes that it is "informed by your reported results, not blind". Exact decision-change
  counts: **unspecified by Aditya**; they will be compared with what Aditya observes.
- **Not yet given:** Aditya's own run results, the cross-check observation, reflection, report
  adequacy, attestation, and publication confirmation. **Pending.**

## A2-2026-10-21-E27 — Final preparation under the scope freeze (Claude)

*Contemporaneous. `date` → `Wed Oct 21 12:48:44 EDT 2026`. No code, rule, or input changed in this entry;
existing run evidence (24–32) is reused.*

- **Recipe:**
  - Aditya's E26 heuristics decision closes the DEFINE.
  - The two deferrals are recorded as human scope decisions with reasons and limitations, and
    marked **NOT built**.
  - New "Lifecycle evidence" table. The only item blocking promotion is the `[TODO APPROVE]`
    adequacy review (`todos_open: 1`). Status stays **DRAFT**; RUNNABLE-LIVE is not sought.
- **Wording:** every document now describes 40/48 and 4/6 as agreement with Claude-reviewed
  expectations; 47/48 and 6/6 stay "development evidence".
- **PR draft:** exact persona rules (contrib-gate.yml:85–86, DATA_CONTRACT §Zero-Conditions
  108–117, pii-scan.mjs:26) and the conflicting course wording (course/README.md:6,
  CONTRIBUTING.md:17); deferrals listed as not built.
- **Other documents:** `SOURCES.md` (attribution) added; `SUBMISSION.md` rewritten with the ZIP
  procedure; worked-run appendix with complete commands, replacing abbreviated evidence headers
  without editing evidence; earlier review packet archived; final `REVIEW-PACKET.md` written.
- **Claude's verifications (not Aditya's):**
  - the review block was executed by Claude: all exit codes 0, tests 77/77, compare 0 differences,
    6/6 mutants caught, control 77/77 (evidence 33);
  - the ZIP procedure was dry-run in scratch space on `6488aab`: the comment equals the SHA,
    1,200 files and 16 MB, `private/` holds only scaffolding, and the root note append keeps the
    comment.
- **Aditya's prediction (E26):** all six caught; control passes. It matches Claude's verification
  run. **Aditya's own run is still pending**, and the decision-change counts Aditya did not specify
  will be compared with Aditya's observed output.
- **Pending (Aditya):** the review-block output, the cross-check observation, reflection,
  consolidated confirmation.

## A2-2026-10-21-E28 — Aditya's approvals and interpretation (recorded before final preparation)

*Contemporaneous. Source: Aditya's chat message after E27. Quoted where marked.*

- **Approved by Aditya:** "the conservative decision rules described in your review packet,
  including the co-op ambiguity handling, skill-specific experience distinction, exact-date
  interpretation, and review of export-control wording and blocked pages". Deferrals confirmed:
  application-form collection and the shared checker patch stay deferred. Scope stays frozen at
  v0.4.1.
- **Aditya's interpretation and learning (verbatim):**
  > "The main distinction is that total employment duration does not establish years of
  > experience in a particular technology, just as company sponsorship history does not establish
  > sponsorship for an individual opening."
  >
  > "The missed export-control wording illustrates a separate limitation: reproducible output and
  > passing tests do not prove correct interpretation. The first unseen-posting evaluation exposed
  > a gap, and the corrected rerun is development evidence rather than an independent accuracy
  > measurement."
  >
  > "The next improvement would be an independently reviewed evaluation across additional
  > employers and page formats. That is future work, not something to implement before
  > submission."
- **Aditya's instruction on verification:** remaining execution and source checks are to be done by
  Claude and attributed to Claude. Personal reruns suggested earlier are to be checked against
  the actual requirements, and must not block submission if optional.
- **Not performed by Aditya (as of this entry):** the review-block run (REVIEW-PACKET §B) and the
  live-page cross-check (§C). Neither is claimed.
- **Not yet stated by Aditya:** an explicit report-adequacy judgment, the attestation signature,
  and the go-ahead to publish. Claude checks below whether these are mandatory.

## A2-2026-10-21-E29 — Final checks by Claude; requirements check; one remaining human checkpoint (Claude)

*Contemporaneous. `date` → `Wed Oct 21 13:34:44 EDT 2026`.*

- **Evidence reuse:** rule code (`checks.mjs`, `triage.mjs`, `text.mjs`), fixtures, and inputs are
  unchanged since v0.4.1 (`2cc7c2e`). Only `break-test.mjs` (harness), `excerpt-check.mjs`
  (probe), and the README changed, and evidence 26, 32, and 33 were produced after those changes.
  The full evaluation was therefore not repeated.
- **New Claude execution:** live-page cross-check at 17:32 UTC (evidence `34`): both excerpts
  present; the page body length changed 6,129 → 6,376 characters (what changed was not examined).
  Remote state:
  - PR #45 open, the only open PR by `aditya-raj-sde`;
  - upstream `main` unchanged (`015843d`);
  - `1a618e7` is an ancestor of this branch;
  - Git Credential Manager configured; `gh` not installed.
- **Requirements check (SNICKERDOODLE.md lines 45, 59, 92; assignment PDF, Attestation):**
  - **Mandatory:** a human reads and judges the reports (RUNNABLE-SAMPLE "audits generated and
    read"); the attestation is the human's record and is signed "By: name · date".
  - **Optional:** the personal re-runs and the live cross-check Claude had suggested.
  - **Mandatory but outside the lifecycle:** the presentation and the Canvas upload.
  - Aditya's E28 message approves the decision rules and gives an interpretation, but **does not
    state that the reports are adequate or sign the attestation**. Claude does not read it as doing
    so.
- **Prepared, not applied:**
  - The worked-run attestation now separates Claude-executed rows, Claude-reviewed items, and
    Aditya's decisions and interpretations; it is unsigned.
  - Aditya's reflection is in the worked run, verbatim.
  - The mandatory-vs-optional note is in the recipe and the manifest.
  - Promotion edits are scripted and dry-run on copies only.
- **Status:** DRAFT. One human checkpoint remains (report adequacy + attestation signature +
  publication go-ahead), presented to Aditya as a single statement.

## A2-2026-10-21-E30 — Aditya's report-adequacy judgment, attestation signature, and publication go-ahead

*Contemporaneous. `date` → `Wed Oct 21 16:17:06 EDT 2026`. Source: Aditya's chat message after E29 (verbatim).*

> "I, Aditya Raj, have read the four reports listed above and judge them adequate for the decisions
> they support. This clears only the recipe's report-adequacy item; it clears no individual
> posting's review. I sign the attestation as it is written in WORKED-RUN.md: Claude executed and
> checked every listed run, and I supplied the decisions, predictions, and interpretation recorded
> there. I did not personally re-run the commands. Proceed with publication: final commit, ZIP from
> that commit, push only the Assignment 2 branch, create the replacement PR, then close #45 with a
> cross-link while preserving commit 1a618e7, its branch, and the Assignment 1 ZIP."

- **Effect:**
  - The recipe's `[TODO APPROVE]` is closed (Aditya, 2026-10-21).
  - DRAFT → SPECIFIED (zero open typed TODOs) → RUNNABLE-SAMPLE (sample runs complete, evidence
    24/32/33; conformance passes, 31; reports read and judged adequate by Aditya).
  - `attestation:` in the frontmatter stays `null` (set only at VERIFIED). The worked-run
    attestation is signed "By: Aditya Raj · 2026-10-21".
- **Not affected:** no posting-level review gate is cleared. RUNNABLE-LIVE is not claimed.
- **Publication order (Claude):**
  1. this commit;
  2. push only the Assignment 2 branch;
  3. create the replacement PR;
  4. close #45 with a cross-link;
  5. one follow-up commit recording the publication outcome (PR URL);
  6. build the Canvas ZIP from **that** final commit, so the ZIP, the PR head, and the recorded
     SHA all match.

## A2-2026-10-21-E31 — Publication step 1: commit and push (Claude)

*Contemporaneous. `date` → `Wed Oct 21 16:18:53 EDT 2026`.*

- **Commit C1** `068794953f09e185322a3657955ec27da809871f`: promotion to RUNNABLE-SAMPLE, gate logged,
  PR body finalized. Pre-publication checks are in evidence `35`: verify, conformance on 82 files,
  doctor, history PII scan clean, scope clean, no Assignment 1 file changed.
- **Friction:** the first push attempt never ran. Claude wrapped it in `timeout`, which macOS does not
  provide (exit 127). Retried with a plain `git push`.
- **Push:** `git push -u origin contrib/2026fa-aditya-raj-sde-java-backend-early2027` → new branch on
  the fork at `0687949`. The fork's Assignment 1 branch is still at `1a618e7` (verified with
  `git ls-remote`). Nothing else was pushed.
- **PR creation needs GitHub API authentication.** Claude installed GitHub CLI 2.103.0 with Homebrew
  (no credentials involved). `gh auth status`: not logged in. **Waiting for Aditya to sign in
  locally.** No token was requested or handled in chat.

## A2-2026-10-21-E32 — Publication steps 2–3: PR created, #45 closed (Claude)

*Contemporaneous. `date` → `Wed Oct 21 16:49:21 EDT 2026`.*

- **Authentication:** Aditya signed in locally (`gh auth login --web`). `gh auth status` showed
  account `aditya-raj-sde`; the token was never displayed or handled in chat.
- **PR created:** https://github.com/nikbearbrown/the-reallocation-engine/pull/75, from
  `aditya-raj-sde:contrib/2026fa-aditya-raj-sde-java-backend-early2027` into `main`. The body is
  `PR-DESCRIPTION.md` from "Executive summary" on; the head at creation was `0687949`.
- **#45 closed** after #75 existed, with a comment cross-linking #75 and stating that commit
  `1a618e7`, its branch, and the Assignment 1 ZIP are preserved. Verified: #45 `CLOSED` with head
  still `1a618e7`; fork branches `…sponsor-live-jan2027` at `1a618e7` and
  `…java-backend-early2027` at `0687949`; the only open PR by `aditya-raj-sde` is #75.
- **Next:** this commit (C2: publication record + PR URL in `SUBMISSION.md`) is pushed to #75; the
  Canvas ZIP is built from C2; CI status is reported for C2.

## A2-2026-10-21-E33 — ZIP of 0312b42 verified; a temp-directory test caveat; CI awaiting approval; final rebuild (Claude)

*Contemporaneous. `date` → `Wed Oct 21 16:51:26 EDT 2026`.*

- **ZIP built from `0312b42`** and checked:
  - the archive comment equals the SHA;
  - 1,034 files, identical to `git ls-tree`, with Assignment 2 file contents byte-identical;
  - the root note added; deliverables present; `private/` holds only scaffolding;
  - the extracted tree's PII scan shows only the inherited lockfile line.
- **Friction:** the tests run inside that extracted ZIP gave **76/77**. Root cause: the ZIP was
  extracted under the system temp directory, which the output guard deliberately allows, so the
  "outputs cannot land outside the allowed run folders" test cannot fail its write there. This is
  the same artifact Claude hit with the break harness in E11. Extracted under the home folder, the
  same ZIP gave **77/77**. No code change; a "run outside the temp directory" note was added to
  `README.md` and `SUBMISSION.md`.
- **CI (GitHub Actions):** for both `0687949` and `0312b42`, the `verify` and `Contrib Gate`
  workflows concluded **`action_required`**. They have not run; a maintainer must approve
  workflows for this fork PR. For reference: upstream `main` `015843d` — `verify` success,
  `Contrib Gate` failure (inherited); #45's head `1a618e7` — both failure (Assignment 1 recorded
  inherited blockers). The job-level details were not retrievable through the API, so causes are
  not asserted.
- **Plan:** this documentation-only commit (C3) is pushed to #75. The `0312b42` ZIP is moved aside
  (not deleted) to `~/Desktop/reallocation-aditya-raj-sde-mode.0312b42-superseded.zip`, and the
  Canvas ZIP is rebuilt from C3, so the ZIP, the PR head, and the Canvas SHA are identical.
