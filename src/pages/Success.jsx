import React, { useEffect } from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useProductStore from '../store/productStore';

const Success = () => {
  const { cart, total } = useProductStore();

  useEffect(() => {
    useProductStore.setState({ cart: [] });
  }, []);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 100 }} />
      <Typography variant="h4" color="success.main" gutterBottom sx={{ mt: 3 }}>
        ¡Pago realizado con éxito!
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Gracias por tu compra. El total fue ${total().toLocaleString()}.
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Te enviaremos un correo con los detalles del pedido.
      </Typography>

      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Puedes cerrar esta ventana ahora
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => window.close()}
          disabled={!window.opener} 
          sx={{ mt: 2 }}
        >
          Cerrar ventana
        </Button>
        <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
          (Si no ves el botón, simplemente cierra la pestaña)
        </Typography>
      </Box>

      <Button variant="outlined" href="/" size="large">
        Volver al inicio
      </Button>
    </Container>
  );
};

export default Success;