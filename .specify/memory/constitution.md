<!--
Sync Impact Report
- Version change: 1.0.0 → 1.1.0 (MINOR: ampliação material de orientação)
- Princípios modificados:
  II. Site Estático em Tecnologia Pura — `window.COPA` passa a incluir `patrocinadores`
  VII. Atualização Fácil pelo Organizador — trocar patrocinadores também só pelo js/dados.js
- Seções adicionadas/removidas: nenhuma
- Templates dependentes: não modificados (leem a constituição em tempo de execução)
- Artefatos da feature 001 a alinhar: contracts/dados-js.md, data-model.md (feito na mesma emenda)
- TODOs: nenhum
-->

# Site da Copa Camutanga Open de Futebol Constitution

## Core Principles

### I. Somente Desktop

- O site é projetado exclusivamente para telas de computador: largura mínima suportada de
  **1024px**, layout otimizado para **1280–1920px**.
- NÃO haverá versão mobile, layout responsivo para celular, media queries voltadas a telas
  pequenas, nem aplicativo.
- Abaixo de 1024px o site PODE exibir rolagem horizontal; não é defeito.

**Justificativa**: o público consulta tabela e jogos no computador; um único alvo de tela mantém
o projeto simples e reduz o trabalho de manutenção.

### II. Site Estático em Tecnologia Pura (NÃO NEGOCIÁVEL)

- O site é feito SOMENTE com **HTML5, CSS3 e JavaScript puro (vanilla, ES2020+)**.
- É PROIBIDO usar: frameworks (React, Vue, Svelte, Astro, Next etc.), bibliotecas de CSS
  (Tailwind, Bootstrap etc.), jQuery, TypeScript, npm/`package.json`, bundlers, transpiladores
  ou qualquer etapa de build.
- Não há backend, servidor de aplicação nem banco de dados.
- Os arquivos DEVEM funcionar abrindo o `index.html` diretamente no navegador (`file://`) e em
  qualquer hospedagem estática, sem configuração adicional.
- **Dados do campeonato**: times, jogos, resultados, avisos e patrocinadores ficam em um
  único arquivo `js/dados.js`, carregado com `<script>` comum (sem `type="module"`), que define
  `window.COPA = { times, jogos, avisos, patrocinadores }`.
- É PROIBIDO usar `fetch`/XHR para ler JSON local e ES modules (`import`/`export`), porque não
  funcionam via `file://`.
- Nenhuma funcionalidade essencial PODE depender de recurso externo (CDN, API); fontes e
  imagens DEVEM estar no próprio projeto.

**Justificativa**: qualquer pessoa consegue abrir, editar e hospedar o site sem ferramentas,
sem custos e sem risco de dependências quebrarem.

### III. Fidelidade à Identidade Visual

- O visual DEVE seguir a paleta e o estilo do cartaz oficial: **azul royal, azul-marinho,
  vermelho, branco e amarelo-ouro**.
- Títulos DEVEM usar tipografia **condensada, em caixa alta e itálica**.
- Toda cor DEVE vir de uma variável CSS da paleta (ver Princípio IX); cores avulsas fora da
  paleta exigem justificativa registrada no plano.

**Justificativa**: o site é a extensão digital do cartaz; consistência visual reforça a marca
do campeonato.

### IV. Performance

- Lighthouse (modo **desktop**) DEVE marcar **≥ 90** em Performance, Acessibilidade e SEO.
- O peso total transferido da página inicial (HTML, CSS, JS, fontes e imagens) DEVE ser
  **< 500 KB**.
- Imagens DEVEM ser otimizadas (formatos modernos como WebP/AVIF quando possível) e ter
  `width`/`height` declarados.

**Justificativa**: carregamento rápido mesmo em conexões fracas e boa indexação nas buscas.

### V. Acessibilidade

- Contraste mínimo **WCAG 2.1 AA** (4,5:1 para texto normal; 3:1 para texto grande) em todas as
  combinações de cor usadas.
- Toda imagem informativa DEVE ter `alt` descritivo; imagens decorativas usam `alt=""`.
- Todo elemento interativo DEVE ser operável por teclado, com foco visível e ordem de
  tabulação lógica.

**Justificativa**: o site deve servir a toda a comunidade, incluindo pessoas com deficiência.

### VI. Português do Brasil e Fuso de Recife

- Todo o conteúdo visível DEVE estar em **português do Brasil**; o HTML declara
  `<html lang="pt-BR">`.
- Datas exibidas no formato **DD/MM**; horários em formato 24h (ex.: `15h30` ou `15:30`),
  sempre no horário de **Brasília/Recife (UTC-3)**.
- A exibição de data/hora NÃO PODE depender do fuso do computador do visitante.

**Justificativa**: o público é local; datas e horários precisam ser inequívocos.

### VII. Atualização Fácil pelo Organizador

- Lançar um placar, adicionar um jogo, publicar um aviso ou trocar um patrocinador DEVE exigir
  edição **apenas** de `js/dados.js`, sem tocar em HTML, CSS ou outros arquivos JS.
- `js/dados.js` DEVE conter apenas dados (sem lógica), com estrutura simples, comentários em
  português e exemplos de como lançar um resultado.
- Classificação, confrontos de mata-mata e demais informações derivadas DEVEM ser calculados
  automaticamente a partir desses dados.

**Justificativa**: o organizador não é programador; uma única fonte de dados evita erros e
inconsistências.

### VIII. Testes no Navegador sem Framework

- A lógica de **classificação** e de **"vencedor/perdedor do jogo X"** DEVE ter testes
  automatizados em uma página `testes.html`, que roda abrindo-a no navegador.
- Os testes usam JavaScript puro, com um mini-executor próprio (sem Jest, Mocha, QUnit etc.),
  e exibem claramente na página quantos testes passaram e quais falharam.
- Os testes carregam os **mesmos arquivos de lógica** usados pelo site, com dados de teste
  próprios (não dependem do conteúdo real de `js/dados.js`).
- Toda alteração nessas regras DEVE vir acompanhada de testes atualizados, e `testes.html`
  DEVE estar 100% verde antes da publicação.

**Justificativa**: erros na tabela ou no chaveamento são os mais visíveis e os mais
contestados; testes simples evitam regressões sem violar o Princípio II.

### IX. Código Semântico e Organizado

- HTML DEVE usar elementos semânticos: `header`, `nav`, `main`, `section`, `article`, `table`
  (com `caption`/`th` e `scope`), `footer`.
- Cores (e demais tokens visuais, como fontes e espaçamentos) DEVEM ser definidas como
  **custom properties** em `:root`.
- O JavaScript DEVE separar **funções puras** (cálculos sobre os dados, sem acesso ao DOM nem a
  `window`) da **camada de renderização** (manipulação do DOM), em arquivos distintos.
- Funções puras recebem os dados por parâmetro e retornam novos valores, sem efeitos colaterais.

**Justificativa**: semântica favorece acessibilidade e SEO; a separação torna a lógica testável
no `testes.html` e o código fácil de entender.

## Restrições Técnicas e Estrutura de Arquivos

- Estrutura de referência (nomes além de `index.html`, `testes.html` e `js/dados.js` podem ser
  ajustados no plano, mantendo a separação de responsabilidades):
  - `index.html` (e demais páginas `.html`, se houver)
  - `testes.html`
  - `css/` — folhas de estilo com as variáveis da paleta
  - `js/dados.js` — única fonte de dados (`window.COPA`)
  - `js/` — arquivo(s) de funções puras e arquivo(s) de renderização
  - `img/`, `fontes/` — recursos locais
- Ordem de carregamento: `dados.js` → lógica pura → renderização, via `<script defer>` ou ao fim
  do `body`.
- Compatibilidade: versões atuais de Chrome, Edge, Firefox e Safari para desktop.
- Sem rastreadores ou scripts de terceiros que comprometam performance ou privacidade.

## Fluxo de Desenvolvimento e Portões de Qualidade

Antes de considerar qualquer entrega pronta, DEVE-se verificar:

1. O site abre e funciona via `file://` (duplo clique no `index.html`), sem erros no console.
2. `testes.html` está 100% verde.
3. Nenhum arquivo, dependência ou ferramenta proibida pelo Princípio II foi introduzido.
4. Lighthouse desktop ≥ 90 em Performance, Acessibilidade e SEO; página inicial < 500 KB.
5. Navegação completa por teclado e contraste AA verificados.
6. Visual conferido em 1024px, 1280px e 1920px de largura.
7. Um placar de teste lançado apenas em `js/dados.js` reflete corretamente em todo o site.

## Governance

- Esta constituição prevalece sobre qualquer outra prática, especificação ou plano do projeto.
  Planos e tarefas DEVEM passar pela verificação de conformidade (Constitution Check) e
  qualquer desvio DEVE ser justificado por escrito.
- Emendas exigem: descrição da mudança, motivo, impacto nos artefatos existentes e atualização
  da versão e da data de última emenda neste arquivo.
- Versionamento semântico:
  - **MAJOR**: remoção ou redefinição incompatível de princípio.
  - **MINOR**: novo princípio ou seção, ou ampliação material de orientação.
  - **PATCH**: esclarecimentos, redação e correções sem efeito semântico.
- Revisões de código e de especificações DEVEM checar a conformidade com todos os princípios
  e com os portões de qualidade acima.

**Version**: 1.1.0 | **Ratified**: 2026-11-23 | **Last Amended**: 2026-11-23
