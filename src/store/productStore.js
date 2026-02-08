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
  closeModal: () => set({ selectedProduct: null, isModalOpen: false }),

  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),

  addToCart: (product) => {
    set({ cart: [...get().cart, { ...product, qty: 1 }], isModalOpen: false });
  },
}));

export default useProductStore;