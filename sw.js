// ============================================
// FILE: sw.js
// Makes App Work OFFLINE 📴
// ============================================

const CACHE_NAME = 'amie-ece-v1';

// All files to save for offline use (match existing project structure)
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/style.css',
  '/assets/js/app.js',
  '/assets/js/tts.js',
  '/assets/js/quiz.js',
  '/assets/js/storage.js',
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
  '/quiz/quiz-s3.html',
  '/data/subject1.json',
  '/data/subject2.json',
  '/data/subject3.json',
  '/data/quiz-data.json',
  '/assets/fonts/OpenDyslexic.woff2',
  '/assets/fonts/Atkinson.woff2'
];

// Install — Save files to cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching all files...');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// Fetch — Serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

// Activate — Clean old cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if(key !== CACHE_NAME) {
            console.log('🗑️ Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
