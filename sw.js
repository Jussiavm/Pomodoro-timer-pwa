// Listen for messages from app.js to show notifications
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification('Pomodoro Timer', {
      body: event.data.body || 'Time is up!',
      icon: 'icons/icon-large.png'
    });
  }
});
const CACHE_NAME = 'pomodoro-cache-v1.0002';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/app-content.css',
  '/styles/buttons.css',
  '/styles/auth-forms.css',
  '/styles/global-styles.css',
  '/list.js',
  '/app.js',
  '/manifest.json',
  '/icons/icon-small.png',
  '/icons/icon-large.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Delete old caches that are not the current one
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
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
