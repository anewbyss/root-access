// Bridge loaded after the curriculum inside JavaScriptCore (Swift app). Exposes plain-JSON functions on RAX
// so Swift never touches RegExp objects or HTML. Also polyfills what JSC lacks (console, btoa, atob).
(function (g) {
  if (typeof g.console === "undefined") g.console = { log: function () {}, warn: function () {}, error: function () {} };
  var A = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  if (typeof g.btoa === "undefined") g.btoa = function (s) {
    var o = "", i = 0;
    while (i < s.length) {
      var a = s.charCodeAt(i++), b = s.charCodeAt(i++), c = s.charCodeAt(i++), n = (a << 16) | ((b || 0) << 8) | (c || 0);
      o += A[(n >> 18) & 63] + A[(n >> 12) & 63] + (isNaN(b) ? "=" : A[(n >> 6) & 63]) + (isNaN(c) ? "=" : A[n & 63]);
    }
    return o;
  };
  if (typeof g.atob === "undefined") g.atob = function (s) {
    s = String(s).replace(/[^A-Za-z0-9+/]/g, "");
    var o = "", i = 0;
    while (i < s.length) {
      var a = A.indexOf(s[i++]), b = A.indexOf(s[i++]), c = i < s.length ? A.indexOf(s[i++]) : -1, d = i < s.length ? A.indexOf(s[i++]) : -1;
      var n = (a << 18) | (b << 12) | ((c < 0 ? 0 : c) << 6) | (d < 0 ? 0 : d);
      o += String.fromCharCode((n >> 16) & 255);
      if (c >= 0) o += String.fromCharCode((n >> 8) & 255);
      if (d >= 0) o += String.fromCharCode(n & 255);
    }
    return o;
  };
  var RA = g.RA;
  var BY = {};
  RA.missions.forEach(function (m) { BY[m.id] = m; });
  var ent = function (s) { return s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"); };
  var strip = function (h) { return ent(String(h || "").replace(/<[^>]+>/g, "")).trim(); };
  var segs = function (h) {
    var out = [];
    String(h || "").split(/(<pre>[\s\S]*?<\/pre>)/).forEach(function (seg) {
      if (!seg.trim()) return;
      var code = seg.indexOf("<pre>") === 0;
      out.push({ code: code, text: code ? ent(seg.replace(/<\/?pre>/g, "")).replace(/\n+$/, "") : strip(seg) });
    });
    return out;
  };
  var meta = function (m) { return RA.harnessMeta(m.lang in { basics: 1, python: 1, javascript: 1, typescript: 1, sql: 1 } ? "" : RA.HARNESS[m.id] || ""); };
  var src = function (k) { var s = RA.SOURCES[k]; return s ? { label: s.label, url: s.url } : { label: k, url: "" }; };
  g.RAX = {
    data: function () {
      var langs = Object.keys(RA.langs).map(function (k) {
        var l = RA.langs[k];
        return { id: k, name: l.name, tag: l.tag, why: l.why, engine: RA.ENGINES[k].label, ci: RA.CI_TOOLCHAINS[k] || "", track: !!l.track };
      });
      var dossiers = {};
      Object.keys(RA.DOSSIERS).forEach(function (k) {
        var d = RA.DOSSIERS[k];
        dossiers[k] = {
          tagline: d.tagline, relevance: d.relevance, next: d.next || "",
          stats: d.stats.map(function (s) { return { label: s[0], value: s[1], source: src(s[2]) }; }),
          relSrc: (d.relSrc || []).map(src), learn: (d.learn || []).map(src),
          pros: d.pros, cons: d.cons, bestFor: d.bestFor, avoid: d.avoid
        };
      });
      var factions = Object.keys(RA.FACTIONS).map(function (k) { var f = RA.FACTIONS[k]; return { id: k, name: f.name, short: f.short, color: f.color, handler: f.handler, creed: f.creed, pitch: f.pitch, lore: f.lore }; });
      var parts = {};
      Object.keys(RA.PET_PARTS).forEach(function (k) { parts[k] = RA.PET_PARTS[k].map(function (p) { return { id: p.id, label: p.label, lvl: p.lvl, hex: p.val || null, fluent: p.fluent || null, faction: p.faction || null }; }); });
      return JSON.stringify({
        missions: RA.missions.map(function (m) {
          var mt = meta(m);
          return { id: m.id, lang: m.lang, rank: m.rank, module: m.module, xp: m.xp, title: m.title, concept: m.concept,
            lesson: segs(m.lesson), task: strip(m.task), starter: m.starter, ciOnly: mt.ciOnly || null,
            checkpoints: mt.checkpoints || [], solution: (RA.SOLUTIONS && RA.SOLUTIONS[m.id]) || "",
            steps: RA.stepsFor(m).map(strip), keyTerms: RA.keyTerms(m, 6) };
        }),
        langs: langs, factions: factions, dossiers: dossiers, modules: RA.MODULES,
        intel: RA.INTEL.slice().sort(function (a, b) { return a.year - b.year; }),
        petStages: RA.PET_STAGES, petParts: parts,
        praxis: { stages: RA.PRAXIS.stages, selfExplain: RA.PRAXIS.selfExplain, fadeAfter: RA.PRAXIS.fadeAfter,
          evidence: RA.PRAXIS.evidence.map(function (e) { return { claim: e.claim, source: src(e.src) }; }) },
        judge0: RA.judge0Hosts,
        local: (function () { var o = {}; Object.keys(RA.LOCAL || {}).forEach(function (k) { o[k] = RA.LOCAL[k].kind; }); return o; })(),
        orient: (function () { var o = {}; Object.keys(RA.ORIENT).forEach(function (k) { var x = RA.ORIENT[k];
          o[k] = { run: strip(x.run), file: strip(x.file), out: strip(x.out), comment: strip(x.comment), gotchas: x.gotchas.map(strip) }; }); return o; })()
      });
    },
    brief: function (id, faction) { return RA.brief(BY[id], faction); },
    structure: function (id, code) {
      return JSON.stringify(BY[id].checks.map(function (c) { c.re.lastIndex = 0; return { ok: c.re.test(code), hint: c.hint }; }));
    },
    // Hint ladder, linked to this mission's own steps, checks, checkpoints and reference solution.
    hint: function (id, code, reportJSON, tier) {
      var m = BY[id], rep = reportJSON ? JSON.parse(reportJSON) : null;
      var h = RA.hint(m, code, rep, Number(tier), (RA.SOLUTIONS && RA.SOLUTIONS[id]) || "");
      return JSON.stringify({ tier: h.tier, title: h.title, kind: h.kind, text: strip(h.html), step: h.step == null ? null : h.step,
        lines: h.lines || null, answer: h.answer || null, pieces: !!h.pieces, code: h.code || null });
    },
    explain: function (id, resultJSON) { return strip(RA.explain(BY[id], JSON.parse(resultJSON))); },
    joinPieces: function (partsJSON) { return RA.joinPieces(JSON.parse(partsJSON)); },
    request: function (id, code, cfg) { return JSON.stringify(RA.judge0Request(BY[id], code, JSON.parse(cfg || "{}"))); },
    // Pet (see curriculum/_pet.js): display list for Canvas, and the personality export.
    petArt: function (petJSON, stage) { return JSON.stringify(RA.petArt(JSON.parse(petJSON || "{}"), Number(stage))); },
    persona: function (saveJSON) { return JSON.stringify(RA.persona(JSON.parse(saveJSON || "{}")), null, 2); },
    personaCard: function (saveJSON) { return RA.personaCard(RA.persona(JSON.parse(saveJSON || "{}"))); },
    // On-device runs (see curriculum/_local.js): compose, then report in the same shape as finish().
    localPlan: function (id, code) { var p = RA.localPlan(BY[id], code); return JSON.stringify(p ? { kind: p.kind, src: p.src } : { kind: "none", src: "" }); },
    jsShim: function () { return RA.JS_SHIM; },
    localFinish: function (id, stdout, status, stderr) {
      var rep = RA.localFinish(BY[id], stdout, status, stderr);
      rep.passed = RA.allPassed(rep);
      delete rep.compile;
      return JSON.stringify(rep);
    },
    finish: function (id, req, resp, code) {
      var rep = RA.judge0Finish(BY[id], JSON.parse(req), JSON.parse(resp), code);
      rep.passed = RA.allPassed(rep);
      rep.time = rep.time == null ? null : String(rep.time);
      delete rep.memory; delete rep.compile;
      return JSON.stringify(rep);
    }
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
