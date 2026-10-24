# SUBMISSION — Assignment 2 (Mode Build)

## Executive summary

This is the submission manifest for the second Reallocation Engine assignment. It says what is
being submitted, where each piece lives, which commands reproduce it, what status is claimed, and
how the Canvas ZIP is built from the exact submitted commit. Fields that can only be known at
publication (the final commit SHA and the PR URL) are filled in at that moment, not guessed.

## Manifest

- **Assignment:** The Reallocation Engine — Mode Build Assignment
- **Student:** Aditya Raj · GitHub handle: `aditya-raj-sde`
- **Domain / situation:** an experienced Java/Spring backend engineer (international master's
  student; work authorization applied for, not approved; future sponsorship needed) screening US
  openings for an early-2027 start. Public runs use the fictional persona Tariq Lindqvist:
  50–54 months full-time at month precision, a separate 4–6-month co-op, availability 2027-02-01.
- **Mode file:** `recipes/cases/2026fa/aditya-raj-sde-java-backend-early2027.md` (+ `.card.md`),
  recipe v0.4.1, rules v0.4.1 (feature scope frozen).
- **Run command (offline):**
  `node scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.mjs run --input course/2026fa/submissions/aditya-raj-sde/assignment-2/real-sample/observations.json --candidate scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/config/candidate.tariq-lindqvist.json --out-dir "$TMPDIR/replay"`
- **Test command:**
  `node --test scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/triage.test.mjs scripts/contrib/2026fa/aditya-raj-sde-java-backend-early2027/regression-v04.test.mjs`
- **Branch:** `contrib/2026fa-aditya-raj-sde-java-backend-early2027` · **PR URL:** https://github.com/nikbearbrown/the-reallocation-engine/pull/75 (replaces #45, closed 2026-10-21 with a cross-link)
- **Submitted commit SHA:** the PR head at submission, given in Canvas and written by git as the ZIP's
  archive comment (a commit cannot contain its own hash)
- **ZIP:** `~/Desktop/reallocation-aditya-raj-sde-mode.zip`
- **Lifecycle stage claimed:** RUNNABLE-SAMPLE (2026-10-21; recipe "Lifecycle evidence"). RUNNABLE-LIVE is not sought.
- **Inherited vs new:** Assignment 1 (graded commit `1a618e7`) is the unchanged base. Assignment 2
  adds only the files listed in `PR-DESCRIPTION.md`.
- **Deferred, not built:** application-question capture; the shared liveness-core 403 patch.
- **Human actions:** mandatory — Aditya's report-adequacy judgment and attestation signature (done 2026-10-21), the
  Canvas upload, the in-class presentation. Optional and not performed — Aditya's personal re-runs
  and the live cross-check (Claude performed the cross-check: evidence 29, 34).
- **Known limitations:**
  - The rules detected no sponsorship or start-date wording in any of the 18 captured posting
    bodies; application forms were not inspected.
  - The rules were corrected on the 12 development postings.
  - The first unseen-posting result (40/48 checks, 4/6 final steps) is agreement with
    Claude-reviewed expectations, not measured accuracy. The repaired rerun (47/48, 6/6) is
    development evidence.
  - Same three Greenhouse boards only.
  - The page checker reports a 403 challenge as expired; this mode treats it as unknown.
  - The date check is not an authorization check.
  - Run the tests from a checkout **outside** the system temp directory. Inside it, the output-guard
    test fails by construction (76/77); outside, 77/77 (FRICTIONAL E33).

## ZIP-building procedure (verified as a dry run on `6488aab`, 2026-10-21)

Run from `/Users/adityaraj/Desktop/the-reallocation-engine-a2` **after** the final commit:

```bash
SHA=$(git rev-parse HEAD); ZIP=~/Desktop/reallocation-aditya-raj-sde-mode.zip
test -e "$ZIP" && { echo "ZIP already exists — not overwriting"; } || \
  git archive --format=zip --prefix=reallocation-aditya-raj-sde-mode/ -o "$ZIP" "$SHA"
unzip -z "$ZIP" | tail -1                       # must print $SHA (git writes the commit id as the archive comment)
unzip -l "$ZIP" | grep ' reallocation-aditya-raj-sde-mode/private/'   # expect only private/, .gitkeep, README.md
# add the Canvas note (SHA + PR URL) at the archive root — not part of the commit, like Assignment 1's root SUBMISSION.md
T=$(mktemp -d) && mkdir -p "$T/reallocation-aditya-raj-sde-mode" && \
  printf 'commit %s\nPR <url>\n' "$SHA" > "$T/reallocation-aditya-raj-sde-mode/CANVAS-SUBMISSION.md" && \
  (cd "$T" && zip -q "$ZIP" reallocation-aditya-raj-sde-mode/CANVAS-SUBMISSION.md)
unzip -z "$ZIP" | tail -1                       # still $SHA
```

Dry-run observations:
- the archive comment equals the SHA;
- 1,200 files, 16 MB;
- all deliverables present;
- `private/` holds only the README and `.gitkeep`;
- appending the root note keeps the comment;
- the extracted tree's `pii-scan` shows only the inherited `package-lock.json` finding.

The Assignment 1 ZIP (`~/Desktop/reallocation-aditya-raj-sde-recipe.zip`) is never touched.
