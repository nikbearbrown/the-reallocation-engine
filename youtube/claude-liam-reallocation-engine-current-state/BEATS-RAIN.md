# BrutalistCommandRain — B17 · B18 · B19

The repository's own command and recipe names fall as rain. **The ones that do not
exist yet fall away; the ones that do settle and hold.** Three beats, one component,
one prop changing — the act's argument carried structurally instead of narrated over
a stock photo.

| Beat | Duration | `retainWhen` | What you see |
|---|---|---|---|
| **B17** | 7.94s | `[]` | Everything falls. Nothing lands. "Everything drafted. Nothing signed." |
| **B18** | 3.48s | `['ATTESTED']` | The named-attestation recipes settle. "Then a signature landed." |
| **B19** | 11.35s | `['ATTESTED','RUNNABLE-LIVE','RUNNABLE-SAMPLE']` | Everything that exists lands; 29 drafts keep falling. |

Terracotta is reserved for `ATTESTED` — the ones a **human** signed. Runnable-but-
unsigned settles in cream. That distinction is the act's whole point, and it is
carried by colour rather than said out loud.

## Nothing on screen is typed from memory

`rain_items.py` scans the tree and emits `items.json`: npm entry points from
`package.json`, recipe names and lifecycle statuses from `recipes/*.md` frontmatter,
`ATTESTED` derived from a named `attestation:` field. Run it, diff the counts against
`FACTCHECK.md`, then wire `items.json` into the three beats.

If a name is on screen, it is in the repo. In a film about a status file that drifted
from its own tree, a hand-typed prop list would be the same failure wearing a
different hat.

```jsonc
// B17 · B18 · B19 — lane: REMOTION (was VOX / run R2)
{ "scene": "BrutalistCommandRain", "props": {
    "items": "«items.json»",
    "retainWhen": [],                                  // B18: ["ATTESTED"]
                                                       // B19: ["ATTESTED","RUNNABLE-LIVE","RUNNABLE-SAMPLE"]
    "sparkWhen": ["ATTESTED"],
    "fallSpeed": 5, "windTurbulence": 20,
    "settleAtSec": 2.2, "settleSeconds": 1.4, "settleCols": 4,
    "charSize": 30, "settleSize": 34, "mono": true,
    "seed": 17 }}                                      // B18: 18 · B19: 19
```

`settleAtSec` must be shorter than the beat. **B18 is only 3.48s** — set
`settleAtSec: 0.6, settleSeconds: 1.2` there, or the signature lands after the beat
has already cut.

---

## The conversion is blocked, and here is the arithmetic

Body beats: **33.** VOX is currently **7** (B04 B05 B17 B18 B19 B30 B31).

| Scenario | VOX | Share | Lint |
|---|---|---|---|
| now | 7 | 21.2% | PASS |
| date card on B04+B05 only | 5 | 15.2% | PASS |
| rain on B17–B19 only | 4 | 12.1% | **WARN** |
| **both** | 2 | 6.1% | **FAIL** |

**You cannot have both.** Converting five of seven vox beats leaves the film at 6.1%
vox — the all-Remotion "reads as a deck" failure the quota exists to prevent.

### Recommendation: build the rain, revert the date card

The rain is the stronger of the two. It puts **real repository data** on screen in a
film whose thesis is *verify against the tree*, and it turns three beats of stock
desk photography — the weakest slates in the reel — into the act's argument. The date
card's B04/B05 replacement is nice; a real archival calendar is also fine, and
archive plates are what give the film its documentary texture.

So: **B17–B19 → rain. B04/B05 → back to VOX stills**, staying on the shopping list.
That lands at 12.1% — a WARN, not a FAIL.

To clear the WARN and reach PASS, promote **one** currently-Remotion beat to a vox
still. That fixes both lints at once: VOX goes to 5 (15.2%, PASS) and REMOTION comes
down. Which beat is a judgement call — pick one whose subject is a thing rather than
a diagram.

The date card is NOT wasted under this plan: it still captions B18, B30 and B31 as
transparent overlays, exactly as `BEATS-DATECARD.md` specifies. Only the B04/B05
*replacement* is dropped.

### A caveat on the REMOTION share

My classifier put REMOTION at 51.5% of body beats, above the 30–45% target — but it
could not distinguish `FormACard` act cards (the CARD lane) from true Remotion
patterns, and it reported CARD as 0, which is obviously wrong. **Treat the VOX number
as solid and the REMOTION/CARD split as unverified.** Run the pipeline's own lane
lint before acting on it.
