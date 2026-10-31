#!/usr/bin/env bash
if [[ -z "$1" ]]; then
  echo "usage: $0 <file>"
  exit 1
elif [[ -f "$1" ]]; then
  echo "scanning $1"
else
  echo "not found: $1"
  exit 2
fi
