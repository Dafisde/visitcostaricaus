// server.js - Backend con Express y Twilio para enviar WhatsApp
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const whatsappRoutes = require("./routes/whatsapp");

const app = express();
const PORT = process.env.PORT || 3000; // Se usa la variable de entorno de Railway

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api", whatsappRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});