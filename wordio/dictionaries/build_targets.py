# Wordio — costruisce l'elenco delle parole che il gioco puo' CHIEDERE.
#
# QUESTO FILE NON FA PARTE DEL SITO: non viene mai caricato da una pagina. Si
# lancia a mano quando c'e' da rifare gli elenchi, e scrive dentro ai tre
# dizionari il campo "targets".
#
#   python3 build_targets.py
#
# Serve una lista di frequenza d'uso per lingua, in questa stessa cartella, con
# nome freq_it.txt / freq_en.txt / freq_fr.txt (una riga per parola: "parola
# numero", ordinate dalla piu' usata). Quelle usate vengono da
# github.com/hermitdave/FrequencyWords — vedi i ringraziamenti nel README.
#
# PER TOGLIERE UNA PAROLA CHE NON PIACE: aggiungila in EXTRA_FUORI qui sotto,
# nella sua lingua, e rilancia. Per le parole da 3 lettere invece si lavora
# direttamente su TRE, che e' scelto a mano una parola per volta.
import json, os, unicodedata, random
from collections import Counter

QUI = os.path.dirname(os.path.abspath(__file__))
SCRATCH = QUI   # le liste di frequenza stanno qui accanto
DICTS = QUI

# ---- le parole da 3 lettere, scelte a mano una per una ----
TRE = {
'it': """ora due dio via tre ore zio bar oro zia sud blu est mal gas ali dea ala zoo ira
dee ago vie ego sol api uva oca alt rum rio tic mar ape eco fax sci gin vip""",
'en': """cat dog sun car bus cup hat key box egg sea sky arm ear eye leg bed cow pig fox
bee ant owl rat bat hen oak pen cap bag map net oil pot pan jar toy pet jet tea ice art
gun war law air ten six two one day age man men boy son mom dad kid job pub zoo gym lab
inn ski spa ash elf ivy jaw hip lip rib toe gum fur wig mud log tin tub mug rug nut ham
jam pie bun ale arc axe bow cab cue dam den dot dye fan fee fin fog gap gas gel hut ink
lid mat mob mop nap pad paw pea peg pin pit pod ram ray rim rod row tag tap tax tie tip
van vet vow wax web yen""",
'fr': """eau roi rue mer feu jeu sac lit nez vin thé riz ail bol bus car mur sol sel air
ami âge âme arc âne bal bec cap clé col coq cou cri duc duo fer fil foi fée gaz gel île
jus lac lin loi mot nid nom oie pic pin pot pub rat ski sud tas tir toc vie vol vue zoo
axe box fax kit jet lac mec""",
}

# ---- parole grammaticali: giuste, ma da indovinare non hanno senso ----
STOP = {
'it': """il lo la i gli le un uno una uni di a da in con su per tra fra e ed o od ma se
che chi cui non ne ci vi si mi ti li ce ve del dello della dei degli delle al allo alla
ai agli alle dal dallo dalla dai dagli dalle nel nello nella nei negli nelle col coi sul
sullo sulla sui sugli sulle piu piu' anche come quando dove perche perché mentre quindi
gia già ancora sempre mai molto poco tutto tutta tutti tutte questo questa questi queste
quello quella quelli quelle loro mio mia miei mie tuo tua tuoi tue suo sua suoi sue
nostro nostra nostri nostre vostro vostra vostri vostre sono sei siamo siete essere stato
stata stati state avere ho hai ha abbiamo avete hanno era eri ero erano eravamo fu fui
furono sara sarà saro saro' avro avrò cosa cosi così ecco senza sopra sotto dopo prima
oggi ieri domani qui qua li' lì la' là adesso allora dunque pero però anzi cioe cioè
forse magari appena subito ormai infatti invece oppure altro altra altri altre stesso
stessa ogni qualche nessuno niente nulla qualcosa chiunque ovunque grazie prego scusa
scusi ciao salve addio pronto certo certa davvero proprio solo soltanto quasi circa verso
oltre entro presso durante mediante nonostante affinche affinché finche finché poiche
poiché siccome benche benché sebbene qualora ossia ovvero nonche nonché""",
'en': """the a an and or but if then than that this these those there their they them
you your yours we us our ours he him his she her hers it its i me my mine who whom whose
which what when where why how all any both each few more most other some such no nor not
only own same so too very can will just don should now be am is are was were been being
have has had having do does did doing would could shall may might must ought about above
after again against because before below between during for from further here into of
off on once out over under until up down while with within without through""",
'fr': """le la les un une des du de au aux et ou mais si que qui quoi dont ou' où ne pas
plus moins tres très bien mal encore toujours jamais deja déjà aussi alors donc car comme
quand comment pourquoi parce ici la' là ceci cela ca ça ce cet cette ces mon ma mes ton
ta tes son sa ses notre nos votre vos leur leurs je tu il elle nous vous ils elles me te
se lui eux moi toi soi etre être suis es est sommes etes êtes sont etait était etaient
étaient avoir ai as a avons avez ont avait avaient sera seront serai fut fus faire fait
dire dit tout toute tous toutes autre autres meme même memes mêmes chaque quelque
quelques aucun aucune rien personne quelqu quelqu'un merci pardon bonjour salut adieu
oui non peut peux pouvez pouvons dois doit devez sur sous dans par pour vers chez entre
avec sans contre depuis pendant apres après avant assez trop peu beaucoup"""
}

# ---- roba che la frequenza da sola non toglie: sigle, versi, marchi, nomi propri ----
EXTRA_FUORI = {
'it': """cnn dna dvd gps sms onu pos psi pil lan hiv usa iran roma italia milano juve
uhm ehm beh mah ahi ohi ehi bip cip boh mmm ops hey okay ok yeah wow bla ciak
band post slip club film sport star show tour team stop shop stress test set match
computer internet email password file link online offline server software hardware
web app blog chat social media video audio radio dvd cd""",
'en': """okay yeah yep yup huh hey wow ugh aha duh hah gee ops etc iii app ads inc sec
min max cal jan feb mar apr jun jul aug sep oct nov dec bob tom ken meg lee jay eve
deb med rep sim goo yum sly wan tad nay ere thy pry""",
'fr': """euh heu hum bah zut hop han ohé ouf toc bof yes okay ok wow bye
sms adn ovni ordi appli mec gus dan jan bob mac"""
}

def norm(w):
    return ''.join(c for c in unicodedata.normalize('NFD', w) if unicodedata.category(c) != 'Mn').replace('œ', 'oe').replace('æ', 'ae')

def carica_frequenze(lang):
    f = {}
    for i, line in enumerate(open(f'{SCRATCH}/freq_{lang}.txt', encoding='utf-8')):
        parts = line.split()
        if len(parts) != 2: continue
        w = parts[0]
        if w not in f: f[w] = i + 1
    return f

def costruisci(lang, soglia):
    freq = carica_frequenze(lang)
    d = json.load(open(f'{DICTS}/{lang}.json', encoding='utf-8'))
    parole = d['words'].split(',')
    tre = set(TRE[lang].split())
    stop = set(STOP[lang].split()) | set(EXTRA_FUORI[lang].split())
    stop |= {norm(w) for w in stop}

    dentro = []
    for w in parole:
        n = norm(w)
        if len(n) < 3: continue
        if n in stop or w in stop: continue
        if len(n) == 3:
            if w in tre or n in tre: dentro.append(w)
            continue
        r = freq.get(w) or freq.get(n)
        if r and r <= soglia: dentro.append(w)
    return d, dentro

def sottoparole(anchor_norm, per_lunghezza):
    ac = Counter(anchor_norm); out = []
    for L in range(3, len(anchor_norm) + 1):
        for w, wn in per_lunghezza.get(L, []):
            if wn == anchor_norm: continue
            wc = Counter(wn)
            if all(wc[ch] <= ac[ch] for ch in wc): out.append(w)
    return out

SOGLIE = {'it': 14000, 'en': 12000, 'fr': 12000}
for lang in ('it', 'en', 'fr'):
    d, dentro = costruisci(lang, SOGLIE[lang])
    per_len = Counter(len(norm(w)) for w in dentro)
    print(f"=== {lang}: {len(dentro)} parole richiedibili su {len(d['words'].split(','))} del dizionario")
    print("   per lunghezza:", {k: per_len[k] for k in sorted(per_len) if k <= 9})

    # quante ne trova una parola madre tipica?
    tset = set(dentro)
    per_lunghezza = {}
    for w in dentro:
        n = norm(w)
        per_lunghezza.setdefault(len(n), []).append((w, n))
    comuni = set(d['common'].split(','))
    anchors = [w for w in dentro if 5 <= len(norm(w)) <= 8 and w in comuni]
    random.seed(5)
    prova = random.sample(anchors, min(60, len(anchors)))
    conta = []
    for a in prova:
        conta.append(len(sottoparole(norm(a), per_lunghezza)))
    conta.sort()
    scarse = sum(1 for c in conta if c < 3)
    print(f"   parole madri candidate: {len(anchors)} | sottoparole richiedibili: mediana {conta[len(conta)//2]}, sotto 3: {scarse}/{len(conta)}")
    esempio = prova[0]
    print(f"   esempio '{esempio}': {sorted(set(sottoparole(norm(esempio), per_lunghezza)))[:14]}")
    print()
    d['targets'] = ','.join(dentro)
    json.dump(d, open(f'{DICTS}/{lang}.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
