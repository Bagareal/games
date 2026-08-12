// Free For Real — la modalità scura, uguale in tutto il sito.
// Incluso nella <head> della pagina, PRIMA del foglio di stile del gioco:
//   <script src="../shared/theme.js"></script>
// Va lì e non in fondo: se arrivasse dopo, la pagina si vedrebbe chiara per un
// attimo e poi diventerebbe scura davanti agli occhi.
//
// Due regole di base, decise apposta:
//
// - DI PARTENZA È SPENTA. Alla prima visita, e per chi non la tocca mai, il
//   gioco è quello di sempre con i suoi colori. Non si guarda cosa dice il
//   sistema operativo: chi vuole il buio lo accende lui.
// - SI ACCENDE SOLO DAL COMPUTER. L'interruttore compare solo dove c'è un
//   mouse (`hover` e `pointer:fine`), e anche il buio si applica solo lì:
//   sul telefono resta chiaro, così non può restare accesa una cosa che da
//   lì non si potrebbe più spegnere.
//
// La scelta sta in `ffr-theme` su questo dispositivo e basta: non va
// nell'account. Il buio è di questo schermo, non di chi gioca.
//
// Come si mette l'interruttore in un gioco: una riga del menu Impostazioni
//   <button class="menu-row" data-ffr-theme-toggle hidden>
//     <span class="ffr-ico ffr-ico-lead" data-ico="moon"></span>
//     <span data-i18n="darkMode">Modalità scura</span>
//   </button>
// Il resto (la levetta, il ricordarsela, il mostrarla solo su computer) lo fa
// questo file da solo.
(function () {
  'use strict';

  const KEY = 'ffr-theme';
  const DESKTOP = '(hover: hover) and (pointer: fine)';

  function stored() {
    try { return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light'; }
    catch (e) { return 'light'; }
  }
  function isDesktop() {
    return !!(window.matchMedia && window.matchMedia(DESKTOP).matches);
  }
  // il buio vale solo dove c'è l'interruttore per toglierlo
  function effective() {
    return (stored() === 'dark' && isDesktop()) ? 'dark' : 'light';
  }
  function apply() {
    const root = document.documentElement;
    if (effective() === 'dark') root.setAttribute('data-ffr-theme', 'dark');
    else root.removeAttribute('data-ffr-theme');
    refreshToggles();
  }
  function set(value) {
    try { localStorage.setItem(KEY, value === 'dark' ? 'dark' : 'light'); } catch (e) {}
    apply();
  }
  function toggle() { set(stored() === 'dark' ? 'light' : 'dark'); }

  // il colore della barra del browser sul telefono segue quello che c'è scritto
  // nella pagina: qui non si tocca, perché sul telefono il buio non si applica

  function injectStyles() {
    if (document.getElementById('ffr-theme-styles')) return;
    const style = document.createElement('style');
    style.id = 'ffr-theme-styles';
    style.textContent = `
      /* la riga dell'interruttore non c'è finché non si sa che siamo su un
         computer: l'attributo "hidden" da solo non basterebbe, perché la riga
         del menu ha un display suo che vincerebbe sul foglio del browser */
      [data-ffr-theme-toggle][hidden]{ display:none !important; }
      /* la levetta si disegna con il colore del testo della riga dov'è: così
         sta bene nella grafica di ogni gioco senza saperne niente */
      .ffr-switch{
        margin-left:auto; flex:0 0 auto;
        width:38px; height:22px; border-radius:999px;
        border:2px solid currentColor;
        position:relative;
        opacity:0.45;
        transition: opacity 0.18s ease;
      }
      .ffr-switch::after{
        content:'';
        position:absolute; top:3px; left:3px;
        width:12px; height:12px; border-radius:50%;
        background: currentColor;
        transition: transform 0.18s ease;
      }
      [data-ffr-theme-toggle][aria-pressed="true"] .ffr-switch{ opacity:1; }
      [data-ffr-theme-toggle][aria-pressed="true"] .ffr-switch::after{ transform: translateX(16px); }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function refreshToggles() {
    const rows = document.querySelectorAll('[data-ffr-theme-toggle]');
    const desktop = isDesktop();
    const on = stored() === 'dark';
    rows.forEach(row => {
      row.hidden = !desktop;
      row.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function mount() {
    injectStyles();
    document.querySelectorAll('[data-ffr-theme-toggle]').forEach(row => {
      if (row.querySelector('.ffr-switch')) return;
      const sw = document.createElement('span');
      sw.className = 'ffr-switch';
      sw.setAttribute('aria-hidden', 'true');
      row.appendChild(sw);
      row.addEventListener('click', toggle);
    });
    refreshToggles();
  }

  apply();

  window.FFR = window.FFR || {};
  window.FFR.theme = {
    get: stored,
    set: set,
    toggle: toggle,
    isDark: () => effective() === 'dark',
    available: isDesktop,
    mount: mount,
  };

  // se il mouse arriva (o se ne va) dopo, la riga compare o sparisce da sola,
  // e con lei il buio
  if (window.matchMedia) {
    const mq = window.matchMedia(DESKTOP);
    const onChange = () => apply();
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
