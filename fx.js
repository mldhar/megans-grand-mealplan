/* ============================================================
   Megan's Grand Mealplan · motion and depth
   Everything in here is optional. The plan reads and works the
   same with it switched off, and it switches itself off for
   anyone who has asked their system for reduced motion.
   ============================================================ */

const FX = (() => {
  const reducedQ = matchMedia("(prefers-reduced-motion: reduce)");
  const hoverQ = matchMedia("(hover: hover) and (pointer: fine)");
  const motionOK = () => !reducedQ.matches;
  const canHover = () => hoverQ.matches && motionOK();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (k) => 1 - Math.pow(1 - k, 4);

  /* ---------- reveal on scroll ----------
     [data-reveal] blocks, week sections and the calendar fade up the first
     time they come into view. Revealing also starts any count-up inside. */
  let io = null;
  function reveal(root = document) {
    const els = root.querySelectorAll("[data-reveal]:not(.in), .week:not(.in), .glance-grid:not(.in)");
    if (!motionOK() || !("IntersectionObserver" in window)) {
      els.forEach(el => { el.classList.add("in"); countUp(el, true); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
        countUp(e.target);
      }), { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });
    }
    els.forEach(el => io.observe(el));
  }

  /* ---------- count-up ----------
     Any [data-count] element animates every number in its text from zero,
     so "$555 to $660" and "71g+" both work without special cases. */
  function countUp(root, instant = false) {
    const nodes = root.matches?.("[data-count]") ? [root] : root.querySelectorAll?.("[data-count]") || [];
    nodes.forEach(n => {
      const text = n.dataset.count || n.textContent;
      n.dataset.count = text;
      if (instant || !motionOK()) { n.textContent = text; return; }
      const parts = text.split(/(\d[\d,]*)/);
      const t0 = performance.now(), dur = 1500;
      const step = (now) => {
        const k = clamp((now - t0) / dur, 0, 1), e = ease(k);
        n.textContent = parts.map((p, i) => {
          if (!(i % 2)) return p;
          const v = Math.round(+p.replace(/,/g, "") * e);
          return p.includes(",") ? v.toLocaleString("en-US") : String(v);
        }).join("");
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- card tilt ----------
     The card turns toward the pointer, a soft glare follows it, and each
     layer of the plate shifts by its own depth so the food sits above the
     plate and the plate above the board. */
  function tilt(container, selector) {
    if (!container) return;
    let cur = null, rect = null, raf = 0, last = null;
    const apply = () => {
      raf = 0;
      if (!cur || !last) return;
      const x = clamp((last.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((last.clientY - rect.top) / rect.height, 0, 1);
      const px = x * 2 - 1, py = y * 2 - 1;
      const s = cur.style;
      s.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
      s.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
      s.setProperty("--px", px.toFixed(3));
      s.setProperty("--py", py.toFixed(3));
      s.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      s.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
    };
    const leave = () => {
      if (!cur) return;
      cur.classList.remove("tilting");
      ["--rx", "--ry", "--px", "--py"].forEach(p => cur.style.removeProperty(p));
      cur = null;
    };
    container.addEventListener("pointermove", e => {
      if (!canHover() || e.pointerType !== "mouse") return;
      const el = e.target.closest(selector);
      if (el !== cur) {
        leave();
        if (!el) return;
        cur = el; cur.classList.add("tilting");
      }
      rect = cur.getBoundingClientRect();
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    container.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", leave, { passive: true });
  }

  /* ---------- turn a 3D plate by dragging it ---------- */
  function dragTurn(el) {
    if (!el || el.dataset.drag) return;
    el.dataset.drag = "1";
    let start = null, base = 0, moved = false;
    el.addEventListener("pointerdown", e => {
      if (e.button !== 0) return;
      start = { x: e.clientX, y: e.clientY };
      base = parseFloat(el.style.getPropertyValue("--turn")) || 0;
      moved = false;
      // a press that wanders off the plate must still end here, or it drags forever
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
    });
    el.addEventListener("pointermove", e => {
      if (!start) return;
      const dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (!moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        moved = true;
        el.classList.add("dragging");
      }
      if (moved) el.style.setProperty("--turn", `${base + dx * 0.6}deg`);
    });
    const end = () => { start = null; el.classList.remove("dragging"); };
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("lostpointercapture", end);
    // a drag is not a click
    el.addEventListener("click", e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
  }

  /* the recipe panel's plate leans toward the pointer */
  function stageTilt(el) {
    if (!el || el.dataset.tilt) return;
    el.dataset.tilt = "1";
    el.addEventListener("pointermove", e => {
      if (!canHover() || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * 2 - 1, py = ((e.clientY - r.top) / r.height) * 2 - 1;
      el.style.setProperty("--ty", `${(px * 12).toFixed(2)}deg`);
      el.style.setProperty("--tx", `${(-py * 8).toFixed(2)}deg`);
    });
    el.addEventListener("pointerleave", () => { el.style.removeProperty("--ty"); el.style.removeProperty("--tx"); });
  }

  /* ---------- hero: pointer depth and the floating ingredients ---------- */
  const SPRITES = {
    basil: '<svg viewBox="0 0 40 24"><path d="M2 12C8 2 26 0 38 12 26 24 8 22 2 12Z" fill="#4f8a3a"/><path d="M2 12C8 2 26 0 38 12" fill="#5f9c46" opacity=".6"/><path d="M5 12h30" stroke="#a9cf86" stroke-width="1.2" opacity=".8" stroke-linecap="round"/></svg>',
    pepper: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#3b2a1f"/><path d="M5 8c2-3 6-4 9-2" stroke="#6d5545" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
    chili: '<svg viewBox="0 0 48 20"><path d="M3 10c7-6 27-8 38-2 2 1 2 3 0 4-11 6-31 4-38-2Z" fill="#c8361f"/><path d="M40 8c3-3 5-3 6-1" stroke="#4f7a2e" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M10 9c8-3 18-4 26-2" stroke="#ff8a6a" stroke-width="1.6" fill="none" opacity=".7" stroke-linecap="round"/></svg>',
    garlic: '<svg viewBox="0 0 28 32"><path d="M14 2C8 8 4 16 6 24c1 4 4 6 8 6s7-2 8-6c2-8-2-16-8-22Z" fill="#f6efdc"/><path d="M14 4c-2 8-2 16 0 24" stroke="#ddd0b0" stroke-width="1.3" fill="none"/><path d="M14 2c1-1 2-1 3 0" stroke="#c9b98f" stroke-width="1.4" fill="none"/></svg>',
    lemon: (() => {
      let s = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18.5" fill="#e6c234"/><circle cx="20" cy="20" r="15.6" fill="#fbf4cf"/>';
      for (let i = 0; i < 9; i++) {
        const a0 = i / 9 * Math.PI * 2 + .08, a1 = a0 + Math.PI * 2 / 9 - .16, r = 14;
        s += `<path d="M20 20L${(20 + Math.cos(a0) * r).toFixed(1)} ${(20 + Math.sin(a0) * r).toFixed(1)}A${r} ${r} 0 0 1 ${(20 + Math.cos(a1) * r).toFixed(1)} ${(20 + Math.sin(a1) * r).toFixed(1)}Z" fill="#f4dc6a"/>`;
      }
      return s + '</svg>';
    })(),
    rosemary: (() => {
      let s = '<svg viewBox="0 0 64 24"><path d="M2 12.5Q32 10 62 12" stroke="#6b5636" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
      for (let i = 0; i < 11; i++) {
        const x = 6 + i * 5.2, up = i % 2;
        s += `<ellipse cx="${x}" cy="${up ? 8.4 : 15.8}" rx="4.6" ry="1.4" fill="${up ? "#3f6b3a" : "#4d7d45"}" transform="rotate(${up ? -28 : 28} ${x} ${up ? 8.4 : 15.8})"/>`;
      }
      return s + '</svg>';
    })(),
    salt: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="8" height="8" rx="1.6" fill="#ffffff" transform="rotate(12 7 9)"/><rect x="13" y="11" width="7" height="7" rx="1.4" fill="#f4f1ea" transform="rotate(-18 16 14)"/><rect x="6" y="15" width="5" height="5" rx="1" fill="#ffffff" transform="rotate(30 8 17)"/></svg>',
    thyme: '<svg viewBox="0 0 40 20"><path d="M2 10h36" stroke="#6b5a3a" stroke-width="1.2"/><ellipse cx="9" cy="7" rx="3.2" ry="1.8" fill="#6f9455"/><ellipse cx="17" cy="13" rx="3.2" ry="1.8" fill="#5d8547"/><ellipse cx="25" cy="7" rx="3.2" ry="1.8" fill="#6f9455"/><ellipse cx="33" cy="13" rx="3" ry="1.7" fill="#5d8547"/></svg>'
  };
  // left%, top%, size, depth, rotation, sprite, shown on small screens
  const SCATTER = [
    [5, 10, 46, .95, -24, "basil", 0], [43, 5, 14, .45, 0, "pepper", 0], [90, 4, 62, 1.15, 28, "chili", 1],
    [53, 82, 30, .7, 16, "garlic", 0], [95, 60, 54, .85, 0, "lemon", 1], [36, 94, 82, 1.05, -10, "rosemary", 0],
    [70, 95, 12, .4, 0, "pepper", 0], [98, 28, 34, .6, 140, "basil", 0], [28, 3, 18, .35, 0, "salt", 0],
    [2, 72, 16, .6, 0, "pepper", 1], [62, 2, 28, .5, 60, "thyme", 0], [1.5, 40, 40, .55, -140, "chili", 0]
  ];

  let particles = [];
  function scatter(host) {
    if (!host || host.childElementCount) return;
    host.innerHTML = SCATTER.map(([x, y, size, depth, r, k, small], i) => `
      <span class="pt${small ? "" : " pt-wide"}${depth < .5 ? " far" : depth < .6 ? " mid" : ""}" style="left:${x}%;top:${y}%;width:${size}px;--d:${depth};--r:${r}deg;--dur:${(7 + (i * 1.7) % 6).toFixed(1)}s;--del:${(-i * 1.3).toFixed(1)}s">
        <i>${SPRITES[k]}</i>
      </span>`).join("");
    particles = Array.from(host.children).map(el => ({ el, d: +el.style.getPropertyValue("--d") }));
  }

  let mx = 0, my = 0, sy = 0, depthRaf = 0;
  function paintDepth() {
    depthRaf = 0;
    particles.forEach(p => {
      p.el.style.transform = `translate3d(${(mx * p.d * 26).toFixed(1)}px, ${(my * p.d * 18 - sy * p.d * .14).toFixed(1)}px, 0)`;
    });
    const orbit = document.getElementById("orbit");
    if (orbit) { orbit.style.setProperty("--mx", mx.toFixed(3)); orbit.style.setProperty("--my", my.toFixed(3)); }
    const plate = document.querySelector("#stage-plate .p3d");
    if (plate) {
      plate.style.setProperty("--ty", `${(mx * 14).toFixed(2)}deg`);
      plate.style.setProperty("--tx", `${(-my * 9).toFixed(2)}deg`);
    }
  }
  const queueDepth = () => { if (!depthRaf) depthRaf = requestAnimationFrame(paintDepth); };

  function hero(heroEl) {
    if (!heroEl) return;
    scatter(heroEl.querySelector("#particles"));
    if (!motionOK()) return;
    heroEl.addEventListener("pointermove", e => {
      if (e.pointerType !== "mouse") return;
      mx = (e.clientX / innerWidth) * 2 - 1;
      my = (e.clientY / innerHeight) * 2 - 1;
      queueDepth();
    });
    heroEl.addEventListener("pointerleave", () => { mx = 0; my = 0; queueDepth(); });
  }

  /* ---------- scroll: reading progress, topbar, ingredient drift ---------- */
  function scroll() {
    const bar = document.getElementById("progress");
    const top = document.getElementById("topbar");
    let raf = 0;
    const paint = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - innerHeight;
      sy = scrollY;
      if (bar) bar.style.transform = `scaleX(${h > 0 ? clamp(sy / h, 0, 1) : 0})`;
      top?.classList.toggle("scrolled", sy > 12);
      if (motionOK() && sy < innerHeight * 1.4) paintDepth();
    };
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(paint); }, { passive: true });
    paint();
  }

  /* ---------- theme: a circular wipe out of the button ---------- */
  function themeSwap(apply, origin) {
    if (!document.startViewTransition || !motionOK() || !origin) return apply();
    const r = origin.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = document.startViewTransition(apply);
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(.7,0,.25,1)", pseudoElement: "::view-transition-new(root)" });
    }).catch(() => {});
  }

  /* ---------- confetti, for a finished shopping trip ---------- */
  function confetti(from, colors) {
    if (!motionOK() || !from) return;
    const r = from.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const c = document.createElement("canvas");
    c.className = "confetti";
    const dpr = Math.min(2, devicePixelRatio || 1);
    c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    const bits = Array.from({ length: 110 }, () => {
      const a = -Math.PI / 2 + (Math.random() - .5) * Math.PI * 1.25, v = 5 + Math.random() * 9;
      return {
        x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: Math.random() * 6, vr: (Math.random() - .5) * .4,
        w: 5 + Math.random() * 6, h: 3 + Math.random() * 5, c: colors[Math.floor(Math.random() * colors.length)],
        round: Math.random() < .3
      };
    });
    const t0 = performance.now(), dur = 1900;
    const frame = (now) => {
      const k = (now - t0) / dur;
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      bits.forEach(b => {
        b.vy += .26; b.vx *= .985; b.vy *= .985; b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        ctx.save();
        ctx.globalAlpha = k > .65 ? Math.max(0, 1 - (k - .65) / .35) : 1;
        ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.fillStyle = b.c;
        if (b.round) { ctx.beginPath(); ctx.arc(0, 0, b.w / 2.4, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      });
      if (k < 1) requestAnimationFrame(frame); else c.remove();
    };
    requestAnimationFrame(frame);
  }

  /* ---------- the recipe panel grows out of whatever was clicked ---------- */
  function zoomIn(panel, from) {
    if (!motionOK()) return;
    const to = panel.getBoundingClientRect();
    if (from && from.isConnected) {
      const f = from.getBoundingClientRect();
      if (f.width && f.bottom > 0 && f.top < innerHeight) {
        const visH = Math.min(to.height, innerHeight - to.top);
        const s = clamp(f.width / to.width, .2, 1);
        const dx = (f.left + f.width / 2) - (to.left + to.width / 2);
        const dy = (f.top + f.height / 2) - (to.top + visH / 2);
        panel.animate([
          { transform: `translate(${dx}px, ${dy}px) scale(${s})`, opacity: 0, offset: 0 },
          { opacity: 1, offset: .35 },
          { transform: "none", opacity: 1 }
        ], { duration: 620, easing: "cubic-bezier(.16,1,.3,1)" });
        return;
      }
    }
    panel.animate([{ transform: "translateY(28px) scale(.97)", opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: 480, easing: "cubic-bezier(.16,1,.3,1)" });
  }

  function zoomOut(panel, scrim) {
    if (!motionOK()) return Promise.resolve();
    scrim?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, easing: "ease-out", fill: "forwards" });
    return panel.animate([{ transform: "none", opacity: 1 }, { transform: "translateY(18px) scale(.965)", opacity: 0 }],
      { duration: 240, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" }).finished.catch(() => {});
  }

  /* prev/next inside the panel slides the way you are going */
  function slide(el, dir) {
    if (!motionOK() || !dir) return;
    el.animate([{ transform: `translateX(${dir * 36}px)`, opacity: 0 }, { transform: "none", opacity: 1 }],
      { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" });
  }

  /* Run an entrance again on elements that stay in the page. Done with the
     Web Animations API rather than by toggling a class, which would force the
     browser to lay out ten thousand freshly rendered nodes on the spot. */
  const UP = [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }];
  function rerun(els, { frames = UP, delay = 0, step = 80, duration = 900, easing = "cubic-bezier(.16,1,.3,1)" } = {}) {
    if (!motionOK()) return;
    els.forEach((el, i) => el?.animate(frames, { duration, delay: delay + i * step, easing, fill: "backwards" }));
  }

  return { motionOK, canHover, reveal, countUp, tilt, dragTurn, stageTilt, hero, scroll, themeSwap, confetti, zoomIn, zoomOut, slide, rerun };
})();
