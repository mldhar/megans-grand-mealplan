// The status strip under the hero: countdowns, the first shop, tonight's
// dinner and the evening's prep job, on the dates they change.
const { test, expect, openSite } = require("./fixtures");

const cases = [
  // [time in UTC, which month is on screen, what the strip should say]
  ["2026-07-31T10:00:00Z", "aug", /^August 2026 starts tomorrow\. First shop is Fri Jul 31 or Sat Aug 1\.$/],
  ["2026-09-29T10:00:00Z", "oct", /^October 2026 starts in 2 days\. First shop is Wed Sep 30\. Tonight's dinner is over in September 2026\./],
  ["2026-10-12T18:00:00Z", "oct", /^Tonight is day 12: /],
  ["2026-10-12T18:00:00Z", "sep", /^September 2026 is done\. Everything below still works as a reference\. Tonight's dinner is over in October 2026\./],
  ["2026-12-29T18:00:00Z", "jan", /^January 2027 starts in 3 days\. First shop is Wed Dec 30 \(small top-up\)\./],
  ["2026-12-30T09:00:00Z", "jan", /^January 2027 starts in 2 days\. First shop is today\./],
  ["2026-12-31T18:00:00Z", "jan", /^January 2027 starts tomorrow\. The first shop was Wed Dec 30 \(small top-up\)\..*Prep tonight: Chili to the fridge before the filets\./]
];

for (const [now, month, says] of cases) {
  test.describe(`on ${now.slice(0, 10)}, looking at ${month}`, () => {
    test.use({ now });
    test("the status strip", async ({ page }) => {
      await page.clock.setFixedTime(new Date(now));
      await openSite(page);
      if (await page.evaluate(() => MONTH.key) !== month) await page.click(`.mtab[data-month="${month}"]`);
      await expect.poll(() => page.evaluate(() => document.querySelector("#status-text").textContent.trim())).toMatch(says);
    });
  });
}

test.describe("on an evening with a prep job", () => {
  test.use({ now: "2026-10-20T18:00:00Z" });
  test("Prep tonight opens the night it is for", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-20T18:00:00Z"));
    await openSite(page);
    const job = await page.evaluate(() => OCT_AHEAD.find(a => a.on === "2026-10-20"));
    await expect(page.locator(".st-prep")).toContainText(`Prep tonight: ${job.title}.`);
    await page.click(".st-prep .linkish");
    await expect.poll(() => page.evaluate(() => `${MONTH.key}-${currentDay}`)).toBe(`oct-${job.night}`);
  });
});

test.describe("on an evening without one", () => {
  test.use({ now: "2026-10-21T18:00:00Z" });
  test("no prep line", async ({ page }) => {
    await page.clock.setFixedTime(new Date("2026-10-21T18:00:00Z"));
    await openSite(page);
    await expect(page.locator(".st-prep")).toHaveCount(0);
  });
});
