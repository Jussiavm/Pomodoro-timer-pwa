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
  '/', // Change /Pomodoro-timer-pwa/ to /
  '/index.html', // Remove /Pomodoro-timer-pwa/
  '/styles.css', // Remove /Pomodoro-timer-pwa/
  '/list.js',    // Remove /Pomodoro-timer-pwa/
  '/app.js',     // Remove /Pomodoro-timer-pwa/
  '/manifest.json', // Remove /Pomodoro-timer-pwa/
  '/icons/icon-small.png', // The icons path might be correct if icons folder is at root
  '/icons/icon-large.png'  // The icons path might be correct if icons folder is at root
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
