const panel = document.querySelector('#side-panel');
const menuButton = document.querySelector('#menu-toggle');
const closeButton = document.querySelector('#close-menu');
const scrim = document.querySelector('#drawer-scrim');
const search = document.querySelector('#event-search');
const cards = [...document.querySelectorAll('.event-card')];
const emptyMessage = document.querySelector('#search-empty');
const toast = document.querySelector('#toast');
let toastTimer;

function setPanel(open) {
  panel.classList.toggle('is-open', open);
  scrim.classList.toggle('visible', open && window.matchMedia('(max-width: 900px)').matches);
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

if (window.matchMedia('(max-width: 900px)').matches) setPanel(false);
window.addEventListener('resize', () => {
  if (window.matchMedia('(min-width: 901px)').matches) {
    setPanel(true);
  } else if (!panel.classList.contains('is-open')) {
    scrim.classList.remove('visible');
  }
});

search.addEventListener('input', () => {
  const query = search.value.trim().toLocaleLowerCase('pt');
  let visibleCount = 0;
  cards.forEach((card) => {
    const matches = card.dataset.search.toLocaleLowerCase('pt').includes(query);
    card.hidden = !matches;
    if (matches) visibleCount += 1;
  });
  emptyMessage.hidden = visibleCount !== 0;
});

document.querySelectorAll('.nav-item').forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelectorAll('.nav-item').forEach((link) => link.classList.remove('selected'));
    item.classList.add('selected');
    const name = item.dataset.nav;
    if (name === 'Eventos' || name === 'Início') {
      document.querySelector(name === 'Eventos' ? '#eventos' : '#inicio').scrollIntoView({ behavior: 'smooth' });
    } else {
      showToast(`${name} — prévia visual do Agenda MZ`);
    }
    if (window.matchMedia('(max-width: 900px)').matches) setPanel(false);
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

document.querySelector('#theme-switch').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const active = button.getAttribute('aria-checked') !== 'true';
  button.setAttribute('aria-checked', String(active));
  document.body.classList.toggle('theme-preview', active);
});
