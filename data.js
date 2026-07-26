/* ============================================================
   AUGUST 2026 — 30-DAY MEAL PLAN
   Dairy-free · grain & starch-free · no added sugar · no seed oils
   Proteins: chicken, pre-made meatballs, steak, ground lamb, ground beef
   ============================================================ */

const RULES = {
  out: [
    { t: "Dairy", d: "Butter, cheese, yogurt, cream, milk, sour cream. Every recipe below is rebuilt without it." },
    { t: "Grains & starches", d: "Rice, pasta, bread, tortillas, flour, breadcrumbs, potatoes, corn, beans & legumes." },
    { t: "Added sugar", d: "Sugar, brown sugar, honey, maple, agave — plus the sauces that hide it: BBQ, ketchup, teriyaki, most sriracha, balsamic glaze, taco seasoning packets." },
    { t: "Vegetable & seed oils", d: "Canola, soybean, corn, sunflower, safflower, grapeseed, cottonseed, rice bran, generic “vegetable oil.” This also rules out nearly all bottled mayo and salad dressing." }
  ],
  in: [
    { t: "Fats", d: "Extra-virgin olive oil, avocado oil, beef tallow, coconut oil, rendered fat from the pan." },
    { t: "Acid & umami", d: "Lemon, lime, red wine vinegar, apple cider vinegar, coconut aminos, fish sauce, Dijon, olives, no-sugar-added crushed tomatoes, anchovy." },
    { t: "Vegetables", d: "Leafy greens, cabbage, zucchini, summer squash, cauliflower, broccoli, green beans, asparagus, peppers, mushrooms, tomatoes, cucumber, onion, garlic, avocado, radish, bok choy." },
    { t: "Other", d: "Eggs, almond flour, nuts & seeds, fresh herbs, dried spices." }
  ],
  watch: [
    { t: "Toasted sesame oil", d: "Technically a seed oil. Kept only as an optional ½ tsp finishing drizzle on two days — leave it out to stay strict." },
    { t: "Balsamic vinegar", d: "Carries residual grape sugar. Swapped out for red wine vinegar everywhere in this plan." },
    { t: "Carrots & onion", d: "Higher-carb than the rest of the veg list. Used in small supporting amounts, never as the bulk." },
    { t: "Almond flour", d: "A nut, not a grain or starch — it stays. Swap in crushed pork rinds or just skip the binder if you'd rather." },
    { t: "Coconut aminos", d: "Has naturally occurring coconut-sap sugar (~1g per tsp). It replaces soy sauce here; skip if you're counting to zero." }
  ]
};

const PROTEINS = {
  chicken:   { label: "Chicken",       hex: "#d9a03c" },
  meatballs: { label: "Meatballs",     hex: "#c2703a" },
  beef:      { label: "Ground beef",   hex: "#b8402c" },
  steak:     { label: "Steak",         hex: "#6f2130" },
  lamb:      { label: "Ground lamb",   hex: "#8b6aa3" }
};

const WEEKS = [
  { n: 1, theme: "Mediterranean",  dates: "Aug 1 – 7",  shop: "Fri Jul 31 or Sat Aug 1",
    note: "Lemon, oregano, parsley and olive oil carry the whole week. Buy the big bottle of olive oil now — it's used every single day for 30 days." },
  { n: 2, theme: "Southwest",      dates: "Aug 8 – 14", shop: "Sat Aug 8",
    note: "Lime, cilantro and bell peppers. Three peppers on Saturday become two more dinners by Thursday, so nothing sits in the drawer going soft." },
  { n: 3, theme: "Stir-fry",       dates: "Aug 15 – 21", shop: "Sat Aug 15",
    note: "One large cabbage covers four dinners. Ginger and green onion are the through-line. Coconut aminos replaces soy sauce all week." },
  { n: 4, theme: "Steakhouse",     dates: "Aug 22 – 28", shop: "Sat Aug 22",
    note: "Mushrooms, thyme, rosemary and a lot of pan sauce. Heaviest meat spend of the month — offset by two ground-beef nights." },
  { n: 5, theme: "Greatest hits",  dates: "Aug 29 – 30", shop: "Sat Aug 29 (small top-up)",
    note: "Two days. Almost everything is already in the fridge — this trip is eggs, a lemon and some greens." }
];

/* ---------- helper for source objects ---------- */
const S = (name, url, rating, reviews) => ({ name, url, rating, reviews });
const ORIGINAL = { name: "Built for this plan", url: null, rating: null, reviews: null };

const DAYS = [

/* ========== WEEK 1 — MEDITERRANEAN ========== */
{
  day: 1, date: "2026-08-01", dow: "Saturday", week: 1, protein: "chicken",
  title: "Greek Sheet Pan Chicken",
  blurb: "The highest-rated recipe in the whole plan, and it needs one pan. Bone-in thighs roast on top of zucchini, peppers and tomatoes so the vegetables cook in the chicken fat.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/greek-sheet-pan-chicken/", 4.96, 806),
  time: "1 hr", active: "15 min", serves: 6, cost: "~$2.90/serving",
  art: { protein: "chicken-thigh", veg: ["zucchini", "tomato", "pepper", "olive", "onion"] },
  tags: ["sheet pan", "leftovers", "hands-off"],
  swaps: ["Skip the ¼ cup feta — add another ¼ cup kalamata olives instead for the same salty finish.", "Check your Dijon: most are compliant, a few add sugar."],
  ingredients: [
    { g: "Marinade", i: ["½ cup extra-virgin olive oil", "1 lemon, juiced (~3 Tbsp)", "4 garlic cloves, minced", "2 tsp dried oregano", "1 tsp dried thyme", "1 tsp Dijon mustard", "1 tsp kosher salt", "½ tsp black pepper"] },
    { g: "Pan", i: ["6 bone-in, skin-on chicken thighs", "1 medium zucchini, halved lengthwise & sliced", "1 yellow bell pepper, 1-inch pieces", "½ large red onion, in wedges", "1 pint cherry tomatoes", "½ cup pitted kalamata olives", "2 Tbsp chopped parsley"] }
  ],
  steps: [
    "Heat oven to 425°F. Whisk all marinade ingredients together.",
    "Coat the chicken thighs in two-thirds of the marinade; let sit 10–15 minutes.",
    "Spread the zucchini, pepper, onion and tomatoes on a sheet pan. Drizzle with the remaining marinade and toss.",
    "Nestle the thighs skin-side up among the vegetables. Roast 30 minutes.",
    "Scatter over the olives and roast another 10–15 minutes, until the skin is crisp and the chicken hits 165°F.",
    "Shower with parsley. Spoon the pan juices over everything."
  ],
  leftovers: "Pull the extra thigh meat off the bone tonight — it becomes lunch, and it keeps better off the bone."
},
{
  day: 2, date: "2026-08-02", dow: "Sunday", week: 1, protein: "lamb",
  title: "Lamb Meatballs, Mint Chimichurri",
  blurb: "Make the full batch of 30 meatballs today. Half get eaten, half go straight into the freezer for Aug 25 — the single biggest time save in the month.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/lamb-meatballs/", 5.0, 7),
  time: "40 min", active: "20 min", serves: 6, cost: "~$3.60/serving",
  art: { protein: "meatball", veg: ["greens", "tomato", "cucumber"], sauce: "green" },
  tags: ["batch cook", "freezes well", "oven"],
  swaps: ["Almond flour is a nut, not a grain — it stays. Crushed pork rinds or nothing at all also work.", "Serve over a cucumber-tomato salad instead of pita."],
  ingredients: [
    { g: "Meatballs", i: ["1½ lb ground lamb (15–20% fat)", "1 large egg", "¼ cup finely chopped red onion", "¼ cup almond flour", "2 garlic cloves, minced", "¼ cup chopped parsley", "2 Tbsp chopped fresh mint", "2 tsp dried oregano", "½ tsp ground cumin", "2 tsp lemon zest", "1 tsp kosher salt", "½ tsp black pepper"] },
    { g: "Mint chimichurri", i: ["1 cup fresh mint leaves, finely chopped", "½ cup flat-leaf parsley, finely chopped", "2 garlic cloves, roughly chopped", "1 Tbsp red wine vinegar", "½ tsp kosher salt", "¼ tsp red pepper flakes", "½ cup extra-virgin olive oil"] },
    { g: "To serve", i: ["1 cucumber, diced", "1 large tomato, diced", "Olive oil + red wine vinegar"] }
  ],
  steps: [
    "Heat oven to 400°F and line a sheet pan with parchment.",
    "Combine every meatball ingredient in a bowl and mix thoroughly by hand.",
    "Scoop 1½ Tbsp portions and roll into 30 balls. Space them out on the pan.",
    "Bake 25–30 minutes, until browned and firm.",
    "Meanwhile chop the mint, parsley and garlic together; stir in the vinegar, salt and pepper flakes, then slowly stir in the olive oil. Let it sit 10–15 minutes.",
    "Dress the cucumber and tomato with oil and vinegar. Serve 15 meatballs over the salad with chimichurri spooned across."
  ],
  leftovers: "Freeze the other 15 meatballs flat in a bag. They reappear on Aug 25."
},
{
  day: 3, date: "2026-08-03", dow: "Monday", week: 1, protein: "chicken",
  title: "Garlic Marinated Chicken + Greek Salad",
  blurb: "Compliant exactly as published — no swaps needed. Olive oil, lemon, garlic, oregano. Get the chicken into the marinade before work and dinner is fifteen minutes.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/garlic-marinated-chicken/", 4.49, 25),
  time: "15 min + marinate", active: "15 min", serves: 4, cost: "$1.49/serving",
  art: { protein: "chicken-breast", veg: ["cucumber", "tomato", "onion", "olive"] },
  tags: ["marinate ahead", "skillet", "20 min"],
  swaps: ["Nothing. This one is already dairy-free, starch-free, sugar-free and olive-oil based.", "Use thighs over breasts — cheaper, and they don't dry out."],
  ingredients: [
    { g: "Marinade", i: ["¼ cup olive oil", "¼ cup lemon juice", "3 garlic cloves, minced", "½ Tbsp dried oregano", "½ tsp salt", "Cracked black pepper"] },
    { g: "Chicken", i: ["1½ lb boneless skinless chicken thighs"] },
    { g: "Greek salad", i: ["1 cucumber, in half-moons", "2 tomatoes, wedged", "¼ red onion, thinly sliced", "¼ cup kalamata olives", "Olive oil, red wine vinegar, oregano, salt"] }
  ],
  steps: [
    "Whisk the oil, lemon juice, garlic, oregano, salt and pepper together.",
    "Add the chicken, turn to coat, and refrigerate 30 minutes to 8 hours.",
    "Heat a large skillet over medium. Cook the thighs 5–7 minutes per side until deeply browned and cooked through.",
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
  swaps: ["Read the meatball bag — see the sourcing note in the Rules section. Most supermarket meatballs contain breadcrumbs and cheese.", "Use crushed tomatoes with no added sugar, not jarred marinara."],
  ingredients: [
    { g: "Skillet", i: ["1 lb compliant pre-made meatballs (beef or chicken)", "2 Tbsp olive oil", "3 garlic cloves, sliced", "1 (28 oz) can crushed tomatoes, no sugar added", "½ cup pitted kalamata olives", "1 tsp dried oregano", "¼ tsp red pepper flakes", "Salt & pepper"] },
    { g: "Base", i: ["2 zucchini, peeled into ribbons or spiralized", "1 Tbsp olive oil", "2 Tbsp chopped parsley"] }
  ],
  steps: [
    "Warm the olive oil in a large skillet over medium. Add the garlic and cook 30 seconds until fragrant, not brown.",
    "Add the crushed tomatoes, oregano and pepper flakes. Simmer 5 minutes to thicken.",
    "Add the meatballs, cover, and simmer 8–10 minutes until heated through. Stir in the olives.",
    "In a second pan, toss the zucchini ribbons with oil over high heat for 90 seconds — just until barely limp, never longer.",
    "Spoon the meatballs and sauce over the ribbons. Finish with parsley."
  ],
  leftovers: "Save 1 cup of the tomato sauce — it turns up again on Aug 28."
},
{
  day: 5, date: "2026-08-05", dow: "Wednesday", week: 1, protein: "steak",
  title: "Seared Sirloin, Chimichurri, Blistered Green Beans",
  blurb: "Steak night. The chimichurri is a Budget Bytes recipe that's already fully compliant — olive oil, red wine vinegar, herbs, no sugar anywhere.",
  source: S("Budget Bytes (chimichurri)", "https://www.budgetbytes.com/chimichurri-sauce/", 4.74, 15),
  time: "30 min", active: "25 min", serves: 4, cost: "~$4.20/serving",
  art: { protein: "steak", veg: ["greenbean", "greens", "lemon"], sauce: "green" },
  tags: ["steak night", "skillet", "30 min"],
  swaps: ["Skip any sugar-based rub. Salt and pepper, aggressively, is the whole seasoning.", "Chimichurri keeps a week — make the full batch."],
  ingredients: [
    { g: "Steak", i: ["1¼ lb sirloin or flank steak", "1 Tbsp avocado oil", "Kosher salt & coarse black pepper"] },
    { g: "Chimichurri", i: ["1 cup packed Italian parsley", "½ cup packed cilantro", "½ cup olive oil", "¼ cup red wine vinegar", "3 garlic cloves", "1 tsp dried oregano", "½ tsp ground cumin", "¼ tsp crushed red pepper", "½ tsp salt"] },
    { g: "Green beans", i: ["1 lb green beans, trimmed", "1 Tbsp olive oil", "2 garlic cloves, sliced", "Salt, lemon"] }
  ],
  steps: [
    "Take the steak out of the fridge 30 minutes ahead and salt it generously on both sides.",
    "Finely chop the parsley, cilantro and garlic. Stir together with the oil, vinegar, oregano, cumin, pepper flakes and salt. Set aside 15 minutes.",
    "Get a cast-iron skillet ripping hot. Pat the steak dry, oil it, and sear 3–4 minutes per side for medium-rare.",
    "Rest the steak 10 minutes. This is not optional — slicing early costs you the juices.",
    "While it rests, blister the green beans in the same pan over high heat 5–6 minutes, tossing. Add garlic in the last minute, then salt and a squeeze of lemon.",
    "Slice the steak against the grain and spoon chimichurri over."
  ],
  leftovers: "Leftover chimichurri goes on Aug 22's steak and Aug 27's chicken."
},
{
  day: 6, date: "2026-08-06", dow: "Thursday", week: 1, protein: "beef",
  title: "Beef Kofta Meatballs, Roasted Vegetables",
  blurb: "4.88 stars from 85 reviews and it tastes like a Middle Eastern restaurant. Warm spices — cumin, cinnamon, a whisper of clove — in the beef.",
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
    "Mix the beef with the onion, garlic, herbs and spices until just combined — overworking makes them tough.",
    "Shape into 16 meatballs.",
    "Brown the meatballs in olive oil in a skillet over medium, in two batches, about 7 minutes each.",
    "Sauté the riced cauliflower in olive oil 5 minutes with salt. Build bowls: cauliflower rice, roasted vegetables, kofta, parsley."
  ],
  leftovers: "Doubles cleanly as lunch for two days. The kofta reheat better than most meatballs."
},
{
  day: 7, date: "2026-08-07", dow: "Friday", week: 1, protein: "chicken",
  title: "Garlic-Herb Chicken Thighs + Roasted Broccoli",
  blurb: "A perfect 5 stars on Budget Bytes. Published with butter — olive oil does the same job here, and the lemon slices roasting alongside are the real trick.",
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
    "Bake both 30–35 minutes, until the chicken reads 165°F and the broccoli edges are charred.",
    "Spoon the pan juices back over the chicken and finish with the rest of the parsley."
  ],
  leftovers: null
},

/* ========== WEEK 2 — SOUTHWEST ========== */
{
  day: 8, date: "2026-08-08", dow: "Saturday", week: 2, protein: "chicken",
  title: "Sheet Pan Chicken Fajitas",
  blurb: "5 stars, 30 minutes, one pan, and the seasoning is made from scratch so there's no cornstarch or sugar riding along in a packet.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/sheet-pan-chicken-fajitas/", 5.0, 27),
  time: "30 min", active: "10 min", serves: 6, cost: "~$2.40/serving",
  art: { protein: "chicken-breast", veg: ["pepper", "onion", "avocado", "lime"] },
  tags: ["sheet pan", "leftovers", "30 min"],
  swaps: ["Tortillas → butter lettuce or romaine cups.", "Sour cream → guacamole or sliced avocado.", "Make the seasoning yourself from the spices listed — packets almost always contain sugar and starch."],
  ingredients: [
    { g: "Pan", i: ["1½ lb boneless skinless chicken breasts, sliced thin", "3 bell peppers, sliced thin", "1 medium yellow onion, thinly sliced", "2 Tbsp extra-virgin olive oil"] },
    { g: "Seasoning", i: ["½ Tbsp chili powder", "½ Tbsp ground cumin", "1 tsp garlic powder", "½ tsp paprika", "½ tsp dried oregano", "½ tsp kosher salt", "¼ tsp black pepper"] },
    { g: "To serve", i: ["1 head butter or romaine lettuce, leaves separated", "2 avocados", "1 lime", "Fresh cilantro"] }
  ],
  steps: [
    "Heat oven to 425°F. Stir the spices together in a small bowl.",
    "Toss the chicken, peppers and onion with the olive oil and the full seasoning mix in a large bowl.",
    "Spread across a rimmed sheet pan in a single layer — crowding steams it instead of roasting it.",
    "Bake 15–20 minutes, until the chicken is cooked through and the pepper edges catch.",
    "Pile into lettuce cups with avocado, cilantro and a hard squeeze of lime."
  ],
  leftovers: "Cook the full 1½ lb. Thursday's salad is built from what's left."
},
{
  day: 9, date: "2026-08-09", dow: "Sunday", week: 2, protein: "steak",
  title: "Southwest Steak Bowls",
  blurb: "4.91 stars. The original is a rice-and-beans bowl — rebuilt here on cauliflower rice with guacamole standing in for sour cream. The cumin-lime steak marinade is untouched.",
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
    "Rice the cauliflower and sauté in olive oil over medium-high 5–6 minutes. Off heat, stir in cilantro, lime juice and salt.",
    "Combine the pico ingredients. Mash the guacamole ingredients separately.",
    "Sear the steak in a hot skillet 3–5 minutes per side. Rest 5 minutes, then slice thinly against the grain.",
    "Build bowls: cilantro-lime cauliflower rice, steak, pico, guacamole, extra lime."
  ],
  leftovers: "Make the full head of cauliflower rice. Tuesday uses the rest."
},
{
  day: 10, date: "2026-08-10", dow: "Monday", week: 2, protein: "beef",
  title: "Taco Salad, Dairy-Free",
  blurb: "Thirty minutes and almost no cooking. The published version leans on a seasoning packet, cheese, beans and chips — all four come out, and it's better for it.",
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
    "Stir all the seasoning spices together — that's your taco seasoning, and it takes 20 seconds.",
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
  blurb: "4.93 stars from 52 reviews and it needs zero modification — olive oil, garlic, cumin, lime, cilantro. Marinate in the morning, cook in fifteen minutes.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/easy-cilantro-lime-chicken/", 4.93, 52),
  time: "25 min + marinate", active: "20 min", serves: 6, cost: "$1.11/serving",
  art: { protein: "chicken-thigh", veg: ["cauliflower", "lime", "greens", "avocado"] },
  tags: ["marinate ahead", "skillet", "cheap"],
  swaps: ["None needed — already compliant as published.", "Serve over the cauliflower rice left from Sunday."],
  ingredients: [
    { g: "Chicken", i: ["6 boneless skinless chicken thighs (1½–1¾ lb)", "2 Tbsp olive oil", "4 garlic cloves, minced", "½ tsp cumin", "½ tsp salt", "Cracked black pepper", "2 limes, divided", "½ bunch cilantro, divided"] },
    { g: "To serve", i: ["Leftover cilantro-lime cauliflower rice", "Sliced avocado", "Lime wedges"] }
  ],
  steps: [
    "Combine the olive oil, garlic, cumin, salt and pepper.",
    "Zest one lime and juice both. Stir the zest, juice and half the cilantro into the marinade.",
    "Coat the thighs and refrigerate 30 minutes to 8 hours.",
    "Heat a large skillet over medium-high. Cook 5–7 minutes per side until browned and cooked through.",
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
  swaps: ["Drop the 1 cup of frozen corn — replace with an extra cup of shredded cabbage.", "Check the canned tomatoes with green chiles for added sugar; fire-roasted plain plus a diced jalapeño also works.", "Taco sauce → a hot sauce with no sugar (most vinegar-based ones qualify)."],
  ingredients: [
    { g: "Skillet", i: ["½ head green cabbage, shredded (~5 cups)", "1 Tbsp olive oil", "½ lb ground beef", "2 garlic cloves, minced", "1 Tbsp chili powder", "½ tsp cumin", "Salt to taste", "1 (10 oz) can diced tomatoes with green chiles, drained", "2 green onions, sliced", "Hot sauce, no sugar added"] }
  ],
  steps: [
    "Shred the cabbage and set it aside.",
    "Heat the oil in a large skillet over medium. Brown the beef with the garlic, chili powder, cumin and salt, breaking it up. Drain if there's a lot of fat.",
    "Add the drained tomatoes and cook until most of the liquid has gone.",
    "Add the cabbage and sauté 2–3 minutes — you want it wilted at the edges, still crunchy in the middle.",
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
  swaps: ["Check the chipotle in adobo for sugar — several brands add it. Chipotle powder plus a splash of vinegar is a clean substitute.", "Serve over shredded cabbage or in lettuce cups."],
  ingredients: [
    { g: "Skillet", i: ["1 lb compliant pre-made meatballs", "2 Tbsp avocado oil", "2 bell peppers, sliced", "½ onion, sliced", "3 garlic cloves, minced"] },
    { g: "Sauce", i: ["1–2 chipotle peppers in adobo, minced (or 1 tsp chipotle powder)", "1 (14 oz) can crushed tomatoes, no sugar added", "1 lime, juiced", "½ tsp cumin", "Salt", "Cilantro to finish"] }
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
    "Warm the leftover chicken and peppers briefly in a dry skillet — 30 seconds, just to wake them up. Or use them cold.",
    "Shake the dressing ingredients together in a jar.",
    "Build the salad: romaine, chicken and peppers, tomato, onion, avocado.",
    "Dress, toss, top with cilantro and jalapeño."
  ],
  leftovers: null
},

/* ========== WEEK 3 — STIR-FRY ========== */
{
  day: 15, date: "2026-08-15", dow: "Saturday", week: 3, protein: "beef",
  title: "Beef & Cabbage Stir Fry",
  blurb: "508 reviews at 4.64 stars — the most-reviewed recipe in this plan by a wide margin. Thirty minutes and about $1.79 a serving.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/beef-cabbage-stir-fry/", 4.64, 508),
  time: "30 min", active: "30 min", serves: 4, cost: "$1.79/serving",
  art: { protein: "beef-crumble", veg: ["cabbage", "onion", "greens"], sauce: "brown" },
  tags: ["one pan", "30 min", "reader favorite"],
  swaps: ["Soy sauce → coconut aminos (2½ Tbsp, since aminos are milder).", "Brown sugar → out. The aminos already carry a faint sweetness.", "Sriracha → a sugar-free chili garlic sauce or sambal oelek.", "Toasted sesame oil is technically a seed oil — keep it as ½ tsp at the end, or leave it out."],
  ingredients: [
    { g: "Sauce", i: ["2½ Tbsp coconut aminos", "1 Tbsp sugar-free chili garlic sauce", "1 tsp rice vinegar (unseasoned)", "½ tsp toasted sesame oil (optional — see note)"] },
    { g: "Stir fry", i: ["½ head green cabbage, shredded", "1 carrot, shredded (keep it to one)", "3 green onions, sliced", "½ Tbsp avocado oil", "½ lb ground beef", "2 garlic cloves, minced", "1 Tbsp fresh grated ginger", "Salt & pepper"] },
    { g: "Finish", i: ["1 Tbsp sesame seeds"] }
  ],
  steps: [
    "Stir the sauce ingredients together and set aside.",
    "Shred the cabbage and carrot, slice the green onions, mince the garlic, grate the ginger. Have it all ready — stir-fries move fast.",
    "Heat the avocado oil in a large skillet over medium. Brown the beef with the garlic, ginger, salt and pepper, about 5 minutes.",
    "Add the cabbage and carrot; toss over high heat until just wilted.",
    "Pour the sauce over, add the green onions, and toss to coat.",
    "Finish with sesame seeds."
  ],
  leftovers: "Buy one large cabbage on Saturday — it covers today, Tuesday, Thursday and Friday."
},
{
  day: 16, date: "2026-08-16", dow: "Sunday", week: 3, protein: "chicken",
  title: "Ginger-Scallion Chicken Thighs + Bok Choy",
  blurb: "Crisp-skinned thighs with a raw ginger-scallion oil spooned over at the end — no cooking of the sauce, just hot oil poured onto aromatics.",
  source: ORIGINAL,
  time: "40 min", active: "20 min", serves: 4, cost: "~$2.30/serving",
  art: { protein: "chicken-thigh", veg: ["bokchoy", "onion"], sauce: "green" },
  tags: ["crispy skin", "sheet pan", "big flavor"],
  swaps: ["Traditionally made with a neutral seed oil — avocado oil has the high smoke point you need and is compliant.", "Coconut aminos in place of soy."],
  ingredients: [
    { g: "Chicken", i: ["6 bone-in skin-on chicken thighs", "1 Tbsp avocado oil", "Kosher salt & pepper"] },
    { g: "Ginger-scallion oil", i: ["6 green onions, finely sliced", "3 Tbsp fresh ginger, grated", "½ tsp salt", "⅓ cup avocado oil", "1 Tbsp coconut aminos", "1 tsp rice vinegar"] },
    { g: "Bok choy", i: ["1½ lb baby bok choy, halved", "1 Tbsp avocado oil", "3 garlic cloves, sliced", "Splash of coconut aminos"] }
  ],
  steps: [
    "Heat oven to 425°F. Pat the thighs bone-dry, salt them well, and set skin-side up on a sheet pan. Roast 35–40 minutes until the skin crackles.",
    "Put the green onions, ginger and salt in a heatproof bowl.",
    "Heat the ⅓ cup avocado oil until it shimmers and just begins to smoke, then pour it directly over the aromatics — it should hiss loudly. Stir in the aminos and vinegar.",
    "Sear the bok choy cut-side down in a hot skillet 3 minutes, add garlic and a splash of aminos, cover 2 minutes.",
    "Spoon the ginger-scallion oil generously over the chicken."
  ],
  leftovers: "The ginger-scallion oil keeps a week in the fridge and improves everything it touches."
},
{
  day: 17, date: "2026-08-17", dow: "Monday", week: 3, protein: "lamb",
  title: "Lamb Larb Lettuce Cups",
  blurb: "Bright, hot, sour and herby — Thai-style minced lamb with lime, mint and chili. Fifteen minutes and no oven in August.",
  source: ORIGINAL,
  time: "20 min", active: "20 min", serves: 4, cost: "~$3.50/serving",
  art: { protein: "lamb-crumble", veg: ["greens", "onion", "lime", "cucumber"] },
  tags: ["20 min", "no oven", "fresh herbs"],
  swaps: ["Traditional larb uses toasted rice powder — out. Toasted almond flour or crushed cashews give you the same nutty texture.", "Check the fish sauce label: Red Boat and Three Crabs are sugar-free, many others add it."],
  ingredients: [
    { g: "Larb", i: ["1 lb ground lamb", "1 Tbsp avocado oil", "3 shallots or ½ red onion, thinly sliced", "3 garlic cloves, minced", "3 Tbsp fish sauce (no sugar added)", "3 limes, juiced", "1–2 tsp chili flakes", "2 Tbsp toasted almond flour (optional)"] },
    { g: "Herbs & cups", i: ["1 cup fresh mint leaves", "1 cup cilantro", "4 green onions, sliced", "1 head butter lettuce, leaves separated", "1 cucumber, sliced"] }
  ],
  steps: [
    "Brown the lamb hard in the avocado oil over high heat — you want crisp edges, not steamed meat. Break it up as it goes.",
    "Add the shallot and garlic in the last 2 minutes.",
    "Take the pan off the heat. Stir in the fish sauce, lime juice and chili flakes.",
    "Fold in the mint, cilantro, green onions and the almond flour if using. Taste — it should be sour and salty in equal measure. Adjust with more lime.",
    "Spoon into lettuce cups with cucumber slices alongside."
  ],
  leftovers: null
},
{
  day: 18, date: "2026-08-18", dow: "Tuesday", week: 3, protein: "meatballs",
  title: "Sticky Coconut-Amino Meatballs + Broccoli",
  blurb: "The glaze reduces to something genuinely sticky without a gram of sugar — coconut aminos, ginger, garlic and a long simmer.",
  source: ORIGINAL,
  time: "25 min", active: "15 min", serves: 4, cost: "~$3.00/serving",
  art: { protein: "meatball", veg: ["broccoli", "onion"], sauce: "brown" },
  tags: ["25 min", "one pan", "kid-friendly"],
  swaps: ["No honey, no brown sugar. Reduce the aminos by half and they thicken on their own.", "Roast the broccoli hard — 425°F, charred edges."],
  ingredients: [
    { g: "Meatballs", i: ["1 lb compliant pre-made meatballs", "1 Tbsp avocado oil"] },
    { g: "Glaze", i: ["⅓ cup coconut aminos", "2 Tbsp rice vinegar (unseasoned)", "1 Tbsp fresh grated ginger", "3 garlic cloves, minced", "½ tsp chili flakes", "½ tsp toasted sesame oil (optional)"] },
    { g: "Broccoli", i: ["2 heads broccoli, in florets", "2 Tbsp avocado oil", "Salt", "2 green onions, sliced", "1 Tbsp sesame seeds"] }
  ],
  steps: [
    "Heat oven to 425°F. Toss the broccoli with oil and salt; roast 20 minutes until the edges blacken.",
    "Brown the meatballs in avocado oil in a skillet over medium-high, about 5 minutes.",
    "Add the aminos, vinegar, ginger, garlic and chili flakes. Simmer 8–10 minutes, turning the meatballs, until the glaze coats the back of a spoon.",
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
  swaps: ["Cornstarch slurry → out. Reduce the sauce instead; it clings fine.", "Freeze the steak 20 minutes before slicing — it makes thin slices far easier."],
  ingredients: [
    { g: "Steak", i: ["1¼ lb sirloin, sliced thin against the grain", "1 Tbsp avocado oil", "Salt & pepper"] },
    { g: "Vegetables", i: ["10 oz cremini mushrooms, sliced", "¾ lb green beans, cut in half", "½ onion, sliced", "4 garlic cloves, minced", "1 Tbsp fresh ginger, grated"] },
    { g: "Sauce", i: ["¼ cup coconut aminos", "1 Tbsp rice vinegar", "½ cup beef broth", "½ tsp chili flakes", "Black pepper"] }
  ],
  steps: [
    "Pat the sliced steak very dry and season it. Get a large skillet as hot as it goes.",
    "Sear the steak in two batches, 60–90 seconds each, and pull it out. Crowding the pan is the one mistake that ruins this.",
    "Add the mushrooms to the same pan and cook undisturbed 3 minutes, then toss and cook 3 more until browned.",
    "Add the green beans and onion; cook 4 minutes. Add the garlic and ginger for 30 seconds.",
    "Pour in the sauce and let it reduce by half, 3–4 minutes.",
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
  swaps: ["Ground turkey → ground beef.", "Soy sauce → coconut aminos. Water chestnuts are starchy — leave them out and add more mushroom for texture.", "Serve as-is or in lettuce cups; skip the cauliflower rice, it doesn't need it."],
  ingredients: [
    { g: "Skillet", i: ["1 lb ground beef", "1 Tbsp avocado oil", "8 oz mushrooms, sliced", "½ head green cabbage, shredded", "4 garlic cloves, minced", "1 Tbsp fresh ginger, grated", "4 green onions, sliced"] },
    { g: "Sauce", i: ["3 Tbsp coconut aminos", "1 Tbsp rice vinegar", "½ tsp white pepper", "½ tsp toasted sesame oil (optional)", "Sugar-free chili garlic sauce to taste"] }
  ],
  steps: [
    "Brown the beef in avocado oil over medium-high; drain excess fat.",
    "Add the mushrooms and cook 4 minutes until they release and reabsorb their liquid.",
    "Stir in the garlic and ginger for 30 seconds.",
    "Add the cabbage in handfuls, tossing until it collapses — about 5 minutes. Keep some bite.",
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
  swaps: ["Bottled sesame dressing is sugar and soybean oil — the dressing below takes two minutes.", "Almonds instead of crispy noodles for the crunch."],
  ingredients: [
    { g: "Chicken", i: ["1¼ lb boneless skinless chicken thighs", "1 Tbsp avocado oil", "Salt, pepper, ½ tsp ground ginger"] },
    { g: "Salad", i: ["½ head green cabbage, finely shredded", "3 green onions, sliced", "1 cup cilantro, chopped", "1 cup mint leaves", "½ cup sliced almonds, toasted", "1 Tbsp sesame seeds"] },
    { g: "Dressing", i: ["3 Tbsp avocado oil", "2 limes, juiced", "1 Tbsp coconut aminos", "1 Tbsp fresh ginger, grated", "1 garlic clove, grated", "½ tsp chili flakes", "Salt"] }
  ],
  steps: [
    "Season the thighs and sear in avocado oil over medium-high, 5–6 minutes per side. Rest, then slice.",
    "Shake all the dressing ingredients together in a jar.",
    "Toss the cabbage, green onions, cilantro and mint with about two-thirds of the dressing.",
    "Top with the sliced chicken, the rest of the dressing, toasted almonds and sesame seeds."
  ],
  leftovers: null
},

/* ========== WEEK 4 — STEAKHOUSE ========== */
{
  day: 22, date: "2026-08-22", dow: "Saturday", week: 4, protein: "steak",
  title: "Reverse-Sear Steak, Garlic Mushrooms, Asparagus",
  blurb: "The reverse sear — low oven first, screaming skillet second — gives you edge-to-edge pink and a hard crust. It is nearly impossible to overcook this way.",
  source: ORIGINAL,
  time: "50 min", active: "20 min", serves: 4, cost: "~$5.50/serving",
  art: { protein: "steak", veg: ["mushroom", "asparagus"], sauce: "green" },
  tags: ["steak night", "technique", "weekend"],
  swaps: ["Butter basting → baste with olive oil, garlic and thyme instead. Same effect, no dairy.", "Use the chimichurri from Aug 5 if any is left."],
  ingredients: [
    { g: "Steak", i: ["2 thick-cut ribeyes or strip steaks (1½–2 in)", "Kosher salt", "Coarse black pepper", "1 Tbsp avocado oil", "4 garlic cloves, smashed", "4 sprigs thyme", "2 Tbsp olive oil for basting"] },
    { g: "Mushrooms", i: ["1 lb cremini mushrooms, halved", "2 Tbsp olive oil", "4 garlic cloves, sliced", "2 sprigs thyme", "Salt"] },
    { g: "Asparagus", i: ["1 lb asparagus, trimmed", "1 Tbsp olive oil", "Lemon, salt, pepper"] }
  ],
  steps: [
    "Salt the steaks generously and leave them uncovered on a rack in the fridge for up to 24 hours (or 45 minutes on the counter).",
    "Heat oven to 250°F. Roast the steaks on a rack until they read 115°F for medium-rare, 25–35 minutes. Pull them.",
    "Roast the asparagus at the same time, tossed with oil and salt, 12 minutes.",
    "Get a cast-iron skillet smoking hot with the avocado oil. Sear the steaks 45–60 seconds per side.",
    "Add the garlic, thyme and olive oil to the pan and baste the steaks by spooning the hot oil over them for 30 seconds.",
    "Rest 8 minutes. Meanwhile sear the mushrooms in the same pan until deeply browned. Slice the steak and serve."
  ],
  leftovers: "Cold sliced steak on greens is Monday's lunch."
},
{
  day: 23, date: "2026-08-23", dow: "Sunday", week: 4, protein: "chicken",
  title: "Roasted Chicken & Vegetables",
  blurb: "A clean 5 stars. Radishes and cauliflower replace the potatoes and roast to the same soft, caramelized place — roasted radishes lose all their sharpness.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/roasted-chicken-and-vegetables/", 5.0, 33),
  time: "1 hr 20 min", active: "15 min", serves: 4, cost: "~$2.60/serving",
  art: { protein: "chicken-thigh", veg: ["cauliflower", "radish", "onion"] },
  tags: ["one dish", "hands-off", "Sunday cook"],
  swaps: ["24 oz baby potatoes → 1 lb radishes, halved, plus ½ head cauliflower in florets.", "Keep the carrots to one, cut small — they're the highest-carb thing on the pan."],
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
  swaps: ["Breadcrumb binder → 1 egg and 2 Tbsp almond flour, or nothing at all.", "Flour-thickened gravy → reduce the broth by two-thirds instead. It takes 8 minutes and tastes better.", "Worcestershire usually contains sugar — use coconut aminos plus ½ tsp Dijon."],
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
    "Simmer hard until reduced by about two-thirds, 8–10 minutes. Return the patties and any juices; simmer 3 minutes.",
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
  swaps: ["If the freezer stash is gone, 1¼ lb fresh ground lamb makes patties in the same time.", "Make a fresh half-batch of chimichurri — it takes five minutes and it's worth it."],
  ingredients: [
    { g: "Meatballs", i: ["15 frozen lamb meatballs from Aug 2"] },
    { g: "Quick chimichurri", i: ["½ cup mint, chopped", "¼ cup parsley, chopped", "1 garlic clove", "½ Tbsp red wine vinegar", "¼ cup olive oil", "Salt, red pepper flakes"] },
    { g: "Herb salad", i: ["5 oz arugula or mixed greens", "1 cucumber, sliced", "1 pint cherry tomatoes, halved", "¼ red onion, thin", "Olive oil, lemon, salt"] }
  ],
  steps: [
    "Heat oven to 375°F. Spread the frozen meatballs on a sheet pan — no need to thaw.",
    "Bake 22–25 minutes until heated through to 165°F.",
    "Chop the herbs and garlic and stir together with the vinegar, oil, salt and pepper flakes.",
    "Dress the greens, cucumber, tomato and onion with olive oil, lemon and salt.",
    "Pile the meatballs over the salad and spoon chimichurri across."
  ],
  leftovers: null
},
{
  day: 26, date: "2026-08-26", dow: "Wednesday", week: 4, protein: "meatballs",
  title: "Meatballs with Blistered Tomatoes & Basil",
  blurb: "Cherry tomatoes roasted at high heat until they burst and turn jammy. That's the sauce — nothing added, no sugar needed.",
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
  swaps: ["Butter-mounted pan sauce → reduce broth with lemon and finish with a swirl of olive oil off the heat.", "Almondine is classically butter and almonds — olive oil and almonds gets you 90% of the way."],
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
    "Toast the almonds dry in a second pan, remove, then cook the green beans in olive oil 6–7 minutes. Add the almonds, lemon and salt.",
    "Return the chicken to the sauce, spoon it over, and serve."
  ],
  leftovers: null
},
{
  day: 28, date: "2026-08-28", dow: "Friday", week: 4, protein: "beef",
  title: "Unstuffed Zucchini Skillet",
  blurb: "Budget Bytes' 4.92-star zucchini boats, deconstructed into a skillet — all the flavor, none of the hollowing out, and forty fewer minutes.",
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
    "Add the zucchini and cook 6–8 minutes, until just tender — stop before it goes soft.",
    "Toast the almond flour in a dry pan until golden, about 2 minutes.",
    "Scatter the toasted almond flour and torn basil over the top."
  ],
  leftovers: null
},

/* ========== WEEK 5 — GREATEST HITS ========== */
{
  day: 29, date: "2026-08-29", dow: "Saturday", week: 5, protein: "lamb",
  title: "Lamb Shakshuka",
  blurb: "4.94 stars from 530 reviews, compliant exactly as written, with browned ground lamb folded into the tomato base. Breakfast, lunch or dinner.",
  source: S("Downshiftology", "https://downshiftology.com/recipes/shakshuka/", 4.94, 530),
  time: "35 min", active: "20 min", serves: 6, cost: "~$2.60/serving",
  art: { protein: "lamb-crumble", veg: ["tomato", "pepper", "egg", "onion"], sauce: "red" },
  tags: ["one pan", "eggs", "any meal"],
  swaps: ["Nothing in the base needs changing — olive oil, onion, pepper, garlic, tomatoes, eggs.", "Skip the bread for dipping. Roasted zucchini planks scoop just as well.", "The lamb is my addition; the recipe is vegetarian as published."],
  ingredients: [
    { g: "Base", i: ["2 Tbsp olive oil", "1 lb ground lamb", "1 medium onion, diced", "1 red bell pepper, diced", "4 garlic cloves, finely chopped", "2 tsp paprika", "1 tsp cumin", "¼ tsp chili powder", "1 (28 oz) can whole peeled tomatoes", "Salt & pepper"] },
    { g: "Finish", i: ["6 large eggs", "1 small bunch cilantro, chopped", "1 small bunch parsley, chopped"] }
  ],
  steps: [
    "Brown the lamb in the olive oil in a large sauté pan over medium-high. Remove it, leaving the fat behind.",
    "Add the bell pepper and onion to the pan; cook 5 minutes until the onion turns translucent.",
    "Stir in the garlic, paprika, cumin and chili powder; cook 1 minute more.",
    "Pour in the tomatoes with their juice, breaking them up with a spoon. Return the lamb, season, and simmer 10 minutes.",
    "Make six wells in the sauce and crack an egg into each. Cover and cook 5–8 minutes, until the whites set and the yolks are still loose.",
    "Scatter cilantro and parsley over the top and bring the pan to the table."
  ],
  leftovers: "The tomato base keeps 4 days. Reheat and crack fresh eggs into it."
},
{
  day: 30, date: "2026-08-30", dow: "Sunday", week: 5, protein: "chicken",
  title: "Lemon-Pepper Chicken, No Flour",
  blurb: "4.93 stars from 99 reviews. Skipping the flour dredge costs you nothing — a dry, well-seasoned thigh in a hot pan browns beautifully on its own.",
  source: S("Budget Bytes", "https://www.budgetbytes.com/easy-lemon-pepper-chicken/", 4.93, 99),
  time: "30 min", active: "30 min", serves: 4, cost: "~$1.90/serving",
  art: { protein: "chicken-breast", veg: ["greens", "lemon", "cucumber"], sauce: "brown" },
  tags: ["30 min", "pan sauce", "last night"],
  swaps: ["2 Tbsp all-purpose flour → skip it. Pat the chicken dry and season directly.", "1 Tbsp butter → 1 Tbsp olive oil swirled in off the heat.", "Check your lemon pepper blend for sugar and starchy anti-caking agents — or just use lemon zest, coarse pepper and salt."],
  ingredients: [
    { g: "Chicken", i: ["1⅓ lb boneless skinless chicken thighs or breasts", "1 Tbsp lemon pepper seasoning (or 2 tsp zest + 1 tsp coarse pepper + ½ tsp salt)", "1 Tbsp avocado oil"] },
    { g: "Pan sauce", i: ["1 garlic clove, minced", "½ cup chicken broth", "1 tsp lemon juice", "1 Tbsp olive oil", "1 Tbsp chopped parsley", "⅛ tsp cracked black pepper"] },
    { g: "Big salad", i: ["6 oz mixed greens", "1 cucumber", "1 avocado", "¼ red onion", "Olive oil, lemon, salt"] }
  ],
  steps: [
    "Pat the chicken completely dry and season both sides with the lemon pepper.",
    "Heat the avocado oil in a skillet over medium. Cook 5–6 minutes per side until golden. Set aside.",
    "Add the garlic to the pan for 1 minute, then the broth. Whisk up all the browned bits.",
    "Add the lemon juice and simmer 3–5 minutes until slightly syrupy.",
    "Off the heat, swirl in the olive oil.",
    "Return the chicken, spoon the sauce over, garnish with parsley. Serve with the dressed salad."
  ],
  leftovers: null
}
];

/* ============================================================
   GROCERY LISTS — five trips
   ============================================================ */

const GROCERIES = [
{
  trip: 1, week: 1, when: "Shop Fri Jul 31 or Sat Aug 1", covers: "Aug 1 – 7",
  est: "$105 – $125",
  note: "Biggest trip of the month because the pantry gets built today. Weeks 2–5 are far lighter.",
  sections: [
    { name: "Meat", items: [
      "6 bone-in, skin-on chicken thighs (~2½ lb)", "2¾ lb boneless skinless chicken thighs",
      "1½ lb ground lamb (15–20% fat)", "1 lb ground beef",
      "1¼ lb sirloin or flank steak", "1 lb pre-made meatballs — read the label, see Rules"
    ]},
    { name: "Produce", items: [
      "3 zucchini", "1 yellow squash", "2 pints cherry or grape tomatoes", "3 large tomatoes",
      "2 red onions", "1 yellow bell pepper", "2 English cucumbers", "1 lb green beans",
      "2 heads broccoli", "1 large head cauliflower", "1 bunch green onions",
      "2 heads garlic", "4 lemons", "2 bunches flat-leaf parsley", "1 bunch mint", "1 bunch cilantro"
    ]},
    { name: "Pantry — buy once, lasts all month", items: [
      "Extra-virgin olive oil (large bottle — you'll use most of it)", "Avocado oil (for high heat)",
      "Red wine vinegar", "Dijon mustard (check: no sugar)", "Kalamata olives, pitted",
      "Crushed tomatoes, no sugar added (28 oz × 2)", "Almond flour",
      "Kosher salt", "Coarse black pepper", "Dried oregano", "Dried thyme", "Dried rosemary",
      "Dried basil", "Ground cumin", "Paprika", "Garlic powder", "Onion powder",
      "Ground cinnamon", "Ground cloves", "Red pepper flakes", "1 dozen eggs"
    ]}
  ]
},
{
  trip: 2, week: 2, when: "Shop Sat Aug 8", covers: "Aug 8 – 14",
  est: "$75 – $90",
  note: "Buy the avocados at different ripenesses — two ready now, three still firm for Thursday and Friday.",
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
  trip: 3, week: 3, when: "Shop Sat Aug 15", covers: "Aug 15 – 21",
  est: "$80 – $95",
  note: "One large cabbage covers four dinners. Buy a big knob of ginger — it's in five of the seven nights.",
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
      "Toasted sesame oil — optional, see the Rules note", "Beef broth (32 oz)"
    ]}
  ]
},
{
  trip: 4, week: 4, when: "Shop Sat Aug 22", covers: "Aug 22 – 28",
  est: "$105 – $125",
  note: "Heaviest meat spend — the ribeyes drive it. Petite sirloin or a thick strip steak cuts $15 off with no change to the method.",
  sections: [
    { name: "Meat", items: [
      "2 thick-cut ribeye or strip steaks (1½–2 in)",
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
  trip: 5, week: 5, when: "Shop Sat Aug 29 — small top-up", covers: "Aug 29 – 30",
  est: "$25 – $35",
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

const PREP = [
  { w: 1, day: "Sunday Aug 2", items: [
    "Make the full 30 lamb meatballs. Freeze 15 flat in a bag — they become dinner on Aug 25.",
    "Double the chimichurri on Aug 5; it keeps a week and lands on Aug 22's steak.",
    "Rice the whole cauliflower at once on Aug 6 and refrigerate what you don't use."
  ]},
  { w: 2, day: "Sunday Aug 9", items: [
    "Rice the full head of cauliflower — Sunday and Tuesday both use it.",
    "Mix a double batch of the scratch taco seasoning; it covers Aug 10, 13 and 14.",
    "Cook all 1½ lb of fajita chicken on Saturday. Friday's salad is the leftovers."
  ]},
  { w: 3, day: "Saturday Aug 15", items: [
    "Shred the entire cabbage head on Saturday and store it in a bag with a paper towel. Four dinners draw from it.",
    "Grate a big knob of ginger and keep it in a jar under a little avocado oil.",
    "Make the ginger-scallion oil on Sunday — it keeps a week and lifts anything you put it on."
  ]},
  { w: 4, day: "Friday Aug 21", items: [
    "Salt the ribeyes and leave them uncovered on a rack in the fridge overnight for Saturday. This is the single biggest upgrade to the steak.",
    "Move the frozen lamb meatballs to the fridge on Monday night for Tuesday.",
    "Clean and halve all the mushrooms at once — three dinners this week use them."
  ]},
  { w: 5, day: "Friday Aug 28", items: [
    "Check what's left: half-used herbs, greens, lemons. Both remaining dinners are designed to absorb them.",
    "The shakshuka tomato base can be made a day ahead and reheated with fresh eggs cracked in."
  ]}
];

const MEATBALL_NOTE = {
  title: "About the pre-made meatballs",
  body: "This is the one ingredient that needs real label-reading. The large majority of supermarket meatballs contain breadcrumbs and grated cheese, and many add sugar, dextrose or soybean oil on top of that — so most of the freezer case is out.",
  look: [
    "No breadcrumbs, panko, cracker meal, wheat, rice flour or textured soy",
    "No cheese, romano, parmesan, whey or milk solids",
    "No sugar, dextrose, corn syrup solids or maltodextrin",
    "No soybean, canola, sunflower or generic vegetable oil"
  ],
  where: "Verified while building this plan: Trader Joe's Chicken Meatballs are gluten-free and made with chicken plus simple dried seasonings (sea salt, oregano, basil, vinegar powder, garlic and onion powder, rosemary, pepper, parsley). Trader Joe's Turkey Meatballs are not — they contain breadcrumbs, soy and corn syrup solids. Paleo and Whole30-labeled brands in the freezer aisle are the most reliable place to look, though they cost more. I could not verify ingredient panels for every regional brand, so check the bag you actually buy against the four rules above.",
  fallback: "If nothing at your store qualifies, roll your own: 1 lb ground beef, 1 egg, 2 Tbsp almond flour, 2 minced garlic cloves, 1 tsp each salt, oregano and onion powder. Bake at 400°F for 20 minutes. One batch covers a meatball night, and a double batch freezes for the rest of the month."
};
