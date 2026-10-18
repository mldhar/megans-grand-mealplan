/* Shared setup for every test:
   - the page believes it is 6pm on Monday Oct 12 2026 (UTC), mid-October,
     with the clock still running, unless a test asks for another time
   - Google Fonts are answered with an empty stylesheet, so tests never
     wait on the network and look the same on any machine
   - any uncaught error or console error in the page fails the test
   - seed: localStorage to start from, set before the page's own scripts */
const base = require("@playwright/test");
const { expect } = base;

const test = base.test.extend({
  now: ["2026-10-12T18:00:00Z", { option: true }],
  seed: [null, { option: true }],

  context: async ({ context, seed }, use) => {
    await context.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, r =>
      r.fulfill({ status: 200, contentType: "text/css", body: "" }));
    if (seed) {
      // only on the first load, so a reload shows what the page itself saved
      await context.addInitScript(s => {
        if (sessionStorage.getItem("seeded")) return;
        for (const [k, v] of Object.entries(s)) localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
        sessionStorage.setItem("seeded", "1");
      }, seed);
    }
    await use(context);
  },

  page: async ({ page, now }, use) => {
    const errors = [];
    page.on("pageerror", e => errors.push(e.message));
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    await page.clock.install({ time: new Date(now) });
    await use(page);
    expect(errors, "errors in the page").toEqual([]);
  }
});

/* open the site and wait until it has drawn the month */
async function openSite(page, path = "") {
  await page.goto(path);
  await page.waitForFunction(() => typeof MONTH !== "undefined" && document.querySelectorAll(".card").length > 0);
}

/* what sticks out past the right edge of a phone screen: anything wider
   than the viewport that no container clips. The page clips sideways
   overflow as a backstop, so scroll position alone would hide a cut-off
   button or line; this names it. Empty means everything fits. */
async function sideways(page) {
  return page.evaluate(() => {
    const w = document.documentElement.clientWidth;
    const clipped = (e) => {
      for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) {
        if (getComputedStyle(a).overflowX !== "visible") return true;
      }
      return false;
    };
    return [...document.querySelectorAll("body *")]
      .filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > w + 0.5 && !clipped(e); })
      .map(e => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + [...e.classList].map(c => "." + c).join(""));
  });
}

/* scroll a section into view and wait until it has finished arriving.
   Sections rise into place as they appear; a click that lands mid-rise
   can press on one element and release on another, which is no click. */
async function settle(locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate(el => new Promise(done => {
    const arriving = () => {
      if (el.closest("[data-reveal]:not(.in)")) return true;
      for (let e = el; e; e = e.parentElement) {
        if (e.getAnimations().some(a => a.playState === "running" && Number.isFinite(a.effect.getComputedTiming().endTime))) return true;
      }
      return false;
    };
    const check = () => arriving() ? requestAnimationFrame(check) : done();
    check();
  }));
}

module.exports = { test, expect, openSite, sideways, settle };
