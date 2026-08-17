# skill-demand-monitor — Human Card

*Read this before trusting a `skill-demand.md` report. This is the first `.card.md`
in this project's lineage — see `SNICKERDOODLE.md` P5 ("every recipe is executable
by the agent and readable by the domain human... one artifact cannot serve both").*

## Purpose

Given a set of job postings, tells you which tools/skills/frameworks are actually
mentioned across them — optionally narrowed to a specific role — with every count
traceable to the postings that produced it. Built to help a job-seeker see real
demand signal instead of guessing what to study, without pretending to know more
than a keyword match against postings text can support.

## What it can verify

- That a given skill's canonical patterns appear in the title/description text of N
  distinct postings out of the candidate set, with the exact posting IDs and URLs
  as evidence.
- That a role-filter, sample-size, or schema-completeness gate held (i.e., the run
  refused to rank when it should have) — this is mechanically checked by
  `skill-demand-monitor.test.mjs`, not asserted.

## What it cannot verify

- Whether a mentioned skill is actually **required** to get hired, versus listed
  aspirationally (see Failure Mode 3).
- Whether the taxonomy is complete for a given role/company mix (see Failure Mode 1).
- Which skill gap is most valuable to close next — that is a judgment call about
  your specific situation this tool does not make (see Failure Mode 5).
- Anything about postings not included in the input file. This tool does not scrape;
  it only reports on what it's given.

## Dependencies

- Node.js only (no external npm packages). Zero network calls — pure local text
  matching against `scripts/score/taxonomy/ai-engineering-skills.json`. Fully
  reproducible and zero-token.
- A postings file in the unified job-record schema (see `recipes/skill-demand-monitor.md` §6).

## Annotated commands

```bash
# Real run against the committed synthetic example, filtered to AI Engineer roles:
node scripts/score/skill-demand-monitor.mjs data/examples/skill-demand/example-postings.json \
  --role-filter "ai engineer" --md reports/generated/skill-demand-demo.md

# Same, with a gap-diff against a skills profile (safe example, or your real
# private/skills-profile.json):
node scripts/score/skill-demand-monitor.mjs data/examples/skill-demand/example-postings.json \
  --role-filter "ai engineer" --profile data/examples/skill-demand/example-profile.json

# Verification harness (must pass before trusting any change to the script):
node scripts/score/skill-demand-monitor.test.mjs
```

## What it produces

- `skill-demand.json` — the machine-readable run record (gate outcomes, rejects by
  reason, ranked skills with full evidence arrays).
- `skill-demand.md` — the human report: gates table, ranked skill table with sample
  evidence links, and an explicit verified-vs-inferred boundary.

## Failure modes

1. **Taxonomy drift.** The taxonomy (`ai-engineering-skills.json`, dated
   `_last_updated`) is human-curated and does not auto-discover new tools. A
   framework released after that date is invisible and silently undercounted — a
   "0 mentions" result can mean "not mentioned" or "not in the taxonomy yet," and
   the report cannot tell you which. Re-check the taxonomy's date before trusting a
   surprising absence.
2. **Contract violation.** The script trusts its own gates, not upstream promises.
   If a caller pre-filters or pre-cleans postings before passing them in (e.g.
   silently dropping postings that would have failed the schema gate), the
   sample-size and coverage gates operate on an already-degraded view and cannot
   detect what they never saw. The gates protect against bad input *the script
   receives*, not against a dishonest caller.
3. **Requirement inflation.** Job postings routinely list more skills than a role
   actually needs on day one (padded or aspirational requirements). A high mention
   count measures what employers **ask for** in text, not what the job **needs** —
   treating this report as a hiring requirement rather than a demand-mention signal
   is a misuse of what it verifies.
4. **Small-sample false confidence.** Passing the `--min-sample` gate (default 20)
   is a floor, not proof of statistical power. A role filter narrow enough to just
   clear the floor can still produce a thin ranking that reads as more authoritative
   than 20-odd postings actually support. `--min-sample` can also be overridden
   below the tool's own default — the report will loudly flag this
   (`min_sample_overridden_below_default`) when it happens, but nothing stops a
   caller from lowering it just to force a ranking out. Found the hard way: an
   early version's "In short" line unconditionally said "enough data to trust this
   ranking" whenever the gate mechanically passed, even with `--min-sample 2` —
   fixed in `logs/RUN_LOG.md`'s 2026-08-14 real-run entry, but a reminder that a
   gate can pass and still not mean what a casual reader assumes it means.
5. **Profile-gap judgment.** `has_evidence: false` is a verifiable fact about
   whether a skill label appears in a supplied profile file — it is not a
   recommendation. Treating the resulting gap list as "learn this first" prescriptive
   career advice attributes a judgment call to the script that it explicitly does
   not make; frequency and profile-evidence are reported as facts about the input,
   and prioritizing among them is left to the human (see the report's own
   verified-vs-inferred section).
6. **Upstream data-source quality varies and this tool cannot detect why.** Real
   Greenhouse postings pulled via the upstream engine's own production scraper
   arrive with `description_text` always empty — that scraper's `normalize_job()`
   hardcodes the field to `""` regardless of what the API returns, a limitation in
   that scraper, not in this tool. This tool's schema gate correctly rejects those
   records (`missing_description_text`) rather than silently ranking on titles
   alone, but it cannot tell you *why* an ATS source is thin — only that it is. See
   `logs/RUN_LOG.md`'s 2026-08-14 real-run entry: 1,437 of 1,702 real postings from
   Anthropic and Databricks were rejected for exactly this reason.
