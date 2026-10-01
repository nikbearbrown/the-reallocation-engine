# ML/RAG engineer H-1B triage on an OPT clock — human card

**Audience:** an international MS graduate on F-1 OPT, needing H-1B sponsorship, deciding which AI/ML engineering employers are worth an application before their unemployment days run out — and the reviewer deciding whether to trust this build's recommendations.  
**Agent twin:** `recipes/cases/2026fa/omraut888-ml-h1b-timeline.md` (not yet written)  
**Chapters claimed:** 7 (who sponsors) and 10 (the visa timeline). Chapter 11's scorer is used as-is through its CLI, not modified. Chapter 8 (liveness) is not exercised without live-network approval, and Chapter 9 (role quality) is not used: its weight stays at the scorer's 0.0.

## Purpose

Answer: of the companies with a recorded history of sponsoring H-1B visas for ML, AI or data-science titles, which ones can this student realistically get hired by before their OPT runway closes? The build turns sponsorship records and the student's own visa dates into role records, and the engine's existing scorer turns those into Apply / Consider / Skip. In its current state it answers the first half of that question — who has sponsored this kind of work — much better than the second.

## What it can verify

- A company has recorded H-1B history: it is one of the 1,557 rows with approval and denial counts, out of 30,369 in the source CSV. Companies without it are out of scope, not scored low.
- Sponsorship strength comes from real counts, not a bare percentage. `sponsorship.p` is the approval ratio shrunk toward a prior with a pseudo-count of 5. For companies with any approvals, the prior is the pooled approval rate across all 1,557 H-1B companies (0.9812), so 2 approvals out of 2 reads as 0.987, not 1.0. For companies with zero approvals, the prior is a fixed 0.3, a stated judgment, not a measurement: a company with no approved petitions should read as a below-average prospect. So 0 approvals and 2 denials reads as 0.214, not 0.70. The tier is set from the approval count: Proven at 5 or more, Likely at 1–4.
- Funding stage and amount are read straight from the same CSV row, and shown for context only. The scorer has no funding term.
- The timeline factor is computed from the persona's real OPT dates: 90-day ceiling minus 34 used minus a 20-day buffer gives 36 usable days, as of the fixed date 2026-09-30. If the OPT window has closed, the factor is exactly 0, and the scorer skips the role on its closed-gate rule.
- Every number in a role record carries its source label (`record`, `model-judgment`, `your-input`), and the build writes an audit file listing each assumption with its value.

## What it cannot verify

- **Whether a title is ML work at all.** Fit is word overlap with five possible values. It scores "Machine Learning Engineer" the same as "Data Scientist", and scores Applied, NLP and ML Scientist titles as 0.
- **Whether this build can recommend skipping anything.** On the real data it skips 0 of 183 companies. It can't yet do the engine's main job of saying "don't spend time here". The reasons are a liveness gate that never runs without live-network approval, and a pre-filter that only admits sponsors whose approval rates are already near 100%.
- **How long any company actually takes to hire.** The funding-stage lag (21 vs 56 days) is an assumption, and it decides more of the ranking than any recorded evidence.
- **Whether the posting is open.** At best, ATS presence; without approval, not even that.

## Dependencies

- `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` — sponsorship counts, approval rate, sponsored titles, funding stage and amount.
- `search/examples/priya-nair/profile.yml` — OPT dates, unemployment days, buffer, target roles. `resume.example.json` is read but no longer used for fit.
- `scripts/score/role-scorer.mjs` — the Chapter 11 scorer, run as a subprocess. It exports nothing, so it can't be imported.
- `data/bls/compact/soc_occupation_compact.csv` — SOC 15-1252 only, for the documented `role_quality` proposal. The build does not read it.
- Python 3 with PyYAML (already required by the repo's conformance check) and Node 18+. No `.venv` and no network access. The one networked step, ATS-presence detection with `scripts/ats/detect-ats.py`, is optional and needs a logged human approval first.

## Annotated commands

Build the role records. Expect `built 183 roles from 1557 H-1B rows (30369 in CSV); skipped: unparseable-titles 0, no-approval-rate 0`, then the tier counts and `usable days 36 as of 2026-09-30`:

```bash
python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --out /tmp/ml-h1b
```

Score them. Expect `✓ scored 183 roles → Apply 87 · Consider 96 · Skip 0 (skip 0%)`. The 0% is the finding below, not a success:

```bash
npm run score -- /tmp/ml-h1b/roles.json --out-dir /tmp/ml-h1b
```

Run the harness. Expect `Ran 19 tests … OK` and exit 0. It uses a fictional six-company fixture, not the real CSV:

```bash
python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/test_build_roles.py
```

## What it produces

- **`roles.json`** — the scorer's input: one record per company, with `role_id`, `company`, `title` (the matched ML titles), `sponsorship {p, tier, source}`, `fit {p, source}`, `liveness {factor: 1.0, source: "not checked …"}` and `timeline {factor, source}`. It also carries fields the scorer ignores: `liveness_checked: false`, `liveness_method`, and an `evidence` block with approvals, denials, raw approval rate, the company-wide median salary (labelled as not this role's pay), funding, all sponsored titles, and which target words matched.
- **`build-audit.json`** — rows in, rows with H-1B data, roles built, skips by reason with company names, tier counts, how many roles have fit above 0, and every assumption with its value and source.
- **`role-scores.json` + `role-scores.md`** — written by the scorer, not by this build. The Markdown file is the human report: one row per company with composite, recommendation, reason and the term-by-term audit trail. This build does not write a separate human report of its own.

## Named failure modes

1. **Saturated fit proxy.** Target-role word overlap can only take five values, and 146 of 183 companies get the same one (0.25), so fit adds the same 0.075 to nearly every composite. It measures whether a title contains "data" or "engineer", not whether the work is ML. Mitigation: documented here and in the brief's first-run finding as a limitation; the fit term is labelled `model-judgment` in every trace and is not to be trusted as a ranking signal. Fit, as built, cannot see the job description at all — it only sees a company's top recorded titles, which is a narrower problem than word-overlap scoring alone; a job-description-level signal (per `case-data-ml-h1b-triage`'s own stated limitation) would need actual posting text this recipe's data source doesn't have.
2. **0% skip rate.** The build recommends Apply or Consider for every company it scores. Mitigation: the two structural causes are named, not hidden. The liveness gate never runs, so every role gets 1.0; and the pre-filter admits only companies that already sponsored ML titles, whose shrunk `sponsorship.p` ranges from 0.839 to 0.9995. A reader should treat Consider as "not ruled out", not as a recommendation.
3. **Keyword false negatives.** Uber and Intel sponsor large numbers of software roles, and very likely hire ML engineers, but they are never scored because their recorded top titles ("Software Engineer" and similar) contain no ML keyword. Mitigation: named here. No false-negative rate is claimed, since there is no labelled ground truth to measure one against. A substring bug that let "llm" match inside "Fulfillment" was found and fixed, removing two false positives.
4. **Funding-stage lag assumption dominating the ranking.** Early-stage companies are assumed to hire in 21 days (timeline factor 1.0) and Series C or later in 56 days (factor 0.643). That one asserted assumption is the single biggest unverified input in the whole recipe: early-stage companies average 0.428 and late-stage 0.277, and Microsoft ranks 176th of 183. Mitigation: stated explicitly, labelled `your-input` in every timeline trace with the lag used, and recorded in the build audit, so a reviewer can see that the ordering comes from it rather than from evidence.

## Alternatives considered

- **LCA-by-SOC filtering instead of title keywords.** Summer 2026's
  `case-ml-sponsorship-triage` plans to filter by ML-adjacent SOC codes
  (15-1252, 15-2051, 15-1299) from LCA disclosure data, which records an
  SOC code and job title per petition. That would catch sponsors like Uber
  and Intel, whose top-5 recorded titles don't contain an ML keyword but
  whose LCA filings likely do, and would give fit more than five possible
  values. This recipe uses company-level title keywords instead because
  the LCA dataset isn't present in this repo and fetching it is a
  network/ingest step outside this recipe's scope — not because the
  title-keyword approach is the better method.
- **Separating unverified companies instead of scoring them as live.**
  Summer 2026's `case-nlp-ml-sponsorship-triage` proposes routing
  unverified companies to a separate manual-check list rather than
  defaulting their liveness to 1.0. This recipe does the latter, which is
  one of the two causes of its 0% skip rate (see Named Failure Mode 2).
  The separate-list approach is more honest about what hasn't been
  checked, and is the clearer direction for closing that gap in a future
  revision.
