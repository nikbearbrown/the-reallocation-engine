# Experienced Java Backend Opening Triage (Early-2027 Start) — human card

**Audience:** an international master's student with years of full-time Java/Spring backend
experience, who will need sponsorship later and can start on a stated early-2027 date.
**Agent twin:** `recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md`
**Status:** RUNNABLE-SAMPLE (reports judged adequate by Aditya Raj, 2026-10-21). Built, tested offline (77 tests), run on 12 development postings and 6 unseen
postings; feature scope frozen at v0.4.1.

## Executive summary

Use this before you tailor an application. It reads the posting's own words for five things:

1. Is it still listed?
2. Does this posting refuse sponsorship, require citizenship, or mention export control or
   clearance?
3. Do the stated years fit? It keeps total career, years in a specific skill, and co-op time
   apart.
4. Does a stated start date fit your date?
5. Is the work Java backend work?

Most openings end with "a person decides", and the reason is quoted. It says "unknown" rather
than guess, and never gives a score.

## What it can verify

- What the posting says, quoted with its section heading.
- Whether your **full-time** months meet a stated **general** minimum. Month-only dates are
  treated as a range; the persona is 50–54 months.
- Whether a skill-specific requirement ("5 years of Java") is above **everything** you have
  worked. Otherwise it stays unknown.
- Whether a stated start constraint fits your date: "by", "on", and "no earlier than" are read
  differently.
- Whether the employer's feed listed the posting, and what the page returned at that time.

## What it cannot verify

- **That an opening will sponsor you.** "Silent" means the rules detected no sponsorship wording
  in the posting body. Application forms were not checked.
- **Your work authorization, EAD approval, or eligibility to start.**
- How many years you have spent on a specific skill, unless you supply that as an input.
- Whether an employer would count your co-op, make an exception, or how it reads "related".
- That a posting is open right now. A blocked page is unknown, not closed.
- General accuracy. On 6 unseen postings the frozen rules agreed with Claude-reviewed expectations
  on 40 of 48 checks and missed export-control wording twice (since repaired). That is agreement
  with the rules' author, not measured accuracy, and it shows they will miss things on new postings.
- Application-form questions (collection deferred).

## Next steps you will see

| Next step | Meaning |
|---|---|
| `skip-application` | a stated requirement you don't meet even counting everything (quoted), a refusal or citizenship rule, a mandatory start date you can't meet, or positive evidence the posting is gone |
| `human-liveness-review` | the feed and page disagree, or the page was thin or blocked. Open it yourself. |
| `human-eligibility-review` | clearance or export-control wording. Read the quoted line. |
| `human-requirement-review` | the co-op would decide it; years in a specific skill are unknown; either/or branches; unclear headings; weak Java evidence |
| `human-start-window-review` | ASAP, offer-relative, a season, descriptive or conflicting timing |
| `seek-vacancy-sponsorship-evidence` | nothing stops it, and nothing usable about sponsorship was detected. Ask before tailoring. |
| `review-offer-excerpt` | offer-like wording. Read it; it is not a guarantee. |

## Commands (offline; run from the repository root)

```bash
node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs \
            scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs
node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run \
  --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json \
  --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json \
  --out-dir "$TMPDIR/triage-replay"
node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/break-test.mjs
```

## Named failure modes

1. **Keyword fit or career length read as eligibility.** "5+ years in Java" next to a strong
   stack match. *Guard:* total career years never meet a skill-specific requirement. Breaking it
   released 1 real posting; breaking the "no override" rule released 4.
2. **Co-op silently counted or silently ignored.** At 4.5 vs "5+", the co-op is the difference.
   *Guard:* silence goes to you, with the full-time-only comparison shown.
3. **Blocked page read as closed.** Pinterest pages answered a headless browser with an HTTP 403
   challenge. *Guard:* a thin or blocked page is unknown, with or without the feed.
4. **History read as a promise.** Company approval counts never decide anything.
