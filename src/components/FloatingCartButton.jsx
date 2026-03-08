import React, { useState, useEffect } from 'react';
import { Fab, Badge, Tooltip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import useProductStore from '../store/productStore';
import useAuthStore from '../store/authStore';

const FloatingCartButton = () => {
  const { toggleCart, totalItems } = useProductStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const whatsappNumber = '5491170504193';
  const whatsappMessage = '¡Hola! Quiero hacer una consulta sobre productos personalizados 😊';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('darkMode', JSON.stringify(darkMode));

  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      return newMode;
    });
  };

  return (
    <>
      <Tooltip title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"} arrow placement="left">
        <Fab
          aria-label="toggle dark mode"
          sx={{
            position: 'fixed',
            bottom: 222,
            right: 24,
            zIndex: 1600,
            background: darkMode ? 'rgba(255, 193, 7, 0.15)' : 'rgba(0, 0, 0, 0.15)',
            color: darkMode ? '#ffeb3b' : '#424242',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            '&:hover': {
              background: darkMode ? 'rgba(255, 193, 7, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              transform: 'scale(1.1)',
            }
          }}
          onClick={toggleDarkMode}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </Fab>
      </Tooltip>

      <Tooltip title="Chatea con nosotros por WhatsApp" arrow placement="left">
        <Fab
          color="success"
          aria-label="whatsapp"
          sx={{
            position: 'fixed',
            bottom: 156,
            right: 24,
            zIndex: 1500,
            background: 'linear-gradient(45deg, #25D366, #128C7E)',
            boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #128C7E, #075E54)',
              transform: 'scale(1.08)',
            }
          }}
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WhatsAppIcon />
        </Fab>
      </Tooltip>

      {isAdmin && (
        <Tooltip title="Panel Administrativo" arrow placement="left">
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
        </Tooltip>
      )}

      <Tooltip title="Ver carrito" arrow placement="left">
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
      </Tooltip>
    </>
  );
};

export default FloatingCartButton;