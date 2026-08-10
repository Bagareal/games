/* ============ COSMY — motore di gioco ============
 *
 * Sparatutto a scorrimento orizzontale: la navicella sta sul quarto sinistro
 * dello schermo, si muove solo su e giù, e lo spazio le scorre incontro. Cento
 * livelli divisi in dieci settori; l'ultimo livello di ogni settore è un boss.
 * Nei livelli normali non si spara: si schiva e si raccolgono monete, che sono
 * il punteggio. Contro il boss la navicella spara da sola (con un dito solo che
 * trascina non c'è posto per un pulsante "fuoco", e chiederlo vorrebbe dire
 * scegliere fra mirare e muoversi).
 *
 * Niente scelta di difficoltà: sale da sola, livello dopo livello, con una
 * curva che si appiattisce verso la fine — difficile, mai impossibile.
 *
 * Le tre cose che tengono il gioco fluido (regole imparate con Blokky):
 *   - lo sfondo è disegnato una volta sola su tele fuori schermo e poi solo
 *     ricopiato scorrendo: nessuna stella viene ridisegnata a mano ogni frame;
 *   - ogni sprite (navicella, asteroidi, monete, boss) è cotto una volta in una
 *     tela sua e da lì in poi si copia e basta, niente ombre calcolate a frame;
 *   - a pannello aperto o partita ferma non si disegna niente.
 * Con ?fps=1 in fondo all'indirizzo compare il contatore dei fotogrammi.
 */

// ---------- Lingua condivisa con tutto il sito ----------
const LANGUAGES = {
  it: { label: 'Italiano', flag: 'flag-it' },
  en: { label: 'English', flag: 'flag-en' },
  fr: { label: 'Français', flag: 'flag-fr' },
};
const LANG_ORDER = ['it', 'en', 'fr']; // l'indice finisce nel punteggio di classifica
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    backToHome: 'Torna in Home',
    tapToContinue: 'Tocca per continuare',
    paused: 'Pausa',
    resume: 'Riprendi',
    restartSector: 'Ricomincia il settore',
    restartTitle: 'Ricominciare il settore?',
    restartBody: 'Il settore riparte dal suo primo livello, con tre vite. Le monete tornano a quante ne avevi entrando nel settore.',
    restartYes: 'Sì, ricomincia',
    restartNo: 'No, continuo',
    settingsTitle: 'Impostazioni',
    languageMenuLabel: 'Lingua',
    commands: 'Istruzioni',
    leaderboardMenuLabel: 'Classifica',
    creditsMenuLabel: 'Titoli di coda',
    leaderboardTitle: 'Classifica',
    leaderboardNote: 'Una sola classifica per tutti: conta il livello raggiunto e, a parità di livello, le monete.',
    leaderboardEmpty: 'Nessun punteggio ancora: gioca da loggato per essere il primo!',
    languageTitle: 'Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    close: 'Chiudi',
    sectorLabel: 'SETTORE',
    levelLabel: 'LIVELLO',
    bossIncoming: 'in arrivo!',
    sectorComplete: 'Settore ripulito!',
    sectorCompleteSub: (name, coins) => `${name} è fuori uso. Monete: ${coins}`,
    continueBtn: 'Continua',
    gameOver: 'Navicella distrutta',
    gameOverSub: (sector, name) => `Settore ${sector} — ${name} ti aspetta ancora. Si riparte dal primo livello del settore.`,
    retryBtn: 'Riprova il settore',
    victoryTitle: 'Sei tornato a casa!',
    victorySub: coins => `Cento livelli, dieci boss, ${coins} monete. La galassia Advertisement tace.`,
    newGame: 'Nuova partita',
    bonusShield: 'Scudo attivo!',
    bonusLife: 'Vita extra!',
    bonusLifeMax: 'Vite al massimo (+25 monete)',
    bonusDouble: 'Doppio colpo!',
    tutorialTitle: 'Come si gioca',
    tutorialMove: "Muovi la navicella su e giù: trascina il dito dove vuoi nell'area di gioco, anche sotto al campo, o usa il mouse e le frecce",
    tutorialDodge: 'Asteroidi, mine e detriti si schivano: toccarli costa una vita',
    tutorialCoins: 'Le monete che raccogli sono il tuo punteggio',
    tutorialBonus: 'Prendi i bonus che passano: scudo per 3 secondi, vita extra e doppio colpo',
    tutorialBoss: "Ogni 10 livelli c'è un boss: lì la navicella spara da sola, tu pensa a mirare e a schivare i suoi colpi",
    tutorialLives: 'Tre vite per settore: se le finisci, il settore riparte dal suo primo livello',
    gotIt: 'Ho capito!',
    creditsSkip: 'Salta',
    creditsSub: 'Il ritorno di TheCreator',
    creditsIntro: [
      'Dieci settori. Dieci padroni della galassia Advertisement.',
      'Un solo pilota abbastanza testardo da attraversarla tutta senza mai premere "Accetta tutto".',
    ],
    creditsHead: 'Sconfitti, in ordine di apparizione',
    creditsBosses: [
      'appariva sempre nel momento sbagliato, e la X era sempre un pixel più in là.',
      'grande come tre schermi, non diceva niente e lo diceva lampeggiando.',
      'voleva sapere tutto. Anche cose che TheCreator aveva già dimenticato.',
      'partiva da solo, a volume massimo, sempre alle due di notte.',
      'ti seguiva ovunque. Anche a motori spenti. Anche in un altro sistema solare.',
      'dalla sua orbita non si è mai riusciti a disiscriversi.',
      'chiedeva il numero della carta per lasciarti proseguire di un metro.',
      'arrivava in mille copie identiche, tutte con lo stesso errore di ortografia.',
      'vendeva a caro prezzo esattamente quello che era già gratis.',
      'sapeva cosa volevi prima di te. Si sbagliava, ma con grande sicurezza.',
    ],
    creditsOutro: [
      'Poi la galassia Advertisement è rimasta in silenzio.',
      'Per la prima volta da anni, nessuno stava cercando di venderle qualcosa.',
      'TheCreator ha puntato la prua verso casa.',
      'È atterrato. Ha aperto il portatile.',
      'E ha fatto un sito di giochi gratis.',
      'Niente pubblicità. Niente pagamenti. Per davvero.',
    ],
    creditsNote: 'Nessun pixel è stato monetizzato durante la lavorazione di questo gioco.',
    creditsEnd: 'Grazie per aver giocato.',
  },
  en: {
    backToHome: 'Back to Home',
    tapToContinue: 'Tap to continue',
    paused: 'Paused',
    resume: 'Resume',
    restartSector: 'Restart the sector',
    restartTitle: 'Restart the sector?',
    restartBody: 'The sector starts again from its first level, with three lives. Your coins go back to what you had when you entered it.',
    restartYes: 'Yes, restart',
    restartNo: 'No, keep going',
    settingsTitle: 'Settings',
    languageMenuLabel: 'Language',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Leaderboard',
    creditsMenuLabel: 'End credits',
    leaderboardTitle: 'Leaderboard',
    leaderboardNote: 'One table for everyone: the level you reached comes first, coins break the tie.',
    leaderboardEmpty: 'No scores yet: play while signed in to be the first!',
    languageTitle: 'Language',
    languageSub: 'Choose the interface language',
    close: 'Close',
    sectorLabel: 'SECTOR',
    levelLabel: 'LEVEL',
    bossIncoming: 'incoming!',
    sectorComplete: 'Sector cleared!',
    sectorCompleteSub: (name, coins) => `${name} is out of order. Coins: ${coins}`,
    continueBtn: 'Continue',
    gameOver: 'Ship destroyed',
    gameOverSub: (sector, name) => `Sector ${sector} — ${name} is still waiting. You start again from the first level of the sector.`,
    retryBtn: 'Try the sector again',
    victoryTitle: 'You made it home!',
    victorySub: coins => `A hundred levels, ten bosses, ${coins} coins. The Advertisement galaxy has gone quiet.`,
    newGame: 'New game',
    bonusShield: 'Shield up!',
    bonusLife: 'Extra life!',
    bonusLifeMax: 'Lives already full (+25 coins)',
    bonusDouble: 'Double shot!',
    tutorialTitle: 'How to play',
    tutorialMove: 'Move the ship up and down: drag your finger anywhere in the play area, including below the field, or use the mouse and the arrow keys',
    tutorialDodge: 'Asteroids, mines and debris are there to be dodged: touching one costs a life',
    tutorialCoins: 'The coins you pick up are your score',
    tutorialBonus: 'Grab the bonuses that drift by: a shield for 3 seconds, an extra life and a double shot',
    tutorialBoss: 'Every 10 levels there is a boss: there the ship fires on its own, you just aim and dodge what it throws at you',
    tutorialLives: 'Three lives per sector: run out and the sector starts again from its first level',
    gotIt: 'Got it!',
    creditsSkip: 'Skip',
    creditsSub: 'The return of TheCreator',
    creditsIntro: [
      'Ten sectors. Ten masters of the Advertisement galaxy.',
      'One pilot stubborn enough to cross it all without ever pressing "Accept all".',
    ],
    creditsHead: 'Defeated, in order of appearance',
    creditsBosses: [
      'always turned up at the wrong moment, and the X was always one pixel further away.',
      'as big as three screens, said nothing at all and said it blinking.',
      'wanted to know everything. Even things TheCreator had already forgotten.',
      'started on its own, at full volume, always at two in the morning.',
      'followed you everywhere. Even with the engines off. Even in another solar system.',
      'nobody ever managed to unsubscribe from its orbit.',
      'asked for your card number to let you move one metre further.',
      'arrived in a thousand identical copies, all with the same typo.',
      'sold at a high price exactly what was already free.',
      'knew what you wanted before you did. It was wrong, but very confident.',
    ],
    creditsOutro: [
      'Then the Advertisement galaxy fell silent.',
      'For the first time in years, nobody was trying to sell it anything.',
      'TheCreator turned the nose of the ship towards home.',
      'Landed. Opened the laptop.',
      'And made a site full of free games.',
      'No ads. No payments. For real.',
    ],
    creditsNote: 'No pixel was monetised in the making of this game.',
    creditsEnd: 'Thanks for playing.',
  },
  fr: {
    backToHome: "Retour à l'accueil",
    tapToContinue: 'Touche pour continuer',
    paused: 'Pause',
    resume: 'Reprendre',
    restartSector: 'Recommencer le secteur',
    restartTitle: 'Recommencer le secteur ?',
    restartBody: 'Le secteur repart de son premier niveau, avec trois vies. Les pièces reviennent à ce que tu avais en y entrant.',
    restartYes: 'Oui, recommencer',
    restartNo: 'Non, je continue',
    settingsTitle: 'Paramètres',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Classement',
    creditsMenuLabel: 'Générique',
    leaderboardTitle: 'Classement',
    leaderboardNote: "Un seul classement pour tous : c'est le niveau atteint qui compte, et les pièces départagent.",
    leaderboardEmpty: "Aucun score pour l'instant : joue connecté pour être le premier !",
    languageTitle: 'Langue',
    languageSub: "Choisis la langue de l'interface",
    close: 'Fermer',
    sectorLabel: 'SECTEUR',
    levelLabel: 'NIVEAU',
    bossIncoming: 'arrive !',
    sectorComplete: 'Secteur nettoyé !',
    sectorCompleteSub: (name, coins) => `${name} est hors service. Pièces : ${coins}`,
    continueBtn: 'Continuer',
    gameOver: 'Vaisseau détruit',
    gameOverSub: (sector, name) => `Secteur ${sector} — ${name} t'attend toujours. On repart du premier niveau du secteur.`,
    retryBtn: 'Réessayer le secteur',
    victoryTitle: 'Tu es rentré à la maison !',
    victorySub: coins => `Cent niveaux, dix boss, ${coins} pièces. La galaxie Advertisement s'est tue.`,
    newGame: 'Nouvelle partie',
    bonusShield: 'Bouclier activé !',
    bonusLife: 'Vie supplémentaire !',
    bonusLifeMax: 'Vies au maximum (+25 pièces)',
    bonusDouble: 'Tir double !',
    tutorialTitle: 'Comment jouer',
    tutorialMove: "Déplace le vaisseau de haut en bas : glisse ton doigt où tu veux dans la zone de jeu, même sous le champ, ou utilise la souris et les flèches",
    tutorialDodge: 'Astéroïdes, mines et débris sont là pour être esquivés : les toucher coûte une vie',
    tutorialCoins: 'Les pièces que tu ramasses sont ton score',
    tutorialBonus: 'Attrape les bonus qui passent : bouclier pendant 3 secondes, vie supplémentaire et tir double',
    tutorialBoss: "Tous les 10 niveaux il y a un boss : là le vaisseau tire tout seul, toi tu vises et tu esquives ses tirs",
    tutorialLives: 'Trois vies par secteur : si tu les perds, le secteur repart de son premier niveau',
    gotIt: "C'est compris !",
    creditsSkip: 'Passer',
    creditsSub: 'Le retour de TheCreator',
    creditsIntro: [
      'Dix secteurs. Dix maîtres de la galaxie Advertisement.',
      'Un seul pilote assez têtu pour la traverser sans jamais appuyer sur « Tout accepter ».',
    ],
    creditsHead: "Vaincus, par ordre d'apparition",
    creditsBosses: [
      'apparaissait toujours au mauvais moment, et la croix était toujours un pixel plus loin.',
      'grand comme trois écrans, ne disait rien et le disait en clignotant.',
      'voulait tout savoir. Même ce que TheCreator avait déjà oublié.',
      'démarrait tout seul, à plein volume, toujours à deux heures du matin.',
      'te suivait partout. Même moteurs éteints. Même dans un autre système solaire.',
      "personne n'a jamais réussi à se désabonner de son orbite.",
      'demandait ton numéro de carte pour te laisser avancer d\'un mètre.',
      'arrivait en mille copies identiques, toutes avec la même faute de frappe.',
      'vendait très cher exactement ce qui était déjà gratuit.',
      'savait ce que tu voulais avant toi. Il se trompait, mais avec beaucoup d\'assurance.',
    ],
    creditsOutro: [
      "Puis la galaxie Advertisement s'est tue.",
      "Pour la première fois depuis des années, personne n'essayait de lui vendre quoi que ce soit.",
      'TheCreator a mis le cap sur la maison.',
      "Il a atterri. Il a ouvert son portable.",
      'Et il a fait un site de jeux gratuits.',
      'Pas de publicité. Pas de paiements. Pour de vrai.',
    ],
    creditsNote: "Aucun pixel n'a été monétisé pendant la fabrication de ce jeu.",
    creditsEnd: "Merci d'avoir joué.",
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
  updateSectorLine();
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
const VW = 240, VH = 160;          // risoluzione virtuale (pixel art vera: il canvas è grande così)
const TOP = 10, BOTTOM = VH - 6;   // fascia dove la navicella può volare
const SHIP_X = 26;                 // la navicella sta a sinistra: si vede arrivare la roba
const MAX_LIVES = 5, START_LIVES = 3;
const LEVELS = 100, PER_SECTOR = 10;

// ---------- I dieci settori ----------
// Ogni settore ha il suo cielo, le sue rocce e il suo boss. Il nome del settore
// è il nome del boss che lo comanda: sono i dieci mestieri della pubblicità,
// termini generici, nessun marchio di nessuno.
const SECTORS = [
  { name: 'POP-UP',     sky: ['#0C1026', '#2A1420'], neb: ['#8A3A18', '#E0873C'], star: '#FFE6C4', rock: ['#7A6A62', '#A9998E', '#463A36'] },
  { name: 'BANNER',     sky: ['#2A0E2E', '#480F33'], neb: ['#A02F5A', '#E0603C'], star: '#FFD9E2', rock: ['#7A5A6A', '#A98598', '#4A2E3C'] },
  { name: 'COOKIE',     sky: ['#20130A', '#3A1F0C'], neb: ['#8A4A18', '#D08A34'], star: '#FFE9BC', rock: ['#8A6A45', '#B8946A', '#503A22'] },
  { name: 'AUTOPLAY',   sky: ['#06180F', '#0B2A18'], neb: ['#1E6E43', '#7FBF4A'], star: '#D8FFDC', rock: ['#5C7060', '#8AA089', '#31423A'] },
  { name: 'TRACKER',    sky: ['#210608', '#3E0C0D'], neb: ['#A62A22', '#F0763A'], star: '#FFD5C4', rock: ['#7E5A50', '#AC8276', '#48302B'] },
  { name: 'NEWSLETTER', sky: ['#04141E', '#062634'], neb: ['#12708C', '#4FC3D9'], star: '#D6F6FF', rock: ['#55707E', '#829CA8', '#2E434E'] },
  { name: 'PAYWALL',    sky: ['#101216', '#1E2228'], neb: ['#4A525E', '#C8752C'], star: '#EAF0F6', rock: ['#6E7480', '#9AA0AA', '#3C4048'] },
  { name: 'SPAM',       sky: ['#1A1A08', '#2E2C0C'], neb: ['#8A7A18', '#D4C23A'], star: '#FFFBD0', rock: ['#7E7A50', '#ABA678', '#46442A'] },
  { name: 'PREMIUM',    sky: ['#120E04', '#241B06'], neb: ['#9A7414', '#FFC94A'], star: '#FFF0C0', rock: ['#8A7A4A', '#C0AC74', '#4C4224'] },
  { name: 'ALGO',       sky: ['#050A22', '#0A1440'], neb: ['#1E3EA0', '#3FE0F0'], star: '#DCEBFF', rock: ['#5A6A90', '#8898BC', '#323C58'] },
];
function sectorOf(level) { return Math.floor((level - 1) / PER_SECTOR); }
function sectorFirstLevel(level) { return sectorOf(level) * PER_SECTOR + 1; }
function isBossLevel(level) { return level % PER_SECTOR === 0; }

// ---------- Disegni: ogni sprite è cotto una volta in una tela sua ----------
function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const cx = c.getContext('2d');
  cx.imageSmoothingEnabled = false;
  return c;
}
// pattern = righe di caratteri, colors = { carattere: colore }. scale intero,
// così i pixel restano quadrati e nitidi.
function bakePattern(pattern, colors, scale) {
  scale = scale || 1;
  const w = pattern[0].length, h = pattern.length;
  const c = makeCanvas(w * scale, h * scale);
  const cx = c.getContext('2d');
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < pattern[y].length; x++) {
      const col = colors[pattern[y][x]];
      if (!col) continue;
      cx.fillStyle = col;
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
  return c;
}

// La navicella, 14x9. La prima versione era simmetrica come una freccia e
// ingrandita non si capiva cosa fosse (sembrava un termometro): questa ha una
// forma sola e riconoscibile — muso a punta a destra, cabina davanti, ali che
// si allargano andando indietro, pinne arancioni e motori in coda.
const SHIP_PATTERN = [
  '....A.........',
  '...WAW........',
  '..WWWWXXX.....',
  'EEWWWWXXXXXX..',
  'EEWWWWXXXCCXX.',
  'EEWWWWXXXXXX..',
  '..WWWWXXX.....',
  '...WAW........',
  '....A.........',
];
const SHIP_COLORS = { W: '#8C93B8', A: '#FF7133', X: '#DDE3F0', C: '#6FD3E8', E: '#C93A22' };
const SHIP_W = 14, SHIP_H = 9;
// la navicella si prende meno spazio di quanto ne occupi il disegno: le punte
// delle ali non devono uccidere, o sembra sempre un colpo rubato
const SHIP_HIT = { dx: 4, dy: 3, w: 8, h: 3 };

const HEART_PATTERN = [
  '.XX.XX.',
  'XXXXXXX',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];

// monete: quattro fotogrammi di rotazione
const COIN_FRAMES = [
  ['..CCC..', '.CBBBC.', 'CBBBBBC', 'CBBBBBC', 'CBBBBBC', '.CBBBC.', '..CCC..'],
  ['...C...', '..CBC..', '.CBBBC.', '.CBBBC.', '.CBBBC.', '..CBC..', '...C...'],
  ['...C...', '...C...', '..CBC..', '..CBC..', '..CBC..', '...C...', '...C...'],
  ['...C...', '..CBC..', '.CBBBC.', '.CBBBC.', '.CBBBC.', '..CBC..', '...C...'],
];
const COIN_COLORS = { C: '#B8860B', B: '#FFC94A' };

const MINE_PATTERN = [
  '..X..X..',
  '.XBBBBX.',
  '.BBDDBB.',
  'XBDDDDBX',
  'XBDDDDBX',
  '.BBDDBB.',
  '.XBBBBX.',
  '..X..X..',
];
const MINE_COLORS_ON = { X: '#5A5F70', B: '#2E3242', D: '#FF4B3A' };
const MINE_COLORS_OFF = { X: '#5A5F70', B: '#2E3242', D: '#8A2018' };

// bonus: una pastiglia con dentro il suo segno
const BONUS_SHIELD = [
  '.PPPPPPPPP.',
  'PWWWWWWWWWP',
  'PW..GGG..WP',
  'PW.GGGGG.WP',
  'PW.GGGGG.WP',
  'PW.GGGGG.WP',
  'PW..GGG..WP',
  'PW...G...WP',
  'PWWWWWWWWWP',
  '.PPPPPPPPP.',
  '...........',
];
const BONUS_LIFE = [
  '.PPPPPPPPP.',
  'PWWWWWWWWWP',
  'PW.GG.GG.WP',
  'PWGGGGGGGWP',
  'PWGGGGGGGWP',
  'PW.GGGGG.WP',
  'PW..GGG..WP',
  'PW...G...WP',
  'PWWWWWWWWWP',
  '.PPPPPPPPP.',
  '...........',
];
const BONUS_DOUBLE = [
  '.PPPPPPPPP.',
  'PWWWWWWWWWP',
  'PW.......WP',
  'PWGGGG...WP',
  'PW.......WP',
  'PW.......WP',
  'PWGGGG...WP',
  'PW.......WP',
  'PWWWWWWWWWP',
  '.PPPPPPPPP.',
  '...........',
];

// ---------- I dieci boss ----------
// Ognuno è un disegno suo, 14x14 celle ingrandite 3 volte, con la sua tavolozza
// e il suo modo di sparare. Sono astronavi aliene: nessuna imita niente di
// reale, il nome dice solo di che fastidio sono la caricatura.
const BOSSES = [
  {
    name: 'POP-UP', move: 'sine', speed: 26, hp: 60,
    colors: { A: '#E8E4F2', B: '#2A2440', C: '#FF6B8A', D: '#7B2E4A', E: '#FFD4DC' },
    pattern: [
      '..BBBBBBBBBB..',
      '..BCCCCCCCDB..',
      '..BBBBBBBBBB..',
      '..BAAAAAAAAB..',
      '..BAAAAAAAAB..',
      '..BAAEEEEAAB..',
      '..BAAEDDEAAB..',
      '..BAAEDDEAAB..',
      '..BAAEEEEAAB..',
      '..BAAAAAAAAB..',
      '..BAAAAAAAAB..',
      '..BAAAAAAAAB..',
      '..BBBBBBBBBB..',
      '..............',
    ],
  },
  {
    name: 'BANNER', move: 'patrol', speed: 46, hp: 80,
    colors: { A: '#F0C64A', B: '#3A2008', C: '#E0603C', D: '#7A2A12', E: '#FFF0B8' },
    pattern: [
      '..............',
      '..............',
      'BBBBBBBBBBBBBB',
      'BCCCCCCCCCCCCB',
      'BAAAAAAAAAAAAB',
      'BEEEEEEEEEEEEB',
      'BAAAADDDDAAAAB',
      'BAAAADDDDAAAAB',
      'BEEEEEEEEEEEEB',
      'BAAAAAAAAAAAAB',
      'BCCCCCCCCCCCCB',
      'BBBBBBBBBBBBBB',
      '..............',
      '..............',
    ],
  },
  {
    name: 'COOKIE', move: 'chase', speed: 30, hp: 100,
    colors: { A: '#C89A5A', B: '#4A2E12', C: '#8A5A28', D: '#3A2008', E: '#F2D9A8' },
    pattern: [
      '....BBBBBB....',
      '..BBAAAAAABB..',
      '.BAAAADDAAAAB.',
      '.BAAAAAAAAAAB.',
      'BAADDAAAAAAAAB',
      'BAAAAAAAADDAAB',
      'BAAAAAEEAAAAAB',
      'BAAAAAEEAAAAAB',
      'BAADDAAAAAAAAB',
      'BAAAAAAAADDAAB',
      '.BAAAAAAAAAAB.',
      '.BAAAADDAAAAB.',
      '..BBAAAAAABB..',
      '....BBBBBB....',
    ],
  },
  {
    name: 'AUTOPLAY', move: 'sine', speed: 54, hp: 110,
    colors: { A: '#2E3A2A', B: '#0A1408', C: '#7FBF4A', D: '#D8FF6A', E: '#4A6A38' },
    pattern: [
      '....BBBBBB....',
      '..BBCCCCCCBB..',
      '.BCCAAAAAACCB.',
      'BCCAAAAAAAACCB',
      'BCAADAAAAAAACB',
      'BCAADDAAAAAACB',
      'BCAADDDAAAAACB',
      'BCAADDDAAAAACB',
      'BCAADDAAAAAACB',
      'BCAADAAAAAAACB',
      'BCCAAAAAAAACCB',
      '.BCCAAAAAACCB.',
      '..BBCCCCCCBB..',
      '....BBBBBB....',
    ],
  },
  {
    name: 'TRACKER', move: 'chase', speed: 44, hp: 140,
    colors: { A: '#9A3A2E', B: '#2A0A08', C: '#E0603C', D: '#FFE24A', E: '#F0A050' },
    pattern: [
      '.....BBBB.....',
      '...BBAAAABB...',
      '..BAAAAAAAAB..',
      '.BAAAAAAAAAAB.',
      'BAAAEEEEEEAAAB',
      'BAAEEDDDDEEAAB',
      'BAAEDDDDDDEAAB',
      'BAAEDDDDDDEAAB',
      'BAAEEDDDDEEAAB',
      'BAAAEEEEEEAAAB',
      '.BAAAAAAAAAAB.',
      '..BAAAAAAAAB..',
      '...BBAAAABB...',
      '.....BBBB.....',
    ],
  },
  {
    name: 'NEWSLETTER', move: 'patrol', speed: 40, hp: 135,
    colors: { A: '#D8E8EE', B: '#123A4A', C: '#4FC3D9', D: '#0E7A94', E: '#FFFFFF' },
    pattern: [
      '..............',
      'BBBBBBBBBBBBBB',
      'BAAAAAAAAAAAAB',
      'BCAAAAAAAAAACB',
      'BACCAAAAAACCAB',
      'BAACCAAAACCAAB',
      'BAAACCAACCAAAB',
      'BAAAACCCCAAAAB',
      'BAAAADDDDAAAAB',
      'BAAAAAAAAAAAAB',
      'BAAAAAAAAAAAAB',
      'BBBBBBBBBBBBBB',
      '..............',
      '..............',
    ],
  },
  {
    name: 'PAYWALL', move: 'patrol', speed: 28, hp: 145,
    colors: { A: '#8A8F9A', B: '#31353E', C: '#C8752C', D: '#FFC94A', E: '#B0B6C0' },
    pattern: [
      'BBBBBBBBBBBBBB',
      'BAAAABAAAABAAB',
      'BAAAABAAAABAAB',
      'BBBBBBBBBBBBBB',
      'BABAAAABAAAABB',
      'BABAADDAAAAABB',
      'BBBBBDDDDBBBBB',
      'BAAAABDDBAAAAB',
      'BAAAABDDBAAAAB',
      'BBBBBBBBBBBBBB',
      'BAAAABAAAABAAB',
      'BAAAABAAAABAAB',
      'BBBBBBBBBBBBBB',
      '..............',
    ],
  },
  {
    name: 'SPAM', move: 'jitter', speed: 52, hp: 170,
    colors: { A: '#C8B84A', B: '#3A340A', C: '#8A7A18', D: '#FFF07A', E: '#6A6014' },
    pattern: [
      '..BBBBBBBBBB..',
      '.BCCCCCCCCCCB.',
      '.BCAAAAAAAACB.',
      'BBAADAAAADAABB',
      'BAAAAAAAAAAAAB',
      'BAADAAADAAADAB',
      'BAAAAAAAAAAAAB',
      'BAADAAADAAADAB',
      'BAAAAAAAAAAAAB',
      'BBAADAAAADAABB',
      '.BCAAAAAAAACB.',
      '.BCCCCCCCCCCB.',
      '..BBBBBBBBBB..',
      '..............',
    ],
  },
  {
    name: 'PREMIUM', move: 'sine', speed: 46, hp: 180,
    colors: { A: '#8A6A1A', B: '#2A2006', C: '#FFC94A', D: '#FFF3C0', E: '#C09A2A' },
    pattern: [
      'B............B',
      'BB..........BB',
      'BCB...BB...BCB',
      'BCCB.BCCB.BCCB',
      'BCCCBBCCCBBCCB',
      'BCCCCCCCCCCCCB',
      'BAAAAAAAAAAAAB',
      'BAADDAAAADDAAB',
      'BAAAAAAAAAAAAB',
      'BAAAAADDAAAAAB',
      'BAAAAAAAAAAAAB',
      'BBBBBBBBBBBBBB',
      '..............',
      '..............',
    ],
  },
  {
    name: 'ALGO', move: 'chase', speed: 62, hp: 240,
    colors: { A: '#22305A', B: '#0A1024', C: '#3FE0F0', D: '#8AF0FF', E: '#FFFFFF' },
    pattern: [
      '..B.B.B.B.B.B.',
      'BBBBBBBBBBBBBB',
      'BAAAAAAAAAAAAB',
      'BACCCCCCCCCCAB',
      'BACAAAAAAAACAB',
      'BACAADDDDAACAB',
      'BACAADEEDAACAB',
      'BACAADEEDAACAB',
      'BACAADDDDAACAB',
      'BACAAAAAAAACAB',
      'BACCCCCCCCCCAB',
      'BAAAAAAAAAAAAB',
      'BBBBBBBBBBBBBB',
      '..B.B.B.B.B.B.',
    ],
  },
];
const BOSS_SCALE = 3;
const BOSS_SIZE = 14 * BOSS_SCALE; // 42x42

// sprite cotti una volta sola all'avvio
const SPR = {
  ship: bakePattern(SHIP_PATTERN, SHIP_COLORS, 1),
  coin: COIN_FRAMES.map(f => bakePattern(f, COIN_COLORS, 1)),
  mineOn: bakePattern(MINE_PATTERN, MINE_COLORS_ON, 1),
  mineOff: bakePattern(MINE_PATTERN, MINE_COLORS_OFF, 1),
  bonus: {
    shield: bakePattern(BONUS_SHIELD, { P: '#0A1024', W: '#6FD3E8', G: '#DFF7FF' }, 1),
    life: bakePattern(BONUS_LIFE, { P: '#0A1024', W: '#C93A22', G: '#FF9A7A' }, 1),
    double: bakePattern(BONUS_DOUBLE, { P: '#0A1024', W: '#FFB23F', G: '#FFF0C0' }, 1),
  },
  bosses: BOSSES.map(b => bakePattern(b.pattern, b.colors, BOSS_SCALE)),
  rocks: [],   // riempito a ogni cambio di settore
  block: null, // idem: il mattone dei muri di detriti
};

// asteroidi: una forma tonda e bitorzoluta generata a partire da un seme, in
// tre varianti per due misure, nei colori del settore
function bakeRock(size, seed, colors) {
  const rnd = seededRandom(seed);
  const radii = [];
  for (let i = 0; i < 8; i++) radii.push(0.72 + rnd() * 0.28);
  const c = makeCanvas(size, size);
  const cx = c.getContext('2d');
  const half = size / 2;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - half + 0.5, dy = y - half + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy) / half;
      let ang = Math.atan2(dy, dx) / (Math.PI * 2);
      if (ang < 0) ang += 1;
      const slot = ang * 8;
      const a = radii[Math.floor(slot) % 8], b = radii[(Math.floor(slot) + 1) % 8];
      const edge = a + (b - a) * (slot - Math.floor(slot));
      if (dist > edge) continue;
      let col = colors[0];
      if (dist > edge - 0.16 && dx + dy > 0) col = colors[2];       // il bordo in ombra, in basso a destra
      else if (dist > edge - 0.18 && dx + dy <= 0) col = colors[1]; // il bordo illuminato, in alto a sinistra
      cx.fillStyle = col;
      cx.fillRect(x, y, 1, 1);
    }
  }
  // due o tre crateri
  const craters = 2 + Math.floor(rnd() * 2);
  cx.fillStyle = colors[2];
  for (let i = 0; i < craters; i++) {
    const cxp = Math.floor(rnd() * (size - 4)) + 2;
    const cyp = Math.floor(rnd() * (size - 4)) + 2;
    const r = size > 12 ? 1 + Math.floor(rnd() * 2) : 1;
    const ddx = cxp - half, ddy = cyp - half;
    if (Math.sqrt(ddx * ddx + ddy * ddy) / half > 0.55) continue;
    cx.fillRect(cxp - r, cyp - r, r * 2, r * 2);
  }
  return c;
}
function bakeSectorSprites(sector) {
  const colors = SECTORS[sector].rock;
  SPR.rocks = [];
  for (const size of [9, 15]) {
    const set = [];
    for (let v = 0; v < 3; v++) set.push(bakeRock(size, sector * 977 + size * 31 + v * 7 + 3, colors));
    SPR.rocks.push(set);
  }
  const block = makeCanvas(10, 10);
  const bx = block.getContext('2d');
  bx.fillStyle = colors[0]; bx.fillRect(0, 0, 10, 10);
  bx.fillStyle = colors[1]; bx.fillRect(0, 0, 10, 1); bx.fillRect(0, 0, 1, 10);
  bx.fillStyle = colors[2]; bx.fillRect(0, 9, 10, 1); bx.fillRect(9, 0, 1, 10);
  bx.fillStyle = colors[2]; bx.fillRect(3, 4, 2, 2); bx.fillRect(6, 7, 2, 1);
  SPR.block = block;
}

// ---------- Sfondo: quattro strati cotti e poi solo fatti scorrere ----------
// Ogni strato è una tela larga quanto il campo, disegnata in modo da poter
// essere accostata a sé stessa senza giunte (chi finisce oltre il bordo viene
// ridisegnato anche dall'altra parte). A ogni frame si copia due volte.
const layers = [];
function buildBackground(level) {
  const sector = sectorOf(level);
  const s = SECTORS[sector];
  const rnd = seededRandom(level * 31337 + 7);
  layers.length = 0;

  // nebulose + pianeti: lo strato più lento e più lontano
  const neb = makeCanvas(VW, VH);
  const nc = neb.getContext('2d');
  const grad = nc.createLinearGradient(0, 0, 0, VH);
  grad.addColorStop(0, s.sky[0]);
  grad.addColorStop(1, s.sky[1]);
  nc.fillStyle = grad;
  nc.fillRect(0, 0, VW, VH);
  const blobs = 2 + Math.floor(rnd() * 3);
  for (let i = 0; i < blobs; i++) {
    const bx = rnd() * VW, by = rnd() * VH, br = 20 + rnd() * 40;
    const col = s.neb[i % s.neb.length];
    for (const off of [-VW, 0, VW]) {   // la copia ai lati evita la giunta
      const g = nc.createRadialGradient(bx + off, by, 0, bx + off, by, br);
      g.addColorStop(0, col + '3A');
      g.addColorStop(1, col + '00');
      nc.fillStyle = g;
      nc.fillRect(bx + off - br, by - br, br * 2, br * 2);
    }
  }
  // un pianeta grosso ogni tanto, così i livelli non si somigliano tutti
  if (rnd() < 0.6) {
    const pr = 18 + rnd() * 26;
    const px = rnd() * VW, py = 20 + rnd() * (VH - 60);
    for (const off of [-VW, 0, VW]) {
      const g = nc.createRadialGradient(px + off - pr * 0.35, py - pr * 0.35, pr * 0.1, px + off, py, pr);
      g.addColorStop(0, s.neb[1] + 'CC');
      g.addColorStop(0.55, s.neb[0] + 'AA');
      g.addColorStop(1, s.sky[1] + 'EE');
      nc.fillStyle = g;
      nc.beginPath();
      nc.arc(px + off, py, pr, 0, Math.PI * 2);
      nc.fill();
    }
  }
  layers.push({ canvas: neb, speed: 0.06, offset: 0 });

  // tre strati di stelle a velocità diverse: è questo che dà il senso di
  // avanzare, molto più della roba che arriva addosso
  const specs = [
    { count: 46, size: 1, alpha: 0.45, speed: 0.16 },
    { count: 30, size: 1, alpha: 0.75, speed: 0.34 },
    { count: 16, size: 2, alpha: 1.0, speed: 0.62 },
  ];
  for (const spec of specs) {
    const c = makeCanvas(VW, VH);
    const cx = c.getContext('2d');
    cx.globalAlpha = spec.alpha;
    for (let i = 0; i < spec.count; i++) {
      cx.fillStyle = rnd() < 0.12 ? s.neb[1] : s.star;
      cx.fillRect(Math.floor(rnd() * VW), Math.floor(rnd() * VH), spec.size, spec.size);
    }
    layers.push({ canvas: c, speed: spec.speed, offset: 0 });
  }
}

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------- Come si costruisce un livello ----------
// Tutto deterministico: lo stesso livello ha sempre lo stesso schema, così
// riprovando un settore si impara davvero invece di ricominciare da zero.
// La difficoltà sale col settore e si appiattisce verso la fine: gli intervalli
// non scendono sotto una soglia e i varchi non si stringono oltre il minimo.
function levelPlan(level) {
  const sector = sectorOf(level);
  const rnd = seededRandom(level * 7919 + 13);
  if (isBossLevel(level)) return { boss: sector, duration: 0, events: [] };

  const duration = 25 + sector * 1.1;
  const scroll = 46 + sector * 3;
  const interval = Math.max(0.62, 1.45 - sector * 0.075);
  const gap = Math.max(36, 62 - sector * 2.6);
  const events = [];

  let time = 1.6;
  let nextCoin = 3.5;
  let nextBonus = 8 + rnd() * 6;
  while (time < duration) {
    const roll = rnd();
    // il repertorio si allarga andando avanti: prima solo sassi, poi mine,
    // poi i muri di detriti, poi i sassi veloci
    if (sector >= 2 && roll < 0.16) {
      events.push({ t: time, kind: 'wall', gapY: TOP + 6 + rnd() * (BOTTOM - TOP - gap - 12), gap: gap });
      time += interval * 1.9;
    } else if (sector >= 1 && roll < 0.36) {
      events.push({ t: time, kind: 'mine', y: TOP + rnd() * (BOTTOM - TOP), amp: 8 + rnd() * 14 });
      time += interval * 1.15;
    } else {
      const big = rnd() < 0.42;
      const fast = sector >= 4 && rnd() < 0.22;
      events.push({
        t: time, kind: 'rock', y: TOP + rnd() * (BOTTOM - TOP),
        big: big, variant: Math.floor(rnd() * 3),
        vy: (rnd() - 0.5) * (sector >= 3 ? 22 : 8),
        speedMul: fast ? 1.85 : 1,
      });
      time += interval * (big ? 1.05 : 0.85);
    }
    time += rnd() * 0.3;

    if (time > nextCoin) {
      events.push({
        t: nextCoin, kind: 'coins', y: TOP + 12 + rnd() * (BOTTOM - TOP - 26),
        n: 5 + Math.floor(rnd() * 4), amp: 10 + rnd() * 16, dir: rnd() < 0.5 ? 1 : -1,
      });
      nextCoin += 4 + rnd() * 3;
    }
    if (time > nextBonus) {
      // scudo quasi sempre, vita di rado: una vita facile toglierebbe il senso
      // a "il settore si finisce tutto d'un fiato"
      events.push({ t: nextBonus, kind: 'bonus', y: TOP + 10 + rnd() * (BOTTOM - TOP - 20), type: rnd() < 0.22 ? 'life' : 'shield' });
      nextBonus += 13 + rnd() * 8;
    }
  }
  events.sort((a, b) => a.t - b.t);
  return { boss: -1, duration: duration, scroll: scroll, events: events };
}

// ---------- Stato ----------
const state = {
  level: 1,
  lives: START_LIVES,
  coins: 0,
  sectorCoins: 0,          // monete all'ingresso del settore: si torna qui morendo
  best: { level: 1, coins: 0 },
  finished: false,
  mode: 'play',            // play | over | sector | credits
  paused: true,
  plan: null,
  levelTime: 0,
  spawnIndex: 0,
  scroll: 46,
  hazards: [],
  pickups: [],
  shots: [],               // colpi della navicella
  enemyShots: [],
  particles: [],
  boss: null,
  ship: { y: VH / 2, targetY: VH / 2 },
  invulnUntil: 0,
  shieldUntil: 0,
  doubleUntil: 0,
  nextShotAt: 0,
  // L'orologio del gioco, in millisecondi, che avanza SOLO mentre si gioca.
  // Non è performance.now(): quello corre anche a pannello aperto, e uno scudo
  // da 3 secondi preso un attimo prima di aprire le impostazioni sarebbe già
  // finito al ritorno. Tutti i tempi di gioco (scudo, invulnerabilità, doppio
  // colpo, cadenza di fuoco, lampeggi) guardano questo.
  clock: 0,
};

const els = {
  loading: document.getElementById('loadingScreen'),
  canvas: document.getElementById('gameCanvas'),
  gameZone: document.querySelector('.game-zone'),
  tapLayer: document.getElementById('tapLayer'),
  tapHint: document.getElementById('tapHint'),
  centerToast: document.getElementById('centerToast'),
  levelValue: document.getElementById('levelValue'),
  scoreValue: document.getElementById('scoreValue'),
  sectorLine: document.getElementById('sectorLine'),
  livesCanvas: document.getElementById('livesCanvas'),
  pauseBtn: document.getElementById('pauseBtn'),
  pauseOverlay: document.getElementById('pauseOverlay'),
  resumeBtn: document.getElementById('resumeBtn'),
  restartSectorBtn: document.getElementById('restartSectorBtn'),
  topRestartBtn: document.getElementById('topRestartBtn'),
  restartOverlay: document.getElementById('restartOverlay'),
  confirmRestartBtn: document.getElementById('confirmRestartBtn'),
  cancelRestartBtn: document.getElementById('cancelRestartBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsOverlay: document.getElementById('settingsOverlay'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  openLanguageBtn: document.getElementById('openLanguageBtn'),
  openTutorialBtn: document.getElementById('openTutorialBtn'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  openCreditsBtn: document.getElementById('openCreditsBtn'),
  tutorialOverlay: document.getElementById('tutorialOverlay'),
  closeTutorialBtn: document.getElementById('closeTutorialBtn'),
  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  leaderboardOverlay: document.getElementById('leaderboardOverlay'),
  leaderboardList: document.getElementById('leaderboardList'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
  sectorCompleteOverlay: document.getElementById('sectorCompleteOverlay'),
  sectorCompleteSub: document.getElementById('sectorCompleteSub'),
  nextSectorBtn: document.getElementById('nextSectorBtn'),
  gameOverOverlay: document.getElementById('gameOverOverlay'),
  gameOverSub: document.getElementById('gameOverSub'),
  retryBtn: document.getElementById('retryBtn'),
  creditsOverlay: document.getElementById('creditsOverlay'),
  creditsViewport: document.getElementById('creditsViewport'),
  creditsScroll: document.getElementById('creditsScroll'),
  creditsSkipBtn: document.getElementById('creditsSkipBtn'),
};
const ctx = els.canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const livesCtx = els.livesCanvas.getContext('2d');

// ---------- HUD ----------
function drawHearts() {
  const w = els.livesCanvas.width;
  livesCtx.clearRect(0, 0, w, els.livesCanvas.height);
  for (let i = 0; i < MAX_LIVES; i++) {
    livesCtx.fillStyle = i < state.lives ? '#C93A22' : 'rgba(255,235,207,0.16)';
    const offsetX = i * 7;
    for (let row = 0; row < HEART_PATTERN.length; row++) {
      for (let col = 0; col < HEART_PATTERN[row].length; col++) {
        if (HEART_PATTERN[row][col] === 'X') livesCtx.fillRect(offsetX + col, row, 1, 1);
      }
    }
  }
}
function updateHUD() {
  els.levelValue.textContent = state.level;
  els.scoreValue.textContent = state.coins;
  drawHearts();
}
function updateSectorLine() {
  const s = sectorOf(state.level);
  els.sectorLine.textContent = `${t().sectorLabel} ${s + 1} · ${SECTORS[s].name}`;
}

let toastTimer = null;
// L'icona sta FUORI dal testo tradotto: il messaggio è una stringa e basta, e
// finisce in un nodo di testo suo. Dentro a un elemento tradotto verrebbe
// cancellata alla prima traduzione.
function showToast(msg, icon, iconClass) {
  els.centerToast.textContent = '';
  if (icon) {
    const span = document.createElement('span');
    span.className = 'ffr-ico toast-ico' + (iconClass ? ' ' + iconClass : '');
    span.dataset.ico = icon;
    els.centerToast.appendChild(span);
    if (window.FFR && FFR.icons) FFR.icons(els.centerToast);
  }
  els.centerToast.appendChild(document.createTextNode(msg));
  els.centerToast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.centerToast.classList.add('hidden'), 1500);
}

// ---------- Avvio di un livello ----------
function startLevel(level) {
  state.level = level;
  state.plan = levelPlan(level);
  state.levelTime = 0;
  state.scroll = state.plan.scroll || 52;
  state.hazards.length = 0;
  state.pickups.length = 0;
  state.shots.length = 0;
  state.enemyShots.length = 0;
  state.particles.length = 0;
  state.boss = null;
  state.ship.y = VH / 2;
  state.ship.targetY = VH / 2;
  state.invulnUntil = 0;
  state.shieldUntil = 0;
  state.doubleUntil = 0;
  state.nextShotAt = 0;
  state.clock = 0;
  state.spawnIndex = 0;
  state.mode = 'play';
  bakeSectorSprites(sectorOf(level));
  buildBackground(level);
  if (state.plan.boss >= 0) spawnBoss(state.plan.boss);
  updateHUD();
  updateSectorLine();
  if (state.plan.boss >= 0) showToast(BOSSES[state.plan.boss].name + ' ' + t().bossIncoming, 'robot', 'toast-ico-double');
  else showToast(t().levelLabel + ' ' + level);
  dirty = true; // a partita ferma (tutorial, riapertura) il campo va disegnato lo stesso
}

function spawnBoss(index) {
  const def = BOSSES[index];
  state.boss = {
    index: index,
    def: def,
    x: VW + 20,
    y: VH / 2,
    hp: def.hp,
    maxHp: def.hp,
    entering: true,
    phase: 0,
    fireAt: 1.2,
    burst: 0,
    burstAt: 0,
    invulnUntil: 0,
    dir: 1,
    dying: 0,
    bonusAt: 6,
  };
}

// ---------- Comandi ----------
function canvasPointToVirtualY(clientY) {
  const rect = els.canvas.getBoundingClientRect();
  return ((clientY - rect.top) / rect.height) * VH;
}
let touchDragging = false;
let touchStartClientY = 0;
let touchStartShipY = 0;
function handlePointerDown(e) {
  // il dito che riprende la partita non deve anche muovere la navicella: se lo
  // strato "tocca per continuare" è alzato, quel tocco serve solo a ripartire
  if (!els.tapLayer.classList.contains('hidden')) {
    e.preventDefault();
    resumePlay();
    return;
  }
  if (state.paused || state.mode !== 'play') return;
  if (e.pointerType === 'touch') {
    touchDragging = true;
    touchStartClientY = e.clientY;
    touchStartShipY = state.ship.targetY;
  } else {
    state.ship.targetY = canvasPointToVirtualY(e.clientY);
  }
}
function handlePointerMove(e) {
  if (state.paused || state.mode !== 'play' || e.pointerType === 'touch') return;
  state.ship.targetY = canvasPointToVirtualY(e.clientY);
}
// Il trascinamento è RELATIVO e continua anche se il dito esce dal canvas: la
// navicella si sposta di quanto si sposta il dito, senza finirci sotto.
function handleWindowPointerMove(e) {
  if (state.paused || !touchDragging) return;
  const rect = els.canvas.getBoundingClientRect();
  const delta = (e.clientY - touchStartClientY) * (VH / rect.height);
  state.ship.targetY = clamp(touchStartShipY + delta, TOP, BOTTOM);
}
function handlePointerUpOrCancel() { touchDragging = false; }
function handleKeyDown(e) {
  if (state.paused || state.mode !== 'play') return;
  const step = 16;
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') state.ship.targetY = clamp(state.ship.targetY - step, TOP, BOTTOM);
  else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') state.ship.targetY = clamp(state.ship.targetY + step, TOP, BOTTOM);
}
function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
function overlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function shipBox() {
  return {
    x: SHIP_X + SHIP_HIT.dx,
    y: state.ship.y - SHIP_H / 2 + SHIP_HIT.dy,
    w: SHIP_HIT.w, h: SHIP_HIT.h,
  };
}

// ---------- Aggiornamento ----------
function update(dt) {
  state.clock += dt * 1000;
  const now = state.clock;

  // la navicella insegue il punto voluto: nessuno scatto secco, ma abbastanza
  // svelta da non sembrare in ritardo sul dito
  state.ship.targetY = clamp(state.ship.targetY, TOP, BOTTOM);
  state.ship.y += (state.ship.targetY - state.ship.y) * Math.min(1, dt * 20);

  for (const l of layers) {
    l.offset = (l.offset + state.scroll * l.speed * dt) % VW;
  }

  if (state.boss) updateBoss(dt, now);
  else updateLevelRun(dt, now);

  updatePickups(dt, now);
  updateShots(dt);
  updateParticles(dt);
}

function updateLevelRun(dt, now) {
  state.levelTime += dt;
  const plan = state.plan;
  while (state.spawnIndex < plan.events.length && plan.events[state.spawnIndex].t <= state.levelTime) {
    spawnEvent(plan.events[state.spawnIndex]);
    state.spawnIndex++;
  }

  for (let i = state.hazards.length - 1; i >= 0; i--) {
    const h = state.hazards[i];
    h.x -= state.scroll * (h.speedMul || 1) * dt;
    if (h.kind === 'mine') {
      h.phase += dt * 2.2;
      h.y = clamp(h.baseY + Math.sin(h.phase) * h.amp, TOP, BOTTOM);
    } else if (h.vy) {
      h.y += h.vy * dt;
      if (h.y < TOP || h.y > BOTTOM) h.vy = -h.vy;
    }
    if (h.x + h.w < -6) { state.hazards.splice(i, 1); continue; }
    if (hitsShip(h, now)) { /* la collisione toglie una vita, l'ostacolo resta */ }
  }

  if (state.levelTime >= plan.duration && state.hazards.length === 0) levelCleared();
}

function spawnEvent(ev) {
  if (ev.kind === 'rock') {
    const setIndex = ev.big ? 1 : 0;
    const spr = SPR.rocks[setIndex][ev.variant % 3];
    state.hazards.push({
      kind: 'rock', spr: spr, x: VW + 8, y: clamp(ev.y, TOP, BOTTOM),
      w: spr.width, h: spr.height, vy: ev.vy, speedMul: ev.speedMul,
      spin: 0,
    });
  } else if (ev.kind === 'mine') {
    state.hazards.push({
      kind: 'mine', x: VW + 8, y: ev.y, baseY: ev.y, amp: ev.amp, phase: 0,
      w: 8, h: 8, speedMul: 1.05,
    });
  } else if (ev.kind === 'wall') {
    // una colonna di mattoni con un varco: si passa solo di lì
    const top = ev.gapY, bottom = ev.gapY + ev.gap;
    for (let y = TOP - 4; y < BOTTOM + 4; y += 10) {
      if (y + 10 > top && y < bottom) continue;
      state.hazards.push({ kind: 'block', x: VW + 8, y: y + 5, w: 10, h: 10, speedMul: 1 });
    }
  } else if (ev.kind === 'coins') {
    for (let i = 0; i < ev.n; i++) {
      const y = clamp(ev.y + Math.sin(i * 0.7) * ev.amp * ev.dir, TOP + 4, BOTTOM - 4);
      state.pickups.push({ kind: 'coin', x: VW + 8 + i * 11, y: y, w: 7, h: 7, frame: i % 4 });
    }
  } else if (ev.kind === 'bonus') {
    state.pickups.push({ kind: 'bonus', type: ev.type, x: VW + 8, y: ev.y, w: 11, h: 10, bob: 0 });
  }
}

function updatePickups(dt, now) {
  const box = shipBox();
  for (let i = state.pickups.length - 1; i >= 0; i--) {
    const p = state.pickups[i];
    p.x -= state.scroll * dt;
    if (p.kind === 'coin') {
      p.frame = (p.frame + dt * 9) % 4;
    } else {
      p.bob += dt * 3;
      p.y += Math.sin(p.bob) * 12 * dt;
    }
    if (p.x + p.w < -4) { state.pickups.splice(i, 1); continue; }
    if (overlap(box.x, box.y, box.w, box.h, p.x - 2, p.y - p.h / 2 - 2, p.w + 4, p.h + 4)) {
      if (p.kind === 'coin') {
        state.coins += 1;
        updateHUD();
        sparkle(p.x, p.y, '#FFC94A', 4);
      } else {
        applyBonus(p.type, now);
      }
      state.pickups.splice(i, 1);
    }
  }
}

function applyBonus(type, now) {
  if (type === 'shield') {
    state.shieldUntil = now + 3000;
    showToast(t().bonusShield, 'shield', 'toast-ico-shield');
  } else if (type === 'life') {
    if (state.lives < MAX_LIVES) {
      state.lives += 1;
      showToast(t().bonusLife, 'heart', 'toast-ico-life');
    } else {
      state.coins += 25;
      showToast(t().bonusLifeMax, 'heart', 'toast-ico-life');
    }
    updateHUD();
  } else if (type === 'double') {
    state.doubleUntil = now + 8000;
    showToast(t().bonusDouble, 'double-shot', 'toast-ico-double');
  }
}

// ---------- Colpi ----------
function updateShots(dt) {
  const boss = state.boss;
  for (let i = state.shots.length - 1; i >= 0; i--) {
    const s = state.shots[i];
    s.x += 200 * dt;
    if (s.x > VW + 4) { state.shots.splice(i, 1); continue; }
    if (boss && !boss.dying && boss.x < VW && overlap(s.x, s.y - 1, 5, 3, boss.x, boss.y - BOSS_SIZE / 2, BOSS_SIZE, BOSS_SIZE)) {
      state.shots.splice(i, 1);
      if (state.clock > boss.invulnUntil) {
        boss.hp -= 2;
        sparkle(s.x, s.y, '#FFF0C0', 3);
        if (boss.hp <= 0) bossDefeated();
      } else {
        sparkle(s.x, s.y, '#6FD3E8', 2);
      }
    }
  }

  const now = state.clock;
  const box = shipBox();
  for (let i = state.enemyShots.length - 1; i >= 0; i--) {
    const s = state.enemyShots[i];
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.sinAmp) s.y += Math.sin((s.life += dt) * s.sinFreq) * s.sinAmp * dt;
    if (s.splitAt != null) {
      s.splitAt -= dt;
      if (s.splitAt <= 0) {
        s.splitAt = null;
        for (const dy of [-40, 40]) {
          state.enemyShots.push({ x: s.x, y: s.y, vx: s.vx * 0.9, vy: dy, w: s.w, h: s.h, color: s.color, life: 0 });
        }
      }
    }
    if (s.x + s.w < -6 || s.x > VW + 40 || s.y < -20 || s.y > VH + 20) { state.enemyShots.splice(i, 1); continue; }
    if (now > state.invulnUntil && overlap(box.x, box.y, box.w, box.h, s.x, s.y - s.h / 2, s.w, s.h)) {
      state.enemyShots.splice(i, 1);
      damageShip(now);
    }
  }
}

function fireShip(now) {
  const y = state.ship.y;
  const double = now < state.doubleUntil;
  state.shots.push({ x: SHIP_X + SHIP_W, y: double ? y - 3 : y });
  if (double) state.shots.push({ x: SHIP_X + SHIP_W, y: y + 3 });
  state.nextShotAt = now + 240;
}

function hitsShip(h, now) {
  if (now < state.invulnUntil) return false;
  const box = shipBox();
  if (!overlap(box.x, box.y, box.w, box.h, h.x, h.y - h.h / 2, h.w, h.h)) return false;
  damageShip(now);
  return true;
}

function damageShip(now) {
  if (now < state.shieldUntil) {
    state.shieldUntil = 0;
    state.invulnUntil = now + 900;
    sparkle(SHIP_X + SHIP_W / 2, state.ship.y, '#6FD3E8', 10);
    return;
  }
  state.lives -= 1;
  state.invulnUntil = now + 1800;
  sparkle(SHIP_X + SHIP_W / 2, state.ship.y, '#FF7133', 14);
  updateHUD();
  if (state.lives <= 0) shipDestroyed();
}

function sparkle(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = 20 + Math.random() * 70;
    state.particles.push({ x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 0.3 + Math.random() * 0.4, color: color });
  }
}
function updateParticles(dt) {
  for (let i = state.particles.length - 1; i >= 0; i--) {
    const p = state.particles[i];
    p.life -= dt;
    if (p.life <= 0) { state.particles.splice(i, 1); continue; }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vx *= 0.94;
    p.vy *= 0.94;
  }
}

// ---------- I boss ----------
// Uno per settore, ognuno col suo modo di muoversi e di sparare. Tutti sono
// battibili restando calmi: nessuno riempie lo schermo di colpi senza lasciare
// una strada, e i più cattivi arrivano quando si è già imparato a schivare.
function updateBoss(dt, now) {
  const b = state.boss;
  const def = b.def;

  if (b.dying > 0) {
    b.dying -= dt;
    if (Math.random() < 0.35) sparkle(b.x + Math.random() * BOSS_SIZE, b.y - BOSS_SIZE / 2 + Math.random() * BOSS_SIZE, '#FFB23F', 3);
    if (b.dying <= 0) sectorCleared();
    return;
  }

  if (b.entering) {
    b.x -= 42 * dt;
    if (b.x <= VW - BOSS_SIZE - 12) { b.x = VW - BOSS_SIZE - 12; b.entering = false; }
    return;
  }

  // movimento
  b.phase += dt;
  const hurt = b.hp / b.maxHp < 0.4 ? 1.35 : 1; // ferito, si agita di più
  if (def.move === 'sine') {
    b.y = VH / 2 + Math.sin(b.phase * (def.speed / 40) * hurt) * (VH / 2 - BOSS_SIZE / 2 - 4);
  } else if (def.move === 'patrol') {
    b.y += b.dir * def.speed * hurt * dt;
    if (b.y < BOSS_SIZE / 2 + 4) { b.y = BOSS_SIZE / 2 + 4; b.dir = 1; }
    if (b.y > VH - BOSS_SIZE / 2 - 4) { b.y = VH - BOSS_SIZE / 2 - 4; b.dir = -1; }
  } else if (def.move === 'chase') {
    const target = clamp(state.ship.y, BOSS_SIZE / 2 + 4, VH - BOSS_SIZE / 2 - 4);
    b.y += clamp(target - b.y, -def.speed * hurt * dt, def.speed * hurt * dt);
  } else if (def.move === 'jitter') {
    b.y += Math.sin(b.phase * 4.1) * def.speed * hurt * dt * 1.6;
    b.y = clamp(b.y, BOSS_SIZE / 2 + 4, VH - BOSS_SIZE / 2 - 4);
  }

  // la navicella spara da sola: qui si mira e si schiva, non si preme niente
  if (now >= state.nextShotAt) fireShip(now);

  // attacchi
  b.fireAt -= dt * hurt;
  if (b.fireAt <= 0) {
    bossAttack(b, now);
  }
  if (b.burst > 0) {
    b.burstAt -= dt;
    if (b.burstAt <= 0) {
      b.burst--;
      b.burstAt = 0.13;
      enemyShot(b, -150, 0, '#FFF0C0');
    }
  }

  // PREMIUM alterna finestre di invulnerabilità: si aspetta e si schiva. Due
  // secondi ogni sette: misurato, tre erano troppi — lo scontro tirava per le
  // lunghe più del doppio degli altri.
  if (b.index === 8) {
    const cycle = b.phase % 7;
    b.invulnUntil = cycle < 2 ? now + 50 : 0;
  }

  // i bonus passano anche durante lo scontro: senza, un settore lungo finisce
  // per costringere ad arrivare al boss con lo scudo già speso
  b.bonusAt -= dt;
  if (b.bonusAt <= 0) {
    b.bonusAt = 9 + Math.random() * 5;
    const roll = Math.random();
    const type = roll < 0.45 ? 'double' : (roll < 0.85 ? 'shield' : 'life');
    state.pickups.push({ kind: 'bonus', type: type, x: VW + 8, y: TOP + 10 + Math.random() * (BOTTOM - TOP - 20), w: 11, h: 10, bob: 0 });
  }
}

function enemyShot(b, vx, vy, color, opts) {
  const s = {
    x: b.x - 4, y: b.y, vx: vx, vy: vy, w: 4, h: 4, color: color, life: 0,
  };
  if (opts) Object.assign(s, opts);
  state.enemyShots.push(s);
}
function aimedShot(b, speed, color, opts) {
  const dx = (SHIP_X + SHIP_W / 2) - b.x;
  const dy = state.ship.y - b.y;
  const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  enemyShot(b, (dx / d) * speed, (dy / d) * speed, color, opts);
}

function bossAttack(b, now) {
  const i = b.index;
  if (i === 0) {           // POP-UP: finestrelle che si aprono addosso
    for (let k = -1; k <= 1; k++) {
      enemyShot(b, -70 - Math.random() * 30, k * 26, '#FF6B8A', { w: 6, h: 6 });
    }
    b.fireAt = 1.5;
  } else if (i === 1) {    // BANNER: fasce larghe che occupano mezzo schermo
    enemyShot(b, -105, 0, '#E0603C', { w: 26, h: 5 });
    b.fireAt = 1.9;
  } else if (i === 2) {    // COOKIE: briciole a raggiera
    for (let k = 0; k < 7; k++) {
      const a = Math.PI * (0.62 + k * 0.13);
      enemyShot(b, Math.cos(a) * 85, Math.sin(a) * 85, '#F2D9A8', { w: 3, h: 3 });
    }
    b.fireAt = 2.1;
  } else if (i === 3) {    // AUTOPLAY: raffiche che partono da sole
    b.burst = 5; b.burstAt = 0;
    b.fireAt = 2.2;
  } else if (i === 4) {    // TRACKER: mira dove sei
    aimedShot(b, 120, '#FFE24A', { w: 5, h: 5 });
    b.fireAt = 0.95;
  } else if (i === 5) {    // NEWSLETTER: ondate che ondeggiano
    for (let k = -2; k <= 2; k++) {
      enemyShot(b, -95, k * 12, '#4FC3D9', { w: 6, h: 4, sinAmp: 60, sinFreq: 3 });
    }
    b.fireAt = 2.4;
  } else if (i === 6) {    // PAYWALL: muretti con un varco
    const gapK = Math.floor(Math.random() * 5);
    for (let k = 0; k < 5; k++) {
      if (k === gapK || k === gapK + 1) continue;
      state.enemyShots.push({
        x: b.x - 6, y: 16 + k * 30, vx: -78, vy: 0, w: 8, h: 26, color: '#C8752C', life: 0,
      });
    }
    b.fireAt = 3.4;
  } else if (i === 7) {    // SPAM: copie che si moltiplicano
    for (const dy of [-18, 18]) {
      enemyShot(b, -95, dy, '#FFF07A', { w: 5, h: 5, splitAt: 0.55 });
    }
    b.fireAt = 2.0;
  } else if (i === 8) {    // PREMIUM: monete d'oro che costano care
    for (let k = -2; k <= 2; k++) {
      enemyShot(b, -100, k * 22, '#FFC94A', { w: 5, h: 5 });
    }
    b.fireAt = 1.7;
  } else {                 // ALGO: sa già tutto e mescola tutto
    const kind = Math.floor(b.phase / 3) % 3;
    if (kind === 0) {
      aimedShot(b, 150, '#8AF0FF', { w: 5, h: 5 });
      b.fireAt = 0.55;
    } else if (kind === 1) {
      for (let k = 0; k < 9; k++) {
        const a = Math.PI * (0.55 + k * 0.11);
        enemyShot(b, Math.cos(a) * 105, Math.sin(a) * 105, '#3FE0F0', { w: 4, h: 4 });
      }
      b.fireAt = 1.5;
    } else {
      for (const dy of [-30, 0, 30]) enemyShot(b, -130, dy, '#DCEBFF', { w: 6, h: 4, sinAmp: 40, sinFreq: 4 });
      b.fireAt = 1.2;
    }
  }
}

function bossDefeated() {
  const b = state.boss;
  b.dying = 1.5;
  b.hp = 0;
  state.enemyShots.length = 0;
  const reward = 25 + b.index * 5;
  state.coins += reward;
  updateHUD();
  sparkle(b.x + BOSS_SIZE / 2, b.y, '#FFB23F', 26);
}

// ---------- Fine livello / fine settore / morte ----------
function levelCleared() {
  const next = state.level + 1;
  if (next % PER_SECTOR === 1) state.sectorCoins = state.coins; // nuovo settore: nuovo checkpoint
  startLevel(next);
  saveProgress();
}

function sectorCleared() {
  state.boss = null;
  state.mode = 'sector';
  state.paused = true;
  const sector = sectorOf(state.level);
  noteBest();
  if (state.level >= LEVELS) {
    state.finished = true;
    saveProgress();
    openCredits();
    return;
  }
  els.sectorCompleteSub.textContent = t().sectorCompleteSub(SECTORS[sector].name, state.coins);
  els.nextSectorBtn.querySelector('[data-i18n]').textContent = t().continueBtn;
  els.sectorCompleteOverlay.classList.add('show');
  pendingVictory = false;
  saveProgress();
}

function shipDestroyed() {
  state.mode = 'over';
  state.paused = true;
  noteBest();
  const sector = sectorOf(state.level);
  els.gameOverSub.textContent = t().gameOverSub(sector + 1, SECTORS[sector].name);
  els.gameOverOverlay.classList.add('show');
  saveProgress();
}

function restartSector() {
  state.lives = START_LIVES;
  state.coins = state.sectorCoins;
  startLevel(sectorFirstLevel(state.level));
  state.paused = false;
  updateHUD();
  saveProgress();
}

function newGame() {
  state.level = 1;
  state.lives = START_LIVES;
  state.coins = 0;
  state.sectorCoins = 0;
  startLevel(1);
  state.paused = false;
  saveProgress();
}

// ---------- Disegno ----------
function render() {
  // sfondo: quattro tele ricopiate, niente disegnato a mano
  for (const l of layers) {
    const off = Math.floor(l.offset);
    ctx.drawImage(l.canvas, -off, 0);
    ctx.drawImage(l.canvas, VW - off, 0);
  }

  for (const p of state.pickups) {
    if (p.kind === 'coin') {
      ctx.drawImage(SPR.coin[Math.floor(p.frame) % 4], Math.round(p.x), Math.round(p.y - p.h / 2));
    } else {
      ctx.drawImage(SPR.bonus[p.type], Math.round(p.x), Math.round(p.y - p.h / 2));
    }
  }

  for (const h of state.hazards) {
    if (h.kind === 'rock') ctx.drawImage(h.spr, Math.round(h.x), Math.round(h.y - h.h / 2));
    else if (h.kind === 'mine') ctx.drawImage((Math.floor(state.clock / 220) % 2) ? SPR.mineOn : SPR.mineOff, Math.round(h.x), Math.round(h.y - h.h / 2));
    else ctx.drawImage(SPR.block, Math.round(h.x), Math.round(h.y - h.h / 2));
  }

  // colpi
  ctx.fillStyle = '#FFF0C0';
  for (const s of state.shots) {
    ctx.fillRect(Math.round(s.x), Math.round(s.y - 1), 5, 2);
  }
  for (const s of state.enemyShots) {
    ctx.fillStyle = s.color;
    ctx.fillRect(Math.round(s.x), Math.round(s.y - s.h / 2), s.w, s.h);
  }

  // boss
  const b = state.boss;
  if (b) {
    const blink = b.dying > 0 && Math.floor(state.clock / 80) % 2 === 0;
    if (!blink) {
      ctx.drawImage(SPR.bosses[b.index], Math.round(b.x), Math.round(b.y - BOSS_SIZE / 2));
    }
    if (state.clock < b.invulnUntil) {
      // scudo del boss: due cornici traslucide, niente sfocature calcolate a frame
      ctx.strokeStyle = 'rgba(111,211,232,0.75)';
      ctx.strokeRect(Math.round(b.x) - 2.5, Math.round(b.y - BOSS_SIZE / 2) - 2.5, BOSS_SIZE + 5, BOSS_SIZE + 5);
      ctx.strokeStyle = 'rgba(111,211,232,0.35)';
      ctx.strokeRect(Math.round(b.x) - 4.5, Math.round(b.y - BOSS_SIZE / 2) - 4.5, BOSS_SIZE + 9, BOSS_SIZE + 9);
    }
    if (!b.entering) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(20, 4, VW - 40, 4);
      ctx.fillStyle = '#FF7133';
      ctx.fillRect(20, 4, Math.max(0, (VW - 40) * (b.hp / b.maxHp)), 4);
      ctx.fillStyle = 'rgba(255,235,207,0.35)';
      ctx.fillRect(20, 4, VW - 40, 1);
    }
  }

  // navicella (lampeggia quando è intoccabile dopo un colpo preso)
  const now = state.clock;
  const invisible = now < state.invulnUntil && Math.floor(now / 90) % 2 === 0;
  if (!invisible) {
    const x = SHIP_X, y = Math.round(state.ship.y - SHIP_H / 2);
    // fiammata: tre pixel che ballano, l'unica cosa disegnata a mano
    const f = Math.floor(now / 60) % 3;
    ctx.fillStyle = '#FFB23F';
    ctx.fillRect(x - 3 - f, y + 3, 3 + f, 3);
    ctx.fillStyle = '#FF7133';
    ctx.fillRect(x - 5 - f, y + 4, 2 + f, 1);
    ctx.drawImage(SPR.ship, x, y);
    if (now < state.shieldUntil) {
      ctx.strokeStyle = 'rgba(111,211,232,0.85)';
      ctx.strokeRect(x - 2.5, y - 2.5, SHIP_W + 5, SHIP_H + 5);
      ctx.strokeStyle = 'rgba(111,211,232,0.4)';
      ctx.strokeRect(x - 4.5, y - 4.5, SHIP_W + 9, SHIP_H + 9);
    }
  }

  for (const p of state.particles) {
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
  }
}

// ---------- Il giro principale ----------
let lastTime = null;
let dirty = true;                       // c'è qualcosa da ridisegnare anche da fermi
const showFps = /[?&]fps=1/.test(location.search);
let fpsBox = null, fpsFrames = 0, fpsSince = 0;
function loop(timestamp) {
  if (lastTime == null) lastTime = timestamp;
  const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
  lastTime = timestamp;

  if (!state.paused) {
    update(dt);
    render();
  } else if (dirty) {
    render();
    dirty = false;
  }

  if (showFps) {
    if (!fpsBox) {
      fpsBox = document.createElement('div');
      fpsBox.id = 'fpsBox';
      document.body.appendChild(fpsBox);
      fpsSince = timestamp;
    }
    fpsFrames++;
    if (timestamp - fpsSince >= 500) {
      fpsBox.textContent = Math.round((fpsFrames * 1000) / (timestamp - fpsSince)) + ' fps';
      fpsFrames = 0;
      fpsSince = timestamp;
    }
  }
  requestAnimationFrame(loop);
}

// ---------- Pausa, "tocca per continuare", pannelli ----------
function pauseForPanel() {
  state.paused = true;
  dirty = true;
}
function resumePlay() {
  if (state.mode !== 'play') return;
  hideTapLayer();
  state.paused = false;
  lastTime = null; // niente salto: il tempo fermo non deve diventare movimento
}
function showTapLayer() {
  state.paused = true;
  dirty = true;
  els.tapLayer.classList.remove('hidden');
}
function hideTapLayer() {
  els.tapLayer.classList.add('hidden');
}

function openPause() {
  if (state.mode !== 'play') return;
  pauseForPanel();
  els.pauseOverlay.classList.add('show');
}
function closePause() {
  els.pauseOverlay.classList.remove('show');
  resumePlay();
}
function openSettingsMenu() {
  if (state.mode === 'play') pauseForPanel();
  els.openCreditsBtn.classList.toggle('hidden', !state.finished);
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
  saveProgress(); // la bandiera in classifica segue la lingua scelta
  closeLanguageModal();
}

// Il tutorial del primo avvio si chiude SOLO con "Ho capito!": niente X e
// niente chiusura toccando lo sfondo, o basta un dito per sbaglio per non
// vederlo mai più.
let tutorialPrimoAvvio = false;
function openTutorial() {
  els.settingsOverlay.classList.remove('show');
  els.tutorialOverlay.classList.add('show');
}
function closeTutorial() {
  const primo = tutorialPrimoAvvio;
  tutorialPrimoAvvio = false;
  els.tutorialOverlay.classList.remove('x-off');
  els.tutorialOverlay.classList.remove('show');
  try { localStorage.setItem('cosmy-tutorial-seen', '1'); } catch (e) { /* ignora */ }
  if (primo) showTapLayer();
  else els.settingsOverlay.classList.add('show');
}

// ---------- Classifica ----------
// Una sola tabella per tutto il mondo: il gioco non cambia con la lingua, e i
// livelli sono gli stessi per tutti. Il punteggio salvato nel database è UN
// numero solo, quindi ci stanno dentro tre cose in cifre diverse:
//   livello × 10.000.000 + monete × 10 + lingua
// così l'ordinamento del database (punteggio decrescente) mette avanti chi è
// arrivato più in là e, a parità di livello, chi ha più monete — che è la
// regola voluta — e la riga può mostrare anche la bandiera di chi la occupa
// senza chiedere altro al server.
const SCORE_LEVEL_UNIT = 10000000;
const MAX_COINS_IN_SCORE = 999999;
function encodeScore(level, coins, langCode) {
  const li = Math.max(0, LANG_ORDER.indexOf(langCode));
  return level * SCORE_LEVEL_UNIT + Math.min(coins, MAX_COINS_IN_SCORE) * 10 + li;
}
function decodeScore(score) {
  const s = Math.max(0, score | 0);
  const level = Math.floor(s / SCORE_LEVEL_UNIT);
  const rest = s % SCORE_LEVEL_UNIT;
  return { level: level, coins: Math.floor(rest / 10), lang: LANG_ORDER[rest % 10] || 'it' };
}

async function openLeaderboard() {
  els.settingsOverlay.classList.remove('show');
  els.leaderboardOverlay.classList.add('show');
  els.leaderboardList.innerHTML = '<div class="leaderboard-empty">…</div>';
  const auth = (window.FFR && window.FFR.auth) ? window.FFR.auth : null;
  const [rows, me] = await Promise.all([
    auth ? auth.getLeaderboard('cosmy', 50) : [],
    auth ? auth.getMyRank('cosmy') : null,
  ]);
  if (!rows.length) {
    els.leaderboardList.innerHTML = `<div class="leaderboard-empty">${t().leaderboardEmpty}</div>`;
    return;
  }
  const myNickname = auth ? auth.getNickname() : null;
  els.leaderboardList.innerHTML = buildLeaderboardRows(rows, me, myNickname);
  window.FFR.icons(els.leaderboardList);
}

// Regola condivisa del sito: se ne vedono 6 per volta e, quando chi guarda è
// fuori dalle prime 5, la sua riga viene infilata come 6ª (evidenziata) così si
// vede subito senza scorrere.
function buildLeaderboardRows(rows, me, myNickname) {
  const row = (pos, nickname, score, isMe) => {
    const d = decodeScore(score);
    return `
    <div class="leaderboard-row${isMe ? ' is-me' : ''}">
      <span class="leaderboard-rank">N.${pos}</span>
      <span class="ffr-ico leaderboard-flag" data-ico="${LANGUAGES[d.lang].flag}"></span>
      <span class="leaderboard-name">${escapeHtml(nickname)}</span>
      <span class="leaderboard-score"><span class="lb-lv">LV.${d.level}</span><span class="ffr-ico" data-ico="coin"></span>${d.coins}</span>
    </div>`;
  };
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

// ---------- Titoli di coda ----------
let creditsRaf = null;
let pendingVictory = false;
function buildCredits() {
  const s = t();
  const parts = [];
  parts.push('<div class="credits-title">COSMY</div>');
  parts.push(`<div class="credits-sub">${escapeHtml(s.creditsSub)}</div>`);
  s.creditsIntro.forEach(p => parts.push(`<p>${escapeHtml(p)}</p>`));
  parts.push(`<div class="credits-head">${escapeHtml(s.creditsHead)}</div>`);
  BOSSES.forEach((b, i) => {
    parts.push(`<p><span class="credits-boss">${escapeHtml(b.name)}</span>${escapeHtml(s.creditsBosses[i])}</p>`);
  });
  s.creditsOutro.forEach(p => parts.push(`<p>${escapeHtml(p)}</p>`));
  parts.push(`<p class="small">${escapeHtml(s.creditsNote)}</p>`);
  parts.push(`<div class="credits-end">${escapeHtml(s.creditsEnd)}</div>`);
  parts.push('<p class="small">Free For Real</p>');
  els.creditsScroll.innerHTML = parts.join('');
}
function openCredits() {
  state.mode = 'credits';
  state.paused = true;
  buildCredits();
  els.creditsOverlay.classList.add('show');
  const viewH = els.creditsViewport.clientHeight || 400;
  let y = viewH;
  els.creditsScroll.style.transform = `translateY(${y}px)`;
  const total = els.creditsScroll.scrollHeight + viewH;
  let last = null;
  const step = (ts) => {
    if (last == null) last = ts;
    const dt = Math.min(0.05, (ts - last) / 1000);
    last = ts;
    y -= 34 * dt * (viewH / 400 + 0.6);
    // si muove la trasformazione, non la posizione: è la GPU a farlo
    els.creditsScroll.style.transform = `translateY(${y}px)`;
    if (y < -total) { closeCredits(); return; }
    creditsRaf = requestAnimationFrame(step);
  };
  creditsRaf = requestAnimationFrame(step);
}
function closeCredits() {
  if (creditsRaf) cancelAnimationFrame(creditsRaf);
  creditsRaf = null;
  els.creditsOverlay.classList.remove('show');
  if (pendingCreditsReplay) {           // riaperti dal menu: si torna al menu
    pendingCreditsReplay = false;
    state.mode = 'play';
    showTapLayer();
    els.settingsOverlay.classList.add('show');
    return;
  }
  showVictory();
}
let pendingCreditsReplay = false;
function showVictory() {
  state.mode = 'sector';
  pendingVictory = true;
  els.sectorCompleteOverlay.querySelector('h2').textContent = t().victoryTitle;
  els.sectorCompleteSub.textContent = t().victorySub(state.coins);
  els.nextSectorBtn.querySelector('[data-i18n]').textContent = t().newGame;
  els.sectorCompleteOverlay.classList.add('show');
}

// ---------- Salvataggio (localStorage + cloud se loggato) ----------
function noteBest() {
  if (state.level > state.best.level || (state.level === state.best.level && state.coins > state.best.coins)) {
    state.best = { level: state.level, coins: state.coins };
  }
}
function saveProgress() {
  if (!(window.FFR && window.FFR.auth)) return;
  noteBest();
  window.FFR.auth.saveProgress('cosmy', {
    level: state.level,
    lives: state.lives,
    coins: state.coins,
    sectorCoins: state.sectorCoins,
    best: state.best,
    finished: state.finished,
    lang: language,
  }, encodeScore(state.best.level, state.best.coins, language));
}
async function loadSaved() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return await window.FFR.auth.loadProgress('cosmy');
}
// I salvataggi vecchi devono restare leggibili anche quando la forma cambia:
// qui si accetta qualunque cosa e si riempiono i buchi con valori sensati.
function applySaved(saved) {
  if (!saved) return false;
  const level = clamp(parseInt(saved.level, 10) || 1, 1, LEVELS);
  state.level = level;
  state.lives = clamp(parseInt(saved.lives, 10) || START_LIVES, 1, MAX_LIVES);
  state.coins = Math.max(0, parseInt(saved.coins, 10) || 0);
  state.sectorCoins = Math.max(0, parseInt(saved.sectorCoins, 10) || 0);
  state.finished = !!saved.finished;
  const b = saved.best || {};
  state.best = {
    level: clamp(parseInt(b.level, 10) || level, 1, LEVELS),
    coins: Math.max(0, parseInt(b.coins, 10) || state.coins),
  };
  return true;
}

// ---------- Avvio ----------
async function init() {
  language = getSiteLanguage() || 'it';
  applyTranslations();

  els.gameZone.addEventListener('pointerdown', handlePointerDown);
  els.gameZone.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointermove', handleWindowPointerMove);
  window.addEventListener('pointerup', handlePointerUpOrCancel);
  window.addEventListener('pointercancel', handlePointerUpOrCancel);
  window.addEventListener('keydown', handleKeyDown);

  // lo strato "tocca per continuare" si prende lui il tocco: senza
  // stopPropagation lo stesso dito riprenderebbe la partita E muoverebbe la
  // navicella di scatto
  els.tapLayer.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    e.preventDefault();
    resumePlay();
  });

  els.pauseBtn.addEventListener('click', openPause);
  els.resumeBtn.addEventListener('click', closePause);
  els.pauseOverlay.addEventListener('click', (e) => { if (e.target === els.pauseOverlay) closePause(); });
  els.restartSectorBtn.addEventListener('click', () => {
    els.pauseOverlay.classList.remove('show');
    els.restartOverlay.classList.add('show');
  });

  // ↻ in barra: ricomincia il SETTORE, non il livello — un settore va finito
  // tutto d'un fiato, quindi rifare un livello solo sarebbe un modo per
  // saltare le morti
  els.topRestartBtn.addEventListener('click', () => {
    if (state.mode !== 'play') return;
    pauseForPanel();
    els.restartOverlay.classList.add('show');
  });
  els.confirmRestartBtn.addEventListener('click', () => {
    els.restartOverlay.classList.remove('show');
    restartSector();
  });
  els.cancelRestartBtn.addEventListener('click', () => {
    els.restartOverlay.classList.remove('show');
    showTapLayer();
  });
  els.restartOverlay.addEventListener('click', (e) => {
    if (e.target === els.restartOverlay) { els.restartOverlay.classList.remove('show'); showTapLayer(); }
  });

  els.settingsBtn.addEventListener('click', openSettingsMenu);
  els.closeSettingsBtn.addEventListener('click', closeSettingsMenu);
  els.settingsOverlay.addEventListener('click', (e) => { if (e.target === els.settingsOverlay) closeSettingsMenu(); });

  els.openLanguageBtn.addEventListener('click', openLanguageModal);
  els.closeLanguageBtn.addEventListener('click', closeLanguageModal);
  els.languageOverlay.addEventListener('click', (e) => { if (e.target === els.languageOverlay) closeLanguageModal(); });
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
  els.leaderboardOverlay.addEventListener('click', (e) => { if (e.target === els.leaderboardOverlay) closeLeaderboard(); });

  els.openCreditsBtn.addEventListener('click', () => {
    els.settingsOverlay.classList.remove('show');
    pendingCreditsReplay = true;
    openCredits();
  });
  els.creditsSkipBtn.addEventListener('click', closeCredits);

  els.nextSectorBtn.addEventListener('click', () => {
    els.sectorCompleteOverlay.classList.remove('show');
    els.sectorCompleteOverlay.querySelector('h2').textContent = t().sectorComplete;
    if (pendingVictory) {
      pendingVictory = false;
      newGame();
      return;
    }
    state.sectorCoins = state.coins;
    startLevel(state.level + 1);
    state.paused = false;
  });
  els.retryBtn.addEventListener('click', () => {
    els.gameOverOverlay.classList.remove('show');
    restartSector();
  });

  // finestra nascosta (cambio scheda, telefono in tasca): si mette in pausa da
  // sola, o si torna e si è morti senza aver visto niente
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.mode === 'play' && !state.paused) showTapLayer();
  });

  requestAnimationFrame(loop);

  // Il progresso si carica SEMPRE, anche quando si mostra il tutorial: la
  // chiave del tutorial è per-dispositivo, quindi su un secondo telefono
  // ricompare anche a chi ha già un account con i suoi progressi nel cloud.
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('cosmy-tutorial-seen'); } catch (e) { /* ignora */ }
  const saved = await loadSaved();
  applySaved(saved);
  startLevel(state.level);
  state.paused = true;

  if (!tutorialSeen) {
    tutorialPrimoAvvio = true;
    els.tutorialOverlay.classList.add('x-off');
    els.tutorialOverlay.classList.add('show');
  } else {
    // regola del sito: una partita riaperta non riparte da sola, aspetta un tocco
    showTapLayer();
  }

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 350);
}
init();

// La X dei pannelli (shared/modal-x.js) chiude e basta: qui bisogna rimettere
// in piedi lo stato che l'apertura aveva cambiato. Il tutorial del primo avvio
// non ha la X, ma se un giorno l'avesse deve comunque passare da closeTutorial,
// che è l'unico posto che sa cosa fare dopo.
window.FFR_ON_MODAL_CLOSE = function (id) {
  if (id === 'tutorialOverlay') { closeTutorial(); return; }
  if (id === 'languageOverlay') { closeLanguageModal(); return; }
  if (id === 'leaderboardOverlay') { closeLeaderboard(); return; }
  if (id === 'pauseOverlay' || id === 'settingsOverlay' || id === 'restartOverlay') {
    if (state.mode === 'play') showTapLayer();
  }
};
