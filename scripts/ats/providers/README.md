# ATS Provider Layer

JavaScript ATS provider modules adapted from the former Job-Ops reference copy.

These modules are useful when the detector has a known `careers_url` or
platform API URL. They are intentionally small provider adapters:

- `_http.mjs` — shared fetch helpers with timeout and JSON/text helpers.
- `greenhouse.mjs` — Greenhouse board API provider.
- `lever.mjs` — Lever postings API provider.
- `ashby.mjs` — Ashby posting API provider.

Each provider exports:

- `id` — provider name.
- `detect(entry)` — returns a provider URL hit when the company entry contains a
  supported `careers_url` or explicit API field.
- `fetch(entry, ctx)` — returns normalized job objects with `title`, `url`,
  `company`, and `location`.

These are not a replacement for `detect-ats.py` yet. They are the source-backed
provider layer for the next ATS detector expansion, especially Ashby support.

## Minimal Smoke Test

```bash
node -e "import('./scripts/ats/providers/ashby.mjs').then(m => console.log(m.default.detect({name:'Example', careers_url:'https://jobs.ashbyhq.com/example'})))"
```
