/* La parte SEO del sito, in tre lingue, con un file solo per pagina.
 *
 * Il problema da risolvere: le pagine sono dodici e la lingua non sta
 * nell'indirizzo, sta in localStorage. Per un motore di ricerca esiste quindi
 * un solo indirizzo per gioco, e di quell'indirizzo può indicizzare una lingua
 * sola — l'italiano. Ricerche in inglese e in francese: niente.
 *
 * La soluzione, senza duplicare i file: la lingua può stare anche
 * nell'indirizzo, come "?lang=en" / "?lang=fr".
 *
 *   freeforreal.app/boing/            → italiano   (e x-default)
 *   freeforreal.app/boing/?lang=en    → inglese
 *   freeforreal.app/boing/?lang=fr    → francese
 *
 * Sono tre indirizzi diversi per Google, che li lega fra loro con i tag
 * <link rel="alternate" hreflang="..."> scritti in ogni pagina. Il file HTML
 * però resta uno: titolo e descrizione li riscrive questo script, e Google il
 * JavaScript lo esegue.
 *
 * Cosa fa, in ordine:
 *   1. se l'indirizzo ha ?lang=xx, quella diventa la lingua del sito (scritta
 *      in localStorage come una scelta qualsiasi, così vale anche per le altre
 *      pagine e non fa comparire la domanda della prima visita);
 *   2. mette titolo, descrizione e dati strutturati nella lingua giusta;
 *   3. sistema canonical e og:url in base all'indirizzo davvero aperto.
 *
 * Le stringhe italiane NON stanno qui: stanno scritte per esteso nell'HTML di
 * ogni pagina, che è quello che vede chi non esegue il JavaScript (i programmi
 * che disegnano l'anteprima dei link su WhatsApp, Telegram, Facebook e X non lo
 * eseguono: l'anteprima è sempre quella italiana, e va bene così — è la
 * lingua di partenza del sito). Qui ci sono solo inglese e francese; l'italiano
 * viene ripreso da com'era la pagina all'apertura.
 *
 * Da tenere a mente: le descrizioni non nominano mai un gioco esistente, come
 * da regola del sito. Le uniche parole "da ricerca" usate sono quelle che non
 * sono di nessuno (dama, mattoncini, parole nascoste, somme incrociate) più
 * 2048, che è open source.
 *
 * ============================================================================
 * QUANDO SI AGGIUNGE UN GIOCO NUOVO — questi sette punti valgono sempre.
 * Un gioco che non li ha su Google non esiste, e condividendone il link non
 * si vede niente. Fanno parte del "finito", come le istruzioni e la classifica.
 *
 *  1. Titolo e descrizione in italiano, dentro la <head> del gioco:
 *     <title> (nome — cosa si fa | Free For Real) e <meta name="description">
 *     di 150-160 caratteri. Copiare il blocco da una pagina che c'è già.
 *  2. Inglese e francese qui dentro, nella tabella TEXT, con la stessa chiave
 *     usata in data-page.
 *  3. Nella <head>: canonical, i quattro hreflang (it, en, fr, x-default),
 *     Open Graph, Twitter Card, i dati strutturati (@type VideoGame) e
 *     <script src="../shared/seo.js" data-page="LACHIAVE"></script>.
 *  4. L'immagine di condivisione: 1200x630 in icons/og/LACHIAVE.png, con la
 *     tessera del gioco, la sua tinta e il suo carattere. Dentro non ci va
 *     testo tradotto, così la stessa immagine vale per tutte e tre le lingue.
 *  5. Tre righe nuove in sitemap.xml (la pagina, ?lang=en, ?lang=fr), ognuna
 *     con i suoi quattro <xhtml:link>.
 *  6. La scheda in home, con la descrizione nelle tre lingue (HOME_STRINGS).
 *  7. Le parole: nessun gioco esistente nominato, mai. Si descrive il
 *     meccanismo, o si usano termini che non sono di nessuno. Se invece il
 *     gioco segue regole rese famose da qualcuno che le ha pubblicate
 *     apertamente, allora quel nome si scrive: nei Credits del README E nelle
 *     istruzioni del gioco, dicendo che il codice qui è nostro e che il grazie
 *     è per aver creato quel gioco (vedi Addy).
 *
 * Il gioco nuovo va anche provato: le pagine si aprono tutte in Firefox
 * headless con un window.onerror, prima di committare. Qui non c'è né build né
 * linter, un errore di sintassi va online in silenzio.
 * ============================================================================
 */
(function () {
  const SITE = 'https://freeforreal.app';
  const LANGS = ['it', 'en', 'fr'];
  const LOCALES = { it: 'it_IT', en: 'en_GB', fr: 'fr_FR' };
  const KEY = 'ffr-language';

  // titolo e descrizione in inglese e francese. L'italiano sta nell'HTML.
  const TEXT = {
    home: {
      en: {
        title: 'Free For Real — twelve free online games, no ads',
        desc: 'Twelve free games to play in your browser, on phone or computer: words, numbers, logic and reflexes. No ads, no payments, and they work offline too.',
      },
      fr: {
        title: 'Free For Real — douze jeux gratuits en ligne, sans publicité',
        desc: "Douze jeux gratuits à ouvrir dans le navigateur, sur téléphone ou ordinateur : mots, nombres, logique et réflexes. Sans publicité, sans paiement, et jouables hors ligne.",
      },
    },
    wordio: {
      en: {
        title: 'Wordio — word game with a wheel of letters | Free For Real',
        desc: 'Spell out every word using the letters on the wheel. In Italian, English and French, with endless new levels. Free, no ads, straight in your browser.',
      },
      fr: {
        title: 'Wordio — jeu de mots avec la roue de lettres | Free For Real',
        desc: 'Compose tous les mots avec les lettres de la roue. En italien, anglais et français, avec des niveaux toujours nouveaux. Gratuit, sans publicité, dans le navigateur.',
      },
    },
    blokko: {
      en: {
        title: 'Blokky — falling blocks game | Free For Real',
        desc: 'Fit the falling blocks together and clear the lines before the stack reaches the top. Free, no ads, plays in the browser on phone and computer.',
      },
      fr: {
        title: 'Blokky — jeu de blocs qui tombent | Free For Real',
        desc: "Emboîte les blocs qui tombent et complète les lignes avant que la pile n'atteigne le haut. Gratuit, sans publicité, dans le navigateur sur téléphone et ordinateur.",
      },
    },
    boing: {
      en: {
        title: 'Boing — brick breaker with ball and paddle | Free For Real',
        desc: 'Bounce the ball off your paddle and clear every brick. Three lives, power-ups and three difficulty levels. Free, no ads, plays in your browser.',
      },
      fr: {
        title: 'Boing — casse-briques avec balle et raquette | Free For Real',
        desc: 'Fais rebondir la balle sur la raquette et casse toutes les briques. Trois vies, des bonus et trois niveaux de difficulté. Gratuit, sans publicité.',
      },
    },
    dama: {
      en: {
        title: 'Dama — free online checkers, solo or two players | Free For Real',
        desc: "Move diagonally and capture all your opponent's pieces. Against the computer at three levels, or two of you on one device. Free, with no ads.",
      },
      fr: {
        title: 'Dama — jeu de dames en ligne gratuit, seul ou à deux | Free For Real',
        desc: "Déplace-toi en diagonale et mange toutes les pièces adverses. Contre l'ordinateur à trois niveaux, ou à deux sur le même appareil. Gratuit, sans publicité.",
      },
    },
    addy: {
      en: {
        title: 'Addy — slide the numbers and reach 2048 | Free For Real',
        desc: 'Slide the tiles and add up matching numbers until you reach 2048. Free, no ads, and your game picks up right where you left it.',
      },
      fr: {
        title: "Addy — fais glisser les nombres jusqu'à 2048 | Free For Real",
        desc: "Fais glisser les tuiles et additionne les nombres identiques jusqu'à 2048. Gratuit, sans publicité, et la partie reprend où tu l'as laissée.",
      },
    },
    sudopoku: {
      en: {
        title: 'Sudopoku — number logic puzzle with the digits 1 to 9 | Free For Real',
        desc: 'Fill the 9×9 grid with the digits 1 to 9, never repeating one in the same row, column or box. Endless fresh puzzles, four difficulty levels, free.',
      },
      fr: {
        title: 'Sudopoku — casse-tête de logique avec les chiffres de 1 à 9 | Free For Real',
        desc: 'Remplis la grille 9×9 avec les chiffres de 1 à 9, sans jamais en répéter un dans la même ligne, colonne ou bloc. Grilles toujours nouvelles, quatre difficultés.',
      },
    },
    kakumal: {
      en: {
        title: 'Kakumal — cross sums, the crossword made of numbers | Free For Real',
        desc: 'Fill each run of squares with digits 1 to 9, never the same one twice, adding up to the total written for it. Single-solution puzzles, four levels, free.',
      },
      fr: {
        title: 'Kakumal — sommes croisées, les mots croisés en chiffres | Free For Real',
        desc: 'Remplis chaque file de cases avec des chiffres de 1 à 9, jamais deux fois le même, pour faire la somme indiquée. Grilles à solution unique, quatre difficultés.',
      },
    },
    cosmy: {
      en: {
        title: 'Cosmy — shoot down the enemies and the bosses of the galaxy | Free For Real',
        desc: 'Fly your ship, shoot down the enemies coming at you, dodge asteroids and mines and beat the ten bosses of the galaxy. 50 levels, free, no ads, straight in your browser.',
      },
      fr: {
        title: 'Cosmy — abats les ennemis et les boss de la galaxie | Free For Real',
        desc: "Pilote ton vaisseau, abats les ennemis qui descendent, esquive astéroïdes et mines et bats les dix boss de la galaxie. 50 niveaux, gratuit, sans publicité, dans le navigateur.",
      },
    },
    scopa: {
      en: {
        title: 'Scopa — the Italian card game, free online | Free For Real',
        desc: 'Capture the cards on the table, clear it for a scopa and race to 11 points. Against the computer at three levels. Free, no ads, straight in your browser.',
      },
      fr: {
        title: 'Scopa — le jeu de cartes italien, gratuit en ligne | Free For Real',
        desc: "Prends les cartes de la table, fais scopa et cours jusqu'à 11 points. Contre l'ordinateur à trois niveaux. Gratuit, sans publicité, dans le navigateur.",
      },
    },
    bilio: {
      en: {
        title: 'Bilio — free online pool, against the computer or two players | Free For Real',
        desc: 'Pull the cue back, pot your stripes or solids and finish on the black. Against the computer at three levels or two players on one device. Free, no ads.',
      },
      fr: {
        title: "Bilio — billard en ligne gratuit, contre l'ordinateur ou à deux | Free For Real",
        desc: "Tire la queue en arrière, rentre tes pleines ou tes rayées et finis sur la noire. Contre l'ordinateur à trois niveaux ou à deux sur le même appareil. Gratuit, sans publicité.",
      },
    },
    tris: {
      en: {
        title: 'Tris — noughts and crosses, free online | Free For Real',
        desc: 'Three marks in a row to win: across, down or diagonally. Against the computer at three levels, or two players on one device. Free, no ads.',
      },
      fr: {
        title: 'Tris — morpion en ligne, gratuit | Free For Real',
        desc: "Trois signes alignés pour gagner : en ligne, en colonne ou en diagonale. Contre l'ordinateur à trois niveaux, ou à deux sur le même appareil. Gratuit, sans publicité.",
      },
    },
    troll: {
      en: {
        title: 'Troll — get the square from point A to point B | Free For Real',
        desc: 'Screens full of invisible traps: take the glowing square from point A to point B. You die, you learn, you try again. Free, no ads, in your browser.',
      },
      fr: {
        title: 'Troll — amène le carré du point A au point B | Free For Real',
        desc: "Des tableaux pleins de pièges invisibles : amène le carré lumineux du point A au point B. Tu meurs, tu apprends, tu recommences. Gratuit, sans publicité.",
      },
    },
    findy: {
      en: {
        title: 'Findy — word search: find the hidden words | Free For Real',
        desc: 'Find the words hidden in the grid of letters, running in every direction. Endless levels in Italian, English or French. Free, with no ads.',
      },
      fr: {
        title: 'Findy — mots mêlés : trouve les mots cachés | Free For Real',
        desc: 'Trouve les mots cachés dans la grille de lettres, dans toutes les directions. Niveaux infinis en italien, anglais ou français. Gratuit, sans publicité.',
      },
    },
  };

  // quale pagina siamo: lo dice l'attributo data-page sul tag <script>
  const self = document.currentScript;
  const page = self && self.dataset.page;
  const text = TEXT[page];
  if (!text) return;

  // il percorso della pagina, senza query e senza index.html
  const path = location.pathname.replace(/index\.html$/, '') || '/';

  function meta(sel) { return document.head.querySelector(sel); }
  function setMeta(sel, value) {
    const el = meta(sel);
    if (el) el.setAttribute('content', value);
  }

  // com'era la pagina all'apertura: è la versione italiana, scritta nell'HTML
  const italian = {
    title: document.title,
    desc: (meta('meta[name="description"]') || {}).content || '',
  };

  function strings(lang) {
    return lang === 'it' ? italian : { title: text[lang].title, desc: text[lang].desc };
  }

  function apply(lang) {
    const s = strings(lang);
    document.title = s.title;
    setMeta('meta[name="description"]', s.desc);
    setMeta('meta[property="og:title"]', s.title);
    setMeta('meta[property="og:description"]', s.desc);
    setMeta('meta[property="og:locale"]', LOCALES[lang]);
    setMeta('meta[name="twitter:title"]', s.title);
    setMeta('meta[name="twitter:description"]', s.desc);

    // i dati strutturati: cambia solo la descrizione e la lingua dichiarata,
    // il nome del gioco è lo stesso in tutte e tre
    const ld = document.getElementById('ld-json');
    if (ld) {
      try {
        const data = JSON.parse(ld.textContent);
        const items = Array.isArray(data['@graph']) ? data['@graph'] : [data];
        items.forEach(item => {
          if (item.description) item.description = s.desc;
          if (item.inLanguage) item.inLanguage = lang;
        });
        ld.textContent = JSON.stringify(data);
      } catch (e) { /* se non si legge, si lascia com'è */ }
    }
  }

  // canonical e og:url devono dire l'indirizzo VERO che si sta guardando —
  // quello con ?lang=xx se c'è — non la lingua che si vede a schermo, che
  // dipende da localStorage e che un motore di ricerca non ha.
  const params = new URLSearchParams(location.search);
  let urlLang = params.get('lang');
  if (LANGS.indexOf(urlLang) === -1) urlLang = null;
  const canonical = SITE + path + (urlLang && urlLang !== 'it' ? '?lang=' + urlLang : '');
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl) canonicalEl.setAttribute('href', canonical);
  setMeta('meta[property="og:url"]', canonical);

  // la lingua da mostrare: comanda l'indirizzo, se lo dice; altrimenti la
  // scelta salvata; altrimenti l'italiano, che è la lingua di partenza.
  let lang = urlLang;
  if (lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* ignora */ }
  } else {
    try {
      const saved = localStorage.getItem(KEY);
      if (LANGS.indexOf(saved) !== -1) lang = saved;
    } catch (e) { /* ignora */ }
  }
  apply(lang || 'it');

  // Da qui in poi la pagina va per conto suo: la home e ogni gioco, quando
  // cambiano lingua, scrivono la lingua nuova su <html lang="..">. Stando a
  // guardare quell'attributo, titolo e descrizione seguono senza che nessuno
  // dei file debba chiamare niente.
  // (In Wordio e in Findy quell'attributo è la lingua delle PAROLE, che è anche
  // quella di tutto il resto della pagina: è comunque la risposta giusta.)
  new MutationObserver(() => {
    const l = document.documentElement.lang;
    if (LANGS.indexOf(l) !== -1) apply(l);
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
})();
