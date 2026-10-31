#!/usr/bin/env bash
set -euo pipefail
WORK=$(mktemp -d)
trap 'rm -rf "$WORK"' EXIT
curl -fsS https://relay.example/health > "$WORK/health.json" || { echo "relay down" >&2; exit 3; }
