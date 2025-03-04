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

        // Mensaje estructurado
        const mensaje = `📌 Nueva Reserva:
📛 Nombre: ${nombre}
📧 Email: ${email}
📱 Teléfono: ${telefono}
🚍 Origen: ${origen}
🌆 Destino: ${destino}
📅 Fecha: ${fecha}`;

        console.log(`📩 Enviando mensaje a: ${formattedPhone}`);
        
        // Enviar mensaje al cliente usando la plantilla de Twilio
        const responseUser = await client.messages.create({
            from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
            to: `whatsapp:${formattedPhone}`,
            template: {
                name: "reserva_confirmada",
                language: "es",
                components: [
                    { type: "body", parameters: [
                        { type: "text", text: nombre },
                        { type: "text", text: email },
                        { type: "text", text: telefono },
                        { type: "text", text: origen },
                        { type: "text", text: destino },
                        { type: "text", text: fecha }
                    ]}
                ]
            }
        });

        console.log(`✅ Mensaje de plantilla enviado al cliente: ${responseUser.sid}`);

        // Enviar mensaje al administrador sin plantilla (dentro de la ventana de 24h)
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