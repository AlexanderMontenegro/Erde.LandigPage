// src/services/stockService.js
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Obtiene el stock actual de un producto (una sola vez)
 */
export const getStock = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const snapshot = await getDoc(productRef);
    if (snapshot.exists()) {
      return snapshot.data().stock || 0;
    }
    return 0;
  } catch (error) {
    console.error('Error al obtener stock:', error);
    return 0;
  }
};

/**
 * Valida si se puede agregar/actualizar cantidad (usa getStock)
 */
export const validateStock = async (productId, requestedQuantity) => {
  const currentStock = await getStock(productId);

  if (currentStock < requestedQuantity) {
    return {
      valid: false,
      currentStock,
      message: `Solo hay ${currentStock} unidades disponibles.`
    };
  }

  return {
    valid: true,
    currentStock,
    message: ''
  };
};

/**
 * Suscripción en tiempo real al stock de un producto (para carrito)
 * Retorna unsubscribe para limpiar
 */
export const subscribeToStock = (productId, callback) => {
  const productRef = doc(db, 'products', productId);
  return onSnapshot(productRef, (snapshot) => {
    if (snapshot.exists()) {
      const stock = snapshot.data().stock || 0;
      callback(stock);
    } else {
      callback(0);
    }
  });
};