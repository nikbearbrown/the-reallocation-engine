Assignment: The Reallocation Engine — Recipe Design Assignment
Student: Isaac Tai
GitHub handle: tisaac
Domain / situation: F-1 STEM Information Systems student targeting SWE / software development / DevOps / test roles, with a 3-year STEM OPT runway, so H-1B sponsorship history is a bonus vote, not a requirement. Saves the per-company sponsorship lookup in the "2 hours applying" part of the 3-3-2 day (about 50 minutes a week, my own estimate).
Recipe path: recipes/cases/2026fa/tisaac-swe-stem-opt.md (card: recipes/cases/2026fa/tisaac-swe-stem-opt.card.md)
Prototype command: node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.js
Offline test command: node scripts/contrib/2026fa/tisaac-swe-stem-opt/index.test.mjs
GitHub repository / branch / PR URL: IsaacTai13/the-reallocation-engine / contrib/2026fa-tisaac-swe-stem-opt / https://github.com/nikbearbrown/the-reallocation-engine/pull/46
Submitted commit SHA: the PR head at submission time (the Canvas ZIP is built from that same commit); code and docs tested from a clean clone at 4a23461 (see TEST-REPORT.md)
Lifecycle stage claimed: DRAFT (6 typed TODOs open)
Summary of my changes: Recipe and card for the STEM-OPT persona. The prototype looks up each company in the 80-days CSV, labels every value record / model-judgment / your-input (a company missing from the CSV is your-input with tier no-matched), skips non-ATS URLs as a -1 liveness gate, and hands the result to the existing role-scorer.mjs. Offline test with 9 checks. Revised after grading: stage set to DRAFT, offline test added, labels made honest (offline liveness and self-entered fit are your-input), gates set to liveness + visa timeline, and DOMAIN-JUSTIFICATION.md, WORKED-RUN.md, TEST-REPORT.md added.
Known limitations: Runs offline only. It does not open job URLs (liveness is an assumption until a person runs npm run ats:liveness), does not read job descriptions (the international-student-ban and excluded-title gates are checked by a person), and does not score role quality (the scorer weight is 0). Fit is the student's own number, and in the sample run an invented company reached Apply on fit alone. Skip rate 33%.
