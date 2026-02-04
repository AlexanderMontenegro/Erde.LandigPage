import { create } from "zustand"

export const useCartStore = create((set) => ({
  cart: [],

  addToCart: (product, variants, finalPrice) =>
    set((state) => ({
      cart: [
        ...state.cart,
        {
          id: Date.now(),
          productId: product.id,
          name: product.name,
          image: product.image,
          variants,
          price: finalPrice,
          qty: 1,
        },
      ],
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}))
