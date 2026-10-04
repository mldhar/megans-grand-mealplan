/* ============================================================
   Megan's Grand Mealplan
   Rendering, interaction, and the generated dish illustrations.
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/* deterministic PRNG so a given dish looks identical on every load */
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ============================================================
   PROTEIN MARKS
   Colour alone never carries the tag. Each protein also gets a
   silhouette that reads at 13px: stick-and-ball, blob, squiggles,
   sprig, three spheres.
   ============================================================ */
const GLYPHS = {
  drumstick: '<circle cx="16" cy="8" r="5.7"/><rect x="4.6" y="12.4" width="10" height="3.7" rx="1.85" transform="rotate(45 9.6 14.2)"/><circle cx="5.4" cy="18.6" r="2.7"/>',
  ribeye: '<path d="M3.6 10.4C4.4 5.8 8.8 3 13.8 3.2c4.6.2 7.6 2.8 7.1 6.8-.5 4-2.8 8.2-7 9.6-4.2 1.4-8.2-.2-9.5-3.7-.7-1.9-1-3.7-.8-5.5z"/>',
  grind: '<g fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"><path d="M3 7.5c1.8-2 3.6-2 5.4 0s3.6 2 5.4 0 3.6-2 5.4 0"/><path d="M3 12.4c1.8-2 3.6-2 5.4 0s3.6 2 5.4 0 3.6-2 5.4 0"/><path d="M3 17.3c1.8-2 3.6-2 5.4 0s3.6 2 5.4 0 3.6-2 5.4 0"/></g>',
  sprig: '<path d="M12 21.4V7.6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="4.6" r="2.3"/><ellipse cx="7.9" cy="11.6" rx="3.7" ry="2.1" transform="rotate(-33 7.9 11.6)"/><ellipse cx="16.1" cy="9.6" rx="3.7" ry="2.1" transform="rotate(33 16.1 9.6)"/><ellipse cx="8.3" cy="16.6" rx="3.3" ry="1.9" transform="rotate(-33 8.3 16.6)"/><ellipse cx="15.7" cy="14.8" rx="3.3" ry="1.9" transform="rotate(33 15.7 14.8)"/>',
  spheres: '<circle cx="8.2" cy="8.6" r="4.4"/><circle cx="16.6" cy="10.8" r="4.4"/><circle cx="11.2" cy="17" r="4.4"/>'
};

function glyph(protein, size = 14) {
  const key = (PROTEINS[protein] || {}).glyph;
  if (!GLYPHS[key]) return "";
  return `<svg class="glyph" viewBox="0 0 24 24" width="${size}" height="${size}" fill="currentColor" aria-hidden="true">${GLYPHS[key]}</svg>`;
}

/* protein tag colour comes from a CSS custom property so both themes
   resolve it automatically, never a hard-coded hex in the markup */
const pcVar = (k) => `--pc:var(--p-${k})`;

/* ============================================================
   DISH ILLUSTRATIONS
   Top-down plated food, composed from the day's protein + veg tags.
   ============================================================ */

function blob(cx, cy, r, lumps, wobble, rnd, extra = "") {
  const pts = [];
  for (let i = 0; i < lumps; i++) {
    const a = (i / lumps) * Math.PI * 2;
    const rr = r * (1 - wobble / 2 + rnd() * wobble);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)} `;
  for (let i = 0; i < pts.length; i++) {
    const p0 = pts[i], p1 = pts[(i + 1) % pts.length];
    d += `Q ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} ${((p0[0] + p1[0]) / 2).toFixed(1)} ${((p0[1] + p1[1]) / 2).toFixed(1)} `;
  }
  return `<path d="${d}Z" ${extra}/>`;
}

const rot = (x, y, deg) => `rotate(${deg.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})`;

const PROTEIN_ART = {
  "chicken-thigh": (x, y, rnd, s = 1) => {
    let g = "";
    for (let i = 0; i < 2; i++) {
      const px = x + (i ? 20 : -14) * s, py = y + (i ? 12 : -8) * s, a = -25 + rnd() * 50;
      g += `<g transform="${rot(px, py, a)}">
        <ellipse cx="${px}" cy="${py + 3}" rx="${26 * s}" ry="${19 * s}" fill="rgba(60,32,12,.18)"/>
        <ellipse cx="${px}" cy="${py}" rx="${26 * s}" ry="${19 * s}" fill="url(#gChicken)"/>
        <ellipse cx="${px - 5 * s}" cy="${py - 4 * s}" rx="${13 * s}" ry="${7 * s}" fill="#f0c377" opacity=".55"/>
        <path d="M ${px - 16 * s} ${py + 6 * s} q ${9 * s} ${6 * s} ${22 * s} ${1 * s}" stroke="#8a5220" stroke-width="${2.4 * s}" fill="none" opacity=".7" stroke-linecap="round"/>
      </g>`;
    }
    return g;
  },
  "chicken-breast": (x, y, rnd, s = 1) => {
    let g = "";
    for (let i = 0; i < 5; i++) {
      const px = x - 22 * s + i * 11 * s, py = y + (rnd() - .5) * 12 * s, a = -70 + rnd() * 24;
      g += `<g transform="${rot(px, py, a)}">
        <rect x="${px - 24 * s}" y="${py - 4 * s}" width="${48 * s}" height="${12 * s}" rx="${6 * s}" fill="rgba(60,32,12,.16)"/>
        <rect x="${px - 24 * s}" y="${py - 6 * s}" width="${48 * s}" height="${12 * s}" rx="${6 * s}" fill="url(#gChickenStrip)"/>
        <rect x="${px - 20 * s}" y="${py - 3.5 * s}" width="${16 * s}" height="${3 * s}" rx="${1.5 * s}" fill="#f5d79c" opacity=".6"/>
      </g>`;
    }
    return g;
  },
  "steak": (x, y, rnd, s = 1) => {
    const w = 62 * s, h = 44 * s, a = -14 + rnd() * 28;
    const shape = `M ${x - w / 2} ${y - h / 2 + 6 * s} q ${4 * s} ${-10 * s} ${18 * s} ${-8 * s} l ${w - 30 * s} ${2 * s} q ${14 * s} ${2 * s} ${11 * s} ${16 * s} l ${-3 * s} ${18 * s} q ${-3 * s} ${13 * s} ${-18 * s} ${11 * s} l ${-w + 34 * s} ${-3 * s} q ${-13 * s} ${-3 * s} ${-11 * s} ${-16 * s} Z`;
    let g = `<g transform="${rot(x, y, a)}">
      <path d="${shape}" fill="rgba(50,20,10,.22)" transform="translate(0,3)"/>
      <path d="${shape}" fill="url(#gSteak)"/>`;
    for (let i = 0; i < 4; i++) {
      const ox = x - 22 * s + i * 14 * s;
      g += `<path d="M ${ox} ${y - 15 * s} q ${3 * s} ${14 * s} ${-1 * s} ${28 * s}" stroke="#2e1206" stroke-width="${3.2 * s}" opacity=".42" fill="none" stroke-linecap="round"/>`;
    }
    return g + `<path d="M ${x - 24 * s} ${y + 6 * s} q ${24 * s} ${5 * s} ${48 * s} ${-2 * s}" stroke="#c05c56" stroke-width="${5 * s}" opacity=".5" fill="none" stroke-linecap="round"/></g>`;
  },
  "steak-strips": (x, y, rnd, s = 1) => {
    let g = "";
    for (let i = 0; i < 6; i++) {
      const px = x - 26 * s + i * 10 * s, py = y + (rnd() - .5) * 16 * s, a = -62 + rnd() * 30;
      g += `<g transform="${rot(px, py, a)}">
        <rect x="${px - 22 * s}" y="${py - 3 * s}" width="${44 * s}" height="${10 * s}" rx="${5 * s}" fill="rgba(40,16,8,.2)"/>
        <rect x="${px - 22 * s}" y="${py - 5 * s}" width="${44 * s}" height="${10 * s}" rx="${5 * s}" fill="url(#gSteakStrip)"/>
        <rect x="${px - 17 * s}" y="${py - 2 * s}" width="${22 * s}" height="${3 * s}" rx="${1.5 * s}" fill="#b8635a" opacity=".55"/>
      </g>`;
    }
    return g;
  },
  "meatball": (x, y, rnd, s = 1) => {
    let g = "";
    [[-24, -10], [4, -18], [26, -2], [-12, 16], [16, 20]].forEach(([dx, dy]) => {
      const px = x + dx * s, py = y + dy * s, r = (14 + rnd() * 3) * s;
      g += `<ellipse cx="${px}" cy="${py + 3 * s}" rx="${r}" ry="${r * .9}" fill="rgba(50,24,10,.2)"/>
        <circle cx="${px}" cy="${py}" r="${r}" fill="url(#gMeatball)"/>
        <ellipse cx="${px - r * .3}" cy="${py - r * .35}" rx="${r * .38}" ry="${r * .26}" fill="#e0a06a" opacity=".45"/>
        ${blob(px, py, r * .96, 9, .12, rnd, 'fill="none" stroke="#5e3016" stroke-width="1" opacity=".35"')}`;
    });
    return g;
  },
  "kofta": (x, y, rnd, s = 1) => {
    let g = "";
    for (let i = 0; i < 4; i++) {
      const px = x - 20 * s + (i % 2) * 40 * s, py = y - 14 * s + Math.floor(i / 2) * 28 * s, a = -30 + rnd() * 60;
      g += `<g transform="${rot(px, py, a)}">
        <rect x="${px - 20 * s}" y="${py - 5 * s}" width="${40 * s}" height="${16 * s}" rx="${8 * s}" fill="rgba(50,24,10,.2)"/>
        <rect x="${px - 20 * s}" y="${py - 8 * s}" width="${40 * s}" height="${16 * s}" rx="${8 * s}" fill="url(#gKofta)"/>
        <rect x="${px - 14 * s}" y="${py - 4.5 * s}" width="${16 * s}" height="${3.5 * s}" rx="${1.8 * s}" fill="#d9985e" opacity=".45"/>
      </g>`;
    }
    return g;
  },
  "patty": (x, y, rnd, s = 1) => {
    let g = "";
    for (let i = 0; i < 2; i++) {
      const px = x + (i ? 22 : -20) * s, py = y + (i ? 10 : -8) * s, a = -20 + rnd() * 40;
      g += `<g transform="${rot(px, py, a)}">
        <ellipse cx="${px}" cy="${py + 4 * s}" rx="${30 * s}" ry="${20 * s}" fill="rgba(50,24,10,.2)"/>
        <ellipse cx="${px}" cy="${py}" rx="${30 * s}" ry="${20 * s}" fill="url(#gPatty)"/>
        <ellipse cx="${px}" cy="${py}" rx="${24 * s}" ry="${14 * s}" fill="none" stroke="#48240f" stroke-width="${1.4 * s}" opacity=".3"/>
        <ellipse cx="${px - 7 * s}" cy="${py - 6 * s}" rx="${11 * s}" ry="${5 * s}" fill="#a9673a" opacity=".4"/>
      </g>`;
    }
    return g;
  },
  "beef-crumble": (x, y, rnd, s = 1) => crumble(x, y, rnd, s, "gCrumbleBeef"),
  "lamb-crumble": (x, y, rnd, s = 1) => crumble(x, y, rnd, s, "gCrumbleLamb"),
};

function crumble(x, y, rnd, s, grad) {
  let g = "";
  for (let i = 0; i < 26; i++) {
    const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 40 * s;
    g += blob(x + Math.cos(a) * d, y + Math.sin(a) * d * .8, (3.4 + rnd() * 3.4) * s, 6, .5, rnd,
      `fill="url(#${grad})" opacity="${(.82 + rnd() * .18).toFixed(2)}"`);
  }
  return g;
}

function citrus(x, y, r, rnd, rind, flesh, pith) {
  let g = `<circle cx="${x}" cy="${y}" r="${r}" fill="${rind}"/><circle cx="${x}" cy="${y}" r="${r * .82}" fill="${pith}"/>`;
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * Math.PI * 2 + .1, a1 = a0 + (Math.PI * 2 / 8) - .22;
    g += `<path d="M ${x} ${y} L ${x + Math.cos(a0) * r * .74} ${y + Math.sin(a0) * r * .74} A ${r * .74} ${r * .74} 0 0 1 ${x + Math.cos(a1) * r * .74} ${y + Math.sin(a1) * r * .74} Z" fill="${flesh}"/>`;
  }
  return g;
}

const VEG_ART = {
  zucchini: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#5c8c3f"/><circle cx="${x}" cy="${y}" r="${r * .74}" fill="#cfdfae"/><circle cx="${x}" cy="${y}" r="${r * .38}" fill="#b9d18d"/>`,
  squash: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#d8b53c"/><circle cx="${x}" cy="${y}" r="${r * .74}" fill="#f2e4b0"/><circle cx="${x}" cy="${y}" r="${r * .36}" fill="#e6d491"/>`,
  cucumber: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#3f7a3a"/><circle cx="${x}" cy="${y}" r="${r * .78}" fill="#dcecc4"/>` +
    [0, 1, 2, 3, 4].map(i => { const a = i / 5 * Math.PI * 2, px = x + Math.cos(a) * r * .38, py = y + Math.sin(a) * r * .38; return `<ellipse cx="${px}" cy="${py}" rx="${r * .12}" ry="${r * .18}" fill="#b7d195" transform="${rot(px, py, a * 57)}"/>`; }).join(""),
  radish: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#c9527a"/><circle cx="${x}" cy="${y}" r="${r * .76}" fill="#fbf3f2"/><circle cx="${x - r * .25}" cy="${y - r * .25}" r="${r * .2}" fill="#fff" opacity=".7"/>`,
  tomato: (x, y, r, rnd) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#gTomato)"/><ellipse cx="${x - r * .3}" cy="${y - r * .35}" rx="${r * .3}" ry="${r * .2}" fill="#fff" opacity=".38"/>${rnd() > .5 ? `<path d="M ${x - r * .5} ${y} q ${r * .5} ${r * .45} ${r} 0" stroke="#8c2018" stroke-width="1.2" fill="none" opacity=".35"/>` : ""}`,
  pepper: (x, y, r, rnd) => {
    const c = ["#d8452f", "#e8a713", "#5c9b3c"][Math.floor(rnd() * 3)];
    return `<g transform="${rot(x, y, rnd() * 360)}"><path d="M ${x - r * 1.5} ${y} q ${r * .8} ${-r * .95} ${r * 3} 0 q ${-r * .8} ${r * .5} ${-r * 3} 0 Z" fill="${c}"/><path d="M ${x - r * 1.2} ${y - r * .18} q ${r * .8} ${-r * .5} ${r * 2.3} ${-r * .05}" stroke="#fff" stroke-width="1.3" fill="none" opacity=".3"/></g>`;
  },
  onion: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}"><path d="M ${x - r * 1.3} ${y} a ${r * 1.3} ${r * 1.3} 0 0 1 ${r * 2.6} 0 l ${-r * .38} 0 a ${r * .92} ${r * .92} 0 0 0 ${-r * 1.84} 0 Z" fill="#a97fc0"/><path d="M ${x - r * .78} ${y} a ${r * .78} ${r * .78} 0 0 1 ${r * 1.56} 0 l ${-r * .34} 0 a ${r * .44} ${r * .44} 0 0 0 ${-r * .88} 0 Z" fill="#c9a8db"/></g>`,
  olive: (x, y, r, rnd) => `<ellipse cx="${x}" cy="${y}" rx="${r * .85}" ry="${r}" fill="#3d2f4a" transform="${rot(x, y, rnd() * 360)}"/><ellipse cx="${x - r * .22}" cy="${y - r * .3}" rx="${r * .2}" ry="${r * .28}" fill="#6b5a78" opacity=".7"/>`,
  broccoli: (x, y, r, rnd) => `${blob(x, y, r, 11, .4, rnd, 'fill="#3f7534"')}${blob(x - r * .3, y - r * .3, r * .5, 8, .45, rnd, 'fill="#57913f" opacity=".8"')}<rect x="${x - r * .18}" y="${y + r * .5}" width="${r * .36}" height="${r * .7}" rx="${r * .16}" fill="#a8c07a"/>`,
  cauliflower: (x, y, r, rnd) => `${blob(x, y, r, 11, .38, rnd, 'fill="#dcc79b" stroke="#b89f6c" stroke-width="1.3"')}${blob(x - r * .2, y - r * .22, r * .74, 9, .42, rnd, 'fill="#f3e8cc"')}${blob(x - r * .34, y - r * .34, r * .4, 8, .45, rnd, 'fill="#fdf8ea" opacity=".95"')}`,
  greens: (x, y, r, rnd) => {
    const c = ["#3f7d38", "#4f9440", "#66a84e", "#8fbb63"][Math.floor(rnd() * 4)];
    return `<g transform="${rot(x, y, rnd() * 360)}"><path d="M ${x} ${y - r * 1.2} q ${r * 1.05} ${r * .55} 0 ${r * 2.4} q ${-r * 1.05} ${-r * .55} 0 ${-r * 2.4} Z" fill="${c}"/><path d="M ${x} ${y - r * 1.05} L ${x} ${y + r * 1.05}" stroke="#e8f0d8" stroke-width="1" opacity=".45"/></g>`;
  },
  cabbage: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}">
      <path d="M ${x - r * 1.7} ${y} q ${r * .9} ${-r * .6} ${r * 3.4} ${-r * .1}" stroke="#93ab63" stroke-width="${r * .72}" fill="none" stroke-linecap="round"/>
      <path d="M ${x - r * 1.7} ${y} q ${r * .9} ${-r * .6} ${r * 3.4} ${-r * .1}" stroke="#e4eec9" stroke-width="${r * .46}" fill="none" stroke-linecap="round"/>
      <path d="M ${x - r * 1.4} ${y + r * .55} q ${r * .8} ${-r * .4} ${r * 2.8} ${-r * .05}" stroke="#7d9950" stroke-width="${r * .5}" fill="none" stroke-linecap="round"/>
      <path d="M ${x - r * 1.4} ${y + r * .55} q ${r * .8} ${-r * .4} ${r * 2.8} ${-r * .05}" stroke="#cfe0a8" stroke-width="${r * .28}" fill="none" stroke-linecap="round"/></g>`,
  greenbean: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}">
      <path d="M ${x - r * 1.9} ${y} q ${r * 1.9} ${-r * .75} ${r * 3.8} 0" stroke="#2f6423" stroke-width="${r * .92}" fill="none" stroke-linecap="round"/>
      <path d="M ${x - r * 1.9} ${y} q ${r * 1.9} ${-r * .75} ${r * 3.8} 0" stroke="#4f9438" stroke-width="${r * .74}" fill="none" stroke-linecap="round"/>
      <path d="M ${x - r * 1.4} ${y - r * .2} q ${r * 1.4} ${-r * .5} ${r * 2.8} 0" stroke="#8cc262" stroke-width="${r * .22}" fill="none" stroke-linecap="round" opacity=".85"/></g>`,
  asparagus: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}"><path d="M ${x - r * 2} ${y} h ${r * 3.4}" stroke="#4f8b3a" stroke-width="${r * .55}" stroke-linecap="round"/><path d="M ${x + r * 1.3} ${y} l ${r * .9} ${-r * .3} l ${-r * .1} ${r * .6} Z" fill="#3d7030"/></g>`,
  mushroom: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}"><path d="M ${x - r} ${y + r * .2} a ${r} ${r * .88} 0 0 1 ${r * 2} 0 Z" fill="#8a6a4e"/><path d="M ${x - r * .55} ${y + r * .2} h ${r * 1.1} v ${r * .62} a ${r * .55} ${r * .5} 0 0 1 ${-r * 1.1} 0 Z" fill="#e2d6bf"/><ellipse cx="${x - r * .3}" cy="${y - r * .28}" rx="${r * .3}" ry="${r * .18}" fill="#a5836a" opacity=".8"/></g>`,
  bokchoy: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}"><path d="M ${x - r * .45} ${y + r * 1.1} q ${-r * .2} ${-r * 1.1} ${r * .45} ${-r * 1.6} q ${r * .65} ${r * .5} ${r * .45} ${r * 1.6} Z" fill="#eef2dc"/><path d="M ${x} ${y - r * .5} q ${r * .95} ${-r * .35} ${r * .5} ${-r * 1.15} q ${-r * .75} ${r * .15} ${-r * .5} ${r * 1.15} Z" fill="#4d8c3a"/><path d="M ${x} ${y - r * .5} q ${-r * .95} ${-r * .35} ${-r * .5} ${-r * 1.15} q ${r * .75} ${r * .15} ${r * .5} ${r * 1.15} Z" fill="#5f9f45"/></g>`,
  avocado: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}"><path d="M ${x - r * 1.5} ${y} q ${r * .5} ${-r * .95} ${r * 3} 0 q ${-r * .5} ${r * .5} ${-r * 3} 0 Z" fill="#3f6b2c"/><path d="M ${x - r * 1.3} ${y - r * .05} q ${r * .45} ${-r * .72} ${r * 2.6} 0 q ${-r * .45} ${r * .38} ${-r * 2.6} 0 Z" fill="#a8c85e"/><path d="M ${x - r * .9} ${y - r * .08} q ${r * .32} ${-r * .45} ${r * 1.8} 0 q ${-r * .32} ${r * .24} ${-r * 1.8} 0 Z" fill="#d3e08c"/></g>`,
  lemon: (x, y, r, rnd) => citrus(x, y, r, rnd, "#e8c53a", "#f7ecb0", "#fbf6d8"),
  lime: (x, y, r, rnd) => citrus(x, y, r, rnd, "#8cb833", "#d6e79a", "#eef5cd"),
  egg: (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="${r * 1.35}" ry="${r * 1.15}" fill="#fdfbf4"/><ellipse cx="${x}" cy="${y}" rx="${r * 1.35}" ry="${r * 1.15}" fill="none" stroke="#efe6d2" stroke-width="1"/><circle cx="${x}" cy="${y}" r="${r * .52}" fill="url(#gYolk)"/>`,

  /* --- autumn, added for October and November --- */
  // halved sprout: pale layered core, dark outer leaves, flat cut face
  brussels: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}">
      ${blob(x, y, r, 9, .3, rnd, 'fill="#4a7d33"')}
      <ellipse cx="${x}" cy="${y}" rx="${r * .82}" ry="${r * .78}" fill="#cfe0a4"/>
      <ellipse cx="${x}" cy="${y}" rx="${r * .5}" ry="${r * .46}" fill="#e8f0cd"/>
      <path d="M ${x} ${y - r * .78} L ${x} ${y + r * .78}" stroke="#9dba74" stroke-width="1.1" opacity=".8"/>
      <path d="M ${x - r * .6} ${y - r * .3} q ${r * .6} ${r * .3} ${r * 1.2} 0" stroke="#9dba74" stroke-width="1" fill="none" opacity=".65"/></g>`,

  // torn kale: darker and more ruffled than the generic greens leaf
  kale: (x, y, r, rnd) => {
    const c = ["#2d5c28", "#356b2c", "#407a33"][Math.floor(rnd() * 3)];
    let edge = "";
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2, rr = r * (.85 + rnd() * .5);
      edge += `<circle cx="${(x + Math.cos(a) * rr).toFixed(1)}" cy="${(y + Math.sin(a) * rr * .8).toFixed(1)}" r="${(r * .42).toFixed(1)}" fill="${c}"/>`;
    }
    return `<g transform="${rot(x, y, rnd() * 360)}">${edge}<ellipse cx="${x}" cy="${y}" rx="${r * .95}" ry="${r * .8}" fill="${c}"/>
      <path d="M ${x - r * .8} ${y} h ${r * 1.6}" stroke="#9cc27a" stroke-width="1.1" opacity=".5"/></g>`;
  },

  // roasted turnip wedge: white root, faint purple shoulder
  turnip: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}">
      ${blob(x, y, r, 8, .26, rnd, 'fill="#f7f2e6" stroke="#c0b49c" stroke-width="1.3"')}
      <path d="M ${x - r} ${y - r * .18} q ${r} ${-r * .72} ${r * 2} 0 q ${-r} ${r * .3} ${-r * 2} 0 Z" fill="#a382bd"/>
      <path d="M ${x - r * .72} ${y - r * .3} q ${r * .72} ${-r * .34} ${r * 1.44} 0" stroke="#c6aedb" stroke-width="1.1" fill="none" opacity=".9"/>
      <ellipse cx="${x - r * .22}" cy="${y + r * .3}" rx="${r * .3}" ry="${r * .2}" fill="#fffdf6" opacity=".85"/></g>`,

  // fennel: pale bulb with vertical ribs and a wisp of frond
  fennel: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}">
      <ellipse cx="${x}" cy="${y}" rx="${r * .95}" ry="${r * 1.1}" fill="#eaf0dc"/>
      <ellipse cx="${x}" cy="${y}" rx="${r * .95}" ry="${r * 1.1}" fill="none" stroke="#c3d3a6" stroke-width="1"/>
      <path d="M ${x - r * .4} ${y - r * .95} v ${r * 1.9}" stroke="#c3d3a6" stroke-width="1.1"/>
      <path d="M ${x + r * .35} ${y - r * .95} v ${r * 1.9}" stroke="#c3d3a6" stroke-width="1.1"/>
      <path d="M ${x} ${y - r * 1.05} q ${r * .35} ${-r * .55} ${r * .05} ${-r * .85}" stroke="#6f9b52" stroke-width="1.4" fill="none" stroke-linecap="round"/></g>`,

  // leek: split rounds, white at the root end fading to green
  leek: (x, y, r, rnd) => `<g transform="${rot(x, y, rnd() * 360)}">
      <circle cx="${x}" cy="${y}" r="${r}" fill="#8fb35e"/>
      <circle cx="${x}" cy="${y}" r="${r * .74}" fill="#dfe9c6"/>
      <circle cx="${x}" cy="${y}" r="${r * .46}" fill="#f4f8e8"/>
      <circle cx="${x}" cy="${y}" r="${r * .2}" fill="#cfdfae"/></g>`,
};

const VEG_SIZE = {
  zucchini: 11, squash: 11, cucumber: 10, radish: 9.5, tomato: 10, pepper: 7.5, onion: 8,
  olive: 6.5, broccoli: 15, cauliflower: 14, greens: 9.5, cabbage: 8, greenbean: 8,
  asparagus: 8, mushroom: 11, bokchoy: 13, avocado: 7.5, lemon: 11, lime: 10, egg: 11,
  brussels: 10, kale: 11, turnip: 10, fennel: 10, leek: 8.5
};

const SAUCE = {
  green: (x, y, rnd) => blob(x, y, 74, 13, .35, rnd, 'fill="#4e7a2e" opacity=".26"') +
    [...Array(16)].map(() => { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 66; return `<circle cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${(y + Math.sin(a) * d * .8).toFixed(1)}" r="${(1.4 + rnd() * 2).toFixed(1)}" fill="#3d6b22" opacity=".5"/>`; }).join(""),
  red: (x, y, rnd) => blob(x, y, 76, 13, .3, rnd, 'fill="#b83a22" opacity=".3"') + blob(x + 6, y - 4, 52, 11, .35, rnd, 'fill="#c9482a" opacity=".28"'),
  brown: (x, y, rnd) => blob(x, y, 74, 13, .32, rnd, 'fill="#6b4620" opacity=".3"') + blob(x - 5, y + 5, 48, 10, .38, rnd, 'fill="#8a5c2c" opacity=".26"'),
};


/* ============================================================
   PLATES IN DEPTH
   A dish is drawn as six stacked layers (board, plate, sauce, veg,
   protein, herbs) so it can be stood up in 3D: the cards shift each
   layer by its own depth, the hero and the recipe panel turn the
   whole plate on a tilted turntable. The random sequence is drawn in
   exactly the order it always was, so every dish still looks the way
   it did when it was a single flat picture.
   ============================================================ */

/* Each layer is its own inline <svg>, so gradient/clip ids must be unique per
   instance or later SVGs resolve to the first definition in the document. */
const SVG_IDS = ["plateClip", "gChicken", "gChickenStrip", "gSteak", "gSteakStrip", "gMeatball",
  "gKofta", "gPatty", "gCrumbleBeef", "gCrumbleLamb", "gTomato", "gYolk", "gPlate", "gBoard", "gShadow"];
let artInstance = 0;

function namespaceIds(svg, suffix) {
  let out = svg;
  for (const id of SVG_IDS) {
    out = out.split(`id="${id}"`).join(`id="${id}-${suffix}"`)
             .split(`url(#${id})`).join(`url(#${id}-${suffix})`);
  }
  return out;
}

function defsFor(cx, cy, R) {
  return {
    plateClip: `<clipPath id="plateClip"><ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * .94}"/></clipPath>`,
    gChicken: '<radialGradient id="gChicken" cx="35%" cy="30%"><stop offset="0" stop-color="#efc079"/><stop offset="1" stop-color="#b9762f"/></radialGradient>',
    gChickenStrip: '<linearGradient id="gChickenStrip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0cf94"/><stop offset="1" stop-color="#c58a3e"/></linearGradient>',
    gSteak: '<linearGradient id="gSteak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a3f22"/><stop offset=".5" stop-color="#572814"/><stop offset="1" stop-color="#411d0f"/></linearGradient>',
    gSteakStrip: '<linearGradient id="gSteakStrip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c4123"/><stop offset="1" stop-color="#4a2011"/></linearGradient>',
    gMeatball: '<radialGradient id="gMeatball" cx="34%" cy="30%"><stop offset="0" stop-color="#c8834c"/><stop offset="1" stop-color="#71391a"/></radialGradient>',
    gKofta: '<linearGradient id="gKofta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b5723d"/><stop offset="1" stop-color="#6d381a"/></linearGradient>',
    gPatty: '<radialGradient id="gPatty" cx="34%" cy="30%"><stop offset="0" stop-color="#9c5a2e"/><stop offset="1" stop-color="#5b2a12"/></radialGradient>',
    gCrumbleBeef: '<radialGradient id="gCrumbleBeef" cx="35%" cy="30%"><stop offset="0" stop-color="#a4643a"/><stop offset="1" stop-color="#5e2e15"/></radialGradient>',
    gCrumbleLamb: '<radialGradient id="gCrumbleLamb" cx="35%" cy="30%"><stop offset="0" stop-color="#b06d4d"/><stop offset="1" stop-color="#6b3120"/></radialGradient>',
    gTomato: '<radialGradient id="gTomato" cx="34%" cy="28%"><stop offset="0" stop-color="#e8624a"/><stop offset="1" stop-color="#b62a1c"/></radialGradient>',
    gYolk: '<radialGradient id="gYolk" cx="35%" cy="32%"><stop offset="0" stop-color="#ffd85e"/><stop offset="1" stop-color="#eda31d"/></radialGradient>',
    gPlate: '<radialGradient id="gPlate" cx="34%" cy="26%"><stop offset="0" stop-color="#fffefb"/><stop offset="1" stop-color="#ebe5d8"/></radialGradient>',
    gBoard: '<linearGradient id="gBoard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".3"/><stop offset="1" stop-color="#3a2b18" stop-opacity=".14"/></linearGradient>',
    gShadow: '<radialGradient id="gShadow"><stop offset=".62" stop-color="#2b1d0d" stop-opacity=".2"/><stop offset="1" stop-color="#2b1d0d" stop-opacity="0"/></radialGradient>'
  };
}

/* one layer, carrying only the definitions it actually references */
function svgLayer(cls, body, defs, vb) {
  if (!body) return "";
  const used = Object.keys(defs).filter(id => body.includes(`url(#${id})`)).map(id => defs[id]).join("");
  return `<svg class="pl ${cls}" ${vb} aria-hidden="true" focusable="false">${used ? `<defs>${used}</defs>` : ""}${body}</svg>`;
}

function dishParts(d) {
  const rnd = mulberry32(d.day * 7919 + 13);
  const W = 400, H = 258, cx = W / 2, cy = H / 2, R = 102;
  const art = d.art || { protein: "meatball", veg: ["greens"] };
  const L = { sauce: "", veg: "", protein: "", herbs: "" };

  if (art.sauce && SAUCE[art.sauce]) L.sauce = `<g clip-path="url(#plateClip)">${SAUCE[art.sauce](cx + 4, cy + 10, rnd)}</g>`;

  const placed = [];
  const heroA = rnd() * Math.PI * 2;
  const hero = { x: cx + Math.cos(heroA) * 16, y: cy + Math.sin(heroA) * 10, r: 54 };
  placed.push(hero);

  // cycle the veg list rather than sampling, so every named vegetable appears
  const vegList = (art.veg || []).slice(0, 6);
  const vegItems = [];
  let guard = 0, pick = 0;
  while (vegItems.length < 26 && guard < 2600) {
    guard++;
    const kind = vegList[pick % vegList.length];
    if (!kind || !VEG_ART[kind]) { pick++; continue; }
    const r = (VEG_SIZE[kind] || 9) * (.9 + rnd() * .45);
    const a = rnd() * Math.PI * 2, dist = 14 + Math.sqrt(rnd()) * (R - 20);
    const px = cx + Math.cos(a) * dist, py = cy + Math.sin(a) * dist * .92;
    if (Math.hypot(px - cx, (py - cy) / .92) > R - r * .55 - 4) continue;
    if (placed.some(p => Math.hypot(px - p.x, py - p.y) < (p.r + r) * .62)) continue;
    placed.push({ x: px, y: py, r });
    vegItems.push({ kind, x: px, y: py, r });
    pick++;
  }

  vegItems.forEach(v => {
    L.veg += `<ellipse cx="${v.x.toFixed(1)}" cy="${(v.y + v.r * .34).toFixed(1)}" rx="${(v.r * 1.12).toFixed(1)}" ry="${(v.r * .82).toFixed(1)}" fill="#5c3f1c" opacity=".12"/>`;
    L.veg += VEG_ART[v.kind](v.x, v.y, v.r, rnd);
  });

  L.protein = (PROTEIN_ART[art.protein] || PROTEIN_ART.meatball)(hero.x, hero.y, rnd, 1.12);

  for (let i = 0; i < 22; i++) {
    const a = rnd() * Math.PI * 2, dist = Math.sqrt(rnd()) * (R - 12);
    const px = cx + Math.cos(a) * dist, py = cy + Math.sin(a) * dist * .92;
    L.herbs += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(1.6 + rnd() * 1.8).toFixed(1)}" ry="${(.9 + rnd()).toFixed(1)}" fill="#3f6b28" opacity="${(.35 + rnd() * .4).toFixed(2)}" transform="${rot(px, py, rnd() * 180)}"/>`;
  }

  const tint = (PROTEINS[d.protein] || {}).hex || "#8a6a4e";
  return { W, H, cx, cy, R, L, tint, defs: defsFor(cx, cy, R) };
}

const plateBody = (P) =>
  `<ellipse cx="${P.cx}" cy="${P.cy}" rx="${P.R}" ry="${P.R * .94}" fill="url(#gPlate)"/>
   <ellipse cx="${P.cx}" cy="${P.cy}" rx="${P.R - 9}" ry="${P.R * .94 - 8}" fill="none" stroke="#d5cbb6" stroke-width="1.5" opacity=".8"/>`;

const foodLayers = (P, vb) =>
  svgLayer("pl-sauce", P.L.sauce, P.defs, vb) + svgLayer("pl-veg", P.L.veg, P.defs, vb) +
  svgLayer("pl-protein", P.L.protein, P.defs, vb) + svgLayer("pl-herbs", P.L.herbs, P.defs, vb);

/* the card version: the plate on its tinted board, layers stacked flat
   until a pointer tilts the card */
function cardArt(d) {
  const P = dishParts(d);
  const vb = `viewBox="0 0 ${P.W} ${P.H}" preserveAspectRatio="xMidYMid slice"`;
  const base = `<rect width="${P.W}" height="${P.H}" fill="#e9e0cf"/>
    <rect width="${P.W}" height="${P.H}" fill="${P.tint}" opacity=".11"/>
    <rect width="${P.W}" height="${P.H}" fill="url(#gBoard)"/>
    <ellipse cx="${P.cx + 4}" cy="${P.cy + 16}" rx="${P.R + 26}" ry="${P.R * .94 + 20}" fill="url(#gShadow)"/>
    <ellipse cx="${P.cx}" cy="${P.cy + 7}" rx="${P.R + 6}" ry="${P.R * .94 + 5}" fill="#2b1d0d" opacity=".12"/>`;
  const html = `<span class="plate2d">${svgLayer("pl-base", base, P.defs, vb)}${svgLayer("pl-plate", plateBody(P), P.defs, vb)}${foodLayers(P, vb)}</span>`;
  return namespaceIds(html, `${d.day}-${artInstance++}`);
}

/* the stage version: the plate alone, cropped square and stood on a
   turntable, with a few rings beneath it for the thickness of the rim */
function stagePlate(d) {
  const P = dishParts(d);
  const m = 14, ry = P.R * .94;
  const vb = `viewBox="${P.cx - P.R - m} ${(P.cy - ry - m).toFixed(2)} ${2 * P.R + 2 * m} ${(2 * ry + 2 * m).toFixed(2)}" preserveAspectRatio="none"`;
  const rims = [6, 5, 4, 3, 2, 1].map(k => `<span class="rim" style="--k:${k}"></span>`).join("");
  const html = `<span class="p3d"><span class="p3d-shadow"></span><span class="p3d-spin"><span class="p3d-turn">${rims}${svgLayer("pl-plate", plateBody(P), P.defs, vb)}${foodLayers(P, vb)}</span></span></span><span class="steam" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
  return namespaceIds(html, `s${d.day}-${artInstance++}`);
}

/* ============================================================
   HELPERS
   ============================================================ */
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shortDate = (iso) => { const [, m, d] = iso.split("-"); return `${+d} ${MONTHS[+m]}`; };
// card heads are tight; every night is in the one month, so the month is dropped there
const dayOfMonth = (iso) => +iso.split("-")[2];
const pad2 = (n) => String(n).padStart(2, "0");

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
};

function stars(rating) {
  if (rating == null) return "";
  const full = Math.round(rating);
  return [...Array(5)].map((_, i) => `<span class="${i < full ? "on" : ""}">★</span>`).join("");
}

/* "1 hr 20 min" -> 80 */
function toMins(s) {
  if (!s) return 0;
  const h = /(\d+)\s*hr/.exec(s), m = /(\d+)\s*min/.exec(s);
  return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0);
}

const ICON = {
  clock: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  hand: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 3.5 20.5 9.5 10 20H4v-6L14.5 3.5Z"/><path d="m12 6 6 6"/></svg>',
  serves: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 4v7a4 4 0 0 0 8 0V4M8 11v9M17 4c-1.5 2-2 4-2 6s.5 3 2 3 2-1 2-3-.5-4-2-6Zm0 9v7"/></svg>',
  protein: '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 20v-6M10 20V8M16 20v-9M2 20h20"/></svg>',
  basket: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 9h17l-1.6 9.2a2 2 0 0 1-2 1.8H7.1a2 2 0 0 1-2-1.8L3.5 9Z"/><path d="m8.5 9 2-5M15.5 9l-2-5"/></svg>',
  timer: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="13.5" r="7.5"/><path d="M12 9.5v4l2.5 1.5M10 2.5h4"/></svg>',
  check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.4 8.6 6.6 11.6 12.8 4.6"/></svg>'
};

/* Protein per plate, drawn as two bars against a 90g ceiling so the two
   figures are comparable at a glance rather than just two numbers. */
const PRO_CEIL = 90;
function proteinBars(pg) {
  if (!pg) return "";
  return `
    <div class="m-protein">
      <span class="eyebrow">Protein per plate</span>
      <div class="mp-bars">
        ${[["Vishut", pg.him], ["Megan", pg.her]].map(([name, g], i) => `
          <div class="mp-bar">
            <span class="mp-name">${esc(name)}</span>
            <span class="mp-track"><i style="width:${Math.min(100, g / PRO_CEIL * 100).toFixed(0)}%;--i:${i}"></i></span>
            <b>${g}g</b>
          </div>`).join("")}
      </div>
      <p class="mp-note">Calculated from raw weight, so it runs a little conservative. Leftovers are on top of these.</p>
    </div>`;
}

/* ============================================================
   WHERE ARE WE: today against the month on screen
   ============================================================ */
const atDay = (iso) => new Date(iso + "T00:00:00");
const today = () => { const n = new Date(); n.setHours(0, 0, 0, 0); return n; };

/* tonight's day number, or null if the month on screen is not running */
function liveDay() {
  const now = today(), first = atDay(MONTH.first), last = atDay(MONTH.last);
  if (now < first || now > last) return null;
  return Math.round((now - first) / 86400000) + 1;
}

/* ============================================================
   HERO: tonight's plate on the turntable
   ============================================================ */
let heroDay = 1;

function heroLabel(n) {
  const live = liveDay();
  if (live) {
    if (n === live) return "Tonight";
    if (n === live + 1) return "Tomorrow";
    if (n === live - 1) return "Last night";
  } else {
    if (n === 1) return "Opening night";
    if (n === DAYS.length) return "Closing night";
  }
  return `Night ${n}`;
}

function renderHero(n = liveDay() || 1, dir = 0) {
  const d = DAYS.find(x => x.day === n) || DAYS[0];
  heroDay = d.day;
  const p = PROTEINS[d.protein];
  const hero = $("#hero");
  hero.style.setProperty("--hero-pc", `var(--p-${d.protein})`);

  const plate = $("#stage-plate");
  plate.innerHTML = stagePlate(d);
  plate.setAttribute("aria-label", `Open the recipe: ${d.title}`);
  plate.style.setProperty("--turn", "0deg");
  // the new plate's own entrance runs from CSS; the direction picks which way it arrives
  plate.dataset.dir = dir > 0 ? "next" : dir < 0 ? "prev" : "";

  $("#ticket-when").innerHTML = `<b>${esc(heroLabel(d.day))}</b> · ${esc(d.dow.slice(0, 3))} ${shortDate(d.date)}`;
  $("#ticket-title").textContent = d.title;
  $("#ticket-stats").innerHTML = `
    <span>${ICON.clock}${esc(d.time)}</span>
    <span>${ICON.hand}${esc(d.active)}</span>
    ${d.protein_g ? `<span class="pro">${ICON.protein}${d.protein_g.him}/${d.protein_g.her}g</span>` : ""}`;
  $("#ticket-prev").disabled = d.day <= 1;
  $("#ticket-next").disabled = d.day >= DAYS.length;
  FX.rerun([$("#ticket-title"), $("#ticket-stats")], { step: 60, duration: 600 });

  const rating = d.source.rating != null
    ? `<span class="chip-star">★</span> ${d.source.rating} <small>${Number(d.source.reviews).toLocaleString("en-US")} reviews</small>`
    : `Built for this plan`;
  $("#orbit").innerHTML = `
    <span class="chip c1" style="${pcVar(d.protein)}">${glyph(d.protein, 14)}${esc(p.label)}</span>
    <span class="chip c2">${rating}</span>
    <span class="chip c3">${ICON.hand}${esc(d.active)} hands-on</span>`;
}

/* ============================================================
   THE MONTH IN NUMBERS
   ============================================================ */
function renderRotation() {
  const counts = {};
  DAYS.forEach(d => counts[d.protein] = (counts[d.protein] || 0) + 1);
  const max = Math.max(...Object.values(counts));

  $("#rot-total").textContent = `${DAYS.length} nights`;
  $("#rot-rows").innerHTML = Object.entries(PROTEINS).map(([k, v], i) => `
    <button class="rot-row" style="${pcVar(k)};--i:${i}" data-filter="${k}" title="Show the ${esc(v.label.toLowerCase())} nights">
      <span class="rot-glyph">${glyph(k, 18)}</span>
      <span class="rot-name">${esc(v.label)}</span>
      <span class="rot-meter">
        <span class="rot-bar"><i style="width:${((counts[k] || 0) / max * 100).toFixed(0)}%"></i></span>
        <span class="rot-n">${counts[k] || 0}</span>
      </span>
    </button>`).join("");

  const sourced = DAYS.filter(d => d.source.url).length;
  const withPro = DAYS.filter(d => d.protein_g);

  // summed from the five trip estimates rather than hard-coded, so the
  // headline figure can never drift away from the actual lists
  const bounds = GROCERIES.reduce((acc, t) => {
    const n = (t.est.match(/\d+/g) || []).map(Number);
    acc[0] += n[0] || 0;
    acc[1] += n[1] ?? n[0] ?? 0;
    return acc;
  }, [0, 0]);

  const cells = [
    [`${GROCERIES.length}`, "shopping trips"],
    [`${sourced}`, "sourced recipes"],
    [`$${bounds[0]} to $${bounds[1]}`, "for the month"]
  ];
  if (withPro.length === DAYS.length) {
    const floor = Math.min(...withPro.map(d => d.protein_g.him));
    cells.push([`${floor}g+`, "protein, his plate"]);
  }
  const foot = $("#rot-foot");
  foot.innerHTML = cells.map(([v, l], i) => `<div style="--i:${i}"><b data-count="${esc(v)}">${esc(v)}</b><span>${esc(l)}</span></div>`).join("");
  foot.classList.toggle("four", cells.length === 4);
  // already on screen from an earlier month: count the new figures in place
  if ($(".numbers-panel").classList.contains("in")) FX.countUp(foot);
}

function renderStatus() {
  const first = atDay(MONTH.first), last = atDay(MONTH.last);
  const now = today();
  const strip = $("#status-strip"), text = $("#status-text"), btn = $("#status-btn");
  const live = PLAN_MONTHS.find(m => now >= atDay(m.first) && now <= atDay(m.last));

  strip.classList.remove("live");
  if (now < first) {
    const days = Math.round((first - now) / 86400000);
    text.innerHTML = `${esc(MONTH.title)} starts in <b>${days}</b> day${days === 1 ? "" : "s"}. First shop is <b>${esc(MONTH.weeks[0].shop.replace(/^Shop /, ""))}</b>.`;
    btn.hidden = true;
  } else if (now > last) {
    text.innerHTML = `${esc(MONTH.title)} is done. Everything below still works as a reference.`;
    btn.hidden = true;
  } else {
    const n = Math.round((now - first) / 86400000) + 1;
    const d = DAYS.find(x => x.day === n);
    text.innerHTML = d ? `Tonight is <b>day ${n}</b>: ${esc(d.title)}.` : `${esc(MONTH.title)} is running.`;
    btn.hidden = !d;
    strip.classList.add("live");
    if (d) btn.onclick = () => openDay(n, true, btn);
  }

  // browsing a month that is not the one you are actually cooking from
  if (live && live.key !== MONTH.key) {
    text.innerHTML += ` Tonight's dinner is over in <button type="button" class="linkish" data-month="${live.key}">${esc(live.title)}</button>.`;
  }
  strip.hidden = false;
}

/* ---------- month switch ----------
   Built once; switching months only moves the sliding marker, so the
   marker has somewhere to slide from. */
function renderMonthSwitch() {
  const host = $("#mswitch");
  if (!host.querySelector(".mtab")) {
    host.innerHTML = `<span class="mswitch-ind" aria-hidden="true"></span>` + PLAN_MONTHS.map(m =>
      `<button type="button" class="mtab" data-month="${m.key}" title="${esc(m.title)}">${esc(m.short)}</button>`).join("");
  }
  $$(".mtab", host).forEach(b => {
    const on = b.dataset.month === MONTH.key;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", String(on));
  });
  placeMonthMarker();
}

function placeMonthMarker() {
  const on = $(".mtab.on"), ind = $(".mswitch-ind");
  if (!on || !ind) return;
  ind.style.width = `${on.offsetWidth}px`;
  ind.style.transform = `translateX(${on.offsetLeft}px)`;
  // keep the chosen month in view when the switch scrolls on a narrow phone
  const host = $("#mswitch");
  if (host.scrollWidth > host.clientWidth) host.scrollLeft = on.offsetLeft - (host.clientWidth - on.offsetWidth) / 2;
}

const NIGHT_WORD = { 28: "Twenty-eight", 29: "Twenty-nine", 30: "Thirty", 31: "Thirty-one" };

/* Totals across every month. Computed once so the scope line and the footer can never
   drift out of date the way the hand-written ones did. */
const PLAN_TOTAL = PLAN_MONTHS.reduce((a, m) => {
  a.nights += m.days.length;
  a.sourced += m.days.filter(d => d.source.url).length;
  return a;
}, { nights: 0, sourced: 0, months: PLAN_MONTHS.length });

const MONTH_WORD = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"];
const planSpan = () => `${PLAN_MONTHS[0].short} to ${PLAN_MONTHS[PLAN_MONTHS.length - 1].short} ${PLAN_MONTHS[0].first.slice(0, 4)}`;

function renderMasthead() {
  $("#hero-eyebrow").textContent = MONTH.span;
  // each word rises out of its own mask; the month is the one that changes, so it is the one set in italic
  $("#hero-title").innerHTML = ["Megan’s", "Grand", MONTH.label, "Mealplan"].map((w, i) =>
    `<span class="w"><span style="--i:${i}"${w === MONTH.label ? ' class="hl"' : ""}>${esc(w)}</span></span>`).join(" ");
  $("#hero-subhead").textContent = MONTH.subhead;
  $("#hero-lede").textContent = MONTH.lede;
  $("#glance-eyebrow").textContent = MONTH.title;
  $("#plan-count").textContent = `${DAYS.length} nights`;
  $("#glance-h2").textContent = `${NIGHT_WORD[DAYS.length] || DAYS.length} nights at a glance`;
  $("#brand-mark").textContent = DAYS.length;

  // what a first-time visitor needs: how big this is, and where they have landed in it
  const i = PLAN_MONTHS.findIndex(m => m.key === MONTH.key);
  $("#hero-scope").textContent =
    `Month ${i + 1} of ${PLAN_MONTHS.length} · ${PLAN_TOTAL.nights} dinners in all`;
  $("#foot-line").textContent =
    `${MONTH_WORD[PLAN_TOTAL.months] || PLAN_TOTAL.months} months, ` +
    `${PLAN_TOTAL.nights} dinners, ${planSpan()}. Dairy-free, grain-free, sugar-free, seed-oil-free.`;
  // the printed shopping list names the month it belongs to
  $("#groceries").dataset.printTitle = `Megan's Grand ${MONTH.label} Mealplan / Shopping lists`;
  baseTitle = `Megan's Grand Mealplan · ${MONTH.title}`;
  paintTitle();
}

/* everything that depends on which month is selected */
function renderMonth() {
  buildIndex();
  renderMonthSwitch();
  renderMasthead();
  renderHero();
  renderRotation();
  renderStatus();
  renderFilters();
  renderGlance();
  renderWeekNav();
  renderWeeks();
  renderMethod();
  renderGroceries();
  renderPrep();
  applyFilters();
  FX.reveal();
}

/* a month switch replays the masthead; the title words are new nodes, so
   their own CSS entrance runs by itself */
function replayMasthead() {
  FX.rerun([$(".hero-meta"), $("#hero-subhead"), $("#hero-lede"), $(".hero-cta"), $("#status-strip")], { delay: 300, step: 70 });
  FX.rerun([$("#hero-ticket")], { delay: 380 });
  FX.rerun([$("#brand-mark")], { frames: [{ transform: "rotateX(90deg)" }, { transform: "none" }], duration: 700, easing: "cubic-bezier(.34,1.56,.64,1)" });
}

function switchMonth(key) {
  if (!PLAN_MONTHS.some(m => m.key === key) || key === MONTH.key) return;
  closeModal(true);
  selectMonth(key);
  store.set("mealplan26:month", key);
  filterProtein = "all";
  filterQuick = false;
  filterKeep = false;
  $("#search").value = "";
  renderMonth();
  replayMasthead();
  if (location.hash) history.replaceState(null, "", location.pathname);
}

/* ============================================================
   CALENDAR + WEEKS
   ============================================================ */

/* A real month: every night under its weekday, so a Thursday reads as a
   Thursday. Filtered-out nights fade rather than vanish, which keeps the
   grid honest. */
function renderGlance() {
  const lead = atDay(DAYS[0].date).getDay();
  const live = liveDay();
  const cells = [];
  for (let i = 0; i < lead; i++) cells.push(`<span class="cal-blank" style="--i:${i}" aria-hidden="true"></span>`);
  DAYS.forEach((d, k) => {
    const pos = lead + k, row = Math.floor(pos / 7), col = pos % 7;
    const state = live ? (d.day === live ? " today" : d.day < live ? " past" : "") : "";
    const v = verdictOf(MONTH.key, d.day);
    cells.push(`
    <button class="glance-cell${state}${v ? " v-" + v : ""}" data-day="${d.day}" data-protein="${d.protein}" style="${pcVar(d.protein)};--i:${row + col}"
            title="${esc(d.title)} (${esc(PROTEINS[d.protein].label)})"
            data-label="Day ${d.day}, ${esc(d.dow)}: ${esc(d.title)}, ${esc(PROTEINS[d.protein].label)}${state === " today" ? ", tonight" : ""}"
            aria-label="Day ${d.day}, ${esc(d.dow)}: ${esc(d.title)}, ${esc(PROTEINS[d.protein].label)}${state === " today" ? ", tonight" : ""}${VERDICT_SAYS[v] || ""}">
      <span class="g-top"><span class="g-num">${d.day}</span>${state === " today" ? `<span class="g-now">Tonight</span>` : `<span class="g-glyph">${glyph(d.protein, 14)}</span>`}</span>
      <span class="g-title">${esc(d.title)}</span>
    </button>`);
  });
  const tail = (7 - (cells.length % 7)) % 7;
  for (let i = 0; i < tail; i++) cells.push(`<span class="cal-blank" aria-hidden="true"></span>`);
  $("#glance-grid").innerHTML = cells.join("");
}

function renderWeekNav() {
  $("#weeknav").innerHTML = WEEKS.map(w =>
    `<a href="#week-${w.n}" data-week="${w.n}"><b>${pad2(w.n)}</b><span>${esc(w.theme)}</span><small>${esc(w.dates)}</small></a>`).join("");
}

function renderWeeks() {
  const live = liveDay();
  $("#weeks-list").innerHTML = WEEKS.map(w => `
    <section class="week" id="week-${w.n}" data-week="${w.n}">
      <header class="week-head">
        <span class="week-num" aria-hidden="true">${pad2(w.n)}</span>
        <div class="week-title">
          <span class="week-badge">Week ${w.n} <span class="week-dates">${esc(w.dates)}</span></span>
          <h3>${esc(w.theme)}</h3>
        </div>
        <p class="week-note">${esc(w.note)}</p>
        <p class="week-shop">${ICON.basket}Shop ${esc(w.shop)}</p>
      </header>
      <div class="cards">${DAYS.filter(d => d.week === w.n).map((d, i) => cardHtml(d, i, live)).join("")}</div>
    </section>`).join("");
  spyWeeks();
  lazyArt();
}

/* A card's plate is drawn when it comes within a screen or so of view, not
   up front: thirty layered illustrations are most of the cost of a month. */
let artIO = null;
function fillArt(slot) {
  const d = DAYS.find(x => x.day === +slot.dataset.art);
  if (d && slot.isConnected) slot.outerHTML = cardArt(d);
}
function lazyArt() {
  artIO?.disconnect();
  const slots = $$(".art-slot");
  if (!("IntersectionObserver" in window)) return slots.forEach(fillArt);
  artIO = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    artIO.unobserve(e.target);
    fillArt(e.target);
  }), { rootMargin: "900px 0px" });
  slots.forEach(s => artIO.observe(s));
}

function cardHtml(d, i, live) {
  const p = PROTEINS[d.protein];
  const tonight = live && d.day === live;
  const v = verdictOf(MONTH.key, d.day);
  return `
  <button class="card${tonight ? " today" : ""}${v ? " v-" + v : ""}" data-day="${d.day}" data-protein="${d.protein}" style="${pcVar(d.protein)};--i:${i}"
          data-label="Open day ${d.day}: ${esc(d.title)}${tonight ? ", tonight" : ""}"
          aria-label="Open day ${d.day}: ${esc(d.title)}${tonight ? ", tonight" : ""}${VERDICT_SAYS[v] || ""}">
    <span class="card-art"><span class="art-slot" data-art="${d.day}"></span>${tonight ? `<span class="ribbon">Tonight</span>` : ""}<span class="vb again" aria-hidden="true">${VERDICT_ICON.again}Make again</span><span class="vb pass" aria-hidden="true">${VERDICT_ICON.skip}Skip</span></span>
    <span class="card-head">
      <span class="card-no">DAY <b>${pad2(d.day)}</b> · ${d.dow.slice(0, 3)} ${dayOfMonth(d.date)}</span>
      <span class="tag-p">${glyph(d.protein, 11)}${esc(p.label)}</span>
    </span>
    <span class="card-body">
      <span class="card-title">${esc(d.title)}</span>
      <span class="card-blurb">${esc(d.blurb)}</span>
      <span class="card-foot">
        <span class="stat">${ICON.clock}${esc(d.time)}</span>
        <span class="stat">${ICON.serves}${d.serves}</span>
        ${d.protein_g ? `<span class="stat pro" title="Protein per plate: Vishut ${d.protein_g.him}g, Megan ${d.protein_g.her}g">${ICON.protein}${d.protein_g.him}/${d.protein_g.her}g</span>` : ""}
        ${d.source.rating != null ? `<span class="stat rate">★ ${d.source.rating}</span>` : ""}
      </span>
    </span>
    <span class="glare" aria-hidden="true"></span>
  </button>`;
}

/* the week strip lights the week you are reading */
let weekSpy = null;
function spyWeeks() {
  weekSpy?.disconnect();
  if (!("IntersectionObserver" in window)) return;
  weekSpy = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    $$("#weeknav a").forEach(a => a.classList.toggle("on", a.dataset.week === e.target.dataset.week));
  }), { rootMargin: "-35% 0px -60% 0px" });
  $$(".week").forEach(w => weekSpy.observe(w));
}

/* ============================================================
   SEARCH + FILTER
   ============================================================ */
const searchIndex = new Map();
function buildIndex() {
  searchIndex.clear();
  DAYS.forEach(d => {
    searchIndex.set(d.day, [
      d.title, d.blurb, d.dow, d.source.name, (d.tags || []).join(" "),
      d.ingredients.map(g => g.i.join(" ")).join(" "),
      d.steps.join(" "), PROTEINS[d.protein].label
    ].join(" ").toLowerCase());
  });
}

let filterProtein = "all";
let filterQuick = false;
let filterKeep = false;

function renderFilters() {
  const counts = {};
  DAYS.forEach(d => counts[d.protein] = (counts[d.protein] || 0) + 1);
  $("#filters").innerHTML =
    `<button class="fbtn active" data-filter="all">All nights <b>${DAYS.length}</b></button>` +
    Object.entries(PROTEINS).map(([k, v]) =>
      `<button class="fbtn" data-filter="${k}" style="${pcVar(k)}">${glyph(k, 13)}${esc(v.label)} <b>${counts[k] || 0}</b></button>`).join("") +
    `<button class="fbtn quick" data-quick="1" title="Recipes needing 15 minutes or less of hands-on work">
       <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M13.5 2 4 14h7l-1.5 8L20 10h-7l.5-8Z"/></svg>Quick <b>≤15m</b></button>` +
    `<button class="fbtn keep" data-keep="1" title="Nights you marked Make again"${keepCount() ? "" : " hidden"}>${VERDICT_ICON.again}Make again <b>${keepCount()}</b></button>`;
}

const keepCount = () => DAYS.filter(d => verdictOf(MONTH.key, d.day) === "again").length;

function applyFilters() {
  const q = $("#search").value.trim().toLowerCase();
  $("#search-wrap").classList.toggle("has-value", q.length > 0);

  let shown = 0;
  DAYS.forEach(d => {
    const okProtein = filterProtein === "all" || d.protein === filterProtein;
    const okQuick = !filterQuick || toMins(d.active) <= 15;
    const okText = !q || searchIndex.get(d.day).includes(q);
    const okKeep = !filterKeep || verdictOf(MONTH.key, d.day) === "again";
    const on = okProtein && okQuick && okText && okKeep;
    if (on) shown++;
    $$(`.card[data-day="${d.day}"], .glance-cell[data-day="${d.day}"]`).forEach(el => el.classList.toggle("hide", !on));
  });

  // collapse a week whose nights are all filtered out
  $$(".week").forEach(w => {
    w.style.display = w.querySelectorAll(".card:not(.hide)").length ? "" : "none";
  });

  $$(".fbtn").forEach(b => {
    if (b.dataset.quick) b.classList.toggle("active", filterQuick);
    else if (b.dataset.keep) b.classList.toggle("active", filterKeep);
    else b.classList.toggle("active", b.dataset.filter === filterProtein);
  });
  $$(".rot-row").forEach(r => r.classList.toggle("active", r.dataset.filter === filterProtein));

  $("#result-count").textContent = shown === DAYS.length ? `${DAYS.length} nights` : `${shown} of ${DAYS.length} nights`;
  $("#no-results").hidden = shown > 0;
}

/* ============================================================
   KITCHEN TIMERS
   Any cooking time in a recipe step is a button. Timers keep running
   with the recipe closed, survive a reload, and ring when they finish.
   ============================================================ */

/* "25 to 30 minutes", "2½ hours", "an hour". Ranges start the timer at the
   low end, which is when you should first check. Anything past four hours
   is an overnight marinade, not a timer, and stays as plain text. */
const TIME_RE = /(\d+(?:\.\d+)?½?)(?:\s*(?:to|-|–)\s*(\d+(?:\.\d+)?½?))?\s*(minutes?|mins?|hours?|hrs?)\b|\b(half an hour|an hour)\b/gi;
const num = (s) => s.endsWith("½") ? (parseFloat(s) || 0) + .5 : parseFloat(s);

function withTimers(text, stepNo) {
  return esc(text).replace(TIME_RE, (m, lo, hi, unit, phrase) => {
    let secs;
    if (phrase) secs = /half/i.test(phrase) ? 1800 : 3600;
    else secs = Math.round(num(lo) * (/^h/i.test(unit) ? 3600 : 60));
    const most = phrase ? secs : Math.round(num(hi || lo) * (/^h/i.test(unit) ? 3600 : 60));
    if (!secs || most > 4 * 3600) return m;
    return `<button type="button" class="tchip" data-secs="${secs}" data-step="${stepNo}" title="Start a ${fmtDur(secs)} timer">${ICON.timer}${m}</button>`;
  });
}

function fmtDur(secs) {
  const h = Math.floor(secs / 3600), m = Math.round((secs % 3600) / 60);
  return h ? `${h} hr${m ? ` ${m} min` : ""}` : `${m} min`;
}
function fmtClock(secs) {
  secs = Math.max(0, Math.ceil(secs));
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
  return h ? `${h}:${pad2(m)}:${pad2(s)}` : `${pad2(m)}:${pad2(s)}`;
}

const TKEY = "mealplan26:timers";
let timers = [];
try { timers = JSON.parse(store.get(TKEY) || "[]").filter(t => t && t.total); } catch (_) { timers = []; }
const saveTimers = () => store.set(TKEY, JSON.stringify(timers));
let tickHandle = 0, audio = null, baseTitle = document.title;

const leftOf = (t) => t.paused ? t.left : Math.max(0, (t.end - Date.now()) / 1000);

function startTimer(secs, label, sub) {
  // the click that starts a timer is the one chance to unlock sound on a phone
  try { audio = audio || new (window.AudioContext || window.webkitAudioContext)(); audio.resume(); } catch (_) {}
  timers.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), label, sub, total: secs, end: Date.now() + secs * 1000, paused: false, left: secs, done: false });
  saveTimers();
  renderTimers(true);
}

function renderTimers(fresh = false) {
  const host = $("#timers");
  const had = document.activeElement?.closest?.(".timer") ? [document.activeElement.closest(".timer").dataset.id, document.activeElement.dataset.t] : null;
  host.innerHTML = timers.map(t => `
    <div class="timer${t.done ? " done" : ""}${t.paused ? " paused" : ""}" data-id="${t.id}" role="group" aria-label="Timer: ${esc(t.sub)}">
      <span class="t-ring" aria-hidden="true"><svg viewBox="0 0 40 40"><circle class="t-track" cx="20" cy="20" r="16"/><circle class="t-fill" cx="20" cy="20" r="16" pathLength="100"/></svg></span>
      <span class="t-txt"><b class="t-left">${fmtClock(leftOf(t))}</b><span class="t-label">${esc(t.sub)}</span><small>${esc(t.label)}</small></span>
      <span class="t-btns">
        ${t.done ? "" : `<button type="button" class="t-btn" data-t="add" aria-label="Add a minute">+1</button>
        <button type="button" class="t-btn" data-t="pause" aria-label="${t.paused ? "Resume" : "Pause"}">${t.paused
          ? '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M7 5v14l12-7Z"/></svg>'
          : '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'}</button>`}
        <button type="button" class="t-btn" data-t="x" aria-label="${t.done ? "Dismiss" : "Cancel"} timer">
          <svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="m6 6 12 12M18 6 6 18"/></svg></button>
      </span>
    </div>`).join("");
  if (fresh) host.lastElementChild?.classList.add("fresh");
  if (had) ($(`.timer[data-id="${had[0]}"] [data-t="${had[1]}"]`) || $(`.timer[data-id="${had[0]}"] .t-btn`) || $("#modal.open #modal-close"))?.focus();
  // the recipe and the page keep their last lines clear of the timer stack
  document.body.style.setProperty("--timers-h", timers.length ? `${host.offsetHeight + 16}px` : "0px");
  paintTimers();
  if (timers.some(t => !t.done && !t.paused)) { if (!tickHandle) tickHandle = setInterval(tickTimers, 250); }
  else { clearInterval(tickHandle); tickHandle = 0; }
}

function paintTimers() {
  timers.forEach(t => {
    const el = $(`.timer[data-id="${t.id}"]`);
    if (!el) return;
    const left = leftOf(t);
    $(".t-left", el).textContent = t.done ? "Done" : fmtClock(left);
    $(".t-fill", el).style.strokeDashoffset = String(100 - (t.done ? 100 : (1 - left / t.total) * 100));
  });
}

function tickTimers() {
  let finished = false;
  timers.forEach(t => {
    if (!t.done && !t.paused && Date.now() >= t.end) { t.done = true; finished = true; }
  });
  if (finished) { saveTimers(); renderTimers(); ring(); }
  else paintTimers();
}

function ring() {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    // without a tap on this page load the browser keeps sound locked; notes queued now
    // would all play later, at the next tap, so skip them
    if (audio.state !== "running") throw 0;
    const now = audio.currentTime;
    [0, .22, .44, 1.2, 1.42, 1.64, 2.4, 2.62, 2.84].forEach((at, i) => {
      const o = audio.createOscillator(), g = audio.createGain();
      o.type = "sine"; o.frequency.value = i % 3 === 2 ? 1318.5 : 987.8;
      g.gain.setValueAtTime(0, now + at);
      g.gain.linearRampToValueAtTime(.22, now + at + .015);
      g.gain.exponentialRampToValueAtTime(.001, now + at + .2);
      o.connect(g).connect(audio.destination);
      o.start(now + at); o.stop(now + at + .22);
    });
  } catch (_) {}
  navigator.vibrate?.([280, 120, 280, 120, 520]);
  paintTitle();
}

const paintTitle = () => { document.title = (timers.some(t => t.done) ? "⏰ Timer done · " : "") + baseTitle; };

function timerAction(btn) {
  const el = btn.closest(".timer"), t = timers.find(x => x.id === el.dataset.id);
  if (!t) return;
  const act = btn.dataset.t;
  if (act === "x") timers = timers.filter(x => x !== t);
  if (act === "add") { if (t.paused) t.left += 60; else t.end += 60000; t.total += 60; }
  if (act === "pause") {
    if (t.paused) { t.end = Date.now() + t.left * 1000; t.paused = false; }
    else { t.left = leftOf(t); t.paused = true; }
  }
  paintTitle();
  saveTimers();
  renderTimers();
}

/* ============================================================
   KEEP THE SCREEN ON
   A phone propped against the backsplash should not go dark halfway
   through step four. Released when the recipe closes.
   ============================================================ */
let wakeLock = null, wakeWanted = false;
async function setWake(on) {
  wakeWanted = on;
  try {
    if (on && !wakeLock) {
      const lock = await navigator.wakeLock.request("screen");
      if (!wakeWanted || wakeLock) { lock.release(); paintWake(); return; }
      wakeLock = lock;
      wakeLock.addEventListener("release", () => { wakeLock = null; paintWake(); });
    } else if (!on && wakeLock) {
      await wakeLock.release();
      wakeLock = null;
    }
  } catch (_) { wakeWanted = false; }
  paintWake();
}
function paintWake() {
  const b = $("#m-wake");
  b.setAttribute("aria-pressed", String(!!wakeLock));
  b.classList.toggle("on", !!wakeLock);
  $(".wake-txt", b).textContent = wakeLock ? "Screen stays on" : "Keep screen on";
}

/* ============================================================
   MODAL
   ============================================================ */
let currentDay = null, lastFocus = null, closing = null;

function sourceLine(d) {
  const s = d.source;
  if (!s.url) return `<span class="src-orig">Built for this plan</span>`;
  const rate = s.rating != null
    ? `<span class="stars">${stars(s.rating)}</span><span class="rate-n">${s.rating}</span><span class="rev">${Number(s.reviews).toLocaleString("en-US")} reviews</span>`
    : "";
  return `${rate}<a class="src-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a>`;
}

const tickable = (inner, cls = "") =>
  `<div class="tickable${cls}" role="checkbox" aria-checked="false" tabindex="0">${inner}</div>`;

function setInert(on) {
  document.body.classList.toggle("modal-open", on);
  $$("body > header, body > main, body > footer, #dock").forEach(el => { el.inert = on; });
}

function openDay(n, push = true, from = null) {
  const d = DAYS.find(x => x.day === n);
  if (!d) return;
  const dlg = $("#modal"), panel = $(".modal-panel");
  const wasOpen = dlg.classList.contains("open") && !closing;
  const dir = wasOpen && currentDay ? Math.sign(n - currentDay) : 0;
  if (!wasOpen && !closing) lastFocus = document.activeElement;
  closing = null;
  panel.getAnimations().forEach(a => a.cancel());
  $(".modal-scrim").getAnimations().forEach(a => a.cancel());

  currentDay = n;
  const hash = `#${MONTH.key}-${n}`;
  if (push && location.hash !== hash) history.replaceState(null, "", hash);

  const p = PROTEINS[d.protein];
  $("#mb-no").innerHTML = `DAY <b>${pad2(d.day)}</b> / ${DAYS.length} <span>· ${esc(d.dow.slice(0, 3))} ${shortDate(d.date)}</span>`;
  $("#m-prev").disabled = n <= 1;
  $("#m-next").disabled = n >= DAYS.length;

  const totalIng = d.ingredients.reduce((a, g) => a + g.i.length, 0);
  const label = heroLabel(d.day);

  $("#modal-body").innerHTML = `
    <div class="m-art" style="${pcVar(d.protein)}">
      <div class="m-stage" role="img" aria-label="Illustration of ${esc(d.title)}">${stagePlate(d)}</div>
      <span class="m-hint" aria-hidden="true">Drag to turn the plate</span>
    </div>
    <div class="m-head" style="${pcVar(d.protein)}">
      <div class="m-kick">
        <span class="tag-p">${glyph(d.protein, 11)}${esc(p.label)}</span>
        ${/^Night /.test(label) ? "" : `<span class="m-when">${esc(label)}</span>`}
      </div>
      <h2 id="modal-title">${esc(d.title)}</h2>
      <p class="m-blurb">${esc(d.blurb)}</p>
      <div class="m-source">${sourceLine(d)}</div>
      ${verdictRow(MONTH.key, d.day)}
      <div class="m-stats">
        <div><b>${esc(d.time)}</b><span>total</span></div>
        <div><b>${esc(d.active)}</b><span>hands-on</span></div>
        <div><b>${d.serves}</b><span>servings</span></div>
        <div><b>${esc(d.cost)}</b><span>cost</span></div>
      </div>
      ${d.tags?.length ? `<div class="m-tags">${d.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
      ${proteinBars(d.protein_g)}
    </div>

    <div class="m-cols">
      <div>
        <h3 class="m-h">Ingredients <small>${totalIng} items · tap to tick off</small></h3>
        ${d.ingredients.map(gp => `
          <div class="ing-group">
            <h4>${esc(gp.g)}</h4>
            <ul>${gp.i.map(i => `<li>${tickable(`<span class="mark">${ICON.check}</span><span class="txt">${esc(i)}</span>`)}</li>`).join("")}</ul>
          </div>`).join("")}
      </div>
      <div>
        <h3 class="m-h">Method <small>${d.steps.length} steps · tap a time to start a timer</small></h3>
        <ol class="steps">${d.steps.map((s, k) => `<li><div class="tickable"><button type="button" class="n" aria-pressed="false" aria-label="Step ${k + 1} done"></button><span class="txt">${withTimers(s, k + 1)}</span></div></li>`).join("")}</ol>
      </div>
    </div>

    <div class="m-swaps">
      <h3 class="m-h">Swaps that keep it compliant</h3>
      <ul>${d.swaps.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
    </div>
    ${d.leftovers ? `<div class="m-left"><b>Plan ahead</b><p>${esc(d.leftovers)}</p></div>` : ""}`;

  const stage = $(".m-stage");
  FX.dragTurn(stage);
  FX.stageTilt($(".m-art"));

  if (!wasOpen) {
    dlg.classList.add("open");
    dlg.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setInert(true);
    $(".modal-inner").scrollTop = 0;
    FX.zoomIn(panel, from);
    $("#modal-close").focus({ preventScroll: true });
    $("#m-wake").hidden = !("wakeLock" in navigator);
    paintWake();
  } else {
    $(".modal-inner").scrollTo({ top: 0, behavior: FX.motionOK() ? "smooth" : "auto" });
    FX.slide($("#modal-body"), dir);
  }
}

function closeModal(instant = false) {
  const dlg = $("#modal");
  if (!dlg.classList.contains("open") || closing) return;
  if (/^#[a-z]{3}-\d+$/.test(location.hash)) history.replaceState(null, "", location.pathname);
  currentDay = null;
  setWake(false);
  setInert(false);
  if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });

  // a token, so a close that is overtaken by a reopen does not hide the new one
  const token = {};
  closing = token;
  const finish = () => {
    if (closing !== token) return;
    closing = null;
    dlg.classList.remove("open");
    dlg.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    $(".modal-panel").getAnimations().forEach(a => a.cancel());
    $(".modal-scrim").getAnimations().forEach(a => a.cancel());
  };
  if (instant) return finish();
  FX.zoomOut($(".modal-panel"), $(".modal-scrim")).then(finish);
}

/* ============================================================
   VERDICTS
   After a night is cooked, one tap says whether it comes back.
   Kept per night (a December repeat is judged on its own), in this
   browser, and gathered into one list across all five months that
   January gets planned from.
   ============================================================ */
const VKEY = "mealplan26:verdicts";
let verdicts = {};
try { verdicts = JSON.parse(store.get(VKEY) || "{}") || {}; } catch (_) { verdicts = {}; }
const verdictOf = (mkey, day) => verdicts[`${mkey}-${day}`] || null;
const VERDICT_SAYS = { again: ", marked make again", skip: ", marked skip" };
const VERDICT_ICON = {
  again: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M12 20.5 4.3 13a4.9 4.9 0 0 1 0-7 4.8 4.8 0 0 1 6.9 0l.8.8.8-.8a4.8 4.8 0 0 1 6.9 0 4.9 4.9 0 0 1 0 7L12 20.5Z"/></svg>',
  skip: '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" d="m7 7 10 10M17 7 7 17"/></svg>'
};

function verdictRow(mkey, day) {
  const v = verdictOf(mkey, day), key = `${mkey}-${day}`;
  return `
    <div class="m-verdict" data-for="${key}">
      <span class="mv-q">Cooked it? Would you make it again?</span>
      <span class="mv-btns">
        <button type="button" class="vbtn again" data-verdict="again" data-key="${key}" aria-pressed="${v === "again"}">${VERDICT_ICON.again}Make again</button>
        <button type="button" class="vbtn pass" data-verdict="skip" data-key="${key}" aria-pressed="${v === "skip"}">${VERDICT_ICON.skip}Skip next time</button>
      </span>
    </div>`;
}

/* tapping the verdict a night already has takes it back */
function setVerdict(key, v) {
  if (verdicts[key] === v) delete verdicts[key]; else verdicts[key] = v;
  store.set(VKEY, JSON.stringify(verdicts));
  const now = verdicts[key] || null;
  const [mkey, day] = [key.slice(0, 3), +key.slice(4)];

  $$(`[data-verdict][data-key="${key}"]`).forEach(b => {
    const on = b.dataset.verdict === now;
    b.setAttribute("aria-pressed", String(on));
    if (on) FX.rerun([b], { frames: [{ transform: "scale(.86)" }, { transform: "scale(1.06)" }, { transform: "none" }], duration: 420 });
  });
  if (mkey === MONTH.key) {
    $$(`.card[data-day="${day}"], .glance-cell[data-day="${day}"]`).forEach(el => {
      el.classList.toggle("v-again", now === "again");
      el.classList.toggle("v-skip", now === "skip");
      el.setAttribute("aria-label", el.dataset.label + (VERDICT_SAYS[now] || ""));
    });
    const chip = $(".fbtn.keep");
    if (chip) { const n = keepCount(); chip.hidden = !n; $("b", chip).textContent = n; if (!n && filterKeep) filterKeep = false; }
    applyFilters();
  }
  renderKeepers();
}

const monthOf = (key) => PLAN_MONTHS.find(m => m.key === key);
const nightOf = (mkey, day) => monthOf(mkey)?.days.find(d => d.day === day);

/* open any night in any month, switching to that month first if need be */
function openNight(ref) {
  const [mkey, day] = [ref.slice(0, 3), +ref.slice(4)];
  if (mkey !== MONTH.key) switchMonth(mkey);
  openDay(day, true, null);
}

let catchupAll = false;

function renderKeepers() {
  const host = $("#keepers-body");
  if (!host) return;
  const now = today();
  const rows = [];
  PLAN_MONTHS.forEach(m => m.days.forEach(d => rows.push({ m, d, key: `${m.key}-${d.day}`, v: verdictOf(m.key, d.day), past: atDay(d.date) < now })));
  const again = rows.filter(r => r.v === "again"), skip = rows.filter(r => r.v === "skip");
  // most recent first: what you cooked this week is what you remember best
  const unrated = rows.filter(r => r.past && !r.v).reverse();
  const shownUnrated = catchupAll ? unrated : unrated.slice(0, 6);

  const line = (r) => `
    <li class="kp-row" style="${pcVar(r.d.protein)}">
      <span class="kp-glyph">${glyph(r.d.protein, 15)}</span>
      <button type="button" class="kp-title" data-open="${r.key}">${esc(r.d.title)}</button>
      <span class="kp-when">${esc(r.d.dow.slice(0, 3))} ${shortDate(r.d.date)}</span>
      ${r.d.source.rating != null ? `<span class="kp-rate">★ ${r.d.source.rating}</span>` : ""}
    </li>`;
  const quick = (r) => `
    <li class="kp-row" style="${pcVar(r.d.protein)}">
      <span class="kp-glyph">${glyph(r.d.protein, 15)}</span>
      <button type="button" class="kp-title" data-open="${r.key}">${esc(r.d.title)}</button>
      <span class="kp-when">${esc(r.d.dow.slice(0, 3))} ${shortDate(r.d.date)}</span>
      <span class="kp-quick">
        <button type="button" class="vbtn again sm" data-verdict="again" data-key="${r.key}" aria-pressed="false" aria-label="Make ${esc(r.d.title)} again">${VERDICT_ICON.again}</button>
        <button type="button" class="vbtn pass sm" data-verdict="skip" data-key="${r.key}" aria-pressed="false" aria-label="Skip ${esc(r.d.title)} next time">${VERDICT_ICON.skip}</button>
      </span>
    </li>`;

  host.innerHTML = `
    <div class="kp-top">
      <span class="kp-count again">${VERDICT_ICON.again}<b>${again.length}</b> make again</span>
      <span class="kp-count pass">${VERDICT_ICON.skip}<b>${skip.length}</b> skip</span>
      <span class="kp-count">${unrated.length ? `<b>${unrated.length}</b> cooked, not yet rated` : "Everything cooked so far is rated"}</span>
      <button type="button" class="btn-sm" id="copy-verdicts"${again.length || skip.length ? "" : " disabled"}>Copy the list for January</button>
    </div>
    ${unrated.length ? `
    <div class="kp-catch">
      <h3>Catch up on what you have cooked</h3>
      <p>One tap each. Most recent first.</p>
      <ul>${shownUnrated.map(quick).join("")}</ul>
      ${unrated.length > shownUnrated.length ? `<button type="button" class="btn-sm" id="catchup-more">Show all ${unrated.length}</button>` : ""}
    </div>` : ""}
    <div class="kp-lists">
      <div class="kp-list again">
        <h3>${VERDICT_ICON.again}Make again</h3>
        ${again.length ? `<ul>${again.map(line).join("")}</ul>` : `<p class="kp-empty">Nothing yet. Open a night you have cooked and tap Make again.</p>`}
      </div>
      <div class="kp-list pass">
        <h3>${VERDICT_ICON.skip}Skip next time</h3>
        ${skip.length ? `<ul>${skip.map(line).join("")}</ul>` : `<p class="kp-empty">Nothing yet. These stay out of January.</p>`}
      </div>
    </div>`;
}

/* plain text, ready to paste into a message: this is the brief for January */
function copyVerdicts(btn) {
  const rows = [];
  PLAN_MONTHS.forEach(m => m.days.forEach(d => { const v = verdictOf(m.key, d.day); if (v) rows.push({ m, d, v }); }));
  const fmt = ({ d }) => `  - ${d.title} (${shortDate(d.date)}, ${PROTEINS[d.protein].label.toLowerCase()}${d.source.url ? `, ${d.source.name}` : ""})`;
  const txt = [
    `Megan's Grand Mealplan: verdicts as of ${(t => `${t.getDate()} ${MONTHS[t.getMonth() + 1]}`)(today())}`, "",
    `MAKE AGAIN (${rows.filter(r => r.v === "again").length})`, ...rows.filter(r => r.v === "again").map(fmt), "",
    `SKIP (${rows.filter(r => r.v === "skip").length})`, ...rows.filter(r => r.v === "skip").map(fmt)
  ].join("\n");
  navigator.clipboard?.writeText(txt).then(() => {
    const old = btn.textContent;
    btn.textContent = "Copied"; btn.classList.add("ok");
    setTimeout(() => { btn.textContent = old; btn.classList.remove("ok"); }, 1600);
  }).catch(() => {});
}

/* ============================================================
   STATIC SECTIONS
   ============================================================ */
function renderRules() {
  const li = r => `<li><b>${esc(r.t)}</b><span>${esc(r.d)}</span></li>`;
  $("#rules-out").innerHTML = RULES.out.map(li).join("");
  $("#rules-in").innerHTML = RULES.in.map(li).join("");
  $("#rules-watch").innerHTML = RULES.watch.map(li).join("");

  $("#protein-note").innerHTML = `
    <h3>${esc(PROTEIN_NOTE.title)}</h3>
    <p>${esc(PROTEIN_NOTE.body)}</p>
    <h5>The numbers behind it</h5>
    <ul class="pro-list">${PROTEIN_NOTE.how.map(l => `<li>${esc(l)}</li>`).join("")}</ul>
    <h5>What the figures do not tell you</h5>
    <p>${esc(PROTEIN_NOTE.caveat)}</p>
    <h5>Turning it up or down</h5>
    <p>${esc(PROTEIN_NOTE.adjust)}</p>`;

  $("#meatball-note").innerHTML = `
    <h3>${esc(MEATBALL_NOTE.title)}</h3>
    <p>${esc(MEATBALL_NOTE.body)}</p>
    <h5>The label must say none of these</h5>
    <ul class="mb-list">${MEATBALL_NOTE.look.map(l => `<li>${esc(l)}</li>`).join("")}</ul>
    <h5>What I could verify</h5>
    <p>${esc(MEATBALL_NOTE.where)}</p>
    <h5>If nothing qualifies</h5>
    <p>${esc(MEATBALL_NOTE.fallback)}</p>`;
}

function renderMethod() {
  $("#method-note").innerHTML = (MONTH.method || []).map(sec => `
    <h3>${esc(sec.h)}</h3>
    ${sec.p.map(t => `<p>${esc(t)}</p>`).join("")}`).join("");
}

function renderPrep() {
  $("#prep-list").innerHTML = PREP.map((p, i) => `
    <div class="prep-card" data-reveal style="--i:${i % 3}">
      <h3><span class="prep-w">Week ${p.w}</span>${esc(p.day)}</h3>
      <ul>${p.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>`).join("");
}

/* ---------- groceries ---------- */
const LSK = "mealplan26:groceries";
let checked = {};
try { checked = JSON.parse(store.get(LSK) || "{}"); } catch (_) { checked = {}; }
const saveChecks = () => store.set(LSK, JSON.stringify(checked));

function renderGroceries() {
  $("#grocery-list").innerHTML = GROCERIES.map(t => `
    <section class="trip" id="trip-${t.trip}" data-reveal>
      <header class="trip-head">
        <div class="trip-id">
          <span class="trip-badge">Trip ${t.trip}</span>
          <h3>${esc(t.when)}</h3>
          <p class="trip-covers">Covers ${esc(t.covers)} · est. ${esc(t.est)}</p>
        </div>
        <div class="trip-actions">
          <span class="trip-progress" data-trip="${t.trip}">
            <svg viewBox="0 0 44 44" aria-hidden="true"><circle class="tp-track" cx="22" cy="22" r="18"/><circle class="tp-fill" cx="22" cy="22" r="18" pathLength="100"/></svg>
            <b></b>
          </span>
          <button class="btn-sm" data-copy="${t.trip}">Copy list</button>
          <button class="btn-sm" data-print="${t.trip}">Print this list</button>
        </div>
      </header>
      <p class="trip-note">${esc(t.note)}</p>
      <div class="trip-sections">
        ${t.sections.map((sec, si) => `
          <div class="gsec">
            <h5>${esc(sec.name)}</h5>
            <ul>${sec.items.map((it, ii) => {
              const key = `${MONTH.key}.${t.trip}.${si}.${ii}`;
              return `<li><label class="gitem${checked[key] ? " done" : ""}">
                <input type="checkbox" data-key="${key}"${checked[key] ? " checked" : ""}>
                <span class="box" aria-hidden="true">${ICON.check}</span><span class="txt">${esc(it)}</span></label></li>`;
            }).join("")}</ul>
          </div>`).join("")}
      </div>
    </section>`).join("");
  GROCERIES.forEach(t => updateProgress(t.trip));
  updateTotal();
}

/* returns true when this call is the one that completed the trip */
function updateProgress(trip) {
  const boxes = $$(`#trip-${trip} input[type=checkbox]`);
  const done = boxes.filter(b => b.checked).length;
  const el = $(`.trip-progress[data-trip="${trip}"]`);
  if (!el) return false;
  const all = done === boxes.length && boxes.length > 0;
  const was = el.classList.contains("all");
  $("b", el).textContent = `${done}/${boxes.length}`;
  $(".tp-fill", el).style.strokeDashoffset = String(100 - (boxes.length ? done / boxes.length * 100 : 0));
  el.classList.toggle("all", all);
  el.setAttribute("aria-label", `${done} of ${boxes.length} ticked`);
  return all && !was;
}

function updateTotal() {
  const boxes = $$("#grocery-list input[type=checkbox]");
  const done = boxes.filter(b => b.checked).length;
  const pct = boxes.length ? (done / boxes.length * 100) : 0;
  $("#gtotal").innerHTML = `<b>${done}</b> of <b>${boxes.length}</b> items ticked off`;
  $("#gmeter-fill").style.width = pct + "%";
  $("#gring-fill").style.strokeDashoffset = String(100 - pct);
  $("#gring-pct").textContent = `${Math.round(pct)}%`;
}

function copyTrip(trip) {
  const t = GROCERIES.find(x => x.trip === trip);
  const txt = [`SHOPPING LIST. ${t.when}. Covers ${t.covers}.`, ""]
    .concat(t.sections.flatMap(s => [s.name.toUpperCase(), ...s.items.map(i => `  - ${i}`), ""]))
    .join("\n");
  navigator.clipboard?.writeText(txt).then(() => {
    const b = $(`[data-copy="${trip}"]`), old = b.textContent;
    b.textContent = "Copied"; b.classList.add("ok");
    setTimeout(() => { b.textContent = old; b.classList.remove("ok"); }, 1600);
  }).catch(() => {});
}

const proteinColors = () => {
  const cs = getComputedStyle(document.documentElement);
  return Object.keys(PROTEINS).map(k => cs.getPropertyValue(`--p-${k}`).trim()).filter(Boolean)
    .concat([cs.getPropertyValue("--good").trim()]);
};

/* ---------- sharing ---------- */
/* Native share sheet on a phone, clipboard everywhere else. Always shares the
   plan's front door rather than whatever #day- hash happens to be open. */
async function sharePlan(btn) {
  const url = location.origin + location.pathname;
  const data = {
    title: "Megan's Grand Mealplan",
    text: `${PLAN_TOTAL.nights} dinners across ${(MONTH_WORD[PLAN_TOTAL.months] || "").toLowerCase()} months. No dairy, no starch, no added sugar, no seed oils.`,
    url
  };
  if (navigator.share) {
    try { await navigator.share(data); return; }
    catch (e) { if (e && e.name === "AbortError") return; }   // user dismissed the sheet
  }
  try {
    await navigator.clipboard.writeText(url);
    flashShared(btn, "Link copied");
  } catch (_) {
    flashShared(btn, "Copy failed");
  }
}

function flashShared(btn, msg) {
  if (!btn) return;
  const live = $("#share-status");
  if (live) live.textContent = msg;
  if (btn.dataset.label !== undefined) {
    const old = btn.textContent;
    btn.textContent = msg;
    btn.classList.add("ok");
    setTimeout(() => { btn.textContent = old; btn.classList.remove("ok"); }, 1800);
  } else {
    btn.classList.add("ok");
    setTimeout(() => btn.classList.remove("ok"), 1800);
  }
}

/* ---------- theme + nav ---------- */
const THEME_BG = { light: "#f6f1e9", dark: "#12100e" };

function paintThemeColor(theme) {
  $$('meta[name="theme-color"]').forEach(m => { m.content = THEME_BG[theme]; });
}

function initTheme() {
  const saved = document.documentElement.getAttribute("data-theme");
  if (saved) paintThemeColor(saved);
  $("#theme-toggle").addEventListener("click", e => {
    const cur = document.documentElement.getAttribute("data-theme")
      || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    FX.themeSwap(() => {
      document.documentElement.setAttribute("data-theme", next);
      paintThemeColor(next);
    }, e.currentTarget);
    store.set("mealplan26:theme", next);
  });
}

function initNav() {
  const links = $$(".nav-link");
  const ids = [...new Set(links.map(l => l.getAttribute("href").slice(1)))];
  const secs = ids.map(id => document.getElementById(id)).filter(Boolean);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle("on", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  secs.forEach(s => obs.observe(s));
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // the tools/ pages load this file for its renderers only
  if (!$("#weeks-list")) return;

  /* Which month opens first, in order: a #sep-12 style link, then whatever
     you last looked at, then the month today actually falls in. */
  const deep = /^#([a-z]{3})-(\d+)$/.exec(location.hash);
  let start = null;
  if (deep && PLAN_MONTHS.some(m => m.key === deep[1])) start = deep[1];
  if (!start) {
    const saved = store.get("mealplan26:month");
    if (saved && PLAN_MONTHS.some(m => m.key === saved)) start = saved;
  }
  selectMonth(start || monthForToday());

  renderRules();
  renderMonth();
  renderKeepers();
  renderTimers();
  initTheme();
  initNav();
  FX.hero($("#hero"));
  FX.scroll();
  FX.tilt($("#weeks-list"), ".card");
  FX.dragTurn($("#stage-plate"));
  document.fonts?.ready.then(placeMonthMarker);
  initOffline();
  addEventListener("resize", placeMonthMarker);

  if (deep) openDay(+deep[2], false);

  // a night's link followed while the site is already open
  addEventListener("hashchange", () => {
    const m = /^#([a-z]{3})-(\d+)$/.exec(location.hash);
    if (!m || !PLAN_MONTHS.some(x => x.key === m[1])) return;
    if (m[1] !== MONTH.key) switchMonth(m[1]);
    openDay(+m[2]);
  });

  document.addEventListener("click", e => {
    // a cooking time inside a step starts a timer rather than ticking the step
    const tc = e.target.closest(".tchip");
    if (tc) {
      const d = DAYS.find(x => x.day === currentDay);
      startTimer(+tc.dataset.secs, d ? d.title : "", `Step ${tc.dataset.step} · ${tc.textContent.trim()}`);
      return;
    }
    const tb = e.target.closest(".t-btn");
    if (tb) return timerAction(tb);

    // tick an ingredient or a step off while cooking
    const tick = e.target.closest(".tickable");
    if (tick) return toggleTick(tick);

    if (e.target.closest("[data-close]") || e.target.closest("#modal-close")) return closeModal();
    if (e.target.closest("#m-prev")) return currentDay != null && openDay(currentDay - 1);
    if (e.target.closest("#m-next")) return currentDay != null && openDay(currentDay + 1);
    if (e.target.closest("#m-wake")) return setWake(!wakeLock);

    const mt = e.target.closest("[data-month]");
    if (mt) {
      switchMonth(mt.dataset.month);
      if (mt.classList.contains("mtab")) $("#glance").scrollIntoView({ behavior: FX.motionOK() ? "smooth" : "auto", block: "start" });
      return;
    }

    if (e.target.closest("#stage-plate, #ticket-open")) return openDay(heroDay, true, $("#stage-plate"));
    if (e.target.closest("#ticket-prev")) return renderHero(heroDay - 1, -1);
    if (e.target.closest("#ticket-next")) return renderHero(heroDay + 1, 1);

    const cell = e.target.closest(".glance-cell");
    if (cell) return openDay(+cell.dataset.day, true, cell);
    const card = e.target.closest(".card");
    if (card) return openDay(+card.dataset.day, true, card);

    const rot = e.target.closest(".rot-row");
    if (rot) {
      filterProtein = filterProtein === rot.dataset.filter ? "all" : rot.dataset.filter;
      applyFilters();
      $("#plan").scrollIntoView({ behavior: FX.motionOK() ? "smooth" : "auto" });
      return;
    }

    const fb = e.target.closest(".fbtn");
    if (fb) {
      if (fb.dataset.quick) filterQuick = !filterQuick;
      else if (fb.dataset.keep) filterKeep = !filterKeep;
      else filterProtein = fb.dataset.filter;
      return applyFilters();
    }

    const vb = e.target.closest("[data-verdict]");
    if (vb) return setVerdict(vb.dataset.key, vb.dataset.verdict);
    const kp = e.target.closest("[data-open]");
    if (kp) return openNight(kp.dataset.open);
    if (e.target.closest("#copy-verdicts")) return copyVerdicts(e.target.closest("#copy-verdicts"));
    if (e.target.closest("#catchup-more")) { catchupAll = true; return renderKeepers(); }

    const sh = e.target.closest("#share-btn, #foot-share");
    if (sh) return sharePlan(sh);

    const cp = e.target.closest("[data-copy]");
    if (cp) return copyTrip(+cp.dataset.copy);

    const pr = e.target.closest("[data-print]");
    if (pr) return printGroceries(+pr.dataset.print);
  });

  $("#search").addEventListener("input", applyFilters);
  $("#search-clear").addEventListener("click", () => { $("#search").value = ""; applyFilters(); $("#search").focus(); });

  document.addEventListener("keydown", e => {
    const open = $("#modal").classList.contains("open") && !closing;
    // the tick-off rows are checkboxes in all but tag name
    if ((e.key === " " || e.key === "Enter") && e.target.classList?.contains("tickable")) {
      e.preventDefault(); return toggleTick(e.target);
    }
    if (e.key === "Escape" && open) return closeModal();
    if (open && e.key === "ArrowLeft" && currentDay > 1) return openDay(currentDay - 1);
    if (open && e.key === "ArrowRight" && currentDay < DAYS.length) return openDay(currentDay + 1);
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || e.metaKey || e.ctrlKey || e.altKey;
    if (!open && e.key === "/" && !typing) {
      e.preventDefault(); $("#search").focus();
    }
    if (!open && (e.key === "[" || e.key === "]") && !typing) {
      const i = PLAN_MONTHS.findIndex(m => m.key === MONTH.key);
      const next = PLAN_MONTHS[e.key === "[" ? i - 1 : i + 1];
      if (next) switchMonth(next.key);
    }
  });

  /* swipe between nights on a phone; the plate itself is for turning */
  let touch = null;
  $("#modal-body").addEventListener("touchstart", e => {
    touch = e.target.closest(".m-stage") ? null : { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, { passive: true });
  $("#modal-body").addEventListener("touchend", e => {
    if (!touch || currentDay == null) return;
    const dx = e.changedTouches[0].clientX - touch.x, dy = e.changedTouches[0].clientY - touch.y;
    touch = null;
    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    const n = currentDay + (dx < 0 ? 1 : -1);
    if (n >= 1 && n <= DAYS.length) openDay(n);
  }, { passive: true });

  $("#grocery-list").addEventListener("change", e => {
    const box = e.target.closest("input[type=checkbox]");
    if (!box) return;
    if (box.checked) checked[box.dataset.key] = true; else delete checked[box.dataset.key];
    box.closest(".gitem").classList.toggle("done", box.checked);
    saveChecks();
    const trip = +box.dataset.key.split(".")[1];
    if (updateProgress(trip)) FX.confetti($(`.trip-progress[data-trip="${trip}"]`), proteinColors());
    updateTotal();
  });

  $("#reset-checks").addEventListener("click", () => {
    // only clears the month on screen, so August's ticks survive a September reset
    Object.keys(checked).forEach(k => { if (k.startsWith(MONTH.key + ".")) delete checked[k]; });
    saveChecks();
    $$("#grocery-list input[type=checkbox]").forEach(b => { b.checked = false; b.closest(".gitem").classList.remove("done"); });
    GROCERIES.forEach(t => updateProgress(t.trip));
    updateTotal();
  });

  $("#print-all").addEventListener("click", () => printGroceries());
  $("#print-groceries").addEventListener("click", () => printGroceries());

  // a wake lock is dropped whenever the tab is hidden; take it back on return
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && wakeWanted && !wakeLock && $("#modal").classList.contains("open")) setWake(true);
    if (document.visibilityState === "visible") tickTimers();
  });
});

/* ---------- offline ----------
   The service worker keeps a copy of the site for when there is no signal.
   Only on https (or this machine), where browsers allow one. */
function initOffline() {
  const secure = location.protocol === "https:" || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if ("serviceWorker" in navigator && secure) {
    addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
  }
  const pill = $("#netstate");
  let t = 0;
  const paint = (back) => {
    clearTimeout(t);
    if (!navigator.onLine) {
      pill.textContent = "No signal. Showing your saved copy; ticks, timers and verdicts still save.";
      pill.className = "netstate off"; pill.hidden = false;
    } else if (back) {
      pill.textContent = "Back online.";
      pill.className = "netstate on"; pill.hidden = false;
      t = setTimeout(() => { pill.hidden = true; }, 2400);
    } else pill.hidden = true;
  };
  addEventListener("offline", () => paint());
  addEventListener("online", () => paint(true));
  paint();
}

function toggleTick(el) {
  const on = el.classList.toggle("on");
  if (el.getAttribute("role") === "checkbox") el.setAttribute("aria-checked", String(on));
  el.querySelector(".n")?.setAttribute("aria-pressed", String(on));
}

/* Printing only ever produces the shopping list, either all five trips or a
   single one. Nothing else on the page goes to paper. */
function printGroceries(trip) {
  closeModal(true);
  document.body.classList.add("print-groceries");
  if (trip) document.body.dataset.printTrip = String(trip);

  const clean = () => {
    document.body.classList.remove("print-groceries");
    delete document.body.dataset.printTrip;
  };
  window.addEventListener("afterprint", clean, { once: true });
  setTimeout(clean, 3000);
  window.print();
}
