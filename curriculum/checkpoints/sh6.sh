# @cp archives src into dest | defaults dest to /tmp | missing src returns 1
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
mkdir -p intel out; echo secret > intel/a.txt
ra_run intel out
tar -tzf out/intel.tar.gz 2>/dev/null | grep -q 'a.txt'; ra_cp $? "archives src into dest" "out/intel.tar.gz missing or doesn't contain intel/a.txt (exit $RA_CODE)"
D="ra_default_$$_$RANDOM"; mkdir "$D"; echo x > "$D/x"
ra_run "$D"
[ -f "/tmp/$D.tar.gz" ]; ra_cp $? "defaults dest to /tmp" "/tmp/$D.tar.gz not created"; rm -f "/tmp/$D.tar.gz"
ra_run does-not-exist out; [ "$RA_CODE" = 1 ]; ra_cp $? "missing src returns 1" "exit $RA_CODE"
