// Service Worker لسوق الإمارات - تحسين الأداء
// Emirates Souq Service Worker - Performance Optimization

const CACHE_NAME = 'emirates-souq-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/cart.html',
  '/checkout.html',
  '/product.html',
  '/css/dkhoon-inspired-theme.css',
  '/js/cart.js',
  '/js/categories-homepage-3d-fixed.js',
  '/manifest.json'
];

// التثبيت
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('✅ تم فتح التخزين المؤقت');
        return cache.addAll(urlsToCache);
      })
  );
});

// الجلب
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // إرجاع من التخزين المؤقت أو جلب من الشبكة
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// التنشيط
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف تخزين مؤقت قديم:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});