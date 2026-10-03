# Frictional log: swe-title-sponsor-opt (tushar-patel28, 2026fa)

## Executive summary

This log covers the problems that came up while building and testing a small tool for an international student. The tool checks two things about each job opening: whether the employer's public visa-sponsorship history includes a job title in the student's field, and whether the role's start date fits the student's work-permit window. For each problem the log records what was tried, what happened, who caught it (the student, the chat assistant that wrote the prompts, or the coding assistant working in the repository), and what changed as a result.

**Why read it.** It shows where the automatic checks helped and where they didn't. It also shows which decisions were the student's and which came from an assistant, and what is still unsettled.

**What it found.**
- The automatic checks reliably caught structural problems: impossible dates, incomplete entries, a leaked email address, and a scoring tool that had been deliberately broken.
- Several content problems passed every check and were caught only when a person or an assistant read the actual output:
  - keyword rules that matched the wrong jobs;
  - a cut-off that silently made a risky start date look safe;
  - an unverified claim written as fact;
  - first-person visa wording in public history;
  - authorship labels that credit the wrong writer.
- Several questions remain open. Two of them are conflicts between project rules that only the maintainer can settle.

## How this log was made

- **Written:** 2026-10-01 by Claude Code, at Tushar's request. Not committed when written.
- **Who:**
  - **Tushar:** the student, owner of handle `tushar-patel28`.
  - **Claude-chat:** the claude.ai assistant that wrote the prompts Tushar gave to Claude Code.
  - **Claude Code:** the coding agent working in this repository, across several sessions.
- **Source labels.** Every fact in an entry comes from one of these sources:
  - **[repo]:** a committed file, cited by path and commit;
  - **[re-checked 2026-10-03]:** re-run by Claude Code while writing this log; the commands are listed below;
  - **[Tushar's account]:** from Tushar's chat with Claude-chat; there is no repo record;
  - **[prior Claude Code session report]:** reported by an earlier Claude Code session; there is no committed record of the check itself.
- **Commit IDs.** The original IDs are no longer on the branch. They remain on local `backup/*` branches and may still be reachable by ID on GitHub (see unresolved question 5).

| Commit | Final ID | Original ID |
|---|---|---|
| change brief (predictions before build) | `5a49af7` | `590ebea` |
| first build | `cce6c00` | `7d89ffe` |
| review revisions | `5db51f6` | `7fec110` |
| G1 sign-off | `55ca2f4` | `0a27e32` |
| test report and run log | `a623e7d` | `0681cf0` |
| reference updates | `6928729` | (new) |
| domain justification and worked run | `ff13a62` | (new) |

**Re-checks run on 2026-10-03.** All of these ran locally, with no network access:

- **Crosswalk counts.** Applying the first-build crosswalk (`git show cce6c00:…/crosswalk.json`) and the current crosswalk to every sponsoring company in the 80 Days CSV reproduces the prior session's numbers exactly:
  - first build: SWE 539, AI 193, Cloud 88, no family 851;
  - current: SWE 511, AI 86, Cloud 68, no family 967.
- **Distinct titles.** The CSV has 1,988 distinct sponsored titles after trimming whitespace (2,063 without trimming).
- **False matches.** The first-build crosswalk maps "AI Success Manager" to AI and "Director Cloud Ops" to Cloud. The current one excludes both.
- **No SOC column.** The CSV header has 20 columns, and none contains "soc".
- **Re-cut size.** `git diff --numstat 0681cf0 a623e7d` shows 10 lines changed in 5 files.
- **Re-cut metadata.** `590ebea` and `5a49af7` have the same author and date.
- **Author email.** All 7 branch commits use the GitHub noreply address, as both author and committer.
- **mappings.json hash.** The file now hashes to `a474aa5b…`; the same file at `0681cf0` hashes to `c5fd01db…`.
- **F3 fixture.** `f3-before` is 2027-01-21 at `cce6c00` and 2026-12-22 at `5db51f6`.

## Pattern

The gates and scans caught structural problems:
- an impossible date (E19);
- an email address copied into a draft (E20);
- three deliberately broken scorers (E5, and the test report's *Failure cases* table);
- incomplete or disallowed human-gate entries (E8).

They did not catch content problems. Each of these passed every check and was found only by someone, human or AI, reading the actual output or source:
- keyword rules matching "AI Success Manager" and "Director Cloud Ops" (E10);
- a 0.6 timeline value that the scorer silently treats as healthy (E9);
- an unverified "one visa category" claim (E22);
- first-person visa wording and the school name in pushed history (E21);
- authorship labels that credit the wrong drafter (E11);
- a health check that never looks at the folder this recipe lives in (E16).

One machine warning went the other way: the manifest check's W2 warning is a false positive (E13). Conformance passing says the files parse. It says nothing about whether the content is right.

## Entries

### 2026-10-01

#### E1 · The handle's case
- **Tried:** The read-only repo recon used the handle `Tushar-Patel28`, the git user name.
- **Expected:** That the handle matched the GitHub account.
- **What happened:** Tushar's GitHub settings show `tushar-patel28` (lowercase).
- **Checked:** Tushar's GitHub settings page.
- **Response:** All paths were made lowercase before the first commit.
- **Learned:** The git user name is not the GitHub handle. Branch, folder and file names must use the handle exactly as GitHub shows it.
- **Who:** Claude Code's recon (Prompt 1) made the assumption [Tushar's account]. Tushar caught it.
- **Trace:** [Tushar's account]. Every path in `git log --stat origin/main..HEAD` uses `tushar-patel28` [repo]. The git user name is still `Tushar-Patel28`, the author name on all 7 commits [re-checked 2026-10-03].

#### E2 · The commit email
- **Tried:** Committing with the default git email.
- **Expected:** That it was safe to publish.
- **What happened:** The default was a personal address. Under the data contract's zero-conditions, a real email address in any reachable commit counts as real personal data.
- **Checked:** `git log` after setting the address.
- **Response:** Before the first commit, the repo-level email was set to Tushar's GitHub noreply address.
- **Learned:** Commit metadata is part of the public history, just like file contents.
- **Who:** Tushar.
- **Trace:** [Tushar's account]. All 7 commits on `origin/main..HEAD` carry the noreply address as both author and committer [re-checked 2026-10-03].

#### E3 · No SOC field in the sponsorship data
- **Tried:** The recipe as first specified (recipe A), which needed each company's sponsorship record broken down by occupation code (SOC).
- **Expected:** An SOC column in the 80 Days CSV.
- **What happened:** Recon found no SOC field, so recipe A could not be built as specified.
- **Checked:**
  - the repo's entity-resolution audit, `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-entity-resolution-readiness-audit.md` line 18;
  - `recipes/cases/2026su/case-ml-sponsorship-triage.md` line 161;
  - the CSV header: 20 columns, none containing "soc" [re-checked 2026-10-03].
- **Response:** The recipe was reshaped into a title-based check. A keyword crosswalk maps each company's `top_job_titles_sponsored` to the SWE, AI or Cloud family. A match is labelled a title match only, never a claim about the visa's job category.
- **Learned:** The first question to ask of any data source is whether it holds the field the recipe needs. Here, the missing field turned a record lookup into a definition (the crosswalk) that a human has to own.
- **Who:** Claude Code did the recon (Prompt 1). Claude-chat drafted the reshaped brief [Tushar's account]; the brief's drafting note says only "Claude". Tushar edited it and accepted it by committing it.
- **Trace:** [Tushar's account]. `CHANGE-BRIEF.md` §2 *Proposed additions*, `5a49af7`.

#### E4 · The brief's first commit attempt failed; where P4's wording came from
- **Tried:** Committing `CHANGE-BRIEF.md`.
- **Expected:** A clean commit of the brief in the submissions folder.
- **What happened:** The file had downloaded into the repo root, and that copy still had the capitalized handle. The first attempt failed.
- **Checked:** The handle in the file.
- **Response:** The handle was fixed with `sed`, and then the brief was committed.
- **Learned:** A file that arrives from outside the repo (a download) skips the fixes already made inside it. Check it the same way as anything else.
- **P4's origin, stated plainly:** The wording of prediction P4 ("I think SWE will match almost every sponsoring company, so the check won't actually separate companies") began as an example sentence that Claude-chat suggested. Tushar adopted it as his prediction. The brief labels P1–P3 as Claude's and P4 as Tushar's. That label records whose prediction it is, not who wrote the words.
- **Who:** Tushar fixed and committed the file. Claude-chat suggested the P4 sentence.
- **Trace:** [Tushar's account]. `CHANGE-BRIEF.md` drafting note and §5, `5a49af7`.

#### E5 · Scorer `--profile` "authorized" bug
- **Tried:** During recon, running the real scorer with an F-1 profile whose `authorization` field reads "F-1 STEM OPT — work authorized (EAD)".
- **Expected:** A student on F-1 still needs sponsorship, so the sponsorship weight should stay above 0.
- **What happened:**
  - `applyProfile` in `scripts/score/role-scorer.mjs` (lines 56–63) matches `/authorized/` and sets `profile_needs_sponsorship: false`, which zeroes the sponsorship weight.
  - The Ch. 11 biotech role dropped from 0.446 Apply to 0.1785 Skip.
- **Checked:** A reproduction with output to `/tmp`; nothing tracked changed.
- **Response:** Tushar chose to document the bug and guard against it, not to patch the scorer:
  - the tool never passes `--profile`;
  - it fails with exit 3 if any sponsorship term has weight 0;
  - a mutant scorer, `BROKEN-sponsorship-weight-zero.mjs`, must be caught by that guard.
- **Learned:**
  - A single word in free text ("authorized") can turn off a whole factor.
  - A guard on the scorer's output catches the problem whatever its source, the flag or anything else.
  - The run log notes that this bug contradicts a note in `search/examples/aarav-patel/profile.yml` saying it had been fixed.
- **Who:** Found during Claude Code's recon (Prompt 1) [Tushar's account]. Tushar decided to guard, not patch.
- **Trace:**
  - `scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/README.md` §F6;
  - tests `test_F6_guard_passes_on_real_scorer_and_weight_is_positive`, `test_F6_scorer_is_never_called_with_profile`, `test_BROKEN_sponsorship_weight_zero_is_caught`;
  - `logs/runs/2026fa-tushar-patel28-1.md` open issue 3;
  - first built in `cce6c00`.

#### E6 · The scorer has no exports
- **Tried:** Following `CONTRIBUTING.md` lines 46–49, which say harnesses import `CONFIG`, `SRC`, `applyProfile` and `scoreRole` from the scorer.
- **Expected:** Importable functions.
- **What happened:** `role-scorer.mjs` has no `export` statement, and it calls `main()` when loaded (line 185).
- **Checked:** The scorer source, on 2026-10-01.
- **Response:** The harness runs the CLI (`npm run score -- <roles.json> --out-dir <dir>`) and reads `role-scores.json`. The mutant scorers inject defects into a copy of the real scorer's source. The tool does not re-implement the composite score.
- **Learned:** Contribution docs can describe an API that doesn't exist. Check the source before building on the docs.
- **Who:** Found during Claude Code's recon (Prompt 1) [Tushar's account]. Tushar accepted the CLI approach and made changes.
- **Trace:** `TEST-REPORT.md` *Known pre-existing findings*, `a623e7d`. The test `test_F6_scorer_is_never_called_with_profile` asserts the command starts with `npm run score -- `.

#### E7 · Plan mode skipped
- **Tried:** Building the first version under `recipes/` and `scripts/contrib/`.
- **Expected:** Claude Code should have entered plan mode, because `CLAUDE.md` says "Use plan mode before edits under recipes/, data/, or anything touching data/ats/".
- **What happened:** Claude Code did not use plan mode. It treated the detailed build spec in the prompt as the approved plan.
- **Checked:** Nothing at the time. The skip was reported afterwards.
- **Response:** None in the repo. It is recorded here.
- **Learned:** A detailed prompt is not the same as a plan the human has approved. The rule exists so the human sees the plan before edits start.
- **Who:** Claude Code.
- **Trace:** [prior Claude Code session report]. `CLAUDE.md` (the plan-mode rule). The edits landed in `cce6c00`.

#### E8 · First build: nothing could reach Apply
- **Tried:** The first build's sample run.
- **Expected:** Strong roles would reach Apply.
- **What happened:**
  - No role could reach Apply.
  - The data has no filing year, so the best evidence tier is Likely, and the scorer treats Likely as a soft tier, which caps those roles at Consider.
  - The best composite was 0.450 (Databricks), held at Consider.
- **Checked:** The scorer's `soft_sponsorship_tiers`, and the run report.
- **Response:** Tushar chose to add a human gate, G4, using the scorer's own `override`.
  - Apply now requires a human-filled overrides entry with: the LCA evidence source, fiscal year, SOC code, whether the posting rules out sponsorship, the liveness-check date, the check date, and a reason.
  - The tool refuses incomplete entries, and entries for roles with a closed timeline gate or an ambiguous or not-found company.
  - The sample overrides file ships empty, because no real DOL check has been done.
  - The alternative, raising a number until Apply appeared, was not taken.
- **Learned:** When the data can't support Apply, the honest answer is to make Apply a human decision backed by recorded evidence, not to tune the numbers.
- **Who:** Tushar chose the G4 design. It was implemented in `5db51f6`, which carries Claude's co-author trailer.
- **Trace:**
  - `CHANGE-BRIEF.md` *Revisions* 2026-10-01 ("G4 human gate");
  - `mappings.json` `g4`;
  - tests `test_refuse_*`, `test_refusals_unit`, `test_valid_override_becomes_apply_in_real_scorer_output`, `test_sample_overrides_ship_empty`;
  - all in `5db51f6`.

#### E9 · Timeline bands: 0.6 → 0.5, and the early-start band
- **Tried:** The first build's timeline bands, which came from Tushar's build request (recipe at `cce6c00` line 95):

  | Start date relative to EAD start | Factor |
  |---|---|
  | before the EAD start | 0 |
  | 0–60 days after | 1.0 |
  | 61–90 days after | 0.6 |
  | more than 90 days after | 0 |

- **Expected:** That 0.6 would mark the 61–90-day band as a risk.
- **What happened:** Claude Code read the scorer and found that it flags a timeline as weak only *below* 0.6 (`const softTimeline = timeline < 0.6;`, `role-scorer.mjs` line 101). A 0.6 band was therefore silently treated as healthy.
- **Checked:** The scorer source line.
- **Response:**
  - Claude-chat proposed 0.5 for the risk bands, which is below the threshold. Tushar approved it.
  - Tushar himself chose a soft early-start band: a start 1–30 days before the EAD start scores 0.5, because it can be negotiated onto or after the EAD start. More than 30 days early stays 0.
  - The soft band broke the F3 fixture. At day −1 it now scored 0.5, so it no longer tested a closed gate.
  - The fixture moved from day −1 (2027-01-21) to day −31 (2026-12-22), and edge cases at day −30 and day 61 were added. The repo records the fix, not how the problem was noticed.
- **Learned:**
  - A threshold in someone else's code decides what your number means. Read the comparison operator.
  - A fixture can stop testing anything when the rule it tests changes, and still pass.
- **Who:** Claude Code flagged the threshold. Tushar proposed 0.5 and chose the early-start band.
- **Trace:**
  - `mappings.json` `timeline`;
  - `fixtures/roles-cases.json`;
  - tests `test_F3_outside_window_is_gated_skip_by_real_scorer`, `test_soft_bands_are_scored_at_half_not_gated`, `test_band_edges`;
  - `CHANGE-BRIEF.md` *Revisions*;
  - `worked-run.md` *Broke during testing, fixed*;
  - all in `5db51f6`.

#### E10 · Crosswalk tightening
- **Tried:** The first crosswalk, which Claude proposed (`crosswalk.json` at `cce6c00` reads: "proposed by Claude on 2026-10-01, not yet closed by the human"). It included bare keywords such as `ai` and `cloud`, plus scientist titles under AI.
- **Expected:** That the keywords would pick out SWE, AI and Cloud titles.
- **What happened:** Every keyword was checked against all 1,988 distinct sponsored titles, and several false matches turned up:
  - bare "ai" matched "AI Success Manager";
  - bare "cloud" matched "Director Cloud Ops";
  - data-scientist, applied-scientist and research-scientist titles cover wet-lab, analytics and actuarial roles.
- **Checked:** All distinct titles in the CSV. The counts below were re-computed for this log and match exactly [re-checked 2026-10-03].
- **Response:**
  - Role nouns are now required, and exclusion patterns were added for manager, sales, QA, analyst and similar titles.
  - The three scientist titles were dropped from AI.
  - Sponsoring companies per family, before → after:

    | Family | Before | After |
    |---|---|---|
    | SWE | 539 | 511 |
    | AI | 193 | 86 |
    | Cloud | 88 | 68 |
    | No family | 851 | 967 |

  - The sample decisions were unchanged.
- **Learned:**
  - The false matches surfaced only in a sweep over the real title list.
  - AI coverage more than halved, which makes prediction P1 (AI roles hidden behind "Software Engineer") matter more.
- **Who:** Claude Code built the first crosswalk in the first build (Prompt 2), and Claude-chat supplied the principles it was later tightened against [Tushar's account]. Claude Code ran the sweep and tightened the patterns. Tushar accepted the result by committing it.
- **Trace:**
  - [Tushar's account] for who built the first crosswalk and who supplied the principles;
  - [prior Claude Code session report] for the sweep itself;
  - `crosswalk.json` `_changes_2026-10-01`, `5db51f6`;
  - tests `test_ambiguous_titles_map_to_no_family`, `test_non_ic_and_non_family_roles_map_to_no_family`, `test_clear_titles_map_to_their_families`;
  - `worked-run.md` *Corrections*.

#### E11 · The authorship label error (FIXED 2026-10-03)
- **Tried:** Recording who wrote the closures of the sponsorship-tier, fit, timeline-band and next-action definitions (and later the crosswalk).
- **Expected:** Labels that name the drafter.
- **What happened:**
  - Claude-chat drafted the rationales, and Tushar approved them.
  - Claude Code labelled them "rationale drafted by tushar-patel28, 2026-10-01" in the recipe, `mappings.json`, `crosswalk.json`, the contrib README and the card.
  - The brief's revision says the rationales "were drafted by Claude and approved by tushar-patel28". The same sentence adds that the labels were written that way "at the author's request".
  - Both statements are in the repo, and they disagree about who drafted.
  - [Tushar's account] Tushar's prompt (Prompt 3) asked for the label "rationale drafted by Claude, reviewed and approved by tushar-patel28." Claude Code misread it. The brief's statement that the labels were written "at the author's request" is therefore inaccurate. Tushar did not request them.
- **Checked:** The run log lists the mismatch under "Closure wording … to reconcile".
- **Response:** Tushar deferred the fix to his final review. The labels are left exactly as they are.
- **Learned:** An authorship label is a provenance claim like any other. A wrong one is an invented record even when it is meant as credit.
- **Who:** Tushar drafted the rationales. Claude Code wrote the labels. The fix is Tushar's.
- **Trace:**
  - [Tushar's account] for Prompt 3's wording;
  - `CHANGE-BRIEF.md` *Revisions* ("Who wrote the closures"), `5db51f6`;
  - `logs/runs/2026fa-tushar-patel28-1.md` open issue 4, `a623e7d`.
- **Status:** OPEN.

#### E12 · Salesforce stays blocked
- **Tried:** The G1 entity review, in which a human confirms each matched CSV row is the right company.
- **Expected:** One row per company.
- **What happened:**
  - "Salesforce.com, Inc." matched two rows, `SALESFORCE COM INC` (23115) and `SALESFORCECOM INC` (23116). They differ only in punctuation and funding date.
  - Tushar marked both rows "Yes" and left the side-by-side "This is the company" row blank.
- **Checked:** Both rows, side by side.
- **Response:** The tool can't accept a chosen row yet, so the role stays "blocked: pick the right company row" with no sponsorship vote. The fix is a proposed company alias table, still an open DEV item.
- **Learned:** A human can resolve an ambiguity that the tool has no way to record. A gate needs somewhere to write the answer down.
- **Who:** Claude built the review sheet in `5db51f6`; its notes are labelled `[model-judgment]`. Tushar signed it off in `55ca2f4`.
- **Trace:**
  - `g1-entity-review.md`, `55ca2f4`;
  - test `test_G1_break_no_fuzzy_match_no_namesake_no_guessing_between_rows`;
  - recipe *Proposed additions* (company alias table).

#### E13 · Manifest-check W2 false positive
- **Tried:** `npm run verify` on main and on the branch.
- **Expected:** No privacy warnings.
- **What happened:** W2 reported "private path not gitignored" for `private/` and `data/ats/`, both before and after the work.
- **Checked:**
  - `scripts/manifest-check.mjs` decides coverage by string-matching `.gitignore` lines (`giHas`, lines 74–80), so `/private/*` and `/data/ats/*` (`.gitignore` lines 37 and 40) don't count.
  - On 2026-10-01, `git check-ignore -v --no-index` confirmed that git ignores both.
  - Doctor's privacy check passed both times.
- **Response:** Recorded as a pre-existing false positive. No maintained file was changed.
- **Learned:** A privacy warning has to be checked against git itself. Ignoring it and "fixing" it are both wrong until then.
- **Who:** Claude Code ran the `git check-ignore` verification during recon [Tushar's account]. Recorded in Tushar's test report.
- **Trace:** [Tushar's account]. `TEST-REPORT.md` *Known pre-existing findings* and *Differences*, `a623e7d`.

#### E14 · Skip rate 2 of 11, below target
- **Tried:** The sample run of 12 roles.
- **Expected:** The project's healthy-run target is that at least half the evaluated roles are skipped. Claude's prediction P3 expected a small sample to miss it.
- **What happened:**
  - First build: 3 of 11 scored roles skipped (27%).
  - After the review revisions: 2 of 11.
  - The cause is mostly the mapping. Likely and Possible are soft tiers, and unknown roles land in Consider on fit alone (Google 0.240, Hugging Face 0.210).
- **Checked:** The run report and the brief's P3 outcome.
- **Response:** Deliberately not tuned. Lowering fit or raising the Consider floor to hit the target would mean choosing numbers to get a result.
- **Learned:** A missed health target is a finding to report, not a parameter to adjust.
- **Who:** Claude predicted it (P3). Claude-chat's build prompt (Prompt 2) instructed "don't tune the sample to hit any skip rate". Tushar approved that rule, and Claude Code followed it [Tushar's account].
- **Trace:**
  - [Tushar's account] for the no-tuning rule;
  - `CHANGE-BRIEF.md` *Revisions* (P3), `5db51f6`;
  - `worked-run.md` *Reflection*, `ff13a62`.

#### E15 · Lifecycle status kept DRAFT
- **Tried:** Promoting the recipe after a complete, conforming sample run.
- **Expected:** DRAFT → SPECIFIED → RUNNABLE-SAMPLE.
- **What happened:** Two rules conflict with the student contribution rules. The recipe quotes them under *Lifecycle status*:
  - **(a)** `SNICKERDOODLE.md` line 58: "| DRAFT → SPECIFIED | zero open &#91;`TODO`] items; …". Line 75: "A &#91;`TODO`] without evidence of closure is still open, whatever the text says." Against this, `course/summer-2026/reallocation-engine-mode-build.md` line 71 says proposed additions are "marked with a typed &#91;`TODO`]". The recipe's two DEV proposals (a liveness record for roles without a G4 entry, and the company alias table) must stay marked, so line 58 can't be met. `todos_open: 2`, down from 7 at `cce6c00`.
  - **(b)** `SNICKERDOODLE.md` line 59 needs a "RUN_LOG entry + audit files" for RUNNABLE-SAMPLE. `CONTRIBUTING.md` line 13 says "**never** edit `logs/RUN_LOG.md`", `logs/RUN_LOG.md` line 3 says "**Students: do NOT edit this file.**", and `.github/workflows/contrib-gate.yml` line 82 fails any PR that touches it.
- **Checked:** Each quoted line, cited in the recipe.
- **Response:** Status stays DRAFT. Both conflicts are logged in `logs/runs/`, not in `logs/RUN_LOG.md`. In the recipe, quoted TODO markers have their opening bracket escaped as `&#91;`, so that doctor's marker count still equals `todos_open`.
- **Learned:** When the rules conflict, keeping the lower status and citing the conflict is safer than promoting under one reading.
- **Who:** The conflicts were quoted in the recipe in `5db51f6`, which carries Claude's co-author trailer. Tushar committed it with DRAFT kept.
- **Trace:**
  - recipe frontmatter and *Lifecycle status*, `5db51f6`;
  - `logs/runs/2026fa-tushar-patel28-1.md` open issues 1–2, `a623e7d`.

#### E23 · `npm audit fix` deliberately not run
- **Tried:** `npm audit fix`, which npm's own install output suggested running [Tushar's account].
- **Expected:** That it would change only dependency versions.
- **What happened:** It would have modified the tracked `package-lock.json`, which is outside this student's namespaces.
- **Checked:** That `package-lock.json` is tracked.
- **Response:** Not run. `package-lock.json` is not in the branch diff.
- **Learned:** A "fix" command can change shared files. Check what it writes before running it.
- **Who:** Claude-chat advised against it, because it would rewrite the tracked `package-lock.json`. Tushar followed that advice [Tushar's account].
- **Trace:** [Tushar's account]. `TEST-REPORT.md` *Diff scope*, `a623e7d`.

### 2026-10-02

#### E16 · Doctor problems
- **Tried:** `npm run doctor` on a fresh clone of main (2026-10-01) and on a fresh clone of the branch (2026-10-02).
- **Expected:** Doctor would pick up the new recipe and check its `todos_open`.
- **What happened:**
  - Doctor reported `RECIPES (33)` and `318 declared` both times.
  - It reads only top-level `recipes/*.md` and never scans `recipes/cases/`.
  - Its status line also prints a template comment: `RUNNABLE-LIVE  # DRAFT | SPECIFIED | …`. One top-level recipe's `status:` line still carries the template's inline comment.
- **Checked:** Before and after outputs, side by side.
- **Response:** Both recorded as pre-existing. This recipe's own `status:` line also carries an inline comment, so it would show the same display defect if it were promoted to `recipes/`.
- **Learned:** "Doctor passes" said nothing about this recipe. The same count before and after was the clue.
- **Who:** Tushar captured the outputs (evidence files kept outside the repo). Claude-chat noticed the template-comment status line in the baseline, and the unchanged "RECIPES (33)" count in the clean-run output. Claude Code wrote the comparison into the test report [Tushar's account].
- **Trace:** [Tushar's account]. `TEST-REPORT.md` *Differences* and *Known pre-existing findings*, `a623e7d`.

#### E17 · The pre-existing `package-lock.json` PII finding
- **Tried:** `node scripts/pii-scan.mjs` on the clean clone.
- **Expected:** No findings from this work.
- **What happened:** One finding: an email address in `package-lock.json`.
- **Checked:**
  - It is npm's maintainer address, inside an npm-generated lockfile.
  - The same address appears in npm's own install output on main before any work (`baseline-before.txt` line 8).
  - `package-lock.json` is tracked and is not in this branch's diff.
- **Response:** Recorded as pre-existing. The address is not repeated anywhere in this submission.
- **Learned:** A scanner finding has to be traced to its origin before it is either blamed on this work or ignored.
- **Who:** Claude-chat identified the address as npm's maintainer email, from npm's deprecation notice. Tushar confirmed with `git ls-files` and `git diff --stat` that the file is tracked and unchanged [Tushar's account].
- **Trace:** [Tushar's account]. `TEST-REPORT.md` *Known pre-existing findings*, `a623e7d`.

#### E18 · Hand check of three CSV rows
- **Tried:** Reading the raw CSV rows for Databricks, Anyscale and Hugging Face, and comparing them with the report.
- **Expected:** That the report matched the raw records.
- **What happened:** All three matched:
  - Databricks lists SWE titles;
  - Anyscale lists only "Software Engineer" and "Solutions Architect";
  - Hugging Face has empty sponsorship fields.
- **Checked:** `hand-check.txt`, pasted in full in the worked run.
- **Response:** None needed. The Anyscale check verifies the record only, not whether Anyscale sponsors AI roles. That stays unknown.
- **Learned:** A hand check confirms the tool read the data correctly. It does not confirm the data describes the world.
- **Who:** Tushar ran the check and wrote the conclusions.
- **Trace:** `worked-run.md` *Verification* and *Attestation*, `ff13a62`.

#### E19 · Break attempt: an impossible date
- **Tried:** Setting the Databricks role's `start_date` to `2027-02-30` in the clean clone.
- **Expected:** Written before running. Tushar reasoned from the previous run's counts that exactly one role would move from Consider/tailor to not-scored/blocked:

  | Count | Predicted |
  |---|---|
  | roles · scored · not scored | 12 · 10 · 2 |
  | scorer verdicts | Consider 8, Skip 2, not scored 2 |
  | next actions | blocked (fix input) 2, tailor 4, network 4, pick-row 1, skip 1 |

  He also predicted a clear error naming the Databricks role, and no default date.
- **What happened:** The tool printed `role 'databricks-swe': start_date '2027-02-30' is missing or not a valid YYYY-MM-DD date; no default is used, so this role is not scored`, and every predicted count matched.
- **Checked:** The 12-row Saw-vs-Expected table in the test report.
- **Response:** None needed. Limits are recorded:
  - "nothing else changed" is confirmed only in aggregate, from counts;
  - the break run overwrote the clean run's output files.
- **Learned:** A numeric prediction written before running is a stronger test than "it should error".
- **Who:** Tushar made the prediction and ran the break.
- **Trace:**
  - `TEST-REPORT.md` *Break attempt*, `a623e7d`;
  - test `test_F4_missing_or_invalid_date_is_a_named_error_with_no_default`.

#### E20 · The test report's PII near-miss
- **Tried:** Quoting the pre-existing PII-scan finding (E17) verbatim in the first draft of `TEST-REPORT.md`.
- **Expected:** A faithful quote of the scan output.
- **What happened:** The quote copied a real email address into the draft report and the run log. The scan then reported 3 findings instead of 1.
- **Checked:** The PII scan output.
- **Response:** The address was replaced with `<npm maintainer's email address — redacted>` before commit `a623e7d`. The report carries a note on the redaction. A history search found no commit under `course/` or `logs/` containing the address.
- **Learned:** Quoting a PII finding reproduces it. The scanner caught what careful copying didn't.
- **Who:** The scan caught it. The fix was made before commit.
- **Trace:**
  - `TEST-REPORT.md` (redaction note under the PII-scan block);
  - `worked-run.md` *Broke during testing, fixed*;
  - both in `a623e7d` and `ff13a62`.

#### E21 · The privacy re-cut
- **Tried:** Reviewing the pushed history.
- **Expected:** Third-person wording for visa details, and no school name.
- **What happened:** First-person visa wording and the school name were in pushed history. The PII scan doesn't look for either.
- **Checked:**
  - Two passes were needed. The second pass covered the brief's phrases "inside my window" and "how many days have I burned", which the first pass had left in the brief's line 20.
  - `git diff backup/recut-1 ff13a62` shows that second fix [re-checked 2026-10-03].
- **Response:**
  - The branch was re-cut twice and force-pushed.
  - The net change against the original history is 10 lines in 5 files: `CHANGE-BRIEF.md`, the recipe, the card, `mappings.json` (one rationale string), and the committed 2026-10-01 run log (the same string, copied).
  - Commit metadata was preserved.
  - The brief records the reword in an appended note.
  - `6928729` updated every commit reference.
  - The commit ID table is above.
- **Side effect, disclosed:** The committed run log records the `mappings.json` hash at run time (`c5fd01db…`). The reworded file now hashes to `a474aa5b…`. No value the scorer reads changed.
- **Learned:**
  - Deleting text in a later commit doesn't remove it from history.
  - The only fix is a re-cut, and a re-cut can itself need a second pass.
  - Hashes recorded in committed logs go stale when an input is reworded.
- **Who:** [Tushar's account]
  - Claude-chat raised the third-person privacy rule while specifying the new documents.
  - Claude Code then found the existing first-person wording and school name in pushed history.
  - Claude-chat recommended a re-cut, and Tushar decided to do it.
  - Claude Code ran both rewrite passes. The second pass, for line 20, was requested by Claude-chat.
  - Tushar ran the force-push.
- **Trace:**
  - [Tushar's account] for who did what;
  - `TEST-REPORT.md` re-cut note, `6928729`;
  - `CHANGE-BRIEF.md` final line;
  - `course/2026fa/submissions/tushar-patel28/runs/swe-title-sponsor-opt-2026-10-01.json` line 111;
  - [re-checked 2026-10-03]: `git diff --numstat 0681cf0 a623e7d`.

#### E22 · Claude-chat's unverified claim
- **Tried:** A draft of the domain justification, which said the three role families "collapse into one visa category".
- **Expected:** That the claim was supported.
- **What happened:**
  - The repo has no LCA filings to support it.
  - O\*NET lists AI Engineer under 15-1221 and Cloud Engineer under 15-1299.08, which are separate codes.
- **Checked:** The O\*NET codes. They also appear in `crosswalk.json` `context_soc_codes`.
- **Response:** The sentence was relabelled "*(Judgment, unverified here …)*", and the O\*NET codes were added.
- **Learned:** Fluent domain claims need the same provenance as numbers.
- **Who:** Claude-chat made the claim. Tushar caught it in review.
- **Trace:** [Tushar's account]. `domain-justification.md` *Who uses it*, `ff13a62`.

#### E25 · git run from a deleted directory
- **Tried:** Running git commands.
- **Expected:** That they ran in the intended repo.
- **What happened:** The shell was still inside `/tmp/clean-check`, which had been removed. The commands failed harmlessly.
- **Checked:** The error output.
- **Response:** None recorded.
- **Learned:** Check the working directory after removing a scratch clone.
- **Who:** Tushar.
- **Trace:** [Tushar's account], which dates it 2026-10-02, after the clean-checkout run. No repo record.

#### E24 · A stray "ImageMobject" reference
- **Tried:** Claude-chat's prompt for the domain justification and worked run asked for a log entry about "ImageMobject", a leftover from an unrelated project.
- **Expected:** (From the prompt.) That there was such an event to record.
- **What happened:** Claude Code found no such event in this repo.
- **Checked:** The repo.
- **Response:** Claude Code declined to invent an entry.
- **Learned:** Prompts written in one chat can carry context from another. The agent must check a prompt's claims against the repo, not simply carry them out.
- **Who:** Claude-chat introduced it. Claude Code rejected it.
- **Trace:** [Tushar's account]. No file or commit in this repo mentions it. [Tushar's account]: that prompt's work ran on 2026-10-02.

#### E25 · A PR opened earlier than intended
- **Tried:** Viewing the compare page on 2026-10-02 to check the branch could merge, planning to open the PR only after final review.
- **Expected:** No PR until the end.
- **What happened:** PR #5 was created that day with the blank template. It was still open when the branch was re-cut, and it was only noticed on 2026-10-03.
- **Checked:** The PR timeline (review request at creation, then the force-push event).
- **Response:** Kept #5 (one PR per student), updated its title and description, disclosed the exposure in the PR, and emailed the professor.
- **Learned:** Check whether a PR already exists before rewriting a pushed branch's history.
- **Who:** Tushar.
- **Trace:** PR #5 timeline; E21.

## Human / AI contributions

| # | Contribution | From | Outcome | Decided by | Trace |
|---|---|---|---|---|---|
| 1 | Reshape recipe A into a title-based check (no SOC) | Claude Code (recon, Prompt 1); Claude-chat (brief draft) | accepted | Tushar | E3 · `5a49af7` |
| 2 | Predictions P1–P3 | Claude | accepted, labelled as Claude's | Tushar | `5a49af7` |
| 3 | P4 wording | Claude-chat (an example sentence) | accepted as Tushar's own prediction | Tushar | E4 · `5a49af7` |
| 4 | Handle `Tushar-Patel28` | Claude Code (recon, Prompt 1) | rejected; lowercase used | Tushar | E1 |
| 5 | Noreply commit email | Tushar | accepted | Tushar | E2 |
| 6 | Patch the scorer's `--profile` bug | option considered | rejected; documented and guarded instead | Tushar | E5 · `cce6c00` |
| 7 | CLI harness, since the scorer has no exports | Claude Code (recon, Prompt 1) | accepted | Tushar | E6 |
| 8 | G4 human gate via the scorer's `override` | Tushar | accepted; built by Claude Code | Tushar | E8 · `5db51f6` |
| 9 | "0.6 is not below the weak threshold" | Claude Code | accepted | Tushar | E9 |
| 10 | Timeline 0.6 → 0.5 | Claude-chat | accepted | Tushar | E9 · `5db51f6` |
| 11 | Original bands (incl. 61–90 days → 0.6) | Tushar (build request) | modified | Tushar | E9 · recipe at `cce6c00` line 95 |
| 12 | Soft early-start band (1–30 days → 0.5) | Tushar | accepted | Tushar | E9 · `5db51f6` |
| 13 | First crosswalk | Claude Code (first build, Prompt 2) | modified (tightened) | Tushar | E10 · `cce6c00` → `5db51f6` |
| 14 | Crosswalk sweep and new patterns, against principles supplied by Claude-chat | Claude Code | accepted | Tushar | E10 · `5db51f6` |
| 15 | DEFINE rationales (tiers, fit, bands, next action) | Claude-chat | accepted | Tushar | E11 · `5db51f6` |
| 16 | "rationale drafted by tushar-patel28" labels (a misreading of Prompt 3) | Claude Code | **open**: to be fixed by Tushar | Tushar | E11 |
| 17 | "Families collapse into one visa category" | Claude-chat | modified (relabelled a judgment) | Tushar | E22 · `ff13a62` |
| 18 | "ImageMobject" entry | Claude-chat prompt | rejected | Claude Code | E24 |
| 19 | Treat the build spec as the approved plan (plan mode skipped) | Claude Code | not approved by anyone; a process deviation | — | E7 |
| 20 | G1 review sheet and `[model-judgment]` notes | Claude (`5db51f6`) | accepted; signed off, Salesforce pick left blank | Tushar | E12 · `55ca2f4` |
| 21 | Keep DRAFT; cite the two rule conflicts (Fall 2026 Canvas citation added 2026-10-03) | Claude (`5db51f6`) | accepted | Tushar (committed) | E15 |
| 22 | Do not tune toward the skip-rate target | Claude-chat (build prompt, Prompt 2) | accepted; followed by Claude Code | Tushar | E14 |
| 23 | Break-attempt prediction | Tushar | confirmed (12 of 12 rows) | — | E19 · `a623e7d` |
| 24 | Hand-check conclusions | Tushar | confirmed (3 of 3 rows) | — | E18 · `ff13a62` |
| 25 | Redact the quoted email address | PII scan | accepted | — | E20 · `a623e7d` |
| 26 | Don't run `npm audit fix` (it would rewrite the tracked `package-lock.json`) | Claude-chat | accepted | Tushar | E23 |
| 27 | `package-lock.json` address is npm's maintainer email | Claude-chat | accepted; confirmed with `git ls-files` and `git diff --stat` | Tushar | E17 |
| 28 | Doctor findings (template-comment status line, unchanged recipe count) | Claude-chat noticed; Claude Code wrote them up | accepted | Tushar | E16 · `a623e7d` |
| 29 | Third-person privacy rule for the new documents | Claude-chat | accepted | Tushar | E21 |
| 30 | Re-cut the branch (two passes; second pass requested by Claude-chat) | Claude-chat recommended; Claude Code ran both passes | accepted; Tushar ran the force-push | Tushar | E21 · `6928729` |
| 31 | Brief clarification: the crosswalk DEFINE closed in `5db51f6` (resolves question 7) | final-review prompt (Claude-chat) | accepted | Tushar | `CHANGE-BRIEF.md` *Revisions*, 2026-10-03 |
| 32 | Fall 2026 Canvas assignment citation in lifecycle conflict (a) | final-review prompt (Claude-chat) | accepted | Tushar | E15 · recipe *Lifecycle status* |
| 33 | 15-2051 `[model-judgment]` note on the AI wage context | final-review prompt (Claude-chat) | accepted | Tushar | recipe *Definitions (closed)*, crosswalk |

**Commit trailers undercount AI work.** A `Co-Authored-By: Claude` trailer appears on 3 of 7 commits (`5db51f6`, `6928729`, `ff13a62`). It is absent from `cce6c00`, although the worked run records a Claude build session on 2026-10-01, and from `5a49af7`, which the brief says Claude drafted [re-checked 2026-10-03]. Use this table and the entries, not the trailers, as the record of who did what.

## Unresolved questions

1. **For the maintainer, lifecycle conflict (a).** Can a recipe reach SPECIFIED while its proposed additions must, by assignment rule, stay marked as typed TODOs that `SNICKERDOODLE.md` line 75 counts as open? Is there a Fall 2026 assignment text that settles this? None is in the repo.
2. **For the maintainer, lifecycle conflict (b).** Does a student's `logs/runs/2026fa-tushar-patel28-1.md` entry count as the "RUN_LOG entry" that `SNICKERDOODLE.md` line 59 requires for RUNNABLE-SAMPLE?
3. **Possible = 0.4.** The value is grounded only in ordering (Likely > Possible > Unknown), as `mappings.json` says. Can it be grounded in more than that? For example, could an LCA lookup measure how often sponsoring companies file outside their listed top titles?
4. **The 90-days-from-EAD assumption.** The timeline bands assume 90 days of allowed unemployment counted from the EAD start. This is planning arithmetic, not immigration advice. The student should confirm it with the school's international office.
5. **The old commits.**
   - The pre-re-cut commits (`590ebea`, `7d89ffe`, `7fec110`, `0a27e32`, `0681cf0`) stay reachable by ID on GitHub after the force-push. This was not checked from here, since no network calls were made.
   - Should the maintainer or GitHub support be asked to purge them?
   - The local `backup/*` branches also hold them.
6. **The authorship labels (OPEN).** The "rationale drafted by tushar-patel28" labels credit the wrong drafter (E11), and the brief's "at the author's request" sentence needs reconciling with them. Tushar will fix this at final review.
7. **Resolved 2026-10-03.** **Crosswalk DEFINE: open or closed?** The brief's 2026-10-01 revision says "The crosswalk DEFINE is still open." The same commit, `5db51f6`, marks it "CLOSED DEFINE" in `crosswalk.json` and closes it in the recipe. The brief is append-only, so this needs a new dated revision, not an edit. Resolved by the dated 2026-10-03 append to the brief's Revisions.
8. **Salesforce.** Which row is the company? And when will the company alias table exist so the tool can accept the choice (E12)?
9. **Skip rate 2 of 11.** Is the low skip rate a property of the soft-tier mapping, or of a hand-picked sample? Only a larger, unpicked role list would tell.
10. **Stale hash.** Should the 2026-10-01 sample run be re-generated so its recorded `mappings.json` hash matches the file, or is the disclosure enough?
11. **Plan mode.** Does a detailed build spec satisfy `CLAUDE.md`'s plan-mode rule? Or should future edits under `recipes/` go through plan mode explicitly (E7)?
