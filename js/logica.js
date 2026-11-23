/* Copa Camutanga — logica.js
   Funções PURAS (sem DOM, sem window.COPA, sem relógio implícito).
   Tudo entra por parâmetro. Exposto como window.Logica. */
(function () {
  "use strict";

  var TZ = "America/Recife";
  var fmtData = new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit" });
  var fmtDia = new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, weekday: "short" });
  var fmtDiaLongo = new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, weekday: "long" });
  var fmtHora = new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });

  function paraData(iso) {
    if (typeof iso !== "string" || !iso) return null;
    var d = new Date(iso);
    return isNaN(d.getTime()) ? null : d;
  }

  function capitalizar(s) {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  }

  function formatarData(iso) {
    var d = paraData(iso);
    return d ? fmtData.format(d) : "";
  }

  function formatarDiaSemana(iso) {
    var d = paraData(iso);
    return d ? capitalizar(fmtDia.format(d).replace(".", "")) : "";
  }

  function formatarDiaSemanaExtenso(iso) {
    var d = paraData(iso);
    return d ? capitalizar(fmtDiaLongo.format(d).split("-")[0]) : "";
  }

  function formatarHora(iso) {
    var d = paraData(iso);
    return d ? fmtHora.format(d) : "";
  }

  function formatarDataAviso(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(typeof s === "string" ? s : "");
    return m ? m[3] + "/" + m[2] : "";
  }

  var PREPOSICOES = ["de", "da", "do", "das", "dos", "e"];
  function iniciais(nome) {
    var palavras = String(nome || "").trim().split(/\s+/).filter(function (p) {
      return p && PREPOSICOES.indexOf(p.toLowerCase()) === -1;
    });
    if (!palavras.length) return "?";
    if (palavras.length === 1) return palavras[0].slice(0, 3).toUpperCase();
    return palavras.slice(0, 3).map(function (p) { return p.charAt(0); }).join("").toUpperCase();
  }

  var CORES = ["azul-marinho", "azul-royal", "vermelho", "vermelho-escuro", "gramado"];
  function corDoSelo(cor) {
    return CORES.indexOf(cor) !== -1 ? cor : "azul-royal";
  }

  function indexarTimes(times) {
    var mapa = {};
    (Array.isArray(times) ? times : []).forEach(function (t) {
      if (t && typeof t.id === "string" && !mapa[t.id]) mapa[t.id] = t;
    });
    return mapa;
  }

  // ------------------------------------------------------------------ básicos
  var STATUS = ["agendado", "ao-vivo", "encerrado", "adiado"];
  var FASES = ["grupos", "quartas", "semifinal", "final"];
  var ORDEM_FASE = { grupos: 0, quartas: 1, semifinal: 2, final: 3 };
  var TITULO_RODADA = { 1: "Primeira Rodada", 2: "Segunda Rodada", 3: "Terceira Rodada" };
  var TITULO_FASE = { quartas: "Quartas de Final", semifinal: "Semifinais", final: "Final" };
  var GRUPOS = ["A", "B", "C", "D"];

  function ehInteiroNaoNegativo(n) {
    return typeof n === "number" && Number.isInteger(n) && n >= 0;
  }

  function placarValido(p) {
    return !!p && ehInteiroNaoNegativo(p.mandante) && ehInteiroNaoNegativo(p.visitante);
  }

  function penaltisValidos(p) {
    return placarValido(p) && placarValido(p.penaltis);
  }

  function normalizarCopa(copa) {
    var c = copa && typeof copa === "object" ? copa : {};
    return {
      times: Array.isArray(c.times) ? c.times.filter(function (t) { return t && typeof t === "object"; }) : [],
      jogos: Array.isArray(c.jogos) ? c.jogos.filter(function (j) { return j && typeof j === "object"; }) : [],
      avisos: Array.isArray(c.avisos) ? c.avisos.filter(function (a) { return a && typeof a === "object"; }) : []
    };
  }

  function indexarJogos(jogos) {
    var mapa = {};
    jogos.forEach(function (j) { if (typeof j.id === "string" && !mapa[j.id]) mapa[j.id] = j; });
    return mapa;
  }

  function tempo(j) {
    var d = paraData(j && j.data);
    return d ? d.getTime() : null;
  }

  function tipoRef(ref) {
    if (typeof ref === "string") return "time";
    if (ref && typeof ref === "object") {
      if (typeof ref.vencedorDe === "string") return "vencedor";
      if (typeof ref.perdedorDe === "string") return "perdedor";
      if (ref.colocado !== undefined || ref.grupo !== undefined) return "colocado";
    }
    return "invalido";
  }

  function rotuloParticipante(ref) {
    switch (tipoRef(ref)) {
      case "vencedor": return "Vencedor " + ref.vencedorDe;
      case "perdedor": return "Perdedor " + ref.perdedorDe;
      case "colocado":
        return GRUPOS.indexOf(ref.grupo) !== -1 && (ref.colocado === 1 || ref.colocado === 2 || ref.colocado === 3)
          ? ref.colocado + "º do Grupo " + ref.grupo : "A definir";
      default: return "A definir";
    }
  }

  // ------------------------------------------------------------------ resultado de um jogo
  function vencedorEPerdedor(jogo) {
    if (!jogo || jogo.status !== "encerrado" || !placarValido(jogo.placar)) return null;
    var p = jogo.placar;
    if (p.mandante > p.visitante) return { vencedor: "mandante", perdedor: "visitante", penaltis: false };
    if (p.visitante > p.mandante) return { vencedor: "visitante", perdedor: "mandante", penaltis: false };
    if (penaltisValidos(p) && p.penaltis.mandante !== p.penaltis.visitante) {
      return p.penaltis.mandante > p.penaltis.visitante
        ? { vencedor: "mandante", perdedor: "visitante", penaltis: true }
        : { vencedor: "visitante", perdedor: "mandante", penaltis: true };
    }
    return null;
  }

  function statusExibido(jogo, agora) {
    var st = jogo && jogo.status;
    if (st === "adiado") return "adiado";
    if (st === "ao-vivo") return "ao-vivo";
    if (st === "encerrado") return placarValido(jogo.placar) ? "encerrado" : "aguardando-resultado";
    var t = tempo(jogo);
    if (t === null) return "data-a-definir";
    var agoraMs = agora instanceof Date ? agora.getTime() : NaN;
    return !isNaN(agoraMs) && t <= agoraMs ? "aguardando-resultado" : "agendado";
  }

  function formatarPlacar(jogo) {
    var p = jogo && jogo.placar;
    if (!placarValido(p)) return "";
    var s = p.mandante + " x " + p.visitante;
    if (p.mandante === p.visitante && penaltisValidos(p)) {
      s += " (pên. " + p.penaltis.mandante + " x " + p.penaltis.visitante + ")";
    }
    if (jogo.wo === "mandante" || jogo.wo === "visitante") s += " (W.O.)";
    return s;
  }

  // ------------------------------------------------------------------ resolução de participantes
  // opcoes.semColocado: não resolve vagas "Nº do Grupo" (usado dentro da classificação,
  // para evitar recursão infinita se os dados estiverem errados).
  function criarResolvedor(copa, opcoes) {
    var c = normalizarCopa(copa);
    var idxT = indexarTimes(c.times);
    var idxJ = indexarJogos(c.jogos);
    var memo = {};
    var semColocado = !!(opcoes && opcoes.semColocado);

    function pendente(rotulo, possiveis) {
      return { tipo: "pendente", rotulo: rotulo, possiveis: possiveis || [] };
    }

    function resultado(id, visitando) {
      if (memo[id]) return memo[id];
      var j = idxJ[id];
      if (!j || visitando[id]) return null;
      var v2 = Object.assign({}, visitando);
      v2[id] = true;
      var mR = participante(j.mandante, v2);
      var vR = participante(j.visitante, v2);
      var vp = vencedorEPerdedor(j);
      var lados = { mandante: mR, visitante: vR };
      var vencedorId = null, perdedorId = null;
      if (vp && mR.tipo === "time" && vR.tipo === "time") {
        vencedorId = lados[vp.vencedor].time.id;
        perdedorId = lados[vp.perdedor].time.id;
      }
      var r = { mandanteR: mR, visitanteR: vR, vencedorId: vencedorId, perdedorId: perdedorId, decididoNosPenaltis: !!(vp && vp.penaltis) };
      memo[id] = r;
      return r;
    }

    function possiveis(ref, visitando) {
      var tipo = tipoRef(ref);
      if (tipo === "time") return idxT[ref] ? [ref] : [];
      if (tipo === "colocado") {
        if (!semColocado) {
          var t = colocado(copa, ref.grupo, ref.colocado);
          if (t) return [t.id];
        }
        return c.times.filter(function (x) { return x.grupo === ref.grupo; }).map(function (x) { return x.id; });
      }
      if (tipo === "vencedor" || tipo === "perdedor") {
        var id = tipo === "vencedor" ? ref.vencedorDe : ref.perdedorDe;
        var j = idxJ[id];
        if (!j || visitando[id]) return [];
        var r = resultado(id, visitando);
        var resolvidoId = r && (tipo === "vencedor" ? r.vencedorId : r.perdedorId);
        if (resolvidoId) return [resolvidoId];
        var v2 = Object.assign({}, visitando);
        v2[id] = true;
        var lista = possiveis(j.mandante, v2).concat(possiveis(j.visitante, v2));
        return lista.filter(function (x, i) { return lista.indexOf(x) === i; });
      }
      return [];
    }

    function participante(ref, visitando) {
      visitando = visitando || {};
      var tipo = tipoRef(ref);
      if (tipo === "time") return idxT[ref] ? { tipo: "time", time: idxT[ref] } : pendente("A definir");
      if (tipo === "colocado") {
        var rotulo = rotuloParticipante(ref);
        if (rotulo === "A definir") return pendente(rotulo);
        if (!semColocado) {
          var t = colocado(copa, ref.grupo, ref.colocado);
          if (t) return { tipo: "time", time: t };
        }
        return pendente(rotulo, possiveis(ref, visitando));
      }
      if (tipo === "vencedor" || tipo === "perdedor") {
        var id = tipo === "vencedor" ? ref.vencedorDe : ref.perdedorDe;
        if (!idxJ[id] || visitando[id]) return pendente("A definir");
        var r = resultado(id, visitando);
        var tid = r && (tipo === "vencedor" ? r.vencedorId : r.perdedorId);
        if (tid && idxT[tid]) return { tipo: "time", time: idxT[tid] };
        return pendente(rotuloParticipante(ref), possiveis(ref, visitando));
      }
      return pendente("A definir");
    }

    return { copa: c, idxT: idxT, idxJ: idxJ, resultado: resultado, participante: participante, possiveis: possiveis };
  }

  function compararJogos(a, b) {
    var ta = tempo(a), tb = tempo(b);
    if (ta !== null && tb !== null && ta !== tb) return ta - tb;
    if (ta !== null && tb === null) return -1;
    if (ta === null && tb !== null) return 1;
    if (ta === null && tb === null) {
      var fa = ORDEM_FASE[a.fase] !== undefined ? ORDEM_FASE[a.fase] : 9;
      var fb = ORDEM_FASE[b.fase] !== undefined ? ORDEM_FASE[b.fase] : 9;
      if (fa !== fb) return fa - fb;
    }
    return (a.ordemNoDia || 0) - (b.ordemNoDia || 0);
  }

  function ordenarEstavel(lista, cmp) {
    return lista.map(function (x, i) { return { x: x, i: i }; })
      .sort(function (a, b) { return cmp(a.x, b.x) || a.i - b.i; })
      .map(function (o) { return o.x; });
  }

  function resolverTimes(copa, agora, opcoes) {
    var R = criarResolvedor(copa, opcoes);
    var vistos = {};
    var lista = R.copa.jogos.filter(function (j) {
      if (typeof j.id !== "string" || vistos[j.id]) return false;
      vistos[j.id] = true;
      return true;
    }).map(function (j) {
      var r = R.resultado(j.id, {}) || {
        mandanteR: { tipo: "pendente", rotulo: "A definir", possiveis: [] },
        visitanteR: { tipo: "pendente", rotulo: "A definir", possiveis: [] },
        vencedorId: null, perdedorId: null, decididoNosPenaltis: false
      };
      var o = Object.assign({}, j, r);
      if (agora instanceof Date) o.statusExibido = statusExibido(j, agora);
      return o;
    });
    return ordenarEstavel(lista, compararJogos);
  }

  function timesPossiveis(ref, copa) {
    try { return criarResolvedor(copa).possiveis(ref, {}); } catch (e) { return []; }
  }

  // ------------------------------------------------------------------ classificação
  function calcularClassificacao(copa, grupo) {
    var R = criarResolvedor(copa, { semColocado: true });
    var times = R.copa.times.filter(function (t) { return t.grupo === grupo && typeof t.id === "string"; });
    var linhas = {};
    times.forEach(function (t) {
      linhas[t.id] = { timeId: t.id, nome: String(t.nome || t.id), j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, sg: 0, pts: 0, posicao: 0, aguardandoSorteio: false };
    });
    var confrontos = [];
    R.copa.jogos.forEach(function (j) {
      if (j.fase !== "grupos" || j.grupo !== grupo || j.status !== "encerrado" || !placarValido(j.placar)) return;
      var r = R.resultado(j.id, {});
      if (!r || r.mandanteR.tipo !== "time" || r.visitanteR.tipo !== "time") return;
      var m = linhas[r.mandanteR.time.id], v = linhas[r.visitanteR.time.id];
      if (!m || !v || m === v) return;
      var gm = j.placar.mandante, gv = j.placar.visitante;
      m.j++; v.j++;
      m.gp += gm; m.gc += gv; v.gp += gv; v.gc += gm;
      if (gm > gv) { m.v++; v.d++; m.pts += 3; }
      else if (gv > gm) { v.v++; m.d++; v.pts += 3; }
      else { m.e++; v.e++; m.pts++; v.pts++; }
      confrontos.push({ m: m.timeId, v: v.timeId, gm: gm, gv: gv });
    });
    var lista = times.map(function (t) {
      var l = linhas[t.id];
      l.sg = l.gp - l.gc;
      return l;
    });
    var sorteio = {};
    times.forEach(function (t) { sorteio[t.id] = Number.isInteger(t.sorteio) && t.sorteio > 0 ? t.sorteio : null; });
    var completo = grupoCompleto(copa, grupo);

    function alfabetica(a, b) { return a.nome.localeCompare(b.nome, "pt-BR"); }
    lista.sort(function (a, b) { return b.pts - a.pts || b.sg - a.sg || b.gp - a.gp || alfabetica(a, b); });

    // desempata blocos com Pts, SG e GP iguais
    var final = [];
    for (var i = 0; i < lista.length;) {
      var k = i + 1;
      while (k < lista.length && lista[k].pts === lista[i].pts && lista[k].sg === lista[i].sg && lista[k].gp === lista[i].gp) k++;
      var bloco = lista.slice(i, k);
      if (bloco.length === 2) {
        var a = bloco[0], b = bloco[1];
        var vencedorH2H = null;
        confrontos.forEach(function (cf) {
          if ((cf.m === a.timeId && cf.v === b.timeId) || (cf.m === b.timeId && cf.v === a.timeId)) {
            if (cf.gm > cf.gv) vencedorH2H = cf.m;
            else if (cf.gv > cf.gm) vencedorH2H = cf.v;
          }
        });
        if (vencedorH2H) bloco = vencedorH2H === a.timeId ? [a, b] : [b, a];
        else bloco = porSorteio(bloco);
      } else if (bloco.length > 2) {
        bloco = porSorteio(bloco);
      }
      final = final.concat(bloco);
      i = k;
    }

    function porSorteio(bl) {
      var todos = bl.every(function (l) { return sorteio[l.timeId] !== null; });
      if (todos) return bl.slice().sort(function (x, y) { return sorteio[x.timeId] - sorteio[y.timeId]; });
      var ord = bl.slice().sort(alfabetica);
      if (completo) ord.forEach(function (l) { l.aguardandoSorteio = true; });
      return ord;
    }

    final.forEach(function (l, idx) { l.posicao = idx + 1; });
    return final;
  }

  function grupoCompleto(copa, grupo) {
    var jogos = normalizarCopa(copa).jogos.filter(function (j) { return j.fase === "grupos" && j.grupo === grupo; });
    return jogos.length > 0 && jogos.every(function (j) { return j.status === "encerrado" && placarValido(j.placar); });
  }

  function colocado(copa, grupo, n) {
    if (!grupoCompleto(copa, grupo)) return null;
    var linha = calcularClassificacao(copa, grupo)[n - 1];
    if (!linha || linha.aguardandoSorteio) return null;
    return indexarTimes(normalizarCopa(copa).times)[linha.timeId] || null;
  }

  // ------------------------------------------------------------------ tempo e "próximo jogo"
  function timeVencedor(j) {
    if (!j || !j.vencedorId) return null;
    if (j.mandanteR && j.mandanteR.tipo === "time" && j.mandanteR.time.id === j.vencedorId) return j.mandanteR.time;
    if (j.visitanteR && j.visitanteR.tipo === "time" && j.visitanteR.time.id === j.vencedorId) return j.visitanteR.time;
    return null;
  }

  function proximoJogo(jogosResolvidos, agora) {
    var jogos = Array.isArray(jogosResolvidos) ? jogosResolvidos : [];
    var t = agora instanceof Date ? agora.getTime() : Date.now();
    var final = jogos.filter(function (j) { return j.fase === "final"; })[0];
    var campeao = timeVencedor(final);
    var mataMataIniciado = jogos.some(function (j) { return j.fase !== "grupos" && j.status === "encerrado" && placarValido(j.placar); });
    var base = { campeao: campeao, mataMataIniciado: mataMataIniciado };
    var comData = jogos.filter(function (j) { return tempo(j) !== null && j.status !== "adiado"; });
    var futuros = comData.filter(function (j) { return j.status === "agendado" && tempo(j) > t; })
      .sort(function (a, b) { return tempo(a) - tempo(b); });
    var seguinte = futuros[0] || null;

    var aoVivo = jogos.filter(function (j) { return j.status === "ao-vivo"; }).sort(compararJogos)[0];
    if (aoVivo) return Object.assign({ modo: "ao-vivo", jogo: aoVivo, seguinte: seguinte }, base);

    var iniciados = comData.filter(function (j) { return tempo(j) <= t; })
      .sort(function (a, b) { return tempo(b) - tempo(a); });
    var p = iniciados[0];
    if (p && p.status === "agendado") return Object.assign({ modo: "aguardando-resultado", jogo: p, seguinte: seguinte }, base);
    if (seguinte) return Object.assign({ modo: "proximo", jogo: seguinte, seguinte: null }, base);
    return Object.assign({ modo: "nenhum", jogo: null, seguinte: null }, base);
  }

  function ultimosResultados(jogosResolvidos, n) {
    var limite = typeof n === "number" ? n : 4;
    return (Array.isArray(jogosResolvidos) ? jogosResolvidos : [])
      .filter(function (j) { return j.status === "encerrado" && placarValido(j.placar); })
      .sort(function (a, b) { return (tempo(b) || 0) - (tempo(a) || 0); })
      .slice(0, limite);
  }

  function partesContagem(alvoIso, agora) {
    var alvo = paraData(alvoIso);
    var t = agora instanceof Date ? agora.getTime() : NaN;
    var zero = { dias: 0, horas: 0, minutos: 0, segundos: 0, terminou: true };
    if (!alvo || isNaN(t)) return zero;
    var diff = alvo.getTime() - t;
    if (diff <= 0) return zero;
    var s = Math.floor(diff / 1000);
    return {
      dias: Math.floor(s / 86400),
      horas: Math.floor((s % 86400) / 3600),
      minutos: Math.floor((s % 3600) / 60),
      segundos: s % 60,
      terminou: false
    };
  }

  function campeao(copa) {
    var f = resolverTimes(copa).filter(function (j) { return j.fase === "final"; })[0];
    return timeVencedor(f);
  }

  // ------------------------------------------------------------------ filtros e agrupamentos
  function filtrarJogos(jogosResolvidos, filtros) {
    var f = filtros || {};
    var saida = [];
    (Array.isArray(jogosResolvidos) ? jogosResolvidos : []).forEach(function (j) {
      if (f.grupo && j.grupo !== f.grupo) return;
      if (!f.time) { saida.push({ jogo: j, possivel: false }); return; }
      var lados = [j.mandanteR, j.visitanteR];
      var certo = lados.some(function (r) { return r && r.tipo === "time" && r.time.id === f.time; });
      if (certo) { saida.push({ jogo: j, possivel: false }); return; }
      var possivel = lados.some(function (r) { return r && r.tipo === "pendente" && r.possiveis.indexOf(f.time) !== -1; });
      if (possivel) saida.push({ jogo: j, possivel: true });
    });
    return saida;
  }

  function jogosDoTime(jogosResolvidos, timeId) {
    return filtrarJogos(jogosResolvidos, { time: timeId });
  }

  var fmtChave = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  function chaveDia(iso) {
    var d = paraData(iso);
    return d ? fmtChave.format(d) : null;
  }

  function agruparPorRodadaEData(itens) {
    var lista = (Array.isArray(itens) ? itens : []).map(function (i) {
      return i && i.jogo ? i : { jogo: i, possivel: false };
    }).filter(function (i) { return i.jogo; });
    var blocos = {};
    var ordem = [];
    lista.forEach(function (it) {
      var j = it.jogo;
      var chave, titulo, peso;
      if (j.fase === "grupos" || !j.fase) {
        chave = "r" + (j.rodada || 0);
        titulo = TITULO_RODADA[j.rodada] || "Fase de Grupos";
        peso = j.rodada || 0;
      } else {
        chave = j.fase;
        titulo = TITULO_FASE[j.fase] || "Fase Final";
        peso = 10 + (ORDEM_FASE[j.fase] || 9);
      }
      if (!blocos[chave]) { blocos[chave] = { titulo: titulo, chave: chave, peso: peso, itens: [] }; ordem.push(chave); }
      blocos[chave].itens.push(it);
    });
    return ordem.map(function (k) { return blocos[k]; })
      .sort(function (a, b) { return a.peso - b.peso; })
      .map(function (b) {
        var itensOrd = ordenarEstavel(b.itens, function (x, y) { return compararJogos(x.jogo, y.jogo); });
        var datas = [];
        var porChave = {};
        itensOrd.forEach(function (it) {
          var cd = chaveDia(it.jogo.data) || "sem-data";
          if (!porChave[cd]) {
            porChave[cd] = { iso: cd === "sem-data" ? null : it.jogo.data, itens: [] };
            datas.push(porChave[cd]);
          }
          porChave[cd].itens.push(it);
        });
        return { titulo: b.titulo, chave: b.chave, datas: datas };
      });
  }

  function lerFiltros(search, copa) {
    var params;
    try { params = new URLSearchParams(typeof search === "string" ? search : ""); } catch (e) { params = new URLSearchParams(""); }
    var grupo = (params.get("grupo") || "").toUpperCase();
    var time = params.get("time") || "";
    var idxT = indexarTimes(normalizarCopa(copa).times);
    return {
      grupo: GRUPOS.indexOf(grupo) !== -1 ? grupo : null,
      time: idxT[time] ? time : null
    };
  }

  function ordenarAvisos(avisos) {
    if (!Array.isArray(avisos)) return [];
    return ordenarEstavel(avisos.filter(function (a) { return a && typeof a === "object"; }), function (a, b) {
      var da = String(a.data || ""), db = String(b.data || "");
      return da < db ? 1 : da > db ? -1 : 0;
    });
  }

  // ------------------------------------------------------------------ patrocinadores
  function linkSeguro(link) {
    return typeof link === "string" && /^https?:\/\/\S+$/i.test(link.trim()) ? link.trim() : null;
  }

  var CATEGORIAS_PATROCINIO = ["organizacao", "oficial", "apoio", "parceiro"];

  function listarPatrocinadores(copa) {
    var lista = copa && Array.isArray(copa.patrocinadores) ? copa.patrocinadores : [];
    return lista.filter(function (p) {
      return p && typeof p === "object" && typeof p.nome === "string" && p.nome.trim() &&
        typeof p.logo === "string" && p.logo.trim();
    }).map(function (p) {
      var cat = CATEGORIAS_PATROCINIO.indexOf(p.categoria) !== -1 ? p.categoria : "apoio";
      return { id: p.id || "", nome: p.nome.trim(), logo: p.logo.trim(), link: linkSeguro(p.link), categoria: cat };
    });
  }

  // Agrupa na ordem fixa: organização → oficiais → apoios → parceiros (só grupos com itens).
  function agruparPatrocinadores(lista) {
    return CATEGORIAS_PATROCINIO.map(function (cat) {
      return { categoria: cat, itens: (lista || []).filter(function (p) { return p.categoria === cat; }) };
    }).filter(function (g) { return g.itens.length; });
  }

  // ------------------------------------------------------------------ destaque manual (Início)
  // copa.destaque = { titulo, subtitulo, texto, jogos: ["C3", "D3"] } → rodada em destaque.
  // Retorna null quando não há destaque válido (o Início volta ao destaque automático).
  function destaqueManual(copa, jogosResolvidos) {
    var d = copa && copa.destaque;
    if (!d || typeof d !== "object" || !Array.isArray(d.jogos)) return null;
    var porId = {};
    (Array.isArray(jogosResolvidos) ? jogosResolvidos : []).forEach(function (j) { porId[j.id] = j; });
    var jogos = d.jogos.map(function (id) { return porId[id]; }).filter(Boolean);
    if (!jogos.length) return null;
    function txt(v) { return typeof v === "string" ? v.trim() : ""; }
    return { titulo: txt(d.titulo) || "Destaque", subtitulo: txt(d.subtitulo), texto: txt(d.texto), jogos: jogos };
  }

  // ------------------------------------------------------------------ validação
  function validarDados(copa) {
    var avisos = [];
    try {
      if (!copa || typeof copa !== "object") return ["Os dados da Copa não foram encontrados (window.COPA ausente ou com erro de digitação)."];
      if (!Array.isArray(copa.times)) avisos.push("'times' precisa ser uma lista [ ... ].");
      if (!Array.isArray(copa.jogos)) avisos.push("'jogos' precisa ser uma lista [ ... ].");
      if (copa.avisos !== undefined && !Array.isArray(copa.avisos)) avisos.push("'avisos' precisa ser uma lista [ ... ].");
      var c = normalizarCopa(copa);
      var idsT = {}, idsJ = {};

      c.times.forEach(function (t, i) {
        var nome = t.id || "(time nº " + (i + 1) + ")";
        if (typeof t.id !== "string" || !t.id) avisos.push("Time nº " + (i + 1) + " está sem 'id'.");
        else if (idsT[t.id]) avisos.push("Time com id duplicado: \"" + t.id + "\".");
        else idsT[t.id] = true;
        if (!t.nome) avisos.push("Time \"" + nome + "\" está sem 'nome'.");
        if (typeof t.sigla !== "string" || !t.sigla.trim()) avisos.push("Time \"" + nome + "\" está sem 'sigla' (2 a 4 letras).");
        else if (t.sigla.trim().length < 2 || t.sigla.trim().length > 4) avisos.push("Time \"" + nome + "\" tem sigla \"" + t.sigla + "\" com tamanho inválido (use 2 a 4 letras).");
        if (GRUPOS.indexOf(t.grupo) === -1) avisos.push("Time \"" + nome + "\" tem grupo inválido: \"" + t.grupo + "\" (use A, B, C ou D).");
        if (CORES.indexOf(t.cor) === -1) avisos.push("Time \"" + nome + "\" tem cor fora da paleta: \"" + t.cor + "\" (use " + CORES.join(", ") + ").");
      });
      GRUPOS.forEach(function (g) {
        var n = c.times.filter(function (t) { return t.grupo === g; }).length;
        if (n > 0 && n !== 3) avisos.push("O Grupo " + g + " tem " + n + " times (deveriam ser 3).");
      });

      c.jogos.forEach(function (j, i) {
        var nome = j.id || "(jogo nº " + (i + 1) + ")";
        if (typeof j.id !== "string" || !j.id) avisos.push("Jogo nº " + (i + 1) + " está sem 'id'.");
        else if (idsJ[j.id]) avisos.push("Jogo com id duplicado: \"" + j.id + "\".");
        else idsJ[j.id] = true;
      });
      c.jogos.forEach(function (j) {
        var nome = j.id || "(sem id)";
        if (FASES.indexOf(j.fase) === -1) avisos.push("Jogo " + nome + " tem fase inválida: \"" + j.fase + "\".");
        if (j.fase === "grupos" && GRUPOS.indexOf(j.grupo) === -1) avisos.push("Jogo " + nome + " está sem grupo válido.");
        if (STATUS.indexOf(j.status) === -1) avisos.push("Jogo " + nome + " tem status inválido: \"" + j.status + "\" (use " + STATUS.join(", ") + ").");
        if (j.status === "encerrado" && !placarValido(j.placar)) avisos.push("Jogo " + nome + " está \"encerrado\" mas sem placar válido.");
        if (j.placar !== null && j.placar !== undefined && !placarValido(j.placar)) avisos.push("Jogo " + nome + " tem placar inválido (use números inteiros).");
        if (j.data !== null && j.data !== undefined && !paraData(j.data)) avisos.push("Jogo " + nome + " tem data inválida: \"" + j.data + "\" (formato: 2026-10-24T14:00:00-03:00).");
        if (j.dataOriginal !== undefined && !paraData(j.dataOriginal)) avisos.push("Jogo " + nome + " tem dataOriginal inválida: \"" + j.dataOriginal + "\".");
        if (j.wo !== undefined && j.wo !== "mandante" && j.wo !== "visitante") avisos.push("Jogo " + nome + " tem 'wo' inválido (use \"mandante\" ou \"visitante\").");
        ["mandante", "visitante"].forEach(function (lado) {
          var ref = j[lado];
          var tipo = tipoRef(ref);
          if (tipo === "time" && !idsT[ref]) avisos.push("Jogo " + nome + ": time inexistente em " + lado + ": \"" + ref + "\".");
          if (tipo === "vencedor" && !idsJ[ref.vencedorDe]) avisos.push("Jogo " + nome + ": " + lado + " aponta para jogo inexistente \"" + ref.vencedorDe + "\".");
          if (tipo === "perdedor" && !idsJ[ref.perdedorDe]) avisos.push("Jogo " + nome + ": " + lado + " aponta para jogo inexistente \"" + ref.perdedorDe + "\".");
          if (tipo === "colocado" && rotuloParticipante(ref) === "A definir") avisos.push("Jogo " + nome + ": vaga de grupo inválida em " + lado + ".");
          if (tipo === "invalido") avisos.push("Jogo " + nome + ": " + lado + " inválido.");
        });
      });

      // ciclos de referência vencedorDe/perdedorDe
      var idxJ = indexarJogos(c.jogos);
      var estado = {};
      var ciclo = null;
      function dependencias(j) {
        return [j.mandante, j.visitante].map(function (r) {
          var t = tipoRef(r);
          return t === "vencedor" ? r.vencedorDe : t === "perdedor" ? r.perdedorDe : null;
        }).filter(function (x) { return x && idxJ[x]; });
      }
      function visitar(id) {
        if (ciclo) return;
        estado[id] = 1;
        dependencias(idxJ[id]).forEach(function (d) {
          if (estado[d] === 1) ciclo = ciclo || id + " ↔ " + d;
          else if (!estado[d]) visitar(d);
        });
        estado[id] = 2;
      }
      Object.keys(idxJ).forEach(function (id) { if (!estado[id]) visitar(id); });
      if (ciclo) avisos.push("Há um ciclo de referências entre jogos (" + ciclo + ").");

      if (copa.destaque !== undefined && copa.destaque !== null) {
        if (typeof copa.destaque !== "object" || !Array.isArray(copa.destaque.jogos)) {
          avisos.push("'destaque' precisa ter a lista de jogos, ex.: jogos: [\"C3\", \"D3\"].");
        } else {
          var idsDestaque = {};
          (copa.jogos || []).forEach(function (j) { if (j) idsDestaque[j.id] = true; });
          copa.destaque.jogos.forEach(function (id) {
            if (!idsDestaque[id]) avisos.push("'destaque' aponta para jogo inexistente \"" + id + "\".");
          });
        }
      }
      if (copa.patrocinadores !== undefined && !Array.isArray(copa.patrocinadores)) {
        avisos.push("'patrocinadores' precisa ser uma lista [ ... ].");
      } else {
        (copa.patrocinadores || []).forEach(function (p, i) {
          if (p && p.categoria !== undefined && CATEGORIAS_PATROCINIO.indexOf(p.categoria) === -1) {
            avisos.push("Patrocinador \"" + (p.nome || p.id || i + 1) + "\" tem categoria inválida \"" + p.categoria + "\" (use organizacao, oficial, apoio ou parceiro).");
          }
          var nome = p && p.nome ? p.nome : "nº " + (i + 1);
          if (!p || typeof p !== "object") { avisos.push("Patrocinador nº " + (i + 1) + " está mal escrito."); return; }
          if (!p.nome) avisos.push("Patrocinador nº " + (i + 1) + " está sem 'nome'.");
          if (typeof p.logo !== "string" || !p.logo.trim()) avisos.push("Patrocinador \"" + nome + "\" está sem 'logo'.");
          else if (/^(\/|[a-z]+:)/i.test(p.logo.trim())) avisos.push("Patrocinador \"" + nome + "\" tem logo \"" + p.logo + "\" com caminho absoluto (use img/patrocinadores/arquivo.webp).");
          if (p.link !== undefined && p.link !== "" && !linkSeguro(p.link)) avisos.push("Patrocinador \"" + nome + "\" tem link inválido \"" + p.link + "\" (comece com https://).");
        });
      }

      c.avisos.forEach(function (a, i) {
        if (!formatarDataAviso(a.data)) avisos.push("Aviso nº " + (i + 1) + " tem data inválida (use \"2026-10-20\").");
        if (!a.titulo) avisos.push("Aviso nº " + (i + 1) + " está sem título.");
      });
    } catch (e) {
      avisos.push("Não foi possível validar os dados: " + (e && e.message ? e.message : e));
    }
    return avisos;
  }

  window.Logica = {
    paraData: paraData,
    formatarData: formatarData,
    formatarDiaSemana: formatarDiaSemana,
    formatarDiaSemanaExtenso: formatarDiaSemanaExtenso,
    formatarHora: formatarHora,
    formatarDataAviso: formatarDataAviso,
    iniciais: iniciais,
    corDoSelo: corDoSelo,
    CORES: CORES.slice(),
    GRUPOS: GRUPOS.slice(),
    indexarTimes: indexarTimes,
    placarValido: placarValido,
    rotuloParticipante: rotuloParticipante,
    vencedorEPerdedor: vencedorEPerdedor,
    statusExibido: statusExibido,
    formatarPlacar: formatarPlacar,
    resolverTimes: resolverTimes,
    timesPossiveis: timesPossiveis,
    calcularClassificacao: calcularClassificacao,
    grupoCompleto: grupoCompleto,
    colocado: colocado,
    proximoJogo: proximoJogo,
    destaqueManual: destaqueManual,
    agruparPatrocinadores: agruparPatrocinadores,
    ultimosResultados: ultimosResultados,
    partesContagem: partesContagem,
    campeao: campeao,
    filtrarJogos: filtrarJogos,
    jogosDoTime: jogosDoTime,
    agruparPorRodadaEData: agruparPorRodadaEData,
    lerFiltros: lerFiltros,
    ordenarAvisos: ordenarAvisos,
    listarPatrocinadores: listarPatrocinadores,
    validarDados: validarDados
  };
})();
