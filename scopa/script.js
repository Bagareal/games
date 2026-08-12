/* ============ SCOPA — motore di gioco ============
   La scopa è un gioco di carte popolare italiano, senza autore né proprietario:
   le sue regole si tramandano da secoli. Qui si gioca in due, uno contro il
   computer, con le regole di base: presa obbligata sulla carta di pari valore,
   scopa a tavolo vuoto, e a fine mano carte, denari, settebello e primiera.
   Codice, grafica e testi sono scritti da zero per questo sito: nessun mazzo
   esistente è stato copiato, i quattro semi sono disegnati qui dentro.

   Due punti che le regole scritte lasciano aperti e che qui valgono così:
   - i denari vanno a chi ne ha almeno 6, cioè più della metà dei dieci;
   - l'ultima carta della mano non fa scopa, perché il tavolo si sarebbe
     svuotato comunque.
   Il rebello (dieci di denari) è un uso del nord: è un interruttore nelle
   impostazioni, spento di partenza. */

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
    backToHome: 'Torna in Home',
    play: 'Gioca',
    gotIt: 'Ho capito!',

    rulesTitle: 'Come si gioca',
    rule1: 'Si gioca in due con 40 carte. Tu e il computer avete 3 carte in mano e sul tavolo ce ne sono 4 scoperte. Finite le carte, se ne ricevono altre 3 a testa.',
    rule2: 'A turno si gioca una carta. Prende le carte del tavolo di valore uguale alla sua, oppure più carte che sommate fanno il suo valore. Se non prende niente, resta sul tavolo.',
    rule3: "Se sul tavolo c'è una carta dello stesso valore, quella è obbligatoria: non si può prendere la somma di più carte.",
    rule4: "Chi con la sua presa svuota il tavolo fa scopa: un punto. L'ultima carta della mano non fa scopa, perché il tavolo si sarebbe svuotato comunque.",
    rule5: "Finite tutte le carte, quelle rimaste sul tavolo vanno all'ultimo che ha preso.",
    rule6: 'A fine mano si contano i punti: un punto a chi ha più di 20 carte, uno a chi ha più denari, uno a chi ha il sette di denari, uno a chi ha la primiera, più un punto per ogni scopa.',
    rule7: "La primiera si conta con la carta migliore di ogni seme: il 7 vale 21, il 6 vale 18, l'asso 16, il 5 vale 15, il 4 vale 14, il 3 vale 13, il 2 vale 12 e le figure 10.",
    rule8: "Vince chi arriva per primo a 11 punti. Se ci arrivate tutti e due nella stessa mano vince chi ne ha di più, e se siete pari si gioca un'altra mano.",
    rule9: "Trascina una carta della tua mano sul tavolo, col dito o con il mouse: mentre la trascini si illuminano le carte che può prendere. Se le prese possibili sono più d'una, le combinazioni compaiono sul tavolo e scegli quella che vuoi. Si può giocare anche a tocchi: tocca la carta, poi tocca il tavolo.",
    rule10: 'Nelle impostazioni si possono accendere due aiuti: il rebello, cioè un punto in più a chi ha il dieci di denari, e il conto delle carte non ancora uscite.',

    creatorTitle: 'Giocherai contro TheCreator',
    creatorSub: 'il genio dietro questa bellissima app.',
    chooseDifficulty: 'Scegli la difficoltà',
    diffStupido: 'Stupido',
    diffNormale: 'Normale',
    diffMaster: 'Master',
    tauntStupido: 'Le carte le tengo al contrario',
    tauntNormale: 'Dai su, giochiamo…',
    tauntMaster: 'Me le ricordo tutte, sai?',

    gameOptions: 'Partita',
    difficultyMenuLabel: 'Difficoltà',
    rebelloTitle: 'Rebello',
    rebelloSub: 'Un punto in più a chi prende il dieci di denari',
    counterTitle: 'Carte non uscite',
    counterSub: 'Mostra quante carte di ogni valore mancano ancora',

    statCards: 'carte',
    statScope: 'scope',
    statPoints: 'punti',

    you: 'Tu',
    creatorName: 'TheCreator',
    yourTurn: 'Tocca a te',
    thinking: 'TheCreator sta pensando…',
    chooseTake: 'Scegli la presa',
    cancelTake: 'Annulla',
    scopaFlash: 'Scopa!',

    restartTitle: 'Ricominciare la partita?',
    restartBody: 'La partita in corso viene persa e si riparte da zero a zero, con la stessa difficoltà.',
    difficultyChangeTitle: 'Cambiare difficoltà?',
    difficultyChangeBody: 'La partita in corso viene persa e se ne comincia una nuova al livello scelto.',
    optionChangeTitle: 'Cambiare le regole adesso?',
    optionChangeBody: 'Il rebello cambia il conto dei punti, quindi la partita in corso viene persa e se ne comincia una nuova.',
    confirmYes: 'Sì, ricomincia',
    confirmNo: 'No, continuo',

    handEndTitle: 'Conto della mano',
    nextHand: 'Mano successiva',
    colYou: 'Tu',
    rowCards: 'Carte',
    rowDenari: 'Denari',
    rowSettebello: 'Settebello',
    rowRebello: 'Rebello',
    rowPrimiera: 'Primiera',
    rowScope: 'Scope',
    rowTotal: 'Punti della mano',
    lastTrickYou: "Le carte rimaste sul tavolo sono andate a te: l'ultima presa era tua.",
    lastTrickPc: "Le carte rimaste sul tavolo sono andate a TheCreator: l'ultima presa era sua.",
    matchLine: (a, b) => `Partita: ${a} a ${b}`,

    youWin: 'Hai vinto!',
    youLose: 'Ha vinto TheCreator',
    winSub: (diff, wins) => `Hai battuto TheCreator a livello ${diff}. Vittorie a questo livello: ${wins}.`,
    loseSub: diff => `Livello ${diff}. Riprova: la prossima è quella buona.`,
    playAgain: 'Rigioca',
    changeDifficulty: 'Cambia difficoltà',

    leaderboardTitle: 'Classifica',
    leaderboardNote: 'Contano le partite vinte contro il computer.',
    leaderboardEmpty: 'Nessuna vittoria ancora: gioca da loggato per essere il primo!',
    winsShort: n => `${n} vitt.`,
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
    backToHome: 'Back to Home',
    play: 'Play',
    gotIt: 'Got it!',

    rulesTitle: 'How to play',
    rule1: 'Two players, 40 cards. You and the computer hold 3 cards each and 4 more lie face up on the table. When your hands run out, you are dealt 3 more each.',
    rule2: 'Players take turns playing one card. It captures the table cards of the same value, or several cards adding up to its value. If it captures nothing, it stays on the table.',
    rule3: 'If a card of the same value is on the table, taking it is compulsory: you may not take a sum of several cards instead.',
    rule4: 'Clearing the table with your capture is a "scopa": one point. The very last card of the hand never scores a scopa, because the table would have emptied anyway.',
    rule5: 'When all the cards are played, whatever is left on the table goes to whoever captured last.',
    rule6: 'Points are counted at the end of each hand: one for more than 20 cards, one for most coins, one for the seven of coins, one for the primiera, plus one for every scopa.',
    rule7: 'The primiera is counted with your best card in each suit: a 7 is worth 21, a 6 is 18, an ace 16, a 5 is 15, a 4 is 14, a 3 is 13, a 2 is 12 and the face cards 10.',
    rule8: 'First to 11 points wins. If you both reach it in the same hand the higher score wins, and if you are level you play another hand.',
    rule9: 'Drag a card from your hand onto the table, with your finger or the mouse: the cards it can take light up as you drag. If there is more than one possible capture, the combinations appear on the table and you pick the one you want. Tapping works too: tap the card, then tap the table.',
    rule10: 'Two optional aids can be switched on in the settings: the rebello, an extra point for the ten of coins, and the count of the cards not played yet.',

    creatorTitle: "You'll play against TheCreator",
    creatorSub: 'the genius behind this beautiful app.',
    chooseDifficulty: 'Choose the difficulty',
    diffStupido: 'Dumb',
    diffNormale: 'Normal',
    diffMaster: 'Master',
    tauntStupido: 'I hold my cards the wrong way round',
    tauntNormale: "Come on, let's play…",
    tauntMaster: 'I remember every single card, you know.',

    gameOptions: 'Game',
    difficultyMenuLabel: 'Difficulty',
    rebelloTitle: 'Rebello',
    rebelloSub: 'An extra point for whoever takes the ten of coins',
    counterTitle: 'Cards not played yet',
    counterSub: 'Show how many cards of each value are still missing',

    statCards: 'cards',
    statScope: 'scopas',
    statPoints: 'points',

    you: 'You',
    creatorName: 'TheCreator',
    yourTurn: 'Your turn',
    thinking: 'TheCreator is thinking…',
    chooseTake: 'Choose your capture',
    cancelTake: 'Cancel',
    scopaFlash: 'Scopa!',

    restartTitle: 'Restart the game?',
    restartBody: 'The current game is lost and you start again from nil-nil, at the same difficulty.',
    difficultyChangeTitle: 'Change difficulty?',
    difficultyChangeBody: 'The current game is lost and a new one starts at the level you pick.',
    optionChangeTitle: 'Change the rules now?',
    optionChangeBody: 'The rebello changes how points are counted, so the current game is lost and a new one starts.',
    confirmYes: 'Yes, restart',
    confirmNo: 'No, keep playing',

    handEndTitle: 'Hand score',
    nextHand: 'Next hand',
    colYou: 'You',
    rowCards: 'Cards',
    rowDenari: 'Coins',
    rowSettebello: 'Seven of coins',
    rowRebello: 'Rebello',
    rowPrimiera: 'Primiera',
    rowScope: 'Scopas',
    rowTotal: 'Points this hand',
    lastTrickYou: 'The cards left on the table went to you: yours was the last capture.',
    lastTrickPc: 'The cards left on the table went to TheCreator: theirs was the last capture.',
    matchLine: (a, b) => `Match: ${a} to ${b}`,

    youWin: 'You win!',
    youLose: 'TheCreator wins',
    winSub: (diff, wins) => `You beat TheCreator on ${diff}. Wins at this level: ${wins}.`,
    loseSub: diff => `Level ${diff}. Try again: the next one is yours.`,
    playAgain: 'Play again',
    changeDifficulty: 'Change difficulty',

    leaderboardTitle: 'Leaderboard',
    leaderboardNote: 'Games won against the computer count.',
    leaderboardEmpty: 'No wins yet: play while signed in to be the first!',
    winsShort: n => `${n} wins`,
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
    backToHome: "Retour à l'accueil",
    play: 'Jouer',
    gotIt: 'Compris !',

    rulesTitle: 'Comment jouer',
    rule1: "On joue à deux avec 40 cartes. Toi et l'ordinateur avez 3 cartes en main et 4 cartes sont face visible sur la table. Quand les mains sont vides, on en distribue 3 de plus à chacun.",
    rule2: "Chacun son tour, on joue une carte. Elle prend les cartes de la table de même valeur, ou plusieurs cartes dont la somme fait sa valeur. Si elle ne prend rien, elle reste sur la table.",
    rule3: "S'il y a sur la table une carte de la même valeur, elle est obligatoire : on ne peut pas prendre la somme de plusieurs cartes à la place.",
    rule4: "Vider la table avec sa prise, c'est une « scopa » : un point. La toute dernière carte de la main ne compte jamais comme scopa, car la table se serait vidée de toute façon.",
    rule5: 'Une fois toutes les cartes jouées, celles qui restent sur la table vont à celui qui a pris en dernier.',
    rule6: "À la fin de chaque main on compte les points : un point pour plus de 20 cartes, un pour le plus de deniers, un pour le sept de deniers, un pour la primiera, plus un point par scopa.",
    rule7: "La primiera se compte avec ta meilleure carte de chaque couleur : le 7 vaut 21, le 6 vaut 18, l'as 16, le 5 vaut 15, le 4 vaut 14, le 3 vaut 13, le 2 vaut 12 et les figures 10.",
    rule8: "Le premier à 11 points gagne. Si vous y arrivez tous les deux dans la même main, c'est le plus haut score qui gagne, et à égalité on joue une main de plus.",
    rule9: "Fais glisser une carte de ta main sur la table, au doigt ou à la souris : les cartes qu'elle peut prendre s'allument pendant que tu la déplaces. S'il y a plusieurs prises possibles, les combinaisons apparaissent sur la table et tu choisis celle que tu veux. Ça marche aussi en touchant : touche la carte, puis touche la table.",
    rule10: "Deux aides facultatives s'allument dans les paramètres : le rebello, un point de plus pour le dix de deniers, et le compte des cartes pas encore sorties.",

    creatorTitle: 'Tu joueras contre TheCreator',
    creatorSub: 'le génie derrière cette superbe appli.',
    chooseDifficulty: 'Choisis la difficulté',
    diffStupido: 'Bête',
    diffNormale: 'Normal',
    diffMaster: 'Maître',
    tauntStupido: 'Je tiens mes cartes à l’envers',
    tauntNormale: 'Allez, on joue…',
    tauntMaster: 'Je me souviens de chaque carte, tu sais.',

    gameOptions: 'Partie',
    difficultyMenuLabel: 'Difficulté',
    rebelloTitle: 'Rebello',
    rebelloSub: 'Un point de plus pour qui prend le dix de deniers',
    counterTitle: 'Cartes pas encore sorties',
    counterSub: 'Montre combien de cartes de chaque valeur manquent encore',

    statCards: 'cartes',
    statScope: 'scopas',
    statPoints: 'points',

    you: 'Toi',
    creatorName: 'TheCreator',
    yourTurn: 'À toi de jouer',
    thinking: 'TheCreator réfléchit…',
    chooseTake: 'Choisis ta prise',
    cancelTake: 'Annuler',
    scopaFlash: 'Scopa !',

    restartTitle: 'Recommencer la partie ?',
    restartBody: 'La partie en cours est perdue et on repart de zéro à zéro, à la même difficulté.',
    difficultyChangeTitle: 'Changer de difficulté ?',
    difficultyChangeBody: 'La partie en cours est perdue et une nouvelle commence au niveau choisi.',
    optionChangeTitle: 'Changer les règles maintenant ?',
    optionChangeBody: 'Le rebello change le compte des points : la partie en cours est perdue et une nouvelle commence.',
    confirmYes: 'Oui, recommencer',
    confirmNo: 'Non, je continue',

    handEndTitle: 'Compte de la main',
    nextHand: 'Main suivante',
    colYou: 'Toi',
    rowCards: 'Cartes',
    rowDenari: 'Deniers',
    rowSettebello: 'Sept de deniers',
    rowRebello: 'Rebello',
    rowPrimiera: 'Primiera',
    rowScope: 'Scopas',
    rowTotal: 'Points de la main',
    lastTrickYou: "Les cartes restées sur la table sont pour toi : la dernière prise était la tienne.",
    lastTrickPc: "Les cartes restées sur la table sont pour TheCreator : la dernière prise était la sienne.",
    matchLine: (a, b) => `Partie : ${a} à ${b}`,

    youWin: 'Tu as gagné !',
    youLose: 'TheCreator a gagné',
    winSub: (diff, wins) => `Tu as battu TheCreator en ${diff}. Victoires à ce niveau : ${wins}.`,
    loseSub: diff => `Niveau ${diff}. Réessaie : la prochaine est la bonne.`,
    playAgain: 'Rejouer',
    changeDifficulty: 'Changer de difficulté',

    leaderboardTitle: 'Classement',
    leaderboardNote: "Les parties gagnées contre l'ordinateur comptent.",
    leaderboardEmpty: 'Aucune victoire pour le moment : joue connecté pour être le premier !',
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
  turnPill: document.getElementById('turnPill'),

  seatTop: document.getElementById('seatTop'),
  plateTop: document.getElementById('plateTop'),
  plateTopName: document.getElementById('plateTopName'),
  topCards: document.getElementById('topCards'),
  topScope: document.getElementById('topScope'),
  topPoints: document.getElementById('topPoints'),
  handTop: document.getElementById('handTop'),

  seatBottom: document.getElementById('seatBottom'),
  plateBottom: document.getElementById('plateBottom'),
  plateBottomName: document.getElementById('plateBottomName'),
  botCards: document.getElementById('botCards'),
  botScope: document.getElementById('botScope'),
  botPoints: document.getElementById('botPoints'),
  handBottom: document.getElementById('handBottom'),

  felt: document.getElementById('felt'),
  tableCards: document.getElementById('tableCards'),
  deckStack: document.getElementById('deckStack'),
  deckCount: document.getElementById('deckCount'),
  flash: document.getElementById('flash'),
  counterStrip: document.getElementById('counterStrip'),
  choicePanel: document.getElementById('choicePanel'),
  choiceList: document.getElementById('choiceList'),
  choiceCancelBtn: document.getElementById('choiceCancelBtn'),

  restartBtn: document.getElementById('restartBtn'),
  settingsBtn: document.getElementById('settingsBtn'),

  rulesOverlay: document.getElementById('rulesOverlay'),
  closeRulesBtn: document.getElementById('closeRulesBtn'),
  difficultyOverlay: document.getElementById('difficultyOverlay'),
  difficultyBackBtn: document.getElementById('difficultyBackBtn'),
  tauntOverlay: document.getElementById('tauntOverlay'),
  tauntLine: document.getElementById('tauntLine'),
  tauntPlayBtn: document.getElementById('tauntPlayBtn'),
  tauntBackBtn: document.getElementById('tauntBackBtn'),

  confirmOverlay: document.getElementById('confirmOverlay'),
  confirmTitle: document.getElementById('confirmTitle'),
  confirmBody: document.getElementById('confirmBody'),
  confirmYesBtn: document.getElementById('confirmYesBtn'),
  confirmNoBtn: document.getElementById('confirmNoBtn'),

  handEndOverlay: document.getElementById('handEndOverlay'),
  scoreTable: document.getElementById('scoreTable'),
  matchLine: document.getElementById('matchLine'),
  nextHandBtn: document.getElementById('nextHandBtn'),

  endOverlay: document.getElementById('endOverlay'),
  endIcon: document.getElementById('endIcon'),
  endTitle: document.getElementById('endTitle'),
  endSub: document.getElementById('endSub'),
  endScoreTable: document.getElementById('endScoreTable'),
  endMatchLine: document.getElementById('endMatchLine'),
  playAgainBtn: document.getElementById('playAgainBtn'),
  changeDifficultyBtn: document.getElementById('changeDifficultyBtn'),

  settingsOverlay: document.getElementById('settingsOverlay'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  openLanguageBtn: document.getElementById('openLanguageBtn'),
  openRulesBtn: document.getElementById('openRulesBtn'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  openDifficultyBtn: document.getElementById('openDifficultyBtn'),
  difficultyValue: document.getElementById('difficultyValue'),
  rebelloToggle: document.getElementById('rebelloToggle'),
  counterToggle: document.getElementById('counterToggle'),

  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  leaderboardOverlay: document.getElementById('leaderboardOverlay'),
  leaderboardTabs: document.getElementById('leaderboardTabs'),
  leaderboardList: document.getElementById('leaderboardList'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
};

// ============================================================
//  LE CARTE
// ============================================================
// Una carta è una stringa di due o tre caratteri: il seme e il valore.
// 'd7' = sette di denari, 'b10' = dieci di bastoni. Comoda da salvare, comoda
// da confrontare, e un mazzo intero sta in un array di quaranta stringhe.
const SUITS = ['d', 'c', 's', 'b'];   // denari, coppe, spade, bastoni
const ALL_CARDS = [];
for (const s of SUITS) for (let v = 1; v <= 10; v++) ALL_CARDS.push(s + v);

function cardSuit(id) { return id[0]; }
function cardVal(id) { return +id.slice(1); }

// Punti di primiera, gli stessi che si usano da sempre: il 7 vale più di tutti,
// poi il 6, poi l'asso; le figure valgono pochissimo.
const PRIMIERA = { 7: 21, 6: 18, 1: 16, 5: 15, 4: 14, 3: 13, 2: 12, 8: 10, 9: 10, 10: 10 };

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
  return arr;
}

// ---------- i quattro semi, disegnati qui ----------
// Nessuno di questi disegni viene da un mazzo esistente: sono quattro simboli
// scritti a mano in SVG, che prendono il colore del seme da `currentColor`.
const GLYPHS = {
  // denari: una moneta incisa, con la corona di raggi intorno
  d: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">' +
     '<circle cx="20" cy="20" r="12.5"/><circle cx="20" cy="20" r="5.5" stroke-width="2.4"/>' +
     '<g stroke-width="2" stroke-linecap="round">' +
     '<path d="M20 4.5v3M20 32.5v3M4.5 20h3M32.5 20h3M9 9l2.1 2.1M28.9 28.9L31 31M31 9l-2.1 2.1M11.1 28.9L9 31"/></g></svg>',
  // coppe: un calice con lo stelo e il piede
  c: '<svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">' +
     '<path d="M9 7h22v6a11 11 0 0 1-9 10.8V29h5.5v3.5h-15V29H18v-5.2A11 11 0 0 1 9 13z"/>' +
     '<path d="M9 7h22v2.6H9z" opacity=".55"/></svg>',
  // spade: una lama dritta con l'elsa e il pomo
  s: '<svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">' +
     '<path d="M20 3.5l3.6 7.2V23h-7.2V10.7z"/>' +
     '<rect x="11" y="23" width="18" height="3.4" rx="1.7"/>' +
     '<rect x="18.4" y="26.4" width="3.2" height="6.2"/>' +
     '<circle cx="20" cy="34.6" r="2.8"/></svg>',
  // bastoni: un randello nodoso, con due monconi di ramo
  b: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">' +
     '<path d="M11.5 33.5L28.5 7.5" stroke-width="5.6"/>' +
     '<path d="M17 25.5l-4.6-1.6M24.5 14.5l4.8 1.4" stroke-width="3.4"/>' +
     '<circle cx="20.5" cy="20" r="1.6" fill="currentColor" stroke="none" opacity=".45"/></svg>',
};

// Le tre figure — otto, nove e dieci — portano anche il loro emblema: uno
// scudo, un ferro di cavallo, una corona. Sono segni, non lettere: valgono
// uguali in italiano, in inglese e in francese.
const FIGURES = {
  8: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M20 4l13 4v11c0 8-6.4 14-13 17C13.4 33 7 27 7 19V8z"/></svg>',
  9: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" aria-hidden="true"><path d="M12 34V22a8 8 0 0 1 16 0v12"/></svg>',
  10: '<svg viewBox="0 0 40 40" fill="currentColor" aria-hidden="true"><path d="M5 12l7 7 8-12 8 12 7-7-3 20H8z"/></svg>',
};

function cardHtml(id, extra) {
  const v = cardVal(id);
  const s = cardSuit(id);
  const fig = v >= 8;
  return '<div class="pcard s-' + s + (fig ? ' fig' : '') + (extra ? ' ' + extra : '') + '" data-card="' + id + '">' +
    (fig ? '<span class="fig-mark">' + FIGURES[v] + '</span>' : '') +
    '<span class="corner tl">' + v + '</span>' +
    '<span class="glyph">' + GLYPHS[s] + '</span>' +
    '<span class="corner br">' + v + '</span>' +
    '</div>';
}
function backHtml() { return '<div class="pcard back"></div>'; }

// ============================================================
//  LE REGOLE
// ============================================================
// Tutto quello che sta qui sotto lavora su un oggetto "stato" e non tocca la
// pagina: le stesse funzioni servono alla partita vera e alle partite
// immaginarie che il computer si gioca in testa per decidere la mossa.

function other(p) { return p === 'you' ? 'pc' : 'you'; }

function newCore(rebello) {
  return {
    deck: [],
    hands: { you: [], pc: [] },
    table: [],
    piles: { you: [], pc: [] },
    scope: { you: 0, pc: 0 },
    last: null,          // chi ha fatto l'ultima presa
    rebello: !!rebello,
  };
}
function cloneCore(st) {
  return {
    deck: st.deck.slice(),
    hands: { you: st.hands.you.slice(), pc: st.hands.pc.slice() },
    table: st.table.slice(),
    piles: { you: st.piles.you.slice(), pc: st.piles.pc.slice() },
    scope: { you: st.scope.you, pc: st.scope.pc },
    last: st.last,
    rebello: st.rebello,
  };
}

// Le prese possibili con una carta di valore `v`. La regola che conta è questa:
// se sul tavolo c'è una carta di pari valore, si prende quella e basta — la
// somma di più carte non è nemmeno un'opzione.
function captureOptions(v, table) {
  const exact = [];
  for (let i = 0; i < table.length; i++) if (cardVal(table[i]) === v) exact.push([i]);
  if (exact.length) return exact;

  // le combinazioni che sommano a v: solo carte più piccole, e la somma cresce
  // sempre, quindi la ricerca si taglia da sola appena sfora
  const usable = [];
  for (let i = 0; i < table.length; i++) if (cardVal(table[i]) < v) usable.push(i);
  const out = [];
  const acc = [];
  (function dfs(start, sum) {
    if (sum === v) { if (acc.length >= 2) out.push(acc.slice()); return; }
    if (sum > v) return;
    for (let k = start; k < usable.length; k++) {
      acc.push(usable[k]);
      dfs(k + 1, sum + cardVal(table[usable[k]]));
      acc.pop();
    }
  })(0, 0);
  return out;
}

// Tutte le giocate legali di un giocatore: ogni carta della mano con ognuna
// delle sue prese possibili, oppure la carta da buttare se non prende niente.
function legalPlays(st, player) {
  const out = [];
  for (const card of st.hands[player]) {
    const opts = captureOptions(cardVal(card), st.table);
    if (opts.length) for (const o of opts) out.push({ card, take: o });
    else out.push({ card, take: null });
  }
  return out;
}

// L'ultima carta della mano non fa scopa: il tavolo si sarebbe svuotato
// comunque, quindi non c'è nessun merito.
function isLastCardOfHand(st, player) {
  return st.deck.length === 0 &&
    st.hands[player].length === 1 &&
    st.hands[other(player)].length === 0;
}

function applyPlay(st, player, play) {
  const lastCard = isLastCardOfHand(st, player);
  const hand = st.hands[player];
  hand.splice(hand.indexOf(play.card), 1);

  if (!play.take) { st.table.push(play.card); return { scopa: false, taken: [] }; }

  const taken = play.take.map(i => st.table[i]);
  const idx = play.take.slice().sort((a, b) => b - a);
  for (const i of idx) st.table.splice(i, 1);
  st.piles[player].push(play.card, ...taken);
  st.last = player;

  const scopa = st.table.length === 0 && !lastCard;
  if (scopa) st.scope[player] += 1;
  return { scopa, taken };
}

function needsDeal(st) { return st.hands.you.length === 0 && st.hands.pc.length === 0 && st.deck.length > 0; }
function dealThree(st) {
  st.hands.pc = st.deck.splice(0, 3);
  st.hands.you = st.deck.splice(0, 3);
}
function handIsOver(st) {
  return st.deck.length === 0 && st.hands.you.length === 0 && st.hands.pc.length === 0;
}
// Le carte rimaste sul tavolo vanno all'ultimo che ha preso.
function sweepLeftovers(st) {
  if (!st.table.length || !st.last) return [];
  const left = st.table.slice();
  st.piles[st.last].push(...left);
  st.table = [];
  return left;
}

function countSuit(pile, suit) {
  let n = 0;
  for (const c of pile) if (cardSuit(c) === suit) n++;
  return n;
}
function primiera(pile) {
  const best = { d: 0, c: 0, s: 0, b: 0 };
  for (const c of pile) {
    const p = PRIMIERA[cardVal(c)];
    if (p > best[cardSuit(c)]) best[cardSuit(c)] = p;
  }
  return best.d + best.c + best.s + best.b;
}

// Il conto della mano. Ogni voce dice quanto vale per uno e per l'altro e chi
// si prende il punto; a parità il punto non lo prende nessuno.
function handPoints(st) {
  const rows = [];
  const add = (key, a, b, winner, fmt) => rows.push({ key, you: a, pc: b, winner, fmt });

  const cy = st.piles.you.length, cp = st.piles.pc.length;
  add('rowCards', cy, cp, cy > cp ? 'you' : (cp > cy ? 'pc' : null), 'num');

  const dy = countSuit(st.piles.you, 'd'), dp = countSuit(st.piles.pc, 'd');
  add('rowDenari', dy, dp, dy > dp ? 'you' : (dp > dy ? 'pc' : null), 'num');

  const sy = st.piles.you.indexOf('d7') !== -1;
  add('rowSettebello', sy ? 1 : 0, sy ? 0 : 1, sy ? 'you' : 'pc', 'yes');

  if (st.rebello) {
    const ry = st.piles.you.indexOf('d10') !== -1;
    add('rowRebello', ry ? 1 : 0, ry ? 0 : 1, ry ? 'you' : 'pc', 'yes');
  }

  const py = primiera(st.piles.you), pp = primiera(st.piles.pc);
  add('rowPrimiera', py, pp, py > pp ? 'you' : (pp > py ? 'pc' : null), 'num');

  const total = { you: 0, pc: 0 };
  for (const r of rows) if (r.winner) total[r.winner] += 1;
  total.you += st.scope.you;
  total.pc += st.scope.pc;
  rows.push({ key: 'rowScope', you: st.scope.you, pc: st.scope.pc, winner: null, fmt: 'num' });

  return { rows, total };
}

// ============================================================
//  IL COMPUTER (TheCreator)
// ============================================================
// Non sbircia mai le carte dell'avversario: quello che sa è quello che ha
// visto, cioè la propria mano, il tavolo e tutte le carte già prese — che sono
// passate scoperte sul tavolo davanti a tutti e due. Le tre carte in mano
// all'altro e l'ordine del mazzo restano ignoti, e al livello Master vengono
// sorteggiati tante volte, giocando ogni volta la mano fino in fondo.

// Quanto vale una carta da avere nel mazzetto: una carta qualsiasi conta uno
// (per il punto delle carte), i denari valgono di più, i sette e i sei fanno
// la primiera, e il settebello vale da solo un punto intero.
function cardWorth(id, rebello) {
  let w = 1;
  const v = cardVal(id);
  if (cardSuit(id) === 'd') w += 4;
  if (v === 7) w += 5;
  else if (v === 6) w += 3;
  else if (v === 1) w += 2;
  if (id === 'd7') w += 22;
  if (rebello && id === 'd10') w += 8;
  return w;
}

// Il giudizio "a occhio" su una giocata: quanto porta a casa adesso, meno il
// pericolo di quello che lascia sul tavolo. È il livello Normale, ed è anche
// il modo di giocare delle partite immaginarie del livello Master.
function greedyScore(st, play, player) {
  let s = 0;
  const tableAfter = st.table.slice();

  if (play.take) {
    s += cardWorth(play.card, st.rebello);
    for (const i of play.take) s += cardWorth(st.table[i], st.rebello);
    const idx = play.take.slice().sort((a, b) => b - a);
    for (const i of idx) tableAfter.splice(i, 1);
    if (tableAfter.length === 0 && !isLastCardOfHand(st, player)) s += 30;
  } else {
    // buttare una carta buona è un regalo: pesa quanto vale
    s -= cardWorth(play.card, st.rebello) * 0.6;
    tableAfter.push(play.card);
  }

  // quello che resta sul tavolo è a portata dell'avversario
  let sum = 0;
  for (const c of tableAfter) { sum += cardVal(c); s -= cardWorth(c, st.rebello) * 0.34; }
  // un tavolo che sta dentro il dieci si può spazzare via con una carta sola
  if (tableAfter.length > 0 && sum <= 10) s -= 24;
  return s;
}

function bestGreedy(st, player) {
  const plays = legalPlays(st, player);
  let best = null, bestScore = -Infinity;
  for (const p of plays) {
    const v = greedyScore(st, p, player);
    if (v > bestScore) { bestScore = v; best = p; }
  }
  return best;
}

// Le carte che il computer non ha ancora visto: sono quelle in mano
// all'avversario più quelle che restano nel mazzo, mescolate insieme.
function unseenFrom(st, me) {
  const known = new Set();
  for (const c of st.hands[me]) known.add(c);
  for (const c of st.table) known.add(c);
  for (const c of st.piles.you) known.add(c);
  for (const c of st.piles.pc) known.add(c);
  return ALL_CARDS.filter(c => !known.has(c));
}

// Si gioca la mano fino in fondo, tutti e due "a occhio", e si guarda com'è
// finita: è il modo di dire se una presa piccola adesso vale più di una grossa
// che lascia il settebello sul tavolo.
function playout(st, turn) {
  let guard = 0;
  while (guard++ < 60) {
    if (st.hands.you.length === 0 && st.hands.pc.length === 0) {
      if (st.deck.length === 0) break;
      dealThree(st);
    }
    const play = bestGreedy(st, turn);
    if (!play) break;
    applyPlay(st, turn, play);
    turn = other(turn);
  }
  sweepLeftovers(st);
  const pts = handPoints(st);
  return pts.total;
}

const DIFFICULTIES = {
  stupido: { kind: 'random' },
  normale: { kind: 'greedy' },
  master: { kind: 'search', samples: 40, budgetMs: 260 },
};

function chooseAiPlay(st, me, difficulty) {
  const conf = DIFFICULTIES[difficulty] || DIFFICULTIES.normale;
  const plays = legalPlays(st, me);
  if (!plays.length) return null;
  if (plays.length === 1) return plays[0];

  if (conf.kind === 'random') return plays[Math.floor(Math.random() * plays.length)];
  if (conf.kind === 'greedy') return bestGreedy(st, me);

  // Master: si sorteggia più volte una mano possibile per l'avversario e un
  // ordine possibile del mazzo, e per ognuno si prova ogni giocata fino alla
  // fine della mano. Vince la giocata che in media chiude meglio.
  const unseen = unseenFrom(st, me);
  const oppSize = st.hands[other(me)].length;
  const totals = new Array(plays.length).fill(0);
  const deadline = performance.now() + conf.budgetMs;
  let samples = 0;
  while (samples < conf.samples) {
    const bag = shuffle(unseen.slice());
    for (let i = 0; i < plays.length; i++) {
      const sim = cloneCore(st);
      sim.hands[other(me)] = bag.slice(0, oppSize);
      sim.deck = bag.slice(oppSize);
      applyPlay(sim, me, plays[i]);
      const res = playout(sim, other(me));
      totals[i] += res[me] - res[other(me)];
    }
    samples++;
    if (performance.now() > deadline) break;
  }
  let best = 0;
  for (let i = 1; i < plays.length; i++) if (totals[i] > totals[best]) best = i;
  return plays[best];
}

// ============================================================
//  STATO DELLA PARTITA
// ============================================================
const OPT_REBELLO = 'scopa-rebello';
const OPT_COUNTER = 'scopa-counter';
const TARGET = 11;

const options = { rebello: false, counter: false };
function loadOptions() {
  try {
    options.rebello = localStorage.getItem(OPT_REBELLO) === '1';
    options.counter = localStorage.getItem(OPT_COUNTER) === '1';
  } catch (e) { /* ignora */ }
}
function saveOptions() {
  try {
    localStorage.setItem(OPT_REBELLO, options.rebello ? '1' : '0');
    localStorage.setItem(OPT_COUNTER, options.counter ? '1' : '0');
  } catch (e) { /* ignora */ }
}

let game = null;          // il "core" più i dati della partita
const ui = {
  started: false,
  over: false,
  busy: false,
  selected: null,         // carta scelta dalla mano
  selOptions: [],         // prese possibili con quella carta
  flying: [],             // carte che in questo momento stanno volando: si
                          // disegnano al loro posto ma invisibili, e volano le
                          // loro copie (così niente si riordina a mezz'aria)
  choiceOpen: false,      // il pannello delle prese è aperto sul panno
  choiceCard: null,       // carta lasciata sul tavolo, in attesa della scelta
  choiceOpts: [],
  choiceFrom: null,       // da dove ripartirà l'animazione dopo la scelta
  rulesFromSettings: false,
  pendingConfirm: null,
  pendingDifficulty: null,
};

function newGame(difficulty) {
  game = newCore(options.rebello);
  game.difficulty = difficulty;
  game.score = { you: 0, pc: 0 };
  game.dealer = Math.random() < 0.5 ? 'you' : 'pc';
  game.turn = other(game.dealer);
  game.handNo = 1;
  startHand();
}

// Il mazziere dà quattro carte sul tavolo e tre a testa. Comincia chi non dà.
function startHand() {
  game.deck = shuffle(ALL_CARDS.slice());
  game.table = game.deck.splice(0, 4);
  game.hands.pc = game.deck.splice(0, 3);
  game.hands.you = game.deck.splice(0, 3);
  game.piles = { you: [], pc: [] };
  game.scope = { you: 0, pc: 0 };
  game.last = null;
  game.rebello = options.rebello;
  game.turn = other(game.dealer);
  ui.selected = null;
  ui.selOptions = [];
  ui.flying = [];
  closeChoice();
  ui.over = false;
  ui.started = true;
  ui.busy = false;
  // si salva all'inizio della mano, mai durante il caricamento
  saveGame();
}

// ============================================================
//  DISEGNO
// ============================================================
function playerName(who) {
  if (who === 'pc') return t().creatorName;
  const auth = window.FFR && window.FFR.auth;
  const nick = auth ? auth.getNickname() : null;
  return nick || t().you;
}

// La misura delle carte si prende dallo spazio che resta davvero: si misurano
// le due targhe e le due strisce, si toglie quello che serve al panno, e
// quello che avanza lo si divide fra le due mani. Niente percentuali scelte a
// occhio: su un telefono basso le carte rimpiccioliscono da sole.
function layout() {
  if (!els.gameZone.clientHeight) return;
  const cs = getComputedStyle(els.gameZone);
  const W = els.gameZone.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const H = els.gameZone.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);

  const fixed = els.plateTop.offsetHeight + els.plateBottom.offsetHeight +
    els.counterStrip.offsetHeight + 34;
  // il panno è la parte che conta: gli si tiene da parte lo spazio per due file
  // di carte prima di dire quanto possono essere grandi quelle in mano
  const minFelt = 150;
  const byWidth = (W - 2 * 8) / 3;
  // la mia mano è alta una carta e mezza, quella coperta poco più di mezza:
  // le carte dell'avversario sono solo dorsi, non c'è niente da leggerci
  const byHeight = (H - fixed - minFelt) / 2.325;
  const hw = Math.max(30, Math.min(92, Math.floor(Math.min(byWidth, byHeight))));
  const tw = Math.max(22, Math.round(hw * 0.55));
  els.handBottom.style.setProperty('--cw', hw + 'px');
  els.handBottom.style.setProperty('--hand-cw', hw + 'px');
  els.handTop.style.setProperty('--cw', tw + 'px');
  els.handTop.style.setProperty('--hand-cw', tw + 'px');
  fitTable(hw);
}

// Le carte sul tavolo possono essere tante: si cerca la misura più grande con
// cui ci stanno tutte dentro al panno, senza traboccare e senza scorrere.
function fitTable(maxW) {
  const n = game ? game.table.length : 4;
  const fw = els.felt.clientWidth - 16;
  const fh = els.felt.clientHeight - 16;
  if (fw <= 0 || fh <= 0) return;
  const gap = 6;
  let best = 24;
  for (let w = Math.floor(maxW); w >= 24; w--) {
    const perRow = Math.max(1, Math.floor((fw + gap) / (w + gap)));
    const rows = Math.ceil(Math.max(n, 1) / perRow);
    if (rows * (w * 1.5 + gap) - gap <= fh) { best = w; break; }
  }
  els.tableCards.style.setProperty('--cw', best + 'px');
}

function renderPlates() {
  els.plateTopName.textContent = playerName('pc');
  els.plateBottomName.textContent = playerName('you');
  if (!game) return;
  els.topCards.textContent = String(game.piles.pc.length);
  els.topScope.textContent = String(game.scope.pc);
  els.topPoints.textContent = String(game.score.pc);
  els.botCards.textContent = String(game.piles.you.length);
  els.botScope.textContent = String(game.scope.you);
  els.botPoints.textContent = String(game.score.you);
  const live = ui.started && !ui.over;
  els.plateTop.classList.toggle('is-turn', live && game.turn === 'pc');
  els.plateBottom.classList.toggle('is-turn', live && game.turn === 'you');
}

function renderTurnPill() {
  els.turnPill.classList.remove('hot');
  if (!ui.started || ui.over || !game) { els.turnPill.textContent = '—'; return; }
  if (game.turn === 'pc') {
    els.turnPill.textContent = t().thinking;
    els.turnPill.classList.add('hot');
    return;
  }
  if (ui.choiceOpen) {
    els.turnPill.textContent = t().chooseTake;
    els.turnPill.classList.add('hot');
    return;
  }
  els.turnPill.textContent = t().yourTurn;
}

function renderTable() {
  if (!game) return;
  // le carte che la carta scelta può prendere si illuminano; le altre si
  // spengono un po', così si legge subito cosa c'entra e cosa no
  const inPlay = new Set();
  for (const opt of ui.selOptions) for (const i of opt) inPlay.add(i);
  const html = game.table.map((c, i) => {
    let extra = '';
    if (ui.selected) extra = inPlay.has(i) ? 'take' : 'dim';
    if (ui.flying.indexOf(c) !== -1) extra += ' ghost';
    return cardHtml(c, extra.trim());
  }).join('');
  els.tableCards.innerHTML = html;
  els.deckCount.textContent = String(game.deck.length);
  els.deckStack.classList.toggle('empty', game.deck.length === 0);
}

function renderHands() {
  if (!game) return;
  els.handTop.innerHTML = game.hands.pc.map(() => backHtml()).join('');
  const yourTurn = ui.started && !ui.over && game.turn === 'you' && !ui.busy;
  els.handBottom.innerHTML = game.hands.you.map(c => {
    let extra = yourTurn ? 'playable' : '';
    if (c === ui.selected) extra += ' selected';
    if (drag.active && c === drag.card) extra += ' dragging';
    if (ui.flying.indexOf(c) !== -1) extra += ' ghost';
    return cardHtml(c, extra.trim());
  }).join('');
}

// Le prese possibili, una accanto all'altra sopra al panno, con le carte vere:
// è così che si impara che il 7 può prendere il 4+3 oppure il 5+2.
function renderChoice() {
  if (!ui.choiceOpen || !game) { els.choicePanel.hidden = true; return; }
  els.choiceList.innerHTML = ui.choiceOpts.map((opt, i) =>
    '<button class="choice-opt" data-opt="' + i + '">' +
    opt.map(k => cardHtml(game.table[k])).join('<span class="plus">+</span>') +
    '</button>'
  ).join('');
  els.choicePanel.hidden = false;
  // Le carte della scelta si rimpiccioliscono finché tutto ci sta dentro al
  // panno: su un telefono basso, con quattro prese possibili, a misura piena il
  // pulsante "annulla" finiva sotto al bordo e bisognava scorrere per trovarlo.
  for (let w = 34; w >= 18; w -= 4) {
    els.choicePanel.style.setProperty('--choice-cw', w + 'px');
    if (els.choicePanel.scrollHeight <= els.choicePanel.clientHeight) break;
  }
}

// Le carte non ancora uscite, valore per valore: aiuto facoltativo, si accende
// dalle impostazioni ed è spento di partenza.
function renderCounter() {
  els.counterStrip.hidden = !options.counter;
  if (!options.counter || !game) return;
  const seen = new Set([...game.hands.you, ...game.table, ...game.piles.you, ...game.piles.pc]);
  const left = new Array(11).fill(0);
  for (const c of ALL_CARDS) if (!seen.has(c)) left[cardVal(c)]++;
  let html = '';
  for (let v = 1; v <= 10; v++) {
    html += '<span class="counter-cell' + (left[v] === 0 ? ' gone' : '') + '"><b>' + v + '</b><span>' + left[v] + '</span></span>';
  }
  els.counterStrip.innerHTML = html;
}

function render() {
  renderPlates();
  renderTurnPill();
  renderTable();
  renderHands();
  renderCounter();
  renderChoice();
  layout();
}

function flash(text) {
  els.flash.textContent = text;
  els.flash.classList.remove('show');
  void els.flash.offsetWidth;      // riavvia l'animazione
  els.flash.classList.add('show');
}

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

// ============================================================
//  LE CARTE CHE SI MUOVONO
// ============================================================
// Una carta non appare e non sparisce mai sul posto: parte da dove sta e
// arriva dove va, e nel frattempo la carta vera resta ferma e invisibile al
// suo posto. Quello che si vede viaggiare è una copia appoggiata sopra alla
// pagina: così il tavolo non si riordina a metà movimento.

function reducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function boxOf(el) {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

// il mazzetto delle carte prese: il numero sulla targa, quello che sta per
// crescere. È lì che le carte prese devono andare a finire.
function pileBox(player) {
  const el = player === 'you' ? els.botCards : els.topCards;
  const r = el.getBoundingClientRect();
  const w = 24;
  return { left: r.left + r.width / 2 - w / 2, top: r.top + r.height / 2 - w * 0.75, width: w, height: w * 1.5 };
}

// se il tavolo è vuoto non c'è nessuna carta a cui puntare: si punta al centro
function feltBox(width) {
  const r = els.felt.getBoundingClientRect();
  return { left: r.left + r.width / 2 - width / 2, top: r.top + r.height / 2 - width * 0.75, width: width, height: width * 1.5 };
}

function makeFlyer(cardId, from, reveal) {
  const el = document.createElement('div');
  el.className = 'flyer' + (reveal ? ' reveal' : '');
  el.style.setProperty('--cw', from.width + 'px');
  el.style.left = from.left + 'px';
  el.style.top = from.top + 'px';
  el.innerHTML = '<div class="flyer-inner">' + cardHtml(cardId) + '</div>';
  document.body.appendChild(el);
  void el.offsetWidth;             // il punto di partenza va "fissato" prima
  return el;
}

// muove una copia da `from` a `to`: la copia resta ancorata al punto di
// partenza e ci si sposta sopra, così un secondo viaggio riparte da dove il
// primo si è fermato senza saltare
function flyTo(el, from, to, ms, fade) {
  const scale = to.width / from.width;
  el.style.transition = 'transform ' + ms + 'ms cubic-bezier(0.25, 0.7, 0.35, 1)' +
    (fade ? ', opacity ' + ms + 'ms ease-in' : '');
  el.style.transform = 'translate(' + (to.left - from.left) + 'px, ' + (to.top - from.top) + 'px) scale(' + scale + ')';
  if (fade) el.style.opacity = '0.15';
}

// ============================================================
//  IL GIRO DI GIOCO
// ============================================================
function setSelection(card) {
  ui.selected = card;
  ui.selOptions = card ? captureOptions(cardVal(card), game.table) : [];
  render();
}
function selectCard(card) {
  setSelection(ui.selected === card ? null : card);
}

function handCardEl(player, card) {
  if (player === 'you') return els.handBottom.querySelector('[data-card="' + card + '"]');
  return els.handTop.firstElementChild;
}

// Una carta lasciata sul tavolo: se prende in un modo solo si prende e basta,
// se non prende niente resta lì, e solo quando i modi sono più d'uno si sceglie.
function resolvePlay(card, fromBox) {
  if (!canPlayNow() || game.hands.you.indexOf(card) === -1) return;
  const opts = captureOptions(cardVal(card), game.table);
  if (opts.length > 1) { openChoice(card, opts, fromBox); return; }
  doPlay('you', { card: card, take: opts.length ? opts[0] : null }, fromBox);
}

function openChoice(card, opts, fromBox) {
  ui.choiceOpen = true;
  ui.choiceCard = card;
  ui.choiceOpts = opts;
  ui.choiceFrom = fromBox || null;
  ui.selected = card;
  ui.selOptions = opts;
  render();
}
function closeChoice() {
  ui.choiceOpen = false;
  ui.choiceCard = null;
  ui.choiceOpts = [];
  ui.choiceFrom = null;
  els.choicePanel.hidden = true;
}

// Il viaggio di una giocata, uguale per te e per il computer:
// - la carta parte dalla mano e scende sul tavolo;
// - se prende, si porta via le carte prese verso il mazzetto;
// - se non prende, resta dov'è arrivata.
async function doPlay(player, play, fromBox) {
  ui.busy = true;
  closeChoice();
  ui.selected = null;
  ui.selOptions = [];
  // la mano si ridisegna subito, non dopo l'animazione: altrimenti per un
  // attimo le carte sembrano ancora da toccare mentre il tocco è già chiuso
  renderHands();

  const slow = !reducedMotion();
  const srcEl = handCardEl(player, play.card);
  const from = fromBox || (srcEl ? boxOf(srcEl) : feltBox(60));
  ui.flying = [play.card];
  if (srcEl) srcEl.classList.add('ghost');

  let res;
  if (play.take) {
    // dove sono adesso le carte che sta per prendere, prima che il tavolo cambi
    const takeEls = [];
    const takenIds = [];
    for (const i of play.take) {
      const el = els.tableCards.children[i];
      if (el) { takeEls.push(el); takenIds.push(game.table[i]); }
    }
    const takeBoxes = takeEls.map(boxOf);
    const landing = takeBoxes[0] || feltBox(from.width);
    ui.flying = [play.card].concat(takenIds);

    // 1. la carta scende sul tavolo, sopra la prima carta che prende
    const played = makeFlyer(play.card, from, player === 'pc');
    flyTo(played, from, landing, slow ? 300 : 0);
    if (slow) await wait(300);

    // 2. la carta giocata e quelle prese se ne vanno insieme nel mazzetto
    for (const el of takeEls) el.classList.add('ghost');
    const dest = pileBox(player);
    const others = takeBoxes.map((b, k) => makeFlyer(takenIds[k], b, false));
    flyTo(played, from, dest, slow ? 340 : 0, true);
    others.forEach((el, k) => flyTo(el, takeBoxes[k], dest, slow ? 340 : 0, true));
    if (slow) await wait(340);
    for (const el of others) el.remove();
    played.remove();

    res = applyPlay(game, player, play);
    ui.flying = [];
    render();
  } else {
    // la carta resta sul tavolo: si mette subito al suo posto — invisibile —
    // e la copia ci vola sopra, così atterra proprio dove starà
    res = applyPlay(game, player, play);
    render();
    const destEl = els.tableCards.querySelector('[data-card="' + play.card + '"]');
    const dest = destEl ? boxOf(destEl) : feltBox(from.width);
    const played = makeFlyer(play.card, from, player === 'pc');
    flyTo(played, from, dest, slow ? 300 : 0);
    if (slow) await wait(300);
    played.remove();
    ui.flying = [];
    renderTable();
    renderHands();
  }

  if (res.scopa) { flash(t().scopaFlash); await wait(700); }
  else if (slow) await wait(160);

  ui.busy = false;
  afterPlay(player);
}

// ============================================================
//  IL TRASCINAMENTO
// ============================================================
// Si gioca prendendo la carta col dito (o col mouse) e portandola sul panno.
// Chi preferisce toccare può ancora farlo: un tocco senza spostamento sceglie
// la carta, e un tocco sul panno la gioca. Un modo solo di scrivere le regole,
// due modi di usarle.
const drag = {
  card: null,
  active: false,
  pointerId: null,
  startX: 0, startY: 0,
  grabX: 0, grabY: 0,
  lift: 0,
  ghost: null,
  blockClickUntil: 0,
};

function canPlayNow() {
  return ui.started && !ui.over && !ui.busy && !ui.choiceOpen && game && game.turn === 'you';
}

function onHandDown(e) {
  if (!canPlayNow()) return;
  if (e.button > 0) return;
  if (drag.card) return;           // un dito alla volta: il secondo si ignora
  const el = e.target.closest('.pcard');
  if (!el || !el.dataset.card) return;
  drag.card = el.dataset.card;
  drag.active = false;
  drag.pointerId = e.pointerId;
  drag.startX = e.clientX;
  drag.startY = e.clientY;
  const r = el.getBoundingClientRect();
  drag.grabX = e.clientX - r.left;
  drag.grabY = e.clientY - r.top;
  drag.w = r.width;
  drag.h = r.height;
  // col dito la carta si alza sopra la mano, altrimenti resta nascosta sotto
  drag.lift = e.pointerType === 'touch' ? r.height * 0.55 : 0;
  // La presa del puntatore si tiene sulla mano, non sulla carta: appena si
  // sceglie una carta la mano viene ridisegnata da capo, e col dito la presa
  // starebbe su un elemento che non esiste più — il trascinamento si
  // fermerebbe da solo dopo il primo movimento.
  try { els.handBottom.setPointerCapture(e.pointerId); } catch (err) { /* niente presa, si va lo stesso */ }
}

function startDrag() {
  drag.active = true;
  setSelection(drag.card);          // le prese possibili si illuminano subito
  const g = document.createElement('div');
  g.className = 'drag-ghost';
  g.style.setProperty('--cw', drag.w + 'px');
  g.innerHTML = cardHtml(drag.card);
  document.body.appendChild(g);
  drag.ghost = g;
}

function moveGhost(x, y) {
  if (!drag.ghost) return;
  drag.ghost.style.transform =
    'translate(' + (x - drag.grabX) + 'px, ' + (y - drag.grabY - drag.lift) + 'px)';
}

function overFelt(x, y) {
  const r = els.felt.getBoundingClientRect();
  return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
}

function onHandMove(e) {
  if (!drag.card || drag.pointerId !== e.pointerId) return;
  if (!drag.active) {
    if (Math.abs(e.clientX - drag.startX) + Math.abs(e.clientY - drag.startY) < 8) return;
    startDrag();
  }
  e.preventDefault();
  moveGhost(e.clientX, e.clientY);
  els.felt.classList.toggle('drop-hot', overFelt(e.clientX, e.clientY - drag.lift));
}

function onHandUp(e) {
  if (!drag.card || drag.pointerId !== e.pointerId) return;
  const card = drag.card;
  const wasDragging = drag.active;
  const ghost = drag.ghost;
  releasePointer(e.pointerId);
  els.felt.classList.remove('drop-hot');
  drag.card = null;
  drag.active = false;
  drag.ghost = null;
  drag.pointerId = null;

  // nessuno spostamento: era un tocco, e il tocco sceglie la carta
  if (!wasDragging) { if (card) selectCard(card); return; }

  drag.blockClickUntil = performance.now() + 400;
  if (overFelt(e.clientX, e.clientY - drag.lift)) {
    const box = boxOf(ghost);
    ghost.remove();
    resolvePlay(card, box);
  } else {
    // fuori dal panno non si gioca niente: la carta torna in mano
    returnGhost(ghost, card);
    setSelection(null);
  }
}

function onHandCancel(e) {
  if (!drag.card || drag.pointerId !== e.pointerId) return;
  const ghost = drag.ghost;
  const card = drag.card;
  releasePointer(e.pointerId);
  els.felt.classList.remove('drop-hot');
  drag.card = null; drag.active = false; drag.ghost = null; drag.pointerId = null;
  if (ghost) returnGhost(ghost, card);
  setSelection(null);
}

function releasePointer(id) {
  try { if (els.handBottom.hasPointerCapture(id)) els.handBottom.releasePointerCapture(id); }
  catch (err) { /* il puntatore se n'era già andato */ }
}

// la carta lasciata fuori dal panno non svanisce a mezz'aria: torna al suo
// posto nella mano, e solo allora la carta vera si riaccende
function returnGhost(ghost, card) {
  if (!ghost) return;
  const home = card ? els.handBottom.querySelector('[data-card="' + card + '"]') : null;
  if (!home || reducedMotion()) { ghost.remove(); return; }
  const to = boxOf(home);
  ghost.style.transition = 'transform 0.18s ease-out';
  ghost.style.transform = 'translate(' + to.left + 'px, ' + to.top + 'px)';
  setTimeout(() => ghost.remove(), 200);
}

function afterPlay(player) {
  if (handIsOver(game)) { endHand(); return; }
  if (needsDeal(game)) dealThree(game);
  game.turn = other(player);
  render();
  if (game.turn === 'pc') runAi();
}

function runAi() {
  if (ui.over || game.turn !== 'pc') return;
  ui.busy = true;
  render();
  // il conto del livello Master blocca la pagina per un attimo: prima si lascia
  // ridisegnare l'interfaccia (la scritta "sta pensando…"), poi si pensa
  setTimeout(() => {
    const started = performance.now();
    const play = chooseAiPlay(game, 'pc', game.difficulty);
    if (!play) { ui.busy = false; return; }
    // una risposta immediata sembra una svista: si aspetta comunque un momento
    const pause = Math.max(0, 520 - (performance.now() - started));
    setTimeout(() => { ui.busy = false; doPlay('pc', play); }, pause);
  }, 60);
}

// ---------- fine mano ----------
function endHand() {
  const left = sweepLeftovers(game);
  const pts = handPoints(game);
  game.score.you += pts.total.you;
  game.score.pc += pts.total.pc;
  render();
  showHandEnd(pts, left.length > 0 ? game.last : null);
}

// Il conto della mano: la stessa tabella sia a metà partita sia alla fine.
function handTableHtml(pts) {
  const nameYou = playerName('you');
  const namePc = playerName('pc');
  let html = '<div class="score-head"><span class="label"></span><span class="val">' +
    escapeHtml(nameYou) + '</span><span class="val">' + escapeHtml(namePc) + '</span></div>';
  for (const r of pts.rows) {
    const fmt = (v, side) => {
      if (r.fmt === 'yes') return v ? '✓' : '—';
      return String(v);
    };
    html += '<div class="score-row"><span class="label">' + t()[r.key] + '</span>' +
      '<span class="val' + (r.winner === 'you' ? ' won' : '') + '">' + fmt(r.you) + '</span>' +
      '<span class="val' + (r.winner === 'pc' ? ' won' : '') + '">' + fmt(r.pc) + '</span></div>';
  }
  html += '<div class="score-row total"><span class="label">' + t().rowTotal + '</span>' +
    '<span class="val">' + pts.total.you + '</span><span class="val">' + pts.total.pc + '</span></div>';
  return html;
}

function showHandEnd(pts, lastTaker) {
  const html = handTableHtml(pts);
  const note = lastTaker === 'you' ? t().lastTrickYou : (lastTaker === 'pc' ? t().lastTrickPc : '');
  const line = (note ? note + ' ' : '') + t().matchLine(game.score.you, game.score.pc);

  // si continua finché uno dei due non arriva a 11; a pari punti si gioca
  // un'altra mano, come vuole la regola
  const done = (game.score.you >= TARGET || game.score.pc >= TARGET) && game.score.you !== game.score.pc;
  // all'ultima mano il conto e l'esito stanno nello stesso pannello: prima
  // erano due, e il secondo si apriva su un "continua" che non diceva niente
  // di nuovo — il conto era già lì e la partita era già decisa
  if (done) {
    finishGame(game.score.you > game.score.pc ? 'you' : 'pc', html, line);
    return;
  }
  els.scoreTable.innerHTML = html;
  els.matchLine.textContent = line;
  els.nextHandBtn.textContent = t().nextHand;
  showOnly(els.handEndOverlay);
}

function nextHand() {
  hideAllOverlays();
  game.dealer = other(game.dealer);
  game.handNo += 1;
  startHand();
  render();
  if (game.turn === 'pc') runAi();
}

function setEndIcon(kind) {
  els.endIcon.innerHTML = '<span class="ffr-ico" data-ico="' + kind + '"></span>';
  window.FFR.icons(els.endIcon);
}

// `tableHtml` e `matchLine` sono il conto dell'ultima mano: arrivano da
// showHandEnd e finiscono dentro a questo stesso pannello.
function finishGame(winner, tableHtml, matchLine) {
  ui.over = true;
  ui.busy = false;
  render();
  const diffLabel = t()['diff' + game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)];
  if (winner === 'you') {
    const wins = recordResult('wins');
    setEndIcon('crown');
    els.endTitle.textContent = t().youWin;
    els.endSub.textContent = t().winSub(diffLabel, wins);
  } else {
    recordResult('losses');
    setEndIcon('robot');
    els.endTitle.textContent = t().youLose;
    els.endSub.textContent = t().loseSub(diffLabel);
  }
  els.endScoreTable.innerHTML = tableHtml || '';
  els.endScoreTable.hidden = !tableHtml;
  els.endMatchLine.textContent = matchLine || '';
  els.endMatchLine.hidden = !matchLine;
  saveGame();
  showOnly(els.endOverlay);
}

// ============================================================
//  PROGRESSO E CLASSIFICA
// ============================================================
// In classifica vanno le partite vinte contro il computer, una graduatoria per
// difficoltà (voce 'scopa:<difficoltà>'). Una classifica sola per tutti,
// qualunque lingua si usi, e senza bandiere: la scopa non è un gioco di parole.
const DIFFICULTY_KEYS = ['stupido', 'normale', 'master'];
let stats = emptyStats();
function emptyStats() {
  const s = {};
  for (const k of DIFFICULTY_KEYS) s[k] = { wins: 0, losses: 0 };
  return s;
}
function totalWins() {
  return DIFFICULTY_KEYS.reduce((n, k) => n + stats[k].wins, 0);
}
function recordResult(field) {
  const key = game.difficulty;
  if (!key || !stats[key]) return 0;
  stats[key][field] += 1;
  if (field === 'wins' && window.FFR && window.FFR.auth) {
    window.FFR.auth.saveScore('scopa:' + key, stats[key].wins);
  }
  return stats[key].wins;
}

// Nel salvataggio ci va la partita intera, non solo il punteggio: chiudendo a
// metà mano si riprende esattamente da dov'era, carte in mano comprese.
function serializeGame() {
  if (!game || !ui.started || ui.over) return null;
  return {
    difficulty: game.difficulty,
    deck: game.deck, table: game.table,
    hands: game.hands, piles: game.piles,
    scope: game.scope, score: game.score,
    last: game.last, dealer: game.dealer, turn: game.turn,
    handNo: game.handNo, rebello: game.rebello,
  };
}
function saveGame() {
  if (!(window.FFR && window.FFR.auth)) return;
  window.FFR.auth.saveProgress('scopa', { stats, resume: serializeGame() }, totalWins());
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
  return window.FFR.auth.loadProgress('scopa');
}
function isCardList(a) {
  return Array.isArray(a) && a.every(c => typeof c === 'string' && ALL_CARDS.indexOf(c) !== -1);
}
function restoreGame(saved) {
  const r = saved && saved.resume;
  if (!r || DIFFICULTY_KEYS.indexOf(r.difficulty) === -1) return false;
  if (!r.hands || !r.piles || !r.score || !isCardList(r.deck) || !isCardList(r.table)) return false;
  if (!isCardList(r.hands.you) || !isCardList(r.hands.pc)) return false;
  if (!isCardList(r.piles.you) || !isCardList(r.piles.pc)) return false;

  const g = newCore(!!r.rebello);
  g.deck = r.deck; g.table = r.table;
  g.hands = { you: r.hands.you, pc: r.hands.pc };
  g.piles = { you: r.piles.you, pc: r.piles.pc };
  g.scope = { you: Number(r.scope && r.scope.you) || 0, pc: Number(r.scope && r.scope.pc) || 0 };
  g.score = { you: Number(r.score.you) || 0, pc: Number(r.score.pc) || 0 };
  g.last = (r.last === 'you' || r.last === 'pc') ? r.last : null;
  g.dealer = r.dealer === 'pc' ? 'pc' : 'you';
  g.turn = r.turn === 'pc' ? 'pc' : 'you';
  g.difficulty = r.difficulty;
  g.handNo = Number(r.handNo) || 1;

  // Si può essere usciti mentre era aperto il conto della mano: lì le carte
  // sono finite e i punti sono già stati sommati. Se la partita era decisa non
  // c'è niente da riprendere, altrimenti si riparte dalla mano successiva.
  if (handIsOver(g)) {
    const decided = (g.score.you >= TARGET || g.score.pc >= TARGET) && g.score.you !== g.score.pc;
    if (decided) return false;
    game = g;
    ui.started = true;
    ui.over = false;
    game.dealer = other(game.dealer);
    game.handNo += 1;
    startHand();
    return true;
  }

  game = g;
  ui.started = true;
  ui.over = false;
  return true;
}

let leaderboardDifficulty = 'normale';
function openLeaderboard() {
  els.settingsOverlay.classList.remove('show');
  els.leaderboardOverlay.classList.add('show');
  leaderboardDifficulty = (game && game.difficulty) || 'normale';
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
  const gameKey = 'scopa:' + difficultyKey;
  const [rows, me] = await Promise.all([
    auth ? auth.getLeaderboard(gameKey, 50) : [],
    auth ? auth.getMyRank(gameKey) : null,
  ]);
  if (difficultyKey !== leaderboardDifficulty) return;   // scheda già cambiata
  if (!rows.length) {
    els.leaderboardList.innerHTML = '<div class="leaderboard-empty">' + t().leaderboardEmpty + '</div>';
    return;
  }
  const myNickname = auth ? auth.getNickname() : null;
  els.leaderboardList.innerHTML = buildLeaderboardRows(rows, me, myNickname, n => t().winsShort(n));
}
// Righe della classifica con la regola condivisa del sito: se ne vedono 6 per
// volta e, quando chi guarda è fuori dalle prime 5, la sua riga viene infilata
// come 6ª (evidenziata) così si vede subito senza scorrere.
function buildLeaderboardRows(rows, me, myNickname, formatScore) {
  const row = (pos, nickname, score, isMe) =>
    '<div class="leaderboard-row' + (isMe ? ' is-me' : '') + '">' +
    '<span class="leaderboard-rank">N.' + pos + '</span>' +
    '<span class="leaderboard-name">' + escapeHtml(nickname) + '</span>' +
    '<span class="leaderboard-score">' + formatScore(score) + '</span></div>';
  const html = rows.map((r, i) => row(i + 1, r.nickname, r.score, myNickname && r.nickname === myNickname));
  if (me && me.rank > 5 && myNickname) html.splice(5, 0, row(me.rank, myNickname, me.score, true));
  return html.join('');
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ============================================================
//  TRADUZIONI E PANNELLI
// ============================================================
function applyTranslations() {
  document.documentElement.lang = language;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t()[el.dataset.i18n];
    if (typeof val === 'string') el.textContent = val;
  });
  if (game && game.difficulty) {
    els.tauntLine.textContent = tauntFor(game.difficulty);
    els.difficultyValue.textContent = t()['diff' + game.difficulty.charAt(0).toUpperCase() + game.difficulty.slice(1)];
  }
  render();
}
function tauntFor(diff) { return t()['taunt' + diff.charAt(0).toUpperCase() + diff.slice(1)]; }

function renderLanguageList() {
  els.languageList.innerHTML = Object.entries(LANGUAGES).map(([code, info]) =>
    '<button class="language-option' + (code === language ? ' active' : '') + '" data-lang="' + code + '">' +
    '<span class="ffr-ico language-flag" data-ico="' + info.flag + '"></span>' +
    '<span class="language-name">' + info.label + '</span></button>'
  ).join('');
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

function hideAllOverlays() {
  document.querySelectorAll('.overlay').forEach(el => el.classList.remove('show'));
}
function showOnly(el) {
  hideAllOverlays();
  if (el === els.difficultyOverlay) {
    el.querySelectorAll('.difficulty-option').forEach(btn => {
      btn.classList.toggle('active', game && btn.dataset.difficulty === game.difficulty);
    });
    // "Indietro" ha senso solo se c'è una partita a cui tornare
    els.difficultyBackBtn.hidden = !(ui.started && !ui.over);
  }
  el.classList.add('show');
}

// Una conferma sola per tutto quello che butta via la partita in corso:
// ricominciare, cambiare difficoltà, cambiare le regole del punteggio.
function askConfirm(titleKey, bodyKey, action) {
  els.confirmTitle.textContent = t()[titleKey];
  els.confirmBody.textContent = t()[bodyKey];
  ui.pendingConfirm = action;
  els.confirmOverlay.classList.add('show');
}
function runConfirm() {
  const action = ui.pendingConfirm;
  ui.pendingConfirm = null;
  els.confirmOverlay.classList.remove('show');
  if (action) action();
}

function startWith(difficulty) {
  newGame(difficulty);
  hideAllOverlays();
  applyTranslations();
  render();
  if (game.turn === 'pc') runAi();
}

function updateToggles() {
  els.rebelloToggle.classList.toggle('on', options.rebello);
  els.counterToggle.classList.toggle('on', options.counter);
}

// ============================================================
//  AVVIO
// ============================================================
async function init() {
  language = getSiteLanguage() || 'it';
  loadOptions();
  updateToggles();
  applyTranslations();

  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', () => setTimeout(layout, 250));
  // si salva anche quando la pagina se ne va (schermo spento, cambio scheda):
  // è l'unico momento in cui si è sicuri di non perdere la mano in corso
  document.addEventListener('visibilitychange', () => { if (document.hidden) saveGame(); });

  // la tua mano: si prende una carta e la si porta sul panno. Il movimento e il
  // rilascio si ascoltano sulla finestra, non sulla mano: la carta si trascina
  // via dalla mano, e chi ascolta deve continuare a sentire anche quando il
  // dito è dall'altra parte dello schermo
  els.handBottom.addEventListener('pointerdown', onHandDown);
  window.addEventListener('pointermove', onHandMove, { passive: false });
  window.addEventListener('pointerup', onHandUp);
  window.addEventListener('pointercancel', onHandCancel);
  // il panno: con una carta già scelta col tocco, toccare il tavolo la gioca —
  // esattamente come lasciarcela cadere sopra
  els.felt.addEventListener('click', () => {
    if (!canPlayNow() || !ui.selected) return;
    if (performance.now() < drag.blockClickUntil) return;
    const el = els.handBottom.querySelector('[data-card="' + ui.selected + '"]');
    resolvePlay(ui.selected, el ? boxOf(el) : null);
  });
  // la scelta della presa, quando i modi di prendere sono più d'uno
  els.choiceList.addEventListener('click', (e) => {
    const btn = e.target.closest('.choice-opt');
    if (!btn || !ui.choiceOpen || ui.busy) return;
    const i = +btn.dataset.opt;
    const take = ui.choiceOpts[i];
    const card = ui.choiceCard;
    const from = ui.choiceFrom;
    if (!take) return;
    doPlay('you', { card: card, take: take }, from);
  });
  els.choiceCancelBtn.addEventListener('click', () => {
    closeChoice();
    setSelection(null);
  });

  // istruzioni → difficoltà → sfottò → si gioca
  els.closeRulesBtn.addEventListener('click', () => {
    if (ui.rulesFromSettings) { ui.rulesFromSettings = false; showOnly(els.settingsOverlay); return; }
    if (ui.started && !ui.over) { hideAllOverlays(); if (game.turn === 'pc') runAi(); return; }
    showOnly(els.difficultyOverlay);
  });
  els.difficultyOverlay.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const diff = btn.dataset.difficulty;
      // a partita in corso, cambiare livello vuol dire buttarla via
      if (ui.started && !ui.over && game && diff !== game.difficulty) {
        askConfirm('difficultyChangeTitle', 'difficultyChangeBody', () => startWith(diff));
        return;
      }
      if (ui.started && !ui.over && game && diff === game.difficulty) { hideAllOverlays(); return; }
      ui.pendingDifficulty = diff;
      els.tauntLine.textContent = tauntFor(diff);
      showOnly(els.tauntOverlay);
    });
  });
  els.difficultyBackBtn.addEventListener('click', () => { hideAllOverlays(); });
  els.tauntBackBtn.addEventListener('click', () => showOnly(els.difficultyOverlay));
  els.tauntPlayBtn.addEventListener('click', () => startWith(ui.pendingDifficulty || 'normale'));

  els.restartBtn.addEventListener('click', () => {
    if (!ui.started || ui.over) { showOnly(els.difficultyOverlay); return; }
    askConfirm('restartTitle', 'restartBody', () => startWith(game.difficulty));
  });
  els.confirmNoBtn.addEventListener('click', () => { ui.pendingConfirm = null; els.confirmOverlay.classList.remove('show'); });
  els.confirmYesBtn.addEventListener('click', runConfirm);

  els.nextHandBtn.addEventListener('click', nextHand);
  els.playAgainBtn.addEventListener('click', () => startWith(game.difficulty));
  els.changeDifficultyBtn.addEventListener('click', () => showOnly(els.difficultyOverlay));

  els.settingsBtn.addEventListener('click', () => els.settingsOverlay.classList.add('show'));
  els.closeSettingsBtn.addEventListener('click', () => els.settingsOverlay.classList.remove('show'));
  els.settingsOverlay.addEventListener('click', (e) => {
    if (e.target === els.settingsOverlay) els.settingsOverlay.classList.remove('show');
  });
  // riaperte dal menu, le istruzioni hanno anche la X: al primo avvio no, lì si
  // chiudono con "Ho capito!" ed è l'inizio del giro di scelte
  els.openRulesBtn.addEventListener('click', () => {
    ui.rulesFromSettings = true;
    els.rulesOverlay.classList.remove('x-off');
    showOnly(els.rulesOverlay);
  });
  els.openDifficultyBtn.addEventListener('click', () => showOnly(els.difficultyOverlay));
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

  // il rebello cambia il conto dei punti: a partita in corso si chiede prima
  els.rebelloToggle.addEventListener('click', () => {
    const apply = () => {
      options.rebello = !options.rebello;
      saveOptions();
      updateToggles();
      if (ui.started && !ui.over && game) startWith(game.difficulty);
      els.settingsOverlay.classList.add('show');
    };
    if (ui.started && !ui.over) {
      els.settingsOverlay.classList.remove('show');
      askConfirm('optionChangeTitle', 'optionChangeBody', apply);
      return;
    }
    options.rebello = !options.rebello;
    saveOptions();
    updateToggles();
  });
  els.counterToggle.addEventListener('click', () => {
    options.counter = !options.counter;
    saveOptions();
    updateToggles();
    render();
  });

  // le istruzioni si aprono a ogni avvio, come negli altri giochi del sito
  showOnly(els.rulesOverlay);

  const saved = await loadSaved();
  stats = normalizeStats(saved);
  if (restoreGame(saved)) {
    options.rebello = game.rebello;
    updateToggles();
  }
  applyTranslations();
  render();

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 350);
}
init();
