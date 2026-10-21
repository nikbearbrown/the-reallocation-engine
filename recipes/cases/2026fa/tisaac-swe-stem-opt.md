---
status: DRAFT
todos_open: 6
last_gate: null
attestation: null
recipe_version: 0.2.0
---

# SWE STEM-OPT Runway — Sponsorship lookup with honest gates

## Executive summary

**What it does.** For an F-1 Information Systems student about to start a 3-year STEM OPT, targeting software engineering roles (SWE, software development, DevOps, test/QA), this recipe takes a short list of job postings and asks one question per posting it can actually answer from local data: *has this company sponsored H-1B workers before, or recently raised money?* It looks each company up in the repository's sponsorship-and-funding file, labels every number by where it came from, and hands the list to the repository's existing scorer for an **Apply / Consider / Skip** recommendation.

**Who it's for.** A student whose 3-year runway means sponsorship is a bonus, not a requirement — so a company that is missing from the sponsorship file should not be punished, only marked as "not found."

**What it decides, and what it does not.** It decides which postings deserve a tailored application today, which need a networking step first, and which to skip. It does **not** yet read job descriptions, check whether a posting is still open, or score location, salary, or remote work. Those values are the student's own assumptions, labeled that way, and four hard stops require a person to check them before any application goes out. This recipe is a draft: six planned pieces are still open, listed under *Proposed additions*.

## Technical header

| Field | Value |
|---|---|
| Recipe | `recipes/cases/2026fa/tisaac-swe-stem-opt.md` v0.2.0 |
| Card | `recipes/cases/2026fa/tisaac-swe-stem-opt.card.md` |
| Prototype | `scripts/contrib/2026fa/tisaac-swe-stem-opt/` |
| Engine layer | 80 Days to Stay (sponsorship + funding); Job-Ops (liveness, human-run) |
| Mode | sample, offline (fixture of 3 jobs) |

## Purpose and source inventory

| Source | Path or command | Used for | Label it produces |
|---|---|---|---|
| Sponsorship + funding file | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` (columns `company_name`, `Total Approvals`, `total_funding`) | sponsorship vote | `record`, or `your-input` when the company is absent |
| Job list (fixture) | `scripts/contrib/2026fa/tisaac-swe-stem-opt/fixture.json` | jobs + the student's own `fit` and `timeline` | `your-input` |
| Prototype | `node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js [--fixture <jobs.json>] [--out-dir <dir>]` | builds the labeled evidence file and calls the scorer | — |
| Offline test | `node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.test.mjs` | labels, failure cases, no invented values | — |
| Scorer (reused, not modified) | `scripts/score/role-scorer.mjs` (`npm run score`) | votes × gates → Apply / Consider / Skip | — |
| Liveness checker (human-run at G1) | `npm run ats:liveness -- <url>` (`scripts/ats/check-liveness.mjs`; exit 0 = all active) | confirms a posting is still open | `record` once a person runs it |

## Inputs

Each job in the fixture carries:

| Field | Meaning | Label |
|---|---|---|
| `id`, `company`, `title`, `url` | the posting | `your-input` |
| `fit` | how well the role matches the student's skills and background, 0–1 | `your-input` (the student's own call; no model reads the JD yet) |
| `timeline` | can hiring finish inside the OPT window, 0–1 | `your-input` (only the student knows their dates) |

A job missing any of these fields stops the run; the prototype never fills in a value.

## Phase gates

Gates are hard stops. A role reaches an application only after a named person clears every gate below for that role.

| Gate | Hard stop | Machine check | What the person must see to clear it |
|---|---|---|---|
| **G1 Liveness** | A non-ATS URL is set to `-1` (cannot parse) and the scorer skips it. Every ATS URL is set to `1.0` **as an assumption** — nothing is fetched offline. | G1 command below | `npm run ats:liveness -- <url>` exits 0 for every Apply / Consider role. Until then the posting is unverified. |
| **G2 Visa timeline** | `timeline` is the student's own input; `0` closes the gate. | G2 command below | The student's OPT start/end dates against the employer's stated start date; the factor in the fixture matches that comparison. |
| **G3 International-student ban** | Not implemented (see A1). | none yet | The person reads the JD. "US citizens only", "no sponsorship now or in the future", or a clearance requirement → Skip. |
| **G4 Excluded role titles** | Not implemented (see A2). | none yet | The person reads the title. Data / ML-specialist titles → Skip (the student's own exclusion). |

Machine checks, run from the repo root after the prototype (both exit 1 on failure):

```bash
# G1 — every role with a closed liveness gate was skipped
node -e "const r=require('./scripts/contrib/2026fa/tisaac-swe-stem-opt/role-scores.json').roles; for (const x of r) { const g=x.trace.gates.find(g=>g.factor==='liveness'); if (g.multiplier<=0.05 && x.recommendation!=='Skip') { console.error('G1 FAIL', x.role_id); process.exit(1) } } console.log('G1 machine check ok')"

# G2 — every role carries a numeric timeline the student supplied
node -e "const r=require('./scripts/contrib/2026fa/tisaac-swe-stem-opt/my-roles.json'); if (r.some(x=>typeof x.timeline.factor!=='number' || x.timeline.source!=='your-input')) { console.error('G2 FAIL'); process.exit(1) } console.log('G2 machine check ok')"
```

G3 used to be scored inside `fit`. That made a banned role a soft deduction instead of a stop (sponsorship 0.8 with fit 0 → 0.28 → Consider), so it was moved out of the vote. It is a gate with no machine check yet, not a vote.

## Votes

| Vote | Scorer weight | How the prototype sets it | Label |
|---|---|---|---|
| Sponsorship | 0.35 (scorer default) | `Total Approvals` > 0 → `0.8`, tier `h1b-history` · else `total_funding` > 0 → `0.4`, tier `form-d-funding` · in the file with neither → `0`, tier `none` | `record` |
| | | company not in the file → `0`, tier `no-matched` (the student's rule: missing is not a deduction) | `your-input` |
| Fit | 0.3 (scorer default) | copied from the fixture | `your-input` |
| Role quality | **0** (scorer `[VERIFY]`, unpinned) | not produced | — |

The 0.8 / 0.4 values are the student's chosen mapping from the record to a probability, not numbers in the record (see A6).

## What it can and can't verify

| Can verify (from a record or a deterministic check) | Cannot verify |
|---|---|
| Whether the company name appears in the 80-days file (exact, case-insensitive match) | Whether the posting is still open — offline liveness is an assumption until G1 is run |
| `Total Approvals` and `total_funding` for that row | What the JD says, including sponsorship bans (G3) |
| Whether the URL is on a supported ATS domain (`greenhouse.io`, `lever.co`) | Fit — it is the student's own number |
| The scorer's arithmetic, shown per term in the audit column | Whether **this** role will sponsor; the file shows only company history |
| That a missing input stops the run instead of being invented (offline test) | A hiring freeze (see A5) |
| | Name-match misses: "Google" vs "Google LLC" becomes `no-matched`, indistinguishable in the score from a real absence |

## Proposed additions

| ID | Addition | Why it belongs | Status |
|---|---|---|---|
| A1 | JD check for international-student bans, run as a `model-judgment` with the quoted sentence, cleared by a person at G3 | The single most expensive mistake for this student is a tailored application to a role they legally cannot take | [TODO: DEV] |
| A2 | `--exclude-roles` title filter for G4 | The student's own scope rule (no Data / ML-specialist roles) should not depend on memory | [TODO: DEV] |
| A3 | Role-quality signals — location, work model, salary band (`npm run bls:local-wage`), O\*NET AI-resilience — and a proposed weight. The student's original design gave role quality 0.35; the scorer pins it at 0 and must not be modified, so this is **not in effect** today | For a 3-year runway, role quality is the signal that should replace sponsorship as the main vote | [TODO: DEV] |
| A4 | Call `npm run ats:liveness` inside the prototype for ATS URLs, storing the result as a `record` | Turns G1 from an assumption into evidence; keeps a parse failure (`-1`) separate from a confirmed closed posting (`0`) | [TODO: DEV] |
| A5 | A source for hiring freezes; funding is used only as a weak proxy | A company can have sponsorship history and still not be hiring | [TODO: DATA SOURCE] |
| A6 | Written reasoning for the sponsorship mapping 0.8 (H-1B history) / 0.4 (funding only) | The values are the student's choice; a value without reasoning cannot be checked | [TODO: DEFINE] |

## Output contract

| File (in the prototype folder, or `--out-dir`) | Reader | Contents | Decision it enables |
|---|---|---|---|
| `my-roles.json` | agent / scorer | one object per job: `role_id`, `company`, `title`, `sponsorship {p, tier, source}`, `fit {p, source}`, `liveness {factor, source}`, `timeline {factor, source}` | input to the scorer; audit of every label |
| `role-scores.json` | agent | scorer log: `config`, `profile_needs_sponsorship`, per role `composite`, `recommendation`, `reason`, `trace` (votes, gates, arithmetic) | machine checks at G1 / G2 |
| `role-scores.md` | the student | summary line with skip rate, one row per role with recommendation, reason, and term-by-term audit with labels | which roles go to the gates, which are skipped |

Console output also lists every `no-matched` company, because the Markdown report does not show tiers.

## Stop conditions

| Condition | Behavior |
|---|---|
| Fixture file missing | exit 1, no output written |
| A job missing `id`, `company`, `title`, `url`, `fit`, or `timeline` | exit 1, names the job and field, no output written |
| Sponsorship file missing | exit 1, no output written |
| Scorer fails | exit 1 |
| One job has a non-ATS URL | not a stop: liveness `-1`, warning printed, the rest of the batch continues |
| All jobs processed | normal stop; the person takes over at the gates |

## Next action per result (the 3-3-2 day)

| Result | Next action | Time block |
|---|---|---|
| **Apply** | Clear G1–G4 for this role, then tailor the résumé and apply | the 2 research-and-apply hours |
| **Consider** | Fix the soft spot first — usually find a person at the company (alumni, referral) before applying | the 3 networking hours |
| **Skip** | Spend no time; keep the reason from the report | none — skip is a success |
| **Skip, liveness −1** | Open the URL by hand once; if it is a real posting, find its ATS link and rerun | a few minutes |
| **`no-matched` company** | Check the company's legal name against the file before trusting the 0 | a few minutes |

## Run-log template (`logs/runs/2026fa-tisaac-<n>.md`)

Format from `recipes/_shared.md`. Never edit `logs/RUN_LOG.md`.

```markdown
## YYYY-MM-DD — SWE STEM-OPT sample run <n>

- **Recipe:** recipes/cases/2026fa/tisaac-swe-stem-opt.md v<version> (status <status>)
- **Inputs:** <fixture path>; data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv
- **Outputs:** <out-dir>/my-roles.json, role-scores.json, role-scores.md
- **Result:** <N roles → Apply a · Consider b · Skip c; skip rate; test x/y passed>
- **Open issues:** <gates not yet cleared by a person; open TODOs; anything that looked wrong>
```
