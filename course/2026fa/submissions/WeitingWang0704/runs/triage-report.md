# Games-sector sponsorship triage — SOC 15-1252

Run 2026-10-03 · 6 scored · 4 blocked at a gate

> **Liveness provenance: 2 of 9 postings in this run were actually checked**
> with `npm run ats:liveness`; the other 7 carry synthetic values nobody observed.
> Of the 6 rows that reached the scorer, **0** had a checked liveness value.
> Checked rows show `liveness [record]` with a timestamp and an observed status in
> `triage.json`; unchecked rows show `[model-judgment]` and their decisions demonstrate
> the pipeline rather than advising about those companies.

## What is a record here and what is not

- Sponsorship counts, approval rates and funding dates below are **records** — read from
  `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv` without modification.
- Whether a company is a **game studio** is a **model-judgment**: a keyword match on the
  company name. The CSV has 24 industry labels and none of them is games.
- A company with **no H-1B row** is scored on a stated prior of
  0.35 (**model-judgment**). 94.9% of rows in the CSV are like this.
  An absent record is not evidence that a company does not sponsor.
- The **OPT date and the hiring lag** are **your-input**. They can close a gate on their own.

## Timeline gate (applies to every row)

`(120 - 75) / 75 = 0.600 → clamped to [0,1] = 0.600` → factor **0.6** [your-input]

120 days of runway against an assumed 75-day hiring cycle. gate open; both numbers above are assumptions, not records

## Decisions

| Company | Title | Composite | Decision | Sponsorship evidence | Next action |
|---|---|---|---|---|---|
| Manticore Games, Inc. | Gameplay Programmer | 0.333 | **Apply** | 10 approvals, rate 100.0% [record] | Tailor and apply — spend part of the 2 research-and-apply hours here. |
| That's No Moon Entertainment Inc | Associate Gameplay Engineer | 0.279 | **Consider** | 2 approvals, rate 100.0% [record] | Do not apply cold. Find one person and ask — this belongs to the 3 networking hours. |
| Peloton Interactive Inc | Software Engineer | 0.279 | **Consider** | 310 approvals, rate 97.5% [record] | Do not apply cold. Find one person and ask — this belongs to the 3 networking hours. |
| Roboto Games Inc | Gameplay Engineer | 0.261 | **Consider** | 4 approvals, rate 100.0% [record] · **no engineering title in past sponsorships** | Do not apply cold. Find one person and ask — this belongs to the 3 networking hours. |
| Azra Games Inc | Unity Engineer | 0.217 | **Consider** | no H-1B row — prior 0.35 [model-judgment] | Do not apply cold. Find one person and ask — this belongs to the 3 networking hours. |
| Manticore Games, Inc. | Senior Gameplay Programmer | 0.000 | **Skip** | 10 approvals, rate 100.0% [record] | Skip. Spend the hour on the credibility project instead. |

## Blocked at a gate — not scored

| Company | Title | Blocked at | Liveness | What you must do |
|---|---|---|---|---|
| Azra Games Inc | Tools Programmer | `GATE_2_LIVENESS` | never checked | run: npm run ats:liveness -- https://boards.greenhouse.io/example/jobs/1000006 and add the result to the liveness file |
| Lanternfish Studios Inc | Engine Programmer | `NOT_IN_RECORD` | 1 [model-judgment, synthetic] | this company is outside the dataset; research it by hand or drop it — do not assume either way |
| Insomniac Games | Engineering role (title not captured before the posting expired) | `NOT_IN_RECORD` | 0 [record] — expired — redirect to https://job-boards.greenhouse.io/insomniac?error=true | this company is outside the dataset; research it by hand or drop it — do not assume either way |
| Cat Daddy Games | Engineering role (title not captured before the posting expired) | `NOT_IN_RECORD` | 0 [record] — expired — redirect to https://job-boards.greenhouse.io/catdaddy?error=true | this company is outside the dataset; research it by hand or drop it — do not assume either way |

## Role-quality context (shown, not scored)

Software Developers · BLS 2024 median wage `133080.0` · employment `1654440.0` · cognitive-pivot score `3.834` [record]

role_quality carries weight 0.0 in scripts/score/role-scorer.mjs (tagged [VERIFY]). These numbers are shown to the human and are deliberately NOT passed to the scorer, because a vote with weight zero would look like evidence while contributing nothing.

## Stop condition

This report ends here. It does not apply, contact anyone, or rank you against other candidates.
A decision you cannot explain term by term is one to distrust before you distrust your confusion.
