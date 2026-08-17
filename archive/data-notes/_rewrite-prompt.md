# Botspeak Slide Deck — Rewrite Prompt

*The prompt that updates `Botspeak Cheat Sheet.html` from the old (Diego / Devin / Aisha / Henrik / Tessa / Ash / Aya / Maya / Nora) version to the new (Priya Banksy + portfolio-driven) version of the book. Designed to be pasted into a Claude session with the chapter files attached as context.*

---

## How to use this prompt

**Step 1.** Start a new Claude session (Claude Project recommended if you have the Botspeak Project set up; otherwise a fresh `claude.ai` chat).

**Step 2.** Attach the following files to the session:

- `Botspeak Cheat Sheet.html` (the current deck — Claude will rewrite this)
- All 14 chapter files from `books/botspeak/chapters/`:
  - `00-the-citation-that-wasnt.md`
  - `01-the-loop-and-the-three-modes.md`
  - `02-the-nine-capacities.md`
  - `03-specification.md`
  - `04-delegation.md`
  - `05-conversation.md`
  - `06-discernment.md`
  - `07-diligence.md`
  - `08-putting-the-loop-together.md`
  - `09-when-youre-not-there.md`
  - `10-specification-and-diligence-for-automation.md`
  - `11-agency-and-the-three-structural-failures.md`
  - `12-verification-and-diligence-under-autonomy.md`
  - `13-the-fluent-practitioner.md`
- `book.md` (for the Priya bio and the portfolio-driven framing)
- `_the-claude-project.md` (for the portfolio structure)

**Step 3.** Paste the prompt below into the session.

**Step 4.** Claude will produce a full rewritten HTML file. Save it as `Botspeak Cheat Sheet.html` (replacing the old one) in the same `presentations/Botspeak/` folder. The `deck-stage.js` does not change.

**Step 5.** Open the new HTML in a browser to verify rendering. The 80-slide count, the navigation, the Northeastern-red styling, and the responsive scaling all live in `deck-stage.js` and the CSS at the top of the HTML — none of that changes. Only slide *content* changes.

---

## The prompt — paste this into Claude

````
I need you to rewrite a teaching slide deck to match the new version of
the textbook it accompanies. The deck is in HTML using a custom
<deck-stage> web component that handles navigation, scaling, and print.
The structural shape, the CSS, the typography, the brand colors, the
custom element, and the slide count are all CORRECT and must be
preserved exactly. What needs to change is the SLIDE CONTENT — the
case narratives, the protagonist names, the numbers, the specifics.

## What changed in the source material

The textbook was rewritten with a single protagonist — Priya Banksy,
29, BA Mass Communication from Symbiosis Institute of Media &
Communication (Pune), an AI Content Strategist at a US digital
publication on her first year of OPT — replacing the eight original
case-study protagonists (Diego, Devin, Aisha, Henrik, Tessa, Aya,
Maya, Nora). Two named characters survive only where the lesson
genuinely requires a second mind: an unnamed "senior writer" on the
Climate desk in Chapter 5, and the AGENT Ash in Chapter 11 (kept
because Ash is the documented research case from Shapira et al.,
Hebrew University of Jerusalem, 2026 — not a human protagonist).

The book is also now portfolio-driven. Every chapter produces an
artifact that lands in a `portfolio/` folder. The Ch 0 Baseline Audit
pairs with the Ch 13 Final Audit. The Ch 8 End-to-End Case Study is
the keystone deliverable. The Cover Memo at the front of the portfolio
is the most important single artifact. Read `book.md` and
`_the-claude-project.md` for the full picture.

## The chapter-by-chapter case map

For each chapter, here is the new case the deck slides must reflect.
Each is verbatim or near-verbatim from the new chapters; do not
invent details.

CHAPTER 0 — Priya's Tuesday at 9:42 AM in Boston, six months into her
role at a US digital publication. The piece is a 4,200-word feature
on Gen Z energy attitudes published Friday, 11,000 shares by Sunday.
A competing publication's research editor emails Monday: the load-
bearing 78% Pew Research statistic in the piece does not exist.
NO Pew survey on that subject. The fabrication was a hyperlinked
"according to a 2024 Pew Research survey" attribution. (Replaces
Diego's 16-page memo and 8.4% CAGR.)

CHAPTER 1 — Priya at 10:17 AM on a Thursday, nine months past Ch 0.
The task is a 1,000-word morning explainer on a new federal
grid-storage rule for the publication's audience site, due at 1 PM.
She specifies for 7 minutes before opening Claude. The 280-word
first prompt. The steelman move sourced from the rule text and
trade-association comment letters. She catches two suspicious round
numbers — corrects 40% to 37.2% from the FERC docket, removes a
fabricated "18–24 months" claim. (Replaces Priya/VC bank-acquires-
fintech.)

CHAPTER 2 — Priya at twelve months past Ch 0. The case: a state-by-
state lag-time table in a piece on clean-energy policy timelines.
She had asked Claude to calculate lag in months between announcement
and investment dates. Claude silently mishandled fiscal-year-to-
calendar-year conversion for states whose fiscal year begins in
July. A state energy analyst writes in three weeks later: 4 months
reported, 7 months actual. Four capacities failed at once. (Replaces
Devin's leap-year date bug.)

CHAPTER 3 — Priya at 4:11 PM on a Wednesday, ten months past Ch 0.
A 62-page clean-energy storage trade group annual deployment outlook.
Editor wants 5 bullets for tomorrow's editorial standup. Three
iterations all fail. (Replaces Aisha's broadband-subsidies report.)

CHAPTER 4 — Priya fourteen months past Ch 0. A 3,400-word feature
draft on a state-level clean-energy procurement program. On a
pre-publication call, a state energy official asks about a
procurement-rule revision the publication's regional weekly
covered but no major outlet did. The synthesis tool, which sources
from major outlets, missed it. Priya had stopped reading trade and
regional press six months earlier. The recovery: a Friday-morning
hour for regional and trade press. (Replaces Nora's Sysco / grocery
case.)

CHAPTER 5 — Priya fifteen months past Ch 0. A 45-minute Claude
session on a brand-content profile for a Series B clean-energy
storage company. A SENIOR WRITER on the Climate desk (unnamed —
let her stay unnamed) writes back in three minutes: cobalt supply
chain via the DRC, Reuters investigation on artisanal-mining child
labor at one of the named processors. Priya had not asked for the
steelman. (Replaces Henrik's EU energy security policy brief.)

CHAPTER 6 — Priya at sixteen months past Ch 0. THREE failures in one
week: Monday fact (fabricated quote from a named industry expert in
a "recent interview" Claude does not conduct), Wednesday reasoning
(wrong revenue-recognition premise — clean-energy storage company,
14-month cash-flow profile shift), Friday omission (storage company
profile with 40%-of-revenue customer concentration never surfaced).
Plus a clean walk-through: a Tier C four-layer protocol on a
competitive analysis of three peer publications' coverage of a
federal energy ruling, going to her editor. (Replaces the generic
consultant / engineer / analyst trio and Aisha's broadband re-walk.)

CHAPTER 7 — Priya at seventeen months past Ch 0. The publication's
AI-assisted audience-segmentation tool, built in February for the
Climate desk. Drifts over 9 months: May vendor model update (model
drift), March acquisition broadening audience (context drift), July
Politics-desk editor picks up the tool (use case drift). Outcome:
the tool has been deprioritizing coverage that disproportionately
serves lower-income and rural readers. Priya catches the pattern
in November while reviewing for a conference talk. (Replaces the
résumé-screening case.)

CHAPTER 8 — Priya at 8:47 AM on a Tuesday, eighteen months past
Ch 0. Senior content strategist on the Climate desk. The publication
kept her on after the correction, barely. The task: a scoping memo
for a Series B clean-energy storage company that has been generating
unusual trade-press coverage volume. Should the publication commit
six weeks of a reporter's time? Loop-back at 1:14 PM after the
sandwich-decompression: she realizes the memo should be recommending
on the resource commitment, not on the company. Template update at
3:00 PM. AI Use Disclosure at 5:48. Sent at 5:52. Editor texts "Tight.
See you Wednesday." at 7:11. THIS IS THE TUESDAY MIRROR TO CH 0 —
name the parallel explicitly. (Replaces Maya's VC due-diligence brief.)

CHAPTER 9 — Priya at nineteen months past Ch 0, seven weeks into her
oversight of the publication's inherited Monday-morning market-intel
automation. A trade publication ran a story Thursday on a utility
filing for a new transmission corridor; Friday afternoon, retraction.
The retraction did not flow into the source cache. Monday's summary
cited the (retracted) filing as current fact. A senior editor pitched
a reaction piece based on the summary; reporter drafted it Tuesday;
another editor caught the retraction Wednesday afternoon. Reaction
piece killed. Two days of reporter time lost. (Replaces Tessa's
$3M decision case.)

CHAPTER 10 — Priya at twenty months past Ch 0, the week after the
killed reaction piece. She is named owner. Rebuilding the spec for
the failed automation. The chapter shows the one-paragraph
Augmentation spec next to the three-times-longer Automation spec.
Goes live in week 22. Tuesday spot-check on her calendar.

CHAPTER 11 — Priya at twenty-one months past Ch 0, three months past
Ch 8. Promoted to editorial lead responsible for AI deployment
decisions at the Climate desk. A vendor has pitched the publication
an autonomous social-publishing agent that drafts, schedules, and
adapts posts about every new article. Priya is reading the Ash case
from Shapira et al. 2026 (server-reset failure) to inform her Friday
recommendation. She walks the proposal against the three structural
failures and four blast-radius dimensions. The vendor pitched 85%
automation; the defensible rate after Node design is 55%. ASH IS
PRESERVED as the documented research case.

CHAPTER 12 — Priya at 2:14 PM (PM, not AM — this is the editorial
office), twenty-three months past Ch 0. Editorial lead on the
publication's content-moderation Decision Node rotation. The
moderation agent has flagged a comment on an investigative feature
as harassment, classified the commenter as "recurring bad actor"
cluster #218 confidence 0.79. Priya's 90-second compressed
adversarial spiral: looks at the piece, the commenter's three prior
flagged comments (always pointed, never personal attack), identifies
the buried assumption (pattern-match conflated repeat critical
commenting with harassment). She REJECTS the flag. The bank-customer-
service-agent case is PRESERVED as the second worked example (60%
proposed → 30–35% defensible). Plus a bridge: the moderation agent
was pitched at 85% automation, defensible 55%, same math as the
bank. (Replaces Aya's pharmacy case as the primary; pharmacy survives
only as a brief structural-parallel callback.)

CHAPTER 13 — Priya on a Wednesday in the spring of her third year in
US journalism. Two years and three months past Ch 0. She has moved
to a different publication — editorial lead at a small investigative
outlet. Got the role by sending the editor-in-chief her PORTFOLIO'S
COVER MEMO and the End-to-End Case Study folder. The chapter
introduces the Final Audit (paired with Ch 0's Baseline), the 90-Day
Plan, and the Cover Memo.

## Portfolio orientation — applies to every chapter's exercise slide

Each chapter's closing exercise slide previously framed the artifact
as part of a "Domain Field Manual playbook" or generic exercises.
The new version frames every artifact as a piece of the reader's
PORTFOLIO. The chapter→artifact map is:

  Ch 0  → Baseline Audit (paired with Ch 13 Final Audit)
  Ch 1  → Worked Loop Log + opens CLAUDE.md
  Ch 2  → Practitioner Profile Part 1 (consolidates with Ch 4)
  Ch 3  → Specification Library + opens PROJECT.md template
  Ch 4  → Practitioner Profile Part 2 (Delegation Map)
  Ch 5  → Adversarial Conversation Log
  Ch 6  → Domain Verification Protocol + opens DESIGN.md
  Ch 7  → Diligence Framework Applied
  Ch 8  → End-to-End Case Study (keystone)
  Ch 9  → Automation Inheritance Audit + Noticing Protocol
  Ch 10 → Automation Specification
  Ch 11 → Agentic Blast-Radius Decision Aid + updates DESIGN.md
  Ch 12 → Human-in-the-Loop Protocol + final DESIGN.md section
  Ch 13 → Final Audit + 90-Day Plan + Cover Memo

The closing exercise slide for each chapter should reference the
specific portfolio artifact the chapter produces, not a generic
"do this in your domain" framing.

## What to preserve EXACTLY

- All HTML structure outside the <section>...</section> slide bodies
  (head, CSS, <deck-stage> element, deck-stage.js reference, fonts,
  meta tags)
- Slide count: 80 sections total
- Slide order and the chapter section-divider pattern (one divider
  per chapter, 4–5 content slides per chapter)
- Northeastern-red color (#C8102E), Lato typography, the 1920×1080
  design canvas, the print CSS
- The eyebrow → title → content hierarchy on every content slide
- All CSS class names (eyebrow, title, frame, rule-top, etc.)
- The opening slide ("Botspeak Teaching Cheat Sheet") and the closing
  slide ("The Loop is the workflow. The Capacities are what it draws
  on. The 90 days is how it starts.")

## What to change

The narrative content INSIDE each content slide:

- Protagonist name (and any name used as a quoted scene anchor)
- Specific numbers (8.4% CAGR → 78% Pew statistic; $3M decision →
  killed reaction piece; 60%→30% bank rate is PRESERVED, also add
  85%→55% moderation rate)
- Specific scenes (16-page memo → 4,200-word feature, etc.)
- Closing exercise slide for each chapter → portfolio artifact frame
- Any sentence that names the old protagonist explicitly

## Voice rules

- Match the voice of the new chapter files. They are conversational,
  scene-anchored, lower-density-per-slide than the old deck wanted to
  be.
- Each content slide is one beat. Do not stuff multiple beats into
  one slide.
- The eyebrow always reads "Chapter N ·" with the section title.
- Keep the existing slide titles where the rewritten chapter still
  supports them. Update titles only where the case has changed
  enough that the old title no longer fits.

## Forbidden moves

- Do not invent details not in the chapter files.
- Do not change the CSS, the deck-stage.js reference, or the page
  structure.
- Do not add or remove slides; the count stays at 80.
- Do not move Ash off the Chapter 11 slides — Ash is preserved.
- Do not name the senior writer in Chapter 5 — she stays unnamed.
- Do not mention "Northeastern" anywhere except the opening slide
  eyebrow (where it already says "Northeastern · Botspeak").

## Output format

Produce the complete rewritten HTML file in one artifact. Do not
abbreviate. Do not say "the rest is unchanged." I will replace the
file directly.

Before the artifact, in chat, give me:

1. A one-paragraph summary of what changed and what was preserved
2. A list of any chapter cases where the case map above conflicted
   with the chapter file (this should be empty — the case map is
   drawn from the chapter files — but flag any drift you find)
3. A list of any slides where you had to make a judgment call I
   should review

Then in the artifact, the full HTML. Self-contained. Drop-in
replacement for the current file.

## Validation — run after producing the artifact

Open the artifact. Count the <section> elements — should be 80.
grep for the old protagonist names — should be 0 matches for Diego,
Devin, Aisha, Henrik, Tessa, Aya, Maya, Nora. Ash should still
appear in Chapter 11 (~9 references). "Priya Banksy" should appear
roughly where "Maya" used to.

If any check fails, fix the artifact before delivering.
````

---

## After the run

**Verify the output** before replacing the deck. The validation block at the end of the prompt asks Claude to self-check, but do your own sanity check too:

```bash
cd presentations/Botspeak
grep -c '<section' "Botspeak Cheat Sheet.html"     # should be 80
for n in Diego Devin Aisha Henrik Tessa Aya Maya Nora; do
  echo "$n: $(grep -c "$n" "Botspeak Cheat Sheet.html")"   # should all be 0
done
grep -c "Ash" "Botspeak Cheat Sheet.html"            # should be ~9
grep -c "Priya Banksy" "Botspeak Cheat Sheet.html"  # should be 1–3 (full name); "Priya" alone ~20+
```

**Open the deck in a browser.** The 1920×1080 canvas, the navigation, the print layout, the thumbnail rail — all of that lives in `deck-stage.js` and the CSS at the top of the HTML, both of which the prompt forbids Claude from changing. If the deck renders and navigates the same as before, only with new case content, the rewrite is successful.

**If the rewrite is partial or skips slides,** re-run the prompt with a smaller scope — e.g., "rewrite slides 36–46 only (Chapter 6 + Chapter 7)" — and stitch the outputs together manually. Claude's output budget will not always fit 80 slides in one response; partial runs are sometimes the right call.

---

## When to re-run

The prompt is reusable. Re-run it any time:

- A chapter's case changes in a meaningful way (numbers, scene, protagonist arc)
- The portfolio artifact map changes (e.g., consolidations between chapters)
- The book's framing shifts (e.g., a new section, an appendix promoted into a part)
- Voice anchors in `style/` are added or updated

The deck is downstream of the chapters. The chapters are downstream of the working chapters in the `chapters/` folder. As long as the prompt reads from the chapter files, the deck stays in sync.

---

*Companion to the rewritten chapters and `_the-claude-project.md`. Lives in `presentations/Botspeak/` alongside the deck it rewrites.*
