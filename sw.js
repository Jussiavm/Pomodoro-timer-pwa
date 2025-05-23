const CACHE_NAME = 'pomodoro-cache-v4';
const urlsToCache = [
  '/Pomodoro-timer-pwa/',
  '/Pomodoro-timer-pwa/index.html',
  '/Pomodoro-timer-pwa/styles.css',
  '/Pomodoro-timer-pwa/list.js',
  '/Pomodoro-timer-pwa/app.js',
  '/Pomodoro-timer-pwa/manifest.json',
  '/Pomodoro-timer-pwa/icons/icon-small.png',
  '/Pomodoro-timer-pwa/icons/icon-large.png'
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
