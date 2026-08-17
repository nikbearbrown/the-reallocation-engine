# Learner Persona Specification: Model and Literature Research Prompts

## What a Real Persona Looks Like

A tutor-adaptive persona is not a label or a trait cluster. It is a composite character grounded in documented patterns from educational research — specific enough that a tutoring system (or a human tutor) could make a concrete instructional decision from it.

Each persona needs:

- **Name and snapshot** — a brief narrative making the learner feel like a person, not a category
- **Academic context** — year, major, course, prior experience
- **Motivational state** — why they're here, what they fear, what they want
- **Documented misconception or struggle pattern** — grounded in literature, not invented
- **Typical failure mode** — what goes wrong and how it manifests in interaction
- **Tutor adaptation logic** — what the system should do differently for this learner
- **Literature anchor** — the research tradition the persona draws from

---

## Example Persona: Physics Undergraduate

**Name:** Darius  
**Snapshot:** Junior mechanical engineering student, strong algebra skills, consistently earns Bs on exams, but cannot explain *why* Newton's third law applies in a given situation. Describes physics as "applied math." Gets frustrated when asked to reason without numbers.

**Academic context:** Intro E&M, second semester. Has passed Mechanics. No prior conceptual physics instruction — high school course was entirely procedural.

**Motivational state:** Grade-oriented. Views physics as a hurdle, not a domain. Low intrinsic motivation but high performance anxiety.

**Documented struggle pattern:** Treats equations as computational tools without causal meaning. Cannot map between symbolic representation and physical situation. Fails transfer problems where surface features differ from worked examples.

**Typical failure mode in tutoring:** Asks for the formula immediately. Accepts any explanation that produces the right answer. Does not flag confusion unless a numerical answer is wrong.

**Tutor adaptation logic:**
- Withhold formulas; require verbal description of the physical situation first
- Use Socratic prompting before any procedural step
- Flag "right answer, wrong reasoning" as a learning event, not a success
- Case Study and Ask AI prioritized; Quiz Me only after conceptual grounding

**Literature anchor:** Physics Education Research (PER); Force Concept Inventory misconceptions literature (Hestenes et al.); resource-based models of student reasoning (Hammer, 1996); expert-novice problem categorization (Chi et al., 1981)

---

## Example Persona: CaNCURE Undergraduate Researcher

**Name:** Priya  
**Snapshot:** Sophomore biochemistry major, first research co-op, placed in a cancer nanomedicine lab. Strong classroom GPA. Has never designed an experiment. Waits to be told what to do. Interprets every setback as personal failure.

**Academic context:** Six-month research co-op. No prior lab research experience. Mentor is a postdoc with limited time for daily supervision.

**Motivational state:** Strong achievement identity built entirely on coursework performance. Genuinely interested in medicine. Significant imposter syndrome — compares herself to PhD students in the lab.

**Documented struggle pattern:** Cannot tolerate ambiguity in tasks. Asks clarifying questions not to understand but to reduce uncertainty. Avoids generating hypotheses because being wrong feels like incompetence. Conflates not-yet-knowing with not-belonging.

**Typical failure mode in tutoring:** Asks the AI to tell her what the answer is rather than reason toward it. Accepts first plausible explanation. Does not push back or generate alternatives.

**Tutor adaptation logic:**
- Normalize uncertainty explicitly and repeatedly
- Require hypothesis generation before any explanation is offered
- Reframe errors as data, not failure
- Glimmer and Case Study prioritized to build tolerance for open-ended reasoning
- Watch for "just tell me" bypass behavior — treat it as a signal, not a request to fulfill

**Literature anchor:** STEM identity and belonging literature (Carlone & Johnson, 2007); imposter phenomenon in undergraduate researchers (Parkman, 2016); novice-to-expert transitions in scientific reasoning (Kuhn, 1989; Dunbar, 1995); undergraduate research experience outcomes (Lopatto, 2004)

---

## Google Deep Research Prompts

Use these prompts one at a time in Google Deep Research. Each is scoped to a specific literature base. The goal is to surface empirically documented learner patterns — not learning style frameworks (avoid VAK, MBTI, Kolb).

---

### Physics Undergraduate Personas

**Prompt 1 — Misconceptions and conceptual struggle**
```
Search the Physics Education Research (PER) literature for empirically documented patterns of conceptual difficulty among undergraduate physics students. Focus on studies using the Force Concept Inventory, Mechanics Baseline Test, or similar validated instruments. Identify recurring misconception clusters — for example, confusion between force and velocity, failure to apply Newton's third law symmetrically, or difficulty with vector decomposition. For each pattern, describe the student population, the specific misconception, how it manifests in problem-solving behavior, and what instructional interventions have been shown to address it. Cite primary sources.
```

**Prompt 2 — Expert-novice problem categorization**
```
Search the cognitive science and physics education literature on differences between how expert physicists and novice undergraduate students categorize and approach physics problems. Focus especially on studies showing that novices use surface features (objects mentioned, equations visible) while experts use deep structural features (underlying principles). Include work by Chi, Feltovich, and Glaser (1981) and subsequent replications or extensions in undergraduate physics contexts. Describe what these differences look like in actual student behavior during problem solving.
```

**Prompt 3 — Transfer failure in undergraduate physics**
```
Search the educational psychology and physics education literature on transfer failure — situations where undergraduate students can solve familiar problem types but fail when surface features change or problems require applying principles in new contexts. Include research on near transfer vs. far transfer, interleaving effects, and schema formation. Identify the specific student profiles or prior knowledge states most associated with transfer failure. Cite empirical studies with undergraduate populations where possible.
```

**Prompt 4 — Motivational and identity factors in physics persistence**
```
Search the STEM education literature on motivational, identity, and affective factors that predict whether undergraduate students persist in physics or disengage. Include research on physics identity (Hazari et al.), expectancy-value theory in physics contexts, and the role of prior high school physics experience. Focus on patterns that would be visible in how a student interacts with a tutoring system — for example, avoidance behavior, grade orientation vs. mastery orientation, or fear of asking questions.
```

---

### CaNCURE / Undergraduate Research Personas

**Prompt 5 — Novice undergraduate researchers: documented struggle patterns**
```
Search the undergraduate research experience (URE) literature for empirically documented patterns of difficulty among students in their first research placement, particularly in biomedical or life sciences contexts. Focus on studies examining how novice researchers develop scientific reasoning, handle experimental failure, ask questions, generate hypotheses, and relate to mentors. Include work by Lopatto, Thiry, Laursen, and others in the URE assessment literature. Identify specific behavioral patterns that distinguish novice from more experienced undergraduate researchers.
```

**Prompt 6 — Imposter syndrome and STEM identity in undergraduate researchers**
```
Search the higher education and STEM identity literature for research on imposter phenomenon, belonging uncertainty, and identity threat among undergraduate students in research settings. Include Carlone and Johnson's science identity framework, work on URE and underrepresented students, and any studies specifically examining how imposter syndrome affects research behavior — hypothesis generation, question-asking, interpretation of failure. Identify behavioral signatures that would be detectable in a tutoring or mentoring interaction.
```

**Prompt 7 — Novice-to-expert transitions in scientific reasoning**
```
Search the cognitive science and science education literature on how undergraduate students develop scientific reasoning during research experiences. Include Dunbar's studies of reasoning in real labs, Kuhn's work on the development of scientific thinking, and studies on how undergraduates learn to distinguish hypothesis from result, correlation from causation, and procedural knowledge from conceptual understanding. Focus on the transition points where novice reasoning patterns break down and more expert patterns begin to form.
```

**Prompt 8 — Undergraduate research in cancer/nanomedicine: motivational and identity context**
```
Search the science education and undergraduate research literature for studies examining the experiences of students in highly specialized or clinically-adjacent research placements — particularly biomedical research, oncology-adjacent work, or nanomedicine. Include any studies on how proximity to clinical application (patient impact, disease context) affects student motivation, identity, and reasoning. Also search for literature on co-op and experiential learning models in STEM and how they differ from traditional lab rotations in terms of student development outcomes.
```

---

## What to Do With the Results

For each prompt, the output should feed a persona in this format:

1. **What the literature says the pattern is** (with citation)
2. **What it looks like in behavior** (observable, not inferred)
3. **What a tutoring system would need to do differently** (concrete adaptation logic)

Personas built this way are defensible, reusable across courses, and give the Medhavy tutor enough signal to actually modulate — mode selection, scaffolding level, Socratic pressure, error framing, pacing.
