#!/usr/bin/env python3
"""build_roles.py — build a roles.json for the Bayesian Role Scorer from the
80 Days to Stay sponsorship CSV, for an ML/RAG engineer on an F-1 OPT clock.

Spec: course/2026fa/submissions/omraut888/CHANGE-BRIEF.md, [TODO: DEV] item 2.

    python3 scripts/contrib/2026fa/omraut888-ml-h1b-timeline/build_roles.py --out <dir>
    npm run score -- <dir>/roles.json --out-dir <dir>

Writes <dir>/roles.json (scorer input, one record per matched company) and
<dir>/build-audit.json (counts in/out, skips and why, every assumption used).
No network access: ATS detection needs live-network approval (brief, gate 3),
so every role is labeled liveness_checked=false.

Every number carries a source label, following the scorer's convention:
record (read from a file), model-judgment (a proxy computed here),
your-input (an asserted assumption).
"""

from __future__ import annotations

import argparse
import ast
import csv
import datetime as dt
import json
import re
import sys
from pathlib import Path

import yaml

REPO = Path(__file__).resolve().parents[4]
SPONSORSHIP_CSV = REPO / "data/80-days-to-stay/80-days-csv/mapped_student_employment_targets_v3.csv"
PERSONA_DIR = REPO / "search/examples/priya-nair"

# Fixed so the unemployment-day count doesn't drift between runs (brief: career situation).
AS_OF = dt.date(2026, 9, 30)

# ML/AI/data-role title keywords. A company qualifies if ANY of its sponsored
# titles matches. Expected to produce false positives and negatives (brief: prediction).
# Whole words, like fit matching: an unanchored "llm" matched inside "Fulfillment".
# The two stems only need a leading boundary so they cover scientist/science.
TITLE_WORDS = ["machine learning", "ml", "ai", "artificial intelligence", "nlp", "llm", "llms", "deep learning"]
TITLE_STEMS = ["data scien", "applied scien"]
TITLE_KEYWORDS = re.compile(
    "|".join([rf"(?<!\w){re.escape(w)}(?!\w)" for w in TITLE_WORDS] + [rf"(?<!\w){re.escape(s)}" for s in TITLE_STEMS]),
    re.I,
)

SHRINKAGE_C = 5            # your-input: pseudo-count pulling small samples toward the prior
# your-input: chosen, not derived. A company with zero approved petitions on record is
# treated as a below-average prospect instead of being blended toward the ~98% subset
# prior. Only 5 zero-approval companies exist, with counts that look doubled, so a
# data-derived prior for them would not be trustworthy either.
ZERO_APPROVAL_PRIOR = 0.3
PROVEN_MIN_APPROVALS = 5   # your-input: tier cutoff (Proven >= 5, Likely 1-4, Unknown 0)

# your-input: two-bucket hiring-lag heuristic on latest_funding_stage.
LATE_STAGES = {"Series C", "Series D+"}
LAG_DAYS_LATE = 56    # upper end of gaps.md's observed 6-10 week big-company loops
LAG_DAYS_EARLY = 21   # gaps.md: favor companies whose loops finish in under 5 weeks

LIVENESS_METHOD = "not run — requires live-network approval"


def load_persona(persona_dir: Path) -> dict:
    profile = yaml.safe_load((persona_dir / "profile.yml").read_text(encoding="utf-8"))
    resume = json.loads((persona_dir / "resume.example.json").read_text(encoding="utf-8"))
    skills = []
    for key, values in resume.get("skills", {}).items():
        # skills the persona has not shipped are not evidence of fit
        if key in ("agent_note", "familiar_with_not_shipped") or not isinstance(values, list):
            continue
        skills.extend(values)
    target = profile["target_role"]
    return {
        "visa": profile["visa"],
        "skills": sorted(set(skills), key=str.lower),
        "target_tokens": sorted(tokens(f"{target['primary']} {target['secondary']}")),
    }


def tokens(text: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", text.lower()))


def usable_days(visa: dict, as_of: dt.date) -> int:
    """Unemployment days left minus the buffer, or 0 once the OPT window has closed."""
    if as_of > visa["opt_end_date"]:
        return 0
    left = visa["unemployment_ceiling"] - visa["unemployment_days_used"] - visa["buffer_target"]
    return max(0, left)


def timeline_factor(days: int, lag_days: int) -> float:
    return round(min(1.0, days / lag_days), 4)


def lag_for_stage(stage: str) -> int:
    # a blank stage gets the slow bucket: assuming a fast loop would inflate the gate
    return LAG_DAYS_EARLY if stage and stage not in LATE_STAGES else LAG_DAYS_LATE


def shrunk_p(approvals: float, denials: float, prior: float, c: float = SHRINKAGE_C) -> float:
    return round((approvals + c * prior) / (approvals + denials + c), 4)


def sponsorship_prior(subset: list[dict]) -> float:
    # pooled over all decisions: averaging per-company rates let a 1-for-1 company
    # weigh as much as one with thousands of filings
    approvals = sum(float(r["Total Approvals"]) for r in subset)
    decisions = approvals + sum(float(r["Total Denials"] or 0) for r in subset)
    if not decisions:
        raise ValueError("no H-1B decisions to set a prior from")
    return approvals / decisions


def tier_for(approvals: float) -> str:
    if approvals >= PROVEN_MIN_APPROVALS:
        return "Proven"
    return "Likely" if approvals >= 1 else "Unknown"


def fit_p(target_tokens: list[str], titles: list[str]) -> tuple[float, list[str]]:
    """Share of the persona's target-role words that appear as whole words in the
    company's matched titles. A crude keyword-overlap proxy, not a semantic match.

    Run 1 matched resume skills against titles instead and scored 0 on all 185
    companies: job titles don't name tools like MLflow or LangGraph."""
    hits = sorted(set(target_tokens) & tokens(" ".join(titles)))
    return (round(min(1.0, len(hits) / len(target_tokens)), 4) if target_tokens else 0.0), hits


def slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def build(csv_path: Path, persona: dict, as_of: dt.date) -> tuple[list[dict], dict]:
    with csv_path.open(newline="", encoding="utf-8", errors="replace") as f:
        rows = list(csv.DictReader(f))
    subset = [r for r in rows if r["Total Approvals"].strip()]
    prior = sponsorship_prior(subset)
    days = usable_days(persona["visa"], as_of)

    roles, skipped = [], {"unparseable-titles": [], "no-approval-rate": []}
    for r in subset:
        try:
            titles = ast.literal_eval(r["top_job_titles_sponsored"])
        except (ValueError, SyntaxError):
            skipped["unparseable-titles"].append(r["company_name"])
            continue
        if not any(TITLE_KEYWORDS.search(t) for t in titles):
            continue
        if not r["Approval_Rate"].strip():
            skipped["no-approval-rate"].append(r["company_name"])
            continue

        approvals, denials = float(r["Total Approvals"]), float(r["Total Denials"] or 0)
        role_prior = ZERO_APPROVAL_PRIOR if approvals == 0 else prior
        stage = r["latest_funding_stage"]
        lag = lag_for_stage(stage)
        matched = [t for t in titles if TITLE_KEYWORDS.search(t)]
        fit, fit_hits = fit_p(persona["target_tokens"], matched)
        roles.append({
            "role_id": slug(r["company_name"]),
            "company": r["company_name"],
            "title": "; ".join(matched),
            "sponsorship": {
                "p": shrunk_p(approvals, denials, role_prior),
                "tier": tier_for(approvals),
                "source": (f"record (approvals/denials) shrunk toward your-input zero-approval prior {ZERO_APPROVAL_PRIOR}; C={SHRINKAGE_C} your-input"
                           if approvals == 0 else
                           f"record (approvals/denials, shrunk toward prior {prior:.4f}; C={SHRINKAGE_C} your-input)"),
            },
            "fit": {"p": fit, "source": "model-judgment (target-role word overlap with matched sponsored titles)"},
            "liveness": {"factor": 1.0, "source": f"not checked — {LIVENESS_METHOD}"},
            "timeline": {
                "factor": timeline_factor(days, lag),
                "source": f"your-input ({days} usable days as of {as_of} / {lag}-day assumed lag for stage {stage or 'blank'})",
            },
            # context only: the scorer reads none of the fields below
            "liveness_checked": False,
            "liveness_method": LIVENESS_METHOD,
            "evidence": {
                "total_approvals": approvals,
                "total_denials": denials,
                "approval_rate_raw": float(r["Approval_Rate"]),
                "median_salary_offered": float(r["median_salary_offered"]) if r["median_salary_offered"].strip() else None,
                "median_salary_note": "company-wide median across all sponsored filings, not this role's pay",
                "total_funding": float(r["total_funding"]) if r["total_funding"].strip() else None,
                "latest_funding_stage": stage or None,
                "sponsored_titles": titles,
                "fit_tokens_matched": fit_hits,
            },
        })

    audit = {
        "as_of": as_of.isoformat(),
        "source_csv": str(csv_path.relative_to(REPO)) if csv_path.is_relative_to(REPO) else str(csv_path),
        "rows_in_csv": len(rows),
        "rows_with_h1b_data": len(subset),
        "roles_built": len(roles),
        "skipped": {k: {"count": len(v), "companies": v} for k, v in skipped.items()},
        "tiers": {t: sum(1 for x in roles if x["sponsorship"]["tier"] == t) for t in ("Proven", "Likely", "Unknown")},
        "roles_with_fit_above_zero": sum(1 for x in roles if x["fit"]["p"] > 0),
        "assumptions": {
            "sponsorship_prior": {"value": round(prior, 4), "source": "record: sum(Total Approvals) / sum(Total Approvals + Total Denials) over the H-1B subset"},
            "zero_approval_prior": {"value": ZERO_APPROVAL_PRIOR, "applies_to": "companies with 0 approvals only",
                                    "source": "your-input: chosen, not derived; only 5 zero-approval companies exist and their "
                                              "counts look doubled, so a data-derived prior would not be trustworthy"},
            "shrinkage_c": {"value": SHRINKAGE_C, "source": "your-input"},
            "proven_min_approvals": {"value": PROVEN_MIN_APPROVALS, "source": "your-input"},
            "usable_days": {"value": days, "source": "record: persona profile.yml (ceiling - used - buffer), as of the fixed date"},
            "lag_days": {"late_stage": LAG_DAYS_LATE, "early_stage": LAG_DAYS_EARLY,
                         "late_stages": sorted(LATE_STAGES), "source": "your-input, from persona gaps.md"},
            "fit_target_tokens": {"value": persona["target_tokens"], "source": "record: persona profile.yml target_role"},
        },
    }
    return roles, audit


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--out", required=True, type=Path, help="output directory for roles.json and build-audit.json")
    ap.add_argument("--csv", type=Path, default=SPONSORSHIP_CSV)
    ap.add_argument("--persona-dir", type=Path, default=PERSONA_DIR)
    args = ap.parse_args()

    roles, audit = build(args.csv, load_persona(args.persona_dir), AS_OF)
    args.out.mkdir(parents=True, exist_ok=True)
    (args.out / "roles.json").write_text(json.dumps(roles, indent=2) + "\n", encoding="utf-8")
    (args.out / "build-audit.json").write_text(json.dumps(audit, indent=2) + "\n", encoding="utf-8")

    skips = ", ".join(f"{k} {v['count']}" for k, v in audit["skipped"].items())
    print(f"built {audit['roles_built']} roles from {audit['rows_with_h1b_data']} H-1B rows "
          f"({audit['rows_in_csv']} in CSV); skipped: {skips}", file=sys.stderr)
    print(f"tiers {audit['tiers']}; fit > 0 on {audit['roles_with_fit_above_zero']}/{audit['roles_built']}; "
          f"usable days {audit['assumptions']['usable_days']['value']} as of {audit['as_of']}", file=sys.stderr)
    print(f"  {args.out / 'roles.json'}  +  {args.out / 'build-audit.json'}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
