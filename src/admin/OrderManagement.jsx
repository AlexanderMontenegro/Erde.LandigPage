import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Select, MenuItem, Typography, Box, TextField, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { db } from '../config/firebase';
import { collection, onSnapshot, updateDoc, doc, addDoc } from 'firebase/firestore';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState({});
  const [pendingStatus, setPendingStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');           // ← Filtro por ID Interno
  const [showManualModal, setShowManualModal] = useState(false); // ← Modal manual
  const [manualForm, setManualForm] = useState({              // ← Datos para orden manual
    userId: '',
    email: '',
    telefono: '',
    total: 0,
    items: ''  // texto simple: "2x Producto A, 1x Producto B"
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  // Filtrar por ID Interno
  const filteredOrders = orders.filter(order =>
    (order.internalOrderId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = (orderId, newStatus) => {
    setPendingStatus(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const saveChanges = async (orderId) => {
    const newStatus = pendingStatus[orderId];
    const tracking = trackingNumber[orderId] || '';

    if (!newStatus) return;

    if (newStatus === 'ENVIADO' && !tracking) {
      alert('Ingresa un número de seguimiento para estado ENVIADO.');
      return;
    }

    const orderRef = doc(db, 'orders', orderId);
    const updateData = { status: newStatus };
    if (tracking) updateData.trackingNumber = tracking;

    await updateDoc(orderRef, updateData);

    setPendingStatus(prev => ({ ...prev, [orderId]: undefined }));
    setTrackingNumber(prev => ({ ...prev, [orderId]: '' }));
  };

  const handleTrackingChange = (orderId, value) => {
    setTrackingNumber(prev => ({ ...prev, [orderId]: value }));
  };

  // Crear orden manual
  const createManualOrder = async () => {
    if (!manualForm.userId || !manualForm.email || !manualForm.telefono || !manualForm.total) {
      alert('Faltan datos obligatorios');
      return;
    }

    const newOrder = {
      internalOrderId: `ERDE${String(Date.now()).slice(-4)}`, // serial simple único
      userId: manualForm.userId,
      email: manualForm.email,
      telefono: manualForm.telefono,
      total: Number(manualForm.total),
      items: manualForm.items.split(',').map(i => i.trim()),
      status: 'PENDIENTE',
      createdAt: new Date(),
      trackingNumber: ''
    };

    await addDoc(collection(db, 'orders'), newOrder);
    setShowManualModal(false);
    setManualForm({ userId: '', email: '', telefono: '', total: 0, items: '' });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Gestión de Órdenes
      </Typography>

      {/* Botón Nueva Orden Manual */}
      <Button 
        variant="contained" 
        color="success" 
        sx={{ mb: 2 }}
        onClick={() => setShowManualModal(true)}
      >
        + Nueva Orden Manual
      </Button>

      {/* Filtro por ID Interno */}
      <TextField
        label="Buscar por ID Interno"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID Interno</TableCell>
              <TableCell>ID Cliente (Email)</TableCell>
              <TableCell>ID Contacto (Teléfono)</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>N° Tracking</TableCell>
              <TableCell>Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.internalOrderId || 'N/A'}</TableCell>
                <TableCell>{order.email || 'N/A'}</TableCell>
                <TableCell>{order.telefono || 'N/A'}</TableCell>
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
                        (pendingStatus[order.id] || order.status) === 'PENDIENTE' ? '#a855f7' :
                        (pendingStatus[order.id] || order.status) === 'A CONFIRMAR' ? '#2196f3' :
                        (pendingStatus[order.id] || order.status) === 'PAGO' ? '#ffeb3b' :
                        (pendingStatus[order.id] || order.status) === 'ENVIADO' ? '#4caf50' :
                        (pendingStatus[order.id] || order.status) === 'ENTREGADO' ? '#ff9800' : '#9e9e9e',
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

      {/* Modal Nueva Orden Manual */}
      <Dialog open={showManualModal} onClose={() => setShowManualModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Orden Manual</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="ID Usuario" value={manualForm.userId} onChange={(e) => setManualForm({...manualForm, userId: e.target.value})} margin="dense" />
          <TextField fullWidth label="Email (ID Cliente)" value={manualForm.email} onChange={(e) => setManualForm({...manualForm, email: e.target.value})} margin="dense" />
          <TextField fullWidth label="Teléfono (ID Contacto)" value={manualForm.telefono} onChange={(e) => setManualForm({...manualForm, telefono: e.target.value})} margin="dense" />
          <TextField fullWidth label="Total" type="number" value={manualForm.total} onChange={(e) => setManualForm({...manualForm, total: e.target.value})} margin="dense" />
          <TextField fullWidth label="Ítems (ej: 2x Producto A, 1x Producto B)" value={manualForm.items} onChange={(e) => setManualForm({...manualForm, items: e.target.value})} margin="dense" multiline rows={2} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowManualModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={createManualOrder}>Crear Orden</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderManagement;