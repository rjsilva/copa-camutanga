# Research: Site da Copa Camutanga Open de Futebol

**Fase 0** — decisões técnicas que resolvem as incógnitas do Technical Context.
Não restam itens "NEEDS CLARIFICATION".

## R1. Caminhos relativos (file://, GitHub Pages em subpasta, Netlify)

- **Decision**: todos os caminhos são **relativos** (`css/estilo.css`, `js/dados.js`,
  `img/logo.webp`; dentro do CSS, `url("../fonts/anton.woff2")`). Nunca começar com `/`.
- **Rationale**: `url(/fonts/...)` aponta para a raiz do disco em `file://` e para a raiz do
  domínio no GitHub Pages de projeto (`usuario.github.io/copa-camutanga/`), quebrando as fontes.
- **Alternatives**: `<base href>` — rejeitado, quebra âncoras `#jogo-A1` e varia entre ambientes.

## R2. Carregamento de dados sem fetch/módulos

- **Decision**: `js/dados.js` atribui `window.COPA = { times, jogos, avisos, patrocinadores }`; scripts comuns no
  fim do `<body>` na ordem `dados.js → logica.js → componentes.js → paginas.js`.
- **Rationale**: `fetch` de arquivo local e `type="module"` são bloqueados por CORS em `file://`
  (Princípio II).
- **Alternatives**: JSON + fetch, ES modules — proibidos pela constituição.
- **Escopo global**: cada arquivo de lógica expõe um único namespace (`window.Logica`,
  `window.Componentes`) para não poluir o global com dezenas de funções. `paginas.js` não expõe
  nada além do auto-início.

## R3. Fuso horário America/Recife

- **Decision**: datas no arquivo de dados em ISO 8601 **com offset explícito**
  (`"2026-10-24T14:00:00-03:00"`), convertidas com `new Date(iso)` (instante absoluto).
  Exibição sempre com `Intl.DateTimeFormat("pt-BR", { timeZone: "America/Recife", ... })`.
- **Rationale**: o instante absoluto torna comparações e contagem regressiva independentes do
  fuso do visitante; Recife não tem horário de verão desde 2019, mas o Intl cuida disso de
  qualquer forma. Suporte a `timeZone` é universal nos navegadores desktop atuais.
- **Formatos**: data `DD/MM` (`day:"2-digit", month:"2-digit"`), dia da semana abreviado
  capitalizado sem ponto ("Sáb", "Dom"), hora `HH:MM` 24h.
- **Testabilidade**: toda função que depende do "agora" recebe `agora` (Date) como parâmetro;
  só `paginas.js` chama `new Date()`. Parâmetro de URL `?agora=<ISO>` permite simular a data
  em qualquer página (usado no quickstart para validar SC-004).

## R4. Fontes locais (Anton + Inter)

- **Decision**: `fonts/anton-regular.woff2` (títulos) e `fonts/inter-400.woff2`,
  `fonts/inter-700.woff2` (corpo), subconjunto **latin** (inclui acentos do português),
  `font-display: swap`; `<link rel="preload">` só para Anton. Fallbacks:
  `"Anton", Impact, "Arial Narrow Bold", sans-serif` e
  `"Inter", "Segoe UI", Roboto, Arial, sans-serif`.
- **Itálico**: Anton não tem variante itálica; o efeito do cartaz é obtido com
  `font-style: italic` sintetizado ou `transform: skewX(-8deg)` nas faixas. Decisão:
  `skewX` no contêiner da faixa com contra-skew no texto quando necessário, para controle
  visual; contorno com `-webkit-text-stroke` + `paint-order` e sombra em `--vermelho-escuro`.
- **Rationale**: arquivos estáticos Inter 400/700 latin (~25 KB cada) + Anton (~30–60 KB)
  ficam bem abaixo do orçamento de 500 KB; a versão variável completa de Inter (~300 KB)
  estouraria o orçamento.
- **Origem**: ambas sob licença SIL OFL; baixar os .woff2 (ex.: google-webfonts-helper /
  repositórios oficiais) uma única vez durante a implementação e versionar na pasta. Incluir
  `fonts/LICENSE-OFL.txt`.

- **Ajuste na implementação (2026-11-23)**: o `<link rel="preload" ... crossorigin>` foi
  **removido**. Via `file://` ele gera erro de CORS no console (portão 1 da constituição),
  enquanto o `@font-face` carrega normalmente. Para evitar deslocamento de layout (CLS) na
  troca de fonte, todas as fontes usam `font-display: optional` em vez de `swap`. Resultado:
  CLS 0 no Regulamento e Lighthouse Performance ≥ 95 em todas as páginas.

## R5. Contraste da paleta (WCAG AA)

Razões calculadas (luminância relativa WCAG 2.1):

| Texto / Fundo | Razão | Uso permitido |
|---|---|---|
| Branco / Vermelho #D62828 | 5,0:1 | ✅ qualquer texto (horário, faixa de data) |
| Branco / Azul royal #1F4FD1 | 6,8:1 | ✅ qualquer texto (faixa do grupo, botões) |
| Azul-marinho / Branco | 16:1 | ✅ confronto no card branco |
| Ouro #FFD23F / Azul-marinho | 11:1 | ✅ qualquer texto |
| Ouro / Azul royal | 4,7:1 | ✅ qualquer texto |
| Ouro / Vermelho | 3,5:1 | ⚠️ **somente texto grande** (≥ 24px, ou ≥ 18,66px negrito) — títulos de rodada |
| Branco / Verde-gramado #2E7D32 | 5,1:1 | ✅ rodapé |
| Prata / Azul-marinho | 10:1 | ✅ |
| Vermelho / Branco | 5,0:1 | ✅ (ex.: status "Ao vivo" no card) |
| Azul elétrico #3B7BFF / Azul-marinho | 4,2:1 | ⚠️ só texto grande ou decoração/hover |
| Vermelho / Azul-marinho | 3,2:1 | ❌ não usar para texto |
| Ouro / Branco | 1,4:1 | ❌ proibido |

- **Decision**: títulos de rodada (ouro sobre vermelho) com no mínimo 28px; azul elétrico só em
  brilhos, bordas, foco e hover de fundo; foco visível com `outline: 3px solid var(--ouro)`.
  Gradiente do fundo: texto sobre gradiente sempre branco ou ouro (≥ 4,7:1 nos dois extremos).

## R6. Copiar link

- **Decision**: `navigator.clipboard.writeText(url)`; se indisponível ou rejeitado, mostrar um
  `<input readonly>` com o link já selecionado e a instrução "Pressione Ctrl+C". Confirmação em
  região `aria-live="polite"` ("Link copiado!") por 2,5 s.
- **Link de jogo**: `tabela.html#jogo-A1`; ao carregar com hash, a página rola até o jogo e
  aplica a classe de destaque (`:target` + animação curta). O link da tabela copia a URL atual
  com os filtros (`?grupo=A&time=arara`).
- **Rationale**: Clipboard API exige contexto seguro (https ou localhost/file em Chrome/Edge;
  pode falhar em alguns navegadores via `file://`); o fallback garante FR-018.

## R7. Filtros via URL

- **Decision**: `URLSearchParams` lendo `grupo` (A–D) e `time` (id); ao mudar o filtro,
  `history.replaceState` atualiza a URL sem recarregar. Valores inválidos são ignorados.
- **Rationale**: compartilhável (US6 cenário 5) e funciona em `file://`.

## R8. Renderização com template strings

- **Decision**: `componentes.js` gera HTML por template strings e **escapa** todo texto vindo
  dos dados com `escaparHtml()` (`& < > " '`). `paginas.js` insere com `innerHTML` uma vez por
  seção. Conteúdo essencial (títulos, navegação, `noscript`) já vem no HTML estático para SEO.
- **Rationale**: simples, sem bibliotecas; escape evita quebra de layout se o organizador
  digitar `<` ou aspas.

## R9. Contagem regressiva

- **Decision**: `setInterval` de 1 s; cada tick recalcula `alvo - Date.now()` (não decrementa
  um contador), evitando deriva quando a aba fica em segundo plano. Ao chegar a zero: para o
  intervalo e troca para "Aguardando resultado" (status manual, conforme clarificação). Texto
  visual atualizado a cada segundo com `aria-hidden="true"`; versão acessível estática
  ("Começa em 24/10 às 14:00") fora do contador para não inundar leitores de tela.

## R10. Testes sem framework

- **Decision**: `testes.html` carrega `js/logica.js` + `js/testes.js` (NÃO carrega
  `dados.js`). `testes.js` contém dados de teste próprios, um mini-executor
  (`teste(nome, fn)`, `igual(a, b)` com comparação profunda via `JSON.stringify` normalizado) e
  imprime ✅/❌ com mensagem de diferença e um resumo "N de M passaram" (fundo verde/vermelho).
- **Cobertura mínima**: resolução de vencedor/perdedor (vitória, pênaltis, empate sem pênaltis,
  jogo não encerrado, referência inexistente, encadeamento SF→QF→grupo); classificação
  (pontos, todos os desempates, empate triplo, sorteio, jogos não encerrados ignorados, W.O.);
  posições de grupo só com grupo completo; próximo jogo (antes, durante, adiado, ao vivo,
  todos encerrados); formatação de data/hora em Recife com `agora` em outros fusos.

## R11. SEO e Open Graph

- **Decision**: cada página com `<title>` único, `meta description`, `lang="pt-BR"`,
  `<meta name="viewport" content="width=device-width, initial-scale=1">`, `og:title`,
  `og:description`, `og:type=website`, `og:locale=pt_BR`, `og:image` e `twitter:card`.
- **og:image**: precisa de URL **absoluta** para a prévia funcionar. Como o domínio só é
  conhecido no deploy, o HTML usa a constante `https://SEU-DOMINIO/img/og-image.jpg`, e o
  quickstart traz o passo de substituição (buscar/substituir em todos os .html). Imagem
  1200×630, JPEG ≤ 120 KB, **não** carregada pela página (não conta no peso).
- Lighthouse SEO não depende de OG; depende de title, description, lang, links rastreáveis,
  `alt`, status HTTP e viewport — todos atendidos.

## R12. Performance (≥ 90 e < 500 KB)

- Sem imagem de fundo: estádio feito com `radial-gradient` (refletores) +
  `linear-gradient`; gramado do rodapé com `repeating-linear-gradient`.
- Logo/troféu em WebP (≤ 80 KB) com `width/height`; escudos opcionais em WebP ≤ 15 KB cada,
  `loading="lazy"` fora da primeira dobra.
- Um único CSS (~20–30 KB) e 4 JS pequenos (< 40 KB somados) sem minificação (sem build).
- Orçamento estimado da página inicial: HTML 8 KB + CSS 30 KB + JS 40 KB + fontes ~110 KB +
  logo 80 KB ≈ **270 KB**.

## R13. Validação dos dados do organizador

- **Decision**: `Logica.validarDados(copa)` retorna lista de avisos (time inexistente, id de jogo
  duplicado, referência a jogo inexistente, "encerrado" sem placar, data inválida). `paginas.js`
  envia para `console.warn` e, se houver avisos, mostra uma faixa discreta "Há dados
  inconsistentes — veja o console" **apenas** quando a página é aberta via `file://` (ambiente
  do organizador), nunca para o público.
- Itens inválidos são tratados como "A definir" (FR-007); nenhuma exceção interrompe a página
  (cada seção é renderizada dentro de `try/catch` com mensagem neutra).

## R14. Deploy

- **Decision**: GitHub Pages (pasta raiz do branch principal) ou Netlify Drop (arrastar a
  pasta). Nenhuma configuração extra. Atualização = editar `js/dados.js` → publicar.
- **Cache**: como não há build com hash, o `<script src="js/dados.js?v=AAAAMMDD">` não é
  usado (exigiria editar HTML). Aceita-se o cache curto padrão do GitHub Pages (10 min) /
  Netlify (revalida sempre). Documentado no quickstart: "pode levar alguns minutos para
  aparecer; recarregue com Ctrl+F5".
