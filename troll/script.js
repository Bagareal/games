/* ============ TROLL — motore di gioco ============
 *
 * Un quadro = una schermata: si vede tutto il percorso, non c'è scorrimento.
 * Quello che non si vede sono le trappole, che stanno sempre nello stesso
 * posto e non lasciano nessun segno: si imparano morendo, e morire non costa
 * niente perché non ci sono né vite né tempo.
 *
 * I comandi devono essere perfetti (vedi COYOTE e BUFFER più sotto): il gioco
 * frega con le trappole, mai col salto che non parte.
 */

// ---------- Lingua condivisa con tutto il sito ----------
const LANGUAGES = {
  it: { label: 'Italiano', flag: 'flag-it' },
  en: { label: 'English', flag: 'flag-en' },
  fr: { label: 'Français', flag: 'flag-fr' },
};
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    levelWord: 'Livello',
    backToHome: 'Torna in Home',
    close: 'Chiudi',
    settingsTitle: 'Impostazioni',
    languageMenuLabel: 'Lingua',
    languageTitle: 'Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    howMenuLabel: 'Come si gioca',
    howTitle: 'Come si gioca',
    howMove: 'Al computer: A e D per muoverti, Spazio per saltare. Tieni premuto lo spazio e salti più in alto.',
    howTouch: 'Col dito: le frecce a sinistra del campo per muoverti, il tasto a destra per saltare. Tienilo premuto e salti più in alto.',
    howGoal: "Porta il quadrato dal punto A al punto B. Non ci sono vite e non c'è tempo: se muori, il quadro ricomincia.",
    howTraps: 'Il gioco bara. Ci sono trappole che non si vedono, ma stanno sempre nello stesso posto: ogni morte ti insegna dov\'erano.',
    leaderboardMenuLabel: 'Classifica',
    leaderboardTitle: 'Classifica',
    leaderboardSub: 'Vince chi è arrivato più avanti',
    leaderboardEmpty: 'Nessun punteggio ancora: gioca da loggato per essere il primo!',
    turnDevice: 'Gira il telefono',
    endTitle: 'Fine dei quadri',
    endBody: 'Per ora i quadri finiscono qui. Gli altri stanno arrivando.',
    replayLast: "Rigioca l'ultimo quadro",
    // scritte dipinte dentro al primo quadro, al posto del solito pannello
    hintMove: 'A e D per muoverti',
    hintMoveTouch: 'le frecce per muoverti',
    hintJump: 'SPAZIO per saltare',
    hintJumpTouch: 'il tasto a destra per saltare',
    hintHold: 'tieni premuto: salti più in alto',
    hintAlmost: 'sei quasi arrivato',
  },
  en: {
    levelWord: 'Level',
    backToHome: 'Back to Home',
    close: 'Close',
    settingsTitle: 'Settings',
    languageMenuLabel: 'Language',
    languageTitle: 'Language',
    languageSub: 'Choose the interface language',
    howMenuLabel: 'How to play',
    howTitle: 'How to play',
    howMove: 'On a computer: A and D to move, Space to jump. Hold Space down to jump higher.',
    howTouch: 'With your finger: the arrows on the left of the field move you, the button on the right jumps. Hold it down to jump higher.',
    howGoal: 'Take the square from point A to point B. No lives and no clock: if you die, the screen starts over.',
    howTraps: 'The game cheats. Some traps are invisible, but they are always in the same spot: every death teaches you where they were.',
    leaderboardMenuLabel: 'Leaderboard',
    leaderboardTitle: 'Leaderboard',
    leaderboardSub: 'Whoever got the furthest wins',
    leaderboardEmpty: 'No scores yet: play while signed in to be the first!',
    turnDevice: 'Turn your phone',
    endTitle: 'End of the screens',
    endBody: 'The screens stop here for now. The rest are on their way.',
    replayLast: 'Replay the last screen',
    hintMove: 'A and D to move',
    hintMoveTouch: 'the arrows move you',
    hintJump: 'SPACE to jump',
    hintJumpTouch: 'the button on the right jumps',
    hintHold: 'hold it down: you jump higher',
    hintAlmost: 'you are almost there',
  },
  fr: {
    levelWord: 'Niveau',
    backToHome: "Retour à l'accueil",
    close: 'Fermer',
    settingsTitle: 'Paramètres',
    languageMenuLabel: 'Langue',
    languageTitle: 'Langue',
    languageSub: "Choisis la langue de l'interface",
    howMenuLabel: 'Comment jouer',
    howTitle: 'Comment jouer',
    howMove: "Sur ordinateur : A et D pour te déplacer, Espace pour sauter. Garde Espace enfoncé et tu sautes plus haut.",
    howTouch: "Au doigt : les flèches à gauche du terrain te déplacent, le bouton à droite fait sauter. Garde-le enfoncé et tu sautes plus haut.",
    howGoal: "Amène le carré du point A au point B. Pas de vies et pas de chrono : si tu meurs, le tableau recommence.",
    howTraps: "Le jeu triche. Certains pièges sont invisibles, mais ils sont toujours au même endroit : chaque mort t'apprend où ils étaient.",
    leaderboardMenuLabel: 'Classement',
    leaderboardTitle: 'Classement',
    leaderboardSub: 'Celui qui est allé le plus loin gagne',
    leaderboardEmpty: 'Aucun score pour le moment : joue en étant connecté pour être le premier !',
    turnDevice: 'Tourne ton téléphone',
    endTitle: 'Fin des tableaux',
    endBody: "Les tableaux s'arrêtent là pour l'instant. Les autres arrivent.",
    replayLast: 'Rejouer le dernier tableau',
    hintMove: 'A et D pour te déplacer',
    hintMoveTouch: 'les flèches te déplacent',
    hintJump: 'ESPACE pour sauter',
    hintJumpTouch: 'le bouton à droite fait sauter',
    hintHold: 'garde enfoncé : tu sautes plus haut',
    hintAlmost: 'tu y es presque',
  },
};

let language = 'it';
function t() { return UI_STRINGS[language] || UI_STRINGS.it; }
function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t()[el.dataset.i18n];
    if (typeof val === 'string') el.textContent = val;
  });
}
function getSiteLanguage() {
  try {
    const v = localStorage.getItem(SITE_LANGUAGE_KEY);
    return v && LANGUAGES[v] ? v : null;
  } catch (e) { return null; }
}
function setSiteLanguage(code) {
  try { localStorage.setItem(SITE_LANGUAGE_KEY, code); } catch (e) { /* ignora */ }
}

// ---------- Misure del campo ----------
const COLS = 40, ROWS = 22, TILE = 16;
const VW = COLS * TILE, VH = ROWS * TILE;   // 640 x 352 unità virtuali
const PSIZE = 12;                            // il quadrato: più stretto di una mattonella

// ---------- Fisica ----------
// Numeri scelti in modo che un salto pieno alzi 2,4 mattonelle e ne copra 3,6
// in orizzontale: tutti i quadri sono disegnati dentro questi limiti.
const GRAVITY = 1500;
const RUN = 132;
const JUMP_V = 340;
const JUMP_CUT = 150;   // lasciando il tasto la salita si spezza qui
const MAX_FALL = 620;
const COYOTE = 0.09;    // si può saltare per un soffio dopo essere usciti dal bordo
const BUFFER = 0.11;    // salto premuto poco prima di atterrare: parte lo stesso
const STEP = 1 / 240;   // passo fisso: la fisica non cambia col fotogramma
const CRUMBLE_MS = 180; // quanto regge un pavimento che collassa
const SPIN_RATE = 9;    // giri al secondo del quadrato, in radianti
const DEATH_MS = 560;   // tanto quanto basta a vedere uscire la spina
const SPIKE_OUT_MS = 130;
const WIN_MS = 620;

// ---------- I quadri ----------
// Un quadro è un disegno: una riga di testo per ogni riga di mattonelle.
// Le righe più corte di 40 vengono completate con del vuoto, così basta
// scrivere fino all'ultimo pezzo che conta.
//
//   .  vuoto              #  solido
//   m  solido invisibile  g  sembra solido ma ci si passa attraverso
//   ^  spina visibile     x  spina invisibile
//   c  collassa dopo che ci sali
//   s  portale specchio: uscendone dall'altra parte i comandi si invertono
//   A  partenza           B  arrivo
//
// hints: le scritte dipinte sul fondo (solo il primo quadro, che è il manuale).
//
//          0123456789012345678901234567890123456789
const LEVELS = [
  {
    rows: [
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      '......................................B.',
      '...............................c.c.c.###',
      '......................########..........',
      '..A...................########..........',
      '#############..#########################',
      '#############..#########################',
      '#############..#########################',
    ],
    // una scritta per riga: sono lunghe e in tre lingue diverse, e due sulla
    // stessa riga finiscono per sovrapporsi in almeno una delle tre
    hints: [
      { col: 5, row: 16.6, key: 'hintMove' },
      { col: 12, row: 14.8, key: 'hintJump' },
      { col: 22, row: 12.8, key: 'hintHold' },
      { col: 33, row: 10.8, key: 'hintAlmost' },
    ],
  },
  {
    rows: [
      '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
      '..A.......^^.....x.........xx.....x...B.',
      '######################..################',
      '######################..################',
      '######################..################',
    ],
  },
  // Il muro si attraversa in alto, all'altezza del camminamento: da terra
  // sembra pieno e la strada bassa e' un vicolo cieco.
  {
    rows: [
      '', '', '', '', '', '',
      '........................#...............',
      '........................#...............',
      '........................#...............',
      '........................#...............',
      '........................#...............',
      '........................g...............',
      '..................#############.........',
      '................#.......#...............',
      '........................#...............',
      '..............#.........#...............',
      '........................#...............',
      '............#...........#...............',
      '..A.....................#......^^.....B.',
      '########################################',
      '########################################',
      '########################################',
    ],
  },
  // Una scala che non c'e', in aria sopra il vuoto: si vede solo il primo
  // gradino. La mensola bassa a destra e' l'invito sbagliato.
  {
    rows: [
      '', '', '', '',
      '...................................B....',
      '..................................###...',
      '........................................',
      '...............................mm.......',
      '........................................',
      '............................mm..........',
      '........................................',
      '.........................mm.............',
      '........................................',
      '......................mm................',
      '........................................',
      '...................mm...................',
      '........................................',
      '................##...xx.................',
      '..A..................##.................',
      '###############.........................',
      '###############.........................',
      '###############.........................',
    ],
  },
  // Solo lo specchio: il portale e' largo due, dentro i comandi sono ancora
  // quelli veri e si girano quando ne sei uscito dall'altra parte.
  {
    rows: [
      '', '', '', '', '', '', '', '', '', '', '', '', '',
      '............ss..........................',
      '............ss..........................',
      '............ss..........................',
      '............ss..........................',
      '............ss..........................',
      '..A.........ss......x................B..',
      '##########################..############',
      '##########################..############',
      '##########################..############',
    ],
  },
];

const SOLID = '#mc';
const DEADLY = '^x';
const LOOKS_SOLID = '#gc';

// ---------- Stato ----------
const els = {};
const state = {
  level: 1,
  maxLevel: 1,
  attempts: {},        // { "1": 4, "2": 11, ... }
  totalAttempts: 0,
  grid: null,          // copia del quadro, modificabile durante il tentativo
  spawn: { x: 0, y: 0 },
  goal: { col: 0, row: 0 },
  inverted: false,
  portals: [],         // { c0, c1, side } — le strisce specchio del quadro
  crumbling: [],       // { idx, at }
  player: { x: 0, y: 0, vx: 0, vy: 0, onGround: false, coyote: 0, buffer: 0 },
  spin: 0,             // giro del quadrato: solo nel salto con direzione
  killer: null,        // la spina che ti ha appena ucciso, da mostrare a morte
  trail: [],
  particles: [],
  phase: 'play',       // 'play' | 'dead' | 'won'
  phaseAt: 0,
  titleAt: 0,
  running: false,
  dirty: true,
};
const held = { left: false, right: false, jump: false };
const padPointers = new Map();
const isTouch = (navigator.maxTouchPoints || 0) > 0 || 'ontouchstart' in window;

let ctx = null, statCtx = null, statCanvas = null, glowSprite = null;
let scale = 1;

// ---------- Il palco: misure e rotazione ----------
// Su telefono e tablet tenuti in verticale il gioco viene costruito orizzontale
// e girato di 90 gradi: chi gira l'apparecchio in mano se lo ritrova dritto
// anche con il blocco rotazione acceso. Su computer non si gira mai, nemmeno
// con la finestra stretta: lì si restringe e basta.
function layout() {
  const w = Math.round(window.innerWidth);
  const h = Math.round(window.innerHeight);
  const rotate = isTouch && h > w;
  const sw = rotate ? h : w;
  const sh = rotate ? w : h;

  els.stage.style.width = sw + 'px';
  els.stage.style.height = sh + 'px';
  els.stage.style.transform = rotate ? 'translateX(' + w + 'px) rotate(90deg)' : 'none';

  // Su telefono e tablet i pulsanti si prendono il loro spazio ai due lati e
  // il campo si stringe: sono fuori dall'area di gioco, non sopra, così il
  // pollice non copre mai quello che stai guardando.
  const zoneH = Math.max(40, sh - els.topbar.offsetHeight);
  let leftW = 0, rightW = 0;
  if (isTouch) {
    // 84 è già un bersaglio comodo per un pollice: più grandi si mangiavano
    // quasi metà della larghezza, e quella serve al campo
    const btn = Math.round(Math.min(Math.max(zoneH * 0.26, 48), 84));
    els.stage.style.setProperty('--btn', btn + 'px');
    leftW = btn * 2 + 26;    // due frecce affiancate, più spazio fra e ai lati
    rightW = btn + 16;
    els.padLeft.style.width = leftW + 'px';
    els.padRight.style.width = rightW + 'px';
  }
  const zoneW = Math.max(120, sw - leftW - rightW);
  const k = Math.min(zoneW / VW, zoneH / VH);
  const cssW = Math.max(80, Math.floor(VW * k));
  const cssH = Math.max(44, Math.floor(VH * k));
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  [els.canvas, statCanvas].forEach(c => {
    c.width = Math.round(cssW * dpr);
    c.height = Math.round(cssH * dpr);
  });
  els.canvas.style.width = cssW + 'px';
  els.canvas.style.height = cssH + 'px';

  scale = els.canvas.width / VW;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  statCtx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.imageSmoothingEnabled = true;
  state.dirty = true;
}

// ---------- Caricamento di un quadro ----------
function normalizeRows(raw) {
  const grid = [];
  for (let r = 0; r < ROWS; r++) {
    let line = raw[r] || '';
    if (line.length > COLS) {
      console.warn('[Troll] riga ' + r + ' più lunga di ' + COLS + ': tagliata');
      line = line.slice(0, COLS);
    }
    grid.push((line + '.'.repeat(COLS)).slice(0, COLS).split(''));
  }
  return grid;
}

function startLevel(n) {
  const def = LEVELS[n - 1];
  state.level = n;
  state.maxLevel = Math.max(state.maxLevel, n);
  const grid = normalizeRows(def.rows);
  // A e B non sono mattonelle: si leggono, si tolgono dal disegno e diventano
  // punto di partenza e traguardo
  state.spawn = { x: TILE, y: VH - 4 * TILE };
  state.goal = { col: COLS - 2, row: ROWS - 4 };
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r][c] === 'A') {
        state.spawn = { x: c * TILE + (TILE - PSIZE) / 2, y: r * TILE + (TILE - PSIZE) };
        grid[r][c] = '.';
      } else if (grid[r][c] === 'B') {
        state.goal = { col: c, row: r };
        grid[r][c] = '.';
      }
    }
  }
  state.baseGrid = grid;
  state.basePortals = findPortals(grid);
  state.hints = def.hints || null;
  state.titleAt = performance.now();
  resetAttempt(false);
  saveProgress();          // a inizio livello, come in tutti i giochi del sito
  updateHUD();
}

function resetAttempt(counts) {
  if (counts) {
    const key = String(state.level);
    state.attempts[key] = (state.attempts[key] || 0) + 1;
    state.totalAttempts += 1;
  }
  state.grid = state.baseGrid.map(row => row.slice());
  state.inverted = false;
  state.portals = state.basePortals.map(p => ({
    c0: p.c0, c1: p.c1,
    side: (state.spawn.x + PSIZE / 2) < p.c0 * TILE ? -1 : 1,
  }));
  state.crumbling = [];
  state.trail = [];
  state.particles = [];
  state.killer = null;
  state.spin = 0;
  state.player = {
    x: state.spawn.x, y: state.spawn.y,
    vx: 0, vy: 0, onGround: false, coyote: 0, buffer: 0,
  };
  state.phase = 'play';
  state.dirty = true;
}

// Le colonne attaccate che contengono una banda specchio sono un portale solo:
// serve a sapere da che parte del portale ti trovi, non se lo stai toccando.
function findPortals(grid) {
  const cols = [];
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r < ROWS; r++) {
      if (grid[r][c] === 's') { cols.push(c); break; }
    }
  }
  const out = [];
  cols.forEach(c => {
    const last = out[out.length - 1];
    if (last && c === last.c1 + 1) last.c1 = c;
    else out.push({ c0: c, c1: c });
  });
  return out;
}

// ---------- Griglia ----------
function tileAt(c, r) {
  if (c < 0 || c >= COLS) return '#';   // i bordi del campo sono muro
  if (r < 0 || r >= ROWS) return '.';   // sopra è cielo aperto, sotto è il vuoto
  return state.grid[r][c];
}
function isSolid(c, r) { return SOLID.indexOf(tileAt(c, r)) !== -1; }

function overlapsKind(px, py, chars) {
  const c0 = Math.floor(px / TILE), c1 = Math.floor((px + PSIZE - 1) / TILE);
  const r0 = Math.floor(py / TILE), r1 = Math.floor((py + PSIZE - 1) / TILE);
  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (chars.indexOf(tileAt(c, r)) !== -1) return { c, r };
    }
  }
  return null;
}

// ---------- Passo di fisica ----------
function stepPhysics(dt) {
  const p = state.player;
  let dir = 0;
  if (held.left) dir -= 1;
  if (held.right) dir += 1;
  if (state.inverted) dir = -dir;

  p.vx = dir * RUN;
  p.vy = Math.min(p.vy + GRAVITY * dt, MAX_FALL);

  p.buffer = Math.max(0, p.buffer - dt);
  p.coyote = Math.max(0, p.coyote - dt);
  if (p.buffer > 0 && (p.onGround || p.coyote > 0)) {
    p.vy = -JUMP_V;
    p.buffer = 0; p.coyote = 0; p.onGround = false;
  }
  if (!held.jump && p.vy < -JUMP_CUT) p.vy = -JUMP_CUT;

  // un asse per volta, o si resta incastrati negli angoli
  p.x += p.vx * dt;
  resolveAxis('x');
  p.y += p.vy * dt;
  resolveAxis('y');
  if (p.onGround) p.coyote = COYOTE;
}

// Si guardano TUTTE le mattonelle che il quadrato sta toccando e si tiene la
// correzione più forte: fermandosi alla prima si può restare dentro a quella
// accanto, e da lì si passa attraverso il muro.
function resolveAxis(axis) {
  const p = state.player;
  const c0 = Math.floor(p.x / TILE), c1 = Math.floor((p.x + PSIZE - 1) / TILE);
  const r0 = Math.floor(p.y / TILE), r1 = Math.floor((p.y + PSIZE - 1) / TILE);
  let fix = null;
  if (axis === 'y') p.onGround = false;

  for (let r = r0; r <= r1; r++) {
    for (let c = c0; c <= c1; c++) {
      if (!isSolid(c, r)) continue;
      if (axis === 'x') {
        if (p.vx > 0) fix = (fix == null) ? c * TILE - PSIZE : Math.min(fix, c * TILE - PSIZE);
        else if (p.vx < 0) fix = (fix == null) ? (c + 1) * TILE : Math.max(fix, (c + 1) * TILE);
      } else {
        if (p.vy > 0) {
          fix = (fix == null) ? r * TILE - PSIZE : Math.min(fix, r * TILE - PSIZE);
          p.onGround = true;
          touchFloor(c, r);
        } else if (p.vy < 0) {
          fix = (fix == null) ? (r + 1) * TILE : Math.max(fix, (r + 1) * TILE);
        }
      }
    }
  }
  if (fix == null) return;
  if (axis === 'x') { p.x = fix; p.vx = 0; }
  else { p.y = fix; p.vy = 0; }
}

// il pavimento che collassa parte a contare appena ci si appoggia sopra
function touchFloor(c, r) {
  if (tileAt(c, r) !== 'c') return;
  const idx = r * COLS + c;
  if (!state.crumbling.some(k => k.idx === idx)) {
    state.crumbling.push({ idx, at: performance.now() });
  }
}

function updateWorld(now, dt) {
  const p = state.player;

  // pavimenti che collassano
  for (let i = state.crumbling.length - 1; i >= 0; i--) {
    if (now - state.crumbling[i].at < CRUMBLE_MS) continue;
    const idx = state.crumbling[i].idx;
    state.grid[Math.floor(idx / COLS)][idx % COLS] = '.';
    state.crumbling.splice(i, 1);
    state.dirty = true;
  }

  // Il portale gira i comandi quando ne sei USCITO dall'altra parte, non
  // quando lo tocchi: toccandolo si veniva respinti indietro, si usciva dalla
  // parte da cui si era entrati e il giro si annullava — un muro invalicabile.
  const cx = p.x + PSIZE / 2;
  state.portals.forEach(portal => {
    let side = 0;
    if (cx < portal.c0 * TILE) side = -1;
    else if (cx > (portal.c1 + 1) * TILE) side = 1;
    if (side !== 0 && side !== portal.side) {
      portal.side = side;
      state.inverted = !state.inverted;
    }
  });

  // giro del quadrato: solo in aria e solo se si sta spostando
  if (!p.onGround && p.vx !== 0) state.spin += Math.sign(p.vx) * SPIN_RATE * dt;
  else if (p.onGround) state.spin += (0 - state.spin) * Math.min(1, dt * 14);

  // spine e vuoto
  const hit = overlapsKind(p.x, p.y, DEADLY);
  if (hit || p.y > VH + TILE) { die(now, hit); return; }

  // traguardo
  const gx = state.goal.col * TILE, gy = state.goal.row * TILE;
  if (p.x + PSIZE > gx + 2 && p.x < gx + TILE - 2 && p.y + PSIZE > gy + 2 && p.y < gy + TILE - 2) {
    win(now);
  }

  // scia
  state.trail.push({ x: p.x, y: p.y });
  if (state.trail.length > 7) state.trail.shift();
}

function die(now, hit) {
  if (state.phase !== 'play') return;
  state.phase = 'dead';
  state.phaseAt = now;
  // La spina che ti ha ucciso esce dal terreno mentre muori e poi rientra:
  // invisibile sì, ma almeno vedi dov'era. Al tentativo dopo torna nascosta.
  state.killer = (hit && tileAt(hit.c, hit.r) === 'x') ? hit : null;
  const p = state.player;
  state.particles = [];
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16 + Math.random() * 0.4;
    const sp = 60 + Math.random() * 150;
    state.particles.push({
      x: p.x + PSIZE / 2, y: p.y + PSIZE / 2,
      vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
      s: 2 + Math.random() * 3,
    });
  }
  const key = String(state.level);
  state.attempts[key] = (state.attempts[key] || 0) + 1;
  state.totalAttempts += 1;
}

function win(now) {
  if (state.phase !== 'play') return;
  state.phase = 'won';
  state.phaseAt = now;
}

// ---------- Disegno ----------
function buildGlow() {
  const s = 96;
  const cv = document.createElement('canvas');
  cv.width = s; cv.height = s;
  const g = cv.getContext('2d');
  const grad = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grad.addColorStop(0, 'rgba(56,242,230,0.55)');
  grad.addColorStop(0.4, 'rgba(56,242,230,0.18)');
  grad.addColorStop(1, 'rgba(56,242,230,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, s, s);
  glowSprite = cv;
}

// Il fondo (mattonelle, spine visibili, bande, scritte del primo quadro) viene
// disegnato una volta sola su una tela a parte e poi ricopiato: a ogni
// fotogramma restano da disegnare solo il quadrato, la scia e le schegge.
function drawStatic() {
  const g = statCtx;
  g.clearRect(0, 0, VW, VH);

  g.fillStyle = '#080C16';
  g.fillRect(0, 0, VW, VH);
  g.strokeStyle = 'rgba(56,242,230,0.05)';
  g.lineWidth = 1;
  g.beginPath();
  for (let c = 4; c < COLS; c += 4) { g.moveTo(c * TILE, 0); g.lineTo(c * TILE, VH); }
  for (let r = 4; r < ROWS; r += 4) { g.moveTo(0, r * TILE); g.lineTo(VW, r * TILE); }
  g.stroke();

  if (state.hints) drawHints(g);

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ch = state.grid[r][c];
      const x = c * TILE, y = r * TILE;
      if (LOOKS_SOLID.indexOf(ch) !== -1) {
        g.fillStyle = '#2C3A52';
        g.fillRect(x, y, TILE, TILE);
        if (LOOKS_SOLID.indexOf(tileAt(c, r - 1)) === -1) {
          g.fillStyle = '#47597A';
          g.fillRect(x, y, TILE, 2);
        }
      } else if (ch === '^') {
        drawSpike(g, x, y, 1);
      } else if (ch === 's') {
        g.fillStyle = 'rgba(139,92,246,0.22)';
        g.fillRect(x, y, TILE, TILE);
        g.fillStyle = 'rgba(139,92,246,0.55)';
        g.fillRect(x, y, 2, TILE);
        g.fillRect(x + TILE - 2, y, 2, TILE);
      }
    }
  }
  state.dirty = false;
}

// out va da 0 (dentro al terreno, invisibile) a 1 (fuori tutta)
function drawSpike(g, x, y, out) {
  if (out <= 0) return;
  g.save();
  g.beginPath();
  g.rect(x, y, TILE, TILE);
  g.clip();
  const dy = TILE * (1 - out);
  g.fillStyle = '#FF2D78';
  g.beginPath();
  g.moveTo(x + 1, y + TILE + dy);
  g.lineTo(x + TILE / 2, y + 3 + dy);
  g.lineTo(x + TILE - 1, y + TILE + dy);
  g.closePath();
  g.fill();
  g.restore();
}

function drawHints(g) {
  g.save();
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = 'rgba(221,230,242,0.30)';
  g.font = '600 11px "Chakra Petch", system-ui, sans-serif';
  state.hints.forEach(h => {
    const key = (isTouch && t()[h.key + 'Touch']) ? h.key + 'Touch' : h.key;
    const text = t()[key] || '';
    const x = Math.min(Math.max(h.col * TILE, 60), VW - 60);
    g.fillText(text.toUpperCase(), x, h.row * TILE);
  });
  g.restore();
}

function draw(now) {
  if (state.dirty) drawStatic();
  ctx.clearRect(0, 0, VW, VH);
  ctx.drawImage(statCanvas, 0, 0, VW, VH);

  // traguardo: pulsa, così si vede da lontano dove bisogna arrivare
  const pulse = 0.55 + 0.45 * Math.sin(now / 260);
  const gx = state.goal.col * TILE, gy = state.goal.row * TILE;
  ctx.save();
  ctx.globalAlpha = 0.35 + 0.3 * pulse;
  ctx.fillStyle = '#B6FF3D';
  ctx.fillRect(gx + 2, gy + 2, TILE - 4, TILE - 4);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#B6FF3D';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(gx + 1.5, gy + 1.5, TILE - 3, TILE - 3);
  ctx.restore();

  if (state.phase !== 'dead') {
    const p = state.player;
    state.trail.forEach((s, i) => {
      ctx.globalAlpha = 0.06 * i;
      ctx.fillStyle = '#38F2E6';
      ctx.fillRect(s.x, s.y, PSIZE, PSIZE);
    });
    ctx.globalAlpha = 1;
    ctx.drawImage(glowSprite, p.x + PSIZE / 2 - 24, p.y + PSIZE / 2 - 24, 48, 48);
    ctx.save();
    ctx.translate(p.x + PSIZE / 2, p.y + PSIZE / 2);
    ctx.rotate(state.spin);
    ctx.fillStyle = state.inverted ? '#C9A6FF' : '#38F2E6';
    ctx.fillRect(-PSIZE / 2, -PSIZE / 2, PSIZE, PSIZE);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillRect(-PSIZE / 2 + 2, -PSIZE / 2 + 2, PSIZE - 4, 3);
    ctx.restore();
  } else {
    // la spina esce, resta fuori un attimo e rientra: il tempo di vederla
    if (state.killer) {
      const age = now - state.phaseAt;
      const out = age < SPIKE_OUT_MS ? age / SPIKE_OUT_MS
        : (age > DEATH_MS - SPIKE_OUT_MS ? Math.max(0, (DEATH_MS - age) / SPIKE_OUT_MS) : 1);
      drawSpike(ctx, state.killer.c * TILE, state.killer.r * TILE, out);
    }
    ctx.fillStyle = '#38F2E6';
    state.particles.forEach(q => ctx.fillRect(q.x, q.y, q.s, q.s));
  }

  // il numero del quadro, che sfuma dopo un secondo
  const age = now - state.titleAt;
  if (age < 1400) {
    ctx.save();
    ctx.globalAlpha = age < 900 ? 1 : 1 - (age - 900) / 500;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(221,230,242,0.5)';
    ctx.font = '700 22px "Chakra Petch", system-ui, sans-serif';
    ctx.fillText((t().levelWord + ' ' + state.level).toUpperCase(), VW / 2, VH / 2 - 40);
    ctx.restore();
  }

  if (state.phase === 'won') {
    ctx.save();
    ctx.globalAlpha = Math.max(0, 1 - (now - state.phaseAt) / WIN_MS) * 0.5;
    ctx.fillStyle = '#B6FF3D';
    ctx.fillRect(0, 0, VW, VH);
    ctx.restore();
  }
}

// ---------- Giro principale ----------
let lastTime = 0, acc = 0;
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  if (!state.running) return;

  if (state.phase === 'play') {
    acc += dt;
    let guard = 0;
    while (acc >= STEP && guard++ < 60) { stepPhysics(STEP); acc -= STEP; }
    updateWorld(now, dt);
  } else if (state.phase === 'dead') {
    state.particles.forEach(q => {
      q.vy += GRAVITY * dt * 0.6;
      q.x += q.vx * dt; q.y += q.vy * dt;
    });
    if (now - state.phaseAt > DEATH_MS) { resetAttempt(false); acc = 0; }
  } else if (state.phase === 'won') {
    if (now - state.phaseAt > WIN_MS) nextLevel();
  }

  draw(now);
}

function nextLevel() {
  if (state.level >= LEVELS.length) {
    state.maxLevel = Math.max(state.maxLevel, LEVELS.length);
    saveProgress();
    state.running = false;
    els.endOverlay.classList.add('show');
    return;
  }
  startLevel(state.level + 1);
  acc = 0;
}

function updateHUD() {
  els.levelValue.textContent = String(state.level);
}

// ---------- Comandi ----------
function bindInput() {
  window.addEventListener('keydown', e => {
    if (e.repeat) return;
    const k = e.code;
    if (k === 'KeyA' || k === 'ArrowLeft') { held.left = true; e.preventDefault(); }
    else if (k === 'KeyD' || k === 'ArrowRight') { held.right = true; e.preventDefault(); }
    else if (k === 'Space' || k === 'KeyW' || k === 'ArrowUp') {
      held.jump = true; state.player.buffer = BUFFER; e.preventDefault();
    }
  });
  window.addEventListener('keyup', e => {
    const k = e.code;
    if (k === 'KeyA' || k === 'ArrowLeft') held.left = false;
    else if (k === 'KeyD' || k === 'ArrowRight') held.right = false;
    else if (k === 'Space' || k === 'KeyW' || k === 'ArrowUp') held.jump = false;
  });

  // I pulsanti sono elementi veri: il browser sa già dove sono anche quando il
  // palco è girato, quindi qui non si converte nessuna coordinata.
  document.querySelectorAll('.gamepad-btn').forEach(btn => {
    const kind = btn.dataset.pad;
    btn.addEventListener('pointerdown', e => {
      try { btn.setPointerCapture(e.pointerId); } catch (err) { /* ignora */ }
      padPointers.set(e.pointerId, kind);
      held[kind] = true;
      if (kind === 'jump') state.player.buffer = BUFFER;
      e.preventDefault();
    });
    const release = e => {
      const kind2 = padPointers.get(e.pointerId);
      if (!kind2) return;
      padPointers.delete(e.pointerId);
      if (![...padPointers.values()].includes(kind2)) held[kind2] = false;
    };
    btn.addEventListener('pointerup', release);
    btn.addEventListener('pointercancel', release);
    btn.addEventListener('contextmenu', e => e.preventDefault());
  });
  window.addEventListener('blur', () => {
    held.left = held.right = held.jump = false;
    padPointers.clear();
  });
}

// ---------- Pannelli ----------
// Il gioco non ha la pausa (non serve: il progresso è salvato e non c'è tempo),
// ma finché un pannello è aperto il campo deve stare fermo. Chiudendolo il
// tentativo riparte da capo senza essere contato: nessuno perde un quadro
// perché è andato a cambiare lingua.
function openPanel(overlay) {
  state.running = false;
  els.settingsOverlay.classList.remove('show');
  overlay.classList.add('show');
}
function closePanel(overlay, backToSettings) {
  overlay.classList.remove('show');
  if (backToSettings) els.settingsOverlay.classList.add('show');
  else resumePlay();
}
function resumePlay() {
  if (document.querySelector('.overlay.show')) return;
  if (state.level > LEVELS.length) return;
  resetAttempt(false);
  acc = 0;
  state.running = true;
}

function renderLanguageList() {
  els.languageList.innerHTML = Object.entries(LANGUAGES).map(([code, info]) => `
    <button class="language-option${code === language ? ' active' : ''}" data-lang="${code}">
      <span class="ffr-ico language-flag" data-ico="${info.flag}"></span>
      <span class="language-name">${info.label}</span>
    </button>
  `).join('');
  window.FFR.icons(els.languageList);
}
function selectLanguage(code) {
  language = code;
  setSiteLanguage(code);
  applyTranslations();
  state.dirty = true;   // le scritte del primo quadro sono disegnate, non HTML
  closePanel(els.languageOverlay, true);
}

async function openLeaderboard() {
  openPanel(els.leaderboardOverlay);
  els.leaderboardList.innerHTML = '<div class="leaderboard-empty">…</div>';
  const auth = (window.FFR && window.FFR.auth) ? window.FFR.auth : null;
  const [rows, me] = await Promise.all([
    auth ? auth.getLeaderboard('troll', 50) : [],
    auth ? auth.getMyRank('troll') : null,
  ]);
  if (!rows.length) {
    els.leaderboardList.innerHTML = '<div class="leaderboard-empty">' + t().leaderboardEmpty + '</div>';
    return;
  }
  const myNickname = auth ? auth.getNickname() : null;
  const fmt = n => t().levelWord + ' ' + n;
  const row = (pos, nickname, score, isMe) => `
    <div class="leaderboard-row${isMe ? ' is-me' : ''}">
      <span class="leaderboard-rank">N.${pos}</span>
      <span class="leaderboard-name">${escapeHtml(nickname)}</span>
      <span class="leaderboard-score">${fmt(score)}</span>
    </div>`;
  const html = rows.map((r, i) => row(i + 1, r.nickname, r.score, myNickname && r.nickname === myNickname));
  if (me && me.rank > 5 && myNickname) html.splice(5, 0, row(me.rank, myNickname, me.score, true));
  els.leaderboardList.innerHTML = html.join('');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Progresso ----------
// Si salva a inizio quadro e quando la pagina si nasconde: mai durante il
// caricamento, così un'apertura andata storta non cancella niente.
function saveProgress() {
  if (!(window.FFR && window.FFR.auth)) return;
  window.FFR.auth.saveProgress('troll', {
    maxLevel: state.maxLevel,
    attempts: state.attempts,
    totalAttempts: state.totalAttempts,
  }, state.maxLevel);
}
async function loadProgress() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return window.FFR.auth.loadProgress('troll');
}

// ---------- Avvio ----------
async function init() {
  els.stage = document.getElementById('stage');
  els.topbar = document.getElementById('topbar');
  els.canvas = document.getElementById('gameCanvas');
  els.padLeft = document.getElementById('padLeft');
  els.padRight = document.getElementById('padRight');
  els.levelValue = document.getElementById('levelValue');
  els.turnHint = document.getElementById('turnHint');
  els.loading = document.getElementById('loadingScreen');
  els.settingsOverlay = document.getElementById('settingsOverlay');
  els.languageOverlay = document.getElementById('languageOverlay');
  els.howOverlay = document.getElementById('howOverlay');
  els.leaderboardOverlay = document.getElementById('leaderboardOverlay');
  els.endOverlay = document.getElementById('endOverlay');
  els.languageList = document.getElementById('languageList');
  els.leaderboardList = document.getElementById('leaderboardList');

  els.stage.classList.toggle('touch', isTouch);
  ctx = els.canvas.getContext('2d');
  statCanvas = document.createElement('canvas');
  statCtx = statCanvas.getContext('2d');
  buildGlow();

  language = getSiteLanguage() || 'it';
  applyTranslations();

  layout();
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 250));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { state.dirty = true; });
  }

  bindInput();

  document.getElementById('settingsBtn').addEventListener('click', () => {
    state.running = false;
    els.settingsOverlay.classList.add('show');
  });
  document.getElementById('closeSettingsBtn').addEventListener('click', () => closePanel(els.settingsOverlay, false));
  document.getElementById('openLanguageBtn').addEventListener('click', () => { renderLanguageList(); openPanel(els.languageOverlay); });
  document.getElementById('closeLanguageBtn').addEventListener('click', () => closePanel(els.languageOverlay, true));
  document.getElementById('openHowBtn').addEventListener('click', () => openPanel(els.howOverlay));
  document.getElementById('closeHowBtn').addEventListener('click', () => closePanel(els.howOverlay, true));
  document.getElementById('openLeaderboardBtn').addEventListener('click', openLeaderboard);
  document.getElementById('closeLeaderboardBtn').addEventListener('click', () => closePanel(els.leaderboardOverlay, true));
  els.languageList.addEventListener('click', e => {
    const btn = e.target.closest('.language-option');
    if (btn) selectLanguage(btn.dataset.lang);
  });
  // il ↻ non chiede conferma: ricominciare costa dieci secondi e qui si muore
  // in continuazione. Conta come un tentativo, come una morte qualsiasi.
  document.getElementById('restartBtn').addEventListener('click', () => {
    if (!state.running) return;
    resetAttempt(true);
    acc = 0;
  });
  document.getElementById('replayBtn').addEventListener('click', () => {
    els.endOverlay.classList.remove('show');
    startLevel(LEVELS.length);
    acc = 0;
    state.running = true;
  });

  const saved = await loadProgress();
  if (saved) {
    state.maxLevel = Math.max(1, Math.min(saved.maxLevel || 1, LEVELS.length));
    state.attempts = saved.attempts || {};
    state.totalAttempts = saved.totalAttempts || 0;
  }
  startLevel(state.maxLevel);
  state.running = true;
  requestAnimationFrame(loop);

  // primo avvio col telefono in verticale: il gioco è già girato, e questo
  // avviso si legge dritto appena si gira l'apparecchio in mano
  if (isTouch && window.innerHeight > window.innerWidth) {
    els.turnHint.classList.remove('hidden');
    setTimeout(() => els.turnHint.classList.add('hidden'), 3200);
  }

  window.addEventListener('pagehide', saveProgress);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { state.running = false; saveProgress(); }
    else resumePlay();
  });

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 300);
}
init();

// la X dei pannelli (shared/modal-x.js) chiude e basta: qui bisogna anche
// rimettere in moto il campo
window.FFR_ON_MODAL_CLOSE = function () { resumePlay(); };
