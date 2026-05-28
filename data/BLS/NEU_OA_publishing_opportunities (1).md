# Irreducibly Human: What AI Can and Can't Do
## Project Description and Research Program
**Principal Investigator:** Nik Bear Brown, Bear Brown & Company  
**Series site:** [irreducibly.xyz](https://www.irreducibly.xyz/)  
**Research blog:** [Theorist.ai (Substack)](https://www.theorist.ai/)  
**Public tool:** [Ability Demand Index](https://www.irreducibly.xyz/tools/ability-demand-index) *(in development)*

---

## The Research Problem

Curricula built for the industrial economy optimized for fact retrieval, arithmetic speed, and syntactic correctness — the exact capacities where AI is now superhuman. The arrival of AI did not create this failure; it exposed it. The consequence is a generation trained to compete on the machine's home turf, while the cognitive capacities that AI cannot replicate — causal reasoning, metacognitive oversight, collective intelligence, practical wisdom — go almost completely unscaffolded.

This is not a speculative claim. It is measurable. The O*NET occupational ability database, cross-referenced with Bureau of Labor Statistics employment data, allows every human cognitive capacity to be rated by AI capability level and tracked against labor market trends over time. Occupations where AI-superhuman abilities dominate the importance profile are losing employment share. Occupations where AI-absent abilities dominate are gaining it. The labor market is repricing human cognitive capacity in real time — and the curriculum has not responded.

The Irreducibly Human research program names the misalignment, builds the curriculum to correct it, and demonstrates the methodology by using it to build the series itself.

---

## The Seven-Tier Taxonomy

The series is organized around a seven-tier taxonomy of human intelligence, developed as an extension of Howard Gardner's multiple intelligences framework. Gardner's framework was built before machines became capable and did not need to ask which intelligences technology endangered. The seven tiers add that question explicitly.

| Tier | Name | AI Capability | Primary Course |
|------|------|---------------|----------------|
| Tier 1 | Pattern & Association | Superhuman | BotSpeak |
| Tier 2 | Embodied & Sensorimotor | Weak / emerging | Teacher's Guide (Companion) |
| Tier 3 | Social & Personal | Simulates, does not feel | Ethical Play |
| Tier 4 | Metacognitive & Supervisory | Poor | Conducting AI |
| Tier 5 | Causal & Counterfactual | Absent for formulation | Causal Reasoning |
| Tier 6 | Collective & Distributed | Absent by definition | The Collective |
| Tier 7 | Existential & Wisdom | Absent — no stakes | AI Sherpa (Companion) |

Tiers 4, 5, and 7 are where education needs to rebuild from scratch. Tier 1 is where most curricula currently concentrate. The taxonomy is the argument made structural.

The taxonomy extends Gardner by adding three layers his individual-focused framework cannot account for: the supervisory layer (Tier 4), the causal layer (Tier 5), and the collective layer (Tier 6). Gardner named multiple intelligences and cracked something open; forty years later there is still no validated assessment for intrapersonal intelligence. The framework became vocabulary. It never became a curriculum. The Irreducibly Human series is explicitly Stage 1 of a three-stage sequence: Name → Teach → Measure.

---

## The Empirical Foundation: O*NET × BLS Ability Demand Index

The central empirical contribution of the research program is an employment-weighted ability demand index constructed from two federal datasets.

**Data sources:**

- **O*NET 30.2 Database** — [onetcenter.org/database.html](https://www.onetcenter.org/database.html)  
  Occupational ability profiles for 900+ occupations across 52 ability dimensions (Cognitive, Physical, Psychomotor, Sensory). Each ability rated on Importance (1–5) and Level (0–7) scales per occupation. Published by the U.S. Department of Labor.

- **BLS Occupational Employment and Wage Statistics (OES)** — [bls.gov/oes/tables.htm](https://www.bls.gov/oes/tables.htm)  
  Annual employment headcount and median wages by SOC code, 1997–present. Published by the U.S. Bureau of Labor Statistics.

- **Standard Occupational Classification (SOC) System** — [bls.gov/soc](https://www.bls.gov/soc/)  
  The shared taxonomy linking O*NET ability profiles to BLS employment data. Both datasets use SOC codes, enabling a clean join across the full occupational universe.

**Methodology:**

Every O*NET ability is classified by AI capability level (superhuman / partial / human / absent) using the seven-tier taxonomy. Each ability's importance score is weighted by the employment headcount of every occupation that requires it, producing an employment-weighted importance score for each ability in each year. Weighted means and 95% confidence intervals are computed across all occupations for each ability and year, producing a time-series ability demand index: 52 abilities × 15 years × two scales.

**The finding the data supports:** Abilities in the AI-superhuman category show declining employment-weighted demand. Abilities in the AI-absent category show stable or increasing demand. The gap is widening. This is the curriculum misalignment argument made empirical.

**Interactive tool:** The Ability Demand Index ([irreducibly.xyz/tools/ability-demand-index](https://www.irreducibly.xyz/tools/ability-demand-index)) makes this dataset publicly searchable, with charts exportable as embeddable PNGs with full citation attribution. Built on Next.js, Neon (PostgreSQL), and D3.js. In development.

**Pipeline:** Open-source Python analysis pipeline available on GitHub: [github.com/nikbearbrown/irreducibly-human](https://github.com/nikbearbrown/irreducibly-human)

---

## The Course Series

Six courses and two companion volumes constitute the full curriculum. Two courses are in active institutional review at Northeastern University.

**Book 1 — BotSpeak: AI Literacy, Fluency, and Trust**  
Entry point. How to operate the cognitive forklift without being replaced by it. Prompt engineering, hallucination detection, model limitations, and the rhetorical gap between human intent and machine output. Full syllabus complete. [Course page →](https://www.irreducibly.xyz/courses/botspeak)

**Book 2 — Causal Reasoning**  
The identification layer. Interventional reasoning (Pearl's Ladder of Causation, Rung 2), counterfactual reasoning (Rung 3), and causal model formulation — the capacities where current AI is weakest and where most analytical errors originate. Syllabus submitted for course approval at Northeastern. [Course page →](https://www.irreducibly.xyz/courses/causal-reasoning)

**Book 3 — AImagineering**  
Post-AI design thinking. Generative AI produces outputs; humans produce meaning. Creative process, aesthetic judgment, conceptual blending, and the difference between novelty and genuine originality. [Course page →](https://www.irreducibly.xyz/courses/aimagineering)

**Book 4 — Ethical Play**  
Moral reasoning under uncertainty. Build a game that makes a player feel moral weight. The ethics must be in the mechanics — not in a rubric. [Course page →](https://www.irreducibly.xyz/courses/ethical-play)

**Book 5 — Conducting AI**  
The five supervisory capacities no algorithm possesses: plausibility auditing, problem formulation, tool orchestration, interpretive judgment, executive integration. The course that teaches students to conduct the orchestra, not play every instrument. [Course page →](https://www.irreducibly.xyz/notes/Irreducibly-Human/Irreducibly-Human-Conducting-AI)

**Book 6 — The Collective**  
Intelligence that cannot be possessed, only accomplished together. Collective intelligence, collaborative synthesis, and the emergent properties of epistemic systems — none of which any individual-level framework can account for.

**Companion 1 — A Teacher's Guide to AI for Embodied Learning**  
Fifteen domain chapters for embodied learning contexts: lab science, woodshop, PE, studio art, music, surgical training, nursing simulation, architecture, culinary, theater, physical therapy, early childhood, special education, and trades.

**Companion 2 — The AI Sherpa: A Practitioner's Guide for Experiential Learning**  
Eighteen-chapter guide for co-op coordinators, clinical placement directors, and study abroad advisors. Scaffolding for phronesis — Aristotelian practical wisdom — in the field. [Overview →](https://www.irreducibly.xyz/notes/AI-Sherpa/Irreducibly-Human-AI-Sherpa)

---

## Deployed Work and Impact Data

| Work | Status | Impact |
|------|--------|--------|
| Cancer Biology and Therapeutics | Deployed | 38-chapter textbook written in approximately one month; in production in an NIH program; positive cohort feedback |
| The Boyle System | Piloted | Mentor meeting gap-review time reduced from 60% to 20%; 150+ Humanitarians AI Fellows |
| Humanitarians AI (501(c)(3)) | Active | 150+ Fellows; applied AI research in humanitarian contexts |
| Causal Reasoning (Book 2) | Submitted | Syllabus submitted for course approval at Northeastern University |
| Ability Demand Index | In development | O*NET × BLS pipeline complete; web tool in development |

---

## Production Infrastructure

The series is built using a custom AI-assisted production pipeline, deliberately demonstrating the methodology it teaches. Tools include Bookie (chapter drafting), Tic TOC (textbook architecture), Popper (assertion verification), Figure Architect (visualization), CAZE (case study generation), CRITIQ (peer review protocol), and Medhavy (adaptive learning platform with Thompson Sampling pedagogy engine). The pipeline is part of the research contribution — the series is demonstrated by the method used to build it.

---

## Collaboration and Affiliation

- **Center for Curriculum Redesign** (Charles Fadel) — Stages 2 and 3 of the Name → Teach → Measure sequence
- **Humanitarians AI** (501(c)(3)) — Deployed research infrastructure and Fellows program
- **Northeastern University** — Course approval in progress; Causal Reasoning and AImagineering under review

---

# Open Access Publishing Opportunities
## Irreducibly Human Series — Northeastern University APC Coverage
**Prepared for:** Nik Bear Brown  
**Contact:** Amy Lewontin (a.lewontin@northeastern.edu) · Evan Simpson (e.simpson@northeastern.edu)

---

## Summary

Northeastern University has APC coverage or discount agreements with 20 publishers. For the Irreducibly Human research program — spanning curriculum theory, AI capability taxonomy, workforce alignment methodology, and cognitive science — five publishers represent the strongest opportunities, covering the full range from empirical pipeline work to broad curriculum argument.

**ACM** is the highest-priority target. Full APC coverage applies to ACM Transactions on Computing Education and qualifying conference proceedings. The O*NET × BLS ability demand pipeline is a natural fit for TOCE; the tier taxonomy and curriculum misalignment argument fit FAccT and AIED. ACM venues carry strong weight with the engineering faculty audience the series is explicitly designed to reach.

**AERA Open** (via Sage, Gold OA covered) is the strongest fit for the curriculum argument itself — it is fully open access by design and explicitly welcomes empirically grounded curriculum theory. High-visibility within the education research community.

**Wiley** (fully covered) includes the British Journal of Educational Technology and Journal of Computer Assisted Learning, both high-impact and directly on-topic for AI-augmented learning design.

**Springer Nature** (eligible journals covered, Nature journals excluded) includes Education and Information Technologies and the International Journal of Artificial Intelligence in Education — well-trafficked venues in the AI education space.

**Elsevier** (Core-Hybrid covered) includes Computers & Education, the flagship journal in the field, and Learning and Instruction, which is the right venue for the cognitive tier framework specifically.

**Cambridge University Press** coverage includes rapid communications and research reviews in hybrid and Gold OA journals — worth noting for early publication of the O*NET × BLS finding before the full argument is complete.

**Recommended first contacts:**  
Before submitting to any venue, confirm journal eligibility with Amy Lewontin. "Qualifying," "eligible," and "Core-Hybrid" are defined differently by each publisher agreement and not all journals within a covered publisher qualify.

---

## Appendix — Journals by Publisher

### ACM — APCs fully covered

| Journal / Venue | Fit | Notes |
|---|---|---|
| ACM Transactions on Computing Education (TOCE) | ★★★ | Primary target for O*NET × BLS pipeline and empirical methodology |
| ACM Conference on Fairness, Accountability, and Transparency (FAccT) | ★★★ | Tier taxonomy and AI capability classification argument |
| AIED — International Conference on AI in Education | ★★★ | Curriculum alignment and human+AI learning design |
| Learning @ Scale | ★★ | Scalable curriculum infrastructure and measurement |
| CHI — ACM Conference on Human Factors in Computing | ★★ | Human supervisory capacities (Tier 4) and tool design |

---

### Sage — Gold OA and Hybrid journals covered

| Journal / Venue | Fit | Notes |
|---|---|---|
| AERA Open | ★★★ | Fully open access; empirically grounded curriculum theory; strong fit for series argument |
| Journal of Educational Research | ★★ | Curriculum design and learning outcomes |
| Review of Educational Research | ★★ | Synthesis and framework papers; fits tier taxonomy as a review contribution |
| American Educational Research Journal | ★★ | Empirical education research with policy implications |
| Educational Researcher | ★★ | Short-form argument pieces; fits the curriculum misalignment thesis |

---

### Wiley — APCs fully covered in hybrid and Gold OA

| Journal / Venue | Fit | Notes |
|---|---|---|
| British Journal of Educational Technology | ★★★ | AI in education, curriculum design, learning technology |
| Journal of Computer Assisted Learning | ★★★ | Human+AI learning design; cognitive capacity development |
| Mind, Brain, and Education | ★★ | Cognitive tier framework; neuroscience of learning |
| Educational Psychology | ★★ | Metacognitive and supervisory capacities (Tier 4) |
| European Journal of Education | ★ | Broader curriculum policy argument |

---

### Springer Nature — APCs covered in eligible journals (excludes Nature journals)

| Journal / Venue | Fit | Notes |
|---|---|---|
| Education and Information Technologies | ★★★ | AI literacy, curriculum technology, workforce alignment |
| International Journal of Artificial Intelligence in Education | ★★★ | Core venue for the series; AI capability taxonomy directly relevant |
| Educational Technology Research and Development | ★★ | Instructional design; curriculum pipeline methodology |
| Cognitive Science | ★★ | Causal reasoning tier; metacognitive and supervisory capacities |
| Journal of Intelligent & Fuzzy Systems | ★ | Technical pipeline work only |

---

### Elsevier — APCs covered in Core-Hybrid journals

| Journal / Venue | Fit | Notes |
|---|---|---|
| Computers & Education | ★★★ | Flagship venue; AI in education, curriculum design, learning outcomes |
| Learning and Instruction | ★★★ | Cognitive tier framework; instructional scaffolding for irreducibly human capacities |
| Computers in Human Behavior | ★★ | Human+AI interaction; supervisory capacity development |
| Intelligence | ★★ | Tier taxonomy as a framework for human intelligence in the AI era |
| International Journal of Educational Research | ★★ | Empirical curriculum research |
| Thinking Skills and Creativity | ★★ | AImagineering course; causal and counterfactual reasoning |

---

### Cambridge University Press — covered for research reviews, rapid communications, brief reports

| Journal / Venue | Fit | Notes |
|---|---|---|
| Behavioural and Brain Sciences | ★★ | Tier framework; open peer commentary format — high-visibility for contested taxonomy |
| Psychological Review | ★★ | Cognitive capacity framework; causal reasoning tier |
| European Journal of Applied Linguistics | ★ | AI literacy and verbal ability tier |

**Note:** Cambridge coverage is limited to specific article types — research reviews, rapid communications, brief reports, and case reports. Confirm with Amy Lewontin before targeting a full empirical paper.

---

### Annual Reviews — covered for qualifying publications

| Journal / Venue | Fit | Notes |
|---|---|---|
| Annual Review of Psychology | ★★ | High-prestige; review of human cognitive capacities in the AI era |
| Annual Review of Organizational Psychology and Organizational Behavior | ★★ | Workforce alignment; ability demand trends by tier |

**Note:** Annual Reviews publishes invited and solicited review articles. Unsolicited submissions are accepted but acceptance is competitive. Confirm "qualifying" status with Amy Lewontin.

---

### Other covered publishers — lower fit, noted for completeness

| Publisher | Coverage | Potential fit |
|---|---|---|
| Association for Computing Machinery — see ACM above | Full | — |
| John Benjamins | Full | Linguistics and language cognition only; relevant to verbal ability tier |
| Royal Society of Chemistry | Full | No fit for this research program |
| The Royal Society | Full | Interdisciplinary; a stretch for curriculum argument |
| American Chemical Society | Full | No fit |
| ASME | Full | No fit |
| Microbiology Society | Full | No fit |
| National Academy of Sciences | $1,110 discounted APC | PNAS occasionally publishes education and cognitive science; high prestige, low probability |
| Bioscientifica | 50% discount | No fit |
| BioMedCentral / SpringerOpen | 15% discount | No fit |

---

*Confirm journal eligibility with Amy Lewontin (a.lewontin@northeastern.edu) before submitting. APC coverage terms vary by journal within each publisher agreement.*
