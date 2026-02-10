import axios from 'axios';

const MP_ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;
const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5173';

export const createPreference = async (cartItems, user) => {
  if (!MP_ACCESS_TOKEN) {
    throw new Error('Access Token de Mercado Pago no configurado en .env');
  }

  const items = cartItems.map(item => ({
    title: item.name,
    unit_price: Number(item.basePrice),
    quantity: Number(item.qty),
    currency_id: 'ARS',
    picture_url: item.image,
  }));

  const body = {
    items,
    payer: {
      name: user?.nombre || '',
      surname: user?.apellido || '',
      email: user?.email || '',
      phone: { number: user?.telefono || '' },
      address: { street_name: user?.direccion || '' },
    },
    back_urls: {
      success: `${BASE_URL}/success`,
      failure: `${BASE_URL}/failure`,
      pending: `${BASE_URL}/pending`,
    },
    auto_return: 'approved',
    notification_url: `${BASE_URL}/webhook`, // Opcional por ahora
  };

  try {
    const response = await axios.post(
      'https://api.mercadopago.com/checkout/preferences',
      body,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.init_point; // URL del checkout
  } catch (error) {
    console.error('Error creando preferencia Mercado Pago:', error.response?.data || error);
    throw new Error('No se pudo iniciar el pago. Verifica las URLs o las credenciales.');
  }
};