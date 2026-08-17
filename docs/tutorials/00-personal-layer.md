# Tutorial 00 — Exercise Zero: Your Personal Layer

**What you'll build:** the three files everything else runs on — `resume.json` (your attested past), `profile.yml` (your declared future and constraints), and `gaps.md` (the managed delta between them) — all in a private `search/` folder.
**Time:** 60–90 minutes. Most of it is judgment, which is the point.
**You need:** this repo cloned, Claude Code (or Cowork) open at the repo root, and your current resume in any format (PDF, docx, markdown). Portfolio links, GitHub, publications — bring everything; more is better here.

Nothing in this tutorial requires the network or any script. The agent does the extraction and transcription; you do the verifying and deciding. That division is the course.

---

## Why these three files

A resume is prose about your past. A search runs on more than that: what you want next, what constrains you (visa dates, hours, location, discretion), and what you're missing for the role you actually want. Three files, three kinds of truth:

| File | Contains | Epistemic status |
|---|---|---|
| `search/resume.json` | every verifiable fact about your past — jobs, projects, degrees, skills, publications, portfolio pieces | **attested** — you verified every field |
| `search/profile.yml` | what you want and what binds you — roles (as SOC codes), locations, authorization, hours, exclusions | **declared** — your stated intent |
| `search/gaps.md` | what the target role demands that your record doesn't yet evidence | **managed** — generated draft, owned and edited by you |

Two rules connect them. Every generated resume is a *projection* of resume.json — facts selected and formatted, never rewritten, so a claim that isn't in the JSON cannot appear in any resume. And an item moves from gaps.md into resume.json **only with evidence** — a repo, a cert, a shipped thing. Aspiration and record never share a file.

## Step 0 — Privacy first

```bash
mkdir -p search
echo "search/" >> .gitignore
git check-ignore search/ && echo OK
```

Everything in `search/` is yours: your history, your visa dates, your target list. It never gets committed. If `git check-ignore` doesn't print OK, stop and fix that before putting a single fact in the folder.

## Step 1 — Start the intake

Put your resume file somewhere the agent can read it (e.g. `search/resume-original.pdf`). Then paste this into Claude Code:

```
Read SNICKERDOODLE.md and DOMAIN.md first and operate under that contract.

We are doing Tutorial 00 (docs/tutorials/00-personal-layer.md). Three tasks,
strictly in order, each ending with a stop for my review:

TASK 1 — RESUME EXTRACTION. Read search/resume-original.pdf and convert it to
search/resume.json using the schema in the tutorial (JSON Resume style:
basics, work[], projects[], education[], skills[], publications[], links[]).
Rules: extract only what the document supports — do not infer, embellish, or
fill gaps; preserve my wording for titles and employers; put anything you are
unsure about in an "extraction_notes" list at the bottom instead of guessing.
Mark the file "attested": null. Then STOP and walk me through it section by
section for verification.

TASK 2 — INTAKE. Interview me using the question tree in the tutorial,
one question at a time, branching on my answers. Do not ask questions my
earlier answers make irrelevant. For the dream-job question, match my answer
against data/bls/compact/soc_occupation_compact.csv (titles, descriptions,
alternate_titles_sample) and propose 2–3 SOC codes with their descriptions —
I will confirm which is right; that confirmation is a gate. Write the result
to search/profile.yml. Then STOP for my review.

TASK 3 — GAPS DRAFT. Compare my attested resume.json against the confirmed
SOC row in the compact CSV (skill_*_lv and ability_*_lv columns, job zone,
alternate titles). Draft search/gaps.md as a table: Gap | Evidence the target
needs it | What I have | Plan (leave Plan blank — it's mine). Label every
judgment as a judgment. Cite which CSV column or resume field each row came
from. Then STOP.

After all three: draft a RUN_LOG entry for me to approve. Do not log private
details — the log records that the files were built, not what's in them.
```

## Step 2 — Verify the extraction (the gate that matters most)

The agent converted prose to JSON. Extraction can hallucinate — a date shifted, a title inflated, a skill listed that you mentioned once in a course description. The JSON is DRAFT until you've checked it, and you are the only person on earth who can.

Go section by section. For each entry ask three questions: **Is it true? Is it complete? Is it mine?** (That internship title the agent "cleaned up" — is that what your offer letter said?) Fix everything directly in the conversation; make the agent apply the edits. While you're in there, add what the resume never held: portfolio pieces, repos, talks, the project that didn't fit on one page. resume.json has no page limit — it's a dataset, not a document. The one-page resume comes *out* of it later, per target role.

When every field is checked, set `"attested": "2026-06-12"` (your date) in the file. That timestamp means: *every claim in here survived my review.* Any future edit resets it to null until you re-check the change.

A worked fragment of the schema:

```json
{
  "attested": null,
  "basics": { "name": "…", "email": "…", "location": "…" },
  "work": [{
    "company": "…", "title": "…", "start": "2024-06", "end": "2025-08",
    "highlights": ["…"],
    "evidence": "offer letter / public page / repo (optional but powerful)"
  }],
  "projects": [{ "name": "…", "url": "…", "summary": "…", "skills": ["…"] }],
  "education": [{ "school": "…", "degree": "…", "end": "2026-05" }],
  "skills": [{ "name": "…", "evidence": "where in work/projects this shows up" }],
  "extraction_notes": ["agent's uncertainties — resolve these before attesting"]
}
```

Note the `evidence` fields: a skill with no pointer to a project or job that demonstrates it is a *claim*, and you should ask yourself the same question a recruiter would.

## Step 3 — The intake question tree

The agent asks these one at a time, branching on answers — never ask a question an earlier answer made irrelevant. (Instructors: this tree is the spec; the prompt above tells the agent to follow it.)

```
Q1  THE FUTURE. "Describe the job you actually want — a few plain sentences.
    What would you be doing all day?"
    → agent matches free text against the SOC compact CSV
    → proposes 2–3 SOC codes, each with its O*NET description
    → GATE: you confirm the one (max two) that is actually your dream job.
      Read the description before confirming — "Software Developers" and
      "Data Scientists" are different rows with different skill profiles.

Q2  LOCATION. "Where can you work?" (cities/regions)
    "Remote: required / preferred / no preference / not wanted?"

Q3  SHAPE. "Full-time? Would you take part-time or contract work — and is
    that a preference or a constraint?"

Q4  AUTHORIZATION. "Can you work in the US without employer sponsorship?"
    ├─ YES → skip to Q5. (No visa questions. Ever.)
    └─ NO  → "Visa status?" (F-1 OPT / F-1 STEM OPT / H-1B / other)
             "Exact OPT end date?"
             "STEM-eligible? Filed? STEM end date if filed?"
             "Latest date an offer still works for you?"
             → these dates become the timeline gate the scorer uses.

Q5  SITUATION. "Currently employed?"
    ├─ YES → "Is this search confidential?"
             "Companies to exclude from every scan?" (at minimum: employer)
             "Earliest realistic start, given notice?"
    └─ NO  → "When do you need to be earning — hard date or soft?"
             (For internationals this is usually answered by Q4's dates;
              don't ask twice.)

Q6  EXCLUSIONS. "Anything you won't do? Industries, companies,
    on-call, security clearance, relocation cities…"

Q7  FLOOR (optional). "A compensation floor you'd rather not state aloud
    can still live in your private profile. Want one recorded?"

Q8  THE RECORD. "Portfolio, GitHub, Google Scholar, personal site —
    every URL that evidences your work."
    → these go into resume.json links/projects, not profile.yml.
```

Review the generated `profile.yml` the same way you reviewed the JSON: is this what you actually said, and is it what you actually meant?

```yaml
# search/profile.yml — declared 2026-06-12
roles:
  confirmed_soc: ["15-1252"]      # confirmed at Q1 gate, not guessed
  dream_job_text: "…my own words, kept verbatim…"
locations: { bases: ["Boston", "NYC"], remote: "preferred" }
work_prefs: { hours: full-time, contract_ok: false }
authorization: { sponsorship_required: true, status: "F-1 OPT",
                 opt_end: "2027-02-15", stem: "eligible, not filed",
                 offer_needed_by: "2026-11-01" }
situation: { employed: false, start_needed: "2026-09-01" }
exclusions: ["defense", "Acme Corp"]
comp_floor: null
```

## Step 4 — The gaps draft

The agent now compares two structured things: the target SOC row (skill and ability level scores, job zone) against your attested record. The output is a draft — read it as *the machine's opinion of the distance between your files*, no more:

```markdown
# search/gaps.md — target 15-1252, drafted 2026-06-12 (agent draft, my edits below)

| Gap | Evidence the target needs it | What I have | Plan |
|---|---|---|---|
| Systems analysis depth | skill_systems_analysis_lv 4.1/7 for 15-1252 | one course project (resume: projects[2]) | |
| Production deployment | job_zone 4; "deploy" absent from my record | none evidenced | |
| Title vocabulary | alt titles incl. "Backend Developer", "DevOps" | my titles say "research assistant" | |
```

Then it becomes yours. Three required edits before this tutorial counts as done:

1. **Kill one row.** The draft will contain at least one gap that's wrong — a skill you have but never wrote down (which is really a resume.json gap — go add the evidence) or a demand that doesn't apply. Delete it and say why in a one-line note.
2. **Rewrite one row in your own words.** "Systems analysis depth" means nothing on a Tuesday. "I've never designed something that two other people built against" is a gap you can act on.
3. **Write one Plan cell.** Small and real beats grand and vague: "ship the scraper project with a README and tests by July 1" is a plan; "learn distributed systems" is a wish.

The migration rule, which you'll use for months after this tutorial: when a plan completes, the evidence (repo, cert, shipped artifact) goes into resume.json as a new entry, the attestation date resets until you verify it, and the gap row gets deleted. The gaps file should be a place things *leave*.

Later, once your scans run, the gaps draft gets sharper: the pipeline becomes a corpus ("14 of 43 postings name Kubernetes"), and demand stops being O*NET's opinion and starts being your actual market's.

## Step 5 — Record

Approve the agent's RUN_LOG entry. It should say the layer was built and attested, name the confirmed SOC code, and count the gaps — and contain none of your private details. Example:

```markdown
## 2026-06-12 — Tutorial 00: personal layer built

- **Recipe:** manual (Tutorial 00, agent-led intake)
- **Inputs:** resume-original.pdf, intake interview, data/bls/compact/soc_occupation_compact.csv
- **Outputs:** search/resume.json (attested), search/profile.yml, search/gaps.md (agent draft + my edits)
- **Result:** SOC 15-1252 confirmed at the role gate. Extraction required N corrections
  (the interesting one: [what the agent got wrong, in one clause]). Gaps: M drafted, 1 deleted
  as wrong, 1 rewritten, 1 with a plan.
- **Open issues:** [what you didn't verify / decide yet]
```

The "extraction required N corrections" line matters: it's your first recorded measurement of the gap between fluent output and verified truth — using your own life as the dataset.

---

## Exercises

1. **The delete test.** Remove one true entry from resume.json, ask the agent to generate a one-page resume targeting your SOC code (projection only — selecting and formatting fields), and confirm the claim is gone. Restore the entry. You've now *demonstrated*, not been told, why projection beats rewriting: the output cannot contain what the source doesn't.
2. **The inflation hunt.** Reread the agent's original extraction (before your fixes). Find the single most flattering deviation from what your resume actually said. One sentence: was it wrong, or was it true-but-unevidenced? (Those are different failures.)
3. **Second opinion.** Give the dream-job text from Q1 to a different model (ChatGPT, Gemini) and ask for SOC codes. Same answer? If not, read both O*NET descriptions and decide — then note that the *gate*, not the model, is what made the disagreement visible.
4. **The six-hour test.** Look at your one written Plan cell. Could you start it tonight without any further decisions? If not, it's not a plan yet — decompose until the first step is startable.

## What can go wrong

| Symptom | Cause | Fix |
|---|---|---|
| agent "improves" your titles or summary | extraction drifting into rewriting | the prompt forbids it; revert, and point the agent at the rule |
| `search/` shows up in `git status` | gitignore line missing or wrong | Step 0; nothing proceeds until OK |
| agent asks visa questions after a "yes" at Q4 | not following the tree | tell it to re-read Step 3; this is a conformance failure, name it |
| no SOC code feels right at Q1 | dream job spans rows, or O*NET vocabulary mismatch | pick the *primary* row, note the secondary in profile.yml; don't confirm a row you didn't read |
| gaps.md feels generic | drafted from O*NET only — no scan corpus yet | expected; regenerate after Tutorial 01's pipeline has real postings |

**Next:** [Tutorial 01 — Your First Scan](01-first-scan.md). Your `profile.yml` is what the config generator will eventually consume (`docs/search-profile-design.md`); until that lands, Tutorial 01 has you hand-write the config once, knowing exactly which file it should have come from.
