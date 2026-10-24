# Sample protocol — real postings for the Early-2027 Java backend mode

## Executive summary

This document fixes, in advance, how the real job postings for this assignment are chosen. It
exists so nobody (student or AI) can pick postings because their results look interesting or
favorable. It was written and committed **before any job board was fetched**. It says which
employers are tried and in what order, which postings count, how many are taken, when collection
stops, and how duplicates and failures are handled. If the rule yields fewer than 12 usable
postings, the actual number is reported. The protocol is not changed after collection; any
deviation is recorded as a dated correction below the original text.

## Scope

- **Candidate:** the fictional persona Tariq Lindqvist (`search/examples/tariq-lindqvist/`). An
  experienced Java/Spring backend engineer: 54 months full-time, plus a separate 6-month co-op.
  Fictional availability date 2027-02-01.
- **Roles:** experienced-hire software, backend, platform, or infrastructure engineering roles,
  including applied-AI backend roles, whose posting text mentions Java. Internship, co-op,
  new-grad, and people-management roles are excluded from this primary cohort.
- **Geography:** United States (the persona is open to relocation; a stated assumption).
- **Target size:** 12 unique postings from 3 official employer boards, 4 per board.

## Source

Greenhouse's public Job Board API (`boards-api.greenhouse.io`). This is the host the repository's
maintained fetchers already allow-list. Only one ATS technology is used.

## Employer order (collection order)

1. Take every row of `data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv`
   whose `Total Approvals` is a number greater than 0.
2. Sort by `Total Approvals` descending; break ties by `company_name` ascending.
3. Normalize each name with Assignment 1's `companyKey` (casefold, non-alphanumerics to spaces,
   drop trailing legal suffixes). Keep only the first row per key.
4. Guess one Greenhouse slug per employer: the key with spaces removed. Only one guess is made, so
   "no board found" means "the guessed slug did not resolve", not "this employer does not use
   Greenhouse".

## Board probe and identity check

- For each employer in order: `GET https://boards-api.greenhouse.io/v1/boards/<slug>` (board
  metadata), with redirects refused, one request at a time, at least 250 ms apart.
- HTTP 404 → recorded as `no-board-at-guessed-slug`.
- HTTP 200 → the board counts as **this employer's official board** only if `companyKey(board
  name) == companyKey(CSV company_name)`. Otherwise it is recorded as `board-name-mismatch` and
  excluded (identity unverified).
- Any other status, timeout, or error → recorded as `probe-failed` and excluded. There is no retry.

## Capture

For each verified board: one capture with the maintained greenhouse-watch fetcher
(`.claude/skills/greenhouse-watch/scripts/greenhouse_watch.py`, full content, host allow-listed,
raw response saved untouched). Its output goes to `private/a2/capture/<slug>/`, which is
gitignored. Raw responses are never committed.

## Cohort rule (applied to each captured board)

Applied to the plain text of each posting, after decoding HTML entities and removing tags:

- **Title includes:** the word `engineer`, **and** one of `software`, `backend`, `back-end`,
  `back end`, `platform`, `infrastructure`, `distributed`, `server`, `api`, `java`, `systems`.
- **Title excludes:** `intern`, `internship`, `co-op`/`coop`, `apprentice`, `new grad`, `graduate`,
  `university`, `early career`, `manager`, `director`, `head of`, `vp`, `vice president`.
- **US location:** the location name contains `United States`, `USA`, `U.S.`, or `US` as a word,
  a US state or DC postal code after a comma, or a US state's full name. A multi-location string
  qualifies if any part is in the US.
- **Java mention:** the text matches `java` as a word not followed by `script`, or `JVM`, or
  `Spring Boot`.

*Disclosed consequence:* because Java mention is part of the cohort rule, a Java hit in the
stack check is partly produced by selection. The stack check still records where Java appears
(required, preferred, or responsibilities) and the other term groups.

## Ordering, duplicates, and stopping

- Cohort postings on a board are ordered by `first_published` **newest first**, ties broken by
  job id ascending (the order a candidate browsing the newest postings would see).
- **Duplicates:** the same job id counts once. Two postings with the same normalized title **and**
  the same SHA-256 of normalized description text are duplicates (typically per-location copies).
  The first in order is kept; the others are recorded as duplicates and do not count.
- A board **qualifies** if it has at least 4 unique cohort postings. The first 4 in order are taken.
  A board with 1–3 is recorded as `insufficient-cohort` and excluded, so per-board shares stay
  equal.
- **Stop** after 3 qualifying boards, or after probing 400 employers, whichever comes first. If
  fewer than 3 boards qualify, the actual number of postings is reported as the sample.

## Per-posting liveness observation

Each selected posting gets two time-stamped observations: (1) it was present in the board API
response at capture time; (2) `npm run ats:liveness -- <absolute_url>` (the maintained Playwright
checker), run once. If the two disagree, the case goes to human review. Both are point-in-time
observations.

## What is committed

For each selected posting: employer, title, job id, URL, capture timestamp, board `updated_at`,
SHA-256 of the full plain text, and only the **sentences the mode's rules read** (requirements,
experience, degree, graduation, timing, sponsorship and work-authorization wording, stack terms),
each with its section heading. The extraction filter is the union of the rules' own patterns, so
re-running the mode on the committed excerpts must give the same result as running it on the
full private text. That equivalence is checked and reported, not assumed. No full pages,
recruiter names or contacts, cookies, or account data.

## Record

- Protocol written 2026-10-21 (Eastern), before any board fetch. Committed in the first
  Assignment 2 commit on branch `contrib/2026fa-aditya-raj-sde-java-backend-early2027`.
- Corrections, if any, are appended below with date and reason. The text above is never edited.

## Corrections

*(none yet)*
