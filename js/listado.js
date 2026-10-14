
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const OP = document.body.dataset.op;
  const PAGE_SIZE = 6;
  const base = PROPERTIES.filter(p => p.op === OP);

  const state = {
    poblacion: '', zona: '', tipo: '', desde: '', hasta: '', ref: '',
    beds: 0, baths: 0, feats: new Set(), orden: 'fecha-desc', page: 1
  };

  const el = {
    pob: $('#lPoblacion'), zona: $('#lZona'), tipo: $('#lTipo'),
    desde: $('#lDesde'), hasta: $('#lHasta'), ref: $('#lRef'),
    count: $('#lCount'), orden: $('#lOrden'), grid: $('#lGrid'),
    pager: $('#lPager'), empty: $('#lEmpty'), reset: $('#lReset'),
    moreCount: $('#moreCount'), feats: $('#lFeats')
  };

  /* ---------- Selects (solo con datos de esta operación) ---------- */
  fillSelect(el.pob, uniq(base.map(p => p.poblacion)), 'Población');
  fillSelect(el.tipo, uniq(base.map(p => p.tipo)), 'Tipo');
  function updateZonas() {
    const zonas = uniq(base.filter(p => !state.poblacion || p.poblacion === state.poblacion).map(p => p.zona));
    fillSelect(el.zona, zonas, 'Zona');
    el.zona.value = zonas.includes(state.zona) ? state.zona : '';
    state.zona = el.zona.value;
  }
  updateZonas();

  const featsAvailable = FEATURES.filter(f => base.some(p => p.feats.includes(f)));
  el.feats.innerHTML = featsAvailable.map((f, i) => `
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="${f}" id="lf${i}">
      <label class="form-check-label" for="lf${i}">${f}</label>
    </div>`).join('');

  /* ---------- Filtrar y ordenar ---------- */
  const sorters = {
    'fecha-desc': (a, b) => b.date.localeCompare(a.date),
    'fecha-asc': (a, b) => a.date.localeCompare(b.date),
    'precio-asc': (a, b) => a.price - b.price,
    'precio-desc': (a, b) => b.price - a.price,
    'm2-desc': (a, b) => b.m2 - a.m2
  };

  function getFiltered() {
    const s = state;
    return base.filter(p =>
      (!s.poblacion || p.poblacion === s.poblacion) &&
      (!s.zona || p.zona === s.zona) &&
      (!s.tipo || p.tipo === s.tipo) &&
      (!s.desde || p.price >= +s.desde) &&
      (!s.hasta || p.price <= +s.hasta) &&
      (!s.ref || p.ref.toLowerCase().includes(s.ref.toLowerCase().trim())) &&
      p.beds >= s.beds && p.baths >= s.baths &&
      [...s.feats].every(f => p.feats.includes(f))
    ).sort(sorters[s.orden]);
  }

  /* ---------- Pintar ---------- */
  function render() {
    const list = getFiltered();
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    state.page = Math.min(state.page, pages);

    el.count.textContent = `${list.length} ${list.length === 1 ? 'PROPIEDAD' : 'PROPIEDADES'}`;
    el.grid.innerHTML = list.slice((state.page - 1) * PAGE_SIZE, state.page * PAGE_SIZE).map(cardHTML).join('');
    el.empty.classList.toggle('d-none', list.length > 0);
    renderPager(pages);

    // Contador de filtros extra y botón de borrar
    const extra = (state.beds ? 1 : 0) + (state.baths ? 1 : 0) + state.feats.size;
    el.moreCount.textContent = extra;
    el.moreCount.hidden = extra === 0;
    const anyFilter = extra || state.poblacion || state.zona || state.tipo || state.desde || state.hasta || state.ref;
    el.reset.hidden = !anyFilter;
  }

  function renderPager(pages) {
    if (pages <= 1) { el.pager.innerHTML = ''; return; }
    const cur = state.page;
    const btn = (label, go, aria, current) =>
      `<li><button type="button" data-go="${go}" aria-label="${aria}" ${current ? 'aria-current="page"' : ''}>${label}</button></li>`;
    let html = '';
    if (cur > 1) html += btn('&lt;&lt;', 1, 'Primera página') + btn('&lt;', cur - 1, 'Página anterior');
    let start = Math.max(1, cur - 2);
    const end = Math.min(pages, start + 4);
    start = Math.max(1, end - 4);
    for (let n = start; n <= end; n++) html += btn(n, n, `Página ${n}`, n === cur);
    if (cur < pages) html += btn('&gt;', cur + 1, 'Página siguiente') + btn('&gt;&gt;', pages, 'Última página');
    el.pager.innerHTML = html;
  }

  /* ---------- Eventos ---------- */
  const apply = () => { state.page = 1; render(); };

  el.pob.addEventListener('change', e => { state.poblacion = e.target.value; updateZonas(); apply(); });
  el.zona.addEventListener('change', e => { state.zona = e.target.value; apply(); });
  el.tipo.addEventListener('change', e => { state.tipo = e.target.value; apply(); });
  ['desde', 'hasta', 'ref'].forEach(k => el[k].addEventListener('input', e => { state[k] = e.target.value; apply(); }));
  el.orden.addEventListener('change', e => { state.orden = e.target.value; apply(); });

  $$('.chips').forEach(group => group.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    state[group.dataset.chips] = +chip.dataset.val;
    $$('.chip', group).forEach(c => c.classList.toggle('active', c === chip));
    apply();
  }));

  el.feats.addEventListener('change', e => {
    e.target.checked ? state.feats.add(e.target.value) : state.feats.delete(e.target.value);
    apply();
  });

  el.pager.addEventListener('click', e => {
    const b = e.target.closest('button[data-go]');
    if (!b) return;
    state.page = +b.dataset.go;
    render();
    $('#resultsTop').scrollIntoView({ behavior: 'smooth' });
  });

  function resetAll() {
    Object.assign(state, { poblacion: '', zona: '', tipo: '', desde: '', hasta: '', ref: '', beds: 0, baths: 0, page: 1 });
    state.feats.clear();
    $('#listSearch').reset();
    el.pob.value = ''; el.tipo.value = '';
    updateZonas();
    $$('.chips').forEach(g => $$('.chip', g).forEach((c, i) => c.classList.toggle('active', i === 0)));
    render();
  }
  el.reset.addEventListener('click', resetAll);
  $('#lEmptyReset').addEventListener('click', resetAll);

  // "Buscar": el filtrado ya es en directo; el botón lleva a los resultados
  $('#listSearch').addEventListener('submit', e => {
    e.preventDefault();
    apply();
    $('#resultsTop').scrollIntoView({ behavior: 'smooth' });
  });

  /* ---------- Filtros desde la URL (ej. venta.html?tipo=Piso&poblacion=Utiel) ---------- */
  const q = new URLSearchParams(location.search);
  if (q.get('poblacion') && [...el.pob.options].some(o => o.value === q.get('poblacion'))) {
    state.poblacion = el.pob.value = q.get('poblacion'); updateZonas();
  }
  if (q.get('tipo') && [...el.tipo.options].some(o => o.value === q.get('tipo'))) state.tipo = el.tipo.value = q.get('tipo');
  if (q.get('ref')) state.ref = el.ref.value = q.get('ref');

  render();
})();
