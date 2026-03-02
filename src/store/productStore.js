import { create } from 'zustand';
import { getProducts } from '../services/productService.js';
import { validateStock } from '../services/stockService.js';   // ← NUEVO

const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  isModalOpen: false,
  cart: [],           
  cartOpen: false,

  fetchProducts: async () => {
    try {
      const products = await getProducts();
      set({ products });
      console.log('Productos cargados:', products);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  },

  openModal: (product) => {
    console.log('openModal llamado con:', product);
    set({ selectedProduct: product, isModalOpen: true });
  },

  closeModal: () => {
    console.log('closeModal llamado');
    set({ selectedProduct: null, isModalOpen: false });
  },

  toggleCart: () => set(state => ({ cartOpen: !state.cartOpen })),

  // ==================== MODIFICACIÓN MÍNIMA ====================
  addToCart: async (product, quantity = 1) => {
    const requestedQty = Number(quantity);

    // Validación de stock antes de agregar
    const validation = await validateStock(product.id, requestedQty);
    
    if (!validation.valid) {
      alert(validation.message);
      return; // ← No agrega al carrito
    }

    console.log('Agregando al carrito:', product.name, 'x' + requestedQty);
    
    const existingIndex = get().cart.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
      const updatedCart = [...get().cart];
      updatedCart[existingIndex].quantity += requestedQty;
      set({ cart: updatedCart });
    } else {
      set({
        cart: [...get().cart, {
          id: product.id,
          name: product.name,
          image: product.image,
          basePrice: product.basePrice,
          quantity: requestedQty,
        }]
      });
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter(item => item.id !== id) });
  },

  // ==================== MODIFICACIÓN MÍNIMA ====================
  updateQuantity: async (id, newQuantity) => {
    const requestedQty = Math.max(1, Number(newQuantity));

    // Validación de stock al aumentar cantidad
    const productInCart = get().cart.find(item => item.id === id);
    if (!productInCart) return;

    const validation = await validateStock(id, requestedQty);
    
    if (!validation.valid) {
      alert(validation.message);
      return; // ← No actualiza cantidad
    }

    set({
      cart: get().cart.map(item =>
        item.id === id ? { ...item, quantity: requestedQty } : item
      )
    });
  },

  totalItems: () => get().cart.reduce((sum, item) => sum + (item.quantity || 0), 0),

  total: () => get().cart.reduce((sum, item) => {
    const price = Number(item.basePrice) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + (price * qty);
  }, 0),
}));

export default useProductStore;