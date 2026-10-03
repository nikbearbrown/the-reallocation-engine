# CHANGE-BRIEF: SWE/AI/Cloud sponsored-title check with an OPT-start timeline gate

**Author:** tushar-patel28 · **Written:** 2026-10-01, before any build work
**Recipe slug:** `tushar-patel28-swe-title-sponsor-opt`
**Drafting note:** Claude drafted this brief from a read-only recon of the repo. Predictions P1–P3 are Claude's; P4 is mine. Any later change is added under *Revisions*. The original text is never rewritten.

## Executive summary

For an international MS software-engineering student who graduates in December and whose OPT starts in January, this recipe answers two questions per target role:

1. Does the company's H-1B record list a sponsored title in my role family (Software, then AI, then Cloud)?
2. Does the role's start date fit the student's OPT window?

It labels every input and runs the repo's existing scorer. It stops at a human gate before anything is marked Apply.

## 1. Situation and engine layers

**Who:** An international MS software-engineering student (a STEM degree), F-1, graduating in December with OPT starting in January. Targeting full-time roles that sponsor H-1B, in priority order: Software Engineer/Developer, AI Engineer, Cloud/Infrastructure.

**Why this differs from generic advice:** the student applies *before* the unemployment clock starts. So the timeline question is "does the start date land inside the student's window," not "how many days has the student burned."

**Engine layers used:**

- **80 Days to Stay:** company-level H-1B fields, including `top_job_titles_sponsored`.
- **The Cognitive Pivot:** BLS median wage per occupation family. It appears as report context only, not as a vote.
- **The scorer:** `scripts/score/role-scorer.mjs`.
- **Job-Ops** (liveness) is used only as a human gate (§3). The offline prototype does not call it.

## 2. Reuse and proposed additions

**Reused, with exact paths:**

| What | Path |
|---|---|
| Sponsorship data (30,369 rows; 1,557 with H-1B fields) | `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` |
| BLS occupations (15-1252, 15-2051, 15-1221, 15-1241, 15-1244 confirmed present) | `data/bls/compact/soc_occupation_compact.csv` |
| Scorer, run as a CLI (it has no exports) | `npm run score -- <roles.json> --out-dir <my folder>` |
| Parsing approach for the stringified title list (`ast.literal_eval`) | as in `scripts/sec/validate-h1b-join-sample.py` |
| Liveness check (human-run, at the gate) | `npm run ats:liveness -- <job-url>` |

**Proposed additions** (not in the repo today):

- **Title-to-family crosswalk** `[TODO: DEFINE]`. This is a keyword list mapping sponsored job titles to my three role families. It's needed because the data has **no SOC field**: the repo's own entity-resolution audit says so, and so does `recipes/cases/2026su/case-ml-sponsorship-triage.md`. The crosswalk is my definition, labelled `your-input`, not a record.
- **Timeline factor from dates** `[TODO: DEV]`. No script in `scripts/` computes the scorer's `timeline.factor`. Today it's a hand-typed number. Mine computes it from the role's start date versus the EAD start and the 90-day unemployment allowance, using a stated mapping that is labelled `your-input`. This is planning arithmetic, not immigration advice.

**Deliberately not used:**

- **Form D funding.** A spot check of the shipped samples found 15/200 name matches, with only one sponsoring company. A funding vote on that sample would be close to empty.
- **H-1B approval counts.** Every approval and denial value is even, which suggests double counting upstream. I'll treat sponsorship as present or absent, never as a size.

## 3. Gates (hard stops) and what a human needs to see

| Gate | Testable condition | What a human must see to clear it |
|---|---|---|
| G1 Entity | The company's normalized name matches exactly one CSV row | The matched row's name, city, and state, to confirm it's the same company and not a namesake |
| G2 Timeline | The computed factor is above 0.05 (otherwise the scorer zeroes the role) | The EAD start, role start, the window arithmetic, and the mapping used |
| G3 Liveness (human) | No role is marked Apply until `npm run ats:liveness` has been run on its URL | The liveness result for each Apply candidate. The offline prototype cannot clear this gate. |

## 4. Predicted failure cases and how each will be checked

| # | Failure case | Expected behaviour | Check |
|---|---|---|---|
| F1 | Company not in the CSV | Status `not-found`; sponsorship tier `unknown`. **Never treated as "does not sponsor."** | Fixture role with an invented company name |
| F2 | Company in the CSV but its H-1B fields are empty | Status `no-h1b-trace`; tier `unknown`, not zero | Fixture using one of the 28,812 rows without H-1B data |
| F3 | Role start before the EAD start, or after the 90-day window closes | Timeline factor 0 → scorer Skips with a "gated" reason | Two fixture roles, one on each side of the window |
| F4 | Missing or invalid start date | Clear error naming the role; no default value is invented | Fixture role with no start date |
| F5 | Unparseable `top_job_titles_sponsored` | Status `titles-unreadable`; no family match is claimed | Fixture row with a malformed list |
| F6 | Scorer `--profile` bug: "work authorized" in an F-1 profile sets the sponsorship weight to 0 | Prototype never passes `--profile`. A guard test fails if the sponsorship weight in the output is 0. | Guard test, plus a documented reproduction |

## 5. Predictions about what the first pass will get wrong

- **P1:** AI-family roles will show as "family not in top titles" for companies that do sponsor AI engineers, because they file them under "Software Engineer" and the list holds only a few titles. I expect false "unknowns" for the AI family more than for the other two.
- **P2:** Exact name matching will miss well-known sponsors whose CSV name differs from how a posting names them (for example "Google" vs. the legal entity). Big companies may come back `not-found` more often than small ones.
- **P3:** The healthy-run target (skip at least half) may not be met on a small hand-made sample. A low skip rate would say more about my sample than about the recipe.
- **P4:** I think SWE will match almost every sponsoring company, so the check won't actually separate companies.

## Revisions

### 2026-10-01 — after the first build and review

**Prediction outcomes (first build, sample run 2026-10-01; 12 roles, 11 scored):**

- **P1 — partly confirmed, partly contradicted.** Anyscale's AI role came back "not in top titles": its list is only "Software Engineer" and "Solutions Architect". But Datadog's Cloud role did the same. Across all 1,557 sponsoring companies, Cloud titles are rarer in top-title lists than AI titles (SWE 539, AI 193, Cloud 88), so Cloud is more exposed than AI. Whether any of these unknowns is *false* cannot be checked with this data.
- **P2 — the outcome partly confirmed, the mechanism contradicted.** "Google" came back not-found, but not because of a legal-name mismatch. No CSV row starts with "GOOGLE", since the dataset is built from startup funding filings; "ALPHABET INC" is present with no H-1B trace. Large companies that are in the CSV matched (Stripe, Databricks, Datadog, MongoDB, Toast). The naming problem appeared as ambiguity instead: "Salesforce.com, Inc." matches two rows that differ only in punctuation.
- **P3 — confirmed (3 of 11 skipped, 27%).** The cause was mostly the mapping, not the sample. "Likely" and "Possible" are soft tiers in the scorer, so strong roles landed in Consider, and unknown roles landed in its 0.20–0.30 Consider band on fit alone.
- **P4 — confirmed for my list, not across the dataset.** All four SWE companies with an H-1B trace listed an SWE title, so the check does not separate well-known tech targets. Across the dataset, an SWE title appears at only 539 of 1,557 sponsoring companies (35%).

**Design changes and why:**

- **G4 human gate: the only path to Apply.** The first build could never produce Apply: the data has no filing year, so the best tier is Likely, which the scorer treats as soft. Rather than inflate a number, Apply now requires a human-filled overrides entry. The entry records the LCA evidence source, fiscal year, SOC code, whether the posting rules out sponsorship, the liveness-check date, the check date, and a reason. The tool refuses incomplete entries, and entries for roles with a closed timeline gate or an ambiguous or not-found company match. An LCA is evidence of an intent to file, not an approved visa. The sample ships with no entries, because no real DOL check has been done.
- **Early-start soft band.** A start 1–30 days before the EAD start is now 0.5 instead of 0, because the start date can be negotiated to on or after the EAD start. More than 30 days early stays 0. This changes failure case F3: only a start more than 30 days early (or more than 90 days after) is gated.
- **0.6 → 0.5 for the 61–90-day band.** The scorer flags a timeline as weak only when it is *below* 0.6 (`softTimeline = timeline < 0.6`), so the first build's 0.6 was silently treated as healthy. 0.5 puts both risk bands below that threshold, so both are flagged.
- **Next action follows the evidence tier.** Likely → tailor; Unknown (and Possible) → network, because a conversation resolves sponsorship policy and an application can't, and unknown is not no; gated → skip; the two "blocked" outcomes stay.

**Who wrote the closures:** the DEFINE rationales (sponsorship tiers, fit, timeline bands, next action) were drafted by Claude and approved by tushar-patel28 on 2026-10-01. At the author's request they are labelled in the recipe, mappings and card as "rationale drafted by tushar-patel28, 2026-10-01". The crosswalk DEFINE is still open.

2026-10-02 privacy re-cut: lines 12, 18 and 20 reworded to third person and the school name removed; no prediction content changed.

2026-10-03 clarification: the crosswalk DEFINE, described as still open in the 2026-10-01 revision, was closed later that day in the same commit (5db51f6). Its closure rationale and label are part of the open authorship-label item recorded in FRICTIONAL E11.
