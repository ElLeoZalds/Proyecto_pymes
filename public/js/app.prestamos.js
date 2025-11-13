const API_URL = "http://localhost:3000/api/prestamos";
const URL_API_LISTACLIENTES = "http://localhost:3000/api/clientes";

const formulario_prest = document.getElementById("form-prestamos");
const tabla = document.querySelector("#tabla-prestamos tbody");
const listaClientes = document.getElementById("lista-clientes");

const idprestamo = document.getElementById("idprestamos");
const prestamo = document.getElementById("prestamo");
const caracteristicas = document.getElementById("caracteristicas");
const letracambio = document.getElementById("letracambio");
const fechalimite = document.getElementById("fechalimite");
const transferencia = document.getElementById("transferencia");
const montototal = document.getElementById("montototal");
const estado = document.getElementById("estado");
const interes = document.getElementById("interes");

const btnCancelar = document.getElementById("btnCancelar");
const btnGuardar = document.getElementById("btnGuardar");

btnCancelar.addEventListener("click", () => {
  btnGuardar.innerText = "Guardar";
  formulario_prest.reset();
  idprestamo.value = "";

  const archivoActual = document.getElementById("archivo-actual");
  if (archivoActual) {
    archivoActual.innerHTML = "";
    archivoActual.style.display = "none";
  }
});

async function obtenerPrestamos() {
  const response = await fetch(API_URL, { method: "get" });
  const prestamos = await response.json();

  tabla.innerHTML = "";

  prestamos.forEach((prest) => {
    const row = tabla.insertRow();

    row.insertCell().textContent = prest.id;
    row.insertCell().textContent = prest.prestamo;
    row.insertCell().textContent = prest.caracteristicas;

    const fotoCell = row.insertCell();
    const fotoLnk = document.createElement("a");
    fotoLnk.href = prest.letracambio;
    fotoLnk.textContent = "Ver Letra";
    fotoLnk.classList.add("btn", "btn-sm", "btn-info");
    fotoCell.appendChild(fotoLnk);

    row.insertCell().textContent = prest.fechainicio.split("T")[0];
    row.insertCell().textContent = prest.fechalimite.split("T")[0];

    const transCell = row.insertCell();
    if (prest.transferencia) {
      const transLink = document.createElement("a");
      transLink.href = prest.transferencia;
      transLink.textContent = "Ver Transferencia";
      transLink.classList.add("btn", "btn-sm", "btn-secondary");
      transCell.appendChild(transLink);
    } else {
      transCell.textContent = "Sin archivo";
    }

    row.insertCell().textContent = prest.montototal;
    row.insertCell().textContent = prest.estado;
    row.insertCell().textContent = prest.interes;
    row.insertCell().textContent = prest.cliente;

    const actionCell = row.insertCell();

    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("btn", "btn-info", "btn-sm");
    editButton.onclick = () => cargarParaEdicion(prest);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm");
    deleteButton.onclick = () => eliminarPrestamo(prest.id, prest.prestamo);

    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
  });
}

async function obtenerListaClientes() {
  const response = await fetch(URL_API_LISTACLIENTES);
  const clientes = await response.json();

  listaClientes.innerHTML = '<option value="">Seleccione</option>';
  clientes.forEach((cliente) => {
    const option = document.createElement("option");
    option.value = cliente.id;
    option.textContent = cliente.nombres;
    listaClientes.appendChild(option);
  });
}

async function eliminarPrestamo(id, prestamo) {
  if (confirm(`Está seguro de eliminar el préstamo: ${prestamo}?`)) {
    try {
      const response = await fetch(API_URL + `/${id}`, { method: "delete" });
      if (!response.ok) throw new Error(`Error al eliminar: ${prestamo}`);
      await response.json();
      obtenerPrestamos();
    } catch (e) {
      console.error(e);
    }
  }
}

async function cargarParaEdicion(prest) {
  idprestamo.value = prest.id;
  prestamo.value = prest.prestamo;
  caracteristicas.value = prest.caracteristicas;

  const archivoActual = document.getElementById("archivo-actual");
  if (archivoActual) {
    if (prest.letracambio) {
      archivoActual.innerHTML = `<a href="${prest.letracambio}" target="_blank">Ver letra actual</a>`;
      archivoActual.style.display = "block";
    } else {
      archivoActual.innerHTML = "";
      archivoActual.style.display = "none";
    }
  }

  fechalimite.value = prest.fechalimite.split("T")[0];
  montototal.value = prest.montototal;
  estado.value = prest.estado;
  interes.value = prest.interes;
  listaClientes.value = prest.cliente;

  btnGuardar.innerText = "Actualizar";
}

formulario_prest.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData();

  formData.append("prestamo", prestamo.value);
  formData.append("caracteristicas", caracteristicas.value);

  const archivoLetra = document.querySelector("#letracambio").files[0];
  if (archivoLetra) formData.append("letracambio", archivoLetra);

  const archivoTransfer = document.querySelector("#transferencia").files[0];
  if (archivoTransfer) formData.append("transferencia", archivoTransfer);

  formData.append("fechalimite", fechalimite.value);
  formData.append("montototal", montototal.value);
  formData.append("estado", estado.value);
  formData.append("interes", interes.value);
  formData.append("cliente", listaClientes.value);

  try {
    let response = null;
    if (idprestamo.value === "") {
      response = await fetch(API_URL, { method: "POST", body: formData });
    } else {
      response = await fetch(API_URL + `/${idprestamo.value}`, {
        method: "PUT",
        body: formData,
      });
    }

    const result = await response.json();

    if (!response.ok) {
      alert(result.mensaje || "Error al registrar el préstamo");
      return;
    }

    alert(result.message || "Registro exitoso");
    btnGuardar.innerText = "Guardar";
    formulario_prest.reset();
    obtenerPrestamos();
  } catch (e) {
    console.error(e);
    alert("Error en la conexión con el servidor");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  obtenerPrestamos();
  obtenerListaClientes();
});
