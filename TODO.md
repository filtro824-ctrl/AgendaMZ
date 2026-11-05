# Entregas

- [x] **Tela inicial Agenda MZ fiel à referência:** criada somente a aparência visual inicial, não um site completo; inclui identidade Agenda MZ, hero “Descobre, Participa e Vive os Melhores Eventos!”, descrição e botão “Explorar Eventos”, composição vibrante com paleta azul-marinho, branco e amarelo/dourado e atmosfera de festival ao pôr do sol.
- [x] **Navegação e busca visuais:** ícone de menu no alto à direita, busca integrada à composição e painel lateral inicialmente aberto à direita com Início, Eventos, Mapa, Notificações, Chat IA, Publicar Evento, Meu Perfil, Definições e Ajuda & Suporte; painel abre e fecha visualmente, sem fluxos completos.
- [x] **Eventos em destaque:** quatro cartões claros e arredondados sob o título “Eventos em Destaque”, com imagens próprias, categorias, data, local e título conforme a composição da referência.
- [x] **Faixa de benefícios e responsividade:** apresenta Agenda Atualizada em Tempo Real, Alarmes e Lembretes Personalizados, Mapa Integrado com Google Maps e Assistente IA; preserva a hierarquia visual em diferentes larguras e inclui estados de hover simples.

- [x] **Definições e preferência local:** a opção “Definições” abre um painel com “Botão flutuante do Assistente IA”; o estado ligado/desligado é guardado defensivamente em `localStorage`, com valor por omissão ligado.
- [x] **Botão flutuante global:** botão redondo fixo no canto inferior direito, com área segura no iPhone, acessível nas páginas inicial e `/eventos`, oculto durante o menu ou chat.
- [x] **Painel de chat IA sem IA real:** o botão e “Chat IA” no menu abrem o painel com o texto aprovado, campo desactivado e sem respostas simuladas; inclui modo lateral no computador/tablet, modo inferior no telemóvel, modo expandido persistente, fechar/Esc/toque fora no telemóvel e gestão de foco.
- [x] **Acessibilidade e responsividade:** etiquetas ARIA, estado de foco, `role="switch"`, foco contido nos painéis e estilos validados para larguras de 320 a 1280 px.
