let map;
let directionsService;
let directionsRenderer;

function initMap() {
    // Coordenadas iniciales (Costa Rica)
    const centro = { lat: 9.7489, lng: -83.7534 };
    
    // Crear el mapa
    map = new google.maps.Map(document.getElementById("googleMap"), {
        center: centro,
        zoom: 8,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

// Función para calcular y mostrar la ruta en el mapa
function mostrarRuta(origen, destino) {
    if (!origen || !destino) return;

    const request = {
        origin: origen,
        destination: destino,
        travelMode: 'DRIVING',
    };

    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        } else {
            alert("No se pudo encontrar una ruta válida.");
        }
    });
}

// Escuchar cambios en el formulario
document.addEventListener("DOMContentLoaded", function () {
    const origenInput = document.getElementById("origen");
    const destinoInput = document.getElementById("destino");

    origenInput.addEventListener("change", function () {
        mostrarRuta(origenInput.value, destinoInput.value);
    });

    destinoInput.addEventListener("change", function () {
        mostrarRuta(origenInput.value, destinoInput.value);
    });

    initMap();
});