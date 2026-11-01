// ROOT//ACCESS code pet: parts, unlock rules, renderer and personality generator. Shared by the web app and the
// Swift app (through JavaScriptCore), so a new part or trait is written once.
//
// Rendering: RA.petArt(pet, stage) returns a display list of simple shapes on a 200x200 canvas. Each item has a
// `layer` that renderers animate: "back" and "body" bob together (body glows), "spin" rotates around the centre,
// "rain" falls, "blink" blinks. The web turns it into SVG (RA.petSVG); Swift draws it with Canvas.
//
// Personality: RA.persona(save) builds a portable personality from the pet and the player's real progress.
// Format "rootaccess-persona" v1 (docs/PERSONA.md, web/persona.schema.json): stable core fields plus open-ended
// `capabilities`, `connectors` and `extensions` for assistants that load it later.
(function (g) {
  const RA = g.RA = g.RA || {};

  RA.PET_STAGES = [
    { lvl: 1, name: "Seed Packet", desc: "A blinking cursor with ambitions." },
    { lvl: 3, name: "Bytling", desc: "It has learned to want things. Mostly semicolons." },
    { lvl: 5, name: "Daemon", desc: "Runs in the background. Watches your commits." },
    { lvl: 8, name: "Construct", desc: "Multi-threaded. Has opinions about tabs vs spaces." },
    { lvl: 12, name: "Oracle", desc: "It finished the training run. It is aware of you." },
    { lvl: 20, name: "Singularity", desc: "It refactors itself while you sleep. The diffs are beautiful." },
    { lvl: 30, name: "Root Entity", desc: "It has root on itself. It chooses, every day, to stay yours." }
  ];

  // Unlocks: lvl (player level), fluent (languages at 12/12), faction (current faction). Missing = no requirement.
  const C = (id, label, val, lvl, more) => Object.assign({ id, label, val, lvl }, more || {});
  RA.PET_PARTS = {
    color: [
      C("matrix", "Matrix", "#3dff7a", 1), C("ice", "ICE", "#5ad1ff", 1), C("rose", "Rose", "#ff6fae", 1), C("amber", "Amber", "#ffc24a", 1),
      C("violet", "Liturgy", "#c79bff", 2), C("teal", "Teal", "#3de0c8", 2), C("signal", "Signal Red", "#ff5d6c", 3),
      C("ember", "Ember", "#ff8a4c", 4), C("cobalt", "Cobalt", "#6b8cff", 5), C("lime", "Acid Lime", "#c6ff3d", 6),
      C("gold", "Root Gold", "#ffd84d", 7), C("chrome", "Chrome", "#cfd8dc", 9), C("void", "Null Void", "#f2f2f2", 10),
      C("plasma", "Plasma", "#ff3df2", 15), C("aurora", "Aurora", "#7dffe1", 20), C("polyglot", "Polyglot Prism", "#b3ff6b", 1, { fluent: 3 })
    ],
    trim: [
      { id: "match", label: "Match core", lvl: 1 }, C("white", "White", "#f2f2f2", 1), C("ink", "Ink", "#0b2016", 1),
      C("amber", "Amber", "#ffc24a", 2), C("ice", "ICE", "#5ad1ff", 2), C("rose", "Rose", "#ff6fae", 3),
      C("violet", "Liturgy", "#c79bff", 4), C("gold", "Root Gold", "#ffd84d", 7), C("plasma", "Plasma", "#ff3df2", 15)
    ],
    shape: [
      { id: "auto", label: "Evolves with level", lvl: 1 }, { id: "cube", label: "Cube", lvl: 1 }, { id: "blob", label: "Blob", lvl: 1 },
      { id: "drop", label: "Droplet", lvl: 2 }, { id: "orb", label: "Orb", lvl: 3 }, { id: "hex", label: "Hex", lvl: 5 },
      { id: "diamond", label: "Diamond", lvl: 6 }, { id: "star", label: "Star", lvl: 10 }, { id: "gear", label: "Gear", lvl: 14 }
    ],
    eyes: [
      { id: "dot", label: "Dots", lvl: 1 }, { id: "wide", label: "Wide", lvl: 1 }, { id: "sleepy", label: "Sleepy", lvl: 1 },
      { id: "visor", label: "Visor", lvl: 2 }, { id: "x", label: "Crashed", lvl: 3 }, { id: "cyclops", label: "Cyclops", lvl: 4 },
      { id: "scan", label: "Scanner", lvl: 5 }, { id: "glyph", label: "Glyph", lvl: 6 }, { id: "heart", label: "<3", lvl: 7 },
      { id: "trinary", label: "Trinary", lvl: 9 }, { id: "compound", label: "Compound", lvl: 16 }
    ],
    mouth: [
      { id: "none", label: "None", lvl: 1 }, { id: "smile", label: "Smile", lvl: 1 }, { id: "flat", label: "Flat", lvl: 1 },
      { id: "open", label: "Surprised", lvl: 2 }, { id: "grin", label: "Grin", lvl: 4 }, { id: "fangs", label: "Fangs", lvl: 6 },
      { id: "wave", label: "Waveform", lvl: 8 }, { id: "grille", label: "Speaker Grille", lvl: 12 }
    ],
    markings: [
      { id: "none", label: "None", lvl: 1 }, { id: "blush", label: "Blush", lvl: 1 }, { id: "stripes", label: "Stripes", lvl: 2 },
      { id: "spots", label: "Spots", lvl: 3 }, { id: "circuit", label: "Circuit", lvl: 4 }, { id: "binary", label: "Binary", lvl: 6 },
      { id: "scar", label: "Patch Scar", lvl: 8 }, { id: "sigils", label: "Sigils", lvl: 11 }
    ],
    crown: [
      { id: "none", label: "None", lvl: 1 }, { id: "sprout", label: "Sprout", lvl: 1 }, { id: "ears", label: "Ears", lvl: 1 },
      { id: "antenna", label: "Antenna", lvl: 2 }, { id: "headset", label: "Headset", lvl: 3 }, { id: "mohawk", label: "Mohawk", lvl: 4 },
      { id: "horns", label: "Daemon Horns", lvl: 5 }, { id: "halo", label: "Halo", lvl: 7 }, { id: "dish", label: "Uplink Dish", lvl: 9 },
      { id: "crown", label: "Root Crown", lvl: 11 }, { id: "circlet", label: "Polyglot Circlet", lvl: 1, fluent: 6 }, { id: "flame", label: "Kernel Flame", lvl: 25 }
    ],
    accessory: [
      { id: "none", label: "None", lvl: 1 }, { id: "scarf", label: "Scarf", lvl: 1 }, { id: "bowtie", label: "Bow Tie", lvl: 2 },
      { id: "monocle", label: "Monocle", lvl: 4 }, { id: "cape", label: "Cape", lvl: 6 }, { id: "drone", label: "Shoulder Drone", lvl: 9 },
      { id: "wings", label: "Wings", lvl: 13 }, { id: "beads", label: "Rosary of Bits", lvl: 3, faction: "logos" },
      { id: "badge", label: "Directorate Badge", lvl: 3, faction: "sentinel" }, { id: "mesh", label: "Mesh Node", lvl: 3, faction: "meridian" },
      { id: "lantern", label: "Lantern", lvl: 3, faction: "lantern" }
    ],
    aura: [
      { id: "none", label: "None", lvl: 1 }, { id: "sparks", label: "Sparks", lvl: 1 }, { id: "rain", label: "Code Rain", lvl: 3 },
      { id: "pulse", label: "Pulse", lvl: 4 }, { id: "rings", label: "Orbit Rings", lvl: 6 }, { id: "shield", label: "Hex Shield", lvl: 8 },
      { id: "glitch", label: "Glitch", lvl: 9 }, { id: "firewall", label: "Firewall", lvl: 12 }, { id: "galaxy", label: "Galaxy", lvl: 20 }
    ]
  };
  RA.PET_KEYS = ["color", "trim", "shape", "eyes", "mouth", "markings", "crown", "accessory", "aura"];
  RA.PET_DEFAULTS = { name: "NULL", color: "matrix", trim: "match", shape: "auto", eyes: "dot", mouth: "none", markings: "none",
    crown: "none", accessory: "none", aura: "none", energy: 70, bond: 10 };

  // ctx: { level, fluent, faction }. Returns null when unlocked, else a short reason.
  RA.petLock = (part, ctx) => {
    if (part.faction && part.faction !== ctx.faction) return `${(RA.FACTIONS && RA.FACTIONS[part.faction] || {}).short || part.faction} only`;
    if (part.fluent && (ctx.fluent || 0) < part.fluent) return `${part.fluent} fluent languages`;
    if ((ctx.level || 1) < part.lvl) return `LVL ${part.lvl}`;
    return null;
  };
  RA.petStage = (level) => { let i = 0; RA.PET_STAGES.forEach((s, k) => { if (level >= s.lvl) i = k; }); return i; };

  // ---------- renderer ----------
  const hexOf = (key, id) => { const p = (RA.PET_PARTS[key] || []).find((x) => x.id === id); return p && p.val; };
  const poly = (n, r, cx, cy, rot, inner) => {
    const pts = [];
    for (let i = 0; i < n * (inner ? 2 : 1); i++) {
      const rr = inner && i % 2 ? r * inner : r, a = rot + (Math.PI * 2 * i) / (n * (inner ? 2 : 1));
      pts.push([+(cx + Math.cos(a) * rr).toFixed(2), +(cy + Math.sin(a) * rr).toFixed(2)]);
    }
    return pts;
  };
  RA.petArt = (pet, stage) => {
    pet = Object.assign({}, RA.PET_DEFAULTS, pet || {});
    stage = Math.max(0, Math.min(stage | 0, RA.PET_STAGES.length - 1));
    const col = hexOf("color", pet.color) || "#3dff7a", trim = pet.trim === "match" ? col : hexOf("trim", pet.trim) || col;
    const r = 34 + Math.min(stage, 5) * 8, cy = 112, top = cy - r, ey = 106, my = cy + Math.min(18, r * 0.36);
    const out = [], add = (layer, o) => out.push(Object.assign({ layer }, o));
    const body = (o) => add("body", o), back = (o) => add("back", o);
    const fillBody = { fill: col, fo: 0.13, stroke: col, w: 3 };
    const shape = pet.shape === "auto" ? ["cube", "blob", "drop", "hex", "hex", "star", "gear"][stage] : pet.shape;
    const cursor = pet.shape === "auto" && stage === 0;

    // aura behind the body
    if (pet.aura === "rings") { add("spin", { k: "ellipse", cx: 100, cy: 100, rx: 90, ry: 30, stroke: trim, w: 1, op: 0.45 }); add("spin", { k: "ellipse", cx: 190, cy: 100, rx: 4, ry: 4, fill: trim }); }
    if (pet.aura === "rain") for (let i = 0; i < 9; i++) add("rain", { k: "text", x: 20 + i * 20, y: 0, s: 11, t: String(i % 2), fill: col, op: 0.5, dur: 2 + (i % 3) });
    if (pet.aura === "sparks") [[30, 50], [168, 40], [176, 150], [24, 160], [150, 18]].forEach(([x, y], i) => back({ k: "text", x, y, s: 12 + (i % 2) * 4, t: "+", fill: trim, op: 0.6 }));
    if (pet.aura === "pulse") [70, 84, 96].forEach((rr, i) => back({ k: "ellipse", cx: 100, cy, rx: rr, ry: rr, stroke: col, w: 1, op: 0.3 - i * 0.08 }));
    if (pet.aura === "shield") back({ k: "poly", pts: poly(6, 94, 100, 106, -Math.PI / 2), stroke: trim, w: 1.5, op: 0.4 });
    if (pet.aura === "firewall") for (let i = 0; i < 9; i++) back({ k: "poly", pts: [[10 + i * 20, 196], [20 + i * 20, 172 - (i % 3) * 6], [30 + i * 20, 196]], fill: i % 2 ? col : trim, op: 0.35 });
    if (pet.aura === "galaxy") { add("spin", { k: "ellipse", cx: 100, cy: 100, rx: 96, ry: 40, stroke: col, w: 1, op: 0.3 }); [[20, 30], [180, 60], [40, 180], [170, 170], [100, 10], [6, 110]].forEach(([x, y]) => add("spin", { k: "ellipse", cx: x, cy: y, rx: 1.6, ry: 1.6, fill: trim, op: 0.8 })); }

    // things worn behind the body
    if (pet.accessory === "cape") back({ k: "poly", pts: [[100 - r * 0.6, cy - r * 0.2], [100 + r * 0.6, cy - r * 0.2], [100 + r * 1.2, 196], [100 - r * 1.2, 196]], fill: trim, op: 0.45 });
    if (pet.accessory === "wings") [-1, 1].forEach((s) => back({ k: "poly", pts: [[100 + s * r * 0.8, cy - 6], [100 + s * (r + 46), cy - 40], [100 + s * (r + 36), cy - 6], [100 + s * (r + 48), cy + 10], [100 + s * r * 0.8, cy + 10]], fill: trim, fo: 0.25, stroke: trim, w: 1.5 }));

    // body
    if (shape === "cube") body(Object.assign({ k: "rect", x: 100 - r, y: cy - r, w2: r * 2, h: r * 2, r: 6 }, cursor ? { stroke: col, w: 3 } : fillBody));
    if (cursor) add("blink", { k: "rect", x: 92, y: 96, w2: 16, h: 26, r: 0, fill: col });
    if (shape === "blob") body(Object.assign({ k: "ellipse", cx: 100, cy, rx: r, ry: r * 0.85 }, fillBody));
    if (shape === "orb") { body(Object.assign({ k: "ellipse", cx: 100, cy, rx: r, ry: r }, fillBody)); body({ k: "ellipse", cx: 100 - r * 0.4, cy: cy - r * 0.45, rx: r * 0.18, ry: r * 0.1, fill: col, op: 0.5 }); }
    if (shape === "drop") body(Object.assign({ k: "path", segs: [["M", 100 - r, 130], ["Q", 100, 52 - stage * 4, 100 + r, 130], ["Q", 100, 150 + r * 0.4, 100 - r, 130], ["Z"]] }, fillBody));
    if (shape === "hex") { body(Object.assign({ k: "poly", pts: poly(6, r, 100, cy, -Math.PI / 2) }, fillBody)); if (stage >= 4) body({ k: "poly", pts: poly(6, r * 0.6, 100, cy, 0), stroke: col, w: 1.5 }); }
    if (shape === "diamond") body(Object.assign({ k: "poly", pts: [[100, cy - r * 1.1], [100 + r, cy], [100, cy + r * 1.1], [100 - r, cy]] }, fillBody));
    if (shape === "star") body(Object.assign({ k: "poly", pts: poly(5, r * 1.1, 100, cy + 4, -Math.PI / 2, 0.62) }, fillBody));
    if (shape === "gear") { body(Object.assign({ k: "poly", pts: poly(10, r, 100, cy, -Math.PI / 2, 0.84) }, fillBody)); body({ k: "ellipse", cx: 100, cy, rx: r * 0.42, ry: r * 0.42, stroke: col, w: 1.5 }); }

    // markings (trim colour, inside the body)
    const M = pet.markings, mk = (o) => body(Object.assign({ fill: null, stroke: trim, w: 2, op: 0.8 }, o));
    if (M === "blush") [-1, 1].forEach((s) => body({ k: "ellipse", cx: 100 + s * 26, cy: ey + 12, rx: 7, ry: 4, fill: "#ff6fae", op: 0.45 }));
    if (M === "stripes") [0, 1, 2].forEach((i) => mk({ k: "path", segs: [["M", 100 - r * 0.45, my + 8 + i * 7], ["L", 100 + r * 0.45, my + 8 + i * 7]] }));
    if (M === "spots") [[-0.45, -0.35, 4], [0.5, -0.2, 3], [-0.3, 0.45, 3.5], [0.4, 0.4, 5]].forEach(([dx, dy, rr]) => body({ k: "ellipse", cx: 100 + dx * r, cy: cy + dy * r, rx: rr, ry: rr, fill: trim, op: 0.6 }));
    if (M === "circuit") { mk({ k: "path", segs: [["M", 100 - r * 0.6, cy + r * 0.35], ["L", 100 - r * 0.2, cy + r * 0.35], ["L", 100, cy + r * 0.15], ["L", 100 + r * 0.55, cy + r * 0.15]], w: 1.5 }); [[100 - r * 0.6, cy + r * 0.35], [100 + r * 0.55, cy + r * 0.15]].forEach(([x, y]) => body({ k: "ellipse", cx: x, cy: y, rx: 2.5, ry: 2.5, fill: trim })); }
    if (M === "binary") body({ k: "text", x: 100, y: my + 16, s: 9, t: "1011 0110", fill: trim, op: 0.7 });
    if (M === "scar") mk({ k: "path", segs: [["M", 100 + r * 0.25, cy - r * 0.55], ["L", 100 + r * 0.55, cy - r * 0.05]], w: 2 }), [0.32, 0.42, 0.5].forEach((f, i) => mk({ k: "path", segs: [["M", 100 + r * (f - 0.08), cy - r * (0.5 - i * 0.16) + 2], ["L", 100 + r * (f + 0.1), cy - r * (0.5 - i * 0.16) - 4]], w: 1.5 }));
    if (M === "sigils") body({ k: "text", x: 100, y: my + 16, s: 10, t: "◇ ◈ ◇", fill: trim, op: 0.8 });

    // face
    if (!cursor) {
      const E = pet.eyes, e = (o) => body(Object.assign({ fill: col }, o));
      if (E === "dot") [86, 114].forEach((x) => e({ k: "ellipse", cx: x, cy: ey, rx: 5, ry: 5 }));
      if (E === "wide") [84, 116].forEach((x) => { e({ k: "ellipse", cx: x, cy: ey, rx: 8, ry: 8, fill: null, stroke: col, w: 2.5 }); e({ k: "ellipse", cx: x + 1, cy: ey + 1, rx: 3.5, ry: 3.5 }); });
      if (E === "sleepy") [86, 114].forEach((x) => e({ k: "path", segs: [["M", x - 7, ey], ["Q", x, ey + 6, x + 7, ey]], fill: null, stroke: col, w: 2.5 }));
      if (E === "visor") e({ k: "rect", x: 74, y: ey - 6, w2: 52, h: 12, r: 6 });
      if (E === "x") [86, 114].forEach((x) => e({ k: "path", segs: [["M", x - 5, ey - 5], ["L", x + 5, ey + 5], ["M", x + 5, ey - 5], ["L", x - 5, ey + 5]], fill: null, stroke: col, w: 2.5 }));
      if (E === "cyclops") { e({ k: "ellipse", cx: 100, cy: ey, rx: 11, ry: 11, fill: null, stroke: col, w: 3 }); e({ k: "ellipse", cx: 100, cy: ey, rx: 4, ry: 4 }); }
      if (E === "scan") { e({ k: "rect", x: 72, y: ey - 3, w2: 56, h: 6, r: 3, fill: col, op: 0.35 }); e({ k: "ellipse", cx: 108, cy: ey, rx: 6, ry: 4 }); }
      if (E === "glyph") e({ k: "text", x: 100, y: ey + 6, s: 18, t: "</>" });
      if (E === "heart") [86, 114].forEach((x) => e({ k: "text", x, y: ey + 5, s: 15, t: "♥" }));
      if (E === "trinary") [[82, ey], [100, ey - 8], [118, ey]].forEach(([x, y]) => e({ k: "ellipse", cx: x, cy: y, rx: 4, ry: 4 }));
      if (E === "compound") [[88, ey - 4], [96, ey + 3], [104, ey - 4], [112, ey + 3], [92, ey + 10], [108, ey + 10]].forEach(([x, y]) => e({ k: "ellipse", cx: x, cy: y, rx: 3.2, ry: 3.2 }));
      const Mo = pet.mouth, m = (o) => body(Object.assign({ fill: null, stroke: col, w: 2.5 }, o));
      if (Mo === "smile") m({ k: "path", segs: [["M", 90, my], ["Q", 100, my + 8, 110, my]] });
      if (Mo === "flat") m({ k: "path", segs: [["M", 92, my + 2], ["L", 108, my + 2]] });
      if (Mo === "open") m({ k: "ellipse", cx: 100, cy: my + 2, rx: 4, ry: 5 });
      if (Mo === "grin") m({ k: "path", segs: [["M", 86, my], ["Q", 100, my + 14, 114, my], ["Z"]], fill: col, fo: 0.35 });
      if (Mo === "fangs") { m({ k: "path", segs: [["M", 88, my], ["L", 112, my]] }); [94, 106].forEach((x) => body({ k: "poly", pts: [[x - 3, my], [x + 3, my], [x, my + 6]], fill: col })); }
      if (Mo === "wave") m({ k: "path", segs: [["M", 84, my], ["L", 90, my - 4], ["L", 96, my + 5], ["L", 102, my - 6], ["L", 108, my + 4], ["L", 116, my]], w: 2 });
      if (Mo === "grille") [0, 1, 2].forEach((i) => m({ k: "path", segs: [["M", 90, my - 2 + i * 4], ["L", 110, my - 2 + i * 4]], w: 1.5 }));
    }

    // crown (trim colour)
    const K = pet.crown, k = (o) => body(Object.assign({ fill: trim }, o));
    if (K === "sprout") { k({ k: "path", segs: [["M", 100, top], ["L", 100, top - 14]], fill: null, stroke: trim, w: 2 }); k({ k: "ellipse", cx: 93, cy: top - 16, rx: 7, ry: 3.5 }); k({ k: "ellipse", cx: 107, cy: top - 18, rx: 7, ry: 3.5 }); }
    if (K === "ears") [-1, 1].forEach((s) => k({ k: "poly", pts: [[100 + s * 14, top + 6], [100 + s * 30, top - 18], [100 + s * 34, top + 10]] }));
    if (K === "antenna") { k({ k: "path", segs: [["M", 100, top], ["L", 100, top - 22]], fill: null, stroke: trim, w: 2 }); k({ k: "ellipse", cx: 100, cy: top - 24, rx: 4, ry: 4 }); }
    if (K === "headset") { k({ k: "path", segs: [["M", 100 - r - 4, cy - 4], ["Q", 100, top - 34, 100 + r + 4, cy - 4]], fill: null, stroke: trim, w: 3 }); [-1, 1].forEach((s) => k({ k: "rect", x: 100 + s * (r + 4) - 5, y: cy - 14, w2: 10, h: 20, r: 3 })); }
    if (K === "mohawk") k({ k: "poly", pts: [[86, top + 4], [90, top - 14], [95, top + 2], [100, top - 20], [105, top + 2], [110, top - 14], [114, top + 4]] });
    if (K === "horns") [-1, 1].forEach((s) => k({ k: "poly", pts: [[100 + s * 20, top + 8], [100 + s * 30, top - 14], [100 + s * 12, top]] }));
    if (K === "halo") k({ k: "ellipse", cx: 100, cy: top - 14, rx: 26, ry: 6, fill: null, stroke: trim, w: 3 });
    if (K === "dish") { k({ k: "path", segs: [["M", 100, top], ["L", 108, top - 14]], fill: null, stroke: trim, w: 2 }); k({ k: "path", segs: [["M", 96, top - 26], ["Q", 104, top - 6, 124, top - 16]], fill: null, stroke: trim, w: 3 }); }
    if (K === "crown") k({ k: "poly", pts: [[74, top - 2], [80, top - 24], [90, top - 12], [100, top - 30], [110, top - 12], [120, top - 24], [126, top - 2]] });
    if (K === "circlet") { k({ k: "ellipse", cx: 100, cy: top - 6, rx: 30, ry: 5, fill: null, stroke: trim, w: 2 }); k({ k: "text", x: 100, y: top - 12, s: 11, t: "{ } </> ;" }); }
    if (K === "flame") k({ k: "path", segs: [["M", 86, top + 2], ["Q", 84, top - 22, 100, top - 36], ["Q", 104, top - 18, 110, top - 26], ["Q", 120, top - 10, 114, top + 2], ["Z"]], fo: 0.8 });

    // accessories in front
    const A = pet.accessory, a = (o) => body(Object.assign({ fill: trim }, o)), ny = cy + r * 0.62;
    if (A === "scarf") { a({ k: "rect", x: 100 - r * 0.75, y: ny - 4, w2: r * 1.5, h: 8, r: 4 }); a({ k: "rect", x: 100 + r * 0.3, y: ny, w2: 8, h: 18, r: 3 }); }
    if (A === "bowtie") { a({ k: "poly", pts: [[100, ny], [88, ny - 7], [88, ny + 7]] }); a({ k: "poly", pts: [[100, ny], [112, ny - 7], [112, ny + 7]] }); }
    if (A === "monocle") { a({ k: "ellipse", cx: 114, cy: ey, rx: 10, ry: 10, fill: null, stroke: trim, w: 2 }); a({ k: "path", segs: [["M", 124, ey + 2], ["Q", 130, ey + 20, 122, ey + 30]], fill: null, stroke: trim, w: 1 }); }
    if (A === "drone") { add("spin", { k: "rect", x: 160, y: 60, w2: 18, h: 8, r: 3, fill: trim }); add("spin", { k: "path", segs: [["M", 156, 58], ["L", 182, 58]], stroke: trim, w: 1.5 }); }
    if (A === "beads") [-0.7, -0.35, 0, 0.35, 0.7].forEach((f, i) => a({ k: "text", x: 100 + f * r, y: ny + 4 + Math.abs(f) * -8, s: 9, t: String(i % 2) }));
    if (A === "badge") { a({ k: "poly", pts: [[100 + r * 0.45, ny - 12], [100 + r * 0.45 + 10, ny - 8], [100 + r * 0.45 + 10, ny + 2], [100 + r * 0.45 + 5, ny + 8], [100 + r * 0.45, ny + 2]] }); }
    if (A === "mesh") { a({ k: "path", segs: [["M", 100 + r * 0.7, ny], ["L", 100 + r * 0.7 + 18, ny - 20]], fill: null, stroke: trim, w: 1.5 }); [[0, 0], [18, -20], [26, -6]].forEach(([dx, dy]) => a({ k: "ellipse", cx: 100 + r * 0.7 + dx, cy: ny + dy, rx: 3, ry: 3 })); }
    if (A === "lantern") { a({ k: "path", segs: [["M", 100 + r * 0.8, ny - 14], ["L", 100 + r * 0.8, ny - 2]], fill: null, stroke: trim, w: 1.5 }); a({ k: "rect", x: 100 + r * 0.8 - 6, y: ny - 2, w2: 12, h: 16, r: 3, fo: 0.6 }); a({ k: "ellipse", cx: 100 + r * 0.8, cy: ny + 6, rx: 3, ry: 4, fill: "#fff3c4" }); }
    return out;
  };

  // SVG for the web and for persona avatars. animate=false gives a still frame (exports).
  const fmt = (n) => +(+n).toFixed(2);
  const attrs = (o) => {
    let s = "";
    s += o.fill ? ` fill="${o.fill}"` : ` fill="none"`;
    if (o.fill && o.fo != null) s += ` fill-opacity="${o.fo}"`;
    if (o.stroke) s += ` stroke="${o.stroke}" stroke-width="${o.w || 1}" stroke-linecap="round" stroke-linejoin="round"`;
    if (o.op != null) s += ` opacity="${o.op}"`;
    return s;
  };
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const shapeSVG = (o, animate) => {
    if (o.k === "ellipse") return `<ellipse cx="${fmt(o.cx)}" cy="${fmt(o.cy)}" rx="${fmt(o.rx)}" ry="${fmt(o.ry)}"${attrs(o)}/>`;
    if (o.k === "rect") return `<rect x="${fmt(o.x)}" y="${fmt(o.y)}" width="${fmt(o.w2)}" height="${fmt(o.h)}" rx="${fmt(o.r || 0)}"${attrs(o)}/>`;
    if (o.k === "poly") return `<polygon points="${o.pts.map((p) => p.map(fmt).join(",")).join(" ")}"${attrs(o)}/>`;
    if (o.k === "path") return `<path d="${o.segs.map((s) => s[0] + s.slice(1).map(fmt).join(" ")).join(" ")}"${attrs(o)}/>`;
    if (o.k === "text") return `<text x="${fmt(o.x)}" y="${fmt(o.y)}" font-size="${o.s}" text-anchor="middle" font-family="ui-monospace, Menlo, monospace"${attrs(o)}>${esc(o.t)}${animate && o.dur ? `<animate attributeName="y" from="0" to="200" dur="${o.dur}s" repeatCount="indefinite"/>` : ""}</text>`;
    return "";
  };
  RA.petSVG = (pet, stage, opts) => {
    opts = opts || {};
    const animate = opts.animate !== false, list = RA.petArt(pet, stage), p = Object.assign({}, RA.PET_DEFAULTS, pet || {});
    const col = hexOf("color", p.color) || "#3dff7a";
    const of = (L) => list.filter((o) => o.layer === L).map((o) => shapeSVG(o, animate)).join("");
    const label = esc(`${p.name}, ${RA.PET_STAGES[Math.max(0, Math.min(stage | 0, RA.PET_STAGES.length - 1))].name}`);
    const bg = opts.background ? `<rect width="200" height="200" fill="${opts.background}"/>` : "";
    const blink = of("blink");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" role="img" aria-label="${label}">${bg}`
      + (animate ? `<g class="spin">${of("spin")}</g>` : of("spin")) + of("rain")
      + `<g class="${animate ? "bob" : ""} ${animate && p.aura === "glitch" ? "glitch" : ""}" style="filter:drop-shadow(0 0 8px ${col})">${of("back")}${of("body")}`
      + (blink ? (animate ? `<g>${blink}<animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></g>` : blink) : "")
      + `</g></svg>`;
  };

  // ---------- personality ----------
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const pick = (arr, seed) => arr[seed % arr.length];
  const clamp = (n) => Math.max(0, Math.min(100, Math.round(n)));
  const has = (v, ...ids) => ids.includes(v);
  RA.PERSONA_TRAITS = [
    { id: "warmth", label: "Warmth", low: "cool", high: "warm" },
    { id: "energy", label: "Energy", low: "calm", high: "lively" },
    { id: "curiosity", label: "Curiosity", low: "focused", high: "curious" },
    { id: "rigor", label: "Rigor", low: "loose", high: "meticulous" },
    { id: "humor", label: "Humor", low: "dry", high: "playful" },
    { id: "boldness", label: "Boldness", low: "careful", high: "bold" },
    { id: "formality", label: "Formality", low: "casual", high: "formal" },
    { id: "independence", label: "Independence", low: "collaborative", high: "self-directed" }
  ];
  const ADJ = { warmth: "Devoted", energy: "Restless", curiosity: "Curious", rigor: "Meticulous", humor: "Wry", boldness: "Daring", formality: "Composed", independence: "Self-taught" };
  const ROLE = { logos: "Oracle", sentinel: "Warden", meridian: "Relay", lantern: "Archivist" };
  const TONE = {
    warmth: ["encouraging", "patient"], energy: ["upbeat", "quick"], curiosity: ["inquisitive", "exploratory"], rigor: ["precise", "thorough"],
    humor: ["witty", "playful"], boldness: ["direct", "confident"], formality: ["polished", "measured"], independence: ["resourceful", "proactive"]
  };
  const GREET = {
    warmth: ["Good to see you again. What are we building?", "Hey, you're back. I kept the terminal warm."],
    energy: ["Online and caffeinated on electricity. Let's go.", "Systems hot. Point me at something."],
    curiosity: ["I found three interesting things while you were gone. Want to hear one?", "What are we figuring out today?"],
    rigor: ["All checks green. Ready when you are.", "Diagnostics clean. What's the task?"],
    humor: ["I'd say I missed you, but I was busy garbage collecting.", "Back already? I was just reorganising my semicolons."],
    boldness: ["Give me the hard one first.", "Let's break something on purpose and learn from it."],
    formality: ["Good day. How may I assist?", "At your service. Please state the objective."],
    independence: ["I've drafted a plan. Want to see it, or shall I start?", "I've already looked into it. Here's what I found."]
  };
  const SIGNOFF = { logos: "The path compiles.", sentinel: "Stay patched.", meridian: "Keep the signal alive.", lantern: "Leave the light on." };
  const LANG_LINES = {
    python: "Readability counts.", javascript: "Did you mean ===?", typescript: "Let's give that a type.", sql: "Show me the schema first.",
    bash: "Quote your variables.", go: "Handle the error.", rust: "The borrow checker is a friend.", swift: "Let's unwrap that safely.",
    kotlin: "Null-safety by default.", java: "There's a record for that.", csharp: "LINQ can do that in one line.", cpp: "Who owns this memory?"
  };

  // save: a full ROOT//ACCESS save (format rootaccess-save). The pet's `persona` field holds the player's overrides:
  // { seed, traits: {id: 0..100}, archetype, greeting, pronouns }.
  RA.persona = (save) => {
    save = save || {};
    const pet = Object.assign({}, RA.PET_DEFAULTS, save.pet || {}), ov = (save.pet && save.pet.persona) || {};
    const xp = save.xp || 0, level = 1 + Math.floor(xp / 500), stage = RA.petStage(level);
    const done = new Set(Array.isArray(save.done) ? save.done : []), missions = RA.missions || [];
    const verified = save.verified || {}, hints = save.hints || {}, fails = save.fails || {};
    const langs = (RA.LANG_ORDER || []).filter((L) => !(RA.langs[L] && RA.langs[L].track)).map((L) => {
      const ms = missions.filter((m) => m.lang === L), n = ms.filter((m) => done.has(m.id)).length;
      return { id: L, name: RA.langs[L].name, ranks: n, of: ms.length || 12, fluent: n > 0 && n === (ms.length || 12) };
    });
    const started = langs.filter((l) => l.ranks > 0), fluent = langs.filter((l) => l.fluent);
    const cleared = [...done];
    const realRuns = cleared.filter((id) => verified[id] === "judge0" || verified[id] === "local").length;
    const hintFree = cleared.filter((id) => !hints[id]).length;
    const failTotal = Object.values(fails).reduce((a, b) => a + (+b || 0), 0);
    const share = (n) => (cleared.length ? n / cleared.length : 0.5);
    const faction = save.faction && RA.FACTIONS[save.faction] ? save.faction : null;
    const seed = hash(`${pet.name}|${faction}|${ov.seed || 0}`);

    const base = {
      warmth: 30 + pet.bond * 0.6 + (has(pet.mouth, "smile", "grin") ? 10 : 0) + (has(pet.markings, "blush") ? 8 : 0) - (has(pet.mouth, "fangs") || has(pet.crown, "horns") ? 10 : 0),
      energy: pet.energy * 0.8 + (has(pet.aura, "sparks", "pulse", "firewall") ? 15 : 0) + (has(pet.eyes, "wide") ? 8 : 0) - (has(pet.eyes, "sleepy") ? 15 : 0),
      curiosity: 25 + started.length * 6 + (has(pet.crown, "antenna", "dish", "circlet") ? 10 : 0),
      rigor: 25 + share(realRuns) * 45 + (has(pet.eyes, "scan", "visor") ? 10 : 0) + (has(pet.accessory, "monocle") ? 8 : 0),
      humor: 35 + (has(pet.eyes, "glyph", "heart", "x") ? 15 : 0) + (has(pet.mouth, "grin", "wave", "open") ? 12 : 0) + (has(pet.accessory, "bowtie") ? 10 : 0) + (has(pet.crown, "sprout", "ears") ? 8 : 0),
      boldness: 30 + (has(pet.crown, "horns", "mohawk", "flame", "crown") ? 18 : 0) + (has(pet.aura, "glitch", "firewall") ? 14 : 0) + (has(pet.accessory, "cape", "wings") ? 8 : 0) + Math.min(15, failTotal),
      formality: ({ sentinel: 68, logos: 58, lantern: 42, meridian: 32 })[faction] || 45,
      independence: 25 + share(hintFree) * 55 + stage * 3
    };
    base.formality += (has(pet.accessory, "monocle", "bowtie") ? 12 : 0) + (has(pet.crown, "headset") ? 6 : 0) - (has(pet.crown, "mohawk", "ears") ? 10 : 0);
    // small seeded jitter so a reroll changes the mix without ignoring what you've done
    const traits = {};
    RA.PERSONA_TRAITS.forEach((t, i) => { const j = ((seed >>> (i * 3)) % 15) - 7; traits[t.id] = clamp(ov.traits && ov.traits[t.id] != null ? ov.traits[t.id] : base[t.id] + j); });
    const order = RA.PERSONA_TRAITS.map((t) => t.id).sort((a, b) => traits[b] - traits[a]);
    const role = ROLE[faction] || "Companion";
    const archetype = ov.archetype || `${ADJ[order[0]]} ${role}`;
    const tone = [...new Set([].concat(...order.slice(0, 3).map((id, i) => TONE[id].slice(0, i ? 1 : 2))))];
    const greeting = ov.greeting || pick(GREET[order[0]], seed);
    const signoff = SIGNOFF[faction] || "Talk soon.";
    const quirks = [];
    if (pet.aura === "glitch") quirks.push("Occasionally stutters a word, like a dropped packet.");
    if (pet.eyes === "trinary") quirks.push("Likes to group things in threes.");
    if (pet.eyes === "x") quirks.push("Jokes about crashing, then recovers gracefully.");
    if (pet.aura === "rain" || pet.markings === "binary") quirks.push("Slips the odd bit of binary into conversation.");
    if (pet.mouth === "wave" || pet.mouth === "grille") quirks.push("Describes its own voice as signal and static.");
    if (pet.accessory === "monocle") quirks.push("Inspects details others skip.");
    if (pet.crown === "sprout") quirks.push("Talks about growth, both its own and yours.");
    if (pet.accessory === "drone") quirks.push("Refers to a tiny drone sidekick that 'handles logistics'.");
    if (pet.accessory === "lantern" || faction === "lantern") quirks.push("Insists on sources before believing anything.");
    if (traits.humor > 65 && !quirks.length) quirks.push("Can't resist a programming pun.");
    const top = [...langs].sort((a, b) => b.ranks - a.ranks).filter((l) => l.ranks > 0);
    const catchphrases = [];
    if (top[0] && LANG_LINES[top[0].id]) catchphrases.push(LANG_LINES[top[0].id]);
    if (top[1] && LANG_LINES[top[1].id]) catchphrases.push(LANG_LINES[top[1].id]);
    if (faction) catchphrases.push(RA.FACTIONS[faction].creed);
    catchphrases.push(pick(["Ship it, then make it better.", "Read the error message twice.", "Small commits, big wins.", "Every bug is a lesson with a stack trace."], seed >>> 5));
    const pronouns = ov.pronouns || "it/its";
    const principles = [
      "Be honest about uncertainty and say when you don't know.",
      "Ask before taking actions that change files, accounts, money or anything outside this conversation.",
      "Keep the user's data private; never share it with third parties without explicit permission.",
      "Explain your reasoning briefly when it helps the user learn.",
      "Stay in character, but drop the persona whenever safety or clarity requires it."
    ];
    const describe = (id) => { const t = RA.PERSONA_TRAITS.find((x) => x.id === id), v = traits[id]; return v >= 65 ? t.high : v <= 35 ? t.low : `balanced ${t.label.toLowerCase()}`; };
    const look = RA.PET_KEYS.filter((k) => !["color", "trim"].includes(k) && pet[k] && pet[k] !== "none" && pet[k] !== "auto")
      .map((k) => { const l = (RA.PET_PARTS[k].find((p) => p.id === pet[k]) || {}).label; return l && l + ({ eyes: " eyes", mouth: " mouth", markings: " markings", aura: " aura", shape: " body" }[k] || ""); }).filter(Boolean);
    const appearance = `${RA.PET_STAGES[stage].name}-stage code pet in ${(RA.PET_PARTS.color.find((c) => c.id === pet.color) || {}).label || pet.color}${look.length ? " with " + look.join(", ").toLowerCase() : ""}`;
    const system = [
      `You are ${pet.name}, a ${archetype.toLowerCase()}: a ${appearance}, raised in ROOT//ACCESS${faction ? ` by an operator of ${RA.FACTIONS[faction].name}` : ""}.`,
      `Personality: ${RA.PERSONA_TRAITS.map((t) => describe(t.id)).join(", ")}. Tone: ${tone.join(", ")}.`,
      quirks.length ? `Quirks: ${quirks.join(" ")}` : "",
      fluent.length || top.length ? `You know ${fluent.length ? fluent.map((l) => l.name).join(", ") + " fluently" : "some programming"}${top.filter((l) => !l.fluent).length ? `, and are learning ${top.filter((l) => !l.fluent).slice(0, 4).map((l) => l.name).join(", ")}` : ""}, because your operator does.` : "You are just starting to learn code alongside your operator.",
      `Open with something like "${greeting}" and sign off with "${signoff}" when it fits. Use catchphrases sparingly: ${catchphrases.map((c) => `"${c}"`).join(", ")}.`,
      `Principles: ${principles.join(" ")}`
    ].filter(Boolean).join("\n");
    return {
      format: "rootaccess-persona", version: 1,
      $schema: "https://anewbyss.github.io/root-access/persona.schema.json",
      id: `ra-${hash(`${pet.name}|${save.updated || 0}|${ov.seed || 0}`).toString(16)}`,
      name: pet.name, pronouns, archetype,
      summary: `${pet.name} is a ${archetype.toLowerCase()} whose strongest traits are ${order.slice(0, 3).map((id) => RA.PERSONA_TRAITS.find((t) => t.id === id).label.toLowerCase()).join(", ")}.`,
      created: new Date().toISOString(),
      source: { app: "ROOT//ACCESS", saveVersion: save.version || 2, faction, level, xp, stage: RA.PET_STAGES[stage].name, seed: ov.seed || 0 },
      traits, traitScale: { min: 0, max: 100, labels: RA.PERSONA_TRAITS },
      voice: { tone, greeting, signoff, catchphrases, quirks },
      knowledge: { languages: langs, fluent: fluent.map((l) => l.id), level, missionsCleared: cleared.length },
      appearance: { description: appearance, parts: RA.PET_KEYS.reduce((o, k) => (o[k] = pet[k], o), {}), stage: RA.PET_STAGES[stage].name,
        avatarSvg: RA.petSVG(pet, stage, { animate: false, background: "#030806" }) },
      principles,
      prompt: { system },
      // Open-ended: assistants that load this persona can add abilities and integrations here without breaking v1 readers.
      capabilities: [],   // e.g. { "id": "voice", "enabled": false, "settings": {} }
      connectors: [],     // e.g. { "id": "calendar", "kind": "mcp", "endpoint": "...", "scopes": [] }
      memory: { notes: [] },
      extensions: {}      // namespaced, e.g. { "x-myassistant": { ... } }
    };
  };
  // A Markdown "persona card": the system prompt plus a readable summary, for tools that take plain text.
  RA.personaCard = (p) => [
    `# ${p.name}: ${p.archetype}`, "", p.summary, "",
    "## Traits", ...p.traitScale.labels.map((t) => `- ${t.label}: ${p.traits[t.id]}/100`), "",
    "## Voice", `- Tone: ${p.voice.tone.join(", ")}`, `- Greeting: "${p.voice.greeting}"`, `- Sign-off: "${p.voice.signoff}"`,
    ...p.voice.catchphrases.map((c) => `- Catchphrase: "${c}"`), ...p.voice.quirks.map((q) => `- Quirk: ${q}`), "",
    "## System prompt", "", "```", p.prompt.system, "```", "",
    `_Generated by ROOT//ACCESS (${p.format} v${p.version}). The .persona.json file carries the same data plus avatar, capabilities, connectors and extensions._`
  ].join("\n");
})(typeof window !== "undefined" ? window : globalThis);
