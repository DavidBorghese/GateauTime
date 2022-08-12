let containerGateau = document.querySelector(".row")
let contenedorCarrito = document.getElementById("contenedor-carrito");
let contadorCarrito = document.getElementById('contadorCarrito')
let botonCompra = document.getElementById('confirmaCompra')

let arrayGateaux = []




async function mostrarTarjetas(){
    try{
        let response = await fetch('./assets/data.json');
        let array = await response.json();
        arrayGateaux = array
        array.forEach(item => {
                    let div = document.createElement('div')
                    div.className = 'card col-sm-12 col-md-6 col-lg-3 g-4'
                    div.innerHTML += `
                                        <img src="${item.imagen}" class="card-img-top  card__img" alt="">
                                        <div class="card-body">
                                            <h5 class="card-title">$${item.precio}</h5>
                                                <p class="card-text">${item.nombre}</p>
                                                <button onclick="agregarAlCarrito(${item.id})" class=" btn btn-warning">Añadir al Carrito</button>
                                            </div>
                                            `
                    
                    containerGateau.appendChild(div)
                });

    }catch (error) {
        console.log(error);
        }
}

mostrarTarjetas()





function mostrarCarrito() {
    let carrito = capturarStorage()
    contenedorCarrito.innerHTML = ""
    carrito.forEach(element => {
        contenedorCarrito.innerHTML += `
        <div class="row carroItems">
            <p class="col-md-3 carroNombre">${element.nombre}</p>
            <p class="col-md-3 carroPrecio"> $${element.precio}</p>
            <p class="col-md-3 carroCantidad"> ${element.cantidad}</p>
            <button class="col-md-3 boton-eliminar"><i class="fas fa-trash-alt"></i></button>
        </div>
        `
        let botonesBorrar = contenedorCarrito.querySelectorAll(".boton-eliminar");
    for(let boton of botonesBorrar) {
        boton.addEventListener("click", borrarElemento);
    }
    
    })

}

function capturarStorage() {
    return JSON.parse(localStorage.getItem("carrito")) || []
}

function guardarStorage(carritoNuevo) {
    localStorage.setItem("carrito", JSON.stringify(carritoNuevo))
}

function agregarAlCarrito(idParam) {
    let carrito = capturarStorage()
    if (isInCarrito(idParam)) {
        incrementarCantidad(idParam)
    } else {
        const productoEncontrado = arrayGateaux.find(e => e.id == idParam)
        carrito.push({ ...productoEncontrado, cantidad: 1 })
        guardarStorage(carrito)
        console.log(carrito)
        mostrarCarrito()
        
    }
    actualizarCarrito()
    Toastify({
        text: "Producto Agregado! ",
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: 'linear-gradient(to right, #c3d52b, #71731c)'
        }
    }).showToast();
}

function incrementarCantidad(id) {
    let carrito = capturarStorage()
    const indice = carrito.findIndex(e => e.id == id)
    carrito[indice].cantidad++
    guardarStorage(carrito)
    mostrarCarrito()
}

function isInCarrito(id) {
    let carrito = capturarStorage()
    return carrito.some(e => e.id == id)
}


function borrarElemento(e) {
    btn = e.target;
    btn.parentElement.remove();
    actualizarCarrito()

}

function actualizarCarrito() {
    carrito = capturarStorage()
    let total = 0;
    const carroTotal = document.querySelector('#precioTotal');
    const carroItem = document.querySelectorAll('.carroItems');

    carroItem.forEach((carroItems) => {
        const itemElementoPrecio = carroItems.querySelector('.carroPrecio')
        const itemPrecio = Number(itemElementoPrecio.textContent.replace("$", ""))
        const itemElementoCantidad = carroItems.querySelector('.carroCantidad')
        const itemCantidad = Number(itemElementoCantidad.innerHTML)
        total = total + itemPrecio * itemCantidad;
    })
    carroTotal.innerHTML = `${total}`
    contadorCarrito.innerText = carrito.reduce((acc, el)=> acc + el.cantidad, 0)

}

//filtros

function filtroGateau() {
    let filtrodelProd = document.querySelector('#selectorFiltro')
    let filtrarProd = filtrodelProd.value
    return   (filtrarProd == "all") ? mostrarTarjetas()
            :(filtrarProd == "A") ? ascendente()
            :(filtrarProd == "D") ? descendente()
            :(filtrarProd == "cero") ? cero()
            : mostrarTarjetas();
        

}

function cero (){
    let arrayNuevo = arrayGateaux.filter(gateau => gateau.stock == 0)

    mostrarTarjetas(arrayNuevo)
}

function ascendente (){
    let gateauporPrecio = [];
    gateauporPrecio = arrayGateaux.map(el => el);
    gateauporPrecio = arrayGateaux;
    gateauporPrecio.sort(function (a,b) { return b.precio - a.precio;});
    mostrarTarjetas(gateauporPrecio)
}

function descendente (){
    let gateauporPrecio = [];
    gateauporPrecio = arrayGateaux.map(el => el);
    gateauporPrecio = arrayGateaux;
    gateauporPrecio.sort(function (a,b) { return a.precio - b.precio;});
    mostrarTarjetas(gateauporPrecio)
}

//confirmar compra

botonCompra.addEventListener("click",(e)=>{
    e.preventDefault()
    contenedorCarrito.innerHTML= ""
    localStorage.clear()
    // alert("Gracias por su compra")
    Swal.fire({
        title: 'Compra Finalizada',
        text: 'Gracias por su Compra!',
        icon: 'success',
        confirmButtonText: 'OK',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOut'
        }
    })

    actualizarCarrito()
})
//buscador


let buscador = document.querySelector('#buscador')
buscador.addEventListener('input', ()=>{
    mostrarTarjetas(arrayGateaux.filter(item=> item.nombre.toUpperCase().includes( buscador.value.toUpperCase())))
})




mostrarCarrito()