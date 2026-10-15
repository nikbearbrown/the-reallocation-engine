# Domain justification — dataeng-sponsor-coverage

## Executive summary

**The domain.** Early-career data and AI hiring in the United States, seen from
inside an F-1 student's OPT clock, where an employer's willingness to sponsor is the
constraint that decides whether a job exists at all.

**Why a recipe belongs here.** The decision is repeated hundreds of times under a
deadline, the evidence is public but badly shaped, and the dominant failure is not a
wrong answer — it is a confident answer built on an absence of data. That is exactly
the failure a recipe with explicit gates and source labels is built to prevent.

**What I claim.** One narrow, checkable thing: that a company's *silence* about
sponsorship is being read as a *no* by the tools students actually use, and that
replacing that silence with a computed base rate changes where an hour of job search
should go.

**What I do not claim.** That I can predict whether any company will sponsor anyone.

---

## 1. The domain and why it is mine

**Persona.** All dates below belong to **Priya Nair**, the fictional example
persona shipped at `search/examples/priya-nair/` (Northeastern, Boston,
`priya.nair@example.com`). They are invented and are not any real person's
immigration dates, per `DATA_CONTRACT.md` §Zero-Conditions.

I am an international student on an F-1 visa finishing a master's at Northeastern,
with under a year of experience, looking for data engineer, data analyst, data
scientist, machine learning engineer, AI engineer and BI engineer roles. My I-20
ends 2026-12-15. I can request an OPT start between 2026-12-16 and 2027-02-13, and
I plan on 2027-01-15. From that start I have 90 days of permitted unemployment.

Those are not background details; they are the parameters of the problem. A role
that cannot plausibly produce an offer before the 90 days run out is not a worse
option than another role — it is not an option. A recipe that ignores the clock is
solving a different problem than the one I have.

This also means I am not a neutral analyst of this domain. I have an outcome I want.
That is the strongest argument for writing the reasoning down as gates with stated
sources: it is the only way a reader — or I, in November — can tell where the
evidence stopped and the wishful thinking began.

## 2. The decision this recipe actually serves

Not "which job is best." The real question, every morning, is narrower:

> **Of the hours I have today, which go to applications and which go to
> conversations?**

The course frames this as a 3-3-2 day. A recipe is useful here only if its output
lands in those buckets. Mine does:

| Output bucket | Feeds |
|---|---|
| `Apply` after G3 clears | the 2 research-and-apply hours |
| `no-record` + recently funded, ranked by base rate | the 3 networking hours |
| `record-negative`, `expired`, `uncertain`, senior-only | neither, each with a stated reason |

A ranked list of 26,337 "opportunities" would serve none of these buckets. The
routing is the product.

## 2b. What it takes over, and roughly how much time

This is the part of the two research-and-apply hours that goes on *triage* — deciding
which companies are worth opening a tab for at all, before any tailoring begins.

**An estimate, labelled as one.** Checking a single company by hand — searching
whether it has sponsored before, finding its funding stage, checking whether the
posting is still live — takes me somewhere around 5–8 minutes when nothing goes
wrong. The run below evaluated 134 reachable companies and routed them in about two
seconds. At 20 companies a week, which is roughly my own pace, that is **90 minutes
to two hours a week** returned to tailoring and conversations.

I want to be careful about that number. It is arithmetic over my own guess at my own
speed, not a measurement: I did not time myself doing it by hand and then time the
tool. It is `your-input`, not `record`. What I can say without estimating is that
the triage pass is now reproducible and auditable, which the manual version never was
— I could not previously tell you why I had skipped a company three weeks earlier.

**Where the output goes.** The three buckets map onto the 3-3-2 day directly: `Apply`
candidates feed the 2 research-and-apply hours, the base-rate-ranked `no-record`
companies feed the 3 networking hours as conversations rather than applications, and
the skips feed neither. The 101 senior-only sponsors are a networking list too — they
hire in my field and cannot hire me *yet*, which is exactly who an informational
interview is for.

## 3. The specific defect I am addressing

`mapped_student_employment_targets_v3.csv` holds 30,369 companies. I counted what
it actually says about sponsorship:

| State | Rows | Share |
|---|---:|---:|
| `Total Approvals` populated and > 0 | 1,552 | 5.1% |
| `Total Approvals` populated and = 0 | **5** | 0.02% |
| `Total Approvals` blank | 28,812 | 94.9% |

**The file contains five recorded "no" answers.** Everything else is either a yes or
a silence, and silences outnumber noes 5,762 to 1.

A tool with two states — sponsors / does not sponsor — must put those 28,812
silences somewhere, and it puts them in "does not sponsor." It thereby invents
28,807 rejections that no employer ever issued, and presents them to a student who
has 90 days and no way to audit the claim. The student does not see a data-modelling
choice. They see a shorter list and conclude the market is smaller than it is.

This is why the recipe's first move is three states, not two: `record-positive`,
`record-negative`, `no-record`. The third is the one that carries the information.

## 4. Why this is tractable rather than merely true

Noticing the silence is easy. The question is whether anything can be done with it,
and the answer has to be checkable.

A company with no sponsorship record still has a **funding stage**, and funding stage
is populated far more often than sponsorship is. Computed over all 30,369 rows at
runtime — never hardcoded, and a test asserts the rate follows the rows it is given:

| Stage | Sponsors / companies | Base rate |
|---|---:|---:|
| Pre-Seed | 137 / 9,658 | **1.4%** |
| Seed | 188 / 6,325 | 3.0% |
| Series A | 329 / 6,196 | 5.3% |
| Series B | 364 / 3,300 | 11.0% |
| Series C | 265 / 1,421 | 18.6% |
| Series D+ | 249 / 974 | **25.6%** |

An 18x spread. That is enough to triage on, and it converts "unknown" into "unknown,
and here is the prior" — which is a usable instruction rather than a shrug.

**Three limits, stated because they bound the claim:**

1. A base rate is not a prediction about any single company. A Series D company with
   a 25.6% stage rate may never sponsor; a Pre-Seed one may.
2. This file contains companies **someone already chose to map**. The rates describe
   the file, not the US economy. I cannot correct for that selection and do not try.
3. Stages with fewer than 100 companies get `rate: null` rather than a noisy
   fraction. A base rate over 11 companies is a number, not evidence.

## 5. What the domain punished me for assuming

Four assumptions failed against the data, and each one changed the design:

**"AI Engineer is a job title."** It appears **zero times** in 30,369 rows. The work
is filed as *Machine Learning Engineer* (48 rows). Searching the six target titles
without *Machine Learning Engineer* matches 194 companies; with it, 235. Using my own
vocabulary instead of the filing's would have hidden 41 employers — 17.4% — and I
would never have known they existed. The asymmetry is the finding: **the student and
the government are not using the same words for the same job.**

**"A sponsor is a sponsor."** 101 companies sponsor a data title only at senior,
staff, lead, principal or manager level. For someone under a year out, those are not
opportunities. They are recorded with a reason rather than dropped, because "they
sponsor, but not you, not yet" is a different fact from "they do not sponsor," and
a recipe that collapses the two is making the same error I built it to avoid.

**"The market is where I am."** Of 134 companies sponsoring a target title at a
reachable level: CA 84, NY 24, MA 15, WA 5, TX 4. Massachusetts — where I live —
holds 11.2%; CA+NY+WA hold 84.3%. I am open to relocating inside the US and to
remote work, so geography is **reported and never scored**. Filtering to Boston
would delete 89% of the reachable market and present the result as a ranking. The
number's job is to make staying put a decision instead of a default, and a test
enforces that `--home-state` changes no score.

**"Clean data is clean."** 21 title cells carry a requisition id — `Data Engineer
20516.3745`, `Manager, Data Science (20639.33)`. The leading group is constant per
company and the tail increments per posting. An earlier version of my own tool
reported `0 data problems` while accepting them.

## 6. Why the gates sit where they do

| Gate | What it refuses | Why it is a gate and not a vote |
|---|---|---|
| G3 liveness | a posting not verified live | an expired posting is not a weaker opportunity, it is not an opportunity |
| G4 timeline | a role that cannot produce an offer inside the OPT window | the clock does not negotiate |

Both multiply the composite to zero. The distinction matters: a *vote* says "this is
worse," a *gate* says "this does not count." Applying to a closed posting is not a
low-value hour, it is a wasted one.

G3 is the gate I most wanted to soften. An early version emitted `liveness: 1.0`
with a warning comment, which made the scorer a rubber stamp and produced a 0% skip
rate — 258 applies, 0 skips, which should have been obviously wrong and instead
looked like success. The fix was to make an absent ledger entry mean **unscored**
rather than **assumed live**: 126 companies now sit in `pending_g3` with nothing said
about them. A smaller honest list beats a long list I cannot defend.

## 7. The scope of the claim

**This recipe can verify:** that a row exists; whether its approval cells are
populated, positive, or blank; which recorded titles match a target pattern and at
what seniority; a liveness verdict produced by the repository's own `classifyLiveness`
over a saved capture; that a SOC row exists with its wage and ability levels.

**This recipe cannot verify:** that a `no-record` company does not sponsor (the file
is silent, and silence is not a negative — this is the central limit); that a
`record-positive` company will sponsor *me*, now, for *this* role; that any posting
is live right now; that a matched title describes the job I would be hired into;
the 75-day hiring lag, which drives the timeline gate and which nothing measured.

The last one is the weakest joint in the whole design, and it is `your-input` in the
output so a reader sees it rather than discovering it.

## 7b. Two failure modes specific to this domain

Not "the model might hallucinate." These are the two errors this recipe can produce
that would be hardest to catch, and who would struggle most.

**1. A confident silence read as a verdict.** The failure shape: a company with no
H-1B record gets a funding-stage base rate attached — say 1.4% for Pre-Seed — and a
reader treats that 1.4% as a statement *about that company*. It is not; it is a
property of 9,658 other companies. A student who skips a firm that would in fact have
sponsored them never finds out. There is no feedback signal on a road not taken, so
the error is invisible by construction, and it compounds: it pushes the search toward
later-stage firms, which are also where competition concentrates.

Hardest to catch for: someone newly arrived, with no network in the industry to
contradict the number. A student who already knows people at a Series A startup will
hear "we sponsored two people last year" and distrust the output. A student with no
such contact has only the number.

**2. A title match that is not the job.** The filing records *Data Scientist*; the
role is a research scientist position requiring a PhD, or a thinly-disguised analyst
role. The recipe matches on the title string because that is all the record holds.
The failure is quiet — the application simply fails, and the student reads that as
being unqualified rather than as a mismatch the tool introduced.

Hardest to catch for: a career-changer, who has no prior sense of what a given title
means inside a given industry and will attribute every rejection to themselves. This
one bit me in a smaller way already: 21 titles carried a requisition id and still
matched the pattern cleanly.

## 8. What would falsify this

A domain claim that nothing could contradict is not a claim. Mine fails if:

- the stage base rates flatten on a differently-assembled company file, which would
  show I measured a sampling artefact rather than a hiring pattern;
- the 101 senior-only sponsors turn out to hire new grads through channels the H-1B
  title data does not record, which would mean the seniority filter removes real
  opportunities;
- liveness, checked live rather than over captures, clears for most `pending_g3`
  companies — in which case G3 is costing more than it protects.

The third is testable this week with `npm run ats:liveness` and is the first thing
I would do with more time.
