# @cp healthy relay exits 0 | down relay prints relay down to stderr and exits 3 | trap removes the temp dir
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
cat > bin/curl <<'C'
#!/usr/bin/env bash
if [ "${RA_RELAY:-up}" = up ]; then echo '{"status":"ok"}'; exit 0; fi
echo "curl: (22) The requested URL returned error: 503" >&2; exit 22
C
chmod +x bin/curl
RA_RELAY=up ra_run; [ "$RA_CODE" = 0 ]; ra_cp $? "healthy relay exits 0" "exit $RA_CODE, stderr: $RA_ERR"
RA_RELAY=down; export RA_RELAY; ra_run; unset RA_RELAY
[ "$RA_CODE" = 3 ] && printf '%s' "$RA_ERR" | grep -q 'relay down' && ! printf '%s' "$RA_OUT" | grep -q 'relay down'; ra_cp $? "down relay prints relay down to stderr and exits 3" "exit $RA_CODE, stdout: $RA_OUT, stderr: $RA_ERR"
[ -z "$(ls -A "$TMPDIR")" ]; ra_cp $? "trap removes the temp dir" "left behind: $(ls "$TMPDIR" | tr '\n' ' ')"
