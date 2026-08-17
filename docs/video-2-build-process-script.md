# Video 2 — How It Was Built, What Tools Were Used, and How

**Purpose (per TA guidance):** explain the build process and tooling, for a
viewer who wants to know how this was actually made. Target: 3–6 minutes.

**This is where the assignment's graded requirement lives:** at least one
unscripted, uncut segment showing a live terminal run — real command, real
output appearing in real time, no cut inside the take.

**Before you record**

- Disable the sandbox / use a normal terminal. `*.myworkdayjobs.com` is
  blackholed inside at least one sandboxed environment; the live run needs
  real network.
- Run from `scripts/ats/` so the `scrapers` package imports.
- On screen: only City of Aurora, a fabricated tenant, and `example.com`. All
  public or invented. No `private/`, no résumé, no real application data.
- Widen the terminal so the summary line doesn't wrap.
- One rehearsal for timing, then record the real take without cuts.

---

## 1. Tools used, and why (~45s, talking head or slide)

> This was built inside **The Reallocation Engine**, a repository governed by
> a written contract called SNICKERDOODLE — before anything gets called
> "verified," it has to pass a conformance check, a human-readable audit, and
> a signed human attestation, in that order. I didn't invent that process for
> this project; I built inside it, because it's what forces every number this
> connector prints to trace back to something real.
>
> The build itself: **Python**, structured to match the repo's existing
> Greenhouse and Lever connectors so it wasn't a one-off. **pytest** for a 94-
> case offline test suite that runs against a mocked transport — no network
> needed to check the logic. And **Claude Code**, an AI coding agent, as a
> collaborator I directed and reviewed, not a black box I trusted blind — every
> claim it made, I re-ran myself before it went in this repo.

## 2. How the tools were used — the actual sequence (~45s)

> The process wasn't write-once. The first working version assumed a URL
> pattern straight from the spec I was given — and every request failed,
> because that host resolves to `127.0.0.1`. Finding that took a DNS sweep
> across Workday's pods, not a code review. The fix wasn't a patched string;
> it was a different interface entirely — take the one URL a human can
> actually copy from a browser, and derive everything else from it.
>
> Then I tried to break my own connector on purpose. That's what the next
> segment shows.

## 3. The uncut live run (~2–3 min, screen capture, NO CUTS)

Start recording. Type each command live. Do not cut between them.

**Take 1 — the real board.**

```
cd scripts/ats
python -m scrapers.workday.scraper --company "City of Aurora" \
  --careers-url "https://auroragov.wd1.myworkdayjobs.com/Careers" -o ../../data/ats/workday/
```

Narrate while it runs: *one public careers URL in — the connector pulls the
pod host, the tenant, and the career-site name out of that single string,
then pages the public API. No API key, no credentials, no per-employer
config.*

Expected: `[1/1] City of Aurora -> auroragov: found N jobs` (the exact count
drifts run to run — this is a real, currently-hiring government board, not a
fixture. Say the number you see; don't pre-script it).

**Take 2 — the offline test suite, still rolling.**

```
python -m pytest scrapers/workday/test_scraper.py -q
```

Narrate: *this is 94 cases against a mocked transport — pagination, every
failure bucket, the field mappings — checked without touching the network.*
Expected: `94 passed`.

**Take 3 — the audit.**

```
python -m scrapers.workday.audit ../../data/ats/workday
```

Narrate: *the audit doesn't say "pass." It states what it found* — point at
the 0% fill rate on location, department, employment type, posting date.
*Not a bug — this tenant's own API doesn't return those fields, so the
connector emits nothing rather than something plausible.*

**Take 4 — break it on camera.**

```
python -m scrapers.workday.scraper --company "FakeCorp" \
  --careers-url "https://fakecorpxyz123.wd1.myworkdayjobs.com/Careers" -o ../../data/ats/workday-demo
```

Expected: `not found (HTTP 422 — unknown tenant)`.

Narrate: *this is the line that used to be wrong. I originally assumed HTTP
404 was the only "board doesn't exist" signal. Workday returns 422 for an
unknown tenant — so a misspelled tenant was landing in the same bucket as a
timeout, a permanent mistake that looked retryable forever. I found this by
deliberately trying to break my own code, on two independent fake tenants,
before changing anything.*

**Take 5 — the gate that never touches the network.**

```
python -m scrapers.workday.scraper --company "BadURL Co" \
  --careers-url "https://example.com/not-workday" -o ../../data/ats/workday-demo
```

Expected: `invalid careers URL` — and note aloud that **no retry line
appears**. No HTTP request was attempted at all.

**If anything errors on camera, leave it in and narrate the fix.** That is
the most honest footage available, and the assignment says so directly.

## 4. One thing learned, one honest limitation (~45s)

**Learned:**

> The spec I started from was wrong in a way no amount of careful coding
> would have caught — I only found it by running the thing against a real
> Workday board and watching it fail. Testing against a mock would have
> passed every time.

**Limitation I can't verify:**

> The rule that HTTP 422 means "unknown tenant" is confirmed on exactly one
> Workday pod, against two fabricated tenants. I have not checked it on wd3,
> wd5, or wd12, and nothing protects it against Workday changing their API.
> If another pod uses 422 for something else, this connector will report a
> real, reachable board as nonexistent — quietly, and in the wrong direction.
> That's why the signed attestation says RUNNABLE-LIVE, not VERIFIED.

## 5. Where the record lives (~20s)

On screen: the PR, the signed attestation, the run log.

> Everything is on the record: [nikbearbrown/the-reallocation-engine PR #42](https://github.com/nikbearbrown/the-reallocation-engine/pull/42)
> has the full diff, the human-signed attestation with a "did not test"
> section, and a run log that keeps the failures in — including the
> misclassification, and the live evidence that justified fixing it.

---

## Timing

| Segment | Target |
|---|---|
| 1 — tools used | 0:45 |
| 2 — how they were used | 0:45 |
| 3 — uncut live run | 2:00–3:00 |
| 4 — learned + limitation | 0:45 |
| 5 — where the record lives | 0:20 |
| **Total** | **~4:30–5:30** |

## Pre-submit checklist

- [ ] Segment 3 is a single uncut take of a real terminal
- [ ] No real PII on screen at any point
- [ ] Names the actual tools (Python, pytest, Claude Code) and how each was
      used, not just that they exist
- [ ] The 422 break attempt is shown, not just described
- [ ] One lesson and one honest limitation are both stated aloud
- [ ] Runtime is between 3 and 6 minutes
