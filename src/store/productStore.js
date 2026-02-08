import { create } from 'zustand';
import { getProducts } from '../services/productService.js';

const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  isModalOpen: false,
  cart: [],           // array de items con { id, name, image, basePrice, qty, ... }
  cartOpen: false,

  fetchProducts: async () => {
    const products = await getProducts();
    set({ products });
  },

  openModal: (product) => set({ selectedProduct: product, isModalOpen: true }),
  closeModal: () => set({ selectedProduct: null, isModalOpen: false }),

  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),

  addToCart: (product, quantity = 1) => {
    const itemToAdd = {
      id: product.id,
      name: product.name,
      image: product.image,
      basePrice: product.basePrice,
      qty: quantity,
    };

    const existingItemIndex = get().cart.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
      // Ya existe → aumentar cantidad
      const updatedCart = [...get().cart];
      updatedCart[existingItemIndex].qty += quantity;
      set({ cart: updatedCart });
    } else {
      // Nuevo item
      set({ cart: [...get().cart, itemToAdd] });
    }

    // Opcional: cerrar modal después de agregar
    set({ isModalOpen: false });
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item.id !== productId) });
  },

  updateQty: (productId, newQty) => {
    if (newQty < 1) return;
    set({
      cart: get().cart.map(item =>
        item.id === productId ? { ...item, qty: newQty } : item
      )
    });
  },

  clearCart: () => set({ cart: [] }),

  getTotalItems: () => get().cart.reduce((sum, item) => sum + item.qty, 0),

  getTotalPrice: () => {
    return get().cart.reduce((sum, item) => sum + (item.basePrice * item.qty), 0);
  },
}));

export default useProductStore;