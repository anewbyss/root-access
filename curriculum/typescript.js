RA.lang("typescript", { name: "TypeScript", tag: "TS", runtime: "ts", why: "JavaScript with a type system. The default for serious web and Node teams. Checkpoints type-check and run it." });
RA.add("typescript", "ts", [
{ title: "Typed Signal", concept: "type annotations, inference, primitives",
  lesson: `<p>TypeScript checks your code before it runs, then compiles to plain JavaScript.</p><pre>let handle: string = "neo";
const level = 3;                  // inferred as 3 (literal type)
function tag(name: string): string { return \`[\${name}]\`; }
let maybe: string | undefined;</pre><p>Annotate function parameters and public return types, and let inference handle local variables. Turn on <code>"strict": true</code> in <code>tsconfig.json</code>.</p>`,
  task: `Write <code>function intro(handle: string, level: number): string</code> returning <code>"Agent &lt;handle&gt; // level &lt;level&gt;"</code>.`,
  starter: `function intro(handle: string, level: number): string {\n  // your code here\n}\n`,
  checks: [[/handle\s*:\s*string/, "handle: string"], [/level\s*:\s*number/, "level: number"], [/\)\s*:\s*string/, "Return type : string"]],
  test: { ts: `return [[intro("neo",3),"Agent neo // level 3","basic"]];` } },

{ title: "Narrowing the Field", concept: "union & literal types, type narrowing",
  lesson: `<p>A union type allows one of several types. Literal types restrict a value to exact strings or numbers:</p><pre>type Level = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
function fmt(x: string | number) {
  if (typeof x === "number") return x.toFixed(1);  // narrowed to number
  return x.trim();                                 // narrowed to string
}</pre><p>The compiler tracks which branch you're in. Narrowing also works with <code>in</code>, <code>instanceof</code> and equality checks.</p>`,
  task: `Declare <code>type Level = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"</code> and write <code>function threatLevel(score: number): Level</code> with thresholds of 90, 60 and 30.`,
  starter: `// your code here\n`,
  checks: [[/type\s+Level\s*=\s*"LOW"\s*\|/, "type Level = \"LOW\" | ..."], [/\)\s*:\s*Level/, "Return type : Level"]],
  test: { ts: `return [[95,"CRITICAL"],[60,"HIGH"],[30,"MEDIUM"],[1,"LOW"]].map(([s,w]) => [threatLevel(s as number), w, "score "+s]);` } },

{ title: "Typed Collections", concept: "arrays, tuples, Record, readonly",
  lesson: `<pre>const ips: string[] = [];
const pair: [string, number] = ["neo", 4];            // tuple
const counts: Record&lt;string, number&gt; = {};
const frozen: readonly string[] = ["a"];              // no push
const m = new Map&lt;string, number&gt;();</pre><p><code>Record&lt;K, V&gt;</code> is an object type with keys K and values V.</p>`,
  task: `Write <code>function tally(items: string[]): Record&lt;string, number&gt;</code>, and <code>function top(items: string[]): [string, number] | undefined</code> returning the most common item and its count as a tuple.`,
  starter: `// your code here\n`,
  checks: [[/Record\s*<\s*string\s*,\s*number\s*>/, "Record<string, number>"], [/\[\s*string\s*,\s*number\s*\]/, "Tuple [string, number]"]],
  test: { ts: `return [[tally(["a","b","a"]),{a:2,b:1},"tally"],[top(["a","b","a"]),["a",2],"top"],[top([]),undefined,"empty"]];` } },

{ title: "Typed Covenant", concept: "interfaces, optional & readonly properties",
  lesson: `<pre>interface Report {
  readonly id: number;
  source: string;
  verified?: boolean;        // optional: boolean | undefined
}
interface Incident extends Report { severity: 1 | 2 | 3 }</pre><p>Use <code>interface</code> for object shapes you might extend. Use <code>type</code> for unions and compositions.</p>`,
  task: `Declare <code>interface Report</code> with <code>readonly id: number</code>, <code>source: string</code> and optional <code>verified?: boolean</code>. Write <code>function summarize(r: Report): string</code> returning <code>"#&lt;id&gt; from &lt;source&gt; [verified]"</code>, or <code>[unverified]</code> when verified isn't true.`,
  starter: `// your code here\n`,
  checks: [[/interface\s+Report/, "interface Report"], [/readonly\s+id\s*:\s*number/, "readonly id: number"], [/verified\?\s*:\s*boolean/, "verified?: boolean"]],
  test: { ts: `return [[summarize({id:7,source:"field",verified:true}),"#7 from field [verified]","verified"],[summarize({id:8,source:"tip"}),"#8 from tip [unverified]","optional missing"]];` } },

{ title: "Function Types", concept: "function types, generics intro, callbacks",
  lesson: `<pre>type Predicate&lt;T&gt; = (x: T) =&gt; boolean;
function where&lt;T&gt;(items: T[], p: Predicate&lt;T&gt;): T[] {
  return items.filter(p);
}
where([1, 2, 3], n =&gt; n &gt; 1);   // T inferred as number</pre><p>Generics let one function work for any type while staying type-safe.</p>`,
  task: `Declare <code>type Predicate&lt;T&gt; = (x: T) =&gt; boolean</code>. Write <code>function where&lt;T&gt;(items: T[], p: Predicate&lt;T&gt;): T[]</code> and <code>function not&lt;T&gt;(p: Predicate&lt;T&gt;): Predicate&lt;T&gt;</code> that inverts a predicate.`,
  starter: `// your code here\n`,
  checks: [[/type\s+Predicate\s*<\s*T\s*>/, "type Predicate<T> = ..."], [/function\s+where\s*<\s*T\s*>/, "function where<T>"], [/function\s+not\s*<\s*T\s*>/, "function not<T>"]],
  test: { ts: `const big = (n: number) => n > 2;\nreturn [[where([1,2,3,4], big),[3,4],"where"],[where([1,2,3,4], not(big)),[1,2],"not"]];` } },

{ title: "The Vault", concept: "classes, access modifiers, parameter properties, getters",
  lesson: `<pre>class Vault {
  private secrets = new Map&lt;string, string&gt;();
  constructor(private readonly owner: string) {}   // parameter property
  store(k: string, v: string): void { this.secrets.set(k, v); }
  get size(): number { return this.secrets.size; }
}</pre><p><code>private</code> is checked at compile time. JavaScript's <code>#field</code> is private at runtime too.</p>`,
  task: `Write <code>class Vault</code> with a <code>private secrets</code> Map, a constructor using a <code>private readonly owner: string</code> parameter property, <code>store(k, v): void</code>, <code>read(k): string | undefined</code>, a getter <code>size</code>, and <code>describe(): string</code> returning <code>"&lt;owner&gt;: &lt;size&gt; secrets"</code>.`,
  starter: `// your code here\n`,
  checks: [[/private\s+secrets/, "private secrets = new Map<string, string>()"], [/private\s+readonly\s+owner\s*:\s*string/, "constructor(private readonly owner: string)"], [/get\s+size\s*\(\s*\)\s*:\s*number/, "get size(): number"], [/string\s*\|\s*undefined/, "read returns string | undefined"]],
  test: { ts: `const v = new Vault("kole"); v.store("a","1"); v.store("b","2");\nreturn [[v.read("a"),"1","read"],[v.read("z"),undefined,"missing"],[v.size,2,"size"],[v.describe(),"kole: 2 secrets","describe"]];` } },

{ title: "Key Extraction", concept: "generic constraints, keyof, indexed access types",
  lesson: `<pre>function pluck&lt;T, K extends keyof T&gt;(items: T[], key: K): T[K][] {
  return items.map(i =&gt; i[key]);
}
pluck([{ ip: "1.1.1.1", up: true }], "ip");   // string[]
// pluck(..., "nope")  -&gt; compile error</pre><p><code>keyof T</code> is the union of T's keys and <code>T[K]</code> is the type stored at that key.</p>`,
  task: `Write <code>function pluck&lt;T, K extends keyof T&gt;(items: T[], key: K): T[K][]</code> and <code>function indexBy&lt;T, K extends keyof T&gt;(items: T[], key: K): Map&lt;T[K], T&gt;</code>.`,
  starter: `// your code here\n`,
  checks: [[/K\s+extends\s+keyof\s+T/, "K extends keyof T"], [/T\s*\[\s*K\s*\]\s*\[\s*\]/, "Return type T[K][]"], [/Map\s*<\s*T\s*\[\s*K\s*\]\s*,\s*T\s*>/, "Map<T[K], T>"]],
  test: { ts: `const xs = [{ip:"a",up:true},{ip:"b",up:false}];\nreturn [[pluck(xs,"ip"),["a","b"],"pluck"],[indexBy(xs,"ip").get("b")?.up,false,"indexBy"]];` } },

{ title: "Exhaustive Events", concept: "discriminated unions, switch, never",
  lesson: `<pre>type Event =
  | { kind: "login"; user: string }
  | { kind: "breach"; severity: number }
  | { kind: "logout"; user: string };

function handle(e: Event) {
  switch (e.kind) {
    case "login": return e.user;           // narrowed
    case "breach": return e.severity;
    case "logout": return e.user;
    default: const _x: never = e; return _x; // compile error if a case is missed
  }
}</pre><p>This is how fluent TypeScript models state and Redux actions.</p>`,
  task: `Declare the <code>Event</code> union above and write <code>function describe(e: Event): string</code> returning <code>"&lt;user&gt; in"</code>, <code>"BREACH sev &lt;n&gt;"</code> or <code>"&lt;user&gt; out"</code>. Include a <code>never</code> exhaustiveness check.`,
  starter: `// your code here\n`,
  checks: [[/kind\s*:\s*"login"/, "A { kind: \"login\" } member"], [/switch\s*\(\s*e\.kind\s*\)/, "switch (e.kind)"], [/:\s*never/, "never exhaustiveness check"]],
  test: { ts: `return [[describe({kind:"login",user:"neo"}),"neo in","login"],[describe({kind:"breach",severity:9}),"BREACH sev 9","breach"],[describe({kind:"logout",user:"tank"}),"tank out","logout"]];` } },

{ title: "Type Alchemy", concept: "utility types: Partial, Pick, Omit, mapped types",
  lesson: `<pre>interface Agent { id: number; name: string; rank: number; secret: string }
type Patch = Partial&lt;Agent&gt;;             // all optional
type Public = Omit&lt;Agent, "secret"&gt;;
type Card = Pick&lt;Agent, "name" | "rank"&gt;;
type Flags&lt;T&gt; = { [K in keyof T]: boolean };   // mapped type</pre>`,
  task: `Write <code>function patch&lt;T&gt;(obj: T, changes: Partial&lt;T&gt;): T</code> returning a new merged object, and <code>function redact&lt;T, K extends keyof T&gt;(obj: T, key: K): Omit&lt;T, K&gt;</code> returning a copy without that key.`,
  starter: `// your code here\n`,
  checks: [[/Partial\s*<\s*T\s*>/, "Partial<T>"], [/Omit\s*<\s*T\s*,\s*K\s*>/, "Omit<T, K>"], [/\.\.\./, "Use spread to copy"]],
  test: { ts: `const a = {id:1,name:"neo",secret:"x"};\nconst p = patch(a,{name:"one"});\nreturn [[p,{id:1,name:"one",secret:"x"},"patch"],[a.name,"neo","immutable"],[redact(a,"secret"),{id:1,name:"neo"},"redact"]];` } },

{ title: "Async Uplink", concept: "Promise<T>, async/await, typed concurrency",
  lesson: `<pre>async function fetchIntel&lt;T&gt;(url: string): Promise&lt;T&gt; {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return (await res.json()) as T;
}
const [a, b] = await Promise.all([fetchIntel&lt;A&gt;(u1), fetchIntel&lt;B&gt;(u2)]);</pre><p>An <code>as T</code> cast on network data is a promise you're making to the compiler. Validate external data (for example with zod).</p>`,
  task: `Write <code>async function sweep(hosts: string[], ping: (h: string) =&gt; Promise&lt;number&gt;): Promise&lt;Record&lt;string, number&gt;&gt;</code> that pings all hosts concurrently and maps each host to its latency.`,
  starter: `// your code here\n`,
  checks: [[/Promise\s*<\s*Record\s*<\s*string\s*,\s*number\s*>\s*>/, "Promise<Record<string, number>>"], [/Promise\.all/, "Promise.all"]],
  test: { ts: `const r = await sweep(["a","bb"], async h => h.length * 10);\nreturn [[r,{a:10,bb:20},"sweep"]];` } },

{ title: "Result, Not Exceptions", concept: "Result types, type guards, validation",
  lesson: `<p>For expected failures, return a value the caller has to handle instead of throwing:</p><pre>type Result&lt;T&gt; = { ok: true; value: T } | { ok: false; error: string };
function isOk&lt;T&gt;(r: Result&lt;T&gt;): r is { ok: true; value: T } { return r.ok; }</pre><p><code>r is ...</code> is a user-defined <b>type guard</b>. Test with Vitest: <code>expect(parsePort("80")).toEqual({ ok: true, value: 80 })</code>.</p>`,
  task: `Declare <code>type Result&lt;T&gt;</code> as above. Write <code>function parsePort(s: string): Result&lt;number&gt;</code>: ok for integer strings from 1 to 65535, otherwise <code>{ ok: false, error: "invalid port" }</code>. Write the type guard <code>isOk</code>.`,
  starter: `// your code here\n`,
  checks: [[/type\s+Result\s*<\s*T\s*>/, "type Result<T>"], [/r\s+is\s+/, "A type guard: r is ..."]],
  test: { ts: `return [[parsePort("443"),{ok:true,value:443},"valid"],[parsePort("0"),{ok:false,error:"invalid port"},"zero"],[parsePort("70000").ok,false,"too big"],[parsePort("8.5").ok,false,"decimal"],[isOk(parsePort("22")),true,"guard"]];` } },

{ title: "Operation: Typed Pipeline", concept: "capstone: interfaces, unions, generics, Result, async",
  lesson: `<p>A typed event pipeline is how real dashboards ingest telemetry. It needs a discriminated-union event, a Result-returning parser, and an async aggregator that skips failures and reports them.</p>`,
  task: `Types: <code>type Ev = { kind: "fail"; ip: string } | { kind: "ok"; ip: string }</code>, <code>interface Summary { total: number; fails: number; topIp: string | null; errors: number }</code>. Write <code>function parse(line: string): Result&lt;Ev&gt;</code> for lines <code>"ip OK|FAIL"</code> and <code>async function analyze(src: () =&gt; Promise&lt;string[]&gt;): Promise&lt;Summary&gt;</code>.`,
  starter: `type Result<T> = { ok: true; value: T } | { ok: false; error: string };\n\n// your code here\n`,
  checks: [[/interface\s+Summary/, "interface Summary"], [/kind\s*:\s*"fail"/, "Ev union with kind: \"fail\""], [/function\s+parse\s*\(\s*line\s*:\s*string\s*\)\s*:\s*Result\s*<\s*Ev\s*>/, "parse(line: string): Result<Ev>"], [/Promise\s*<\s*Summary\s*>/, "Promise<Summary>"]],
  test: { ts: `const r = await analyze(async () => ["1.1.1.1 FAIL","2.2.2.2 OK","junk","1.1.1.1 FAIL","3.3.3.3 FAIL"]);\nreturn [[r,{total:4,fails:3,topIp:"1.1.1.1",errors:1},"summary"],[parse("x").ok,false,"bad line"]];` } }
]);
