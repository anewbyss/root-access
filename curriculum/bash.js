RA.lang("bash", { name: "Bash", tag: "SH", runtime: "pattern", why: "The shell. Every server, every pipeline, every breach response starts here." });
RA.add("bash", "sh", [
{ title: "Into the Shell", concept: "navigation, files, directories",
  lesson: `<pre>pwd                 # where am I
ls -la              # list everything, with details and hidden files
cd /var/log         # change directory (cd .. goes up, cd ~ goes home)
mkdir -p ops/logs   # create nested directories
touch notes.txt     # create an empty file
cp a b; mv a b; rm file; rm -r dir</pre><p>Paths starting with <code>/</code> are absolute. Everything else is relative to <code>pwd</code>.</p>`,
  task: `Create the nested directory <code>ops/intel/2026</code> in one command, <code>cd</code> into it, create an empty file <code>brief.txt</code> and list the contents in long format including hidden files.`,
  starter: `# your commands here\n`,
  checks: [[/mkdir\s+-p\s+ops\/intel\/2026/, "mkdir -p ops/intel/2026"], [/cd\s+ops\/intel\/2026/, "cd ops/intel/2026"], [/touch\s+brief\.txt/, "touch brief.txt"], [/ls\s+-(la|al)/, "ls -la"]] },

{ title: "Read the Logs", concept: "head, tail, grep, pipes, wc",
  lesson: `<pre>head -n 20 auth.log
tail -f auth.log                       # follow live
grep -i "failed" auth.log              # case-insensitive
grep -v "CRON" syslog                  # invert match
grep -c "Failed password" auth.log     # count matches
grep sshd auth.log | wc -l             # pipe chain</pre><p>The pipe <code>|</code> sends one command's output into the next one's input.</p>`,
  task: `Count the lines in <code>relay.log</code> that contain <code>BLACKOUT</code> (any case) but not <code>TEST</code>, using two greps, a pipe and <code>wc -l</code>.`,
  starter: `# your pipeline here\n`,
  checks: [[/grep\s+-i\s+["']?BLACKOUT["']?\s+relay\.log/, "grep -i BLACKOUT relay.log"], [/\|\s*grep\s+-v\s+["']?TEST["']?/, "| grep -v TEST"], [/\|\s*wc\s+-l/, "| wc -l"]] },

{ title: "Variables & Substitution", concept: "variables, quoting, $(...), arithmetic",
  lesson: `<pre>NAME="neo"               # no spaces around =
echo "Agent $NAME"       # double quotes expand variables
echo 'Agent $NAME'       # single quotes are literal
TODAY=$(date +%F)        # command substitution
COUNT=$((COUNT + 1))     # arithmetic
echo "\${NAME}_backup"    # braces separate the name</pre><p>Always quote variables (<code>"$file"</code>) so filenames with spaces don't break your script.</p>`,
  task: `Set <code>TARGET="relay.log"</code>, set <code>STAMP</code> to <code>$(date +%F)</code>, set <code>HITS</code> to the output of <code>grep -c FAIL "$TARGET"</code>, and echo <code>"$STAMP: $HITS failures in $TARGET"</code>.`,
  starter: `# your script here\n`,
  checks: [[/TARGET="relay\.log"/, "TARGET=\"relay.log\" (no spaces)"], [/STAMP=\$\(date \+%F\)/, "STAMP=$(date +%F)"], [/HITS=\$\(grep -c FAIL "\$TARGET"\)/, "HITS=$(grep -c FAIL \"$TARGET\")"], [/echo\s+".*\$STAMP.*\$HITS.*\$TARGET.*"/, "echo \"$STAMP: $HITS failures in $TARGET\""]] },

{ title: "Decision Gates", concept: "if, [[ ]], test operators, exit codes",
  lesson: `<pre>if [[ -f "$file" ]]; then echo "exists"
elif [[ -d "$file" ]]; then echo "dir"
else echo "missing"; fi

[[ "$a" == "$b" ]]    # strings
(( n &gt; 5 ))           # numbers
grep -q root /etc/passwd &amp;&amp; echo "found"   # exit code 0 = success
echo $?                # last exit code</pre><p>Test flags: <code>-f</code> file, <code>-d</code> directory, <code>-z</code> empty string, <code>-n</code> non-empty, <code>-x</code> executable.</p>`,
  task: `Write an if/elif/else: if <code>"$1"</code> is empty (<code>-z</code>), echo <code>usage</code> and <code>exit 1</code>. Else if it's a regular file (<code>-f</code>), echo <code>scanning</code>. Otherwise echo <code>not found</code> and <code>exit 2</code>.`,
  starter: `#!/usr/bin/env bash\n# your script here\n`,
  checks: [[/if\s+\[\[\s+-z\s+"\$1"\s+\]\]/, "if [[ -z \"$1\" ]]; then"], [/exit\s+1/, "exit 1"], [/elif\s+\[\[\s+-f\s+"\$1"\s+\]\]/, "elif [[ -f \"$1\" ]]; then"], [/exit\s+2/, "exit 2"], [/\bfi\b/, "close with fi"]] },

{ title: "Loop the Grid", concept: "for, while read, globs, ranges",
  lesson: `<pre>for f in /var/log/*.log; do
  echo "$f: $(wc -l &lt; "$f")"
done

for i in {1..5}; do echo "node$i"; done

while IFS= read -r line; do
  echo "&gt; $line"
done &lt; hosts.txt</pre><p><code>IFS= read -r</code> is the safe way to read lines exactly as written.</p>`,
  task: `Read <code>hosts.txt</code> line by line with <code>while IFS= read -r host</code>, and for each one run <code>ping -c 1 "$host"</code>. Use <code>&amp;&gt;/dev/null</code> and <code>&amp;&amp;</code>/<code>||</code> to echo <code>"$host up"</code> or <code>"$host down"</code>.`,
  starter: `# your loop here\n`,
  checks: [[/while\s+IFS=\s+read\s+-r\s+host/, "while IFS= read -r host; do"], [/ping\s+-c\s+1\s+"\$host"/, "ping -c 1 \"$host\""], [/&>\s*\/dev\/null/, "&>/dev/null"], [/done\s*<\s*hosts\.txt/, "done < hosts.txt"]] },

{ title: "Reusable Tools", concept: "functions, local, arguments $1 $@ $#, return codes",
  lesson: `<pre>backup() {
  local src="$1" dest="\${2:-/backups}"   # default value
  [[ -e "$src" ]] || return 1
  cp -r "$src" "$dest/"
}
backup ./ops /mnt/usb
echo "args: $# -&gt; $@"</pre><p><code>local</code> keeps variables inside the function. <code>"$@"</code> forwards every argument safely quoted.</p>`,
  task: `Write a function <code>archive()</code> that uses <code>local src="$1"</code> and <code>local dest="\${2:-/tmp}"</code>, returns 1 if src doesn't exist, otherwise runs <code>tar -czf "$dest/$(basename "$src").tar.gz" "$src"</code>. Then call <code>archive "$@"</code>.`,
  starter: `# your function here\n`,
  checks: [[/archive\s*\(\s*\)\s*\{/, "archive() {"], [/local\s+src="\$1"/, "local src=\"$1\""], [/local\s+dest="\$\{2:-\/tmp\}"/, "local dest=\"${2:-/tmp}\""], [/return\s+1/, "return 1"], [/tar\s+-czf/, "tar -czf ..."], [/archive\s+"\$@"/, "archive \"$@\""]] },

{ title: "Top Offenders", concept: "awk, sort, uniq, sed, cut",
  lesson: `<pre>awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -5
cut -d',' -f2 data.csv
sed 's/password=[^&amp;]*/password=REDACTED/g' app.log
awk -F: '$3 &gt;= 1000 {print $1}' /etc/passwd</pre><p><code>uniq</code> only collapses adjacent duplicates, so always <code>sort</code> first.</p>`,
  task: `Print the top 5 IPs (column 1) in <code>access.log</code> by request count. Then, in a second command, use <code>sed</code> to replace every <code>token=...</code> value with <code>token=REDACTED</code> in <code>app.log</code>, writing to <code>clean.log</code>.`,
  starter: `# your commands here\n`,
  checks: [[/awk\s+'\{\s*print\s+\$1\s*\}'\s+access\.log/, "awk '{print $1}' access.log"], [/sort\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-(nr|rn)/, "sort | uniq -c | sort -nr"], [/head\s+(-n\s*)?-?5/, "head -5"], [/sed\s+['"]s\/token=.*REDACTED\/g['"]\s+app\.log\s*>\s*clean\.log/, "sed 's/token=[^ ]*/token=REDACTED/g' app.log > clean.log"]] },

{ title: "Lockdown", concept: "permissions, ownership, processes, signals",
  lesson: `<pre>chmod 700 ops.sh        # rwx for owner only
chmod 600 id_ed25519     # private keys must be 600
chmod +x deploy.sh
chown root:root /etc/app.conf
ps aux | grep miner      # find a process
kill -TERM 4242; kill -9 4242   # polite, then forced
long_job &amp;               # background
jobs; fg %1</pre><p>Permission digits: 4 = read, 2 = write, 1 = execute, for owner, group and others.</p>`,
  task: `Make <code>sweep.sh</code> executable for its owner only (<code>700</code>), set <code>~/.ssh/id_ed25519</code> to <code>600</code>, find the PID of a process named <code>cryptominer</code> with <code>pgrep</code>, and send it SIGTERM with <code>kill</code>.`,
  starter: `# your commands here\n`,
  checks: [[/chmod\s+700\s+sweep\.sh/, "chmod 700 sweep.sh"], [/chmod\s+600\s+~\/\.ssh\/id_ed25519/, "chmod 600 ~/.ssh/id_ed25519"], [/pgrep\s+cryptominer/, "pgrep cryptominer"], [/kill\s+(-TERM|-15|-s\s+TERM)/, "kill -TERM \"$PID\""]] },

{ title: "Strict Mode", concept: "set -euo pipefail, trap, error handling",
  lesson: `<pre>#!/usr/bin/env bash
set -euo pipefail          # exit on error, unset vars, failed pipes
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT  # cleanup no matter what
trap 'echo "failed at line $LINENO" &gt;&amp;2' ERR
command_that_may_fail || { echo "fallback" &gt;&amp;2; exit 3; }</pre><p><code>&gt;&amp;2</code> sends errors to stderr. Every production script should start with strict mode.</p>`,
  task: `Start a script with a <code>#!/usr/bin/env bash</code> shebang and <code>set -euo pipefail</code>. Create <code>WORK=$(mktemp -d)</code>, register <code>trap 'rm -rf "$WORK"' EXIT</code>, then run <code>curl -fsS https://relay.example/health</code> with <code>|| { echo "relay down" &gt;&amp;2; exit 3; }</code>.`,
  starter: `# your script here\n`,
  checks: [[/^#!\/usr\/bin\/env bash/m, "#!/usr/bin/env bash"], [/set\s+-euo\s+pipefail/, "set -euo pipefail"], [/WORK=\$\(mktemp\s+-d\)/, "WORK=$(mktemp -d)"], [/trap\s+'rm -rf "\$WORK"'\s+EXIT/, "trap 'rm -rf \"$WORK\"' EXIT"], [/>&2/, "echo errors >&2"], [/exit\s+3/, "exit 3"]] },

{ title: "Wire Tap", concept: "curl, jq, HTTP APIs, JSON",
  lesson: `<pre>curl -fsSL https://api.example/v1/nodes             # -f fail on HTTP errors
curl -fsS -H "Authorization: Bearer $TOKEN" "$URL"
curl -fsS -X POST -H 'Content-Type: application/json' \\
     -d '{"node":"n7","status":"up"}' "$URL"
... | jq '.items[] | select(.online == false) | .name'
... | jq -r '.[].ip'                                 # raw strings</pre>`,
  task: `Fetch <code>https://relay.example/api/nodes</code> with <code>curl -fsS</code> and an <code>Authorization: Bearer $TOKEN</code> header. Pipe it to <code>jq -r</code> to print the <code>.name</code> of every item in <code>.nodes[]</code> where <code>.online == false</code>.`,
  starter: `# your pipeline here\n`,
  checks: [[/curl\s+-fsS/, "curl -fsS"], [/-H\s+["']Authorization: Bearer \$TOKEN["']/, "-H \"Authorization: Bearer $TOKEN\""], [/\|\s*jq\s+-r/, "| jq -r"], [/\.nodes\[\]\s*\|\s*select\(\s*\.online\s*==\s*false\s*\)\s*\|\s*\.name/, "'.nodes[] | select(.online == false) | .name'"]] },

{ title: "Sleeper Agent", concept: "environment, PATH, cron, logging",
  lesson: `<pre>export API_URL="https://relay.example"    # visible to child processes
export PATH="$HOME/bin:$PATH"
env | grep API
# crontab -e
# m  h  dom mon dow  command
  0  3  *   *   *    /opt/ops/backup.sh &gt;&gt; /var/log/backup.log 2&gt;&amp;1
*/5  *  *   *   *    /opt/ops/sweep.sh</pre><p><code>2&gt;&amp;1</code> sends stderr into the same log. Cron has a minimal PATH, so use absolute paths.</p>`,
  task: `Export <code>RELAY_ENV=prod</code>, add <code>$HOME/ops/bin</code> to the front of <code>PATH</code>, then write a crontab line that runs <code>/opt/ops/sweep.sh</code> every 15 minutes and appends both stdout and stderr to <code>/var/log/sweep.log</code>.`,
  starter: `# your lines here\n`,
  checks: [[/export\s+RELAY_ENV=prod/, "export RELAY_ENV=prod"], [/export\s+PATH="\$HOME\/ops\/bin:\$PATH"/, "export PATH=\"$HOME/ops/bin:$PATH\""], [/\*\/15\s+\*\s+\*\s+\*\s+\*\s+\/opt\/ops\/sweep\.sh/, "*/15 * * * * /opt/ops/sweep.sh"], [/>>\s*\/var\/log\/sweep\.log\s+2>&1/, ">> /var/log/sweep.log 2>&1"]] },

{ title: "Operation: First Responder", concept: "capstone: a full incident-response script",
  lesson: `<p>Build the script responders actually run in the first ten minutes of a breach. It needs strict mode, argument validation, a function, a loop and text processing, with cleanup and clear exit codes. Put together everything from ranks 1 to 11.</p>`,
  task: `Write <code>triage.sh</code>. It needs a shebang and strict mode, and should check that <code>$1</code> is a readable log file (<code>-r</code>) or <code>exit 1</code>. Define <code>top_ips()</code> using awk/sort/uniq. Loop over the top 3 IPs with <code>while read -r count ip</code>, echo a block line for any IP with <code>count -gt 20</code>, and finish with <code>exit 0</code>.`,
  starter: `#!/usr/bin/env bash\n# your script here\n`,
  checks: [[/set\s+-euo\s+pipefail/, "set -euo pipefail"], [/\[\[\s+-r\s+"\$\{?1/, "[[ -r \"$1\" ]] || exit 1"], [/top_ips\s*\(\s*\)\s*\{/, "top_ips() { ... }"], [/uniq\s+-c/, "uniq -c inside top_ips"], [/while\s+read\s+-r\s+count\s+ip/, "while read -r count ip; do"], [/-gt\s+20|>\s*20/, "compare count -gt 20"], [/exit\s+0/, "exit 0"]] }
]);
