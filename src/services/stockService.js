// src/services/stockService.js
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Valida el stock actual de un producto contra la cantidad solicitada
 * @param {string} productId - ID del producto en Firestore
 * @param {number} requestedQuantity - Cantidad que se quiere agregar o actualizar
 * @returns {Promise<{valid: boolean, currentStock: number, message: string}>}
 */
export const validateStock = async (productId, requestedQuantity) => {
  try {
    const productRef = doc(db, 'products', productId);
    const snapshot = await getDoc(productRef);

    if (!snapshot.exists()) {
      return {
        valid: false,
        currentStock: 0,
        message: 'Producto no encontrado en stock'
      };
    }

    const product = snapshot.data();
    const currentStock = product.stock || 0;

    if (currentStock < requestedQuantity) {
      return {
        valid: false,
        currentStock,
        message: `Solo hay ${currentStock} unidades disponibles. No se puede agregar ${requestedQuantity}.`
      };
    }

    return {
      valid: true,
      currentStock,
      message: `Stock disponible: ${currentStock}`
    };
  } catch (error) {
    console.error('Error al validar stock:', error);
    return {
      valid: false,
      currentStock: 0,
      message: 'Error al verificar stock. Intenta nuevamente.'
    };
  }
};