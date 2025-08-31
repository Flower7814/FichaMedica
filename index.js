

document.addEventListener("DOMContentLoaded", function() {
    const guardar = document.getElementById("Guardar"); 
    const limpiar = document.getElementById("Limpiar"); 
    const form = document.querySelector("form");

    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    const popupClose = document.getElementById("popup-close");

    function showPopup(message) {
        popupMessage.innerHTML = message; 
        popup.style.display = "flex";
    }

    popupClose.onclick = function() {
        popup.style.display = "none";
    }

    function validarRUT(rut) {
        rut = rut.replace(/\./g, '').replace('-', '');
        let cuerpo = rut.slice(0, -1);
        let dv = rut.slice(-1).toUpperCase();

        if (!/^\d+$/.test(cuerpo)) return false;

        let suma = 0;
        let multiplo = 2;

        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += parseInt(cuerpo[i]) * multiplo;
            multiplo = multiplo < 7 ? multiplo + 1 : 2;
        }

        let dvEsperado = 11 - (suma % 11);
        dvEsperado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

        return dv === dvEsperado;
    }

    function validarFechaNacimiento(fecha) {
        if (!fecha) return false;
        const fechaIngresada = new Date(fecha);
        const hoy = new Date();
        const fechaMin = new Date("1925-01-01");
        return fechaIngresada >= fechaMin && fechaIngresada <= hoy;
    }

    function validarTelefonoChile(telefono) {
        return /^\+569\d{8}$/.test(telefono);
    }

    if (guardar) {
        guardar.onclick = function() {
            const rut = document.getElementById("Rut").value.trim();
            const nombres = document.getElementById("Nombres").value.trim();
            const apellidos = document.getElementById("Apellidos").value.trim();
            const direccion = document.getElementById("Dirección").value.trim();
            const ciudad = document.getElementById("Ciudad").value.trim();
            const region = document.querySelector("select").value;
            const telefono = document.getElementById("Teléfono").value.trim();
            const email = document.getElementById("Email").value.trim();
            const fechaNacimiento = document.getElementById("FechaNacimiento").value;
            const estadoCivil = document.querySelector('input[name="Estado civil"]:checked');
            const comentarios = document.getElementById("Comentarios").value.trim();

            if (!rut || !nombres || !apellidos) {
                showPopup("Please complete the required fields.");
                return;
            }

            if (!validarRUT(rut)) {
                showPopup("Invalid RUT. Please enter a valid RUT.");
                return;
            }

            if (!estadoCivil) {
                showPopup("Please select marital status.");
                return;
            }

            if (!validarTelefonoChile(telefono)) {
                showPopup("Invalid phone number. It must be in format +569XXXXXXXX.");
                return;
            }

            if (!validarFechaNacimiento(fechaNacimiento)) {
                showPopup("Invalid date of birth. It must be between 1925 and today.");
                return;
            }

            if (!comentarios) {
                showPopup("Please write a comment.");
                return;
            }

            const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
            const existingIndex = pacientes.findIndex(p => p.rut === rut);

            if (existingIndex !== -1) {
                popupMessage.innerHTML = `
                    This RUT already exists. Do you want to overwrite the data?<br><br>
                    <button id="popup-yes">Yes</button>
                    <button id="popup-no">No</button>
                `;
                popup.style.display = "flex";

                document.getElementById("popup-yes").onclick = () => {
                    pacientes[existingIndex] = { rut, nombres, apellidos, direccion, ciudad, region, telefono, email, fechaNacimiento, estadoCivil: estadoCivil.value, comentarios };
                    localStorage.setItem("pacientes", JSON.stringify(pacientes));
                    popup.style.display = "none";
                    showPopup("Data overwritten successfully!");
                    form.reset();
                };

                document.getElementById("popup-no").onclick = () => {
                    popup.style.display = "none";
                };

            } else {
                pacientes.push({ rut, nombres, apellidos, direccion, ciudad, region, telefono, email, fechaNacimiento, estadoCivil: estadoCivil.value, comentarios });
                localStorage.setItem("pacientes", JSON.stringify(pacientes));
                showPopup("Data saved successfully!");
                form.reset();
            }
        };
    }

    if (limpiar) {
        limpiar.onclick = function() {
            form.reset();
        };
    }
});