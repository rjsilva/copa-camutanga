/* Copa Camutanga — paginas.js
   Camada de DOM: lê o relógio e a URL, chama Logica/Componentes e insere o HTML.
   Inicializa a página conforme <body data-pagina="...">. Não expõe nada globalmente. */
(function () {
  "use strict";

  var L = window.Logica;
  var C = window.Componentes;

  // ---------------------------------------------------------------- relógio (?agora= simula a data)
  var inicio = Date.now();
  var agoraSimulado = (function () {
    try {
      var p = new URLSearchParams(location.search).get("agora");
      var d = p ? new Date(p) : null;
      return d && !isNaN(d.getTime()) ? d.getTime() : null;
    } catch (e) { return null; }
  })();
  function agora() {
    return new Date(agoraSimulado === null ? Date.now() : agoraSimulado + (Date.now() - inicio));
  }

  // pasta onde está a página (funciona em file://, GitHub Pages em subpasta e Netlify)
  function urlBase() {
    return location.href.split("#")[0].split("?")[0].replace(/[^/]*$/, "");
  }

  function $(sel) { return document.querySelector(sel); }

  function renderizarSecao(el, fnHtml) {
    if (!el) return;
    try {
      el.innerHTML = fnHtml();
    } catch (erro) {
      el.innerHTML = "<p class=\"mensagem\">Não foi possível exibir esta seção.</p>";
      if (window.console) console.error(erro);
    }
  }

  function copa() { return window.COPA; }

  // ---------------------------------------------------------------- validação dos dados
  function verificarDados() {
    var main = $("main");
    if (!copa()) {
      if (main) main.insertAdjacentHTML("afterbegin", "<p class=\"faixa-dados\" role=\"status\">Não foi possível carregar os dados da Copa.</p>");
      return false;
    }
    var avisos = L.validarDados(copa());
    if (avisos.length) {
      avisos.forEach(function (a) { console.warn("[dados.js] " + a); });
      if (location.protocol === "file:" && main) {
        main.insertAdjacentHTML("afterbegin", "<div class=\"container\"><p class=\"faixa-dados\" role=\"status\">Há " + avisos.length +
          " dado(s) inconsistente(s) em js/dados.js — veja o console (F12). Primeiro: " + C.escaparHtml(avisos[0]) + "</p></div>");
      }
    }
    return true;
  }

  // ---------------------------------------------------------------- copiar link
  var regiaoAviso;
  var temporizador;
  function avisar(html) {
    if (!regiaoAviso) {
      regiaoAviso = document.createElement("div");
      regiaoAviso.className = "aviso-copia";
      regiaoAviso.setAttribute("aria-live", "polite");
      regiaoAviso.setAttribute("role", "status");
      document.body.appendChild(regiaoAviso);
    }
    clearTimeout(temporizador);
    regiaoAviso.innerHTML = html;
    return regiaoAviso;
  }
  function copiarManual(url) {
    var r = avisar("Pressione Ctrl+C para copiar o link:<input type=\"text\" readonly aria-label=\"Link para copiar\" value=\"" + C.escaparHtml(url) + "\">");
    var campo = r.querySelector("input");
    campo.focus();
    campo.select();
    temporizador = setTimeout(function () { r.innerHTML = ""; }, 12000);
  }
  function copiar(url) {
    if (navigator.clipboard && window.isSecureContext !== false) {
      navigator.clipboard.writeText(url).then(function () {
        avisar("Link copiado!");
        temporizador = setTimeout(function () { regiaoAviso.innerHTML = ""; }, 2500);
      }, function () { copiarManual(url); });
    } else {
      copiarManual(url);
    }
  }
  document.addEventListener("click", function (ev) {
    var botao = ev.target.closest ? ev.target.closest("[data-copiar]") : null;
    if (!botao) return;
    ev.preventDefault();
    var url = botao.getAttribute("data-copiar") === "pagina" ? location.href : botao.getAttribute("data-copiar");
    copiar(url);
  });

  function focarHash() {
    var id = decodeURIComponent((location.hash || "").slice(1));
    if (!id) return;
    var alvo = document.getElementById(id);
    if (!alvo) return;
    alvo.classList.add("destacado");
    alvo.scrollIntoView({ block: "center" });
    alvo.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------- Início
  var intervalo;
  function iniciarInicio() {
    var destaque = $("#destaque");
    function desenharDestaque() {
      var jogos = L.resolverTimes(copa());
      var manual = L.destaqueManual(copa(), jogos);
      var titulo = $("#titulo-destaque");
      if (manual) {
        if (titulo) titulo.textContent = manual.titulo;
        renderizarSecao(destaque, function () { return C.destaqueRodada(manual, agora()); });
        return null;
      }
      if (titulo) titulo.textContent = "Próximo jogo";
      var res = L.proximoJogo(jogos, agora());
      renderizarSecao(destaque, function () { return C.contagemRegressiva(res, agora()); });
      return res;
    }
    desenharDestaque();
    clearInterval(intervalo);
    intervalo = setInterval(function () {
      var listas = destaque ? destaque.querySelectorAll(".contador[data-alvo]") : [];
      if (!listas.length) { clearInterval(intervalo); return; }
      var terminou = false;
      Array.prototype.forEach.call(listas, function (ul) {
        var p = L.partesContagem(ul.getAttribute("data-alvo"), agora());
        if (p.terminou) terminou = true;
        else ul.innerHTML = C.partesHtml(p);
      });
      if (terminou) { clearInterval(intervalo); desenharDestaque(); iniciarContadorSeHouver(); }
    }, 1000);

    function iniciarContadorSeHouver() {
      if (destaque && destaque.querySelector(".contador[data-alvo]")) iniciarInicio();
    }

    renderizarSecao($("#aviso-importante"), function () {
      var imp = L.ordenarAvisos(copa().avisos).filter(function (a) { return a.importante; })[0];
      return imp ? C.cardAviso(imp, "h3") : "";
    });
    var secaoPatro = $("#patrocinadores");
    renderizarSecao($("#lista-patrocinadores"), function () {
      var lista = L.listarPatrocinadores(copa());
      if (secaoPatro) secaoPatro.hidden = !lista.length;
      return C.gradePatrocinadores(lista);
    });
    renderizarSecao($("#ultimos-resultados"), function () {
      var ult = L.ultimosResultados(L.resolverTimes(copa()), 4);
      return ult.length
        ? "<div class=\"grade-resultados\">" + ult.map(C.cardResultado).join("") + "</div>"
        : "<p class=\"mensagem\">Nenhum resultado lançado ainda.</p>";
    });
  }

  // ---------------------------------------------------------------- Tabela
  function iniciarTabela() {
    var lista = $("#lista-jogos");
    var selGrupo = $("#filtro-grupo");
    var selTime = $("#filtro-time");
    var form = $("#filtros");
    var timesOrdenados = (copa().times || []).slice().sort(function (a, b) { return String(a.nome).localeCompare(String(b.nome), "pt-BR"); });
    if (selTime) {
      selTime.insertAdjacentHTML("beforeend", timesOrdenados.map(function (t) {
        return "<option value=\"" + C.escaparHtml(t.id) + "\">" + C.escaparHtml(t.nome) + " (Grupo " + C.escaparHtml(t.grupo) + ")</option>";
      }).join(""));
    }
    var filtros = L.lerFiltros(location.search, copa());
    if (selGrupo) selGrupo.value = filtros.grupo || "";
    if (selTime) selTime.value = filtros.time || "";

    function desenhar() {
      renderizarSecao(lista, function () {
        var jogos = L.resolverTimes(copa());
        var itens = L.filtrarJogos(jogos, filtros);
        if (!itens.length) return "<p class=\"mensagem\">Nenhum jogo encontrado com esses filtros.</p>";
        return C.listaPorRodada(L.agruparPorRodadaEData(itens), { agora: agora(), urlBase: urlBase() });
      });
    }
    function atualizarUrl() {
      var p = new URLSearchParams();
      if (filtros.grupo) p.set("grupo", filtros.grupo);
      if (filtros.time) p.set("time", filtros.time);
      var q = p.toString();
      try { history.replaceState(null, "", location.pathname + (q ? "?" + q : "")); } catch (e) { /* file:// em alguns navegadores */ }
    }
    function aoMudar() {
      filtros = L.lerFiltros("?grupo=" + encodeURIComponent(selGrupo.value) + "&time=" + encodeURIComponent(selTime.value), copa());
      atualizarUrl();
      desenhar();
    }
    if (form) {
      selGrupo.addEventListener("change", aoMudar);
      selTime.addEventListener("change", aoMudar);
      form.addEventListener("submit", function (ev) { ev.preventDefault(); });
      $("#limpar-filtros").addEventListener("click", function () {
        selGrupo.value = ""; selTime.value = "";
        aoMudar();
        selGrupo.focus();
      });
    }
    desenhar();
    focarHash();
    window.addEventListener("hashchange", focarHash);
  }

  // ---------------------------------------------------------------- Classificação
  function iniciarClassificacao() {
    renderizarSecao($("#classificacao"), function () {
      var mapa = L.indexarTimes(copa().times);
      return "<div class=\"grade-classificacao\">" + L.GRUPOS.map(function (g) {
        return C.tabelaClassificacao(g, L.calcularClassificacao(copa(), g), mapa);
      }).join("") + "</div>";
    });
  }

  // ---------------------------------------------------------------- Times
  function iniciarTimes() {
    var id = new URLSearchParams(location.search).get("id");
    var area = $("#times");
    var titulo = $("#titulo-times");
    if (!id) {
      renderizarSecao(area, function () {
        return L.GRUPOS.map(function (g) {
          var doGrupo = copa().times.filter(function (t) { return t.grupo === g; });
          return "<section class=\"grupo-times\" aria-labelledby=\"grupo-" + g + "\"><h2 id=\"grupo-" + g + "\">Grupo " + g + "</h2>" +
            "<div class=\"grade-times\">" + doGrupo.map(C.cardTime).join("") + "</div></section>";
        }).join("");
      });
      return;
    }
    var time = L.indexarTimes(copa().times)[id];
    if (!time) {
      if (titulo) titulo.textContent = "Time não encontrado";
      document.title = "Time não encontrado — Copa Camutanga Open de Futebol";
      renderizarSecao(area, function () {
        return "<p class=\"mensagem\">Não encontramos esse time. <a href=\"times.html\">Ver todos os times</a></p>";
      });
      return;
    }
    if (titulo) titulo.remove();
    document.title = time.nome + " — Copa Camutanga Open de Futebol";
    renderizarSecao(area, function () {
      var linha = L.calcularClassificacao(copa(), time.grupo).filter(function (l) { return l.timeId === time.id; })[0];
      var itens = L.jogosDoTime(L.resolverTimes(copa()), time.id);
      return C.detalheTime(time, linha, itens, { agora: agora(), urlBase: urlBase() });
    });
  }

  // ---------------------------------------------------------------- Fase final
  function iniciarFaseFinal() {
    renderizarSecao($("#chaveamento"), function () {
      var jogos = L.resolverTimes(copa());
      var mm = jogos.filter(function (j) { return j.fase !== "grupos"; });
      var res = L.proximoJogo(jogos, agora());
      return (res.campeao ? C.campeaoHtml(res.campeao) : "") + C.chaveamento(mm);
    });
  }

  // ---------------------------------------------------------------- Avisos
  function iniciarAvisos() {
    renderizarSecao($("#avisos"), function () {
      var lista = L.ordenarAvisos(copa().avisos);
      return lista.length
        ? "<div class=\"lista-avisos\">" + lista.map(function (a) { return C.cardAviso(a, "h2"); }).join("") + "</div>"
        : "<p class=\"mensagem\">Nenhum aviso no momento.</p>";
    });
  }

  // ---------------------------------------------------------------- despacho
  function iniciar() {
    if (!verificarDados()) return;
    var paginas = {
      "inicio": iniciarInicio,
      "tabela": iniciarTabela,
      "classificacao": iniciarClassificacao,
      "times": iniciarTimes,
      "fase-final": iniciarFaseFinal,
      "avisos": iniciarAvisos,
      "regulamento": function () {}
    };
    var fn = paginas[document.body.dataset.pagina];
    if (fn) {
      try { fn(); } catch (erro) { console.error(erro); }
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
