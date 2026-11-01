RA.lang("csharp", { name: "C#", tag: "CS", runtime: "pattern", why: "Microsoft's .NET language for cloud services, Windows, enterprise backends and Unity games. .NET 10 is the current LTS release." });
RA.add("csharp", "cs", [
{ title: "Top-Level Uplink", concept: "top-level statements, var, types, string interpolation, Console",
  lesson: `<pre>// Program.cs. Since C# 10 there's no class or Main boilerplate
var handle = "neo";
int level = 3;
level++;
const double Ratio = 0.75;
Console.WriteLine($"Agent {handle} // level {level}");
// .NET 10: run a single file directly with  dotnet run app.cs</pre><p>Value types: <code>int</code>, <code>long</code>, <code>double</code>, <code>decimal</code> (use it for money), <code>bool</code> and <code>char</code>. <code>string</code> is a reference type.</p>`,
  task: `Write <code>static string Intro(string handle, int level)</code> returning the interpolated string <code>$"Agent {handle} // level {level}"</code>, then use <code>var</code> and <code>Console.WriteLine</code>.`,
  starter: `// your code here\n`,
  checks: [[/static\s+string\s+Intro\s*\(\s*string\s+handle\s*,\s*int\s+level\s*\)/, "static string Intro(string handle, int level)"], [/\$"[^"]*\{handle\}/, "$\"Agent {handle} ...\""], [/\bvar\s+\w+\s*=/, "var x = ..."], [/Console\.WriteLine\s*\(/, "Console.WriteLine(...)"]] },

{ title: "Switch Expressions", concept: "if/else, switch expressions with relational patterns, for/foreach, while",
  lesson: `<pre>static string Level(int score) =&gt; score switch
{
    &gt;= 90 =&gt; "CRITICAL",
    &gt;= 60 =&gt; "HIGH",
    &gt;= 30 and &lt; 60 =&gt; "MEDIUM",
    _ =&gt; "LOW"
};
foreach (var host in hosts) { }
for (int i = 0; i &lt; 5; i++) { }</pre><p>Pattern matching is everywhere in modern C#: relational (<code>&gt;=</code>), logical (<code>and</code>/<code>or</code>/<code>not</code>), type and property patterns.</p>`,
  task: `Write <code>static string ThreatLevel(int score)</code> as a <code>switch</code> expression with relational patterns and a <code>_</code> discard arm, plus a <code>foreach</code> loop.`,
  starter: `// your code here\n`,
  checks: [[/static\s+string\s+ThreatLevel\s*\(\s*int\s+score\s*\)/, "static string ThreatLevel(int score)"], [/score\s+switch\s*\{/, "score switch { ... }"], [/>=\s*\d+\s*=>/, ">= 90 => \"CRITICAL\""], [/_\s*=>/, "_ => \"LOW\""], [/foreach\s*\(\s*var\s+\w+\s+in\s+/, "foreach (var h in hosts)"]] },

{ title: "Collections Cache", concept: "arrays, List<T>, Dictionary<K,V>, HashSet, collection expressions, TryGetValue",
  lesson: `<pre>int[] ports = [22, 80, 443];                       // C# 12 collection expression
List&lt;string&gt; ips = ["10.0.0.9", "10.0.0.4", "10.0.0.9"];
var counts = new Dictionary&lt;string, int&gt;();
foreach (var ip in ips) counts[ip] = counts.GetValueOrDefault(ip) + 1;
if (counts.TryGetValue("10.0.0.9", out var n)) Console.WriteLine(n);
var unique = new HashSet&lt;string&gt;(ips);</pre>`,
  task: `Write <code>static Dictionary&lt;string, int&gt; Tally(List&lt;string&gt; ips)</code> using <code>GetValueOrDefault</code>, and use <code>TryGetValue(..., out var ...)</code> once.`,
  starter: `// your code here\n`,
  checks: [[/static\s+Dictionary<string,\s*int>\s+Tally\s*\(\s*List<string>\s+ips\s*\)/, "static Dictionary<string, int> Tally(List<string> ips)"], [/new\s+Dictionary<string,\s*int>\s*\(\s*\)|Dictionary<string,\s*int>\s+\w+\s*=\s*new\s*\(\s*\)|=\s*\[\s*\]/, "new Dictionary<string, int>()"], [/GetValueOrDefault\s*\(/, "counts.GetValueOrDefault(ip)"], [/TryGetValue\s*\([^)]*out\s+var/, "TryGetValue(key, out var n)"]] },

{ title: "Method Signatures", concept: "optional/named params, out/ref, expression-bodied members, local functions, tuples",
  lesson: `<pre>static string Scan(string host, int port = 443) =&gt; $"{host}:{port}";
Scan("core", port: 22);                                // named

static bool TryParsePort(string s, out int port) =&gt; int.TryParse(s, out port) &amp;&amp; port is &gt; 0 and &lt; 65536;

static (int up, int down) Sweep(string[] hosts)        // tuple return
{
    int Up() =&gt; hosts.Length;                          // local function
    return (Up(), 0);
}
var (up, down) = Sweep(["a", "b"]);</pre>`,
  task: `Write <code>static string Scan(string host, int port = 443)</code> as an expression-bodied member, call it with a <b>named</b> argument, write <code>static bool TryParsePort(string s, out int port)</code>, and return a tuple from a method. <code>Scan</code> returns <code>"host:port"</code>. <code>TryParsePort</code> accepts whole numbers from 1 to 65535 and returns false for anything else. The tuple method is <code>static (int Up, int Down) Count(bool[] results)</code>, so <code>Count(new[] { true, false, true })</code> returns <code>(2, 1)</code>.`,
  starter: `// your code here\n`,
  checks: [[/static\s+string\s+Scan\s*\(\s*string\s+host\s*,\s*int\s+port\s*=\s*443\s*\)\s*=>/, "static string Scan(string host, int port = 443) => ..."], [/Scan\s*\([^)]*port\s*:/, "Scan(\"core\", port: 22)"], [/static\s+bool\s+TryParsePort\s*\(\s*string\s+s\s*,\s*out\s+int\s+port\s*\)/, "static bool TryParsePort(string s, out int port)"], [/static\s+\(\s*\w+\s+\w+\s*,\s*\w+\s+\w+\s*\)\s+\w+\s*\(/, "static (int up, int down) Sweep(...)"]] },

{ title: "Text Decryption", concept: "string APIs, StringBuilder, Split, raw string literals, verbatim strings",
  lesson: `<pre>var log = """
    10.0.0.9 FAIL
    10.0.0.4 OK
    """;                                               // raw string literal (C# 11)
foreach (var line in log.Split('\\n', StringSplitOptions.RemoveEmptyEntries)) { }
var sb = new StringBuilder();
foreach (char c in "neo") sb.Append(char.ToUpper(c));
string path = @"C:\\ops\\logs";                        // verbatim
"  NeO ".Trim().ToLowerInvariant();</pre>`,
  task: `Write <code>static string Caesar(string text, int shift)</code> using <code>StringBuilder</code>, <code>char.IsLetter</code> and <code>% 26</code>, and define a raw string literal with <code>"""</code>.`,
  starter: `using System.Text;\n\n// your code here\n`,
  checks: [[/static\s+string\s+Caesar\s*\(\s*string\s+text\s*,\s*int\s+shift\s*\)/, "static string Caesar(string text, int shift)"], [/new\s+StringBuilder\s*\(/, "new StringBuilder()"], [/char\.IsLetter|char\.IsUpper|char\.IsLower/, "char.IsLetter(c)"], [/%\s*26/, "% 26"], [/"""/, "raw string literal \"\"\""]] },

{ title: "Records & Properties", concept: "classes, auto-properties, init, required, records, with-expressions, primary constructors",
  lesson: `<pre>public record Node(string Name, int Strength = 0)    // immutable, value equality
{
    public bool Hot =&gt; Strength &gt; 80;
}
var a = new Node("core");
var b = a with { Strength = 90 };                     // non-destructive copy

public class Session(string id)                       // primary constructor (C# 12)
{
    public string Id { get; } = id;
    public int Hits { get; private set; }
    public required string Owner { get; init; }
    public void Hit() =&gt; Hits++;
}</pre>`,
  task: `Define <code>record Node(string Name, int Strength = 0)</code> with a computed property, use a <code>with</code> expression, and define <code>class Session</code> with a <code>{ get; private set; }</code> property and a <code>required ... { get; init; }</code> property. <code>IsHot</code> is <code>Strength &gt; 80</code>. Make <code>Session</code>'s <code>Id</code> a <code>required string Id { get; init; }</code>.`,
  starter: `// your code here\n`,
  checks: [[/record\s+Node\s*\(\s*string\s+Name/, "record Node(string Name, int Strength = 0)"], [/\bwith\s*\{/, "a with { Strength = 90 }"], [/class\s+Session/, "class Session"], [/\{\s*get;\s*private\s+set;\s*\}/, "{ get; private set; }"], [/required\s+\w+\s+\w+\s*\{\s*get;\s*init;\s*\}/, "required string Owner { get; init; }"]] },

{ title: "Exception Protocol", concept: "try/catch/finally, exception filters, custom exceptions, using, nullable reference types",
  lesson: `<pre>public class BadPortException(string raw) : Exception($"bad port: {raw}");

static int ParsePort(string s)
{
    ArgumentException.ThrowIfNullOrWhiteSpace(s);
    if (!int.TryParse(s, out var p) || p is &lt; 1 or &gt; 65535) throw new BadPortException(s);
    return p;
}
try { ParsePort("x"); }
catch (BadPortException e) when (e.Message.Contains("x")) { Console.Error.WriteLine(e.Message); }
finally { Console.WriteLine("done"); }

using var reader = new StreamReader("auth.log");      // disposed at end of scope
string? maybe = null;                                 // nullable reference type
int len = maybe?.Length ?? 0;</pre>`,
  task: `Define <code>class BadPortException : Exception</code>, write <code>static int ParsePort(string s)</code> that throws it, catch it with a <code>when</code> filter plus <code>finally</code>, and add a <code>using</code> declaration and a <code>?? </code> fallback. Valid ports are whole numbers from 1 to 65535. <code>ParsePort</code> throws <code>BadPortException</code> for <code>"http"</code> and for <code>"70000"</code>.`,
  starter: `// your code here\n`,
  checks: [[/class\s+BadPortException[^:]*:\s*Exception/, "class BadPortException : Exception"], [/throw\s+new\s+BadPortException/, "throw new BadPortException(s)"], [/catch\s*\(\s*BadPortException\s+\w+\s*\)\s*when\s*\(/, "catch (BadPortException e) when (...)"], [/finally\s*\{/, "finally { ... }"], [/using\s+(var|[\w<>]+)\s+\w+\s*=|using\s*\(/, "using var reader = ..."], [/\?\?/, "?? fallback"]] },

{ title: "Interfaces & Inheritance", concept: "interfaces, default interface methods, abstract, virtual/override, sealed",
  lesson: `<pre>public interface IDetector
{
    bool Detect(string line);
    int Count(IEnumerable&lt;string&gt; lines) =&gt; lines.Count(Detect);   // default impl
}
public abstract class Rule : IDetector
{
    public abstract bool Detect(string line);
    public virtual int Weight =&gt; 1;
}
public sealed class Keyword(string word) : Rule
{
    public override bool Detect(string line) =&gt; line.Contains(word);
    public override int Weight =&gt; 5;
}</pre>`,
  task: `Define <code>interface IDetector</code>, an <code>abstract class Rule : IDetector</code> with a <code>virtual</code> member, and <code>sealed class Keyword : Rule</code> that uses <code>override</code>.`,
  starter: `// your code here\n`,
  checks: [[/interface\s+IDetector/, "interface IDetector"], [/abstract\s+class\s+Rule\s*:\s*IDetector/, "abstract class Rule : IDetector"], [/\bvirtual\b/, "public virtual int Weight"], [/sealed\s+class\s+Keyword[^:]*:\s*Rule/, "sealed class Keyword : Rule"], [/\boverride\b/, "override"]] },

{ title: "Generic Constraints", concept: "generic classes/methods, where constraints, IComparable<T>, variance",
  lesson: `<pre>public class Box&lt;T&gt;(T value) { public T Value { get; } = value; }
static T Strongest&lt;T&gt;(IEnumerable&lt;T&gt; xs) where T : IComparable&lt;T&gt;
{
    T best = xs.First();
    foreach (var x in xs) if (x.CompareTo(best) &gt; 0) best = x;
    return best;
}
static T Make&lt;T&gt;() where T : new() =&gt; new T();
IEnumerable&lt;object&gt; objs = new List&lt;string&gt;();          // covariance (out T)</pre><p>Unlike Java, .NET generics are reified: <code>List&lt;int&gt;</code> stores real ints with no boxing.</p>`,
  task: `Write a generic <code>class Box&lt;T&gt;</code>, the method <code>static T Strongest&lt;T&gt;(IEnumerable&lt;T&gt; xs) where T : IComparable&lt;T&gt;</code> using <code>CompareTo</code>, and a method with a <code>where T : new()</code> constraint.`,
  starter: `// your code here\n`,
  checks: [[/class\s+Box\s*<\s*T\s*>/, "class Box<T>"], [/Strongest\s*<\s*T\s*>\s*\([^)]*\)\s*where\s+T\s*:\s*IComparable<T>/, "static T Strongest<T>(IEnumerable<T> xs) where T : IComparable<T>"], [/\.CompareTo\s*\(/, "x.CompareTo(best)"], [/where\s+T\s*:\s*new\s*\(\s*\)/, "where T : new()"]] },

{ title: "LINQ Interrogation", concept: "LINQ methods, lambdas, GroupBy, query syntax, deferred execution",
  lesson: `<pre>var fails = lines
    .Where(l =&gt; l.EndsWith("FAIL"))
    .Select(l =&gt; l.Split(' ')[0])
    .Distinct()
    .OrderBy(ip =&gt; ip)
    .ToList();
var byIp = lines.GroupBy(l =&gt; l.Split(' ')[0])
                .ToDictionary(g =&gt; g.Key, g =&gt; g.Count());
var q = from l in lines where l.Contains("FAIL") select l.ToUpper();   // query syntax</pre><p>LINQ is lazy: nothing runs until you enumerate the results or call <code>ToList()</code>. Entity Framework translates the same LINQ into SQL.</p>`,
  task: `Write <code>static List&lt;string&gt; FailIps(IEnumerable&lt;string&gt; lines)</code> using <code>Where</code>, <code>Select</code> and <code>ToList</code>, and <code>ByIp</code> using <code>GroupBy</code> and <code>ToDictionary</code>. Lines look like <code>"10.0.0.9 FAIL"</code>. <code>FailIps</code> returns the IP of every FAIL line in order, repeats included. <code>static Dictionary&lt;string, int&gt; ByIp(IEnumerable&lt;string&gt; lines)</code> counts every line per IP.`,
  starter: `// your code here\n`,
  checks: [[/\.Where\s*\(\s*\w+\s*=>/, ".Where(l => ...)"], [/\.Select\s*\(\s*\w+\s*=>/, ".Select(l => ...)"], [/\.ToList\s*\(\s*\)/, ".ToList()"], [/\.GroupBy\s*\(/, ".GroupBy(...)"], [/\.ToDictionary\s*\(/, ".ToDictionary(g => g.Key, g => g.Count())"]] },

{ title: "Async Swarm", concept: "async/await, Task, Task.WhenAll, CancellationToken, Parallel.ForEachAsync",
  lesson: `<pre>static async Task&lt;bool&gt; PingAsync(string host, CancellationToken ct)
{
    await Task.Delay(50, ct);
    return true;
}
static async Task&lt;int&gt; SweepAsync(string[] hosts, CancellationToken ct = default)
{
    var results = await Task.WhenAll(hosts.Select(h =&gt; PingAsync(h, ct)));
    return results.Count(ok =&gt; ok);
}
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
int up = await SweepAsync(["a", "b"], cts.Token);</pre><p>Avoid <code>async void</code> (except for event handlers) and never block with <code>.Result</code>.</p>`,
  task: `Write <code>static async Task&lt;bool&gt; PingAsync(string host, CancellationToken ct)</code> using <code>await Task.Delay</code>, and <code>static async Task&lt;int&gt; SweepAsync(...)</code> using <code>Task.WhenAll</code>. Create a <code>CancellationTokenSource</code>. <code>PingAsync</code> returns true when the host name isn't empty. Pass <code>ct</code> to <code>Task.Delay</code> so cancelling works. <code>static async Task&lt;int&gt; SweepAsync(IEnumerable&lt;string&gt; hosts, CancellationToken ct)</code> returns how many hosts answered true.`,
  starter: `// your code here\n`,
  checks: [[/static\s+async\s+Task<bool>\s+PingAsync\s*\(/, "static async Task<bool> PingAsync(...)"], [/await\s+Task\.Delay\s*\(/, "await Task.Delay(50, ct)"], [/static\s+async\s+Task<int>\s+SweepAsync/, "static async Task<int> SweepAsync(...)"], [/Task\.WhenAll\s*\(/, "await Task.WhenAll(...)"], [/CancellationTokenSource/, "new CancellationTokenSource(...)"]] },

{ title: "Operation: Construct Arena", concept: "capstone: Unity MonoBehaviour, [SerializeField], lifecycle, events, xUnit tests",
  lesson: `<p>Unity runs many of the world's games on C#. Build the drone that guards your node, then test its logic outside the engine with xUnit.</p><pre>using UnityEngine;
public class SentryDrone : MonoBehaviour
{
    [SerializeField] private float speed = 4f;
    [SerializeField] private Transform target;
    public event System.Action&lt;int&gt;? OnHit;
    private int hits;

    void Start() =&gt; Debug.Log("Drone online");
    void Update()
    {
        if (target == null) return;
        transform.position = Vector3.MoveTowards(transform.position, target.position, speed * Time.deltaTime);
    }
    void OnTriggerEnter(Collider other) { hits++; OnHit?.Invoke(hits); }
}

// Tests/DroneLogicTests.cs
public class DroneLogicTests { [Fact] public void Clamps() =&gt; Assert.Equal(10, DroneLogic.Clamp(99, 0, 10)); }</pre>`,
  task: `Write <code>class SentryDrone : MonoBehaviour</code> with <code>[SerializeField] private</code> fields, <code>Start</code> and <code>Update</code> methods that use <code>Time.deltaTime</code>, and an <code>event</code> invoked with <code>?.Invoke</code>. Add an xUnit test class with <code>[Fact]</code> and <code>Assert.Equal</code>. Give the drone a <code>[SerializeField] private Transform target</code> and a range field. In <code>Update</code>, when <code>Vector3.Distance(transform.position, target.position)</code> is less than the range, invoke an event such as <code>public event Action&lt;float&gt; TargetSpotted</code>.`,
  starter: `using UnityEngine;\nusing Xunit;\n\n// your code here\n`,
  checks: [[/class\s+\w+\s*:\s*MonoBehaviour/, "class SentryDrone : MonoBehaviour"], [/\[SerializeField\]\s*private/, "[SerializeField] private float speed"], [/void\s+Update\s*\(\s*\)/, "void Update()"], [/Time\.deltaTime/, "speed * Time.deltaTime"], [/\bevent\s+[\w.<>?]+\s+\w+/, "public event Action<int> OnHit"], [/\?\.Invoke\s*\(/, "OnHit?.Invoke(hits)"], [/\[Fact\]/, "[Fact]"], [/Assert\.Equal\s*\(/, "Assert.Equal(...)"]] }
]);
