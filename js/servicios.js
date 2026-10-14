

const SERVICES = [
  {
    id: 'gestion', icon: 'bi-house-gear-fill', title: 'Gestión Inmobiliaria',
    text: 'Nos encargamos de todo el proceso de tu operación, desde la primera visita hasta la entrega de llaves, para que no tengas que preocuparte de nada.',
    points: ['Promoción de tu inmueble en portales y en nuestra cartera de clientes', 'Filtrado de interesados y visitas acompañadas', 'Negociación y seguimiento hasta la firma']
  },
  {
    id: 'legal', icon: 'bi-file-earmark-text-fill', title: 'Asesoramiento Legal Inmobiliario',
    text: 'Revisamos la documentación y los contratos para que compres, vendas o alquiles con seguridad jurídica.',
    points: ['Revisión de escrituras, notas simples y cargas', 'Contratos de arras, compraventa y alquiler', 'Resolución de dudas antes de firmar']
  },
  {
    id: 'eficiencia', icon: 'bi-lightning-charge-fill', title: 'Eficiencia Energética',
    text: 'Te ayudamos a obtener el certificado energético, obligatorio para vender o alquilar, y a conocer cómo mejorar el consumo de tu vivienda.',
    points: ['Gestión del certificado de eficiencia energética', 'Recomendaciones de mejora de aislamiento y climatización', 'Información sobre ayudas disponibles']
  },
  {
    id: 'reformas', icon: 'bi-hammer', title: 'Reformas Integrales',
    text: 'Preparamos tu inmueble para venderlo mejor o para que lo disfrutes desde el primer día, con presupuesto cerrado y plazos claros.',
    points: ['Visita técnica y presupuesto sin compromiso', 'Coordinación de gremios y seguimiento de obra', 'Reformas completas o parciales de cocinas, baños y reformas de local']
  },
  {
    id: 'financiero', icon: 'bi-piggy-bank-fill', title: 'Asesoramiento Financiero',
    text: 'Analizamos tu situación para que encuentres la financiación que mejor se adapte a ti y sepas cuánto puedes invertir.',
    points: ['Estudio de viabilidad de la hipoteca', 'Comparativa de condiciones con distintas entidades', 'Cálculo de gastos e impuestos de la operación']
  },
  {
    id: 'tasaciones', icon: 'bi-graph-up-arrow', title: 'Tasaciones y Valoraciones',
    text: 'Conocer el precio real de tu propiedad es el primer paso para venderla bien. Valoramos según el mercado de Requena y su comarca.',
    points: ['Valoración basada en ventas y alquileres recientes de la zona', 'Informe de precio de salida recomendado', 'Tasaciones para herencias, divorcios y particiones']
  },
  {
    id: 'gestoria', icon: 'bi-folder-check', title: 'Gestoría Inmobiliaria',
    text: 'Resolvemos los trámites administrativos de tu operación para ahorrarte desplazamientos y papeleo.',
    points: ['Cambios de titularidad de suministros', 'Presentación de impuestos asociados a la compraventa', 'Gestión de registros y documentación']
  },
  {
    id: 'traspasos', icon: 'bi-shop', title: 'Traspaso y Venta de Negocios y Empresas',
    text: 'Si tienes un negocio en marcha y quieres traspasarlo, o buscas uno para emprender, te ponemos en contacto con la otra parte.',
    points: ['Valoración del negocio y de su local', 'Búsqueda de compradores o traspasarios cualificados', 'Acompañamiento en la negociación y el contrato']
  }
];

const list = document.getElementById('svcList');
const index = document.getElementById('svcIndex');

list.innerHTML = SERVICES.map(s => `
  <article class="svc" id="${s.id}">
    <div class="svc-icon" aria-hidden="true"><i class="bi ${s.icon}"></i></div>
    <div>
      <h2>${s.title}</h2>
      <p>${s.text}</p>
      <ul>${s.points.map(p => `<li><i class="bi bi-check2-circle"></i><span>${p}</span></li>`).join('')}</ul>
      <a class="btn btn-brand btn-sm" href="formulario.html">Pedir información</a>
    </div>
  </article>`).join('');

index.innerHTML = SERVICES.map(s => `<li><a href="#${s.id}" data-id="${s.id}">${s.title}</a></li>`).join('');

const links = [...index.querySelectorAll('a')];
function setActive(id) {
  links.forEach(a => a.classList.toggle('active', a.dataset.id === id));
}
setActive(location.hash.slice(1) || SERVICES[0].id);

if (location.hash) {
  const target = document.getElementById(location.hash.slice(1));
  if (target) requestAnimationFrame(() => target.scrollIntoView());
}

if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
  }, { rootMargin: '-35% 0px -55% 0px' });
  list.querySelectorAll('.svc').forEach(el => obs.observe(el));
}
