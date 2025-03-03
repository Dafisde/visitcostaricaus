document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form-reservas");
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");
    const fecha = document.getElementById("fecha");
    const precioElemento = document.getElementById("precio");
    const errorMsg = document.getElementById("error-msg");

    const precios = {
        "playas-del-coco_aeropuerto-liberia": 30,
        "playas-del-coco_aeropuerto-san-jose": 150,
        "aeropuerto-liberia_playa-tamarindo": 50,
        "aeropuerto-liberia_nosara": 90,
        "aeropuerto-liberia_san-jose": 180,
        "nosara_san-jose": 140,
    };

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarTelefono(numero) {
        return /^[0-9]{6,15}$/.test(numero);
    }

    function calcularPrecio() {
        const key = `${origen.value}_${destino.value}`;
        
        if (!origen.value || !destino.value) {
            precioElemento.textContent = "";
            return;
        }

        if (origen.value === destino.value) {
            errorMsg.textContent = "El origen y destino no pueden ser iguales.";
            errorMsg.style.display = "block";
            precioElemento.textContent = "";
            return;
        }

        errorMsg.style.display = "none";

        if (precios[key]) {
            precioElemento.textContent = `Precio estimado: $${precios[key]} USD`;
        } else {
            precioElemento.textContent = "Precio no disponible para esta ruta.";
        }
    }

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

    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Evita el envío por defecto

        let errores = [];

        if (nombre.value.trim() === "") {
            errores.push("⚠️ El nombre es obligatorio.");
        }

        if (!validarEmail(email.value)) {
            errores.push("⚠️ Ingresa un correo electrónico válido.");
        }

        if (!validarTelefono(telefono.value)) {
            errores.push("⚠️ Ingresa un número de teléfono válido (6-15 dígitos).");
        }

        if (!origen.value || !destino.value) {
            errores.push("⚠️ Selecciona un origen y un destino.");
        }

        if (!fecha.value) {
            errores.push("⚠️ Selecciona una fecha válida.");
        }

        if (origen.value === destino.value) {
            errores.push("⚠️ El origen y el destino no pueden ser iguales.");
        }

        if (errores.length > 0) {
            errorMsg.innerHTML = errores.join("<br>");
            errorMsg.style.display = "block";
            return;
        } else {
            errorMsg.style.display = "none";
        }

        // 📌 Enviar la información al backend en Railway
        const reservaData = {
            nombre: nombre.value,
            email: email.value,
            telefono: telefono.value,
            origen: origen.value,
            destino: destino.value,
            fecha: fecha.value
        };

        try {
            const response = await fetch("https://visitcostaricaus-production.up.railway.app/api/send-whatsapp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reservaData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("✅ Reserva enviada con éxito. Recibirás un mensaje de confirmación por WhatsApp.");
            } else {
                alert(`❌ Error al enviar la reserva: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error al conectar con la API:", error);
            alert("❌ Ocurrió un error al enviar la reserva. Inténtalo nuevamente.");
        }
    });

    origen.addEventListener("change", calcularPrecio);
    destino.addEventListener("change", calcularPrecio);
    fecha.addEventListener("change", validarFecha);
});