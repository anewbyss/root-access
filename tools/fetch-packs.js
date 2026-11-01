// Self-hosts the on-device runtime packs next to the web app, so it never needs a CDN (fully offline installs,
// intranets, classrooms). Writes web/vendor/<pack>/... and web/vendor/packs.json, which the app picks up automatically.
// usage: node tools/fetch-packs.js [--pack python,typescript] [--from <dir>]...
//   --from  copy files from a local folder first (e.g. node_modules/pyodide, node_modules/typescript/lib); anything
//           not found there is downloaded from the pack's CDN base (see curriculum/_local.js RA.PACKS).
const fs = require("fs"), path = require("path");
const RA = require("./load.js")();
const args = process.argv.slice(2), opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const froms = args.flatMap((a, i) => (a === "--from" ? [args[i + 1]] : []));
const packs = (opt("--pack") || Object.keys(RA.PACKS).join(",")).split(",");
const OUT = path.join(__dirname, "..", "web", "vendor");
(async () => {
  const index = fs.existsSync(path.join(OUT, "packs.json")) ? JSON.parse(fs.readFileSync(path.join(OUT, "packs.json"), "utf8")) : {};
  for (const k of packs) {
    const P = RA.PACKS[k]; if (!P) throw new Error("unknown pack " + k);
    const dir = path.join(OUT, k); fs.mkdirSync(dir, { recursive: true });
    let missing = 0;
    for (const f of P.files) {
      const dest = path.join(dir, f), local = froms.map((d) => path.join(d, f)).find((p) => fs.existsSync(p));
      if (local) { fs.copyFileSync(local, dest); console.log(`${k}/${f}  copied from ${local}`); continue; }
      try {
        const r = await fetch(P.base + f);
        if (!r.ok) throw new Error("HTTP " + r.status);
        fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
        console.log(`${k}/${f}  downloaded`);
      } catch (e) { missing++; console.error(`${k}/${f}  FAILED (${e.message}) from ${P.base + f}`); }
    }
    index[k] = { label: P.label, files: P.files, complete: missing === 0 };
  }
  fs.writeFileSync(path.join(OUT, "packs.json"), JSON.stringify(index, null, 2) + "\n");
  console.log("wrote web/vendor/packs.json");
})();
