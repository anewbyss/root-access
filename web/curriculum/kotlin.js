RA.lang("kotlin", { name: "Kotlin", tag: "KT", runtime: "pattern", why: "Google's preferred language for Android, built around Jetpack Compose. Also used for servers and shared Kotlin Multiplatform code." });
RA.add("kotlin", "kt", [
{ title: "Boot Sequence", concept: "val, var, type inference, string templates, main",
  lesson: `<pre>fun main() {
    val handle = "neo"          // read-only
    var level = 3               // mutable
    level++
    val ratio: Double = 0.75
    println("Agent $handle // level \${level + 1}")
}</pre><p>Prefer <code>val</code>. Types: <code>Int</code>, <code>Long</code>, <code>Double</code>, <code>Boolean</code>, <code>String</code> and <code>Char</code>. There are no primitives to manage; the compiler optimizes them for you.</p>`,
  task: `Write <code>fun intro(handle: String, level: Int): String</code> returning <code>"Agent $handle // level $level"</code>, plus a <code>main</code> with one <code>val</code>, one <code>var</code> and a <code>println</code>.`,
  starter: `// your code here\n`,
  checks: [[/fun\s+intro\s*\(\s*handle\s*:\s*String\s*,\s*level\s*:\s*Int\s*\)\s*:\s*String/, "fun intro(handle: String, level: Int): String"], [/\$handle|\$\{handle\}/, "template $handle"], [/\bval\s+\w+/, "a val"], [/\bvar\s+\w+/, "a var"], [/println\s*\(/, "println(...)"]] },

{ title: "When the Alarm Sounds", concept: "if as expression, when, ranges, for, while",
  lesson: `<pre>val label = if (online) "UP" else "DOWN"
fun level(score: Int) = when (score) {
    in 90..100 -&gt; "CRITICAL"
    in 60 until 90 -&gt; "HIGH"
    in 30..59 -&gt; "MEDIUM"
    else -&gt; "LOW"
}
for (i in 1..5) {}
for (i in 10 downTo 0 step 2) {}</pre><p><code>when</code> replaces <code>switch</code> and can match values, ranges, types (<code>is</code>) or arbitrary conditions.</p>`,
  task: `Write <code>fun threatLevel(score: Int): String</code> using <code>when</code> with <code>in</code> ranges and <code>else</code>. Add a loop that uses <code>downTo</code> or <code>step</code>.`,
  starter: `// your code here\n`,
  checks: [[/fun\s+threatLevel\s*\(\s*score\s*:\s*Int\s*\)/, "fun threatLevel(score: Int): String"], [/when\s*\(\s*score\s*\)/, "when (score) { ... }"], [/in\s+\d+\s*(\.\.|until)\s*\d+\s*->/, "in 90..100 ->"], [/else\s*->/, "else ->"], [/downTo|step\s+\d/, "downTo / step"]] },

{ title: "Collections Vault", concept: "listOf, mutableListOf, mapOf, setOf, groupingBy, functional ops",
  lesson: `<pre>val ips = listOf("10.0.0.9", "10.0.0.4", "10.0.0.9")    // read-only
val live = mutableListOf&lt;String&gt;()
live += "10.0.0.1"
val counts = ips.groupingBy { it }.eachCount()            // Map&lt;String, Int&gt;
val ports = mapOf("ssh" to 22, "https" to 443)
val unique = ips.toSet()
val hot = ips.filter { it.endsWith(".9") }.map { it.uppercase() }</pre><p>Read-only collections are the default. Use the <code>mutable*</code> builders only when you need to change them.</p>`,
  task: `Write <code>fun tally(ips: List&lt;String&gt;): Map&lt;String, Int&gt;</code> using <code>groupingBy { it }.eachCount()</code>, and build a <code>mapOf</code> with <code>to</code> pairs.`,
  starter: `// your code here\n`,
  checks: [[/fun\s+tally\s*\(\s*ips\s*:\s*List<String>\s*\)\s*:\s*Map<String,\s*Int>/, "fun tally(ips: List<String>): Map<String, Int>"], [/groupingBy\s*\{\s*it\s*\}\.eachCount\(\)/, "ips.groupingBy { it }.eachCount()"], [/mapOf\s*\([^)]*\bto\b/, "mapOf(\"ssh\" to 22)"]] },

{ title: "Extension Protocols", concept: "default/named args, single-expression functions, extension functions, lambdas",
  lesson: `<pre>fun scan(host: String, port: Int = 443, timeoutMs: Int = 500) = "$host:$port"
scan("core", timeoutMs = 100)                  // named arg

fun String.isPrivateIp() = startsWith("10.") || startsWith("192.168.")
"10.0.0.9".isPrivateIp()                       // reads like a built-in

val square: (Int) -&gt; Int = { it * it }
fun retry(times: Int, op: () -&gt; Boolean): Boolean = (1..times).any { op() }
retry(3) { Math.random() &gt; 0.5 }               // trailing lambda</pre>`,
  task: `Write <code>fun scan(host: String, port: Int = 443)</code>, call it with a <b>named argument</b>, define the extension <code>fun String.isPrivateIp(): Boolean</code>, and write a higher-order function called with a trailing lambda. <code>scan</code> returns <code>"host:port"</code>. <code>isPrivateIp</code> is true for addresses that start with <code>10.</code>, <code>192.168.</code> or <code>172.16.</code>, and false for public ones like <code>8.8.8.8</code>.`,
  starter: `// your code here\n`,
  checks: [[/fun\s+scan\s*\(\s*host\s*:\s*String\s*,\s*port\s*:\s*Int\s*=\s*443/, "fun scan(host: String, port: Int = 443)"], [/scan\s*\([^)]*\w+\s*=\s*[^=]/, "named argument e.g. scan(\"core\", port = 22)"], [/fun\s+String\.isPrivateIp\s*\(\s*\)/, "fun String.isPrivateIp()"], [/\w+\s*\([^)]*\)\s*\{\s*[^}]*\}|\w+\s*\{\s*\w+\s*->/, "trailing lambda call"]] },

{ title: "Null Sector", concept: "nullable types, ?., ?:, let, !!, string processing",
  lesson: `<pre>val db: Map&lt;String, String&gt; = mapOf("neo" to "10.0.0.9")
val ip: String? = db["trinity"]         // may be null
val len = ip?.length ?: 0               // safe call + Elvis
ip?.let { println("found $it") }
val parts = "user=neo;role=op".split(";").associate {
    val (k, v) = it.split("="); k to v
}
"  NeO ".trim().lowercase()
"a1b2".filter { it.isDigit() }</pre><p>Null safety is part of the type system: a <code>String</code> can never be null. Avoid <code>!!</code>.</p>`,
  task: `Write <code>fun lookup(name: String, db: Map&lt;String, String&gt;): String</code> using <code>?:</code> to return <code>"unknown"</code>, and <code>fun parseKv(s: String): Map&lt;String, String&gt;</code> using <code>split</code> and <code>associate</code>. <code>parseKv("host=relay;port=22")</code> splits on <code>;</code>, then on <code>=</code>, and returns <code>mapOf("host" to "relay", "port" to "22")</code>.`,
  starter: `// your code here\n`,
  checks: [[/fun\s+lookup\s*\(\s*name\s*:\s*String\s*,\s*db\s*:\s*Map<String,\s*String>\s*\)\s*:\s*String/, "fun lookup(name: String, db: Map<String, String>): String"], [/\?:/, "Elvis ?: \"unknown\""], [/fun\s+parseKv/, "fun parseKv(s: String): Map<String, String>"], [/\.split\s*\(/, ".split(\";\")"], [/\.associate\s*\{/, ".associate { ... }"], [/^(?![\s\S]*!!)/, "no !!"]] },

{ title: "Data Constructs", concept: "data class, copy, destructuring, object, companion object",
  lesson: `<pre>data class Node(val name: String, val strength: Int = 0)
val a = Node("core")
val b = a.copy(strength = 90)          // immutable update
val (name, power) = b                  // destructuring
// equals, hashCode, toString are generated

object Registry { val nodes = mutableListOf&lt;Node&gt;() }   // singleton
class Session private constructor(val id: String) {
    companion object { fun open() = Session("s-" + System.nanoTime()) }
}</pre>`,
  task: `Define <code>data class Node(val name: String, val strength: Int = 0)</code>, use <code>.copy(</code> with a named argument, destructure a <code>Node</code>, and create an <code>object</code> singleton plus a class with a <code>companion object</code> factory.`,
  starter: `// your code here\n`,
  checks: [[/data\s+class\s+Node\s*\(/, "data class Node(...)"], [/\.copy\s*\(\s*\w+\s*=/, ".copy(strength = 90)"], [/val\s*\(\s*\w+\s*,\s*\w+\s*\)\s*=/, "val (name, power) = node"], [/^\s*object\s+\w+/m, "object Registry { ... }"], [/companion\s+object/, "companion object { ... }"]] },

{ title: "Exceptions & runCatching", concept: "try as expression, custom exceptions, runCatching, Result, require",
  lesson: `<pre>class BadPort(val raw: String) : Exception("bad port: $raw")

fun parsePort(s: String): Int {
    require(s.isNotBlank()) { "empty" }
    val p = s.toIntOrNull() ?: throw BadPort(s)
    if (p !in 1..65535) throw BadPort(s)
    return p
}
val port = try { parsePort("x") } catch (e: BadPort) { -1 }   // try is an expression
val r: Result&lt;Int&gt; = runCatching { parsePort("80") }
r.onSuccess { println(it) }.onFailure { println(it.message) }</pre><p>Kotlin has no checked exceptions. Use <code>toIntOrNull</code>-style APIs for expected failures.</p>`,
  task: `Define <code>class BadPort(...) : Exception(...)</code>, write <code>fun parsePort(s: String): Int</code> using <code>toIntOrNull()</code> and <code>require</code>, and handle errors once with try-as-expression and once with <code>runCatching</code>. Valid ports are whole numbers from 1 to 65535. <code>"http"</code>, <code>"0"</code> and <code>"70000"</code> must all throw.`,
  starter: `// your code here\n`,
  checks: [[/class\s+BadPort\s*\([^)]*\)\s*:\s*(Exception|RuntimeException|IllegalArgumentException)\s*\(/, "class BadPort(raw: String) : Exception(...)"], [/toIntOrNull\(\)/, "s.toIntOrNull()"], [/require\s*\(/, "require(...)"], [/=\s*try\s*\{[\s\S]*catch/, "val x = try { ... } catch (e: BadPort) { ... }"], [/runCatching\s*\{/, "runCatching { ... }"]] },

{ title: "Sealed Hierarchies", concept: "sealed interface/class, exhaustive when, smart casts, enum class",
  lesson: `<pre>sealed interface Event
data class Login(val user: String) : Event
data class Breach(val severity: Int) : Event
data object Logout : Event

fun describe(e: Event): String = when (e) {        // exhaustive, no else needed
    is Login -&gt; "login ${'$'}{e.user}"                  // smart cast
    is Breach -&gt; if (e.severity &gt;= 8) "CRITICAL" else "breach"
    Logout -&gt; "logout"
}
enum class Faction(val color: String) { LOGOS("#c79bff"), SENTINEL("#5ad1ff"), MERIDIAN("#7dff9a"), LANTERN("#ffc24a") }</pre><p>Sealed types model state machines and UI state. The compiler tells you when you forget a case.</p>`,
  task: `Define <code>sealed interface Event</code> with <code>Login</code>, <code>Breach</code> and <code>data object Logout</code>, then write an exhaustive <code>when</code> with <code>is</code> checks and no <code>else</code>. Add an <code>enum class</code> with a property.`,
  starter: `// your code here\n`,
  checks: [[/sealed\s+(interface|class)\s+Event/, "sealed interface Event"], [/data\s+object\s+Logout|object\s+Logout/, "data object Logout : Event"], [/is\s+Login\s*->/, "is Login ->"], [/is\s+Breach\s*->/, "is Breach ->"], [/enum\s+class\s+\w+\s*\(/, "enum class Faction(val color: String)"]] },

{ title: "Generic Interfaces", concept: "interfaces, open/override, abstract, generics, variance, inline reified",
  lesson: `<pre>interface Detector { fun detect(line: String): Boolean; val name: String get() = "detector" }
open class Base { open fun score() = 1 }          // classes are final by default
class Keyword(private val word: String) : Base(), Detector {
    override fun detect(line: String) = word in line
    override fun score() = 5
}
fun &lt;T : Comparable&lt;T&gt;&gt; strongest(xs: List&lt;T&gt;): T? = xs.maxOrNull()
class Box&lt;out T&gt;(val value: T)                    // covariant
inline fun &lt;reified T&gt; List&lt;Any&gt;.only() = filterIsInstance&lt;T&gt;()</pre>`,
  task: `Define <code>interface Detector</code>, an <code>open class</code> with an <code>open fun</code>, a class that extends it and implements <code>Detector</code> using <code>override</code>, and the generic <code>fun &lt;T : Comparable&lt;T&gt;&gt; strongest(xs: List&lt;T&gt;): T?</code>.`,
  starter: `// your code here\n`,
  checks: [[/interface\s+Detector/, "interface Detector"], [/open\s+class/, "open class Base"], [/override\s+fun/, "override fun ..."], [/fun\s*<\s*T\s*:\s*Comparable<T>\s*>\s*strongest/, "fun <T : Comparable<T>> strongest(xs: List<T>): T?"]] },

{ title: "Coroutine Swarm", concept: "suspend, coroutineScope, launch, async/await, Flow, Dispatchers",
  lesson: `<pre>import kotlinx.coroutines.*

suspend fun ping(host: String): Boolean { delay(50); return true }

suspend fun sweep(hosts: List&lt;String&gt;): Int = coroutineScope {
    hosts.map { h -&gt; async { ping(h) } }.awaitAll().count { it }
}
fun main() = runBlocking {
    val job = launch(Dispatchers.Default) { println(sweep(listOf("a", "b"))) }
    job.join()
}</pre><p>Structured concurrency means a scope waits for all of its children, and cancellation propagates through them. Use <code>Flow</code> for streams of values.</p>`,
  task: `Write <code>suspend fun ping(host: String): Boolean</code> using <code>delay</code>, <code>suspend fun sweep(hosts: List&lt;String&gt;): Int</code> using <code>coroutineScope</code>, <code>async</code> and <code>awaitAll()</code>, and a <code>main</code> using <code>runBlocking</code> and <code>launch</code>.`,
  starter: `import kotlinx.coroutines.*\n\n// your code here\n`,
  checks: [[/suspend\s+fun\s+ping/, "suspend fun ping(host: String): Boolean"], [/delay\s*\(/, "delay(50)"], [/coroutineScope\s*\{/, "coroutineScope { ... }"], [/async\s*\{/, "async { ping(h) }"], [/awaitAll\(\)/, ".awaitAll()"], [/runBlocking/, "runBlocking { ... }"], [/launch\s*(\([^)]*\))?\s*\{/, "launch { ... }"]] },

{ title: "Verified Build", concept: "kotlin.test, JUnit 5, @Test, assertEquals, assertFailsWith, Gradle",
  lesson: `<pre>import kotlin.test.*

class PortTest {
    @Test fun parsesValid() = assertEquals(443, parsePort("443"))
    @Test fun rejectsGarbage() { assertFailsWith&lt;BadPort&gt; { parsePort("abc") } }
}
// build.gradle.kts
// dependencies { testImplementation(kotlin("test")) }</pre><p>Run tests with <code>./gradlew test</code>. Lint with ktlint or detekt.</p>`,
  task: `Write a test class with at least two <code>@Test</code> functions using <code>assertEquals</code> and <code>assertFailsWith</code>.`,
  starter: `import kotlin.test.*\n\n// your code here\n`,
  checks: [[/import\s+kotlin\.test|import\s+org\.junit/, "import kotlin.test.*"], [/class\s+\w+Test/, "class PortTest"], [/@Test[\s\S]*@Test/, "two @Test functions"], [/assertEquals\s*\(/, "assertEquals(...)"], [/assertFailsWith\s*<?/, "assertFailsWith<BadPort> { ... }"]] },

{ title: "Operation: Field Unit", concept: "capstone: Jetpack Compose, state, ViewModel, StateFlow, sealed UI state",
  lesson: `<p>Build a native Android screen that field teams can carry. Google has said all new Android UI should be built with Compose.</p><pre>sealed interface UiState { data object Loading : UiState; data class Ready(val relays: List&lt;String&gt;) : UiState }

class RelayViewModel : ViewModel() {
    private val _state = MutableStateFlow&lt;UiState&gt;(UiState.Loading)
    val state: StateFlow&lt;UiState&gt; = _state
    fun refresh() = viewModelScope.launch { _state.value = UiState.Ready(listOf("north", "harbor")) }
}

@Composable
fun RelayScreen(vm: RelayViewModel) {
    val state by vm.state.collectAsState()
    var filter by remember { mutableStateOf("") }
    Column {
        TextField(value = filter, onValueChange = { filter = it })
        when (val s = state) {
            UiState.Loading -&gt; Text("Loading...")
            is UiState.Ready -&gt; LazyColumn { items(s.relays.filter { filter in it }) { Text(it) } }
        }
        Button(onClick = { vm.refresh() }) { Text("Refresh") }
    }
}</pre>`,
  task: `Build a <code>@Composable</code> screen with <code>remember { mutableStateOf(...) }</code>, a <code>LazyColumn</code>, a <code>Button</code>, and a <code>ViewModel</code> that exposes a <code>StateFlow</code> of a sealed UI state, updated in <code>viewModelScope.launch</code>.`,
  starter: `// your code here\n`,
  checks: [[/@Composable/, "@Composable fun RelayScreen(...)"], [/remember\s*\{\s*mutableStateOf/, "remember { mutableStateOf(\"\") }"], [/LazyColumn/, "LazyColumn { ... }"], [/Button\s*\(\s*onClick/, "Button(onClick = { ... })"], [/:\s*ViewModel\s*\(\s*\)/, "class RelayViewModel : ViewModel()"], [/StateFlow/, "StateFlow<UiState>"], [/viewModelScope\.launch/, "viewModelScope.launch { ... }"], [/sealed\s+(interface|class)/, "sealed interface UiState"]] }
]);
