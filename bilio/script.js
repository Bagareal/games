/* ============ BILIO — il gioco ============
   Qui c'è tutto quello che si vede e si tocca: il disegno del tavolo, la
   stecca, i comandi, i turni e i pannelli. La fisica e le regole stanno in
   engine.js, che non sa niente della pagina.

   Il biliardo è uno sport, le sue regole non sono di nessuno. Codice, grafica e
   testi di questa pagina sono scritti da zero per il sito. */

const B = window.BILIO;
const TAU = Math.PI * 2;

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
    aimLabel: 'Linea di mira',
    close: 'Chiudi',
    back: 'Indietro',
    play: 'Gioca',
    gotIt: 'Ho capito!',
    backToHome: 'Torna in Home',

    rulesTitle: 'Come si gioca',
    rule1: 'Appoggia il dito dietro la bianca e tiralo indietro: la stecca arretra insieme al dito. Più la tiri indietro, più il tiro è forte — te lo dice la barra, che da verde diventa rossa. Stacca il dito e la stecca colpisce.',
    rule2: 'Muovendo il dito intorno alla bianca cambi la direzione. Se molli senza aver tirato indietro non succede niente: puoi mirare con calma.',
    rule3: "All'inizio le palle sono di tutti e due. La prima che mandi in buca decide: se era piena (dall'1 al 7) le piene sono tue, se era mezza (dal 9 al 15) sono tue le mezze.",
    rule4: 'Finché imbuchi una delle tue, continui a tirare. Se non imbuchi niente, tocca all\'altro.',
    rule5: 'La nera va per ultima: si imbuca solo quando le tue sette sono finite. Mandarla in buca prima fa perdere la partita — tranne sul primo tiro, quando torna sul tavolo e si continua.',
    rule6: "Niente falli: puoi colpire quello che vuoi. L'unica cosa che costa è mandare in buca la bianca — l'avversario la rimette dove vuole lui.",
    rule7: 'La linea di mira ti mostra dove va la bianca, comprese le sponde, e dove partirà la palla che colpisci. Se la vuoi togliere, c\'è l\'interruttore in Impostazioni.',

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
    tauntStupido: 'Vai piano, che la stecca è pesante.',
    tauntNormale: 'Una partita tranquilla, poi ti riaccompagno alla porta.',
    tauntMaster: 'Il triangolo lo apro io. Tu guarda.',

    friendTipTitle: "Uno di fronte all'altro",
    friendTipBody: 'Appoggia il dispositivo su un tavolo, in mezzo a voi due. Il biliardo non gira mai: ognuno tira dal suo lato, come intorno a un tavolo vero.',

    restartTitle: 'Ricominciare la partita?',
    restartBody: 'La partita in corso viene persa e le palle tornano nel triangolo, con la stessa modalità.',
    restartYes: 'Sì, ricomincia',
    restartNo: 'No, continuo',
    diffChangeTitle: 'Cambiare difficoltà?',
    diffChangeBody: 'La partita in corso viene persa e si riparte dal triangolo, con la difficoltà nuova.',
    diffChangeYes: 'Sì, cambia',

    playAgain: 'Rigioca',
    changeMode: 'Cambia modalità',
    leaderboardTitle: 'Classifica',
    leaderboardNote: 'Contano solo le partite vinte contro il computer.',
    leaderboardEmpty: 'Ancora nessuno in classifica. Comincia tu.',
    winsShort: (n) => n === 1 ? '1 vittoria' : n + ' vittorie',

    you: 'Tu',
    creator: 'TheCreator',
    player1: 'Giocatore 1',
    player2: 'Giocatore 2',
    turnYours: 'Tocca a te',
    turnCreator: 'Tira TheCreator',
    turnThinking: 'TheCreator studia il tiro',
    turnP1: 'Tira il Giocatore 1',
    turnP2: 'Tira il Giocatore 2',
    turnRolling: 'Le palle rotolano…',

    toastSolids: 'Sei sulle piene',
    toastStripes: 'Sei sulle mezze',
    toastSolidsPc: 'TheCreator va sulle piene',
    toastStripesPc: 'TheCreator va sulle mezze',
    toastSolidsP1: 'Il Giocatore 1 va sulle piene',
    toastStripesP1: 'Il Giocatore 1 va sulle mezze',
    toastSolidsP2: 'Il Giocatore 2 va sulle piene',
    toastStripesP2: 'Il Giocatore 2 va sulle mezze',
    toastCueIn: 'Bianca in buca',
    toastRespot: 'La nera torna sul tavolo',
    toastPlaceCue: 'Metti la bianca dove vuoi',
    toastBlackNow: 'Adesso la nera',

    winTitle: 'Hai vinto!',
    loseTitle: 'Ha vinto TheCreator',
    winsP1: 'Vince il Giocatore 1',
    winsP2: 'Vince il Giocatore 2',
    endEight: 'La nera per ultima, come si deve.',
    endEarly: 'La nera è andata in buca troppo presto.',
    endCueEight: 'La nera in buca insieme alla bianca.',
    endWinsCount: (n) => n === 1 ? 'Prima vittoria a questa difficoltà.' : n + ' vittorie a questa difficoltà.',
  },
  en: {
    settingsTitle: 'Settings',
    languageMenuLabel: 'Language',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Leaderboard',
    languageTitle: 'Language',
    languageSub: 'Choose the interface language',
    aimLabel: 'Aiming line',
    close: 'Close',
    back: 'Back',
    play: 'Play',
    gotIt: 'Got it!',
    backToHome: 'Back to Home',

    rulesTitle: 'How to play',
    rule1: 'Put your finger behind the cue ball and drag it back: the cue pulls back with your finger. The further back, the harder the shot — the bar tells you, turning from green to red. Lift your finger and the cue strikes.',
    rule2: 'Move your finger around the cue ball to change direction. Letting go without pulling back does nothing, so you can take your time aiming.',
    rule3: 'At the start every ball belongs to both of you. The first one you pot decides: pot a solid (1 to 7) and solids are yours, pot a stripe (9 to 15) and the stripes are.',
    rule4: 'Pot one of yours and you carry on shooting. Pot nothing and it is the other player’s turn.',
    rule5: 'The black goes last: you may only pot it once your seven are gone. Potting it earlier loses the game — except on the very first shot, when it goes back on the table and play continues.',
    rule6: 'No fouls: hit whatever you like. The only thing that costs you is potting the cue ball — your opponent then puts it wherever they want.',
    rule7: 'The aiming line shows where the cue ball goes, cushions included, and which way the ball you hit will set off. You can switch it off in Settings.',

    modeTitle: 'How do you want to play?',
    modeFriend: 'With a friend',
    modeFriendSub: 'Same device, taking turns',
    modeComputer: 'Against the computer',
    modeComputerSub: 'Three difficulty levels',

    creatorTitle: 'You will play against TheCreator',
    creatorSub: 'the genius behind this beautiful app.',
    chooseDifficulty: 'Choose the difficulty',
    diffStupido: 'Silly',
    diffNormale: 'Normal',
    diffMaster: 'Master',
    tauntStupido: 'Careful, the cue is heavy.',
    tauntNormale: 'A quiet game, then I will show you out.',
    tauntMaster: 'I break. You watch.',

    friendTipTitle: 'Facing each other',
    friendTipBody: 'Lay the device flat on a table between the two of you. The table never turns: each of you shoots from your own end, as around a real one.',

    restartTitle: 'Start the game over?',
    restartBody: 'The current game is lost and the balls go back in the triangle, same mode as now.',
    restartYes: 'Yes, start over',
    restartNo: 'No, keep playing',
    diffChangeTitle: 'Change difficulty?',
    diffChangeBody: 'The current game is lost and you start again from the triangle, at the new difficulty.',
    diffChangeYes: 'Yes, change it',

    playAgain: 'Play again',
    changeMode: 'Change mode',
    leaderboardTitle: 'Leaderboard',
    leaderboardNote: 'Only games won against the computer count.',
    leaderboardEmpty: 'Nobody here yet. Be the first.',
    winsShort: (n) => n === 1 ? '1 win' : n + ' wins',

    you: 'You',
    creator: 'TheCreator',
    player1: 'Player 1',
    player2: 'Player 2',
    turnYours: 'Your turn',
    turnCreator: 'TheCreator shoots',
    turnThinking: 'TheCreator is lining it up',
    turnP1: 'Player 1 shoots',
    turnP2: 'Player 2 shoots',
    turnRolling: 'Balls rolling…',

    toastSolids: 'You are on solids',
    toastStripes: 'You are on stripes',
    toastSolidsPc: 'TheCreator takes the solids',
    toastStripesPc: 'TheCreator takes the stripes',
    toastSolidsP1: 'Player 1 takes the solids',
    toastStripesP1: 'Player 1 takes the stripes',
    toastSolidsP2: 'Player 2 takes the solids',
    toastStripesP2: 'Player 2 takes the stripes',
    toastCueIn: 'Cue ball potted',
    toastRespot: 'The black goes back on the table',
    toastPlaceCue: 'Put the cue ball where you like',
    toastBlackNow: 'The black now',

    winTitle: 'You won!',
    loseTitle: 'TheCreator won',
    winsP1: 'Player 1 wins',
    winsP2: 'Player 2 wins',
    endEight: 'The black last, just as it should be.',
    endEarly: 'The black went down too early.',
    endCueEight: 'The black potted together with the cue ball.',
    endWinsCount: (n) => n === 1 ? 'First win at this difficulty.' : n + ' wins at this difficulty.',
  },
  fr: {
    settingsTitle: 'Réglages',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Classement',
    languageTitle: 'Langue',
    languageSub: "Choisis la langue de l'interface",
    aimLabel: 'Ligne de visée',
    close: 'Fermer',
    back: 'Retour',
    play: 'Jouer',
    gotIt: "J'ai compris !",
    backToHome: "Retour à l'accueil",

    rulesTitle: 'Comment jouer',
    rule1: "Pose le doigt derrière la blanche et tire-le vers l'arrière : la queue recule avec le doigt. Plus tu tires, plus le coup est fort — la barre te le dit, elle passe du vert au rouge. Lâche le doigt et la queue frappe.",
    rule2: 'En déplaçant le doigt autour de la blanche tu changes la direction. Si tu lâches sans avoir tiré vers l’arrière, il ne se passe rien : tu peux viser tranquillement.',
    rule3: "Au début les billes sont à tous les deux. La première que tu rentres décide : une pleine (de 1 à 7) et les pleines sont à toi, une rayée (de 9 à 15) et ce sont les rayées.",
    rule4: "Tant que tu rentres une des tiennes, tu continues. Si tu ne rentres rien, c'est à l'autre.",
    rule5: "La noire passe en dernier : on ne la rentre qu'une fois tes sept billes finies. La rentrer avant fait perdre la partie — sauf au tout premier coup, où elle revient sur le tapis et le jeu continue.",
    rule6: "Aucune faute : tu peux frapper ce que tu veux. La seule chose qui coûte, c'est de rentrer la blanche — l'adversaire la repose alors où il veut.",
    rule7: "La ligne de visée montre où va la blanche, bandes comprises, et de quel côté partira la bille touchée. Tu peux l'éteindre dans les Réglages.",

    modeTitle: 'Comment veux-tu jouer ?',
    modeFriend: 'Avec un ami',
    modeFriendSub: 'Sur le même appareil, chacun son tour',
    modeComputer: "Contre l'ordinateur",
    modeComputerSub: 'Trois niveaux de difficulté',

    creatorTitle: 'Tu joueras contre TheCreator',
    creatorSub: 'le génie derrière cette superbe appli.',
    chooseDifficulty: 'Choisis la difficulté',
    diffStupido: 'Nul',
    diffNormale: 'Normal',
    diffMaster: 'Master',
    tauntStupido: 'Doucement, la queue est lourde.',
    tauntNormale: 'Une partie tranquille, puis je te raccompagne.',
    tauntMaster: "C'est moi qui casse. Toi, regarde.",

    friendTipTitle: "L'un en face de l'autre",
    friendTipBody: "Pose l'appareil à plat sur une table, entre vous deux. Le billard ne tourne jamais : chacun joue de son côté, comme autour d'une vraie table.",

    restartTitle: 'Recommencer la partie ?',
    restartBody: 'La partie en cours est perdue et les billes retournent dans le triangle, dans le même mode.',
    restartYes: 'Oui, recommencer',
    restartNo: 'Non, je continue',
    diffChangeTitle: 'Changer de difficulté ?',
    diffChangeBody: 'La partie en cours est perdue et on repart du triangle, à la nouvelle difficulté.',
    diffChangeYes: 'Oui, changer',

    playAgain: 'Rejouer',
    changeMode: 'Changer de mode',
    leaderboardTitle: 'Classement',
    leaderboardNote: "Seules les parties gagnées contre l'ordinateur comptent.",
    leaderboardEmpty: 'Personne au classement. Commence !',
    winsShort: (n) => n === 1 ? '1 victoire' : n + ' victoires',

    you: 'Toi',
    creator: 'TheCreator',
    player1: 'Joueur 1',
    player2: 'Joueur 2',
    turnYours: "À toi",
    turnCreator: 'TheCreator joue',
    turnThinking: 'TheCreator prépare son coup',
    turnP1: 'Au Joueur 1',
    turnP2: 'Au Joueur 2',
    turnRolling: 'Les billes roulent…',

    toastSolids: 'Tu as les pleines',
    toastStripes: 'Tu as les rayées',
    toastSolidsPc: 'TheCreator prend les pleines',
    toastStripesPc: 'TheCreator prend les rayées',
    toastSolidsP1: 'Le Joueur 1 prend les pleines',
    toastStripesP1: 'Le Joueur 1 prend les rayées',
    toastSolidsP2: 'Le Joueur 2 prend les pleines',
    toastStripesP2: 'Le Joueur 2 prend les rayées',
    toastCueIn: 'Blanche rentrée',
    toastRespot: 'La noire revient sur le tapis',
    toastPlaceCue: 'Pose la blanche où tu veux',
    toastBlackNow: 'La noire maintenant',

    winTitle: 'Tu as gagné !',
    loseTitle: 'TheCreator a gagné',
    winsP1: 'Le Joueur 1 gagne',
    winsP2: 'Le Joueur 2 gagne',
    endEight: 'La noire en dernier, comme il se doit.',
    endEarly: 'La noire est tombée trop tôt.',
    endCueEight: 'La noire rentrée en même temps que la blanche.',
    endWinsCount: (n) => n === 1 ? 'Première victoire à cette difficulté.' : n + ' victoires à cette difficulté.',
  },
};

let language = 'it';
function t() { return UI_STRINGS[language] || UI_STRINGS.it; }
function getSiteLanguage() {
  try {
    const v = localStorage.getItem(SITE_LANGUAGE_KEY);
    return LANGUAGES[v] ? v : null;
  } catch (e) { return null; }
}
function setSiteLanguage(code) {
  try { localStorage.setItem(SITE_LANGUAGE_KEY, code); } catch (e) { /* niente */ }
}

// ---------- elementi ----------
const els = {
  loading: document.getElementById('loadingScreen'),
  gameZone: document.getElementById('gameZone'),
  canvas: document.getElementById('tableCanvas'),
  toast: document.getElementById('centerToast'),
  turnPill: document.getElementById('turnPill'),
  plateTop: document.getElementById('plateTop'),
  plateBottom: document.getElementById('plateBottom'),
  plateTopName: document.getElementById('plateTopName'),
  plateBottomName: document.getElementById('plateBottomName'),
  plateTopBalls: document.getElementById('plateTopBalls'),
  plateBottomBalls: document.getElementById('plateBottomBalls'),

  settingsBtn: document.getElementById('settingsBtn'),
  restartBtn: document.getElementById('restartBtn'),

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
  confirmOverlay: document.getElementById('confirmOverlay'),
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
  aimToggle: document.getElementById('aimToggle'),
  aimSwitch: document.getElementById('aimSwitch'),
  difficultySection: document.getElementById('difficultySection'),
  languageOverlay: document.getElementById('languageOverlay'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  languageList: document.getElementById('languageList'),
  leaderboardOverlay: document.getElementById('leaderboardOverlay'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
  leaderboardTabs: document.getElementById('leaderboardTabs'),
  leaderboardList: document.getElementById('leaderboardList'),
};

const ctx = els.canvas.getContext('2d');

// ---------- colori delle palle ----------
// Sono i colori di sempre del biliardo a mezze e piene: dall'1 al 7 la tinta
// piena, dal 9 al 15 la stessa tinta ma a fascia sul bianco, l'8 nera.
const BALL_COLORS = {
  1: '#F2C230', 2: '#2F6BD8', 3: '#E0402F', 4: '#A45BE0',
  5: '#F08033', 6: '#2FA85C', 7: '#9B4A3A', 8: '#141220',
  9: '#F2C230', 10: '#2F6BD8', 11: '#E0402F', 12: '#A45BE0',
  13: '#F08033', 14: '#2FA85C', 15: '#9B4A3A',
};
const CUE_WHITE = '#F4F1E8';

// ---------- misure del disegno ----------
const RAIL = 7;                       // la sponda, in unità di tavolo
const TOTAL_W = B.W + RAIL * 2;
const TOTAL_H = B.H + RAIL * 2;
let SCALE = 3;                        // pixel veri per unità di tavolo
let staticCanvas = null;              // panno e sponde: si ridisegnano solo quando cambia la misura
const sprites = {};                   // una tela per palla, disegnata una volta sola

// ---------- comandi ----------
const MAX_PULL = 40;                  // quanto si può tirare indietro la stecca
const MIN_PULL = 4;                   // sotto questo non è un tiro, è solo mira
const CUE_GAP = 1.6;                  // spazio fra la punta e la bianca a riposo
const CUE_LEN = 88;

// ---------- stato ----------
// Le tre difficoltà stanno qui in cima e non più giù con la classifica: `stats`
// si costruisce all'avvio chiamando emptyStats(), che le legge, e una `const`
// dichiarata più in basso nel file a quel punto non esiste ancora. Il file si
// spezzava lì, in silenzio, e il gioco non partiva.
const DIFFICULTY_KEYS = ['stupido', 'normale', 'master'];
let game = null;
const ui = {
  started: false,
  over: false,
  mode: null,               // 'pc' | 'friend'
  difficulty: null,
  humanSide: 'p1',
  phase: 'idle',            // idle | aim | rolling | pcthink | pcaim | place
  aim: -Math.PI / 2,        // dove punta la stecca (radianti)
  pull: 0,                  // quanto è tirata indietro
  aiming: false,
  pointerStartDist: 0,
  placing: false,
  placePos: null,
  pcAnim: null,
  shotEvents: null,
  dirty: true,
  ready: false,             // messa dopo il primo avvio: prima non si salva
  aimAid: true,
};
let stats = emptyStats();

// ================================================================
//  GEOMETRIA E DISEGNO
// ================================================================

/* La misura del tavolo non è scritta da nessuna parte: si misura lo spazio che
   resta davvero e si prende quello. Prima si azzera la tela, se no la zona
   risulta grande quanto la tela di prima e la misura non cala mai. */
function applyGeometry() {
  const zone = els.gameZone;
  els.canvas.style.width = '0px';
  els.canvas.style.height = '0px';

  const cs = getComputedStyle(zone);
  const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const availW = Math.max(120, zone.clientWidth - padX);
  const availH = Math.max(160, zone.clientHeight - padY
    - els.plateTop.offsetHeight - els.plateBottom.offsetHeight - 12);

  const ratio = TOTAL_W / TOTAL_H;
  let w = Math.min(availW, availH * ratio);
  let h = w / ratio;
  w = Math.floor(w); h = Math.floor(h);

  els.canvas.style.width = w + 'px';
  els.canvas.style.height = h + 'px';
  // la misura in pixel veri va riscritta a ogni ridimensionamento, anche quando
  // il campo di gioco resta uguale
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  els.canvas.width = Math.max(1, Math.round(w * dpr));
  els.canvas.height = Math.max(1, Math.round(h * dpr));
  SCALE = els.canvas.width / TOTAL_W;

  document.documentElement.style.setProperty('--table-w', w + 'px');
  buildStatic();
  buildSprites();
  ui.dirty = true;
}

function px(x) { return (x + RAIL) * SCALE; }   // da unità di tavolo a pixel

/* Panno, sponde e buche stanno fermi per tutta la partita: si disegnano una
   volta su una tela di scorta e a ogni fotogramma si ricopiano e basta. Con
   sedici palle in movimento ridisegnare anche il tavolo sarebbe il grosso del
   lavoro di ogni fotogramma, per niente. */
function buildStatic() {
  const cw = els.canvas.width, ch = els.canvas.height;
  if (!staticCanvas) staticCanvas = document.createElement('canvas');
  staticCanvas.width = cw; staticCanvas.height = ch;
  const c = staticCanvas.getContext('2d');
  c.clearRect(0, 0, cw, ch);

  const r = 10 * (SCALE / 3);

  // sponde: grafite con il filetto d'alluminio
  const railGrad = c.createLinearGradient(0, 0, 0, ch);
  railGrad.addColorStop(0, '#312D3E');
  railGrad.addColorStop(0.5, '#23202E');
  railGrad.addColorStop(1, '#1A1824');
  roundRect(c, 0, 0, cw, ch, r);
  c.fillStyle = railGrad;
  c.fill();

  // panno
  const fx = px(0), fy = px(0), fw = B.W * SCALE, fh = B.H * SCALE;
  c.fillStyle = '#332856';
  c.fillRect(fx, fy, fw, fh);
  // la luce della lampada cade sul tavolo: più chiara in mezzo, scura ai bordi
  const light = c.createRadialGradient(
    fx + fw * 0.5, fy + fh * 0.42, fw * 0.1,
    fx + fw * 0.5, fy + fh * 0.5, fh * 0.72);
  light.addColorStop(0, 'rgba(120, 96, 190, 0.5)');
  light.addColorStop(0.45, 'rgba(70, 55, 118, 0.22)');
  light.addColorStop(1, 'rgba(12, 8, 24, 0.55)');
  c.fillStyle = light;
  c.fillRect(fx, fy, fw, fh);
  // il pelo del panno, appena accennato
  c.globalAlpha = 0.06;
  c.fillStyle = '#000';
  for (let y = 0; y < fh; y += Math.max(2, 2 * SCALE / 3)) c.fillRect(fx, fy + y, fw, 1);
  c.globalAlpha = 1;

  // ombra interna della sponda sul panno
  c.strokeStyle = 'rgba(0,0,0,0.45)';
  c.lineWidth = Math.max(1, SCALE * 0.9);
  c.strokeRect(fx, fy, fw, fh);
  // filetto d'alluminio
  c.strokeStyle = 'rgba(138,147,166,0.5)';
  c.lineWidth = Math.max(1, SCALE * 0.25);
  c.strokeRect(fx - SCALE * 0.5, fy - SCALE * 0.5, fw + SCALE, fh + SCALE);

  // i segni sulle sponde, come sui tavoli veri: servono a mirare
  c.fillStyle = 'rgba(220, 226, 240, 0.5)';
  const diamond = Math.max(1.2, SCALE * 0.5);
  for (let i = 1; i <= 7; i++) {
    if (i === 4) continue;               // lì c'è la buca centrale
    const y = px(B.H * i / 8);
    dot(c, px(0) - RAIL * SCALE * 0.5, y, diamond);
    dot(c, px(B.W) + RAIL * SCALE * 0.5, y, diamond);
  }
  for (let i = 1; i <= 3; i++) {
    const x = px(B.W * i / 4);
    dot(c, x, px(0) - RAIL * SCALE * 0.5, diamond);
    dot(c, x, px(B.H) + RAIL * SCALE * 0.5, diamond);
  }

  // i due punti del panno: dove torna la bianca e dove sta la punta del triangolo
  c.strokeStyle = 'rgba(230, 235, 250, 0.18)';
  c.lineWidth = Math.max(1, SCALE * 0.14);
  c.beginPath();
  c.moveTo(px(0), px(B.CUE_SPOT.y));
  c.lineTo(px(B.W), px(B.CUE_SPOT.y));
  c.stroke();
  c.fillStyle = 'rgba(230, 235, 250, 0.28)';
  dot(c, px(B.FOOT_SPOT.x), px(B.FOOT_SPOT.y), Math.max(1.2, SCALE * 0.45));

  // le buche, sopra a tutto: il buco nero e la ghiera d'alluminio
  for (const p of B.POCKETS) {
    const cx = px(p.x), cy = px(p.y), rr = p.r * SCALE;
    c.beginPath(); c.arc(cx, cy, rr, 0, TAU);
    c.fillStyle = '#08070D'; c.fill();
    c.lineWidth = Math.max(1, SCALE * 0.32);
    c.strokeStyle = 'rgba(138,147,166,0.55)';
    c.stroke();
    // un filo di luce dentro, in alto: il metallo che riflette la lampada
    c.beginPath(); c.arc(cx, cy, rr * 0.82, Math.PI * 1.1, Math.PI * 1.9);
    c.strokeStyle = 'rgba(200,210,235,0.16)';
    c.lineWidth = Math.max(1, SCALE * 0.5);
    c.stroke();
  }
}

function dot(c, x, y, r) {
  c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}
function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

/* Ogni palla è una figura ferma: si disegna una volta sola su una tela sua
   (luce, ombra, fascia, numero) e poi si ricopia. Rifare gradienti e ombre
   sedici volte per fotogramma è il modo più veloce per far scattare tutto. */
function buildSprites() {
  const d = B.D * SCALE;
  for (let id = 0; id <= 15; id++) sprites[id] = makeBallSprite(id, d);
}

function makeBallSprite(id, d) {
  const pad = Math.ceil(d * 0.26) + 2;
  const size = Math.ceil(d) + pad * 2;
  const cv = document.createElement('canvas');
  cv.width = size; cv.height = size;
  const c = cv.getContext('2d');
  const cx = size / 2, cy = size / 2, r = d / 2;
  const striped = id >= 9 && id <= 15;
  const color = id === 0 ? CUE_WHITE : BALL_COLORS[id];

  // ombra sul panno
  c.beginPath();
  c.ellipse(cx + r * 0.1, cy + r * 0.3, r * 1.02, r * 0.92, 0, 0, TAU);
  c.fillStyle = 'rgba(0,0,0,0.42)';
  c.fill();

  c.save();
  c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.clip();

  c.fillStyle = striped ? CUE_WHITE : color;
  c.fillRect(0, 0, size, size);
  if (striped) {
    c.fillStyle = color;
    c.fillRect(0, cy - r * 0.56, size, r * 1.12);
  }
  // il tondo bianco del numero (non sulla bianca, che numero non ne ha)
  if (id !== 0) {
    c.beginPath(); c.arc(cx, cy, r * 0.44, 0, TAU);
    c.fillStyle = '#F7F4EC'; c.fill();
    if (d >= 20) {
      c.fillStyle = '#1A1726';
      c.font = '700 ' + (r * 0.62).toFixed(1) + 'px Manrope, sans-serif';
      c.textAlign = 'center'; c.textBaseline = 'middle';
      c.fillText(String(id), cx, cy + r * 0.02);
    }
  }
  // luce dall'alto a sinistra e bordo in ombra: è quello che le fa sembrare tonde
  const g = c.createRadialGradient(cx - r * 0.34, cy - r * 0.38, r * 0.04, cx, cy, r * 1.12);
  g.addColorStop(0, 'rgba(255,255,255,0.62)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.06)');
  g.addColorStop(0.72, 'rgba(0,0,0,0.12)');
  g.addColorStop(1, 'rgba(0,0,0,0.55)');
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  c.restore();

  c.beginPath(); c.arc(cx, cy, r, 0, TAU);
  c.strokeStyle = 'rgba(0,0,0,0.45)';
  c.lineWidth = Math.max(0.6, r * 0.07);
  c.stroke();
  return cv;
}

// ---------- il fotogramma ----------
function render() {
  const cw = els.canvas.width, ch = els.canvas.height;
  ctx.clearRect(0, 0, cw, ch);
  if (staticCanvas) ctx.drawImage(staticCanvas, 0, 0);
  if (!game) return;

  // la mira, sotto alle palle: così non copre niente
  if (ui.started && !ui.over && showsAim()) drawAim();

  for (const b of game.balls) {
    if (b.in) continue;
    if (b.id === 0 && ui.placing && ui.placePos) continue;   // la si sta spostando
    const spr = sprites[b.id];
    if (!spr) continue;
    ctx.drawImage(spr, px(b.x) - spr.width / 2, px(b.y) - spr.height / 2);
  }

  // la bianca in mano, attaccata al dito
  if (ui.placing && ui.placePos) {
    const spr = sprites[0];
    const okHere = placementValid(ui.placePos);
    ctx.globalAlpha = okHere ? 1 : 0.45;
    ctx.drawImage(spr, px(ui.placePos.x) - spr.width / 2, px(ui.placePos.y) - spr.height / 2);
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(px(ui.placePos.x), px(ui.placePos.y), B.R * SCALE * 1.7, 0, TAU);
    ctx.strokeStyle = okHere ? '#5FD0C5' : '#E0402F';
    ctx.lineWidth = Math.max(1.2, SCALE * 0.35);
    ctx.stroke();
  } else if (game.ballInHand && ui.phase !== 'rolling' && !ui.over) {
    // c'è da piazzarla: si segnala girandole intorno un anello
    const cue = game.balls[0];
    ctx.beginPath();
    ctx.arc(px(cue.x), px(cue.y), B.R * SCALE * 1.9, 0, TAU);
    ctx.strokeStyle = 'rgba(95,208,197,0.75)';
    ctx.lineWidth = Math.max(1.2, SCALE * 0.3);
    ctx.setLineDash([SCALE * 1.4, SCALE * 1.4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (ui.started && !ui.over && showsCue()) drawCue();
}

function showsCue() {
  return (ui.phase === 'idle' || ui.phase === 'aim' || ui.phase === 'pcaim') && !game.ballInHand;
}
function showsAim() {
  return ui.aimAid && showsCue() && ui.phase !== 'pcaim';
}

function drawAim() {
  const cue = game.balls[0];
  if (cue.in) return;
  const dir = { x: Math.cos(ui.aim), y: Math.sin(ui.aim) };
  const tr = B.traceAim(game.balls, cue, dir, 3);

  ctx.save();
  ctx.lineCap = 'round';
  ctx.setLineDash([SCALE * 2.2, SCALE * 2.2]);
  ctx.lineWidth = Math.max(1, SCALE * 0.32);
  for (let i = 0; i < tr.segs.length; i++) {
    const s = tr.segs[i];
    // il primo pezzo pieno, i rimbalzi via via più smorti: si legge l'ordine
    ctx.strokeStyle = i === 0 ? 'rgba(95,208,197,0.9)' : (i === 1 ? 'rgba(95,208,197,0.42)' : 'rgba(95,208,197,0.22)');
    ctx.beginPath();
    ctx.moveTo(px(s.x1), px(s.y1));
    ctx.lineTo(px(s.x2), px(s.y2));
    ctx.stroke();
  }
  ctx.setLineDash([]);

  if (tr.ghost) {
    // dove la bianca tocca la palla, e da che parte quella partirà
    ctx.beginPath();
    ctx.arc(px(tr.ghost.x), px(tr.ghost.y), B.R * SCALE, 0, TAU);
    ctx.strokeStyle = 'rgba(232,227,245,0.8)';
    ctx.lineWidth = Math.max(1, SCALE * 0.28);
    ctx.stroke();
    if (tr.objDir) {
      const from = game.balls[tr.target];
      const len = 22;
      ctx.beginPath();
      ctx.moveTo(px(from.x), px(from.y));
      ctx.lineTo(px(from.x + tr.objDir.x * len), px(from.y + tr.objDir.y * len));
      ctx.strokeStyle = 'rgba(242,194,48,0.75)';
      ctx.lineWidth = Math.max(1, SCALE * 0.34);
      ctx.stroke();
    }
  }
  ctx.restore();
}

/* La stecca e la barra della forza. La barra È la stecca arretrata: la linea
   che si allunga fra la punta e la bianca passa dal verde al rosso mentre si
   tira indietro, che è esattamente il gesto che si sta facendo. */
function drawCue() {
  const cue = game.balls[0];
  if (cue.in) return;
  const back = { x: -Math.cos(ui.aim), y: -Math.sin(ui.aim) };   // dietro alla bianca
  const tipDist = B.R + CUE_GAP + ui.pull;
  const tip = { x: cue.x + back.x * tipDist, y: cue.y + back.y * tipDist };
  const butt = { x: tip.x + back.x * CUE_LEN, y: tip.y + back.y * CUE_LEN };

  ctx.save();
  ctx.lineCap = 'round';

  // il legno
  ctx.beginPath();
  ctx.moveTo(px(tip.x), px(tip.y));
  ctx.lineTo(px(butt.x), px(butt.y));
  // legno scuro e poco acceso di proposito: con un manico color miele la barra
  // della forza a metà corsa (che lì è ambra) ci si confondeva dentro
  const grad = ctx.createLinearGradient(px(tip.x), px(tip.y), px(butt.x), px(butt.y));
  grad.addColorStop(0, '#D9D2C0');
  grad.addColorStop(0.18, '#6E5B45');
  grad.addColorStop(0.7, '#3B2F23');
  grad.addColorStop(1, '#1C1610');
  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.max(1.4, SCALE * 0.95);
  ctx.stroke();

  // la ghiera e il cuoio in punta
  ctx.beginPath();
  ctx.moveTo(px(tip.x), px(tip.y));
  ctx.lineTo(px(tip.x + back.x * 1.6), px(tip.y + back.y * 1.6));
  ctx.strokeStyle = '#5FD0C5';
  ctx.lineWidth = Math.max(1.6, SCALE * 1.2);
  ctx.stroke();

  /* La barra della forza. È il vuoto fra la punta e la bianca — cioè proprio la
     strada che la stecca farà — e cresce mentre si tira indietro passando dal
     verde al rosso. Sotto ci va una linea scura più larga: senza, sul legno
     della stecca l'arancione di metà corsa si confondeva col manico e la barra
     spariva proprio quando serve. */
  if (ui.pull > 0.6) {
    const p = Math.min(1, ui.pull / MAX_PULL);
    const from = { x: cue.x + back.x * (B.R + CUE_GAP * 0.3), y: cue.y + back.y * (B.R + CUE_GAP * 0.3) };
    const w = Math.max(2.4, SCALE * 1.9);
    ctx.beginPath();
    ctx.moveTo(px(from.x), px(from.y));
    ctx.lineTo(px(tip.x), px(tip.y));
    ctx.strokeStyle = 'rgba(6,5,12,0.85)';
    ctx.lineWidth = w + Math.max(1.6, SCALE * 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px(from.x), px(from.y));
    ctx.lineTo(px(tip.x), px(tip.y));
    ctx.strokeStyle = 'hsl(' + (145 - 145 * p).toFixed(0) + ', 80%, 54%)';
    ctx.lineWidth = w;
    ctx.stroke();
  }
  ctx.restore();
}

// ================================================================
//  IL GIRO DI GIOCO
// ================================================================
let lastTs = 0;
function loop(ts) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0);
  lastTs = ts;

  if (game && ui.phase === 'rolling') {
    B.step(game.balls, dt, ui.shotEvents);
    ui.dirty = true;
    if (B.allStopped(game.balls)) finishShot();
  } else if (ui.phase === 'pcaim') {
    stepPcAim(dt);
  }

  if (!ui.dirty) return;
  ui.dirty = false;
  render();
}

function startShot(angle, power) {
  const cue = game.balls[0];
  const sp = B.speedOf(power);
  cue.vx = Math.cos(angle) * sp;
  cue.vy = Math.sin(angle) * sp;
  ui.shotEvents = B.newEvents();
  ui.phase = 'rolling';
  ui.pull = 0;
  ui.aiming = false;
  updateHUD();
  ui.dirty = true;
}

function finishShot() {
  const potted = ui.shotEvents ? ui.shotEvents.potted.slice() : [];
  const res = B.resolveShot(game, potted);
  ui.phase = 'idle';
  ui.pull = 0;

  // il messaggio: una cosa sola, la più importante di quel tiro
  if (res.win || res.lose) {
    endGame();
    return;
  }
  if (res.assigned) showToast(assignText(res.shooter, res.assigned));
  else if (res.respot) showToast(t().toastRespot);
  else if (res.cueIn) showToast(t().toastCueIn);
  else if (justClearedGroup(res.shooter)) showToast(t().toastBlackNow);

  saveGame();
  updateHUD();
  ui.dirty = true;

  if (game.ballInHand && isPcTurn()) { setTimeout(pcPlaceCue, 620); return; }
  if (game.ballInHand && !isPcTurn()) showToast(t().toastPlaceCue, 2200);
  if (isPcTurn()) setTimeout(pcPlay, 700);
}

function justClearedGroup(who) {
  if (game.open) return false;
  return B.remainingOf(game, who) === 0 && game.turn === who;
}
function assignText(who, group) {
  const solids = group === 'piene';
  if (ui.mode === 'friend') {
    if (who === 'p1') return solids ? t().toastSolidsP1 : t().toastStripesP1;
    return solids ? t().toastSolidsP2 : t().toastStripesP2;
  }
  if (who === ui.humanSide) return solids ? t().toastSolids : t().toastStripes;
  return solids ? t().toastSolidsPc : t().toastStripesPc;
}
function isPcTurn() {
  return ui.mode === 'pc' && !ui.over && game && game.turn !== ui.humanSide;
}

// ---------- il turno di TheCreator ----------
function pcPlaceCue() {
  // fra il momento in cui è stata fissata e adesso la partita può essere
  // cambiata sotto (ricomincia, cambio difficoltà, cambio modalità): senza
  // questo controllo la bianca finirebbe piazzata dentro a una partita nuova
  if (!game || ui.over || !game.ballInHand || !isPcTurn()) return;
  const spot = B.aiPlaceCue(game);
  const cue = game.balls[0];
  cue.in = false; cue.vx = 0; cue.vy = 0;
  cue.x = spot.x; cue.y = spot.y;
  game.ballInHand = false;
  ui.dirty = true;
  saveGame();
  setTimeout(pcPlay, 480);
}

/* Il computer non tira di colpo: prima si vede la stecca mettersi in linea,
   poi arretrare, poi partire. Serve a capire cosa sta facendo — e a non
   ritrovarsi le palle già in movimento senza aver visto niente. */
function pcPlay() {
  if (!game || ui.over || !isPcTurn()) return;
  ui.phase = 'pcthink';
  updateHUD();
  ui.dirty = true;

  setTimeout(() => {
    if (!game || ui.over || !isPcTurn()) return;
    const shot = B.aiShoot(game);
    ui.aim = shot.angle;
    ui.pull = 0;
    ui.pcAnim = { stage: 'pull', tt: 0, power: shot.power, target: MAX_PULL * Math.min(1, shot.power) };
    ui.phase = 'pcaim';
    updateHUD();
    ui.dirty = true;
  }, 420);
}

function stepPcAim(dt) {
  const a = ui.pcAnim;
  if (!a) return;
  a.tt += dt;
  if (a.stage === 'pull') {
    const k = Math.min(1, a.tt / 0.5);
    ui.pull = a.target * easeOut(k);
    ui.dirty = true;
    if (k >= 1) { a.stage = 'hold'; a.tt = 0; }
  } else if (a.stage === 'hold') {
    if (a.tt > 0.22) { a.stage = 'hit'; a.tt = 0; }
  } else {
    const k = Math.min(1, a.tt / 0.09);
    ui.pull = a.target * (1 - k);
    ui.dirty = true;
    if (k >= 1) { ui.pcAnim = null; startShot(ui.aim, a.power); }
  }
}
function easeOut(k) { return 1 - (1 - k) * (1 - k); }

// ================================================================
//  COMANDI
// ================================================================
function canvasPoint(e) {
  const rect = els.canvas.getBoundingClientRect();
  const sx = els.canvas.width / rect.width;
  const sy = els.canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * sx / SCALE - RAIL,
    y: (e.clientY - rect.top) * sy / SCALE - RAIL,
  };
}
function humanCanShoot() {
  return ui.started && !ui.over && ui.phase === 'idle' && !isPcTurn();
}
function placementValid(p) {
  return B.inTable(p.x, p.y, B.R * 1.02) && B.spotFree(game.balls, p.x, p.y, 0);
}

function onPointerDown(e) {
  if (!game || !humanCanShoot()) return;
  const p = canvasPoint(e);

  if (game.ballInHand) {
    ui.placing = true;
    ui.placePos = { x: p.x, y: p.y };
    ui.dirty = true;
    grabPointer(e);
    return;
  }

  const cue = game.balls[0];
  const dx = cue.x - p.x, dy = cue.y - p.y;
  const d = Math.hypot(dx, dy);
  if (d < 0.6) return;                       // proprio sopra alla bianca: non si capisce dove mira
  ui.aiming = true;
  ui.phase = 'aim';
  ui.aim = Math.atan2(dy, dx);
  ui.pointerStartDist = d;
  ui.pull = 0;
  ui.dirty = true;
  grabPointer(e);
}

/* Il dito viene "preso" dalla tela, così continua a comandare anche se esce dal
   tavolo mentre si tira indietro — che è normale, la stecca è lunga. Sta dentro
   a un try perché non tutti i browser accettano di prendere un puntatore in
   ogni situazione, e se rifiuta non deve morire tutto il gesto. */
function grabPointer(e) {
  try {
    if (els.canvas.setPointerCapture && e.pointerId !== undefined) {
      els.canvas.setPointerCapture(e.pointerId);
    }
  } catch (err) { /* pazienza: si gioca lo stesso */ }
}

function onPointerMove(e) {
  if (!game) return;
  if (ui.placing) {
    const p = canvasPoint(e);
    ui.placePos = { x: p.x, y: p.y };
    ui.dirty = true;
    return;
  }
  if (!ui.aiming) return;
  const p = canvasPoint(e);
  const cue = game.balls[0];
  const dx = cue.x - p.x, dy = cue.y - p.y;
  const d = Math.hypot(dx, dy);
  if (d > 0.6) ui.aim = Math.atan2(dy, dx);
  // quanto si è tirato indietro rispetto a DOVE SI È APPOGGIATO il dito: così
  // si può mirare da vicino o da lontano e la forza vuol dire la stessa cosa
  ui.pull = Math.max(0, Math.min(MAX_PULL, d - ui.pointerStartDist));
  ui.dirty = true;
}

function onPointerUp() {
  if (!game) return;
  if (ui.placing) {
    const p = ui.placePos;
    ui.placing = false;
    ui.placePos = null;
    if (p && placementValid(p)) {
      const cue = game.balls[0];
      cue.in = false; cue.vx = 0; cue.vy = 0;
      cue.x = p.x; cue.y = p.y;
      game.ballInHand = false;
      saveGame();
      updateHUD();
    }
    ui.dirty = true;
    return;
  }
  if (!ui.aiming) return;
  ui.aiming = false;
  if (ui.pull >= MIN_PULL) {
    startShot(ui.aim, ui.pull / MAX_PULL);
  } else {
    // troppo poco per essere un tiro: resta solo la mira, come si voleva
    ui.pull = 0;
    ui.phase = 'idle';
    ui.dirty = true;
  }
}

// ================================================================
//  INTERFACCIA
// ================================================================
let toastTimer = null;
function showToast(text, ms) {
  els.toast.textContent = text;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), ms || 1600);
}

function nameOf(side) {
  if (ui.mode === 'friend') return side === 'p1' ? t().player1 : t().player2;
  return side === ui.humanSide ? t().you : t().creator;
}

function updateHUD() {
  // di chi è il turno
  let pill = '—';
  let thinking = false;
  if (ui.started && !ui.over && game) {
    if (ui.phase === 'rolling') pill = t().turnRolling;
    else if (ui.mode === 'friend') pill = game.turn === 'p1' ? t().turnP1 : t().turnP2;
    else if (game.turn === ui.humanSide) pill = t().turnYours;
    else { pill = ui.phase === 'pcthink' ? t().turnThinking : t().turnCreator; thinking = true; }
  }
  els.turnPill.textContent = pill;
  els.turnPill.classList.toggle('thinking', thinking);

  // le targhe: nome e palle che restano
  els.plateTopName.textContent = nameOf('p2');
  els.plateBottomName.textContent = nameOf('p1');
  els.plateTop.classList.toggle('flipped', ui.mode === 'friend');
  els.plateTop.classList.toggle('is-turn', !!(ui.started && !ui.over && game && game.turn === 'p2'));
  els.plateBottom.classList.toggle('is-turn', !!(ui.started && !ui.over && game && game.turn === 'p1'));
  renderPlateBalls(els.plateTopBalls, 'p2');
  renderPlateBalls(els.plateBottomBalls, 'p1');
}

function renderPlateBalls(el, side) {
  if (!game || !ui.started) { el.innerHTML = ''; return; }
  const group = game.groups[side];
  if (!group) { el.innerHTML = '<span class="plate-dash">— — —</span>'; return; }
  let html = '';
  for (const b of game.balls) {
    if (b.in || B.groupOf(b.id) !== group) continue;
    const striped = b.id >= 9;
    html += '<span class="plate-ball' + (striped ? ' striped' : '') + '" style="'
      + (striped ? '--bc:' + BALL_COLORS[b.id] : 'background:' + BALL_COLORS[b.id]) + '"></span>';
  }
  if (!html) {
    const eight = game.balls[8];
    if (eight && !eight.in) html = '<span class="plate-ball" style="background:' + BALL_COLORS[8] + '"></span>';
  }
  el.innerHTML = html;
}

function setEndIcon(name) {
  els.endIcon.innerHTML = '<span class="ffr-ico" data-ico="' + name + '"></span>';
  window.FFR.icons(els.endIcon);
}

function endGame() {
  ui.over = true;
  ui.phase = 'idle';
  const winner = game.winner;
  const reason = game.reason;
  updateHUD();
  ui.dirty = true;

  let sub = t().endEight;
  if (reason === 'earlyEight') sub = t().endEarly;
  else if (reason === 'cueWithEight') sub = t().endCueEight;

  if (ui.mode === 'pc') {
    if (winner === ui.humanSide) {
      setEndIcon('crown');
      els.endTitle.textContent = t().winTitle;
      const n = recordResult('wins');
      els.endSub.textContent = sub + ' ' + t().endWinsCount(n);
    } else {
      setEndIcon('robot');
      els.endTitle.textContent = t().loseTitle;
      recordResult('losses');
      els.endSub.textContent = sub;
    }
  } else {
    setEndIcon('crown');
    els.endTitle.textContent = winner === 'p1' ? t().winsP1 : t().winsP2;
    els.endSub.textContent = sub;
  }
  clearResume();
  els.endOverlay.classList.add('show');
}

// ---------- Progresso e classifica ----------
// In classifica va solo quello che si fa contro il computer: in due sullo stesso
// dispositivo basterebbe farsi vincere a vicenda per gonfiare il punteggio.
// Ogni difficoltà ha la sua graduatoria ('bilio:<difficoltà>') e ci si gareggia
// sul numero di partite vinte. DIFFICULTY_KEYS sta in cima al file, vedi lì.
function emptyStats() {
  const s = {};
  for (const k of DIFFICULTY_KEYS) s[k] = { wins: 0, losses: 0 };
  return s;
}
function totalWins() {
  return DIFFICULTY_KEYS.reduce((n, k) => n + stats[k].wins, 0);
}
function recordResult(field) {
  const key = ui.difficulty;
  if (!key || !stats[key]) return 0;
  stats[key][field] += 1;
  saveGame();
  if (field === 'wins' && window.FFR && window.FFR.auth) {
    window.FFR.auth.saveScore('bilio:' + key, stats[key].wins);
  }
  return stats[key].wins;
}

function serializeGame() {
  if (!game || !ui.started || ui.over) return null;
  return {
    mode: ui.mode,
    difficulty: ui.difficulty,
    balls: game.balls.map(b => ({ i: b.id, x: round2(b.x), y: round2(b.y), in: b.in ? 1 : 0 })),
    turn: game.turn,
    groups: game.groups,
    open: game.open,
    ballInHand: game.ballInHand,
    shots: game.shots,
  };
}
function round2(v) { return Math.round(v * 100) / 100; }

function saveGame() {
  if (!ui.ready) return;                    // durante il caricamento non si scrive
  if (!(window.FFR && window.FFR.auth)) return;
  window.FFR.auth.saveProgress('bilio', { stats, resume: serializeGame() }, totalWins());
}
function clearResume() {
  if (!(window.FFR && window.FFR.auth)) return;
  window.FFR.auth.saveProgress('bilio', { stats, resume: null }, totalWins());
}

// Un salvataggio con una forma che non riconosciamo non deve far perdere le
// vittorie già fatte: si legge quello che si riesce a leggere e basta.
function normalizeStats(saved) {
  const out = emptyStats();
  if (!saved || typeof saved !== 'object' || !saved.stats) return out;
  for (const k of DIFFICULTY_KEYS) {
    const row = saved.stats[k];
    if (!row || typeof row !== 'object') continue;
    out[k] = { wins: Math.max(0, Number(row.wins) || 0), losses: Math.max(0, Number(row.losses) || 0) };
  }
  return out;
}
async function loadSaved() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return window.FFR.auth.loadProgress('bilio');
}

function restoreGame(saved) {
  const r = saved && saved.resume;
  if (!r || !Array.isArray(r.balls) || r.balls.length !== 16) return false;
  if (r.mode !== 'pc' && r.mode !== 'friend') return false;
  if (r.mode === 'pc' && DIFFICULTY_KEYS.indexOf(r.difficulty) === -1) return false;

  const g = B.newGame(r.mode, r.difficulty);
  for (const row of r.balls) {
    const b = g.balls[row.i];
    if (!b) return false;
    const x = Number(row.x), y = Number(row.y);
    if (!isFinite(x) || !isFinite(y)) return false;
    b.x = x; b.y = y; b.in = !!row.in; b.vx = 0; b.vy = 0;
  }
  g.turn = r.turn === 'p2' ? 'p2' : 'p1';
  g.open = !!r.open;
  g.groups = {
    p1: (r.groups && (r.groups.p1 === 'piene' || r.groups.p1 === 'mezze')) ? r.groups.p1 : null,
    p2: (r.groups && (r.groups.p2 === 'piene' || r.groups.p2 === 'mezze')) ? r.groups.p2 : null,
  };
  g.ballInHand = !!r.ballInHand;
  g.shots = Number(r.shots) || 0;
  // la bianca in buca senza palla in mano non è uno stato possibile: la si rimette
  if (g.balls[0].in && !g.ballInHand) B.respotCue(g);

  game = g;
  ui.mode = r.mode;
  ui.difficulty = r.difficulty;
  ui.started = true;
  ui.over = false;
  ui.phase = 'idle';
  ui.aim = -Math.PI / 2;
  ui.pull = 0;
  return true;
}

// ---------- classifica ----------
let leaderboardDifficulty = 'normale';
function openLeaderboard() {
  els.settingsOverlay.classList.remove('show');
  els.leaderboardOverlay.classList.add('show');
  leaderboardDifficulty = ui.difficulty || 'normale';
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
async function loadLeaderboardFor(key) {
  els.leaderboardList.innerHTML = '<div class="leaderboard-empty">…</div>';
  const auth = (window.FFR && window.FFR.auth) ? window.FFR.auth : null;
  const gameKey = 'bilio:' + key;
  const [rows, me] = await Promise.all([
    auth ? auth.getLeaderboard(gameKey, 50) : [],
    auth ? auth.getMyRank(gameKey) : null,
  ]);
  if (key !== leaderboardDifficulty) return;      // si è già cambiata scheda
  if (!rows.length) {
    els.leaderboardList.innerHTML = '<div class="leaderboard-empty">' + t().leaderboardEmpty + '</div>';
    return;
  }
  const myNickname = auth ? auth.getNickname() : null;
  els.leaderboardList.innerHTML = buildLeaderboardRows(rows, me, myNickname, n => t().winsShort(n));
}
// Le righe seguono la regola condivisa del sito: se ne vedono 6 per volta e, se
// chi guarda è fuori dalle prime 5, la sua riga viene infilata come 6ª.
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

// ---------- traduzioni ----------
function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t()[el.dataset.i18n];
    if (typeof val === 'string') el.textContent = val;
  });
  if (ui.difficulty) els.tauntLine.textContent = tauntFor(ui.difficulty);
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

// ---------- linea di mira: un aiuto che si può spegnere ----------
const AIM_KEY = 'bilio-aim-line';
function loadAimPref() {
  try {
    const v = localStorage.getItem(AIM_KEY);
    ui.aimAid = v === null ? true : v === '1';
  } catch (e) { ui.aimAid = true; }
}
function saveAimPref() {
  try { localStorage.setItem(AIM_KEY, ui.aimAid ? '1' : '0'); } catch (e) { /* niente */ }
}
function updateAimSwitch() {
  els.aimSwitch.classList.toggle('on', ui.aimAid);
}

// ---------- pannelli ----------
function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('show'));
}
function markDifficulty() {
  document.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === ui.difficulty);
  });
}
function showOnly(el) {
  hideAllOverlays();
  markDifficulty();
  el.classList.add('show');
}
function openSettings() {
  markDifficulty();
  updateAimSwitch();
  // la difficoltà si cambia solo quando si sta giocando contro il computer
  els.difficultySection.hidden = (ui.mode !== 'pc');
  els.settingsOverlay.classList.add('show');
}

function startNewGame() {
  game = B.newGame(ui.mode, ui.difficulty);
  ui.started = true;
  ui.over = false;
  ui.phase = 'idle';
  ui.aim = -Math.PI / 2;
  ui.pull = 0;
  ui.placing = false;
  ui.placePos = null;
  ui.pcAnim = null;
  hideAllOverlays();
  applyGeometry();
  updateHUD();
  saveGame();
  ui.dirty = true;
}
function goToMode() {
  ui.started = false;
  ui.over = false;
  ui.mode = null;
  game = null;
  clearResume();
  updateHUD();
  showOnly(els.modeOverlay);
  ui.dirty = true;
}

// il cambio di difficoltà butta via la partita in corso: passa dalla conferma,
// da qualunque pannello venga chiesto
let pendingDifficulty = null;
function askDifficulty(key) {
  if (key === ui.difficulty && ui.started && !ui.over) {
    els.settingsOverlay.classList.remove('show');
    return;
  }
  if (!ui.started || ui.over) {
    ui.difficulty = key;
    els.settingsOverlay.classList.remove('show');
    startNewGame();
    return;
  }
  pendingDifficulty = key;
  els.settingsOverlay.classList.remove('show');
  els.confirmOverlay.classList.add('show');
}

// il pannello chiuso con la X del sito non passa dai pulsanti del gioco: quello
// che facevano loro va rifatto qui
window.FFR_ON_MODAL_CLOSE = function (id) {
  if (id === 'rulesOverlay' && !ui.started) showOnly(els.modeOverlay);
  if (id === 'confirmOverlay') pendingDifficulty = null;
};

// ---------- avvio ----------
const TUTORIAL_KEY = 'bilio-tutorial-seen';
function tutorialSeen() {
  try { return localStorage.getItem(TUTORIAL_KEY) === '1'; } catch (e) { return true; }
}
function markTutorialSeen() {
  try { localStorage.setItem(TUTORIAL_KEY, '1'); } catch (e) { /* niente */ }
}

async function init() {
  language = getSiteLanguage() || 'it';
  loadAimPref();
  updateAimSwitch();
  applyTranslations();
  applyGeometry();
  requestAnimationFrame(loop);

  els.canvas.addEventListener('pointerdown', onPointerDown);
  els.canvas.addEventListener('pointermove', onPointerMove);
  els.canvas.addEventListener('pointerup', onPointerUp);
  els.canvas.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('resize', applyGeometry);
  window.addEventListener('orientationchange', () => setTimeout(applyGeometry, 250));
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });

  // istruzioni → modalità → (difficoltà → sfottò) oppure (consiglio per giocare in due)
  els.closeRulesBtn.addEventListener('click', () => {
    markTutorialSeen();
    if (ui.started) { hideAllOverlays(); return; }
    showOnly(els.modeOverlay);
  });
  els.modeFriendBtn.addEventListener('click', () => {
    ui.mode = 'friend';
    ui.difficulty = null;
    updateHUD();
    showOnly(els.friendTipOverlay);
  });
  els.modeComputerBtn.addEventListener('click', () => {
    ui.mode = 'pc';
    updateHUD();
    showOnly(els.difficultyOverlay);
  });
  els.backToModeBtn.addEventListener('click', goToMode);
  document.querySelectorAll('#difficultyOverlay .difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => {
      ui.difficulty = btn.dataset.difficulty;
      els.tauntLine.textContent = tauntFor(ui.difficulty);
      showOnly(els.tauntOverlay);
    });
  });
  document.querySelectorAll('#difficultySection .difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => askDifficulty(btn.dataset.difficulty));
  });
  els.tauntBackBtn.addEventListener('click', () => showOnly(els.difficultyOverlay));
  els.tauntPlayBtn.addEventListener('click', startNewGame);
  els.friendBackBtn.addEventListener('click', goToMode);
  els.friendPlayBtn.addEventListener('click', startNewGame);

  els.restartBtn.addEventListener('click', () => {
    // fuori da una partita questo pulsante è la via di ritorno: senza, chi
    // chiude con la X la scelta iniziale resterebbe davanti a un tavolo muto
    if (!ui.started || ui.over) { goToMode(); return; }
    els.restartOverlay.classList.add('show');
  });
  els.cancelRestartBtn.addEventListener('click', () => els.restartOverlay.classList.remove('show'));
  els.confirmRestartBtn.addEventListener('click', startNewGame);
  els.confirmNoBtn.addEventListener('click', () => {
    pendingDifficulty = null;
    els.confirmOverlay.classList.remove('show');
    els.settingsOverlay.classList.add('show');
  });
  els.confirmYesBtn.addEventListener('click', () => {
    if (pendingDifficulty) ui.difficulty = pendingDifficulty;
    pendingDifficulty = null;
    els.confirmOverlay.classList.remove('show');
    startNewGame();
  });

  els.playAgainBtn.addEventListener('click', startNewGame);
  els.changeModeBtn.addEventListener('click', goToMode);

  els.settingsBtn.addEventListener('click', openSettings);
  els.closeSettingsBtn.addEventListener('click', () => els.settingsOverlay.classList.remove('show'));
  els.settingsOverlay.addEventListener('click', (e) => {
    if (e.target === els.settingsOverlay) els.settingsOverlay.classList.remove('show');
  });
  els.aimToggle.addEventListener('click', () => {
    ui.aimAid = !ui.aimAid;
    saveAimPref();
    updateAimSwitch();
    ui.dirty = true;
  });
  // riaperte dal menu le istruzioni hanno anche la X; al primo avvio no, lì si
  // chiudono solo con "Ho capito!"
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
  // le istruzioni al primo avvio non si chiudono toccando fuori: un tocco per
  // sbaglio le farebbe sparire per sempre senza che nessuno le abbia lette
  els.rulesOverlay.addEventListener('click', (e) => {
    if (e.target === els.rulesOverlay && tutorialSeen()) hideAllOverlays();
  });

  const saved = await loadSaved();
  stats = normalizeStats(saved);
  const resumed = restoreGame(saved);

  if (!tutorialSeen()) {
    showOnly(els.rulesOverlay);              // resta con x-off: si chiude col pulsante
  } else if (resumed) {
    hideAllOverlays();
  } else {
    showOnly(els.modeOverlay);
  }

  applyGeometry();
  updateHUD();
  ui.ready = true;
  ui.dirty = true;

  // ripreso a metà con il computer di turno, tocca a lui
  if (resumed && isPcTurn()) {
    if (game.ballInHand) setTimeout(pcPlaceCue, 900);
    else setTimeout(pcPlay, 900);
  } else if (resumed && game.ballInHand) {
    setTimeout(() => showToast(t().toastPlaceCue, 2200), 700);
  }

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 350);
}
init();
