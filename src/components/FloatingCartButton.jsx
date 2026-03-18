import React, { useState, useEffect } from 'react';
import { Fab, Badge, Tooltip, Box } from '@mui/material';
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

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <>
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
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
              '&:hover': { background: darkMode ? 'rgba(255, 193, 7, 0.3)' : 'rgba(0, 0, 0, 0.3)', transform: 'scale(1.1)' }
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
              '&:hover': { background: 'linear-gradient(45deg, #128C7E, #075E54)', transform: 'scale(1.08)' }
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
      </Box>

      <Box className="list-mov"
      
        sx={{
         display: { xs: 'flex', sm: 'none' },
          flexDirection: 'column',
          position: 'fixed',
          bottom: 6,
          left: 0,
          zIndex: 1600,
          gap: 1,  
          background: 'rgba(0, 0, 0, 0.25)',  
          borderRadius: '16px',
          padding: '2px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.35)',
        }}
      >
        {/* Modo oscuro/claro */}
        <Tooltip title={darkMode ? "Modo claro" : "Modo oscuro"} arrow>
          <Fab
            size="small"
            aria-label="toggle dark mode"
            sx={{
              background: darkMode ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 255, 255, 0.2)',
              color: darkMode ? '#ffeb3b' : '#424242',
              '&:hover': { background: darkMode ? 'rgba(255, 193, 7, 0.4)' : 'rgba(255, 255, 255, 0.4)' }
            }}
            onClick={toggleDarkMode}
          >
            {darkMode ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
          </Fab>
        </Tooltip>

        {/* WhatsApp */}
        <Tooltip title="WhatsApp" arrow>
          <Fab
            size="small"
            aria-label="whatsapp"
            sx={{
              background: 'linear-gradient(45deg, #25D366, #128C7E)',
              '&:hover': { background: 'linear-gradient(45deg, #128C7E, #075E54)' }
            }}
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon fontSize="small" />
          </Fab>
        </Tooltip>

        {/* Admin (solo si es admin) */}
        {isAdmin && (
          <Tooltip title="Admin" arrow>
            <Fab
              size="small"
              aria-label="admin"
              color="warning"
              onClick={() => navigate('/admin')}
            >
              <AdminPanelSettingsIcon fontSize="small" />
            </Fab>
          </Tooltip>
        )}

        {/* Carrito */}
        <Tooltip title="Carrito" arrow>
          <Fab
            size="small"
            aria-label="carrito"
            color="primary"
            onClick={toggleCart}
          >
            <Badge badgeContent={totalItems()} color="error">
              <ShoppingCartIcon fontSize="small" />
            </Badge>
          </Fab>
        </Tooltip>
      </Box>
    </>
  );
};

export default FloatingCartButton;