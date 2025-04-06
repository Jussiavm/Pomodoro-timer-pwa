const CACHE_NAME = 'pomodoro-cache-v1';
const urlsToCache = [
  '/Pomodoro-timer-pwa/',
  '/Pomodoro-timer-pwa/index.html',
  '/Pomodoro-timer-pwa/styles.css',
  '/Pomodoro-timer-pwa/list.js',
  '/Pomodoro-timer-pwa/app.js',
  '/Pomodoro-timer-pwa/manifest.json',
  '/Pomodoro-timer-pwa/Icons/Icon-large.png',
  '/Pomodoro-timer-pwa/Icons/Icon-small.png'
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