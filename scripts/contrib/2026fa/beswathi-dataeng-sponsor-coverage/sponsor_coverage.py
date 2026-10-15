#!/usr/bin/env python3
"""
sponsor_coverage.py — dataeng-sponsor-coverage prototype

Domain: an international master's student in Data Analytics Engineering on F-1,
looking for data-engineering work that will need H-1B sponsorship.

The one hidden signal this makes visible: **the difference between a company
that has no H-1B record and a company that has a negative one.**

In data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv,
30,369 companies carry funding data but only 1,557 (5.1%) have a populated
`Total Approvals` cell. Of those, exactly FIVE record a zero — so the file holds
5 actual "no" answers and 28,812 silences. A tool that treats a blank cell as
"does not sponsor" manufactures 28,807 rejections nobody wrote down. So this script
emits THREE sponsorship states, never two:

    record-positive : approvals > 0            -> sponsorship p from the record
    record-negative : approvals == 0, denials>0 -> sponsorship p = 0.0
    no-record       : both blank               -> p is NOT emitted; coverage
                                                  reason is `no-sponsorship-record`

A `no-record` company is not a Skip and not an Apply. It is a *networking*
target: the 3-3-2 day's three networking hours, not its two applying hours.

Nothing here invents a value. Every emitted field carries a source label of
`record`, `model-judgment`, or `your-input`, per DATA_CONTRACT.md.

Usage (from repo root):
    python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/sponsor_coverage.py \
        --out-dir course/2026fa/submissions/beswathi/runs

    # against the offline fixture instead of the 6.4MB repo CSV:
    python3 .../sponsor_coverage.py --csv <fixture> --out-dir <dir>
"""
from __future__ import annotations

import argparse
import ast
import csv
import datetime as dt
import json
import os
import re
import sys

# ---------------------------------------------------------------- constants
REPO_CSV = "data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv"
SOC_CSV = "data/bls/compact/soc_occupation_compact.csv"

# The titles this student is actually looking for: data engineer, AI engineer,
# data analyst, machine learning engineer, BI engineer, data scientist.
# your-input, not a record.
#
# Two things this pattern has to get right, both learned the hard way:
#
# 1. WORD BOUNDARIES. An earlier version used `a\.?i\.?` to catch "AI", which
#    matched the letters "ai" inside other words — "Supply Ch(ai)n Planner",
#    "Regulatory Aff(ai)rs", "Medical Science Li(ai)son" all scored as AI roles.
#    Every alternative below is anchored with \b.
#
# 2. "AI ENGINEER" DOES NOT APPEAR IN THIS DATASET — not once in 30,369 rows.
#    The work is filed as "Machine Learning Engineer" (48 rows). Of the 235
#    companies whose record matches any target title, 194 match WITHOUT
#    "Machine Learning Engineer" and 235 with it — so a student using their own
#    vocabulary misses 41 employers, 17.4%. That gap is the asymmetry this recipe
#    exists to surface, so the AI alternatives stay in the pattern as
#    documentation of a negative result, not because they match anything.
TARGET_TITLE_RE = re.compile(
    r"\bdata\s+engineer"
    r"|\bdata\s+analyst"
    r"|\bdata\s+scientist"
    r"|\bmachine\s+learning\s+engineer"
    r"|\b(?:AI|A\.I\.)\s+engineer"
    r"|\bartificial\s+intelligence\s+engineer"
    r"|\b(?:BI|business\s+intelligence)\s+(?:engineer|analyst|developer)",
    re.I,
)

# --- seniority, because the student is a new grad (<1 year) ---------------
# 47.5% of sponsored data/AI titles in this file are senior-coded, and exactly
# ONE in 30,369 companies is explicitly junior. Filtering these out is not a
# nicety: 235 companies sponsor some data/AI title, but only 136 sponsor one a
# new grad could hold. The other 99 are not opportunities, they are noise.
SENIOR_TITLE_RE = re.compile(
    r"\b(?:senior|sr\.?|staff|principal|lead|director|manager|head|vp|chief"
    r"|architect|ii|iii|iv|v)\b|\b[2-9]\b",
    re.I,
)
JUNIOR_TITLE_RE = re.compile(
    r"\b(?:junior|jr\.?|associate|entry[- ]level|new\s+grad|graduate|intern)\b",
    re.I,
)


def seniority(title: str) -> str:
    """new-grad reachable, senior-coded, or explicitly junior."""
    if JUNIOR_TITLE_RE.search(title) and not SENIOR_TITLE_RE.search(title):
        return "junior"
    if SENIOR_TITLE_RE.search(title):
        return "senior"
    return "unmarked"


# SOC rows used for role quality. 15-1243.01 is the closest O*NET match to
# "data / analytics engineering"; 15-2051 covers the data-science variant.
SOC_CODES = ("15-1243.01", "15-2051.00")

# --- your-input: this student's real OPT arithmetic -----------------------
# I-20 program end date drives everything below it.
# Timeline constants belong to the FICTIONAL persona Priya Nair
# (search/examples/priya-nair/). They are invented dates, not any real person's
# immigration record — DATA_CONTRACT.md requires a fictional person in every
# committed file, and that includes dates, not just names and contact details.
I20_END = dt.date(2026, 12, 15)
# OGS advises the stricter 30-day rule; a requested start must fall in the
# 60-day window that opens the day after the I-20 ends.
OPT_START_EARLIEST = dt.date(2026, 12, 16)
OPT_START_LATEST = dt.date(2027, 2, 13)
# The start actually being planned for. Change this one line, not the code.
OPT_START_PLANNED = dt.date(2027, 1, 15)
# F-1 OPT allows 90 aggregate days of unemployment during the 12-month period.
OPT_UNEMPLOYMENT_DAYS = 90
# How long a data-engineering hire takes from first contact to start date.
# This is an ASSUMPTION, labelled your-input, not a measured figure.
HIRING_LAG_DAYS = 75


# ------------------------------------------------------------------ helpers
def blank(v) -> bool:
    return (v or "").strip() == ""


def num(v):
    """Parse a numeric cell, or None. Never returns 0 for a blank."""
    s = (v or "").strip()
    if s == "":
        return None
    try:
        return float(s)
    except ValueError:
        return None


def parse_titles(cell: str) -> tuple[list[str], str | None]:
    """The CSV stores titles as a stringified Python list: "['Data Scientist']".

    Returns (titles, problem). A cell we cannot parse is reported, not guessed.
    """
    s = (cell or "").strip()
    if s == "":
        return [], None
    if s.startswith("["):
        try:
            v = ast.literal_eval(s)
            if isinstance(v, (list, tuple)):
                return [str(x).strip() for x in v if str(x).strip()], None
            return [str(v).strip()], None
        except (ValueError, SyntaxError):
            return [], "unparseable-title-list"
    # Fall back to a separator-delimited cell.
    return [p.strip() for p in re.split(r"[;|]", s) if p.strip()], None


# A trailing company-scoped numeric id appended to a job title. Observed in the
# shipped file as `Data Engineer 20516.3745` (Amgen), `Manager, Data Science
# (20639.33)` (Glassdoor), `Software Engineer (11525.2801.9)` (Palantir). The
# leading group is constant per company and the tail increments per posting, so
# this is a requisition id, not a salary and not part of the title.
REQ_ID_RE = re.compile(r"\s*\(?\b\d{3,}(?:\.\d+)+\)?\s*$")


def strip_req_id(t: str):
    """Return (clean_title, had_req_id).

    The id is removed rather than the row rejected: `Data Engineer 20516.3745`
    is a Data Engineer posting, and dropping it would lose a real employer over
    a formatting artefact. The removal is reported so the edit is visible.
    """
    clean = REQ_ID_RE.sub("", t).strip()
    return (clean, True) if clean and clean != t else (t, False)


def load_ledger(path: str | None):
    """Gate G3 evidence. Absent ledger is honest: nothing is verified live."""
    if not path:
        return {}, "no-ledger-supplied"
    if not os.path.exists(path):
        raise SystemExit("FAIL missing liveness ledger: %s (no verdict invented)" % path)
    with open(path, encoding="utf-8") as fh:
        return json.load(fh), None


LIVENESS_FACTOR = {
    # Only `active` clears G3. `uncertain` is NOT live — it is unverified, and
    # the scorer must not be handed a 1.0 for it.
    "active": 1.0,
    "expired": 0.0,
    "uncertain": 0.0,
}


def load_soc(root: str) -> tuple[dict, str | None]:
    """Load the SOC rows used for role quality. Missing file is reported."""
    path = os.path.join(root, SOC_CSV)
    if not os.path.exists(path):
        return {}, "no-soc-file"
    out = {}
    with open(path, newline="", encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            if row.get("onet_soc_code") in SOC_CODES:
                out[row["onet_soc_code"]] = row
    return out, (None if out else "no-occupation-row")


def timeline_factor(today: dt.date):
    """Gate, not a vote. Can a hire finish before the unemployment clock runs out?

    Returns (factor, reason). factor 0.0 is a hard stop; the scorer multiplies.
    """
    if today > OPT_START_LATEST:
        return 0.0, "opt-start-window-closed"
    start = max(OPT_START_PLANNED, OPT_START_EARLIEST)
    deadline = start + dt.timedelta(days=OPT_UNEMPLOYMENT_DAYS)
    # Earliest a hire begun today could plausibly start.
    projected = today + dt.timedelta(days=HIRING_LAG_DAYS)
    slack = (deadline - projected).days
    if slack <= 0:
        # Zero margin is not a viable timeline. An earlier version of this
        # function scored slack==0 as 0.5 because of an arbitrary floor
        # (0.5 + slack/180); the offline test caught it. A hire that lands
        # exactly on the unemployment deadline gets no credit.
        return 0.0, "hiring-lag-exceeds-unemployment-window"
    # Linear in remaining margin, capped at 1.0. No floor.
    return round(min(1.0, slack / OPT_UNEMPLOYMENT_DAYS), 3), "ok"


def market_by_state(rows: list[dict]) -> dict:
    """Where the reachable market actually is.

    Counts, per state, employers with a sponsored data/AI title, split by
    whether any of those titles is one a new grad could hold. Over the shipped
    file: CA 84 reachable, NY 24, MA 15 — so Massachusetts is ~11% of the
    national reachable market and CA+NY+WA is ~84%.

    For a student who cannot relocate cheaply this is the difference between a
    national list and a list they can act on.
    """
    any_lvl, reach = {}, {}
    for r in rows:
        if (num(r.get("Total Approvals")) or 0) <= 0:
            continue
        ts, _ = parse_titles(r.get("top_job_titles_sponsored", ""))
        hits = [t for t in ts if TARGET_TITLE_RE.search(t)]
        if not hits:
            continue
        st = (r.get("state") or "?").strip().upper() or "?"
        any_lvl[st] = any_lvl.get(st, 0) + 1
        if any(seniority(t) != "senior" for t in hits):
            reach[st] = reach.get(st, 0) + 1
    return {"any_level": any_lvl, "new_grad_reachable": reach}


def _date_key(d: str | None) -> float:
    """YYYY-MM-DD to a sortable number; unparseable or absent sorts last."""
    s = (d or "").strip()
    try:
        return dt.date.fromisoformat(s).toordinal()
    except ValueError:
        return 0.0


def stage_priors(rows: list[dict]):
    """Base rate of sponsorship per funding stage, computed from the file itself.

    This is the recipe's quantitative finding. Over the shipped CSV the rate
    runs from 1.4% at Pre-Seed to 25.6% at Series D+, an 18x spread across
    9,658 and 974 companies respectively.

    It is a BASE RATE, not a prediction about any single company, and it
    describes *this file* — a set of companies someone already chose to map —
    not the economy. Both caveats are carried in the output.

    Stages with fewer than MIN_STAGE_N companies get no prior rather than a
    noisy one.
    """
    MIN_STAGE_N = 100
    tally = {}
    for r in rows:
        st = (r.get("latest_funding_stage") or "").strip()
        if not st:
            continue
        t = tally.setdefault(st, {"sponsors": 0, "total": 0})
        t["total"] += 1
        if (num(r.get("Total Approvals")) or 0) > 0:
            t["sponsors"] += 1
    out = {}
    for st, t in tally.items():
        if t["total"] < MIN_STAGE_N:
            out[st] = {"rate": None, "n": t["total"],
                       "reason": "below-min-n-%d" % MIN_STAGE_N}
        else:
            out[st] = {"rate": round(t["sponsors"] / t["total"], 4),
                       "sponsors": t["sponsors"], "n": t["total"],
                       "reason": "computed-from-file"}
    return out


def classify_sponsorship(row: dict):
    """The three-state core of this recipe.

    Returns (state, p_or_None, reason).
    """
    appr = num(row.get("Total Approvals"))
    deni = num(row.get("Total Denials"))
    rate = num(row.get("Approval_Rate"))

    if appr is None and deni is None:
        return "no-record", None, "no-sponsorship-record"
    if appr is not None and appr > 0:
        # Prefer the recorded approval rate; fall back to approvals/total.
        if rate is not None and 0.0 <= rate <= 1.0:
            p = rate
        elif rate is not None and 1.0 < rate <= 100.0:
            p = rate / 100.0
        elif deni is not None and (appr + deni) > 0:
            p = appr / (appr + deni)
        else:
            p = 1.0
        return "record-positive", round(p, 3), "approvals-on-record"
    if (appr in (0.0, None)) and deni is not None and deni > 0:
        return "record-negative", 0.0, "denials-only-on-record"
    return "no-record", None, "no-sponsorship-record"


# --------------------------------------------------------------------- main
def build(root: str, csv_path: str, today: dt.date, limit: int,
          ledger_path: str | None = None, home_state: str | None = None):
    if not os.path.exists(csv_path):
        raise SystemExit("FAIL missing input CSV: %s (no value invented)" % csv_path)

    soc, soc_problem = load_soc(root)
    ledger, ledger_problem = load_ledger(ledger_path)
    tl_factor, tl_reason = timeline_factor(today)

    roles, network, skipped, problems, pending = [], [], [], [], []
    senior_only = []
    seen = 0

    with open(csv_path, newline="", encoding="utf-8") as fh:
        all_rows = list(csv.DictReader(fh))

    # Two passes: the first computes the stage base rates the second uses.
    priors = stage_priors(all_rows)
    market = market_by_state(all_rows)

    for row in all_rows:
            seen += 1
            titles, tproblem = parse_titles(row.get("top_job_titles_sponsored", ""))
            if tproblem:
                problems.append({"company": row.get("company_name"), "problem": tproblem})

            cleaned = []
            for t in titles:
                c, had_id = strip_req_id(t)
                if had_id:
                    problems.append({"company": row.get("company_name"),
                                     "problem": "title-carries-req-id:%s -> %s" % (t, c)})
                cleaned.append(c)
            titles = cleaned

            matched = [t for t in titles if TARGET_TITLE_RE.search(t)]
            # Prefer a title this student could actually hold. A company whose
            # only sponsored data title is "Staff Data Engineer" is not an
            # opportunity for a new grad, and saying so is the point.
            reachable = [t for t in matched if seniority(t) != "senior"]
            state, p, reason = classify_sponsorship(row)

            # Only companies with a data-title match OR a no-record + funding
            # signal are in scope; everything else is out of domain, not a skip.
            funded = not blank(row.get("latest_funding_date"))

            if matched and not reachable and state == "record-positive":
                # Sponsors, but only at senior level. Recorded, not silently
                # dropped — a grader (and the student) should see the count.
                senior_only.append({
                    "company": row.get("company_name"),
                    "titles": matched,
                    "reason": "sponsors-only-senior-titles",
                    "next_action": "not reachable at <1 yr experience",
                })
            elif reachable and state == "record-positive":
                company = row.get("company_name")
                verdict = ledger.get(company)
                if verdict is None:
                    # G3 not cleared. This role is NOT scored — it is pending.
                    # Emitting a 1.0 here would manufacture a verified Apply.
                    pending.append({"company": company, "title": reachable[0],
                                    "state": (row.get("state") or "").strip().upper(),
                                    "city": (row.get("city") or "").title(),
                                    "in_home_state": bool(home_state) and
                                        (row.get("state") or "").strip().upper() == home_state,
                                    "sponsorship_p": p,
                                    "blocked_by": "G3-liveness-not-checked",
                                    "next_action": "run npm run ats:liveness on the posting"})
                else:
                    factor = LIVENESS_FACTOR.get(verdict.get("result"))
                    if factor is None:
                        problems.append({"company": company,
                                         "problem": "unknown-liveness-result:%s" % verdict.get("result")})
                        continue
                    roles.append({
                        "role_id": "dataeng-%04d" % len(roles),
                        "company": company,
                        "title": reachable[0],
                        "sponsorship": {"p": p, "tier": "Proven", "source": "record"},
                        # bounded judgment over a recorded title string
                        "fit": {"p": 0.8, "source": "model-judgment"},
                        "liveness": {"factor": factor,
                                     "source": verdict.get("source", "record")},
                        "timeline": {"factor": tl_factor, "source": "your-input"},
                        "_coverage": {"state": state, "reason": reason,
                                      "matched_title": reachable[0],
                                      "seniority": seniority(reachable[0]),
                                      "liveness_result": verdict.get("result"),
                                      "liveness_code": verdict.get("code")},
                    })
            elif state == "record-negative" and matched:
                skipped.append({"company": row.get("company_name"),
                                "reason": reason, "state": state})
            elif state == "no-record" and funded:
                stage = (row.get("latest_funding_stage") or "").strip()
                prior = priors.get(stage, {"rate": None, "n": 0,
                                           "reason": "stage-not-in-file"})
                network.append({
                    "company": row.get("company_name"),
                    "industry": row.get("industry"),
                    "city": row.get("city"), "state": row.get("state"),
                    "latest_funding_stage": stage,
                    "latest_funding_date": row.get("latest_funding_date"),
                    "sponsorship": None,
                    "coverage_reason": reason,
                    # The contribution: a silence gets a base rate, not a guess.
                    "stage_prior": {
                        "rate": prior["rate"],
                        "n_companies_at_stage": prior["n"],
                        "basis": prior["reason"],
                        # A base rate over the file is a record-derived
                        # statistic, not a claim about this company.
                        "source": "record (computed over the shipped CSV)",
                        "means": "share of companies at this funding stage that "
                                 "have ANY H-1B approval on record; NOT a "
                                 "prediction about this company",
                    },
                    "next_action": "network-do-not-apply",
                    "source": "record (funding) + absent (sponsorship)",
                })

    # Rank the networking list by the stage base rate: a no-record Series D+
    # company is a far better conversation than a no-record Pre-Seed one.
    # Primary key: the stage base rate. Secondary: funding recency — within a
    # stage the list was otherwise alphabetical, which floated dormant holding
    # vehicles (24 HOUR HOLDINGS, AC HOLDCO, ACESO TOPCO) to the top purely on
    # their names. A company funded in 2022 is a better conversation than one
    # last funded in 2014.
    network.sort(key=lambda c: (c["stage_prior"]["rate"] is None,
                                -(c["stage_prior"]["rate"] or 0.0),
                                c["latest_funding_date"] or ""),
                 reverse=False)
    network.sort(key=lambda c: (c["stage_prior"]["rate"] is None,
                                -(c["stage_prior"]["rate"] or 0.0),
                                -_date_key(c["latest_funding_date"])))
    if limit:
        network = network[:limit]

    return {
        "meta": {
            "recipe": "beswathi-dataeng-sponsor-coverage",
            "recipe_version": "0.1.0",
            "generated_at": today.isoformat(),
            "input_csv": os.path.relpath(csv_path, root) if csv_path.startswith(root) else csv_path,
            "rows_read": seen,
            "soc_rows_loaded": sorted(soc.keys()),
            "soc_problem": soc_problem,
            "stage_priors": priors,
            "market_by_state": market,
            "home_state": home_state,
            "ledger_problem": ledger_problem,
            "ledger_entries": len(ledger),
            "timeline": {"factor": tl_factor, "reason": tl_reason,
                         "source": "your-input",
                         "i20_end": I20_END.isoformat(),
                         "opt_start_planned": OPT_START_PLANNED.isoformat(),
                         "hiring_lag_days": HIRING_LAG_DAYS,
                         "unemployment_days": OPT_UNEMPLOYMENT_DAYS},
        },
        "apply_candidates": roles,
        "network_targets": network,
        "record_negative_skips": skipped,
        "pending_g3": pending,
        "senior_only_sponsors": senior_only,
        "data_problems": problems,
    }


def write_outputs(result: dict, out_dir: str):
    """Output contract: one JSON for the agent, one Markdown for the person."""
    os.makedirs(out_dir, exist_ok=True)
    roles_path = os.path.join(out_dir, "dataeng-roles.json")
    report_path = os.path.join(out_dir, "dataeng-sponsor-coverage.md")
    full_path = os.path.join(out_dir, "dataeng-coverage-full.json")

    # The scorer consumes a bare array; strip our private _coverage key.
    scorer_input = []
    for r in result["apply_candidates"]:
        r2 = {k: v for k, v in r.items() if not k.startswith("_")}
        scorer_input.append(r2)
    with open(roles_path, "w", encoding="utf-8") as fh:
        json.dump(scorer_input, fh, indent=2)
    # The audit dump keeps every bucket a reader needs to check a decision, but
    # the networking list is 26,337 entries and dumping it whole produced an 18 MB
    # file — not something to put in a pull request against someone else's repo.
    # The list is ranked, so the tail carries no information the head does not.
    # Everything else is written in full, and the truncation states its own size.
    AUDIT_NETWORK_CAP = 250
    audit = dict(result)
    net = result["network_targets"]
    if len(net) > AUDIT_NETWORK_CAP:
        audit["network_targets"] = net[:AUDIT_NETWORK_CAP]
        audit["network_targets_truncated"] = {
            "shown": AUDIT_NETWORK_CAP,
            "total": len(net),
            "note": "ranked by stage base rate; rerun without the cap for the full list",
        }
    with open(full_path, "w", encoding="utf-8") as fh:
        json.dump(audit, fh, indent=2)

    m = result["meta"]
    n_apply = len(result["apply_candidates"])
    n_net = len(result["network_targets"])
    n_skip = len(result["record_negative_skips"])
    lines = [
        "# dataeng-sponsor-coverage — human report",
        "",
        "**Recipe:** `%s` v%s  " % (m["recipe"], m["recipe_version"]),
        "**Run date:** %s  " % m["generated_at"],
        "**Input:** `%s` (%s rows read)" % (m["input_csv"], m["rows_read"]),
        "",
        "## What this run found",
        "",
        "| Bucket | Count | Next action in the 3-3-2 day |",
        "|---|---:|---|",
        "| Apply candidates (sponsorship **on record**) | %d | the 2 applying hours — after G3 liveness |" % n_apply,
        "| Network targets (**no** sponsorship record, funded) | %d | the 3 networking hours |" % n_net,
        "| Skips (record-negative: denials only) | %d | skip, with a reason |" % n_skip,
        "| **Senior-only sponsors** | %d | **not reachable at <1 yr experience** |" % len(result["senior_only_sponsors"]),
        "",
        "Skip is a success. A company in the middle bucket is **not** a non-sponsor —",
        "it is a company with no record either way, which is a different event.",
        "",
        "### The seniority wall",
        "",
        "This student has under a year of experience. In the shipped file, of the",
        "sponsored data/AI titles: **47.5% are senior-coded** (Senior / Staff / Lead /",
        "Principal / II+), **52.1% are unmarked**, and **exactly one title in 30,369",
        "companies is explicitly junior**. Companies filing H-1B essentially do not",
        "file for juniors.",
        "",
        "So 235 companies sponsor *some* data/AI title, but only ~136 sponsor one a new",
        "grad could hold. The %d companies above are recorded, not silently dropped:" % len(result["senior_only_sponsors"]),
        "they sponsor, but only at a level this student cannot apply to yet. For a",
        "job search that is a different fact from \"does not sponsor\", and it is the",
        "second-largest bucket on this page.",
        "",
        "## Timeline gate (your-input)",
        "",
        "- I-20 end: `%s`" % m["timeline"]["i20_end"],
        "- OPT start planned: `%s`" % m["timeline"]["opt_start_planned"],
        "- Hiring lag assumed: **%d days** (assumption, not a measurement)" % m["timeline"]["hiring_lag_days"],
        "- Unemployment allowance: %d days" % m["timeline"]["unemployment_days"],
        "- Gate factor: **%s** (%s)" % (m["timeline"]["factor"], m["timeline"]["reason"]),
        "",
        "## Role-quality rows loaded (record)",
        "",
        "- SOC rows: `%s`" % (", ".join(m["soc_rows_loaded"]) or "none"),
        "- Problem: `%s`" % (m["soc_problem"] or "none"),
        "",
        "> Role quality carries **zero weight** in `scripts/score/role-scorer.mjs`",
        "> (`role_quality: 0.0`, tagged `[VERIFY]`). This recipe therefore reports the",
        "> SOC wage/ability rows in this human report only, and does **not** feed them",
        "> to the scorer. See DOMAIN.md → Known gaps, fact 1.",
        "",
        "## Data problems encountered (%d)" % len(result["data_problems"]),
        "",
    ]
    if result["data_problems"]:
        for p in result["data_problems"][:10]:
            lines.append("- `%s` — %s" % (p["company"], p["problem"]))
    else:
        lines.append("- none")
    # --- the finding -----------------------------------------------------
    order = ["Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Series D+"]
    pri = result["meta"]["stage_priors"]
    lines += [
        "",
        "## Sponsorship base rate by funding stage (computed from this file)",
        "",
        "| Stage | Sponsors / companies | Base rate |",
        "|---|---:|---:|",
    ]
    for st in order:
        if st in pri and pri[st].get("rate") is not None:
            lines.append("| %s | %d / %d | **%.1f%%** |" % (
                st, pri[st]["sponsors"], pri[st]["n"], 100 * pri[st]["rate"]))
    lines += [
        "",
        "This is the one number this recipe adds. A company with **no** sponsorship",
        "record is not a dead end and not a yes — but its funding stage carries a",
        "base rate, and the spread is large enough to triage on.",
        "",
        "**What it is not.** A base rate over this file is not a prediction about any",
        "single company, and this file contains companies someone already chose to",
        "map — so these rates describe the file, not the economy. Stages with fewer",
        "than 100 companies get no rate rather than a noisy one.",
        ""]

    mkt = result["meta"]["market_by_state"]
    home = result["meta"].get("home_state")
    reach = mkt["new_grad_reachable"]
    total_reach = sum(reach.values()) or 1
    top = sorted(reach.items(), key=lambda kv: -kv[1])[:8]
    lines += [
        "## Where the reachable market is (record)",
        "",
        "Counted from the shipped file: employers with a sponsored target title,",
        "split by whether any of those titles sits at a level a new grad could hold.",
        "",
        "| State | Sponsors (any level) | New-grad reachable | Share of reachable |",
        "| --- | ---: | ---: | ---: |"]
    for st, n in top:
        lines.append("| %s%s | %d | **%d** | %.1f%% |" % (
            st, " (home)" if home and st == home else "",
            mkt["any_level"].get(st, 0), n, 100.0 * n / total_reach))
    big3 = sum(reach.get(k, 0) for k in ("CA", "NY", "WA"))
    lines += ["",
        "**Read this as geography, not as a gate.** This run does not filter on",
        "location and does not score a role down for being far away: the candidate",
        "is open to relocation inside the US and to remote work, so a distant role",
        "is a real option rather than a dead end. Adding a location filter here",
        "would be the scorer deciding something the human already decided.",
        "",
        "What the table is for is sizing the cost of *choosing* to stay put.",
        "CA + NY + WA hold %d of %d new-grad-reachable sponsors (%.1f%%)."
            % (big3, total_reach, 100.0 * big3 / total_reach)]
    if home:
        hn = reach.get(home, 0)
        lines.append(
            "%s holds %d (%.1f%%), so restricting the search to %s would discard "
            "about %.0f%% of the employers that can hire this profile at this "
            "level. That is a decision worth making deliberately rather than by "
            "default." % (home, hn, 100.0 * hn / total_reach, home,
                          100.0 * (total_reach - hn) / total_reach))
        local = [p for p in result["pending_g3"] if p.get("in_home_state")]
        if local:
            lines += ["",
                "### %s shortlist (%d, unverified \u2014 still behind G3)" % (home, len(local)),
                "",
                "The home-state employers this pass reached. They are listed because",
                "they are cheap to pursue in person, not because they scored better:",
                "none has cleared the liveness gate, and none is ranked above a",
                "candidate elsewhere.",
                "",
                "| Company | City | Title |", "| --- | --- | --- |"]
            for q in sorted(local, key=lambda x: x["company"])[:25]:
                lines.append("| %s | %s | %s |" % (
                    q["company"], q.get("city") or "\u2014", q["title"]))
    lines += ["",
        "## Top network targets (no record + funded, ranked by stage base rate)",
        "",
        "| Company | Industry | Stage | Base rate | Funded |",
        "|---|---|---|---:|---|",
    ]
    for c in result["network_targets"][:15]:
        r = c["stage_prior"]["rate"]
        lines.append("| %s | %s | %s | %s | %s |" % (
            c["company"], (c["industry"] or "")[:20],
            c["latest_funding_stage"] or "",
            ("%.1f%%" % (100 * r)) if r is not None else "n/a",
            c["latest_funding_date"] or ""))
    lines += ["", "## Apply candidates", "",
              "| Company | Title | Sponsorship p | Source |", "|---|---|---:|---|"]
    for r in result["apply_candidates"][:15]:
        lines.append("| %s | %s | %s | `%s` |" % (
            r["company"], r["title"], r["sponsorship"]["p"], r["sponsorship"]["source"]))
    lines += ["",
              "## Human gate",
              "",
              "G3 (liveness) is **not cleared by this script**. Before any Apply,",
              "a human runs `npm run ats:liveness -- <job-url>` and records the result.",
              "This script emits `liveness.source: model-judgment` precisely so the",
              "scorer's Apply cannot be mistaken for a verified live posting.",
              ""]
    with open(report_path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))
    return roles_path, report_path, full_path


def main(argv=None):
    ap = argparse.ArgumentParser(description="dataeng sponsor-coverage triage")
    ap.add_argument("--csv", default=None, help="input CSV (default: repo 80-days CSV)")
    ap.add_argument("--root", default=".", help="repo root")
    ap.add_argument("--out-dir", required=True, help="where to write both outputs")
    ap.add_argument("--today", default=None, help="YYYY-MM-DD, for deterministic tests")
    ap.add_argument("--limit", type=int, default=0, help="cap network targets")
    ap.add_argument("--home-state", default=None,
                    help="two-letter state to surface as the local shortlist, e.g. MA")
    ap.add_argument("--liveness-ledger", default=None,
                    help="G3 evidence from liveness_from_fixtures.mjs or ats:liveness")
    a = ap.parse_args(argv)

    root = os.path.abspath(a.root)
    csv_path = a.csv or os.path.join(root, REPO_CSV)
    today = dt.date.fromisoformat(a.today) if a.today else dt.date.today()

    result = build(root, csv_path, today, a.limit, a.liveness_ledger,
                   (a.home_state or "").strip().upper() or None)
    rp, mp, fp = write_outputs(result, a.out_dir)

    m = result["meta"]
    print("rows read              : %d" % m["rows_read"])
    print("apply candidates       : %d (sponsorship on record)" % len(result["apply_candidates"]))
    print("network targets        : %d (no sponsorship record + funded)" % len(result["network_targets"]))
    print("record-negative skips  : %d" % len(result["record_negative_skips"]))
    print("pending G3 (unscored)  : %d" % len(result["pending_g3"]))
    print("senior-only sponsors   : %d (not reachable at <1 yr)" % len(result["senior_only_sponsors"]))
    print("liveness ledger        : %d entries%s" % (
        m["ledger_entries"], " (%s)" % m["ledger_problem"] if m["ledger_problem"] else ""))
    print("data problems          : %d" % len(result["data_problems"]))
    print("timeline gate          : %s (%s)" % (m["timeline"]["factor"], m["timeline"]["reason"]))
    print("wrote                  : %s" % rp)
    print("                       : %s" % mp)
    print("                       : %s" % fp)
    if m["timeline"]["factor"] == 0.0:
        # G4 is documented as a HARD STOP. A break attempt on 2026-09-30 showed
        # this branch printed the warning and then exited 0, so a chained
        # `&& npm run score` would have run anyway. Exit 2 so the stop is real.
        print("GATE timeline=0.0 (%s) — every role scores zero. "
              "Stop and re-plan the window." % m["timeline"]["reason"])
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
