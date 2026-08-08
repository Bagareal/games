/* ============ BLOKKY — motore di gioco ============
   Blocchi che scendono, righe piene che spariscono. Tutto (forme, colori,
   misure del campo, punteggio, rotazione) è roba nostra: nessun riferimento,
   nome o aspetto preso da giochi esistenti. */

// ---------- Lingua condivisa con tutto il sito ----------
const LANGUAGES = {
  it: { label: 'Italiano', flag: 'flag-it' },
  en: { label: 'English', flag: 'flag-en' },
  fr: { label: 'Français', flag: 'flag-fr' },
};
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    backToHome: 'Torna in Home',
    scoreLabel: 'PUNTI',
    nextLabel: 'PROSSIMI',
    chooseDifficulty: 'Scegli la difficoltà',
    chooseDifficultySub: 'Puoi cambiarla ogni volta che inizi una partita',
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Difficile',
    gameOver: 'Game Over',
    gameOverSub: (score, lines) => `Punti: ${score} — Righe: ${lines}`,
    gameOverBest: best => `Record: ${best}`,
    playAgain: 'Rigioca',
    paused: 'Pausa',
    resume: 'Riprendi',
    restart: 'Ricomincia',
    restartTitle: 'Ricominciare la partita?',
    restartBody: 'La partita in corso viene persa, il record resta.',
    restartYes: 'Sì, ricomincia',
    restartNo: 'No, continuo',
    difficultyLabel: 'Difficoltà',
    settingsTitle: 'Impostazioni',
    languageMenuLabel: 'Lingua',
    commands: 'Istruzioni',
    leaderboardMenuLabel: 'Classifica',
    leaderboardTitle: 'Classifica',
    leaderboardEmpty: 'Nessun punteggio ancora: gioca da loggato per essere il primo!',
    languageTitle: 'Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    close: 'Chiudi',
    tutorialTitle: 'Come si gioca',
    tutorialTap: 'Tocca lo schermo per ruotare il pezzo',
    tutorialSwipe: 'Trascina il dito a destra o a sinistra per spostarlo',
    tutorialHold: 'Tieni premuto per farlo scendere veloce',
    tutorialDrop: 'Scorri verso il basso per farlo cadere di colpo',
    tutorialLines: 'Riempi una riga intera e sparisce. Quattro righe in un colpo solo = BLOKKY!',
    tapToContinue: 'Tocca per continuare',
    tutorialKeys: 'Da computer, con la tastiera:',
    keyMove: 'per muovere',
    keyRotate: 'per ruotare',
    keyDown: 'per scendere',
    keySpace: 'spazio',
    keySlam: 'per la caduta immediata',
    gotIt: 'Ho capito!',
    levelUp: n => `LIVELLO ${n}`,
    comboToast: n => `COMBO ×${n}`,
  },
  en: {
    backToHome: 'Back to Home',
    scoreLabel: 'SCORE',
    nextLabel: 'NEXT',
    chooseDifficulty: 'Choose difficulty',
    chooseDifficultySub: 'You can change it every time you start a game',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    gameOver: 'Game Over',
    gameOverSub: (score, lines) => `Score: ${score} — Lines: ${lines}`,
    gameOverBest: best => `Best: ${best}`,
    playAgain: 'Play again',
    paused: 'Paused',
    resume: 'Resume',
    restart: 'Restart',
    restartTitle: 'Restart the game?',
    restartBody: 'The game in progress is lost, your best score stays.',
    restartYes: 'Yes, restart',
    restartNo: 'No, keep going',
    difficultyLabel: 'Difficulty',
    settingsTitle: 'Settings',
    languageMenuLabel: 'Language',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Leaderboard',
    leaderboardTitle: 'Leaderboard',
    leaderboardEmpty: 'No scores yet: play while signed in to be the first!',
    languageTitle: 'Language',
    languageSub: 'Choose the interface language',
    close: 'Close',
    tutorialTitle: 'How to play',
    tutorialTap: 'Tap the screen to rotate the piece',
    tutorialSwipe: 'Drag your finger right or left to move it',
    tutorialHold: 'Press and hold to make it drop fast',
    tutorialDrop: 'Swipe down to slam it into place',
    tutorialLines: 'Fill a whole row and it disappears. Four rows at once = BLOKKY!',
    tapToContinue: 'Tap to continue',
    tutorialKeys: 'On a computer, with the keyboard:',
    keyMove: 'to move',
    keyRotate: 'to rotate',
    keyDown: 'to drop faster',
    keySpace: 'space',
    keySlam: 'to slam',
    gotIt: 'Got it!',
    levelUp: n => `LEVEL ${n}`,
    comboToast: n => `COMBO ×${n}`,
  },
  fr: {
    backToHome: "Retour à l'accueil",
    scoreLabel: 'POINTS',
    nextLabel: 'SUIVANTS',
    chooseDifficulty: 'Choisis la difficulté',
    chooseDifficultySub: 'Tu peux la changer à chaque nouvelle partie',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    gameOver: 'Game Over',
    gameOverSub: (score, lines) => `Points : ${score} — Lignes : ${lines}`,
    gameOverBest: best => `Record : ${best}`,
    playAgain: 'Rejouer',
    paused: 'Pause',
    resume: 'Reprendre',
    restart: 'Recommencer',
    restartTitle: 'Recommencer la partie ?',
    restartBody: 'La partie en cours est perdue, ton record reste.',
    restartYes: 'Oui, recommencer',
    restartNo: 'Non, je continue',
    difficultyLabel: 'Difficulté',
    settingsTitle: 'Paramètres',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Classement',
    leaderboardTitle: 'Classement',
    leaderboardEmpty: "Aucun score pour l'instant : joue connecté pour être le premier !",
    languageTitle: 'Langue',
    languageSub: "Choisis la langue de l'interface",
    close: 'Fermer',
    tutorialTitle: 'Comment jouer',
    tutorialTap: 'Touche l\'écran pour faire tourner la pièce',
    tutorialSwipe: 'Glisse ton doigt à droite ou à gauche pour la déplacer',
    tutorialHold: 'Reste appuyé pour la faire descendre vite',
    tutorialDrop: 'Glisse vers le bas pour la faire tomber d\'un coup',
    tutorialLines: 'Remplis une ligne entière et elle disparaît. Quatre lignes d\'un coup = BLOKKY !',
    tapToContinue: 'Touche pour continuer',
    tutorialKeys: 'Sur ordinateur, au clavier :',
    keyMove: 'pour déplacer',
    keyRotate: 'pour tourner',
    keyDown: 'pour descendre',
    keySpace: 'espace',
    keySlam: 'pour la chute immédiate',
    gotIt: "C'est compris !",
    levelUp: n => `NIVEAU ${n}`,
    comboToast: n => `COMBO ×${n}`,
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

// ---------- Campo e pezzi ----------
// Campo 10×18: più corto del formato da sala giochi, sta comodo in verticale
// su un telefono senza rimpicciolire troppo i blocchi.
const COLS = 10, ROWS = 18;

// Ogni pezzo è un elenco di celle dentro una scatola quadrata `size`: ruotare
// vuol dire ruotare la scatola, (x,y) → (size-1-y, x). Le 7 forme da 4 celle
// sono tutte quelle geometricamente possibili, ma i colori sono i nostri (della
// palette neon di Blokko) e l'abbinamento forma→colore è deliberatamente
// diverso da quello usato dai giochi commerciali del genere.
const PIECES = {
  I: { size: 4, color: '#FF2E88', cells: [[0, 1], [1, 1], [2, 1], [3, 1]] },
  O: { size: 2, color: '#00E5FF', cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  T: { size: 3, color: '#FF9F1C', cells: [[1, 0], [0, 1], [1, 1], [2, 1]] },
  S: { size: 3, color: '#B14CFF', cells: [[1, 0], [2, 0], [0, 1], [1, 1]] },
  Z: { size: 3, color: '#00FFA3', cells: [[0, 0], [1, 0], [1, 1], [2, 1]] },
  J: { size: 3, color: '#FFE14D', cells: [[0, 0], [0, 1], [1, 1], [2, 1]] },
  L: { size: 3, color: '#4D6BFF', cells: [[2, 0], [0, 1], [1, 1], [2, 1]] },
  // due pezzi inventati da noi, entrano nel sacchetto dal livello 4: uno
  // piccolo che aiuta a tappare i buchi e una croce che invece complica la vita
  V: { size: 2, color: '#39FF6A', cells: [[0, 0], [0, 1], [1, 1]] },
  X: { size: 3, color: '#DCE3FF', cells: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]] },
};
const BASE_BAG = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const EXTRA_BAG = ['V', 'X'];
const EXTRA_FROM_LEVEL = 4;

// Rotazioni precalcolate, senza doppioni: il quadrato e la croce ne hanno una
// sola, la barra e le due forme a "S" ne hanno due. Il confronto ignora la
// posizione dentro la scatola, altrimenti la barra risulterebbe avere quattro
// rotazioni diverse (le stesse due, ma scivolate di una casella) e ruotandola
// due volte si ritroverebbe spostata di una riga invece che ferma dov'era.
const STATES = {};
(function buildStates() {
  Object.keys(PIECES).forEach(key => {
    const def = PIECES[key];
    const seen = new Set();
    const list = [];
    let cells = def.cells.map(c => c.slice());
    for (let i = 0; i < 4; i++) {
      const minX = Math.min(...cells.map(c => c[0]));
      const minY = Math.min(...cells.map(c => c[1]));
      const id = cells.map(c => (c[0] - minX) + ',' + (c[1] - minY)).sort().join(' ');
      if (!seen.has(id)) { seen.add(id); list.push(cells.map(c => c.slice())); }
      cells = cells.map(([x, y]) => [def.size - 1 - y, x]);
    }
    STATES[key] = list;
  });
})();
function stateCells(type, rot) {
  const list = STATES[type];
  return list[((rot % list.length) + list.length) % list.length];
}
function topOffset(type, rot) {
  return Math.min(...stateCells(type, rot).map(c => c[1]));
}

// spostamenti provati quando una rotazione finirebbe dentro un muro o un altro
// blocco: si tenta di scostare il pezzo di poco invece di annullare la mossa
const KICKS = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [-1, -1], [1, -1]];

const DIFFICULTIES = {
  easy: { baseDrop: 900, ramp: 0.87, linesPerLevel: 12, nextCount: 3, startRows: 0 },
  medium: { baseDrop: 700, ramp: 0.85, linesPerLevel: 10, nextCount: 2, startRows: 0 },
  hard: { baseDrop: 520, ramp: 0.83, linesPerLevel: 8, nextCount: 1, startRows: 3 },
};

// punteggio nostro: una riga vale poco, quattro insieme valgono tantissimo
const LINE_POINTS = [0, 60, 180, 400, 1000];
const SOFT_DROP_MS = 45;
const LOCK_DELAY = 500;   // tempo per aggiustare il pezzo appena tocca terra
const MAX_LOCK_RESETS = 12;
const CLEAR_FLASH_MS = 220;
const MIN_DROP_MS = 90;

// ---------- Stato ----------
const state = {
  difficulty: null,
  grid: emptyGrid(), // il disegno parte subito, prima ancora di scegliere la difficoltà
  piece: null,       // { type, rot, x, y }
  queue: [],         // prossimi pezzi (tipi)
  bag: [],
  score: 0,
  lines: 0,
  level: 1,
  best: 0,
  combo: 0,
  paused: true,
  gameOver: false,
  dropTimer: 0,
  lockTimer: 0,
  lockResets: 0,
  softDropping: false,
  clearing: null,    // { rows: [...], t }
  byDifficulty: {},
};

const els = {
  loading: document.getElementById('loadingScreen'),
  canvas: document.getElementById('gameCanvas'),
  boardFrame: document.getElementById('boardFrame'),
  gameZone: document.getElementById('gameZone'),
  nextSlots: document.getElementById('nextSlots'),
  scoreValue: document.getElementById('scoreValue'),
  levelValue: document.getElementById('levelValue'),
  linesValue: document.getElementById('linesValue'),
  centerToast: document.getElementById('centerToast'),
  resumeHint: document.getElementById('resumeHint'),
  difficultyOverlay: document.getElementById('difficultyOverlay'),
  pauseOverlay: document.getElementById('pauseOverlay'),
  settingsOverlay: document.getElementById('settingsOverlay'),
  tutorialOverlay: document.getElementById('tutorialOverlay'),
  gameOverOverlay: document.getElementById('gameOverOverlay'),
  gameOverSub: document.getElementById('gameOverSub'),
  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  leaderboardOverlay: document.getElementById('leaderboardOverlay'),
  leaderboardTabs: document.getElementById('leaderboardTabs'),
  leaderboardList: document.getElementById('leaderboardList'),
  pauseBtn: document.getElementById('pauseBtn'),
  resumeBtn: document.getElementById('resumeBtn'),
  restartBtn: document.getElementById('restartBtn'),
  topRestartBtn: document.getElementById('topRestartBtn'),
  restartOverlay: document.getElementById('restartOverlay'),
  confirmRestartBtn: document.getElementById('confirmRestartBtn'),
  cancelRestartBtn: document.getElementById('cancelRestartBtn'),
  retryBtn: document.getElementById('retryBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  openLanguageBtn: document.getElementById('openLanguageBtn'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  openTutorialBtn: document.getElementById('openTutorialBtn'),
  closeTutorialBtn: document.getElementById('closeTutorialBtn'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
};
const ctx = els.canvas.getContext('2d');

function preset() { return DIFFICULTIES[state.difficulty] || DIFFICULTIES.medium; }
function isPlaying() { return state.difficulty != null && !state.paused && !state.gameOver; }

// ---------- Griglia ----------
function emptyGrid() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(null));
}
function collides(type, rot, x, y) {
  const cells = stateCells(type, rot);
  for (let i = 0; i < cells.length; i++) {
    const bx = x + cells[i][0];
    const by = y + cells[i][1];
    if (bx < 0 || bx >= COLS || by >= ROWS) return true;
    if (by >= 0 && state.grid[by][bx]) return true;
  }
  return false;
}

// ---------- Sacchetto e comparsa dei pezzi ----------
function refillBag() {
  const types = state.level >= EXTRA_FROM_LEVEL ? BASE_BAG.concat(EXTRA_BAG) : BASE_BAG.slice();
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  state.bag = types;
}
function nextType() {
  if (!state.bag.length) refillBag();
  return state.bag.pop();
}
function fillQueue() {
  while (state.queue.length < preset().nextCount) state.queue.push(nextType());
}
function spawnPiece(type) {
  const def = PIECES[type];
  const rot = 0;
  const x = Math.floor((COLS - def.size) / 2);
  const y = -topOffset(type, rot);
  state.piece = { type, rot, x, y };
  state.dropTimer = 0;
  state.lockTimer = 0;
  state.lockResets = 0;
  if (collides(type, rot, x, y)) endGame();
}
function spawnNext() {
  fillQueue();
  const type = state.queue.shift();
  fillQueue();
  spawnPiece(type);
  renderNext();
}

// ---------- Mosse ----------
function afterSuccessfulMove() {
  // ogni mossa riuscita regala un altro po' di tempo prima che il pezzo si
  // incastri, ma non all'infinito: dopo un tot di aggiustamenti si posa
  if (state.lockResets < MAX_LOCK_RESETS) {
    state.lockTimer = 0;
    state.lockResets++;
  }
}
function tryMove(dx, dy) {
  const p = state.piece;
  if (!p) return false;
  if (collides(p.type, p.rot, p.x + dx, p.y + dy)) return false;
  p.x += dx;
  p.y += dy;
  if (dx !== 0) afterSuccessfulMove();
  return true;
}
function tryRotate() {
  const p = state.piece;
  if (!p) return false;
  const rot = p.rot + 1;
  for (let i = 0; i < KICKS.length; i++) {
    const nx = p.x + KICKS[i][0];
    const ny = p.y + KICKS[i][1];
    if (!collides(p.type, rot, nx, ny)) {
      p.rot = rot; p.x = nx; p.y = ny;
      afterSuccessfulMove();
      return true;
    }
  }
  return false;
}
function landingY() {
  const p = state.piece;
  if (!p) return 0;
  let y = p.y;
  while (!collides(p.type, p.rot, p.x, y + 1)) y++;
  return y;
}
function hardDrop() {
  const p = state.piece;
  if (!p) return;
  const target = landingY();
  state.score += Math.max(0, target - p.y) * 2;
  p.y = target;
  lockPiece();
}

function lockPiece() {
  const p = state.piece;
  if (!p) return;
  const cells = stateCells(p.type, p.rot);
  for (let i = 0; i < cells.length; i++) {
    const bx = p.x + cells[i][0];
    const by = p.y + cells[i][1];
    if (by < 0) { endGame(); return; } // impilati fino a sopra il bordo
    state.grid[by][bx] = p.type;
  }
  markStackDirty();
  state.piece = null;
  state.softDropping = false;

  const full = [];
  for (let y = 0; y < ROWS; y++) {
    if (state.grid[y].every(c => c)) full.push(y);
  }
  if (full.length) {
    state.clearing = { rows: full, t: 0 };
  } else {
    state.combo = 0;
    spawnNext();
    scheduleSave();
  }
}
function finishClear() {
  const rows = state.clearing.rows;
  state.clearing = null;
  const kept = [];
  for (let y = 0; y < ROWS; y++) {
    if (rows.indexOf(y) === -1) kept.push(state.grid[y]);
  }
  while (kept.length < ROWS) kept.unshift(new Array(COLS).fill(null));
  state.grid = kept;
  markStackDirty();

  const n = rows.length;
  const oldLevel = state.level;
  state.score += LINE_POINTS[Math.min(n, 4)] * state.level;
  state.combo++;
  if (state.combo > 1) state.score += 40 * (state.combo - 1) * state.level;
  state.lines += n;
  state.level = 1 + Math.floor(state.lines / preset().linesPerLevel);
  state.best = Math.max(state.best, state.score);

  if (n >= 4) showToast('BLOKKY!', 900);
  else if (state.combo > 2) showToast(t().comboToast(state.combo), 700);
  if (state.level > oldLevel) showToast(t().levelUp(state.level), 900);

  updateHUD();
  spawnNext();
  saveProgress();
}

function endGame() {
  markStackDirty();
  state.gameOver = true;
  state.paused = true;
  state.piece = null;
  state.best = Math.max(state.best, state.score);
  updateHUD();
  els.gameOverSub.textContent =
    t().gameOverSub(state.score, state.lines) + '\n' + t().gameOverBest(state.best);
  els.gameOverOverlay.classList.add('show');
  hideResumeHint();
  saveProgress();
}

// ---------- Partita ----------
function startNewGame(difficultyKey) {
  // la partita in corso sull'altra difficoltà resta salvata: si riprende
  // scegliendo di nuovo quella difficoltà
  if (state.difficulty && !state.gameOver) saveProgress();
  state.difficulty = difficultyKey;
  state.grid = emptyGrid();
  state.score = 0;
  state.lines = 0;
  state.level = 1;
  state.combo = 0;
  state.gameOver = false;
  state.queue = [];
  state.bag = [];
  state.clearing = null;
  state.softDropping = false;
  const saved = state.byDifficulty[difficultyKey];
  state.best = (saved && saved.best) || 0;
  addStartRows(preset().startRows);
  markStackDirty();
  spawnNext();
  resizeCanvas();
  updateHUD();
  hideAllOverlays();
  hideResumeHint();
  state.paused = false;
  saveProgress();
}
// solo in difficile: qualche riga già occupata in partenza, con dei buchi
// sfalsati, così si comincia subito con un po' di disordine da sistemare
function addStartRows(count) {
  for (let i = 0; i < count; i++) {
    const y = ROWS - 1 - i;
    const row = new Array(COLS).fill(null);
    const holes = new Set();
    while (holes.size < 2) holes.add(Math.floor(Math.random() * COLS));
    for (let x = 0; x < COLS; x++) {
      if (!holes.has(x)) row[x] = BASE_BAG[Math.floor(Math.random() * BASE_BAG.length)];
    }
    state.grid[y] = row;
  }
}

function dropInterval() {
  const p = preset();
  return Math.max(MIN_DROP_MS, p.baseDrop * Math.pow(p.ramp, state.level - 1));
}

function update(dt) {
  if (state.clearing) {
    state.clearing.t += dt;
    if (state.clearing.t >= CLEAR_FLASH_MS) finishClear();
    return;
  }
  const p = state.piece;
  if (!p) return;

  const onGround = collides(p.type, p.rot, p.x, p.y + 1);
  if (onGround) {
    state.lockTimer += dt;
    state.dropTimer = 0;
    if (state.lockTimer >= LOCK_DELAY) lockPiece();
    return;
  }
  state.lockTimer = 0;
  const interval = state.softDropping ? SOFT_DROP_MS : dropInterval();
  state.dropTimer += dt;
  while (state.dropTimer >= interval) {
    state.dropTimer -= interval;
    if (collides(p.type, p.rot, p.x, p.y + 1)) break;
    p.y++;
    if (state.softDropping) state.score += 1;
  }
  if (state.softDropping) updateHUD();
}

// ---------- HUD ----------
function updateHUD() {
  els.scoreValue.textContent = state.score;
  els.levelValue.textContent = state.level;
  els.linesValue.textContent = state.lines;
}
let toastTimer = null;
function showToast(msg, ms) {
  els.centerToast.textContent = msg;
  els.centerToast.classList.remove('hidden');
  // riavvia l'animazione anche se il messaggio precedente è ancora a schermo
  els.centerToast.style.animation = 'none';
  void els.centerToast.offsetWidth;
  els.centerToast.style.animation = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.centerToast.classList.add('hidden'), ms || 800);
}

// ---------- Disegno ----------
// Il canvas è ridimensionato alla misura reale sullo schermo (niente pixel art
// sgranata: qui i blocchi sono tubi al neon con il loro alone). Le "sprite" dei
// blocchi sono disegnate una volta sola per colore e poi copiate: con l'alone
// attivo su ogni cella, ridisegnare tutto a ogni fotogramma sarebbe pesante sui
// telefoni meno potenti.
let cell = 16;
let stepPx = 22;      // quanto deve scorrere il dito per spostare di una casella
let renderScale = 1;
const spriteCache = new Map();

function withAlpha(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}
function blockSprite(color, size) {
  const key = color + '|' + size + '|' + renderScale;
  if (spriteCache.has(key)) return spriteCache.get(key);
  const bleed = Math.ceil(size * 0.3); // spazio extra per non tagliare l'alone
  const full = size + bleed * 2;
  const c = document.createElement('canvas');
  c.width = Math.round(full * renderScale);
  c.height = Math.round(full * renderScale);
  const g = c.getContext('2d');
  g.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  const pad = Math.max(1, size * 0.09);
  const x = bleed + pad, y = bleed + pad;
  const w = size - pad * 2, h = size - pad * 2;
  const r = Math.max(2, size * 0.2);

  g.fillStyle = withAlpha(color, 0.18);
  roundRect(g, x, y, w, h, r); g.fill();

  const grad = g.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, withAlpha(color, 0.6));
  grad.addColorStop(1, withAlpha(color, 0.16));
  g.fillStyle = grad;
  const ip = Math.max(1.5, size * 0.2);
  roundRect(g, x + ip, y + ip, w - ip * 2, h - ip * 2, r * 0.6); g.fill();

  g.shadowColor = color;
  g.shadowBlur = Math.max(4, size * 0.45);
  g.strokeStyle = color;
  g.lineWidth = Math.max(1.4, size * 0.1);
  roundRect(g, x, y, w, h, r); g.stroke();

  const sprite = { canvas: c, bleed };
  spriteCache.set(key, sprite);
  return sprite;
}
function drawCell(g, gx, gy, color, alpha) {
  const s = blockSprite(color, cell);
  if (alpha != null) g.globalAlpha = alpha;
  g.drawImage(s.canvas, gx * cell - s.bleed, gy * cell - s.bleed,
    cell + s.bleed * 2, cell + s.bleed * 2);
  if (alpha != null) g.globalAlpha = 1;
}

// La pila di blocchi già posati non si muove: ridisegnarla a ogni fotogramma
// (fino a 180 blocchi con il loro alone) era il 97% del lavoro, buttato. Ora
// vive su una tela nascosta, ridisegnata solo quando cambia davvero; a ogni
// fotogramma si ricopia quella e si disegnano solo i pochi quadretti del pezzo
// che sta cadendo. È questo a togliere sia gli scatti sia il ritardo dei
// comandi: finché un fotogramma costa troppo, il dito risponde in ritardo.
const stackCanvas = document.createElement('canvas');
const stackCtx = stackCanvas.getContext('2d');
let stackDirty = true;
function markStackDirty() { stackDirty = true; needsRedraw = true; }
function redrawStack(w, h) {
  const pxW = Math.round(w * renderScale), pxH = Math.round(h * renderScale);
  if (stackCanvas.width !== pxW || stackCanvas.height !== pxH) {
    stackCanvas.width = pxW; stackCanvas.height = pxH;
  }
  stackCtx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  stackCtx.clearRect(0, 0, w, h);

  // reticolo di sfondo appena accennato, per capire dove cadranno i pezzi
  stackCtx.strokeStyle = 'rgba(177, 76, 255, 0.10)';
  stackCtx.lineWidth = 1;
  stackCtx.beginPath();
  for (let x = 1; x < COLS; x++) { stackCtx.moveTo(x * cell + 0.5, 0); stackCtx.lineTo(x * cell + 0.5, h); }
  for (let y = 1; y < ROWS; y++) { stackCtx.moveTo(0, y * cell + 0.5); stackCtx.lineTo(w, y * cell + 0.5); }
  stackCtx.stroke();

  const flashing = state.clearing ? (Math.floor(state.clearing.t / 55) % 2 === 0) : false;
  for (let y = 0; y < ROWS; y++) {
    const isClearing = state.clearing && state.clearing.rows.indexOf(y) !== -1;
    for (let x = 0; x < COLS; x++) {
      const type = state.grid[y][x];
      if (!type) continue;
      if (isClearing) {
        if (flashing) {
          stackCtx.fillStyle = 'rgba(255,255,255,0.92)';
          roundRect(stackCtx, x * cell + 2, y * cell + 2, cell - 4, cell - 4, Math.max(2, cell * 0.2));
          stackCtx.fill();
        } else {
          drawCell(stackCtx, x, y, PIECES[type].color, 0.45);
        }
      } else {
        drawCell(stackCtx, x, y, PIECES[type].color);
      }
    }
  }
}

function resizeCanvas() {
  const zoneStyle = getComputedStyle(els.gameZone);
  const availW = els.gameZone.clientWidth
    - parseFloat(zoneStyle.paddingLeft) - parseFloat(zoneStyle.paddingRight);
  const availH = els.gameZone.clientHeight
    - parseFloat(zoneStyle.paddingTop) - parseFloat(zoneStyle.paddingBottom);
  if (availW <= 0 || availH <= 0) return;
  const newCell = Math.max(8, Math.floor(Math.min(availW / COLS, availH / ROWS)));
  const newScale = Math.min(window.devicePixelRatio || 1, 3);
  if (newCell === cell && newScale === renderScale && els.canvas.width) return;
  cell = newCell;
  renderScale = newScale;
  spriteCache.clear();
  stepPx = Math.max(18, Math.round(cell * 0.55));
  const w = cell * COLS, h = cell * ROWS;
  els.canvas.style.width = w + 'px';
  els.canvas.style.height = h + 'px';
  els.canvas.width = Math.round(w * renderScale);
  els.canvas.height = Math.round(h * renderScale);
  ctx.setTransform(renderScale, 0, 0, renderScale, 0, 0);
  markStackDirty();
  renderNext();
}

function render() {
  const w = cell * COLS, h = cell * ROWS;
  // durante il lampeggio delle righe piene anche i blocchi fermi cambiano
  if (state.clearing) stackDirty = true;
  if (stackDirty) { redrawStack(w, h); stackDirty = false; }

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(stackCanvas, 0, 0, w, h);

  const p = state.piece;
  if (p) {
    const color = PIECES[p.type].color;
    const gy = landingY();
    // Segnale di atterraggio: non una copia sbiadita del pezzo, ma una barra
    // luminosa sotto ogni sua colonna, dove andrà a posarsi. L'alone è fatto
    // con tre rettangoli sovrapposti invece che con shadowBlur: calcolare una
    // sfocatura vera a ogni fotogramma costa molto più di quanto renda.
    if (gy > p.y) {
      const cells = stateCells(p.type, p.rot);
      const bottomByCol = new Map();
      cells.forEach(([cx, cy]) => {
        const col = p.x + cx;
        bottomByCol.set(col, Math.max(bottomByCol.has(col) ? bottomByCol.get(col) : -99, cy));
      });
      const barH = Math.max(3, Math.round(cell * 0.13));
      bottomByCol.forEach((cy, col) => {
        const by = gy + cy;
        // corridoio appena colorato: fa capire in quale colonna sta scendendo
        ctx.fillStyle = withAlpha(color, 0.12);
        ctx.fillRect(col * cell + 2, (p.y + cy + 1) * cell, cell - 4, (by - p.y - cy) * cell);
        const baseY = (by + 1) * cell - barH - 2;
        ctx.fillStyle = withAlpha(color, 0.22);
        ctx.fillRect(col * cell, baseY - barH, cell, barH * 3);
        ctx.fillStyle = withAlpha(color, 0.45);
        ctx.fillRect(col * cell + 1, baseY - barH / 2, cell - 2, barH * 2);
        ctx.fillStyle = color;
        roundRect(ctx, col * cell + 3, baseY, cell - 6, barH, barH / 2);
        ctx.fill();
      });
    }
    stateCells(p.type, p.rot).forEach(([cx, cy]) => {
      const by = p.y + cy;
      if (by >= 0) drawCell(ctx, p.x + cx, by, color);
    });
  }
}

// anteprima dei prossimi pezzi: un mini canvas per posto, ridisegnato solo
// quando la coda cambia
function renderNext() {
  const count = preset().nextCount;
  if (els.nextSlots.children.length !== count) {
    els.nextSlots.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const c = document.createElement('canvas');
      c.className = 'next-slot';
      els.nextSlots.appendChild(c);
    }
  }
  for (let i = 0; i < count; i++) {
    const c = els.nextSlots.children[i];
    const rect = c.getBoundingClientRect();
    const w = rect.width || 38, h = rect.height || 26;
    const scale = Math.min(window.devicePixelRatio || 1, 3);
    c.width = Math.round(w * scale);
    c.height = Math.round(h * scale);
    const g = c.getContext('2d');
    g.setTransform(scale, 0, 0, scale, 0, 0);
    g.clearRect(0, 0, w, h);
    const type = state.queue[i];
    if (!type) continue;
    const cells = stateCells(type, 0);
    const xs = cells.map(c2 => c2[0]), ys = cells.map(c2 => c2[1]);
    const bw = Math.max(...xs) - Math.min(...xs) + 1;
    const bh = Math.max(...ys) - Math.min(...ys) + 1;
    const mini = Math.max(4, Math.floor(Math.min((w - 6) / bw, (h - 6) / bh)));
    const ox = (w - bw * mini) / 2 - Math.min(...xs) * mini;
    const oy = (h - bh * mini) / 2 - Math.min(...ys) * mini;
    const color = PIECES[type].color;
    g.fillStyle = withAlpha(color, 0.28);
    g.strokeStyle = color;
    g.lineWidth = 1.4;
    g.shadowColor = color;
    g.shadowBlur = 6;
    cells.forEach(([cx, cy]) => {
      roundRect(g, ox + cx * mini + 1, oy + cy * mini + 1, mini - 2, mini - 2, 2);
      g.fill();
      g.stroke();
    });
  }
}

let lastTime = null;
// In pausa (o con un menu aperto) non cambia niente da un fotogramma all'altro:
// si disegna una volta e poi si sta fermi, invece di ridipingere lo stesso
// quadro sessanta volte al secondo con il telefono in mano.
let needsRedraw = true;
function loop(timestamp) {
  if (lastTime == null) lastTime = timestamp;
  const dt = Math.min(80, timestamp - lastTime);
  lastTime = timestamp;
  if (isPlaying()) {
    checkHoldToSoftDrop();
    update(dt);
    render();
    needsRedraw = true;
  } else if (needsRedraw) {
    render();
    needsRedraw = false;
  }
  countFrame(timestamp);
  requestAnimationFrame(loop);
}

// Contatore di fotogrammi, spento salvo che l'indirizzo finisca con ?fps=1:
// serve a misurare la fluidità sul dispositivo vero, non a occhio.
const FPS_ON = /[?&]fps=1/.test(location.search);
let fpsBox = null, fpsFrames = 0, fpsSince = 0;
function countFrame(timestamp) {
  if (!FPS_ON) return;
  if (!fpsBox) {
    fpsBox = document.createElement('div');
    fpsBox.style.cssText = 'position:fixed;top:4px;right:4px;z-index:9999;background:rgba(0,0,0,0.7);' +
      'color:#39FF6A;font:12px monospace;padding:3px 7px;border-radius:6px;pointer-events:none;';
    document.body.appendChild(fpsBox);
    fpsSince = timestamp;
  }
  fpsFrames++;
  if (timestamp - fpsSince >= 1000) {
    fpsBox.textContent = Math.round((fpsFrames * 1000) / (timestamp - fpsSince)) + ' fps';
    fpsFrames = 0; fpsSince = timestamp;
  }
}

// ---------- Comandi touch ----------
// Tap = ruota · dito fermo premuto = discesa veloce · trascinamento
// orizzontale = spostamento (continuo: più trascini, più caselle) · scorrimento
// verso il basso = caduta immediata.
const TAP_MAX_MS = 210;   // oltre questo tempo non è più un tocco ma una pressione
const HOLD_MS = 210;      // dito fermo premuto per tanto: parte la discesa veloce
const HOLD_STILL_MS = 120;
const TAP_SLOP = 12;      // px di tolleranza: un dito non sta mai fermissimo
const SWIPE_DOWN_PX = 44;
let touch = null;

function onPointerDown(e) {
  if (e.pointerType === 'mouse') return; // col mouse si gioca da tastiera
  if (!isPlaying()) return;
  e.preventDefault();
  if (touch) return; // un dito alla volta
  touch = {
    id: e.pointerId,
    x0: e.clientX, y0: e.clientY,
    stepAnchor: e.clientX,
    t0: performance.now(),
    lastMoveT: performance.now(),
    moved: false, softDrop: false, done: false,
  };
  if (els.gameZone.setPointerCapture) {
    try { els.gameZone.setPointerCapture(e.pointerId); } catch (err) { /* ignora */ }
  }
}
function onPointerMove(e) {
  if (!touch || e.pointerId !== touch.id || touch.done) return;
  if (!isPlaying()) return;
  e.preventDefault();
  const dx = e.clientX - touch.x0;
  const dy = e.clientY - touch.y0;
  if (!touch.moved && Math.abs(dx) + Math.abs(dy) > TAP_SLOP) touch.moved = true;

  // scorrimento netto verso il basso = caduta immediata (solo se non si sta
  // già tenendo premuto per la discesa veloce, altrimenti si sovrappongono)
  if (!touch.softDrop && dy > SWIPE_DOWN_PX && Math.abs(dy) > Math.abs(dx) * 1.4) {
    hardDrop();
    touch.done = true;
    return;
  }

  let stepped = false;
  while (e.clientX - touch.stepAnchor >= stepPx) {
    if (!tryMove(1, 0)) { touch.stepAnchor = e.clientX; break; }
    touch.stepAnchor += stepPx;
    stepped = true;
  }
  while (touch.stepAnchor - e.clientX >= stepPx) {
    if (!tryMove(-1, 0)) { touch.stepAnchor = e.clientX; break; }
    touch.stepAnchor -= stepPx;
    stepped = true;
  }
  if (stepped || Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP) {
    touch.lastMoveT = performance.now();
  }
}
function onPointerUp(e) {
  if (!touch || (e && e.pointerId !== touch.id)) return;
  const wasTap = !touch.moved && !touch.softDrop && !touch.done
    && performance.now() - touch.t0 < TAP_MAX_MS;
  state.softDropping = false;
  touch = null;
  if (wasTap && isPlaying()) tryRotate();
}
// il dito fermo premuto fa scendere veloce: si controlla nel ciclo di gioco
// invece che con un timer, così basta rilasciare o muoversi per aggiornarlo
function checkHoldToSoftDrop() {
  if (!touch || touch.done || touch.softDrop) return;
  const t = performance.now();
  if (t - touch.t0 >= HOLD_MS && t - touch.lastMoveT >= HOLD_STILL_MS) {
    touch.softDrop = true;
    state.softDropping = true;
  }
}

// ---------- Comandi da tastiera ----------
const repeat = { dir: 0, delay: null, timer: null };
function startRepeat(dir) {
  if (repeat.dir === dir) return;
  stopRepeat();
  repeat.dir = dir;
  tryMove(dir, 0);
  repeat.delay = setTimeout(() => {
    repeat.timer = setInterval(() => { if (isPlaying()) tryMove(dir, 0); }, 55);
  }, 170);
}
function stopRepeat() {
  clearTimeout(repeat.delay);
  clearInterval(repeat.timer);
  repeat.dir = 0; repeat.delay = null; repeat.timer = null;
}
const IGNORED_KEYS = ['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'];
function onKeyDown(e) {
  // partita ripresa e ancora ferma: il primo tasto serve solo a farla ripartire,
  // non deve già muovere o far cadere il pezzo
  if (resumeHintVisible() && !anyOverlayOpen()) {
    if (IGNORED_KEYS.indexOf(e.key) !== -1) return;
    if (e.key === ' ') e.preventDefault();
    resumePlay();
    return;
  }
  if (e.key === 'p' || e.key === 'P') {
    if (state.difficulty && !state.gameOver) {
      if (els.pauseOverlay.classList.contains('show')) closePause(); else openPause();
    }
    return;
  }
  if (!isPlaying()) return;
  switch (e.key) {
    case 'ArrowLeft': startRepeat(-1); break;
    case 'ArrowRight': startRepeat(1); break;
    case 'ArrowDown': state.softDropping = true; break;
    case 'ArrowUp': case 'x': case 'X': tryRotate(); break;
    case ' ': e.preventDefault(); hardDrop(); break;
    default: return;
  }
  if (e.key.indexOf('Arrow') === 0) e.preventDefault();
}
function onKeyUp(e) {
  if (e.key === 'ArrowLeft' && repeat.dir === -1) stopRepeat();
  else if (e.key === 'ArrowRight' && repeat.dir === 1) stopRepeat();
  else if (e.key === 'ArrowDown') state.softDropping = false;
}

// ---------- Overlay ----------
function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('show'));
}
// ↻ in barra: ricomincia la partita sulla stessa difficoltà, chiedendo conferma.
// Fuori da una partita porta alla scelta della difficoltà, come il ⏸.
// Scegliere una difficoltà qui vuol dire cominciare una partita nuova, quindi
// perdere quella in corso: si chiede conferma, come per il ↻ in barra. Vale sia
// dal pannello di pausa sia dalle impostazioni — due pulsanti identici non
// possono comportarsi in due modi diversi. Scegliere la difficoltà su cui si sta
// già giocando non perde niente: chiude il pannello e basta.
let pendingDifficulty = null;   // scelta in attesa di conferma
let confirmReturnTo = null;     // dove tornare se si risponde "no": 'pause' | 'settings' | null
function chooseDifficulty(difficultyKey, from) {
  if (state.difficulty && !state.gameOver) {
    if (difficultyKey === state.difficulty) {
      if (from === 'settings') closeSettingsMenu();
      else if (from === 'pause') closePause();
      return;
    }
    pendingDifficulty = difficultyKey;
    confirmReturnTo = from;
    hideAllOverlays();
    state.paused = true;
    releaseTouch();
    els.restartOverlay.classList.add('show');
    return;
  }
  pendingDifficulty = null;
  confirmReturnTo = null;
  startNewGame(difficultyKey);
}
function openRestartConfirm() {
  pendingDifficulty = null;      // stessa difficoltà, solo una partita nuova
  confirmReturnTo = null;
  if (!state.difficulty || state.gameOver) { els.difficultyOverlay.classList.add('show'); return; }
  state.paused = true;
  releaseTouch();
  els.restartOverlay.classList.add('show');
}
function openPause() {
  // Senza difficoltà scelta (o a partita finita) non c'è niente da mettere in
  // pausa, ma il pulsante deve comunque servire a qualcosa: da quando i pannelli
  // si possono chiudere con la X, è lui a riportare alla scelta della difficoltà,
  // che qui vuol dire anche "inizia una partita nuova".
  if (!state.difficulty || state.gameOver) { els.difficultyOverlay.classList.add('show'); return; }
  state.paused = true;
  releaseTouch();
  saveProgress();
  markCurrentDifficulty();
  els.pauseOverlay.classList.add('show');
}
// la difficoltà in corso si vede: aprendo il pannello si capisce subito su quale
// si sta giocando, invece di trovare tre pulsanti tutti uguali
function markCurrentDifficulty() {
  document.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === state.difficulty);
  });
}
function closePause() {
  els.pauseOverlay.classList.remove('show');
  resumePlay();
}
function openSettingsMenu() {
  if (state.difficulty && !state.gameOver) { state.paused = true; releaseTouch(); }
  markCurrentDifficulty();
  els.settingsOverlay.classList.add('show');
}
function closeSettingsMenu() {
  els.settingsOverlay.classList.remove('show');
  resumePlay();
}

// ---------- "Tocca per continuare" ----------
// Rientrando su una partita lasciata a metà, il pezzo non riparte da solo:
// resterebbe fermo il giocatore e non il gioco. Si mostra la scritta sopra al
// campo, che si prende il primo tocco (così non ruota anche il pezzo), e si
// riparte da lì. Vale anche per il primo tasto premuto, da computer.
function showResumeHint() {
  state.paused = true;
  els.resumeHint.classList.remove('hidden');
}
function hideResumeHint() {
  els.resumeHint.classList.add('hidden');
}
function resumeHintVisible() {
  return !els.resumeHint.classList.contains('hidden');
}
function anyOverlayOpen() {
  return !!document.querySelector('.overlay.show');
}
// unico punto da cui la partita riparte: toglie la scritta e leva la pausa
function resumePlay() {
  hideResumeHint();
  if (state.difficulty && !state.gameOver) state.paused = false;
}
// se si apre un menu mentre il dito è sullo schermo, il gesto va annullato:
// altrimenti al ritorno il pezzo continua a scendere veloce da solo
function releaseTouch() {
  touch = null;
  state.softDropping = false;
  stopRepeat();
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
function openLanguageModal() {
  els.settingsOverlay.classList.remove('show');
  renderLanguageList();
  els.languageOverlay.classList.add('show');
}
function closeLanguageModal() {
  els.languageOverlay.classList.remove('show');
  els.settingsOverlay.classList.add('show');
}
function selectLanguage(code) {
  language = code;
  setSiteLanguage(code);
  applyTranslations();
  closeLanguageModal();
}

function openTutorial() {
  els.settingsOverlay.classList.remove('show');
  els.tutorialOverlay.classList.add('show');
}
// partita salvata trovata all'avvio mentre era in corso il tutorial: si
// riprende alla sua chiusura, invece di mandare alla scelta della difficoltà
let pendingResume = null;
// Tutorial del primo avvio: si chiude solo con "Ho capito!". Prima bastava un
// dito appoggiato sullo sfondo per farlo sparire, e siccome quel tocco lo
// segnava anche come "gia' visto", non tornava mai piu': chi apriva il gioco
// per la prima volta poteva restare senza istruzioni senza nemmeno accorgersene.
// Finche' e' quello del primo avvio non ha nemmeno la X (classe x-off, la stessa
// che usa la Dama). Riaperto dal menu si chiude come tutti gli altri pannelli.
let tutorialPrimoAvvio = false;
function closeTutorial() {
  tutorialPrimoAvvio = false;
  els.tutorialOverlay.classList.remove('x-off');
  els.tutorialOverlay.classList.remove('show');
  try { localStorage.setItem('blokko-tutorial-seen', '1'); } catch (e) { /* ignora */ }
  if (state.difficulty == null) {
    if (pendingResume) {
      const saved = pendingResume;
      pendingResume = null;
      resumeFromSaved(saved);
    } else {
      els.difficultyOverlay.classList.add('show');
    }
  } else {
    els.settingsOverlay.classList.add('show');
  }
}

// ---------- Classifica ----------
// Una classifica per difficoltà: a parità di bravura in facile si fanno più
// punti, quindi i punteggi delle tre difficoltà non sono confrontabili fra loro.
let leaderboardDifficulty = 'medium';
function openLeaderboard() {
  els.settingsOverlay.classList.remove('show');
  els.leaderboardOverlay.classList.add('show');
  leaderboardDifficulty = state.difficulty || 'medium';
  renderLeaderboardTabs();
  loadLeaderboardFor(leaderboardDifficulty);
}
function renderLeaderboardTabs() {
  els.leaderboardTabs.querySelectorAll('.lb-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === leaderboardDifficulty);
  });
}
async function loadLeaderboardFor(difficultyKey) {
  els.leaderboardList.innerHTML = `<div class="leaderboard-empty">…</div>`;
  const auth = (window.FFR && window.FFR.auth) ? window.FFR.auth : null;
  const gameKey = 'blokko:' + difficultyKey;
  const [rows, me] = await Promise.all([
    auth ? auth.getLeaderboard(gameKey, 50) : [],
    auth ? auth.getMyRank(gameKey) : null,
  ]);
  if (difficultyKey !== leaderboardDifficulty) return; // scheda già cambiata
  if (!rows.length) {
    els.leaderboardList.innerHTML = `<div class="leaderboard-empty">${t().leaderboardEmpty}</div>`;
    return;
  }
  const myNickname = auth ? auth.getNickname() : null;
  els.leaderboardList.innerHTML = buildLeaderboardRows(rows, me, myNickname, n => String(n));
}
// Righe con la regola condivisa del sito: se ne vedono 6 per volta e, quando chi
// guarda è fuori dalle prime 5, la sua riga viene infilata come 6ª (evidenziata)
// così si vede subito senza scorrere.
function buildLeaderboardRows(rows, me, myNickname, formatScore) {
  const row = (pos, nickname, score, isMe) => `
    <div class="leaderboard-row${isMe ? ' is-me' : ''}">
      <span class="leaderboard-rank">N.${pos}</span>
      <span class="leaderboard-name">${escapeHtml(nickname)}</span>
      <span class="leaderboard-score">${formatScore(score)}</span>
    </div>`;
  const html = rows.map((r, i) => row(i + 1, r.nickname, r.score, myNickname && r.nickname === myNickname));
  if (me && me.rank > 5 && myNickname) {
    html.splice(5, 0, row(me.rank, myNickname, me.score, true));
  }
  return html.join('');
}
function closeLeaderboard() {
  els.leaderboardOverlay.classList.remove('show');
  els.settingsOverlay.classList.add('show');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Progresso (localStorage + cloud se loggato) ----------
// Una partita per difficoltà, tutte dentro la stessa riga 'blokko'. La
// classifica invece vuole un punteggio separato per difficoltà, quindi ognuna
// ha anche la sua voce 'blokko:<difficoltà>' (vedi saveScore in shared/auth.js).
// Il campo di gioco viene salvato per intero: chiudendo la pagina a metà
// partita si ritrova tutto com'era, pezzo in caduta compreso.
function encodeGrid(grid) {
  return grid.map(row => row.map(c => c || '.').join('')).join('|');
}
function decodeGrid(str) {
  if (typeof str !== 'string') return null;
  const rows = str.split('|');
  if (rows.length !== ROWS) return null;
  const grid = [];
  for (let y = 0; y < ROWS; y++) {
    if (rows[y].length !== COLS) return null;
    const row = [];
    for (let x = 0; x < COLS; x++) {
      const ch = rows[y][x];
      if (ch === '.') row.push(null);
      else if (PIECES[ch]) row.push(ch);
      else return null; // pezzo non più esistente: meglio scartare la partita
    }
    grid.push(row);
  }
  return grid;
}
function snapshotCurrentRun() {
  return {
    score: state.score,
    lines: state.lines,
    level: state.level,
    best: state.best,
    combo: state.combo,
    grid: encodeGrid(state.grid),
    piece: state.piece ? { type: state.piece.type, rot: state.piece.rot, x: state.piece.x, y: state.piece.y } : null,
    queue: state.queue.slice(),
    bag: state.bag.slice(),
    over: state.gameOver,
  };
}
function saveProgress() {
  if (!(window.FFR && window.FFR.auth)) return;
  if (state.difficulty == null) return;
  state.best = Math.max(state.best, state.score);
  state.byDifficulty[state.difficulty] = snapshotCurrentRun();
  const bestOverall = Object.keys(state.byDifficulty)
    .reduce((m, k) => Math.max(m, state.byDifficulty[k].best || 0), 0);
  window.FFR.auth.saveProgress('blokko', {
    v: 1,
    current: state.difficulty,
    byDifficulty: state.byDifficulty,
  }, bestOverall);
  window.FFR.auth.saveScore('blokko:' + state.difficulty, state.best);
  pendingSave = false;
}
// Durante la partita un salvataggio a ogni pezzo posato sarebbe una richiesta di
// rete ogni pochi secondi: si accumulano e si scrive al massimo ogni 8 secondi.
// I momenti importanti (riga fatta, pausa, game over, uscita dalla pagina)
// salvano invece subito.
let pendingSave = false;
let lastSaveAt = 0;
function scheduleSave() {
  pendingSave = true;
  const now = Date.now();
  if (now - lastSaveAt >= 8000) {
    lastSaveAt = now;
    saveProgress();
  }
}
function flushSave() {
  if (!pendingSave) return;
  lastSaveAt = Date.now();
  saveProgress();
}

async function loadBlokkoProgress() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return normalizeSaved(await window.FFR.auth.loadProgress('blokko'));
}
// Tiene aperta la porta ai formati futuri: se un salvataggio ha una forma che
// non riconosciamo si tengono almeno i record, senza buttare via tutto.
function normalizeSaved(saved) {
  if (!saved || typeof saved !== 'object') return null;
  if (!saved.byDifficulty || typeof saved.byDifficulty !== 'object') return null;
  const out = { current: saved.current, byDifficulty: {} };
  Object.keys(DIFFICULTIES).forEach(key => {
    const run = saved.byDifficulty[key];
    if (!run) return;
    out.byDifficulty[key] = {
      score: run.score || 0,
      lines: run.lines || 0,
      level: run.level || 1,
      best: run.best || run.score || 0,
      combo: run.combo || 0,
      grid: typeof run.grid === 'string' ? run.grid : null,
      piece: run.piece || null,
      queue: Array.isArray(run.queue) ? run.queue.filter(x => PIECES[x]) : [],
      bag: Array.isArray(run.bag) ? run.bag.filter(x => PIECES[x]) : [],
      over: !!run.over,
    };
  });
  if (!DIFFICULTIES[out.current]) out.current = null;
  return out;
}
function resumeFromSaved(saved) {
  state.byDifficulty = saved.byDifficulty || {};
  const key = saved.current;
  const run = state.byDifficulty[key];
  const grid = run ? decodeGrid(run.grid) : null;
  if (!run || !grid || run.over) {
    // niente partita da riprendere (o era finita): si riparte da zero su questa
    // difficoltà, ma il record resta (startNewGame lo rilegge da byDifficulty)
    startNewGame(key);
    return;
  }
  state.difficulty = key;
  state.best = run.best || 0;
  state.grid = grid;
  markStackDirty();
  state.score = run.score;
  state.lines = run.lines;
  state.level = run.level;
  state.combo = run.combo;
  state.queue = run.queue.slice();
  state.bag = run.bag.slice();
  state.gameOver = false;
  state.clearing = null;
  state.softDropping = false;
  if (run.piece && PIECES[run.piece.type] && !collides(run.piece.type, run.piece.rot, run.piece.x, run.piece.y)) {
    state.piece = { type: run.piece.type, rot: run.piece.rot, x: run.piece.x, y: run.piece.y };
    state.dropTimer = 0; state.lockTimer = 0; state.lockResets = 0;
    fillQueue();
    renderNext();
  } else {
    spawnNext();
  }
  resizeCanvas();
  updateHUD();
  hideAllOverlays();
  showResumeHint();
}

// ---------- Avvio ----------
async function init() {
  language = getSiteLanguage() || 'it';
  applyTranslations();
  updateHUD();
  resizeCanvas();
  renderNext();

  els.gameZone.addEventListener('pointerdown', onPointerDown);
  els.gameZone.addEventListener('pointermove', onPointerMove);
  els.gameZone.addEventListener('pointerup', onPointerUp);
  els.gameZone.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 250));

  document.querySelectorAll('#difficultyOverlay .difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => startNewGame(btn.dataset.difficulty));
  });
  document.querySelectorAll('#pauseOverlay .difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => chooseDifficulty(btn.dataset.difficulty, 'pause'));
  });
  document.querySelectorAll('#settingsOverlay .difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => chooseDifficulty(btn.dataset.difficulty, 'settings'));
  });
  els.retryBtn.addEventListener('click', () => {
    els.gameOverOverlay.classList.remove('show');
    els.difficultyOverlay.classList.add('show');
  });
  els.restartBtn.addEventListener('click', () => {
    if (state.difficulty) startNewGame(state.difficulty);
  });

  // il tocco sulla scritta si ferma qui: se lo lasciassi salire fino alla zona di
  // gioco, lo stesso dito farebbe ripartire la partita E ruotare il pezzo
  els.resumeHint.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    resumePlay();
  });

  els.pauseBtn.addEventListener('click', openPause);
  els.topRestartBtn.addEventListener('click', openRestartConfirm);
  els.confirmRestartBtn.addEventListener('click', () => {
    els.restartOverlay.classList.remove('show');
    const key = pendingDifficulty || state.difficulty;
    pendingDifficulty = null;
    confirmReturnTo = null;
    if (key) startNewGame(key);
  });
  els.cancelRestartBtn.addEventListener('click', () => {
    els.restartOverlay.classList.remove('show');
    pendingDifficulty = null;
    if (confirmReturnTo === 'pause') els.pauseOverlay.classList.add('show');
    else if (confirmReturnTo === 'settings') els.settingsOverlay.classList.add('show');
    else resumePlay();
    confirmReturnTo = null;
  });
  els.restartOverlay.addEventListener('click', (e) => {
    if (e.target !== els.restartOverlay) return;
    els.restartOverlay.classList.remove('show');
    pendingDifficulty = null;
    confirmReturnTo = null;
    resumePlay();
  });
  els.resumeBtn.addEventListener('click', closePause);
  els.pauseOverlay.addEventListener('click', (e) => {
    if (e.target === els.pauseOverlay) closePause();
  });

  els.settingsBtn.addEventListener('click', openSettingsMenu);
  els.closeSettingsBtn.addEventListener('click', closeSettingsMenu);
  els.settingsOverlay.addEventListener('click', (e) => {
    if (e.target === els.settingsOverlay) closeSettingsMenu();
  });

  els.openLanguageBtn.addEventListener('click', openLanguageModal);
  els.closeLanguageBtn.addEventListener('click', closeLanguageModal);
  els.languageOverlay.addEventListener('click', (e) => {
    if (e.target === els.languageOverlay) closeLanguageModal();
  });
  els.languageList.addEventListener('click', (e) => {
    const btn = e.target.closest('.language-option');
    if (btn) selectLanguage(btn.dataset.lang);
  });

  els.openTutorialBtn.addEventListener('click', openTutorial);
  els.closeTutorialBtn.addEventListener('click', closeTutorial);
  els.tutorialOverlay.addEventListener('click', (e) => {
    if (e.target === els.tutorialOverlay && !tutorialPrimoAvvio) closeTutorial();
  });

  els.openLeaderboardBtn.addEventListener('click', openLeaderboard);
  els.closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
  els.leaderboardTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.lb-tab');
    if (!btn) return;
    leaderboardDifficulty = btn.dataset.difficulty;
    renderLeaderboardTabs();
    loadLeaderboardFor(leaderboardDifficulty);
  });
  els.leaderboardOverlay.addEventListener('click', (e) => {
    if (e.target === els.leaderboardOverlay) closeLeaderboard();
  });

  // uscendo dalla pagina (o cambiando scheda) si mette in pausa e si salva:
  // sul telefono è il caso più comune di "chiudo e riapro dopo"
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isPlaying()) { state.paused = true; releaseTouch(); els.pauseOverlay.classList.add('show'); }
      flushSave();
    }
  });
  window.addEventListener('pagehide', flushSave);

  requestAnimationFrame(loop);

  // primo avvio: tutorial, poi scelta della difficoltà. Altrimenti si riprende
  // la partita salvata. Il progresso va caricato SEMPRE, anche mostrando il
  // tutorial: 'blokko-tutorial-seen' è una chiave locale del dispositivo, e su
  // un secondo dispositivo il tutorial ricompare anche a chi ha già un account
  // con dei progressi nel cloud.
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('blokko-tutorial-seen'); } catch (e) { /* ignora */ }
  const saved = await loadBlokkoProgress();
  if (saved) state.byDifficulty = saved.byDifficulty;
  if (!tutorialSeen) {
    pendingResume = (saved && saved.current) ? saved : null;
    // primo avvio: si esce solo da "Ho capito!" — niente X e niente chiusura
    // toccando lo sfondo, o basta un dito per sbaglio per non vederlo mai piu'
    tutorialPrimoAvvio = true;
    els.tutorialOverlay.classList.add('x-off');
    els.tutorialOverlay.classList.add('show');
  } else if (saved && saved.current) {
    resumeFromSaved(saved);
  } else {
    els.difficultyOverlay.classList.add('show');
  }

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 350);
}
init();

// La X dei pannelli (shared/modal-x.js) chiude e basta: qui si rimette in moto
// la partita, perché aprire la pausa o le impostazioni la aveva messa in pausa.
window.FFR_ON_MODAL_CLOSE = function (id) {
  // Il tutorial del primo avvio è l'unico che ha qualcosa dietro di sé: chiuso
  // con la X saltava il pezzo di codice che sceglie fra riprendere la partita
  // salvata e chiedere la difficoltà, e si restava davanti a un campo fermo.
  if (id === 'tutorialOverlay' && state.difficulty == null) {
    try { localStorage.setItem('blokko-tutorial-seen', '1'); } catch (e) { /* ignora */ }
    if (pendingResume) {
      const saved = pendingResume;
      pendingResume = null;
      resumeFromSaved(saved);
    } else {
      els.difficultyOverlay.classList.add('show');
    }
    return;
  }
  if (id === 'restartOverlay') { pendingDifficulty = null; confirmReturnTo = null; }
  const resumes = ['pauseOverlay', 'settingsOverlay', 'tutorialOverlay', 'languageOverlay', 'leaderboardOverlay', 'restartOverlay'];
  if (resumes.indexOf(id) !== -1) resumePlay();
};
