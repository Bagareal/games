/* ============ BILIO — il motore: fisica, regole, TheCreator ============

   Qui dentro non si disegna niente e non si tocca la pagina: ci sono solo
   numeri. Il gioco vero (bilio/script.js) usa questo file per far muovere le
   palle, e il computer lo usa per *provare* i tiri prima di farli — è lo stesso
   identico motore, quindi quello che TheCreator si immagina è esattamente
   quello che poi succede sul tavolo.

   Il tavolo, in unità di gioco: 100 di larghezza e 200 di lunghezza, con la
   palla di raggio 2,3. Sono le proporzioni di un tavolo vero (2 a 1, e una
   palla che ci sta dentro 22 volte in larghezza). Il disegno poi lo ingrandisce
   quanto serve, così il gioco è uguale su un telefono e su un computer.

   Le regole sono quelle del gioco a mezze e piene con la nera per ultima, con
   una semplificazione voluta e decisa insieme a Ivan: NIENTE FALLI. Non si
   perde il turno per aver colpito la palla sbagliata o per non aver colpito
   niente; l'unica cosa che costa è mandare in buca la bianca, e allora
   l'avversario la rimette dove vuole.

   Le regole del biliardo non sono di nessuno: è uno sport, si gioca da secoli.
   Codice, grafica e testi di questa pagina sono scritti da zero per il sito. */

(function (root) {
  'use strict';

  // ---------------- il tavolo ----------------
  const W = 100;          // larghezza del panno
  const H = 200;          // lunghezza del panno
  const R = 2.3;          // raggio di una palla
  const D = R * 2;        // diametro: la distanza fra i centri quando si toccano

  // Le buche. Gli angoli sono più larghi delle due centrali, come sui tavoli
  // veri. Il raggio è quello di "cattura": quando il CENTRO della palla ci
  // entra dentro, la palla è in buca.
  const POCKET_CORNER = 4.9;
  const POCKET_SIDE = 4.6;
  const POCKETS = [
    { x: 0, y: 0,     r: POCKET_CORNER },
    { x: W, y: 0,     r: POCKET_CORNER },
    { x: 0, y: H,     r: POCKET_CORNER },
    { x: W, y: H,     r: POCKET_CORNER },
    { x: 0, y: H / 2, r: POCKET_SIDE },
    { x: W, y: H / 2, r: POCKET_SIDE },
  ];

  // Il punto dove si rimette la bianca a inizio partita e il punto dove sta la
  // punta del triangolo: un quarto di tavolo dai due lati corti, come al bar.
  const CUE_SPOT = { x: W / 2, y: H * 0.75 };
  const FOOT_SPOT = { x: W / 2, y: H * 0.25 };

  // ---------------- come si muovono le palle ----------------
  const FRICTION = 105;      // quanto rallenta il panno, in unità al secondo²
  const STOP_SPEED = 1.2;    // sotto questa velocità la palla è ferma
  const E_RAIL = 0.72;       // quanto restituisce una sponda
  const E_BALL = 0.94;       // quanto restituisce un urto fra due palle
  const E_JAW = 0.35;        // il fondo della buca, quando una palla ci sbatte e non entra
  const MIN_SHOT = 40;       // velocità del tiro più leggero
  const MAX_SHOT = 420;      // velocità del tiro a tutta forza

  function speedOf(power) {
    const p = Math.max(0, Math.min(1, power));
    return MIN_SHOT + p * (MAX_SHOT - MIN_SHOT);
  }
  function powerOf(speed) {
    return (speed - MIN_SHOT) / (MAX_SHOT - MIN_SHOT);
  }

  /* Quanta forza serve per mandare una palla in buca. Non è una formula a
     occhio: si parte dalla fine e si torna indietro.
       - la palla colpita deve arrivare in fondo alla sua corsa con ancora un
         po' di passo: v² = 2·attrito·(strada + margine);
       - di quello che le arriva addosso prende solo la parte lungo la
         congiungente dei centri, cioè il coseno del taglio (per questo un
         colpo storto va tirato molto più forte);
       - la bianca, per arrivarci con quella velocità, deve partire più forte
         di quanto il panno le mangia per strada.
     Misurato: con la formula a occhio di prima un tiro scelto e mirato
     perfettamente entrava nel 79% dei casi, con questa nel 96%. */
  function powerForShot(cutCos, cueDist, objDist, margin) {
    const m = margin === undefined ? 26 : margin;
    const vObj = Math.sqrt(2 * FRICTION * (objDist + m));
    const transfer = Math.max(0.12, cutCos) * (1 + E_BALL) / 2;
    const vContact = vObj / transfer;
    const v0 = Math.sqrt(vContact * vContact + 2 * FRICTION * cueDist);
    return Math.max(0.2, Math.min(1, powerOf(v0)));
  }

  // ---------------- le palle ----------------
  // 0 è la bianca, da 1 a 7 le piene, 8 la nera, da 9 a 15 le mezze.
  function groupOf(id) {
    if (id >= 1 && id <= 7) return 'piene';
    if (id >= 9 && id <= 15) return 'mezze';
    return null;                       // la bianca e la nera non sono di nessuno
  }
  function otherGroup(g) { return g === 'piene' ? 'mezze' : 'piene'; }

  function makeBall(id, x, y) {
    return { id, x, y, vx: 0, vy: 0, in: false };
  }
  function copyBalls(balls) {
    const out = new Array(balls.length);
    for (let i = 0; i < balls.length; i++) {
      const b = balls[i];
      out[i] = { id: b.id, x: b.x, y: b.y, vx: b.vx, vy: b.vy, in: b.in };
    }
    return out;
  }

  /* Il triangolo. La punta sta sul suo punto, le file si allontanano da chi
     tira. La nera va in mezzo alla terza fila (è la sua posizione di sempre) e
     ai due angoli in fondo ci va una mezza e una piena, come si fa davvero;
     tutto il resto è mescolato, così ogni partita parte diversa. */
  function rack(rnd) {
    const rng = rnd || Math.random;
    const others = [];
    for (let i = 1; i <= 15; i++) if (i !== 8) others.push(i);
    // mescolata
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = others[i]; others[i] = others[j]; others[j] = t;
    }
    const piene = others.filter(id => groupOf(id) === 'piene');
    const mezze = others.filter(id => groupOf(id) === 'mezze');

    // le 15 caselle del triangolo, in ordine di fila
    const gap = D * 1.002;                 // un soffio di aria fra una palla e l'altra
    const rowGap = gap * Math.sqrt(3) / 2;
    const slots = [];
    for (let row = 0; row < 5; row++) {
      for (let k = 0; k <= row; k++) {
        slots.push({
          x: W / 2 + (k - row / 2) * gap,
          y: FOOT_SPOT.y - row * rowGap,    // le file salgono, lontano da chi tira
          row, k,
        });
      }
    }
    const order = [];                       // che palla va in che casella
    const centerThird = 4;                  // indice della casella centrale della terza fila
    const backLeft = 10, backRight = 14;    // i due angoli della fila di fondo

    const heads = [];
    if (rng() < 0.5) { heads.push(piene.pop(), mezze.pop()); }
    else { heads.push(mezze.pop(), piene.pop()); }

    const rest = piene.concat(mezze);
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = rest[i]; rest[i] = rest[j]; rest[j] = t;
    }

    for (let i = 0; i < 15; i++) {
      if (i === centerThird) order[i] = 8;
      else if (i === backLeft) order[i] = heads[0];
      else if (i === backRight) order[i] = heads[1];
      else order[i] = rest.pop();
    }

    const balls = [makeBall(0, CUE_SPOT.x, CUE_SPOT.y)];
    for (let i = 0; i < 15; i++) balls.push(makeBall(order[i], slots[i].x, slots[i].y));
    balls.sort((a, b) => a.id - b.id);
    return balls;
  }

  // ---------------- un passo di fisica ----------------
  // Il passo si spezza in tanti sotto-passi quanti ne servono perché nessuna
  // palla percorra più di un pezzetto di raggio per volta: senza questo, a
  // tutta forza una palla passerebbe *attraverso* un'altra o attraverso la
  // sponda senza accorgersene.
  function maxSpeed(balls) {
    let m = 0;
    for (const b of balls) {
      if (b.in) continue;
      const s = Math.abs(b.vx) + Math.abs(b.vy);
      if (s > m) m = s;
    }
    return m;
  }

  function step(balls, dt, ev) {
    const vmax = maxSpeed(balls);
    let n = Math.ceil(vmax * dt / (R * 0.35));
    if (!(n >= 1)) n = 1;
    if (n > 64) n = 64;
    const h = dt / n;
    for (let i = 0; i < n; i++) subStep(balls, h, ev);
  }

  function subStep(balls, h, ev) {
    // 1. si muovono e il panno le rallenta
    for (const b of balls) {
      if (b.in) continue;
      const sp = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (sp === 0) continue;
      b.x += b.vx * h;
      b.y += b.vy * h;
      const ns = sp - FRICTION * h;
      if (ns <= STOP_SPEED) { b.vx = 0; b.vy = 0; }
      else { const k = ns / sp; b.vx *= k; b.vy *= k; }
    }

    // 2. urti fra palle
    for (let i = 0; i < balls.length; i++) {
      const a = balls[i];
      if (a.in) continue;
      for (let j = i + 1; j < balls.length; j++) {
        const b = balls[j];
        if (b.in) continue;
        let dx = b.x - a.x, dy = b.y - a.y;
        let d2 = dx * dx + dy * dy;
        if (d2 >= D * D || d2 === 0) continue;

        /* Qui le due palle sono già UNA DENTRO L'ALTRA: il sotto-passo le ha
           fatte entrare oltre il punto di contatto. Rimbalzare adesso vuol dire
           rimbalzare su una congiungente dei centri già ruotata, ed è un errore
           che si vede: misurato, mandava fuori strada di 13 gradi anche un tiro
           quasi dritto. Quindi si riavvolge il tempo fino all'istante esatto in
           cui si sono toccate, si rimbalza lì, e poi si riparte in avanti con le
           velocità nuove. */
        const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
        const rel = Math.sqrt(rvx * rvx + rvy * rvy);
        let back = 0;
        if (rel > 1e-9) {
          const ux = rvx / rel, uy = rvy / rel;
          const proj = dx * ux + dy * uy;
          const disc = proj * proj - (d2 - D * D);
          if (disc >= 0) {
            const s = -proj - Math.sqrt(disc);      // quanto indietro, in distanza
            const dt = -s / rel;                    // quanto indietro, in tempo
            if (dt > 0 && dt <= h * 1.5) {
              back = dt;
              a.x -= a.vx * dt; a.y -= a.vy * dt;
              b.x -= b.vx * dt; b.y -= b.vy * dt;
              dx = b.x - a.x; dy = b.y - a.y;
              d2 = dx * dx + dy * dy;
            }
          }
        }

        const d = Math.sqrt(d2) || D;
        const nx = dx / d, ny = dy / d;
        if (back === 0) {
          // ferme e appiccicate: non c'è nessun istante da ritrovare, si stacca
          // e basta, mezzo scostamento a testa
          const overlap = (D - d) / 2;
          a.x -= nx * overlap; a.y -= ny * overlap;
          b.x += nx * overlap; b.y += ny * overlap;
        }

        // la velocità si scambia solo lungo la congiungente dei centri: è
        // questo che fa nascere da solo il "taglio" a 90° del biliardo vero
        const rvn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (rvn < 0) {
          const imp = -(1 + E_BALL) * rvn / 2;
          a.vx -= imp * nx; a.vy -= imp * ny;
          b.vx += imp * nx; b.vy += imp * ny;
        }
        if (back > 0) {
          // si torna al momento in cui eravamo, ma con le velocità di adesso
          a.x += a.vx * back; a.y += a.vy * back;
          b.x += b.vx * back; b.y += b.vy * back;
        }
        if (ev) {
          ev.hits++;
          if (ev.firstHit === null && (a.id === 0 || b.id === 0)) {
            ev.firstHit = a.id === 0 ? b.id : a.id;
          }
        }
      }
    }

    // 3. buche e sponde
    for (const b of balls) {
      if (b.in) continue;
      railsAndPockets(b, ev);
    }
  }

  function railsAndPockets(b, ev) {
    // in buca?
    for (const p of POCKETS) {
      const dx = b.x - p.x, dy = b.y - p.y;
      if (dx * dx + dy * dy < p.r * p.r) {
        b.in = true; b.vx = 0; b.vy = 0; b.x = p.x; b.y = p.y;
        if (ev) ev.potted.push(b.id);
        return;
      }
    }
    // vicino a una buca la sponda non c'è: è la sua bocca. Senza questo pezzo
    // una palla che rotola lungo la sponda rimbalzerebbe *davanti* alla buca
    // invece di entrarci.
    let mouth = false;
    for (const p of POCKETS) {
      const dx = b.x - p.x, dy = b.y - p.y;
      const m = p.r + R * 0.8;
      if (dx * dx + dy * dy < m * m) { mouth = true; break; }
    }
    if (!mouth) {
      if (b.x < R) { b.x = R; b.vx = Math.abs(b.vx) * E_RAIL; if (ev) ev.rails++; }
      else if (b.x > W - R) { b.x = W - R; b.vx = -Math.abs(b.vx) * E_RAIL; if (ev) ev.rails++; }
      if (b.y < R) { b.y = R; b.vy = Math.abs(b.vy) * E_RAIL; if (ev) ev.rails++; }
      else if (b.y > H - R) { b.y = H - R; b.vy = -Math.abs(b.vy) * E_RAIL; if (ev) ev.rails++; }
    } else {
      // dentro la bocca c'è il fondo: una palla che entra storta ci sbatte e
      // torna sul tavolo, come quando "balla" sulle punte e non entra
      const j = R * 0.4;
      if (b.x < -j) { b.x = -j; b.vx = Math.abs(b.vx) * E_JAW; }
      else if (b.x > W + j) { b.x = W + j; b.vx = -Math.abs(b.vx) * E_JAW; }
      if (b.y < -j) { b.y = -j; b.vy = Math.abs(b.vy) * E_JAW; }
      else if (b.y > H + j) { b.y = H + j; b.vy = -Math.abs(b.vy) * E_JAW; }
    }
  }

  function allStopped(balls) {
    for (const b of balls) {
      if (b.in) continue;
      if (b.vx !== 0 || b.vy !== 0) return false;
    }
    return true;
  }

  function newEvents() {
    return { potted: [], firstHit: null, hits: 0, rails: 0 };
  }

  /* Un tiro intero, dall'inizio alla fine, su una copia delle palle. È quello
     che usa TheCreator per guardare avanti, ed è lo stesso codice che muove le
     palle sullo schermo: nessuna sorpresa fra quello che pensa e quello che fa. */
  function simulate(balls, angle, power, maxTime) {
    const b = copyBalls(balls);
    const cue = b[0];
    const sp = speedOf(power);
    cue.vx = Math.cos(angle) * sp;
    cue.vy = Math.sin(angle) * sp;
    const ev = newEvents();
    const limit = maxTime || 9;
    let t = 0;
    const dt = 1 / 60;
    while (t < limit && !allStopped(b)) { step(b, dt, ev); t += dt; }
    return { balls: b, potted: ev.potted, firstHit: ev.firstHit, time: t };
  }

  // ---------------- la linea di mira ----------------
  // Segue la bianca finché non incontra qualcosa: una palla (e lì si ferma,
  // mostrando dove andrà quella palla), una buca, o una sponda — e allora
  // rimbalza e continua, fino a un tetto di segmenti.
  function traceAim(balls, from, dir, maxSegments) {
    const segs = [];
    let p = { x: from.x, y: from.y };
    let d = { x: dir.x, y: dir.y };
    const n = Math.max(1, maxSegments || 1);
    let out = { segs, ghost: null, target: -1, objDir: null, pocket: false };

    for (let s = 0; s < n; s++) {
      // la palla più vicina sulla strada
      let tBall = Infinity, hit = null;
      for (const b of balls) {
        if (b.in || b.id === 0) continue;
        const ex = b.x - p.x, ey = b.y - p.y;
        const proj = ex * d.x + ey * d.y;
        if (proj <= 0) continue;
        const perp2 = ex * ex + ey * ey - proj * proj;
        const rr = D * D;
        if (perp2 > rr) continue;
        const t = proj - Math.sqrt(rr - perp2);
        if (t < 0) continue;
        if (t < tBall) { tBall = t; hit = b; }
      }
      // la buca più vicina sulla strada
      let tPocket = Infinity;
      for (const q of POCKETS) {
        const ex = q.x - p.x, ey = q.y - p.y;
        const proj = ex * d.x + ey * d.y;
        if (proj <= 0) continue;
        const perp2 = ex * ex + ey * ey - proj * proj;
        if (perp2 > q.r * q.r) continue;
        const t = proj - Math.sqrt(q.r * q.r - perp2);
        if (t >= 0 && t < tPocket) tPocket = t;
      }
      // la sponda
      let tRail = Infinity;
      if (d.x > 1e-9) tRail = Math.min(tRail, (W - R - p.x) / d.x);
      else if (d.x < -1e-9) tRail = Math.min(tRail, (R - p.x) / d.x);
      if (d.y > 1e-9) tRail = Math.min(tRail, (H - R - p.y) / d.y);
      else if (d.y < -1e-9) tRail = Math.min(tRail, (R - p.y) / d.y);
      if (!(tRail > 0)) tRail = 0;

      const tMin = Math.min(tBall, tPocket, tRail);
      const end = { x: p.x + d.x * tMin, y: p.y + d.y * tMin };
      segs.push({ x1: p.x, y1: p.y, x2: end.x, y2: end.y });

      if (tBall <= tPocket && tBall <= tRail && hit) {
        out.ghost = end;
        out.target = hit.id;
        const ox = hit.x - end.x, oy = hit.y - end.y;
        const ol = Math.hypot(ox, oy) || 1;
        out.objDir = { x: ox / ol, y: oy / ol };
        return out;
      }
      if (tPocket < tRail) { out.pocket = true; return out; }

      // rimbalzo: si specchia la direzione sulla sponda toccata
      const eps = 1e-6;
      if (Math.abs(end.x - R) < 1e-3 || Math.abs(end.x - (W - R)) < 1e-3) d = { x: -d.x, y: d.y };
      else d = { x: d.x, y: -d.y };
      p = { x: end.x + d.x * eps, y: end.y + d.y * eps };
    }
    return out;
  }

  // ---------------- strada libera? ----------------
  function pathClear(balls, from, to, ignore, clearance) {
    const dx = to.x - from.x, dy = to.y - from.y;
    const len = Math.hypot(dx, dy);
    if (len < 1e-6) return true;
    const ux = dx / len, uy = dy / len;
    for (const b of balls) {
      if (b.in) continue;
      if (ignore.indexOf(b.id) !== -1) continue;
      const ex = b.x - from.x, ey = b.y - from.y;
      let proj = ex * ux + ey * uy;
      if (proj < -clearance || proj > len + clearance) continue;
      if (proj < 0) proj = 0; else if (proj > len) proj = len;
      const cx = from.x + ux * proj - b.x;
      const cy = from.y + uy * proj - b.y;
      if (cx * cx + cy * cy < clearance * clearance) return false;
    }
    return true;
  }

  function inTable(x, y, margin) {
    const m = margin === undefined ? R : margin;
    return x >= m && x <= W - m && y >= m && y <= H - m;
  }
  function spotFree(balls, x, y, ignoreId) {
    for (const b of balls) {
      if (b.in || b.id === ignoreId) continue;
      const dx = b.x - x, dy = b.y - y;
      if (dx * dx + dy * dy < (D + 0.2) * (D + 0.2)) return false;
    }
    return true;
  }

  // ---------------- le regole ----------------
  function newGame(mode, difficulty, rnd) {
    return {
      balls: rack(rnd),
      mode: mode,                    // 'pc' oppure 'friend'
      difficulty: difficulty,
      turn: 'p1',
      groups: { p1: null, p2: null },
      open: true,                    // finché nessuno ha imbucato, le palle sono di tutti
      ballInHand: false,
      shots: 0,
      over: false,
      winner: null,
      reason: null,                  // 'eight' | 'earlyEight' | 'cueWithEight'
    };
  }
  function otherPlayer(p) { return p === 'p1' ? 'p2' : 'p1'; }

  function remainingOf(game, who) {
    const g = game.groups[who];
    if (!g) return null;
    let n = 0;
    for (const b of game.balls) if (!b.in && groupOf(b.id) === g) n++;
    return n;
  }
  // Le palle che chi tira può prendere di mira adesso.
  function targetsFor(game, who) {
    const out = [];
    const g = game.groups[who];
    if (game.open || !g) {
      for (const b of game.balls) if (!b.in && b.id !== 0 && b.id !== 8) out.push(b);
      return out;
    }
    for (const b of game.balls) if (!b.in && groupOf(b.id) === g) out.push(b);
    if (!out.length) {
      const eight = game.balls[8];
      if (eight && !eight.in) out.push(eight);
    }
    return out;
  }

  // Rimette la nera sul tavolo (succede solo se finisce in buca sulla spaccata).
  function respotEight(game) {
    const eight = game.balls[8];
    eight.in = false;
    eight.vx = 0; eight.vy = 0;
    let y = FOOT_SPOT.y;
    while (y < H - R * 2 && !spotFree(game.balls, FOOT_SPOT.x, y, 8)) y += D;
    eight.x = FOOT_SPOT.x;
    eight.y = Math.min(y, H - R * 2);
  }
  // Rimette la bianca al suo posto: serve solo per ricostruire una partita, in
  // gioco chi ha la bianca in mano se la piazza dove vuole.
  function respotCue(game) {
    const cue = game.balls[0];
    cue.in = false; cue.vx = 0; cue.vy = 0;
    let y = CUE_SPOT.y;
    while (y > R * 2 && !spotFree(game.balls, CUE_SPOT.x, y, 0)) y -= D;
    cue.x = CUE_SPOT.x;
    cue.y = Math.max(y, R * 2);
  }

  /* Cosa succede dopo un tiro. Restituisce un resoconto che il gioco usa per
     dire a parole cos'è successo. Niente falli: l'unica punizione è la bianca
     in buca, che passa la mano e lascia la palla in mano all'altro. */
  function resolveShot(game, potted) {
    const shooter = game.turn;
    const opponent = otherPlayer(shooter);
    const cueIn = potted.indexOf(0) !== -1;
    const eightIn = potted.indexOf(8) !== -1;
    const objects = potted.filter(id => id !== 0 && id !== 8);
    const wasOpen = game.open;
    const wasBreak = game.shots === 0;
    game.shots++;

    const res = {
      shooter, potted: potted.slice(),
      assigned: null, cueIn, eightIn,
      keepTurn: false, ballInHand: false, respot: false,
      win: false, lose: false,
    };

    // i gruppi si decidono con la prima palla imbucata davvero
    if (wasOpen && objects.length) {
      const g = groupOf(objects[0]);
      game.groups[shooter] = g;
      game.groups[opponent] = otherGroup(g);
      game.open = false;
      res.assigned = g;
    }

    if (eightIn) {
      // sulla spaccata la nera non conta: torna sul tavolo e si va avanti
      if (wasBreak || game.open) {
        respotEight(game);
        res.respot = true;
      } else {
        const left = remainingOf(game, shooter);
        if (left === 0 && !cueIn) {
          game.over = true; game.winner = shooter; game.reason = 'eight';
          res.win = true;
          return res;
        }
        game.over = true;
        game.winner = opponent;
        game.reason = cueIn ? 'cueWithEight' : 'earlyEight';
        res.lose = true;
        return res;
      }
    }

    if (cueIn) {
      game.turn = opponent;
      game.ballInHand = true;
      res.ballInHand = true;
      return res;
    }

    // si continua se si è imbucata roba propria (a tavolo aperto: una qualsiasi)
    let mine = 0;
    const g = game.groups[shooter];
    for (const id of objects) {
      if (!g || (wasOpen && res.assigned)) { mine++; continue; }
      if (groupOf(id) === g) mine++;
    }
    if (mine > 0) { res.keepTurn = true; return res; }

    game.turn = opponent;
    return res;
  }

  // ---------------- TheCreator ----------------
  /* Come ragiona: per ogni palla che può prendere di mira e per ognuna delle sei
     buche calcola il punto in cui deve colpirla (la "palla fantasma"), butta via
     i tiri con la strada occupata o con un taglio troppo stretto, e dà un voto a
     quel che resta. Poi, a seconda del livello, o si fida del voto o va a
     *provare* i tiri migliori dentro al motore prima di scegliere. */

  /* L'errore di mira NON è un angolo: è di quanto si sbaglia il punto in cui la
     bianca tocca la palla, misurato in unità di tavolo (il diametro di una
     palla è 4,6). Un angolo fisso sarebbe ingiusto e sbagliato: due gradi su un
     tiro corto non si vedono, sullo stesso tiro lungo un metro fanno finire la
     palla da un'altra parte — misurato, era il motivo per cui il livello
     Normale imbucava solo un tiro su cinque. Così invece la difficoltà è la
     stessa da vicino e da lontano, e il conto lo fa aiShoot dividendo per la
     distanza. Il margine per imbucare è circa 0,25: sopra si sbaglia. */
  const LEVELS = {
    stupido: { random: 0.45, aimOffset: 0.9,  powerError: 0.30, simulate: 0, safety: 4 },
    normale: { random: 0.05, aimOffset: 0.26, powerError: 0.10, simulate: 0, safety: 10 },
    master:  { random: 0,    aimOffset: 0.07, powerError: 0.03, simulate: 10, safety: 26 },
  };

  function candidates(balls, targets) {
    const cue = balls[0];
    const out = [];
    for (const t of targets) {
      for (const p of POCKETS) {
        const tpx = p.x - t.x, tpy = p.y - t.y;
        const tpLen = Math.hypot(tpx, tpy);
        if (tpLen < 1e-6) continue;
        const ux = tpx / tpLen, uy = tpy / tpLen;

        // dove deve arrivare la bianca per mandare la palla verso la buca
        const ghost = { x: t.x - ux * D, y: t.y - uy * D };
        if (!inTable(ghost.x, ghost.y, -R * 0.5)) continue;

        const cgx = ghost.x - cue.x, cgy = ghost.y - cue.y;
        const cgLen = Math.hypot(cgx, cgy);
        if (cgLen < 1e-6) continue;
        const ax = cgx / cgLen, ay = cgy / cgLen;

        // taglio: quanto è storto il colpo. Oltre gli 80° non si fa
        const cos = ax * ux + ay * uy;
        if (cos < 0.18) continue;
        const cut = Math.acos(Math.max(-1, Math.min(1, cos)));

        /* Strada libera? Due palle si toccano quando i centri distano D, quindi
           la distanza da tenere è D e non un po' meno: con D·0,96 passavano per
           buoni dei tiri che invece sbattevano contro una palla di striscio.
           Le due strade si accorciano di mezza palla alle estremità, se no
           una palla appiccicata a quella da imbucare risulterebbe "in mezzo"
           anche quando non lo è. */
        const stopShort = { x: ghost.x - ax * D * 0.5, y: ghost.y - ay * D * 0.5 };
        const startAfter = { x: t.x + ux * D * 0.5, y: t.y + uy * D * 0.5 };
        if (!pathClear(balls, cue, stopShort, [0, t.id], D * 1.01)) continue;
        if (!pathClear(balls, startAfter, p, [t.id], D * 1.01)) continue;

        const power = powerForShot(cos, cgLen, tpLen);

        const score = 100 - (cut * 180 / Math.PI) * 0.85 - (cgLen + tpLen) * 0.1;
        out.push({ angle: Math.atan2(ay, ax), power, score, target: t.id, pocket: p, cut, dist: cgLen });
      }
    }
    out.sort((a, b) => b.score - a.score);
    return out;
  }

  // Quante occasioni buone lascia una certa posizione a chi tira dopo.
  function chances(balls, game, who) {
    const fake = { balls, groups: game.groups, open: game.open };
    const targets = targetsFor(fake, who);
    if (!targets.length) return 0;
    const c = candidates(balls, targets);
    if (!c.length) return 0;
    let v = 0;
    for (let i = 0; i < Math.min(3, c.length); i++) v += Math.max(0, c[i].score);
    return v;
  }

  function jitter(rng, amount) { return (rng() * 2 - 1) * amount; }

  function aiShoot(game, rnd) {
    const rng = rnd || Math.random;
    const level = LEVELS[game.difficulty] || LEVELS.normale;
    const who = game.turn;
    const balls = game.balls;
    const targets = targetsFor(game, who);
    const list = candidates(balls, targets);

    let choice = null;

    // primo tiro della partita: si spacca, non si studia niente
    if (game.shots === 0) {
      const br = breakShot(game, rng);
      return { angle: br.angle, power: br.power, target: br.target };
    }

    if (list.length) {
      if (level.random > 0 && rng() < level.random) {
        choice = list[Math.floor(rng() * list.length)];
      } else if (level.simulate > 0) {
        choice = bestBySimulation(game, list.slice(0, level.simulate), rng);
      } else {
        choice = list[0];
      }
    }

    if (!choice) choice = safetyShot(game, level, rng);

    const dist = Math.max(8, choice.dist || 50);
    const angle = choice.angle + jitter(rng, level.aimOffset / dist);
    const power = Math.max(0.16, Math.min(1, choice.power * (1 + jitter(rng, level.powerError))));
    return { angle, power, target: choice.target };
  }

  // I tiri migliori provati sul serio, uno per uno, con due forze diverse.
  function bestBySimulation(game, list, rng) {
    const who = game.turn;
    const opp = otherPlayer(who);
    const myGroup = game.groups[who];
    const started = now();
    let best = null, bestScore = -Infinity;

    for (const c of list) {
      for (const mul of [1, 1.22]) {
        if (now() - started > 240) break;         // non si pensa all'infinito
        const power = Math.max(0.18, Math.min(1, c.power * mul));
        const sim = simulate(game.balls, c.angle, power, 8);
        let s = 0;
        let minePotted = 0, eightPotted = false, cuePotted = false;
        for (const id of sim.potted) {
          if (id === 0) cuePotted = true;
          else if (id === 8) eightPotted = true;
          else if (!myGroup || groupOf(id) === myGroup) minePotted++;
          else s -= 260;                          // regalata all'avversario
        }
        s += minePotted * 900;
        if (cuePotted) s -= 700;
        if (eightPotted) {
          const left = countGroup(sim.balls, myGroup);
          s += (left === 0 && !cuePotted) ? 5000 : -5000;
        }
        // com'è il tavolo dopo: meglio se resta un tiro facile per me
        if (!sim.balls[0].in) {
          const after = { balls: sim.balls, groups: game.groups, open: game.open && !minePotted };
          s += chances(sim.balls, after, minePotted > 0 ? who : opp) * (minePotted > 0 ? 0.55 : -0.35);
        }
        if (s > bestScore) { bestScore = s; best = { angle: c.angle, power, target: c.target, dist: c.dist }; }
      }
    }
    return best || list[0];
  }

  function countGroup(balls, g) {
    if (!g) return 99;
    let n = 0;
    for (const b of balls) if (!b.in && groupOf(b.id) === g) n++;
    return n;
  }

  /* La spaccata: la prima palla del triangolo, a tutta forza. Va scritta a
     parte perché a triangolo chiuso non esiste NESSUN tiro da imbucare — ogni
     strada verso una buca è tappata da un'altra palla — e senza questo pezzo il
     computer aprirebbe la partita con un tocchetto. */
  function breakShot(game, rng) {
    const cue = game.balls[0];
    let apex = null, best = Infinity;
    for (const b of game.balls) {
      if (b.in || b.id === 0) continue;
      const d = Math.hypot(b.x - cue.x, b.y - cue.y);
      if (d < best) { best = d; apex = b; }
    }
    if (!apex) return { angle: -Math.PI / 2, power: 1, target: -1, dist: 50 };
    return {
      angle: Math.atan2(apex.y - cue.y, apex.x - cue.x) + jitter(rng, 0.012),
      power: 0.92 + rng() * 0.08,
      target: apex.id,
      dist: best,
    };
  }

  /* Quando non c'è niente da imbucare: si tira verso una palla propria e si
     sceglie il colpo che lascia messo peggio l'avversario. Anche il livello più
     scarso ci prova, ma con due tentativi in croce.

     Regola che vale per tutti e tre i livelli: il tiro DEVE toccare qualcosa.
     Senza falli, il colpo che conviene di più sarebbe tirare così piano da non
     arrivare nemmeno a sfiorare le palle — l'avversario non riceve niente e il
     tavolo resta com'è. Provato davvero: dopo due tiri il triangolo era ancora
     chiuso. Quindi la forza parte da quella che serve per arrivare in fondo, e
     un tiro che non tocca niente prende un voto pessimo. */
  function safetyShot(game, level, rng) {
    const cue = game.balls[0];
    const who = game.turn;
    const opp = otherPlayer(who);
    const targets = targetsFor(game, who);
    const tries = Math.max(2, level.safety);
    let best = null, bestScore = -Infinity;

    for (let i = 0; i < tries; i++) {
      let angle, dist = 50;
      if (targets.length) {
        const t = targets[Math.floor(rng() * targets.length)];
        angle = Math.atan2(t.y - cue.y, t.x - cue.x) + jitter(rng, 0.18);
        dist = Math.hypot(t.x - cue.x, t.y - cue.y);
      } else {
        angle = rng() * Math.PI * 2;
      }
      // la forza minima è quella che porta la bianca fin lì con ancora passo
      const reach = powerOf(Math.sqrt(2 * FRICTION * (dist + 28)));
      const power = Math.max(reach, 0.22) + rng() * 0.28;
      if (level.simulate === 0 && i === 0) return { angle, power, target: -1, dist };

      const sim = simulate(game.balls, angle, power, 8);
      let s = sim.firstHit === null ? -2500 : 0;
      for (const id of sim.potted) {
        if (id === 0) s -= 900;
        else if (id === 8) s -= 4000;
        else if (groupOf(id) === game.groups[who] || !game.groups[who]) s += 800;
        else s -= 300;
      }
      if (!sim.balls[0].in) {
        const after = { balls: sim.balls, groups: game.groups, open: game.open };
        s -= chances(sim.balls, after, opp) * 0.6;
      }
      if (s > bestScore) { bestScore = s; best = { angle, power, target: -1, dist }; }
    }
    return best || { angle: rng() * Math.PI * 2, power: 0.35, target: -1, dist: 50 };
  }

  /* La bianca in mano: si cerca il posto da cui si vede il tiro più facile.
     Si prova a mettersi in linea con ogni palla e ogni buca, a una distanza
     comoda, e si tiene la sistemazione col voto più alto. */
  function aiPlaceCue(game, rnd) {
    const rng = rnd || Math.random;
    const balls = game.balls;
    const targets = targetsFor(game, game.turn);
    let best = null, bestScore = -Infinity;

    for (const t of targets) {
      for (const p of POCKETS) {
        const tpx = p.x - t.x, tpy = p.y - t.y;
        const tpLen = Math.hypot(tpx, tpy) || 1;
        const ux = tpx / tpLen, uy = tpy / tpLen;
        const ghost = { x: t.x - ux * D, y: t.y - uy * D };
        for (const back of [16, 26, 40]) {
          const c = { x: ghost.x - ux * back, y: ghost.y - uy * back };
          if (!inTable(c.x, c.y, R * 1.5)) continue;
          if (!spotFree(balls, c.x, c.y, 0)) continue;
          if (!pathClear(balls, c, ghost, [0, t.id], D * 0.96)) continue;
          if (!pathClear(balls, t, p, [t.id], D * 0.94)) continue;
          const s = 100 - (back + tpLen) * 0.12 + rng() * 3;
          if (s > bestScore) { bestScore = s; best = c; }
        }
      }
    }
    if (best) return best;
    // niente di comodo: in mezzo al tavolo, nel primo posto libero
    for (let k = 0; k < 60; k++) {
      const c = { x: R * 2 + rng() * (W - R * 4), y: R * 2 + rng() * (H - R * 4) };
      if (spotFree(balls, c.x, c.y, 0)) return c;
    }
    return { x: CUE_SPOT.x, y: CUE_SPOT.y };
  }

  function now() {
    return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
  }

  root.BILIO = {
    W, H, R, D, POCKETS, CUE_SPOT, FOOT_SPOT,
    MIN_SHOT, MAX_SHOT, FRICTION,
    speedOf, groupOf, otherGroup, otherPlayer,
    rack, copyBalls, makeBall,
    step, allStopped, newEvents, simulate,
    traceAim, pathClear, inTable, spotFree,
    newGame, targetsFor, remainingOf, resolveShot, respotEight, respotCue,
    aiShoot, aiPlaceCue, candidates,
  };
})(typeof window !== 'undefined' ? window : self);
