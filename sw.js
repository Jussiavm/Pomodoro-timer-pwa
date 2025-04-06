const CACHE_NAME = 'pomodoro-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/list.js',
  '/app.js',
  '/manifest.json',
  '/Icons/Icon-large.png',
  '/Icons/Icon-small.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});