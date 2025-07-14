//  Cargar los datos guardados en localStorage o inicia con un objeto vacío
let consorcios = JSON.parse(localStorage.getItem("consorciosData")) || {};

//  Obtener referencias a los elementos del DOM
const consorcioInput = document.getElementById("consorcioNombre");
const agregarConsorcioBtn = document.getElementById("agregarConsorcio");
const listaConsorcios = document.getElementById("listaConsorcios");

const propNombre = document.getElementById("propNombre");
const propTel = document.getElementById("propTel");
const propEmail = document.getElementById("propEmail");
const agregarPropBtn = document.getElementById("agregarProp");
const listaPropietarios = document.getElementById("listaPropietarios");

//  Variables de control 
let modoEdicion = false;
let consorcioSeleccionado = "";
let propietarioEnEdicion = null;

//  Función para guardar el objeto "consorcios" en localStorage
function actualizarLocalStorage() {
  localStorage.setItem("consorciosData", JSON.stringify(consorcios));
}

//  Función para actualizar el selector de consorcios en el DOM
function actualizarListaConsorcios() {
  listaConsorcios.innerHTML = '<option value="">-- Selecciona un consorcio --</option>';
  Object.keys(consorcios).forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    listaConsorcios.appendChild(option);
  });
}

//  Evento para agregar un nuevo consorcio
agregarConsorcioBtn.addEventListener("click", () => {
  const nombre = consorcioInput.value.trim();
  if (nombre && !consorcios[nombre]) {
    consorcios[nombre] = []; 
    consorcioInput.value = ""; 
    actualizarListaConsorcios(); 
    actualizarLocalStorage(); 
  }
});

//  Evento que detecta selección de consorcio en el selector
listaConsorcios.addEventListener("change", () => {
  consorcioSeleccionado = listaConsorcios.value;
  mostrarPropietarios(); // Muestra los propietarios según el consorcio seleccionado
});

//  Muestra los propietarios del consorcio seleccionado
function mostrarPropietarios() {
  listaPropietarios.innerHTML = ""; 
  if (!consorcioSeleccionado || !consorcios[consorcioSeleccionado]) return;

  consorcios[consorcioSeleccionado].forEach((prop, index) => {
    const li = document.createElement("li");
    li.className = "propietario";
    li.textContent = `${prop.nombre} - ${prop.tel} - ${prop.email}`;

    //  Crear botones de editar y eliminar para cada propietario
    const acciones = document.createElement("div");
    acciones.className = "acciones";

    const editarBtn = document.createElement("button");
    editarBtn.textContent = "Editar";
    editarBtn.addEventListener("click", () => {
      // Cargar los datos en los inputs para edición
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
      // Eliminar el propietario
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

//  Evento para agregar o editar propietarios
agregarPropBtn.addEventListener("click", () => {
  if (!consorcioSeleccionado) return;

  const nombre = propNombre.value.trim();
  const tel = propTel.value.trim();
  const email = propEmail.value.trim();

  if (!nombre || !tel || !email) return;

  if (modoEdicion) {
    //  Edita los datos del propietario 
    consorcios[consorcioSeleccionado][propietarioEnEdicion] = { nombre, tel, email };
    agregarPropBtn.textContent = "Agregar Propietario";
    modoEdicion = false;
    propietarioEnEdicion = null;
  } else {
    //  Agregar nuevo propietario
    consorcios[consorcioSeleccionado].push({ nombre, tel, email });
  }

  //  Limpiar inputs
  propNombre.value = "";
  propTel.value = "";
  propEmail.value = "";

  actualizarLocalStorage();
  mostrarPropietarios();
});

//  Inicializar el selector con los datos guardados
actualizarListaConsorcios();