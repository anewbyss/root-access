RA.lang("cpp", { name: "C++", tag: "C++", runtime: "pattern", why: "Used for game engines, browsers, trading systems, embedded devices and AI runtimes. Fast, but memory safety is your job." });
RA.add("cpp", "cpp", [
{ title: "Kernel Handshake", concept: "#include, main, iostream, auto, const, fundamental types",
  lesson: `<pre>#include &lt;iostream&gt;
#include &lt;string&gt;

int main() {
    const std::string handle = "neo";
    int level = 3;
    auto ratio = 0.75;                  // deduced as double
    ++level;
    std::cout &lt;&lt; "Agent " &lt;&lt; handle &lt;&lt; " // level " &lt;&lt; level &lt;&lt; '\\n';
    return 0;
}</pre><p>Compile with <code>g++ -std=c++23 -Wall -Wextra -O2 main.cpp</code>. Always initialize variables, because reading an uninitialized local is a classic bug (C++26 finally makes it defined "erroneous behavior").</p>`,
  task: `Write <code>std::string intro(const std::string&amp; handle, int level)</code> that returns the formatted string, and an <code>int main()</code> that uses <code>auto</code>, <code>const</code> and <code>std::cout</code>. <code>intro("neo", 3)</code> must return <code>"Agent neo // level 3"</code>.`,
  starter: `#include <iostream>\n#include <string>\n\n// your code here\n`,
  checks: [[/std::string\s+intro\s*\(\s*const\s+std::string\s*&\s*handle\s*,\s*int\s+level\s*\)/, "std::string intro(const std::string& handle, int level)"], [/int\s+main\s*\(/, "int main()"], [/\bauto\s+\w+\s*=/, "auto x = ..."], [/\bconst\s+/, "const ..."], [/std::cout\s*<</, "std::cout << ..."]] },

{ title: "Branch Prediction", concept: "if/else, switch, for, while, ternary, enum class",
  lesson: `<pre>enum class Level { Low, Medium, High, Critical };

Level classify(int score) {
    if (score &gt;= 90) return Level::Critical;
    if (score &gt;= 60) return Level::High;
    return score &gt;= 30 ? Level::Medium : Level::Low;
}
const char* name(Level l) {
    switch (l) {
        case Level::Critical: return "CRITICAL";
        case Level::High:     return "HIGH";
        case Level::Medium:   return "MEDIUM";
        case Level::Low:      return "LOW";
    }
    return "?";
}</pre><p>Prefer <code>enum class</code>, which is scoped and doesn't implicitly convert to <code>int</code>. Turn on <code>-Wswitch</code> to catch missing cases.</p>`,
  task: `Define <code>enum class Level</code>, write <code>Level classify(int score)</code> with <code>if</code>/<code>else</code>, and <code>const char* name(Level l)</code> using <code>switch</code> over every enumerator. Use the thresholds 90, 60 and 30, and have <code>name</code> return <code>"CRITICAL"</code>, <code>"HIGH"</code>, <code>"MEDIUM"</code> or <code>"LOW"</code>.`,
  starter: `// your code here\n`,
  checks: [[/enum\s+class\s+Level/, "enum class Level { ... }"], [/Level\s+classify\s*\(\s*int\s+score\s*\)/, "Level classify(int score)"], [/switch\s*\(\s*\w+\s*\)/, "switch (l) { ... }"], [/case\s+Level::\w+\s*:/, "case Level::Critical:"]] },

{ title: "Container Ops", concept: "std::vector, std::unordered_map, std::map, std::set, range-for, structured bindings",
  lesson: `<pre>#include &lt;vector&gt;
#include &lt;unordered_map&gt;
std::vector&lt;std::string&gt; ips{"10.0.0.9", "10.0.0.4", "10.0.0.9"};
ips.push_back("10.0.0.1");
std::unordered_map&lt;std::string, int&gt; counts;
for (const auto&amp; ip : ips) ++counts[ip];
for (const auto&amp; [ip, n] : counts) std::cout &lt;&lt; ip &lt;&lt; " " &lt;&lt; n &lt;&lt; '\\n';   // C++17
if (auto it = counts.find("x"); it != counts.end()) { }</pre><p><code>std::vector</code> is your default container. Use <code>std::map</code> when you need keys in sorted order.</p>`,
  task: `Write <code>std::unordered_map&lt;std::string, int&gt; tally(const std::vector&lt;std::string&gt;&amp; ips)</code> using a range-for with <code>const auto&amp;</code>, and iterate the result with <b>structured bindings</b>.`,
  starter: `#include <string>\n#include <vector>\n#include <unordered_map>\n\n// your code here\n`,
  checks: [[/std::unordered_map<std::string,\s*int>\s+tally\s*\(\s*const\s+std::vector<std::string>\s*&\s*ips\s*\)/, "std::unordered_map<std::string,int> tally(const std::vector<std::string>& ips)"], [/for\s*\(\s*const\s+auto\s*&\s*\w+\s*:\s*ips\s*\)/, "for (const auto& ip : ips)"], [/\+\+\s*\w+\s*\[\s*\w+\s*\]|\w+\s*\[\s*\w+\s*\]\s*(\+\+|\+=\s*1)/, "++counts[ip]"], [/auto\s*&?\s*\[\s*\w+\s*,\s*\w+\s*\]/, "for (const auto& [ip, n] : counts)"]] },

{ title: "References & Signatures", concept: "pass by value, reference and const reference, default args, overloading, lambdas",
  lesson: `<pre>std::size_t count_words(const std::string&amp; text);   // read-only, no copy
void redact(std::string&amp; msg) { msg = "[REDACTED]"; } // mutate caller's object
std::string scan(const std::string&amp; host, int port = 443);
int add(int a, int b);  double add(double a, double b);   // overloads

auto square = [](int x) { return x * x; };
int threshold = 80;
auto hot = [threshold](int s) { return s &gt; threshold; };  // capture by value</pre><p>Rule of thumb: pass cheap types by value, large read-only types by <code>const&amp;</code>, and anything you need to modify by <code>&amp;</code>.</p>`,
  task: `Write <code>std::size_t count_words(const std::string&amp; text)</code>, <code>void redact(std::string&amp; msg)</code>, <code>scan</code> with a default <code>port = 443</code>, and a lambda that captures a variable. <code>count_words</code> counts words separated by any whitespace (blank text is 0). <code>redact</code> replaces the text with <code>"[REDACTED]"</code>. <code>scan</code> returns <code>"host:port"</code>.`,
  starter: `#include <string>\n#include <sstream>\n\n// your code here\n`,
  checks: [[/count_words\s*\(\s*const\s+std::string\s*&\s*\w+\s*\)/, "count_words(const std::string& text)"], [/void\s+redact\s*\(\s*std::string\s*&\s*\w+\s*\)/, "void redact(std::string& msg)"], [/int\s+port\s*=\s*443/, "int port = 443"], [/\[\s*[&=]?\s*\w+\s*\]\s*\(/, "lambda with capture [threshold](int s) { ... }"]] },

{ title: "String Forensics", concept: "std::string, std::string_view, std::format, char handling, stringstream",
  lesson: `<pre>#include &lt;string_view&gt;
#include &lt;format&gt;
bool is_private(std::string_view ip) { return ip.starts_with("10.") || ip.starts_with("192.168."); }
std::string caesar(std::string_view text, int shift) {
    std::string out;
    out.reserve(text.size());
    for (char c : text) {
        if (std::isalpha(static_cast&lt;unsigned char&gt;(c))) {
            char base = std::isupper(static_cast&lt;unsigned char&gt;(c)) ? 'A' : 'a';
            out += static_cast&lt;char&gt;(base + (c - base + shift) % 26);
        } else out += c;
    }
    return out;
}
std::string line = std::format("{:&lt;10}|{:&gt;5}", "core", 443);   // C++20</pre><p><code>string_view</code> is a non-owning view. Never return one that points into a temporary string.</p>`,
  task: `Write <code>std::string caesar(std::string_view text, int shift)</code> using <code>reserve</code>, <code>std::isalpha</code> and <code>% 26</code>, and <code>bool is_private(std::string_view ip)</code> using <code>starts_with</code>. <code>is_private</code> is true for addresses starting with <code>10.</code> or <code>192.168.</code>, and false for public ones like <code>8.8.8.8</code>.`,
  starter: `#include <string>\n#include <string_view>\n#include <cctype>\n\n// your code here\n`,
  checks: [[/std::string\s+caesar\s*\(\s*std::string_view\s+\w+\s*,\s*int\s+shift\s*\)/, "std::string caesar(std::string_view text, int shift)"], [/\.reserve\s*\(/, "out.reserve(text.size())"], [/std::isalpha|isalpha/, "std::isalpha(...)"], [/%\s*26/, "% 26"], [/\.starts_with\s*\(/, "ip.starts_with(\"10.\")"]] },

{ title: "RAII Constructs", concept: "classes, constructors, member init lists, destructors, RAII, rule of zero",
  lesson: `<pre>class Node {
public:
    explicit Node(std::string name, int strength = 0)
        : name_(std::move(name)), strength_(strength) {}      // init list
    [[nodiscard]] bool hot() const { return strength_ &gt; 80; }
    void boost(int by) { strength_ += by; }
private:
    std::string name_;
    int strength_;
};
class LogFile {                       // RAII: resource tied to object lifetime
public:
    explicit LogFile(const char* path) : f_(std::fopen(path, "a")) {}
    ~LogFile() { if (f_) std::fclose(f_); }
    LogFile(const LogFile&amp;) = delete;
    LogFile&amp; operator=(const LogFile&amp;) = delete;
private:
    std::FILE* f_;
};</pre><p>RAII is the central idea in C++: acquire a resource in the constructor and release it in the destructor. Most classes then need no special members at all (the "rule of zero").</p>`,
  task: `Write <code>class Node</code> with an <code>explicit</code> constructor that uses a member initializer list, a <code>const</code> member function, and private members. Then write an RAII class with a destructor (<code>~</code>) and a deleted copy constructor. Use <code>Node(std::string name, int strength)</code> with accessors <code>name()</code> and <code>strength()</code> that are marked <code>const</code>.`,
  starter: `#include <string>\n#include <cstdio>\n\n// your code here\n`,
  checks: [[/class\s+Node/, "class Node"], [/explicit\s+Node\s*\(/, "explicit Node(...)"], [/\)\s*:\s*\w+_?\s*\(/, "member init list : name_(std::move(name))"], [/\)\s*const\s*\{/, "bool hot() const { ... }"], [/~\w+\s*\(\s*\)/, "destructor ~LogFile()"], [/=\s*delete\s*;/, "LogFile(const LogFile&) = delete;"]] },

{ title: "Smart Pointers", concept: "unique_ptr, make_unique, shared_ptr, weak_ptr, std::optional, std::expected",
  lesson: `<pre>#include &lt;memory&gt;
#include &lt;optional&gt;
auto node = std::make_unique&lt;Node&gt;("core");           // sole owner, freed automatically
std::vector&lt;std::unique_ptr&lt;Node&gt;&gt; nodes;
nodes.push_back(std::move(node));                      // transfer ownership
auto shared = std::make_shared&lt;Node&gt;("relay");         // ref-counted
std::weak_ptr&lt;Node&gt; observer = shared;                  // doesn't extend lifetime

std::optional&lt;int&gt; parse_port(std::string_view s);    // maybe a value
// C++23: std::expected&lt;int, std::string&gt; for value-or-error</pre><p>In modern C++ you should almost never write <code>new</code> or <code>delete</code> yourself.</p>`,
  task: `Create a <code>std::unique_ptr</code> with <code>std::make_unique</code>, move it into a vector with <code>std::move</code>, and write <code>std::optional&lt;int&gt; parse_port(std::string_view s)</code> that returns <code>std::nullopt</code> on bad input. Don't use raw <code>new</code>. Valid ports are whole numbers from 1 to 65535 with nothing after them, so <code>"http"</code>, <code>"0"</code>, <code>"70000"</code> and <code>"80abc"</code> all return <code>std::nullopt</code>.`,
  starter: `#include <memory>\n#include <optional>\n#include <string_view>\n#include <vector>\n\n// your code here\n`,
  checks: [[/std::make_unique\s*</, "std::make_unique<Node>(...)"], [/std::unique_ptr\s*</, "std::unique_ptr<Node>"], [/std::move\s*\(/, "std::move(node)"], [/std::optional<int>\s+parse_port/, "std::optional<int> parse_port(std::string_view s)"], [/std::nullopt/, "return std::nullopt;"], [/^(?![\s\S]*\bnew\s+\w)/, "no raw new"]] },

{ title: "Heartbleed Lab", concept: "bounds safety, std::span, .at(), integer overflow, sanitizers",
  lesson: `<p>April 2014: Heartbleed (CVE-2014-0160). OpenSSL trusted a length field sent by the client and copied up to 64KB of server memory back, leaking private keys. The bug came down to one missing bounds check.</p><pre>// VULNERABLE
void reply(const char* payload, uint16_t claimed_len, char* out) { std::memcpy(out, payload, claimed_len); }

// SAFE
#include &lt;span&gt;
std::optional&lt;std::vector&lt;std::byte&gt;&gt; reply(std::span&lt;const std::byte&gt; payload, std::size_t claimed_len) {
    if (claimed_len &gt; payload.size()) return std::nullopt;           // reject the lie
    auto slice = payload.first(claimed_len);
    return std::vector&lt;std::byte&gt;(slice.begin(), slice.end());
}</pre><p>Use <code>.at()</code> or hardened standard libraries for checked access. Build with <code>-fsanitize=address,undefined</code> while testing. The NSA and CISA recommend memory-safe languages for new code, and this lab shows why.</p>`,
  task: `Write a safe <code>reply</code> that takes a <code>std::span&lt;const std::byte&gt;</code> and a claimed length, <b>compares it against <code>payload.size()</code></b>, and returns <code>std::nullopt</code> when the claim is larger. Use <code>.first(</code> or <code>.subspan(</code>, and don't use <code>memcpy</code>. Name it <code>std::optional&lt;std::vector&lt;std::byte&gt;&gt; heartbeat_reply(std::span&lt;const std::byte&gt; payload, std::size_t claimed)</code>. It returns the first <code>claimed</code> bytes, or <code>std::nullopt</code> when <code>claimed &gt; payload.size()</code>.`,
  starter: `#include <span>\n#include <optional>\n#include <vector>\n#include <cstddef>\n\n// your code here\n`,
  checks: [[/std::span\s*<\s*const\s+std::byte\s*>/, "std::span<const std::byte> payload"], [/\w+\s*>\s*payload\.size\(\)|payload\.size\(\)\s*<\s*\w+/, "if (claimed_len > payload.size())"], [/std::nullopt/, "return std::nullopt;"], [/\.first\s*\(|\.subspan\s*\(/, "payload.first(claimed_len)"], [/^(?![\s\S]*memcpy)/, "no memcpy"]] },

{ title: "Template Forge", concept: "function/class templates, concepts, requires, constexpr",
  lesson: `<pre>#include &lt;concepts&gt;
template &lt;std::totally_ordered T&gt;
const T&amp; strongest(const std::vector&lt;T&gt;&amp; xs) {
    return *std::max_element(xs.begin(), xs.end());
}
template &lt;typename T&gt;
class Box { public: explicit Box(T v) : v_(std::move(v)) {} const T&amp; get() const { return v_; } private: T v_; };

template &lt;typename T&gt; requires std::integral&lt;T&gt;
constexpr T clamp_port(T p) { return p &lt; 1 ? 1 : (p &gt; 65535 ? 65535 : p); }
static_assert(clamp_port(70000) == 65535);              // checked at compile time</pre><p>C++20 <b>concepts</b> replace cryptic template errors with readable constraints.</p>`,
  task: `Write <code>template &lt;std::totally_ordered T&gt; T strongest(const std::vector&lt;T&gt;&amp; xs)</code> (a concept-constrained template), a class template <code>Box&lt;T&gt;</code> with a <code>get()</code> accessor, and a <code>constexpr</code> function verified with <code>static_assert</code>.`,
  starter: `#include <concepts>\n#include <vector>\n#include <algorithm>\n\n// your code here\n`,
  checks: [[/template\s*<\s*std::\w+\s+T\s*>|requires\s+std::\w+/, "template <std::totally_ordered T> or requires std::integral<T>"], [/template\s*<\s*typename\s+T\s*>\s*class\s+Box/, "template <typename T> class Box"], [/constexpr\s+\w+/, "constexpr function"], [/static_assert\s*\(/, "static_assert(...)"]] },

{ title: "Algorithm Suite", concept: "<algorithm>, ranges, sort, find_if, accumulate, transform, views",
  lesson: `<pre>#include &lt;algorithm&gt;
#include &lt;numeric&gt;
#include &lt;ranges&gt;
std::ranges::sort(nodes, {}, &amp;Node::strength);                 // sort by projection
auto it = std::ranges::find_if(lines, [](auto&amp; l) { return l.ends_with("FAIL"); });
int total = std::accumulate(ports.begin(), ports.end(), 0);
auto fails = lines
    | std::views::filter([](const std::string&amp; l) { return l.ends_with("FAIL"); })
    | std::views::transform([](const std::string&amp; l) { return l.substr(0, l.find(' ')); });</pre><p>Learn the algorithms before writing raw loops. Range views are lazy and composable.</p>`,
  task: `Given <code>struct Hit { std::string ip; int count; };</code>, write <code>int analyze(std::vector&lt;Hit&gt;&amp; hits)</code> that sorts hits by <code>count</code> descending (<code>std::sort</code> or <code>std::ranges::sort</code> with a lambda or projection) and returns the total count via <code>std::accumulate</code>. Also use <code>find_if</code> and a <code>std::views::filter</code> pipeline, for example to print internal <code>10.</code> IPs or noisy hits.`,
  starter: `#include <algorithm>\n#include <numeric>\n#include <ranges>\n#include <string>\n#include <vector>\n\n// your code here\n`,
  checks: [[/std::(ranges::)?sort\s*\(/, "std::ranges::sort(...)"], [/find_if\s*\(/, "std::ranges::find_if(...)"], [/std::accumulate\s*\(/, "std::accumulate(...)"], [/std::views::filter|std::ranges::views::filter/, "| std::views::filter(...)"]] },

{ title: "Thread Pool", concept: "std::thread, std::jthread, mutex, lock_guard, atomic, std::async",
  lesson: `<pre>#include &lt;thread&gt;
#include &lt;mutex&gt;
#include &lt;atomic&gt;
#include &lt;future&gt;
int sweep(const std::vector&lt;std::string&gt;&amp; hosts) {
    std::atomic&lt;int&gt; up{0};
    std::mutex log_mu;
    std::vector&lt;std::jthread&gt; workers;                     // C++20, joins automatically
    for (const auto&amp; h : hosts) {
        workers.emplace_back([&amp;, h] {
            if (ping(h)) ++up;
            std::lock_guard lock(log_mu);
            std::cout &lt;&lt; h &lt;&lt; " checked\\n";
        });
    }
    workers.clear();                                       // join all
    return up.load();
}
auto f = std::async(std::launch::async, [] { return ping("core"); });</pre><p>Data races are undefined behavior. Guard shared state with <code>std::mutex</code> or use <code>std::atomic</code>, and run ThreadSanitizer.</p>`,
  task: `Write <code>int sweep(const std::vector&lt;std::string&gt;&amp; hosts)</code> using <code>std::thread</code> or <code>std::jthread</code>, a <code>std::atomic&lt;int&gt;</code> counter, and a <code>std::mutex</code> with <code>std::lock_guard</code>. Join every thread. Every host counts as reachable, so <code>sweep</code> returns the number of hosts.`,
  starter: `#include <thread>\n#include <mutex>\n#include <atomic>\n#include <vector>\n#include <string>\n#include <iostream>\n\nbool ping(const std::string&) { return true; }\n\n// your code here\n`,
  checks: [[/std::(j)?thread/, "std::jthread / std::thread"], [/std::atomic\s*<\s*int\s*>/, "std::atomic<int> up{0}"], [/std::mutex/, "std::mutex"], [/std::(lock_guard|scoped_lock|unique_lock)/, "std::lock_guard lock(mu)"], [/\.join\s*\(\s*\)|jthread|\.clear\s*\(\s*\)/, "join all threads"]] },

{ title: "Operation: Zero-Copy Core", concept: "capstone: move semantics, rule of five, noexcept, exceptions, tests",
  lesson: `<p>Build the packet buffer at the heart of a high-frequency relay. It has to own memory safely, move cheaply instead of copying, report errors properly, and come with tests.</p><pre>class Buffer {
public:
    explicit Buffer(std::size_t n) : data_(std::make_unique&lt;std::byte[]&gt;(n)), size_(n) {}
    Buffer(Buffer&amp;&amp; other) noexcept : data_(std::move(other.data_)), size_(std::exchange(other.size_, 0)) {}
    Buffer&amp; operator=(Buffer&amp;&amp; other) noexcept {
        data_ = std::move(other.data_); size_ = std::exchange(other.size_, 0); return *this;
    }
    Buffer(const Buffer&amp;) = delete;
    Buffer&amp; operator=(const Buffer&amp;) = delete;
    std::byte&amp; at(std::size_t i) {
        if (i &gt;= size_) throw std::out_of_range("Buffer::at");
        return data_[i];
    }
    [[nodiscard]] std::size_t size() const noexcept { return size_; }
private:
    std::unique_ptr&lt;std::byte[]&gt; data_;
    std::size_t size_;
};
// GoogleTest
TEST(Buffer, ThrowsOutOfRange) { Buffer b(4); EXPECT_THROW(b.at(4), std::out_of_range); }</pre>`,
  task: `Write <code>class Buffer</code> with a <b>move constructor</b> and <b>move assignment</b> marked <code>noexcept</code>, deleted copy operations, an <code>at()</code> that throws <code>std::out_of_range</code>, and storage in a <code>std::unique_ptr</code>. Add a <code>TEST(...)</code> using <code>EXPECT_THROW</code> or <code>EXPECT_EQ</code>.`,
  starter: `#include <memory>\n#include <stdexcept>\n#include <utility>\n#include <cstddef>\n#include <gtest/gtest.h>\n\n// your code here\n`,
  checks: [[/Buffer\s*\(\s*Buffer\s*&&\s*\w+\s*\)\s*noexcept/, "Buffer(Buffer&& other) noexcept"], [/operator=\s*\(\s*Buffer\s*&&\s*\w+\s*\)\s*noexcept/, "Buffer& operator=(Buffer&& other) noexcept"], [/Buffer\s*\(\s*const\s+Buffer\s*&\s*\)\s*=\s*delete/, "Buffer(const Buffer&) = delete;"], [/throw\s+std::out_of_range/, "throw std::out_of_range(...)"], [/std::unique_ptr\s*</, "std::unique_ptr<std::byte[]> data_"], [/TEST\s*\(/, "TEST(Buffer, ...)"], [/EXPECT_(THROW|EQ)\s*\(/, "EXPECT_THROW(...)"]] }
]);
