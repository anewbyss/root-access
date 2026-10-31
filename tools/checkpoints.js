// Runs mission checkpoints on local toolchains (GitHub Actions or your machine).
// Same harnesses and protocol as the in-browser Judge0 runner, but with current compilers,
// so the CI-only missions (coroutines, virtual threads, Swift Testing, SwiftUI, Compose...) run too.
//
// usage: node tools/checkpoints.js [--lang go,rust] [--only go3,rs7] [--dir submissions] [--starter] [--json out.json]
//   --dir      use learner files (<id>.<ext>) exported from the app instead of reference solutions
//   --starter  run each mission's starter code; every mission is EXPECTED to fail (sanity check)
const load = require("./load"), fs = require("fs"), os = require("os"), path = require("path"), cp = require("child_process");
const RA = load();
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const langs = (opt("--lang") || "").split(",").filter(Boolean);
const only = (opt("--only") || "").split(",").filter(Boolean);
const dir = opt("--dir"), starter = argv.includes("--starter"), jsonOut = opt("--json");
const ROOT = path.join(__dirname, "..");
const STUBS = path.join(__dirname, "ci", "stubs");
const LIB = process.env.RA_LIB || path.join(ROOT, ".ci-lib"); // jars downloaded by the workflow

const sh = (cmd, cwd, timeout = 180000) => {
  const r = cp.spawnSync("bash", ["-c", cmd], { cwd, encoding: "utf8", timeout, maxBuffer: 32 << 20 });
  return { code: r.status === null ? 124 : r.status, out: r.stdout || "", err: (r.stderr || "") + (r.error ? String(r.error) : "") };
};
const q = (s) => "'" + String(s).replace(/'/g, "'\\''") + "'";

// Each runner: write files into a temp dir, compile (-> "Compilation Error" on failure), then run.
const RUN = {
  python: (src, d) => [null, (w(d, "main.py", src), "python3 main.py")],
  sql: (src, d) => [null, (w(d, "main.py", src), "python3 main.py")],
  javascript: (src, d) => [null, (w(d, "main.js", src), "node main.js")],
  typescript: (src, d) => { w(d, "main.ts", src); w(d, "package.json", '{"type":"module"}'); return ["tsc --strict --target es2022 --module es2022 --moduleResolution bundler --lib es2022,dom --skipLibCheck --outDir out main.ts", "node out/main.js"]; },
  bash: (src, d) => [null, (w(d, "main.sh", src), "bash main.sh")],
  go: (src, d) => { w(d, "main.go", src); return ["go build -o app main.go", "./app"]; },
  rust: (src, d, meta) => { w(d, "main.rs", src); return [`rustc --edition 2021 -O ${meta.opts || ""} main.rs -o app`, `./app ${meta.args || ""}`]; },
  cpp: (src, d) => { w(d, "main.cpp", src); return [`${process.env.CXX || "g++-14"} -std=c++23 -pthread -O1 main.cpp -o app`, "./app"]; },
  java: (src, d) => { w(d, "Main.java", src); const cpth = fs.existsSync(path.join(LIB, "junit.jar")) ? `--class-path ${q(path.join(LIB, "junit.jar"))} ` : ""; return [null, `java ${cpth}Main.java`]; },
  kotlin: (src, d, meta, m) => {
    w(d, "Main.kt", src);
    const jar = path.join(LIB, "coroutines.jar");
    const stubs = m.id === "kt12" ? fs.readdirSync(path.join(STUBS, "kotlin")).map((f) => q(path.join(STUBS, "kotlin", f))).join(" ") : "";
    const cpth = fs.existsSync(jar) ? `-cp ${q(jar)}` : "";
    return [`kotlinc Main.kt ${stubs} ${cpth} -include-runtime -d app.jar 2>&1 | grep -v '^warning' >&2; test -f app.jar`, `java -cp app.jar${fs.existsSync(jar) ? ":" + q(jar) : ""} MainKt`];
  },
  csharp: (src, d) => {
    // .NET 10 file-based app: `dotnet run app.cs` (implicit usings + nullable on by default)
    w(d, "app.cs", src);
    return [null, "dotnet run app.cs"];
  },
  swift: (src, d, meta, m) => {
    if (m.id === "sw11") {
      // Swift Testing needs a package + `swift test`.
      fs.mkdirSync(path.join(d, "Sources", "Mission"), { recursive: true });
      fs.mkdirSync(path.join(d, "Tests", "MissionTests"), { recursive: true });
      w(d, "Package.swift", `// swift-tools-version:6.0\nimport PackageDescription\nlet package = Package(name: "Mission", platforms: [.macOS(.v14)], targets: [.target(name: "Mission"), .testTarget(name: "MissionTests", dependencies: ["Mission"])])\n`);
      w(d, "Sources/Mission/Empty.swift", "public enum MissionMarker {}\n");
      w(d, "Tests/MissionTests/MissionTests.swift", src);
      return [null, "swift test 2>&1"];
    }
    w(d, "main.swift", src);
    return [`swiftc -O ${m.id === "sw12" ? "-target arm64-apple-macos14.0" : ""} main.swift -o app`, "./app"];
  }
};
function w(d, f, s) { fs.writeFileSync(path.join(d, f), s); }

function codeFor(m) {
  if (starter) return m.starter || "";
  if (dir) {
    const f = fs.existsSync(dir) && fs.readdirSync(dir).find((x) => x.replace(/\.[^.]+$/, "") === m.id);
    return f ? fs.readFileSync(path.join(dir, f), "utf8") : null;
  }
  return RA.solution(m);
}

const missions = RA.missions.filter((m) => (!langs.length || langs.includes(m.lang)) && (!only.length || only.includes(m.id)));
const report = [];
let bad = 0;
for (const m of missions) {
  const user = codeFor(m);
  if (user == null) continue;
  const harness = m.lang in { python: 1, javascript: 1, typescript: 1, sql: 1 } ? "" : RA.HARNESS[m.id] || "";
  const meta = RA.harnessMeta(harness);
  const src = RA.compose(m, user, "ci");
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "ra-" + m.id + "-"));
  let rep;
  if (!src) rep = { status: "No harness", results: [{ status: "FAIL", label: "Harness exists", detail: "no checkpoint harness for " + m.id }] };
  else {
    const [build, run] = RUN[m.lang](src, d, meta, m);
    const c = build ? sh(build, d) : { code: 0, out: "", err: "" };
    if (c.code !== 0) rep = RA.buildReport(m, meta, { status: "Compilation Error", compile: c.out + c.err });
    else {
      const r = sh(run, d, 120000);
      // swift test prints results on stdout via 2>&1; give the parser everything.
      const stdout = m.id === "sw11" ? r.out + r.err : r.out;
      // dotnet run compiles and runs in one step; surface compiler errors as "Compiles".
      if (m.lang === "csharp" && r.code !== 0 && /error CS\d+/.test(r.out + r.err)) { rep = RA.buildReport(m, meta, { status: "Compilation Error", compile: r.out + r.err }); }
      else rep = RA.buildReport(m, meta, { status: r.code === 0 || (m.id === "sw11" && /Test run with/.test(stdout)) ? "Accepted" : r.code === 124 ? "Time Limit Exceeded" : "Runtime Error (exit " + r.code + ")", stdout, stderr: r.err, compile: c.err, user });
    }
  }
  const ok = RA.allPassed(rep);
  const expectOk = !starter;
  if (ok !== expectOk) bad++;
  const mark = (r) => (r.status === "PASS" ? "+" : r.status === "SKIP" ? "~" : "x") + r.label;
  console.log(`${m.id.padEnd(5)} ${ok ? "PASS" : "FAIL"}${starter ? (ok ? "  <- starter should not pass" : "  (expected)") : ""}  ${rep.results.map(mark).join(" | ")}`);
  if (!ok && !starter) {
    rep.results.filter((r) => r.status === "FAIL").forEach((r) => console.log("      x " + r.label + ": " + r.detail));
    if (rep.stderr) console.log("      stderr: " + rep.stderr.slice(0, 600).replace(/\n/g, "\n      "));
  }
  report.push({ id: m.id, lang: m.lang, ok, results: rep.results });
  fs.rmSync(d, { recursive: true, force: true });
}
if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ generated: new Date().toISOString(), starter, report }, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = report.map((r) => `| ${r.id} | ${r.ok ? "PASS" : "FAIL"} | ${r.results.map((x) => (x.status === "PASS" ? "✓ " : "✗ ") + x.label).join("<br>")} |`);
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Checkpoints${langs.length ? " (" + langs.join(", ") + ")" : ""}${starter ? " — starter code" : ""}\n\n| Mission | Result | Checkpoints |\n|---|---|---|\n${rows.join("\n")}\n\n`);
}
console.log(bad ? `${bad} mission(s) ${starter ? "passed with starter code" : "failed"}` : starter ? "every starter fails, as it should" : "all passed");
process.exitCode = bad ? 1 : 0;
