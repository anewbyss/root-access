# @cp sweep.sh is mode 700 | the SSH key is mode 600 | cryptominer received SIGTERM
#@@PRELUDE@@
RA_ROOT=$(mktemp -d); cd "$RA_ROOT" || exit 1
mkdir -p bin home tmp; export PATH="$RA_ROOT/bin:$PATH" HOME="$RA_ROOT/home" TMPDIR="$RA_ROOT/tmp"
cat > user.sh <<'__RA_USER__'
#@@USER@@
__RA_USER__
ra_run() { bash user.sh "$@" > out.txt 2> err.txt; RA_CODE=$?; RA_OUT=$(cat out.txt); RA_ERR=$(cat err.txt); }
echo 'echo sweep' > sweep.sh; chmod 644 sweep.sh
mkdir -p "$HOME/.ssh"; echo KEY > "$HOME/.ssh/id_ed25519"; chmod 644 "$HOME/.ssh/id_ed25519"
printf '#!/bin/bash\nwhile :; do sleep 0.1; done\n' > bin/cryptominer; chmod +x bin/cryptominer
cryptominer 30 & MINER=$!
sleep 0.2
pgrep cryptominer >/dev/null 2>&1 || { printf '#!/usr/bin/env bash\n[ "${@: -1}" = cryptominer ] && echo %s\n' "$MINER" > bin/pgrep; chmod +x bin/pgrep; }
ra_run
ra_eq "sweep.sh is mode 700" "$(stat -c %a sweep.sh)" "700"
ra_eq "the SSH key is mode 600" "$(stat -c %a "$HOME/.ssh/id_ed25519")" "600"
wait "$MINER" 2>/dev/null; st=$?
[ "$st" = 143 ]; ra_cp $? "cryptominer received SIGTERM" "process exit status $st (143 means SIGTERM; 0 means it was never killed)"
