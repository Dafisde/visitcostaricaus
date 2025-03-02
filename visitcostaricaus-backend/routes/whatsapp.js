// routes/whatsapp.js (Manejo del envío de WhatsApp con Twilio)
const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

router.post('/send-whatsapp', async (req, res) => {
    const { nombre, email, telefono, origen, destino, fecha } = req.body;
    if (!nombre || !email || !telefono || !origen || !destino || !fecha) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const mensaje = `📌 Nueva Reserva:
📛 Nombre: ${nombre}
📧 Email: ${email}
📱 Teléfono: ${telefono}
🚍 Origen: ${origen}
🌆 Destino: ${destino}
📅 Fecha: ${fecha}`;

    try {
        // Enviar mensaje al cliente
        await client.messages.create({
            from: `whatsapp:${twilioPhoneNumber}`,
            to: `whatsapp:${telefono}`,
            body: mensaje
        });

        // Enviar mensaje al administrador
        await client.messages.create({
            from: `whatsapp:${twilioPhoneNumber}`,
            to: 'whatsapp:+50685859274',
            body: `🔔 Nueva reserva recibida:
${mensaje}`
        });

        res.status(200).json({ success: 'Mensaje enviado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar el mensaje', details: error.message });
    }
});

module.exports = router;