// Generates docs/LANGUAGES.md from curriculum/_dossiers.js so the docs never drift from the app.
const fs = require("fs"), path = require("path");
const RA = require("./load.js")();
const S = (k) => RA.SOURCES[k] ? `[${RA.SOURCES[k].label}](${RA.SOURCES[k].url})` : k;
let o = "# Language dossiers\n\nGenerated from `curriculum/_dossiers.js` by `node tools/gen-docs.js`. The same text appears in the app under Intel.\n\n";
o += "| Language | Judge0 engine | GitHub Actions toolchain | CI-only ranks |\n|---|---|---|---|\n";
for (const k of Object.keys(RA.langs)) {
  const ci = RA.missions.filter((m) => m.lang === k && RA.harnessMeta(RA.HARNESS[m.id] || "").ciOnly).map((m) => m.rank);
  o += `| ${RA.langs[k].name} | ${RA.ENGINES[k].label} | ${RA.CI_TOOLCHAINS[k]} | ${ci.join(", ") || "none"} |\n`;
}
for (const k of Object.keys(RA.langs)) {
  const d = RA.DOSSIERS[k], L = RA.langs[k];
  if (!d) continue;
  o += `\n## ${L.name}\n\n${d.tagline}\n\n`;
  o += d.stats.map((s) => `- **${s[0]}:** ${s[1]} (${S(s[2])})`).join("\n") + "\n\n";
  o += `**Relevance.** ${d.relevance} Sources: ${(d.relSrc || []).map(S).join(", ")}.\n\n`;
  o += `**Strengths**\n\n${d.pros.map((x) => "- " + x).join("\n")}\n\n**Trade-offs**\n\n${d.cons.map((x) => "- " + x).join("\n")}\n\n`;
  o += `**Use it for:** ${d.bestFor.join("; ")}.\n\n**Reach for something else when:** ${d.avoid.join("; ")}.\n\n`;
  o += `**Official learning path:** ${(d.learn || []).map(S).join(", ")}. ${d.next || ""}\n\n`;
  o += `**Mission path:** ` + RA.missions.filter((m) => m.lang === k).sort((a, b) => a.rank - b.rank).map((m) => `${m.rank}. ${m.module} (${m.title})`).join(" · ") + "\n";
}
o += "\n## Teaching method\n\n" + RA.PRAXIS.stages.map((s, i) => `${i + 1}. **${s.name}:** ${s.what}`).join("\n") + "\n\n";
o += RA.PRAXIS.evidence.map((e) => `- ${e.claim} (${S(e.src)})`).join("\n") + "\n";
fs.mkdirSync(path.join(__dirname, "..", "docs"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "..", "docs", "LANGUAGES.md"), o);
console.log("docs/LANGUAGES.md", o.length);
