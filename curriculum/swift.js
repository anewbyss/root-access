RA.lang("swift", { name: "Swift", tag: "SW", runtime: "pattern", why: "Apple's memory-safe language for iOS, macOS, visionOS and watchOS. It also runs on servers, WebAssembly and Android." });
RA.add("swift", "sw", [
{ title: "Signal in the Glass", concept: "let, var, type inference, string interpolation, print",
  lesson: `<pre>let handle = "neo"          // constant, type inferred as String
var level = 3                // variable
level += 1
let ratio: Double = 0.75     // explicit annotation
print("Agent \\(handle) // level \\(level)")</pre><p>Prefer <code>let</code>. The compiler warns when a <code>var</code> never changes. Core types: <code>Int</code>, <code>Double</code>, <code>Bool</code>, <code>String</code>, <code>Character</code>.</p>`,
  task: `Write <code>func intro(handle: String, level: Int) -&gt; String</code> returning <code>"Agent \\(handle) // level \\(level)"</code>. Declare a <code>let</code> constant and a <code>var</code> you change, then <code>print</code> the result.`,
  starter: `// your code here\n`,
  checks: [[/func\s+intro\s*\(\s*handle\s*:\s*String\s*,\s*level\s*:\s*Int\s*\)\s*->\s*String/, "func intro(handle: String, level: Int) -> String"], [/\\\(\s*handle\s*\)/, "interpolate with \\(handle)"], [/\blet\s+\w+\s*(:|=)/, "a let constant"], [/\bvar\s+\w+\s*(:|=)/, "a var variable"], [/print\s*\(/, "print(...)"]] },

{ title: "Gatekeeper", concept: "if, switch with ranges, guard, for-in, while",
  lesson: `<pre>func level(_ score: Int) -&gt; String {
    switch score {
    case 90...100: return "CRITICAL"
    case 60..&lt;90:  return "HIGH"
    case 30..&lt;60:  return "MEDIUM"
    default:       return "LOW"
    }
}
func open(_ code: String) -&gt; Bool {
    guard code.count == 6 else { return false }   // early exit
    return true
}
for i in 1...3 { print(i) }</pre><p><code>switch</code> must be exhaustive, and there's no implicit fallthrough. <code>guard</code> keeps the happy path unindented.</p>`,
  task: `Write <code>func threatLevel(_ score: Int) -&gt; String</code> using <code>switch</code> with range patterns and <code>default</code>, and <code>func validPin(_ pin: String) -&gt; Bool</code> that uses <code>guard</code>. Pass the <code>score</code> straight in. <code>validPin</code> returns <code>true</code> only for exactly 6 characters that are all digits, so <code>"123456"</code> passes and <code>"12345"</code>, <code>"12a456"</code> and <code>""</code> fail.`,
  starter: `// your code here\n`,
  checks: [[/func\s+threatLevel\s*\(\s*_\s+score\s*:\s*Int\s*\)\s*->\s*String/, "func threatLevel(_ score: Int) -> String"], [/switch\s+score/, "switch score { ... }"], [/case\s+\d+\s*(\.\.\.|\.\.<)\s*\d+/, "case 90...100:"], [/default\s*:/, "default:"], [/guard\s+.+\s+else\s*\{/, "guard condition else { return false }"]] },

{ title: "Optional Ghosts", concept: "Optionals, if let, guard let, ??, optional chaining",
  lesson: `<p>A value that might be missing has type <code>T?</code>. Swift forces you to deal with <code>nil</code>. This is how it prevents the null-pointer crashes Tony Hoare called his "billion-dollar mistake".</p><pre>let dossier: [String: String] = ["neo": "10.0.0.9"]
if let ip = dossier["neo"] { print(ip) }
guard let ip = dossier["trinity"] else { return }
let fallback = dossier["morpheus"] ?? "unknown"
let len = user?.profile?.bio?.count       // chaining</pre><p>Avoid force-unwrapping (<code>!</code>) unless a crash is truly impossible.</p>`,
  task: `Write <code>func lookup(_ name: String, in db: [String: String]) -&gt; String</code> that uses <code>if let</code> or <code>guard let</code> and falls back with <code>??</code>. Don't use <code>!</code>. If the name isn't in <code>db</code>, return <code>db["default"]</code>, and if there's no default either, return <code>"unknown"</code>.`,
  starter: `// your code here\n`,
  checks: [[/func\s+lookup\s*\(\s*_\s+name\s*:\s*String\s*,\s*in\s+db\s*:\s*\[String\s*:\s*String\]\s*\)\s*->\s*String/, "func lookup(_ name: String, in db: [String: String]) -> String"], [/(if|guard)\s+let\s+\w+/, "if let / guard let"], [/\?\?/, "?? fallback"], [/^(?![\s\S]*\w!\s*[\.\)\s;])/, "no force unwrap (!)"]] },

{ title: "Collections Cache", concept: "Array, Dictionary, Set, map, filter, reduce",
  lesson: `<pre>var ips = ["10.0.0.9", "10.0.0.4", "10.0.0.9"]
let unique = Set(ips)
var counts: [String: Int] = [:]
for ip in ips { counts[ip, default: 0] += 1 }
let doubled = [1, 2, 3].map { $0 * 2 }
let big = [5, 50, 500].filter { $0 &gt; 10 }
let total = [1, 2, 3].reduce(0, +)</pre><p>Collections are <b>value types</b>: assigning copies them (copy-on-write keeps that cheap).</p>`,
  task: `Write <code>func tally(_ ips: [String]) -&gt; [String: Int]</code> using <code>counts[ip, default: 0] += 1</code>, and <code>func loud(_ ports: [Int]) -&gt; [Int]</code> using <code>filter</code> then <code>map</code>. <code>loud</code> keeps only ports above 1024 and multiplies each one by 10, so <code>loud([22, 8080, 443, 3000])</code> returns <code>[80800, 30000]</code>.`,
  starter: `// your code here\n`,
  checks: [[/func\s+tally\s*\(\s*_\s+ips\s*:\s*\[String\]\s*\)\s*->\s*\[String\s*:\s*Int\]/, "func tally(_ ips: [String]) -> [String: Int]"], [/default\s*:\s*0\s*\]\s*\+=\s*1/, "counts[ip, default: 0] += 1"], [/\.filter\s*\{/, ".filter { ... }"], [/\.map\s*\{/, ".map { ... }"]] },

{ title: "Closures in the Dark", concept: "argument labels, defaults, closures, trailing closures, @escaping",
  lesson: `<pre>func scan(host: String, port: Int = 443) -&gt; String { "\\(host):\\(port)" }
scan(host: "core")                       // label required

func retry(times: Int, _ op: () -&gt; Bool) -&gt; Bool {
    for _ in 0..&lt;times where op() { return true }
    return false
}
retry(times: 3) { Bool.random() }        // trailing closure

var handlers: [() -&gt; Void] = []
func onAlert(_ h: @escaping () -&gt; Void) { handlers.append(h) }</pre><p>A closure that outlives the call must be <code>@escaping</code>. Inside classes, capture <code>[weak self]</code> to avoid retain cycles.</p>`,
  task: `Write <code>func scan(host: String, port: Int = 443) -&gt; String</code>, a function <code>retry(times:_:)</code> taking a closure, call it with <b>trailing closure</b> syntax, and write <code>func onAlert(_ h: @escaping () -&gt; Void)</code> that stores the handler. <code>scan</code> returns <code>"host:port"</code>, for example <code>"relay:443"</code>. <code>retry</code> calls the closure up to <code>times</code> times, returns <code>true</code> as soon as it returns <code>true</code>, and returns <code>false</code> if it never does. Declare <code>var handlers: [() -&gt; Void] = []</code> and have <code>onAlert</code> append to it.`,
  starter: `var handlers: [() -> Void] = []\n\n// your code here\n`,
  checks: [[/func\s+scan\s*\(\s*host\s*:\s*String\s*,\s*port\s*:\s*Int\s*=\s*443\s*\)/, "func scan(host: String, port: Int = 443)"], [/func\s+retry\s*\(\s*times\s*:\s*Int\s*,\s*_\s+\w+\s*:\s*\(\s*\)\s*->\s*Bool\s*\)/, "func retry(times: Int, _ op: () -> Bool)"], [/retry\s*\(\s*times\s*:\s*\d+\s*\)\s*\{/, "retry(times: 3) { ... }"], [/@escaping/, "@escaping"]] },

{ title: "Structs vs Classes", concept: "value vs reference types, mutating, init, computed properties",
  lesson: `<pre>struct Node {                 // value type: copied
    var name: String
    var strength = 0
    var isHot: Bool { strength &gt; 80 }          // computed
    mutating func boost(_ by: Int) { strength += by }
}
final class Session {         // reference type: shared
    let id: String
    init(id: String) { self.id = id }
    deinit { print("closed") }
}</pre><p>Default to <code>struct</code>. Reach for <code>class</code> when you need shared identity, inheritance or <code>deinit</code>. SwiftUI is built on structs.</p>`,
  task: `Define <code>struct Node</code> with <code>name</code>, <code>strength</code>, a computed <code>isHot: Bool</code> and a <code>mutating func boost(_ by: Int)</code>. Then define <code>final class Session</code> with <code>let id: String</code> and an <code>init</code>. <code>strength</code> defaults to 0, <code>isHot</code> is <code>strength &gt; 80</code>, and <code>boost</code> adds to <code>strength</code>. <code>Session</code> has <code>init(id: String)</code>.`,
  starter: `// your code here\n`,
  checks: [[/struct\s+Node\s*\{/, "struct Node { ... }"], [/var\s+isHot\s*:\s*Bool\s*\{/, "var isHot: Bool { strength > 80 }"], [/mutating\s+func\s+boost/, "mutating func boost(_ by: Int)"], [/(final\s+)?class\s+Session/, "final class Session"], [/init\s*\(\s*id\s*:\s*String\s*\)/, "init(id: String)"]] },

{ title: "Typed Failure", concept: "Error protocol, throws, do/try/catch, Result",
  lesson: `<pre>enum ScanError: Error { case empty, badPort(String) }

func parsePort(_ s: String) throws -&gt; Int {
    guard !s.isEmpty else { throw ScanError.empty }
    guard let p = Int(s), (1...65535).contains(p) else { throw ScanError.badPort(s) }
    return p
}
do { let p = try parsePort("80") }
catch ScanError.badPort(let s) { print("bad \\(s)") }
catch { print(error) }
let r = Result { try parsePort("x") }      // Result&lt;Int, Error&gt;</pre><p><code>try?</code> converts an error into <code>nil</code>. Swift 6 also supports typed throws: <code>throws(ScanError)</code>.</p>`,
  task: `Define <code>enum ScanError: Error</code> with <code>empty</code> and <code>badPort(String)</code>, write <code>func parsePort(_ s: String) throws -&gt; Int</code>, and call it inside <code>do { try ... } catch { ... }</code>.`,
  starter: `// your code here\n`,
  checks: [[/enum\s+ScanError\s*:\s*Error/, "enum ScanError: Error"], [/case\s+badPort\s*\(\s*String\s*\)/, "case badPort(String)"], [/func\s+parsePort\s*\(\s*_\s+s\s*:\s*String\s*\)\s*throws\s*(\(\s*ScanError\s*\))?\s*->\s*Int/, "func parsePort(_ s: String) throws -> Int"], [/throw\s+ScanError\./, "throw ScanError.badPort(s)"], [/do\s*\{[\s\S]*try\s+[\s\S]*\}\s*catch/, "do { try ... } catch { ... }"]] },

{ title: "Enums with Payloads", concept: "enums, associated values, CaseIterable, pattern matching",
  lesson: `<pre>enum Event {
    case login(user: String)
    case breach(severity: Int)
    case logout
}
func describe(_ e: Event) -&gt; String {
    switch e {
    case .login(let user): return "login \\(user)"
    case .breach(let s) where s &gt;= 8: return "CRITICAL breach"
    case .breach(let s): return "breach \\(s)"
    case .logout: return "logout"
    }
}
enum Faction: String, CaseIterable { case logos, sentinel, meridian, lantern }</pre>`,
  task: `Define <code>enum Event</code> with <code>login(user: String)</code>, <code>breach(severity: Int)</code> and <code>logout</code>, plus <code>func describe(_ e: Event) -&gt; String</code> with a <code>where</code> clause on one case. Add <code>enum Faction: String, CaseIterable</code>. Return text that mentions the user for <code>login</code> and the number for <code>breach</code> (like <code>"breach 3"</code>). Add a <code>where severity &gt;= 8</code> case that returns different words (like <code>"CRITICAL breach"</code>).`,
  starter: `// your code here\n`,
  checks: [[/enum\s+Event\s*\{/, "enum Event { ... }"], [/case\s+login\s*\(\s*user\s*:\s*String\s*\)/, "case login(user: String)"], [/case\s+\.breach\s*\(\s*let\s+\w+\s*\)\s*where/, "case .breach(let s) where s >= 8:"], [/enum\s+Faction\s*:\s*String\s*,\s*CaseIterable/, "enum Faction: String, CaseIterable"]] },

{ title: "Protocol Oriented", concept: "protocols, extensions, default implementations, generics with where",
  lesson: `<pre>protocol Detector { func detect(_ line: String) -&gt; Bool }
extension Detector {
    func count(in lines: [String]) -&gt; Int { lines.filter(detect).count }   // default impl
}
struct Keyword: Detector {
    let word: String
    func detect(_ line: String) -&gt; Bool { line.contains(word) }
}
func strongest&lt;T: Comparable&gt;(_ xs: [T]) -&gt; T? { xs.max() }
func merge&lt;C: Collection&gt;(_ c: C) -&gt; [C.Element] where C.Element: Hashable { Array(Set(c)) }</pre><p>Swift calls this protocol-oriented programming: compose behavior from protocols and extensions instead of deep class trees.</p>`,
  task: `Define <code>protocol Detector</code>, an <code>extension Detector</code> with a default <code>count(in:)</code>, a <code>struct Keyword: Detector</code>, and a generic <code>func strongest&lt;T: Comparable&gt;(_ xs: [T]) -&gt; T?</code>. <code>Detector</code> requires <code>func detect(_ line: String) -&gt; Bool</code>. The extension's <code>count(in lines: [String]) -&gt; Int</code> counts matching lines. <code>Keyword</code> has <code>let word: String</code> and detects lines that contain it. <code>strongest</code> returns the largest value, or <code>nil</code> for an empty array.`,
  starter: `// your code here\n`,
  checks: [[/protocol\s+Detector/, "protocol Detector { ... }"], [/extension\s+Detector/, "extension Detector { ... }"], [/struct\s+Keyword\s*:\s*Detector/, "struct Keyword: Detector"], [/func\s+strongest\s*<\s*T\s*:\s*Comparable\s*>/, "func strongest<T: Comparable>(_ xs: [T]) -> T?"]] },

{ title: "Actors at the Gate", concept: "async/await, async let, TaskGroup, actors, Sendable",
  lesson: `<pre>func ping(_ host: String) async -&gt; Bool {
    try? await Task.sleep(for: .milliseconds(50)); return true
}
actor Ledger {                       // serialized access, no data races
    private var hits = 0
    func record() { hits += 1 }
    func total() -&gt; Int { hits }
}
func sweep(_ hosts: [String]) async -&gt; Int {
    await withTaskGroup(of: Bool.self) { group in
        for h in hosts { group.addTask { await ping(h) } }
        var up = 0
        for await ok in group where ok { up += 1 }
        return up
    }
}</pre><p>Swift 6 checks for data races at compile time. Swift 6.2's "approachable concurrency" can run code on the main actor by default, and you opt into parallelism with <code>@concurrent</code>.</p>`,
  task: `Write <code>func ping(_ host: String) async -&gt; Bool</code>, an <code>actor Ledger</code> with a mutating method, and <code>func sweep(_ hosts: [String]) async -&gt; Int</code> using <code>withTaskGroup</code> and <code>for await</code>. <code>ping</code> returns <code>true</code> when the host name isn't empty. <code>Ledger</code> has <code>func record()</code> that adds 1 and <code>func total() -&gt; Int</code>. <code>sweep</code> returns how many hosts answered <code>true</code>.`,
  starter: `// your code here\n`,
  checks: [[/func\s+ping\s*\(\s*_\s+host\s*:\s*String\s*\)\s*async\s*->\s*Bool/, "func ping(_ host: String) async -> Bool"], [/actor\s+Ledger/, "actor Ledger { ... }"], [/withTaskGroup\s*\(/, "await withTaskGroup(of: Bool.self) { group in ... }"], [/group\.addTask/, "group.addTask { await ping(h) }"], [/for\s+await\s+/, "for await ok in group"]] },

{ title: "Proof of Work", concept: "Swift Testing (@Test, #expect), XCTest, access control",
  lesson: `<pre>import Testing
@testable import Scanner

@Test func parsesValidPort() throws {
    #expect(try parsePort("443") == 443)
}
@Test("rejects garbage", arguments: ["", "abc", "70000"])
func rejects(_ input: String) {
    #expect(throws: ScanError.self) { try parsePort(input) }
}</pre><p>Swift Testing (Xcode 16+) replaces most XCTest boilerplate. Access levels: <code>private</code>, <code>fileprivate</code>, <code>internal</code> (default) and <code>public</code>.</p>`,
  task: `Write at least two <code>@Test</code> functions using <code>#expect</code>, including one parameterized test with <code>arguments:</code>. Mark one helper <code>private</code>.`,
  starter: `import Testing\n\n// your code here\n`,
  checks: [[/import\s+Testing/, "import Testing"], [/@Test[\s\S]*@Test/, "two @Test functions"], [/#expect\s*\(/, "#expect(...)"], [/arguments\s*:/, "@Test(arguments: [...])"], [/\bprivate\s+(func|let|var)/, "a private helper"]] },

{ title: "Operation: Glass Console", concept: "capstone: SwiftUI, @State, @Observable, List, async, errors",
  lesson: `<p>Ship a real interface. SwiftUI views are structs that describe UI as a function of state.</p><pre>import SwiftUI
@Observable final class Monitor {
    var alerts: [String] = []
    func refresh() async { alerts.append("ping \\(Date.now)") }
}
struct ConsoleView: View {
    @State private var monitor = Monitor()
    @State private var filter = ""
    var body: some View {
        NavigationStack {
            List(monitor.alerts.filter { filter.isEmpty || $0.contains(filter) }, id: \\.self) { Text($0) }
                .searchable(text: $filter)
                .task { await monitor.refresh() }
                .navigationTitle("Console")
        }
    }
}</pre>`,
  task: `Build <code>struct ConsoleView: View</code> with <code>@State</code>, a <code>List</code>, a <code>Button</code> that triggers async work through <code>Task { await ... }</code>, and an <code>@Observable</code> model class. This is the same pattern used throughout the ROOT//ACCESS Swift Playgrounds app.`,
  starter: `import SwiftUI\n\n// your code here\n`,
  checks: [[/import\s+SwiftUI/, "import SwiftUI"], [/struct\s+\w+\s*:\s*View/, "struct ConsoleView: View"], [/var\s+body\s*:\s*some\s+View/, "var body: some View"], [/@State/, "@State private var ..."], [/List\s*[\(\{]/, "List(...)"], [/Button\s*\(/, "Button(...)"], [/Task\s*\{\s*await/, "Task { await ... }"], [/@Observable/, "@Observable final class Monitor"]] }
]);
