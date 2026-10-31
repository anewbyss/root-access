// Run reference solutions (or files in a folder) through Judge0 and print checkpoint results.
// usage: node tools/judge0-check.js <id|lang|all> [--dir submissions]
const load = require("./load"), fs = require("fs"), path = require("path");
const RA = load();
const arg = process.argv[2] || "all";
const dirIx = process.argv.indexOf("--dir");
const ms = RA.missions.filter((m) => arg === "all" || m.id === arg || m.lang === arg || arg.split(",").some((a) => a === m.id || a === m.lang));
(async () => {
  let bad = 0;
  for (const m of ms) {
    let code = RA.solution(m);
    if (dirIx > 0) { const d = process.argv[dirIx + 1]; const f = fs.readdirSync(d).find((x) => x.replace(/\.[^.]+$/, "") === m.id); if (!f) continue; code = fs.readFileSync(path.join(d, f), "utf8"); }
    let rep;
    for (let attempt = 0; attempt < 3; attempt++) {
      try { rep = await RA.runJudge0(m, code, { headers: { "User-Agent": "Mozilla/5.0 RootAccess-CI" } }); break; }
      catch (e) { rep = { error: e.message, results: [] }; await new Promise((r) => setTimeout(r, 2000)); }
    }
    if (rep.ciOnly) { console.log(`${m.id.padEnd(5)} CI-ONLY  ${rep.ciOnly}`); continue; }
    const ok = RA.allPassed(rep);
    if (!ok) bad++;
    console.log(`${m.id.padEnd(5)} ${ok ? "PASS" : "FAIL"}  ${rep.results.map((r) => (r.status === "PASS" ? "+" : r.status === "SKIP" ? "~" : "x") + r.label).join(" | ")}${rep.error ? " ERROR " + rep.error : ""}`);
    if (!ok) { rep.results.filter((r) => r.status === "FAIL").forEach((r) => console.log("      x " + r.label + ": " + r.detail)); if (rep.stderr) console.log("      stderr: " + rep.stderr.slice(0, 400)); }
  }
  console.log(bad ? `${bad} mission(s) failed` : "all passed");
  process.exitCode = bad ? 1 : 0;
})();
