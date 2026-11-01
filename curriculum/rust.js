RA.lang("rust", { name: "Rust", tag: "RS", runtime: "pattern", why: "Memory-safe systems code. Governments now push it to prevent Heartbleed-class bugs." });
RA.add("rust", "rs", [
{ title: "Immutable Oath", concept: "let, mut, types, println!, format!",
  lesson: `<pre>fn main() {
    let handle = "neo";          // immutable by default
    let mut level: u32 = 3;      // mut to change
    level += 1;
    println!("Agent {handle} // level {level}");
    let s = format!("{}:{}", handle, level);
}</pre><p>Integer types: <code>i32</code>, <code>u32</code>, <code>i64</code>, <code>usize</code>. Floats are <code>f64</code>. Then <code>bool</code> and <code>char</code>.</p>`,
  task: `Write <code>fn intro(handle: &amp;str, level: u32) -&gt; String</code> returning <code>format!("Agent {} // level {}", handle, level)</code>, and a <code>main</code> with a <code>let mut</code> counter that you increment and print with <code>println!</code>.`,
  starter: `// your code here\n`,
  checks: [[/fn\s+intro\s*\(\s*handle\s*:\s*&str\s*,\s*level\s*:\s*u32\s*\)\s*->\s*String/, "fn intro(handle: &str, level: u32) -> String"], [/format!\s*\(/, "format!(...)"], [/let\s+mut\s+\w+/, "let mut counter = 0;"], [/println!\s*\(/, "println!(...)"]] },

{ title: "Match the Threat", concept: "if expressions, loops, match with ranges",
  lesson: `<pre>let label = if online { "UP" } else { "DOWN" };   // if is an expression
for i in 0..5 { }          // 0 to 4
for host in &amp;hosts { }
let lvl = match score {
    90..=100 =&gt; "CRITICAL",
    60..=89 =&gt; "HIGH",
    30..=59 =&gt; "MEDIUM",
    _ =&gt; "LOW",
};</pre><p><code>match</code> must be exhaustive, and <code>_</code> catches everything else.</p>`,
  task: `Write <code>fn threat_level(score: u32) -&gt; &amp;'static str</code> using <code>match</code> with inclusive ranges and a <code>_</code> arm.`,
  starter: `// your code here\n`,
  checks: [[/fn\s+threat_level\s*\(\s*score\s*:\s*u32\s*\)\s*->\s*&'static\s+str/, "fn threat_level(score: u32) -> &'static str"], [/match\s+score/, "match score { ... }"], [/\d+\.\.=\d+\s*=>/, "inclusive range 90..=100 =>"], [/_\s*=>/, "_ => \"LOW\""]] },

{ title: "Vectors & Maps", concept: "Vec, HashMap, entry API",
  lesson: `<pre>use std::collections::HashMap;
let mut ips: Vec&lt;String&gt; = Vec::new();
ips.push("10.0.0.9".to_string());
let mut counts: HashMap&lt;String, u32&gt; = HashMap::new();
for ip in &amp;ips {
    *counts.entry(ip.clone()).or_insert(0) += 1;
}
if let Some(n) = counts.get("10.0.0.9") { println!("{n}"); }</pre><p>The <b>entry API</b> is the idiomatic way to insert or update in one step.</p>`,
  task: `Write <code>fn tally(ips: &amp;[String]) -&gt; HashMap&lt;String, u32&gt;</code> using <code>entry(...).or_insert(0)</code>.`,
  starter: `use std::collections::HashMap;\n\n// your code here\n`,
  checks: [[/fn\s+tally\s*\(\s*ips\s*:\s*&\[String\]\s*\)\s*->\s*HashMap<String,\s*u32>/, "fn tally(ips: &[String]) -> HashMap<String, u32>"], [/HashMap::new\(\)/, "HashMap::new()"], [/\.entry\(/, ".entry(ip.clone())"], [/\.or_insert\(\s*0\s*\)/, ".or_insert(0)"]] },

{ title: "The Borrow Oath", concept: "ownership, move, borrowing, &mut",
  lesson: `<p>Every value has exactly one <b>owner</b>. Assigning or passing a <code>String</code> <b>moves</b> it. To lend a value without moving it, borrow with <code>&amp;</code> (shared, read-only) or <code>&amp;mut</code> (exclusive, writable):</p><pre>fn len(s: &amp;String) -&gt; usize { s.len() }
fn shout(s: &amp;mut String) { s.push('!'); }
let mut msg = String::from("hi");
shout(&amp;mut msg);
let n = len(&amp;msg);       // msg still owned here</pre><p>The rule: many <code>&amp;</code> or exactly one <code>&amp;mut</code>, never both at once. This is what prevents data races and use-after-free bugs.</p>`,
  task: `Write <code>fn count_words(text: &amp;str) -&gt; usize</code> using <code>split_whitespace().count()</code>, and <code>fn redact(msg: &amp;mut String)</code> that replaces the contents with <code>"[REDACTED]"</code> by assigning to <code>*msg</code>.`,
  starter: `// your code here\n`,
  checks: [[/fn\s+count_words\s*\(\s*text\s*:\s*&str\s*\)\s*->\s*usize/, "fn count_words(text: &str) -> usize"], [/split_whitespace\(\)\.count\(\)/, "text.split_whitespace().count()"], [/fn\s+redact\s*\(\s*msg\s*:\s*&mut\s+String\s*\)/, "fn redact(msg: &mut String)"], [/\*msg\s*=/, "*msg = String::from(\"[REDACTED]\")"]] },

{ title: "Cipher Breaker", concept: "String vs &str, chars, iterators over text",
  lesson: `<pre>let owned: String = "neo".to_string();
let borrowed: &amp;str = &amp;owned;          // a view into it
for c in s.chars() { if c.is_ascii_lowercase() { ... } }
let up: String = s.chars().map(|c| c.to_ascii_uppercase()).collect();</pre><p>Take <code>&amp;str</code> as a parameter and return <code>String</code>. Don't index strings by byte (<code>s[0]</code>), because UTF-8 makes that unsafe. Iterate <code>.chars()</code>.</p>`,
  task: `Write <code>fn caesar(text: &amp;str, shift: u8) -&gt; String</code> that maps over <code>text.chars()</code>, shifts ASCII letters with wraparound (<code>% 26</code>) and keeps case, then <code>.collect()</code>.`,
  starter: `// your code here\n`,
  checks: [[/fn\s+caesar\s*\(\s*text\s*:\s*&str\s*,\s*shift\s*:\s*u8\s*\)\s*->\s*String/, "fn caesar(text: &str, shift: u8) -> String"], [/\.chars\(\)/, "text.chars()"], [/%\s*26/, "% 26"], [/\.collect\s*(::<\s*String\s*>)?\s*\(\)/, ".collect()"]] },

{ title: "Structs & Enums", concept: "struct, impl, enum with data, derive",
  lesson: `<pre>#[derive(Debug, Clone, PartialEq)]
struct Node { name: String, strength: u32 }

impl Node {
    fn new(name: &amp;str) -&gt; Self { Self { name: name.into(), strength: 0 } }
    fn boost(&amp;mut self, by: u32) -&gt; u32 { self.strength += by; self.strength }
}

enum Event { Login { user: String }, Breach(u8), Logout }</pre><p>Enums carry data. Together with <code>match</code>, they're one of Rust's most useful features.</p>`,
  task: `Define <code>#[derive(Debug)] struct Node</code> with <code>name: String</code> and <code>strength: u32</code>, an <code>impl Node</code> with <code>fn new(name: &amp;str) -&gt; Self</code> and <code>fn boost(&amp;mut self, by: u32) -&gt; u32</code>, and <code>enum Event { Login(String), Breach(u8), Logout }</code> with <code>fn describe(e: &amp;Event) -&gt; String</code> using <code>match</code>.`,
  starter: `// your code here\n`,
  checks: [[/#\[derive\([^)]*Debug/, "#[derive(Debug)]"], [/struct\s+Node\s*\{/, "struct Node { ... }"], [/impl\s+Node/, "impl Node { ... }"], [/fn\s+new\s*\(\s*name\s*:\s*&str\s*\)\s*->\s*Self/, "fn new(name: &str) -> Self"], [/fn\s+boost\s*\(\s*&mut\s+self/, "fn boost(&mut self, by: u32) -> u32"], [/enum\s+Event/, "enum Event { ... }"], [/Event::Breach\s*\(/, "match arm Event::Breach(sev) => ..."]] },

{ title: "Option or Oblivion", concept: "Option, Result, ?, custom errors",
  lesson: `<pre>fn first_ip(lines: &amp;[&amp;str]) -&gt; Option&lt;&amp;str&gt; { lines.first().copied() }

#[derive(Debug)]
enum ParseError { Empty, BadPort(String) }

fn parse_port(s: &amp;str) -&gt; Result&lt;u16, ParseError&gt; {
    if s.is_empty() { return Err(ParseError::Empty); }
    s.parse::&lt;u16&gt;().map_err(|_| ParseError::BadPort(s.into()))
}
fn load() -&gt; Result&lt;u16, ParseError&gt; { let p = parse_port("80")?; Ok(p) }  // ? propagates</pre><p>The CrowdStrike crash (2024) was an out-of-bounds read. <code>.get(i)</code> returns <code>Option</code> instead of reading garbage.</p>`,
  task: `Define <code>enum ParseError { Empty, BadPort(String) }</code>, write <code>fn parse_port(s: &amp;str) -&gt; Result&lt;u16, ParseError&gt;</code> using <code>map_err</code>, and <code>fn ports(list: &amp;[&amp;str]) -&gt; Result&lt;Vec&lt;u16&gt;, ParseError&gt;</code> that uses the <code>?</code> operator in a loop.`,
  starter: `// your code here\n`,
  checks: [[/enum\s+ParseError/, "enum ParseError { Empty, BadPort(String) }"], [/Result<\s*u16\s*,\s*ParseError\s*>/, "Result<u16, ParseError>"], [/\.map_err\s*\(/, ".map_err(|_| ParseError::BadPort(...))"], [/Err\(\s*ParseError::Empty\s*\)/, "return Err(ParseError::Empty)"], [/\w+\s*\(\s*\w+\s*\)\?/, "use ? e.g. parse_port(s)?"], [/Ok\s*\(/, "Ok(...)"]] },

{ title: "Shared Behavior", concept: "traits, generics, trait bounds, impl Trait",
  lesson: `<pre>trait Detector { fn detect(&amp;self, line: &amp;str) -&gt; bool; }

struct Keyword(String);
impl Detector for Keyword {
    fn detect(&amp;self, line: &amp;str) -&gt; bool { line.contains(&amp;self.0) }
}

fn count_hits&lt;D: Detector&gt;(d: &amp;D, lines: &amp;[&amp;str]) -&gt; usize { ... }
fn all(ds: &amp;[Box&lt;dyn Detector&gt;]) { ... }   // dynamic dispatch</pre><p>Standard traits worth implementing: <code>Display</code>, <code>From</code>, <code>Default</code>, <code>Iterator</code>.</p>`,
  task: `Define <code>trait Detector</code> with <code>fn detect(&amp;self, line: &amp;str) -&gt; bool</code>, implement it for <code>struct Keyword(String)</code>, and write the generic <code>fn count_hits&lt;D: Detector&gt;(d: &amp;D, lines: &amp;[&amp;str]) -&gt; usize</code>.`,
  starter: `// your code here\n`,
  checks: [[/trait\s+Detector/, "trait Detector { ... }"], [/impl\s+Detector\s+for\s+Keyword/, "impl Detector for Keyword"], [/fn\s+count_hits\s*<\s*D\s*:\s*Detector\s*>/, "fn count_hits<D: Detector>(...)"], [/\.filter\s*\(|for\s+\w+\s+in/, "iterate lines"]] },

{ title: "Iterator Engine", concept: "closures, iterator adapters, collect",
  lesson: `<pre>let fails: Vec&lt;&amp;str&gt; = lines.iter()
    .filter(|l| l.ends_with("FAIL"))
    .map(|l| l.split_whitespace().next().unwrap_or(""))
    .collect();
let total: u32 = nums.iter().sum();
let max = nums.iter().max();          // Option
nums.iter().enumerate().take(3).rev();</pre><p>Iterators are lazy and compile to tight loops, so you get high-level code at low-level speed.</p>`,
  task: `Write <code>fn fail_ips(lines: &amp;[&amp;str]) -&gt; Vec&lt;String&gt;</code> using <code>.iter().filter(...).map(...).collect()</code> to return the first word of every line ending in <code>"FAIL"</code>.`,
  starter: `// your code here\n`,
  checks: [[/fn\s+fail_ips\s*\(\s*lines\s*:\s*&\[&str\]\s*\)\s*->\s*Vec<String>/, "fn fail_ips(lines: &[&str]) -> Vec<String>"], [/\.iter\(\)/, ".iter()"], [/\.filter\s*\(\s*\|/, ".filter(|l| ...)"], [/\.map\s*\(\s*\|/, ".map(|l| ...)"], [/\.collect\s*(::<[^>]+>)?\s*\(\)/, ".collect()"]] },

{ title: "Fearless Concurrency", concept: "threads, Arc, Mutex, channels",
  lesson: `<pre>use std::sync::{Arc, Mutex, mpsc};
use std::thread;

let counter = Arc::new(Mutex::new(0));
let mut handles = vec![];
for h in hosts {
    let c = Arc::clone(&amp;counter);
    handles.push(thread::spawn(move || { *c.lock().unwrap() += 1; }));
}
for h in handles { h.join().unwrap(); }

let (tx, rx) = mpsc::channel();</pre><p>The compiler won't let you share non-thread-safe data. For async I/O, the ecosystem uses <code>tokio</code>.</p>`,
  task: `Write <code>fn sweep(hosts: Vec&lt;String&gt;) -&gt; usize</code> that spawns a thread per host with <code>thread::spawn(move || ...)</code>, increments a shared <code>Arc&lt;Mutex&lt;usize&gt;&gt;</code>, joins every handle and returns the final count. A host counts as reachable when its name isn't empty, so <code>sweep(vec!["a", "", "c"])</code> returns 2.`,
  starter: `use std::sync::{Arc, Mutex};\nuse std::thread;\n\n// your code here\n`,
  checks: [[/Arc::new\(\s*Mutex::new\(/, "Arc::new(Mutex::new(0))"], [/Arc::clone\(/, "Arc::clone(&counter)"], [/thread::spawn\(\s*move\s*\|\|/, "thread::spawn(move || ...)"], [/\.lock\(\)/, ".lock().unwrap()"], [/\.join\(\)/, "h.join().unwrap()"]] },

{ title: "Lifetimes & Tests", concept: "lifetime annotations, #[cfg(test)], #[test], assert_eq!",
  lesson: `<pre>fn longest&lt;'a&gt;(a: &amp;'a str, b: &amp;'a str) -&gt; &amp;'a str {
    if a.len() &gt;= b.len() { a } else { b }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn picks_longer() { assert_eq!(longest("abc", "a"), "abc"); }
}</pre><p><code>'a</code> tells the compiler the returned reference lives as long as both inputs. Run tests with <code>cargo test</code>.</p>`,
  task: `Write <code>fn longest&lt;'a&gt;(a: &amp;'a str, b: &amp;'a str) -&gt; &amp;'a str</code> and a <code>#[cfg(test)] mod tests</code> with at least two <code>#[test]</code> functions using <code>assert_eq!</code>.`,
  starter: `// your code here\n`,
  checks: [[/fn\s+longest\s*<\s*'a\s*>\s*\(\s*a\s*:\s*&'a\s+str\s*,\s*b\s*:\s*&'a\s+str\s*\)\s*->\s*&'a\s+str/, "fn longest<'a>(a: &'a str, b: &'a str) -> &'a str"], [/#\[cfg\(test\)\]/, "#[cfg(test)]"], [/mod\s+tests/, "mod tests { ... }"], [/#\[test\][\s\S]*#\[test\]/, "two #[test] functions"], [/assert_eq!\s*\(/, "assert_eq!(...)"]] },

{ title: "Operation: Ironclad Parser", concept: "capstone: structs, enums, Result, traits, iterators, tests",
  lesson: `<p>Rewrite the vulnerable C parser from Heartbleed's era in safe Rust. Model the records, parse them into <code>Result</code>s, aggregate them with iterators, implement <code>Display</code>, and prove it works with tests.</p><pre>impl std::fmt::Display for Summary {
    fn fmt(&amp;self, f: &amp;mut std::fmt::Formatter) -&gt; std::fmt::Result {
        write!(f, "{} total / {} fails", self.total, self.fails)
    }
}</pre>`,
  task: `Define <code>enum Status { Ok, Fail }</code>, <code>struct Record { ip: String, status: Status }</code>, <code>fn parse(line: &amp;str) -&gt; Result&lt;Record, String&gt;</code>, <code>struct Summary { total: usize, fails: usize }</code> with <code>impl std::fmt::Display for Summary</code>, <code>fn analyze(lines: &amp;[&amp;str]) -&gt; Summary</code> using <code>filter_map</code>, and a test module. <code>parse</code> accepts exactly two words, an IP and <code>OK</code> or <code>FAIL</code>, and returns <code>Err</code> for anything else. In the <code>Summary</code>, <code>total</code> counts lines that parsed and <code>fails</code> counts the <code>FAIL</code> ones, so <code>["1.1.1.1 FAIL", "2.2.2.2 OK", "junk", "3.3.3.3 FAIL"]</code> gives total 3, fails 2.`,
  starter: `// your code here\n`,
  checks: [[/enum\s+Status/, "enum Status { Ok, Fail }"], [/struct\s+Record/, "struct Record { ip, status }"], [/fn\s+parse\s*\(\s*line\s*:\s*&str\s*\)\s*->\s*Result<\s*Record\s*,\s*String\s*>/, "fn parse(line: &str) -> Result<Record, String>"], [/impl\s+(std::)?fmt::Display\s+for\s+Summary|impl\s+Display\s+for\s+Summary/, "impl std::fmt::Display for Summary"], [/filter_map/, ".filter_map(|l| parse(l).ok())"], [/#\[test\]/, "#[test]"]] }
]);
