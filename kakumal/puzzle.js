/* ============ KAKUMAL — la fabbrica degli schemi ============
   Somme incrociate: la griglia è fatta di muri e di caselle bianche. Ogni muro
   può portare due somme, una per il tratto di caselle che parte alla sua destra
   e una per quello che parte sotto di lui. In un tratto ci vanno cifre da 1 a 9,
   mai due volte la stessa, e insieme devono fare la somma scritta.

   Le regole di questo tipo di rompicapo non sono di nessuno — sono aritmetica —
   e qui sono scritte da zero: disegno dei muri, riempimento, risolutore,
   controllo che la soluzione sia una sola. Niente è preso da nessun altro.

   Questo file non tocca la pagina: sa solo fabbricare schemi. Sta da solo
   apposta, così lo si può mettere alla prova senza aprire il gioco. */
(function () {
  'use strict';

  const FULL = 0x1FF;               // tutte e nove le cifre accese

  // ---------- conti sui bit ----------
  // Un insieme di cifre è una maschera da 9 bit: il bit 0 è l'1, il bit 8 è il 9.
  // Contare i bit e ricavare la cifra di una maschera singola capita di continuo
  // dentro al risolutore, quindi le risposte sono già pronte in tabella.
  const BIT = [0];
  for (let d = 1; d <= 9; d++) BIT.push(1 << (d - 1));
  const POP = new Uint8Array(512);
  const SUM_OF = new Uint8Array(512);
  for (let m = 1; m < 512; m++) {
    let count = 0, sum = 0;
    for (let d = 1; d <= 9; d++) {
      if (m & BIT[d]) { count++; sum += d; }
    }
    POP[m] = count;
    SUM_OF[m] = sum;
  }

  // COMBOS[quante caselle][che somma] = tutti i gruppi di cifre che ci stanno.
  // È la tabella che chi gioca si tiene a mente ("16 in due caselle è per forza
  // 7+9") ed è anche quella che rende veloce il risolutore: invece di provare
  // nove cifre per casella, si provano solo i gruppi che possono fare la somma.
  const COMBOS = [];
  for (let len = 0; len <= 9; len++) {
    const bySum = [];
    for (let s = 0; s <= 45; s++) bySum.push([]);
    COMBOS.push(bySum);
  }
  for (let m = 1; m < 512; m++) COMBOS[POP[m]][SUM_OF[m]].push(m);

  function maskToDigits(mask) {
    const out = [];
    for (let d = 1; d <= 9; d++) if (mask & BIT[d]) out.push(d);
    return out;
  }
  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = list[i]; list[i] = list[j]; list[j] = tmp;
    }
    return list;
  }

  // ---------- il disegno dei muri ----------
  // La prima riga e la prima colonna sono sempre muro: è lì che vanno le somme
  // dei tratti che cominciano subito dopo. Le altre caselle si murano a caso e
  // poi si sistema quello che non sta in piedi.
  function makeLayout(n, wallProb) {
    const open = new Uint8Array(n * n);
    for (let r = 1; r < n; r++) {
      for (let c = 1; c < n; c++) {
        open[r * n + c] = Math.random() < wallProb ? 0 : 1;
      }
    }
    // Due cose rendono un tratto ingiocabile: essere lungo uno (una casella con
    // una somma tutta sua non è un rompicapo, è una risposta stampata) o essere
    // lungo più di nove (non ci starebbero cifre diverse).
    //
    // Una casella isolata si può sistemare in due modi: murarla, o aprirle
    // accanto la casella che le manca. Murando e basta il rimedio si mangia la
    // griglia — una casella murata isola le vicine, che vengono murate a loro
    // volta — e si finiva con schemi da otto caselle su una griglia da trentasei.
    // Quindi prima si prova ad aprire, e solo negli ultimi giri si mura: così la
    // riparazione si chiude di sicuro, senza spolpare lo schema.
    for (let pass = 0; pass < 60; pass++) {
      const mayOpen = pass < 40;
      let changed = false;
      for (let r = 1; r < n; r++) changed = fixLine(open, n, r * n + 1, 1, n - 1, mayOpen) || changed;
      for (let c = 1; c < n; c++) changed = fixLine(open, n, n + c, n, n - 1, mayOpen) || changed;
      if (!changed) break;
    }
    return open;
  }
  function fixLine(open, n, start, step, count, mayOpen) {
    let changed = false;
    let runStart = -1, len = 0;
    for (let k = 0; k <= count; k++) {
      const i = start + k * step;
      if (k < count && open[i] === 1) {
        if (len === 0) { runStart = i; }
        len++;
        continue;
      }
      if (len === 1) {
        // le caselle di fianco lungo la stessa direzione, se ci sono e sono muro
        const sides = [];
        if (mayOpen) {
          const before = runStart - step, after = runStart + step;
          if (inside(before, n, step) && !open[before]) sides.push(before);
          if (inside(after, n, step) && !open[after]) sides.push(after);
        }
        if (sides.length) open[sides[Math.floor(Math.random() * sides.length)]] = 1;
        else open[runStart] = 0;
        changed = true;
      } else if (len > 9) {
        // si mura una casella in mezzo, lasciando almeno due caselle per parte
        const cut = 2 + Math.floor(Math.random() * (len - 4));
        open[runStart + cut * step] = 0;
        changed = true;
      }
      len = 0;
    }
    return changed;
  }
  // Dentro la parte giocabile: fuori dalla prima riga e dalla prima colonna, che
  // sono sempre muro perché è lì che vanno scritte le somme.
  function inside(i, n, step) {
    if (i < n + 1 || i >= n * n) return false;
    const r = Math.floor(i / n), c = i % n;
    if (r < 1 || c < 1) return false;
    return step === 1 ? c >= 1 && c < n : r >= 1 && r < n;
  }

  // ---------- i tratti ----------
  // Ogni casella bianca sta su due tratti, uno orizzontale e uno verticale, e
  // ognuno ha il suo muro che porta la somma. Qui si mettono in fila una volta
  // sola: da qui in poi si ragiona per tratti, non più per righe e colonne.
  function buildRuns(open, n) {
    const runs = [];
    const hRun = new Int16Array(n * n).fill(-1);
    const vRun = new Int16Array(n * n).fill(-1);
    scanRuns(open, n, runs, hRun, true);
    scanRuns(open, n, runs, vRun, false);
    return { runs, hRun, vRun };
  }
  function scanRuns(open, n, runs, owner, horizontal) {
    for (let a = 1; a < n; a++) {
      let cells = [];
      for (let b = 1; b <= n; b++) {
        const i = horizontal ? a * n + b : b * n + a;
        if (b < n && open[i] === 1) { cells.push(i); continue; }
        if (cells.length) {
          const first = cells[0];
          const id = runs.length;
          runs.push({
            cells: cells,
            clue: horizontal ? first - 1 : first - n,
            horizontal: horizontal,
            sum: 0,
          });
          for (let x = 0; x < cells.length; x++) owner[cells[x]] = id;
          cells = [];
        }
      }
    }
  }

  // ---------- il riempimento ----------
  // Le somme non si scelgono: si sceglie una griglia piena di cifre e le somme
  // vengono di conseguenza. Si riempie casella per casella, da sinistra a destra
  // e dall'alto in basso, provando le cifre in ordine sparso.
  //
  // C'è però una trappola: il "quadrato scambiabile". Se quattro caselle stanno
  // agli angoli di un rettangolo, due a due sugli stessi tratti, e portano le
  // cifre x y / y x, allora scambiando le due righe si ottiene un'altra griglia
  // con le STESSE somme. Uno schema così ha due soluzioni e non si risolve
  // ragionando, si tira a indovinare. Invece di scoprirlo alla fine e buttare
  // via tutto, la cifra che chiuderebbe un rettangolo così non si scrive
  // proprio: costa un controllo corto e fa risparmiare interi tentativi.
  function fillDigits(open, n, info, budget) {
    const runs = info.runs, hRun = info.hRun, vRun = info.vRun;
    const val = new Uint8Array(n * n);
    const cells = [];
    for (let i = 0; i < n * n; i++) if (open[i]) cells.push(i);
    const usedH = new Int16Array(runs.length);
    const usedV = new Int16Array(runs.length);
    let steps = 0;

    function createsSwap(i, d) {
      const col = i % n;
      const hCells = runs[hRun[i]].cells;
      for (let x = 0; x < hCells.length; x++) {
        const c = hCells[x];
        if (c >= i) break;                       // solo le caselle già scritte
        const vCells = runs[vRun[c]].cells;
        for (let y = 0; y < vCells.length; y++) {
          const a = vCells[y];
          if (a >= c) break;
          if (val[a] !== d) continue;
          const b = a - (a % n) + col;           // l'angolo che manca al rettangolo
          if (!open[b]) continue;
          if (hRun[b] !== hRun[a] || vRun[b] !== vRun[i]) continue;
          if (val[b] === val[c]) return true;
        }
      }
      return false;
    }

    function place(k) {
      if (k === cells.length) return true;
      if (++steps > budget) return false;
      const i = cells[k];
      const h = hRun[i], v = vRun[i];
      const order = shuffle(maskToDigits(FULL & ~usedH[h] & ~usedV[v]));
      for (let z = 0; z < order.length; z++) {
        const d = order[z];
        if (createsSwap(i, d)) continue;
        val[i] = d; usedH[h] |= BIT[d]; usedV[v] |= BIT[d];
        if (place(k + 1)) return true;
        val[i] = 0; usedH[h] &= ~BIT[d]; usedV[v] &= ~BIT[d];
      }
      return false;
    }
    return place(0) ? val : null;
  }

  // ---------- il risolutore ----------
  // Lavora come una persona: non prova le cifre a caso, guarda un tratto per
  // volta e tiene solo le cifre che possono ancora starci. `cand[i]` è la
  // maschera delle cifre ancora possibili nella casella i.
  function freshCand(open, n) {
    const cand = new Int16Array(n * n);
    for (let i = 0; i < n * n; i++) cand[i] = open[i] ? FULL : 0;
    return cand;
  }
  // Restringe le possibilità finché c'è da restringere. Torna false se lo schema
  // così com'è non può stare in piedi (una casella senza cifre possibili, due
  // volte la stessa cifra in un tratto, una somma che non si può più fare).
  function propagate(cand, runs) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let ri = 0; ri < runs.length; ri++) {
        const run = runs[ri];
        const cells = run.cells;
        let placed = 0, fixedCount = 0;
        const free = [];
        for (let x = 0; x < cells.length; x++) {
          const m = cand[cells[x]];
          if (!m) return false;
          if (POP[m] === 1) { placed |= m; fixedCount++; }
          else free.push(cells[x]);
        }
        if (POP[placed] !== fixedCount) return false;   // cifra ripetuta nel tratto
        const combos = COMBOS[cells.length][run.sum];
        let allow = 0, any = false;
        for (let z = 0; z < combos.length; z++) {
          const combo = combos[z];
          if ((combo & placed) !== placed) continue;    // scarta le cifre già scritte
          const rest = combo & ~placed;
          let ok = true;
          // ogni casella libera deve poter prendere almeno una delle cifre che
          // restano, e ogni cifra che resta deve poter andare da qualche parte
          for (let x = 0; x < free.length; x++) {
            if (!(cand[free[x]] & rest)) { ok = false; break; }
          }
          if (ok) {
            let r = rest;
            while (r) {
              const b = r & -r; r ^= b;
              let can = false;
              for (let x = 0; x < free.length; x++) {
                if (cand[free[x]] & b) { can = true; break; }
              }
              if (!can) { ok = false; break; }
            }
          }
          if (!ok) continue;
          any = true;
          allow |= rest;
        }
        if (!any) return false;
        for (let x = 0; x < free.length; x++) {
          const id = free[x];
          const nm = cand[id] & allow;
          if (nm === cand[id]) continue;
          if (!nm) return false;
          cand[id] = nm;
          changed = true;
        }
      }
    }
    return true;
  }
  // ---------- la salita ----------
  // Una griglia riempita a caso non fa quasi mai uno schema buono: le somme
  // vengono tutte di mezzo (un 28 in cinque caselle si può fare in ventisette
  // modi), resta talmente tanta libertà che di soluzioni ce ne sono a mucchi, e
  // provando a caso finché non ne esce una buona non se ne trova nessuna: su una
  // griglia da cinquanta caselle non capita mai.
  //
  // Quindi lo schema non si sorteggia, si COSTRUISCE: si cambia una cifra per
  // volta — la griglia resta sempre valida, cambiano solo le due somme
  // dell'incrocio di quella casella — tenendo i cambi che avvicinano alla meta.
  //
  // La meta è che il solo ragionamento arrivi a decidere TUTTE le caselle:
  // quella è insieme la garanzia che la soluzione è una sola e che la si può
  // trovare senza mai tirare a indovinare.
  //
  // Contare le caselle già decise però non guiderebbe niente: all'inizio sono
  // zero e restano zero per un pezzo, e uno zero fermo non indica nessuna
  // direzione. Si contano invece le CIFRE ANCORA POSSIBILI in tutte le caselle
  // messe insieme: parte intorno a nove per casella e cala a ogni somma che si
  // stringe, molto prima che una casella qualsiasi risulti decisa. Quando scende
  // a una cifra possibile per casella si è arrivati.
  function looseness(ctx) {
    const cand = freshCand(ctx.open, ctx.n);
    if (!propagate(cand, ctx.runs)) return { k: 1e9, cand: cand };
    let k = 0;
    for (let x = 0; x < ctx.cells.length; x++) k += POP[cand[ctx.cells[x]]];
    return { k: k, cand: cand };
  }
  // Cambia la cifra di una casella e aggiorna le due somme e le cifre già usate
  // nei suoi due tratti. Torna la cifra di prima, per poter tornare indietro.
  function put(ctx, i, d) {
    const h = ctx.hRun[i], v = ctx.vRun[i];
    const old = ctx.val[i];
    ctx.usedH[h] = (ctx.usedH[h] & ~BIT[old]) | BIT[d];
    ctx.usedV[v] = (ctx.usedV[v] & ~BIT[old]) | BIT[d];
    ctx.runs[h].sum += d - old;
    ctx.runs[v].sum += d - old;
    ctx.val[i] = d;
    return old;
  }
  function resync(ctx) {
    for (let ri = 0; ri < ctx.runs.length; ri++) {
      const run = ctx.runs[ri];
      let mask = 0, sum = 0;
      for (let x = 0; x < run.cells.length; x++) {
        mask |= BIT[ctx.val[run.cells[x]]];
        sum += ctx.val[run.cells[x]];
      }
      run.sum = sum;
      if (run.horizontal) ctx.usedH[ri] = mask; else ctx.usedV[ri] = mask;
    }
  }
  function choices(ctx, i) {
    const avail = FULL & ~ctx.usedH[ctx.hRun[i]] & ~ctx.usedV[ctx.vRun[i]];
    return maskToDigits(avail);   // la cifra che c'è adesso non ci sta: è già "usata"
  }

  // ---------- lo schema finito ----------
  // La discesa non si fa a passi sempre in giù: scendendo e basta ci si ferma
  // nella prima conca e lì si resta. Si accetta quindi anche qualche cambio che
  // peggiora, tanti all'inizio e sempre meno andando avanti — è il modo di
  // scavalcare le conche e arrivare al fondo vero. Se un disegno di muri non ne
  // vuole sapere si ricomincia da un altro: certi disegni una soluzione sola non
  // ce l'hanno proprio, e insistere non serve.
  //
  // cfg: { n, wallProb, minOpen, moves, hot, cold, tries }
  function makePuzzle(cfg) {
    const n = cfg.n;
    for (let a = 0; a < (cfg.tries || 24); a++) {
      const open = makeLayout(n, cfg.wallProb);
      let openCount = 0;
      for (let i = 0; i < n * n; i++) openCount += open[i];
      if (openCount < cfg.minOpen) continue;
      const info = buildRuns(open, n);
      const val = fillDigits(open, n, info, 400000);
      if (!val) continue;                   // questo disegno di muri non si riempie
      const ctx = context(open, n, info, val);
      const total = ctx.cells.length;       // il fondo: una cifra possibile per casella
      let cur = looseness(ctx).k;
      for (let s = 0; s < cfg.moves; s++) {
        if (cur <= total) return pack(open, ctx.val, info, n);
        const temp = cfg.hot * Math.pow(cfg.cold / cfg.hot, s / cfg.moves);
        const i = ctx.cells[Math.floor(Math.random() * ctx.cells.length)];
        const opts = choices(ctx, i);
        if (!opts.length) continue;         // casella incastrata: niente da provare
        const d = opts[Math.floor(Math.random() * opts.length)];
        const old = put(ctx, i, d);
        const got = looseness(ctx).k;
        if (got <= cur || Math.random() < Math.exp((cur - got) / temp)) cur = got;
        else put(ctx, i, old);
      }
    }
    return null;
  }
  function context(open, n, info, val) {
    const cells = [];
    for (let i = 0; i < n * n; i++) if (open[i]) cells.push(i);
    const ctx = {
      open: open, n: n, runs: info.runs, hRun: info.hRun, vRun: info.vRun,
      val: val, cells: cells,
      usedH: new Int16Array(info.runs.length),
      usedV: new Int16Array(info.runs.length),
    };
    resync(ctx);
    return ctx;
  }
  // Di uno schema finito bastano tre cose: quanto è grande, quali caselle sono
  // bianche e la soluzione. I tratti e le somme da scrivere sui muri si rifanno
  // da lì (vedi `shape` in script.js): è un modo solo di ricostruire uno schema,
  // che venga dal generatore o da una partita lasciata a metà, e non c'è verso
  // che le due strade portino a due schemi diversi.
  function pack(open, val, info, n) {
    return {
      n: n,
      open: Array.from(open),
      solution: Array.from(val),
    };
  }

  // ---------- per la barra delle combinazioni ----------
  // Quali gruppi di cifre possono ancora fare questa somma, tenendo conto di
  // quelle già scritte nel tratto. È l'aiuto che si tiene a mente giocando.
  function combosFor(len, sum, placed) {
    if (!COMBOS[len] || !COMBOS[len][sum]) return [];
    const list = COMBOS[len][sum];
    const out = [];
    for (let z = 0; z < list.length; z++) {
      if ((list[z] & (placed || 0)) !== (placed || 0)) continue;
      out.push(maskToDigits(list[z]));
    }
    return out;
  }

  // Questo file gira in due posti: dentro la pagina (dove c'è `window`) e dentro
  // il lavorante che fabbrica gli schemi in disparte (dove c'è solo `self`).
  const root = (typeof window !== 'undefined') ? window : self;
  root.KAKUMAL = {
    makePuzzle: makePuzzle,
    combosFor: combosFor,
    buildRuns: buildRuns,   // serve al gioco per rifare i tratti di uno schema salvato
    bit: d => BIT[d],
  };
})();
