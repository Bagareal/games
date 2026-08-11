/* ============ COSMY — motore di gioco ============
 *
 * Sparatutto verticale visto dall'alto: la navicella sta in basso, la galassia
 * scende verso di lei, e si spara verso l'alto. Cinquanta livelli divisi in
 * dieci settori; l'ultimo livello di ogni settore è un boss.
 *
 * Perché verticale e non di lato: su un telefono lo schermo è alto e stretto.
 * Con la roba che arriva di fianco il pericolo attraversa il lato corto — meno
 * di un secondo e mezzo di preavviso negli ultimi settori — e il lato lungo
 * resta lì a non fare niente. Facendola scendere dall'alto, il pericolo cammina
 * sul lato lungo (tre secondi di preavviso) e per scansarsi c'è tutta la
 * larghezza dello schermo.
 *
 * Il campo NON ha una misura fissa: si misura lo spazio che resta sotto alla
 * barra e lo si divide per due, così su ogni schermo un pixel del gioco vale
 * circa due pixel veri e i disegni si vedono grandi. Tutte le velocità sono
 * scritte in "campi al secondo", non in pixel: cambiando schermo il gioco resta
 * lo stesso.
 *
 * Le tre cose che lo tengono fluido (regole imparate con Blokky):
 *   - lo sfondo è disegnato una volta sola su tele fuori schermo e poi solo
 *     ricopiato scorrendo: nessuna stella viene ridisegnata a mano ogni frame;
 *   - ogni sprite (navicella, nemici, asteroidi, monete, boss) è cotto una
 *     volta in una tela sua e da lì in poi si copia e basta;
 *   - a pannello aperto o partita ferma non si disegna niente.
 * Con ?fps=1 in fondo all'indirizzo compare il contatore dei fotogrammi.
 */

// ---------- Lingua condivisa con tutto il sito ----------
const LANGUAGES = {
  it: { label: 'Italiano', flag: 'flag-it' },
  en: { label: 'English', flag: 'flag-en' },
  fr: { label: 'Français', flag: 'flag-fr' },
};
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    tutorialPause: 'Per mettere in pausa: doppio tocco sullo schermo, doppio clic col mouse, o il tasto in alto',
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
    enemiesLabel: 'NEMICI',
    bossIncoming: 'in arrivo!',
    sectorComplete: 'Settore ripulito!',
    sectorCompleteSub: (name, coins) => `${name} è fuori uso. Monete: ${coins}`,
    continueBtn: 'Continua',
    gameOver: 'Navicella distrutta',
    gameOverSub: (sector, name) => `Settore ${sector} — ${name} ti aspetta ancora. Si riparte dal primo livello del settore.`,
    retryBtn: 'Riprova il settore',
    victoryTitle: 'Sei tornato a casa!',
    victorySub: coins => `Cinquanta livelli, dieci boss, ${coins} monete. La galassia Advertisement tace.`,
    newGame: 'Nuova partita',
    bonusShield: 'Scudo attivo!',
    bonusLife: 'Vita extra!',
    bonusLifeMax: 'Vite al massimo (+25 monete)',
    bonusDouble: 'Doppio colpo!',
    bonusShock: "Onda d'urto!",
    bonusSpread: 'Colpo a ventaglio!',
    restartAll: 'Ricomincia da capo',
    restartAllTitle: 'Ricominciare da capo?',
    restartAllBody: 'Si riparte dal livello 1 con tre vite e zero monete. Il tuo record e la classifica restano quelli che sono.',
    restartAllYes: 'Sì, da capo',
    waveClean: 'Ondata pulita! +10',
    tutorialTitle: 'Come si gioca',
    tutorialMove: "Muovi la navicella dove vuoi: trascina il dito nell'area di gioco, o usa il mouse e le frecce. Va a destra e sinistra su tutta la larghezza, e avanti e indietro nella metà bassa",
    tutorialShoot: 'La navicella spara da sola verso l\'alto: pensa a mirare e a schivare',
    tutorialEnemies: 'I nemici vanno abbattuti tutti, o il livello non prosegue: leggeri, medi e pesanti, uno più duro dell\'altro, e ognuno spara a modo suo',
    tutorialWaves: "Le ondate non aspettano: se sei lento, la successiva arriva lo stesso e te li ritrovi tutti insieme. Ondata ripulita in tempo, 10 monete in più",
    tutorialDodge: 'Asteroidi, mine e detriti si schivano: toccarli costa una vita. Solo i sassi piccoli si spaccano a colpi',
    tutorialCoins: 'Le monete che raccogli sono il tuo punteggio',
    tutorialBonus: "Prendi i bonus che scendono: scudo a bolla per 5 secondi, vita extra, doppio colpo, colpo a ventaglio (e i due colpi si sommano) e — raro — l'onda d'urto, che parte dalla navicella e spazza via tutto quello che trova",
    tutorialBoss: "Ogni 5 livelli c'è un boss: lì niente nemici, solo lui e i suoi colpi",
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
    tutorialPause: 'To pause: double tap the screen, double click with the mouse, or the button up top',
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
    enemiesLabel: 'ENEMIES',
    bossIncoming: 'incoming!',
    sectorComplete: 'Sector cleared!',
    sectorCompleteSub: (name, coins) => `${name} is out of order. Coins: ${coins}`,
    continueBtn: 'Continue',
    gameOver: 'Ship destroyed',
    gameOverSub: (sector, name) => `Sector ${sector} — ${name} is still waiting. You start again from the first level of the sector.`,
    retryBtn: 'Try the sector again',
    victoryTitle: 'You made it home!',
    victorySub: coins => `Fifty levels, ten bosses, ${coins} coins. The Advertisement galaxy has gone quiet.`,
    newGame: 'New game',
    bonusShield: 'Shield up!',
    bonusLife: 'Extra life!',
    bonusLifeMax: 'Lives already full (+25 coins)',
    bonusDouble: 'Double shot!',
    bonusShock: 'Shockwave!',
    bonusSpread: 'Spread shot!',
    restartAll: 'Start over',
    restartAllTitle: 'Start over from level 1?',
    restartAllBody: 'You go back to level 1 with three lives and no coins. Your best and the leaderboard stay as they are.',
    restartAllYes: 'Yes, start over',
    waveClean: 'Wave cleared! +10',
    tutorialTitle: 'How to play',
    tutorialMove: 'Move the ship wherever you want: drag your finger in the play area, or use the mouse and the arrow keys. Left and right across the full width, forward and back in the lower half',
    tutorialShoot: 'The ship fires upwards on its own: you just aim and dodge',
    tutorialEnemies: 'Every enemy has to go down or the level will not move on: light, medium and heavy, each tougher than the last, and each one attacking in its own way',
    tutorialWaves: 'Waves do not wait: if you are slow the next one comes anyway and you get them all at once. Clear a wave in time and you get 10 extra coins',
    tutorialDodge: 'Asteroids, mines and debris are there to be dodged: touching one costs a life. Only the small rocks can be shot to pieces',
    tutorialCoins: 'The coins you pick up are your score',
    tutorialBonus: 'Grab the bonuses drifting down: a shield bubble for 5 seconds, an extra life, a double shot, a spread shot (and the two shots stack) and — rarely — the shockwave, which spreads out from the ship and sweeps away everything it meets',
    tutorialBoss: 'Every 5 levels there is a boss: no enemies there, just the boss and what it throws at you',
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
    tutorialPause: "Pour mettre en pause : double touche sur l'écran, double clic à la souris, ou le bouton en haut",
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
    enemiesLabel: 'ENNEMIS',
    bossIncoming: 'arrive !',
    sectorComplete: 'Secteur nettoyé !',
    sectorCompleteSub: (name, coins) => `${name} est hors service. Pièces : ${coins}`,
    continueBtn: 'Continuer',
    gameOver: 'Vaisseau détruit',
    gameOverSub: (sector, name) => `Secteur ${sector} — ${name} t'attend toujours. On repart du premier niveau du secteur.`,
    retryBtn: 'Réessayer le secteur',
    victoryTitle: 'Tu es rentré à la maison !',
    victorySub: coins => `Cinquante niveaux, dix boss, ${coins} pièces. La galaxie Advertisement s'est tue.`,
    newGame: 'Nouvelle partie',
    bonusShield: 'Bouclier activé !',
    bonusLife: 'Vie supplémentaire !',
    bonusLifeMax: 'Vies au maximum (+25 pièces)',
    bonusDouble: 'Tir double !',
    bonusShock: 'Onde de choc !',
    bonusSpread: 'Tir en éventail !',
    restartAll: 'Tout recommencer',
    restartAllTitle: 'Recommencer depuis le niveau 1 ?',
    restartAllBody: 'On repart du niveau 1 avec trois vies et zéro pièce. Ton record et le classement ne bougent pas.',
    restartAllYes: 'Oui, tout recommencer',
    waveClean: 'Vague nettoyée ! +10',
    tutorialTitle: 'Comment jouer',
    tutorialMove: "Déplace le vaisseau où tu veux : glisse ton doigt dans la zone de jeu, ou utilise la souris et les flèches. À gauche et à droite sur toute la largeur, en avant et en arrière dans la moitié basse",
    tutorialShoot: 'Le vaisseau tire vers le haut tout seul : toi, tu vises et tu esquives',
    tutorialEnemies: "Tous les ennemis doivent tomber, sinon le niveau n'avance pas : légers, moyens et lourds, chacun plus dur que le précédent, et chacun attaque à sa façon",
    tutorialWaves: "Les vagues n'attendent pas : si tu es lent, la suivante arrive quand même et tu les as tous sur le dos. Vague nettoyée à temps, 10 pièces de plus",
    tutorialDodge: 'Astéroïdes, mines et débris sont là pour être esquivés : les toucher coûte une vie. Seuls les petits cailloux se cassent au tir',
    tutorialCoins: 'Les pièces que tu ramasses sont ton score',
    tutorialBonus: "Attrape les bonus qui descendent : bouclier en bulle pendant 5 secondes, vie supplémentaire, tir double, tir en éventail (et les deux se cumulent) et — rare — l'onde de choc, qui part du vaisseau et balaie tout ce qu'elle rencontre",
    tutorialBoss: "Tous les 5 niveaux il y a un boss : là, pas d'ennemis, juste lui et ses tirs",
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
// VW e VH NON sono costanti: si misurano dallo spazio che resta sotto alla
// barra (vedi applyGeometry). Questi sono solo i valori di partenza, buoni
// finché la pagina non è impaginata.
let VW = 190, VH = 260;
let SHIP_TOP = 117;      // più in su di così la navicella non sale
let SHIP_BOTTOM = 244;
let ENEMY_FLOOR = 143;   // più in giù di così i nemici non scendono
const MAX_LIVES = 5, START_LIVES = 3;
const LEVELS = 50, PER_SECTOR = 5;
const MAX_ENEMIES = 8;   // tetto: oltre, l'ondata in coda aspetta un posto

// ---------- I dieci settori ----------
// Ogni settore ha il suo cielo, le sue rocce e il suo boss. Il nome del settore
// è il nome del boss che lo comanda: sono i dieci mestieri della pubblicità,
// termini generici, nessun marchio di nessuno.
//
// `foe` sono i colori dei nemici in quel settore — leggero, medio, pesante —
// e non sono scelti per bellezza: sono scelti LONTANI dal cielo del settore.
// Con un colore fisso per classe capitava che nel settore verde il nemico
// verde sparisse dentro allo sfondo. Fuori da qui restano due colori che nessun
// nemico usa mai: l'oro delle monete e il rosso della vita.
const SECTORS = [
  { name: 'POP-UP',     sky: ['#0C1026', '#2A1420'], neb: ['#8A3A18', '#E0873C'], star: '#FFE6C4', rock: ['#7A6A62', '#A9998E', '#463A36'], foe: ['#4FE0C8', '#2FB8A8', '#1E8878'] },
  { name: 'BANNER',     sky: ['#2A0E2E', '#480F33'], neb: ['#A02F5A', '#E0603C'], star: '#FFD9E2', rock: ['#7A5A6A', '#A98598', '#4A2E3C'], foe: ['#9BE84A', '#63C038', '#3E8A2A'] },
  { name: 'COOKIE',     sky: ['#20130A', '#3A1F0C'], neb: ['#8A4A18', '#D08A34'], star: '#FFE9BC', rock: ['#8A6A45', '#B8946A', '#503A22'], foe: ['#6FD8FF', '#3F9AE0', '#2A63B0'] },
  { name: 'AUTOPLAY',   sky: ['#06180F', '#0B2A18'], neb: ['#1E6E43', '#7FBF4A'], star: '#D8FFDC', rock: ['#5C7060', '#8AA089', '#31423A'], foe: ['#FF8AD8', '#E05AA8', '#A03A78'] },
  { name: 'TRACKER',    sky: ['#210608', '#3E0C0D'], neb: ['#A62A22', '#F0763A'], star: '#FFD5C4', rock: ['#7E5A50', '#AC8276', '#48302B'], foe: ['#7FF0E8', '#3FC0C8', '#2A8090'] },
  { name: 'NEWSLETTER', sky: ['#04141E', '#062634'], neb: ['#12708C', '#4FC3D9'], star: '#D6F6FF', rock: ['#55707E', '#829CA8', '#2E434E'], foe: ['#FFA0B8', '#E06A88', '#A8425E'] },
  { name: 'PAYWALL',    sky: ['#101216', '#1E2228'], neb: ['#4A525E', '#C8752C'], star: '#EAF0F6', rock: ['#6E7480', '#9AA0AA', '#3C4048'], foe: ['#8FF07A', '#55C048', '#358A30'] },
  { name: 'SPAM',       sky: ['#1A1A08', '#2E2C0C'], neb: ['#8A7A18', '#D4C23A'], star: '#FFFBD0', rock: ['#7E7A50', '#ABA678', '#46442A'], foe: ['#A8A0FF', '#7068E0', '#4A42A8'] },
  { name: 'PREMIUM',    sky: ['#120E04', '#241B06'], neb: ['#9A7414', '#FFC94A'], star: '#FFF0C0', rock: ['#8A7A4A', '#C0AC74', '#4C4224'], foe: ['#7FD8FF', '#4F9AE0', '#3060B0'] },
  { name: 'ALGO',       sky: ['#050A22', '#0A1440'], neb: ['#1E3EA0', '#3FE0F0'], star: '#DCEBFF', rock: ['#5A6A90', '#8898BC', '#323C58'], foe: ['#FF8AC0', '#E05A90', '#A83A64'] },
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
// la stessa forma tutta bianca: è il lampo di quando un nemico viene colpito.
// Cotta una volta anche questa, invece di ricalcolare un filtro a ogni colpo.
function bakeFlash(pattern, scale) {
  const colors = {};
  for (const row of pattern) for (const ch of row) if (ch !== '.') colors[ch] = '#FFFFFF';
  return bakePattern(pattern, colors, scale);
}
// due colori mescolati: serve a tirare fuori il contorno scuro e il nucleo
// chiaro dal colore base di un nemico, senza scriverne tre a mano per settore
function mixColor(hex, other, t) {
  const a = parseInt(hex.slice(1), 16), b = parseInt(other.slice(1), 16);
  const ch = (sh) => {
    const x = (a >> sh) & 255, y = (b >> sh) & 255;
    return Math.round(x + (y - x) * t);
  };
  const v = (ch(16) << 16) | (ch(8) << 8) | ch(0);
  return '#' + v.toString(16).padStart(6, '0');
}

// La navicella, 11x14, muso in alto: cabina davanti, ali che si allargano
// scendendo, pinne arancioni e i due motori in coda (la fiammata è disegnata a
// parte, sotto, perché balla).
const SHIP_PATTERN = [
  '.....A.....',
  '....AAA....',
  '....XXX....',
  '....XCX....',
  '...XXCXX...',
  '...XXXXX...',
  '..WXXXXXW..',
  '.WWXXXXXWW.',
  'WWWXXXXXWWW',
  'WWAXXXXXAWW',
  'WW.XXXXX.WW',
  '...XXXXX...',
  '..EXXXXXE..',
  '..E.X.X.E..',
];
const SHIP_COLORS = { W: '#8C93B8', A: '#FF7133', X: '#DDE3F0', C: '#6FD3E8', E: '#C93A22' };
const SHIP_W = 11, SHIP_H = 14;
// la navicella si prende meno spazio di quanto ne occupi il disegno: le punte
// delle ali non devono uccidere, o sembra sempre un colpo rubato
const SHIP_HIT = { w: 5, h: 8 };

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

// mine: più grandi e più accese di prima, e il nucleo pulsa quasi fino al
// bianco — spente com'erano, su un cielo scuro si vedevano tardi
const MINE_PATTERN = [
  '..X....X..',
  '.XBBBBBBX.',
  '.BBDDDDBB.',
  'XBDDDDDDBX',
  'XBDDCCDDBX',
  'XBDDCCDDBX',
  'XBDDDDDDBX',
  '.BBDDDDBB.',
  '.XBBBBBBX.',
  '..X....X..',
];
const MINE_COLORS_ON = { X: '#C0C8E0', B: '#4A5266', D: '#FF5A3A', C: '#FFF0D8' };
const MINE_COLORS_OFF = { X: '#8A93A8', B: '#3A4056', D: '#B83820', C: '#FF9A6A' };

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
];
// colpo a ventaglio: tre colpi che si aprono
const BONUS_SPREAD = [
  '.PPPPPPPPP.',
  'PWWWWWWWWWP',
  'PW.G.G.G.WP',
  'PW.G.G.G.WP',
  'PWG.G.G.GWP',
  'PWG.GGG.GWP',
  'PW.GGGGG.WP',
  'PW..GGG..WP',
  'PWWWWWWWWWP',
  '.PPPPPPPPP.',
];
// onda d'urto: tre anelli che si allargano, lo stesso segno dell'icona
const BONUS_SHOCK = [
  '.PPPPPPPPP.',
  'PWWWWWWWWWP',
  'PW.GGGGG.WP',
  'PWG.....GWP',
  'PWG.GGG.GWP',
  'PWG.GGG.GWP',
  'PWG.....GWP',
  'PW.GGGGG.WP',
  'PWWWWWWWWWP',
  '.PPPPPPPPP.',
];

// ---------- I nemici: tre classi ----------
// Non cambiano di taglia per far scena: cambiano per quanto costa buttarli giù
// e per come sparano — ma la taglia aiuta a riconoscerli al volo, quindi la
// differenza si vede. Il contorno è sempre la versione scurissima del loro
// colore, così si staccano da qualunque cielo.
const ENEMY_PATTERNS = {
  // leggero: un dardo che punta in giù, veloce e fragile
  light: [
    'OO........OO',
    'OXO......OXO',
    'OXXO....OXXO',
    'OXXXOOOOXXXO',
    'OXXXXXXXXXXO',
    'OXXXCCCCXXXO',
    '.OXXCCCCXXO.',
    '..OXXCCXXO..',
    '...OXXXXO...',
    '....OXXO....',
    '.....OO.....',
  ],
  // medio: una cannoniera con due baccelli laterali e due ugelli in coda
  medium: [
    '....OOOOOOOO....',
    '...OXXXXXXXXO...',
    '..OXXXXXXXXXXO..',
    'OOXXXXXXXXXXXXOO',
    'OXXOXXXCCXXXOXXO',
    'OXXOXXCCCCXXOXXO',
    'OXXOXXCCCCXXOXXO',
    'OXXOXXXCCXXXOXXO',
    'OOXXXXXXXXXXXXOO',
    '..OXXXXXXXXXXO..',
    '..OXXXCCCCXXXO..',
    '..OXXCCCCCCXXO..',
    '...OOXXXXXXOO...',
    '....OCCOOCCO....',
    '.....OO..OO.....',
  ],
  // pesante: una fortezza squadrata con due torrette. Quello di prima si
  // stringeva a punta in basso e sembrava un cuore.
  heavy: [
    'OOOOOO........OOOOOO',
    'OXXXXO........OXXXXO',
    'OXXCXO........OXXCXO',
    'OXXXXOOOOOOOOOOXXXXO',
    'OXXXXXXXXXXXXXXXXXXO',
    'OXXCCXXXXXXXXXXCCXXO',
    'OXXXXXXOOOOOOXXXXXXO',
    'OXXXXXXOCCCCOXXXXXXO',
    'OXXXXXXOCCCCOXXXXXXO',
    'OXXXXXXOOOOOOXXXXXXO',
    'OXXXXXXXXXXXXXXXXXXO',
    'OXXCCXXXXXXXXXXCCXXO',
    'OXXXXXXXXXXXXXXXXXXO',
    'OOOOOOOOOOOOOOOOOOOO',
    '.OXXXXOOOOOOOOXXXXO.',
    '.OCCCCO......OCCCCO.',
    '.OOOOOO......OOOOOO.',
  ],
};

// hp: quanti danni regge (un colpo ne fa 2, il doppio colpo e il ventaglio
// moltiplicano le occasioni di colpire). coins: quante monete lascia morendo.
// Le velocità sono in "campi al secondo", non in pixel. Il colore lo prende dal
// settore (vedi bakeSectorSprites): shotColor viene riempito lì.
// drift: quanto si spostano di lato. Misurato: a 0,30 campi al secondo un
// leggero attraversa mezzo schermo mentre il colpo sta ancora salendo, e
// mirarlo in anticipo diventa impossibile — un livello che non finisce mai,
// visto che i nemici vanno abbattuti tutti. A 0,17 si prende, ma bisogna
// puntare davanti a lui.
const ENEMY_KINDS = {
  light:  { hp: 3,  w: 12, h: 11, coins: 2, drift: 0.17, fire: 1.6, spr: 'eLight', shotColor: '#FFFFFF' },
  medium: { hp: 8,  w: 16, h: 15, coins: 3, drift: 0.11, fire: 2.3, spr: 'eMedium', shotColor: '#FFFFFF' },
  heavy:  { hp: 20, w: 20, h: 17, coins: 5, drift: 0.06, fire: 2.9, spr: 'eHeavy', shotColor: '#FFFFFF' },
};

// ---------- I dieci boss ----------
// Ognuno è un disegno suo, 14x14 celle ingrandite 3 volte, con la sua tavolozza
// e il suo modo di sparare. Sono astronavi aliene: nessuna imita niente di
// reale, il nome dice solo di che fastidio sono la caricatura.
// Le vite sono state rifatte: prima il primo boss cadeva in sette secondi di
// fuoco tenuto e l'ultimo in ventinove. Adesso si va da tredici secondi a
// settantadue, e la difficoltà sale davvero andando avanti.
const BOSSES = [
  {
    name: 'POP-UP', move: 'sine', speed: 26, hp: 110,
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
    name: 'BANNER', move: 'patrol', speed: 46, hp: 130,
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
    name: 'COOKIE', move: 'chase', speed: 30, hp: 200,
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
    name: 'AUTOPLAY', move: 'sine', speed: 54, hp: 220,
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
    name: 'TRACKER', move: 'chase', speed: 44, hp: 300,
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
    name: 'NEWSLETTER', move: 'patrol', speed: 40, hp: 300,
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
    name: 'PAYWALL', move: 'patrol', speed: 28, hp: 400,
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
    name: 'SPAM', move: 'jitter', speed: 52, hp: 380,
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
    name: 'PREMIUM', move: 'sine', speed: 46, hp: 400,
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
    name: 'ALGO', move: 'chase', speed: 62, hp: 600,
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
    spread: bakePattern(BONUS_SPREAD, { P: '#0A1024', W: '#7ADFA0', G: '#DFFFE8' }, 1),
    shock: bakePattern(BONUS_SHOCK, { P: '#0A1024', W: '#B06AE8', G: '#F0D8FF' }, 1),
  },
  // i nemici si cuociono a ogni cambio di settore, coi colori di quel settore
  eLight: null, eMedium: null, eHeavy: null,
  eLightFlash: bakeFlash(ENEMY_PATTERNS.light, 1),
  eMediumFlash: bakeFlash(ENEMY_PATTERNS.medium, 1),
  eHeavyFlash: bakeFlash(ENEMY_PATTERNS.heavy, 1),
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
let bakedSector = -1;
function bakeSectorSprites(sector) {
  if (sector === bakedSector) return;   // dentro allo stesso settore non si ricuoce niente
  bakedSector = sector;

  // i nemici prendono i colori del settore: contorno scurissimo, corpo, nucleo
  // chiaro. E il colpo di ogni classe è del colore del suo nucleo, così si vede
  // subito chi ha sparato — e nessun colpo è più color moneta.
  const foe = SECTORS[sector].foe;
  ['light', 'medium', 'heavy'].forEach((cls, i) => {
    const body = foe[i];
    const def = ENEMY_KINDS[cls];
    const core = mixColor(body, '#FFFFFF', 0.55);
    SPR[def.spr] = bakePattern(ENEMY_PATTERNS[cls], {
      O: mixColor(body, '#08060F', 0.80),
      X: body,
      C: core,
    }, 1);
    def.shotColor = core;
  });

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
// Ogni strato è una tela alta quanto il campo, disegnata in modo da poter
// essere accostata a sé stessa senza giunte (chi finisce oltre il bordo viene
// ridisegnato anche dall'altra parte). A ogni frame si copia due volte.
// Si ricostruisce SOLO quando cambia il settore o la misura dello schermo: fra
// un livello e l'altro dello stesso settore le stelle non si fermano mai, ed è
// quello che prima faceva sembrare che il gioco ripartisse da zero.
const layers = [];
let builtSky = -1;
function buildBackground(sector, force) {
  if (sector === builtSky && !force) return;
  builtSky = sector;
  const s = SECTORS[sector];
  const rnd = seededRandom(sector * 31337 + 7);
  const keep = layers.length ? layers.map(l => l.offset) : null;
  layers.length = 0;

  // nebulose + pianeti: lo strato più lento e più lontano
  const neb = makeCanvas(VW, VH);
  const nc = neb.getContext('2d');
  // la sfumatura torna al colore di partenza a metà strada: questa tela viene
  // accostata a sé stessa scorrendo, e una sfumatura che finisce diversa da
  // come comincia lascia una riga netta che attraversa lo schermo
  const grad = nc.createLinearGradient(0, 0, 0, VH);
  grad.addColorStop(0, s.sky[0]);
  grad.addColorStop(0.5, s.sky[1]);
  grad.addColorStop(1, s.sky[0]);
  nc.fillStyle = grad;
  nc.fillRect(0, 0, VW, VH);
  const blobs = 3 + Math.floor(rnd() * 3);
  for (let i = 0; i < blobs; i++) {
    const bx = rnd() * VW, by = rnd() * VH, br = 24 + rnd() * 46;
    const col = s.neb[i % s.neb.length];
    for (const off of [-VH, 0, VH]) {   // la copia sopra e sotto evita la giunta
      const g = nc.createRadialGradient(bx, by + off, 0, bx, by + off, br);
      g.addColorStop(0, col + '3A');
      g.addColorStop(1, col + '00');
      nc.fillStyle = g;
      nc.fillRect(bx - br, by + off - br, br * 2, br * 2);
    }
  }
  // un pianeta grosso ogni tanto, così i settori non si somigliano tutti
  if (rnd() < 0.7) {
    const pr = 20 + rnd() * 30;
    const px = rnd() * VW, py = rnd() * VH;
    for (const off of [-VH, 0, VH]) {
      const g = nc.createRadialGradient(px - pr * 0.35, py + off - pr * 0.35, pr * 0.1, px, py + off, pr);
      g.addColorStop(0, s.neb[1] + 'CC');
      g.addColorStop(0.55, s.neb[0] + 'AA');
      g.addColorStop(1, s.sky[1] + 'EE');
      nc.fillStyle = g;
      nc.beginPath();
      nc.arc(px, py + off, pr, 0, Math.PI * 2);
      nc.fill();
    }
  }
  layers.push({ canvas: neb, speed: 0.06, offset: 0 });

  // tre strati di stelle a velocità diverse: è questo che dà il senso di
  // avanzare, molto più della roba che arriva addosso
  const area = (VW * VH) / (240 * 160);
  const specs = [
    { count: Math.round(46 * area), size: 1, alpha: 0.45, speed: 0.16 },
    { count: Math.round(30 * area), size: 1, alpha: 0.75, speed: 0.34 },
    { count: Math.round(16 * area), size: 2, alpha: 1.0, speed: 0.62 },
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
  // riprendendo lo stesso cielo dopo un cambio di misura, si riparte da dove si
  // era: le stelle non fanno il salto
  if (keep) for (let i = 0; i < layers.length && i < keep.length; i++) layers[i].offset = keep[i] % VH;
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
// Le ondate sono decise una volta per livello e hanno un ORARIO FISSO: partono
// quando è la loro ora, che tu abbia finito la precedente o no. Se sei lento
// te li ritrovi tutti insieme — è quello il modo di alzare la posta senza
// rendere il gioco ingiusto, perché la roba che arriva è sempre la stessa.
// Il livello finisce quando l'ultima ondata è uscita E il campo è pulito:
// tirare per le lunghe non salva niente.
// Gli asteroidi invece non hanno una lista: continuano ad arrivare finché il
// livello dura, tirati fuori dal solito seme.
function levelPlan(level) {
  const sector = sectorOf(level);
  if (isBossLevel(level)) return { boss: sector, scrollFrac: 0.30, waves: [] };
  const idx = (level - 1) % PER_SECTOR;   // 0..3 dentro al settore
  const rnd = seededRandom(level * 7919 + 13);

  // scorrimento in campi al secondo: da 3,5 secondi per attraversare il campo
  // a poco più di 2 nell'ultimo settore
  const scrollFrac = 0.285 + sector * 0.021;

  // cinque ondate sono il tetto: a sei, misurato, un livello dell'ultimo
  // settore chiedeva più di cento secondi di fuoco anche mirando sempre giusto
  const waveCount = Math.min(5, 2 + Math.floor(sector / 3) + (idx >= 2 ? 1 : 0));
  const gap = Math.max(5, 8 - sector * 0.33);
  const waves = [];
  let time = 3;
  for (let w = 0; w < waveCount; w++) {
    waves.push({ t: time, enemies: buildWave(sector, idx, w, rnd) });
    time += gap;
  }
  return { boss: -1, scrollFrac: scrollFrac, waves: waves };
}

// Un'ondata si compra con un budget di punti che cresce col settore: un
// leggero costa 1, un medio 2,2, un pesante 4. I medi entrano dal secondo
// settore, i pesanti dal quarto: prima si impara a colpire, poi si impara a
// insistere.
function buildWave(sector, idx, w, rnd) {
  const list = [];
  const power = sector + idx * 0.4 + w * 0.35;
  let budget = Math.min(9.5, 2 + power * 0.9);
  const costs = { light: 1, medium: 2.2, heavy: 4 };
  while (budget >= 1 && list.length < 5) {
    const roll = rnd();
    let cls = 'light';
    if (sector >= 3 && budget >= costs.heavy && roll < 0.28) cls = 'heavy';
    else if (sector >= 1 && budget >= costs.medium && roll < 0.62) cls = 'medium';
    budget -= costs[cls];
    list.push({ cls: cls, x: 0.14 + rnd() * 0.72, delay: list.length * 0.35 });
  }
  return list;
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
  waveIndex: 0,
  pendingWave: null,       // ondata pronta ma in attesa di posto (tetto MAX_ENEMIES)
  scrollFrac: 0.30,
  hazards: [],
  enemies: [],
  pickups: [],
  shots: [],               // colpi della navicella
  enemyShots: [],
  particles: [],
  shock: null,             // l'onda d'urto mentre si allarga
  shockId: 0,
  boss: null,
  ship: { x: 95, y: 220, targetX: 95, targetY: 220 },
  invulnUntil: 0,
  shieldUntil: 0,
  doubleUntil: 0,
  spreadUntil: 0,
  nextShotAt: 0,
  hazRnd: null,
  nextRock: 0,
  nextCoins: 0,
  nextBonus: 0,
  transition: 0,           // secondi di calma fra un livello e l'altro
  transitionTo: 0,
  // L'orologio del gioco, in millisecondi, che avanza SOLO mentre si gioca.
  // Non è performance.now(): quello corre anche a pannello aperto, e uno scudo
  // da 5 secondi preso un attimo prima di aprire le impostazioni sarebbe già
  // finito al ritorno. Tutti i tempi di gioco (scudo, invulnerabilità, doppio
  // colpo, cadenza di fuoco, lampeggi) guardano questo.
  clock: 0,
};

const els = {
  loading: document.getElementById('loadingScreen'),
  canvas: document.getElementById('gameCanvas'),
  gameZone: document.querySelector('.game-zone'),
  stage: document.querySelector('.stage'),
  tapLayer: document.getElementById('tapLayer'),
  tapHint: document.getElementById('tapHint'),
  centerToast: document.getElementById('centerToast'),
  levelStrip: document.getElementById('levelStrip'),
  levelValue: document.getElementById('levelValue'),
  scoreValue: document.getElementById('scoreValue'),
  sectorLine: document.getElementById('sectorLine'),
  livesCanvas: document.getElementById('livesCanvas'),
  pauseBtn: document.getElementById('pauseBtn'),
  pauseOverlay: document.getElementById('pauseOverlay'),
  resumeBtn: document.getElementById('resumeBtn'),
  restartSectorBtn: document.getElementById('restartSectorBtn'),
  restartAllBtn: document.getElementById('restartAllBtn'),
  restartAllOverlay: document.getElementById('restartAllOverlay'),
  confirmRestartAllBtn: document.getElementById('confirmRestartAllBtn'),
  cancelRestartAllBtn: document.getElementById('cancelRestartAllBtn'),
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

// ---------- La misura del campo: misurata, non indovinata ----------
// Si prende lo spazio che resta davvero sotto alla barra e lo si divide per
// due: un pixel del gioco vale due pixel veri, che è il motivo per cui adesso
// si vede tutto grande. Su schermi larghi il campo resta una colonna, se no un
// gioco che scende dall'alto diventa una striscia.
function applyGeometry(force) {
  const zone = els.gameZone;
  // il canvas si fa da parte prima della misura: se restasse della sua taglia
  // vecchia, la zona di gioco misurerebbe lui e lui misurerebbe la zona
  const wasW = els.canvas.style.width, wasH = els.canvas.style.height;
  const giveUp = () => { els.canvas.style.width = wasW; els.canvas.style.height = wasH; return false; };
  els.canvas.style.width = '0px';
  els.canvas.style.height = '0px';
  const cs = getComputedStyle(zone);
  let boxW = zone.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  // un pixel di margine: le altezze della barra non sono numeri interi, e
  // l'ultimo mezzo pixel fa comparire la barra di scorrimento
  let boxH = zone.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 1;
  if (!(boxW > 40) || !(boxH > 40)) return giveUp();
  boxW = Math.min(boxW, boxH * 0.72);

  const newVH = clamp(Math.round(boxH / 2), 230, 290);
  const scale = boxH / newVH;
  const newVW = clamp(Math.round(boxW / scale), 140, 260);

  // la misura in pixel veri si riscrive SEMPRE: la finestra può cambiare senza
  // che cambi il campo virtuale (stessi VW e VH, ingrandimento diverso), e
  // saltare questo pezzo lasciava un canvas della taglia di prima — su desktop
  // usciva dalla sua zona
  els.canvas.style.width = Math.floor(newVW * scale) + 'px';
  els.canvas.style.height = Math.floor(newVH * scale) + 'px';

  if (!force && newVW === VW && newVH === VH) { dirty = true; return false; }

  const rx = VW ? newVW / VW : 1, ry = VH ? newVH / VH : 1;
  VW = newVW; VH = newVH;
  els.canvas.width = VW;
  els.canvas.height = VH;
  ctx.imageSmoothingEnabled = false;
  updateBounds();

  // quello che era in campo si sposta in proporzione: cambiare schermo a metà
  // livello non deve far sparire niente né far comparire una collisione
  const scaleEntity = o => { o.x *= rx; o.y *= ry; if (o.vx) o.vx *= rx; if (o.vy) o.vy *= ry; };
  state.hazards.forEach(scaleEntity);
  state.pickups.forEach(scaleEntity);
  state.shots.forEach(scaleEntity);
  state.enemyShots.forEach(scaleEntity);
  state.particles.forEach(scaleEntity);
  state.enemies.forEach(e => { scaleEntity(e); e.stationY *= ry; });
  if (state.boss) { state.boss.x *= rx; state.boss.y *= ry; }
  state.ship.x *= rx; state.ship.y *= ry;
  state.ship.targetX *= rx; state.ship.targetY *= ry;
  clampShip();
  buildBackground(sectorOf(state.level), true);
  dirty = true;
  return true;
}
function updateBounds() {
  SHIP_TOP = Math.round(VH * 0.45);
  SHIP_BOTTOM = VH - SHIP_H / 2 - 4;
  ENEMY_FLOOR = Math.round(VH * 0.55);
}
function clampShip() {
  const halfW = SHIP_W / 2 + 1;
  state.ship.x = clamp(state.ship.x, halfW, VW - halfW);
  state.ship.y = clamp(state.ship.y, SHIP_TOP, SHIP_BOTTOM);
  state.ship.targetX = clamp(state.ship.targetX, halfW, VW - halfW);
  state.ship.targetY = clamp(state.ship.targetY, SHIP_TOP, SHIP_BOTTOM);
}

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
// La riga sotto alle monete dice il settore, e quando ci sono nemici in campo
// dice quanti ne restano: il livello non prosegue finché non sono a zero, e
// senza un numero non si capirebbe perché.
function updateSectorLine() {
  const s = sectorOf(state.level);
  const base = `${t().sectorLabel} ${s + 1} · ${SECTORS[s].name}`;
  const n = state.enemies.length;
  els.sectorLine.textContent = n > 0 ? `${t().sectorLabel} ${s + 1} · ${t().enemiesLabel} ${n}` : base;
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

// La striscia del cambio livello: passa da sinistra a destra sopra al campo
// senza fermare niente. Prima il livello nuovo arrivava con lo sfondo
// ricostruito da zero, e sembrava che il gioco ripartisse.
let stripTimer = null;
function showLevelStrip(level) {
  const s = sectorOf(level);
  els.levelStrip.textContent = `${t().levelLabel} ${level} · ${SECTORS[s].name}`;
  els.levelStrip.classList.remove('run');
  void els.levelStrip.offsetWidth;   // fa ripartire l'animazione da capo
  els.levelStrip.classList.add('run');
  clearTimeout(stripTimer);
  stripTimer = setTimeout(() => els.levelStrip.classList.remove('run'), 1700);
}

// ---------- Avvio di un livello ----------
// soft = si passa da un livello all'altro dentro allo stesso settore: cielo,
// stelle e navicella restano dove sono.
function startLevel(level, soft) {
  const sector = sectorOf(level);
  state.level = level;
  state.plan = levelPlan(level);
  state.levelTime = 0;
  state.waveIndex = 0;
  state.pendingWave = null;
  state.scrollFrac = state.plan.scrollFrac;
  state.enemies.length = 0;
  state.shots.length = 0;
  state.enemyShots.length = 0;
  state.shock = null;
  state.boss = null;
  state.transition = 0;
  if (!soft) {
    state.hazards.length = 0;
    state.pickups.length = 0;
    state.particles.length = 0;
    state.invulnUntil = 0;
    state.shieldUntil = 0;
    state.doubleUntil = 0;
    state.spreadUntil = 0;
    state.clock = 0;
    state.ship.x = VW / 2;
    state.ship.y = VH - 34;
    state.ship.targetX = state.ship.x;
    state.ship.targetY = state.ship.y;
  }
  state.nextShotAt = state.clock;
  state.hazRnd = seededRandom(level * 7919 + 13);
  state.nextRock = 1.2;
  state.nextCoins = 3.2;
  state.nextBonus = 7 + state.hazRnd() * 6;
  state.mode = 'play';
  bakeSectorSprites(sector);
  buildBackground(sector);
  clampShip();
  if (state.plan.boss >= 0) spawnBoss(state.plan.boss);
  updateHUD();
  updateSectorLine();
  if (state.plan.boss >= 0) showToast(BOSSES[state.plan.boss].name + ' ' + t().bossIncoming, 'robot', 'toast-ico-double');
  else if (!soft) showToast(t().levelLabel + ' ' + level);
  dirty = true; // a partita ferma (tutorial, riapertura) il campo va disegnato lo stesso
  // Si salva QUI, all'inizio del livello: prima si salvava alla fine, e il
  // livello scritto nel cloud era quello appena finito, non quello nuovo. Chi
  // batteva un boss sul telefono e riapriva il gioco sul computer si ritrovava
  // davanti lo stesso boss. (Non durante il caricamento: lì si è appena letto
  // il salvataggio e riscriverlo non serve a niente.)
  if (ready) saveProgress();
}

function spawnBoss(index) {
  const def = BOSSES[index];
  state.boss = {
    index: index,
    def: def,
    x: VW / 2,
    y: -BOSS_SIZE,
    hp: def.hp,
    maxHp: def.hp,
    entering: true,
    phase: 0,
    wave: 0,
    fireAt: 1.2,
    burst: 0,
    burstAt: 0,
    invulnUntil: 0,
    dir: 1,
    dying: 0,
    bonusAt: 6,
    shockHit: -1,
  };
}

// ---------- Comandi ----------
function canvasPointToVirtual(clientX, clientY) {
  const rect = els.canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * VW,
    y: ((clientY - rect.top) / rect.height) * VH,
  };
}
let touchDragging = false;
let touchStartClientX = 0, touchStartClientY = 0;
let touchStartShipX = 0, touchStartShipY = 0;

// Doppio tocco (o doppio clic) = pausa. Qui si può fare senza rubare niente a
// nessuno: un tocco da solo non fa muovere la navicella, serve solo a
// cominciare a trascinare.
let lastTapAt = 0, lastTapX = 0, lastTapY = 0;
const DOUBLE_TAP_MS = 320, DOUBLE_TAP_SLOP = 30;
function checkDoubleTap(e) {
  const now = performance.now();
  const near = Math.abs(e.clientX - lastTapX) < DOUBLE_TAP_SLOP && Math.abs(e.clientY - lastTapY) < DOUBLE_TAP_SLOP;
  const isDouble = now - lastTapAt < DOUBLE_TAP_MS && near;
  lastTapAt = isDouble ? 0 : now;   // tre tocchi di fila non fanno due pause
  lastTapX = e.clientX;
  lastTapY = e.clientY;
  return isDouble;
}

function handlePointerDown(e) {
  // il dito che riprende la partita non deve anche muovere la navicella: se lo
  // strato "tocca per continuare" è alzato, quel tocco serve solo a ripartire
  if (!els.tapLayer.classList.contains('hidden')) {
    e.preventDefault();
    resumePlay();
    return;
  }
  if (state.paused || state.mode !== 'play') return;
  if (checkDoubleTap(e)) { touchDragging = false; openPause(); return; }
  if (e.pointerType === 'touch') {
    touchDragging = true;
    touchStartClientX = e.clientX;
    touchStartClientY = e.clientY;
    touchStartShipX = state.ship.targetX;
    touchStartShipY = state.ship.targetY;
  } else {
    const p = canvasPointToVirtual(e.clientX, e.clientY);
    state.ship.targetX = p.x;
    state.ship.targetY = p.y;
  }
}
function handlePointerMove(e) {
  if (state.paused || state.mode !== 'play' || e.pointerType === 'touch') return;
  const p = canvasPointToVirtual(e.clientX, e.clientY);
  state.ship.targetX = p.x;
  state.ship.targetY = p.y;
}
// Il trascinamento è RELATIVO e continua anche se il dito esce dal canvas: la
// navicella si sposta di quanto si sposta il dito, senza finirci sotto.
function handleWindowPointerMove(e) {
  if (state.paused || !touchDragging) return;
  const rect = els.canvas.getBoundingClientRect();
  const dx = (e.clientX - touchStartClientX) * (VW / rect.width);
  const dy = (e.clientY - touchStartClientY) * (VH / rect.height);
  state.ship.targetX = touchStartShipX + dx;
  state.ship.targetY = touchStartShipY + dy;
  clampShip();
}
function handlePointerUpOrCancel() { touchDragging = false; }
function handleKeyDown(e) {
  if (state.paused || state.mode !== 'play') return;
  const step = VH * 0.06;
  const k = e.key;
  if (k === 'ArrowUp' || k === 'w' || k === 'W') state.ship.targetY -= step;
  else if (k === 'ArrowDown' || k === 's' || k === 'S') state.ship.targetY += step;
  else if (k === 'ArrowLeft' || k === 'a' || k === 'A') state.ship.targetX -= step;
  else if (k === 'ArrowRight' || k === 'd' || k === 'D') state.ship.targetX += step;
  else return;
  e.preventDefault();   // le frecce muovono la navicella, non la pagina
  clampShip();
}
function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
function overlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function shipBox() {
  return {
    x: state.ship.x - SHIP_HIT.w / 2,
    y: state.ship.y - SHIP_HIT.h / 2,
    w: SHIP_HIT.w, h: SHIP_HIT.h,
  };
}

// ---------- Aggiornamento ----------
function update(dt) {
  state.clock += dt * 1000;
  const now = state.clock;
  const scroll = state.scrollFrac * VH;

  // la navicella insegue il punto voluto: nessuno scatto secco, ma abbastanza
  // svelta da non sembrare in ritardo sul dito
  clampShip();
  const follow = Math.min(1, dt * 20);
  state.ship.x += (state.ship.targetX - state.ship.x) * follow;
  state.ship.y += (state.ship.targetY - state.ship.y) * follow;

  for (const l of layers) {
    l.offset = (l.offset + scroll * l.speed * dt) % VH;
  }

  // la navicella spara da sola, sempre: nei livelli come contro il boss
  if (now >= state.nextShotAt) fireShip(now);

  if (state.boss) updateBoss(dt, now);
  else updateLevelRun(dt, now, scroll);

  updateEnemies(dt, now);
  updatePickups(dt, now, scroll);
  updateHazards(dt, now, scroll);
  updateShots(dt, now);
  updateShock(dt);
  updateParticles(dt);
}

function updateLevelRun(dt, now, scroll) {
  state.levelTime += dt;

  if (state.transition > 0) {
    state.transition -= dt;
    if (state.transition <= 0) startLevel(state.transitionTo, true);
    return;
  }

  // ondate: partono all'ora loro, non aspettano che tu abbia finito. L'unico
  // freno è il tetto: in campo non ce ne stanno più di MAX_ENEMIES, se no a un
  // certo punto il livello diventa impossibile per aritmetica, non per bravura.
  const fits = wave => state.enemies.length + wave.enemies.length <= MAX_ENEMIES;
  if (state.pendingWave) {
    if (fits(state.pendingWave)) { releaseWave(state.pendingWave); state.pendingWave = null; }
  } else if (state.waveIndex < state.plan.waves.length && state.plan.waves[state.waveIndex].t <= state.levelTime) {
    const wave = state.plan.waves[state.waveIndex];
    state.waveIndex++;
    if (fits(wave)) releaseWave(wave);
    else state.pendingWave = wave;
  }

  // asteroidi, mine, muri, monete e bonus: arrivano finché il livello dura
  const rnd = state.hazRnd;
  const sector = sectorOf(state.level);
  const interval = Math.max(0.6, 1.4 - sector * 0.07);
  if (state.levelTime >= state.nextRock) {
    const roll = rnd();
    if (sector >= 2 && roll < 0.14) {
      spawnWall(sector, rnd);
      state.nextRock = state.levelTime + interval * 2.1;
    } else if (sector >= 1 && roll < 0.34) {
      spawnMine(rnd);
      state.nextRock = state.levelTime + interval * 1.2;
    } else {
      spawnRock(sector, rnd);
      state.nextRock = state.levelTime + interval * 0.9;
    }
    state.nextRock += rnd() * 0.3;
  }
  if (state.levelTime >= state.nextCoins) {
    spawnCoins(rnd);
    state.nextCoins = state.levelTime + 4 + rnd() * 3;
  }
  if (state.levelTime >= state.nextBonus) {
    spawnBonus(rnd);
    state.nextBonus = state.levelTime + 13 + rnd() * 7;
  }

  // fine livello: ultima ondata uscita e campo pulito
  if (state.waveIndex >= state.plan.waves.length && !state.pendingWave && state.enemies.length === 0) {
    levelCleared();
  }
}

function releaseWave(wave) {
  for (const e of wave.enemies) spawnEnemy(e.cls, e.x, e.delay);
  updateSectorLine();
}

// ---------- Quello che scende: sassi, mine, muri, monete, bonus ----------
function spawnRock(sector, rnd) {
  const big = rnd() < 0.42;
  const fast = sector >= 4 && rnd() < 0.22;
  const setIndex = big ? 1 : 0;
  const spr = SPR.rocks[setIndex][Math.floor(rnd() * 3) % 3];
  state.hazards.push({
    kind: 'rock', spr: spr,
    x: clamp(4 + rnd() * (VW - 8), spr.width / 2, VW - spr.width / 2),
    y: -spr.height,
    w: spr.width, h: spr.height,
    vx: (rnd() - 0.5) * (sector >= 3 ? 0.14 : 0.05) * VH,
    speedMul: fast ? 1.8 : 1,
    hp: big ? 0 : 3,     // 0 = non si spacca: i sassi grossi si schivano e basta
    shockHit: -1,
  });
}
function spawnMine(rnd) {
  const x = 8 + rnd() * (VW - 16);
  state.hazards.push({
    kind: 'mine', x: x, baseX: x, y: -12, w: 10, h: 10,
    amp: (0.03 + rnd() * 0.06) * VW, phase: 0, speedMul: 1.05, hp: 0, shockHit: -1,
  });
}
// il muro di detriti: una riga di mattoni con un varco, si passa solo di lì
function spawnWall(sector, rnd) {
  const gap = Math.max(0.20, 0.32 - sector * 0.012) * VW;
  const gapX = 6 + rnd() * (VW - gap - 12);
  for (let x = -4; x < VW + 4; x += 10) {
    if (x + 10 > gapX && x < gapX + gap) continue;
    state.hazards.push({ kind: 'block', x: x + 5, y: -10, w: 10, h: 10, speedMul: 1, hp: 0, shockHit: -1 });
  }
}
function spawnCoins(rnd) {
  const n = 5 + Math.floor(rnd() * 4);
  const x = 14 + rnd() * (VW - 28);
  const amp = (0.05 + rnd() * 0.10) * VW;
  const dir = rnd() < 0.5 ? 1 : -1;
  for (let i = 0; i < n; i++) {
    state.pickups.push({
      kind: 'coin',
      x: clamp(x + Math.sin(i * 0.7) * amp * dir, 6, VW - 6),
      y: -8 - i * 11, w: 7, h: 7, frame: i % 4,
    });
  }
}
// scudo spesso, doppio colpo spesso, vita di rado, onda d'urto rara: una vita
// facile toglierebbe il senso a "il settore si finisce tutto d'un fiato", e
// un'onda d'urto a ogni giro toglierebbe il senso a tutto il resto
function spawnBonus(rnd) {
  const roll = rnd();
  const type = roll < 0.32 ? 'shield'
    : (roll < 0.54 ? 'double'
    : (roll < 0.72 ? 'spread'
    : (roll < 0.84 ? 'life' : 'shock')));
  state.pickups.push({
    kind: 'bonus', type: type,
    x: 10 + rnd() * (VW - 20), y: -12, w: 11, h: 10, bob: 0,
  });
}

function updateHazards(dt, now, scroll) {
  for (let i = state.hazards.length - 1; i >= 0; i--) {
    const h = state.hazards[i];
    h.y += scroll * (h.speedMul || 1) * dt;
    if (h.kind === 'mine') {
      h.phase += dt * 2.2;
      h.x = clamp(h.baseX + Math.sin(h.phase) * h.amp, 5, VW - 5);
    } else if (h.vx) {
      h.x += h.vx * dt;
      if (h.x < h.w / 2 || h.x > VW - h.w / 2) h.vx = -h.vx;
    }
    if (h.y - h.h > VH + 6) { state.hazards.splice(i, 1); continue; }
    hitsShip(h, now);
  }
}

// ---------- I nemici ----------
function spawnEnemy(cls, xFrac, delay) {
  const def = ENEMY_KINDS[cls];
  const sector = sectorOf(state.level);
  const x = clamp(xFrac * VW, def.w / 2 + 2, VW - def.w / 2 - 2);
  const band = cls === 'heavy' ? [0.09, 0.22] : (cls === 'medium' ? [0.12, 0.32] : [0.16, 0.40]);
  state.enemies.push({
    cls: cls, def: def,
    x: x, y: -def.h - (delay || 0) * VH * 0.35,
    w: def.w, h: def.h,
    hp: def.hp, maxHp: def.hp,
    stationY: (band[0] + Math.random() * (band[1] - band[0])) * VH,
    entering: true,
    dir: Math.random() < 0.5 ? -1 : 1,
    phase: Math.random() * 6.28,
    age: 0,
    fireAt: def.fire * (0.6 + Math.random() * 0.6),
    fireEvery: def.fire * Math.max(0.55, 1 - sector * 0.03),
    burst: 0, burstAt: 0,
    flash: 0,
    shockHit: -1,
  });
}

function updateEnemies(dt, now) {
  const box = shipBox();
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    if (e.flash > 0) e.flash -= dt;

    if (e.entering) {
      e.y += 0.34 * VH * dt;
      if (e.y >= e.stationY) { e.y = e.stationY; e.entering = false; }
    } else {
      e.phase += dt;
      e.age += dt;
      // chi sopravvive più di venti secondi si fa avanti: scende piano verso il
      // fondo della sua fascia. Più vicino è più facile colpirlo — e più
      // pericoloso. È il modo di non lasciare in campo un nemico eterno senza
      // regalarlo a chi non lo prende.
      if (e.age > 20) e.stationY = Math.min(ENEMY_FLOOR - 6, e.stationY + 0.035 * VH * dt);
      // ognuno si muove a modo suo, ma nessuno scende oltre metà campo: devono
      // restare davanti alla navicella, sempre sparabili
      if (e.cls === 'light') {
        e.x += e.dir * e.def.drift * VH * dt;
        e.y = e.stationY + Math.sin(e.phase * 2.2) * VH * 0.02;
      } else if (e.cls === 'medium') {
        const target = clamp(state.ship.x, e.w / 2 + 2, VW - e.w / 2 - 2);
        e.x += clamp(target - e.x, -e.def.drift * VH * dt, e.def.drift * VH * dt);
        e.y = e.stationY + Math.sin(e.phase * 1.3) * VH * 0.015;
      } else {
        e.x += e.dir * e.def.drift * VH * dt;
        e.y = e.stationY + Math.sin(e.phase * 0.8) * VH * 0.01;
      }
      if (e.x < e.w / 2 + 2) { e.x = e.w / 2 + 2; e.dir = 1; }
      if (e.x > VW - e.w / 2 - 2) { e.x = VW - e.w / 2 - 2; e.dir = -1; }
      e.y = Math.min(e.y, ENEMY_FLOOR);

      // attacchi: uno per classe
      e.fireAt -= dt;
      if (e.fireAt <= 0) {
        enemyAttack(e);
        e.fireAt = e.fireEvery;
      }
      if (e.burst > 0) {
        e.burstAt -= dt;
        if (e.burstAt <= 0) {
          e.burst--;
          e.burstAt = 0.16;
          aimedShotFrom(e.x, e.y + e.h / 2, 0.45, e.def.shotColor, { w: 4, h: 5 });
        }
      }
    }

    if (overlap(box.x, box.y, box.w, box.h, e.x - e.w / 2, e.y - e.h / 2, e.w, e.h)) damageShip(now);
  }
}

function enemyAttack(e) {
  const col = e.def.shotColor;
  if (e.cls === 'light') {
    // leggero: un colpo secco che scende dritto, veloce
    state.enemyShots.push({ x: e.x, y: e.y + e.h / 2, vx: 0, vy: 0.55 * VH, w: 3, h: 7, color: col, life: 0 });
  } else if (e.cls === 'medium') {
    // medio: raffica di tre colpi mirati dove sei
    e.burst = 3; e.burstAt = 0;
  } else {
    // pesante: ventaglio largo e lento, si passa solo scegliendo il varco
    for (let k = -2; k <= 2; k++) {
      const a = Math.PI / 2 + k * 0.30;
      state.enemyShots.push({
        x: e.x, y: e.y + e.h / 2,
        vx: Math.cos(a) * 0.34 * VH, vy: Math.sin(a) * 0.34 * VH,
        w: 5, h: 5, color: col, life: 0,
      });
    }
  }
}

function killEnemy(index, giveCoins) {
  const e = state.enemies[index];
  state.enemies.splice(index, 1);
  sparkle(e.x, e.y, '#FFB23F', 10);
  if (giveCoins !== false) {
    state.coins += e.def.coins;
    updateHUD();
  }
  // ondata ripulita prima che arrivi la prossima: dieci monete. È qui che
  // essere svelti si vede in classifica.
  if (state.enemies.length === 0 && !state.boss && !state.pendingWave &&
      state.waveIndex < state.plan.waves.length &&
      state.levelTime < state.plan.waves[state.waveIndex].t - 0.3) {
    state.coins += 10;
    updateHUD();
    showToast(t().waveClean, 'shockwave', 'toast-ico-shock');
  }
  updateSectorLine();
}

function damageEnemy(index, amount) {
  const e = state.enemies[index];
  e.hp -= amount;
  e.flash = 0.08;
  if (e.hp <= 0) killEnemy(index);
}

function updatePickups(dt, now, scroll) {
  const box = shipBox();
  for (let i = state.pickups.length - 1; i >= 0; i--) {
    const p = state.pickups[i];
    p.y += scroll * dt;
    if (p.kind === 'coin') {
      p.frame = (p.frame + dt * 9) % 4;
    } else {
      p.bob += dt * 3;
      p.x = clamp(p.x + Math.sin(p.bob) * VW * 0.06 * dt, 6, VW - 6);
    }
    if (p.y - p.h > VH + 4) { state.pickups.splice(i, 1); continue; }
    if (overlap(box.x, box.y, box.w, box.h, p.x - p.w / 2 - 2, p.y - p.h / 2 - 2, p.w + 4, p.h + 4)) {
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
    state.shieldUntil = now + 5000;
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
    state.doubleUntil = now + 10000;
    showToast(t().bonusDouble, 'double-shot', 'toast-ico-double');
  } else if (type === 'spread') {
    state.spreadUntil = now + 10000;
    showToast(t().bonusSpread, 'spread-shot', 'toast-ico-spread');
  } else if (type === 'shock') {
    state.shockId++;
    state.shock = { x: state.ship.x, y: state.ship.y, r: 0, max: VH * 1.25, id: state.shockId };
    showToast(t().bonusShock, 'shockwave', 'toast-ico-shock');
  }
}

// ---------- L'onda d'urto ----------
// Parte dalla navicella e si allarga: spazza i colpi nemici, spacca i sassi
// (anche i grossi), butta giù leggeri e medi, toglie metà vita a un pesante e
// un decimo a un boss. Colpisce solo quello che tocca mentre passa: la roba
// che entra dopo non è protetta da niente.
function updateShock(dt) {
  const s = state.shock;
  if (!s) return;
  s.r += VH * 1.8 * dt;
  const within = (x, y) => {
    const dx = x - s.x, dy = y - s.y;
    return dx * dx + dy * dy <= s.r * s.r;
  };
  for (let i = state.enemyShots.length - 1; i >= 0; i--) {
    const sh = state.enemyShots[i];
    if (within(sh.x, sh.y)) state.enemyShots.splice(i, 1);
  }
  for (let i = state.hazards.length - 1; i >= 0; i--) {
    const h = state.hazards[i];
    if (h.shockHit === s.id || !within(h.x, h.y)) continue;
    h.shockHit = s.id;
    sparkle(h.x, h.y, '#F0D8FF', 5);
    if (h.kind === 'rock') state.coins += 1;
    else if (h.kind === 'mine') state.coins += 2;
    state.hazards.splice(i, 1);
    updateHUD();
  }
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const e = state.enemies[i];
    if (e.shockHit === s.id || !within(e.x, e.y)) continue;
    e.shockHit = s.id;
    if (e.cls === 'heavy') { e.hp -= e.maxHp / 2; e.flash = 0.12; if (e.hp <= 0) killEnemy(i); }
    else killEnemy(i);
  }
  const b = state.boss;
  if (b && !b.dying && b.shockHit !== s.id && within(b.x, b.y)) {
    b.shockHit = s.id;
    b.hp -= b.maxHp * 0.1;
    sparkle(b.x, b.y, '#F0D8FF', 14);
    if (b.hp <= 0) bossDefeated();
  }
  if (s.r > s.max) state.shock = null;
}

// ---------- Colpi ----------
function updateShots(dt, now) {
  const boss = state.boss;
  for (let i = state.shots.length - 1; i >= 0; i--) {
    const s = state.shots[i];
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.y < -6 || s.x < -6 || s.x > VW + 6) { state.shots.splice(i, 1); continue; }

    let gone = false;
    // nemici
    for (let k = state.enemies.length - 1; k >= 0 && !gone; k--) {
      const e = state.enemies[k];
      if (!overlap(s.x, s.y, 2, 5, e.x - e.w / 2, e.y - e.h / 2, e.w, e.h)) continue;
      sparkle(s.x, s.y, '#FFF0C0', 3);
      damageEnemy(k, 2);
      gone = true;
    }
    // sassi piccoli: si spaccano. Grossi, mine e muri: il colpo si spegne lì.
    for (let k = state.hazards.length - 1; k >= 0 && !gone; k--) {
      const h = state.hazards[k];
      if (!overlap(s.x, s.y, 2, 5, h.x - h.w / 2, h.y - h.h / 2, h.w, h.h)) continue;
      gone = true;
      if (h.hp > 0) {
        h.hp -= 2;
        if (h.hp <= 0) {
          sparkle(h.x, h.y, '#FFE9BC', 6);
          state.hazards.splice(k, 1);
          state.coins += 1;
          updateHUD();
        } else sparkle(s.x, s.y, '#FFE9BC', 2);
      } else sparkle(s.x, s.y, '#9AA0AA', 2);
    }
    if (!gone && boss && !boss.dying && boss.y > -BOSS_SIZE &&
        overlap(s.x, s.y, 2, 5, boss.x - BOSS_SIZE / 2, boss.y - BOSS_SIZE / 2, BOSS_SIZE, BOSS_SIZE)) {
      gone = true;
      if (now > boss.invulnUntil) {
        boss.hp -= 2;
        sparkle(s.x, s.y, '#FFF0C0', 3);
        if (boss.hp <= 0) bossDefeated();
      } else {
        sparkle(s.x, s.y, '#6FD3E8', 2);
      }
    }
    if (gone) state.shots.splice(i, 1);
  }

  const box = shipBox();
  for (let i = state.enemyShots.length - 1; i >= 0; i--) {
    const s = state.enemyShots[i];
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    if (s.sinAmp) s.x += Math.sin((s.life += dt) * s.sinFreq) * s.sinAmp * dt;
    if (s.splitAt != null) {
      s.splitAt -= dt;
      if (s.splitAt <= 0) {
        s.splitAt = null;
        for (const dx of [-0.25 * VH, 0.25 * VH]) {
          state.enemyShots.push({ x: s.x, y: s.y, vx: dx, vy: s.vy * 0.9, w: s.w, h: s.h, color: s.color, life: 0 });
        }
      }
    }
    if (s.y - s.h > VH + 6 || s.y < -40 || s.x < -20 || s.x > VW + 20) { state.enemyShots.splice(i, 1); continue; }
    if (now > state.invulnUntil && overlap(box.x, box.y, box.w, box.h, s.x - s.w / 2, s.y - s.h / 2, s.w, s.h)) {
      state.enemyShots.splice(i, 1);
      damageShip(now);
    }
  }
}

// Doppio colpo e ventaglio si SOMMANO: due canne per tre direzioni fanno sei
// proiettili. Sono dieci secondi in cui i nemici non sono un problema, ed è
// voluto — è il momento in cui si recupera un'ondata andata storta.
function fireShip(now) {
  const y = state.ship.y - SHIP_H / 2;
  const speed = 1.7 * VH;
  const angles = now < state.spreadUntil ? [-0.30, 0, 0.30] : [0];
  const lanes = now < state.doubleUntil ? [-4, 2] : [-1];
  for (const a of angles) {
    for (const lane of lanes) {
      state.shots.push({
        x: state.ship.x + lane, y: y,
        vx: Math.sin(a) * speed, vy: -Math.cos(a) * speed,
      });
    }
  }
  state.nextShotAt = now + 240;
}

function hitsShip(h, now) {
  if (now < state.invulnUntil) return false;
  const box = shipBox();
  if (!overlap(box.x, box.y, box.w, box.h, h.x - h.w / 2, h.y - h.h / 2, h.w, h.h)) return false;
  damageShip(now);
  return true;
}

function damageShip(now) {
  if (now < state.invulnUntil) return;
  if (now < state.shieldUntil) {
    state.shieldUntil = 0;   // la bolla regge un colpo solo, poi si spegne
    state.invulnUntil = now + 900;
    sparkle(state.ship.x, state.ship.y, '#6FD3E8', 12);
    return;
  }
  state.lives -= 1;
  state.invulnUntil = now + 1800;
  sparkle(state.ship.x, state.ship.y, '#FF7133', 14);
  updateHUD();
  if (state.lives <= 0) shipDestroyed();
}

function sparkle(x, y, color, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = (0.08 + Math.random() * 0.28) * VH;
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
// Uno per settore, ognuno col suo modo di muoversi e di sparare. Stanno in
// cima e si spostano di lato; tutti sono battibili restando calmi: nessuno
// riempie lo schermo di colpi senza lasciare una strada.
function updateBoss(dt, now) {
  const b = state.boss;
  const def = b.def;

  if (b.dying > 0) {
    b.dying -= dt;
    if (Math.random() < 0.35) sparkle(b.x - BOSS_SIZE / 2 + Math.random() * BOSS_SIZE, b.y - BOSS_SIZE / 2 + Math.random() * BOSS_SIZE, '#FFB23F', 3);
    if (b.dying <= 0) sectorCleared();
    return;
  }

  const home = 12 + BOSS_SIZE / 2;
  if (b.entering) {
    b.y += 0.28 * VH * dt;
    if (b.y >= home) { b.y = home; b.entering = false; }
    return;
  }

  // movimento: sempre di lato, con un respiro verticale piccolo
  b.phase += dt;
  const hurt = b.hp / b.maxHp < 0.4 ? 1.35 : 1; // ferito, si agita di più
  const halfSpan = VW / 2 - BOSS_SIZE / 2 - 4;
  const speed = (def.speed / 240) * VW;
  // La fase dell'onda si ACCUMULA, e la fretta del boss ferito ne cambia solo
  // la velocità. Prima era `sin(fase_totale × fretta)`: nell'istante in cui la
  // fretta passava da 1 a 1,35 l'argomento del seno faceva un salto di parecchi
  // radianti e il boss spariva da una parte all'altra dello schermo — lo scatto
  // "torna a sinistra a caso" che si vedeva su AUTOPLAY.
  b.wave += dt * (def.speed / 40) * hurt * 0.55;
  if (def.move === 'sine') {
    b.x = VW / 2 + Math.sin(b.wave) * halfSpan;
  } else if (def.move === 'patrol') {
    b.x += b.dir * speed * hurt * dt;
    if (b.x < VW / 2 - halfSpan) { b.x = VW / 2 - halfSpan; b.dir = 1; }
    if (b.x > VW / 2 + halfSpan) { b.x = VW / 2 + halfSpan; b.dir = -1; }
  } else if (def.move === 'chase') {
    const target = clamp(state.ship.x, VW / 2 - halfSpan, VW / 2 + halfSpan);
    b.x += clamp(target - b.x, -speed * hurt * dt, speed * hurt * dt);
  } else if (def.move === 'jitter') {
    b.x += Math.sin(b.phase * 4.1) * speed * hurt * dt * 1.6;
    b.x = clamp(b.x, VW / 2 - halfSpan, VW / 2 + halfSpan);
  }
  b.y = home + Math.sin(b.phase * 0.9) * 4;

  // attacchi
  b.fireAt -= dt * hurt;
  if (b.fireAt <= 0) bossAttack(b, now);
  if (b.burst > 0) {
    b.burstAt -= dt;
    if (b.burstAt <= 0) {
      b.burst--;
      b.burstAt = 0.13;
      enemyShot(b, 0, 0.62, '#FFF0C0');
    }
  }

  // PREMIUM alterna finestre di invulnerabilità: si aspetta e si schiva. Un
  // secondo e mezzo ogni otto: misurato a tempo simulato, due ogni sette
  // facevano durare lo scontro più del doppio di tutti gli altri.
  if (b.index === 8) {
    const cycle = b.phase % 8;
    b.invulnUntil = cycle < 1.5 ? now + 50 : 0;
  }

  // i bonus passano anche durante lo scontro: senza, un settore lungo finisce
  // per costringere ad arrivare al boss con lo scudo già speso
  b.bonusAt -= dt;
  if (b.bonusAt <= 0) {
    b.bonusAt = 9 + Math.random() * 5;
    const roll = Math.random();
    const type = roll < 0.30 ? 'double'
      : (roll < 0.50 ? 'spread'
      : (roll < 0.80 ? 'shield'
      : (roll < 0.90 ? 'life' : 'shock')));
    state.pickups.push({ kind: 'bonus', type: type, x: 10 + Math.random() * (VW - 20), y: -12, w: 11, h: 10, bob: 0 });
  }
}

// le velocità dei colpi sono in campi al secondo: vxF di lato, vyF in giù
function enemyShot(b, vxF, vyF, color, opts) {
  const s = {
    x: b.x, y: b.y + BOSS_SIZE / 2 - 4,
    vx: vxF * VH, vy: vyF * VH,
    w: 4, h: 4, color: color, life: 0,
  };
  if (opts) Object.assign(s, opts);
  state.enemyShots.push(s);
}
function aimedShot(b, speedF, color, opts) {
  aimedShotFrom(b.x, b.y + BOSS_SIZE / 2 - 4, speedF, color, opts);
}
function aimedShotFrom(x, y, speedF, color, opts) {
  const dx = state.ship.x - x;
  const dy = state.ship.y - y;
  const d = Math.max(1, Math.sqrt(dx * dx + dy * dy));
  const s = {
    x: x, y: y,
    vx: (dx / d) * speedF * VH, vy: (dy / d) * speedF * VH,
    w: 4, h: 4, color: color, life: 0,
  };
  if (opts) Object.assign(s, opts);
  state.enemyShots.push(s);
}

function bossAttack(b, now) {
  const i = b.index;
  if (i === 0) {           // POP-UP: finestrelle che si aprono addosso
    for (let k = -1; k <= 1; k++) {
      enemyShot(b, k * 0.11, 0.30 + Math.random() * 0.12, '#FF6B8A', { w: 6, h: 6 });
    }
    b.fireAt = 1.5;
  } else if (i === 1) {    // BANNER: fasce larghe che occupano mezzo schermo
    enemyShot(b, 0, 0.44, '#E0603C', { w: 26, h: 5 });
    b.fireAt = 1.9;
  } else if (i === 2) {    // COOKIE: briciole a raggiera
    for (let k = 0; k < 7; k++) {
      const a = Math.PI / 2 + (k - 3) * 0.26;
      enemyShot(b, Math.cos(a) * 0.36, Math.sin(a) * 0.36, '#F2D9A8', { w: 3, h: 3 });
    }
    b.fireAt = 2.1;
  } else if (i === 3) {    // AUTOPLAY: raffiche che partono da sole
    b.burst = 5; b.burstAt = 0;
    b.fireAt = 2.2;
  } else if (i === 4) {    // TRACKER: mira dove sei
    aimedShot(b, 0.50, '#FFE24A', { w: 5, h: 5 });
    b.fireAt = 0.95;
  } else if (i === 5) {    // NEWSLETTER: ondate che ondeggiano
    for (let k = -2; k <= 2; k++) {
      enemyShot(b, k * 0.05, 0.40, '#4FC3D9', { w: 6, h: 4, sinAmp: 0.25 * VH, sinFreq: 3 });
    }
    b.fireAt = 2.4;
  } else if (i === 6) {    // PAYWALL: muretti con un varco
    const cells = 5;
    const cw = VW / cells;
    const gapK = Math.floor(Math.random() * (cells - 1));
    for (let k = 0; k < cells; k++) {
      if (k === gapK || k === gapK + 1) continue;
      state.enemyShots.push({
        x: k * cw + cw / 2, y: b.y + BOSS_SIZE / 2,
        vx: 0, vy: 0.32 * VH, w: cw - 4, h: 8, color: '#C8752C', life: 0,
      });
    }
    b.fireAt = 3.4;
  } else if (i === 7) {    // SPAM: copie che si moltiplicano
    for (const dx of [-0.08, 0.08]) {
      enemyShot(b, dx, 0.40, '#FFF07A', { w: 5, h: 5, splitAt: 0.55 });
    }
    b.fireAt = 2.0;
  } else if (i === 8) {    // PREMIUM: monete d'oro che costano care
    for (let k = -2; k <= 2; k++) {
      enemyShot(b, k * 0.09, 0.42, '#FFC94A', { w: 5, h: 5 });
    }
    b.fireAt = 1.7;
  } else {                 // ALGO: sa già tutto e mescola tutto
    const kind = Math.floor(b.phase / 3) % 3;
    if (kind === 0) {
      aimedShot(b, 0.62, '#8AF0FF', { w: 5, h: 5 });
      b.fireAt = 0.55;
    } else if (kind === 1) {
      for (let k = 0; k < 9; k++) {
        const a = Math.PI / 2 + (k - 4) * 0.22;
        enemyShot(b, Math.cos(a) * 0.44, Math.sin(a) * 0.44, '#3FE0F0', { w: 4, h: 4 });
      }
      b.fireAt = 1.5;
    } else {
      for (const dx of [-0.12, 0, 0.12]) enemyShot(b, dx, 0.54, '#DCEBFF', { w: 6, h: 4, sinAmp: 0.17 * VH, sinFreq: 4 });
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
  sparkle(b.x, b.y, '#FFB23F', 26);
}

// ---------- Fine livello / fine settore / morte ----------
// Fra un livello e l'altro non si ricostruisce niente: si smette di far
// arrivare roba, passa la striscia col livello nuovo, e intanto quello che è
// rimasto in campo finisce di scendere. Un secondo e mezzo, senza scatti.
function levelCleared() {
  const next = state.level + 1;
  if (next > LEVELS) { sectorCleared(); return; }
  state.transition = 1.5;
  state.transitionTo = next;
  showLevelStrip(next);
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
  // Il boss è morto: il progresso passa al livello dopo ADESSO, non quando si
  // preme "Continua". Chi batteva un boss e chiudeva lì la pagina si ritrovava
  // salvato sul livello del boss, e riaprendo il gioco — anche su un altro
  // dispositivo — se lo ritrovava davanti da rifare.
  state.level += 1;
  state.sectorCoins = state.coins;
  updateHUD();
  updateSectorLine();
  saveProgress();
}

function shipDestroyed() {
  state.mode = 'over';
  state.paused = true;
  noteBest();
  const sector = sectorOf(state.level);
  els.gameOverSub.textContent = t().gameOverSub(sector + 1, SECTORS[sector].name);
  els.gameOverOverlay.classList.add('show');
  // si salva la situazione in cui si RIPRENDERÀ, non quella in cui si è morti:
  // il settore riparte dal suo primo livello con tre vite e le monete
  // dell'ingresso, e questo dev'essere vero anche riaprendo il gioco altrove
  state.level = sectorFirstLevel(state.level);
  state.lives = START_LIVES;
  state.coins = state.sectorCoins;
  updateHUD();
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

// "Ricomincia da capo": si butta via la partita, non il record. `state.best` e
// quindi la riga in classifica restano quelli che sono — il punteggio salvato
// è sempre il meglio che si è fatto, non l'ultima partita.
function restartFromStart() {
  state.level = 1;
  state.lives = START_LIVES;
  state.coins = 0;
  state.sectorCoins = 0;
  startLevel(1);
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
    ctx.drawImage(l.canvas, 0, off);
    ctx.drawImage(l.canvas, 0, off - VH);
  }

  for (const p of state.pickups) {
    const spr = p.kind === 'coin' ? SPR.coin[Math.floor(p.frame) % 4] : SPR.bonus[p.type];
    ctx.drawImage(spr, Math.round(p.x - p.w / 2), Math.round(p.y - p.h / 2));
  }

  for (const h of state.hazards) {
    let spr;
    if (h.kind === 'rock') spr = h.spr;
    else if (h.kind === 'mine') spr = (Math.floor(state.clock / 220) % 2) ? SPR.mineOn : SPR.mineOff;
    else spr = SPR.block;
    ctx.drawImage(spr, Math.round(h.x - h.w / 2), Math.round(h.y - h.h / 2));
  }

  // nemici (lampeggiano bianchi quando prendono un colpo)
  for (const e of state.enemies) {
    const spr = e.flash > 0 ? SPR[e.def.spr + 'Flash'] : SPR[e.def.spr];
    ctx.drawImage(spr, Math.round(e.x - e.w / 2), Math.round(e.y - e.h / 2));
    // barra della vita sopra ai medi e ai pesanti: senza, insistere su un
    // pesante sembra non servire a niente
    if (e.cls !== 'light' && !e.entering && e.hp < e.maxHp) {
      const w = e.w;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(Math.round(e.x - w / 2), Math.round(e.y - e.h / 2) - 3, w, 2);
      ctx.fillStyle = '#7CFF9B';
      ctx.fillRect(Math.round(e.x - w / 2), Math.round(e.y - e.h / 2) - 3, Math.max(0, w * (e.hp / e.maxHp)), 2);
    }
  }

  // colpi
  ctx.fillStyle = '#FFF0C0';
  for (const s of state.shots) {
    ctx.fillRect(Math.round(s.x), Math.round(s.y), 2, 5);
    if (s.vx) ctx.fillRect(Math.round(s.x + (s.vx > 0 ? 1 : -1)), Math.round(s.y + 2), 2, 3);
  }
  for (const s of state.enemyShots) {
    ctx.fillStyle = s.color;
    ctx.fillRect(Math.round(s.x - s.w / 2), Math.round(s.y - s.h / 2), s.w, s.h);
  }

  // boss
  const b = state.boss;
  if (b) {
    const blink = b.dying > 0 && Math.floor(state.clock / 80) % 2 === 0;
    if (!blink) {
      ctx.drawImage(SPR.bosses[b.index], Math.round(b.x - BOSS_SIZE / 2), Math.round(b.y - BOSS_SIZE / 2));
    }
    if (state.clock < b.invulnUntil) {
      // scudo del boss: due cornici traslucide, niente sfocature calcolate a frame
      ctx.strokeStyle = 'rgba(111,211,232,0.75)';
      ctx.strokeRect(Math.round(b.x - BOSS_SIZE / 2) - 2.5, Math.round(b.y - BOSS_SIZE / 2) - 2.5, BOSS_SIZE + 5, BOSS_SIZE + 5);
      ctx.strokeStyle = 'rgba(111,211,232,0.35)';
      ctx.strokeRect(Math.round(b.x - BOSS_SIZE / 2) - 4.5, Math.round(b.y - BOSS_SIZE / 2) - 4.5, BOSS_SIZE + 9, BOSS_SIZE + 9);
    }
    if (!b.entering) {
      const barW = VW - 24;
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(12, 3, barW, 4);
      ctx.fillStyle = '#FF7133';
      ctx.fillRect(12, 3, Math.max(0, barW * (b.hp / b.maxHp)), 4);
      ctx.fillStyle = 'rgba(255,235,207,0.35)';
      ctx.fillRect(12, 3, barW, 1);
    }
  }

  // navicella (lampeggia quando è intoccabile dopo un colpo preso)
  const now = state.clock;
  const invisible = now < state.invulnUntil && Math.floor(now / 90) % 2 === 0;
  if (!invisible) {
    const x = Math.round(state.ship.x - SHIP_W / 2), y = Math.round(state.ship.y - SHIP_H / 2);
    ctx.drawImage(SPR.ship, x, y);
    // fiammata: quattro pixel che ballano sotto ai motori, l'unica cosa
    // disegnata a mano
    const f = Math.floor(now / 60) % 3;
    ctx.fillStyle = '#FFB23F';
    ctx.fillRect(x + 3, y + SHIP_H, 1, 2 + f);
    ctx.fillRect(x + 7, y + SHIP_H, 1, 2 + f);
    ctx.fillStyle = '#FF7133';
    ctx.fillRect(x + 3, y + SHIP_H + 2 + f, 1, 1);
    ctx.fillRect(x + 7, y + SHIP_H + 2 + f, 1, 1);
    // la bolla dello scudo: un cerchio, non una scatola
    if (now < state.shieldUntil) {
      const cx = state.ship.x, cy = state.ship.y, r = SHIP_H * 0.72;
      ctx.strokeStyle = 'rgba(111,211,232,0.85)';
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(111,211,232,0.35)';
      ctx.beginPath(); ctx.arc(cx, cy, r + 2, 0, Math.PI * 2); ctx.stroke();
      // gli ultimi tre quarti di secondo lampeggia: si sa che sta per finire
      if (state.shieldUntil - now < 750 && Math.floor(now / 100) % 2 === 0) {
        ctx.strokeStyle = 'rgba(223,247,255,0.9)';
        ctx.beginPath(); ctx.arc(cx, cy, r + 1, 0, Math.PI * 2); ctx.stroke();
      }
    }
  }

  // l'onda d'urto mentre passa
  const sh = state.shock;
  if (sh) {
    const fade = clamp(1 - sh.r / sh.max, 0, 1);
    ctx.strokeStyle = 'rgba(240,216,255,' + (0.9 * fade).toFixed(3) + ')';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(sh.x, sh.y, sh.r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = 'rgba(176,106,232,' + (0.5 * fade).toFixed(3) + ')';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(sh.x, sh.y, Math.max(0, sh.r - 5), 0, Math.PI * 2); ctx.stroke();
  }

  for (const p of state.particles) {
    ctx.fillStyle = p.color;
    ctx.fillRect(Math.round(p.x), Math.round(p.y), 2, 2);
  }
}

// ---------- Il giro principale ----------
let lastTime = null;
let ready = false;              // a caricamento finito: prima non si salva niente
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
// Una sola tabella per tutto il mondo, e basta: Cosmy non è un gioco di parole,
// quindi la lingua non c'entra niente con quanto si è bravi e non compare da
// nessuna parte. Prima ogni riga mostrava la bandiera della lingua scelta da
// chi la occupava: cambiava se cambiavi lingua in home (quindi non diceva
// nemmeno da dove uno viene) e, soprattutto, era un dato personale in una
// tabella pubblica che non serviva a giocare. Via.
// Il punteggio salvato nel database è UN numero solo, con due cose dentro:
//   livello × 10.000.000 + monete × 10
// così l'ordinamento del database (punteggio decrescente) mette avanti chi è
// arrivato più in là e, a parità di livello, chi ha più monete.
const SCORE_LEVEL_UNIT = 10000000;
const MAX_COINS_IN_SCORE = 999999;
function encodeScore(level, coins) {
  return level * SCORE_LEVEL_UNIT + Math.min(coins, MAX_COINS_IN_SCORE) * 10;
}
function decodeScore(score) {
  const s = Math.max(0, score | 0);
  const level = Math.floor(s / SCORE_LEVEL_UNIT);
  const rest = s % SCORE_LEVEL_UNIT;
  return { level: level, coins: Math.floor(rest / 10) };
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
  }, encodeScore(state.best.level, state.best.coins));
}
async function loadSaved() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  return await window.FFR.auth.loadProgress('cosmy');
}
// I salvataggi vecchi devono restare leggibili anche quando la forma cambia:
// qui si accetta qualunque cosa e si riempiono i buchi con valori sensati.
// I settori sono passati da dieci livelli a cinque, quindi un salvataggio
// vecchio può indicare un livello che non esiste più: si riporta dentro alla
// scala, e monete e record restano quelli.
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
  els.restartAllBtn.addEventListener('click', () => {
    els.pauseOverlay.classList.remove('show');
    els.restartAllOverlay.classList.add('show');
  });
  els.confirmRestartAllBtn.addEventListener('click', () => {
    els.restartAllOverlay.classList.remove('show');
    restartFromStart();
  });
  els.cancelRestartAllBtn.addEventListener('click', () => {
    els.restartAllOverlay.classList.remove('show');
    showTapLayer();
  });
  els.restartAllOverlay.addEventListener('click', (e) => {
    if (e.target === els.restartAllOverlay) { els.restartAllOverlay.classList.remove('show'); showTapLayer(); }
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
    startLevel(state.level);   // il livello è già avanzato in sectorCleared
    state.paused = false;
  });
  els.retryBtn.addEventListener('click', () => {
    els.gameOverOverlay.classList.remove('show');
    restartSector();
  });

  // finestra nascosta (cambio scheda, telefono in tasca): si mette in pausa da
  // sola, o si torna e si è morti senza aver visto niente
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) return;
    if (state.mode === 'play' && !state.paused) showTapLayer();
    // su un telefono la pagina nascosta può non tornare mai più: il momento di
    // salvare è questo, non "alla prossima cosa che succede"
    if (ready) saveProgress();
  });

  // il campo si rimisura quando lo schermo cambia (rotazione, finestra tirata):
  // le velocità sono in campi al secondo, quindi il gioco resta lo stesso
  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => applyGeometry(false), 120);
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);

  applyGeometry(true);
  requestAnimationFrame(loop);

  // Il progresso si carica SEMPRE, anche quando si mostra il tutorial: la
  // chiave del tutorial è per-dispositivo, quindi su un secondo telefono
  // ricompare anche a chi ha già un account con i suoi progressi nel cloud.
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('cosmy-tutorial-seen'); } catch (e) { /* ignora */ }
  const saved = await loadSaved();
  applySaved(saved);
  applyGeometry(true);   // i font sono arrivati: la barra ha la sua altezza vera
  startLevel(state.level);
  state.paused = true;
  // Da qui in poi si salva. NON prima: se il cloud non risponde, quello che si
  // è appena letto è la copia locale, e riscriverla subito con la data di
  // adesso significherebbe far vincere un progresso vecchio su quello buono
  // appena il collegamento torna.
  ready = true;

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
  if (id === 'pauseOverlay' || id === 'settingsOverlay' || id === 'restartOverlay' || id === 'restartAllOverlay') {
    if (state.mode === 'play') showTapLayer();
  }
};
