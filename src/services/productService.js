import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const getProducts = async () => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || 'Sin nombre',
      category: data.category || 'Sin categoría',
      description: data.description || 'Sin descripción disponible', 
      basePrice: data.pricing?.basePrice || 0,
      currency: data.pricing?.currency || 'ARS',
      stock: Number(data.stock) || 0,               
      image: data.media?.image || data.image || 'https://via.placeholder.com/600?text=Sin+Imagen',
      video: data.media?.video || '',               // ← AGREGADO: video
      // Puedes agregar más si los necesitas después (active, customizable, etc.)
      active: data.active ?? true,
      customizable: data.customizable ?? false,
      fabricationTimeDays: data.fabricationTimeDays || 0,
      featured: data.featured ?? false,
    };
  });
};