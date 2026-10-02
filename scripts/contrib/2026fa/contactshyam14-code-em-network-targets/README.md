---
owner: contactshyam14-code
term: 2026fa
component: em-network-targets
status: prototype — runs on the repository's shipped sample data only
promoted_to: null
---

# em-network-targets — "network, don't apply"

## Executive summary

This is a small, offline prototype for an engineering-management graduate on a twelve-month work permit who needs an employer willing to sponsor a work visa. It takes companies whose public record shows they have sponsored project-management or production-management job titles, checks a person's or a script's record of whether a matching job is open right now, and sorts each company into one of four groups: talk to them first (they sponsor this kind of role, nothing is open), apply (a matching job is open), check the job board first (no usable check yet), or skip.

It does not make the decision itself. It hands the evidence to the repository's existing decision tool and only sorts that tool's verdicts. Every value it shows is labelled as a record, the person's own input, or a model judgment, and it stops — writing nothing — when an input is unusable, such as a work-permit end date that has already passed.

## Run it (from the repository root)

```bash
node scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.mjs --as-of 2026-10-02 --liveness scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/liveness.2026-10-01.json --out-dir course/2026fa/submissions/contactshyam14-code/runs/05-corrected-opt-dates
```

Defaults when a flag is left out: persona `inputs/persona.shyam.json`, liveness `inputs/liveness.json` (empty — every company is held), as-of = today's local date, output `course/2026fa/submissions/contactshyam14-code/runs/latest/`. Node 20+; no npm install needed beyond the repository's own; no network.

## Test it (offline, fixtures only)

```bash
node --test scripts/contrib/2026fa/contactshyam14-code-em-network-targets/network-targets.test.mjs
```

21 tests. They run the CLI as a black box into a temp directory and read what it wrote. The scorer they exercise is the real `scripts/score/role-scorer.mjs`; nothing here re-implements it. One test pins upstream behaviour (a missing liveness gate is treated as open) so a change to the scorer is noticed.

## What it reads

| Input | Path | Label of its values |
|---|---|---|
| 80 Days company table | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | record |
| BLS/O*NET compact file | `data/bls/compact/soc_occupation_compact.csv` | record (titles used as match vocabulary) |
| SEC Form D samples | `data/sec/form-d/processed/sample/*.sample.json` | record |
| Persona: dates, targets, keywords, rules | `inputs/persona.shyam.json` | your-input |
| Liveness observations | `inputs/liveness*.json` | record (repo script + saved output) · your-input (a person) · your-input (a board a person confirmed) · model-judgment (an AI, or an unconfirmed board) |

Board evidence for the worked run came from the repository's scanner, not from this tool:

```bash
REALLOCATION_ENGINE_PORTALS=scripts/contrib/2026fa/contactshyam14-code-em-network-targets/inputs/portals.network-targets.yml node scripts/ats/scan.mjs --dry-run
```

## What it writes (into `--out-dir` only)

| File | Reader |
|---|---|
| `network-targets.json` | agent log: every value with its label and source row, input SHA-256s, gate states, data checks, scorer command and output |
| `network-targets.md` | human report: executive summary, gates waiting for a person, the four groups with next actions, data warnings, verified vs inferred, what it cannot tell you |
| `roles.json` | the scorer input this tool built |
| `role-scores.json`, `role-scores.md` | written by the repository scorer (absent when nothing could be scored) |

The output directory must be inside `course/2026fa/submissions/contactshyam14-code/` or this folder; a path outside the repository may also be in the OS temp directory (that is what the tests use). Anything else is refused (exit 2), so no tracked file can be overwritten — including when the repository itself has been unzipped into the temp directory.

## Where it stops (exit 3, nothing written)

- OPT end date on or before the as-of date; an OPT start date not before the end date; no days left under the 90-day unemployment limit (when the persona supplies days used — counted from the OPT start if it hasn't started yet).
- A target SOC code with no row in the BLS/O*NET file.
- The company table lacks a required column, or a row's field count differs from the header.
- Persona or liveness file missing, unparseable, or missing a required field.

Exit 4 means the scorer failed or its output changed shape. Companies with no usable liveness observation (none, stale, dated after the as-of date, `unchecked`) are **held** — never sent to the scorer, because the scorer treats a missing gate as open.

## Rules that are the person's own input (edit them in the persona, not the code)

- OPT start and end dates (the end is an assumption until the EAD's "Card Expires" date is entered) and unemployment days used.
- Title keywords per SOC code, including which ones are ambiguous ("program manager").
- `bls_title_rows`: `primary` uses only the SOC's `.00` O*NET row; `all` also uses sub-occupations (run 01 used `all` and pulled in eight software-QA titles as "production manager").
- Tier rule: Proven = an unambiguous title match, approvals ≥ 10 and approval rate ≥ 90%; Likely = approval rate ≥ 50% (ambiguous-only matches are capped here); otherwise Possible. Tier → scorer number: 0.9 / 0.6 / 0.3.
- Hiring lag: 45 days to apply, 75 days on the networking path; timeline factor = min(1, days available / lag).
- Networking tiers (Proven, Likely); liveness older than 7 days is stale; "recent funding" = within 24 months.

## Known limits

Sample data only; no fit assessment; no live board crawling; title-to-SOC matching is an inference; counts in the source table look doubled; some sponsorship records are attached to the wrong company upstream. The recipe lists these in full.
