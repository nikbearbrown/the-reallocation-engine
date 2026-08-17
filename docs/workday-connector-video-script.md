> **Superseded (2026-08-16).** The TA specified two separate videos instead of
> one: `docs/video-1-project-overview-script.md` (what the project is, its
> application, how it's used) and `docs/video-2-build-process-script.md` (tools
> used, how they were used, including the uncut live-run requirement from this
> document). Kept for reference, not deleted, per the repo's no-delete rule.

# Explainer Video — Shot List and Script (Workday ATS Connector)

Target: 3–6 minutes. The graded core is **at least one unscripted, uncut segment
of a live terminal run** — real command, real output appearing in real time, no
cut inside the take. This document is the plan; the recording is yours to make.

**Before you record**

- Disable the sandbox / use a normal terminal. `*.myworkdayjobs.com` is blackholed
  inside at least one sandboxed environment; the live run needs real network.
- Run from `scripts/ats/` so the `scrapers` package imports.
- On screen: only City of Aurora, a fabricated tenant, and `example.com`. All
  public or invented. **No `private/`, no résumé, no personal tracker, no real
  application data.**
- Widen the terminal so the summary line doesn't wrap.
- One rehearsal for timing, then record the real take without cuts.

---

## Segment 1 — The asymmetry (~45s, talking head or slide)

> An evidence-first job-search pipeline can only reason about employers it can
> see. This one already read Greenhouse, Lever, and Ashby — but not Workday, one
> of the largest enterprise ATS platforms. Every Workday-hosted employer was
> invisible to it.
>
> That matters most for the people the engine is built for: international
> students and early-career technical workers on fixed visa timelines, deciding
> where to spend a limited number of applications. If an employer is missing from
> your pipeline, you cannot tell whether they have no openings or whether your
> tooling simply cannot read their job board. Those are very different facts, and
> the tool was silently conflating them.

## Segment 2 — The uncut live run (~2–3 min, screen capture, NO CUTS)

Start recording. Type each command live. Do not cut between them.

**Take 1 — the real board.**

```
cd scripts/ats
python -m scrapers.workday.scraper --company "City of Aurora" \
  --careers-url "https://auroragov.wd1.myworkdayjobs.com/Careers" -o ../../data/ats/workday/
```

Narrate while it runs: *one public careers URL in — the connector pulls the pod
host, the tenant, and the career-site name out of that single string, then pages
the public API. No API key, no credentials, no per-employer config.*

Expected: `[1/1] City of Aurora -> auroragov: found 39 jobs` · `1 found · 0 empty
· 0 not found · 0 invalid URL · 0 errors`

**Take 2 — the audit, still rolling.**

```
python -m scrapers.workday.audit ../../data/ats/workday
```

Narrate: *the audit doesn't say "pass." It says what it found* — and point at the
0% fill rates on location, department, employment type, and posting date. *That's
not a bug. This tenant's API doesn't return those fields, so the connector emits
nothing rather than something plausible.*

**Take 3 — break it on camera.**

```
python -m scrapers.workday.scraper --company "FakeCorp" \
  --careers-url "https://fakecorpxyz123.wd1.myworkdayjobs.com/Careers" -o ../../data/ats/workday-demo
```

Expected: `not found (HTTP 422 — unknown tenant)`.

Narrate: *this is the line that used to be wrong. I assumed 404 was the only
"board doesn't exist" signal. Workday returns 422 for an unknown tenant, so a
misspelled tenant was landing in the same bucket as a timeout — a permanent
mistake that looked retryable forever. Found it by trying to break my own
connector.*

**Take 4 — the gate that never touches the network.**

```
python -m scrapers.workday.scraper --company "BadURL Co" \
  --careers-url "https://example.com/not-workday" -o ../../data/ats/workday-demo
```

Expected: `invalid careers URL`, and note aloud that **no retry line appears** —
no HTTP request was attempted at all.

**If anything errors on camera, leave it in and narrate the fix.** Per the
assignment, that is the most honest footage available.

## Segment 3 — One thing learned, one honest limitation (~60s)

**What I learned from running it:**

> The specification I started from was wrong, and no amount of careful coding
> would have survived it. The host it named resolves to 127.0.0.1 — every request
> failed before leaving my machine. Finding that took a DNS sweep across pods and
> two resolvers. The fix wasn't a patched URL; it was a different interface —
> take the one URL a human can actually find, and derive the rest. I only learned
> that by running it against the real thing. It passed every test I had written
> at the time.

**The limitation I cannot verify:**

> The rule that HTTP 422 means "unknown tenant" is confirmed on exactly one
> Workday pod, against two fabricated tenants. I have not verified it on wd3,
> wd5, or wd12, and I cannot protect it against Workday changing their API. If
> another pod uses 422 for something else, my connector will report a real board
> as nonexistent — quietly, and in the wrong direction. That's why the attestation
> is signed at RUNNABLE-LIVE and not at full verification. A second tenant on a
> different pod is the first thing I'd want before promoting it.

## Segment 4 — Where to look (~15s)

On screen: the PR, the signed attestation, and the run log.

> The pull request has the full diff, the human-signed attestation with its "did
> not test" section, and a run log that keeps the failures in — including the
> misclassification and the evidence that justified fixing it.

---

## Timing

| Segment | Target |
|---|---|
| 1 — asymmetry | 0:45 |
| 2 — uncut live run | 2:00–3:00 |
| 3 — learned + limitation | 1:00 |
| 4 — where to look | 0:15 |
| **Total** | **4:00–5:00** |

## Pre-submit checklist

- [ ] Segment 2 is a single uncut take of a real terminal
- [ ] No real PII on screen at any point
- [ ] The 422 break attempt is shown, not just described
- [ ] One lesson and one honest limitation are both stated aloud
- [ ] Runtime is between 3 and 6 minutes
