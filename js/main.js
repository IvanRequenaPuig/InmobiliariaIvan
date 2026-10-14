


const PAGE_SIZE = 6;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const state = {
  op: '', tipo: '', poblacion: '', zona: '', desde: '', hasta: '',
  beds: 0, baths: 0, m2: '', ref: '', feats: new Set(),
  orden: 'fecha-desc', shown: PAGE_SIZE
};



function getFiltered() {
  const s = state;
  let list = PROPERTIES.filter(p =>
    (!s.op || p.op === s.op) &&
    (!s.tipo || p.tipo === s.tipo) &&
    (!s.poblacion || p.poblacion === s.poblacion) &&
    (!s.zona || p.zona === s.zona) &&
    (!s.desde || p.price >= +s.desde) &&
    (!s.hasta || p.price <= +s.hasta) &&
    p.beds >= s.beds && p.baths >= s.baths &&
    (!s.m2 || p.m2 >= +s.m2) &&
    (!s.ref || p.ref.toLowerCase().includes(s.ref.toLowerCase().trim())) &&
    [...s.feats].every(f => p.feats.includes(f))
  );
  const sorters = {
    'fecha-desc': (a, b) => b.date.localeCompare(a.date),
    'precio-asc': (a, b) => a.price - b.price,
    'precio-desc': (a, b) => b.price - a.price,
    'm2-desc': (a, b) => b.m2 - a.m2
  };
  return list.sort(sorters[s.orden]);
}

function render() {
  const list = getFiltered();
  $('#resultsCount').textContent = list.length;
  $('#resultsGrid').innerHTML = list.slice(0, state.shown).map(cardHTML).join('');
  $('#emptyState').classList.toggle('d-none', list.length > 0);
  $('#loadMore').classList.toggle('d-none', state.shown >= list.length);
  renderTags();
}

function renderTags() {
  const s = state, tags = [];
  if (s.op) tags.push(['op', s.op === 'venta' ? 'Comprar' : 'Alquilar']);
  if (s.tipo) tags.push(['tipo', s.tipo]);
  if (s.poblacion) tags.push(['poblacion', s.poblacion]);
  if (s.zona) tags.push(['zona', s.zona]);
  if (s.desde) tags.push(['desde', `Desde ${fmtNum(+s.desde)}€`]);
  if (s.hasta) tags.push(['hasta', `Hasta ${fmtNum(+s.hasta)}€`]);
  if (s.beds) tags.push(['beds', `${s.beds}+ habitaciones`]);
  if (s.baths) tags.push(['baths', `${s.baths}+ baños`]);
  if (s.m2) tags.push(['m2', `Desde ${s.m2} m²`]);
  if (s.ref) tags.push(['ref', `Ref. ${s.ref}`]);
  s.feats.forEach(f => tags.push(['feat:' + f, f]));
  $('#activeTags').innerHTML = tags.map(([k, l]) =>
    `<button class="tag" data-key="${k}">${l} <i class="bi bi-x"></i></button>`).join('');
}

/* ---------- Sincronizar formulario <-> estado ---------- */
function syncForm() {
  const s = state;
  $(`input[name="op"][value="${s.op}"]`).checked = true;
  $('#fTipo').value = s.tipo;
  $('#fPoblacion').value = s.poblacion;
  updateZonas('#fZona', s.poblacion);
  $('#fZona').value = s.zona;
  $('#fDesde').value = s.desde;
  $('#fHasta').value = s.hasta;
  $('#fM2').value = s.m2;
  $('#fRef').value = s.ref;
  $('#fOrden').value = s.orden;
  $$('#chipsBeds .chip').forEach(c => c.classList.toggle('active', +c.dataset.val === s.beds));
  $$('#chipsBaths .chip').forEach(c => c.classList.toggle('active', +c.dataset.val === s.baths));
  $$('#featuresBox input').forEach(i => i.checked = s.feats.has(i.value));
}

function updateZonas(selector, poblacion) {
  const zonas = uniq(PROPERTIES.filter(p => !poblacion || p.poblacion === poblacion).map(p => p.zona));
  const sel = $(selector);
  const prev = sel.value;
  fillSelect(sel, zonas, selector === '#fZona' ? 'Todas' : 'Zona');
  if (zonas.includes(prev)) sel.value = prev;
}

function resetState() {
  Object.assign(state, { op:'', tipo:'', poblacion:'', zona:'', desde:'', hasta:'', beds:0, baths:0, m2:'', ref:'', shown:PAGE_SIZE });
  state.feats.clear();
  syncForm();
  render();
}


/* =========================================================
   HERO: fondos que cambian solos
   ========================================================= */
function initHero() {
  const slides = $$('.hero-slide');
  const dotsBox = $('#heroDots');
  if (slides.length < 2 || !dotsBox) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTERVAL = 6000; // ms entre fondos
  let i = 0, timer = null;

  const load = s => { if (s.dataset.bg && !s.style.backgroundImage) s.style.backgroundImage = `url("${s.dataset.bg}")`; };

  dotsBox.innerHTML = slides.map((_, k) =>
    `<button type="button" data-i="${k}" aria-label="Fondo ${k + 1} de ${slides.length}"></button>`).join('');
  const dots = $$('button', dotsBox);

  function show(n) {
    const prev = slides[i];
    i = (n + slides.length) % slides.length;
    const cur = slides[i];
    if (cur === prev) { dots[i].classList.add('active'); return; }
    load(cur); load(slides[(i + 1) % slides.length]);
    prev.classList.remove('active');
    prev.classList.add('prev');
    setTimeout(() => prev.classList.remove('prev'), 1800);
    cur.classList.add('active');
    dots.forEach((d, k) => { d.classList.toggle('active', k === i); d.setAttribute('aria-current', k === i); });
  }
  function stop() { clearInterval(timer); timer = null; }
  function start() { if (reduce) return; stop(); timer = setInterval(() => show(i + 1), INTERVAL); }

  dots.forEach(d => d.addEventListener('click', () => { show(+d.dataset.i); start(); }));
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  dots[0].classList.add('active');
  window.addEventListener('load', () => slides.forEach(load)); // precarga el resto
  start();
}

/* =========================================================
   Animación de aparición al hacer scroll ([data-reveal])
   ========================================================= */
function initReveal() {
  const els = $$('[data-reveal]:not(.reveal)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in');
      io.unobserve(el);
      setTimeout(() => { el.style.transitionDelay = ''; }, 1500); // el retardo solo vale para la entrada
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });

  els.forEach(el => {
    el.classList.add('reveal', 'reveal-' + (el.dataset.reveal || 'up'));
    if (el.dataset.delay) el.style.transitionDelay = el.dataset.delay + 'ms';
    io.observe(el);
  });
}

/* =========================================================
   OPINIONES DE CLIENTES
   IMPORTANTE: estas opiniones son de ejemplo. Sustitúyelas por
   opiniones reales de tus clientes (con su permiso).
   ========================================================= */
const REVIEWS = [
  { name: 'María José R.', detail: 'Vendió su piso en Requena', rating: 5, date: 'Sep 2026', text: 'Vendieron mi piso en menos de dos meses y al precio que esperábamos. Siempre me llamaron para contarme cada visita. Un trato muy cercano.' },
  { name: 'Antonio G.', detail: 'Compró un chalet con piscina', rating: 5, date: 'Ago 2026', text: 'Nos acompañaron en toda la compra, incluida la hipoteca. Sin sorpresas y con las ideas muy claras desde el primer día.' },
  { name: 'Laura y Pedro', detail: 'Alquilaron un piso en Utiel', rating: 5, date: 'Jul 2026', text: 'Encontramos piso en una semana. Nos explicaron el contrato con paciencia y respondieron a todas nuestras dudas.' },
  { name: 'Carmen S.', detail: 'Vendió una finca rústica', rating: 4, date: 'Jun 2026', text: 'Era una finca difícil de valorar y la tasación fue muy cuidadosa. El proceso tardó algo más de lo previsto, pero la comunicación fue excelente.' },
  { name: 'Javier M.', detail: 'Traspasó su negocio', rating: 5, date: 'May 2026', text: 'Me ayudaron a traspasar mi local con toda la gestión. Encontraron comprador rápido y se encargaron del papeleo.' },
  { name: 'Rosa L.', detail: 'Compró su primera vivienda', rating: 5, date: 'Abr 2026', text: 'Como compradora primeriza tenía muchos miedos. Me guiaron paso a paso y ahora vivo en el piso que quería.' },
  { name: 'Familia Ortiz', detail: 'Reforma integral y venta', rating: 4, date: 'Mar 2026', text: 'Reformaron la casa de mi madre y después la vendieron. Muy buen resultado y presupuesto ajustado al acordado.' },
  { name: 'Miguel Á. T.', detail: 'Propietario en alquiler', rating: 5, date: 'Feb 2026', text: 'Gestionan el alquiler de mis dos pisos desde hace años. Cobro puntual y cero preocupaciones.' }
];

function starsHTML(r) {
  let s = '';
  for (let k = 1; k <= 5; k++) {
    s += r >= k ? '<i class="bi bi-star-fill"></i>' : (r >= k - 0.5 ? '<i class="bi bi-star-half"></i>' : '<i class="bi bi-star"></i>');
  }
  return s;
}

function initReviews() {
  const track = $('#reviewsTrack');
  if (!track) return;

  const hue = n => [...n].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  const initials = n => n.replace(/[^\p{L}\s]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');

  track.innerHTML = REVIEWS.map(r => `
    <article class="review-card">
      <div class="review-top">
        <i class="bi bi-quote review-quote" aria-hidden="true"></i>
        <span class="stars" role="img" aria-label="${r.rating} de 5 estrellas">${starsHTML(r.rating)}</span>
      </div>
      <p class="review-text">${r.text}</p>
      <div class="review-foot">
        <span class="avatar" style="--h:${hue(r.name)}" aria-hidden="true">${initials(r.name)}</span>
        <div><strong>${r.name}</strong><small>${r.detail}</small></div>
        <span class="review-date">${r.date}</span>
      </div>
    </article>`).join('');

  // Resumen: media y número de opiniones calculados del array
  const avg = REVIEWS.reduce((a, r) => a + r.rating, 0) / REVIEWS.length;
  $('#reviewsAvg').textContent = avg.toFixed(1).replace('.', ',');
  $('#reviewsStars').innerHTML = starsHTML(Math.round(avg * 2) / 2);
  $('#reviewsCount').textContent = `Media de ${REVIEWS.length} opiniones de clientes`;

  // Carrusel
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const step = () => {
    const card = track.querySelector('.review-card');
    return card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0);
  };
  const atEnd = () => track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
  const next = () => (atEnd() ? track.scrollTo({ left: 0, behavior: 'smooth' }) : track.scrollBy({ left: step(), behavior: 'smooth' }));
  const prev = () => (track.scrollLeft <= 4 ? track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' }) : track.scrollBy({ left: -step(), behavior: 'smooth' }));

  let paused = false, timer = null;
  $('#revNext').addEventListener('click', () => { next(); pauseAWhile(); });
  $('#revPrev').addEventListener('click', () => { prev(); pauseAWhile(); });
  function pauseAWhile() { paused = true; clearTimeout(timer); timer = setTimeout(() => (paused = false), 10000); }

  const section = $('#opiniones');
  section.addEventListener('mouseenter', () => (paused = true));
  section.addEventListener('mouseleave', () => (paused = false));
  section.addEventListener('focusin', () => (paused = true));
  section.addEventListener('focusout', () => (paused = false));
  track.addEventListener('touchstart', pauseAWhile, { passive: true });

  if (!reduce) setInterval(() => { if (!paused && !document.hidden) next(); }, 6500);
}



function initSellForm() {
  const form = $('#sellForm');
  if (!form) return;
  const okBox = $('#slOk');
  const q = $('#slCaptchaQ');
  const contactoError = $('#slContactoError');
  let answer = 0;

  const newCaptcha = () => {
    const a = 1 + Math.floor(Math.random() * 9);
    const b = 1 + Math.floor(Math.random() * 9);
    answer = a + b;
    q.textContent = `${a} + ${b} =`;
    $('#slCaptcha').value = '';
  };

  const rules = {
    slDonde: el => el.value.trim().length >= 3,
    slEmail: el => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()),
    slTel: el => /^(\+34)?[\s-]?[6-9]\d{2}[\s-]?\d{3}[\s-]?\d{3}$/.test(el.value.trim()),
    slPriv: el => el.checked,
    slCaptcha: el => el.value.trim() !== '' && Number(el.value.trim()) === answer
  };
  const check = id => {
    const el = document.getElementById(id);
    const ok = rules[id](el);
    el.classList.toggle('is-invalid', !ok);
    return ok;
  };
  const checkContacto = () => {
    const ok = !!form.querySelector('input[name="slContacto"]:checked');
    contactoError.classList.toggle('show', !ok);
    return ok;
  };

  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', () => check(id));
    el.addEventListener('input', () => { if (el.classList.contains('is-invalid')) check(id); });
  });
  $$('input[name="slContacto"]', form).forEach(r => r.addEventListener('change', checkContacto));

  form.addEventListener('submit', e => {
    e.preventDefault();
    okBox.classList.add('d-none');
    if ($('#slWeb').value) return; // campo trampa: es un bot

    const results = Object.keys(rules).map(check);
    const contactoOk = checkContacto();
    if (!results.every(Boolean) || !contactoOk) {
      (form.querySelector('.is-invalid') || form.querySelector('input[name="slContacto"]')).focus();
      return;
    }

    // TODO: enviar estos datos a tu servidor o a un servicio como Formspree
    console.log('Vender/alquilar:', {
      donde: $('#slDonde').value.trim(), email: $('#slEmail').value.trim(),
      telefono: $('#slTel').value.trim(), contacto: form.querySelector('input[name="slContacto"]:checked').value
    });

    form.reset();
    $$('.is-invalid', form).forEach(el => el.classList.remove('is-invalid'));
    contactoError.classList.remove('show');
    newCaptcha();
    okBox.classList.remove('d-none');
  });

  newCaptcha();
}

/* ---------- Inicialización ---------- */
function init() {
  // Selects
  const tipos = uniq(PROPERTIES.map(p => p.tipo));
  const pobs = uniq(PROPERTIES.map(p => p.poblacion));
  fillSelect($('#fTipo'), tipos, 'Todos');
  fillSelect($('#fPoblacion'), pobs, 'Todas');
  fillSelect($('#heroTipo'), tipos, 'Tipo');
  fillSelect($('#heroPoblacion'), pobs, 'Población');
  updateZonas('#fZona', '');
  updateZonas('#heroZona', '');

  // Checkboxes de características
  $('#featuresBox').innerHTML = FEATURES.map((f, i) => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${f}" id="feat${i}">
      <label class="form-check-label" for="feat${i}">${f}</label>
    </div>`).join('');

  // Destacadas
  $('#featuredGrid').innerHTML = PROPERTIES.filter(p => p.featured).slice(0, 3).map(cardHTML).join('');

  // Eventos filtros
  $$('input[name="op"]').forEach(r => r.addEventListener('change', () => { state.op = r.value; state.shown = PAGE_SIZE; render(); }));
  $('#fTipo').addEventListener('change', e => { state.tipo = e.target.value; state.shown = PAGE_SIZE; render(); });
  $('#fPoblacion').addEventListener('change', e => {
    state.poblacion = e.target.value; state.zona = '';
    updateZonas('#fZona', state.poblacion); state.shown = PAGE_SIZE; render();
  });
  $('#fZona').addEventListener('change', e => { state.zona = e.target.value; state.shown = PAGE_SIZE; render(); });
  ['Desde', 'Hasta', 'M2', 'Ref'].forEach(k => {
    $('#f' + k).addEventListener('input', e => { state[k.toLowerCase()] = e.target.value; state.shown = PAGE_SIZE; render(); });
  });
  $('#fOrden').addEventListener('change', e => { state.orden = e.target.value; render(); });

  $$('.chips').forEach(group => group.addEventListener('click', e => {
    const chip = e.target.closest('.chip'); if (!chip) return;
    state[group.dataset.chips] = +chip.dataset.val;
    $$('.chip', group).forEach(c => c.classList.toggle('active', c === chip));
    state.shown = PAGE_SIZE; render();
  }));

  $('#featuresBox').addEventListener('change', e => {
    e.target.checked ? state.feats.add(e.target.value) : state.feats.delete(e.target.value);
    state.shown = PAGE_SIZE; render();
  });

  $('#resetFilters').addEventListener('click', resetState);
  $('#emptyReset').addEventListener('click', resetState);

  // Quitar etiqueta activa
  $('#activeTags').addEventListener('click', e => {
    const t = e.target.closest('.tag'); if (!t) return;
    const k = t.dataset.key;
    if (k.startsWith('feat:')) state.feats.delete(k.slice(5));
    else if (k === 'beds' || k === 'baths') state[k] = 0;
    else state[k] = '';
    if (k === 'poblacion') state.zona = '';
    syncForm(); render();
  });

  // Ver más
  $('#loadMore').addEventListener('click', () => { state.shown += PAGE_SIZE; render(); });

  // Buscador del hero
  let heroOp = 'venta';
  $$('#heroOp .nav-link').forEach(b => b.addEventListener('click', () => {
    heroOp = b.dataset.op;
    $$('#heroOp .nav-link').forEach(x => x.classList.toggle('active', x === b));
  }));
  $('#heroPoblacion').addEventListener('change', e => updateZonas('#heroZona', e.target.value));
  $('#heroSearch').addEventListener('submit', e => {
    e.preventDefault();
    Object.assign(state, {
      op: heroOp, tipo: $('#heroTipo').value, poblacion: $('#heroPoblacion').value,
      zona: $('#heroZona').value, desde: $('#heroDesde').value, hasta: $('#heroHasta').value,
      ref: $('#heroRef').value, shown: PAGE_SIZE
    });
    syncForm(); render();
    $('#propiedades').scrollIntoView({ behavior: 'smooth' });
  });

  // Accesos rápidos del menú
  $$('.quick-filter').forEach(a => a.addEventListener('click', () => {
    resetState();
    if (a.dataset.op) state.op = a.dataset.op;
    if (a.dataset.tipo) state.tipo = a.dataset.tipo;
    syncForm(); render();
  }));

  // Formulario de contacto
  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) { form.classList.add('was-validated'); return; }
    // Aquí iría el envío real (fetch a tu backend / Formspree, etc.)
    form.reset(); form.classList.remove('was-validated');
    $('#contactOk').classList.remove('d-none');
  });

  // Filtros desde la URL (ej. index.html?op=venta&tipo=Piso#propiedades)
  const params = new URLSearchParams(location.search);
  if (params.get('op')) state.op = params.get('op');
  if (params.get('tipo')) state.tipo = params.get('tipo');
  syncForm();

  // Destacadas: aparecen escalonadas al hacer scroll
  $$('#featuredGrid > div').forEach((el, k) => { el.dataset.reveal = 'up'; el.dataset.delay = k * 120; });

  initHero();
  initReviews();
  initSellForm();
  initReveal();

  render();
}

document.addEventListener('DOMContentLoaded', init);
