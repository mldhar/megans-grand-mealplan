/* ============================================================
   Megan's Grand August Mealplan
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
};

const VEG_SIZE = {
  zucchini: 11, squash: 11, cucumber: 10, radish: 9.5, tomato: 10, pepper: 7.5, onion: 8,
  olive: 6.5, broccoli: 15, cauliflower: 14, greens: 9.5, cabbage: 8, greenbean: 8,
  asparagus: 8, mushroom: 11, bokchoy: 13, avocado: 7.5, lemon: 11, lime: 10, egg: 11
};

const SAUCE = {
  green: (x, y, rnd) => blob(x, y, 74, 13, .35, rnd, 'fill="#4e7a2e" opacity=".26"') +
    [...Array(16)].map(() => { const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * 66; return `<circle cx="${(x + Math.cos(a) * d).toFixed(1)}" cy="${(y + Math.sin(a) * d * .8).toFixed(1)}" r="${(1.4 + rnd() * 2).toFixed(1)}" fill="#3d6b22" opacity=".5"/>`; }).join(""),
  red: (x, y, rnd) => blob(x, y, 76, 13, .3, rnd, 'fill="#b83a22" opacity=".3"') + blob(x + 6, y - 4, 52, 11, .35, rnd, 'fill="#c9482a" opacity=".28"'),
  brown: (x, y, rnd) => blob(x, y, 74, 13, .32, rnd, 'fill="#6b4620" opacity=".3"') + blob(x - 5, y + 5, 48, 10, .38, rnd, 'fill="#8a5c2c" opacity=".26"'),
};

/* Each dish is its own inline <svg>, so gradient/clip ids must be unique per
   instance or later SVGs resolve to the first definition in the document. */
const SVG_IDS = ["plateClip", "gChicken", "gChickenStrip", "gSteak", "gSteakStrip", "gMeatball",
  "gKofta", "gPatty", "gCrumbleBeef", "gCrumbleLamb", "gTomato", "gYolk", "gPlate", "gBoard"];
let artInstance = 0;

function namespaceIds(svg, suffix) {
  let out = svg;
  for (const id of SVG_IDS) {
    out = out.split(`id="${id}"`).join(`id="${id}-${suffix}"`)
             .split(`url(#${id})`).join(`url(#${id}-${suffix})`);
  }
  return out;
}

/* `wide` renders the same plate into a letterbox field for the modal header,
   so the dish is never cropped by the panel's aspect ratio. */
function dishArt(d, wide = false) {
  const rnd = mulberry32(d.day * 7919 + 13);
  const W = wide ? 900 : 400, H = wide ? 250 : 258;
  const cx = W / 2, cy = H / 2, R = wide ? 104 : 102;
  const art = d.art || { protein: "meatball", veg: ["greens"] };
  let g = "";

  if (art.sauce && SAUCE[art.sauce]) g += `<g clip-path="url(#plateClip)">${SAUCE[art.sauce](cx + 4, cy + 10, rnd)}</g>`;

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
    g += `<ellipse cx="${v.x.toFixed(1)}" cy="${(v.y + v.r * .34).toFixed(1)}" rx="${(v.r * 1.12).toFixed(1)}" ry="${(v.r * .82).toFixed(1)}" fill="#5c3f1c" opacity=".12"/>`;
    g += VEG_ART[v.kind](v.x, v.y, v.r, rnd);
  });

  g += (PROTEIN_ART[art.protein] || PROTEIN_ART.meatball)(hero.x, hero.y, rnd, 1.12);

  for (let i = 0; i < 22; i++) {
    const a = rnd() * Math.PI * 2, dist = Math.sqrt(rnd()) * (R - 12);
    const px = cx + Math.cos(a) * dist, py = cy + Math.sin(a) * dist * .92;
    g += `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(1.6 + rnd() * 1.8).toFixed(1)}" ry="${(.9 + rnd()).toFixed(1)}" fill="#3f6b28" opacity="${(.35 + rnd() * .4).toFixed(2)}" transform="${rot(px, py, rnd() * 180)}"/>`;
  }

  const tint = (PROTEINS[d.protein] || {}).hex || "#8a6a4e";

  const svg = `<svg class="dish-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustration of ${esc(d.title)}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <clipPath id="plateClip"><ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * .94}"/></clipPath>
    <radialGradient id="gChicken" cx="35%" cy="30%"><stop offset="0" stop-color="#efc079"/><stop offset="1" stop-color="#b9762f"/></radialGradient>
    <linearGradient id="gChickenStrip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f0cf94"/><stop offset="1" stop-color="#c58a3e"/></linearGradient>
    <linearGradient id="gSteak" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7a3f22"/><stop offset=".5" stop-color="#572814"/><stop offset="1" stop-color="#411d0f"/></linearGradient>
    <linearGradient id="gSteakStrip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7c4123"/><stop offset="1" stop-color="#4a2011"/></linearGradient>
    <radialGradient id="gMeatball" cx="34%" cy="30%"><stop offset="0" stop-color="#c8834c"/><stop offset="1" stop-color="#71391a"/></radialGradient>
    <linearGradient id="gKofta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b5723d"/><stop offset="1" stop-color="#6d381a"/></linearGradient>
    <radialGradient id="gPatty" cx="34%" cy="30%"><stop offset="0" stop-color="#9c5a2e"/><stop offset="1" stop-color="#5b2a12"/></radialGradient>
    <radialGradient id="gCrumbleBeef" cx="35%" cy="30%"><stop offset="0" stop-color="#a4643a"/><stop offset="1" stop-color="#5e2e15"/></radialGradient>
    <radialGradient id="gCrumbleLamb" cx="35%" cy="30%"><stop offset="0" stop-color="#b06d4d"/><stop offset="1" stop-color="#6b3120"/></radialGradient>
    <radialGradient id="gTomato" cx="34%" cy="28%"><stop offset="0" stop-color="#e8624a"/><stop offset="1" stop-color="#b62a1c"/></radialGradient>
    <radialGradient id="gYolk" cx="35%" cy="32%"><stop offset="0" stop-color="#ffd85e"/><stop offset="1" stop-color="#eda31d"/></radialGradient>
    <radialGradient id="gPlate" cx="34%" cy="26%"><stop offset="0" stop-color="#fffefb"/><stop offset="1" stop-color="#ebe5d8"/></radialGradient>
    <linearGradient id="gBoard" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".3"/><stop offset="1" stop-color="#3a2b18" stop-opacity=".14"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#e9e0cf"/>
  <rect width="${W}" height="${H}" fill="${tint}" opacity=".11"/>
  <rect width="${W}" height="${H}" fill="url(#gBoard)"/>
  <ellipse cx="${cx}" cy="${cy + 7}" rx="${R + 6}" ry="${R * .94 + 5}" fill="#2b1d0d" opacity=".12"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${R}" ry="${R * .94}" fill="url(#gPlate)"/>
  <ellipse cx="${cx}" cy="${cy}" rx="${R - 9}" ry="${R * .94 - 8}" fill="none" stroke="#d5cbb6" stroke-width="1.5" opacity=".8"/>
  ${g}
</svg>`;

  return namespaceIds(svg, `${d.day}-${artInstance++}`);
}

/* ============================================================
   HELPERS
   ============================================================ */
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shortDate = (iso) => { const [, m, d] = iso.split("-"); return `${+d} ${MONTHS[+m]}`; };

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
  clock: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  serves: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4v7a4 4 0 0 0 8 0V4M8 11v9M17 4c-1.5 2-2 4-2 6s.5 3 2 3 2-1 2-3-.5-4-2-6Zm0 9v7"/></svg>'
};

/* ============================================================
   HERO: the rotation board
   ============================================================ */
function renderRotation() {
  const counts = {};
  DAYS.forEach(d => counts[d.protein] = (counts[d.protein] || 0) + 1);
  const max = Math.max(...Object.values(counts));

  $("#rot-total").textContent = `${DAYS.length} nights`;
  $("#rot-rows").innerHTML = Object.entries(PROTEINS).map(([k, v]) => `
    <button class="rot-row" style="${pcVar(k)}" data-filter="${k}" title="Show the ${esc(v.label.toLowerCase())} nights">
      ${glyph(k, 19)}
      <span class="rot-name">${esc(v.label)}</span>
      <span class="rot-meter">
        <span class="rot-bar"><i style="width:${((counts[k] || 0) / max * 100).toFixed(0)}%"></i></span>
        <span class="rot-n">${counts[k] || 0}</span>
      </span>
    </button>`).join("");

  const sourced = DAYS.filter(d => d.source.url).length;

  // summed from the five trip estimates rather than hard-coded, so the
  // headline figure can never drift away from the actual lists
  const bounds = GROCERIES.reduce((acc, t) => {
    const n = (t.est.match(/\d+/g) || []).map(Number);
    acc[0] += n[0] || 0;
    acc[1] += n[1] ?? n[0] ?? 0;
    return acc;
  }, [0, 0]);

  $("#rot-foot").innerHTML = `
    <div><b>${GROCERIES.length}</b><span>shopping trips</span></div>
    <div><b>${sourced}</b><span>sourced recipes</span></div>
    <div><b>$${bounds[0]} to $${bounds[1]}</b><span>for the month</span></div>`;
}

/* how far off is the plan? */
function renderStatus() {
  const first = new Date("2026-08-01T00:00:00");
  const last = new Date("2026-08-30T00:00:00");
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const strip = $("#status-strip"), text = $("#status-text"), btn = $("#status-btn");

  if (now < first) {
    const days = Math.round((first - now) / 86400000);
    text.innerHTML = `The plan starts in <b>${days}</b> day${days === 1 ? "" : "s"}. First shop is <b>Fri 31 Jul</b>.`;
    btn.hidden = true;
  } else if (now > last) {
    text.innerHTML = `August 2026 is done. Everything below still works as a reference.`;
    btn.hidden = true;
  } else {
    const n = Math.round((now - first) / 86400000) + 1;
    const d = DAYS.find(x => x.day === n);
    if (!d) return;
    text.innerHTML = `Tonight is <b>day ${n}</b>: ${esc(d.title)}.`;
    btn.hidden = false;
    btn.onclick = () => openDay(n);
  }
  strip.hidden = false;
}

/* ============================================================
   GLANCE + WEEKS
   ============================================================ */
function renderGlance() {
  $("#glance-grid").innerHTML = DAYS.map(d => `
    <button class="glance-cell" data-day="${d.day}" data-protein="${d.protein}" style="${pcVar(d.protein)}"
            title="${esc(d.title)} (${esc(PROTEINS[d.protein].label)})"
            aria-label="Day ${d.day}, ${esc(d.dow)}: ${esc(d.title)}, ${esc(PROTEINS[d.protein].label)}">
      <span class="g-num">${d.day}</span>
      <span class="g-dow">${d.dow.slice(0, 3)}</span>
      <span class="g-glyph">${glyph(d.protein, 13)}</span>
    </button>`).join("");
}

function renderWeekNav() {
  $("#weeknav").innerHTML = WEEKS.map(w =>
    `<a href="#week-${w.n}"><b>Wk ${w.n}</b> ${esc(w.theme)} <span class="mono">${esc(w.dates)}</span></a>`).join("");
}

function renderWeeks() {
  $("#weeks-list").innerHTML = WEEKS.map(w => `
    <section class="week" id="week-${w.n}" data-week="${w.n}">
      <header class="week-head">
        <div class="week-title">
          <span class="week-badge">Week ${w.n}</span>
          <h3>${esc(w.theme)}</h3>
          <span class="week-dates">${esc(w.dates)}</span>
        </div>
        <p class="week-note">${esc(w.note)}</p>
        <p class="week-shop">Shop ${esc(w.shop)}</p>
      </header>
      <div class="cards">${DAYS.filter(d => d.week === w.n).map(cardHtml).join("")}</div>
    </section>`).join("");
}

function cardHtml(d) {
  const p = PROTEINS[d.protein];
  return `
  <button class="card" data-day="${d.day}" data-protein="${d.protein}" style="${pcVar(d.protein)}"
          aria-label="Open day ${d.day}: ${esc(d.title)}">
    <span class="card-art">${dishArt(d)}</span>
    <span class="card-head">
      <span class="card-no">DAY <b>${String(d.day).padStart(2, "0")}</b> · ${d.dow.slice(0, 3)} ${shortDate(d.date)}</span>
      <span class="tag-p">${glyph(d.protein, 11)}${esc(p.label)}</span>
    </span>
    <span class="card-body">
      <h4>${esc(d.title)}</h4>
      <span class="card-blurb">${esc(d.blurb)}</span>
      <span class="card-foot">
        <span class="stat">${ICON.clock}${esc(d.time)}</span>
        <span class="stat">${ICON.serves}${d.serves}</span>
        ${d.source.rating != null ? `<span class="stat rate">★ ${d.source.rating}</span>` : ""}
      </span>
    </span>
  </button>`;
}

/* ============================================================
   SEARCH + FILTER
   ============================================================ */
const searchIndex = new Map();
function buildIndex() {
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

function renderFilters() {
  const counts = {};
  DAYS.forEach(d => counts[d.protein] = (counts[d.protein] || 0) + 1);
  $("#filters").innerHTML =
    `<button class="fbtn active" data-filter="all">All nights <b>${DAYS.length}</b></button>` +
    Object.entries(PROTEINS).map(([k, v]) =>
      `<button class="fbtn" data-filter="${k}" style="${pcVar(k)}">${glyph(k, 13)}${esc(v.label)} <b>${counts[k] || 0}</b></button>`).join("") +
    `<button class="fbtn" data-quick="1" title="Recipes needing 15 minutes or less of hands-on work">Quick <b>≤15m</b></button>`;
}

function applyFilters() {
  const q = $("#search").value.trim().toLowerCase();
  $("#search-wrap").classList.toggle("has-value", q.length > 0);

  let shown = 0;
  DAYS.forEach(d => {
    const okProtein = filterProtein === "all" || d.protein === filterProtein;
    const okQuick = !filterQuick || toMins(d.active) <= 15;
    const okText = !q || searchIndex.get(d.day).includes(q);
    const on = okProtein && okQuick && okText;
    if (on) shown++;
    $$(`.card[data-day="${d.day}"], .glance-cell[data-day="${d.day}"]`).forEach(el => el.classList.toggle("hide", !on));
  });

  // collapse a week whose nights are all filtered out
  $$(".week").forEach(w => {
    w.style.display = w.querySelectorAll(".card:not(.hide)").length ? "" : "none";
  });

  $$(".fbtn").forEach(b => {
    if (b.dataset.quick) b.classList.toggle("active", filterQuick);
    else b.classList.toggle("active", b.dataset.filter === filterProtein);
  });

  $("#result-count").textContent = shown === DAYS.length ? `${DAYS.length} nights` : `${shown} of ${DAYS.length} nights`;
  $("#no-results").hidden = shown > 0;
}

/* ============================================================
   MODAL
   ============================================================ */
let currentDay = null, lastFocus = null;

function sourceLine(d) {
  const s = d.source;
  if (!s.url) return `<span class="src-orig">Built for this plan</span>`;
  const rate = s.rating != null
    ? `<span class="stars">${stars(s.rating)}</span><span class="rate-n">${s.rating}</span><span class="rev">${s.reviews} reviews</span>`
    : "";
  return `${rate}<a class="src-link" href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)} ↗</a>`;
}

function openDay(n, push = true) {
  const d = DAYS.find(x => x.day === n);
  if (!d) return;
  if (!$("#modal").classList.contains("open")) lastFocus = document.activeElement;
  currentDay = n;
  if (push && location.hash !== `#day-${n}`) history.replaceState(null, "", `#day-${n}`);

  const p = PROTEINS[d.protein];
  $("#mb-no").innerHTML = `DAY <b>${String(d.day).padStart(2, "0")}</b> / 30 · ${esc(d.dow)} ${shortDate(d.date)}`;
  $("#m-prev").disabled = n <= 1;
  $("#m-next").disabled = n >= DAYS.length;

  const totalIng = d.ingredients.reduce((a, g) => a + g.i.length, 0);

  $("#modal-body").innerHTML = `
    <div class="m-art">${dishArt(d, true)}</div>
    <div class="m-head" style="${pcVar(d.protein)}">
      <span class="tag-p">${glyph(d.protein, 11)}${esc(p.label)}</span>
      <h2 id="modal-title">${esc(d.title)}</h2>
      <p class="m-blurb">${esc(d.blurb)}</p>
      <div class="m-source">${sourceLine(d)}</div>
      <div class="m-stats">
        <div><b>${esc(d.time)}</b><span>total</span></div>
        <div><b>${esc(d.active)}</b><span>hands-on</span></div>
        <div><b>${d.serves}</b><span>servings</span></div>
        <div><b>${esc(d.cost)}</b><span>cost</span></div>
      </div>
      ${d.tags?.length ? `<div class="m-tags">${d.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>` : ""}
    </div>

    <div class="m-cols">
      <div>
        <h3 class="m-h">Ingredients <small>${totalIng} items · tap to tick off</small></h3>
        ${d.ingredients.map(gp => `
          <div class="ing-group">
            <h5>${esc(gp.g)}</h5>
            <ul>${gp.i.map(i => `<li><button class="tickable" type="button"><span class="mark"></span><span class="txt">${esc(i)}</span></button></li>`).join("")}</ul>
          </div>`).join("")}
      </div>
      <div>
        <h3 class="m-h">Method <small>${d.steps.length} steps</small></h3>
        <ol class="steps">${d.steps.map(s => `<li><button class="tickable" type="button"><span class="n"></span><span class="txt">${esc(s)}</span></button></li>`).join("")}</ol>
      </div>
    </div>

    <div class="m-swaps">
      <h3 class="m-h">Swaps that keep it compliant</h3>
      <ul>${d.swaps.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
    </div>
    ${d.leftovers ? `<div class="m-left"><b>Plan ahead</b><p>${esc(d.leftovers)}</p></div>` : ""}`;

  const dlg = $("#modal");
  dlg.classList.add("open");
  dlg.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  $(".modal-inner").scrollTop = 0;
  $("#modal-close").focus();
}

function closeModal() {
  const dlg = $("#modal");
  if (!dlg.classList.contains("open")) return;
  dlg.classList.remove("open");
  dlg.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (/^#day-\d+$/.test(location.hash)) history.replaceState(null, "", location.pathname);
  currentDay = null;
  if (lastFocus) lastFocus.focus();
}

/* ============================================================
   STATIC SECTIONS
   ============================================================ */
function renderRules() {
  const li = r => `<li><b>${esc(r.t)}</b><span>${esc(r.d)}</span></li>`;
  $("#rules-out").innerHTML = RULES.out.map(li).join("");
  $("#rules-in").innerHTML = RULES.in.map(li).join("");
  $("#rules-watch").innerHTML = RULES.watch.map(li).join("");

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

function renderPrep() {
  $("#prep-list").innerHTML = PREP.map(p => `
    <div class="prep-card">
      <h4><span class="prep-w">Week ${p.w}</span>${esc(p.day)}</h4>
      <ul>${p.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>`).join("");
}

/* ---------- groceries ---------- */
const LSK = "mealplan26:groceries";
let checked = {};
try { checked = JSON.parse(localStorage.getItem(LSK) || "{}"); } catch (_) { checked = {}; }
const saveChecks = () => { try { localStorage.setItem(LSK, JSON.stringify(checked)); } catch (_) {} };

function renderGroceries() {
  $("#grocery-list").innerHTML = GROCERIES.map(t => `
    <section class="trip" id="trip-${t.trip}">
      <header class="trip-head">
        <div>
          <span class="trip-badge">Trip ${t.trip}</span>
          <h3>${esc(t.when)}</h3>
          <p class="trip-covers">Covers ${esc(t.covers)} · est. ${esc(t.est)}</p>
        </div>
        <div class="trip-actions">
          <span class="trip-progress" data-trip="${t.trip}"></span>
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
              const key = `${t.trip}.${si}.${ii}`;
              return `<li><label class="gitem${checked[key] ? " done" : ""}">
                <input type="checkbox" data-key="${key}"${checked[key] ? " checked" : ""}>
                <span class="box" aria-hidden="true"></span><span class="txt">${esc(it)}</span></label></li>`;
            }).join("")}</ul>
          </div>`).join("")}
      </div>
    </section>`).join("");
  GROCERIES.forEach(t => updateProgress(t.trip));
  updateTotal();
}

function updateProgress(trip) {
  const boxes = $$(`#trip-${trip} input[type=checkbox]`);
  const done = boxes.filter(b => b.checked).length;
  const el = $(`.trip-progress[data-trip="${trip}"]`);
  if (!el) return;
  el.textContent = `${done}/${boxes.length}`;
  el.classList.toggle("all", done === boxes.length && boxes.length > 0);
}

function updateTotal() {
  const boxes = $$("#grocery-list input[type=checkbox]");
  const done = boxes.filter(b => b.checked).length;
  const pct = boxes.length ? (done / boxes.length * 100) : 0;
  $("#gtotal").innerHTML = `<b>${done}</b> of <b>${boxes.length}</b> items ticked off`;
  $("#gmeter-fill").style.width = pct + "%";
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

/* ---------- theme + nav ---------- */
function initTheme() {
  const saved = localStorage.getItem("mealplan26:theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  $("#theme-toggle").addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme")
      || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("mealplan26:theme", next);
  });
}

function initNav() {
  const links = $$(".nav-link");
  const secs = links.map(l => document.getElementById(l.getAttribute("href").slice(1))).filter(Boolean);
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
  buildIndex();
  renderRotation();
  renderStatus();
  renderFilters();
  renderGlance();
  renderWeekNav();
  renderWeeks();
  renderRules();
  renderGroceries();
  renderPrep();
  initTheme();
  initNav();
  applyFilters();

  const m = /^#day-(\d+)$/.exec(location.hash);
  if (m) openDay(+m[1], false);

  document.addEventListener("click", e => {
    // tick an ingredient or a step off while cooking
    const tick = e.target.closest(".tickable");
    if (tick) { tick.classList.toggle("on"); return; }

    if (e.target.closest("[data-close]") || e.target.closest("#modal-close")) return closeModal();
    if (e.target.closest("#m-prev")) return openDay(currentDay - 1);
    if (e.target.closest("#m-next")) return openDay(currentDay + 1);

    const cell = e.target.closest(".glance-cell");
    if (cell) return openDay(+cell.dataset.day);
    const card = e.target.closest(".card");
    if (card) return openDay(+card.dataset.day);

    const rot = e.target.closest(".rot-row");
    if (rot) {
      filterProtein = filterProtein === rot.dataset.filter ? "all" : rot.dataset.filter;
      applyFilters();
      $("#plan").scrollIntoView({ behavior: "smooth" });
      return;
    }

    const fb = e.target.closest(".fbtn");
    if (fb) {
      if (fb.dataset.quick) filterQuick = !filterQuick;
      else filterProtein = fb.dataset.filter;
      return applyFilters();
    }

    const cp = e.target.closest("[data-copy]");
    if (cp) return copyTrip(+cp.dataset.copy);

    const pr = e.target.closest("[data-print]");
    if (pr) return printGroceries(+pr.dataset.print);
  });

  $("#search").addEventListener("input", applyFilters);
  $("#search-clear").addEventListener("click", () => { $("#search").value = ""; applyFilters(); $("#search").focus(); });

  document.addEventListener("keydown", e => {
    const open = $("#modal").classList.contains("open");
    if (e.key === "Escape" && open) return closeModal();
    if (open && e.key === "ArrowLeft" && currentDay > 1) return openDay(currentDay - 1);
    if (open && e.key === "ArrowRight" && currentDay < DAYS.length) return openDay(currentDay + 1);
    if (!open && e.key === "/" && document.activeElement !== $("#search")) {
      e.preventDefault(); $("#search").focus();
    }
  });

  $("#grocery-list").addEventListener("change", e => {
    const box = e.target.closest("input[type=checkbox]");
    if (!box) return;
    if (box.checked) checked[box.dataset.key] = true; else delete checked[box.dataset.key];
    box.closest(".gitem").classList.toggle("done", box.checked);
    saveChecks();
    updateProgress(+box.dataset.key.split(".")[0]);
    updateTotal();
  });

  $("#reset-checks").addEventListener("click", () => {
    checked = {}; saveChecks();
    $$("#grocery-list input[type=checkbox]").forEach(b => { b.checked = false; b.closest(".gitem").classList.remove("done"); });
    GROCERIES.forEach(t => updateProgress(t.trip));
    updateTotal();
  });

  $("#print-all").addEventListener("click", () => printGroceries());
  $("#print-groceries").addEventListener("click", () => printGroceries());
});

/* Printing only ever produces the shopping list, either all five trips or a
   single one. Nothing else on the page goes to paper. */
function printGroceries(trip) {
  closeModal();
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
