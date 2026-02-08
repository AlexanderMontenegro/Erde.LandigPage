import { create } from 'zustand';
import { getProducts } from '../services/productService.js';

const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  isModalOpen: false,
  cart: [],
  cartOpen: false,

  fetchProducts: async () => {
    const products = await getProducts();
    set({ products });
  },

  openModal: (product) => set({ selectedProduct: product, isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),

  toggleCart: () => set(state => ({ cartOpen: !state.cartOpen })),

  addToCart: (product, qty = 1) => {
    const existing = get().cart.find(item => item.id === product.id);
    if (existing) {
      set({
        cart: get().cart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        )
      });
    } else {
      set({ cart: [...get().cart, { ...product, qty }] });
    }
    set({ isModalOpen: false });
  },

  removeFromCart: (id) => set({ cart: get().cart.filter(item => item.id !== id) }),

  updateQty: (id, delta) => {
    set({
      cart: get().cart.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    });
  },

  totalItems: () => get().cart.reduce((acc, item) => acc + item.qty, 0),

  totalPrice: () => {
    return get().cart.reduce((acc, item) => acc + item.basePrice * item.qty, 0).toFixed(0);
  },
}));

export default useProductStore;