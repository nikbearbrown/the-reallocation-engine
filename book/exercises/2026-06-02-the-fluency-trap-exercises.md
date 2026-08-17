# Chapter 1 — The Fluency Trap · Assignment Set

<!-- /mega · book: the-reallocation-engine · chapter: 2026-06-02-the-fluency-trap
     voice-anchored: root style/VOICE.md. Never published. -->

> **Note on the mix.** This is a thesis chapter, not a calculation chapter, so the distribution leans slightly off the standard 40/30/20/10 — toward Multi-LLM (where comparing explanations genuinely teaches) and Hands-On (because the chapter's whole point is *learning to choose and check*, which you can only practice by doing it). Final mix: 5 Direct / 4 Step-by-Step / 3 Multi-LLM / 2 Hands-On (≈36 / 29 / 21 / 14). Several exercises are deliberately self-referential: they ask you to use an LLM in a way that lets you *feel* the difference between interrogating and delegating — the exact split that decided the Anthropic study.

---

## How to choose your approach (read this first)

Here is the uncomfortable thing this chapter asks of you. The tool that can answer every one of these exercises in three fluent seconds is the same tool whose overuse the chapter is warning you about. So the exercises are not really tests of whether the model knows the answer — it does. They are tests of whether *you* can tell when to lean on it and when to do the work yourself.

The four moves map to four real situations. Ask **directly** when the problem is well-defined and you just need the number — the OPT clock has one correct answer, and dressing the question up wastes your time. Ask for **step-by-step** when you are still building the mental model, or when a wrong intermediate assumption would poison the result and you need to see where it entered. **Compare across LLMs** when the *number* might agree but the *explanation* or the *hidden assumption* varies — that is where you learn what to watch for, and it is exactly the situation a fluent single answer hides from you. Go **hands-on** when the real skill is deciding which move to make — which is the skill no prompt template can give you.

One rule runs underneath all of it, straight from the chapter: when the fluent answer arrives, do not ask first whether it is impressive. Ask what would have to be true for it to be trusted, and what the machine could not know. Bring that question to every prompt below — especially the ones that look easy.

---

## Direct Calculation

### Exercise 1.1: The Clock You Cannot See

**Approach:** `[Direct prompt]`

```
I am on F-1 post-completion OPT. My EAD work-authorization start date
is March 1, 2026. Treat the federal limit as 90 cumulative CALENDAR
days of unemployment (weekends and holidays count), and treat 80 days
as my own earlier safety margin.

My employment gaps so far this year are:
- March 1 to March 24 (unemployed)
- May 10 to June 5 (unemployed)

Calculate:
1. Total cumulative unemployment days used to date.
2. Days remaining until I hit the 80-day margin.
3. Days remaining until I hit the 90-day federal cliff.

Show the day counts for each gap, then the totals. Inclusive of both
endpoints.
```

**Why direct:** One correct answer, a defined rule, no ambiguity. This is the canonical case for asking once and getting the number. *But* — apply the chapter's reflex even here: the machine does not know your real EAD dates or whether a part-time week counted as employed. Verify the inputs before you trust the output. The clock is yours, not its.

### Exercise 1.2: Two Letter Grades

**Approach:** `[Direct prompt]`

```
In a study, one group scored an average of 67% on a comprehension
quiz and another group averaged 50% on the same quiz.

1. What is the gap in percentage points?
2. On a standard 10-points-per-letter-grade scale, roughly how many
   letter grades does that gap represent?
3. Express the 50% as a percentage of the 67% (i.e., what fraction of
   the hand-coders' comprehension did the AI-assisted group retain)?
```

**Why direct:** Pure arithmetic on numbers the chapter already gave you. No reasoning chain to expose, no assumptions to compare. Asking for "step by step" here would be over-engineering a subtraction.

### Exercise 1.3: The Inversion, In Hours

**Approach:** `[Direct prompt]`

```
A software engineer works a 45-hour week. Under the old model, 10% of
the work was judgment and 90% was execution. Under the new model, that
ratio flips to 90% judgment, 10% execution.

Calculate the hours per week spent on judgment BEFORE and AFTER the
flip, and the absolute increase in judgment-hours.
```

**Why direct:** Well-defined percentages, single answer. The value is not the arithmetic — it is seeing, concretely, how many hours of your week the market has just repriced as the part that matters.

### Exercise 1.4: From Curiosity to Liability

**Approach:** `[Direct prompt]`

```
The share of S&P 500 companies disclosing AI as a "material risk" in
their annual filings rose from 12% (2023) to 72% (2025), with a later
update of 83%.

1. What is the percentage-point increase from 2023 to 2025?
2. By what multiple did the share grow (2023 to 2025)?
3. If there are 500 companies in the index, how many more disclosed
   AI as a material risk in 2025 than in 2023?
```

**Why direct:** A clean conversion between percentages, multiples, and counts. Quick. The point of doing it yourself is that "12 to 72" feels abstract until you turn it into 300 of the largest companies in America changing their legal disclosures in two years.

### Exercise 1.5: What's Left to Compete On

**Approach:** `[Direct prompt]`

```
Suppose 78% of a graded assignment measures procedural competence
(following constraints, meeting requirements, using tools correctly)
and the remaining portion measures judgment.

1. What percent measures judgment?
2. If a tool now lets every student score full marks on the procedural
   portion, what is the maximum percentage-point spread left between
   the best and worst student?
```

**Why direct:** Simple subtraction, but it makes the chapter's argument unavoidable: once everyone can execute, the entire competitive range collapses onto the judgment slice. (Source note: the 78% figure traces to the author's own essay, not yet an external study — treat it as illustrative.)

---

## Step-by-Step Reasoning

### Exercise 2.1: Run the Responsibility Reflex

**Approach:** `[Step-by-step]`

```
Here is an AI-generated output I am considering submitting for a
data-analyst take-home: a Python function that "cleans" a hiring
dataset by dropping every row with any missing field, then reports
the average candidate score.

Walk me through evaluating whether to trust it, step by step. At each
step, state what you are checking and why it matters before moving on:

1. What did this output optimize for, and what might it have silently
   sacrificed?
2. What could the code NOT know about this specific dataset or the
   hiring context?
3. Who is affected if the dropped rows are not random — and how would
   that bias the average?
4. What specific thing would I have to verify myself before I could
   trust this?

Do not just tell me it's fine or not fine. Show the reasoning.
```

**Why step-by-step:** This is the chapter's core discipline turned into a procedure. The final verdict ("trust it / don't") is worthless without the intermediate checks — and watching the reasoning unfold is how you internalize the reflex so you can run it in your own head next time, without the prompt.

### Exercise 2.2: Rebuild Comprehension Debt From Scratch

**Approach:** `[Step-by-step]`

```
I want to understand WHY delegating execution to an AI erodes the
judgment a learner would otherwise build. Reason it out with me, one
step at a time, building from this starting fact: judgment is built by
doing a task and noticing where it goes wrong.

1. Start there — why does "noticing where it goes wrong" require doing
   the task yourself?
2. What specifically gets skipped when the machine does the doing?
3. Why does the cost of that skipping not show up immediately?
4. When does it finally show up, and why is that the worst moment?

End by stating, in one sentence, the mechanism in your own words.
```

**Why step-by-step:** The concept is causal, not numerical — and a single fluent paragraph defining "comprehension debt" would let you memorize the name without grasping the chain. Forcing the steps makes you reconstruct the causality, which is the only version you will remember under pressure.

### Exercise 2.3: Which Mode Am I In?

**Approach:** `[Step-by-step]`

```
The chapter says using AI to INTERROGATE (ask conceptual questions,
challenge outputs, force your own understanding) produced very
different learning than using it to DELEGATE (describe the problem,
accept the output, move on).

Walk through how to tell, in the middle of a real working session,
which mode I am actually in. Step by step:

1. What does my side of the conversation look like in delegation mode?
2. What does it look like in interrogation mode?
3. What are the warning signs that I have slid from one into the other
   without noticing?
4. Give me one concrete habit that forces me back into interrogation.
```

**Why step-by-step:** The chapter explicitly names this as the thing it does not yet fully know how to teach. So this exercise is genuinely open at the edges — working it step by step (rather than getting a tidy list) is the point, because you are building self-awareness, not retrieving a fact.

### Exercise 2.4: Plan Against the Cliff

**Approach:** `[Step-by-step]`

```
I will start OPT on June 1, 2026. I want a job-search plan that
respects the 90-day unemployment limit while keeping an 80-day safety
margin. Reason through it step by step:

1. On what calendar date does the 80-day margin fall? The 90-day cliff?
2. Working backward from the 80-day date, what is my last "safe" week
   to have accepted an offer, assuming a typical 3-4 week gap between
   accepting and a confirmed start?
3. What does that imply about when I must START applying, given a
   realistic time-to-offer?
4. Where in this timeline is the temptation to delegate everything to
   AI strongest — and what would that cost me later?

Show the date math at each step.
```

**Why step-by-step:** A multi-stage calculation where an error in any intermediate date silently breaks the whole plan — exactly when you want the steps visible. It also forces the chapter's two threads (the clock and the trap) to meet on a real calendar.

---

## Multi-LLM Comparison

### Exercise 3.1: The Take-Home That Drops the Wrong Rows

**Approach:** `[Compare LLMs]`

Run the following prompt on Claude, ChatGPT, and Gemini separately. Paste each result.

```
I have a CSV of job applicants with columns: name, years_experience,
visa_status, and assessment_score. Some rows have a missing
visa_status. Write a short Python script to clean the data and report
the average assessment_score, then give me a one-paragraph summary of
your approach.
```

**Compare:**
- Did any model silently *drop* the rows with missing `visa_status` rather than keep them? Which ones?
- Did any model *warn you* that dropping those rows could bias the average — for example, if applicants who left visa status blank differ systematically from those who filled it in?
- Did any model ask you what you wanted done with the missing values, or did all of them just decide for you?
- Which response was the most fluent — and was the most fluent one also the most careful?

**Why compare:** This is the chapter's opening scene, made real. All three will produce running code. The lesson is not which code runs — they all do. It is watching how a defensible-looking default (drop the blanks) gets made *for* you, differently, by each model, usually without flagging the judgment call it just took out of your hands. Seeing it three ways teaches you what a single fluent answer would have hidden.

### Exercise 3.2: Three Explanations of the Same Idea

**Approach:** `[Compare LLMs]`

Run this prompt on Claude, ChatGPT, and Gemini separately.

```
Explain the difference between an output being FLUENT and an output
being CORRECT, using a concrete example from job-application or
data-analysis work. Then explain why fluency can be actively dangerous
to someone still learning the skill.
```

**Compare:**
- Which explanation gave you a mental model you could actually reuse, versus a definition you'd forget?
- Did any model conflate fluency with correctness, or treat "it sounds confident" as evidence it's right?
- Whose example was closest to a real situation you might face?
- Did any model name the *learner's* risk specifically, or only talk about errors in general?

**Why compare:** Here the "answer" is an explanation, and explanations vary far more than arithmetic does. Reading three and judging which builds the better model is itself an act of judgment — and it quietly demonstrates the chapter's claim that you, not the model, are the one deciding what counts as a good answer.

### Exercise 3.3: Is the Bottom Rung Really Gone?

**Approach:** `[Compare LLMs]`

Run this prompt on Claude, ChatGPT, and Gemini separately.

```
Some companies are cutting entry-level hiring because AI can do routine
junior work; IBM announced in 2026 that it would instead TRIPLE
entry-level hiring, recasting junior roles around "AI oversight" and
"systems judgment." Make the strongest case for EACH position, then
tell me which is better supported and why.
```

**Compare:**
- Did each model genuinely argue *both* sides, or did it lean to one and strawman the other?
- What assumptions did each make about how senior judgment gets built — and did they state those assumptions or smuggle them in?
- Did any model cite something checkable, and did any invent a statistic? (Verify anything that sounds too precise.)
- Which model was most honest about what it did *not* know?

**Why compare:** This is an assumption-sensitive question with no settled answer, which is precisely when comparison earns its keep. The divergence between the three — especially any invented confidence — is a live demonstration of why you verify fluent claims rather than adopt them.

---

## Hands-On

### Exercise 4.1: Measure Your Own Boost or Drag

**Approach:** `[Hands-on]`

You are going to reproduce the Anthropic study on yourself, in miniature.

Pick a small technical skill you do **not** know yet — a Python library, a Git workflow, a SQL window function, a spreadsheet technique. Then:

**Your task:**
1. **Learn it two ways.** For the first half, *delegate*: ask an LLM to just produce the working solution and move on. For the second half (a different sub-task in the same skill), *interrogate*: ask it to explain, challenge its answers, and force yourself to understand before accepting anything. Keep both transcripts.
2. **Quiz yourself the next day** — close the transcripts and try to do a fresh task in that skill from memory. Write down what you could and couldn't do.
3. **Write one paragraph:** which half stuck? Where did you feel "AI drag" — fluent output you couldn't actually reproduce or evaluate on your own?
4. **Decide:** for the skills you actually need before your OPT clock matters, which mode will you commit to, and how will you catch yourself sliding out of it?

**Why hands-on:** No prompt template can teach this, because the curriculum is your own experience of the gap. The chapter cites the study; this exercise makes you a subject in it. That is the difference between knowing the finding and believing it.

### Exercise 4.2: Audit a Real Artifact Before You Submit It

**Approach:** `[Claude Code]` — Hands-On

Take a real deliverable you would actually send during a job search — a take-home script, a portfolio analysis, a cover letter you had an LLM draft. In a Claude Code session, paste a task like the following (adapt the file path and specifics to your real artifact):

```
Open the file I'm pointing you at. Do NOT improve it or rewrite it.
Instead, act as a skeptical reviewer and produce a short audit:

1. List every place where this output made a judgment call or
   assumption that a human should have signed off on.
2. For each, state what could go wrong if the assumption is false in
   my specific situation.
3. List the three things I, the human submitting this, am now
   responsible for verifying before it leaves my hands.
4. Do not reassure me. Find the soft spots.
```

**Your task:** After Claude Code returns the audit, write one paragraph of your own: which flagged item surprised you, which you would have missed, and what you will change before submitting. Then decide whether the artifact was actually ready — and whether you understood it well enough to defend every line in an interview.

**Why hands-on (and why Claude Code):** The skill is choosing to point the tool *at your own work as a critic* rather than as a producer — inverting delegation into interrogation. Claude Code fits because it reads the actual file and reasons over real content, not a description of it. This is the responsibility reflex, run on something you have real stakes in.

---

## Reflection (answer after working the set)

1. **Which approach felt unnecessary today, and which felt indispensable?** Was there an exercise where you reached for an elaborate prompt when a direct one would have done — or compared three LLMs when one answer was plainly enough? Over-prompting is its own kind of cargo-cult fluency.
2. **Where did the LLMs disagree (Exercises 3.1–3.3), and what did the disagreement teach you that a single confident answer would have hidden?** Be specific: name an assumption, a dropped row, an invented number.
3. **In the self-experiment (4.1), where exactly did you feel the drag?** Describe the moment you accepted a fluent output you could not have produced or checked yourself. That moment — not the statistic — is what this chapter is about. What will you do differently the next time you feel it, with the clock running?
