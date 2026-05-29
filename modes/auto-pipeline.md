# Mode: auto-pipeline -- Not Yet Automated

Current status: not implemented as a single command.

The Reallocation Engine currently works as a sequence of verified steps, not a
fully automatic apply pipeline.

## Use This Sequence Instead

1. `modes/scan.md` -- detect ATS/provider/job URLs.
2. `modes/pipeline.md` -- verify URL liveness and move URLs through triage.
3. `modes/oferta.md` -- evaluate one role using company, sponsorship, ATS,
   liveness, BLS/SOC, and CV evidence.
4. `modes/pdf.md` -- generate an ATS-friendly PDF from an approved Markdown CV.
5. `modes/tracker.md` -- record status changes and outcomes.

## Future Script Contract

A real auto-pipeline should live under `SCRIPTS/ats/` or `SCRIPTS/pipeline/`
and should emit:

- structured JSON status;
- updated `data/ats/pipeline.md`;
- optional report under `data/ats/reports/`;
- a log entry in `modes/RUN_LOG.md`.

Until that script exists, do not describe this mode as automatic.
