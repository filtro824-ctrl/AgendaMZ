# Agenda MZ — código-fonte

Pacote da tela inicial visual do Agenda MZ, adaptada da referência enviada. É uma página estática responsiva com pesquisa local, menu lateral, cartões de eventos e interações de demonstração; não inclui backend, publicação de eventos, mapa conectado ou autenticação.

## Requisitos

- Node.js 18 ou superior
- Nenhuma dependência npm externa

## Executar localmente

1. Extraia o ZIP.
2. Abra um terminal nesta pasta.
3. Execute `npm start`.
4. Acesse `http://localhost:3000` no navegador.

Também é possível iniciar com `npm run dev`. As imagens usadas estão incluídas em `public/images/`; o ícone está em `public/brandmark.svg`. A fonte Inter pode carregar do Google Fonts quando houver internet; o site usa fontes de sistema como alternativa.

## Arquivos principais

- `index.html`: estrutura e conteúdo da página.
- `styles.css`: estilos, layout e responsividade.
- `main.js`: busca e interações visuais.
- `server.mjs`: servidor HTTP simples sem dependências.
- `public/images/`: imagens originais incluídas no pacote.
- `public/brandmark.svg`: emblema vetorial.
- `public/manus-routes.json`: declaração da rota principal.
