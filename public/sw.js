const VERSION = 'nias-v5';
const ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/logo.png', '/favicon.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const isStatic = (path) =>
  path.startsWith('/images/') || path.startsWith('/_astro/') || /\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/i.test(path);

const put = (cache, res, req) => {
  if (res && res.ok) cache.put(req, res.clone());
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js') return;

  e.respondWith(
    (async () => {
      const cache = await caches.open(VERSION);

      if (isStatic(url.pathname)) {
        const hit = await cache.match(req);
        if (hit) return hit;
        const res = await fetch(req);
        put(cache, res, req);
        return res;
      }

      const cached = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          put(cache, res, req);
          return res;
        })
        .catch(() => null);

      if (cached) {
        network.catch(() => {});
        return cached;
      }

      const res = await network;
      if (res) return res;

      const fallback = await cache.match('/index.html');
      if (fallback && req.mode === 'navigate') return fallback;
      throw new Error('offline');
    })(),
  );
});
