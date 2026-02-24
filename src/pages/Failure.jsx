import React from 'react';
import { Button, Typography, Box, Container } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import useProductStore from '../store/productStore';

const Failure = () => {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
      <ErrorIcon color="error" sx={{ fontSize: 100 }} />
      <Typography variant="h4" color="error.main" gutterBottom sx={{ mt: 3 }}>
        El pago no se pudo completar
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Algo salió mal durante el proceso.
      </Typography>

      {/* Mensaje para cerrar */}
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
          (o intenta pagar nuevamente desde el carrito)
        </Typography>
      </Box>

      <Button variant="outlined" href="/" size="large">
        Volver al carrito
      </Button>
    </Container>
  );
};

export default Failure;