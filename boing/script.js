/* ============ BOING — motore di gioco ============ */

// ---------- Lingua condivisa con tutto il sito ----------
// A differenza di Wordio, qui la lingua cambia SOLO il testo dell'interfaccia:
// non esiste un dizionario, quindi non c'è nessun progresso da ricominciare o
// riprendere in base alla lingua.
const LANGUAGES = {
  it: { label: 'Italiano', flag: 'flag-it' },
  en: { label: 'English', flag: 'flag-en' },
  fr: { label: 'Français', flag: 'flag-fr' },
};
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    backToHome: 'Torna in Home',
    tapToLaunch: 'Tocca per lanciare la pallina',
    chooseDifficulty: 'Scegli la difficoltà',
    chooseDifficultySub: 'Puoi cambiarla ogni volta che inizi una partita',
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Difficile',
    levelComplete: 'Livello Completato!',
    levelCompleteSub: score => `Punteggio: ${score}`,
    continueBtn: 'Continua',
    gameOver: 'Game Over',
    gameOverSub: (level, score) => `LV. ${level} — Punteggio: ${score}`,
    playAgain: 'Rigioca',
    paused: 'Pausa',
    resume: 'Riprendi',
    difficultyLabel: 'Difficoltà',
    settingsTitle: 'Impostazioni',
    languageMenuLabel: 'Lingua',
    commands: 'Istruzioni',
    leaderboardMenuLabel: 'Classifica',
    leaderboardTitle: 'Classifica',
    leaderboardEmpty: 'Nessun punteggio ancora: gioca da loggato per essere il primo!',
    resetLevel: 'Reset livello',
    restartTitle: 'Ricominciare il livello?',
    restartBody: 'Il livello riparte da capo con i mattoncini al loro posto. Vite e punteggio restano.',
    restartYes: 'Sì, ricomincia',
    restartNo: 'No, continuo',
    languageTitle: 'Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    close: 'Chiudi',
    powerUpWide: 'Paddle allargato!',
    powerUpLife: 'Vita extra!',
    powerUpLifeMax: 'Vite già al massimo (+50 punti)',
    powerUpMulti: 'Multi-pallina!',
    powerUpSlow: 'Pallina rallentata!',
    tutorialTitle: 'Come si gioca',
    tutorialMove: "Sposta il paddle: trascina il dito o muovi il mouse sull'area di gioco",
    tutorialLaunch: 'Tocca per lanciare la pallina',
    tutorialPowerups: 'Prendi i potenziamenti che cadono dai mattoncini rotti: paddle più largo, multi-pallina, pallina più lenta, vita extra',
    tutorialLives: 'Hai 3 vite: non far cadere la pallina!',
    gotIt: 'Ho capito!',
  },
  en: {
    backToHome: 'Back to Home',
    tapToLaunch: 'Tap to launch the ball',
    chooseDifficulty: 'Choose difficulty',
    chooseDifficultySub: 'You can change it every time you start a game',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    levelComplete: 'Level Complete!',
    levelCompleteSub: score => `Score: ${score}`,
    continueBtn: 'Continue',
    gameOver: 'Game Over',
    gameOverSub: (level, score) => `LV. ${level} — Score: ${score}`,
    playAgain: 'Play again',
    paused: 'Paused',
    resume: 'Resume',
    difficultyLabel: 'Difficulty',
    settingsTitle: 'Settings',
    languageMenuLabel: 'Language',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Leaderboard',
    leaderboardTitle: 'Leaderboard',
    leaderboardEmpty: 'No scores yet: play while signed in to be the first!',
    resetLevel: 'Reset level',
    restartTitle: 'Restart the level?',
    restartBody: 'The level starts over with every brick back in place. Lives and score stay as they are.',
    restartYes: 'Yes, restart',
    restartNo: 'No, keep going',
    languageTitle: 'Language',
    languageSub: 'Choose the interface language',
    close: 'Close',
    powerUpWide: 'Paddle widened!',
    powerUpLife: 'Extra life!',
    powerUpLifeMax: 'Already max lives (+50 points)',
    powerUpMulti: 'Multi-ball!',
    powerUpSlow: 'Ball slowed down!',
    tutorialTitle: 'How to play',
    tutorialMove: 'Move the paddle: drag your finger or move the mouse over the game area',
    tutorialLaunch: 'Tap to launch the ball',
    tutorialPowerups: 'Grab the power-ups that fall from broken bricks: wider paddle, multi-ball, slower ball, extra life',
    tutorialLives: "You have 3 lives: don't let the ball fall!",
    gotIt: 'Got it!',
  },
  fr: {
    backToHome: "Retour à l'accueil",
    tapToLaunch: 'Touche pour lancer la balle',
    chooseDifficulty: 'Choisis la difficulté',
    chooseDifficultySub: 'Tu peux la changer à chaque nouvelle partie',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    levelComplete: 'Niveau terminé !',
    levelCompleteSub: score => `Score : ${score}`,
    continueBtn: 'Continuer',
    gameOver: 'Game Over',
    gameOverSub: (level, score) => `LV. ${level} — Score : ${score}`,
    playAgain: 'Rejouer',
    paused: 'Pause',
    resume: 'Reprendre',
    difficultyLabel: 'Difficulté',
    settingsTitle: 'Paramètres',
    languageMenuLabel: 'Langue',
    commands: 'Instructions',
    leaderboardMenuLabel: 'Classement',
    leaderboardTitle: 'Classement',
    leaderboardEmpty: 'Aucun score pour l\'instant : joue connecté pour être le premier !',
    resetLevel: 'Réinitialiser le niveau',
    restartTitle: 'Recommencer le niveau ?',
    restartBody: 'Le niveau repart de zéro avec toutes les briques en place. Vies et score sont conservés.',
    restartYes: 'Oui, recommencer',
    restartNo: 'Non, je continue',
    languageTitle: 'Langue',
    languageSub: "Choisis la langue de l'interface",
    close: 'Fermer',
    powerUpWide: 'Raquette élargie !',
    powerUpLife: 'Vie supplémentaire !',
    powerUpLifeMax: 'Vies déjà au maximum (+50 points)',
    powerUpMulti: 'Multi-balle !',
    powerUpSlow: 'Balle ralentie !',
    tutorialTitle: 'Comment jouer',
    tutorialMove: 'Déplace la raquette : glisse ton doigt ou bouge la souris sur la zone de jeu',
    tutorialLaunch: 'Touche pour lancer la balle',
    tutorialPowerups: 'Attrape les bonus qui tombent des briques cassées : raquette plus large, multi-balle, balle plus lente, vie supplémentaire',
    tutorialLives: 'Tu as 3 vies : ne laisse pas tomber la balle !',
    gotIt: "C'est compris !",
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

// ---------- Costanti di gioco ----------
const VW = 180, VH = 270; // risoluzione virtuale del "pixel art" (vedi canvas + CSS pixelated)
const BRICK_COLS = 8;
const BRICK_W = 20, BRICK_H = 8, BRICK_GAP = 2;
const BRICK_MARGIN_X = 3;
const BRICK_TOP = 20;
const PADDLE_Y = VH - 42; // margine ampio sotto il paddle: sul mobile il pollice sta lì e non deve coprirlo
const PADDLE_H = 4;
const BALL_SIZE = 3;
const BASE_BALL_SPEED = 95; // pixel virtuali al secondo
const MAX_LIVES = 3;
const PALETTE = ['#F2622E', '#F4B740', '#14A085', '#7B5FC7', '#4FC3D9'];
const POWER_UP_TYPES = ['wide', 'life', 'multi', 'slow'];
const POWER_UP_COLORS = { wide: '#4FC3D9', life: '#F2622E', multi: '#7B5FC7', slow: '#14A085' };

const DIFFICULTIES = {
  easy: { ballSpeed: 1.0, paddleWidth: 36, powerUpChance: 0.25, toughBrickBase: 0.03 },
  medium: { ballSpeed: 1.25, paddleWidth: 28, powerUpChance: 0.18, toughBrickBase: 0.12 },
  hard: { ballSpeed: 1.55, paddleWidth: 22, powerUpChance: 0.12, toughBrickBase: 0.25 },
};

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function () {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// ---------- Generazione livello (deterministica: stesso livello = stesso schema) ----------
function generateBricks(level, difficultyKey) {
  const rnd = seededRandom(level * 104729 + 17);
  const preset = DIFFICULTIES[difficultyKey];
  const rows = Math.min(3 + Math.floor((level - 1) / 2), 8);
  const toughChance = Math.min(0.6, preset.toughBrickBase * (1 + level * 0.05));
  const bricks = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < BRICK_COLS; c++) {
      if (level > 3 && rnd() < 0.08) continue; // qualche buco per varietà nei livelli più avanzati
      const tough = rnd() < toughChance;
      bricks.push({
        x: BRICK_MARGIN_X + c * (BRICK_W + BRICK_GAP),
        y: BRICK_TOP + r * (BRICK_H + BRICK_GAP),
        w: BRICK_W, h: BRICK_H,
        color: PALETTE[r % PALETTE.length],
        hp: tough ? 2 : 1,
        maxHp: tough ? 2 : 1,
      });
    }
  }
  return bricks;
}

// ---------- Stato di gioco ----------
const state = {
  difficulty: null,
  level: 1,
  lives: MAX_LIVES,
  score: 0,
  bestScore: 0, // punteggio più alto mai raggiunto (non scende ricominciando)
  bestLevel: 1, // livello più alto raggiunto in QUESTA difficoltà: è il valore di classifica
  // partite messe da parte delle altre due difficoltà: cambiare difficoltà non
  // deve più azzerare quella che stavi giocando (prima startNewGame() rimetteva
  // tutto a zero, quindi passare da facile a difficile bruciava il progresso)
  byDifficulty: {},
  bricks: [],
  balls: [],
  powerUps: [],
  paddle: { x: (VW - 28) / 2, width: 28 },
  wideUntil: 0,
  slowUntil: 0,
  paused: true, // in pausa finché non si sceglie la difficoltà
};

const els = {
  loading: document.getElementById('loadingScreen'),
  canvas: document.getElementById('gameCanvas'),
  tapHint: document.getElementById('tapHint'),
  centerToast: document.getElementById('centerToast'),
  levelValue: document.getElementById('levelValue'),
  scoreValue: document.getElementById('scoreValue'),
  livesCanvas: document.getElementById('livesCanvas'),
  languageOverlay: document.getElementById('languageOverlay'),
  languageList: document.getElementById('languageList'),
  closeLanguageBtn: document.getElementById('closeLanguageBtn'),
  difficultyOverlay: document.getElementById('difficultyOverlay'),
  levelCompleteOverlay: document.getElementById('levelCompleteOverlay'),
  levelCompleteSub: document.getElementById('levelCompleteSub'),
  nextLevelBtn: document.getElementById('nextLevelBtn'),
  gameOverOverlay: document.getElementById('gameOverOverlay'),
  gameOverSub: document.getElementById('gameOverSub'),
  retryBtn: document.getElementById('retryBtn'),
  pauseBtn: document.getElementById('pauseBtn'),
  pauseOverlay: document.getElementById('pauseOverlay'),
  resumeBtn: document.getElementById('resumeBtn'),
  resetLevelBtn: document.getElementById('resetLevelBtn'),
  topRestartBtn: document.getElementById('topRestartBtn'),
  restartOverlay: document.getElementById('restartOverlay'),
  confirmRestartBtn: document.getElementById('confirmRestartBtn'),
  cancelRestartBtn: document.getElementById('cancelRestartBtn'),
  settingsBtn: document.getElementById('settingsBtn'),
  settingsOverlay: document.getElementById('settingsOverlay'),
  closeSettingsBtn: document.getElementById('closeSettingsBtn'),
  openLanguageBtn: document.getElementById('openLanguageBtn'),
  openTutorialBtn: document.getElementById('openTutorialBtn'),
  tutorialOverlay: document.getElementById('tutorialOverlay'),
  closeTutorialBtn: document.getElementById('closeTutorialBtn'),
  openLeaderboardBtn: document.getElementById('openLeaderboardBtn'),
  leaderboardOverlay: document.getElementById('leaderboardOverlay'),
  leaderboardList: document.getElementById('leaderboardList'),
  leaderboardTabs: document.getElementById('leaderboardTabs'),
  closeLeaderboardBtn: document.getElementById('closeLeaderboardBtn'),
};
const ctx = els.canvas.getContext('2d');
const livesCtx = els.livesCanvas.getContext('2d');

// piccolo cuore pixel art (7x6), acceso o "vuoto" a seconda delle vite rimaste
const HEART_PATTERN = [
  '.XX.XX.',
  'XXXXXXX',
  'XXXXXXX',
  '.XXXXX.',
  '..XXX..',
  '...X...',
];
function drawHearts() {
  livesCtx.clearRect(0, 0, els.livesCanvas.width, els.livesCanvas.height);
  for (let i = 0; i < MAX_LIVES; i++) {
    const filled = i < state.lives;
    livesCtx.fillStyle = filled ? '#F2622E' : 'rgba(255,255,255,0.18)';
    const offsetX = i * 8;
    for (let row = 0; row < HEART_PATTERN.length; row++) {
      for (let col = 0; col < HEART_PATTERN[row].length; col++) {
        if (HEART_PATTERN[row][col] === 'X') livesCtx.fillRect(offsetX + col, row, 1, 1);
      }
    }
  }
}

// ---------- HUD ----------
function updateHUD() {
  els.levelValue.textContent = state.level;
  els.scoreValue.textContent = state.score;
  drawHearts();
}

let toastTimer = null;
// L'icona sta FUORI dal testo tradotto: il messaggio arriva da t(), che e' una
// stringa e basta, e finisce in un nodo di testo suo. Se l'icona fosse dentro
// alla frase la prima traduzione la cancellerebbe.
function showToast(msg, icon) {
  els.centerToast.textContent = '';
  if (icon) {
    const span = document.createElement('span');
    span.className = 'ffr-ico toast-ico' + (icon === 'heart' ? ' toast-ico-life' : '');
    span.dataset.ico = icon;
    els.centerToast.appendChild(span);
    if (window.FFR && FFR.icons) FFR.icons(els.centerToast);
  }
  els.centerToast.appendChild(document.createTextNode(msg));
  els.centerToast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.centerToast.classList.add('hidden');
  }, 1400);
}

// ---------- Palla/paddle/livello: avvio ----------
function newBall() {
  return {
    x: state.paddle.x + state.paddle.width / 2 - BALL_SIZE / 2,
    y: PADDLE_Y - BALL_SIZE - 1,
    dirX: 0, dirY: -1,
    speed: BASE_BALL_SPEED * DIFFICULTIES[state.difficulty].ballSpeed * levelSpeedMultiplier(state.level),
    stuck: true,
  };
}
function levelSpeedMultiplier(level) {
  return 1 + Math.min(level - 1, 20) * 0.01;
}
function anyBallStuck() {
  return state.balls.some(b => b.stuck);
}
function launchStuckBalls() {
  state.balls.forEach(b => {
    if (b.stuck) {
      b.stuck = false;
      const angle = (-90 + (Math.random() * 50 - 25)) * Math.PI / 180; // verso l'alto, con un po' di variazione
      b.dirX = Math.cos(angle);
      b.dirY = Math.sin(angle);
      els.tapHint.classList.add('hidden');
    }
  });
}

// Scelta/cambio difficoltà: NON si ricomincia più da zero. La partita in corso
// viene messa da parte e si riprende quella della difficoltà scelta (o se ne
// comincia una nuova solo se non c'è). Così si può passare da facile a
// difficile e tornare indietro ritrovando entrambe dov'erano.
function startNewGame(difficultyKey) {
  if (state.difficulty != null && state.difficulty !== difficultyKey) {
    state.byDifficulty[state.difficulty] = snapshotCurrentRun();
  }
  const previous = state.byDifficulty[difficultyKey];
  applyRun(difficultyKey, previous || { level: 1, lives: MAX_LIVES, score: 0, bestScore: 0, bestLevel: 1 });
  els.pauseOverlay.classList.remove('show');
  els.settingsOverlay.classList.remove('show');
  saveBoingProgress();
}

// ---------- Pausa (riprendi / difficoltà / reset livello) ----------
function openPause() {
  // Prima di aver scelto la difficoltà non c'è niente da mettere in pausa, ma il
  // pulsante deve comunque servire a qualcosa: da quando i pannelli si possono
  // chiudere con la X, è lui a riportare alla scelta della difficoltà — altrimenti
  // chi la chiude resta davanti a un campo vuoto senza modo di ricominciare.
  if (state.difficulty == null) { els.difficultyOverlay.classList.add('show'); return; }
  state.paused = true;
  document.querySelectorAll('#pauseOverlay .difficulty-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === state.difficulty);
  });
  els.pauseOverlay.classList.add('show');
}
function closePause() {
  els.pauseOverlay.classList.remove('show');
  state.paused = false;
}
function resetLevel() {
  startLevel(state.level);
  closePause();
  saveBoingProgress();
}

// ---------- Impostazioni (lingua / comandi) ----------
function openSettingsMenu() {
  if (state.difficulty == null) return;
  state.paused = true;
  els.settingsOverlay.classList.add('show');
}
function closeSettingsMenu() {
  els.settingsOverlay.classList.remove('show');
  state.paused = false;
}

function startLevel(level) {
  state.bricks = generateBricks(level, state.difficulty);
  state.powerUps = [];
  state.paddle.x = (VW - state.paddle.width) / 2;
  state.balls = [newBall()];
  updateHUD();
  els.tapHint.textContent = t().tapToLaunch;
  els.tapHint.classList.remove('hidden');
}

// ---------- Fisica ----------
function setPaddleX(x) {
  state.paddle.x = Math.max(0, Math.min(VW - state.paddle.width, x));
  state.balls.forEach(b => {
    if (b.stuck) b.x = state.paddle.x + state.paddle.width / 2 - BALL_SIZE / 2;
  });
}
// centra il paddle su virtualX (usato dal mouse: il paddle si mette subito
// sotto al puntatore)
function movePaddleTo(virtualX) {
  setPaddleX(virtualX - state.paddle.width / 2);
}

function spawnPowerUp(x, y) {
  const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
  state.powerUps.push({ x, y, type, size: 9 });
}

function applyPowerUp(type) {
  if (type === 'wide') {
    state.paddle.width = DIFFICULTIES[state.difficulty].paddleWidth * 1.5;
    state.wideUntil = performance.now() + 10000;
    showToast(t().powerUpWide, 'arrow-lr');
  } else if (type === 'life') {
    if (state.lives < MAX_LIVES) {
      state.lives += 1;
      showToast(t().powerUpLife, 'heart');
    } else {
      state.score += 50;
      showToast(t().powerUpLifeMax, 'heart');
    }
    updateHUD();
  } else if (type === 'multi') {
    const source = state.balls.find(b => !b.stuck) || state.balls[0];
    if (source) {
      for (const delta of [-0.35, 0.35]) {
        const angle = Math.atan2(source.dirY, source.dirX) + delta;
        state.balls.push({
          x: source.x, y: source.y,
          dirX: Math.cos(angle), dirY: Math.sin(angle),
          speed: source.speed, stuck: false,
        });
      }
    }
    showToast(t().powerUpMulti, 'balls');
  } else if (type === 'slow') {
    state.slowUntil = performance.now() + 9000;
    showToast(t().powerUpSlow, 'snail');
  }
}

function currentSpeedMultiplier() {
  return performance.now() < state.slowUntil ? 0.6 : 1.0;
}

function rectsOverlap(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function update(dt) {
  const now = performance.now();
  if (state.wideUntil && now > state.wideUntil) {
    state.wideUntil = 0;
    state.paddle.width = DIFFICULTIES[state.difficulty].paddleWidth;
  }

  // palline
  const speedMul = currentSpeedMultiplier();
  for (let i = state.balls.length - 1; i >= 0; i--) {
    const b = state.balls[i];
    if (b.stuck) continue;
    const dist = b.speed * speedMul * dt;
    b.x += b.dirX * dist;
    b.y += b.dirY * dist;

    if (b.x <= 0) { b.x = 0; b.dirX = Math.abs(b.dirX); }
    if (b.x + BALL_SIZE >= VW) { b.x = VW - BALL_SIZE; b.dirX = -Math.abs(b.dirX); }
    if (b.y <= 0) { b.y = 0; b.dirY = Math.abs(b.dirY); }

    // paddle
    if (b.dirY > 0 && rectsOverlap(b.x, b.y, BALL_SIZE, BALL_SIZE, state.paddle.x, PADDLE_Y, state.paddle.width, PADDLE_H)) {
      // clampato a 0..1: senza questo, una pallina che colpisce il paddle di
      // striscio (bordo estremo, più facile con tante palline in campo o
      // paddle stretto in difficile) poteva ricevere un angolo vicinissimo a
      // 0°/180°, cioè quasi orizzontale — la pallina restava a rimbalzare
      // avanti e indietro tra le pareti senza più risalire
      const hitPos = Math.max(0, Math.min(1, (b.x + BALL_SIZE / 2 - state.paddle.x) / state.paddle.width));
      const angle = (-90 + (hitPos - 0.5) * 130) * Math.PI / 180;
      b.dirX = Math.cos(angle);
      b.dirY = Math.sin(angle);
      b.y = PADDLE_Y - BALL_SIZE;
    }

    // mattoncini
    for (let j = state.bricks.length - 1; j >= 0; j--) {
      const brick = state.bricks[j];
      if (!rectsOverlap(b.x, b.y, BALL_SIZE, BALL_SIZE, brick.x, brick.y, brick.w, brick.h)) continue;
      const overlapX = Math.min(b.x + BALL_SIZE - brick.x, brick.x + brick.w - b.x);
      const overlapY = Math.min(b.y + BALL_SIZE - brick.y, brick.y + brick.h - b.y);
      if (overlapX < overlapY) b.dirX = -b.dirX; else b.dirY = -b.dirY;
      brick.hp -= 1;
      if (brick.hp <= 0) {
        state.score += brick.maxHp > 1 ? 20 : 10;
        state.bricks.splice(j, 1);
        if (Math.random() < DIFFICULTIES[state.difficulty].powerUpChance) {
          spawnPowerUp(brick.x + brick.w / 2 - 4, brick.y);
        }
      }
      updateHUD();
      break; // una sola collisione di mattoncino per frame, evita rimbalzi doppi
    }

    // palla persa
    if (b.y > VH) {
      state.balls.splice(i, 1);
    }
  }

  if (state.balls.length === 0) {
    state.lives -= 1;
    updateHUD();
    saveBoingProgress();
    if (state.lives <= 0) {
      showGameOver();
    } else {
      state.balls = [newBall()];
      els.tapHint.textContent = t().tapToLaunch;
      els.tapHint.classList.remove('hidden');
    }
  } else if (state.bricks.length === 0) {
    showLevelComplete();
  }

  // power-up che cadono
  for (let i = state.powerUps.length - 1; i >= 0; i--) {
    const p = state.powerUps[i];
    p.y += 55 * dt;
    if (rectsOverlap(p.x, p.y, p.size, p.size, state.paddle.x, PADDLE_Y, state.paddle.width, PADDLE_H)) {
      applyPowerUp(p.type);
      state.powerUps.splice(i, 1);
    } else if (p.y > VH) {
      state.powerUps.splice(i, 1);
    }
  }
}

function showLevelComplete() {
  state.paused = true;
  els.levelCompleteSub.textContent = t().levelCompleteSub(state.score);
  els.levelCompleteOverlay.classList.add('show');
  saveBoingProgress();
}
function showGameOver() {
  state.paused = true;
  els.gameOverSub.textContent = t().gameOverSub(state.level, state.score);
  els.gameOverOverlay.classList.add('show');
  saveBoingProgress(); // prima si registrano livello/punteggio record raggiunti
  // poi la partita di questa difficoltà riparte pulita: senza questo, scegliendo
  // di nuovo la stessa difficoltà si "riprenderebbe" una partita già finita
  // (zero vite), perché ora startNewGame riprende invece di azzerare
  if (state.difficulty != null) {
    state.byDifficulty[state.difficulty] = {
      level: 1, lives: MAX_LIVES, score: 0,
      bestScore: state.bestScore, bestLevel: state.bestLevel,
    };
  }
}

// ---------- Rendering (pixel art volutamente piccolo e un po' spartano) ----------
function render() {
  ctx.clearRect(0, 0, VW, VH);

  for (const brick of state.bricks) {
    ctx.fillStyle = brick.hp < brick.maxHp ? shade(brick.color, 0.45) : brick.color;
    ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillRect(brick.x, brick.y, brick.w, 1);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(brick.x, brick.y + brick.h - 1, brick.w, 1);
  }

  ctx.fillStyle = '#FBEBC9';
  roundedRectPath(ctx, state.paddle.x, PADDLE_Y, state.paddle.width, PADDLE_H, PADDLE_H / 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(234,211,160,0.8)';
  roundedRectPath(ctx, state.paddle.x, PADDLE_Y + PADDLE_H - 1.5, state.paddle.width, 1.5, 0.75);
  ctx.fill();

  for (const b of state.balls) {
    ctx.fillStyle = '#FFFDF8';
    ctx.fillRect(Math.round(b.x), Math.round(b.y), BALL_SIZE, BALL_SIZE);
    ctx.fillStyle = '#C9C2B4';
    ctx.fillRect(Math.round(b.x) + BALL_SIZE - 1, Math.round(b.y) + BALL_SIZE - 1, 1, 1);
  }

  // power-up: nessuna icona interna, solo un quadrato (o un cuore, per la
  // vita) a tinta unita con un bagliore neon
  for (const p of state.powerUps) {
    const color = POWER_UP_COLORS[p.type];
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 5;
    ctx.fillStyle = color;
    if (p.type === 'life') {
      const cell = p.size / 7;
      for (let row = 0; row < HEART_PATTERN.length; row++) {
        for (let col = 0; col < HEART_PATTERN[row].length; col++) {
          if (HEART_PATTERN[row][col] === 'X') {
            ctx.fillRect(p.x + col * cell, p.y + row * cell, cell + 0.6, cell + 0.6);
          }
        }
      }
    } else {
      roundedRectPath(ctx, p.x, p.y, p.size, p.size, 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
function roundedRectPath(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function shade(hex, factor) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * factor);
  const g = Math.round(((n >> 8) & 255) * factor);
  const b = Math.round((n & 255) * factor);
  return `rgb(${r},${g},${b})`;
}

// ---------- Loop ----------
let lastTime = null;
function loop(timestamp) {
  if (lastTime == null) lastTime = timestamp;
  const dt = Math.min(0.05, (timestamp - lastTime) / 1000);
  lastTime = timestamp;
  if (!state.paused) update(dt);
  render();
  requestAnimationFrame(loop);
}

// ---------- Input ----------
function canvasPointToVirtual(clientX) {
  const rect = els.canvas.getBoundingClientRect();
  return ((clientX - rect.left) / rect.width) * VW;
}
// Mouse: il paddle segue il puntatore semplicemente quando è sopra l'area di
// gioco (comodo su desktop, non serve tenere premuto).
// Touch: invece di mettere il paddle esattamente sotto al dito (il pollice lo
// coprirebbe e non si vedrebbe più dove lo si sta spostando), si usa un
// trascinamento RELATIVO — si può toccare ovunque, e il paddle si sposta
// della stessa quantità di cui si muove il dito, mantenendo la posizione
// iniziale come riferimento. Il trascinamento continua a funzionare anche se
// il dito esce dai bordi del canvas.
let touchDragging = false;
let touchStartClientX = 0;
let touchStartPaddleX = 0;
function handlePointerDown(e) {
  if (state.paused) return;
  if (e.pointerType === 'touch') {
    touchDragging = true;
    touchStartClientX = e.clientX;
    touchStartPaddleX = state.paddle.x;
  } else {
    movePaddleTo(canvasPointToVirtual(e.clientX));
  }
  launchStuckBalls();
}
function handlePointerMove(e) {
  if (state.paused || e.pointerType === 'touch') return; // il touch è gestito sotto
  movePaddleTo(canvasPointToVirtual(e.clientX));
}
function handleWindowPointerMove(e) {
  if (state.paused || !touchDragging) return;
  const rect = els.canvas.getBoundingClientRect();
  const deltaVirtualX = (e.clientX - touchStartClientX) * (VW / rect.width);
  setPaddleX(touchStartPaddleX + deltaVirtualX);
}
function handlePointerUpOrCancel() { touchDragging = false; }
function handleKeyDown(e) {
  if (state.paused) return;
  const step = 14;
  if (e.key === 'ArrowLeft') movePaddleTo(state.paddle.x + state.paddle.width / 2 - step);
  else if (e.key === 'ArrowRight') movePaddleTo(state.paddle.x + state.paddle.width / 2 + step);
  else if (e.key === ' ') launchStuckBalls();
}

// ---------- Lingua ----------
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
  els.settingsOverlay.classList.remove('show'); // si apre dal menu impostazioni
  renderLanguageList();
  els.languageOverlay.classList.add('show');
}
function closeLanguageModal() {
  els.languageOverlay.classList.remove('show');
  els.settingsOverlay.classList.add('show'); // torna al menu impostazioni da cui si era aperta
}
function selectLanguage(code) {
  language = code;
  setSiteLanguage(code);
  applyTranslations();
  if (anyBallStuck()) els.tapHint.textContent = t().tapToLaunch;
  closeLanguageModal();
}

// ---------- Tutorial ----------
function openTutorial() {
  els.settingsOverlay.classList.remove('show');
  els.tutorialOverlay.classList.add('show');
}
// partita salvata nel cloud trovata all'avvio mentre era in corso il tutorial:
// si riprende alla sua chiusura, invece di mandare alla scelta difficoltà
let pendingResume = null;
function closeTutorial() {
  els.tutorialOverlay.classList.remove('show');
  try { localStorage.setItem('boing-tutorial-seen', '1'); } catch (e) { /* ignora */ }
  if (state.difficulty == null) {
    if (pendingResume) {
      const saved = pendingResume;
      pendingResume = null;
      resumeFromSaved(saved); // account con progressi già fatti, su un dispositivo nuovo
    } else {
      els.difficultyOverlay.classList.add('show'); // primo avvio vero: si sceglie la difficoltà
    }
  } else {
    els.settingsOverlay.classList.add('show'); // riaperto dal menu impostazioni durante una partita
  }
}

// ---------- Classifica ----------
// Una classifica per difficoltà: i punti fatti in facile non sono confrontabili
// con quelli fatti in difficile, quindi si gareggia sul livello raggiunto e
// ogni difficoltà ha la sua graduatoria separata.
let leaderboardDifficulty = 'medium';
async function openLeaderboard() {
  els.settingsOverlay.classList.remove('show');
  els.leaderboardOverlay.classList.add('show');
  leaderboardDifficulty = state.difficulty || 'medium'; // parte da quella che stai giocando
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
  const gameKey = 'boing:' + difficultyKey;
  const [rows, me] = await Promise.all([
    auth ? auth.getLeaderboard(gameKey, 50) : [],
    auth ? auth.getMyRank(gameKey) : null,
  ]);
  if (difficultyKey !== leaderboardDifficulty) return; // l'utente ha già cambiato scheda
  if (!rows.length) {
    els.leaderboardList.innerHTML = `<div class="leaderboard-empty">${t().leaderboardEmpty}</div>`;
    return;
  }
  const myNickname = auth ? auth.getNickname() : null;
  els.leaderboardList.innerHTML = buildLeaderboardRows(rows, me, myNickname, n => 'LV.' + n);
}

// Righe della classifica con la regola condivisa del sito: se ne vedono 6 per
// volta e, quando chi guarda è fuori dalle prime 5, la sua riga viene infilata
// come 6ª (evidenziata) così si vede subito senza scorrere. Scorrendo, quella
// riga scorre via e la lista prosegue normale (6°, 7°, ...).
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

// ---------- Persistenza progresso (localStorage + cloud se loggato) ----------
// Una partita per difficoltà, tutte dentro la stessa riga 'boing'. La classifica
// invece vuole un punteggio separato per difficoltà, quindi ognuna ha anche la
// sua voce 'boing:<difficoltà>' (vedi saveScore in shared/auth.js).
function snapshotCurrentRun() {
  return {
    level: state.level,
    lives: state.lives,
    score: state.score,
    bestScore: state.bestScore,
    bestLevel: state.bestLevel,
  };
}
function saveBoingProgress() {
  if (!(window.FFR && window.FFR.auth)) return;
  if (state.difficulty == null) return;
  state.bestScore = Math.max(state.bestScore, state.score);
  state.bestLevel = Math.max(state.bestLevel || 1, state.level);
  state.byDifficulty[state.difficulty] = snapshotCurrentRun();
  window.FFR.auth.saveProgress('boing', {
    current: state.difficulty,
    byDifficulty: state.byDifficulty,
  }, state.bestLevel);
  // voce di classifica della difficoltà in corso: si gareggia sul livello
  // raggiunto, non sui punti (a parità di bravura una difficoltà più facile
  // farebbe più punti, quindi i punti non sono confrontabili fra difficoltà)
  window.FFR.auth.saveScore('boing:' + state.difficulty, state.bestLevel);
}
async function loadBoingProgress() {
  if (!(window.FFR && window.FFR.auth)) return null;
  if (window.FFR.auth.ready) await window.FFR.auth.ready;
  const saved = await window.FFR.auth.loadProgress('boing');
  return normalizeSaved(saved);
}
// Converte il vecchio formato (una sola partita: {difficulty, level, lives,
// score, bestScore}) in quello nuovo, così chi giocava già non perde niente
// — vedi la regola "i progressi devono sopravvivere agli aggiornamenti".
function normalizeSaved(saved) {
  if (!saved) return null;
  if (saved.byDifficulty && saved.current) return saved; // già nel formato nuovo
  if (!saved.difficulty) return null;
  return {
    current: saved.difficulty,
    byDifficulty: {
      [saved.difficulty]: {
        level: saved.level || 1,
        lives: saved.lives != null ? saved.lives : MAX_LIVES,
        score: saved.score || 0,
        bestScore: saved.bestScore || saved.score || 0,
        bestLevel: saved.level || 1,
      },
    },
  };
}
function applyRun(difficultyKey, run) {
  state.difficulty = difficultyKey;
  state.level = run.level || 1;
  state.lives = run.lives != null ? run.lives : MAX_LIVES;
  state.score = run.score || 0;
  state.bestScore = run.bestScore || state.score;
  state.bestLevel = run.bestLevel || state.level;
  state.paddle.width = DIFFICULTIES[difficultyKey].paddleWidth;
  state.wideUntil = 0;
  state.slowUntil = 0;
  startLevel(state.level);
  els.difficultyOverlay.classList.remove('show');
  state.paused = false;
}
function resumeFromSaved(saved) {
  state.byDifficulty = saved.byDifficulty || {};
  const key = saved.current;
  applyRun(key, state.byDifficulty[key] || {});
}

// ---------- Init ----------
async function init() {
  language = getSiteLanguage() || 'it';
  applyTranslations();
  updateHUD();

  els.canvas.addEventListener('pointerdown', handlePointerDown);
  els.canvas.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointermove', handleWindowPointerMove);
  window.addEventListener('pointerup', handlePointerUpOrCancel);
  window.addEventListener('pointercancel', handlePointerUpOrCancel);
  window.addEventListener('keydown', handleKeyDown);

  document.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => startNewGame(btn.dataset.difficulty));
  });
  els.nextLevelBtn.addEventListener('click', () => {
    els.levelCompleteOverlay.classList.remove('show');
    state.level += 1;
    startLevel(state.level);
    state.paused = false;
    saveBoingProgress();
  });
  els.retryBtn.addEventListener('click', () => {
    els.gameOverOverlay.classList.remove('show');
    els.difficultyOverlay.classList.add('show');
  });

  els.pauseBtn.addEventListener('click', openPause);
  els.resumeBtn.addEventListener('click', closePause);
  els.resetLevelBtn.addEventListener('click', resetLevel);

  // ↻ in barra: ricomincia il livello. Fuori da una partita è la strada per
  // sceglierne una nuova, come fa il ⏸ — così chi chiude un pannello con la X
  // non resta davanti a un campo fermo.
  els.topRestartBtn.addEventListener('click', () => {
    if (state.difficulty == null) { els.difficultyOverlay.classList.add('show'); return; }
    state.paused = true;
    els.restartOverlay.classList.add('show');
  });
  els.confirmRestartBtn.addEventListener('click', () => {
    els.restartOverlay.classList.remove('show');
    resetLevel();
  });
  els.cancelRestartBtn.addEventListener('click', () => {
    els.restartOverlay.classList.remove('show');
    state.paused = false;
  });
  els.restartOverlay.addEventListener('click', (e) => {
    if (e.target === els.restartOverlay) { els.restartOverlay.classList.remove('show'); state.paused = false; }
  });
  els.pauseOverlay.addEventListener('click', (e) => {
    if (e.target === els.pauseOverlay) closePause();
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
    if (e.target === els.tutorialOverlay) closeTutorial();
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

  requestAnimationFrame(loop);

  // primo avvio in assoluto: tutorial prima della scelta della difficoltà;
  // altrimenti si riprende la partita salvata (livello/difficoltà/vite/punteggio),
  // o si va alla scelta della difficoltà se non c'è nessun progresso salvato
  let tutorialSeen = false;
  try { tutorialSeen = !!localStorage.getItem('boing-tutorial-seen'); } catch (e) { /* ignora */ }
  // il progresso va caricato SEMPRE, anche quando si mostra il tutorial:
  // `boing-tutorial-seen` è una chiave localStorage per-dispositivo, quindi su
  // un secondo dispositivo il tutorial ricompare anche per un giocatore che ha
  // già un account con progressi nel cloud. Caricandolo solo nel ramo "else"
  // (com'era prima) quel giocatore ripartiva da zero: il progresso non veniva
  // proprio richiesto, e dopo il tutorial si finiva sulla scelta difficoltà.
  // NB: si controlla `current`, non più `difficulty` — loadBoingProgress()
  // restituisce il formato nuovo (una partita per difficoltà) anche quando
  // sul cloud c'è ancora quello vecchio, che viene convertito al volo
  const saved = await loadBoingProgress();
  if (!tutorialSeen) {
    pendingResume = (saved && saved.current) ? saved : null;
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

// La X dei pannelli (shared/modal-x.js) chiude e basta: qui si rimette in moto
// la partita, perché aprire la pausa o le impostazioni la aveva messa in pausa.
// Fuori da questo elenco resta com'è: dopo un game over il campo deve restare
// fermo, e da lì si riparte dal menu di pausa.
window.FFR_ON_MODAL_CLOSE = function (id) {
  const resumes = ['pauseOverlay', 'settingsOverlay', 'tutorialOverlay', 'languageOverlay', 'leaderboardOverlay', 'restartOverlay'];
  if (resumes.indexOf(id) !== -1 && state.difficulty != null) state.paused = false;
};
