import React from 'react';
import { Fab, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useNavigate } from 'react-router-dom';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';

const FloatingCartButton = () => {
  const { toggleCart, totalItems } = useProductStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  return (
    <>
      {/* Botón Carrito (sin cambios) */}
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

      {/* Botón Admin (solo para admin, al lado del carrito) */}
      {isAdmin && (
        <Fab
          color="warning"
          aria-label="admin"
          className="admin-fab"
          sx={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            zIndex: 1400,
          }}
          onClick={() => navigate('/admin')}
        >
          <AdminPanelSettingsIcon />
        </Fab>
      )}
    </>
  );
};

export default FloatingCartButton;