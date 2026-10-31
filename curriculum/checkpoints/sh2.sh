# @cp counts BLACKOUT lines in any case, minus TEST
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
printf '%s\n' "BLACKOUT grid 7" "blackout harbor" "TEST BLACKOUT drill" "all clear" "Blackout north" > relay.log
ra_run
ra_eq "counts BLACKOUT lines in any case, minus TEST" "$(echo $RA_OUT)" "3"
