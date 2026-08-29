# Megan's Grand Mealplan

A static site for two 30-day dinner plans:

| Month | Dates | Shape |
| --- | --- | --- |
| **August 2026** | Sat Aug 1 to Sun Aug 30 | Weekly flavour themes, recipes at their published yields |
| **September 2026** | Tue Sep 1 to Wed Sep 30 | Oven-led, marinate the night before, portioned from the protein up |

Both are dairy-free, grain- and starch-free, no added sugar, no vegetable or seed oils,
on the same five proteins: chicken, ground beef, meatballs, steak and ground lamb.

## The two months

**August** is the original plan. Five weekly flavour directions (Mediterranean,
Southwest, stir-fry, steakhouse, greatest hits), recipes listed at whatever yield they
were published with.

**September** was built after August turned out to be light on protein for two adults.
Two things changed:

- **Easier.** Twenty-two of the thirty nights are marinate-ahead or straight into the
  oven; the other eight are deliberately fast skillet nights. Nineteen nights need
  fifteen minutes or less of hands-on work, against twelve in August.
- **More protein.** Every night is sized to put at least 70g on Vishut's plate and at
  least 45g on Megan's, with a lunch left over. That is roughly 2 to 2¼ lb of boneless
  meat a night, 3 lb bone-in, against August's 1½ lb. Per-plate figures are on every
  card and drawn as a meter in the recipe modal.

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
`AUG_GROCERIES`, `SEP_GROCERIES` and so on), wired together at the bottom by
`PLAN_MONTHS`. To change a recipe, edit the matching entry in the right `*_DAYS` array;
the calendar, card, modal and illustration all read from it.

`app.js` never touches `PLAN_MONTHS` directly. It reads four globals, `WEEKS`, `DAYS`,
`GROCERIES` and `PREP`, which `selectMonth(key)` repoints at the chosen month.
**Adding October is adding one entry to `PLAN_MONTHS`** and nothing else.

`protein_g: { him, her }` is optional per day. Where it is present the card shows a
`74/48g` chip and the modal draws the meter; where it is absent, as on every August
night, both are simply omitted.

## Features

- Month switcher in the header. Opens on whichever month today falls in, then remembers
  your last choice
- 30 recipe cards a month, each with a generated illustration
- Filter by protein, or by hands-on time of 15 minutes or less
- Full recipe modal: ingredients, method, source rating, protein per plate, and the
  swaps that keep it compliant
- Deep links: `#sep-14` opens that night's recipe directly, `#aug-3` the August one
- Grocery checklists that persist in `localStorage`, kept separate per month, so
  resetting September leaves August's ticks alone
- Keyboard: `/` focuses search, `←` `→` move between nights, `[` `]` switch month
- Light/dark themes and a print stylesheet that prints only the shopping lists

## Illustrations

There are no image files. Each dish is an inline SVG composed at runtime in `app.js`
from the day's `art: { protein, veg, sauce }` tags, laid out by a seeded PRNG so a
given dish looks identical on every load. Adding a vegetable to a dish is a one-word
change in `data.js`.

## Recipe sources

Thirty-one of the sixty nights link to a published recipe on
[Budget Bytes](https://www.budgetbytes.com/) or [Downshiftology](https://downshiftology.com/),
with the star rating and review count read off the source page: eighteen in August,
thirteen in September. The rest are marked *Built for this plan*.

Nothing carries an invented rating. Where a night has no stars it is because it is
original, not because the number was lost. September's sourced count is lower because
the filter was tighter: highly rated **and** the oven doing most of the work.

Serious Eats was requested but blocks automated access, so no recipe could be read or
verified there and none is cited.
