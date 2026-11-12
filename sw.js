// Offline shell for Escape Velocity. Network first, cache as fallback.
var CACHE = "ev-v2";
var SHELL = ["./", "index.html", "widget.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", function(e){ e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener("activate", function(e){ e.waitUntil(caches.keys().then(function(ks){ return Promise.all(ks.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); })); self.clients.claim(); });
self.addEventListener("fetch", function(e){
  var u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(function(r){ var copy = r.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, copy); }); return r; }).catch(function(){ return caches.match(e.request).then(function(m){ return m || caches.match("index.html"); }); }));
});
