const CACHE_NAME = 'kananara-cache-v1.1';
const urlsToCache = [
  '/',
  'index.html',
  './assets/css/output.css',
  './scripts/main.js',
  './scripts/db.js',
  './scripts/components/accountFormModal.js',
  './scripts/components/accountModal.js',
  './scripts/components/confirmConversionModal.js',
  './scripts/components/confirmImportModal.js',
  './scripts/components/confirmModal.js',
  './scripts/components/confirmResetModal.js',
  './scripts/components/graph.js',
  './scripts/components/pagination.js',
  './scripts/components/settingsModal.js',
  './scripts/components/transactionForm.js',
  './scripts/i18n.js',

  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
  'https://unpkg.com/dexie@4.0.11/dist/dexie.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.5.0/dist/chart.umd.min.js',
  'https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@3.1.0/dist/chartjs-plugin-annotation.min.js'

];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('kananara-cache-') && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then((fetchResponse) => {
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return fetchResponse;
          })
          .catch((error) => {
            console.error('Fetch failed:', error);
          });
      })
  );
});