/* ============ SUDOPOKU — motore di gioco ============
   Griglia 9×9: in ogni riga, in ogni colonna e in ogni riquadro da nove devono
   starci tutte le cifre da 1 a 9, una volta sola. Le regole di questo tipo di
   schema non sono di nessuno — nascono dai quadrati latini di Eulero — e qui
   sono scritte da zero: generatore, risolutore, punteggio, grafica e testi sono
   roba nostra, niente è preso da nessun altro.

   Gli schemi si fabbricano qui dentro, nel telefono, senza chiedere niente a
   nessun server: il sito deve funzionare anche senza connessione. */

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
    timeLabel: 'TEMPO',
    errorsLabel: 'ERRORI',
    hintsLabel: 'AIUTI',
    chooseDifficulty: 'Scegli la difficoltà',
    chooseDifficultySub: 'Puoi cambiarla ogni volta che inizi uno schema nuovo',
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Difficile',
    paused: 'Pausa',
    pausedSub: 'Il cronometro è fermo',
    resume: 'Riprendi',
    newPuzzle: 'Schema nuovo',
    difficultyLabel: 'Difficoltà',
    settingsTitle: 'Impostazioni',
    languageMenuLabel: 'Lingua',
    commands: 'Istruzioni',
    leaderboardMenuLabel: 'Classifica',
    leaderboardTitle: 'Classifica',
    leaderboardEmpty: 'Nessun punteggio ancora: gioca da loggato per essere il primo!',
    languageTitle: 'Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    checkErrors: 'Segnala gli errori',
    on: 'ACCESO',
    off: 'SPENTO',
    close: 'Chiudi',
    pencil: 'Matita',
    erase: 'Cancella',
    undo: 'Annulla',
    hint: 'Aiuto',
    tapToContinue: 'Tocca per continuare',
    preparing: 'Preparo lo schema…',
    tutorialTitle: 'Come si gioca',
    tutorialGoal: 'In ogni riga, in ogni colonna e in ogni riquadro da nove devono esserci tutte le cifre da 1 a 9, una volta sola.',
    tutorialTap: 'Tocca una casella vuota, poi la cifra da scriverci',
    tutorialPencil: 'Con la matita accesa le cifre si segnano piccole in un angolo: sono appunti, non risposte',
    tutorialErase: 'La gomma svuota la casella scelta, appunti compresi',
    tutorialHint: 'Tre aiuti a schema: scoprono la cifra giusta della casella scelta, e costano punti',
    tutorialKeys: 'Da computer: le frecce per spostarsi, i tasti da 1 a 9 per scrivere, canc per cancellare',
    gotIt: 'Ho capito!',
    winTitle: 'Schema risolto!',
    winSub: (time, points) => `Tempo: ${time}\nPunti: ${points}`,
    winBest: best => `Record: ${best}`,
    confirmNewTitle: 'Schema nuovo?',
    confirmNewSub: 'Quello che stai facendo viene perso, il record resta.',
    confirmYes: 'Sì, ricomincia',
    confirmNo: 'No, continuo',
  },
  en: {
    backToHome: 'Back to Home',
    timeLabel: 'TIME',
    errorsLabel: 'MISTAKES',
    hintsLabel: 'HINTS',
    chooseDifficulty: 'Choose difficulty',
    chooseDifficultySub: 'You can change it every time you start a new puzzle',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    paused: 'Paused',
    pausedSub: 'The clock is stopped',
    resume: 'Resume',
    newPuzzle: 'New puzzle',
    difficultyLabel: 'Difficulty',
    settingsTitle: 'Settings',
    languageMenuLabel: 'Language',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Leaderboard',
    leaderboardTitle: 'Leaderboard',
    leaderboardEmpty: 'No scores yet: play while signed in to be the first!',
    languageTitle: 'Language',
    languageSub: 'Choose the interface language',
    checkErrors: 'Flag mistakes',
    on: 'ON',
    off: 'OFF',
    close: 'Close',
    pencil: 'Pencil',
    erase: 'Erase',
    undo: 'Undo',
    hint: 'Hint',
    tapToContinue: 'Tap to continue',
    preparing: 'Building the puzzle…',
    tutorialTitle: 'How to play',
    tutorialGoal: 'Every row, every column and every box of nine must hold all the digits from 1 to 9, once each.',
    tutorialTap: 'Tap an empty square, then the digit to write in it',
    tutorialPencil: 'With the pencil on, digits go in small in a corner: those are notes, not answers',
    tutorialErase: 'The eraser empties the chosen square, notes included',
    tutorialHint: 'Three hints per puzzle: they reveal the right digit for the chosen square, and cost points',
    tutorialKeys: 'On a computer: arrow keys to move, 1 to 9 to write, delete to clear',
    gotIt: 'Got it!',
    winTitle: 'Puzzle solved!',
    winSub: (time, points) => `Time: ${time}\nPoints: ${points}`,
    winBest: best => `Best: ${best}`,
    confirmNewTitle: 'New puzzle?',
    confirmNewSub: 'What you are working on is lost, your best score stays.',
    confirmYes: 'Yes, start over',
    confirmNo: 'No, keep going',
  },
  fr: {
    backToHome: "Retour à l'accueil",
    timeLabel: 'TEMPS',
    errorsLabel: 'ERREURS',
    hintsLabel: 'AIDES',
    chooseDifficulty: 'Choisis la difficulté',
    chooseDifficultySub: 'Tu peux la changer à chaque nouvelle grille',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    paused: 'Pause',
    pausedSub: 'Le chronomètre est arrêté',
    resume: 'Reprendre',
    newPuzzle: 'Nouvelle grille',
    difficultyLabel: 'Difficulté',
    settingsTitle: 'Paramètres',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Classement',
    leaderboardTitle: 'Classement',
    leaderboardEmpty: "Aucun score pour l'instant : joue connecté pour être le premier !",
    languageTitle: 'Langue',
    languageSub: "Choisis la langue de l'interface",
    checkErrors: 'Signaler les erreurs',
    on: 'ACTIVÉ',
    off: 'DÉSACTIVÉ',
    close: 'Fermer',
    pencil: 'Crayon',
    erase: 'Gommer',
    undo: 'Annuler',
    hint: 'Aide',
    tapToContinue: 'Touche pour continuer',
    preparing: 'Je prépare la grille…',
    tutorialTitle: 'Comment jouer',
    tutorialGoal: 'Dans chaque ligne, chaque colonne et chaque bloc de neuf, il faut tous les chiffres de 1 à 9, une seule fois.',
    tutorialTap: 'Touche une case vide, puis le chiffre à y écrire',
    tutorialPencil: 'Avec le crayon allumé, les chiffres se notent en petit dans un coin : ce sont des notes, pas des réponses',
    tutorialErase: 'La gomme vide la case choisie, notes comprises',
    tutorialHint: 'Trois aides par grille : elles révèlent le bon chiffre de la case choisie, et coûtent des points',
    tutorialKeys: 'Sur ordinateur : les flèches pour se déplacer, les touches 1 à 9 pour écrire, suppr pour effacer',
    gotIt: "C'est compris !",
    winTitle: 'Grille résolue !',
    winSub: (time, points) => `Temps : ${time}\nPoints : ${points}`,
    winBest: best => `Record : ${best}`,
    confirmNewTitle: 'Nouvelle grille ?',
    confirmNewSub: 'Ce que tu es en train de faire est perdu, ton record reste.',
    confirmYes: 'Oui, recommencer',
    confirmNo: 'Non, je continue',
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
  // le parti scritte da qui dentro non hanno un data-i18n loro: si riscrivono
  updateDifficultyLabel();
  updateCheckLabel();
  updatePencilLabel();
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

// ---------- Difficoltà ----------
// `givens` = quante cifre restano stampate sullo schema. Meno ce ne sono, più
// c'è da ragionare. `base` è il punteggio pieno prima delle penalità: uno schema
// difficile vale di più perché costa di più, e comunque ogni difficoltà ha la
// sua classifica, quindi non si confrontano mai fra loro.
const DIFFICULTIES = {
  easy: { givens: 42, base: 1000 },
  medium: { givens: 34, base: 2000 },
  hard: { givens: 28, base: 3500 },
};
const MAX_HINTS = 3;
const HINT_COST = 100;
const ERROR_COST = 50;
const TIME_COST = 2;      // punti persi per ogni secondo
const MIN_POINTS = 100;   // risolvere vale sempre qualcosa

// ---------- Generatore di schemi ----------
// Tutto lavora su un unico vettore di 81 numeri (0 = casella vuota): riga r e
// colonna c stanno all'indice r*9+c.
function rowOf(i) { return Math.floor(i / 9); }
function colOf(i) { return i % 9; }
function boxOf(i) { return Math.floor(rowOf(i) / 3) * 3 + Math.floor(colOf(i) / 3); }

// gli indici delle 20 caselle "parenti" di ognuna (stessa riga, stessa colonna,
// stesso riquadro): calcolati una volta sola e poi solo riletti
const PEERS = (function buildPeers() {
  const all = [];
  for (let i = 0; i < 81; i++) {
    const set = new Set();
    for (let j = 0; j < 81; j++) {
      if (j === i) continue;
      if (rowOf(j) === rowOf(i) || colOf(j) === colOf(i) || boxOf(j) === boxOf(i)) set.add(j);
    }
    all.push(Array.from(set));
  }
  return all;
})();

function allowed(grid, i, d) {
  const peers = PEERS[i];
  for (let k = 0; k < peers.length; k++) {
    if (grid[peers[k]] === d) return false;
  }
  return true;
}
function shuffle(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = list[i]; list[i] = list[j]; list[j] = tmp;
  }
  return list;
}

// Griglia piena a caso: si riempie casella per casella provando le cifre in
// ordine sparso e tornando indietro quando ci si incastra.
function fillGrid(grid, pos) {
  if (pos === 81) return true;
  if (grid[pos]) return fillGrid(grid, pos + 1);
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  for (let k = 0; k < digits.length; k++) {
    const d = digits[k];
    if (!allowed(grid, pos, d)) continue;
    grid[pos] = d;
    if (fillGrid(grid, pos + 1)) return true;
    grid[pos] = 0;
  }
  return false;
}
function makeSolution() {
  const grid = new Array(81).fill(0);
  fillGrid(grid, 0);
  return grid;
}

// Quante soluzioni ha questo schema (si smette di contare a `limit`). Non parte
// dalla prima casella vuota ma da quella con MENO cifre possibili: è la stessa
// mossa che farebbe una persona, e qui evita di provare rami che non stanno in
// piedi — senza, uno schema difficile ci metterebbe secondi invece di
// millisecondi.
function countSolutions(grid, limit) {
  let target = -1;
  let targetDigits = null;
  for (let i = 0; i < 81; i++) {
    if (grid[i]) continue;
    const digits = [];
    for (let d = 1; d <= 9; d++) if (allowed(grid, i, d)) digits.push(d);
    if (digits.length === 0) return 0;       // casella murata: strada chiusa
    if (targetDigits === null || digits.length < targetDigits.length) {
      target = i; targetDigits = digits;
      if (digits.length === 1) break;
    }
  }
  if (target === -1) return 1;               // nessuna casella vuota: è risolta
  let found = 0;
  for (let k = 0; k < targetDigits.length; k++) {
    grid[target] = targetDigits[k];
    found += countSolutions(grid, limit - found);
    grid[target] = 0;
    if (found >= limit) break;
  }
  return found;
}

// Dallo schema pieno si tolgono cifre a coppie simmetriche rispetto al centro
// (fa un disegno ordinato, come sui giornali), e dopo ogni buco si controlla che
// la soluzione resti UNA SOLA: uno schema con due soluzioni non si può risolvere
// ragionando, si può solo indovinare.
function makePuzzle(difficultyKey) {
  const solution = makeSolution();
  const puzzle = solution.slice();
  const target = DIFFICULTIES[difficultyKey].givens;
  let givens = 81;
  const order = shuffle(Array.from({ length: 41 }, (_, i) => i));
  for (let k = 0; k < order.length && givens > target; k++) {
    const i = order[k];
    const j = 80 - i;
    const a = puzzle[i], b = puzzle[j];
    if (!a && !b) continue;
    puzzle[i] = 0; puzzle[j] = 0;
    if (countSolutions(puzzle.slice(), 2) === 1) {
      givens -= (a ? 1 : 0) + (i === j ? 0 : (b ? 1 : 0));
    } else {
      puzzle[i] = a; puzzle[j] = b;
    }
  }
  return { puzzle, solution };
}

// Lo schema successivo si prepara mentre si gioca a quello di adesso: fabbricarlo
// tiene occupato il telefono per qualche decimo di secondo e non è il caso di
// farlo aspettare a chi ha appena chiesto di ricominciare.
const readyPuzzles = { easy: null, medium: null, hard: null };
let prefetchTimer = null;
function prefetch(difficultyKey) {
  clearTimeout(prefetchTimer);
  prefetchTimer = setTimeout(() => {
    if (!readyPuzzles[difficultyKey]) readyPuzzles[difficultyKey] = makePuzzle(difficultyKey);
  }, 1500);
}
function takePuzzle(difficultyKey) {
  const ready = readyPuzzles[difficultyKey];
  readyPuzzles[difficultyKey] = null;
  return ready || makePuzzle(difficultyKey);
}

// ---------- Stato ----------
const state = {
  difficulty: null,
  puzzle: new Array(81).fill(0),    // le cifre stampate (0 = casella da riempire)
  solution: new Array(81).fill(0),
  entries: new Array(81).fill(0),   // quello che ci ha scritto chi gioca
  notes: new Array(81).fill(0),     // appunti, una maschera di bit per casella
  selected: null,
  pencil: false,
  seconds: 0,
  errors: 0,
  hints: 0,
  solved: false,
  paused: true,
  best: 0,
  byDifficulty: {},
};
let history = [];          // per l'annulla: vale per la sessione, non si salva
let tornaAllaPausa = false; // la conferma "schema nuovo" è stata aperta dal pannello di pausa?
// Tutorial del primo avvio: si chiude solo con "Ho capito!". Prima bastava un
// dito appoggiato sullo sfondo per farlo sparire, e siccome quel tocco lo
// segnava anche come "gia' visto", non tornava mai piu': chi apriva il gioco
// per la prima volta poteva restare senza istruzioni senza nemmeno accorgersene.
// Finche' e' quello del primo avvio non ha nemmeno la X (classe x-off, la stessa
// che usa la Dama). Riaperto dal menu si chiude come tutti gli altri pannelli.
let tutorialPrimoAvvio = false;
let checkErrors = true;    // segnalare gli sbagli appena si scrivono

const els = {
  loading: document.getElementById('loadingScreen'),
  board: document.getElementById('board'),
  boardFrame: document.getElementById('boardFrame'),
  gameZone: document.getElementById('gameZone'),
  keypad: document.getElementById('keypad'),
  resumeHint: document.getElementById('resumeHint'),
  timeValue: document.getElementById('timeValue'),
  errorsValue: document.getElementById('errorsValue'),
  hintsValue: document.getElementById('hintsValue'),
  difficultyDisplay: document.getElementById('difficultyDisplay'),
  pencilBtn: document.getElementById('pencilBtn'),
  pencilState: document.getElementById('pencilState'),
  eraseBtn: document.getElementById('eraseBtn'),
  undoBtn: document.getElementById('undoBtn'),
  hintBtn: document.getElementById('hintBtn'),
  hintCount: document.getElementById('hintCount'),
  difficultyOverlay: document.getElementById('difficultyOverlay'),
  pauseOverlay: document.getElementById('pauseOverlay'),
  settingsOverlay: document.getElementById('settingsOverlay'),
  tutorialOverlay: document.getElementById('tutorialOverlay'),
  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  leaderboardOverlay: document.getElementById('leaderboardOverlay'),
  leaderboardTabs: document.getElementById('leaderboardTabs'),
  leaderboardList: document.getElementById('leaderboardList'),
  winOverlay: document.getElementById('winOverlay'),
  winSub: document.getElementById('winSub'),
  confirmOverlay: document.getElementById('confirmOverlay'),
  pauseBtn: document.getElementById('pauseBtn'),
  topRestartBtn: document.getElementById('topRestartBtn'),
  resumeBtn: document.getElementById('resumeBtn'),
  restartBtn: document.getElementById('restartBtn'),
  againBtn: document.getElementById('againBtn'),
  confirmNewBtn: document.getElementById('confirmNewBtn'),
  cancelNewBtn: document.getElementById('cancelNewBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  openLanguageBtn: document.getElementById('openLanguageBtn'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  openTutorialBtn: document.getElementById('openTutorialBtn'),
  closeTutorialBtn: document.getElementById('closeTutorialBtn'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
  toggleCheckBtn: document.getElementById('toggleCheckBtn'),
  checkState: document.getElementById('checkState'),
};

const cellEls = [];
const digitEls = [];
const noteEls = [];   // 81 vettori da 9 <span>
const keyEls = [];

function valueAt(i) { return state.puzzle[i] || state.entries[i] || 0; }
function isGiven(i) { return state.puzzle[i] !== 0; }
function isPlaying() { return state.difficulty != null && !state.paused && !state.solved; }

// ---------- Costruzione della griglia ----------
function buildBoard() {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 81; i++) {
    const cell = document.createElement('div');
    cell.className = 'sudo-cell';
    const c = colOf(i), r = rowOf(i);
    if (c === 8) cell.classList.add('last-x');
    else if (c % 3 === 2) cell.classList.add('edge-x');
    if (r === 8) cell.classList.add('last-y');
    else if (r % 3 === 2) cell.classList.add('edge-y');

    const digit = document.createElement('span');
    digit.className = 'digit';
    cell.appendChild(digit);

    const notes = document.createElement('div');
    notes.className = 'notes';
    const spans = [];
    for (let d = 0; d < 9; d++) {
      const s = document.createElement('span');
      notes.appendChild(s);
      spans.push(s);
    }
    cell.appendChild(notes);

    cellEls.push(cell);
    digitEls.push(digit);
    noteEls.push(spans);
    frag.appendChild(cell);
  }
  els.board.appendChild(frag);
  els.board.addEventListener('click', onBoardClick);
}
function buildKeypad() {
  const frag = document.createDocumentFragment();
  for (let d = 1; d <= 9; d++) {
    const key = document.createElement('button');
    key.className = 'key';
    key.type = 'button';
    key.dataset.digit = d;
    key.textContent = d;
    keyEls.push(key);
    frag.appendChild(key);
  }
  els.keypad.appendChild(frag);
  els.keypad.addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (key) writeDigit(parseInt(key.dataset.digit, 10));
  });
}

// La misura dello schema si prende dallo spazio che resta davvero, non da una
// percentuale dello schermo scelta a occhio: la zona di gioco è l'elemento
// elastico del layout, quindi la sua altezza è già "quello che avanza" fra
// l'intestazione e il tastierino, su qualunque telefono o tablet.
function layout() {
  const cs = getComputedStyle(els.gameZone);
  const w = els.gameZone.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const h = els.gameZone.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const avail = Math.min(w, h);
  if (avail <= 0) return;
  // multiplo di 9 più vicino: così le 9 caselle sono tutte identiche e le righe
  // della griglia non ballano di mezzo pixel una rispetto all'altra
  const cell = Math.max(20, Math.floor((avail - 4) / 9));
  const board = cell * 9 + 4;
  els.boardFrame.style.setProperty('--board', board + 'px');
  els.boardFrame.style.setProperty('--cell', cell + 'px');
}

// ---------- Disegno ----------
function render() {
  const sel = state.selected;
  const selValue = sel == null ? 0 : valueAt(sel);
  for (let i = 0; i < 81; i++) {
    const cell = cellEls[i];
    const v = valueAt(i);
    digitEls[i].textContent = v ? String(v) : '';

    const notes = (!v && state.notes[i]) ? state.notes[i] : 0;
    const spans = noteEls[i];
    for (let d = 1; d <= 9; d++) {
      spans[d - 1].textContent = (notes & (1 << (d - 1))) ? String(d) : '';
    }

    cell.classList.toggle('given', isGiven(i));
    cell.classList.toggle('wrong', checkErrors && !isGiven(i) && v !== 0 && v !== state.solution[i]);
    const isSel = i === sel;
    cell.classList.toggle('sel', isSel);
    cell.classList.toggle('peer', !isSel && sel != null && PEERS[sel].indexOf(i) !== -1);
    cell.classList.toggle('same', !isSel && selValue !== 0 && v === selValue);
  }
  renderKeypad();
}
function renderKeypad() {
  const count = new Array(10).fill(0);
  for (let i = 0; i < 81; i++) {
    const v = valueAt(i);
    if (v) count[v]++;
  }
  for (let d = 1; d <= 9; d++) keyEls[d - 1].classList.toggle('done', count[d] >= 9);
}
function updateHUD() {
  els.timeValue.textContent = formatTime(state.seconds);
  els.errorsValue.textContent = state.errors;
  els.hintsValue.textContent = Math.max(0, MAX_HINTS - state.hints);
  els.hintCount.textContent = Math.max(0, MAX_HINTS - state.hints);
  els.hintBtn.disabled = state.hints >= MAX_HINTS || !isPlaying();
  els.undoBtn.disabled = history.length === 0 || !isPlaying();
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}
function updateDifficultyLabel() {
  els.difficultyDisplay.textContent = state.difficulty ? t()[state.difficulty] : '';
  document.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === state.difficulty);
  });
}
function updatePencilLabel() {
  els.pencilState.textContent = state.pencil ? t().on : '';
  els.pencilBtn.classList.toggle('on', state.pencil);
}
function updateCheckLabel() {
  els.checkState.textContent = checkErrors ? t().on : t().off;
}

// ---------- Mosse ----------
function onBoardClick(e) {
  const cell = e.target.closest('.sudo-cell');
  if (!cell || !isPlaying()) return;
  const i = cellEls.indexOf(cell);
  if (i === -1) return;
  state.selected = (state.selected === i) ? null : i;
  render();
}

// Ogni modifica di una casella passa da qui, così l'annulla ha sempre di che
// tornare indietro senza doversene ricordare in dieci punti diversi.
function pushHistory(i) {
  history.push({ i, value: state.entries[i], notes: state.notes[i] });
  if (history.length > 200) history.shift();
}
function writeDigit(d) {
  const i = state.selected;
  if (i == null || !isPlaying() || isGiven(i)) return;
  pushHistory(i);
  if (state.pencil) {
    // appunto: si accende e si spegne, e non tocca la risposta già scritta
    if (state.entries[i]) state.entries[i] = 0;
    state.notes[i] ^= (1 << (d - 1));
  } else if (state.entries[i] === d) {
    state.entries[i] = 0;    // stessa cifra due volte = si cancella
  } else {
    state.entries[i] = d;
    state.notes[i] = 0;
    if (d !== state.solution[i]) state.errors += 1;
    else clearNotesAround(i, d);
  }
  afterMove();
}
// cifra scritta giusta: l'appunto con quella cifra sparisce da riga, colonna e
// riquadro, che è la prima cosa che si farebbe a mano con la gomma
function clearNotesAround(i, d) {
  const bit = 1 << (d - 1);
  PEERS[i].forEach(j => { state.notes[j] &= ~bit; });
}
function eraseCell() {
  const i = state.selected;
  if (i == null || !isPlaying() || isGiven(i)) return;
  if (!state.entries[i] && !state.notes[i]) return;
  pushHistory(i);
  state.entries[i] = 0;
  state.notes[i] = 0;
  afterMove();
}
function undo() {
  if (!history.length || !isPlaying()) return;
  const last = history.pop();
  state.entries[last.i] = last.value;
  state.notes[last.i] = last.notes;
  state.selected = last.i;
  afterMove();
}
function useHint() {
  if (!isPlaying() || state.hints >= MAX_HINTS) return;
  let i = state.selected;
  if (i == null || valueAt(i) !== 0) {
    const empty = [];
    for (let k = 0; k < 81; k++) if (valueAt(k) === 0) empty.push(k);
    if (!empty.length) return;
    i = empty[Math.floor(Math.random() * empty.length)];
  }
  pushHistory(i);
  state.entries[i] = state.solution[i];
  state.notes[i] = 0;
  state.hints += 1;
  state.selected = i;
  clearNotesAround(i, state.solution[i]);
  // il lampo giallo dice quale casella è stata scoperta, che a schema pieno di
  // numeri non si troverebbe più
  cellEls[i].classList.remove('hinted');
  void cellEls[i].offsetWidth;
  cellEls[i].classList.add('hinted');
  afterMove();
}
function afterMove() {
  render();
  updateHUD();
  if (isComplete()) win();
  else scheduleSave();
}
function isComplete() {
  for (let i = 0; i < 81; i++) {
    if (valueAt(i) !== state.solution[i]) return false;
  }
  return true;
}

function computePoints() {
  const base = DIFFICULTIES[state.difficulty].base;
  const points = base - state.seconds * TIME_COST - state.errors * ERROR_COST - state.hints * HINT_COST;
  return Math.max(MIN_POINTS, Math.round(points));
}
function win() {
  state.solved = true;
  state.paused = true;
  state.selected = null;
  const points = computePoints();
  state.best = Math.max(state.best, points);
  render();
  updateHUD();
  els.winSub.textContent = t().winSub(formatTime(state.seconds), points) + '\n' + t().winBest(state.best);
  els.winOverlay.classList.add('show');
  saveProgress();
  prefetch(state.difficulty);
}

// ---------- Cronometro ----------
// Un secondo per volta, e solo mentre si sta davvero giocando: con un pannello
// aperto, la pagina in secondo piano o la partita ancora ferma sul "tocca per
// continuare" il tempo non deve correre.
let lastTick = 0;
function startClock() {
  setInterval(() => {
    if (!isPlaying()) return;
    state.seconds += 1;
    els.timeValue.textContent = formatTime(state.seconds);
    if (state.seconds - lastTick >= 20) { lastTick = state.seconds; scheduleSave(); }
  }, 1000);
}

// ---------- Partita ----------
function startNewGame(difficultyKey) {
  if (state.difficulty && !state.solved) saveProgress();
  const made = takePuzzle(difficultyKey);
  state.difficulty = difficultyKey;
  state.puzzle = made.puzzle.slice();
  state.solution = made.solution.slice();
  state.entries = new Array(81).fill(0);
  state.notes = new Array(81).fill(0);
  state.selected = null;
  state.pencil = false;
  state.seconds = 0;
  state.errors = 0;
  state.hints = 0;
  state.solved = false;
  const saved = state.byDifficulty[difficultyKey];
  state.best = (saved && saved.best) || 0;
  history = [];
  hideAllOverlays();
  hideResumeHint();
  state.paused = false;
  layout();
  render();
  updateHUD();
  updateDifficultyLabel();
  updatePencilLabel();
  saveProgress();
  prefetch(difficultyKey);
}

function resumeFromSaved(saved) {
  state.byDifficulty = saved.byDifficulty || {};
  const key = saved.current;
  const run = state.byDifficulty[key];
  if (!run || !run.puzzle || run.solved) {
    // niente da riprendere (o era già risolto): schema nuovo su quella
    // difficoltà, e il record resta perché startNewGame lo rilegge da byDifficulty
    startNewGame(key);
    return;
  }
  state.difficulty = key;
  state.puzzle = run.puzzle.slice();
  state.solution = run.solution.slice();
  state.entries = run.entries.slice();
  state.notes = run.notes.slice();
  state.seconds = run.seconds;
  state.errors = run.errors;
  state.hints = run.hints;
  state.best = run.best || 0;
  state.selected = null;
  state.pencil = false;
  state.solved = false;
  history = [];
  hideAllOverlays();
  layout();
  render();
  updateHUD();
  updateDifficultyLabel();
  updatePencilLabel();
  showResumeHint();
  prefetch(key);
}

// ---------- "Tocca per continuare" ----------
// Rientrando su uno schema lasciato a metà il cronometro non riparte da solo:
// si guarda la griglia con calma e si riprende quando si vuole.
function showResumeHint() {
  state.paused = true;
  els.resumeHint.classList.remove('hidden');
  updateHUD();
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
// unico punto da cui la partita riparte
function resumePlay() {
  hideResumeHint();
  if (state.difficulty && !state.solved) state.paused = false;
  updateHUD();
}

// ---------- Overlay ----------
function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('show'));
}
function openPause() {
  if (!state.difficulty || state.solved) { els.difficultyOverlay.classList.add('show'); return; }
  state.paused = true;
  updateHUD();
  flushSave();
  els.pauseOverlay.classList.add('show');
}
function closePause() {
  els.pauseOverlay.classList.remove('show');
  resumePlay();
}
function openSettingsMenu() {
  if (state.difficulty && !state.solved) { state.paused = true; updateHUD(); }
  els.settingsOverlay.classList.add('show');
}
function closeSettingsMenu() {
  els.settingsOverlay.classList.remove('show');
  resumePlay();
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
  closeLanguageModal();
}
function openTutorial() {
  els.settingsOverlay.classList.remove('show');
  els.tutorialOverlay.classList.add('show');
}
// schema salvato trovato all'avvio mentre era in corso il tutorial: si riprende
// alla sua chiusura, invece di mandare alla scelta della difficoltà
let pendingResume = null;
function closeTutorial() {
  tutorialPrimoAvvio = false;
  els.tutorialOverlay.classList.remove('x-off');
  els.tutorialOverlay.classList.remove('show');
  try { localStorage.setItem('sudopoku-tutorial-seen', '1'); } catch (e) { /* ignora */ }
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
function toggleCheckErrors() {
  checkErrors = !checkErrors;
  try { localStorage.setItem('sudopoku-check-errors', checkErrors ? '1' : '0'); } catch (e) { /* ignora */ }
  updateCheckLabel();
  render();
}

// ---------- Classifica ----------
// Una classifica per difficoltà: uno schema difficile vale di suo più punti di
// uno facile, quindi metterli nella stessa lista non direbbe niente.
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
  const gameKey = 'sudopoku:' + difficultyKey;
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
// Uno schema per difficoltà, tutti dentro la stessa riga 'sudopoku'. La
// classifica invece vuole un punteggio separato per difficoltà, quindi ognuna ha
// anche la sua voce 'sudopoku:<difficoltà>' (vedi saveScore in shared/auth.js).
// Le griglie si salvano come stringhe di 81 cifre: '0' è la casella vuota.
function encodeGrid(grid) {
  return grid.map(v => String(v || 0)).join('');
}
function decodeGrid(str) {
  if (typeof str !== 'string' || str.length !== 81) return null;
  const out = [];
  for (let i = 0; i < 81; i++) {
    const n = str.charCodeAt(i) - 48;
    if (n < 0 || n > 9) return null;
    out.push(n);
  }
  return out;
}
function snapshotCurrentRun() {
  return {
    puzzle: encodeGrid(state.puzzle),
    solution: encodeGrid(state.solution),
    entries: encodeGrid(state.entries),
    notes: state.notes.slice(),
    seconds: state.seconds,
    errors: state.errors,
    hints: state.hints,
    best: state.best,
    solved: state.solved,
  };
}
function saveProgress() {
  if (!(window.FFR && window.FFR.auth)) return;
  if (state.difficulty == null) return;
  state.byDifficulty[state.difficulty] = snapshotCurrentRun();
  const bestOverall = Object.keys(state.byDifficulty)
    .reduce((m, k) => Math.max(m, state.byDifficulty[k].best || 0), 0);
  window.FFR.auth.saveProgress('sudopoku', {
    v: 1,
    current: state.difficulty,
    byDifficulty: state.byDifficulty,
  }, bestOverall);
  window.FFR.auth.saveScore('sudopoku:' + state.difficulty, state.best);
  pendingSave = false;
}
// Durante la partita un salvataggio a ogni cifra scritta sarebbe una richiesta di
// rete ogni pochi secondi: si accumulano e si scrive al massimo ogni 8 secondi.
// I momenti importanti (schema risolto, pausa, uscita dalla pagina) salvano
// invece subito.
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
async function loadSudopokuProgress() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return normalizeSaved(await window.FFR.auth.loadProgress('sudopoku'));
}
// Tiene aperta la porta ai formati futuri: se un salvataggio ha una forma che non
// riconosciamo si tengono almeno i record, senza buttare via tutto. Uno schema
// scritto male (o mezzo) viene scartato, il record di quella difficoltà no.
function normalizeSaved(saved) {
  if (!saved || typeof saved !== 'object') return null;
  if (!saved.byDifficulty || typeof saved.byDifficulty !== 'object') return null;
  const out = { current: saved.current, byDifficulty: {} };
  Object.keys(DIFFICULTIES).forEach(key => {
    const run = saved.byDifficulty[key];
    if (!run) return;
    const puzzle = decodeGrid(run.puzzle);
    const solution = decodeGrid(run.solution);
    const entries = decodeGrid(run.entries);
    const notes = Array.isArray(run.notes) && run.notes.length === 81
      ? run.notes.map(n => (typeof n === 'number' && n >= 0 && n < 512) ? n : 0)
      : new Array(81).fill(0);
    const usable = !!(puzzle && solution && entries);
    out.byDifficulty[key] = {
      puzzle: usable ? puzzle : null,
      solution: usable ? solution : null,
      entries: usable ? entries : null,
      notes,
      seconds: run.seconds || 0,
      errors: run.errors || 0,
      hints: run.hints || 0,
      best: run.best || 0,
      solved: !!run.solved,
    };
  });
  if (!DIFFICULTIES[out.current]) out.current = null;
  return out;
}

// ---------- Comandi da tastiera ----------
const IGNORED_KEYS = ['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'];
function onKeyDown(e) {
  // schema ripreso e ancora fermo: il primo tasto serve solo a far ripartire
  if (resumeHintVisible() && !anyOverlayOpen()) {
    if (IGNORED_KEYS.indexOf(e.key) !== -1) return;
    resumePlay();
    return;
  }
  if (e.key === 'p' || e.key === 'P') {
    if (state.difficulty && !state.solved) {
      if (els.pauseOverlay.classList.contains('show')) closePause(); else openPause();
    }
    return;
  }
  if (!isPlaying()) return;
  if (e.key >= '1' && e.key <= '9') { writeDigit(parseInt(e.key, 10)); return; }
  switch (e.key) {
    case 'ArrowLeft': moveSelection(-1, 0); break;
    case 'ArrowRight': moveSelection(1, 0); break;
    case 'ArrowUp': moveSelection(0, -1); break;
    case 'ArrowDown': moveSelection(0, 1); break;
    case 'Backspace': case 'Delete': case '0': eraseCell(); break;
    case 'n': case 'N': togglePencil(); break;
    case 'h': case 'H': useHint(); break;
    case 'z': case 'Z': undo(); break;
    default: return;
  }
  if (e.key.indexOf('Arrow') === 0 || e.key === 'Backspace') e.preventDefault();
}
function moveSelection(dx, dy) {
  if (state.selected == null) { state.selected = 40; render(); return; }
  const c = Math.min(8, Math.max(0, colOf(state.selected) + dx));
  const r = Math.min(8, Math.max(0, rowOf(state.selected) + dy));
  state.selected = r * 9 + c;
  render();
}
function togglePencil() {
  state.pencil = !state.pencil;
  updatePencilLabel();
}

// ---------- Avvio ----------
async function init() {
  language = getSiteLanguage() || 'it';
  try { checkErrors = localStorage.getItem('sudopoku-check-errors') !== '0'; } catch (e) { /* ignora */ }

  buildBoard();
  buildKeypad();
  applyTranslations();
  layout();
  render();
  updateHUD();

  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 250));
  window.addEventListener('keydown', onKeyDown);

  // il tocco sulla scritta si ferma qui: se salisse fino alla griglia, lo stesso
  // dito farebbe ripartire il cronometro E sceglierebbe una casella
  els.resumeHint.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    resumePlay();
  });

  document.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => startNewGame(btn.dataset.difficulty));
  });

  els.pencilBtn.addEventListener('click', togglePencil);
  els.eraseBtn.addEventListener('click', eraseCell);
  els.undoBtn.addEventListener('click', undo);
  els.hintBtn.addEventListener('click', useHint);

  els.pauseBtn.addEventListener('click', openPause);
  // ↻ in barra: schema nuovo, chiedendo conferma. Fuori da una partita porta
  // alla scelta della difficoltà, come il ⏸.
  els.topRestartBtn.addEventListener('click', () => {
    if (!state.difficulty || state.solved) { els.difficultyOverlay.classList.add('show'); return; }
    state.paused = true;
    updateHUD();
    tornaAllaPausa = false;
    els.confirmOverlay.classList.add('show');
  });
  els.resumeBtn.addEventListener('click', closePause);
  els.pauseOverlay.addEventListener('click', (e) => {
    if (e.target === els.pauseOverlay) closePause();
  });
  // "schema nuovo" a metà partita: si chiede conferma, che buttare via
  // mezz'ora di ragionamenti per un tocco storto sarebbe una brutta sorpresa
  els.restartBtn.addEventListener('click', () => {
    els.pauseOverlay.classList.remove('show');
    tornaAllaPausa = true;
    els.confirmOverlay.classList.add('show');
  });
  els.confirmNewBtn.addEventListener('click', () => {
    els.confirmOverlay.classList.remove('show');
    startNewGame(state.difficulty);
  });
  // "no, continuo": si torna da dove si era arrivati — dal pannello di pausa se
  // era aperto lui, direttamente allo schema se si era passati dal ↻ in barra
  els.cancelNewBtn.addEventListener('click', () => {
    els.confirmOverlay.classList.remove('show');
    if (tornaAllaPausa) els.pauseOverlay.classList.add('show'); else resumePlay();
  });
  els.againBtn.addEventListener('click', () => {
    els.winOverlay.classList.remove('show');
    startNewGame(state.difficulty);
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

  els.toggleCheckBtn.addEventListener('click', toggleCheckErrors);

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

  // uscendo dalla pagina (o cambiando scheda) si mette in pausa e si salva: sul
  // telefono è il caso più comune di "chiudo e riapro dopo"
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (isPlaying()) { state.paused = true; els.pauseOverlay.classList.add('show'); }
      flushSave();
    }
  });
  window.addEventListener('pagehide', flushSave);

  startClock();

  // primo avvio: tutorial, poi scelta della difficoltà. Altrimenti si riprende
  // lo schema salvato. Il progresso va caricato SEMPRE, anche mostrando il
  // tutorial: 'sudopoku-tutorial-seen' è una chiave locale del dispositivo, e su
  // un secondo dispositivo il tutorial ricompare anche a chi ha già un account
  // con dei progressi nel cloud.
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('sudopoku-tutorial-seen'); } catch (e) { /* ignora */ }
  const saved = await loadSudopokuProgress();
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

// La X dei pannelli (shared/modal-x.js) chiude e basta: qui va rimesso in moto
// il cronometro, perché aprire un pannello lo aveva fermato.
window.FFR_ON_MODAL_CLOSE = function (id) {
  // il tutorial del primo avvio è l'unico che ha qualcosa dietro di sé: chiuso
  // con la X salterebbe il pezzo che sceglie fra riprendere lo schema salvato e
  // chiedere la difficoltà, e si resterebbe davanti a una griglia vuota
  if (id === 'tutorialOverlay' && state.difficulty == null) {
    try { localStorage.setItem('sudopoku-tutorial-seen', '1'); } catch (e) { /* ignora */ }
    if (pendingResume) {
      const saved = pendingResume;
      pendingResume = null;
      resumeFromSaved(saved);
    } else {
      els.difficultyOverlay.classList.add('show');
    }
    return;
  }
  const resumes = ['pauseOverlay', 'settingsOverlay', 'tutorialOverlay', 'languageOverlay', 'leaderboardOverlay', 'confirmOverlay'];
  if (resumes.indexOf(id) !== -1) resumePlay();
};
