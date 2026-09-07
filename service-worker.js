/* ============================================================
   SERVICE-WORKER.JS — offline caching for Kakali Enterprise
   ============================================================ */

const CACHE_NAME = 'kakali-enterprise-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/layout.css',
  './css/print.css',
  './js/db.js',
  './js/i18n.js',
  './js/utils.js',
  './js/state.js',
  './js/router.js',
  './js/app.js',
  './js/views/onboarding.js',
  './js/views/dashboard.js',
  './js/views/products.js',
  './js/views/customers.js',
  './js/views/suppliers.js',
  './js/views/sales.js',
  './js/views/purchases.js',
  './js/views/money.js',
  './js/views/reports.js',
  './js/views/reminders.js',
  './js/views/search.js',
  './js/views/settings.js',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './assets/logo.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
    ))
  );
  self.clients.claim();
});

// Third-party (CDN) requests: network-first, fallback to cache
// Local app requests: cache-first, fallback to network, update cache in background
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;

  if (isSameOrigin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((networkResp) => {
          if (networkResp && networkResp.status === 200) {
            const clone = networkResp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return networkResp;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  } else {
    event.respondWith(
      fetch(req).then((networkResp) => {
        const clone = networkResp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return networkResp;
      }).catch(() => caches.match(req))
    );
  }
});
