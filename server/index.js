require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { Resend } = require('resend');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  options: { timeout: 10000 }
});

const resend = new Resend(process.env.RESEND_API_KEY);

// Endpoint existente: crear preferencia de Mercado Pago
app.post('/create-preference', async (req, res) => {
  try {
    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ error: 'No se recibieron items válidos' });
    }

    const itemsProcesados = req.body.items.map((item, index) => {
      const quantityNum = Number(item.quantity);
      const priceNum = Number(item.basePrice);

      if (isNaN(quantityNum) || quantityNum < 1 || !Number.isInteger(quantityNum)) {
        throw new Error(`quantity inválido en item ${index + 1}`);
      }
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error(`basePrice inválido en item ${index + 1}`);
      }

      return {
        title: String(item.name || 'Producto sin nombre'),
        unit_price: priceNum,
        quantity: quantityNum,
        currency_id: 'ARS'
      };
    });

    const preferenceData = {
      items: itemsProcesados,
      back_urls: {
        success: 'https://erde-landigpage-frontend.onrender.com/success',
        failure: 'https://erde-landigpage-frontend.onrender.com/failure',
        pending: 'https://erde-landigpage-frontend.onrender.com/pending'
      },
      auto_return: 'approved',
      external_reference: 'orden-' + Date.now(), // Puedes mejorar esto
      metadata: { source: 'erde-store' }
    };

    const preferenceClient = new Preference(client);
    const response = await preferenceClient.create({ body: preferenceData });

    res.json({ id: response.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ error: 'Error creando preferencia', details: error.message });
  }
});

// NUEVO ENDPOINT: Enviar email cuando cambia estado de orden
app.post('/send-order-email', async (req, res) => {
  const { orderId, status, emailTo, orderDetails, total, tracking } = req.body;

  if (!emailTo || !status) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  let subject = '';
  let text = `Hola,\n\n`;

  if (status === 'PAGO') {
    subject = `¡Pago confirmado! Orden #${orderId}`;
    text += `Tu pago ha sido confirmado.\n\n`;
    text += `Detalle de tu compra:\n${orderDetails}\n`;
    text += `\nTotal: $${total.toLocaleString('es-AR')}\n`;
    text += `\nEstado actual: PAGO (en preparación)\n`;
    text += `\nPronto te avisaremos cuando esté en camino. ¡Gracias por tu compra!`;

  } else if (status === 'ENVIADO') {
    subject = `Tu orden #${orderId} ha sido enviada`;
    text += `Tu pedido ha sido despachado.\n\n`;
    text += `Detalle de tu compra:\n${orderDetails}\n`;
    text += `\nTotal: $${total.toLocaleString('es-AR')}\n`;
    text += `\nEstado actual: ENVIADO\n`;
    text += `Número de seguimiento: ${tracking || 'No disponible'}\n`;
    text += `\n¡Ya está en camino!`;

  } else if (status === 'ENTREGADO') {
    subject = `¡Gracias por tu compra! Orden #${orderId} entregada`;
    text += `Tu pedido ha sido entregado con éxito.\n\n`;
    text += `Detalle de tu compra:\n${orderDetails}\n`;
    text += `\nTotal: $${total.toLocaleString('es-AR')}\n`;
    text += `\nEstado actual: ENTREGADO\n\n`;
    text += `Como agradecimiento, usa el cupón ERDE-DESCUENTO-10 para 10% off en tu próxima compra.\n`;
    text += `¡Esperamos verte pronto de nuevo!`;

  } else {
    return res.status(400).json({ error: 'Estado no válido para envío de email' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'ERDE Store <onboarding@resend.dev>', // Usa el remitente por defecto de Resend o tu dominio verificado
      to: emailTo,
      subject,
      text,
    });

    if (error) {
      console.error('Error Resend:', error);
      return res.status(500).json({ error: 'Error enviando email', details: error });
    }

    res.json({ success: true, messageId: data.id });
  } catch (err) {
    console.error('Error en Resend:', err);
    res.status(500).json({ error: 'Error interno al enviar email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend corriendo en puerto ${PORT}`);
});