/* ============ ISOLA DI PAROLE — motore di gioco ============ */

// ---------- Dizionario ----------
// Le lingue caricano il proprio dizionario da file esterni (dictionaries/<lingua>.json),
// così si possono aggiungere nuove lingue senza gonfiare lo script principale.
const LANGUAGES = {
  it: { label: 'Italiano', flag: '🇮🇹' },
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
};

// ---------- Interfaccia: testi tradotti ----------
// il nome "Parole Mie" resta invariato (è il nome del gioco); tutto il resto
// dell'interfaccia si traduce quando l'utente cambia lingua.
const UI_STRINGS = {
  it: {
    tagline: 'Trova tutte le parole',
    extraFound: 'Extra trovate',
    shuffle: 'Mescola',
    hint: 'Aiuto',
    levelComplete: 'Livello Completato!',
    levelCompleteSub: 'Ottimo lavoro, isolano!',
    coinsLabel: 'monete',
    extraLabel: 'extra',
    continueBtn: 'Continua →',
    extraWordsTitle: '✨ Parole Extra',
    extraWordsSub: 'Le parole bonus trovate in questo livello',
    close: 'Chiudi',
    shopTitle: '🪙 Negozio Aiuti',
    shopSub: 'Scambia le monete con aiuti',
    yourBalance: 'Il tuo saldo',
    buy: 'Compra',
    confirmPurchaseTitle: "Confermi l'acquisto?",
    cancel: 'Annulla',
    confirm: 'Conferma',
    languageTitle: '🌍 Lingua',
    languageSub: 'Scegli la lingua delle parole',
    languageChangeTitle: 'Cambiare lingua?',
    wordsToFind: n => `${n} parole da trovare`,
    wordFoundToast: w => '✓ ' + w.toUpperCase(),
    extraFoundToast: '✨ Extra! +5 🪙',
    hintEarnedToast: '🎁 Hai guadagnato un aiuto!',
    alreadyFound: 'Già trovata',
    needMoreExtra: n => `Trova ${n} parole extra per un aiuto ✨`,
    noLetterToReveal: 'Nessuna lettera da svelare',
    letterRevealed: '💡 Lettera svelata',
    hintsBought: n => `✓ Acquistati ${n} aiuti!`,
    notEnoughCoins: 'Monete insufficienti',
    dictError: 'Errore nel caricamento del dizionario',
    purchaseConfirmText: (coins, hints) => `Vuoi spendere ${coins} 🪙 per ottenere ${hints} aiuti?`,
    languageConfirmText: name => `Passare a ${name}? Si ricomincerà dal livello 1.`,
    noExtraWords: 'Nessuna parola extra trovata in questo livello. Prova a scrivere altre parole valide con le lettere disponibili!',
  },
  en: {
    tagline: 'Find all the words',
    extraFound: 'Extras found',
    shuffle: 'Shuffle',
    hint: 'Hint',
    levelComplete: 'Level Complete!',
    levelCompleteSub: 'Great job, islander!',
    coinsLabel: 'coins',
    extraLabel: 'extra',
    continueBtn: 'Continue →',
    extraWordsTitle: '✨ Extra Words',
    extraWordsSub: 'Bonus words found in this level',
    close: 'Close',
    shopTitle: '🪙 Hint Shop',
    shopSub: 'Trade coins for hints',
    yourBalance: 'Your balance',
    buy: 'Buy',
    confirmPurchaseTitle: 'Confirm purchase?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    languageTitle: '🌍 Language',
    languageSub: 'Choose the words language',
    languageChangeTitle: 'Change language?',
    wordsToFind: n => `${n} words to find`,
    wordFoundToast: w => '✓ ' + w.toUpperCase(),
    extraFoundToast: '✨ Extra! +5 🪙',
    hintEarnedToast: '🎁 You earned a hint!',
    alreadyFound: 'Already found',
    needMoreExtra: n => `Find ${n} extra words for a hint ✨`,
    noLetterToReveal: 'No letters left to reveal',
    letterRevealed: '💡 Letter revealed',
    hintsBought: n => `✓ Bought ${n} hints!`,
    notEnoughCoins: 'Not enough coins',
    dictError: 'Error loading dictionary',
    purchaseConfirmText: (coins, hints) => `Spend ${coins} 🪙 to get ${hints} hints?`,
    languageConfirmText: name => `Switch to ${name}? You'll restart from level 1.`,
    noExtraWords: "No extra words found in this level yet. Try spelling other valid words with the available letters!",
  },
  fr: {
    tagline: 'Trouve tous les mots',
    extraFound: 'Extras trouvés',
    shuffle: 'Mélanger',
    hint: 'Indice',
    levelComplete: 'Niveau terminé !',
    levelCompleteSub: 'Bravo, insulaire !',
    coinsLabel: 'pièces',
    extraLabel: 'extras',
    continueBtn: 'Continuer →',
    extraWordsTitle: '✨ Mots bonus',
    extraWordsSub: 'Les mots bonus trouvés dans ce niveau',
    close: 'Fermer',
    shopTitle: "🪙 Boutique d'indices",
    shopSub: 'Échange des pièces contre des indices',
    yourBalance: 'Ton solde',
    buy: 'Acheter',
    confirmPurchaseTitle: "Confirmer l'achat ?",
    cancel: 'Annuler',
    confirm: 'Confirmer',
    languageTitle: '🌍 Langue',
    languageSub: 'Choisis la langue des mots',
    languageChangeTitle: 'Changer de langue ?',
    wordsToFind: n => `${n} mots à trouver`,
    wordFoundToast: w => '✓ ' + w.toUpperCase(),
    extraFoundToast: '✨ Extra ! +5 🪙',
    hintEarnedToast: '🎁 Tu as gagné un indice !',
    alreadyFound: 'Déjà trouvé',
    needMoreExtra: n => `Trouve ${n} mots extra pour un indice ✨`,
    noLetterToReveal: 'Aucune lettre à révéler',
    letterRevealed: '💡 Lettre révélée',
    hintsBought: n => `✓ ${n} indices achetés !`,
    notEnoughCoins: 'Pièces insuffisantes',
    dictError: 'Erreur de chargement du dictionnaire',
    purchaseConfirmText: (coins, hints) => `Dépenser ${coins} 🪙 pour obtenir ${hints} indices ?`,
    languageConfirmText: name => `Passer à ${name} ? Tu recommenceras au niveau 1.`,
    noExtraWords: "Aucun mot bonus trouvé dans ce niveau pour l'instant. Essaie d'écrire d'autres mots valides avec les lettres disponibles !",
  },
};
function t() {
  return UI_STRINGS[state.language] || UI_STRINGS.it;
}
function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t()[key];
    if (typeof val === 'string') el.textContent = val;
  });
}

let ALL_WORDS = [];
let WORD_SET = new Set();
let COMMON_WORDS = new Set();
let WORD_DATA = [];
let BY_LEN = {};

async function loadDictionary(lang) {
  const res = await fetch(`dictionaries/${lang}.json`);
  if (!res.ok) throw new Error(`Impossibile caricare il dizionario "${lang}"`);
  const data = await res.json();
  ALL_WORDS = data.words.split(',');
  WORD_SET = new Set(ALL_WORDS); // per verifica rapida e affidabile di qualsiasi parola scritta
  COMMON_WORDS = new Set(data.common.split(','));
  WORD_DATA = ALL_WORDS.map(w => ({ word: w, len: w.length, counts: countLetters(w) }));
  BY_LEN = {};
  for (const wd of WORD_DATA) {
    (BY_LEN[wd.len] = BY_LEN[wd.len] || []).push(wd);
  }
}

// conta le lettere per carattere (non solo a-z) così funziona anche con
// alfabeti accentati come il francese (é, è, ç, œ, ...)
function countLetters(w) {
  const c = {};
  for (const ch of w) c[ch] = (c[ch] || 0) + 1;
  return c;
}
function isSubset(subCounts, baseCounts) {
  for (const ch in subCounts) {
    if (subCounts[ch] > (baseCounts[ch] || 0)) return false;
  }
  return true;
}
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
function shuffleInPlace(arr, rnd) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------- Generazione livello ----------
// Il gioco NON è un cruciverba a incastro: si hanno N lettere disponibili
// (la "parola madre") e bisogna indovinare tutte le parole valide che si
// possono formare con quelle lettere. Le parole richieste sono mostrate
// come righe di caselle vuote (una riga per parola); tutte le altre
// parole valide trovabili con le stesse lettere contano come bonus estra.

function findSubwords(anchorWord, anchorCounts) {
  const res = [];
  for (let len = 3; len <= anchorWord.length; len++) {
    const bucket = BY_LEN[len];
    if (!bucket) continue;
    for (const wd of bucket) {
      if (wd.word === anchorWord) continue;
      if (isSubset(wd.counts, anchorCounts)) res.push(wd.word);
    }
  }
  return res;
}

function difficultyForLevel(level) {
  const tier = Math.min(4, Math.floor((level - 1) / 12));
  const minLen = Math.min(8, 5 + tier);
  const maxLen = Math.min(8, minLen + 2);
  return { minLen, maxLen: Math.max(minLen, maxLen) };
}

function generateLevel(level) {
  const seed = level * 104729 + 17;
  const rnd = seededRandom(seed);
  const { minLen, maxLen } = difficultyForLevel(level);
  const minTargets = 4;
  const maxTargets = Math.min(10, 5 + Math.floor(level / 8));

  // la "parola madre" viene scelta solo tra parole comuni, così le lettere
  // disponibili formano sempre un termine riconoscibile
  const anchorPool = [];
  for (let len = minLen; len <= maxLen; len++) {
    const bucket = BY_LEN[len];
    if (!bucket) continue;
    bucket.forEach(wd => { if (COMMON_WORDS.has(wd.word)) anchorPool.push(wd); });
  }
  if (anchorPool.length === 0) {
    // fallback: nessuna parola comune di quella lunghezza, usa il dizionario intero
    for (let len = minLen; len <= maxLen; len++) if (BY_LEN[len]) anchorPool.push(...BY_LEN[len]);
  }
  if (anchorPool.length === 0) return generateLevel(1);

  for (let attempt = 0; attempt < 60; attempt++) {
    const anchorWd = pick(anchorPool, rnd);
    const anchor = anchorWd.word;
    const subwords = findSubwords(anchor, anchorWd.counts);
    const pool = Array.from(new Set(subwords)).filter(w => w.length >= 3);
    if (pool.length < minTargets - 1) continue; // -1 perché l'anchor stesso è sempre un target

    // dividi il pool per lunghezza, e dentro ogni lunghezza metti prima le parole comuni
    const byLenPool = {};
    pool.forEach(w => { (byLenPool[w.length] = byLenPool[w.length] || []).push(w); });
    Object.values(byLenPool).forEach(bucket => {
      bucket.sort((a, b) => {
        const ca = COMMON_WORDS.has(a) ? 0 : 1;
        const cb = COMMON_WORDS.has(b) ? 0 : 1;
        return ca - cb || (rnd() - 0.5);
      });
    });
    const lengths = Object.keys(byLenPool).map(Number).sort((a, b) => b - a);

    const targetsSet = new Set([anchor]);
    const capTargets = Math.min(maxTargets, pool.length + 1);
    let li = 0;
    while (targetsSet.size < capTargets && lengths.length > 0) {
      const len = lengths[li % lengths.length];
      const bucket = byLenPool[len];
      if (bucket && bucket.length > 0) {
        // preferisci sempre la prima (più comune) della lista rimasta
        const w = bucket.shift();
        targetsSet.add(w);
      }
      if (!bucket || bucket.length === 0) {
        lengths.splice(li % lengths.length, 1);
        continue;
      }
      li++;
    }

    if (targetsSet.size >= minTargets) {
      const targets = Array.from(targetsSet).sort((a, b) => a.length - b.length || a.localeCompare(b));
      const extra = pool.filter(w => !targetsSet.has(w));
      return {
        anchor,
        letters: shuffleInPlace(anchor.split(''), rnd),
        targets,
        extraWords: new Set(extra)
      };
    }
  }
  return generateLevel(level + 1000);
}

// ---------- Stato di gioco ----------
const EXTRA_PER_HINT = 10; // ogni N parole extra (a vita) si guadagna un aiuto
const state = {
  language: 'it',
  level: 1,
  coins: 0,
  currentLevelData: null,
  foundTargets: new Set(),
  foundExtras: new Set(),
  revealedLetters: {}, // parola -> Set di indici lettera rivelati da un aiuto
  selection: [],
  extraFoundTotal: 0,  // parole extra trovate in totale (a vita, persistente)
  hintsAvailable: 0,   // aiuti guadagnati e non ancora usati
};

const els = {
  loading: document.getElementById('loadingScreen'),
  app: document.getElementById('app'),
  bgLayer: document.getElementById('bgLayer'),
  bgThemeEls: Array.from(document.querySelectorAll('.bg-theme')),
  levelLabel: document.getElementById('levelLabel'),
  coinLabel: document.getElementById('coinLabel'),
  subLabel: document.getElementById('subLabel'),
  wordsList: document.getElementById('wordsList'),
  extraCount: document.getElementById('extraCount'),
  extraCounterBtn: document.getElementById('extraCounterBtn'),
  wheelContainer: document.getElementById('wheelContainer'),
  wheelSvg: document.getElementById('wheelSvgLayer'),
  composeOverlay: document.getElementById('composeOverlay'),
  composeText: document.getElementById('composeText'),
  toast: document.getElementById('toast'),
  shuffleBtn: document.getElementById('shuffleBtn'),
  hintBtn: document.getElementById('hintBtn'),
  hintBadge: document.getElementById('hintBadge'),
  winOverlay: document.getElementById('winOverlay'),
  winCoins: document.getElementById('winCoins'),
  winExtra: document.getElementById('winExtra'),
  nextLevelBtn: document.getElementById('nextLevelBtn'),
  extraModalOverlay: document.getElementById('extraModalOverlay'),
  extraWordsGrid: document.getElementById('extraWordsGrid'),
  closeExtraModalBtn: document.getElementById('closeExtraModalBtn'),
  coinBtn: document.getElementById('coinBtn'),
  shopOverlay: document.getElementById('shopOverlay'),
  closeShopBtn: document.getElementById('closeShopBtn'),
  shopBalance: document.getElementById('shopBalance'),
  shopPackages: Array.from(document.querySelectorAll('.shop-package')),
  confirmPurchaseOverlay: document.getElementById('confirmPurchaseOverlay'),
  confirmPurchaseText: document.getElementById('confirmPurchaseText'),
  confirmPurchaseBtn: document.getElementById('confirmPurchaseBtn'),
  cancelPurchaseBtn: document.getElementById('cancelPurchaseBtn'),
  gearBtn: document.getElementById('gearBtn'),
  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  languageConfirmOverlay: document.getElementById('languageConfirmOverlay'),
  languageConfirmText: document.getElementById('languageConfirmText'),
  confirmLanguageBtn: document.getElementById('confirmLanguageBtn'),
  cancelLanguageBtn: document.getElementById('cancelLanguageBtn'),
};

// ---------- Persistenza ----------
async function loadProgress() {
  try {
    const raw = localStorage.getItem('parole-mie-progress');
    if (raw) {
      const data = JSON.parse(raw);
      state.language = data.language && LANGUAGES[data.language] ? data.language : 'it';
      state.level = data.level || 1;
      state.coins = data.coins != null ? data.coins : 60;
      state.extraFoundTotal = data.extraFoundTotal || 0;
      state.hintsAvailable = data.hintsAvailable || 0;
      // parole già trovate/aiuti usati nel livello in corso, per non perdere
      // nulla in caso di refresh accidentale della pagina
      state.foundTargets = new Set(data.foundTargets || []);
      state.foundExtras = new Set(data.foundExtras || []);
      state.revealedLetters = {};
      if (data.revealedLetters) {
        for (const word in data.revealedLetters) {
          state.revealedLetters[word] = new Set(data.revealedLetters[word]);
        }
      }
    } else {
      state.coins = 60; // bonus di benvenuto per i nuovi giocatori
    }
  } catch (e) {
    state.coins = 60; // bonus di benvenuto (nessun progresso salvato disponibile)
  }
}
async function saveProgress() {
  try {
    const revealedLetters = {};
    for (const word in state.revealedLetters) {
      revealedLetters[word] = Array.from(state.revealedLetters[word]);
    }
    localStorage.setItem('parole-mie-progress', JSON.stringify({
      language: state.language,
      level: state.level,
      coins: state.coins,
      extraFoundTotal: state.extraFoundTotal,
      hintsAvailable: state.hintsAvailable,
      foundTargets: Array.from(state.foundTargets),
      foundExtras: Array.from(state.foundExtras),
      revealedLetters
    }));
  } catch (e) { /* ignora errori di salvataggio */ }
}

// ---------- Rendering elenco parole ----------
function renderWordsList() {
  const data = state.currentLevelData;
  const maxLen = Math.max(...data.targets.map(w => w.length));
  const availableWidth = Math.min(420, (window.innerWidth || 380) - 60);
  let tileSize = Math.floor(availableWidth / maxLen) - 4;
  tileSize = Math.max(20, Math.min(30, tileSize));
  els.wordsList.style.setProperty('--tile-size', tileSize + 'px');

  els.wordsList.innerHTML = '';
  data.targets.forEach(word => {
    const found = state.foundTargets.has(word);
    const revealed = state.revealedLetters[word] || new Set();
    const row = document.createElement('div');
    row.className = 'word-row';
    for (let i = 0; i < word.length; i++) {
      const showLetter = found || revealed.has(i);
      const tile = document.createElement('div');
      tile.className = 'letter-tile' + (found ? ' filled' : (revealed.has(i) ? ' hinted' : ''));
      tile.textContent = showLetter ? word[i].toUpperCase() : '';
      row.appendChild(tile);
    }
    els.wordsList.appendChild(row);
  });
}

// ---------- Rendering ruota lettere ----------
let tileEls = [];
const WHEEL_RADIUS = 75, WHEEL_CX = 116, WHEEL_CY = 116;
function slotPosition(i, n) {
  const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
  return { x: WHEEL_CX + WHEEL_RADIUS * Math.cos(angle), y: WHEEL_CY + WHEEL_RADIUS * Math.sin(angle) };
}
function renderWheel() {
  const data = state.currentLevelData;
  els.wheelContainer.querySelectorAll('.tile').forEach(t => t.remove());
  tileEls = [];
  const n = data.letters.length;
  for (let i = 0; i < n; i++) {
    const { x, y } = slotPosition(i, n);
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = data.letters[i].toUpperCase();
    tile.style.left = x + 'px';
    tile.style.top = y + 'px';
    tile.dataset.index = i;
    els.wheelContainer.appendChild(tile);
    tileEls.push({ el: tile, x, y, letter: data.letters[i] });
  }
  clearSelection();
}

function shuffleLetters() {
  const n = tileEls.length;
  // assegna alle stesse tessere (con la stessa lettera) nuove posizioni sullo slot:
  // così il CSS anima lo spostamento invece di ricrearle da zero.
  const newOrder = shuffleInPlace(Array.from({ length: n }, (_, i) => i), Math.random);
  tileEls.forEach((t, i) => {
    const { x, y } = slotPosition(newOrder[i], n);
    t.x = x; t.y = y;
    t.el.style.left = x + 'px';
    t.el.style.top = y + 'px';
  });
  // aggiorna anche l'ordine logico delle lettere per coerenza con lo stato
  state.currentLevelData.letters = tileEls.map(t => t.letter);
  clearSelection();
}

// ---------- Interazione: disegna parola ----------
function pointFromEvent(e) {
  const rect = els.wheelContainer.getBoundingClientRect();
  const t = e.touches ? e.touches[0] : e;
  return { x: t.clientX - rect.left, y: t.clientY - rect.top };
}
function tileAtPoint(x, y) {
  for (const t of tileEls) {
    const dx = x - t.x, dy = y - t.y;
    if (Math.sqrt(dx * dx + dy * dy) < 30) return t;
  }
  return null;
}
let dragging = false;
function updateComposeOverlay() {
  const word = state.selection.map(i => tileEls[i].letter.toUpperCase()).join('');
  if (word.length > 0) {
    els.composeText.textContent = word;
    const fontSize = Math.max(20, Math.min(38, 260 / word.length));
    els.composeText.style.fontSize = fontSize + 'px';
    els.composeOverlay.classList.add('show');
  } else {
    els.composeOverlay.classList.remove('show');
  }
}
function clearSelection() {
  state.selection = [];
  tileEls.forEach(t => t.el.classList.remove('selected'));
  updateComposeOverlay();
  drawLines();
}
function drawLines() {
  const svg = els.wheelSvg;
  svg.innerHTML = '';
  if (state.selection.length < 2) return;
  const ns = 'http://www.w3.org/2000/svg';
  const poly = document.createElementNS(ns, 'polyline');
  const pts = state.selection.map(i => `${tileEls[i].x},${tileEls[i].y}`).join(' ');
  poly.setAttribute('points', pts);
  poly.setAttribute('fill', 'none');
  poly.setAttribute('stroke', '#F2622E');
  poly.setAttribute('stroke-width', '7');
  poly.setAttribute('stroke-linecap', 'round');
  poly.setAttribute('stroke-linejoin', 'round');
  poly.setAttribute('stroke-dasharray', '2,16');
  poly.setAttribute('opacity', '0.9');
  svg.appendChild(poly);
}
function startDrag(e) {
  dragging = true;
  handleMove(e);
  e.preventDefault();
}
function handleMove(e) {
  if (!dragging) return;
  const { x, y } = pointFromEvent(e);
  const t = tileAtPoint(x, y);
  if (!t) return;
  const idx = tileEls.indexOf(t);
  if (state.selection.includes(idx)) {
    if (state.selection.length > 1 && state.selection[state.selection.length - 2] === idx) {
      const removedIdx = state.selection.pop();
      tileEls[removedIdx].el.classList.remove('selected');
      updateComposeOverlay();
      drawLines();
    }
    return;
  }
  state.selection.push(idx);
  t.el.classList.add('selected');
  updateComposeOverlay();
  drawLines();
  e.preventDefault && e.preventDefault();
}
function endDrag() {
  if (!dragging) return;
  dragging = false;
  submitWord();
}

function submitWord() {
  const word = state.selection.map(i => tileEls[i].letter).join('');
  if (word.length >= 3) {
    const result = checkWord(word);
    if (result === 'invalid') {
      flashInvalid();
      return; // clearSelection avviene al termine dell'animazione
    }
  }
  clearSelection();
}

function flashInvalid() {
  els.composeOverlay.classList.remove('invalid');
  void els.composeOverlay.offsetWidth; // forza il reflow per poter ripetere l'animazione
  els.composeOverlay.classList.add('invalid');
  setTimeout(() => {
    els.composeOverlay.classList.remove('invalid');
    clearSelection();
  }, 420);
}

// verifica se una parola è valida come bonus extra: prima controlla il pool
// pre-calcolato del livello, poi (per sicurezza) verifica anche dinamicamente
// nel dizionario completo, così qualsiasi parola vera formabile con le lettere
// disponibili viene sempre riconosciuta.
function isValidExtraWord(word) {
  const data = state.currentLevelData;
  if (data.extraWords.has(word)) return true;
  if (!WORD_SET.has(word)) return false;
  if (data.targets.includes(word)) return false; // le parole target si gestiscono a parte
  return isSubset(countLetters(word), countLetters(data.anchor));
}

function checkWord(word) {
  const data = state.currentLevelData;
  const isTarget = data.targets.includes(word);
  if (isTarget && !state.foundTargets.has(word)) {
    state.foundTargets.add(word);
    updateHeader();
    renderWordsList();
    showToast(t().wordFoundToast(word));
    saveProgress();
    checkLevelComplete();
    return 'target';
  } else if (!state.foundExtras.has(word) && isValidExtraWord(word)) {
    state.foundExtras.add(word);
    state.coins += 5;
    state.extraFoundTotal += 1;
    els.extraCount.textContent = state.foundExtras.size;
    updateHeader();
    showToast(t().extraFoundToast);
    if (state.extraFoundTotal % EXTRA_PER_HINT === 0) {
      state.hintsAvailable += 1;
      updateHintBadge(true);
      showToast(t().hintEarnedToast);
    }
    saveProgress();
    return 'extra';
  } else if (state.foundTargets.has(word) || state.foundExtras.has(word)) {
    showToast(t().alreadyFound);
    return 'duplicate';
  } else {
    return 'invalid';
  }
}

let toastTimer = null;
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 800);
}

function updateHeader() {
  els.levelLabel.textContent = state.level;
  els.coinLabel.textContent = state.coins;
}

function updateHintBadge(justEarned) {
  els.hintBadge.textContent = state.hintsAvailable;
  if (justEarned) {
    els.hintBadge.classList.remove('pulse');
    void els.hintBadge.offsetWidth;
    els.hintBadge.classList.add('pulse');
  }
}

function checkLevelComplete() {
  const data = state.currentLevelData;
  if (state.foundTargets.size >= data.targets.length) {
    setTimeout(showWinOverlay, 400);
  }
}

const LEVEL_COMPLETE_COINS = 100;
function showWinOverlay() {
  state.coins += LEVEL_COMPLETE_COINS;
  updateHeader();
  els.winCoins.textContent = '+' + LEVEL_COMPLETE_COINS;
  els.winExtra.textContent = '+' + state.foundExtras.size;
  els.winOverlay.classList.add('show');
  saveProgress();
  if (window.confetti) {
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.5 }, colors: ['#F2622E', '#F4B740', '#14A085', '#FFFDF8'] });
  }
}

function nextLevel() {
  els.winOverlay.classList.remove('show');
  state.level += 1;
  saveProgress();
  startLevel(state.level);
}

function useHint() {
  if (state.hintsAvailable <= 0) {
    showToast(t().needMoreExtra(EXTRA_PER_HINT));
    return;
  }
  const data = state.currentLevelData;
  // scegli la parola non risolta con più lettere ancora nascoste (aiuta senza svelarla tutta)
  const unsolved = data.targets
    .filter(w => !state.foundTargets.has(w))
    .map(w => {
      const revealed = state.revealedLetters[w] || new Set();
      return { word: w, hidden: w.length - revealed.size };
    })
    .filter(o => o.hidden > 0)
    .sort((a, b) => b.hidden - a.hidden || a.word.length - b.word.length);
  if (unsolved.length === 0) { showToast(t().noLetterToReveal); return; }

  const target = unsolved[0].word;
  const revealed = state.revealedLetters[target] || new Set();
  const hiddenPositions = [];
  for (let i = 0; i < target.length; i++) if (!revealed.has(i)) hiddenPositions.push(i);
  const pos = hiddenPositions[Math.floor(Math.random() * hiddenPositions.length)];
  revealed.add(pos);
  state.revealedLetters[target] = revealed;

  state.hintsAvailable -= 1;
  updateHintBadge(false);
  renderWordsList();
  showToast(t().letterRevealed);
  saveProgress();
}

// ---------- Sfondo dinamico per livello ----------
const BG_THEMES = ['beach', 'mountain', 'desert', 'forest', 'night'];
function applyLevelBackground(level) {
  const theme = BG_THEMES[(level - 1) % BG_THEMES.length];
  els.bgThemeEls.forEach(el => {
    el.classList.toggle('active', el.dataset.theme === theme);
  });
  els.app.dataset.theme = theme;
}

// ---------- Avvio livello ----------
// "resume" true = si sta ripristinando lo stato dopo un refresh della pagina:
// non si azzerano le parole già trovate/gli aiuti già usati nel livello.
function startLevel(level, resume) {
  state.currentLevelData = generateLevel(level);
  if (!resume) {
    state.foundTargets = new Set();
    state.foundExtras = new Set();
    state.revealedLetters = {};
  }
  els.extraCount.textContent = state.foundExtras.size;
  els.subLabel.textContent = t().wordsToFind(state.currentLevelData.targets.length);
  applyLevelBackground(level);
  updateHeader();
  updateHintBadge(false);
  renderWordsList();
  renderWheel();
  if (resume && state.foundTargets.size >= state.currentLevelData.targets.length) {
    // il livello era già stato completato prima del refresh: riapri il
    // riepilogo senza riassegnare di nuovo le monete del bonus
    els.winCoins.textContent = '+' + LEVEL_COMPLETE_COINS;
    els.winExtra.textContent = '+' + state.foundExtras.size;
    els.winOverlay.classList.add('show');
  }
}

// ---------- Modal parole extra ----------
function openExtraModal() {
  const words = Array.from(state.foundExtras);
  els.extraWordsGrid.innerHTML = words.length
    ? words.map(w => `<span class="extra-chip">${w.toUpperCase()}</span>`).join('')
    : `<p class="extra-empty">${t().noExtraWords}</p>`;
  els.extraModalOverlay.classList.add('show');
}
function closeExtraModal() {
  els.extraModalOverlay.classList.remove('show');
}

// ---------- Negozio aiuti ----------
let pendingPurchase = null; // { coins, hints }

function openShop() {
  els.shopBalance.textContent = state.coins;
  els.shopPackages.forEach(pkg => {
    const cost = parseInt(pkg.dataset.coins, 10);
    const buyBtn = pkg.querySelector('.shop-buy-btn');
    const affordable = state.coins >= cost;
    pkg.classList.toggle('disabled', !affordable);
    buyBtn.disabled = !affordable;
  });
  els.shopOverlay.classList.add('show');
}
function closeShop() {
  els.shopOverlay.classList.remove('show');
}

function openPurchaseConfirm(coins, hints) {
  pendingPurchase = { coins, hints };
  els.confirmPurchaseText.textContent = t().purchaseConfirmText(coins, hints);
  els.shopOverlay.classList.remove('show');
  els.confirmPurchaseOverlay.classList.add('show');
}
function closePurchaseConfirm() {
  pendingPurchase = null;
  els.confirmPurchaseOverlay.classList.remove('show');
}
function confirmPurchase() {
  if (!pendingPurchase) { closePurchaseConfirm(); return; }
  const { coins, hints } = pendingPurchase;
  if (state.coins >= coins) {
    state.coins -= coins;
    state.hintsAvailable += hints;
    updateHeader();
    updateHintBadge(true);
    showToast(t().hintsBought(hints));
    saveProgress();
  } else {
    showToast(t().notEnoughCoins);
  }
  closePurchaseConfirm();
}

// ---------- Selezione lingua ----------
let pendingLanguage = null;

function renderLanguageList() {
  els.languageList.innerHTML = Object.entries(LANGUAGES).map(([code, info]) => `
    <button class="language-option${code === state.language ? ' active' : ''}" data-lang="${code}">
      <span class="language-flag">${info.flag}</span>
      <span class="language-name">${info.label}</span>
    </button>
  `).join('');
}
function openLanguageModal() {
  renderLanguageList();
  els.languageOverlay.classList.add('show');
}
function closeLanguageModal() {
  els.languageOverlay.classList.remove('show');
}
function openLanguageConfirm(code) {
  if (code === state.language) { closeLanguageModal(); return; }
  pendingLanguage = code;
  els.languageConfirmText.textContent = t().languageConfirmText(LANGUAGES[code].label);
  els.languageOverlay.classList.remove('show');
  els.languageConfirmOverlay.classList.add('show');
}
function closeLanguageConfirm() {
  pendingLanguage = null;
  els.languageConfirmOverlay.classList.remove('show');
}
async function confirmLanguageChange() {
  if (!pendingLanguage) { closeLanguageConfirm(); return; }
  const code = pendingLanguage;
  closeLanguageConfirm();
  showLoadingScreen();
  try {
    await loadDictionary(code);
    state.language = code;
    state.level = 1;
    saveProgress();
    applyTranslations();
    startLevel(state.level);
  } catch (e) {
    showToast(t().dictError);
  }
  hideLoadingScreen();
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

// ---------- Init ----------
async function init() {
  await loadProgress();
  updateHeader();
  applyTranslations();
  await loadDictionary(state.language);
  startLevel(state.level, true);

  els.wheelContainer.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', endDrag);
  els.wheelContainer.addEventListener('touchstart', startDrag, { passive: false });
  els.wheelContainer.addEventListener('touchmove', handleMove, { passive: false });
  els.wheelContainer.addEventListener('touchend', endDrag);

  els.shuffleBtn.addEventListener('click', shuffleLetters);
  els.hintBtn.addEventListener('click', useHint);
  els.nextLevelBtn.addEventListener('click', nextLevel);

  els.extraCounterBtn.addEventListener('click', openExtraModal);
  els.closeExtraModalBtn.addEventListener('click', closeExtraModal);
  els.extraModalOverlay.addEventListener('click', (e) => {
    if (e.target === els.extraModalOverlay) closeExtraModal();
  });

  els.coinBtn.addEventListener('click', openShop);
  els.closeShopBtn.addEventListener('click', closeShop);
  els.shopOverlay.addEventListener('click', (e) => {
    if (e.target === els.shopOverlay) closeShop();
  });
  els.shopPackages.forEach(pkg => {
    pkg.querySelector('.shop-buy-btn').addEventListener('click', () => {
      const cost = parseInt(pkg.dataset.coins, 10);
      const hints = parseInt(pkg.dataset.hints, 10);
      if (state.coins >= cost) openPurchaseConfirm(cost, hints);
    });
  });
  els.confirmPurchaseBtn.addEventListener('click', confirmPurchase);
  els.cancelPurchaseBtn.addEventListener('click', closePurchaseConfirm);
  els.confirmPurchaseOverlay.addEventListener('click', (e) => {
    if (e.target === els.confirmPurchaseOverlay) closePurchaseConfirm();
  });

  els.gearBtn.addEventListener('click', openLanguageModal);
  els.closeLanguageBtn.addEventListener('click', closeLanguageModal);
  els.languageOverlay.addEventListener('click', (e) => {
    if (e.target === els.languageOverlay) closeLanguageModal();
  });
  els.languageList.addEventListener('click', (e) => {
    const btn = e.target.closest('.language-option');
    if (btn) openLanguageConfirm(btn.dataset.lang);
  });
  els.confirmLanguageBtn.addEventListener('click', confirmLanguageChange);
  els.cancelLanguageBtn.addEventListener('click', closeLanguageConfirm);
  els.languageConfirmOverlay.addEventListener('click', (e) => {
    if (e.target === els.languageConfirmOverlay) closeLanguageConfirm();
  });

  window.addEventListener('resize', () => renderWordsList());

  setTimeout(hideLoadingScreen, 350);
}
init();

