# @cp prints the top 5 IPs by request count | prints exactly 5 rows | clean.log redacts every token | clean.log keeps the rest of each line
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
: > access.log
for p in "10.0.0.1 9" "10.0.0.2 7" "8.8.8.8 12" "10.0.0.3 2" "1.1.1.1 5" "10.0.0.4 4" "10.0.0.5 1"; do set -- $p; for i in $(seq "$2"); do echo "$1 - - GET /api/$i 200" >> access.log; done; done
printf '%s\n' "user=neo token=abc123 action=login" "token=zz9 path=/ token=qq" "no secrets here" > app.log
ra_run
top=$(printf '%s\n' "$RA_OUT" | grep -oE '([0-9]+\.){3}[0-9]+' | head -n 5 | tr '\n' ' ')
ra_eq "prints the top 5 IPs by request count" "$top" "8.8.8.8 10.0.0.1 10.0.0.2 1.1.1.1 10.0.0.4 "
ra_eq "prints exactly 5 rows" "$(printf '%s\n' "$RA_OUT" | grep -cE '([0-9]+\.){3}[0-9]+')" "5"
[ -f clean.log ] && ! grep -qE 'token=(abc123|zz9|qq)' clean.log && [ "$(grep -o 'token=REDACTED' clean.log | wc -l)" = 3 ]; ra_cp $? "clean.log redacts every token" "$(cat clean.log 2>/dev/null | tr '\n' ' ')"
grep -q 'user=neo token=REDACTED action=login' clean.log 2>/dev/null && grep -q 'no secrets here' clean.log; ra_cp $? "clean.log keeps the rest of each line" "$(cat clean.log 2>/dev/null | tr '\n' ' ')"
