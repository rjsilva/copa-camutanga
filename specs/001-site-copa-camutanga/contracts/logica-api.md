# Contrato: `js/logica.js` (funções puras)

Exposto como `window.Logica`. Nenhuma função acessa DOM, `window.COPA`, `location` ou
`new Date()` sem parâmetro — tudo entra por argumento (Princípio IX). Testado por
`testes.html` (Princípio VIII). `copa` = objeto no formato de
[dados-js.md](dados-js.md).

## Resolução e resultados

| Função | Entrada → Saída | Notas |
|---|---|---|
| `vencedorEPerdedor(jogo)` | Jogo → `{ vencedor, perdedor, penaltis: bool } \| null` | lados (`"mandante"`/`"visitante"`), não ids; `null` se não encerrado, sem placar ou empate sem pênaltis |
| `resolverTimes(copa)` | → `JogoResolvido[]` | resolve todos os participantes (recursivo, com proteção a ciclos); ordem cronológica, `data: null` ao final na ordem das fases |
| `timesPossiveis(ref, copa)` | Participante → `string[]` | ids que ainda podem ocupar a vaga |
| `campeao(copa)` | → `Time \| null` | vencedor do jogo `F` |

## Classificação

| Função | Entrada → Saída | Notas |
|---|---|---|
| `calcularClassificacao(copa, grupo)` | → `LinhaClassificacao[]` (3 linhas) | regras em [data-model](../data-model.md#classificação-do-grupo) |
| `grupoCompleto(copa, grupo)` | → boolean | 3 jogos encerrados com placar |
| `colocado(copa, grupo, n)` | → `Time \| null` | `null` se grupo incompleto ou posição aguardando sorteio |

## Tempo e "próximo jogo"

| Função | Entrada → Saída |
|---|---|
| `statusExibido(jogo, agora)` | → `"agendado" \| "data-a-definir" \| "aguardando-resultado" \| "ao-vivo" \| "encerrado" \| "adiado"` |
| `proximoJogo(jogosResolvidos, agora, copa)` | → `{ modo, jogo, seguinte, campeao }` (regra no data-model) |
| `ultimosResultados(jogosResolvidos, n = 4)` | → encerrados mais recentes primeiro |
| `partesContagem(alvoIso, agora)` | → `{ dias, horas, minutos, segundos, terminou }` |

## Filtros e agrupamentos

| Função | Entrada → Saída |
|---|---|
| `filtrarJogos(jogosResolvidos, { grupo, time })` | → `[{ jogo, possivel }]`; `possivel = true` quando o time só está em `possiveis` |
| `jogosDoTime(jogosResolvidos, timeId)` | atalho de `filtrarJogos` |
| `agruparPorRodadaEData(itens)` | → `[{ titulo: "Primeira Rodada", datas: [{ iso, itens }] }]`; mata-mata agrupado por fase |
| `lerFiltros(searchString, copa)` | `"?grupo=A&time=arara"` → `{ grupo, time }` validados (inválidos viram `null`) |

## Formatação (sempre America/Recife, pt-BR)

| Função | Exemplo |
|---|---|
| `formatarData(iso)` | `"24/10"` |
| `formatarDiaSemana(iso)` | `"Sáb"` |
| `formatarHora(iso)` | `"14:00"` |
| `formatarDataAviso("2026-10-20")` | `"20/10"` (sem conversão de fuso) |
| `formatarPlacar(jogo)` | `"1 x 1 (pên. 4 x 3)"`, `"3 x 0 (W.O.)"`, `""` |
| `rotuloParticipante(ref)` | `"Vencedor A1"`, `"1º do Grupo A"` |
| `iniciais(nome)` | `"Grêmio de Itambé"` → `"GI"` (fallback quando faltar `sigla`) |
| `corDoSelo(cor)` | nome válido da paleta (`"azul-royal"` como padrão para valor inválido) |

## Patrocinadores

| Função | Entrada → Saída |
|---|---|
| `listarPatrocinadores(copa)` | → `[{ id, nome, logo, link }]` na ordem cadastrada, sem itens sem `nome`/`logo`; `link` = `null` se não for `http(s)` |

## Validação

| Função | Saída |
|---|---|
| `validarDados(copa)` | `string[]` de avisos em português (ids duplicados, time/jogo inexistente, grupo com ≠ 3 times, status inválido, encerrado sem placar, data inválida, `cor` fora da paleta, ciclo de referências). Nunca lança exceção. |

## Garantias

- Funções não mutam a entrada (retornam novos objetos).
- Entrada malformada nunca lança exceção; retorna valores neutros (pendente, `null`, lista vazia).
- Mesmo resultado para o mesmo `agora`, em qualquer fuso do computador.
