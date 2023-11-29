// Obtiene los items (nav)

const formLogin = document.querySelector('.login'); // Selecciona el elemento con clase 'login'
const pin = document.querySelector('#pin'); // Selecciona el elemento con el id 'pin'


// sirve para validar el login
if (formLogin != null) {
  formLogin.onsubmit = function (e) {
    e.preventDefault();
    valor = pin.value;
    if(valor == null || valor.length == 0)
      swal("Ingresa tu pin", "", "error");
    else {
      if(isNaN(valor))
        swal("Tu pin es numérico", "", "error");
      else {
        if(valor == "1234") {
          swal("Pin correcto", "", "success").then(() => {
            window.location = "dashboard.html"; // Redirige a la página "dashboard.html" si el PIN es correcto
          });
        } else
          swal("Pin incorrecto", "", "error");
      }
    }
  }
}
