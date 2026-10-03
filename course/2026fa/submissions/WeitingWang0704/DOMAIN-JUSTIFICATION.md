# Domain justification — game-dev-h1b-soc-15-1252

## Who uses this, and when

An international master's student in computer science who specialises in game
programming — Unity and real-time 3D — looking for a first full-time game
programmer role in the United States on F-1 OPT, needing an employer who will
eventually file an H-1B. The target occupation is SOC 15-1252, Software
Developers, because BLS has no separate occupation for games. The moment this
recipe is for is a concrete one: a shortlist of studio postings is open in a
browser, there are two hours left in the day for research and applications, and
the question is which of these postings is worth any of that time.

This is narrower than "international student job search" in a way that changes
the workflow rather than just the wording. Game studios are a sector where
sponsorship is rare, unevenly distributed, and concentrated in a few large
employers; where the hiring cycle runs long because of portfolio reviews and
work tests; and where a studio's careers page looks the same whether it has
filed thirty petitions or none. A recipe written for software engineering in
general would not have a gate for "has this company sponsored for *this kind of
role*", and that gate turns out to be where the real information lives.

## The information asymmetry

From the outside, a student cannot see whether a studio has ever sponsored. We
can see the job description, the engine requirements and the studio's games; we
cannot see the filing history, and nothing on the posting hints at it. So the
effort goes to the postings that look most appealing, which is uncorrelated
with the thing that decides whether the application can succeed at all.

There is a second asymmetry hiding inside the first, and it is the one this
recipe exists for. A studio that *has* sponsored may have sponsored for
somebody else's job. In the sample run, `Roboto Games Inc` shows four approvals
at a 100% approval rate — and the recorded sponsored title is
`Director of Product Management`. A student who learns only that Roboto
"sponsors" will spend an afternoon tailoring a portfolio on evidence that does
not apply to them. `That's No Moon Entertainment Inc`, by contrast, has two
approvals and a recorded title of `Associate Gameplay Engineer`: fewer
filings, far better evidence. Raw sponsorship counts invert the ranking that
actually matters, and no job board shows either number.

## Connection to the engine layers

The recipe draws on **80 Days to Stay** for both signals it treats as records —
H-1B approvals, denials, approval rate and sponsored job titles, and funding
recency from the Form D-derived columns — through
`data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`.
It draws on **The Cognitive Pivot** for the SOC 15-1252 row in
`data/bls/compact/soc_occupation_compact.csv`, which it shows to the person and
deliberately does not score, because `role-scorer.mjs` weights role quality at
zero. It reaches **Job-Ops** only at a human gate: liveness comes from a person
running `npm run ats:liveness`, never from the prototype, which makes no network
calls. The composite itself is the repository's own Chapter 11 scorer, invoked
as a CLI rather than reimplemented.

## Where it fits the 3-3-2 day

It takes over one specific slice of the two research-and-apply hours: the
employer-side lookup. Done by hand, deciding whether a studio is worth applying
to means searching a visa-filing database for the company, reading what titles
came back, and checking whether the company has raised money recently — roughly
ten to fifteen minutes per company once the tabs are open and the name
disambiguated. Across a shortlist of fifteen to twenty postings in a week, that
is somewhere around **two and a half to four hours**. The recipe reduces that to
one command plus a human confirmation per row, which we estimate at two to three
minutes a row, or **under an hour** for the same shortlist.

**That estimate is an estimate.** It comes from our own sense of how long the
manual version takes, not from a timed comparison, and no measurement in this
repository supports it. It should be read as an order of magnitude — "most of an
afternoon becomes most of an hour" — and not as a figure. What the recipe
emphatically does *not* save is the liveness check or the sector confirmation;
both still need a person, by design.

The freed time does not go back into applying. It goes to the other two threes.
Rows that come back `Consider` — a real sponsorship record but not strong
enough, or no record at all — are explicitly routed to the **networking three**
rather than to a cold application, since one conversation resolves an unknown
sponsorship record far faster than an application does. Rows that come back
`Skip` free the hour for the **credibility three**. For this student that
credibility artefact is this submission itself: a recipe and a prototype with
offline tests, declared failure cases and a written account of what they cannot
verify. A separate Unity project is in progress and due at the end of term, and
is not claimed here as finished work.

## Failure modes specific to this domain

**The games-sector false positive.** The 80 Days CSV has 24 industry labels and
none of them is games, so membership in the sector has to be inferred from the
company name. In the sample run `Peloton Interactive Inc` — a connected-fitness
company — passed the filter on the word "Interactive", arrived with 310
approvals and a 97.5% approval rate, and finished tied for second, level with a
genuine AAA studio. The shape of the error is a non-games company with a strong
record crowding out the studios the student actually wants. The person least
able to catch it is exactly the person this recipe is for: a student new to the
US market, who has no background reason to know which American brand names are
game companies and which sell exercise equipment. A domestic student who grew up
with these brands would spot it instantly. Mitigation is that the matched
keyword is printed on every row and Gate 1 asks a person to confirm, but a
keyword list cannot be made to carry knowledge it does not have.

**The dataset does not contain the studios the student has heard of.** Checked
on 2026-10-03: of fourteen well-known game employers, one is genuinely in the
CSV. EA, Activision, Riot, Epic, Blizzard, Ubisoft, Zynga, Bungie, Naughty Dog,
Respawn, Insomniac and Cat Daddy are all absent, and two of the apparent
matches are false ones — seven heart-valve and industrial companies for
`VALVE`, and an unrelated 2021 California company for `TAKE TWO`. The dataset
comes from SEC startup filings, which a studio owned by a public parent does
not make. The shape of the error is a student pointing this recipe at their
actual shortlist, getting `NOT_IN_RECORD` for most of it, and concluding either
that the tool is broken or — far worse — that those employers have no
sponsorship history. The person least able to catch it is anyone who has not
read the dataset's own README, because nothing in the output says *why* a
company is missing. We would rather state this at the top of the card than let
a student discover it on a deadline: this recipe triages the
funded-private-studio slice of the games sector. The large publishers, which
run the biggest H-1B programmes, need a different source entirely.

**Absence read as refusal.** Only 1,557 of 30,369 rows (5.1%) carry an H-1B
approvals value. The remaining 94.9% have those columns empty — not zero,
empty. A student who reads an empty row as "this studio does not sponsor" has
deleted most of the market in a single move, and small game studios are heavily
over-represented in that 94.9%. The error is dangerous because it is
self-reinforcing: it makes the shortlist shorter, which feels like progress,
and it happens fastest to someone working late under deadline pressure. It is
also invisible afterwards — a company wrongly dropped never produces evidence
that it was dropped wrongly. The recipe's defence is to name the state
`NO_SPONSORSHIP_RECORD` rather than scoring it as a negative, to label the
probability `model-judgment` rather than `record`, and to say in the report, in
words, that an absent record is not evidence of a non-sponsor.
