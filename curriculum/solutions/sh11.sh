export RELAY_ENV=prod
export PATH="$HOME/ops/bin:$PATH"
*/15 * * * * /opt/ops/sweep.sh >> /var/log/sweep.log 2>&1
