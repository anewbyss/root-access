chmod 700 sweep.sh
chmod 600 ~/.ssh/id_ed25519
PID=$(pgrep cryptominer)
kill -TERM "$PID"
