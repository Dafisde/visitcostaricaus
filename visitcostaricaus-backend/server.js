require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const whatsappRoutes = require("./routes/whatsapp");

const app = express();
const PORT = process.env.PORT || 3000; // 🔥 Importante para Railway

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api", whatsappRoutes);

// 🔥 Mantener activo Railway con una ruta raíz
app.get("/", (req, res) => {
    res.send("🚀 Backend funcionando en Railway - Prueba de tráfico");
});

// Iniciar servidor
app.listen(PORT, "0.0.0.0", () => { // 🔥 Asegurar que escuche en Railway
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});