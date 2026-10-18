// Retired service worker for the old /cosmic/ address.
// Phones that installed the old app still have a worker registered here that
// serves the old page from cache. When the browser checks for an update it gets
// this file, which deletes the old cache, unregisters itself and sends any open
// pages to the new address, /Cosmic-Kau-Chim/.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Take control first: client.navigate() only works on pages this worker controls
    // (covers an old page served from the browser's HTTP cache that re-registers us).
    await self.clients.claim();
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k === 'cosmic-kau-chim-v1').map(k => caches.delete(k)));
    const pages = await self.clients.matchAll({ type: 'window' });
    for (const client of pages) {
      const url = new URL(client.url);
      if (/^\/cosmic(\/|$)/.test(url.pathname)) {
        try { await client.navigate('/Cosmic-Kau-Chim/' + url.search + url.hash); } catch (e) { /* ignore */ }
      }
    }
    await self.registration.unregister();
  })());
});

// Never serve from the old cache again; go straight to the network.
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
