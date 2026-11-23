/* Copa Camutanga — componentes.js
   Funções que devolvem strings HTML (template strings). Não acessam o DOM nem location.
   Todo texto vindo dos dados passa por escaparHtml. Exposto como window.Componentes. */
(function () {
  "use strict";

  var L = window.Logica;

  function escaparHtml(texto) {
    return String(texto === null || texto === undefined ? "" : texto).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c];
    });
  }
  var e = escaparHtml;

  var ROTULO_STATUS = {
    "agendado": "Agendado",
    "ao-vivo": "Ao vivo",
    "encerrado": "Encerrado",
    "adiado": "Adiado — nova data a definir",
    "aguardando-resultado": "Aguardando resultado",
    "data-a-definir": "Data a definir"
  };
  var ROTULO_FASE = { quartas: "Quartas", semifinal: "Semifinal", final: "Final" };

  // comNomeAoLado: o nome do time já aparece junto → imagem decorativa (alt="") para não repetir
  function escudoTime(time, tamanho, comNomeAoLado) {
    var t = tamanho || 32;
    if (!time) return "";
    if (time.escudo) {
      var alt = comNomeAoLado ? "" : "Escudo do " + e(time.nome);
      return "<img class=\"escudo\" src=\"" + e(time.escudo) + "\" alt=\"" + alt +
        "\" width=\"" + t + "\" height=\"" + t + "\" loading=\"lazy\">";
    }
    var sigla = time.sigla || L.iniciais(time.nome);
    return "<span class=\"selo-time\" aria-hidden=\"true\" style=\"width:" + t + "px;height:" + t +
      "px;font-size:" + Math.round(t * 0.36) + "px;background:var(--" + L.corDoSelo(time.cor) + ")\">" + e(sigla) + "</span>";
  }

  function participante(r, opcoes) {
    var o = opcoes || {};
    if (r && r.tipo === "time") {
      var nome = "<span class=\"nome-time\">" + e(r.time.nome) + "</span>";
      var esc = escudoTime(r.time, o.tamanho || 32, true);
      return o.escudoDepois ? nome + esc : esc + nome;
    }
    return "<span class=\"pendente\">" + e(r ? r.rotulo : "A definir") + "</span>";
  }

  function faixaRodada(titulo) {
    return "<h2 class=\"faixa faixa-rodada\">" + e(titulo) + "</h2>";
  }

  function faixaData(iso) {
    var texto = iso ? (L.formatarDiaSemanaExtenso(iso) + " " + L.formatarData(iso)) : "Data a definir";
    return "<h3 class=\"faixa faixa-data\">" + e(texto) + "</h3>";
  }

  function botaoCopiarLink(url, rotulo, classe) {
    return "<button type=\"button\" class=\"botao-copiar" + (classe ? " " + classe : "") + "\" data-copiar=\"" + e(url) +
      "\" aria-label=\"" + e(rotulo) + "\">🔗 Copiar link</button>";
  }

  function mostraPlacar(j) {
    return (j.status === "encerrado" || j.status === "ao-vivo") && L.placarValido(j.placar);
  }

  function placarHtml(j) {
    if (!mostraPlacar(j)) return "<span class=\"lj-placar vazio\" aria-label=\"contra\">x</span>";
    var p = j.placar;
    var extra = [];
    if (p.mandante === p.visitante && p.penaltis && L.placarValido(p.penaltis)) extra.push("pên. " + p.penaltis.mandante + " x " + p.penaltis.visitante);
    if (j.wo) extra.push("W.O.");
    return "<span class=\"lj-placar\" aria-label=\"Placar " + e(L.formatarPlacar(j)) + "\">" + p.mandante + " x " + p.visitante +
      (extra.length ? "<small>" + e(extra.join(" · ")) + "</small>" : "") + "</span>";
  }

  // opcoes: { possivel, agora, urlBase }
  function linhaJogo(j, opcoes) {
    var o = opcoes || {};
    var status = L.statusExibido(j, o.agora || new Date(0));
    var hora = j.data
      ? "<time datetime=\"" + e(j.data) + "\">" + e(L.formatarHora(j.data)) + "</time><small>" + e(L.formatarDiaSemana(j.data) + " " + L.formatarData(j.data)) + "</small>"
      : "<span>A definir</span>";
    var grupo = j.fase === "grupos" ? "Grupo " + e(j.grupo) : e(ROTULO_FASE[j.fase] || "Fase final");
    var vencM = j.vencedorId && j.mandanteR.tipo === "time" && j.mandanteR.time.id === j.vencedorId;
    var vencV = j.vencedorId && j.visitanteR.tipo === "time" && j.visitanteR.time.id === j.vencedorId;
    var selos = ["<span class=\"selo selo-" + status + "\">" + e(ROTULO_STATUS[status]) + "</span>"];
    if (j.dataOriginal) selos.push("<span class=\"selo selo-remarcado\">Remarcado — era " + e(L.formatarData(j.dataOriginal)) + "</span>");
    if (o.possivel) selos.push("<span class=\"selo selo-possivel\">Jogo possível — depende de resultado</span>");
    if (j.observacao) selos.push("<span class=\"lj-obs\">" + e(j.observacao) + "</span>");
    if (j.local) selos.push("<span class=\"lj-local\">Local: " + e(j.local) + "</span>");
    if (o.urlBase !== undefined) selos.push(botaoCopiarLink(o.urlBase + "tabela.html#jogo-" + j.id, "Copiar link do jogo " + j.id));
    return "<article class=\"linha-jogo\" id=\"jogo-" + e(j.id) + "\" tabindex=\"-1\" aria-label=\"Jogo " + e(j.id) + "\">" +
      "<div class=\"lj-hora\">" + hora + "</div>" +
      "<div class=\"lj-grupo\">" + grupo + "<small>Jogo " + e(j.id) + "</small></div>" +
      "<div class=\"lj-card\">" +
        "<div class=\"lj-confronto\">" +
          "<span class=\"lj-time lj-mandante" + (vencM ? " vencedor" : "") + "\">" + participante(j.mandanteR, { escudoDepois: true }) + "</span>" +
          placarHtml(j) +
          "<span class=\"lj-time lj-visitante" + (vencV ? " vencedor" : "") + "\">" + participante(j.visitanteR) + "</span>" +
        "</div>" +
        "<div class=\"lj-info\">" + selos.join("") + "</div>" +
      "</div>" +
    "</article>";
  }

  // grupos: saída de Logica.agruparPorRodadaEData
  function listaPorRodada(grupos, opcoes) {
    return grupos.map(function (g) {
      return "<section class=\"bloco-rodada\" aria-label=\"" + e(g.titulo) + "\">" + faixaRodada(g.titulo) +
        g.datas.map(function (d) {
          return faixaData(d.iso) + "<div class=\"lista-jogos\">" + d.itens.map(function (it) {
            return linhaJogo(it.jogo, Object.assign({}, opcoes, { possivel: it.possivel }));
          }).join("") + "</div>";
        }).join("") + "</section>";
    }).join("");
  }

  function tabelaClassificacao(grupo, linhas, mapaTimes) {
    var temSorteio = linhas.some(function (l) { return l.aguardandoSorteio; });
    var corpo = linhas.map(function (l) {
      var t = mapaTimes[l.timeId];
      return "<tr class=\"" + (l.posicao <= 2 ? "zona" : "") + "\">" +
        "<td>" + l.posicao + "º</td>" +
        "<th scope=\"row\"><span class=\"celula-time\">" + escudoTime(t, 28, true) +
          "<a href=\"times.html?id=" + encodeURIComponent(l.timeId) + "\">" + e(l.nome) + "</a>" +
          (l.aguardandoSorteio ? " *" : "") + "</span></th>" +
        "<td>" + l.j + "</td><td>" + l.v + "</td><td>" + l.e + "</td><td>" + l.d + "</td>" +
        "<td>" + l.gp + "</td><td>" + l.gc + "</td><td>" + (l.sg > 0 ? "+" : "") + l.sg + "</td>" +
        "<td class=\"pts\">" + l.pts + "</td></tr>";
    }).join("");
    return "<div class=\"bloco-classificacao\"><table class=\"tabela-classificacao\">" +
      "<caption>Grupo " + e(grupo) + "</caption>" +
      "<thead><tr>" +
        "<th scope=\"col\"><abbr title=\"Posição\">Pos</abbr></th><th scope=\"col\">Time</th>" +
        "<th scope=\"col\"><abbr title=\"Jogos\">J</abbr></th><th scope=\"col\"><abbr title=\"Vitórias\">V</abbr></th>" +
        "<th scope=\"col\"><abbr title=\"Empates\">E</abbr></th><th scope=\"col\"><abbr title=\"Derrotas\">D</abbr></th>" +
        "<th scope=\"col\"><abbr title=\"Gols pró\">GP</abbr></th><th scope=\"col\"><abbr title=\"Gols contra\">GC</abbr></th>" +
        "<th scope=\"col\"><abbr title=\"Saldo de gols\">SG</abbr></th><th scope=\"col\"><abbr title=\"Pontos\">Pts</abbr></th>" +
      "</tr></thead><tbody>" + corpo + "</tbody></table>" +
      (temSorteio ? "<p class=\"nota-sorteio\">* Empate — aguardando sorteio.</p>" : "") + "</div>";
  }

  function confrontoDestaque(j) {
    return "<div class=\"destaque-confronto\">" +
      "<span class=\"lado\">" + participante(j.mandanteR, { tamanho: 56, escudoDepois: true }) + "</span>" +
      "<span class=\"versus\">" + (mostraPlacar(j) ? e(j.placar.mandante + " x " + j.placar.visitante) : "x") + "</span>" +
      "<span class=\"lado\">" + participante(j.visitanteR, { tamanho: 56 }) + "</span>" +
    "</div>";
  }

  function infoJogo(j) {
    var partes = [];
    if (j.data) partes.push(L.formatarDiaSemanaExtenso(j.data) + ", " + L.formatarData(j.data) + " às " + L.formatarHora(j.data));
    else partes.push("Data a definir");
    partes.push(j.fase === "grupos" ? "Grupo " + j.grupo : (ROTULO_FASE[j.fase] || "Fase final"));
    if (j.local) partes.push(j.local);
    return "<p class=\"destaque-info\">" + e(partes.join(" · ")) + "</p>";
  }

  function partesHtml(p) {
    function item(n, rot) { return "<li><strong>" + String(n).padStart(2, "0") + "</strong><span>" + rot + "</span></li>"; }
    return item(p.dias, p.dias === 1 ? "dia" : "dias") + item(p.horas, "horas") + item(p.minutos, "min") + item(p.segundos, "seg");
  }

  function blocoContagem(j, agora) {
    return "<ul class=\"contador\" aria-hidden=\"true\" data-alvo=\"" + e(j.data) + "\">" + partesHtml(L.partesContagem(j.data, agora)) + "</ul>" +
      "<p class=\"destaque-legenda\">Começa em " + e(L.formatarData(j.data)) + " às " + e(L.formatarHora(j.data)) + " (horário de Recife)</p>";
  }

  function campeaoHtml(time) {
    return "<div class=\"campeao\"><img src=\"img/logo.svg\" alt=\"\" width=\"110\" height=\"128\">" +
      "<span class=\"titulo\">Campeão da Copa Camutanga 2026</span><span class=\"nome\">" + e(time.nome) + "</span></div>";
  }

  // res: saída de Logica.proximoJogo
  function contagemRegressiva(res, agora) {
    if (!res) return "";
    if (res.modo === "nenhum") {
      if (res.campeao) return campeaoHtml(res.campeao);
      var msg = res.mataMataIniciado ? "Aguardando a definição dos próximos jogos" : "Fase de grupos encerrada — aguarde a fase final";
      return "<div class=\"destaque\"><span class=\"destaque-rotulo\">Copa Camutanga</span><p class=\"destaque-mensagem\">" + e(msg) + "</p>" +
        "<p class=\"destaque-legenda\"><a href=\"fase-final.html\">Ver a fase final</a> · <a href=\"classificacao.html\">Ver a classificação</a></p></div>";
    }
    var j = res.jogo;
    var rotulo = { "ao-vivo": "Ao vivo", "aguardando-resultado": "Aguardando resultado", "proximo": "Próximo jogo" }[res.modo];
    var html = "<div class=\"destaque\"><span class=\"destaque-rotulo" + (res.modo === "ao-vivo" ? " ao-vivo" : "") + "\">" + e(rotulo) + "</span>" +
      infoJogo(j) + confrontoDestaque(j);
    if (res.modo === "proximo") html += blocoContagem(j, agora);
    if (res.modo !== "proximo" && res.seguinte) {
      html += "<div class=\"destaque-seguinte\"><h3>Depois: " + e(nomeConfronto(res.seguinte)) + "</h3>" + blocoContagem(res.seguinte, agora) + "</div>";
    }
    html += "<p class=\"destaque-legenda\"><a href=\"tabela.html#jogo-" + e(j.id) + "\">Ver na tabela</a></p>";
    return html + "</div>";
  }

  function nomeLado(r) { return r && r.tipo === "time" ? r.time.nome : (r ? r.rotulo : "A definir"); }
  function nomeConfronto(j) { return nomeLado(j.mandanteR) + " x " + nomeLado(j.visitanteR); }

  function cardResultado(j) {
    var meta = (j.data ? L.formatarDiaSemana(j.data) + " " + L.formatarData(j.data) + " · " : "") +
      (j.fase === "grupos" ? "Grupo " + j.grupo : (ROTULO_FASE[j.fase] || "")) + " · Jogo " + j.id;
    return "<a class=\"card-resultado\" href=\"tabela.html#jogo-" + e(j.id) + "\">" +
      "<span class=\"cr-meta\">" + e(meta) + "</span>" +
      "<span class=\"cr-time\">" + e(nomeLado(j.mandanteR)) + "</span>" +
      "<span class=\"cr-placar\">" + e(L.formatarPlacar(j)) + "</span>" +
      "<span class=\"cr-time\">" + e(nomeLado(j.visitanteR)) + "</span></a>";
  }

  function paragrafos(texto) {
    return String(texto || "").split(/\n+/).filter(Boolean).map(function (p) { return "<p>" + e(p) + "</p>"; }).join("");
  }

  function cardAviso(aviso, nivelTitulo) {
    var h = nivelTitulo || "h2";
    var iso = /^\d{4}-\d{2}-\d{2}$/.test(aviso.data || "") ? aviso.data : "";
    return "<article class=\"card-aviso\"><header>" +
      "<time" + (iso ? " datetime=\"" + e(iso) + "\"" : "") + ">" + e(L.formatarDataAviso(aviso.data)) + "</time>" +
      (aviso.importante ? "<span class=\"selo selo-importante\">Importante</span>" : "") +
      "</header><" + h + ">" + e(aviso.titulo) + "</" + h + ">" + paragrafos(aviso.texto) + "</article>";
  }

  function cardTime(time) {
    return "<a class=\"card-time\" href=\"times.html?id=" + encodeURIComponent(time.id) + "\">" + escudoTime(time, 64, true) +
      "<span class=\"ct-texto\"><strong>" + e(time.nome) + "</strong><span class=\"ct-grupo\">Grupo " + e(time.grupo) + "</span></span></a>";
  }

  function detalheTime(time, linha, itens, opcoes) {
    var numeros = linha
      ? "<ul class=\"numeros-time\">" +
          [["Posição", linha.posicao + "º"], ["Pontos", linha.pts], ["Jogos", linha.j], ["Vitórias", linha.v],
           ["Empates", linha.e], ["Derrotas", linha.d], ["Saldo", (linha.sg > 0 ? "+" : "") + linha.sg]]
            .map(function (p) { return "<li><strong>" + e(p[1]) + "</strong>" + e(p[0]) + "</li>"; }).join("") +
        "</ul>"
      : "";
    var jogos = itens.length
      ? "<div class=\"lista-jogos\">" + itens.map(function (it) {
          return linhaJogo(it.jogo, Object.assign({}, opcoes, { possivel: it.possivel }));
        }).join("") + "</div>"
      : "<p class=\"mensagem\">Nenhum jogo encontrado para este time.</p>";
    return "<div class=\"detalhe-time\">" + escudoTime(time, 140, true) +
      "<div><h1 class=\"titulo-pagina\">" + e(time.nome) + "</h1><p>Grupo " + e(time.grupo) + "</p></div></div>" +
      "<section class=\"secao\" aria-labelledby=\"titulo-classif-time\"><h2 id=\"titulo-classif-time\">Na classificação</h2>" + numeros + "</section>" +
      "<section class=\"secao\" aria-labelledby=\"titulo-jogos-time\"><h2 id=\"titulo-jogos-time\">Jogos</h2>" + jogos + "</section>" +
      "<p><a href=\"times.html\">← Ver todos os times</a></p>";
  }

  function linhaChave(r, gols, vencedor) {
    return "<div class=\"cc-linha" + (vencedor ? " vencedor" : "") + "\"><span class=\"lado\">" + participante(r, { tamanho: 24 }) + "</span>" +
      "<span class=\"gols\">" + (gols === null ? "" : e(gols)) + "</span></div>";
  }

  function cardChave(j) {
    var temPlacar = mostraPlacar(j);
    var p = j.placar || {};
    var pen = temPlacar && p.mandante === p.visitante && p.penaltis && L.placarValido(p.penaltis);
    var golsM = temPlacar ? p.mandante + (pen ? " (" + p.penaltis.mandante + ")" : "") : null;
    var golsV = temPlacar ? p.visitante + (pen ? " (" + p.penaltis.visitante + ")" : "") : null;
    var quando = j.data ? L.formatarDiaSemana(j.data) + " " + L.formatarData(j.data) + " · " + L.formatarHora(j.data) : "Data a definir";
    var mV = j.vencedorId && j.mandanteR.tipo === "time" && j.mandanteR.time.id === j.vencedorId;
    var vV = j.vencedorId && j.visitanteR.tipo === "time" && j.visitanteR.time.id === j.vencedorId;
    return "<a class=\"card-chave\" href=\"tabela.html#jogo-" + e(j.id) + "\" aria-label=\"Jogo " + e(j.id) + ": " + e(nomeConfronto(j)) + "\">" +
      "<span class=\"cc-meta\"><span>Jogo " + e(j.id) + "</span><span>" + e(quando) + "</span></span>" +
      linhaChave(j.mandanteR, golsM, mV) + linhaChave(j.visitanteR, golsV, vV) +
      (j.local ? "<span class=\"cc-local\">Local: " + e(j.local) + "</span>" : "") + "</a>";
  }

  // jogos: lista resolvida (só mata-mata)
  function chaveamento(jogos) {
    var colunas = [["quartas", "Quartas de Final"], ["semifinal", "Semifinais"], ["final", "Final"]];
    // ordem visual do chaveamento: QF1 e QF3 alimentam a SF1; QF2 e QF4, a SF2
    var ORDEM = ["QF1", "QF3", "QF2", "QF4", "SF1", "SF2", "F"];
    function pos(j) { var i = ORDEM.indexOf(j.id); return i === -1 ? 99 : i; }
    return "<div class=\"chaveamento\">" + colunas.map(function (c) {
      var daFase = jogos.filter(function (j) { return j.fase === c[0]; }).sort(function (a, b) { return pos(a) - pos(b); });
      return "<section class=\"coluna-fase\" aria-label=\"" + c[1] + "\"><h2>" + c[1] + "</h2><div class=\"jogos-fase\">" +
        (daFase.length ? daFase.map(cardChave).join("") : "<p class=\"mensagem\">A definir</p>") + "</div></section>";
    }).join("") + "</div>";
  }

  // lista: saída de Logica.listarPatrocinadores
  function gradePatrocinadores(lista) {
    if (!lista || !lista.length) return "";
    return "<ul class=\"grade-patrocinadores\">" + lista.map(function (p) {
      var img = "<img src=\"" + e(p.logo) + "\" alt=\"" + e(p.nome) + "\" width=\"200\" height=\"110\" loading=\"lazy\" decoding=\"async\">";
      var conteudo = p.link
        ? "<a href=\"" + e(p.link) + "\" target=\"_blank\" rel=\"noopener noreferrer\" title=\"" + e(p.nome) + " (abre em nova aba)\">" + img + "</a>"
        : img;
      return "<li class=\"card-patrocinador\">" + conteudo + "</li>";
    }).join("") + "</ul>";
  }

  window.Componentes = {
    gradePatrocinadores: gradePatrocinadores,
    escaparHtml: escaparHtml,
    escudoTime: escudoTime,
    faixaRodada: faixaRodada,
    faixaData: faixaData,
    linhaJogo: linhaJogo,
    listaPorRodada: listaPorRodada,
    tabelaClassificacao: tabelaClassificacao,
    contagemRegressiva: contagemRegressiva,
    partesHtml: partesHtml,
    campeaoHtml: campeaoHtml,
    cardResultado: cardResultado,
    cardAviso: cardAviso,
    cardTime: cardTime,
    detalheTime: detalheTime,
    chaveamento: chaveamento,
    botaoCopiarLink: botaoCopiarLink
  };
})();
