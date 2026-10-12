#!/usr/bin/env node
/* ============================================================
   Writes the two calendar files the site links to:

     prep-reminders.ics  every evening the plan asks for something ahead
                         (a rub, a marinade, a freezer move, an early
                         start), at 7pm, with an alert
     dinners.ics         every night's dinner as an all-day event

   Both open in Apple Calendar on an iPhone or a Mac (tap, Add All, pick
   a calendar), and in Google Calendar or Outlook as an import. Times are
   "floating", so 7pm means 7pm wherever the phone is.

   Run from the repository root after changing data.js:
     node tools/make-calendar.js                 # from today onward
     node tools/make-calendar.js --from 2027-01-01

   tools/check.js rebuilds both from the same date and fails if the
   committed files no longer match data.js.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const SITE = "https://mldhar.github.io/megans-grand-mealplan/";
const REMIND_AT = "190000";            // 7pm, local to the phone
const REMIND_MINUTES = 15;

// load data.js the way the browser does, without a browser
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, "data.js"), "utf8") + "\n;this.PLAN_MONTHS = PLAN_MONTHS; this.PROTEINS = PROTEINS;", ctx);
const { PLAN_MONTHS, PROTEINS } = ctx;

/* ---------- iCalendar plumbing (RFC 5545) ---------- */
const ymd = (iso) => iso.replace(/-/g, "");
const nextDay = (iso) => { const d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + 1); return d.toISOString().slice(0, 10); };
const text = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// lines longer than 75 octets fold onto continuation lines that start with a
// space; count bytes, not characters, and never split a multi-byte character
function fold(line) {
  const out = [];
  let cur = "", bytes = 0, limit = 75;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > limit) { out.push(cur); cur = " "; bytes = 1; limit = 75; }
    cur += ch; bytes += b;
  }
  out.push(cur);
  return out.join("\r\n");
}

function calendar(name, events) {
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Megan's Grand Mealplan//Calendar//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${text(name)}`,
    ...events.flat(), "END:VCALENDAR"
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

const nightUrl = (mkey, day) => `${SITE}#${mkey}-${day}`;

function build(FROM) {
  /* ---------- prep reminders ---------- */
  const reminders = [];
  for (const m of PLAN_MONTHS) {
    for (const a of m.ahead || []) {
      if (a.on < FROM) continue;
      const d = m.days.find(x => x.day === a.night);
      const url = nightUrl(m.key, a.night);
      const end = String(Number(REMIND_AT.slice(0, 2)) * 100 + REMIND_MINUTES).padStart(4, "0") + "00";
      const summary = `Prep: ${a.title}`;
      reminders.push([
        "BEGIN:VEVENT",
        `UID:prep-${ymd(a.on)}-${m.key}-${a.night}@mldhar.github.io`,
        `DTSTAMP:${ymd(a.on)}T000000Z`,
        `DTSTART:${ymd(a.on)}T${REMIND_AT}`,
        `DTEND:${ymd(a.on)}T${end}`,
        `SUMMARY:${text(summary)}`,
        `DESCRIPTION:${text(`${a.detail}\n\nFor ${d.dow} ${+d.date.slice(8)} ${m.short}: ${d.title}\n${url}`)}`,
        `URL:${url}`,
        "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${text(summary)}`, "TRIGGER:PT0S", "END:VALARM",
        "END:VEVENT"
      ]);
    }
  }

  /* ---------- every dinner ---------- */
  const dinners = [];
  for (const m of PLAN_MONTHS) {
    for (const d of m.days) {
      if (d.date < FROM) continue;
      const p = PROTEINS[d.protein];
      const facts = [p.label, `${d.time} (${d.active} hands-on)`];
      if (d.protein_g) facts.push(`${d.protein_g.him}/${d.protein_g.her}g protein a plate`);
      const url = nightUrl(m.key, d.day);
      dinners.push([
        "BEGIN:VEVENT",
        `UID:dinner-${m.key}-${d.day}@mldhar.github.io`,
        `DTSTAMP:${ymd(d.date)}T000000Z`,
        `DTSTART;VALUE=DATE:${ymd(d.date)}`,
        `DTEND;VALUE=DATE:${ymd(nextDay(d.date))}`,
        `SUMMARY:${text(`Dinner: ${d.title}`)}`,
        `DESCRIPTION:${text(`${facts.join(" · ")}\n\n${d.blurb}\n\n${url}`)}`,
        `URL:${url}`,
        "TRANSP:TRANSPARENT",
        "END:VEVENT"
      ]);
    }
  }

  return {
    "prep-reminders.ics": calendar("Mealplan prep", reminders),
    "dinners.ics": calendar("Mealplan dinners", dinners),
    counts: [reminders.length, dinners.length]
  };
}

module.exports = { build };

if (require.main === module) {
  const argFrom = process.argv.indexOf("--from");
  const FROM = argFrom > -1 ? process.argv[argFrom + 1] : new Date().toISOString().slice(0, 10);
  const out = build(FROM);
  for (const f of ["prep-reminders.ics", "dinners.ics"]) fs.writeFileSync(path.join(ROOT, f), out[f]);
  console.log(`from ${FROM}: ${out.counts[0]} prep reminders, ${out.counts[1]} dinners`);
}
