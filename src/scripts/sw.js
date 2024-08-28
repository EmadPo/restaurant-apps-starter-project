/* global importScripts, workbox */
importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js'
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  // Mengambil manifest pra-cache yang dihasilkan oleh Workbox
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

  // Runtime caching untuk API
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://restaurant-api.dicoding.dev',
    new workbox.strategies.NetworkFirst({
      cacheName: 'restaurant-api-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        }),
      ],
    })
  );

  // Caching untuk gambar
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        }),
      ],
    })
  );

  // Caching untuk script dan style
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' || request.destination === 'style',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
    })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}
