

const OPEN = { 1: [10, 19], 2: [10, 19], 3: [10, 19], 4: [10, 19], 5: [10, 19] };

const now = new Date();
const day = now.getDay();

// Resalta la fila de hoy
document.querySelectorAll('.hours-row').forEach(row => {
  const days = row.dataset.days.split(',').map(Number);
  row.classList.toggle('today', days.includes(day));
});

// Estado: abierto / cerrado
const status = document.getElementById('openStatus');
const range = OPEN[day];
const hour = now.getHours() + now.getMinutes() / 60;

if (range && hour >= range[0] && hour < range[1]) {
  status.textContent = `Abierto ahora · cerramos a las ${range[1]}:00`;
  status.classList.add('open');
} else {
  status.textContent = 'Cerrado ahora';
  status.classList.add('closed');
}
