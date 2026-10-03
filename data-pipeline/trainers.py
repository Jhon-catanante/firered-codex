import re, json
D=json.load(open('data.json'))
norm=lambda s: re.sub(r'[^a-z0-9]','',s.lower().replace('♀','f').replace('♂','m'))
sp={norm(p['n']):int(i) for i,p in D['P'].items()}
mv={norm(m['n']):int(i) for i,m in D['M'].items()}
th=open('trainers.h').read(); tp=open('trainer_parties.h').read()
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
print(len(T)); 
for k in ['TRAINER_LEADER_BROCK','TRAINER_LEADER_GIOVANNI','TRAINER_CHAMPION_FIRST_SQUIRTLE','TRAINER_RIVAL_OAKS_LAB_SQUIRTLE','TRAINER_CHAMPION_REMATCH_CHARMANDER','TRAINER_ELITE_FOUR_LANCE_2']:
    print(k,[(D['P'][str(x['p'])]['n'],x['l'],[D['M'][str(y)]['n'] if isinstance(y,int) else y for y in x['m']],x['i']) for x in T[k]])
json.dump(T,open('trainers_raw.json','w'))
