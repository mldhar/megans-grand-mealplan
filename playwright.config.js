/* Browser tests for the site. Run them with:
     npm install            (once)
     npx playwright install chromium   (once, if Playwright has no browser yet)
     npm test
   They serve the repository root on a local port, so they test exactly
   the files GitHub Pages would serve. GitHub runs them on every push and
   pull request. */
const { defineConfig, devices } = require("@playwright/test");

const PORT = 8766;

// lets the font stand-in in tests/fixtures.js answer the service worker's
// requests too, so the offline tests never reach Google
process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = "1";

module.exports = defineConfig({
  testDir: "tests",
  timeout: 45_000,
  expect: { timeout: 6_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}/`,
    timezoneId: "UTC",
    locale: "en-US",
    // the offline tests turn this back on; everywhere else a service worker
    // would only hide what the network is doing
    serviceWorkers: "block",
    trace: "retain-on-failure"
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 860 } } }
  ],
  webServer: {
    command: `python3 -m http.server ${PORT} --bind 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: !process.env.CI,
    stdout: "ignore",
    stderr: "ignore"
  }
});
