const API_URL = "http://localhost:3000/api/pagos";
const API_URL_LISTAPRESTAMOS = "http://localhost:3000/api/prestamos";
const API_URL_CLIENTE = "http://localhost:3000/api/clientes";

const formulario = document.getElementById("form-pagos");
const tabla = document.querySelector("#tabla-pagos tbody");

const idpagos = document.getElementById("idpagos");
const cuota = document.getElementById("cuota");
const listaPrestamos = document.getElementById("lista-prestamo");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

btnCancelar.addEventListener("click", () => {
  formulario.reset();
  idpagos.value = "";
  btnGuardar.innerText = "Guardar";
});

// Obtener pagos y mostrarlos en tabla
async function obtenerPagos() {
  const response = await fetch(API_URL, { method: "GET" });
  const pagos = await response.json();

  tabla.innerHTML = "";

  pagos.forEach((pago) => {
    const row = tabla.insertRow();

    row.insertCell().textContent = pago.id;
    row.insertCell().textContent = pago.cuota;
    row.insertCell().textContent = pago.fechapago.split("T")[0];

    // Celda con ID único para monto restante (no se sobreescribe)
    const celdaMonto = row.insertCell();
    celdaMonto.classList.add("monto-restante");
    celdaMonto.id = `prestamo-${pago.prestamo}-${pago.id}`;
    celdaMonto.textContent = pago.montorestante ?? 0;

    row.insertCell().textContent = pago.nombres;

    const actionCell = row.insertCell();

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("btn", "btn-info", "btn-sm");
    editButton.onclick = () => cargarParaEdicion(pago);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm");
    deleteButton.onclick = () => eliminarPago(pago.id);

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
  });
}

// Obtener lista de préstamos para el select
async function obtenerListaPrestamos() {
  const responsePrestamos = await fetch(API_URL_LISTAPRESTAMOS);
  const responseClientes = await fetch(API_URL_CLIENTE);
  const prestamos = await responsePrestamos.json();
  const clientes = await responseClientes.json();

  listaPrestamos.innerHTML = '<option value="">Seleccione</option>';

  clientes.forEach((cliente) => {
    const prestamo = prestamos.find((p) => p.cliente === cliente.id);

    const option = document.createElement("option");
    if (prestamo) {
      option.value = prestamo.id;
      // Aquí mostramos el monto total del préstamo
      option.textContent = `${cliente.nombres} : ${parseFloat(prestamo.montototal ?? 0).toFixed(2)} total`;
    } else {
      option.disabled = true;
      option.textContent = `${cliente.nombres} : sin préstamo`;
    }
    listaPrestamos.appendChild(option);
  });
}

// Eliminar pago
async function eliminarPago(id) {
  if (confirm(`¿Está seguro de eliminar el pago: ${id}?`)) {
    try {
      const response = await fetch(API_URL + `/${id}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error(`Error al eliminar: ${id}`);
      }

      const result = await response.json();
      console.log(result);
      obtenerPagos();
    } catch (e) {
      console.error(e);
    }
  }
}

// Cargar datos en el formulario para edición
async function cargarParaEdicion(pago) {
  idpagos.value = pago.id;
  cuota.value = pago.cuota;
  listaPrestamos.value = pago.idprestamo;
  btnGuardar.innerText = "Actualizar";
}

// Guardar o actualizar pago
formulario.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    cuota: cuota.value,
    prestamo: listaPrestamos.value,
  };

  try {
    let response = null;

    if (idpagos.value === "") {
      response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      response = await fetch(API_URL + `/${idpagos.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const result = await response.json();
    console.log(result);

    // Si se registró correctamente, agregar la fila nueva sin recargar todo
    if (idpagos.value === "" && result.idpago) {
      const nuevaFila = tabla.insertRow(0); // insertar arriba

      nuevaFila.insertCell().textContent = result.idpago;
      nuevaFila.insertCell().textContent = data.cuota;
      nuevaFila.insertCell().textContent = new Date().toISOString();

      const celdaMonto = nuevaFila.insertCell();
      celdaMonto.textContent = parseFloat(result.montorestante ?? 0).toFixed(2);

      const cliente = listaPrestamos.options[listaPrestamos.selectedIndex].text.split(":")[0].trim();
      nuevaFila.insertCell().textContent = cliente;

      const actionCell = nuevaFila.insertCell();
      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      editButton.classList.add("btn", "btn-info", "btn-sm");
      editButton.onclick = () =>
        cargarParaEdicion({
          id: result.idpago,
          cuota: data.cuota,
          idprestamo: data.prestamo,
          nombres: cliente,
        });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.classList.add("btn", "btn-danger", "btn-sm");
      deleteButton.onclick = () => eliminarPago(result.idpago);

      actionCell.appendChild(editButton);
      actionCell.appendChild(deleteButton);
    }

    formulario.reset();
    btnGuardar.innerText = "Guardar";
    idpagos.value = "";
  } catch (e) {
    console.error(e);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  obtenerPagos();
  obtenerListaPrestamos();
});
