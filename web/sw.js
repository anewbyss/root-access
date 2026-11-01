// ROOT//ACCESS service worker: makes the app open and run with no network.
// - App shell (HTML, CSS, JS, curriculum, icons): precached on install, served cache-first.
//   tools/build.js rewrites VERSION and SHELL, so every curriculum change ships as a new cache.
// - Runtime packs (Pyodide, TypeScript, self-hosted vendor/): cache-first, cached on first use or via Settings.
// - Everything else (Judge0, external links): straight to the network, never cached.
const VERSION = "fdfa113906f1"; // @@VERSION
const SHELL = ["./","index.html","icon.svg","icon-192.png","manifest.webmanifest","style.css","curriculum/_core.js","curriculum/_world.js","curriculum/_pet.js","curriculum/_dossiers.js","curriculum/_engine.js","curriculum/_local.js","curriculum/basics.js","curriculum/python.js","curriculum/javascript.js","curriculum/typescript.js","curriculum/sql.js","curriculum/bash.js","curriculum/go.js","curriculum/rust.js","curriculum/swift.js","curriculum/kotlin.js","curriculum/java.js","curriculum/csharp.js","curriculum/cpp.js","curriculum/_steps.js","curriculum/_guide.js","curriculum/checkpoints.js","curriculum/solutions.js","zip.js","runner.js","app.js","worker.js","icon-512.png"]; // @@SHELL
const APP = "ra-app-" + VERSION, PACKS = "ra-packs-v1";
const isPack = (u) => /\/pyodide\/v[\d.]+\/full\//.test(u.pathname) || /\/npm\/typescript@[\d.]+\/lib\//.test(u.pathname) || (u.origin === self.location.origin && u.pathname.includes("/vendor/"));

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(APP).then((c) => c.addAll(SHELL.map((p) => new Request(p, { cache: "reload" })))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith("ra-app-") && k !== APP).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const u = new URL(req.url);
  if (isPack(u)) {
    e.respondWith(caches.match(req.url).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(PACKS).then((c) => c.put(req.url, copy)); }
      return res;
    })));
    return;
  }
  if (u.origin !== self.location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(caches.match("index.html", { cacheName: APP }).then((hit) => hit || fetch(req)).catch(() => caches.match("./")));
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
    if (res.ok && u.pathname.includes("/curriculum/")) { const copy = res.clone(); caches.open(APP).then((c) => c.put(req, copy)); }
    return res;
  })));
});
self.addEventListener("message", (e) => { if (e.data === "version" && e.source) e.source.postMessage({ version: VERSION }); });
