import json
D=json.load(open('data.json')); T=json.load(open('trainers_raw.json'))
byn={p['n']:int(i) for i,p in D['P'].items()}
def party(k): return T[k]
# player starter -> rival suffix
RS={'bulbasaur':'CHARMANDER','charmander':'SQUIRTLE','squirtle':'BULBASAUR'}
def rival(base): return {s:T[f'{base}_{suf}'] for s,suf in RS.items()}
G=[]
gyms=[('BROCK','Brock','Pewter City','Insígnia Boulder','TM39 Rock Tomb','rock'),
('MISTY','Misty','Cerulean City','Insígnia Cascade','TM03 Water Pulse','water'),
('LT_SURGE','Lt. Surge','Vermilion City','Insígnia Thunder','TM34 Shock Wave','electric'),
('ERIKA','Erika','Celadon City','Insígnia Rainbow','TM19 Giga Drain','grass'),
('KOGA','Koga','Fuchsia City','Insígnia Soul','TM06 Toxic','poison'),
('SABRINA','Sabrina','Saffron City','Insígnia Marsh','TM04 Calm Mind','psychic'),
('BLAINE','Blaine','Cinnabar Island','Insígnia Volcano','TM38 Fire Blast','fire'),
('GIOVANNI','Giovanni','Viridian City','Insígnia Earth','TM26 Earthquake','ground')]
G.append(dict(id='gyms',t='Líderes de ginásio',d='Na ordem em que você enfrenta. O prêmio de cada ginásio é a insígnia e uma TM.',items=[dict(n=n,sub=f'{c} · {b}',tag=tm,ty=ty,gi=i,p=party('TRAINER_LEADER_'+k)) for i,(k,n,c,b,tm,ty) in enumerate(gyms)]))
e4=[('LORELEI','Lorelei','ice'),('BRUNO','Bruno','fighting'),('AGATHA','Agatha','ghost'),('LANCE','Lance','dragon')]
G.append(dict(id='e4',t='Elite Four e Campeão',d='Os cinco seguidos, sem voltar ao Pokémon Center. O time do Campeão depende do inicial que você escolheu.',items=[dict(n=n,sub='Indigo Plateau',ty=ty,gi=8,p=party('TRAINER_ELITE_FOUR_'+k)) for k,n,ty in e4]+[dict(n='Blue (Campeão)',sub='Indigo Plateau',ty=None,gi=8,ps=rival('TRAINER_CHAMPION_FIRST'))]))
rv=[('TRAINER_RIVAL_OAKS_LAB','Laboratório do Prof. Oak','Pallet Town'),('TRAINER_RIVAL_ROUTE22_EARLY','Rota 22 (1ª vez)','Antes de Pewter'),('TRAINER_RIVAL_CERULEAN','Ponte Nugget','Cerulean City'),('TRAINER_RIVAL_SS_ANNE','S.S. Anne','Vermilion City'),('TRAINER_RIVAL_POKEMON_TOWER','Pokémon Tower','Lavender Town'),('TRAINER_RIVAL_SILPH','Silph Co.','Saffron City'),('TRAINER_RIVAL_ROUTE22_LATE','Rota 22 (2ª vez)','Antes da Victory Road')]
G.append(dict(id='rival',t='Rival (Blue)',d='As sete batalhas contra o rival antes da Liga. O time muda conforme o seu inicial.',items=[dict(n=n,sub=s,ty=None,gi=None,ps=rival(k)) for k,n,s in rv]))
G.append(dict(id='rocket',t='Equipe Rocket',d='Giovanni como chefe da Rocket, antes de ele aparecer como líder de ginásio.',items=[dict(n='Giovanni',sub='Rocket Hideout, Celadon',ty='ground',gi=None,p=party('TRAINER_BOSS_GIOVANNI')),dict(n='Giovanni',sub='Silph Co., Saffron',ty='ground',gi=None,p=party('TRAINER_BOSS_GIOVANNI_2'))]))
G.append(dict(id='rematch',t='Revanche da Liga (pós-jogo)',d='Depois de terminar a história das Ilhas Sevii, a Elite Four volta com times de nível 60 a 75.',items=[dict(n=n,sub='Indigo Plateau, revanche',ty=ty,gi=None,p=party(f'TRAINER_ELITE_FOUR_{k}_2')) for k,n,ty in e4]+[dict(n='Blue (Campeão)',sub='Indigo Plateau, revanche',ty=None,gi=None,ps=rival('TRAINER_CHAMPION_REMATCH'))]))
def mons(lst): return [dict(p=byn[x],l=l,m=[],i=None) for x,l in lst]
G.append(dict(id='red',t='Red no Monte Prateado',d='O protagonista de FireRed volta como chefe final secreto em Gold, Silver e Crystal. Golpes variam por versão, por isso aparecem só espécie e nível.',items=[dict(n='Red',sub='Mt. Silver · Gold/Silver/Crystal',ty=None,gi=None,p=mons([('Pikachu',81),('Espeon',73),('Snorlax',75),('Venusaur',77),('Charizard',77),('Blastoise',77)]))]))
# anime (Pokémon originais, Orange, Johto, Hoenn) — principais Pokémon, sem golpes
A=[('Ash Ketchum','Kanto',[('Pikachu','Parceiro desde o 1º episódio'),('Bulbasaur',''),('Charmander','Evoluiu até Charizard'),('Squirtle',''),('Caterpie','Evoluiu até Butterfree, solto depois'),('Pidgeotto','Evoluiu para Pidgeot, solto para proteger o bando'),('Kingler','Krabby, evoluiu na Liga Índigo'),('Muk',''),('Tauros','Capturou 30 na Zona Safari'),('Primeape','Deixado para treinar com um lutador')]),
('Ash Ketchum','Ilhas Laranja',[('Lapras','Solto para voltar ao seu bando'),('Snorlax','')]),
('Ash Ketchum','Johto',[('Heracross',''),('Chikorita','Evoluiu para Bayleef'),('Cyndaquil','Evoluiu para Quilava'),('Totodile',''),('Noctowl','Shiny'),('Phanpy','Evoluiu para Donphan')]),
('Ash Ketchum','Hoenn',[('Treecko','Evoluiu até Sceptile'),('Taillow','Evoluiu para Swellow'),('Corphish',''),('Torkoal',''),('Snorunt','Evoluiu para Glalie')]),
('Misty','Kanto e Johto',[('Staryu',''),('Starmie',''),('Goldeen',''),('Horsea',''),('Psyduck',''),('Togepi','Saiu do ovo que Ash encontrou'),('Poliwag','Evoluiu até Politoed'),('Corsola','')]),
('Brock','Kanto, Johto e Hoenn',[('Onix','Evoluiu para Steelix'),('Geodude',''),('Zubat','Evoluiu até Crobat'),('Vulpix',''),('Pineco','Evoluiu para Forretress'),('Mudkip','Evoluiu para Marshtomp'),('Lotad','Evoluiu até Ludicolo')]),
('Gary Oak','Liga Johto (Silver Conference)',[('Blastoise',''),('Arcanine',''),('Nidoqueen',''),('Golem',''),('Scizor',''),('Magmar','')]),
('May','Hoenn',[('Torchic','Evoluiu para Combusken'),('Wurmple','Evoluiu até Beautifly'),('Skitty',''),('Bulbasaur',''),('Squirtle','Evoluiu para Wartortle')]),
('Jessie','Equipe Rocket',[('Ekans','Evoluiu para Arbok'),('Lickitung',''),('Wobbuffet',''),('Seviper',''),('Wurmple','Evoluiu até Dustox')]),
('James','Equipe Rocket',[('Koffing','Evoluiu para Weezing'),('Victreebel',''),('Cacnea',''),('Chimecho',''),('Meowth','Parceiro do trio, não é dele')])]
AN=[dict(n=n,era=e,p=[dict(p=byn[x],note=note) for x,note in lst]) for n,e,lst in A]
# legendaries tips
LT={144:'Seafoam Islands, no fundo da caverna. Precisa de Surf e Strength para mover as pedras e parar a correnteza.',
145:'Power Plant, acessível pela Rota 10 com Surf. Ele fica no fundo da usina.',
146:'Mt. Ember, na One Island (Ilhas Sevii). Só depois de entregar o Meteorite e liberar as ilhas no pós-jogo.',
150:'Cerulean Cave, depois de terminar a história das Ilhas Sevii e pegar a Pokédex Nacional. Nível 70, o mais difícil de capturar.',
243:'Errante por Kanto depois da Pokédex Nacional, se você escolheu Squirtle. Foge no 1º turno: use Mean Look, Block ou Spider Web.',
244:'Errante por Kanto depois da Pokédex Nacional, se você escolheu Bulbasaur. Foge no 1º turno: use Mean Look, Block ou Spider Web.',
245:'Errante por Kanto depois da Pokédex Nacional, se você escolheu Charmander. Foge no 1º turno: use Mean Look, Block ou Spider Web.',
249:'Navel Rock, liberada só pelo evento oficial Mystic Ticket.',250:'Navel Rock, liberada só pelo evento oficial Mystic Ticket.',
386:'Birth Island, liberada só pelo evento oficial Aurora Ticket. Em FireRed vem na Forma Ataque, em LeafGreen na Forma Defesa.',
151:'Não aparece em FireRed. Só por eventos oficiais antigos, recebido em outro jogo e trocado.'}
json.dump(dict(G=G,AN=AN,LT=LT),open('extra.json','w'),ensure_ascii=False,separators=(',',':'))
print('ok',sum(len(g['items']) for g in G))
