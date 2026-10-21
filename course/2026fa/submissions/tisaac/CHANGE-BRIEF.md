# Change Brief: SWE STEM-OPT Runway

## 1. Career Situation & Engine Layers
- **Situation:** F-1 STEM Information Systems student, pre-OPT, targeting broader Software Engineering/Development roles (SWE, DevOps, Test). Wants to maximize 3-year OPT runway.
- **Layers Used:** DOL H-1B history, SEC Form D funding, BLS Wages, O*NET ability levels, ATS job posting data (Location/Work model).

## 2. Reuse & Proposed Additions
- **Reuse:** `data/80-days-to-stay/` (H-1B and Form D mapping), `data/bls/compact/soc_occupation_compact.csv`.
- **Additions [TODO: DEV]:** A `model-judgment` wrapper to parse JDs for international student bans, and a CLI parser for `--exclude-roles`.

## 3. Gates
- **Gate 1:** Does the JD explicitly ban international students? (Human verify: Check the JD text against the LLM's explanation).
- **Gate 2:** Does the job title match user's excluded roles? (Human verify: Check the title).

## 4. Predicted Failure Cases
1. **Failure Case 1 (Missing Company Data):** The company is a small startup with no H-1B history or Form D in the CSV. 
   - *Check:* The script will simply award 0 bonus points for these categories and evaluate based on salary/resilience. It will not hallucinate a record.
2. **Failure Case 2 (Job Exception):** The job URL is behind a captcha or the JD cannot be fetched.
   - *Check:* The script will catch the exception, score the job as `-1`, and list "Fetch Error" as the reason, allowing the rest of the batch to complete.

## 5. First Pass Prediction
I predict the first pass of the prototype will struggle with the `model-judgment` gate (parsing "US Citizen only" text) because LLMs might hallucinate or misinterpret boilerplate EOE (Equal Opportunity Employer) statements as sponsorship bans. **Because of this anticipated risk, for the initial Offline Prototype, I will intentionally mock the model-judgment score to 1.0. This isolates the CSV data pipelines and error-handling logic for testing before introducing the complexities of live Prompt Engineering.**

## 6. Later Revisions (Added during Planning)
- **Prediction 3 (Data Silencing):** I predict jobs will get 0 points for H-1B/Form D not because they lack it, but because of string-matching failures (e.g., "Google" vs "Google LLC"). I will explicitly tag these as `no-matched` rather than silently scoring 0.
- **Prediction 4 (Liveness False Negatives):** The ATS Liveness gate might fail to find a job because it is too new or the parser is outdated, not because it is closed. I must ensure the script distinguishes between a verified 404 (dead) and a parsing error (script failure = -1).
- **Prediction 5 (LinkedIn Easy Apply / Non-ATS URLs):** I predict that providing LinkedIn "Easy Apply" URLs or custom startup website URLs will trigger the `-1` Parsing Exception. The engine is a direct URL parser, not a search engine, so if the URL does not resolve to a supported ATS domain (Greenhouse, Lever, etc.), it will fail to parse rather than definitively skipping the job.
- **Prediction 6 (Weighting Mismatch for Persona):** I predict that the engine`s default weights (Sponsorship 0.35, Fit 0.3) will unfairly penalize my specific strategy. Since my STEM OPT gives me a 3-year runway, lacking immediate sponsorship (0 points) shouldn`t kill a job. But mathematically, if sponsorship is 0, the job requires a perfect 1.0 in Fit to reach the 0.3 threshold. Since realistic Fit scores (Location/Remote) won`t always be perfect, I must rebalance the weights (lower sponsorship weight, increase fit weight) to make the engine accurately reflect my priorities.

## 7. Revisions after grading (2026-10-21)
*Sections 1–6 above are the original record and are kept unchanged. This section records what the predictions got wrong, found after the first submission was graded and the prototype was re-read against the assignment.*

- **Gates were wrong (Section 3).** The assignment requires liveness and visa timeline to be gates. Gates 1–2 above were the international-student ban and excluded titles. Worse, the prototype scored the ban inside `fit` (a vote), so a banned role with a sponsoring company would land in Consider (0.8 × 0.35 + 0 × 0.3 = 0.28). Revised recipe: G1 liveness, G2 timeline, G3 ban and G4 excluded titles as not-yet-implemented gates cleared by a person reading the JD.
- **Failure Case 2 was only half built.** The prototype never fetches a URL; it checks whether the URL contains `greenhouse.io` or `lever.co`. The `-1` rule works for non-ATS URLs, but every ATS URL was given liveness 1.0 and labeled `record` without being opened. It is now labeled `your-input` (an assumption), and the person must run `npm run ats:liveness -- <url>` at G1.
- **Labels claimed more than the code did.** `fit = 1.0` was typed into the code and labeled `model-judgment`; no model was called. It now comes from the fixture, labeled `your-input`. `no-matched` was a fourth label outside the three allowed; it is now `source: your-input` with `tier: no-matched`, which keeps the "searched but not found" distinction from Prediction 3.
- **Prediction 6 was not acted on in code.** The weight rebalancing (role quality 0.35) exists only in the recipe text; the scorer pins role quality at 0 and may not be modified, and the prototype emits no role-quality values. The revised recipe lists it as a proposed addition, explicitly not in effect.
- **New failure seen in the run:** an invented company with no sponsorship record reached Apply at exactly the 0.30 threshold, carried only by the self-reported `fit = 1.0`. Skip rate 33%, below the ~50% a healthy run skips.
- **No offline test existed.** The first submission ran the prototype on a fixture but had no assertions. Added `index.test.mjs` (9 checks, no network).
