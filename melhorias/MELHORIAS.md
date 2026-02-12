# Melhorias do Site - Francisco Braun

## Problemas de Codigo (bugs e HTML)

- [x] **1. `lang="en"` em todas as paginas** — O conteudo e majoritariamente em portugues. Deveria ser `lang="pt-BR"`.
- [x] **2. Tag `</img>` invalida** — Em todas as 5 paginas, a tag do logo usa `<img ...></img>`. A tag `<img>` e self-closing em HTML5 (nao precisa de `</img>`).
- [x] **3. Entrada duplicada em `students.html:220-231`** — "Drielly Vilela Costa" aparece duas vezes com dados identicos na tabela de Undergrad students.
- [x] **4. Erro de digitacao em `students.html:122`** — O periodo do mestrado de Filipe Fernandes esta como `2015-1017` (deveria ser `2015-2017`).
- [x] **5. Tag `<td>` sem fechamento** — Em `students.html:111-116`, falta o `</td>` de fechamento no registro de Rodrigo Thomaz da Silva (Master's).
- [x] **6. Links HTTP em vez de HTTPS** — Varios links externos usam `http://` (Lattes, UFSCar, links de PDF do dm.ufscar.br). Devem usar `https://` quando possivel.
- [x] **7. Carregamento do CSS custom antes do Bootstrap** — O `style.css` e carregado antes do Bootstrap CSS. Deveria ser carregado depois para que a cascata funcione naturalmente e reduza a necessidade de `!important`.
- [x] **8. Falta `meta description`** — Nenhuma pagina tem `<meta name="description">`, o que prejudica SEO.
- [x] **9. Falta `alt` em varias imagens** — `Lattesbranco.png`, `Ufscar.gif`, o mapa do ClustrMaps e outras imagens nao tem atributo `alt` descritivo (acessibilidade).

## Melhorias de Estrutura/Codigo

- [x] **10. Header e footer duplicados nas 5 paginas** — Qualquer mudanca no menu precisa ser replicada manualmente. Considerar usar includes ou static site generator.
- [x] **11. Excesso de `!important` no CSS** — Pelo menos 8 usos em `style.css`. A maioria pode ser eliminada reordenando os CSS e usando seletores mais especificos.
- [x] **12. Estilos inline excessivos** — Muitos elementos tem `style="..."` diretamente no HTML. Migrar para classes no `style.css`.
- [x] **13. CSS `style.css:88` — seletor errado** — `.table-styleth` esta faltando um espaco (deveria ser `.table-style th`).
- [x] **14. Falta `.gitignore`** — Nao existe um `.gitignore` para excluir `.DS_Store`, etc.
- [ ] **15. Bootstrap desatualizado** — O site usa Bootstrap 5.2.1 (set/2022). A versao atual e 5.3.x.
- [x] **16. Script do 24timezones carregado em todas as paginas** — O widget de relogio so aparece na `index.html`, mas o script e carregado em todas as 5 paginas.

## Melhorias Visuais

- [x] **17. Responsividade no mobile** — O header divide `col-6`/`col-6` entre logo e menu. Em telas pequenas deveria empilhar verticalmente.
- [x] **18. Foto na index muito pequena** — `.img-fluid { max-width: 25% !important; }` faz a foto ficar minuscula em mobile. Usar um tamanho responsivo melhor (ex: `max-width: 300px`).
- [x] **19. Footer nao gruda no fundo** — Em paginas com pouco conteudo, o footer flutua. Usar flexbox no body (`min-height: 100vh`, `flex-grow: 1` no main) de forma consistente.
- [x] **20. Sem indicacao da pagina ativa no menu** — Todos os botoes do nav tem o mesmo estilo. Adicionar classe `active` ao item atual.
- [x] **21. Links nas tabelas com baixo contraste** — Na `research.html`, links `#2a42ff` sobre fundo `#718af0` sao dificeis de ler.
- [x] **22. Layout vazio em `miscellaneous.html`** — A coluna direita tem poucos itens e muito espaco vazio.
- [x] **23. Tabelas nao ideais para mobile** — Cards do Bootstrap seriam mais responsivos para listar publicacoes e alunos.
- [x] **24. Falta de transicoes suaves** — Efeitos de hover sao abruptos. Adicionar `transition: 0.3s ease`.

## Prioridades

| Prioridade | Itens |
|---|---|
| **Alta (bugs)** | 3, 4, 5, 13 |
| **Media (qualidade)** | 1, 7, 16, 19 |
| **Baixa (melhorias)** | 17, 20, 23, 24 |
