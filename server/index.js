require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

// Cliente Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  options: { timeout: 10000 }
});

app.post('/create-preference', async (req, res) => {
  try {
    console.log('=== BODY RECIBIDO DEL FRONTEND ===');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('==================================');

    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res.status(400).json({ error: 'No se recibieron items válidos' });
    }

    const itemsProcesados = req.body.items.map((item, index) => {
      console.log(`Procesando item ${index + 1}:`);
      console.log('  - name:', item.name);
      console.log('  - basePrice raw:', item.basePrice, 'tipo:', typeof item.basePrice);
      console.log('  - quantity raw:', item.quantity, 'tipo:', typeof item.quantity);

      const quantityNum = Number(item.quantity);
      const priceNum = Number(item.basePrice);

      if (isNaN(quantityNum) || quantityNum < 1 || !Number.isInteger(quantityNum)) {
        throw new Error(`quantity inválido en item ${index + 1}: "${item.quantity}" (tipo: ${typeof item.quantity})`);
      }
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error(`basePrice inválido en item ${index + 1}: "${item.basePrice}"`);
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
        success: 'https://erde-landigpage-frontend.onrender.com/success', // Cambia a tu URL frontend real
        failure: 'https://erde-landigpage-frontend.onrender.com/failure',
        pending: 'https://erde-landigpage-frontend.onrender.com/pending'
      },
      auto_return: 'approved' // Solo en prod (HTTPS)
    };

    console.log('Datos que se enviarán a Mercado Pago:');
    console.log(JSON.stringify(preferenceData, null, 2));

    const preferenceClient = new Preference(client);
    const response = await preferenceClient.create({ body: preferenceData });

    console.log('Preferencia creada exitosamente:', response.id);
    res.json({ id: response.id });
  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({
      error: 'Error creando preferencia',
      details: error.message || (error.response?.data ? JSON.stringify(error.response.data) : 'Desconocido')
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend Mercado Pago corriendo en puerto ${PORT}`);
});