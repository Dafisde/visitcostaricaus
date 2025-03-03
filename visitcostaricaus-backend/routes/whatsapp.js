// routes/whatsapp.js (Manejo del envío de WhatsApp con Twilio)
require("dotenv").config();
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/send-whatsapp", async (req, res) => {
    try {
        const { nombre, email, telefono, origen, destino, fecha } = req.body;

        // Validaciones básicas
        if (!nombre || !email || !telefono || !origen || !destino || !fecha) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        // Formatear el número con código internacional si no lo tiene
        let formattedPhone = telefono.startsWith("+") ? telefono : `+${telefono}`;

        // Crear mensaje estructurado
        const mensaje = `📌 Nueva Reserva:
📛 Nombre: ${nombre}
📧 Email: ${email}
📱 Teléfono: ${telefono}
🚍 Origen: ${origen}
🌆 Destino: ${destino}
📅 Fecha: ${fecha}`;

        console.log(`📩 Enviando mensaje a: ${formattedPhone}`);
        
        // Enviar mensaje a la persona que reservó
        const responseUser = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${formattedPhone}`,
            body: `Hola ${nombre}, gracias por reservar con Visit Costa Rica US. Detalles:\n${mensaje}`,
        });

        console.log(`✅ Mensaje enviado al cliente: ${responseUser.sid}`);

        // Enviar mensaje al administrador
        const responseAdmin = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${process.env.ADMIN_PHONE_NUMBER}`,
            body: `🔔 Nueva reserva recibida:\n${mensaje}`,
        });

        console.log(`✅ Mensaje enviado al administrador: ${responseAdmin.sid}`);

        res.status(200).json({ success: "Mensajes enviados correctamente." });
    } catch (error) {
        console.error("❌ Error enviando WhatsApp:", error);
        res.status(500).json({ error: "Error enviando el mensaje." });
    }
});

module.exports = router;