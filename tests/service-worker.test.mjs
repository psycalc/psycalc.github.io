import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const workerSource = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
const origin = 'https://before-we-build.test';
const scope = `${origin}/`;

class FakeResponse {
  constructor(body, { status = 200, type = 'basic', redirected = false } = {}) {
    this.body = body;
    this.status = status;
    this.type = type;
    this.redirected = redirected;
  }

  clone() {
    return new FakeResponse(this.body, {
      status: this.status,
      type: this.type,
      redirected: this.redirected
    });
  }

  async text() {
    return this.body;
  }
}

function request(pathname, {
  method = 'GET',
  mode = 'cors',
  destination = '',
  cache = 'default',
  accept = '',
  range = null
} = {}) {
  const headers = new Map();
  if (accept) headers.set('accept', accept);
  if (range) headers.set('range', range);

  return {
    url: new URL(pathname, scope).href,
    method,
    mode,
    destination,
    cache,
    headers: {
      get: (name) => headers.get(name.toLowerCase()) ?? null,
      has: (name) => headers.has(name.toLowerCase())
    }
  };
}

function createHarness(initialFetch = async () => new FakeResponse('network')) {
  const handlers = new Map();
  const stores = new Map();
  let fetchImpl = initialFetch;

  const keyFor = (value) => {
    const candidate = typeof value === 'string' ? value : value.url;
    return new URL(candidate, scope).href;
  };

  const cacheStorage = {
    async open(name) {
      if (!stores.has(name)) stores.set(name, new Map());
      const entries = stores.get(name);
      return {
        async addAll(urls) {
          for (const url of urls) {
            entries.set(keyFor(url), new FakeResponse(`precache:${url}`));
          }
        },
        async put(key, response) {
          entries.set(keyFor(key), response.clone());
        },
        async delete(key) {
          return entries.delete(keyFor(key));
        },
        async match(key) {
          return entries.get(keyFor(key))?.clone();
        }
      };
    },
    async keys() {
      return [...stores.keys()];
    },
    async delete(name) {
      return stores.delete(name);
    },
    async match(key) {
      const normalizedKey = keyFor(key);
      for (const entries of stores.values()) {
        const response = entries.get(normalizedKey);
        if (response) return response.clone();
      }
      return undefined;
    }
  };

  const worker = {
    location: { origin },
    registration: { scope },
    clients: { claim: async () => undefined },
    skipWaiting: async () => undefined,
    addEventListener(type, handler) {
      handlers.set(type, handler);
    }
  };

  vm.runInNewContext(workerSource, {
    URL,
    caches: cacheStorage,
    fetch: (fetchRequest) => fetchImpl(fetchRequest),
    self: worker
  });

  return {
    setFetch(nextFetch) {
      fetchImpl = nextFetch;
    },
    async seed(cacheName, key, response) {
      const cache = await cacheStorage.open(cacheName);
      await cache.put(key, response);
    },
    async cached(key) {
      return cacheStorage.match(key);
    },
    async cacheNames() {
      return cacheStorage.keys();
    },
    dispatchFetch(fetchRequest) {
      let responsePromise = null;
      const lifetimePromises = [];
      handlers.get('fetch')({
        request: fetchRequest,
        respondWith(value) {
          responsePromise = Promise.resolve(value);
        },
        waitUntil(value) {
          lifetimePromises.push(Promise.resolve(value));
        }
      });

      return {
        intercepted: responsePromise !== null,
        response: responsePromise,
        lifetime: Promise.allSettled(lifetimePromises),
        lifetimeCount: lifetimePromises.length
      };
    },
    async dispatchLifecycle(type) {
      const lifetimePromises = [];
      handlers.get(type)({
        waitUntil(value) {
          lifetimePromises.push(Promise.resolve(value));
        }
      });
      await Promise.all(lifetimePromises);
    }
  };
}

test('online HTML navigation bypasses stale cache and stores the fresh response', async () => {
  const harness = createHarness(async () => new FakeResponse('fresh wiki'));
  const wikiRequest = request('/wiki/', {
    mode: 'navigate',
    accept: 'text/html'
  });
  await harness.seed('bwb-v2', wikiRequest, new FakeResponse('stale wiki'));

  const event = harness.dispatchFetch(wikiRequest);
  assert.equal(event.intercepted, true);
  assert.equal(await (await event.response).text(), 'fresh wiki');
  assert.equal(await (await harness.cached(wikiRequest)).text(), 'fresh wiki');
});

test('offline navigation prefers an exact page, then the wiki or site index', async () => {
  const harness = createHarness(async () => {
    throw new Error('offline');
  });
  await harness.seed('bwb-v2', '/wiki/visited.html', new FakeResponse('visited page'));
  await harness.seed('bwb-v2', '/wiki/index.html', new FakeResponse('wiki index'));
  await harness.seed('bwb-v2', '/index.html', new FakeResponse('site index'));

  const visited = harness.dispatchFetch(request('/wiki/visited.html', { mode: 'navigate' }));
  assert.equal(await (await visited.response).text(), 'visited page');

  const missingWiki = harness.dispatchFetch(request('/wiki/missing.html', { mode: 'navigate' }));
  assert.equal(await (await missingWiki.response).text(), 'wiki index');

  const missingSite = harness.dispatchFetch(request('/missing.html', { mode: 'navigate' }));
  assert.equal(await (await missingSite.response).text(), 'site index');
});

test('an online 404 is returned and removes a stale cached page', async () => {
  const harness = createHarness(async () => new FakeResponse('not found', { status: 404 }));
  const oldSlug = request('/wiki/concepts/old-slug.html', { mode: 'navigate' });
  await harness.seed('bwb-v2', oldSlug, new FakeResponse('obsolete page'));

  const event = harness.dispatchFetch(oldSlug);
  const response = await event.response;
  assert.equal(response.status, 404);
  assert.equal(await response.text(), 'not found');
  assert.equal(await harness.cached(oldSlug), undefined);
});

test('mutable resources are network-first while images refresh through waitUntil', async () => {
  const scriptRequest = request('/assets/site.js', { destination: 'script' });
  const harness = createHarness(async () => new FakeResponse('fresh script'));
  await harness.seed('bwb-v2', scriptRequest, new FakeResponse('stale script'));

  const scriptEvent = harness.dispatchFetch(scriptRequest);
  assert.equal(await (await scriptEvent.response).text(), 'fresh script');

  let resolveImage;
  harness.setFetch(() => new Promise((resolve) => {
    resolveImage = resolve;
  }));
  const imageRequest = request('/assets/icon.svg', { destination: 'image' });
  await harness.seed('bwb-v2', imageRequest, new FakeResponse('stale image'));

  const imageEvent = harness.dispatchFetch(imageRequest);
  assert.equal(imageEvent.lifetimeCount, 1);
  assert.equal(await (await imageEvent.response).text(), 'stale image');
  resolveImage(new FakeResponse('fresh image'));
  await imageEvent.lifetime;
  assert.equal(await (await harness.cached(imageRequest)).text(), 'fresh image');
});

test('no-store, range, cross-origin, and non-GET requests bypass the worker cache', () => {
  const harness = createHarness();
  const requests = [
    request('/assets/instruments/instrument-manifest.json', { cache: 'no-store' }),
    request('/video.mp4', { range: 'bytes=0-99' }),
    request('https://cdn.example.net/library.js'),
    request('/submit', { method: 'POST' })
  ];

  for (const candidate of requests) {
    assert.equal(harness.dispatchFetch(candidate).intercepted, false);
  }
});

test('activation removes only obsolete Before We Build caches', async () => {
  const harness = createHarness();
  await harness.seed('bwb-v1', '/old', new FakeResponse('old'));
  await harness.seed('bwb-v2', '/current', new FakeResponse('current'));
  await harness.seed('another-app-v1', '/other', new FakeResponse('other'));

  await harness.dispatchLifecycle('activate');
  assert.deepEqual(
    (await harness.cacheNames()).sort(),
    ['another-app-v1', 'bwb-v2']
  );
});
