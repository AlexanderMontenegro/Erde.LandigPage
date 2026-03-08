import React, { useEffect, useState } from 'react';
import { Drawer, Button, Typography, Divider, Box, IconButton, CircularProgress, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const CartDrawer = () => {
  const { cartOpen, toggleCart, cart, removeFromCart, updateQuantity, total, totalItems } = useProductStore();
  const { user, toggleAuthModal } = useAuthStore();
  const [preferenceId, setPreferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [openOtherPayments, setOpenOtherPayments] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);

  useEffect(() => {
    if (import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY) {
      initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);
    }
  }, []);

  const createPreference = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setErrorMsg(null);
    setPreferenceId('');

    try {
      const response = await fetch(`${BACKEND_URL}/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map(item => ({
            name: item.name,
            basePrice: Number(item.basePrice),
            quantity: Number(item.quantity)
          }))
        }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);
      const data = await response.json();
      if (!data.id) throw new Error('No ID recibido');

      setPreferenceId(data.id);
    } catch (err) {
      setErrorMsg(err.message || 'Error al generar pago');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cartOpen && cart.length > 0 && user) {
      createPreference();
    }
  }, [cartOpen, cart.length, user]);

  const handleMercadoPago = () => {
    if (!preferenceId) return;

    const width = 600;
    const height = 800;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`,
      'MercadoPagoCheckout',
      `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );
  };

  const OtherPaymentsModal = () => (
    <Modal open={openOtherPayments} onClose={() => setOpenOtherPayments(false)}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Otros medios de pago</Typography>
        <Button variant="outlined" fullWidth sx={{ mb: 2 }} onClick={() => { setOpenContactModal(true); setOpenOtherPayments(false); }}>
          Pago en presencia
        </Button>
        <Button variant="outlined" fullWidth onClick={() => { setOpenTransferModal(true); setOpenOtherPayments(false); }}>
          Transferencia bancaria
        </Button>
      </Box>
    </Modal>
  );

  const ContactModal = () => (
    <Modal open={openContactModal} onClose={() => setOpenContactModal(false)}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 500, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOnIcon sx={{ mr: 1 }} /> Pago en presencia
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Visítanos en nuestra tienda para pagar en efectivo o con tarjeta.
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Dirección: Benvenuto Cellini 817,Francisco Alvarez, Moreno
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          Teléfono: +54 11 7050-4193
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Horarios: Lunes a Viernes 9:00 - 18:00
        </Typography>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d290.1162905795998!2d-58.868648285726614!3d-34.64734956820712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc9353ab61262f%3A0xedbdb4fc0b9f10b8!2sErde%20DyC!5e0!3m2!1ses-419!2sar!4v1771849473652!5m2!1ses-419!2sar"
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: 8 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={() => setOpenContactModal(false)}>
          Cerrar
        </Button>
      </Box>
    </Modal>
  );

  const TransferModal = () => {
    const totalAmount = useProductStore.getState().total();
    const cartItems = useProductStore.getState().cart;

    const customerName = user?.nombre ? `${user.nombre} ${user.apellido || ''}` : 'Cliente';
    const customerPhone = user?.telefono || 'No registrado';
    const customerEmail = user?.email || 'No registrado';
    const customerAddress = user?.direccion || 'No registrado';

    const orderDetails = cartItems.map(item => 
      `${item.quantity}x ${item.name} - $${(item.basePrice * item.quantity).toLocaleString('es-AR')}`
    ).join('\n');

    const totalText = `Total: $${totalAmount.toLocaleString('es-AR')}`;
    const message = 
`¡Hola! Realicé una transferencia por el siguiente pedido:

${orderDetails}

${totalText}

Datos del cliente:
Nombre: ${customerName}
Teléfono: ${customerPhone}
Email: ${customerEmail}
Dirección: ${customerAddress}

Envio Comprobante.
A confirmar pago. Gracias!`;

    const whatsappNumber = '5491170504193'; 
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
      <Modal open={openTransferModal} onClose={() => setOpenTransferModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceIcon sx={{ mr: 1 }} /> Transferencia bancaria
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Transfiere el monto total a la siguiente cuenta y envía el comprobante por WhatsApp.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Banco: Mercado Pago
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            CBU: 0000003100074314531448
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Alias: erde.personalizacion
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Titular: Alexander Gabriel Montenegro
          </Typography>

          {/* Botón PAGADO - envía por WhatsApp */}
          <Button 
            variant="contained" 
            color="background.paper" 
            fullWidth 
            sx={{ mt: 3, py: 1.5 }}
            onClick={() => {
              window.open(whatsappLink, '_blank', 'noopener,noreferrer');
              setOpenTransferModal(false); 
            }}
          >
            Pagado - Enviar comprobante por WhatsApp
          </Button>

          <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => setOpenTransferModal(false)}>
            Cerrar
          </Button>
        </Box>
      </Modal>
    );
  };

  return (
    <>
      <Drawer anchor="right" open={cartOpen} onClose={toggleCart}>
        <Box sx={{ width: 360, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Mi carrito ({totalItems()})</Typography>
            <IconButton onClick={toggleCart}><CloseIcon /></IconButton>
          </Box>

          <Divider />

          <Box sx={{ flex: 1, overflowY: 'auto', py: 2 }}>
            {cart.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', mb: 3 }}>
                <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', mr: 2 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography>${Number(item.basePrice).toLocaleString()} × {item.quantity}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <RemoveIcon />
                    </IconButton>
                    <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Button size="small" color="error" onClick={() => removeFromCart(item.id)} sx={{ mt: 1 }}>
                    Eliminar
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="subtitle1">Total:</Typography>
            <Typography variant="h5">${Number(total()).toLocaleString()}</Typography>
          </Box>

          {errorMsg && <Typography color="error" sx={{ mb: 2 }}>{errorMsg}</Typography>}

          {loading ? (
            <CircularProgress sx={{ mx: 'auto', display: 'block' }} />
          ) : preferenceId ? (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<PaymentIcon />}
              onClick={handleMercadoPago}
              sx={{ mb: 2, py: 1.5 }}
            >
              Pagar con Mercado Pago
            </Button>
          ) : null}

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={() => setOpenOtherPayments(true)}
          >
            Otros medios de pago
          </Button>
        </Box>
      </Drawer>

      {/* Modales */}
      <OtherPaymentsModal />
      <ContactModal />
      <TransferModal />
    </>
  );
};

export default CartDrawer;