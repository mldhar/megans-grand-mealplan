/* ============================================================
   AUGUST + SEPTEMBER 2026: TWO 30-DAY MEAL PLANS
   Dairy-free · grain & starch-free · no added sugar · no seed oils
   Proteins: chicken, pre-made meatballs, steak, ground lamb, ground beef
   ============================================================ */

const RULES = {
  out: [
    { t: "Dairy", d: "Butter, cheese, yogurt, cream, milk, sour cream. Every recipe below is rebuilt without it." },
    { t: "Grains & starches", d: "Rice, pasta, bread, tortillas, flour, breadcrumbs, potatoes, corn, beans & legumes." },
    { t: "Added sugar", d: "Sugar, brown sugar, honey, maple, agave, plus the sauces that hide it: BBQ, ketchup, teriyaki, most sriracha, balsamic glaze, taco seasoning packets." },
    { t: "Vegetable & seed oils", d: "Canola, soybean, corn, sunflower, safflower, grapeseed, cottonseed, rice bran, generic “vegetable oil.” This also rules out nearly all bottled mayo and salad dressing." }
  ],
  in: [
    { t: "Fats", d: "Extra-virgin olive oil, avocado oil, beef tallow, coconut oil, rendered fat from the pan." },
    { t: "Acid & umami", d: "Lemon, lime, red wine vinegar, apple cider vinegar, coconut aminos, fish sauce, Dijon, olives, no-sugar-added crushed tomatoes, anchovy." },
    { t: "Vegetables", d: "Leafy greens, cabbage, zucchini, summer squash, cauliflower, broccoli, green beans, asparagus, peppers, mushrooms, tomatoes, cucumber, onion, garlic, avocado, radish, bok choy." },
    { t: "Other", d: "Eggs, almond flour, nuts & seeds, fresh herbs, dried spices." }
  ],
  watch: [
    { t: "Toasted sesame oil", d: "Technically a seed oil. Kept only as an optional ½ tsp finishing drizzle on two days. Leave it out to stay strict." },
    { t: "Balsamic vinegar", d: "Carries residual grape sugar. Swapped out for red wine vinegar everywhere in this plan." },
    { t: "Carrots & onion", d: "Higher-carb than the rest of the veg list. Used in small supporting amounts, never as the bulk." },
    { t: "Almond flour", d: "A nut, not a grain or starch, so it stays. Swap in crushed pork rinds or just skip the binder if you'd rather." },
    { t: "Coconut aminos", d: "Has naturally occurring coconut-sap sugar (~1g per tsp). It replaces soy sauce here; skip if you're counting to zero." }
  ]
};

/* Categorical tag scale, spread wide across the wheel so no two proteins sit
   in the same hue family, and paired with a glyph in the UI so colour is never
   the only signal. Ordered by how many nights each one gets. */
const PROTEINS = {
  chicken:   { label: "Chicken",     hex: "#c98a12", dark: "#e8b545", glyph: "drumstick" },
  beef:      { label: "Ground beef", hex: "#b4442c", dark: "#e0834e", glyph: "grind" },
  meatballs: { label: "Meatballs",   hex: "#26705f", dark: "#4aab98", glyph: "spheres" },
  steak:     { label: "Steak",       hex: "#7d1f3d", dark: "#d95a6b", glyph: "ribeye" },
  lamb:      { label: "Ground lamb", hex: "#55529b", dark: "#9b8ad4", glyph: "sprig" }
};

const AUG_WEEKS = [
  { n: 1, theme: "Mediterranean",  dates: "Aug 1 to 7",  shop: "Fri Jul 31 or Sat Aug 1",
    note: "Lemon, oregano, parsley and olive oil carry the whole week. Buy the big bottle of olive oil now, because it's used every single day for 30 days." },
  { n: 2, theme: "Southwest",      dates: "Aug 8 to 14", shop: "Sat Aug 8",
    note: "Lime, cilantro and bell peppers. Three peppers on Saturday become two more dinners by Thursday, so nothing sits in the drawer going soft." },
  { n: 3, theme: "Stir-fry",       dates: "Aug 15 to 21", shop: "Sat Aug 15",
    note: "One large cabbage covers four dinners. Ginger and green onion are the through-line. Coconut aminos replaces soy sauce all week." },
  { n: 4, theme: "Steakhouse",     dates: "Aug 22 to 28", shop: "Sat Aug 22",
    note: "Mushrooms, thyme, rosemary and a lot of pan sauce. Heaviest meat spend of the month, offset by two ground-beef nights." },
  { n: 5, theme: "Greatest hits",  dates: "Aug 29 to 30", shop: "Sat Aug 29 (small top-up)",
    note: "Two days. Almost everything is already in the fridge. This trip is eggs, a lemon and some greens." }
];

/* ---------- helper for source objects ---------- */
const S = (name, url, rating, reviews) => ({ name, url, rating, reviews });
const ORIGINAL = { name: "Built for this plan", url: null, rating: null, reviews: null };

const AUG_DAYS = [

/* ========== WEEK 1: MEDITERRANEAN ========== */
{
  day: 1, date: "2026-08-01", dow: "Saturday", week: 1, protein: "chicken",
  title: "Greek Sheet Pan Chicken",
  blurb: "The highest-rated recipe in the whole plan, and it needs one pan. Bone-in thighs roast on top of zucchini, peppers and tomatoes so the vegetables cook in the chicken fat.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/greek-sheet-pan-chicken/", 4.96, 806),
  time: "1 hr", active: "15 min", serves: 6, cost: "~$2.90/serving",
  art: { protein: "chicken-thigh", veg: ["zucchini", "tomato", "pepper", "olive", "onion"] },
  tags: ["sheet pan", "leftovers", "hands-off"],
  swaps: ["Skip the ¼ cup feta. Add another ¼ cup kalamata olives instead for the same salty finish.", "Check your Dijon: most are compliant, a few add sugar."],
  ingredients: [
    { g: "Marinade", i: ["½ cup extra-virgin olive oil", "1 lemon, juiced (~3 Tbsp)", "4 garlic cloves, minced", "2 tsp dried oregano", "1 tsp dried thyme", "1 tsp Dijon mustard", "1 tsp kosher salt", "½ tsp black pepper"] },
    { g: "Pan", i: ["6 bone-in, skin-on chicken thighs", "1 medium zucchini, halved lengthwise & sliced", "1 yellow bell pepper, 1-inch pieces", "½ large red onion, in wedges", "1 pint cherry tomatoes", "½ cup pitted kalamata olives", "2 Tbsp chopped parsley"] }
  ],
  steps: [
    "Heat oven to 425°F. Whisk all marinade ingredients together.",
    "Coat the chicken thighs in two-thirds of the marinade; let sit 10 to 15 minutes.",
    "Spread the zucchini, pepper, onion and tomatoes on a sheet pan. Drizzle with the remaining marinade and toss.",
    "Nestle the thighs skin-side up among the vegetables. Roast 30 minutes.",
    "Scatter over the olives and roast another 10 to 15 minutes, until the skin is crisp and the chicken hits 165°F.",
    "Shower with parsley. Spoon the pan juices over everything."
  ],
  leftovers: "Pull the extra thigh meat off the bone tonight. It becomes lunch, and it keeps better off the bone."
},
{
  day: 2, date: "2026-08-02", dow: "Sunday", week: 1, protein: "lamb",
  title: "Lamb Meatballs, Mint Chimichurri",
  blurb: "Make the full batch of 30 meatballs today. Half get eaten, half go straight into the freezer for Aug 25, the single biggest time save in the month.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/lamb-meatballs/", 5.0, 7),
  time: "40 min", active: "20 min", serves: 6, cost: "~$3.60/serving",
  art: { protein: "meatball", veg: ["greens", "tomato", "cucumber"], sauce: "green" },
  tags: ["batch cook", "freezes well", "oven"],
  swaps: ["Almond flour is a nut, not a grain, so it stays. Crushed pork rinds or nothing at all also work.", "Serve over a cucumber-tomato salad instead of pita."],
  ingredients: [
    { g: "Meatballs", i: ["1½ lb ground lamb (15 to 20% fat)", "1 large egg", "¼ cup finely chopped red onion", "¼ cup almond flour", "2 garlic cloves, minced", "¼ cup chopped parsley", "2 Tbsp chopped fresh mint", "2 tsp dried oregano", "½ tsp ground cumin", "2 tsp lemon zest", "1 tsp kosher salt", "½ tsp black pepper"] },
    { g: "Mint chimichurri", i: ["1 cup fresh mint leaves, finely chopped", "½ cup flat-leaf parsley, finely chopped", "2 garlic cloves, roughly chopped", "1 Tbsp red wine vinegar", "½ tsp kosher salt", "¼ tsp red pepper flakes", "½ cup extra-virgin olive oil"] },
    { g: "To serve", i: ["1 cucumber, diced", "1 large tomato, diced", "Olive oil + red wine vinegar"] }
  ],
  steps: [
    "Heat oven to 400°F and line a sheet pan with parchment.",
    "Combine every meatball ingredient in a bowl and mix thoroughly by hand.",
    "Scoop 1½ Tbsp portions and roll into 30 balls. Space them out on the pan.",
    "Bake 25 to 30 minutes, until browned and firm.",
    "Meanwhile chop the mint, parsley and garlic together; stir in the vinegar, salt and pepper flakes, then slowly stir in the olive oil. Let it sit 10 to 15 minutes.",
    "Dress the cucumber and tomato with oil and vinegar. Serve 15 meatballs over the salad with chimichurri spooned across."
  ],
  leftovers: "Freeze the other 15 meatballs flat in a bag. They reappear on Aug 25."
},
{
  day: 3, date: "2026-08-03", dow: "Monday", week: 1, protein: "chicken",
  title: "Garlic Marinated Chicken + Greek Salad",
  blurb: "Compliant exactly as published, with no swaps needed. Olive oil, lemon, garlic, oregano. Get the chicken into the marinade before work and dinner is fifteen minutes.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/garlic-marinated-chicken/", 4.49, 25),
  time: "15 min + marinate", active: "15 min", serves: 4, cost: "$1.49/serving",
  art: { protein: "chicken-breast", veg: ["cucumber", "tomato", "onion", "olive"] },
  tags: ["marinate ahead", "skillet", "20 min"],
  swaps: ["Nothing. This one is already dairy-free, starch-free, sugar-free and olive-oil based.", "Use thighs over breasts: cheaper, and they don't dry out."],
  ingredients: [
    { g: "Marinade", i: ["¼ cup olive oil", "¼ cup lemon juice", "3 garlic cloves, minced", "½ Tbsp dried oregano", "½ tsp salt", "Cracked black pepper"] },
    { g: "Chicken", i: ["1½ lb boneless skinless chicken thighs"] },
    { g: "Greek salad", i: ["1 cucumber, in half-moons", "2 tomatoes, wedged", "¼ red onion, thinly sliced", "¼ cup kalamata olives", "Olive oil, red wine vinegar, oregano, salt"] }
  ],
  steps: [
    "Whisk the oil, lemon juice, garlic, oregano, salt and pepper together.",
    "Add the chicken, turn to coat, and refrigerate 30 minutes to 8 hours.",
    "Heat a large skillet over medium. Cook the thighs 5 to 7 minutes per side until deeply browned and cooked through.",
    "Rest 5 minutes before slicing.",
    "Toss the salad ingredients while the chicken rests. Serve alongside."
  ],
  leftovers: null
},
{
  day: 4, date: "2026-08-04", dow: "Tuesday", week: 1, protein: "meatballs",
  title: "Mediterranean Meatball Skillet",
  blurb: "Twenty minutes, one pan, mostly from the pantry. Pre-made meatballs simmer in crushed tomatoes with olives and oregano, spooned over zucchini ribbons.",
  source: ORIGINAL,
  time: "20 min", active: "15 min", serves: 4, cost: "~$3.00/serving",
  art: { protein: "meatball", veg: ["zucchini", "tomato", "olive"], sauce: "red" },
  tags: ["20 min", "one pan", "pantry"],
  swaps: ["Read the meatball bag and see the sourcing note in the Rules section. Most supermarket meatballs contain breadcrumbs and cheese.", "Use crushed tomatoes with no added sugar, not jarred marinara."],
  ingredients: [
    { g: "Skillet", i: ["1 lb compliant pre-made meatballs (beef or chicken)", "2 Tbsp olive oil", "3 garlic cloves, sliced", "1 (28 oz) can crushed tomatoes, no sugar added", "½ cup pitted kalamata olives", "1 tsp dried oregano", "¼ tsp red pepper flakes", "Salt & pepper"] },
    { g: "Base", i: ["2 zucchini, peeled into ribbons or spiralized", "1 Tbsp olive oil", "2 Tbsp chopped parsley"] }
  ],
  steps: [
    "Warm the olive oil in a large skillet over medium. Add the garlic and cook 30 seconds until fragrant, not brown.",
    "Add the crushed tomatoes, oregano and pepper flakes. Simmer 5 minutes to thicken.",
    "Add the meatballs, cover, and simmer 8 to 10 minutes until heated through. Stir in the olives.",
    "In a second pan, toss the zucchini ribbons with oil over high heat for 90 seconds, just until barely limp, never longer.",
    "Spoon the meatballs and sauce over the ribbons. Finish with parsley."
  ],
  leftovers: "Save 1 cup of the tomato sauce. It turns up again on Aug 28."
},
{
  day: 5, date: "2026-08-05", dow: "Wednesday", week: 1, protein: "steak",
  title: "Seared Sirloin, Chimichurri, Blistered Green Beans",
  blurb: "Steak night. The chimichurri is a Budget Bytes recipe that's already fully compliant: olive oil, red wine vinegar, herbs, no sugar anywhere.",
  source: S("Budget Bytes (chimichurri)", "https://www.budgetbytes.com/chimichurri-sauce/", 4.74, 15),
  time: "30 min", active: "25 min", serves: 4, cost: "~$4.20/serving",
  art: { protein: "steak", veg: ["greenbean", "greens", "lemon"], sauce: "green" },
  tags: ["steak night", "skillet", "30 min"],
  swaps: ["Skip any sugar-based rub. Salt and pepper, aggressively, is the whole seasoning.", "Chimichurri keeps a week, so make the full batch."],
  ingredients: [
    { g: "Steak", i: ["1¼ lb sirloin or flank steak", "1 Tbsp avocado oil", "Kosher salt & coarse black pepper"] },
    { g: "Chimichurri", i: ["1 cup packed Italian parsley", "½ cup packed cilantro", "½ cup olive oil", "¼ cup red wine vinegar", "3 garlic cloves", "1 tsp dried oregano", "½ tsp ground cumin", "¼ tsp crushed red pepper", "½ tsp salt"] },
    { g: "Green beans", i: ["1 lb green beans, trimmed", "1 Tbsp olive oil", "2 garlic cloves, sliced", "Salt, lemon"] }
  ],
  steps: [
    "Take the steak out of the fridge 30 minutes ahead and salt it generously on both sides.",
    "Finely chop the parsley, cilantro and garlic. Stir together with the oil, vinegar, oregano, cumin, pepper flakes and salt. Set aside 15 minutes.",
    "Get a cast-iron skillet ripping hot. Pat the steak dry, oil it, and sear 3 to 4 minutes per side for medium-rare.",
    "Rest the steak 10 minutes. This is not optional, because slicing early costs you the juices.",
    "While it rests, blister the green beans in the same pan over high heat 5 to 6 minutes, tossing. Add garlic in the last minute, then salt and a squeeze of lemon.",
    "Slice the steak against the grain and spoon chimichurri over."
  ],
  leftovers: "Leftover chimichurri goes on Aug 22's steak and Aug 27's chicken."
},
{
  day: 6, date: "2026-08-06", dow: "Thursday", week: 1, protein: "beef",
  title: "Beef Kofta Meatballs, Roasted Vegetables",
  blurb: "4.88 stars from 85 reviews and it tastes like a Middle Eastern restaurant. Warm spices (cumin, cinnamon, a whisper of clove) in the beef.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/beef-kofta-meatballs-with-roasted-vegetables/", 4.88, 85),
  time: "55 min", active: "15 min", serves: 4, cost: "~$2.75/serving",
  art: { protein: "kofta", veg: ["zucchini", "squash", "tomato", "onion"] },
  tags: ["sheet pan", "meal prep", "leftovers"],
  swaps: ["Drop the 4 cups of cooked rice. Serve over the roasted vegetables plus cauliflower rice.", "Use olive oil in place of the generic “cooking oil.”"],
  ingredients: [
    { g: "Roasted vegetables", i: ["1 zucchini, diced", "1 yellow squash, diced", "1 pint grape tomatoes", "¾ red onion, diced", "2 Tbsp olive oil", "¼ tsp garlic powder", "½ tsp dried oregano", "Salt & pepper"] },
    { g: "Kofta", i: ["1 lb ground beef", "2 garlic cloves, minced", "¼ red onion, minced", "2 Tbsp chopped parsley", "½ tsp dried oregano", "¼ tsp cumin", "⅛ tsp cinnamon", "⅛ tsp ground cloves", "¾ tsp salt", "2 Tbsp olive oil for the pan"] },
    { g: "Base", i: ["1 head cauliflower, riced (or 2 bags frozen)", "1 Tbsp olive oil", "2 Tbsp parsley to garnish"] }
  ],
  steps: [
    "Heat oven to 425°F. Toss the diced vegetables with oil and seasoning on a sheet pan.",
    "Roast 40 minutes, stirring once halfway.",
    "Mix the beef with the onion, garlic, herbs and spices until just combined, because overworking makes them tough.",
    "Shape into 16 meatballs.",
    "Brown the meatballs in olive oil in a skillet over medium, in two batches, about 7 minutes each.",
    "Sauté the riced cauliflower in olive oil 5 minutes with salt. Build bowls: cauliflower rice, roasted vegetables, kofta, parsley."
  ],
  leftovers: "Doubles cleanly as lunch for two days. The kofta reheat better than most meatballs."
},
{
  day: 7, date: "2026-08-07", dow: "Friday", week: 1, protein: "chicken",
  title: "Garlic-Herb Chicken Thighs + Roasted Broccoli",
  blurb: "A perfect 5 stars on Budget Bytes. Published with butter, though olive oil does the same job here, and the lemon slices roasting alongside are the real trick.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/garlic-butter-baked-chicken-thighs/", 5.0, 14),
  time: "40 min", active: "5 min", serves: 5, cost: "$1.21/serving",
  art: { protein: "chicken-thigh", veg: ["broccoli", "lemon"] },
  tags: ["5 min prep", "hands-off", "cheap"],
  swaps: ["4 Tbsp butter → 4 Tbsp extra-virgin olive oil. Whisk it with the garlic and paprika exactly the same way.", "Roast the broccoli on the same rack to save a step."],
  ingredients: [
    { g: "Chicken", i: ["5 boneless skinless chicken thighs (~1¼ lb)", "4 Tbsp extra-virgin olive oil", "4 garlic cloves, minced", "¼ tsp paprika", "¼ tsp salt", "Cracked black pepper", "1 lemon, in half-rounds", "2 Tbsp chopped parsley"] },
    { g: "Broccoli", i: ["2 heads broccoli, in florets", "2 Tbsp olive oil", "Salt, pepper, pinch of red pepper flakes"] }
  ],
  steps: [
    "Heat oven to 400°F. Stir the olive oil with the garlic, paprika, salt, pepper and half the parsley.",
    "Lay the thighs in an 8×8 baking dish and spoon the garlic oil over them.",
    "Tuck the lemon half-rounds around the chicken.",
    "Toss the broccoli with oil, salt and pepper on a sheet pan.",
    "Bake both 30 to 35 minutes, until the chicken reads 165°F and the broccoli edges are charred.",
    "Spoon the pan juices back over the chicken and finish with the rest of the parsley."
  ],
  leftovers: null
},

/* ========== WEEK 2: SOUTHWEST ========== */
{
  day: 8, date: "2026-08-08", dow: "Saturday", week: 2, protein: "chicken",
  title: "Sheet Pan Chicken Fajitas",
  blurb: "5 stars, 30 minutes, one pan, and the seasoning is made from scratch so there's no cornstarch or sugar riding along in a packet.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/sheet-pan-chicken-fajitas/", 5.0, 27),
  time: "30 min", active: "10 min", serves: 6, cost: "~$2.40/serving",
  art: { protein: "chicken-breast", veg: ["pepper", "onion", "avocado", "lime"] },
  tags: ["sheet pan", "leftovers", "30 min"],
  swaps: ["Tortillas → butter lettuce or romaine cups.", "Sour cream → guacamole or sliced avocado.", "Make the seasoning yourself from the spices listed, because packets almost always contain sugar and starch."],
  ingredients: [
    { g: "Pan", i: ["1½ lb boneless skinless chicken breasts, sliced thin", "3 bell peppers, sliced thin", "1 medium yellow onion, thinly sliced", "2 Tbsp extra-virgin olive oil"] },
    { g: "Seasoning", i: ["½ Tbsp chili powder", "½ Tbsp ground cumin", "1 tsp garlic powder", "½ tsp paprika", "½ tsp dried oregano", "½ tsp kosher salt", "¼ tsp black pepper"] },
    { g: "To serve", i: ["1 head butter or romaine lettuce, leaves separated", "2 avocados", "1 lime", "Fresh cilantro"] }
  ],
  steps: [
    "Heat oven to 425°F. Stir the spices together in a small bowl.",
    "Toss the chicken, peppers and onion with the olive oil and the full seasoning mix in a large bowl.",
    "Spread across a rimmed sheet pan in a single layer. Crowding steams it instead of roasting it.",
    "Bake 15 to 20 minutes, until the chicken is cooked through and the pepper edges catch.",
    "Pile into lettuce cups with avocado, cilantro and a hard squeeze of lime."
  ],
  leftovers: "Cook the full 1½ lb. Thursday's salad is built from what's left."
},
{
  day: 9, date: "2026-08-09", dow: "Sunday", week: 2, protein: "steak",
  title: "Southwest Steak Bowls",
  blurb: "4.91 stars. The original is a rice-and-beans bowl, rebuilt here on cauliflower rice with guacamole standing in for sour cream. The cumin-lime steak marinade is untouched.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/southwest-steak-bowls/", 4.91, 21),
  time: "1 hr", active: "20 min", serves: 5, cost: "~$3.40/serving",
  art: { protein: "steak", veg: ["cauliflower", "tomato", "avocado", "onion", "lime"] },
  tags: ["steak night", "meal prep", "bowls"],
  swaps: ["Brown rice → cauliflower rice, sautéed with lime and cilantro.", "Black beans and corn → out entirely. More pico, more avocado.", "8 oz sour cream → guacamole."],
  ingredients: [
    { g: "Steak", i: ["1 lb flank or skirt steak", "1½ Tbsp olive oil", "1 garlic clove, minced", "½ tsp ground cumin", "¼ tsp salt", "1 lime, juiced"] },
    { g: "Cauliflower rice", i: ["1 large head cauliflower, riced", "1 Tbsp olive oil", "½ bunch cilantro, chopped", "1 lime", "Salt"] },
    { g: "Pico de gallo", i: ["1 small onion, diced", "1 large tomato, diced", "½ bunch cilantro", "1 lime, juiced", "¼ tsp salt"] },
    { g: "Guacamole", i: ["2 avocados", "1 lime, juiced", "¼ tsp salt", "1 garlic clove, grated"] }
  ],
  steps: [
    "Mix the garlic, oil, cumin, salt and lime juice. Marinate the steak 30 minutes at room temperature.",
    "Rice the cauliflower and sauté in olive oil over medium-high 5 to 6 minutes. Off heat, stir in cilantro, lime juice and salt.",
    "Combine the pico ingredients. Mash the guacamole ingredients separately.",
    "Sear the steak in a hot skillet 3 to 5 minutes per side. Rest 5 minutes, then slice thinly against the grain.",
    "Build bowls: cilantro-lime cauliflower rice, steak, pico, guacamole, extra lime."
  ],
  leftovers: "Make the full head of cauliflower rice. Tuesday uses the rest."
},
{
  day: 10, date: "2026-08-10", dow: "Monday", week: 2, protein: "beef",
  title: "Taco Salad, Dairy-Free",
  blurb: "Thirty minutes and almost no cooking. The published version leans on a seasoning packet, cheese, beans and chips. All four come out, and it's better for it.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/taco-salad/", 4.5, 4),
  time: "30 min", active: "25 min", serves: 6, cost: "~$2.10/serving",
  art: { protein: "beef-crumble", veg: ["greens", "tomato", "avocado", "onion"] },
  tags: ["no-cook sides", "30 min", "big salad"],
  swaps: ["Taco seasoning packet → the scratch blend below (packets carry cornstarch, maltodextrin and sugar).", "Cheese, corn, black beans and tortilla chips → all out.", "Sour cream dressing → avocado-lime dressing built on olive oil."],
  ingredients: [
    { g: "Beef", i: ["1 lb ground beef", "1 Tbsp chili powder", "1½ tsp ground cumin", "1 tsp garlic powder", "1 tsp onion powder", "½ tsp paprika", "½ tsp dried oregano", "½ tsp salt", "¼ tsp cayenne"] },
    { g: "Salad", i: ["1 head iceberg or romaine, chopped", "½ red onion, julienned", "2 roma tomatoes, chopped", "1 avocado, diced", "1 jalapeño, sliced"] },
    { g: "Dressing", i: ["1 avocado", "2 limes, juiced & zested", "1 garlic clove", "4 Tbsp olive oil", "¼ tsp salt", "¼ tsp chili powder", "Water to thin"] }
  ],
  steps: [
    "Stir all the seasoning spices together. That's your taco seasoning, and it takes 20 seconds.",
    "Brown the ground beef in a skillet over medium, breaking it up. Add the seasoning and 2 Tbsp water; cook 2 more minutes.",
    "Blend the dressing avocado, lime, garlic, olive oil and salt, thinning with water until pourable.",
    "Chop the lettuce and vegetables into a big bowl.",
    "Top with the warm beef and diced avocado, drizzle the dressing, and toss at the table."
  ],
  leftovers: "Keep the beef and the salad separate if you want lunch tomorrow."
},
{
  day: 11, date: "2026-08-11", dow: "Tuesday", week: 2, protein: "chicken",
  title: "Cilantro Lime Chicken",
  blurb: "4.93 stars from 52 reviews and it needs zero modification: olive oil, garlic, cumin, lime, cilantro. Marinate in the morning, cook in fifteen minutes.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/easy-cilantro-lime-chicken/", 4.93, 52),
  time: "25 min + marinate", active: "20 min", serves: 6, cost: "$1.11/serving",
  art: { protein: "chicken-thigh", veg: ["cauliflower", "lime", "greens", "avocado"] },
  tags: ["marinate ahead", "skillet", "cheap"],
  swaps: ["None needed. It is already compliant as published.", "Serve over the cauliflower rice left from Sunday."],
  ingredients: [
    { g: "Chicken", i: ["6 boneless skinless chicken thighs (1½ to 1¾ lb)", "2 Tbsp olive oil", "4 garlic cloves, minced", "½ tsp cumin", "½ tsp salt", "Cracked black pepper", "2 limes, divided", "½ bunch cilantro, divided"] },
    { g: "To serve", i: ["Leftover cilantro-lime cauliflower rice", "Sliced avocado", "Lime wedges"] }
  ],
  steps: [
    "Combine the olive oil, garlic, cumin, salt and pepper.",
    "Zest one lime and juice both. Stir the zest, juice and half the cilantro into the marinade.",
    "Coat the thighs and refrigerate 30 minutes to 8 hours.",
    "Heat a large skillet over medium-high. Cook 5 to 7 minutes per side until browned and cooked through.",
    "Finish with the remaining cilantro and a squeeze of lime. Serve over the cauliflower rice."
  ],
  leftovers: null
},
{
  day: 12, date: "2026-08-12", dow: "Wednesday", week: 2, protein: "beef",
  title: "Southwest Beef & Cabbage Skillet",
  blurb: "Twenty-five minutes, one skillet, $1.42 a serving. Cabbage does the work that rice usually does and holds its crunch.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/southwest-beef-cabbage-stir-fry/", 4.55, 42),
  time: "25 min", active: "25 min", serves: 4, cost: "$1.42/serving",
  art: { protein: "beef-crumble", veg: ["cabbage", "tomato", "onion"] },
  tags: ["one pan", "25 min", "cheapest night"],
  swaps: ["Drop the 1 cup of frozen corn and replace it with an extra cup of shredded cabbage.", "Check the canned tomatoes with green chiles for added sugar; fire-roasted plain plus a diced jalapeño also works.", "Taco sauce → a hot sauce with no sugar (most vinegar-based ones qualify)."],
  ingredients: [
    { g: "Skillet", i: ["½ head green cabbage, shredded (~5 cups)", "1 Tbsp olive oil", "½ lb ground beef", "2 garlic cloves, minced", "1 Tbsp chili powder", "½ tsp cumin", "Salt to taste", "1 (10 oz) can diced tomatoes with green chiles, drained", "2 green onions, sliced", "Hot sauce, no sugar added"] }
  ],
  steps: [
    "Shred the cabbage and set it aside.",
    "Heat the oil in a large skillet over medium. Brown the beef with the garlic, chili powder, cumin and salt, breaking it up. Drain if there's a lot of fat.",
    "Add the drained tomatoes and cook until most of the liquid has gone.",
    "Add the cabbage and sauté 2 to 3 minutes. You want it wilted at the edges, still crunchy in the middle.",
    "Top with green onions and hot sauce."
  ],
  leftovers: "Reserve half the cabbage head; it's Thursday's slaw base."
},
{
  day: 13, date: "2026-08-13", dow: "Thursday", week: 2, protein: "meatballs",
  title: "Chipotle-Lime Meatball & Pepper Skillet",
  blurb: "The fastest dinner of the week. Pre-made meatballs, the last of the week's bell peppers, and a smoky chipotle-lime pan sauce.",
  source: ORIGINAL,
  time: "20 min", active: "15 min", serves: 4, cost: "~$3.10/serving",
  art: { protein: "meatball", veg: ["pepper", "onion", "lime"], sauce: "red" },
  tags: ["20 min", "one pan", "uses leftovers"],
  swaps: ["Check the chipotle in adobo for sugar, because several brands add it. Chipotle powder plus a splash of vinegar is a clean substitute.", "Serve over shredded cabbage or in lettuce cups."],
  ingredients: [
    { g: "Skillet", i: ["1 lb compliant pre-made meatballs", "2 Tbsp avocado oil", "2 bell peppers, sliced", "½ onion, sliced", "3 garlic cloves, minced"] },
    { g: "Sauce", i: ["1 to 2 chipotle peppers in adobo, minced (or 1 tsp chipotle powder)", "1 (14 oz) can crushed tomatoes, no sugar added", "1 lime, juiced", "½ tsp cumin", "Salt", "Cilantro to finish"] }
  ],
  steps: [
    "Heat the avocado oil in a large skillet over medium-high. Brown the meatballs on all sides, 5 minutes. Remove.",
    "Add the peppers and onion to the same pan and cook 5 minutes until they take on color.",
    "Add the garlic, chipotle and cumin; cook 1 minute.",
    "Pour in the crushed tomatoes, return the meatballs, cover and simmer 8 minutes.",
    "Finish off the heat with lime juice, salt and a lot of cilantro."
  ],
  leftovers: null
},
{
  day: 14, date: "2026-08-14", dow: "Friday", week: 2, protein: "chicken",
  title: "Chicken Fajita Salad",
  blurb: "Saturday's fajita chicken and peppers, cold, over greens with the avocado-lime dressing from Monday. Assembly, not cooking.",
  source: ORIGINAL,
  time: "10 min", active: "10 min", serves: 4, cost: "~$1.80/serving",
  art: { protein: "chicken-breast", veg: ["greens", "pepper", "avocado", "tomato", "lime"] },
  tags: ["10 min", "no cook", "clears the fridge"],
  swaps: ["Built entirely from what's already in the fridge. If the fajita chicken is gone, quickly sear a thigh with the same spice blend."],
  ingredients: [
    { g: "Salad", i: ["Leftover sheet-pan fajita chicken & peppers", "1 head romaine, chopped", "1 avocado, sliced", "2 roma tomatoes", "¼ red onion, thin", "Cilantro", "1 jalapeño (optional)"] },
    { g: "Dressing", i: ["3 Tbsp olive oil", "1 lime, juiced", "½ tsp cumin", "½ tsp chili powder", "1 garlic clove, grated", "Salt"] }
  ],
  steps: [
    "Warm the leftover chicken and peppers briefly in a dry skillet for 30 seconds, just to wake them up. Or use them cold.",
    "Shake the dressing ingredients together in a jar.",
    "Build the salad: romaine, chicken and peppers, tomato, onion, avocado.",
    "Dress, toss, top with cilantro and jalapeño."
  ],
  leftovers: null
},

/* ========== WEEK 3: STIR-FRY ========== */
{
  day: 15, date: "2026-08-15", dow: "Saturday", week: 3, protein: "beef",
  title: "Beef & Cabbage Stir Fry",
  blurb: "508 reviews at 4.64 stars, the most-reviewed recipe in this plan by a wide margin. Thirty minutes and about $1.79 a serving.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/beef-cabbage-stir-fry/", 4.64, 508),
  time: "30 min", active: "30 min", serves: 4, cost: "$1.79/serving",
  art: { protein: "beef-crumble", veg: ["cabbage", "onion", "greens"], sauce: "brown" },
  tags: ["one pan", "30 min", "reader favorite"],
  swaps: ["Soy sauce → coconut aminos (2½ Tbsp, since aminos are milder).", "Brown sugar → out. The aminos already carry a faint sweetness.", "Sriracha → a sugar-free chili garlic sauce or sambal oelek.", "Toasted sesame oil is technically a seed oil, so keep it as ½ tsp at the end, or leave it out."],
  ingredients: [
    { g: "Sauce", i: ["2½ Tbsp coconut aminos", "1 Tbsp sugar-free chili garlic sauce", "1 tsp rice vinegar (unseasoned)", "½ tsp toasted sesame oil (optional, see note)"] },
    { g: "Stir fry", i: ["½ head green cabbage, shredded", "1 carrot, shredded (keep it to one)", "3 green onions, sliced", "½ Tbsp avocado oil", "½ lb ground beef", "2 garlic cloves, minced", "1 Tbsp fresh grated ginger", "Salt & pepper"] },
    { g: "Finish", i: ["1 Tbsp sesame seeds"] }
  ],
  steps: [
    "Stir the sauce ingredients together and set aside.",
    "Shred the cabbage and carrot, slice the green onions, mince the garlic, grate the ginger. Have it all ready, because stir-fries move fast.",
    "Heat the avocado oil in a large skillet over medium. Brown the beef with the garlic, ginger, salt and pepper, about 5 minutes.",
    "Add the cabbage and carrot; toss over high heat until just wilted.",
    "Pour the sauce over, add the green onions, and toss to coat.",
    "Finish with sesame seeds."
  ],
  leftovers: "Buy one large cabbage on Saturday. It covers today, Tuesday, Thursday and Friday."
},
{
  day: 16, date: "2026-08-16", dow: "Sunday", week: 3, protein: "chicken",
  title: "Ginger-Scallion Chicken Thighs + Bok Choy",
  blurb: "Crisp-skinned thighs with a raw ginger-scallion oil spooned over at the end. There is no cooking of the sauce, just hot oil poured onto aromatics.",
  source: ORIGINAL,
  time: "40 min", active: "20 min", serves: 4, cost: "~$2.30/serving",
  art: { protein: "chicken-thigh", veg: ["bokchoy", "onion"], sauce: "green" },
  tags: ["crispy skin", "sheet pan", "big flavor"],
  swaps: ["Traditionally made with a neutral seed oil, but avocado oil has the high smoke point you need and is compliant.", "Coconut aminos in place of soy."],
  ingredients: [
    { g: "Chicken", i: ["6 bone-in skin-on chicken thighs", "1 Tbsp avocado oil", "Kosher salt & pepper"] },
    { g: "Ginger-scallion oil", i: ["6 green onions, finely sliced", "3 Tbsp fresh ginger, grated", "½ tsp salt", "⅓ cup avocado oil", "1 Tbsp coconut aminos", "1 tsp rice vinegar"] },
    { g: "Bok choy", i: ["1½ lb baby bok choy, halved", "1 Tbsp avocado oil", "3 garlic cloves, sliced", "Splash of coconut aminos"] }
  ],
  steps: [
    "Heat oven to 425°F. Pat the thighs bone-dry, salt them well, and set skin-side up on a sheet pan. Roast 35 to 40 minutes until the skin crackles.",
    "Put the green onions, ginger and salt in a heatproof bowl.",
    "Heat the ⅓ cup avocado oil until it shimmers and just begins to smoke, then pour it directly over the aromatics. It should hiss loudly. Stir in the aminos and vinegar.",
    "Sear the bok choy cut-side down in a hot skillet 3 minutes, add garlic and a splash of aminos, cover 2 minutes.",
    "Spoon the ginger-scallion oil generously over the chicken."
  ],
  leftovers: "The ginger-scallion oil keeps a week in the fridge and improves everything it touches."
},
{
  day: 17, date: "2026-08-17", dow: "Monday", week: 3, protein: "lamb",
  title: "Lamb Larb Lettuce Cups",
  blurb: "Bright, hot, sour and herby: Thai-style minced lamb with lime, mint and chili. Fifteen minutes and no oven in August.",
  source: ORIGINAL,
  time: "20 min", active: "20 min", serves: 4, cost: "~$3.50/serving",
  art: { protein: "lamb-crumble", veg: ["greens", "onion", "lime", "cucumber"] },
  tags: ["20 min", "no oven", "fresh herbs"],
  swaps: ["Traditional larb uses toasted rice powder, which is out. Toasted almond flour or crushed cashews give you the same nutty texture.", "Check the fish sauce label: Red Boat and Three Crabs are sugar-free, many others add it."],
  ingredients: [
    { g: "Larb", i: ["1 lb ground lamb", "1 Tbsp avocado oil", "3 shallots or ½ red onion, thinly sliced", "3 garlic cloves, minced", "3 Tbsp fish sauce (no sugar added)", "3 limes, juiced", "1 to 2 tsp chili flakes", "2 Tbsp toasted almond flour (optional)"] },
    { g: "Herbs & cups", i: ["1 cup fresh mint leaves", "1 cup cilantro", "4 green onions, sliced", "1 head butter lettuce, leaves separated", "1 cucumber, sliced"] }
  ],
  steps: [
    "Brown the lamb hard in the avocado oil over high heat. You want crisp edges, not steamed meat. Break it up as it goes.",
    "Add the shallot and garlic in the last 2 minutes.",
    "Take the pan off the heat. Stir in the fish sauce, lime juice and chili flakes.",
    "Fold in the mint, cilantro, green onions and the almond flour if using. Taste it: it should be sour and salty in equal measure. Adjust with more lime.",
    "Spoon into lettuce cups with cucumber slices alongside."
  ],
  leftovers: null
},
{
  day: 18, date: "2026-08-18", dow: "Tuesday", week: 3, protein: "meatballs",
  title: "Sticky Coconut-Amino Meatballs + Broccoli",
  blurb: "The glaze reduces to something genuinely sticky without a gram of sugar: coconut aminos, ginger, garlic and a long simmer.",
  source: ORIGINAL,
  time: "25 min", active: "15 min", serves: 4, cost: "~$3.00/serving",
  art: { protein: "meatball", veg: ["broccoli", "onion"], sauce: "brown" },
  tags: ["25 min", "one pan", "kid-friendly"],
  swaps: ["No honey, no brown sugar. Reduce the aminos by half and they thicken on their own.", "Roast the broccoli hard at 425°F, until the edges char."],
  ingredients: [
    { g: "Meatballs", i: ["1 lb compliant pre-made meatballs", "1 Tbsp avocado oil"] },
    { g: "Glaze", i: ["⅓ cup coconut aminos", "2 Tbsp rice vinegar (unseasoned)", "1 Tbsp fresh grated ginger", "3 garlic cloves, minced", "½ tsp chili flakes", "½ tsp toasted sesame oil (optional)"] },
    { g: "Broccoli", i: ["2 heads broccoli, in florets", "2 Tbsp avocado oil", "Salt", "2 green onions, sliced", "1 Tbsp sesame seeds"] }
  ],
  steps: [
    "Heat oven to 425°F. Toss the broccoli with oil and salt; roast 20 minutes until the edges blacken.",
    "Brown the meatballs in avocado oil in a skillet over medium-high, about 5 minutes.",
    "Add the aminos, vinegar, ginger, garlic and chili flakes. Simmer 8 to 10 minutes, turning the meatballs, until the glaze coats the back of a spoon.",
    "Off the heat, add the sesame oil if using.",
    "Serve over the broccoli with green onions and sesame seeds."
  ],
  leftovers: null
},
{
  day: 19, date: "2026-08-19", dow: "Wednesday", week: 3, protein: "steak",
  title: "Steak & Mushroom Stir Fry",
  blurb: "Thinly sliced sirloin, seared in batches so it browns instead of stewing, with mushrooms and green beans.",
  source: ORIGINAL,
  time: "25 min", active: "25 min", serves: 4, cost: "~$4.00/serving",
  art: { protein: "steak-strips", veg: ["mushroom", "greenbean", "onion"], sauce: "brown" },
  tags: ["25 min", "high heat", "steak night"],
  swaps: ["Cornstarch slurry → out. Reduce the sauce instead; it clings fine.", "Freeze the steak 20 minutes before slicing. It makes thin slices far easier."],
  ingredients: [
    { g: "Steak", i: ["1¼ lb sirloin, sliced thin against the grain", "1 Tbsp avocado oil", "Salt & pepper"] },
    { g: "Vegetables", i: ["10 oz cremini mushrooms, sliced", "¾ lb green beans, cut in half", "½ onion, sliced", "4 garlic cloves, minced", "1 Tbsp fresh ginger, grated"] },
    { g: "Sauce", i: ["¼ cup coconut aminos", "1 Tbsp rice vinegar", "½ cup beef broth", "½ tsp chili flakes", "Black pepper"] }
  ],
  steps: [
    "Pat the sliced steak very dry and season it. Get a large skillet as hot as it goes.",
    "Sear the steak in two batches, 60 to 90 seconds each, and pull it out. Crowding the pan is the one mistake that ruins this.",
    "Add the mushrooms to the same pan and cook undisturbed 3 minutes, then toss and cook 3 more until browned.",
    "Add the green beans and onion; cook 4 minutes. Add the garlic and ginger for 30 seconds.",
    "Pour in the sauce and let it reduce by half, 3 to 4 minutes.",
    "Return the steak and any resting juices, toss once, and serve immediately."
  ],
  leftovers: null
},
{
  day: 20, date: "2026-08-20", dow: "Thursday", week: 3, protein: "beef",
  title: "Egg Roll in a Bowl",
  blurb: "Everything inside an egg roll, none of the wrapper. Budget Bytes builds it with ground turkey; ground beef swaps in with no other change.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/egg-roll-in-a-bowl/", null, null),
  time: "30 min", active: "30 min", serves: 4, cost: "~$2.20/serving",
  art: { protein: "beef-crumble", veg: ["cabbage", "mushroom", "onion"], sauce: "brown" },
  tags: ["one skillet", "30 min", "uses up cabbage"],
  swaps: ["Ground turkey → ground beef.", "Soy sauce → coconut aminos. Water chestnuts are starchy, so leave them out and add more mushroom for texture.", "Serve as-is or in lettuce cups; skip the cauliflower rice, it doesn't need it."],
  ingredients: [
    { g: "Skillet", i: ["1 lb ground beef", "1 Tbsp avocado oil", "8 oz mushrooms, sliced", "½ head green cabbage, shredded", "4 garlic cloves, minced", "1 Tbsp fresh ginger, grated", "4 green onions, sliced"] },
    { g: "Sauce", i: ["3 Tbsp coconut aminos", "1 Tbsp rice vinegar", "½ tsp white pepper", "½ tsp toasted sesame oil (optional)", "Sugar-free chili garlic sauce to taste"] }
  ],
  steps: [
    "Brown the beef in avocado oil over medium-high; drain excess fat.",
    "Add the mushrooms and cook 4 minutes until they release and reabsorb their liquid.",
    "Stir in the garlic and ginger for 30 seconds.",
    "Add the cabbage in handfuls, tossing until it collapses, about 5 minutes. Keep some bite.",
    "Add the aminos, vinegar and white pepper; toss 1 minute.",
    "Off heat, add sesame oil if using. Top with green onions and chili garlic sauce."
  ],
  leftovers: "Genuinely good cold the next day."
},
{
  day: 21, date: "2026-08-21", dow: "Friday", week: 3, protein: "chicken",
  title: "Sesame-Lime Chicken Cabbage Salad",
  blurb: "The last of the cabbage, shredded raw, with seared chicken and a lime-ginger dressing. Crunchy, cold, and done in twenty minutes.",
  source: ORIGINAL,
  time: "20 min", active: "20 min", serves: 4, cost: "~$2.00/serving",
  art: { protein: "chicken-breast", veg: ["cabbage", "onion", "lime", "greens"] },
  tags: ["20 min", "no oven", "clears the fridge"],
  swaps: ["Bottled sesame dressing is sugar and soybean oil. The dressing below takes two minutes.", "Almonds instead of crispy noodles for the crunch."],
  ingredients: [
    { g: "Chicken", i: ["1¼ lb boneless skinless chicken thighs", "1 Tbsp avocado oil", "Salt, pepper, ½ tsp ground ginger"] },
    { g: "Salad", i: ["½ head green cabbage, finely shredded", "3 green onions, sliced", "1 cup cilantro, chopped", "1 cup mint leaves", "½ cup sliced almonds, toasted", "1 Tbsp sesame seeds"] },
    { g: "Dressing", i: ["3 Tbsp avocado oil", "2 limes, juiced", "1 Tbsp coconut aminos", "1 Tbsp fresh ginger, grated", "1 garlic clove, grated", "½ tsp chili flakes", "Salt"] }
  ],
  steps: [
    "Season the thighs and sear in avocado oil over medium-high, 5 to 6 minutes per side. Rest, then slice.",
    "Shake all the dressing ingredients together in a jar.",
    "Toss the cabbage, green onions, cilantro and mint with about two-thirds of the dressing.",
    "Top with the sliced chicken, the rest of the dressing, toasted almonds and sesame seeds."
  ],
  leftovers: null
},

/* ========== WEEK 4: STEAKHOUSE ========== */
{
  day: 22, date: "2026-08-22", dow: "Saturday", week: 4, protein: "steak",
  title: "Reverse-Sear Steak, Garlic Mushrooms, Asparagus",
  blurb: "The reverse sear (low oven first, screaming skillet second) gives you edge-to-edge pink and a hard crust. It is nearly impossible to overcook this way.",
  source: ORIGINAL,
  time: "50 min", active: "20 min", serves: 4, cost: "~$5.50/serving",
  art: { protein: "steak", veg: ["mushroom", "asparagus"], sauce: "green" },
  tags: ["steak night", "technique", "weekend"],
  swaps: ["Butter basting → baste with olive oil, garlic and thyme instead. Same effect, no dairy.", "Use the chimichurri from Aug 5 if any is left."],
  ingredients: [
    { g: "Steak", i: ["2 thick-cut ribeyes or strip steaks (1½ to 2 in)", "Kosher salt", "Coarse black pepper", "1 Tbsp avocado oil", "4 garlic cloves, smashed", "4 sprigs thyme", "2 Tbsp olive oil for basting"] },
    { g: "Mushrooms", i: ["1 lb cremini mushrooms, halved", "2 Tbsp olive oil", "4 garlic cloves, sliced", "2 sprigs thyme", "Salt"] },
    { g: "Asparagus", i: ["1 lb asparagus, trimmed", "1 Tbsp olive oil", "Lemon, salt, pepper"] }
  ],
  steps: [
    "Salt the steaks generously and leave them uncovered on a rack in the fridge for up to 24 hours (or 45 minutes on the counter).",
    "Heat oven to 250°F. Roast the steaks on a rack until they read 115°F for medium-rare, 25 to 35 minutes. Pull them.",
    "Roast the asparagus at the same time, tossed with oil and salt, 12 minutes.",
    "Get a cast-iron skillet smoking hot with the avocado oil. Sear the steaks 45 to 60 seconds per side.",
    "Add the garlic, thyme and olive oil to the pan and baste the steaks by spooning the hot oil over them for 30 seconds.",
    "Rest 8 minutes. Meanwhile sear the mushrooms in the same pan until deeply browned. Slice the steak and serve."
  ],
  leftovers: "Cold sliced steak on greens is Monday's lunch."
},
{
  day: 23, date: "2026-08-23", dow: "Sunday", week: 4, protein: "chicken",
  title: "Roasted Chicken & Vegetables",
  blurb: "A clean 5 stars. Radishes and cauliflower replace the potatoes and roast to the same soft, caramelized place. Roasted radishes lose all their sharpness.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/roasted-chicken-and-vegetables/", 5.0, 33),
  time: "1 hr 20 min", active: "15 min", serves: 4, cost: "~$2.60/serving",
  art: { protein: "chicken-thigh", veg: ["cauliflower", "radish", "onion"] },
  tags: ["one dish", "hands-off", "Sunday cook"],
  swaps: ["24 oz baby potatoes → 1 lb radishes, halved, plus ½ head cauliflower in florets.", "Keep the carrots to one, cut small. They're the highest-carb thing on the pan."],
  ingredients: [
    { g: "Vegetables", i: ["1 lb radishes, halved", "½ head cauliflower, in florets", "1 large carrot, in 1-inch pieces", "1 red onion, in wedges", "4 garlic cloves, whole"] },
    { g: "Seasoning", i: ["¼ cup olive oil", "2 tsp dried basil", "1 tsp dried thyme", "1 tsp dried rosemary", "½ tsp garlic powder", "¼ tsp paprika", "1 tsp salt", "½ tsp black pepper"] },
    { g: "Chicken", i: ["4 bone-in, skin-on chicken thighs (~2 lb)"] }
  ],
  steps: [
    "Heat oven to 425°F. Halve the radishes, break down the cauliflower, cut the carrot and onion.",
    "Whisk the olive oil with all the herbs and spices.",
    "Toss the vegetables with half the seasoned oil and spread in a 9×13 dish.",
    "Rub the remaining oil over the chicken thighs and nestle them skin-up into the vegetables.",
    "Roast 40 minutes, then stir the vegetables and baste the chicken with the pan juices.",
    "Roast another 20 minutes until the skin is golden and the radishes are tender."
  ],
  leftovers: "Makes enough for two lunches. Shred any leftover chicken off the bone."
},
{
  day: 24, date: "2026-08-24", dow: "Monday", week: 4, protein: "beef",
  title: "Salisbury-Style Beef Patties, Mushroom-Thyme Sauce",
  blurb: "Comfort food with no flour and no cream. The sauce is just mushrooms, onion and broth reduced hard until it coats a spoon.",
  source: ORIGINAL,
  time: "35 min", active: "35 min", serves: 4, cost: "~$2.80/serving",
  art: { protein: "patty", veg: ["mushroom", "greenbean", "onion"], sauce: "brown" },
  tags: ["one pan", "comfort food", "35 min"],
  swaps: ["Breadcrumb binder → 1 egg and 2 Tbsp almond flour, or nothing at all.", "Flour-thickened gravy → reduce the broth by two-thirds instead. It takes 8 minutes and tastes better.", "Worcestershire usually contains sugar, so use coconut aminos plus ½ tsp Dijon."],
  ingredients: [
    { g: "Patties", i: ["1¼ lb ground beef", "1 egg", "2 Tbsp almond flour", "1 tsp onion powder", "1 tsp garlic powder", "1 tsp Dijon", "1 tsp salt", "½ tsp black pepper", "1 Tbsp avocado oil"] },
    { g: "Sauce", i: ["10 oz cremini mushrooms, sliced", "1 onion, thinly sliced", "3 garlic cloves, minced", "2 Tbsp olive oil", "1½ cups beef broth", "1 Tbsp coconut aminos", "1 tsp Dijon", "4 sprigs fresh thyme"] },
    { g: "Side", i: ["1 lb green beans", "1 Tbsp olive oil", "Salt, lemon"] }
  ],
  steps: [
    "Mix the patty ingredients gently and form 4 oval patties about ¾ inch thick. Press a dimple into the center of each.",
    "Sear in avocado oil over medium-high, 4 minutes per side, until well crusted. Remove to a plate.",
    "Add the olive oil, mushrooms and onion to the pan. Cook 8 minutes without stirring much, until deeply browned.",
    "Add the garlic and thyme for 30 seconds, then the broth, aminos and Dijon. Scrape up everything stuck to the pan.",
    "Simmer hard until reduced by about two-thirds, 8 to 10 minutes. Return the patties and any juices; simmer 3 minutes.",
    "Blanch or sauté the green beans, finish with lemon, and serve alongside."
  ],
  leftovers: null
},
{
  day: 25, date: "2026-08-25", dow: "Tuesday", week: 4, protein: "lamb",
  title: "Lamb Meatballs from the Freezer",
  blurb: "This is why you made thirty on Aug 2. Straight from frozen into a 375°F oven, twenty-five minutes, dinner done with a fresh herb salad.",
  source: S("Downshiftology (original batch)", "https://downshiftology.com/recipes/lamb-meatballs/", 5.0, 7),
  time: "25 min", active: "10 min", serves: 4, cost: "~$2.40/serving",
  art: { protein: "meatball", veg: ["greens", "cucumber", "tomato", "onion"], sauce: "green" },
  tags: ["freezer meal", "10 min prep", "easiest night"],
  swaps: ["If the freezer stash is gone, 1¼ lb fresh ground lamb makes patties in the same time.", "Make a fresh half-batch of chimichurri. It takes five minutes and it's worth it."],
  ingredients: [
    { g: "Meatballs", i: ["15 frozen lamb meatballs from Aug 2"] },
    { g: "Quick chimichurri", i: ["½ cup mint, chopped", "¼ cup parsley, chopped", "1 garlic clove", "½ Tbsp red wine vinegar", "¼ cup olive oil", "Salt, red pepper flakes"] },
    { g: "Herb salad", i: ["5 oz arugula or mixed greens", "1 cucumber, sliced", "1 pint cherry tomatoes, halved", "¼ red onion, thin", "Olive oil, lemon, salt"] }
  ],
  steps: [
    "Heat oven to 375°F. Spread the frozen meatballs on a sheet pan, with no need to thaw.",
    "Bake 22 to 25 minutes until heated through to 165°F.",
    "Chop the herbs and garlic and stir together with the vinegar, oil, salt and pepper flakes.",
    "Dress the greens, cucumber, tomato and onion with olive oil, lemon and salt.",
    "Pile the meatballs over the salad and spoon chimichurri across."
  ],
  leftovers: null
},
{
  day: 26, date: "2026-08-26", dow: "Wednesday", week: 4, protein: "meatballs",
  title: "Meatballs with Blistered Tomatoes & Basil",
  blurb: "Cherry tomatoes roasted at high heat until they burst and turn jammy. That's the sauce, with nothing added and no sugar needed.",
  source: ORIGINAL,
  time: "30 min", active: "10 min", serves: 4, cost: "~$3.20/serving",
  art: { protein: "meatball", veg: ["tomato", "greens", "zucchini"], sauce: "red" },
  tags: ["sheet pan", "10 min prep", "hands-off"],
  swaps: ["No parmesan. A handful of toasted pine nuts gives you the savory finish instead.", "Serve over sautéed zucchini or a bed of arugula."],
  ingredients: [
    { g: "Sheet pan", i: ["1 lb compliant pre-made meatballs", "2 pints cherry tomatoes", "6 garlic cloves, smashed", "3 Tbsp olive oil", "1 tsp dried oregano", "½ tsp chili flakes", "Salt & pepper"] },
    { g: "Finish", i: ["1 cup fresh basil, torn", "2 Tbsp pine nuts or slivered almonds, toasted", "Good olive oil to drizzle"] },
    { g: "Base", i: ["2 zucchini, sliced into half-moons", "1 Tbsp olive oil"] }
  ],
  steps: [
    "Heat oven to 425°F.",
    "Toss the tomatoes and garlic with olive oil, oregano, chili flakes, salt and pepper on a sheet pan. Add the meatballs.",
    "Roast 25 minutes, until the tomatoes have collapsed and caramelized at the edges.",
    "Crush a few tomatoes with the back of a spoon and stir so the juices become a sauce.",
    "Sauté the zucchini in olive oil 4 minutes.",
    "Serve the meatballs and tomatoes over the zucchini, showered with basil, nuts and a drizzle of good oil."
  ],
  leftovers: null
},
{
  day: 27, date: "2026-08-27", dow: "Thursday", week: 4, protein: "chicken",
  title: "Herb Skillet Chicken, Green Beans Almondine",
  blurb: "One skillet, a pan sauce built from the fond, and green beans finished with toasted almonds and lemon instead of butter.",
  source: ORIGINAL,
  time: "30 min", active: "30 min", serves: 4, cost: "~$2.20/serving",
  art: { protein: "chicken-thigh", veg: ["greenbean", "lemon"], sauce: "brown" },
  tags: ["one pan", "30 min", "pan sauce"],
  swaps: ["Butter-mounted pan sauce → reduce broth with lemon and finish with a swirl of olive oil off the heat.", "Almondine is classically butter and almonds, but olive oil and almonds gets you 90% of the way."],
  ingredients: [
    { g: "Chicken", i: ["6 boneless skinless chicken thighs", "2 Tbsp olive oil", "1 tsp dried thyme", "1 tsp dried rosemary, crushed", "1 tsp garlic powder", "Salt & pepper"] },
    { g: "Pan sauce", i: ["4 garlic cloves, minced", "1 cup chicken broth", "1 lemon, juiced", "1 tsp Dijon", "2 Tbsp chopped parsley", "1 Tbsp olive oil to finish"] },
    { g: "Green beans", i: ["1 lb green beans, trimmed", "2 Tbsp olive oil", "⅓ cup sliced almonds", "1 lemon", "Salt"] }
  ],
  steps: [
    "Season the thighs with the dried herbs, garlic powder, salt and pepper.",
    "Sear in olive oil over medium-high, 6 minutes per side, until crusted and cooked through. Remove.",
    "Add the garlic to the pan for 30 seconds, then the broth, lemon juice and Dijon. Scrape the fond up and reduce by half, about 5 minutes.",
    "Off the heat, swirl in the last tablespoon of olive oil and the parsley.",
    "Toast the almonds dry in a second pan, remove, then cook the green beans in olive oil 6 to 7 minutes. Add the almonds, lemon and salt.",
    "Return the chicken to the sauce, spoon it over, and serve."
  ],
  leftovers: null
},
{
  day: 28, date: "2026-08-28", dow: "Friday", week: 4, protein: "beef",
  title: "Unstuffed Zucchini Skillet",
  blurb: "Budget Bytes' 4.92-star zucchini boats, deconstructed into a skillet: all the flavor, none of the hollowing out, and forty fewer minutes.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/zucchini-boats/", 4.92, 23),
  time: "30 min", active: "25 min", serves: 4, cost: "~$2.40/serving",
  art: { protein: "beef-crumble", veg: ["zucchini", "tomato", "onion"], sauce: "red" },
  tags: ["one pan", "30 min", "uses leftovers"],
  swaps: ["Italian sausage → ground beef plus 1 tsp fennel seed and ½ tsp chili flakes. Most sausage carries sugar and dextrose.", "Breadcrumbs and mozzarella → both out. Toasted almond flour on top gives you the crunch.", "Jarred marinara → crushed tomatoes with no sugar added (or the cup you saved on Aug 4)."],
  ingredients: [
    { g: "Skillet", i: ["1¼ lb ground beef", "1 tsp fennel seed, crushed", "½ tsp chili flakes", "1½ Tbsp olive oil", "1 small yellow onion, diced", "2 garlic cloves, minced", "½ tsp Italian seasoning", "¾ tsp salt", "½ tsp black pepper"] },
    { g: "Rest", i: ["4 large zucchini (~2 lb), in half-moons", "¾ cup crushed tomatoes, no sugar added", "2 Tbsp almond flour, toasted", "Fresh basil"] }
  ],
  steps: [
    "Brown the beef with the fennel and chili flakes in olive oil over medium heat.",
    "Add the onion and cook until translucent, 4 minutes, then the garlic for 30 seconds.",
    "Stir in the Italian seasoning, salt, pepper and crushed tomatoes. Simmer 5 minutes.",
    "Add the zucchini and cook 6 to 8 minutes, until just tender. Stop before it goes soft.",
    "Toast the almond flour in a dry pan until golden, about 2 minutes.",
    "Scatter the toasted almond flour and torn basil over the top."
  ],
  leftovers: null
},

/* ========== WEEK 5: GREATEST HITS ========== */
{
  day: 29, date: "2026-08-29", dow: "Saturday", week: 5, protein: "lamb",
  title: "Lamb Shakshuka",
  blurb: "4.94 stars from 530 reviews, compliant exactly as written, with browned ground lamb folded into the tomato base. Breakfast, lunch or dinner.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/shakshuka/", 4.94, 530),
  time: "35 min", active: "20 min", serves: 6, cost: "~$2.60/serving",
  art: { protein: "lamb-crumble", veg: ["tomato", "pepper", "egg", "onion"], sauce: "red" },
  tags: ["one pan", "eggs", "any meal"],
  swaps: ["Nothing in the base needs changing: olive oil, onion, pepper, garlic, tomatoes, eggs.", "Skip the bread for dipping. Roasted zucchini planks scoop just as well.", "The lamb is my addition; the recipe is vegetarian as published."],
  ingredients: [
    { g: "Base", i: ["2 Tbsp olive oil", "1 lb ground lamb", "1 medium onion, diced", "1 red bell pepper, diced", "4 garlic cloves, finely chopped", "2 tsp paprika", "1 tsp cumin", "¼ tsp chili powder", "1 (28 oz) can whole peeled tomatoes", "Salt & pepper"] },
    { g: "Finish", i: ["6 large eggs", "1 small bunch cilantro, chopped", "1 small bunch parsley, chopped"] }
  ],
  steps: [
    "Brown the lamb in the olive oil in a large sauté pan over medium-high. Remove it, leaving the fat behind.",
    "Add the bell pepper and onion to the pan; cook 5 minutes until the onion turns translucent.",
    "Stir in the garlic, paprika, cumin and chili powder; cook 1 minute more.",
    "Pour in the tomatoes with their juice, breaking them up with a spoon. Return the lamb, season, and simmer 10 minutes.",
    "Make six wells in the sauce and crack an egg into each. Cover and cook 5 to 8 minutes, until the whites set and the yolks are still loose.",
    "Scatter cilantro and parsley over the top and bring the pan to the table."
  ],
  leftovers: "The tomato base keeps 4 days. Reheat and crack fresh eggs into it."
},
{
  day: 30, date: "2026-08-30", dow: "Sunday", week: 5, protein: "chicken",
  title: "Lemon-Pepper Chicken, No Flour",
  blurb: "4.93 stars from 99 reviews. Skipping the flour dredge costs you nothing. A dry, well-seasoned thigh in a hot pan browns beautifully on its own.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/easy-lemon-pepper-chicken/", 4.93, 99),
  time: "30 min", active: "30 min", serves: 4, cost: "~$1.90/serving",
  art: { protein: "chicken-breast", veg: ["greens", "lemon", "cucumber"], sauce: "brown" },
  tags: ["30 min", "pan sauce", "last night"],
  swaps: ["2 Tbsp all-purpose flour → skip it. Pat the chicken dry and season directly.", "1 Tbsp butter → 1 Tbsp olive oil swirled in off the heat.", "Check your lemon pepper blend for sugar and starchy anti-caking agents, or just use lemon zest, coarse pepper and salt."],
  ingredients: [
    { g: "Chicken", i: ["1⅓ lb boneless skinless chicken thighs or breasts", "1 Tbsp lemon pepper seasoning (or 2 tsp zest + 1 tsp coarse pepper + ½ tsp salt)", "1 Tbsp avocado oil"] },
    { g: "Pan sauce", i: ["1 garlic clove, minced", "½ cup chicken broth", "1 tsp lemon juice", "1 Tbsp olive oil", "1 Tbsp chopped parsley", "⅛ tsp cracked black pepper"] },
    { g: "Big salad", i: ["6 oz mixed greens", "1 cucumber", "1 avocado", "¼ red onion", "Olive oil, lemon, salt"] }
  ],
  steps: [
    "Pat the chicken completely dry and season both sides with the lemon pepper.",
    "Heat the avocado oil in a skillet over medium. Cook 5 to 6 minutes per side until golden. Set aside.",
    "Add the garlic to the pan for 1 minute, then the broth. Whisk up all the browned bits.",
    "Add the lemon juice and simmer 3 to 5 minutes until slightly syrupy.",
    "Off the heat, swirl in the olive oil.",
    "Return the chicken, spoon the sauce over, garnish with parsley. Serve with the dressed salad."
  ],
  leftovers: null
}
];

/* ============================================================
   GROCERY LISTS: five trips
   ============================================================ */

const AUG_GROCERIES = [
{
  trip: 1, week: 1, when: "Shop Fri Jul 31 or Sat Aug 1", covers: "Aug 1 to 7",
  est: "$105 to $125",
  note: "Biggest trip of the month because the pantry gets built today. Weeks 2 to 5 are far lighter.",
  sections: [
    { name: "Meat", items: [
      "6 bone-in, skin-on chicken thighs (~2½ lb)", "2¾ lb boneless skinless chicken thighs",
      "1½ lb ground lamb (15 to 20% fat)", "1 lb ground beef",
      "1¼ lb sirloin or flank steak", "1 lb pre-made meatballs (read the label, see Rules)"
    ]},
    { name: "Produce", items: [
      "3 zucchini", "1 yellow squash", "2 pints cherry or grape tomatoes", "3 large tomatoes",
      "2 red onions", "1 yellow bell pepper", "2 English cucumbers", "1 lb green beans",
      "2 heads broccoli", "1 large head cauliflower", "1 bunch green onions",
      "2 heads garlic", "4 lemons", "2 bunches flat-leaf parsley", "1 bunch mint", "1 bunch cilantro"
    ]},
    { name: "Pantry: buy once, lasts all month", items: [
      "Extra-virgin olive oil (large bottle, you'll use most of it)", "Avocado oil (for high heat)",
      "Red wine vinegar", "Dijon mustard (check: no sugar)", "Kalamata olives, pitted",
      "Crushed tomatoes, no sugar added (28 oz × 2)", "Almond flour",
      "Kosher salt", "Coarse black pepper", "Dried oregano", "Dried thyme", "Dried rosemary",
      "Dried basil", "Ground cumin", "Paprika", "Garlic powder", "Onion powder",
      "Ground cinnamon", "Ground cloves", "Red pepper flakes", "1 dozen eggs"
    ]}
  ]
},
{
  trip: 2, week: 2, when: "Shop Sat Aug 8", covers: "Aug 8 to 14",
  est: "$75 to $90",
  note: "Buy the avocados at different ripenesses: two ready now, three still firm for Thursday and Friday.",
  sections: [
    { name: "Meat", items: [
      "1½ lb boneless skinless chicken breasts", "1¾ lb boneless skinless chicken thighs",
      "1 lb flank or skirt steak", "1 lb ground beef", "½ lb ground beef (or buy 1½ lb total)",
      "1 lb pre-made meatballs"
    ]},
    { name: "Produce", items: [
      "5 bell peppers (mixed colors)", "2 yellow onions", "1 red onion",
      "2 large heads cauliflower", "1 head green cabbage",
      "5 avocados", "8 limes", "1 head butter lettuce", "2 heads romaine", "1 head iceberg",
      "5 roma tomatoes", "1 large tomato", "2 jalapeños",
      "2 bunches cilantro", "1 head garlic", "1 bunch green onions"
    ]},
    { name: "Pantry", items: [
      "Chili powder", "Cayenne", "Chipotle peppers in adobo (check: no sugar) or chipotle powder",
      "Diced tomatoes with green chiles, 10 oz (check: no sugar)",
      "Crushed tomatoes, no sugar added (14 oz)",
      "Hot sauce, no sugar added"
    ]}
  ]
},
{
  trip: 3, week: 3, when: "Shop Sat Aug 15", covers: "Aug 15 to 21",
  est: "$80 to $95",
  note: "One large cabbage covers four dinners. Buy a big knob of ginger. It's in five of the seven nights.",
  sections: [
    { name: "Meat", items: [
      "1½ lb ground beef", "6 bone-in skin-on chicken thighs", "1¼ lb boneless skinless chicken thighs",
      "1 lb ground lamb", "1¼ lb sirloin steak", "1 lb pre-made meatballs"
    ]},
    { name: "Produce", items: [
      "1 very large head green cabbage (or 2 medium)", "1½ lb baby bok choy",
      "18 oz cremini mushrooms", "¾ lb green beans", "2 heads broccoli",
      "1 carrot", "2 yellow onions", "1 red onion or 3 shallots",
      "2 large knobs fresh ginger", "2 heads garlic", "3 bunches green onions",
      "5 limes", "2 bunches cilantro", "2 bunches mint", "1 head butter lettuce", "1 cucumber"
    ]},
    { name: "Pantry", items: [
      "Coconut aminos (large bottle)", "Rice vinegar, unseasoned",
      "Sugar-free chili garlic sauce or sambal oelek",
      "Fish sauce, no sugar added (Red Boat or Three Crabs)",
      "Sesame seeds", "Sliced almonds", "Ground ginger",
      "Toasted sesame oil (optional, see the Rules note)", "Beef broth (32 oz)"
    ]}
  ]
},
{
  trip: 4, week: 4, when: "Shop Sat Aug 22", covers: "Aug 22 to 28",
  est: "$105 to $125",
  note: "Heaviest meat spend of the month, and the ribeyes drive it. Petite sirloin or a thick strip steak cuts $15 off with no change to the method.",
  sections: [
    { name: "Meat", items: [
      "2 thick-cut ribeye or strip steaks (1½ to 2 in)",
      "4 bone-in skin-on chicken thighs (~2 lb)", "6 boneless skinless chicken thighs",
      "2½ lb ground beef", "1 lb pre-made meatballs",
      "(Lamb meatballs already in the freezer from Aug 2)"
    ]},
    { name: "Produce", items: [
      "1¾ lb cremini mushrooms", "1 lb asparagus", "2 lb green beans",
      "1 lb radishes", "1 head cauliflower", "1 carrot",
      "4 large zucchini", "3 pints cherry tomatoes",
      "2 yellow onions", "2 red onions", "2 heads garlic",
      "5 oz arugula or mixed greens", "1 cucumber", "3 lemons",
      "1 bunch fresh thyme", "1 bunch parsley", "1 large bunch basil", "1 bunch mint"
    ]},
    { name: "Pantry", items: [
      "Chicken broth (32 oz)", "Beef broth (32 oz)",
      "Pine nuts or slivered almonds", "Fennel seed",
      "Italian seasoning", "Crushed tomatoes, no sugar added (14 oz)"
    ]}
  ]
},
{
  trip: 5, week: 5, when: "Shop Sat Aug 29, small top-up", covers: "Aug 29 to 30",
  est: "$25 to $35",
  note: "Two dinners, and most of it is already in the house. This is a corner-store run.",
  sections: [
    { name: "Meat", items: ["1 lb ground lamb", "1⅓ lb boneless skinless chicken thighs"] },
    { name: "Produce", items: [
      "1 red bell pepper", "1 onion", "1 head garlic",
      "6 oz mixed greens", "1 cucumber", "1 avocado", "1 red onion", "2 lemons",
      "1 bunch cilantro", "1 bunch parsley"
    ]},
    { name: "Pantry", items: [
      "Whole peeled tomatoes (28 oz)", "1 dozen eggs", "Chicken broth if you're out",
      "Lemon pepper seasoning (check: no sugar or starch)"
    ]}
  ]
}
];

/* ============================================================
   PREP-AHEAD NOTES
   ============================================================ */

const AUG_PREP = [
  { w: 1, day: "Sunday Aug 2", items: [
    "Make the full 30 lamb meatballs. Freeze 15 flat in a bag. They become dinner on Aug 25.",
    "Double the chimichurri on Aug 5; it keeps a week and lands on Aug 22's steak.",
    "Rice the whole cauliflower at once on Aug 6 and refrigerate what you don't use."
  ]},
  { w: 2, day: "Sunday Aug 9", items: [
    "Rice the full head of cauliflower, because Sunday and Tuesday both use it.",
    "Mix a double batch of the scratch taco seasoning; it covers Aug 10, 13 and 14.",
    "Cook all 1½ lb of fajita chicken on Saturday. Friday's salad is the leftovers."
  ]},
  { w: 3, day: "Saturday Aug 15", items: [
    "Shred the entire cabbage head on Saturday and store it in a bag with a paper towel. Four dinners draw from it.",
    "Grate a big knob of ginger and keep it in a jar under a little avocado oil.",
    "Make the ginger-scallion oil on Sunday. It keeps a week and lifts anything you put it on."
  ]},
  { w: 4, day: "Friday Aug 21", items: [
    "Salt the ribeyes and leave them uncovered on a rack in the fridge overnight for Saturday. This is the single biggest upgrade to the steak.",
    "Move the frozen lamb meatballs to the fridge on Monday night for Tuesday.",
    "Clean and halve all the mushrooms at once, because three dinners this week use them."
  ]},
  { w: 5, day: "Friday Aug 28", items: [
    "Check what's left: half-used herbs, greens, lemons. Both remaining dinners are designed to absorb them.",
    "The shakshuka tomato base can be made a day ahead and reheated with fresh eggs cracked in."
  ]}
];

const MEATBALL_NOTE = {
  title: "About the pre-made meatballs",
  body: "This is the one ingredient that needs real label-reading. The large majority of supermarket meatballs contain breadcrumbs and grated cheese, and many add sugar, dextrose or soybean oil on top of that, so most of the freezer case is out.",
  look: [
    "No breadcrumbs, panko, cracker meal, wheat, rice flour or textured soy",
    "No cheese, romano, parmesan, whey or milk solids",
    "No sugar, dextrose, corn syrup solids or maltodextrin",
    "No soybean, canola, sunflower or generic vegetable oil"
  ],
  where: "Verified while building this plan: Trader Joe's Chicken Meatballs are gluten-free and made with chicken plus simple dried seasonings (sea salt, oregano, basil, vinegar powder, garlic and onion powder, rosemary, pepper, parsley). Trader Joe's Turkey Meatballs are not, because they contain breadcrumbs, soy and corn syrup solids. Paleo and Whole30-labeled brands in the freezer aisle are the most reliable place to look, though they cost more. I could not verify ingredient panels for every regional brand, so check the bag you actually buy against the four rules above.",
  fallback: "If nothing at your store qualifies, roll your own: 1 lb ground beef, 1 egg, 2 Tbsp almond flour, 2 minced garlic cloves, 1 tsp each salt, oregano and onion powder. Bake at 400°F for 20 minutes. One batch covers a meatball night, and a double batch freezes for the rest of the month."
};

/* ============================================================
   SEPTEMBER 2026: 30-DAY MEAL PLAN
   Same four rules. Oven-led, marinate the night before, and
   sized up so a plate actually lands at 70g+ of protein.
   ============================================================ */

const SEP_WEEKS = [
  { n: 1, theme: "Overnight marinade", dates: "Sep 1 to 5", shop: "Mon Aug 31 or Tue Sep 1",
    note: "Five nights to learn the shape of this month. Meat goes into a bag before bed, comes out after work, goes into the oven. Buy the zip bags and a second sheet pan on this trip." },
  { n: 2, theme: "One sheet pan",       dates: "Sep 6 to 12", shop: "Sat Sep 5",
    note: "Protein and vegetables on the same pan, every night but two. Sunday's whole chicken is deliberately oversized: it carries Monday's lunch and part of Tuesday." },
  { n: 3, theme: "Low and slow",        dates: "Sep 13 to 19", shop: "Sat Sep 12",
    note: "The oven does the work at 300°F instead of 425°F. Sunday's pot roast and Thursday's ragu each cover two dinners, which is why this week only has three real cooking nights." },
  { n: 4, theme: "The spice drawer",    dates: "Sep 20 to 26", shop: "Sat Sep 19",
    note: "Dry rubs and overnight marinades doing the heavy lifting. Nothing here needs a sauce made at the last minute, because the flavour went on twelve hours earlier." },
  { n: 5, theme: "Cook once, eat twice", dates: "Sep 27 to 30", shop: "Sat Sep 26",
    note: "Four nights, two of them from the freezer or from Sunday's oven. The last trip is small on purpose." }
];

const SEP_DAYS = [

/* ========== WEEK 1: OVERNIGHT MARINADE ========== */
{
  day: 1, date: "2026-09-01", dow: "Tuesday", week: 1, protein: "chicken",
  title: "Greek Lemon Chicken, Overnight",
  blurb: "4.98 stars from 341 ratings and compliant exactly as published. Eight bone-in thighs, which is the size that gets Vishut to 76g without a second thought.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/greek-lemon-chicken/", 4.98, 341),
  time: "55 min + marinate", active: "15 min", serves: 4, cost: "~$3.20/serving",
  protein_g: { him: 76, her: 49 },
  art: { protein: "chicken-thigh", veg: ["lemon", "greenbean", "onion", "tomato"] },
  tags: ["marinate ahead", "oven", "one dish"],
  swaps: [
    "Nothing needs swapping. Olive oil, lemon, garlic, oregano, thyme, Dijon. Check the Dijon for sugar and you are done.",
    "Split the marinade to go overnight safely: oil, garlic, oregano, thyme and salt on the chicken before bed, then stir the lemon juice and Dijon in an hour before it roasts. The source warns that acid past about three hours turns the texture chalky, and this gets you the long soak without that.",
    "Eight thighs is double the two of you need tonight. That is the point: the extra two are tomorrow's lunch."
  ],
  ingredients: [
    { g: "Overnight marinade", i: ["⅓ cup extra-virgin olive oil", "4 garlic cloves, minced", "1 Tbsp dried oregano", "2 tsp dried thyme", "2 tsp kosher salt", "1 tsp freshly ground black pepper"] },
    { g: "Stir in one hour before", i: ["¼ cup lemon juice (about 1½ lemons)", "2 tsp Dijon mustard"] },
    { g: "Chicken & pan", i: ["8 bone-in, skin-on chicken thighs (~3 lb)", "1 lb green beans, trimmed", "1 red onion, in wedges", "1 pint cherry tomatoes", "1 lemon, in thick rounds"] }
  ],
  steps: [
    "Before bed: whisk the oil, garlic, oregano, thyme, salt and pepper together, rub it over the thighs in a zip bag and refrigerate.",
    "An hour before dinner: add the lemon juice and Dijon to the bag, squish it around and leave it on the counter to come up to room temperature.",
    "Heat oven to 350°F. Spread the green beans, onion, tomatoes and lemon rounds in a large roasting dish.",
    "Lay the thighs skin-side up on top and pour every drop of the marinade over them.",
    "Roast 40 to 45 minutes, until the skin is browned and the thighs read 175°F at the bone.",
    "Rest 5 minutes. Spoon the pan juices back over the chicken and the beans before serving."
  ],
  leftovers: "Two thighs and a handful of beans go into a container tonight, while it is still warm. That is tomorrow's lunch at roughly 45g."
},
{
  day: 2, date: "2026-09-02", dow: "Wednesday", week: 1, protein: "beef",
  title: "Beef Kofta with Roasted Vegetables",
  blurb: "4.88 stars from 85 reviews. Doubled from the published pound of beef, and the rice underneath is simply left out, because the vegetables were always the better half of this dish.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/beef-kofta-meatballs-with-roasted-vegetables/", 4.88, 85),
  time: "55 min", active: "15 min", serves: 4, cost: "~$3.60/serving",
  protein_g: { him: 74, her: 48 },
  art: { protein: "kofta", veg: ["zucchini", "squash", "tomato", "onion"] },
  tags: ["oven", "sheet pan", "batch"],
  swaps: [
    "4 cups cooked rice → gone. Double the roasted vegetables instead, which is what this recipe already does best.",
    "2 Tbsp cooking oil → avocado oil, which takes 425°F without breaking down.",
    "The published recipe uses 1 lb of beef for four. This uses 2 lb, and the spice quantities below are doubled to match."
  ],
  ingredients: [
    { g: "Kofta", i: ["2 lb ground beef (85/15)", "4 garlic cloves, minced", "½ red onion, minced", "¼ cup chopped parsley", "1 tsp dried oregano", "½ tsp ground cumin", "¼ tsp ground cinnamon", "¼ tsp ground cloves", "1½ tsp kosher salt", "2 Tbsp avocado oil"] },
    { g: "Roasted vegetables", i: ["2 zucchini, in half-moons", "2 yellow squash, in half-moons", "1 pint grape tomatoes", "1 red onion, in wedges", "3 Tbsp olive oil", "½ tsp garlic powder", "1 tsp dried oregano", "Salt & pepper"] },
    { g: "To finish", i: ["2 Tbsp chopped parsley", "1 lemon, in wedges"] }
  ],
  steps: [
    "Heat oven to 425°F. Toss the zucchini, squash, tomatoes and onion with the olive oil, garlic powder, oregano, salt and pepper and spread them on a large sheet pan.",
    "Mix the beef with the garlic, minced onion, parsley, oregano, cumin, cinnamon, cloves and salt. Do not overwork it.",
    "Shape into 16 short ovals, about 2 oz each, and set them on a second sheet pan brushed with the avocado oil.",
    "Roast both pans for 20 minutes, then stir the vegetables and rotate the pans.",
    "Roast another 15 to 20 minutes, until the kofta are browned and the vegetable edges have caught.",
    "Tip the kofta and their fat onto the vegetables, scatter the parsley over and squeeze a lemon wedge across the lot."
  ],
  leftovers: "Four kofta and a cup of vegetables keep three days and reheat better than almost anything else this month."
},
{
  day: 3, date: "2026-09-03", dow: "Thursday", week: 1, protein: "steak",
  title: "Overnight Garlic-Rosemary Sirloin Roast",
  blurb: "A two-pound top sirloin roast sits in garlic and rosemary overnight, then goes into a low oven and gets a hard sear at the end. Fifteen minutes of your attention across two and a half hours.",
  source: ORIGINAL,
  time: "2 hr 15 min + marinate", active: "15 min", serves: 4, cost: "~$5.10/serving",
  protein_g: { him: 78, her: 50 },
  art: { protein: "steak", veg: ["mushroom", "onion", "greens"], sauce: "brown" },
  tags: ["marinate ahead", "reverse sear", "hands-off"],
  swaps: [
    "Top sirloin roast is the value cut here. Tri-tip works identically. A whole tenderloin works too and costs three times as much.",
    "No thermometer, no reverse sear. This method is entirely about pulling the roast at 125°F, and guessing does not work.",
    "The pan sauce is deglazed with broth and finished with olive oil off the heat, not butter."
  ],
  ingredients: [
    { g: "Overnight rub", i: ["2 lb top sirloin roast, tied", "3 Tbsp olive oil", "6 garlic cloves, minced", "2 Tbsp chopped fresh rosemary", "1 Tbsp chopped fresh thyme", "2 tsp kosher salt", "1 tsp coarse black pepper"] },
    { g: "Roasting pan", i: ["12 oz cremini mushrooms, halved", "1 red onion, in thick wedges", "1 Tbsp avocado oil"] },
    { g: "Pan sauce", i: ["½ cup beef broth", "1 tsp red wine vinegar", "1 Tbsp olive oil", "Salt & pepper"] },
    { g: "To serve", i: ["4 oz arugula", "Olive oil, lemon, salt"] }
  ],
  steps: [
    "Before bed: rub the roast all over with the oil, garlic, rosemary, thyme, salt and pepper. Leave it uncovered on a rack over a plate in the fridge, which dries the surface and is half of why the sear works.",
    "Take it out an hour before cooking. Heat the oven to 275°F.",
    "Toss the mushrooms and onion with the avocado oil in a roasting pan and set the roast on a rack above them.",
    "Roast 1 hr 45 min to 2 hr, until the centre reads 125°F for medium-rare. Start checking at 90 minutes.",
    "Rest the roast on a board for 15 minutes. Meanwhile put the roasting pan on the hob, add the broth and vinegar, and scrape up everything stuck to the bottom. Simmer 3 minutes, kill the heat, swirl in the olive oil.",
    "Sear the rested roast in a screaming-hot dry skillet, 45 seconds a side, then slice against the grain. Serve over the dressed arugula with the mushrooms and sauce."
  ],
  leftovers: "Slice only what you are eating. The unsliced half keeps four days and is far better cold than reheated: sliced thin over greens is Friday's lunch."
},
{
  day: 4, date: "2026-09-04", dow: "Friday", week: 1, protein: "meatballs",
  title: "Fifteen-Minute Meatballs, Tomato & Olive",
  blurb: "The first fast night. Everything comes out of a bag or a can, the pan does the rest, and you are eating fifteen minutes after you walk in.",
  source: ORIGINAL,
  time: "20 min", active: "15 min", serves: 4, cost: "~$4.10/serving",
  protein_g: { him: 71, her: 46 },
  art: { protein: "meatball", veg: ["tomato", "olive", "zucchini"], sauce: "red" },
  tags: ["15 min", "one pan", "pantry"],
  swaps: [
    "Read the meatball bag against the four rules in the Rules section. Most of the freezer case fails on breadcrumbs alone.",
    "Crushed tomatoes with no added sugar, never jarred marinara.",
    "If you want it faster still, skip the zucchini and serve the whole pan over raw baby spinach, which wilts under it."
  ],
  ingredients: [
    { g: "Pan", i: ["2½ lb compliant pre-made meatballs (beef or chicken)", "3 Tbsp olive oil", "4 garlic cloves, sliced", "1 (28 oz) can crushed tomatoes, no sugar added", "¾ cup pitted kalamata olives", "1½ tsp dried oregano", "½ tsp red pepper flakes", "Salt & pepper"] },
    { g: "Underneath", i: ["3 zucchini, in thick half-moons", "1 Tbsp olive oil"] },
    { g: "To finish", i: ["Torn fresh basil", "Extra olive oil"] }
  ],
  steps: [
    "Get a large skillet hot with 1 Tbsp olive oil. Sear the zucchini in a single layer, 3 minutes without moving it, then tip it into a bowl.",
    "Add the remaining 2 Tbsp oil and the meatballs to the same pan. Brown them 4 minutes, shaking the pan a few times.",
    "Push them aside, add the garlic and pepper flakes, and give it 30 seconds.",
    "Pour in the crushed tomatoes and the oregano. Simmer 6 to 8 minutes, until the meatballs are hot through.",
    "Stir in the olives, season, and put the zucchini back in for the last minute.",
    "Basil and a hard glug of olive oil over the top."
  ],
  leftovers: null
},
{
  day: 5, date: "2026-09-05", dow: "Saturday", week: 1, protein: "lamb",
  title: "Harissa Lamb Meatballs, Roasted Cauliflower",
  blurb: "The batch night. Make all 36, eat a third, freeze the rest, and Sep 28 becomes a night where you only have to warm a pan.",
  source: ORIGINAL,
  time: "45 min", active: "25 min", serves: 5, cost: "~$4.30/serving",
  protein_g: { him: 75, her: 48 },
  art: { protein: "meatball", veg: ["cauliflower", "tomato", "onion"], sauce: "red" },
  tags: ["batch cook", "freezes well", "oven"],
  swaps: [
    "Harissa paste is the one to read: many brands are fine, but some carry sugar or sunflower oil. A dry harissa spice blend avoids the question entirely.",
    "Almond flour is a nut, not a grain, so it stays. Crushed pork rinds or no binder at all both work.",
    "No harissa in the house? 2 tsp paprika, 1 tsp cumin, ½ tsp caraway and ½ tsp cayenne gets you close."
  ],
  ingredients: [
    { g: "Meatballs (makes 36)", i: ["2¼ lb ground lamb (15 to 20% fat)", "2 large eggs", "½ cup almond flour", "1 small red onion, finely grated", "4 garlic cloves, minced", "3 Tbsp harissa paste (check: no sugar, no seed oil)", "¼ cup chopped parsley", "2 Tbsp chopped mint", "2 tsp ground cumin", "1 tsp ground coriander", "2 tsp kosher salt", "1 tsp black pepper"] },
    { g: "Roasted cauliflower", i: ["1 large head cauliflower, in florets", "3 Tbsp olive oil", "1 tsp ground cumin", "½ tsp paprika", "Salt & pepper"] },
    { g: "To serve", i: ["1 pint cherry tomatoes, halved", "½ red onion, thinly sliced", "1 lemon", "Olive oil, red wine vinegar", "Chopped mint & parsley"] }
  ],
  steps: [
    "Heat oven to 400°F and line two sheet pans with parchment.",
    "Toss the cauliflower with the olive oil, cumin, paprika, salt and pepper and spread it on one pan. Give it a 10-minute head start in the oven.",
    "Mix every meatball ingredient by hand until just combined. Roll 36 balls of about 1½ Tbsp each onto the second pan.",
    "Both pans in. Bake 22 to 25 minutes, until the meatballs are firm and the cauliflower edges are dark.",
    "Dress the tomatoes and sliced onion with olive oil, vinegar, salt and the herbs.",
    "Serve 14 meatballs tonight over the cauliflower with the tomato salad alongside, and squeeze the lemon over everything."
  ],
  leftovers: "Cool the other 22 meatballs completely, then freeze them flat in a bag. Fourteen come back on Sep 28; the last eight are a lunch whenever you want one."
},

/* ========== WEEK 2: ONE SHEET PAN ========== */
{
  day: 6, date: "2026-09-06", dow: "Sunday", week: 2, protein: "chicken",
  title: "Super Easy Roast Chicken",
  blurb: "4.98 stars from 181 votes, and the ingredient list is oil, Italian seasoning, salt and pepper. Five minutes of work buys you tonight plus two lunches plus a carcass worth of broth.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/easy-roast-chicken/", 4.98, 181),
  time: "1 hr 35 min", active: "10 min", serves: 6, cost: "~$2.80/serving",
  protein_g: { him: 77, her: 50 },
  art: { protein: "chicken-thigh", veg: ["lemon", "onion", "greenbean", "mushroom"] },
  tags: ["hands-off", "big leftovers", "oven"],
  swaps: [
    "Compliant exactly as written. Three ingredients, none of them a problem.",
    "Buy the 5 lb bird, not the 4 lb. The difference in price is small and the difference in leftovers is a whole meal.",
    "Salt it in the morning and leave it uncovered in the fridge all day. It is not in the recipe and it is the single biggest improvement to the skin."
  ],
  ingredients: [
    { g: "Chicken", i: ["1 whole chicken, 5 lb, giblets removed", "1 Tbsp extra-virgin olive oil", "1 tsp Italian seasoning", "Kosher salt & freshly ground black pepper"] },
    { g: "Under the bird", i: ["2 yellow onions, in thick rounds", "1 lemon, halved", "8 oz cremini mushrooms", "1 lb green beans, added late", "2 Tbsp olive oil"] }
  ],
  steps: [
    "Morning, optional but do it: pat the bird dry, salt it generously all over, leave it uncovered on a plate in the fridge.",
    "Heat the oven to 425°F with a rack in the lower third. Take the chicken out 45 minutes ahead so it is not fridge-cold.",
    "Lay the onion rounds in a roasting pan as a rack, scatter the mushrooms around them, tuck the lemon halves in the cavity.",
    "Rub the bird with the olive oil, Italian seasoning, salt and pepper. Set it breast-up on the onions.",
    "Roast 70 to 90 minutes. At the 50-minute mark, toss the green beans in the olive oil and add them around the edges.",
    "Pull it at 165°F in the thickest part of the thigh. Rest 15 minutes before carving, which is not optional."
  ],
  leftovers: "Strip every scrap off the carcass tonight and bag it: roughly 1 lb of meat, which is two lunches. Simmer the carcass with an onion for two hours and you have the broth Sep 13 and Sep 29 both ask for."
},
{
  day: 7, date: "2026-09-07", dow: "Monday", week: 2, protein: "beef",
  title: "Sheet Pan Doner Kebab",
  blurb: "A pound of ground beef pressed into a loaf, baked, sliced thin and blasted under the broiler so the edges crisp like the real thing. Doubled here, and the pita and tzatziki are simply gone.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/sheet-pan-doner-kebab/", 5.0, 3),
  time: "40 min", active: "15 min", serves: 4, cost: "~$3.40/serving",
  protein_g: { him: 74, her: 48 },
  art: { protein: "kofta", veg: ["cucumber", "tomato", "onion", "greens"] },
  tags: ["oven", "broiler", "meal prep"],
  swaps: [
    "4 pita breads → a bed of shredded romaine and cucumber. The point of this dish is the crisped edges, and they do not need bread.",
    "Tzatziki (1 cup Greek yogurt) → a tahini-lemon drizzle: 3 Tbsp tahini, juice of 1 lemon, 1 grated garlic clove, water to loosen, salt. Sesame seeds are on the list; sesame oil is the one flagged in the Rules.",
    "1 Tbsp cooking oil → olive oil. Doubled from the published pound of beef."
  ],
  ingredients: [
    { g: "Kebab loaf", i: ["2 lb ground beef (85/15)", "1 onion, grated and squeezed dry", "4 garlic cloves, minced", "4 tsp dried oregano", "2 tsp ground cumin", "2 tsp paprika", "2 tsp kosher salt", "1 tsp black pepper", "½ tsp dried thyme", "½ tsp garlic powder", "½ tsp onion powder"] },
    { g: "Tahini drizzle", i: ["3 Tbsp tahini", "1 lemon, juiced", "1 garlic clove, grated", "2 to 4 Tbsp water", "½ tsp salt"] },
    { g: "The bed", i: ["1 head romaine, shredded", "1 English cucumber, diced", "2 roma tomatoes, diced", "½ red onion, thinly sliced", "Olive oil, red wine vinegar, salt"] }
  ],
  steps: [
    "Heat oven to 400°F. Mix the beef with every seasoning and the grated onion until it turns slightly sticky, which is what holds the loaf together.",
    "Press it into a tight rectangular loaf, about 1½ inches thick, on a foil-lined sheet pan.",
    "Bake 18 to 22 minutes, until it reads 160°F. Pour off the fat and let it sit 10 minutes.",
    "Slice the loaf as thin as you can manage and spread the slices back across the hot pan.",
    "Broil 3 to 5 minutes, watching it, until the edges are dark and crisp.",
    "Whisk the tahini drizzle, dress the salad bed, pile the beef on and spoon the tahini over."
  ],
  leftovers: "The sliced beef re-crisps in a dry pan in two minutes. Half of it is lunch tomorrow."
},
{
  day: 8, date: "2026-09-08", dow: "Tuesday", week: 2, protein: "chicken",
  title: "Italian Sheet Pan Chicken Breast",
  blurb: "4.96 stars from 42 ratings. Chicken cut into bite-size pieces roasts in the same twenty minutes as the broccoli, zucchini and peppers around it, so there is genuinely one pan.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/italian-sheet-pan-chicken-breast/", 4.96, 42),
  time: "40 min", active: "20 min", serves: 4, cost: "~$3.30/serving",
  protein_g: { him: 73, her: 47 },
  art: { protein: "chicken-breast", veg: ["broccoli", "zucchini", "pepper", "onion"] },
  tags: ["sheet pan", "40 min", "one pan"],
  swaps: [
    "Grated Parmigiano Reggiano garnish → skip it, or a tablespoon of toasted pine nuts for the same salty crunch.",
    "Doubled from the published pound of chicken to 2 lb, with the marinade scaled to match.",
    "Marinate it in the morning rather than at 6pm and this becomes a ten-minute night."
  ],
  ingredients: [
    { g: "Marinade", i: ["3 Tbsp Italian seasoning", "½ cup extra-virgin olive oil", "6 garlic cloves, minced", "2 tsp paprika", "1 tsp kosher salt", "½ tsp ground black pepper"] },
    { g: "Pan", i: ["2 lb boneless skinless chicken breast, in bite-size pieces", "4 cups broccoli florets (about 2 heads)", "1 large zucchini, in half-moons", "2 red bell peppers, in 1-inch pieces", "1 small yellow onion, in 1-inch pieces"] },
    { g: "To finish", i: ["Chopped parsley", "1 lemon, in wedges", "2 Tbsp toasted pine nuts (optional)"] }
  ],
  steps: [
    "Whisk the marinade in a large bowl. Pour off a third of it and set that aside for the vegetables.",
    "Toss the chicken pieces in the rest and let them sit at least 20 minutes, or all day in the fridge.",
    "Heat oven to 400°F. Toss the broccoli, zucchini, peppers and onion with the reserved marinade.",
    "Spread the vegetables across a large sheet pan, then nestle the chicken pieces among them in a single layer. Use two pans if it is crowded, because crowding steams it.",
    "Roast 20 to 25 minutes, stirring once, until the chicken reads 165°F and the broccoli tips have charred.",
    "Parsley, a squeeze of lemon and the pine nuts if you are using them."
  ],
  leftovers: "This is the best cold lunch of the week. It does not need reheating at all."
},
{
  day: 9, date: "2026-09-09", dow: "Wednesday", week: 2, protein: "steak",
  title: "Fast Skillet Steak, Mushroom Pan Sauce",
  blurb: "Twenty minutes from cold pan to plate. Two pounds of sirloin, hard-seared in two batches, and a pan sauce built from the fond in the ninety seconds while it rests.",
  source: ORIGINAL,
  time: "20 min", active: "20 min", serves: 4, cost: "~$5.00/serving",
  protein_g: { him: 76, her: 49 },
  art: { protein: "steak-strips", veg: ["mushroom", "asparagus", "greens"], sauce: "brown" },
  tags: ["20 min", "skillet", "pan sauce"],
  swaps: [
    "Butter in the pan sauce → olive oil swirled in off the heat. It will not emulsify quite as thickly, and it tastes right.",
    "Two batches, always. Two pounds of steak in one skillet drops the pan temperature and you get grey meat.",
    "Salt the steak in the morning if you remember. Fifteen minutes before is the minimum that helps."
  ],
  ingredients: [
    { g: "Steak", i: ["2 lb sirloin steak, 1 inch thick", "1½ tsp kosher salt", "1 tsp coarse black pepper", "2 Tbsp avocado oil"] },
    { g: "Pan sauce", i: ["12 oz cremini mushrooms, sliced", "3 shallots, sliced", "3 garlic cloves, minced", "1 cup beef broth", "1 tsp red wine vinegar", "1 tsp Dijon mustard", "2 Tbsp olive oil", "1 Tbsp chopped thyme"] },
    { g: "Alongside", i: ["1 lb asparagus, trimmed", "1 Tbsp avocado oil", "4 oz arugula", "Lemon, olive oil, salt"] }
  ],
  steps: [
    "Pat the steak bone dry and season it hard. Get a heavy skillet very hot with 1 Tbsp of the avocado oil.",
    "Sear half the steak, 3 minutes a side for medium-rare. Move it to a board. Repeat with the rest.",
    "Same pan, remaining oil, asparagus. Three minutes, tossing, then out onto the plates.",
    "Mushrooms into the pan in one layer. Leave them alone for 3 minutes, then add the shallots and garlic for 2 more.",
    "Broth, vinegar and Dijon in. Scrape the bottom clean and boil hard for 3 minutes until it coats a spoon. Off the heat, swirl in the olive oil and thyme.",
    "Slice the rested steak against the grain, lay it on the arugula, pour the mushrooms and sauce over the top."
  ],
  leftovers: null
},
{
  day: 10, date: "2026-09-10", dow: "Thursday", week: 2, protein: "meatballs",
  title: "Sheet Pan Meatballs & Broccoli",
  blurb: "Bag of meatballs, two heads of broccoli, one pan, twenty-five minutes in the oven and none of your attention while it happens.",
  source: ORIGINAL,
  time: "35 min", active: "10 min", serves: 4, cost: "~$4.00/serving",
  protein_g: { him: 72, her: 46 },
  art: { protein: "meatball", veg: ["broccoli", "tomato", "onion"] },
  tags: ["sheet pan", "10 min hands-on", "oven"],
  swaps: [
    "Check the meatball bag against the four rules. This is the ingredient that needs real label-reading.",
    "Frozen meatballs go in straight from the freezer; add 8 minutes and start the broccoli separately.",
    "No broccoli? Cauliflower, green beans or halved brussels sprouts all take the same time at this temperature."
  ],
  ingredients: [
    { g: "Pan", i: ["2½ lb compliant pre-made meatballs", "2 large heads broccoli, in florets", "1 red onion, in wedges", "1 pint cherry tomatoes", "4 Tbsp olive oil", "4 garlic cloves, sliced", "1 tsp dried oregano", "½ tsp red pepper flakes", "Salt & pepper"] },
    { g: "To finish", i: ["1 lemon", "2 Tbsp chopped parsley", "Extra olive oil"] }
  ],
  steps: [
    "Heat oven to 425°F.",
    "Toss the broccoli, onion and tomatoes with 3 Tbsp of the olive oil, the garlic, oregano, pepper flakes, salt and pepper.",
    "Spread it across a large sheet pan and tuck the meatballs in among the vegetables. Use two pans rather than crowding one.",
    "Toss the meatballs with the last tablespoon of oil so they brown rather than steam.",
    "Roast 22 to 28 minutes, shaking the pan once, until the meatballs are hot through and the broccoli tips are properly charred.",
    "Squeeze the lemon over the whole pan, scatter the parsley, finish with olive oil."
  ],
  leftovers: null
},
{
  day: 11, date: "2026-09-11", dow: "Friday", week: 2, protein: "chicken",
  title: "Sheet Pan Chicken Fajitas",
  blurb: "4.79 stars from 413 ratings, the most-reviewed recipe in either month. The tortillas and the teaspoon of sugar in the seasoning are the only two things standing between it and compliance.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/oven-fajitas/", 4.79, 413),
  time: "55 min", active: "15 min", serves: 4, cost: "~$3.10/serving",
  protein_g: { him: 75, her: 48 },
  art: { protein: "chicken-breast", veg: ["pepper", "onion", "avocado", "lime"] },
  tags: ["sheet pan", "oven", "hands-off"],
  swaps: [
    "1 tsp sugar in the fajita seasoning → out. It is there for browning, and forty minutes at 400°F browns it anyway.",
    "8 tortillas → butter lettuce leaves, or just a bowl. ½ cup sour cream → sliced avocado.",
    "2 Tbsp cooking oil → avocado oil. Doubled from the published pound of chicken."
  ],
  ingredients: [
    { g: "Fajita seasoning", i: ["2 Tbsp chili powder", "1 Tbsp paprika", "1 tsp onion powder", "½ tsp garlic powder", "½ tsp ground cumin", "¼ tsp cayenne", "1 tsp kosher salt"] },
    { g: "Pan", i: ["2 lb chicken breast, in strips", "4 bell peppers, sliced", "2 small yellow onions, sliced", "3 Tbsp avocado oil"] },
    { g: "To serve", i: ["2 limes", "2 avocados, sliced", "1 head butter lettuce", "½ bunch cilantro", "Hot sauce, no sugar added"] }
  ],
  steps: [
    "Heat oven to 400°F. Mix the seasoning in a small bowl.",
    "Toss the chicken, peppers and onions with the avocado oil and all of the seasoning on a large sheet pan. Two pans if it looks crowded.",
    "Roast 35 to 40 minutes, stirring once halfway, until the peppers have softened and the edges are browned.",
    "Squeeze a whole lime over the hot pan the moment it comes out.",
    "Pile it into butter lettuce leaves or straight into bowls.",
    "Avocado, cilantro, the second lime in wedges, hot sauce."
  ],
  leftovers: "Roughly a third of the pan is left. It becomes a fajita salad over greens tomorrow, cold, with lime."
},
{
  day: 12, date: "2026-09-12", dow: "Saturday", week: 2, protein: "lamb",
  title: "Lamb Kofta with Roasted Peppers",
  blurb: "Ground lamb shaped around nothing at all, roasted hot on a bed of peppers and onions until the fat renders down into them.",
  source: ORIGINAL,
  time: "45 min", active: "20 min", serves: 4, cost: "~$4.60/serving",
  protein_g: { him: 74, her: 48 },
  art: { protein: "kofta", veg: ["pepper", "onion", "tomato", "cucumber"], sauce: "green" },
  tags: ["oven", "sheet pan", "make the sauce ahead"],
  swaps: [
    "Shape these on skewers if you have them, or just as fat ovals. Both cook the same.",
    "The herb sauce doubles happily and keeps a week in the fridge, which is exactly what Sep 18 wants.",
    "No mint? All parsley works. Do not use dried mint here."
  ],
  ingredients: [
    { g: "Kofta", i: ["2¼ lb ground lamb", "1 small onion, grated and squeezed dry", "5 garlic cloves, minced", "⅓ cup chopped parsley", "2 Tbsp chopped mint", "2 tsp ground cumin", "2 tsp ground coriander", "1 tsp paprika", "½ tsp cayenne", "2 tsp kosher salt", "1 tsp black pepper"] },
    { g: "Underneath", i: ["4 bell peppers, in thick strips", "2 red onions, in wedges", "3 Tbsp olive oil", "Salt & pepper"] },
    { g: "Herb sauce", i: ["1 cup parsley, finely chopped", "½ cup mint, finely chopped", "3 garlic cloves, minced", "2 Tbsp red wine vinegar", "½ tsp red pepper flakes", "¾ cup extra-virgin olive oil", "1 tsp kosher salt"] },
    { g: "Alongside", i: ["1 English cucumber, diced", "2 tomatoes, diced", "Olive oil, lemon, salt"] }
  ],
  steps: [
    "Heat oven to 425°F. Toss the peppers and onions with the olive oil, salt and pepper on a large sheet pan and start them roasting.",
    "Mix the lamb with every kofta ingredient until it turns tacky, then shape 16 fat ovals.",
    "After the vegetables have had 10 minutes, lay the kofta on top of them and return the pan to the oven.",
    "Roast 20 to 25 minutes, until the kofta are browned and read 160°F.",
    "Make the herb sauce while that happens: chop everything, stir in the vinegar and salt, then the olive oil last. Make a double batch.",
    "Dress the cucumber and tomato. Serve the kofta on the peppers with the herb sauce spooned generously over."
  ],
  leftovers: "Keep half the herb sauce back in a jar. It lands on Sep 18's steak and needs no further work."
},

/* ========== WEEK 3: LOW AND SLOW ========== */
{
  day: 13, date: "2026-09-13", dow: "Sunday", week: 3, protein: "beef",
  title: "Oven-Braised Pot Roast",
  blurb: "5 stars from 83 ratings as a slow cooker recipe, converted here to a covered Dutch oven at 300°F. Four pounds of chuck, which is Sunday dinner and most of Wednesday.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/slow-cooker-pot-roast/", 5.0, 83),
  time: "4 hr", active: "20 min", serves: 8, cost: "~$3.90/serving",
  protein_g: { him: 78, her: 50 },
  art: { protein: "steak", veg: ["mushroom", "onion", "greenbean"], sauce: "brown" },
  tags: ["hands-off", "batch cook", "oven braise"],
  swaps: [
    "1½ lb baby potatoes → 1½ lb cremini mushrooms and 1 lb green beans added in the last 30 minutes. The mushrooms give you the same weight in the bowl without the starch.",
    "2 Tbsp cornstarch or arrowroot to thicken → reduce the strained liquid hard on the hob for 10 minutes instead. It gets glossy on its own.",
    "Slow cooker if you prefer: 8 hours on low, exactly as published. The oven version below just fits a Sunday better.",
    "Carrots and celery stay, in the small supporting amounts the Rules section allows."
  ],
  ingredients: [
    { g: "Braise", i: ["4 lb beef chuck roast", "2 Tbsp avocado oil", "2½ tsp kosher salt", "1 tsp freshly ground black pepper", "6 garlic cloves, thinly sliced", "1 yellow onion, in large chunks", "4 carrots, in 1-inch pieces", "3 celery stalks, in 1-inch pieces", "2 cups beef broth", "1 cup dry red wine", "2 sprigs rosemary", "2 sprigs thyme", "2 bay leaves"] },
    { g: "Added late", i: ["1½ lb cremini mushrooms, halved", "1 lb green beans, trimmed"] },
    { g: "To finish", i: ["Chopped parsley", "Flaky salt"] }
  ],
  steps: [
    "Heat oven to 300°F. Pat the chuck dry and season it hard with the salt and pepper.",
    "Sear it in the avocado oil in a Dutch oven over high heat, 4 minutes a side, until every surface is properly brown. Lift it out.",
    "Onion, carrot and celery into the same pot for 5 minutes, then the garlic for 1 minute.",
    "Broth, wine, rosemary, thyme and bay leaves in. Return the beef, bring it to a simmer, lid on, into the oven.",
    "Braise 3 hours. Add the mushrooms and green beans, lid back on, and give it 30 to 40 minutes more, until the beef pulls apart with a fork.",
    "Lift the beef onto a board. Skim the fat, fish out the herb stems, and reduce the liquid on the hob for 10 minutes. Shred the beef back into it."
  ],
  leftovers: "Half of this is Wednesday. It reheats better on day two than it eats on day one, which is rare and worth knowing."
},
{
  day: 14, date: "2026-09-14", dow: "Monday", week: 3, protein: "chicken",
  title: "Greek Chicken, Overnight Marinade",
  blurb: "4.56 stars from 273 ratings. Four pounds of chicken pieces sit in the marinade overnight and then bake for an hour with no further input from you.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/greek-marinated-chicken/", 4.56, 273),
  time: "1 hr 15 min + marinate", active: "15 min", serves: 5, cost: "~$2.60/serving",
  protein_g: { him: 76, her: 49 },
  art: { protein: "chicken-thigh", veg: ["lemon", "cucumber", "tomato", "olive"] },
  tags: ["marinate overnight", "oven", "hands-off"],
  swaps: [
    "1 cup plain yogurt → ½ cup olive oil plus 2 Tbsp extra lemon juice. You lose the lactic tenderising and keep everything else; the long marinade covers the difference.",
    "Buy bone-in thighs and drumsticks rather than a cut-up whole bird. Cheaper, and they all finish at the same time.",
    "This is the marinade to make a double batch of. The second half freezes with raw chicken in it, ready to thaw straight into a marinated state."
  ],
  ingredients: [
    { g: "Marinade", i: ["½ cup extra-virgin olive oil", "1 medium lemon, juiced, plus 2 Tbsp more", "4 garlic cloves, minced", "½ Tbsp dried oregano", "¼ bunch parsley, chopped", "½ tsp kosher salt", "¼ tsp black pepper"] },
    { g: "Chicken", i: ["4 lb bone-in chicken pieces (thighs and drumsticks)"] },
    { g: "Big Greek salad", i: ["2 English cucumbers, in half-moons", "3 tomatoes, wedged", "½ red onion, thinly sliced", "¾ cup pitted kalamata olives", "Olive oil, red wine vinegar, dried oregano, salt"] }
  ],
  steps: [
    "Before bed: whisk the marinade, put it in a bag with the chicken, squeeze the air out and refrigerate. Anywhere from 4 to 24 hours works.",
    "Take the chicken out 45 minutes before it goes in the oven.",
    "Heat oven to 375°F. Lay the pieces skin-side up in a single layer in a large baking dish and pour the marinade over.",
    "Bake uncovered 45 to 60 minutes, until golden and the thighs read 175°F.",
    "If the skin needs help, three minutes under the broiler finishes it.",
    "Toss the salad while the chicken rests, and spoon the pan juices over both."
  ],
  leftovers: "A pound of picked chicken meat goes into the fridge tonight. Thursday's ragu is built on the assumption that you have not eaten it."
},
{
  day: 15, date: "2026-09-15", dow: "Tuesday", week: 3, protein: "meatballs",
  title: "Twenty-Minute Meatball & Cabbage Skillet",
  blurb: "Half a cabbage hard-seared until the edges go sweet and brown, meatballs folded through, done before the oven would have finished preheating.",
  source: ORIGINAL,
  time: "20 min", active: "20 min", serves: 4, cost: "~$3.90/serving",
  protein_g: { him: 72, her: 46 },
  art: { protein: "meatball", veg: ["cabbage", "onion", "greenbean"] },
  tags: ["20 min", "skillet", "one pan"],
  swaps: [
    "Coconut aminos carries about 1g of coconut sugar per teaspoon, which the Rules section flags. Leave it out and lean on the fish sauce and vinegar instead.",
    "Get the pan properly hot before the cabbage goes in. Cabbage steamed in a lukewarm pan is a completely different and much worse dish.",
    "Any compliant meatball works. Chicken ones are lighter here and let the cabbage lead."
  ],
  ingredients: [
    { g: "Skillet", i: ["2½ lb compliant pre-made meatballs", "3 Tbsp avocado oil", "½ large head green cabbage, shredded", "1 yellow onion, sliced", "4 garlic cloves, sliced", "1 Tbsp grated fresh ginger"] },
    { g: "Sauce", i: ["3 Tbsp coconut aminos", "1 Tbsp rice vinegar, unseasoned", "2 tsp fish sauce, no sugar added", "1 tsp chili garlic sauce, no sugar added"] },
    { g: "To finish", i: ["4 green onions, sliced", "2 Tbsp sesame seeds, toasted", "1 lime"] }
  ],
  steps: [
    "Get a large skillet or wok very hot with 1 Tbsp of the oil. Brown the meatballs 4 minutes, then tip them into a bowl.",
    "Remaining oil in. Cabbage and onion, spread flat, and left alone for 3 minutes so it catches.",
    "Toss once and give it 2 more minutes. It should still have a bite.",
    "Garlic and ginger for 30 seconds, then the sauce ingredients, which will hiss and reduce almost immediately.",
    "Meatballs back in and tossed through for 2 minutes to warm.",
    "Green onions, sesame seeds and a hard squeeze of lime."
  ],
  leftovers: null
},
{
  day: 16, date: "2026-09-16", dow: "Wednesday", week: 3, protein: "chicken",
  title: "Baked Chicken Shawarma",
  blurb: "4.84 stars from 59 reviews, rewritten for the oven and without the yogurt. Marinate before bed, roast at 425°F, and the edges crisp the way the vertical spit does it.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/chicken-shawarma/", 4.84, 59),
  time: "35 min + marinate", active: "15 min", serves: 4, cost: "~$3.20/serving",
  protein_g: { him: 75, her: 48 },
  art: { protein: "chicken-breast", veg: ["cucumber", "tomato", "onion", "greens"] },
  tags: ["marinate overnight", "oven", "meal prep"],
  swaps: [
    "½ cup Greek yogurt in the marinade → ⅓ cup olive oil plus 1 Tbsp extra lemon juice. Overnight instead of four hours makes up for the lost tenderising.",
    "Yogurt sauce → tahini sauce: 3 Tbsp tahini, 1 lemon, 1 grated garlic clove, water, salt.",
    "4 naan → skip. Serve it over the salad, which is what the recipe's own bowl version does.",
    "Grill or skillet as published if you would rather. The oven version below just needs less watching."
  ],
  ingredients: [
    { g: "Marinade", i: ["⅓ cup extra-virgin olive oil", "2 Tbsp lemon juice", "2 Tbsp minced garlic (6 cloves)", "1 tsp ground cinnamon", "1 tsp dried oregano", "1 tsp ground cumin", "½ tsp ground nutmeg", "½ tsp ground cloves", "1½ tsp kosher salt"] },
    { g: "Chicken", i: ["2 lb boneless skinless chicken thighs, in 1-inch strips", "1 red onion, sliced"] },
    { g: "Tahini sauce", i: ["3 Tbsp tahini", "1 lemon, juiced", "1 garlic clove, grated", "2 to 4 Tbsp water", "½ tsp salt"] },
    { g: "The bowl", i: ["1 head romaine, shredded", "1 English cucumber, diced", "2 roma tomatoes, diced", "¼ red onion, sliced", "½ bunch parsley", "Olive oil, lemon, salt"] }
  ],
  steps: [
    "Before bed: whisk the marinade, add the chicken strips and sliced onion, and refrigerate in a bag overnight.",
    "Heat oven to 425°F and take the chicken out while it comes up to temperature.",
    "Spread the chicken and onion in a single layer on a large sheet pan, spaced apart. Two pans rather than one crowded one.",
    "Roast 20 minutes, then stir and roast 5 to 8 minutes more.",
    "Broil 2 to 3 minutes at the end so the edges char, which is the whole point of shawarma.",
    "Whisk the tahini sauce, build the bowls, drizzle it over."
  ],
  leftovers: "Cook the full 2 lb even if you eat less. Cold shawarma over greens is the best lunch in the month."
},
{
  day: 17, date: "2026-09-17", dow: "Thursday", week: 3, protein: "beef",
  title: "Slow-Roasted Beef Ragu over Zucchini",
  blurb: "Two pounds of beef and a can of tomatoes go into a low oven and are ignored for two hours. Ten minutes of work at the start and five at the end.",
  source: ORIGINAL,
  time: "2 hr 20 min", active: "15 min", serves: 5, cost: "~$3.50/serving",
  protein_g: { him: 73, her: 47 },
  art: { protein: "beef-crumble", veg: ["zucchini", "tomato", "onion", "mushroom"], sauce: "red" },
  tags: ["hands-off", "oven", "freezes well"],
  swaps: [
    "No pasta and no polenta. Zucchini cut thick and roasted separately holds up under this; spiralised zucchini turns to water and will not.",
    "Crushed tomatoes with no added sugar. A ragu this long does not need any help with sweetness.",
    "A splash of red wine at the start is optional and does make it better."
  ],
  ingredients: [
    { g: "Ragu", i: ["2 lb ground beef (85/15)", "2 Tbsp olive oil", "1 yellow onion, diced", "8 oz cremini mushrooms, finely chopped", "6 garlic cloves, minced", "2 Tbsp tomato paste, no sugar added", "1 (28 oz) can crushed tomatoes, no sugar added", "½ cup dry red wine (optional)", "1 Tbsp dried oregano", "1 tsp fennel seed, crushed", "½ tsp red pepper flakes", "2 bay leaves", "2 tsp kosher salt"] },
    { g: "Underneath", i: ["4 large zucchini, in thick planks", "2 Tbsp olive oil", "Salt & pepper"] },
    { g: "To finish", i: ["Torn basil", "2 Tbsp almond flour, toasted", "Extra olive oil"] }
  ],
  steps: [
    "Heat oven to 300°F. Brown the beef hard in the olive oil in a Dutch oven, in two batches, and do not rush this part.",
    "Onion and mushrooms in for 6 minutes, then the garlic and tomato paste for 2 minutes until the paste darkens.",
    "Wine if you are using it, then the tomatoes, oregano, fennel, pepper flakes, bay and salt. Bring to a simmer.",
    "Lid slightly ajar, into the oven for 2 hours. Stir it once if you happen to walk past.",
    "In the last 25 minutes, toss the zucchini planks with oil, salt and pepper and roast them on a sheet pan at 425°F on the rack above.",
    "Spoon the ragu over the zucchini. Toasted almond flour, basil, olive oil."
  ],
  leftovers: "Makes about a third more than tonight needs. Freeze that third flat and it is a twenty-minute dinner in October."
},
{
  day: 18, date: "2026-09-18", dow: "Friday", week: 3, protein: "steak",
  title: "Fast Seared Flank, Herb Sauce",
  blurb: "Flank steak, a very hot pan, six minutes, and the herb sauce you already made a week ago on Sep 12. Nothing about this night takes thinking.",
  source: ORIGINAL,
  time: "20 min", active: "20 min", serves: 4, cost: "~$4.80/serving",
  protein_g: { him: 76, her: 49 },
  art: { protein: "steak-strips", veg: ["greens", "tomato", "radish", "avocado"], sauce: "green" },
  tags: ["20 min", "skillet", "sauce is already made"],
  swaps: [
    "Skirt steak works and cooks faster still. Sirloin works and needs a minute longer.",
    "If the herb sauce from Sep 12 is gone, this is 10 minutes: parsley, garlic, red wine vinegar, olive oil, salt.",
    "Slicing against the grain is the entire difference between flank steak and shoe leather. Find the lines and cut across them."
  ],
  ingredients: [
    { g: "Steak", i: ["2 lb flank steak", "1½ tsp kosher salt", "1 tsp coarse black pepper", "2 Tbsp avocado oil"] },
    { g: "Herb sauce", i: ["The jar from Sep 12", "or: 1 cup parsley, 3 garlic cloves, 2 Tbsp red wine vinegar, ¾ cup olive oil, ½ tsp red pepper flakes, salt"] },
    { g: "The plate", i: ["6 oz mixed greens", "1 pint cherry tomatoes, halved", "1 bunch radishes, thinly sliced", "1 avocado", "Olive oil, lemon, salt"] }
  ],
  steps: [
    "Take the steak out of the fridge 30 minutes ahead, pat it dry and season both sides hard.",
    "Get a heavy skillet as hot as it goes with the avocado oil, just short of smoking.",
    "Sear the steak 3 to 4 minutes a side for medium-rare, in two pieces if it does not fit flat.",
    "Rest it on a board for a full 8 minutes. This is not the step to skip on a thin cut.",
    "Dress the greens, tomatoes and radishes while it rests.",
    "Slice thin against the grain, fan it over the salad, spoon the herb sauce across and add the avocado."
  ],
  leftovers: null
},
{
  day: 19, date: "2026-09-19", dow: "Saturday", week: 3, protein: "chicken",
  title: "Roast Chicken & Brussels Sprouts",
  blurb: "5 stars from 78 ratings. The balsamic and maple both come out and red wine vinegar goes in, which is exactly the swap the Rules section already calls for everywhere else.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/roasted-balsamic-chicken/", 5.0, 78),
  time: "40 min + marinate", active: "15 min", serves: 4, cost: "~$3.30/serving",
  protein_g: { him: 76, her: 49 },
  art: { protein: "chicken-thigh", veg: ["broccoli", "onion", "mushroom"] },
  tags: ["marinate ahead", "oven", "one pan"],
  swaps: [
    "½ cup balsamic vinegar → ⅓ cup red wine vinegar. Balsamic carries residual grape sugar, which is why it is out everywhere in this plan.",
    "2 Tbsp maple syrup → out entirely. Without it the marinade will not glaze, so the browning comes from the 425°F oven and the chicken fat instead.",
    "Eight thighs rather than the published six, because six does not get you to 75g each with leftovers."
  ],
  ingredients: [
    { g: "Marinade", i: ["⅓ cup red wine vinegar", "5 Tbsp extra-virgin olive oil", "4 garlic cloves, minced", "1 tsp Dijon mustard (check: no sugar)", "1 tsp dried thyme", "1 tsp kosher salt", "½ tsp freshly ground black pepper"] },
    { g: "Pan", i: ["8 bone-in, skin-on chicken thighs (~3 lb)", "1½ lb brussels sprouts, halved", "1 red onion, in wedges", "8 oz cremini mushrooms, halved", "2 Tbsp olive oil"] }
  ],
  steps: [
    "Whisk the marinade. Pour two-thirds over the chicken in a bag and refrigerate 1 to 2 hours, or all day.",
    "Heat oven to 425°F. Toss the sprouts, onion and mushrooms with the remaining marinade and the olive oil.",
    "Spread the vegetables cut-side down on a large sheet pan and set the thighs skin-side up among them.",
    "Roast 30 minutes, then brush the thighs with the pan juices.",
    "Roast another 10 to 15 minutes, until the skin is deep brown and the thighs read 175°F.",
    "Rest 5 minutes and serve everything straight from the pan."
  ],
  leftovers: "Two thighs held back tonight cover Sunday lunch, which matters because Sunday is a cooking day."
},

/* ========== WEEK 4: THE SPICE DRAWER ========== */
{
  day: 20, date: "2026-09-20", dow: "Sunday", week: 4, protein: "chicken",
  title: "Cilantro Lime Chicken Drumsticks",
  blurb: "4.75 stars from 44 ratings and compliant exactly as published. Twelve drumsticks, which is the cheapest 200g of protein in either month.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/cilantro-lime-chicken-drumsticks/", 4.75, 44),
  time: "1 hr + marinate", active: "15 min", serves: 5, cost: "~$2.10/serving",
  protein_g: { him: 74, her: 48 },
  art: { protein: "chicken-thigh", veg: ["lime", "pepper", "avocado", "greens"] },
  tags: ["marinate overnight", "oven", "cheapest night"],
  swaps: [
    "Nothing. Olive oil, garlic, cumin, salt, pepper, lime, cilantro. It was already compliant.",
    "Doubled from the published six drumsticks to twelve, with the marinade doubled to match.",
    "Broil for the last 3 minutes. The recipe calls it optional and it is not."
  ],
  ingredients: [
    { g: "Marinade", i: ["4 Tbsp olive oil", "8 garlic cloves, minced", "1 tsp ground cumin", "1 tsp kosher salt", "Freshly cracked black pepper", "4 limes, juiced", "1 bunch cilantro, chopped"] },
    { g: "Chicken", i: ["12 chicken drumsticks (~3½ lb)"] },
    { g: "Alongside", i: ["3 bell peppers, in strips", "1 red onion, sliced", "2 Tbsp avocado oil", "2 avocados", "6 oz mixed greens", "2 limes, in wedges"] }
  ],
  steps: [
    "Before bed: whisk the marinade, put it in a bag with the drumsticks, and refrigerate overnight.",
    "Heat oven to 400°F. Line a sheet pan with foil and set a rack in it if you have one.",
    "Lay the drumsticks out with space between them and pour any marinade left in the bag over the top.",
    "Toss the peppers and onion with the avocado oil on a second pan and put both in the oven.",
    "Bake 40 to 45 minutes, until the drumsticks read 175°F at the bone.",
    "Broil 3 to 4 minutes for colour. Serve with the peppers, avocado, greens and a lime wedge each."
  ],
  leftovers: "Four drumsticks left is a lunch, and cold drumsticks are considerably better than cold chicken breast."
},
{
  day: 21, date: "2026-09-21", dow: "Monday", week: 4, protein: "lamb",
  title: "Cumin Lamb & Green Bean Skillet",
  blurb: "Ground lamb browned hard with whole cumin seed, green beans thrown in at the end so they keep their snap. Twenty minutes, one pan.",
  source: ORIGINAL,
  time: "20 min", active: "20 min", serves: 4, cost: "~$4.40/serving",
  protein_g: { him: 72, her: 46 },
  art: { protein: "lamb-crumble", veg: ["greenbean", "onion", "pepper"] },
  tags: ["20 min", "skillet", "one pan"],
  swaps: [
    "Whole cumin seed, not ground, and toast it in the dry pan first. Ground cumin here tastes flat and dusty.",
    "Lamb fat is the cooking fat. Do not drain it, and do not add oil until you see how much renders.",
    "Green beans can be swapped for asparagus or broccolini at the same timing."
  ],
  ingredients: [
    { g: "Skillet", i: ["2¼ lb ground lamb", "1 Tbsp whole cumin seed", "1 tsp coriander seed", "1 Tbsp avocado oil", "1 red onion, sliced", "6 garlic cloves, sliced", "1 Tbsp grated fresh ginger", "1 tsp red pepper flakes", "2 tsp kosher salt"] },
    { g: "Vegetables", i: ["1½ lb green beans, trimmed", "2 red bell peppers, sliced"] },
    { g: "To finish", i: ["4 green onions, sliced", "½ bunch cilantro", "1 lemon", "2 Tbsp coconut aminos (optional)"] }
  ],
  steps: [
    "Toast the cumin and coriander seed in a dry skillet over medium heat until they smell like something, about 90 seconds. Tip them out.",
    "Turn the heat to high, add the lamb in one layer and leave it 4 minutes to crust before breaking it up.",
    "Once it is browned, push it aside. If there is not much fat, add the avocado oil.",
    "Onion, peppers, garlic, ginger, pepper flakes and the toasted seeds in for 3 minutes.",
    "Green beans in, salt, and 4 to 5 minutes tossing until they are bright and blistered but still crunchy.",
    "Coconut aminos if you are using them, then the green onions, cilantro and a hard squeeze of lemon."
  ],
  leftovers: null
},
{
  day: 22, date: "2026-09-22", dow: "Tuesday", week: 4, protein: "steak",
  title: "Overnight Ancho-Rubbed Sirloin",
  blurb: "A dry rub, twelve hours uncovered in the fridge, then thirty-five minutes in a moderate oven and two minutes under the broiler. Almost no active time at all.",
  source: ORIGINAL,
  time: "45 min + overnight rub", active: "10 min", serves: 4, cost: "~$5.20/serving",
  protein_g: { him: 78, her: 50 },
  art: { protein: "steak", veg: ["pepper", "onion", "mushroom"], sauce: "brown" },
  tags: ["dry rub ahead", "oven", "10 min hands-on"],
  swaps: [
    "Ancho powder is dried poblano and nothing else. Check that your chili powder blend has no sugar or anti-caking starch; single-chili powders usually do not.",
    "Cocoa is sometimes suggested in a rub like this. Unsweetened cocoa is compliant, and a teaspoon does add depth. It is optional below.",
    "The overnight uncovered rest is doing two jobs: seasoning through, and drying the surface so it browns."
  ],
  ingredients: [
    { g: "Dry rub", i: ["2¼ lb top sirloin, in two thick steaks", "1 Tbsp ancho chili powder", "2 tsp kosher salt", "2 tsp ground cumin", "1 tsp smoked paprika", "1 tsp garlic powder", "1 tsp coarse black pepper", "½ tsp dried oregano", "1 tsp unsweetened cocoa (optional)"] },
    { g: "Pan", i: ["3 bell peppers, in thick strips", "2 red onions, in wedges", "8 oz cremini mushrooms, halved", "2 Tbsp avocado oil", "Salt"] },
    { g: "To finish", i: ["2 limes", "½ bunch cilantro", "1 avocado", "Olive oil"] }
  ],
  steps: [
    "Before bed: mix the rub and press it into both steaks. Leave them uncovered on a rack over a plate in the fridge overnight.",
    "Take the steaks out an hour ahead. Heat oven to 375°F.",
    "Toss the peppers, onions and mushrooms with the avocado oil and salt on a sheet pan and roast 15 minutes.",
    "Set the steaks on top of the vegetables and roast 20 to 25 minutes, until the centre reads 125°F.",
    "Broil 2 minutes for a crust, then rest the steaks on a board for 10 minutes while the vegetables stay warm.",
    "Slice against the grain, squeeze the limes over, add the cilantro, avocado and a drizzle of olive oil."
  ],
  leftovers: "Cold sliced sirloin over greens with lime is a very good lunch and takes four minutes to assemble."
},
{
  day: 23, date: "2026-09-23", dow: "Wednesday", week: 4, protein: "meatballs",
  title: "Chicken Meatballs, Herb Sauce",
  blurb: "5 stars from 30 ratings. Homemade, because chicken meatballs are the hardest kind to buy compliant, and this makes 45 so two-thirds go into the freezer.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/chicken-meatballs/", 5.0, 30),
  time: "45 min", active: "25 min", serves: 5, cost: "~$3.10/serving",
  protein_g: { him: 73, her: 47 },
  art: { protein: "meatball", veg: ["greens", "tomato", "zucchini"], sauce: "green" },
  tags: ["batch cook", "freezes well", "oven"],
  swaps: [
    "¼ cup grated parmesan → out. Add ½ tsp extra salt and 2 tsp lemon zest, which covers the savoury note it was providing.",
    "Almond flour stays: a nut, not a grain.",
    "Scaled from 1½ lb of ground chicken to 2¼ lb, making about 45 meatballs instead of 30."
  ],
  ingredients: [
    { g: "Meatballs (makes ~45)", i: ["2¼ lb ground chicken", "2 large eggs", "1 small onion, finely chopped", "⅓ cup almond flour", "⅓ cup chopped parsley", "5 garlic cloves, minced", "2 tsp lemon zest", "2 tsp kosher salt", "¾ tsp freshly ground black pepper", "¾ tsp dried oregano"] },
    { g: "Herb sauce", i: ["1 cup parsley, finely chopped", "½ cup cilantro or basil, chopped", "3 garlic cloves, minced", "2 Tbsp red wine vinegar", "½ tsp red pepper flakes", "¾ cup extra-virgin olive oil", "1 tsp kosher salt"] },
    { g: "Alongside", i: ["3 zucchini, in thick planks", "2 Tbsp olive oil", "1 pint cherry tomatoes", "5 oz arugula", "Lemon, olive oil, salt"] }
  ],
  steps: [
    "Heat oven to 400°F and line two sheet pans with parchment.",
    "Mix everything for the meatballs by hand. Ground chicken is wet, so chill the bowl 10 minutes if it will not roll.",
    "Roll 45 balls of about 1½ Tbsp each across both pans.",
    "Bake 20 to 22 minutes, until firm and lightly golden.",
    "Roast the zucchini planks and tomatoes on a third pan at the same temperature for 18 minutes, or on the rack below.",
    "Chop the herb sauce together, stir the oil in last, and spoon it over 18 meatballs served on the zucchini and arugula."
  ],
  leftovers: "Freeze 27 meatballs flat, in three bags of nine. They are the fastest dinner you own for the next two months."
},
{
  day: 24, date: "2026-09-24", dow: "Thursday", week: 4, protein: "beef",
  title: "Smoky Beef Patties, Charred Peppers",
  blurb: "Not burgers, just well-seasoned beef patties cooked hard in a cast iron pan and topped with peppers charred in the same fat. Fifteen minutes.",
  source: ORIGINAL,
  time: "20 min", active: "20 min", serves: 4, cost: "~$3.40/serving",
  protein_g: { him: 74, her: 48 },
  art: { protein: "patty", veg: ["pepper", "onion", "greens", "avocado"] },
  tags: ["15 min", "skillet", "no binder"],
  swaps: [
    "No breadcrumbs and no egg. Ground beef at 85/15 holds together on its own if you handle it lightly and only flip once.",
    "Season the outside, not the inside. Salt mixed through ground beef makes the texture springy and sausage-like.",
    "Smoked paprika is doing the work of a barbecue sauce here, without the sugar."
  ],
  ingredients: [
    { g: "Patties", i: ["2¼ lb ground beef (85/15)", "2 tsp smoked paprika", "2 tsp kosher salt", "1 tsp garlic powder", "1 tsp onion powder", "1 tsp coarse black pepper", "½ tsp cayenne", "1 Tbsp avocado oil"] },
    { g: "Peppers", i: ["4 bell peppers, in thick strips", "2 red onions, sliced", "4 garlic cloves, sliced", "1 tsp dried oregano", "1 Tbsp red wine vinegar", "Salt"] },
    { g: "To serve", i: ["6 oz mixed greens", "2 avocados", "Olive oil, lemon, salt", "Hot sauce, no sugar added"] }
  ],
  steps: [
    "Divide the beef into 6 patties, handling it as little as possible. Mix the spices and salt and season the outsides only.",
    "Get a cast iron pan very hot with the avocado oil. Cook the patties in two batches, 3 minutes a side, flipping once.",
    "Rest them on a plate. Leave every bit of fat in the pan.",
    "Peppers and onions into the hot fat, spread flat, untouched for 3 minutes so they blister.",
    "Toss, add the garlic and oregano for 1 minute, then the vinegar to deglaze. Season.",
    "Patties on the greens, peppers over the top, avocado alongside, hot sauce on the table."
  ],
  leftovers: null
},
{
  day: 25, date: "2026-09-25", dow: "Friday", week: 4, protein: "chicken",
  title: "Best Baked Chicken Breast",
  blurb: "4.99 stars from 224 ratings and compliant exactly as written. Twenty-five minutes end to end, five of them yours, and it is the recipe that finally makes chicken breast not dry.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/baked-chicken-breasts/", 4.99, 224),
  time: "30 min", active: "10 min", serves: 4, cost: "~$3.40/serving",
  protein_g: { him: 77, her: 50 },
  art: { protein: "chicken-breast", veg: ["asparagus", "lemon", "tomato", "greens"] },
  tags: ["30 min", "oven", "10 min hands-on"],
  swaps: [
    "Compliant exactly as written: olive oil, salt, paprika, garlic powder, thyme, pepper.",
    "Six breasts rather than four. The bake time goes by size, not count, so use the recipe's own guide and a thermometer.",
    "Pound the thick ends flat to an even thickness. It is the difference between all six finishing at once and half of them drying out."
  ],
  ingredients: [
    { g: "Chicken", i: ["6 boneless skinless chicken breasts (~2¼ lb)", "2 Tbsp olive oil or avocado oil", "2 tsp kosher salt", "2 tsp paprika", "1 tsp garlic powder", "1 tsp dried thyme", "½ tsp freshly ground black pepper"] },
    { g: "Alongside", i: ["1½ lb asparagus, trimmed", "1 pint cherry tomatoes", "2 Tbsp olive oil", "2 lemons", "Salt & pepper"] },
    { g: "To finish", i: ["5 oz arugula", "Olive oil, lemon, flaky salt"] }
  ],
  steps: [
    "Heat oven to 425°F. Pound the thick end of each breast so the whole thing is an even thickness.",
    "Rub with the oil, then the salt, paprika, garlic powder, thyme and pepper.",
    "Lay them in a baking dish. Toss the asparagus and tomatoes with oil, salt and pepper on a sheet pan and put both in.",
    "Bake 20 to 25 minutes depending on size, flipping the chicken halfway, until it reads 165°F.",
    "Rest the chicken 5 minutes. Squeeze a lemon over the asparagus.",
    "Serve over the arugula with olive oil, more lemon and flaky salt."
  ],
  leftovers: "Two breasts held back slice into salads all weekend. Slice them cold, never warm, or they shred."
},
{
  day: 26, date: "2026-09-26", dow: "Saturday", week: 4, protein: "steak",
  title: "Za'atar Steak, Roasted Cauliflower",
  blurb: "Za'atar goes on the steak twelve hours ahead and on the cauliflower as it roasts. One spice blend, two completely different results.",
  source: ORIGINAL,
  time: "50 min + overnight rub", active: "15 min", serves: 4, cost: "~$5.00/serving",
  protein_g: { him: 77, her: 50 },
  art: { protein: "steak", veg: ["cauliflower", "tomato", "onion", "lemon"], sauce: "green" },
  tags: ["dry rub ahead", "oven", "one spice blend"],
  swaps: [
    "Za'atar is thyme, sumac, sesame seeds and salt. Whole sesame seeds are fine; it is sesame oil that the Rules section flags. Read the jar for added wheat, which some blends use as a bulker.",
    "No za'atar? 2 tsp dried thyme, 2 tsp sumac, 1 Tbsp toasted sesame seeds, 1 tsp salt.",
    "Sirloin, tri-tip or flank all work. Pull it at 125°F regardless of which."
  ],
  ingredients: [
    { g: "Steak", i: ["2¼ lb top sirloin, in two thick steaks", "3 Tbsp za'atar (check: no wheat, no seed oil)", "2 tsp kosher salt", "2 Tbsp olive oil", "1 tsp coarse black pepper"] },
    { g: "Cauliflower", i: ["1 large head cauliflower, in thick slabs", "3 Tbsp olive oil", "1 Tbsp za'atar", "1 red onion, in wedges", "1 pint cherry tomatoes", "Salt"] },
    { g: "To finish", i: ["1 lemon", "½ bunch parsley, chopped", "3 Tbsp tahini", "1 garlic clove, grated", "Water, salt"] }
  ],
  steps: [
    "Before bed: rub the steaks with the olive oil, then the za'atar, salt and pepper. Leave them uncovered on a rack in the fridge.",
    "Take them out an hour ahead. Heat oven to 425°F.",
    "Toss the cauliflower slabs, onion and tomatoes with the olive oil, the tablespoon of za'atar and salt. Roast 25 minutes.",
    "Push the vegetables aside, lay the steaks on the pan, and roast 15 to 20 minutes until they read 125°F.",
    "Rest the steaks 10 minutes on a board while the cauliflower gets another 5 minutes in the oven if it needs colour.",
    "Loosen the tahini with lemon juice, garlic, water and salt. Slice the steak, spoon the tahini over, scatter the parsley."
  ],
  leftovers: "Roasted cauliflower is better cold than warm. Keep whatever is left for a lunch with the steak sliced over it."
},

/* ========== WEEK 5: COOK ONCE, EAT TWICE ========== */
{
  day: 27, date: "2026-09-27", dow: "Sunday", week: 5, protein: "chicken",
  title: "Two-Pan Roast Thighs, Two Ways",
  blurb: "Four pounds of thighs, two pans, two spice rubs, one oven, forty minutes. Tonight is dinner and the other pan is three lunches that do not taste like tonight.",
  source: ORIGINAL,
  time: "50 min", active: "15 min", serves: 8, cost: "~$2.40/serving",
  protein_g: { him: 76, her: 49 },
  art: { protein: "chicken-thigh", veg: ["zucchini", "pepper", "lemon", "onion"] },
  tags: ["batch cook", "oven", "two rubs"],
  swaps: [
    "Two rubs is the whole idea. The same chicken eaten four times in a week is what makes people abandon a meal plan in week four.",
    "Boneless thighs cook in 25 minutes, bone-in in 40. Do not mix them on one pan.",
    "Neither rub has sugar, which means neither pan will glaze. Both will brown, which is better anyway."
  ],
  ingredients: [
    { g: "Chicken", i: ["4 lb boneless skinless chicken thighs", "4 Tbsp olive oil, divided"] },
    { g: "Pan one: lemon & oregano", i: ["1 Tbsp dried oregano", "2 tsp garlic powder", "1½ tsp kosher salt", "1 tsp black pepper", "Zest of 1 lemon"] },
    { g: "Pan two: smoky cumin", i: ["1 Tbsp ground cumin", "2 tsp smoked paprika", "1 tsp ancho chili powder", "1½ tsp kosher salt", "½ tsp cayenne"] },
    { g: "Vegetables", i: ["3 zucchini, in half-moons", "3 bell peppers, in strips", "2 red onions, in wedges", "2 Tbsp olive oil", "Salt & pepper"] },
    { g: "To serve", i: ["2 lemons", "½ bunch parsley", "½ bunch cilantro", "6 oz mixed greens"] }
  ],
  steps: [
    "Heat oven to 425°F. Split the chicken into two bowls, 2 lb each, and give each 2 Tbsp of olive oil.",
    "Rub one bowl with the lemon-oregano mix and the other with the smoky cumin mix.",
    "Toss the vegetables with oil, salt and pepper and divide them between two sheet pans.",
    "Lay one bowl of chicken on each pan, keeping the two rubs on separate pans so they do not smell like each other.",
    "Roast 25 to 30 minutes, swapping the pans between racks halfway, until the thighs read 175°F.",
    "Eat the lemon-oregano pan tonight over greens with lemon and parsley. Cool the cumin pan completely before it goes in the fridge."
  ],
  leftovers: "The cumin pan is three lunches. Cool it uncovered on the counter for 20 minutes first, because a warm lid is what makes chicken go slimy by Wednesday."
},
{
  day: 28, date: "2026-09-28", dow: "Monday", week: 5, protein: "lamb",
  title: "Freezer Lamb Meatballs, Mint Salad",
  blurb: "You did this work on Sep 5. Fourteen meatballs come out of the freezer, into a pan, and dinner takes as long as the salad does.",
  source: ORIGINAL,
  time: "20 min", active: "10 min", serves: 4, cost: "~$4.00/serving",
  protein_g: { him: 72, her: 46 },
  art: { protein: "meatball", veg: ["cucumber", "tomato", "onion", "greens"], sauce: "green" },
  tags: ["from the freezer", "10 min hands-on", "no cooking really"],
  swaps: [
    "Move them from freezer to fridge on Sunday night. From frozen they take 25 minutes in a 375°F oven instead of 8 in a pan.",
    "If the Sep 5 batch is gone, 2½ lb of any compliant pre-made meatball drops straight in.",
    "The mint is not a garnish here. It is half the dish."
  ],
  ingredients: [
    { g: "Meatballs", i: ["14 harissa lamb meatballs from the Sep 5 freezer batch", "1 Tbsp olive oil"] },
    { g: "Mint salad", i: ["2 English cucumbers, in half-moons", "1 pint cherry tomatoes, halved", "½ red onion, thinly sliced", "1 cup mint leaves, torn", "½ cup parsley, chopped", "1 lemon, juiced", "3 Tbsp extra-virgin olive oil", "1 tsp kosher salt"] },
    { g: "Alongside", i: ["5 oz arugula", "1 avocado", "Extra olive oil"] }
  ],
  steps: [
    "Sunday night: move the bag of meatballs from the freezer to the fridge.",
    "Warm the olive oil in a skillet over medium. Add the thawed meatballs and roll them around 6 to 8 minutes until hot through and re-crisped.",
    "Meanwhile toss the cucumber, tomatoes, onion, mint and parsley with the lemon juice, olive oil and salt.",
    "Let the salad sit 5 minutes so the onion softens and the cucumber gives up a little liquid.",
    "Pile the arugula on plates, salad over it, meatballs on top.",
    "Avocado alongside and a last drizzle of olive oil."
  ],
  leftovers: null
},
{
  day: 29, date: "2026-09-29", dow: "Tuesday", week: 5, protein: "beef",
  title: "Meatloaf Without the Breadcrumbs",
  blurb: "Almond flour and a grated onion do what breadcrumbs and milk usually do. Ten minutes of mixing, an hour in the oven you can ignore entirely.",
  source: ORIGINAL,
  time: "1 hr 15 min", active: "15 min", serves: 6, cost: "~$3.30/serving",
  protein_g: { him: 75, her: 48 },
  art: { protein: "patty", veg: ["greenbean", "mushroom", "onion"], sauce: "brown" },
  tags: ["oven", "hands-off", "great cold"],
  swaps: [
    "Breadcrumbs and milk → ⅔ cup almond flour and a whole grated onion, which brings the moisture the milk was for.",
    "Ketchup glaze → a tomato paste glaze: 3 Tbsp tomato paste, 1 Tbsp red wine vinegar, 1 tsp smoked paprika. All the tang, none of the sugar.",
    "Free-form on a sheet pan rather than in a loaf tin. More surface area means more crust, and the fat drains away instead of pooling."
  ],
  ingredients: [
    { g: "Loaf", i: ["2½ lb ground beef (85/15)", "2 large eggs", "⅔ cup almond flour", "1 large onion, grated", "5 garlic cloves, minced", "¼ cup chopped parsley", "1 Tbsp Dijon mustard", "2 tsp dried thyme", "2 tsp kosher salt", "1 tsp black pepper"] },
    { g: "Glaze", i: ["3 Tbsp tomato paste, no sugar added", "1 Tbsp red wine vinegar", "1 tsp smoked paprika", "1 Tbsp olive oil"] },
    { g: "Alongside", i: ["1½ lb green beans, trimmed", "12 oz cremini mushrooms, halved", "3 Tbsp olive oil", "4 garlic cloves, sliced", "Salt & pepper", "1 lemon"] }
  ],
  steps: [
    "Heat oven to 375°F. Mix everything for the loaf by hand until just combined, and stop there.",
    "Shape it free-form into a loaf on a foil-lined sheet pan, roughly 10 by 5 inches.",
    "Whisk the glaze and brush half of it over the top.",
    "Bake 45 minutes, brush on the rest of the glaze, and bake 15 to 20 minutes more until it reads 160°F.",
    "In the last 20 minutes, toss the green beans and mushrooms with oil, garlic, salt and pepper on a second pan and roast them alongside.",
    "Rest the loaf 10 minutes before slicing, or it will crumble. Lemon over the vegetables."
  ],
  leftovers: "Cold meatloaf sliced thick is the best lunch in either month, and this makes enough for three of them."
},
{
  day: 30, date: "2026-09-30", dow: "Wednesday", week: 5, protein: "steak",
  title: "Last Night Steak & Eggs",
  blurb: "The last night of the plan, built to empty the fridge. Steak, mushrooms, whatever greens are left, and a fried egg on top to use up the box.",
  source: ORIGINAL,
  time: "25 min", active: "25 min", serves: 4, cost: "~$4.70/serving",
  protein_g: { him: 79, her: 51 },
  art: { protein: "steak-strips", veg: ["mushroom", "egg", "greens", "tomato"], sauce: "brown" },
  tags: ["25 min", "skillet", "uses up the fridge"],
  swaps: [
    "Whatever steak is cheapest. Sirloin, flank, skirt or a thick strip all work at this thickness.",
    "The egg is not decoration: it adds 6g each and it is the reason this night hits 79g without more meat.",
    "Any vegetable still in the drawer belongs in this pan. That is the entire brief for tonight."
  ],
  ingredients: [
    { g: "Steak", i: ["2 lb sirloin or flank steak", "1½ tsp kosher salt", "1 tsp coarse black pepper", "2 Tbsp avocado oil"] },
    { g: "Pan", i: ["1 lb cremini mushrooms, sliced", "1 red onion, sliced", "4 garlic cloves, sliced", "1 Tbsp chopped thyme", "Whatever vegetables are left in the drawer"] },
    { g: "Eggs & greens", i: ["4 large eggs", "1 Tbsp olive oil", "6 oz mixed greens", "1 pint cherry tomatoes", "Lemon, olive oil, flaky salt"] }
  ],
  steps: [
    "Take the steak out 30 minutes ahead, pat it dry, season both sides hard.",
    "Sear it in a very hot skillet with the avocado oil, 3 to 4 minutes a side, then rest it on a board.",
    "Mushrooms into the same pan in one layer, untouched for 3 minutes, then the onion, garlic and thyme for 3 more. Anything else from the drawer goes in here.",
    "Push it all aside, add the olive oil, and fry the eggs in the corner of the pan until the whites set.",
    "Dress the greens and tomatoes with lemon, olive oil and salt.",
    "Slice the steak against the grain, plate it on the greens with the mushrooms, and slide an egg on top of each."
  ],
  leftovers: "That is the month. Anything left over is breakfast tomorrow, and the freezer still has 27 chicken meatballs in it."
}
];

/* ============================================================
   SEPTEMBER GROCERY LISTS: five trips
   The August pantry carries over, so these are meat and produce
   with only the genuinely new jars listed.
   ============================================================ */

const SEP_GROCERIES = [
{
  trip: 1, week: 1, when: "Shop Mon Aug 31 or Tue Sep 1", covers: "Sep 1 to 5",
  est: "$85 to $100",
  note: "Five nights only, so this is the small trip. Everything in the August pantry, the oils, vinegars and every dried spice, carries straight over. Buy a box of gallon zip bags and, if you only own one, a second sheet pan. Half this month wants two pans in the oven at once.",
  sections: [
    { name: "Meat", items: [
      "8 bone-in, skin-on chicken thighs (~3 lb)",
      "2 lb ground beef, 85/15",
      "2 lb top sirloin roast, tied",
      "2¼ lb ground lamb, 15 to 20% fat",
      "2½ lb pre-made meatballs (read the label, see Rules)"
    ]},
    { name: "Produce", items: [
      "5 zucchini", "2 yellow squash", "1 large head cauliflower",
      "1 lb green beans", "12 oz cremini mushrooms",
      "3 pints cherry or grape tomatoes",
      "5 red onions", "3 heads garlic", "5 lemons",
      "4 oz arugula", "2 bunches flat-leaf parsley", "1 bunch mint", "1 bunch basil",
      "1 bunch fresh rosemary", "1 bunch fresh thyme"
    ]},
    { name: "Pantry & new this month", items: [
      "Harissa paste (check: no sugar, no seed oil) or a dry harissa blend",
      "Crushed tomatoes, no sugar added (28 oz)",
      "Kalamata olives, pitted", "Beef broth (32 oz)",
      "1 dozen eggs", "Almond flour if you finished August's",
      "Gallon zip bags", "A second sheet pan if you only have one"
    ]}
  ]
},
{
  trip: 2, week: 2, when: "Shop Sat Sep 5", covers: "Sep 6 to 12",
  est: "$115 to $135",
  note: "Buy the 5 lb whole chicken, not the 4 lb one. It is the difference between Sunday dinner and Sunday dinner plus two lunches plus a pot of broth, for about two dollars.",
  sections: [
    { name: "Meat", items: [
      "1 whole chicken, 5 lb",
      "4 lb boneless skinless chicken breast",
      "2 lb ground beef, 85/15",
      "2¼ lb ground lamb",
      "2 lb sirloin steak, 1 inch thick",
      "2½ lb pre-made meatballs"
    ]},
    { name: "Produce", items: [
      "4 large heads broccoli", "1 lb asparagus", "1 lb green beans", "1 zucchini",
      "8 bell peppers (mixed colours)", "20 oz cremini mushrooms",
      "5 yellow onions", "4 red onions", "3 shallots",
      "2 English cucumbers", "1 head romaine", "1 head butter lettuce", "4 oz arugula",
      "1 pint cherry tomatoes", "4 roma or medium tomatoes",
      "2 avocados", "2 limes", "4 lemons", "3 heads garlic",
      "2 bunches parsley", "1 bunch mint", "1 bunch cilantro", "1 bunch fresh thyme"
    ]},
    { name: "Pantry", items: [
      "Tahini (this is the yogurt replacement for two nights)",
      "Beef broth (32 oz)", "Pine nuts, optional",
      "Hot sauce, no sugar added", "Foil"
    ]}
  ]
},
{
  trip: 3, week: 3, when: "Shop Sat Sep 12", covers: "Sep 13 to 19",
  est: "$120 to $140",
  note: "Biggest meat trip of the month, and the 4 lb chuck roast is most of it. Chuck is cheap per pound and Sunday's braise covers Wednesday too, so this trip buys eight dinners from seven nights.",
  sections: [
    { name: "Meat", items: [
      "4 lb beef chuck roast",
      "4 lb bone-in chicken pieces (thighs and drumsticks)",
      "8 bone-in, skin-on chicken thighs (~3 lb)",
      "2 lb boneless skinless chicken thighs",
      "2 lb ground beef, 85/15",
      "2 lb flank steak",
      "2½ lb pre-made meatballs"
    ]},
    { name: "Produce", items: [
      "2½ lb cremini mushrooms", "1½ lb brussels sprouts", "1 lb green beans",
      "4 large zucchini", "1 large head green cabbage",
      "4 carrots", "3 celery stalks",
      "3 yellow onions", "3 red onions", "1 bunch green onions",
      "3 English cucumbers", "1 head romaine", "6 oz mixed greens",
      "5 tomatoes", "1 pint cherry tomatoes", "1 bunch radishes", "1 avocado",
      "1 large knob fresh ginger", "3 heads garlic", "6 lemons", "2 limes",
      "3 bunches parsley", "1 bunch cilantro", "1 bunch basil",
      "1 bunch fresh rosemary", "1 bunch fresh thyme"
    ]},
    { name: "Pantry", items: [
      "1 bottle dry red wine (1½ cups is used across two nights)",
      "Beef broth (64 oz)", "Tomato paste, no sugar added",
      "Crushed tomatoes, no sugar added (28 oz)",
      "Kalamata olives", "Bay leaves", "Fennel seed",
      "Coconut aminos if August's is out", "Rice vinegar", "Sesame seeds",
      "Fish sauce, no sugar added", "Chili garlic sauce, no sugar added", "Tahini"
    ]}
  ]
},
{
  trip: 4, week: 4, when: "Shop Sat Sep 19", covers: "Sep 20 to 26",
  est: "$115 to $135",
  note: "Twelve bell peppers is not a typo: four of the seven nights lean on them. Sunday's drumsticks are the cheapest protein in either month at roughly $2 a serving, which is what pays for the two sirloin nights.",
  sections: [
    { name: "Meat", items: [
      "12 chicken drumsticks (~3½ lb)",
      "6 boneless skinless chicken breasts (~2¼ lb)",
      "2¼ lb ground chicken",
      "2¼ lb ground lamb",
      "2¼ lb ground beef, 85/15",
      "4½ lb top sirloin, in four thick steaks (two nights)"
    ]},
    { name: "Produce", items: [
      "12 bell peppers (mixed colours)", "1½ lb green beans", "1½ lb asparagus",
      "3 zucchini", "1 large head cauliflower", "8 oz cremini mushrooms",
      "7 red onions", "1 small yellow onion", "1 bunch green onions",
      "3 pints cherry tomatoes", "5 avocados",
      "12 oz mixed greens", "10 oz arugula",
      "1 knob fresh ginger", "8 limes", "5 lemons", "4 heads garlic",
      "3 bunches cilantro", "2 bunches parsley"
    ]},
    { name: "Pantry", items: [
      "Ancho chili powder", "Za'atar (check: no wheat, no seed oil)",
      "Sumac if your za'atar blend needs help", "Smoked paprika",
      "Unsweetened cocoa powder, optional for the steak rub",
      "Tahini", "Almond flour", "1 dozen eggs", "Hot sauce, no sugar added"
    ]}
  ]
},
{
  trip: 5, week: 5, when: "Shop Sat Sep 26, small top-up", covers: "Sep 27 to 30",
  est: "$65 to $80",
  note: "Four nights, one of them entirely from the freezer. Sunday's 4 lb of thighs is deliberately more than four nights needs, because it is also next week's lunches.",
  sections: [
    { name: "Meat", items: [
      "4 lb boneless skinless chicken thighs",
      "2½ lb ground beef, 85/15",
      "2 lb sirloin or flank steak",
      "(14 lamb meatballs already in the freezer from Sep 5)"
    ]},
    { name: "Produce", items: [
      "1¾ lb cremini mushrooms", "1½ lb green beans", "3 zucchini", "3 bell peppers",
      "3 red onions", "1 large yellow onion",
      "2 English cucumbers", "2 pints cherry tomatoes",
      "12 oz mixed greens", "5 oz arugula", "1 avocado",
      "5 lemons", "2 heads garlic",
      "2 bunches parsley", "1 bunch mint", "1 bunch cilantro", "1 bunch fresh thyme"
    ]},
    { name: "Pantry", items: [
      "Tomato paste, no sugar added", "1 dozen eggs",
      "Almond flour", "Dijon mustard if August's is gone"
    ]}
  ]
}
];

/* ============================================================
   SEPTEMBER PREP-AHEAD NOTES
   ============================================================ */

const SEP_PREP = [
  { w: 1, day: "Every night before bed", items: [
    "This is the habit the whole month runs on: the last thing you do in the kitchen is put tomorrow's meat in a bag with its marinade. Four of these five nights want it.",
    "Sep 1's marinade splits in two. Oil, garlic and herbs go on overnight; the lemon juice and Dijon go in an hour before it roasts, because acid past about three hours turns the texture chalky.",
    "Sep 3 and Sep 5 both want the fridge shelf: the sirloin sits uncovered on a rack overnight, which dries the surface so it browns.",
    "Sep 5 makes 36 lamb meatballs and you eat 14. Freeze the other 22 flat the same night, not the next morning."
  ]},
  { w: 2, day: "Sunday Sep 6", items: [
    "Strip the roast chicken carcass while it is still warm and bag the meat. Cold chicken does not come off the bone, it comes off in shreds you throw away.",
    "Simmer the carcass with an onion and a carrot for two hours tonight. That broth is what Sep 13 and Sep 29 both ask for.",
    "Salt the whole chicken in the morning and leave it uncovered in the fridge all day. It is not in the published recipe and it is the single biggest improvement to the skin.",
    "Sep 12's herb sauce doubles in the same five minutes it takes to make one batch. The second jar is Sep 18's entire dinner plan."
  ]},
  { w: 3, day: "Saturday Sep 12", items: [
    "Sunday's pot roast wants three and a half hours in the oven. Start it at 2pm, not at 6pm.",
    "Shred the whole cabbage on Saturday and bag it with a paper towel. Sep 15 wants half of it and the other half keeps a week.",
    "Sep 14's chicken goes into its marinade on Sunday night, not Monday morning.",
    "Sep 17's ragu makes a third more than that night needs. Freeze that third flat while you are putting the rest on the table."
  ]},
  { w: 4, day: "Saturday Sep 19", items: [
    "Two dry rubs go on overnight this week, Sep 22 and Sep 26. Both steaks sit uncovered on a rack in the fridge, and both need an hour on the counter before they cook.",
    "Sep 20's drumsticks marinate overnight on Saturday. It is the cheapest and the most hands-off night of the month.",
    "Sep 23 makes 45 chicken meatballs. Freeze 27 in three bags of nine, not one bag of 27, so you can pull exactly one dinner out.",
    "Mix both of Sep 27's spice rubs this week while the jars are already out."
  ]},
  { w: 5, day: "Sunday Sep 27", items: [
    "Move the Sep 5 lamb meatballs from freezer to fridge tonight, so Monday is an eight-minute dinner instead of a twenty-five-minute one.",
    "Sunday's two pans of thighs are dinner plus three lunches. Cool the cumin pan uncovered on the counter for 20 minutes before it goes in the fridge, because a warm lid is what makes chicken slimy by Wednesday.",
    "Sep 30 is written to empty the vegetable drawer. Do not shop for it beyond the list; the whole point is what is already there.",
    "You will finish the month with 27 chicken meatballs in the freezer. That is October's first week already half solved."
  ]}
];

/* ============================================================
   THE MONTHS
   Two plans, one site. Everything the renderer needs comes off
   the selected month, so adding October is adding one entry here.
   ============================================================ */

const PLAN_MONTHS = [
  {
    key: "aug", label: "August", short: "Aug", title: "August 2026",
    span: "Sat 1 Aug to Sun 30 Aug 2026",
    first: "2026-08-01", last: "2026-08-30",
    subhead: "Thirty dinners. No dairy, no starch, no sugar, no seed oils.",
    lede: "Five proteins on rotation, built on highly-rated recipes from Budget Bytes and " +
          "Downshiftology and rewritten where they needed it. Each week runs on one flavour " +
          "direction so the produce bought on Saturday is gone by Friday. Budget below is the " +
          "sum of the five shopping lists, at supermarket prices for 4 to 6 servings a night.",
    method: [
      { h: "How the recipes were chosen",
        p: ["Recipes came from Budget Bytes and Downshiftology, filtered for high ratings and short hands-on times. The rating and review count on each night were read off the source page. Eighteen of the thirty link to a specific published recipe; the other twelve are written for this plan, marked Built for this plan, and exist to use up what the sourced recipes leave behind."] },
      { h: "On Serious Eats",
        p: ["You asked for it specifically, and I couldn't use it. Serious Eats blocks automated access, so neither search nor page fetches returned anything, so there was no way to read a recipe or verify a rating there. Rather than cite pages I couldn't open, I sourced from two sites I could actually read. Two nights use techniques Serious Eats popularised: the reverse sear on 22 Aug and hard-searing sliced steak in batches on 19 Aug, both written from method rather than copied from a page."] },
      { h: "Portions",
        p: ["Recipes are listed at their published yields, mostly 4 to 6 servings. This is the month that turned out to be light for Vishut, which is why September is sized differently. See How the portions are sized above."] }
    ],
    weeks: AUG_WEEKS, days: AUG_DAYS, groceries: AUG_GROCERIES, prep: AUG_PREP
  },
  {
    key: "sep", label: "September", short: "Sep", title: "September 2026",
    span: "Tue 1 Sep to Wed 30 Sep 2026",
    first: "2026-09-01", last: "2026-09-30",
    subhead: "Thirty dinners, oven-led and sized up. Same four rules.",
    lede: "Two things changed from August. Twenty-two of the thirty nights are marinate-ahead " +
          "and bake, so the work happens the night before and the oven does the rest. And every " +
          "night is portioned to put 70g or more of protein on Vishut's plate and 45g or more on " +
          "Megan's, with enough left for a lunch, which is roughly a third more meat per night " +
          "than August bought.",
    method: [
      { h: "How the recipes were chosen",
        p: ["Same two sources, filtered differently. August was filtered for high ratings and short hands-on times; September was filtered for high ratings and for the oven doing the work, which is a much smaller pool. Thirteen of the thirty link to a specific published recipe with its rating and review count read off the page. The other seventeen are written for this plan and marked Built for this plan.",
            "Nothing here has an invented rating. Where a night has no stars it is because it is original, not because the number was lost."] },
      { h: "What changed from August",
        p: ["Twenty-two of the thirty nights are marinate-ahead or straight into the oven, against roughly half in August. Nineteen nights need fifteen minutes or less of hands-on work, against twelve in August. The other eight are deliberately fast skillet nights for when you want to eat immediately rather than in forty minutes.",
            "Every night is portioned from the protein up rather than from the recipe's published yield, which is the other half of the change. The figures are on every night's card."] },
      { h: "Where the swaps are heaviest",
        p: ["Four of the sourced recipes lean on yogurt, which is out. Two of those are Budget Bytes marinades where the yogurt was doing real work, tenderising as well as flavouring, and the swap to olive oil plus a longer marinade does not fully replace it. Those two nights are marked and the trade is written into the swaps. The balsamic and maple in the Sep 19 chicken come out for the same reasons they came out everywhere in August."] }
    ],
    weeks: SEP_WEEKS, days: SEP_DAYS, groceries: SEP_GROCERIES, prep: SEP_PREP
  }
];

/* The renderer reads these four. selectMonth swaps what they point at. */
let MONTH = PLAN_MONTHS[0];
let WEEKS = MONTH.weeks, DAYS = MONTH.days, GROCERIES = MONTH.groceries, PREP = MONTH.prep;

function selectMonth(key) {
  MONTH = PLAN_MONTHS.find(m => m.key === key) || PLAN_MONTHS[0];
  WEEKS = MONTH.weeks;
  DAYS = MONTH.days;
  GROCERIES = MONTH.groceries;
  PREP = MONTH.prep;
  return MONTH;
}

/* Whichever month today falls in; failing that, the next one that has not
   ended; failing that, the last one. On 29 Aug that is August for two more
   nights, then it moves itself to September. */
function monthForToday(now = new Date()) {
  const d = new Date(now); d.setHours(0, 0, 0, 0);
  const at = (iso) => new Date(iso + "T00:00:00");
  return (PLAN_MONTHS.find(m => d >= at(m.first) && d <= at(m.last))
       || PLAN_MONTHS.find(m => d < at(m.first))
       || PLAN_MONTHS[PLAN_MONTHS.length - 1]).key;
}

const PROTEIN_NOTE = {
  title: "How the portions are sized",
  body: "August was written at each recipe's published yield, which turned out to be enough for Megan and not enough for Vishut. September is sized from the protein up instead: every night is built to put at least 70g on his plate and at least 45g on hers, and still leave a lunch behind. In practice that means about 2 to 2¼ lb of boneless meat a night, 3 lb if it is bone-in, against August's 1½ lb.",
  how: [
    "Boneless chicken thigh, ground beef and ground lamb all land near 80 to 86g of protein per raw pound",
    "Chicken breast is the densest at about 104g per raw pound, bone-in thighs the least at about 63g",
    "Drumsticks are the cheapest protein in the month, at roughly $2 a serving",
    "An egg adds 6g, which is why two nights finish with one on top"
  ],
  caveat: "The per-plate figures on each September night are calculated from raw weight, so they run a little conservative: they assume you serve everything and nothing sticks to the pan. Treat them as a floor rather than a precise count. August's nights have no figure because they were not designed against one.",
  adjust: "Want more still? The cheapest way to add 15g a plate is a second egg or a handful of the frozen meatballs, not more steak. The cheapest way to cut the bill is to move a sirloin night to chuck or to drumsticks, both of which are in the plan already so you can see what they cost."
};
