document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const cerrar = document.getElementById("Cerrar");

    if (cerrar) {
        cerrar.onclick = function() {
            window.location.href = "index.html";
        };
    }

    form.onsubmit = function(e) {
        e.preventDefault(); // prevent page reload
        const apellidosBuscados = document.getElementById("Apellidos").value.trim().toLowerCase();
        const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
        const resultados = pacientes.filter(p => p.apellidos.toLowerCase().includes(apellidosBuscados));

        // show results
        if (resultados.length === 0) alert("No se encontró ningún paciente.");
        else {
            let mensaje = "Resultados encontrados:\n";
            resultados.forEach((p, i) => {
                mensaje += `${i+1}. ${p.nombres} ${p.apellidos}, RUT: ${p.rut}\n`;
            });
            alert(mensaje);
        }
    };
});
