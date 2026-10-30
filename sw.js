const CACHE = 'vc-training-v2';
const ASSETS = [
  '/valuecabs-training/',
  '/valuecabs-training/index.html',
  '/valuecabs-training/quiz.html',
  '/valuecabs-training/portrait.html'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k!==CACHE; }).map(function(k){ return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e){
  var req = e.request;
  if(req.method !== 'GET') return;                       // let Zapier POSTs go straight through
  var url = new URL(req.url);
  if(url.origin !== self.location.origin) return;        // fonts, Zapier etc. — don't touch
  if(req.destination === 'video' || req.headers.has('range') || /\.mp4$/i.test(url.pathname)) return; // never touch video streaming

  e.respondWith(
    fetch(req).catch(function(){ return caches.match(req); })
  );
});
