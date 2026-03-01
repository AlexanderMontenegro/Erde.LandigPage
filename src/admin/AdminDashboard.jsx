import React, { useState } from 'react';
import { 
  Container, Tabs, Tab, Box, Typography, IconButton, Tooltip 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import ProtectedAdminRoute from './ProtectedAdminRoute';

const AdminDashboard = () => {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <ProtectedAdminRoute>
      <Container maxWidth="xl" sx={{ py: 4, position: 'relative' }}>
        {/* Botón de volver (arriba a la derecha) */}
        <Tooltip title="Volver al sitio principal">
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 10,
              bgcolor: 'background.paper',
              boxShadow: 2,
              '&:hover': { bgcolor: 'action.hover' }
            }}
            size="large"
          >
            <ArrowBackIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Typography variant="h4"  gutterBottom sx={{ mb: 4 }}>
          Panel Administrativo
        </Typography>

        <Tabs value={tab} onChange={(e, newTab) => setTab(newTab)} sx={{ mb: 3 }}>
          <Tab  label="Gestión de Productos" />
          <Tab label="Gestión de Usuarios" />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {tab === 0 && <ProductManagement />}
          {tab === 1 && <UserManagement />}
        </Box>
      </Container>
    </ProtectedAdminRoute>
  );
};

export default AdminDashboard;