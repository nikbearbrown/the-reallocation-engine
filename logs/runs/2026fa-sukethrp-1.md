# 2026fa-sukethrp-1 — ml-newgrad-sponsor-match runs

## Executive summary

The role-level sponsor-match recipe was run three ways by Claude Code on the student's machine. The
student then re-ran the key checks themselves.
- **Offline sample:** on the illustrative queue, against the real sponsorship file.
- **Rules audit:** over all 30,369 companies.
- **Live, twice:** on eight real ML/AI postings for a fictional pre-OPT persona.
- **The student's re-run, 2026-10-02:** the tests, the sample, one break attempt and one sponsorship row.

The runs completed. Every held role names the check a person must do. One application and one networking
question came out of the live queue, and six roles need a person first. On 2026-10-02 the student
recorded reading the sample report and the audits, which moved the recipe to RUNNABLE-SAMPLE, and decided
the eight postings (gate G8): all held, Scale AI investigated first. They then re-ran four checks and
signed the attestation.

## Run record — sample (offline)

- **Date / run id:** 2026-09-30 · `2026-09-30-sample-66a96129`, clean checkout of `fe07d1b`
- **Recipe:** recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md v0.1.0 · rules v0.2.0
- **Mode:** sample · **as_of:** 2026-09-30
- **Inputs:** queue `scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/fixtures/sample-roles.json` · persona `search/examples/priya-nair/profile.yml` (fictional) · sponsorship file sha256 `eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270` (pinned: yes)
- **Command:** `python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py`
- **Outputs:** `output/sukethrp-ml-newgrad-sponsor-match/2026-09-30-sample/` (gitignored). Copy of the report: `course/2026fa/submissions/sukethrp/evidence/clean-checkout/06-sample-run-report.md`
- **Result:** evaluated 11 · held 6 (no-h1b-record 2, no-company-match 1, ambiguous-company-match 1, liveness-uncertain 1, no-timeline-factor 1) · scored 5 (Apply 1 · Consider 3 · Skip 1) · actions TAILOR 1, NETWORK-FIRST 2, CONSIDER 1, SKIP 1, RESOLVE 6
- **Gates:** G1 pass · G2 pass · G7 pass · G8 open

## Run record — rules audit

- **Command:** `python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --audit-rules --out-dir course/2026fa/submissions/sukethrp/evidence/rules-audit-v0.2.0 --overwrite`
- **Result:** 30,369 rows · tiered 1,552 · held 28,817 · Proven 27 · Likely 1,525 · 21 unmarked ML/AI titles · 69 companies carry a record shared with a differently named company. Before/after vs. rules v0.1.0 (33 Proven): `course/2026fa/submissions/sukethrp/evidence/rules-v0.1.0-to-v0.2.0-tier-changes.txt`

## Run record — live, worked runs 1 and 2

- **Date / run id:** 2026-09-30 · run 1 at commit `d3ef7be` (01:26 UTC), run 2 at `fe07d1b` (01:33 UTC)
- **Recipe:** v0.1.0 · rules v0.2.0 (sha256 `96507d9f5a90…`)
- **Mode:** live · **as_of:** 2026-09-30
- **Inputs:** queue `course/2026fa/submissions/sukethrp/worked-run/queue-live-1.json` (sha256 `38a030669592…`), eight real postings from the engine's scanner · persona `search/examples/arjun-rao/profile.yml` (fictional) · sponsorship file pinned as above
- **Command:** `python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py --roles course/2026fa/submissions/sukethrp/worked-run/queue-live-1.json --out-dir course/2026fa/submissions/sukethrp/runs/worked-run-<n>-live --live`
- **Outputs:** `course/2026fa/submissions/sukethrp/runs/worked-run-1-live/` and `…/worked-run-2-live/` (report, log, roles.json, role-scores.json/.md). Terminal output: `worked-run/terminal-live-1.txt`, `terminal-live-2.txt`
- **Network:**
  - four first hops, redirects off: AppLovin 200, Nextdoor 302 → about.nextdoor.com, Databricks 302 → databricks.com, Moloco 200;
  - one liveness check, `scripts/ats/check-liveness.mjs`, on the two postings that stayed on Greenhouse: both `active`.
- **Result:** evaluated 8 · held 6 (redirects-off-allowed-host 2, shared-h1b-record 1, no-company-match 3) · scored 2 (Apply 1 · Consider 1) · actions TAILOR 1 (AppLovin), NETWORK-FIRST 1 (Moloco), RESOLVE 6 · identical in both runs
- **Gates:** G1 pass · G2 pass · G7 pass · G8 open for these two runs. Decided by the student on 2026-10-02 against run 3's reviewed inputs: see `2026fa-sukethrp-2.md` and the decision table in `course/2026fa/submissions/sukethrp/WORKED-RUN.md`
- **Audits read:** the sample report (`evidence/clean-checkout/06-sample-run-report.md`), the title-rules audit (v0.2.0) and the posting review, read by Suketh Reddy Produtoor (the student), reported 2026-10-02. This is the human half of SPECIFIED → RUNNABLE-SAMPLE.
- **Open issues:**
  - fit and timeline values were proposed by Claude from titles only;
  - Moloco's posting is an expression-of-interest pool that liveness cannot distinguish from an opening;
  - the three frontier-AI employers are absent from the sponsorship file;
  - run 1's report mis-described PathAI's shared record (fixed in `fe07d1b`; run 2 correct).

## Run record — the student's re-run and attestation (2026-10-02)

- **Operator:** Suketh Reddy Produtoor (the student), in their own terminal. They pasted the output into
  the chat; Claude Code saved it as `course/2026fa/submissions/sukethrp/evidence/student-rerun-2026-10-02/terminal.txt`,
  with the shell prompts and the CSV row's personal columns removed.
- **Commit:** `d1110ea`, working tree clean (the existing checkout, not a fresh clone) · recipe v0.1.0 · rules v0.2.0
- **Results:**
  - offline tests: 36, OK;
  - sample: 11 roles → held 6 · scored 5 (Apply 1 · Consider 3 · Skip 1), the recipe's expectation;
  - deliberate break with `fixtures/BROKEN-authorization-profile.json`: STOP at the scorer-contract gate, run VOID;
  - `sed -n '1956p'` on the pinned sponsorship file: AppLovin's 130 approvals, 2 denials, 98.48% approved,
    $150,000 company median and "Machine Learning Engineer", the values in the report's AppLovin row.
- **Attestation:** signed by the student on 2026-10-02 in `course/2026fa/submissions/sukethrp/WORKED-RUN.md`,
  covering these four checks. The recipe and its scripts are unchanged since `d1110ea`. The recipe's
  `attestation` field stays null until VERIFIED.
