/* ============ BOING — motore di gioco ============ */

// ---------- Lingua condivisa con tutto il sito ----------
// A differenza di Wordio, qui la lingua cambia SOLO il testo dell'interfaccia:
// non esiste un dizionario, quindi non c'è nessun progresso da ricominciare o
// riprendere in base alla lingua.
const LANGUAGES = {
  it: { label: 'Italiano', flag: '🇮🇹' },
  en: { label: 'English', flag: '🇬🇧' },
  fr: { label: 'Français', flag: '🇫🇷' },
};
const SITE_LANGUAGE_KEY = 'ffr-language';

const UI_STRINGS = {
  it: {
    scoreLabel: 'Punteggio',
    tapToLaunch: 'Tocca per lanciare la pallina',
    chooseDifficulty: 'Scegli la difficoltà',
    chooseDifficultySub: 'Puoi cambiarla ogni volta che inizi una partita',
    easy: 'Facile',
    medium: 'Medio',
    hard: 'Difficile',
    levelComplete: 'Livello Completato!',
    levelCompleteSub: score => `Punteggio: ${score}`,
    continueBtn: 'Continua →',
    gameOver: 'Game Over',
    gameOverSub: (level, score) => `LV. ${level} — Punteggio: ${score}`,
    playAgain: 'Rigioca',
    paused: 'Pausa',
    pausedSub: 'Puoi riprendere o cambiare difficoltà',
    resume: 'Riprendi ▶',
    languageTitle: '🌍 Lingua',
    languageSub: "Scegli la lingua dell'interfaccia",
    close: 'Chiudi',
    powerUpWide: '🏓 Paddle allargato!',
    powerUpLife: '❤️ Vita extra!',
    powerUpLifeMax: '❤️ Vite già al massimo (+50 punti)',
    powerUpMulti: '⚪ Multi-pallina!',
    powerUpSlow: '🐌 Pallina rallentata!',
  },
  en: {
    scoreLabel: 'Score',
    tapToLaunch: 'Tap to launch the ball',
    chooseDifficulty: 'Choose difficulty',
    chooseDifficultySub: 'You can change it every time you start a game',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    levelComplete: 'Level Complete!',
    levelCompleteSub: score => `Score: ${score}`,
    continueBtn: 'Continue →',
    gameOver: 'Game Over',
    gameOverSub: (level, score) => `LV. ${level} — Score: ${score}`,
    playAgain: 'Play again',
    paused: 'Paused',
    pausedSub: 'You can resume or change difficulty',
    resume: 'Resume ▶',
    languageTitle: '🌍 Language',
    languageSub: 'Choose the interface language',
    close: 'Close',
    powerUpWide: '🏓 Paddle widened!',
    powerUpLife: '❤️ Extra life!',
    powerUpLifeMax: '❤️ Already max lives (+50 points)',
    powerUpMulti: '⚪ Multi-ball!',
    powerUpSlow: '🐌 Ball slowed down!',
  },
  fr: {
    scoreLabel: 'Score',
    tapToLaunch: 'Touche pour lancer la balle',
    chooseDifficulty: 'Choisis la difficulté',
    chooseDifficultySub: 'Tu peux la changer à chaque nouvelle partie',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    levelComplete: 'Niveau terminé !',
    levelCompleteSub: score => `Score : ${score}`,
    continueBtn: 'Continuer →',
    gameOver: 'Game Over',
    gameOverSub: (level, score) => `LV. ${level} — Score : ${score}`,
    playAgain: 'Rejouer',
    paused: 'Pause',
    pausedSub: 'Tu peux reprendre ou changer de difficulté',
    resume: 'Reprendre ▶',
    languageTitle: '🌍 Langue',
    languageSub: "Choisis la langue de l'interface",
    close: 'Fermer',
    powerUpWide: '🏓 Raquette élargie !',
    powerUpLife: '❤️ Vie supplémentaire !',
    powerUpLifeMax: '❤️ Vies déjà au maximum (+50 points)',
    powerUpMulti: '⚪ Multi-balle !',
    powerUpSlow: '🐌 Balle ralentie !',
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
const PADDLE_Y = VH - 14;
const PADDLE_H = 4;
const BALL_SIZE = 3;
const BASE_BALL_SPEED = 95; // pixel virtuali al secondo
const MAX_LIVES = 3;
const PALETTE = ['#F2622E', '#F4B740', '#14A085', '#7B5FC7', '#4FC3D9'];
const POWER_UP_TYPES = ['wide', 'life', 'multi', 'slow'];
const POWER_UP_COLORS = { wide: '#4FC3D9', life: '#F2622E', multi: '#7B5FC7', slow: '#14A085' };
const POWER_UP_LETTERS = { wide: 'W', life: '+', multi: 'M', slow: 'S' };

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
  levelValue: document.getElementById('levelValue'),
  scoreValue: document.getElementById('scoreValue'),
  livesCanvas: document.getElementById('livesCanvas'),
  langBtn: document.getElementById('langBtn'),
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
  settingsBtn: document.getElementById('settingsBtn'),
  pauseOverlay: document.getElementById('pauseOverlay'),
  resumeBtn: document.getElementById('resumeBtn'),
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
function showToast(msg) {
  els.tapHint.textContent = msg;
  els.tapHint.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    if (anyBallStuck()) {
      els.tapHint.textContent = t().tapToLaunch;
    } else {
      els.tapHint.classList.add('hidden');
    }
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

function startNewGame(difficultyKey) {
  state.difficulty = difficultyKey;
  state.level = 1;
  state.lives = MAX_LIVES;
  state.score = 0;
  state.paddle.width = DIFFICULTIES[difficultyKey].paddleWidth;
  state.wideUntil = 0;
  state.slowUntil = 0;
  startLevel(state.level);
  els.difficultyOverlay.classList.remove('show');
  els.pauseOverlay.classList.remove('show');
  state.paused = false;
}

// ---------- Pausa / impostazioni ----------
function openSettings() {
  if (state.difficulty == null) return; // niente da mettere in pausa prima di scegliere la difficoltà
  state.paused = true;
  document.querySelectorAll('#pauseOverlay .difficulty-option').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.difficulty === state.difficulty);
  });
  els.pauseOverlay.classList.add('show');
}
function closeSettings() {
  els.pauseOverlay.classList.remove('show');
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
function movePaddleTo(virtualX) {
  state.paddle.x = Math.max(0, Math.min(VW - state.paddle.width, virtualX - state.paddle.width / 2));
  state.balls.forEach(b => {
    if (b.stuck) b.x = state.paddle.x + state.paddle.width / 2 - BALL_SIZE / 2;
  });
}

function spawnPowerUp(x, y) {
  const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
  state.powerUps.push({ x, y, type, size: 9 });
}

function applyPowerUp(type) {
  if (type === 'wide') {
    state.paddle.width = DIFFICULTIES[state.difficulty].paddleWidth * 1.5;
    state.wideUntil = performance.now() + 10000;
    showToast(t().powerUpWide);
  } else if (type === 'life') {
    if (state.lives < MAX_LIVES) {
      state.lives += 1;
      showToast(t().powerUpLife);
    } else {
      state.score += 50;
      showToast(t().powerUpLifeMax);
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
    showToast(t().powerUpMulti);
  } else if (type === 'slow') {
    state.slowUntil = performance.now() + 9000;
    showToast(t().powerUpSlow);
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
      const hitPos = (b.x + BALL_SIZE / 2 - state.paddle.x) / state.paddle.width; // 0..1
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
}
function showGameOver() {
  state.paused = true;
  els.gameOverSub.textContent = t().gameOverSub(state.level, state.score);
  els.gameOverOverlay.classList.add('show');
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

  for (const p of state.powerUps) {
    ctx.fillStyle = POWER_UP_COLORS[p.type];
    ctx.fillRect(p.x, p.y, p.size, p.size);
    ctx.fillStyle = '#FFFDF8';
    ctx.font = "6px 'Press Start 2P'";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(POWER_UP_LETTERS[p.type], p.x + p.size / 2, p.y + p.size / 2 + 1);
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
// il paddle segue il puntatore semplicemente quando è sopra l'area di gioco:
// su desktop non serve tenere premuto il mouse (comodo), su touch continua a
// bastare trascinare il dito come prima.
function handlePointerDown(e) {
  if (state.paused) return;
  movePaddleTo(canvasPointToVirtual(e.clientX));
  launchStuckBalls();
}
function handlePointerMove(e) {
  if (state.paused) return;
  movePaddleTo(canvasPointToVirtual(e.clientX));
}
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
function selectLanguage(code) {
  language = code;
  setSiteLanguage(code);
  applyTranslations();
  if (anyBallStuck()) els.tapHint.textContent = t().tapToLaunch;
  closeLanguageModal();
}

// ---------- Init ----------
function init() {
  language = getSiteLanguage() || 'it';
  applyTranslations();
  updateHUD();

  els.canvas.addEventListener('pointerdown', handlePointerDown);
  els.canvas.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('keydown', handleKeyDown);

  document.querySelectorAll('.difficulty-option').forEach(btn => {
    btn.addEventListener('click', () => startNewGame(btn.dataset.difficulty));
  });
  els.nextLevelBtn.addEventListener('click', () => {
    els.levelCompleteOverlay.classList.remove('show');
    state.level += 1;
    startLevel(state.level);
    state.paused = false;
  });
  els.retryBtn.addEventListener('click', () => {
    els.gameOverOverlay.classList.remove('show');
    els.difficultyOverlay.classList.add('show');
  });

  els.settingsBtn.addEventListener('click', openSettings);
  els.resumeBtn.addEventListener('click', closeSettings);
  els.pauseOverlay.addEventListener('click', (e) => {
    if (e.target === els.pauseOverlay) closeSettings();
  });

  els.langBtn.addEventListener('click', openLanguageModal);
  els.closeLanguageBtn.addEventListener('click', closeLanguageModal);
  els.languageOverlay.addEventListener('click', (e) => {
    if (e.target === els.languageOverlay) closeLanguageModal();
  });
  els.languageList.addEventListener('click', (e) => {
    const btn = e.target.closest('.language-option');
    if (btn) selectLanguage(btn.dataset.lang);
  });

  requestAnimationFrame(loop);

  setTimeout(() => {
    els.loading.style.opacity = '0';
    setTimeout(() => els.loading.classList.add('hidden'), 300);
  }, 350);
}
init();
