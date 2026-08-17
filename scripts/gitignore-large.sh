#!/usr/bin/env bash
# gitignore-large.sh — ignore (and optionally untrack) files over a size limit.
#
#   scripts/gitignore-large.sh                    # dry run: just list what's big
#   scripts/gitignore-large.sh --apply            # add them to .gitignore
#   scripts/gitignore-large.sh --apply --untrack  # also stop tracking them
#   scripts/gitignore-large.sh --mb 25 --apply    # use a 25MB threshold
#
# Note: gitignore only affects the FUTURE. Files already committed stay in git
# history; shrinking that needs git filter-repo / BFG (separate, heavier job).
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

MB=50; APPLY=0; UNTRACK=0
while [ $# -gt 0 ]; do case "$1" in
  --mb) MB="$2"; shift 2;;
  --apply) APPLY=1; shift;;
  --untrack) UNTRACK=1; shift;;
  *) echo "unknown arg: $1"; exit 1;;
esac; done

START="# >>> large files auto-ignored (>${MB}MB) — managed by scripts/gitignore-large.sh"
END="# <<< end large files"

big=()
while IFS= read -r -d '' f; do
  rel="${f#./}"
  git check-ignore -q "$rel" && continue   # already ignored — skip
  big+=("$rel")
done < <(find . -path ./.git -prune -o -type f -size +"${MB}"M -print0)

if [ ${#big[@]} -eq 0 ]; then echo "No un-ignored files over ${MB}MB. Nothing to do."; exit 0; fi

echo "Files over ${MB}MB not yet ignored:"; printf '  %s\n' "${big[@]}"

if [ "$APPLY" -ne 1 ]; then
  echo; echo "(dry run — re-run with --apply to add these to .gitignore;"
  echo " add --untrack to also stop tracking them)"; exit 0
fi

touch .gitignore
awk -v s="$START" -v e="$END" '$0==s{skip=1} skip&&$0==e{skip=0;next} !skip' .gitignore > .gitignore.tmp
{ echo "$START"; printf '/%s\n' "${big[@]}" | sort -u; echo "$END"; } >> .gitignore.tmp
mv .gitignore.tmp .gitignore
echo "Updated .gitignore (${#big[@]} entries)."

if [ "$UNTRACK" -eq 1 ]; then
  for f in "${big[@]}"; do git rm --cached --quiet --ignore-unmatch "$f"; done
  echo "Untracked ${#big[@]} file(s) (kept on disk). Commit to finalize."
fi
