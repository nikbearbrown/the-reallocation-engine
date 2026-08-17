#!/usr/bin/env bash
# Fetch a BLS OEWS national year: fetch-oews.sh 24  → data/bls/oesm24nat/
set -euo pipefail
cd "$(dirname "$0")/../.."
YY="${1:?usage: fetch-oews.sh <2-digit-year, e.g. 24>}"
URL="https://www.bls.gov/oes/special-requests/oesm${YY}nat.zip"
LOCK="data/checksums.lock"; KEY="oesm${YY}nat.zip"; DEST="data/bls/oesm${YY}nat"; TMP="$(mktemp -d)"
echo "fetching $URL"
curl -fL -A "reallocation-engine-course (contact: repo README)" "$URL" -o "$TMP/o.zip"
SUM=$(shasum -a 256 "$TMP/o.zip" | awk '{print $1}')
if grep -q "^$KEY " "$LOCK" 2>/dev/null; then
  PIN=$(grep "^$KEY " "$LOCK" | awk '{print $2}')
  [ "$SUM" = "$PIN" ] || { echo "CHECKSUM MISMATCH for $KEY: got $SUM want $PIN — refusing."; exit 1; }
else
  mkdir -p data; echo "$KEY $SUM" >> "$LOCK"
  echo "FIRST FETCH — recorded checksum $SUM in $LOCK"
fi
mkdir -p "$DEST"; unzip -o "$TMP/o.zip" -d "$DEST"; rm -rf "$TMP"; echo "→ $DEST"
