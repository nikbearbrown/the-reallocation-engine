---
status: RUNNABLE-SAMPLE
todos_open: 0
last_gate: "sample-run, 2026-08-14, logs/RUN_LOG.md#2026-08-14"
attestation: null
recipe_version: 1.0.0
---

# skill-demand-monitor — Tool And Stack Signals For Job Intelligence

## 1. Executive Summary

Infers which tools, platforms, and skills are mentioned across a set of job
postings, optionally narrowed to a specific role (e.g. "AI Engineer" rather than
the broader "ML Engineering" category), and reports a ranked, evidence-linked
frequency signal: which skills come up, in how many *distinct* postings, and which
postings back that count. It is a demand-**mention** signal, not a hiring-
**requirement** signal — see `recipes/skill-demand-monitor.card.md` for the full
boundary. This recipe promotes the prior DRAFT specification (v0.1.0, eleven open
TODO items, zero implementation) to RUNNABLE-SAMPLE with a real, working script.

## 2. Required Reads

Read before running or modifying this recipe:

- `SNICKERDOODLE.md` — the governance contract (verification stack, recipe lifecycle, logging rules).
- `DOMAIN.md` — this project's index and layout.
- `recipes/skill-demand-monitor.card.md` — the human card: what this tool can and cannot verify, and its six named failure modes. Read this before trusting any output.

## 3. Phase Gates

Each gate is a hard stop implemented in `scripts/score/skill-demand-monitor.mjs`, not a weighted vote — a closed gate halts the run and emits **no ranked list**, regardless of how much data came before it.

1. **Schema gate.** Every posting must carry `job_id`, `title`, `company_name`, `source_url`, `description_text`. Records missing any of these are rejected with a named reason (`missing_<field>`) and counted, never silently dropped.
   *Failure path:* a malformed or empty input file causes `JSON.parse` to throw and the process exits non-zero — the run stops before any output is written.
2. **Role-filter gate.** If `--role-filter` is given, titles are matched against a small, explicit, inspectable synonym table (`CONFIG.role_filter_synonyms` in the script) — never fuzzy or LLM-based matching.
   *Failure path:* zero matches → `status: "role_filter_matched_nothing"`, no ranked list. The gate never silently falls back to the unfiltered set.
3. **Sample-size gate.** Fewer than `--min-sample` (default 20) surviving postings.
   *Failure path:* `status: "insufficient_sample"` — no ranked list is written, exit code 0 (an honest "skip," not an error). See `skill-demand-monitor.test.mjs` case 1 for the automated proof that this gate actually holds.
4. **Taxonomy-coverage gate.** If more than 40% of candidate postings match zero taxonomy skills.
   *Failure path:* the run still ranks (the ranking may be a true empty list), but sets `low_coverage: true` and the Markdown report prints a prominent warning instead of a confident-looking table.

## 4. Primary Stored Tools

- `scripts/score/skill-demand-monitor.mjs` — the scorer (real, implemented; see Workflow).
- `scripts/score/skill-demand-monitor.test.mjs` — verification harness (4 gate-behavior / break-attempt cases).
- `scripts/score/taxonomy/ai-engineering-skills.json` — the versioned, human-curated skill taxonomy the scorer matches against.
- `scripts/ats/fetch-real-postings.py` — combines this repo's existing Greenhouse/Lever scrapers' output into one file matching this scorer's input schema.

## 5. Workflow

1. Obtain a postings file matching the unified job-record schema: the committed
   example at `data/examples/skill-demand/example-postings.json`, or real data via
   `npm run fetch-postings -- --greenhouse "Company" --lever "Company" -o private/real-postings/run.json`
   (uses this repo's own `scripts/ats/scrapers/` — see `scripts/ats/README.md`.
   Known limitation, found 2026-08-14: the Greenhouse scraper does not currently
   populate `description_text`, so Greenhouse-sourced postings will be rejected
   by the schema gate below — see `logs/RUN_LOG.md`).
2. Run the scorer:
   ```bash
   node scripts/score/skill-demand-monitor.mjs data/examples/skill-demand/example-postings.json \
     --role-filter "ai engineer" --profile data/examples/skill-demand/example-profile.json \
     --out-dir reports/generated --md reports/generated/skill-demand-demo.md
   ```
   This is the exact command that produced the committed
   `reports/generated/skill-demand-demo.{json,md}` — run it yourself and the
   output should match (modulo the `generated` date field). Always pass
   `--out-dir`: without it, the JSON output defaults to landing next to the
   input file — which, for the example fixture, means it lands inside
   `data/examples/skill-demand/`, mixed in with the hand-authored fixtures. That
   is a real rough edge, not a hypothetical one — see `logs/RUN_LOG.md`.
3. To run against your own real postings and skills instead of the committed
   example, swap the postings path and swap `--profile` to
   `private/skills-profile.json` (gitignored — never commit a real profile).
4. Read the gates section of the Markdown report first. If any gate halted the run, stop — do not re-run with a looser `--min-sample` or a broader filter just to force a ranked list out; that defeats the gate's purpose.
5. If ranked, read the skill table with its evidence links before acting on it — per the verified-vs-inferred boundary at the bottom of the report.

## 6. Output Contract

### Agent output
File: `<out-dir>/skill-demand.json` (default: alongside the input file).
Fields: `_tool, _recipe, generated, config, role_filter, taxonomy, total_postings_ingested, valid_count, rejects, rejects_by_reason, gates, status, candidate_count, zero_hit_rate, low_coverage, skills[]` (each with `id, label, category, posting_count, evidence[], has_evidence?`).

### Human report
File: `<out-dir>/skill-demand.md` (or `--md` path).
Reader: the student (or any user of this tool) deciding what to study next or how to position an application.
Sections: a plain-English "In short" headline first; if `--profile` was given and the run ranked, a frequency-sorted "skills you don't have evidence for yet" list; the full ranked skill table with evidence links; the verified-vs-inferred boundary; and the technical gates table (with failure-path detail) last, for anyone who wants to audit the run rather than just read the answer.

## 7. Verification Checks

```bash
node --check scripts/score/skill-demand-monitor.mjs
node --check scripts/score/skill-demand-monitor.test.mjs
node scripts/score/skill-demand-monitor.test.mjs   # 4 cases must pass
npm run verify                                      # conformance (machine half of P4)
npm run doctor                                      # environment + privacy-leak check
```

## 8. Logging Rules

Append a `## YYYY-MM-DD — skill-demand-monitor` entry to `logs/RUN_LOG.md` for every real run against non-trivial data, recording: inputs used, the command run, the gate outcomes, and any open issues (e.g. taxonomy gaps discovered). Never log real personal profile contents — reference `private/skills-profile.json` by path, not by content.

## 9. Stop Conditions

- Stop if the input file is not valid JSON, or contains no `postings`/array data.
- Stop (do not force a ranking) if the role-filter gate matches zero postings.
- Stop (do not force a ranking) if fewer than `--min-sample` postings survive gates 1–2.
- Do not report a "priority to learn" ordering — this script reports frequency and evidence-gap only; prioritization is a human judgment this recipe deliberately does not make.
