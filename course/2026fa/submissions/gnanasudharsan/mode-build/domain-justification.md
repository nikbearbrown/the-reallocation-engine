# Domain justification — AI-startup triage with funding and visa-timeline gates

## Executive summary

Why a student targeting AI startups needs an evidence check the engine lacks: a startup's money and an H-1B timeline running into late 2027 are invisible in a job posting, and local data only partly shows them. The mode built here makes funding runway a hard gate and says plainly when it cannot tell.

## Who and what situation

The fictional persona Ananya Rao: an F-1 student, pre-OPT, in an MS Computer Science (AI concentration) program ending December 2026, who will need H-1B sponsorship and is targeting AI Engineer roles at venture-funded startups. The cap timeline fixes two dates: petition filing from April 2027 and employment start on 2027-10-01. The employer must still exist on both.

## The asymmetry

A posting shows title, location and salary. It does not show runway or whether the last round will carry the company to October 2027. The startup knows; the student does not. The engine's scorer has no funding input, so a well-matched role at a startup that will not survive to the petition date scores as well as one at a startup that will.

## Layers used

- **80 Days to Stay** (mapped SEC + DOL/USCIS employer file): latest funding date and amount, H-1B approvals, approval rate, sponsored titles.
- **Job-Ops** (liveness checker and scorer): the liveness gate on supplied URLs, and the unchanged scorer for postings that pass every gate.
- **Cognitive Pivot** (BLS/O*NET occupation table): labeled context only; the scorer gives role quality a weight of zero.

## Failure mode (a): a stale funding snapshot read as current runway

- **Error shape:** the newest funding date in the data is September 2025. A company that raised in 2026 looks as if its money runs out in 2027; one that has since shut down looks funded. Both errors are silent: the number is real, just old.
- **Who struggles to catch it:** pre-OPT students, who have no access to cap tables, investor updates or paid funding databases, and who are least able to absorb an employer failing mid-petition.

## Failure mode (b): keyword and name false matches

- **Error shape:** a title filter matched "Enterprise Business Operations Manager - AI" (Vouch) and "Senior Research Engineer" at a membrane company (Membrion); a lookup for "Cohere" would land on Cohere Health, a healthcare company, not the AI model company. Each looks like a hit and is not.
- **Who struggles to catch it:** anyone filtering by title alone, because the false match reads exactly like a true one.
