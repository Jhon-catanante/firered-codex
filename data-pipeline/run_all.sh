#!/usr/bin/env bash
# Regera todos os dados do site a partir das fontes (PokéAPI + pret/pokefirered).
set -euo pipefail
cd "$(dirname "$0")"
python3 build_base.py     # PokéAPI -> snapshot/data.json (Gen III)
python3 add_habitats.py   # + hábitat da Pokédex
python3 trainers.py       # pret/pokefirered -> .cache/trainers_raw.json
python3 build_extra.py    # treinadores curados, anime, dicas -> snapshot/extra.json
python3 export_json.py    # snapshot -> src/data/*.json (consumido pelo front)
