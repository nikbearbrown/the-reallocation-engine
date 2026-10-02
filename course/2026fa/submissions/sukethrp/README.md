# sukethrp — The Reallocation Engine, Recipe Design Assignment (INFO 7375, Fall 2026)

## Executive summary

This folder is one student's submission for the Reallocation Engine recipe assignment. The recipe helps
an international master's student on F-1, graduating in December 2026 and looking for new-grad ML/AI
engineering jobs, see something job boards do not show. The question is not whether a company has
sponsored work visas, but whether its record includes ML/AI job titles with no seniority or level
attached.

A working prototype checks each posting against the engine's real sponsorship file, confirms the posting
is live, and hands only fully checked roles to the engine's scorer. It then suggests where the week's
hours go. It never guesses: anything it cannot verify is held for a person, with the reason.

On the engine's data, only 27 of 30,369 companies pass the strictest test. Eight real postings were
checked live on 30 September 2026:
- **The first two runs** suggested one application (AppLovin) and one networking question first
  (Moloco). Those results rested on fit and timeline numbers guessed from job titles.
- **Then the postings were read.** Six of the eight ask for 2–12+ years of experience or explicitly
  exclude new graduates. Three leading AI employers are absent from the data altogether.
- **With the unsupported numbers withdrawn**, the latest run holds all eight for a person and scores
  none. See [the posting review](POSTING-REVIEW.md) and [run 3](runs/worked-run-3-reviewed/sponsor-match-report.md).

The work was written with AI assistants (Claude Code built it; Codex later reviewed the postings), and
`SOURCES.md` says exactly who did what. The student made the decisions, re-ran the checks and signed
the attestation. What is left for them is listed at the end.

## Where everything is

| Deliverable | Path |
|---|---|
| Change brief (predictions, written before any code) | [`CHANGE-BRIEF.md`](CHANGE-BRIEF.md) |
| Recipe (for the agent) + card (for the person) | [`recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md`](../../../../recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md) · [`.card.md`](../../../../recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.card.md) |
| Prototype, tests, fixtures | [`scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/`](../../../../scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/) |
| Domain justification (≤ 1 page) | [`DOMAIN-JUSTIFICATION.md`](DOMAIN-JUSTIFICATION.md) |
| Worked run (real output, verified vs. inferred, the student's signed attestation) | [`WORKED-RUN.md`](WORKED-RUN.md) · raw files in `worked-run/` and `runs/worked-run-{1,2}-live/`, `runs/worked-run-3-reviewed/` |
| Posting review (the eight postings' actual requirements, read by Codex) | [`POSTING-REVIEW.md`](POSTING-REVIEW.md) · sources and text hashes in `evidence/codex-review-2026-09-30/` |
| Test report (clean checkout, failure cases, break attempts, scope, privacy scans) | [`TEST-REPORT.md`](TEST-REPORT.md) · raw files in `evidence/clean-checkout/` |
| Run-log entry | [`logs/runs/2026fa-sukethrp-1.md`](../../../../logs/runs/2026fa-sukethrp-1.md) |
| Proposed additions + engine defects found | [`PROPOSED-ADDITIONS.md`](PROPOSED-ADDITIONS.md) |
| Sources and who did what | [`SOURCES.md`](SOURCES.md) |
| Frictional log | [`FRICTIONAL.md`](FRICTIONAL.md) |
| Getting-started runs (step 4 of the assignment) | `evidence/getting-started/`, `runs/role-scores.{json,md}` |
| Title-rules audits (v0.1.0 → v0.2.0) | `evidence/rules-audit-v0.1.0/`, `evidence/rules-audit-v0.2.0/`, `evidence/rules-v0.1.0-to-v0.2.0-tier-changes.txt` |

## Run it (from the repo root, after `npm install`)

```bash
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py
```

```bash
python3 -m unittest discover -s scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/tests -v
```

```bash
python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --roles course/2026fa/submissions/sukethrp/worked-run/queue-live-1.json --out-dir output/worked-run-again --live
```

The first two are offline. The third needs `npx playwright install chromium` once, and fetches only
Greenhouse, Lever and Ashby hosts.

## Status

- Recipe lifecycle: **RUNNABLE-SAMPLE**. The sample run completes and conformance passes. On 2026-10-02 the
  student recorded reading the sample report, the rules audit and the posting review (see the run log).
  The same day they re-ran four checks themselves and signed the worked run's attestation. The recipe's
  `attestation` field stays `null`, because the lifecycle sets it only at VERIFIED.
- Tests: 36/36 offline on a clean checkout. The branch-history privacy scan is clean. The working-tree
  scan and the course's Contrib Gate CI fail for reasons that ship with the engine; `TEST-REPORT.md`
  explains both.

## Still the student's to do

The pending items are listed in [`SOURCES.md` → "Still to be done by the student"](SOURCES.md):
- ~~read the audits; decide the title rules, the fit/timeline numbers and the decision table~~ (done
  2026-10-02: rules v0.2.0 kept; all eight postings held, Scale AI investigated first);
- ~~re-run the tests; sign the attestation~~ (done 2026-10-02);
- ~~write the reflection, the Frictional entries and the SOURCES note~~ (done 2026-10-02);
- give the presentation.
