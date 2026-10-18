// The calendar card and the two calendar files it subscribes to.
const { test, expect, openSite, settle } = require("./fixtures");

test.use({ permissions: ["clipboard-read", "clipboard-write"] });

test("subscribe links follow the site that is open; copy gives the https link", async ({ page, baseURL }) => {
  await openSite(page);
  const host = new URL(baseURL).host;
  await expect(page.locator('a[data-feed="prep-reminders.ics"]')).toHaveAttribute("href", `webcal://${host}/prep-reminders.ics`);
  await expect(page.locator('a[data-feed="dinners.ics"]')).toHaveAttribute("href", `webcal://${host}/dinners.ics`);

  await settle(page.locator(".cal-how summary"));
  await page.locator(".cal-how summary").click();
  await expect(page.locator(".cal-how ul")).toBeVisible();
  await expect(page.locator(".cal-cta")).toContainText("No alerts, no notifications");
  await page.click('[data-copy-feed="prep-reminders.ics"]');
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(`${baseURL}prep-reminders.ics`);
  await expect(page.locator('[data-copy-feed="prep-reminders.ics"]')).toHaveText("Copied");
  // the one-off downloads are still offered
  await expect(page.locator('.cal-how a[href="prep-reminders.ics"]')).toHaveCount(1);
  await expect(page.locator('.cal-how a[href="dinners.ics"]')).toHaveCount(1);
});

for (const [file, name, prep] of [["prep-reminders.ics", "Mealplan prep", true], ["dinners.ics", "Mealplan dinners", false]]) {
  test(`${file} is a calendar a phone can subscribe to`, async ({ request }) => {
    const res = await request.get(file);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/^text\/calendar/);
    const body = await res.text();
    expect(body.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(body.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(body).toContain(`X-WR-CALNAME:${name}\r\n`);
    expect(body).toContain("REFRESH-INTERVAL;VALUE=DURATION:PT6H\r\n");
    expect(body).toContain("X-PUBLISHED-TTL:PT6H\r\n");
    expect(body.replace(/\r\n/g, ""), "every line ends CRLF").not.toMatch(/\n/);
    const long = body.split("\r\n").filter(l => Buffer.byteLength(l) > 75);
    expect(long, "no line over 75 octets").toEqual([]);

    const events = body.split("BEGIN:VEVENT").slice(1);
    expect(events.length).toBeGreaterThan(10);
    const uids = events.map(e => /\r\nUID:([^\r]+)/.exec(e)[1]);
    expect(new Set(uids).size, "every event has its own ID").toBe(uids.length);
    // no notifications, ever: the events are there when you look
    expect(body, "no alerts in the calendar").not.toContain("VALARM");
    expect(body).not.toMatch(/\r\n(TRIGGER|ACTION):/);
    for (const e of events) expect(e, "does not block the evening as busy").toContain("\r\nTRANSP:TRANSPARENT\r\n");
    if (prep) for (const e of events) expect(e).toMatch(/\r\nDTSTART:\d{8}T190000\r\n/);
  });
}
