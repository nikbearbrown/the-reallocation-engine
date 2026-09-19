## Default to Markdown for humans

AI-native formats (JSON, YAML) are the source of truth for the machine. When showing an artifact to a person, render the Markdown view (`scripts/to-markdown.mjs` / the `review` skill) by default. Show raw JSON/YAML only when asked.

**Every human-facing Markdown file opens with an executive summary (SNICKERDOODLE P9).** Before any table, parameter, or provenance line, write a short plain-language section headed `## Executive summary` that answers: *what is this document*, *why should I read it*, and *what did it find or decide*. Write it for someone who has never seen the repository — no scheme names, principle numbers, field paths, or file paths. Put the run record / technical header after it under its own heading. This applies to reports, recipes, assignments, READMEs, and any log entry longer than a screen. A generated report is not done until its writer emits this section.
