# Quickstart: validar o site da Copa Camutanga

Guia de execução e validação ponta a ponta. Detalhes de dados em
[data-model.md](data-model.md); contratos em [contracts/](contracts/).

## Pré-requisitos

- Navegador desktop atual (Chrome/Edge para Lighthouse; Firefox/Safari para conferência).
- Nenhuma instalação. Opcional para testar como hospedagem: `python3 -m http.server 8000` na
  raiz do projeto.

## 1. Abrir

- Dar duplo clique em `index.html` (abre via `file://`). Console sem erros.
- Repetir via `http://localhost:8000/` — mesmo comportamento.

## 2. Testes da lógica

- Abrir `testes.html`. **Esperado**: resumo "N de N testes passaram" em verde, nenhum ❌.

## 3. Cenários de aceitação

Para simular datas use `?agora=` (ex.: `index.html?agora=2026-10-24T10:00:00-03:00`).
Para os cenários com placar, edite **apenas** `js/dados.js` e recarregue.

| # | Ação | Esperado | Ref. |
|---|---|---|---|
| 1 | Abrir `tabela.html` com os dados iniciais | 12 jogos A1…D3 com data, hora, grupo e confronto idênticos ao cartaz, por rodada → data | SC-001 |
| 2 | Em A1: `placar: { mandante: 2, visitante: 1 }, status: "encerrado"` | A2 = "Grêmio de Itambé x Seleção de Timbaúba"; A3 = "Tropa do Sheik x Seleção de Timbaúba" | SC-002 |
| 3 | A1 = 1 x 1 com `penaltis: { mandante: 4, visitante: 3 }` | A1 mostra "1 x 1 (pên. 4 x 3)"; A2/A3 iguais ao item 2; classificação conta empate (1 pt cada) | US2 |
| 4 | A1 = 1 x 1 sem pênaltis | A2/A3 mostram "Perdedor A1"/"Vencedor A1" | US2 |
| 5 | Lançar A1, A2, A3 com placares de teste | Classificação do Grupo A confere com cálculo manual (Pts, SG, GP, confronto direto) | SC-003 |
| 6 | Grupo com empate total (ex.: 3 vitórias 1 x 0 em ciclo) | "Empate — aguardando sorteio"; após `sorteio: 1/2/3` nos times, ordem aplicada | US3 |
| 7 | `index.html?agora=2026-10-24T10:00:00-03:00` | Destaque A1, contagem ≈ 4h 00m 00s | SC-004 |
| 8 | `index.html?agora=2026-10-24T14:30:00-03:00` (A1 sem placar) | A1 "Aguardando resultado"; seguinte B1 com contagem 1h30 | US4 |
| 9 | Marcar B1 `status: "ao-vivo"` | Início destaca B1 "Ao vivo" | US4 |
| 10 | Todos os jogos de grupo encerrados | Início: "Fase de grupos encerrada — aguarde a fase final"; Fase Final com QF1–QF4 preenchidas | US4, US8 |
| 11 | Mudar o fuso do sistema (ex.: Lisboa) e recarregar | Horários continuam 14:00/16:00 | FR-020 |
| 12 | `tabela.html?time=tropa-do-sheik` com A1 sem resultado | A1 + A2 e A3 marcados "possível" | US6 |
| 13 | `tabela.html?grupo=C` → "Copiar link" → colar em outra aba | Mesmo filtro aplicado; mensagem "Link copiado!" | US6, US9 |
| 14 | "Copiar link" de A1 → abrir o link | Página rola até A1 e o destaca | SC-009 |
| 15 | `times.html?id=songa` e `times.html?id=xyz` | Página do Songa; "Time não encontrado" com link para a lista | US7 |
| 16 | Adicionar aviso `importante: true` | Aparece no topo de Avisos e em destaque no Início | US10 |
| 17 | Erro proposital: `mandante: { vencedorDe: "Z9" }` | Site funciona; vaga mostra "A definir"; aviso no console | FR-007 |
| 18 | Abrir o Início; depois esvaziar `patrocinadores: []` | Grade com os 20 logos na ordem do arquivo; com a lista vazia, a seção some | US11, FR-029 |

## 4. Qualidade (portões da constituição)

1. **Lighthouse** (DevTools → modo Desktop) em todas as páginas via `http://localhost:8000`:
   Performance, Acessibilidade e SEO ≥ 90.
2. **Peso**: DevTools → Network (cache desativado) em `index.html`: total transferido < 500 KB.
3. **Teclado**: navegar só com Tab/Shift+Tab/Enter — foco visível em links, filtros e botões;
   "Pular para o conteúdo" funciona.
4. **Contraste**: conferir combinações com a tabela de [research.md](research.md#r5-contraste-da-paleta-wcag-aa).
5. **Larguras**: janela em 1024, 1280 e 1920 px — layout íntegro.
6. **Proibidos**: nenhum `package.json`, `node_modules`, `type="module"`, `fetch(`, `import `,
   CDN ou framework no projeto.

### Resultados medidos (2026-11-23, Lighthouse 12.2.1, modo desktop, servidor local)

| Página | Performance | Acessibilidade | SEO | Peso transferido |
|---|---|---|---|---|
| index.html (com os 20 patrocinadores) | 100 | 100 | 100 | 254 KB |
| tabela.html | 97 | 100 | 100 | 158 KB |
| classificacao.html | 100 | 100 | 100 | 158 KB |
| times.html | 95 | 100 | 100 | 157 KB |
| fase-final.html | 100 | 100 | 100 | 157 KB |
| regulamento.html | 100 | 100 | 100 | 161 KB |
| avisos.html | 100 | 100 | 100 | 157 KB |

Outras verificações feitas: `testes.html` 55/55 no navegador (inclusive com o sistema no fuso
de Tóquio) e no Node (fusos de Lisboa e Los Angeles); console sem erros via `file://` em todas
as páginas; nenhum item proibido, caminho absoluto, media query ou cor literal fora do `:root`;
capturas de tela em 1024, 1280 e 1920 px.

## 5. Publicar

1. Conferir que todos os jogos já disputados têm placar e `status: "encerrado"` em `js/dados.js`
   (portão obrigatório; ver T073).
2. Antes do primeiro deploy: substituir `https://SEU-DOMINIO` pelo endereço real nas metas
   `og:image`/`og:url` de todos os `.html`.
3. **GitHub Pages**: enviar a pasta ao repositório → Settings → Pages → branch principal, pasta
   raiz. **Netlify**: arrastar a pasta em app.netlify.com/drop.
4. Testar a prévia colando o link num aplicativo de mensagens (título, descrição e imagem).

## 6. Rotina do organizador

1. Abrir `js/dados.js` num editor de texto.
2. Seguir as instruções do topo do arquivo (placar, status, aviso).
3. Abrir `index.html` localmente para conferir.
4. Publicar (enviar o arquivo / arrastar a pasta). Pode levar alguns minutos para aparecer;
   recarregar com Ctrl+F5.

## 7. Pendências de deploy (T073/T074)

| Pendência | Responsável | Prazo |
|---|---|---|
| Lançar em `js/dados.js` os placares e status **reais** de A1–D3 (a fase de grupos terminou em 22/11/2026) e conferir classificação e fase final. **Portão: não publicar antes disso.** | Organização | antes do primeiro deploy |
| Substituir `https://SEU-DOMINIO` nas metas `og:url`/`og:image` de todos os `.html` | Quem publicar | antes do primeiro deploy |
| Fornecer o logo/troféu oficial (hoje `img/logo.svg` é um troféu provisório) e, se houver, escudos em `img/escudos/<id>.webp` (e preencher `escudo` no time) | Organização | quando disponível |
| Informar o endereço do campo (texto "a confirmar" em `regulamento.html`) | Organização | quando disponível |
| Teste de usabilidade com uma pessoa não técnica lançando placar e aviso em < 5 min (SC-005) | Organização | antes do primeiro deploy |
