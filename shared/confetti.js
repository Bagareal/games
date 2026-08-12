// Free For Real — i coriandoli, uguali per tutto il sito.
// Incluso dalle pagine che li usano, PRIMA dello script del gioco:
//   <script src="../shared/confetti.js"></script>
// Si chiamano così:
//   FFR.confetti({ colors: ['#F2622E', ...], count: 90, origin: { x: 0.5, y: 0.5 } })
//
// Prima questo lo faceva una libreria presa da un indirizzo esterno, e
// quell'indirizzo rispondeva 404: i coriandoli non uscivano più da un pezzo,
// in silenzio, perché il gioco controllava prima se la libreria c'era. Farli in
// casa vuol dire anche che escono quando si gioca senza rete, che qui è una
// promessa scritta in home.
(function () {
  'use strict';

  const GRAVITY = 1400;   // px al secondo quadrato: quanto tira in giù
  const DRAG = 0.55;      // quanto frena l'aria, per secondo
  const LIFE = 2.4;       // secondi di vita di un coriandolo, poi è sparito

  let canvas = null;
  let ctx = null;
  let pieces = [];
  let running = false;
  let last = 0;

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Un telo solo per tutta la pagina, sopra a tutto e trasparente al tocco:
  // resta lì finché ci sono coriandoli da disegnare, poi si toglie di mezzo.
  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed; inset:0; width:100%; height:100%;'
      + ' pointer-events:none; z-index:9999;';
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    document.body.appendChild(canvas);
  }

  function removeCanvas() {
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null;
    ctx = null;
  }

  function frame(now) {
    if (!canvas) { running = false; return; }
    // il primo giro non ha un "prima": si parte da un passo finto di 1/60,
    // altrimenti i coriandoli saltano in avanti di quanto è durato il caricamento
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
    last = now;

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const brake = Math.pow(DRAG, dt);
    let alive = 0;
    for (const p of pieces) {
      if (p.life <= 0) continue;
      p.vy += GRAVITY * dt;
      p.vx *= brake;
      p.vy *= brake;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.spin * dt;
      p.flip += p.flipSpeed * dt;
      p.life -= dt;
      if (p.y - p.h > h) { p.life = 0; continue; }
      alive++;

      ctx.save();
      ctx.globalAlpha = Math.min(1, p.life / 0.5);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      // il coriandolo è un rettangolo di carta che gira su sé stesso: si
      // schiaccia e si riapre invece di restare sempre di piatto
      ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.9 + 0.1);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    if (alive === 0) {
      pieces = [];
      running = false;
      last = 0;
      removeCanvas();
      return;
    }
    requestAnimationFrame(frame);
  }

  const DEFAULT_COLORS = ['#F2622E', '#F4B740', '#14A085', '#FFFDF8'];

  function confetti(opts) {
    const o = opts || {};
    if (reducedMotion()) return;
    const colors = (o.colors && o.colors.length) ? o.colors : DEFAULT_COLORS;
    const count = Math.max(1, Math.min(200, o.count || 90));
    const origin = o.origin || {};
    const x0 = (typeof origin.x === 'number' ? origin.x : 0.5) * window.innerWidth;
    const y0 = (typeof origin.y === 'number' ? origin.y : 0.5) * window.innerHeight;
    // lo scoppio parte verso l'alto, aperto a ventaglio: mezzo giro scarso,
    // centrato sulla verticale
    const spread = (typeof o.spread === 'number' ? o.spread : 75) * Math.PI / 180;

    ensureCanvas();
    for (let i = 0; i < count; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * spread * 2;
      const speed = 380 + Math.random() * 420;
      pieces.push({
        x: x0 + (Math.random() - 0.5) * 24,
        y: y0 + (Math.random() - 0.5) * 24,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        w: 6 + Math.random() * 5,
        h: 9 + Math.random() * 5,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 12,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 4 + Math.random() * 6,
        life: LIFE * (0.7 + Math.random() * 0.3),
        color: colors[i % colors.length],
      });
    }
    if (!running) {
      running = true;
      last = 0;
      requestAnimationFrame(frame);
    }
  }

  window.FFR = window.FFR || {};
  window.FFR.confetti = confetti;
})();
