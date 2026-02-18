import { create } from 'zustand';
import { getProducts } from '../services/productService.js';

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

  addToCart: (product, quantity = 1) => {
    console.log('Agregando al carrito:', product.name, 'x' + quantity);
    
    const existingIndex = get().cart.findIndex(item => item.id === product.id);
    
    if (existingIndex !== -1) {
      const updatedCart = [...get().cart];
      updatedCart[existingIndex].qty += quantity;
      set({ cart: updatedCart });
    } else {
      set({
        cart: [...get().cart, {
          id: product.id,
          name: product.name,
          image: product.image,
          basePrice: product.basePrice,
          qty: quantity,
        }]
      });
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter(item => item.id !== id) });
  },

  updateQty: (id, delta) => {
    set({
      cart: get().cart.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    });
  },

  getTotalItems: () => get().cart.reduce((sum, item) => sum + item.qty, 0),

  getTotalPrice: () => get().cart.reduce((sum, item) => sum + (item.basePrice * item.qty), 0).toFixed(0),
}));

export default useProductStore;