# Design: Profile-Driven Config Generation

*Status: design, awaiting approval. Triggered by the right question: why is a human hand-editing `portals.yml`?*

## The flaw, stated plainly

Tutorial 01 currently has the student hand-edit YAML. By this repo's own principles that's a labor-separation violation: translating "I want ML engineering roles at sponsor companies, not internships" into a syntactically correct, typo-free, synonym-complete config is **execution** — an AI/script job. The human's jobs are upstream (stating what they want) and downstream (judging the generated config). The middle — transcription into YAML — is exactly the kind of work the engine exists to take away. Hand-editing also guarantees the failure modes a generator wouldn't have: typos in provider names, missed synonyms ("Machine Learning" but not "ML", "MLE", "Deep Learning", "GenAI"), location variants ("United States" but not "US"), and a config that silently drifts from the student's actual intent.

## The design

Intake asks what the student wants to **do** — never which companies they like. Students asked for companies produce the same 20 famous names everyone produces; students asked for their dream job produce signal. Companies are an *output* of the engine, derived from roles + evidence, not an input.

```
1. INTAKE (conversational, agent-led)
   "What do you want to do?"  → free-text dream-job description
   "Where, and under what constraints?" → locations, visa dates, exclusions
   "Upload your resume."      → resume-to-JSON conversion (next section)
   → writes search/profile.yml                      [human answers = judgment]

2. RESOLVE ROLES (verified data + one gate)
   free text → candidate SOC codes from data/bls/compact/
   soc_occupation_compact.csv (titles, descriptions, alternate titles)
   → agent proposes 2–3 SOC codes with their O*NET descriptions
   → HUMAN CONFIRMS which match the dream job          [gate: role identity]
   Confirmed SOC codes go into profile.yml — the pivot the whole
   engine turns on (role quality, wage context, title expansion).

3. GENERATE (scripts + verified data — no human typing)
   companies  : SOC role family × data/80-days-to-stay sponsorship tiers
                × SEC Form D recency → ranked suggestions
                → detect-ats.py → provider + careers_url
   title_filter: confirmed SOC codes → O*NET alternate titles
                + data/synonyms/titles.yml (curated expansion table)
   locations  : profile.locations + canonical variants
   → writes search/portals.yml with header:
     "# GENERATED from profile.yml v0.2 on 2026-06-12 — edit profile.yml, not this file"

4. REVIEW (human gate)
   Human reads the generated config / the diff against the previous one,
   judges it ("why is 'Volunteer' negative? why did it suggest Anduril?"),
   prunes suggestions, clears the gate. The human READS and PRUNES config;
   the human does not WRITE config.

5. SCAN — unchanged from today.
```

## resume.json: the verified personal data layer

The same contract that governs company evidence should govern the student's own claims. Today a resume is prose — and every tailored variant is a *rewrite*, which is where invention creeps in. Instead:

1. **Upload** the existing resume (PDF/docx/md).
2. **Convert** to structured JSON — one record per job, project, degree, skill, publication, with dates, names, and verifiable details as fields. (Start from the JSON Resume schema, extend where needed.)
3. **Verify** — the human walks the JSON field by field and confirms each claim is true and complete. This is the one verification no tool can do: the student is the only authority on their own history. The confirmed file becomes `search/resume.json` — the student's verified dataset about themselves.
4. **Derive, never rewrite** — every output (ATS-safe PDF via `scripts/resumes/`, role-tailored variant, cover-letter facts, fit comparison against a posting) is *generated from* resume.json by selecting, ordering, and formatting fields. A tailored resume is a projection of verified records, not a paraphrase of a document.

Why this reduces hallucination: generation from structured truth is a constrained task — the model chooses *which* verified facts to surface, not *what the facts are*. Every line in a generated resume traces to a JSON field the human confirmed (P3, applied to the self). Rewriting prose is an unconstrained task where fluent invention is the failure mode — and an invented credential is the one failure the honesty principle calls non-negotiable. The diff is also auditable: if a generated resume contains a claim with no source field, that's a conformance failure a script can catch — *resume claims become machine-checkable against their source.*

Verification gate for the conversion itself: converting prose → JSON is extraction, and extraction can hallucinate too. So step 3 is a hard gate — the JSON is DRAFT until the human attests it field by field, same lifecycle logic as recipes.

Profile changes → regenerate → diff → gate. Intent lives in `profile.yml`; the config is a derived artifact, like a compiled binary. Hand-editing `portals.yml` becomes a smell with a name: editing generated output.

## Synonyms: from a source file, never from vibes at scan time

Two-layer expansion, both versioned in `data/`:

1. **O*NET alternate titles** — already in the repo (`alternate_titles_sample` per SOC code in the compact CSV; full table in `data/bls/db-30-2-text/Alternate Titles.txt`). Verified, upstream-maintained, free. "Software Developers" (15-1252) carries dozens of real-world title variants.
2. **`data/synonyms/titles.yml`** — a small curated table for what O*NET lags on ("GenAI", "LLM Engineer", "Member of Technical Staff"). The model may *propose* additions during intake; a human approves; the file is versioned. Expansion is never performed silently at scan time — that would make two runs of the same profile produce different filters, breaking reproducibility and provenance (P3).

## Personal search folder: yes — one folder, gitignored

Everyone's search is different, and right now personal material is smeared across `data/ats/` (config, tracker, scan history) plus an optional profile in `recipes/`. Consolidate:

```
search/                  ← gitignored entirely, one line
  profile.yml            ← intent: roles (confirmed SOC), locations, visa dates
  resume.json            ← verified personal records (human-attested)
  portals.yml            ← generated from profile.yml
  resumes/               ← generated projections of resume.json (PDFs, variants)
  applications.md        ← tracker
  scan-history.tsv
  attestations/
```

One folder, one privacy rule, one thing a student backs up, one thing that's *theirs* in a cloned cohort repo. `data/` stays shared verified evidence; `search/` is the personal layer. (`recipes/_profile.template.md` already gestures at this — it has Target Roles and Constraints sections — but it's prose nothing reads. It becomes the human-readable companion of `search/profile.yml`: two customers, again.)

Scripts take the config path via the existing `REALLOCATION_ENGINE_PORTALS` env var (already supported by `scan.mjs`), defaulting to `search/portals.yml` once this lands.

## The suggestion step is the engine being itself

Asking the student for companies of interest is necessary but insufficient — students name the same 20 famous companies everyone names, which is the spray-and-pray input distribution the book argues against. The generator should *answer back* from evidence: sponsorship tiers (80 Days), recent funding (SEC Form D), role-family fit (SOC). "Companies of interest" becomes a negotiation between the student's intent and the evidence — which is the reallocation thesis as a feature.

## What this costs

- `scripts/search/generate-config.py` (or .mjs): profile.yml → portals.yml + filters. Mostly plumbing; detect-ats and the data sources exist.
- `data/synonyms/titles.yml`: seed with ~20 entries.
- A `profile` recipe (intake script for the agent, gates, logging) — the natural Recipe Zero for the course: it's the first thing a student runs, and its output feeds every other recipe.
- Tutorial 01 edit: Step 1 reframed as "you're reading what the generator will normally write — hand-editing is for looking under the hood."
- `.gitignore`: add `search/`.

## Profile metadata: what a resume can never tell you

resume.json is facts about the past. The search runs on constraints and intentions about the future, none of which appear on a resume: work authorization, remote/part-time tolerance, urgency, discretion. That metadata lives in `profile.yml`.

**No personas.** An earlier draft of this design proposed persona presets (international student, US new grad, employed-and-looking, part-time). They're unnecessary: everything a persona did is done by **conditional intake over facts**. "Are you authorized to work in the US without sponsorship?" — *yes* skips the entire visa block; *no* opens it. "Are you currently employed?" — *yes* opens discretion and current-employer-exclusion questions. The question tree branches on answers; no labels, no taxonomy to maintain, no person who is three personas at once. The engine reads fields, full stop.

Canonical `profile.yml` fields: `authorization` (citizen / PR / visa type + dates), `situation` (student / new-grad / employed / between), `work_prefs` (remote, hours, contract tolerance), `discretion` (incl. employers to exclude from scans), `comp_floor`, confirmed SOC roles, locations.

The engine consequence stands: the composite scorer's weights are a function of profile fields, not constants. "A perfect-fit role at a non-sponsor is a skip" is true when `authorization` requires sponsorship and false when it doesn't — same engine, same evidence, different binding constraint, different verdict. That's the reallocation principle doing its job.

## The gaps file: the delta between the two truths

Once the past (`resume.json`) and the future (`profile.yml` + confirmed SOC codes) are both structured, the gap between them is **computable** — and the repo already holds the data to compute a first draft. The BLS compact CSV carries O*NET skill and ability level scores per SOC code (`skill_*_lv`, `ability_*_lv` columns); the target role's profile can be compared against what resume.json evidences:

```
search/gaps.md   (generated draft → human-edited, living document)

## Target: 15-1252 Software Developers (confirmed 2026-06-12)
| Gap | Evidence the target needs it | What I have | Plan |
|---|---|---|---|
| Distributed systems at scale | O*NET systems analysis 4.2/5; appears in 60% of scanned postings | one course project | [student writes] |
| AWS cert or equivalent | 14 of 43 pipeline postings name it | none | [student writes] |
```

Rules that make it work:

1. **Generated, then owned.** The first draft is derived (O*NET levels + keyword frequencies from actual scanned postings — the pipeline is a corpus). The student edits it; their edits are judgments and stay theirs. Regeneration produces a diff, never an overwrite.
2. **The migration rule.** An item moves from `gaps.md` to `resume.json` only with **evidence** — a repo, a cert, a shipped project, a completed course. A closed gap is a new attested fact; an open gap can never appear on a generated resume. This is the honesty principle made mechanical: aspirational entries are structurally impossible, because resumes are projections of resume.json and gaps live in a different file.
3. **It closes the loop the book promises.** The SDD's thesis is 2 hours applying, 6 hours building. The gaps file is what tells the student *what to build in the six hours* — the engine stops being only an application allocator and becomes a development allocator. Skip a role today; close the gap that made it a skip; the same role family scores differently in March.

So the personal layer is three files with distinct epistemic status: `resume.json` (attested past), `profile.yml` (declared future + constraints), `gaps.md` (the managed delta — part evidence, part plan, edited by the only person accountable for closing it).

## Exercise Zero

Creating this layer is the course's first exercise — before the first scan. It needs almost no infrastructure (the agent can run intake and resume→JSON conversion conversationally in Claude Code today), it produces the input every later tutorial consumes, and it starts the attestation habit on the one subject where the student is the world's leading authority: themselves. Deliverables: attested `resume.json`, completed `profile.yml`, first-draft `gaps.md` with at least one gap the student rewrote in their own words — plus, as always, the RUN_LOG entry.

## Course-project mapping

The components this design needs are the projects the cohort is already building: H-1B sponsorship probability scoring feeds the company-suggestion step; resume-to-JSON converters *are* step 2–3 of the resume layer. The engine's missing pieces and the course's project list are the same list — student projects that pass their gates get promoted into `scripts/` with provenance, which is also the contribution path the system already defines.

## Open decisions

1. Folder name: `search/` vs `me/` vs `profile/`.
2. Does intake run as a recipe in Claude Code (recommended — it's Recipe Zero) or as a standalone script with prompts?
3. Suggestion volume: how many evidence-derived companies to propose before it overwhelms (cap at ~10–15?).
4. Does `data/ats/` remain for anything personal, or become scratch/example space only?
