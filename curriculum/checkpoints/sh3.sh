# @cp prints STAMP: HITS failures in TARGET
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
printf '%s\n' "10:00 FAIL login" "10:01 OK" "10:02 FAIL token" "10:03 FAILOVER started" > relay.log
ra_run
ra_eq "prints STAMP: HITS failures in TARGET" "$RA_OUT" "$(date +%F): 3 failures in relay.log"
