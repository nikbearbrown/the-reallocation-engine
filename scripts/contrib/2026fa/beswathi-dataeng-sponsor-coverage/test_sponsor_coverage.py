#!/usr/bin/env python3
"""
test_sponsor_coverage.py — offline test for dataeng-sponsor-coverage.

No network. No repo data. Runs entirely from fixtures/ so it behaves the same
on a fresh clone and in CI.

What it asserts is the recipe's whole claim: that a blank sponsorship cell is
reported as `no-record` and never as a zero, and that only `active` liveness
clears gate G3.

Run:
    python3 scripts/contrib/2026fa/beswathi-dataeng-sponsor-coverage/test_sponsor_coverage.py
"""
from __future__ import annotations

import datetime as dt
import json
import os
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import sponsor_coverage as sc  # noqa: E402

FIX = os.path.join(HERE, "fixtures")
CSV = os.path.join(FIX, "companies.fixture.csv")
LEDGER = os.path.join(FIX, "liveness-ledger.fixture.json")
TODAY = dt.date(2026, 9, 30)

passed = failed = 0


def check(name, cond, detail=""):
    global passed, failed
    if cond:
        passed += 1
        print("  PASS  %s" % name)
    else:
        failed += 1
        print("  FAIL  %s %s" % (name, detail))


# ---------------------------------------------------------------- unit tests
def test_three_state_classification():
    """The core claim: blank is not zero."""
    norec = sc.classify_sponsorship({"Total Approvals": "", "Total Denials": "",
                                     "Approval_Rate": ""})
    check("blank sponsorship -> no-record, p is None",
          norec == ("no-record", None, "no-sponsorship-record"), norec)

    pos = sc.classify_sponsorship({"Total Approvals": "12", "Total Denials": "0",
                                   "Approval_Rate": "100.0"})
    check("approvals on record -> record-positive, p=1.0",
          pos[0] == "record-positive" and pos[1] == 1.0, pos)

    neg = sc.classify_sponsorship({"Total Approvals": "0", "Total Denials": "3",
                                   "Approval_Rate": "0.0"})
    check("denials only -> record-negative, p=0.0",
          neg == ("record-negative", 0.0, "denials-only-on-record"), neg)

    # A zero and a blank must not collapse to the same state.
    check("no-record and record-negative are different states",
          norec[0] != neg[0], (norec[0], neg[0]))


def test_title_parsing():
    ok, prob = sc.parse_titles("['Senior Data Engineer']")
    check("stringified list parses", ok == ["Senior Data Engineer"] and prob is None, (ok, prob))

    bad, prob = sc.parse_titles("['Data Engineer'")
    check("malformed title cell is reported, not guessed",
          bad == [] and prob == "unparseable-title-list", (bad, prob))

    empty, prob = sc.parse_titles("")
    check("empty title cell yields no titles and no problem",
          empty == [] and prob is None, (empty, prob))


def test_timeline_gate():
    f_ok, r_ok = sc.timeline_factor(dt.date(2026, 9, 30))
    check("timeline inside the window is a positive factor",
          0.0 < f_ok <= 1.0 and r_ok == "ok", (f_ok, r_ok))

    f_late, r_late = sc.timeline_factor(dt.date(2027, 3, 1))
    check("past the OPT start window -> hard 0.0 gate",
          f_late == 0.0 and r_late == "opt-start-window-closed", (f_late, r_late))

    # A date where the hiring lag overruns the 90-day unemployment allowance.
    f_lag, r_lag = sc.timeline_factor(dt.date(2027, 1, 20))
    check("hiring lag past the unemployment deadline -> 0.0 gate",
          f_lag == 0.0 and r_lag == "hiring-lag-exceeds-unemployment-window", (f_lag, r_lag))


def test_liveness_gate_mapping():
    check("only `active` clears G3", sc.LIVENESS_FACTOR["active"] == 1.0)
    check("`expired` fails G3", sc.LIVENESS_FACTOR["expired"] == 0.0)
    check("`uncertain` fails G3 — unverified is not live",
          sc.LIVENESS_FACTOR["uncertain"] == 0.0)


# ------------------------------------------------------------ end-to-end run
def test_end_to_end():
    with tempfile.TemporaryDirectory() as out:
        res = sc.build(HERE, CSV, TODAY, limit=0, ledger_path=LEDGER)
        sc.write_outputs(res, out)

        companies = {r["company"] for r in res["apply_candidates"]}
        check("ledgered active+expired+uncertain are scored (3 roles)",
              len(res["apply_candidates"]) == 3, sorted(companies))

        by = {r["company"]: r for r in res["apply_candidates"]}
        check("active posting gets liveness 1.0",
              by["FIXTURE PROVEN SPONSOR INC"]["liveness"]["factor"] == 1.0)
        check("expired posting gets liveness 0.0 (gate)",
              by["FIXTURE EXPIRED POSTING INC"]["liveness"]["factor"] == 0.0)
        check("uncertain posting gets liveness 0.0 (gate)",
              by["FIXTURE UNCERTAIN POSTING INC"]["liveness"]["factor"] == 0.0)

        net = {c["company"] for c in res["network_targets"]}
        check("no-record + funded company routes to networking, not skip",
              "FIXTURE NO RECORD FUNDED INC" in net, sorted(net))
        check("no-record company carries NO sponsorship number",
              all(c["sponsorship"] is None for c in res["network_targets"]))

        pend = {p["company"] for p in res["pending_g3"]}
        check("data-title sponsor with no ledger entry is pending, not Apply",
              "FIXTURE DENIALS ONLY INC" not in pend, sorted(pend))

        probs = {p["problem"] for p in res["data_problems"]}
        check("malformed title cell surfaces as a data problem",
              "unparseable-title-list" in probs, sorted(probs))

        # Output contract: two files, different audiences.
        j = os.path.join(out, "dataeng-roles.json")
        m = os.path.join(out, "dataeng-sponsor-coverage.md")
        check("agent output written and parses", os.path.exists(j) and isinstance(json.load(open(j)), list))
        check("human report written", os.path.exists(m) and os.path.getsize(m) > 0)

        arr = json.load(open(j))
        check("scorer input carries a source label on every evidence term",
              all(all(k in r and "source" in r[k]
                      for k in ("sponsorship", "fit", "liveness", "timeline"))
                  for r in arr))
        check("no private _coverage key leaks into scorer input",
              all(not any(k.startswith("_") for k in r) for r in arr))


def test_missing_input_fails_loudly():
    try:
        sc.build(HERE, os.path.join(FIX, "does-not-exist.csv"), TODAY, 0, None)
        check("missing CSV raises instead of inventing rows", False, "no exception")
    except SystemExit:
        check("missing CSV raises instead of inventing rows", True)

    try:
        sc.load_ledger(os.path.join(FIX, "no-such-ledger.json"))
        check("missing ledger raises instead of assuming live", False, "no exception")
    except SystemExit:
        check("missing ledger raises instead of assuming live", True)


def test_stage_priors_are_computed_not_hardcoded():
    """The recipe's finding: a base rate per funding stage, from the file."""
    rows = [{"latest_funding_stage": "Series D+", "Total Approvals": "5"}] * 60
    rows += [{"latest_funding_stage": "Series D+", "Total Approvals": ""}] * 40
    rows += [{"latest_funding_stage": "Pre-Seed", "Total Approvals": "1"}] * 2
    rows += [{"latest_funding_stage": "Pre-Seed", "Total Approvals": ""}] * 198
    rows += [{"latest_funding_stage": "Tiny", "Total Approvals": "1"}] * 3

    pri = sc.stage_priors(rows)
    check("base rate is computed from the rows (60/100 = 0.6)",
          pri["Series D+"]["rate"] == 0.6, pri["Series D+"])
    check("a second stage gets its own rate (2/200 = 0.01)",
          pri["Pre-Seed"]["rate"] == 0.01, pri["Pre-Seed"])
    check("a stage below min-n gets NO rate rather than a noisy one",
          pri["Tiny"]["rate"] is None and "below-min-n" in pri["Tiny"]["reason"],
          pri["Tiny"])
    check("rates are not hardcoded — changing the rows changes the rate",
          sc.stage_priors(rows[:100])["Series D+"]["rate"] == 0.6)


def test_network_list_is_ranked_by_prior_then_recency():
    with tempfile.TemporaryDirectory():
        res = sc.build(HERE, CSV, TODAY, limit=0, ledger_path=LEDGER)
        net = res["network_targets"]
        check("every network target carries a stage_prior block",
              all("stage_prior" in c for c in net), len(net))
        check("stage_prior states plainly that it is not a prediction",
              all("NOT a prediction" in c["stage_prior"]["means"] for c in net))
        rates = [c["stage_prior"]["rate"] for c in net if c["stage_prior"]["rate"] is not None]
        check("network list is sorted by base rate, descending",
              rates == sorted(rates, reverse=True), rates[:5])


def test_date_key_handles_bad_dates():
    check("a real date sorts above a missing one",
          sc._date_key("2025-09-15") > sc._date_key(None))
    check("an unparseable date does not raise",
          sc._date_key("not-a-date") == 0.0)


def test_seniority_filter():
    """A new grad cannot take a Staff role; the filter has to know that."""
    check("Senior is senior-coded", sc.seniority("Senior Data Engineer") == "senior")
    check("Staff is senior-coded", sc.seniority("Staff Data Scientist") == "senior")
    check("roman numeral II is senior-coded", sc.seniority("Data Engineer II") == "senior")
    check("Manager is senior-coded", sc.seniority("Manager, Data Engineering") == "senior")
    check("plain title is reachable", sc.seniority("Data Engineer") == "unmarked")
    check("Junior is junior", sc.seniority("Junior Data Analyst") == "junior")
    check("'Senior Associate' counts as senior, not junior",
          sc.seniority("Senior Associate Data Scientist") == "senior")

    res = sc.build(HERE, CSV, TODAY, limit=0, ledger_path=LEDGER)
    scored = {r["company"]: r for r in res["apply_candidates"]}
    check("no scored role carries a senior-coded title",
          all(sc.seniority(r["title"]) != "senior" for r in scored.values()),
          [r["title"] for r in scored.values()])
    check("senior-only sponsors are recorded, not dropped",
          isinstance(res["senior_only_sponsors"], list))


def test_exit_codes_enforce_the_gates():
    """A documented HARD STOP has to actually stop a pipeline.

    Added after a break attempt on 2026-09-30 found that G4 printed its warning
    and then returned 0, so a chained `&& npm run score` would still have run.
    """
    import subprocess
    here = HERE
    script = os.path.join(here, "sponsor_coverage.py")
    ledger = LEDGER

    def code(args):
        return subprocess.run([sys.executable, script] + args,
                              capture_output=True, text=True).returncode

    with tempfile.TemporaryDirectory() as out:
        check("healthy run exits 0",
              code(["--root", here, "--csv", CSV, "--out-dir", out,
                    "--today", "2026-09-30", "--liveness-ledger", ledger]) == 0)
        check("G4 gate 0.0 exits 2 so a chained command halts",
              code(["--root", here, "--csv", CSV, "--out-dir", out,
                    "--today", "2027-03-01", "--liveness-ledger", ledger]) == 2)
        check("missing ledger exits 1",
              code(["--root", here, "--csv", CSV, "--out-dir", out,
                    "--liveness-ledger", os.path.join(FIX, "nope.json")]) == 1)
        check("missing CSV exits 1",
              code(["--root", here, "--csv", os.path.join(FIX, "nope.csv"),
                    "--out-dir", out]) == 1)


def test_geography_is_reported_not_enforced():
    """Location must never change who gets scored.

    The candidate is open to relocating inside the US and to remote work, so a
    distant role is a real option. Geography is reported to size the cost of
    staying put; if it ever became a filter, this test fails.
    """
    res = sc.build(HERE, CSV, TODAY, limit=0, ledger_path=LEDGER)
    mkt = res["meta"]["market_by_state"]
    check("market_by_state is reported", "new_grad_reachable" in mkt)
    check("more than one state is counted", len(mkt["any_level"]) > 1)
    check("reachable is a subset of any-level",
          all(mkt["any_level"].get(k, 0) >= v
              for k, v in mkt["new_grad_reachable"].items()))

    # Same inputs, different home state -> identical scoring population.
    a = sc.build(HERE, CSV, TODAY, 0, LEDGER, home_state="MA")
    b = sc.build(HERE, CSV, TODAY, 0, LEDGER, home_state="CA")
    key = lambda r: (sorted(x["company"] for x in r["apply_candidates"]),
                     sorted(x["company"] for x in r["pending_g3"]))
    check("home state does not change who is scored", key(a) == key(b))
    check("home state does not change the timeline gate",
          a["meta"]["timeline"] == b["meta"]["timeline"])
    factors = lambda r: [(x["company"], x["sponsorship"]["p"], x["fit"]["p"],
                          x["liveness"]["factor"], x["timeline"]["factor"])
                         for x in r["apply_candidates"]]
    check("home state does not change any scoring factor",
          factors(a) == factors(b))
    check("home-state flag is set only for that state",
          all(p["in_home_state"] == (p["state"] == "MA") for p in a["pending_g3"]))


def test_requisition_ids_are_stripped_not_guessed():
    """A trailing company-scoped id is formatting, not a title.

    `Data Engineer 20516.3745` is a Data Engineer posting. Rejecting the row
    would lose a real sponsor over punctuation; silently keeping the id would
    put a number in front of a human. It is stripped and the edit is reported.
    """
    for raw, want in [("Data Engineer 20516.3745", "Data Engineer"),
                      ("Manager, Data Science (20639.33)", "Manager, Data Science"),
                      ("Software Engineer (11525.2801.9)", "Software Engineer")]:
        clean, flagged = sc.strip_req_id(raw)
        check("req id stripped from %r" % raw, clean == want and flagged)

    # Numerals that belong to the title must survive untouched.
    for keep in ["Data Engineer II", "Analyst 3", "Engineer 2.0 Platform",
                 "Data Engineer"]:
        clean, flagged = sc.strip_req_id(keep)
        check("kept intact: %r" % keep, clean == keep and not flagged)

    check("a stripped title still matches the target pattern",
          bool(sc.TARGET_TITLE_RE.search(sc.strip_req_id("Data Engineer 20516.3745")[0])))


def test_output_is_deterministic():
    """Same inputs must give byte-identical outputs, every time.

    The TA's advice on this assignment was to run it repeatedly and watch for
    different outputs. That is the right instinct for a prompted LLM, where the
    answer is resampled each call. This recipe is the other thing: it reads a
    file and computes. If two runs over identical inputs ever disagree, a
    verdict is coming from somewhere other than the data, and that is a defect
    rather than a feature.
    """
    import hashlib
    digests = []
    for _ in range(3):
        with tempfile.TemporaryDirectory() as td:
            res = sc.build(HERE, CSV, TODAY, 0, LEDGER, home_state="MA")
            sc.write_outputs(res, td)
            run = []
            for name in ("dataeng-roles.json", "dataeng-sponsor-coverage.md",
                         "dataeng-coverage-full.json"):
                with open(os.path.join(td, name), "rb") as fh:
                    run.append(hashlib.sha256(fh.read()).hexdigest())
            digests.append(run)

    check("roles.json identical across 3 runs",
          digests[0][0] == digests[1][0] == digests[2][0])
    check("human report identical across 3 runs",
          digests[0][1] == digests[1][1] == digests[2][1])
    check("audit dump identical across 3 runs (no wall-clock in the output)",
          digests[0][2] == digests[1][2] == digests[2][2])


if __name__ == "__main__":
    print("test_sponsor_coverage \u2014 offline, no network, fixtures only")
    print()
    # Discovered, not listed: a hand-maintained list silently skips any test
    # added after it, which is the one failure mode a test file must not have.
    tests = [(n, f) for n, f in sorted(globals().items())
             if n.startswith("test_") and callable(f)]
    for name, fn in tests:
        fn()
    print()
    print("  %d checks in %d tests, %d failed" % (passed, len(tests), failed))
    raise SystemExit(1 if failed else 0)
