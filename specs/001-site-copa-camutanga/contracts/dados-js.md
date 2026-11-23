# Contrato: `js/dados.js`

Único arquivo editado pelo organizador. Script comum (sem `type="module"`), apenas dados, com
comentários em português. Campos e regras em [../data-model.md](../data-model.md).

## Forma

```js
/* ==========================================================================
   DADOS DA COPA CAMUTANGA OPEN DE FUTEBOL — ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR
   --------------------------------------------------------------------------
   COMO LANÇAR UM RESULTADO:
     1. Ache o jogo pelo id (ex.: id: "A1").
     2. Troque   placar: null,   por   placar: { mandante: 2, visitante: 1 },
     3. Troque   status: "agendado",   por   status: "encerrado",
     Empate na 1ª rodada ou no mata-mata? Informe os pênaltis:
        placar: { mandante: 1, visitante: 1, penaltis: { mandante: 4, visitante: 3 } },
   STATUS POSSÍVEIS: "agendado", "ao-vivo", "encerrado", "adiado"
   Horários sempre no formato "2026-10-24T14:00:00-03:00" (horário de Recife).
   Salve o arquivo e publique. Não mexa em nenhum outro arquivo.
   ========================================================================== */

window.COPA = {
  times: [
    // Grupo A
    { id: "tropa-do-sheik",      nome: "Tropa do Sheik",      grupo: "A", sigla: "TDS", cor: "azul-royal"    },
    { id: "gremio-de-itambe",    nome: "Grêmio de Itambé",    grupo: "A", sigla: "GIT", cor: "azul-marinho"  },
    { id: "selecao-de-timbauba", nome: "Seleção de Timbaúba", grupo: "A", sigla: "STB", cor: "vermelho"      },
    // ... Grupos B, C, D (12 times no total)
    // cor: "azul-marinho", "azul-royal", "vermelho", "vermelho-escuro" ou "gramado"
    // Desempate por sorteio? Acrescente  sorteio: 1  (fica à frente),  sorteio: 2 ...
  ],

  jogos: [
    // ===== PRIMEIRA RODADA =====
    { id: "A1", fase: "grupos", grupo: "A", rodada: 1, data: "2026-10-24T14:00:00-03:00", ordemNoDia: 1,
      mandante: "tropa-do-sheik", visitante: "gremio-de-itambe",
      placar: null, status: "agendado", observacao: "Jogo de abertura" },
    // ...
    // ===== SEGUNDA RODADA =====
    { id: "A2", fase: "grupos", grupo: "A", rodada: 2, data: "2026-11-01T16:00:00-03:00", ordemNoDia: 2,
      mandante: { perdedorDe: "A1" }, visitante: "selecao-de-timbauba",
      placar: null, status: "agendado" },
    // ===== TERCEIRA RODADA =====
    { id: "A3", fase: "grupos", grupo: "A", rodada: 3, data: "2026-11-15T14:00:00-03:00", ordemNoDia: 1,
      mandante: { vencedorDe: "A1" }, visitante: "selecao-de-timbauba",
      placar: null, status: "agendado" },
    // ===== QUARTAS DE FINAL (datas a definir) =====
    { id: "QF1", fase: "quartas", data: null,
      mandante: { colocado: 1, grupo: "A" }, visitante: { colocado: 2, grupo: "B" },
      placar: null, status: "agendado" },
    // QF2: 1ºB x 2ºA · QF3: 1ºC x 2ºD · QF4: 1ºD x 2ºC
    // ===== SEMIFINAIS =====
    { id: "SF1", fase: "semifinal", data: null,
      mandante: { vencedorDe: "QF1" }, visitante: { vencedorDe: "QF3" },
      placar: null, status: "agendado" },
    // SF2: vencedor QF2 x vencedor QF4
    // ===== FINAL =====
    { id: "F", fase: "final", data: null,
      mandante: { vencedorDe: "SF1" }, visitante: { vencedorDe: "SF2" },
      placar: null, status: "agendado" }
  ],

  avisos: [
    { data: "2026-10-20", titulo: "Abertura da Copa", texto: "A Copa começa sábado, 24/10, às 14h.",
      importante: true }
  ],

  patrocinadores: [
    { id: "mercadinho-central", nome: "Mercadinho Central", logo: "img/patrocinadores/mercadinho-central.webp" },
    { id: "exemplo", nome: "Exemplo com link", logo: "img/patrocinadores/exemplo.webp", link: "https://instagram.com/exemplo" }
  ]
};
```

## Conteúdo obrigatório inicial

- Os 12 times da tabela de grupos do [spec](../spec.md#grupos).
- Os 12 jogos A1…D3 exatamente como na tabela do spec (data, hora, grupo, confronto,
  `ordemNoDia`), mais QF1–QF4, SF1, SF2 e F com `data: null`.
- Placares/status reais já conhecidos na data da implantação são lançados pela organização.

## Garantias

- Nenhum outro arquivo precisa ser editado para: lançar placar, mudar status, remarcar jogo,
  definir datas do mata-mata, registrar sorteio, W.O. ou publicar aviso.
- Erros de preenchimento não quebram o site (ver `validarDados` em
  [logica-api.md](logica-api.md)).
- Adicionar uma chave nova ao objeto é proibido sem emenda deste contrato (o topo é sempre
  `{ times, jogos, avisos, patrocinadores }`, Princípio II, constituição 1.1.0).
