"""Extrai os times de treinadores do código descompilado de FireRed (pret/pokefirered).

Entrada: snapshot/data.json e src/data/trainer_parties.h + trainers.h do pret (baixados para .cache).
Saída: .cache/trainers_raw.json (todos os treinadores; build_extra.py escolhe os relevantes).
"""
import re, json, urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
CACHE = HERE / ".cache" / "pret"
PRET = "https://raw.githubusercontent.com/pret/pokefirered/master/src/data"


def pret(name):
    path = CACHE / name
    if not path.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(f"{PRET}/{name}", path)
    return path.read_text()


D=json.load(open(HERE / 'snapshot' / 'data.json'))
norm=lambda s: re.sub(r'[^a-z0-9]','',s.lower().replace('♀','f').replace('♂','m'))
sp={norm(p['n']):int(i) for i,p in D['P'].items()}
mv={norm(m['n']):int(i) for i,m in D['M'].items()}
th=pret('trainers.h'); tp=pret('trainer_parties.h')
parties={}
for m in re.finditer(r'static const struct (\w+) (sParty_\w+)\[\] = \{(.*?)\n\};',tp,re.S):
    mons=[]
    for b in re.findall(r'\{(.*?)\n    \}',m.group(3),re.S):
        lvl=int(re.search(r'\.lvl = (\d+)',b).group(1)); s=re.search(r'\.species = SPECIES_(\w+)',b).group(1)
        it=re.search(r'\.heldItem = ITEM_(\w+)',b); mvs=re.search(r'\.moves = \{(.*?)\}',b)
        pid=sp.get(norm(s.replace('NIDORAN_F','nidoranf').replace('NIDORAN_M','nidoranm')))
        ms=[]
        if mvs:
            for x in re.findall(r'MOVE_(\w+)',mvs.group(1)):
                if x=='NONE': continue
                ms.append(mv.get(norm(x), x.replace('_',' ').title()))
        else:  # default: last 4 level-up moves at that level
            lv=[mid for l,mid in D['L'][str(pid)]['lv'] if l<=lvl]
            seen=[]; [seen.append(x) for x in lv if x not in seen]; ms=seen[-4:]
        mons.append(dict(p=pid,l=lvl,m=ms,i=(it.group(1).replace('_',' ').title() if it and it.group(1)!='NONE' else None)))
    parties[m.group(2)]=mons
T={}
for m in re.finditer(r'\[(TRAINER_\w+)\] = \{(.*?)\n    \},',th,re.S):
    b=m.group(2); pm=re.search(r'\.party = \w+\((sParty_\w+)\)',b)
    if pm and pm.group(1) in parties: T[m.group(1)]=parties[pm.group(1)]
print('treinadores extraídos:', len(T))

json.dump(T,open(HERE / '.cache' / 'trainers_raw.json','w'))
