// Listen for messages from app.js to show notifications
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification('Pomodoro Timer', {
      body: event.data.body || 'Time is up!',
      icon: 'icons/icon-large.png'
    });
  }
});
const CACHE_NAME = 'pomodoro-cache-v7';
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
