#!/usr/bin/env python3
"""greenhouse_watch.py — watch one Greenhouse board; report NEW jobs that match a JSON resume.

    python3 greenhouse_watch.py --board airbnb --resume search/examples/aarav-patel/resume.example.json \
        --state out/state.json --out out/ [--scheme scheme.json] [--fixture saved.json] [--dry-run]

One fetch per run, host allow-listed, raw response saved. Diff by job `id` against the
state file. First run is a BASELINE: every id is recorded, none is reported as new.
Matching is a documented, record-based rule set (scheme.json) — no model judgment is
made here, and none is reported as one. Output: a JSON run record for the agent and a
Markdown report for the human, listing ONLY relevant new jobs, each with a justification
that cites the resume fields and posting fields that produced it.

Stdlib only. Exit 0 = ran; 2 = bad input (resume/scheme/host); 3 = fetch failed
(state file is NOT updated on failure).
"""
import argparse, datetime as dt, html, json, os, re, sys, urllib.request, urllib.error

ALLOWED_HOSTS = {"boards-api.greenhouse.io", "boards.greenhouse.io",
                 "job-boards.greenhouse.io", "job-boards.eu.greenhouse.io",
                 "api.ashbyhq.com", "api.smartrecruiters.com"}
ATS_CHOICES = ("greenhouse", "ashby", "smartrecruiters")
RESUME_REQUIRED = {"personal": dict, "education": list, "experience": list, "skills": dict}
DEFAULT_SCHEME = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "scheme.default.json")
SCHEME_VERSION_KEY = "scheme_version"


class InputError(Exception):
    pass


# ----------------------------------------------------------------- inputs
def board_url(slug, content=True, ats="greenhouse"):
    if ats == "smartrecruiters":
        # company identifier = the segment after careers.smartrecruiters.com/ (e.g. "Canva")
        if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{0,63}", slug):
            raise InputError(f"smartrecruiters company identifier looks wrong: {slug!r}")
        return f"https://api.smartrecruiters.com/v1/companies/{slug}/postings?limit=100&offset=0"
    if ats == "ashby":
        # Ashby board names may carry spaces and capitals ("Jasper AI"); URL-encode them.
        if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9 ._-]{0,63}", slug):
            raise InputError(f"ashby board name looks wrong: {slug!r}")
        from urllib.parse import quote
        return f"https://api.ashbyhq.com/posting-api/job-board/{quote(slug)}?includeCompensation=true"
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,63}", slug):
        raise InputError(f"board slug looks wrong: {slug!r} (lowercase letters, digits, dashes)")
    url = f"https://boards-api.greenhouse.io/v1/boards/{slug}/jobs"
    return url + ("?content=true" if content else "")


def normalize_jobs(jobs, ats):
    """Map an ATS's job objects onto the Greenhouse-shaped fields the matcher and report read:
    id, title, location.name, content, absolute_url, first_published, updated_at, departments[].name.
    The raw response is always saved untouched; this view is only for judging. Ashby extras
    (employmentType, isRemote, workplaceType, compensation) ride along under `ashby`."""
    if ats == "smartrecruiters":
        out = []
        for j in jobs:
            loc = j.get("location") or {}
            name = loc.get("fullLocation") or ", ".join(x for x in (loc.get("city"), loc.get("region"), loc.get("country")) if x)
            if loc.get("remote"):
                name = (name + " • Remote") if name else "Remote"
            secs = ((j.get("jobAd") or {}).get("sections") or {})
            content = " ".join((v or {}).get("text") or "" for v in secs.values())
            cf = {f.get("fieldLabel"): f.get("valueLabel") for f in (j.get("customField") or [])}
            depts = [x for x in ((j.get("function") or {}).get("label"), cf.get("Org"), (j.get("department") or {}).get("label")) if x]
            out.append({
                "id": j.get("id"),
                "title": j.get("name") or "",
                "location": {"name": name},
                "content": content,
                "absolute_url": j.get("postingUrl") or "",
                "first_published": j.get("releasedDate") or "",
                "updated_at": j.get("releasedDate") or "",
                "departments": [{"name": d} for d in depts],
                "smartrecruiters": {"typeOfEmployment": (j.get("typeOfEmployment") or {}).get("label"),
                                    "workerType": cf.get("Worker type"), "recruitmentType": cf.get("Recruitment type"),
                                    "remote": loc.get("remote"), "hybrid": loc.get("hybrid"),
                                    "experienceLevel": (j.get("experienceLevel") or {}).get("label"),
                                    "compensation": j.get("compensation")},
            })
        return out
    if ats != "ashby":
        return jobs
    out = []
    for j in jobs:
        locs = [j.get("location") or ""] + [x.get("location") or "" for x in (j.get("secondaryLocations") or [])]
        loc = " • ".join(x for x in locs if x)
        if j.get("isRemote"):
            loc = (loc + " • Remote") if loc else "Remote"
        comp = (j.get("compensation") or {}).get("scrapeableCompensationSalarySummary") or ""
        out.append({
            "id": j.get("id"),
            "title": j.get("title") or "",
            "location": {"name": loc},
            "content": j.get("descriptionHtml") or j.get("descriptionPlain") or "",
            "absolute_url": j.get("jobUrl") or "",
            "first_published": j.get("publishedAt") or "",
            "updated_at": j.get("publishedAt") or "",
            "departments": [{"name": d} for d in (j.get("department"), j.get("team")) if d],
            "ashby": {"employmentType": j.get("employmentType"), "isRemote": j.get("isRemote"),
                      "workplaceType": j.get("workplaceType"), "compensation": comp},
        })
    return out


def assert_allowed(url):
    from urllib.parse import urlparse
    p = urlparse(url)
    if p.scheme != "https" or p.hostname not in ALLOWED_HOSTS:
        raise InputError(f"refusing host {p.hostname!r}: not in the Greenhouse allow-list {sorted(ALLOWED_HOSTS)}")
    return url


def fetch_board(url, timeout=30):
    assert_allowed(url)
    req = urllib.request.Request(url, headers={"User-Agent": "reallocation-engine greenhouse-watch"})
    # no redirects: a redirect could leave the allow-list
    class NoRedirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self, *a, **k):
            return None
    opener = urllib.request.build_opener(NoRedirect)
    with opener.open(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_smartrecruiters(list_url, timeout=30, pause=0.05):
    """SmartRecruiters exposes a paged listing (no ad text) and a per-posting detail record (with the
    jobAd sections). One run = every listing page + one detail call per posting, all on the one
    allow-listed host, no redirects. Returns {"jobs": [detail records], "totalFound": n}."""
    import time
    base = list_url.split("?")[0]
    jobs, offset = [], 0
    while True:
        page = fetch_board(f"{base}?limit=100&offset={offset}", timeout=timeout)
        content = page.get("content") or []
        jobs.extend(content)
        offset += len(content)
        if not content or offset >= int(page.get("totalFound") or 0):
            break
    details = []
    for j in jobs:
        try:
            d = fetch_board(f"{base}/{j['id']}", timeout=timeout)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as e:
            d = {**j, "_detail_error": str(e)}  # keep the listing record; content will be empty
        details.append(d)
        time.sleep(pause)
    return {"jobs": details, "totalFound": len(details)}


def load_resume(path):
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        raise InputError(f"resume not found: {path}")
    except json.JSONDecodeError as e:
        raise InputError(f"resume is not valid JSON ({path}): {e}")
    if not isinstance(data, dict):
        raise InputError("resume JSON must be an object in the search/examples/*/resume.example.json shape")
    missing = [k for k, t in RESUME_REQUIRED.items() if not isinstance(data.get(k), t)]
    if missing:
        raise InputError(f"resume JSON is missing or mistyped: {missing} (expected the resume.example.json shape)")
    if os.path.basename(path) == "resume.json" and os.path.basename(os.path.dirname(path)) == "search":
        # allowed to READ (it is the user's own local layer) — but never copy it into outputs
        pass
    return data


def load_scheme(path):
    try:
        with open(path, encoding="utf-8") as f:
            s = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        raise InputError(f"scheme unusable ({path}): {e}")
    for k in (SCHEME_VERSION_KEY, "threshold", "weights"):
        if k not in s:
            raise InputError(f"scheme is missing {k!r}")
    return s


def load_state(path):
    if not os.path.exists(path):
        return None
    try:
        with open(path, encoding="utf-8") as f:
            s = json.load(f)
        assert isinstance(s.get("seen_ids"), list)
        return s
    except Exception as e:
        raise InputError(f"state file is corrupt ({path}): {e} — move it aside to re-baseline")


# ----------------------------------------------------------------- resume features
def strip_html(s):
    s = html.unescape(s or "")
    s = re.sub(r"<[^>]+>", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def resume_features(r):
    """Return (skills, titles, city, degree_terms) with the resume field path for each."""
    skills = []
    for group, items in (r.get("skills") or {}).items():
        if not isinstance(items, list):
            continue
        weight_key = "skill_unshipped" if group == "familiar_with_not_shipped" else "skill"
        for i, s in enumerate(items):
            if isinstance(s, str) and s.strip():
                skills.append((s.strip(), f"skills.{group}[{i}]", weight_key))
    titles = []
    for i, e in enumerate(r.get("experience") or []):
        t = (e.get("title") or "").strip()
        if t:
            titles.append((re.sub(r"\s*\(.*?\)\s*", " ", t).strip(), f"experience[{i}].title"))
    city = ((r.get("personal") or {}).get("location") or "").split(",")[0].strip()
    degrees = []
    for i, e in enumerate(r.get("education") or []):
        d = (e.get("degree") or "")
        for term in re.findall(r"\b(MS|MSc|PhD|MBA|BS|BSc|BA)\b", d):
            degrees.append((term, f"education[{i}].degree"))
    return skills, titles, city, degrees


def phrase_in(phrase, text_lc):
    p = re.escape(phrase.lower())
    return re.search(rf"(?<![a-z0-9]){p}(?![a-z0-9])", text_lc) is not None


# ----------------------------------------------------------------- matching
def judge(job, feats, scheme):
    """Apply the scheme to one job. Returns (relevant, score, justification_lines, skipped_reason)."""
    w = scheme["weights"]
    skills, titles, city, degrees = feats
    title = job.get("title") or ""
    loc = (job.get("location") or {}).get("name") or ""
    content = strip_html(job.get("content") or "")
    title_lc, content_lc = title.lower(), content.lower()
    why, score = [], 0.0

    for pat in scheme.get("exclude_title_patterns", []):
        if re.search(pat, title, re.I):
            return False, 0.0, [f"title matches exclude pattern /{pat}/ (scheme.exclude_title_patterns)"], "excluded-by-title"

    hit_titles = [(t, p) for t, p in titles if phrase_in(t, title_lc)]
    if hit_titles:
        score += w.get("title", 0)
        for i, (t, p) in enumerate(hit_titles):  # the title weight is credited once, however many résumé titles match
            why.append(f"title «{title}» contains résumé title «{t}» ({p}) "
                       + (f"+{w.get('title', 0)}" if i == 0 else "(already counted, +0)"))
    else:
        for t, p in titles:
            toks = [x for x in re.findall(r"[a-z]+", t.lower()) if len(x) > 3]
            need = len(toks) if len(toks) <= 2 else len(toks) - 1
            if toks and sum(1 for x in toks if phrase_in(x, title_lc)) >= need:
                score += w.get("title_partial", 0)
                why.append(f"title «{title}» shares most words with résumé title «{t}» ({p}) +{w.get('title_partial', 0)}")
                break

    hits = []
    ignore = {x.lower() for x in scheme.get("ignore_skills", [])}  # board boilerplate: words every posting carries
    for s, p, wk in skills:
        if s.lower() in ignore:
            continue
        where = "title" if phrase_in(s, title_lc) else ("content" if phrase_in(s, content_lc) else None)
        if where:
            hits.append((s, p, wk, where))
    cap = scheme.get("max_skill_hits", 8)
    for s, p, wk, where in hits[:cap]:
        score += w.get(wk, 0)
        why.append(f"skill «{s}» ({p}) appears in posting {where} +{w.get(wk, 0)}")
    if len(hits) > cap:
        why.append(f"{len(hits) - cap} further skill hits not counted (scheme.max_skill_hits={cap})")
    if hits:
        score += w.get("skill_any", 0)
        why.append(f"at least one résumé skill appears in the posting (scheme.weights.skill_any) +{w.get('skill_any', 0)}")

    for term, p in degrees:
        if phrase_in(term, content_lc):
            score += w.get("degree", 0)
            why.append(f"degree term «{term}» ({p}) appears in posting content +{w.get('degree', 0)}")
            break

    remote = "remote" in loc.lower()
    same_city = bool(city) and city.lower() in loc.lower()
    mode = scheme.get("location_mode", "soft")
    if same_city or remote:
        score += w.get("location", 0)
        why.append(f"location «{loc}» {'is remote' if remote and not same_city else 'matches personal.location city «' + city + '»'} +{w.get('location', 0)}")
    elif mode == "hard":
        return False, score, why + [f"location «{loc}» is neither remote nor «{city}» (scheme.location_mode=hard)"], "location-hard-fail"
    else:
        score += w.get("location_miss", 0)
        why.append(f"location «{loc}» is neither remote nor «{city}» {w.get('location_miss', 0):+}")

    relevant = score >= scheme["threshold"] and bool(hits)
    if not relevant:
        reason = "no résumé skill appears in the posting" if not hits else f"score {score:.1f} below threshold {scheme['threshold']}"
        return False, score, why, reason
    return True, score, why, None


# ----------------------------------------------------------------- outputs
def write_outputs(out_dir, run, relevant_rows, skipped_rows, scheme):
    os.makedirs(out_dir, exist_ok=True)
    stamp = run["run_at"][:19].replace(":", "-")
    if run["baseline"]:
        stamp += "-baseline"
    n = 0
    while os.path.exists(os.path.join(out_dir, f"run-{stamp}{'-' + str(n) if n else ''}.json")):
        n += 1  # two runs in the same second must not overwrite each other
    stamp = f"{stamp}{'-' + str(n) if n else ''}"
    jpath = os.path.join(out_dir, f"run-{stamp}.json")
    mpath = os.path.join(out_dir, f"report-{stamp}.md")
    with open(jpath, "w", encoding="utf-8") as f:
        json.dump({**run, "relevant": relevant_rows, "skipped": skipped_rows}, f, indent=1)
    board = run['board']
    n_rel, n_new, n_seen = len(relevant_rows), run['jobs_new'], run['jobs_seen']
    if run["baseline"]:
        found = (f"This was the first look at this board, so it only memorised the {n_seen} postings that are open today. "
                 f"Nothing is listed below; the next run will show only what has been added since.")
    elif n_rel == 0:
        found = (f"{n_new} posting{'s' if n_new != 1 else ''} appeared since the last check and none of them mention the things on the résumé. "
                 f"That is a normal, healthy result — most of what a company posts is not for you.")
    else:
        found = (f"{n_new} posting{'s' if n_new != 1 else ''} appeared since the last check; {n_rel} of them mention skills or titles "
                 f"that are on the résumé and are listed below with the exact words that matched. {len(skipped_rows)} did not and are listed at the end.")
    lines = [f"# New jobs at {board} that mention what is on your résumé — {run['run_at'][:10]}", "",
             "## Executive summary", "",
             f"**What this is.** A once-a-day look at {board}'s public job board. It compares every posting that is new since the last "
             f"look against a résumé and keeps only the ones that mention the same skills, titles, or location. Nothing is applied for, "
             f"nothing is sent anywhere.", "",
             f"**Why read it.** It is the shortest honest list of what is new and plausibly relevant at {board} today, with the reason each "
             f"item is on it. The decision — whether any of these is worth a day of your life — is yours and has not been made for you.", "",
             f"**What it found.** {found}", "",
             "**What it did not do.** It did not judge fit. Every item below is a word-for-word match between the résumé and the posting; "
             "a high score means many words matched, not that the job is good for you. Read the posting before deciding anything.", "",
             "---", "", "## Run record", "",
             "| Seen | New since last check | Relevant | Skipped |", "|---:|---:|---:|---:|",
             f"| {run['jobs_seen']} | {run['jobs_new']} | {len(relevant_rows)} | {len(skipped_rows)} |", "",
             f"Scheme `{scheme[SCHEME_VERSION_KEY]}` · threshold {scheme['threshold']} · every verdict below is a "
             f"record-based rule match (no model judgment). State: `{run['state_path']}` · raw: `{run['raw_response_path']}`", ""]
    if run["baseline"]:
        lines += ["**Baseline run.** Every job id on the board was recorded; nothing is reported as new. Run again later.", ""]
    elif not relevant_rows:
        lines += ["No new job cleared the scheme. That is a successful outcome; a healthy run skips most of what it sees.", ""]
    for r in relevant_rows:
        lines += [f"## {r['title']} — {r['location']}", f"{r['url']}  ", f"score {r['score']:.1f} · first published {r['first_published'] or '?'}", "",
                  "Why it is here:"] + [f"- {w}" for w in r["justification"]] + [""]
    if skipped_rows:
        lines += ["## Skipped (new, not relevant)", "", "| Title | Location | Reason |", "|---|---|---|"]
        lines += [f"| {s['title']} | {s['location']} | {s['reason']} |" for s in skipped_rows]
        lines.append("")
    with open(mpath, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    return jpath, mpath


def main(argv=None):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--board", required=True, help="board slug, e.g. airbnb (Greenhouse) or writer / 'Jasper AI' (Ashby)")
    ap.add_argument("--ats", default="greenhouse", choices=ATS_CHOICES, help="which ATS the board lives on (default greenhouse)")
    ap.add_argument("--resume", required=True, help="resume JSON in the resume.example.json shape")
    ap.add_argument("--state", required=True, help="state file (seen ids); created on the baseline run")
    ap.add_argument("--out", required=True, help="output folder for raw response, run record, report")
    ap.add_argument("--scheme", default=DEFAULT_SCHEME, help="matching scheme JSON (default: the skill's scheme.default.json)")
    ap.add_argument("--fixture", help="use this saved API response instead of fetching (offline / tests)")
    ap.add_argument("--dry-run", action="store_true", help="report but do not write the state file")
    a = ap.parse_args(argv)

    try:
        resume = load_resume(a.resume)
        scheme = load_scheme(a.scheme)
        state = load_state(a.state)
        url = board_url(a.board, ats=a.ats)
        run_at = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
        if a.fixture:
            with open(a.fixture, encoding="utf-8") as f:
                payload = json.load(f)
            source = f"fixture:{a.fixture}"
        else:
            try:
                payload = fetch_smartrecruiters(url) if a.ats == "smartrecruiters" else fetch_board(url)
            except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError) as e:
                print(f"FETCH FAILED for {url}: {e} — state file untouched", file=sys.stderr)
                return 3
            source = url
    except InputError as e:
        print(f"INPUT ERROR: {e}", file=sys.stderr)
        return 2

    jobs = payload.get("jobs") if isinstance(payload, dict) else None
    if not isinstance(jobs, list):
        print("FETCH FAILED: response has no `jobs` list — state file untouched", file=sys.stderr)
        return 3
    jobs = normalize_jobs(jobs, a.ats)

    os.makedirs(a.out, exist_ok=True)
    raw_path = os.path.join(a.out, f"raw-{run_at[:19].replace(':', '-')}.json")
    n = 0
    while os.path.exists(raw_path):
        n += 1; raw_path = os.path.join(a.out, f"raw-{run_at[:19].replace(':', '-')}-{n}.json")
    with open(raw_path, "w", encoding="utf-8") as f:
        json.dump(payload, f)

    ids_now = [str(j.get("id")) for j in jobs if j.get("id") is not None]
    baseline = state is None
    seen = set() if baseline else set(state["seen_ids"])
    new_jobs = [] if baseline else [j for j in jobs if str(j.get("id")) not in seen]

    feats = resume_features(resume)
    relevant_rows, skipped_rows = [], []
    for j in new_jobs:
        ok, score, why, reason = judge(j, feats, scheme)
        row = {"id": j.get("id"), "title": j.get("title"), "location": (j.get("location") or {}).get("name"),
               "url": j.get("absolute_url"), "first_published": j.get("first_published"), "score": round(score, 2)}
        if ok:
            relevant_rows.append({**row, "justification": why, "verdict_kind": "record-based rule"})
        else:
            skipped_rows.append({**row, "reason": reason})

    run = {"workflow": "greenhouse-watch", "board": a.board, "ats": a.ats, "source": source, "run_at": run_at, "baseline": baseline,
           "last_run_at": None if baseline else state.get("last_run_at"), "jobs_seen": len(ids_now),
           "jobs_new": len(new_jobs), "jobs_relevant": len(relevant_rows), "jobs_skipped": len(skipped_rows),
           SCHEME_VERSION_KEY: scheme[SCHEME_VERSION_KEY], "resume_path": a.resume, "state_path": a.state,
           "raw_response_path": raw_path, "dry_run": a.dry_run, "gate": "human: decide which relevant job, if any, is worth applying to"}
    jpath, mpath = write_outputs(a.out, run, relevant_rows, skipped_rows, scheme)

    if not a.dry_run:
        with open(a.state, "w", encoding="utf-8") as f:
            json.dump({"board": a.board, "last_run_at": run_at, "seen_ids": sorted(seen | set(ids_now))}, f, indent=1)

    print(f"{'BASELINE' if baseline else 'RUN'} {a.board}: seen={len(ids_now)} new={len(new_jobs)} "
          f"relevant={len(relevant_rows)} skipped={len(skipped_rows)}")
    print(f"  report : {mpath}\n  record : {jpath}\n  state  : {a.state}{' (not written: --dry-run)' if a.dry_run else ''}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
