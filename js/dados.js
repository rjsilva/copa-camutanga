/* ==========================================================================
   DADOS DA COPA CAMUTANGA OPEN DE FUTEBOL
   ÚNICO ARQUIVO QUE VOCÊ PRECISA EDITAR. Não mexa em nenhum outro arquivo.
   --------------------------------------------------------------------------

   COMO LANÇAR UM RESULTADO
     1. Ache o jogo pelo id (ex.: id: "A1").
     2. Troque   placar: null,          por   placar: { mandante: 2, visitante: 1 },
     3. Troque   status: "agendado",    por   status: "encerrado",
     4. Salve o arquivo, abra o index.html para conferir e publique.
     "mandante" é o time escrito primeiro no jogo; "visitante" é o segundo.

   EMPATE NA 1ª RODADA OU NO MATA-MATA (decidido nos pênaltis)
     placar: { mandante: 1, visitante: 1, penaltis: { mandante: 4, visitante: 3 } },

   JOGO EM ANDAMENTO (opcional, placar parcial)
     placar: { mandante: 1, visitante: 0 },  status: "ao-vivo",

   JOGO ADIADO, AINDA SEM NOVA DATA
     status: "adiado",

   JOGO REMARCADO (nova data definida)
     Copie a data antiga para dataOriginal, coloque a nova em data e volte o status:
     data: "2026-11-29T14:00:00-03:00", dataOriginal: "2026-11-22T14:00:00-03:00", status: "agendado",

   W.O. (um time não compareceu)
     wo: "visitante",   ← lado que NÃO compareceu ("mandante" ou "visitante")
     placar: { mandante: 3, visitante: 0 },  status: "encerrado",   ← placar definido pela organização

   DATAS DO MATA-MATA
     Troque   data: null,   por   data: "2026-11-29T14:00:00-03:00",
     (os times das quartas, semifinais e final aparecem sozinhos).

   DESEMPATE POR SORTEIO (classificação)
     No time sorteado em 1º lugar acrescente  sorteio: 1,  no 2º  sorteio: 2,  e assim por diante.

   AVISOS
     Copie um aviso da lista "avisos" lá embaixo e altere data, titulo e texto.
     importante: true  → o aviso também aparece em destaque na página inicial.

   PATROCINADORES (aparecem na página inicial, separados por categoria e na ordem da lista)
     1. Salve o logo na pasta img/patrocinadores/ (de preferência .webp, .png ou .jpg pequeno).
     2. Acrescente uma linha na lista "patrocinadores" lá embaixo:
        { id: "nome-curto", categoria: "apoio", nome: "Nome do Patrocinador", logo: "img/patrocinadores/arquivo.webp" },
     categoria: "organizacao" (Organização e idealização), "oficial" (Patrocinadores oficiais,
     em destaque), "apoio" (Apoios) ou "parceiro" (Parceiros). Sem categoria, entra em Apoios.
     3. Link (opcional): acrescente  link: "https://instagram.com/perfil"  (sempre com https://).
     Para tirar um patrocinador, apague a linha dele.

   DESTAQUE DA PÁGINA INICIAL (opcional)
     Mostra uma rodada em destaque no topo do Início, no estilo da arte oficial,
     no lugar do "Próximo jogo / Aguardando resultado" automático.
       destaque: {
         titulo: "Última rodada",
         subtitulo: "Fase de grupos",
         texto: "Neste domingo 22/11 · Camutanga - PE",
         jogos: ["C3", "D3"]          ← ids dos jogos, na ordem em que aparecem
       },
     Para voltar ao destaque automático, apague o bloco ou deixe  destaque: null,

   ESCUDOS DOS TIMES (opcional)
     Salve a imagem em img/escudos/ e acrescente no time:  escudo: "img/escudos/arquivo.webp"
     Sem escudo, o site mostra um selo redondo com a sigla.

   VALORES PERMITIDOS
     status: "agendado", "ao-vivo", "encerrado", "adiado"
     cor dos times: "azul-marinho", "azul-royal", "vermelho", "vermelho-escuro", "gramado"
     Horários sempre no formato "2026-10-24T14:00:00-03:00" (horário de Recife).

   CUIDADOS: mantenha as aspas "", as vírgulas no fim de cada linha e as chaves { }.
   Se algo der errado, abra o site pelo computador: uma faixa branca com borda vermelha avisa o problema.
   ========================================================================== */

window.COPA = {
  destaque: {
    titulo: "Última rodada",
    subtitulo: "Fase de grupos",
    texto: "Neste domingo 22/11 · Camutanga - PE",
    jogos: ["C3", "D3"]
  },

  times: [
    // ---------- Grupo A
    { id: "tropa-do-sheik",      nome: "Tropa do Sheik",      grupo: "A", sigla: "TDS", cor: "azul-royal", escudo: "img/escudos/tropa-do-sheik.webp" },
    { id: "gremio-de-itambe",    nome: "Grêmio de Itambé",    grupo: "A", sigla: "GIT", cor: "azul-marinho", escudo: "img/escudos/gremio-de-itambe.webp" },
    { id: "selecao-de-timbauba", nome: "Timbaúba Futebol Clube", grupo: "A", sigla: "TFC", cor: "vermelho", escudo: "img/escudos/selecao-de-timbauba.webp" },
    // ---------- Grupo B
    { id: "gremio-da-preguica",   nome: "Grêmio Sete Cabeças",  grupo: "B", sigla: "GSC", cor: "azul-marinho", escudo: "img/escudos/gremio-sete-cabecas.webp" },
    { id: "arara",                nome: "Arara Futebol Clube",  grupo: "B", sigla: "ARA", cor: "gramado", escudo: "img/escudos/arara.webp" },
    { id: "selecao-de-ferreiros", nome: "Seleção Ferreirense",  grupo: "B", sigla: "SFE", cor: "vermelho-escuro", escudo: "img/escudos/selecao-de-ferreiros.webp" },
    // ---------- Grupo C
    { id: "santa-cruz",        nome: "Santa Cruz",        grupo: "C", sigla: "STC", cor: "vermelho", escudo: "img/escudos/santa-cruz.webp" },
    { id: "sport-da-toca",     nome: "Sport da Toca",     grupo: "C", sigla: "SDT", cor: "vermelho-escuro", escudo: "img/escudos/sport-da-toca.webp" },
    { id: "rua-sao-sebastiao", nome: "Rua São Sebastião", grupo: "C", sigla: "RSS", cor: "azul-royal", escudo: "img/escudos/rua-sao-sebastiao.webp" },
    // ---------- Grupo D
    { id: "cbfc",     nome: "CB Futebol Clube", grupo: "D", sigla: "CBF", cor: "azul-marinho", escudo: "img/escudos/cbfc.webp" },
    { id: "rua-nova", nome: "Rua Nova", grupo: "D", sigla: "RNO", cor: "gramado", escudo: "img/escudos/rua-nova.webp" },
    { id: "songa",    nome: "Songa FC", grupo: "D", sigla: "SON", cor: "azul-royal", escudo: "img/escudos/songa.webp" }
  ],

  jogos: [
    // ===================== PRIMEIRA RODADA =====================
    { id: "A1", fase: "grupos", grupo: "A", rodada: 1, data: "2026-10-24T14:00:00-03:00", ordemNoDia: 1,
      mandante: "tropa-do-sheik", visitante: "gremio-de-itambe",
      placar: null, status: "agendado", observacao: "Jogo de abertura" },
    { id: "B1", fase: "grupos", grupo: "B", rodada: 1, data: "2026-10-24T16:00:00-03:00", ordemNoDia: 2,
      mandante: "gremio-da-preguica", visitante: "arara",
      placar: null, status: "agendado" },
    { id: "C1", fase: "grupos", grupo: "C", rodada: 1, data: "2026-10-25T14:00:00-03:00", ordemNoDia: 1,
      mandante: "santa-cruz", visitante: "sport-da-toca",
      placar: null, status: "agendado" },
    { id: "D1", fase: "grupos", grupo: "D", rodada: 1, data: "2026-10-25T16:00:00-03:00", ordemNoDia: 2,
      mandante: "cbfc", visitante: "rua-nova",
      placar: null, status: "agendado" },

    // ===================== SEGUNDA RODADA (perdedor da 1ª rodada x 3º time) =====================
    { id: "B2", fase: "grupos", grupo: "B", rodada: 2, data: "2026-11-01T14:00:00-03:00", ordemNoDia: 1,
      mandante: { perdedorDe: "B1" }, visitante: "selecao-de-ferreiros",
      placar: null, status: "agendado" },
    { id: "A2", fase: "grupos", grupo: "A", rodada: 2, data: "2026-11-01T16:00:00-03:00", ordemNoDia: 2,
      mandante: { perdedorDe: "A1" }, visitante: "selecao-de-timbauba",
      placar: null, status: "agendado" },
    { id: "D2", fase: "grupos", grupo: "D", rodada: 2, data: "2026-11-08T14:00:00-03:00", ordemNoDia: 1,
      mandante: { perdedorDe: "D1" }, visitante: "songa",
      placar: null, status: "agendado" },
    { id: "C2", fase: "grupos", grupo: "C", rodada: 2, data: "2026-11-08T16:00:00-03:00", ordemNoDia: 2,
      mandante: { perdedorDe: "C1" }, visitante: "rua-sao-sebastiao",
      placar: null, status: "agendado" },

    // ===================== TERCEIRA RODADA (vencedor da 1ª rodada x 3º time) =====================
    { id: "A3", fase: "grupos", grupo: "A", rodada: 3, data: "2026-11-15T14:00:00-03:00", ordemNoDia: 1,
      mandante: { vencedorDe: "A1" }, visitante: "selecao-de-timbauba",
      placar: null, status: "agendado" },
    { id: "B3", fase: "grupos", grupo: "B", rodada: 3, data: "2026-11-15T16:00:00-03:00", ordemNoDia: 2,
      mandante: { vencedorDe: "B1" }, visitante: "selecao-de-ferreiros",
      placar: null, status: "agendado" },
    { id: "C3", fase: "grupos", grupo: "C", rodada: 3, data: "2026-11-22T14:00:00-03:00", ordemNoDia: 1,
      mandante: "sport-da-toca", visitante: "rua-sao-sebastiao",   // vencedor do C1 (arte oficial)
      placar: { mandante: 0, visitante: 3 }, status: "encerrado", observacao: "Última rodada da fase de grupos" },
    { id: "D3", fase: "grupos", grupo: "D", rodada: 3, data: "2026-11-22T16:00:00-03:00", ordemNoDia: 2,
      mandante: "rua-nova", visitante: "songa",   // vencedor do D1 (arte oficial)
      placar: { mandante: 1, visitante: 1 }, status: "encerrado", observacao: "Última rodada da fase de grupos" },

    // ===================== QUARTAS DE FINAL (datas a definir) =====================
    { id: "QF1", fase: "quartas", data: null,
      mandante: { colocado: 1, grupo: "A" }, visitante: { colocado: 2, grupo: "B" },
      placar: null, status: "agendado" },
    { id: "QF2", fase: "quartas", data: null,
      mandante: { colocado: 1, grupo: "B" }, visitante: { colocado: 2, grupo: "A" },
      placar: null, status: "agendado" },
    { id: "QF3", fase: "quartas", data: null,
      mandante: { colocado: 1, grupo: "C" }, visitante: { colocado: 2, grupo: "D" },
      placar: null, status: "agendado" },
    { id: "QF4", fase: "quartas", data: null,
      mandante: { colocado: 1, grupo: "D" }, visitante: { colocado: 2, grupo: "C" },
      placar: null, status: "agendado" },

    // ===================== SEMIFINAIS =====================
    { id: "SF1", fase: "semifinal", data: null,
      mandante: { vencedorDe: "QF1" }, visitante: { vencedorDe: "QF3" },
      placar: null, status: "agendado" },
    { id: "SF2", fase: "semifinal", data: null,
      mandante: { vencedorDe: "QF2" }, visitante: { vencedorDe: "QF4" },
      placar: null, status: "agendado" },

    // ===================== FINAL =====================
    { id: "F", fase: "final", data: null,
      mandante: { vencedorDe: "SF1" }, visitante: { vencedorDe: "SF2" },
      placar: null, status: "agendado" }
  ],

  avisos: [
    { data: "2026-10-20", titulo: "Abertura da Copa",
      texto: "A Copa Camutanga Open de Futebol começa no sábado, 24/10, às 14h, com Tropa do Sheik x Grêmio de Itambé. Chegue cedo!",
      importante: false }
  ],

  patrocinadores: [
    // ---------- Organização e idealização (aparece primeiro)
    { id: "vereador-lulinha",        categoria: "organizacao", nome: "Vereador Lulinha", logo: "img/patrocinadores/vereador-lulinha.webp" },
    { id: "manguinho-da-rua-nova",   categoria: "organizacao", nome: "Manguinho da Rua Nova", logo: "img/patrocinadores/manguinho-da-rua-nova.webp" },
    // ---------- Patrocinadores oficiais (em destaque)
    { id: "matuto-do-iphone",        categoria: "oficial", nome: "Matuto do iPhone", logo: "img/patrocinadores/matuto-do-iphone.webp" },
    { id: "ricardo-godoy",           categoria: "oficial", nome: "Ricardo Godoy – O Filho de Camutanga", logo: "img/patrocinadores/ricardo-godoy.webp" },
    { id: "gilmar-pereira",          categoria: "oficial", nome: "Gilmar Pereira", logo: "img/patrocinadores/gilmar-pereira.webp" },
    { id: "prefeitura-de-camutanga", categoria: "oficial", nome: "Prefeitura de Camutanga", logo: "img/patrocinadores/prefeitura-de-camutanga.webp" },
    { id: "click-com",               categoria: "oficial", nome: "Click.com Telecomunicações", logo: "img/patrocinadores/click-com.webp" },
    { id: "comercial-nogueira",      categoria: "oficial", nome: "Comercial Nogueira", logo: "img/patrocinadores/comercial-nogueira.webp" },
    { id: "talita-fonseca",          categoria: "oficial", nome: "Prefeita Talita Fonseca", logo: "img/patrocinadores/talita-fonseca.webp" },
    { id: "edvan-alves",             categoria: "oficial", nome: "Edvan Alves", logo: "img/patrocinadores/edvan-alves.webp" },
    // ---------- Apoios
    { id: "dra-leandra-iris",        categoria: "apoio", nome: "Dra. Leandra Iris – Fisioterapia e Pilates", logo: "img/patrocinadores/dra-leandra-iris.webp" },
    { id: "cleidson-camutanga",      categoria: "apoio", nome: "Cleidson Camutanga", logo: "img/patrocinadores/cleidson-camutanga.webp" },
    { id: "mercadinho-central",      categoria: "apoio", nome: "Mercadinho Central", logo: "img/patrocinadores/mercadinho-central.webp" },
    { id: "karlos-marone",           categoria: "apoio", nome: "Vereador Karlos Marone", logo: "img/patrocinadores/karlos-marone.webp" },
    { id: "fernando-de-vunda",       categoria: "apoio", nome: "Vereador Fernando de Vunda", logo: "img/patrocinadores/fernando-de-vunda.webp" },
    { id: "mazinho-pereira",         categoria: "apoio", nome: "Vereador Mazinho Pereira", logo: "img/patrocinadores/mazinho-pereira.webp" },
    { id: "tonho-da-venda",          categoria: "apoio", nome: "Vereador Tonho da Venda", logo: "img/patrocinadores/tonho-da-venda.webp" },
    { id: "enio-xavier",             categoria: "apoio", nome: "Amigo Enio Xavier", logo: "img/patrocinadores/enio-xavier.webp" },
    { id: "irma-lucia",              categoria: "apoio", nome: "Vereadora Irmã Lúcia", logo: "img/patrocinadores/irma-lucia.webp" },
    // ---------- Parceiros
    { id: "theuzinho98",             categoria: "parceiro", nome: "Theuzinho98", logo: "img/patrocinadores/theuzinho98.webp" },
    { id: "camu-polemica",           categoria: "parceiro", nome: "Camu Polêmica", logo: "img/patrocinadores/camu-polemica.webp" },
    { id: "o-minuto-do-jair",        categoria: "parceiro", nome: "O Minuto do Jair", logo: "img/patrocinadores/o-minuto-do-jair.webp" }
  ]
};
