# @cp creates ops/intel/2026/brief.txt | lists in long format (-l) | lists hidden entries (-a)
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
ra_run
[ -f ops/intel/2026/brief.txt ]; ra_cp $? "creates ops/intel/2026/brief.txt" "file not found after running your script"
printf '%s\n' "$RA_OUT" | grep -qE '^total [0-9]+'; ra_cp $? "lists in long format (-l)" "no 'total' line in the listing"
printf '%s\n' "$RA_OUT" | grep -qE ' \.\.?$'; ra_cp $? "lists hidden entries (-a)" "no . or .. entries in the listing"
printf '%s\n' "$RA_OUT" | grep -q 'brief.txt'
