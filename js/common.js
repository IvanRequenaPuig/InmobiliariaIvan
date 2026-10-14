
(function () {
  'use strict';

  const SITE = {
    nombre: 'Inmobiliaria Requena',
    dominio: 'inmobiliariarequena.es',
    tel: '900 000 000',
    telLink: '+34900000000',
    horario: 'L-V 10 a 19 horas / S-D Cerrado',
    email: 'info@inmobiliariarequena.es',
    whatsapp: 'https://wa.me/34900000000'
  };

  const page = document.body.dataset.page || '';
  const act = p => (page === p ? ' active" aria-current="page' : '');
  const actAny = list => (list.includes(page) ? ' active" aria-current="page' : '');

  const headerHTML = `
  <div class="topbar">
    <div class="container d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-3">
        <a href="tel:${SITE.telLink}"><i class="bi bi-telephone-fill"></i> ${SITE.tel}</a>
        <span class="d-none d-sm-inline"><i class="bi bi-clock-fill"></i> ${SITE.horario}</span>
      </div>
      <div class="d-flex gap-3">
        <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
        <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
        <a href="mailto:${SITE.email}" aria-label="Email"><i class="bi bi-envelope"></i></a>
      </div>
    </div>
  </div>
  <nav class="navbar navbar-expand-lg main-nav sticky-top" aria-label="Principal">
    <div class="container">
      <a class="navbar-brand" href="index.html">
<img src="img/logo.png" alt="Inmobiliaria Requena" class="brand-logo">        <span class="brand-text">Inmobiliaria <strong>Requena</strong></span>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menu" aria-controls="menu" aria-expanded="false" aria-label="Abrir menú">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="menu">
        <ul class="navbar-nav ms-auto align-items-lg-center">
          <li class="nav-item"><a class="nav-link${act('home')}" href="index.html">Home</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle${actAny(['venta', 'alquiler'])}" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Propiedades</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="venta.html">Propiedades en Venta</a></li>
              <li><a class="dropdown-item" href="alquiler.html">Propiedades en Alquiler</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle${act('servicios')}" href="servicios.html" role="button" data-bs-toggle="dropdown" aria-expanded="false">Servicios</a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="servicios.html">Todos los servicios</a></li>
              <li><a class="dropdown-item" href="servicios.html#gestion">Gestión Inmobiliaria</a></li>
              <li><a class="dropdown-item" href="servicios.html#legal">Asesoramiento Legal Inmobiliario</a></li>
              <li><a class="dropdown-item" href="servicios.html#eficiencia">Eficiencia Energética</a></li>
              <li><a class="dropdown-item" href="servicios.html#reformas">Reformas Integrales</a></li>
              <li><a class="dropdown-item" href="servicios.html#financiero">Asesoramiento Financiero</a></li>
              <li><a class="dropdown-item" href="servicios.html#tasaciones">Tasaciones y Valoraciones</a></li>
              <li><a class="dropdown-item" href="servicios.html#traspasos">Traspaso y Venta de Negocios y Empresas</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link${act('promociones')}" href="promociones.html">Promociones</a></li>
          <li class="nav-item"><a class="nav-link${act('contacto')}" href="contacto.html">Contacto</a></li>
          <li class="nav-item"><a class="nav-link${act('formulario')}" href="formulario.html">Formulario</a></li>
        </ul>
      </div>
    </div>
  </nav>`;

  const footerHTML = `
  <footer class="site-footer">
    <div class="container">
      <div class="row g-4">
        <div class="col-md-6 col-lg-3">
          <h2 class="footer-title">${SITE.nombre}</h2>
          <ul class="footer-links">
            <li><a href="venta.html">Propiedades en venta</a></li>
            <li><a href="alquiler.html">Propiedades en alquiler</a></li>
            <li><a href="promociones.html">Promociones</a></li>
            <li><a href="formulario.html">Quiero vender mi propiedad</a></li>
            <li><a href="contacto.html">Contacto</a></li>
          </ul>
        </div>
        <div class="col-md-6 col-lg-6">
          <h2 class="footer-title">Nuestros servicios</h2>
          <ul class="footer-links cols-2">
            <li><a href="servicios.html#gestion">Gestión Inmobiliaria</a></li>
            <li><a href="servicios.html#legal">Asesoramiento Legal inmobiliario</a></li>
            <li><a href="servicios.html#eficiencia">Eficiencia Energética</a></li>
            <li><a href="servicios.html#reformas">Reformas Integrales</a></li>
            <li><a href="servicios.html#financiero">Asesoramiento Financiero</a></li>
            <li><a href="servicios.html#tasaciones">Tasaciones y Valoraciones</a></li>
            <li><a href="servicios.html#gestoria">Gestoría Inmobiliaria</a></li>
            <li><a href="servicios.html#traspasos">Traspaso y Venta de Negocios y Empresas</a></li>
          </ul>
        </div>
        <div class="col-md-6 col-lg-3">
          <h2 class="footer-title">Información</h2>
          <ul class="footer-links">
            <li><a href="aviso-legal.html">Aviso legal</a></li>
            <li><a href="politica-privacidad.html">Política de privacidad</a></li>
            <li><a href="#">Política de cookies</a></li>
            <li><a class="footer-phone" href="tel:${SITE.telLink}"><i class="bi bi-telephone-fill"></i> ${SITE.tel}</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span><strong>${SITE.nombre}</strong> © <span data-year></span> ${SITE.nombre}. Todos los derechos reservados.</span>
        <span class="footer-social">
          <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
          <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
        </span>
      </div>
    </div>
  </footer>`;

  const extrasHTML = `
  <a href="${SITE.whatsapp}" class="wa-btn" target="_blank" rel="noopener">
    <i class="bi bi-whatsapp"></i> <span class="wa-text">¿En qué podemos ayudarte?</span>
    <span class="wa-badge" aria-hidden="true">1</span>
  </a>
  <button class="to-top" id="toTop" type="button" aria-label="Subir arriba"><i class="bi bi-chevron-up"></i></button>

  <button class="consent-fab" id="consentFab" type="button" aria-label="Abrir preferencias de privacidad" aria-controls="consentPanel"><i class="bi bi-fingerprint"></i></button>
  <div class="consent-panel" id="consentPanel" role="dialog" aria-labelledby="consentTitle" tabindex="-1" hidden>
    <div class="consent-top">
      <span>${SITE.dominio}</span>
      <button class="consent-close" id="consentClose" type="button" aria-label="Cerrar">&times;</button>
    </div>
    <h2 id="consentTitle">Creemos que sus datos son de su propiedad y respaldamos su derecho a la privacidad y a la transparencia.</h2>
    <p class="consent-sub">Elija un nivel de acceso a los datos y su duración para elegir cómo utilizamos y compartimos sus datos.</p>
    <div class="consent-levels" role="radiogroup" aria-label="Nivel de acceso a los datos">
      <button type="button" class="level" role="radio" data-level="plata"><span class="dot dot-plata"></span>Plata</button>
      <button type="button" class="level" role="radio" data-level="oro"><span class="dot dot-oro"></span>Oro</button>
      <button type="button" class="level" role="radio" data-level="platino"><span class="dot dot-platino"></span>Platino</button>
      <select class="form-select consent-duration" id="consentDuration" aria-label="Duración">
        <option value="1">1 día</option>
        <option value="7">1 semana</option>
        <option value="30" selected>1 mes</option>
        <option value="365">1 año</option>
      </select>
    </div>
    <p class="consent-desc" id="consentDesc"></p>
    <div class="consent-custom" id="consentCustom" hidden>
      <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="pNec" checked disabled><label class="form-check-label" for="pNec">Necesarias<small>Imprescindibles para que el sitio funcione y sea seguro.</small></label></div>
      <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="pAnalytics" data-pref="analytics"><label class="form-check-label" for="pAnalytics">Analítica<small>Estadísticas anónimas de uso para mejorar la web.</small></label></div>
      <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="pPers" data-pref="personalization"><label class="form-check-label" for="pPers">Personalización<small>Recordar tus búsquedas y favoritos.</small></label></div>
      <div class="form-check form-switch"><input class="form-check-input" type="checkbox" id="pMkt" data-pref="marketing"><label class="form-check-label" for="pMkt">Marketing<small>Anuncios y contenidos adaptados a ti.</small></label></div>
    </div>
    <div class="consent-actions">
      <button type="button" class="consent-link" id="consentCustomize" aria-expanded="false" aria-controls="consentCustom"><span class="consent-switch"></span> Personalice</button>
      <button type="button" class="consent-save" id="consentSave">Guardar mis preferencias</button>
      <a href="#">Política de privacidad</a>
    </div>
  </div>`;

  function mount(id, html) {
    const ph = document.getElementById(id);
    if (!ph) return;
    ph.insertAdjacentHTML('beforebegin', html);
    ph.remove();
  }

  /* ---------- Cabecera y pie ---------- */
  mount('site-header', headerHTML);
  mount('site-footer', footerHTML);
  document.body.insertAdjacentHTML('beforeend', extrasHTML);
  document.querySelectorAll('[data-year]').forEach(el => (el.textContent = new Date().getFullYear()));

  // En escritorio, hacer clic en "Propiedades" o "Servicios" lleva a su página
  document.querySelectorAll('.main-nav .dropdown > .nav-link').forEach(a => {
    a.addEventListener('click', () => {
      const href = a.getAttribute('href');
      if (href && href !== '#' && window.matchMedia('(min-width: 992px)').matches) window.location.href = href;
    });
  });

  /* ---------- Botón subir ---------- */
  const toTop = document.getElementById('toTop');
  window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 500), { passive: true });
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Consentimiento ---------- */
  const KEY = 'requena-consent';
  const LEVELS = {
    plata: {
      prefs: { analytics: false, personalization: false, marketing: false },
      desc: 'Máximo nivel de privacidad. Acceso a los datos solo para las operaciones necesarias en el sitio. Datos compartidos con terceros para garantizar que el sitio sea seguro y que funcione en su dispositivo.'
    },
    oro: {
      prefs: { analytics: true, personalization: true, marketing: false },
      desc: 'Nivel equilibrado. Además de lo necesario, usamos analítica anónima para mejorar el sitio y recordamos sus preferencias, como búsquedas y favoritos.'
    },
    platino: {
      prefs: { analytics: true, personalization: true, marketing: true },
      desc: 'Máxima personalización. Permite analítica, personalización y marketing para mostrarle propiedades y contenidos adaptados a usted.'
    }
  };

  const panel = document.getElementById('consentPanel');
  const fab = document.getElementById('consentFab');
  const descEl = document.getElementById('consentDesc');
  const customBox = document.getElementById('consentCustom');
  const customBtn = document.getElementById('consentCustomize');
  const durationEl = document.getElementById('consentDuration');
  const levelBtns = [...panel.querySelectorAll('.level')];
  const prefInputs = [...panel.querySelectorAll('[data-pref]')];
  let level = 'plata';

  function readConsent() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY));
      return data && data.expires > Date.now() ? data : null;
    } catch (e) { return null; }
  }

  function setLevel(name) {
    level = name;
    levelBtns.forEach(b => {
      const on = b.dataset.level === name;
      b.classList.toggle('active', on);
      b.setAttribute('aria-checked', on);
    });
    if (LEVELS[name]) {
      descEl.textContent = LEVELS[name].desc;
      prefInputs.forEach(i => (i.checked = LEVELS[name].prefs[i.dataset.pref]));
    } else {
      descEl.textContent = 'Configuración personalizada: solo se usarán las categorías que hayas activado.';
    }
  }

  function openPanel(focus) {
    panel.hidden = false;
    if (focus) panel.focus();
  }
  function closePanel() { panel.hidden = true; fab.focus({ preventScroll: true }); }

  levelBtns.forEach(b => b.addEventListener('click', () => setLevel(b.dataset.level)));
  prefInputs.forEach(i => i.addEventListener('change', () => setLevel('personalizado')));
  customBtn.addEventListener('click', () => {
    const open = customBox.hidden;
    customBox.hidden = !open;
    customBtn.setAttribute('aria-expanded', open);
  });
  fab.addEventListener('click', () => (panel.hidden ? openPanel(true) : closePanel()));
  document.getElementById('consentClose').addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) closePanel(); });

  document.getElementById('consentSave').addEventListener('click', () => {
    const prefs = {};
    prefInputs.forEach(i => (prefs[i.dataset.pref] = i.checked));
    const days = +durationEl.value;
    const data = { level, prefs, days, expires: Date.now() + days * 864e5 };
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* sin almacenamiento */ }
    document.dispatchEvent(new CustomEvent('consent:change', { detail: data }));
    closePanel();
  });

  // Estado inicial
  const saved = readConsent();
  if (saved) {
    setLevel(saved.level);
    prefInputs.forEach(i => (i.checked = !!saved.prefs[i.dataset.pref]));
    durationEl.value = String(saved.days);
  } else {
    setLevel('plata');
    setTimeout(() => openPanel(false), 600); // primera visita: se muestra solo
  }
})();
