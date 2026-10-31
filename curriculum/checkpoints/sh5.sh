# @cp reports each host up or down | reads every line, including one with no trailing newline
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
cat > bin/ping <<'P'
#!/usr/bin/env bash
for a in "$@"; do h="$a"; done
echo "PING $h"; case "$h" in up-*) exit 0 ;; *) exit 1 ;; esac
P
chmod +x bin/ping
printf 'up-north\ndown-harbor\nup-relay\n' > hosts.txt
ra_run
ra_eq "reports each host up or down" "$RA_OUT" "$(printf 'up-north up\ndown-harbor down\nup-relay up')"
printf 'up-a\nup-b' > hosts.txt
ra_run
[ "$(printf '%s\n' "$RA_OUT" | grep -c ' up$')" -ge 1 ]; ra_cp $? "reads every line, including one with no trailing newline" "$RA_OUT"
