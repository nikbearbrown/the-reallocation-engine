# Verified-Data Attestation — Gate-Behavior Harness

**Component:** `scripts/score/gate-harness.mjs` (+ `scripts/score/fixtures/gate-cases.json`, `recipes/gate-harness.md`, `recipes/gate-harness.card.md`)
**Contributor:** Saloni Angre
**Date of run:** 2026-08-11
**Chapters:** 11 (Bayesian Role Scorer), 16 (The Build and the Honest Run)

---

## 1. The verified-vs-inferred boundary

Every field and number this component emits, classified. The component emits
nothing that is a model inference — it is a test harness, and a test harness
that guessed would be worthless.

### Values read from the scorer (script-output)

These are read verbatim out of `role-scores.json`, which
`scripts/score/role-scorer.mjs` writes. The harness does not compute them and
does not adjust them.

| Field | Kind | Traces to |
|---|---|---|
| `composite` | script-output | `role-scorer.mjs` → `scoreRole()` → `role-scores.json:roles[].composite` |
| `recommendation` | script-output | same, `.recommendation` |
| `machine_recommendation` | script-output | same, `.machine_recommendation` |
| `reason` | script-output | same, `.reason` |
| `trace.vote_sum` | script-output | same, `.trace.vote_sum` |
| `trace.gate_product` | script-output | same, `.trace.gate_product` |
| `trace.votes[].source` | script-output | same, `.trace.votes[].source` (itself one of record / model-judgment / your-input, assigned by the scorer) |
| `trace.gates[].multiplier` | script-output | same, `.trace.gates[].multiplier` |
| observed `config.*` (6 values) | script-output | `role-scores.json:config` — the scorer's own CONFIG block |

### Values declared in the fixture file (your-input)

Hand-written test vectors. Not records. Every expected value carries its
derivation in that case's `why` field, so a reader can re-derive it from the
scorer's documented formula rather than trusting the number.

| Field | Kind | Traces to |
|---|---|---|
| `role.sponsorship.p`, `.tier` | your-input | `gate-cases.json:cases[].role` — synthetic |
| `role.fit.p` | your-input | same — synthetic |
| `role.role_quality.p` | your-input | same — synthetic |
| `role.liveness.factor` | your-input | same — synthetic |
| `role.timeline.factor` | your-input | same — synthetic |
| `expect.composite` | your-input | `gate-cases.json:cases[].expect` — hand-derived, derivation in `.why` |
| `expect.recommendation` | your-input | same |
| `_config_assumed.*` | your-input | `gate-cases.json:_config_assumed` — the CONFIG the expectations were derived against |

### Values computed by the harness (script-output, this component)

| Field | Kind | How computed |
|---|---|---|
| per-check `pass` booleans | script-output | `gate-harness.mjs:checkCase()` — equality/tolerance comparison of the two columns above |
| `arithmetic-identity` result | script-output | `structuralChecks()` — `abs(composite − vote_sum × gate_product) <= 1e-3`, both operands read from the scorer's own trace |
| `trace-source-labels` result | script-output | `structuralChecks()` — presence check on `.source` for every vote and gate |
| `both-gates-present` result | script-output | `structuralChecks()` — key check for `liveness` and `timeline` |
| `config_drift[]` | script-output | `configDrift()` — observed CONFIG vs. `_config_assumed` |
| baseline passed/failed counts | script-output | tally over the per-case results |
| `negative_control.caught[] / .missed[]` | script-output | per-case comparison of baseline result vs. mutant result |
| `result` (PASS/FAIL) | script-output | conjunction of the above |

### Not present

| Kind | Status |
|---|---|
| record | **none** — this component reads no dataset, no CSV, no API. It reads a scorer and a fixture file. |
| local-evidence | **none** |
| external-source | **none** — no network access at any point |
| model-inference | **none** — no LLM is called, and no value is a judgment |
| missing | the harness has no access to real posting data, real sponsorship records, or real visa timelines, and does not claim any |

---

## 2. Every number traces

The figures reported in the 2026-08-11 run, each with its origin:

| Figure | Value | Script | Traces to |
|---|---|---|---|
| fixture cases loaded | 10 | `gate-harness.mjs` | count of `gate-cases.json:cases[]` |
| config values compared | 6 | `gate-harness.mjs:configDrift()` | `role-scores.json:config` vs. `gate-cases.json:_config_assumed` |
| baseline cases passed | 10 of 10 | `gate-harness.mjs` | per-case comparison, printed per case |
| structural checks passed | 3 of 3 | `gate-harness.mjs:structuralChecks()` | scorer's own `trace` block |
| arithmetic identity holds | 10 of 10 | `gate-harness.mjs` | `composite` vs `vote_sum × gate_product`, both from `role-scores.json` |
| negative control caught | 5 of 5 gate-sensitive | `gate-harness.mjs` | baseline result vs. mutant result per case |
| mutation patterns matched | 2 of 2 | `gate-harness.mjs:buildMutant()` | literal string match against `role-scorer.mjs` source |
| skip rate (plausibility run) | 60% (6 of 10) | `role-scorer.mjs` | `output/gate-harness/role-scores.md` summary line |
| conformance files checked | 135 | `scripts/conformance.mjs` | `npm run verify` output |
| recipes tracked | 44 | `scripts/doctor.mjs` | `npm run doctor` output |
| declared vs. body TODOs | 517 = 517 | `scripts/doctor.mjs` | `npm run doctor` output |

No figure in this list was typed by hand into a report. Each is printed by a
named script and reproducible by re-running it.

---

## 3. The ethics gate

### (a) Privacy — and a gate that actually fired

This is not a gate that was green on the first look. It caught something real,
and the run stopped until it was fixed.

**Before:**

```
PRIVACY (no personal data committed)
  ✗ 1 private/PII path(s) are git-tracked — REMOVE before pushing:
      search/resume.json
    fix: git rm --cached <file>; move it into private/; re-run npm run doctor
```

The flagged file was a personal résumé record containing real contact
information, committed during earlier coursework with an explicit
`git add -f` that overrode the repository's own gitignore protection. The commit
message on record says so plainly: *"force past gitignore privacy rule."*

No capstone work was committed while that file was tracked. It was untracked and
relocated first:

```bash
git rm --cached search/resume.json
mv search/resume.json private/resume.json
```

**After:**

```
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked
```

Two honest notes rather than a clean claim:

1. The file remains reachable in **git history**, and in a pull request already
   opened against the upstream repository. Untracking the file does not remove
   it from either. That exposure is disclosed here rather than described as
   resolved, because it is not.
2. The privacy gate checks the **working tree and index**, not history. It did
   exactly what it was built to do. The limitation is in what the gate's scope
   can be, not in whether it worked.

`npm run doctor` is clean at the point of the capstone commit. No `data/ats/`
content is staged. No PII appears in any file added by this contribution.

### (b) Honesty — nothing this component generates misrepresents status

- Every emitted number is `script-output` or `your-input` and is labelled as such
  in the JSON artifact's `_value_kinds` block.
- The fixture file's `_provenance` field states in the artifact itself that the
  vectors are synthetic: *"No number here is a claim about any real company,
  posting, or person."*
- The harness reports a `WARN` it could have suppressed: `role_quality` is inert
  at weight 0.0, so the Chapter 9 signal contributes nothing to the composite.
  That is expected given the current config and is recorded in `DOMAIN.md` gap 3
  as an open authorial decision — so it is reported as a finding, not failed as a
  defect, and not hidden.
- The harness refuses to report a pass it has not earned: if the mutation
  patterns stop matching the scorer's source, it reports `mutation-drift` and
  treats the run as inconclusive rather than green.
- Both `recipes/gate-harness.md` and `recipes/gate-harness.card.md` ship with
  `status: DRAFT` and `attestation: null`. The component does not promote itself.

### Conformance evidence

```
> node scripts/conformance.mjs && node scripts/manifest-check.mjs
conformance: 135 files (77 md · 30 py · 24 js · 1 sh · 2 json · 1 yaml)
✓ all conform (machine half of P4). Adequacy is still the human gate.
✓ manifest check passed (4 warnings)
VERIFY EXIT: 0
```

```
RUNNABLE COMMANDS (npm script → target file present?)
  ✓ score:gates    scripts/score/gate-harness.mjs
PRIVACY (no personal data committed)
  ✓ no private/PII paths are tracked
RECIPES (44)
  with lifecycle frontmatter: 44   missing: 0
  open TODOs: 517 declared (in frontmatter) · 517 [TODO markers in bodies
DOCTOR EXIT: 0
```

The recipe count moved 42 → 44 and the declared/body TODO counts reconcile
exactly, because both new recipes carry lifecycle frontmatter and contain zero
open TODO markers.

The four `manifest-check` warnings (`output/`, `reports/generated/`, `archive/`,
`private/` not in `.gitignore`) are pre-existing repository conditions, not
introduced by this contribution. `private/` is the one worth acting on and is
noted in the honest run.

---

## 4. Human attestation

The harness generated a PASS. A PASS in an artifact a component generated about
itself is not an attestation — the Chapter 16 rule is that nothing self-certifies.

I ran the commands recorded in the honest run, read the audit output, deliberately
introduced the gate-as-vote regression into `role-scorer.mjs` and confirmed the
harness failed with exit code 1, restored the file and confirmed it passed with
exit code 0, and confirmed `git status` showed the scorer unmodified afterward.

I attest that the numbers in this document are the numbers those commands
printed, and that the limitations named in section 3 are stated as I found them.

**Signed:** Saloni Angre · 2026-08-11

*(Signature applies to this run on this date. It does not certify the scorer as
correct — only that this harness tested what it claims to test, and that its
output is reported here without alteration.)*
