import axios from 'axios';

const MP_ACCESS_TOKEN = import.meta.env.VITE_MERCADO_PAGO_ACCESS_TOKEN;

export const createPreference = async (cartItems, user) => {
  if (!MP_ACCESS_TOKEN) {
    throw new Error('Access Token de Mercado Pago no configurado');
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
      success: `${window.location.origin}/success`,
      failure: `${window.location.origin}/failure`,
      pending: `${window.location.origin}/pending`,
    },
    auto_return: 'approved',
    notification_url: `${window.location.origin}/webhook`, // Opcional por ahora
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
    throw new Error('No se pudo iniciar el pago. Intenta de nuevo.');
  }
};