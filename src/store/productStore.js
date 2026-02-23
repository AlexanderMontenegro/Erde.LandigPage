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
    const qty = Math.max(1, Number(quantity) || 1); // nunca menor a 1 ni NaN/null

    console.log('Agregando al carrito:', product.name, 'x' + qty);

    const existingIndex = get().cart.findIndex(item => item.id === product.id);

    if (existingIndex !== -1) {
      // Incrementar cantidad existente
      const updatedCart = [...get().cart];
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: updatedCart[existingIndex].quantity + qty
      };
      set({ cart: updatedCart });
    } else {
      // Agregar nuevo producto con quantity como número
      set({
        cart: [...get().cart, {
          id: product.id,
          name: product.name,
          image: product.image,
          basePrice: Number(product.basePrice) || 0, // protección extra
          quantity: qty,  // siempre número entero ≥1
        }]
      });
    }
  },

  removeFromCart: (id) => {
    set({ cart: get().cart.filter(item => item.id !== id) });
  },

  updateQuantity: (id, newQuantity) => {
    const qty = Math.max(1, Number(newQuantity) || 1); // nunca <1, nunca NaN/null

    set({
      cart: get().cart.map(item =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    });
  },

  // Cantidad total de items (para badge, etc.)
  totalItems: () => get().cart.reduce((sum, item) => sum + (item.quantity || 0), 0),

  // Total del precio (usar como total() en componentes)
  total: () => get().cart.reduce((sum, item) => {
    const price = Number(item.basePrice) || 0;
    const qty = Number(item.quantity) || 1;
    return sum + (price * qty);
  }, 0),
}));

export default useProductStore;