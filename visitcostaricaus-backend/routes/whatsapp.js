// routes/whatsapp.js - Manejo del envío de WhatsApp con Twilio
require("dotenv").config();
const express = require("express");
const router = express.Router();
const twilio = require("twilio");

// Inicializar cliente de Twilio
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

router.post("/send-whatsapp", async (req, res) => {
    try {
        const { nombre, email, telefono, origen, destino, fecha } = req.body;

        // Validaciones básicas
        if (!nombre || !email || !telefono || !origen || !destino || !fecha) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }

        // Verificar que las variables de entorno están configuradas correctamente
        if (!process.env.TWILIO_TEMPLATE_SID || !process.env.TWILIO_MESSAGING_SERVICE_SID || !process.env.TWILIO_ADMIN_TEMPLATE_SID) {
            console.error("❌ Error: Variables de entorno TWILIO_TEMPLATE_SID, TWILIO_ADMIN_TEMPLATE_SID o TWILIO_MESSAGING_SERVICE_SID no definidas.");
            return res.status(500).json({ error: "Error de configuración en el servidor." });
        }

        // Formatear el número del cliente con código internacional si no lo tiene
        let formattedPhone = telefono.startsWith("+") ? telefono : `+${telefono}`;

        console.log(`📩 Enviando mensaje a Cliente: ${formattedPhone}`);
        console.log(`🔹 Usando plantilla de cliente: ${process.env.TWILIO_TEMPLATE_SID}`);

        // Enviar mensaje al cliente usando la plantilla aprobada
        const responseUser = await client.messages.create({
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${formattedPhone}`,
            contentSid: process.env.TWILIO_TEMPLATE_SID,
            contentVariables: JSON.stringify({
                "1": nombre,
                "2": email,
                "3": telefono,
                "4": origen,
                "5": destino,
                "6": fecha
            })
        });

        console.log(`✅ Mensaje de plantilla enviado al cliente: ${responseUser.sid}`);

        // Verificar si el número del administrador está definido en .env
        if (!process.env.ADMIN_PHONE_NUMBER) {
            console.error("❌ Error: ADMIN_PHONE_NUMBER no está definido en .env");
            return res.status(500).json({ error: "Número de administrador no configurado." });
        }

        console.log(`📩 Enviando mensaje al Administrador: ${process.env.ADMIN_PHONE_NUMBER}`);
        console.log(`🔹 Usando plantilla de administrador: ${process.env.TWILIO_ADMIN_TEMPLATE_SID}`);

        // Enviar mensaje al administrador usando la plantilla aprobada
        const responseAdmin = await client.messages.create({
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${process.env.ADMIN_PHONE_NUMBER}`,
            contentSid: process.env.TWILIO_ADMIN_TEMPLATE_SID,
            contentVariables: JSON.stringify({
                "1": nombre,
                "2": email,
                "3": telefono,
                "4": origen,
                "5": destino,
                "6": fecha
            })
        });

        console.log(`✅ Mensaje de plantilla enviado al administrador: ${responseAdmin.sid}`);

        res.status(200).json({ success: "Mensajes enviados correctamente." });
    } catch (error) {
        console.error("❌ Error enviando WhatsApp:", error);

        if (error.code === 63016) {
            return res.status(500).json({ error: "Error 63016: El mensaje debe usar una plantilla aprobada de Twilio." });
        }

        res.status(500).json({ error: "Error enviando el mensaje." });
    }
});

module.exports = router;