# CONTEXTO DO PROJECTO — Agenda MZ

Regras permanentes para o repositório `filtro824-ctrl/AgendaMZ`.

1. Nunca reconstruir o projecto do zero. Preservar o que já funciona e o design aprovado.
2. Trabalhar sempre na branch `development`, nunca directamente na `main`. Alterações vão para a `main` só por pull request, e só depois de aprovação explícita do proprietário.
3. A Cloudflare publica automaticamente tudo o que entra na `main`. Nunca fazer merge na `main` sem autorização explícita do proprietário.
4. No fim de cada tarefa, fazer commit e push, e informar o hash do commit e o que mudou. Se não foi commitado, não conta como feito.
5. Nunca colocar chaves, tokens ou palavras-passe no código. Não usar dados fictícios como se fossem eventos reais.
6. Não activar serviços pagos sem autorização explícita do proprietário.
7. Manter este ficheiro `CONTEXTO.md` actualizado depois de cada tarefa.

## Estado conhecido

- O projecto é uma aplicação estática responsiva em HTML, CSS e JavaScript vanilla.
- O build é feito com `npm run build` através de `build.mjs`.
- O output do build é a pasta `dist/`.
- A configuração do Cloudflare Wrangler está em `wrangler.jsonc`.
- A branch de trabalho é `development`; a publicação ocorre a partir da `main` após pull request aprovado.

## Última tarefa

- Corrigido o cabeçalho responsivo: em ecrãs estreitos a pesquisa abre abaixo do cabeçalho em largura útil total, mantendo a filtragem dos eventos e um espaço mínimo de 12 px para o botão do menu.
- Corrigido o menu móvel: fecho por toque fora do painel, tecla `Esc`, botão X e selecção de opção; o scroll do fundo fica bloqueado enquanto o menu está aberto.
- Removido apenas o interruptor e o suporte do Modo Escuro.
- `npm run build` e os testes de browser no artefacto `dist/` passaram em 320, 360, 390, 412, 768, 1024 e 1280 px.
- Pull request para `main` será aberto e aguarda aprovação; não fazer merge sem autorização explícita.

## Tarefa actual

- Criada a página `/eventos` com botão Voltar, cabeçalho, pesquisa, categorias seleccionáveis e cartões responsivos.
- Os quatro eventos passaram a vir de `events.js`, partilhado pela página inicial e por `/eventos`.
- `build.mjs` copia a nova página, o ficheiro de dados e cria `dist/eventos/index.html` para a rota estática.
- `server.mjs` serve `/eventos` localmente; `public/manus-routes.json` declara a nova rota.
- `npm run build`, a aplicação fonte e o artefacto `dist/` passaram os testes em 320, 390, 768, 1024 e 1280 px.
- Pesquisa e categoria combinadas, estado sem resultados, botão Ver todos e menu lateral foram testados.
- O pull request desta tarefa será aberto para `main` e aguarda aprovação; não fazer merge sem autorização explícita.

## Correcção 4

- Removida apenas a faixa dos quatro benefícios por baixo dos eventos da página inicial.
- Removidos os estilos CSS exclusivos dessa faixa; não havia JavaScript específico associado.
- O rodapé `Agenda MZ` / `Juntos por uma Moçambique mais informada.` foi preservado.
- `npm run build`, a aplicação fonte e o artefacto `dist/` passaram os testes em 320, 390, 768, 1024 e 1280 px.
- O pull request existente para `main` será actualizado e aguarda aprovação; não fazer merge sem autorização explícita.


## Tarefa actual — Assistente IA (interface)

- Implementados o painel de Definições, o botão flutuante do Assistente IA e o painel de chat, sem IA real nem respostas simuladas.
- A preferência do botão flutuante e o modo expandido do chat usam `localStorage` dentro de `try/catch`, com valores por omissão seguros.
- O botão flutuante respeita a área segura inferior do iPhone, desaparece quando o menu/chat estão abertos e está disponível nas páginas inicial e `/eventos`.
- O chat tem modo lateral pequeno no computador/tablet, modo inferior de cerca de 70% no telemóvel, modo expandido, fecho por botão/Esc/toque fora no telemóvel, foco inicial e foco contido.
- A interface foi mantida em HTML/CSS/JavaScript vanilla e não activa nenhum serviço de IA.
- A validação final deve abranger build e larguras entre 320 e 1280 px; o pull request segue para `main` sem merge.
