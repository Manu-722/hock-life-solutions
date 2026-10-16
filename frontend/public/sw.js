// Keeps product and slideshow images (served from Cloudinary) in the
// browser, so images the visitor has already seen load instantly next time.
//
// SECURITY: this only ever touches image requests to res.cloudinary.com.
// It never intercepts or stores anything from your own API or website, so
// logins, passwords and account data are always fetched fresh from the
// server. The allow-list below (IMAGE_HOSTS) is the only thing it acts on.
const CACHE_NAME = "hawklife-images-v3";
const IMAGE_HOSTS = ["res.cloudinary.com"];
// Keep the stored images to a sensible size. Oldest ones are dropped first.
const MAX_ENTRIES = 60;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

async function trimCache(cache) {
  const keys = await cache.keys();
  if (keys.length > MAX_ENTRIES) {
    await Promise.all(keys.slice(0, keys.length - MAX_ENTRIES).map((k) => cache.delete(k)));
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only image hosts are ever touched. Everything else (API calls, pages,
  // login) is ignored here and goes to the network exactly as normal.
  if (event.request.method !== "GET" || !IMAGE_HOSTS.includes(url.hostname)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Cloudinary image URLs include a version, so a saved copy never goes
      // stale. Serve it straight from the cache when we have it.
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const response = await fetch(event.request);
      if (response.ok || response.type === "opaque") {
        cache
          .put(event.request, response.clone())
          .then(() => trimCache(cache))
          .catch(() => {});
      }
      return response;
    })
  );
});