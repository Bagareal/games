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

  // pagine di gioco: window.FFR_AUTH_HEADLESS = true PRIMA di includere questo
  // script disattiva icona account e popup ospite/account (restano solo in
  // home), ma sessione e salvataggio/caricamento progresso restano attivi.
  const HEADLESS = !!window.FFR_AUTH_HEADLESS;

  const SUPABASE_URL = 'https://xlncmgeglotckkeqwyhg.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_d-yMixopM-row39OKWWyKw_MX85caJ2';
  const EMAIL_DOMAIN = '@ffr-games.local';
  const RECOVER_FN_URL = SUPABASE_URL + '/functions/v1/recover-account';
  const LS_CHOICE = 'ffr-account-choice'; // 'guest' | 'account'
  const LS_NICKNAME = 'ffr-nickname';     // copia locale, usata se il database non risponde

  // chiavi localStorage già usate dai singoli giochi per il progresso locale
  const GAME_LOCAL_KEYS = { wordio: 'wordio-progress' };
  function localKeyFor(game) { return GAME_LOCAL_KEYS[game] || ('ffr-' + game + '-progress'); }
  // ogni gioco che salva progresso va elencato qui, non solo quelli con una
  // chiave localStorage "storica" in GAME_LOCAL_KEYS — altrimenti il suo
  // progresso da ospite non viene mai migrato quando si crea un account
  const KNOWN_GAMES = ['wordio', 'boing', 'blokko', 'addy', 'dama'];

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
      guestLabel: 'Ospite',
      logoutBtn: 'Esci',
      regenCodeBtn: '🔑 Genera un nuovo codice di recupero',
      close: 'Chiudi',
      errGeneric: 'Qualcosa è andato storto. Riprova.',
      errNicknameTaken: 'Questo nickname è già in uso.',
      errNicknameFormat: 'Nickname non valido: usa solo lettere, numeri e underscore (3-20 caratteri).',
      errLoginFailed: 'Nickname o password sbagliati.',
      errInvalidCode: 'Nickname o codice di recupero non corretti.',
      saving: 'Un attimo…',
      showPassword: 'Mostra la password',
      hidePassword: 'Nascondi la password',
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
      guestLabel: 'Guest',
      logoutBtn: 'Log out',
      regenCodeBtn: '🔑 Generate a new recovery code',
      close: 'Close',
      errGeneric: 'Something went wrong. Please try again.',
      errNicknameTaken: 'This nickname is already taken.',
      errNicknameFormat: 'Invalid nickname: use only letters, numbers and underscore (3-20 characters).',
      errLoginFailed: 'Wrong nickname or password.',
      errInvalidCode: 'Wrong nickname or recovery code.',
      saving: 'One moment…',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
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
      guestLabel: 'Invité',
      logoutBtn: 'Se déconnecter',
      regenCodeBtn: '🔑 Générer un nouveau code de récupération',
      close: 'Fermer',
      errGeneric: 'Une erreur est survenue. Réessaie.',
      errNicknameTaken: 'Ce pseudo est déjà pris.',
      errNicknameFormat: 'Pseudo invalide : utilise seulement lettres, chiffres et underscore (3-20 caractères).',
      errLoginFailed: 'Pseudo ou mot de passe incorrect.',
      errInvalidCode: 'Pseudo ou code de récupération incorrect.',
      saving: 'Un instant…',
      showPassword: 'Afficher le mot de passe',
      hidePassword: 'Masquer le mot de passe',
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
        attachAuthListener(supabaseClient);
        return supabaseClient;
      }).catch(err => {
        // NON tenersi il fallimento: il risultato di questa promessa viene
        // riusato da tutte le chiamate successive, quindi memorizzando un
        // errore un singolo intoppo di rete durante l'apertura della pagina
        // condannava login, salvataggi e classifiche per tutta la visita,
        // senza riprovare mai. Azzerando, la prossima chiamata riprova.
        readyPromise = null;
        throw err;
      });
    }
    return readyPromise;
  }

  // Tiene allineato lo stato quando la sessione cambia da sola: rinnovo del
  // token, accesso o uscita fatti in un'altra scheda. Senza questo l'interfaccia
  // resta ferma a com'era al caricamento della pagina.
  function attachAuthListener(client) {
    try {
      client.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          currentUser = session.user;
          if (!currentNickname) currentNickname = cachedNickname();
          notify();
        } else if (event === 'SIGNED_OUT') {
          currentUser = null;
          currentNickname = null;
          cacheNickname(null);
          notify();
        }
      });
    } catch (e) { console.error('[FFR] onAuthStateChange non agganciato:', e); }
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

  // Copia del nickname sul dispositivo. Serve come ripiego immediato: appena si
  // sa che sei loggato l'interfaccia può già scrivere il tuo nome, senza dover
  // aspettare (o veder fallire) la richiesta al database.
  function cacheNickname(n) {
    try {
      if (n) localStorage.setItem(LS_NICKNAME, n);
      else localStorage.removeItem(LS_NICKNAME);
    } catch (e) { /* ignora */ }
  }
  function cachedNickname() {
    try { return localStorage.getItem(LS_NICKNAME); } catch (e) { return null; }
  }

  // ---------------- progresso: locale + cloud ----------------
  // NOTA: le chiamate supabase-js (client.from(...).upsert/select/...) NON
  // rifiutano la Promise sugli errori del database (RLS, vincoli, ecc.) — la
  // Promise si risolve comunque, con l'errore dentro il campo `error` della
  // risposta. Va sempre controllato esplicitamente, altrimenti un fallimento
  // (es. una policy RLS che blocca l'upsert) passa completamente inosservato:
  // il codice pensa che sia andato tutto bene mentre in realtà su Supabase
  // non è stato scritto niente. Per questo ogni chiamata qui sotto controlla
  // `error` e lo logga in console, invece di limitarsi al try/catch (che
  // intercetta solo errori di rete, non errori applicativi del database).
  async function migrateGuestProgressToAccount(userId) {
    const client = await getClient();
    for (const game of KNOWN_GAMES) {
      try {
        const raw = localStorage.getItem(localKeyFor(game));
        if (!raw) continue;
        const data = JSON.parse(raw);
        const { error } = await client.from('game_progress').upsert(
          { user_id: userId, game, data, updated_at: new Date().toISOString() },
          { onConflict: 'user_id,game' }
        );
        if (error) console.error('[FFR] migrazione progresso ospite→account fallita per', game, error);
      } catch (e) {
        console.error('[FFR] migrazione progresso ospite→account fallita per', game, e);
      }
    }
  }

  // Data dell'ultimo salvataggio locale, in una chiave a parte: così i
  // salvataggi già presenti sui dispositivi restano leggibili tali e quali
  // (la loro forma non cambia) e chi aggiorna non perde niente.
  function stampKeyFor(game) { return localKeyFor(game) + '-at'; }
  function readStamp(game) {
    try { return Date.parse(localStorage.getItem(stampKeyFor(game)) || '') || null; } catch (e) { return null; }
  }

  async function saveProgress(game, data, score) {
    // stessa data per il salvataggio locale e per quello nel cloud: se il
    // secondo non va a buon fine, il locale risulta più recente ed è
    // esattamente quello che vogliamo sapere al prossimo caricamento
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem(localKeyFor(game), JSON.stringify(data));
      localStorage.setItem(stampKeyFor(game), stamp);
    } catch (e) { /* storage pieno/negato: pazienza */ }
    if (!currentUser) return;
    try {
      const client = await getClient();
      const { error } = await client.from('game_progress').upsert(
        { user_id: currentUser.id, game, data, score: (score == null ? null : score), updated_at: stamp },
        { onConflict: 'user_id,game' }
      );
      if (error) console.error('[FFR] saveProgress(' + game + ') fallito:', error);
    } catch (e) { console.error('[FFR] saveProgress(' + game + ') fallito (rete/offline):', e); }
  }

  // Prima vinceva SEMPRE il cloud, senza guardare le date: chi giocava una
  // partita mentre la connessione (o il caricamento della libreria) non
  // funzionava la salvava solo sul dispositivo, e al primo caricamento
  // riuscito il cloud — più vecchio — gliela cancellava sopra. Ora si
  // confrontano le due date e vince la più recente.
  async function loadProgress(game) {
    let local = null;
    try { const raw = localStorage.getItem(localKeyFor(game)); if (raw) local = JSON.parse(raw); } catch (e) { /* ignora */ }
    if (!currentUser) return local;
    try {
      const client = await getClient();
      const { data, error } = await client.from('game_progress')
        .select('data, score, updated_at').eq('user_id', currentUser.id).eq('game', game).maybeSingle();
      if (error) { console.error('[FFR] loadProgress(' + game + ') fallito:', error); return local; }
      if (!data) return local; // nessun progresso cloud salvato ancora per questo utente/gioco: normale

      const localStamp = readStamp(game);
      const cloudStamp = Date.parse(data.updated_at || '') || null;
      // NB: senza data locale (salvataggi fatti prima di questo aggiornamento)
      // vince il cloud, come faceva prima — è la scelta prudente, evita di
      // spedire in cloud roba vecchia rimasta su un dispositivo poco usato
      if (local && localStamp && cloudStamp && localStamp > cloudStamp) {
        console.warn('[FFR] loadProgress(' + game + '): il dispositivo ha dati più recenti del cloud, li tengo e li mando su');
        try {
          // si riscrive nel cloud tenendo il punteggio che c'era già: qui non
          // sappiamo quale sia quello giusto e non va mai azzerato
          const { error: upErr } = await client.from('game_progress').upsert(
            { user_id: currentUser.id, game, data: local, score: data.score, updated_at: new Date(localStamp).toISOString() },
            { onConflict: 'user_id,game' }
          );
          if (upErr) console.error('[FFR] loadProgress(' + game + '): rinvio al cloud fallito:', upErr);
        } catch (e) { console.error('[FFR] loadProgress(' + game + '): rinvio al cloud fallito:', e); }
        return local;
      }

      try {
        localStorage.setItem(localKeyFor(game), JSON.stringify(data.data));
        if (data.updated_at) localStorage.setItem(stampKeyFor(game), data.updated_at);
      } catch (e) { /* ignora */ }
      return data.data;
    } catch (e) { console.error('[FFR] loadProgress(' + game + ') fallito (rete/offline):', e); return local; }
  }

  // Voce di classifica "pura": stessa tabella dei progressi ma su una chiave
  // dedicata (es. 'boing:easy', 'wordio:en'), con il solo punteggio e nessun
  // dato di gioco dentro. Serve perché una classifica per difficoltà/lingua ha
  // bisogno di un punteggio separato per ognuna, mentre il progresso vero resta
  // in un'unica riga per gioco (in Wordio monete e aiuti sono condivisi fra le
  // lingue: spezzare quella riga li manderebbe in conflitto).
  // A differenza di saveProgress non tocca localStorage: è roba solo di cloud,
  // non un salvataggio da recuperare offline.
  async function saveScore(game, score) {
    if (!currentUser || score == null) return;
    try {
      const client = await getClient();
      const { error } = await client.from('game_progress').upsert(
        { user_id: currentUser.id, game, data: {}, score, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,game' }
      );
      if (error) console.error('[FFR] saveScore(' + game + ') fallito:', error);
    } catch (e) { console.error('[FFR] saveScore(' + game + ') fallito (rete/offline):', e); }
  }

  // Posizione in classifica dell'utente loggato, anche quando è fuori dalle
  // prime righe scaricate. Non si può calcolare lato client: le regole di
  // sicurezza (RLS) lasciano leggere solo le PROPRIE righe di game_progress,
  // quindi contare quanti hanno fatto meglio richiede una funzione SQL
  // SECURITY DEFINER (get_my_rank, vedi supabase/migrations/0003_*).
  // Restituisce null se non loggato o se non ha ancora un punteggio.
  async function getMyRank(game) {
    if (!currentUser) return null;
    try {
      const client = await getClient();
      const { data, error } = await client.rpc('get_my_rank', { p_game: game });
      if (error) { console.error('[FFR] getMyRank(' + game + ') fallita:', error); return null; }
      const row = Array.isArray(data) ? data[0] : data;
      return (row && row.rank != null) ? { rank: row.rank, score: row.score } : null;
    } catch (e) { console.error('[FFR] getMyRank(' + game + ') fallita (rete/offline):', e); return null; }
  }

  async function getLeaderboard(game, limit) {
    try {
      const client = await getClient();
      const { data, error } = await client.rpc('get_leaderboard', { p_game: game, p_limit: limit || 20 });
      if (error) { console.error('[FFR] getLeaderboard(' + game + ') fallita:', error); return []; }
      return data || [];
    } catch (e) { console.error('[FFR] getLeaderboard(' + game + ') fallita (rete/offline):', e); return []; }
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
      /* box-sizing esplicito: questi campi sono larghi al 100% e hanno il loro
         bordo e imbottitura, e non tutte le pagine che includono questo file
         azzerano il box-sizing per conto proprio */
      .ffr-auth-field input{ box-sizing:border-box; width:100%; padding:11px 12px; border-radius:10px; border:2px solid #EAD3A0;
        font-size:15px; font-family:'Nunito', sans-serif; background:#fff; color:#0B2B3C; }
      .ffr-auth-field input:focus{ outline:none; border-color:#14A085; }
      /* occhio "mostra password": area di tocco 44x44 (la misura minima perché
         un dito poco preciso la prenda al primo colpo) sovrapposta al campo,
         che in cambio si tiene libero lo spazio a destra */
      .ffr-auth-pw{ position:relative; }
      .ffr-auth-pw input{ padding-right:48px; }
      .ffr-auth-eye{ position:absolute; top:50%; right:2px; transform:translateY(-50%);
        width:44px; height:44px; padding:0; display:flex; align-items:center; justify-content:center;
        background:none; border:none; cursor:pointer; color:#4a6270; }
      .ffr-auth-eye:active{ transform:translateY(-50%) scale(0.92); }
      .ffr-auth-eye svg{ display:block; }
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
      .ffr-auth-wrap{ display:flex; align-items:center; gap:8px; margin-left:auto; }
      .ffr-auth-label{ font-family:'Baloo 2', sans-serif; font-weight:700; font-size:13px; color:#fff;
        text-shadow:0 1px 3px rgba(0,0,0,0.35); max-width:120px; overflow:hidden; text-overflow:ellipsis;
        white-space:nowrap; }
      .ffr-auth-icon-btn{ width:38px; height:38px; border-radius:50%; display:flex; align-items:center;
        justify-content:center; background:rgba(255,255,255,0.22); border:1.5px solid rgba(255,255,255,0.4);
        backdrop-filter:blur(6px); color:#fff; font-size:17px; cursor:pointer; flex:0 0 auto; }
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
  // La X in alto (shared/modal-x.js) va solo sui pannelli che si possono
  // chiudere senza perdere niente. Restano senza: la scelta iniziale
  // ospite/account, l'avviso "stai giocando come ospite" e soprattutto il codice
  // di recupero, che si vede una volta sola e va salvato prima di chiudere.
  function addCloseX(card) {
    if (window.FFR && window.FFR.addModalX && card && card.parentElement) {
      window.FFR.addModalX(card.parentElement);
    }
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

  // Occhietto per rivedere quello che si è scritto: senza, l'unico modo di
  // accorgersi di un refuso è il messaggio d'errore dopo aver premuto il
  // pulsante. Va su OGNI campo password del sito (creazione, conferma, accesso,
  // nuova password nel recupero), non solo su quelli della creazione.
  const EYE_OPEN = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3.2"/></svg>';
  const EYE_OFF = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"/><circle cx="12" cy="12" r="3.2"/><path d="M3 3l18 18"/></svg>';
  function attachPasswordEyes(card) {
    card.querySelectorAll('input[type="password"]').forEach(input => {
      if (input.parentElement && input.parentElement.classList.contains('ffr-auth-pw')) return;
      const wrap = document.createElement('div');
      wrap.className = 'ffr-auth-pw';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ffr-auth-eye';
      btn.innerHTML = EYE_OPEN;
      btn.setAttribute('aria-label', tt('showPassword'));
      btn.title = tt('showPassword');
      btn.onclick = () => {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? EYE_OFF : EYE_OPEN;
        const label = tt(show ? 'hidePassword' : 'showPassword');
        btn.setAttribute('aria-label', label);
        btn.title = label;
        // il focus torna al campo con il cursore dov'era: su telefono il
        // passaggio nascosto→visibile altrimenti chiude la tastiera e riporta
        // il cursore in fondo, e chi stava correggendo una lettera si perde
        const pos = input.value.length;
        input.focus();
        try { input.setSelectionRange(pos, pos); } catch (e) { /* alcuni browser non lo permettono su type=text appena cambiato */ }
      };
      wrap.appendChild(btn);
    });
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
    attachPasswordEyes(card);
    addCloseX(card);

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
      cacheNickname(nickname);
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
    attachPasswordEyes(card);
    addCloseX(card);
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
      cacheNickname(nickname);
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
    attachPasswordEyes(card);
    addCloseX(card);
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
        cacheNickname(null);
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
    addCloseX(card);
  }

  function updateAccountLabel() {
    const label = document.getElementById('ffr-account-label');
    if (!label) return;
    label.textContent = currentUser ? (currentNickname || '') : tt('guestLabel');
  }

  function injectAccountIcon() {
    if (document.getElementById('ffr-account-icon')) return;
    const wrap = document.createElement('div');
    wrap.className = 'ffr-auth-wrap';
    const label = document.createElement('span');
    label.id = 'ffr-account-label';
    label.className = 'ffr-auth-label';
    const btn = document.createElement('button');
    btn.id = 'ffr-account-icon';
    btn.className = 'ffr-auth-icon-btn';
    btn.setAttribute('aria-label', 'Account');
    btn.textContent = '👤';
    btn.onclick = openAccountPanel;
    wrap.appendChild(label);
    wrap.appendChild(btn);
    // stesso contenitore dell'icona lingua (.topbar): scorre via con la
    // pagina come lei, invece di restare fissa in overlay sopra i contenuti
    const topbar = document.querySelector('.topbar');
    (topbar || document.body).appendChild(wrap);
    updateAccountLabel();
    listeners.push(updateAccountLabel);
  }

  // ---------------- avvio ----------------
  async function restoreSession() {
    try {
      const client = await getClient();
      const { data, error } = await client.auth.getSession();
      if (error) console.error('[FFR] getSession fallita:', error);
      if (data && data.session && data.session.user) {
        currentUser = data.session.user;
        // Si avvisa SUBITO l'interfaccia, prima di chiedere il nickname al
        // database. Prima l'ordine era invertito: se quella richiesta falliva
        // si finiva nel catch e notify() non veniva mai eseguito, così restavi
        // etichettato "Ospite" per tutta la visita pur essendo loggato (e senza
        // nickname saltava anche la tua riga evidenziata in classifica).
        currentNickname = cachedNickname();
        notify();
        try {
          const fresh = await fetchNickname(currentUser.id);
          if (fresh) {
            currentNickname = fresh;
            cacheNickname(fresh);
            notify();
          }
        } catch (e) {
          console.error('[FFR] nickname non recuperato, resta quello salvato sul dispositivo:', e);
        }
      }
    } catch (e) { console.error('[FFR] ripristino sessione fallito:', e); }
  }

  // parte subito, non aspetta il DOM: le pagine di gioco fanno `await
  // FFR.auth.ready` prima di chiedere il progresso cloud, altrimenti lo
  // script del gioco (eseguito subito dopo questo file) chiede "chi è
  // loggato?" prima che restoreSession() abbia finito di scoprirlo, e
  // riceve sempre "nessuno" — bug che restava invisibile sullo stesso
  // dispositivo (il salvataggio locale coincideva comunque) ma faceva
  // sparire il progresso cloud su un dispositivo diverso.
  const sessionReady = restoreSession();

  function init() {
    injectStyles();
    if (!HEADLESS) injectAccountIcon();
    sessionReady.then(() => {
      if (HEADLESS) return; // niente popup ospite/account nei giochi, solo in home
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
    ready: sessionReady,
    saveProgress,
    loadProgress,
    saveScore,
    getLeaderboard,
    getMyRank,
    openAccountPanel,
    openLoginModal,
    refreshLabel: updateAccountLabel, // da richiamare quando la pagina cambia lingua (l'icona account non lo sa da sola)
  };
})();
