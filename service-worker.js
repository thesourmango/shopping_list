const CACHE_NAME = 'notekeeping-app-cache-v1';
const urlsToCache = [
  /* Removed several caches that caused problems with ajax updates */
  '/shop/style.css',
  '/shop/favicon//android-chrome-192x192.png',
  '/shop/favicon//android-chrome-512x512.png'
];

// Minimal service worker - no caching
self.addEventListener('install', event => {
  self.skipWaiting(); // Activate immediately
});

// Just pass through to network, no caching
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim()); // Take control of all pages
});