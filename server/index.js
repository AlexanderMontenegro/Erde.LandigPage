// server/index.js (versión compatible con mercadopago >=2.0.0)
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importa las partes necesarias del SDK v2
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// Crea el cliente una vez (recomendado: global o por request si necesitas idempotency)
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  // Opcional: timeout, idempotencyKey, etc.
  options: { timeout: 10000 }
});

app.post('/create-preference', async (req, res) => {
  try {
    // Crea instancia de Preferences API
    const preferenceClient = new Preference(client);

    const preferenceData = {
      items: req.body.items.map(item => ({
        title: item.name,
        unit_price: Number(item.basePrice),
        quantity: Number(item.quantity),
        currency_id: 'ARS'  // Obligatorio para Argentina
      })),
      back_urls: {
        success: 'http://localhost:5173/success',  // Cambia a tu URL prod después
        failure: 'http://localhost:5173/failure',
        pending: 'http://localhost:5173/pending'
      },
      auto_return: 'approved',  // Retorna automáticamente si aprobado
      // Opcional: payer, payment_methods, etc.
    };

    const response = await preferenceClient.create({ body: preferenceData });
    
    console.log('Preferencia creada exitosamente:', response.id);
    res.json({ id: response.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({ 
      error: 'Error creando preferencia',
      details: error.message || error.cause || 'Desconocido'
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend Mercado Pago corriendo en puerto ${PORT}`);
});