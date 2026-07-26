# Megan's Grand August Mealplan

A static site for a 30-day dinner plan, **Sat Aug 1 to Sun Aug 30, 2026**.

Dairy-free, grain- and starch-free, no added sugar, no vegetable or seed oils.
Five proteins on rotation: chicken (11 nights), ground beef (7), meatballs (4), steak (4), ground lamb (4).

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
| `data.js` | All 30 days, 5 grocery lists, prep notes, dietary rules |
| `app.js` | Rendering, filtering, the recipe modal, and the SVG dish illustrations |

To change a recipe, edit the matching entry in `DAYS` in `data.js`. The calendar,
cards, modal and illustration all read from it.

## Features

- 30 recipe cards with a generated illustration per dish
- Filter the month by protein
- Full recipe modal: ingredients, method, source rating, and the swaps that keep it compliant
- Deep links: `#day-14` opens that night's recipe directly
- Grocery checklists that persist in `localStorage`
- Light/dark themes and a print stylesheet

## Illustrations

There are no image files. Each dish is an inline SVG composed at runtime in `app.js`
from the day's `art: { protein, veg, sauce }` tags, laid out by a seeded PRNG so a
given dish looks identical on every load. Adding a vegetable to a dish is a one-word
change in `data.js`.

## Recipe sources

Seventeen of the thirty nights link to a published recipe on
[Budget Bytes](https://www.budgetbytes.com/) or [Downshiftology](https://downshiftology.com/),
with the star rating and review count read off the source page. The other thirteen are
marked *Built for this plan* and exist to use up what the sourced recipes leave behind.

Serious Eats was requested but blocks automated access, so no recipe could be read or
verified there and none is cited.
