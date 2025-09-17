const CACHE_NAME = 'weighing-calc-cache-v5';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/components/WeighingCalculator.tsx',
  '/components/SimpleCalculator.tsx',
  '/components/FallingStars.tsx',
  'https://cdn.tailwindcss.com'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Use a network-first, falling back to cache strategy.
  // This ensures the user gets the latest content when online,
  // but the app still works offline.
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return fetch(event.request)
        .then(response => {
          // If we get a valid response, we update the cache.
          if (response && response.status === 200) {
            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We need to clone it to
            // pass one to the browser and one to the cache.
            cache.put(event.request.url, response.clone());
          }
          return response;
        })
        .catch(err => {
          // Network request failed, probably offline, try the cache.
          console.log('Network request failed, serving from cache:', event.request.url);
          return cache.match(event.request);
        });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
