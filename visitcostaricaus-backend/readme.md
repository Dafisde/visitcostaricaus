// README.md (Instrucciones de configuración en Railway)
# visitcostaricaus-backend

Este es el backend del sistema de reservas para Visit Costa Rica US, implementado con Node.js, Express y Twilio.

## 🚀 Configuración e Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/visitcostaricaus-backend.git
   cd visitcostaricaus-backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz del proyecto y agrega las siguientes variables:
   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   ```
4. Inicia el servidor localmente:
   ```bash
   npm start
   ```
5. Para desplegar en **Railway**:
   - Crea un nuevo servicio en Railway.
   - Conéctalo con tu repositorio en GitHub.
   - Agrega las variables de entorno en la configuración de Railway.
   - Despliega y obtén la URL de la API.

6. **Prueba la API** con Postman o con un cliente HTTP:
   ```bash
   curl -X POST https://tu-api-en-railway.app/send-whatsapp \
   -H "Content-Type: application/json" \
   -d '{"nombre":"Test User","email":"test@email.com","telefono":"+50683806646","origen":"Aeropuerto","destino":"Playa Tamarindo","fecha":"2025-03-10"}'
   ```