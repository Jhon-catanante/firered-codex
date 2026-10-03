# Pipeline de dados

Gera os JSON em `src/data/` a partir das fontes abertas. O front não acessa nenhuma API em
tempo de execução: tudo é pré-processado aqui, corrigido para a Geração III e versionado.

```bash
pip install -r data-pipeline/requirements.txt
./data-pipeline/run_all.sh
```

| Etapa | Script | Fonte | Saída |
| --- | --- | --- | --- |
| 1 | `build_base.py` | CSV da [PokéAPI](https://github.com/PokeAPI/pokeapi) | `snapshot/data.json` |
| 2 | `add_habitats.py` | `pokemon_species.csv` | hábitat em `snapshot/data.json` |
| 3 | `trainers.py` | [pret/pokefirered](https://github.com/pret/pokefirered) | `.cache/trainers_raw.json` |
| 4 | `build_extra.py` | etapas 1 e 3 + conteúdo curado | `snapshot/extra.json` |
| 5 | `export_json.py` | `snapshot/` | `src/data/*.json` |

## Correções para a Geração III

- Tipos, status base e habilidades anteriores às mudanças das gerações seguintes (tabelas `*_past`).
- Poder, precisão e PP dos golpes como eram em FireRed (desfaz o `move_changelog`).
- Categoria física ou especial definida pelo **tipo** do golpe, como na Gen III.
- Tabela de tipos sem Fada, com Aço resistindo a Fantasma e Sombrio.
- Chance de encontro = soma das raridades dos slots de cada área e método.

`snapshot/` é versionado para que o site possa ser reconstruído sem baixar as fontes;
`.cache/` guarda os downloads e fica fora do Git.
