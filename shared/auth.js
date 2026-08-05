// Free For Real — account condivisi (ospite/nickname+password), progresso
// cloud e leaderboard. Un solo file, incluso da ogni pagina con:
//   <script src="../shared/auth.js" defer></script>
// (dalla home: src="shared/auth.js").
//
// Filosofia: nessuna email, nessun dato personale. Solo nickname + password
// e il progresso di gioco. Vedi supabase/migrations/0001_init.sql per lo
// schema e supabase/functions/recover-account per il recupero password.
(function () {
  'use strict';

  const SUPABASE_URL = 'https://xlncmgeglotckkeqwyhg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_d-yMixopM-row39OKWWyKw_MX85caJ2';
  const EMAIL_DOMAIN = '@ffr-games.local';
  const RECOVER_FN_URL = SUPABASE_URL + '/functions/v1/recover-account';
  const LS_CHOICE = 'ffr-account-choice'; // 'guest' | 'account'

  // chiavi localStorage già usate dai singoli giochi per il progresso locale
  const GAME_LOCAL_KEYS = { wordio: 'wordio-progress' };
  function localKeyFor(game) { return GAME_LOCAL_KEYS[game] || ('ffr-' + game + '-progress'); }

  // ---------------- testi (it/en/fr) ----------------
  const STR = {
    it: {
      welcomeTitle: 'Benvenuto!',
      welcomeSub: 'Vuoi giocare come Ospite o creare un Account?',
      welcomeHint: 'Puoi sempre creare un account più tardi dalle impostazioni.',
      guestBtn: '🎮 Gioca come Ospite',
      accountBtn: '✨ Crea un Account',
      guestWarnTitle: 'Stai giocando come Ospite',
      guestWarnBody: 'I tuoi progressi restano solo su questo dispositivo e in questo browser. Se cancelli la cache o cambi telefono, li perdi. Puoi creare un account quando vuoi per salvarli in modo permanente.',
      guestWarnOk: 'Ho capito, continua',
      guestWarnSwitch: 'Crea un account invece',
      createTitle: 'Crea il tuo account',
      createBody: 'Per creare un account ci servono solo un nickname e una password: niente email, niente dati personali. L\'unica cosa che salviamo è il tuo progresso nei giochi, così lo ritrovi su ogni dispositivo. Nessun metodo di pagamento: è gratis per davvero. Nessuna pubblicità, nessun dato venduto, nessun tracciamento — se vuoi verificarlo, scorri in fondo alla home: trovi il link al codice sorgente completo.',
      nicknameLabel: 'Nickname',
      nicknameHint: 'lettere, numeri, underscore — 3-20 caratteri',
      passwordLabel: 'Password',
      passwordConfirmLabel: 'Ripeti la password',
      pwRuleLength: 'almeno 8 caratteri',
      pwRuleDigits: 'almeno 2 numeri',
      pwRuleSpecials: 'almeno 2 caratteri speciali',
      pwMismatch: 'Le due password non coincidono',
      createSubmit: 'Crea account',
      haveAccount: 'Hai già un account?',
      loginLink: 'Accedi',
      recoveryTitle: '🔑 Salva il tuo codice di recupero',
      recoveryBody: 'Senza email, questo codice è l\'unico modo per reimpostare la password se la dimentichi. Scrivilo o fai uno screenshot: non potremo mostrartelo di nuovo.',
      recoveryAck: 'L\'ho salvato in un posto sicuro',
      recoveryContinue: 'Continua',
      recoveryCopy: 'Copia',
      recoveryCopied: 'Copiato!',
      loginTitle: 'Accedi',
      loginSubmit: 'Accedi',
      forgotLink: 'Password dimenticata?',
      noAccountYet: 'Non hai un account?',
      createLink: 'Crea uno',
      forgotTitle: 'Recupera l\'accesso',
      forgotBody: 'Inserisci il tuo nickname, il codice di recupero che ti avevamo mostrato e una nuova password.',
      recoveryCodeLabel: 'Codice di recupero',
      newPasswordLabel: 'Nuova password',
      forgotSubmit: 'Reimposta password',
      forgotSuccess: 'Fatto! Ecco il tuo nuovo codice di recupero (quello vecchio non funziona più):',
      backToLogin: 'Torna al login',
      accountPanelGuest: 'Stai giocando come Ospite',
      accountPanelSignedIn: n => `Ciao, ${n}!`,
      logoutBtn: 'Esci',
      regenCodeBtn: '🔑 Genera un nuovo codice di recupero',
      close: 'Chiudi',
      errGeneric: 'Qualcosa è andato storto. Riprova.',
      errNicknameTaken: 'Questo nickname è già in uso.',
      errNicknameFormat: 'Nickname non valido: usa solo lettere, numeri e underscore (3-20 caratteri).',
      errLoginFailed: 'Nickname o password sbagliati.',
      errInvalidCode: 'Nickname o codice di recupero non corretti.',
      saving: 'Un attimo…',
    },
    en: {
      welcomeTitle: 'Welcome!',
      welcomeSub: 'Do you want to play as a Guest or create an Account?',
      welcomeHint: 'You can always create an account later from settings.',
      guestBtn: '🎮 Play as Guest',
      accountBtn: '✨ Create an Account',
      guestWarnTitle: 'You\'re playing as a Guest',
      guestWarnBody: 'Your progress stays only on this device and browser. If you clear the cache or switch phones, you\'ll lose it. You can create an account anytime to save it permanently.',
      guestWarnOk: 'Got it, continue',
      guestWarnSwitch: 'Create an account instead',
      createTitle: 'Create your account',
      createBody: 'To create an account we only need a nickname and a password: no email, no personal data. The only thing we save is your game progress, so you can find it on every device. No payment method: it\'s free for real. No ads, no data sold, no tracking — if you want to check for yourself, scroll to the bottom of the home page for a link to the full source code.',
      nicknameLabel: 'Nickname',
      nicknameHint: 'letters, numbers, underscore — 3-20 characters',
      passwordLabel: 'Password',
      passwordConfirmLabel: 'Repeat password',
      pwRuleLength: 'at least 8 characters',
      pwRuleDigits: 'at least 2 numbers',
      pwRuleSpecials: 'at least 2 special characters',
      pwMismatch: 'The two passwords don\'t match',
      createSubmit: 'Create account',
      haveAccount: 'Already have an account?',
      loginLink: 'Log in',
      recoveryTitle: '🔑 Save your recovery code',
      recoveryBody: 'Without email, this code is the only way to reset your password if you forget it. Write it down or take a screenshot: we won\'t be able to show it again.',
      recoveryAck: 'I saved it somewhere safe',
      recoveryContinue: 'Continue',
      recoveryCopy: 'Copy',
      recoveryCopied: 'Copied!',
      loginTitle: 'Log in',
      loginSubmit: 'Log in',
      forgotLink: 'Forgot password?',
      noAccountYet: 'Don\'t have an account?',
      createLink: 'Create one',
      forgotTitle: 'Recover access',
      forgotBody: 'Enter your nickname, the recovery code we showed you, and a new password.',
      recoveryCodeLabel: 'Recovery code',
      newPasswordLabel: 'New password',
      forgotSubmit: 'Reset password',
      forgotSuccess: 'Done! Here\'s your new recovery code (the old one no longer works):',
      backToLogin: 'Back to login',
      accountPanelGuest: 'You\'re playing as a Guest',
      accountPanelSignedIn: n => `Hi, ${n}!`,
      logoutBtn: 'Log out',
      regenCodeBtn: '🔑 Generate a new recovery code',
      close: 'Close',
      errGeneric: 'Something went wrong. Please try again.',
      errNicknameTaken: 'This nickname is already taken.',
      errNicknameFormat: 'Invalid nickname: use only letters, numbers and underscore (3-20 characters).',
      errLoginFailed: 'Wrong nickname or password.',
      errInvalidCode: 'Wrong nickname or recovery code.',
      saving: 'One moment…',
    },
    fr: {
      welcomeTitle: 'Bienvenue !',
      welcomeSub: 'Tu veux jouer en Invité ou créer un Compte ?',
      welcomeHint: 'Tu pourras toujours créer un compte plus tard dans les paramètres.',
      guestBtn: '🎮 Jouer en Invité',
      accountBtn: '✨ Créer un Compte',
      guestWarnTitle: 'Tu joues en Invité',
      guestWarnBody: 'Ta progression reste seulement sur cet appareil et ce navigateur. Si tu vides le cache ou changes de téléphone, tu la perdras. Tu peux créer un compte à tout moment pour la sauvegarder définitivement.',
      guestWarnOk: 'Compris, continuer',
      guestWarnSwitch: 'Créer un compte à la place',
      createTitle: 'Crée ton compte',
      createBody: 'Pour créer un compte, il nous faut seulement un pseudo et un mot de passe : pas d\'email, pas de données personnelles. La seule chose sauvegardée est ta progression de jeu, pour la retrouver sur tous tes appareils. Aucun moyen de paiement : c\'est vraiment gratuit. Pas de pub, pas de données vendues, pas de traçage — si tu veux vérifier, descends en bas de la page d\'accueil pour le lien vers le code source complet.',
      nicknameLabel: 'Pseudo',
      nicknameHint: 'lettres, chiffres, underscore — 3-20 caractères',
      passwordLabel: 'Mot de passe',
      passwordConfirmLabel: 'Répète le mot de passe',
      pwRuleLength: 'au moins 8 caractères',
      pwRuleDigits: 'au moins 2 chiffres',
      pwRuleSpecials: 'au moins 2 caractères spéciaux',
      pwMismatch: 'Les deux mots de passe ne correspondent pas',
      createSubmit: 'Créer le compte',
      haveAccount: 'Tu as déjà un compte ?',
      loginLink: 'Se connecter',
      recoveryTitle: '🔑 Sauvegarde ton code de récupération',
      recoveryBody: 'Sans email, ce code est le seul moyen de réinitialiser ton mot de passe si tu l\'oublies. Note-le ou fais une capture d\'écran : nous ne pourrons plus te le montrer.',
      recoveryAck: 'Je l\'ai sauvegardé en lieu sûr',
      recoveryContinue: 'Continuer',
      recoveryCopy: 'Copier',
      recoveryCopied: 'Copié !',
      loginTitle: 'Se connecter',
      loginSubmit: 'Se connecter',
      forgotLink: 'Mot de passe oublié ?',
      noAccountYet: 'Pas encore de compte ?',
      createLink: 'Créer',
      forgotTitle: 'Récupérer l\'accès',
      forgotBody: 'Entre ton pseudo, le code de récupération qu\'on t\'a montré, et un nouveau mot de passe.',
      recoveryCodeLabel: 'Code de récupération',
      newPasswordLabel: 'Nouveau mot de passe',
      forgotSubmit: 'Réinitialiser',
      forgotSuccess: 'C\'est fait ! Voici ton nouveau code de récupération (l\'ancien ne fonctionne plus) :',
      backToLogin: 'Retour à la connexion',
      accountPanelGuest: 'Tu joues en Invité',
      accountPanelSignedIn: n => `Salut, ${n} !`,
      logoutBtn: 'Se déconnecter',
      regenCodeBtn: '🔑 Générer un nouveau code de récupération',
      close: 'Fermer',
      errGeneric: 'Une erreur est survenue. Réessaie.',
      errNicknameTaken: 'Ce pseudo est déjà pris.',
      errNicknameFormat: 'Pseudo invalide : utilise seulement lettres, chiffres et underscore (3-20 caractères).',
      errLoginFailed: 'Pseudo ou mot de passe incorrect.',
      errInvalidCode: 'Pseudo ou code de récupération incorrect.',
      saving: 'Un instant…',
    },
  };
  function getSiteLanguage() {
    try { const v = localStorage.getItem('ffr-language'); return (v && STR[v]) ? v : 'it'; } catch (e) { return 'it'; }
  }
  function tt(key) {
    const lang = getSiteLanguage();
    const val = (STR[lang] && STR[lang][key] != null) ? STR[lang][key] : STR.it[key];
    return val;
  }

  // ---------------- validazione ----------------
  function isValidNickname(n) { return /^[A-Za-z0-9_]{3,20}$/.test(n); }
  function passwordChecks(pw) {
    return {
      length: pw.length >= 8,
      digits: (pw.match(/[0-9]/g) || []).length >= 2,
      specials: (pw.match(/[^A-Za-z0-9]/g) || []).length >= 2,
    };
  }
  function isValidPassword(pw) { const c = passwordChecks(pw); return c.length && c.digits && c.specials; }
  function nicknameToEmail(n) { return n.trim().toLowerCase() + EMAIL_DOMAIN; }

  // ---------------- crypto (stessa logica della Edge Function) ----------------
  function canonicalizeCode(code) { return code.replace(/[^A-Za-z0-9]/g, '').toUpperCase(); }
  async function sha256Hex(input) {
    const bytes = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  function generateRecoveryCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(10));
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    return hex.match(/.{1,4}/g).join('-');
  }

  // ---------------- client Supabase ----------------
  let supabaseClient = null;
  let readyPromise = null;
  function loadSupabaseLib() {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.onload = resolve;
      s.onerror = () => reject(new Error('supabase_lib_load_failed'));
      document.head.appendChild(s);
    });
  }
  async function getClient() {
    if (!readyPromise) {
      readyPromise = loadSupabaseLib().then(() => {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        return supabaseClient;
      });
    }
    return readyPromise;
  }

  // ---------------- stato ----------------
  let currentUser = null;
  let currentNickname = null;
  const listeners = [];
  function notify() {
    listeners.forEach(fn => { try { fn({ user: currentUser, nickname: currentNickname }); } catch (e) { /* ignora listener rotto */ } });
  }

  async function fetchNickname(userId) {
    const client = await getClient();
    const { data } = await client.from('profiles').select('nickname').eq('id', userId).maybeSingle();
    return data ? data.nickname : null;
  }

  // ---------------- progresso: locale + cloud ----------------
  async function migrateGuestProgressToAccount(userId) {
    const client = await getClient();
    for (const game of Object.keys(GAME_LOCAL_KEYS)) {
      try {
        const raw = localStorage.getItem(localKeyFor(game));
        if (!raw) continue;
        const data = JSON.parse(raw);
        await client.from('game_progress').upsert(
          { user_id: userId, game, data, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,game' }
        );
      } catch (e) { /* un gioco che fallisce non deve bloccare gli altri */ }
    }
  }

  async function saveProgress(game, data, score) {
    try { localStorage.setItem(localKeyFor(game), JSON.stringify(data)); } catch (e) { /* storage pieno/negato: pazienza */ }
    if (!currentUser) return;
    try {
      const client = await getClient();
      await client.from('game_progress').upsert(
        { user_id: currentUser.id, game, data, score: (score == null ? null : score), updated_at: new Date().toISOString() },
        { onConflict: 'user_id,game' }
      );
    } catch (e) { /* offline: verrà ritentato al prossimo saveProgress */ }
  }

  async function loadProgress(game) {
    let local = null;
    try { const raw = localStorage.getItem(localKeyFor(game)); if (raw) local = JSON.parse(raw); } catch (e) { /* ignora */ }
    if (!currentUser) return local;
    try {
      const client = await getClient();
      const { data, error } = await client.from('game_progress').select('data').eq('user_id', currentUser.id).eq('game', game).maybeSingle();
      if (error || !data) return local;
      try { localStorage.setItem(localKeyFor(game), JSON.stringify(data.data)); } catch (e) { /* ignora */ }
      return data.data;
    } catch (e) { return local; }
  }

  async function getLeaderboard(game, limit) {
    try {
      const client = await getClient();
      const { data, error } = await client.rpc('get_leaderboard', { p_game: game, p_limit: limit || 20 });
      if (error) return [];
      return data || [];
    } catch (e) { return []; }
  }

  // ---------------- UI: stili ----------------
  function injectStyles() {
    if (document.getElementById('ffr-auth-styles')) return;
    const style = document.createElement('style');
    style.id = 'ffr-auth-styles';
    style.textContent = `
      .ffr-auth-overlay{ position:fixed; inset:0; z-index:9999; background:rgba(9,60,86,0.6);
        display:flex; align-items:center; justify-content:center; padding:20px;
        opacity:0; pointer-events:none; transition:opacity 0.2s ease; }
      .ffr-auth-overlay.show{ opacity:1; pointer-events:auto; }
      .ffr-auth-card{ background:#FBEBC9; border-radius:24px; padding:26px 24px 22px;
        width:100%; max-width:360px; max-height:88vh; overflow-y:auto;
        text-align:center; color:#0B2B3C; font-family:'Nunito', sans-serif;
        box-shadow:0 12px 0 #EAD3A0, 0 20px 30px rgba(0,0,0,0.35); }
      .ffr-auth-card h2{ font-family:'Baloo 2', sans-serif; font-size:22px; margin:2px 0 4px; }
      .ffr-auth-card p{ font-size:14px; color:#3d4f58; margin:6px 0 14px; font-weight:600; line-height:1.45; text-align:left; }
      .ffr-auth-btn{ display:block; width:100%; background:white; border-radius:14px; padding:13px 16px;
        box-shadow:0 3px 0 #E2D2A5; border:none; cursor:pointer; font-family:'Baloo 2', sans-serif;
        font-weight:700; font-size:16px; color:#0B2B3C; margin-bottom:10px; }
      .ffr-auth-btn:active{ transform:translateY(2px); box-shadow:none; }
      .ffr-auth-btn.primary{ background:linear-gradient(180deg,#14A085,#0d6e5c); color:#fff; box-shadow:0 3px 0 #0a5747; }
      .ffr-auth-btn.ghost{ background:transparent; box-shadow:none; color:#0B4F6C; text-decoration:underline; font-size:14px; padding:6px; }
      .ffr-auth-field{ text-align:left; margin-bottom:12px; }
      .ffr-auth-field label{ display:block; font-weight:700; font-size:13px; margin-bottom:4px; }
      .ffr-auth-field input{ width:100%; padding:11px 12px; border-radius:10px; border:2px solid #EAD3A0;
        font-size:15px; font-family:'Nunito', sans-serif; background:#fff; color:#0B2B3C; }
      .ffr-auth-field input:focus{ outline:none; border-color:#14A085; }
      .ffr-auth-hint{ font-size:11px; color:#7a6a4a; margin-top:3px; font-weight:600; }
      .ffr-auth-rules{ list-style:none; padding:0; margin:6px 0 14px; font-size:12px; font-weight:700; text-align:left; }
      .ffr-auth-rules li{ padding:2px 0; color:#a04a2a; }
      .ffr-auth-rules li.ok{ color:#14805f; }
      .ffr-auth-rules li::before{ content:'✗ '; }
      .ffr-auth-rules li.ok::before{ content:'✓ '; }
      .ffr-auth-error{ background:#f8d3c4; color:#8a2f0f; border-radius:10px; padding:8px 10px;
        font-size:13px; font-weight:700; margin-bottom:12px; text-align:left; }
      .ffr-auth-code{ font-family:monospace; font-size:20px; font-weight:700; letter-spacing:1px;
        background:#fff; border-radius:12px; padding:14px; margin:10px 0; word-break:break-all; }
      .ffr-auth-check{ display:flex; align-items:center; gap:8px; text-align:left; font-size:13px;
        font-weight:700; margin:10px 0 16px; }
      .ffr-auth-icon-btn{ position:fixed; top:max(20px, env(safe-area-inset-top)); right:20px; z-index:40;
        width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center;
        background:rgba(255,255,255,0.22); border:1.5px solid rgba(255,255,255,0.4); backdrop-filter:blur(6px);
        color:#fff; font-size:17px; cursor:pointer; }
      .ffr-auth-icon-btn:active{ transform:scale(0.94); }
    `;
    document.head.appendChild(style);
  }

  // ---------------- UI: overlay generico ----------------
  function buildOverlay(id) {
    let el = document.getElementById(id);
    if (el) return el;
    el = document.createElement('div');
    el.id = id;
    el.className = 'ffr-auth-overlay';
    el.innerHTML = '<div class="ffr-auth-card"></div>';
    document.body.appendChild(el);
    return el;
  }
  function showOverlay(id, dismissible) {
    const el = buildOverlay(id);
    el.classList.add('show');
    if (dismissible) {
      el.onclick = (e) => { if (e.target === el) hideOverlay(id); };
    } else {
      el.onclick = null;
    }
    return el.querySelector('.ffr-auth-card');
  }
  function hideOverlay(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('show');
  }
  function hideAllOverlays() {
    document.querySelectorAll('.ffr-auth-overlay').forEach(el => el.classList.remove('show'));
  }

  // ---------------- modali ----------------
  function openWelcomeModal() {
    const card = showOverlay('ffr-welcome-overlay', false);
    card.innerHTML = `
      <h2>${tt('welcomeTitle')}</h2>
      <p>${tt('welcomeSub')}</p>
      <button class="ffr-auth-btn primary" data-act="guest">${tt('guestBtn')}</button>
      <button class="ffr-auth-btn" data-act="account">${tt('accountBtn')}</button>
      <p style="font-size:11px;text-align:center;color:#7a6a4a;margin-top:4px;">${tt('welcomeHint')}</p>
    `;
    card.querySelector('[data-act="guest"]').onclick = () => { hideOverlay('ffr-welcome-overlay'); openGuestWarnModal(); };
    card.querySelector('[data-act="account"]').onclick = () => { hideOverlay('ffr-welcome-overlay'); openCreateAccountModal(); };
  }

  function openGuestWarnModal() {
    const card = showOverlay('ffr-guestwarn-overlay', false);
    card.innerHTML = `
      <h2>${tt('guestWarnTitle')}</h2>
      <p>${tt('guestWarnBody')}</p>
      <button class="ffr-auth-btn primary" data-act="ok">${tt('guestWarnOk')}</button>
      <button class="ffr-auth-btn ghost" data-act="switch">${tt('guestWarnSwitch')}</button>
    `;
    card.querySelector('[data-act="ok"]').onclick = () => {
      try { localStorage.setItem(LS_CHOICE, 'guest'); } catch (e) { /* ignora */ }
      hideOverlay('ffr-guestwarn-overlay');
    };
    card.querySelector('[data-act="switch"]').onclick = () => { hideOverlay('ffr-guestwarn-overlay'); openCreateAccountModal(); };
  }

  function renderPasswordRules(pw) {
    const c = passwordChecks(pw);
    return `
      <ul class="ffr-auth-rules">
        <li class="${c.length ? 'ok' : ''}">${tt('pwRuleLength')}</li>
        <li class="${c.digits ? 'ok' : ''}">${tt('pwRuleDigits')}</li>
        <li class="${c.specials ? 'ok' : ''}">${tt('pwRuleSpecials')}</li>
      </ul>
    `;
  }

  function openCreateAccountModal() {
    const card = showOverlay('ffr-create-overlay', true);
    card.innerHTML = `
      <h2>${tt('createTitle')}</h2>
      <p>${tt('createBody')}</p>
      <div id="ffr-create-error"></div>
      <div class="ffr-auth-field">
        <label>${tt('nicknameLabel')}</label>
        <input type="text" id="ffr-nickname" autocomplete="username" maxlength="20">
        <div class="ffr-auth-hint">${tt('nicknameHint')}</div>
      </div>
      <div class="ffr-auth-field">
        <label>${tt('passwordLabel')}</label>
        <input type="password" id="ffr-password" autocomplete="new-password">
      </div>
      <div id="ffr-pw-rules"></div>
      <div class="ffr-auth-field">
        <label>${tt('passwordConfirmLabel')}</label>
        <input type="password" id="ffr-password-confirm" autocomplete="new-password">
      </div>
      <button class="ffr-auth-btn primary" data-act="submit">${tt('createSubmit')}</button>
      <p style="text-align:center;font-size:13px;margin-top:6px;">
        ${tt('haveAccount')} <a href="#" data-act="login" style="color:#0B4F6C;font-weight:700;">${tt('loginLink')}</a>
      </p>
    `;
    const pwInput = card.querySelector('#ffr-password');
    const rulesBox = card.querySelector('#ffr-pw-rules');
    const renderRules = () => { rulesBox.innerHTML = renderPasswordRules(pwInput.value); };
    pwInput.addEventListener('input', renderRules);
    renderRules();

    card.querySelector('[data-act="login"]').onclick = (e) => { e.preventDefault(); hideOverlay('ffr-create-overlay'); openLoginModal(); };
    card.querySelector('[data-act="submit"]').onclick = () => handleCreateAccount(card);
  }

  function showError(card, selector, msg) {
    const box = card.querySelector(selector);
    box.innerHTML = `<div class="ffr-auth-error">${msg}</div>`;
  }

  async function handleCreateAccount(card) {
    const nickname = card.querySelector('#ffr-nickname').value.trim();
    const password = card.querySelector('#ffr-password').value;
    const confirm = card.querySelector('#ffr-password-confirm').value;
    const errBox = '#ffr-create-error';
    card.querySelector(errBox).innerHTML = '';

    if (!isValidNickname(nickname)) return showError(card, errBox, tt('errNicknameFormat'));
    if (!isValidPassword(password)) return showError(card, errBox, tt('errGeneric'));
    if (password !== confirm) return showError(card, errBox, tt('pwMismatch'));

    const submitBtn = card.querySelector('[data-act="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = tt('saving');
    try {
      const client = await getClient();
      const { data, error } = await client.auth.signUp({
        email: nicknameToEmail(nickname),
        password,
        options: { data: { nickname } },
      });
      if (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = tt('createSubmit');
        if (/already registered|already exists/i.test(error.message || '')) return showError(card, errBox, tt('errNicknameTaken'));
        return showError(card, errBox, tt('errGeneric'));
      }
      const userId = data.user.id;
      currentUser = data.user;
      currentNickname = nickname;
      try { localStorage.setItem(LS_CHOICE, 'account'); } catch (e) { /* ignora */ }
      await migrateGuestProgressToAccount(userId);

      const code = generateRecoveryCode();
      const hash = await sha256Hex(canonicalizeCode(code));
      await client.from('profiles').update({ recovery_code_hash: hash }).eq('id', userId);

      hideOverlay('ffr-create-overlay');
      openRecoveryCodeModal(code, () => notify());
    } catch (e) {
      submitBtn.disabled = false;
      submitBtn.textContent = tt('createSubmit');
      showError(card, errBox, tt('errGeneric'));
    }
  }

  function openRecoveryCodeModal(code, onDone) {
    const card = showOverlay('ffr-recovery-overlay', false);
    card.innerHTML = `
      <h2>${tt('recoveryTitle')}</h2>
      <p>${tt('recoveryBody')}</p>
      <div class="ffr-auth-code" id="ffr-code-text">${code}</div>
      <button class="ffr-auth-btn ghost" data-act="copy">${tt('recoveryCopy')}</button>
      <label class="ffr-auth-check">
        <input type="checkbox" id="ffr-recovery-ack">
        ${tt('recoveryAck')}
      </label>
      <button class="ffr-auth-btn primary" data-act="continue" disabled style="opacity:0.5;">${tt('recoveryContinue')}</button>
    `;
    const ack = card.querySelector('#ffr-recovery-ack');
    const continueBtn = card.querySelector('[data-act="continue"]');
    ack.addEventListener('change', () => {
      continueBtn.disabled = !ack.checked;
      continueBtn.style.opacity = ack.checked ? '1' : '0.5';
    });
    card.querySelector('[data-act="copy"]').onclick = (e) => {
      navigator.clipboard.writeText(code).then(() => { e.target.textContent = tt('recoveryCopied'); });
    };
    continueBtn.onclick = () => { hideOverlay('ffr-recovery-overlay'); if (onDone) onDone(); };
  }

  function openLoginModal() {
    const card = showOverlay('ffr-login-overlay', true);
    card.innerHTML = `
      <h2>${tt('loginTitle')}</h2>
      <div id="ffr-login-error"></div>
      <div class="ffr-auth-field">
        <label>${tt('nicknameLabel')}</label>
        <input type="text" id="ffr-login-nickname" autocomplete="username">
      </div>
      <div class="ffr-auth-field">
        <label>${tt('passwordLabel')}</label>
        <input type="password" id="ffr-login-password" autocomplete="current-password">
      </div>
      <button class="ffr-auth-btn primary" data-act="submit">${tt('loginSubmit')}</button>
      <p style="text-align:center;font-size:13px;margin-top:6px;">
        <a href="#" data-act="forgot" style="color:#0B4F6C;font-weight:700;">${tt('forgotLink')}</a>
      </p>
      <p style="text-align:center;font-size:13px;">
        ${tt('noAccountYet')} <a href="#" data-act="create" style="color:#0B4F6C;font-weight:700;">${tt('createLink')}</a>
      </p>
    `;
    card.querySelector('[data-act="forgot"]').onclick = (e) => { e.preventDefault(); hideOverlay('ffr-login-overlay'); openForgotModal(); };
    card.querySelector('[data-act="create"]').onclick = (e) => { e.preventDefault(); hideOverlay('ffr-login-overlay'); openCreateAccountModal(); };
    card.querySelector('[data-act="submit"]').onclick = () => handleLogin(card);
  }

  async function handleLogin(card) {
    const nickname = card.querySelector('#ffr-login-nickname').value.trim();
    const password = card.querySelector('#ffr-login-password').value;
    const errBox = '#ffr-login-error';
    card.querySelector(errBox).innerHTML = '';
    if (!nickname || !password) return showError(card, errBox, tt('errGeneric'));

    const submitBtn = card.querySelector('[data-act="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = tt('saving');
    try {
      const client = await getClient();
      const { data, error } = await client.auth.signInWithPassword({ email: nicknameToEmail(nickname), password });
      submitBtn.disabled = false;
      submitBtn.textContent = tt('loginSubmit');
      if (error) return showError(card, errBox, tt('errLoginFailed'));
      currentUser = data.user;
      currentNickname = nickname;
      try { localStorage.setItem(LS_CHOICE, 'account'); } catch (e) { /* ignora */ }
      hideOverlay('ffr-login-overlay');
      notify();
    } catch (e) {
      submitBtn.disabled = false;
      submitBtn.textContent = tt('loginSubmit');
      showError(card, errBox, tt('errGeneric'));
    }
  }

  function openForgotModal() {
    const card = showOverlay('ffr-forgot-overlay', true);
    card.innerHTML = `
      <h2>${tt('forgotTitle')}</h2>
      <p>${tt('forgotBody')}</p>
      <div id="ffr-forgot-error"></div>
      <div class="ffr-auth-field">
        <label>${tt('nicknameLabel')}</label>
        <input type="text" id="ffr-forgot-nickname" autocomplete="username">
      </div>
      <div class="ffr-auth-field">
        <label>${tt('recoveryCodeLabel')}</label>
        <input type="text" id="ffr-forgot-code" placeholder="XXXX-XXXX-XXXX-XXXX-XXXX">
      </div>
      <div class="ffr-auth-field">
        <label>${tt('newPasswordLabel')}</label>
        <input type="password" id="ffr-forgot-password" autocomplete="new-password">
      </div>
      <div id="ffr-forgot-pw-rules"></div>
      <button class="ffr-auth-btn primary" data-act="submit">${tt('forgotSubmit')}</button>
      <p style="text-align:center;font-size:13px;margin-top:6px;">
        <a href="#" data-act="back" style="color:#0B4F6C;font-weight:700;">${tt('backToLogin')}</a>
      </p>
    `;
    const pwInput = card.querySelector('#ffr-forgot-password');
    const rulesBox = card.querySelector('#ffr-forgot-pw-rules');
    const renderRules = () => { rulesBox.innerHTML = renderPasswordRules(pwInput.value); };
    pwInput.addEventListener('input', renderRules);
    renderRules();
    card.querySelector('[data-act="back"]').onclick = (e) => { e.preventDefault(); hideOverlay('ffr-forgot-overlay'); openLoginModal(); };
    card.querySelector('[data-act="submit"]').onclick = () => handleForgot(card);
  }

  async function handleForgot(card) {
    const nickname = card.querySelector('#ffr-forgot-nickname').value.trim();
    const code = card.querySelector('#ffr-forgot-code').value.trim();
    const newPassword = card.querySelector('#ffr-forgot-password').value;
    const errBox = '#ffr-forgot-error';
    card.querySelector(errBox).innerHTML = '';
    if (!nickname || !code) return showError(card, errBox, tt('errGeneric'));
    if (!isValidPassword(newPassword)) return showError(card, errBox, tt('errGeneric'));

    const submitBtn = card.querySelector('[data-act="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = tt('saving');
    try {
      const res = await fetch(RECOVER_FN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_KEY, 'apikey': SUPABASE_KEY },
        body: JSON.stringify({ nickname, recovery_code: code, new_password: newPassword }),
      });
      const json = await res.json();
      submitBtn.disabled = false;
      submitBtn.textContent = tt('forgotSubmit');
      if (!res.ok || !json.success) return showError(card, errBox, tt('errInvalidCode'));
      hideOverlay('ffr-forgot-overlay');
      openRecoveryCodeModal(json.new_recovery_code, () => openLoginModal());
    } catch (e) {
      submitBtn.disabled = false;
      submitBtn.textContent = tt('forgotSubmit');
      showError(card, errBox, tt('errGeneric'));
    }
  }

  function openAccountPanel() {
    const card = showOverlay('ffr-panel-overlay', true);
    if (currentUser) {
      card.innerHTML = `
        <h2>${tt('accountPanelSignedIn')(currentNickname || '')}</h2>
        <button class="ffr-auth-btn primary" data-act="regen">${tt('regenCodeBtn')}</button>
        <button class="ffr-auth-btn" data-act="logout">${tt('logoutBtn')}</button>
      `;
      card.querySelector('[data-act="logout"]').onclick = async () => {
        const client = await getClient();
        await client.auth.signOut();
        currentUser = null;
        currentNickname = null;
        hideOverlay('ffr-panel-overlay');
        notify();
      };
      card.querySelector('[data-act="regen"]').onclick = async () => {
        const client = await getClient();
        const code = generateRecoveryCode();
        const hash = await sha256Hex(canonicalizeCode(code));
        await client.from('profiles').update({ recovery_code_hash: hash }).eq('id', currentUser.id);
        hideOverlay('ffr-panel-overlay');
        openRecoveryCodeModal(code, () => {});
      };
    } else {
      card.innerHTML = `
        <h2>${tt('accountPanelGuest')}</h2>
        <button class="ffr-auth-btn primary" data-act="create">${tt('accountBtn')}</button>
        <button class="ffr-auth-btn" data-act="login">${tt('loginLink')}</button>
      `;
      card.querySelector('[data-act="create"]').onclick = () => { hideOverlay('ffr-panel-overlay'); openCreateAccountModal(); };
      card.querySelector('[data-act="login"]').onclick = () => { hideOverlay('ffr-panel-overlay'); openLoginModal(); };
    }
  }

  function injectAccountIcon() {
    if (document.getElementById('ffr-account-icon')) return;
    const btn = document.createElement('button');
    btn.id = 'ffr-account-icon';
    btn.className = 'ffr-auth-icon-btn';
    btn.setAttribute('aria-label', 'Account');
    btn.textContent = '👤';
    btn.onclick = openAccountPanel;
    document.body.appendChild(btn);
  }

  // ---------------- avvio ----------------
  async function restoreSession() {
    try {
      const client = await getClient();
      const { data } = await client.auth.getSession();
      if (data && data.session && data.session.user) {
        currentUser = data.session.user;
        currentNickname = await fetchNickname(currentUser.id);
        notify();
      }
    } catch (e) { /* niente sessione, resta ospite */ }
  }

  function init() {
    injectStyles();
    injectAccountIcon();
    restoreSession().then(() => {
      let choice = null;
      try { choice = localStorage.getItem(LS_CHOICE); } catch (e) { /* ignora */ }
      if (!choice) setTimeout(openWelcomeModal, 400);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ---------------- API pubblica ----------------
  window.FFR = window.FFR || {};
  window.FFR.auth = {
    getUser: () => currentUser,
    getNickname: () => currentNickname,
    isGuest: () => !currentUser,
    onChange: (fn) => { listeners.push(fn); },
    saveProgress,
    loadProgress,
    getLeaderboard,
    openAccountPanel,
    openLoginModal,
  };
})();
