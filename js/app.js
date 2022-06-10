//variables
const carrito = document.querySelector("#carrito");
const listaCarrito = document.querySelector("#carrito tbody");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const listaCursos = document.querySelector("#lista-cursos");
const totalPagar = document.querySelector("#totalPagar");
//nuestro arreglo de cursos
let arrayCursos = [];
let cursosLocalStorage = [];

//eventos
(() => {
    listaCursos.addEventListener("click", addCurse);
    listaCarrito.addEventListener('click', deleteCourse);
    vaciarCarrito.addEventListener('click', () => {
        arrayCursos = [];
        mostrarHTML();
    });
    document.addEventListener( "DOMContentLoaded", ()=>{
        const cargarCursos = JSON.parse(localStorage.getItem("cursos"))
        arrayCursos = cargarCursos;
        mostrarHTML();
    } )
})()

//delete course
function deleteCourse(e) {

    if (e.target.classList.contains("borrar-curso")) {
        //traemos el id
        const idCurso = Number(e.target.getAttribute("data-id"));

        //traer el objeto con que hace referencia al ID
        const objCurso = arrayCursos.find(item => item.id === idCurso);

        //si la cantidad del curso es mas de uno actualizamos
        if (objCurso.cantidad > 1) {
            arrayCursos = arrayCursos.map(item => {
                if (item.id === idCurso) {
                    item.cantidad--;
                    item.precio -= 15;
                    return item;
                } else {
                    return item;
                }
            })
            mostrarHTML();
        //si la cantidad del curso es solo uno eliminamos
        } else {
            //funcion filter
            arrayCursos = arrayCursos.filter(item => item.id !== idCurso);
            mostrarHTML();
        }

    }

}

//funciones
function addCurse(e) {
    e.preventDefault()
    if (e.target.classList.contains("agregar-carrito")) {
        //agregar curso
        const cardCourse = e.target.parentElement.parentElement;

        agregarCurso(cardCourse);
    }
}


function agregarCurso(course) {
    //crear el objeto curso
    const objCurso = {
        imagen: course.querySelector("img").src,
        nombre: course.querySelector('h4').textContent,
        precio: Number((course.querySelector('.precio span').textContent).substring(1, 3)),
        cantidad: 1,
        id: Number(course.querySelector(".info-card a").getAttribute('data-id'))
    }
    //VERIFICAR SI EL CARRITO ESTA LLENO O NO
    const verificar = arrayCursos.some(item => item.id === objCurso.id);

    if (verificar) {

        arrayCursos = arrayCursos.map(item => {
            if (item.id === objCurso.id) {
                item.precio += objCurso.precio;
                item.cantidad++;
                return item;
            } else {
                return item;
            }
        })



    } else {
        //agregar al array de cursos
        arrayCursos = [...arrayCursos, objCurso];
    }
    mostrarHTML();

}


function mostrarHTML() {
    //limpiar el HTML
    while (listaCarrito.firstChild) {
        listaCarrito.removeChild(listaCarrito.firstChild);
    }

    arrayCursos.forEach(item => {
        const { imagen, nombre, precio, cantidad, id } = item
        const row = document.createElement('tr');
        row.innerHTML = `
        <td> <img src="${imagen}" width="100px" /> </td>
        <td> ${nombre} </td>
        <td> $ ${precio} </td>
        <td> ${cantidad} </td>
        <td> <a href="#" class="borrar-curso" data-id="${id}">x</a> </td>

        `
        //agregamos al tbody
        listaCarrito.appendChild(row)
    })
    //mostrar total a pagar
    const total = arrayCursos.reduce( (total, item) => total+item.precio,0 )
    totalPagar.textContent = `$ ${total}`
    //localStorage
    agregarLocalStorage();

}

function agregarLocalStorage(){
    cursosLocalStorage = JSON.stringify(arrayCursos) ? JSON.stringify(arrayCursos) : []  ;
    localStorage.setItem( "cursos", cursosLocalStorage )
}