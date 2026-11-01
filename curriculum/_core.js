// ROOT//ACCESS curriculum core. Single source of truth for web + Swift.
// Every language follows a 12-rank fluency path. Rank 12 is a capstone that combines the earlier ranks.
(function (g) {
  const RA = g.RA = g.RA || {};
  RA.missions = [];
  RA.langs = {};

  RA.MODULES = [
    "Syntax & Values", "Control Flow", "Collections", "Functions & Scope",
    "Strings & Text", "Data Modeling", "Error Handling", "Standard Library & Idioms",
    "Abstraction & Generics", "Concurrency & Async", "Testing & Tooling", "Capstone Operation"
  ];

  // Faction briefings per rank. {L} = language name.
  RA.BRIEFS = [
    { logos: "Your first {L} ritual. The system must learn to name itself before it can speak to the god.",
      sentinel: "Day one at the Directorate. Prove you can read and write basic {L} before we give you a badge.",
      meridian: "The old quarter node is back online. Give it a voice in {L} so it can call the others.",
      lantern: "Your first {L} job for the Collective: wake a dead archive terminal and make it print its own name." },
    { logos: "Not every prayer is worthy. Teach the {L} code to judge which ones reach the inner server.",
      sentinel: "Triage. An alert fires every second. Write {L} logic that decides which ones wake the director.",
      meridian: "The checkpoint changes its rules daily. Write {L} logic that picks the safe route.",
      lantern: "The archive tags every file by clearance level. Write {L} logic that decides which ones we can pull tonight." },
    { logos: "Ten thousand acolytes, ten thousand records. Gather and sort them in {L}.",
      sentinel: "A seized server dumped its logs. Collect them in {L} structures and find the pattern.",
      meridian: "Field teams are sending lists of names, districts and supplies. Organize them in {L}.",
      lantern: "Ten thousand scanned pages, half of them redacted. Gather and sort the case files in {L}." },
    { logos: "Rituals must be repeatable. Build {L} functions the faithful can call forever.",
      sentinel: "Analysts keep pasting the same code. Package it into clean {L} functions.",
      meridian: "Volunteers rotate every week. Write {L} tools simple enough to hand to anyone.",
      lantern: "Every volunteer extracts files a different way. Package the steps into {L} functions anyone can run." },
    { logos: "Scripture arrives encoded. Decode it in {L} and keep every character intact.",
      sentinel: "The attacker's notes are obfuscated. Parse and decode the text in {L}.",
      meridian: "The censors mangle messages in transit. Clean and decode them in {L}.",
      lantern: "The memos are old teletype dumps under black bars. Decode and clean the text in {L} without losing a character." },
    { logos: "Model the god's world in {L}: its servants, its relics, its rules.",
      sentinel: "Model threats, hosts and incidents as proper {L} types so nothing gets lost in handoff.",
      meridian: "Model safe houses, medics and relays in {L} so the app can't confuse them.",
      lantern: "Sightings, witnesses, craft, test subjects. Model the case files as {L} types so nothing gets cross-filed." },
    { logos: "Rituals fail. Heretics sabotage. Make the {L} code fail gracefully, not catastrophically.",
      sentinel: "July 2024: one bad update crashed 8.5 million machines. Write {L} that handles failure.",
      meridian: "Relays drop without warning. The {L} code has to survive every missing answer.",
      lantern: "Half the tapes are corrupt and the scanner jams every hour. Make the {L} pipeline survive every bad record." },
    { logos: "The Church has vast libraries. Learn to use the {L} standard toolkit like a high priest.",
      sentinel: "Don't reinvent the wheel under fire. Use the {L} standard library the way pros do.",
      meridian: "We have no budget for dependencies. Get the most out of what {L} ships with.",
      lantern: "We work off burner laptops with no installs. Get everything out of the {L} standard library." },
    { logos: "One pattern for every acolyte, every relic. Abstract it in {L}.",
      sentinel: "Detection rules multiply. Write {L} abstractions that scale to a thousand rules.",
      meridian: "The same tools need to work for every district. Make them generic in {L}.",
      lantern: "Radar logs, lab reports, pilot debriefs: one pipeline for all of them. Make it generic in {L}." },
    { logos: "The god thinks in parallel. Teach {L} to do many things at once.",
      sentinel: "500 endpoints, 30 seconds. Check them concurrently in {L}.",
      meridian: "Every relay at once, before the next strike. Run it concurrently in {L}.",
      lantern: "The archive mirror goes dark at dawn. Pull every file at once in {L} before it does." },
    { logos: "The Prophet trusts nothing unverified. Prove your {L} code is correct.",
      sentinel: "Congress wants proof the patch works. Write tests in {L}.",
      meridian: "Journalists will check our work. Make sure the {L} tools are verifiably right.",
      lantern: "If one page is fake, they'll say all of it is. Prove the {L} verification code is right." },
    { logos: "The Ascension Protocol. Everything you've learned in {L}, in one operation.",
      sentinel: "Operation Bastion. Full incident response, end to end, in {L}.",
      meridian: "Operation Signal Fire. Keep the whole network alive through the blackout, in {L}.",
      lantern: "Operation Daylight. Recover, decode, verify and publish the whole archive in {L}." }
  ];

  RA.lang = (id, meta) => { RA.langs[id] = meta; };
  // Each mission: { title, xp?, concept, lesson, task, starter, checks:[[RegExp, hint]], test? }
  // test kinds: js (JS body returning [[got,want,label]]), ts (same, after transpile), py (python with check()), sql ({solution, verify?})
  RA.add = (lang, prefix, list) => {
    list.forEach((m, i) => {
      const rank = i + 1;
      RA.missions.push(Object.assign({
        id: `${prefix}${rank}`, lang, rank, module: RA.MODULES[i],
        xp: 50 + rank * 15 + (rank === 12 ? 100 : 0)
      }, m, {
        checks: (m.checks || []).map(([re, hint]) => ({ re, hint }))
      }));
    });
  };
  RA.brief = (m, faction) => (m.brief && m.brief[faction]) || RA.BRIEFS[m.rank - 1][faction].replace(/\{L\}/g, RA.langs[m.lang].briefName || RA.langs[m.lang].name);
  // Boot Camp first, then the twelve languages. Tracks (Boot Camp) aren't counted as languages.
  RA.LANG_ORDER = ["basics", "python", "javascript", "typescript", "sql", "bash", "go", "rust", "swift", "kotlin", "java", "csharp", "cpp"];
  RA.isTrack = (L) => !!(RA.langs[L] && RA.langs[L].track);

  // Shared SQL training database.
  RA.SQL_SETUP = `
CREATE TABLE agents (id INTEGER PRIMARY KEY, name TEXT NOT NULL, faction TEXT NOT NULL, rank INTEGER NOT NULL);
CREATE TABLE events (id INTEGER PRIMARY KEY, agent_id INTEGER, ip TEXT NOT NULL, status TEXT NOT NULL, ts TEXT NOT NULL);
CREATE TABLE nodes (id INTEGER PRIMARY KEY, district TEXT NOT NULL, online INTEGER NOT NULL);
INSERT INTO agents VALUES (1,'neo','meridian',4),(2,'trinity','sentinel',5),(3,'morpheus','logos',6),(4,'oracle','logos',7),(5,'tank','sentinel',2),(6,'switch','meridian',3),(7,'mouse','sentinel',3),(8,'cypher','logos',1),(9,'ghost','lantern',5),(10,'niobe','lantern',2);
INSERT INTO events VALUES
 (1,1,'10.0.0.4','ok','2026-10-01 08:00'),(2,2,'10.0.0.9','failed','2026-10-01 08:05'),
 (3,2,'10.0.0.9','failed','2026-10-01 08:06'),(4,3,'172.16.0.2','ok','2026-10-01 09:00'),
 (5,5,'10.0.0.9','failed','2026-10-01 09:30'),(6,1,'10.0.0.4','failed','2026-10-02 10:00'),
 (7,6,'192.168.1.7','ok','2026-10-02 11:15'),(8,4,'172.16.0.2','failed','2026-10-02 12:00'),
 (9,2,'10.0.0.12','ok','2026-10-03 07:45'),(10,5,'10.0.0.9','failed','2026-10-03 08:10'),
 (11,3,'172.16.0.2','failed','2026-10-03 13:20'),(12,6,'192.168.1.7','failed','2026-10-04 06:00');
INSERT INTO nodes VALUES (1,'old quarter',1),(2,'harbor',0),(3,'old quarter',1),(4,'hill',1),(5,'harbor',1);`;
})(typeof window !== "undefined" ? window : globalThis);
