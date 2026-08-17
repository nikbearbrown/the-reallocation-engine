# Data and Provenance

The Reallocation Engine is a verified-data system. Data provenance is not
background metadata; it is what keeps the engine from becoming fluent guessing.

## Source Data

Source data and upstream reference material live in `data/`.

Important source areas:

- `data/80-days-to-stay/`: upstream 80 Days to Stay sponsorship and company
  material.
- `data/bls/`: BLS/O*NET/OEWS role-quality source and compact extracts.
- `data/sec/form-d/raw/`: downloaded SEC quarter ZIP files.
- `data/sec/form-d/extracted/`: extracted SEC quarter TSV files.

Do not casually rewrite upstream source folders. If useful code or logic needs
to become maintained automation, copy or adapt it into `scripts/` and document
the provenance.

## Generated Data

Generated data can be regenerated from maintained scripts.

Important generated areas:

- `data/sec/form-d/processed/`: processed SEC quarterly JSON and audits.
- `data/ats/`: ATS scanner inputs, scan history, pipeline files, tracker files,
  liveness reports, and pattern reports.
- `*-audit.md`: audit reports written next to the data they inspect.

Generated output is evidence of a run, not automatically source truth. Treat it
as accepted only after verification or documented review.

## Privacy Boundary

`data/ats/` may reveal personal job-search activity, target companies, timing,
or application outcomes. Review before committing or sharing files such as:

- `data/ats/applications.md`;
- `data/ats/pipeline.md`;
- `data/ats/scan-history.tsv`;
- generated tracker or pattern reports.

Never store credentials, API keys, private contact details, or immigration
documents in tracked repo files.

## Claim Rules

Never invent:

- counts;
- rates;
- match quality;
- confidence;
- coverage;
- sponsorship status;
- role liveness;
- visa feasibility;
- compensation or labor-market claims.

When evidence is missing, say that it is missing. When evidence is stale, say
that it is stale. When evidence is partial, label the result as partial.

## Audit Checklist

Before using data in a chapter, recipe, or decision:

- Is the source path named?
- Is there an audit or generated report?
- Is the data date or collection window clear?
- Are missing fields marked instead of inferred?
- Is private ATS/job-search activity protected?
- Can the result be regenerated or reviewed from local files?
