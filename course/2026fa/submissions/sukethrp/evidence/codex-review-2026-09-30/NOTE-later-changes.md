# Note on this folder — later changes by Claude Code

## Executive summary

The files in this folder are Codex's raw records of its review, left exactly as written. Two things
changed afterwards, before anything was pushed:

- **Queue file.** Codex's run 3 read `worked-run/queue-live-1.json` after editing it in place. That
  file is again the one runs 1–2 read (sha256 `38a030669592…`). Codex's edited version is kept
  unchanged as `worked-run/queue-live-3-reviewed.json` (sha256 `76207422f40e…`). Run 3 was re-run from
  it with network access forbidden and gave the same result (`../../worked-run/terminal-live-3.txt`).
- **Commit.** `49eee0e`, the starting commit recorded here, was amended to `0754031`. The only change
  is two reworded lines in `SOURCES.md` and `FRICTIONAL.md` that had stated the student's own visa status.
