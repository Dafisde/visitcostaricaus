document.addEventListener("DOMContentLoaded", function () {
    // MODO OSCURO
    const toggleDarkMode = document.getElementById("toggle-dark-mode");
    const body = document.body;

    // Verificar si hay una preferencia guardada
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark-mode");
        toggleDarkMode.textContent = "☀️ Modo Claro";
    } else {
        toggleDarkMode.textContent = "🌙 Modo Oscuro";
    }

    // Evento para alternar el modo oscuro
    toggleDarkMode.addEventListener("click", function () {
        body.classList.toggle("dark-mode");

        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggleDarkMode.textContent = "☀️ Modo Claro";
        } else {
            localStorage.setItem("darkMode", "disabled");
            toggleDarkMode.textContent = "🌙 Modo Oscuro";
        }
    });

    // MULTILENGUAJE
    const langSelector = document.getElementById("language-selector");
    const texts = {
        "es": {
            "form-title": "Visita Costa Rica",
            "form-description": "Explora Costa Rica con nuestros servicios de transporte premium",
            "reserve-button": "Reservar Ahora"
        },
        "en": {
            "form-title": "Visit Costa Rica",
            "form-description": "Explore Costa Rica with our premium transport services",
            "reserve-button": "Book Now"
        },
        "pt": {
            "form-title": "Visite a Costa Rica",
            "form-description": "Explore a Costa Rica com nossos serviços de transporte premium",
            "reserve-button": "Reservar Agora"
        },
        "fr": {
            "form-title": "Visitez le Costa Rica",
            "form-description": "Explorez le Costa Rica avec nos services de transport premium",
            "reserve-button": "Réserver"
        }
    };

    function changeLanguage(lang) {
        document.getElementById("form-title").textContent = texts[lang]["form-title"];
        document.getElementById("form-description").textContent = texts[lang]["form-description"];
        document.getElementById("reserve-button").textContent = texts[lang]["reserve-button"];
    }

    const savedLang = localStorage.getItem("language") || "es";
    langSelector.value = savedLang;
    changeLanguage(savedLang);

    langSelector.addEventListener("change", function () {
        localStorage.setItem("language", this.value);
        changeLanguage(this.value);
    });
});