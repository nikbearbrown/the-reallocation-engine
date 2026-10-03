#!/usr/bin/env python3
"""title_sponsor_opt.py — SWE/AI/Cloud sponsored-title check with an OPT-start timeline gate.

Recipe: recipes/cases/2026fa/tushar-patel28-swe-title-sponsor-opt.md (agent) + .card.md (human).

For each candidate role this script:
  G1  matches the company to the 80 Days CSV by exact normalized name (the repo's own
      normalize_company_name from scripts/sec/sec-all-quarters.py) -> matched-h1b /
      no-h1b-trace / not-found / ambiguous;
      then checks whether a title in the role's family appears in the company's
      top_job_titles_sponsored (crosswalk.json, your-input);
  G2  computes timeline.factor from the role start date vs the persona's EAD start
      (mappings.json, your-input; planning arithmetic, not immigration advice);
  G3  sets liveness to an ASSUMED 1.0 — never checked here, no network;
  G4  the only path to Apply: a human-filled overrides file (your-input) whose complete,
      allowed entries become the scorer's override {decision: "Apply", reason}; incomplete
      or disallowed entries are refused with a message;
then writes roles.json, runs the REAL scorer CLI (npm run score), reads role-scores.json,
and writes a labelled JSON log (agents) and a Markdown report (human).

Every value it emits is labelled record / model-judgment / your-input. Nothing is defaulted:
a missing or invalid start date is an error for that role, and an unmatched company is
"unknown", never "does not sponsor".

Run from the repo root:
    python3 scripts/contrib/2026fa/tushar-patel28-swe-title-sponsor-opt/title_sponsor_opt.py

Exit codes: 0 ok (per-role input errors are reported, not fatal) · 2 bad inputs/config ·
3 scorer failed or a scorer guard tripped.
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
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]  # <repo>/scripts/contrib/2026fa/<this dir>

RECIPE = "tushar-patel28-swe-title-sponsor-opt"
RECIPE_VERSION = "0.1.0"
LABELS = ("record", "model-judgment", "your-input")
FAMILIES = ("SWE", "AI", "Cloud")
DISCLAIMER = ("Timeline factors are planning arithmetic, not immigration advice. "
              "Confirm OPT dates and the unemployment allowance with your DSO.")

DEFAULTS = {
    "persona": HERE / "sample" / "persona.json",
    "roles": HERE / "sample" / "candidate-roles.json",
    "overrides": HERE / "sample" / "overrides.json",
    "crosswalk": HERE / "crosswalk.json",
    "mappings": HERE / "mappings.json",
    "csv": REPO / "data" / "80-days-to-stay" / "80-days-csv" / "mapped_student_employment_targets_v3.csv",
    "bls": REPO / "data" / "bls" / "compact" / "soc_occupation_compact.csv",
    "out_dir": REPO / "course" / "2026fa" / "submissions" / "tushar-patel28" / "runs",
}
MAINTAINED_NORMALIZER = REPO / "scripts" / "sec" / "sec-all-quarters.py"
MAINTAINED_H1B_HELPERS = REPO / "scripts" / "sec" / "validate-h1b-join-sample.py"
SCORER_CMD = ["npm", "run", "score", "--"]


class ConfigError(Exception):
    """Bad persona/crosswalk/mappings/CSV — the whole run stops (exit 2)."""


class RoleInputError(Exception):
    """Bad input for ONE role — that role is reported and not scored."""


class ScorerError(Exception):
    """The scorer CLI failed or its output could not be read (exit 3)."""


class GuardError(ScorerError):
    """The scorer ran but its output breaks an invariant this recipe depends on (exit 3)."""


def lab(value, source, **extra):
    """Wrap a value with its provenance label. Every emitted value goes through here."""
    if source not in LABELS:
        raise ValueError(f"unknown label {source!r}")
    out = {"value": value, "source": source}
    out.update(extra)
    return out


def rel(path: Path | str) -> str:
    """Repo-relative path when inside the repo (keeps local absolute paths out of tracked logs)."""
    p = Path(path).resolve()
    try:
        return str(p.relative_to(REPO))
    except ValueError:
        return str(p)


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# ── maintained code reused, not copied ──────────────────────────────────────────

def load_normalizer():
    """Execute ONLY COMPANY_SUFFIXES + normalize_company_name from the maintained SEC script.

    That module imports pandas at top level (not installed here), so it cannot be imported
    whole; extracting the two definitions with ast runs the maintained code itself, and any
    change to it upstream flows through here.
    """
    try:
        tree = ast.parse(MAINTAINED_NORMALIZER.read_text(encoding="utf-8"))
    except OSError as e:
        raise ConfigError(f"cannot read maintained normalizer {rel(MAINTAINED_NORMALIZER)}: {e}")
    wanted = [n for n in tree.body
              if (isinstance(n, ast.Assign) and any(getattr(t, "id", "") == "COMPANY_SUFFIXES" for t in n.targets))
              or (isinstance(n, ast.FunctionDef) and n.name == "normalize_company_name")]
    if len(wanted) != 2:
        raise ConfigError(f"{rel(MAINTAINED_NORMALIZER)} no longer defines COMPANY_SUFFIXES and normalize_company_name")
    ns = {"re": re}
    exec(compile(ast.Module(body=wanted, type_ignores=[]), str(MAINTAINED_NORMALIZER), "exec"), ns)
    return ns["normalize_company_name"]


def load_h1b_helpers():
    """present / h1b_present / H1B_COLUMNS from the maintained join-validation script (stdlib only)."""
    spec = importlib.util.spec_from_file_location("validate_h1b_join_sample", MAINTAINED_H1B_HELPERS)
    if spec is None or spec.loader is None:
        raise ConfigError(f"cannot load {rel(MAINTAINED_H1B_HELPERS)}")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.present, mod.h1b_present, list(mod.H1B_COLUMNS)


# ── inputs ──────────────────────────────────────────────────────────────────────

ISO_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def parse_iso_date(value) -> dt.date | None:
    if not isinstance(value, str) or not ISO_DATE.match(value.strip()):
        return None
    try:
        return dt.date.fromisoformat(value.strip())
    except ValueError:
        return None


def read_json(path: Path, what: str):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        raise ConfigError(f"cannot read {what} {rel(path)}: {e}")


def load_persona(path: Path) -> dict:
    p = read_json(path, "persona")
    ead = parse_iso_date(p.get("ead_start_date"))
    if ead is None:
        raise ConfigError(f"persona ead_start_date {p.get('ead_start_date')!r} is missing or not YYYY-MM-DD — "
                          "the timeline gate cannot run without it, and no default is used")
    p["_ead"] = ead
    return p


def load_crosswalk(path: Path) -> dict:
    cw = read_json(path, "crosswalk")
    fams = cw.get("families", {})
    missing = [f for f in FAMILIES if f not in fams or not fams[f].get("patterns")]
    if missing:
        raise ConfigError(f"crosswalk has no patterns for families: {missing}")
    compiled = {}
    try:
        for f in FAMILIES:
            compiled[f] = [re.compile(p, re.IGNORECASE) for p in fams[f]["patterns"]]
        exclude = [re.compile(p, re.IGNORECASE) for p in cw.get("exclude_patterns", [])]
    except re.error as e:
        raise ConfigError(f"crosswalk pattern does not compile: {e}")
    return {"raw": cw, "compiled": compiled, "exclude": exclude}


def title_families(title: str, crosswalk: dict) -> set:
    """Families a single title maps to: none if it hits an exclusion (precision over recall)."""
    if any(x.search(title) for x in crosswalk["exclude"]):
        return set()
    return {f for f, pats in crosswalk["compiled"].items() if any(p.search(title) for p in pats)}


def load_mappings(path: Path) -> dict:
    m = read_json(path, "mappings")
    for key in ("sponsorship", "fit", "timeline", "liveness", "g4", "next_action"):
        if key not in m:
            raise ConfigError(f"mappings.json is missing the '{key}' block")
    for f in FAMILIES:
        if not isinstance(m["fit"].get(f), (int, float)):
            raise ConfigError(f"mappings.json fit.{f} is not a number")
    for state in ("matched-h1b+in-top-titles", "matched-h1b+not-in-top-titles", "matched-h1b+titles-unreadable",
                  "no-h1b-trace", "not-found", "ambiguous"):
        if state not in m["sponsorship"]:
            raise ConfigError(f"mappings.json sponsorship has no entry for evidence state '{state}'")
    return m


def load_overrides(path: Path) -> list:
    """G4 overrides file (your-input). Required — an explicitly empty list means 'no human evidence yet'."""
    o = read_json(path, "G4 overrides")
    entries = o.get("overrides") if isinstance(o, dict) else None
    if not isinstance(entries, list):
        raise ConfigError(f"G4 overrides file {rel(path)} must be an object with an 'overrides' list (use [] for none)")
    return entries


G4_FIELDS = ("role_id", "lca_evidence_source", "fiscal_year", "soc_code", "posting_says_no_sponsorship",
             "liveness_checked_on", "checked_on", "reason")
SOC_CODE = re.compile(r"^\d{2}-\d{4}(\.\d{2})?$")


def validate_override(entry, roles_ctx: dict, seen: set, today: dt.date) -> str | None:
    """Return None if the G4 entry may become an Apply override, else the refusal message."""
    if not isinstance(entry, dict):
        return "G4 refused an entry that is not an object"
    rid = entry.get("role_id")
    who = f"G4 refused override for role '{rid}'"
    missing = [f for f in G4_FIELDS if f not in entry or entry[f] is None or (isinstance(entry[f], str) and not entry[f].strip())]
    if missing:
        return f"{who}: missing field(s) {missing}"
    if not isinstance(rid, str):
        return f"{who}: role_id must be a string"
    for f in ("lca_evidence_source", "reason"):
        if not isinstance(entry[f], str):
            return f"{who}: {f} must be text"
    if not isinstance(entry["fiscal_year"], int) or isinstance(entry["fiscal_year"], bool) or not 2000 <= entry["fiscal_year"] <= 2100:
        return f"{who}: fiscal_year must be a four-digit integer, got {entry['fiscal_year']!r}"
    if not isinstance(entry["soc_code"], str) or not SOC_CODE.match(entry["soc_code"]):
        return f"{who}: soc_code must look like 15-1252 or 15-1252.00, got {entry['soc_code']!r}"
    if not isinstance(entry["posting_says_no_sponsorship"], bool):
        return f"{who}: posting_says_no_sponsorship must be true or false, got {entry['posting_says_no_sponsorship']!r}"
    for f in ("liveness_checked_on", "checked_on"):
        d = parse_iso_date(entry[f])
        if d is None:
            return f"{who}: {f} must be a YYYY-MM-DD date, got {entry[f]!r}"
        if d > today:
            return f"{who}: {f} {entry[f]} is in the future — a check cannot be recorded before it happens"
    if rid not in roles_ctx:
        return f"{who}: no such role in the candidate-roles file"
    if rid in seen:
        return f"{who}: more than one entry for this role"
    ctx = roles_ctx[rid]
    if not ctx["scored"]:
        return f"{who}: the role was not scored (input error), so there is nothing to override"
    if entry["posting_says_no_sponsorship"]:
        return f"{who}: the posting says it does not sponsor — evidence of past filings cannot override that"
    if ctx["timeline_factor"] == 0:
        return f"{who}: its timeline gate is 0 ({ctx['band']}) — an override cannot reopen a closed gate"
    if ctx["g1_status"] in ("ambiguous", "not-found"):
        return (f"{who}: its company match is {ctx['g1_status']} — resolve which company this is before "
                "attaching LCA evidence to it")
    return None


def override_reason(entry: dict) -> str:
    """The scorer's override.reason: the human's reason plus every G4 evidence field."""
    ev = "; ".join(f"{f}={json.dumps(entry[f]) if isinstance(entry[f], bool) else entry[f]}"
                   for f in G4_FIELDS if f not in ("role_id", "reason"))
    return f"G4 human override — {entry['reason'].strip()} | evidence: {ev} | an LCA is evidence of an intent to file, not an approved visa"


def load_sponsorship_csv(path: Path, normalize, h1b_columns) -> dict:
    need = ["company_name", "city", "state", "industry", *h1b_columns]
    try:
        with open(path, newline="", encoding="utf-8-sig") as fh:
            reader = csv.DictReader(fh)
            header = reader.fieldnames or []
            absent = [c for c in need if c not in header]
            if absent:
                raise ConfigError(f"sponsorship CSV {rel(path)} lacks columns {absent} — upstream schema changed; stop")
            rows = list(reader)
    except OSError as e:
        raise ConfigError(f"cannot read sponsorship CSV {rel(path)}: {e}")
    index: dict[str, list[dict]] = {}
    for i, row in enumerate(rows):
        key = normalize(row["company_name"])
        if key:
            row["_row_number"] = i + 2  # 1-based, header is line 1
            index.setdefault(key, []).append(row)
    return {"rows": rows, "index": index, "header": header}


def load_bls(path: Path, crosswalk_raw: dict) -> dict:
    """BLS median wage per family's context SOC codes — report context only, never scored."""
    out = {}
    try:
        with open(path, newline="", encoding="utf-8") as fh:
            by_code = {r["onet_soc_code"]: r for r in csv.DictReader(fh)}
    except OSError as e:
        raise ConfigError(f"cannot read BLS compact table {rel(path)}: {e}")
    for fam in FAMILIES:
        entries = []
        for code in crosswalk_raw["families"][fam].get("context_soc_codes", []):
            r = by_code.get(code)
            if r is None:
                entries.append({"soc_code": lab(code, "your-input"),
                                "status": lab("unknown: no row in the BLS compact table", "record")})
                continue
            median = r.get("annual_median_wage", "").strip()
            entries.append({
                "soc_code": lab(code, "your-input", note="family -> SOC context mapping is mine"),
                "bls_soc_code": lab(r.get("bls_soc_code"), "record"),
                "title": lab(r.get("title"), "record"),
                "annual_median_wage": lab(float(median) if median else None, "record",
                                          note=None if median else "unknown: blank in source"),
                "oews_year": lab(r.get("oews_year"), "record"),
            })
        out[fam] = entries
    return out


# ── gates ───────────────────────────────────────────────────────────────────────

def g1_entity(company: str, csvdata: dict, normalize, h1b_present) -> dict:
    key = normalize(company)
    rows = csvdata["index"].get(key, []) if key else []
    if not rows:
        status = "not-found"
    elif len(rows) > 1:
        status = "ambiguous"
    else:
        status = "matched-h1b" if h1b_present(rows[0]) else "no-h1b-trace"
    return {"key": key, "status": status, "rows": rows}


def family_check(row: dict, family: str, crosswalk: dict, present) -> dict:
    raw = row.get("top_job_titles_sponsored")
    if not present(raw):
        return {"status": "titles-unreadable", "reason": "top_job_titles_sponsored is empty", "titles": None, "matched": [], "excluded": []}
    try:
        titles = ast.literal_eval(raw)
    except (ValueError, SyntaxError) as e:
        return {"status": "titles-unreadable", "reason": f"not a Python list literal ({type(e).__name__})",
                "titles": None, "matched": [], "excluded": []}
    if not isinstance(titles, list) or not titles or not all(isinstance(t, str) for t in titles):
        return {"status": "titles-unreadable", "reason": "parsed value is not a non-empty list of strings",
                "titles": None, "matched": [], "excluded": []}
    pats = crosswalk["compiled"][family]
    matched = [t for t in titles if family in title_families(t, crosswalk)]
    excluded = [t for t in titles if t not in matched and any(p.search(t) for p in pats)]
    return {"status": "in-top-titles" if matched else "not-in-top-titles", "reason": None,
            "titles": titles, "matched": matched, "excluded": excluded}


def g2_timeline(role_id: str, start_value, ead: dt.date, tl: dict) -> dict:
    start = parse_iso_date(start_value)
    if start is None:
        raise RoleInputError(f"role '{role_id}': start_date {start_value!r} is missing or not a valid YYYY-MM-DD date; "
                             "no default is used, so this role is not scored")
    days = (start - ead).days
    hits = [b for b in tl["bands"]
            if (b["min_days"] is None or days >= b["min_days"]) and (b["max_days"] is None or days <= b["max_days"])]
    if len(hits) != 1:
        raise ConfigError(f"timeline bands in mappings.json do not cover day {days} exactly once ({len(hits)} matches)")
    return {"start": start, "days": days, "band": hits[0]["name"], "factor": float(hits[0]["factor"])}


# ── scorer (the real CLI) ───────────────────────────────────────────────────────

def run_scorer(roles_path: Path, out_dir: Path, scorer_cmd: list[str] | None = None) -> dict:
    cmd = (scorer_cmd or SCORER_CMD) + [rel(roles_path), "--out-dir", rel(out_dir)]
    if "--profile" in cmd:
        raise GuardError("refusing to pass --profile: the scorer's authorization regex zeroes the sponsorship weight for 'work authorized' F-1 profiles")
    started = time.time()
    proc = subprocess.run(cmd, cwd=REPO, capture_output=True, text=True)
    if proc.returncode != 0:
        raise ScorerError(f"scorer exited {proc.returncode}: {(proc.stderr or proc.stdout).strip()[-400:]}")
    scores_path = out_dir / "role-scores.json"
    if not scores_path.exists() or scores_path.stat().st_mtime < started - 1:
        raise ScorerError(f"scorer did not write a fresh {rel(scores_path)}")
    scores = json.loads(scores_path.read_text(encoding="utf-8"))
    return {"cmd": cmd, "exit": proc.returncode, "stdout": proc.stdout.strip(), "stderr": proc.stderr.strip(),
            "scores": scores, "scores_path": scores_path, "md_path": out_dir / "role-scores.md"}


def check_sponsorship_weights(scores: dict) -> int:
    """F6 guard: every sponsorship term in the scorer output must carry weight > 0.

    Returns how many sponsorship terms were checked; raises GuardError on a zero weight or
    when no term exists at all (a vacuous pass would hide the bug).
    """
    n = 0
    for r in scores.get("roles", []):
        for v in r.get("trace", {}).get("votes", []):
            if v.get("factor") == "sponsorship":
                n += 1
                if not v.get("weight"):
                    raise GuardError(f"sponsorship weight is {v.get('weight')!r} for role '{r.get('role_id')}' — "
                                     "the F-1 'authorized' bug (or a broken scorer) has zeroed sponsorship")
    if n == 0:
        raise GuardError("no sponsorship term in the scorer output — the weight guard cannot be checked")
    return n


def check_gate_echo(sent: dict, scores: dict) -> None:
    """The scorer must multiply exactly the gates we sent, and Skip as 'gated' when timeline is closed."""
    got = {r["role_id"]: r for r in scores.get("roles", [])}
    if set(got) != set(sent):
        raise GuardError(f"scorer returned roles {sorted(got)} but {sorted(sent)} were sent")
    for rid, role in sent.items():
        gates = {g["factor"]: g["multiplier"] for g in got[rid]["trace"]["gates"]}
        if gates.get("timeline") != role["timeline"]["factor"] or gates.get("liveness") != role["liveness"]["factor"]:
            raise GuardError(f"role '{rid}': scorer used gates {gates}, but timeline={role['timeline']['factor']} "
                             f"liveness={role['liveness']['factor']} were sent")
        if role["timeline"]["factor"] == 0 and not (got[rid]["machine_recommendation"] == "Skip"
                                                    and str(got[rid]["reason"]).startswith("gated: timeline")):
            raise GuardError(f"role '{rid}': timeline factor 0 was sent but the scorer returned "
                             f"{got[rid]['machine_recommendation']} ({got[rid]['reason']})")


def check_overrides(sent: dict, scores: dict) -> None:
    """The scorer must apply exactly the G4 overrides sent, and no others."""
    for r in scores.get("roles", []):
        rid, has = r["role_id"], "override" in sent.get(r["role_id"], {})
        if has and not (r["recommendation"] == "Apply" and (r.get("override") or {}).get("reason") == sent[rid]["override"]["reason"]):
            raise GuardError(f"role '{rid}': a G4 override was sent but the scorer returned {r['recommendation']} "
                             f"(override {r.get('override')!r})")
        if not has and (r.get("override") or r["recommendation"] != r["machine_recommendation"]):
            raise GuardError(f"role '{rid}': no G4 override was sent but the scorer's recommendation "
                             f"{r['recommendation']} differs from its machine recommendation {r['machine_recommendation']}")


# ── decisions ───────────────────────────────────────────────────────────────────

def next_action(scored: bool, tier: str | None, g1_status: str | None, timeline_factor, g4_accepted: bool) -> str:
    """mappings.json next_action rules, in order (closed DEFINE; rationale drafted by tushar-patel28, 2026-10-01)."""
    if not scored:
        return "blocked: fix the input and re-run"
    if g1_status == "ambiguous":
        return "blocked: pick the right company row, then re-run"
    if timeline_factor == 0:
        return "skip"
    if g4_accepted:
        return "apply"
    if tier == "Likely":
        return "tailor an application"
    # Possible: a conversation can confirm whether the company sponsors this role family.
    # Unknown: a conversation resolves sponsorship policy and an application can't; unknown is not no.
    return "network into the company"


def shown_decision(recommendation: str | None, action: str, mappings: dict, g4_entry: dict | None = None) -> str:
    """What the human sees. Apply appears only via an accepted G4 entry; otherwise G3 blocks it."""
    block = mappings["next_action"]["g3_block_text"]
    if recommendation is None:
        return "not scored (input error)"
    if recommendation == "Apply" and g4_entry:
        return (f"Apply — G4 human override (LCA FY{g4_entry['fiscal_year']}, SOC {g4_entry['soc_code']}; "
                f"liveness checked {g4_entry['liveness_checked_on']})")
    if recommendation == "Apply":
        return f"Apply — {block}"
    if action == "tailor an application":
        return f"{recommendation} — {block}"
    return recommendation


# ── pipeline ────────────────────────────────────────────────────────────────────

def build(args, scorer_cmd: list[str] | None = None) -> dict:
    normalize = load_normalizer()
    present, h1b_present, h1b_columns = load_h1b_helpers()
    persona = load_persona(args.persona)
    crosswalk = load_crosswalk(args.crosswalk)
    mappings = load_mappings(args.mappings)
    csvdata = load_sponsorship_csv(args.csv, normalize, h1b_columns)
    bls = load_bls(args.bls, crosswalk["raw"])
    overrides_in = load_overrides(args.overrides)
    roles_in = read_json(args.roles, "candidate roles")
    roles_in = roles_in.get("roles", []) if isinstance(roles_in, dict) else roles_in
    if not isinstance(roles_in, list) or not roles_in:
        raise ConfigError("candidate-roles file has no roles")

    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    run_date = dt.date.today().isoformat()
    tl, lv = mappings["timeline"], mappings["liveness"]

    entries, to_score, seen = [], {}, set()
    for i, r in enumerate(roles_in):
        rid = r.get("role_id") or f"role-{i + 1}"
        e = {"role_id": lab(rid, "your-input"),
             "input": {k: lab(r.get(k), "your-input") for k in ("company", "title", "role_family", "start_date", "posting_url")},
             "error": None}
        entries.append(e)
        try:
            if rid in seen:
                raise RoleInputError(f"role_id '{rid}' is duplicated")
            seen.add(rid)
            for k in ("company", "title", "role_family", "posting_url"):
                if not isinstance(r.get(k), str) or not r[k].strip():
                    raise RoleInputError(f"role '{rid}': {k} is missing")
            fam = r["role_family"]
            if fam not in FAMILIES:
                raise RoleInputError(f"role '{rid}': role_family {fam!r} is not one of {list(FAMILIES)}")

            g1 = g1_entity(r["company"], csvdata, normalize, h1b_present)
            e["g1_entity"] = {
                "normalized_key": lab(g1["key"], "your-input", note="my company name through the repo's normalize_company_name"),
                "status": lab(g1["status"], "record", note="what the CSV holds for that key"),
                "matched_rows": [lab({"row": row["_row_number"], "company_name": row["company_name"], "city": row["city"],
                                      "state": row["state"], "industry": row["industry"]}, "record") for row in g1["rows"]],
                "human_check": lab("confirm the matched row is this company (name, city, state), not a namesake", "your-input"),
            }
            if g1["status"] == "matched-h1b":
                fc = family_check(g1["rows"][0], fam, crosswalk, present)
                state = f"matched-h1b+{fc['status']}"
                claim = {
                    "in-top-titles": f"a title in the {fam} family appears in the company's top sponsored titles (a title match only; it verifies nothing about the visa's job category)",
                    "not-in-top-titles": f"{fam} family not in top titles (unknown) — the list holds only a few titles, and ambiguous titles map to no family",
                    "titles-unreadable": "the top-titles list could not be read; no family claim is made",
                }[fc["status"]]
                e["family_check"] = {
                    "status": lab(fc["status"], "your-input", basis="record titles x your-input crosswalk"),
                    "claim": lab(claim, "your-input"),
                    "top_titles": lab(fc["titles"], "record"),
                    "matched_titles": lab(fc["matched"], "your-input", basis="record titles x your-input crosswalk"),
                    "excluded_titles": lab(fc["excluded"], "your-input",
                                           note="hit a family keyword but also an exclusion, so no family (precision over recall)"),
                    "unreadable_reason": lab(fc["reason"], "record") if fc["reason"] else None,
                }
            else:
                state = g1["status"]
                e["family_check"] = {"status": lab("not-applicable", "your-input",
                                                   note="no H-1B trace to read titles from; sponsorship is unknown, not 'does not sponsor'")}
            sp = mappings["sponsorship"][state]
            e["sponsorship_vote"] = {"evidence_state": lab(state, "your-input", basis="record G1 status x family check"),
                                     "tier": lab(sp["tier"], "your-input"), "p": lab(sp["p"], "your-input"),
                                     "why": lab(sp["why"], "your-input")}
            e["fit_vote"] = {"p": lab(mappings["fit"][fam], "your-input", basis="priority order SWE > AI > Cloud")}

            t = g2_timeline(rid, r.get("start_date"), persona["_ead"], tl)
            e["g2_timeline"] = {"ead_start_date": lab(persona["ead_start_date"], "your-input"),
                                "start_date": lab(t["start"].isoformat(), "your-input"),
                                "days_after_ead_start": lab(t["days"], "your-input"),
                                "band": lab(t["band"], "your-input"),
                                "factor": lab(t["factor"], "your-input"),
                                "disclaimer": lab(DISCLAIMER, "your-input")}
            e["g3_liveness"] = {"factor": lab(lv["factor"], "your-input"), "assumed": lab(True, "your-input"),
                                "checked": lab(False, "record", note="no liveness check was run; this prototype makes no network calls"),
                                "clear_with": lab(lv["clear_with"].replace("<posting_url>", r["posting_url"]), "your-input")}

            sponsorship = {"tier": sp["tier"], "p": sp["p"], "source": "your-input",
                           "evidence": {"g1_status": g1["status"], "g1_source": "record",
                                        "family_check": e["family_check"]["status"]["value"],
                                        "matched_titles": e["family_check"].get("matched_titles", {}).get("value") if g1["status"] == "matched-h1b" else None,
                                        "matched_row": [{"company_name": x["company_name"], "city": x["city"], "state": x["state"]} for x in g1["rows"]]}}
            to_score[rid] = {
                "role_id": rid, "company": r["company"], "title": r["title"],
                "sponsorship": sponsorship,
                "fit": {"p": mappings["fit"][fam], "source": "your-input", "basis": "priority order SWE > AI > Cloud"},
                "liveness": {"factor": lv["factor"], "source": "your-input", "assumed": True, "checked": False},
                "timeline": {"factor": t["factor"], "source": "your-input", "days_after_ead_start": t["days"],
                             "band": t["band"], "note": "planning arithmetic, not immigration advice"},
                "role_family": fam, "posting_url": r["posting_url"],
            }
        except RoleInputError as err:
            e["error"] = lab(str(err), "your-input", note="this role was not sent to the scorer")
            print(f"  ! {err}", file=sys.stderr)

    # ── G4: human-filled overrides — the only path to Apply ──
    by_entry = {e["role_id"]["value"]: e for e in entries}
    roles_ctx = {rid: {"scored": rid in to_score,
                       "timeline_factor": to_score[rid]["timeline"]["factor"] if rid in to_score else None,
                       "band": to_score[rid]["timeline"]["band"] if rid in to_score else None,
                       "g1_status": e.get("g1_entity", {}).get("status", {}).get("value")}
                 for rid, e in by_entry.items()}
    g4_log, accepted, g4_seen = [], {}, set()
    for entry in overrides_in:
        msg = validate_override(entry, roles_ctx, g4_seen, dt.date.today())
        rid = entry.get("role_id") if isinstance(entry, dict) else None
        if isinstance(rid, str):
            g4_seen.add(rid)
        if msg is None:
            accepted[rid] = entry
            to_score[rid]["override"] = {"decision": "Apply", "reason": override_reason(entry)}
            to_score[rid]["liveness"] = {"factor": lv["factor"], "source": "your-input", "assumed": False, "checked": True,
                                         "checked_on": entry["liveness_checked_on"], "checked_by": "human, recorded in the G4 entry"}
            result = lab("accepted", "your-input", message=f"G4 accepted override for role '{rid}': sent to the scorer as Apply")
        else:
            print(f"  ! {msg}", file=sys.stderr)
            result = lab("refused", "your-input", message=msg)
        g4_log.append({"entry": lab(entry, "your-input"), "result": result})
        if rid in by_entry:
            by_entry[rid].setdefault("g4_override", []).append(result)
    for rid, entry in accepted.items():
        e = by_entry[rid]
        e["g3_liveness"].update({
            "assumed": lab(False, "your-input"),
            "checked": lab(True, "your-input", note="the human recorded running the liveness command in the G4 entry"),
            "checked_on": lab(entry["liveness_checked_on"], "your-input")})

    roles_path = out_dir / "roles.json"
    roles_path.write_text(json.dumps(list(to_score.values()), indent=2) + "\n", encoding="utf-8")

    scorer = None
    if to_score:
        scorer = run_scorer(roles_path, out_dir, scorer_cmd)
        n_terms = check_sponsorship_weights(scorer["scores"])
        check_gate_echo(to_score, scorer["scores"])
        check_overrides(to_score, scorer["scores"])
        scorer["sponsorship_terms_checked"] = n_terms
    scored = {r["role_id"]: r for r in (scorer["scores"]["roles"] if scorer else [])}

    for e in entries:
        rid = e["role_id"]["value"]
        s = scored.get(rid)
        tier = e.get("sponsorship_vote", {}).get("tier", {}).get("value")
        band = e.get("g2_timeline", {}).get("band", {}).get("value")
        factor = e.get("g2_timeline", {}).get("factor", {}).get("value")
        action = next_action(s is not None, tier, e.get("g1_entity", {}).get("status", {}).get("value"), factor, rid in accepted)
        note = mappings["next_action"]["early_start_note"] if band == "1-30-days-before" and action != "skip" else None
        e["scorer"] = lab(s, "record", file=rel(out_dir / "role-scores.json"),
                          note="verbatim from the real scorer CLI") if s else None
        e["decision"] = {"machine_recommendation": lab(s["machine_recommendation"], "record") if s else None,
                         "recommendation": lab(s["recommendation"], "record",
                                               note="after the scorer applied any G4 override") if s else None,
                         "shown": lab(shown_decision(s["recommendation"] if s else None, action, mappings,
                                                     accepted.get(rid)), "your-input"),
                         "next_action": lab(action, "your-input", rule="mappings.json next_action"),
                         "note": lab(note, "your-input") if note else None}

    coverage = dataset_coverage(csvdata, crosswalk, present, h1b_present)
    log = {
        "run": {"recipe": lab(f"{RECIPE} v{RECIPE_VERSION}", "record"),
                "run_date": lab(run_date, "record"),
                "mode": lab("sample (offline; no network calls)", "your-input"),
                "command": lab(" ".join(["python3", rel(Path(__file__))] + args.argv), "record"),
                "disclaimer": lab(DISCLAIMER, "your-input")},
        "inputs": {
            "persona": {k: lab(v, "your-input") for k, v in persona.items() if not k.startswith("_")},
            "files": {name: lab(rel(getattr(args, name)), src, sha256=sha256(getattr(args, name)))
                      for name, src in (("csv", "record"), ("bls", "record"), ("persona", "your-input"),
                                        ("roles", "your-input"), ("overrides", "your-input"), ("crosswalk", "your-input"),
                                        ("mappings", "your-input"))},
            "maintained_code_reused": {"normalizer": lab(rel(MAINTAINED_NORMALIZER) + "::normalize_company_name", "record"),
                                       "h1b_presence": lab(rel(MAINTAINED_H1B_HELPERS) + "::h1b_present", "record")},
            "crosswalk": lab(crosswalk["raw"], "your-input"),
            "mappings": lab({k: v for k, v in mappings.items()}, "your-input"),
        },
        "dataset_context": coverage,
        "bls_context": {"note": lab("context only: role_quality weight is 0 in the scorer, so wages do not enter the score", "record"),
                        "families": bls},
        "roles": entries,
        "g4_overrides": {"file": lab(rel(args.overrides), "your-input"),
                         "entries_in_file": lab(len(overrides_in), "your-input"),
                         "results": g4_log,
                         "note": lab("An LCA is evidence of an intent to file, not an approved visa.", "your-input")},
        "scorer_run": None if scorer is None else {
            "command": lab(" ".join(scorer["cmd"]), "record"),
            "exit_code": lab(scorer["exit"], "record"),
            "stdout": lab(scorer["stdout"], "record"),
            "config": lab(scorer["scores"].get("config"), "record"),
            "profile_needs_sponsorship": lab(scorer["scores"].get("profile_needs_sponsorship"), "record"),
            "sponsorship_weight_guard": lab(f"passed: {scorer['sponsorship_terms_checked']} sponsorship term(s), all weight > 0", "record"),
            "gate_echo_guard": lab("passed: scorer multiplied exactly the gates sent; every timeline=0 role is a gated Skip", "record"),
            "override_guard": lab("passed: scorer applied exactly the G4 overrides sent and no others", "record"),
            "files": {"roles_json": lab(rel(roles_path), "record"), "role_scores_json": lab(rel(scorer["scores_path"]), "record"),
                      "role_scores_md": lab(rel(scorer["md_path"]), "record")},
        },
        "summary": summarize(entries, g4_log),
    }
    log_path = out_dir / f"swe-title-sponsor-opt-{run_date}.json"
    report_path = out_dir / f"swe-title-sponsor-opt-{run_date}.md"
    log["run"]["outputs"] = {"log": lab(rel(log_path), "record"), "report": lab(rel(report_path), "record")}
    log_path.write_text(json.dumps(log, indent=2, default=str) + "\n", encoding="utf-8")
    report_path.write_text(render_report(log), encoding="utf-8")
    return {"log": log, "log_path": log_path, "report_path": report_path, "roles_path": roles_path, "scorer": scorer}


def dataset_coverage(csvdata, crosswalk, present, h1b_present) -> dict:
    """How often each family appears in the top titles of ALL H-1B rows — tests whether the check separates companies."""
    h1b_rows = [r for r in csvdata["rows"] if h1b_present(r)]
    fam_counts = {f: 0 for f in FAMILIES}
    none_count = unreadable = 0
    for r in h1b_rows:
        any_fam = False
        for f in FAMILIES:
            fc = family_check(r, f, crosswalk, present)
            if fc["status"] == "titles-unreadable":
                unreadable += 1
                break
            if fc["status"] == "in-top-titles":
                fam_counts[f] += 1
                any_fam = True
        else:
            if not any_fam:
                none_count += 1
    return {
        "csv_rows": lab(len(csvdata["rows"]), "record"),
        "rows_with_h1b_fields": lab(len(h1b_rows), "record"),
        "h1b_rows_with_family_in_top_titles": {f: lab(n, "your-input", basis="record titles x your-input crosswalk")
                                               for f, n in fam_counts.items()},
        "h1b_rows_with_no_family_in_top_titles": lab(none_count, "your-input", basis="record titles x your-input crosswalk"),
        "h1b_rows_with_unreadable_titles": lab(unreadable, "record"),
    }


def summarize(entries, g4_log) -> dict:
    def count(f):
        out = {}
        for e in entries:
            k = f(e)
            out[k] = out.get(k, 0) + 1
        return out
    scored = [e for e in entries if e.get("scorer")]
    skips = sum(1 for e in scored if e["decision"]["machine_recommendation"]["value"] == "Skip")
    n_acc = sum(1 for g in g4_log if g["result"]["value"] == "accepted")
    return {
        "roles_in": lab(len(entries), "your-input"),
        "roles_scored": lab(len(scored), "record"),
        "roles_not_scored": lab(len(entries) - len(scored), "record"),
        "by_g1_status": lab(count(lambda e: e.get("g1_entity", {}).get("status", {}).get("value", "not-checked")), "record"),
        "by_scorer_recommendation": lab(count(lambda e: (e["decision"]["machine_recommendation"] or {}).get("value", "not scored")), "record",
                                        note="the scorer's machine recommendation, before any G4 override"),
        "by_final_recommendation": lab(count(lambda e: (e["decision"]["recommendation"] or {}).get("value", "not scored")), "record",
                                       note="after the scorer applied G4 overrides"),
        "by_next_action": lab(count(lambda e: e["decision"]["next_action"]["value"]), "your-input"),
        "skip_rate_of_scored": lab(f"{skips}/{len(scored)}", "record"),
        "g4_accepted": lab(n_acc, "your-input"),
        "g4_refused": lab(len(g4_log) - n_acc, "your-input"),
        "g3_cleared": lab(n_acc, "your-input", note="only roles whose accepted G4 entry records a human liveness check"),
    }


# ── human report ────────────────────────────────────────────────────────────────

def v(x):
    return "—" if x is None else x["value"] if isinstance(x, dict) and "value" in x else x


def tag(x):
    return f"[{x['source']}]" if isinstance(x, dict) and "source" in x else ""


def cell(x, fmt=None):
    if x is None:
        return "—"
    val = v(x)
    if isinstance(val, float):
        val = f"{val:g}"
    if fmt:
        val = fmt(val)
    return f"{val} {tag(x)}".strip()


def render_report(log: dict) -> str:
    roles, s = log["roles"], log["summary"]
    run_date = v(log["run"]["run_date"])
    scored = [e for e in roles if e.get("scorer")]
    errors = [e for e in roles if e.get("error")]
    recs = v(s["by_scorer_recommendation"])
    acts = v(s["by_next_action"])
    g1 = v(s["by_g1_status"])
    unknown = sum(n for k, n in g1.items() if k in ("not-found", "no-h1b-trace", "ambiguous"))
    o = []
    o.append(f"# Sponsored-title and OPT-timeline check — sample run {run_date}\n")
    o.append("## Executive summary\n")
    o.append(f"**What this is.** A check of {len(roles)} job openings for one fictional international student "
             "(MS in software engineering, work permit starting in January). For each opening it asks two things: "
             "does the company's public visa-sponsorship history list a job title in the student's field, and does "
             "the start date fall inside the student's work-permit window? It then runs the project's existing "
             "scoring tool and suggests a next step for each opening.\n")
    o.append("**Why read it.** It shows, opening by opening, which numbers come from public data and which come from "
             "the student's own definitions, so the student can see exactly why each opening was ranked the way it was "
             "and what they still have to check by hand.\n")
    n_acc, n_ref = v(s["g4_accepted"]), v(s["g4_refused"])
    o.append(f"**What it found.** {len(scored)} openings were scored and {len(errors)} could not be scored because the "
             f"start date was missing or invalid. The scoring tool said: "
             + ", ".join(f"{k} {n}" for k, n in sorted(recs.items())) + ". Suggested next steps: "
             + ", ".join(f"{k} {n}" for k, n in sorted(acts.items())) + ". "
             f"For {unknown} openings the company's sponsorship history is simply unknown (no match, no trace, or "
             "more than one possible match). That is not evidence the company refuses to sponsor, so the next step "
             "there is a conversation, not a skip. "
             "An opening reaches \"Apply\" only when a person has checked public labor-filing records and the live "
             "posting, and written that evidence down; "
             + (f"{n_acc} such entries were accepted and {n_ref} refused in this run. "
                if (n_acc or n_ref) else "none was supplied in this run, so no opening is marked Apply. ")
             + "Openings whose start date is up to 30 days before the work permit begins, or 61 to 90 days after it, "
             "are kept but flagged as risky. Whether a posting is still open was not checked except where a person "
             "recorded it. The date arithmetic is for planning only and is not immigration advice.\n")

    o.append("## How to read the labels\n")
    o.append("- `[record]` came from a data file or from the scorer's own output, unchanged.")
    o.append("- `[your-input]` is the student's definition or input: the role list, the dates, the title keywords, "
             "and every mapping from evidence to a number.")
    o.append("- `[model-judgment]` would mark an AI judgment. None is used in this run.")
    o.append("- A value derived from a record by one of the student's definitions carries `[your-input]`, "
             "because the definition is the part a human must check.\n")

    o.append("## Decisions\n")
    o.append("| Role | Family | Company evidence (G1) | Family in top titles | Start vs EAD | Timeline factor (G2) | Liveness (G3) | G4 human evidence | Votes sent | Composite | Scorer (machine → final) | Shown decision | Next action |")
    o.append("|---|---|---|---|---|---|---|---|---|---|---|---|---|")
    for e in roles:
        inp = e["input"]
        name = f"{v(inp['company'])} — {v(inp['title'])}"
        if e.get("error"):
            g1s = cell(e["g1_entity"]["status"]) if e.get("g1_entity") else "—"
            fcs = cell(e["family_check"]["status"]) if e.get("family_check") else "—"
            g4s = "; ".join(f"{x['value']} [{x['source']}]" for x in e.get("g4_override", [])) or "none"
            o.append(f"| {name} | {cell(inp['role_family'])} | {g1s} | {fcs} | {cell(inp['start_date'])} | **error** | — | {g4s} | — | — | not scored | "
                     f"{cell(e['decision']['shown'])} | {cell(e['decision']['next_action'])} |")
            continue
        g, fc, t, lv = e["g1_entity"], e["family_check"], e["g2_timeline"], e["g3_liveness"]
        sv, fv = e["sponsorship_vote"], e["fit_vote"]
        p = v(sv["p"])
        votes = (f"sponsorship {v(sv['tier'])} p={p if p is not None else 'none (no vote)'} {tag(sv['p'])}; "
                 f"fit p={v(fv['p'])} {tag(fv['p'])}")
        sc = v(e["scorer"])
        live = (f"{v(lv['factor']):g} checked on {v(lv['checked_on'])} by a human {tag(lv['checked_on'])}" if v(lv["checked"])
                else f"{v(lv['factor']):g} assumed, not checked {tag(lv['factor'])}")
        g4s = "; ".join(f"{x['value']} [{x['source']}]" for x in e.get("g4_override", [])) or "none"
        rec = sc["machine_recommendation"] if sc["recommendation"] == sc["machine_recommendation"] \
            else f"{sc['machine_recommendation']} → {sc['recommendation']} (G4 override)"
        action = cell(e["decision"]["next_action"])
        if e["decision"].get("note"):
            action += f"; {cell(e['decision']['note'])}"
        o.append(f"| {name} | {cell(inp['role_family'])} | {cell(g['status'])} | {cell(fc['status'])} | "
                 f"{v(t['days_after_ead_start'])} days ({v(t['band'])}) {tag(t['band'])} | {cell(t['factor'])} | "
                 f"{live} | {g4s} | {votes} | "
                 f"{sc['composite']:.3f} [record] | {rec} [record] | "
                 f"{cell(e['decision']['shown'])} | {action} |")
    o.append("")

    o.append("## Audit trace per scored role\n")
    o.append("Arithmetic exactly as the scorer printed it `[record]`. Votes are added; liveness and timeline multiply.\n")
    for e in scored:
        sc = v(e["scorer"])
        o.append(f"- **{sc['role_id']}** — `{sc['trace']['arithmetic']}` → {sc['machine_recommendation']}: {sc['reason']}")
    o.append("")

    g4 = log["g4_overrides"]
    o.append("## Human evidence for Apply (G4)\n")
    o.append(f"{cell(g4['note'])} Entries in the overrides file: {cell(g4['entries_in_file'])}.\n")
    if not g4["results"]:
        o.append("No entries. No real labor-filing check has been done for this list, so no opening can be Apply. "
                 "Writing evidence here without doing the check would be an invented record.\n")
    for g in g4["results"]:
        o.append(f"- **{g['result']['value']}** {tag(g['result'])} — {g['result']['message']}")
    if g4["results"]:
        o.append("")

    o.append("## Name matches a person must confirm (G1)\n")
    o.append("Exact name matching can attach a namesake. Confirm each matched row is the company you mean.\n")
    o.append("| Role | Your company name | Normalized key | Status | Matched row(s) `[record]` |")
    o.append("|---|---|---|---|---|")
    for e in roles:
        if not e.get("g1_entity"):
            continue
        g = e["g1_entity"]
        rows = "; ".join(f"{v(x)['company_name']} ({v(x)['city']}, {v(x)['state']}; row {v(x)['row']})" for x in g["matched_rows"]) or "none"
        o.append(f"| {v(e['role_id'])} | {cell(e['input']['company'])} | {cell(g['normalized_key'])} | {cell(g['status'])} | {rows} |")
    o.append("")

    o.append("## Top sponsored titles behind each family check\n")
    for e in roles:
        fc = e.get("family_check")
        if not fc or "top_titles" not in fc:
            continue
        o.append(f"- **{v(e['role_id'])}** ({v(e['input']['role_family'])}): {cell(fc['claim'])}. "
                 f"Top titles {tag(fc['top_titles'])}: {v(fc['top_titles']) or '—'}; matched {tag(fc['matched_titles'])}: {v(fc['matched_titles']) or 'none'}")
    o.append("")

    if errors:
        o.append("## Roles not scored\n")
        for e in errors:
            o.append(f"- {cell(e['error'])}")
        o.append("")

    o.append("## Wage context (BLS) — not part of the score\n")
    o.append(f"{cell(log['bls_context']['note'])}. The family-to-occupation mapping is `[your-input]`; the wage figures are `[record]`.\n")
    o.append("| Family | SOC | Occupation | Median annual wage | OEWS year |")
    o.append("|---|---|---|---|---|")
    for fam, entries in log["bls_context"]["families"].items():
        for x in entries:
            if "title" not in x:
                o.append(f"| {fam} | {cell(x['soc_code'])} | {cell(x['status'])} | — | — |")
                continue
            w = v(x["annual_median_wage"])
            wage = f"${w:,.0f} [record]" if w is not None else cell(x["annual_median_wage"])
            o.append(f"| {fam} | {v(x['soc_code'])} (BLS {v(x['bls_soc_code'])}) | {cell(x['title'])} | {wage} | {cell(x['oews_year'])} |")
    o.append("\nWages are published per BLS code. Where it is broader than the O*NET code (e.g. 15-1299 for 15-1299.08), "
             "the figure is for the whole broader occupation (\"Computer Occupations, All Other\"), not the detailed title.\n")

    c = log["dataset_context"]
    fams = c["h1b_rows_with_family_in_top_titles"]
    o.append("## Does the title check separate companies?\n")
    o.append(f"Across all {v(c['rows_with_h1b_fields'])} companies with sponsorship data `[record]`, a title in each family "
             f"appears in the top titles of: SWE {v(fams['SWE'])}, AI {v(fams['AI'])}, Cloud {v(fams['Cloud'])} companies; "
             f"{v(c['h1b_rows_with_no_family_in_top_titles'])} show none of the three `[your-input]` (crosswalk applied to records). "
             f"Unreadable title lists: {v(c['h1b_rows_with_unreadable_titles'])} `[record]`.\n")

    o.append("## What this run cannot tell you\n")
    o.append("- Whether a company sponsors **this** occupation. The data has no SOC code, only a few top titles per company.")
    o.append("- How much a company sponsors, or how recently. There are no filing years, and the approval counts may be double-counted, so they are not used.")
    o.append("- Whether a posting is real or still open. Liveness was assumed, not checked (G3).")
    o.append("- Anything about a company that is not in the data, has no sponsorship trace, or matches more than one row. These are unknown, not \"does not sponsor\".")
    o.append(f"- Immigration eligibility. {DISCLAIMER}\n")

    o.append("## Run record\n")
    o.append(f"- Recipe: {cell(log['run']['recipe'])} · run date {cell(log['run']['run_date'])} · mode {cell(log['run']['mode'])}")
    o.append(f"- Command: `{v(log['run']['command'])}` [record]")
    for name, f in log["inputs"]["files"].items():
        o.append(f"- Input `{name}`: `{v(f)}` {tag(f)} sha256 `{f['sha256'][:16]}…`")
    for name, f in log["inputs"]["maintained_code_reused"].items():
        o.append(f"- Reused maintained code ({name}): `{v(f)}` {tag(f)}")
    sr = log.get("scorer_run")
    if sr:
        summary_line = next((ln.strip() for ln in v(sr["stdout"]).splitlines() if ln.strip().startswith("✓")), "")
        o.append(f"- Scorer: `{v(sr['command'])}` exit {v(sr['exit_code'])} [record]; stdout: `{summary_line}`")
        o.append(f"- Guards: {v(sr['sponsorship_weight_guard'])}; {v(sr['gate_echo_guard'])} [record]")
        o.append(f"- Scorer outputs: `{v(sr['files']['role_scores_json'])}`, `{v(sr['files']['role_scores_md'])}` [record]")
    o.append(f"- Agent log: `{v(log['run']['outputs']['log'])}` [record]")
    return "\n".join(o) + "\n"


def parse_args(argv):
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    for k in ("persona", "roles", "overrides", "crosswalk", "mappings", "csv", "bls"):
        ap.add_argument(f"--{k}", type=Path, default=DEFAULTS[k])
    ap.add_argument("--out-dir", dest="out_dir", type=Path, default=DEFAULTS["out_dir"])
    a = ap.parse_args(argv)
    a.argv = list(argv)
    return a


def main(argv=None) -> int:
    args = parse_args(sys.argv[1:] if argv is None else argv)
    try:
        res = build(args)
    except ConfigError as e:
        print(f"✗ stop: {e}", file=sys.stderr)
        return 2
    except ScorerError as e:
        print(f"✗ scorer: {e}", file=sys.stderr)
        return 3
    s = res["log"]["summary"]
    print(f"✓ {v(s['roles_in'])} roles · scored {v(s['roles_scored'])} · not scored {v(s['roles_not_scored'])} · "
          f"scorer {v(s['by_scorer_recommendation'])} · final {v(s['by_final_recommendation'])} · "
          f"G4 accepted {v(s['g4_accepted'])} refused {v(s['g4_refused'])} · next actions {v(s['by_next_action'])}")
    print(f"  report {rel(res['report_path'])}\n  log    {rel(res['log_path'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
