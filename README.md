# Megan's Grand Mealplan

A static site for five months of dinner plans, 152 nights in total:

| Month | Nights | Shape |
| --- | --- | --- |
| **August 2026** | 30 | Weekly flavour themes, recipes at their published yields |
| **September 2026** | 30 | Oven-led, marinate the night before, portioned from the protein up |
| **October 2026** | 31 | Braises and roasting trays, turnips in place of potatoes |
| **November 2026** | 30 | Root roasts, long braises, and a compliant Thanksgiving |
| **December 2026** | 31 | Soup, stew, the freezer, and three celebration nights |

All five are dairy-free, grain- and starch-free, no added sugar, no vegetable or seed
oils, on the same five proteins: chicken, beef, meatballs, steak and lamb.

## The five months

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
| `styles.css` | Design system, light/dark themes, print stylesheet |
| `data.js` | Both months: days, grocery lists, prep notes, shared dietary rules |
| `app.js` | Rendering, month switching, filtering, the recipe modal, and the SVG dish illustrations |

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

`protein_g: { him, her }` is optional per day. Where it is present the card shows a
`74/48g` chip and the modal draws the meter; where it is absent, as on every August
night, both are simply omitted.

## Features

- Month switcher in the header. Opens on whichever month today falls in, then remembers
  your last choice
- 30 or 31 recipe cards a month, each with a generated illustration
- Filter by protein, or by hands-on time of 15 minutes or less
- Full recipe modal: ingredients, method, source rating, protein per plate, and the
  swaps that keep it compliant
- Deep links: `#sep-14` opens that night's recipe directly. `#nov-26` is Thanksgiving, `#dec-25` is Christmas Day
- Grocery checklists that persist in `localStorage`, kept separate per month, so
  resetting one month leaves the other three alone
- Keyboard: `/` focuses search, `←` `→` move between nights, `[` `]` switch month
- Light/dark themes and a print stylesheet that prints only the shopping lists

## Illustrations

There are no image files. Each dish is an inline SVG composed at runtime in `app.js`
from the day's `art: { protein, veg, sauce }` tags, laid out by a seeded PRNG so a
given dish looks identical on every load. Adding a vegetable to a dish is a one-word
change in `data.js`.

## Recipe sources

Sixty-five of the 152 nights link to a published recipe on
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

Nothing carries an invented rating. Where a night has no stars it is because it is
original, not because the number was lost. The count falls from August to November as
the filter narrows; the alternative was citing pages that had not been read. December
recovers only because repeating a proven recipe became allowed.

Serious Eats was requested but blocks automated access, so no recipe could be read or
verified there and none is cited.
