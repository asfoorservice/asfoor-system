// Asfoor Auto Services — service worker
// Lets the system open without internet and be installed on phones.
// Bump CACHE when shell files change a lot (old caches are deleted automatically).
const CACHE = 'asfoor-v1';
const FIREBASE = 'https://www.gstatic.com/firebasejs/10.12.2/';
const SHELL = [
  './', './index.html', './logo.jpg', './manifest.webmanifest', './icon-192.png', './icon-512.png',
  FIREBASE + 'firebase-app.js', FIREBASE + 'firebase-auth.js', FIREBASE + 'firebase-firestore.js'
];
const CDN_HOSTS = ['www.gstatic.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Our own files: always try the network first so updates show up immediately.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
    );
    return;
  }

  // Libraries, fonts and icons from CDNs: use the saved copy when we have one.
  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }))
    );
  }
  // Everything else (Firebase database/login traffic) goes straight to the network.
});
