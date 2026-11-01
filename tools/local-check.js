// Verifies the on-device runners (curriculum/_local.js) grade exactly like Judge0/CI: every reference solution
// passes and every starter fails, for each track that can run offline.
//   python/basics/sql -> Pyodide (same build the web app downloads)    typescript -> transpile-only, then JS
//   javascript        -> plain JS with real timers (web worker) AND the virtual-timer shim (Swift app / JavaScriptCore)
// usage: node tools/local-check.js [--modules <dir containing pyodide/ and typescript/>]
const vm = require("vm"), path = require("path"), { execFileSync } = require("child_process");
const RA = require("./load.js")();
const args = process.argv.slice(2), at = args.indexOf("--modules");
const mods = at >= 0 ? path.resolve(args[at + 1]) : path.join(__dirname, "..", "node_modules");
const want = (m) => [["solution", RA.solution(m), true], ["starter", m.starter, false]];
let failures = 0, checked = 0;
const verdict = (m, kind, rep, expect) => {
  checked++;
  if (RA.allPassed(rep) === expect) return;
  failures++;
  console.log(`FAIL ${m.id} ${kind}: ` + rep.results.filter((r) => r.status !== "PASS").map((r) => `${r.label}: ${r.detail}`).join(" | ").slice(0, 300));
};
const missions = (...langs) => RA.missions.filter((m) => langs.includes(m.lang));

async function runJs(src, shim) {
  if (!shim) {
    const out = [], log = (...a) => out.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));
    const ctx = vm.createContext({ console: { log, error: log, warn: log, info: log }, setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask });
    try { const done = vm.runInContext(src, ctx, { timeout: 10000 }); if (done && done.then) await done; await new Promise((r) => setTimeout(r, 20)); }
    catch (e) { return { stdout: out.join("\n"), status: "Runtime Error", stderr: e.message }; }
    return { stdout: out.join("\n"), status: "Accepted" };
  }
  const ctx = vm.createContext({}); // bare ECMAScript, like a fresh JSContext
  vm.runInContext(RA.JS_SHIM, ctx);
  try { vm.runInContext(src, ctx, { timeout: 10000 }); }
  catch (e) { return { stdout: vm.runInContext("__raOutput()", ctx), status: "Runtime Error", stderr: e.message }; }
  for (let i = 0; i < 200000; i++) { // the Swift app's loop: drain promise jobs, fire the next virtual timer
    await new Promise(setImmediate);
    if (!vm.runInContext("__raTick()", ctx)) { await new Promise(setImmediate); if (!vm.runInContext("__raTimers.length", ctx)) break; }
  }
  return { stdout: vm.runInContext("__raOutput()", ctx), status: "Accepted" };
}

(async () => {
  // JavaScript: worker-style and JavaScriptCore-style
  for (const shim of [false, true]) for (const m of missions("javascript")) for (const [kind, code, expect] of want(m)) {
    const r = await runJs(RA.localPlan(m, code).src, shim);
    verdict(m, kind + (shim ? " (JSC shim)" : ""), RA.localFinish(m, r.stdout, r.status, r.stderr), expect);
  }
  console.log(`javascript: ok so far (${failures} failures)`);

  // TypeScript: transpile-only, as in the web worker
  const ts = require(path.join(mods, "typescript"));
  for (const m of missions("typescript")) for (const [kind, code, expect] of want(m)) {
    const t = ts.transpileModule(RA.localPlan(m, code).src, { compilerOptions: { target: 99, module: 99 }, reportDiagnostics: true });
    if (t.diagnostics.length) { verdict(m, kind, RA.buildReport(m, {}, { status: "Compilation Error", compile: "syntax" }), expect); continue; }
    const r = await runJs(t.outputText.replace(/^\s*export\s*\{\s*\};?\s*$/gm, ""), false);
    verdict(m, kind, RA.localFinish(m, r.stdout, r.status, r.stderr), expect);
  }
  console.log(`typescript: done (${failures} failures)`);

  // Python + Boot Camp + SQL on Pyodide
  const { loadPyodide } = require(path.join(mods, "pyodide"));
  const py = await loadPyodide();
  let sqlite = true;
  try { await py.loadPackage("sqlite3", { messageCallback: () => {}, errorCallback: () => {} }); py.runPython("import sqlite3"); } catch (e) { sqlite = false; console.log("::warning::sqlite3 wheel unavailable to Pyodide here; SQL harnesses checked on CPython instead"); }
  let out = [], err = [];
  py.setStdout({ batched: (l) => out.push(l) }); py.setStderr({ batched: (l) => err.push(l) });
  for (const m of missions("basics", "python", "sql")) for (const [kind, code, expect] of want(m)) {
    const src = RA.localPlan(m, code).src;
    if (m.lang === "sql" && !sqlite) {
      let stdout = ""; try { stdout = execFileSync("python3", ["-I", "-c", src], { encoding: "utf8" }); } catch (e) { stdout = e.stdout || ""; }
      verdict(m, kind + " (CPython)", RA.localFinish(m, stdout, "Accepted"), expect); continue;
    }
    out = []; err = [];
    let status = "Accepted";
    const g = py.toPy({});
    try { await py.runPythonAsync(src, { globals: g }); } catch (e) { status = "Runtime Error"; err.push(String(e.message).split("\n").slice(-2).join(" ")); } finally { g.destroy(); }
    verdict(m, kind, RA.localFinish(m, out.join("\n"), status, err.join("\n")), expect);
  }
  console.log(`python/basics/sql: done`);
  console.log(`${checked} runs checked, ${failures} failures`);
  process.exit(failures ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
