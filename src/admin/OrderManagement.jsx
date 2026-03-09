import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Select, MenuItem, Typography, Box, TextField, Button 
} from '@mui/material';
import { db } from '../config/firebase';
import { collection, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';  // ← Agregado getDoc aquí

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState({});
  const [pendingStatus, setPendingStatus] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    setPendingStatus(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const saveChanges = async (orderId) => {
    const newStatus = pendingStatus[orderId];
    const tracking = trackingNumber[orderId] || '';

    if (!newStatus) {
      alert('No hay cambios en el estado.');
      return;
    }

    // Validar tracking si se cambia a ENVIADO
    if (newStatus === 'ENVIADO' && !tracking) {
      alert('Ingresa un número de seguimiento para estado ENVIADO.');
      return;
    }

    const orderRef = doc(db, 'orders', orderId);
    const updateData = { status: newStatus };

    if (tracking) {
      updateData.trackingNumber = tracking;
    }

    await updateDoc(orderRef, updateData);

    // Enviar email con Resend desde el backend
    try {
      const order = orders.find(o => o.id === orderId);

      // Obtener email del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'users', order.userId));
      const userEmail = userDoc.exists() ? userDoc.data().email : null;

      if (!userEmail) {
        console.warn('No se encontró email del usuario');
        alert('Estado guardado, pero no se encontró email del usuario para enviar notificación.');
        return;
      }

      const response = await fetch(`${BACKEND_URL}/send-order-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          emailTo: userEmail,
          orderDetails: order.items?.map(item => `${item.quantity}x ${item.name}`).join('\n') || 'Sin detalle',
          total: order.total || 0,
          tracking
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        console.error('Error backend email:', err);
        alert('Estado guardado, pero no se pudo enviar email.');
      } else {
        console.log('Email enviado desde backend');
      }
    } catch (err) {
      console.error('Error al llamar al endpoint de email:', err);
      alert('Estado guardado, pero error al enviar email.');
    }

    // Limpiar inputs
    setPendingStatus(prev => ({ ...prev, [orderId]: undefined }));
    setTrackingNumber(prev => ({ ...prev, [orderId]: '' }));
  };

  const handleTrackingChange = (orderId, value) => {
    setTrackingNumber(prev => ({ ...prev, [orderId]: value }));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Órdenes
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Interno</TableCell>
              <TableCell>ID Mercado Pago</TableCell>
              <TableCell>Usuario ID</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>N° Tracking</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.internalOrderId || 'N/A'}</TableCell>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>${order.total?.toLocaleString() || 'N/A'}</TableCell>
                <TableCell>{order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</TableCell>
                <TableCell>
                  <Select
                    value={pendingStatus[order.id] || order.status || 'PENDIENTE'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                    sx={{
                      minWidth: 140,
                      backgroundColor: 
                        (pendingStatus[order.id] || order.status) === 'PENDIENTE' ? '#a855f7' :  // Violeta
                        (pendingStatus[order.id] || order.status) === 'A CONFIRMAR' ? '#2196f3' :  // Azul
                        (pendingStatus[order.id] || order.status) === 'PAGO' ? '#ffeb3b' :  // Amarillo
                        (pendingStatus[order.id] || order.status) === 'ENVIADO' ? '#4caf50' :  // Verde
                        (pendingStatus[order.id] || order.status) === 'ENTREGADO' ? '#ff9800' : '#9e9e9e',  // Naranja
                      color: (pendingStatus[order.id] || order.status) === 'PAGO' ? '#000' : '#fff',
                    }}
                  >
                    <MenuItem value="PENDIENTE">PENDIENTE</MenuItem>
                    <MenuItem value="A CONFIRMAR">A CONFIRMAR</MenuItem>
                    <MenuItem value="PAGO">PAGO</MenuItem>
                    <MenuItem value="ENVIADO">ENVIADO</MenuItem>
                    <MenuItem value="ENTREGADO">ENTREGADO</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="N° de seguimiento"
                    value={trackingNumber[order.id] || order.trackingNumber || ''}
                    onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                    sx={{ width: 140 }}
                  />
                  {order.trackingNumber && <span> (Guardado: {order.trackingNumber})</span>}
                </TableCell>
                <TableCell>
                  {(pendingStatus[order.id] || trackingNumber[order.id]) && (
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      onClick={() => saveChanges(order.id)}
                    >
                      Guardar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderManagement;