# SOURCES — what this submission is built on, and who did what

## Executive summary

This page credits everything the submission rests on — the repository and its rules, the sample data, the scripts and services used, and the tools — and states plainly what the AI assistant did versus what the student decided, checked and changed. In short: the AI wrote the code and drafted the documents at the student's direction; the student chose the design and his situation, corrected the one fact everything depended on (his work-permit dates), checked the results himself, and signed off. Nothing here is presented as checked unless someone checked it.

## The repository and its licenses

- **The Reallocation Engine** — https://github.com/nikbearbrown/the-reallocation-engine, forked at upstream commit `015843d` to https://github.com/contactshyam14-code/the-reallocation-engine.
- Code: MIT License © 2026 Nik Bear Brown (`LICENSE`). Book content: CC BY 4.0 © 2026 Nik Bear Brown / Bear Brown, LLC (`LICENSE-BOOK-CC-BY-4.0.md`). 80 Days to Stay data: MIT License © 2025 Nik Bear Brown (`data/80-days-to-stay/LICENSE`).

## Governing documents and models followed

- `SNICKERDOODLE.md` (labels, gates, lifecycle, attestation format, P9 executive summaries), `DOMAIN.md` (known gaps), `CONTRIBUTING.md` and `scripts/contrib/README.md` (namespaces, branch name, one PR), `DATA_CONTRACT.md` §Zero-Conditions (no personal data), `recipes/README.md`, `recipes/_shared.md` (the run-log template).
- Style models: `recipes/scan.md`, `recipes/local-wage-adjustment.md`, `recipes/local-wage-adjustment.card.md`.
- Book chapters read for the method: `book/chapters/07-who-sponsors-the-80-days-sponsorship-scorer.md` (tiers; its own note that tier thresholds are not pinned), `book/chapters/08-is-the-job-real-ats-detection-and-liveness.md`, `book/chapters/11-the-bayesian-role-scorer.md`.
- The repository's agent instructions (`AGENTS.md`, `CLAUDE.md`), which required plan mode before editing under `recipes/`; the plan was approved by Shyam before the recipe and card were written.
- The 3-3-2 framing comes from the course assignment and Nik Bear Brown's essay *The 3-3-2 Split*. No figure from the essay is cited in this submission.

## Data (sample data only, as shipped at `015843d`)

| Data | Path | Fingerprint / note |
|---|---|---|
| 80 Days to Stay company table | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | SHA-256 `eccdee2a…` — identical to the file described in `data/80-days-to-stay/data/SEC_DOL_H1b_data_mapped-audit.md` |
| BLS/O*NET compact | `data/bls/compact/soc_occupation_compact.csv` | SHA-256 `bac5acf7…` |
| SEC Form D samples | `data/sec/form-d/processed/sample/companies-sec-{2025q2,2025q3,2025q4,2026q1}-d.sample.json` | 200 filings (first 50 per quarter); full quarters are not in a fresh clone |

Fixtures under `scripts/contrib/2026fa/contactshyam14-code-em-network-targets/fixtures/` are fictional companies on `example.com`, except three BLS/O*NET rows copied verbatim from the compact file.

## Repository scripts used, unmodified

`scripts/score/role-scorer.mjs` (every Apply / Consider / Skip decision), `scripts/ats/scan.mjs` with its Greenhouse, Lever and Ashby providers (board evidence), `scripts/conformance.mjs`, `scripts/manifest-check.mjs`, `scripts/doctor.mjs`, `scripts/pii-scan.mjs`.

## External services contacted

- Public job-board APIs `boards-api.greenhouse.io`, `api.lever.co`, `api.ashbyhq.com` — on 2026-10-01 through the repository's scanner and a probe script written by Claude for research (`evidence/board-probe.mjs`; output saved). The prototype itself makes no network calls.
- The IEX, Genies and Senti job-board pages, opened by Shyam in his browser on 2026-10-02.
- GitHub, through the GitHub CLI: fork, branch push, pull request #4.

## Tools

Windows 11 · Node v22.12.0 · Python 3.12.5 (behind a `python3` shim outside the repository) · Git 2.47.1 with Git Bash · GitHub CLI 2.94.0 · the Claude desktop app (Code tab).

## Collaborators

- **No human collaborators.**
- **AI:** Claude (Anthropic), model Claude Opus 5.5, used in the Code tab of the Claude desktop app, including one helper sub-agent that read the repository's documentation and summarized it. Every commit on the branch carries a `Co-Authored-By: Claude` line.
- An earlier, separate Claude session worked on the same assignment. Its files were found untracked in the submission folders and moved out of the repository at Shyam's request; **nothing from it is in this submission** (FRICTIONAL entry 19).

## Facts used but not verified against a primary source

- The OPT rules the timeline relies on — the 90-day unemployment allowance counted from the OPT start, the H-1B registration normally held in March, and the STEM OPT filing window — come from the student's understanding and Claude's general knowledge. They were **not** checked against USCIS or DHS sources and are labelled "to confirm with the DSO" wherever they appear. The visa-path gate (G4) is deliberately unsigned.
- The OPT end date (2027-12-30) is an assumption — start + 12 months − 1 day — until the EAD card's date is entered.

## What the AI did, and what Shyam decided, checked, changed or rejected

| | |
|---|---|
| **Claude (AI) did** | Explained the assignment and proposed four designs; set up the repository and fixed the Windows environment outside it; explored the data and found the all-even counts and the shared sponsorship records; wrote all prototype code, tests and fixtures; drafted every document, including the CHANGE-BRIEF predictions, except Shyam's first-person FRICTIONAL answers (he wrote those; one sentence came from an example Claude gave him and one was lightly polished); ran every command except Shyam's own check; probed and scanned the job boards; made the commits, and — after Shyam said "finish this task" — created the fork, pushed the branch and opened the pull request |
| **Shyam decided** | The design ("network, don't apply"); his situation (MS Engineering Management, 12-month OPT, SOC 13-1082 and 11-3051); where the work lives; to have Claude draft the predictions for him; the lifecycle claim (approved the recommendation to claim RUNNABLE-SAMPLE with the conflict disclosed); to publish; to sign off the sample run; to move the other session's files out of the repository; what to say in his first-person FRICTIONAL answers |
| **Shyam checked** | Ran the 20 tests himself (all passed, at `c0bceb8`); ran the tool into his own folder (`runs/06-shyam-check`) and got the same result; read his report; matched IEX Group's raw-data row against it; opened the IEX, Genies and Senti boards and confirmed the IEX posting and both boards' identity |
| **Shyam changed** | His OPT date: December 2026 is the start, not the end — which reversed the H-1B timing story (CHANGE-BRIEF Revision 1) |
| **Shyam rejected** | Part of the tool's output: Genies does not fit the manufacturing/operations roles he wants (his FRICTIONAL answer 3). He also replaced Claude's draft of his FRICTIONAL answers with his own words |
