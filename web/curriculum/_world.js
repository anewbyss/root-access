// ROOT//ACCESS world data: factions and real-world intel. Shared by web + Swift generator.
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
  },
  lantern: {
    name: "The Lantern Collective",
    short: "LANTERN",
    color: "#ffc24a",
    handler: "Archivist Wren Okafor",
    creed: "Classified is just another word for locked. Every lock is made of code.",
    pitch: "A network of whistleblowers, ex-contractors and night-shift sky-watchers convinced their government is sitting on proof of non-human craft, a shelved super-soldier program and files nobody can explain. They recover dead archives, crack legacy formats, verify every page and publish it where it can't be pulled. Join them to learn data recovery, parsing, verification and publishing, and decide for yourself what's real.",
    lore: "Formed the week of the July 2023 congressional hearing on unidentified anomalous phenomena. Their founding text is the CIA's own declassified Stargate Project, which spent two decades testing psychic spies. Wren's line: \"If they admitted that one, what are they still sitting on?\""
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
// Pet stages, parts, renderer and personality live in curriculum/_pet.js.

})(typeof window !== "undefined" ? window : globalThis);
