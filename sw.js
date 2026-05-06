// Service Worker for Professor EasyBot PWA
// Caches files for offline use

const CACHE_NAME = 'easybot-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/tts.js',
  '/assets/js/quiz.js',
  '/assets/js/app.js',
  '/subject1/chap1.html',
  '/subject1/chap2.html',
  '/subject1/chap3.html',
  '/subject1/chap4.html',
  '/subject1/chap5.html',
  '/subject2/chap1.html',
  '/subject2/chap2.html',
  '/subject2/chap3.html',
  '/subject2/chap4.html',
  '/subject2/chap5.html',
  '/subject3/chap1.html',
  '/subject3/chap2.html',
  '/subject3/chap3.html',
  '/subject3/chap4.html',
  '/subject3/chap5.html',
  '/quiz/quiz-s1.html',
  '/quiz/quiz-s2.html',
  '/quiz/quiz-s3.html'
];

// Install event - cache files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache if offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Activate event - clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
