/**
 * Service worker minimal — HANYA supaya Chrome mengizinkan halaman ini
 * ditawarkan sebagai "Pasang Aplikasi" (PWA install). Tidak melakukan
 * caching/offline yang rumit, cukup meneruskan setiap request ke
 * jaringan seperti biasa.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // Kalau sedang offline dan resource tidak tersedia, biarkan
      // request gagal seperti biasa (tidak ada halaman offline khusus).
      return new Response('Anda sedang offline. Silakan coba lagi setelah tersambung internet.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=UTF-8' }
      });
    })
  );
});