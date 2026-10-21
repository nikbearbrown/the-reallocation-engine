# Friction Log: tisaac

Scope: `course/2026fa/submissions/tisaac`

## Executive summary

These are my working notes from building my recipe (an F-1 STEM student going after software jobs, who can live without H-1B sponsorship because STEM OPT gives three years). Each entry says what I asked, what the AI did, and what I kept, changed, or rejected. My main calls were: count missing data as "not found" instead of guessing, score a broken job as -1 instead of crashing, treat location and remote work as part of role quality, and point out that the default weights quietly make sponsorship required. The AI did most of the writing and coding, and it pushed back once (liveness has to stay a gate). Two things are still open; they are listed at the end.

## About this revision

Revised 2026-10-13 after instructor feedback that parts of the log were in the assistant's voice and the human/AI split was too brief. I rewrote every entry in my own voice and split each one into **Me** and **AI**. The facts, order, and times are unchanged from the original log, which is still in git history (last version at commit `98a46a1`). Nothing new was added from memory.

## Who did what

| | Me | AI |
|---|---|---|
| Persona and strategy | Picked the persona and the "no H-1B needed, 3-year OPT runway" strategy | Checked my ideas against the datasets the engine has |
| Scoring rules | Proposed gates and votes, location and remote tiers, wider role list | Wrote them into the recipe, card, and change brief |
| Error handling | Designed the -1 per-job error vs. halt on system error, and the `no-matched` tag | Wrote it into Stop Conditions and the prototype |
| Code | Reviewed the output numbers | Wrote `index.js` and `fixture.json`, ran the scorer |
| Pushback I took | Accepted keeping liveness as a gate | Rejected my idea to demote it to a vote (rubric says gates) |
| Pushback I gave | Caught the weighting flaw, the role_quality mapping, the offline-LLM contradiction, a failed file edit, and missing grouping | Fixed each one after I flagged it |

---

### 2026-10-03 13:56: Understanding the engine and data sources

**Me:** I thought the reallocation engine was a resume writer that uses generative AI. I asked the AI to explain how it really works and where data like SEC Form D and DOL H-1B records come from.

**AI:** Explained the "3-3-2 split" and that the engine is an evidence checker (gates and votes) on top of cleaned government data already in the repo. Told me to use my own namespace (like `tisaac-...`) so I don't collide with other students.

**My call:** Accepted. My first idea was wrong. The tool saves research time so I can spend it on networking, it does not write content. I decided to build on the real data layers (Form D, H-1B) and not on LLM writing.

### 2026-10-03 13:58: What if a company is not in the data

**Me:** I asked if the engine will always find data for every company I list, and what happens if a company is missing.

**AI:** Said missing data is normal, especially with sample data, and pointed me to the honesty rule: never let the LLM guess missing visa or funding records.

**My call:** Accepted. A missing company is a failure case to handle, not a bug. I decided to tag missing records in the script instead of filling them in, and to make this one of my predicted failure cases in `CHANGE-BRIEF.md`.

### 2026-10-03 18:30: Persona and scoring ideas

**Me:** I set my persona: F-1 STEM Information Systems student, before OPT, going after SWE roles. My scoring ideas:
- Gate out jobs that say they don't take international students.
- Bonus for H-1B history, high salary, and AI-resilient jobs (O*NET).
- Minus points for past hiring freezes.
- A setting to exclude role types (like Data/ML).

I don't strictly need H-1B, because 3 years of STEM OPT is enough runway.

**AI:** Checked this against the datasets. There is no hiring-freeze data, but SEC Form D (recent funding) exists and shows the opposite (money to hire). Suggested swapping the freeze penalty for a funding bonus. Also pointed out that "doesn't sponsor" needs an LLM to read the job description, so it is a `model-judgment` gate, and my role exclusion is `your-input`.

**My call:** Accepted the swap from hiring freeze to Form D funding bonus. Kept the rest of my design.

### 2026-10-03 18:35: Stop conditions

**Me:** I defined how errors should work. A problem with one job should not stop the run: score that job -1 and log why. A system-wide error should stop the run right away. I asked the AI to put this in the recipe and card.

**AI:** Wrote my rule into the Stop Conditions of `tisaac-swe-stem-opt.md`, and drafted `CHANGE-BRIEF.md` from the persona and rules so far.

**My call:** Kept it. The -1 idea was mine. It means a bad job is flagged without crashing and without making up a value. Next I read the draft recipe.

### 2026-10-03 18:45: Wider target roles

**Me:** After reading the draft, I said "Software Engineer" only was too narrow. I wanted related roles too: DevOps, Test/QA, general software dev. Keep the Data/ML exclusion setting.

**AI:** Updated the target role in the recipe, card, and change brief to "Software Engineering & Development (SWE, Software Dev, DevOps, Test/QA, etc.)".

**My call:** Kept it. Job titles move around a lot, so in the prototype role matching should use a wider keyword list or SOC families, not an exact title match.

### 2026-10-03 18:50: Location and work model scoring

**Me:** I added two tiered votes:
1. Location: Boston (max) > Seattle / big hubs > second-tier cities > rural (0).
2. Work model: Remote (max) > Hybrid > In-person (0).

**AI:** Added both to the recipe and card, and mapped them to ATS posting data (Greenhouse and Lever postings usually list location and remote).

**My call:** Kept it. The script will need a small lookup to put city names into tiers (Boston and Cambridge both in the top tier).

### 2026-10-03 19:10: Failure cases and the liveness gate

**Me:** I proposed two changes for the change brief:
1. A `no-matched` tag, so "searched and not found" is not the same as "searched and found 0".
2. Make the ATS liveness check a vote (0 points plus a `not exist?` tag) instead of a gate. I was worried about false negatives: the job is too new, or the ATS parser fails.

**AI:** Added `no-matched` and also suggested more failure cases (company name mismatches). **Rejected** my liveness idea: the assignment says liveness and visa timeline are gates, not votes. Suggested a middle path: a real 404 closes the gate, a parsing error goes to my -1.

**My call:** Accepted the rejection. I still think false negatives are a real risk, but the middle path covers it: a dead job and a broken parser now look different in the output. `no-matched` went into the recipe.

### 2026-10-03 19:28: How does the engine find jobs on ATS

**Me:** I asked how the engine finds jobs. Does it search Greenhouse or Lever by company name, or crawl the company site to find the ATS link?

**AI:** It does neither. It only checks the exact URL I give it. If the URL (or its redirect) is on a known ATS and returns 404, the job is skipped. If it stays on a non-ATS page (LinkedIn Easy Apply, a custom startup page), the parser can't read it.

**My call / what I learned:** This made it click for me. Whether a job ends up "Skip" (confirmed dead) or "-1" (parse error) depends only on whether the URL lands on a supported ATS. That is why the -1 rule is needed. I had the AI add "LinkedIn Easy Apply and custom URLs fail to parse" to `CHANGE-BRIEF.md` as a predicted failure.

*Trace: commit `0863e49` (recipe, card, change brief, first version of this log).*

### 2026-10-03 20:38: Test fixture and prototype (step 5a)

**Me:** I asked for an offline test fixture (`fixture.json`) and a JavaScript prototype (`index.js`) that links my job list to the real CSV. I wanted to see three cases: a real company, a fake company (`no-matched`), and a non-ATS URL (-1).

**AI:** Wrote both, reading the course CSV `mapped_student_employment_targets_v3.csv`, and ran them through `role-scorer.mjs`:
1. `1LIFE HEALTHCARE INC`: in the CSV, sponsorship 0.8 `[record]`, Apply.
2. `Isaac Super Fake Tech LLC`: not in the CSV, sponsorship 0 `[no-matched]`, Apply at exactly 0.300.
3. `Non-ATS Startup`: bad URL, liveness -1, Skip.

The AI also noted that any gate value of 0 or less forces Skip, so my -1 shows in the audit trail but still lands in the Skip bucket.

**My call:** Accepted that -1 lands in Skip, because a person reading the audit can still see the -1 and check the URL by hand. I did not take "it works" at face value. I read the numbers, and that led to the next entry.

### 2026-10-03 20:58: The weights make sponsorship required

**Me:** Looking at the output, I saw the fake company got 0 for sponsorship, so it only reached the 0.3 Apply threshold because fit was a perfect 1.0 (weight 0.3). Real fit scores won't be perfect. With fit at 0.8 the total is 0.24 and the job fails. So the default weights (sponsorship 0.35, fit 0.3) make H-1B a requirement in practice, even though my recipe treats it as a bonus.

**AI:** Agreed with the math and wrote it into `CHANGE-BRIEF.md` (Prediction 6): sponsorship weight should go down, and fit and role quality should carry more.

**My call:** This one was my finding, not the AI's. The defaults suit someone who needs H-1B now, not my persona.

### 2026-10-03 21:07: Where do location and remote belong

**Me:** While the AI was writing the run log, it suggested putting location and remote work under the unused `role_quality` weight. I pushed back: `role_quality` sounds like a property of the job itself (AI resilience, type of work), while location is a personal preference.

**AI:** Agreed and changed the run log (`2026fa-tisaac-1.md`) so the missing 0.35 `role_quality` weight maps to objective things (O*NET AI resilience, BLS salary), with location and remote staying in fit.

**My call:** At this point I wanted fit and role quality kept separate. I changed my mind a few minutes later (next entry).

### 2026-10-03 21:11: Changing my mind on role_quality, and a failed edit

**Me:** Two things. First, I noticed the AI's script had not actually updated the run log file. Second, I thought about it again and decided location and remote **do** belong in `role_quality`, next to the objective metrics. For my persona, all of them together are what makes a role "good".

**AI:** Rewrote the run log text with a Python script, this time successfully, to: "comprehensive quality, combining objective metrics (like O*NET AI-resilience) with personal lifestyle preferences (Location and Remote models)".

**My call:** Final decision: location and remote are part of role quality. I checked that the file really changed this time, because the first edit had failed without anyone noticing.

### 2026-10-03 21:18: Predicting an LLM error in an offline test

**Me:** The AI explained that my "first pass prediction" in the change brief expected the LLM to misread EOE statements. I asked: the first run is offline with mocked data and no live LLM calls, so how could we ever see that error?

**AI:** Agreed it didn't fit, and suggested linking the two facts: we mock the `model-judgment` score at 1.0 offline **because** we expect that LLM risk. Changed the "First Pass Prediction" in `CHANGE-BRIEF.md` to say this.

**My call:** Accepted the new wording. The contradiction was mine to catch. The prediction is now about the recipe, and the mock is a choice we explain, not a test of that risk.

### 2026-10-03 21:22: Recipe language and grouping

**Me:** I pointed out that the recipe never actually grouped location, work type, and pay under `role_quality`, so it was unclear where they went.

**AI:** Also found that some earlier edits (location and work model) were left in Chinese by mistake. Rewrote the recipe fully in English and reorganized "Section 4: Votes" into the engine's three buckets (sponsorship, fit, role quality), with location, remote, salary, and AI resilience under role quality as I decided.

**My call:** Kept it. The recipe now matches the decision from 21:11 and the run log.

*Trace: commit `19c9384` (prototype, fixture, run log, recipe and brief updates); `1e30359` and `98a46a1` (SUBMISSION.md, SOURCES.md, final doc alignment).*

---

## Still open

- **The weights are only fixed on paper.** The run log still shows the scorer running with sponsorship 0.35, fit 0.3, role_quality 0, and "profile requires sponsorship". The 0.35 for role quality is written in the docs but not set in the prototype. The next step is to output role-quality values and override the weights locally, then re-run.
- **Liveness false negatives.** A brand-new posting that the ATS doesn't show yet would still close the gate. Keeping -1 separate from 404 helps, but doesn't solve it.
