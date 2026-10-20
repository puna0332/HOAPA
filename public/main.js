/* ============================================================
   HOAPA — Bó hoa 20/10  |  main.js
   ============================================================ */

const VB = 600;                 // viewBox size of the bouquet
const NECK = { x: 300, y: 474 }; // where all stems converge (inside the wrap)

const PALETTES = {
  crimson: { deep: '#8d0f33', mid: '#d62a5c', light: '#ff8fae', edge: 'rgba(110,10,42,.22)' },
  blush:   { deep: '#c2456f', mid: '#f27d9f', light: '#ffd3e0', edge: 'rgba(150,40,80,.20)' },
  peach:   { deep: '#c75a35', mid: '#f59264', light: '#ffd9bb', edge: 'rgba(150,70,40,.20)' },
  gold:    { deep: '#b4761a', mid: '#e8a93c', light: '#ffe6a8', edge: 'rgba(140,90,20,.20)' },
  violet:  { deep: '#6e2a86', mid: '#a556bf', light: '#e8c4f4', edge: 'rgba(80,30,100,.20)' },
};

/* flower layout: x/y in % of the bouquet box */
const LAYOUT = [
  { x: 50, y: 15, s: 1.00, type: 'rose',  pal: 'crimson', d: 0.95 },
  { x: 29, y: 23, s: 0.90, type: 'rose',  pal: 'blush',   d: 1.08 },
  { x: 71, y: 22, s: 0.92, type: 'rose',  pal: 'peach',   d: 1.02 },
  { x: 15, y: 38, s: 0.80, type: 'rose',  pal: 'crimson', d: 1.22 },
  { x: 85, y: 37, s: 0.82, type: 'rose',  pal: 'violet',  d: 1.16 },
  { x: 39, y: 35, s: 0.86, type: 'rose',  pal: 'peach',   d: 1.30 },
  { x: 61, y: 34, s: 0.88, type: 'rose',  pal: 'blush',   d: 1.36 },
  { x: 50, y: 47, s: 0.78, type: 'rose',  pal: 'gold',    d: 1.44 },
  { x: 24, y: 50, s: 0.62, type: 'rose',  pal: 'blush',   d: 1.50 },
  { x: 76, y: 49, s: 0.64, type: 'rose',  pal: 'crimson', d: 1.54 },
  /* fillers */
  { x: 38, y: 16, s: 0.40, type: 'daisy', pal: 'gold',    d: 1.60 },
  { x: 62, y: 15, s: 0.38, type: 'daisy', pal: 'gold',    d: 1.66 },
  { x: 20, y: 28, s: 0.34, type: 'daisy', pal: 'gold',    d: 1.70 },
  { x: 80, y: 27, s: 0.34, type: 'daisy', pal: 'gold',    d: 1.74 },
  { x: 50, y: 30, s: 0.30, type: 'daisy', pal: 'gold',    d: 1.78 },
  { x: 31, y: 44, s: 0.30, type: 'puff',  pal: 'blush',   d: 1.82 },
  { x: 69, y: 43, s: 0.30, type: 'puff',  pal: 'blush',   d: 1.86 },
  { x: 9,  y: 26, s: 0.28, type: 'puff',  pal: 'blush',   d: 1.90 },
  { x: 91, y: 25, s: 0.28, type: 'puff',  pal: 'blush',   d: 1.94 },
];

const LEAVES = [
  { x: 10, y: 50, w: 20, r: -34, d: 0.70 },
  { x: 90, y: 49, w: 20, r: 34,  d: 0.76 },
  { x: 18, y: 58, w: 17, r: -52, d: 0.82 },
  { x: 82, y: 57, w: 17, r: 52,  d: 0.88 },
  { x: 33, y: 55, w: 14, r: -18, d: 0.92 },
  { x: 67, y: 54, w: 14, r: 18,  d: 0.96 },
  { x: 50, y: 58, w: 13, r: 4,   d: 1.00 },
  { x: 4,  y: 40, w: 13, r: -66, d: 1.04 },
  { x: 96, y: 39, w: 13, r: 66,  d: 1.08 },
];

let uid = 0;

/* ---------- flower builders (SVG markup) ---------- */

/* rounded, cupped petal — reads as a real rose petal rather than a star point */
const PETAL = 'M50 50 C 29 47.5 22.5 27 33 15.5 C 40 7.5 60 7.5 67 15.5 C 77.5 27 71 47.5 50 50 Z';

function ring(count, scale, offset, gradId, edge, jitter = 0, squash = 1) {
  let out = '';
  for (let i = 0; i < count; i++) {
    const j = jitter ? (Math.random() - 0.5) * jitter : 0;
    const a = offset + (360 / count) * i + j;
    const s = scale * (1 + (jitter ? (Math.random() - 0.5) * 0.06 : 0));
    out += `<path d="${PETAL}" fill="url(#${gradId})" stroke="${edge}" stroke-width="0.8" ` +
           `stroke-linejoin="round" ` +
           `transform="rotate(${a.toFixed(1)} 50 50) translate(50 50) scale(${s.toFixed(3)} ${(s * squash).toFixed(3)}) translate(-50 -50)"/>`;
  }
  return out;
}

function rose(pal) {
  const g = `rg${uid++}`;
  const h = `rh${uid++}`;
  const au = `ra${uid++}`;
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="50" cy="50" r="44">
        <stop offset="0%"   stop-color="${pal.deep}"/>
        <stop offset="30%"  stop-color="${pal.mid}"/>
        <stop offset="78%"  stop-color="${pal.light}"/>
        <stop offset="100%" stop-color="${pal.light}"/>
      </radialGradient>
      <radialGradient id="${h}" gradientUnits="userSpaceOnUse" cx="36" cy="32" r="34">
        <stop offset="0%"   stop-color="#fff" stop-opacity=".40"/>
        <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="${au}" gradientUnits="userSpaceOnUse" cx="50" cy="50" r="52">
        <stop offset="0%"   stop-color="${pal.mid}" stop-opacity=".30"/>
        <stop offset="62%"  stop-color="${pal.mid}" stop-opacity=".12"/>
        <stop offset="100%" stop-color="${pal.mid}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <g>
      <circle cx="50" cy="50" r="52" fill="url(#${au})"/>
      ${ring(6, 1.00, 0,  g, pal.edge, 7, 1.02)}
      ${ring(6, 0.84, 30, g, pal.edge, 7, 1.0)}
      ${ring(5, 0.66, 14, g, pal.edge, 6, 0.98)}
      ${ring(5, 0.49, 48, g, pal.edge, 6, 0.96)}
      ${ring(4, 0.33, 22, g, pal.edge, 5, 0.94)}
      ${ring(3, 0.20, 60, g, pal.edge, 4, 0.92)}
      <circle cx="50" cy="50" r="3.2" fill="${pal.deep}" opacity=".9"/>
      <circle cx="50" cy="50" r="44" fill="url(#${h})"/>
    </g>
  </svg>`;
}

function daisy(pal) {
  const g = `dg${uid++}`;
  const p = 'M50 50 C 42 46 39 26 50 16 C 61 26 58 46 50 50 Z';
  let petals = '';
  for (let i = 0; i < 9; i++) {
    const a = (360 / 9) * i;
    petals += `<path d="${p}" fill="url(#${g})" stroke="rgba(200,150,120,.25)" stroke-width="0.7" ` +
              `transform="rotate(${a} 50 50)"/>`;
  }
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="${g}" gradientUnits="userSpaceOnUse" cx="50" cy="50" r="38">
        <stop offset="0%" stop-color="#fff6dd"/><stop offset="100%" stop-color="#fffdf8"/>
      </radialGradient>
    </defs>
    ${petals}
    <circle cx="50" cy="50" r="13" fill="${pal.mid}"/>
    <circle cx="50" cy="50" r="13" fill="url(#${g})" opacity=".12"/>
    <circle cx="46" cy="46" r="4" fill="${pal.light}" opacity=".8"/>
  </svg>`;
}

function puff() {
  let dots = '';
  const rnd = (a, b) => a + Math.random() * (b - a);
  for (let i = 0; i < 16; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 38;
    dots += `<circle cx="${(50 + Math.cos(a) * r).toFixed(1)}" cy="${(50 + Math.sin(a) * r).toFixed(1)}" ` +
            `r="${rnd(4, 8).toFixed(1)}" fill="#fffdfa" opacity="${rnd(0.65, 0.95).toFixed(2)}"/>`;
  }
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${dots}</svg>`;
}

/* ---------- build the bouquet ---------- */

function buildBouquet() {
  const flowersEl = document.getElementById('flowers');
  const leavesEl = document.getElementById('leaves');
  const stemG = document.getElementById('stemGroup');
  if (!flowersEl || !leavesEl || !stemG) return;

  // stems (behind everything) — drawn first so they grow upward into place
  const sorted = [...LAYOUT].sort((a, b) => b.s - a.s);
  sorted.forEach((f, i) => {
    const x = (f.x / 100) * VB;
    const y = (f.y / 100) * VB;
    const midX = x + (NECK.x - x) * 0.45 + (x < NECK.x ? -16 : 16);
    const midY = y + (NECK.y - y) * 0.55;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${NECK.x} ${NECK.y} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`);
    path.setAttribute('class', 'stem');
    path.setAttribute('stroke', i % 3 === 0 ? '#35784b' : i % 3 === 1 ? '#2d6b43' : '#3f8a56');
    path.setAttribute('stroke-width', (3 + f.s * 4).toFixed(1));
    stemG.appendChild(path);
    const len = path.getTotalLength();
    path.style.setProperty('--len', len.toFixed(1));
    path.style.setProperty('--d', `${(0.25 + i * 0.045).toFixed(2)}s`);
  });

  // leaves
  LEAVES.forEach((l) => {
    const el = document.createElement('span');
    el.className = 'leaf';
    el.style.setProperty('--x', `${l.x}%`);
    el.style.setProperty('--y', `${l.y}%`);
    el.style.setProperty('--w', `${l.w}%`);
    el.style.setProperty('--r', `${l.r}deg`);
    el.style.setProperty('--d', `${l.d}s`);
    leavesEl.appendChild(el);
  });

  // flowers
  LAYOUT.forEach((f) => {
    const pal = PALETTES[f.pal];
    const el = document.createElement('div');
    el.className = 'flower';
    el.style.setProperty('--x', `${f.x}%`);
    el.style.setProperty('--y', `${f.y}%`);
    el.style.setProperty('--size', `${(f.s * 30).toFixed(1)}%`);
    el.style.setProperty('--d', `${f.d}s`);
    el.innerHTML = f.type === 'rose' ? rose(pal) : f.type === 'daisy' ? daisy(pal) : puff();
    flowersEl.appendChild(el);

    if (f.type === 'rose' && f.s > 0.75) {
      const tw = document.createElement('span');
      tw.className = 'twinkle';
      tw.style.left = `${f.x + (Math.random() * 8 - 4)}%`;
      tw.style.top = `${f.y - 4}%`;
      tw.style.setProperty('--d', `${(f.d + Math.random() * 2).toFixed(2)}s`);
      flowersEl.appendChild(tw);
    }
  });
}

/* ---------- petal rain ---------- */

function startPetalRain() {
  const host = document.getElementById('petalRain');
  if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const spawn = () => {
    const p = document.createElement('span');
    p.className = `petal p${1 + Math.floor(Math.random() * 3)}`;
    const size = 8 + Math.random() * 12;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.setProperty('--dx', `${(Math.random() * 220 - 110).toFixed(0)}px`);
    p.style.setProperty('--spin', `${(Math.random() * 900 + 360).toFixed(0)}deg`);
    p.style.animationDuration = `${(8 + Math.random() * 8).toFixed(1)}s`;
    host.appendChild(p);
    p.addEventListener('animationend', () => p.remove(), { once: true });
  };
  for (let i = 0; i < 10; i++) setTimeout(spawn, i * 420);
  setInterval(spawn, 700);
}

/* ---------- bokeh canvas ---------- */

function startBokeh() {
  const cv = document.getElementById('bokeh');
  if (!cv || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d');
  let w, h, dots = [];
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    w = cv.width = Math.floor(innerWidth * DPR);
    h = cv.height = Math.floor(innerHeight * DPR);
    cv.style.width = `${innerWidth}px`;
    cv.style.height = `${innerHeight}px`;
    const n = Math.round((innerWidth * innerHeight) / 26000);
    dots = Array.from({ length: Math.min(n, 70) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: (1.2 + Math.random() * 3.6) * DPR,
      vx: (Math.random() - 0.5) * 0.14 * DPR,
      vy: -(0.08 + Math.random() * 0.3) * DPR,
      a: 0.18 + Math.random() * 0.42,
      t: Math.random() * 6.28,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx; d.y += d.vy; d.t += 0.02;
      if (d.y < -20) { d.y = h + 20; d.x = Math.random() * w; }
      if (d.x < -20) d.x = w + 20;
      if (d.x > w + 20) d.x = -20;
      const pulse = 0.65 + Math.sin(d.t) * 0.35;
      const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
      g.addColorStop(0, `rgba(255, 238, 220, ${(d.a * pulse).toFixed(3)})`);
      g.addColorStop(1, 'rgba(255, 220, 200, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 4, 0, 6.2832);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  resize();
  addEventListener('resize', resize);
  frame();
}

/* ---------- hearts on letter open ---------- */

function burstHearts() {
  const field = document.getElementById('heartField');
  if (!field) return;
  const glyphs = ['💗', '💖', '🌸', '🌷', '💝', '✨'];
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'heart';
      el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      el.style.left = `${Math.random() * 100}%`;
      el.style.setProperty('--s', `${14 + Math.random() * 20}px`);
      el.style.setProperty('--dx', `${(Math.random() * 180 - 90).toFixed(0)}px`);
      el.style.setProperty('--r', `${(Math.random() * 70 - 35).toFixed(0)}deg`);
      el.style.setProperty('--t', `${(4.5 + Math.random() * 3).toFixed(1)}s`);
      field.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, i * 130);
  }
}

/* ---------- background music (mp3, autoplay with gesture fallback) ---------- */

const Music = (() => {
  const TARGET = 0.62;          // final volume
  const el = document.getElementById('bgm');
  let fadeTimer = null;
  const listeners = new Set();

  function notify() { listeners.forEach((fn) => fn(Music.playing)); }

  function fadeTo(target, ms = 1400, done) {
    if (!el) return;
    clearInterval(fadeTimer);
    const from = el.volume;
    const t0 = performance.now();
    fadeTimer = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      el.volume = Math.max(0, Math.min(1, from + (target - from) * k));
      if (k >= 1) { clearInterval(fadeTimer); fadeTimer = null; done?.(); }
    }, 40);
  }
  async function play() {
    if (!el) return false;
    try {
      el.volume = 0;
      await el.play();
      fadeTo(TARGET, 2200);
      notify();
      return true;
    } catch {
      notify();
      return false;
    }
  }

  function pause() {
    if (!el) return;
    fadeTo(0, 600, () => el.pause());
    notify();
  }

  /* Browsers block audio until the user interacts. Try immediately; if the
     promise rejects, arm one-shot listeners so the very first tap starts it. */
  function arm() {
    const kick = async () => {
      const ok = await play();
      if (ok) off();
    };
    const off = () => {
      ['pointerdown', 'touchstart', 'keydown', 'click'].forEach((e) =>
        document.removeEventListener(e, kick, true));
    };
    ['pointerdown', 'touchstart', 'keydown', 'click'].forEach((e) =>
      document.addEventListener(e, kick, true));
  }

  return {
    get playing() { return !!el && !el.paused; },
    onChange(fn) { listeners.add(fn); },
    async boot() {
      const ok = await play();
      if (!ok) arm();
      el?.addEventListener('play', notify);
      el?.addEventListener('pause', notify);
    },
    toggle() {
      if (Music.playing) { pause(); return false; }
      play();
      return true;
    },
  };
})();

/* ---------- letter open / close ---------- */

function initLetter() {
  const env = document.getElementById('envelope');
  const overlay = document.getElementById('overlay');
  const letter = document.getElementById('letter');
  const closeBtn = document.getElementById('letterClose');
  const bg = document.getElementById('overlayBg');
  const hint = document.getElementById('hint');
  if (!env || !overlay || !letter) return;

  let open = false;
  let lastFocus = null;

  function openLetter() {
    if (open) return;
    open = true;
    lastFocus = document.activeElement;
    env.classList.add('is-open');
    env.setAttribute('aria-expanded', 'true');
    if (hint) hint.style.opacity = '0';
    setTimeout(() => {
      overlay.hidden = false;
      requestAnimationFrame(() => {
        overlay.classList.add('show');
        letter.focus({ preventScroll: true });
      });
      burstHearts();
    }, 420);
  }

  function closeLetter() {
    if (!open) return;
    open = false;
    overlay.classList.remove('show');
    env.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      overlay.hidden = true;
      env.classList.remove('is-open');
      if (hint) hint.style.opacity = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }, 480);
  }

  env.addEventListener('click', openLetter);
  closeBtn?.addEventListener('click', closeLetter);
  bg?.addEventListener('click', closeLetter);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLetter();
  });
}

/* ---------- sound button ---------- */

function initSound() {
  const btn = document.getElementById('soundToggle');
  if (!btn) return;
  const paint = (on) => {
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Tắt nhạc nền' : 'Bật nhạc nền');
    btn.classList.toggle('needs-tap', !on);
  };
  Music.onChange(paint);
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    paint(Music.toggle());
  });
  paint(Music.playing);
}

/* ---------- boot ---------- */

function boot() {
  buildBouquet();
  startPetalRain();
  startBokeh();
  initLetter();
  initSound();
  Music.boot();
  document.documentElement.dataset.ready = '1';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
