/* ============ FINDY — motore di gioco ============
   Parole nascoste dentro una griglia di lettere: si trascina il dito dalla
   prima all'ultima lettera, e la parola trovata resta sotto una passata di
   evidenziatore.

   Regole di questo gioco, decise con Ivan:
   - livelli infiniti, niente tempo, niente difficoltà da scegliere: la
     difficoltà sale da sola allargando la griglia e aumentando le parole, fino
     a un tetto — non deve mai diventare impossibile;
   - le parole vanno in tutte e otto le direzioni fin dal primo livello,
     diagonali e rovesciate comprese;
   - minimo quattro lettere, e solo parole che la gente usa davvero (vedi
     words/build_words.py);
   - una lingua per volta, con livello e classifica separati per lingua, come
     in Wordio.

   Le griglie si fabbricano qui dentro, nel telefono, senza chiedere niente a
   nessun server: il sito deve funzionare anche senza connessione. */

// ---------- Lingua ----------
const LANGUAGES = {
  it: { label: 'Italiano', flag: 'flag-it' },
  en: { label: 'English', flag: 'flag-en' },
  fr: { label: 'Français', flag: 'flag-fr' },
};
// "ffr-language" è la lingua del sito, condivisa con la home e con tutti gli
// altri giochi. Findy, come Wordio, ha anche una chiave sua: qui la lingua non
// è l'etichetta dei pulsanti, sono le parole da cercare — chi si allena con
// l'inglese non deve per questo ritrovarsi la home e gli altri giochi in
// inglese. La regola è: si eredita la lingua del sito finché non la si cambia
// da qui; da quel momento Findy va per conto suo.
const SITE_LANGUAGE_KEY = 'ffr-language';
const GAME_LANGUAGE_KEY = 'ffr-language:findy';

const UI_STRINGS = {
  it: {
    tagline: 'Trova le parole nascoste',
    hint: 'Aiuto',
    levelComplete: 'Livello completato!',
    winSub: (level, words) => `Livello ${level} · ${words} parole trovate`,
    continueBtn: 'Continua',
    settingsTitle: 'Impostazioni',
    darkMode: 'Modalità scura',
    languageMenuLabel: 'Lingua',
    commands: 'Istruzioni',
    leaderboardMenuLabel: 'Classifica',
    leaderboardTitle: 'Classifica',
    leaderboardSub: 'Una classifica per ogni lingua: si vede quella con cui stai giocando.',
    leaderboardEmpty: 'Nessun punteggio ancora: gioca da loggato per essere il primo!',
    languageTitle: 'Lingua',
    languageSub: 'Scegli la lingua delle parole',
    languageOnlyHere: 'Vale solo per Findy: la lingua del resto del sito non cambia.',
    languageChangeTitle: 'Cambiare lingua?',
    languageConfirmText: name => `Passare a ${name}? Si comincerà dal livello 1.`,
    languageConfirmResumeText: (name, level) => `Passare a ${name}? Riprenderai dal livello ${level}.`,
    close: 'Chiudi',
    cancel: 'Annulla',
    confirm: 'Conferma',
    confirmRestartTitle: 'Livello nuovo?',
    confirmRestartSub: 'Questo livello viene rifatto con parole nuove. Il numero del livello resta questo.',
    confirmYes: 'Sì, rifallo',
    confirmNo: 'No, continuo',
    tutorialTitle: 'Come si gioca',
    tutorialGoal: 'Nella griglia sono nascoste le parole scritte qui sotto: trovale tutte per passare al livello dopo.',
    tutorialDrag: "Trascina il dito dalla prima all'ultima lettera della parola. Si può anche toccare la prima lettera e poi l'ultima.",
    tutorialDirections: 'Le parole vanno in tutte le direzioni: in orizzontale, in verticale, in diagonale, e anche al contrario.',
    tutorialHint: 'Si possono usare tre aiuti per livello: fanno lampeggiare la prima lettera di una parola che manca.',
    tutorialRestart: 'Il tasto ↻ rifà il livello con parole nuove, senza tornare indietro di livello.',
    gotIt: 'Ho capito!',
    noHints: 'Aiuti finiti per questo livello',
    allFound: 'Sono già tutte trovate!',
    wordsError: 'Non riesco a caricare le parole',
  },
  en: {
    tagline: 'Find the hidden words',
    hint: 'Hint',
    levelComplete: 'Level complete!',
    winSub: (level, words) => `Level ${level} · ${words} words found`,
    continueBtn: 'Continue',
    settingsTitle: 'Settings',
    darkMode: 'Dark mode',
    languageMenuLabel: 'Language',
    commands: 'How to play',
    leaderboardMenuLabel: 'Leaderboard',
    leaderboardTitle: 'Leaderboard',
    leaderboardSub: 'One leaderboard per language: you see the one you are playing in.',
    leaderboardEmpty: 'No scores yet: play while logged in to be the first!',
    languageTitle: 'Language',
    languageSub: 'Choose the language of the words',
    languageOnlyHere: 'This is for Findy only: the rest of the site keeps its language.',
    languageChangeTitle: 'Change language?',
    languageConfirmText: name => `Switch to ${name}? You'll start from level 1.`,
    languageConfirmResumeText: (name, level) => `Switch to ${name}? You'll resume from level ${level}.`,
    close: 'Close',
    cancel: 'Cancel',
    confirm: 'Confirm',
    confirmRestartTitle: 'New grid?',
    confirmRestartSub: 'This level is rebuilt with new words. The level number stays the same.',
    confirmYes: 'Yes, rebuild it',
    confirmNo: 'No, keep playing',
    tutorialTitle: 'How to play',
    tutorialGoal: 'The words listed below are hidden in the grid: find them all to move on to the next level.',
    tutorialDrag: 'Drag your finger from the first letter of the word to the last one. You can also tap the first letter and then the last one.',
    tutorialDirections: 'Words run in every direction: across, down, diagonally, and backwards too.',
    tutorialHint: 'You can use three hints per level: they flash the first letter of a word you are still missing.',
    tutorialRestart: 'The ↻ button rebuilds the level with new words, without sending you back a level.',
    gotIt: 'Got it!',
    noHints: 'No hints left for this level',
    allFound: 'They are all found already!',
    wordsError: 'Could not load the words',
  },
  fr: {
    tagline: 'Trouve les mots cachés',
    hint: 'Aide',
    levelComplete: 'Niveau terminé !',
    winSub: (level, words) => `Niveau ${level} · ${words} mots trouvés`,
    continueBtn: 'Continuer',
    settingsTitle: 'Réglages',
    darkMode: 'Mode sombre',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Classement',
    leaderboardTitle: 'Classement',
    leaderboardSub: 'Un classement par langue : tu vois celui de la langue avec laquelle tu joues.',
    leaderboardEmpty: 'Aucun score pour le moment : joue en étant connecté pour être le premier !',
    languageTitle: 'Langue',
    languageSub: 'Choisis la langue des mots',
    languageOnlyHere: 'Valable seulement pour Findy : la langue du reste du site ne change pas.',
    languageChangeTitle: 'Changer de langue ?',
    languageConfirmText: name => `Passer à ${name} ? Tu recommenceras au niveau 1.`,
    languageConfirmResumeText: (name, level) => `Passer à ${name} ? Tu reprendras au niveau ${level}.`,
    close: 'Fermer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    confirmRestartTitle: 'Nouvelle grille ?',
    confirmRestartSub: 'Ce niveau est refait avec de nouveaux mots. Le numéro du niveau ne change pas.',
    confirmYes: 'Oui, refais-la',
    confirmNo: 'Non, je continue',
    tutorialTitle: 'Comment jouer',
    tutorialGoal: 'Les mots écrits en dessous sont cachés dans la grille : trouve-les tous pour passer au niveau suivant.',
    tutorialDrag: 'Fais glisser ton doigt de la première à la dernière lettre du mot. Tu peux aussi toucher la première lettre puis la dernière.',
    tutorialDirections: 'Les mots vont dans toutes les directions : à l\'horizontale, à la verticale, en diagonale, et aussi à l\'envers.',
    tutorialHint: 'Tu peux utiliser trois aides par niveau : elles font clignoter la première lettre d\'un mot qui manque.',
    tutorialRestart: 'Le bouton ↻ refait le niveau avec de nouveaux mots, sans te faire reculer d\'un niveau.',
    gotIt: "J'ai compris !",
    noHints: 'Plus d\'aides pour ce niveau',
    allFound: 'Ils sont déjà tous trouvés !',
    wordsError: 'Impossible de charger les mots',
  },
};

function t() { return UI_STRINGS[state.language] || UI_STRINGS.it; }
// NB: le traduzioni si applicano con textContent, che cancella qualsiasi HTML
// annidato: dentro un elemento con data-i18n non ci va mai un'icona.
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t()[el.dataset.i18n];
    if (typeof val === 'string') el.textContent = val;
  });
  document.documentElement.lang = state.language;
  if (window.FFR && window.FFR.auth && window.FFR.auth.refreshLabel) window.FFR.auth.refreshLabel();
}

function getSiteLanguage() {
  try {
    const v = localStorage.getItem(SITE_LANGUAGE_KEY);
    return v && LANGUAGES[v] ? v : null;
  } catch (e) { return null; }
}
function getGameLanguage() {
  try {
    const v = localStorage.getItem(GAME_LANGUAGE_KEY);
    return v && LANGUAGES[v] ? v : null;
  } catch (e) { return null; }
}
function setGameLanguage(code) {
  try { localStorage.setItem(GAME_LANGUAGE_KEY, code); } catch (e) { /* ignora */ }
}

// ---------- Le parole ----------
// words/<lingua>.json: solo l'elenco delle parole che il gioco può nascondere,
// da 4 a 8 lettere, accenti compresi. È un estratto dei dizionari di Wordio,
// fatto una volta sola da words/build_words.py — qui si carica un file da 55 kB
// invece del dizionario intero da più di un mega.
let WORDS_BY_LEN = {};   // lunghezza -> elenco di parole (maiuscole)
let FILLER_POOL = [];    // lettere per il riempimento, nelle proporzioni della lingua

async function loadWords(lang) {
  const res = await fetch(`words/${lang}.json`);
  if (!res.ok) throw new Error(`Impossibile caricare le parole "${lang}"`);
  const data = await res.json();
  const words = String(data.words || '').split(',').filter(Boolean);
  WORDS_BY_LEN = {};
  const counts = new Map();
  for (const raw of words) {
    const w = raw.toUpperCase();
    const chars = Array.from(w);
    (WORDS_BY_LEN[chars.length] = WORDS_BY_LEN[chars.length] || []).push(w);
    for (const ch of chars) counts.set(ch, (counts.get(ch) || 0) + 1);
  }
  // Il riempimento pesca dalle stesse proporzioni delle parole vere: in
  // italiano escono poche K e nessuna W, in francese ogni tanto una É — che è
  // il punto, se no una lettera accentata in mezzo alla griglia sarebbe un
  // indizio regalato ("qui passa una parola") senza doverla cercare.
  FILLER_POOL = [];
  let total = 0;
  for (const c of counts.values()) total += c;
  for (const [ch, c] of counts) {
    const n = Math.max(1, Math.round(c / total * 600));
    for (let i = 0; i < n; i++) FILLER_POOL.push(ch);
  }
}

// ---------- Quanto è difficile un livello ----------
// La difficoltà sale allargando la griglia e aggiungendo parole, e si ferma:
// oltre il livello 30 resta 12×12 con 12 parole. Una griglia più grande di
// così non ci starebbe nello schermo di un telefono con le lettere leggibili.
const LEVEL_PLAN = [
  { upTo: 4,        n: 8,  count: 5,  maxLen: 5 },
  { upTo: 9,        n: 9,  count: 6,  maxLen: 6 },
  { upTo: 14,       n: 10, count: 7,  maxLen: 7 },
  { upTo: 19,       n: 11, count: 8,  maxLen: 8 },
  { upTo: 29,       n: 12, count: 10, maxLen: 8 },
  { upTo: Infinity, n: 12, count: 12, maxLen: 8 },
];
const MIN_WORD_LEN = 4;
function planFor(level) {
  for (const p of LEVEL_PLAN) if (level <= p.upTo) return p;
  return LEVEL_PLAN[LEVEL_PLAN.length - 1];
}

// ---------- Fabbrica delle griglie ----------
// le otto direzioni, dal primo livello: destra, giù, le quattro diagonali e i
// versi rovesciati
const DIRS = [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]];

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }

// Sceglie le parole del livello: un po' per ogni lunghezza disponibile, senza
// ripetere quelle uscite negli ultimi livelli (state.used).
function chooseWords(plan, rnd, used) {
  const maxLen = Math.min(plan.maxLen, plan.n);
  const lengths = [];
  for (let L = MIN_WORD_LEN; L <= maxLen; L++) if (WORDS_BY_LEN[L] && WORDS_BY_LEN[L].length) lengths.push(L);
  if (!lengths.length) return [];
  const chosen = [];
  const seen = new Set();
  let guard = 0;
  while (chosen.length < plan.count && guard < plan.count * 200) {
    guard++;
    const L = lengths[Math.min(lengths.length - 1, Math.floor(rnd() * lengths.length))];
    const w = pick(WORDS_BY_LEN[L], rnd);
    if (seen.has(w)) continue;
    // dopo un po' di tentativi a vuoto si accettano anche le parole già viste
    // di recente: meglio ripetere una parola che dare un livello a metà
    if (used.has(w) && guard < plan.count * 60) continue;
    seen.add(w);
    chosen.push(w);
  }
  // le lunghe per prime: si piazzano meglio in una griglia ancora vuota
  chosen.sort((a, b) => b.length - a.length);
  return chosen;
}

// Mette una parola nella griglia: direzione a caso, punto di partenza a caso,
// e si accetta solo se ogni casella è libera o ha già la lettera giusta (due
// parole che si incrociano condividono la lettera dell'incrocio).
function tryPlace(grid, n, word, rnd) {
  const letters = Array.from(word);
  const L = letters.length;
  for (let attempt = 0; attempt < 200; attempt++) {
    const [dr, dc] = pick(DIRS, rnd);
    const r0 = Math.floor(rnd() * n);
    const c0 = Math.floor(rnd() * n);
    const r1 = r0 + dr * (L - 1);
    const c1 = c0 + dc * (L - 1);
    if (r1 < 0 || r1 >= n || c1 < 0 || c1 >= n) continue;
    let ok = true;
    for (let i = 0; i < L; i++) {
      const cur = grid[(r0 + dr * i) * n + (c0 + dc * i)];
      if (cur && cur !== letters[i]) { ok = false; break; }
    }
    if (!ok) continue;
    for (let i = 0; i < L; i++) grid[(r0 + dr * i) * n + (c0 + dc * i)] = letters[i];
    return { w: word, r: r0, c: c0, dr, dc };
  }
  return null;
}

function generateLevel(level, seed, used) {
  const plan = planFor(level);
  const n = plan.n;
  const rnd = seededRandom(seed);
  let placed = [];
  let grid = [];

  // due giri: se con le parole sorteggiate non si riempie il livello (capita
  // con le griglie piccole e le parole lunghe), si risorteggia una volta sola
  for (let round = 0; round < 3 && placed.length < plan.count; round++) {
    grid = new Array(n * n).fill('');
    placed = [];
    const candidates = chooseWords(plan, rnd, used);
    for (const w of candidates) {
      if (placed.length >= plan.count) break;
      const p = tryPlace(grid, n, w, rnd);
      if (p) placed.push(p);
    }
  }

  for (let i = 0; i < grid.length; i++) {
    if (!grid[i]) grid[i] = pick(FILLER_POOL, rnd) || 'A';
  }
  // l'elenco sotto la griglia si legge meglio in ordine alfabetico che
  // nell'ordine in cui sono state piazzate
  placed.sort((a, b) => a.w.localeCompare(b.w));
  return { n, grid, words: placed };
}

// ---------- Stato ----------
const HINTS_PER_LEVEL = 3;
const USED_MEMORY = 400;   // quante parole recenti si ricordano, per non ripeterle

const state = {
  language: 'it',
  level: 1,
  hints: HINTS_PER_LEVEL,
  board: null,            // { n, grid, words }
  found: [],              // { w, r0, c0, r1, c1 }
  used: new Set(),        // parole uscite di recente in questa lingua
  byLanguage: {},         // progresso di ogni lingua, per riprendere dove si era
  ready: false,
};

const els = {
  loading: document.getElementById('loadingScreen'),
  levelLabel: document.getElementById('levelLabel'),
  langChip: document.getElementById('langChip'),
  gameZone: document.querySelector('.game-zone'),
  frame: document.getElementById('boardFrame'),
  bands: document.getElementById('bands'),
  board: document.getElementById('board'),
  wordsList: document.getElementById('wordsList'),
  hintBtn: document.getElementById('hintBtn'),
  hintCount: document.getElementById('hintCount'),
  toast: document.getElementById('toast'),
  winOverlay: document.getElementById('winOverlay'),
  winSub: document.getElementById('winSub'),
  nextLevelBtn: document.getElementById('nextLevelBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsOverlay: document.getElementById('settingsOverlay'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  openLanguageBtn: document.getElementById('openLanguageBtn'),
  openTutorialBtn: document.getElementById('openTutorialBtn'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  tutorialOverlay: document.getElementById('tutorialOverlay'),
  closeTutorialBtn: document.getElementById('closeTutorialBtn'),
  leaderboardOverlay: document.getElementById('leaderboardOverlay'),
  leaderboardList: document.getElementById('leaderboardList'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  languageConfirmOverlay: document.getElementById('languageConfirmOverlay'),
  languageConfirmText: document.getElementById('languageConfirmText'),
  confirmLanguageBtn: document.getElementById('confirmLanguageBtn'),
  cancelLanguageBtn: document.getElementById('cancelLanguageBtn'),
  topRestartBtn: document.getElementById('topRestartBtn'),
  confirmRestartOverlay: document.getElementById('confirmRestartOverlay'),
  confirmRestartBtn: document.getElementById('confirmRestartBtn'),
  cancelRestartBtn: document.getElementById('cancelRestartBtn'),
};

let cellEls = [];
let tutorialPrimoAvvio = false;

function colorOf(index) { return `var(--hl-${(index % 6) + 1})`; }
function wordIndex(w) { return state.board ? state.board.words.findIndex(p => p.w === w) : 0; }
function isFound(w) { return state.found.some(f => f.w === w); }

// ---------- Disegno ----------
function buildBoard() {
  const { n, grid } = state.board;
  els.board.style.setProperty('--n', n);
  els.board.innerHTML = '';
  cellEls = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell' + (c === n - 1 ? ' last-col' : '') + (r === n - 1 ? ' last-row' : '');
      cell.textContent = grid[r * n + c];
      els.board.appendChild(cell);
      cellEls.push(cell);
    }
  }
  els.bands.setAttribute('viewBox', `0 0 ${n} ${n}`);
  layout();
  renderBands();
  renderFoundCells();
}

// Le passate di evidenziatore: una riga per parola trovata, disegnata in
// coordinate di casella (il viewBox è largo quanto la griglia in caselle),
// così restano al loro posto qualunque sia la misura sullo schermo.
function renderBands() {
  if (!state.board) return;
  const parts = [];
  for (const f of state.found) {
    parts.push(band(f.c0, f.r0, f.c1, f.r1, colorOf(wordIndex(f.w)), 0.55));
  }
  if (selection.cells.length) {
    const a = selection.cells[0];
    const b = selection.cells[selection.cells.length - 1];
    parts.push(band(a.c, a.r, b.c, b.r, 'var(--violet)', 0.28));
  }
  els.bands.innerHTML = parts.join('');
}
// il colore va nello `style` e non nell'attributo `stroke`: dentro agli
// attributi di presentazione il var(--...) non lo risolvono tutti i browser,
// e una passata di evidenziatore invisibile non si vede che manca
function band(c0, r0, c1, r1, color, opacity) {
  return `<line x1="${c0 + 0.5}" y1="${r0 + 0.5}" x2="${c1 + 0.5}" y2="${r1 + 0.5}" ` +
    `style="stroke:${color}; stroke-opacity:${opacity}" stroke-width="0.74" stroke-linecap="round" />`;
}

function renderFoundCells() {
  if (!state.board) return;
  const n = state.board.n;
  cellEls.forEach(el => el.classList.remove('on'));
  for (const f of state.found) {
    const dr = Math.sign(f.r1 - f.r0);
    const dc = Math.sign(f.c1 - f.c0);
    const len = Math.max(Math.abs(f.r1 - f.r0), Math.abs(f.c1 - f.c0));
    for (let i = 0; i <= len; i++) {
      const el = cellEls[(f.r0 + dr * i) * n + (f.c0 + dc * i)];
      if (el) el.classList.add('on');
    }
  }
}

function renderWordsList() {
  if (!state.board) return;
  const words = state.board.words;
  els.wordsList.style.setProperty('--chip-size', words.length >= 10 ? '12px' : '13px');
  els.wordsList.innerHTML = words.map((p, i) => {
    const found = isFound(p.w);
    return `<span class="word-chip${found ? ' found' : ''}" style="--c:${colorOf(i)}">${escapeHtml(p.w)}</span>`;
  }).join('');
}

function updateHeader() {
  els.levelLabel.textContent = state.level;
  els.langChip.textContent = state.language.toUpperCase();
  els.hintCount.textContent = state.hints;
  els.hintBtn.disabled = state.hints <= 0;
}

// Quanto può essere grande la griglia: si misura lo spazio che resta DAVVERO
// nella sua zona (fra intestazione ed elenco parole) e si prende il lato più
// corto — niente percentuali dello schermo tirate a indovinare.
function layout() {
  if (!state.board) return;
  const zone = els.gameZone;
  const cs = getComputedStyle(zone);
  const availW = zone.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const availH = zone.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const side = Math.floor(Math.max(160, Math.min(availW, availH)));
  els.frame.style.setProperty('--board', side + 'px');
  els.board.style.setProperty('--cell', (side / state.board.n) + 'px');
}

let toastTimer = null;
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 1800);
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Selezione ----------
// Due modi, tutti e due sempre attivi: si trascina dalla prima all'ultima
// lettera, oppure si tocca la prima e poi si tocca l'ultima. Il secondo serve
// su schermi piccoli, dove il dito che striscia copre proprio quello che
// bisogna leggere.
const selection = { cells: [], dragging: false, start: null, anchor: null };

function cellAt(clientX, clientY) {
  if (!state.board) return null;
  const n = state.board.n;
  const rect = els.frame.getBoundingClientRect();
  if (!rect.width || !rect.height) return null;
  const c = Math.floor((clientX - rect.left) / (rect.width / n));
  const r = Math.floor((clientY - rect.top) / (rect.height / n));
  if (r < 0 || r >= n || c < 0 || c >= n) return null;
  return { r, c };
}

// Dal punto di partenza al dito: si tiene solo la direzione fra le otto che ci
// somiglia di più, e la riga resta dritta. Senza questo, un dito storto non
// prenderebbe mai una diagonale.
function snapTo(start, target) {
  const n = state.board.n;
  const dr = target.r - start.r;
  const dc = target.c - start.c;
  if (dr === 0 && dc === 0) return [{ r: start.r, c: start.c }];
  const adr = Math.abs(dr), adc = Math.abs(dc);
  let sr, sc, len;
  if (adc === 0) { sr = Math.sign(dr); sc = 0; len = adr; }
  else if (adr === 0) { sr = 0; sc = Math.sign(dc); len = adc; }
  else {
    const ratio = adr / adc;
    if (ratio > 2.414) { sr = Math.sign(dr); sc = 0; len = adr; }        // oltre 67,5°: verticale
    else if (ratio < 0.414) { sr = 0; sc = Math.sign(dc); len = adc; }   // sotto 22,5°: orizzontale
    else { sr = Math.sign(dr); sc = Math.sign(dc); len = Math.round((adr + adc) / 2); }
  }
  while (len > 0) {
    const r = start.r + sr * len, c = start.c + sc * len;
    if (r >= 0 && r < n && c >= 0 && c < n) break;
    len--;
  }
  const cells = [];
  for (let i = 0; i <= len; i++) cells.push({ r: start.r + sr * i, c: start.c + sc * i });
  return cells;
}

function onPointerDown(e) {
  if (!state.board || anyOverlayOpen()) return;
  const cell = cellAt(e.clientX, e.clientY);
  if (!cell) return;
  e.preventDefault();
  // seconda toccata dopo una prima lettera già scelta: la riga parte da lì
  if (selection.anchor && (selection.anchor.r !== cell.r || selection.anchor.c !== cell.c)) {
    selection.start = selection.anchor;
  } else {
    selection.start = cell;
  }
  selection.dragging = true;
  selection.cells = snapTo(selection.start, cell);
  renderBands();
}
function onPointerMove(e) {
  if (!selection.dragging) return;
  const cell = cellAt(e.clientX, e.clientY);
  if (!cell) return;
  e.preventDefault();
  selection.cells = snapTo(selection.start, cell);
  renderBands();
}
function onPointerUp() {
  if (!selection.dragging) return;
  selection.dragging = false;
  const cells = selection.cells;
  if (cells.length > 1) {
    selection.anchor = null;
    submitSelection(cells);
    selection.cells = [];
  } else if (cells.length === 1) {
    const only = cells[0];
    // toccata singola: la prima lettera resta scelta e aspetta l'ultima.
    // Ritoccarla la libera.
    if (selection.anchor && selection.anchor.r === only.r && selection.anchor.c === only.c) {
      selection.anchor = null;
      selection.cells = [];
    } else {
      selection.anchor = only;
    }
  }
  renderBands();
}

function lettersOf(cells) {
  const n = state.board.n;
  return cells.map(p => state.board.grid[p.r * n + p.c]).join('');
}

function submitSelection(cells) {
  const word = lettersOf(cells);
  const reversed = Array.from(word).reverse().join('');
  const hit = state.board.words.find(p => !isFound(p.w) && (p.w === word || p.w === reversed));
  if (!hit) return;
  const a = cells[0], b = cells[cells.length - 1];
  // la parola si segna dove è stata trovata: se il verso è quello rovesciato,
  // la riga si disegna comunque dalla prima all'ultima lettera toccate
  state.found.push({ w: hit.w, r0: a.r, c0: a.c, r1: b.r, c1: b.c });
  renderBands();
  renderFoundCells();
  renderWordsList();
  saveProgress();
  if (state.found.length >= state.board.words.length) setTimeout(win, 420);
}

// ---------- Aiuti ----------
function useHint() {
  if (!state.board) return;
  if (state.hints <= 0) { showToast(t().noHints); return; }
  const missing = state.board.words.filter(p => !isFound(p.w));
  if (!missing.length) { showToast(t().allFound); return; }
  const p = missing[Math.floor(Math.random() * missing.length)];
  const el = cellEls[p.r * state.board.n + p.c];
  if (!el) return;
  state.hints--;
  updateHeader();
  saveProgress();
  el.classList.remove('hinted');
  void el.offsetWidth; // riavvia l'animazione anche se la casella lampeggiava già
  el.classList.add('hinted');
  setTimeout(() => el.classList.remove('hinted'), 3000);
}

// ---------- Livelli ----------
function newSeed() { return (Date.now() ^ Math.floor(Math.random() * 2147483647)) % 2147483647; }

function startLevel(level, seed) {
  state.level = level;
  state.hints = HINTS_PER_LEVEL;
  state.found = [];
  state.board = generateLevel(level, seed || newSeed(), state.used);
  for (const p of state.board.words) state.used.add(p.w);
  trimUsed();
  selection.cells = [];
  selection.anchor = null;
  buildBoard();
  renderWordsList();
  updateHeader();
  layout();
  saveProgress();
}
function trimUsed() {
  if (state.used.size <= USED_MEMORY) return;
  const arr = Array.from(state.used);
  state.used = new Set(arr.slice(arr.length - USED_MEMORY));
}
function win() {
  els.winSub.textContent = t().winSub(state.level, state.board.words.length);
  els.winOverlay.classList.add('show');
}
function nextLevel() {
  els.winOverlay.classList.remove('show');
  startLevel(state.level + 1);
}
function restartLevel() {
  startLevel(state.level);
}

// ---------- Progresso (localStorage + cloud se loggato) ----------
// Il livello che stai giocando si salva com'è — griglia, parole e parole già
// trovate — invece di rigenerarlo alla riapertura sperando che venga uguale.
// Così anche il giorno in cui questo codice cambia, la partita lasciata a metà
// si riapre esattamente com'era.
function snapshotLanguage() {
  const b = state.board;
  return {
    level: state.level,
    hints: state.hints,
    n: b ? b.n : null,
    grid: b ? b.grid.join('') : null,
    words: b ? b.words.map(p => [p.w, p.r, p.c, p.dr, p.dc]) : null,
    found: state.found.map(f => [f.w, f.r0, f.c0, f.r1, f.c1]),
    used: Array.from(state.used).slice(-USED_MEMORY),
  };
}
// Rilegge un salvataggio, controllando che tenga insieme: un salvataggio
// rovinato non deve dare una griglia senza parole o parole fuori dalla griglia.
function restoreLanguage(saved) {
  // si riparte sempre dal foglio bianco: cambiando lingua, quello che restava
  // in giro della lingua di prima non deve finire dentro alla nuova
  state.level = 1;
  state.hints = HINTS_PER_LEVEL;
  state.used = new Set();
  state.found = [];
  state.board = null;
  if (!saved || typeof saved !== 'object') return false;
  state.level = Number.isFinite(saved.level) && saved.level >= 1 ? Math.floor(saved.level) : 1;
  state.hints = Number.isFinite(saved.hints) ? Math.max(0, Math.min(HINTS_PER_LEVEL, saved.hints)) : HINTS_PER_LEVEL;
  state.used = new Set(Array.isArray(saved.used) ? saved.used : []);
  const n = saved.n;
  const gridStr = saved.grid;
  if (!Number.isFinite(n) || typeof gridStr !== 'string' || !Array.isArray(saved.words) || !saved.words.length) return false;
  const grid = Array.from(gridStr);
  if (grid.length !== n * n) return false;
  const words = [];
  for (const row of saved.words) {
    if (!Array.isArray(row) || row.length < 5) return false;
    const [w, r, c, dr, dc] = row;
    if (typeof w !== 'string' || !Number.isFinite(r) || !Number.isFinite(c)) return false;
    words.push({ w, r, c, dr, dc });
  }
  state.board = { n, grid, words };
  state.found = [];
  const names = new Set(words.map(p => p.w));
  for (const row of (Array.isArray(saved.found) ? saved.found : [])) {
    if (!Array.isArray(row) || row.length < 5) continue;
    const [w, r0, c0, r1, c1] = row;
    if (!names.has(w)) continue;
    state.found.push({ w, r0, c0, r1, c1 });
  }
  return true;
}

// Quale lingua apre Findy, in ordine di precedenza:
//   1. la scelta fatta qui dentro su questo dispositivo (chiave del gioco)
//   2. la stessa scelta salvata nell'account, così ti segue su tablet e telefono
//   3. la lingua del sito, scelta in home: è il caso di chi apre Findy per la
//      prima volta
//   4. la lingua dell'ultimo salvataggio, e in ultimo l'italiano
function pickLanguage(data) {
  const own = getGameLanguage();
  if (own) return own;
  const fromAccount = data && data.langOverride;
  if (fromAccount && LANGUAGES[fromAccount]) {
    setGameLanguage(fromAccount);
    return fromAccount;
  }
  const site = getSiteLanguage();
  if (site) return site;
  if (data && data.language && LANGUAGES[data.language]) return data.language;
  return 'it';
}
function bestLevelReached() {
  let best = state.level;
  for (const p of Object.values(state.byLanguage)) {
    if (p && p.level > best) best = p.level;
  }
  return best;
}
async function loadProgress() {
  let data = null;
  try {
    if (window.FFR && window.FFR.auth && window.FFR.auth.ready) await window.FFR.auth.ready;
    if (window.FFR && window.FFR.auth) data = await window.FFR.auth.loadProgress('findy');
  } catch (e) { data = null; }
  state.language = pickLanguage(data);
  state.byLanguage = (data && data.progress && typeof data.progress === 'object') ? data.progress : {};
  return state.byLanguage[state.language] || null;
}
function saveProgress() {
  if (!state.ready) return;
  try {
    state.byLanguage[state.language] = snapshotLanguage();
    const payload = {
      v: 1,
      language: state.language,
      langOverride: getGameLanguage() || null,
      progress: state.byLanguage,
    };
    if (window.FFR && window.FFR.auth) {
      window.FFR.auth.saveProgress('findy', payload, bestLevelReached());
      // voce di classifica della lingua in corso: ogni lingua è una
      // progressione a sé, quindi ha la sua graduatoria
      window.FFR.auth.saveScore('findy:' + state.language, state.level);
    } else {
      localStorage.setItem('ffr-findy-progress', JSON.stringify(payload));
    }
  } catch (e) { /* ignora errori di salvataggio */ }
}

// ---------- Pannelli ----------
function anyOverlayOpen() {
  return !!document.querySelector('.overlay.show');
}
function openSettingsMenu() { els.settingsOverlay.classList.add('show'); }
function closeSettingsMenu() { els.settingsOverlay.classList.remove('show'); }
function openTutorial() {
  els.settingsOverlay.classList.remove('show');
  els.tutorialOverlay.classList.add('show');
}
function closeTutorial() {
  tutorialPrimoAvvio = false;
  els.tutorialOverlay.classList.remove('x-off');
  els.tutorialOverlay.classList.remove('show');
  try { localStorage.setItem('findy-tutorial-seen', '1'); } catch (e) { /* ignora */ }
  if (els.settingsOverlay.dataset.wasOpen === '1') {
    els.settingsOverlay.dataset.wasOpen = '';
    els.settingsOverlay.classList.add('show');
  }
}

// ---------- Classifica ----------
// Una per lingua, senza schede: si vede quella della lingua con cui stai
// giocando, perché il livello 30 in italiano non ha niente a che vedere col
// livello 30 in inglese.
async function openLeaderboard() {
  els.settingsOverlay.classList.remove('show');
  els.leaderboardOverlay.classList.add('show');
  els.leaderboardList.innerHTML = '<div class="leaderboard-empty">…</div>';
  const auth = (window.FFR && window.FFR.auth) ? window.FFR.auth : null;
  const gameKey = 'findy:' + state.language;
  const [rows, me] = await Promise.all([
    auth ? auth.getLeaderboard(gameKey, 50) : [],
    auth ? auth.getMyRank(gameKey) : null,
  ]);
  if (!rows.length) {
    els.leaderboardList.innerHTML = `<div class="leaderboard-empty">${t().leaderboardEmpty}</div>`;
    return;
  }
  els.leaderboardList.innerHTML = buildLeaderboardRows(rows, me, auth ? auth.getNickname() : null);
}
// Righe con la regola condivisa del sito: se ne vedono 6 per volta e, quando
// chi guarda è fuori dalle prime 5, la sua riga viene infilata come 6ª
// (evidenziata) così si vede subito senza scorrere.
function buildLeaderboardRows(rows, me, myNickname) {
  const row = (pos, nickname, score, isMe) => `
    <div class="leaderboard-row${isMe ? ' is-me' : ''}">
      <span class="leaderboard-rank">N.${pos}</span>
      <span class="leaderboard-name">${escapeHtml(nickname)}</span>
      <span class="leaderboard-score">LV.${score}</span>
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

// ---------- Lingua ----------
let pendingLanguage = null;
function renderLanguageList() {
  els.languageList.innerHTML = Object.entries(LANGUAGES).map(([code, info]) => `
    <button class="language-option${code === state.language ? ' active' : ''}" data-lang="${code}">
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
function openLanguageConfirm(code) {
  if (code === state.language) { closeLanguageModal(); return; }
  pendingLanguage = code;
  const saved = state.byLanguage[code];
  els.languageConfirmText.textContent = (saved && saved.level > 1)
    ? t().languageConfirmResumeText(LANGUAGES[code].label, saved.level)
    : t().languageConfirmText(LANGUAGES[code].label);
  els.languageOverlay.classList.remove('show');
  els.languageConfirmOverlay.classList.add('show');
}
function cancelLanguageChange() {
  pendingLanguage = null;
  els.languageConfirmOverlay.classList.remove('show');
  els.settingsOverlay.classList.add('show');
}
async function confirmLanguageChange() {
  if (!pendingLanguage) { cancelLanguageChange(); return; }
  const code = pendingLanguage;
  pendingLanguage = null;
  els.languageConfirmOverlay.classList.remove('show');
  showLoadingScreen();
  try {
    // il progresso della lingua che si lascia va messo via PRIMA di cambiare
    state.byLanguage[state.language] = snapshotLanguage();
    await loadWords(code);
    state.language = code;
    setGameLanguage(code);
    applyTranslations();
    const saved = state.byLanguage[code];
    if (!restoreLanguage(saved)) {
      // lingua mai giocata: si comincia dal livello 1, come dice la conferma
      startLevel(state.level);
    } else {
      buildBoard();
      renderWordsList();
      updateHeader();
      saveProgress();
    }
  } catch (e) {
    showToast(t().wordsError);
  }
  hideLoadingScreen();
}

// ---------- Livello nuovo (↻) ----------
function openRestartConfirm() {
  els.confirmRestartOverlay.classList.add('show');
}
function closeRestartConfirm() {
  els.confirmRestartOverlay.classList.remove('show');
}

// ---------- Schermata di caricamento ----------
function showLoadingScreen() {
  els.loading.classList.remove('hidden');
  els.loading.style.opacity = '1';
}
function hideLoadingScreen() {
  els.loading.style.opacity = '0';
  setTimeout(() => els.loading.classList.add('hidden'), 300);
}

// ---------- Avvio ----------
async function init() {
  const saved = await loadProgress();
  applyTranslations();
  updateHeader();

  try {
    await loadWords(state.language);
  } catch (e) {
    showToast(t().wordsError);
    hideLoadingScreen();
    return;
  }

  state.ready = true;
  if (restoreLanguage(saved)) {
    buildBoard();
    renderWordsList();
    updateHeader();
  } else {
    startLevel(state.level || 1);
  }

  els.board.addEventListener('pointerdown', onPointerDown);
  // il movimento si ascolta sulla finestra, non sulla griglia: col mouse il
  // dito può uscire dal riquadro e rientrare, e la riga deve seguirlo lo stesso
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  els.hintBtn.addEventListener('click', useHint);
  els.nextLevelBtn.addEventListener('click', nextLevel);

  els.settingsBtn.addEventListener('click', openSettingsMenu);
  els.closeSettingsBtn.addEventListener('click', closeSettingsMenu);
  els.settingsOverlay.addEventListener('click', (e) => {
    if (e.target === els.settingsOverlay) closeSettingsMenu();
  });

  els.openTutorialBtn.addEventListener('click', () => {
    els.settingsOverlay.dataset.wasOpen = '1';
    openTutorial();
  });
  els.closeTutorialBtn.addEventListener('click', closeTutorial);
  els.tutorialOverlay.addEventListener('click', (e) => {
    if (e.target === els.tutorialOverlay && !tutorialPrimoAvvio) closeTutorial();
  });

  els.openLeaderboardBtn.addEventListener('click', openLeaderboard);
  els.closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
  els.leaderboardOverlay.addEventListener('click', (e) => {
    if (e.target === els.leaderboardOverlay) closeLeaderboard();
  });

  els.openLanguageBtn.addEventListener('click', openLanguageModal);
  els.closeLanguageBtn.addEventListener('click', closeLanguageModal);
  els.languageOverlay.addEventListener('click', (e) => {
    if (e.target === els.languageOverlay) closeLanguageModal();
  });
  els.languageList.addEventListener('click', (e) => {
    const btn = e.target.closest('.language-option');
    if (btn) openLanguageConfirm(btn.dataset.lang);
  });
  els.confirmLanguageBtn.addEventListener('click', confirmLanguageChange);
  els.cancelLanguageBtn.addEventListener('click', cancelLanguageChange);
  els.languageConfirmOverlay.addEventListener('click', (e) => {
    if (e.target === els.languageConfirmOverlay) cancelLanguageChange();
  });

  // ↻ in barra: griglia nuova, chiedendo conferma — un tocco storto non deve
  // buttare via un livello quasi finito
  els.topRestartBtn.addEventListener('click', openRestartConfirm);
  els.confirmRestartBtn.addEventListener('click', () => {
    closeRestartConfirm();
    restartLevel();
  });
  els.cancelRestartBtn.addEventListener('click', closeRestartConfirm);
  els.confirmRestartOverlay.addEventListener('click', (e) => {
    if (e.target === els.confirmRestartOverlay) closeRestartConfirm();
  });

  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 250));

  // primo avvio: le istruzioni si chiudono solo da "Ho capito!" — niente X e
  // niente chiusura toccando lo sfondo, o basta un dito per sbaglio per non
  // vederle mai più
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('findy-tutorial-seen'); } catch (e) { /* ignora */ }
  if (!tutorialSeen) {
    tutorialPrimoAvvio = true;
    els.tutorialOverlay.classList.add('x-off');
    els.tutorialOverlay.classList.add('show');
  }

  setTimeout(hideLoadingScreen, 350);
}
init();

// La X dei pannelli (shared/modal-x.js) chiude e basta: qui va rimesso a posto
// quello che il pannello si portava dietro.
window.FFR_ON_MODAL_CLOSE = function (id) {
  if (id === 'tutorialOverlay') {
    // le istruzioni aperte dal menu tornano al menu; quelle del primo avvio non
    // hanno la X, quindi qui non ci arrivano mai
    try { localStorage.setItem('findy-tutorial-seen', '1'); } catch (e) { /* ignora */ }
    if (els.settingsOverlay.dataset.wasOpen === '1') {
      els.settingsOverlay.dataset.wasOpen = '';
      els.settingsOverlay.classList.add('show');
    }
    return;
  }
  if (id === 'languageConfirmOverlay') { pendingLanguage = null; return; }
  // dagli altri pannelli aperti dal menu si torna al menu, come col loro
  // pulsante "Chiudi"
  if (id === 'languageOverlay' || id === 'leaderboardOverlay') {
    els.settingsOverlay.classList.add('show');
  }
};
