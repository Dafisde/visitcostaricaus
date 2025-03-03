require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const whatsappRoutes = require("./routes/whatsapp"); // Aseguramos que la ruta es correcta

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api", whatsappRoutes);

// Ruta de prueba para verificar que Railway está funcionando
app.get("/", (req, res) => {
    res.send("🚀 Backend funcionando en Railway");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
