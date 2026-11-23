# Contrato: páginas, URLs e componentes

## Páginas

Todas compartilham: `<header>` com logo + `<nav>` (link atual com `aria-current="page"`),
`<main id="conteudo">`, `<footer>` (gramado), link "Pular para o conteúdo", `<noscript>` com
aviso, `lang="pt-BR"`, scripts no fim do `<body>`:
`js/dados.js → js/logica.js → js/componentes.js → js/paginas.js`.

| Arquivo | `data-pagina` | Conteúdo | Parâmetros |
|---|---|---|---|
| `index.html` | `inicio` | hero (logo/troféu, nome), destaque do próximo jogo + contagem, aviso importante, últimos resultados, atalhos | `?agora=` |
| `tabela.html` | `tabela` | filtros (grupo, time, limpar, copiar link) + jogos por rodada → data, mata-mata ao final | `?grupo=A-D`, `?time=<id>`, `#jogo-<ID>`, `?agora=` |
| `classificacao.html` | `classificacao` | 4 tabelas (A–D) com `caption`, `th scope` | — |
| `times.html` | `times` | sem `id`: lista por grupo; com `id`: detalhe (selo, grupo, linha da classificação, jogos com "possível") ou "Time não encontrado" | `?id=<id>` |
| `fase-final.html` | `fase-final` | chaveamento QF → SF → F, "Data a definir", campeão | — |
| `regulamento.html` | `regulamento` | formato, pontuação, desempate, pênaltis, local (texto estático no HTML) | — |
| `avisos.html` | `avisos` | lista decrescente ou "Nenhum aviso no momento" | — |
| `testes.html` | — | executor de testes (carrega só `logica.js` + `testes.js`) | — |

- `?agora=<ISO>`: simula o momento atual (validação/QA). Ignorado se inválido.
- `#jogo-<ID>`: âncora de cada linha de jogo (`id="jogo-A1"`); ao abrir, rola e destaca.

## Componentes (`window.Componentes`, retornam string HTML escapada)

| Função | Saída |
|---|---|
| `faixaRodada(titulo)` | `<h2>` em faixa vermelha inclinada, texto ouro (≥ 28px) |
| `faixaData(iso)` | `<h3>` em faixa vermelha, texto branco: "SÁBADO 24/10" |
| `linhaJogo(jogoResolvido, { possivel })` | `<article id="jogo-ID">` grid 3 blocos: horário (vermelho) · grupo/fase (royal) · card branco com confronto, placar, status, selos, botão copiar |
| `tabelaClassificacao(grupo, linhas)` | `<table>` com `caption` "Grupo A", colunas Pos, Time, J, V, E, D, GP, GC, SG, Pts |
| `escudoTime(time, tamanho)` | `<img alt="Escudo do X">` ou selo `<span>` com sigla (fundo `var(--<cor>)`, texto branco) e `aria-hidden` quando o nome está ao lado |
| `contagemRegressiva(resultadoProximo)` | bloco do destaque com dias/horas/min/seg |
| `botaoCopiarLink(url, rotulo)` | `<button type="button" data-copiar="url">` |
| `cardAviso(aviso)` | `<article>` com `<time datetime>` |
| `chaveamento(jogosMataMata)` | colunas QF/SF/F |
| `gradePatrocinadores(lista)` | `<ul>` de cartões com `<img alt="<nome>">` (link opcional, nova aba, `rel="noopener noreferrer"`); lista vazia → `""` |
| `escaparHtml(texto)` | escape de `& < > " '` |

## Comportamentos de interface (em `paginas.js`)

- Filtros: `<select>` com `<label>`; mudança → re-render + `history.replaceState`.
- Copiar: delegação de clique em `[data-copiar]`; Clipboard API com fallback (input
  selecionado); mensagem em `aria-live="polite"`.
- Contagem: um `setInterval` por página, limpo ao terminar.
- Cada seção renderizada em `try/catch`; erro → mensagem neutra "Não foi possível exibir esta
  seção." e `console.error`.
