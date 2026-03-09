require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
  options: { timeout: 10000 }
});

// Función para generar ID único ERDE0001, ERDE0002...
async function generateOrderId() {
  // Contador simple (en producción deberías usar Firestore o DB para atomicidad)
  const counterRef = doc(db, 'counters', 'orders');
  const counterSnap = await getDoc(counterRef);
  let count = 1;
  if (counterSnap.exists()) {
    count = counterSnap.data().lastId + 1;
    await updateDoc(counterRef, { lastId: count });
  } else {
    await setDoc(counterRef, { lastId: count });
  }
  return `ERDE${String(count).padStart(4, '0')}`;
}

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

    const internalOrderId = await generateOrderId(); // ← NUEVO: ID ERDE0001

    const preferenceData = {
      items: itemsProcesados,
      back_urls: {
        success: 'https://erde-landigpage-frontend.onrender.com/success',
        failure: 'https://erde-landigpage-frontend.onrender.com/failure',
        pending: 'https://erde-landigpage-frontend.onrender.com/pending'
      },
      auto_return: 'approved',
      external_reference: internalOrderId, // ← Guardamos el ID interno aquí
      metadata: { internalOrderId } // ← También en metadata para fácil acceso
    };

    console.log('Datos que se enviarán a Mercado Pago:');
    console.log(JSON.stringify(preferenceData, null, 2));

    const preferenceClient = new Preference(client);
    const response = await preferenceClient.create({ body: preferenceData });

    console.log('Preferencia creada exitosamente:', response.id);
    res.json({ id: response.id, internalOrderId }); // ← Devolvemos también el ID
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