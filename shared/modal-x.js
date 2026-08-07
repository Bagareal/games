// Free For Real — la X per chiudere i pannelli, uguale in tutto il sito.
// Incluso da ogni pagina DOPO lo script del gioco:
//   <script src="../shared/modal-x.js"></script>
// (dalla home: src="shared/modal-x.js").
//
// Mette una X in alto a destra dentro ogni pannello (.overlay > .card), tranne
// quelli marcati `data-no-x` nell'HTML. Sono esclusi apposta i pannelli dietro
// ai quali non c'è niente da tornare a fare: la scelta iniziale della
// difficoltà e le schermate di fine partita/fine livello, dove i pulsanti sono
// l'unica strada avanti e una X lascerebbe il giocatore fermo davanti a una
// partita finita.
// La classe `x-off` sull'overlay nasconde la X solo per il momento: la usa la
// Dama per le istruzioni, che al primo avvio si chiudono con "Ho capito!" e
// mostrano la X solo quando vengono riaperte dal menu.
(function () {
  'use strict';

  const LABELS = { it: 'Chiudi', en: 'Close', fr: 'Fermer' };
  function label() {
    try {
      const v = localStorage.getItem('ffr-language');
      return LABELS[v] || LABELS.it;
    } catch (e) { return LABELS.it; }
  }

  function injectStyles() {
    if (document.getElementById('ffr-x-styles')) return;
    const style = document.createElement('style');
    style.id = 'ffr-x-styles';
    style.textContent = `
      /* area di tocco 40x40 (un dito poco preciso la prende al primo colpo),
         disegnata dentro l'angolo del pannello e nel colore del pannello
         stesso, così sta bene nella grafica di ogni gioco senza saperne nulla */
      .ffr-x{
        position:absolute; top:6px; right:6px;
        width:40px; height:40px; padding:0;
        display:flex; align-items:center; justify-content:center;
        background:none; border:none; cursor:pointer;
        color:inherit; opacity:0.55;
        line-height:0;
        z-index:2;
      }
      .ffr-x:hover{ opacity:0.95; }
      .ffr-x:active{ transform:scale(0.9); opacity:1; }
      .ffr-x svg{ display:block; }
      .overlay.x-off .ffr-x{ display:none; }
      /* il titolo resta centrato ma si tiene alla larga dalla X, così un titolo
         lungo non ci finisce sotto */
      .ffr-has-x > h2{ padding-left:30px; padding-right:30px; }
    `;
    document.head.appendChild(style);
  }

  const X_SVG = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function addTo(overlay) {
    const card = overlay.querySelector('.card, .ffr-auth-card');
    if (!card || card.querySelector(':scope > .ffr-x')) return;
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ffr-x';
    btn.innerHTML = X_SVG;
    btn.setAttribute('aria-label', label());
    btn.title = label();
    btn.addEventListener('click', () => {
      overlay.classList.remove('show');
      // qualche pagina tiene in piedi altro stato quando un pannello si chiude
      // (la pausa di un gioco, per esempio): se ha lasciato una funzione, si usa
      if (typeof window.FFR_ON_MODAL_CLOSE === 'function') {
        try { window.FFR_ON_MODAL_CLOSE(overlay.id); } catch (e) { console.error('[FFR] chiusura pannello:', e); }
      }
    });
    card.insertBefore(btn, card.firstChild);
    card.classList.add('ffr-has-x');
  }

  function setup() {
    injectStyles();
    document.querySelectorAll('.overlay').forEach(overlay => {
      if (overlay.hasAttribute('data-no-x')) return;
      addTo(overlay);
    });
  }

  window.FFR = window.FFR || {};
  window.FFR.addModalX = addTo;   // per i pannelli costruiti al volo (vedi shared/auth.js)

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
