RA.lang("javascript", { name: "JavaScript", tag: "JS", runtime: "js", why: "Runs in every browser on Earth and on servers via Node. Checkpoints run on Node." });
RA.add("javascript", "js", [
{ title: "Ghost Signal", concept: "let/const, types, template literals, functions",
  lesson: `<p>Use <code>const</code> by default and <code>let</code> when a value must change. Never use <code>var</code>. The types are <code>string</code>, <code>number</code>, <code>boolean</code>, <code>null</code>, <code>undefined</code>, <code>object</code> and <code>bigint</code>.</p><pre>const handle = "neo";
let level = 3;
level += 1;
console.log(typeof level); // "number"
const tag = \`[\${handle}]\`;  // template literal</pre><p>Functions: <code>function name(a) { return a; }</code> or arrow form <code>const name = (a) =&gt; a;</code></p>`,
  task: `Write <code>function intro(handle, level)</code> returning <code>"Agent &lt;handle&gt; // level &lt;level&gt;"</code> using a template literal.`,
  starter: `function intro(handle, level) {\n  // your code here\n}\n`,
  checks: [[/`[^`]*\$\{/, "Use a template literal with ${...}"]],
  test: { js: `return [[intro("neo",3),"Agent neo // level 3","basic"],[intro("trinity",12),"Agent trinity // level 12","two digits"]];` } },

{ title: "Triage Protocol", concept: "if/else, ===, ternary, switch, loops",
  lesson: `<p>Always compare with <code>===</code> (strict). <code>==</code> converts types and causes bugs: <code>"0" == 0</code> is true.</p><pre>if (score &gt;= 90) { ... } else if (score &gt;= 60) { ... } else { ... }
const label = online ? "UP" : "DOWN";
for (const host of hosts) { ... }      // values
for (let i = 0; i &lt; n; i++) { ... }
while (queue.length) { queue.shift(); }</pre><p>Falsy values: <code>0</code>, <code>""</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code> and <code>false</code>.</p>`,
  task: `Write <code>function threatLevel(score)</code>: 90 or above returns <code>"CRITICAL"</code>, 60 or above <code>"HIGH"</code>, 30 or above <code>"MEDIUM"</code>, otherwise <code>"LOW"</code>.`,
  starter: `function threatLevel(score) {\n  // your code here\n}\n`,
  checks: [[/if\s*\(|\?/, "Branch with if or a ternary"]],
  test: { js: `return [[95,"CRITICAL"],[90,"CRITICAL"],[60,"HIGH"],[59,"MEDIUM"],[30,"MEDIUM"],[0,"LOW"]].map(([s,w])=>[threatLevel(s),w,"score "+s]);` } },

{ title: "Filter the Swarm", concept: "arrays, objects, filter/map/reduce, destructuring",
  lesson: `<p>Array methods return new arrays and leave the original alone:</p><pre>hosts.filter(h =&gt; !h.patched)          // keep matches
     .map(h =&gt; h.name)                 // transform
     .reduce((sum, h) =&gt; sum + h, 0)   // fold to one value
hosts.find(h =&gt; h.name === "db");
hosts.some(h =&gt; h.down); hosts.every(h =&gt; h.ok);
const { name, patched = false } = host;  // destructuring
const copy = [...hosts, extra];          // spread</pre>`,
  task: `WannaCry hit unpatched machines. Write <code>function exposed(hosts)</code> that returns the <b>names</b> of hosts where <code>patched</code> is false, sorted alphabetically.`,
  starter: `function exposed(hosts) {\n  // your code here\n}\n`,
  checks: [[/\.filter\s*\(/, "Use .filter()"], [/\.map\s*\(/, "Use .map()"]],
  test: { js: `const r = exposed([{name:"nhs-x",patched:false},{name:"db",patched:true},{name:"hospital-01",patched:false}]);\nreturn [[JSON.stringify(r), JSON.stringify(["hospital-01","nhs-x"]), "filter+map+sort"],[JSON.stringify(exposed([])),"[]","empty"]];` } },

{ title: "The Counter Ritual", concept: "closures, scope, default params, rest/spread, higher-order functions",
  lesson: `<p>Functions are first-class values. A <b>closure</b> keeps access to the variables of the scope where it was created, even after that function has returned:</p><pre>function makeMultiplier(k) {
  return x =&gt; x * k;
}
const triple = makeMultiplier(3);
triple(5); // 15

function log(level = "info", ...parts) { return \`[\${level}] \${parts.join(" ")}\`; }</pre><p>Closures are how JavaScript does private state, memoization and event handlers.</p>`,
  task: `Write <code>function makeCounter(start = 0)</code> that returns a function. Each call to that function increments a private count and returns it.`,
  starter: `function makeCounter(start = 0) {\n  // your code here\n}\n`,
  checks: [[/start\s*=\s*0/, "Default param start = 0"], [/return\s+(function|\(|\w+\s*=>|\(\)\s*=>)/, "Return a function"]],
  test: { js: `const c = makeCounter(); const d = makeCounter(10);\nreturn [[c(),1,"first"],[c(),2,"second"],[d(),11,"custom start"],[c(),3,"independent"]];` } },

{ title: "Never Trust Input", concept: "string methods, regular expressions",
  lesson: `<p>Strings: <code>.toLowerCase()</code>, <code>.trim()</code>, <code>.split()</code>, <code>.includes()</code>, <code>.startsWith()</code>, <code>.slice()</code>, <code>.replaceAll()</code> and <code>.padStart()</code>.</p><p>Regular expressions describe patterns:</p><pre>/\\$\\{jndi:/i.test(input)         // i = case-insensitive
"a1b22".match(/\\d+/g)             // ["1","22"]
"10.0.0.4".replace(/\\d+$/, "x")   // "10.0.0.x"</pre><p>Log4Shell (2021) turned input like <code>\${jndi:ldap://...}</code> into code. Treat all input as hostile.</p>`,
  task: `Write <code>function isMalicious(input)</code> returning true if the string contains <code>\${jndi:</code> in any case, even with spaces inside the braces, like <code>"\${ jndi:"</code>. Otherwise return false.`,
  starter: `function isMalicious(input) {\n  // your code here\n}\n`,
  checks: [[/\/.*jndi.*\/[gimsuy]*i|toLowerCase/, "Make it case-insensitive"]],
  test: { js: `return [[isMalicious("\${jndi:ldap://x/a}"),true,"basic"],[isMalicious("\${JNDI:rmi://q}"),true,"uppercase"],[isMalicious("\${ jndi:dns://q}"),true,"spaced"],[isMalicious("hello"),false,"clean"]];` } },

{ title: "Node Registry", concept: "classes, getters, static, private #fields, inheritance",
  lesson: `<p>Classes are syntax over prototypes:</p><pre>class Node {
  #secret = "x";               // truly private
  static count = 0;
  constructor(name) { this.name = name; this.strength = 0; Node.count++; }
  boost(n) { this.strength += n; return this.strength; }
  get label() { return \`\${this.name}(\${this.strength})\`; }
}
class Relay extends Node {
  constructor(name) { super(name); this.hops = 1; }
}</pre>`,
  task: `Write <code>class Node</code> with a constructor(name) setting <code>strength = 0</code>, a <code>boost(n)</code> method that returns the new strength, and a getter <code>label</code> returning <code>"name(strength)"</code>. Then write <code>class Relay extends Node</code> whose boost doubles <code>n</code> by calling <code>super.boost(n * 2)</code>.`,
  starter: `// your code here\n`,
  checks: [[/class\s+Node/, "class Node"], [/get\s+label/, "get label()"], [/class\s+Relay\s+extends\s+Node/, "class Relay extends Node"], [/super\.boost/, "super.boost(n * 2)"]],
  test: { js: `const n = new Node("a"); n.boost(5); const r = new Relay("r"); r.boost(3);\nreturn [[n.label,"a(5)","getter"],[r.strength,6,"override"],[r instanceof Node,true,"inheritance"]];` } },

{ title: "Fail Gracefully", concept: "throw, try/catch/finally, custom Error subclasses",
  lesson: `<pre>class AccessDenied extends Error {
  constructor(msg) { super(msg); this.name = "AccessDenied"; }
}
try {
  risky();
} catch (err) {
  if (err instanceof AccessDenied) { ... } else { throw err; }  // rethrow unknowns
} finally {
  cleanup();
}</pre><p>Throw <code>Error</code> objects, never strings, so you keep the stack trace. The 2024 CrowdStrike crash was an unhandled failure path.</p>`,
  task: `Define <code>class AccessDenied extends Error</code>. Write <code>unlock(code)</code> that returns <code>"OPEN"</code> when code is <code>"0451"</code> and otherwise throws <code>new AccessDenied(...)</code>. Write <code>safeUnlock(code)</code> that returns <code>"DENIED"</code> when AccessDenied is thrown.`,
  starter: `// your code here\n`,
  checks: [[/class\s+AccessDenied\s+extends\s+Error/, "class AccessDenied extends Error"], [/throw\s+new\s+AccessDenied/, "throw new AccessDenied(...)"], [/instanceof\s+AccessDenied|catch/, "catch it"]],
  test: { js: `let threw = false; try { unlock("x"); } catch (e) { threw = e instanceof AccessDenied && e instanceof Error; }\nreturn [[unlock("0451"),"OPEN","open"],[safeUnlock("1"),"DENIED","safe"],[threw,true,"throws AccessDenied"]];` } },

{ title: "Relic Index", concept: "Map, Set, JSON, Object.entries, optional chaining, ??",
  lesson: `<pre>const counts = new Map();
counts.set(k, (counts.get(k) ?? 0) + 1);   // ?? = nullish fallback
Object.fromEntries(counts);                 // Map -&gt; plain object
new Set([1, 1, 2]).size;                    // 2
JSON.stringify(obj); JSON.parse(text);
user?.profile?.email;                       // optional chaining
Object.entries(obj).map(([k, v]) =&gt; ...)</pre><p>In real projects you'd also use ES modules: <code>export function x()</code> and <code>import { x } from "./x.js"</code>.</p>`,
  task: `Write <code>function tally(items)</code> that counts items with a <code>Map</code> and returns a plain object via <code>Object.fromEntries</code>. Write <code>function topN(items, n)</code> returning the n most common items as an array of <code>[item, count]</code>, sorted by count descending.`,
  starter: `// your code here\n`,
  checks: [[/new\s+Map/, "Use new Map()"], [/Object\.fromEntries/, "Object.fromEntries(...)"], [/\?\?/, "Use ?? for missing counts"]],
  test: { js: `const x = ["a","b","a","c","a","b"];\nreturn [[tally(x),{a:3,b:2,c:1},"tally"],[JSON.stringify(topN(x,2)),JSON.stringify([["a",3],["b",2]]),"topN"]];` } },

{ title: "Stream Engine", concept: "iterators, generators, Symbol.iterator",
  lesson: `<p>A generator function (<code>function*</code>) yields values lazily:</p><pre>function* range(n) { for (let i = 0; i &lt; n; i++) yield i; }
[...range(3)]   // [0,1,2]

class Feed {
  constructor(items) { this.items = items; }
  *[Symbol.iterator]() { yield* this.items; }
}
for (const x of new Feed([1,2])) { ... }</pre>`,
  task: `Write a generator <code>function* chunks(arr, size)</code> that yields slices of up to <code>size</code>. Then write a generator <code>function* take(iter, n)</code> that yields the first n values from any iterable.`,
  starter: `// your code here\n`,
  checks: [[/function\s*\*\s*chunks/, "function* chunks"], [/yield/, "yield values"], [/function\s*\*\s*take/, "function* take"]],
  test: { js: `function* nat(){ let i=0; while(true) yield i++; }\nreturn [[JSON.stringify([...chunks([1,2,3,4,5],2)]),"[[1,2],[3,4],[5]]","chunks"],[JSON.stringify([...take(nat(),3)]),"[0,1,2]","take infinite"]];` } },

{ title: "Swarm Sweep", concept: "Promises, async/await, Promise.all/allSettled",
  lesson: `<pre>async function load(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status);
  return res.json();
}
const results = await Promise.all(urls.map(load));        // fail fast
const settled = await Promise.allSettled(urls.map(load)); // never rejects
// settled[i] = { status: "fulfilled", value } | { status: "rejected", reason }</pre><p>JavaScript is single-threaded. <code>await</code> yields to the event loop while I/O happens.</p>`,
  task: `Write <code>async function sweep(hosts, ping)</code> where <code>ping(h)</code> returns a Promise. Ping all hosts concurrently with <code>Promise.allSettled</code> and return <code>{ up: [...], down: [...] }</code> (host names, in input order).`,
  starter: `async function sweep(hosts, ping) {\n  // your code here\n}\n`,
  checks: [[/async\s+function\s+sweep/, "async function sweep"], [/Promise\.allSettled/, "Promise.allSettled(...)"], [/await/, "await it"]],
  test: { js: `const ping = h => h.startsWith("x") ? Promise.reject(new Error("timeout")) : Promise.resolve(h);\nconst r = await sweep(["a","x1","b","x2"], ping);\nreturn [[r,{up:["a","b"],down:["x1","x2"]},"allSettled"]];` } },

{ title: "Proof of Work", concept: "testing, deep equality, recursion, edge cases",
  lesson: `<p>Teams test with <b>Vitest</b>, <b>Jest</b> or Node's built-in <code>node:test</code>:</p><pre>import { test } from "node:test";
import assert from "node:assert/strict";
test("tally", () =&gt; assert.deepEqual(tally(["a"]), { a: 1 }));</pre><p>Under the hood, <code>deepEqual</code> is recursion: compare primitives directly, then compare arrays and objects key by key. Watch for <code>null</code>, which has <code>typeof "object"</code>.</p>`,
  task: `Write <code>function deepEqual(a, b)</code> that returns true when two values are structurally equal: primitives with <code>===</code>, arrays by length and elements, plain objects by key sets and values, recursively. Handle <code>null</code>.`,
  starter: `function deepEqual(a, b) {\n  // your code here\n}\n`,
  checks: [[/deepEqual\s*\(/, "Recurse with deepEqual(...)"], [/null/, "Handle null explicitly"]],
  test: { js: `return [[deepEqual({a:[1,{b:2}]},{a:[1,{b:2}]}),true,"nested"],[deepEqual([1,2],[1,2,3]),false,"length"],[deepEqual({a:1},{b:1}),false,"keys"],[deepEqual(null,{}),false,"null"],[deepEqual(null,null),true,"null=null"],[deepEqual({a:1,b:2},{b:2,a:1}),true,"key order"]];` } },

{ title: "Operation: Log Hunter", concept: "capstone: parse, validate, aggregate, async pipeline",
  lesson: `<p>Combine everything: parsing (rank 5), Map counting (rank 8), error handling (rank 7) and async (rank 10). Production code is defensive. It skips bad records, keeps going and reports what it did.</p><pre>const valid = ip =&gt; /^(\\d{1,3})(\\.\\d{1,3}){3}$/.test(ip)
  &amp;&amp; ip.split(".").every(p =&gt; +p &lt;= 255 &amp;&amp; String(+p) === p);</pre>`,
  task: `Write <code>async function analyze(source)</code> where <code>source()</code> returns a Promise of an array of lines like <code>"10.0.0.9 FAIL"</code>. Skip malformed lines. Return <code>{ total, fails, topIp, skipped }</code>: <code>topIp</code> is the IP with the most FAILs (<code>null</code> if none) and <code>skipped</code> counts bad lines.`,
  starter: `const validIp = ip => /^(\\d{1,3})(\\.\\d{1,3}){3}$/.test(ip) && ip.split(".").every(p => +p <= 255 && String(+p) === p);\n\nasync function analyze(source) {\n  // your code here\n}\n`,
  checks: [[/await\s+source\s*\(\s*\)/, "await source()"], [/new\s+Map|\{\s*\}/, "Count with a Map or object"]],
  test: { js: `const lines = ["10.0.0.9 FAIL","10.0.0.4 OK","garbage","10.0.0.9 FAIL","999.1.1.1 FAIL","10.0.0.4 FAIL",""];\nconst r = await analyze(async () => lines);\nconst r2 = await analyze(async () => ["1.1.1.1 OK"]);\nreturn [[r,{total:4,fails:3,topIp:"10.0.0.9",skipped:3},"summary"],[r2.topIp,null,"no fails"]];` } }
]);
