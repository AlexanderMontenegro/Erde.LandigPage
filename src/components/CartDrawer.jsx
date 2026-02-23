import React, { useEffect, useState } from 'react';
import { Drawer, Button, List, Typography, Divider, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

const CartDrawer = () => {
  const { 
    cartOpen, 
    toggleCart, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    total  // ← Cambia aquí: usa 'total' (o el nombre real en tu store)
  } = useProductStore();
  
  const { user, toggleAuthModal } = useAuthStore();
  const [preferenceId, setPreferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);

  const createPreference = async () => {
    try {
      const response = await fetch('http://localhost:3001/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      if (!response.ok) {
        throw new Error(`Error en create-preference: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Preference ID creada:', data.id); // ← Para debug: verifica si empieza con 1907601748-
      return data.id;
    } catch (err) {
      console.error('Error creando preferencia:', err);
      setError('No se pudo crear la preferencia de pago. Verifica el servidor.');
      return null;
    }
  };

  useEffect(() => {
    if (cartOpen && cart.length > 0 && user && !preferenceId) {
      setLoading(true);
      setError(null);
      createPreference().then(id => {
        if (id) setPreferenceId(id);
        setLoading(false);
      });
    }
  }, [cartOpen, cart, user, preferenceId]);

  const handleCheckout = () => {
    if (!user) {
      toggleAuthModal();
    }
  };

  return (
    <Drawer anchor="right" open={cartOpen} onClose={toggleCart}>
      <Box sx={{ width: 350, p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Mi carrito ({cart.length})</Typography>
          <IconButton onClick={toggleCart}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />
        <List>
          {cart.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 16 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="body2">${item.basePrice} × {item.quantity}</Typography>
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
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="h6" color="primary">${total || 0}</Typography> {/* ← Usa 'total' directamente */}
        </Box>

        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

        {loading ? (
          <Typography sx={{ mt: 2 }}>Cargando botón de pago...</Typography>
        ) : preferenceId ? (
          <Box sx={{ mt: 3 }}>
            <Wallet
              initialization={{ preferenceId }}
              customization={{ texts: { valueProp: 'smart_option' } }}
              onError={(err) => {
                console.error('Error en Wallet Brick:', err);
                setError('Error al cargar el botón de Mercado Pago: ' + (err.message || 'Desconocido'));
              }}
            />
          </Box>
        ) : null}

        {!user && cart.length > 0 && (
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            sx={{ mt: 2 }} 
            onClick={handleCheckout}
          >
            Iniciar sesión para pagar
          </Button>
        )}

        <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={toggleCart}>
          Seguir comprando
        </Button>
      </Box>
    </Drawer>
  );
};

export default CartDrawer;