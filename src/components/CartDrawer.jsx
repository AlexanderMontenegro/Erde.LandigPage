import React, { useEffect, useState } from 'react';
import { Drawer, Button, Typography, Divider, Box, IconButton, CircularProgress, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
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

  // Botón Mercado Pago - abre en popup
  const handleMercadoPago = () => {
    if (!preferenceId) return;

    // Abre en nueva ventana flotante (popup)
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

  // Modal para otros medios de pago
  const OtherPaymentsModal = () => (
    <Modal
      open={openOtherPayments}
      onClose={() => setOpenOtherPayments(false)}
      aria-labelledby="other-payments-title"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          outline: 'none',
        }}
      >
        <Typography id="other-payments-title" variant="h6" component="h2" gutterBottom>
          Otros medios de pago
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          Podés abonar de las siguientes formas:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PaymentIcon />}
            fullWidth
            onClick={() => alert('Coordinar pago en efectivo o tarjeta en el local')}
          >
            Pago en presencia (efectivo / tarjeta)
          </Button>

          <Button
            variant="outlined"
            startIcon={<AccountBalanceWalletIcon />}
            fullWidth
            onClick={() => alert('Datos para transferencia: CBU 1234567890123456789012 - Alias: ERDE.PAGOS')}
          >
            Transferencia bancaria
          </Button>
        </Box>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => setOpenOtherPayments(false)}
        >
          Cerrar
        </Button>
      </Box>
    </Modal>
  );

  return (
    <>
      <Drawer anchor="right" open={cartOpen} onClose={toggleCart}>
        <Box sx={{ width: 360, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Mi carrito ({totalItems()})</Typography>
            <IconButton onClick={toggleCart}><CloseIcon /></IconButton>
          </Box>

          <Divider />

          {/* Items */}
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

          {/* Total */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="subtitle1">Total:</Typography>
            <Typography variant="h5">${Number(total()).toLocaleString()}</Typography>
          </Box>

          {errorMsg && <Typography color="error" sx={{ mb: 2 }}>{errorMsg}</Typography>}

          {/* Botones de pago */}
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

      {/* Modal otros pagos */}
      <OtherPaymentsModal />
    </>
  );
};

export default CartDrawer;