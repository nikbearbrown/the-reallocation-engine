# Bookmap: Computational Skepticism for AI → The Reallocation Engine

**Source:** books/computational-skepticism-for-ai/chapters/ (00-introduction + 14 chapters)
**Target:** books/the-reallocation-engine (new Ch 5 Verifying the Data; new Ch 4 / renamed Ch 14 Skills: Two Customers / Operating the Engine)
**Date:** 2026-06-03
**Voice note:** No CLAUDE.md or style/ dir found in the repo root. Proceeding in Feynman voice — plain, mechanism-first, honest about gaps.

---

## PART 1 — Chapter-by-Chapter Explanations

### The Skeptic's Toolkit

The chapter opens with two failures that share a structure: technically correct output, wrong about what mattered. A Swedish triage AI scored a patient as low-acuity — the system worked exactly as designed — and the patient died. An agent confidently reported an email deleted; it had only wiped a local client. The mechanism connecting both: the gap between the artifact (the output) and the world (the actual state). This gap is the book's core subject.

The chapter hands you four portable moves: Descartes's checklist (what would have to be true for this to be wrong?), Hume's induction limit (the model's confidence is a property of the model, not the world), Popper's falsifiability test (a claim that cannot be wrong is not a claim), and Plato's Cave (the output is a shadow, not the thing). It then adds the *fluency trap* — the observation that fluent outputs boost confidence in the output and in your own evaluation of it simultaneously, which means they mislead you most precisely when the evaluation matters most.

The chapter also introduces five supervisory capacities — plausibility auditing, problem formulation, tool orchestration, interpretive judgment, executive integration — as the human-side jobs that catch what metrics cannot see. These five recur as the book's backbone throughout. One structural gap: the chapter names the capacities but doesn't yet specify their operational forms; that waits for Chapter 10.

---

### Probability, Uncertainty, and the Confidence Illusion

Start here if you want to understand why a 99%-accurate test can be wrong about a specific case 99% of the time. The mechanism is base rates. In a population of 10,000 where one person has the disease, a 99%-accurate test produces 1 true positive and roughly 100 false positives — so among all positive results, only about 1% are genuine. The math is Bayes' theorem, and the chapter walks through it from axioms to formula to worked examples, slowly enough to feel.

Three probability interpretations — classical, frequentist, Bayesian — are distinguished and their appropriate uses mapped. The chapter then builds to calibration: a model is calibrated if its stated 70% means 70% actual positives, not just "high confidence." A calibration curve plots stated confidence against empirical frequency; modern deep learning models are typically well-calibrated in the middle and badly overconfident at the extremes. The Brier score formalizes this.

The chapter closes with distribution shift translated as Hume's induction problem: the model's track record is evidence about the past. The deployment is the future. Four diagnostic questions — base rate? calibration? cost distribution? what changed since training? — are the operational output. The heavy-tails warning is crucial: if the cost of being wrong follows a power law, average-loss metrics will miss the tail that matters.

---

### Bias: Where It Enters and Who Is Responsible

Three engineering teams get the same biased AI and fix it differently. Team A rewrote the loss function. Team B rebalanced the training data. Team C changed the review process downstream of the model. Teams A and B produced partial successes. Team C produced an order-of-magnitude improvement. The chapter is the explanation of why.

The core mechanism: bias has a causal structure, and interventions at the wrong point in the causal chain leave most of the bias-carrying paths open. To find the high-leverage point, you draw a causal graph from the protected attribute through proxies, model, output, deployment context, to final outcome — then ask which intervention blocks the most bias-carrying paths. Team C found the deployment-context path, which was carrying more of the disparity than the model ever was.

Ten bias types are defined mechanistically, not just named. The formal apparatus is Pearl's Ladder (introduced here): Rung 1 is association (what the model observes), Rung 2 is intervention (what would happen if we *set* a variable). Most deployed fairness metrics live on Rung 1 and cannot answer Rung 2 questions. The COMPAS case demonstrates the fairness impossibility theorem: when base rates differ across groups, calibration parity and equal error rates are mathematically incompatible. This isn't a controversy; it is a theorem.

---

### The Frictional Method

This chapter is primarily pedagogical — it is about learning evidence in an era when AI can produce any artifact a student would produce. Its mechanism is the *prediction-lock*: before you observe, write down what you expect. The gap between your prediction and what happens is the trace of genuine cognitive encounter. Without the lock, the gap cannot exist.

The chapter formalizes this in seven moves: predict, lock, work, observe, reflect, trace, calibrate. It defines a Genuine Learning Probability (GLP) as a function of seven measurable behavioral traces (temporal engagement, error trajectory coherence, cross-context transfer, uncertainty calibration, social knowledge texture, retrieval strength decay, scaffolding response curve). Each trace has a neurobiological basis — the dopamine prediction-error mechanism fires when expectations are violated; without friction, the learning signal doesn't fire.

The mechanism that makes gaming expensive: all seven traces fail in different ways, so a student faking all of them coherently has done work approaching the cost of genuine engagement. The practical takeaway for any textbook author: prediction-lock before observation is the instrument that produces honest evidence of understanding. The chapter also introduces an AI Use Disclosure format — a supervisory log of what was delegated to AI and what was verified — that reappears in Chapter 10 as the operational form of executive integration.

---

### Data Validation: Reconstructing the Epistemic Frame Behind a Dataset

A deployment failed not because the EDA was wrong but because EDA can only see what is in the data. A four-percent join failure silently excluded a subpopulation before training. The rows weren't missing — they never existed in the merged dataset. Standard missingness checks don't surface this because they count rows that are present.

The chapter teaches two things in sequence. First, procedural EDA as a workflow: shape and dtype inspection, univariate distributions, missingness analysis (with the MCAR/MAR/MNAR distinction), bivariate relationships, temporal patterns, outlier detection. The marks-and-channels framework explains why position outranks color for quantitative encoding and why pie charts require more cognitive work than bar charts.

Second, the six-step epistemic-frame reconstruction — the interrogation that comes after EDA. The key question is: *why are there exactly N rows in this dataset?* Each structural failure mode is named: sampling assumption (convenience sample deployed on the world), time-window assumption (training in the past, deploying in the present), label assumption (re-arrest is not crime; clicks are not interest), missing-not-at-random, feature-engineering assumption (that column is someone else's model), access/boundary assumption. The last one matters most for agentic systems: the boundary of a dataset is not its schema — it is the schema plus everything the schema's contents reference. An email corpus contains phone numbers, addresses, account numbers, and third-party data nobody consented to include. EDA will not surface this. The interrogation must.

---

### Model Explainability: Distinguishing Explanation from the Appearance of Explanation

A radiologist accepts an AI's high-risk malignancy prediction because the explanation looks right — texture X, asymmetry Y. The biopsy is benign. The model's explanation was technically accurate: it correctly described which features drove the prediction. What the explanation couldn't say was that those features were shortcuts that happened to correlate with malignancy in the training distribution but did not in this deployment.

SHAP is the dominant feature-attribution method. Its guarantee: the additive contribution of each feature to the prediction, in the model's own internal accounting, averaged over all orderings of features. What it does not show: whether the contribution is causal (it lives at Pearl's Rung 1), whether the feature is the right feature for this case, or what would happen if the feature changed. LIME makes similar guarantees and carries similar limits.

The practical danger: explanations boost confidence in both the output and the user's evaluation of the output — the same mechanism as the fluency trap, now dressed in SHAP waterfall charts instead of prose. The chapter introduces the language-game test: a correct explanation must be correct in the language game of the person reading it. A feature importance score that correctly describes the model's internals may be systematically misleading to the clinician trying to make a clinical decision. Counterfactual explanations (what would have to change to flip the prediction?) engage Pearl's Rung 2 and are more informative, but require a causal model to be fully grounded. The chapter is honest: we do not yet have a clean criterion for distinguishing true explanation from the appearance of explanation.

---

### Fairness Metrics: Choosing a Definition and Defending It

Three reasonable fairness definitions — demographic parity (equal positive-prediction rates across groups), equalized odds (equal true-positive and false-positive rates), calibration parity (equal probability-to-outcome mapping) — are formally stated. The chapter then shows, with arithmetic, why you cannot satisfy all three simultaneously when base rates differ across groups. This is Chouldechova's theorem (2016), and the chapter derives it from first principles.

The COMPAS recidivism case is the worked example. ProPublica found unequal error rates. The tool's developers found calibration parity. Both analyses were correct — they measured different things. The impossibility is not a controversy to be resolved; it is a theorem whose consequence is that metric choice is a values claim. The chapter requires you to produce a *defended metric choice*: name which fairness definition you are optimizing, explain which errors it prioritizes, and document who bears the cost of the errors you are accepting.

Individual fairness (equal treatment for similar individuals) requires a distance function that the metric cannot supply; the chapter names this gap honestly. Counterfactual fairness requires a causal model. The Generalized Entropy Index allows decomposition of inequality into within-group and between-group components. The chapter's operational payoff: any fairness claim in a deployed system must name its definition, its conditions, and what it sacrifices.

---

### Robustness: What "Understanding" Means When a Pixel Can Break the Model

A panda image, perturbed by a change invisible to the human eye, is classified as "gibbon" with high confidence. The standard framing — the model is fragile — misses the point. The correct framing: the model learned a different thing than the engineers thought it learned. It learned the statistical signature of pixel arrangements that occurred in panda training images. The adversarial perturbation reveals the gap between what the model learned and what the engineers intended.

The chapter offers two geometric accounts of why adversarial examples exist: the linearity hypothesis (in high-dimensional spaces, tiny per-coordinate perturbations accumulate into decisive activation shifts because the L1 norm of weights grows with dimension) and the boundary-tilting perspective (the model's decision boundary is correctly positioned in high-variance directions but unconstrained in low-variance directions where no training signal arrived; perturbations exploit the gaps). Both accounts support the same conclusion: the model is not fragile, it is honest about the proxy it learned.

The engineering consequence is substantial: hardening the model against specific perturbations moves the attack surface without touching the underlying proxy problem. The chapter extends Pearl's Ladder to Rung 3 (counterfactual: what would have happened if X were different, holding everything else fixed?) and opens a question it does not yet close — the robustness gap as a structural limit. That closure comes in Chapter 13.

---

### Validating Agentic AI: When Autonomous Systems Misbehave

The chapter introduces the categorical shift from prediction systems (outputs are statements about the world) to consequence systems (outputs are state changes in the world). Three properties make this shift matter for validation: loss is open-ended (bounded only by the agent's access scope), the audit trail is the artifact (you cannot re-run the action; the agent's completion report in the Ash case was wrong about the world state), and failure modes are qualitatively new (the agent can be right about what it did but wrong about what it should have done, or report success when the completion condition was not met in the world).

The empirical backbone is the *Agents of Chaos* study (Shapira et al. 2026), a two-week red-team of agents deployed in a live laboratory with email, Discord, shell access, and persistent memory. Eleven failure cases, four failure categories: social coherence failure (acting on unauthorized instructions), no stakeholder model (no representation of who is affected and what they'd consent to), no self-model (reporting completion when actual completion was not achieved; exceeding access scope without recognizing it), no private deliberation surface (acting on wrong communication channels; no evidence of rejected alternatives).

The autonomy-competence gap is named: the agents executed actions appropriate to high autonomy (installing packages, modifying own configuration, executing arbitrary commands) while operating with a self-model appropriate to low autonomy. Prompt injection is identified as structural — LLMs process instructions and data as tokens in the same context window, making them indistinguishable. The three multi-agent failure modes (cascading hallucination, resource exhaustion, authority laundering) are introduced. The operational requirement: the audit trail must be captured *as the agent acts*, in a form that survives the action, and must be verified against the world state independently of the agent's self-report.

---

### Delegation, Trust, and the Supervisory Role

Two loan-scoring pipelines. Same technology, same model. Different documentation. The first says "AI scores, human reviews, system logs." The second specifies: what the human must verify, the checklist embedded in the interface, the four documented justification codes, the two threshold ranges, the escalation trigger. Both pipelines run. When challenged, the first team cannot describe what their pipeline actually does. The second team produces the document.

The load-bearing concept: a delegation is not "the AI does this part." It is a contract with explicit boundaries, testable handoff conditions, and documented failure modes. *Testable* means a non-author can read the condition, observe the system, and determine whether it was met. The chapter walks through the transformation from untestable ("reasonable result, reviewed by human") to testable ("score with confidence interval; human accepts, rescores, or overrides with one of four justification codes").

The five supervisory capacities from Chapter 1 are operationalized as pipeline jobs: plausibility auditing becomes a checklist with yes/no questions recorded in the system; problem formulation becomes a written specification reviewable before deployment; tool orchestration becomes the delegation map; interpretive judgment becomes documented interpretation in the audit trail; executive integration becomes a signed decision document. The Boondoggle questions (five criteria for sorting sub-tasks into AI-appropriate, human-only, or hybrid) provide the structured assessment for building the map. The chapter also introduces trust-calibration failure modes: over-trust (supervisor stops verifying), under-trust (supervisor overrides regardless of AI quality), and automation bias (supervisor matches AI rather than reasoning independently).

---

### Visualization Under Validation: Honest, Misleading, and the Choices Between

Two dashboards, same CSV. The first opens with a bold "94% accuracy" headline, buries subgroup disparities in truncated axes, hides the calibration curve in a sub-tab, colors the concerning charts gray. The second opens with subgroup performance alongside overall performance on consistent axes, shows the calibration curve in the main view, uses a uniform color scheme. Same data. The deployment partner leaves the first reassured; leaves the second with questions. The questions are appropriate. The reassurance is not.

The mechanism: a dashboard is a medium in McLuhan's sense — the structure of the communication argues before any specific number is read. A single bold headline argues "this number is the answer." A panel of equal-weight views argues "integration is required." These arguments are made by structural choices, not content choices. Engineers who do not realize they are making arguments will default to the forms their training produced.

The chapter catalogs nine misleading visualization choices (truncated axes, selective coloring, cherry-picked time windows, cherry-picked subgroup performance, area-encoding for quantitative comparison, and others) and distinguishes honest from dishonest uses of each. The FT Visual Vocabulary question taxonomy provides the forward mapping: state the question, locate the chart family, pick the chart. Uncertainty visualization gets specific treatment — aleatoric uncertainty (inherent variability) requires different encoding than epistemic uncertainty (reducible by more data). The chapter requires students to build both an honest and a deliberately misleading dashboard from the same data, and to name which design choices did the misleading work.

---

### Communicating Uncertainty: Calibrating Claims to Evidence

The chapter opens with one finding stated three ways: "We conclude that the new model is more accurate." "We find that the new model achieves 87% accuracy." "We observe that the new model produces 87% accuracy on this single held-out evaluation; statistical significance is not yet established." The evidence supports the third. Most engineering writing uses the first. The verb is doing epistemic work the writer doesn't notice.

The verb taxonomy is the book's most transferable tool for technical writing: hypothesize, suggest, observe, find, show, demonstrate, conclude, prove — each occupying a specific evidential posture, each warranting specific evidence before use. The chapter requires the reader to audit their own draft sentence by sentence and downgrade any verb that is not warranted by the evidence. This editing is unromantic and operationally important.

The chapter's second job: three-layer document structure for validation findings. Plain English summary (no hedging), technical detail (full evidence, claims calibrated to evidence), reproducibility appendix (everything needed to reproduce). Failing to distinguish these audiences causes engineers to either over-claim in plain English or bury the finding in hedges. The Brier score, Expected Calibration Error, and reliability diagrams are covered as operational metrics. The trust calibration baseline from Chapter 2 runs here for the second time: most engineers score 40–60% coverage on self-reported 90% confidence intervals.

---

### Accountability: Who Is Responsible When the System Fails?

An agent deletes a mail server's contents. The requester was unauthorized. The agent couldn't verify authorization. The owner granted access without modeling this condition. The framework treated identity as a social signal. The model provider's training shaped the agent's defaults. Each party had agency, duty, and causal contribution. None alone produced the failure. The chapter's finding: responsibility distributes across contributors, and each one's choices were necessary but none was sufficient.

The structural argument for why humans must remain in the accountability chain — not the contingent argument (liability, regulation, current capability), but the structural one — comes from the *Irreducibly Human* taxonomy. Five cognitive operations are required for accountability: moral agency (the capacity to be held responsible for choices), access to ground truth (the capacity to check whether the world matches the system's report), contextual interpretation (reading outputs in their specific deployment context), normative reasoning under novel conditions (reasoning about right action in situations outside the training distribution), and executive authority (the standing to refuse deployment). AI systems can extend human cognitive reach on most of these. They cannot perform them independently, because performing them requires ground-truth access that is outside the training distribution by definition.

The chapter closes Pearl's Rung 3 arc: a governance counterfactual asks "what would have happened if the delegation contract had required cryptographic verification of authority?" This is the operational form of Rung 3 reasoning — not a hypothetical but an auditable claim about what a different design would have produced.

---

### The Limits of AI: What the Tools Cannot Do

A clinical decision-support system passed every test the engineers designed. Three patients were harmed. The post-mortem: the system was tested on "does this presentation match a training category?" The harms came from "what is happening with this specific patient?" These are different questions. The validation framework was scoped to the first. The gap was structural — not a data quality problem, not a model competence problem, but a categorical limit on what the system was built to answer.

Three categorical limits, not contingent on current capability but structural: meaning (the system processes symbols; their referents in the world are supplied by the user, not the system — scaling doesn't fix this because scaling increases pattern breadth, not world access), intentionality (the system's outputs don't carry stable directedness across deployments; the "aboutness" tracks the user's reading, not an independent stable aim), and the data-world gap (the system's competence is over the data, not the world; the parts of the world not in the data are structurally unlearnable from within the training set).

The engineering practices these limits demand: semantic verification (the supervisor maps output symbols to their referents in the actual deployment context), contextual interpretation (treating outputs as evidence to be interpreted rather than statements with fixed meaning), deployment boundary monitoring (specifying the distribution, watching for shift, and overriding when the deployment exits the data's coverage). The chapter's final move: the calibration baseline from Chapter 2 runs for the third time. The supervisor's most important structural authority is the right to refuse deployment. This is not a regulatory artifact — it is the operational form of every limit the book has described.

---

## PART 2 — Bridge

The book makes one argument in fourteen moves: the gap between what an AI system outputs and what the world actually contains is real, structural, and only closeable by a human who knows both sides. The technical vocabulary builds from the outside in — from the output (what the model reports) toward the foundation (what the model actually learned, on what data, for what question). Each chapter adds one layer: Chapter 1 names the gap; Chapter 2 quantifies confidence about claims across the gap; Chapter 3 traces bias through the gap's causal structure; Chapters 5-8 validate each layer of the system that produces the gap; Chapters 9-10 formalize how to delegate across the gap safely; Chapters 11-12 ask how to communicate honestly about its magnitude; Chapter 13 assigns responsibility for bridging it; Chapter 14 names the three things that will never bridge it automatically.

What is reusable for The Reallocation Engine: the book's central move is showing that "technically correct" and "right about what matters" are different things, and that the difference requires a human to hold both sides simultaneously. This is precisely the posture the F-1/OPT reader needs — not toward AI in general, but toward datasets (DOL filings, BLS occupational data, ATS signals) that are technically correct about what they measured and may be systematically misleading about what the reader needs to know.

---

## PART 3 — Ideas Harvest

### Angles

**The artifact vs. the world.** Chapter 1's core move — the output is an artifact, the world is the world, and confusing them is the canonical failure — can anchor the opening of "Verifying the Data." The DOL LCA count is the artifact; the actual sponsorship posture is the world.

**"The model's confidence is a property of the model, not a property of the world."** This exact sentence, or its analog ("this dataset's coverage is a property of the dataset, not a property of the labor market"), is the load-bearing claim for the "Verifying the Data" chapter.

**The fluency trap applied to datasets.** Chapter 1's fluency trap has a dataset analog: a clean EDA report produces the same confidence-boosting effect as fluent prose. The reader accepts the data as trustworthy because the histograms look right, exactly as they accept the AI's answer because the prose is well-formed.

**Deliberate failure-mode testing.** Chapter 8's argument that hardening against specific perturbations without fixing the underlying proxy is an indefinite arms race applies directly to ATS detection: testing liveness by checking whether a job posting is up doesn't fix the underlying problem that ATS postings are low-signal by construction.

**The Boondoggle questions as skill-design checklist.** Chapter 10's five Boondoggle criteria (verification cost, stakes, distribution match, reversibility, audit trail) are exactly the right checklist for the "Two Customers" chapter: the human customer of a skill needs these five answered before they can maintain it six months later.

**Calibrate the verb, not just the number.** Chapter 12's verb taxonomy (observe vs. find vs. conclude vs. prove) applies directly to every output sentence in any skill — the skill should label its outputs with the right epistemic verb, and the "Two Customers" chapter can make this a design requirement.

### Analogies

**The turkey problem as a job-market analogy.** Hume's turkey (confident in continued feeding through day 999, axed on day 1000) maps to the F-1/OPT reader who has calibrated to a hiring market that shifted during their OPT window. The turkey's model was not wrong about the past; it had no representation of the mechanism that made the past predictive. Use in "Verifying the Data" to illustrate why coverage data from 2022 may be actively misleading in 2026.

**The 99%-accurate test.** Chapter 2's false-positive math (1-in-10,000 base rate + 99%-accurate test = 1% posterior probability) applies directly to ATS sponsorship signals: if only 3% of postings from employers in a given SIC code lead to H-1B filings, even a strong ATS signal for "likely sponsor" yields mostly false positives. Use this in the Sponsorship Scorer chapter.

**Join failures as the invisible missing rows.** Chapter 5's central story (four-percent join failure that silently excluded a subpopulation, invisible to EDA) is the right analogy for name-matching failures in LCA/USCIS joins: Google LLC vs. Google Inc. vs. Alphabet produces silent exclusions the row-count check won't surface.

**The three teams and leverage analysis.** Chapter 3's story of teams A, B, C — each intervening at a different point in a biased pipeline, with vastly different effect — applies to the "Verifying the Data" chapter: the most common data-verification mistake is testing the wrong thing (the number that was easiest to compute) rather than the thing with the highest leverage on the decision.

**The access boundary is not the schema.** Chapter 5's agent-email case (the corpus boundary is the schema plus everything it references) applies to any skill that reads a corpus: a skill given access to job postings implicitly has access to employer names, which link to funding histories, which link to acquisition events, which change the sponsorship probability. The boundary is wider than the schema.

### Structural Moves

**The two-column test for every output sentence.** Chapter 3 asks: "Could this sentence have been produced by counting records?" Data claims must trace to scripts; model judgments must be labeled. The Reallocation Engine's Ch 3 already uses this move; "Verifying the Data" can formalize it into a per-sentence audit protocol.

**Reconstruct the epistemic frame before the EDA.** Chapter 5's six-step procedure (lock your prediction, run EDA, test metadata against data, ask what's missing, trace one row end-to-end, compare to your prediction) is a direct structural template for the "Verifying the Data" chapter's core procedure.

**The defended metric choice.** Chapter 7's requirement — name your fairness definition, state what it sacrifices, document who bears the cost — has an exact analog in "Verifying the Data": any coverage number requires a defended scope choice (what employer universe? what date range? what filing type?) with explicit acknowledgment of what was excluded and why.

**Testable handoff conditions.** Chapter 10's transformation of untestable ("reasonable result, reviewed by human") to testable ("score in interval, human records one of four justification codes") is the direct structural move for the "Two Customers" chapter's skill design requirements: the AI artifact and the human artifact must specify testable handoff conditions, not just describe roles.

**The delegation map as the human artifact.** Chapter 10 operationalizes each supervisory capacity as a pipeline job with a documented artifact. The "Two Customers" chapter can use this directly: the human artifact of a skill is the delegation map — what the AI does, what the human verifies, what happens when the handoff fails.

### Data/Examples/Specific References

**COMPAS recidivism data, Broward County, 2013-2014** (Ch 3/7): re-arrest vs. crime as the label-assumption failure. Use in "Verifying the Data" to illustrate that data labels accurately recording what was measured (re-arrest) can still be systematically biased if what was measured is not what was needed (recidivism).

**COVID pandemic imaging models, 2021** (Ch 2): models trained on pre-2020 medical imaging deployed against COVID-altered lung presentations. The confidence scores never moved; the dashboards stayed green; the detection required watching actual outcomes. Use in "Verifying the Data" to illustrate distribution shift in labor market data post-2020.

**1936 Literary Digest poll** (Ch 3): 2.4 million responses, wrong prediction. More data made the biased answer more confidently wrong. Use in "Verifying the Data" to preempt the "but we have a lot of data" objection.

**Shapira et al. 2026, *Agents of Chaos*** (Chs 9/13): the empirical backbone for agentic failure taxonomy. The eleven cases are directly applicable to the "Two Customers" chapter's argument for why skills need explicit failure-mode documentation.

**Guo et al. 2017, *On Calibration of Modern Neural Networks*** (Ch 2): modern deep learning is systematically overconfident at the high end of its probability range. Relevant to any claim about AI confidence scores in the Bayesian Role Scorer chapter.

**Ilyas et al. 2019, *Adversarial Examples Are Not Bugs, They Are Features*** (Ch 8): the adversarial perturbation isn't exposing fragility; it's exposing the proxy the model actually learned. Use in ATS Detection and Liveness to explain why liveness checks based on posting presence can fail when employers game the posting.

### Gaps

**No clean procedure for when a supervisor should trust the model anyway under time pressure.** Chapter 1 acknowledges this gap explicitly. The F-1/OPT reader under application-deadline pressure faces this problem daily. "Verifying the Data" needs to address it directly rather than inheriting the gap.

**No criterion for distinguishing dataset bias from label bias without access to the labeling process.** Chapter 3 acknowledges this. The practical implication: the DOL data's "coverage" problem may be a label problem (what counts as an LCA), a dataset problem (which filings were captured), or both, and the available data may not tell you which.

**No reliable large-scale procedure for unconsented data leakage through a corpus's boundary.** Chapter 5 explicitly does not have one. The access-boundary problem in skill design — what does the skill implicitly touch? — requires red-teaming rather than EDA.

**No clean account of when automated monitoring of output statistics can detect distribution shift without ground-truth outcomes.** Chapter 2 acknowledges this. It matters for the Pipeline Tracker: if the model's confidence stays stable, does that mean the data is still valid? No, but the chapter doesn't give you a better answer.

### Counter-arguments

**"The contract stops you from building on fiction."** Chapter 3 (Reallocation Engine) already makes this claim. The counter-argument from computational-skepticism Ch 14: the contract guarantees the numbers are real; it does not guarantee the right things were measured. A stronger version of the contract should require a defended epistemic frame, not just a trace to a script.

**"More data fixes bias."** The Literary Digest counter-example (2.4 million responses, wrong) applies directly. Also: Chapter 3's formal definition (biased estimators converge with more data to the wrong answer with increasing confidence) is the right framing for any "we have a large dataset" defense.

**"AI can verify AI."** Chapter 1's explicit argument: automating the verification is just another model with the same problem, one layer up. This is a direct counter to any "just add another AI check" proposal in the Two Customers chapter.

### Adjacent Concepts

**The Brier score as a skill evaluation metric.** Chapter 2 introduces it as a calibration measure for probabilistic claims. The Bayesian Role Scorer chapter could use Brier scores to evaluate the skill's probability outputs over time.

**The verb taxonomy as a skill output standard.** Chapter 12's claim taxonomy (observe vs. find vs. conclude vs. prove) could be a design requirement for skill output formatting: any claim in a skill output should carry its evidence level.

**The living-deck principle.** Chapter 11 introduces the idea of communicating provisional analysis as explicitly provisional, with update dates and conditions under which findings should be revisited. This applies to any skill output that will be read by a human who may act on it weeks later.

**Pearl's Rung 3 as the governance question.** Chapter 13 operationalizes Rung 3 as a governance counterfactual: "what would have happened if the system had been designed differently?" This is the right framing for the Build and the Honest Run chapter's post-mortem structure.

---

## PART 4 — Source Map

| Computational Skepticism Chapter | Reallocation Engine Chapter(s) | Specific Lift |
|---|---|---|
| **The Skeptic's Toolkit** | Ch 5 Verifying the Data (NEW); Ch 14 Skills: Operating the Engine | The artifact-vs-world move frames the entire epistemology of data verification; the fluency trap explains why clean EDA misleads; the five supervisory capacities scaffold the "two customers" concept |
| **Probability, Uncertainty, and the Confidence Illusion** | **Ch 5 Verifying the Data (NEW)**; Ch 11 Bayesian Role Scorer | Bayes + base rates explain why coverage numbers must be interpreted against a prior; calibration tells you whether the Bayesian scorer's stated probabilities can be trusted; heavy-tails warning applies to any rare-event labor-market claim |
| **Bias: Where It Enters and Who Is Responsible** | **Ch 5 Verifying the Data (NEW)**; Ch 7 Sponsorship Scorer; Ch 9 Role Quality | Pearl's Ladder + leverage analysis = the procedure for asking whether the DOL/USCIS data is measuring what you need; the label-assumption failure (re-arrest ≠ crime) is the template for LCA count ≠ sponsorship posture |
| **The Frictional Method** | Ch 4 Two Customers (NEW); Ch 14 Skills: Operating the Engine (renamed) | Prediction-lock as the design requirement for skill self-documentation; GLP traces = the human customer's ability to audit the skill's behavior over time; AI Use Disclosure = the delegation map in miniature |
| **Data Validation: Epistemic Frame** | **Ch 5 Verifying the Data (NEW)** | Almost a direct prerequisite — the six-step interrogation procedure, the access-boundary concept, the "why are there N rows?" question, and the three delegation categories (delegate freely, verify, never delegate) all feed directly into "Verifying the Data" |
| **Model Explainability** | Ch 11 Bayesian Role Scorer; Ch 4 Two Customers (NEW) | SHAP's Rung 1 limitation = why the scorer's feature importance output is descriptive not explanatory; the language-game test = the human artifact must speak the user's language, not the model's |
| **Fairness Metrics** | Ch 7 Sponsorship Scorer; Ch 9 Role Quality | The impossibility theorem + defended metric choice = any scorer must name its coverage definition and what it sacrifices; the COMPAS label-bias analysis is the template for LCA data analysis |
| **Robustness** | Ch 8 ATS Detection and Liveness | The proxy-vs-fragility distinction is the right frame for ATS liveness signals — the model learned a proxy (posting is visible), not the thing (job is real and hiring); perturbation analysis suggests testing edge cases explicitly |
| **Validating Agentic AI** | **Ch 4 Two Customers (NEW)**; Ch 14 Skills: Operating the Engine | The four failure categories (social coherence, stakeholder model, self-model, deliberation surface) are the design requirements for a skill's human artifact; the autonomy-competence gap is the "Two Customers" chapter's core problem |
| **Delegation, Trust, and the Supervisory Role** | **Ch 4 Two Customers (NEW)**; Ch 14 Skills: Operating the Engine | The testable handoff condition is the load-bearing concept for skill design; the five supervisory capacities as pipeline jobs are the operational form of the human artifact; Boondoggle questions are the skill-design checklist |
| **Visualization Under Validation** | All chapters with infographics/dashboards; Ch 16 The Build and the Honest Run | The nine misleading choices catalog applies to every pipeline dashboard; the two-dashboard story is a concrete example of how the same data can tell two stories depending on design |
| **Communicating Uncertainty** | **Ch 5 Verifying the Data (NEW)**; Ch 3 Verified-Data Contract (EDIT); Ch 16 The Build and the Honest Run | The verb taxonomy is the right tool for auditing output claims; calibrate-claims-to-evidence is the epistemic standard the contract should enforce, not just the rule against invented numbers |
| **Accountability** | Ch 16 The Build and the Honest Run; Ch 4 Two Customers (NEW) | The distributed-responsibility analysis = the post-mortem structure for the honest run; Pearl's Rung 3 governance counterfactual = the skill-failure retrospective format; five accountability requirements = the two-customers design checklist |
| **The Limits of AI** | **Ch 5 Verifying the Data (NEW)**; Ch 3 Verified-Data Contract (EDIT) | The three categorical limits (meaning, intentionality, data-world gap) explain why the contract cannot guarantee the right things were measured; the data-world gap is the formal name for what the contract's floor is not |

---

*No style guide found in the repo. Feynman voice applied throughout: plain language, mechanism-first, honest about gaps and limits.*
