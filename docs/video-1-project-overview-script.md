# Video 1 — The Project, Its Application, and How It's Used

**Purpose (per TA guidance):** explain what the project is, what it's for, and
how it gets used — for a viewer who isn't grading your code, just deciding
whether the thing is worth their attention. Target: ~3–4 minutes. Talking head
+ screen, light on terminal, no requirement for an uncut take (that requirement
lives in Video 2).

**On screen at any point:** only City of Aurora (a real public government job
board), fabricated tenants, and `example.com`. No `private/`, no résumé, no
real application data.

---

## 1. The problem (~50s)

> If you're an international student on F-1 OPT, you have a hard deadline —
> 90 days of unemployment before your status lapses — and a soft signal: no
> way to tell which job postings are actually worth an application before you
> spend hours on one. Applying is cheap to start and expensive to finish, so
> the real constraint isn't effort. It's knowing which doors are actually open.
>
> The Reallocation Engine is a job-search system built around that idea. It
> reallocates scarce application effort using real evidence — company funding,
> sponsorship history, whether a posting is actually live, role quality, visa
> timeline — and it treats two of those, liveness and timeline, as **gates,
> not votes**. If the engine can't confirm a posting is real right now, it
> skips the role, no matter how good it looks on paper. A healthy run skips at
> least half of what it evaluates. Skipping is the system working, not failing.

## 2. Where the gap was (~40s)

> That design only works for employers the engine can actually see. Before
> this contribution, it could read postings from three platforms — Greenhouse,
> Lever, Ashby. Workday was not one of them, and Workday is behind a large
> share of enterprise and public-sector employers. Roles at those companies
> weren't scored badly by the engine. They were invisible to it. For a student
> targeting an established employer rather than a startup, that's not a minor
> coverage gap — it's a blind spot built into the tool itself.

## 3. What I built (~60s)

Screen: the architecture diagram from `docs/workday-connector-case-study.md`.

> I built a connector that closes that gap. You give it one thing a person can
> copy straight out of a browser — a company's public Workday careers URL —
> and it returns validated job postings in the engine's shared format. No API
> key, no login, no per-employer setup.
>
> Every company it looks at lands in exactly one of five outcomes: **found**,
> **empty**, **not found**, **invalid URL**, or **error**. That distinction
> matters more than it sounds like it should. An employer with zero open roles
> right now is a *fact* — record it as one. A network timeout is a *failure to
> find out* — record that separately. Collapsing those two is exactly how a
> tool quietly teaches someone to stop looking at an employer who's actually
> hiring.

Short demo clip (not required to be uncut — a clean take is fine):

```
python -m scrapers.workday.scraper --company "City of Aurora" \
  --careers-url "https://auroragov.wd1.myworkdayjobs.com/Careers" -o data/ats/workday/
```

> Real board, real postings, live, right now.

## 4. How it gets used (~50s)

> In practice, this plugs into the same pipeline that already reads
> Greenhouse and Lever. A student — or the engine, running unattended — feeds
> it a careers URL, gets back postings tagged as genuinely live, and those
> postings flow into the same scorer that checks sponsorship history, company
> funding, and visa timeline before ever suggesting "apply here." The
> connector doesn't decide whether a job is worth applying to. It answers a
> narrower, verifiable question first: **does this board actually have this
> opening right now** — so that everything downstream is reasoning about real
> postings instead of guesses.

## 5. What it doesn't claim (~30s)

> It doesn't guess. Four optional fields — location, department, employment
> type, posting date — are empty on every record from this board, because
> Workday's own API doesn't return them here. The connector leaves them blank
> instead of inventing something plausible-looking. That restraint is the
> whole design philosophy of this project in miniature: **say only what the
> evidence supports, and label everything else as missing.**

## 6. Close (~15s)

> That's the project — a small, verifiable piece of a much larger idea: a job
> search tool that never tells you more than it actually knows. How it was
> built, and what it took to get there, is the second video.

---

## Timing

| Section | Target |
|---|---|
| 1 — the problem | 0:50 |
| 2 — the gap | 0:40 |
| 3 — what was built | 1:00 |
| 4 — how it's used | 0:50 |
| 5 — what it doesn't claim | 0:30 |
| 6 — close | 0:15 |
| **Total** | **~4:00** |

## Pre-submit checklist

- [ ] A viewer with no coding background could explain back what the project
      does and why it matters
- [ ] No real PII on screen
- [ ] At least one real screen shot of the connector's actual output
- [ ] States plainly what the connector does *not* know (§5) — this is the
      credibility line, not a hedge to cut for time
