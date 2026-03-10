/*
  sw.js – Service Worker for Offline Support

  This service worker caches the site shell and project data upon install.
  During fetch events it serves cached responses first, falling back to
  network. This enables offline access to the portfolio, including the
  projects JSON and static assets. Update the cache version to force a
  refresh when files change.
*/

const CACHE_NAME = 'portfolio-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/starfield.js',
  '/js/nebula.js',
  '/js/search.js',
  '/js/voice.js',
  '/js/wormhole.js',
  '/js/churn.js',
  '/js/health.js',
  '/js/worker.js',
  '/js/pipeline.js',
  '/data/projects.json',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(res => {
        // Optionally cache new resources
        return res;
      });
    })
  );
});