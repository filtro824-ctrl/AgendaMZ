const panel = document.querySelector('#side-panel');
const menuButton = document.querySelector('#menu-toggle');
const closeButton = document.querySelector('#close-menu');
const scrim = document.querySelector('#drawer-scrim');
const search = document.querySelector('#event-search');
const eventGrid = document.querySelector('#event-grid, #all-event-grid');
const emptyMessage = document.querySelector('#search-empty');
const toast = document.querySelector('#toast');
const events = window.AGENDA_EVENTS || [];
let cards = [];
let activeCategory = 'Todos';
let toastTimer;
let lastFocusedElement = null;
let activeOverlay = null;
let assistantUI;

const STORAGE_KEYS = {
  chatExpanded: 'agenda-mz-chat-expanded',
};

const SESSION_KEYS = {
  authenticated: 'agenda-mz-authenticated',
  aiEnabled: 'agenda-mz-ai-enabled',
};

function readStoredBoolean(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : value === 'true';
  } catch {
    return fallback;
  }
}

function writeStoredBoolean(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // A preferência local indisponível não deve impedir a utilização da interface.
  }
}

function readSessionBoolean(key, fallback = false) {
  try {
    const value = window.sessionStorage.getItem(key);
    return value === null ? fallback : value === 'true';
  } catch {
    return fallback;
  }
}

function writeSessionBoolean(key, value) {
  try {
    if (value) window.sessionStorage.setItem(key, 'true');
    else window.sessionStorage.removeItem(key);
  } catch {
    // Se a sessão não estiver disponível, a IA permanece desactivada por segurança.
  }
}

function isRestrictedPage() {
  const path = window.location.pathname.replace(/\/$/, '').toLocaleLowerCase('pt');
  return document.body.classList.contains('public-home') ||
    document.body.dataset.page === 'login' ||
    document.body.dataset.page === 'signup' ||
    ['/login', '/entrar', '/criar-conta', '/registar', '/register', '/signup'].includes(path);
}

function isAuthenticated() {
  return readSessionBoolean(SESSION_KEYS.authenticated);
}

function isAssistantAllowed() {
  return !isRestrictedPage() && isAuthenticated() && readSessionBoolean(SESSION_KEYS.aiEnabled);
}

function isMobileMenu() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function eventCardMarkup(event) {
  return `<article class="event-card" data-category="${event.category}" data-search="${event.search}">
    <button class="event-image ${event.imageClass}-image" type="button" aria-label="Ver ${event.titleLines.join(' ')}">
      <img src="${event.image}" alt="${event.alt}" loading="lazy" />
      <span class="category ${event.categoryClass}">${event.category}</span>
    </button>
    <div class="event-info">
      <div class="event-meta"><span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="17" height="15" rx="2"></rect><path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17"></path></svg>${event.date}</span><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path><circle cx="12" cy="10" r="2.2"></circle></svg>${event.location}</span></div>
      <div class="event-bottom"><h3>${event.titleLines.map((line) => `<span>${line}</span>`).join('')}</h3><button class="card-arrow" type="button" aria-label="Ver detalhes de ${event.titleLines.join(' ')}">→</button></div>
    </div>
  </article>`;
}

if (eventGrid) {
  eventGrid.innerHTML = events.map(eventCardMarkup).join('');
  cards = [...eventGrid.querySelectorAll('.event-card')];
}

function applyFilters() {
  const query = search ? search.value.trim().toLocaleLowerCase('pt') : '';
  let visibleCount = 0;
  cards.forEach((card) => {
    const matchesQuery = card.dataset.search.toLocaleLowerCase('pt').includes(query);
    const matchesCategory = activeCategory === 'Todos' || card.dataset.category === activeCategory;
    const visible = matchesQuery && matchesCategory;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });
  if (emptyMessage) emptyMessage.hidden = visibleCount !== 0;
}

const demoModal = document.querySelector('#demo-modal');
const demoModalClose = document.querySelector('#demo-modal-close');
const demoModalAction = document.querySelector('#demo-modal-action');
const demoModalTitle = document.querySelector('#demo-modal-title');
const demoModalLocation = document.querySelector('#demo-modal-location');
const demoModalCategory = document.querySelector('#demo-modal-category');
const demoModalDate = document.querySelector('#demo-modal-date');
let demoTrigger;

function closeDemoModal(restoreFocus = true) {
  if (!demoModal) return;
  demoModal.classList.remove('is-open');
  demoModal.setAttribute('aria-hidden', 'true');
  if (restoreFocus && demoTrigger) demoTrigger.focus();
}

function openDemoModal(card) {
  if (!demoModal) return;
  demoTrigger = card;
  demoModalTitle.textContent = card.dataset.demoTitle;
  demoModalLocation.textContent = card.dataset.demoLocation;
  demoModalCategory.textContent = card.dataset.demoCategory;
  demoModalDate.textContent = card.dataset.demoDate;
  demoModal.classList.add('is-open');
  demoModal.setAttribute('aria-hidden', 'false');
  demoModalClose.focus();
}

document.querySelectorAll('.demo-card').forEach((card) => {
  card.addEventListener('click', () => openDemoModal(card));
});

demoModalClose?.addEventListener('click', () => closeDemoModal());
demoModalAction?.addEventListener('click', () => closeDemoModal());
demoModal?.addEventListener('click', (event) => {
  if (event.target === demoModal) closeDemoModal();
});

function setPanel(open) {
  if (!panel || !menuButton || !scrim) return;
  panel.classList.toggle('is-open', open);
  scrim.classList.toggle('visible', open && isMobileMenu());
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  updateAssistantButtonVisibility();
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2400);
}

function createAssistantUI() {
  const button = document.createElement('button');
  button.className = 'assistant-fab';
  button.type = 'button';
  button.setAttribute('aria-label', 'Abrir Assistente IA');
  button.innerHTML = '<span class="assistant-fab-icon" aria-hidden="true">✦</span><span>IA</span>';
  document.querySelector('.page-shell').append(button);

  const settings = document.createElement('section');
  settings.className = 'utility-panel settings-panel';
  settings.id = 'settings-panel';
  settings.setAttribute('aria-labelledby', 'settings-title');
  settings.setAttribute('aria-hidden', 'true');
  settings.innerHTML = `<div class="utility-header"><div><p class="utility-kicker">Preferências</p><h2 id="settings-title">Definições</h2></div><button class="utility-close" type="button" aria-label="Fechar definições">×</button></div>
    <div class="settings-content"><div class="setting-row"><div><strong>Botão flutuante do Assistente IA</strong><p>Mostra o acesso rápido ao assistente em todas as páginas.</p></div><button class="toggle-switch" type="button" role="switch" aria-label="Ligar botão flutuante do Assistente IA" aria-checked="true"><span></span></button></div></div>`;
  document.querySelector('.page-shell').append(settings);

  const chat = document.createElement('section');
  chat.className = 'utility-panel chat-panel';
  chat.id = 'chat-panel';
  chat.setAttribute('role', 'dialog');
  chat.setAttribute('aria-modal', 'false');
  chat.setAttribute('aria-labelledby', 'chat-title');
  chat.setAttribute('aria-hidden', 'true');
  chat.innerHTML = `<div class="utility-header chat-header"><div><p class="utility-kicker">Agenda MZ</p><h2 id="chat-title">Assistente IA Agenda MZ</h2></div><div class="chat-actions"><button class="chat-expand" type="button" aria-label="Expandir chat" aria-pressed="false">↗</button><button class="utility-close" type="button" aria-label="Fechar chat">×</button></div></div>
    <div class="chat-content"><div class="chat-empty-state"><span class="assistant-orb" aria-hidden="true">✦</span><p>O assistente está a ser preparado. Em breve poderás pesquisar eventos e enviar cartazes para análise.</p></div><div class="chat-composer"><input type="text" disabled aria-label="Mensagem para o Assistente IA" placeholder="Escreve uma mensagem..." /><button type="button" disabled aria-label="Enviar mensagem">↑</button></div></div>`;
  document.querySelector('.page-shell').append(chat);

  button.addEventListener('click', () => openOverlay(chat));
  settings.querySelector('.utility-close').addEventListener('click', () => closeOverlay(settings));
  chat.querySelector('.utility-close').addEventListener('click', () => closeOverlay(chat));
  chat.querySelector('.chat-expand').addEventListener('click', () => toggleChatExpanded(chat));
  settings.querySelector('.toggle-switch').addEventListener('click', () => toggleAssistantButton(settings, button));

  const assistantEnabled = readSessionBoolean(SESSION_KEYS.aiEnabled, false);
  const expanded = readStoredBoolean(STORAGE_KEYS.chatExpanded, false);
  applyAssistantSetting(settings, button, assistantEnabled);
  setChatExpanded(chat, expanded);
  return { button, settings, chat };
}

assistantUI = isRestrictedPage() ? null : createAssistantUI();
updateAssistantButtonVisibility();

function updateAssistantButtonVisibility() {
  if (!assistantUI) return;
  const menuOpen = panel && panel.classList.contains('is-open');
  const chatOpen = assistantUI.chat.classList.contains('is-open');
  assistantUI.button.hidden = menuOpen || chatOpen || !isAssistantAllowed();
}

function getFocusable(container) {
  return [...container.querySelectorAll('button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
}

function openOverlay(overlay) {
  if (activeOverlay && activeOverlay !== overlay) closeOverlay(activeOverlay, false);
  lastFocusedElement = document.activeElement;
  activeOverlay = overlay;
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');
  overlay.querySelector('.utility-close').focus();
  updateAssistantButtonVisibility();
}

function closeOverlay(overlay, restoreFocus = true) {
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden', 'true');
  if (activeOverlay === overlay) activeOverlay = null;
  updateAssistantButtonVisibility();
  if (restoreFocus && lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
}

function applyAssistantSetting(settings, button, enabled) {
  const toggle = settings.querySelector('.toggle-switch');
  toggle.setAttribute('aria-checked', String(enabled));
  toggle.setAttribute('aria-label', `${enabled ? 'Desligar' : 'Ligar'} botão flutuante do Assistente IA`);
  toggle.classList.toggle('is-on', enabled);
  button.setAttribute('aria-hidden', String(!isAssistantAllowed()));
  updateAssistantButtonVisibility();
}

function toggleAssistantButton(settings, button) {
  if (!isAuthenticated()) {
    showToast('Entra na tua conta para activar o Assistente IA.');
    return;
  }
  const enabled = settings.querySelector('.toggle-switch').getAttribute('aria-checked') !== 'true';
  writeSessionBoolean(SESSION_KEYS.aiEnabled, enabled);
  applyAssistantSetting(settings, button, enabled);
}

function setChatExpanded(chat, expanded) {
  chat.classList.toggle('is-expanded', expanded);
  const expandButton = chat.querySelector('.chat-expand');
  expandButton.setAttribute('aria-pressed', String(expanded));
  expandButton.setAttribute('aria-label', expanded ? 'Reduzir chat' : 'Expandir chat');
  expandButton.textContent = expanded ? '↙' : '↗';
}

function toggleChatExpanded(chat) {
  const expanded = !chat.classList.contains('is-expanded');
  writeStoredBoolean(STORAGE_KEYS.chatExpanded, expanded);
  setChatExpanded(chat, expanded);
}

window.AgendaMZSession = {
  login() {
    writeSessionBoolean(SESSION_KEYS.authenticated, true);
    writeSessionBoolean(SESSION_KEYS.aiEnabled, false);
    updateAssistantButtonVisibility();
  },
  logout() {
    writeSessionBoolean(SESSION_KEYS.authenticated, false);
    writeSessionBoolean(SESSION_KEYS.aiEnabled, false);
    if (assistantUI) {
      assistantUI.button.hidden = true;
      closeOverlay(assistantUI.chat, false);
      closeOverlay(assistantUI.settings, false);
    }
    window.dispatchEvent(new CustomEvent('agenda-mz-session-changed'));
  },
  setAiEnabled(enabled) {
    if (!isAuthenticated()) return false;
    writeSessionBoolean(SESSION_KEYS.aiEnabled, Boolean(enabled));
    if (assistantUI) applyAssistantSetting(assistantUI.settings, assistantUI.button, Boolean(enabled));
    return true;
  },
};

window.addEventListener('agenda-mz-session-changed', updateAssistantButtonVisibility);

if (panel && menuButton && closeButton && scrim) {
  menuButton.addEventListener('click', () => setPanel(!panel.classList.contains('is-open')));
  closeButton.addEventListener('click', () => setPanel(false));
  scrim.addEventListener('click', () => setPanel(false));
}

document.addEventListener('pointerdown', (event) => {
  if (panel && panel.classList.contains('is-open') && !panel.contains(event.target) && event.target !== menuButton && !menuButton.contains(event.target)) setPanel(false);
  if (assistantUI && assistantUI.chat.classList.contains('is-open') && isMobileMenu() && !assistantUI.chat.contains(event.target) && event.target !== assistantUI.button) closeOverlay(assistantUI.chat);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (demoModal?.classList.contains('is-open')) closeDemoModal();
    if (activeOverlay) closeOverlay(activeOverlay);
    else if (panel && panel.classList.contains('is-open') && isMobileMenu()) setPanel(false);
    if (search && search.matches(':focus')) search.blur();
  }
  if (event.key === 'Tab' && activeOverlay) {
    const focusable = getFocusable(activeOverlay);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

if (panel) {
  if (isMobileMenu()) setPanel(false);
  else setPanel(true);
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 901px)').matches) setPanel(panel.classList.contains('is-open'));
    else if (panel.classList.contains('is-open')) setPanel(false);
    else { scrim.classList.remove('visible'); document.body.classList.remove('menu-open'); }
  });
}

if (search) {
  search.addEventListener('pointerdown', (event) => {
    event.stopPropagation();
    setPanel(false);
  });
  search.addEventListener('click', () => setPanel(false));
  search.addEventListener('input', applyFilters);
}

document.querySelectorAll('[data-auth-action]').forEach((button) => {
  button.addEventListener('click', () => showToast(`${button.dataset.authAction} — autenticação em preparação.`));
});

document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    applyFilters();
  });
});

applyFilters();

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelectorAll('.nav-item').forEach((link) => link.classList.remove('selected'));
    item.classList.add('selected');
    const name = item.dataset.nav;
    if (name === 'Chat IA' && assistantUI && isAssistantAllowed()) {
      openOverlay(assistantUI.chat);
    } else if (name === 'Chat IA') {
      showToast('Entra na tua conta e activa o Assistente IA nas definições.');
    } else if (name === 'Definições' && assistantUI) {
      openOverlay(assistantUI.settings);
    } else {
      const target = name === 'Eventos' ? document.querySelector('#eventos') : document.querySelector('#inicio');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      else if (name === 'Eventos') window.location.href = '/eventos';
      else if (name === 'Início') window.location.href = '/';
      else showToast(`${name} — prévia visual do Agenda MZ`);
      setPanel(false);
    }
  });
});

document.querySelectorAll('.card-arrow, .event-image').forEach((button) => {
  button.addEventListener('click', () => {
    const title = button.closest('.event-card').querySelector('h3').innerText.replace(/\n/g, ' ');
    showToast(`${title} — detalhes em breve`);
  });
});

document.querySelectorAll('.carousel-dots button').forEach((dot, index) => {
  dot.addEventListener('click', () => {
    document.querySelectorAll('.carousel-dots button').forEach((button) => button.classList.remove('active'));
    dot.classList.add('active');
    document.querySelector('.carousel-dots').setAttribute('aria-label', `Slide ${index + 1} de 3`);
  });
});
