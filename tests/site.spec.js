// The plan itself: months, filters, the recipe panel, timers, the hero,
// theme, keyboard, print and reduced motion.
const { test, expect, openSite, sideways } = require("./fixtures");

test("every month draws its nights as cards and calendar squares", async ({ page }) => {
  await openSite(page);
  const keys = await page.evaluate(() => PLAN_MONTHS.map(m => m.key));
  expect(keys.length).toBeGreaterThanOrEqual(6);
  for (const key of keys) {
    await page.click(`.mtab[data-month="${key}"]`);
    await expect.poll(() => page.evaluate(() => MONTH.key)).toBe(key);
    const r = await page.evaluate(() => ({
      days: DAYS.length,
      cards: document.querySelectorAll(".card").length,
      cells: document.querySelectorAll(".glance-cell").length,
      title: document.querySelector("#hero-title").textContent,
      label: MONTH.label,
      lead: document.querySelectorAll("#glance-grid > .cal-blank").length,
      firstDow: new Date(DAYS[0].date + "T00:00").getDay(),
      plate: !!document.querySelector("#stage-plate .p3d .pl-protein"),
      printTitle: document.querySelector("#groceries").dataset.printTitle
    }));
    expect(r.cards, `${key} cards`).toBe(r.days);
    expect(r.cells, `${key} calendar squares`).toBe(r.days);
    expect(r.title, `${key} title`).toContain(r.label);
    expect(r.lead, `${key} starts on its weekday`).toBeGreaterThanOrEqual(r.firstDow);
    expect(r.plate, `${key} hero plate drawn in layers`).toBe(true);
    expect(r.printTitle, `${key} print header`).toContain(r.label);
    // the sliding marker lands on the chosen tab
    await expect.poll(() => page.evaluate(() => {
      const i = document.querySelector(".mswitch-ind"), t = document.querySelector(".mtab.on");
      return Math.abs(i.getBoundingClientRect().left - t.getBoundingClientRect().left) < 3 && Math.abs(i.offsetWidth - t.offsetWidth) < 2;
    }), `${key} marker`).toBe(true);
  }
});

test("opens on the month today falls in", async ({ page }) => {
  await openSite(page);
  expect(await page.evaluate(() => MONTH.key)).toBe("oct");
});

test("filters, search and the quick filter", async ({ page }) => {
  await openSite(page);
  await page.click('.fbtn[data-filter="lamb"]');
  const f = await page.evaluate(() => ({
    vis: document.querySelectorAll(".card:not(.hide)").length,
    lamb: DAYS.filter(d => d.protein === "lamb").length,
    dim: document.querySelectorAll(".glance-cell.hide").length,
    n: DAYS.length
  }));
  expect(f.vis).toBe(f.lamb);
  expect(f.dim, "calendar dims the others in place").toBe(f.n - f.lamb);
  await page.click('.fbtn[data-filter="all"]');

  await page.fill("#search", "turnip");
  const n = await page.locator(".card:not(.hide)").count();
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThan(31);
  await page.fill("#search", "zzzzqq");
  await expect(page.locator("#no-results")).toBeVisible();
  await page.click("#search-clear");

  await page.click(".fbtn.quick");
  const q = await page.evaluate(() => [document.querySelectorAll(".card:not(.hide)").length, DAYS.filter(d => toMins(d.active) <= 15).length]);
  expect(q[0]).toBe(q[1]);
  await page.click(".fbtn.quick");

  await page.click('.rot-row[data-filter="steak"]');
  await expect.poll(() => page.evaluate(() => filterProtein)).toBe("steak");
  await expect(page.locator(".rot-row.active")).toHaveAttribute("data-filter", "steak");
});

test("the recipe panel: open, move, tick, close", async ({ page }) => {
  await openSite(page);
  await page.locator("#week-2 .card").nth(1).click();
  await expect(page.locator("#modal")).toHaveClass(/open/);
  expect(await page.evaluate(() => location.hash)).toMatch(/^#oct-\d+$/);
  expect(await page.evaluate(() => document.querySelector("main").inert), "page behind is inert").toBe(true);
  await expect(page.locator("#modal-close")).toBeFocused();

  const d0 = await page.evaluate(() => currentDay);
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => page.evaluate(() => currentDay)).toBe(d0 + 1);

  await page.focus(".tickable");
  await page.keyboard.press("Space");
  await expect(page.locator(".tickable").first()).toHaveAttribute("aria-checked", "true");

  await page.keyboard.press("Escape");
  await expect(page.locator("#modal")).not.toHaveClass(/open/);
  expect(await page.evaluate(() => [document.querySelector("main").inert, location.hash])).toEqual([false, ""]);
  expect(await page.evaluate(() => document.activeElement.classList.contains("card")), "focus back on the card").toBe(true);
});

test("night links open the right recipe", async ({ page }) => {
  await openSite(page, "#nov-26");
  await expect(page.locator("#modal")).toHaveClass(/open/);
  expect(await page.evaluate(() => [MONTH.key, currentDay])).toEqual(["nov", 26]);
  await expect(page.locator("#modal-title")).toContainText("Thanksgiving");
  // and when followed with the page already open
  await page.evaluate(() => closeModal(true));
  await page.evaluate(() => { location.hash = "#dec-25"; });
  await expect.poll(() => page.evaluate(() => `${MONTH.key}-${currentDay}`)).toBe("dec-25");
});

test("kitchen timers start from a step, survive a reload and ring", async ({ page }) => {
  await openSite(page);
  // the first October night with a cooking time in its steps
  const day = await page.evaluate(() => { const re = new RegExp(TIME_RE.source, "i"); return DAYS.find(d => d.steps.some(s => re.test(s))).day; });
  await page.evaluate(d => openDay(d), day);
  await page.locator(".tchip").first().click();
  await expect(page.locator(".timer")).toHaveCount(1);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("mealplan26:timers")).length)).toBe(1);
  await expect(page.locator(".steps .tickable.on"), "the chip does not tick its step").toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(page.locator(".timer"), "keeps running with the recipe closed").toHaveCount(1);

  await page.reload();
  await expect(page.locator(".timer")).toHaveCount(1);
  await page.click('.timer .t-btn[data-t="pause"]');
  await expect(page.locator(".timer")).toHaveClass(/paused/);
  await page.click('.timer .t-btn[data-t="x"]');
  await expect(page.locator(".timer")).toHaveCount(0);

  await page.evaluate(() => startTimer(1, "Test dish", "Step 1 · 1 second"));
  await page.clock.runFor(2000);
  await expect(page.locator(".timer")).toHaveClass(/done/);
  expect(await page.title()).toMatch(/^⏰/);
  await page.click('.timer .t-btn[data-t="x"]');
  expect(await page.title()).not.toMatch(/^⏰/);
});

test("the hero ticket steps through nights and opens one", async ({ page }) => {
  await openSite(page);
  const h = await page.evaluate(() => heroDay);
  await page.click("#ticket-next");
  await expect.poll(() => page.evaluate(() => heroDay)).toBe(h + 1);
  await expect(page.locator("#ticket-title")).toHaveText(await page.evaluate(i => DAYS[i].title, h));
  await page.click("#ticket-open");
  await expect.poll(() => page.evaluate(() => currentDay)).toBe(h + 1);
});

test("theme, keyboard month switch and search shortcut", async ({ page }) => {
  await openSite(page);
  await page.click("#theme-toggle");
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.theme)).toBeTruthy();
  const th = await page.evaluate(() => [document.documentElement.dataset.theme, localStorage.getItem("mealplan26:theme")]);
  expect(th[0]).toBe(th[1]);

  await page.evaluate(() => document.activeElement.blur());
  await page.keyboard.press("]");
  await expect.poll(() => page.evaluate(() => MONTH.key)).toBe("nov");
  await page.keyboard.press("[");
  await expect.poll(() => page.evaluate(() => MONTH.key)).toBe("oct");
  await page.keyboard.press("/");
  await expect(page.locator("#search")).toBeFocused();
});

test("printing shows only the shopping lists", async ({ page }) => {
  await openSite(page);
  await page.emulateMedia({ media: "print" });
  const pr = await page.evaluate(() => {
    const vis = s => { const e = document.querySelector(s); return !!e && getComputedStyle(e).display !== "none" && e.getBoundingClientRect().height > 0; };
    return { hero: vis(".hero"), plan: vis("#plan"), groc: vis("#groceries"), trip: vis("#trip-1") };
  });
  expect(pr).toEqual({ hero: false, plan: false, groc: true, trip: true });
});

test.describe("with reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });
  test("nothing waits invisibly for an animation, and nothing spins", async ({ page }) => {
    await openSite(page);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const rm = await page.evaluate(() => ({
      hidden: [...document.querySelectorAll("[data-reveal], .card, .glance-cell")].filter(e => getComputedStyle(e).opacity === "0" && getComputedStyle(e).display !== "none").length,
      spin: getComputedStyle(document.querySelector(".p3d-spin")).animationName,
      particles: getComputedStyle(document.querySelector(".particles")).display
    }));
    expect(rm).toEqual({ hidden: 0, spin: "none", particles: "none" });
  });
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  test("no sideways scroll, and the chosen month tab is in view", async ({ page }) => {
    await openSite(page);
    await page.evaluate(() => switchMonth("jan"));
    await expect.poll(() => page.evaluate(() => {
      const s = document.querySelector("#mswitch").getBoundingClientRect(), on = document.querySelector(".mtab.on").getBoundingClientRect();
      return on.left >= s.left - 1 && on.right <= s.right + 1;
    })).toBe(true);
    expect(await sideways(page), "sticks out past the screen").toEqual([]);
  });
});

test("every night in every month opens a complete recipe", async ({ page }) => {
  await openSite(page);
  const bad = await page.evaluate(() => {
    const out = [];
    for (const m of PLAN_MONTHS) {
      switchMonth(m.key);
      for (const d of DAYS) {
        openDay(d.day);
        const title = document.querySelector("#modal-title").textContent;
        const steps = document.querySelectorAll(".steps li").length;
        const ings = document.querySelectorAll(".ing-group li").length;
        if (title !== d.title || steps < 3 || ings < 3) out.push(`${m.key}-${d.day}: "${title}", ${steps} steps, ${ings} ingredients`);
      }
      closeModal(true);
    }
    return out;
  });
  expect(bad).toEqual([]);
});
