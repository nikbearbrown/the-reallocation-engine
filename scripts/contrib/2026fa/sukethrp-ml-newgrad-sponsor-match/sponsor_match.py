#!/usr/bin/env python3
"""sponsor_match.py — role-level sponsor match for new-grad ML/AI engineers on F-1.

Recipe: recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md

The question: has this company's H-1B record included ML/AI job titles below
senior level, or does it only "sponsor someone"? For every role in a queue the
script checks the evidence in a fixed order and stops at the first gate that
fails:

    company match → sponsorship record → timeline factor → posting liveness

Roles that clear every gate go to the engine's existing scorer
(scripts/score/role-scorer.mjs, run through its CLI and never re-implemented).
A role that stops at a gate is HELD for a person with the reason. It is never
scored with a guessed value.

Every value is labeled:
    record      read from a repo record: the sponsorship CSV, a live posting
                check, or a captured page snapshot
    your-input  declared by the person: the role queue, the title rules, the
                tier→p mapping, fit, timeline, and synthetic fixtures
A value computed from other values carries the weakest label among its inputs.
Nothing here calls a model, so no value is labeled 'model-judgment'.

Outputs (in --out-dir): sponsor-match-log.json (for agents),
sponsor-match-report.md (for the person), roles.json (the scorer's input) and
role-scores.json / role-scores.md (the scorer's own output).

Run from the repo root:
    python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py
    python3 scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/sponsor_match.py \\
        --roles <queue.json> --out-dir <dir> [--live]

Exit codes: 0 run complete (held roles are not failures) · 1 run void (the
scorer failed or broke its contract) · 2 stopped at the source or input gate.
"""
from __future__ import annotations

import argparse
import ast
import csv
import datetime as dt
import hashlib
import importlib.util
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]  # scripts/contrib/2026fa/<this folder>/ → repo root
WORKFLOW = "sukethrp-ml-newgrad-sponsor-match"
RECIPE = "recipes/cases/2026fa/sukethrp-ml-newgrad-sponsor-match.md"
RECIPE_VERSION = "0.1.0"
DEFAULT_ROLES = HERE / "fixtures" / "sample-roles.json"
DEFAULT_RULES = HERE / "rules.json"
SCORER = REPO / "scripts" / "score" / "role-scorer.mjs"
LIVENESS_CLI = REPO / "scripts" / "ats" / "check-liveness.mjs"
NORMALIZER = REPO / "scripts" / "sec" / "entity-resolution.py"
NODE_BRIDGE = HERE / "node_bridge.mjs"

# Only these columns ever leave the CSV. The file also holds phone numbers and
# executive / director names; those are never read into any output.
KEEP_COLUMNS = ["company_name", "industry", "city", "state", "website",
                "Total Approvals", "Total Denials", "Approval_Rate",
                "median_salary_offered", "top_job_titles_sponsored"]
H1B_COLUMNS = ["Total Approvals", "Total Denials", "Approval_Rate",
               "median_salary_offered", "top_job_titles_sponsored"]
# Inside the repo the script writes only here. Outside the repo (a test's temp
# folder) is allowed. Runs under output/ are gitignored scratch and may be overwritten.
WRITABLE_PREFIXES = ["output/", "course/2026fa/submissions/sukethrp/",
                     "scripts/contrib/2026fa/sukethrp-ml-newgrad-sponsor-match/"]

REC, YOU = "record", "your-input"

HOLD_CHECKS = {
    "no-company-match": "The company name on the posting matched no company in the sponsorship file "
                        "exactly. The file uses legal names (for example '… INC'). Find the legal name, "
                        "then add the matching row number as `csv_row` in the queue. Otherwise, accept "
                        "that the file does not cover this company.",
    "ambiguous-company-match": "Several companies in the file share this name. Pick the right one from "
                               "the candidates listed, and add its row number as `csv_row` in the queue.",
    "csv-row-not-found": "The `csv_row` given in the queue does not exist in the file. Check the number.",
    "no-h1b-record": "The company is in the file but has no H-1B record there. That is Unknown, not "
                     "'does not sponsor': the join behind the file can miss companies. Check public "
                     "H-1B / LCA records or ask the recruiter before spending effort.",
    "no-approvals-on-record": "The H-1B record shows zero approvals. Read the record yourself before "
                              "deciding; the recipe will not call it either way.",
    "shared-h1b-record": "This company's H-1B record appears, value for value, on another company in the "
                         "file under a different name. The join behind the file can copy one employer's "
                         "history onto a lookalike, so this record may not be this company's. Check public "
                         "H-1B / LCA records for this employer. If the record really is theirs, add "
                         "`shared_record_checked` with your reason to the queue.",
    "unparseable-sponsored-titles": "The file's sponsored-title list for this company could not be "
                                    "read, so the role-level check cannot run. Read the row yourself.",
    "no-timeline-factor": "No timeline factor was given. This recipe does not compute one. State your "
                          "own factor between 0 and 1, and the reason for it, in the queue.",
    "liveness-unchecked": "The posting was never checked. Run the recipe with --live, or open the "
                          "posting yourself and record what you saw.",
    "liveness-uncertain": "The liveness check could not tell whether the posting is open (the page had "
                          "content but no apply control). Open it yourself.",
    "stale-liveness": "The posting check is older than the allowed age. Re-check it before applying.",
    "liveness-date-after-run-date": "The posting check is dated after this run's date. Fix the date.",
    "host-not-allowed": "Live mode only fetches job-board hosts this recipe names. Open this posting "
                        "yourself, or add the host to the rules and the recipe first.",
    "liveness-check-failed": "The live check did not return a result for this posting. See the "
                             "liveness output in the log.",
}


class Stop(Exception):
    """A run-level gate failed. code 2 = source or input gate; code 1 = run void."""

    def __init__(self, gate: str, message: str, code: int = 2):
        super().__init__(message)
        self.gate = gate
        self.code = code


# ── small helpers ────────────────────────────────────────────────────────────

def lab(value, source, **extra):
    """One labeled value: {value, source, ...provenance}."""
    return {"value": value, "source": source, **extra}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            digest.update(chunk)
    return digest.hexdigest()


def repo_path(p: str | Path) -> Path:
    """Paths written in the queue are relative to the repo root."""
    p = Path(p)
    return p if p.is_absolute() else REPO / p


def show(p: Path) -> str:
    """Display a path relative to the repo when it is inside it."""
    try:
        return Path(p).resolve().relative_to(REPO).as_posix()
    except ValueError:
        return str(p)


def number(text: str):
    try:
        value = float(text)
    except (TypeError, ValueError):
        return None
    if value != value:  # NaN
        return None
    return int(value) if value.is_integer() else value


def parse_day(text: str) -> dt.date:
    return dt.date.fromisoformat(str(text)[:10])


def weakest(*labels: str) -> str:
    return YOU if YOU in labels else REC


# ── reuse: the engine's own code, not copies of it ──────────────────────────

def load_normalizer():
    """normalize_company_name from scripts/sec/entity-resolution.py, the engine's join rule."""
    spec = importlib.util.spec_from_file_location("entity_resolution", NORMALIZER)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.normalize_company_name


def node(args: list[str], stdin: str | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(["node", *args], input=stdin, capture_output=True, text=True, cwd=REPO)


def read_yaml(path: Path) -> dict:
    proc = node([str(NODE_BRIDGE), "yaml", str(path)])
    if proc.returncode != 0:
        raise Stop("input", f"could not read {show(path)}: {proc.stderr.strip()}")
    return json.loads(proc.stdout)


def classify_snapshots(snapshots: list[dict]) -> list[dict]:
    """scripts/ats/liveness-core.mjs classifyLiveness on saved pages (offline)."""
    proc = node([str(NODE_BRIDGE), "liveness"], stdin=json.dumps(snapshots))
    if proc.returncode != 0:
        raise Stop("liveness", f"liveness classifier failed: {proc.stderr.strip()}", code=1)
    return json.loads(proc.stdout)


def check_live(urls: list[str]) -> tuple[subprocess.CompletedProcess, dict]:
    """scripts/ats/check-liveness.mjs (Playwright) on real postings. Network."""
    if os.environ.get("SPONSOR_MATCH_FORBID_NETWORK"):
        raise Stop("liveness", "a live check was attempted while SPONSOR_MATCH_FORBID_NETWORK is set", code=1)
    proc = node([str(LIVENESS_CLI), *urls])
    found, lines = {}, proc.stdout.splitlines()
    for i, line in enumerate(lines):
        m = re.match(r"^\S+\s+(active|expired|uncertain)\s+(\S+)\s*$", line)
        if not m:
            continue
        result, url = m.groups()
        reason = ""
        if result != "active" and i + 1 < len(lines) and lines[i + 1].startswith(" "):
            reason = lines[i + 1].strip()
        found[url] = {"result": result, "reason": reason}
    return proc, found


def run_scorer(roles_path: Path, out_dir: Path, profile: Path | None) -> subprocess.CompletedProcess:
    cmd = ["node", str(SCORER), str(roles_path), "--out-dir", str(out_dir)]
    if profile:
        cmd += ["--profile", str(profile)]
    return subprocess.run(cmd, capture_output=True, text=True, cwd=REPO)


# ── inputs and the input gate ───────────────────────────────────────────────

def load_rules(path: Path) -> dict:
    rules = json.loads(path.read_text(encoding="utf-8"))
    rules["_family"] = [re.compile(p, re.I) for p in rules["role_family"]["include_patterns"]]
    rules["_exclude"] = [re.compile(p, re.I) for p in rules["role_family"].get("exclude_patterns", [])]
    rules["_senior"] = [re.compile(p, re.I) for p in rules["senior_markers"]]
    rules["_level"] = [re.compile(p, re.I) for p in rules.get("level_markers", [])]
    rules["_sha256"] = sha256_file(path)
    return rules


def unit(value) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and 0 <= value <= 1


def load_queue(path: Path) -> dict:
    try:
        queue = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise Stop("input", f"cannot read the role queue {show(path)}: {exc}")
    problems = []
    roles = queue.get("roles")
    if not isinstance(roles, list) or not roles:
        problems.append("`roles` must be a non-empty list")
        roles = []
    try:
        parse_day(queue.get("as_of", ""))
    except ValueError:
        problems.append("`as_of` must be a date (YYYY-MM-DD)")
    seen = set()
    for i, role in enumerate(roles):
        where = f"roles[{i}]"
        for key in ("role_id", "company", "title", "url"):
            if not isinstance(role.get(key), str) or not role[key].strip():
                problems.append(f"{where}.{key} is required")
        if role.get("role_id") in seen:
            problems.append(f"{where}.role_id {role['role_id']!r} is duplicated")
        seen.add(role.get("role_id"))
        if "fit" in role and not (isinstance(role["fit"], dict) and unit(role["fit"].get("p"))
                                  and str(role["fit"].get("reason", "")).strip()):
            problems.append(f"{where}.fit needs p between 0 and 1 and a reason")
        if "timeline" in role and not (isinstance(role["timeline"], dict) and unit(role["timeline"].get("factor"))
                                       and str(role["timeline"].get("reason", "")).strip()):
            problems.append(f"{where}.timeline needs factor between 0 and 1 and a reason")
        if "csv_row" in role and (not isinstance(role["csv_row"], int) or role["csv_row"] < 1):
            problems.append(f"{where}.csv_row must be a positive row number")
        if "override" in role and role["override"].get("decision") not in ("Apply", "Consider", "Skip"):
            problems.append(f"{where}.override.decision must be Apply, Consider or Skip")
        if "shared_record_checked" in role and not str(role["shared_record_checked"]).strip():
            problems.append(f"{where}.shared_record_checked must say what you checked")
    if problems:
        raise Stop("input", "the role queue failed the input gate:\n  - " + "\n  - ".join(problems))
    return queue


def load_persona(path: Path) -> dict:
    try:
        inside = path.resolve().relative_to(REPO).as_posix()
    except ValueError:
        inside = None
    if inside is not None and not inside.startswith("search/examples/"):
        raise Stop("input", f"persona {inside} is not a fictional persona under search/examples/. "
                            "This prototype never reads real profiles.")
    if not path.exists():
        raise Stop("input", f"persona file not found: {show(path)}")
    persona = read_yaml(path)
    if persona.get("needs_sponsorship") is not True:
        raise Stop("input", "the persona must state `needs_sponsorship: true` explicitly. This recipe is "
                            "for people who need sponsorship, and free-text visa status is not trusted "
                            "(the scorer misreads 'work authorized' as 'no sponsorship needed').")
    return persona


# ── the sponsorship file and the source gate ────────────────────────────────

def source_gate(csv_path: Path, expected: str) -> str:
    if not csv_path.exists():
        raise Stop("source", f"sponsorship file not found: {show(csv_path)}")
    actual = sha256_file(csv_path)
    if actual != expected:
        raise Stop("source", f"{show(csv_path)} has SHA-256 {actual}, not the pinned {expected}. "
                             "The audits no longer describe this file. Read its audit, then pin the new "
                             "hash on purpose (--csv-sha256) if you accept it.")
    return actual


def h1b_signature(row: dict) -> tuple:
    return tuple(row[c] for c in H1B_COLUMNS)


def load_sponsorship(csv_path: Path, normalize) -> tuple[dict, dict, int]:
    """index: normalized name → rows; by_row: row → kept columns plus '_key' (normalized
    name) and '_shared_with' (other rows carrying the identical H-1B record)."""
    index, by_row, by_record = {}, {}, {}
    with open(csv_path, newline="", encoding="utf-8") as fh:
        reader = csv.DictReader(fh)
        missing = [c for c in KEEP_COLUMNS if c not in (reader.fieldnames or [])]
        if missing:
            raise Stop("source", f"{show(csv_path)} is missing columns {missing}")
        n = 0
        for n, row in enumerate(reader, start=1):
            kept = {c: (row.get(c) or "").strip() for c in KEEP_COLUMNS}
            kept["_key"] = normalize(kept["company_name"])
            by_row[n] = kept
            index.setdefault(kept["_key"], []).append(n)
            if kept["Total Approvals"]:
                by_record.setdefault(h1b_signature(kept), []).append(n)
    for rows in by_record.values():
        for r in rows:
            by_row[r]["_shared_with"] = [x for x in rows if x != r]
    return index, by_row, n


def lookalikes(row_no: int, by_row: dict) -> list[dict]:
    """Other companies, under a different name, that carry this row's H-1B record value for value.
    The file's join can copy one employer's history onto a lookalike (for example two
    similarly named biotechs), so a shared record may not belong to this company."""
    row = by_row[row_no]
    return [{"csv_row": n, "company_name": by_row[n]["company_name"], "city": by_row[n]["city"],
             "state": by_row[n]["state"]}
            for n in row.get("_shared_with", []) if by_row[n]["_key"] != row["_key"]]


# ── the role-level check (the new signal) ───────────────────────────────────

def classify_title(title: str, rules: dict) -> dict:
    """ML/AI family = an include pattern matches and no exclude pattern does.
    'unmarked' = in the family with no seniority and no level marker: the closest
    the record gets to 'entry level'. No marker is still not proof of a junior hire."""
    family = [p.pattern for p in rules["_family"] if p.search(title)]
    excluded = [p.pattern for p in rules["_exclude"] if p.search(title)] if family else []
    senior = [p.pattern for p in rules["_senior"] if p.search(title)]
    level = [p.pattern for p in rules["_level"] if p.search(title)]
    in_family = bool(family) and not excluded
    return {"title": title, "role_family": in_family, "senior_marked": bool(senior), "level_marked": bool(level),
            "unmarked": in_family and not senior and not level,
            "family_patterns": family, "excluded_by": excluded, "senior_patterns": senior, "level_patterns": level}


def sponsorship_evidence(row: dict, rules: dict):
    """(evidence, None) or (None, hold_reason). Never returns a guessed tier."""
    if not any(row[c] for c in H1B_COLUMNS):
        return None, "no-h1b-record"
    approvals = number(row["Total Approvals"])
    if approvals is None or approvals <= 0:
        return None, "no-approvals-on-record"
    try:
        titles = ast.literal_eval(row["top_job_titles_sponsored"])
        if not isinstance(titles, (list, tuple)):
            raise ValueError("not a list")
    except (ValueError, SyntaxError):
        return None, "unparseable-sponsored-titles"
    titles = [str(t).strip() for t in titles]
    classified = [classify_title(t, rules) for t in titles]
    family = [c["title"] for c in classified if c["role_family"]]
    unmarked = [c["title"] for c in classified if c["unmarked"]]
    floor = rules["tiers"]["proven_min_approvals"]
    if unmarked and approvals >= floor:
        tier, why = "Proven", (f"{len(unmarked)} sponsored ML/AI title(s) with no seniority or level marker, "
                               f"and {approvals} approvals (at least {floor})")
        gap = None
    elif unmarked:
        tier, why = "Likely", (f"ML/AI title(s) with no seniority or level marker, but only {approvals} "
                               f"approvals in total (fewer than {floor})")
        gap = "thin-record"
    elif family:
        tier, why, gap = ("Likely", "every sponsored ML/AI title carries a seniority or level marker",
                          "marked-only")
    else:
        tier, why, gap = "Likely", "no ML/AI title among the listed sponsored titles", "no-role-family-title"
    return {
        "approvals": lab(approvals, REC, column="Total Approvals"),
        "denials": lab(number(row["Total Denials"]), REC, column="Total Denials"),
        "approval_rate_pct": lab(number(row["Approval_Rate"]), REC, column="Approval_Rate"),
        "median_salary_offered_company": lab(number(row["median_salary_offered"]), REC,
                                             column="median_salary_offered",
                                             note="company-wide median across its sponsored filings, not per title"),
        "sponsored_titles": lab(titles, REC, column="top_job_titles_sponsored",
                                note="a short 'top titles' list, not every title the company sponsored"),
        "title_checks": lab(classified, YOU, derived_from="sponsored_titles + the declared title rules"),
        "ml_titles": lab(family, YOU, derived_from="title_checks"),
        "ml_titles_unmarked": lab(unmarked, YOU, derived_from="title_checks"),
        "tier": lab(tier, YOU, rule=why, gap=gap,
                    derived_from="approvals + ml_titles_unmarked + tiers.proven_min_approvals"),
        "p": lab(rules["tiers"]["p"][tier], YOU, mapping=f"tiers.p.{tier}", reason=rules["tiers"]["p_reason"]),
    }, None


# ── per-role gates ───────────────────────────────────────────────────────────

def hold(result: dict, gate: str, reason: str, **detail) -> dict:
    result["gates"].append({"gate": gate, "result": "hold", "reason": reason, **detail})
    result["status"], result["hold_reason"] = "held", reason
    return result


def evaluate_role(role: dict, index: dict, by_row: dict, normalize, rules: dict) -> dict:
    """Company match → sponsorship record → timeline. Liveness comes after, in a batch."""
    r = {"role_id": role["role_id"],
         "company_on_posting": lab(role["company"], YOU),
         "title": lab(role["title"], YOU),
         "url": lab(role["url"], YOU),
         "gates": [], "status": "pending", "hold_reason": None, "flags": []}

    # Gate: company match (exact normalized name, or a row a person chose)
    if "csv_row" in role:
        row_no = role["csv_row"]
        if row_no not in by_row:
            return hold(r, "company-match", "csv-row-not-found", csv_row=row_no)
        match_source = YOU
        how = "row chosen by the person (csv_row in the queue)"
    else:
        key = normalize(role["company"])
        candidates = index.get(key, [])
        if not candidates:
            return hold(r, "company-match", "no-company-match", normalized=key)
        if len(candidates) > 1:
            return hold(r, "company-match", "ambiguous-company-match", normalized=key,
                        candidates=[{"csv_row": n, "company_name": by_row[n]["company_name"],
                                     "city": by_row[n]["city"], "state": by_row[n]["state"],
                                     "website": by_row[n]["website"]} for n in candidates])
        row_no, match_source, how = candidates[0], REC, f"exact normalized name '{key}'"
    row = by_row[row_no]
    r["company_match"] = lab(row["company_name"], match_source, csv_row=row_no, how=how,
                             city=row["city"], state=row["state"], website=row["website"],
                             industry=row["industry"])
    r["gates"].append({"gate": "company-match", "result": "pass", "csv_row": row_no})

    # Gate: sponsorship record (Unknown is held, never scored as a non-sponsor)
    evidence, reason = sponsorship_evidence(row, rules)
    if reason:
        r["sponsorship"] = {"tier": lab("Unknown", YOU, rule="no usable H-1B record; Unknown is not Avoid")}
        return hold(r, "sponsorship-record", reason, csv_row=row_no)
    others = lookalikes(row_no, by_row)
    vouched = None
    if others:
        if not role.get("shared_record_checked"):
            r["sponsorship"] = {"tier": lab("Unknown", YOU, rule="the H-1B record is shared with a differently "
                                                                  "named company, so it may not be this one's")}
            return hold(r, "sponsorship-record", "shared-h1b-record", csv_row=row_no, shared_with=others)
        vouched = f"record also on {len(others)} other company(ies); the person checked: {role['shared_record_checked']}"
    if match_source == YOU or vouched:  # a person vouched: everything read through it is only as good as that call
        why = "read through a row the person chose" if match_source == YOU else vouched
        for k in ("approvals", "denials", "approval_rate_pct", "median_salary_offered_company", "sponsored_titles"):
            evidence[k]["source"] = YOU
            evidence[k]["note"] = (evidence[k].get("note", "") + " · " + why).strip(" ·")
    r["sponsorship"] = evidence
    r["gates"].append({"gate": "sponsorship-record", "result": "pass", "tier": evidence["tier"]["value"]})

    # Gate: timeline (this recipe never computes it, and never lets it default to open)
    if "timeline" not in role:
        return hold(r, "timeline", "no-timeline-factor")
    r["timeline"] = lab(role["timeline"]["factor"], YOU, reason=role["timeline"]["reason"])
    r["gates"].append({"gate": "timeline", "result": "pass", "factor": role["timeline"]["factor"]})

    # Votes that are not gates
    if "fit" in role:
        r["fit"] = lab(role["fit"]["p"], YOU, reason=role["fit"]["reason"])
    else:
        r["flags"].append("fit not rated: the scorer drops the fit vote, which lowers the composite")
    if "override" in role:
        r["override"] = lab(role["override"], YOU)
    return r


def liveness_stage(pending: list[tuple[dict, dict]], rules: dict, as_of: dt.date, live: bool) -> dict:
    """Fill the liveness gate for every role still pending. Returns a record of what ran."""
    max_age = rules["liveness"]["max_age_days"]
    ran = {"mode": "live" if live else "offline", "classified_snapshots": 0, "live_urls": []}

    def settle(r: dict, result: str, source: str, checked: dt.date | None, **detail) -> None:
        if checked is not None:
            age = (as_of - checked).days
            if age < 0:
                hold(r, "liveness", "liveness-date-after-run-date", checked=str(checked))
                return
            if age > max_age:
                hold(r, "liveness", "stale-liveness", checked=str(checked), age_days=age, max_age_days=max_age)
                return
        if result == "uncertain":
            r["liveness"] = lab(result, source, **detail)
            hold(r, "liveness", "liveness-uncertain", **detail)
            return
        r["liveness"] = lab(result, source, factor=1.0 if result == "active" else 0.0,
                            checked=str(checked) if checked else None, **detail)
        r["gates"].append({"gate": "liveness", "result": "pass" if result == "active" else "closed",
                           "liveness": result})
        r["status"] = "ready"

    if live:
        allowed = set(rules["liveness"]["live_hosts"])
        to_check = []
        for role, r in pending:
            parsed = urlparse(role["url"])
            if parsed.scheme != "https" or parsed.hostname not in allowed:
                hold(r, "liveness", "host-not-allowed", host=parsed.hostname)
            else:
                to_check.append((role, r))
        if to_check:
            urls = [role["url"] for role, _ in to_check]
            ran["live_urls"] = urls
            proc, found = check_live(urls)
            ran.update(command=f"node {show(LIVENESS_CLI)} " + " ".join(urls), exit_code=proc.returncode,
                       stdout=proc.stdout, stderr=proc.stderr)
            checked_at = dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat()
            for role, r in to_check:
                hit = found.get(role["url"])
                if not hit:
                    hold(r, "liveness", "liveness-check-failed")
                    continue
                settle(r, hit["result"], REC, as_of, why=hit["reason"], checked_at=checked_at,
                       method="npm run ats:liveness (scripts/ats/check-liveness.mjs)")
        return ran

    snapshots, waiting = [], []
    for role, r in pending:
        given = role.get("liveness")
        if not given:
            hold(r, "liveness", "liveness-unchecked")
            continue
        if "snapshot" in given:
            snap_path = repo_path(given["snapshot"])
            snap = json.loads(snap_path.read_text(encoding="utf-8"))
            source = REC if snap.get("provenance") == "captured" else YOU
            snapshots.append({k: snap.get(k) for k in ("status", "finalUrl", "bodyText", "applyControls")})
            waiting.append((r, source, parse_day(snap["captured_at"]),
                            {"snapshot": show(snap_path), "provenance": snap.get("provenance")}))
        else:  # a result recorded from an earlier live check, with its saved terminal output as evidence
            evidence = repo_path(given.get("evidence", "")) if given.get("evidence") else None
            backed = bool(evidence and evidence.is_file() and
                          re.search(rf"\b{given['result']}\b\s+{re.escape(role['url'])}", evidence.read_text(encoding="utf-8")))
            settle(r, given["result"], REC if backed else YOU, parse_day(given["checked_at"]),
                   checked_at=given["checked_at"], method=given.get("method"),
                   evidence=show(evidence) if evidence else None, evidence_verified=backed)
    if snapshots:
        verdicts = classify_snapshots(snapshots)
        ran["classified_snapshots"] = len(verdicts)
        for (r, source, captured, detail), verdict in zip(waiting, verdicts):
            settle(r, verdict["result"], source, captured, code=verdict["code"],
                   why=verdict["reason"], classifier="scripts/ats/liveness-core.mjs classifyLiveness", **detail)
    return ran


# ── scoring and the scorer-contract gate ────────────────────────────────────

def scorer_role(r: dict) -> dict:
    s = {"role_id": r["role_id"], "company": r["company_match"]["value"], "title": r["title"]["value"],
         "sponsorship": {"p": r["sponsorship"]["p"]["value"], "tier": r["sponsorship"]["tier"]["value"],
                         "source": YOU},
         "liveness": {"factor": r["liveness"]["factor"], "source": r["liveness"]["source"]},
         "timeline": {"factor": r["timeline"]["value"], "source": YOU}}
    if "fit" in r:
        s["fit"] = {"p": r["fit"]["value"], "source": YOU}
    if "override" in r:
        s["override"] = r["override"]["value"]
    return s


def contract_problems(sent: list[dict], scored: dict) -> list[str]:
    problems = []
    if scored.get("profile_needs_sponsorship") is not True:
        problems.append("the scorer ran as if the persona does not need sponsorship "
                        f"(profile_needs_sponsorship = {scored.get('profile_needs_sponsorship')!r}), so the "
                        "sponsorship vote was weighted 0")
    by_id = {x.get("role_id"): x for x in scored.get("roles", [])}
    if set(by_id) != {s["role_id"] for s in sent}:
        problems.append("the scorer's roles do not match the roles sent")
    for s in sent:
        got = by_id.get(s["role_id"])
        if not got:
            continue
        want = {k: s[k]["source"] for k in ("sponsorship", "fit") if k in s}
        have = {v["factor"]: v["source"] for v in got["trace"]["votes"]}
        want.update({g: s[g]["source"] for g in ("liveness", "timeline")})
        have.update({g["factor"]: g["source"] for g in got["trace"]["gates"]})
        if any(have.get(k) != v for k, v in want.items()):
            problems.append(f"{s['role_id']}: labels changed inside the scorer ({have} vs sent {want})")
    return problems


# Which titles each question quotes: the ones that make the evidence soft.
QUESTIONS = {
    "marked-only": ("ml_titles", "Your company's public H-1B record lists these ML/AI titles: {titles}. All of "
                    "them carry a seniority or level marker. Has the team sponsored a new-grad ML/AI engineer, "
                    "or only experienced hires?"),
    "no-role-family-title": ("sponsored_titles", "Your company's public H-1B record lists these sponsored "
                             "titles: {titles}. None of them is an ML/AI role. Does the company sponsor ML/AI "
                             "engineers, and at the new-grad level?"),
    "thin-record": ("ml_titles_unmarked", "Your company's public H-1B record lists {titles}, from "
                    "{approvals} approval(s) in total. Is sponsoring a new-grad ML/AI hire something the "
                    "company still does?"),
}


def next_action(r: dict) -> dict:
    if r["status"] == "held":
        check = HOLD_CHECKS[r["hold_reason"]]
        gate = r["gates"][-1]
        if "company_match" in r:  # show what was matched, so a wrong-company match is visible
            m = r["company_match"]
            check = (f"Matched row {m['csv_row']}: {m['value']} ({m['city']}, {m['state']}). First check "
                     "that this is the employer on the posting. " + check)
        if gate.get("candidates"):
            check += " Candidates: " + "; ".join(f"row {c['csv_row']} {c['company_name']} ({c['city']}, {c['state']})"
                                                 for c in gate["candidates"]) + "."
        if gate.get("shared_with"):
            check += " Same record on: " + "; ".join(f"row {c['csv_row']} {c['company_name']} ({c['city']}, "
                                                     f"{c['state']})" for c in gate["shared_with"]) + "."
        return {"action": "RESOLVE", "why": f"held at the {gate['gate']} gate ({r['hold_reason']})", "check": check}
    rec = r["scorer"]["recommendation"]
    tier = r["sponsorship"]["tier"]
    override = r["scorer"].get("override") or {}
    if override.get("reason") and rec != r["scorer"]["machine_recommendation"]:
        action = {"Apply": "TAILOR", "Consider": "CONSIDER", "Skip": "SKIP"}[rec]
        return {"action": action, "why": f"your override of the scorer's {r['scorer']['machine_recommendation']}: "
                                         f"{override['reason']}",
                "check": "This decision rests on your own information, not on the record. Keep the reason current."}
    if rec == "Skip":
        return {"action": "SKIP", "why": r["scorer"]["reason"],
                "check": "No research or application time. Reallocate it."}
    if rec == "Apply":
        return {"action": "TAILOR", "why": "the record shows this company sponsoring an ML/AI title with no "
                                           "seniority or level marker, and every gate is open",
                "check": "Spend research-and-apply time here, and confirm sponsorship with the recruiter early."}
    if tier["value"] == "Likely":
        field, template = QUESTIONS[tier["gap"]]
        titles = ", ".join(f"'{t}'" for t in r["sponsorship"][field]["value"])
        question = template.format(titles=titles, approvals=r["sponsorship"]["approvals"]["value"])
        return {"action": "NETWORK-FIRST", "why": f"sponsorship evidence is soft: {tier['rule']}",
                "check": "Before applying, ask someone inside the company. A question to start from: " + question}
    soft = f" Your timeline factor ({r['timeline']['value']}) is the soft spot." if r["timeline"]["value"] < 0.6 else ""
    return {"action": "CONSIDER", "why": r["scorer"]["reason"],
            "check": "Apply only after the TAILOR list is done." + soft}


# ── outputs ──────────────────────────────────────────────────────────────────

def prepare_out_dir(out_dir: Path, overwrite: bool) -> Path:
    out = out_dir.resolve()
    try:
        inside = out.relative_to(REPO).as_posix() + "/"
    except ValueError:
        inside = None
    if inside is not None and not any(inside.startswith(p) for p in WRITABLE_PREFIXES):
        raise Stop("input", f"--out-dir {inside} is outside this contribution's folders "
                            f"({', '.join(WRITABLE_PREFIXES)})")
    scratch = inside is None or inside.startswith("output/")
    if out.exists() and any(out.iterdir()) and not (overwrite or scratch):
        raise Stop("input", f"{show(out)} already holds a run. Pass --overwrite, or choose a new folder.")
    out.mkdir(parents=True, exist_ok=True)
    return out


def md(text) -> str:
    return str(text).replace("|", "\\|").replace("\n", " ")


def render_report(log: dict) -> str:
    roles, s = log["roles"], log["summary"]
    acts = s["actions"]
    void = log["status"] == "void"
    sample = log["mode"] == "sample"
    o = [f"# Role-level sponsor match — {log['as_of']} ({log['mode']} mode)", ""]
    o += ["## Executive summary", ""]
    if void:
        o += ["**This run is VOID.** The engine's scorer did not keep its side of the contract, so no",
              "decision below can be trusted. What went wrong: " + "; ".join(log["stop"]["problems"]) + ".", ""]
    o += [f"This report checks {s['evaluated']} job postings from one job-search queue against the public "
          "H-1B sponsorship record. For each company, the question is whether the record includes an ML/AI "
          "job title with no seniority or level marker (the closest the record gets to 'entry level'), not "
          "merely whether the company has ever sponsored anyone. Read it before spending application or "
          "networking time on any of these roles.", ""]
    if sample:
        o += ["*Sample mode: the postings and page snapshots in this queue are illustrative fixtures. The "
              "sponsorship evidence is read from the real sponsorship file.*", ""]
    if not void:
        o += [f"**What it found.** {s['role_level_evidence']} of {s['evaluated']} postings come from a company "
              "whose record includes an ML/AI title with no seniority or level marker. "
              f"Suggested use of time: tailor an application for {acts.get('TAILOR', 0)}, "
              f"network first at {acts.get('NETWORK-FIRST', 0)}, consider {acts.get('CONSIDER', 0)}, "
              f"skip {acts.get('SKIP', 0)}, and resolve {acts.get('RESOLVE', 0)} before spending any effort, "
              "because their evidence could not be checked automatically. Nothing here is a decision. You "
              "make each one in the table at the end.", ""]
    o += ["## What to do next", ""]
    order = ["TAILOR", "NETWORK-FIRST", "CONSIDER", "SKIP", "RESOLVE"]
    titles = {"TAILOR": "Tailor an application", "NETWORK-FIRST": "Network first, then decide",
              "CONSIDER": "Consider after the tailor list", "SKIP": "Skip — reallocate the time",
              "RESOLVE": "Resolve before anything else (held for a person)"}
    for action in order:
        group = [r for r in roles if r.get("next_action", {}).get("action") == action]
        if not group:
            continue
        o += [f"### {titles[action]} ({len(group)})", ""]
        for r in group:
            na = r["next_action"]
            o.append(f"- **{md(r['company_on_posting']['value'])} — {md(r['title']['value'])}**: {md(na['why'])}. "
                     f"{md(na['check'])}")
        o.append("")
    o += ["## Evidence per posting", "",
          "Labels: **[record]** read from a record · **[your-input]** declared by you (the queue, the title "
          "rules, the tier-to-number mapping, fit, timeline, fixtures). No AI model is called anywhere in this run.", "",
          "| Posting | Sponsorship record | Role-level check | Gates | Scorer |", "|---|---|---|---|---|"]
    for r in roles:
        sp = r.get("sponsorship", {})
        if "approvals" in sp:
            record = (f"{sp['approvals']['value']} approvals, {sp['denials']['value']} denials "
                      f"[{sp['approvals']['source']}]; titles: "
                      + "; ".join(md(t) for t in sp["sponsored_titles"]["value"])
                      + f" [{sp['sponsored_titles']['source']}]")
            check = (f"tier **{sp['tier']['value']}** [{sp['tier']['source']}]: {md(sp['tier']['rule'])}; "
                     f"p {sp['p']['value']} [{sp['p']['source']}]")
        else:
            record = "—" if "company_match" not in r else "no usable H-1B record in the file"
            check = f"tier {sp['tier']['value']} (held)" if sp else "not reached"
        gates = "; ".join(f"{g['gate']}: {g['result']}" + (f" ({g['reason']})" if g.get("reason") else "")
                          for g in r["gates"])
        if "liveness" in r:
            gates += f"; liveness {r['liveness']['value']} [{r['liveness']['source']}]"
        if "timeline" in r:
            gates += f"; timeline {r['timeline']['value']} [{r['timeline']['source']}]"
        scorer = "not scored (held)"
        if "scorer" in r:
            scorer = f"{r['scorer']['recommendation']} · composite {r['scorer']['composite']}"
            if "fit" in r:
                scorer += f" · fit {r['fit']['value']} [{r['fit']['source']}]"
        company = md(r["company_on_posting"]["value"])
        if "company_match" in r:
            company += f" → {md(r['company_match']['value'])} (row {r['company_match']['csv_row']}) [{r['company_match']['source']}]"
        o.append(f"| {company} — {md(r['title']['value'])} | {record} | {check} | {md(gates)} | {md(scorer)} |")
    o += ["", "## What this run could not verify", ""]
    o += [f"- {item}" for item in log["cannot_verify"]]
    o += ["", "## Your decision (the human gate)", "",
          "The recipe stops here. Before spending any effort, write your decision, your reason, your name "
          "and the date for each posting. A blank row means no decision has been made.", "",
          "| Posting | Suggested | Your decision | Your reason | Name | Date |", "|---|---|---|---|---|---|"]
    for r in roles:
        o.append(f"| {md(r['company_on_posting']['value'])} — {md(r['title']['value'])} | "
                 f"{r.get('next_action', {}).get('action', '—')} |  |  |  |  |")
    o += ["", "## Run record", "",
          f"- Recipe: `{RECIPE}` v{RECIPE_VERSION} · run `{log['run_id']}` · generated {log['generated_at']}",
          f"- Queue: `{log['inputs']['roles']['path']}` (sha256 `{log['inputs']['roles']['sha256'][:12]}…`) · "
          f"persona: `{log['inputs']['persona']['path']}` (fictional)",
          f"- Rules: `{log['inputs']['rules']['path']}` v{log['inputs']['rules']['version']} "
          f"(sha256 `{log['inputs']['rules']['sha256'][:12]}…`)",
          f"- Sponsorship file: `{log['source']['csv']}` · sha256 `{log['source']['sha256']}` "
          f"({'matches the pin' if log['source']['pinned'] else 'accepted by explicit --csv-sha256'})",
          f"- Liveness: {log['liveness_run']['mode']}; "
          f"{log['liveness_run'].get('classified_snapshots', 0)} snapshot(s) classified, "
          f"{len(log['liveness_run'].get('live_urls', []))} live check(s)",
          f"- Scorer: `{log['scorer'].get('command', 'not run')}` → exit {log['scorer'].get('exit_code', '—')}",
          f"- Counts: evaluated {s['evaluated']} · held {s['held']} · scored {s['scored']} "
          f"(Apply {s['apply']} · Consider {s['consider']} · Skip {s['skip']}) · skip rate "
          f"{s['skip_rate_of_scored']} of scored, {s['skip_rate_of_evaluated']} of evaluated. (The book's "
          "rule of thumb is that a healthy run skips at least half of what it evaluates. Held postings are "
          "neither skipped nor decided until a person resolves them.)",
          "- Agent log: `sponsor-match-log.json` beside this report", ""]
    return "\n".join(o)


CANNOT_VERIFY = [
    "When the sponsorship happened. The file has no filing years, so a matching title may be years old.",
    "Whether a title without a seniority word was an entry-level hire. No marker is not evidence of junior level.",
    "Titles beyond the file's short 'top titles' list. Many companies list a single title, so a missing "
    "ML/AI title is not proof that none was sponsored.",
    "Whether the company in the file is the employer on the posting. The join behind the file has no "
    "published error rate (see the join-validation audit).",
    "Whether this company will sponsor this role now. Policies, budgets and teams change.",
    "Anything about fit or timeline. Those numbers are your own ratings, not measurements.",
    "Legal eligibility (OPT, STEM OPT, cap-gap). That is a question for the school's DSO or an attorney.",
]


# ── rules audit: what the declared rules do to the whole file ───────────────

def audit_rules(args) -> int:
    """Count tiers over every company in the file and list every title the ML/AI
    patterns matched, so a person can judge the rules (an audit, not a verdict)."""
    rules = load_rules(Path(args.rules))
    csv_path = repo_path(args.csv or rules["source"]["csv"])
    if args.csv and not args.csv_sha256:
        raise Stop("source", "a non-default sponsorship file needs an explicit --csv-sha256: pin what you ran on")
    actual = source_gate(csv_path, args.csv_sha256 or rules["source"]["sha256"])
    out_dir = prepare_out_dir(Path(args.out_dir) if args.out_dir else REPO / "output" / WORKFLOW / "rules-audit",
                              args.overwrite)
    _, by_row, row_count = load_sponsorship(csv_path, load_normalizer())
    tiers, holds, titles = {}, {}, {}
    for row_no, row in by_row.items():
        evidence, reason = sponsorship_evidence(row, rules)
        if reason:
            holds[reason] = holds.get(reason, 0) + 1
            continue
        key = f"{evidence['tier']['value']} ({evidence['tier']['gap'] or 'role-level match'})"
        tiers[key] = tiers.get(key, 0) + 1
        for c in evidence["title_checks"]["value"]:
            if c["family_patterns"]:  # every title an include pattern touched, excluded ones too
                group = ("excluded" if c["excluded_by"] else "senior-marked" if c["senior_marked"]
                         else "level-marked" if c["level_marked"] else "unmarked")
                entry = titles.setdefault(c["title"], {"csv_rows": [], "group": group,
                                                       "matched_by": c["family_patterns"] + c["excluded_by"]
                                                       + c["senior_patterns"] + c["level_patterns"]})
                if row_no not in entry["csv_rows"]:
                    entry["csv_rows"].append(row_no)
    for entry in titles.values():
        entry["companies"] = len(entry["csv_rows"])
    shared = {n: lookalikes(n, by_row) for n in by_row if by_row[n]["Total Approvals"] and lookalikes(n, by_row)}
    result = {"workflow": WORKFLOW, "audit": "rules", "rules_version": rules["rules_version"],
              "rules_sha256": rules["_sha256"], "csv": show(csv_path), "csv_sha256": actual, "rows": row_count,
              "held": holds, "tiers": tiers, "ml_titles": dict(sorted(titles.items())),
              "records_shared_with_a_differently_named_company": {
                  str(n): {"company_name": by_row[n]["company_name"], "also_on": v} for n, v in shared.items()}}
    (out_dir / "rules-audit.json").write_text(json.dumps(result, indent=2) + "\n", encoding="utf-8")
    unmarked = {t: v for t, v in titles.items() if v["group"] == "unmarked"}
    o = [f"# Title-rules audit — rules v{rules['rules_version']}", "", "## Executive summary", "",
         "This audit shows what the declared title rules do to every company in the sponsorship file: how "
         "many companies land in each tier, and every sponsored title the rules counted as ML/AI. It is "
         "for a person to read before trusting the rules. It says what the rules found; it does not say "
         "the rules are right.", "",
         f"Of {row_count} companies, {sum(holds.values())} have no usable H-1B record, and "
         f"{sum(tiers.values())} were tiered. {len(unmarked)} distinct ML/AI titles carry no seniority or "
         "level marker, so they count as role-level evidence. Read that list first: any title in it that "
         "is not an ML/AI engineering job, or not an entry-level one, is a rule to fix.", "",
         "## Tiers", "", "| Tier | Companies |", "|---|---|"]
    o += [f"| {k} | {v} |" for k, v in sorted(tiers.items())]
    o += [f"| held: {k} | {v} |" for k, v in sorted(holds.items())]
    for heading, want in (("ML/AI titles with no seniority or level marker (these create Proven)", "unmarked"),
                          ("ML/AI titles with a level marker", "level-marked"),
                          ("ML/AI titles with a seniority marker", "senior-marked"),
                          ("Titles an ML/AI pattern touched but an exclusion removed", "excluded")):
        group = {t: v for t, v in titles.items() if v["group"] == want}
        o += ["", f"## {heading} — {len(group)}", "", "| Title | Companies | Matched by |", "|---|---|---|"]
        o += [f"| {md(t)} | {v['companies']} | {md(', '.join(v['matched_by']))} |" for t, v in sorted(group.items())]
    o += ["", f"## H-1B records shared with a differently named company — {len(shared)} companies", "",
          "Each of these companies carries an H-1B record that appears value for value on another company "
          "with a different normalized name. A run holds any role at these companies until a person checks "
          "whose record it is.", "", "| Row | Company | Same record on |", "|---|---|---|"]
    o += [f"| {n} | {md(by_row[n]['company_name'])} | "
          + md("; ".join(f"row {c['csv_row']} {c['company_name']} ({c['city']}, {c['state']})" for c in v)) + " |"
          for n, v in sorted(shared.items())]
    o += ["", "## Run record", "", f"- Rules: `{show(Path(args.rules))}` v{rules['rules_version']} "
          f"(sha256 `{rules['_sha256'][:12]}…`)", f"- Sponsorship file: `{show(csv_path)}` · sha256 `{actual}`", ""]
    (out_dir / "rules-audit.md").write_text("\n".join(o), encoding="utf-8")
    print(f"✓ rules audit: {row_count} rows · tiered {sum(tiers.values())} · held {sum(holds.values())} · "
          f"{len(unmarked)} ML/AI titles with no seniority or level marker")
    print(f"  {show(out_dir / 'rules-audit.md')}  +  {show(out_dir / 'rules-audit.json')}")
    return 0


# ── the run ──────────────────────────────────────────────────────────────────

def run(args) -> int:
    rules = load_rules(Path(args.rules))
    queue_path = Path(args.roles).resolve()
    queue = load_queue(queue_path)
    as_of = dt.datetime.now(dt.timezone.utc).date() if args.live else parse_day(queue["as_of"])
    persona_path = repo_path(args.persona or queue.get("persona", ""))
    persona = load_persona(persona_path)

    csv_path = repo_path(args.csv or rules["source"]["csv"])
    if args.csv and not args.csv_sha256:
        raise Stop("source", "a non-default sponsorship file needs an explicit --csv-sha256: pin what you ran on")
    expected = args.csv_sha256 or rules["source"]["sha256"]
    actual = source_gate(csv_path, expected)
    out_dir = prepare_out_dir(Path(args.out_dir) if args.out_dir else
                              REPO / "output" / WORKFLOW / f"{as_of}-{'live' if args.live else 'sample'}",
                              args.overwrite)

    normalize = load_normalizer()
    index, by_row, row_count = load_sponsorship(csv_path, normalize)

    results = [evaluate_role(role, index, by_row, normalize, rules) for role in queue["roles"]]
    pending = [(role, r) for role, r in zip(queue["roles"], results) if r["status"] == "pending"]
    liveness_run = liveness_stage(pending, rules, as_of, args.live)

    ready = [r for r in results if r["status"] == "ready"]
    sent = [scorer_role(r) for r in ready]
    run_id = f"{as_of}-{'live' if args.live else 'sample'}-{hashlib.sha256(queue_path.read_bytes()).hexdigest()[:8]}"
    log = {
        "workflow": WORKFLOW, "recipe": RECIPE, "recipe_version": RECIPE_VERSION, "run_id": run_id,
        "status": "complete", "mode": "live" if args.live else "sample", "as_of": str(as_of),
        "generated_at": dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat(),
        "labels": {"record": "read from a repo record", "your-input": "declared by the person",
                   "model-judgment": "not used: no model is called in this run"},
        "inputs": {
            "roles": {"path": show(queue_path), "sha256": sha256_file(queue_path)},
            "persona": {"path": show(persona_path), "needs_sponsorship": lab(True, YOU),
                        "name": persona.get("candidate", {}).get("name"),
                        "target_role": persona.get("target_role", {}).get("primary"),
                        "fictional": True},
            "rules": {"path": show(Path(args.rules)), "version": rules["rules_version"], "sha256": rules["_sha256"]},
        },
        "source": {"csv": show(csv_path), "sha256": actual, "pinned": actual == rules["source"]["sha256"],
                   "rows": row_count, "audit": rules["source"]["audit"],
                   "columns_read": KEEP_COLUMNS},
        "liveness_run": liveness_run,
        "scorer": {},
        "roles": results,
        "cannot_verify": list(CANNOT_VERIFY) + ([
            "The postings themselves (sample mode). The roles and page snapshots are illustrative fixtures."]
            if not args.live else []),
    }

    if sent:
        roles_json = out_dir / "roles.json"
        roles_json.write_text(json.dumps(sent, indent=2) + "\n", encoding="utf-8")
        proc = run_scorer(roles_json, out_dir, Path(args.scorer_profile) if args.scorer_profile else None)
        log["scorer"] = {"command": f"node {show(SCORER)} {show(roles_json)} --out-dir {show(out_dir)}"
                                    + (f" --profile {show(Path(args.scorer_profile))}" if args.scorer_profile else ""),
                         "exit_code": proc.returncode, "stdout": proc.stdout, "stderr": proc.stderr}
        problems = ["the scorer exited with a non-zero code"] if proc.returncode != 0 else []
        scored = {}
        if not problems:
            try:
                scored = json.loads((out_dir / "role-scores.json").read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError) as exc:
                problems.append(f"role-scores.json is unreadable: {exc}")
        problems = problems or contract_problems(sent, scored)
        if problems:
            log["status"] = "void"
            log["stop"] = {"gate": "scorer-contract", "problems": problems}
        else:
            by_id = {x["role_id"]: x for x in scored["roles"]}
            for r in ready:
                got = by_id[r["role_id"]]
                r["scorer"] = {k: got[k] for k in ("composite", "recommendation", "machine_recommendation",
                                                  "reason", "override", "trace")}
                r["scorer"]["source"] = YOU  # computed from your-input terms (weakest label)
    else:
        log["scorer"] = {"command": "not run: no role cleared every gate", "exit_code": None}

    if log["status"] != "void":
        for r in results:
            r["next_action"] = next_action(r)

    held = [r for r in results if r["status"] == "held"]
    recs = [r["scorer"]["recommendation"] for r in ready if "scorer" in r]
    actions = {}
    for r in results:
        if "next_action" in r:
            actions[r["next_action"]["action"]] = actions.get(r["next_action"]["action"], 0) + 1
    pct = lambda n, d: f"{round(100 * n / d)}%" if d else "n/a"
    log["summary"] = {
        "evaluated": len(results), "held": len(held), "scored": len(recs),
        "apply": recs.count("Apply"), "consider": recs.count("Consider"), "skip": recs.count("Skip"),
        "skip_rate_of_scored": pct(recs.count("Skip"), len(recs)),
        "skip_rate_of_evaluated": pct(recs.count("Skip"), len(results)),
        "held_by_reason": {k: sum(1 for r in held if r["hold_reason"] == k) for k in sorted({r["hold_reason"] for r in held})},
        "role_level_evidence": sum(1 for r in results
                                   if r.get("sponsorship", {}).get("tier", {}).get("value") == "Proven"),
        "actions": actions,
    }
    log["outputs"] = {"agent_log": show(out_dir / "sponsor-match-log.json"),
                      "human_report": show(out_dir / "sponsor-match-report.md"),
                      "scorer_input": show(out_dir / "roles.json") if sent else None,
                      "scorer_output": [show(out_dir / "role-scores.json"), show(out_dir / "role-scores.md")] if sent else []}
    (out_dir / "sponsor-match-log.json").write_text(json.dumps(log, indent=2) + "\n", encoding="utf-8")
    (out_dir / "sponsor-match-report.md").write_text(render_report(log), encoding="utf-8")

    s = log["summary"]
    print(f"{'VOID' if log['status'] == 'void' else '✓'} {s['evaluated']} roles → held {s['held']} · scored "
          f"{s['scored']} (Apply {s['apply']} · Consider {s['consider']} · Skip {s['skip']}) · actions "
          + ", ".join(f"{k} {v}" for k, v in sorted(actions.items())))
    print(f"  {show(out_dir / 'sponsor-match-report.md')}  +  {show(out_dir / 'sponsor-match-log.json')}")
    if log["status"] == "void":
        raise Stop("scorer-contract", "; ".join(log["stop"]["problems"]), code=1)
    return 0


def parse_args(argv=None):
    ap = argparse.ArgumentParser(description="Role-level sponsor match for new-grad ML/AI engineers on F-1.")
    ap.add_argument("--roles", default=str(DEFAULT_ROLES), help="role queue JSON (default: the sample fixture)")
    ap.add_argument("--rules", default=str(DEFAULT_RULES), help="declared title/tier rules (your-input)")
    ap.add_argument("--persona", help="fictional persona under search/examples/ (default: the queue's)")
    ap.add_argument("--out-dir", help="where to write outputs (default: output/<workflow>/<date>-<mode>/)")
    ap.add_argument("--overwrite", action="store_true", help="allow replacing an earlier run in --out-dir")
    ap.add_argument("--live", action="store_true", help="check posting liveness live (network, Playwright)")
    ap.add_argument("--csv", help="a different sponsorship file (requires --csv-sha256)")
    ap.add_argument("--csv-sha256", help="the SHA-256 you accept for --csv")
    ap.add_argument("--scorer-profile", help="testing only: pass this profile to the scorer (break test)")
    ap.add_argument("--audit-rules", action="store_true",
                    help="instead of a run: audit what the title rules do to every company in the file")
    return ap.parse_args(argv)


def main(argv=None) -> int:
    args = parse_args(argv)
    try:
        return audit_rules(args) if args.audit_rules else run(args)
    except Stop as stop:
        print(f"STOP at the {stop.gate} gate: {stop}", file=sys.stderr)
        return stop.code


if __name__ == "__main__":
    sys.exit(main())
