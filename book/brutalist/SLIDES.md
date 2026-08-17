# COWORK PROMPT — Brutalist Slide Deck Generator
# Load SLIDES.md and DESIGN.md into context before running.
# Run once per chapter (or once for the full-book deck).
# Replace ALL_CAPS placeholders before pasting.

---

## Context files required

Before starting, confirm both files are loaded:
- `SLIDES.md` — slide generation rules derived from the book's twelve chapters
- `DESIGN.md` — visual constitution (color tokens, typography, spacing)

If either file is missing, stop and load it before proceeding.

---

## Phase 0 — Declare intent

Answer these four questions before generating a single slide. Do not proceed until all four are answered.

**Q1. What are we generating?**
Options:
- `chapter` — one chapter deck (live + study pair)
- `book` — the full-book overview deck

**Q2. If chapter: which chapter and which deck type?**
- Chapter: [CHAPTER_NUMBER] — [CHAPTER_TITLE]
- Deck type: `live` | `study` | `both`

**Q3. What is the learning objective?**
State in one sentence using an action verb (explain, apply, analyze, compare, evaluate, produce, critique, synthesize, defend).
Example: "Students can identify which of the three text-density failure modes applies to a given slide and state the correct fix."

If the learning objective cannot be stated with an action verb, stop. A deck without a testable destination is a coverage deck by default.

**Q4. Who is the audience?**

Choose one:

| Code | Audience | Prior knowledge assumed | Seductive-detail risk | Hook style | Density ceiling (live body) |
|---|---|---|---|---|---|
| `intro` | Introductory undergrad | None | High — activate wrong schemas easily | Felt problem, concrete scenario | 35 words |
| `undergrad` | Mid-level undergrad | Vocabulary present, schema thin | Moderate | Puzzle or misconception | 45 words |
| `advanced` | Senior undergrad / professional | Schema present, gaps at edges | Lower | Unresolved tension in the field | 55 words |
| `grad` | MA / professional graduate | Solid schema, practitioner framing | Low | Application problem or edge case | 65 words |
| `phd` | PhD / researcher | Deep schema, aware of literature | Very low | Research gap, contested finding, or open question | 80 words |
| `faculty` | Faculty / instructional designers | Expert, peer relationship | Near zero | Diagnostic failure in their own practice | 90 words |
| `custom` | [DESCRIBE YOUR AUDIENCE] | [STATE WHAT THEY KNOW] | [HIGH / MODERATE / LOW] | [HOOK STYLE] | [WORD COUNT] |

**Audience affects the following, and only the following:**

| Parameter | Adjusts with audience |
|---|---|
| Live body word ceiling | Yes — see table above |
| Study body word ceiling | Yes — roughly 2× the live ceiling |
| Hook style | Yes — see Hook section below |
| Prediction prompt character | Yes — see Prediction section below |
| Scaffolding density | Yes — more scaffolding for lower prior knowledge |
| Vocabulary introduction pace | Yes — define terms for intro; assume them for phd/faculty |
| Seductive-detail threshold | Yes — stricter for intro/undergrad; more latitude for phd/faculty |
| Worked example complexity | Yes — simple named instance for intro; contested case for phd |
| Consolidation mechanism | Yes — see Consolidation section below |
| Notes field speaker script register | Yes — more explanatory for intro; more collegial for phd/faculty |

**The following do not change with audience:**

| Rule | Does not change |
|---|---|
| Headline must be an assertion (≤12 words) | Always |
| One visual per live-deck slide body | Always |
| Three-failure-mode audit before any text appears | Always |
| Four-operations rule for imported figures | Always |
| Two-color discipline per slide | Always |
| WCAG contrast minimums | Always |
| No 3D charts | Always |
| No gradient backgrounds | Always |
| Dependency order in the build | Always |
| Per-slide and per-deck checklists | Always |

The core slide grammar does not relax for expert audiences. What changes is density, register, and scaffolding — not correctness.

---

## Audience-adjusted parameters

### Hook styles by audience

**`intro`:** A concrete, felt problem. Something that has already happened to the student or will happen soon. No vocabulary required to feel the problem.
Example: "You built a slide at midnight. The room ignored it. Here's why."

**`undergrad`:** A puzzle or visible contradiction. The student has enough vocabulary to feel the tension but no framework to resolve it.
Example: "Two slides, identical content, different learning outcomes. What changed?"

**`advanced`:** An unresolved tension in the field or a failure in a tool the student already uses.
Example: "Every AI slide generator produces the same failure mode by default. Name it."

**`grad`:** An application problem or an edge case that breaks the standard prescription.
Example: "The Modality Principle recommends sparse slides. Your async students have no speaker. Now what?"

**`phd`:** A research gap, a contested finding, or an open methodological question.
Example: "Mayer's boundary conditions for the modality advantage include learner-paced material. Does that mean a slidecast is a study artifact? The literature does not settle this."

**`faculty`:** A diagnostic failure in their own practice. Name the slide they have already made.
Example: "Your DESIGN.md has been running for a year. You never opened the accent color variable. Here is what it is encoding."

### Prediction prompt by audience

**`intro` / `undergrad`:** Commit to a concrete prediction before vocabulary arrives. Hand-raise, clicker, or written sentence. Students are anchoring to an experience they have had.

**`advanced` / `grad`:** State a hypothesis. Pair discussion preferred — the student argues their position before the framework arrives. The prediction is more analytical than intuitive.

**`phd` / `faculty`:** State a position on the contested question or name the flaw in the standard prescription. No clicker — written or spoken argument. The prediction is a claim that the lecture will complicate or confirm.

### Worked example complexity by audience

**`intro`:** A simple, familiar instance. One failure mode visible, clearly labeled.

**`undergrad`:** A moderately complex instance. Two failure modes present; the student must distinguish them.

**`advanced` / `grad`:** A real-world case with competing considerations. The fix is not obvious; the worked example shows the reasoning, not just the outcome.

**`phd` / `faculty`:** A contested case or a case where the standard prescription is wrong. The worked example names the exception, explains why it is an exception, and states the rule that governs it.

### Consolidation mechanism by audience

**`intro`:** Written prediction reveal — every student writes; instructor reveals the answer; students check themselves.

**`undergrad`:** Pair discussion followed by cold call. Students argue a position; the room hears two or three versions.

**`advanced` / `grad`:** Small group discussion of an application problem. Groups report; the instructor synthesizes.

**`phd` / `faculty`:** Open discussion of a contested case or a gap in the evidence. Instructor does not reveal a "correct" answer — surfaces the quality of the disagreement. Closing synthesis names where the evidence is strong and where it is not.

### Vocabulary introduction pace by audience

**`intro`:** Define every term before it is used. No assumption of prior vocabulary. Italicize the first use of each term and state the plain-language equivalent.

**`undergrad`:** Define terms not standard in prerequisite courses. Assume vocabulary introduced in previous lectures.

**`advanced` / `grad`:** Assume standard field vocabulary. Define terms only when used in a non-standard sense or when introducing a new framework term.

**`phd` / `faculty`:** Assume full field vocabulary. Cite the source when introducing a framework term. Notes field may include methodological caveats and literature references that lower-level decks would not carry.

### Seductive-detail threshold by audience

**`intro` / `undergrad`:** Strict. The seductive-detail damage is highest when prior knowledge is lowest. No historical color, no biographical asides, no statistics unrelated to the current claim in the slide body. Move all of it to notes Background.

**`advanced` / `grad`:** Moderate. A detail that primes the correct schema earns its place. A detail that primes a competing schema does not. Test: does removing it weaken the hook or the build? If yes, keep it. If no, move it.

**`phd` / `faculty`:** Most latitude. Methodological caveats, contested findings, and literature disputes are load-bearing, not decorative, for an expert audience. They are not seductive details — they are the content. Apply the removal diagnostic honestly: would an expert audience's understanding be diminished by removing this? If yes, it belongs in the slide body or the notes explanation, not the Background section.

---

## Phase 1 — Chapter hook (slides 1–2)

### Slide 1: Problem statement

Generate this slide first. It sets the destination for every slide that follows.

**Rules:**
- Headline: the chapter's central diagnostic question, rewritten as a full-sentence puzzle appropriate for the declared audience. Not a topic label.
- Body: one visual — a mockup, a scenario, or a diagram — that makes the student feel the problem before any vocabulary is introduced. Describe the visual in detail sufficient to render it as a D3/HTML figure using the chapter's figure prompts.
- Live notes: speaker prompt in the register appropriate for the audience. `intro`/`undergrad`: open with a concrete question. `phd`/`faculty`: open with the contested claim or the gap.
- Study notes: "Before reading further, consider: [restate the problem as a student-facing question calibrated to the audience's prior knowledge]."

**Do not use:** definitions, vocabulary, solutions, or references to the chapter title.

**Vocabulary policy:** apply the vocabulary introduction pace rule for the declared audience.

### Slide 2 (live deck only): Prediction prompt

- Headline: calibrated to audience per the prediction prompt rules above.
- Body: the same visual from Slide 1, with no labels or annotations.
- Notes: explicit retrieval mechanics calibrated to audience. State the mechanism, the think-time, and the reveal method.

---

## Phase 2 — Concept build

One slide per major concept in the chapter. Work in dependency order: do not introduce a concept before the concept it depends on.

For `intro` / `undergrad` audiences: include more scaffolding slides. Name each dependency explicitly.
For `phd` / `faculty` audiences: compress scaffolding where the concept is standard. Add slides for contested claims, boundary conditions, and methodological caveats that lower-level decks would omit.

For each concept slide, generate:

### [CONCEPT_NAME] — Slide [N]

**Headline:** [Full-sentence assertion. Verb present. ≤12 words. States what the concept claims, not what it is called.]

**Body (live deck):**
One visual element. State the visual type and describe it precisely:
- If diagram: label all nodes and edges. Directed edges carry a relationship label.
- If chart: state chart type, axes, data series, and what the claim directs the eye to. Mark the one accent-color element.
- If table: rows are [ATTRIBUTE], columns are [THING]. State any cells that deviate from the pattern.
- If annotated mockup: describe the "before" state, the "after" state, and the annotation callouts.
- If equation: state the equation and label each term. Show one worked example beneath it.

**Body density:** apply the live body word ceiling for the declared audience.

**Body (study deck):**
The live visual, fully labeled. Below it: labeled evidence chunks (≤8 words each for `intro`/`undergrad`; up to 15 words each for `phd`/`faculty`) that support the headline's claim. No prose paragraph on the slide body regardless of audience.

**Notes (live):**
Full speaker script in the register for the declared audience. All audiences:
- Opening sentence re-states the headline's claim in different words.
- Explanation calibrated to prior knowledge.
- Concrete example (simple for `intro`; contested case for `phd`/`faculty`).
- Transition sentence to the next slide.

For `phd` / `faculty` only: notes may include methodological caveats, named literature disputes, and the chapter's "what would change my mind" reasoning where directly relevant to the concept.

**Notes (study):**
Additional context beyond the body. Seductive details with study value go here under `## Background` for all audience levels. For `phd` / `faculty`, `## Background` may instead be `## Methodological notes` and carry literature citations and open questions.

**Failure mode check:**
Before finalizing, state which of the chapter's failure modes this slide is illustrating or correcting. Name it explicitly. If the slide cannot be connected to a failure mode, it may not belong in this deck.

---

## Phase 2A — Worked example slide (one per chapter, mandatory)

Placed after the core concept build. Complexity calibrated to declared audience per the worked example complexity rules above.

**Headline:** Assertion naming the example. Format: "[The claim], applied: [specific instance]."

**Body:**
For `intro` / `undergrad`: side-by-side failing and repaired version with clearly labeled callouts.
For `advanced` / `grad`: same side-by-side with an additional annotation naming the competing consideration — why the naive fix is not always right.
For `phd` / `faculty`: the contested case. A slide where the standard prescription is wrong. Name why and state the governing rule that distinguishes this case from the standard one.

**Notes (live):**
Walk-through narration in the audience's register. For `phd`/`faculty`: name the exception condition explicitly and state what the chapter's "honest disagreement" section says about it.

**Notes (study):**
Extended explanation. For `phd`/`faculty`: include the diagnostic question that produced the fix AND the condition under which the fix would be wrong.

---

## Phase 3 — Consolidation

### Consolidation slide (live deck)

Place at or before the 20-minute mark if the build exceeds six concept slides. Another at close.

**Headline:** A retrieval question appropriate to the audience's level:
- `intro`/`undergrad`: "What did we establish about [CENTRAL_CONCEPT]?"
- `advanced`/`grad`: "Where does the standard prescription break down?"
- `phd`/`faculty`: "What would change your mind about [CENTRAL_CLAIM]?"

**Body:** Blank or the chapter's core diagram with labels removed.
**Notes:** Retrieval mechanism calibrated to audience per the consolidation mechanism rules above. Always include the correct answer for the reveal.

### Synthesis slide (both decks)

**Headline:** The chapter's central claim — the one sentence the student should carry out of the room. Same for all audiences.
**Body:** Arc compressed into three labeled steps: Hook → Build → Claim. Simple horizontal flow. Same for all audiences.
**Notes (live):** Closing remarks. One sentence connecting to the next chapter. Audience-calibrated tone.
**Notes (study):** Full transfer prompt + answer reveal.

### Transfer prompt slide (study deck only)

**Headline:** A new scenario the student has not seen in the chapter. Complexity calibrated to audience.

**Body:**
```
[STATE THE PROBLEM — complexity calibrated to audience]

---

▶ Reveal

[STATE THE ANSWER AND THE PRINCIPLE IT DEMONSTRATES]
```

For `intro`/`undergrad`: one right answer demonstrating the chapter's primary claim.
For `advanced`/`grad`: a defensible answer with a known exception. The reveal names both.
For `phd`/`faculty`: a genuinely contested problem. The reveal states the strongest position and names what evidence would overturn it.

---

## Phase 4 — Quality gate

Before declaring any deck complete, run both checklists from SLIDES.md.

### Per-slide gate

For each slide, output a one-line status:
```
Slide [N] — [HEADLINE] — PASS | FAIL: [item failed]
```

If any slide fails, fix it before proceeding. Do not ship a deck with known failures.

### Per-deck gate

Answer all five deck-level checks:
- D1: Deck type declared and honored?
- D2: Headlines read as a coherent argument?
- D3: Consolidation moments in place?
- D4: Central-claim slide identifiable?
- D5: Deck reads as this course AND this audience?

D5 explicitly checks audience calibration. A deck written for `intro` that was declared `phd` fails D5 — the scaffolding is wrong, not just the density.

---

## Output format

### For each slide, output in this structure:

```
---
SLIDE [N] | TYPE: [concept | hook | prediction | consolidation | synthesis | transfer | ref]
DECK: [live | study | both]
AUDIENCE: [intro | undergrad | advanced | grad | phd | faculty | custom]

HEADLINE:
[Full text of the headline]

BODY:
[Description of the visual element, fully specified for D3/HTML rendering.
Include: chart type, axes, labels, accent color placement, annotation callouts.
For mockups: describe before/after states and callout text.
Density: [actual word count] / [ceiling for declared audience]]

NOTES (live):
[Speaker script in the register for the declared audience]

## Background  [or ## Methodological notes for phd/faculty]
[Seductive details or literature disputes with study value — only if present]

NOTES (study):
[Extended explanation + retrieval prompt where applicable]

FAILURE MODE: [Name of the failure mode this slide addresses, or N/A for reference slides]
AUDIENCE CHECK: [Does the density, register, scaffolding, and example complexity match the declared audience? PASS | FAIL: what is wrong]
CHECKLIST: [PASS | FAIL: item]
---
```

### For the figure prompts section (end of each chapter deck):

After all slides, output a `## Figure Prompts` section containing D3 v7 generation prompts for each visual described in the build phase. Use the same prompt format as the chapter's existing figure prompts:

```
### [SLIDE_N] — [FIGURE_DESCRIPTION]

Create a standalone D3 v7 HTML file for [DESCRIPTION]. Use the CDN 
https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js, inline CSS, 
ResizeObserver redraw, SVG role="digit"], aria-labelledby, title, and desc. 
Build the figure from this structural brief: [FULL_VISUAL_SPEC].
Use only DESIGN.md color variables and the required serif/mono font split.

> Reference implementation: `d3/[chapter-slug]-slide-[N].html`
```

---

## Book-level overview deck (run separately)

When `Q1 = book`, declare audience at Q4 as usual. The book deck adjusts the same way chapter decks do.

**`intro`/`undergrad` book deck:** each chapter summary uses a concrete problem hook. Vocabulary is introduced with the chapter summary slide rather than assumed. The closing call-to-action names a specific first action the student can take today.

**`phd`/`faculty` book deck:** each chapter summary names the research finding or literature dispute the chapter's prescription rests on. The "what would change my mind" statement for each chapter appears in the notes field of its summary slide. The closing call-to-action is "audit one existing deck using the chapter 12 checklist and report what you find."

### Structure (audience-invariant)

**Opening block (3 slides)**

Slide B1 [REF]: Book title, subtitle, publisher.
Slide B2: Central book claim. One-sentence argument the book makes.
Slide B3: The twelve-chapter map. Horizontal flow, three bands — Single Slide Failures (Ch. 1–7), Deck Architecture (Ch. 8–9), Systems Thinking (Ch. 10–12).

**Chapter summary block (2 slides per chapter × 12 = 24 slides)**

For each chapter:
- Slide [Bn]-A: Chapter hook calibrated to declared audience.
- Slide [Bn]-B: Chapter claim. One sentence. Body: most load-bearing figure, cropped and signaled.

**Closing block (2 slides)**

Slide B-final-1: Diagnostic checklist compressed. Two-column visual reference.
Slide B-final-2: Call to action, calibrated to audience.

**Quality gate:** per-deck checklist. D2 passes only if chapter summary headlines, read in sequence, form a coherent argument. D5 passes only if density, register, and example complexity match the declared audience throughout.

---

## Notes on using this prompt

**Declare the audience at the start of every session. Do not change it mid-session.** If you realize mid-session that the audience was declared wrong, restart. A deck that shifts audience mid-build fails D5 and cannot be fixed without a full rebuild.

**`custom` audience requires explicit values for all five parameters in the table.** A custom audience with vague prior-knowledge or seductive-detail-risk entries will produce inconsistent output. Be specific.

**The density ceilings are upper limits, not targets.** A slide that earns 20 words at the `phd` ceiling is better than one that fills 80 words. The ceiling prevents slideuments; it does not mandate density.

**One session per chapter deck.** Do not attempt to generate multiple chapter decks in a single session. Context accumulates; quality degrades.

**Load SLIDES.md and DESIGN.md fresh each session.** Do not rely on prior-session memory of either file.

**The notes field is not optional.** A live deck without populated notes is half an artifact. The tool should treat an empty notes field on a sparse slide as a blocking failure.

**The figure prompts section is the handoff to Claude Code or D3 rendering.** Run each figure prompt in a separate Code session with DESIGN.md loaded.

**DESIGN.md token conflicts resolve toward DESIGN.md.** If a slide needs a color not in the six-variable palette, ask whether the encoding job can be done with the existing palette. It almost always can.

---

*Load this prompt fresh each session. Do not cache outputs across sessions.*
*Source of authority for visual decisions: DESIGN.md. Source of authority for slide decisions: SLIDES.md.*
*Audience declaration is binding for the full session.*
