import React from 'react';
import { Fab, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useProductStore from '../store/productStore';

const FloatingCartButton = () => {
  const { toggleCart, totalItems } = useProductStore();

  return (
    <Fab
      color="primary"
      aria-label="carrito"
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 1300,
      }}
      onClick={toggleCart}
    >
      <Badge badgeContent={totalItems()} color="error">
        <ShoppingCartIcon />
      </Badge>
    </Fab>
  );
};

export default FloatingCartButton;