#!/usr/bin/env python3
"""board_cards.py — turn one greenhouse_watch run into the three human files (SNICKERDOODLE P5, P9).

    python3 board_cards.py --run <run-*.json> --raw <raw-*.json> --company "Figma" --out reports/greenhouse-watch/ \
        [--ats greenhouse|ashby] [--goal "remote part-time …"] [--keep <id> ...] [--reason <id>=<text> ...]

Writes, each opening with an executive summary:
  <slug>-<date>-ALL.md        every posting on the board as an eight-field card, grouped by department
  <slug>-<date>-TENTATIVE.md  the postings the scheme flagged, ranked by score, blank Verdict/Note columns
  <slug>-<date>-KEEP.md       the human keep list — only ids passed with --keep, each with its --reason

No network. No judgment: the only human content is what --keep/--reason carry. Stdlib only.
"""
import argparse, html, json, os, re
from collections import defaultdict

ATS_LABEL = {"ashby": "Ashby", "smartrecruiters": "SmartRecruiters", "greenhouse": "Greenhouse"}


def txt(j):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html.unescape(html.unescape(j.get("content") or j.get("descriptionHtml") or ""))))


class Board:
    """Uniform view over a raw Greenhouse or Ashby response."""
    def __init__(self, raw, ats, company):
        self.ats, self.company = ats, company
        self.jobs = raw["jobs"]
        self.byid = {str(self.jid(j)): j for j in self.jobs}

    def jid(self, j): return j.get("id")
    def url(self, j): return j.get("absolute_url") or j.get("jobUrl") or j.get("postingUrl") or ""
    def title(self, j): return (j.get("title") or j.get("name") or "").strip()

    def _cf(self, j):
        return {f.get("fieldLabel"): f.get("valueLabel") for f in (j.get("customField") or [])}

    def location(self, j):
        if self.ats == "smartrecruiters":
            return (j.get("location") or {}).get("fullLocation") or ""
        if self.ats == "ashby":
            locs = [j.get("location") or ""] + [x.get("location") or "" for x in (j.get("secondaryLocations") or [])]
            return " · ".join(x for x in locs if x)
        return ((j.get("location") or {}).get("name") or "").replace(" • ", " · ")

    def mode(self, j):
        if self.ats == "smartrecruiters":
            loc = j.get("location") or {}
            et = ((j.get("typeOfEmployment") or {}).get("label") or "").lower()
            wt = (self._cf(j).get("Worker type") or "").lower()
            place = "remote" if loc.get("remote") else ("hybrid" if loc.get("hybrid") else "on-site")
            return ", ".join(x for x in (et, wt if wt and wt != "employee" else "", place) if x)
        if self.ats == "ashby":
            et = {"FullTime": "full time", "PartTime": "part time", "Contract": "contract", "Intern": "internship",
                  "Temporary": "temporary"}.get(j.get("employmentType"), (j.get("employmentType") or "").lower())
            wp = (j.get("workplaceType") or "").lower()
            # Ashby's isRemote is a listing flag; workplaceType is what the posting actually says.
            rem = "remote flag set" if j.get("isRemote") and wp != "remote" else ""
            return ", ".join(x for x in (et, wp, rem) if x)
        t = txt(j).lower()
        loc = ((j.get("location") or {}).get("name") or "").lower()
        if "remotely in the united states" in t: return "full time, US hub or US remote"
        if "remote" in loc: return "full time, remote" + (" or hybrid" if "hybrid" in loc else "")
        if "hybrid" in loc: return "full time, hybrid"
        if "full time role" in t or "full-time role" in t: return "full time, hub"
        return "full time (mode not stated)"

    def dept(self, j):
        if self.ats == "smartrecruiters":
            return " → ".join(x for x in ((j.get("function") or {}).get("label"), self._cf(j).get("Org")) if x) or "—"
        if self.ats == "ashby":
            return " → ".join(x for x in (j.get("department"), j.get("team")) if x) or "—"
        return " → ".join(d["name"] for d in j.get("departments", [])) or "—"

    def dates(self, j):
        if self.ats == "smartrecruiters":
            p = (j.get("releasedDate") or "")[:10]
            return f"{p} / {p}"
        if self.ats == "ashby":
            p = (j.get("publishedAt") or "")[:10]
            return f"{p} / {p}"
        return f"{(j.get('first_published') or '')[:10]} / {(j.get('updated_at') or '')[:10]}"

    def pay(self, j):
        if self.ats == "smartrecruiters":
            c = j.get("compensation") or {}
            if c.get("min") or c.get("max"):
                return f"{c.get('min', '?')} – {c.get('max', '?')} {c.get('currency', '')} base (posted)".replace("  ", " ")
            m = re.search(r"\$([\d,]{5,})\s*(?:to|-|–|—)\s*\$([\d,]{5,})", txt(j))
            return f"${m.group(1)} – ${m.group(2)} (from ad text)" if m else "not posted"
        if self.ats == "ashby":
            c = (j.get("compensation") or {}).get("scrapeableCompensationSalarySummary")
            return f"{c} base (posted)" if c else "not posted"
        t = txt(j)
        m = re.search(r"Salary Range:?\s*([$£€]?[\d,]+(?:\.\d+)?)\s*[—–\-]+\s*([$£€]?[\d,]+(?:\.\d+)?)\s*([A-Z]{3})?", t)
        if m:
            return f"{m.group(1)} – {m.group(2)} {m.group(3) or ''} base".strip()
        zones = re.findall(r"\$([\d,]{6,})\s*[—–\-]+\s*\$([\d,]{6,})", t)  # e.g. Webflow's Zone A/B/C ranges
        if zones:
            lo = min(int(a.replace(",", "")) for a, _ in zones); hi = max(int(b.replace(",", "")) for _, b in zones)
            return f"${lo:,} – ${hi:,} base" + (f" (across {len(zones)} zones)" if len(zones) > 1 else "")
        return "not posted"

    def is_remote(self, j):
        if self.ats == "smartrecruiters":
            return bool((j.get("location") or {}).get("remote"))
        if self.ats == "ashby":
            return (j.get("workplaceType") or "").lower() == "remote"
        return "remotely in the united states" in txt(j).lower() or "remote" in ((j.get("location") or {}).get("name") or "").lower()

    def is_parttime_or_contract(self, j):
        if self.ats == "smartrecruiters":
            et = ((j.get("typeOfEmployment") or {}).get("label") or "").lower()
            return et not in ("full-time", "permanent", "") or self._cf(j).get("Worker type") == "Contingent Worker"
        if self.ats == "ashby":
            return j.get("employmentType") in ("PartTime", "Contract", "Temporary")
        return False  # Greenhouse carries no employment-type field; the finding is stated from the text

    def card(self, j):
        return "\n".join([
            f"### {self.title(j)}", "", "| | |", "|---|---|",
            f"| Company | {self.company} |",
            f"| Title | {self.title(j)} |",
            f"| Link | {self.url(j)} |",
            f"| Location | {self.location(j)} ({self.mode(j)}) |",
            f"| Department | {self.dept(j)} |",
            f"| Posted / updated | {self.dates(j)} |",
            f"| Pay band (posted) | {self.pay(j)} |",
            f"| {ATS_LABEL.get(self.ats, 'Greenhouse')} job id | {self.jid(j)} |", ""])


def long_date(iso):
    import datetime as dt
    d = dt.date.fromisoformat(iso[:10])
    return d.strftime("%B %-d, %Y")


def write_all(b, run, path, date, notes=()):
    by = defaultdict(list)
    for j in b.jobs: by[b.dept(j)].append(j)
    n = len(b.jobs)
    n_pay = sum(1 for j in b.jobs if b.pay(j) != "not posted")
    n_rem = sum(1 for j in b.jobs if b.is_remote(j))
    n_hyb = sum(1 for j in b.jobs if "hybrid" in b.mode(j))
    n_pt = sum(1 for j in b.jobs if b.is_parttime_or_contract(j))
    top = sorted(by, key=lambda d: -len(by[d]))
    pt_line = (f"{n_pt} posting{'s are' if n_pt != 1 else ' is'} contract, contingent, or otherwise not full-time employment."
               if b.ats in ("ashby", "smartrecruiters") else "There are no part-time, contract, or consulting postings.")
    L = [f"# Every open job at {b.company} — {date}", "", "## Executive summary", "",
         f"**What this is.** All {n} jobs {b.company} had open on its public careers board on {long_date(date)}, one card each, grouped by department. Every card has the same eight fields (company, title, link, location, department, dates, posted pay band, job id) so they can be compared side by side. No filtering, no scoring — this is the whole board.", "",
         f"**Why read it.** The matched list (`…-TENTATIVE.md`) shows only the postings that mention words on my CV, and I do not trust a word-match to decide what I never see. This is the complete set, so I can scan the titles myself and pull anything the rules missed into the keep list (`…-KEEP.md`).", "",
         f"**What is here.** {len(by)} departments. {top[0]} is the largest ({len(by[top[0]])} postings)" + (f", then {top[1]} ({len(by[top[1]])})" if len(top) > 1 else "") + f". {n_rem} of {n} are fully remote" + (f"; {n_hyb} are hybrid at a hub" if n_hyb else "") + f". {n_pay} post a pay band. {pt_line}" + (" " + " ".join(notes) if notes else ""), "",
         "**What this is not.** Not a shortlist and not a recommendation. Cards are copied from the company's own posting data; the only derived field is the remote/hub note.", "", "---", "", "## Contents", ""]
    L += [f"- {d} ({len(by[d])})" for d in top] + [""]
    for d in top:
        L += [f"## {d} ({len(by[d])})", ""]
        L += [b.card(j) for j in sorted(by[d], key=b.title)]
    L.append(f"---\n*Source: `{run['source']}`, fetched {run['run_at']}. Raw response kept locally.*")
    open(path, "w").write("\n".join(L))
    return dict(n=n, n_pay=n_pay, n_rem=n_rem, n_hyb=n_hyb, n_pt=n_pt, depts=len(by))


def write_tentative(b, run, path, date, goal, stats, notes=()):
    rel = sorted(run["relevant"], key=lambda j: -j["score"])
    L = [f"# {b.company} jobs that match my CV — first pass, not yet reviewed", "", "## Executive summary", "",
         f"**What this is.** On {long_date(date)} I pointed the engine's board-watch skill at {b.company}'s public job board and asked one question: *of everything {b.company} is hiring for right now, which postings mention the things I actually do?* It read all {stats['n']} open postings once, matched them against my CV with a written rule set, and flagged {len(rel)}. This file is that list, laid out for me to review by hand.", "",
         f"**Why read it.** If you are me: this is the to-do list — open each link, read the posting, write a verdict in the blank column. If you are a student: this is what a real run looks like when the résumé is real — including the part where the machine's top scores are not necessarily the jobs I want.", "",
         f"**What it found.** {stats['n']} open postings, {len(rel)} mention skills or titles on my CV, {len(run['skipped'])} do not. {stats['n_rem']} of {stats['n']} are fully remote" + (f"; {stats['n_hyb']} are hybrid at a hub" if stats.get('n_hyb') else "") + ". " + (f"{stats['n_pt']} {'is' if stats['n_pt'] == 1 else 'are'} part-time/contract/temporary. " if b.ats in ("ashby", "smartrecruiters") else "None are part-time or contract. ") + (f"My stated goal: {goal}. " if goal else "") + " ".join(notes), "",
         "**What it did not do.** It did not judge fit. Every flag is a string match between a word on my CV and a word in a posting; score ranks how many words matched, not how good the job is for me. The decision is mine and has not been made: **the Verdict column is empty.** Nothing here is a shortlist or an intent to apply.", "",
         "**Status:** TENTATIVE. When every row has a verdict, the banner comes off and the file is renamed `…-reviewed.md`.", "",
         f"**Companion files.** `…-ALL.md` — every posting as a card, nothing filtered. `…-KEEP.md` — the ones I decided to keep, with reasons; the only file with a human judgment in it.", "", "---", "",
         "## Run record", "", "| | |", "|---|---|",
         f"| Board | `{run['board']}` on {run.get('ats', 'greenhouse')} — {run['source']} |",
         f"| Fetched | {run['run_at']} (one fetch, host allow-listed, raw response saved locally) |",
         f"| Seen / new / relevant / skipped | {run['jobs_seen']} / {run['jobs_new']} / {run['jobs_relevant']} / {run['jobs_skipped']} |",
         f"| Scheme | `{run['scheme_version']}` |",
         "| Résumé | my own CV JSON (local, gitignored — never tracked). Only skill strings already on the public CV appear below. |", "",
         "## How to review this file", "",
         "For each row: open the link, read the posting, set **Verdict** to `pursue` · `later` · `pass` · `wrong-match` (the scheme fired on a word that means something else — fix the scheme, not the résumé). Leave a one-line **Note**.", "",
         f"## Relevant postings ({len(rel)}) — ranked by scheme score, which is NOT a ranking of fit", "",
         "| # | Score | Title | Location | Mode | Top rule hits | Verdict | Note |", "|--:|--:|---|---|---|---|---|---|"]
    for i, r in enumerate(rel, 1):
        j = b.byid.get(str(r["id"]), {})
        hits = [re.search(r"«([^»]+)»", l).group(1) for l in r["justification"] if l.startswith(("skill", "title"))]
        L.append(f"| {i} | {r['score']:.2f} | [{r['title'].strip()}]({r['url']}) | {b.location(j) if j else r['location']} | {b.mode(j) if j else ''} | {', '.join(hits[:6])}{' …' if len(hits) > 6 else ''} | | |")
    L += ["", f"## Skipped postings ({len(run['skipped'])})", "", "<details><summary>Show skipped</summary>", "", "| Title | Location | Reason |", "|---|---|---|"]
    L += [f"| {s.get('title', '').strip()} | {s.get('location', '')} | {s.get('reason', '')} |" for s in sorted(run["skipped"], key=lambda s: s.get("title", ""))]
    L += ["", "</details>", "", "## Justification detail", "", "<details><summary>Show every rule that fired</summary>", ""]
    for r in rel:
        L += [f"**{r['title'].strip()}** — {r['url']} — score {r['score']:.2f}", ""] + [f"- {l}" for l in r["justification"]] + [""]
    L += ["</details>", "", "---", "*Verdict kind for every row: `record-based rule`. The person decides.*"]
    open(path, "w").write("\n".join(L))


def write_keep(b, path, date, keep, reasons, goal, considering):
    L = [f"# {b.company} jobs I am keeping — {date}", "", "## Executive summary", "",
         f"**What this is.** The short list. Of the {len(b.jobs)} jobs on {b.company}'s board, these are the ones I — not the matching rules — decided are worth more of my time. Each card is copied from the full board list; under it is my reason.", "",
         "**Why read it.** This is the only file in the set that contains a human judgment. The matched list says what the rules found; the full list says what exists; this says what I chose and why.", "",
         f"**Where it stands.** {len(keep)} kept so far, from a first pass on {long_date(date)}. The review of the rest is still open (see the TENTATIVE list), so this file will grow or shrink." + (f" I am looking for {goal}." if goal else ""), "", "---", ""]
    for i in keep:
        j = b.byid.get(str(i))
        if not j:
            L += [f"### (id {i} not on this board)", ""]; continue
        L += [b.card(j), reasons.get(str(i), "**Why I keep it.** _(reason pending)_"), ""]
    if considering:
        L += ["## Under consideration (not yet kept)", ""] + [f"- {c}" for c in considering] + [""]
    L += ["## How this file changes", "", f"Add a card by copying it from `…-ALL.md`, then write the reason. Remove a card by moving it to a `## No longer keeping` section with one line on why — nothing is deleted.", ""]
    open(path, "w").write("\n".join(L))


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--run", required=True); ap.add_argument("--raw", required=True)
    ap.add_argument("--company", required=True); ap.add_argument("--out", required=True)
    ap.add_argument("--ats", default=None, choices=("greenhouse", "ashby", "smartrecruiters"))
    ap.add_argument("--slug", default=None, help="file prefix (default: board slug)")
    ap.add_argument("--goal", default="")
    ap.add_argument("--keep", nargs="*", default=[], help="job ids the human keeps")
    ap.add_argument("--reason", nargs="*", default=[], help="<id>=<text> for each kept id")
    ap.add_argument("--considering", nargs="*", default=[], help="free-text lines for the under-consideration section")
    ap.add_argument("--note", nargs="*", default=[], help="extra plain-language sentences for the 'What it found' summary (e.g. a scheme finding)")
    a = ap.parse_args(argv)
    run = json.load(open(a.run)); raw = json.load(open(a.raw))
    ats = a.ats or run.get("ats", "greenhouse")
    b = Board(raw, ats, a.company)
    date = run["run_at"][:10]
    slug = a.slug or re.sub(r"[^a-z0-9]+", "-", run["board"].lower()).strip("-")
    os.makedirs(a.out, exist_ok=True)
    reasons = dict(r.split("=", 1) for r in a.reason)
    stats = write_all(b, run, os.path.join(a.out, f"{slug}-{date}-ALL.md"), date, a.note)
    write_tentative(b, run, os.path.join(a.out, f"{slug}-{date}-TENTATIVE.md"), date, a.goal, stats, a.note)
    write_keep(b, os.path.join(a.out, f"{slug}-{date}-KEEP.md"), date, a.keep, reasons, a.goal, a.considering)
    print(f"wrote {slug}-{date}-{{ALL,TENTATIVE,KEEP}}.md in {a.out} — {stats}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
