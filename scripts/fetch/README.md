# scripts/fetch/ — pinned dataset fetchers

Bulk public datasets are NOT committed (see DATA.md). Each fetcher downloads
from a pinned URL and verifies a SHA-256 recorded in `data/checksums.lock`.
First run records the checksum (trust-on-first-use, printed loudly for the
maintainer to confirm against the publisher); later runs verify against it —
a mismatch is a hard failure, because a silently-changed dataset is exactly
the provenance failure this repo exists to prevent.

    bash scripts/fetch/fetch-onet.sh     # O*NET 30.2 text DB → data/bls/db-30-2-text/
    bash scripts/fetch/fetch-oews.sh 24  # BLS OEWS national year → data/bls/oesm24nat/
    python3 scripts/sec/download-form-d-quarters.py   # SEC Form D quarters (existing)
