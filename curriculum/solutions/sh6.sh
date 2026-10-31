archive() {
  local src="$1"
  local dest="${2:-/tmp}"
  [[ -e "$src" ]] || return 1
  tar -czf "$dest/$(basename "$src").tar.gz" "$src"
}
archive "$@"
