# Reading a Closed Door: A Workday Connector for an Evidence-First Job Search

**Contribution to [The Reallocation Engine](https://github.com/nikbearbrown/the-reallocation-engine)** · [Pull request #42](https://github.com/nikbearbrown/the-reallocation-engine/pull/42) · Python, public HTTP, no LLM calls

---

## The problem

An international student on F-1 OPT has a hard deadline and a soft signal. The deadline is real: 90 days of unemployment before status lapses. The signal — whether a job posting is worth an application — is almost entirely hidden. Applying is cheap to start and expensive to finish, so the binding constraint is not effort. It is knowing which doors are actually open.

The Reallocation Engine attacks that asymmetry by refusing to score a role it cannot see. Posting liveness is a *gate*, not a vote: if the engine cannot confirm a requisition exists right now, the role is skipped regardless of how attractive it looks. That design makes the engine only as useful as the boards it can read.

Before this contribution, it could read three: Greenhouse, Lever, and Ashby. **Workday — the ATS behind a large share of enterprise and public-sector employers — was unsupported.** For a student targeting established employers rather than startups, that is not a gap in coverage. It is a silent, systematic bias in which employers the engine is capable of recommending at all. Roles at Workday employers were not scored badly; they were invisible.

## What I built

A zero-token connector that takes one input a person can copy from a browser — a public Workday careers URL — and returns validated postings in the engine's unified schema.

```
  careers URL                                      unified postings
  (operator input)                                 (engine schema)
       │                                                  ▲
       ▼                                                  │
  ┌─────────────────┐   ┌──────────────┐   ┌──────────────────────┐
  │ parse_careers_  │──►│ Workday CXS  │──►│ classify → normalize │
  │ url()           │   │ public API   │   │ → validate           │
  │ host/tenant/    │   │ paginated,   │   │                      │
  │ career-site     │   │ retry+backoff│   │                      │
  └─────────────────┘   └──────────────┘   └──────────────────────┘
       │ no match                                        │
       ▼                                                 ▼
  invalid_careers_url                    found · empty · not_found · errors
  (no HTTP request made)
```

Three design decisions carry most of the value:

**Every company lands in exactly one of five buckets.** `found`, `empty`, `not_found`, `invalid_careers_url`, `errors`. An employer with zero open roles is a *verified fact* and is recorded as one. A network timeout is a *failure to observe* and is recorded as one. Collapsing those two into a single "no results" is how a search system quietly teaches someone to stop looking at an employer who is in fact hiring.

**A malformed URL never touches the network.** It fails a pattern gate and is logged as a configuration fault. A typo should not look like an outage.

**Missing fields stay missing.** No LLM, no inference, no plausible-looking defaults.

The connector ships with an AI-executable recipe, a human-readable card, a plausibility auditor (`audit.py`) that counts what is actually on disk, 94 offline tests, and a signed attestation.

## The measurable improvement

**Workday employers readable by the pipeline: 0 → live-verified, at 39 postings with 0 validation errors.**

Measured on City of Aurora's public board:

| Metric | Value | Source |
|---|---|---|
| Postings retrieved | 39 | `metadata.json` → `job_count` |
| Board's own reported total vs. records kept | 39 vs. 39, reconciled | `audit.py` |
| Validation errors | 0 | `validation_error_count` |
| Required fields populated | 6/6 on 39/39 records | `audit.py` |
| Generated posting URLs spot-checked live | 2/2 returned HTTP 200 | direct fetch |
| Offline test suite | 94/94 passing | `pytest` |

**What this number is not.** It is one tenant. It supports no claim about Workday employers in general, and I do not report a coverage rate, because I have not measured one. The honest headline is a capability that did not exist and now does, verified end-to-end against a real board — not a percentage.

## The bug worth reporting

The most useful result came from trying to break my own connector rather than from running it.

I pointed it at a tenant I invented: `fakecorpxyz123.wd1.myworkdayjobs.com`. I expected `not_found`. It returned `errors`.

The connector had assumed HTTP 404 was the only "this board does not exist" signal. Workday returns **422** for an unknown tenant. The consequence was quiet and worse than a crash: a permanent configuration mistake — a misspelled employer — was being filed alongside timeouts and 5xx, where a retry policy would treat it as transient and keep trying a board that will never exist.

I confirmed the behavior on two independent fabricated tenants before changing any code, then reclassified 422 alongside 404 while **retaining the status code** so the two causes stay distinguishable in the data (404 = unknown career site, 422 = unknown tenant). A regression test pins the narrower claim: a 422 arriving *mid-run* is not a missing board, and must degrade the run to `partial` rather than discard the pages already fetched.

A related attempt to fool it is worth naming: `*.wd1.myworkdayjobs.com` is **wildcard DNS**. My fabricated tenant resolved to the same IP address as the real one. Any existence check built on DNS resolution would have confidently reported an invented employer as real. Only the HTTP status code can tell them apart.

The plausibility auditor found a second defect: `summary.json` is rewritten by every run while per-company directories persist, so after a real run followed by a break test, the directory held 39 real records while the summary reported zero found. Anything reading only the summary would conclude the run found nothing. The audit flags it; the connector does not yet prevent it, and the card documents it as a known failure mode.

## Verified vs. inferred

The full boundary table is in the repository (`VERIFIED-INFERRED.md`), labeling every emitted field as `record`, `script-output`, `your-input`, or `missing`. The headline: **the `model-inference` column is empty. This component makes no LLM calls of any kind.**

The line I care most about is the one where the connector refuses to fill a field. Four optional fields — `location`, `department`, `employment_type`, `date_posted` — are empty on all 39 records, because this tenant's list endpoint does not return them.

Location text *is* present in the raw response, sitting inside `bulletFields`, an undocumented positional array that reads `[requisition_id, location]` on this board. Reading index `[1]` as "location" would have filled a field on all 39 records and made the output look considerably richer. I left it undecoded. The array is a per-tenant display configuration; its ordering on one board is not evidence of its ordering on another, and shipping a positional guess as a verified field is precisely the error this system exists to prevent. The machine can see the value. It cannot know what the value *is*.

## Failure modes

1. **URL-pattern drift.** Workday changed its URL scheme once during this build. If it changes again, parsing fails and companies route silently to `invalid_careers_url`.
2. **Status-code drift** — the 422 bug above, caught live and fixed, but the class of error recurs whenever a vendor changes what a code means.
3. **`bulletFields` temptation** — the standing pressure to decode a field the source does not label.
4. **Wildcard-DNS false confidence** — resolution can never prove a tenant exists.
5. **Thin-schema tenants degrade quietly** — valid records that carry much less than other ATS sources.
6. **`summary.json` vs. disk drift** — the reconciliation defect the auditor found.

## The one limitation I cannot verify

**The rule "422 means unknown tenant" is confirmed on exactly one Workday pod (wd1), against two fabricated tenants.** It is not verified on wd3, wd5, or wd12, and nothing protects it against Workday's next API change.

If another pod uses 422 differently, this connector will report a reachable board as nonexistent — and it will do so quietly, in the wrong direction, filing a real employer as a dead end. That is the worst failure this component can produce, I know it is possible, and I have not ruled it out. It is why the signed attestation reads **RUNNABLE-LIVE, not VERIFIED**: the evidence supports operating it, not trusting it unattended.

## Demo

- **Pull request with full diff and maintainer-facing description:** [nikbearbrown/the-reallocation-engine#42](https://github.com/nikbearbrown/the-reallocation-engine/pull/42) — 12 files, 2,835 additions, no deletions
- **Run it yourself** (public data, no credentials, no API key):

```bash
cd scripts/ats
python -m scrapers.workday.scraper \
  --company "City of Aurora" \
  --careers-url "https://auroragov.wd1.myworkdayjobs.com/Careers" \
  -o ../../data/ats/workday/

# [1/1] City of Aurora -> auroragov: found 39 jobs
# 1 found · 0 empty · 0 not found · 0 invalid URL · 0 errors

python -m pytest scrapers/workday/test_scraper.py -q
# 94 passed
```

- **The honest run**, including pasted terminal output, all three break attempts, and an account of what the component cannot know: `docs/workday-connector-honest-run.md`
