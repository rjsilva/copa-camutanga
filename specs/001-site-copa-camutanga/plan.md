# Implementation Plan: Site da Copa Camutanga Open de Futebol

**Branch**: `001-site-copa-camutanga` | **Date**: 2026-11-23 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-site-copa-camutanga/spec.md`

## Summary

Site estático, só para desktop, com 7 páginas públicas (Início, Tabela, Classificação, Times,
Fase Final, Regulamento, Avisos) e uma página de testes. Todos os dados do torneio ficam em
`js/dados.js` (`window.COPA`). Funções puras em `js/logica.js` calculam o restante:
- resolução de "vencedor/perdedor do jogo X" e de "Nº do Grupo Y" (com pênaltis);
- classificação com desempate (Pts → SG → GP → confronto direto → sorteio);
- próximo jogo e contagem regressiva no fuso America/Recife;
- filtros por grupo e por time.

`js/componentes.js` gera o HTML no estilo do cartaz e `js/paginas.js` liga tudo ao DOM. Não há
build, dependências nem servidor: o site funciona via `file://`, GitHub Pages ou Netlify.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript ES2020+ (vanilla, scripts clássicos)

**Primary Dependencies**: nenhuma. Fontes locais Anton e Inter (.woff2, SIL OFL)

**Storage**: N/A. Os dados ficam em `js/dados.js`, versionado junto com o site

**Testing**: `testes.html` com mini-executor próprio em `js/testes.js` (sem framework)

**Target Platform**: navegadores desktop atuais (Chrome, Edge, Firefox, Safari), largura ≥ 1024px

**Project Type**: site estático (multipágina)

**Performance Goals**: Lighthouse desktop ≥ 90 (Performance, Acessibilidade, SEO); página
inicial < 500 KB (estimativa ≈ 270 KB, ver research R12)

**Constraints**: funcionar em `file://` (proibidos `fetch` e ES modules); caminhos relativos;
sem CDN; horários em America/Recife; WCAG AA; sem media queries para celular

**Scale/Scope**: 12 times, 19 jogos (12 de grupos + 7 de mata-mata), algumas dezenas de avisos,
8 arquivos HTML e 5 arquivos JS

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Princípio | Como o plano atende | Pré | Pós |
|---|---|---|---|---|
| I | Somente desktop | `body { min-width: 1024px }`, container de no máximo 1200px, nenhuma media query de celular | ✅ | ✅ |
| II | Estático, tecnologia pura | HTML, CSS e JS puros; scripts clássicos; `window.COPA` em `js/dados.js`; sem `fetch`, módulos, npm ou CDN; caminhos relativos (R1, R2) | ✅ | ✅ |
| III | Identidade visual | 9 custom properties da paleta; faixas com `skewX` e `clip-path`; Anton condensada em caixa alta, inclinada e com contorno (R4) | ✅ | ✅ |
| IV | Performance | sem imagens de fundo (gradientes); fontes com subconjunto latin; orçamento ≈ 270 KB (R12) | ✅ | ✅ |
| V | Acessibilidade | matriz de contraste calculada (R5); `alt`; foco visível; skip link; `aria-live`; tabelas com `caption`/`scope` | ✅ | ✅ |
| VI | pt-BR e Recife | `lang="pt-BR"`; `Intl.DateTimeFormat` com `timeZone: "America/Recife"`; datas DD/MM (R3) | ✅ | ✅ |
| VII | Atualização fácil | contrato [dados-js.md](contracts/dados-js.md) cobre placar, status, remarcação, mata-mata, sorteio, W.O. e avisos | ✅ | ✅ |
| VIII | Testes no navegador | `testes.html` + `js/testes.js` com dados próprios; cobertura mínima em R10 | ✅ | ✅ |
| IX | Código semântico e organizado | header/nav/main/section/article/table/footer; `logica.js` puro (recebe `agora` por parâmetro) separado de `componentes.js` e `paginas.js` | ✅ | ✅ |

**Diferenças em relação à estrutura de referência da constituição** (os nomes podem ser
ajustados, como ela mesma permite):
- a pasta de fontes chama-se `fonts/` (pedido do usuário), não `fontes/`;
- foi acrescentado `js/testes.js` para manter os testes fora do HTML.

Nenhuma violação. Complexity Tracking não se aplica.

## Project Structure

### Documentation (this feature)

```text
specs/001-site-copa-camutanga/
├── plan.md              # este arquivo
├── research.md          # Fase 0: decisões técnicas R1–R14
├── data-model.md        # Fase 1: entidades, regras, derivados
├── quickstart.md        # Fase 1: execução e validação ponta a ponta
├── contracts/
│   ├── dados-js.md      # formato do js/dados.js (interface do organizador)
│   ├── logica-api.md    # API pública de window.Logica
│   └── paginas-e-urls.md# páginas, parâmetros de URL, componentes
├── checklists/requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks)
```

### Source Code (repository root)

```text
index.html            # Início
tabela.html           # Jogos por rodada/data + filtros (?grupo, ?time, #jogo-ID)
classificacao.html    # 4 tabelas
times.html            # lista; detalhe via ?id=
fase-final.html       # chaveamento QF → SF → F
regulamento.html      # texto estático
avisos.html           # comunicados
testes.html           # executor de testes no navegador
css/
└── estilo.css        # :root (paleta, fontes), base, layout, faixas, linha de jogo, tabelas, chaveamento
js/
├── dados.js          # window.COPA = { times, jogos, avisos, patrocinadores } (único arquivo editado pelo organizador)
├── logica.js         # window.Logica: funções puras
├── componentes.js    # window.Componentes: template strings escapadas
├── paginas.js        # init por document.body.dataset.pagina
└── testes.js         # dados de teste + mini-executor + casos
fonts/
├── anton-regular.woff2
├── inter-400.woff2
├── inter-700.woff2
└── LICENSE-OFL.txt
img/
├── logo.webp         # logo/troféu
├── og-image.jpg      # 1200×630, só para compartilhamento
└── escudos/          # opcionais, <id>.webp
```

**Structure Decision**: projeto único, estático e multipágina na raiz do repositório, conforme
a estrutura pedida pelo usuário e o Princípio II. Os testes ficam em `testes.html` +
`js/testes.js`. Não há pasta `src/` nem `tests/`, porque não existe etapa de build.

## Decisões de design relevantes

- **Namespaces**: `window.Logica` e `window.Componentes` (R2); `paginas.js` não expõe nada.
- **Tempo**: só `paginas.js` lê o relógio (`new Date()` ou `?agora=`) e repassa `agora` às
  funções puras (R3).
- **Status manual**: o site nunca muda o status sozinho. Jogo `agendado` com horário já passado
  é exibido como "Aguardando resultado" (clarificação de 2026-11-23).
- **Mata-mata pré-cadastrado** com `data: null` e referências `colocado`/`vencedorDe`. O
  chaveamento se preenche automaticamente sem que o organizador digite os nomes dos times.
- **Sorteio de desempate** é registrado no próprio time (`sorteio: n`), para manter o topo
  `{ times, jogos, avisos, patrocinadores }` exigido pela constituição (1.1.0).
- **Robustez**: `validarDados` + cada seção renderizada em `try/catch`; dados inválidos aparecem
  como "A definir" (R13).
- **og:image** usa URL absoluta com o marcador `SEU-DOMINIO`, substituído no deploy (R11).
- **Fontes sem preload** (ajuste da implementação): o `<link rel="preload">` previsto na T011 foi
  removido, porque via `file://` gera erro de CORS no console (portão 1 da constituição). As
  fontes usam `font-display: optional`, o que também elimina o deslocamento de layout (CLS) na
  troca de fonte (research R4).

## Complexity Tracking

Não aplicável: nenhuma violação da constituição.
