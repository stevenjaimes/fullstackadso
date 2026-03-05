const API_BASE = "http://localhost:3000/api";

const formDueno = document.getElementById("formDueno");
const formMascota = document.getElementById("formMascota");
const formCita = document.getElementById("formCita");
const listaMascotas = document.getElementById("listaMascotas");
const listaCitas = document.getElementById("listaCitas");
const mascotaCita = document.getElementById("mascotaCita");
const idCliente = document.getElementById("idCliente");
const estado = document.getElementById("estado");

function setEstado(message, isError = false) {
  estado.textContent = message;
  estado.classList.toggle("error", isError);
}

async function request(endpoint, options = {}) {
  const fetchOptions = { ...options };
  const hasBody = fetchOptions.body != null;
  const customHeaders = { ...(fetchOptions.headers || {}) };

  if (hasBody && !customHeaders["Content-Type"]) {
    customHeaders["Content-Type"] = "application/json";
  }

  fetchOptions.headers = customHeaders;

  const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Error HTTP ${response.status}`);
  }

  return data;
}

function renderClientesOpciones(clientes) {
  idCliente.innerHTML = '<option value="">Selecciona el dueno</option>';

  clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id_cliente;
    option.textContent = cliente.nombre;
    idCliente.appendChild(option);
  });
}

function renderMascotas(mascotas) {
  listaMascotas.innerHTML = "";

  if (mascotas.length === 0) {
    listaMascotas.innerHTML = "<li>No hay mascotas registradas.</li>";
    return;
  }

  mascotas.forEach((mascota) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <div>
        <strong>${mascota.nombre}</strong>
        <span>${mascota.tipo} · ${mascota.edad} anos · Dueno: ${mascota.cliente_nombre}</span>
      </div>
      <button data-id="${mascota.id_mascota}" class="btn-eliminar">Eliminar</button>
    `;

    listaMascotas.appendChild(item);
  });
}

function renderOpcionesMascotas(mascotas) {
  mascotaCita.innerHTML = '<option value="">Selecciona una mascota registrada</option>';

  mascotas.forEach((mascota) => {
    const option = document.createElement("option");
    option.value = mascota.id_mascota;
    option.textContent = `${mascota.nombre} (${mascota.tipo})`;
    mascotaCita.appendChild(option);
  });
}

function renderCitas(citas) {
  listaCitas.innerHTML = "";

  if (citas.length === 0) {
    listaCitas.innerHTML = "<li>No hay citas registradas.</li>";
    return;
  }

  citas.forEach((cita) => {
    const item = document.createElement("li");
    item.innerHTML = `
      <div>
        <strong>${cita.mascota || "Mascota"}</strong>
        <span>${cita.fecha} · ${cita.hora}</span>
      </div>
      <button data-id="${cita.id_cita}" class="btn-eliminar-cita">Eliminar</button>
    `;

    listaCitas.appendChild(item);
  });
}

async function cargarClientes() {
  const { data } = await request("/clientes");
  renderClientesOpciones(data);
}

async function cargarMascotas() {
  const { data } = await request("/mascotas");
  renderMascotas(data);
  renderOpcionesMascotas(data);
}

async function cargarCitas() {
  const { data } = await request("/citas");
  renderCitas(data);
}

async function inicializar() {
  try {
    await Promise.all([cargarClientes(), cargarMascotas(), cargarCitas()]);
    setEstado("Frontend conectado correctamente al backend.");
  } catch (error) {
    setEstado(`No se pudo conectar al backend: ${error.message}`, true);
  }
}

formDueno.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nombre = document.getElementById("nombreDueno").value.trim();
  const telefono = document.getElementById("telefonoDueno").value.trim();
  const email = document.getElementById("emailDueno").value.trim();

  try {
    const response = await request("/clientes", {
      method: "POST",
      body: JSON.stringify({ nombre, telefono, email }),
    });

    formDueno.reset();
    await cargarClientes();
    idCliente.value = String(response.data.id_cliente);
    setEstado("Dueno registrado con exito.");
  } catch (error) {
    setEstado(`Error al registrar dueno: ${error.message}`, true);
  }
});

formMascota.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nombre = document.getElementById("nombreMascota").value.trim();
  const tipo = document.getElementById("tipoAnimal").value.trim();
  const edad = Number(document.getElementById("edad").value);
  const id_cliente = Number(idCliente.value);

  try {
    await request("/mascotas", {
      method: "POST",
      body: JSON.stringify({ nombre, tipo, edad, id_cliente }),
    });

    formMascota.reset();
    await cargarMascotas();
    setEstado("Mascota registrada con exito.");
  } catch (error) {
    setEstado(`Error al registrar mascota: ${error.message}`, true);
  }
});

formCita.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id_mascota = Number(mascotaCita.value);
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  try {
    await request("/citas", {
      method: "POST",
      body: JSON.stringify({ id_mascota, fecha, hora }),
    });

    formCita.reset();
    await cargarCitas();
    setEstado("Cita registrada con exito.");
  } catch (error) {
    setEstado(`Error al registrar cita: ${error.message}`, true);
  }
});

listaMascotas.addEventListener("click", async (event) => {
  const button = event.target.closest(".btn-eliminar");
  if (!button) return;

  try {
    await request(`/mascotas/${button.dataset.id}`, { method: "DELETE" });
    await Promise.all([cargarMascotas(), cargarCitas()]);
    setEstado("Mascota eliminada con exito.");
  } catch (error) {
    setEstado(`Error al eliminar mascota: ${error.message}`, true);
  }
});

listaCitas.addEventListener("click", async (event) => {
  const button = event.target.closest(".btn-eliminar-cita");
  if (!button) return;

  try {
    await request(`/citas/${button.dataset.id}`, { method: "DELETE" });
    await cargarCitas();
    setEstado("Cita eliminada con exito.");
  } catch (error) {
    setEstado(`Error al eliminar cita: ${error.message}`, true);
  }
});

inicializar();
