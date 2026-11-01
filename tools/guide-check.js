#!/usr/bin/env node
// Verifies the beginner guide: every mission has steps, its own solution passes its structure checks,
// the Parsons puzzle is built from that same solution, and the hint ladder returns all three tiers.
const RA = require("./load.js")();
let bad = 0;
const fail = (id, why) => { bad++; console.log(id.padEnd(6), "FAIL ", why); };
for (const m of RA.missions) {
  const sol = RA.solution(m);
  if (!sol) { fail(m.id, "no reference solution"); continue; }
  if (RA.stepsFor(m).length < 3) fail(m.id, "fewer than 3 steps");
  const unmet = RA.requirements(m, sol).filter((r) => !r.ok);
  if (unmet.length) fail(m.id, "solution misses: " + unmet.map((r) => r.hint).join("; "));
  const p = RA.parsons(m, sol), lines = RA.parsonsLines(m, sol);
  if (p.lines.length < 2) fail(m.id, "parsons has under 2 pieces");
  if (p.shuffled.slice().sort().join("\u0001") !== lines.slice().sort().join("\u0001")) fail(m.id, "parsons is not a permutation of the solution");
  if (p.pieces && RA.joinPieces(p.lines).replace(/\s+/g, "") !== sol.replace(/\s+/g, "")) fail(m.id, "pieces don't rebuild the solution");
  for (const t of [1, 2, 3]) {
    const h = RA.hint(m, m.starter, null, t, sol);
    if (!h || h.tier !== t || !h.html) fail(m.id, "hint tier " + t + " missing");
  }
  if (RA.hint(m, m.starter, null, 3, sol).code !== sol) fail(m.id, "full answer is not this mission's solution");
  if (m.lang === "basics" && RA.requirements(m, m.starter).every((r) => r.ok) && !/Read the Error/.test(m.title)) fail(m.id, "starter already meets every requirement");
}
for (const L of Object.keys(RA.langs)) if (!RA.ORIENT[L]) fail(L, "no orientation text");
console.log(bad ? bad + " problem(s)" : "guide ok: " + RA.missions.length + " missions, steps + hints + answers linked");
process.exit(bad ? 1 : 0);
