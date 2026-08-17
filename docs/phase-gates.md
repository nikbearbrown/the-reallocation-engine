# Phase Gates

Automation expands only after explicit gates pass. A gate without a failure path
is not a gate.

## Standard Gates

1. Problem gate: the task, scope, and success condition are explicit.
2. Local evidence gate: relevant data, audits, docs, and recipes have been
   checked.
3. Stored script gate: maintained scripts have been checked before ad hoc code.
4. Small-run gate: the smallest useful sample has passed.
5. Verification gate: outputs have been checked against source evidence or an
   output contract.
6. Review gate: human review exists for risky, ambiguous, or high-impact
   results.
7. Recovery gate: rollback or correction is documented for write operations.
8. Logging gate: meaningful runs are recorded in `logs/RUN_LOG.md` or a
   nearby audit/report.

## Failure Paths

- If the problem is unclear, stop and restate it.
- If local evidence is missing, label it missing.
- If no stored script exists, document that before inventing automation.
- If the sample fails, do not scale the run.
- If verification is inconclusive, keep the result provisional.
- If review is required, do not present output as final.
- If privacy risk is present, review before commit or sharing.

## High-Risk Work

Use stricter gates for:

- job application decisions;
- visa or sponsorship interpretation;
- resume, cover letter, or outreach generation;
- tracker updates;
- batch scans or batch applications;
- publishing, deletion, commits, or data refreshes;
- legal, immigration, financial, HR, or regulatory claims.

High-risk work needs a human review point and an audit trail.
