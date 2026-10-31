# @cp no argument prints usage and exits 1 | existing file prints scanning and exits 0 | missing file exits 2
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
echo data > target.log
ra_run; [ "$RA_CODE" = 1 ] && printf '%s' "$RA_OUT$RA_ERR" | grep -qi usage; ra_cp $? "no argument prints usage and exits 1" "exit $RA_CODE, output: $RA_OUT"
ra_run target.log; [ "$RA_CODE" = 0 ] && printf '%s' "$RA_OUT" | grep -qi scanning; ra_cp $? "existing file prints scanning and exits 0" "exit $RA_CODE, output: $RA_OUT"
ra_run nope.log; [ "$RA_CODE" = 2 ]; ra_cp $? "missing file exits 2" "exit $RA_CODE"
