// Shopping lists: ticking, saving, resetting, and sending what is left.
const { test, expect, openSite, settle } = require("./fixtures");

const clip = (page) => page.evaluate(() => navigator.clipboard.readText());
const bullets = (t) => (t.match(/^- /gm) || []).length;

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test("finishing a trip is marked, saved and celebrated; reset clears the month", async ({ page }) => {
  await openSite(page);
  await settle(page.locator("#trip-1"));
  const items = page.locator("#trip-1 .gitem");
  const n = await items.count();
  for (let i = 0; i < n; i++) await items.nth(i).click();
  await expect(page.locator('.trip-progress[data-trip="1"]')).toHaveClass(/all/);
  await expect(page.locator('.trip-progress[data-trip="1"] b')).toHaveText(`${n}/${n}`);
  await expect(page.locator(".confetti")).toHaveCount(1);
  expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("mealplan26:groceries"))).length)).toBe(n);

  await page.reload();
  await expect(page.locator("#trip-1 .gitem.done")).toHaveCount(n);

  await page.click("#reset-checks");
  expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("mealplan26:groceries"))).filter(k => k.startsWith("oct.")).length)).toBe(0);
});

test("Send list sends what is still unticked", async ({ page }) => {
  await openSite(page);
  await page.evaluate(() => { delete navigator.share; });
  await settle(page.locator("#trip-3"));
  const total = await page.locator("#trip-3 .gitem").count();

  await page.click('[data-send="3"]');
  await expect.poll(() => clip(page)).toMatch(/^Shopping, Sat Oct 10, for Oct 11 to 17\n/);
  let t = await clip(page);
  expect(t).toContain(`${total} things, est.`);
  expect(bullets(t)).toBe(total);
  await expect(page.locator('[data-send="3"]')).toHaveText("Copied");

  // tick the whole first section and one more
  const first = page.locator("#trip-3 .gsec").first();
  const firstN = await first.locator(".gitem").count();
  for (let i = 0; i < firstN; i++) await first.locator(".gitem").nth(i).click();
  await page.locator("#trip-3 .gsec").nth(1).locator(".gitem").first().click();
  await page.evaluate(() => sendTrip(3, document.querySelector('[data-send="3"]')));
  t = await clip(page);
  expect(bullets(t)).toBe(total - firstN - 1);
  expect(t).toContain(`${total - firstN - 1} still to buy (${firstN + 1} already ticked off)`);
  const heading = (await first.locator("h5").textContent()).toUpperCase();
  expect(t.split("\n"), "a section with nothing left drops its heading").not.toContain(heading);

  const shared = await page.evaluate(async () => {
    let got = null;
    navigator.share = async d => { got = d; };
    await sendTrip(3, document.querySelector('[data-send="3"]'));
    return got;
  });
  expect(shared.title).toBe("Shopping list, Sat Oct 10");
  expect(shared.text).toContain("still to buy");

  // everything ticked: the whole list goes, as a record
  const left = page.locator("#trip-3 .gitem:not(.done)");
  while (await left.count()) await left.first().click();
  t = await page.evaluate(async () => { delete navigator.share; await sendTrip(3, document.querySelector('[data-send="3"]')); return navigator.clipboard.readText(); });
  expect(bullets(t)).toBe(total);
  expect(t).toContain(`${total} things`);
});
