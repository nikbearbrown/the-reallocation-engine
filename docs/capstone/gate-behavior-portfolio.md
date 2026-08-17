# Case study: catching “gate-as-vote” in a job-ranking scorer

**Author:** Yu-Chen Huang  
**Project:** Capstone contribution to [The Reallocation Engine](https://github.com/nikbearbrown/the-reallocation-engine)  
**Focus:** Gate-behavior unit-test harness (Chapters 11 & 16)  
**Audience:** technical hiring managers / staff engineers reviewing a mergeable open-source contribution

---

## The problem (for a specific person)

I am an international student on F-1 / OPT. My search time is limited. If a ranking tool tells me to Apply to a role that is already dead, or that I cannot start in time, I lose a day I cannot get back.

The Reallocation Engine tries to stop that waste. Sponsorship and fit are **votes**. Posting liveness and visa timeline are supposed to be **gates**: if either is closed, the final score should go to ~0 and the recommendation should be Skip.

The failure mode the book names is subtle. If someone implements those gates as soft votes, a strong company signal can “outvote” a dead posting. The output still looks professional. That is the danger.

## What I built

A small **gate-behavior harness** that locks the contract in tests:

1. Load public fixture roles (`data/examples/gate-behavior-roles.json`).
2. Score with the correct Ch.11 rule: `(Σ vote·weight) × liveness × timeline`.
3. Assert closed liveness / timeline → Skip and composite ≤ 0.05, even when votes alone would be Apply-strong.
4. Offer a deliberate `--break` mode that treats gates as addends, so the harness must **fail those cases** and report `BREAK-CAUGHT`.

```text
fixture roles  →  harness (correct | --break)  →  JSON + Markdown audit
                         ↓
              PASS / FAIL / BREAK-CAUGHT
```

Shipped as a two-customer pair:

- AI recipe: `recipes/gate-behavior.md` (nine sections, phase gates with failure paths)
- Human card: `recipes/gate-behavior.card.md` (limits + ≥4 failure modes)

Command:

```bash
npm run score:gates
npm run score:gates -- --break
```

## Measurable improvement (one honest number)

On the public fixture, the deliberate buggy scorer recommended **Apply (0.6825)** for a dead posting with Proven sponsorship. The harness marked that row FAIL and returned verdict **BREAK-CAUGHT**.

After switching back to multiplicative gates, the same row is **Skip (0)** — **22/22 checks PASS**.

That is the improvement: the bug is no longer invisible. The harness fails when gates behave like votes, and passes when they do not.

(I am not claiming a live ATS skip-rate change. This number is from fixture arithmetic, traced in the audit.)

## Verified vs inferred

| Kind | Examples in this work |
|---|---|
| Fixture record / labeled input | `liveness.factor`, `sponsorship.p`, `timeline.factor` on example rows |
| Script-output | composite, recommendation, PASS/FAIL counts, verdict strings |
| Out of scope / missing here | live URL liveness, personal OPT date truth, “should I apply anyway?” |

I do not print a made-up “coverage %” for this component. If a live check is needed, that is a different script (`ats:liveness`).

## Failure modes and the limit I cannot verify

Named in the human card: gate-as-vote regression, threshold drift vs `role-scorer.mjs`, contract-violation (unsourced metrics), fixture cheating with weak votes, fluent-but-unread reports, privacy misuse of `data/ats/`.

**One limitation it cannot verify:** this harness does not know if a real job link is live today. It only checks that *given* a closed gate factor, the combiner cannot be talked into Apply by strong votes.

## Demo

- Recipe + card: `recipes/gate-behavior.md`, `recipes/gate-behavior.card.md`
- Script: `scripts/score/gate-behavior-harness.mjs`
- Honest run (pasted terminal): `docs/capstone/gate-behavior-honest-run.md`
- Attestation: `docs/capstone/gate-behavior-attestation.md`
- Branch: `contrib/yuchen-huang-gate-behavior-harness`

```bash
git clone https://github.com/huangyuchen3/the-reallocation-engine.git
cd the-reallocation-engine
git checkout contrib/yuchen-huang-gate-behavior-harness
npm run score:gates
npm run score:gates -- --break
```

---

*Calibrated claim:* this contribution makes one Capstone-named failure **testable**. It does not replace human judgment on which Skip to override, and it does not replace live liveness checks.
