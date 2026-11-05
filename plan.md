# Etapa 1 — Nova experiência da página inicial pública

## Implementação

A página inicial existente será mantida como base: o hero reutiliza `public/images/hero-festival.jpg`, a pesquisa continua ligada a `main.js` e a grelha de eventos continua a ser alimentada por `events.js`. A alteração concentra-se em `index.html` e nos estilos da home, removendo o painel lateral/menu principal apenas desta rota e substituindo-o por um cabeçalho público compacto com marca e CTAs de autenticação.

## Design

- **Movimento:** editorial de eventos contemporâneo, com a energia de um cartaz de festival e uma leitura digital limpa.
- **Princípios:** foco imediato no conteúdo; contraste alto; acções claras; responsividade sem ruído.
- **Cores:** azul-marinho para confiança e orientação, dourado para acções e descoberta, branco para leitura sobre a fotografia.
- **Layout:** hero assimétrico com texto ancorado à esquerda e imagem a ocupar o campo visual; conteúdo de eventos preservado abaixo.
- **Assinaturas:** logótipo compacto, halo dourado nos CTAs e fotografia de festival com sobreposição escura.
- **Interacção/animação:** entrada suave dos blocos, movimento vertical subtil na fotografia e hover discreto; respeitar `prefers-reduced-motion`.
- **Tipografia:** Inter existente, com títulos fortes e corpo confortável.
- **Essência:** a agenda pública que ajuda Moçambique a descobrir o que está a acontecer — próxima, activa e confiável.

## Estrutura existente preservada

- `index.html`: home pública e secção de eventos em destaque.
- `styles.css`: identidade visual, responsive layout e novos estados públicos da home.
- `main.js`: pesquisa e interacções; será tornado seguro quando elementos de menu não existirem na home.
- `events.js`: fonte actual dos cartões e dados apresentados.
- `public/images/hero-festival.jpg`: imagem principal já existente, sem conteúdo inventado.
