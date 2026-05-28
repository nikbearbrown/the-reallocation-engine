# O*NET Job Trend Analyzer
### A Tool for the Irreducibly Human Curriculum

---

## What This Is

The O*NET Job Trend Analyzer is an interactive data tool at **irreduciblyhuman.xyz/onet** that lets you compare any two occupations — or any five — and see three things simultaneously: how their employment has changed since 2012, what cognitive abilities they require, and what skills they demand.

It is built for the Irreducibly Human curriculum. Its argument is the curriculum's argument: that the AI era is not eliminating work, it is sorting it. Tier 1 work — implementing specifications into code, executing defined procedures, following rules — is being automated. Tier 2 work — designing systems, formulating problems, exercising judgment, teaching, mentoring — is growing. The tool makes that sorting visible in data.

The default view when you arrive at the page shows two occupations pre-loaded: **Computer Programmers** and **Software Developers**. The employment chart tells the story immediately. Computer Programmers — Tier 1, implementing specifications — have lost more than half their workforce since 2018. Software Developers — Tier 2, design, architecture, judgment — have grown by 26% over the same period. The ChatGPT launch in November 2022 appears as an annotation on the chart. The lines diverge sharply from that point.

That chart is not a prediction. It is a record.

---

## The Three Charts

**Chart 1 — Employment Index**

Annual employment figures from the Bureau of Labor Statistics, indexed to 2018 = 100, for every occupation you select. The x-axis is time (2012–2026, with 2025–2026 shown as projections). The y-axis is the employment index. Solid lines are measured data. Dashed lines are BLS projections. A dotted vertical line marks the boundary between the two.

Annotated along the x-axis: the major AI milestones — Transformer architecture (2017), GPT-3 (2020), GitHub Copilot (2021), ChatGPT (2022), GPT-4 (2023). These are not decoration. They are the external events that the employment data is responding to. The chart invites the question: which occupations bent at each inflection point, and which did not?

**Chart 2 — Ability Profile**

A horizontal dot plot showing where each selected occupation sits on 52 cognitive, psychomotor, physical, and sensory abilities from the O*NET database. The x-axis runs from 0 to 7 (the O*NET Level scale). Each occupation appears as a colored dot with confidence interval whiskers. Behind the dots, two gray bands show the overall average across all ~1,000 occupations and the average within the occupation's field.

The cognitive abilities — Oral Comprehension, Deductive Reasoning, Problem Sensitivity, Inductive Reasoning, Originality — are the ones the curriculum argues are irreducibly human. The chart lets you see, for any occupation, where it sits on those dimensions relative to the workforce as a whole. An occupation whose cognitive ability dots cluster above the overall band is making demands on human judgment. An occupation whose dots cluster at or below the band is doing work that pattern-matching systems can replicate.

**Chart 3 — Skill Profile**

The same structure as Chart 2, but for 35 skills: Reading Comprehension, Critical Thinking, Active Listening, Judgment and Decision Making, and so on. The BLS wages data shows that AI fluency carries an 18–43% wage premium. The skill profile chart shows you what underlies that premium — which skills separate the occupations that are growing from the ones that are collapsing.

---

## The Popup

Click any occupation line in any chart, or click the occupation chip at the top of the page, and a panel opens with the full O*NET occupational profile: the formal description, the core tasks in ranked order, the top abilities and skills, knowledge domains, work values, related occupations. This is the same data that career counselors and workforce researchers use. It is now one click away from the chart that shows whether that occupation is growing or shrinking.

---

## The Data

**O*NET 30.2** — the February 2026 release of the Occupational Information Network, maintained by the US Department of Labor. O*NET covers approximately 1,000 occupations with standardized ratings on abilities, skills, knowledge, work activities, interests, and work context. The data was collected from occupation analysts and incumbent workers. Each rating includes a sample size, standard error, and pre-computed confidence intervals — all of which appear in the ability and skill charts.

**BLS Occupational Employment and Wage Statistics (OEWS)** — annual national employment estimates by occupation, from the Bureau of Labor Statistics. The tool uses 13 years of data (2012–2024), each year covering approximately 830 detailed occupations. Employment figures are indexed to 2018 to make cross-occupation comparisons legible on a single chart.

Both datasets are public domain. O*NET is licensed under Creative Commons Attribution 4.0. BLS OEWS data carries no copyright restriction.

---

## How to Use It

**Compare two occupations directly.** Search for any job title or SOC code. The search covers all 1,000+ O*NET occupations plus their alternate titles — so "CEO," "Chief Executive Officer," and "Chief Operating Officer" all find the right entry. Select up to five occupations and all three charts update simultaneously.

**Filter by cognitive demand.** On the Ability and Skill charts, filter to the Cognitive category to see only the reasoning, comprehension, and problem-solving dimensions. This is the filter that most directly illuminates the Irreducibly Human argument: which occupations demand sustained cognitive judgment, and which do not.

**Switch between Level and Importance.** O*NET rates each ability and skill on two scales: Level (how much of this is required) and Importance (how critical it is to the job). The tool defaults to Level. Switch to Importance to see a different facet of the cognitive profile.

**Filter by industry or field.** Browse occupations by major group — Computer and Mathematical, Healthcare Practitioners, Management, Arts and Design — to compare across a field rather than between handpicked occupations.

**Read the field context.** The gray CI bands on Charts 2 and 3 show where the field average sits. A dot above the field band means this occupation demands more of that ability than its peers. A dot below means less. This context is what turns a raw score into a meaningful comparison.

---

## What This Is For

The tool is a teaching instrument, not a career advising platform. Its purpose is to make the Irreducibly Human argument empirical — to show, in data, that the AI era is differentiating work by cognitive demand, and that the differentiation is already visible in the employment record.

A graduate student comparing Software Developers to Computer Programmers on this tool is not just reading a chart. They are working through the core question the curriculum is built around: what, specifically, does human intelligence do that machine intelligence cannot yet replicate, and which occupations require it?

The charts do not answer that question. They make it answerable.

---

*Data sources: O*NET 30.2 (February 2026), Bureau of Labor Statistics OEWS 2012–2024.*
*Built for the Irreducibly Human certificate program at Bear Brown & Company.*
*irreduciblyhuman.xyz · bear@bearbrown.co*
