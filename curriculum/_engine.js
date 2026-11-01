// ROOT//ACCESS checkpoint engine. Shared by the web app (Judge0) and CI (tools/checkpoints.js).
// A mission's external checkpoints are a harness program in the mission's own language.
// The engine composes harness + learner code into one program, runs it on a real compiler,
// and reads lines in this protocol from stdout:
//   ::cp::PASS::<label>
//   ::cp::FAIL::<label>::<detail>
//   ::cp::SKIP::<label>::<reason>
(function (g) {
  const RA = g.RA = g.RA || {};
  RA.HARNESS = RA.HARNESS || {};      // id -> harness source (filled by curriculum/checkpoints bundle)

  // Judge0 targets. ce = https://ce.judge0.com, extra = https://extra-ce.judge0.com
  RA.ENGINES = {
    basics:     { host: "ce", id: 109, label: "Python 3.13 (Judge0)" },
    python:     { host: "ce", id: 109, label: "Python 3.13 (Judge0)" },
    javascript: { host: "ce", id: 102, label: "Node.js 22 (Judge0)" },
    typescript: { host: "ce", id: 101, label: "tsc + Node (Judge0)", opts: "--target esnext --lib esnext,dom" },
    sql:        { host: "ce", id: 109, label: "SQLite via Python 3.13 (Judge0)" },
    bash:       { host: "ce", id: 46,  label: "Bash 5.0 (Judge0)" },
    go:         { host: "ce", id: 107, label: "Go 1.23 (Judge0)" },
    rust:       { host: "ce", id: 108, label: "Rust 1.85 (Judge0)", opts: "--edition 2021" },
    swift:      { host: "ce", id: 83,  label: "Swift 5.2 (Judge0)" },
    kotlin:     { host: "ce", id: 111, label: "Kotlin 2.1 (Judge0)" },
    java:       { host: "ce", id: 91,  label: "Java 17 (Judge0)" },
    csharp:     { host: "extra", id: 30, label: ".NET 8 / C# 12 (Judge0 Extra)" },
    cpp:        { host: "ce", id: 105, label: "GCC 14 C++23 (Judge0)", opts: "-std=c++23 -pthread -O1" }
  };
  RA.CI_TOOLCHAINS = {
    basics: "Python 3.13", python: "Python 3.13", javascript: "Node.js 22", typescript: "TypeScript 5.6 --strict", sql: "SQLite 3 (Python)",
    bash: "Bash 5 + jq on Ubuntu 24.04", go: "Go (stable)", rust: "Rust (stable)", swift: "Swift 6 on macOS (Xcode)",
    kotlin: "Kotlin 2.x + kotlinx.coroutines", java: "JDK 25 + JUnit 5", csharp: ".NET 10 (dotnet run app.cs)", cpp: "g++ 14 -std=c++23"
  };

  // Harness metadata lives in comment lines:  @cp <label> | <label> ...   and  @ci-only <reason>
  RA.harnessMeta = (src) => {
    const cp = [], meta = { checkpoints: cp, ciOnly: null };
    (src || "").split("\n").forEach((l) => {
      let m = l.match(/@cp\s+(.+)$/); if (m) m[1].split("|").forEach((s) => s.trim() && cp.push(s.trim()));
      m = l.match(/@ci-only\s+(.+)$/); if (m) meta.ciOnly = m[1].trim();
      m = l.match(/@opts\s+(.+)$/); if (m) meta.opts = m[1].trim();
      m = l.match(/@args\s+(.+)$/); if (m) meta.args = m[1].trim();
    });
    return meta;
  };

  RA.parseCheckpoints = (stdout) => {
    const out = [];
    (stdout || "").split("\n").forEach((l) => {
      const m = l.match(/::cp::(PASS|FAIL|SKIP)::(.*?)(?:::(.*))?$/);
      if (m) out.push({ status: m[1], label: m[2], detail: m[3] || "" });
    });
    return out;
  };

  const USER = /^.*@@USER@@.*$/m;
  const put = (h, code) => h.replace(USER, () => code);
  const hoist = (code, re) => { const lines = []; code = code.replace(re, (m) => { lines.push(m.trim()); return ""; }); return [lines, code]; };
  const uniq = (a) => [...new Set(a)];

  const SHIMS = {
    gtest: `// gtest shim (Judge0 has no GoogleTest for C++23)
#include <iostream>
#include <functional>
#include <vector>
#include <string>
namespace ra_gtest { struct Case { std::string name; std::function<void()> fn; };
  inline std::vector<Case>& cases() { static std::vector<Case> c; return c; }
  inline int& failures() { static int f = 0; return f; }
  struct Reg { Reg(std::string n, std::function<void()> f) { cases().push_back({n, f}); } }; }
#define TEST(S, N) static void S##_##N(); static ra_gtest::Reg S##_##N##_reg(#S "." #N, S##_##N); static void S##_##N()
#define EXPECT_EQ(a, b) do { if (!((a) == (b))) { ++ra_gtest::failures(); std::cout << "gtest EXPECT_EQ failed: " #a " == " #b "\\n"; } } while (0)
#define EXPECT_TRUE(a) do { if (!(a)) { ++ra_gtest::failures(); std::cout << "gtest EXPECT_TRUE failed: " #a "\\n"; } } while (0)
#define EXPECT_THROW(stmt, ex) do { bool ra_t = false; try { stmt; } catch (const ex&) { ra_t = true; } catch (...) {} if (!ra_t) { ++ra_gtest::failures(); std::cout << "gtest EXPECT_THROW failed: " #stmt "\\n"; } } while (0)
`,
    kotlinTest: `// kotlin.test shim
annotation class Test
class RaAssertionError(msg: String) : AssertionError(msg)
fun <T> assertEquals(expected: T, actual: T, message: String? = null) { if (expected != actual) throw RaAssertionError(message ?: "expected <$expected> but was <$actual>") }
fun assertTrue(actual: Boolean, message: String? = null) { if (!actual) throw RaAssertionError(message ?: "expected true") }
fun assertFalse(actual: Boolean, message: String? = null) { if (actual) throw RaAssertionError(message ?: "expected false") }
inline fun <reified T : Throwable> assertFailsWith(block: () -> Unit): T { try { block() } catch (e: Throwable) { if (e is T) return e; throw RaAssertionError("expected \${T::class.java.simpleName} but got \${e::class.java.simpleName}") }; throw RaAssertionError("expected \${T::class.java.simpleName} to be thrown") }
`,
    csUnity: `
namespace UnityEngine
{
    public class SerializeField : System.Attribute { }
    public struct Vector3
    {
        public float x, y, z;
        public Vector3(float x, float y, float z) { this.x = x; this.y = y; this.z = z; }
        public static Vector3 zero => new Vector3(0, 0, 0);
        public static float Distance(Vector3 a, Vector3 b) => (float)System.Math.Sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y) + (a.z - b.z) * (a.z - b.z));
        public static Vector3 operator +(Vector3 a, Vector3 b) => new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
        public static Vector3 operator -(Vector3 a, Vector3 b) => new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
        public static Vector3 operator *(Vector3 a, float k) => new Vector3(a.x * k, a.y * k, a.z * k);
        public override string ToString() => $"({x}, {y}, {z})";
    }
    public class Transform
    {
        public Vector3 position;
        public Vector3 eulerAngles;
        public void Rotate(float x, float y, float z) => eulerAngles = eulerAngles + new Vector3(x, y, z);
        public void Translate(Vector3 d) => position = position + d;
    }
    public class MonoBehaviour { public Transform transform = new Transform(); public bool enabled = true; }
    public static class Time { public static float deltaTime = 0.016f; public static float time; }
    public static class Debug { public static void Log(object m) => System.Console.WriteLine(m); public static void LogWarning(object m) => System.Console.WriteLine(m); }
}
namespace Xunit
{
    [System.AttributeUsage(System.AttributeTargets.Method)] public class FactAttribute : System.Attribute { }
    public class EqualException : System.Exception { public EqualException(string m) : base(m) { } }
    public static class Assert
    {
        public static void Equal<T>(T expected, T actual) { if (!System.Collections.Generic.EqualityComparer<T>.Default.Equals(expected, actual)) throw new EqualException($"Assert.Equal failed: expected {expected}, actual {actual}"); }
        public static void True(bool c) { if (!c) throw new EqualException("Assert.True failed"); }
        public static void False(bool c) { if (c) throw new EqualException("Assert.False failed"); }
    }
}
`,
    csGlobal: "global using System;\nglobal using System.Collections.Generic;\nglobal using System.IO;\nglobal using System.Linq;\nglobal using System.Text;\nglobal using System.Threading;\nglobal using System.Threading.Tasks;\n"
  };
  RA.SHIMS = SHIMS;

  // Per-language helper preludes injected by compose (so harness files stay short).
  RA.PRELUDE = {
    go: `
func raCp(ok bool, label string, detail string) {
	if ok { fmt.Println("::cp::PASS::" + label) } else { fmt.Println("::cp::FAIL::" + label + "::" + detail) }
}
func raEq(label string, got, want interface{}) {
	g, w := fmt.Sprintf("%v", got), fmt.Sprintf("%v", want)
	raCp(g == w, label, "got "+g+", want "+w)
}
func raTry(label string, f func()) {
	defer func() { if r := recover(); r != nil { fmt.Println("::cp::FAIL::" + label + "::panic: " + fmt.Sprint(r)) } }()
	f()
}
`,
    rust: `
fn ra_cp(ok: bool, label: &str, detail: &str) {
    if ok { println!("::cp::PASS::{}", label) } else { println!("::cp::FAIL::{}::{}", label, detail.replace('\\n', " ")) }
}
fn ra_eq<T: std::fmt::Debug + PartialEq>(label: &str, got: T, want: T) {
    let d = format!("got {:?}, want {:?}", got, want);
    ra_cp(got == want, label, &d);
}
fn ra_try<F: FnOnce()>(label: &str, f: F) {
    if let Err(e) = std::panic::catch_unwind(std::panic::AssertUnwindSafe(f)) {
        let msg = e.downcast_ref::<&str>().map(|s| s.to_string()).or_else(|| e.downcast_ref::<String>().cloned()).unwrap_or_default();
        println!("::cp::FAIL::{}::panic: {}", label, msg);
    }
}
`,
    swift: `
func raCp(_ ok: Bool, _ label: String, _ detail: String = "") { print(ok ? "::cp::PASS::\\(label)" : "::cp::FAIL::\\(label)::\\(detail)") }
func raEq<T: Equatable>(_ label: String, _ got: T, _ want: T) { raCp(got == want, label, "got \\(got), want \\(want)") }
`,
    kotlin: `
fun raCp(ok: Boolean, label: String, detail: String = "") = println(if (ok) "::cp::PASS::$label" else "::cp::FAIL::$label::\${detail.replace("\\n", " ")}")
fun <T> raEq(label: String, got: T, want: T) = raCp(got == want, label, "got $got, want $want")
inline fun raTry(label: String, f: () -> Unit) { try { f() } catch (e: Throwable) { println("::cp::FAIL::$label::\${e::class.java.simpleName}: \${e.message}") } }
`,
    java: `
final class Ra {
    static void cp(boolean ok, String label, String detail) { System.out.println(ok ? "::cp::PASS::" + label : "::cp::FAIL::" + label + "::" + String.valueOf(detail).replace("\\n", " ")); }
    static void eq(String label, Object got, Object want) { cp(java.util.Objects.equals(got, want), label, "got " + got + ", want " + want); }
    interface Body { void run() throws Throwable; }
    static void tryCp(String label, Body b) { try { b.run(); } catch (Throwable e) { System.out.println("::cp::FAIL::" + label + "::" + e.getClass().getSimpleName() + ": " + e.getMessage()); } }
}
`,
    csharp: `
static class Ra
{
    public static void Cp(bool ok, string label, string detail = "") => Console.WriteLine(ok ? $"::cp::PASS::{label}" : $"::cp::FAIL::{label}::{detail.Replace("\\n", " ")}");
    public static void Eq<T>(string label, T got, T want) => Cp(EqualityComparer<T>.Default.Equals(got, want), label, $"got {got}, want {want}");
    public static void Try(string label, Action a) { try { a(); } catch (Exception e) { var x = e is System.Reflection.TargetInvocationException t && t.InnerException != null ? t.InnerException : e; Console.WriteLine($"::cp::FAIL::{label}::{x.GetType().Name}: {x.Message}"); } }
    // Finds a static method by name anywhere in your program: class members or top-level local functions.
    public static System.Reflection.MethodInfo Find(string name) {
        foreach (var t in typeof(Ra).Assembly.GetTypes())
            foreach (var m in t.GetMethods(System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.NonPublic))
                if (m.Name == name || m.Name.Contains("g__" + name + "|")) return m;
        throw new MissingMethodException($"no static method named {name}");
    }
    public static object? Call(string name, params object?[] args) => CallG(name, Type.EmptyTypes, args);
    public static object? CallG(string name, Type[] targs, params object?[] args) {
        var m = Find(name);
        if (m.IsGenericMethodDefinition) m = m.MakeGenericMethod(targs);
        try { return m.Invoke(null, args); }
        catch (System.Reflection.TargetInvocationException e) when (e.InnerException != null) { System.Runtime.ExceptionServices.ExceptionDispatchInfo.Capture(e.InnerException).Throw(); throw; }
    }
}
`,
    cpp: `
#include <iostream>
#include <sstream>
#include <string>
#include <functional>
#include <exception>
inline void ra_cp(bool ok, const std::string& label, const std::string& detail = "") { std::cout << (ok ? "::cp::PASS::" + label : "::cp::FAIL::" + label + "::" + detail) << std::endl; }
template <class A, class B> void ra_eq(const std::string& label, const A& got, const B& want) { std::ostringstream d; d << "got " << got << ", want " << want; ra_cp(got == want, label, d.str()); }
inline void ra_try(const std::string& label, const std::function<void()>& f) { try { f(); } catch (const std::exception& e) { ra_cp(false, label, std::string("exception: ") + e.what()); } catch (...) { ra_cp(false, label, "unknown exception"); } }
`,
    bash: `
ra_cp() { if [ "$1" = 0 ]; then echo "::cp::PASS::$2"; else echo "::cp::FAIL::$2::$3"; fi; }
ra_eq() { if [ "$2" = "$3" ]; then echo "::cp::PASS::$1"; else echo "::cp::FAIL::$1::got [$(printf %s "$2" | tr '\\n' ' ' | head -c 200)], want [$(printf %s "$3" | tr '\\n' ' ' | head -c 200)]"; fi; }
`
  };
  RA.withPrelude = (L, h) => h.replace(/^.*@@PRELUDE@@.*$/m, () => RA.PRELUDE[L] || "");

  // Compose learner code + harness for one mission. env: "judge0" | "ci" | "local" (in-app runners, see _local.js)
  RA.compose = (m, user, env) => {
    env = env || "judge0";
    const L = m.lang;
    if (L === "python" || L === "basics") return RA.genPython(m, user, env);
    if (L === "javascript") return RA.genJs(m, user, false);
    if (L === "typescript") return RA.genJs(m, user, true);
    if (L === "sql") return RA.genSql(m, user);
    let h = RA.HARNESS[m.id];
    if (!h) return null;
    h = RA.withPrelude(L, h);
    if (L === "bash") return put(h, user.replace(/\r/g, ""));
    if (L === "swift") return "import Foundation\n" + put(h, user);
    if (L === "go") {
      let code = user.replace(/^\s*package\s+\w+\s*$/m, "").replace(/\bfunc\s+main\s*\(\s*\)/, "func raUserMain()");
      const imps = [];
      code = code.replace(/^\s*import\s*\(([\s\S]*?)\)/gm, (_, b) => { b.split("\n").map((s) => s.trim()).filter(Boolean).forEach((s) => imps.push(s)); return ""; });
      code = code.replace(/^\s*import\s+("[^"]+")\s*$/gm, (_, s) => { imps.push(s); return ""; });
      let hb = h.replace(/^\s*package\s+\w+\s*$/m, "");
      hb = hb.replace(/^\s*import\s*\(([\s\S]*?)\)/gm, (_, b) => { b.split("\n").map((s) => s.trim()).filter(Boolean).forEach((s) => imps.push(s)); return ""; });
      hb = hb.replace(/^\s*import\s+("[^"]+")\s*$/gm, (_, s) => { imps.push(s); return ""; });
      imps.push('"fmt"');
      return "package main\n\nimport (\n\t" + uniq(imps).join("\n\t") + "\n)\n" + put(hb, code);
    }
    if (L === "rust") {
      const code = user.replace(/\bfn\s+main\s*\(\s*\)/, "fn ra_user_main()");
      return "#![allow(dead_code, unused_imports, unused_variables, unused_mut)]\n" + put(h, code);
    }
    if (L === "kotlin") {
      let code = user.replace(/\bfun\s+main\s*\(\s*\)/, "fun raUserMain()");
      let shim = "";
      if (/import\s+kotlin\.test/.test(code)) { code = code.replace(/^\s*import\s+kotlin\.test\.\*?.*$/gm, ""); shim = SHIMS.kotlinTest; }
      const tc = (code.match(/class\s+(\w+Test)\b/) || [])[1] || "RaNoTest";
      let [ui, uc] = hoist(code, /^\s*import\s+[\w.*]+\s*$/gm);
      let [hi, hc] = hoist(h, /^\s*import\s+[\w.*]+\s*$/gm);
      const vm = (code.match(/class\s+(\w+)[^{\n]*:\s*ViewModel\s*\(/) || [])[1] || "RaNoViewModel";
      const screen = (code.match(/@Composable\s+fun\s+(\w+)/) || [])[1] || "RaNoScreen";
      const sealed = [...code.matchAll(/^\s*sealed\s+(?:class|interface)\s+(\w+)/gm)].map(x => JSON.stringify(x[1]));
      return uniq(hi.concat(ui)).join("\n") + "\n" + shim + put(hc, uc).replace(/__TEST_CLASS__/g, tc)
        .replace(/__VM_CLASS__/g, vm).replace(/__SCREEN__/g, screen).replace(/__SEALED__/g, "listOf<String>(" + sealed.join(", ") + ")");
    }
    if (L === "java") {
      let code = user.replace(/^public\s+(?=((final|abstract|sealed|non-sealed)\s+)*(class|record|interface|enum)\b)/gm, "");
      const tc = (code.match(/class\s+(\w+Test)\b/) || [])[1] || "RaNoTest";
      let [ui, uc] = hoist(code, /^\s*import\s+(static\s+)?[\w.*]+\s*;\s*$/gm);
      let [hi, hc] = hoist(h, /^\s*import\s+(static\s+)?[\w.*]+\s*;\s*$/gm);
      const classOf = (name) => {
        const at = uc.search(new RegExp("[\\w>\\]]\\s+" + name + "\\s*\\("));
        if (at < 0) return "Main";
        const decls = [...uc.slice(0, at).matchAll(/\b(?:class|record|interface|enum)\s+(\w+)/g)];
        return decls.length ? decls[decls.length - 1][1] : "Main";
      };
      return uniq(hi.concat(ui)).join("\n") + "\n" + put(hc, uc).replace(/__TEST_CLASS__/g, tc).replace(/__CLASS_OF:(\w+)__/g, (_, n) => classOf(n));
    }
    if (L === "csharp") {
      let [ui, uc] = hoist(user, /^\s*using\s+(static\s+)?[\w.]+\s*;\s*$/gm);
      let [hi, hc] = hoist(h, /^\s*using\s+(static\s+)?[\w.]+\s*;\s*$/gm);
      const unity = /using\s+(UnityEngine|Xunit)\s*;/.test(user) ? SHIMS.csUnity : "";
      return (env === "judge0" ? SHIMS.csGlobal : "") + uniq(hi.concat(ui)).join("\n") + "\n" + put(hc, uc) + unity;
    }
    if (L === "cpp") {
      let code = user.replace(/\bint\s+main\s*\(\s*\)/, "int ra_user_main()");
      if (/#include\s*<gtest\/gtest\.h>/.test(code)) code = code.replace(/#include\s*<gtest\/gtest\.h>/, SHIMS.gtest);
      const classes = [...code.matchAll(/^\s*(?:class|struct)\s+(\w+)\s*(?:final\s*)?[:{]/gm)].map((x) => x[1]);
      const raii = classes.length ? "(" + classes.map((c) => "ra_raii<" + c + ">()").join(" || ") + ")" : "false";
      return put(h, code).replace(/__RAII_CHECK__/g, raii);
    }
    return null;
  };

  // ---- generated harnesses for languages whose tests already live in the curriculum ----
  const pyIndent = (s) => s.split("\n").map((l) => "    " + l).join("\n");
  // env "local" runs under Pyodide's runPythonAsync, where asyncio.run() can't nest inside the browser's event loop,
  // so the test coroutine is awaited at top level instead. Everything else is identical.
  RA.genPython = (m, user, env) => {
    if (!m.test || !m.test.py) return null;
    return `import asyncio, sys
def __ra_cp(ok, label, detail=""):
    d = str(detail).replace("\\n", " ")[:300]
    print(f"::cp::{'PASS' if ok else 'FAIL'}::{label}::{d}", flush=True)
def check(got, want, label="check"):
    __ra_cp(got == want, label, "" if got == want else f"got {got!r}, want {want!r}")
__ra_src = ${JSON.stringify(user)}
def output_of(**subs):
    """Run the learner's program again in a clean namespace and return what it printed.
    Keyword arguments replace a top-level assignment first, e.g. output_of(clearance=1)."""
    import io, re, contextlib
    s = __ra_src
    for k, v in subs.items():
        s = re.sub(r"^(" + k + r"\\s*=).*$", lambda mm: mm.group(1) + " " + repr(v), s, count=1, flags=re.M)
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(compile(s, "mission.py", "exec"), {"__name__": "__main__"})
    return buf.getvalue()
__ra_user_ok = True
try:
    exec(compile(__ra_src, "mission.py", "exec"), globals())
except BaseException as __e:
    __ra_user_ok = False
    __ra_cp(False, "Your code runs", f"{type(__e).__name__}: {__e}")
async def __ra_tests():
${pyIndent(m.test.py)}
    pass
if __ra_user_ok:
    __ra_cp(True, "Your code runs")
    try:
        ${env === "local" ? "await __ra_tests()" : "asyncio.run(__ra_tests())"}
    except BaseException as __e:
        __ra_cp(False, "Checkpoints finished", f"{type(__e).__name__}: {__e}")
`;
  };
  RA.genJs = (m, user, ts) => {
    const t = m.test && (m.test.js || m.test.ts);
    if (!t) return null;
    const any = ts ? ": any" : "";
    return `${user}
;function __ra_norm(v${any})${ts ? ": string" : ""} { return JSON.stringify(v, function (k${any}, x${any}) { return x && typeof x === "object" && !Array.isArray(x) && !(x instanceof Map) ? Object.keys(x).sort().reduce(function (o${any}, key) { o[key] = x[key]; return o; }, {}) : (x === undefined ? "__undefined__" : x); }) + ""; }
(async function ()${ts ? ": Promise<void>" : ""} {
  console.log("::cp::PASS::Your code runs");
  try {
    const __r${any} = await (async function ()${ts ? ": Promise<any>" : ""} {
${t}
    })();
    for (const c of __r) { const g = __ra_norm(c[0]), w = __ra_norm(c[1]); console.log(g === w ? "::cp::PASS::" + c[2] : "::cp::FAIL::" + c[2] + "::got " + g + ", want " + w); }
  } catch (e) { const ee${any} = e; console.log("::cp::FAIL::Checkpoints finished::" + String(ee && ee.message || ee).replace(/\\n/g, " ")); }
})();
${ts ? "export {};\n" : ""}`;
  };
  RA.genSql = (m, user) => {
    if (!m.test || !m.test.sql) return null;
    const s = m.test.sql;
    return `import sqlite3
SETUP = ${JSON.stringify(RA.SQL_SETUP)}
USER = ${JSON.stringify(user)}
REF = ${JSON.stringify(s.solution)}
VERIFY = ${JSON.stringify(s.verify || "")}
def cp(ok, label, detail=""):
    print(f"::cp::{'PASS' if ok else 'FAIL'}::{label}::{str(detail).replace(chr(10), ' ')[:300]}", flush=True)
def split(sql):
    out, buf = [], ""
    for ch in sql:
        buf += ch
        if ch == ";" and sqlite3.complete_statement(buf):
            if buf.strip(): out.append(buf.strip())
            buf = ""
    if buf.strip(): out.append(buf.strip())
    return out
def run(sql):
    db = sqlite3.connect(":memory:"); db.executescript(SETUP)
    last = None
    for st in split(sql):
        cur = db.execute(st)
        if cur.description: last = ([d[0] for d in cur.description], cur.fetchall())
    if VERIFY:
        cur = db.execute(VERIFY); last = ([d[0] for d in cur.description], cur.fetchall())
    return last
ref = run(REF)
ran = True
try:
    got = run(USER); cp(True, "Query runs on SQLite")
except Exception as e:
    cp(False, "Query runs on SQLite", e); got = None; ran = False
if ran:
    if ref is None:
        cp(True, "Statement executed")
    elif got is None:
        cp(False, "Returns a result set", "your SQL returned no rows/columns")
    else:
        ordered = "order by" in REF.lower()
        cp(len(got[0]) == len(ref[0]), "Column count", f"got {len(got[0])} columns, want {len(ref[0])}")
        cp(len(got[1]) == len(ref[1]), "Row count", f"got {len(got[1])} rows, want {len(ref[1])}")
        a = got[1] if ordered else sorted(got[1], key=repr)
        b = ref[1] if ordered else sorted(ref[1], key=repr)
        cp(a == b, "Rows match the reference" + (" (in order)" if ordered else ""), f"got {got[1][:4]}..., want {ref[1][:4]}...")
`;
  };

  // ---- Judge0 client (browser + Node 18+) ----
  const b64e = (s) => (typeof btoa === "function" ? btoa(unescape(encodeURIComponent(s))) : Buffer.from(s, "utf8").toString("base64"));
  const b64d = (s) => (!s ? "" : typeof atob === "function" ? decodeURIComponent(escape(atob(s))) : Buffer.from(s, "base64").toString("utf8"));
  RA.judge0Hosts = { ce: "https://ce.judge0.com", extra: "https://extra-ce.judge0.com" };
  // Split into request/finish so other hosts (the Swift app via JavaScriptCore + URLSession) reuse the exact same logic.
  RA.judge0Request = (m, user, cfg) => {
    cfg = cfg || {};
    const eng = RA.ENGINES[m.lang];
    const harness = m.lang in { basics: 1, python: 1, javascript: 1, typescript: 1, sql: 1 } ? "gen" : RA.HARNESS[m.id];
    const meta = RA.harnessMeta(harness === "gen" ? "" : harness);
    if (meta.ciOnly) return { engine: eng.label, ciOnly: meta.ciOnly };
    const src = RA.compose(m, user, "judge0");
    if (!src) return { engine: eng.label, error: "No harness for this mission" };
    const base = (cfg.hosts && cfg.hosts[eng.host]) || RA.judge0Hosts[eng.host];
    const headers = { "Content-Type": "application/json" };
    if (cfg.token) headers["X-Auth-Token"] = cfg.token;
    Object.assign(headers, cfg.headers || {});
    const body = { language_id: eng.id, source_code: b64e(src), cpu_time_limit: 10, wall_time_limit: 20, memory_limit: 512000 };
    if (eng.opts || meta.opts) body.compiler_options = [eng.opts, meta.opts].filter(Boolean).join(" ");
    if (meta.args) body.command_line_arguments = meta.args;
    return { engine: eng.label, meta, url: base + "/submissions?base64_encoded=true&wait=true", headers, body: JSON.stringify(body) };
  };
  RA.judge0Finish = (m, req, r, user) => {
    const stdout = b64d(r.stdout), stderr = b64d(r.stderr), compile = b64d(r.compile_output);
    const status = r.status ? r.status.description : "Unknown";
    return Object.assign(RA.buildReport(m, req.meta, { status, stdout, stderr, compile, user }), { engine: req.engine, time: r.time, memory: r.memory });
  };
  RA.runJudge0 = async (m, user, cfg) => {
    const req = RA.judge0Request(m, user, cfg);
    if (req.ciOnly || req.error) return Object.assign({ results: [] }, req);
    // cfg.timeout (ms) aborts a hung request; the public instance can stall under load.
    const signal = cfg && cfg.timeout && typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(cfg.timeout) : undefined;
    let res;
    try { res = await fetch(req.url, { method: "POST", headers: req.headers, body: req.body, signal }); }
    catch (e) { throw new Error(e && e.name === "TimeoutError" ? "Judge0 didn't answer in " + Math.round(cfg.timeout / 1000) + " s" : (e && e.message) || String(e)); }
    if (!res.ok) throw new Error("Judge0 HTTP " + res.status);
    return RA.judge0Finish(m, req, await res.json(), user);
  };
  // Shared by Judge0 and the GitHub Actions runner. status: "Accepted" | "Compilation Error" | anything else = runtime failure.
  RA.buildReport = (m, meta, run) => {
    const { status, stdout = "", stderr = "", compile = "" } = run;
    const results = RA.parseCheckpoints(stdout);
    RA.testSuiteSummary(stdout, results, run.user || "");
    if (status === "Compilation Error") results.unshift({ status: "FAIL", label: "Compiles", detail: compile.split("\n").filter((l) => /error/i.test(l)).slice(0, 4).join(" / ") || compile.slice(0, 400) });
    else if (["basics", "python", "javascript", "sql", "bash"].indexOf(m.lang) < 0) results.unshift({ status: "PASS", label: "Compiles", detail: "" });
    if (status !== "Accepted" && status !== "Compilation Error") results.push({ status: "FAIL", label: "Runs to completion", detail: status + (stderr ? ": " + stderr.slice(0, 300) : "") });
    (meta.checkpoints || []).forEach((label) => { if (!results.some((x) => x.label === label)) results.push({ status: "FAIL", label, detail: "not reached" }); });
    return { status, stdout, stderr, compile, results };
  };
  // Native test-runner summaries (cargo/rustc --test) become a checkpoint too.
  RA.testSuiteSummary = (stdout, results, user) => {
    const t = [...(stdout || "").matchAll(/test result: (ok|FAILED)\. (\d+) passed; (\d+) failed/g)];
    const sw = (stdout || "").match(/Test run with (\d+) tests? (passed|failed)/);
    if (sw) {
      const n = +sw[1];
      results.push({ status: sw[2] === "passed" && n >= 2 ? "PASS" : "FAIL", label: "Your @Test suite", detail: `${n} tests ${sw[2]} (need at least 2, all passing)` });
      results.push({ status: sw[2] === "passed" && (/with \d+ (test cases|arguments)/.test(stdout) || /@Test\s*\([^)]*\barguments\s*:/.test(user || "")) ? "PASS" : "FAIL", label: "Includes a parameterized test", detail: "add @Test(arguments: [...]) to one test" });
    }
    if (!t.length) return;
    const passed = t.reduce((a, x) => a + +x[2], 0), failed = t.reduce((a, x) => a + +x[3], 0);
    const mine = (stdout.match(/^test (?!ra_)\S+ \.\.\. /gm) || []).length;
    results.push({ status: failed === 0 && mine >= 2 ? "PASS" : "FAIL", label: "Your #[test] suite", detail: `${mine} of your tests ran, ${failed} failed (need at least 2, all passing)` });
  };
  RA.allPassed = (rep) => rep && rep.results.length > 0 && rep.results.every((x) => x.status !== "FAIL");
})(typeof window !== "undefined" ? window : globalThis);
