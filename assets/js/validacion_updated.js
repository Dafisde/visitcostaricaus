
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-reservas");
    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");
    const fecha = document.getElementById("fecha");
    const precioElemento = document.getElementById("precio");
    const errorMsg = document.getElementById("error-msg");

    // Lista de precios simulada (puede mejorarse con una API real)
    const precios = {
        "playas-del-coco_aeropuerto-liberia": 30,
        "playas-del-coco_aeropuerto-san-jose": 150,
        "aeropuerto-liberia_playa-tamarindo": 50,
        "aeropuerto-liberia_nosara": 90,
        "aeropuerto-liberia_san-jose": 180,
        "nosara_san-jose": 140,
    };

    function calcularPrecio() {
        const key = \`\${origen.value}_\${destino.value}\`;
        if (origen.value === destino.value) {
            errorMsg.textContent = "El origen y destino no pueden ser iguales.";
            errorMsg.style.display = "block";
            precioElemento.textContent = "";
            return;
        }

        errorMsg.style.display = "none";

        if (precios[key]) {
            precioElemento.textContent = \`Precio estimado: $ \${precios[key]} USD\`;
        } else {
            precioElemento.textContent = "Precio no disponible para esta ruta.";
        }
    }

    // Validar fecha (no se pueden seleccionar fechas pasadas)
    function validarFecha() {
        const hoy = new Date().toISOString().split("T")[0];
        if (fecha.value < hoy) {
            errorMsg.textContent = "No puedes seleccionar una fecha pasada.";
            errorMsg.style.display = "block";
            fecha.value = "";
        } else {
            errorMsg.style.display = "none";
        }
    }

    // Eventos para actualización dinámica
    origen.addEventListener("change", calcularPrecio);
    destino.addEventListener("change", calcularPrecio);
    fecha.addEventListener("change", validarFecha);

    // Validación final en el envío del formulario
    form.addEventListener("submit", function (event) {
        if (!origen.value || !destino.value || !fecha.value) {
            event.preventDefault();
            errorMsg.textContent = "Por favor, completa todos los campos.";
            errorMsg.style.display = "block";
        }
    });
});
