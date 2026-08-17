"""Offline tests for the Workday scraper — no network, monkeypatched transport.

Ported verbatim in intent from the development smoke suite: one test function
per original check, so the count is 1:1 and every assertion tests what it did
before. Nothing here touches the network; the transport (`retry_request`) is
replaced with stubs that serve canned pages.

Run from the repo root:
    python -m pytest scripts/ats/scrapers/workday/test_scraper.py -v
"""

from __future__ import annotations

import json
import sys
from contextlib import contextmanager
from pathlib import Path

import pytest

# The `scrapers` package lives under scripts/ats/, which is not the pytest
# rootdir — put it on the path so this file runs from any working directory.
SCRIPTS_ATS = Path(__file__).resolve().parents[2]
if str(SCRIPTS_ATS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS_ATS))

from scrapers.common.schema_validator import validate_batch  # noqa: E402
from scrapers.workday import scraper as wd  # noqa: E402

WAYFAIR_URL = "https://wayfair.wd1.myworkdayjobs.com/Careers"


# --------------------------------------------------------------------------
# Test doubles
# --------------------------------------------------------------------------

class FakeResponse:
    def __init__(self, status_code, payload=None, bad_json=False):
        self.status_code = status_code
        self._payload = payload
        self._bad_json = bad_json

    def json(self):
        if self._bad_json:
            raise ValueError("Expecting value: line 1 column 1 (char 0)")
        return self._payload


def posting(i, **over):
    p = {
        "jobPostingId": f"R{1000 + i}",
        "title": f"Software Engineer {i}",
        "externalPath": f"/job/Boston/Software-Engineer-{i}_R{1000 + i}",
        "locationsText": "Boston, MA",
        "jobFamilyGroup": [{"descriptor": "Engineering"}],
        "jobScheduleType": {"descriptor": "Full time"},
        "postedOn": "Posted 30+ Days Ago",
    }
    p.update(over)
    return p


def make_pager(total, page_map=None):
    """A `retry_request` stub serving `total` postings, 20 per page."""
    calls = []

    def fake(url, method="GET", timeout=None, headers=None, json=None, **kw):
        offset = json["offset"]
        calls.append((method, offset, headers.get("Content-Type") if headers else None))
        if page_map and offset in page_map:
            return page_map[offset]
        items = [posting(i) for i in range(offset, min(offset + 20, total))]
        return FakeResponse(200, {"total": total, "jobPostings": items})

    fake.calls = calls
    return fake


@contextmanager
def patched_transport(stub):
    """Swap the module-level transport and always restore it."""
    original = wd.retry_request
    wd.retry_request = stub
    try:
        yield stub
    finally:
        wd.retry_request = original


def fetch_with(stub, company="Wayfair", url=WAYFAIR_URL):
    with patched_transport(stub):
        return wd.fetch_jobs(company, url)


# --------------------------------------------------------------------------
# 1. Pagination across 2 pages  (6 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def paginated():
    pager = make_pager(25)
    return fetch_with(pager), pager


def test_pagination_collects_25_jobs(paginated):
    result, _ = paginated
    assert result["open_job_count"] == 25


def test_pagination_issues_two_pages(paginated):
    _, pager = paginated
    assert len(pager.calls) == 2


def test_pagination_uses_post(paginated):
    _, pager = paginated
    assert all(call[0] == "POST" for call in pager.calls)


def test_pagination_sends_json_content_type(paginated):
    _, pager = paginated
    assert pager.calls[0][2] == "application/json"


def test_pagination_extraction_status_success(paginated):
    result, _ = paginated
    assert result["extraction_status"] == "success"


def test_pagination_not_flagged_empty(paginated):
    result, _ = paginated
    assert result["empty"] is False


# --------------------------------------------------------------------------
# 2. Field mapping  (11 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def mapped_record(paginated):
    result, _ = paginated
    return result["jobs"][0]


def test_map_job_id(mapped_record):
    assert mapped_record["job_id"] == "R1000"


def test_map_ats_source(mapped_record):
    assert mapped_record["ats_source"] == "workday"


def test_map_company_slug(mapped_record):
    assert mapped_record["company_slug"] == "wayfair"


def test_map_source_url_has_no_duplicate_job_segment(mapped_record):
    assert mapped_record["source_url"] == (
        "https://wayfair.wd1.myworkdayjobs.com/en-US/Careers"
        "/job/Boston/Software-Engineer-0_R1000"
    )


def test_map_apply_url_matches_source_url(mapped_record):
    assert mapped_record["apply_url"] == mapped_record["source_url"]


def test_map_location(mapped_record):
    assert mapped_record["location"] == "Boston, MA"


def test_map_department(mapped_record):
    assert mapped_record["department"] == "Engineering"


def test_map_employment_type(mapped_record):
    assert mapped_record["employment_type"] == "Full-time"


def test_map_relative_posted_on_stays_empty(mapped_record):
    """"Posted 30+ Days Ago" must not be converted into a fabricated date."""
    assert mapped_record["date_posted"] == ""


def test_map_scraper_version(mapped_record):
    assert mapped_record["metadata"]["scraper_version"] == "1.0.0"


def test_map_record_extraction_status(mapped_record):
    assert mapped_record["metadata"]["extraction_status"] == "success"


# --------------------------------------------------------------------------
# 3. Shape tolerance: list location, absolute date, decorated descriptor  (3)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def variant_record():
    stub = make_pager(1, {0: FakeResponse(200, {"total": 1, "jobPostings": [
        posting(
            0,
            locationsText=["Boston, MA", "Remote, US"],
            postedOn="2026-07-04",
            jobScheduleType={"descriptor": "Fixed Term (Fixed Term)"},
        )
    ]})})
    return fetch_with(stub)["jobs"][0]


def test_list_location_is_joined(variant_record):
    assert variant_record["location"] == "Boston, MA; Remote, US"


def test_absolute_posted_on_becomes_iso_date(variant_record):
    assert variant_record["date_posted"] == "2026-07-04"


def test_decorated_fixed_term_maps_to_contract(variant_record):
    assert variant_record["employment_type"] == "Contract"


# --------------------------------------------------------------------------
# 4. EMPTY — a successful extraction that found nothing  (5 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def empty_result():
    return fetch_with(make_pager(0), "Empty Co",
                      "https://emptyco.wd1.myworkdayjobs.com/Careers")


def test_empty_is_found(empty_result):
    assert empty_result["found"] is True


def test_empty_is_flagged_empty(empty_result):
    assert empty_result["empty"] is True


def test_empty_extraction_status_is_success(empty_result):
    """Zero postings is a real observation, not a failure."""
    assert empty_result["extraction_status"] == "success"


def test_empty_job_count_is_zero(empty_result):
    assert empty_result["open_job_count"] == 0


def test_empty_carries_no_error_string(empty_result):
    assert empty_result["error"] == ""


# --------------------------------------------------------------------------
# 5. HTTP 500 -> ERROR  (5 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def error_500():
    stub = make_pager(20, {0: FakeResponse(500, {})})
    return fetch_with(stub, "Boom", "https://boom.wd1.myworkdayjobs.com/Careers")


def test_500_not_found(error_500):
    assert error_500["found"] is False


def test_500_not_empty(error_500):
    assert error_500["empty"] is False


def test_500_extraction_status_error(error_500):
    assert error_500["extraction_status"] == "error"


def test_500_reason(error_500):
    assert error_500["error"] == "unexpected_status_500"


def test_500_claims_no_job_count(error_500):
    """An error must never report a count, not even zero."""
    assert "open_job_count" not in error_500


# --------------------------------------------------------------------------
# 6. Transport failure  (2 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def transport_failure():
    return fetch_with(lambda *a, **k: None, "Down",
                      "https://down.wd1.myworkdayjobs.com/Careers")


def test_transport_failure_reason(transport_failure):
    assert transport_failure["error"] == "request_failed"


def test_transport_failure_not_empty(transport_failure):
    assert transport_failure["empty"] is False


# --------------------------------------------------------------------------
# 7. JSON parse failure  (2 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def bad_json_result():
    stub = make_pager(20, {0: FakeResponse(200, None, bad_json=True)})
    return fetch_with(stub, "Garbled", "https://garbled.wd1.myworkdayjobs.com/Careers")


def test_json_parse_failure_reason(bad_json_result):
    assert bad_json_result["error"] == "json_parse_failed"


def test_json_parse_failure_not_empty(bad_json_result):
    assert bad_json_result["empty"] is False


# --------------------------------------------------------------------------
# 8. 404 -> not_found  (3 checks + 1 status-code check)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def not_found_404():
    stub = make_pager(20, {0: FakeResponse(404, {})})
    return fetch_with(stub, "Ghost", "https://ghost.wd1.myworkdayjobs.com/Careers")


def test_404_not_found(not_found_404):
    assert not_found_404["found"] is False


def test_404_not_empty(not_found_404):
    assert not_found_404["empty"] is False


def test_404_routes_to_not_found_bucket(not_found_404):
    """Empty `error` is what sorts a result into not_found rather than errors."""
    assert not_found_404["error"] == ""


def test_404_preserves_status_code(not_found_404):
    assert not_found_404["status_code"] == 404


# --------------------------------------------------------------------------
# 9. 422 (unknown tenant) -> not_found  (5 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def not_found_422():
    stub = make_pager(20, {0: FakeResponse(422, {})})
    return fetch_with(stub, "Fake",
                      "https://fakecorpxyz123.wd1.myworkdayjobs.com/Careers")


def test_422_not_found(not_found_422):
    assert not_found_422["found"] is False


def test_422_not_empty(not_found_422):
    assert not_found_422["empty"] is False


def test_422_routes_to_not_found_bucket(not_found_422):
    assert not_found_422["error"] == ""


def test_422_preserves_status_code(not_found_422):
    """404 and 422 share a bucket but stay distinguishable in the record."""
    assert not_found_422["status_code"] == 422


def test_422_is_not_an_invalid_url(not_found_422):
    assert not_found_422["invalid_url"] is False


# --------------------------------------------------------------------------
# 10. REGRESSION GUARD — mid-run 422 degrades to partial  (3 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def mid_run_422():
    stub = make_pager(40, {20: FakeResponse(422, {})})
    return fetch_with(stub, "Flaky422", "https://flaky.wd1.myworkdayjobs.com/Careers")


def test_mid_run_422_keeps_first_page(mid_run_422):
    assert mid_run_422["open_job_count"] == 20


def test_mid_run_422_is_partial_not_not_found(mid_run_422):
    """A 422 at offset 20 does not mean the board vanished."""
    assert mid_run_422["extraction_status"] == "partial"


def test_mid_run_422_records_reason(mid_run_422):
    assert "unexpected_status_422" in mid_run_422["error"]


# --------------------------------------------------------------------------
# 11. All records invalid -> ERROR, never EMPTY  (3 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def all_invalid():
    stub = make_pager(1, {0: FakeResponse(200, {"total": 1, "jobPostings": [
        {"externalPath": "", "title": "", "jobPostingId": ""}
    ]})})
    return fetch_with(stub, "Bad", "https://bad.wd1.myworkdayjobs.com/Careers")


def test_all_invalid_not_found(all_invalid):
    assert all_invalid["found"] is False


def test_all_invalid_not_empty(all_invalid):
    """Postings that all fail validation is an error, never an empty board."""
    assert all_invalid["empty"] is False


def test_all_invalid_reason(all_invalid):
    assert all_invalid["error"] == "validation_failed_all_records"


# --------------------------------------------------------------------------
# 12. Some records invalid -> partial  (3 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def mixed_validity():
    stub = make_pager(2, {0: FakeResponse(200, {"total": 2, "jobPostings": [
        posting(0), {"jobPostingId": "", "externalPath": "", "title": ""}
    ]})})
    return fetch_with(stub, "Mixed", "https://mixed.wd1.myworkdayjobs.com/Careers")


def test_mixed_keeps_valid_record(mixed_validity):
    assert mixed_validity["open_job_count"] == 1


def test_mixed_run_status_partial(mixed_validity):
    assert mixed_validity["extraction_status"] == "partial"


def test_mixed_restamps_surviving_record_partial(mixed_validity):
    assert mixed_validity["jobs"][0]["metadata"]["extraction_status"] == "partial"


# --------------------------------------------------------------------------
# 13. Mid-run page failure -> partial  (3 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def mid_run_503():
    stub = make_pager(40, {20: FakeResponse(503, {})})
    return fetch_with(stub, "Flaky", "https://flaky.wd1.myworkdayjobs.com/Careers")


def test_mid_run_503_keeps_first_page(mid_run_503):
    assert mid_run_503["open_job_count"] == 20


def test_mid_run_503_is_partial(mid_run_503):
    assert mid_run_503["extraction_status"] == "partial"


def test_mid_run_503_records_reason(mid_run_503):
    assert "unexpected_status_503" in mid_run_503["error"]


# --------------------------------------------------------------------------
# 14. Missing `total` -> stop on a short page  (2 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def no_total():
    stub = make_pager(5, {0: FakeResponse(200, {
        "jobPostings": [posting(i) for i in range(5)]
    })})
    return fetch_with(stub, "NoTotal", "https://nototal.wd1.myworkdayjobs.com/Careers")


def test_missing_total_still_collects_jobs(no_total):
    assert no_total["open_job_count"] == 5


def test_missing_total_is_not_an_error(no_total):
    assert no_total["extraction_status"] == "success"


# --------------------------------------------------------------------------
# 15. End-to-end: summary buckets and files on disk  (23 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def end_to_end(tmp_path_factory):
    out = tmp_path_factory.mktemp("e2e") / "workday"

    def router(url, method="GET", timeout=None, headers=None, json=None, **kw):
        offset = json["offset"]
        if "/good/" in url:
            if offset == 0:
                return FakeResponse(200, {"total": 1, "jobPostings": [posting(0)]})
            return FakeResponse(200, {"total": 1, "jobPostings": []})
        if "/emptyco/" in url:
            return FakeResponse(200, {"total": 0, "jobPostings": []})
        if "/ghost/" in url:
            return FakeResponse(404, {})
        if "/faketenant/" in url:
            return FakeResponse(422, {})
        return FakeResponse(500, {})

    with patched_transport(router):
        summary = wd.process_companies(
            [
                ("Good Co", "https://good.wd1.myworkdayjobs.com/Careers"),
                ("Empty Co", "https://emptyco.wd1.myworkdayjobs.com/Careers"),
                ("Ghost Co", "https://ghost.wd1.myworkdayjobs.com/Careers"),
                ("Boom Co", "https://boom.wd1.myworkdayjobs.com/Careers"),
                ("Fake Tenant Co", "https://faketenant.wd1.myworkdayjobs.com/Careers"),
            ],
            out,
            0.3,
        )
    return summary, out


def test_e2e_summary_has_five_buckets(end_to_end):
    summary, _ = end_to_end
    assert set(summary) == {
        "found", "empty", "not_found", "invalid_careers_url", "errors",
    }


def test_e2e_one_found(end_to_end):
    summary, _ = end_to_end
    assert len(summary["found"]) == 1


def test_e2e_one_empty(end_to_end):
    summary, _ = end_to_end
    assert len(summary["empty"]) == 1


def test_e2e_two_not_found(end_to_end):
    summary, _ = end_to_end
    assert len(summary["not_found"]) == 2


def test_e2e_not_found_status_codes_distinguishable(end_to_end):
    summary, _ = end_to_end
    assert sorted(e["status_code"] for e in summary["not_found"]) == [404, 422]


def test_e2e_422_writes_no_directory(end_to_end):
    _, out = end_to_end
    assert not (out / "faketenant").exists()


def test_e2e_one_error(end_to_end):
    summary, _ = end_to_end
    assert len(summary["errors"]) == 1


def test_e2e_writes_summary_json(end_to_end):
    _, out = end_to_end
    assert (out / "summary.json").exists()


def test_e2e_directory_keyed_by_company_slug(end_to_end):
    """Directories use normalize_company_name(), not the tenant: 'Good Co' -> 'good'."""
    summary, _ = end_to_end
    assert summary["found"][0]["slug"] == "good"


@pytest.mark.parametrize("filename", ["jobs.json", "normalized_jobs.json", "metadata.json"])
def test_e2e_found_company_writes_file(end_to_end, filename):
    _, out = end_to_end
    assert (out / "good" / filename).exists()


@pytest.mark.parametrize("filename", ["jobs.json", "normalized_jobs.json", "metadata.json"])
def test_e2e_empty_company_writes_file(end_to_end, filename):
    """An empty board is still evidence and is still saved."""
    _, out = end_to_end
    assert (out / "empty" / filename).exists()


@pytest.fixture(scope="module")
def empty_metadata(end_to_end):
    _, out = end_to_end
    return json.loads((out / "empty" / "metadata.json").read_text(encoding="utf-8"))


def test_e2e_empty_metadata_job_count_zero(empty_metadata):
    assert empty_metadata["job_count"] == 0


def test_e2e_empty_metadata_status_success(empty_metadata):
    assert empty_metadata["extraction_status"] == "success"


def test_e2e_empty_metadata_empty_flag(empty_metadata):
    assert empty_metadata["empty"] is True


def test_e2e_empty_metadata_tenant(empty_metadata):
    assert empty_metadata["tenant"] == "emptyco"


def test_e2e_empty_jobs_json_total_zero(end_to_end):
    _, out = end_to_end
    raw = json.loads((out / "empty" / "jobs.json").read_text(encoding="utf-8"))
    assert raw["total"] == 0


def test_e2e_empty_normalized_jobs_is_empty_list(end_to_end):
    _, out = end_to_end
    records = json.loads((out / "empty" / "normalized_jobs.json").read_text(encoding="utf-8"))
    assert records == []


def test_e2e_not_found_writes_nothing(end_to_end):
    _, out = end_to_end
    assert not (out / "ghost").exists()


def test_e2e_error_without_postings_writes_nothing(end_to_end):
    _, out = end_to_end
    assert not (out / "boom").exists()


# --------------------------------------------------------------------------
# 16. Every emitted record satisfies the shared schema  (1 check)
# --------------------------------------------------------------------------

def test_all_records_pass_strict_schema_validation(paginated):
    result, _ = paginated
    report = validate_batch(result["jobs"], strict=True)
    assert report["batch_passed"] and report["invalid"] == 0, report["errors"]


# --------------------------------------------------------------------------
# 17. Invalid careers URLs  (11 checks)
# --------------------------------------------------------------------------

BAD_URLS = [
    "https://wd3.myworkdayjobs.com/wayfair",       # bare pod host, no tenant
    "https://jobs.lever.co/anthropic",             # a different ATS entirely
    "https://auroragov.wd1.myworkdayjobs.com/",    # no career-site segment
    "",                                            # empty
    "not a url",                                   # unparseable
]


@pytest.fixture(scope="module")
def invalid_url_results():
    """Run every bad URL through a spying transport that must never be called."""
    calls = []

    def spy(*args, **kwargs):
        calls.append(args)
        return FakeResponse(200, {"total": 1, "jobPostings": [posting(0)]})

    with patched_transport(spy):
        results = {bad: wd.fetch_jobs("Bad Cfg", bad) for bad in BAD_URLS}
    return results, calls


@pytest.mark.parametrize("bad_url", BAD_URLS)
def test_invalid_url_is_flagged(invalid_url_results, bad_url):
    results, _ = invalid_url_results
    result = results[bad_url]
    assert result["invalid_url"] is True and result["error"] == "invalid_careers_url"


@pytest.mark.parametrize("bad_url", BAD_URLS)
def test_invalid_url_extraction_status_error(invalid_url_results, bad_url):
    results, _ = invalid_url_results
    assert results[bad_url]["extraction_status"] == "error"


def test_invalid_url_attempts_no_http_request(invalid_url_results):
    """A malformed URL is a config fault — nothing should reach the network."""
    _, calls = invalid_url_results
    assert len(calls) == 0


# --------------------------------------------------------------------------
# 18. Invalid careers URL, end to end  (2 checks)
# --------------------------------------------------------------------------

@pytest.fixture(scope="module")
def invalid_url_end_to_end(tmp_path_factory):
    out = tmp_path_factory.mktemp("e2e_invalid") / "workday"
    with patched_transport(lambda *a, **k: FakeResponse(500, {})):
        summary = wd.process_companies(
            [("Bad Cfg", "https://jobs.lever.co/anthropic")], out, 0.3
        )
    return summary, out


def test_invalid_url_gets_its_own_bucket(invalid_url_end_to_end):
    summary, _ = invalid_url_end_to_end
    assert len(summary["invalid_careers_url"]) == 1 and not summary["errors"]


def test_invalid_url_writes_no_company_directory(invalid_url_end_to_end):
    _, out = invalid_url_end_to_end
    assert [p.name for p in out.iterdir()] == ["summary.json"]
