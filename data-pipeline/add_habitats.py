"""Adiciona o hábitat da Pokédex (PokéAPI, pokemon_species.habitat_id) a scripts/data.json."""
import csv, json, sys, urllib.request
URL = "https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/pokemon_species.csv"
src = sys.argv[1] if len(sys.argv) > 1 else None
rows = csv.DictReader(open(src) if src else urllib.request.urlopen(URL).read().decode().splitlines())
hab = {r["id"]: int(r["habitat_id"]) for r in rows if int(r["id"]) <= 386 and r["habitat_id"]}
D = json.load(open("scripts/data.json"))
for pid, p in D["P"].items():
    p["hb"] = hab.get(pid, 5)
json.dump(D, open("scripts/data.json", "w"), separators=(",", ":"), ensure_ascii=False)
print("hábitats adicionados:", len(hab))
