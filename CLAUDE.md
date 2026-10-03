# Regras do projeto FireRed Codex

## Fluxo Git

- Nunca commitar direto na `main`. Sempre trabalhar em branch `feat/`, `fix/`, `chore/` ou `refactor/`.
- Mensagens no padrão Conventional Commits, em português (ex.: `feat: adiciona aba de lendários`).
- Ao terminar: abrir PR com resumo das mudanças. O merge na `main` dispara o deploy no Pages.
- Antes do PR, rodar: `npm run lint && npm run format:check && npm run typecheck && npm test && npm run build`.

## Arquitetura

- `src/domain`: só funções puras sobre os dados. Nada de DOM aqui; toda regra nova ganha teste em `tests/domain`.
- `src/features/<aba>`: uma pasta por aba. Uma feature não importa outra; para navegar entre elas, use `emit` de `@/app/events`.
- `src/ui`: componentes compartilhados que devolvem HTML. Todo texto interpolado passa por `esc()`.
- `src/styles`: CSS em camadas, importado por `styles/index.css` na ordem tokens → base → layout → componentes → features → animações.
- Dados: nunca editar `src/data/*.json` à mão. Mudar o pipeline em `data-pipeline/` e rodar `./data-pipeline/run_all.sh`.
- Se uma mudança altera de propósito uma regra coberta pelo golden master, regenerar `tests/fixtures/legacy-golden.json` e explicar no PR.

## Conteúdo

- Dados devem refletir a Geração III (tipos, status, habilidades e categoria física/especial por tipo).
- Não incluir ROMs, sprites ou arte oficial da franquia.
- Respeitar `prefers-reduced-motion` em qualquer animação nova.
- Testar em largura de celular (390px) antes do PR.
