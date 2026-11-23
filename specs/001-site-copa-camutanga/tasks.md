---

description: "Task list for Site da Copa Camutanga Open de Futebol"
---

# Tasks: Site da Copa Camutanga Open de Futebol

**Input**: Design documents from `/specs/001-site-copa-camutanga/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: INCLUÍDOS. A constituição (Princípio VIII) exige testes da classificação e de
"vencedor/perdedor do jogo X" em `testes.html`; research R10 amplia a cobertura para as demais
funções puras. Os testes ficam em `js/testes.js` e devem ser escritos ANTES da implementação
da respectiva função (devem falhar primeiro).

**Organization**: tarefas agrupadas por história de usuário (US1–US10 do spec.md).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode rodar em paralelo (arquivo diferente, sem dependência pendente)
- **[Story]**: história do spec.md (US1…US10)
- Caminhos relativos à raiz do repositório (estrutura do plan.md; não há `src/`)

## Regras gerais (valem para TODAS as tarefas)

- Somente HTML5, CSS3 e JS puro ES2020+; scripts clássicos (proibido `type="module"`, `import`,
  `export`, `fetch`, npm, CDN, frameworks).
- Caminhos **relativos** (nunca começar com `/`); no CSS: `url("../fonts/...")`.
- `js/logica.js` expõe só `window.Logica` (IIFE), é puro: sem DOM, sem `window.COPA`, sem
  `new Date()` sem argumento; recebe `copa` e `agora` por parâmetro; não muta a entrada; nunca
  lança exceção com dados malformados ([contracts/logica-api.md](contracts/logica-api.md)).
- `js/componentes.js` expõe só `window.Componentes`; todo texto vindo dos dados passa por
  `escaparHtml`.
- Datas/horas sempre via `Intl.DateTimeFormat("pt-BR", { timeZone: "America/Recife" })`.
- Cores sempre por variável CSS; respeitar a matriz de contraste de
  [research.md R5](research.md#r5-contraste-da-paleta-wcag-aa) (ouro sobre vermelho só ≥ 28px;
  nunca vermelho sobre marinho nem ouro sobre branco em texto).
- Nenhuma media query para celular; `body { min-width: 1024px }`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: estrutura de pastas e recursos estáticos

- [X] T001 Criar as pastas `css/`, `js/`, `fonts/`, `img/`, `img/escudos/` na raiz do repositório, conforme "Source Code" do plan.md
- [X] T002 [P] Obter Anton Regular e Inter 400/700 em .woff2 (subconjunto latin, licença SIL OFL) e salvar como `fonts/anton-regular.woff2`, `fonts/inter-400.woff2`, `fonts/inter-700.woff2`, junto com `fonts/LICENSE-OFL.txt` (research R4). Se não houver acesso à rede, registrar como pendência e seguir com as fontes alternativas do sistema
- [X] T003 [P] Criar a imagem do logo/troféu em `img/logo.webp` (≤ 80 KB, a partir do cartaz oficial). Se o arquivo não estiver disponível, criar um troféu em SVG nas cores prata e ouro em `img/logo.svg` e usá-lo no lugar, anotando a pendência
- [X] T004 [P] Criar a imagem de compartilhamento `img/og-image.jpg` (1200×630, JPEG ≤ 120 KB, fundo azul-marinho → royal, título "COPA CAMUTANGA OPEN DE FUTEBOL" em ouro e branco), research R11

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: dados, estilos base, esqueletos JS, executor de testes e páginas-esqueleto

**⚠️ CRITICAL**: nenhuma história começa antes desta fase

- [X] T005 Criar `js/dados.js` conforme [contracts/dados-js.md](contracts/dados-js.md): bloco de instruções em português no topo e `window.COPA = { times, jogos, avisos }`. (a) 12 times com ids `tropa-do-sheik`, `gremio-de-itambe`, `selecao-de-timbauba` (A); `gremio-da-preguica`, `arara`, `selecao-de-ferreiros` (B); `santa-cruz`, `sport-da-toca`, `rua-sao-sebastiao` (C); `cbfc`, `rua-nova`, `songa` (D), cada um com `nome` acentuado, `grupo`, `sigla` (2–4 letras) e `cor` com um dos nomes `"azul-marinho"`, `"azul-royal"`, `"vermelho"`, `"vermelho-escuro"`, `"gramado"`. (b) Os 12 jogos A1…D3 exatamente como na tabela "Tabela da fase de grupos (2026)" do spec.md: `fase: "grupos"`, `rodada`, `data` ISO com `-03:00`, `ordemNoDia` (14:00 = 1, 16:00 = 2), rodada 2 com `mandante: { perdedorDe: "X1" }` e rodada 3 com `mandante: { vencedorDe: "X1" }`, `placar: null`, `status: "agendado"`, `observacao: "Jogo de abertura"` em A1. (c) QF1 `{colocado:1,grupo:"A"}` x `{colocado:2,grupo:"B"}`, QF2 1ºB x 2ºA, QF3 1ºC x 2ºD, QF4 1ºD x 2ºC, SF1 venc. QF1 x venc. QF3, SF2 venc. QF2 x venc. QF4, F venc. SF1 x venc. SF2, todos com `data: null`. (d) Um aviso de exemplo
- [X] T006 [P] Criar a base de `css/estilo.css`: `:root` com `--azul-marinho:#0B1E4F; --azul-royal:#1F4FD1; --azul-eletrico:#3B7BFF; --vermelho:#D62828; --vermelho-escuro:#9E1B1B; --ouro:#FFD23F; --branco:#FFFFFF; --prata:#C9CED6; --gramado:#2E7D32; --azul-marinho-translucido: rgb(11 30 79 / 0.85)`, mais variáveis de fonte e espaçamento. Incluir: `@font-face` (Anton, Inter 400/700, `font-display: swap`, `url("../fonts/...")`) com fallbacks `Impact, "Arial Narrow Bold", sans-serif` / `"Segoe UI", Roboto, Arial, sans-serif`; reset; `body { min-width:1024px }` com fundo em `radial-gradient` (refletores) + `linear-gradient` marinho → royal; `.container { max-width:1200px; margin:0 auto }`; header e nav (link atual destacado); footer com gramado em `repeating-linear-gradient` e texto branco; `.pular-conteudo`; `:focus-visible { outline:3px solid var(--ouro) }`; títulos (Anton, caixa alta, inclinação via `skewX(-8deg)`, contorno `-webkit-text-stroke` + sombra `--vermelho-escuro`); classes `.faixa`, `.faixa-rodada` (vermelho, texto ouro ≥ 28px) e `.faixa-data` (vermelho, texto branco) com `clip-path` de "pincelada"; botões (royal/branco)
- [X] T007 [P] Criar `js/logica.js` como IIFE expondo `window.Logica` com os utilitários: `formatarData(iso)` → "24/10", `formatarDiaSemana(iso)` → "Sáb" (capitalizado, sem ponto), `formatarHora(iso)` → "14:00", `formatarDataAviso("AAAA-MM-DD")` → "20/10" (sem conversão de fuso), `indexarTimes(times)` → mapa por id, `iniciais(nome)` ("Grêmio de Itambé" → "GI", ignorando preposições de/da/do), `corDoSelo(cor)` → o próprio nome se for `"azul-marinho" | "azul-royal" | "vermelho" | "vermelho-escuro" | "gramado"`, senão `"azul-royal"`
- [X] T008 [P] Criar `js/componentes.js` como IIFE expondo `window.Componentes` com `escaparHtml(texto)` (escapa `& < > " '`) e `escudoTime(time, tamanho)`: `<img src alt="Escudo do <nome>" width height>` quando houver `escudo`; senão um selo `<span class="selo">` com a `sigla` (ou `Logica.iniciais`), fundo `style="background: var(--${Logica.corDoSelo(time.cor)})"` e texto `var(--branco)`, com `aria-hidden="true"`
- [X] T009 [P] Criar `js/paginas.js` (IIFE, sem exports): ler `agora` de `?agora=<ISO>` (se válido) ou `new Date()`; função `renderizarSecao(elemento, fnHtml)` com `try/catch` que, em caso de erro, mostra "Não foi possível exibir esta seção." e chama `console.error`; despachante `switch (document.body.dataset.pagina)` com funções `iniciar<Pagina>` vazias para inicio, tabela, classificacao, times, fase-final, regulamento e avisos; executar em `DOMContentLoaded`
- [X] T010 [P] Criar `testes.html` (lang pt-BR, carrega somente `js/logica.js` e `js/testes.js`, sem `dados.js`) e `js/testes.js` com: mini-executor `teste(nome, fn)`, `igual(obtido, esperado, msg)` (comparação profunda por JSON normalizado), `verdadeiro(cond, msg)`, listagem ✅/❌ com diferença esperado × obtido, e resumo "N de M testes passaram" com fundo verde (todos) ou vermelho; a constante `COPA_TESTE` (copa mínima com 2 grupos de teste e jogos próprios) e os primeiros testes de formatação: `formatarData`, `formatarDiaSemana` e `formatarHora` para "2026-10-24T14:00:00-03:00" → "24/10", "Sáb", "14:00" (o resultado não pode depender do fuso do computador), além de `formatarDataAviso`, `iniciais` e `corDoSelo` (válido → mesmo nome; "#123456" ou ausente → "azul-royal")
- [X] T011 [P] Criar os 7 esqueletos de página `index.html`, `tabela.html`, `classificacao.html`, `times.html`, `fase-final.html`, `regulamento.html` e `avisos.html`, todos com: `<html lang="pt-BR">`, `meta charset`, `meta viewport` (`width=device-width, initial-scale=1`), `<title>` e `meta description` únicos, Open Graph (`og:title`, `og:description`, `og:type=website`, `og:locale=pt_BR`, `og:url` e `og:image` = `https://SEU-DOMINIO/img/og-image.jpg`), `twitter:card=summary_large_image`, `<link rel="preload">` da fonte Anton, `css/estilo.css`, link "Pular para o conteúdo", `<header>` com logo e `<nav>` para as 7 páginas (`aria-current="page"` na atual), `<main id="conteudo">` com `<h1>`, `<noscript>` explicando que a página precisa de JavaScript, `<footer>`, `<body data-pagina="...">` e, no fim do body, `js/dados.js`, `js/logica.js`, `js/componentes.js`, `js/paginas.js` nessa ordem ([contracts/paginas-e-urls.md](contracts/paginas-e-urls.md))

**Checkpoint**: abrir cada página via `file://` sem erros no console; `testes.html` verde

---

## Phase 3: User Story 1 - Consultar a tabela completa de jogos (Priority: P1) 🎯 MVP

**Goal**: tabela por rodada → data, no estilo do cartaz, com placar e status

**Independent Test**: abrir `tabela.html` e conferir os 12 jogos idênticos ao cartaz (quickstart, cenário 1)

### Tests for User Story 1 ⚠️

- [X] T012 [US1] Adicionar a `js/testes.js` os testes de:
  - `rotuloParticipante`: `{vencedorDe:"A1"}` → "Vencedor A1", `{perdedorDe:"A1"}` → "Perdedor A1", `{colocado:1,grupo:"A"}` → "1º do Grupo A";
  - `statusExibido(jogo, agora)`, todas as linhas da tabela "Status exibido" do data-model, incluindo `agendado` com data passada → "aguardando-resultado" e `data:null` → "data-a-definir";
  - `formatarPlacar`: "2 x 1", "1 x 1 (pên. 4 x 3)", "3 x 0 (W.O.)", "" sem placar;
  - `agruparPorRodadaEData`: ordem "Primeira Rodada" → "Segunda Rodada" → "Terceira Rodada", datas em ordem cronológica, jogos do mesmo dia por horário, mata-mata agrupado por fase ao final.

### Implementation for User Story 1

- [X] T013 [US1] Implementar em `js/logica.js` as funções `rotuloParticipante`, `statusExibido`, `formatarPlacar`, `agruparPorRodadaEData` e uma primeira versão de `resolverTimes(copa)`: participante string → `{ tipo:"time", time }`; referência → `{ tipo:"pendente", rotulo, possiveis:[] }`; id inexistente → pendente "A definir"; saída em ordem cronológica, com os jogos `data:null` no final, na ordem das fases (depende de T012)
- [X] T014 [US1] Implementar em `js/componentes.js` as funções `faixaRodada(titulo)` (`<h2 class="faixa faixa-rodada">`), `faixaData(iso)` (`<h3 class="faixa faixa-data">` com "SÁBADO 24/10" / "DOMINGO 25/10") e `linhaJogo(jogoResolvido, { possivel })`. A linha é um `<article id="jogo-<ID>" class="linha-jogo">` com 3 blocos: `<time datetime>` do horário (vermelho), grupo "GRUPO A" ou fase (royal) e card branco com mandante x visitante (escudo + nome; pendente em itálico), placar, selo de status ("Agendado", "Ao vivo", "Encerrado", "Adiado — nova data a definir", "Aguardando resultado", "Data a definir"), selo "Remarcado — era DD/MM" quando houver `dataOriginal`, e `observacao`
- [X] T015 [P] [US1] Adicionar a `css/estilo.css` os estilos de `.linha-jogo` (CSS Grid `grid-template-columns: 110px 140px 1fr`, uma linha só), bloco do horário (fundo `--vermelho`, texto branco), bloco do grupo (fundo `--azul-royal`, texto branco), card do confronto (fundo branco, texto `--azul-marinho`, nomes em caixa alta), selos de status (ao vivo = vermelho sobre branco, adiado/aguardando = marinho com borda), `.pendente` em itálico, e `.linha-jogo:target` / `.destacado` com borda `--ouro` e animação curta
- [X] T016 [US1] Preencher `tabela.html` com `<h1>Tabela de Jogos</h1>` e `<section id="lista-jogos" aria-live="polite">`; implementar `iniciarTabela()` em `js/paginas.js`: `Logica.resolverTimes(window.COPA)` → `agruparPorRodadaEData` → renderizar faixas e linhas via `renderizarSecao`, passando `agora` para o status (depende de T013 e T014)
- [X] T017 [US1] Validar a tabela com os 12 jogos de `js/dados.js` contra a tabela do spec.md: datas, horários, grupos, confrontos, ordem e rótulos "Perdedor A1"/"Vencedor A1" (quickstart, cenário 1, SC-001)

**Checkpoint**: tabela completa e fiel ao cartaz, sem placares

---

## Phase 4: User Story 2 - Resolução automática de "vencedor/perdedor do jogo X" (Priority: P1)

**Goal**: substituir referências pelo nome do time assim que o resultado é lançado (com pênaltis)

**Independent Test**: lançar só o placar de A1 em `js/dados.js` e ver A2/A3 com nomes reais (quickstart, cenários 2–4)

### Tests for User Story 2 ⚠️

- [X] T018 [US2] Adicionar a `js/testes.js` os testes de:
  - `vencedorEPerdedor`: vitória do mandante; vitória do visitante; 1 x 1 com pênaltis 4 x 3 → mandante vence, `penaltis:true`; 1 x 1 sem pênaltis → `null`; status "agendado" com placar → `null`; `placar:null` → `null`;
  - `resolverTimes`: A1 2 x 1 → A2 mandante = perdedor e A3 mandante = vencedor; A1 empatado sem pênaltis → A2/A3 pendentes "Perdedor A1"/"Vencedor A1"; resultado corrigido inverte os nomes; `{vencedorDe:"Z9"}` → pendente "A definir" sem exceção; ciclo A→B→A → pendente sem loop infinito; não muta a entrada;
  - `timesPossiveis({vencedorDe:"A1"})` com A1 aberto → os 2 ids de A1.

### Implementation for User Story 2

- [X] T019 [US2] Implementar em `js/logica.js` a função `vencedorEPerdedor(jogo)` conforme "Vencedor / perdedor de um jogo" do data-model: só existe com `status === "encerrado"` e placar; gols iguais são decididos por `penaltis` diferentes; senão não há vencedor (depende de T018)
- [X] T020 [US2] Estender `resolverTimes` em `js/logica.js` com a resolução recursiva de `vencedorDe`/`perdedorDe` (cache por id de jogo e conjunto "visitando" contra ciclos), preenchendo `vencedorId`, `perdedorId` e `decididoNosPenaltis`, e implementar `timesPossiveis(ref, copa)` (união recursiva dos possíveis dos participantes do jogo de origem) para preencher `possiveis` dos pendentes (depende de T019)
- [X] T021 [US2] Ajustar `linhaJogo` em `js/componentes.js`: placar com pênaltis "1 x 1 (pên. 4 x 3)", destaque visual (negrito) do vencedor no card, e pendente exibindo o rótulo, nunca "undefined"
- [X] T022 [US2] Executar os cenários 2, 3 e 4 do quickstart editando apenas `js/dados.js` e desfazer as edições depois (SC-002)

**Checkpoint**: US1 + US2 funcionam; `testes.html` verde

---

## Phase 5: User Story 3 - Classificação por grupo (Priority: P1)

**Goal**: 4 tabelas com J, V, E, D, GP, GC, SG, Pts e desempate oficial

**Independent Test**: lançar placares de teste e conferir as tabelas contra o cálculo manual (quickstart, cenários 5–6)

### Tests for User Story 3 ⚠️

- [X] T023 [US3] Adicionar a `js/testes.js` os testes de `calcularClassificacao(copa, grupo)`:
  - sem jogos → zeros e ordem alfabética, sem `aguardandoSorteio`;
  - vitória 3, empate 1, derrota 0;
  - J/V/E/D/GP/GC/SG corretos;
  - desempate por SG, depois por GP;
  - confronto direto quando exatamente 2 times empatam em Pts, SG e GP;
  - empate triplo (3 vitórias 1 x 0 em ciclo) → `aguardandoSorteio:true` em ordem alfabética;
  - com `sorteio` 1/2/3 nos times → ordem do sorteio e sem marca;
  - confronto direto empatado → sorteio;
  - jogos agendado/adiado/ao-vivo ignorados;
  - pênaltis não contam em GP/GC e o jogo conta como empate (1 pt cada);
  - W.O. usa o placar convencionado.

  Testar também `grupoCompleto` e `colocado(copa, grupo, n)`: retorna `null` com grupo incompleto ou posição aguardando sorteio.

### Implementation for User Story 3

- [X] T024 [US3] Implementar `calcularClassificacao`, `grupoCompleto` e `colocado` em `js/logica.js`, conforme "Classificação do grupo" do data-model: ordenação Pts ↓ → SG ↓ → GP ↓ → confronto direto (só com 2 empatados) → `sorteio` ↑ (se todos os empatados tiverem) → alfabética com `aguardandoSorteio = true` (depende de T023)
- [X] T025 [US3] Implementar `tabelaClassificacao(grupo, linhas)` em `js/componentes.js`: `<table>` com `<caption>` "Grupo A", `<th scope="col">` para Pos, Time, J, V, E, D, GP, GC, SG e Pts, `<th scope="row">` no nome com escudo, e nota "Empate — aguardando sorteio" quando houver
- [X] T026 [P] [US3] Adicionar a `css/estilo.css` os estilos das tabelas de classificação: cabeçalho royal com texto branco, linhas brancas com texto marinho, Pts em negrito, 1º e 2º com marcador lateral ouro (zona de classificação) e as 4 tabelas em grade 2×2
- [X] T027 [US3] Preencher `classificacao.html` (`<h1>Classificação</h1>`, `<section id="classificacao">` e legenda das colunas) e implementar `iniciarClassificacao()` em `js/paginas.js`, renderizando os grupos A–D (depende de T024 e T025)
- [X] T028 [US3] Executar os cenários 5 e 6 do quickstart comparando com o cálculo manual e desfazer as edições (SC-003)

**Checkpoint**: as 3 histórias P1 completas: tabela, resolução e classificação

---

## Phase 6: User Story 4 - Próximo jogo na página inicial (Priority: P2)

**Goal**: Início com hero, destaque do próximo jogo/ao vivo/aguardando, contagem regressiva, últimos resultados e aviso importante

**Independent Test**: `index.html?agora=...` em diferentes momentos (quickstart, cenários 7–10)

### Tests for User Story 4 ⚠️

- [X] T029 [US4] Adicionar a `js/testes.js` os testes de:
  - `proximoJogo(jogosResolvidos, agora, copa)`:
    - antes do primeiro jogo → modo "proximo";
    - 14:30 com A1 sem placar → modo "aguardando-resultado" com A1 e `seguinte` = B1;
    - A1 encerrado às 14:30 → modo "proximo" B1;
    - jogo "ao-vivo" tem prioridade;
    - jogos "adiado" e `data:null` ignorados;
    - tudo encerrado → modo "nenhum";
    - final com vencedor → `campeao` preenchido;
    - mesmo resultado com `agora` em outro fuso (mesmo instante).
  - `ultimosResultados` (máximo 4, mais recente primeiro).
  - `partesContagem("2026-10-24T14:00:00-03:00", agora 10:00 Recife)` → 0d 4h 0m 0s; após o horário → `terminou:true`.
  - `campeao`.

### Implementation for User Story 4

- [X] T030 [US4] Implementar `proximoJogo`, `ultimosResultados`, `partesContagem` e `campeao` em `js/logica.js` conforme "Próximo jogo (Início)" do data-model (depende de T029)
- [X] T031 [US4] Implementar em `js/componentes.js`:
  - `contagemRegressiva(resultado)`: bloco de destaque com data por extenso curta, horário, grupo e confronto;
    - contador DD/HH/MM/SS com `aria-hidden="true"` e o texto acessível "Começa em 24/10 às 14:00";
    - variantes "AO VIVO", "AGUARDANDO RESULTADO" (mostrando o seguinte abaixo), "Fase de grupos encerrada — aguarde a fase final" (nenhum jogo de mata-mata encerrado), "Aguardando a definição dos próximos jogos" (caso contrário) e "CAMPEÃO: <nome>".
  - `cardResultado(jogo)` compacto.
  - `cardAviso(aviso)`: `<article>` com `<time datetime>`, título e parágrafos.
- [X] T032 [P] [US4] Adicionar a `css/estilo.css` os estilos do hero (logo/troféu, título "COPA CAMUTANGA" com "OPEN" em faixa vermelha, brilho `--azul-eletrico`), do card de destaque do próximo jogo, dos dígitos do contador (Anton, ouro sobre marinho), da grade de últimos resultados, do aviso em destaque e dos botões de atalho
- [X] T033 [US4] Preencher `index.html` (hero com `<img>` do logo com `alt`, `width` e `height`; seções `#destaque`, `#aviso-importante`, `#ultimos-resultados`; atalhos para `tabela.html` e `classificacao.html`) e implementar `iniciarInicio()` em `js/paginas.js`: renderizar o destaque; `setInterval` de 1 s que recalcula `partesContagem` a partir de `Date.now()` (ou do `agora` simulado mais o tempo decorrido) e, ao terminar, para o intervalo e re-renderiza como "Aguardando resultado"; mostrar últimos resultados e o aviso mais recente com `importante:true` (depende de T030 e T031)
- [X] T034 [US4] Executar os cenários 7 a 11 do quickstart, incluindo a troca do fuso do sistema operacional (SC-004, FR-020)

**Checkpoint**: Início funcional com qualquer `?agora=`

---

## Phase 7: User Story 5 - Organizador atualiza tudo em um único arquivo (Priority: P2)

**Goal**: atualização só por `js/dados.js`, com instruções claras e tolerância a erros

**Independent Test**: uma pessoa não técnica lança um placar e um aviso seguindo os comentários (SC-005; quickstart, cenário 17)

### Tests for User Story 5 ⚠️

- [X] T035 [US5] Adicionar a `js/testes.js` os testes de `validarDados(copa)`. Cada um destes casos deve gerar um aviso em português, sem lançar exceção:
  - id de jogo duplicado;
  - time inexistente em mandante;
  - `vencedorDe` apontando para jogo inexistente;
  - grupo com número de times diferente de 3;
  - status fora de "agendado" | "ao-vivo" | "encerrado" | "adiado";
  - "encerrado" sem placar;
  - data ISO inválida;
  - ciclo de referências;
  - `cor` de time fora da paleta.

  Testar também que dados válidos geram lista vazia e que `validarDados(undefined)` retorna um aviso, não uma exceção.

### Implementation for User Story 5

- [X] T036 [US5] Implementar `validarDados(copa)` em `js/logica.js` (depende de T035)
- [X] T037 [US5] Em `js/paginas.js`, chamar `Logica.validarDados(window.COPA)` ao iniciar qualquer página: enviar os avisos para `console.warn` e, somente quando `location.protocol === "file:"`, inserir no topo do `<main>` a faixa `role="status"` "Há dados inconsistentes em js/dados.js — veja o console (F12)". Se `window.COPA` não existir (erro de sintaxe no dados.js), mostrar "Não foi possível carregar os dados da Copa." sem quebrar a navegação
- [X] T038 [P] [US5] Adicionar a `css/estilo.css` o estilo da faixa de dados inconsistentes (fundo ouro, texto marinho)
- [X] T039 [US5] Completar o bloco de instruções de `js/dados.js` com exemplos comentados de: placar normal, pênaltis, "ao-vivo" com placar parcial, adiamento, remarcação (`data` nova + `dataOriginal`), W.O. (`wo: "visitante"` = lado que não compareceu, mais o placar convencionado), datas do mata-mata, sorteio (`sorteio: 1` no time), aviso com `importante: true` e um lembrete das vírgulas e aspas
- [ ] T040 [US5] Executar o cenário 17 do quickstart e o teste com uma pessoa não técnica: lançar um placar e um aviso em menos de 5 minutos, sem editar outros arquivos (SC-005)

**Checkpoint**: organizador autônomo

---

## Phase 8: User Story 6 - Filtrar jogos por grupo e por time (Priority: P3)

**Goal**: filtros por grupo e por time na tabela, compartilháveis pela URL, com "jogos possíveis"

**Independent Test**: `tabela.html?grupo=C` e `tabela.html?time=tropa-do-sheik` (quickstart, cenários 12–13)

### Tests for User Story 6 ⚠️

- [X] T041 [US6] Adicionar a `js/testes.js` os testes de:
  - `filtrarJogos`: grupo "C" → só jogos do grupo C; time com A1 aberto → A1 com `possivel:false`, A2/A3 com `possivel:true`; time + grupo combinados; filtro vazio → todos.
  - `jogosDoTime`.
  - `lerFiltros("?grupo=Z&time=xyz", copa)` → `{grupo:null, time:null}`; `"?grupo=a"` → "A".

### Implementation for User Story 6

- [X] T042 [US6] Implementar `filtrarJogos`, `jogosDoTime` e `lerFiltros` em `js/logica.js` (depende de T041 e de T020 para `possiveis`)
- [X] T043 [US6] Acrescentar a `tabela.html`, antes da lista, um `<form id="filtros" role="search">` com `<label>`+`<select id="filtro-grupo">` (Todos, A–D), `<label>`+`<select id="filtro-time">` (Todos + os 12 times, preenchido via JS) e o botão "Limpar filtros"
- [X] T044 [US6] Estender `iniciarTabela()` em `js/paginas.js`: ler os filtros com `Logica.lerFiltros(location.search)`, refletir nos selects, re-renderizar a cada `change`, atualizar a URL com `history.replaceState` (`?grupo=A&time=arara`, omitindo vazios), mostrar a mensagem "Nenhum jogo encontrado" quando não houver jogos e marcar `possivel` com o selo "Jogo possível — depende de resultado" via `linhaJogo` (depende de T042 e T043)
- [X] T045 [P] [US6] Adicionar a `css/estilo.css` os estilos da barra de filtros (fundo `var(--azul-marinho-translucido)`, labels brancos, selects grandes com foco ouro) e do selo "Jogo possível"

**Checkpoint**: filtros funcionando e preservados na URL

---

## Phase 9: User Story 7 - Página de cada time (Priority: P3)

**Goal**: lista dos 12 times e página individual via `times.html?id=`

**Independent Test**: `times.html`, `times.html?id=songa`, `times.html?id=xyz` (quickstart, cenário 15)

### Implementation for User Story 7

- [X] T046 [US7] Implementar em `js/componentes.js` as funções `cardTime(time)` (link para `times.html?id=<id>` com escudo grande, nome e grupo) e `detalheTime(time, linhaClassificacao, itensJogos)` (cabeçalho com escudo, nome e "Grupo X"; linha de classificação com posição, Pts, J, V, E, D e SG; lista de jogos usando `linhaJogo` com `possivel`)
- [X] T047 [US7] Preencher `times.html` (`<h1 id="titulo-times">Times</h1>`, `<section id="times">`) e implementar `iniciarTimes()` em `js/paginas.js`. Sem `id`: 4 grupos com 3 cards cada. Com `id` válido: detalhe usando `Logica.calcularClassificacao` e `Logica.jogosDoTime`, atualizando `<h1>` e `document.title` ("<Nome> — Copa Camutanga"). Com `id` inválido: "Time não encontrado" e link "Ver todos os times" (depende de T046, T024 e T042)
- [X] T048 [P] [US7] Adicionar a `css/estilo.css` os estilos da grade de times (4 colunas por grupo, faixa do grupo em royal), do card com hover `--azul-eletrico` e do cabeçalho do detalhe com escudo de 120px
- [X] T049 [US7] Executar o cenário 15 do quickstart e validar o SC-006: a partir do Início, chegar ao próximo jogo de um time em no máximo 2 cliques (menu Times → card do time)

**Checkpoint**: páginas de time acessíveis por link direto

---

## Phase 10: User Story 8 - Fase final (mata-mata) (Priority: P3)

**Goal**: chaveamento QF → SF → F preenchido automaticamente pela classificação e pelos resultados

**Independent Test**: com grupos completos, QF1–QF4 mostram os nomes; lançar QF/SF preenche as fases seguintes (quickstart, cenário 10)

### Tests for User Story 8 ⚠️

- [X] T050 [US8] Adicionar a `js/testes.js` os testes:
  - `{colocado:1,grupo:"A"}` pendente "1º do Grupo A" com grupo incompleto e resolvido com o grupo completo;
  - posição aguardando sorteio continua pendente;
  - cadeia QF1 → SF1 → F resolvida após resultados (com pênaltis);
  - `timesPossiveis({colocado:2,grupo:"B"})` → os 3 times do B;
  - `statusExibido` com `data:null` → "data-a-definir";
  - `campeao` após a final.

### Implementation for User Story 8

- [X] T051 [US8] Estender `resolverTimes` e `timesPossiveis` em `js/logica.js` para participantes `{ colocado, grupo }` usando `Logica.colocado` (só com o grupo completo e sem sorteio pendente na posição) (depende de T050, T024 e T020)
- [X] T052 [US8] Implementar `chaveamento(jogosMataMata)` em `js/componentes.js`: 3 colunas ("Quartas de Final", "Semifinais", "Final") com cards de jogo (rótulo do jogo QF1…, participantes ou referência, placar com pênaltis, "Data a definir" ou data/hora, link `tabela.html#jogo-<ID>`) e bloco "CAMPEÃO" com troféu quando houver
- [X] T053 [P] [US8] Adicionar a `css/estilo.css` os estilos do chaveamento: colunas em grid, conectores entre jogos com bordas `--prata`, card do campeão em ouro com texto marinho
- [X] T054 [US8] Preencher `fase-final.html` (`<h1>Fase Final</h1>`, texto explicativo "Avançam o 1º e o 2º de cada grupo", `<section id="chaveamento">`) e implementar `iniciarFaseFinal()` em `js/paginas.js`; conferir que a Tabela (já renderizada pela T016 via `agruparPorRodadaEData`) exibe o mata-mata após a 3ª rodada com os nomes resolvidos (depende de T051 e T052)
- [X] T055 [US8] Executar o cenário 10 do quickstart com placares fictícios em todos os jogos de grupo e do mata-mata e desfazer as edições

**Checkpoint**: chaveamento automático e campeão exibido

---

## Phase 11: User Story 9 - Compartilhar link de um jogo ou da tabela (Priority: P3)

**Goal**: "Copiar link" com um clique, link que abre o jogo destacado e prévia de compartilhamento

**Independent Test**: copiar o link de A1 e abrir em outra aba (quickstart, cenários 13–14)

### Implementation for User Story 9

- [X] T056 [US9] Implementar `botaoCopiarLink(url, rotulo)` em `js/componentes.js`, sem ler `location` (`<button type="button" class="botao-copiar" data-copiar="<url>" aria-label="Copiar link do jogo A1">`) e incluí-lo em `linhaJogo` (URL `<urlBase>tabela.html#jogo-<ID>`, com `urlBase` recebido em `opcoes.urlBase` e calculado por `js/paginas.js` a partir de `location`) e no cabeçalho da tabela (URL atual com filtros)
- [X] T057 [US9] Em `js/paginas.js`: delegação de clique em `[data-copiar]` → `navigator.clipboard.writeText`; em caso de falha ou ausência da API, mostrar um `<input readonly>` com o link selecionado e a instrução "Pressione Ctrl+C". Confirmação "Link copiado!" numa região única `<div aria-live="polite" class="aviso-copia">` por 2,5 s. Ao carregar com `#jogo-<ID>`: depois de renderizar, rolar até o elemento (`scrollIntoView({ block: "center" })`), aplicar `.destacado` e mover o foco para ele (`tabindex="-1"`) (depende de T056)
- [X] T058 [P] [US9] Adicionar a `css/estilo.css` os estilos de `.botao-copiar` (ícone/texto discreto no card, foco visível), do toast `.aviso-copia` (marinho com texto branco, canto inferior) e do campo de cópia manual
- [X] T059 [US9] Conferir em todos os `.html` as metas OG (`og:title`/`og:description` específicos de cada página) e a referência a `img/og-image.jpg`; executar os cenários 13 e 14 do quickstart (SC-009)

**Checkpoint**: compartilhamento funcional

---

## Phase 12: User Story 10 - Avisos, Regulamento e Sobre (Priority: P3)

**Goal**: lista de comunicados e página informativa do regulamento/local

**Independent Test**: com avisos cadastrados e com lista vazia; abrir o Regulamento (quickstart, cenário 16)

### Tests for User Story 10 ⚠️

- [X] T060 [US10] Adicionar a `js/testes.js` os testes de `ordenarAvisos(avisos)`: mais recente primeiro, sem mutar a entrada, lista vazia → `[]`, entrada inválida → `[]`

### Implementation for User Story 10

- [X] T061 [US10] Implementar `ordenarAvisos` em `js/logica.js` e usá-lo no Início (aviso importante mais recente) (depende de T060)
- [X] T062 [US10] Preencher `avisos.html` (`<h1>Avisos</h1>`, `<section id="avisos">`) e implementar `iniciarAvisos()` em `js/paginas.js` com `Componentes.cardAviso`; aviso `importante` com selo "Importante"; lista vazia → "Nenhum aviso no momento." (depende de T061 e T031)
- [X] T063 [P] [US10] Escrever o conteúdo estático de `regulamento.html` em seções `<section>` com `<h2>`:
  - "Formato" (4 grupos de 3, triangular com cabeça de chave, rodadas 1–3);
  - "Pontuação" (3/1/0);
  - "Critérios de desempate" (saldo, gols marcados, confronto direto, sorteio);
  - "Empate na 1ª rodada e no mata-mata" (pênaltis logo após o jogo, que não contam no saldo);
  - "Fase final" (1º e 2º de cada grupo, cruzamento das quartas, semifinais e final);
  - "Horários" (14:00 e 16:00, horário de Recife);
  - "Local" (texto "Campo de Camutanga (PE) — endereço a confirmar pela organização");
  - "Sobre".
- [X] T064 [P] [US10] Adicionar a `css/estilo.css` os estilos dos cards de aviso (branco com borda esquerda vermelha, data em royal), do selo "Importante" e da tipografia de texto corrido do regulamento (largura máxima de 75ch, texto branco sobre marinho)
- [X] T065 [US10] Executar o cenário 16 do quickstart e conferir o Regulamento

**Checkpoint**: todas as histórias completas

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: portões de qualidade da constituição e validação final

- [X] T066 [P] Revisar o HTML semântico de todas as páginas (`header`, `nav`, `main`, `section`, `article`, `table`, `footer`; uma `h1` por página; hierarquia de títulos sem saltos) e o `alt` de todas as imagens (decorativas com `alt=""`)
- [X] T067 [P] Confirmar que `css/estilo.css` e `js/componentes.js` não usam cores literais fora do `:root` (Princípio III) e auditar o contraste de todas as combinações usadas em `css/estilo.css` contra a matriz de research R5; corrigir qualquer texto ouro sobre vermelho menor que 28px, texto vermelho sobre marinho e texto azul elétrico pequeno
- [X] T068 Testar a navegação só por teclado em todas as páginas (skip link, menu, filtros, botões de copiar, links do chaveamento) com foco sempre visível; corrigir em `css/estilo.css` e `js/paginas.js`
- [X] T069 Conferir o layout com janelas de 1024px, 1280px e 1920px de largura; ajustar `css/estilo.css` sem criar media queries para celular
- [X] T070 Rodar o Lighthouse (modo Desktop) via `python3 -m http.server 8000` nas 7 páginas e corrigir até Performance, Acessibilidade e SEO ≥ 90; medir o peso transferido de `index.html` com cache desativado (< 500 KB) e registrar os números em `specs/001-site-copa-camutanga/quickstart.md`, na seção 4
- [X] T071 [P] Verificar os itens proibidos: buscar no projeto `type="module"`, `import `, `export `, `fetch(`, `http://` / `https://` em `src`/`href` de recursos (exceto as metas OG), `package.json` e `node_modules`; confirmar que todos os caminhos são relativos
- [X] T072 Confirmar que `testes.html` está 100% verde e executar o quickstart completo (cenários 1–17) via `file://` e via `http://localhost:8000`
- [ ] T073 Portão de deploy: lançar em `js/dados.js` os placares e status reais de A1–D3 (a fase de grupos terminou em 22/11/2026), conferidos pela organização, e verificar a classificação e a fase final resultantes. NÃO publicar enquanto houver jogo de grupo passado sem resultado
- [X] T074 Registrar no final de `specs/001-site-copa-camutanga/quickstart.md` as pendências de deploy: substituir `https://SEU-DOMINIO` nas metas `og:url`/`og:image` e fornecer logo, escudos e texto real do local (responsável: organização; prazo: antes do primeiro deploy)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências
- **Foundational (Phase 2)**: depende do Setup; BLOQUEIA todas as histórias
- **Histórias (Phases 3–12)**: dependem da Foundational; seguir a ordem de prioridade
  (P1 → P2 → P3), porque a maioria compartilha `js/logica.js`, `js/componentes.js`,
  `js/paginas.js` e `js/testes.js`
- **Polish (Phase 13)**: depois das histórias desejadas

### User Story Dependencies

- **US1 (P1)**: só Foundational
- **US2 (P1)**: estende `resolverTimes` da US1 (T013 → T020)
- **US3 (P1)**: só Foundational (a lógica é independente; a página usa escudos da T008)
- **US4 (P2)**: usa `resolverTimes` (US1/US2) para nomes corretos no destaque
- **US5 (P2)**: só Foundational (validação independente)
- **US6 (P3)**: depende de US1 (tabela) e US2 (`possiveis`)
- **US7 (P3)**: depende de US3 (classificação) e US6 (`jogosDoTime`)
- **US8 (P3)**: depende de US2 (resolução) e US3 (`colocado`)
- **US9 (P3)**: depende de US1 (`linhaJogo`)
- **US10 (P3)**: depende de US4 (`cardAviso`) para o Início; `regulamento.html` é independente

### Within Each User Story

- Testes em `js/testes.js` primeiro, falhando → lógica pura → componente → CSS → página → validação
- Arquivos iguais = tarefas sequenciais (sem [P])

### Parallel Opportunities

- Setup: T002, T003 e T004 em paralelo
- Foundational: T006–T011 em paralelo (arquivos distintos), depois de T005 ou junto com ele
- Dentro das histórias, as tarefas de CSS [P] (T015, T026, T032, T038, T045, T048, T053, T058,
  T064) podem andar junto com a lógica/componentes, pois só tocam `css/estilo.css`, mas não em
  paralelo entre si
- T063 (regulamento.html) pode ser feita a qualquer momento depois da T011
- Polish: T066, T067 e T071 em paralelo

---

## Parallel Example: User Story 1

```bash
# Depois de T012 (testes) e em paralelo com T013/T014:
Task: "T015 [US1] Estilos de .linha-jogo em css/estilo.css"

# Foundational inteira em paralelo:
Task: "T006 Base de css/estilo.css"
Task: "T007 Utilitários em js/logica.js"
Task: "T008 escaparHtml/escudoTime em js/componentes.js"
Task: "T009 Esqueleto de js/paginas.js"
Task: "T010 testes.html + js/testes.js"
Task: "T011 Esqueletos dos 7 .html"
```

---

## Implementation Strategy

### MVP First (US1)

1. Phase 1 + Phase 2
2. Phase 3 (US1): tabela fiel ao cartaz
3. **PARAR E VALIDAR** com o cenário 1 do quickstart; já é publicável

### Incremental Delivery

1. MVP (US1) → publicar
2. US2 + US3 (o restante do P1) → tabela "viva" e classificação → publicar
3. US4 + US5 (P2) → Início com contagem e organizador autônomo → publicar
4. US6–US10 (P3), uma por vez → publicar a cada uma
5. Polish → Lighthouse, acessibilidade, deploy final

---

## Notes

- [P] = arquivos diferentes, sem dependências pendentes
- Cada história é validada pelo seu cenário do quickstart antes de seguir
- Edições temporárias em `js/dados.js` para validação DEVEM ser desfeitas ao final de cada tarefa
- Não há git neste projeto ainda; se for criado, um commit por tarefa ou grupo lógico

---

## Phase 14: Convergence

- [X] T075 Exibir o `local` do jogo (quando preenchido em `js/dados.js`) no card de `linhaJogo` e no `cardChave` do chaveamento em `js/componentes.js`, hoje mostrado só no destaque do Início, per data-model: Jogo.local / spec Key Entities (Jogo) (partial)
- [X] T076 Validar `sigla` dos times em `validarDados` (`js/logica.js`): obrigatória, 2–4 caracteres, com aviso em português, e adicionar o caso correspondente em `js/testes.js`, per data-model: Time.sigla "2–4 letras" / FR-007 (partial)
- [X] T077 Em `escudoTime` (`js/componentes.js`), usar `alt=""` quando o nome do time é exibido ao lado do escudo (linha de jogo, tabela, cards), mantendo `alt="Escudo do <nome>"` só onde o escudo aparece sozinho, per contracts/paginas-e-urls.md (escudoTime) / Constitution V (partial)
- [X] T078 Registrar em `specs/001-site-copa-camutanga/plan.md` (Decisões de design) que o `<link rel="preload">` da fonte previsto na T011 foi removido e que as fontes usam `font-display: optional`, por causa do erro de CORS no console via `file://` (portão 1 da constituição), alinhando o plano ao research R4, per T011 / plan: decisões de design (contradicts)

---

## Phase 15: User Story 11 - Patrocinadores na página inicial (Priority: P3)

**Goal**: grade de logos dos patrocinadores no Início, cadastrados só em `js/dados.js` (FR-029)

**Independent Test**: quickstart, cenário 18

- [X] T079 Emendar a constituição para a versão 1.1.0 (`window.COPA = { times, jogos, avisos, patrocinadores }`, Princípios II e VII) em `.specify/memory/constitution.md`
- [X] T080 [P] [US11] Recortar os 20 logos dos painéis enviados pela organização e salvar em `img/patrocinadores/<id>.webp` (altura máx. 120px, WebP qualidade 82, ~116 KB no total)
- [X] T081 [US11] Adicionar a `js/testes.js` os testes de `listarPatrocinadores` (ordem, itens inválidos descartados, link só `http(s)`) e de `validarDados` para patrocinadores (sem logo, caminho absoluto, link sem `https://`, lista inválida)
- [X] T082 [US11] Implementar `listarPatrocinadores` e a validação de patrocinadores em `js/logica.js` (depende de T081)
- [X] T083 [US11] Implementar `gradePatrocinadores(lista)` em `js/componentes.js` (img com `alt` = nome, `width`/`height`, `loading="lazy"`, link opcional em nova aba com `rel="noopener noreferrer"`)
- [X] T084 [P] [US11] Adicionar a `css/estilo.css` a grade de 5 colunas com cartões brancos 16:9, faixa vermelha e hover `--azul-eletrico`; reservar altura de `#destaque` e `#ultimos-resultados` para evitar CLS
- [X] T085 [US11] Adicionar a seção `#patrocinadores` em `index.html` e a renderização em `iniciarInicio()` de `js/paginas.js` (seção oculta quando a lista estiver vazia)
- [X] T086 [US11] Cadastrar os 20 patrocinadores em `js/dados.js`, com instruções para incluir, remover e adicionar link
- [X] T087 [US11] Validar: `testes.html` 58/58, console sem erros via `file://`, captura de tela do Início e Lighthouse do Início (100/100/100, CLS 0, 254 KB)
- [ ] T088 [US11] Trocar os logos recortados por arquivos individuais da organização (PNG transparente ou WebP) e preencher os links (Instagram/site) de cada patrocinador em `js/dados.js` (responsável: organização)
