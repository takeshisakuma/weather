const cacheName = "weather-v1";

//オフラインでも表示できるようにキャッシュしておくファイル
const appShell = [
  "./",
  "index.html",
  "css/style.css",
  "js/main.js",
  "manifest.json",
  "favicon.ico",
  "img/00.svg",
  "img/01d.svg",
  "img/01n.svg",
  "img/02d.svg",
  "img/02n.svg",
  "img/03d.svg",
  "img/03n.svg",
  "img/04d.svg",
  "img/04n.svg",
  "img/09d.svg",
  "img/09n.svg",
  "img/10d.svg",
  "img/10n.svg",
  "img/11d.svg",
  "img/11n.svg",
  "img/13d.svg",
  "img/13n.svg",
  "img/50d.svg",
  "img/50n.svg"
];


self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(appShell))
  );
  self.skipWaiting();
});


//古いキャッシュを削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
    .then(keys => Promise.all(
      keys.filter(key => key !== cacheName).map(key => caches.delete(key))
    ))
    .then(() => self.clients.claim())
  );
});


//自サイトのファイルはネットワーク優先、失敗したらキャッシュを返す
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
    .then(res => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(cacheName).then(cache => cache.put(request, copy));
      }
      return res;
    })
    .catch(() => caches.match(request, {
      ignoreSearch: true
    }))
  );
});
