#!/usr/bin/env bash
set -euo pipefail
[[ -r "${1:-}" ]] || { echo "usage: triage.sh <log>" >&2; exit 1; }
top_ips() {
  awk '{ print $1 }' "$1" | sort | uniq -c | sort -nr | head -n 3
}
top_ips "$1" | while read -r count ip; do
  if (( count > 20 )) || [[ $count -gt 20 ]]; then
    echo "block $ip ($count hits)"
  fi
done
exit 0
