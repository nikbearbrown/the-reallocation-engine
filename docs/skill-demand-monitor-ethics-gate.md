# Ethics Gate — skill-demand-monitor

Per SNICKERDOODLE Ch.16: if either check below fails, the run does not happen. Both
are shown passing here with real, pasted command output — not described.

## (a) Privacy

No file under `private/` (other than its own scaffold) or `data/ats/` (other
than its own `.gitignore`/`.example.` scaffolding) is git-tracked. Real, pasted
output, from this branch:

```
$ git ls-files | grep -E "^private/|^data/ats/"
data/ats/.gitignore
data/ats/portals.example.yml
private/.gitkeep
private/README.md
```

Only scaffolding is tracked — no real data.

`npm run doctor`'s automated privacy check, real output:

```
$ npm run doctor
...
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked
...
```

This is not a theoretical check — it caught a real leak during this
contribution's own development. Before this branch was cut,
`npm run doctor` on `main` reported:

```
PRIVACY (no personal data committed)
  ✗ 1 private/PII path(s) are git-tracked — REMOVE before pushing:
      search/resume.json
    fix: git rm --cached <file>; move it into private/; re-run npm run doctor
```

`search/resume.json`, `search/profile.yml`, and `search/gaps.md` were real,
filled-out personal data committed since an earlier assignment
(`f1df505`, 2026-06-27), predating this contribution. Fixed on `main`
directly (commit `97c3781`, not part of this contribution's diff): moved to
`private/search/` (gitignored) and added to `.gitignore`. `npm run doctor`
now reports clean, as shown above. The content still exists in that older
commit's history — removing it from history entirely is a separate, bigger
decision (rewrite + force-push across all branches) that was deliberately
deferred, not overlooked, and is disclosed here rather than hidden.

## (b) Honesty

Nothing this contribution generates misrepresents status or invents a metric.
Concretely, by design and verified in `skill-demand-monitor.test.mjs`:

- **A closed gate never gets papered over.** `insufficient_sample` and
  `role_filter_matched_nothing` both halt the run with **no** `skills` key in
  the JSON output at all — not an empty-looking table dressed up as a result.
  Verified by test case 1 (`assert.equal('skills' in result, false, ...)`).
- **Rejected records are counted, not dropped.** A posting missing a required
  field appears in `rejects[]` with a named reason; `total_postings_ingested`
  and `valid_count` never silently disagree with what actually happened.
  Verified by test case 3.
- **Low taxonomy coverage is flagged, not hidden.** `low_coverage: true` and a
  prominent Markdown warning fire whenever more than 40% of candidate postings
  match nothing — the tool does not present a thin, taxonomy-blind ranking as
  if it were comprehensive. Verified by test case 4.
- **No invented thresholds pretend to be verified statistics.** `min_sample`
  (20) and `coverage_floor` (40%) are both marked `[DEFINE]` in the script's
  own source comments — never presented as derived from a power calculation
  or an industry standard.
- **No priority/recommendation is fabricated.** The tool reports frequency and
  profile-evidence only. It never outputs a "learn this first" ranking — that
  would be a model-inference-shaped judgment call dressed as a fact. See
  `recipes/skill-demand-monitor.card.md`, failure mode 5.
- **A real bug found by a deliberate break attempt is disclosed, not hidden.**
  Overriding `--min-sample` down to 2 to force a ranking out of 2 real
  postings revealed the report once claimed "enough data to trust this
  ranking" unconditionally, and printed the mathematically false `pass (2 ≥
  20)`. Fixed, and written up plainly in `logs/RUN_LOG.md` rather than
  quietly patched with no record.

Both checks pass. This run may proceed.

---

**Attested by:** Aditi Bailur, 2026-08-16 — I reviewed the commands and output above against the real repository state myself; this is not a self-certification generated and accepted without a human reading it (SNICKERDOODLE P8).
