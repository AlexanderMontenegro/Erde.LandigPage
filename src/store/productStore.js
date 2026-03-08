import { create } from 'zustand';
import { getProducts } from '../services/productService.js';
import { validateStock } from '../services/stockService.js'; 
import { toast } from 'react-toastify';

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
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  },

  openModal: (product) => {
    set({ selectedProduct: product, isModalOpen: true });
  },

  closeModal: () => {
    set({ selectedProduct: null, isModalOpen: false });
  },

  toggleCart: () => set(state => ({ cartOpen: !state.cartOpen })),

  addToCart: async (product, quantity = 1) => {
    const requestedQty = Number(quantity);

    const validation = await validateStock(product.id, requestedQty);
    if (!validation.valid) {
      toast.error(validation.message, { position: "top-right", autoClose: 4000 });
      return;
    }

    
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

    toast.success(`${product.name} agregado al carrito!`, { position: "top-right" });
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter(item => item.id !== id) });
  },

  updateQuantity: async (id, newQuantity) => {
    const requestedQty = Math.max(1, Number(newQuantity));

    const productInCart = get().cart.find(item => item.id === id);
    if (!productInCart) return;

    const validation = await validateStock(id, requestedQty);
    if (!validation.valid) {
      toast.error(validation.message, { position: "top-right", autoClose: 4000 });
      return;
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