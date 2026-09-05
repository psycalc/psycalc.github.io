import { expect, test } from '@playwright/test';

const CURRENT_CACHE = 'bwb-v2';
const OBSOLETE_SLUG = '/wiki/concepts/four-levels-of-compatibility-uk.html';

async function waitForWorker(page) {
  await page.waitForFunction(() => (
    navigator.serviceWorker.controller?.scriptURL.endsWith('/sw.js')
  ));
}

test('service worker serves fresh wiki navigation and keeps an offline copy', async ({ context, page }) => {
  await page.goto('/wiki/');
  await waitForWorker(page);
  expect(await page.evaluate(() => caches.keys())).toContain(CURRENT_CACHE);

  await page.evaluate(async (cacheName) => {
    const cache = await caches.open(cacheName);
    await cache.put(location.href, new Response(
      '<!doctype html><title>Stale cache</title><h1 id="stale-cache">Stale cache</h1>',
      { headers: { 'content-type': 'text/html' } }
    ));
  }, CURRENT_CACHE);

  await page.reload();
  await expect(page.locator('#stale-cache')).toHaveCount(0);
  await expect(page.locator(
    'a[href="concepts/four-level-compatibility-architecture-uk.html"]'
  )).toBeVisible();

  await context.setOffline(true);
  try {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('h1')).toContainText('База знань');
  } finally {
    await context.setOffline(false);
  }
});

test('an online 404 is not hidden by an obsolete cached page', async ({ page }) => {
  await page.goto('/wiki/');
  await waitForWorker(page);
  const obsoleteUrl = new URL(OBSOLETE_SLUG, page.url()).href;

  await page.evaluate(async ({ cacheName, url }) => {
    const cache = await caches.open(cacheName);
    await cache.put(url, new Response(
      '<!doctype html><title>Obsolete cached page</title>',
      { headers: { 'content-type': 'text/html' } }
    ));
  }, { cacheName: CURRENT_CACHE, url: obsoleteUrl });

  const response = await page.goto(OBSOLETE_SLUG);
  expect(response?.status()).toBe(404);
  expect(await page.evaluate((url) => caches.match(url).then(Boolean), obsoleteUrl)).toBe(false);
});
