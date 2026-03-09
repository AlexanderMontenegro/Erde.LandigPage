import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Select, MenuItem, Typography, Box, TextField, Button 
} from '@mui/material';
import { db } from '../config/firebase';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
  };

  const handleTrackingChange = (orderId, value) => {
    setTrackingNumber(prev => ({ ...prev, [orderId]: value }));
  };

  const saveTracking = async (orderId) => {
    const tracking = trackingNumber[orderId];
    if (tracking) {
      await updateDoc(doc(db, 'orders', orderId), { trackingNumber: tracking });
      // Limpia el input después de guardar
      setTrackingNumber(prev => ({ ...prev, [orderId]: '' }));
    }
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
                    value={order.status || 'A CONFIRMAR'}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    size="small"
                    sx={{
                      minWidth: 140,
                      backgroundColor: 
                        order.status === 'PAGO' ? '#ffeb3b' : 
                        order.status === 'A CONFIRMAR' ? '#2196f3' : 
                        order.status === 'ENVIADO' ? '#4caf50' : 
                        order.status === 'ENTREGADO' ? '#ff9800' : '#9e9e9e',
                      color: order.status === 'PAGO' ? '#000' : '#fff',
                    }}
                  >
                    <MenuItem value="A CONFIRMAR">A CONFIRMAR</MenuItem>
                    <MenuItem value="PAGO">PAGO</MenuItem>
                    <MenuItem value="ENVIADO">ENVIADO</MenuItem>
                    <MenuItem value="ENTREGADO">ENTREGADO</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {order.trackingNumber || trackingNumber[order.id] || '-'}
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    placeholder="N° de seguimiento"
                    value={trackingNumber[order.id] || order.trackingNumber || ''}
                    onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                    sx={{ width: 140 }}
                  />
                  <Button 
                    size="small" 
                    onClick={() => saveTracking(order.id)}
                    disabled={!trackingNumber[order.id]}
                    sx={{ ml: 1 }}
                  >
                    Guardar
                  </Button>
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