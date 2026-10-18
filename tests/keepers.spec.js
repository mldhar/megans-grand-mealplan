// Verdicts (Make again / Skip), the Keepers section, and carrying
// ratings to another device with a #keep= link.
const { test, expect, openSite, sideways, settle } = require("./fixtures");

const VKEY = "mealplan26:verdicts";
const saved = (page) => page.evaluate(k => JSON.parse(localStorage.getItem(k) || "{}"), VKEY);
const clip = (page) => page.evaluate(() => navigator.clipboard.readText());

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test("rating a night marks it everywhere, and tapping again takes it back", async ({ page }) => {
  await openSite(page);
  await expect(page.locator(".kp-catch .kp-row"), "catch-up shows the six most recent").toHaveCount(6);
  await page.evaluate(() => openDay(2));
  await page.click(".m-verdict .vbtn.again");
  await expect(page.locator(".m-verdict .vbtn.again")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator('.card[data-day="2"]')).toHaveClass(/v-again/);
  await expect(page.locator('.glance-cell[data-day="2"]')).toHaveClass(/v-again/);
  await expect(page.locator('.card[data-day="2"]')).toHaveAttribute("aria-label", /marked make again$/);
  expect(await saved(page)).toEqual({ "oct-2": "again" });
  await expect(page.locator(".kp-list.again .kp-title")).toHaveCount(1);

  await page.click(".m-verdict .vbtn.pass");
  await expect(page.locator('.card[data-day="2"]')).toHaveClass(/v-skip/);
  await expect(page.locator('.card[data-day="2"]')).not.toHaveClass(/v-again/);
  expect(await saved(page)).toEqual({ "oct-2": "skip" });

  await page.click(".m-verdict .vbtn.pass");
  expect(await saved(page)).toEqual({});
  await expect(page.locator('.card[data-day="2"]')).not.toHaveClass(/v-/);
});

test("catch up across months, filter, copy the brief, and it all survives a reload", async ({ page }) => {
  await openSite(page);
  await page.evaluate(() => { openDay(2); });
  await page.click(".m-verdict .vbtn.again");
  await page.click("#modal-close");

  await settle(page.locator("#keepers-body"));
  await page.click("#catchup-more");
  expect(await page.locator(".kp-catch .kp-row").count()).toBeGreaterThan(50);
  await page.click('.kp-catch [data-key="aug-1"].again');
  await page.click('.kp-catch [data-key="sep-3"].pass');
  await expect(page.locator(".kp-list.again .kp-title")).toHaveCount(2);
  await expect(page.locator(".kp-list.pass .kp-title")).toHaveCount(1);
  await expect(page.locator('.kp-catch [data-key="aug-1"]')).toHaveCount(0);

  await page.click(".fbtn.keep");
  await expect(page.locator(".card:not(.hide)"), "Make again filter").toHaveCount(1);
  await page.click(".fbtn.keep");

  await page.click("#copy-verdicts");
  await expect.poll(() => clip(page)).toMatch(/MAKE AGAIN \(2\)/);
  const brief = await clip(page);
  expect(brief).toMatch(/SKIP \(1\)/);
  expect(brief).toContain("Greek Sheet Pan Chicken");
  expect(brief.trim().split("\n").pop()).toMatch(/^Open on another device: http:\/\/127\.0\.0\.1:\d+\/#keep=aug1a\.sep3s\.oct2a$/);

  await page.click('.kp-list.again [data-open="aug-1"]');
  await expect.poll(() => page.evaluate(() => `${MONTH.key}-${currentDay}`)).toBe("aug-1");
  await expect(page.locator(".m-verdict .vbtn.again")).toHaveAttribute("aria-pressed", "true");
  await page.click("#modal-close");

  await page.reload();
  await expect(page.locator(".kp-list .kp-row")).toHaveCount(3);
  await expect(page.locator('.card[data-day="1"]')).toHaveClass(/v-again/);
});

test.describe("sending ratings", () => {
  test.use({ seed: { [VKEY]: { "oct-5": "again", "oct-6": "skip", "nov-3": "again", "aug-12": "again" } } });

  test("packs them into a link, by share sheet or clipboard", async ({ page }) => {
    await openSite(page);
    expect(await page.evaluate(() => packVerdicts())).toBe("aug12a.oct5a6s.nov3a");

    await page.evaluate(() => { delete navigator.share; });
    await page.click("#send-verdicts");
    await expect.poll(() => clip(page)).toMatch(/#keep=aug12a\.oct5a6s\.nov3a$/);
    await expect(page.locator("#send-verdicts")).toHaveText("Link copied");

    const shared = await page.evaluate(async () => {
      let got = null;
      navigator.share = async d => { got = d; };
      await sendVerdicts(document.querySelector("#send-verdicts"));
      return got;
    });
    expect(shared.url).toMatch(/#keep=aug12a\.oct5a6s\.nov3a$/);
    expect(shared.text).toContain("4 make-again and skip ratings");

    // dismissing the share sheet does nothing else
    const after = await page.evaluate(async () => {
      navigator.share = async () => { throw new DOMException("dismissed", "AbortError"); };
      await navigator.clipboard.writeText("untouched");
      await sendVerdicts(document.querySelector("#send-verdicts"));
      return navigator.clipboard.readText();
    });
    expect(after).toBe("untouched");
  });
});

test("nothing to send until something is rated", async ({ page }) => {
  await openSite(page);
  await expect(page.locator("#send-verdicts")).toBeDisabled();
});

test.describe("receiving ratings", () => {
  const mine = { "oct-5": "skip", "dec-1": "again", "nov-3": "again" };
  test.use({ seed: { [VKEY]: mine } });

  test("a link asks first, then merges only the nights it names", async ({ page }) => {
    // two parts it cannot use: a month that does not exist and a night October does not have
    await openSite(page, "#keep=aug12a.oct5a6s.nov3a.xyz9a.oct99a");
    expect(await page.evaluate(() => location.hash), "address bar cleaned").toBe("");
    const offer = page.locator(".kp-offer");
    await expect(offer).toContainText("4 ratings from another device.");
    await expect(offer).toContainText("2 new here, 1 you rated differently here, which will take the other device's rating, 1 already the same.");
    expect(await saved(page), "nothing changes before yes").toEqual(mine);
    await expect(offer).toBeInViewport();

    await page.click('[data-offer="yes"]');
    expect(await saved(page)).toEqual({ ...mine, "oct-5": "again", "aug-12": "again", "oct-6": "skip" });
    await expect(page.locator(".kp-offer.done")).toContainText("3 ratings brought in");
    await expect(page.locator('.card[data-day="5"]')).toHaveClass(/v-again/);
    await expect(page.locator('.card[data-day="6"]')).toHaveClass(/v-skip/);
    await expect(page.locator('.glance-cell[data-day="5"]')).toHaveClass(/v-again/);
    await expect(page.locator(".fbtn.keep b")).toHaveText("1");
    await expect(page.locator(".kp-count.again b")).toHaveText("4");
    await expect(page.locator(".kp-count.pass b")).toHaveText("1");
    await page.click('[data-offer="close"]');
    await expect(offer).toHaveCount(0);

    // a link followed with the page open, naming only what is already here
    await page.evaluate(() => { location.hash = "#keep=oct5a"; });
    await expect(offer).toContainText("1 rating from another device. 1 already the same.");
    await page.click('[data-offer="yes"]');
    await expect(offer).toContainText("already here");
  });

  test("paste a link, a bare code, or junk", async ({ page }) => {
    await openSite(page);
    await settle(page.locator("#keepers-body"));
    await page.click("#paste-verdicts");
    await expect(page.locator("#kp-paste-in")).toBeFocused();
    await expect(page.locator("#paste-verdicts")).toHaveAttribute("aria-expanded", "true");
    await page.fill("#kp-paste-in", "  https://mldhar.github.io/megans-grand-mealplan/#keep=DEC2s  ");
    await page.press("#kp-paste-in", "Enter");
    await expect(page.locator(".kp-offer")).toContainText("1 rating from another device. 1 new here");
    await expect(page.locator("#kp-paste")).toBeHidden();
    await page.click('[data-offer="close"]');
    expect(await saved(page), "Not now changes nothing").toEqual(mine);

    await page.click("#paste-verdicts");
    await page.fill("#kp-paste-in", "garbage");
    await page.press("#kp-paste-in", "Enter");
    await expect(page.locator(".kp-offer")).toContainText("no ratings in it");
    await page.click('[data-offer="close"]');

    await page.click("#paste-verdicts");
    await page.fill("#kp-paste-in", "jan1a");
    await page.press("#kp-paste-in", "Enter");
    await expect(page.locator(".kp-offer")).toContainText("1 rating from another device");
  });
});

test.describe("on a phone", () => {
  test.use({
    viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2,
    seed: { [VKEY]: { "oct-5": "again" } }
  });
  test("the offer and the paste field fit", async ({ page }) => {
    await openSite(page, "#keep=oct5a6s.oct7s");
    await expect(page.locator(".kp-offer")).toBeVisible();
    expect(await sideways(page), "sticks out past the screen").toEqual([]);
    await page.click('[data-offer="close"]');
    await page.click("#paste-verdicts");
    expect(await sideways(page), "sticks out past the screen").toEqual([]);
    // under 16px an iPhone zooms the page on focus
    expect(await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector("#kp-paste-in")).fontSize))).toBeGreaterThanOrEqual(16);
  });
});
