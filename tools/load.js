// Loads the curriculum into a Node vm context (files expect a browser-style global RA).
const vm = require("vm"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..", "curriculum");
const ORDER = ["_core", "_world", "_dossiers", "_engine", "python", "javascript", "typescript", "sql", "bash", "go", "rust", "swift", "kotlin", "java", "csharp", "cpp"];
module.exports = function load() {
  const ctx = { console, fetch: globalThis.fetch, Buffer, setTimeout };
  ctx.globalThis = ctx; vm.createContext(ctx);
  for (const f of ORDER) vm.runInContext(fs.readFileSync(path.join(ROOT, f + ".js"), "utf8"), ctx, { filename: f + ".js" });
  const RA = ctx.RA, dir = path.join(ROOT, "checkpoints");
  if (fs.existsSync(dir)) for (const f of fs.readdirSync(dir)) { const id = f.replace(/\.[^.]+$/, ""); RA.HARNESS[id] = fs.readFileSync(path.join(dir, f), "utf8"); }
  RA.solution = (m) => { const d = path.join(ROOT, "solutions"); const f = fs.readdirSync(d).find((x) => x.replace(/\.[^.]+$/, "") === m.id); return f ? fs.readFileSync(path.join(d, f), "utf8") : null; };
  return RA;
};
