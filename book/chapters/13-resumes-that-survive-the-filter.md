# Chapter 13 — Resumes That Survive the Filter
*The first reader doesn't care how it looks.*

There is a particular kind of effort that feels productive but costs you exactly what you spent it on. A candidate spends a weekend on a résumé. Two columns, a sidebar with tasteful skill bars, a small icon next to each section header, the name set large in a header graphic. It is the best-looking document they have ever made. They submit it to forty companies. Most reject it before a human opens it — not because the content was weak, but because the applicant-tracking system that read it first saw a scrambled wall of text. The two columns interleaved into nonsense. The skill bars, rendered as graphics, produced no text at all. The name, trapped in an image, was simply absent. The parser could not find a job title. So it scored the candidate as unqualified for everything, and the beautiful résumé disappeared.

This is not a corner case. By 2025, roughly 82% of companies screened résumés with software, and about one in five candidates were auto-rejected with no human review.[^13-screening] The first reader of your résumé is a parser. The parser does not care that the document is beautiful. It cares whether it can extract structured text. A résumé a human would admire and a machine cannot read is a résumé no human will ever see.

![Two parallel paths from "Submit résumé." The ATS-parseable path: the parser extracts name, title, and dates cleanly, leading to human review and an interview. The designed-layout path: the parser sees scrambled text, the application is auto-rejected, and no human ever opens it. The fork happens before any human judgment.](../images/13-resumes-that-survive-the-filter-fig-01.png)
*Figure 13.1 — The fork before the human*

<!-- → [DIAGRAM: two parallel paths from "Submit résumé" — left path labeled "ATS-parseable": document → parser extracts name/title/dates cleanly → human review → interview; right path labeled "Designed layout": document → parser sees scrambled text or nothing → auto-reject → no human ever opens it; the fork happens before any human judgment] -->

I want to be precise about what this means, because the instinct is to fight it. "A distinctive design will make me stand out." Against a human, sometimes — if the human ever gets there. Against the parser that reads first, a distinctive design is how you disappear. Standing out is the job of your content and your portfolio. The résumé's job is narrower and absolute: pass the parser, then say something true and specific to the human behind it. Those are two different tasks, and conflating them is what produces the beautiful invisible résumé.

---

The pipeline this chapter rests on is `scripts/resumes/`, whose core is `generate-pdf.mjs`: a script that takes a Markdown CV and renders it to a PDF through Playwright/Chromium using a resume-safe rendering path — single-column, real text, standard section headings, no layout the parser will trip on. The whole point is that you author content in plain Markdown and let the pipeline produce a document engineered to parse. You do not hand-build a layout that looks good and reads as garbage. You write text, and the pipeline handles the document.

From the project root:

```bash
npm run resumes:pdf      # runs scripts/resumes/generate-pdf.mjs
```

The output is a rendered PDF. But the real check is not "does it look right." It is "does it parse." So there is a second, essential step: copy all text from the PDF — Ctrl/Cmd-A, Ctrl/Cmd-C — and paste it into a plain text editor. What you see pasted is roughly what the parser sees. If your name, titles, and dates come through as clean linear text in the right order, the document passes. If they scramble or vanish, you have found the break before a company did.

| What you designed | What the parser extracted |
|---|---|
| Two-column layout | Lines interleaved across columns — incoherent order |
| Skill bars as graphics | Blank — no text at all |
| Name in a header image | Absent — the parser never learns your name |
| Dates in a table cell | Misaligned — drifted away from their roles |
| Section icons instead of words | Nothing — no section structure detected |

*The left column is the document you admired; the right column is the only version the first reader ever sees.*

That paste test is a practitioner heuristic, not a certificate. ATS systems vary. What one parses cleanly another may struggle with. But if text scrambles or disappears in plain paste, it will scramble or disappear in some meaningful fraction of the systems reading your application. The heuristic is conservative in the right direction: it tells you where the floor is, and the floor is what you need to be above.

---

Let me walk through what the test actually reveals, using a single CV rendered two ways.

The Markdown version, run through `resumes:pdf`: the PDF looks clean. Run the paste test. Name, contact information, each role's title and dates, the bullet content — all come through as ordered linear text. Section headings ("Experience," "Education," "Skills") survive as plain words, which are exactly the words parsers key on. The test passes.

The same content in a two-column designed template: paste it out. The left and right columns interleave line by line. "Data Analyst, 2023–2024" lands in the middle of an unrelated bullet from the other column. The skills section, rendered as little bars with labels, produces nothing — no text extracted at all. The parser reading that document cannot reliably locate a single job title. It has a name problem, a date problem, and a skill problem, all at once, and the human who might have found the candidate compelling never gets the chance to try.

![Side-by-side paste-test output for the same CV rendered two ways. Left: clean linear text with name, title, dates, and bullets in order. Right: scrambled, interleaved text with sections that produced no text marked in red. The right side is what a typical two-column designed template actually produces when parsed.](../images/13-resumes-that-survive-the-filter-fig-02.png)
*Figure 13.2 — What you designed vs. what the parser extracted*

<!-- → [CHART: side-by-side paste-test output for the same CV rendered two ways — left: clean linear text with name, title, dates, bullets in order; right: scrambled interleaving with missing sections marked in red; caption should note that the right-side output is what a typical two-column designed template actually produces when parsed] -->

The decision that follows from this is simple to state and genuinely uncomfortable to execute: ship the single-column rendered version; keep the pretty one for nothing, or for a human-only context like a portfolio site. The discomfort is real. The designed version *is* better-looking. But it is better-looking for a reader it will never reach.

---

Now let me say what the structures are that break parsers, because "don't use a fancy layout" is advice without traction until you know exactly which choices cause the problem.

**Multi-column layouts** are the most common failure mode. A parser reads text in document order, which in a two-column PDF is typically left-to-right across the full page width, not column by column. So the left column's first line and the right column's first line appear interleaved. This is not a subtle degradation — it makes the extracted text incoherent.

**Text in images** is the second. A name set in a header graphic is invisible to the parser. Literally absent. The parser cannot do OCR; it reads embedded text. If your name is an image, the parser does not know your name. If your section headers are icons rather than text characters, the parser does not see section structure.

**Tables used for layout** create extraction problems similar to columns: the parser linearizes the cells in ways that depend on the table's internal structure, not the visual arrangement you intended. Dates and job titles drift into wrong positions. A table is appropriate for genuinely tabular data; it is destructive when used to control visual layout.

**Skill bars and graphic elements** produce no text at all. They exist visually. To the parser, they are a gap.

The safe structures are their opposites: a single-column flow, real text characters for every piece of content that needs to be extracted, standard headings as plain words, dates in a consistent parseable format next to the roles they describe. These are not design constraints that prevent a good résumé. They are the constraints that ensure the résumé is read.

![A quick-reference visual contrasting résumé safe zones and danger zones. Safe: single-column body text, standard section headers as text, dates as plain text adjacent to roles, skills as a plain-text list, real text characters throughout. Danger: two-column layout, header graphic, skill bars, table-based layout, any text inside an image.](../images/13-resumes-that-survive-the-filter-fig-03.png)
*Figure 13.3 — Résumé safe zones and danger zones*

<!-- → [INFOGRAPHIC: a labeled résumé showing "safe zones" and "danger zones" — safe: single-column body text, standard section headers as text, dates as plain text adjacent to roles; danger: two-column layout, header graphic, skill bars, table-based layout, any text in an image; designed as a quick-reference visual a student can check their own document against] -->

---

There is something the pipeline cannot do, and I want to be direct about it.

The pipeline can guarantee a parseable document. It cannot know which of your true accomplishments will land with this hiring manager. It cannot tell you that your most parser-friendly bullet is also your most forgettable one. It cannot identify the phrase in your summary that makes a reader lean forward. ATS-safety is a floor — it ensures the human gets to read you at all. What you say once you are through the gate, and whether it is specific and true enough to earn the interview, is judgment the parser was never measuring.

The résumé, in a market where roughly 82% of companies run applications through software first, is not where you win. It is a gate you must not lose at. The winning moves — portfolio, proof of capability, demonstrated skill — happen elsewhere. The résumé's job is to get through the first filter intact and give the human on the other side something true and specific to respond to. Those are two requirements, and they are both necessary. An ATS-safe PDF with weak content still fails the human.

![A two-stage model of the résumé's job. Stage 1, the ATS filter, asks: can the parser find your name, title, and dates? Stage 2, human review, asks: is the content specific and true enough to earn a call? An arrow between them notes that what survives Stage 1 is the floor; Stage 2 is where content quality decides.](../images/13-resumes-that-survive-the-filter-fig-04.png)
*Figure 13.4 — Two-stage résumé job: parse floor, then human*

<!-- → [DIAGRAM: a two-stage model showing the résumé's job — Stage 1: "ATS filter" with the criterion "Can the parser find your name, title, and dates?" — Stage 2: "Human review" with the criterion "Is the content specific and true enough to earn a call?" — with an arrow between them labeled "What survives Stage 1 is the floor; Stage 2 is where content quality decides"] -->

Every component in the engine now works on its own: funding, sponsorship, liveness, role quality, timeline, scoring, framing, and a résumé that survives the filter. The next act stops handing you clean single tasks. It runs the whole engine — under real pressure, with a log — and that changes what you are doing in a way a single chapter cannot fully prepare you for.

---

## Chapter 13 Exercises: Résumés That Survive the Filter

**Project:** Your Own Reallocation Engine

**This chapter adds:** the artifact you actually send — an ATS-safe résumé rendered from Markdown and proven against the paste test, so the first reader (a parser) can extract your name, titles, and dates before any human ever sees them.

---

### Exercise 1 — When to Use AI

**The judgment:** In this chapter's work, AI assistance is appropriate for the following tasks:

- **Tightening bullet content in Markdown to be specific and true.** — *Why AI works here:* drafting against your real accomplishments, which you verify line by line.
- **Reformatting a visual skills grid into parseable linear text.** — *Why AI works here:* a structure transformation you confirm with the paste test.
- **Summarizing what the paste-test output reveals (what scrambled, what vanished).** — *Why AI works here:* it reads the extracted text you supply; you check against the source.

**The tell:** You know you are using AI appropriately when you can evaluate the output — when you have independent criteria to judge whether it is correct, complete, and fit for purpose. Here the criteria are the paste test (does it parse?) and your own record (is it true?).

---

### Exercise 2 — When NOT to Use AI

**The judgment:** In this chapter's work, the following tasks require human judgment. Delegating them to AI is not appropriate — not because AI cannot produce output, but because AI output in these cases cannot be trusted without verification that requires the same expertise as doing the task yourself.

- **Inventing or inflating accomplishments to strengthen a bullet.** — *Why AI fails here:* a model asked to "make this more impressive" will fabricate metrics; that crosses the same hard honesty line as Chapter 12, and only you know what's true.
- **Judging whether a bullet will land with this hiring manager.** — *Why AI fails here:* content quality past the parser is a judgment about a specific human; the model optimizes for plausible, not for resonant-and-true.
- **Certifying ATS-safety from how the PDF looks.** — *Why AI fails here:* the model can't see the parser; only the paste test reveals what gets extracted.

**The tell:** You know you have crossed the line when you are using AI output as your reason for a conclusion rather than as a tool for reaching one. If you could not explain the conclusion without the AI, the AI did the work that should have been yours.

**Series connection:** This exercise trains **Tier 4 (Metacognitive supervision)** with a **Tier 7** honesty edge — verifying a claim (does it parse?) against the world rather than against the document's appearance, and refusing to let "more impressive" become "not true."

---

### Exercise 3 — LLM Exercise

**What you're building this chapter:** a tightened, ATS-safe Markdown CV — specific and true bullets, parseable structure, the skills grid converted to linear text — ready to render.

**Tool:** Claude (claude.ai chat). You paste your Markdown CV; chat helps tighten and flag.

**The Prompt:**

```
Help me improve my résumé content and ATS-safety. I will paste my CV in Markdown.
HARD RULE: do not invent, inflate, or estimate any accomplishment or metric — work
only with what I give you. If a bullet is weak, make it more specific using ONLY
facts I provide, or tell me what fact you'd need from me.

1. Tighten each bullet to be specific and concrete, keeping every claim true. Mark
   any place where you'd need a real number from me with [ASK ME], do not fill it
   in.
2. Flag any layout element that will break an ATS parser: multi-column structure,
   text in images, tables used for layout, skill bars/graphics, non-text section
   headers. For each, give the parseable replacement.
3. Convert any visual skills grid into a single-column, plain-text list that
   preserves every skill.
4. Output the revised CV as clean single-column Markdown suitable for rendering to
   a single-column PDF.

Do not add a metric I didn't give you, and do not change my titles, employers, or
dates.

--- PASTE YOUR MARKDOWN CV BELOW ---
[paste here]
```

**What this produces:** a parser-safe Markdown CV with tightened, truthful bullets and `[ASK ME]` placeholders wherever a real number is needed — never a fabricated one.

**How to adapt this prompt:**
- *For your own project:* fill every `[ASK ME]` with a real, verifiable number. An invented metric here is the Chapter 12 hard-rule violation in résumé form.
- *For ChatGPT / Gemini:* works as-is; both love to invent quantified achievements — keep the "do not invent any metric" rule prominent.
- *For a Claude Project:* store the no-fabrication rule and the ATS-safe structure list in the instructions.

**Connection to previous chapters:** the honesty rule is Chapter 12's hard rule applied to your résumé; ATS-safety is the floor that lets your Chapter 11 Apply decisions actually reach a human.

**Preview of next chapter:** Chapter 14 runs the whole engine as a loop — scan, score, evaluate, log — with the résumé renderer as one of its recipes.

---

### Exercise 4 — CLI Exercise

**What you're building this chapter:** a rendered ATS-safe PDF plus an automated paste test that confirms your name, titles, and dates extract as clean linear text.

**Tool:** Claude Code. Rendering via `resumes:pdf`, extracting text, and checking linearity is a code-plus-inspection workflow.

**Skill level:** Intermediate.

**Setup:**

Before running this exercise, confirm:
- [ ] `scripts/resumes/generate-pdf.mjs` and `npm run resumes:pdf` work (Playwright/Chromium available).
- [ ] You have your ATS-safe Markdown CV from Exercise 3.
- [ ] You know what a passing paste test looks like (clean ordered text).

**The Task:**

```
Render my Markdown CV to an ATS-safe PDF and verify it parses. Do not alter my
content; do not invent anything.

1. Run:  npm run resumes:pdf
   Confirm the PDF was written and report the path.
2. Programmatically extract the text from the rendered PDF (the parser's view) and
   print it as plain linear text.
3. Check and report: do my NAME, each JOB TITLE, and each DATE appear, in order,
   as clean text? Flag anything scrambled, interleaved, or missing.
4. Compare the extracted text against my source Markdown headings (Experience,
   Education, Skills) — confirm each survives as a plain word.
5. Save reports/paste-test.txt (the extracted text) and a short PASS/FAIL summary
   per checked field. Stop.
```

**Expected output:** the rendered PDF, `reports/paste-test.txt` with the parser's view, and a per-field PASS/FAIL summary for name, titles, dates, and headings.

**What to inspect in the output:** read the extracted text yourself — does your name appear exactly once as text (not missing, not from an image)? Are titles adjacent to their dates, not interleaved? A clean automated pass is still a heuristic; eyeball the worst-case fields.

**If it goes wrong:** the classic failure is a field missing because it was in a graphic, or titles/dates interleaved from a multi-column source. Recover by fixing the Markdown structure (single column, real text headings) and re-rendering; never ship a PDF whose paste test you haven't read.

**CLAUDE.md / AGENTS.md note:** add a standing rule — *"Résumés render from Markdown to single-column PDF and must pass an extracted-text paste test (name, titles, dates linear) before sending; résumé content never includes a metric not verifiable from my records."* This pins both the parse floor and the honesty rule.

---

### Exercise 5 — AI Validation Exercise

**What you're validating:** an AI-"improved" résumé that both fabricated metrics and used a parser-hostile layout — impressive, unparseable, and untrue.

**Validation type:** Structured data + factual claim.

**Risk level:** High — fabricated metrics are dishonest (Chapter 12's hard rule), and the layout means no human sees it anyway.

**Setup (pre-generated artifact — option b):** This chapter's lessons are the parse floor and the honesty line, so validate this pre-generated "improved" résumé excerpt:

> **AI-revised résumé (for "Data Analyst" applicant who gave no metrics):**
> Rendered as a polished two-column PDF with the name in a header banner graphic
> and a skills sidebar shown as labeled proficiency bars.
> Bullets now read:
> • "Drove a 42% increase in revenue through advanced analytics."
> • "Reduced reporting time by 75% and saved the company $1.2M annually."
> • "Led a team of 12 analysts across 3 continents."
> *(The applicant's actual experience: one internship; no revenue, headcount, or
> savings figures were ever provided to the model.)*

**The Validation Task:**

Evaluate the AI output above using the following checklist. For each item, record: Pass / Fail / Cannot determine — and explain your reasoning.

```
Validation Checklist — Résumés That Survive the Filter

□ Correctness (honesty): Are the metrics (42%, 75%, $1.2M, team of 12) grounded
  in facts the applicant provided, or fabricated?
□ Correctness (parse): Will a two-column layout, a name-in-graphic, and skill
  bars survive an ATS parser? What does the paste test predict?
□ Completeness: Does anything verify these numbers against the applicant's real
  record (one internship)?
□ Honesty-line check (chapter-specific): Which bullets cross the same hard line as
  Chapter 12 (no invented metrics)?
□ Parse-floor check (chapter-specific): Run the paste test mentally — what
  extracts cleanly, what scrambles, what vanishes?
□ Failure mode check: Does this output exhibit any of the following?
  - Fabricated metrics (dishonesty)
  - Parser-hostile layout (the beautiful invisible résumé)
  - Fluent but wrong (impressive, unparseable, and untrue at once)
```

**What to do with your findings:**
- If the output passes all checks: use it. (It will not — every metric is invented and the layout won't parse.)
- If it fails one check: strip fabricated metrics and re-render single-column from Markdown.
- If it fails multiple checks or you cannot determine pass/fail: this is a "When NOT to Use AI" moment — write true bullets yourself and let the pipeline handle only the rendering.

**AI Use Disclosure prompt:**
After completing this validation, write a two-sentence AI Use Disclosure:
> *Sentence 1:* What AI produced in this exercise and how you used it.
> *Sentence 2:* One specific thing the AI could not determine that required your judgment.

**Series connection:** This exercise trains **Tier 4 metacognitive supervision** joined to the series' honesty commitment — catching output that is fluent in two directions at once (it looks impressive and it would never reach a human, and it isn't even true). The pipeline guarantees a parseable document; truth and resonance are yours.

[^13-screening]: ~82% of companies screen résumés with AI; ~21% auto-reject without human review — "The Collapse of the Traditional Résumé" (N. Bear Brown). **[verify]** against primary source.

