# Findy — costruisce gli elenchi di parole che il gioco nasconde nella griglia.
#
# QUESTO FILE NON FA PARTE DEL SITO: non viene mai caricato da una pagina. Si
# lancia a mano quando c'e' da rifare gli elenchi.
#
#   python3 build_words.py
#
# Da dove vengono le parole: dal campo "targets" dei dizionari di Wordio
# (wordio/dictionaries/<lingua>.json), cioe' l'elenco delle parole che quel
# gioco puo' CHIEDERE. E' gia' passato al setaccio della frequenza d'uso reale
# (vedi wordio/dictionaries/build_targets.py e i ringraziamenti nel README):
# niente sigle, niente versi, niente marchi, niente parole grammaticali. Qui
# serve esattamente la stessa cosa — una parola nascosta nella griglia dev'essere
# una parola che chi gioca conosce.
#
# Cosa cambia rispetto a Wordio:
#  - minimo 4 lettere (tre lettere in una griglia si trovano per caso);
#  - gli accenti restano. Wordio non li puo' avere perche' la ruota ha 7 lettere
#    semplici; qui invece la parola va "vista" dentro la griglia, e l'accento
#    e' un appiglio in piu' per l'occhio. Riguarda quasi solo il francese: gli
#    elenchi italiano e inglese non hanno nemmeno una parola accentata;
#  - in italiano si tengono solo le parole che finiscono per vocale, vedi la
#    nota su VOCALI qui sotto.
#
# NB: i dizionari di Wordio arrivano a 8 lettere (la ruota non ne regge di piu'),
# quindi anche qui la parola piu' lunga e' di 8 lettere.
#
# PAROLACCE: non se ne occupa questo script. La regola del sito (niente parole
# volgari, oscene, sessuali esplicite, insulti o violenza sessuale, in nessuna
# lingua) e' applicata a monte, dentro ai dizionari di Wordio da cui questi
# elenchi si ricavano — vedi la nota in wordio/dictionaries/build_targets.py.
#
# PER TOGLIERE UNA PAROLA CHE NON PIACE: aggiungila in FUORI qui sotto, nella
# sua lingua, e rilancia. Vale solo per Findy: gli elenchi di Wordio non si
# toccano.
import json, os

QUI = os.path.dirname(os.path.abspath(__file__))
WORDIO = os.path.join(QUI, '..', '..', 'wordio', 'dictionaries')

MIN_LEN = 4

# ---- roba che il setaccio automatico non toglie: nomi propri, soprattutto ----
FUORI = {
    'it': """paolo londra natale""",
    'en': """john""",
    'fr': """maria paris ciao""",
}

# Le parole italiane finiscono quasi sempre per vocale. Quelle che finiscono per
# consonante, in un elenco come questo, sono quasi tutte forestiere (bear, baby,
# yacht, budget), nomi propri (boston, byron) o forme tronche da poesia (amor,
# ancor, andar). In Wordio si vedono poco, perché lì la parola la si compone con
# le lettere che hai; qui invece te la si chiede di trovare, e chiedere BEAR in
# italiano non va bene. Sono 315 su 7492: si buttano tutte.
VOCALI = 'aeiouàèéìòóù'


def italiana(w):
    return w[-1] in VOCALI


for lang in ('it', 'en', 'fr'):
    src = json.load(open(os.path.join(WORDIO, f'{lang}.json'), encoding='utf-8'))
    fuori = set(FUORI[lang].split())
    parole = [w for w in src['targets'].split(',') if len(w) >= MIN_LEN and w not in fuori]
    if lang == 'it':
        scartate = [w for w in parole if not italiana(w)]
        parole = [w for w in parole if italiana(w)]
        print(f"it: {len(scartate)} parole tolte perche' finiscono per consonante, es. {scartate[:8]}")
    # per lunghezza e poi in ordine: il gioco le mette in secchielli per
    # lunghezza appena carica il file, e cosi' se li ritrova gia' pronti
    parole.sort(key=lambda w: (len(w), w))
    fuori = {'v': 1, 'words': ','.join(parole)}
    with open(os.path.join(QUI, f'{lang}.json'), 'w', encoding='utf-8') as f:
        json.dump(fuori, f, ensure_ascii=False, separators=(',', ':'))
    per_len = {}
    for w in parole:
        per_len[len(w)] = per_len.get(len(w), 0) + 1
    print(f'{lang}: {len(parole)} parole', {k: per_len[k] for k in sorted(per_len)})
