# Data Model: Site da Copa Camutanga Open de Futebol

Fonte única: `js/dados.js` → `window.COPA = { times, jogos, avisos, patrocinadores }` (formato exato em
[contracts/dados-js.md](contracts/dados-js.md)). Tudo o que não está aqui é **derivado** por
`js/logica.js` ([contracts/logica-api.md](contracts/logica-api.md)).

## Entidades de entrada (editadas pelo organizador)

### Time

| Campo | Tipo | Obrig. | Regras |
|---|---|---|---|
| `id` | string | sim | slug minúsculo sem acento, único (`"tropa-do-sheik"`); usado em URLs e referências |
| `nome` | string | sim | nome de exibição |
| `grupo` | `"A"`–`"D"` | sim | exatamente 3 times por grupo |
| `sigla` | string | sim | 2–4 letras, exibida no selo quando não há escudo |
| `cor` | `"azul-marinho" \| "azul-royal" \| "vermelho" \| "vermelho-escuro" \| "gramado"` | sim | nome de uma variável da paleta; o selo usa `background: var(--<cor>)` com texto branco (todas as opções têm contraste ≥ 4,5:1 com branco). Valor inválido → `"azul-royal"` + aviso de validação |
| `escudo` | string | não | caminho relativo (`"img/escudos/arara.webp"`); ausente → selo com sigla |
| `sorteio` | inteiro ≥ 1 | não | só preencher após sorteio de desempate: menor número fica à frente |

### Jogo

| Campo | Tipo | Obrig. | Regras |
|---|---|---|---|
| `id` | string | sim | único (`A1`…`D3`, `QF1`…`QF4`, `SF1`, `SF2`, `F`) |
| `fase` | `"grupos" \| "quartas" \| "semifinal" \| "final"` | sim | |
| `grupo` | `"A"`–`"D"` | se fase = grupos | |
| `rodada` | 1 \| 2 \| 3 | se fase = grupos | |
| `data` | string ISO com offset `-03:00` \| `null` | sim | `null` = "Data a definir" |
| `dataOriginal` | string ISO | não | preenchida quando o jogo foi remarcado (mostra "Remarcado — era DD/MM") |
| `ordemNoDia` | 1 \| 2 | não | jogo 1 (14:00) / jogo 2 (16:00) do cartaz |
| `mandante`, `visitante` | Participante | sim | ver abaixo |
| `placar` | `null` \| `{ mandante, visitante, penaltis? }` | sim | inteiros ≥ 0; `penaltis` = `{ mandante, visitante }` |
| `status` | `"agendado" \| "ao-vivo" \| "encerrado" \| "adiado"` | sim | definido **somente** pelo organizador |
| `wo` | `"mandante" \| "visitante"` | não | lado que **não compareceu**; o placar convencionado vai em `placar` |
| `local` | string | não | padrão: local geral do regulamento |
| `observacao` | string | não | texto curto exibido no card |

### Participante (mandante/visitante)

| Forma | Significado | Rótulo enquanto não resolvido |
|---|---|---|
| `"arara"` | time definido (id) | — |
| `{ vencedorDe: "A1" }` | vencedor do jogo A1 | "Vencedor A1" |
| `{ perdedorDe: "A1" }` | perdedor do jogo A1 | "Perdedor A1" |
| `{ colocado: 1, grupo: "A" }` | 1º colocado do Grupo A | "1º do Grupo A" |

### Aviso

| Campo | Tipo | Obrig. | Regras |
|---|---|---|---|
| `data` | `"AAAA-MM-DD"` | sim | exibida como DD/MM; ordenação decrescente |
| `titulo` | string | sim | |
| `texto` | string | sim | texto simples (quebras de linha viram parágrafos) |
| `importante` | boolean | não | `true` → também aparece em destaque no Início |

### Patrocinador

| Campo | Tipo | Obrig. | Regras |
|---|---|---|---|
| `id` | string | não | slug, para organização do arquivo |
| `nome` | string | sim | texto alternativo do logo |
| `logo` | string | sim | caminho **relativo** (`"img/patrocinadores/<id>.webp"`); caminho absoluto gera aviso |
| `link` | string | não | só `http://` ou `https://`; outro valor é ignorado (logo sem link) e gera aviso |

Ordem de exibição = ordem da lista. Itens sem `nome` ou `logo` não são exibidos.

## Regras de negócio

### Vencedor / perdedor de um jogo

1. Só existe se `status === "encerrado"` e `placar` preenchido.
2. Gols diferentes → maior placar vence.
3. Gols iguais → se `penaltis` preenchido e diferente, vence quem fez mais nos pênaltis
   (`decididoNosPenaltis = true`); caso contrário **não há vencedor** (empate).
4. Jogos da rodada 1 e do mata-mata precisam de vencedor: enquanto empate sem pênaltis, as
   referências dependentes continuam pendentes.

### Resolução de participantes

- `vencedorDe/perdedorDe X`: resolve-se recursivamente os participantes de X; se X tem vencedor,
  retorna o time; senão, pendente com o rótulo.
- `colocado N do grupo G`: resolve-se **somente** quando os 3 jogos do grupo estão encerrados com
  placar **e** a posição N não está marcada como "aguardando sorteio".
- Referência a jogo/time inexistente ou ciclo → pendente com rótulo "A definir" + aviso de
  validação.
- **Times possíveis** de uma referência pendente: união dos times possíveis dos participantes do
  jogo de origem (ou os 3 times do grupo, para `colocado`). Usado para "jogo possível" no filtro
  por time e na página do time.

### Classificação do grupo

- Considera só jogos `fase: "grupos"`, do grupo, `status: "encerrado"` com placar.
- Vitória 3, empate 1, derrota 0. GP/GC ignoram pênaltis. W.O. usa o placar convencionado.
- Ordenação: Pts ↓ → SG ↓ → GP ↓ → confronto direto (apenas quando **exatamente 2** times seguem
  empatados; vence quem ganhou o jogo entre eles) → `sorteio` ↑ (se todos os empatados tiverem)
  → ordem alfabética com `aguardandoSorteio = true` nos empatados.
- Sem jogos: todos zerados, ordem alfabética, sem marca de sorteio.

### Status exibido

| Status nos dados | Condição | Exibido |
|---|---|---|
| `agendado` | `data` futura ou `null` | "Agendado" / "Data a definir" |
| `agendado` | `data` ≤ agora | "Aguardando resultado" |
| `ao-vivo` | — | "Ao vivo" (+ placar parcial se houver) |
| `encerrado` | placar preenchido | placar (+ "pên. X x Y", "W.O.") |
| `encerrado` | sem placar | "Aguardando resultado" + aviso de validação |
| `adiado` | — | "Adiado — nova data a definir" |
| qualquer | `dataOriginal` presente | selo adicional "Remarcado — era DD/MM" |

### Próximo jogo (Início)

1. Se há jogo `ao-vivo` → destaque "Ao vivo" (o mais antigo).
2. Senão, seja **P** o jogo de data mais recente com `data ≤ agora` (ignorando `adiado` e
   `data: null`). Se P está `agendado` → destaque "Aguardando resultado".
3. **Seguinte** = primeiro jogo `agendado` com `data > agora` (ordem cronológica) → contagem
   regressiva. Sem destaque dos passos 1–2, o seguinte é o destaque.
4. Nenhum → "Fase de grupos encerrada — aguarde a fase final" se nenhum jogo de mata-mata foi
   encerrado, senão "Aguardando a definição dos próximos jogos"; se a final tem vencedor →
   campeão.

## Estruturas derivadas (saída de `logica.js`)

- **JogoResolvido**: o jogo original + `mandanteR`/`visitanteR`
  (`{ tipo: "time", time }` ou `{ tipo: "pendente", rotulo, possiveis: [ids] }`), `vencedorId`,
  `perdedorId`, `decididoNosPenaltis`, `statusExibido`.
- **LinhaClassificacao**: `{ timeId, nome, j, v, e, d, gp, gc, sg, pts, posicao,
  aguardandoSorteio }`.
- **ResultadoProximoJogo**: `{ modo: "ao-vivo" | "aguardando-resultado" | "proximo" | "nenhum",
  jogo, seguinte, campeao }`.

## Transições de estado do jogo (feitas manualmente)

```text
agendado ──► ao-vivo ──► encerrado
   │  ▲                     ▲
   ▼  │ (nova data:          │ (correção de placar)
 adiado   data + dataOriginal)
```

Qualquer correção nos dados é refletida em todas as páginas na próxima carga (nada é
armazenado).
