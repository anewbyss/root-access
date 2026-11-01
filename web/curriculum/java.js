RA.lang("java", { name: "Java", tag: "JV", runtime: "pattern", why: "Runs much of enterprise and banking software, Android's foundations and big-data systems. Java 25 is the current LTS release." });
RA.add("java", "jv", [
{ title: "Hello, Mainframe", concept: "main, static types, var, primitives vs objects, printf",
  lesson: `<pre>public class Intro {
    public static void main(String[] args) {
        String handle = "neo";
        int level = 3;
        var ratio = 0.75;                 // local type inference (double)
        level++;
        System.out.printf("Agent %s // level %d%n", handle, level);
    }
}
// Java 25: a compact source file can just be:  void main() { IO.println("hi"); }</pre><p>Primitives: <code>int</code>, <code>long</code>, <code>double</code>, <code>boolean</code> and <code>char</code>. Their object wrappers are <code>Integer</code>, <code>Double</code> and so on. Compare strings with <code>.equals</code>, never <code>==</code>.</p>`,
  task: `Write <code>static String intro(String handle, int level)</code> returning <code>"Agent " + handle + " // level " + level</code>, and a <code>main</code> that uses <code>var</code> and <code>System.out.printf</code>.`,
  starter: `public class Intro {\n    // your code here\n}\n`,
  checks: [[/static\s+String\s+intro\s*\(\s*String\s+handle\s*,\s*int\s+level\s*\)/, "static String intro(String handle, int level)"], [/(public\s+)?static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w+\s*\)|void\s+main\s*\(\s*\)/, "public static void main(String[] args)"], [/\bvar\s+\w+\s*=/, "var x = ..."], [/System\.out\.printf\s*\(|System\.out\.println\s*\(|IO\.println/, "System.out.printf(...)"]] },

{ title: "Switch Expressions", concept: "if/else, switch expressions with arrows, for, enhanced for, while",
  lesson: `<pre>static String level(int score) {
    if (score &gt;= 90) return "CRITICAL";
    if (score &gt;= 60) return "HIGH";
    return score &gt;= 30 ? "MEDIUM" : "LOW";
}
String port = switch (service) {
    case "ssh" -&gt; "22";
    case "http", "web" -&gt; "80";
    default -&gt; { log("unknown"); yield "?"; }
};
for (int i = 0; i &lt; 5; i++) {}
for (String h : hosts) {}</pre><p>Arrow-style <code>switch</code> has no fall-through and returns a value.</p>`,
  task: `Write <code>static String threatLevel(int score)</code> using <code>if</code>/<code>else</code>, and <code>static int portFor(String service)</code> using a <b>switch expression</b> with <code>-&gt;</code> and <code>default</code>. Use the thresholds 90, 60 and 30 for CRITICAL, HIGH, MEDIUM, and LOW otherwise. <code>portFor</code> maps <code>"ssh"</code> to 22, <code>"http"</code> to 80 and <code>"https"</code> to 443, and returns <code>-1</code> for anything else.`,
  starter: `public class Triage {\n    // your code here\n}\n`,
  checks: [[/static\s+String\s+threatLevel\s*\(\s*int\s+score\s*\)/, "static String threatLevel(int score)"], [/if\s*\(\s*score\s*>=?/, "if (score >= 90)"], [/static\s+int\s+portFor\s*\(\s*String\s+\w+\s*\)/, "static int portFor(String service)"], [/=\s*switch\s*\(|return\s+switch\s*\(/, "return switch (service) { ... }"], [/case\s+"[^"]+"\s*(,\s*"[^"]+"\s*)*->/, "case \"ssh\" -> 22;"], [/default\s*->/, "default -> ..."]] },

{ title: "Collections Framework", concept: "arrays, List/ArrayList, Map/HashMap, Set, merge, List.of",
  lesson: `<pre>int[] ports = {22, 80, 443};
List&lt;String&gt; ips = new ArrayList&lt;&gt;(List.of("10.0.0.9", "10.0.0.4", "10.0.0.9"));
Map&lt;String, Integer&gt; counts = new HashMap&lt;&gt;();
for (String ip : ips) counts.merge(ip, 1, Integer::sum);
Set&lt;String&gt; unique = new HashSet&lt;&gt;(ips);
counts.getOrDefault("x", 0);</pre><p>Code to interfaces (<code>List</code>, <code>Map</code>) and pick implementations (<code>ArrayList</code>, <code>HashMap</code>, <code>TreeMap</code>) behind them. <code>List.of</code> is immutable.</p>`,
  task: `Write <code>static Map&lt;String, Integer&gt; tally(List&lt;String&gt; ips)</code> using <code>new HashMap&lt;&gt;()</code> and <code>merge(ip, 1, Integer::sum)</code>.`,
  starter: `import java.util.*;\n\npublic class Tally {\n    // your code here\n}\n`,
  checks: [[/static\s+Map<String,\s*Integer>\s+tally\s*\(\s*List<String>\s+ips\s*\)/, "static Map<String, Integer> tally(List<String> ips)"], [/new\s+HashMap<>\s*\(\s*\)/, "new HashMap<>()"], [/\.merge\s*\(\s*\w+\s*,\s*1\s*,\s*Integer::sum\s*\)/, "counts.merge(ip, 1, Integer::sum)"], [/for\s*\(\s*String\s+\w+\s*:\s*ips\s*\)/, "for (String ip : ips)"]] },

{ title: "Method Discipline", concept: "methods, static vs instance, overloading, varargs, pass-by-value",
  lesson: `<pre>static String scan(String host) { return scan(host, 443); }        // overload
static String scan(String host, int port) { return host + ":" + port; }
static int sum(int... xs) { int t = 0; for (int x : xs) t += x; return t; }   // varargs</pre><p>Java passes everything <b>by value</b>. For objects, the value is a reference, so methods can mutate an object but can't rebind the caller's variable. Java has no default arguments; use overloads instead.</p>`,
  task: `Write two overloads, <code>scan(String host)</code> and <code>scan(String host, int port)</code>, where the first delegates to the second with 443. Add a varargs method <code>static int sum(int... xs)</code>. <code>scan</code> returns <code>"host:port"</code>, for example <code>"relay:22"</code>. <code>sum()</code> with no arguments returns 0.`,
  starter: `public class Scanner {\n    // your code here\n}\n`,
  checks: [[/static\s+String\s+scan\s*\(\s*String\s+host\s*\)/, "static String scan(String host)"], [/static\s+String\s+scan\s*\(\s*String\s+host\s*,\s*int\s+port\s*\)/, "static String scan(String host, int port)"], [/return\s+scan\s*\(\s*host\s*,\s*443\s*\)/, "return scan(host, 443);"], [/int\s*\.\.\.\s*\w+/, "int... xs"]] },

{ title: "Text Forensics", concept: "String immutability, StringBuilder, split, text blocks, String.format",
  lesson: `<pre>String log = """
    10.0.0.9 FAIL
    10.0.0.4 OK
    """;                                        // text block
for (String line : log.strip().split("\\n")) { String[] p = line.split(" "); }
StringBuilder sb = new StringBuilder();
for (char c : "neo".toCharArray()) sb.append(Character.toUpperCase(c));
String out = sb.reverse().toString();
String.format("%-10s|%5d", "core", 443);</pre><p>Strings are immutable, so building one with <code>+</code> in a loop is O(n²). Use <code>StringBuilder</code>.</p>`,
  task: `Write <code>static String caesar(String text, int shift)</code> using a <code>StringBuilder</code> and <code>toCharArray()</code> that shifts letters with <code>% 26</code>. Define a text block with <code>"""</code>.`,
  starter: `public class Cipher {\n    // your code here\n}\n`,
  checks: [[/static\s+String\s+caesar\s*\(\s*String\s+text\s*,\s*int\s+shift\s*\)/, "static String caesar(String text, int shift)"], [/new\s+StringBuilder\s*\(/, "new StringBuilder()"], [/toCharArray\(\)|charAt\s*\(/, "text.toCharArray()"], [/%\s*26/, "% 26"], [/"""/, "a \"\"\" text block"]] },

{ title: "Records & Classes", concept: "classes, encapsulation, constructors, records, enums",
  lesson: `<pre>public record Node(String name, int strength) {       // immutable data carrier
    public Node { if (strength &lt; 0) throw new IllegalArgumentException(); }   // compact ctor
    public boolean hot() { return strength &gt; 80; }
}
public class Session {
    private final String id;
    private int hits;
    public Session(String id) { this.id = id; }
    public void hit() { hits++; }
    public int hits() { return hits; }
}
enum Faction { LOGOS, SENTINEL, MERIDIAN, LANTERN }</pre><p>Records generate the constructor, accessors, <code>equals</code>, <code>hashCode</code> and <code>toString</code>. Use them for data.</p>`,
  task: `Define <code>record Node(String name, int strength)</code> with a compact constructor that validates input, a <code>class Session</code> with a <code>private final</code> field and a constructor, and an <code>enum</code>. The compact constructor throws <code>IllegalArgumentException</code> when <code>name</code> is null or blank, or when <code>strength</code> is negative.`,
  starter: `// your code here\n`,
  checks: [[/record\s+Node\s*\(\s*String\s+name\s*,\s*int\s+strength\s*\)/, "record Node(String name, int strength)"], [/public\s+Node\s*\{|Node\s*\{\s*if/, "compact constructor: public Node { ... }"], [/class\s+Session/, "class Session"], [/private\s+final\s+\w+\s+\w+/, "private final String id;"], [/enum\s+\w+\s*\{/, "enum Faction { ... }"]] },

{ title: "Checked Failure", concept: "checked vs unchecked exceptions, custom exceptions, try-with-resources, Optional",
  lesson: `<pre>class BadPortException extends Exception {
    BadPortException(String raw) { super("bad port: " + raw); }
}
static int parsePort(String s) throws BadPortException {
    try { int p = Integer.parseInt(s); if (p &lt; 1 || p &gt; 65535) throw new BadPortException(s); return p; }
    catch (NumberFormatException e) { throw new BadPortException(s); }
}
try (var reader = Files.newBufferedReader(Path.of("auth.log"))) {   // auto-closed
    reader.lines().forEach(System.out::println);
} catch (IOException e) { System.err.println(e.getMessage()); }
Optional&lt;String&gt; ip = Optional.ofNullable(db.get("neo"));</pre>`,
  task: `Define <code>class BadPortException extends Exception</code>, write <code>static int parsePort(String s) throws BadPortException</code> that catches <code>NumberFormatException</code>, and use a <b>try-with-resources</b> block.`,
  starter: `import java.io.*;\nimport java.nio.file.*;\n\npublic class Ports {\n    // your code here\n}\n`,
  checks: [[/class\s+BadPortException\s+extends\s+Exception/, "class BadPortException extends Exception"], [/static\s+int\s+parsePort\s*\(\s*String\s+s\s*\)\s*throws\s+BadPortException/, "static int parsePort(String s) throws BadPortException"], [/catch\s*\(\s*NumberFormatException/, "catch (NumberFormatException e)"], [/try\s*\(\s*(var|[\w.<>]+)\s+\w+\s*=/, "try (var r = ...) { ... }"]] },

{ title: "Inheritance & Interfaces", concept: "interfaces, default methods, abstract classes, polymorphism, @Override",
  lesson: `<pre>interface Detector {
    boolean detect(String line);
    default long count(List&lt;String&gt; lines) { return lines.stream().filter(this::detect).count(); }
}
abstract class Rule implements Detector { abstract String name(); }
class Keyword extends Rule {
    private final String word;
    Keyword(String w) { word = w; }
    @Override public boolean detect(String line) { return line.contains(word); }
    @Override String name() { return "kw:" + word; }
}</pre><p>Prefer composition and interfaces over deep inheritance.</p>`,
  task: `Define <code>interface Detector</code> with an abstract <code>detect</code> and a <code>default</code> method, an <code>abstract class Rule implements Detector</code>, and <code>class Keyword extends Rule</code> using <code>@Override</code>.`,
  starter: `import java.util.*;\n\n// your code here\n`,
  checks: [[/interface\s+Detector/, "interface Detector"], [/default\s+\w+\s+\w+\s*\(/, "default long count(...)"], [/abstract\s+class\s+Rule\s+implements\s+Detector/, "abstract class Rule implements Detector"], [/class\s+Keyword\s+extends\s+Rule/, "class Keyword extends Rule"], [/@Override/, "@Override"]] },

{ title: "Generic Arsenal", concept: "generic classes/methods, bounded types, wildcards",
  lesson: `<pre>class Box&lt;T&gt; { private final T v; Box(T v) { this.v = v; } T get() { return v; } }
static &lt;T extends Comparable&lt;T&gt;&gt; T strongest(List&lt;T&gt; xs) {
    T best = xs.get(0);
    for (T x : xs) if (x.compareTo(best) &gt; 0) best = x;
    return best;
}
static double total(List&lt;? extends Number&gt; xs) { ... }    // PECS: producer extends</pre><p>Generics are erased at runtime, so you can't call <code>new T()</code> or check <code>instanceof List&lt;String&gt;</code>.</p>`,
  task: `Write a generic <code>class Box&lt;T&gt;</code>, the bounded method <code>static &lt;T extends Comparable&lt;T&gt;&gt; T strongest(List&lt;T&gt; xs)</code> using <code>compareTo</code>, and a method that takes <code>List&lt;? extends Number&gt;</code>.`,
  starter: `import java.util.*;\n\n// your code here\n`,
  checks: [[/class\s+Box\s*<\s*T\s*>/, "class Box<T>"], [/<\s*T\s+extends\s+Comparable<\s*T\s*>\s*>\s*T\s+strongest/, "static <T extends Comparable<T>> T strongest(List<T> xs)"], [/\.compareTo\s*\(/, "x.compareTo(best)"], [/<\?\s+extends\s+Number>/, "List<? extends Number>"]] },

{ title: "Stream Processing", concept: "lambdas, method references, Stream API, Collectors",
  lesson: `<pre>List&lt;String&gt; fails = lines.stream()
    .filter(l -&gt; l.endsWith("FAIL"))
    .map(l -&gt; l.split(" ")[0])
    .distinct()
    .sorted()
    .toList();
Map&lt;String, Long&gt; byIp = lines.stream()
    .collect(Collectors.groupingBy(l -&gt; l.split(" ")[0], Collectors.counting()));
int total = ports.stream().mapToInt(Integer::intValue).sum();</pre>`,
  task: `Write <code>static List&lt;String&gt; failIps(List&lt;String&gt; lines)</code> using <code>.stream().filter(...).map(...)</code>, and <code>static Map&lt;String, Long&gt; byIp(List&lt;String&gt; lines)</code> using <code>Collectors.groupingBy</code> with <code>Collectors.counting()</code>. Lines look like <code>"10.0.0.9 FAIL"</code>. <code>failIps</code> returns the IP of every FAIL line in order, repeats included. <code>byIp</code> counts every line per IP, whatever its status.`,
  starter: `import java.util.*;\nimport java.util.stream.*;\n\npublic class Streams {\n    // your code here\n}\n`,
  checks: [[/\.stream\(\)/, "lines.stream()"], [/\.filter\s*\(\s*\w+\s*->/, ".filter(l -> ...)"], [/\.map\s*\(\s*\w+\s*->/, ".map(l -> ...)"], [/Collectors\.groupingBy\s*\(/, "Collectors.groupingBy(...)"], [/Collectors\.counting\(\)/, "Collectors.counting()"]] },

{ title: "Virtual Threads", concept: "ExecutorService, virtual threads, CompletableFuture, ConcurrentHashMap, AtomicInteger",
  lesson: `<pre>try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {        // Java 21+
    List&lt;Future&lt;Boolean&gt;&gt; fs = hosts.stream().map(h -&gt; exec.submit(() -&gt; ping(h))).toList();
    for (var f : fs) if (f.get()) up.incrementAndGet();
}
CompletableFuture&lt;String&gt; cf = CompletableFuture.supplyAsync(() -&gt; fetch("core"))
    .thenApply(String::toUpperCase)
    .exceptionally(e -&gt; "offline");
var seen = new ConcurrentHashMap&lt;String, Integer&gt;();</pre><p>Virtual threads let you write simple blocking code that scales to millions of concurrent tasks.</p>`,
  task: `Write <code>static int sweep(List&lt;String&gt; hosts)</code> using <code>Executors.newVirtualThreadPerTaskExecutor()</code> in try-with-resources, an <code>AtomicInteger</code> counter, and one <code>CompletableFuture.supplyAsync</code> chain with <code>thenApply</code>. A host counts as reachable when its name isn't empty, so <code>sweep(List.of("a", "", "c"))</code> returns 2.`,
  starter: `import java.util.*;\nimport java.util.concurrent.*;\nimport java.util.concurrent.atomic.*;\n\npublic class Sweep {\n    // your code here\n}\n`,
  checks: [[/newVirtualThreadPerTaskExecutor\s*\(\s*\)/, "Executors.newVirtualThreadPerTaskExecutor()"], [/try\s*\(\s*var\s+\w+\s*=\s*Executors/, "try (var exec = Executors....)"], [/AtomicInteger/, "new AtomicInteger()"], [/CompletableFuture\.supplyAsync/, "CompletableFuture.supplyAsync(...)"], [/\.thenApply\s*\(/, ".thenApply(...)"]] },

{ title: "Operation: Log4Shell Patch", concept: "capstone: sealed interfaces, pattern-matching switch, records, streams, JUnit 5",
  lesson: `<p>December 2021: Log4Shell (CVE-2021-44228) let attackers run code just by getting a server to log the string <code>\${jndi:ldap://...}</code>. Build the input sanitizer and event classifier that would have caught it.</p><pre>sealed interface Event permits Login, Breach, Logout {}
record Login(String user) implements Event {}
record Breach(int severity) implements Event {}
record Logout() implements Event {}

static String describe(Event e) {
    return switch (e) {
        case Login l -&gt; "login " + l.user();
        case Breach b when b.severity() &gt;= 8 -&gt; "CRITICAL";
        case Breach b -&gt; "breach";
        case Logout o -&gt; "logout";
    };
}
static final Pattern JNDI = Pattern.compile("\\\\$\\\\{\\\\s*jndi:", Pattern.CASE_INSENSITIVE);
static String sanitize(String in) { return JNDI.matcher(in).find() ? "[BLOCKED]" : in; }

@Test void blocksJndi() { assertEquals("[BLOCKED]", sanitize("\${jndi:ldap://x}")); }</pre>`,
  task: `Define a <code>sealed interface Event permits ...</code> with record implementations, an exhaustive <b>pattern-matching switch</b> that includes a <code>when</code> guard, a <code>sanitize</code> method that blocks <code>\${jndi:</code> using <code>Pattern</code>, and JUnit 5 <code>@Test</code> methods with <code>assertEquals</code>. Make it <code>static String sanitize(String input)</code>: return <code>"[BLOCKED]"</code> when the input contains <code>\${jndi:</code>, and return the input unchanged otherwise.`,
  starter: `import java.util.regex.*;\nimport static org.junit.jupiter.api.Assertions.*;\nimport org.junit.jupiter.api.Test;\n\n// your code here\n`,
  checks: [[/sealed\s+interface\s+Event\s+permits/, "sealed interface Event permits Login, Breach, Logout"], [/record\s+\w+\s*\([^)]*\)\s+implements\s+Event/, "record Login(String user) implements Event"], [/case\s+\w+\s+\w+\s+when\s+/, "case Breach b when b.severity() >= 8 ->"], [/Pattern\.compile\s*\(/, "Pattern.compile(...)"], [/jndi/i, "detect jndi"], [/@Test/, "@Test"], [/assertEquals\s*\(/, "assertEquals(...)"]] }
]);
