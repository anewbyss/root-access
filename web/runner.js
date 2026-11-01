// ROOT//ACCESS on-device runner manager (main thread). Owns the worker, time limits and the runtime packs.
// window.RALocal = { has, ready, possible, run, packs, packStatus, download, remove, setBases }
(() => {
"use strict";
const RA = window.RA;
const PACK_CACHE = "ra-packs-v1";
const LIMIT = { run: 10000, load: 180000 }; // run matches Judge0's 10 s CPU limit
let custom = {}; // pack -> base URL override (Settings)
// tools/fetch-packs.js writes vendor/packs.json when packs are self-hosted next to the app.
const vendorReady = fetch("vendor/packs.json").then((r) => (r.ok ? r.json() : null)).catch(() => null);
const abs = (u) => new URL(u, location.href).href;
async function base(pack) {
  if (custom[pack]) return custom[pack].replace(/\/?$/, "/");
  const v = await vendorReady;
  return v && v[pack] ? abs(`vendor/${pack}/`) : RA.PACKS[pack].base;
}
const urls = async (pack) => { const b = await base(pack); return RA.PACKS[pack].files.map((f) => b + f); };

async function packStatus(pack) {
  const list = await urls(pack);
  if (!("caches" in window)) return { have: 0, total: list.length, ready: false, base: list[0].replace(/[^/]+$/, "") };
  let have = 0;
  for (const u of list) if (await caches.match(u)) have++;
  return { have, total: list.length, ready: have === list.length, base: list[0].replace(/[^/]+$/, "") };
}
async function download(pack, onProgress) {
  if (!("caches" in window)) throw new Error("This browser can't store offline packs here. Serve the app over https or localhost.");
  try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
  const c = await caches.open(PACK_CACHE), list = await urls(pack);
  let i = 0;
  for (const u of list) {
    onProgress && onProgress(i, list.length, u);
    if (!(await c.match(u))) {
      const r = await fetch(u, { mode: "cors" });
      if (!r.ok) throw new Error(`${u.split("/").pop()}: HTTP ${r.status}`);
      await c.put(u, r);
    }
    i++;
  }
  onProgress && onProgress(i, list.length, "");
}
async function remove(pack) {
  if (!("caches" in window)) return;
  const c = await caches.open(PACK_CACHE);
  for (const u of await urls(pack)) await c.delete(u);
  if (pack === "python" || pack === "typescript") killTool();
}

// ---- workers ----
let tool = null, seq = 0;
const pending = new Map();
function killTool(reason) {
  if (tool) tool.terminate();
  tool = null;
  for (const p of pending.values()) { clearTimeout(p.timer); p.reject(new Error(reason || "Runner restarted")); }
  pending.clear();
}
function toolWorker() {
  if (tool) return tool;
  tool = new Worker("worker.js");
  tool.onmessage = (e) => {
    const p = pending.get(e.data.id);
    if (!p) return;
    if (e.data.done) { pending.delete(e.data.id); clearTimeout(p.timer); p.resolve(e.data); }
    else p.phase(e.data.phase);
  };
  tool.onerror = (e) => { e.preventDefault(); killTool(e.message || "The on-device runner crashed"); };
  return tool;
}
// Sends one job. The load budget covers fetching/initialising a runtime; the run budget starts when code starts.
function job(getWorker, msg, onPhase, onTimeout) {
  return new Promise((resolve, reject) => {
    const id = ++seq, w = getWorker();
    const arm = (ms, fn) => { clearTimeout(p.timer); p.timer = setTimeout(fn, ms); };
    const p = {
      resolve, reject, timer: null,
      phase: (ph) => { onPhase && onPhase(ph); if (ph === "running") arm(LIMIT.run, () => { pending.delete(id); onTimeout(w); resolve({ timeout: true }); }); }
    };
    arm(LIMIT.load, () => { pending.delete(id); onTimeout(w); reject(new Error("Timed out loading the on-device runtime")); });
    pending.set(id, p);
    w.postMessage(Object.assign({ id }, msg));
  });
}
const onTool = (msg, onPhase) => job(toolWorker, msg, onPhase, () => killTool("Stopped"));
// JavaScript gets a fresh worker per run, so timers left running by one attempt never leak into the next.
function onFresh(msg, onPhase) {
  const w = new Worker("worker.js");
  return new Promise((resolve, reject) => {
    const id = ++seq;
    const end = (fn, v) => { clearTimeout(t); w.terminate(); fn(v); };
    let t = setTimeout(() => end(resolve, { timeout: true }), LIMIT.run);
    w.onmessage = (e) => { if (e.data.done) end(resolve, e.data); else onPhase && onPhase(e.data.phase); };
    w.onerror = (e) => { e.preventDefault(); end(reject, new Error(e.message || "worker failed")); };
    w.postMessage(Object.assign({ id }, msg));
  });
}

const has = (L) => !!RA.LOCAL[L];
async function ready(L) {
  const d = RA.LOCAL[L];
  if (!d) return false;
  if (!d.pack) return typeof Worker === "function";
  return (await packStatus(d.pack)).ready;
}
// Ready now, or downloadable right now because we're online.
async function possible(L) { return has(L) && ((await ready(L)) || navigator.onLine); }

const timeoutReport = (m) => RA.localFinish(m, "", "Time Limit Exceeded", `Stopped after ${LIMIT.run / 1000} s. Look for a loop that never ends, or an await that never resolves.`);
async function run(m, code, onPhase) {
  const plan = RA.localPlan(m, code);
  if (!plan) throw new Error("No on-device runner for this mission");
  if (plan.kind === "python") {
    const r = await onTool({ op: "python", src: plan.src, base: await base("python"), packages: plan.packages }, onPhase);
    return r.timeout ? timeoutReport(m) : RA.localFinish(m, r.stdout, r.status, r.stderr);
  }
  let js = plan.src;
  if (plan.kind === "ts") {
    const t = await onTool({ op: "ts", src: plan.src, base: await base("typescript") }, onPhase);
    if (t.timeout) return timeoutReport(m);
    if (t.syntax && t.syntax.length) {
      const rep = RA.buildReport(m, RA.harnessMeta(""), { status: "Compilation Error", compile: t.syntax.slice(0, 4).join(" / ") });
      return Object.assign(rep, { engine: plan.label });
    }
    js = t.js;
  }
  const r = await onFresh({ op: "js", src: js }, onPhase);
  return r.timeout ? timeoutReport(m) : RA.localFinish(m, r.stdout, r.status, r.stderr);
}

window.RALocal = {
  has, ready, possible, run, packStatus, download, remove, base,
  packs: () => Object.keys(RA.PACKS),
  setBases: (map) => { custom = Object.assign({}, map || {}); killTool(); }
};
})();
