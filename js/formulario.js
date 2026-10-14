

const form = document.getElementById('leadForm');
const okBox = document.getElementById('leadOk');
const captchaQ = document.getElementById('captchaQ');
const captchaIn = document.getElementById('lCaptcha');
const contactoError = document.getElementById('contactoError');
let captchaAnswer = 0;

function newCaptcha() {
  const a = 5 + Math.floor(Math.random() * 8);   // 5..12
  const b = 1 + Math.floor(Math.random() * 4);   // 1..4
  captchaAnswer = a - b;
  captchaQ.textContent = `${a} - ${b} =`;
  captchaIn.value = '';
}

const rules = {
  lTipo: el => el.value !== '',
  lCp: el => /^\d{5}$/.test(el.value.trim()),
  lEmail: el => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()),
  lTel: el => /^(\+34)?[\s-]?[6-9]\d{2}[\s-]?\d{3}[\s-]?\d{3}$/.test(el.value.trim()),
  lPriv: el => el.checked,
  lCaptcha: el => Number(el.value.trim()) === captchaAnswer && el.value.trim() !== ''
};

function check(id) {
  const el = document.getElementById(id);
  const ok = rules[id](el);
  el.classList.toggle('is-invalid', !ok);
  el.classList.toggle('is-valid', ok && el.type !== 'checkbox');
  return ok;
}

function checkContacto() {
  const ok = !!form.querySelector('input[name="contacto"]:checked');
  contactoError.classList.toggle('show', !ok);
  return ok;
}

Object.keys(rules).forEach(id => {
  const el = document.getElementById(id);
  const evt = el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'blur';
  el.addEventListener(evt, () => check(id));
  el.addEventListener('input', () => { if (el.classList.contains('is-invalid')) check(id); });
});
form.querySelectorAll('input[name="contacto"]').forEach(r => r.addEventListener('change', checkContacto));

document.getElementById('lCp').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); });

form.addEventListener('submit', e => {
  e.preventDefault();
  okBox.classList.add('d-none');

  if (document.getElementById('lWeb').value) return;

  const results = Object.keys(rules).map(check);
  const contactoOk = checkContacto();

  if (!results.every(Boolean) || !contactoOk) {
    const firstBad = form.querySelector('.is-invalid') || form.querySelector('input[name="contacto"]');
    firstBad.focus();
    return;
  }

  const data = {
    tipo: document.getElementById('lTipo').value,
    codigoPostal: document.getElementById('lCp').value.trim(),
    email: document.getElementById('lEmail').value.trim(),
    telefono: document.getElementById('lTel').value.trim(),
    contacto: form.querySelector('input[name="contacto"]:checked').value
  };

  
  console.log('Formulario listo para enviar:', data);

  form.reset();
  form.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
  contactoError.classList.remove('show');
  newCaptcha();
  okBox.classList.remove('d-none');
  okBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

newCaptcha();
