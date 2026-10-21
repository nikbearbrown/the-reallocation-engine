# Five-minute show and tell: notes

## Executive summary

An outline for the five minutes in class. There are no slides: just the mode file, the report and the terminal.
It covers the four things the brief asks for, with one thing to show for each. These are
notes, not a script to read aloud.

## The five minutes

1. **The situation (45 s).** An international student on OPT, Boston, wants data analyst jobs and
   needs H-1B sponsorship: 49 unemployment days left. Show the report's executive summary
   (`runs/run-b-final/analyst-check-report.md`).
2. **The asymmetry (60 s).** "Data Analyst" has no occupation code, so a sponsor list says a company
   sponsored *someone*, not an analyst. Show the G4 section: the title guesses, then the same check by
   occupation code from DOL's own filings.
3. **A real run (90 s).** Run it live (about 15 s, opens 3 postings):
   `node scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/analyst_check.mjs --today <today> --formd-dir data/sec/form-d/processed --lca scripts/contrib/2026fa/riyask29-data-analyst-sponsor-boston/data/lca-ma-analyst-fy2026q3.csv --out-dir /tmp/demo`.
   Point at the next-action column: tailor 2, network 1, skip 1, a person checks 2.
4. **What I learned from running it (60 s).** Pick one:
   - Benefits Science is "Proven" in the sponsor list but has **zero** analyst LCAs in Massachusetts
     this year. The label was old history.
   - The posting checker said EverQuote's live job was "uncertain" because the form sits in an iframe.
     Show `runs/engine-05-liveness-upstream.txt` against `runs/05b-liveness-this-branch.txt`.
5. **One honest limitation (45 s).** It cannot tell whether a company will sponsor *this* student.
   An LCA is not an approval, names must match exactly, and hiring lag is still the student's guess
   (TODO 4). That is why it stays a DRAFT.

## If asked

- *Why DRAFT?* Two typed TODOs are still open: hiring-lag evidence (no data source exists, so I kept it open
  rather than descoping it) and an engine bug this run found. SPECIFIED needs zero.
- *Why not edit `logs/RUN_LOG.md`?* CI rejects it for students; the entry is in `logs/runs/`.
- *Why exact names only?* "Abacus" in Form D matches 12 unrelated funds, one with a $94M raise.
