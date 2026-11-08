const CACHE = 'offerte-test-sync-r4m8-52eddbbd6e';
const FILES = ["./", "index.html", "manifest.webmanifest", "qrcode.js", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-32.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "img/172fa646.jpg", "img/21fc8296.jpg", "img/2abf5b14.jpg", "img/4c04ea2d.png", "img/59a70af6.jpg", "img/71ba42dd.jpg", "img/9b2c03da.jpg", "img/d9427295.jpg"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('offerte-test-sync-r4m8-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin && !url.hostname.endsWith('gstatic.com') && !url.hostname.endsWith('googleapis.com')) return;
  // eerst netwerk (altijd de nieuwste versie), offline uit de cache
  e.respondWith(fetch(e.request).then(r => { if (r && (r.ok || r.type === 'opaque')) { const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); } return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(m => m || caches.match('index.html'))));
});
