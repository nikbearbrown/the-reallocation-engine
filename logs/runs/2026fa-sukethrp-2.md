# 2026fa-sukethrp-2 — reviewed inputs and third run

## Executive summary

Reading the eight employer postings revealed experience requirements and missing start dates hidden by the earlier title-only inputs. Codex withdrew unsupported scorer inputs, preserved the original queue, and ran the revised queue. All eight roles are held. Tests and the sample still pass. Student decisions and attestation remain open.

**Update, 2026-10-02.** The record below is Codex's, as of 2026-09-30. Since then the student has done the
following (see the follow-up at the end):
- decided G8 for all eight roles (held, Scale AI investigated first);
- kept the title rules;
- reported reading the audits, which made the recipe RUNNABLE-SAMPLE;
- re-ran four checks themselves and signed the attestation.

## Run record

- Date: 2026-09-30 UTC / 2026-09-29 Eastern. Operator: Codex (AI).
- Starting commit: `49eee0e`, later amended to `0754031` before any push: two lines in SOURCES.md and FRICTIONAL.md were reworded so that they no longer state personal details about the student. Recipe v0.1.0, rules v0.2.0, unchanged.
- Inputs: Codex edited `worked-run/queue-live-1.json` in place for this run. Claude Code then restored that file, which runs 1–2 read (sha256 `38a030669592…`), and moved the reviewed inputs unchanged to `worked-run/queue-live-3-reviewed.json` (sha256 `76207422f40e…`). Claude re-ran run 3 from that path with network access forbidden: same result (`worked-run/terminal-live-3.txt`).
- Source: pinned CSV SHA-256 `eccdee2addf472b1639269f42eec693b083b7ce251347d5fd0b2856cfdae6270`.
- Outputs: `course/2026fa/submissions/sukethrp/runs/worked-run-3-reviewed/` and `evidence/codex-review-2026-09-30/`.
- Result: evaluated 8, held 8 (four no timeline, one shared record, three no company match), scored 0, RESOLVE 8.
- Mode: `--live`; no network liveness request or scoring occurred, because earlier gates held every role.
- Audits read by Codex: original sample report, v0.2.0 title-rules audit; reading by Suketh not recorded.
- G1/G2: passed. G7: not exercised because no role reached the scorer. G8: open.
- Other checks: 36 tests OK, offline sample matches, fresh title audit, deliberate wrong source hash stops with exit 2, AppLovin CSV values match run 2.
- Authorship: numeric fit suggestions are AI judgments held in review metadata, not scorer inputs. Reflection is explicitly an AI review draft. Personal experiences and signatures are not fabricated. *(That reflection draft was later moved out of the repository. The reflection now in `WORKED-RUN.md` is the student's own, written 2026-10-02.)*
- Artifacts updated: worked run, test report, change brief append-only revision, sources, factual Frictional follow-up, README, posting review and presentation preparation.
- Lifecycle: SPECIFIED; no human audit clearance or attestation is claimed. Maintained engine code and title rules were not changed.

## Follow-up, 2026-10-02 (recorded by Claude Code)

- **G8 decided by the student** for this run's eight held roles: “Keep all eight postings held because the available evidence does not support defensible fit and timeline numbers; investigate Scale AI first because its graduation cohort matches, while qualifications, sponsorship, and start date remain unconfirmed.” The student's words are in the
  decision table in `course/2026fa/submissions/sukethrp/WORKED-RUN.md`.
- **Title rules v0.2.0 kept by the student**, recorded in `SOURCES.md`. `rules.json` is unchanged, so the rules
  hash recorded by this run still matches the file.
- **Audits:** the student reported reading the sample report, the rules audit and the posting review. The
  recipe is RUNNABLE-SAMPLE (`logs/runs/2026fa-sukethrp-1.md`).
- **Re-run and attestation:** the student re-ran the tests, the sample, the authorization break and CSV line
  1956, and signed the attestation in `WORKED-RUN.md`.
