

const U = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=70`;

const PROMOS = [
  { title: 'Villas de diseño en Requena con vistas al viñedo', place: 'Requena', img: U('1600596542815-ffad4c1539a9') },
  { title: '¿Quieres vivir en unas villas diferentes y comenzar una nueva forma de vida?', place: 'Requena', img: U('1600607687939-ce8a6c25118c') },
  { title: 'Chalets exclusivos con piscina junto al casco histórico', place: 'Requena', img: U('1600566753190-17f0baa2a6c3') },
  { title: 'Disfruta de tu nueva casa rodeada de viñedos', place: 'Requena', img: U('1580587771525-78b9dba3b914') },
  { title: 'Nuevo proyecto de apartamentos boutique en el centro de Requena', place: 'Requena', img: U('1545324418-cc1a3fa10c00') },
  { title: 'Villas de diseño en La Portera', place: 'La Portera', img: U('1600047509807-ba8f99d2cdde') },
  { title: 'Casas pensadas para disfrutar del campo y la tranquilidad', place: 'Requena', img: U('1523217582562-09d0def993a6') },
  { title: 'TU NUEVA VILLA EN UTIEL, A POCOS MINUTOS DE LA AUTOVÍA', place: 'Utiel', img: U('1568605114967-8130f3a36994') },
  { title: 'BUNGALOWS CON MAGNÍFICA UBICACIÓN, CONFORT Y UN EXCELENTE PRECIO', place: 'Requena', img: U('1570129477492-45c003edd2be') },
  { title: 'Adosados de obra nueva con jardín privado y garaje', place: 'Utiel', img: U('1600573472550-8090b5e0745e') },
  { title: 'Viviendas de 2 y 3 dormitorios con terraza y zonas comunes', place: 'Requena', img: U('1512917774080-9991f1c4c750') },
  { title: 'Villas independientes con piscina y paellero', place: 'Venta del Moro', img: U('1564013799919-ab600027ffc6') },
  { title: 'Promoción de pisos eficientes con calificación energética A', place: 'Requena', img: U('1502672260266-1c1ef2d93688') },
  { title: 'Últimas viviendas disponibles en residencial con piscina', place: 'Utiel', img: U('1613490493576-7fde63acd811') }
];

const PER_PAGE = 6;
const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><rect width="100%" height="100%" fill="#dfe6ea"/><text x="50%" y="50%" fill="#8a97a0" font-family="Arial" font-size="26" text-anchor="middle">Inmobiliaria Requena</text></svg>'
);

const grid = document.getElementById('promoGrid');
const pager = document.getElementById('promoPager');
const pages = Math.ceil(PROMOS.length / PER_PAGE);
let current = Math.min(Math.max(parseInt(new URLSearchParams(location.search).get('page'), 10) || 1, 1), pages);

function renderGrid() {
  const slice = PROMOS.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  grid.innerHTML = slice.map(p => `
    <div class="col-md-6 col-lg-4">
      <a class="promo-card" href="contacto.html">
        <div class="promo-media">
          <img src="${p.img}" alt="${p.title}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'">
        </div>
        <div class="promo-body">
          <p class="promo-place"><i class="bi bi-geo-alt-fill"></i> ${p.place}</p>
          <h2 class="promo-title">${p.title}</h2>
          <span class="promo-more">Solicitar información</span>
        </div>
      </a>
    </div>`).join('');
}

function renderPager() {
  let html = '';
  if (current > 1) html += `<li><button type="button" data-go="${current - 1}">« Anterior</button></li>`;
  for (let i = 1; i <= pages; i++) {
    html += `<li><button type="button" data-go="${i}" ${i === current ? 'aria-current="page"' : ''} aria-label="Página ${i}">${i}</button></li>`;
  }
  if (current < pages) html += `<li><button type="button" data-go="${current + 1}">Siguiente »</button></li>`;
  pager.innerHTML = html;
}

function goTo(n, scroll) {
  current = n;
  renderGrid();
  renderPager();
  history.replaceState(null, '', n === 1 ? location.pathname : `?page=${n}`);
  if (scroll) document.getElementById('promoTop').scrollIntoView({ behavior: 'smooth' });
}

pager.addEventListener('click', e => {
  const b = e.target.closest('button[data-go]');
  if (b) goTo(+b.dataset.go, true);
});

renderGrid();
renderPager();
