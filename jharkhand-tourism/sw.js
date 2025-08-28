const CACHE = 'sjt-v1';
const ROOT = '/jharkhand-tourism';
const ASSETS = [
  `${ROOT}/`,
  `${ROOT}/index.html`,
  `${ROOT}/offline.html`,
  `${ROOT}/assets/css/main.css`,
  `${ROOT}/assets/js/main.js`,
  `${ROOT}/manifest.webmanifest`
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k !== CACHE ? caches.delete(k) : null)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(`${ROOT}/offline.html`))
    );
    return;
  }
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      }))
    );
  }
});

