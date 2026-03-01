import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Switch, Typography, Box 
} from '@mui/material';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Carga en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleSave = async (productData) => {
    if (currentProduct) {
      await updateDoc(doc(db, 'products', currentProduct.id), productData);
    } else {
      await addDoc(collection(db, 'products'), productData);
    }
    setOpen(false);
    setCurrentProduct(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este producto?')) {
      await deleteDoc(doc(db, 'products', id));
    }
  };

  return (
    <Box>
      <Button variant="contained" onClick={() => { setCurrentProduct(null); setOpen(true); }} sx={{ mb: 3 }}>
        + Nuevo Producto
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Activo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(p => (
              <TableRow key={p.id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>${p.pricing?.basePrice}</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell>
                  <Switch checked={p.active} disabled />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => { setCurrentProduct(p); setOpen(true); }}>Editar</Button>
                  <Button size="small" color="error" onClick={() => handleDelete(p.id)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Formulario Producto (completo según estructura) */}
      <ProductFormModal 
        open={open} 
        onClose={() => { setOpen(false); setCurrentProduct(null); }} 
        product={currentProduct} 
        onSave={handleSave} 
      />
    </Box>
  );
};

// Modal Formulario (completo con todos los campos)
const ProductFormModal = ({ open, onClose, product, onSave }) => {
  const [form, setForm] = useState(product || {
    name: '', category: '', description: '', stock: 0, active: true,
    pricing: { basePrice: 0, currency: 'ARS' },
    media: { image: '', video: '' },
    // ... puedes expandir con más campos
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{product ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
      <DialogContent>
        <TextField fullWidth label="Nombre" name="name" value={form.name} onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Categoría" name="category" value={form.category} onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Descripción" name="description" value={form.description} onChange={handleChange} margin="dense" multiline rows={3} />
        <TextField fullWidth label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Precio Base" name="basePrice" type="number" value={form.pricing?.basePrice || ''} 
          onChange={(e) => setForm(prev => ({ ...prev, pricing: { ...prev.pricing, basePrice: Number(e.target.value) } }))} margin="dense" />
        <TextField fullWidth label="Imagen URL" name="image" value={form.media?.image || ''} 
          onChange={(e) => setForm(prev => ({ ...prev, media: { ...prev.media, image: e.target.value } }))} margin="dense" />
        {/* Agrega más campos según necesites */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave(form)} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductManagement;