(() => {
"use strict";
const RA = window.RA;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const LANG_ORDER = RA.LANG_ORDER;                       // Boot Camp first, then the 12 languages
const LANGS12 = LANG_ORDER.filter((L) => !RA.isTrack(L)); // real languages (counted for fluency, dossiers)
const EXT = { basics: "py", python: "py", javascript: "js", typescript: "ts", sql: "sql", bash: "sh", go: "go", rust: "rs", swift: "swift", kotlin: "kt", java: "java", csharp: "cs", cpp: "cpp" };
const BYID = Object.fromEntries(RA.missions.map((m) => [m.id, m]));
const RL = window.RALocal;

// Progress persists in this browser (localStorage). If storage is blocked (private mode, disabled site data),
// it falls back to memory and the Backup screen says so. Snapshots are trimmed first if the quota fills up.
const mem = {};
const store = (() => {
  let ls = null;
  try { const t = "__ra_probe"; localStorage.setItem(t, t); localStorage.removeItem(t); ls = localStorage; } catch (e) {}
  return {
    persistent: !!ls,
    get: (k) => { try { return ls ? ls.getItem(k) : mem[k] ?? null; } catch (e) { return mem[k] ?? null; } },
    set: (k, v) => {
      mem[k] = v;
      if (!ls) return true;
      try { ls.setItem(k, v); return true; }
      catch (e) {
        if (k !== SNAP) try { const snaps = JSON.parse(ls.getItem(SNAP) || "[]"); if (snaps.length) { ls.setItem(SNAP, JSON.stringify(snaps.slice(0, Math.floor(snaps.length / 2)))); ls.setItem(k, v); return true; } } catch (e2) {}
        return false;
      }
    }
  };
})();
const KEY = "rootaccess.save", SNAP = "rootaccess.snapshots", PREFS = "rootaccess.prefs";

const fresh = () => ({
  format: "rootaccess-save", version: 2, faction: null, xp: 0,
  done: [],            // cleared mission ids (shared with the Swift app)
  verified: {},        // id -> "judge0" | "ci" (pending GitHub Actions) | "local" | "offline"
  code: {}, fails: {}, primm: {}, notes: {}, hints: {}, legacy: {},
  pet: Object.assign({}, RA.PET_DEFAULTS),   // parts, stats, and `persona` overrides (see curriculum/_pet.js)
  // mode: "auto" (on-device when the pack is ready, else Judge0) | "judge0" (Judge0 first) | "device" (never send code out)
  settings: { ce: RA.judge0Hosts.ce, extra: RA.judge0Hosts.extra, token: "", tokenHeader: "X-Auth-Token",
    mode: "auto", offlineClears: true, autoReverify: true, packBase: {} },
  prefs: defaultPrefs(),
  updated: Date.now()
});
// Display preferences. Shared field names with the Swift app (it ignores the web-only ones).
function defaultPrefs() {
  return { scheme: "system", accent: "faction", accentHex: "", customAccent: "#3dff7a", contrast: "system", font: "mono", scale: 100,
    editorSize: 13, density: "normal", layout: "side", width: "normal", rain: "on", motion: "system", typewriter: true };
}
const ACCENTS = { matrix: "#3dff7a", ice: "#5ad1ff", violet: "#c79bff", ember: "#ff8a4c", gold: "#ffd84d", rose: "#ff6fae", white: "#f2f2f2" };
// Accepts v1 saves (23-mission prototype) and v2. Unknown mission ids are kept under `legacy` so nothing is lost.
function migrate(d) {
  const s = Object.assign(fresh(), d);
  s.pet = Object.assign({}, RA.PET_DEFAULTS, d.pet || {});
  s.settings = Object.assign(fresh().settings, d.settings || {});
  s.prefs = Object.assign(defaultPrefs(), d.prefs || {});
  s.legacy = Object.assign({}, d.legacy || {});
  const keep = [], gone = [];
  (Array.isArray(d.done) ? d.done : []).forEach((id) => (BYID[id] ? keep : gone).push(id));
  s.done = [...new Set(keep)];
  if (gone.length) s.legacy.done = [...new Set([...(s.legacy.done || []), ...gone])];
  const code = {};
  Object.entries(d.code || {}).forEach(([id, c]) => { if (BYID[id]) code[id] = c; else (s.legacy.code = s.legacy.code || {})[id] = c; });
  s.code = code;
  s.verified = Object.fromEntries(Object.entries(d.verified || {}).filter(([id]) => BYID[id]));
  s.done.forEach((id) => { if (!s.verified[id]) s.verified[id] = "offline"; });
  s.version = 2;
  return s;
}
function load() {
  try { const raw = store.get(KEY); if (raw) { const d = JSON.parse(raw); if (d && d.format === "rootaccess-save") return migrate(d); } } catch (e) {}
  return fresh();
}
let S = load();
let ui = { view: "missions", lang: "basics", mission: null, intel: "languages", intelLang: "python", set: "display" };
let saveOk = true;
function save() {
  S.updated = Date.now();
  const ok = store.set(KEY, JSON.stringify(S));
  if (!ok && saveOk) toast("Browser storage is full. Download a backup from Backup.");
  saveOk = ok; hud();
}
// Another tab saved: adopt its state unless you're mid-edit here.
addEventListener("storage", (e) => {
  if (e.key !== KEY || !e.newValue) return;
  try { const d = JSON.parse(e.newValue); if ((d.updated || 0) <= S.updated) return; S = migrate(d); applyPrefs(); if (!document.activeElement || !/TEXTAREA|INPUT/.test(document.activeElement.tagName)) render(); } catch (err) {}
});
function snapshot(label) {
  let snaps = []; try { snaps = JSON.parse(store.get(SNAP)) || []; } catch (e) {}
  snaps.unshift({ at: Date.now(), label, data: JSON.parse(JSON.stringify(S)) });
  store.set(SNAP, JSON.stringify(snaps.slice(0, 10)));
}
const level = () => 1 + Math.floor(S.xp / 500);
const lvlProgress = () => (S.xp % 500) / 500;
const F = () => RA.FACTIONS[S.faction];
const langMissions = (L) => RA.missions.filter((m) => m.lang === L).sort((a, b) => a.rank - b.rank);
const isDone = (id) => S.done.includes(id);
const unlocked = (m) => m.rank === 1 || isDone(langMissions(m.lang)[m.rank - 2].id);
const fluency = (L) => langMissions(L).filter((m) => isDone(m.id)).length;
const metaFor = (m) => RA.harnessMeta(m.lang in { basics: 1, python: 1, javascript: 1, typescript: 1, sql: 1 } ? "" : RA.HARNESS[m.id] || "");
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2800); }
function download(name, blob) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
const src = (k) => RA.SOURCES[k];
const cite = (k) => { const s = src(k); return s ? `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>` : ""; };

// ---------- display prefs ----------
const ROOT = document.documentElement;
const reduceMotion = () => S.prefs.motion === "reduce" || (S.prefs.motion !== "full" && matchMedia("(prefers-reduced-motion: reduce)").matches);
function accentHex() {
  const p = S.prefs;
  if (p.accent === "custom" && /^#[0-9a-f]{6}$/i.test(p.customAccent)) return p.customAccent;
  return ACCENTS[p.accent] || (S.faction ? F().color : ACCENTS.matrix);
}
// Mirrors prefs onto <html data-*> (style.css keys off these) and into a small key the inline <head> script reads.
function applyPrefs() {
  const p = S.prefs;
  ["scheme", "contrast", "font", "density", "layout", "rain", "motion", "width"].forEach((k) => { if (p[k] && p[k] !== "system") ROOT.dataset[k] = p[k]; else delete ROOT.dataset[k]; });
  $('meta[name="color-scheme"]').content = p.scheme === "light" || p.scheme === "dark" ? p.scheme : "light dark";
  ROOT.style.setProperty("--scale", (+p.scale || 100) / 100);
  ROOT.style.setProperty("--ed", (+p.editorSize || 13) + "px");
  p.accentHex = accentHex();
  ROOT.style.setProperty("--acc", p.accentHex);
  const dark = p.scheme === "dark" || (p.scheme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
  const tc = $('meta[name="theme-color"]'); if (tc) tc.content = dark ? "#030806" : "#f3f6f1";
  store.set(PREFS, JSON.stringify(p));
  rain.restart();
}
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => applyPrefs());

// ---------- code rain ----------
// Fades old glyphs to transparent (not to a fixed colour), so it works over light and dark themes.
const rain = (() => {
  const c = $("#rain"), x = c.getContext("2d"), glyphs = "アイウエオカキクケコｱｲｳ01{}<>/=;$#λ", fs = 16;
  let drops = [], timer = 0;
  const size = () => { c.width = innerWidth; c.height = innerHeight; drops = Array(Math.ceil(c.width / fs)).fill(0).map(() => Math.random() * -50); };
  function tick() {
    x.globalCompositeOperation = "destination-out"; x.fillStyle = "rgba(0,0,0,.09)"; x.fillRect(0, 0, c.width, c.height);
    x.globalCompositeOperation = "source-over";
    x.fillStyle = getComputedStyle(ROOT).getPropertyValue("--acc").trim() || "#3dff7a"; x.font = fs + "px ui-monospace, monospace";
    drops.forEach((d, i) => { x.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * fs, d * fs); drops[i] = d * fs > c.height && Math.random() > 0.975 ? 0 : d + 1; });
  }
  function restart() {
    clearInterval(timer); timer = 0;
    if (S.prefs.rain === "off") { x.clearRect(0, 0, c.width, c.height); return; }
    if (reduceMotion()) { x.clearRect(0, 0, c.width, c.height); for (let i = 0; i < 40; i++) tick(); return; } // one still frame
    if (!document.hidden) timer = setInterval(() => requestAnimationFrame(tick), S.prefs.rain === "low" ? 140 : 60);
  }
  size(); addEventListener("resize", () => { size(); restart(); });
  document.addEventListener("visibilitychange", () => restart());
  return { restart };
})();

// ---------- network / offline ----------
let online = navigator.onLine;
addEventListener("online", () => { online = true; hud(); if (S.faction && S.settings.autoReverify && pendingVerify().length) reverify(true); });
addEventListener("offline", () => { online = false; hud(); toast("Offline. Missions keep working; see Settings → Offline"); });
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register("sw.js").catch(() => {});
  navigator.serviceWorker.addEventListener("controllerchange", () => { if (hadController) toast("Update installed. Reload to use the new version."); });
}

// ---------- HUD / nav ----------
function hud() {
  if (S.prefs.accentHex !== accentHex()) applyPrefs();
  const langsDone = LANGS12.filter((L) => fluency(L) === 12).length;
  const pend = S.faction ? pendingVerify().length : 0;
  $("#hud").innerHTML = (S.faction ? `<span>${F().short}</span><span>LVL <b>${level()}</b></span><div class="bar" title="XP to next level"><i style="width:${lvlProgress() * 100}%"></i></div><span><b>${S.xp}</b> XP</span><span title="Missions cleared"><b>${S.done.length}</b>/${RA.missions.length}</span>${langsDone ? `<span title="Languages at full fluency"><b>${langsDone}</b> fluent</span>` : ""}` : "")
    + `<span class="net ${online ? "" : "off"}" title="${online ? "Online: Judge0 available" : "Offline: on-device runners and structure checks"}${pend ? ` · ${pend} rank${pend === 1 ? "" : "s"} waiting to re-verify` : ""}">${online ? "● online" : "○ offline"}${pend ? ` · ${pend}↻` : ""}</span>`;
  $("#nav").style.visibility = S.faction ? "visible" : "hidden";
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.view === ui.view));
}
$("#nav").addEventListener("click", (e) => { const v = e.target.closest("button")?.dataset.view; if (v) { ui.view = v; ui.mission = null; render(); } });
let lastPlace = "";
function render() {
  hud(); const v = $("#view"); v.onclick = null;
  if (!S.faction && ui.view !== "backup") return intro(v);
  ({ missions, intel, pet, backup, settings })[ui.view](v);
  // Only jump to the top when you actually go somewhere, not when a setting or pet option re-renders the view.
  const place = ui.view + "/" + (ui.mission || "") + "/" + ui.lang + "/" + ui.intel;
  if (place !== lastPlace) scrollTo(0, 0);
  lastPlace = place;
}

// ---------- intro ----------
function intro(v) {
  v.innerHTML = `<section class="intro"><p class="mut">// incoming transmission</p><div class="type" id="type"></div>
  <div id="pick" hidden><h2>Choose who you work for</h2><p class="mut">Every faction teaches the same 12 languages, 12 ranks each, through a different story. You can defect later and your skills carry over.</p><p class="mut">Never written code? Every faction starts you in <b>Boot Camp</b>, 12 missions that assume no experience.</p><div class="factions">${
    Object.entries(RA.FACTIONS).map(([k, f]) => `<button class="fcard panel" data-f="${k}" style="--acc:${f.color}"><span class="tag acc">${f.short}</span><h3>${esc(f.name)}</h3><q>${esc(f.creed)}</q><span class="mut">${esc(f.pitch)}</span><span class="mut">Handler: ${esc(f.handler)}</span></button>`).join("")
  }</div><p class="mut" style="margin-top:16px">Already have a save? <button data-restore>Restore a backup</button></p></div></section>`;
  const msg = "Wake up.\n\nThe world runs on code you can't read. Pipelines, hospitals, elections, gods, and secrets nobody was meant to read.\nIn 2021 one leaked password shut down a fuel pipeline. In 2024 one bad update crashed 8.5 million machines.\n\nFour factions want you. Each will teach you to read the code, and to write it.\nEvery mission ends at a checkpoint graded by a real compiler.\n\nFollow the white cursor.";
  let i = S.prefs.typewriter && !reduceMotion() ? 0 : msg.length; const el = $("#type");
  const step = () => { el.textContent = msg.slice(0, i++) + "█"; if (i <= msg.length) setTimeout(step, msg[i - 1] === "\n" ? 120 : 14); else { el.textContent = msg; $("#pick").hidden = false; } };
  step(); el.onclick = () => { i = msg.length; };
  v.onclick = (e) => {
    const f = e.target.closest("[data-f]")?.dataset.f;
    if (f) { S.faction = f; save(); toast(`Welcome to ${RA.FACTIONS[f].name}`); render(); }
    if (e.target.closest("[data-restore]")) { ui.view = "backup"; render(); }
  };
}

// ---------- mission board ----------
function missions(v) {
  if (ui.mission) return missionView(v, BYID[ui.mission]);
  const L = ui.lang, lang = RA.langs[L], list = langMissions(L), n = fluency(L), D = RA.DOSSIERS[L];
  v.innerHTML = `<div class="grid"><aside class="panel"><h3>Languages</h3><div class="langs">${LANG_ORDER.map((k) => {
    const d = fluency(k);
    return `${k === "basics" ? '<p class="tiny acc">START HERE</p>' : k === LANGS12[0] ? '<p class="tiny mut" style="margin-top:10px">LANGUAGES</p>' : ""}<button data-lang="${k}" class="${k === L ? "on" : ""}"><span>${esc(RA.langs[k].name)}</span><span class="mini"><i style="width:${(d / 12) * 100}%"></i></span><span class="mut">${d}/12</span></button>`; }).join("")}</div></aside>
  <section>${L !== "basics" && fluency("basics") < 12 ? `<div class="panel banner"><b>New to coding?</b> Start with <b>Boot Camp</b>: 12 short missions that assume no experience and teach the core ideas every language shares. <button data-lang="basics">Open Boot Camp</button></div>` : ""}<div class="panel lhead"><div><p class="mut">${esc(F().handler)} // ${esc(F().name)}</p><h2>${esc(lang.name)}</h2><p>${esc(D ? D.tagline : lang.why)}</p><p class="mut">${esc(lang.why)}</p>
    <div class="row">${D ? `<button data-intel="${L}">Read the ${esc(lang.name)} dossier</button>` : ""}<span class="chip">Engine: ${esc(RA.ENGINES[L].label)}</span>${RA.LOCAL[L] ? `<span class="chip dev" title="Runs with no network once its pack is downloaded (Settings → Offline)">Offline: ${esc(RA.LOCAL[L].label)}</span>` : `<span class="chip" title="Offline, ranks clear on structure checks and re-verify on Judge0 later">Offline: structure checks</span>`}<span class="chip">CI: ${esc(RA.CI_TOOLCHAINS[L])}</span></div></div>
    <div class="fluency" aria-label="Fluency ${n} of 12"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="trk"/><circle cx="60" cy="60" r="50" class="val" style="stroke-dasharray:${(n / 12) * 314} 314"/></svg><div><b>${n}</b>/12</div><span class="mut">fluency</span></div></div>
  ${n === 12 ? certificate(L) : ""}
  <div class="mlist">${list.map((m) => { const ok = unlocked(m), dn = isDone(m.id), meta = metaFor(m), ver = S.verified[m.id];
    return `<button class="mcard panel ${dn ? "done" : ""}" data-m="${m.id}" ${ok ? "" : "disabled"}><div><div class="mut tiny">RANK ${m.rank} // ${esc(m.module)}${m.rank === 12 ? " // CAPSTONE" : ""}</div><h3>${esc(m.title)}</h3><div class="mut">${esc(RA.brief(m, S.faction))}</div></div><div class="cstack"><span class="chip">${dn ? "CLEARED" : ok ? "+" + m.xp + " XP" : "LOCKED"}</span><span class="chip ${meta.ciOnly ? "ci" : ""}">${meta.ciOnly ? "GitHub Actions" : RA.LOCAL[m.lang] ? "Judge0 · on device" : "Judge0"}</span>${dn ? `<span class="chip ${ver === "judge0" || ver === "local" ? "ok" : ""}">${ver === "judge0" || ver === "local" ? "✓ " : ""}${verLabel(ver)}</span>` : ""}</div></button>`; }).join("")}</div></section></div>`;
  v.onclick = (e) => {
    const l = e.target.closest("[data-lang]")?.dataset.lang; if (l) { ui.lang = l; render(); return; }
    const m = e.target.closest("[data-m]")?.dataset.m; if (m) { ui.mission = m; render(); return; }
    const di = e.target.closest("[data-intel]")?.dataset.intel; if (di) { ui.view = "intel"; ui.intel = "languages"; ui.intelLang = di; render(); return; }
    if (e.target.closest("[data-cert]")) downloadCert(e.target.closest("[data-cert]").dataset.cert);
  };
}
const verLabel = (v) => ({ judge0: "verified · Judge0", local: "verified · on device", ci: "pending · GitHub Actions", offline: "structure only · re-verify online" }[v] || "structure only · re-verify online");

function certificate(L) {
  const pend = langMissions(L).filter((m) => S.verified[m.id] === "ci" || S.verified[m.id] === "offline").map((m) => m.id);
  return `<div class="panel cert"><p class="tiny acc">FLUENCY CERTIFIED</p><h2>${esc(RA.langs[L].name)}: all 12 ranks cleared</h2><p class="mut">Syntax through capstone, for ${esc(F().name)}. ${pend.length ? `Ranks ${pend.join(", ")} still need a green run in GitHub Actions to count as engine-verified.` : "Every checkpoint was verified by an external engine."}</p><button data-cert="${L}">Download certificate (SVG)</button></div>`;
}
function downloadCert(L) {
  const f = F(), col = f.color, name = RA.langs[L].name, date = new Date().toISOString().slice(0, 10);
  const rows = langMissions(L).map((m, i) => `<text x="80" y="${300 + i * 22}" font-size="14" fill="#c9f5d6">RANK ${String(m.rank).padStart(2, "0")}  ${esc(m.module)}  ·  ${esc(verLabel(S.verified[m.id]))}</text>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="620" viewBox="0 0 900 620" font-family="JetBrains Mono, monospace"><rect width="900" height="620" fill="#030806"/><rect x="20" y="20" width="860" height="580" fill="none" stroke="${col}" stroke-width="2"/><text x="80" y="100" font-size="18" fill="${col}" letter-spacing="6">ROOT//ACCESS · FLUENCY CERTIFIED</text><text x="80" y="170" font-size="54" fill="#eafff0" font-weight="700">${esc(name)}</text><text x="80" y="215" font-size="16" fill="#6f9c80">${esc(S.pet.name)}'s operator · ${esc(f.name)} · ${date}</text><text x="80" y="260" font-size="14" fill="#6f9c80">12 ranks, from syntax to capstone, graded by external test engines.</text>${rows}</svg>`;
  download(`rootaccess-${L}-certificate.svg`, new Blob([svg], { type: "image/svg+xml" }));
  toast("Certificate downloaded");
}

// ---------- mission ----------
const BOOT_INTRO = `<p>You don't need any coding experience. Each mission has the same parts:</p><ol class="steps"><li><b>Training</b> explains one idea in plain words, with a tiny example.</li><li><b>Objective</b> says exactly what your code must do.</li><li><b>Step by step</b> tells you what to type, one line at a time.</li><li>The <b>Terminal</b> on the right is where you type. Lines starting with <code>#</code> are notes for you; the computer skips them.</li><li><b>Requirements</b> tick green as you type the right pieces. When they're all green, press <b>Run checkpoints</b>: a real Python engine runs your code against tests (on this device once the offline pack is downloaded, otherwise on Judge0).</li><li>If a checkpoint fails, it tells you what it means. If you're stuck, the <b>hint ladder</b> goes from a nudge, to the answer's lines shuffled, to the full answer.</li></ol><p class="mut">Boot Camp uses Python because it reads closest to plain English. Everything you learn here (variables, decisions, loops, lists, functions, reading errors) carries over to every other language.</p>`;
function missionView(v, m) {
  if (!m) { ui.mission = null; return missions(v); }
  const code = S.code[m.id] ?? m.starter, meta = metaFor(m), P = RA.PRAXIS, stage = S.primm[m.id] || 0;
  const fails = S.fails[m.id] || 0, worked = fails >= P.fadeAfter || isDone(m.id);
  const prompt = P.selfExplain[(m.rank - 1) % P.selfExplain.length];
  const list = langMissions(m.lang), next = list[m.rank];
  const steps = RA.stepsFor(m), terms = RA.keyTerms(m, 6), sol = RA.SOLUTIONS[m.id] || "";
  let lastRep = null, pz = null;
  const seen = () => S.hints[m.id] || 0;
  const canFull = () => seen() >= 2 || (S.fails[m.id] || 0) >= P.fadeAfter || isDone(m.id);
  v.innerHTML = `<div class="mission"><div class="row"><button id="back">← ${esc(RA.langs[m.lang].name)} board</button>${next && isDone(m.id) ? `<button data-go="${next.id}">Next: rank ${next.rank} →</button>` : ""}</div>
  <div class="panel mhead"><p class="mut">${esc(RA.langs[m.lang].name.toUpperCase())} // RANK ${m.rank} OF 12 // ${esc(m.module)}</p><h1>${esc(m.title)}</h1><p><b class="acc">${esc(F().handler)}:</b> ${esc(RA.brief(m, S.faction))}</p></div>
  <div class="cols"><div class="panel lesson">
    <ol class="primm" aria-label="PRIMM stages">${P.stages.map((s, i) => `<li><button data-stage="${i}" class="${i === stage ? "on" : i < stage ? "past" : ""}">${s.name}</button></li>`).join("")}</ol>
    <p class="stagehint"><b class="acc">${P.stages[stage].name}.</b> ${esc(P.stages[stage].what)}</p>
    ${m.rank === 1 && RA.ORIENT[m.lang] ? `<details class="orientbox" open><summary>${m.lang === "basics" ? "Before you start: how this works" : `First time in ${esc(RA.langs[m.lang].name)}? Read this`}</summary>${m.lang === "basics" ? BOOT_INTRO : ""}${RA.orientHTML(m.lang)}</details>` : ""}
    <h3>Training: ${esc(m.concept)}</h3>${m.lesson}
    <div class="explain"><label for="note"><b>Self-explain:</b> ${esc(prompt)}</label><textarea id="note" rows="3" placeholder="Write it in your own words. Saved with your backup.">${esc(S.notes[m.id] || "")}</textarea></div>
    ${terms.length ? `<details class="terms" ${m.lang === "basics" ? "open" : ""}><summary>Key terms in this mission</summary><dl>${terms.map((t) => `<dt>${esc(t.term)}</dt><dd>${esc(t.def)}</dd>`).join("")}</dl></details>` : ""}
    <h3>Objective</h3><p>${m.task}</p>
    ${steps.length ? `<h3>Step by step</h3><ol class="steps" id="steps">${steps.map((x, i) => `<li data-step="${i}">${x}</li>`).join("")}</ol>` : ""}
    <p class="mut tiny">Stuck? Use the hint ladder under the editor: <b>1</b> points at your next move, <b>2</b> gives you the answer's lines to put in order, <b>3</b> shows the full answer for this mission.</p>
  </div>
  <div class="panel"><div class="row between"><h3>Terminal</h3><span class="mut tiny">Ctrl/Cmd+Enter runs · Esc then Tab leaves the editor</span></div>
    <textarea class="editor" id="ed" spellcheck="false" autocapitalize="off" aria-label="Code editor">${esc(code)}</textarea>
    <div class="row" style="margin:10px 0"><button class="primary" id="run">${meta.ciOnly ? "Check and queue for GitHub Actions" : "Run checkpoints"}</button><button id="struct">Check structure</button><button id="reset">Reset</button>${meta.ciOnly ? `<button id="export1">Export ${m.id}.${EXT[m.lang]}</button>` : ""}</div>
    <div class="req"><p class="tiny mut">REQUIREMENTS // update as you type</p><ul id="req"></ul></div>
    <div class="hintbar row"><span class="tiny mut">HINTS</span><button data-tier="1">1 · Next move</button><button data-tier="2">2 · Unscramble the answer</button><button data-tier="3">3 · Full answer</button></div>
    <div class="hintbox" id="hintbox" hidden></div>
    <div class="cplist" id="cps">${checkpointList(m, meta)}</div>
    <div class="term" id="out" aria-live="polite"><span class="mut">&gt; awaiting input_</span></div></div></div></div>`;
  const ed = $("#ed"), out = $("#out");
  let tabOut = false; // Esc releases Tab so keyboard users can leave the editor
  ed.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { tabOut = true; return; }
    if (e.key === "Tab" && tabOut) { tabOut = false; return; }
    tabOut = false;
    if (e.key === "Tab") { e.preventDefault(); const s = ed.selectionStart; ed.setRangeText("    ", s, ed.selectionEnd, "end"); }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") $("#run").click();
  });
  const reqs = () => {
    const r = RA.requirements(m, ed.value), done = r.filter((x) => x.ok).length;
    $("#req").innerHTML = r.map((x) => `<li class="${x.ok ? "ok" : ""}">${x.ok ? "✓" : "○"} ${esc(x.hint)}</li>`).join("") + `<li class="tiny mut">${done}/${r.length} in place${done === r.length ? ". Run the checkpoints." : ""}</li>`;
  };
  const tierBtns = () => v.querySelectorAll("[data-tier]").forEach((b) => {
    const t = +b.dataset.tier, lock = (t === 2 && seen() < 1) || (t === 3 && !canFull());
    b.disabled = lock; b.classList.toggle("on", seen() >= t);
    b.title = lock ? (t === 2 ? "Try hint 1 first" : `Unlocks after hint 2, or after ${P.fadeAfter} failed runs`) : "";
  });
  const showHint = (t) => {
    const h = RA.hint(m, ed.value, lastRep, t, sol), box = $("#hintbox");
    if (t > seen()) { S.hints[m.id] = t; save(); }
    box.hidden = false;
    v.querySelectorAll("#steps li").forEach((li) => li.classList.toggle("on", h.step != null && +li.dataset.step === h.step));
    let body = `<p class="tiny acc">HINT ${t}/3 // ${esc(h.title)}</p><p>${h.html}</p>`;
    if (h.kind === "parsons") {
      pz = { pool: h.lines.map((x, i) => ({ x, i })), picked: [], answer: h.answer, pieces: h.pieces };
      body += `<div class="pz"><p class="tiny mut">Tap ${h.pieces ? "pieces" : "lines"} in the order they belong. Tap a placed one to send it back.</p><ol class="pzans" id="pzans"></ol><div class="pzpool" id="pzpool"></div><div class="row"><button id="pzcheck" class="primary">Check order</button><button id="pzclear">Start over</button></div><p id="pzmsg"></p></div>`;
    }
    if (h.kind === "solution") body += `<pre>${esc(h.code)}</pre><p class="mut">Studying a worked example and then explaining it is one of the best-supported ways to learn to code (${cite("worked")}). Close this, then write it yourself.</p><div class="row"><button id="hidehint">Close and type it myself</button></div>`;
    box.innerHTML = body; tierBtns();
    if (h.kind === "parsons") drawPz();
    if ($("#hidehint")) $("#hidehint").onclick = () => { box.hidden = true; ed.focus(); };
  };
  function drawPz() {
    const row = (o) => `<button class="pzl ${pz.pieces ? "pc" : ""}" data-pi="${o.i}">${esc(o.x)}</button>`;
    $("#pzans").innerHTML = pz.picked.map((o) => `<li>${row(o)}</li>`).join("");
    $("#pzpool").innerHTML = pz.pool.map(row).join("") || '<span class="tiny mut">All placed. Check the order.</span>';
    $("#pzpool").onclick = (e) => { const b = e.target.closest("[data-pi]"); if (!b) return; const k = pz.pool.findIndex((o) => o.i === +b.dataset.pi); pz.picked.push(pz.pool.splice(k, 1)[0]); drawPz(); };
    $("#pzans").onclick = (e) => { const b = e.target.closest("[data-pi]"); if (!b) return; const k = pz.picked.findIndex((o) => o.i === +b.dataset.pi); pz.pool.push(pz.picked.splice(k, 1)[0]); drawPz(); };
    $("#pzclear").onclick = () => { pz.pool = pz.pool.concat(pz.picked); pz.picked = []; drawPz(); $("#pzmsg").textContent = ""; };
    $("#pzcheck").onclick = () => {
      const got = pz.picked.map((o) => o.x), bad = pz.answer.findIndex((x, i) => got[i] !== x), msg = $("#pzmsg");
      if (got.length === pz.answer.length && bad < 0) {
        msg.innerHTML = `<span class="ok">Correct order.</span> Now type it into the editor yourself${pz.pieces ? " (as one line)" : ", keeping the indentation"}. Or <button id="pzuse">put it in the editor</button>`;
        $("#pzuse").onclick = () => { ed.value = pz.pieces ? RA.joinPieces(got) : got.join("\n"); S.code[m.id] = ed.value; save(); reqs(); toast("Placed in the editor. Run the checkpoints."); };
      } else if (bad >= got.length) msg.innerHTML = `<span class="mut">So far so good: the first ${got.length} are right. Keep going.</span>`;
      else msg.innerHTML = `<span class="bad">Not yet.</span> The first ${bad} ${bad === 1 ? "is" : "are"} right; number ${bad + 1} is out of place.`;
    };
  }
  v.querySelectorAll("[data-tier]").forEach((b) => (b.onclick = () => showHint(+b.dataset.tier)));
  reqs(); tierBtns();
  ed.addEventListener("input", () => { S.code[m.id] = ed.value; save(); reqs(); });
  $("#note").addEventListener("input", (e) => { S.notes[m.id] = e.target.value; save(); });
  $("#back").onclick = () => { ui.mission = null; render(); };
  $("#reset").onclick = () => { ed.value = m.starter; S.code[m.id] = m.starter; save(); reqs(); out.innerHTML = '<span class="mut">&gt; reset to starter code</span>'; };
  if ($("#export1")) $("#export1").onclick = () => { download(`${m.id}.${EXT[m.lang]}`, new Blob([ed.value], { type: "text/plain" })); toast(`Commit it to submissions/ in your repo`); };
  v.querySelectorAll("[data-stage]").forEach((b) => (b.onclick = () => { S.primm[m.id] = +b.dataset.stage; save(); missionView(v, m); }));
  const go = v.querySelector("[data-go]"); if (go) go.onclick = () => { ui.mission = go.dataset.go; render(); };
  const advance = (i) => {
    if ((S.primm[m.id] || 0) >= i) return;
    S.primm[m.id] = i; save();
    v.querySelectorAll("[data-stage]").forEach((b) => { const k = +b.dataset.stage; b.className = k === i ? "on" : k < i ? "past" : ""; });
    v.querySelector(".stagehint").innerHTML = `<b class="acc">${P.stages[i].name}.</b> ${esc(P.stages[i].what)}`;
  };
  ed.addEventListener("focus", () => advance(3), { once: true });

  const structure = () => {
    const src = ed.value, lines = []; let pass = true;
    m.checks.forEach((c) => { const ok = c.re.test(src); pass = pass && ok; lines.push(`<span class="${ok ? "ok" : "bad"}">${ok ? "[✓]" : "[✗]"}</span> ${esc(c.hint)}`); });
    return { pass, lines };
  };
  $("#struct").onclick = () => { const s = structure(); out.innerHTML = `<span class="mut">STRUCTURE // pattern checks, offline</span>\n` + s.lines.join("\n"); };
  $("#run").onclick = async () => {
    const btn = $("#run"), s = structure(), code = ed.value;
    advance(4);
    if (!s.pass) { fail(); out.innerHTML = `<span class="mut">STRUCTURE</span>\n${s.lines.join("\n")}\n\n<span class="bad">Fix the red lines first.</span> Checkpoints only run once the required pieces are present. The Requirements list shows what's missing, and hint 1 points at the step that covers it.`; return; }
    if (meta.ciOnly) {
      out.innerHTML = `<span class="mut">STRUCTURE</span>\n${s.lines.join("\n")}\n\n<span class="acc">QUEUED FOR GITHUB ACTIONS.</span> ${esc(meta.ciOnly)}\nExport this file (or all submissions from Backup), commit it to <code>submissions/</code>, and the checkpoints workflow grades it on ${esc(RA.CI_TOOLCHAINS[m.lang])}.`;
      clear("ci"); return;
    }
    btn.disabled = true;
    const say = (msg) => { btn.textContent = msg; out.innerHTML = `<span class="mut">&gt; ${esc(msg)}</span>`; };
    let r;
    try { r = await checkpoints(m, code, say); } finally { btn.disabled = false; btn.textContent = "Run checkpoints"; }
    if (r.offline) {
      if (S.settings.offlineClears) {
        out.innerHTML = `<span class="mut">STRUCTURE</span>\n${s.lines.join("\n")}\n\n<span class="acc">NO ENGINE REACHABLE</span> <span class="mut">(${esc(r.reason)})</span>\nThe required pieces are all present, so this rank clears as <b>structure only</b> and the next one unlocks. It re-runs on real checkpoints when you're back online (Settings → Offline).`;
        clear("offline");
      } else {
        out.innerHTML = `<span class="bad">No engine reachable</span> (${esc(r.reason)}). The public Judge0 is rate-limited: wait a minute, add your own host under Settings → Engines${RA.LOCAL[m.lang] ? ", or download this track's offline pack under Settings → Offline" : ""}.\n\n<span class="mut">Structure checks passed, so you can also export this file and verify it in GitHub Actions.</span>`;
      }
      return;
    }
    const rep = r.rep, how = r.how;
    lastRep = rep;
    $("#cps").innerHTML = checkpointList(m, meta, rep.results);
    const ok = RA.allPassed(rep);
    const lines = rep.results.map((r) => `<span class="${r.status === "PASS" ? "ok" : r.status === "SKIP" ? "mut" : "bad"}">${r.status === "PASS" ? "[✓]" : r.status === "SKIP" ? "[~]" : "[✗]"}</span> ${esc(r.label)}${r.status !== "PASS" && r.detail ? ` <span class="mut">— ${esc(r.detail)}</span>` : ""}`);
    const user = (rep.stdout || "").split("\n").filter((l) => l && !/::cp::/.test(l)).slice(0, 12).join("\n");
    out.innerHTML = `<span class="mut">${how === "local" ? "ON DEVICE" : "ENGINE"} // ${esc(rep.engine || RA.ENGINES[m.lang].label)}${rep.time ? " · " + rep.time + "s" : ""}</span>\n${lines.join("\n")}${user ? `\n\n<span class="mut">stdout</span>\n${esc(user)}` : ""}${rep.stderr && !ok ? `\n\n<span class="mut">stderr</span>\n${esc(rep.stderr.slice(0, 600))}` : ""}`;
    if (ok) clear(how); else { fail(); out.insertAdjacentHTML("beforeend", `\n\n<span class="bad">ACCESS DENIED.</span> Each failing checkpoint above has a plain-English explanation. Fix the first one and run again.`); }
  };
  function fail() {
    S.fails[m.id] = (S.fails[m.id] || 0) + 1; save();
    if (S.fails[m.id] === P.fadeAfter) toast("Hint 3, the full answer, is now unlocked");
    tierBtns();
  }
  function clear(how) {
    const first = !isDone(m.id), rankBefore = level();
    const better = { offline: 0, ci: 1, local: 2, judge0: 3 };
    if (!S.verified[m.id] || better[how] > better[S.verified[m.id]]) S.verified[m.id] = how;
    if (first) {
      S.done.push(m.id); S.xp += m.xp;
      S.pet.energy = Math.min(100, S.pet.energy + 15); S.pet.bond = Math.min(100, S.pet.bond + 6);
      snapshot(`Cleared ${m.id}: ${m.title}`);
    }
    save();
    const msg = first ? (level() > rankBefore ? `LEVEL ${level()}: your pet is evolving` : `+${m.xp} XP`) : "Already cleared";
    toast(fluency(m.lang) === 12 && first ? `${RA.langs[m.lang].name} fluency complete` : msg);
    out.insertAdjacentHTML("beforeend", `\n\n<span class="ok">ACCESS GRANTED.</span> ${first ? `+${m.xp} XP. Rank ${m.rank + 1 <= 12 ? m.rank + 1 + " unlocked." : "12 complete: certificate issued."}` : ""} ${how === "ci" ? "Marked pending until GitHub Actions goes green." : how === "offline" ? "Structure only for now: it re-verifies automatically when you're back online." : ""}`);
    const row = $(".row"); if (first && next && !v.querySelector("[data-go]")) { row.insertAdjacentHTML("beforeend", `<button data-go="${next.id}">Next: rank ${next.rank} →</button>`); row.querySelector("[data-go]").onclick = () => { ui.mission = next.id; render(); }; }
  }
}
function checkpointList(m, meta, results) {
  const labels = results ? results.map((r) => r.label) : meta.checkpoints.length ? ["Compiles", ...meta.checkpoints] : [];
  const where = meta.ciOnly ? `<b>GitHub Actions</b> · ${esc(RA.CI_TOOLCHAINS[m.lang])}` : `<b>Judge0</b> · ${esc(RA.ENGINES[m.lang].label)} <span class="mut">(also re-run in GitHub Actions on ${esc(RA.CI_TOOLCHAINS[m.lang])})</span>`;
  if (!labels.length) return `<p class="tiny">${where}</p><p class="mut tiny">Checkpoints are the mission's test cases. They appear after the first run.</p>`;
  const st = (l) => (results ? results.find((r) => r.label === l).status : "");
  return `<p class="tiny">${where}</p><ul>${labels.filter((l, i, a) => a.indexOf(l) === i).filter((l) => !(l === "Compiles" && ["basics", "python", "javascript", "sql", "bash"].includes(m.lang))).map((l) => `<li class="${st(l) === "PASS" ? "ok" : st(l) === "FAIL" ? "bad" : ""}">${st(l) === "PASS" ? "✓" : st(l) === "FAIL" ? "✗" : "○"} ${esc(l)}${st(l) === "FAIL" ? `<div class="why"><b>What this means:</b> ${RA.explain(m, results.find((r) => r.label === l))}</div>` : ""}</li>`).join("")}</ul>${meta.ciOnly ? `<p class="mut tiny">${esc(meta.ciOnly)}</p>` : ""}`;
}
function judgeCfg() {
  const st = S.settings, headers = {};
  if (st.token) headers[st.tokenHeader || "X-Auth-Token"] = st.token;
  return { hosts: { ce: st.ce || RA.judge0Hosts.ce, extra: st.extra || RA.judge0Hosts.extra }, headers, timeout: 60000 };
}
// Picks where checkpoints run (Settings → Engines → mode) and falls back in order:
//   auto:   on device if its pack is ready, else Judge0, else on device (downloading the pack if online)
//   judge0: Judge0, then on device
//   device: on device only, so your code never leaves this machine
// Returns { rep, how: "judge0" | "local" } or { offline: true, reason } when nothing could run it.
async function checkpoints(m, code, say) {
  const mode = S.settings.mode, hasLocal = !!(RL && RL.has(m.lang));
  const ready = hasLocal && (await RL.ready(m.lang)), possible = hasLocal && (ready || online);
  const order = [];
  if (mode === "device") { if (possible) order.push("local"); }
  else if (mode === "judge0") { if (online) order.push("judge0"); if (possible) order.push("local"); }
  else { if (ready) order.push("local"); if (online) order.push("judge0"); if (!ready && possible) order.push("local"); }
  const errors = [];
  for (const how of order) {
    try {
      if (how === "judge0") { say(`Running on ${RA.ENGINES[m.lang].label}…`); return { rep: await RA.runJudge0(m, code, judgeCfg()), how }; }
      say(ready ? "Running on this device…" : "Fetching the on-device runtime (first time only)…");
      return { rep: await RL.run(m, code, (ph) => say(ph === "loading" ? "Starting the on-device runtime…" : "Running on this device…")), how };
    } catch (e) { errors.push((how === "judge0" ? "Judge0: " : "on device: ") + e.message); }
  }
  return { offline: true, reason: errors.length ? errors.join("; ")
    : !online ? "you're offline" + (hasLocal ? " and this track's offline pack isn't downloaded" : "")
    : mode === "device" ? "on-device only mode, and this language has no on-device runner" : "no engine available" };
}
// Ranks cleared on structure checks alone (offline), waiting for a real run.
const pendingVerify = () => RA.missions.filter((m) => isDone(m.id) && S.verified[m.id] === "offline" && !metaFor(m).ciOnly && S.code[m.id]);
let reverifying = false;
const reverifyFailed = new Set(); // this session only: don't keep re-sending code that already failed
async function reverify(auto, onStep) {
  if (reverifying) return null;
  reverifying = true;
  const list = pendingVerify().filter((m) => !(auto && reverifyFailed.has(m.id)));
  const res = { ok: [], failed: [], skipped: [] };
  try {
    for (const m of list) {
      onStep && onStep(m, res);
      const r = await checkpoints(m, S.code[m.id], () => {});
      if (r.offline) res.skipped.push(m.id);
      else if (RA.allPassed(r.rep)) { S.verified[m.id] = r.how; res.ok.push(m.id); save(); }
      else { res.failed.push(m.id); reverifyFailed.add(m.id); }
      if (r.how === "judge0") await new Promise((ok) => setTimeout(ok, 1500)); // go easy on the public instance
    }
  } finally { reverifying = false; }
  if (res.ok.length || !auto) toast(`Re-verified ${res.ok.length}/${list.length}${res.failed.length ? ` · ${res.failed.length} need fixes` : ""}${res.skipped.length ? ` · ${res.skipped.length} still offline` : ""}`);
  hud();
  return res;
}

// ---------- intel ----------
function intel(v) {
  const tabs = [["languages", "Language dossiers"], ["method", "How you learn here"], ["engines", "Test engines"], ["incidents", "Incident archive"]];
  let body = "";
  if (ui.intel === "languages") {
    const L = RA.DOSSIERS[ui.intelLang] ? ui.intelLang : "python", D = RA.DOSSIERS[L], lang = RA.langs[L];
    body = `<div class="row langtabs">${LANGS12.map((k) => `<button data-il="${k}" class="${k === L ? "on" : ""}">${esc(RA.langs[k].name)}</button>`).join("")}</div>
    <div class="dossier"><div class="panel"><p class="tiny acc">DOSSIER // ${esc(lang.tag)}</p><h2>${esc(lang.name)}</h2><p class="lead">${esc(D.tagline)}</p>
      <div class="stats">${D.stats.map(([k, val, s]) => `<div><b>${esc(val)}</b><span>${esc(k)}</span><a class="tiny" href="${src(s)?.url}" target="_blank" rel="noopener">${esc(src(s)?.label || "")}</a></div>`).join("")}</div>
      <h3>Relevance</h3><p>${esc(D.relevance)}</p><p class="tiny mut">Sources: ${D.relSrc.map(cite).join(" · ")}</p></div>
      <div class="two"><div class="panel"><h3 class="ok">Strengths</h3><ul>${D.pros.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div class="panel"><h3 class="bad">Trade-offs</h3><ul>${D.cons.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
      <div class="panel"><h3>Use it for</h3><ul>${D.bestFor.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div class="panel"><h3>Reach for something else when</h3><ul>${D.avoid.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
      <div class="panel"><h3>Official learning path</h3><p>${D.learn.map(cite).join(" · ")}</p><p class="mut">${esc(D.next)}</p>
      <h3>Your ${esc(lang.name)} path</h3><ol class="path">${langMissions(L).map((m) => `<li class="${isDone(m.id) ? "ok" : ""}">${esc(m.module)}: ${esc(m.title)}</li>`).join("")}</ol></div></div>`;
  } else if (ui.intel === "method") {
    const P = RA.PRAXIS;
    body = `<div class="panel"><h2>The teaching method</h2><p>Every mission follows <b>PRIMM</b>: Predict, Run, Investigate, Modify, Make. You read and predict code before you write it, explain it in your own words, then build your own version that has to pass checkpoints on a real compiler.</p>
      <ol class="stages">${P.stages.map((s) => `<li><b>${s.name}</b> <span class="mut">${esc(s.what)}</span></li>`).join("")}</ol>
      <p>Each of the 12 ranks per language is a module (${RA.MODULES.map(esc).join(", ")}), so finishing rank 12 means you've used the language end to end: syntax, data modeling, errors, the standard library, generics, concurrency, testing and a capstone. </p>
      <h3>Starting from zero</h3><p><b>Boot Camp</b> comes first: 12 Python missions for people who have never coded, from printing one line to a small capstone, with a "Read the Error" mission that teaches you to fix broken code. Every language's rank 1 opens with a primer on how that language runs, prints, comments and trips people up.</p>
      <h3>Help that's linked to the mission</h3><ul><li><b>Step by step:</b> every mission lists numbered steps that match its objective.</li><li><b>Requirements</b> tick green as you type, so you know what's still missing before you run anything.</li><li><b>Explained checkpoints:</b> when a test fails, you see what it got, what it wanted and what that usually means.</li><li><b>Hint ladder:</b> 1 points at your next move (the missing requirement and the step that covers it, or the first failing checkpoint), 2 gives you the lines of the answer shuffled to put in order (a Parsons problem, ${cite("parsons")}), 3 shows the full reference answer for that exact mission. The full answer also unlocks after ${P.fadeAfter} failed runs.</li></ul></div>
      <div class="panel"><h3>Why it's built this way</h3><ul>${P.evidence.map((e) => `<li>${esc(e.claim)} <span class="tiny">(${cite(e.src)})</span></li>`).join("")}</ul></div>`;
  } else if (ui.intel === "engines") {
    const rows = LANG_ORDER.map((L) => { const ms = langMissions(L), ci = ms.filter((m) => metaFor(m).ciOnly).map((m) => m.rank);
      return `<tr><td>${esc(RA.langs[L].name)}</td><td>${esc(RA.ENGINES[L].label)}</td><td>${esc(RA.CI_TOOLCHAINS[L])}</td><td>${ci.length ? (ci.length > 1 ? "Ranks " : "Rank ") + ci.join(", ") : "None"}</td></tr>`; }).join("");
    body = `<div class="panel"><h2>Where your code runs</h2><p>Checkpoints are real programs: your code is compiled together with a test harness and run on an external engine. Each harness prints one line per checkpoint, and the app reads those lines. Nothing is graded by pattern matching alone.</p>
      <ul><li><b>Judge0, live from the browser.</b> The free public instances at <a href="https://ce.judge0.com/" target="_blank" rel="noopener">ce.judge0.com</a> and extra-ce.judge0.com run 11 of the 12 toolchains, with C# on the extra instance. They're rate-limited, so you can plug in your own host or key under Engines. Judge0 is open source and self-hostable (<a href="https://github.com/judge0/judge0/" target="_blank" rel="noopener">github.com/judge0/judge0</a>).</li>
      <li><b>GitHub Actions, the authoritative run.</b> The repo's <code>checkpoints</code> workflow re-runs every harness on current toolchains (Swift on macOS, JDK 25, .NET 10, Kotlin 2 with coroutines, g++ 14). It also checks that every starter fails, and grades anything you commit to <code>submissions/</code>.</li></ul>
      <p class="mut">Some ranks need features Judge0's images don't have, like virtual threads, Swift Testing, SwiftUI, coroutines and Compose. Those are marked GitHub Actions and are graded there.</p>
      <div class="tablewrap"><table><thead><tr><th>Language</th><th>Judge0</th><th>GitHub Actions</th><th>CI-only ranks</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  } else {
    body = `<div class="panel"><h2>Incident archive</h2><p class="mut">Real incidents the missions are built around, summarized for training. ${esc(F().lore)}</p>
      <div class="row"><span class="mut">Defect to:</span>${Object.entries(RA.FACTIONS).map(([k, f]) => `<button data-f="${k}" ${k === S.faction ? "disabled" : ""}>${f.short}</button>`).join("")}</div></div>
      <div class="intel">${[...RA.INTEL].sort((a, b) => a.year - b.year).map((i) => `<div class="panel"><span class="chip">${i.year}</span><h3 style="margin-top:8px">${esc(i.name)}</h3><p class="mut">${esc(i.note)}</p></div>`).join("")}</div>`;
  }
  v.innerHTML = `<div class="row tabs">${tabs.map(([k, t]) => `<button data-it="${k}" class="${k === ui.intel ? "on" : ""}">${t}</button>`).join("")}</div>${body}`;
  v.onclick = (e) => {
    const t = e.target.closest("[data-it]")?.dataset.it; if (t) { ui.intel = t; render(); return; }
    const il = e.target.closest("[data-il]")?.dataset.il; if (il) { ui.intelLang = il; render(); return; }
    const f = e.target.closest("[data-f]")?.dataset.f; if (f) { snapshot("Before defecting"); S.faction = f; save(); toast(`You now work for ${RA.FACTIONS[f].name}`); render(); }
  };
}

// ---------- pet ----------
const stage = () => RA.PET_STAGES[RA.petStage(level())];
const petCtx = () => ({ level: level(), fluent: LANGS12.filter((L) => fluency(L) === 12).length, faction: S.faction });
const PET_TABS = [["color", "Core colour"], ["trim", "Trim colour"], ["shape", "Body"], ["eyes", "Optics"], ["mouth", "Mouth"], ["markings", "Markings"], ["crown", "Crown"], ["accessory", "Accessory"], ["aura", "Aura"]];
let petTab = "look";
function pet(v) {
  const p = S.pet, lv = level(), st = stage(), si = RA.petStage(lv), next = RA.PET_STAGES[si + 1], ctx = petCtx();
  const fluent = LANGS12.filter((L) => fluency(L) === 12);
  const total = RA.PET_KEYS.reduce((n, k) => n + RA.PET_PARTS[k].length, 0), open = RA.PET_KEYS.reduce((n, k) => n + RA.PET_PARTS[k].filter((o) => !RA.petLock(o, ctx)).length, 0);
  const sw = (o) => (o.val ? `<span class="swatch" style="background:${o.val}"></span> ` : "");
  const opts = (key, label) => `<h3>${label}</h3><div class="opts">${RA.PET_PARTS[key].map((o) => { const lock = RA.petLock(o, ctx);
    return `<button data-k="${key}" data-v="${o.id}" class="${p[key] === o.id ? "on" : ""}" ${lock ? "disabled" : ""} aria-pressed="${p[key] === o.id}">${sw(o)}${esc(o.label)}${lock ? ` <span class="lock">${esc(lock)}</span>` : ""}</button>`; }).join("")}</div>`;
  const look = `<p class="mut">FORM ${si + 1}/${RA.PET_STAGES.length}</p><h2>${st.name}</h2><p>${st.desc}</p>
    <p class="mut">${next ? `Next evolution: <b class="acc">${next.name}</b> at level ${next.lvl}. Parts unlock with your level, with languages you take to fluency, and with your faction.` : "Final form reached. It knows what you know."} <b>${open}/${total}</b> parts unlocked.</p>
    <div class="row"><button id="randomize">Randomize (unlocked parts)</button><button id="resetLook">Reset look</button></div>
    ${PET_TABS.map(([k, l]) => opts(k, l)).join("")}`;
  v.innerHTML = `<div class="pet"><div class="panel"><div class="petstage">${RA.petSVG(p, si, { animate: !reduceMotion() })}</div>
    <div class="row" style="margin-top:12px"><input id="pname" value="${esc(p.name)}" maxlength="16" aria-label="Pet name" class="field" style="flex:1"><button id="feed">Feed a commit</button></div>
    <div class="stat"><span>Energy</span><div class="bar"><i style="width:${p.energy}%"></i></div></div>
    <div class="stat"><span>Bond</span><div class="bar"><i style="width:${p.bond}%"></i></div></div>
    <h3 style="margin-top:14px">Languages it speaks</h3><div class="glyphs">${LANGS12.map((L) => `<span class="chip ${fluency(L) === 12 ? "ok" : ""}" title="${RA.langs[L].name}: ${fluency(L)}/12">${fluency(L) === 12 ? "✓ " : ""}${RA.langs[L].tag} ${fluency(L)}</span>`).join("")}</div>
    <p class="mut tiny" style="margin-top:10px">Cleared ${S.done.length}/${RA.missions.length} · Fluent in ${fluent.length}/12</p></div>
  <div class="panel"><div class="row tabs"><button data-pt="look" class="${petTab === "look" ? "on" : ""}">Look</button><button data-pt="persona" class="${petTab === "persona" ? "on" : ""}">Personality</button></div><div id="pettab">${petTab === "look" ? look : ""}</div></div></div>`;
  if (petTab === "persona") personaPanel($("#pettab"));
  v.onclick = (e) => {
    const t = e.target.closest("[data-pt]")?.dataset.pt; if (t) { petTab = t; render(); return; }
    const b = e.target.closest("[data-k]"); if (b && !b.disabled) { p[b.dataset.k] = b.dataset.v; save(); render(); return; }
    if (e.target.id === "randomize") {
      RA.PET_KEYS.forEach((k) => { const ok = RA.PET_PARTS[k].filter((o) => !RA.petLock(o, ctx)); p[k] = ok[(Math.random() * ok.length) | 0].id; });
      save(); render(); toast(`${p.name} has a new look`);
    }
    if (e.target.id === "resetLook") { RA.PET_KEYS.forEach((k) => (p[k] = RA.PET_DEFAULTS[k])); save(); render(); }
    if (e.target.id === "feed") { if (p.energy >= 100) toast(`${p.name} is full. Go clear a mission.`); else { p.energy = Math.min(100, p.energy + 5); p.bond = Math.min(100, p.bond + 1); save(); render(); toast(`${p.name} ate a commit`); } }
  };
  $("#pname").onchange = (e) => { p.name = e.target.value.trim() || "NULL"; save(); render(); };
}

// Personality: generated from the pet and your real progress (RA.persona), with your overrides in S.pet.persona.
function personaPanel(el) {
  const ov = S.pet.persona = S.pet.persona || {}, P = RA.persona(S), slug = (S.pet.name || "pet").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  el.innerHTML = `<p class="tiny acc">PERSONALITY // ${esc(P.format)} v${P.version}</p><h2>${esc(P.archetype)}</h2><p>${esc(P.summary)}</p>
    <div class="cols"><div>
      <h3>Traits</h3><p class="mut tiny">Generated from how you play: bond, energy, the languages you've touched, how often you verify on a real engine, how often you use hints, and the parts you picked. Drag to override; <b>auto</b> ones follow your progress.</p>
      ${P.traitScale.labels.map((t) => `<label class="lbl">${esc(t.label)}: <b>${P.traits[t.id]}</b> ${ov.traits && ov.traits[t.id] != null ? `<button class="tiny" data-auto="${t.id}">auto</button>` : `<span class="tiny mut">auto</span>`}<span class="tiny mut" style="float:right">${esc(t.low)} ↔ ${esc(t.high)}</span><input type="range" min="0" max="100" value="${P.traits[t.id]}" data-trait="${t.id}" aria-label="${esc(t.label)}"></label>`).join("")}
    </div><div>
      <h3>Voice</h3>
      <label class="lbl">Archetype<input class="field" id="pArch" value="${esc(ov.archetype || "")}" placeholder="${esc(P.archetype)}" maxlength="40"></label>
      <label class="lbl">Greeting<input class="field" id="pGreet" value="${esc(ov.greeting || "")}" placeholder="${esc(P.voice.greeting)}" maxlength="120"></label>
      <label class="lbl">Pronouns<input class="field" id="pPro" value="${esc(ov.pronouns || "")}" placeholder="it/its" maxlength="20"></label>
      <p><b>Tone:</b> ${P.voice.tone.map(esc).join(", ")}</p><p><b>Sign-off:</b> “${esc(P.voice.signoff)}”</p>
      <p><b>Catchphrases:</b></p><ul>${P.voice.catchphrases.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
      ${P.voice.quirks.length ? `<p><b>Quirks:</b></p><ul>${P.voice.quirks.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>` : ""}
    </div></div>
    <div class="row" style="margin-top:12px"><button id="reroll">Reroll</button><button id="resetPersona">Reset to generated</button></div>
    <h3 style="margin-top:16px">Take it with you</h3>
    <p class="mut">The <b>.persona.json</b> file is an open format for assistants: personality, voice, knowledge, avatar and a ready system prompt, plus empty <code>capabilities</code>, <code>connectors</code> and <code>extensions</code> slots that future programs can fill in. The <b>card</b> is the same thing as plain Markdown for chat tools. Spec: <a href="persona.schema.json" target="_blank" rel="noopener">persona.schema.json</a>.</p>
    <div class="row"><button class="primary" id="dlPersona">Download ${esc(slug)}.persona.json</button><button id="dlCard">Download card (.md)</button><button id="cpPrompt">Copy system prompt</button></div>
    <details class="worked"><summary>System prompt preview</summary><pre style="white-space:pre-wrap">${esc(P.prompt.system)}</pre></details>`;
  const commit = () => { save(); personaPanel(el); };
  el.oninput = (e) => { const t = e.target.dataset.trait; if (t) e.target.closest("label").querySelector("b").textContent = e.target.value; };
  el.onchange = (e) => {
    const t = e.target.dataset.trait;
    if (t) { ov.traits = Object.assign({}, ov.traits, { [t]: +e.target.value }); commit(); }
    const map = { pArch: "archetype", pGreet: "greeting", pPro: "pronouns" }[e.target.id];
    if (map) { const val = e.target.value.trim(); if (val) ov[map] = val; else delete ov[map]; commit(); }
  };
  el.onclick = async (e) => {
    const a = e.target.dataset.auto; if (a) { delete ov.traits[a]; commit(); return; }
    if (e.target.id === "reroll") { ov.seed = (ov.seed || 0) + 1; commit(); toast("New personality mix"); }
    if (e.target.id === "resetPersona") { S.pet.persona = {}; save(); personaPanel(el); toast("Back to the generated personality"); }
    if (e.target.id === "dlPersona") { download(`${slug}.persona.json`, new Blob([JSON.stringify(RA.persona(S), null, 2)], { type: "application/json" })); toast("Personality downloaded"); }
    if (e.target.id === "dlCard") { download(`${slug}.persona.md`, new Blob([RA.personaCard(RA.persona(S))], { type: "text/markdown" })); toast("Card downloaded"); }
    if (e.target.id === "cpPrompt") { try { await navigator.clipboard.writeText(RA.persona(S).prompt.system); toast("System prompt copied"); } catch (err) { toast("Couldn't copy; use the preview below"); } }
  };
}

// ---------- backup ----------
function backup(v) {
  let snaps = []; try { snaps = JSON.parse(store.get(SNAP)) || []; } catch (e) {}
  // Backups leave out your Judge0 token, so a shared save never leaks a key. Restoring keeps the token you have here.
  const json = JSON.stringify(Object.assign({}, S, { settings: Object.assign({}, S.settings, { token: "" }) }), null, 2);
  const subs = RA.missions.filter((m) => S.code[m.id] && S.code[m.id] !== m.starter);
  v.innerHTML = `${S.faction ? "" : `<div class="row" style="margin-bottom:12px"><button id="toIntro">← Back to the intro</button></div>`}<div class="cols"><div class="panel"><h2>Back up your save</h2><p class="mut">${store.persistent ? `<b class="acc">Saved in this browser</b> on every change, and it works offline. Back up to move to another device or browser, or into the Swift Playgrounds app (same format). Clearing site data erases it.` : `<b class="bad">This browser is blocking storage</b> (private window or site data turned off), so progress lasts only until you close the tab. Download a backup before you leave.`} Your Judge0 token is left out of backups.</p>
    <div class="row"><button class="primary" id="dl">Download .json</button><button id="cp">Copy to clipboard</button></div>
    <textarea class="backup" id="bx" readonly>${esc(json)}</textarea>
    <h2 style="margin-top:20px">Export submissions</h2><p class="mut">${subs.length} mission file${subs.length === 1 ? "" : "s"} with your code. Unzip into <code>submissions/</code> in your copy of the repo and push: the <code>checkpoints</code> workflow grades every file on current toolchains, including the ranks Judge0 can't run.</p>
    <div class="row"><button id="zip" ${subs.length ? "" : "disabled"}>Download submissions.zip</button></div></div>
  <div class="panel"><h2>Restore</h2><p class="mut">Load a backup file or paste the JSON. Your current progress is snapshotted first, so a restore can be undone. Saves from the first version of the game are upgraded automatically.</p>
    <div class="row"><label class="chip filebtn">Choose file<input type="file" id="file" accept=".json,application/json" hidden></label></div>
    <textarea class="backup" id="paste" placeholder="Paste backup JSON here"></textarea>
    <div class="row" style="margin-top:8px"><button class="primary" id="imp">Restore pasted save</button><button id="wipe">Start over</button></div>
    <h3 style="margin-top:18px">Auto snapshots</h3><p class="mut">Taken after every cleared mission, plus before restores and defections.</p>
    <div class="mlist">${snaps.length ? snaps.map((s, i) => `<div class="row panel between snap"><span>${esc(s.label)}<br><span class="mut">${new Date(s.at).toLocaleString()} · ${s.data.xp} XP</span></span><button data-snap="${i}">Restore</button></div>`).join("") : `<p class="mut">No snapshots yet. Clear a mission.</p>`}</div></div></div>`;
  const restore = (d, label) => {
    if (!d || d.format !== "rootaccess-save") return toast("That doesn't look like a ROOT//ACCESS save");
    const token = S.settings.token;
    snapshot("Before " + label); S = migrate(d); if (!S.faction) S.faction = "sentinel";
    if (!S.settings.token && token) S.settings.token = token;
    applyPrefs(); save();
    const lost = (S.legacy.done || []).length; toast(lost ? `Save restored. ${lost} prototype missions archived, XP kept.` : "Save restored");
    ui.view = "missions"; render();
  };
  $("#dl").onclick = () => { download(`rootaccess-backup-${new Date().toISOString().slice(0, 10)}.json`, new Blob([json], { type: "application/json" })); toast("Backup downloaded"); };
  $("#cp").onclick = async () => { try { await navigator.clipboard.writeText(json); toast("Copied"); } catch (e) { $("#bx").select(); toast("Selected. Press Ctrl/Cmd+C"); } };
  $("#zip").onclick = () => { download("submissions.zip", window.makeZip(subs.map((m) => ({ name: `submissions/${m.id}.${EXT[m.lang]}`, text: S.code[m.id] })))); toast("submissions.zip downloaded"); };
  $("#file").onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { restore(JSON.parse(t), "file restore"); } catch (err) { toast("Couldn't read that file"); } }); };
  $("#imp").onclick = () => { try { restore(JSON.parse($("#paste").value), "paste restore"); } catch (e) { toast("Invalid JSON"); } };
  if ($("#toIntro")) $("#toIntro").onclick = () => { ui.view = "missions"; render(); };
  $("#wipe").onclick = (e) => { if (e.target.dataset.armed) { snapshot("Before wipe"); const keep = { prefs: S.prefs, settings: S.settings }; S = Object.assign(fresh(), keep); save(); render(); } else { e.target.dataset.armed = 1; e.target.textContent = "Click again to confirm"; } };
  v.onclick = (e) => { const i = e.target.closest("[data-snap]")?.dataset.snap; if (i != null) restore(snaps[i].data, "snapshot restore"); };
}

// ---------- settings: display, engines, offline ----------
function settings(v) {
  const tabs = [["display", "Display"], ["engines", "Engines"], ["offline", "Offline"]];
  v.innerHTML = `<div class="row tabs" role="tablist">${tabs.map(([k, t]) => `<button role="tab" aria-selected="${k === ui.set}" data-st="${k}" class="${k === ui.set ? "on" : ""}">${t}</button>`).join("")}</div><div id="setbody"></div>`;
  v.onclick = (e) => { const t = e.target.closest("[data-st]")?.dataset.st; if (t) { ui.set = t; render(); } };
  ({ display: displaySettings, engines: engineSettings, offline: offlineSettings })[ui.set]($("#setbody"));
}
const radios = (key, opts, cur) => `<div class="seg" role="radiogroup">${opts.map(([val, label]) => `<label><input type="radio" name="${key}" value="${val}" ${String(cur) === String(val) ? "checked" : ""}> ${label}</label>`).join("")}</div>`;

function displaySettings(el) {
  const p = S.prefs, sysDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const sw = (hex) => `<span class="swatch" style="background:${hex}"></span>`;
  el.innerHTML = `<div class="cols"><div class="set">
    <fieldset><legend>Theme</legend>${radios("scheme", [["system", `System (currently ${sysDark ? "dark" : "light"})`], ["dark", "Dark terminal"], ["light", "Light paper"]], p.scheme)}
      <p class="lbl">Contrast</p>${radios("contrast", [["system", "System"], ["normal", "Normal"], ["more", "High contrast"]], p.contrast)}</fieldset>
    <fieldset><legend>Accent colour</legend>${radios("accent", [["faction", `${sw(F() ? F().color : ACCENTS.matrix)} Faction`], ...Object.entries(ACCENTS).map(([k, h]) => [k, `${sw(h)} ${k[0].toUpperCase() + k.slice(1)}`]), ["custom", `${sw(p.customAccent)} Custom`]], p.accent)}
      <label class="lbl">Custom colour <input type="color" id="customAccent" value="${esc(p.customAccent)}"></label>
      <p class="mut tiny">On the light theme, accent text is darkened automatically so it stays readable.</p></fieldset>
    <fieldset><legend>Text</legend>
      <label class="lbl">Interface size: <b id="scaleV">${p.scale}%</b><input type="range" id="scale" min="80" max="150" step="5" value="${p.scale}"></label>
      <label class="lbl">Editor font size: <b id="edV">${p.editorSize}px</b><input type="range" id="editorSize" min="11" max="22" step="1" value="${p.editorSize}"></label>
      <p class="lbl">Reading font (code always stays monospaced)</p>${radios("font", [["mono", "Monospace"], ["sans", "Sans-serif"], ["serif", "Serif"]], p.font)}</fieldset>
  </div><div class="set">
    <fieldset><legend>Layout</legend><p class="lbl">Mission screen</p>${radios("layout", [["side", "Lesson | editor"], ["stacked", "Stacked"], ["editor-first", "Editor on top"]], p.layout)}
      <p class="lbl">Density</p>${radios("density", [["compact", "Compact"], ["normal", "Normal"], ["roomy", "Roomy"]], p.density)}
      <p class="lbl">Page width</p>${radios("width", [["normal", "Centred"], ["full", "Full width"]], p.width)}</fieldset>
    <fieldset><legend>Motion and effects</legend><p class="lbl">Code rain</p>${radios("rain", [["on", "On"], ["low", "Subtle"], ["off", "Off"]], p.rain)}
      <p class="lbl">Animations</p>${radios("motion", [["system", "System"], ["reduce", "Reduced"], ["full", "Full"]], p.motion)}
      <label class="lbl"><input type="checkbox" id="typewriter" ${p.typewriter ? "checked" : ""}> Typewriter effect on the intro</label></fieldset>
    <fieldset><legend>Preview</legend><div class="preview"><p><b class="acc">HANDLER:</b> The board is yours. <code>print("jacked in")</code></p><pre class="editor" style="min-height:0">for host in hosts:\n    ping(host)</pre><div class="row"><button class="primary" tabindex="-1">Run checkpoints</button><span class="chip ok">✓ verified</span><span class="bad">✗ failing</span></div></div>
      <div class="row" style="margin-top:10px"><button id="resetDisplay">Reset display settings</button></div></fieldset>
  </div></div>`;
  const commit = () => { applyPrefs(); save(); };
  el.onchange = (e) => {
    const t = e.target;
    if (t.type === "radio") { p[t.name] = t.value; commit(); if (t.name === "accent" || t.name === "scheme") displaySettings(el); }
    else if (t.id === "typewriter") { p.typewriter = t.checked; save(); }
    else if (t.id === "customAccent") { p.customAccent = t.value; p.accent = "custom"; commit(); displaySettings(el); }
    else if (t.id === "scale" || t.id === "editorSize") { p[t.id] = +t.value; commit(); }
  };
  el.oninput = (e) => { // live preview while dragging, saved on change
    const t = e.target;
    if (t.id === "scale") { $("#scaleV").textContent = t.value + "%"; ROOT.style.setProperty("--scale", t.value / 100); }
    if (t.id === "editorSize") { $("#edV").textContent = t.value + "px"; ROOT.style.setProperty("--ed", t.value + "px"); }
  };
  $("#resetDisplay").onclick = () => { S.prefs = defaultPrefs(); commit(); render(); toast("Display settings reset"); };
}

function engineSettings(el) {
  const st = S.settings;
  el.innerHTML = `<div class="cols"><div class="panel"><h2>Where checkpoints run</h2>
    ${radios("mode", [["auto", "Auto: on device when ready, else Judge0"], ["judge0", "Judge0 first"], ["device", "On device only (code never leaves this machine)"]], st.mode)}
    <p class="mut tiny">On-device runners cover Boot Camp, Python, SQL, JavaScript and TypeScript (see Offline). Other languages always use Judge0, or structure checks while offline.</p>
    <h2 style="margin-top:18px">Judge0</h2><p class="mut">The free public instances need no key but are rate-limited. Point the game at your own self-hosted Judge0, or a hosted plan, if you hit limits.</p>
    <label class="lbl">Judge0 CE host<input class="field" id="ce" value="${esc(st.ce)}"></label>
    <label class="lbl">Judge0 Extra host (C#)<input class="field" id="extra" value="${esc(st.extra)}"></label>
    <label class="lbl">Auth header<select class="field" id="th">${["X-Auth-Token", "X-RapidAPI-Key"].map((h) => `<option ${h === st.tokenHeader ? "selected" : ""}>${h}</option>`).join("")}</select></label>
    <label class="lbl">Token or key (optional; stored in this browser, never put in backups)<input class="field" id="tok" type="password" value="${esc(st.token)}" autocomplete="off"></label>
    <div class="row"><button class="primary" id="savee">Save</button><button id="defaults">Use public instances</button><button id="ping" ${online ? "" : "disabled"}>Test connection</button></div>
    <div class="term" id="pingout" style="margin-top:10px"><span class="mut">&gt; ${online ? "not tested" : "offline"}</span></div></div>
  <div class="panel"><h2>GitHub Actions</h2><p>The repository's <code>.github/workflows/checkpoints.yml</code> runs every checkpoint on current toolchains on each push:</p>
    <ul>${LANG_ORDER.map((L) => `<li><b>${esc(RA.langs[L].name)}</b>: ${esc(RA.CI_TOOLCHAINS[L])}</li>`).join("")}</ul>
    <p class="mut">Locally: <code>node tools/checkpoints.js --lang go</code>, or <code>--dir submissions</code> to grade your exported files.</p></div></div>`;
  el.onchange = (e) => { if (e.target.name === "mode") { st.mode = e.target.value; save(); toast("Run mode saved"); } };
  const read = () => ({ ce: $("#ce").value.trim().replace(/\/$/, ""), extra: $("#extra").value.trim().replace(/\/$/, ""), tokenHeader: $("#th").value, token: $("#tok").value.trim() });
  $("#savee").onclick = () => { Object.assign(st, read()); save(); toast("Engine settings saved"); };
  $("#defaults").onclick = () => { const f = fresh().settings; Object.assign(st, { ce: f.ce, extra: f.extra, token: "", tokenHeader: f.tokenHeader }); save(); render(); toast("Using the public Judge0 instances"); };
  $("#ping").onclick = async () => {
    Object.assign(st, read()); save();
    const o = $("#pingout"); o.innerHTML = '<span class="mut">&gt; running py1 reference solution…</span>';
    try { const m = BYID.py1, rep = await RA.runJudge0(m, RA.SOLUTIONS.py1, judgeCfg()); o.innerHTML = RA.allPassed(rep) ? `<span class="ok">✓ Connected.</span> ${esc(rep.engine)} ran ${rep.results.length} checkpoints in ${rep.time || "?"}s.` : `<span class="bad">✗ Reached Judge0 but the run failed:</span> ${esc(rep.status)}`; }
    catch (e) { o.innerHTML = `<span class="bad">✗ Couldn't connect:</span> ${esc(e.message)}`; }
  };
}

function offlineSettings(el) {
  const st = S.settings, pend = pendingVerify(), sw = "serviceWorker" in navigator && /^https?:$/.test(location.protocol);
  const rows = LANG_ORDER.map((L) => { const d = RA.LOCAL[L];
    return `<tr><td>${esc(RA.langs[L].name)}</td><td>${d ? `✓ ${esc(d.label)}${d.pack ? ` <span class="mut">(${esc(RA.PACKS[d.pack].label)} pack)</span>` : ""}` : `<span class="mut">Structure checks; clears re-verify online</span>`}</td></tr>`; }).join("");
  el.innerHTML = `<div class="cols"><div class="set">
    <div class="panel"><h2>Offline status</h2><ul>
      <li>${online ? "● Online: Judge0 is available." : "○ Offline: running on device and structure checks."}</li>
      <li id="swst">${sw ? (navigator.serviceWorker.controller ? "✓ App cached: it opens with no network." : "… Caching the app for offline use (reload once if this stays).") : "✗ Offline caching needs the app served over https or localhost (not opened as a file)."}</li>
      <li>${store.persistent ? "✓ Progress saves in this browser." : "✗ This browser is blocking storage: back up before closing."}</li>
      <li id="quota" class="mut">Checking storage…</li></ul></div>
    <div class="panel packs"><h2>Offline packs</h2><p class="mut">Download once and these tracks run real checkpoints with no network. Packs are cached by the browser; nothing is installed.</p>
      ${RL ? RL.packs().map((k) => `<div class="pk" data-pack="${k}"><div><b>${esc(RA.PACKS[k].label)}</b> <span class="mut">${esc(RA.PACKS[k].size)}</span><div class="tiny mut" data-pst>checking…</div></div><div class="row"><button class="primary" data-dl="${k}">Download</button><button data-rm="${k}">Remove</button></div></div>`).join("") : ""}
      <label class="lbl">Pack mirror (optional): a folder URL that serves the same files, e.g. your own copy made with <code>node tools/fetch-packs.js</code>
        <input class="field" id="pyBase" placeholder="Python: ${esc(RA.PACKS.python.base)}" value="${esc(st.packBase.python || "")}">
        <input class="field" id="tsBase" placeholder="TypeScript: ${esc(RA.PACKS.typescript.base)}" value="${esc(st.packBase.typescript || "")}"></label>
      <div class="row"><button id="saveBase">Save mirrors</button></div></div>
  </div><div class="set">
    <div class="panel"><h2>When there's no engine</h2>
      <label class="lbl"><input type="checkbox" id="offlineClears" ${st.offlineClears ? "checked" : ""}> Let ranks clear on structure checks while offline (marked "structure only")</label>
      <label class="lbl"><input type="checkbox" id="autoReverify" ${st.autoReverify ? "checked" : ""}> Re-verify those ranks automatically when the connection comes back</label>
      <h3 style="margin-top:12px">Waiting to re-verify: ${pend.length}</h3>
      ${pend.length ? `<p class="mut tiny">${pend.map((m) => esc(m.id)).join(", ")}</p>` : `<p class="mut">Nothing waiting.</p>`}
      <div class="row"><button class="primary" id="reverify" ${pend.length && !reverifying ? "" : "disabled"}>Re-verify now</button></div><p id="rvout" class="mut tiny"></p></div>
    <div class="panel"><h2>What runs offline</h2><div class="tablewrap"><table><thead><tr><th>Track</th><th>Offline</th></tr></thead><tbody>${rows}</tbody></table></div>
      <p class="mut tiny">TypeScript runs offline through its transpiler, so type errors only show up on Judge0 and in GitHub Actions. CI-only ranks always grade in GitHub Actions.</p></div>
  </div></div>`;
  const status = async () => {
    for (const box of el.querySelectorAll("[data-pack]")) {
      const k = box.dataset.pack, ps = await RL.packStatus(k);
      box.querySelector("[data-pst]").textContent = ps.ready ? `✓ Ready offline · from ${ps.base}` : ps.have ? `${ps.have}/${ps.total} files cached · from ${ps.base}` : `Not downloaded · from ${ps.base}`;
      box.querySelector("[data-dl]").disabled = ps.ready || !online;
      box.querySelector("[data-rm]").disabled = !ps.have;
    }
  };
  if (RL) status();
  if (navigator.storage && navigator.storage.estimate) Promise.all([navigator.storage.estimate(), navigator.storage.persisted ? navigator.storage.persisted() : false]).then(([q, keep]) => {
    const mb = (b) => (b / 1048576).toFixed(b > 1048576 * 100 ? 0 : 1) + " MB";
    $("#quota").textContent = `Using ${mb(q.usage || 0)} of ${mb(q.quota || 0)} available${keep ? " · protected from automatic clean-up" : ""}.`;
  }).catch(() => {}); else $("#quota").textContent = "";
  el.onclick = async (e) => {
    const dl = e.target.closest("[data-dl]")?.dataset.dl, rm = e.target.closest("[data-rm]")?.dataset.rm;
    if (dl) {
      const line = e.target.closest("[data-pack]").querySelector("[data-pst]"); e.target.disabled = true;
      try { await RL.download(dl, (i, n) => { line.textContent = `Downloading ${i}/${n}…`; }); toast(`${RA.PACKS[dl].label} ready offline`); }
      catch (err) { toast("Download failed: " + err.message); }
      status();
    }
    if (rm) { await RL.remove(rm); toast("Pack removed"); status(); }
    if (e.target.id === "reverify") {
      e.target.disabled = true; const o = $("#rvout");
      const res = await reverify(false, (m, r) => { o.textContent = `Checking ${m.id}… (${r.ok.length} verified so far)`; });
      if (res) o.textContent = `${res.ok.length} verified${res.failed.length ? `; failing now: ${res.failed.join(", ")} (open them to see why)` : ""}${res.skipped.length ? `; ${res.skipped.length} couldn't reach an engine` : ""}.`;
      setTimeout(() => ui.view === "settings" && ui.set === "offline" && render(), 2500);
    }
  };
  el.onchange = (e) => { if (e.target.id === "offlineClears" || e.target.id === "autoReverify") { st[e.target.id] = e.target.checked; save(); } };
  $("#saveBase").onclick = () => { st.packBase = { python: $("#pyBase").value.trim(), typescript: $("#tsBase").value.trim() }; Object.keys(st.packBase).forEach((k) => !st.packBase[k] && delete st.packBase[k]); RL && RL.setBases(st.packBase); save(); status(); toast("Mirrors saved"); };
}

applyPrefs();
if (RL) RL.setBases(S.settings.packBase);
render();
})();
