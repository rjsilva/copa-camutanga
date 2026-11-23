/* Copa Camutanga — testes.js
   Mini-executor de testes (sem framework) + dados de teste próprios.
   Roda em testes.html (navegador) e também no Node, para conferência rápida. */
(function () {
  "use strict";

  var L = window.Logica;
  var resultados = [];

  // ---------------------------------------------------------------- executor
  function normalizar(v) {
    if (Array.isArray(v)) return v.map(normalizar);
    if (v && typeof v === "object") {
      var o = {};
      Object.keys(v).sort().forEach(function (k) { if (v[k] !== undefined) o[k] = normalizar(v[k]); });
      return o;
    }
    return v;
  }
  function texto(v) { return JSON.stringify(normalizar(v)); }

  function igual(obtido, esperado, msg) {
    if (texto(obtido) !== texto(esperado)) {
      throw new Error((msg ? msg + " — " : "") + "esperado " + texto(esperado) + ", obtido " + texto(obtido));
    }
  }
  function verdadeiro(cond, msg) {
    if (!cond) throw new Error(msg || "condição falsa");
  }
  function teste(nome, fn) {
    try { fn(); resultados.push({ nome: nome, ok: true }); }
    catch (e) { resultados.push({ nome: nome, ok: false, erro: e && e.message ? e.message : String(e) }); }
  }

  // ---------------------------------------------------------------- dados de teste
  // Grupo A: a1 Alfa, a2 Bravo, a3 Charlie · Grupo B: b1 Delta, b2 Eco, b3 Fox
  function copaBase() {
    return {
      times: [
        { id: "a1", nome: "Alfa", grupo: "A", sigla: "ALF", cor: "azul-royal" },
        { id: "a2", nome: "Bravo", grupo: "A", sigla: "BRA", cor: "vermelho" },
        { id: "a3", nome: "Charlie", grupo: "A", sigla: "CHA", cor: "gramado" },
        { id: "b1", nome: "Delta", grupo: "B", sigla: "DEL", cor: "azul-marinho" },
        { id: "b2", nome: "Eco", grupo: "B", sigla: "ECO", cor: "vermelho-escuro" },
        { id: "b3", nome: "Fox", grupo: "B", sigla: "FOX", cor: "azul-royal" }
      ],
      jogos: [
        { id: "A1", fase: "grupos", grupo: "A", rodada: 1, data: "2026-10-24T14:00:00-03:00", ordemNoDia: 1, mandante: "a1", visitante: "a2", placar: null, status: "agendado" },
        { id: "B1", fase: "grupos", grupo: "B", rodada: 1, data: "2026-10-24T16:00:00-03:00", ordemNoDia: 2, mandante: "b1", visitante: "b2", placar: null, status: "agendado" },
        { id: "B2", fase: "grupos", grupo: "B", rodada: 2, data: "2026-11-01T14:00:00-03:00", ordemNoDia: 1, mandante: { perdedorDe: "B1" }, visitante: "b3", placar: null, status: "agendado" },
        { id: "A2", fase: "grupos", grupo: "A", rodada: 2, data: "2026-11-01T16:00:00-03:00", ordemNoDia: 2, mandante: { perdedorDe: "A1" }, visitante: "a3", placar: null, status: "agendado" },
        { id: "A3", fase: "grupos", grupo: "A", rodada: 3, data: "2026-11-15T14:00:00-03:00", ordemNoDia: 1, mandante: { vencedorDe: "A1" }, visitante: "a3", placar: null, status: "agendado" },
        { id: "B3", fase: "grupos", grupo: "B", rodada: 3, data: "2026-11-15T16:00:00-03:00", ordemNoDia: 2, mandante: { vencedorDe: "B1" }, visitante: "b3", placar: null, status: "agendado" },
        { id: "QF1", fase: "quartas", data: null, mandante: { colocado: 1, grupo: "A" }, visitante: { colocado: 2, grupo: "B" }, placar: null, status: "agendado" },
        { id: "QF2", fase: "quartas", data: null, mandante: { colocado: 1, grupo: "B" }, visitante: { colocado: 2, grupo: "A" }, placar: null, status: "agendado" },
        { id: "F", fase: "final", data: null, mandante: { vencedorDe: "QF1" }, visitante: { vencedorDe: "QF2" }, placar: null, status: "agendado" }
      ],
      avisos: []
    };
  }
  function jogo(copa, id) {
    return copa.jogos.filter(function (j) { return j.id === id; })[0];
  }
  function lancar(copa, id, m, v, pen) {
    var j = jogo(copa, id);
    j.placar = { mandante: m, visitante: v };
    if (pen) j.placar.penaltis = { mandante: pen[0], visitante: pen[1] };
    j.status = "encerrado";
    return copa;
  }
  function resolvido(copa, id) {
    return L.resolverTimes(copa).filter(function (j) { return j.id === id; })[0];
  }
  function idDe(r) { return r && r.tipo === "time" ? r.time.id : null; }
  function ordem(linhas) { return linhas.map(function (l) { return l.timeId; }); }
  function agora(iso) { return new Date(iso); }
  // Grupo B completo: b1 vence b2; b2 vence b3; b1 vence b3 → b1, b2, b3
  function completarB(copa) {
    lancar(copa, "B1", 2, 0); lancar(copa, "B2", 1, 0); lancar(copa, "B3", 3, 0);
    return copa;
  }
  // Grupo A completo, ordem a3, a1, a2 (ver teste de classificação)
  function completarA(copa) {
    lancar(copa, "A1", 2, 1); lancar(copa, "A2", 1, 1); lancar(copa, "A3", 0, 2);
    return copa;
  }

  // ================================================================ Formatação (T010)
  teste("formatarData em Recife", function () {
    igual(L.formatarData("2026-10-24T14:00:00-03:00"), "24/10");
    igual(L.formatarData("2026-10-24T23:30:00-03:00"), "24/10", "23:30 em Recife ainda é dia 24");
    igual(L.formatarData(null), "");
    igual(L.formatarData("lixo"), "");
  });
  teste("formatarDiaSemana abreviado e capitalizado", function () {
    igual(L.formatarDiaSemana("2026-10-24T14:00:00-03:00"), "Sáb");
    igual(L.formatarDiaSemana("2026-10-25T16:00:00-03:00"), "Dom");
  });
  teste("formatarDiaSemanaExtenso", function () {
    igual(L.formatarDiaSemanaExtenso("2026-10-24T14:00:00-03:00"), "Sábado");
    igual(L.formatarDiaSemanaExtenso("2026-10-25T14:00:00-03:00"), "Domingo");
  });
  teste("formatarHora 24h em Recife, independente do fuso do computador", function () {
    igual(L.formatarHora("2026-10-24T14:00:00-03:00"), "14:00");
    igual(L.formatarHora("2026-10-24T17:00:00Z"), "14:00");
    igual(L.formatarHora("2026-10-24T23:30:00-03:00"), "23:30");
  });
  teste("formatarDataAviso sem conversão de fuso", function () {
    igual(L.formatarDataAviso("2026-10-20"), "20/10");
    igual(L.formatarDataAviso("20/10/2026"), "");
  });
  teste("iniciais", function () {
    igual(L.iniciais("Grêmio de Itambé"), "GI");
    igual(L.iniciais("Rua São Sebastião"), "RSS");
    igual(L.iniciais("Songa"), "SON");
  });
  teste("corDoSelo aceita só nomes da paleta", function () {
    igual(L.corDoSelo("vermelho"), "vermelho");
    igual(L.corDoSelo("gramado"), "gramado");
    igual(L.corDoSelo("#123456"), "azul-royal");
    igual(L.corDoSelo(undefined), "azul-royal");
  });

  // ================================================================ US1 (T012)
  teste("rotuloParticipante", function () {
    igual(L.rotuloParticipante({ vencedorDe: "A1" }), "Vencedor A1");
    igual(L.rotuloParticipante({ perdedorDe: "A1" }), "Perdedor A1");
    igual(L.rotuloParticipante({ colocado: 1, grupo: "A" }), "1º do Grupo A");
    igual(L.rotuloParticipante(42), "A definir");
  });
  teste("statusExibido", function () {
    var antes = agora("2026-10-24T10:00:00-03:00");
    var depois = agora("2026-10-24T14:30:00-03:00");
    var j = { data: "2026-10-24T14:00:00-03:00", status: "agendado", placar: null };
    igual(L.statusExibido(j, antes), "agendado");
    igual(L.statusExibido(j, depois), "aguardando-resultado");
    igual(L.statusExibido({ data: null, status: "agendado" }, antes), "data-a-definir");
    igual(L.statusExibido({ data: j.data, status: "ao-vivo" }, depois), "ao-vivo");
    igual(L.statusExibido({ data: j.data, status: "encerrado", placar: { mandante: 1, visitante: 0 } }, depois), "encerrado");
    igual(L.statusExibido({ data: j.data, status: "encerrado", placar: null }, depois), "aguardando-resultado");
    igual(L.statusExibido({ data: j.data, status: "adiado" }, antes), "adiado");
  });
  teste("formatarPlacar", function () {
    igual(L.formatarPlacar({ placar: { mandante: 2, visitante: 1 } }), "2 x 1");
    igual(L.formatarPlacar({ placar: { mandante: 1, visitante: 1, penaltis: { mandante: 4, visitante: 3 } } }), "1 x 1 (pên. 4 x 3)");
    igual(L.formatarPlacar({ placar: { mandante: 3, visitante: 0 }, wo: "visitante" }), "3 x 0 (W.O.)");
    igual(L.formatarPlacar({ placar: null }), "");
  });
  teste("agruparPorRodadaEData: rodadas, datas e fases em ordem", function () {
    var grupos = L.agruparPorRodadaEData(L.resolverTimes(copaBase()));
    igual(grupos.map(function (g) { return g.titulo; }), ["Primeira Rodada", "Segunda Rodada", "Terceira Rodada", "Quartas de Final", "Final"]);
    igual(grupos[0].datas.length, 1);
    igual(grupos[0].datas[0].itens.map(function (i) { return i.jogo.id; }), ["A1", "B1"]);
    igual(grupos[1].datas[0].itens.map(function (i) { return i.jogo.id; }), ["B2", "A2"]);
    igual(grupos[3].datas[0].iso, null);
  });
  teste("resolverTimes: time definido e id inexistente", function () {
    var c = copaBase();
    jogo(c, "A1").visitante = "inexistente";
    var a1 = resolvido(c, "A1");
    igual(idDe(a1.mandanteR), "a1");
    igual(a1.visitanteR.tipo, "pendente");
    igual(a1.visitanteR.rotulo, "A definir");
  });

  // ================================================================ US2 (T018)
  teste("vencedorEPerdedor", function () {
    igual(L.vencedorEPerdedor({ status: "encerrado", placar: { mandante: 2, visitante: 1 } }), { vencedor: "mandante", perdedor: "visitante", penaltis: false });
    igual(L.vencedorEPerdedor({ status: "encerrado", placar: { mandante: 0, visitante: 3 } }), { vencedor: "visitante", perdedor: "mandante", penaltis: false });
    igual(L.vencedorEPerdedor({ status: "encerrado", placar: { mandante: 1, visitante: 1, penaltis: { mandante: 4, visitante: 3 } } }), { vencedor: "mandante", perdedor: "visitante", penaltis: true });
    igual(L.vencedorEPerdedor({ status: "encerrado", placar: { mandante: 1, visitante: 1 } }), null);
    igual(L.vencedorEPerdedor({ status: "agendado", placar: { mandante: 2, visitante: 1 } }), null);
    igual(L.vencedorEPerdedor({ status: "encerrado", placar: null }), null);
  });
  teste("A1 2 x 1 → A2 com o perdedor e A3 com o vencedor", function () {
    var c = lancar(copaBase(), "A1", 2, 1);
    igual(idDe(resolvido(c, "A2").mandanteR), "a2");
    igual(idDe(resolvido(c, "A3").mandanteR), "a1");
    igual(resolvido(c, "A1").vencedorId, "a1");
    igual(resolvido(c, "A1").perdedorId, "a2");
  });
  teste("A1 1 x 1 com pênaltis 4 x 3 decide vencedor", function () {
    var c = lancar(copaBase(), "A1", 1, 1, [4, 3]);
    igual(idDe(resolvido(c, "A3").mandanteR), "a1");
    igual(idDe(resolvido(c, "A2").mandanteR), "a2");
    igual(resolvido(c, "A1").decididoNosPenaltis, true);
  });
  teste("A1 empatado sem pênaltis mantém referências pendentes", function () {
    var c = lancar(copaBase(), "A1", 1, 1);
    var a2 = resolvido(c, "A2");
    igual(a2.mandanteR.tipo, "pendente");
    igual(a2.mandanteR.rotulo, "Perdedor A1");
    igual(resolvido(c, "A3").mandanteR.rotulo, "Vencedor A1");
  });
  teste("resultado corrigido inverte os nomes", function () {
    var c = lancar(copaBase(), "A1", 0, 1);
    igual(idDe(resolvido(c, "A3").mandanteR), "a2");
    igual(idDe(resolvido(c, "A2").mandanteR), "a1");
  });
  teste("referência a jogo inexistente vira 'A definir' sem exceção", function () {
    var c = copaBase();
    jogo(c, "A3").mandante = { vencedorDe: "Z9" };
    var a3 = resolvido(c, "A3");
    igual(a3.mandanteR.tipo, "pendente");
    igual(a3.mandanteR.rotulo, "A definir");
  });
  teste("ciclo de referências não trava", function () {
    var c = copaBase();
    c.jogos.push({ id: "X", fase: "final", data: null, mandante: { vencedorDe: "Y" }, visitante: "a1", placar: null, status: "agendado" });
    c.jogos.push({ id: "Y", fase: "final", data: null, mandante: { vencedorDe: "X" }, visitante: "a2", placar: null, status: "agendado" });
    var x = resolvido(c, "X");
    igual(x.mandanteR.tipo, "pendente");
  });
  teste("resolverTimes não muta a entrada", function () {
    var c = lancar(copaBase(), "A1", 2, 1);
    var antes = JSON.stringify(c);
    L.resolverTimes(c);
    L.calcularClassificacao(c, "A");
    igual(JSON.stringify(c), antes);
  });
  teste("timesPossiveis de referência aberta", function () {
    igual(L.timesPossiveis({ vencedorDe: "A1" }, copaBase()).sort(), ["a1", "a2"]);
    igual(L.timesPossiveis({ vencedorDe: "A1" }, lancar(copaBase(), "A1", 2, 1)), ["a1"]);
  });

  // ================================================================ US3 (T023)
  teste("classificação sem jogos: zeros, alfabética, sem sorteio", function () {
    var l = L.calcularClassificacao(copaBase(), "A");
    igual(ordem(l), ["a1", "a2", "a3"]);
    verdadeiro(l.every(function (x) { return x.pts === 0 && x.j === 0 && !x.aguardandoSorteio; }), "todos zerados");
  });
  teste("classificação: pontos e estatísticas", function () {
    var l = L.calcularClassificacao(completarA(copaBase()), "A");
    igual(ordem(l), ["a3", "a1", "a2"]);
    igual(l[1], { timeId: "a1", nome: "Alfa", j: 2, v: 1, e: 0, d: 1, gp: 2, gc: 3, sg: -1, pts: 3, posicao: 2, aguardandoSorteio: false });
    igual([l[0].pts, l[0].v, l[0].e, l[0].sg], [4, 1, 1, 2]);
    igual([l[2].pts, l[2].e, l[2].d], [1, 1, 1]);
  });
  teste("desempate por saldo e depois gols marcados", function () {
    var c = copaBase();
    lancar(c, "A1", 0, 1); // a2 vence; perdedor a1
    lancar(c, "A2", 2, 0); // a1 x a3
    lancar(c, "A3", 0, 3); // a2 x a3
    igual(ordem(L.calcularClassificacao(c, "A")), ["a3", "a1", "a2"]);
  });
  teste("confronto direto entre exatamente 2 empatados", function () {
    var c = copaBase();
    lancar(c, "A1", 0, 1); // a2 vence a1
    lancar(c, "A2", 2, 1); // a1 x a3
    lancar(c, "A3", 1, 2); // a2 x a3
    igual(ordem(L.calcularClassificacao(c, "A")), ["a3", "a2", "a1"]);
  });
  teste("empate triplo aguarda sorteio; sorteio registrado define a ordem", function () {
    var c = copaBase();
    lancar(c, "A1", 1, 0); lancar(c, "A2", 1, 0); lancar(c, "A3", 0, 1);
    var l = L.calcularClassificacao(c, "A");
    igual(ordem(l), ["a1", "a2", "a3"]);
    verdadeiro(l.every(function (x) { return x.aguardandoSorteio; }), "todos aguardando sorteio");
    c.times[2].sorteio = 1; c.times[0].sorteio = 2; c.times[1].sorteio = 3;
    l = L.calcularClassificacao(c, "A");
    igual(ordem(l), ["a3", "a1", "a2"]);
    verdadeiro(l.every(function (x) { return !x.aguardandoSorteio; }), "sem marca após sorteio");
  });
  teste("confronto direto empatado vai ao sorteio; pênaltis não contam gols", function () {
    var c = copaBase();
    lancar(c, "A1", 1, 1, [4, 3]); lancar(c, "A2", 2, 0); lancar(c, "A3", 2, 0);
    var l = L.calcularClassificacao(c, "A");
    igual(ordem(l), ["a1", "a2", "a3"]);
    igual([l[0].pts, l[0].gp, l[0].gc, l[0].e], [4, 3, 1, 1]);
    igual(l.map(function (x) { return x.aguardandoSorteio; }), [true, true, false]);
  });
  teste("jogos não encerrados são ignorados", function () {
    var c = copaBase();
    var a1 = jogo(c, "A1");
    a1.placar = { mandante: 3, visitante: 0 }; a1.status = "ao-vivo";
    jogo(c, "A2").status = "adiado";
    verdadeiro(L.calcularClassificacao(c, "A").every(function (x) { return x.j === 0; }));
  });
  teste("W.O. usa o placar convencionado", function () {
    var c = lancar(copaBase(), "A1", 3, 0);
    jogo(c, "A1").wo = "visitante";
    var l = L.calcularClassificacao(c, "A");
    igual([l[0].timeId, l[0].pts, l[0].gp], ["a1", 3, 3]);
  });
  teste("grupoCompleto e colocado", function () {
    var c = copaBase();
    igual(L.grupoCompleto(c, "A"), false);
    igual(L.colocado(c, "A", 1), null);
    completarA(c);
    igual(L.grupoCompleto(c, "A"), true);
    igual(L.colocado(c, "A", 1).id, "a3");
    igual(L.colocado(c, "A", 2).id, "a1");
    var t = copaBase();
    lancar(t, "A1", 1, 0); lancar(t, "A2", 1, 0); lancar(t, "A3", 0, 1);
    igual(L.colocado(t, "A", 1), null, "aguardando sorteio");
  });

  // ================================================================ US4 (T029)
  teste("proximoJogo antes do primeiro jogo", function () {
    var r = L.proximoJogo(L.resolverTimes(copaBase()), agora("2026-10-24T10:00:00-03:00"));
    igual([r.modo, r.jogo.id], ["proximo", "A1"]);
  });
  teste("proximoJogo: horário passou sem resultado → aguardando, com o seguinte", function () {
    var r = L.proximoJogo(L.resolverTimes(copaBase()), agora("2026-10-24T14:30:00-03:00"));
    igual([r.modo, r.jogo.id, r.seguinte.id], ["aguardando-resultado", "A1", "B1"]);
  });
  teste("proximoJogo: A1 encerrado → próximo B1", function () {
    var r = L.proximoJogo(L.resolverTimes(lancar(copaBase(), "A1", 1, 0)), agora("2026-10-24T14:30:00-03:00"));
    igual([r.modo, r.jogo.id], ["proximo", "B1"]);
  });
  teste("proximoJogo: ao vivo tem prioridade", function () {
    var c = copaBase();
    jogo(c, "B1").status = "ao-vivo";
    var r = L.proximoJogo(L.resolverTimes(c), agora("2026-10-24T14:30:00-03:00"));
    igual([r.modo, r.jogo.id], ["ao-vivo", "B1"]);
  });
  teste("proximoJogo ignora adiados", function () {
    var c = copaBase();
    jogo(c, "A1").status = "adiado";
    var r = L.proximoJogo(L.resolverTimes(c), agora("2026-10-24T10:00:00-03:00"));
    igual(r.jogo.id, "B1");
  });
  teste("proximoJogo: tudo encerrado → nenhum; final decidida → campeão", function () {
    var c = completarB(completarA(copaBase()));
    var r = L.proximoJogo(L.resolverTimes(c), agora("2026-12-01T10:00:00-03:00"));
    igual([r.modo, r.campeao, r.mataMataIniciado], ["nenhum", null, false]);
    lancar(c, "QF1", 1, 0); lancar(c, "QF2", 0, 0, [5, 4]); lancar(c, "F", 2, 2, [3, 2]);
    r = L.proximoJogo(L.resolverTimes(c), agora("2026-12-01T10:00:00-03:00"));
    igual([r.modo, r.campeao && r.campeao.id, r.mataMataIniciado], ["nenhum", "a3", true]);
  });
  teste("proximoJogo: mesmo instante em outro fuso dá o mesmo resultado", function () {
    var r = L.proximoJogo(L.resolverTimes(copaBase()), agora("2026-10-24T13:00:00Z"));
    igual(r.jogo.id, "A1");
  });
  teste("ultimosResultados: até 4, mais recente primeiro", function () {
    var c = completarB(completarA(copaBase()));
    igual(L.ultimosResultados(L.resolverTimes(c)).map(function (j) { return j.id; }), ["B3", "A3", "A2", "B2"]);
    igual(L.ultimosResultados(L.resolverTimes(c), 2).length, 2);
  });
  teste("partesContagem", function () {
    igual(L.partesContagem("2026-10-24T14:00:00-03:00", agora("2026-10-24T10:00:00-03:00")), { dias: 0, horas: 4, minutos: 0, segundos: 0, terminou: false });
    igual(L.partesContagem("2026-10-26T15:01:05-03:00", agora("2026-10-24T14:00:00-03:00")), { dias: 2, horas: 1, minutos: 1, segundos: 5, terminou: false });
    igual(L.partesContagem("2026-10-24T14:00:00-03:00", agora("2026-10-24T14:00:01-03:00")).terminou, true);
  });
  teste("campeao", function () {
    var c = completarB(completarA(copaBase()));
    igual(L.campeao(c), null);
    lancar(c, "QF1", 1, 0); lancar(c, "QF2", 2, 0); lancar(c, "F", 0, 1);
    igual(L.campeao(c).id, "b1");
  });

  // ================================================================ US5 (T035)
  function temAviso(avisos, trecho) {
    return avisos.some(function (a) { return a.indexOf(trecho) !== -1; });
  }
  teste("validarDados: dados válidos → nenhum aviso", function () {
    igual(L.validarDados(copaBase()), []);
  });
  teste("validarDados: problemas comuns geram avisos", function () {
    var c = copaBase();
    c.jogos.push({ id: "A1", fase: "grupos", grupo: "A", rodada: 1, data: "2026-10-24T14:00:00-03:00", mandante: "a1", visitante: "a2", placar: null, status: "agendado" });
    jogo(c, "B1").mandante = "zzz";
    jogo(c, "A3").mandante = { vencedorDe: "Z9" };
    jogo(c, "A2").status = "finalizado";
    jogo(c, "B2").status = "encerrado";
    jogo(c, "B3").data = "15/11/2026";
    c.times.push({ id: "a4", nome: "Delta 2", grupo: "A", sigla: "D2", cor: "#FF0000" });
    c.times[1].sigla = "BRAVO";
    delete c.times[2].sigla;
    var av = L.validarDados(c);
    verdadeiro(temAviso(av, "duplicado"), "id duplicado");
    verdadeiro(temAviso(av, "zzz"), "time inexistente");
    verdadeiro(temAviso(av, "Z9"), "jogo inexistente");
    verdadeiro(temAviso(av, "finalizado"), "status inválido");
    verdadeiro(temAviso(av, "sem placar"), "encerrado sem placar");
    verdadeiro(temAviso(av, "15/11/2026"), "data inválida");
    verdadeiro(temAviso(av, "Grupo A"), "grupo com 4 times");
    verdadeiro(temAviso(av, "#FF0000"), "cor fora da paleta");
    verdadeiro(temAviso(av, "BRAVO"), "sigla longa demais");
    verdadeiro(temAviso(av, "Time \"a3\" está sem 'sigla'"), "sigla ausente");
  });
  teste("validarDados: ciclo de referências", function () {
    var c = copaBase();
    c.jogos.push({ id: "X", fase: "final", data: null, mandante: { vencedorDe: "Y" }, visitante: "a1", placar: null, status: "agendado" });
    c.jogos.push({ id: "Y", fase: "final", data: null, mandante: { vencedorDe: "X" }, visitante: "a2", placar: null, status: "agendado" });
    verdadeiro(temAviso(L.validarDados(c), "ciclo"));
  });
  teste("validarDados nunca lança exceção", function () {
    verdadeiro(L.validarDados(undefined).length > 0);
    verdadeiro(Array.isArray(L.validarDados({ times: "x", jogos: 3 })));
  });

  // ================================================================ US6 (T041)
  teste("filtrarJogos por grupo", function () {
    var r = L.filtrarJogos(L.resolverTimes(copaBase()), { grupo: "B" });
    igual(r.map(function (i) { return i.jogo.id; }).sort(), ["B1", "B2", "B3"]);
  });
  teste("filtrarJogos por time marca jogos possíveis", function () {
    var r = L.filtrarJogos(L.resolverTimes(copaBase()), { time: "a1" });
    var mapa = {};
    r.forEach(function (i) { mapa[i.jogo.id] = i.possivel; });
    igual(mapa.A1, false);
    igual(mapa.A2, true);
    igual(mapa.A3, true);
    igual(mapa.QF1, true);
  });
  teste("filtrarJogos combina grupo e time; vazio → todos", function () {
    var todos = L.resolverTimes(copaBase());
    igual(L.filtrarJogos(todos, { grupo: "B", time: "a1" }).length, 0);
    igual(L.filtrarJogos(todos, {}).length, todos.length);
  });
  teste("jogosDoTime após resultado não traz jogos impossíveis", function () {
    var r = L.jogosDoTime(L.resolverTimes(lancar(copaBase(), "A1", 2, 1)), "a1");
    var ids = r.map(function (i) { return i.jogo.id; });
    verdadeiro(ids.indexOf("A2") === -1, "a1 venceu, não joga A2");
    verdadeiro(ids.indexOf("A3") !== -1);
  });
  teste("lerFiltros valida parâmetros", function () {
    igual(L.lerFiltros("?grupo=Z&time=xyz", copaBase()), { grupo: null, time: null });
    igual(L.lerFiltros("?grupo=a&time=b2", copaBase()), { grupo: "A", time: "b2" });
    igual(L.lerFiltros("", copaBase()), { grupo: null, time: null });
  });

  // ================================================================ US8 (T050)
  teste("vaga de grupo pendente até o grupo terminar", function () {
    var c = copaBase();
    lancar(c, "A1", 2, 1);
    var q = resolvido(c, "QF1");
    igual(q.mandanteR.tipo, "pendente");
    igual(q.mandanteR.rotulo, "1º do Grupo A");
    completarB(completarA(copaBase()));
    var c2 = completarB(completarA(copaBase()));
    igual(idDe(resolvido(c2, "QF1").mandanteR), "a3");
    igual(idDe(resolvido(c2, "QF1").visitanteR), "b2");
    igual(idDe(resolvido(c2, "QF2").visitanteR), "a1");
  });
  teste("vaga aguardando sorteio continua pendente", function () {
    var c = completarB(copaBase());
    lancar(c, "A1", 1, 0); lancar(c, "A2", 1, 0); lancar(c, "A3", 0, 1);
    igual(resolvido(c, "QF1").mandanteR.tipo, "pendente");
  });
  teste("cadeia QF → F resolvida com pênaltis", function () {
    var c = completarB(completarA(copaBase()));
    lancar(c, "QF1", 0, 0, [3, 4]); // b2 vence
    lancar(c, "QF2", 1, 2);         // a1 vence
    var f = resolvido(c, "F");
    igual([idDe(f.mandanteR), idDe(f.visitanteR)], ["b2", "a1"]);
  });
  teste("timesPossiveis de vaga de grupo", function () {
    igual(L.timesPossiveis({ colocado: 2, grupo: "B" }, copaBase()).sort(), ["b1", "b2", "b3"]);
  });
  teste("jogo de mata-mata sem data", function () {
    igual(L.statusExibido(jogo(copaBase(), "QF1"), agora("2026-12-01T10:00:00-03:00")), "data-a-definir");
  });

  // ================================================================ Destaque manual do Início
  teste("destaqueManual: devolve os jogos na ordem pedida, com textos", function () {
    var c = copaBase();
    c.destaque = { titulo: " Última rodada ", subtitulo: "Fase de grupos", texto: "Domingo", jogos: ["A1", "B1"] };
    var d = L.destaqueManual(c, L.resolverTimes(c));
    igual(d.jogos.map(function (j) { return j.id; }), ["A1", "B1"]);
    igual([d.titulo, d.subtitulo, d.texto], ["Última rodada", "Fase de grupos", "Domingo"]);
  });
  teste("destaqueManual: sem bloco, nulo ou só com ids inexistentes → null", function () {
    var c = copaBase();
    igual(L.destaqueManual(c, L.resolverTimes(c)), null);
    c.destaque = null;
    igual(L.destaqueManual(c, L.resolverTimes(c)), null);
    c.destaque = { jogos: ["ZZ"] };
    igual(L.destaqueManual(c, L.resolverTimes(c)), null);
  });
  teste("validarDados: avisa destaque com jogo inexistente ou sem lista", function () {
    var c = copaBase();
    c.destaque = { jogos: ["A1", "XX"] };
    verdadeiro(L.validarDados(c).some(function (a) { return a.indexOf("\"XX\"") !== -1; }), "deveria avisar XX");
    c.destaque = { titulo: "Sem jogos" };
    verdadeiro(L.validarDados(c).some(function (a) { return a.indexOf("'destaque'") !== -1; }), "deveria avisar lista ausente");
    c.destaque = { jogos: ["A1"] };
    verdadeiro(!L.validarDados(c).some(function (a) { return a.indexOf("'destaque'") !== -1; }), "destaque válido não gera aviso");
  });

  // ================================================================ Patrocinadores (Phase 15)
  teste("listarPatrocinadores: mantém ordem e descarta itens sem nome ou logo", function () {
    var c = copaBase();
    c.patrocinadores = [
      { id: "p1", nome: "Mercadinho", logo: "img/patrocinadores/p1.webp" },
      { id: "p2", nome: "", logo: "img/patrocinadores/p2.webp" },
      { id: "p3", nome: "Prefeitura", logo: "img/patrocinadores/p3.webp", link: "https://exemplo.com" },
      { id: "p4", nome: "Sem logo" },
      "lixo"
    ];
    igual(L.listarPatrocinadores(c).map(function (p) { return p.id; }), ["p1", "p3"]);
    igual(L.listarPatrocinadores(copaBase()), []);
    igual(L.listarPatrocinadores(undefined), []);
  });
  teste("listarPatrocinadores: link só é aceito com http(s)", function () {
    var c = copaBase();
    c.patrocinadores = [
      { id: "a", nome: "A", logo: "img/a.webp", link: "javascript:alert(1)" },
      { id: "b", nome: "B", logo: "img/b.webp", link: "https://b.com.br" }
    ];
    var l = L.listarPatrocinadores(c);
    igual([l[0].link, l[1].link], [null, "https://b.com.br"]);
  });
  teste("validarDados: patrocinadores inválidos geram avisos", function () {
    var c = copaBase();
    c.patrocinadores = [
      { id: "p1", nome: "Sem logo" },
      { id: "p2", nome: "Logo absoluto", logo: "/img/p2.webp" },
      { id: "p3", nome: "Link ruim", logo: "img/p3.webp", link: "www.sem-protocolo.com" }
    ];
    var av = L.validarDados(c);
    verdadeiro(temAviso(av, "Sem logo"), "sem logo");
    verdadeiro(temAviso(av, "/img/p2.webp"), "caminho absoluto");
    verdadeiro(temAviso(av, "www.sem-protocolo.com"), "link sem https");
    c.patrocinadores = [{ id: "ok", nome: "Ok", logo: "img/ok.webp", link: "https://ok.com" }];
    igual(L.validarDados(c), []);
    c.patrocinadores = "x";
    verdadeiro(temAviso(L.validarDados(c), "patrocinadores"), "lista inválida");
  });

  // ================================================================ US10 (T060)
  teste("ordenarAvisos: mais recente primeiro, sem mutar", function () {
    var av = [{ data: "2026-10-01", titulo: "a" }, { data: "2026-10-20", titulo: "b" }, { data: "2026-10-10", titulo: "c" }];
    var copia = JSON.stringify(av);
    igual(L.ordenarAvisos(av).map(function (a) { return a.titulo; }), ["b", "c", "a"]);
    igual(JSON.stringify(av), copia);
    igual(L.ordenarAvisos([]), []);
    igual(L.ordenarAvisos("x"), []);
  });

  // ---------------------------------------------------------------- saída
  var passou = resultados.filter(function (r) { return r.ok; }).length;
  var resumo = passou + " de " + resultados.length + " testes passaram";

  if (typeof document !== "undefined" && document.getElementById) {
    var alvo = document.getElementById("resultados");
    var cab = document.getElementById("resumo");
    cab.textContent = resumo;
    cab.className = passou === resultados.length ? "resumo ok" : "resumo falha";
    alvo.innerHTML = resultados.map(function (r) {
      var nome = r.nome.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; });
      var erro = r.erro ? "<pre>" + r.erro.replace(/[&<>]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]; }) + "</pre>" : "";
      return "<li class=\"" + (r.ok ? "ok" : "falha") + "\">" + (r.ok ? "✅ " : "❌ ") + nome + erro + "</li>";
    }).join("");
  } else if (typeof console !== "undefined") {
    resultados.forEach(function (r) { if (!r.ok) console.log("❌ " + r.nome + "\n   " + r.erro); });
    console.log(resumo);
    if (typeof process !== "undefined" && passou !== resultados.length) process.exitCode = 1;
  }
})();
