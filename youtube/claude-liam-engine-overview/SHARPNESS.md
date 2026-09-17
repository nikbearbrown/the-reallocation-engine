# SHARPNESS GATE — claude-liam-engine-overview

Compiled master: `claude-liam-engine-overview-slate.mp4`
Median Laplacian variance: **342.6**
Failure threshold: 171.3 (50% of median)

> Soft beats = rotation applied to `crispEdges` pixel-art.
> Fix: use translation/scale only — never rotate. See PIXEL-ART LAW in
> `ClaudeMascotScene.tsx`.

| Beat | LV | % of median | Status |
|------|----|-------------|--------|
| B00 | 567.4 | 166% | PASS — 166% |
| B01 | 166.0 | 48% | PASS — 48% |
| B02 | 325.5 | 95% | PASS — 95% |
| B03 | 379.2 | 111% | PASS — 111% |
| B04 | 248.5 | 73% | PASS — 73% |
| B05 | 307.4 | 90% | PASS — 90% |
| B06 | 343.2 | 100% | PASS — 100% |
| B07 | 191.0 | 56% | PASS — 56% |
| B08 | 354.1 | 103% | PASS — 103% |
| B09 | 297.9 | 87% | PASS — 87% |
| B10 | 302.2 | 88% | SKIP (exempt — no pixel-art rotation possible) |
| B11 | 599.6 | 175% | PASS — 175% |
| B12 | 410.3 | 120% | PASS — 120% |
| B13 | 271.5 | 79% | SKIP (exempt — no pixel-art rotation possible) |
| B14 | 190.7 | 56% | PASS — 56% |
| B15 | 711.3 | 208% | PASS — 208% |
| B16 | 408.7 | 119% | PASS — 119% |
| BVDT | 756.1 | 221% | PASS — 221% |
| BHTF | 779.5 | 228% | PASS — 228% |
| BOUT | 341.9 | 100% | PASS — 100% |
