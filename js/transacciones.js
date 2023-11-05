
const transacList = document.querySelector('.transacList'); // Selecciona el elemento con clase 'transacList'
let historial = JSON.parse(localStorage.getItem("historial")) || []; // Obtiene el historial almacenado en el localStorage o establece un arreglo vacío


// Función para obtener la cantidad de depósitos en el historial
function obtenerCantidadDepositos() {
    const historialLocalStorage = JSON.parse(localStorage.getItem('historial')) || [];
    return historialLocalStorage.reduce(function (contador, transaccion) {
        if (transaccion.tipo === 'deposito') {
            return contador + 1;
        } else {
            return contador;
        }
    }, 0);
}

// Función para obtener la cantidad de retiros en el historial
function obtenerCantidadRetiros() {
    const historialLocalStorage = JSON.parse(localStorage.getItem('historial')) || [];
    return historialLocalStorage.reduce(function (contador, transaccion) {
        if (transaccion.tipo === 'retiro') {
            return contador + 1;
        } else {
            return contador;
        }
    }, 0);
}



// Actualiza el historial de transacciones dinámicamente
function actualizarHistorial() {
    if (transacList != null) {
        transacList.innerHTML = "";
        historial.forEach(function (transaccion) {
            var li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            if (transaccion.tipo == "deposito")
                li.innerHTML = `${transaccion.nota} <span class="badge bg-danger rounded-pill p-2">+$${transaccion.monto}</span>`;
            else
                li.innerHTML = `${transaccion.nota} <span class="badge bg-primary rounded-pill p-2">-$${transaccion.monto}</span>`;
            transacList.appendChild(li);
        });
    }
}

// Crea la gráfica
function crearGrafica() {
    // Configuración para gráfica de pastel
    var datos = {
        labels: ["Retiros", "Depósitos"],
        datasets: [
            {
                data: [obtenerCantidadRetiros(), obtenerCantidadDepositos()],
                backgroundColor: ["#0D6EFD", "#DC3545"],
                hoverBackgroundColor: ["#0D47A1", "#C62828"]
            }
        ]
    };

    var opciones = {
        responsive: true,
        maintainAspectRatio: false
    };

    var grafica = new Chart(document.getElementById("acquisitions"), {
        type: 'pie',
        data: datos,
        options: opciones
    });
}




window.addEventListener("load", function () {
    actualizarHistorial();
    crearGrafica();
});