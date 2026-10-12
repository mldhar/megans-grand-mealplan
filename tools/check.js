#!/usr/bin/env node
/* ============================================================
   Checks the plan against its own promises:

     - every month runs night after night with no gaps, and each
       night's date and weekday agree
     - every ingredient and every shopping line keeps the four rules
     - every plate that lists its protein meets 70g his, 45g hers
     - every night-before job falls in the fortnight before its night
     - every shopping trip, prep note and night points at a real week
     - the calendar files still match data.js
     - the page and the README quote the right totals
     - every script parses and every file the page or the offline
       copy asks for exists

   Run from the repository root before committing a change:
     node tools/check.js
   It prints every problem it finds and exits 1 if there are any.
   GitHub runs it on every push and pull request.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");
const problems = [];
const fail = (where, what) => problems.push(`${where}: ${what}`);

/* ---------- every script parses ---------- */
const scripts = ["data.js", "fx.js", "app.js", "sw.js", ...fs.readdirSync(path.join(ROOT, "tools")).filter(f => f.endsWith(".js")).map(f => `tools/${f}`)];
for (const f of scripts) {
  try { new vm.Script(read(f), { filename: f }); }
  catch (e) { fail(f, `does not parse: ${e.message}`); }
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(read("data.js") + "\n;this.PLAN_MONTHS = PLAN_MONTHS; this.PROTEINS = PROTEINS;", ctx);
const { PLAN_MONTHS, PROTEINS } = ctx;

// August was written as a 30-night plan, so Aug 31 has no dinner
const KNOWN_GAPS = { sep: "2026-08-31" };

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const utc = (iso) => new Date(iso + "T12:00:00Z");
const addDays = (iso, n) => { const d = utc(iso); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const between = (a, b) => Math.round((utc(b) - utc(a)) / 86400000);
const isISO = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && utc(s).toISOString().slice(0, 10) === s;

/* ---------- the four rules ----------
   Ingredient lists and shopping lines only: steps and swaps name the
   things that came out ("the butter comes out"), so they would only
   ever cry wolf. Phrases that say an item is absent ("no sugar added",
   "sugar-free", "(check: no cornstarch)") are removed before matching. */
const RULE_BREAKS = [
  ["dairy", /\b(?<!(?:almond|nut|cocoa|coconut|sunflower|seed) )butter(?! (?:or \w+ )?lettuce)|\bghee\b|\bcheese|\bparmesan|\bparmigiano|\bpecorino|\bfeta\b|\bmozzarella|\bcheddar|\bricotta|\b(?<!coconut )yogh?urt(?! replacement)|\b(?<!coconut |sour |the )cream(?! of tartar)|\bsour cream|\b(?<!coconut |almond )milk\b|\bwhey\b/],
  ["grain or starch", /\b(?<!cauliflower |broccoli )rice\b(?! vinegar)|\bpasta\b|\bspaghetti|\b(?<!zucchini |squash |cucumber )noodles?\b|\bbread\b|\bbreadcrumbs?|\bpanko|\btortillas?|\b(?<!almond |coconut )flour\b|\bpotato(?:es)?\b|\bcorn\b|\bcornstarch|\bcornmeal|\bpolenta|\b(?<!green |wax |string )beans?\b|\blentils?|\bchickpeas?|\bquinoa|\boats?\b|\barrowroot|\btapioca|\bcouscous|\bbarley|\bfarro|\bpita\b|\bcrackers?\b/],
  ["added sugar", /\bsugar\b|\bhoney\b|\bmaple\b|\bagave|\bmolasses|\bketchup|\bbbq sauce|\bbarbecue sauce|\bteriyaki|\bhoisin|\bsweet chili|\bbalsamic/],
  ["seed oil", /\bcanola|\bsoybean|\bsunflower oil|\bsafflower|\bgrapeseed|\bcottonseed|\brice bran|\bvegetable oil|\bcorn oil|\bpeanut oil|\b(?<!avocado[- ]oil )mayo(?:nnaise)?\b/]
];
const absent = (s) => s.toLowerCase()
  .replace(/\((?:check|read)[^)]*\)/g, "")
  .replace(/\b(?:no|without|zero)[- ](?:added[- ])?(?:\w+[- ])?\w+(?:[- ]added)?/g, "")
  .replace(/\b[\w-]+-free\b/g, "")
  .replace(/\bunsweetened\b/g, "");
function rules(where, line) {
  const s = absent(line);
  for (const [rule, re] of RULE_BREAKS) {
    const m = s.match(re);
    if (m) fail(where, `"${m[0]}" breaks the ${rule} rule in "${line}"`);
  }
}

/* ---------- the months ---------- */
let prevLast = null, nights = 0, sourced = 0;
const keys = new Set();
for (const m of PLAN_MONTHS) {
  const M = m.key;
  if (keys.has(M)) fail(M, "month key used twice");
  keys.add(M);
  for (const f of ["key", "label", "short", "title", "span", "first", "last", "weeks", "days", "groceries", "prep"]) {
    if (m[f] == null) fail(M, `missing ${f}`);
  }
  if (!isISO(m.first) || !isISO(m.last)) { fail(M, "first and last must be YYYY-MM-DD dates"); continue; }
  if (prevLast && m.first !== addDays(prevLast, 1) && !(KNOWN_GAPS[M] === addDays(prevLast, 1) && m.first === addDays(prevLast, 2))) fail(M, `starts ${m.first}, but the month before ends ${prevLast}`);
  prevLast = m.last;

  const span = between(m.first, m.last) + 1;
  if (m.days.length !== span) fail(M, `${m.days.length} nights for a ${span}-day month`);
  const weekNs = new Set(m.weeks.map(w => w.n));
  m.weeks.forEach((w, i) => { if (w.n !== i + 1) fail(M, `week ${i + 1} is numbered ${w.n}`); });

  let prevWeek = 0;
  m.days.forEach((d, i) => {
    const at = `${M}-${i + 1}`;
    nights++;
    if (d.day !== i + 1) fail(at, `numbered day ${d.day}`);
    if (d.date !== addDays(m.first, i)) fail(at, `dated ${d.date}, expected ${addDays(m.first, i)}`);
    else if (d.dow !== DOW[utc(d.date).getUTCDay()]) fail(at, `${d.date} is a ${DOW[utc(d.date).getUTCDay()]}, not a ${d.dow}`);
    if (!weekNs.has(d.week)) fail(at, `in week ${d.week}, which ${M} does not have`);
    if (d.week < prevWeek) fail(at, `week ${d.week} comes after week ${prevWeek}`);
    prevWeek = d.week;
    if (!PROTEINS[d.protein]) fail(at, `unknown protein "${d.protein}"`);
    for (const f of ["title", "blurb", "time", "active"]) if (!d[f]) fail(at, `missing ${f}`);
    if (!d.ingredients || !d.ingredients.length) fail(at, "no ingredients");
    if (!d.steps || d.steps.length < 3) fail(at, "fewer than three steps");
    if (d.protein_g && (d.protein_g.him < 70 || d.protein_g.her < 45)) {
      fail(at, `${d.protein_g.him}g/${d.protein_g.her}g is under the 70g/45g protein floor`);
    }
    const s = d.source || {};
    if (s.url) {
      sourced++;
      if (!/^https:\/\/[^\s]+$/.test(s.url)) fail(at, `source link "${s.url}" is not an https address`);
      if (s.rating != null && !(s.rating > 0 && s.rating <= 5)) fail(at, `rating ${s.rating} is not between 0 and 5`);
      if (s.reviews != null && !(Number.isInteger(s.reviews) && s.reviews > 0)) fail(at, `review count ${s.reviews} is not a whole number`);
    }
    for (const g of d.ingredients || []) for (const line of g.i) rules(at, line);
  });

  m.groceries.forEach((t, i) => {
    const at = `${M} trip ${i + 1}`;
    if (!weekNs.has(t.week)) fail(at, `for week ${t.week}, which ${M} does not have`);
    const est = /^\$(\d+) to \$(\d+)$/.exec(t.est || "");
    if (!est) fail(at, `estimate "${t.est}" should read like "$95 to $115"`);
    else if (+est[1] > +est[2]) fail(at, `estimate "${t.est}" runs backwards`);
    for (const sec of t.sections) for (const line of sec.items) rules(at, line);
  });
  for (const p of m.prep) if (!weekNs.has(p.w)) fail(`${M} prep`, `note for week ${p.w}, which ${M} does not have`);

  const seen = new Set();
  for (const a of m.ahead || []) {
    const at = `${M} night-before ${a.on}`;
    const d = m.days.find(x => x.day === a.night);
    if (!isISO(a.on)) { fail(at, "not a YYYY-MM-DD date"); continue; }
    if (!d) { fail(at, `for night ${a.night}, which ${M} does not have`); continue; }
    const lead = between(a.on, d.date);
    // a butcher's order can go in up to two weeks ahead
    if (lead < 0 || lead > 14) fail(at, `is ${lead} days before ${M}-${a.night}; it should be 0 to 14`);
    if (!a.title || !a.detail) fail(at, "needs a title and a detail");
    if (seen.has(`${a.on}/${a.night}`)) fail(at, `listed twice for ${M}-${a.night}`);
    seen.add(`${a.on}/${a.night}`);
  }
}

/* ---------- the calendar files match data.js ----------
   Rebuilt from the first dinner in the committed dinners.ics, which is
   the --from date they were made with. */
const { build } = require("./make-calendar.js");
const first = /DTSTART;VALUE=DATE:(\d{4})(\d{2})(\d{2})/.exec(read("dinners.ics"));
if (!first) fail("dinners.ics", "has no dinners in it");
else {
  const from = `${first[1]}-${first[2]}-${first[3]}`;
  const fresh = build(from);
  for (const f of ["prep-reminders.ics", "dinners.ics"]) {
    if (read(f) !== fresh[f]) fail(f, `out of date with data.js: run  node tools/make-calendar.js --from ${from}`);
  }
}

/* ---------- the copy quotes the right totals ---------- */
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
for (const f of ["index.html", "README.md"]) {
  const s = read(f);
  for (const m of s.matchAll(/\b(\d{3}) (?:dinners|nights)\b/g)) {
    if (+m[1] !== nights) fail(f, `says "${m[0]}"; the plan has ${nights}`);
  }
  for (const m of s.matchAll(/\b(\d+) sourced\b/g)) {
    if (+m[1] !== sourced) fail(f, `says "${m[0]}"; the plan has ${sourced} sourced nights`);
  }
  for (const m of s.matchAll(/\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve) months\b/gi)) {
    if (WORDS.indexOf(m[1].toLowerCase()) !== PLAN_MONTHS.length) fail(f, `says "${m[0]}"; the plan has ${PLAN_MONTHS.length}`);
  }
}

/* ---------- every file asked for exists ---------- */
const local = (u) => !/^(?:[a-z]+:|\/\/|#|data:)/i.test(u);
const exists = (f) => fs.existsSync(path.join(ROOT, f.split(/[?#]/)[0]));
for (const m of read("index.html").matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  if (local(m[1]) && m[1] !== "./" && !exists(m[1])) fail("index.html", `links to ${m[1]}, which is not in the repository`);
}
const core = /const CORE = \[([\s\S]*?)\]/.exec(read("sw.js"));
if (!core) fail("sw.js", "has no CORE list to check");
else for (const m of core[1].matchAll(/"([^"]+)"/g)) {
  if (m[1] !== "./" && !exists(m[1])) fail("sw.js", `keeps ${m[1]} for offline, which is not in the repository`);
}
const manifest = JSON.parse(read("manifest.webmanifest"));
for (const i of manifest.icons || []) if (!exists(i.src)) fail("manifest.webmanifest", `icon ${i.src} is not in the repository`);

/* ---------- report ---------- */
if (problems.length) {
  console.error(`${problems.length} problem${problems.length === 1 ? "" : "s"}:\n` + problems.map(p => `  - ${p}`).join("\n"));
  process.exit(1);
}
console.log(`All good: ${PLAN_MONTHS.length} months, ${nights} nights, ${sourced} sourced, ${PLAN_MONTHS.reduce((a, m) => a + (m.ahead || []).length, 0)} night-before jobs.`);
