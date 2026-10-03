# CHANGE-BRIEF — opt-countdown

## Executive summary

**What this is:** my plan and predictions, written *before* building anything, for a small recipe called
**opt-countdown**.

**Why read it:** it records what I expected to happen, so later I can compare what actually happened
against it honestly. The predictions below are kept as first written; corrections go in the
"Revisions" section at the bottom, never over the original.

**What it decides:** for a student on F-1 OPT who is already part-way through their allowed
unemployment days, opt-countdown answers one question per job: *can this hiring process finish
before the student's clock runs out?* It turns the student's real dates into a single "timeline"
number between 0 and 1, so jobs the calendar has already ruled out are skipped before the student
spends weeks on them.

---

## 1. The situation

| Field | Value | Label |
|---|---|---|
| Persona | Priya Nair, existing fictional persona, used **unchanged** | `search/examples/priya-nair/profile.yml` |
| Status | F-1 OPT, post-completion, year 1 | record (persona file) |
| OPT window | 2026-02-01 → 2027-01-31 | record (persona file) |
| Unemployment days used | 34 of 90 → 56 left | record (persona file) |
| Safety buffer she wants | 20 days | record (persona file) |
| STEM eligible | `true` in profile; **not ruled on by this recipe** (DSO question) | record (persona file) |
| Hiring time per job | **one fixed assumption: 8 weeks (56 days)** | your-input (my assumption) |

**Who this is for, in one line:** an international student on year-1 OPT who has already used about a
third of the 90 unemployment days, and needs to know which jobs can still finish hiring in time.

**Engine parts it draws on:**
- **The role scorer** (`scripts/score/role-scorer.mjs`): the timeline is one of its two gates.
- **Job-Ops** (`scripts/ats/check-liveness.mjs`): the other gate (is the posting real?).
- It does **not** use the 80 Days, SEC Form D, or BLS data directly. Sponsorship and fit values come
  from the input roles file as they are.

### Facts at the time of writing (date math, done 2026-10-02)

| | Date | Days from today |
|---|---|---|
| Today | 2026-10-02 | 0 |
| 36 usable days (56 left − 20 buffer) run out | 2026-11-07 | 36 |
| All 56 unemployment days run out | 2026-11-27 | 56 |
| 8 weeks of hiring from today | 2026-11-27 | 56 |
| OPT end date | 2027-01-31 | 121 |

These assume Priya is unemployed every day from today (see prediction P-C below).

---

## 2. What I'll reuse, and what I'm adding

### Reuse (all exist today)

| What | Path / command | Used for |
|---|---|---|
| Priya's profile | `search/examples/priya-nair/profile.yml` | dates, days used, buffer |
| Role scorer | `scripts/score/role-scorer.mjs` · `npm run score -- <roles.json> --out-dir <dir>` | combines votes and applies gates. **Not copied, not changed.** |
| Example roles (input shape) | `data/examples/ch11-roles.json` | the JSON shape my prototype writes |
| Liveness check | `scripts/ats/check-liveness.mjs` · `npm run ats:liveness -- <url>` | active / expired / uncertain |
| Timeline concept | `book/chapters/10-the-visa-timeline-manager.md` | what the factor means (0 = skip, ~1 = fine, between = penalized) |

### What's missing in the repo, and what I'm proposing

1. **Nothing computes the timeline factor.** The scorer only *reads* `timeline.factor` as a number
   someone typed in (`role-scorer.mjs:85`). The example file hard-codes `0.85`.
   → **Proposed:** a small script that computes the factor from Priya's dates + the hiring-time
   assumption, and writes it into a roles file for the scorer. `[TODO: DEV]`
2. **If the timeline is missing, the scorer quietly treats it as 1 (perfect).**
   (`role-scorer.mjs:85`: `num(role.timeline?.factor) ?? 1`.) A role with no timeline information
   silently passes the gate.
   → **Proposed:** my script must **stop with an error** instead of ever leaving the timeline blank.
   I am not editing the scorer.
3. **Chapter 10 gives no exact formula**, only examples (≈5-month process past the end → 0;
   ≈6 weeks → ≈1; ≈12 weeks → ≈0.6).
   → **The formula is a design decision I still have to make and justify.** `[TODO: DEFINE]`
4. **No dataset gives "how long hiring takes."**
   → I use one fixed assumption, 8 weeks, labeled `your-input`. A real source is future work.
   `[TODO: DATA SOURCE]`

---

## 3. Gates: where the recipe stops for a human

| Gate | When it triggers | What the human needs to see to clear it |
|---|---|---|
| **G-A: Confirm inputs** | Before anything runs | Priya's dates printed back (OPT end, days used, buffer, hiring assumption). The human confirms they match her real documents. A wrong date is the most dangerous error (Ch.10). |
| **G-B: Uncertain posting** | Liveness says `uncertain` | The job URL, and the reason the checker gave. The human opens the link and decides whether the job is real. |
| **G-C: Timeline = 0** | A job gets timeline factor 0 (Skip) | The dates that produced the 0 (today + hiring time vs. deadline). The human double-checks before dropping a job that looks strong otherwise. |
| **G-D: Visa / STEM question** | Anything depending on STEM eligibility or immigration rules | The recipe never decides these; it writes "ask the DSO" and stops. |

Note from setup: the liveness checker returned **`uncertain`, not `expired`**, for a job ID I made up
(`/jobs/0000000`). That's why G-B exists: "uncertain" goes to a human, never to an automatic pass or skip.

---

## 4. Predicted failure cases (and how I'll check each)

| # | What breaks | What the program should do | How I'll test it |
|---|---|---|---|
| F-1 | **Missing data:** Priya's profile is missing a date (e.g. `opt_end_date`) | Stop with a clear error naming the missing field. Never guess. | A test fixture profile with the field removed |
| F-2 | **Wrong dates:** OPT end date already in the past, or `unemployment_days_used` above 90 | Stop with a clear error | Fixtures with a past date and with `days_used: 95` |
| F-3 | **Dead link:** posting is expired / 404 | Liveness gate = 0 → Skip | A role whose liveness is `expired` (from a fixture, so the test stays offline) |
| F-4 | **No time frame:** hiring-time assumption not given | Stop with an error. **Never leave timeline blank**, because the scorer would treat it as 1 | A run with the assumption removed |

---

## 5. Predictions

- **P-A: what my first version will get wrong.**
  Every job gets the same 8-week hiring time, so every job gets the **same timeline number**. The
  timeline gate can't tell a fast startup from a slow big company. It only helps if Priya's
  situation changes, not to rank jobs against each other.
- **P-B: which deadline binds first.**
  I think Priya's **56 remaining unemployment days** matter more than her OPT end date.
  *(Written as a prediction before building. The date table above already suggests it: Nov 27 vs.
  Jan 31.)*
- **P-C (noted, not chosen as my main prediction):** the profile says "34 days used" but not
  *as of which date*, and the math assumes Priya stays unemployed every day from today.

---

## Revisions

*(Add dated entries here. Do not edit the sections above.)*

---

## Who did what

- **Me:** chose the situation (opt-countdown, Priya unchanged, no industry focus); chose the
  8-week fixed assumption; predicted the unemployment days bind first; named the failure areas
  (missing data, wrong dates, dead links, no time frame); picked all four gates and prediction P-A
  from options.
- **AI (Claude Code):** found Chapter 10 and the scorer's default-to-1 behavior by reading the code;
  computed the dates; offered the gate and P-A options I picked from; turned my answers into this
  document.
