let todasLasCartas = [];
let filtroActivo = 'todos';

// Mapeo filtro
const FILTROS = {
  todos:   null,
  normal:  tipo => tipo === 'Normal Monster',
  efecto:  tipo => tipo.includes('Effect Monster') && !tipo.includes('Fusion') && !tipo.includes('Synchro') && !tipo.includes('XYZ') && !tipo.includes('Link') && !tipo.includes('Ritual'),
  fusion:  tipo => tipo.includes('Fusion'),
  sincro:  tipo => tipo.includes('Synchro'),
  xyz:     tipo => tipo.includes('XYZ'),
  link:    tipo => tipo.includes('Link'),
  ritual:  tipo => tipo.includes('Ritual'),
  spell:   tipo => tipo === 'Spell Card',
  trap:    tipo => tipo === 'Trap Card',
};

// input
const inputEl = document.getElementById('query');
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') buscar();
});

// botones de filtro
document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    filtroActivo = btn.dataset.tipo;
    renderizarCartas();
  });
});

// Buscar en la API
async function buscar() {
  const q = inputEl.value.trim();
  if (!q) return;

  const status = document.getElementById('status');
  const results = document.getElementById('results');

  status.textContent = 'Buscando...';
  results.innerHTML = '';
  todasLasCartas = [];

  try {
    const res = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=${encodeURIComponent(q)}&num=100&offset=0`);
    const data = await res.json();

    if (data.error) {
      status.textContent = 'No se encontraron cartas.';
      return;
    }

    todasLasCartas = data.data;
    renderizarCartas();

  } catch (err) {
    status.textContent = 'Error al conectar con la API.';
  }
}

// Renderizar  cartas 
function renderizarCartas() {
  const status = document.getElementById('status');
  const results = document.getElementById('results');
  results.innerHTML = '';

  const condicion = FILTROS[filtroActivo];
  const filtradas = condicion
    ? todasLasCartas.filter(c => condicion(c.type))
    : todasLasCartas;

  if (filtradas.length === 0) {
    status.textContent = `Sin resultados para el filtro "${filtroActivo}".`;
    return;
  }

  status.textContent = `${filtradas.length} carta(s) encontrada(s)`;

  filtradas.forEach(carta => {
    const img = carta.card_images[0].image_url_small;
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${img}" alt="${carta.name}">
      <div class="name">${carta.name}</div>
      <div class="type">${carta.type}</div>
    `;
    div.onclick = () => abrirModal(carta);
    results.appendChild(div);
  });
}

// Abrir detalle de carta
function abrirModal(carta) {
  document.getElementById('modal-img').src = carta.card_images[0].image_url;
  document.getElementById('modal-name').textContent = carta.name;
  document.getElementById('modal-desc').textContent = carta.desc;

  const tags = [];
  if (carta.type)              tags.push(carta.type);
  if (carta.race)              tags.push(carta.race);
  if (carta.attribute)         tags.push(carta.attribute);
  if (carta.level)             tags.push('Nivel ' + carta.level);
  if (carta.linkval)           tags.push('Link ' + carta.linkval);
  if (carta.atk !== undefined) tags.push(`ATK: ${carta.atk}`);
  if (carta.def !== undefined) tags.push(`DEF: ${carta.def}`);

  document.getElementById('modal-tags').innerHTML =
    tags.map(t => `<span class="tag">${t}</span>`).join('');

  document.getElementById('modal').classList.add('open');
}

// Cerrar modal
function cerrarModal() {
  document.getElementById('modal').classList.remove('open');
}

document.getElementById('modal').addEventListener('click', function(e) {
  if (e.target === this) cerrarModal();
});

document.getElementById('close-btn').addEventListener('click', cerrarModal);
