// ROOT//ACCESS on-device runners. Shared by the web app (Web Worker + Pyodide + TypeScript) and the Swift app
// (JavaScriptCore). They compose the exact same harness as Judge0 and CI (RA.compose with env "local") and read the
// same ::cp:: lines, so a local pass means the same checkpoints passed.
//
// What runs where, offline:
//   basics, python, sql  -> Pyodide (CPython 3.13 compiled to WebAssembly). Web only; needs the Python pack cached once.
//   javascript           -> the JS engine you already have (Web Worker, or JavaScriptCore in the Swift app).
//   typescript           -> TypeScript's own transpiler, then JS. Web only; needs the TypeScript pack cached once.
//                           Transpile-only: type errors are reported by Judge0 / GitHub Actions, not here.
//   everything else      -> structure checks on device; full checkpoints re-run on Judge0 when you're back online.
(function (g) {
  const RA = g.RA = g.RA || {};

  RA.LOCAL = {
    basics:     { kind: "python", pack: "python", label: "Python 3.13 · Pyodide (this device)" },
    python:     { kind: "python", pack: "python", label: "Python 3.13 · Pyodide (this device)" },
    sql:        { kind: "python", pack: "python", packages: ["sqlite3"], label: "SQLite · Pyodide (this device)" },
    javascript: { kind: "js", label: "JavaScript (this device)" },
    typescript: { kind: "ts", pack: "typescript", label: "TypeScript 5.6 transpile (this device)" }
  };

  // Downloadable runtime packs. `base` is a directory URL; the web app also tries ./vendor/<pack>/ first,
  // which tools/fetch-packs.js fills for fully self-hosted installs.
  RA.PACKS = {
    python: {
      label: "Python + SQLite (Pyodide 0.28.3)", size: "≈13 MB",
      base: "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/",
      files: ["pyodide.js", "pyodide.asm.js", "pyodide.asm.wasm", "python_stdlib.zip", "pyodide-lock.json",
        "sqlite3-1.0.0-cp313-cp313-pyodide_2025_0_wasm32.whl"]
    },
    typescript: {
      label: "TypeScript 5.6.3 compiler", size: "≈9 MB",
      base: "https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/",
      files: ["typescript.js"]
    }
  };

  // Returns { kind, src, packages, label } or null when the track has no on-device runner.
  RA.localPlan = (m, user) => {
    const L = RA.LOCAL[m.lang];
    if (!L) return null;
    let src = RA.compose(m, user, "local");
    if (!src) return null;
    if (L.kind !== "python") src = src.replace(/^\s*export\s*\{\s*\};?\s*$/gm, "");
    return { kind: L.kind, src, packages: L.packages || [], label: L.label, pack: L.pack || null };
  };

  // Same report shape as Judge0 and CI. status: "Accepted" | "Time Limit Exceeded" | "Runtime Error".
  RA.localFinish = (m, stdout, status, stderr) => {
    const rep = RA.buildReport(m, RA.harnessMeta(""), { status: status || "Accepted", stdout: stdout || "", stderr: stderr || "" });
    return Object.assign(rep, { engine: RA.LOCAL[m.lang] ? RA.LOCAL[m.lang].label : "this device" });
  };

  // For hosts with no event loop of their own (JavaScriptCore): console capture plus virtual timers.
  // The host evaluates JS_SHIM, then the composed source, then calls __raTick() until it returns false;
  // promise jobs run between calls, so async/await and setTimeout-based code complete in order.
  RA.JS_SHIM = [
    "var __raOut = [], __raTimers = [], __raNow = 0, __raSeq = 0;",
    "var __raFmt = function (a) { return Array.prototype.map.call(a, function (x) { return typeof x === 'string' ? x : (function () { try { return JSON.stringify(x); } catch (e) { return String(x); } })(); }).join(' '); };",
    "var console = { log: function () { __raOut.push(__raFmt(arguments)); } };",
    "console.error = console.warn = console.info = console.debug = console.log;",
    "function setTimeout(fn, ms) { var id = ++__raSeq; __raTimers.push({ id: id, at: __raNow + Math.max(0, +ms || 0), fn: fn, args: Array.prototype.slice.call(arguments, 2) }); return id; }",
    "function clearTimeout(id) { __raTimers = __raTimers.filter(function (t) { return t.id !== id; }); }",
    "function setInterval(fn, ms) { var id = ++__raSeq; var loop = function () { fn(); __raTimers.push({ id: id, at: __raNow + Math.max(1, +ms || 1), fn: loop, args: [] }); }; __raTimers.push({ id: id, at: __raNow + Math.max(1, +ms || 1), fn: loop, args: [] }); return id; }",
    "var clearInterval = clearTimeout;",
    "function queueMicrotask(fn) { Promise.resolve().then(fn); }",
    "function __raTick() { if (!__raTimers.length) return false; __raTimers.sort(function (a, b) { return a.at - b.at || a.id - b.id; }); var t = __raTimers.shift(); __raNow = t.at; try { t.fn.apply(null, t.args); } catch (e) { __raOut.push('::cp::FAIL::Runs to completion::' + (e && e.message || e)); } return true; }",
    "function __raOutput() { return __raOut.join('\\n'); }"
  ].join("\n");
})(typeof window !== "undefined" ? window : globalThis);
