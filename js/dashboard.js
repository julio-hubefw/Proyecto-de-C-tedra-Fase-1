const navItems = document.querySelectorAll('.nav-item'); // Selecciona todos los elementos con clase 'nav-item'
const btnTransac = document.querySelector('#enviar'); // Selecciona el elemento con el id 'enviar'
const div = document.querySelector('.dashboard'); // Selecciona el elemento con clase 'dashboard'
let saldo = parseInt(localStorage.getItem("saldo")) || 333; // Obtiene el saldo almacenado en el localStorage o establece un valor predeterminado de 500
let historial = JSON.parse(localStorage.getItem("historial")) || []; // Obtiene el historial almacenado en el localStorage o establece un arreglo vacío

const formTransacciones = document.querySelector('#transacciones'); // Selecciona el elemento con clase 'transacciones'
const lblAct = document.querySelector('.lblAct'); // Selecciona el elemento con clase 'lblAct'

var fechaActual = new Date();

// Obtener los componentes de la fecha y hora actual
var año = fechaActual.getFullYear();
var mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11
var dia = fechaActual.getDate();
var hora = fechaActual.getHours();
var minutos = fechaActual.getMinutes();
var segundos = fechaActual.getSeconds();
var fechaHoraActual = dia + '/' + mes + '/' + año + ' ' + hora + ':' + minutos + ':' + segundos;


navItems.forEach(navItem => {
    navItem.addEventListener('click', () => {
        // Quita la clase 'active' de todos los elementos
        navItems.forEach(item => item.querySelector('.nav-link').classList.remove('active'));
        // Si existe la clase 'active', la quita; de lo contrario, la agrega
        navItem.querySelector('.nav-link').classList.toggle('active');

        // Verifica el elemento seleccionado en la navegación
        switch (navItem.querySelector('.nav-link').textContent) {
            case 'Depósito':
                btnTransac.classList.add("depositar"); // Agrega la clase "depositar" al botón
                div.innerHTML = `<label for="formGroupExampleInput2" required class="form-label fw-bold lblAct">Nota</label>
            <input type="text" min="1" class="form-control" id="nota">
            <label for="formGroupExampleInput2" required class="form-label fw-bold lblAct">Monto a depositar</label>
            <input type="number" min="1" class="form-control" id="monto">
            <button type="submit" id="enviar" class="btn btn-primary  mt-3 bg-success">Enter</button>`;
                break;
            case 'Retiro':
                btnTransac.classList.remove("depositar"); // Quita la clase "depositar" del botón
                div.innerHTML = `<label for="nota" required class="form-label fw-bold lblAct">Nota</label>
            <input type="text" min="1" class="form-control" id="nota">
            <label for="monto" required class="form-label fw-bold lblAct">Monto a retirar</label>
            <input type="number" min="1" class="form-control" id="monto">
            <button type="submit" id="enviar"  class="btn btn-primary retirar mt-3 bg-success">Enter</button>`;
                break;
            case 'Consultar saldo':
                div.innerHTML = `<h1 class="text-center">El saldo disponible es: $${saldo}</h1>`;
                break;
            case 'Pago de servicios':
                div.innerHTML = `<ul class="list-group">
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Energía eléctrica
              <span class="badge bg-primary rounded-pill p-2 pagar" onclick="servicios(10, 'Energía eléctrica')">Pagar</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Agua potable
              <span class="badge bg-primary rounded-pill p-2 pagar" onclick="servicios(4, 'Agua potable')">Pagar</span>
            </li>
            <li class="list-group-item d-flex justify-content-between  align-items-center">
              Internet
              <span class="badge bg-primary rounded-pill p-2 pagar" onclick="servicios(60, 'Internet')">Pagar</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
              Telefonía
              <span class="badge bg-primary rounded-pill p-2 pagar" onclick="servicios(50, 'Línea fija y datos')">Pagar</span>
            </li>
          </ul>`;
                break;
        }
    });
});


function transactControl() {
    let monto = parseInt(document.querySelector("#monto").value);
    let nota = document.querySelector("#nota").value;
    if (monto != '' && nota != '') {
        if (btnTransac.classList.contains("depositar")) {
            saldo += monto;
            historial.push({tipo: "deposito", monto: monto, nota: nota});
            swal("Transacción realizada correctamente", "", "success").then(() => {
                // Guarda los datos en local storage
                localStorage.setItem("saldo", saldo.toString());
                localStorage.setItem("historial", JSON.stringify(historial));
                // Limpia los campos
                document.getElementById("monto").value = "";
                document.getElementById("nota").value = "";
                // Genera un PDF
                var doc = new jsPDF();
                doc.setFont("helvetica"); // Cambiar la fuente a Helvetica
                doc.setFontSize(12); // Cambiar el tamaño de fuente a 12
                doc.text(`Tipo de transacción: Depósito\n Monto: $${monto}\n Nota: ${nota}\n Fecha: ${fechaHoraActual}`, 20, 20)
                doc.save('reporte.pdf')
            });
        } else {
            if (monto <= saldo) {
                saldo -= monto;
                historial.push({tipo: "retiro", monto: monto, nota: nota});
                // Guarda los datos en local storage
                swal("Transacción realizada correctamente", "", "success").then(() => {
                    localStorage.setItem("saldo", saldo);
                    localStorage.setItem("historial", JSON.stringify(historial));
                    // Limpia los campos
                    document.getElementById("monto").value = "";
                    document.getElementById("nota").value = "";
                    // Genera un PDF
                    var doc = new jsPDF();
                    doc.setFont("helvetica"); // Cambiar la fuente a Helvetica
                    doc.setFontSize(12); // Cambiar el tamaño de fuente a 12
                    doc.text(`Tipo de transacción: Retiro\n Monto: $${monto}\n Nota: ${nota}\n Fecha: ${fechaHoraActual}`, 20, 20)
                    doc.save('reporte.pdf')
                });
            } else {
                swal("Saldo insuficiente", "", "error")
            }
        }
    } else {
        swal("No se permiten campos vacíos", "", "error")
    }
}

function servicios(monto, nota) {
    monto = parseInt(monto);
    if (monto <= saldo) {
        saldo -= monto;
        historial.push({tipo: "retiro", monto: monto, nota: nota});
        // Guarda los datos en local storage
        localStorage.setItem("saldo", saldo.toString());
        localStorage.setItem("historial", JSON.stringify(historial));

        swal("Transacción realizada correctamente", "", "success").then(() => {
            // Genera un PDF
            var doc = new jsPDF();
            doc.setFont("helvetica"); // Cambiar la fuente a Helvetica
            doc.setFontSize(12); // Cambiar el tamaño de fuente a 12
            doc.text(`Tipo de transacción: Retiro\n Monto: $${monto}\n Nota: ${nota}\n Fecha: ${fechaHoraActual}`, 20, 20)
            doc.save('reporte.pdf')
        });
    } else {
        swal("Saldo insuficiente", "", "error")
    }
}









// Función que limpia los campos
function limpiarCampos() {
    document.getElementById("monto").value = "";
    document.getElementById("nota").value = "";
}


formTransacciones.addEventListener('submit', (e) => {
    e.preventDefault();
    transactControl();
})

