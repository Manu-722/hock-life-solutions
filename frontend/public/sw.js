// Caches product/slideshow images (served from Cloudinary) so returning
// visitors get instant loads instead of re-downloading everything.
//
// SECURITY: this only ever touches image requests to res.cloudinary.com.
// It never intercepts, caches, or stores anything from your own API
// (api.hawklife.co.ke) or website (hawklife.co.ke) - logins, passwords,
// and account data are always fetched fresh from the server, never
// cached here. The explicit allow-list below (IMAGE_HOSTS) is the only
// thing this service worker is allowed to act on.
const CACHE_NAME = "hawklife-images-v2";
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

  // Hard allow-list: only image-hosting requests are ever touched. Every
  // other request (API calls, page navigation, login, etc.) is ignored
  // completely and falls through to the network exactly as normal.
  if (event.request.method !== "GET" || !IMAGE_HOSTS.includes(url.hostname)) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response.ok || response.type === "opaque") {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});