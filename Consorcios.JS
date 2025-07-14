let consorcios = JSON.parse(localStorage.getItem("consorciosData")) || {};

const consorcioInput = document.getElementById("consorcioNombre");
const agregarConsorcioBtn = document.getElementById("agregarConsorcio");
const listaConsorcios = document.getElementById("listaConsorcios");

const propNombre = document.getElementById("propNombre");
const propTel = document.getElementById("propTel");
const propEmail = document.getElementById("propEmail");
const agregarPropBtn = document.getElementById("agregarProp");
const listaPropietarios = document.getElementById("listaPropietarios");

let modoEdicion = false;
let consorcioSeleccionado = "";
let propietarioEnEdicion = null;

function actualizarLocalStorage() {
  localStorage.setItem("consorciosData", JSON.stringify(consorcios));
}

function actualizarListaConsorcios() {
  listaConsorcios.innerHTML = '<option value="">-- Selecciona un consorcio --</option>';
  Object.keys(consorcios).forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    listaConsorcios.appendChild(option);
  });
}

agregarConsorcioBtn.addEventListener("click", () => {
  const nombre = consorcioInput.value.trim();
  if (nombre && !consorcios[nombre]) {
    consorcios[nombre] = [];
    consorcioInput.value = "";
    actualizarListaConsorcios();
    actualizarLocalStorage();
  }
});

listaConsorcios.addEventListener("change", () => {
  consorcioSeleccionado = listaConsorcios.value;
  mostrarPropietarios();
});

function mostrarPropietarios() {
  listaPropietarios.innerHTML = "";
  if (!consorcioSeleccionado || !consorcios[consorcioSeleccionado]) return;

  consorcios[consorcioSeleccionado].forEach((prop, index) => {
    const li = document.createElement("li");
    li.className = "propietario";
    li.textContent = `${prop.nombre} - ${prop.tel} - ${prop.email}`;

    const acciones = document.createElement("div");
    acciones.className = "acciones";

    const editarBtn = document.createElement("button");
    editarBtn.textContent = "Editar";
    editarBtn.addEventListener("click", () => {
      propNombre.value = prop.nombre;
      propTel.value = prop.tel;
      propEmail.value = prop.email;
      modoEdicion = true;
      propietarioEnEdicion = index;
      agregarPropBtn.textContent = "Guardar cambios";
    });

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.addEventListener("click", () => {
      consorcios[consorcioSeleccionado].splice(index, 1);
      actualizarLocalStorage();
      mostrarPropietarios();
    });

    acciones.appendChild(editarBtn);
    acciones.appendChild(eliminarBtn);
    li.appendChild(acciones);
    listaPropietarios.appendChild(li);
  });
}

agregarPropBtn.addEventListener("click", () => {
  if (!consorcioSeleccionado) return;

  const nombre = propNombre.value.trim();
  const tel = propTel.value.trim();
  const email = propEmail.value.trim();

  if (!nombre || !tel || !email) return;

  if (modoEdicion) {
    consorcios[consorcioSeleccionado][propietarioEnEdicion] = { nombre, tel, email };
    agregarPropBtn.textContent = "Agregar Propietario";
    modoEdicion = false;
    propietarioEnEdicion = null;
  } else {
    consorcios[consorcioSeleccionado].push({ nombre, tel, email });
  }

  propNombre.value = "";
  propTel.value = "";
  propEmail.value = "";

  actualizarLocalStorage();
  mostrarPropietarios();
});

// Inicializar
actualizarListaConsorcios();