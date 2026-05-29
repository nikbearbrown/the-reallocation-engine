# Mode: deep -- Research Prompt Builder

Current status: prompt-building helper.

Use this to create a research prompt after the local evidence has been checked.
It is not a replacement for SEC/H-1B, ATS, liveness, or BLS/SOC scripts.

## Required Local Checks First

- Run or read the relevant company evidence from the SEC/H-1B mapped data.
- Check ATS/liveness if there is a job URL.
- Check BLS/SOC data if a SOC code is known.
- Review `modes/RUN_LOG.md` for previous attempts.

## Output

Create a research prompt that clearly separates:

- verified local evidence;
- open questions;
- external research requested;
- claims that need citations.

No uncited factual claims should be presented as verified.
