// service worker info:
// https://jakearchibald.com/2014/offline-cookbook/#network-falling-back-to-cache
// https://serviceworke.rs/strategy-cache-and-update_service-worker_doc.html
var CACHE = 'cache-and-update';

self.addEventListener('install', function (evt) {
  console.log('The service worker is being installed.');
  evt.waitUntil(precache());
});

self.addEventListener('fetch', function(evt) {
  console.log('The service worker is serving the asset.');
  evt.respondWith(fromCache(evt.request));
  evt.waitUntil(update(evt.request));
});

function precache() {
  return caches.open(CACHE).then(function (cache) {
    return cache.addAll([
      '/scores/',
      '/scores/charts.js',
      '/scores/games.js',
      '/scores/icons-512.png',
      '/scores/index.html',
      '/scores/timer.html',
      '/scores/scythe.html',
      '/scores/manifest.json',
      '/scores/style.css',
    ]);
  });
}

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request).then(function (matching) {
      return matching || Promise.reject('no-match');
    });
  });
}

function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request).then(function (response) {
      console.log('Updated assets from network');
      return cache.put(request, response);
    });
  });
}