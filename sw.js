/* ============================================================
   Megan's Grand Mealplan · offline
   The site's own files always come from the network first, so an
   update is never hidden behind an old copy. The saved copy is only
   what a phone falls back on with no signal: in a shop, in a lift,
   anywhere. Ticked groceries, timers and verdicts already live in the
   browser, so they work offline as they are.
   ============================================================ */

const SITE = "mealplan-site-v1";
const FONTS = "mealplan-fonts-v1";
const CORE = [
  "./", "index.html", "styles.css", "app.js", "fx.js", "data.js",
  "icon.svg", "apple-touch-icon.png", "icon-192.png", "manifest.webmanifest"
];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];
// on one bar of signal, stop waiting and show the saved copy
const PATIENCE_MS = 3500;

self.addEventListener("install", e => {
  e.waitUntil(caches.open(SITE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== SITE && k !== FONTS).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (FONT_HOSTS.includes(url.hostname)) return e.respondWith(font(req, e));
  if (url.origin !== location.origin) return;
  e.respondWith(site(req, e));
});

/* network first, saved copy as the fallback, and the copy refreshed
   every time the network answers */
async function site(req, e) {
  const cache = await caches.open(SITE);
  const net = fetch(req).then(res => {
    if (res.ok) cache.put(req, res.clone());
    return res;
  });
  // a slow answer still refreshes the copy after the page has moved on
  e.waitUntil(net.then(() => {}, () => {}));
  try {
    return await Promise.race([net, new Promise((_, late) => setTimeout(late, PATIENCE_MS))]);
  } catch (_) {
    const saved = await cache.match(req, { ignoreSearch: true })
      || (req.mode === "navigate" ? await cache.match("index.html") : null);
    return saved || net;
  }
}

/* fonts never change at a given address, so the saved copy wins */
async function font(req, e) {
  const cache = await caches.open(FONTS);
  const saved = await cache.match(req);
  const net = fetch(req).then(res => {
    if (res.ok || res.type === "opaque") cache.put(req, res.clone());
    return res;
  });
  if (saved) { e.waitUntil(net.then(() => {}, () => {})); return saved; }
  return net;
}
