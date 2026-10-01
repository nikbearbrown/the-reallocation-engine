# SOURCES.md

## Executive summary

This document lists everything this submission is built on, and says who did
what. It covers the repository it was forked from, the rules it follows, the
data it reads, the software it runs on and their licenses, and an honest split
of the work between me (Om Raut) and Claude, the AI assistant I used to build
it.

Read it to check three things: that nothing here is borrowed without credit,
that no personal data or unapproved network access is involved, and that the
judgment calls in the build were made by a person, not by the assistant.

What it finds:
- Every data source and tool was used without modification.
- The one change I proposed to an existing file has not been applied.
- The only third-party Python package is one the repository already
  required.
- Claude investigated, built, tested and drafted the documents, including
  this one.
- I chose the persona and scope, set the instruction to try to break the
  build, chose which fix to keep and its value, and decided every commit.

## Repository and governing documents

- **Repository:** `nikbearbrown/the-reallocation-engine` (MIT License,
  copyright 2026 Nik Bear Brown; the book text is CC BY 4.0, per
  `LICENSE-BOOK-CC-BY-4.0.md`). Forked as `omraut888/the-reallocation-engine`.
  This branch, `contrib/2026fa-omraut888-ml-h1b-timeline`, is based on upstream
  `main` at `015843d5047dbadff05068495e4c5db5cd9945f4` ("fix(greenhouse-watch):
  justification lines now sum to the score"). That was still upstream `main`'s
  head when this was written.
- **Governing documents followed**, all unmodified:
  - `SNICKERDOODLE.md`: the constitution. Machines check conformance and
    people judge adequacy; every number needs a provenance chain; gates are
    hard stops cleared by a named person; meaningful runs are logged.
  - `DOMAIN.md`: the project index, covering layout and what is runnable.
  - `CONTRIBUTING.md`: contribution rules, including the limit of one
    deliberate patch to a maintained file, declared in the PR body.
  - `DATA_CONTRACT.md`: rules for data handling and the private/public split.

## Data sources

All of these are used read-only. The build never writes to any of them.

| Source | What it supplies | Status |
|---|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | H-1B approval and denial counts, approval rate, sponsored job titles, funding stage and amount, for 30,369 companies (1,557 with H-1B history) | upstream, tracked, used as-is, not modified |
| `search/examples/priya-nair/` (`profile.yml`, `resume.example.json`, `gaps.md`) | the fictional persona: OPT dates, unemployment days, target roles, and the hiring-loop lengths behind the timeline lag assumption | upstream, fictional, unmodified |
| `scripts/score/role-scorer.mjs` | the engine's scorer: Apply / Consider / Skip from role records | upstream, used unmodified through its command-line interface, never patched |
| `data/bls/compact/soc_occupation_compact.csv` | SOC 15-1252 wage row, cited only in the role-quality *proposal* | upstream, unmodified; the build does not read it |
| `resumes/priya-nair-cv.md` | the source of the `Smart E-Commerce` RAG project for the proposed persona addition | upstream, unmodified; the build does not read it |

**The one proposed patch is not applied.** The change brief proposes adding
the `Smart E-Commerce` RAG project from `resumes/priya-nair-cv.md` to the
persona's `resume.example.json`. That would be this contribution's one
allowed patch to a maintained file. It is still an open `[TODO: DATA SOURCE]`
in the change brief, and `search/` is byte-identical to upstream `015843d`.

## What Claude contributed vs. what I decided

The assistant was Claude (Anthropic), running as Claude Code in this
repository. Commits made during the debugging session carry a
`Co-Authored-By: Claude` line.

### Design and build

| Claude proposed, investigated or built | I (Om) decided |
|---|---|
| Read the real scorer code, the sponsorship CSV's schema and the existing personas before proposing any design | the domain and scope: ML/RAG H-1B triage on an OPT clock |
| Surveyed the four existing personas | chose Priya Nair, after confirming she fit |
| Proposed a `role_quality` weight of 0.15 with renormalized weights, then checked its own math: renormalizing raises every composite by 1.25× against a threshold calibrated for the old weights, and it would need a scorer patch | not to implement it; it stays documented as a proposal and an open decision |
| Built `build_roles.py` and its test suite (19 tests at first, 21 now), the recipe, the card, the change brief, the test report and the domain justification | reviewed each one before it was committed |

### The break attempt and the fix

| Claude proposed, investigated or built | I (Om) decided |
|---|---|
| Designed and ran the adversarial case: a copy of the CSV in which one ML company has 0 approvals and 2 denials. Found that it scored p = 0.699 and outranked Microsoft | set the general instruction to "try to break it", without specifying this case |
| Explained the flaw by hand: correct shrinkage formula, but a near-98% prior. Called it a bad design choice, not a logic bug | asked for that diagnosis before allowing any change |
| Implemented and measured each fix on the real data and on the break case: volume-weighted prior (0.7009), thin-record prior (0.703), fixed prior (0.2143). Reported that the first two didn't fix it | specified each fix to try, in order: volume-weighting with C held at 5 to isolate one change, then the thin-record prior, then a fixed 0.3 |
| Recommended against stopping after each failed fix, and named options: smaller C, fixed prior, tier cap | chose the fixed judgment prior and its value, 0.3; kept volume-weighting as the main prior; reverted the thin-record prior |
| Noticed the counts that look doubled (no company with exactly 1 decision, every thin record even) | not to investigate it mid-build; record it as an unresolved observation |
| Pointed out that the scorer already holds the Unknown tier at Consider, so a "cap Unknown at Consider" next step would change nothing. Rewrote the next step as a Skip gate | accepted the rewrite, after seeing the full file |
| Caught its own reporting error: the original prior on the real data was 0.9792, not 0.9786 | required an appended log correction instead of edits to earlier entries |
| Found that the hook scripts fail with "Permission denied": they were committed without execute permission upstream, not changed in this session | not to change them yet |

### Wording and commits

- **Wording:** Claude drafted the prose of every document in this submission,
  including this one. I set what each document had to say and reviewed every
  full draft before committing. I directed specific changes, for example:
  - put the break-and-fix story in the executive summary;
  - present worked-run-4 as canonical and the earlier runs only as rejected
    attempts;
  - state plainly that the fixed prior was never exercised on real data;
  - add a note that the test transcript predates the warning fix, rather than
    cleaning the transcript.
- **Commits:** every commit and push was made only on my instruction, with
  the files and commit message I specified. Superseded runs (worked-run-1 to
  3) were kept on disk and out of the commit at my direction.

## Third-party software and licenses

| Software | Used for | License | Added by this submission? |
|---|---|---|---|
| Node.js 18+ and npm | running `role-scorer.mjs` and the repository's npm scripts | MIT (Node.js) | no; `package.json` is unmodified |
| npm packages in the repository's `package.json` | the repository's own tooling | per each package | no; none added. A local `package-lock.json` change is not part of this submission |
| Python 3 standard library: `argparse`, `ast`, `csv`, `datetime`, `json`, `re`, `sys`, `pathlib`, `subprocess`, `tempfile`, `unittest` | the build script and its tests | PSF License | no |
| PyYAML (6.0.2 installed) | `build_roles.py` reads the persona's `profile.yml` | MIT | no; the repository's conformance check already requires it (`scripts/conformance.mjs` runs `import yaml`) |

**Correction to the original brief:** `build_roles.py` is *not* standard
library only. It imports `yaml` (PyYAML) to read the persona file. PyYAML is
the only third-party Python package in this submission, and it is not new to
the repository. The tests use only the standard library plus `build_roles`.

## What is NOT in this submission

- **No personal data.** There is no real résumé, contact information,
  application history or other personal record; the only persona is the
  fictional Priya Nair. `npm run doctor` reports no private path tracked. The
  one raw CSV row reproduced in the worked run leaves out the company's phone
  number and executive and board names.
- **No modification to a maintained file.** The only patch this
  contribution may make, the persona addition, is proposed and not applied.
  This branch changes no pre-existing file. Its run log is `logs/runs/2026fa-omraut888-1.md`, inside
  this contribution's own namespace.
- **No network calls in the committed prototype.** `build_roles.py` and its
  tests import no network library. The test report shows the build completing
  with sockets disabled. The one networked step, ATS-presence detection
  (`scripts/ats/detect-ats.py`), is gated behind a live-network approval that
  has not been requested or granted. Every role is marked
  `liveness_checked: false`.
