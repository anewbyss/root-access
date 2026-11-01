// ROOT//ACCESS on-device runner. Runs one composed checkpoint program off the main thread, so a runaway loop
// can be stopped by terminating the worker. Messages: { id, op: "python"|"ts"|"js", src, base, packages }.
// Replies: { id, phase: "loading"|"running" } while working, then { id, done: true, stdout, stderr, status }.
"use strict";
let py = null, pyBase = null;
const loaded = new Set();

const fmt = (a) => Array.prototype.map.call(a, (x) => {
  if (typeof x === "string") return x;
  try { return JSON.stringify(x); } catch (e) { return String(x); }
}).join(" ");

async function python(msg, out, err) {
  if (!py || pyBase !== msg.base) {
    self.postMessage({ id: msg.id, phase: "loading" });
    if (typeof self.loadPyodide !== "function") importScripts(msg.base + "pyodide.js");
    py = await self.loadPyodide({ indexURL: msg.base, fullStdLib: false });
    pyBase = msg.base; loaded.clear();
  }
  for (const p of msg.packages || []) if (!loaded.has(p)) {
    self.postMessage({ id: msg.id, phase: "loading" });
    const problems = [];
    await py.loadPackage(p, { messageCallback: () => {}, errorCallback: (m) => problems.push(m) });
    // loadPackage reports failures through the callback instead of throwing, so confirm the import works.
    try { py.runPython("import " + p); } catch (e) { throw new Error(`${p} isn't available offline yet: re-download the Python pack in Settings → Offline. ${problems.join(" ")}`.trim()); }
    loaded.add(p);
  }
  py.setStdout({ batched: (l) => out.push(l) });
  py.setStderr({ batched: (l) => err.push(l) });
  py.setStdin({ stdin: () => null }); // input() sees end-of-file instead of hanging
  self.postMessage({ id: msg.id, phase: "running" });
  const globals = py.toPy({});
  try { await py.runPythonAsync(msg.src, { globals }); }
  finally { globals.destroy(); }
}

async function js(msg, out) {
  self.postMessage({ id: msg.id, phase: "running" });
  const log = function () { out.push(fmt(arguments)); };
  self.console = { log, error: log, warn: log, info: log, debug: log };
  // Indirect eval runs in global scope; the composed harness ends with an async IIFE whose promise is the
  // completion value, so awaiting it waits for every checkpoint.
  const done = (0, eval)(msg.src);
  if (done && typeof done.then === "function") await done;
  await new Promise((r) => setTimeout(r, 20));
}

self.onmessage = async (e) => {
  const msg = e.data, out = [], err = [];
  let status = "Accepted";
  try {
    if (msg.op === "python") await python(msg, out, err);
    else if (msg.op === "ts") {
      if (!self.ts) { self.postMessage({ id: msg.id, phase: "loading" }); importScripts(msg.base + "typescript.js"); }
      const r = self.ts.transpileModule(msg.src, { compilerOptions: { target: 99, module: 99 }, reportDiagnostics: true });
      const syntax = (r.diagnostics || []).map((d) => self.ts.flattenDiagnosticMessageText(d.messageText, " "));
      self.postMessage({ id: msg.id, done: true, js: r.outputText.replace(/^\s*export\s*\{\s*\};?\s*$/gm, ""), syntax });
      return;
    }
    else await js(msg, out);
  } catch (ex) {
    status = "Runtime Error";
    const m = String((ex && ex.message) || ex);
    err.push(msg.op === "python" ? m.split("\n").slice(-3).join("\n") : m); // buildReport turns this into "Runs to completion"
  }
  self.postMessage({ id: msg.id, done: true, stdout: out.join("\n"), stderr: err.join("\n"), status });
};
