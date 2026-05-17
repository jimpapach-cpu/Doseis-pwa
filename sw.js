const CACHE = 'doseis-v2'; // Αυξήσαμε την έκδοση cache
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // ΠΡΟΣΟΧΗ: Μην κάνεις cache τα αιτήματα προς την Google (Auth και Drive API)
  if (e.request.url.includes('googleapis.com') || e.request.url.includes('google.com')) {
    return; // Άφησε το fetch να πάει κατευθείαν στο internet
  }

  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});