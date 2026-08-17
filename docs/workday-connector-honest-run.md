# The Honest Run — Workday ATS Connector

Real commands, real output, one real bug, and an account of what this component
cannot know. Terminal output below is pasted from the runs, not retyped.

Companion documents: `scripts/ats/scrapers/workday/ATTESTATION.md` (human-signed),
`scripts/ats/scrapers/workday/VERIFIED-INFERRED.md` (boundary table),
`logs/RUN_LOG.md` (full development history).

---

## 1. Plausibility audit — before trusting the output

The run produced 39 records. Before treating that as a result, `audit.py` counts
what is actually on disk and reports it. The audit does not certify the run; it
states what it found.

```
$ python -m scrapers.workday.audit ../../data/ats/workday -o ../../data/ats/workday/workday-audit.md
Audit written to ..\..\data\ats\workday\workday-audit.md
1 company run(s) audited · 1 finding(s) recorded
```

What it checked, and what came back:

| Check | Result |
|---|---|
| Board-reported total vs. raw postings vs. records kept | 39 / 39 / 39 — reconciled |
| Duplicate `job_id` or `source_url` | none |
| Required fields non-empty (6 fields × 39 records) | complete |
| `source_url` host matches the run's host; all https | all 39 |
| Titles resembling a listing page rather than a requisition | none |
| `extraction_status` on every record | `success` × 39 |
| **summary.json vs. directories on disk** | **1 finding — see below** |

**The finding the audit caught:**

```
## Summary-vs-disk reconciliation

- `cityofaurora` holds 39 record(s) on disk but is absent from summary.json's
  found/empty buckets — residue from an earlier run (summary.json reflects only
  the most recent run; company directories persist)

Reading `summary.json` alone would misstate what this directory contains.
```

This is a real design characteristic worth stating plainly: **`summary.json` is
rewritten by every run, while per-company directories persist.** After running
the connector against Aurora and then against a fabricated tenant, the directory
holds 39 real records while the summary reports zero companies found. Anything
downstream that reads only the summary would conclude the run found nothing. The
audit now flags this; the connector does not yet prevent it.

The fill-rate table is the other substantive output — and the number that matters
is a zero:

| Field | Filled |
|---|---|
| `apply_url` | 39/39 (100%) |
| `location` | 0/39 |
| `department` | 0/39 |
| `employment_type` | 0/39 |
| `date_posted` | 0/39 |

Four optional fields are empty on every record. That is a fact about this
tenant's API response, not a connector defect — and it is why the connector emits
nothing rather than something plausible. See §5.

## 2. Real terminal output

**The live run** against City of Aurora's public Workday board:

```
$ python -m scrapers.workday.scraper --company "City of Aurora" \
    --careers-url "https://auroragov.wd1.myworkdayjobs.com/Careers" -o ../../data/ats/workday/

[1/1] City of Aurora -> auroragov: found 39 jobs

1 found · 0 empty · 0 not found · 0 invalid URL · 0 errors
```

**Test suite** — 94 tests, offline, no network:

```
$ python -m pytest scripts/ats/scrapers/workday/test_scraper.py -q
........................................................................ [ 76%]
......................                                                   [100%]
94 passed in 3.18s
```

**Ethics gate — privacy.** Run with the real scrape output present on disk, which
is the case the gate exists to catch:

```
$ npm run doctor
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked
--- doctor exit=0 ---

$ git status --porcelain          # nothing private staged
$ git check-ignore -v data/ats/workday/cityofaurora/normalized_jobs.json
data/ats/.gitignore:11:*	data/ats/workday/cityofaurora/normalized_jobs.json
```

All four scrape artifacts resolve to a bare `*` wildcard in `data/ats/.gitignore`.
Nothing under `data/ats/` can be committed.

**Ethics gate — conformance.** `npm run verify` **passes.** An earlier version of
this document reported it as failing with six `E3` errors. That report was wrong,
and the correction is worth recording, because the failure was real on the machine
that observed it:

```
$ npm run verify          # LF checkout (Linux/CI default, git core.autocrlf=false)
conformance: 139 files — ✓ all conform
✓ manifest check passed (4 warnings)
```

The six `E3` "out of sync with instructions/" errors appear **only on a Windows
checkout with `core.autocrlf=true`**, and they appear identically on pristine
upstream `main`. The cause is line endings, not content:

```
$ wc -c AGENTS.md instructions/.build/AGENTS.md
 7975 AGENTS.md
 8073 instructions/.build/AGENTS.md

$ diff <(tr -d '\r' < AGENTS.md) <(tr -d '\r' < instructions/.build/AGENTS.md)
$ echo $?
0
```

Strip carriage returns from both sides and the files are byte-identical.
`build-instructions.mjs` does not normalize line endings, so on a CRLF checkout a
fresh build emits a different mix of CRLF and LF than the committed file, and the
exact-string comparison in `manifest-check.mjs` fails. The same mechanism makes
`doctor.mjs` report 0 of 44 recipes carrying lifecycle frontmatter on a CRLF
checkout and 44 of 44 on an LF one.

Confirmed across the full matrix — `main` and this branch, CRLF and LF:

| Branch | Checkout | `manifest-check` |
|---|---|---|
| `main` | CRLF | ✗ 6 × E3 |
| `main` | LF | ✓ passed |
| `contrib/…workday-connector` | CRLF | ✗ 6 × E3 |
| `contrib/…workday-connector` | LF | ✓ passed |

This contribution adds zero conformance errors. Two upstream robustness defects
are filed from this finding: `manifest-check.mjs` and `doctor.mjs` should both
normalize line endings before comparing. Neither is fixed here — both are outside
this contribution.

## 3. Break attempts

The break attempt is the part worth reading. Three deliberate attempts to make
the connector produce a wrong answer:

**Break 1 — a tenant that does not exist.**

```
$ python -m scrapers.workday.scraper --company "FakeCorp" \
    --careers-url "https://fakecorpxyz123.wd1.myworkdayjobs.com/Careers" -o ...

WARNING | Non-retryable status 422 for https://fakecorpxyz123.wd1.myworkdayjobs.com/wday/cxs/fakecorpxyz123/Careers/jobs
[1/1] FakeCorp -> fakecorpxyz123: not found (HTTP 422 — unknown tenant)

0 found · 0 empty · 1 not found · 0 invalid URL · 0 errors
```

**This one found a real bug.** On the first attempt it did *not* report
`not found` — it reported `errors`, because the connector assumed HTTP 404 was
the only "this board does not exist" signal. Workday returns **422** for an
unknown tenant. The consequence was quiet and worse than a crash: a permanent
configuration mistake was being filed alongside timeouts and 5xx, so a misspelled
tenant would look like a transient failure worth retrying forever. Confirmed on
two independent fabricated tenants before changing anything, then reclassified,
with the status code retained so 404 and 422 stay distinguishable. A regression
test pins the narrower claim that a 422 *mid-run* is not the same as a missing
board — it degrades the run to `partial` instead.

A related attempt to fool it: `*.wd1.myworkdayjobs.com` is **wildcard DNS**.
`fakecorpxyz123` and `zzznope999` both resolve to `209.177.165.20`, the same
address as the real `auroragov`. DNS resolution cannot distinguish a real tenant
from an invented one; only the HTTP status can. Any existence check built on DNS
would have reported a fabricated employer as real.

**Break 2 — a URL that is not a Workday board at all.**

```
$ python -m scrapers.workday.scraper --company "BadURL Co" \
    --careers-url "https://example.com/not-workday" -o ...

ERROR | INVALID_CAREERS_URL BadURL Co: 'https://example.com/not-workday' does not
        match https://<tenant>.wd<N>.myworkdayjobs.com/<career-site>
[1/1] BadURL Co -> https://example.com/not-workday: invalid careers URL

0 found · 0 empty · 0 not found · 1 invalid URL · 0 errors
```

No HTTP request is attempted — confirmed by the absence of any retry log line and
by a test that spies on the transport and asserts zero calls. A malformed URL is
a configuration fault, and treating it as a network failure would have made a
typo look retryable.

**Break 3 — a real tenant with a career site that does not exist.**

```
$ python -m scrapers.workday.scraper --company "Aurora Wrong Site" \
    --careers-url "https://auroragov.wd1.myworkdayjobs.com/NotARealSite" -o ...

WARNING | Non-retryable status 404 for https://auroragov.wd1.myworkdayjobs.com/wday/cxs/auroragov/NotARealSite/jobs
[1/1] Aurora Wrong Site -> auroragov: not found (HTTP 404 — unknown career site)

0 found · 0 empty · 1 not found · 0 invalid URL · 0 errors
```

This is the first **live** confirmation of the 404 branch, which until now had
only been exercised against mocks. A real tenant with a wrong career site is
correctly separated from a wrong tenant, and the summary record keeps the status
code (`404` here, `422` in Break 1) so the two causes remain distinguishable in
the data.

**The break attempt that failed to break it:** an empty board (a reachable
tenant with zero openings) has still only been exercised against mocks. No public
Workday board with zero postings was located during this work, so the EMPTY path
is tested but not field-confirmed.

## 4. Metric readout

| Metric | Value | Source |
|---|---|---|
| Workday employers reachable by the pipeline before this contribution | 0 | Ch 8 ships Greenhouse, Lever, Ashby only |
| Live postings retrieved, City of Aurora | **39** | `metadata.json`, `job_count` |
| Board-reported total vs. records kept | 39 vs. 39 | `total_reported` vs. `len(records)` |
| Validation errors | **0** | `validation_error_count` |
| Required-field completeness | 6/6 fields on 39/39 records | `audit.py` |
| Optional-field fill rate, 4 thin fields | **0%** | `audit.py` |
| Generated posting URLs spot-checked live | 2/2 returned HTTP 200 (~31–33 KB) | direct fetch |
| Offline test suite | **94/94 passing** | pytest |
| New conformance errors introduced | **0** | `npm run verify` on this branch vs. pristine `main` |
| Bugs found by break attempts | **1** (422 misclassification), fixed | §3 |

The one metric this component deliberately does not report is a coverage rate.
One tenant has been run. That supports no claim about Workday employers in
general, and inventing one would be the specific failure this project exists to
prevent.

## 5. What the machine could not know

**Whether a posting is real work or a ghost.** The connector confirms a board
returned a requisition today. It cannot tell whether that requisition
corresponds to a role anyone intends to fill. That judgment needs the liveness
gate downstream and, past that, a human reading the posting.

**What `bulletFields` means.** The raw response carries location text inside an
undocumented positional array — on Aurora, `[requisition_id, location]`. Reading
index `[1]` as "location" would have filled a field on all 39 records and made
the output look richer than the source supports. The array is a per-tenant
display configuration; its ordering on one board is not evidence of its ordering
on another. The machine can see the value. It cannot know what the value *is*.
It is left empty, and that emptiness is the honest output.

**Whether 422 always means "unknown tenant."** Confirmed on one pod against two
fabricated tenants. Whether it holds on wd3, wd5, wd12, or after Workday's next
API change is not something testing on wd1 can establish. If another pod uses 422
differently, this connector will call a reachable board nonexistent — a silent
error in the wrong direction.

**Whether this is the right board for the employer.** A careers URL is an
operator input. If someone supplies a subsidiary's board, or an internal-mobility
site, the connector will scrape it correctly and report nothing unusual. Nothing
in the response says "this is the wrong employer."

**Whether an empty field is empty at the source.** The connector reports
`location: ""` for all 39 records. Distinguishing "the API did not send it" from
"the connector dropped it" requires comparing `jobs.json` against
`normalized_jobs.json` by hand. The audit reports the rate; it does not
adjudicate the cause.

**Whether 39 is the right number.** `total_reported: 39` is Workday's own count,
copied verbatim. The connector paginated until it had 39 and stopped. If the
board under-reports its own total, the connector inherits that error and reports
it with the same confidence as a correct one.

---

### The handoff

What this component hands back to a person: whether an employer is worth
pursuing, whether a thin record with no location is still worth an application,
and whether a board that reports zero openings means "no openings" or "we are
looking at the wrong board." The connector narrows the search space and refuses
to guess past its evidence. Every decision that follows is the reader's.
