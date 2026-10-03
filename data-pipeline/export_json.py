"""Converte o snapshot compacto (snapshot/data.json + snapshot/extra.json) nos JSONs
tipados consumidos pelo front em src/data/. Rodar a partir da raiz do repositório:

    python3 data-pipeline/export_json.py
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SNAP = ROOT / "data-pipeline" / "snapshot"
OUT = ROOT / "src" / "data"

D = json.loads((SNAP / "data.json").read_text())
X = json.loads((SNAP / "extra.json").read_text())
CAT = {"fisico": "physical", "especial": "special", "status": "status"}


def write(name, obj):
    (OUT / name).write_text(json.dumps(obj, ensure_ascii=False, separators=(",", ":")))
    print(f"{name:24} {(OUT / name).stat().st_size / 1024:8.1f} KB")


pokemon = [
    {
        "id": int(i),
        "name": p["n"],
        "types": p["t"],
        "baseStats": p["b"],
        "evYield": p["ev"],
        "abilities": p["ab"],
        "evolvesFrom": p["fr"],
        "evolutionChain": p["ch"],
        "evolutionMethod": p["how"],
        "genderRate": p["gr"],
        "captureRate": p["cr"],
        "hatchCounter": p["hatch"],
        "legendary": bool(p["leg"]),
        "habitat": p.get("hb", 5),
    }
    for i, p in sorted(D["P"].items(), key=lambda kv: int(kv[0]))
]
moves = [
    {
        "id": int(i),
        "name": m["n"],
        "type": m["t"],
        "category": CAT[m["c"]],
        "power": m["p"],
        "accuracy": m["a"],
        "pp": m["pp"],
        "priority": m["pr"],
        "effect": m["e"],
    }
    for i, m in sorted(D["M"].items(), key=lambda kv: int(kv[0]))
]
learnsets = {
    pid: {"levelUp": l["lv"], "tm": l["tm"], "tutor": l["tu"], "egg": l["egg"]}
    for pid, l in D["L"].items()
}
encounters = [
    {"area": a, "pokemon": p, "method": m, "rate": {"fr": fr, "lg": lg}, "minLevel": mi, "maxLevel": ma}
    for a, p, m, fr, lg, mi, ma in D["E"]
]


def mon(m):
    return {"pokemon": m["p"], "level": m["l"], "moves": m["m"], "item": m["i"]}


def trainer(it):
    t = {
        "name": it["n"],
        "subtitle": it["sub"],
        "type": it["ty"],
        "gymIndex": it["gi"],
        "tag": it.get("tag"),
    }
    if "p" in it:
        t["party"] = [mon(m) for m in it["p"]]
    else:
        t["partiesByStarter"] = {s: [mon(m) for m in ps] for s, ps in it["ps"].items()}
    return t


trainers = [
    {"id": g["id"], "title": g["t"], "description": g["d"], "trainers": [trainer(it) for it in g["items"]]}
    for g in X["G"]
]
anime = [
    {"name": a["n"], "era": a["era"], "pokemon": [{"pokemon": x["p"], "note": x["note"]} for x in a["p"]]}
    for a in X["AN"]
]

OUT.mkdir(parents=True, exist_ok=True)
write("pokemon.json", pokemon)
write("moves.json", moves)
write("learnsets.json", learnsets)
write("machines.json", D["TM"])
write("abilities.json", {k: {"name": v[0], "description": v[1]} for k, v in D["A"].items()})
write("encounters.json", encounters)
write("areas.json", D["AR"])
write("encounter-methods.json", D["EM"])
write("natures.json", [{"name": n, "up": u, "down": d} for n, u, d in D["N"]])
write("type-chart.json", {"types": D["TY"], "chart": D["TC"]})
write("trainers.json", trainers)
write("anime.json", anime)
write("legend-tips.json", X["LT"])
