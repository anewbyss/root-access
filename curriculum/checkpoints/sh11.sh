# @cp exports RELAY_ENV=prod | puts HOME/ops/bin first on PATH | cron line runs sweep.sh every 15 minutes | cron line appends stdout and stderr to the log
# The cron line isn't executed; it's parsed and validated.
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
cron=$(grep -oE '(^|["'"'"'(; ])[^ "'"'"'(]+( +[^ ]+){4} +/opt/ops/sweep\.sh[^"'"'"')]*' user.sh | head -n 1 | sed -E 's/^["'"'"'(; ]//')
grep -v '/opt/ops/sweep\.sh' user.sh | grep -v 'crontab' > env_only.sh
env -i HOME="$HOME" PATH="/usr/bin:/bin" bash -c 'source ./env_only.sh >/dev/null 2>&1; env' > env.txt
grep -qx 'RELAY_ENV=prod' env.txt; ra_cp $? "exports RELAY_ENV=prod" "RELAY_ENV not in the exported environment"
grep -q "^PATH=$HOME/ops/bin:" env.txt; ra_cp $? "puts HOME/ops/bin first on PATH" "$(grep ^PATH= env.txt)"
set -f; set -- $cron; set +f
{ [ "$1" = "*/15" ] || [ "$1" = "0,15,30,45" ]; } && [ "$2 $3 $4 $5" = "* * * *" ]; ra_cp $? "cron line runs sweep.sh every 15 minutes" "schedule was: $1 $2 $3 $4 $5"
printf '%s' "$cron" | grep -qE '>> *"?/var/log/sweep\.log"? +2>&1|&>> *"?/var/log/sweep\.log'; ra_cp $? "cron line appends stdout and stderr to the log" "command was: $cron"
