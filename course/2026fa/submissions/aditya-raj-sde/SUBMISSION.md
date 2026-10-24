# SUBMISSION

Assignment: The Reallocation Engine — Recipe Design Assignment
Student: Aditya Raj
GitHub handle: aditya-raj-sde
Domain / situation: An engineering candidate who will need future employer sponsorship, screening January 2027 openings (backend/platform first). Sponsorship evidence (company history vs. this opening) plus posting liveness. Public runs use the fictional persona Aarav Patel.
Recipe path: recipes/cases/2026fa/aditya-raj-sde-sponsor-live-jan2027.md (+ .card.md)
Prototype command: node scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.mjs --input scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/fixtures/sample-run.json --out-dir course/2026fa/submissions/aditya-raj-sde/runs/sample
Test command: node --test scripts/contrib/2026fa/aditya-raj-sde-sponsor-live-jan2027/reality-check.test.mjs
GitHub repository / branch / PR URL: https://github.com/aditya-raj-sde/the-reallocation-engine · contrib/2026fa-aditya-raj-sde-sponsor-live-jan2027 · PR URL: see the root SUBMISSION.md in the Canvas ZIP
Submitted commit SHA: recorded in the root SUBMISSION.md of the Canvas ZIP and in Canvas (a commit cannot contain its own hash)
Lifecycle stage claimed: RUNNABLE-SAMPLE (recipe v0.4.0; attestation by Aditya Raj, 2026-10-03, in WORKED-RUN.md)
Summary of my changes: Recipe + card (RUNNABLE-SAMPLE), prototype (reality-check.mjs), hypothesis probe, 18 offline tests (shown to catch a deliberately broken refusal gate), fixtures, README, sample run (JSON + Markdown), worked run, domain justification, test report, Frictional log, sources, evidence 00–44, run-log entry. All in assigned namespaces; no maintained file patched.
Known limitations: Cannot establish that any opening will be sponsored. Sponsorship counts have unspecified time coverage and no job codes. Liveness is point-in-time. Wording rules miss paraphrases. Timing and fit are labeled sample inputs. 8 of 9 sample postings are synthetic. Two upstream CI jobs fail for pre-existing reasons (see TEST-REPORT.md, "Confirmed blocker 1" and "Confirmed blocker 2").
