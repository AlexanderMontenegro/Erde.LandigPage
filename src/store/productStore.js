import { create } from "zustand";

const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  isModalOpen: false,
  cartOpen: false,

  cart: [],
  coupon: null,

  setProducts: (products) => set({ products }),

  openModal: (product) =>
    set({
      selectedProduct: product,
      isModalOpen: true,
    }),

  closeModal: () =>
    set({
      selectedProduct: null,
      isModalOpen: false,
    }),

  toggleCart: () =>
    set((state) => ({
      cartOpen: !state.cartOpen,
    })),

  addToCart: (product, selections, price) => {
    const cart = get().cart;

    const newItem = {
      id: Date.now(),
      product,
      selections,
      price,
      qty: 1,
    };

    set({
      cart: [...cart, newItem],
      isModalOpen: false,
    });
  },

  removeFromCart: (id) => {
    set({
      cart: get().cart.filter((i) => i.id !== id),
    });
  },

  updateQty: (id, qty) => {
    set({
      cart: get().cart.map((item) =>
        item.id === id ? { ...item, qty } : item
      ),
    });
  },

  applyCoupon: (code) => {
    if (code === "ERDE10") {
      set({ coupon: { code, discount: 0.1 } });
    } else {
      set({ coupon: null });
    }
  },

  totalPrice: () => {
    const { cart, coupon } = get();

    let total = cart.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    if (coupon) {
      total = total - total * coupon.discount;
    }

    return total;
  },
}));

export default useProductStore;
