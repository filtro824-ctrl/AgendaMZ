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
  const query = search.value.trim().toLocaleLowerCase('pt');
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

function setPanel(open) {
  panel.classList.toggle('is-open', open);
  scrim.classList.toggle('visible', open && isMobileMenu());
  document.body.classList.toggle('menu-open', open && isMobileMenu());
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2400);
}

menuButton.addEventListener('click', () => setPanel(!panel.classList.contains('is-open')));
closeButton.addEventListener('click', () => setPanel(false));
scrim.addEventListener('click', () => setPanel(false));

document.addEventListener('pointerdown', (event) => {
  if (isMobileMenu() && panel.classList.contains('is-open')
    && !panel.contains(event.target) && event.target !== menuButton && !menuButton.contains(event.target)) {
    setPanel(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (panel.classList.contains('is-open') && isMobileMenu()) setPanel(false);
    if (search.matches(':focus')) search.blur();
  }
});

if (isMobileMenu()) setPanel(false);
window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 901px)').matches) {
    setPanel(true);
  } else if (!panel.classList.contains('is-open')) {
    scrim.classList.remove('visible');
    document.body.classList.remove('menu-open');
  }
});

search.addEventListener('input', applyFilters);

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
    const target = name === 'Eventos' ? document.querySelector('#eventos') : document.querySelector('#inicio');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else if (name === 'Eventos') {
      window.location.href = '/eventos';
    } else if (name === 'Início') {
      window.location.href = '/';
    } else {
      showToast(`${name} — prévia visual do Agenda MZ`);
    }
    setPanel(false);
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
