/* ============ ADDY — motore di gioco ============
   Tessere che scivolano e si sommano fra loro: due numeri uguali che si
   scontrano diventano uno solo, col doppio. Il codice è scritto da zero, riga
   per riga; il riconoscimento a chi ha reso popolare questo tipo di puzzle
   pubblicando il proprio progetto in modo aperto sta nel README del sito. */

// ---------- Lingua condivisa con tutto il sito ----------
const LANGUAGES = {
  it: { label: 'Italiano', flag: '🇮🇹' },
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
};
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    goalLabel: 'OBIETTIVO',
    scoreLabel: 'PUNTI',
    bestLabel: 'RECORD',
    undo: 'Annulla',
    newGame: 'Nuova partita',
    settingsTitle: '⚙️ Impostazioni',
    languageMenuLabel: 'Lingua',
    commands: 'Istruzioni',
    languageTitle: '🌍 Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    close: 'Chiudi',
    tutorialTitle: 'Come si gioca',
    tutorialSwipe: 'Scorri il dito in una direzione: tutte le tessere scivolano fin dove possono',
    tutorialMerge: 'Due tessere con lo stesso numero che si scontrano diventano una sola, col doppio',
    tutorialGoal: 'Arriva a 2048. Se ci riesci puoi continuare a giocare',
    tutorialUndo: 'Hai 3 annulla per partita, per rimediare a una mossa partita male',
    tutorialKeys: 'Da computer: le frecce della tastiera',
    gotIt: 'Ho capito!',
    winTitle: "Ce l'hai fatta!",
    winSub: 'Hai costruito la tessera 2048. Da qui in poi si gioca per il record.',
    keepPlaying: 'Continua',
    gameOver: 'Niente più mosse',
    gameOverSub: (score, best) => `Punti: ${score}\nRecord: ${best}`,
    playAgain: 'Rigioca',
    undoLastMove: "↺ Annulla l'ultima mossa",
    confirmNewTitle: 'Ricominciare?',
    confirmNewSub: 'La partita in corso viene persa, il record resta.',
    confirmYes: 'Sì, ricomincia',
    confirmNo: 'No, continuo',
  },
  en: {
    goalLabel: 'GOAL',
    scoreLabel: 'SCORE',
    bestLabel: 'BEST',
    undo: 'Undo',
    newGame: 'New game',
    settingsTitle: '⚙️ Settings',
    languageMenuLabel: 'Language',
    commands: 'Instructions',
    languageTitle: '🌍 Language',
    languageSub: 'Choose the interface language',
    close: 'Close',
    tutorialTitle: 'How to play',
    tutorialSwipe: 'Swipe in any direction: every tile slides as far as it can',
    tutorialMerge: 'Two tiles with the same number that meet become one, worth double',
    tutorialGoal: 'Reach 2048. If you make it, you can keep playing',
    tutorialUndo: 'You get 3 undos per game, for when a move goes wrong',
    tutorialKeys: 'On a computer: the arrow keys',
    gotIt: 'Got it!',
    winTitle: 'You made it!',
    winSub: 'You built the 2048 tile. From here on it is all about the record.',
    keepPlaying: 'Keep playing',
    gameOver: 'No moves left',
    gameOverSub: (score, best) => `Score: ${score}\nBest: ${best}`,
    playAgain: 'Play again',
    undoLastMove: '↺ Undo the last move',
    confirmNewTitle: 'Start over?',
    confirmNewSub: 'The current game is lost, your record stays.',
    confirmYes: 'Yes, start over',
    confirmNo: 'No, keep going',
  },
  fr: {
    goalLabel: 'OBJECTIF',
    scoreLabel: 'POINTS',
    bestLabel: 'RECORD',
    undo: 'Annuler',
    newGame: 'Nouvelle partie',
    settingsTitle: '⚙️ Paramètres',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    languageTitle: '🌍 Langue',
    languageSub: "Choisis la langue de l'interface",
    close: 'Fermer',
    tutorialTitle: 'Comment jouer',
    tutorialSwipe: 'Glisse ton doigt dans une direction : toutes les tuiles glissent le plus loin possible',
    tutorialMerge: 'Deux tuiles portant le même nombre qui se rencontrent n\'en font plus qu\'une, qui vaut le double',
    tutorialGoal: 'Atteins 2048. Si tu y arrives, tu peux continuer à jouer',
    tutorialUndo: 'Tu as 3 annulations par partie, pour rattraper un coup raté',
    tutorialKeys: "Sur ordinateur : les flèches du clavier",
    gotIt: 'Compris !',
    winTitle: 'Tu as réussi !',
    winSub: 'Tu as construit la tuile 2048. À partir de maintenant, on joue pour le record.',
    keepPlaying: 'Continuer',
    gameOver: 'Plus aucun coup possible',
    gameOverSub: (score, best) => `Points : ${score}\nRecord : ${best}`,
    playAgain: 'Rejouer',
    undoLastMove: '↺ Annuler le dernier coup',
    confirmNewTitle: 'Recommencer ?',
    confirmNewSub: 'La partie en cours est perdue, ton record reste.',
    confirmYes: 'Oui, recommencer',
    confirmNo: 'Non, je continue',
  },
};

let language = 'it';
function t() { return UI_STRINGS[language] || UI_STRINGS.it; }
function getSiteLanguage() {
  try {
    const saved = localStorage.getItem(SITE_LANGUAGE_KEY);
    return (saved && LANGUAGES[saved]) ? saved : null;
  } catch (e) { return null; }
}
function setSiteLanguage(code) {
  try { localStorage.setItem(SITE_LANGUAGE_KEY, code); } catch (e) { /* ignora */ }
}
function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t()[el.dataset.i18n];
    if (typeof val === 'string') el.textContent = val;
  });
  // il riepilogo di fine partita è scritto a mano e non ha un data-i18n:
  // cambiando lingua mentre è a schermo va riscritto a parte
  if (els.gameOverOverlay && els.gameOverOverlay.classList.contains('show')) {
    els.gameOverSub.textContent = t().gameOverSub(state.score, state.best);
  }
}

// ---------- Regole ----------
const SIZE = 4;
const TARGET = 2048;
const UNDO_MAX = 3;
const FOUR_CHANCE = 0.1;   // una tessera nuova su dieci è un 4, le altre sono 2
const SLIDE_MS = 100;      // deve restare allineato alla transizione in style.css

const VECTORS = {
  left:  { dr: 0, dc: -1 },
  right: { dr: 0, dc: 1 },
  up:    { dr: -1, dc: 0 },
  down:  { dr: 1, dc: 0 },
};

const els = {
  loading: document.getElementById('loadingScreen'),
  gameZone: document.getElementById('gameZone'),
  boardFrame: document.getElementById('boardFrame'),
  boardCells: document.getElementById('boardCells'),
  boardTiles: document.getElementById('boardTiles'),
  scoreValue: document.getElementById('scoreValue'),
  bestValue: document.getElementById('bestValue'),
  undoBtn: document.getElementById('undoBtn'),
  undoCount: document.getElementById('undoCount'),
  newGameBtn: document.getElementById('newGameBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsOverlay: document.getElementById('settingsOverlay'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  openLanguageBtn: document.getElementById('openLanguageBtn'),
  openTutorialBtn: document.getElementById('openTutorialBtn'),
  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  tutorialOverlay: document.getElementById('tutorialOverlay'),
  closeTutorialBtn: document.getElementById('closeTutorialBtn'),
  winOverlay: document.getElementById('winOverlay'),
  keepPlayingBtn: document.getElementById('keepPlayingBtn'),
  gameOverOverlay: document.getElementById('gameOverOverlay'),
  gameOverSub: document.getElementById('gameOverSub'),
  retryBtn: document.getElementById('retryBtn'),
  gameOverUndoBtn: document.getElementById('gameOverUndoBtn'),
  confirmOverlay: document.getElementById('confirmOverlay'),
  confirmNewBtn: document.getElementById('confirmNewBtn'),
  cancelNewBtn: document.getElementById('cancelNewBtn'),
};

const state = {
  grid: [],        // SIZE×SIZE di tessere (oggetti) o null
  score: 0,
  best: 0,
  undosLeft: UNDO_MAX,
  history: [],     // fotografie da ripristinare con l'annulla
  won: false,      // 2048 già raggiunto: il messaggio di vittoria si mostra una volta sola
  gameOver: false,
  nextId: 1,
};

// misure del campo, ricalcolate a ogni ridimensionamento
let metrics = { gap: 8, cell: 66 };

// ---------- Campo ----------
function emptyGrid() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}
function inside(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}
function forEachTile(fn) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (state.grid[r][c]) fn(state.grid[r][c]);
    }
  }
}
function emptyCells() {
  const out = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) if (!state.grid[r][c]) out.push({ r, c });
  }
  return out;
}

// La misura del campo si prende dallo spazio che resta davvero, non da una
// percentuale dello schermo scelta a occhio: la zona di gioco è l'elemento
// elastico del layout, quindi la sua altezza è già "quello che avanza" sotto
// l'intestazione e sopra i pulsanti, su qualunque telefono o tablet.
function layout() {
  const cs = getComputedStyle(els.gameZone);
  const w = els.gameZone.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const h = els.gameZone.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  // 12px tolti dal risultato: la seconda riga di squadratura è disegnata 5px
  // FUORI dal riquadro e senza margine verrebbe tagliata di netto sui bordi
  const avail = Math.min(w, h) - 12;
  if (avail <= 0) return;
  const gap = Math.max(4, Math.round(avail * 0.024));
  const cell = Math.max(24, Math.floor((avail - gap * (SIZE + 1)) / SIZE));
  const board = cell * SIZE + gap * (SIZE + 1);
  metrics = { gap, cell };
  els.boardFrame.style.setProperty('--board', board + 'px');
  els.boardFrame.style.setProperty('--cell', cell + 'px');
  positionCells();
  forEachTile(positionTile);
}
function cellX(c) { return metrics.gap + c * (metrics.cell + metrics.gap); }
function cellY(r) { return metrics.gap + r * (metrics.cell + metrics.gap); }

function buildCells() {
  els.boardCells.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const el = document.createElement('div');
      el.className = 'cell';
      el.dataset.r = r;
      el.dataset.c = c;
      els.boardCells.appendChild(el);
    }
  }
}
function positionCells() {
  els.boardCells.querySelectorAll('.cell').forEach(el => {
    el.style.transform = `translate(${cellX(+el.dataset.c)}px, ${cellY(+el.dataset.r)}px)`;
  });
}

// ---------- Tessere ----------
function createTile(value, r, c, isNew) {
  const el = document.createElement('div');
  el.className = 'tile';
  // posizione e valore vanno messi PRIMA di attaccarla alla pagina: così la
  // tessera nasce già al posto giusto invece di scivolarci dentro dall'angolo
  el.style.transform = `translate(${cellX(c)}px, ${cellY(r)}px)`;
  const tile = { id: state.nextId++, value, r, c, el, mergedNow: false, pendingValue: 0 };
  paintTile(tile);
  if (isNew) el.classList.add('is-new');
  els.boardTiles.appendChild(el);
  state.grid[r][c] = tile;
  return tile;
}
function paintTile(tile) {
  const el = tile.el;
  el.textContent = String(tile.value);
  el.dataset.v = String(tile.value);
  el.classList.toggle('is-beyond', tile.value > TARGET);
  const digits = String(tile.value).length;
  el.classList.remove('d1', 'd2', 'd3', 'd4', 'd5');
  el.classList.add('d' + Math.min(5, digits));
}
function positionTile(tile) {
  tile.el.style.transform = `translate(${cellX(tile.c)}px, ${cellY(tile.r)}px)`;
}
// riavvia un'animazione già usata: senza il reflow in mezzo il browser non si
// accorge che la classe è stata tolta e rimessa, e l'animazione non riparte
function replayAnimation(el, cls) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}
function clearBoard() {
  els.boardTiles.innerHTML = '';
  state.grid = emptyGrid();
}
function spawnRandomTile() {
  const free = emptyCells();
  if (!free.length) return null;
  const spot = free[Math.floor(Math.random() * free.length)];
  const value = Math.random() < FOUR_CHANCE ? 4 : 2;
  return createTile(value, spot.r, spot.c, true);
}

// ---------- Mosse ----------
// Le fusioni si risolvono partendo dal bordo verso cui si sta andando, e una
// tessera appena nata da una fusione non si rifonde nella stessa mossa: per
// questo si legge il valore VECCHIO della tessera di arrivo (quello nuovo
// arriva solo a fine animazione) e si segna `mergedNow`.
function move(dir) {
  // prima si chiude la mossa precedente (può far finire la partita), poi si
  // controlla se questa è ancora giocabile: l'ordine inverso lascerebbe passare
  // una mossa su un campo già bloccato
  finishPendingMove();
  if (!canPlay()) return;

  const before = snapshotValues();
  const vec = VECTORS[dir];
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3];
  if (vec.dr === 1) rows.reverse();
  if (vec.dc === 1) cols.reverse();

  forEachTile(tile => { tile.mergedNow = false; tile.pendingValue = 0; });

  const absorbed = [];
  const merged = [];
  let moved = false;
  let gained = 0;

  for (const r of rows) {
    for (const c of cols) {
      const tile = state.grid[r][c];
      if (!tile) continue;
      let nr = r, nc = c;
      while (inside(nr + vec.dr, nc + vec.dc) && !state.grid[nr + vec.dr][nc + vec.dc]) {
        nr += vec.dr; nc += vec.dc;
      }
      const tr = nr + vec.dr, tc = nc + vec.dc;
      const next = inside(tr, tc) ? state.grid[tr][tc] : null;
      if (next && next.value === tile.value && !next.mergedNow) {
        state.grid[r][c] = null;
        tile.r = tr; tile.c = tc;         // scivola sopra a quella che la assorbe
        next.mergedNow = true;
        next.pendingValue = next.value * 2;
        gained += next.pendingValue;
        absorbed.push(tile);
        merged.push(next);
        moved = true;
      } else if (nr !== r || nc !== c) {
        state.grid[r][c] = null;
        state.grid[nr][nc] = tile;
        tile.r = nr; tile.c = nc;
        moved = true;
      }
    }
  }

  if (!moved) return;

  state.history.push(before);
  if (state.history.length > UNDO_MAX) state.history.shift();

  state.score += gained;
  if (state.score > state.best) state.best = state.score;
  updateHUD();

  forEachTile(positionTile);
  absorbed.forEach(positionTile);

  scheduleFinish(absorbed, merged);
}

// Fine dello scivolamento: si tolgono le tessere assorbite, si raddoppiano
// quelle che hanno assorbito, ne nasce una nuova. È un passaggio ritardato per
// far vedere lo scivolamento; se nel frattempo arriva un'altra mossa, viene
// eseguito subito (finishPendingMove) invece di bloccare il giocatore.
let pendingFinish = null;
let pendingTimer = 0;
function scheduleFinish(absorbed, merged) {
  pendingFinish = () => {
    absorbed.forEach(tile => tile.el.remove());
    merged.forEach(tile => {
      tile.value = tile.pendingValue;
      tile.pendingValue = 0;
      paintTile(tile);
      replayAnimation(tile.el, 'is-merged');
    });
    spawnRandomTile();
    afterMove();
  };
  pendingTimer = setTimeout(finishPendingMove, SLIDE_MS);
}
function finishPendingMove() {
  if (!pendingFinish) return;
  clearTimeout(pendingTimer);
  const fn = pendingFinish;
  pendingFinish = null;
  pendingTimer = 0;
  fn();
}

function afterMove() {
  updateHUD();
  scheduleSave();
  if (!state.won) {
    let reached = false;
    forEachTile(tile => { if (tile.value >= TARGET) reached = true; });
    if (reached) {
      state.won = true;
      flushSave();
      els.winOverlay.classList.add('show');
      return;
    }
  }
  if (!hasMoves()) showGameOver();
}

function showGameOver() {
  state.gameOver = true;
  flushSave();
  els.gameOverSub.textContent = t().gameOverSub(state.score, state.best);
  els.gameOverUndoBtn.style.display = canUndo() ? '' : 'none';
  els.gameOverOverlay.classList.add('show');
}

function hasMoves() {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const tile = state.grid[r][c];
      if (!tile) return true;
      if (c + 1 < SIZE) {
        const right = state.grid[r][c + 1];
        if (right && right.value === tile.value) return true;
      }
      if (r + 1 < SIZE) {
        const down = state.grid[r + 1][c];
        if (down && down.value === tile.value) return true;
      }
    }
  }
  return false;
}

function canPlay() {
  if (state.gameOver) return false;
  return !document.querySelector('.overlay.show');
}

// ---------- Annulla ----------
function snapshotValues() {
  return {
    values: state.grid.map(row => row.map(tile => (tile ? tile.value : 0))),
    score: state.score,
  };
}
function restoreSnapshot(snap) {
  clearBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = snap.values[r][c];
      if (v) createTile(v, r, c, false);
    }
  }
  state.score = snap.score;
  state.gameOver = false;
}
function canUndo() {
  return state.undosLeft > 0 && state.history.length > 0;
}
function undo() {
  if (!canUndo()) return;
  finishPendingMove();
  restoreSnapshot(state.history.pop());
  state.undosLeft--;
  els.gameOverOverlay.classList.remove('show');
  updateHUD();
  flushSave();
}

// ---------- Partita ----------
function startNewGame() {
  finishPendingMove();
  clearBoard();
  started = true;
  state.score = 0;
  state.undosLeft = UNDO_MAX;
  state.history = [];
  state.won = false;
  state.gameOver = false;
  spawnRandomTile();
  spawnRandomTile();
  layout();
  updateHUD();
  hideAllOverlays();
  flushSave();
}

function updateHUD() {
  els.scoreValue.textContent = String(state.score);
  els.bestValue.textContent = String(state.best);
  els.undoCount.textContent = String(state.undosLeft);
  els.undoBtn.disabled = !canUndo();
}

// ---------- Comandi ----------
const SWIPE_MIN = 22; // px: sotto questa soglia è un tocco, non uno scorrimento
let touchStart = null;
function onPointerDown(e) {
  if (!canPlay()) return;
  touchStart = { x: e.clientX, y: e.clientY };
}
function onPointerMove(e) {
  if (!touchStart) return;
  const dx = e.clientX - touchStart.x;
  const dy = e.clientY - touchStart.y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_MIN) return;
  // la mossa parte appena la soglia è superata, senza aspettare che il dito si
  // stacchi: è quello che fa sembrare il gioco immediato invece che lento
  touchStart = null;
  if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? 'right' : 'left');
  else move(dy > 0 ? 'down' : 'up');
}
function onPointerUp() { touchStart = null; }

const KEY_DIRS = {
  ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down',
  a: 'left', d: 'right', w: 'up', s: 'down',
};
function onKeyDown(e) {
  const dir = KEY_DIRS[e.key] || KEY_DIRS[String(e.key).toLowerCase()];
  if (!dir) return;
  e.preventDefault();
  move(dir);
}

// ---------- Overlay ----------
function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('show'));
}
function openSettingsMenu() { els.settingsOverlay.classList.add('show'); }
function closeSettingsMenu() { els.settingsOverlay.classList.remove('show'); }

function renderLanguageList() {
  els.languageList.innerHTML = Object.entries(LANGUAGES).map(([code, info]) => `
    <button class="language-option${code === language ? ' active' : ''}" data-lang="${code}">
      <span class="language-flag">${info.flag}</span>
      <span class="language-name">${info.label}</span>
    </button>
  `).join('');
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
// riprende alla sua chiusura
let pendingResume = null;
function closeTutorial() {
  els.tutorialOverlay.classList.remove('show');
  try { localStorage.setItem('addy-tutorial-seen', '1'); } catch (e) { /* ignora */ }
  if (pendingResume) {
    const saved = pendingResume;
    pendingResume = null;
    resumeFromSaved(saved);
  } else if (!started) {
    startNewGame();
  } else {
    els.settingsOverlay.classList.add('show');
  }
}

// ---------- Progresso (localStorage + cloud se loggato) ----------
// Il campo viene salvato per intero: chiudendo la pagina a metà partita si
// ritrova tutto com'era, annulli rimasti compresi.
let started = false;
function snapshotRun() {
  return {
    v: 1,
    values: state.grid.map(row => row.map(tile => (tile ? tile.value : 0))),
    score: state.score,
    best: state.best,
    undos: state.undosLeft,
    won: state.won,
    over: state.gameOver,
  };
}
function saveProgress() {
  if (!(window.FFR && window.FFR.auth)) return;
  if (!started) return;
  window.FFR.auth.saveProgress('addy', snapshotRun(), state.best);
  pendingSave = false;
}
// Durante la partita si salva al massimo ogni 8 secondi: una richiesta di rete
// a ogni mossa sarebbe una ogni due secondi. I momenti importanti (vittoria,
// game over, annulla, uscita dalla pagina) salvano invece subito.
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
  lastSaveAt = Date.now();
  saveProgress();
}

async function loadAddyProgress() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return normalizeSaved(await window.FFR.auth.loadProgress('addy'));
}
// Un salvataggio con una forma che non riconosciamo non deve far perdere il
// record: se il campo non è leggibile si tiene almeno quello.
function isTileValue(v) {
  return typeof v === 'number' && v >= 2 && v <= 1048576 && (v & (v - 1)) === 0;
}
function normalizeSaved(saved) {
  if (!saved || typeof saved !== 'object') return null;
  const best = Number(saved.best) || 0;
  const out = {
    values: null,
    score: Number(saved.score) || 0,
    best,
    undos: Number.isFinite(saved.undos) ? Math.max(0, Math.min(UNDO_MAX, saved.undos)) : UNDO_MAX,
    won: !!saved.won,
    over: !!saved.over,
  };
  const rows = saved.values;
  if (Array.isArray(rows) && rows.length === SIZE) {
    const values = [];
    for (let r = 0; r < SIZE; r++) {
      const row = rows[r];
      if (!Array.isArray(row) || row.length !== SIZE) return out;
      const clean = [];
      for (let c = 0; c < SIZE; c++) {
        const v = row[c];
        if (v === 0 || v === null) clean.push(0);
        else if (isTileValue(v)) clean.push(v);
        else return out;
      }
      values.push(clean);
    }
    out.values = values;
  }
  return out;
}
function resumeFromSaved(saved) {
  state.best = saved.best;
  const hasTiles = saved.values && saved.values.some(row => row.some(v => v > 0));
  if (!hasTiles || saved.over) {
    // niente da riprendere (o partita finita): si riparte, ma il record resta
    startNewGame();
    return;
  }
  clearBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (saved.values[r][c]) createTile(saved.values[r][c], r, c, false);
    }
  }
  state.score = saved.score;
  state.undosLeft = saved.undos;
  state.won = saved.won;
  state.gameOver = false;
  state.history = [];   // gli annulli valgono nella sessione in cui si gioca
  started = true;
  layout();
  updateHUD();
  hideAllOverlays();
}

// ---------- Avvio ----------
async function init() {
  language = getSiteLanguage() || 'it';
  applyTranslations();
  state.grid = emptyGrid();
  buildCells();
  layout();
  updateHUD();

  els.gameZone.addEventListener('pointerdown', onPointerDown);
  els.gameZone.addEventListener('pointermove', onPointerMove);
  // il rilascio si ascolta sulla finestra, non sul campo: col mouse si può
  // lasciare il pulsante fuori dal riquadro, e un gesto rimasto "aperto" farebbe
  // partire una mossa al primo movimento successivo
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 250));

  els.undoBtn.addEventListener('click', undo);
  els.gameOverUndoBtn.addEventListener('click', undo);
  els.newGameBtn.addEventListener('click', () => els.confirmOverlay.classList.add('show'));
  els.confirmNewBtn.addEventListener('click', startNewGame);
  els.cancelNewBtn.addEventListener('click', () => els.confirmOverlay.classList.remove('show'));
  els.confirmOverlay.addEventListener('click', (e) => {
    if (e.target === els.confirmOverlay) els.confirmOverlay.classList.remove('show');
  });

  els.retryBtn.addEventListener('click', startNewGame);
  els.keepPlayingBtn.addEventListener('click', () => {
    els.winOverlay.classList.remove('show');
    // caso raro ma possibile: il 2048 arriva con l'ultima casella libera
    if (!hasMoves()) showGameOver();
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
    if (e.target === els.tutorialOverlay) closeTutorial();
  });

  // chiudendo la scheda (o passando ad un'altra app) si salva: sul telefono è
  // il caso più comune di "chiudo e riapro dopo"
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { finishPendingMove(); flushSave(); }
  });
  window.addEventListener('pagehide', () => { finishPendingMove(); flushSave(); });

  // primo avvio: tutorial, poi si comincia. Il progresso va caricato SEMPRE,
  // anche mostrando il tutorial: 'addy-tutorial-seen' è una chiave locale del
  // dispositivo, e su un secondo dispositivo il tutorial ricompare anche a chi
  // ha già un account con dei progressi nel cloud.
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('addy-tutorial-seen'); } catch (e) { /* ignora */ }
  const saved = await loadAddyProgress();
  if (saved) state.best = saved.best;
  if (!tutorialSeen) {
    pendingResume = saved;
    updateHUD();
    els.tutorialOverlay.classList.add('show');
  } else if (saved) {
    resumeFromSaved(saved);
  } else {
    startNewGame();
  }

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 350);
}
init();
