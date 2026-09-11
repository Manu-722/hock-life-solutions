// Caches product/slideshow images (served from Cloudinary) so returning
// visitors get instant loads instead of re-downloading everything. Uses a
// "stale-while-revalidate" strategy: serves the cached image immediately
// if we have one, then quietly checks for an updated version in the
// background for next time.
const CACHE_NAME = "hawklife-images-v1";
const IMAGE_HOSTS = ["res.cloudinary.com"];

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

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || !IMAGE_HOSTS.includes(url.hostname)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});