# Megan's Grand Mealplan

A static site for six months of dinner plans, 183 nights in total:

| Month | Nights | Shape |
| --- | --- | --- |
| **August 2026** | 30 | Weekly flavour themes, recipes at their published yields |
| **September 2026** | 30 | Oven-led, marinate the night before, portioned from the protein up |
| **October 2026** | 31 | Braises and roasting trays, turnips in place of potatoes |
| **November 2026** | 30 | Root roasts, long braises, and a compliant Thanksgiving |
| **December 2026** | 31 | Soup, stew, the freezer, and three celebration nights |
| **January 2027** | 31 | A first draft: the best-rated nights back in rotation, until the verdicts swap them |

All six are dairy-free, grain- and starch-free, no added sugar, no vegetable or seed
oils, on the same five proteins: chicken, beef, meatballs, steak and lamb.

## The six months

**August** is the original plan. Five weekly flavour directions (Mediterranean,
Southwest, stir-fry, steakhouse, greatest hits), recipes listed at whatever yield they
were published with.

**September** was built after August turned out to be light on protein for two adults.
Two things changed and they hold for every month since:

- **Easier.** Roughly two-thirds of each month is marinate-ahead or straight into the
  oven; the rest are deliberately fast skillet nights. Sixteen to nineteen nights a
  month need fifteen minutes or less of hands-on work, against twelve in August.
- **More protein.** Every night is sized to put at least 70g on Vishut's plate and at
  least 45g on Megan's, with a lunch left over. That is roughly 2 to 2¼ lb of boneless
  meat a night, 3 lb bone-in, against August's 1½ lb. Per-plate figures are on every
  card and drawn as a meter in the recipe modal.

**October** turns the oven down and leaves it on longer. Nine braises and tray roasts
each cover two dinners, so a 31-night month holds about twenty real cooking sessions.
Turnips and radishes replace the potatoes in five sourced recipes, and steamed
cauliflower wrung out in a tea towel replaces mashed potato in two more.

**November** brings Thanksgiving. It falls on Thursday the 26th and is in the plan:
turkey is not one of the five proteins, so it is a 4 lb beef tenderloin with cauliflower
mash, roasted sprouts and a flourless pan gravy. The three nights before it are
deliberately small and the two after it are built on what it leaves.

**December** ends the plan and has to work around three nights it does not control:
Christmas Eve is a rack of lamb, Christmas Day is a 6 lb prime rib, New Year's Eve is
filet mignon. All three are compliant and all three are expensive. Everything around
them is braises, freezer bags and repeats. Two batch nights in the first week put four
dinners into the freezer, which is what makes the run from Dec 20 to Dec 31 possible:
across those twelve nights there are only four real cooking sessions, and three of them
are the celebrations.

**January** is a first draft, written before any verdicts were in. Twenty-nine of its
thirty-one nights have been cooked in this plan before and come back on their published
ratings: the stews, the barbacoa, the Greek chicken, the soups. Two August favourites,
Greek sheet pan chicken and the shakshuka, return resized to the 70g floor, and two
nights are new, ending the plan with a slow-roast lamb shoulder on Jan 31. It costs
about a third less than December. As the Keepers list fills up, nights that got a Skip
are swapped for ones that got a Make again.

### Repeats

From December on, a night may be a dish from an earlier month. Twelve recipes appear in
more than one month and every second appearance carries a `repeat` tag and a swap line
naming where it first showed up. This is how a rotation is supposed to work, and it is
also what keeps the sourced count from collapsing as the pool of new compliant recipes
runs out.

### A note on cuts

Braising needs cuts that ground meat cannot supply, so from September onward the plan
uses chuck, brisket, short rib, shin and lamb shoulder alongside the ground meat and
steak. The two protein tags read **Beef** and **Lamb** rather than *Ground beef* and
*Ground lamb* because of it. Same animals, cheaper cuts, and they are what makes a
four-hour oven night work.

## Running it locally

No build step, no dependencies. Any static server works:

```bash
python3 -m http.server 8765
# then open http://127.0.0.1:8765
```

## Files

| File | What's in it |
| --- | --- |
| `index.html` | Page structure |
| `styles.css` | Design system, light/dark themes, motion, print stylesheet |
| `data.js` | All six months: days, grocery lists, prep notes, the night-before list, shared dietary rules |
| `app.js` | Rendering, month switching, filtering, the recipe modal, kitchen timers, sharing, and the SVG dish illustrations |
| `fx.js` | Motion and depth only: card tilt, the turntable, reveals, count-ups, the theme wipe, confetti. The site works the same without it |
| `sw.js` | The service worker that keeps a copy of the site for when there is no signal |
| `prep-reminders.ics`, `dinners.ics` | Calendar files the site links to, with no alerts: a 7pm event every evening the plan needs something done ahead, and every dinner as an all-day event. Generated by `tools/make-calendar.js` |
| `manifest.webmanifest`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` | What a phone needs to add the site to its home screen as an app |
| `og-image.jpg` | The 1200x630 link preview card. Regenerate with `tools/og-card.html` |
| `icon.svg`, `apple-touch-icon.png` | Favicon and home-screen icon |
| `tools/` | Sources for the images above, rendered with headless Chrome; `make-calendar.js`, which writes the calendar files; and `check.js`, which checks the plan. None of it is loaded by the site |
| `.github/workflows/check.yml` | Runs `tools/check.js` and the browser tests on every push and pull request |
| `tests/`, `playwright.config.js`, `package.json` | The browser tests and what runs them |

### Editing

`data.js` holds each month in its own set of constants (`AUG_DAYS`, `SEP_DAYS`,
`OCT_DAYS`, `NOV_DAYS`, and the matching `*_WEEKS`, `*_GROCERIES` and `*_PREP`), wired
together at the bottom by `PLAN_MONTHS`. To change a recipe, edit the matching entry in
the right `*_DAYS` array; the calendar, card, modal and illustration all read from it.

Months do not have to be the same length. October and December are 31 nights, and
everything that counts nights, the header mark, the glance heading, the modal's
`DAY 07 / 31`, reads `DAYS.length` rather than assuming thirty.

`app.js` never touches `PLAN_MONTHS` directly. It reads four globals, `WEEKS`, `DAYS`,
`GROCERIES` and `PREP`, which `selectMonth(key)` repoints at the chosen month.
**Adding October is adding one entry to `PLAN_MONTHS`** and nothing else.

Each month can carry an `ahead` list (`OCT_AHEAD` and so on): the evenings the plan wants
something done in advance, each with the date it belongs to (`on`), the night it is for, a
title and the detail. After changing them or the days, regenerate the calendar files:

```bash
node tools/make-calendar.js --from 2026-10-12   # or omit --from for "from today"
```

Every event keeps a stable ID made from its date and night, so a subscribed calendar updates
events in place rather than duplicating them. Commit the regenerated files and every
subscribed phone picks up the change on its next refresh. A downloaded copy is a snapshot:
after a big change it is safest to delete those events before importing the new file.

### Checking a change

```bash
node tools/check.js
```

Run it before committing; GitHub runs it on every push and pull request and marks the
commit red if it fails. It needs nothing but Node. It checks:

- every month runs night after night, and every night's date and weekday agree
- every ingredient and shopping line against the four rules (lines that say an item is
  absent, like "no sugar added" or "(check: no cornstarch)", are allowed)
- the 70g/45g protein floor on every night that lists its protein
- that every night-before job falls in the fortnight before its night, and every trip,
  prep note and night points at a week the month has
- that `prep-reminders.ics` and `dinners.ics` still match `data.js`
- that the totals quoted in `index.html` and this README ("183 dinners", "six months",
  "90 sourced") match the plan
- that every script parses and every file the page or the offline copy asks for exists

It prints each problem with where it is, for example
`aug-8: "cream" breaks the dairy rule in "1 cup heavy cream"`.

### Browser tests

`tests/` holds Playwright tests that drive the real page in Chromium: every month and
every recipe, filters and search, the recipe panel and keyboard, timers, the hero,
theme and print, reduced motion, Keepers and the `#keep=` link, shopping lists and Send
list, the status strip on the dates it changes, the calendar card and both calendar
files, and the offline copy. They need Node and Python 3 (for the local server):

```bash
npm install                        # once
npx playwright install chromium    # once
npm test
```

They serve the repository root on port 8766, pin the page's clock to 6pm on Oct 12 2026
(UTC) so dates never drift, answer Google Fonts with an empty stylesheet so nothing
waits on the network, and fail on any error the page logs. GitHub runs them next to
`tools/check.js` on every push and pull request; when one fails, the run keeps the
report and a trace of the failing test for two weeks.

The site itself still has no dependencies and no build step: `package.json` exists
only for the tests.

`protein_g: { him, her }` is optional per day. Where it is present the card shows a
`74/48g` chip and the modal draws the meter; where it is absent, as on every August
night, both are simply omitted.

## Features

- Month switcher in the header. Opens on whichever month today falls in, then remembers
  your last choice
- **Tonight, up front.** The hero is tonight's dinner as a 3D plate on a slow turntable:
  drag it to turn it, step through the other nights with the arrows on the ticket below it,
  click it for the recipe. Outside the month it shows the opening night
- **A real calendar.** Every night sits under its actual weekday. Tonight is ringed, nights
  already cooked are struck through, and filtered-out nights fade in place rather than
  collapsing the grid
- 30 or 31 recipe cards a month, each with a generated illustration that stands up in
  layers when the card tilts toward the pointer
- Filter by protein, or by hands-on time of 15 minutes or less
- Full recipe panel: ingredients, method, source rating, protein per plate, and the
  swaps that keep it compliant. Swipe left and right between nights on a phone
- **Kitchen timers.** Every cooking time in a method step ("roast 40 minutes") is a button
  that starts a timer. Timers keep running with the recipe closed, survive a reload, chime
  and vibrate when they finish, and can be paused or given another minute. Ranges start at
  the low end, which is when you should first check
- **Keep screen on**, in the recipe panel, so a phone propped against the backsplash does not
  go dark mid-step. Released when the recipe closes. Shown only where the browser supports it
- **Verdicts.** Every recipe asks "Cooked it? Would you make it again?" with Make again and
  Skip next time. The verdict shows on the night's card and calendar square, and Make again
  becomes a filter. The Keepers section gathers them across every month: a catch-up list
  of nights already cooked but not rated, most recent first, with one tap each; the make-again
  and skip lists; and a button that copies the lot as plain text. That list is the brief
  each new month gets planned from
- **Ratings on every device.** Verdicts are saved in the browser they were made in, and an
  iPhone's home-screen app keeps its own storage apart from Safari's. Send to another device
  (in Keepers) shares a link ending `#keep=oct5a12s.nov3a`, every rated night with `a` for
  make again and `s` for skip. Opening it, or pasting it into Paste a link in the home-screen
  app, says how many are new, how many differ and how many match, and changes nothing until
  you say so. It only adds or overwrites the nights it names
- **Works with no signal.** After one visit the whole site, fonts included, is saved on the
  device. With no connection it opens from the saved copy and says so; ticks, timers and
  verdicts keep saving as normal. It can be added to a phone's home screen as an app
- **Night-before reminders.** Every evening the plan asks for something ahead (a rub, a
  marinade, a freezer move, an early start, ordering the Christmas meat) is listed in
  `data.js` and shows up two ways: a "Prep tonight" line in the status strip on that
  evening, and a quiet 7pm event in Apple Calendar, Google Calendar or Outlook from
  `prep-reminders.ics`. `dinners.ics` puts every dinner in the calendar as well
- **No notifications.** Neither calendar file carries an alert, and the site never asks to
  send notifications: everything is there when you look, and nothing buzzes. A browser
  test fails if an alert ever goes back into either file
- **Calendar subscriptions.** The Prep section's buttons subscribe (`webcal://`) rather
  than import, so a calendar fetches the files again on its own and a change to the plan
  reaches the phone without anyone re-adding anything. The files ask for a fresh look every
  six hours (`REFRESH-INTERVAL` and `X-PUBLISHED-TTL`); Apple Calendar honours its own
  setting, Google takes a day or more. The card also offers the plain `https://` links for
  Google and Outlook, and one-off downloads. Until Oct 18 2026 the prep events carried a
  7pm alert; a subscription drops it on its next refresh, a downloaded copy keeps it until
  it is deleted and added again
- Deep links: `#sep-14` opens that night's recipe directly. `#nov-26` is Thanksgiving, `#dec-25` is Christmas Day.
  They also work when followed with the site already open
- Grocery checklists that persist in `localStorage`, kept separate per month, so
  resetting one month leaves the others alone. Finishing a trip is celebrated
- Send list, on each trip: what is still unticked, as plain text, to the share sheet
  (Messages, Notes) or the clipboard. Hand half the shop to someone else and
  they get only what is left
- Keyboard: `/` focuses search, `←` `→` move between nights, `[` `]` switch month,
  Space or Enter ticks off an ingredient or step
- Light/dark themes, switched with a circular wipe from the button, and a print stylesheet
  that prints only the shopping lists, headed with the right month's name
- On a phone the section links move to a dock at the bottom of the screen
- Share button: the native share sheet on a phone, copy-to-clipboard everywhere else
- Link previews on iMessage, WhatsApp, Slack, Discord and Facebook via Open Graph tags

### Offline, and why updates still arrive

`sw.js` fetches the site's own files from the network first and keeps the copy only as a
fallback, refreshing it every time the network answers. So anyone online always gets the
current plan, and an edit to `data.js` reaches every phone on its next visit with signal.
On a weak connection it waits three and a half seconds before falling back to the copy.
Fonts are kept separately and served from the copy first, since a font file at a given
address never changes. If you add a new file the site needs at load, add it to `CORE` in
`sw.js` and bump the cache name (`mealplan-site-v1` to `-v2`) so old copies are cleared.

Verdicts, ticked groceries and timers are all `localStorage`, so they are per browser:
Megan's phone and Vishut's phone each keep their own.

### Motion and accessibility

Everything that moves is in `fx.js` and the motion section of `styles.css`. If the
system asks for reduced motion, nothing moves on its own and nothing follows the pointer:
the plates still stand in 3D, but they do not spin, steam, drift or tilt, and every
section is visible without waiting for an entrance. The recipe panel makes the page
behind it inert, so keyboard focus cannot wander out of it, and returns focus to the card
that opened it.

### Regenerating the images

Both images are committed, so you only need this if the numbers or the look change.
The preview card loads the site's own stylesheet and plate renderer, and counts every
figure on it from `data.js`:

```bash
python3 -m http.server 8000
# then, with headless Chrome:
chrome --headless --window-size=1200,630 --screenshot=og-image.jpg http://localhost:8000/tools/og-card.html
chrome --headless --window-size=180,180  --screenshot=apple-touch-icon.png http://localhost:8000/tools/icon-render.html
chrome --headless --window-size=192,192  --screenshot=icon-192.png http://localhost:8000/tools/icon-render.html
chrome --headless --window-size=512,512  --screenshot=icon-512.png http://localhost:8000/tools/icon-render.html
chrome --headless --window-size=512,512  --screenshot=icon-maskable-512.png "http://localhost:8000/tools/icon-render.html?pad=0.14"
```

The card is a JPEG because WhatsApp drops link-preview images over about 300KB, and
a PNG of the plate and its gradients comes out at over 700KB.

The icon's five bars are the five proteins, with heights proportional to how many
nights each one actually got across the first 152.

## Illustrations

There are no image files. Each dish is composed at runtime in `app.js` from the day's
`art: { protein, veg, sauce }` tags, laid out by a seeded PRNG so a given dish looks
identical on every load. Adding a vegetable to a dish is a one-word change in `data.js`.

A dish is drawn as six stacked SVG layers: board, plate, sauce, vegetables, protein,
herbs. On a card the layers shift by their own depth as the card tilts, so the food sits
above the plate and the plate above the board. In the hero and the recipe panel the same
layers are stood on a tilted turntable with real 3D transforms, a few rings under the
plate for the thickness of its rim, and steam rising off the top. The layers draw their
random numbers in exactly the order the single flat picture did, so every dish looks
the way they always have. Card plates are drawn as they come near the screen rather than
all at once, which keeps a month switch quick.

## Recipe sources

Ninety of the 183 nights link to a published recipe on
[Budget Bytes](https://www.budgetbytes.com/) or [Downshiftology](https://downshiftology.com/),
with the star rating and review count read off the source page. The rest are marked
*Built for this plan*.

| Month | Sourced | New | Repeats | Why |
| --- | --- | --- | --- | --- |
| August | 18 / 30 | 18 | 0 | Filtered for high ratings and short hands-on times |
| September | 13 / 30 | 12 | 1 | Tighter filter: highly rated **and** oven-led |
| October | 12 / 31 | 11 | 1 | Tighter still: highly rated, oven-led **and** braisable |
| November | 7 / 30 | 6 | 1 | The pool of oven-led, potato-free, dairy-free recipes on two sites is close to exhausted |
| December | 15 / 31 | 7 | 8 | Repeats allowed, so the best-rated nights come back |
| January | 25 / 31 | 0 | 25 | A draft built on repeats, chosen by rating until the verdicts arrive |

Nothing carries an invented rating. Where a night has no stars it is because it is
original, not because the number was lost. The count falls from August to November as
the filter narrows; the alternative was citing pages that had not been read. December
recovers only because repeating a proven recipe became allowed, and January is built
almost entirely that way, which is why it cites no new pages.

Serious Eats was requested but blocks automated access, so no recipe could be read or
verified there and none is cited.
