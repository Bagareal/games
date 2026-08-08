/* ============ KAKUMAL — motore di gioco ============
   Somme incrociate: in ogni tratto di caselle bianche vanno cifre da 1 a 9, mai
   due volte la stessa, e insieme devono fare la somma scritta sul muro — quella
   in alto a destra vale per il tratto che va a destra, quella in basso a
   sinistra per il tratto che scende.

   Gli schemi si fabbricano qui dentro, nel telefono, senza chiedere niente a
   nessun server: il sito deve funzionare anche senza connessione. Il pezzo che
   li fabbrica sta in puzzle.js e gira in disparte (worker.js) per non tenere
   ferma la pagina. */

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
    showCombos: 'Mostra le combinazioni',
    on: 'ACCESO',
    off: 'SPENTO',
    close: 'Chiudi',
    pencil: 'Matita',
    erase: 'Cancella',
    undo: 'Annulla',
    hint: 'Aiuto',
    tapToContinue: 'Tocca per continuare',
    preparing: 'Preparo lo schema…',
    clueIn: 'in',
    pickCell: 'Tocca una casella bianca',
    tutorialTitle: 'Come si gioca',
    tutorialGoal: 'Ogni fila di caselle bianche vuole cifre da 1 a 9, mai due volte la stessa, che sommate facciano il numero scritto sul muro da cui parte.',
    tutorialClues: 'Il numero in alto a destra è la somma della fila che va a destra, quello in basso a sinistra della fila che scende',
    tutorialTap: 'Tocca una casella bianca, poi la cifra da scriverci',
    tutorialCombos: 'Sotto lo schema, per la casella scelta, ci sono le due somme e i gruppi di cifre che possono farle: 16 in due caselle è per forza 7+9. Si possono spegnere dalle impostazioni, se si preferisce farli a mente',
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
    showCombos: 'Show combinations',
    on: 'ON',
    off: 'OFF',
    close: 'Close',
    pencil: 'Pencil',
    erase: 'Erase',
    undo: 'Undo',
    hint: 'Hint',
    tapToContinue: 'Tap to continue',
    preparing: 'Building the puzzle…',
    clueIn: 'in',
    pickCell: 'Tap a white square',
    tutorialTitle: 'How to play',
    tutorialGoal: 'Every line of white squares takes digits from 1 to 9, never the same one twice, adding up to the number written on the wall it starts from.',
    tutorialClues: 'The number at the top right is the total of the line going right, the one at the bottom left of the line going down',
    tutorialTap: 'Tap a white square, then the digit to write in it',
    tutorialCombos: 'Below the puzzle, for the square you picked, you get its two totals and the sets of digits that can make them: 16 in two squares can only be 7+9. You can switch them off in the settings if you would rather work them out yourself',
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
    showCombos: 'Montrer les combinaisons',
    on: 'ACTIVÉ',
    off: 'DÉSACTIVÉ',
    close: 'Fermer',
    pencil: 'Crayon',
    erase: 'Gommer',
    undo: 'Annuler',
    hint: 'Aide',
    tapToContinue: 'Touche pour continuer',
    preparing: 'Je prépare la grille…',
    clueIn: 'en',
    pickCell: 'Touche une case blanche',
    tutorialTitle: 'Comment jouer',
    tutorialGoal: 'Chaque file de cases blanches veut des chiffres de 1 à 9, jamais deux fois le même, dont la somme fait le nombre écrit sur le mur d\'où elle part.',
    tutorialClues: 'Le nombre en haut à droite est la somme de la file qui va à droite, celui en bas à gauche de la file qui descend',
    tutorialTap: 'Touche une case blanche, puis le chiffre à y écrire',
    tutorialCombos: 'Sous la grille, pour la case choisie, il y a ses deux sommes et les groupes de chiffres qui peuvent les faire : 16 en deux cases, c\'est forcément 7+9. On peut les éteindre dans les paramètres, si on préfère les trouver de tête',
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
  updateCombosLabel();
  updatePencilLabel();
  renderClueBar();
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
// La griglia cresce con la difficoltà: 7×7, 9×9, 11×11 contando la prima riga e
// la prima colonna, che sono muro e portano le somme. `wallProb` è quanto è
// fitto il muro dentro: più muri, tratti più corti, ragionamento più corto.
// `base` è il punteggio pieno prima delle penalità — uno schema difficile vale
// di più perché costa di più, e comunque ogni difficoltà ha la sua classifica,
// quindi non si confrontano mai fra loro.
const DIFFICULTIES = {
  easy: { n: 7, wallProb: 0.38, minOpen: 22, moves: 6000, hot: 4, cold: 0.25, tries: 14, base: 1000 },
  medium: { n: 9, wallProb: 0.42, minOpen: 40, moves: 9000, hot: 4, cold: 0.25, tries: 14, base: 2000 },
  hard: { n: 11, wallProb: 0.48, minOpen: 58, moves: 12000, hot: 4, cold: 0.25, tries: 14, base: 3500 },
};
const MAX_HINTS = 3;
const HINT_COST = 100;
const ERROR_COST = 50;
const TIME_COST = 2;      // punti persi per ogni secondo
const MIN_POINTS = 100;   // risolvere vale sempre qualcosa

// ---------- Da dove arrivano gli schemi ----------
// Fabbricarne uno costa da un decimo di secondo a un paio: dentro alla pagina
// vorrebbe dire tenere fermo il telefono per tutto quel tempo, quindi il lavoro
// va a un lavorante che sta per conto suo. Se il browser non li sa fare, o il
// file non parte, si fabbrica qui e pazienza per l'attesa: meglio un momento
// di attesa che nessuno schema.
let worker = null;
let workerBroken = false;
let nextRequestId = 1;
const pendingRequests = {};
function getWorker() {
  if (workerBroken) return null;
  if (worker) return worker;
  try {
    worker = new Worker('worker.js');
    worker.onmessage = (e) => {
      const msg = e.data || {};
      const cb = pendingRequests[msg.id];
      delete pendingRequests[msg.id];
      if (cb) cb(msg.puzzle);
    };
    worker.onerror = () => {
      // il lavorante non è partito: da qui in avanti si fa tutto in casa, e le
      // richieste rimaste appese vanno servite lo stesso
      workerBroken = true;
      worker = null;
      const waiting = Object.keys(pendingRequests);
      waiting.forEach(id => {
        const cb = pendingRequests[id];
        delete pendingRequests[id];
        cb(null);
      });
    };
  } catch (e) {
    workerBroken = true;
    worker = null;
  }
  return worker;
}
// Chiede uno schema e lo consegna a `done`. Non torna mai a mani vuote: se il
// lavorante non c'è o non ce la fa, ci pensa la pagina.
function askPuzzle(difficultyKey, done) {
  const cfg = DIFFICULTIES[difficultyKey];
  const w = getWorker();
  if (!w) { done(makeHere(cfg)); return; }
  const id = nextRequestId++;
  pendingRequests[id] = (puzzle) => done(puzzle || makeHere(cfg));
  w.postMessage({ id: id, cfg: cfg });
}
function makeHere(cfg) {
  let puzzle = null;
  try { puzzle = window.KAKUMAL.makePuzzle(cfg); } catch (e) { puzzle = null; }
  return puzzle;
}

// Lo schema successivo si prepara mentre si gioca a quello di adesso, così chi
// chiede di ricominciare non aspetta niente.
const readyPuzzles = { easy: null, medium: null, hard: null };
let prefetchTimer = null;
function prefetch(difficultyKey) {
  clearTimeout(prefetchTimer);
  prefetchTimer = setTimeout(() => {
    if (readyPuzzles[difficultyKey]) return;
    askPuzzle(difficultyKey, (puzzle) => { readyPuzzles[difficultyKey] = puzzle; });
  }, 1200);
}

// ---------- Lo schema in forma comoda ----------
// Di uno schema bastano tre cose: quanto è grande, quali caselle sono bianche e
// la soluzione. Le somme sui muri e i tratti si rifanno da lì — così quello che
// si salva resta corto e c'è un solo modo di ricostruire uno schema, che venga
// dal generatore o da una partita lasciata a metà.
function shape(n, open, solution) {
  const info = window.KAKUMAL.buildRuns(Uint8Array.from(open), n);
  const across = new Array(n * n).fill(0);
  const down = new Array(n * n).fill(0);
  info.runs.forEach(run => {
    let sum = 0;
    run.cells.forEach(i => { sum += solution[i]; });
    run.sum = sum;
    if (run.horizontal) across[run.clue] = sum; else down[run.clue] = sum;
  });
  return {
    n: n,
    open: open,
    solution: solution,
    across: across,
    down: down,
    runs: info.runs,
    hRun: Array.from(info.hRun),
    vRun: Array.from(info.vRun),
  };
}

// ---------- Stato ----------
const state = {
  difficulty: null,
  board: null,                      // lo schema in forma comoda (vedi shape)
  entries: [],                      // quello che ci ha scritto chi gioca
  notes: [],                        // appunti, una maschera di bit per casella
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
let history = [];           // per l'annulla: vale per la sessione, non si salva
// Tutorial del primo avvio: si chiude solo con "Ho capito!". Un dito appoggiato
// sullo sfondo non deve farlo sparire, perché quel tocco lo segnerebbe anche
// come "già visto" e chi apre il gioco per la prima volta resterebbe senza
// istruzioni senza nemmeno accorgersene.
let tutorialPrimoAvvio = false;
let checkErrors = true;     // segnalare gli sbagli appena si scrivono
let showCombos = true;      // i gruppi di cifre che fanno la somma

const els = {
  loading: document.getElementById('loadingScreen'),
  board: document.getElementById('board'),
  boardFrame: document.getElementById('boardFrame'),
  gameZone: document.getElementById('gameZone'),
  keypad: document.getElementById('keypad'),
  resumeHint: document.getElementById('resumeHint'),
  buildingHint: document.getElementById('buildingHint'),
  clueBar: document.getElementById('clueBar'),
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
  toggleCombosBtn: document.getElementById('toggleCombosBtn'),
  combosState: document.getElementById('combosState'),
};

let cellEls = [];
let digitEls = [];
let noteEls = [];
const keyEls = [];

function isOpen(i) { return !!(state.board && state.board.open[i]); }
function valueAt(i) { return state.entries[i] || 0; }
function isPlaying() { return state.board != null && !state.paused && !state.solved; }

// ---------- Costruzione della griglia ----------
// La griglia si rifà da capo a ogni schema nuovo: cambia la misura fra una
// difficoltà e l'altra, e i muri non stanno mai nello stesso posto.
function buildBoard() {
  const b = state.board;
  cellEls = [];
  digitEls = [];
  noteEls = [];
  els.board.innerHTML = '';
  els.board.style.setProperty('--n', b.n);
  const frag = document.createDocumentFragment();
  for (let i = 0; i < b.n * b.n; i++) {
    const cell = document.createElement('div');
    if (b.open[i]) {
      cell.className = 'kk-cell';
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
      digitEls.push(digit);
      noteEls.push(spans);
    } else {
      cell.className = 'kk-wall';
      const hasClue = b.across[i] || b.down[i];
      if (hasClue) {
        cell.classList.add('has-clue');
        const slash = document.createElement('span');
        slash.className = 'slash';
        cell.appendChild(slash);
        if (b.across[i]) {
          const a = document.createElement('span');
          a.className = 'clue-across';
          a.textContent = b.across[i];
          cell.appendChild(a);
        }
        if (b.down[i]) {
          const d = document.createElement('span');
          d.className = 'clue-down';
          d.textContent = b.down[i];
          cell.appendChild(d);
        }
      }
      digitEls.push(null);
      noteEls.push(null);
    }
    cellEls.push(cell);
    frag.appendChild(cell);
  }
  els.board.appendChild(frag);
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
  if (!state.board) return;
  const n = state.board.n;
  const cs = getComputedStyle(els.gameZone);
  const w = els.gameZone.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const h = els.gameZone.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const avail = Math.min(w, h);
  if (avail <= 0) return;
  // multiplo di n più vicino: così le caselle sono tutte identiche e le righe
  // della griglia non ballano di mezzo pixel una rispetto all'altra
  const cell = Math.max(16, Math.floor((avail - 4) / n));
  els.boardFrame.style.setProperty('--board', (cell * n + 4) + 'px');
  els.boardFrame.style.setProperty('--cell', cell + 'px');
}

// ---------- Disegno ----------
function render() {
  const b = state.board;
  if (!b) return;
  const sel = state.selected;
  const selValue = sel == null ? 0 : valueAt(sel);
  const selH = sel == null ? -1 : b.hRun[sel];
  const selV = sel == null ? -1 : b.vRun[sel];
  for (let i = 0; i < b.n * b.n; i++) {
    if (!b.open[i]) continue;
    const cell = cellEls[i];
    const v = valueAt(i);
    digitEls[i].textContent = v ? String(v) : '';

    const notes = (!v && state.notes[i]) ? state.notes[i] : 0;
    const spans = noteEls[i];
    for (let d = 1; d <= 9; d++) {
      spans[d - 1].textContent = (notes & (1 << (d - 1))) ? String(d) : '';
    }

    cell.classList.toggle('wrong', checkErrors && v !== 0 && v !== b.solution[i]);
    const isSel = i === sel;
    cell.classList.toggle('sel', isSel);
    // le due file a cui appartiene la casella scelta: sono quelle su cui si sta
    // ragionando, e a schema pieno di numeri non si ritroverebbero a occhio
    cell.classList.toggle('peer', !isSel && (b.hRun[i] === selH || b.vRun[i] === selV));
    cell.classList.toggle('same', !isSel && selValue !== 0 && v === selValue);
  }
  renderRunsDone();
  renderClueBar();
}
// I muri delle file già completate si smorzano: è il modo naturale di vedere
// quanto manca senza contare le caselle una per una.
function renderRunsDone() {
  const b = state.board;
  b.runs.forEach(run => {
    let sum = 0, mask = 0, filled = 0;
    run.cells.forEach(i => {
      const v = valueAt(i);
      if (!v) return;
      filled++;
      sum += v;
      mask |= 1 << (v - 1);
    });
    const complete = filled === run.cells.length && sum === run.sum &&
      countBits(mask) === run.cells.length;
    const clue = cellEls[run.clue];
    if (!clue) return;
    clue.classList.toggle(run.horizontal ? 'across-done' : 'down-done', complete);
  });
}
function countBits(m) {
  let n = 0;
  while (m) { m &= m - 1; n++; }
  return n;
}
// La barra sotto lo schema: le due somme della casella scelta e, se accese, i
// gruppi di cifre che possono ancora farle. È l'appunto che si terrebbe a mente
// giocando su carta.
function renderClueBar() {
  const b = state.board;
  const sel = state.selected;
  if (!b || sel == null || !b.open[sel]) {
    els.clueBar.innerHTML = `<div class="clue-empty">${escapeHtml(t().pickCell)}</div>`;
    return;
  }
  els.clueBar.innerHTML =
    clueLine(b.runs[b.hRun[sel]], 'arrow-right') +
    clueLine(b.runs[b.vRun[sel]], 'arrow-down');
  window.FFR.icons(els.clueBar);
}
function clueLine(run, icon) {
  let placed = 0;
  let missing = 0;
  run.cells.forEach(i => {
    const v = valueAt(i);
    if (v) placed |= window.KAKUMAL.bit(v);
    else missing++;
  });
  let combos = '';
  if (showCombos && missing > 0) {
    const list = window.KAKUMAL.combosFor(run.cells.length, run.sum, placed);
    combos = list.map(group => `<span class="combo">${group.join('+')}</span>`).join('');
  }
  return `
    <div class="clue-line">
      <span class="ffr-ico clue-dir" data-ico="${icon}"></span>
      <span class="clue-sum">${run.sum}</span>
      <span class="clue-in">${escapeHtml(t().clueIn)}</span>
      <span class="clue-len">${run.cells.length}</span>
      <span class="clue-combos">${combos}</span>
    </div>`;
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
function updateCombosLabel() {
  els.combosState.textContent = showCombos ? t().on : t().off;
}

// ---------- Mosse ----------
function onBoardClick(e) {
  const cell = e.target.closest('.kk-cell');
  if (!cell || !isPlaying()) return;
  const i = cellEls.indexOf(cell);
  if (i === -1) return;
  state.selected = (state.selected === i) ? null : i;
  render();
}

// Ogni modifica di una casella passa da qui, così l'annulla ha sempre di che
// tornare indietro senza doversene ricordare in dieci punti diversi.
function pushHistory(i) {
  history.push({ i: i, value: state.entries[i], notes: state.notes[i] });
  if (history.length > 200) history.shift();
}
function writeDigit(d) {
  const i = state.selected;
  if (i == null || !isPlaying() || !isOpen(i)) return;
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
    if (d !== state.board.solution[i]) state.errors += 1;
    else clearNotesAround(i, d);
  }
  afterMove();
}
// cifra scritta giusta: l'appunto con quella cifra sparisce dalle due file a cui
// la casella appartiene, che è la prima cosa che si farebbe a mano con la gomma
function clearNotesAround(i, d) {
  const b = state.board;
  const bit = 1 << (d - 1);
  b.runs[b.hRun[i]].cells.forEach(j => { state.notes[j] &= ~bit; });
  b.runs[b.vRun[i]].cells.forEach(j => { state.notes[j] &= ~bit; });
}
function eraseCell() {
  const i = state.selected;
  if (i == null || !isPlaying() || !isOpen(i)) return;
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
  const b = state.board;
  let i = state.selected;
  if (i == null || !b.open[i] || valueAt(i) !== 0) {
    const empty = [];
    for (let k = 0; k < b.n * b.n; k++) if (b.open[k] && !valueAt(k)) empty.push(k);
    if (!empty.length) return;
    i = empty[Math.floor(Math.random() * empty.length)];
  }
  pushHistory(i);
  state.entries[i] = b.solution[i];
  state.notes[i] = 0;
  state.hints += 1;
  state.selected = i;
  clearNotesAround(i, b.solution[i]);
  // il lampo dice quale casella è stata scoperta, che a schema pieno di numeri
  // non si troverebbe più
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
  const b = state.board;
  for (let i = 0; i < b.n * b.n; i++) {
    if (b.open[i] && valueAt(i) !== b.solution[i]) return false;
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

// ---------- Scelta della difficoltà ----------
// Scegliere una difficoltà vuol dire cominciare uno schema nuovo, quindi buttare
// via quello a metà: si chiede conferma, come per il ↻ in barra. Vale sia dal
// pannello di pausa sia dalle impostazioni — due pulsanti identici non possono
// comportarsi in due modi diversi. Scegliere la difficoltà su cui si sta già
// giocando non butta via niente: chiude il pannello e basta.
let pendingDifficulty = null;   // scelta in attesa di conferma
let confirmReturnTo = null;     // dove tornare se si risponde "no": 'pause' | 'settings' | null
function chooseDifficulty(difficultyKey, from) {
  if (state.board && !state.solved) {
    if (difficultyKey === state.difficulty) {
      if (from === 'settings') closeSettingsMenu();
      else if (from === 'pause') closePause();
      return;
    }
    pendingDifficulty = difficultyKey;
    confirmReturnTo = from;
    hideAllOverlays();
    state.paused = true;
    updateHUD();
    els.confirmOverlay.classList.add('show');
    return;
  }
  pendingDifficulty = null;
  confirmReturnTo = null;
  startNewGame(difficultyKey);
}

// ---------- Partita ----------
function startNewGame(difficultyKey) {
  if (state.board && !state.solved) saveProgress();
  hideAllOverlays();
  hideResumeHint();
  const ready = readyPuzzles[difficultyKey];
  readyPuzzles[difficultyKey] = null;
  if (ready) { installPuzzle(difficultyKey, ready); return; }
  // schema non ancora pronto: si dice che lo si sta preparando, invece di
  // lasciare la griglia vuota e muta
  state.paused = true;
  showBuildingHint();
  askPuzzle(difficultyKey, (puzzle) => {
    hideBuildingHint();
    if (!puzzle) { els.difficultyOverlay.classList.add('show'); return; }
    installPuzzle(difficultyKey, puzzle);
  });
}
function installPuzzle(difficultyKey, puzzle) {
  state.difficulty = difficultyKey;
  state.board = shape(puzzle.n, puzzle.open.slice(), puzzle.solution.slice());
  state.entries = new Array(puzzle.n * puzzle.n).fill(0);
  state.notes = new Array(puzzle.n * puzzle.n).fill(0);
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
  hideBuildingHint();
  state.paused = false;
  buildBoard();
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
  if (!run || !run.open || run.solved) {
    // niente da riprendere (o era già risolto): schema nuovo su quella
    // difficoltà, e il record resta perché installPuzzle lo rilegge da byDifficulty
    startNewGame(key);
    return;
  }
  state.difficulty = key;
  state.board = shape(run.n, run.open.slice(), run.solution.slice());
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
  buildBoard();
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
function showBuildingHint() {
  els.buildingHint.classList.remove('hidden');
}
function hideBuildingHint() {
  els.buildingHint.classList.add('hidden');
}
function anyOverlayOpen() {
  return !!document.querySelector('.overlay.show');
}
// unico punto da cui la partita riparte
function resumePlay() {
  hideResumeHint();
  if (state.board && !state.solved) state.paused = false;
  updateHUD();
}

// ---------- Overlay ----------
function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('show'));
}
function openPause() {
  if (!state.board || state.solved) { els.difficultyOverlay.classList.add('show'); return; }
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
  if (state.board && !state.solved) { state.paused = true; updateHUD(); }
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
  try { localStorage.setItem('kakumal-tutorial-seen', '1'); } catch (e) { /* ignora */ }
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
  try { localStorage.setItem('kakumal-check-errors', checkErrors ? '1' : '0'); } catch (e) { /* ignora */ }
  updateCheckLabel();
  render();
}
function toggleCombos() {
  showCombos = !showCombos;
  try { localStorage.setItem('kakumal-show-combos', showCombos ? '1' : '0'); } catch (e) { /* ignora */ }
  updateCombosLabel();
  renderClueBar();
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
  const gameKey = 'kakumal:' + difficultyKey;
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
// Uno schema per difficoltà, tutti dentro la stessa riga 'kakumal'. La classifica
// invece vuole un punteggio separato per difficoltà, quindi ognuna ha anche la
// sua voce 'kakumal:<difficoltà>' (vedi saveScore in shared/auth.js).
//
// Dello schema si salvano solo le caselle bianche e la soluzione, come stringhe:
// le somme sui muri e i tratti si rifanno da lì (vedi `shape`), e non c'è modo
// che quello che si rilegge non torni con quello che si vede.
function encodeDigits(list) {
  return list.map(v => String(v || 0)).join('');
}
function decodeDigits(str, length) {
  if (typeof str !== 'string' || str.length !== length) return null;
  const out = [];
  for (let i = 0; i < length; i++) {
    const n = str.charCodeAt(i) - 48;
    if (n < 0 || n > 9) return null;
    out.push(n);
  }
  return out;
}
function snapshotCurrentRun() {
  const b = state.board;
  return {
    n: b.n,
    open: b.open.map(v => (v ? 1 : 0)).join(''),
    solution: encodeDigits(b.solution),
    entries: encodeDigits(state.entries),
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
  if (state.difficulty == null || !state.board) return;
  state.byDifficulty[state.difficulty] = snapshotCurrentRun();
  const bestOverall = Object.keys(state.byDifficulty)
    .reduce((m, k) => Math.max(m, state.byDifficulty[k].best || 0), 0);
  window.FFR.auth.saveProgress('kakumal', {
    v: 1,
    current: state.difficulty,
    byDifficulty: state.byDifficulty,
  }, bestOverall);
  window.FFR.auth.saveScore('kakumal:' + state.difficulty, state.best);
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
async function loadKakumalProgress() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return normalizeSaved(await window.FFR.auth.loadProgress('kakumal'));
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
    const n = run.n;
    const size = (typeof n === 'number' && n >= 5 && n <= 15) ? n * n : 0;
    const open = size ? decodeDigits(run.open, size) : null;
    const solution = size ? decodeDigits(run.solution, size) : null;
    const entries = size ? decodeDigits(run.entries, size) : null;
    const notes = (size && Array.isArray(run.notes) && run.notes.length === size)
      ? run.notes.map(v => (typeof v === 'number' && v >= 0 && v < 512) ? v : 0)
      : new Array(size || 0).fill(0);
    const usable = !!(open && solution && entries);
    out.byDifficulty[key] = {
      n: n,
      open: usable ? open : null,
      solution: usable ? solution : null,
      entries: usable ? entries : null,
      notes: notes,
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
    if (state.board && !state.solved) {
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
// Le frecce saltano i muri: si va alla prima casella bianca in quella direzione,
// perché fermarsi su un muro vorrebbe dire non poter più scrivere niente.
function moveSelection(dx, dy) {
  const b = state.board;
  if (!b) return;
  if (state.selected == null) {
    for (let i = 0; i < b.n * b.n; i++) if (b.open[i]) { state.selected = i; break; }
    render();
    return;
  }
  let c = state.selected % b.n;
  let r = Math.floor(state.selected / b.n);
  for (let step = 0; step < b.n; step++) {
    c += dx; r += dy;
    if (c < 1 || c >= b.n || r < 1 || r >= b.n) return;
    const i = r * b.n + c;
    if (b.open[i]) { state.selected = i; render(); return; }
  }
}
function togglePencil() {
  state.pencil = !state.pencil;
  updatePencilLabel();
}

// ---------- Avvio ----------
async function init() {
  language = getSiteLanguage() || 'it';
  try { checkErrors = localStorage.getItem('kakumal-check-errors') !== '0'; } catch (e) { /* ignora */ }
  try { showCombos = localStorage.getItem('kakumal-show-combos') !== '0'; } catch (e) { /* ignora */ }

  buildKeypad();
  applyTranslations();
  updateHUD();

  els.board.addEventListener('click', onBoardClick);
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

  // dal pannello di partenza non c'è niente da perdere: si parte e basta.
  // Dalla pausa e dalle impostazioni invece una partita in corso c'è, e va
  // chiesto prima di buttarla.
  document.querySelectorAll('#difficultyOverlay .difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => startNewGame(btn.dataset.difficulty));
  });
  document.querySelectorAll('#pauseOverlay .difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => chooseDifficulty(btn.dataset.difficulty, 'pause'));
  });
  document.querySelectorAll('#settingsOverlay .difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => chooseDifficulty(btn.dataset.difficulty, 'settings'));
  });

  els.pencilBtn.addEventListener('click', togglePencil);
  els.eraseBtn.addEventListener('click', eraseCell);
  els.undoBtn.addEventListener('click', undo);
  els.hintBtn.addEventListener('click', useHint);

  els.pauseBtn.addEventListener('click', openPause);
  // ↻ in barra: schema nuovo, chiedendo conferma. Fuori da una partita porta
  // alla scelta della difficoltà, come il ⏸.
  els.topRestartBtn.addEventListener('click', () => {
    if (!state.board || state.solved) { els.difficultyOverlay.classList.add('show'); return; }
    state.paused = true;
    updateHUD();
    pendingDifficulty = null;      // stessa difficoltà, solo uno schema nuovo
    confirmReturnTo = null;
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
    pendingDifficulty = null;
    confirmReturnTo = 'pause';
    els.confirmOverlay.classList.add('show');
  });
  els.confirmNewBtn.addEventListener('click', () => {
    els.confirmOverlay.classList.remove('show');
    const key = pendingDifficulty || state.difficulty;
    pendingDifficulty = null;
    confirmReturnTo = null;
    startNewGame(key);
  });
  // "no, continuo": si torna da dove si era arrivati — dal pannello che aveva
  // fatto la domanda, o direttamente allo schema se si era passati dal ↻ in barra
  els.cancelNewBtn.addEventListener('click', () => {
    els.confirmOverlay.classList.remove('show');
    pendingDifficulty = null;
    if (confirmReturnTo === 'pause') els.pauseOverlay.classList.add('show');
    else if (confirmReturnTo === 'settings') els.settingsOverlay.classList.add('show');
    else resumePlay();
    confirmReturnTo = null;
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
  els.toggleCombosBtn.addEventListener('click', toggleCombos);

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
  // tutorial: 'kakumal-tutorial-seen' è una chiave locale del dispositivo, e su
  // un secondo dispositivo il tutorial ricompare anche a chi ha già un account
  // con dei progressi nel cloud.
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('kakumal-tutorial-seen'); } catch (e) { /* ignora */ }
  const saved = await loadKakumalProgress();
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
    try { localStorage.setItem('kakumal-tutorial-seen', '1'); } catch (e) { /* ignora */ }
    if (pendingResume) {
      const saved = pendingResume;
      pendingResume = null;
      resumeFromSaved(saved);
    } else {
      els.difficultyOverlay.classList.add('show');
    }
    return;
  }
  if (id === 'confirmOverlay') { pendingDifficulty = null; confirmReturnTo = null; }
  const resumes = ['pauseOverlay', 'settingsOverlay', 'tutorialOverlay', 'languageOverlay', 'leaderboardOverlay', 'confirmOverlay'];
  if (resumes.indexOf(id) !== -1) resumePlay();
};
