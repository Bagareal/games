/* ============ KAKUMAL — il lavorante degli schemi ============
   Fabbricare uno schema costa da qualche decimo di secondo a un paio di
   secondi: fatto dentro alla pagina, per tutto quel tempo il telefono resta
   fermo — non si muove la rotella dell'attesa, non risponde un tocco, sembra
   bloccato. Qui invece il lavoro succede in disparte e la pagina resta viva.

   Se il browser non sa fare i lavoranti (o il file non si carica), il gioco se
   ne accorge e fabbrica gli schemi da sé: vedi `askPuzzle` in script.js. */
importScripts('puzzle.js');

self.onmessage = function (e) {
  const msg = e.data || {};
  self.postMessage({ id: msg.id, puzzle: self.KAKUMAL.makePuzzle(msg.cfg) });
};
