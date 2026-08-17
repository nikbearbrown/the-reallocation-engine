# Student Profile Template

## Executive Summary

This optional profile is local student context for agents and humans. Agents may
use it to personalize role evaluation, application drafting, and PDF generation.
Humans should treat it as private working context, not verified company or labor
market data.

This optional file is for student-specific context. It is not source data and
should not contain secrets, private phone numbers, or real emails unless the
student intentionally keeps the file private.

## Rules

- Do not use this file to override verified data from `data/` or audits.
- Do not invent profile evidence to fill gaps.
- Do not store secrets, real phone numbers, or real emails unless the student
  explicitly keeps the file private.
- If profile facts are used in a recipe output, cite the relevant profile row or
  CV evidence.
- If a profile-driven workflow creates reusable output, log it in
  `logs/RUN_LOG.md`.

## Phase Gates

1. **Privacy gate:** Confirm the file is private before adding sensitive
   student details.
2. **Evidence gate:** Use only student-approved evidence.
3. **Local data gate:** Do not let profile preferences override verified
   company, sponsorship, labor-market, or tracker evidence.
4. **Output gate:** Cite profile or CV evidence when it affects a recipe output.
5. **Logging gate:** Log reusable profile-driven outputs, not private details.

## Target Roles

| Target role | Why this role | Evidence already present | Evidence gap |
|---|---|---|---|
| Software Engineer | ... | resumes/first-last-cv.md | ... |

## Verified Evidence

List only evidence the student can point to:

- projects;
- coursework;
- internships;
- jobs;
- publications;
- public repos;
- certifications;
- portfolios.

## Constraints

- location:
- remote/hybrid/onsite:
- work authorization notes:
- compensation range, if the student wants to track it:

## Notes

Use this file to personalize `recipes/oferta.md`, `recipes/apply.md`, and
`recipes/pdf.md`. Do not use it to override verified data from `data/` or audits.
