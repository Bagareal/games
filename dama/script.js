/* ============ DAMA — motore di gioco ============
   La dama è un gioco tradizionale popolare, senza autore né proprietario: le
   sue regole si tramandano da secoli. Qui si usa la variante "classica"
   internazionale su scacchiera 8×8: le pedine mangiano anche all'indietro e la
   dama scorre lungo tutta la diagonale. Codice, grafica e testi sono scritti da
   zero per questo sito.

   Due modi di giocare: contro il computer (TheCreator, tre livelli) o in due
   sullo stesso dispositivo, appoggiato sul tavolo fra i due giocatori — per
   questo la scacchiera non gira mai. */

// ---------- Lingua condivisa con tutto il sito ----------
const LANGUAGES = {
  it: { label: 'Italiano', flag: '🇮🇹' },
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
};
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    settingsTitle: '⚙️ Impostazioni',
    languageMenuLabel: 'Lingua',
    commands: 'Istruzioni',
    leaderboardMenuLabel: 'Classifica',
    languageTitle: '🌍 Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    close: 'Chiudi',
    back: 'Indietro',
    play: 'Gioca',
    gotIt: 'Ho capito!',

    rulesTitle: 'Come si gioca',
    rule1: 'Si gioca solo sulle caselle scure. Le pedine si muovono in diagonale, di una casella, sempre in avanti.',
    rule2: "Si mangia saltando una pedina avversaria vicina, se dietro c'è una casella libera. Le pedine possono mangiare anche all'indietro.",
    rule3: 'Mangiare è obbligatorio: se puoi mangiare, devi farlo. Se dopo il salto puoi mangiare ancora con la stessa pedina, devi continuare.',
    rule4: 'Una pedina che arriva in fondo diventa dama e il turno finisce. La dama scorre lungo tutta la diagonale, avanti e indietro, e mangia anche da lontano.',
    rule5: "Vince chi mangia tutti i pezzi dell'avversario o chi lo lascia senza mosse.",
    rule6: 'Tocca un tuo pezzo per vedere dove può andare, poi tocca la casella dove vuoi portarlo.',

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
    friendTipBody: 'Appoggia il dispositivo su un tavolo, in mezzo a voi due. La scacchiera non gira mai: ognuno gioca dal suo lato, come su una vera dama.',

    restartTitle: 'Ricominciare la partita?',
    restartBody: 'La partita in corso viene persa e si riparte dalla posizione iniziale, con la stessa modalità.',
    restartYes: 'Sì, ricomincia',
    restartNo: 'No, continuo',

    you: 'Tu',
    creatorName: 'TheCreator',
    player1: 'Giocatore 1',
    player2: 'Giocatore 2',
    turnOf: n => `Tocca a ${n}`,
    yourTurn: 'Tocca a te',
    thinking: 'TheCreator sta pensando…',
    mustCapture: 'Presa obbligatoria!',

    youWin: 'Hai vinto!',
    youLose: 'Ha vinto TheCreator',
    draw: 'Patta',
    winsP1: 'Ha vinto il Giocatore 1',
    winsP2: 'Ha vinto il Giocatore 2',
    winSub: (diff, wins) => `Hai battuto TheCreator a livello ${diff}. Vittorie a questo livello: ${wins}.`,
    loseSub: diff => `Livello ${diff}. Riprova: la prossima è quella buona.`,
    drawSub: 'Nessuno dei due riesce più a concludere: patta.',
    friendEndSub: 'Bella partita. Rigiocate?',
    playAgain: 'Rigioca',
    changeMode: 'Cambia modalità',

    leaderboardTitle: 'Classifica',
    leaderboardNote: 'Contano solo le partite vinte contro il computer.',
    leaderboardEmpty: 'Nessuna vittoria ancora: gioca da loggato per essere il primo!',
    winsShort: n => `${n} vitt.`,
  },
  en: {
    settingsTitle: '⚙️ Settings',
    languageMenuLabel: 'Language',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Leaderboard',
    languageTitle: '🌍 Language',
    languageSub: 'Choose the interface language',
    close: 'Close',
    back: 'Back',
    play: 'Play',
    gotIt: 'Got it!',

    rulesTitle: 'How to play',
    rule1: 'The game is played on the dark squares only. Men move one square diagonally, always forward.',
    rule2: 'You capture by jumping over an adjacent enemy piece when the square behind it is free. Men may capture backwards too.',
    rule3: 'Capturing is compulsory: if you can capture, you must. If the same piece can capture again after the jump, it must keep going.',
    rule4: 'A man that reaches the far row becomes a king and the turn ends. A king slides along the whole diagonal, both ways, and captures from a distance.',
    rule5: 'You win by capturing all the opponent\'s pieces or by leaving them with no legal move.',
    rule6: 'Tap one of your pieces to see where it can go, then tap the square you want to move it to.',

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
    friendTipBody: 'Put the device flat on a table, between the two of you. The board never rotates: each player plays from their own side, like on a real board.',

    restartTitle: 'Restart the game?',
    restartBody: 'The current game is lost and the board starts over, same mode as now.',
    restartYes: 'Yes, restart',
    restartNo: 'No, keep playing',

    you: 'You',
    creatorName: 'TheCreator',
    player1: 'Player 1',
    player2: 'Player 2',
    turnOf: n => `${n}'s turn`,
    yourTurn: 'Your turn',
    thinking: 'TheCreator is thinking…',
    mustCapture: 'You must capture!',

    youWin: 'You win!',
    youLose: 'TheCreator wins',
    draw: 'Draw',
    winsP1: 'Player 1 wins',
    winsP2: 'Player 2 wins',
    winSub: (diff, wins) => `You beat TheCreator on ${diff}. Wins at this level: ${wins}.`,
    loseSub: diff => `Level ${diff}. Try again: the next one is yours.`,
    drawSub: 'Neither side can finish it off: it\'s a draw.',
    friendEndSub: 'Good game. Another one?',
    playAgain: 'Play again',
    changeMode: 'Change mode',

    leaderboardTitle: 'Leaderboard',
    leaderboardNote: 'Only games won against the computer count.',
    leaderboardEmpty: 'No wins yet: play while signed in to be the first!',
    winsShort: n => `${n} wins`,
  },
  fr: {
    settingsTitle: '⚙️ Paramètres',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Classement',
    languageTitle: '🌍 Langue',
    languageSub: "Choisis la langue de l'interface",
    close: 'Fermer',
    back: 'Retour',
    play: 'Jouer',
    gotIt: 'Compris !',

    rulesTitle: 'Comment jouer',
    rule1: "On joue seulement sur les cases foncées. Les pions avancent d'une case en diagonale, toujours vers l'avant.",
    rule2: "On mange en sautant par-dessus un pion adverse voisin, si la case derrière est libre. Les pions peuvent aussi manger en arrière.",
    rule3: 'La prise est obligatoire : si tu peux manger, tu dois manger. Et si le même pion peut manger encore après le saut, il doit continuer.',
    rule4: "Un pion qui atteint la dernière rangée devient dame et le tour s'arrête. La dame glisse sur toute la diagonale, dans les deux sens, et mange de loin.",
    rule5: "Gagne celui qui prend toutes les pièces adverses ou qui laisse l'adversaire sans coup possible.",
    rule6: 'Touche une de tes pièces pour voir où elle peut aller, puis touche la case choisie.',

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
    friendTipBody: "Pose l'appareil à plat sur une table, entre vous deux. Le plateau ne tourne jamais : chacun joue de son côté, comme sur un vrai damier.",

    restartTitle: 'Recommencer la partie ?',
    restartBody: 'La partie en cours est perdue et on repart de la position de départ, dans le même mode.',
    restartYes: 'Oui, recommencer',
    restartNo: 'Non, je continue',

    you: 'Toi',
    creatorName: 'TheCreator',
    player1: 'Joueur 1',
    player2: 'Joueur 2',
    turnOf: n => `Au tour de ${n}`,
    yourTurn: 'À toi de jouer',
    thinking: 'TheCreator réfléchit…',
    mustCapture: 'Prise obligatoire !',

    youWin: 'Tu as gagné !',
    youLose: 'TheCreator a gagné',
    draw: 'Match nul',
    winsP1: 'Le Joueur 1 a gagné',
    winsP2: 'Le Joueur 2 a gagné',
    winSub: (diff, wins) => `Tu as battu TheCreator en ${diff}. Victoires à ce niveau : ${wins}.`,
    loseSub: diff => `Niveau ${diff}. Réessaie : la prochaine est la bonne.`,
    drawSub: 'Plus personne ne peut conclure : match nul.',
    friendEndSub: 'Belle partie. On rejoue ?',
    playAgain: 'Rejouer',
    changeMode: 'Changer de mode',

    leaderboardTitle: 'Classement',
    leaderboardNote: "Seules les parties gagnées contre l'ordinateur comptent.",
    leaderboardEmpty: 'Aucune victoire pour le instant : joue connecté pour être le premier !',
    winsShort: n => `${n} vict.`,
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
  boardSquares: document.getElementById('boardSquares'),
  boardMarks: document.getElementById('boardMarks'),
  boardPieces: document.getElementById('boardPieces'),
  turnPill: document.getElementById('turnPill'),
  plateTop: document.getElementById('plateTop'),
  plateTopName: document.getElementById('plateTopName'),
  plateTopCount: document.getElementById('plateTopCount'),
  plateBottom: document.getElementById('plateBottom'),
  plateBottomName: document.getElementById('plateBottomName'),
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
  restartOverlay: document.getElementById('restartOverlay'),
  confirmRestartBtn: document.getElementById('confirmRestartBtn'),
  cancelRestartBtn: document.getElementById('cancelRestartBtn'),
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
// Scacchiera: 64 caselle, indice = riga*8 + colonna, riga 0 in alto.
// Valori: 1 pedina del giocatore in basso, 2 la sua dama, -1 e -2 quelli di chi
// sta in alto. Il segno è anche il "lato": +1 in basso (muove verso l'alto),
// -1 in alto (muove verso il basso).
const SIZE = 8;
const BOTTOM = 1;
const TOP = -1;
const DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

function idx(r, c) { return r * SIZE + c; }
function rowOf(i) { return (i / SIZE) | 0; }
function colOf(i) { return i % SIZE; }
function onBoard(r, c) { return r >= 0 && r < SIZE && c >= 0 && c < SIZE; }
function isDarkSquare(r, c) { return ((r + c) & 1) === 1; }
function sideOf(v) { return v > 0 ? BOTTOM : TOP; }
function isKing(v) { return v === 2 || v === -2; }
function promotionRow(side) { return side === BOTTOM ? 0 : SIZE - 1; }

function initialBoard() {
  const b = new Int8Array(SIZE * SIZE);
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!isDarkSquare(r, c)) continue;
      if (r <= 2) b[idx(r, c)] = -1;      // in alto
      else if (r >= 5) b[idx(r, c)] = 1;  // in basso
    }
  }
  return b;
}

// Tutte le catene di prese possibili partendo da una casella. Il pezzo viene
// "sollevato" (la casella di partenza resta libera, ci si può ripassare sopra) e
// i pezzi mangiati restano sulla scacchiera fino a fine mossa: non si possono
// scavalcare né mangiare due volte, come vuole la regola classica.
function collectCaptures(board, origin, piece, from, captured, path, out) {
  const side = sideOf(piece);
  const king = isKing(piece);

  for (const [dr, dc] of DIRS) {
    let r = rowOf(from) + dr;
    let c = colOf(from) + dc;
    if (king) {
      // la dama scorre fino al primo pezzo che incontra
      while (onBoard(r, c) && board[idx(r, c)] === 0 && !captured.has(idx(r, c))) { r += dr; c += dc; }
    }
    if (!onBoard(r, c)) continue;
    const victim = idx(r, c);
    if (victim === origin) continue;             // la casella di partenza è vuota
    if (captured.has(victim)) continue;          // già mangiato in questa catena
    if (board[victim] === 0 || sideOf(board[victim]) === side) continue;

    // caselle libere subito dopo il pezzo mangiato
    let lr = r + dr;
    let lc = c + dc;
    while (onBoard(lr, lc)) {
      const land = idx(lr, lc);
      const free = (land === origin) || (board[land] === 0 && !captured.has(land));
      if (!free) break;
      captured.add(victim);
      path.push(land);
      // una pedina che finisce in fondo diventa dama e il turno si chiude lì
      const promotes = !king && lr === promotionRow(side);
      if (promotes) {
        out.push({ from: origin, to: land, caps: Array.from(captured), path: path.slice(), promote: true });
      } else {
        const before = out.length;
        collectCaptures(board, origin, piece, land, captured, path, out);
        if (out.length === before) {
          out.push({ from: origin, to: land, caps: Array.from(captured), path: path.slice(), promote: false });
        }
      }
      path.pop();
      captured.delete(victim);
      if (!king) break;                          // la pedina atterra subito dopo il pezzo mangiato
      lr += dr; lc += dc;
    }
  }
}

function quietMoves(board, from, piece) {
  const side = sideOf(piece);
  const king = isKing(piece);
  const out = [];
  for (const [dr, dc] of DIRS) {
    if (!king && dr !== -side) continue;         // le pedine vanno solo in avanti
    let r = rowOf(from) + dr;
    let c = colOf(from) + dc;
    while (onBoard(r, c) && board[idx(r, c)] === 0) {
      const to = idx(r, c);
      out.push({ from, to, caps: [], path: [to], promote: !king && r === promotionRow(side) });
      if (!king) break;
      r += dr; c += dc;
    }
  }
  return out;
}

// Mangiare è obbligatorio: se esiste anche una sola presa, le mosse tranquille
// non vengono nemmeno restituite.
function generateMoves(board, side) {
  const caps = [];
  for (let i = 0; i < board.length; i++) {
    const v = board[i];
    if (v === 0 || sideOf(v) !== side) continue;
    collectCaptures(board, i, v, i, new Set(), [], caps);
  }
  if (caps.length) return caps;

  const quiet = [];
  for (let i = 0; i < board.length; i++) {
    const v = board[i];
    if (v === 0 || sideOf(v) !== side) continue;
    const ms = quietMoves(board, i, v);
    for (const m of ms) quiet.push(m);
  }
  return quiet;
}

function applyMove(board, move) {
  const next = board.slice();
  const piece = next[move.from];
  next[move.from] = 0;
  for (const c of move.caps) next[c] = 0;
  next[move.to] = move.promote ? piece * 2 : piece;
  return next;
}

// ============================================================
//  IL COMPUTER (TheCreator)
// ============================================================
const VAL_MAN = 100;
const VAL_KING = 275;
const MATE = 100000;

// Punteggio della posizione dal punto di vista di `side`. Oltre al materiale
// contano: quanto le pedine sono vicine alla promozione, le pedine ancora
// sull'ultima riga di casa (fanno da muro contro le dame avversarie), le dame
// al centro (controllano più diagonali) e i pezzi sui bordi (dove non si può
// essere mangiati).
function evaluate(board, side) {
  let s = 0;
  for (let i = 0; i < board.length; i++) {
    const v = board[i];
    if (v === 0) continue;
    const own = sideOf(v);
    const r = rowOf(i);
    const c = colOf(i);
    let val;
    if (isKing(v)) {
      val = VAL_KING;
      val += ((3.5 - Math.abs(3.5 - c)) + (3.5 - Math.abs(3.5 - r))) * 3;
    } else {
      val = VAL_MAN;
      const advance = own === BOTTOM ? (SIZE - 1 - r) : r;
      val += advance * 6;
      if (r === (own === BOTTOM ? SIZE - 1 : 0)) val += 8;
    }
    if (c === 0 || c === SIZE - 1) val += 5;
    s += own * val;
  }
  return side === BOTTOM ? s : -s;
}

// Prima le prese più grosse, poi le promozioni: con l'alfa-beta l'ordine delle
// mosse conta quanto la profondità, perché una buona mossa provata subito taglia
// via tutto il resto.
function orderMoves(moves) {
  return moves.slice().sort((a, b) => (b.caps.length - a.caps.length) || ((b.promote ? 1 : 0) - (a.promote ? 1 : 0)));
}

let searchNodes = 0;
let searchDeadline = 0;
let searchAborted = false;

function negamax(board, side, depth, alpha, beta, ext) {
  if (searchAborted) return 0;
  if (((++searchNodes) & 511) === 0 && performance.now() > searchDeadline) { searchAborted = true; return 0; }

  const moves = generateMoves(board, side);
  if (!moves.length) return -MATE - depth;   // senza mosse si perde: prima succede, peggio è

  // A profondità zero non ci si ferma in mezzo a uno scambio di prese: visto
  // che quando c'è una presa quella è l'unica mossa possibile, il ramo è
  // strettissimo e allungarlo di qualche mossa costa pochissimo.
  const forced = moves[0].caps.length > 0;
  if (depth <= 0 && (!forced || ext <= 0)) return evaluate(board, side);
  const nextDepth = depth > 0 ? depth - 1 : 0;
  const nextExt = depth > 0 ? ext : ext - 1;

  let best = -Infinity;
  for (const m of orderMoves(moves)) {
    const score = -negamax(applyMove(board, m), -side, nextDepth, -beta, -alpha, nextExt);
    if (searchAborted) return 0;
    if (score > best) best = score;
    if (best > alpha) alpha = best;
    if (alpha >= beta) break;
  }
  return best;
}

const DIFFICULTIES = {
  stupido: { depth: 1, timeMs: 250, randomChance: 0.55, noise: 25 },
  normale: { depth: 4, timeMs: 1400, randomChance: 0, noise: 8 },
  master: { depth: 10, timeMs: 1200, randomChance: 0, noise: 0 },
};

function chooseAiMove(board, side, difficulty) {
  const conf = DIFFICULTIES[difficulty] || DIFFICULTIES.normale;
  const moves = generateMoves(board, side);
  if (!moves.length) return null;
  if (moves.length === 1) return moves[0];

  // il livello "stupido" gioca spesso a caso: sbaglia sul serio, ma è comunque
  // costretto a mangiare quando la regola lo impone
  if (conf.randomChance && Math.random() < conf.randomChance) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  searchDeadline = performance.now() + conf.timeMs;
  searchAborted = false;
  searchNodes = 0;

  const ordered = orderMoves(moves);
  let best = ordered[0];
  // approfondimento progressivo: si scende di un livello alla volta e ci si
  // tiene la miglior mossa dell'ultima profondità COMPLETATA, così anche su un
  // telefono lento il computer risponde sempre entro il tempo previsto
  for (let depth = 1; depth <= conf.depth; depth++) {
    let alpha = -Infinity;
    let localBest = null;
    for (const m of ordered) {
      let score = -negamax(applyMove(board, m), -side, depth - 1, -Infinity, -alpha, 6);
      if (searchAborted) break;
      if (conf.noise) score += (Math.random() * 2 - 1) * conf.noise;
      if (localBest === null || score > alpha) { alpha = score; localBest = m; }
    }
    if (searchAborted) break;
    if (localBest) best = localBest;
    if (performance.now() > searchDeadline) break;
  }
  return best;
}

// ============================================================
//  STATO E INTERFACCIA
// ============================================================
const state = {
  mode: null,            // 'pc' | 'friend'
  difficulty: null,
  board: initialBoard(),
  turn: BOTTOM,
  humanSide: BOTTOM,     // contro il computer l'umano gioca sempre da sotto
  moves: [],             // mosse legali del turno in corso
  selected: null,
  busy: false,
  started: false,
  over: false,
  lastMove: null,
  eaten: { 1: 0, '-1': 0 },
  idlePlies: 0,          // mosse di fila senza prese né promozioni → patta
};

let metrics = { cell: 40 };
const pieceEls = new Array(SIZE * SIZE).fill(null);

// La misura della scacchiera si prende dallo spazio che resta davvero, non da
// una percentuale dello schermo scelta a occhio: la zona di gioco è l'elemento
// elastico del layout, quindi la sua altezza è già "quello che avanza" fra le
// due targhe dei giocatori, su qualunque telefono o tablet.
function layout() {
  const cs = getComputedStyle(els.gameZone);
  const w = els.gameZone.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  // le targhe stanno dentro la stessa colonna della scacchiera: la loro altezza
  // dipende solo dal testo, mai da quanto è grande la scacchiera, quindi si può
  // toglierla dallo spazio disponibile senza girare in tondo
  const plates = els.plateTop.offsetHeight + els.plateBottom.offsetHeight + 16;
  const h = els.gameZone.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - plates;
  const avail = Math.min(w, h) - 4;   // 4px per la cornice, disegnata sul bordo
  if (avail <= 0) return;
  const cell = Math.max(20, Math.floor(avail / SIZE));
  metrics = { cell };
  els.tableStack.style.setProperty('--board', (cell * SIZE) + 'px');
  els.tableStack.style.setProperty('--cell', cell + 'px');
  positionSquares();
  renderBoard();
  renderMarks();
}
function xOf(i) { return colOf(i) * metrics.cell; }
function yOf(i) { return rowOf(i) * metrics.cell; }

function buildSquares() {
  els.boardSquares.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const el = document.createElement('div');
      el.className = 'square ' + (isDarkSquare(r, c) ? 'dark' : 'light');
      el.dataset.i = idx(r, c);
      els.boardSquares.appendChild(el);
    }
  }
}
function positionSquares() {
  els.boardSquares.querySelectorAll('.square').forEach(el => {
    const i = +el.dataset.i;
    el.style.transform = `translate(${xOf(i)}px, ${yOf(i)}px)`;
  });
}

// Si ridisegnano tutti i pezzi da capo: sono al massimo 24 elementi, e ricrearli
// alle stesse coordinate non si vede (la posizione viene messa PRIMA di
// attaccarli alla pagina, quindi nascono già al posto giusto invece di
// scivolarci dentro dall'angolo).
function renderBoard() {
  els.boardPieces.innerHTML = '';
  pieceEls.fill(null);
  for (let i = 0; i < state.board.length; i++) {
    const v = state.board[i];
    if (v === 0) continue;
    const el = document.createElement('div');
    el.className = 'piece ' + (sideOf(v) === BOTTOM ? 'light' : 'dark') + (isKing(v) ? ' king' : '');
    el.style.transform = `translate(${xOf(i)}px, ${yOf(i)}px)`;
    el.innerHTML = '<span class="crown">♛</span>';
    els.boardPieces.appendChild(el);
    pieceEls[i] = el;
  }
  els.boardSquares.querySelectorAll('.square').forEach(el => {
    const i = +el.dataset.i;
    const on = state.lastMove && (i === state.lastMove.from || i === state.lastMove.to);
    el.classList.toggle('last-move', !!on);
  });
}

function renderMarks() {
  els.boardMarks.innerHTML = '';
  if (state.over || state.busy || !state.started) return;
  if (state.mode === 'pc' && state.turn !== state.humanSide) return;

  const add = (i, cls) => {
    const el = document.createElement('div');
    el.className = 'mark ' + cls;
    el.style.transform = `translate(${xOf(i)}px, ${yOf(i)}px)`;
    els.boardMarks.appendChild(el);
  };

  if (state.selected == null) {
    // presa obbligatoria: si segnano i pezzi che DEVONO muovere, altrimenti chi
    // sta imparando tocca un altro pezzo e non capisce perché non si muove
    if (state.moves.length && state.moves[0].caps.length) {
      const seen = new Set();
      for (const m of state.moves) if (!seen.has(m.from)) { seen.add(m.from); add(m.from, 'must'); }
    }
    return;
  }
  add(state.selected, 'selected');
  for (const m of state.moves) {
    if (m.from !== state.selected) continue;
    add(m.to, m.caps.length ? 'capture' : '');
  }
}

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
  els.plateBottomCount.textContent = String(state.eaten[BOTTOM]);
  els.plateTopCount.textContent = String(state.eaten[TOP]);
  // in due sullo stesso dispositivo chi sta di fronte legge sottosopra
  els.plateTop.classList.toggle('flipped', state.mode === 'friend');
  els.plateBottom.classList.toggle('is-turn', state.started && !state.over && state.turn === BOTTOM);
  els.plateTop.classList.toggle('is-turn', state.started && !state.over && state.turn === TOP);

  els.turnPill.classList.remove('thinking');
  if (!state.started) { els.turnPill.textContent = '—'; return; }
  if (state.over) { els.turnPill.textContent = '—'; return; }
  if (state.mode === 'pc' && state.turn !== state.humanSide) {
    els.turnPill.textContent = t().thinking;
    els.turnPill.classList.add('thinking');
    return;
  }
  if (state.moves.length && state.moves[0].caps.length) {
    els.turnPill.textContent = t().mustCapture;
    els.turnPill.classList.add('thinking');
    return;
  }
  // "Tocca a te" invece di "Tocca a Tu": chi gioca contro il computer senza
  // essersi loggato non ha un nome da mettere nella frase
  const name = playerName(state.turn);
  els.turnPill.textContent = (name === t().you) ? t().yourTurn : t().turnOf(name);
}

// ---------- Mosse giocate ----------
function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

async function animateMove(move) {
  const el = pieceEls[move.from];
  if (!el) return;
  el.style.zIndex = '2';
  const steps = move.path && move.path.length ? move.path : [move.to];
  for (const step of steps) {
    el.style.transform = `translate(${xOf(step)}px, ${yOf(step)}px)`;
    await wait(230);
  }
  for (const c of move.caps) {
    const victim = pieceEls[c];
    if (victim) victim.classList.add('captured');
  }
  if (move.caps.length) await wait(200);
}

async function playMove(move) {
  state.busy = true;
  state.selected = null;
  renderMarks();

  await animateMove(move);

  const mover = state.turn;
  state.board = applyMove(state.board, move);
  state.eaten[mover] += move.caps.length;
  state.lastMove = move;
  state.idlePlies = (move.caps.length || move.promote) ? 0 : state.idlePlies + 1;
  state.turn = -mover;
  state.moves = generateMoves(state.board, state.turn);
  renderBoard();
  if (move.promote && pieceEls[move.to]) pieceEls[move.to].classList.add('just-promoted');
  state.busy = false;

  if (!state.moves.length) { finishGame(mover); return; }
  if (state.idlePlies >= 60) { finishGame(null); return; }
  updateHUD();
  renderMarks();
  maybeRunAi();
}

function maybeRunAi() {
  if (state.mode !== 'pc' || state.over || state.turn === state.humanSide) return;
  state.busy = true;
  updateHUD();
  renderMarks();
  // il calcolo blocca la pagina per qualche decimo di secondo: si lascia prima
  // ridisegnare l'interfaccia (la scritta "sta pensando…") e solo dopo si pensa
  setTimeout(() => {
    const started = performance.now();
    const move = chooseAiMove(state.board, state.turn, state.difficulty);
    if (!move) { state.busy = false; finishGame(state.humanSide); return; }
    // una risposta immediata sembra una svista: si aspetta comunque un momento
    const pause = Math.max(0, 420 - (performance.now() - started));
    setTimeout(() => { state.busy = false; playMove(move); }, pause);
  }, 60);
}

// ---------- Tocco sulla scacchiera ----------
function squareFromEvent(e) {
  const rect = els.boardFrame.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
  const c = Math.min(SIZE - 1, Math.floor(x / metrics.cell));
  const r = Math.min(SIZE - 1, Math.floor(y / metrics.cell));
  return idx(r, c);
}

function onBoardClick(e) {
  if (!state.started || state.over || state.busy) return;
  if (state.mode === 'pc' && state.turn !== state.humanSide) return;
  const i = squareFromEvent(e);
  if (i == null) return;

  if (state.selected != null) {
    // fra più catene che finiscono sulla stessa casella si gioca quella che
    // mangia di più: è quella che il giocatore si aspetta
    const options = state.moves.filter(m => m.from === state.selected && m.to === i);
    if (options.length) {
      options.sort((a, b) => b.caps.length - a.caps.length);
      playMove(options[0]);
      return;
    }
  }
  const v = state.board[i];
  if (v !== 0 && sideOf(v) === state.turn && state.moves.some(m => m.from === i)) {
    state.selected = i;
  } else {
    state.selected = null;
  }
  renderMarks();
}

// ---------- Fine partita ----------
function finishGame(winnerSide) {
  state.over = true;
  state.busy = false;
  state.selected = null;
  renderMarks();
  updateHUD();

  const diffLabel = state.difficulty ? t()['diff' + state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1)] : '';
  if (state.mode === 'pc') {
    if (winnerSide === null) {
      recordResult('draws');
      els.endIcon.textContent = '=';
      els.endTitle.textContent = t().draw;
      els.endSub.textContent = t().drawSub;
    } else if (winnerSide === state.humanSide) {
      const wins = recordResult('wins');
      els.endIcon.textContent = '♛';
      els.endTitle.textContent = t().youWin;
      els.endSub.textContent = t().winSub(diffLabel, wins);
    } else {
      recordResult('losses');
      els.endIcon.textContent = '🤖';
      els.endTitle.textContent = t().youLose;
      els.endSub.textContent = t().loseSub(diffLabel);
    }
  } else {
    if (winnerSide === null) {
      els.endIcon.textContent = '=';
      els.endTitle.textContent = t().draw;
      els.endSub.textContent = t().drawSub;
    } else {
      els.endIcon.textContent = '♛';
      els.endTitle.textContent = winnerSide === BOTTOM ? t().winsP1 : t().winsP2;
      els.endSub.textContent = t().friendEndSub;
    }
  }
  els.endOverlay.classList.add('show');
}

// ---------- Progresso e classifica ----------
// In classifica va solo quello che si fa contro il computer: in due sullo stesso
// dispositivo basterebbe farsi vincere a vicenda per gonfiare il punteggio.
// Ogni difficoltà ha la sua graduatoria (voce 'dama:<difficoltà>', vedi saveScore
// in shared/auth.js) e ci si gareggia sul numero di partite vinte.
const DIFFICULTY_KEYS = ['stupido', 'normale', 'master'];
let stats = emptyStats();
function emptyStats() {
  const s = {};
  for (const k of DIFFICULTY_KEYS) s[k] = { wins: 0, losses: 0, draws: 0 };
  return s;
}
function totalWins() {
  return DIFFICULTY_KEYS.reduce((n, k) => n + stats[k].wins, 0);
}
function recordResult(field) {
  const key = state.difficulty;
  if (!key || !stats[key]) return 0;
  stats[key][field] += 1;
  saveDamaProgress();
  if (field === 'wins' && window.FFR && window.FFR.auth) {
    window.FFR.auth.saveScore('dama:' + key, stats[key].wins);
  }
  return stats[key].wins;
}
function saveDamaProgress() {
  if (!(window.FFR && window.FFR.auth)) return;
  window.FFR.auth.saveProgress('dama', { stats }, totalWins());
}
// Un salvataggio con una forma che non riconosciamo non deve far perdere le
// vittorie già fatte: si legge quello che si riesce a leggere e basta.
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
async function loadDamaProgress() {
  if (!(window.FFR && window.FFR.auth)) return emptyStats();
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return normalizeSaved(await window.FFR.auth.loadProgress('dama'));
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
  const gameKey = 'dama:' + difficultyKey;
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
  els.leaderboardList.innerHTML = buildLeaderboardRows(rows, me, myNickname, n => t().winsShort(n));
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
  updateHUD();
}
function tauntFor(diff) {
  return t()['taunt' + diff.charAt(0).toUpperCase() + diff.slice(1)];
}
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

// ---------- Flusso dei pannelli ----------
function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('show'));
}
function showOnly(el) {
  hideAllOverlays();
  el.classList.add('show');
}
function startNewBoard() {
  state.board = initialBoard();
  state.turn = BOTTOM;
  state.selected = null;
  state.busy = false;
  state.over = false;
  state.started = true;
  state.lastMove = null;
  state.eaten = { 1: 0, '-1': 0 };
  state.idlePlies = 0;
  state.moves = generateMoves(state.board, state.turn);
  hideAllOverlays();
  layout();
  updateHUD();
  renderMarks();
}
function goToMode() {
  state.started = false;
  state.over = false;
  state.mode = null;
  state.difficulty = null;
  updateHUD();
  showOnly(els.modeOverlay);
}

// ---------- Avvio ----------
async function init() {
  language = getSiteLanguage() || 'it';
  applyTranslations();
  buildSquares();
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
    updateHUD();                       // le targhe prendono subito i nomi giusti
    showOnly(els.friendTipOverlay);
  });
  els.modeComputerBtn.addEventListener('click', () => {
    state.mode = 'pc';
    updateHUD();
    showOnly(els.difficultyOverlay);
  });
  els.backToModeBtn.addEventListener('click', goToMode);
  els.difficultyOverlay.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => {
      state.difficulty = btn.dataset.difficulty;
      els.tauntLine.textContent = tauntFor(state.difficulty);
      showOnly(els.tauntOverlay);
    });
  });
  els.tauntBackBtn.addEventListener('click', () => showOnly(els.difficultyOverlay));
  els.tauntPlayBtn.addEventListener('click', () => { startNewBoard(); });
  els.friendBackBtn.addEventListener('click', goToMode);
  els.friendPlayBtn.addEventListener('click', () => { startNewBoard(); });

  els.restartBtn.addEventListener('click', () => {
    // fuori da una partita (o a partita finita) questo pulsante è la via di
    // ritorno: riporta alla scelta della modalità. Serve perché ora i pannelli
    // si possono chiudere con la X, e senza di lui chi chiude la scelta iniziale
    // resterebbe davanti a una scacchiera che non risponde.
    if (!state.started || state.over) { goToMode(); return; }
    els.restartOverlay.classList.add('show');
  });
  els.cancelRestartBtn.addEventListener('click', () => els.restartOverlay.classList.remove('show'));
  // si ricomincia la stessa partita (stessa modalità e stessa difficoltà): per
  // cambiare modalità c'è il pannello di fine partita
  els.confirmRestartBtn.addEventListener('click', () => startNewBoard());

  els.playAgainBtn.addEventListener('click', () => { startNewBoard(); });
  els.changeModeBtn.addEventListener('click', goToMode);

  els.settingsBtn.addEventListener('click', () => els.settingsOverlay.classList.add('show'));
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

  // le regole si aprono a ogni avvio: una partita dura poco e non si riprende a
  // metà, quindi si comincia sempre da qui e si sceglie la modalità dopo
  showOnly(els.rulesOverlay);

  stats = await loadDamaProgress();

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 350);
}
init();
