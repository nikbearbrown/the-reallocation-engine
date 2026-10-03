# CHANGE-BRIEF — game-dev-h1b-soc-15-1252

- Student: Weiting Wang · GitHub `WeitingWang0704`
- Branch: `contrib/2026fa-WeitingWang0704-game-dev-h1b-soc-15-1252`
- Written: 2026-10-03, **before** any prototype code was written.
- Status of this file: predictions are kept as first written. Revisions are
  appended below under "Revisions", never edited in place.

## 1. The career situation

An international master's student in computer science who specialises in game
programming (Unity / real-time 3D) and is looking for a first full-time game
programmer role in the United States under F-1 OPT, needing an employer who
will later file an H-1B. The target occupation is **SOC 15-1252, Software
Developers** — the code games programmers are classified under, since BLS has
no separate games occupation.

The information asymmetry is specific to this industry and not shared with the
general "international student job search". Game studios are a sector where
visa sponsorship is rare, unevenly distributed, and invisible from the outside:
a studio's careers page looks identical whether it has sponsored thirty H-1Bs
or none. A student can spend a full day tailoring a portfolio and cover letter
for a studio that has never filed a petition. Worse, a studio that *has*
sponsored may have sponsored only for roles that are not this one — a
publisher that filed for financial analysts is not evidence that it will file
for a gameplay programmer.

### Engine layers used

- **80 Days to Stay** — sponsorship history and funding, via
  `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`.
- **The Cognitive Pivot** — SOC 15-1252 wage and ability rows, via
  `data/bls/compact/soc_occupation_compact.csv`.
- **Job-Ops** — liveness, via the existing `npm run ats:liveness`, used at a
  human gate rather than inside the scored pipeline (see §3).

## 2. What I reuse, and what I propose

### Reused, with exact paths (verified present in this clone, 2026-10-03)

| Path | Used for |
|---|---|
| `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` | sponsorship history, funding recency (30,369 rows) |
| `data/bls/compact/soc_occupation_compact.csv` | SOC 15-1252 row: wage and ability levels |
| `data/sec/form-d/processed/sample/*.sample.json` | Form D funding cross-check (4 quarters × 50 companies shipped) |
| `scripts/score/role-scorer.mjs` | the composite scorer — called as a CLI, **not** re-implemented |
| `scripts/ats/check-liveness.mjs` (`npm run ats:liveness`) | liveness, run by the human at Gate 2 |
| `search/examples/` | fictional personas; no real personal data enters this branch |

### Proposed additions

- `scripts/contrib/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252/` — the
  prototype: a games-sector pre-filter that turns a list of postings into a
  `roles.json` the existing scorer can read, with every evidence term carrying
  its source label.
- `recipes/cases/2026fa/WeitingWang0704-game-dev-h1b-soc-15-1252.md` + `.card.md`.

I propose **no new weight** for `role_quality` and no change to the scorer.
See §5, prediction 1, for why.

### Two repository constraints found before building

1. `package.json` is a protected path in `.github/workflows/contrib-gate.yml`
   (`contrib-scope` job). The prototype therefore cannot register an npm
   script and is documented as a plain `node scripts/contrib/...` command.
2. `CONTRIBUTING.md` says harnesses may import `role-scorer.mjs`'s exports
   (`CONFIG`, `SRC`, `applyProfile`, `scoreRole`). That file contains **no
   `export` statements** as of commit `015843d`. The documented import path
   does not exist, so the prototype uses the other sanctioned route — run the
   CLI and read `role-scores.json` back. This is recorded rather than worked
   around silently. [TODO: DEV] upstream could add the exports; not my call.

## 3. Gates, and what a human must see to clear each

**Gate 1 — sector claim.** The engine cannot tell you a company is a game
studio. The CSV's `industry` column has 24 values and none of them is games
(verified: `Other Technology` 10,909, `Other` 9,730, `Biotechnology` 1,911,
… no games label). The prototype therefore infers the sector from company
name and website keywords and labels that inference `model-judgment`. The
human must see the matched keyword and confirm or reject the studio before the
row proceeds. A false positive here ("Epic Systems" is a hospital software
company, not Epic Games) poisons everything downstream.

**Gate 2 — liveness.** A posting is scored only if its liveness has actually
been checked. The prototype does not call the network; it refuses to emit a
scored row for a posting whose liveness is unverified and lists it under
`blocked_at_gate`. The human runs `npm run ats:liveness -- <url>` and supplies
the result. What the human must see: the URL checked, the timestamp, and the
observed status.

**Gate 3 — timeline.** The OPT end date and the assumed hiring lag are both
`your-input`, never records. The human must see both numbers written out and
agree to them before the timeline factor is used, because this gate can zero a
role on an assumption alone.

## 4. Predicted failure cases and how each is checked

1. **Company absent from the CSV.** 30,369 rows is not the whole economy, and
   small studios will be missing. Expected behaviour: exit the row with
   `NOT_IN_RECORD`, emit no sponsorship number at all. Check: run the
   prototype on a posting for an invented studio name and confirm no
   sponsorship value appears anywhere in either output file.
2. **Company present but with no H-1B record.** Only **1,557 of 30,369 rows
   (5.1%)** carry a `Total Approvals` value; the other 94.9% have those columns
   empty. Expected behaviour: tier `unknown`, the probability labelled
   `model-judgment` and never `record`, and the report must say in words that
   an absent record is not evidence of non-sponsorship. Check: pick a row with
   an empty `Total Approvals` by hand, run it through, and read the label.
3. **Sponsored, but not for this kind of role.** A row may carry approvals
   whose `top_job_titles_sponsored` contains no engineering title. Expected
   behaviour: the mismatch is surfaced in the report rather than folded
   silently into the score. Check: find such a row in the CSV by hand and
   compare it to what the report says.
4. **OPT end date already in the past.** Expected behaviour: hard failure with
   a non-zero exit code and no output files, rather than a negative or clamped
   timeline factor. Check: run with a past date.
5. **SOC code with no row in the BLS CSV.** Expected behaviour: named error,
   no invented wage. Check: run with `--soc 99-9999`.

## 5. What I predict I will get wrong on the first pass

**Prediction 1.** The keyword classifier in Gate 1 will be the weakest part.
I expect it to both over-match (any company with "Interactive" or "Studio" in
its name) and under-match (studios whose legal entity name contains no game
word at all — a name like "Bungie Inc" is only recognisable if you already know
it). I predict a precision problem that no amount of tuning inside this
assignment fixes, and that the honest output is a flagged list for a human,
not a filter.

**Prediction 2.** I expect the first run to produce too *few* Skips. The
engine's own standard is that a healthy run skips at least half. If my
sponsorship-unknown default is set generously, almost everything will land in
Consider, which is a way of deciding nothing. I will check the skip rate the
scorer prints and treat a low one as a bug in my defaults, not a happy result.

**Prediction 3 (added for honesty about scope).** I expect that I will not be
able to verify the Form D join at the scale the recipe describes, because only
4 × 50 sample companies ship in a fresh clone. I expect the funding signal to
come from the CSV's own `latest_funding_date` column instead, with the Form D
samples used only to show the provenance of that column. If so, the recipe
must say so rather than implying a live Form D join.

## Revisions

*(appended after the first run — original text above is not edited)*
