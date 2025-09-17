// public/service-worker.js
const CACHE_NAME = "medhub-v7";
const PRECACHE = [
  "/offline.html",
  "/offline.css",
  "/icons/offline_logo.png",
  "/icons/offline_img.png",
];

// INSTALL: precache dei file essenziali
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE);
      console.log("[SW] precache OK:", PRECACHE);
    } catch (err) {
      console.error("[SW] precache ERROR:", err);
      throw err;
    }
  })());
  self.skipWaiting();
});

// ACTIVATE: pulizia cache vecchie
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    console.log("[SW] activate, cache attiva:", CACHE_NAME);
  })());
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // network-first con fallback offline
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        // prova la rete
        return await fetch(req);
      } catch {
        
        // offline: mostra la pagina offline
        const cached = await caches.match("/offline.html");
        return cached || new Response("Offline", { status: 503 });
      }
    })());
    return;
  }

  // 2) cache-first con salvataggio dinamico
  if (/\.(css|js|png|jpg|jpeg|svg|webp|gif|ico|woff2?|ttf|otf)$/i.test(url.pathname)) {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      const res = await fetch(req);

      const copy = res.clone();
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, copy);
      return res;
    })());
    return;
  }
});
