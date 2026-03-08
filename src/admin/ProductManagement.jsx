import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, Switch, Typography, Box, FormControlLabel 
} from '@mui/material';
import { db } from '../config/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

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
              <TableCell>Destacado (Ofertas)</TableCell>
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
                  <Switch checked={p.active || false} disabled />
                </TableCell>
                <TableCell>
                  <Switch 
                    checked={p.featured || false} 
                    onChange={async (e) => {
                      await updateDoc(doc(db, 'products', p.id), { featured: e.target.checked });
                    }}
                  />
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

      {/* Modal Formulario Producto */}
      <ProductFormModal 
        open={open} 
        onClose={() => { setOpen(false); setCurrentProduct(null); }} 
        product={currentProduct} 
        onSave={handleSave} 
      />
    </Box>
  );
};

const ProductFormModal = ({ open, onClose, product, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    stock: 0,
    active: true,
    featured: false,
    pricing: { basePrice: 0, currency: 'ARS' },
    media: { image: '', video: '' },
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || '',
        description: product.description || '',
        stock: product.stock || 0,
        active: product.active !== false,
        featured: product.featured || false,
        pricing: {
          basePrice: product.pricing?.basePrice || 0,
          currency: product.pricing?.currency || 'ARS'
        },
        media: {
          image: product.media?.image || '',
          video: product.media?.video || ''
        },
      });
    } else {
      setForm({
        name: '',
        category: '',
        description: '',
        stock: 0,
        active: true,
        featured: false,
        pricing: { basePrice: 0, currency: 'ARS' },
        media: { image: '', video: '' },
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm(prev => {
      if (type === 'checkbox') {
        return { ...prev, [name]: checked };
      }
      if (name === 'basePrice') {
        return { ...prev, pricing: { ...prev.pricing, basePrice: Number(value) || 0 } };
      }
      if (name === 'image') {
        return { ...prev, media: { ...prev.media, image: value } };
      }
      if (name === 'video') {
        return { ...prev, media: { ...prev.media, video: value } };
      }
      return { ...prev, [name]: value };
    });
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
          onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Imagen URL" name="image" value={form.media?.image || ''} onChange={handleChange} margin="dense" />
        <TextField fullWidth label="Video URL (opcional)" name="video" value={form.media?.video || ''} onChange={handleChange} margin="dense" />
        
        <FormControlLabel
          control={<Switch checked={form.active} onChange={handleChange} name="active" />}
          label="Producto activo"
          sx={{ mt: 2, display: 'block' }}
        />

        <FormControlLabel
          control={<Switch checked={form.featured} onChange={handleChange} name="featured" />}
          label="Destacado en Ofertas"
          sx={{ mt: 1, display: 'block' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onSave(form)} variant="contained">Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductManagement;