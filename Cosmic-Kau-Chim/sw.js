const CACHE_NAME = 'cosmic-kau-chim-v2';
const ASSETS = [
  '/Cosmic-Kau-Chim/',
  '/Cosmic-Kau-Chim/index.html',
  '/Cosmic-Kau-Chim/manifest.json',
  '/Cosmic-Kau-Chim/icon-192.png',
  '/Cosmic-Kau-Chim/icon-512.png'
];

// Install: pre-cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean up old Kau Chim caches only (other marsbase.win apps share this origin)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k.startsWith('cosmic-kau-chim-') && k !== CACHE_NAME)
        .map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy for offline support
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('/Cosmic-Kau-Chim/index.html'));
    })
  );
});
