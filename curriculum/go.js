RA.lang("go", { name: "Go", tag: "GO", runtime: "pattern", why: "The language of cloud infrastructure: Docker, Kubernetes, Terraform." });
RA.add("go", "go", [
{ title: "Hello, Grid", concept: "package main, imports, :=, fmt",
  lesson: `<pre>package main

import "fmt"

func main() {
    handle := "neo"           // short declaration, type inferred
    var level int = 3         // explicit
    const maxLevel = 12
    fmt.Printf("Agent %s // level %d\\n", handle, level)
    s := fmt.Sprintf("%s:%d", handle, level)  // format into a string
}</pre><p>Unused variables and imports are compile errors. Go keeps code clean on purpose.</p>`,
  task: `Write <code>func intro(handle string, level int) string</code> that returns <code>fmt.Sprintf("Agent %s // level %d", handle, level)</code>, and a <code>main</code> that prints <code>intro("neo", 3)</code> with <code>fmt.Println</code>.`,
  starter: `package main\n\nimport "fmt"\n\n// your code here\n`,
  checks: [[/func\s+intro\s*\(\s*handle\s+string\s*,\s*level\s+int\s*\)\s+string/, "func intro(handle string, level int) string"], [/fmt\.Sprintf\(\s*"Agent %s \/\/ level %d"/, "fmt.Sprintf(\"Agent %s // level %d\", ...)"], [/func\s+main\s*\(\s*\)/, "func main()"], [/fmt\.Println\(\s*intro\(/, "fmt.Println(intro(...))"]] },

{ title: "Triage Protocol", concept: "if, for (the only loop), switch",
  lesson: `<pre>if err := check(); err != nil { ... }   // init statement
for i := 0; i &lt; 10; i++ { }               // classic
for cond { }                              // while
for { break }                             // infinite
switch {
case score &gt;= 90: return "CRITICAL"
case score &gt;= 60: return "HIGH"
default: return "LOW"
}</pre><p>Go's switch doesn't fall through by default.</p>`,
  task: `Write <code>func threatLevel(score int) string</code> using a tagless <code>switch</code> with thresholds 90, 60 and 30 for CRITICAL, HIGH, MEDIUM and otherwise LOW.`,
  starter: `package main\n\n// your code here\n`,
  checks: [[/func\s+threatLevel\s*\(\s*score\s+int\s*\)\s+string/, "func threatLevel(score int) string"], [/switch\s*\{/, "switch {"], [/case\s+score\s*>=\s*90/, "case score >= 90:"], [/default\s*:/, "default:"]] },

{ title: "Slices & Maps", concept: "slices, append, maps, range",
  lesson: `<pre>ips := []string{"10.0.0.4"}
ips = append(ips, "10.0.0.9")
sub := ips[1:]
counts := make(map[string]int)
counts["10.0.0.9"]++
if n, ok := counts["x"]; ok { ... }   // comma-ok idiom
for i, ip := range ips { ... }
for k, v := range counts { ... }      // map order is random</pre>`,
  task: `Write <code>func tally(ips []string) map[string]int</code> using <code>make</code> and <code>range</code>, and <code>func uniqueSorted(ips []string) []string</code> that uses <code>append</code> on the map keys and then <code>sort.Strings</code>.`,
  starter: `package main\n\nimport "sort"\n\n// your code here\n`,
  checks: [[/func\s+tally\s*\(\s*ips\s+\[\]string\s*\)\s+map\[string\]int/, "func tally(ips []string) map[string]int"], [/make\s*\(\s*map\[string\]int/, "make(map[string]int)"], [/range\s+ips/, "for _, ip := range ips"], [/append\s*\(/, "append(...)"], [/sort\.Strings/, "sort.Strings(...)"]] },

{ title: "Multi-Return", concept: "multiple returns, variadic, closures, defer",
  lesson: `<pre>func divmod(a, b int) (int, int) { return a / b, a % b }
q, r := divmod(7, 2)

func sum(nums ...int) int { ... }      // variadic
sum(xs...)                              // spread a slice

func counter() func() int {
    n := 0
    return func() int { n++; return n }
}
defer f.Close()   // runs when the function returns</pre>`,
  task: `Write <code>func makeCounter(start int) func() int</code> (a closure), and <code>func minMax(nums ...int) (min, max int)</code> with named results. <code>makeCounter(10)</code> returns a function whose calls count up by 1 from 10. <code>minMax(4, -2, 9, 3)</code> returns <code>-2, 9</code>.`,
  starter: `package main\n\n// your code here\n`,
  checks: [[/func\s+makeCounter\s*\(\s*start\s+int\s*\)\s+func\s*\(\s*\)\s+int/, "func makeCounter(start int) func() int"], [/return\s+func\s*\(\s*\)\s+int/, "return func() int { ... }"], [/func\s+minMax\s*\(\s*nums\s+\.\.\.int\s*\)\s*\(\s*min\s*,\s*max\s+int\s*\)/, "func minMax(nums ...int) (min, max int)"]] },

{ title: "Runes & Builders", concept: "strings package, runes, strings.Builder",
  lesson: `<pre>strings.Split("a,b", ",")   strings.Fields(line)
strings.ToUpper(s)  strings.Contains(s, "x")  strings.TrimSpace(s)
for _, r := range "héllo" { }   // r is a rune (Unicode code point)
var b strings.Builder
b.WriteString("x"); b.WriteRune('y'); out := b.String()</pre><p>A Go string is bytes. Ranging over it gives you runes, so you handle Unicode correctly.</p>`,
  task: `Write <code>func caesar(text string, shift int) string</code> that ranges over runes, shifts a-z and A-Z with wraparound (<code>% 26</code>), and builds the result with a <code>strings.Builder</code>.`,
  starter: `package main\n\nimport "strings"\n\n// your code here\n`,
  checks: [[/func\s+caesar\s*\(\s*text\s+string\s*,\s*shift\s+int\s*\)\s+string/, "func caesar(text string, shift int) string"], [/var\s+\w+\s+strings\.Builder|strings\.Builder\{\}/, "var b strings.Builder"], [/range\s+text/, "for _, r := range text"], [/%\s*26/, "% 26"], [/\.WriteRune\s*\(/, "b.WriteRune(...)"]] },

{ title: "Struct of Signals", concept: "structs, methods, pointer receivers, embedding",
  lesson: `<pre>type Node struct {
    Name     string
    Strength int
}
func (n *Node) Boost(by int) int { n.Strength += by; return n.Strength } // pointer: mutates
func (n Node) Label() string { return fmt.Sprintf("%s(%d)", n.Name, n.Strength) }

type Relay struct {
    Node          // embedding: Relay gets Node's fields and methods
    Hops int
}</pre><p>Capitalized names are exported (public). Lowercase names are package-private.</p>`,
  task: `Define <code>type Node struct</code> with <code>Name string</code> and <code>Strength int</code>, a pointer-receiver method <code>Boost(by int) int</code>, a value-receiver <code>Label() string</code>, and <code>type Relay struct</code> that embeds <code>Node</code> and adds <code>Hops int</code>.`,
  starter: `package main\n\nimport "fmt"\n\n// your code here\n`,
  checks: [[/type\s+Node\s+struct/, "type Node struct { ... }"], [/func\s+\(\s*\w+\s+\*Node\s*\)\s+Boost\s*\(\s*by\s+int\s*\)\s+int/, "func (n *Node) Boost(by int) int"], [/func\s+\(\s*\w+\s+Node\s*\)\s+Label\s*\(\s*\)\s+string/, "func (n Node) Label() string"], [/type\s+Relay\s+struct\s*\{\s*Node/, "type Relay struct { Node; Hops int }"]] },

{ title: "Errors Are Values", concept: "error, errors.New, fmt.Errorf %w, errors.Is/As",
  lesson: `<pre>var ErrDenied = errors.New("access denied")   // sentinel error

func unlock(code string) error {
    if code != "0451" { return fmt.Errorf("unlock %q: %w", code, ErrDenied) }
    return nil
}
if err := unlock(x); errors.Is(err, ErrDenied) { ... }</pre><p>Go has no exceptions for normal failures. You return an <code>error</code> and the caller checks <code>if err != nil</code>. <code>%w</code> wraps an error and keeps the chain intact.</p>`,
  task: `Declare <code>var ErrDenied = errors.New("access denied")</code>. Write <code>func unlock(code string) (string, error)</code> returning <code>"OPEN", nil</code> or <code>"", fmt.Errorf("...: %w", ErrDenied)</code>. Write <code>func safeUnlock(code string) string</code> that uses <code>errors.Is</code> to return <code>"DENIED"</code>.`,
  starter: `package main\n\nimport (\n    "errors"\n    "fmt"\n)\n\n// your code here\n`,
  checks: [[/var\s+ErrDenied\s*=\s*errors\.New/, "var ErrDenied = errors.New(...)"], [/func\s+unlock\s*\(\s*code\s+string\s*\)\s*\(\s*string\s*,\s*error\s*\)/, "func unlock(code string) (string, error)"], [/fmt\.Errorf\([^)]*%w/, "fmt.Errorf(\"...: %w\", ErrDenied)"], [/errors\.Is\s*\(/, "errors.Is(err, ErrDenied)"], [/if\s+err\s*!=\s*nil|errors\.Is/, "check the error"]] },

{ title: "Contracts", concept: "interfaces, implicit satisfaction, type switches",
  lesson: `<pre>type Scanner interface {
    Scan(host string) (bool, error)
}
type PingScanner struct{}
func (PingScanner) Scan(h string) (bool, error) { ... }  // satisfies Scanner implicitly

var s Scanner = PingScanner{}
switch v := x.(type) {
case string: ...
case int: ...
}</pre><p>Keep interfaces small. The well-known ones are <code>io.Reader</code>, <code>io.Writer</code>, <code>error</code> and <code>fmt.Stringer</code>.</p>`,
  task: `Define <code>type Detector interface { Detect(line string) bool }</code>. Implement it with <code>type Keyword struct { Word string }</code> (using <code>strings.Contains</code>). Write <code>func countHits(d Detector, lines []string) int</code>.`,
  starter: `package main\n\nimport "strings"\n\n// your code here\n`,
  checks: [[/type\s+Detector\s+interface\s*\{\s*Detect\s*\(\s*line\s+string\s*\)\s+bool/, "type Detector interface { Detect(line string) bool }"], [/type\s+Keyword\s+struct/, "type Keyword struct { Word string }"], [/func\s+\(\s*\w+\s+\*?Keyword\s*\)\s+Detect/, "func (k Keyword) Detect(line string) bool"], [/func\s+countHits\s*\(\s*d\s+Detector/, "func countHits(d Detector, lines []string) int"]] },

{ title: "Generic Ops", concept: "generics, type parameters, constraints",
  lesson: `<pre>func Map[T, U any](xs []T, f func(T) U) []U {
    out := make([]U, 0, len(xs))
    for _, x := range xs { out = append(out, f(x)) }
    return out
}
type Number interface { ~int | ~int64 | ~float64 }
func Sum[N Number](xs []N) N { ... }</pre><p>Generics arrived in Go 1.18. Packages <code>slices</code> and <code>maps</code> build on them: <code>slices.Sort</code>, <code>slices.Contains</code>.</p>`,
  task: `Write <code>func Filter[T any](xs []T, keep func(T) bool) []T</code> and <code>func Sum[N Number](xs []N) N</code> with <code>type Number interface { ~int | ~float64 }</code>.`,
  starter: `package main\n\n// your code here\n`,
  checks: [[/func\s+Filter\s*\[\s*T\s+any\s*\]/, "func Filter[T any](...)"], [/keep\s+func\s*\(\s*T\s*\)\s+bool/, "keep func(T) bool"], [/type\s+Number\s+interface\s*\{\s*~int\s*\|\s*~float64/, "type Number interface { ~int | ~float64 }"], [/func\s+Sum\s*\[\s*N\s+Number\s*\]/, "func Sum[N Number](xs []N) N"]] },

{ title: "Goroutine Swarm", concept: "goroutines, sync.WaitGroup, sync.Mutex",
  lesson: `<pre>var wg sync.WaitGroup
var mu sync.Mutex
up := 0
for _, h := range hosts {
    wg.Add(1)
    go func(h string) {
        defer wg.Done()
        if ping(h) { mu.Lock(); up++; mu.Unlock() }
    }(h)
}
wg.Wait()</pre><p>Shared memory needs a lock. Run <code>go test -race</code> to catch data races.</p>`,
  task: `Write <code>func sweep(hosts []string) int</code> that pings every host in its own goroutine, counts the ones where <code>ping(h)</code> returns true using a <code>sync.Mutex</code>, and waits with a <code>sync.WaitGroup</code>. A host counts as reachable when its name isn't empty, so <code>sweep([]string{"a", "", "c"})</code> returns 2.`,
  starter: `package main\n\nimport "sync"\n\nfunc ping(h string) bool { return len(h) > 0 }\n\n// your code here\n`,
  checks: [[/sync\.WaitGroup/, "var wg sync.WaitGroup"], [/sync\.Mutex/, "var mu sync.Mutex"], [/go\s+func/, "go func(h string) { ... }(h)"], [/defer\s+wg\.Done\(\)/, "defer wg.Done()"], [/mu\.Lock\(\)/, "mu.Lock()"], [/mu\.Unlock\(\)/, "mu.Unlock()"], [/wg\.Wait\(\)/, "wg.Wait()"]] },

{ title: "Channels of Truth", concept: "channels, select, context timeouts, worker pools",
  lesson: `<pre>jobs := make(chan string)
results := make(chan string, 10)   // buffered
go func() { for j := range jobs { results &lt;- work(j) } }()

ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()
select {
case r := &lt;-results: fmt.Println(r)
case &lt;-ctx.Done():   fmt.Println("timeout")
}
close(jobs)   // only the sender closes</pre><p>Don't communicate by sharing memory. Share memory by communicating.</p>`,
  task: `Write <code>func firstReply(ctx context.Context, hosts []string) (string, error)</code>. Launch a goroutine per host that sends to a buffered <code>chan string</code>, then <code>select</code> on the first result or <code>ctx.Done()</code>, returning <code>ctx.Err()</code> on timeout.`,
  starter: `package main\n\nimport "context"\n\nfunc ping(h string) string { return h }\n\n// your code here\n`,
  checks: [[/func\s+firstReply\s*\(\s*ctx\s+context\.Context/, "func firstReply(ctx context.Context, hosts []string) (string, error)"], [/make\s*\(\s*chan\s+string\s*,\s*len\(hosts\)\s*\)|make\s*\(\s*chan\s+string\s*,\s*\d+\s*\)/, "buffered: make(chan string, len(hosts))"], [/select\s*\{/, "select { ... }"], [/<-\s*ctx\.Done\(\)/, "case <-ctx.Done():"], [/ctx\.Err\(\)/, "return \"\", ctx.Err()"]] },

{ title: "Operation: Watchtower", concept: "capstone: HTTP service, JSON, table-driven tests",
  lesson: `<pre>http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
})
log.Fatal(http.ListenAndServe(":8080", nil))

// watch_test.go
func TestThreatLevel(t *testing.T) {
    cases := []struct{ in int; want string }{ {95, "CRITICAL"}, {10, "LOW"} }
    for _, c := range cases {
        if got := threatLevel(c.in); got != c.want { t.Errorf("%d: got %s want %s", c.in, got, c.want) }
    }
}</pre>`,
  task: `Build a small service: a <code>type Status struct</code> with JSON tags (<code>\`json:"node"\`</code>, <code>\`json:"up"\`</code>), an <code>http.HandleFunc("/status", ...)</code> handler that encodes a <code>[]Status</code> with <code>json.NewEncoder(w).Encode</code>, <code>http.ListenAndServe(":8080", nil)</code>, and a table-driven <code>func TestThreatLevel(t *testing.T)</code> that calls <code>t.Errorf</code>.`,
  starter: `package main\n\nimport (\n    "encoding/json"\n    "net/http"\n    "testing"\n)\n\n// your code here\n`,
  checks: [[/type\s+Status\s+struct/, "type Status struct { ... }"], [/`json:"node"`/, "JSON tag `json:\"node\"`"], [/http\.HandleFunc\(\s*"\/status"/, "http.HandleFunc(\"/status\", ...)"], [/json\.NewEncoder\(\s*w\s*\)\.Encode/, "json.NewEncoder(w).Encode(...)"], [/http\.ListenAndServe\(\s*":8080"/, "http.ListenAndServe(\":8080\", nil)"], [/func\s+TestThreatLevel\s*\(\s*t\s+\*testing\.T\s*\)/, "func TestThreatLevel(t *testing.T)"], [/t\.Errorf/, "t.Errorf(...)"]] }
]);
