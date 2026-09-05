const CACHE_PREFIX = 'bwb-';
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const PRECACHE_URLS = [
  './',
  './index.html',
  './wiki/index.html',
  './research-tests.html',
  './relations-calculator.html',
  './tiktok.html',
  './manifest.webmanifest',
  './assets/site.css',
  './assets/icon.svg',
  './assets/tests.js',
  './assets/relations-calculator.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith(CACHE_PREFIX) && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

function isCacheable(response) {
  return response
    && response.status === 200
    && response.type === 'basic'
    && !response.redirected;
}

async function updateCache(request, response) {
  try {
    const cache = await caches.open(CACHE_NAME);
    if (response.status === 404 || response.status === 410) {
      await cache.delete(request);
    } else if (isCacheable(response)) {
      await cache.put(request, response.clone());
    }
  } catch {
    // A cache quota/write failure must not discard a valid network response.
  }
}

async function fetchAndCache(request) {
  const networkResponse = await fetch(request);
  await updateCache(request, networkResponse);
  return networkResponse;
}

async function matchCurrentCache(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    return cache.match(request);
  } catch {
    return undefined;
  }
}

async function offlineNavigationFallback(request) {
  const cachedPage = await matchCurrentCache(request);
  if (cachedPage) return cachedPage;

  const requestUrl = new URL(request.url);
  const wikiPath = new URL('./wiki/', self.registration.scope).pathname;
  if (requestUrl.pathname.startsWith(wikiPath)) {
    const wikiIndex = await matchCurrentCache('./wiki/index.html');
    if (wikiIndex) return wikiIndex;
  }

  return matchCurrentCache('./index.html');
}

async function networkFirstNavigation(request) {
  try {
    return await fetchAndCache(request);
  } catch {
    return offlineNavigationFallback(request);
  }
}

async function networkFirstResource(request) {
  try {
    return await fetchAndCache(request);
  } catch (error) {
    const cachedResponse = await matchCurrentCache(request);
    if (cachedResponse) return cachedResponse;
    throw error;
  }
}

function staleWhileRevalidate(event) {
  const networkResponse = fetchAndCache(event.request);
  event.waitUntil(networkResponse.catch(() => undefined));

  return matchCurrentCache(event.request).then((cachedResponse) => {
    return cachedResponse || networkResponse;
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);
  if (
    requestUrl.origin !== self.location.origin
    || request.cache === 'no-store'
    || request.headers.has('range')
  ) return;

  const acceptsHtml = request.headers.get('accept')?.includes('text/html');
  if (request.mode === 'navigate' || acceptsHtml) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(staleWhileRevalidate(event));
    return;
  }

  event.respondWith(networkFirstResource(request));
});
