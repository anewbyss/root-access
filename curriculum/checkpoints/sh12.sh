# @cp blocks IPs with more than 20 hits | ignores quiet IPs | exits 0 on success | unreadable or missing log exits 1
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
: > big.log
for p in "10.0.0.66 31" "8.8.4.4 25" "10.0.0.7 20" "1.1.1.1 3"; do set -- $p; for i in $(seq "$2"); do echo "$1 GET /x $i" >> big.log; done; done
ra_run big.log
printf '%s\n' "$RA_OUT" | grep -q '10\.0\.0\.66' && printf '%s\n' "$RA_OUT" | grep -q '8\.8\.4\.4'; ra_cp $? "blocks IPs with more than 20 hits" "$RA_OUT"
! printf '%s\n' "$RA_OUT" | grep -qE '10\.0\.0\.7\b|1\.1\.1\.1'; ra_cp $? "ignores quiet IPs" "20 hits isn't more than 20; output: $RA_OUT"
[ "$RA_CODE" = 0 ]; ra_cp $? "exits 0 on success" "exit $RA_CODE, stderr: $RA_ERR"
ra_run missing.log; [ "$RA_CODE" = 1 ]; ra_cp $? "unreadable or missing log exits 1" "exit $RA_CODE"
