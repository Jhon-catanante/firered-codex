"""Minera os CSV da PokéAPI e monta o dataset base da Geração III (FireRed/LeafGreen).

Saída: snapshot/data.json (formato compacto; export_json.py gera os JSON do front).
Correções aplicadas para a Gen III: tipos/status/habilidades anteriores (tabelas *_past),
golpes com o poder/precisão da época (move_changelog), categoria física/especial pelo tipo,
Aço resistindo a Fantasma e Sombrio, só os 386 primeiros Pokémon.
"""
import json
import math
import re
import collections
import urllib.request
from pathlib import Path

import pandas as pd

HERE = Path(__file__).resolve().parent
CACHE = HERE / ".cache" / "pokeapi"
BASE = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv"
TABLES = (
    "pokemon pokemon_species pokemon_stats pokemon_types pokemon_types_past pokemon_abilities "
    "pokemon_abilities_past abilities ability_names ability_flavor_text moves move_changelog "
    "move_names move_effect_prose move_meta pokemon_moves machines items encounters encounter_slots "
    "location_areas locations location_names location_area_prose natures types type_efficacy "
    "pokemon_evolution pokemon_stats_past version_groups"
).split()
EN = 9
FRLG_VERSION_GROUP = 7
FR, LG = 10, 11


def R(name):
    path = CACHE / f"{name}.csv"
    if not path.exists():
        CACHE.mkdir(parents=True, exist_ok=True)
        urllib.request.urlretrieve(f"{BASE}/{name}.csv", path)
    return pd.read_csv(path)


def main():
    types = R("types")
    tname = {r.id: r.identifier for r in types.itertuples()}
    PHYS = {"normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel"}
    TYPES = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", "ground",
             "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel"]

    # Tabela de tipos (Gen III: sem Fada; Aço resiste a Fantasma e Sombrio)
    te = R("type_efficacy")
    chart = {a: {d: 1.0 for d in TYPES} for a in TYPES}
    for r in te.itertuples():
        a, d = tname[r.damage_type_id], tname[r.target_type_id]
        if a in chart and d in chart[a]:
            chart[a][d] = r.damage_factor / 100
    chart["ghost"]["steel"] = 0.5
    chart["dark"]["steel"] = 0.5

    sp = R("pokemon_species"); sp = sp[sp.id <= 386]
    pk = R("pokemon"); pk = pk[pk.id <= 386]
    names = {r.id: r.identifier for r in pk.itertuples()}

    def nice(s):
        special = {"nidoran-f": "Nidoran♀", "nidoran-m": "Nidoran♂", "mr-mime": "Mr. Mime",
                   "farfetchd": "Farfetch'd", "ho-oh": "Ho-Oh", "deoxys-normal": "Deoxys", "mime-jr": "Mime Jr."}
        return special.get(s, s.replace("-", " ").title())

    # Status base e EVs, com valores anteriores à Gen VI quando mudaram
    stats = R("pokemon_stats"); stp = R("pokemon_stats_past")
    SK = {1: "hp", 2: "atk", 3: "def", 4: "spa", 5: "spd", 6: "spe"}
    base = {i: {} for i in range(1, 387)}; ev = {i: {} for i in range(1, 387)}
    for r in stats[stats.pokemon_id <= 386].itertuples():
        base[r.pokemon_id][SK[r.stat_id]] = int(r.base_stat); ev[r.pokemon_id][SK[r.stat_id]] = int(r.effort)
    for (pid, sid), g in stp[(stp.generation_id >= 3) & (stp.pokemon_id <= 386)].groupby(["pokemon_id", "stat_id"]):
        row = g.sort_values("generation_id").iloc[0]
        if sid in SK:
            base[pid][SK[sid]] = int(row.base_stat)
            if not math.isnan(row.effort):
                ev[pid][SK[sid]] = int(row.effort)

    # Tipos (ex.: Clefairy volta a ser Normal)
    pt = R("pokemon_types"); ptp = R("pokemon_types_past")
    ptypes = collections.defaultdict(list)
    for r in pt[pt.pokemon_id <= 386].sort_values("slot").itertuples():
        ptypes[r.pokemon_id].append(tname[r.type_id])
    for pid, g in ptp[(ptp.generation_id >= 3) & (ptp.pokemon_id <= 386)].groupby("pokemon_id"):
        mg = g.generation_id.min()
        ptypes[pid] = [tname[t] for t in g[g.generation_id == mg].sort_values("slot").type_id]

    # Habilidades (sem ocultas, só as que existiam na Gen III)
    ab = R("abilities"); abgen = {r.id: r.generation_id for r in ab.itertuples()}
    abn = R("ability_names"); abname = {r.ability_id: r.name for r in abn[abn.local_language_id == EN].itertuples()}
    aft = R("ability_flavor_text"); abdesc = {}
    for r in aft[(aft.language_id == EN) & (aft.version_group_id.isin([5, 6, 7]))].itertuples():
        abdesc.setdefault(r.ability_id, r.flavor_text.replace("\n", " "))
    pa = R("pokemon_abilities"); pap = R("pokemon_abilities_past")
    pab = {}
    for pid in range(1, 387):
        cur = {r.slot: r.ability_id for r in pa[(pa.pokemon_id == pid) & (pa.is_hidden == 0)].itertuples()}
        past = pap[(pap.pokemon_id == pid) & (pap.generation_id >= 3) & (pap.is_hidden == 0)]
        for slot, g in past.groupby("slot"):
            v = g.sort_values("generation_id").iloc[0].ability_id
            if pd.isna(v):
                cur.pop(slot, None)
            else:
                cur[slot] = int(v)
        pab[pid] = [int(a) for s, a in sorted(cur.items()) if abgen.get(a, 9) <= 3]
    used_ab = sorted({a for v in pab.values() for a in v})

    # Golpes com valores da Gen III (desfaz o changelog posterior a FRLG)
    mv = R("moves"); mn = R("move_names")
    mname = {r.move_id: r.name for r in mn[mn.local_language_id == EN].itertuples()}
    vg = R("version_groups"); vord = {r.id: r.order for r in vg.itertuples()}
    ch = R("move_changelog"); ch["ord"] = ch.changed_in_version_group_id.map(vord)
    ch = ch[ch.ord > vord[FRLG_VERSION_GROUP]].sort_values("ord")
    mep = R("move_effect_prose"); eff = {r.move_effect_id: r.short_effect for r in mep[mep.local_language_id == EN].itertuples()}
    moves = {}
    for r in mv[mv.generation_id <= 3].itertuples():
        d = dict(type=tname[r.type_id], power=None if pd.isna(r.power) else int(r.power),
                 pp=None if pd.isna(r.pp) else int(r.pp), acc=None if pd.isna(r.accuracy) else int(r.accuracy),
                 eff=r.effect_id, ch=None if pd.isna(r.effect_chance) else int(r.effect_chance), prio=int(r.priority))
        for c in ch[ch.move_id == r.id].iloc[::-1].itertuples():  # do mais recente ao mais antigo: o mais antigo vence
            if not pd.isna(c.type_id): d["type"] = tname[int(c.type_id)]
            if not pd.isna(c.power): d["power"] = int(c.power)
            if not pd.isna(c.pp): d["pp"] = int(c.pp)
            if not pd.isna(c.accuracy): d["acc"] = int(c.accuracy)
            if not pd.isna(c.effect_chance): d["ch"] = int(c.effect_chance)
            if not pd.isna(c.effect_id): d["eff"] = int(c.effect_id)
        if d["type"] not in TYPES:
            continue
        cat = "status" if r.damage_class_id == 1 else ("fisico" if d["type"] in PHYS else "especial")
        e = eff.get(d["eff"], "") or ""
        if d["ch"] is not None:
            e = e.replace("$effect_chance", str(d["ch"]))
        e = re.sub(r"\[([^\]]*)\]\{[^}]*\}", lambda m: m.group(1) or "", e)
        moves[r.id] = dict(n=mname.get(r.id, r.identifier), t=d["type"], c=cat, p=d["power"], a=d["acc"], pp=d["pp"], pr=d["prio"], e=e)

    # Learnsets de FireRed/LeafGreen
    pm = R("pokemon_moves"); pm = pm[(pm.version_group_id == FRLG_VERSION_GROUP) & (pm.pokemon_id <= 386)]
    mach = R("machines"); mach = mach[mach.version_group_id == FRLG_VERSION_GROUP]
    tm = {r.move_id: r.machine_number for r in mach.itertuples()}
    learn = {}
    for pid, g in pm.groupby("pokemon_id"):
        L = dict(lv=[], tm=[], tu=[], egg=[])
        for r in g.itertuples():
            if r.move_id not in moves: continue
            if r.pokemon_move_method_id == 1: L["lv"].append([int(r.level), int(r.move_id)])
            elif r.pokemon_move_method_id == 4: L["tm"].append(int(r.move_id))
            elif r.pokemon_move_method_id == 3: L["tu"].append(int(r.move_id))
            elif r.pokemon_move_method_id == 2: L["egg"].append(int(r.move_id))
        L["lv"] = sorted(set(map(tuple, L["lv"])))
        L["tm"] = sorted(set(L["tm"]), key=lambda m: tm.get(m, 999))
        L["tu"] = sorted(set(L["tu"])); L["egg"] = sorted(set(L["egg"]))
        learn[int(pid)] = L

    # Evoluções
    items = R("items"); iname = {r.id: r.identifier.replace("-", " ").title() for r in items.itertuples()}
    evo = R("pokemon_evolution")

    def evotxt(sid):
        g = evo[evo.evolved_species_id == sid]
        if g.empty: return ""
        r = g.iloc[0]
        if r.evolution_trigger_id == 1:
            if not pd.isna(r.minimum_level): return f"Nv. {int(r.minimum_level)}"
            if not pd.isna(r.minimum_happiness): return "Amizade alta"
            return "Subir de nível"
        if r.evolution_trigger_id == 2:
            return "Troca" + (f" segurando {iname[int(r.held_item_id)]}" if not pd.isna(r.held_item_id) else "")
        if r.evolution_trigger_id == 3: return iname.get(int(r.trigger_item_id), "Item")
        return "Especial"

    species = {}
    for r in sp.itertuples():
        species[r.id] = dict(
            fr=None if pd.isna(r.evolves_from_species_id) or r.evolves_from_species_id > 386 else int(r.evolves_from_species_id),
            ch=int(r.evolution_chain_id), gr=int(r.gender_rate), cr=int(r.capture_rate), hatch=int(r.hatch_counter),
            leg=int(r.is_legendary) or int(r.is_mythical), how=evotxt(r.id))

    # Encontros: soma das raridades dos slots = chance real por área e método
    e = R("encounters"); s = R("encounter_slots")
    emn = {1: "Grama", 2: "Old Rod", 3: "Good Rod", 4: "Super Rod", 5: "Surf", 6: "Rock Smash", 18: "Presente",
           20: "Estático", 21: "Poké Flute", 36: "Troca", 28: "Errante", 19: "Ovo", 46: "Outro"}
    f = e[e.version_id.isin([FR, LG])].merge(s, left_on="encounter_slot_id", right_on="id", suffixes=("", "_s"))
    la = R("location_areas"); lap = R("location_area_prose"); ln = R("location_names")
    lname = {r.location_id: r.name for r in ln[ln.local_language_id == EN].itertuples()}
    lanm = {r.location_area_id: r.name for r in lap[lap.local_language_id == EN].itertuples()}
    la_loc = {r.id: r.location_id for r in la.itertuples()}

    def areaname(a):
        loc = lname.get(la_loc[a], "?"); an = lanm.get(a)
        n = loc if (not an or an == loc) else an
        if a == 1212: return "Pokémon Center (evento)"
        n = (n.replace("(north, towards Pewter City)", "(norte)").replace("(south, towards Viridian City)", "(sul)")
             .replace("Celadon Mansion rooftop", "Celadon Mansion (terraço)").replace("Prize Corner", "Game Corner (prêmios)")
             .replace("Pokemon", "Pokémon"))
        n = n.replace("Kanto ", "").replace("Road ", "Rota ").replace("Roaming Kanto", "Errante por Kanto").replace("Digletts", "Diglett's")
        n = n.replace("Victory Rota 2", "Victory Road")
        if n.startswith("Altering Cave (") and n != "Altering Cave (A)": n += " — evento"
        if n in ("Navel Rock", "Birth Island"): n += " (evento)"
        return n

    ENC = []
    for (a, p, m), g in f.groupby(["location_area_id", "pokemon_id", "encounter_method_id"]):
        fr = int(g[g.version_id == FR].rarity.sum()); lg = int(g[g.version_id == LG].rarity.sum())
        if m in (18, 20, 36, 21, 19, 28):  # presentes, estáticos e errantes: 100% quando existe
            fr = 100 if fr else 0; lg = 100 if lg else 0
        ENC.append([int(a), int(p), int(m), fr, lg, int(g.min_level.min()), int(g.max_level.max())])
    areas = {int(a): areaname(a) for a in {r[0] for r in ENC}}

    na = R("natures")
    nat = [[r.identifier.title(), SK[r.increased_stat_id], SK[r.decreased_stat_id]] for r in na.itertuples()]

    P = {i: dict(n=nice(names[i]), t=ptypes[i], b=base[i], ev={k: v for k, v in ev[i].items() if v}, ab=pab[i], **species[i])
         for i in range(1, 387)}
    used_moves = {m for l in learn.values() for m in l["tm"] + l["tu"] + l["egg"] + [x[1] for x in l["lv"]]}
    D = dict(P=P, M={int(k): v for k, v in moves.items() if k in used_moves}, L=learn,
             TM={int(k): int(v) for k, v in tm.items()}, A={a: [abname.get(a, "?"), abdesc.get(a, "")] for a in used_ab},
             E=ENC, AR=areas, EM=emn, N=nat, TC=chart, TY=TYPES)
    out = HERE / "snapshot" / "data.json"
    out.write_text(json.dumps(D, separators=(",", ":"), ensure_ascii=False))
    print(f"{out.relative_to(HERE.parent)}: {len(P)} Pokémon, {len(D['M'])} golpes, {len(ENC)} encontros, {len(areas)} áreas")


if __name__ == "__main__":
    main()
