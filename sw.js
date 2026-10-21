// Guarda o app no aparelho para funcionar sem internet no navio.
var CACHE = "buraco-v1";
var APP = ["/", "/index.html", "/manifest.webmanifest", "/icons/icon.svg", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

self.addEventListener("install", function (ev) {
  ev.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(APP); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (ev) {
  if (ev.request.method !== "GET") return;
  // Rede primeiro (pega atualizações quando há sinal); sem sinal, usa o que está guardado.
  ev.respondWith(
    fetch(ev.request).then(function (res) {
      if (res.ok || res.type === "opaque") {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(ev.request, copy); });
      }
      return res;
    }).catch(function () {
      return caches.match(ev.request, { ignoreSearch: true }).then(function (hit) {
        return hit || (ev.request.mode === "navigate" ? caches.match("/index.html") : undefined);
      });
    })
  );
});
