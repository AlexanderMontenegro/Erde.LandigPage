import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Sin nombre',
        description: data.details?.description || 'Sin descripción',
        basePrice: data.pricing?.basePrice || 0,
        image: data.media?.image || 'https://via.placeholder.com/300?text=Sin+Imagen',
        stock: data.stock || 0,
        category: data.category || '',
        customizable: data.details?.customizable || false,
        featured: data.details?.featured || false,
        fabricationTimeDays: data.details?.fabricationTimeDays || '',
        currency: data.pricing?.currency || 'ARS',
        // Si en futuro agregas variants, se incluirá aquí automáticamente
        variants: data.variants || {},
        // Otros campos que quieras exponer
      };
    });
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    return [];
  }
};