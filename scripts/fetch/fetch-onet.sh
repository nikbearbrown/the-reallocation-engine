#!/usr/bin/env bash
# Fetch the O*NET 30.2 text database (the release this repo's compact extract
# was derived from). URL pattern per onetcenter.org versioned downloads —
# verify on first run. ~13 MB zip; extracts only the files the pipeline uses.
set -euo pipefail
cd "$(dirname "$0")/../.."
URL="https://www.onetcenter.org/dl_files/database/db_30_2_text.zip"
LOCK="data/checksums.lock"; KEY="onet-db_30_2_text.zip"
DEST="data/bls/db-30-2-text"; TMP="$(mktemp -d)"
echo "fetching $URL"
curl -fL "$URL" -o "$TMP/db.zip"
SUM=$(shasum -a 256 "$TMP/db.zip" | awk '{print $1}')
if grep -q "^$KEY " "$LOCK" 2>/dev/null; then
  PIN=$(grep "^$KEY " "$LOCK" | awk '{print $2}')
  [ "$SUM" = "$PIN" ] || { echo "CHECKSUM MISMATCH for $KEY: got $SUM want $PIN — refusing."; exit 1; }
  echo "checksum verified: $SUM"
else
  mkdir -p data; echo "$KEY $SUM" >> "$LOCK"
  echo "FIRST FETCH — recorded checksum $SUM in $LOCK (maintainer: confirm against onetcenter.org)"
fi
mkdir -p "$DEST"
# extract only what the pipeline reads (see scripts/bls/extract-soc-occupation-table.py)
unzip -o -j "$TMP/db.zip" "*/Occupation Data.txt" "*/Skills.txt" "*/Knowledge.txt" \
  "*/Abilities.txt" "*/Work Activities.txt" "*/Task Ratings.txt" -d "$DEST" || unzip -o "$TMP/db.zip" -d "$DEST"
rm -rf "$TMP"; echo "→ $DEST"
