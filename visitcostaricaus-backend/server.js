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

// Ruta de prueba para Railway
app.get("/", (req, res) => {
    res.send("🚀 Backend funcionando en Railway");
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});