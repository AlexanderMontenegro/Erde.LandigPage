import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Select, MenuItem, Typography, Box, TextField, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions 
} from '@mui/material';
import { db } from '../config/firebase';
import { collection, onSnapshot, updateDoc, doc, addDoc, query, where, getDocs } from 'firebase/firestore';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [trackingNumber, setTrackingNumber] = useState({});
  const [pendingStatus, setPendingStatus] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualForm, setManualForm] = useState({
    email: '',
    telefono: '',
    total: 0,
    items: '',
    referenciaPago: ''  // ← Número de referencia para transferencias manuales
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

  // Crear orden manual + sincronizar/crear usuario
  const createManualOrder = async () => {
    if (!manualForm.email || !manualForm.telefono || !manualForm.total) {
      alert('Faltan datos obligatorios: email, teléfono y total');
      return;
    }

    // Buscar usuario existente por email o teléfono
    let userId = null;
    const qEmail = query(collection(db, 'users'), where('email', '==', manualForm.email));
    const qPhone = query(collection(db, 'users'), where('telefono', '==', manualForm.telefono));

    const [snapEmail, snapPhone] = await Promise.all([getDocs(qEmail), getDocs(qPhone)]);

    if (!snapEmail.empty) {
      userId = snapEmail.docs[0].id;
    } else if (!snapPhone.empty) {
      userId = snapPhone.docs[0].id;
    } else {
      // Crear nuevo usuario
      const newUser = {
        email: manualForm.email,
        telefono: manualForm.telefono,
        nombre: 'Usuario Manual',
        apellido: '',
        direccion: '',
        role: 'client',
        createdAt: new Date()
      };
      const userRef = await addDoc(collection(db, 'users'), newUser);
      userId = userRef.id;
    }

    // Crear orden
    const newOrder = {
      internalOrderId: `ERDE${String(Date.now()).slice(-5)}`, // serial único simple
      userId,
      email: manualForm.email,
      telefono: manualForm.telefono,
      total: Number(manualForm.total),
      items: manualForm.items.split(',').map(i => i.trim()),
      status: 'PENDIENTE',
      createdAt: new Date(),
      trackingNumber: '',
      referenciaPago: manualForm.referenciaPago || ''  // ← referencia manual para transferencias
    };

    await addDoc(collection(db, 'orders'), newOrder);
    setShowManualModal(false);
    setManualForm({ email: '', telefono: '', total: 0, items: '', referenciaPago: '' });
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
              <TableCell>ID Mercado Pago / Referencia</TableCell>
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
                <TableCell>{order.referenciaPago || order.id || 'N/A'}</TableCell>
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
          <TextField fullWidth label="Email (ID Cliente)" value={manualForm.email} onChange={(e) => setManualForm({...manualForm, email: e.target.value})} margin="dense" required />
          <TextField fullWidth label="Teléfono (ID Contacto)" value={manualForm.telefono} onChange={(e) => setManualForm({...manualForm, telefono: e.target.value})} margin="dense" required />
          <TextField fullWidth label="Total" type="number" value={manualForm.total} onChange={(e) => setManualForm({...manualForm, total: e.target.value})} margin="dense" required />
          <TextField fullWidth label="Número de Referencia (Pago Transferencia)" value={manualForm.referenciaPago} onChange={(e) => setManualForm({...manualForm, referenciaPago: e.target.value})} margin="dense" />
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