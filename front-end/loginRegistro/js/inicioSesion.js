function iniciarSesion() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let formData = {
        "username": username,
        "email": email,
        "password": password
    };

    if (validarCamposLogin()) {
        fetch(urlLogin, {
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
                        text: "Credenciales incorrectas.",
                        icon: "warning"
                    });
                    return Promise.reject('Credenciales incorrectas');
                });
            } else if (!response.ok) {
                throw new Error('La respuesta de la red no fue correcta');
            }
           
            return response.json();
        })
        .then(data => {
            localStorage.setItem('showLoginMessage', 'true'); 
            localStorage.setItem('authToken', data.token); // Almacenar el token en localStorage
            window.location.href = "http://127.0.0.1:5500/front-end/contenidoPrincipal/paginaPrincipal.html";
        })
        .catch(error => {
            if (error !== 'Credenciales incorrectas') {
                Swal.fire("Error", "Error al iniciar sesión: " + error, "error");
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

function validarCamposLogin() {
    var username = document.getElementById("username");
    var email = document.getElementById("email");
    var password = document.getElementById("password"); 
   
    return validarUsername(username) && validarEmail(email) && validarPassword(password);
}

function validarUsername(username) {
    let errorDiv = document.getElementById('username-error');  
    let valido = true;
    let mensajesError = []; 

    if (!username || !username.value.trim()) {
        valido = false;
        mensajesError.push("El nombre de usuario no puede estar vacío.");
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


function validarEmail(email) {
    let errorDiv = document.getElementById('email-error');
    if (!email || !email.value) {
        email.className = "form-control is-invalid";
        errorDiv.style.display = 'block';
        return false;
    }

    let valor = email.value.trim();
    let valido = true;

    // Longitud mínima de 1 y máxima de 100 caracteres
    valido = valor.length > 0 && valor.length <= 100;

    // Validar formato de correo electrónico
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
    valido = valido && re.test(valor);

    email.className = valido ? "form-control is-valid" : "form-control is-invalid";
    errorDiv.style.display = valido ? 'none' : 'block';
    return valido;
}

function validarPassword(password) {
    let errorDiv = document.getElementById('password-error');
    let valor = password.value.trim();
    let valido = true;
    let mensajeError = "";

    if (valor.length < 8 || valor.length > 20) {
        valido = false;
        mensajeError = "La contraseña debe tener entre 8 y 20 caracteres.";
    } else if (!/[A-Z]/.test(valor)) {
        valido = false;
        mensajeError = "La contraseña debe tener al menos una letra mayúscula.";
    } else if (!/[a-z]/.test(valor)) {
        valido = false;
        mensajeError = "La contraseña debe tener al menos una letra minúscula.";
    } else if (!/[0-9]/.test(valor)) {
        valido = false;
        mensajeError = "La contraseña debe tener al menos un número.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(valor)) {
        valido = false;
        mensajeError = "La contraseña debe tener al menos un carácter especial.";
    }

    password.className = valido ? "form-control is-valid" : "form-control is-invalid";
    errorDiv.textContent = mensajeError;
    errorDiv.style.display = valido ? 'none' : 'block';
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

