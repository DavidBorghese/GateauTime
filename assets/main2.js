let containerGateau = document.querySelector(".row")
let contenedorCarrito = document.getElementById("contenedor-carrito");
let contadorCarrito = document.getElementById('contadorCarrito')


mostrarTarjetas(arrayGateaux)


function mostrarTarjetas(array){
    containerGateau.innerHTML = "";
    array.forEach(item => {
        let div = document.createElement('div')
        div.className = 'card col-sm-12 col-md-6 col-lg-3 g-4'
        div.innerHTML += `
                            <img src="${item.imagen}" class="card-img-top" alt="">
                            <div class="card-body">
                                <h5 class="card-title">$${item.precio}</h5>
                                    <p class="card-text">${item.nombre}</p>
                                    <button onclick="agregarAlCarrito(${item.id})" class=" btn btn-warning">Añadir al Carrito</button>
                                </div>
                                `
        
        containerGateau.appendChild(div)
    });
}


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



mostrarCarrito()