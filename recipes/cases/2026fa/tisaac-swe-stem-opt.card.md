# SWE STEM-OPT Runway — human card

**Audience:** an F-1 Information Systems student starting a 3-year STEM OPT, deciding which software-engineering postings (SWE, software development, DevOps, test/QA) are worth a tailored application this week.  
**Agent twin:** `recipes/cases/2026fa/tisaac-swe-stem-opt.md`  
**Status:** DRAFT — six planned pieces are still open; four hard stops are checked by you, not the machine.

## Purpose

Answer, for each posting on your list: has this company sponsored H-1B workers before, or recently raised money — according to the repository's own file, not a chatbot's guess? Then pass the labeled evidence to the existing scorer for Apply / Consider / Skip. With a 3-year runway, a company missing from the file is marked "not found", not punished.

## What it can verify

- Whether the company name is in `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (exact match, case-insensitive), and that row's `Total Approvals` and `total_funding`.
- Whether the posting URL is on a supported ATS domain (`greenhouse.io`, `lever.co`). Anything else is `-1` (cannot parse) and is skipped.
- The scorer's arithmetic for every role, shown term by term with each term's label.
- That a missing input stops the run instead of being filled in (the offline test proves it).

## What it cannot verify

- **Whether the posting is still open.** Offline, every ATS URL is assumed live (`your-input`). You must run `npm run ats:liveness -- <url>` before applying.
- **What the job description says** — including "US citizens only" or "no sponsorship". You read the JD.
- **Fit.** It is your own number in the fixture.
- Whether *this* role will sponsor; the file only shows the company's history.
- A hiring freeze.
- Name variants: "Google" vs "Google LLC" shows up as `no-matched`.

## Dependencies

- Node 20+ (tested on v24.13.0). No Python, no network.
- `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (shipped with the repo)
- `scripts/score/role-scorer.mjs` (reused, not modified)
- For the liveness gate only: `scripts/ats/check-liveness.mjs` (Playwright; makes network calls — run it yourself)

## Annotated commands

Sample run (expected: 3 roles → Apply 2 · Consider 0 · Skip 1; a `-1` warning for the non-ATS URL; a `no-matched` line for the two invented companies):

```bash
node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js
```

Offline test (expected: `9 passed, 0 failed`, exit 0):

```bash
node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.test.mjs
```

Your own list, written somewhere other than the tracked sample outputs:

```bash
node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js --fixture <your-jobs.json> --out-dir <a folder you own>
```

Liveness gate, once per Apply / Consider role (expected: exit 0 if the posting is active, 1 if expired or uncertain):

```bash
npm run ats:liveness -- <job-url>
```

## What it produces

- `my-roles.json` — every term with its label: `record`, `model-judgment`, or `your-input`.
- `role-scores.json` — the scorer's log for an agent.
- `role-scores.md` — your report: skip rate, one row per role, a term-by-term audit.
- A console line listing every `no-matched` company.

## Named failure modes

1. **Name-match miss** — the posting says "Acme" and the file says "ACME CORP"; the company gets `no-matched` and sponsorship 0, which looks the same in the score as a company that truly never sponsored. Hardest to catch for the student, because the report still says Apply or Skip with confidence. Check: look up every `no-matched` name by hand.
2. **Assumed liveness read as real** — an ATS URL scores `1.0` without being opened. A ghost posting gets a tailored application. Check: G1, `npm run ats:liveness`.
3. **A ban treated as a score** — if a sponsorship ban is ever folded back into `fit`, a role you cannot legally take lands in Consider instead of Skip. It is a gate (G3), not a vote.
4. **Apply on self-reported fit alone** — in the sample run, the invented company reaches Apply at exactly the 0.30 threshold with sponsorship 0, entirely from your own `fit = 1.0`. The skip rate is 33%, below the ~50% a healthy run skips. Check: be honest with `fit`; an Apply that rests only on `your-input` terms is a lead, not evidence.
