function registrarUsuario() {
    let tipoDocumento = document.getElementById("tipoDocumento").value;
    let numeroDocumento = document.getElementById("numeroDocumento").value;
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let formData = {
        "tipoDocumento": tipoDocumento,
        "numeroDocumento": numeroDocumento,
        "fechaNacimiento": fechaNacimiento,
        "username": username,
        "email": email,
        "password": password
    };

    if (validarCampos()) {
        fetch(urlRegistro, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.status === 401) {
                return response.json().then(data => {
                    Swal.fire({
                        title: "Advertencia",
                        text: "El usuario ya está registrado.",
                        icon: "warning"
                    });
                    return Promise.reject('Usuario ya registrado');
                });
            } else if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
            return response.json();
        })
        .then(data => {
            Swal.fire({
                title: "Excelente",
                text: "Se ha registrado exitosamente",
                icon: "success"
            });
            // Redirigir al usuario a otra página si es necesario
            // window.location.href = "http://192.168.140.176:5500/front_end/listacliente.html";
        })
        .catch(error => {
            if (error !== 'Usuario ya registrado') {
                Swal.fire("Error", "Error al registrar: " + error, "error");
            }
        });
    } else {
        Swal.fire({
            title: "Error!",
            text: "Complete los campos correctamente",
            icon: "error"
        });
    }
}

function validarCampos() {
    var tipoDocumento = document.getElementById("tipoDocumento");
    var numeroDocumento = document.getElementById("numeroDocumento");
    var fechaNacimiento = document.getElementById("fechaNacimiento");
    var username = document.getElementById("username");
    var email = document.getElementById("email");
    var password = document.getElementById("password");

    return validarUsername(username) && validarTipoDocumento(tipoDocumento) && validarNumeroDocumento(numeroDocumento)
     && validarFechaNacimiento(fechaNacimiento) && validarPassword(password) && validarEmail(email);
}

function validarTipoDocumento(TipoDocumento){
    var valido=true;
    if(TipoDocumento.value.length <= 0 || TipoDocumento.value.length > 20){
        valido=false;
    }

    if (valido) {
        TipoDocumento.className = "form-control is-valid"
    }
    else{
        TipoDocumento.className = "form-control is-invalid"
    }
    return valido;
}

function validarNumeroDocumento(NumeroDocumento){
    var valido=true;
    if(NumeroDocumento.value.length <=0 || NumeroDocumento.value.length > 10){
        valido=false;
    }

    if (valido) {
        NumeroDocumento.className = "form-control is-valid"
    }
    else{
        NumeroDocumento.className = "form-control is-invalid"
    }
    return valido;
}

function validarFechaNacimiento(FechaNacimiento) {
    if (!FechaNacimiento || !FechaNacimiento.value) {
        return false;
    }

    let valor = FechaNacimiento.value;
    let valido = true;
    if (valor.length < 1 || valor.length > 60) {
        valido = false;
    }

    if (valido) {
        FechaNacimiento.className = "form-control is-valid";
    } else {
        FechaNacimiento.className = "form-control is-invalid";
    }
    return valido;
}

function validarUsername(username) {
    let errorDiv = document.getElementById('username-error');  
    let valido = true;
    let mensajesError = []; 

    if (!username || !username.value.trim()) {
        username.classList.add("is-invalid");
        username.classList.remove("is-valid");
        errorDiv.textContent = "El nombre de usuario no puede estar vacío.";
        errorDiv.style.display = 'block';
        return false;
    } 

    let valor = username.value.trim();

    // Verifica si el nombre contiene espacios
    if (/\s/.test(valor)) {
        valido = false;
        mensajesError.push("no debe contener espacios");
    }

    // Verifica si el nombre contiene caracteres especiales
    if (/[^a-zA-Z0-9]/.test(valor)) {
        valido = false;
        mensajesError.push("no debe contener caracteres especiales");
    }

    if (!valido) {
        let mensajeError = "El nombre de usuario " + mensajesError.join(' y ') + ".";
        errorDiv.textContent = mensajeError;
        errorDiv.style.display = 'block';
        username.classList.add("is-invalid");
        username.classList.remove("is-valid");
    } else {
        errorDiv.textContent = "";
        errorDiv.style.display = 'none';
        username.classList.add("is-valid");
        username.classList.remove("is-invalid");
    }

    return valido;
}

function validarPassword(password) {
    let errorDiv = document.getElementById('password-error');
    let valor = password.value.trim();
    let valido = true;
    let mensajesError = [];

    if (valor.length < 8 || valor.length > 20) {
        valido = false;
        mensajesError.push("entre 8 y 20 caracteres");
    }
    if (!/[A-Z]/.test(valor)) {
        valido = false;
        mensajesError.push("una letra mayúscula");
    }
    if (!/[a-z]/.test(valor)) {
        valido = false;
        mensajesError.push("una letra minúscula");
    }
    if (!/[0-9]/.test(valor)) {
        valido = false;
        mensajesError.push("tambien debe tener al menos un número");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(valor)) {
        valido = false;
        mensajesError.push("y un carácter especial");
    }

    if (!valido) {
        let mensajeError = "La contraseña debe tener " + mensajesError.join(', ') + ".";
        errorDiv.textContent = mensajeError;
        errorDiv.style.display = 'block';
    } else {
        errorDiv.textContent = "";
        errorDiv.style.display = 'none';
    }

    password.className = valido ? "form-control is-valid" : "form-control is-invalid";
    return valido;
}

function validarEmail(email) {
    let errorDiv = document.getElementById('email-error');
    
    // Verificar si el campo de email está vacío
    if (!email || !email.value) {
        email.className = "form-control is-invalid";
        errorDiv.style.display = 'block';
        errorDiv.textContent = "El correo no puede estar vacío.";
        return false;
    }

    let valor = email.value.trim();
    let valido = true;
    let mensajeError = '';

    // Verificar la longitud del correo
    if (valor.length === 0 || valor.length > 100) {
        valido = false;
        mensajeError = "El correo debe tener entre 1 y 100 caracteres.";
    }

    // Validar el formato del correo electrónico
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    if (!re.test(valor)) {
        valido = false;
        mensajeError = "El correo debe cumplir con el formato correcto (por ejemplo, usuario@dominio.com).";
    }

    // Actualizar la clase del campo y el mensaje de error
    email.className = valido ? "form-control is-valid" : "form-control is-invalid";
    errorDiv.style.display = valido ? 'none' : 'block';
    errorDiv.textContent = valido ? '' : mensajeError;

    return valido;
}




function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

