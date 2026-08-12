/* ============ TRIS — motore di gioco ============
   Il tris è un gioco tradizionale senza autore né proprietario: tre segni in
   fila su nove caselle, si gioca da secoli su qualunque foglio di carta. Codice,
   grafica e testi di questa pagina sono scritti da zero per questo sito.

   Due modi di giocare: contro il computer (TheCreator, tre livelli) o in due
   sullo stesso dispositivo, appoggiato sul tavolo fra i due giocatori — per
   questo la griglia non gira mai.

   Una cosa detta chiara nelle istruzioni invece di essere nascosta: a tris,
   giocando bene, non si perde. Il livello Master gioca perfetto e quindi non
   perde MAI: contro di lui il pari è il massimo risultato possibile, e infatti
   in classifica un pareggio vale un punto. */

// ---------- Lingua condivisa con tutto il sito ----------
const LANGUAGES = {
  it: { label: 'Italiano', flag: 'flag-it' },
  en: { label: 'English', flag: 'flag-en' },
  fr: { label: 'Français', flag: 'flag-fr' },
};
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    settingsTitle: 'Impostazioni',
    languageMenuLabel: 'Lingua',
    commands: 'Istruzioni',
    leaderboardMenuLabel: 'Classifica',
    languageTitle: 'Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    close: 'Chiudi',
    back: 'Indietro',
    play: 'Gioca',
    gotIt: 'Ho capito!',
    backToHome: 'Torna in Home',

    rulesTitle: 'Come si gioca',
    rule1: "La griglia ha nove caselle. Un giocatore ha la croce, l'altro il cerchio, e si gioca a turni.",
    rule2: "Tocca una casella libera: il tuo segno viene posato lì e tocca all'avversario.",
    rule3: 'Vince chi per primo mette tre segni suoi in fila: in orizzontale, in verticale o in diagonale.',
    rule4: 'Se si riempiono tutte e nove le caselle senza tre in fila, la partita è pari.',
    rule5: "Chi comincia si alterna a ogni partita: la prima mossa è un vantaggio, così ce l'avete a turno.",
    rule6: 'In due si gioca sullo stesso dispositivo, appoggiato in mezzo a voi: la griglia non gira mai, ognuno gioca dal suo lato.',
    rule7: 'Contro il computer: Stupido gioca quasi a caso, Normale prende la vittoria e para la minaccia, Master gioca perfetto e non perde mai — contro di lui il pari è il massimo.',
    rule8: 'In classifica una vittoria vale 3 punti e un pareggio 1. Contano solo le partite contro il computer.',

    modeTitle: 'Come vuoi giocare?',
    modeFriend: 'Con un amico',
    modeFriendSub: 'Sullo stesso dispositivo, a turni',
    modeComputer: 'Contro il computer',
    modeComputerSub: 'Tre livelli di difficoltà',

    creatorTitle: 'Giocherai contro TheCreator',
    creatorSub: 'il genio dietro questa bellissima app.',
    chooseDifficulty: 'Scegli la difficoltà',
    diffStupido: 'Stupido',
    diffNormale: 'Normale',
    diffMaster: 'Master',
    tauntStupido: '2+2 fa 5',
    tauntNormale: 'Dai su, giochiamo…',
    tauntMaster: 'Muahah, non vincerai mai!',

    friendTipTitle: "Uno di fronte all'altro",
    friendTipBody: 'Appoggia il dispositivo su un tavolo, in mezzo a voi due. La griglia non gira mai: ognuno gioca dal suo lato, come su un foglio appoggiato fra i due.',

    gameOptions: 'Partita',
    modeMenuLabel: 'Modalità',
    difficultyMenuLabel: 'Difficoltà',

    restartTitle: 'Ricominciare la partita?',
    restartBody: 'La partita in corso viene persa e si riparte dalla griglia vuota, con la stessa modalità.',
    restartYes: 'Sì, ricomincia',
    restartNo: 'No, continuo',
    changeDiffTitle: 'Cambiare difficoltà?',
    changeDiffBody: 'La partita in corso viene persa: si riparte dalla griglia vuota con la difficoltà nuova.',
    changeDiffYes: 'Sì, cambia',
    changeModeTitle: 'Cambiare modalità?',
    changeModeBody: 'La partita in corso viene persa: si riparte dalla scelta di come giocare.',

    you: 'Tu',
    creatorName: 'TheCreator',
    player1: 'Giocatore 1',
    player2: 'Giocatore 2',
    turnOf: n => `Tocca a ${n}`,
    yourTurn: 'Tocca a te',
    thinking: 'TheCreator sta pensando…',

    youWin: 'Hai vinto!',
    youLose: 'Ha vinto TheCreator',
    draw: 'Pari',
    winsP1: 'Ha vinto il Giocatore 1',
    winsP2: 'Ha vinto il Giocatore 2',
    winSub: (diff, pts) => `Hai battuto TheCreator a livello ${diff}: 3 punti. In tutto a questo livello: ${pts}.`,
    loseSub: diff => `Livello ${diff}. Riprova: la prossima è quella buona.`,
    drawSub: pts => `Nessuno dei due fa tre in fila. Un punto in classifica: in tutto a questo livello ${pts}.`,
    drawSubMaster: pts => `Pari contro il Master, che è il massimo che si può fare: gioca perfetto e non perde mai. Un punto in classifica, in tutto ${pts}.`,
    friendEndSub: 'Bella partita. Rigiocate?',
    playAgain: 'Rigioca',
    changeMode: 'Cambia modalità',

    leaderboardTitle: 'Classifica',
    leaderboardNote: 'Contano solo le partite contro il computer: 3 punti per una vittoria, 1 per un pareggio.',
    leaderboardEmpty: 'Nessun punto ancora: gioca da loggato per essere il primo!',
    pointsShort: n => `${n} punti`,
  },
  en: {
    settingsTitle: 'Settings',
    languageMenuLabel: 'Language',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Leaderboard',
    languageTitle: 'Language',
    languageSub: 'Choose the interface language',
    close: 'Close',
    back: 'Back',
    play: 'Play',
    gotIt: 'Got it!',
    backToHome: 'Back to Home',

    rulesTitle: 'How to play',
    rule1: 'The grid has nine squares. One player has the cross, the other the circle, and you take turns.',
    rule2: 'Tap a free square: your mark is laid there and it becomes your opponent\'s turn.',
    rule3: 'You win by being the first to line up three of your own marks: across, down or diagonally.',
    rule4: 'If all nine squares are filled with no three in a row, the game is a draw.',
    rule5: 'Who goes first alternates every game: the first move is an advantage, so you take turns having it.',
    rule6: 'Two players share one device, laid flat between you: the grid never rotates, each of you plays from your own side.',
    rule7: 'Against the computer: Dumb plays almost at random, Normal takes the win and blocks the threat, Master plays perfectly and never loses — against them a draw is the best there is.',
    rule8: 'On the leaderboard a win is worth 3 points and a draw 1. Only games against the computer count.',

    modeTitle: 'How do you want to play?',
    modeFriend: 'With a friend',
    modeFriendSub: 'Same device, taking turns',
    modeComputer: 'Against the computer',
    modeComputerSub: 'Three difficulty levels',

    creatorTitle: "You'll play against TheCreator",
    creatorSub: 'the genius behind this beautiful app.',
    chooseDifficulty: 'Choose the difficulty',
    diffStupido: 'Dumb',
    diffNormale: 'Normal',
    diffMaster: 'Master',
    tauntStupido: '2+2 is 5',
    tauntNormale: "Come on, let's play…",
    tauntMaster: "Muahaha, you'll never win!",

    friendTipTitle: 'Face to face',
    friendTipBody: 'Put the device flat on a table, between the two of you. The grid never rotates: each player plays from their own side, like on a sheet of paper lying between you.',

    gameOptions: 'Game',
    modeMenuLabel: 'Mode',
    difficultyMenuLabel: 'Difficulty',

    restartTitle: 'Restart the game?',
    restartBody: 'The current game is lost and the grid starts empty again, same mode as now.',
    restartYes: 'Yes, restart',
    restartNo: 'No, keep playing',
    changeDiffTitle: 'Change difficulty?',
    changeDiffBody: 'The current game is lost: the grid starts empty again at the new difficulty.',
    changeDiffYes: 'Yes, change it',
    changeModeTitle: 'Change mode?',
    changeModeBody: 'The current game is lost: you go back to choosing how to play.',

    you: 'You',
    creatorName: 'TheCreator',
    player1: 'Player 1',
    player2: 'Player 2',
    turnOf: n => `${n}'s turn`,
    yourTurn: 'Your turn',
    thinking: 'TheCreator is thinking…',

    youWin: 'You win!',
    youLose: 'TheCreator wins',
    draw: 'Draw',
    winsP1: 'Player 1 wins',
    winsP2: 'Player 2 wins',
    winSub: (diff, pts) => `You beat TheCreator on ${diff}: 3 points. Total at this level: ${pts}.`,
    loseSub: diff => `Level ${diff}. Try again: the next one is yours.`,
    drawSub: pts => `Neither side lines up three. One point on the leaderboard: ${pts} in total at this level.`,
    drawSubMaster: pts => `A draw against Master, which is the best there is: they play perfectly and never lose. One point on the leaderboard, ${pts} in total.`,
    friendEndSub: 'Good game. Another one?',
    playAgain: 'Play again',
    changeMode: 'Change mode',

    leaderboardTitle: 'Leaderboard',
    leaderboardNote: 'Only games against the computer count: 3 points for a win, 1 for a draw.',
    leaderboardEmpty: 'No points yet: play while signed in to be the first!',
    pointsShort: n => `${n} pts`,
  },
  fr: {
    settingsTitle: 'Paramètres',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Classement',
    languageTitle: 'Langue',
    languageSub: "Choisis la langue de l'interface",
    close: 'Fermer',
    back: 'Retour',
    play: 'Jouer',
    gotIt: 'Compris !',
    backToHome: "Retour à l'accueil",

    rulesTitle: 'Comment jouer',
    rule1: "La grille a neuf cases. Un joueur a la croix, l'autre le cercle, et on joue chacun son tour.",
    rule2: "Touche une case libre : ton signe y est posé et c'est au tour de l'adversaire.",
    rule3: 'Gagne celui qui aligne le premier trois de ses signes : en ligne, en colonne ou en diagonale.',
    rule4: 'Si les neuf cases sont remplies sans alignement, la partie est nulle.',
    rule5: "Celui qui commence change à chaque partie : le premier coup est un avantage, alors vous l'avez chacun votre tour.",
    rule6: "À deux on joue sur le même appareil, posé à plat entre vous : la grille ne tourne jamais, chacun joue de son côté.",
    rule7: "Contre l'ordinateur : Bête joue presque au hasard, Normal prend la victoire et bloque la menace, Maître joue parfaitement et ne perd jamais — contre lui, le nul est le maximum.",
    rule8: "Au classement une victoire vaut 3 points et un nul 1. Seules les parties contre l'ordinateur comptent.",

    modeTitle: 'Comment veux-tu jouer ?',
    modeFriend: 'Avec un ami',
    modeFriendSub: 'Sur le même appareil, chacun son tour',
    modeComputer: "Contre l'ordinateur",
    modeComputerSub: 'Trois niveaux de difficulté',

    creatorTitle: 'Tu joueras contre TheCreator',
    creatorSub: 'le génie derrière cette superbe appli.',
    chooseDifficulty: 'Choisis la difficulté',
    diffStupido: 'Bête',
    diffNormale: 'Normal',
    diffMaster: 'Maître',
    tauntStupido: '2+2 font 5',
    tauntNormale: 'Allez, on joue…',
    tauntMaster: 'Mouahah, tu ne gagneras jamais !',

    friendTipTitle: "L'un en face de l'autre",
    friendTipBody: "Pose l'appareil à plat sur une table, entre vous deux. La grille ne tourne jamais : chacun joue de son côté, comme sur une feuille posée entre vous.",

    gameOptions: 'Partie',
    modeMenuLabel: 'Mode',
    difficultyMenuLabel: 'Difficulté',

    restartTitle: 'Recommencer la partie ?',
    restartBody: 'La partie en cours est perdue et on repart de la grille vide, dans le même mode.',
    restartYes: 'Oui, recommencer',
    restartNo: 'Non, je continue',
    changeDiffTitle: 'Changer de difficulté ?',
    changeDiffBody: 'La partie en cours est perdue : on repart de la grille vide avec la nouvelle difficulté.',
    changeDiffYes: 'Oui, changer',
    changeModeTitle: 'Changer de mode ?',
    changeModeBody: 'La partie en cours est perdue : on revient au choix du mode de jeu.',

    you: 'Toi',
    creatorName: 'TheCreator',
    player1: 'Joueur 1',
    player2: 'Joueur 2',
    turnOf: n => `Au tour de ${n}`,
    yourTurn: 'À toi de jouer',
    thinking: 'TheCreator réfléchit…',

    youWin: 'Tu as gagné !',
    youLose: 'TheCreator a gagné',
    draw: 'Match nul',
    winsP1: 'Le Joueur 1 a gagné',
    winsP2: 'Le Joueur 2 a gagné',
    winSub: (diff, pts) => `Tu as battu TheCreator en ${diff} : 3 points. En tout à ce niveau : ${pts}.`,
    loseSub: diff => `Niveau ${diff}. Réessaie : la prochaine est la bonne.`,
    drawSub: pts => `Personne n'aligne trois signes. Un point au classement : ${pts} en tout à ce niveau.`,
    drawSubMaster: pts => `Nul contre le Maître, et c'est le maximum : il joue parfaitement et ne perd jamais. Un point au classement, ${pts} en tout.`,
    friendEndSub: 'Belle partie. On rejoue ?',
    playAgain: 'Rejouer',
    changeMode: 'Changer de mode',

    leaderboardTitle: 'Classement',
    leaderboardNote: "Seules les parties contre l'ordinateur comptent : 3 points pour une victoire, 1 pour un nul.",
    leaderboardEmpty: 'Aucun point pour le moment : joue connecté pour être le premier !',
    pointsShort: n => `${n} pts`,
  },
};

let language = 'it';
function getSiteLanguage() {
  try { const v = localStorage.getItem(SITE_LANGUAGE_KEY); return (v && UI_STRINGS[v]) ? v : 'it'; } catch (e) { return 'it'; }
}
function setSiteLanguage(code) {
  try { localStorage.setItem(SITE_LANGUAGE_KEY, code); } catch (e) { /* ignora */ }
}
function t() { return UI_STRINGS[language] || UI_STRINGS.it; }

// ---------- Elementi ----------
const els = {
  loading: document.getElementById('loadingScreen'),
  gameZone: document.getElementById('gameZone'),
  tableStack: document.getElementById('tableStack'),
  boardFrame: document.getElementById('boardFrame'),
  boardCells: document.getElementById('boardCells'),
  boardLine: document.getElementById('boardLine'),
  turnPill: document.getElementById('turnPill'),
  plateTop: document.getElementById('plateTop'),
  plateTopName: document.getElementById('plateTopName'),
  plateTopMark: document.getElementById('plateTopMark'),
  plateTopCount: document.getElementById('plateTopCount'),
  plateBottom: document.getElementById('plateBottom'),
  plateBottomName: document.getElementById('plateBottomName'),
  plateBottomMark: document.getElementById('plateBottomMark'),
  plateBottomCount: document.getElementById('plateBottomCount'),

  restartBtn: document.getElementById('restartBtn'),
  settingsBtn: document.getElementById('settingsBtn'),

  rulesOverlay: document.getElementById('rulesOverlay'),
  closeRulesBtn: document.getElementById('closeRulesBtn'),
  modeOverlay: document.getElementById('modeOverlay'),
  modeFriendBtn: document.getElementById('modeFriendBtn'),
  modeComputerBtn: document.getElementById('modeComputerBtn'),
  difficultyOverlay: document.getElementById('difficultyOverlay'),
  backToModeBtn: document.getElementById('backToModeBtn'),
  tauntOverlay: document.getElementById('tauntOverlay'),
  tauntLine: document.getElementById('tauntLine'),
  tauntPlayBtn: document.getElementById('tauntPlayBtn'),
  tauntBackBtn: document.getElementById('tauntBackBtn'),
  friendTipOverlay: document.getElementById('friendTipOverlay'),
  friendPlayBtn: document.getElementById('friendPlayBtn'),
  friendBackBtn: document.getElementById('friendBackBtn'),
  confirmOverlay: document.getElementById('confirmOverlay'),
  confirmTitle: document.getElementById('confirmTitle'),
  confirmBody: document.getElementById('confirmBody'),
  confirmYesBtn: document.getElementById('confirmYesBtn'),
  confirmNoBtn: document.getElementById('confirmNoBtn'),
  endOverlay: document.getElementById('endOverlay'),
  endIcon: document.getElementById('endIcon'),
  endTitle: document.getElementById('endTitle'),
  endSub: document.getElementById('endSub'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  changeModeBtn: document.getElementById('changeModeBtn'),

  settingsOverlay: document.getElementById('settingsOverlay'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  openLanguageBtn: document.getElementById('openLanguageBtn'),
  openRulesBtn: document.getElementById('openRulesBtn'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  openModeBtn: document.getElementById('openModeBtn'),
  modeValue: document.getElementById('modeValue'),
  openDifficultyBtn: document.getElementById('openDifficultyBtn'),
  difficultyValue: document.getElementById('difficultyValue'),
  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  leaderboardOverlay: document.getElementById('leaderboardOverlay'),
  leaderboardTabs: document.getElementById('leaderboardTabs'),
  leaderboardList: document.getElementById('leaderboardList'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
};

// ============================================================
//  REGOLE
// ============================================================
// Nove caselle, indice = riga*3 + colonna, riga 0 in alto.
// Valori: 1 il giocatore in basso (la croce), -1 quello in alto (il cerchio).
const SIZE = 3;
const BOTTOM = 1;
const TOP = -1;
const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // righe
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // colonne
  [0, 4, 8], [2, 4, 6],              // diagonali
];

function emptyBoard() { return new Int8Array(SIZE * SIZE); }
function freeCells(board) {
  const out = [];
  for (let i = 0; i < board.length; i++) if (board[i] === 0) out.push(i);
  return out;
}
// Chi ha vinto e con quale terna. Restituisce null se non ha vinto nessuno.
function winnerOf(board) {
  for (const line of LINES) {
    const v = board[line[0]];
    if (v !== 0 && board[line[1]] === v && board[line[2]] === v) return { side: v, line };
  }
  return null;
}
function isFull(board) {
  for (let i = 0; i < board.length; i++) if (board[i] === 0) return false;
  return true;
}
// Una casella che, giocata, chiude subito la partita per `side`
function winningCells(board, side) {
  const out = [];
  for (const i of freeCells(board)) {
    board[i] = side;
    if (winnerOf(board)) out.push(i);
    board[i] = 0;
  }
  return out;
}

// ============================================================
//  IL COMPUTER (TheCreator)
// ============================================================
// A tris le posizioni sono poche (meno di 550.000 partite intere): il minimax
// completo si calcola in una frazione di millisecondo, senza tabelle né tagli.
// Il livello Master lo usa nudo, e quindi gioca perfetto: non perde mai. Gli
// altri due sono più deboli per davvero — giocano peggio, non "fanno finta".
function minimax(board, side, depth) {
  const win = winnerOf(board);
  if (win) return win.side === side ? 10 - depth : depth - 10;
  if (isFull(board)) return 0;
  let best = -Infinity;
  for (const i of freeCells(board)) {
    board[i] = side;
    const score = -minimax(board, -side, depth + 1);
    board[i] = 0;
    if (score > best) best = score;
  }
  return best;
}
// Tutte le mosse migliori a pari punteggio: fra loro si sceglie a caso, così
// due partite di fila contro il Master non sono la stessa partita.
function bestMoves(board, side) {
  let best = -Infinity;
  let out = [];
  for (const i of freeCells(board)) {
    board[i] = side;
    const score = -minimax(board, -side, 1);
    board[i] = 0;
    if (score > best) { best = score; out = [i]; }
    else if (score === best) out.push(i);
  }
  return out;
}
function pickOne(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function chooseAiMove(board, side, difficulty) {
  const free = freeCells(board);
  if (!free.length) return null;
  const mine = winningCells(board, side);
  const theirs = winningCells(board, -side);

  if (difficulty === 'master') return pickOne(bestMoves(board, side));

  if (difficulty === 'stupido') {
    // gioca quasi sempre a caso: vede la vittoria solo una volta su quattro e
    // le minacce non le guarda proprio. Sbaglia sul serio, non per finta.
    if (mine.length && Math.random() < 0.25) return pickOne(mine);
    return pickOne(free);
  }

  // normale: chiude se può chiudere, para se sta per perdere, e per il resto
  // prende il centro quando è libero. Non guarda avanti: chi prepara due
  // minacce in una mossa sola lo batte, ed è proprio quello che deve succedere.
  if (mine.length) return pickOne(mine);
  if (theirs.length) return pickOne(theirs);
  if (board[4] === 0 && Math.random() < 0.75) return 4;
  return pickOne(free);
}

// ============================================================
//  STATO E INTERFACCIA
// ============================================================
const state = {
  mode: null,            // 'pc' | 'friend'
  difficulty: null,
  board: emptyBoard(),
  turn: BOTTOM,
  starter: BOTTOM,       // chi ha cominciato questa partita
  humanSide: BOTTOM,     // contro il computer l'umano gioca sempre da sotto
  busy: false,
  started: false,
  over: false,
  winLine: null,
  session: { 1: 0, '-1': 0 },   // partite vinte da ognuno dei due, da quando la pagina è aperta
};

let metrics = { cell: 90 };
let pendingConfirm = null;

// La misura della griglia si prende dallo spazio che resta davvero, non da una
// percentuale dello schermo scelta a occhio: la zona di gioco è l'elemento
// elastico del layout, quindi la sua altezza è già "quello che avanza" fra le
// due targhe dei giocatori, su qualunque telefono o tablet.
function layout() {
  const cs = getComputedStyle(els.gameZone);
  const w = els.gameZone.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  // le targhe stanno nella stessa colonna della griglia: la loro altezza dipende
  // solo dal testo, mai da quanto è grande la griglia, quindi si può togliere
  // dallo spazio disponibile senza girare in tondo (20px sono i due spazi fra
  // targhe e pannello, `gap` di .table-stack)
  const plates = els.plateTop.offsetHeight + els.plateBottom.offsetHeight + 20;
  const h = els.gameZone.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - plates;
  const avail = Math.min(w, h);
  if (avail <= 0) return;
  // 3 caselle più la cornice di pietra, che è disegnata FUORI dal pannello e
  // vale 0,075 di casella per lato
  const cell = Math.max(40, Math.min(190, Math.floor(avail / 3.15)));
  metrics = { cell };
  els.tableStack.style.setProperty('--board', (cell * SIZE) + 'px');
  els.tableStack.style.setProperty('--cell', cell + 'px');
  els.boardLine.setAttribute('viewBox', `0 0 ${cell * SIZE} ${cell * SIZE}`);
  positionCells();
  renderBoard(-1);
}
function xOf(i) { return (i % SIZE) * metrics.cell; }
function yOf(i) { return ((i / SIZE) | 0) * metrics.cell; }

function buildCells() {
  els.boardCells.innerHTML = '';
  for (let i = 0; i < SIZE * SIZE; i++) {
    const el = document.createElement('div');
    el.className = 'cell';
    el.dataset.i = i;
    el.innerHTML = '<div class="stone"></div>';
    els.boardCells.appendChild(el);
  }
}
function positionCells() {
  els.boardCells.querySelectorAll('.cell').forEach(el => {
    const i = +el.dataset.i;
    el.style.transform = `translate(${xOf(i)}px, ${yOf(i)}px)`;
  });
}

// ---------- I due segni ----------
// Croce e cerchio sono due tratti pieni, disegnati come li farebbe una mano
// sulla pietra: la croce in due colpi, il cerchio in un giro solo. Le due
// diagonali e il tondo stanno tutti sulle 100 unità della casella, così il
// segno vale a qualunque misura della griglia.
const PATH_X = ['M28,28 L72,72', 'M72,28 L28,72'];
// il tondo in due mezzi archi: un cerchio unico, che si può disegnare partendo
// da sopra e girando, invece di comparire tutto insieme
const PATH_O = ['M50,28 a22,22 0 1,1 0,44 a22,22 0 1,1 0,-44'];

// Il segno di una casella. `animate` a false vuol dire "il segno c'era già"
// (ridisegno dopo un cambio di misura): compare finito, invece di rifarsi da
// capo a ogni rotazione dello schermo.
function markSvg(side, animate) {
  const paths = side === BOTTOM ? PATH_X : PATH_O;
  const kind = side === BOTTOM ? 'x' : 'o';
  let out = `<svg class="mark mark-${kind}${animate ? '' : ' settled'}" viewBox="0 0 100 100" aria-hidden="true">`;
  paths.forEach((d, n) => {
    // `pathLength="100"` fa misurare ogni tratto in centesimi: il tratteggio
    // che lo scopre poco alla volta è sempre lungo uguale, curva o retta
    out += `<path class="stroke" d="${d}" pathLength="100"`
      + ` style="animation-delay:${animate ? n * 150 : 0}ms"/>`;
  });
  return out + '</svg>';
}

// `lastPlaced` è la casella appena giocata: solo lì il segno si disegna davanti
// agli occhi, gli altri sono già a posto.
function renderBoard(lastPlaced) {
  els.boardCells.querySelectorAll('.cell').forEach(el => {
    const i = +el.dataset.i;
    const v = state.board[i];
    const old = el.querySelector('.mark');
    if (old) old.remove();
    if (v !== 0) el.insertAdjacentHTML('beforeend', markSvg(v, i === lastPlaced));
    el.classList.toggle('free', v === 0 && state.started && !state.over && !state.busy);
    el.classList.toggle('win', !!(state.winLine && state.winLine.includes(i)));
  });
  renderWinLine();
}

// La riga vincente: un tratto solo, del colore di chi ha vinto, dal centro
// della prima casella al centro dell'ultima.
function renderWinLine() {
  els.boardLine.innerHTML = '';
  if (!state.winLine) return;
  const cell = metrics.cell;
  const c0 = state.winLine[0];
  const c2 = state.winLine[2];
  const ang = Math.atan2(yOf(c2) - yOf(c0), xOf(c2) - xOf(c0));
  const extra = cell * 0.26;                       // sborda un po' dai due segni
  const x0 = xOf(c0) + cell / 2 - Math.cos(ang) * extra;
  const y0 = yOf(c0) + cell / 2 - Math.sin(ang) * extra;
  const x1 = xOf(c2) + cell / 2 + Math.cos(ang) * extra;
  const y1 = yOf(c2) + cell / 2 + Math.sin(ang) * extra;
  const w = cell * 0.085;
  const kind = state.board[c0] === BOTTOM ? 'x' : 'o';
  // il tratto è un <path> e non un <line>: `pathLength`, che serve a scoprirlo
  // poco alla volta, sulle forme semplici non lo rispettano tutti i browser
  // (qui in Firefox la riga restava invisibile), sui path sì
  const d = `M${x0.toFixed(1)},${y0.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)}`;
  const pos = ` d="${d}" pathLength="100"`;
  // sotto al tratto colorato ne passa uno color pietra, un filo più largo: la
  // riga vincente è dello stesso colore del segno che ha vinto, e senza questo
  // fondo si confonderebbe con le tre croci (o i tre cerchi) che attraversa
  els.boardLine.innerHTML =
    `<path class="win-stroke casing"${pos} stroke-width="${(w * 2).toFixed(1)}"/>` +
    `<path class="win-stroke win-${kind}"${pos} stroke-width="${w.toFixed(1)}"/>`;
}

function markFor(side) { return markSvg(side, false); }

function playerName(side) {
  if (state.mode === 'friend') return side === BOTTOM ? t().player1 : t().player2;
  if (side === state.humanSide) {
    const auth = window.FFR && window.FFR.auth;
    const nick = auth ? auth.getNickname() : null;
    return nick || t().you;
  }
  return t().creatorName;
}

function updateHUD() {
  els.plateBottomName.textContent = playerName(BOTTOM);
  els.plateTopName.textContent = playerName(TOP);
  els.plateBottomMark.innerHTML = markFor(BOTTOM);
  els.plateTopMark.innerHTML = markFor(TOP);
  els.plateBottomCount.textContent = String(state.session[BOTTOM]);
  els.plateTopCount.textContent = String(state.session[TOP]);
  // in due sullo stesso dispositivo chi sta di fronte legge sottosopra
  els.plateTop.classList.toggle('flipped', state.mode === 'friend');
  els.plateBottom.classList.toggle('is-turn', state.started && !state.over && state.turn === BOTTOM);
  els.plateTop.classList.toggle('is-turn', state.started && !state.over && state.turn === TOP);

  els.turnPill.classList.remove('thinking');
  if (!state.started || state.over) { els.turnPill.textContent = '—'; return; }
  if (state.mode === 'pc' && state.turn !== state.humanSide) {
    els.turnPill.textContent = t().thinking;
    els.turnPill.classList.add('thinking');
    return;
  }
  // "Tocca a te" invece di "Tocca a Tu": chi gioca contro il computer senza
  // essersi loggato non ha un nome da mettere nella frase
  const name = playerName(state.turn);
  els.turnPill.textContent = (name === t().you) ? t().yourTurn : t().turnOf(name);
}

function updateSettingsValues() {
  els.modeValue.textContent = state.mode === 'friend' ? t().modeFriend : (state.mode === 'pc' ? t().modeComputer : '—');
  els.difficultyValue.textContent = state.difficulty ? diffLabel(state.difficulty) : '—';
  // la difficoltà esiste solo contro il computer: in due sarebbe una riga morta
  els.openDifficultyBtn.hidden = state.mode !== 'pc';
}
function diffLabel(diff) {
  return t()['diff' + diff.charAt(0).toUpperCase() + diff.slice(1)];
}

// ---------- Mosse giocate ----------
function place(i) {
  if (state.board[i] !== 0) return;
  const mover = state.turn;
  state.board[i] = mover;

  const win = winnerOf(state.board);
  if (win) {
    state.winLine = win.line;
    state.over = true;
    renderBoard(i);
    updateHUD();
    state.session[mover] += 1;
    // il pannello di fine partita aspetta che il segno e la riga vincente
    // finiscano di disegnarsi: chiudere sopra all'animazione la nasconderebbe
    setTimeout(() => finishGame(mover), 900);
    return;
  }
  if (isFull(state.board)) {
    state.over = true;
    renderBoard(i);
    updateHUD();
    setTimeout(() => finishGame(null), 650);
    return;
  }

  state.turn = -mover;
  renderBoard(i);
  updateHUD();
  maybeRunAi();
}

function maybeRunAi() {
  if (state.mode !== 'pc' || state.over || state.turn === state.humanSide) return;
  state.busy = true;
  updateHUD();
  renderBoard(-1);
  // una risposta immediata sembra una svista: TheCreator ci mette un momento,
  // il tempo di leggere la scritta "sta pensando…"
  setTimeout(() => {
    const move = chooseAiMove(state.board, state.turn, state.difficulty);
    state.busy = false;
    if (move == null) return;
    place(move);
  }, 480);
}

// ---------- Tocco sulla griglia ----------
function cellFromEvent(e) {
  const rect = els.boardFrame.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
  const c = Math.min(SIZE - 1, Math.floor(x / metrics.cell));
  const r = Math.min(SIZE - 1, Math.floor(y / metrics.cell));
  return r * SIZE + c;
}
function onBoardClick(e) {
  if (!state.started || state.over || state.busy) return;
  if (state.mode === 'pc' && state.turn !== state.humanSide) return;
  const i = cellFromEvent(e);
  if (i == null || state.board[i] !== 0) return;
  place(i);
}

// ---------- Fine partita ----------
// Icona grande della schermata di fine partita: la corona per chi ha vinto, il
// robot quando ha vinto il computer, il segno di parità per il pareggio. Il
// pareggio resta un carattere: è un segno matematico, non un disegno, e i
// caratteri '=' li hanno tutti.
function setEndIcon(kind) {
  if (kind === 'draw') { els.endIcon.textContent = '='; return; }
  els.endIcon.innerHTML = '<span class="ffr-ico" data-ico="' + kind + '"></span>';
  window.FFR.icons(els.endIcon);
}

function finishGame(winnerSide) {
  state.over = true;
  state.busy = false;
  updateHUD();
  renderBoard(-1);

  const label = state.difficulty ? diffLabel(state.difficulty) : '';
  if (state.mode === 'pc') {
    if (winnerSide === null) {
      const pts = recordResult('draws');
      setEndIcon('draw');
      els.endTitle.textContent = t().draw;
      els.endSub.textContent = state.difficulty === 'master' ? t().drawSubMaster(pts) : t().drawSub(pts);
    } else if (winnerSide === state.humanSide) {
      const pts = recordResult('wins');
      setEndIcon('crown');
      els.endTitle.textContent = t().youWin;
      els.endSub.textContent = t().winSub(label, pts);
    } else {
      recordResult('losses');
      setEndIcon('robot');
      els.endTitle.textContent = t().youLose;
      els.endSub.textContent = t().loseSub(label);
    }
  } else {
    if (winnerSide === null) {
      setEndIcon('draw');
      els.endTitle.textContent = t().draw;
      els.endSub.textContent = t().friendEndSub;
    } else {
      setEndIcon('crown');
      els.endTitle.textContent = winnerSide === BOTTOM ? t().winsP1 : t().winsP2;
      els.endSub.textContent = t().friendEndSub;
    }
  }
  els.endOverlay.classList.add('show');
}

// ---------- Progresso e classifica ----------
// In classifica va solo quello che si fa contro il computer: in due sullo stesso
// dispositivo basterebbe farsi vincere a vicenda per gonfiare il punteggio.
// Ogni difficoltà ha la sua graduatoria (voce 'tris:<difficoltà>', vedi saveScore
// in shared/auth.js) e si gareggia sui punti: 3 per una vittoria, 1 per un
// pareggio. Il pareggio conta perché contro il Master è il massimo possibile —
// a tris, giocando perfetto, non si perde e non si vince.
const DIFFICULTY_KEYS = ['stupido', 'normale', 'master'];
const WIN_POINTS = 3;
const DRAW_POINTS = 1;
let stats = emptyStats();
function emptyStats() {
  const s = {};
  for (const k of DIFFICULTY_KEYS) s[k] = { wins: 0, losses: 0, draws: 0 };
  return s;
}
function pointsOf(key) {
  const row = stats[key];
  if (!row) return 0;
  return row.wins * WIN_POINTS + row.draws * DRAW_POINTS;
}
function totalPoints() {
  return DIFFICULTY_KEYS.reduce((n, k) => n + pointsOf(k), 0);
}
function recordResult(field) {
  const key = state.difficulty;
  if (!key || !stats[key]) return 0;
  stats[key][field] += 1;
  saveTrisProgress();
  if (window.FFR && window.FFR.auth) {
    window.FFR.auth.saveScore('tris:' + key, pointsOf(key));
  }
  return pointsOf(key);
}
function saveTrisProgress() {
  if (!(window.FFR && window.FFR.auth)) return;
  window.FFR.auth.saveProgress('tris', { stats }, totalPoints());
}
// Un salvataggio con una forma che non riconosciamo non deve far perdere i punti
// già fatti: si legge quello che si riesce a leggere e basta.
function normalizeSaved(saved) {
  const out = emptyStats();
  if (!saved || typeof saved !== 'object' || !saved.stats) return out;
  for (const k of DIFFICULTY_KEYS) {
    const row = saved.stats[k];
    if (!row || typeof row !== 'object') continue;
    out[k] = {
      wins: Math.max(0, Number(row.wins) || 0),
      losses: Math.max(0, Number(row.losses) || 0),
      draws: Math.max(0, Number(row.draws) || 0),
    };
  }
  return out;
}
async function loadTrisProgress() {
  if (!(window.FFR && window.FFR.auth)) return emptyStats();
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return normalizeSaved(await window.FFR.auth.loadProgress('tris'));
}

let leaderboardDifficulty = 'normale';
function openLeaderboard() {
  els.settingsOverlay.classList.remove('show');
  els.leaderboardOverlay.classList.add('show');
  leaderboardDifficulty = state.difficulty || 'normale';
  renderLeaderboardTabs();
  loadLeaderboardFor(leaderboardDifficulty);
}
function closeLeaderboard() {
  els.leaderboardOverlay.classList.remove('show');
  els.settingsOverlay.classList.add('show');
}
function renderLeaderboardTabs() {
  els.leaderboardTabs.querySelectorAll('.lb-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === leaderboardDifficulty);
  });
}
async function loadLeaderboardFor(difficultyKey) {
  els.leaderboardList.innerHTML = '<div class="leaderboard-empty">…</div>';
  const auth = (window.FFR && window.FFR.auth) ? window.FFR.auth : null;
  const gameKey = 'tris:' + difficultyKey;
  const [rows, me] = await Promise.all([
    auth ? auth.getLeaderboard(gameKey, 50) : [],
    auth ? auth.getMyRank(gameKey) : null,
  ]);
  if (difficultyKey !== leaderboardDifficulty) return;   // l'utente ha già cambiato scheda
  if (!rows.length) {
    els.leaderboardList.innerHTML = `<div class="leaderboard-empty">${t().leaderboardEmpty}</div>`;
    return;
  }
  const myNickname = auth ? auth.getNickname() : null;
  els.leaderboardList.innerHTML = buildLeaderboardRows(rows, me, myNickname, n => t().pointsShort(n));
}
// Righe della classifica con la regola condivisa del sito: se ne vedono 6 per
// volta e, quando chi guarda è fuori dalle prime 5, la sua riga viene infilata
// come 6ª (evidenziata) così si vede subito senza scorrere.
function buildLeaderboardRows(rows, me, myNickname, formatScore) {
  const row = (pos, nickname, score, isMe) => `
    <div class="leaderboard-row${isMe ? ' is-me' : ''}">
      <span class="leaderboard-rank">N.${pos}</span>
      <span class="leaderboard-name">${escapeHtml(nickname)}</span>
      <span class="leaderboard-score">${formatScore(score)}</span>
    </div>`;
  const html = rows.map((r, i) => row(i + 1, r.nickname, r.score, myNickname && r.nickname === myNickname));
  if (me && me.rank > 5 && myNickname) html.splice(5, 0, row(me.rank, myNickname, me.score, true));
  return html.join('');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- Traduzioni ----------
function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t()[el.dataset.i18n];
    if (typeof val === 'string') el.textContent = val;
  });
  if (state.difficulty) els.tauntLine.textContent = tauntFor(state.difficulty);
  updateSettingsValues();
  updateHUD();
}
function tauntFor(diff) {
  return t()['taunt' + diff.charAt(0).toUpperCase() + diff.slice(1)];
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

// ---------- Flusso dei pannelli ----------
function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('show'));
}
function showOnly(el) {
  hideAllOverlays();
  // la difficoltà con cui si sta giocando (o l'ultima usata) si vede accesa:
  // aprendo il pannello si capisce da dove si riparte
  if (el === els.difficultyOverlay) {
    el.querySelectorAll('.difficulty-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.difficulty === state.difficulty);
    });
  }
  el.classList.add('show');
}
// C'è una partita cominciata e non ancora finita? Allora buttarla via si chiede.
function gameInProgress() {
  return state.started && !state.over && state.board.some(v => v !== 0);
}
function askConfirm(titleKey, bodyKey, yesKey, action) {
  els.confirmTitle.textContent = t()[titleKey];
  els.confirmBody.textContent = t()[bodyKey];
  els.confirmYesBtn.textContent = t()[yesKey];
  pendingConfirm = action;
  els.confirmOverlay.classList.add('show');
}

function startNewGame() {
  state.board = emptyBoard();
  // chi comincia si alterna a ogni partita: la prima mossa è un vantaggio vero,
  // e contro il computer la prima partita la comincia sempre chi gioca
  state.turn = state.starter;
  state.busy = false;
  state.over = false;
  state.started = true;
  state.winLine = null;
  state.starter = -state.starter;
  hideAllOverlays();
  layout();
  updateHUD();
  maybeRunAi();
}
function goToMode() {
  state.started = false;
  state.over = false;
  state.mode = null;
  state.difficulty = null;
  state.board = emptyBoard();
  state.winLine = null;
  state.starter = BOTTOM;
  updateHUD();
  updateSettingsValues();
  renderBoard(-1);
  showOnly(els.modeOverlay);
}

// La X condivisa (shared/modal-x.js) chiude il pannello e basta: se dietro non
// c'è una partita a cui tornare, chi gioca resterebbe davanti a una griglia
// morta. Qui si riporta alla scelta di come giocare.
window.FFR_ON_MODAL_CLOSE = function () {
  if (state.started && !state.over) return;
  if (document.querySelector('.overlay.show')) return;
  showOnly(els.modeOverlay);
};

// ---------- Avvio ----------
async function init() {
  language = getSiteLanguage() || 'it';
  buildCells();
  applyTranslations();
  layout();

  els.boardFrame.addEventListener('click', onBoardClick);
  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 250));

  // regole → modalità → (difficoltà → sfottò) oppure (consiglio per giocare in due)
  els.closeRulesBtn.addEventListener('click', () => {
    if (state.started) { showOnly(els.settingsOverlay); return; }   // riaperte dal menu
    showOnly(els.modeOverlay);
  });
  els.modeFriendBtn.addEventListener('click', () => {
    state.mode = 'friend';
    state.difficulty = null;
    state.starter = BOTTOM;
    updateHUD();                       // le targhe prendono subito i nomi giusti
    updateSettingsValues();
    showOnly(els.friendTipOverlay);
  });
  els.modeComputerBtn.addEventListener('click', () => {
    state.mode = 'pc';
    state.starter = BOTTOM;            // la prima partita la comincia chi gioca
    updateHUD();
    updateSettingsValues();
    showOnly(els.difficultyOverlay);
  });
  els.backToModeBtn.addEventListener('click', goToMode);
  els.difficultyOverlay.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.difficulty = btn.dataset.difficulty;
      updateSettingsValues();
      els.tauntLine.textContent = tauntFor(state.difficulty);
      showOnly(els.tauntOverlay);
    });
  });
  els.tauntBackBtn.addEventListener('click', () => showOnly(els.difficultyOverlay));
  els.tauntPlayBtn.addEventListener('click', () => startNewGame());
  els.friendBackBtn.addEventListener('click', goToMode);
  els.friendPlayBtn.addEventListener('click', () => startNewGame());

  els.restartBtn.addEventListener('click', () => {
    // fuori da una partita (o a partita finita) questo pulsante è la via di
    // ritorno: riporta alla scelta della modalità
    if (!state.started || state.over) { goToMode(); return; }
    if (!gameInProgress()) { startNewGame(); return; }   // griglia ancora vuota: niente da perdere
    askConfirm('restartTitle', 'restartBody', 'restartYes', () => startNewGame());
  });
  els.confirmNoBtn.addEventListener('click', () => {
    pendingConfirm = null;
    els.confirmOverlay.classList.remove('show');
  });
  els.confirmYesBtn.addEventListener('click', () => {
    const action = pendingConfirm;
    pendingConfirm = null;
    els.confirmOverlay.classList.remove('show');
    if (action) action();
  });

  els.playAgainBtn.addEventListener('click', () => startNewGame());
  els.changeModeBtn.addEventListener('click', goToMode);

  els.settingsBtn.addEventListener('click', () => {
    updateSettingsValues();
    els.settingsOverlay.classList.add('show');
  });
  els.closeSettingsBtn.addEventListener('click', () => els.settingsOverlay.classList.remove('show'));
  els.settingsOverlay.addEventListener('click', (e) => {
    if (e.target === els.settingsOverlay) els.settingsOverlay.classList.remove('show');
  });
  // riaperte dal menu, le istruzioni hanno anche la X: al primo avvio no, lì si
  // chiudono con "Ho capito!" ed è l'inizio del giro di scelte
  els.openRulesBtn.addEventListener('click', () => {
    els.rulesOverlay.classList.remove('x-off');
    showOnly(els.rulesOverlay);
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
  // cambiare difficoltà o modalità butta via la partita in corso: si chiede
  els.openDifficultyBtn.addEventListener('click', () => {
    if (gameInProgress()) {
      askConfirm('changeDiffTitle', 'changeDiffBody', 'changeDiffYes', () => showOnly(els.difficultyOverlay));
      return;
    }
    showOnly(els.difficultyOverlay);
  });
  els.openModeBtn.addEventListener('click', () => {
    if (gameInProgress()) {
      askConfirm('changeModeTitle', 'changeModeBody', 'changeDiffYes', goToMode);
      return;
    }
    goToMode();
  });

  // le regole si aprono a ogni avvio: una partita dura un minuto e non si
  // riprende a metà, quindi si comincia sempre da qui e si sceglie dopo
  showOnly(els.rulesOverlay);

  stats = await loadTrisProgress();

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 350);
}
init();
