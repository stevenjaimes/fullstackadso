const mascotas = [];
const citas = [];

const formMascota = document.getElementById("formMascota");
const formCita = document.getElementById("formCita");
const listaMascotas = document.getElementById("listaMascotas");
const listaCitas = document.getElementById("listaCitas");
const mascotaCita = document.getElementById("mascotaCita");

function generarId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

function renderMascotas() {
  listaMascotas.innerHTML = "";

  mascotas.forEach((mascota) => {
    const item = document.createElement("li");
    item.textContent = `${mascota.nombre} (${mascota.tipo}, ${mascota.edad} años) - Dueño: ${mascota.dueno}`;
    listaMascotas.appendChild(item);
  });
}

function renderOpcionesMascotas() {
  mascotaCita.innerHTML =
    '<option value="">Selecciona una mascota registrada</option>';

  mascotas.forEach((mascota) => {
    const option = document.createElement("option");
    option.value = mascota.id;
    option.textContent = `${mascota.nombre} - ${mascota.dueno}`;
    mascotaCita.appendChild(option);
  });
}

function renderCitas() {
  listaCitas.innerHTML = "";

  citas.forEach((cita) => {
    const mascota = mascotas.find((item) => item.id === cita.mascotaId);
    const item = document.createElement("li");
    const nombreMascota = mascota ? mascota.nombre : "Mascota no encontrada";
    item.textContent = `${nombreMascota}: ${cita.fecha} ${cita.hora}`;
    listaCitas.appendChild(item);
  });
}

formMascota.addEventListener("submit", (event) => {
  event.preventDefault();

  const dueno = document.getElementById("nombreDueno").value.trim();
  const nombre = document.getElementById("nombreMascota").value.trim();
  const tipo = document.getElementById("tipoAnimal").value.trim();
  const edad = document.getElementById("edad").value;

  if (!dueno || !nombre || !tipo || !edad) {
    return;
  }

  mascotas.push({
    id: generarId(),
    dueno,
    nombre,
    tipo,
    edad,
  });

  renderMascotas();
  renderOpcionesMascotas();
  formMascota.reset();
});

formCita.addEventListener("submit", (event) => {
  event.preventDefault();

  const mascotaId = mascotaCita.value;
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  if (!mascotaId || !fecha || !hora) {
    return;
  }

  citas.push({
    id: generarId(),
    mascotaId,
    fecha,
    hora,
  });

  renderCitas();
  formCita.reset();
});
