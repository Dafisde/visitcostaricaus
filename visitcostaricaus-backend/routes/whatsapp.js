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

        // Verificar si TWILIO_TEMPLATE_SID está definido
        if (!process.env.TWILIO_TEMPLATE_SID) {
            console.error("❌ TWILIO_TEMPLATE_SID no está definido en .env");
            return res.status(500).json({ error: "Error de configuración en el servidor." });
        }

        // Formatear el número con código internacional si no lo tiene
        let formattedPhone = telefono.startsWith("+") ? telefono : `+${telefono}`;

        console.log(`📩 Enviando mensaje a: ${formattedPhone}`);
        console.log(`🔹 Usando plantilla: ${process.env.TWILIO_TEMPLATE_SID}`);

        // Enviar mensaje al cliente usando la plantilla aprobada
        const responseUser = await client.messages.create({
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID, // ID del servicio de mensajería en Twilio
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${formattedPhone}`,
            contentSid: process.env.TWILIO_TEMPLATE_SID, // Asegurar que esta variable está en .env
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

        // Enviar mensaje al administrador (esto no necesita plantilla)
        const mensajeAdmin = `🔔 Nueva reserva recibida:\n
📛 Nombre: ${nombre}
📧 Email: ${email}
📱 Teléfono: ${telefono}
🚍 Origen: ${origen}
🌆 Destino: ${destino}
📅 Fecha: ${fecha}`;

        const responseAdmin = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${process.env.ADMIN_PHONE_NUMBER}`,
            body: mensajeAdmin
        });

        console.log(`✅ Mensaje enviado al administrador: ${responseAdmin.sid}`);

        res.status(200).json({ success: "Mensajes enviados correctamente." });
    } catch (error) {
        console.error("❌ Error enviando WhatsApp:", error);
        res.status(500).json({ error: "Error enviando el mensaje." });
    }
});

module.exports = router;