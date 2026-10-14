
(function () {
  'use strict';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="875"><rect width="100%" height="100%" fill="#dfe6ea"/><text x="50%" y="50%" fill="#8a97a0" font-family="Arial" font-size="40" text-anchor="middle">Inmobiliaria Requena</text></svg>'
  );

  /* ---------- Buscar la propiedad ---------- */
  const ref = (new URLSearchParams(location.search).get('ref') || '').trim().toUpperCase();
  const p = PROPERTIES.find(x => x.ref.toUpperCase() === ref);

  if (!p) {
    $('#pdMain').hidden = true;
    $('#pdMissing').hidden = false;
    document.title = 'Propiedad no encontrada | Inmobiliaria Requena';
    return;
  }

  const esLocal = p.tipo === 'Local' || p.tipo === 'Oficina';
  const priceText = p.op === 'alquiler' ? `${fmtNum(p.price)}€ MES` : `${fmtNum(p.price)}€`;
  const yn = v => (v ? 'Si' : 'No');
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Título, migas y metadatos ---------- */
  document.title = `${p.title} (${p.ref}) | Inmobiliaria Requena`;
  $('#metaDesc').setAttribute('content', `${p.tipo} en ${p.poblacion} (${p.zona}). ${p.beds ? p.beds + ' dormitorios, ' : ''}${p.m2} m². ${priceText}. Ref. ${p.ref}.`);
  $('#pdTitle').textContent = p.title;
  $('#pdCrumb').textContent = `${p.tipo} en ${p.poblacion} · ${p.ref}`;

  /* ---------- Resumen junto a la galería ---------- */
  const facts = [];
  if (p.beds) facts.push(`<li><i class="bi bi-door-open"></i> ${p.beds} dormitorios</li>`);
  facts.push(`<li><i class="bi bi-droplet"></i> ${p.baths} ${esLocal ? (p.baths === 1 ? 'aseo' : 'aseos') : (p.baths === 1 ? 'baño' : 'baños')}</li>`);
  facts.push(`<li><i class="bi bi-house"></i> ${p.m2} m² construidos</li>`);
  facts.push(`<li><i class="bi bi-geo-alt"></i> ${esc(p.zona)}, ${esc(p.poblacion)}</li>`);
  $('#pdSummary').innerHTML = `
    <span class="pd-tag">${p.op === 'venta' ? 'En venta' : 'En alquiler'}</span>
    <div class="pd-price">${priceText}</div>
    <div class="pd-ref">Ref. ${p.ref}</div>
    <ul class="pd-facts">${facts.join('')}</ul>
    <a class="btn btn-brand" href="tel:+34900000000"><i class="bi bi-telephone-fill"></i> Llamar ahora</a>`;

  /* ---------- Descripción ---------- */
  $('#pdDesc').setAttribute('aria-labelledby', 'hDesc');
  $('#pdDesc').innerHTML = `
    <h2 class="pd-h" id="hDesc">Descripción</h2>
    <h3 class="pd-title">${esc(p.title)}</h3>
    ${p.desc.map(t => `<p>${esc(t)}</p>`).join('')}`;

  /* ---------- Características ---------- */
  const left = [
    ['Referencia', p.ref],
    ['Provincia', p.provincia],
    ['Población', p.poblacion],
    ['Zona', p.zona],
    ['Orientación', p.orient],
    ['Construidos', p.m2 + ' m²'],
    ['Superficie útil', p.util ? p.util + ' m²' : null],
    ['Parcela', p.parcela ? fmtNum(p.parcela) + ' m²' : null]
  ];
  const right = [
    ['Precio', priceText, 'price'],
    ['Conservación', p.cons],
    ...(p.dorms ? [['Dormitorios simples', p.dorms[0]], ['Dormitorios dobles', p.dorms[1]]] : []),
    [esLocal ? 'Aseos' : 'Baños', p.baths],
    ['Garaje', yn(p.garaje)],
    ['Aire acondicionado', yn(p.aire)],
    ['Suelo', p.suelo],
    ['Planta', p.planta],
    ['Instalación eléctrica', p.elec],
    ['Agua caliente', p.agua],
    ['Tipo de exterior', p.ext]
  ];
  const dl = rows => `<dl class="spec">${rows
    .filter(r => r[1] !== null && r[1] !== undefined && r[1] !== '')
    .map(r => `<div class="spec-row ${r[2] || ''}"><dt>${r[0]}</dt><dd>${esc(r[1])}</dd></div>`).join('')}</dl>`;
  $('#pdSpecs').innerHTML = `<div class="col-md-6">${dl(left)}</div><div class="col-md-6">${dl(right)}</div>`;

  /* ---------- Extras ---------- */
  const extras = [...new Set([...p.feats, ...(p.extras || [])])];
  $('#pdExtras').innerHTML = extras.map(e => `<li>${esc(e)} <i class="bi bi-check-lg" aria-label="Incluido"></i></li>`).join('');

  /* ---------- Mapa ---------- */
  const d = 0.006;
  $('#pdMap').src = `https://www.openstreetmap.org/export/embed.html?bbox=${p.lng - d}%2C${p.lat - d}%2C${p.lng + d}%2C${p.lat + d}&layer=mapnik&marker=${p.lat}%2C${p.lng}`;

  /* ---------- Certificado energético ---------- */
  const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const COLORS = ['#009a5a', '#1db25a', '#8cc63f', '#ffcc00', '#f5a35c', '#f08320', '#e8203a'];
  (function energy() {
    const e = p.energia;
    const idx = e ? LETTERS.indexOf(e.letra) : -1;
    const bars = LETTERS.map((L, i) =>
      `<div class="en-bar"><span style="--c:${COLORS[i]};width:${40 + i * 9}%">${L}</span></div>`).join('');
    const mark = v => (e ? `<div class="en-mark" style="--c:${COLORS[idx]};--idx:${idx}">${v} ${e.letra}</div>` : '');
    $('#pdEnergy').innerHTML = `
      <div class="en">
        <div class="en-head">
          <div>MUY EFICIENTE</div>
          <div>Consumo de energía<small>(KW h / m² año):</small></div>
          <div>Emisiones<small>(Kg CO₂ / m² año):</small></div>
        </div>
        <div class="en-body">
          <div class="en-scale">${bars}</div>
          <div class="en-col">${e ? mark(e.cons) : ''}</div>
          <div class="en-col">${e ? mark(e.emis) : ''}</div>
          ${e ? '' : '<div class="en-pending">En trámite</div>'}
        </div>
        <div class="en-foot">POCO EFICIENTE</div>
      </div>`;
  })();

 
  (function gallery() {
    const imgs = p.gallery;
    const gal = $('#gallery');
    const layers = [$('#galA'), $('#galB')];
    const thumbs = $('#thumbs');
    const playBtn = $('#galPlay');
    const fullBtn = $('#galFull');
    let i = 0, top = 0, timer = null, playing = false;

    thumbs.innerHTML = imgs.map((u, k) =>
      `<button type="button" class="th" data-i="${k}" aria-label="Ver foto ${k + 1} de ${imgs.length}"><img src="${u.replace('w=1400', 'w=160')}" alt="" loading="lazy"></button>`).join('');
    $$('.th img', thumbs).forEach(im => im.addEventListener('error', () => { im.src = FALLBACK; }, { once: true }));
    const ths = $$('.th', thumbs);

    function setFirst() {
      layers[0].onerror = () => { layers[0].onerror = null; layers[0].src = FALLBACK; };
      layers[0].alt = `${p.title} - foto 1 de ${imgs.length}`;
      layers[0].src = imgs[0];
    }

    function show(n) {
      i = (n + imgs.length) % imgs.length;
      const next = layers[1 - top];
      const swap = () => { next.classList.add('on'); layers[top].classList.remove('on'); top = 1 - top; };
      next.onload = swap;
      next.onerror = () => { next.onerror = null; next.src = FALLBACK; };
      next.alt = `${p.title} - foto ${i + 1} de ${imgs.length}`;
      next.src = imgs[i];
      $('#galCount').textContent = `${i + 1} / ${imgs.length}`;
      ths.forEach((t, k) => {
        t.classList.toggle('active', k === i);
        t.setAttribute('aria-current', k === i);
      });
      const t = ths[i];
      thumbs.scrollTo({ left: t.offsetLeft - thumbs.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' });
    }

    function play() {
      if (timer) clearInterval(timer);
      playing = true;
      timer = setInterval(() => show(i + 1), 4500);
      playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
      playBtn.setAttribute('aria-label', 'Pausar el pase automático');
    }
    function pause() {
      clearInterval(timer); timer = null; playing = false;
      playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
      playBtn.setAttribute('aria-label', 'Reanudar el pase automático');
    }
    const manual = n => { show(n); if (playing) play(); }; // reinicia la cuenta atrás

    $('#galPrev').addEventListener('click', () => manual(i - 1));
    $('#galNext').addEventListener('click', () => manual(i + 1));
    ths.forEach(t => t.addEventListener('click', () => manual(+t.dataset.i)));
    $('#thPrev').addEventListener('click', () => thumbs.scrollBy({ left: -thumbs.clientWidth * 0.8, behavior: 'smooth' }));
    $('#thNext').addEventListener('click', () => thumbs.scrollBy({ left: thumbs.clientWidth * 0.8, behavior: 'smooth' }));
    playBtn.addEventListener('click', () => (playing ? pause() : play()));

    if (gal.requestFullscreen) {
      fullBtn.addEventListener('click', () => (document.fullscreenElement ? document.exitFullscreen() : gal.requestFullscreen()));
    } else {
      fullBtn.hidden = true;
    }

    gal.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); manual(i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); manual(i + 1); }
    });

    let x0 = null;
    const stage = $('#galStage');
    stage.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) manual(dx < 0 ? i + 1 : i - 1);
      x0 = null;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => { if (document.hidden && playing) { clearInterval(timer); } else if (playing) { play(); } });

    setFirst();
    $('#galCount').textContent = `1 / ${imgs.length}`;
    ths[0].classList.add('active');
    if (!reduceMotion && imgs.length > 1) play(); else pause();
  })();


  const RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const RE_TEL = /^(\+34)?[\s-]?[6-9]\d{2}[\s-]?\d{3}[\s-]?\d{3}$/;

  (function sideForm() {
    const form = $('#pdContact');
    const msg = $('#sMsg');
    msg.value = `Hola, estoy interesado/a en la propiedad Ref. ${p.ref} (${p.title}). Quisiera recibir más información.`;

    const rules = {
      sNombre: el => el.value.trim().length >= 2,
      sEmail: el => RE_EMAIL.test(el.value.trim()),
      sTel: el => RE_TEL.test(el.value.trim()),
      sMsg: el => el.value.trim().length >= 5,
      sPriv: el => el.checked
    };
    const check = id => {
      const el = document.getElementById(id);
      const ok = rules[id](el);
      el.classList.toggle('is-invalid', !ok);
      return ok;
    };
    Object.keys(rules).forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener(el.type === 'checkbox' ? 'change' : 'blur', () => check(id));
      el.addEventListener('input', () => { if (el.classList.contains('is-invalid')) check(id); });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      $('#sOk').classList.add('d-none');
      if ($('#sWeb').value) return; // bot
      const ok = Object.keys(rules).map(check).every(Boolean);
      if (!ok) { form.querySelector('.is-invalid').focus(); return; }

      console.log('Contacto propiedad', p.ref, {
        nombre: $('#sNombre').value, email: $('#sEmail').value, telefono: $('#sTel').value, mensaje: msg.value
      });
      form.reset();
      msg.value = `Hola, estoy interesado/a en la propiedad Ref. ${p.ref}.`;
      $('#sOk').classList.remove('d-none');
    });
  })();

 
  const toast = $('#pdToast');
  const say = t => { toast.textContent = t; clearTimeout(say.t); say.t = setTimeout(() => (toast.textContent = ''), 6000); };

  $('#btnPdf').addEventListener('click', () => {
    say('En la ventana que se abre elige "Guardar como PDF" como destino.');
    setTimeout(() => window.print(), 300);
  });
  $('#btnPrint').addEventListener('click', () => window.print());

  $('#btnShare').addEventListener('click', async () => {
    const data = { title: p.title, text: `${p.tipo} en ${p.poblacion} · Ref. ${p.ref} · ${priceText}`, url: location.href };
    if (navigator.share) {
      try { await navigator.share(data); return; } catch (err) { if (err.name === 'AbortError') return; }
    }
    window.location.href = `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(data.text + '\n' + data.url)}`;
  });

  
  const tomorrow = (() => { const t = new Date(); t.setDate(t.getDate() + 1); return t.toISOString().slice(0, 10); })();
  const HOURS = []; for (let h = 10; h < 19; h++) { HOURS.push(`${h}:00`, `${h}:30`); }

  const nameF = { id: 'nombre', label: 'Nombre', type: 'text', ac: 'name', test: v => v.trim().length >= 2, msg: 'Escribe tu nombre.' };
  const telF = { id: 'tel', label: 'Teléfono', type: 'tel', ac: 'tel', test: v => RE_TEL.test(v.trim()), msg: 'Introduce un teléfono válido (9 cifras).' };
  const mailF = { id: 'email', label: 'Email', type: 'email', ac: 'email', test: v => RE_EMAIL.test(v.trim()), msg: 'Introduce un email válido.' };

  const MODES = {
    oferta: {
      title: 'Hacer una oferta',
      intro: `Propiedad Ref. ${p.ref} · precio publicado: ${priceText}. Tu oferta no es vinculante; la trasladaremos al propietario.`,
      ok: '¡Oferta recibida! La trasladaremos al propietario y te contactaremos en breve.',
      fields: [nameF, telF, mailF,
        { id: 'importe', label: p.op === 'alquiler' ? 'Tu oferta (€ al mes)' : 'Tu oferta (€)', type: 'number', min: 1, test: v => Number(v) > 0, msg: 'Indica un importe válido.' },
        { id: 'coment', label: 'Comentarios (opcional)', type: 'textarea', optional: true }]
    },
    cita: {
      title: 'Pide una cita',
      intro: `Elige cuándo te viene bien visitar la propiedad Ref. ${p.ref}. Atendemos de lunes a viernes, de 10:00 a 19:00.`,
      ok: '¡Solicitud enviada! Te confirmaremos la cita por teléfono.',
      fields: [nameF, telF,
        { id: 'fecha', label: 'Fecha', type: 'date', min: tomorrow, test: v => { if (!v || v < tomorrow) return false; const day = new Date(v + 'T12:00:00').getDay(); return day >= 1 && day <= 5; }, msg: 'Elige un día de lunes a viernes a partir de mañana.' },
        { id: 'hora', label: 'Hora', type: 'select', options: HOURS, test: v => v !== '', msg: 'Elige una hora.' }]
    },
    llamada: {
      title: '¿Te llamamos?',
      intro: 'Déjanos tu teléfono y te llamamos para hablar de esta propiedad.',
      ok: '¡Gracias! Te llamaremos en la franja que has elegido.',
      fields: [nameF, telF,
        { id: 'franja', label: '¿Cuándo prefieres que te llamemos?', type: 'select', options: ['Mañana (10:00 - 14:00)', 'Tarde (14:00 - 19:00)'], test: v => v !== '', msg: 'Elige una franja.' }]
    }
  };

  const modalEl = $('#actionModal');
  const modal = new bootstrap.Modal(modalEl);
  const form = $('#actionForm');
  let mode = null;

  const fieldHTML = f => {
    const id = 'am-' + f.id;
    let control;
    if (f.type === 'select') {
      control = `<select class="form-select" id="${id}"><option value="">Elige…</option>${f.options.map(o => `<option>${o}</option>`).join('')}</select>`;
    } else if (f.type === 'textarea') {
      control = `<textarea class="form-control" id="${id}" rows="3"></textarea>`;
    } else {
      control = `<input class="form-control" id="${id}" type="${f.type}" ${f.min ? `min="${f.min}"` : ''} autocomplete="${f.ac || 'off'}">`;
    }
    return `<div class="mb-3"><label class="form-label" for="${id}">${f.label}</label>${control}<div class="invalid-feedback">${f.msg || ''}</div></div>`;
  };

  $$('[data-action]').forEach(btn => btn.addEventListener('click', () => {
    mode = MODES[btn.dataset.action];
    $('#actionTitle').textContent = mode.title;
    $('#actionIntro').textContent = mode.intro;
    $('#actionFields').innerHTML = mode.fields.map(fieldHTML).join('');
    $('#actionOk').classList.add('d-none');
    $('#actionFields').classList.remove('d-none');
    $('#actionSubmit').classList.remove('d-none');
    modal.show();
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!mode) return;
    let valid = true, first = null;
    const data = { ref: p.ref, accion: mode.title };
    mode.fields.forEach(f => {
      const el = document.getElementById('am-' + f.id);
      const ok = f.optional ? true : f.test(el.value);
      el.classList.toggle('is-invalid', !ok);
      if (!ok) { valid = false; first = first || el; }
      data[f.id] = el.value.trim();
    });
    if (!valid) { first.focus(); return; }

    console.log('Solicitud', data);
    $('#actionFields').classList.add('d-none');
    $('#actionSubmit').classList.add('d-none');
    $('#actionOk').textContent = mode.ok;
    $('#actionOk').classList.remove('d-none');
  });
})();
