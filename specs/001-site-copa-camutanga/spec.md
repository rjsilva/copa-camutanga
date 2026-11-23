# Feature Specification: Site da Copa Camutanga Open de Futebol

**Feature Branch**: `001-site-copa-camutanga`

**Created**: 2026-11-23

**Status**: Draft

**Input**: User description: "Site oficial da COPA CAMUTANGA OPEN DE FUTEBOL, torneio amador de
Camutanga (PE), para torcedores, jogadores e organização consultarem tabela, jogos, resultados e
classificação." (descrição completa fornecida pelo usuário: contexto do torneio, grupos, tabela
2026, histórias de usuário, páginas, identidade visual, requisitos não funcionais, fora do escopo
e critérios de aceitação — resumida e incorporada abaixo).

## Contexto do Torneio

- 12 equipes em 4 grupos (A, B, C, D) de 3 times.
- Fase de grupos em "triangular com cabeça de chave":
  - **Rodada 1**: os dois times sorteados do grupo se enfrentam.
  - **Rodada 2**: o **perdedor** da rodada 1 enfrenta o terceiro time (o vencedor descansa).
  - **Rodada 3**: o **vencedor** da rodada 1 enfrenta o terceiro time.
- Jogos aos fins de semana, às 14:00 (jogo 1 do dia) e 16:00 (jogo 2 do dia), horário de Recife.

### Grupos

| Grupo | Times |
|-------|-------|
| A | Tropa do Sheik, Grêmio de Itambé, Seleção de Timbaúba |
| B | Grêmio da Preguiça, Arara, Seleção de Ferreiros |
| C | Santa Cruz, Sport da Toca, Rua São Sebastião |
| D | CBFC, Rua Nova, Songa |

### Tabela da fase de grupos (2026)

Cada jogo recebe um identificador único (grupo + rodada) para que as referências
"vencedor/perdedor do jogo X" funcionem. A numeração "jogo 1 / jogo 2" do cartaz equivale ao
horário do dia (14:00 / 16:00).

| ID | Rodada | Data | Hora | Grupo | Confronto |
|----|--------|------|------|-------|-----------|
| A1 | 1ª | Sáb 24/10 | 14:00 | A | Tropa do Sheik x Grêmio de Itambé (abertura) |
| B1 | 1ª | Sáb 24/10 | 16:00 | B | Grêmio da Preguiça x Arara |
| C1 | 1ª | Dom 25/10 | 14:00 | C | Santa Cruz x Sport da Toca |
| D1 | 1ª | Dom 25/10 | 16:00 | D | CBFC x Rua Nova |
| B2 | 2ª | Dom 01/11 | 14:00 | B | Perdedor B1 x Seleção de Ferreiros |
| A2 | 2ª | Dom 01/11 | 16:00 | A | Perdedor A1 x Seleção de Timbaúba |
| D2 | 2ª | Dom 08/11 | 14:00 | D | Perdedor D1 x Songa |
| C2 | 2ª | Dom 08/11 | 16:00 | C | Perdedor C1 x Rua São Sebastião |
| A3 | 3ª | Dom 15/11 | 14:00 | A | Vencedor A1 x Seleção de Timbaúba |
| B3 | 3ª | Dom 15/11 | 16:00 | B | Vencedor B1 x Seleção de Ferreiros |
| C3 | 3ª | Dom 22/11 | 14:00 | C | Vencedor C1 x Rua São Sebastião |
| D3 | 3ª | Dom 22/11 | 16:00 | D | Vencedor D1 x Songa |

## Clarifications

### Session 2026-11-23

- Q: Se um jogo da rodada 1 terminar empatado, como se decide vencedor e perdedor? → A: Pênaltis
  logo após o jogo; o placar dos pênaltis define vencedor/perdedor e não conta para gols
  pró/contra.
- Q: Qual a ordem dos critérios de desempate na classificação? → A: Pontos → saldo de gols →
  gols marcados → confronto direto → sorteio.
- Q: Quantos times avançam à fase final e como é o chaveamento? → A: 8 times (1º e 2º de cada
  grupo); quartas 1ºA x 2ºB, 1ºB x 2ºA, 1ºC x 2ºD, 1ºD x 2ºC; semifinais e final; sem 3º lugar.
- Q: Ao chegar o horário do jogo sem atualização do organizador, o site mostra "Ao vivo"
  automaticamente? → A: Não. Status só muda manualmente; após o horário, sem resultado, o jogo
  aparece como "Aguardando resultado".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultar a tabela completa de jogos (Priority: P1)

Como torcedor, quero ver a tabela completa da fase de grupos organizada por rodada e por data, no
mesmo estilo visual do cartaz (faixa de horário | faixa do grupo | confronto), com placar e status
de cada jogo.

**Why this priority**: é a informação central do torneio e o motivo principal de alguém acessar
o site; sozinha já substitui o cartaz com vantagem.

**Independent Test**: abrir a página de Tabela/Jogos e conferir que os 12 jogos aparecem
exatamente como no cartaz, agrupados por rodada → data, com status e placar quando houver.

**Acceptance Scenarios**:

1. **Given** os dados oficiais da fase de grupos, **When** o torcedor abre a Tabela, **Then** vê
   "Primeira Rodada", "Segunda Rodada" e "Terceira Rodada", cada uma subdividida por data, com os
   12 jogos em ordem cronológica, cada um mostrando horário, grupo e confronto idênticos ao cartaz.
2. **Given** um jogo encerrado com placar lançado, **When** o torcedor vê a Tabela, **Then** o
   jogo mostra o placar e o status "Encerrado".
3. **Given** um jogo sem resultado, **When** o torcedor vê a Tabela, **Then** o jogo mostra o
   status "Agendado" (ou "Ao vivo"/"Adiado", conforme informado pela organização).
4. **Given** um jogo adiado, **When** o torcedor vê a Tabela, **Then** o jogo aparece destacado
   como "Adiado", com a nova data/horário se já tiver sido definida.

---

### User Story 2 - Resolução automática de "vencedor/perdedor do jogo X" (Priority: P1)

Como torcedor, quero que "Vencedor do jogo X" / "Perdedor do jogo X" seja substituído
automaticamente pelo nome do time assim que o resultado do jogo X for lançado.

**Why this priority**: o formato triangular depende disso; sem a substituição, a tabela fica
confusa e o organizador teria de editar vários lugares a cada resultado.

**Independent Test**: lançar apenas o placar do jogo A1 nos dados e verificar que A2 e A3
passam a exibir os nomes corretos.

**Acceptance Scenarios**:

1. **Given** A1 sem resultado, **When** o torcedor vê A2 e A3, **Then** eles mostram
   "Perdedor A1" e "Vencedor A1".
2. **Given** A1 encerrado com Tropa do Sheik 2 x 1 Grêmio de Itambé, **When** o torcedor vê A2 e
   A3, **Then** A2 mostra "Grêmio de Itambé x Seleção de Timbaúba" e A3 mostra
   "Tropa do Sheik x Seleção de Timbaúba".
3. **Given** A1 terminou 1 x 1 no tempo normal e Tropa do Sheik venceu nos pênaltis por 4 x 3,
   **When** o torcedor vê A1, A2 e A3, **Then** A1 mostra "1 x 1 (pên. 4 x 3)", A2 mostra
   "Grêmio de Itambé x Seleção de Timbaúba" e A3 mostra "Tropa do Sheik x Seleção de Timbaúba".
4. **Given** A1 encerrado empatado e sem placar de pênaltis lançado, **When** o torcedor vê A2 e
   A3, **Then** eles continuam mostrando "Perdedor A1" / "Vencedor A1".
5. **Given** o resultado de A1 é corrigido nos dados, **When** a página é recarregada, **Then**
   A2, A3 e a classificação refletem a correção.

---

### User Story 3 - Classificação por grupo (Priority: P1)

Como torcedor, quero ver a classificação de cada grupo com J, V, E, D, GP, GC, SG e Pts,
recalculada automaticamente a partir dos placares.

**Why this priority**: é a segunda informação mais consultada e define quem avança.

**Independent Test**: lançar placares de alguns jogos e conferir que as 4 tabelas de
classificação mostram números e ordem corretos.

**Acceptance Scenarios**:

1. **Given** nenhum jogo encerrado, **When** o torcedor abre a Classificação, **Then** vê 4
   tabelas (A, B, C, D) com os 3 times cada, todos com zeros, em ordem alfabética.
2. **Given** placares lançados, **When** o torcedor abre a Classificação, **Then** cada time
   tem J, V, E, D, GP, GC, SG e Pts corretos (vitória 3 pts, empate 1, derrota 0) e a ordem
   segue os critérios de desempate.
3. **Given** dois times empatados em pontos, **When** a classificação é calculada, **Then** a
   ordem segue: 1) saldo de gols, 2) gols marcados, 3) confronto direto, 4) sorteio.
4. **Given** dois times empatados em pontos, saldo de gols e gols marcados, e um deles venceu o
   confronto direto, **When** a classificação é calculada, **Then** o vencedor do confronto
   direto aparece à frente.
5. **Given** times empatados em todos os critérios até o confronto direto (ou confronto direto
   empatado/não realizado, ou empate entre 3 times), **When** a organização ainda não registrou
   o sorteio, **Then** os times aparecem em ordem alfabética com indicação "empate — aguardando
   sorteio"; após o registro do sorteio nos dados, a ordem sorteada é aplicada.
6. **Given** um jogo adiado ou sem placar, **When** a classificação é calculada, **Then** esse
   jogo não é contabilizado.

---

### User Story 4 - Próximo jogo na página inicial (Priority: P2)

Como torcedor, quero ver na página inicial o próximo jogo (ou o jogo do dia) com data, horário,
grupo e times, com contagem regressiva, além dos últimos resultados e atalhos para Tabela e
Classificação.

**Why this priority**: é a porta de entrada do site e a informação mais imediata, mas depende
dos dados e regras das histórias P1.

**Independent Test**: simular diferentes datas/horas atuais e verificar qual jogo aparece como
"próximo" e se a contagem regressiva está correta.

**Acceptance Scenarios**:

1. **Given** a data/hora atual é 24/10 às 10:00 (Recife), **When** o torcedor abre o Início,
   **Then** vê "Tropa do Sheik x Grêmio de Itambé — Sáb 24/10 14:00 — Grupo A" e uma contagem
   regressiva de 4 horas.
2. **Given** um jogo está marcado como "Ao vivo", **When** o torcedor abre o Início, **Then**
   esse jogo aparece em destaque como "Ao vivo" no lugar da contagem regressiva.
3. **Given** o horário de um jogo já passou e ainda não há resultado, **When** o torcedor abre o
   Início, **Then** o jogo aparece como "Aguardando resultado" (sem contagem negativa) até que
   o placar seja lançado ou o próximo jogo comece.
4. **Given** todos os jogos cadastrados já foram encerrados, **When** o torcedor abre o Início,
   **Then** vê "Fase de grupos encerrada — aguarde a fase final" (se nenhum jogo do mata-mata
   foi disputado) ou "Aguardando a definição dos próximos jogos" (depois disso), ou o campeão,
   se a final já tiver resultado.
5. **Given** jogos encerrados, **When** o torcedor abre o Início, **Then** vê os últimos
   resultados (até 4 mais recentes) com placar.

---

### User Story 5 - Organizador atualiza resultados e avisos em um único lugar (Priority: P2)

Como organizador, quero lançar placares, status e avisos editando um único arquivo de dados, sem
mexer no resto do site.

**Why this priority**: sem isso o site fica desatualizado; o organizador não é programador.

**Independent Test**: uma pessoa sem conhecimento técnico, seguindo os comentários do arquivo de
dados, lança um placar e um aviso e vê ambos refletidos em todas as páginas.

**Acceptance Scenarios**:

1. **Given** o arquivo de dados com instruções e exemplos, **When** o organizador preenche o
   placar e o status de um jogo, **Then** Tabela, Início, Classificação, páginas dos times e
   referências vencedor/perdedor refletem o resultado, sem outra edição.
2. **Given** o organizador adiciona um aviso com data, título e texto, **When** o torcedor abre
   a página de Avisos, **Then** o aviso aparece no topo da lista (mais recente primeiro).
3. **Given** o organizador comete um erro de preenchimento (ex.: placar em branco num jogo
   marcado como encerrado, ID de jogo inexistente numa referência), **When** a página carrega,
   **Then** o site continua funcionando, mostra o jogo de forma neutra (ex.: "A definir") e não
   quebra as demais seções.

---

### User Story 6 - Filtrar jogos por grupo e por time (Priority: P3)

Como torcedor, quero filtrar a tabela de jogos por grupo e por time.

**Why this priority**: facilita a consulta, mas a tabela completa já atende sem filtro.

**Independent Test**: aplicar filtros na Tabela e conferir os jogos exibidos.

**Acceptance Scenarios**:

1. **Given** a Tabela aberta, **When** o torcedor escolhe "Grupo C", **Then** vê apenas C1, C2
   e C3, mantendo a organização por rodada/data.
2. **Given** a Tabela aberta, **When** o torcedor escolhe o time "Songa", **Then** vê apenas os
   jogos em que Songa está escalado, incluindo os resolvidos por vencedor/perdedor.
3. **Given** um filtro de time e A1 ainda sem resultado, **When** o torcedor filtra por
   "Tropa do Sheik", **Then** vê A1 e também A2 e A3 marcados como "jogo possível" (depende do
   resultado de A1).
4. **Given** um filtro ativo, **When** o torcedor clica em "Limpar filtros", **Then** vê todos os
   jogos novamente.
5. **Given** um filtro ativo, **When** o torcedor copia o link da página, **Then** quem abrir o
   link vê a tabela com o mesmo filtro aplicado.

---

### User Story 7 - Página de cada time (Priority: P3)

Como torcedor, quero ver a lista dos 12 times e uma página individual de cada um com escudo (ou
iniciais), grupo, posição na classificação e todos os jogos do time.

**Why this priority**: agrega valor a jogadores e torcedores de cada equipe, mas não é essencial.

**Independent Test**: abrir a lista de Times, clicar em um time e conferir as informações.

**Acceptance Scenarios**:

1. **Given** a página Times, **When** o torcedor a abre, **Then** vê os 12 times agrupados por
   grupo, cada um com escudo ou, na falta deste, um selo com as iniciais.
2. **Given** a página de um time, **When** o torcedor a abre, **Then** vê nome, grupo, posição
   e números na classificação, e a lista de jogos (confirmados e possíveis) com placar e status.
3. **Given** o link de uma página de time, **When** é aberto diretamente, **Then** mostra aquele
   time; se o time não existir, mostra mensagem "Time não encontrado" com link para a lista.

---

### User Story 8 - Fase final (mata-mata) (Priority: P3)

Como torcedor, quero ver o chaveamento da fase final: avançam o 1º e o 2º de cada grupo
(8 times) para quartas de final, semifinais e final.

| ID | Fase | Confronto |
|----|------|-----------|
| QF1 | Quartas | 1º do Grupo A x 2º do Grupo B |
| QF2 | Quartas | 1º do Grupo B x 2º do Grupo A |
| QF3 | Quartas | 1º do Grupo C x 2º do Grupo D |
| QF4 | Quartas | 1º do Grupo D x 2º do Grupo C |
| SF1 | Semifinal | Vencedor QF1 x Vencedor QF3 |
| SF2 | Semifinal | Vencedor QF2 x Vencedor QF4 |
| F | Final | Vencedor SF1 x Vencedor SF2 |

**Why this priority**: só tem uso após a fase de grupos, mas com o formato definido as vagas já
podem ser preenchidas automaticamente pela classificação.

**Independent Test**: com a fase de grupos completa, ver as quartas preenchidas com os times
corretos; lançar resultados de quartas/semis e ver as fases seguintes preenchidas.

**Acceptance Scenarios**:

1. **Given** o Grupo A ainda tem jogos não encerrados, **When** o torcedor abre Fase Final,
   **Then** as vagas do Grupo A aparecem como "1º do Grupo A" / "2º do Grupo A".
2. **Given** todos os jogos do Grupo A e do Grupo B encerrados (e sorteio registrado, se
   necessário), **When** o torcedor abre Fase Final, **Then** QF1 e QF2 mostram os nomes reais.
3. **Given** QF1 e QF3 encerradas (com pênaltis em caso de empate), **When** o torcedor abre Fase
   Final, **Then** SF1 mostra os dois vencedores.
4. **Given** datas/horários do mata-mata ainda não cadastrados, **When** o torcedor vê o
   chaveamento, **Then** cada jogo mostra "Data a definir".
5. **Given** a final encerrada, **When** o torcedor abre Fase Final ou Início, **Then** o
   campeão aparece em destaque.

---

### User Story 9 - Compartilhar link de um jogo ou da tabela (Priority: P3)

Como torcedor, quero copiar o link de um jogo ou da tabela com um clique, para enviar a outras
pessoas, e que o link mostre uma prévia bonita ao ser colado em aplicativos de mensagem.

**Why this priority**: amplia a divulgação, mas não é essencial à consulta.

**Independent Test**: clicar em "Copiar link" de um jogo, colar em outra aba e verificar que a
página abre focada naquele jogo.

**Acceptance Scenarios**:

1. **Given** um jogo na Tabela, **When** o torcedor clica em "Copiar link", **Then** o link é
   copiado e aparece a confirmação "Link copiado!".
2. **Given** um link de jogo, **When** alguém o abre, **Then** a página rola até o jogo e o
   destaca visualmente.
3. **Given** a cópia automática não é permitida pelo navegador, **When** o torcedor clica em
   "Copiar link", **Then** o link é exibido selecionado para cópia manual.
4. **Given** o link do site colado em um aplicativo de mensagens, **When** a prévia é gerada,
   **Then** mostra título, descrição e imagem da Copa.

---

### User Story 10 - Avisos, Regulamento e Sobre (Priority: P3)

Como organizador, quero publicar avisos (adiamento, mudança de local, regulamento); como
torcedor, quero ler os avisos, o regulamento e informações sobre o local dos jogos.

**Why this priority**: informativo; importante em caso de adiamento, mas de baixa complexidade.

**Independent Test**: cadastrar avisos e conferir a página de Avisos; abrir Regulamento/Sobre.

**Acceptance Scenarios**:

1. **Given** avisos cadastrados, **When** o torcedor abre Avisos, **Then** vê a lista com data
   (DD/MM), título e texto, do mais recente para o mais antigo.
2. **Given** nenhum aviso, **When** o torcedor abre Avisos, **Then** vê "Nenhum aviso no momento".
3. **Given** um aviso marcado como importante, **When** o torcedor abre o Início, **Then** vê
   esse aviso em destaque.
4. **Given** a página Regulamento/Sobre, **When** o torcedor a abre, **Then** vê o formato do
   torneio, critérios de pontuação e desempate e o local dos jogos.

---

### User Story 11 - Patrocinadores na página inicial (Priority: P3)

Como organizador, quero mostrar os logos dos patrocinadores na página inicial e trocá-los
editando apenas o arquivo de dados; como torcedor, quero ver quem apoia a Copa.

**Why this priority**: valoriza os apoiadores, mas não afeta a consulta de jogos.

**Independent Test**: com patrocinadores cadastrados, o Início mostra a grade de logos; com a
lista vazia, a seção não aparece.

**Acceptance Scenarios**:

1. **Given** patrocinadores cadastrados, **When** o torcedor abre o Início, **Then** vê a seção
   "Patrocinadores" com os logos na ordem cadastrada, cada um com o nome como texto alternativo.
2. **Given** um patrocinador com link, **When** o torcedor clica no logo, **Then** o link abre em
   nova aba; sem link, o logo não é clicável.
3. **Given** a lista vazia, **When** o torcedor abre o Início, **Then** a seção não é exibida.
4. **Given** um patrocinador sem logo ou com link inválido, **When** a página carrega, **Then** o
   site continua funcionando, o item inválido é ignorado ou fica sem link e há aviso de validação.

---

### Edge Cases

- **Empate na rodada 1**: decidido nos pênaltis logo após o jogo; enquanto o placar dos pênaltis
  não for lançado, as referências vencedor/perdedor continuam sem resolver.
- **Empate em jogo da rodada 2 ou 3**: permanece empate (sem pênaltis), conta 1 ponto
  para cada time.
- **Resultado ainda não lançado**: referências mostram "Vencedor A1"/"Perdedor A1"; o jogo
  aparece como confronto a definir, não como erro.
- **Referência a jogo inexistente** ou com dados incompletos: exibe "A definir" e não quebra a
  página.
- **Jogo adiado sem nova data**: aparece como "Adiado — nova data a definir" e fica fora do
  cálculo de "próximo jogo".
- **Jogo adiado com nova data** (remarcado): volta a "Agendado" com a nova data, passa a ser
  ordenado por ela e exibe "Remarcado — era DD/MM".
- **Horário passou sem resultado**: "Aguardando resultado"; nunca contagem negativa.
- **Visitante com computador em outro fuso**: datas, horários e contagem regressiva continuam
  baseados em Recife (UTC-3).
- **Placar com W.O.**: a organização pode registrar W.O.; o jogo mostra "W.O." e conta como
  vitória para o time presente com placar convencionado (ver Assumptions).
- **Nenhum jogo futuro**: Início mostra mensagem de fase encerrada/aguardando fase final ou
  o campeão.
- **Time sem escudo**: selo com as iniciais nas cores da Copa.
- **Tela de celular (360–720px)**: o layout se adapta (uma coluna, menu em duas linhas,
  tabelas de classificação com rolagem interna); a página nunca rola na horizontal.

## Requirements *(mandatory)*

### Functional Requirements

**Dados e regras**

- **FR-001**: O site MUST exibir os 12 jogos da fase de grupos com data, horário, grupo e
  confronto exatamente conforme a tabela oficial (seção Contexto do Torneio).
- **FR-002**: Cada jogo MUST ter um identificador único (ex.: A1, A2, A3) usado nas referências
  "Vencedor do jogo X" e "Perdedor do jogo X".
- **FR-003**: Um participante de jogo MUST poder ser um time definido ou uma referência a
  vencedor/perdedor de outro jogo (ou, na fase final, a uma posição de grupo, ex.: "1º do
  Grupo A"); a referência MUST ser substituída pelo nome do time quando o jogo de origem estiver
  encerrado com resultado. Em jogos que exigem vencedor (rodada 1 e mata-mata), empate no tempo
  normal é decidido nos pênaltis: o placar de pênaltis é registrado à parte, define
  vencedor/perdedor, é exibido junto ao placar (ex.: "1 x 1 (pên. 4 x 3)") e não conta para GP/GC
  nem altera os pontos do empate na classificação.
- **FR-004**: Cada jogo MUST ter um status entre: Agendado, Ao vivo, Encerrado, Adiado, definido
  somente pela organização no arquivo de dados (o site nunca muda o status sozinho). Um jogo
  "Agendado" cujo horário já passou MUST ser exibido como "Aguardando resultado".
- **FR-005**: A classificação de cada grupo MUST ser calculada automaticamente a partir dos jogos
  encerrados, com colunas J, V, E, D, GP, GC, SG e Pts (vitória 3, empate 1, derrota 0), e
  ordenada por: pontos → saldo de gols → gols marcados → confronto direto → sorteio. O
  confronto direto só se aplica a empate entre exatamente 2 times; empate entre 3 times que
  persista após gols marcados vai direto ao sorteio. O resultado do sorteio é registrado pela organização no arquivo de dados.
- **FR-006**: Toda atualização de placar, status, jogos, times e avisos MUST ser feita pela
  organização em um único arquivo de dados, sem alterar nenhuma outra parte do site.
- **FR-007**: Dados ausentes ou inconsistentes MUST ser tratados de forma neutra ("A definir"),
  sem impedir a exibição do restante do site.

**Páginas e navegação**

- **FR-008**: O site MUST ter as páginas: Início, Tabela/Jogos, Classificação, Times (lista e
  página individual), Fase Final, Regulamento/Sobre e Avisos, acessíveis por um menu de
  navegação presente em todas as páginas, com indicação da página atual.
- **FR-009**: O Início MUST mostrar: identidade da Copa (logo/troféu e nome), o próximo jogo ou
  jogo em andamento com contagem regressiva (dias, horas, minutos, segundos), os últimos
  resultados, aviso importante (se houver) e atalhos para Tabela e Classificação.
- **FR-010**: O destaque do Início MUST seguir, nesta ordem: (1) jogo com status "Ao vivo";
  (2) se o jogo de horário mais recente já iniciado (ignorando adiados e sem data) não tem
  resultado, ele aparece como "Aguardando resultado"; (3) o primeiro jogo agendado com horário
  posterior ao momento atual em Recife, com contagem regressiva (mostrado abaixo do item 2,
  quando houver); (4) sem jogos futuros: mensagem de espera ou o campeão.
- **FR-011**: A Tabela MUST agrupar os jogos por rodada e, dentro de cada rodada, por data, com
  cada jogo em uma linha de três blocos: horário | grupo | confronto (com placar/status).
- **FR-012**: A Tabela MUST permitir filtrar por grupo e por time, com opção de limpar filtros, e
  o filtro aplicado MUST ser preservado no link da página.
- **FR-013**: Ao filtrar por time, jogos em que o time ainda pode jogar (dependentes de
  resultado) MUST aparecer identificados como "possíveis".
- **FR-014**: A página Times MUST listar os 12 times agrupados por grupo; cada time MUST ter uma
  página própria com link direto, mostrando escudo (ou iniciais), grupo, situação na
  classificação e seus jogos.
- **FR-015**: A Fase Final MUST exibir o chaveamento de 8 times (QF1–QF4, SF1–SF2, F) conforme a
  tabela da US8, sem disputa de 3º lugar. As vagas "Nº do Grupo X" MUST ser preenchidas somente
  quando todos os jogos do grupo estiverem encerrados (e o sorteio registrado, se necessário);
  as vagas "Vencedor do jogo X" quando o jogo X estiver decidido. Vagas sem time mostram a
  referência (ex.: "1º do Grupo A"), jogos sem data mostram "Data a definir" e o campeão é
  destacado quando a final for encerrada.
- **FR-016**: A página Avisos MUST listar os comunicados com data, título e texto, do mais recente
  ao mais antigo; avisos marcados como importantes MUST também aparecer no Início.
- **FR-017**: A página Regulamento/Sobre MUST apresentar formato do torneio, pontuação, critérios
  de desempate e local dos jogos.

**Compartilhamento e SEO**

- **FR-018**: Cada jogo e a tabela MUST ter um botão "Copiar link" que copia, com um clique, um
  link que leva diretamente ao jogo (com destaque) ou à tabela; MUST haver confirmação visual e
  alternativa de cópia manual.
- **FR-019**: Cada página MUST ter título e descrição próprios e metadados de pré-visualização
  (título, descrição e imagem) para quando o link for compartilhado.

**Idioma, horário e visual**

- **FR-020**: Todo o conteúdo MUST estar em português do Brasil; datas no formato DD/MM (com dia
  da semana abreviado na tabela, ex.: "Sáb 24/10") e horários no formato 24h, sempre no fuso de
  Recife (UTC-3), independentemente do fuso do visitante.
- **FR-021**: O visual MUST seguir as cores do logo oficial (sem amarelo), com a paleta:
  azul-marinho #0B1E4F (fundo), azul royal #2E4CCA (faixas de grupo, botões), azul elétrico
  #3B7BFF (brilhos, hover), vermelho #D5362A (faixas de título/rodada/data, horário), vermelho
  escuro #9C2721 (sombras/bordas), branco #FFFFFF (cards, textos sobre vermelho e fundo escuro),
  prata-clara #DFDFE7 (destaques, links, foco — cromado do troféu), cinza-prata #C9CED6
  (detalhes metálicos) e verde-gramado #2E7D32 (rodapé).
- **FR-022**: Fundo em gradiente azul-marinho → azul royal (estádio à noite com refletores),
  faixas diagonais em "pinceladas" vermelhas e brancas nas bordas e textura sutil de gramado no
  rodapé.
- **FR-023**: Títulos MUST usar fonte condensada, caixa alta e itálica com contorno; o corpo do
  texto, fonte sans legível. As fontes MUST estar incluídas no próprio site, com alternativa do
  sistema caso não carreguem.
- **FR-024**: Títulos de rodada MUST aparecer em faixa vermelha com texto branco; títulos
  de data em faixa vermelha com texto branco; cada jogo com horário em bloco vermelho, grupo em
  bloco azul royal e confronto em card branco com texto azul-marinho.
- **FR-025**: Todas as combinações de cor de texto/fundo MUST atingir contraste mínimo WCAG AA
  (ex.: nunca vermelho sobre azul-marinho em texto pequeno).
- **FR-026**: O site MUST ser navegável por teclado, com foco visível, e toda imagem informativa
  MUST ter texto alternativo.
- **FR-027**: O site MUST ser responsivo, funcionando de 360px (celular) a 1920px (desktop)
  sem rolagem horizontal da página.
- **FR-028**: O site MUST funcionar sem login, sem servidor de aplicação e abrindo os arquivos
  diretamente no navegador ou em qualquer hospedagem estática.
- **FR-030**: O Início MAY exibir uma rodada em destaque (ex.: "Última rodada — Fase de grupos"),
  configurada só em `js/dados.js` (`destaque: { titulo, subtitulo, texto, jogos: [ids] }`), no
  estilo da arte oficial — escudos, horário, "Jogo N - Grupo X" e "X" central (ou placar, se
  lançado) —, no lugar do destaque automático de próximo jogo. Sem o bloco, volta o automático.
- **FR-029**: O Início MUST exibir a seção "Patrocinadores" com os logos cadastrados no arquivo de
  dados, na ordem da lista, com o nome como texto alternativo e link opcional (só `http(s)`,
  abrindo em nova aba); sem patrocinadores, a seção não aparece. Incluir, remover ou trocar
  patrocinadores MUST exigir edição apenas do arquivo de dados.

### Key Entities

- **Time**: identificador, nome, grupo, escudo (opcional; na falta, iniciais).
- **Grupo**: letra (A–D), seus 3 times e, opcionalmente, a ordem definida por sorteio para
  desempate (registrada pela organização).
- **Jogo**: identificador único, fase (grupos/mata-mata), rodada, grupo (se fase de grupos),
  data e hora (Recife), data original (se remarcado), participante mandante e visitante (time
  ou referência), placar (com pênaltis, se houver), status, W.O. (lado ausente), observação e
  local (opcionais).
- **Referência de participante**: "vencedor do jogo X", "perdedor do jogo X" ou
  "Nº colocado do grupo Y"; resolvida em um time quando a origem estiver definida.
- **Linha de classificação** (derivada): time, J, V, E, D, GP, GC, SG, Pts, posição.
- **Aviso**: data, título, texto, indicador de importante.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos 12 jogos da fase de grupos aparecem com data, horário, grupo e confronto
  idênticos ao cartaz oficial.
- **SC-002**: Ao lançar o placar de qualquer jogo da rodada 1, os 2 jogos dependentes do grupo
  passam a exibir os nomes reais na próxima abertura da página, sem nenhuma outra edição.
- **SC-003**: A classificação dos 4 grupos confere 100% com o cálculo manual para qualquer
  conjunto de placares de teste.
- **SC-004**: Para qualquer data/hora simulada, o Início mostra o próximo jogo correto e a
  contagem regressiva com erro máximo de 1 segundo em relação ao horário de Recife.
- **SC-005**: Um organizador sem conhecimento técnico lança um placar e um aviso em menos de 5
  minutos, alterando apenas o arquivo de dados.
- **SC-006**: Um torcedor encontra o horário do próximo jogo do seu time em até 2 cliques a
  partir do Início.
- **SC-007**: Auditoria de qualidade desktop (Lighthouse) com nota ≥ 90 em Performance,
  Acessibilidade e SEO em todas as páginas; página inicial com menos de 500 KB.
- **SC-008**: 100% das combinações de cor de texto/fundo atingem contraste WCAG AA, e todas as
  funcionalidades são utilizáveis somente com teclado.
- **SC-009**: O link de um jogo copiado abre a página com aquele jogo visível e destacado em 100%
  dos testes, e a prévia de compartilhamento exibe título, descrição e imagem.

## Assumptions

- **Datas da fase final**: datas, horários e local dos jogos de mata-mata serão cadastrados pela
  organização quando definidos; o formato do chaveamento é fixo (ver US8).
- **Status "Ao vivo"** é marcado manualmente pela organização no arquivo de dados (sem placar em
  tempo real, fora do escopo); o placar parcial pode ser informado opcionalmente.
- **W.O.**: registrado como observação do jogo, com placar convencionado pela organização (ex.:
  3 x 0) informado no próprio arquivo de dados.
- **Local dos jogos** é o mesmo para todos (campo de Camutanga), salvo indicação em aviso ou no
  próprio jogo; o texto exato do local e do regulamento será fornecido pela organização.
- **Escudos**: a organização fornecerá os escudos que tiver; os demais usam iniciais.
- **Patrocinadores (2026-11-23)**: os 20 logos atuais foram recortados dos painéis de divulgação
  enviados pela organização (JPEG do WhatsApp); por isso têm baixa resolução e um pedaço da foto
  ao fundo. Devem ser trocados por arquivos individuais (PNG com fundo transparente ou WebP)
  quando a organização os tiver. O logo do Ver. Tonho da Venda tem parte coberta pela marca
  "@breninhoo.10" presente na arte original.
- **Ano**: todas as datas são de 2026.
- **Últimos resultados** no Início: até 4 jogos encerrados mais recentes.
- **Ordenação inicial da classificação** sem jogos: alfabética.
- **Imagem de pré-visualização** e domínio de publicação serão definidos na implantação; a
  pré-visualização completa depende de o site estar publicado em endereço público.
- **Fora do escopo (v1)**: placar ao vivo em tempo real, painel administrativo com login,
  apostas, venda de ingressos, comentários, aplicativo.
