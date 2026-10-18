// The service worker: a saved copy for no signal, without ever serving a
// stale page to someone who is online.
const fs = require("fs");
const path = require("path");
const { test, expect, openSite } = require("./fixtures");

const PROBE = path.join(__dirname, "..", "sw-probe.txt");

test.use({ serviceWorkers: "allow" });

test("works with no signal, and an update still arrives online", async ({ page, context }) => {
  fs.writeFileSync(PROBE, "v1");
  try {
    await openSite(page);
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15_000 });
    await expect.poll(() => page.evaluate(async () => (await (await caches.open("mealplan-site-v1")).keys()).length),
      { message: "the site is saved" }).toBeGreaterThanOrEqual(10);

    const probe = () => page.evaluate(() => fetch("sw-probe.txt", { cache: "no-store" }).then(r => r.text()));
    expect(await probe()).toBe("v1");
    fs.writeFileSync(PROBE, "v2");
    expect(await probe(), "online, an update is served, not the saved copy").toBe("v2");

    await context.setOffline(true);
    await page.reload({ waitUntil: "load" });
    await page.waitForFunction(() => typeof MONTH !== "undefined" && document.querySelectorAll(".card").length > 0);
    expect(await page.locator(".card").count()).toBeGreaterThanOrEqual(30);
    await expect(page.locator("#hero-title")).toContainText("Mealplan");
    await expect(page.locator("#netstate")).toBeVisible();
    await expect(page.locator("#netstate")).toContainText("No signal");
    expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily), "styles load offline").toMatch(/Instrument Sans/);
    expect(await page.evaluate(() => fetch("sw-probe.txt").then(r => r.text())), "the update is what was saved").toBe("v2");

    await page.evaluate(() => openDay(4));
    await expect(page.locator("#modal")).toHaveClass(/open/);
    expect(await page.locator(".steps li").count()).toBeGreaterThan(0);
    await page.evaluate(() => closeModal(true));
    await page.locator("#trip-1 .gitem").first().click();
    expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("mealplan26:groceries"))).length), "ticks save offline").toBe(1);

    await page.goto("about:blank");
    await page.goto("#nov-26", { waitUntil: "load" });
    await expect.poll(() => page.evaluate(() => typeof MONTH !== "undefined" && `${MONTH.key}-${currentDay}`)).toBe("nov-26");

    await context.setOffline(false);
    await page.evaluate(() => dispatchEvent(new Event("online")));
    await expect(page.locator("#netstate")).toHaveText("Back online.");
  } finally {
    fs.rmSync(PROBE, { force: true });
  }
});
