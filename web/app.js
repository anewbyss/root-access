(() => {
"use strict";
const RA = window.RA;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const LANG_ORDER = ["python", "javascript", "typescript", "sql", "bash", "go", "rust", "swift", "kotlin", "java", "csharp", "cpp"];
const EXT = { python: "py", javascript: "js", typescript: "ts", sql: "sql", bash: "sh", go: "go", rust: "rs", swift: "swift", kotlin: "kt", java: "java", csharp: "cs", cpp: "cpp" };
const BYID = Object.fromEntries(RA.missions.map((m) => [m.id, m]));
const LOCAL_LANGS = { javascript: 1, typescript: 1 }; // can run in the browser if Judge0 is unreachable

// Preview hosting blocks browser storage, so state lives in memory; backups carry it between sessions.
const mem = {};
const store = { get: (k) => mem[k] ?? null, set: (k, v) => { mem[k] = v; } };
const KEY = "rootaccess.save", SNAP = "rootaccess.snapshots";

const fresh = () => ({
  format: "rootaccess-save", version: 2, faction: null, xp: 0,
  done: [],            // cleared mission ids (shared with the Swift app)
  verified: {},        // id -> "judge0" | "ci" (pending GitHub Actions) | "local" | "offline"
  code: {}, fails: {}, primm: {}, notes: {}, legacy: {},
  pet: { name: "NULL", color: "matrix", eyes: "dot", crown: "none", aura: "none", energy: 70, bond: 10 },
  settings: { ce: RA.judge0Hosts.ce, extra: RA.judge0Hosts.extra, token: "", tokenHeader: "X-Auth-Token" },
  updated: Date.now()
});
// Accepts v1 saves (23-mission prototype) and v2. Unknown mission ids are kept under `legacy` so nothing is lost.
function migrate(d) {
  const s = Object.assign(fresh(), d);
  s.pet = Object.assign(fresh().pet, d.pet || {});
  s.settings = Object.assign(fresh().settings, d.settings || {});
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
let S = fresh();
let ui = { view: "missions", lang: "python", mission: null, intel: "languages", intelLang: "python" };
function save() { S.updated = Date.now(); store.set(KEY, JSON.stringify(S)); hud(); }
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
const metaFor = (m) => RA.harnessMeta(m.lang in { python: 1, javascript: 1, typescript: 1, sql: 1 } ? "" : RA.HARNESS[m.id] || "");
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2800); }
function download(name, blob) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
const src = (k) => RA.SOURCES[k];
const cite = (k) => { const s = src(k); return s ? `<a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>` : ""; };

// ---------- code rain ----------
(function rain() {
  const c = $("#rain"), x = c.getContext("2d"), glyphs = "アイウエオカキクケコｱｲｳ01{}<>/=;$#λ";
  let drops; const fs = 16;
  const size = () => { c.width = innerWidth; c.height = innerHeight; drops = Array(Math.ceil(c.width / fs)).fill(0).map(() => Math.random() * -50); };
  size(); addEventListener("resize", size);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tick() {
    x.fillStyle = "rgba(3,8,6,.09)"; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--acc") || "#3dff7a"; x.font = fs + "px JetBrains Mono";
    drops.forEach((d, i) => { x.fillText(glyphs[(Math.random() * glyphs.length) | 0], i * fs, d * fs); drops[i] = d * fs > c.height && Math.random() > 0.975 ? 0 : d + 1; });
    if (!reduce) setTimeout(() => requestAnimationFrame(tick), 60);
  }
  tick();
})();

// ---------- HUD / nav ----------
function hud() {
  if (S.faction) document.documentElement.style.setProperty("--acc", F().color);
  const langsDone = LANG_ORDER.filter((L) => fluency(L) === 12).length;
  $("#hud").innerHTML = S.faction ? `<span>${F().short}</span><span>LVL <b>${level()}</b></span><div class="bar" title="XP to next level"><i style="width:${lvlProgress() * 100}%"></i></div><span><b>${S.xp}</b> XP</span><span title="Missions cleared"><b>${S.done.length}</b>/${RA.missions.length}</span>${langsDone ? `<span title="Languages at full fluency"><b>${langsDone}</b> fluent</span>` : ""}` : "";
  $("#nav").style.visibility = S.faction ? "visible" : "hidden";
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("on", b.dataset.view === ui.view));
}
$("#nav").addEventListener("click", (e) => { const v = e.target.closest("button")?.dataset.view; if (v) { ui.view = v; ui.mission = null; render(); } });
function render() {
  hud(); const v = $("#view"); v.onclick = null;
  if (!S.faction) return intro(v);
  ({ missions, intel, pet, backup, settings })[ui.view](v);
  scrollTo(0, 0);
}

// ---------- intro ----------
function intro(v) {
  v.innerHTML = `<section class="intro"><p class="mut">// incoming transmission</p><div class="type" id="type"></div>
  <div id="pick" hidden><h2>Choose who you work for</h2><p class="mut">Every faction teaches the same 12 languages, 12 ranks each, through a different story. You can defect later and your skills carry over.</p><div class="factions">${
    Object.entries(RA.FACTIONS).map(([k, f]) => `<button class="fcard panel" data-f="${k}" style="--acc:${f.color}"><span class="tag acc">${f.short}</span><h3>${esc(f.name)}</h3><q>“${esc(f.creed)}”</q><span class="mut">${esc(f.pitch)}</span><span class="mut">Handler: ${esc(f.handler)}</span></button>`).join("")
  }</div><p class="mut" style="margin-top:16px">Already have a save? <button data-restore>Restore a backup</button></p></div></section>`;
  const msg = "Wake up.\n\nThe world runs on code you can't read. Pipelines, hospitals, elections, gods.\nIn 2021 one leaked password shut down a fuel pipeline. In 2024 one bad update crashed 8.5 million machines.\n\nThree factions want you. Each will teach you to read the code, and to write it.\nEvery mission ends at a checkpoint graded by a real compiler.\n\nFollow the white cursor.";
  let i = 0; const el = $("#type");
  const step = () => { el.textContent = msg.slice(0, i++) + "█"; if (i <= msg.length) setTimeout(step, msg[i - 1] === "\n" ? 120 : 14); else { el.textContent = msg; $("#pick").hidden = false; } };
  step(); el.onclick = () => { i = msg.length; };
  v.onclick = (e) => {
    const f = e.target.closest("[data-f]")?.dataset.f;
    if (f) { S.faction = f; save(); toast(`Welcome to ${RA.FACTIONS[f].name}`); render(); }
    if (e.target.closest("[data-restore]")) { S.faction = "sentinel"; ui.view = "backup"; render(); }
  };
}

// ---------- mission board ----------
function missions(v) {
  if (ui.mission) return missionView(v, BYID[ui.mission]);
  const L = ui.lang, lang = RA.langs[L], list = langMissions(L), n = fluency(L), D = RA.DOSSIERS[L];
  v.innerHTML = `<div class="grid"><aside class="panel"><h3>Languages</h3><div class="langs">${LANG_ORDER.map((k) => {
    const d = fluency(k);
    return `<button data-lang="${k}" class="${k === L ? "on" : ""}"><span>${esc(RA.langs[k].name)}</span><span class="mini"><i style="width:${(d / 12) * 100}%"></i></span><span class="mut">${d}/12</span></button>`; }).join("")}</div></aside>
  <section><div class="panel lhead"><div><p class="mut">${esc(F().handler)} // ${esc(F().name)}</p><h2>${esc(lang.name)}</h2><p>${esc(D ? D.tagline : lang.why)}</p><p class="mut">${esc(lang.why)}</p>
    <div class="row"><button data-intel="${L}">Read the ${esc(lang.name)} dossier</button><span class="chip">Engine: ${esc(RA.ENGINES[L].label)}</span><span class="chip">CI: ${esc(RA.CI_TOOLCHAINS[L])}</span></div></div>
    <div class="fluency" aria-label="Fluency ${n} of 12"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" class="trk"/><circle cx="60" cy="60" r="50" class="val" style="stroke-dasharray:${(n / 12) * 314} 314"/></svg><div><b>${n}</b>/12</div><span class="mut">fluency</span></div></div>
  ${n === 12 ? certificate(L) : ""}
  <div class="mlist">${list.map((m) => { const ok = unlocked(m), dn = isDone(m.id), meta = metaFor(m), ver = S.verified[m.id];
    return `<button class="mcard panel ${dn ? "done" : ""}" data-m="${m.id}" ${ok ? "" : "disabled"}><div><div class="mut tiny">RANK ${m.rank} // ${esc(m.module)}${m.rank === 12 ? " // CAPSTONE" : ""}</div><h3>${esc(m.title)}</h3><div class="mut">${esc(RA.brief(m, S.faction))}</div></div><div class="cstack"><span class="chip">${dn ? "CLEARED" : ok ? "+" + m.xp + " XP" : "LOCKED"}</span><span class="chip ${meta.ciOnly ? "ci" : ""}">${meta.ciOnly ? "GitHub Actions" : "Judge0"}</span>${dn ? `<span class="chip ${ver === "judge0" || ver === "local" ? "ok" : ""}">${verLabel(ver)}</span>` : ""}</div></button>`; }).join("")}</div></section></div>`;
  v.onclick = (e) => {
    const l = e.target.closest("[data-lang]")?.dataset.lang; if (l) { ui.lang = l; render(); return; }
    const m = e.target.closest("[data-m]")?.dataset.m; if (m) { ui.mission = m; render(); return; }
    const di = e.target.closest("[data-intel]")?.dataset.intel; if (di) { ui.view = "intel"; ui.intel = "languages"; ui.intelLang = di; render(); return; }
    if (e.target.closest("[data-cert]")) downloadCert(e.target.closest("[data-cert]").dataset.cert);
  };
}
const verLabel = (v) => ({ judge0: "verified · Judge0", local: "verified · in browser", ci: "pending · GitHub Actions", offline: "structure only" }[v] || "structure only");

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
function missionView(v, m) {
  if (!m) { ui.mission = null; return missions(v); }
  const code = S.code[m.id] ?? m.starter, meta = metaFor(m), P = RA.PRAXIS, stage = S.primm[m.id] || 0;
  const fails = S.fails[m.id] || 0, worked = fails >= P.fadeAfter || isDone(m.id);
  const prompt = P.selfExplain[(m.rank - 1) % P.selfExplain.length];
  const list = langMissions(m.lang), next = list[m.rank];
  v.innerHTML = `<div class="row"><button id="back">← ${esc(RA.langs[m.lang].name)} board</button>${next && isDone(m.id) ? `<button data-go="${next.id}">Next: rank ${next.rank} →</button>` : ""}</div>
  <div class="panel mhead"><p class="mut">${esc(RA.langs[m.lang].name.toUpperCase())} // RANK ${m.rank} OF 12 // ${esc(m.module)}</p><h1>${esc(m.title)}</h1><p><b class="acc">${esc(F().handler)}:</b> ${esc(RA.brief(m, S.faction))}</p></div>
  <div class="cols"><div class="panel lesson">
    <ol class="primm" aria-label="PRIMM stages">${P.stages.map((s, i) => `<li><button data-stage="${i}" class="${i === stage ? "on" : i < stage ? "past" : ""}">${s.name}</button></li>`).join("")}</ol>
    <p class="stagehint"><b class="acc">${P.stages[stage].name}.</b> ${esc(P.stages[stage].what)}</p>
    <h3>Training: ${esc(m.concept)}</h3>${m.lesson}
    <div class="explain"><label for="note"><b>Self-explain:</b> ${esc(prompt)}</label><textarea id="note" rows="3" placeholder="Write it in your own words. Saved with your backup.">${esc(S.notes[m.id] || "")}</textarea></div>
    <h3>Objective</h3><p>${m.task}</p>
    <details class="worked" ${worked ? "" : "data-locked"}><summary>${worked ? "Worked example (reference solution)" : `Worked example unlocks after ${P.fadeAfter - fails} more failed run${P.fadeAfter - fails === 1 ? "" : "s"}`}</summary>${worked ? `<pre>${esc(RA.SOLUTIONS[m.id] || "")}</pre><p class="mut">Read it, close it, then write yours from memory. Studying a worked example and then explaining it is one of the best-supported ways to learn to code (${cite("worked")}).</p>` : ""}</details>
  </div>
  <div class="panel"><div class="row between"><h3>Terminal</h3><span class="mut tiny">Ctrl/Cmd+Enter runs checkpoints</span></div>
    <textarea class="editor" id="ed" spellcheck="false" autocapitalize="off" aria-label="Code editor">${esc(code)}</textarea>
    <div class="row" style="margin:10px 0"><button class="primary" id="run">${meta.ciOnly ? "Check and queue for GitHub Actions" : "Run external checkpoints"}</button><button id="struct">Check structure</button><button id="hint">Hint</button><button id="reset">Reset</button>${meta.ciOnly ? `<button id="export1">Export ${m.id}.${EXT[m.lang]}</button>` : ""}</div>
    <div class="cplist" id="cps">${checkpointList(m, meta)}</div>
    <div class="term" id="out"><span class="mut">&gt; awaiting input_</span></div></div></div>`;
  const ed = $("#ed"), out = $("#out");
  ed.addEventListener("keydown", (e) => {
    if (e.key === "Tab") { e.preventDefault(); const s = ed.selectionStart; ed.setRangeText("    ", s, ed.selectionEnd, "end"); }
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") $("#run").click();
  });
  ed.addEventListener("input", () => { S.code[m.id] = ed.value; save(); });
  $("#note").addEventListener("input", (e) => { S.notes[m.id] = e.target.value; save(); });
  $("#back").onclick = () => { ui.mission = null; render(); };
  $("#reset").onclick = () => { ed.value = m.starter; S.code[m.id] = m.starter; save(); out.innerHTML = '<span class="mut">&gt; reset to starter code</span>'; };
  $("#hint").onclick = () => { const f = m.checks.find((c) => !c.re.test(ed.value)); out.innerHTML = `<span class="acc">HINT // </span>${esc(f ? f.hint : "Structure looks right. Run the checkpoints.")}`; };
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
    if (!s.pass) { fail(); out.innerHTML = `<span class="mut">STRUCTURE</span>\n${s.lines.join("\n")}\n\n<span class="bad">Fix the red lines first.</span> Checkpoints only run once the required pieces are present.`; return; }
    if (meta.ciOnly) {
      out.innerHTML = `<span class="mut">STRUCTURE</span>\n${s.lines.join("\n")}\n\n<span class="acc">QUEUED FOR GITHUB ACTIONS.</span> ${esc(meta.ciOnly)}\nExport this file (or all submissions from Backup), commit it to <code>submissions/</code>, and the checkpoints workflow grades it on ${esc(RA.CI_TOOLCHAINS[m.lang])}.`;
      clear("ci"); return;
    }
    btn.disabled = true; btn.textContent = "Running on Judge0…";
    out.innerHTML = `<span class="mut">&gt; submitting to ${esc(RA.ENGINES[m.lang].label)}…</span>`;
    let rep, how = "judge0";
    try { rep = await RA.runJudge0(m, code, judgeCfg()); }
    catch (err) {
      if (LOCAL_LANGS[m.lang]) { try { rep = await localRun(m, code); how = "local"; } catch (e2) { rep = null; } }
      if (!rep) { btn.disabled = false; btn.textContent = "Run external checkpoints"; out.innerHTML = `<span class="bad">Couldn't reach Judge0</span> (${esc(err.message)}). The public instance is rate-limited. Wait a minute, or add your own Judge0 host or API key under Engines.\n\n<span class="mut">Structure checks passed, so you can export this file and verify it in GitHub Actions instead.</span>`; return; }
    }
    btn.disabled = false; btn.textContent = "Run external checkpoints";
    $("#cps").innerHTML = checkpointList(m, meta, rep.results);
    const ok = RA.allPassed(rep);
    const lines = rep.results.map((r) => `<span class="${r.status === "PASS" ? "ok" : r.status === "SKIP" ? "mut" : "bad"}">${r.status === "PASS" ? "[✓]" : r.status === "SKIP" ? "[~]" : "[✗]"}</span> ${esc(r.label)}${r.status !== "PASS" && r.detail ? ` <span class="mut">— ${esc(r.detail)}</span>` : ""}`);
    const user = (rep.stdout || "").split("\n").filter((l) => l && !/::cp::/.test(l)).slice(0, 12).join("\n");
    out.innerHTML = `<span class="mut">${how === "local" ? "IN-BROWSER FALLBACK (Judge0 unreachable)" : "ENGINE // " + esc(rep.engine || RA.ENGINES[m.lang].label)}${rep.time ? " · " + rep.time + "s" : ""}</span>\n${lines.join("\n")}${user ? `\n\n<span class="mut">stdout</span>\n${esc(user)}` : ""}${rep.stderr && !ok ? `\n\n<span class="mut">stderr</span>\n${esc(rep.stderr.slice(0, 600))}` : ""}`;
    if (ok) clear(how); else fail();
  };
  function fail() {
    S.fails[m.id] = (S.fails[m.id] || 0) + 1; save();
    if (S.fails[m.id] === P.fadeAfter) { toast("Worked example unlocked"); const d = $(".worked"); d.removeAttribute("data-locked"); d.innerHTML = `<summary>Worked example (reference solution)</summary><pre>${esc(RA.SOLUTIONS[m.id] || "")}</pre><p class="mut">Read it, close it, then write yours from memory.</p>`; d.open = true; }
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
    out.insertAdjacentHTML("beforeend", `\n\n<span class="ok">ACCESS GRANTED.</span> ${first ? `+${m.xp} XP. Rank ${m.rank + 1 <= 12 ? m.rank + 1 + " unlocked." : "12 complete: certificate issued."}` : ""} ${how === "ci" ? "Marked pending until GitHub Actions goes green." : ""}`);
    const row = $(".row"); if (first && next && !v.querySelector("[data-go]")) { row.insertAdjacentHTML("beforeend", `<button data-go="${next.id}">Next: rank ${next.rank} →</button>`); row.querySelector("[data-go]").onclick = () => { ui.mission = next.id; render(); }; }
  }
}
function checkpointList(m, meta, results) {
  const labels = results ? results.map((r) => r.label) : meta.checkpoints.length ? ["Compiles", ...meta.checkpoints] : [];
  const where = meta.ciOnly ? `<b>GitHub Actions</b> · ${esc(RA.CI_TOOLCHAINS[m.lang])}` : `<b>Judge0</b> · ${esc(RA.ENGINES[m.lang].label)} <span class="mut">(also re-run in GitHub Actions on ${esc(RA.CI_TOOLCHAINS[m.lang])})</span>`;
  if (!labels.length) return `<p class="tiny">${where}</p><p class="mut tiny">Checkpoints are the mission's test cases. They appear after the first run.</p>`;
  const st = (l) => (results ? results.find((r) => r.label === l).status : "");
  return `<p class="tiny">${where}</p><ul>${labels.filter((l, i, a) => a.indexOf(l) === i).filter((l) => !(l === "Compiles" && ["python", "javascript", "sql", "bash"].includes(m.lang))).map((l) => `<li class="${st(l) === "PASS" ? "ok" : st(l) === "FAIL" ? "bad" : ""}">${st(l) === "PASS" ? "✓" : st(l) === "FAIL" ? "✗" : "○"} ${esc(l)}</li>`).join("")}</ul>${meta.ciOnly ? `<p class="mut tiny">${esc(meta.ciOnly)}</p>` : ""}`;
}
function judgeCfg() {
  const st = S.settings, headers = {};
  if (st.token) headers[st.tokenHeader || "X-Auth-Token"] = st.token;
  return { hosts: { ce: st.ce || RA.judge0Hosts.ce, extra: st.extra || RA.judge0Hosts.extra }, headers };
}
// In-browser fallback for JS/TS: same generated harness, executed with a captured console.
let tsLoad;
async function localRun(m, code) {
  let js = RA.compose(m, code, "judge0");
  if (m.lang === "typescript") {
    if (!window.ts) tsLoad = tsLoad || new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdn.jsdelivr.net/npm/typescript@5.6.3/lib/typescript.min.js"; s.onload = res; s.onerror = () => rej(new Error("TypeScript CDN unreachable")); document.head.appendChild(s); });
    await tsLoad;
    js = window.ts.transpileModule(js, { compilerOptions: { target: 99, module: 99 } }).outputText;
  }
  js = js.replace(/^\s*export\s*\{\s*\};?\s*$/gm, "");
  const lines = [], log = (...a) => lines.push(a.map((x) => (typeof x === "string" ? x : JSON.stringify(x))).join(" "));
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  try { await new AsyncFunction("console", js)({ log, error: log, warn: log, info: log }); await new Promise((r) => setTimeout(r, 50)); }
  catch (e) { lines.push("::cp::FAIL::Runs to completion::" + e.message); }
  return Object.assign(RA.buildReport(m, metaFor(m), { status: "Accepted", stdout: lines.join("\n") }), { engine: "Browser" });
}

// ---------- intel ----------
function intel(v) {
  const tabs = [["languages", "Language dossiers"], ["method", "How you learn here"], ["engines", "Test engines"], ["incidents", "Incident archive"]];
  let body = "";
  if (ui.intel === "languages") {
    const L = ui.intelLang, D = RA.DOSSIERS[L], lang = RA.langs[L];
    body = `<div class="row langtabs">${LANG_ORDER.map((k) => `<button data-il="${k}" class="${k === L ? "on" : ""}">${esc(RA.langs[k].name)}</button>`).join("")}</div>
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
      <p>Each of the 12 ranks per language is a module (${RA.MODULES.map(esc).join(", ")}), so finishing rank 12 means you've used the language end to end: syntax, data modeling, errors, the standard library, generics, concurrency, testing and a capstone. Worked examples unlock after ${P.fadeAfter} failed runs, then fade away again on the next rank.</p></div>
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
const stage = () => [...RA.PET_STAGES].reverse().find((s) => level() >= s.lvl);
function petSVG(p) {
  const col = RA.PET_PARTS.color.find((c) => c.id === p.color)?.val || "#3dff7a";
  const st = RA.PET_STAGES.indexOf(stage()), r = 34 + st * 8;
  const hex = (k, rot = -Math.PI / 2) => [0, 1, 2, 3, 4, 5].map((i) => { const a = (Math.PI / 3) * i + rot; return `${100 + Math.cos(a) * r * k},${112 + Math.sin(a) * r * k}`; }).join(" ");
  const body = st === 0 ? `<rect x="${100 - r}" y="${110 - r}" width="${r * 2}" height="${r * 2}" rx="6" fill="none" stroke="${col}" stroke-width="3"/><rect x="92" y="96" width="16" height="26" fill="${col}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>`
    : st === 1 ? `<ellipse cx="100" cy="112" rx="${r}" ry="${r * 0.85}" fill="${col}22" stroke="${col}" stroke-width="3"/>`
    : st === 2 ? `<path d="M${100 - r} 130 Q100 ${60 - st * 4} ${100 + r} 130 Q100 ${150 + r * 0.4} ${100 - r} 130Z" fill="${col}22" stroke="${col}" stroke-width="3"/><path d="M${100 - r} 130 l-14 18 M${100 + r} 130 l14 18" stroke="${col}" stroke-width="3"/>`
    : `<polygon points="${hex(1)}" fill="${col}22" stroke="${col}" stroke-width="3"/>${st === 4 ? `<polygon points="${hex(0.6, 0)}" fill="none" stroke="${col}" stroke-width="1.5"/>` : ""}`;
  const ey = 106;
  const eyes = st === 0 ? "" : ({
    dot: `<circle cx="86" cy="${ey}" r="5" fill="${col}"/><circle cx="114" cy="${ey}" r="5" fill="${col}"/>`,
    visor: `<rect x="74" y="${ey - 6}" width="52" height="12" rx="6" fill="${col}"/>`,
    cyclops: `<circle cx="100" cy="${ey}" r="11" fill="none" stroke="${col}" stroke-width="3"/><circle cx="100" cy="${ey}" r="4" fill="${col}"/>`,
    glyph: `<text x="100" y="${ey + 6}" text-anchor="middle" font-size="18" fill="${col}" font-family="JetBrains Mono">&lt;/&gt;</text>`,
    trinary: `<circle cx="82" cy="${ey}" r="4" fill="${col}"/><circle cx="100" cy="${ey - 8}" r="4" fill="${col}"/><circle cx="118" cy="${ey}" r="4" fill="${col}"/>`
  })[p.eyes];
  const top = 112 - r;
  const crown = ({ none: "", antenna: `<path d="M100 ${top} v-22" stroke="${col}" stroke-width="2"/><circle cx="100" cy="${top - 24}" r="4" fill="${col}"/>`,
    horns: `<path d="M80 ${top + 8} l-10 -22 l18 14 M120 ${top + 8} l10 -22 l-18 14" fill="${col}" stroke="${col}" stroke-width="2"/>`,
    halo: `<ellipse cx="100" cy="${top - 14}" rx="26" ry="6" fill="none" stroke="${col}" stroke-width="3"/>`,
    crown: `<path d="M74 ${top - 2} l6 -22 l10 12 l10 -18 l10 18 l10 -12 l6 22z" fill="${col}"/>` })[p.crown];
  const aura = ({ none: "", rain: [...Array(9)].map((_, i) => `<text x="${20 + i * 20}" y="0" font-size="11" fill="${col}" opacity=".5" font-family="JetBrains Mono">${i % 2}<animate attributeName="y" from="0" to="200" dur="${2 + (i % 3)}s" repeatCount="indefinite"/></text>`).join(""),
    rings: `<g class="spin"><ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="${col}" opacity=".4"/><circle cx="190" cy="100" r="4" fill="${col}"/></g>`, glitch: "" })[p.aura];
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.name)}, ${stage().name}">${aura}<g class="bob ${p.aura === "glitch" ? "glitch" : ""}" style="filter:drop-shadow(0 0 8px ${col})">${crown}${body}${eyes}</g></svg>`;
}
function pet(v) {
  const p = S.pet, lv = level(), st = stage(), next = RA.PET_STAGES.find((s) => s.lvl > lv);
  const fluent = LANG_ORDER.filter((L) => fluency(L) === 12);
  const opts = (key, label) => `<h3>${label}</h3><div class="opts">${RA.PET_PARTS[key].map((o) => { const lock = lv < o.lvl;
    return `<button data-k="${key}" data-v="${o.id}" class="${p[key] === o.id ? "on" : ""}" ${lock ? "disabled" : ""}>${o.label}${lock ? ` <span class="lock">LVL ${o.lvl}</span>` : ""}</button>`; }).join("")}</div>`;
  v.innerHTML = `<div class="pet"><div class="panel"><div class="petstage">${petSVG(p)}</div>
    <div class="row" style="margin-top:12px"><input id="pname" value="${esc(p.name)}" maxlength="16" aria-label="Pet name" class="field" style="flex:1"><button id="feed">Feed a commit</button></div>
    <div class="stat"><span>Energy</span><div class="bar"><i style="width:${p.energy}%"></i></div></div>
    <div class="stat"><span>Bond</span><div class="bar"><i style="width:${p.bond}%"></i></div></div>
    <h3 style="margin-top:14px">Languages it speaks</h3><div class="glyphs">${LANG_ORDER.map((L) => `<span class="chip ${fluency(L) === 12 ? "ok" : ""}" title="${RA.langs[L].name}: ${fluency(L)}/12">${RA.langs[L].tag} ${fluency(L)}</span>`).join("")}</div></div>
  <div class="panel"><p class="mut">FORM ${RA.PET_STAGES.indexOf(st) + 1}/${RA.PET_STAGES.length}</p><h2>${st.name}</h2><p>${st.desc}</p>
    <p class="mut">${next ? `Next evolution: <b class="acc">${next.name}</b> at level ${next.lvl}. Your pet only grows as far as your skills do: parts unlock with your level, and each language you take to fluency adds a glyph.` : "Final form reached. It knows what you know."}</p>
    <p class="mut">Cleared ${S.done.length}/${RA.missions.length} · Fluent in ${fluent.length}/12</p>
    ${opts("color", "Core color")}${opts("eyes", "Optics")}${opts("crown", "Crown")}${opts("aura", "Aura")}</div></div>`;
  v.onclick = (e) => {
    const b = e.target.closest("[data-k]"); if (b && !b.disabled) { p[b.dataset.k] = b.dataset.v; save(); render(); }
    if (e.target.id === "feed") { if (p.energy >= 100) toast(`${p.name} is full. Go clear a mission.`); else { p.energy = Math.min(100, p.energy + 5); p.bond = Math.min(100, p.bond + 1); save(); render(); toast(`${p.name} ate a commit`); } }
  };
  $("#pname").onchange = (e) => { p.name = e.target.value.trim() || "NULL"; save(); };
}

// ---------- backup ----------
function backup(v) {
  let snaps = []; try { snaps = JSON.parse(store.get(SNAP)) || []; } catch (e) {}
  const json = JSON.stringify(S, null, 2);
  const subs = RA.missions.filter((m) => S.code[m.id] && S.code[m.id] !== m.starter);
  v.innerHTML = `<div class="cols"><div class="panel"><h2>Back up your save</h2><p class="mut"><b class="acc">Progress lives in this session.</b> Download or copy a backup before you close the tab, then restore it next time. The Swift Playgrounds app reads the same format.</p>
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
    snapshot("Before " + label); S = migrate(d); if (!S.faction) S.faction = "sentinel"; save();
    const lost = (S.legacy.done || []).length; toast(lost ? `Save restored. ${lost} prototype missions archived, XP kept.` : "Save restored");
    ui.view = "missions"; render();
  };
  $("#dl").onclick = () => { download(`rootaccess-backup-${new Date().toISOString().slice(0, 10)}.json`, new Blob([json], { type: "application/json" })); toast("Backup downloaded"); };
  $("#cp").onclick = async () => { try { await navigator.clipboard.writeText(json); toast("Copied"); } catch (e) { $("#bx").select(); toast("Selected. Press Ctrl/Cmd+C"); } };
  $("#zip").onclick = () => { download("submissions.zip", window.makeZip(subs.map((m) => ({ name: `submissions/${m.id}.${EXT[m.lang]}`, text: S.code[m.id] })))); toast("submissions.zip downloaded"); };
  $("#file").onchange = (e) => { const f = e.target.files[0]; if (!f) return; f.text().then((t) => { try { restore(JSON.parse(t), "file restore"); } catch (err) { toast("Couldn't read that file"); } }); };
  $("#imp").onclick = () => { try { restore(JSON.parse($("#paste").value), "paste restore"); } catch (e) { toast("Invalid JSON"); } };
  $("#wipe").onclick = (e) => { if (e.target.dataset.armed) { snapshot("Before wipe"); S = fresh(); save(); render(); } else { e.target.dataset.armed = 1; e.target.textContent = "Click again to confirm"; } };
  v.onclick = (e) => { const i = e.target.closest("[data-snap]")?.dataset.snap; if (i != null) restore(snaps[i].data, "snapshot restore"); };
}

// ---------- engines / settings ----------
function settings(v) {
  const st = S.settings;
  v.innerHTML = `<div class="cols"><div class="panel"><h2>Test engines</h2><p class="mut">The free public Judge0 instances need no key but are rate-limited. Point the game at your own self-hosted Judge0, or a hosted plan, if you hit limits.</p>
    <label class="lbl">Judge0 CE host<input class="field" id="ce" value="${esc(st.ce)}"></label>
    <label class="lbl">Judge0 Extra host (C#)<input class="field" id="extra" value="${esc(st.extra)}"></label>
    <label class="lbl">Auth header<select class="field" id="th">${["X-Auth-Token", "X-RapidAPI-Key"].map((h) => `<option ${h === st.tokenHeader ? "selected" : ""}>${h}</option>`).join("")}</select></label>
    <label class="lbl">Token or key (optional, kept only in this session)<input class="field" id="tok" type="password" value="${esc(st.token)}" autocomplete="off"></label>
    <div class="row"><button class="primary" id="savee">Save</button><button id="defaults">Use public instances</button><button id="ping">Test connection</button></div>
    <div class="term" id="pingout" style="margin-top:10px"><span class="mut">&gt; not tested</span></div></div>
  <div class="panel"><h2>GitHub Actions</h2><p>The repository's <code>.github/workflows/checkpoints.yml</code> runs every checkpoint on current toolchains on each push:</p>
    <ul>${LANG_ORDER.map((L) => `<li><b>${esc(RA.langs[L].name)}</b>: ${esc(RA.CI_TOOLCHAINS[L])}</li>`).join("")}</ul>
    <p class="mut">Locally: <code>node tools/checkpoints.js --lang go</code>, or <code>--dir submissions</code> to grade your exported files.</p></div></div>`;
  const read = () => ({ ce: $("#ce").value.trim().replace(/\/$/, ""), extra: $("#extra").value.trim().replace(/\/$/, ""), tokenHeader: $("#th").value, token: $("#tok").value.trim() });
  $("#savee").onclick = () => { S.settings = Object.assign(S.settings, read()); save(); toast("Engine settings saved"); };
  $("#defaults").onclick = () => { S.settings = fresh().settings; save(); settings(v); toast("Using the public Judge0 instances"); };
  $("#ping").onclick = async () => {
    S.settings = Object.assign(S.settings, read()); save();
    const o = $("#pingout"); o.innerHTML = '<span class="mut">&gt; running py1 reference solution…</span>';
    try { const m = BYID.py1, rep = await RA.runJudge0(m, RA.SOLUTIONS.py1, judgeCfg()); o.innerHTML = RA.allPassed(rep) ? `<span class="ok">Connected.</span> ${esc(rep.engine)} ran ${rep.results.length} checkpoints in ${rep.time || "?"}s.` : `<span class="bad">Reached Judge0 but the run failed:</span> ${esc(rep.status)}`; }
    catch (e) { o.innerHTML = `<span class="bad">Couldn't connect:</span> ${esc(e.message)}`; }
  };
}

render();
})();
