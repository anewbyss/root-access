(() => {
const KEY = "rootaccess.save.v1", SNAP = "rootaccess.snapshots.v1";
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
// Preview hosting blocks browser storage, so state lives in memory and backups carry it between sessions.
const store = { get(k) { return mem[k] ?? null; }, set(k, v) { mem[k] = v; } };
const mem = {};

const fresh = () => ({ format: "rootaccess-save", version: 1, faction: null, xp: 0, done: [], code: {},
  pet: { name: "NULL", color: "matrix", eyes: "dot", crown: "none", aura: "none", energy: 70, bond: 10, fed: 0 }, updated: Date.now() });
let S = load();
let ui = { view: "missions", lang: "python", mission: null };

function load() { try { const d = JSON.parse(store.get(KEY)); if (d && d.format === "rootaccess-save") return Object.assign(fresh(), d, { pet: Object.assign(fresh().pet, d.pet) }); } catch {} return fresh(); }
function save() { S.updated = Date.now(); store.set(KEY, JSON.stringify(S)); hud(); }
function snapshot(label) {
  let snaps = []; try { snaps = JSON.parse(store.get(SNAP)) || []; } catch {}
  snaps.unshift({ at: Date.now(), label, data: JSON.parse(JSON.stringify(S)) });
  store.set(SNAP, JSON.stringify(snaps.slice(0, 8)));
}
const level = () => 1 + Math.floor(S.xp / 220);
const lvlProgress = () => (S.xp % 220) / 220;
const F = () => FACTIONS[S.faction];
function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600); }

// ---------- code rain ----------
(function rain() {
  const c = $("#rain"), x = c.getContext("2d"), glyphs = "アイウエオカキクケコｱｲｳ01{}<>/=;$#λ";
  let cols, drops; const fs = 16;
  const size = () => { c.width = innerWidth; c.height = innerHeight; cols = Math.ceil(c.width / fs); drops = Array(cols).fill(0).map(() => Math.random() * -50); };
  size(); addEventListener("resize", size);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function tick() {
    x.fillStyle = "rgba(3,8,6,.09)"; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--acc") || "#3dff7a"; x.font = fs + "px JetBrains Mono";
    drops.forEach((d, i) => { x.fillText(glyphs[Math.random() * glyphs.length | 0], i * fs, d * fs); drops[i] = d * fs > c.height && Math.random() > .975 ? 0 : d + 1; });
    if (!reduce) setTimeout(() => requestAnimationFrame(tick), 50);
  } tick();
})();

// ---------- HUD / nav ----------
function hud() {
  if (S.faction) document.documentElement.style.setProperty("--acc", F().color);
  $("#hud").innerHTML = S.faction ? `<span>${F().short}</span><span>LVL <b>${level()}</b></span><div class="bar" title="XP"><i style="width:${lvlProgress() * 100}%"></i></div><span><b>${S.xp}</b> XP</span>` : "";
  $("#nav").style.visibility = S.faction ? "visible" : "hidden";
  document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b.dataset.view === ui.view));
}
$("#nav").addEventListener("click", e => { const v = e.target.closest("button")?.dataset.view; if (v) { ui.view = v; ui.mission = null; render(); } });

function render() { hud(); const v = $("#view"); if (!S.faction) return intro(v); ({ missions, pet, intel, backup })[ui.view](v); scrollTo(0, 0); }

// ---------- intro ----------
function intro(v) {
  v.innerHTML = `<section class="intro"><p class="mut">// incoming transmission</p><div class="type" id="type"></div>
  <div id="pick" hidden><h2>Choose who you work for</h2><p class="mut">Every faction teaches the same languages through a different story. You can defect later, and your skills carry over.</p><div class="factions">${
    Object.entries(FACTIONS).map(([k, f]) => `<button class="fcard panel" data-f="${k}" style="--acc:${f.color}"><span class="tag acc">${f.short}</span><h3>${f.name}</h3><q>“${f.creed}”</q><span class="mut">${f.pitch}</span><span class="mut">Handler: ${f.handler}</span></button>`).join("")
  }</div><p class="mut" style="margin-top:16px">Already have a save? <button data-view-backup>Restore a backup</button></p></div></section>`;
  const msg = "Wake up.\n\nThe world runs on code you can't read. Pipelines, hospitals, elections, gods.\nIn 2021 one leaked password shut down a fuel pipeline. In 2024 one bad update grounded flights worldwide.\n\nThree factions want you. Each will teach you to read the code, and to write it.\n\nFollow the white cursor.";
  let i = 0; const el = $("#type");
  const step = () => { el.textContent = msg.slice(0, i++) + "█"; if (i <= msg.length) setTimeout(step, msg[i - 1] === "\n" ? 140 : 18); else { el.textContent = msg; $("#pick").hidden = false; } };
  step(); el.onclick = () => { i = msg.length; };
  v.onclick = e => {
    const f = e.target.closest("[data-f]")?.dataset.f;
    if (f) { S.faction = f; save(); toast(`Welcome to ${FACTIONS[f].name}`); render(); }
    if (e.target.closest("[data-view-backup]")) { S.faction = S.faction || "sentinel"; ui.view = "backup"; render(); }
  };
}

// ---------- missions ----------
function missions(v) {
  v.onclick = null;
  if (ui.mission) return missionView(v, MISSIONS.find(m => m.id === ui.mission));
  const langs = Object.entries(LANGS);
  const list = MISSIONS.filter(m => m.lang === ui.lang).sort((a, b) => a.tier - b.tier);
  const unlocked = m => m.tier === 1 || list.some(o => o.tier < m.tier && S.done.includes(o.id)) || level() >= m.tier * 2;
  v.innerHTML = `<div class="grid"><aside class="panel"><h3>Languages</h3><div class="langs">${langs.map(([k, l]) => {
    const tot = MISSIONS.filter(m => m.lang === k), d = tot.filter(m => S.done.includes(m.id)).length;
    return `<button data-lang="${k}" class="${k === ui.lang ? "on" : ""}"><span>${l.name}</span><span class="mut">${d}/${tot.length}</span></button>`; }).join("")}</div></aside>
  <section><div class="panel" style="margin-bottom:14px"><p class="mut">${F().handler} // ${F().name}</p><h2>${LANGS[ui.lang].name}</h2><p class="mut">${LANGS[ui.lang].why}</p></div>
  <div class="mlist">${list.map(m => { const ok = unlocked(m), dn = S.done.includes(m.id);
    return `<button class="mcard panel ${dn ? "done" : ""}" data-m="${m.id}" ${ok ? "" : "disabled"}><div><div class="mut" style="font-size:11px">TIER ${m.tier} // ${m.concept}</div><h3 style="margin:4px 0">${m.title}</h3><div class="mut">${esc(m.brief[S.faction])}</div></div><span class="chip">${dn ? "✓ CLEARED" : ok ? "+" + m.xp + " XP" : "LOCKED"}</span></button>`; }).join("")}</div></section></div>`;
  v.onclick = e => { const l = e.target.closest("[data-lang]")?.dataset.lang; if (l) { ui.lang = l; render(); }
    const m = e.target.closest("[data-m]")?.dataset.m; if (m) { ui.mission = m; render(); } };
}

function missionView(v, m) {
  const code = S.code[m.id] ?? m.starter;
  v.innerHTML = `<button id="back">← Mission board</button>
  <div class="panel" style="margin:12px 0"><p class="mut">${LANGS[m.lang].name.toUpperCase()} // TIER ${m.tier} // ${m.concept}</p><h1>${m.title}</h1><p><b class="acc">${F().handler}:</b> ${esc(m.brief[S.faction])}</p></div>
  <div class="cols"><div class="panel lesson"><h3>Training</h3>${m.lesson}<h3 style="margin-top:16px">Objective</h3><p>${m.task}</p></div>
  <div class="panel"><div class="row" style="justify-content:space-between"><h3>Terminal</h3><span class="mut">${m.test ? "live execution" : "pattern-verified"}</span></div>
  <textarea class="editor" id="ed" spellcheck="false" aria-label="Code editor">${esc(code)}</textarea>
  <div class="row" style="margin:10px 0"><button class="primary" id="run">Execute ▸</button><button id="hint">Hint</button><button id="reset">Reset</button></div>
  <div class="term" id="out"><span class="mut">&gt; awaiting input_</span></div></div></div>`;
  const ed = $("#ed"), out = $("#out");
  ed.addEventListener("keydown", e => { if (e.key === "Tab") { e.preventDefault(); const s = ed.selectionStart; ed.setRangeText("    ", s, ed.selectionEnd, "end"); } if ((e.metaKey || e.ctrlKey) && e.key === "Enter") $("#run").click(); });
  ed.addEventListener("input", () => { S.code[m.id] = ed.value; save(); });
  $("#back").onclick = () => { ui.mission = null; render(); };
  $("#reset").onclick = () => { ed.value = m.starter; S.code[m.id] = m.starter; save(); };
  $("#hint").onclick = () => { const f = m.checks.find(c => !c.re.test(ed.value)); out.innerHTML = `<span class="acc">HINT // </span>${esc(f ? f.hint : "Structure looks right. Execute it.")}`; };
  $("#run").onclick = () => {
    const src = ed.value, lines = [];
    let pass = true;
    m.checks.forEach(c => { const ok = c.re.test(src); pass = pass && ok; lines.push(`<span class="${ok ? "ok" : "bad"}">${ok ? "[✓]" : "[✗]"}</span> ${esc(c.hint)}`); });
    if (m.test && pass) {
      try {
        const fns = new Function(`"use strict";${src}\n;return {${m.exportName.map(n => `${n}: typeof ${n} !== "undefined" ? ${n} : undefined`).join(",")}};`)();
        m.test(fns).forEach(([got, want], i) => { const ok = got === want; pass = pass && ok; lines.push(`<span class="${ok ? "ok" : "bad"}">${ok ? "[✓]" : "[✗]"}</span> test ${i + 1}: got ${esc(JSON.stringify(got))}, expected ${esc(JSON.stringify(want))}`); });
      } catch (err) { pass = false; lines.push(`<span class="bad">[RUNTIME ERROR]</span> ${esc(err.message)}`); }
    }
    if (pass) {
      const first = !S.done.includes(m.id);
      if (first) { const before = level(); S.done.push(m.id); S.xp += m.xp; S.pet.energy = Math.min(100, S.pet.energy + 20); S.pet.bond = Math.min(100, S.pet.bond + 8); save(); snapshot(`Cleared ${m.title}`);
        if (level() > before) toast(`LEVEL ${level()} — your pet is evolving`); else toast(`+${m.xp} XP`); }
      lines.push(`\n<span class="ok">ACCESS GRANTED.</span> ${first ? `+${m.xp} XP. Your pet absorbed the compiled code.` : "Already cleared. Nice run."}`);
    } else lines.push(`\n<span class="bad">ACCESS DENIED.</span> Fix the red lines and run again.`);
    out.innerHTML = lines.join("\n");
  };
}

// ---------- pet ----------
const stage = () => [...PET_STAGES].reverse().find(s => level() >= s.lvl);
function petSVG(p, lv) {
  const col = PET_PARTS.color.find(c => c.id === p.color)?.val || "#3dff7a";
  const st = PET_STAGES.indexOf(stage()); const r = 34 + st * 8;
  const body = st === 0 ? `<rect x="${100 - r}" y="${110 - r}" width="${r * 2}" height="${r * 2}" rx="6" fill="none" stroke="${col}" stroke-width="3"/><rect x="92" y="96" width="16" height="26" fill="${col}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>`
    : st === 1 ? `<ellipse cx="100" cy="112" rx="${r}" ry="${r * .85}" fill="${col}22" stroke="${col}" stroke-width="3"/>`
    : st === 2 ? `<path d="M${100 - r} 130 Q100 ${60 - st * 4} ${100 + r} 130 Q100 ${150 + r * .4} ${100 - r} 130Z" fill="${col}22" stroke="${col}" stroke-width="3"/><path d="M${100 - r} 130 l-14 18 M${100 + r} 130 l14 18" stroke="${col}" stroke-width="3"/>`
    : `<polygon points="${[0, 1, 2, 3, 4, 5].map(i => { const a = Math.PI / 3 * i - Math.PI / 2; return `${100 + Math.cos(a) * r},${112 + Math.sin(a) * r}`; }).join(" ")}" fill="${col}22" stroke="${col}" stroke-width="3"/>${st === 4 ? `<polygon points="${[0, 1, 2, 3, 4, 5].map(i => { const a = Math.PI / 3 * i; return `${100 + Math.cos(a) * r * .6},${112 + Math.sin(a) * r * .6}`; }).join(" ")}" fill="none" stroke="${col}" stroke-width="1.5"/>` : ""}`;
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
  const aura = ({ none: "", rain: [...Array(9)].map((_, i) => `<text x="${20 + i * 20}" y="0" font-size="11" fill="${col}" opacity=".5" font-family="JetBrains Mono">${i % 2}<animate attributeName="y" from="0" to="200" dur="${2 + i % 3}s" repeatCount="indefinite"/></text>`).join(""),
    rings: `<g class="spin"><ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="${col}" opacity=".4"/><circle cx="190" cy="100" r="4" fill="${col}"/></g>`,
    glitch: "" })[p.aura];
  return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(p.name)}, ${stage().name}">${aura}<g class="bob ${p.aura === "glitch" ? "glitch" : ""}" style="filter:drop-shadow(0 0 8px ${col})">${crown}${body}${eyes}</g></svg>`;
}
function pet(v) {
  const p = S.pet, lv = level(), st = stage(), next = PET_STAGES.find(s => s.lvl > lv);
  const opts = (key, label) => `<h3>${label}</h3><div class="opts">${PET_PARTS[key].map(o => { const lock = lv < o.lvl;
    return `<button data-k="${key}" data-v="${o.id}" class="${p[key] === o.id ? "on" : ""}" ${lock ? "disabled" : ""}>${o.label}${lock ? ` <span class="lock">LVL ${o.lvl}</span>` : ""}</button>`; }).join("")}</div>`;
  v.innerHTML = `<div class="pet"><div class="panel"><div class="petstage">${petSVG(p, lv)}</div>
    <div class="row" style="margin-top:12px"><input id="pname" value="${esc(p.name)}" maxlength="16" aria-label="Pet name" style="flex:1;background:#010403;color:var(--acc);border:1px solid var(--line);padding:8px;font:inherit"><button id="feed">Feed a commit</button></div>
    <div class="stat" style="margin-top:12px"><span style="width:60px">Energy</span><div class="bar"><i style="width:${p.energy}%"></i></div></div>
    <div class="stat"><span style="width:60px">Bond</span><div class="bar"><i style="width:${p.bond}%"></i></div></div></div>
  <div class="panel"><p class="mut">FORM ${PET_STAGES.indexOf(st) + 1}/${PET_STAGES.length}</p><h2>${st.name}</h2><p>${st.desc}</p>
    <p class="mut">${next ? `Next evolution: <b class="acc">${next.name}</b> at level ${next.lvl}. Clear missions to grow it. Your pet only evolves as far as your skills do.` : "Final form reached. It knows what you know."}</p>
    <p class="mut">Missions cleared: ${S.done.length}/${MISSIONS.length} · Languages touched: ${new Set(S.done.map(id => MISSIONS.find(m => m.id === id)?.lang)).size}/${Object.keys(LANGS).length}</p>
    ${opts("color", "Core color")}${opts("eyes", "Optics")}${opts("crown", "Crown")}${opts("aura", "Aura")}</div></div>`;
  v.onclick = e => { const b = e.target.closest("[data-k]"); if (b && !b.disabled) { p[b.dataset.k] = b.dataset.v; save(); render(); }
    if (e.target.id === "feed") { if (p.energy >= 100) toast(`${p.name} is full. Go clear a mission.`); else { p.energy = Math.min(100, p.energy + 5); p.bond = Math.min(100, p.bond + 1); save(); render(); toast(`${p.name} ate a commit`); } } };
  $("#pname").onchange = e => { p.name = e.target.value.trim() || "NULL"; save(); };
}

// ---------- intel ----------
function intel(v) {
  v.onclick = null;
  v.innerHTML = `<div class="panel" style="margin-bottom:14px"><h2>Intel archive</h2><p class="mut">Real incidents the missions are based on, summarized for training. ${esc(F().lore)}</p>
  <div class="row"><span class="mut">Defect to:</span>${Object.entries(FACTIONS).map(([k, f]) => `<button data-f="${k}" ${k === S.faction ? "disabled" : ""}>${f.short}</button>`).join("")}</div></div>
  <div class="intel">${INTEL.sort((a, b) => a.year - b.year).map(i => `<div class="panel"><span class="chip">${i.year}</span><h3 style="margin-top:8px">${i.name}</h3><p class="mut">${i.note}</p></div>`).join("")}</div>`;
  v.onclick = e => { const f = e.target.closest("[data-f]")?.dataset.f; if (f) { snapshot("Before defecting"); S.faction = f; save(); toast(`You now work for ${FACTIONS[f].name}`); render(); } };
}

// ---------- backup ----------
function backup(v) {
  let snaps = []; try { snaps = JSON.parse(store.get(SNAP)) || []; } catch {}
  const json = JSON.stringify(S, null, 2);
  v.innerHTML = `<div class="cols"><div class="panel"><h2>Back up your save</h2><p class="mut"><b class="acc">Progress lives in this session.</b> Download or copy a backup before you close the tab, then restore it next time. Same format as the Swift Playgrounds app, so a backup made here restores there and the other way around.</p>
    <div class="row"><button class="primary" id="dl">Download .json</button><button id="cp">Copy to clipboard</button></div>
    <textarea class="backup" id="bx" readonly style="margin-top:10px">${esc(json)}</textarea></div>
  <div class="panel"><h2>Restore</h2><p class="mut">Load a backup file or paste the JSON. Your current progress is snapshotted first, so a restore can be undone.</p>
    <div class="row"><label class="chip" style="cursor:pointer;padding:8px 14px">Choose file<input type="file" id="file" accept=".json,application/json" hidden></label></div>
    <textarea class="backup" id="paste" placeholder="Paste backup JSON here" style="margin-top:10px"></textarea>
    <div class="row" style="margin-top:8px"><button class="primary" id="imp">Restore pasted save</button><button id="wipe">Start over</button></div>
    <h3 style="margin-top:18px">Auto snapshots</h3><p class="mut">Taken after every cleared mission, plus before restores and defections.</p>
    <div class="mlist">${snaps.length ? snaps.map((s, i) => `<div class="row panel" style="justify-content:space-between;padding:10px"><span>${esc(s.label)}<br><span class="mut">${new Date(s.at).toLocaleString()} · ${s.data.xp} XP</span></span><button data-snap="${i}">Restore</button></div>`).join("") : `<p class="mut">No snapshots yet. Clear a mission.</p>`}</div></div></div>`;
  const restore = (d, label) => {
    if (!d || d.format !== "rootaccess-save") return toast("That doesn't look like a ROOT//ACCESS save");
    snapshot("Before " + label); S = Object.assign(fresh(), d, { pet: Object.assign(fresh().pet, d.pet) }); save(); toast("Save restored"); ui.view = "missions"; render();
  };
  $("#dl").onclick = () => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([json], { type: "application/json" })); a.download = `rootaccess-backup-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); toast("Backup downloaded"); };
  $("#cp").onclick = async () => { try { await navigator.clipboard.writeText(json); toast("Copied"); } catch { $("#bx").select(); toast("Select-all ready, press Ctrl/Cmd+C"); } };
  $("#file").onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { restore(JSON.parse(t), "file restore"); } catch { toast("Couldn't read that file"); } }); };
  $("#imp").onclick = () => { try { restore(JSON.parse($("#paste").value), "paste restore"); } catch { toast("Invalid JSON"); } };
  $("#wipe").onclick = e => { if (e.target.dataset.armed) { snapshot("Before wipe"); S = fresh(); save(); render(); } else { e.target.dataset.armed = 1; e.target.textContent = "Click again to confirm"; } };
  v.onclick = e => { const i = e.target.closest("[data-snap]")?.dataset.snap; if (i != null) restore(snaps[i].data, "snapshot restore"); };
}

render();
})();
