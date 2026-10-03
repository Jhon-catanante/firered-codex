# Regras do projeto FireRed Codex

## Fluxo Git
- Nunca commitar direto na `main`. Sempre trabalhar em branch `feat/`, `fix/`, `chore/` ou `refactor/`.
- Mensagens no padrão Conventional Commits, em português (ex.: `feat: adiciona aba de lendários`).
- Ao terminar: abrir PR com resumo das mudanças. O merge na `main` dispara o deploy no Pages.

## Código
- O site publicado é `index.html` (gerado). Editar `scripts/template.html` e rodar `scripts/assemble.py`.
- Dados devem refletir a Geração III (tipos, status, habilidades e categoria física/especial por tipo).
- Não incluir ROMs, sprites ou arte oficial da franquia.
- Respeitar `prefers-reduced-motion` em qualquer animação nova.
- Testar em largura de celular (390px) antes do PR.
