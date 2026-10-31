# @cp prints offline node names | raw output (-r) has no quotes | sends the Bearer token header
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
cat > bin/curl <<'C'
#!/usr/bin/env bash
auth=0; for a in "$@"; do [ "$a" = "Authorization: Bearer s3cret" ] && auth=1; done
[ "$auth" = 1 ] || { echo "curl: (22) The requested URL returned error: 401" >&2; exit 22; }
echo '{"nodes":[{"name":"north","online":true},{"name":"harbor","online":false},{"name":"relay-7","online":false}]}'
C
chmod +x bin/curl
if ! command -v jq >/dev/null 2>&1; then
cat > bin/jq <<'JQ'
#!/usr/bin/env python3
# Minimal jq subset (Judge0's Bash image has no jq; CI uses the real one): -r, .a.b, .a[], select(.k == v / != v), pipes.
import json, sys, re
args = [a for a in sys.argv[1:] if not a.startswith("-")]
raw = "-r" in sys.argv
flt = args[0] if args else "."
def path(v, p):
    out = [v]
    for tok in re.findall(r"\.(\w+)|(\[\])", p):
        nxt = []
        for x in out:
            if tok[0]: nxt.append(x.get(tok[0]) if isinstance(x, dict) else None)
            else: nxt.extend(x if isinstance(x, list) else list(x.values()))
        out = nxt
    return out
def stage(vals, s):
    s = s.strip()
    m = re.match(r"select\((.+?)\s*(==|!=)\s*(.+)\)$", s)
    if m:
        want = json.loads(m.group(3))
        return [v for v in vals if (path(v, m.group(1))[0] == want) == (m.group(2) == "==")]
    return [r for v in vals for r in path(v, s)]
vals = [json.load(sys.stdin)]
for s in flt.split("|"): vals = stage(vals, s)
for v in vals: print(v if raw and isinstance(v, str) else json.dumps(v))
JQ
chmod +x bin/jq; fi
TOKEN=s3cret; export TOKEN; ra_run
ra_eq "prints offline node names" "$RA_OUT" "$(printf 'harbor\nrelay-7')"
printf '%s' "$RA_OUT" | grep -q '"'; [ $? = 1 ]; ra_cp $? "raw output (-r) has no quotes" "$RA_OUT"
TOKEN=wrong; ra_run; [ -z "$RA_OUT" ]; ra_cp $? "sends the Bearer token header" "with a wrong token you still printed: $RA_OUT"
