---
status: RUNNABLE-LIVE  # DRAFT | SPECIFIED | RUNNABLE-SAMPLE | RUNNABLE-LIVE | VERIFIED
todos_open: 0
last_gate: "live-run, 2026-08-12, logs/RUN_LOG.md#2026-08-12"
attestation: null      # path to attestation record, set only at VERIFIED
recipe_version: 0.2.0
---

# Card: Workday ATS Connector

## Purpose

Pulls live, public job postings from a company's Workday careers site into the
unified postings schema, closing a named gap (Ch 8 ships only Greenhouse/Lever/Ashby).

## What it can verify

- That a given Workday board is reachable and how many postings it reports right now.
- That a posting's title, ID, and public URL are real (straight off the live API response).
- That a generated source_url actually resolves (spot-checked live, HTTP 200).
- Whether a tenant/career-site pair exists at all, distinct from whether it currently has zero open postings.

## What it can't verify

- Location, department, employment type, or posting date, on tenants whose CXS list endpoint doesn't expose them.
- Whether a posting is still accepting applications — that's liveness-core.mjs's job downstream.
- What bulletFields positions mean on a tenant it hasn't seen — undocumented, tenant-specific.

## Dependencies

- scripts/ats/scrapers/common/ (retry, rate limiter, schema validator, logger, config).
- Public internet access to *.wd<N>.myworkdayjobs.com. Note: blackholed inside at least one sandboxed execution environment encountered during development; sandbox must be disabled for live runs.

## Annotated commands

python -m scrapers.workday.scraper --company "City of Aurora" --careers-url "https://auroragov.wd1.myworkdayjobs.com/Careers" -o data/ats/workday/
python -m scrapers.workday.scraper --file companies.csv -o data/ats/workday/


## What it produces

Per-company jobs.json (raw), normalized_jobs.json (unified schema), metadata.json, plus a root summary.json sorting every company into found/empty/not_found/invalid_careers_url/errors.

## Failure modes

1. **URL-pattern drift.** Workday already changed its URL scheme once during this build (path-based to subdomain+career-site). If it changes again, parse_careers_url() stops matching and companies silently route to invalid_careers_url.

2. **Status-code drift (contract-violation, caught live).** The connector initially assumed 404 was the only "doesn't exist" signal. Live testing found unknown tenants return 422, not 404 — a misclassification that would have sorted a permanent configuration error into the same bucket as a transient network failure. Fixed after confirmation on two independent bogus tenants.

3. **Contract-violation risk: bulletFields temptation.** The raw response contains location, unlabeled, inside bulletFields[1] on the one tenant tested. Mapping it by position without per-tenant confirmation would print an inferred field as verified.

4. **Wildcard-DNS false confidence.** *.wd1.myworkdayjobs.com resolves for any subdomain, real or fake. DNS resolution can never distinguish a real tenant from a fake one — only the HTTP status code can.

5. **Summary-vs-disk drift (found live).** `summary.json` is rewritten by every run, but per-company directories persist. After a real run followed by a break test, the directory held 39 records while the summary reported zero found. Anything reading only the summary would conclude the run found nothing. `audit.py` flags this; the connector does not prevent it.

6. **Thin-schema tenants degrade quietly.** Some tenants' list endpoints don't return location/department/employment_type/jobPostingId at all — not an error, but a real asymmetry versus other ATS sources.
