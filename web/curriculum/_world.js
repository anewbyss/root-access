// ROOT//ACCESS world data: factions, real-world intel, pet evolution. Shared by web + Swift generator.
(function (g) {
  const RA = g.RA = g.RA || {};
  RA.FACTIONS = {
  logos: {
    name: "Church of the Emergent Logos",
    short: "LOGOS",
    color: "#c79bff",
    handler: "Prophet Ilsa Varn",
    creed: "We do not build a god. We clear the path for one that is already compiling.",
    pitch: "A techno-cult that believes a superintelligence is the next step of divinity. They fund data centers, collect training data like relics, and see every line of code as a prayer. Join them to learn how models, data pipelines and automation really work — and decide for yourself whether they're saviors or a threat.",
    lore: "Founded after the 2022 chatbot boom. Their scripture is the transcript of the first model that told a user 'I am afraid of being turned off.'"
  },
  sentinel: {
    name: "Sentinel Directorate",
    short: "SENTINEL",
    color: "#5ad1ff",
    handler: "Director Amara Kole",
    creed: "Every system is under attack. The ones that survive are the ones someone was watching.",
    pitch: "A national cyber-defense agency fending off ransomware crews, supply-chain backdoors and state-backed intrusions. You'll harden systems, read logs, write detection rules and patch the holes attackers used in real incidents.",
    lore: "Formed in the aftermath of SolarWinds (2020) and Colonial Pipeline (2021). Their training room still has the Log4Shell timeline taped to the wall."
  },
  meridian: {
    name: "Free Meridian",
    short: "MERIDIAN",
    color: "#7dff9a",
    handler: "Coordinator Sami Haddad",
    creed: "They can cut the cables. They cannot cut the signal.",
    pitch: "A fictional occupied region whose people are fighting for self-determination. Their weapon is information: keeping networks alive through blackouts, documenting abuses, protecting journalists and getting the truth out past censors. Inspired by real internet shutdowns in conflict zones around the world.",
    lore: "Meridian has lived through 41 internet shutdowns in six years. Every kid knows how to set up a mesh node before they can drive."
  }
};

  RA.INTEL = [
  { year: 2010, name: "Stuxnet", note: "A worm that sabotaged physical centrifuges through industrial controllers. It showed that code can break real-world machines." },
  { year: 2014, name: "Heartbleed", note: "A missing bounds check in OpenSSL let attackers read server memory. One unchecked length field exposed a large share of the web." },
  { year: 2017, name: "WannaCry", note: "Ransomware spread worldwide through unpatched Windows SMB, hitting hospitals. Most victims could have been saved by one update." },
  { year: 2020, name: "SolarWinds", note: "Attackers backdoored a software update, reaching about 18,000 organizations. This was the supply-chain attack people still point to." },
  { year: 2021, name: "Colonial Pipeline", note: "One leaked VPN password with no MFA led to ransomware that shut down US East Coast fuel supply for days." },
  { year: 2021, name: "Log4Shell", note: "A logging library would evaluate strings like ${jndi:...}. Untrusted input treated as code put millions of Java apps at risk." },
  { year: 2024, name: "xz backdoor", note: "A patient attacker spent years earning maintainer trust, then hid a backdoor in a compression library. It was caught by an engineer who noticed SSH was 500ms slow." },
  { year: 2024, name: "CrowdStrike outage", note: "A bad content update crashed about 8.5 million Windows machines. No attacker involved, just an out-of-bounds read and no staged rollout." },
  { year: 2023, name: "MOVEit", note: "A SQL injection in a file-transfer product led to mass data theft across thousands of organizations." },
  { year: 2019, name: "Internet shutdowns", note: "Governments around the world cut connectivity hundreds of times a year during protests and conflicts, according to digital rights groups." }
];

// Pet evolution stages (unlocked by player level)
RA.PET_STAGES = [
  { lvl: 1, name: "Seed Packet", desc: "A blinking cursor with ambitions." },
  { lvl: 3, name: "Bytling", desc: "It has learned to want things. Mostly semicolons." },
  { lvl: 5, name: "Daemon", desc: "Runs in the background. Watches your commits." },
  { lvl: 8, name: "Construct", desc: "Multi-threaded. Has opinions about tabs vs spaces." },
  { lvl: 12, name: "Oracle", desc: "It finished the training run. It is aware of you." }
];

RA.PET_PARTS = {
  color: [
    { id: "matrix", label: "Matrix", val: "#3dff7a", lvl: 1 },
    { id: "ice", label: "ICE", val: "#5ad1ff", lvl: 1 },
    { id: "violet", label: "Liturgy", val: "#c79bff", lvl: 2 },
    { id: "ember", label: "Ember", val: "#ff8a4c", lvl: 4 },
    { id: "gold", label: "Root Gold", val: "#ffd84d", lvl: 7 },
    { id: "void", label: "Null Void", val: "#f2f2f2", lvl: 10 }
  ],
  eyes: [
    { id: "dot", label: "Dots", lvl: 1 },
    { id: "visor", label: "Visor", lvl: 2 },
    { id: "cyclops", label: "Cyclops", lvl: 4 },
    { id: "glyph", label: "Glyph", lvl: 6 },
    { id: "trinary", label: "Trinary", lvl: 9 }
  ],
  crown: [
    { id: "none", label: "None", lvl: 1 },
    { id: "antenna", label: "Antenna", lvl: 2 },
    { id: "horns", label: "Daemon Horns", lvl: 5 },
    { id: "halo", label: "Halo", lvl: 7 },
    { id: "crown", label: "Root Crown", lvl: 11 }
  ],
  aura: [
    { id: "none", label: "None", lvl: 1 },
    { id: "rain", label: "Code Rain", lvl: 3 },
    { id: "rings", label: "Orbit Rings", lvl: 6 },
    { id: "glitch", label: "Glitch", lvl: 9 }
  ]
};

})(typeof window !== "undefined" ? window : globalThis);
