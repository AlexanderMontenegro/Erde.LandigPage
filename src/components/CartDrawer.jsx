import React, { useEffect, useState } from 'react';
import { 
  Drawer, Button, Typography, Divider, Box, IconButton, CircularProgress, Modal,
  TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';
import { initMercadoPago } from '@mercadopago/sdk-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const CartDrawer = () => {
  const { cartOpen, toggleCart, cart, removeFromCart, updateQuantity, total, totalItems } = useProductStore();
  const { user, toggleAuthModal, updateUser } = useAuthStore();

  const [preferenceId, setPreferenceId] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [openOtherPayments, setOpenOtherPayments] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);

  // Flujo de envío en 3 pasos
  const [step, setStep] = useState(1);
  const [shippingOption, setShippingOption] = useState(null);
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingCost, setShippingCost] = useState(0);
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingData, setShippingData] = useState({
    direccion: '',
    codigoPostal: '',
    provincia: '',
    localidad: ''
  });

  // Subtotal dinámico
  const [subtotalProducts, setSubtotalProducts] = useState(0);

  // Controla si EnviosFlex está disponible
  const [isEnviosFlexAvailable, setIsEnviosFlexAvailable] = useState(true);

  useEffect(() => {
    const newSubtotal = cart.reduce((acc, item) => acc + Number(item.basePrice) * Number(item.quantity), 0);
    setSubtotalProducts(newSubtotal);
  }, [cart]);

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

  const saveNewShipping = async () => {
    if (!shippingData.direccion || !shippingData.codigoPostal || 
        !shippingData.provincia || !shippingData.localidad) {
      alert('Todos los campos son obligatorios');
      return;
    }

    const cp = shippingData.codigoPostal.trim();

    let baseCost = 8300;
    let isEnviosFlexAvailable = true;

    const cpStart = cp.substring(0, 2);

    if (cpStart.startsWith('1') || cpStart.startsWith('14') || cpStart.startsWith('C1')) {
      baseCost = 3900; // CABA
    } else if (cpStart.startsWith('17') || cpStart.startsWith('B17') || 
               cpStart === 'B16' || cpStart.startsWith('18') || cpStart.startsWith('19')) {
      baseCost = 5500; // Franja 1
    } else if (cpStart.startsWith('16') || cpStart.startsWith('B')) {
      baseCost = 6900; // Franja 2
    } else {
      baseCost = 8300;
      isEnviosFlexAvailable = false; // No disponible en Franja 3 o interior lejano
    }

    await updateUser({
      direccion: shippingData.direccion,
      codigoPostal: cp,
      provincia: shippingData.provincia,
      localidad: shippingData.localidad
    });

    setShippingCost(baseCost);
    setShippingOption('new');
    setShowShippingForm(false);
    setStep(2);
    setIsEnviosFlexAvailable(isEnviosFlexAvailable);
  };

  const handleShippingMethodChange = (method) => {
    setShippingMethod(method);

    let cost = 0;

    if (method === 'correo-argentino') cost = 3500;
    if (method === 'andreani') cost = 5000;
    if (method === 'enviosflex') {
      if (!isEnviosFlexAvailable) {
        alert('EnviosFlex no está disponible en esta zona (solo CABA y Franjas 1 y 2).');
        return;
      }
      cost = shippingCost; // usa el costo calculado por código postal
    }

    setShippingCost(cost);
    setStep(3);
  };

  const cancelShipping = () => {
    setStep(1);
    setShippingOption(null);
    setShippingMethod('');
    setShippingCost(0);
    setShowShippingForm(false);
    setShippingData({
      direccion: '',
      codigoPostal: '',
      provincia: '',
      localidad: ''
    });
    setIsEnviosFlexAvailable(true);
  };

  const goBack = () => {
    if (step === 2) setStep(1);
    if (step === 3) setStep(2);
  };

  const finalTotal = subtotalProducts + shippingCost;

  const getShippingSummary = () => {
    if (!shippingOption) return null;
    if (shippingOption === 'local') return 'Retiro en Local';
    if (shippingOption === 'user') {
      return user?.direccion 
        ? `${user.direccion}, ${user.localidad || ''}, ${user.provincia || ''} (${user.codigoPostal || 'N/A'})`
        : 'Datos de usuario (sin dirección registrada)';
    }
    if (shippingOption === 'new') {
      return `${shippingData.direccion}, ${shippingData.localidad}, ${shippingData.provincia} (${shippingData.codigoPostal})`;
    }
    return null;
  };

  const shippingSummary = getShippingSummary();

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
          Dirección: Benvenuto Cellini 817, Francisco Alvarez, Moreno
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

    const internalOrderId = 'ERDE' + Math.floor(1000 + Math.random() * 9000);

    const message = 
`¡Hola! Realicé una transferencia por el siguiente pedido:

${orderDetails}

${totalText}

Datos del cliente:
Nombre: ${customerName}
Teléfono: ${customerPhone}
Email: ${customerEmail}
Dirección: ${customerAddress}

ID interno de la orden: ${internalOrderId}

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

          <Button 
            variant="contained" 
            color="success" 
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

            {cart.length > 0 && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">Subtotal productos:</Typography>
                  <Typography variant="h6">${subtotalProducts.toLocaleString('es-AR')}</Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          {shippingOption && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Dirección de envío:
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {shippingSummary}
              </Typography>
            </Box>
          )}

          {/* Paso 1 */}
          {step === 1 && (
            <>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Paso 1: Datos de Envío</Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <Button 
                  variant={shippingOption === 'local' ? 'contained' : 'outlined'} 
                  fullWidth 
                  onClick={() => { setShippingOption('local'); setShippingCost(0); setStep(2); }}
                >
                  1. Retiro en Local (Gratis)
                </Button>

                <Button 
                  variant={shippingOption === 'user' ? 'contained' : 'outlined'} 
                  fullWidth 
                  onClick={() => { setShippingOption('user'); setShippingCost(4500); setStep(2); }}
                >
                  2. Envío a datos de usuario
                </Button>

                <Button 
                  variant={shippingOption === 'new' ? 'contained' : 'outlined'} 
                  fullWidth 
                  onClick={() => setShowShippingForm(true)}
                >
                  3. Nuevos datos de envío
                </Button>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" fullWidth onClick={cancelShipping}>
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth 
                  disabled={!shippingOption} 
                  onClick={() => setStep(2)}
                >
                  Continuar
                </Button>
              </Box>
            </>
          )}

          {/* Paso 2 */}
          {step === 2 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => setStep(1)} size="small">
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="subtitle1">Paso 2: Opciones de Envío</Typography>
              </Box>

              {shippingOption === 'local' ? (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Retiro en local seleccionado. No aplica costo de envío.
                </Typography>
              ) : (
                <FormControl component="fieldset">
                  <FormLabel component="legend">Elige el servicio de envío</FormLabel>
                  <RadioGroup value={shippingMethod} onChange={(e) => handleShippingMethodChange(e.target.value)}>

                   {/* <FormControlLabel value="correo-argentino" control={<Radio />} label="Correo Argentino - $3500" /> */}
                    {/* <FormControlLabel value="andreani" control={<Radio />} label="Correo Andreani - $5000" />*/}
                    
                    <FormControlLabel 
                      value="enviosflex" 
                      control={<Radio disabled={!isEnviosFlexAvailable} />} 
                      label={`EnviosFlex  - $${isEnviosFlexAvailable ? shippingCost : 'No disponible'}`} 
                      disabled={!isEnviosFlexAvailable}
                    />
                  </RadioGroup>
                  {!isEnviosFlexAvailable && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      EnviosFlex no disponible en esta zona (solo CABA y Franjas 1 y 2).
                    </Typography>
                  )}
                </FormControl>
              )}

              {shippingMethod && (
                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                  Costo de envío: ${shippingCost.toLocaleString('es-AR')}
                </Typography>
              )}

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" fullWidth onClick={cancelShipping}>
                  Cancelar
                </Button>
                <Button 
                  variant="contained" 
                  fullWidth 
                  disabled={!shippingMethod && shippingOption !== 'local'} 
                  onClick={() => setStep(3)}
                >
                  Continuar
                </Button>
              </Box>
            </>
          )}

          {/* Paso 3 */}
          {step === 3 && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => setStep(2)} size="small">
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="subtitle1">Paso 3: Forma de Pago</Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal productos:</Typography>
                  <Typography>${subtotalProducts.toLocaleString('es-AR')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Costo de envío:</Typography>
                  <Typography>${shippingCost.toLocaleString('es-AR')}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="subtitle1">Total a pagar:</Typography>
                  <Typography variant="h5" color="primary">${finalTotal.toLocaleString('es-AR')}</Typography>
                </Box>
              </Box>

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
                  Pagar con Mercado Pago (${finalTotal.toLocaleString('es-AR')})
                </Button>
              ) : null}

              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<AccountBalanceWalletIcon />}
                onClick={() => setOpenOtherPayments(true)}
              >
                Otros medios de pago (${finalTotal.toLocaleString('es-AR')})
              </Button>

              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Button variant="outlined" fullWidth onClick={cancelShipping}>
                  Cancelar compra
                </Button>
              </Box>
            </>
          )}

          {step < 3 && (
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              Completa el paso {step} para continuar
            </Typography>
          )}
        </Box>
      </Drawer>

      {/* Modal Nuevos Datos de Envío */}
      <Modal open={showShippingForm} onClose={() => setShowShippingForm(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 420, bgcolor: 'background.paper', p: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Nuevos datos de envío</Typography>
          
          <TextField fullWidth label="Dirección" value={shippingData.direccion} onChange={(e) => setShippingData({...shippingData, direccion: e.target.value})} margin="dense" required />
          <TextField fullWidth label="Código Postal" value={shippingData.codigoPostal} onChange={(e) => setShippingData({...shippingData, codigoPostal: e.target.value})} margin="dense" required />
          <TextField fullWidth label="Provincia" value={shippingData.provincia} onChange={(e) => setShippingData({...shippingData, provincia: e.target.value})} margin="dense" required />
          <TextField fullWidth label="Localidad" value={shippingData.localidad} onChange={(e) => setShippingData({...shippingData, localidad: e.target.value})} margin="dense" required />

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button variant="outlined" fullWidth onClick={() => setShowShippingForm(false)}>
              Cancelar
            </Button>
            <Button variant="contained" fullWidth onClick={saveNewShipping}>
              Guardar y Continuar
            </Button>
          </Box>
        </Box>
      </Modal>

      <OtherPaymentsModal />
      <ContactModal />
      <TransferModal />
    </>
  );
};

export default CartDrawer;