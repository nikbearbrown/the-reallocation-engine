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

On the engine's data, only 27 of 30,369 companies pass the strictest test. On eight real postings
checked live on 30 September 2026:
- one earned an application;
- one earned a networking question first;
- six needed a person first. Among them, three leading AI employers turned out to be absent from the data.

The work was written with an AI assistant; `SOURCES.md` says exactly who did what. Several decisions
are still the student's to make, listed at the end.

## Where everything is

| Deliverable | Path |
|---|---|
| Change brief (predictions, written before any code) | [`CHANGE-BRIEF.md`](CHANGE-BRIEF.md) |
| Recipe (for the agent) + card (for the person) | [`recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md`](../../../../recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md) · [`.card.md`](../../../../recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.card.md) |
| Prototype, tests, fixtures | [`scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/`](../../../../scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/) |
| Domain justification (≤ 1 page) | [`DOMAIN-JUSTIFICATION.md`](DOMAIN-JUSTIFICATION.md) |
| Worked run (real output, verified vs. inferred, attestation draft) | [`WORKED-RUN.md`](WORKED-RUN.md) · raw files in `worked-run/` and `runs/worked-run-{1,2}-live/` |
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

- Recipe lifecycle: **SPECIFIED** (zero open items). It becomes **RUNNABLE-SAMPLE** once the student
  records reading the sample report and the rules audit. `attestation: null`.
- Tests: 36/36 offline on a clean checkout. The branch-history privacy scan is clean. The working-tree
  scan and the course's Contrib Gate CI fail for reasons that ship with the engine; `TEST-REPORT.md`
  explains both.

## Still the student's to do

The pending items are listed in [`SOURCES.md` → "Still to be done by the student"](SOURCES.md):
- review the predictions, the drafted title rules, and the fit and timeline numbers;
- fill in the decision table;
- re-run the tests and sign the attestation;
- write the reflection and the Frictional entries;
- give the presentation.
