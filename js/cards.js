

const favs = new Set();

const uniq = arr => [...new Set(arr)].sort((a, b) => a.localeCompare(b, 'es'));

const fmtPrice = p => (p.op === 'alquiler' ? `${fmtNum(p.price)}€ MES` : `${fmtNum(p.price)}€`);

const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#dfe6ea"/><text x="50%" y="50%" fill="#8a97a0" font-family="Arial" font-size="28" text-anchor="middle">Inmobiliaria Requena</text></svg>'
);

function fillSelect(sel, values, firstLabel) {
  sel.innerHTML = `<option value="">${firstLabel}</option>` +
    values.map(v => `<option value="${v}">${v}</option>`).join('');
}


function cardHTML(p) {
  const href = `propiedad.html?ref=${p.ref}`;
  const feats = p.feats.slice(0, 3).map(f => `<small>${f}</small>`).join('');
  const more = p.feats.length > 3 ? `<small>+${p.feats.length - 3}</small>` : '';
  const badges = (p.tour ? '<span class="prop-badge" title="Tour 360">360°</span>' : '') +
                 (p.video ? '<span class="prop-badge" title="Vídeo"><i class="bi bi-play-fill"></i></span>' : '');
  return `
  <div class="col-md-6 col-xl-4">
    <article class="prop-card">
      <div class="prop-media">
        <a class="prop-media-link" href="${href}" aria-label="Ver ${p.title}"><img src="${p.img}" alt="${p.tipo} en ${p.poblacion}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK}'"></a>
        <div class="prop-badges">${badges}</div>
        <span class="op-tag">${p.op === 'venta' ? 'Venta' : 'Alquiler'}</span>
        <button class="fav-btn ${favs.has(p.ref) ? 'on' : ''}" data-ref="${p.ref}" aria-label="Guardar en favoritos"><i class="bi bi-heart-fill"></i></button>
        <span class="prop-ref">Ref. ${p.ref}</span>
      </div>
      <div class="prop-body">
        <h3 class="prop-type">${p.tipo} en ${p.poblacion}</h3>
        <p class="prop-zone">Zona: <span>${p.zona}</span></p>
        <h4 class="prop-title"><a href="${href}">${p.title}</a></h4>
        <div class="prop-feats">${feats}${more}</div>
        <div class="prop-meta">
          <span><i class="bi bi-door-open"></i> ${p.beds}</span>
          <span><i class="bi bi-droplet"></i> ${p.baths}</span>
          <span><i class="bi bi-house"></i> ${p.m2} m²</span>
        </div>
        <div class="prop-price">${fmtPrice(p)}</div>
      </div>
    </article>
  </div>`;
}

/* Favoritos (corazón): funciona en cualquier rejilla de tarjetas */
document.addEventListener('click', e => {
  const btn = e.target.closest('.fav-btn');
  if (!btn) return;
  const ref = btn.dataset.ref;
  favs.has(ref) ? favs.delete(ref) : favs.add(ref);
  document.querySelectorAll(`.fav-btn[data-ref="${ref}"]`).forEach(b => b.classList.toggle('on', favs.has(ref)));
});
