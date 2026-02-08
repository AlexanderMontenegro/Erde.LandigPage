import { create } from 'zustand';
import { getProducts } from '../services/productService.js';

const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  isModalOpen: false,
  cartOpen: false,
  cart: [],
  coupon: null,

  fetchProducts: async () => {
    try {
      const products = await getProducts();
      set({ products });
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },

  openModal: (product) => set({ selectedProduct: product, isModalOpen: true }),
  closeModal: () => set({ selectedProduct: null, isModalOpen: false }),
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),

  addToCart: (product, selections, price) => {
    const newItem = { id: Date.now(), product, selections, price, qty: 1 };
    set({ cart: [...get().cart, newItem], isModalOpen: false });
  },

  removeFromCart: (id) => set({ cart: get().cart.filter(i => i.id !== id) }),
  updateQty: (id, delta) => set({
    cart: get().cart.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)
  }),

  applyCoupon: (code) => {
    if (code === 'ERDE10') {
      set({ coupon: { code, discount: 0.1 } });
    } else {
      set({ coupon: null });
    }
  },

  totalPrice: () => {
    let total = get().cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const coupon = get().coupon;
    if (coupon) total *= (1 - coupon.discount);
    return total.toFixed(2);
  },
}));

export default useProductStore;