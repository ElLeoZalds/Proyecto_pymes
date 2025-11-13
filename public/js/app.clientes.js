const API_URL = "http://localhost:3000/api/clientes";

const formulario = document.getElementById("form-clientes");
const tabla = document.querySelector("#tabla-clientes tbody");

const idclientes = document.getElementById("idclientes");
const apellido = document.getElementById("apellidos");
const nombre = document.getElementById("nombres");
const dni = document.getElementById("dni");
const direccion = document.getElementById("direccion");
const telefono = document.getElementById("telefono");

const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

//Retorna el botón guardar a su estado original
btnCancelar.addEventListener("click", () => {
  formulario.reset();
  idpagos.value = "";
  btnGuardar.innerText = "Guardar";
});

//Obtener los datos (backend) > renderizar en la tabla
async function obtenerClientes() {
  const response = await fetch(API_URL, { method: "get" });
  const clientes = await response.json();

  //reiniciamos el contenido de l  tabla
  tabla.innerHTML = "";

  clientes.forEach((cliente) => {
    const row = tabla.insertRow(); // etiqueta tr

    row.insertCell().textContent = cliente.id;
    row.insertCell().textContent = cliente.apellidos;
    row.insertCell().textContent = cliente.nombres;
    row.insertCell().textContent = cliente.dni;
    row.insertCell().textContent = cliente.direccion;
    row.insertCell().textContent = cliente.telefono;

    //La ultima celda contendra 2 botonwes (funcionalidad)
    const actionCell = row.insertCell();

    //Boton 1: Editar
    const editButton = document.createElement("button");
    editButton.textContent = "Editar";
    editButton.classList.add("btn");
    editButton.classList.add("btn-info");
    editButton.classList.add("btn-sm");
    editButton.onclick = () => cargarParaEdicion(cliente);

    //Botón 2: Eliminar
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Eliminar";
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-danger");
    deleteButton.classList.add("btn-sm");
    deleteButton.onclick = () => eliminarCliente(cliente.id, cliente.apellidos);

    //Agregando ambos botones a la última celda
    actionCell.appendChild(editButton);
    actionCell.appendChild(deleteButton);
  });
}

async function eliminarCliente(id, apellido) {
  //console.log(id, descripcion)
  if (confirm(`¿Está seguro de eliminar el cliente: ${apellido}?`)) {
    try {
      const response = await fetch(API_URL + `/${id}`, { method: "delete" });

      if (!response.ok) {
        throw new Error(`Error al eliminar: ${apellido}`);
      }

      //Eliminado correctamente...
      const result = await response.json();
      console.log(result);
      obtenerClientes();
    } catch (e) {
      console.error(e);
    }
  }
}

async function cargarParaEdicion(cliente) {
  idclientes.value = cliente.id;
  apellido.value = cliente.apellidos;
  nombre.value = cliente.nombres;
  dni.value = cliente.dni;
  direccion.value = cliente.direccion;
  telefono.value = cliente.telefono;

  btnGuardar.innerText = "Actualizar";
}

//Al pulsar el boton Guardar (submit) - DEBEMOS VERIFICAR SI: registrar | actualizar
formulario.addEventListener("submit", async (event) => {
  event.preventDefault(); //Anulado el vento submit para que no accione hasta que no se cumplan todos los requerimientos

  //para enviar el guardado de datos lo convertimos a un formato JSON
  //preparamos un objeto js con la misma estructura
  const data = {
    apellidos: apellido.value,
    nombres: nombre.value,
    dni: dni.value,
    direccion: direccion.value,
    telefono: telefono.value,
  };

  //Enviar los datos (1. URL, 2. Verbo, 3. Tpo de dato, 4. JSON)
  try {
    let response = null;

    if (idclientes.value === "") {
      response = await fetch(API_URL, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      //Actualizar...
      response = await fetch(API_URL + `/${idclientes.value}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }

    const result = await response.json();
    console.log(result);
    formulario.reset();
    btnGuardar.innerText = "Guardar";
    idclientes.value = "";
    await obtenerClientes();
  } catch (e) {
    console.error(e);
  }
});

//Cuando la página esté lista, se ejecutará obtenerClientes
document.addEventListener("DOMContentLoaded", obtenerClientes);
